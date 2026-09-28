import {it,expect,beforeEach,afterEach,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {extractPythonCalls} from '../src/python-calls.js';
import {extractAxiosCalls,extractJavascriptHttpCalls} from '../src/axios-calls.js';
import {runCli} from '../src/cli-command.js';

it.each([
  'import httpx\nhttpx.get("https://api.test/users", params={"q":None})',
  'import httpx as h\nh.request("post", "https://api.test/users")',
  'import requests\nrequests.Session().get("https://api.test/users?q=a")',
  'import requests as r\ns = r.Session()\ns.get("https://api.test/users", params={"q":"a"})\ns.close()',
  'import requests\nwith requests.Session() as s:\n s.get("https://api.test/users?q=a")',
  'import httpx\ndef run():\n c = httpx.Client()\n c.get("https://api.test/users?q=a")',
  'import httpx\nwith httpx.Client() as c:\n c.get("https://api.test/users?q=a")',
])('supports direct HTTPX and fresh Python sessions: %s',source=>{
  const result=extractPythonCalls(source);expect(result.issues).toEqual([]);expect(result.calls).toHaveLength(1);expect(result.calls[0]!.reason).toBeUndefined();
});
it('preserves different Requests/HTTPX None query serialization',()=>{
  const code=(library:string)=>`import ${library}\n${library}.get("https://api.test/users", params={"q":None})`;
  expect(extractPythonCalls(code('requests')).calls[0]!.queryNames).toEqual([]);
  expect(extractPythonCalls(code('httpx')).calls[0]!.queryNames).toEqual(['q']);
});
it.each([
  'import httpx\nc = httpx.Client(base_url="https://api.test")\nc.get("/users")',
  'import requests\ns = requests.Session()\ns.params = {"q":"a"}\ns.get("https://api.test/users")',
  'import requests\ns = requests.Session()\ns = other\ns.get("https://api.test/users")',
  'import requests\ns = requests.Session()\npass_elsewhere(s)\ns.get("https://api.test/users")',
  'import requests\ns = requests.Session()\ndef run():\n s.get("https://api.test/users")',
  'import httpx\nhttpx.get("https://api.test/users", {"q":"a"})',
  'import httpx\nhttpx.get("https://api.test/users", json={"a":1})',
  'import httpx\nhttpx.AsyncClient().get("https://api.test/users")',
])('keeps configured or unsupported Python clients unresolved: %s',source=>{
  const result=extractPythonCalls(source);expect(result.calls.length).toBeGreaterThan(0);expect(result.calls.some(call=>call.reason)).toBe(true);
});
it.each([
  ['axios.get("https://api.test/users", {params:{q:"a", absent:null}});','GET',['q']],
  ['axios.post("https://api.test/users", data);','POST',undefined],
  ['axios("https://api.test/users", {method:"patch"});','PATCH',undefined],
  ['axios({url:"https://api.test/users", params:{q:true}});','GET',['q']],
  ['axios.request({method:"delete", url:"https://api.test/users"});','DELETE',undefined],
] as const)('supports Axios direct literal calls: %s',(body,method,query)=>{
  const result=extractAxiosCalls('import axios from "axios";\n'+body);expect(result.issues).toEqual([]);
  expect(result.calls).toHaveLength(1);expect(result.calls[0]!.method).toBe(method);expect(result.calls[0]!.reason).toBeUndefined();expect(result.calls[0]!.queryNames).toEqual(query);
});
it('supports Axios import aliases and typed calls alongside fetch',()=>{
  const result=extractJavascriptHttpCalls('import api from "axios";\napi.get<User>("https://api.test/users" as const, {params:{q:"a"}});\nfetch("https://api.test/users?q=a");','client.ts');
  expect(result.issues).toEqual([]);expect(result.calls).toHaveLength(2);expect(result.calls.every(call=>!call.reason)).toBe(true);
});
it.each([
  ['axios.get(url);','dynamic-url'],
  ['axios.get("https://api.test/users", options);','unsupported-or-dynamic-axios-config'],
  ['axios.get("https://api.test/users", {...options});','unsupported-or-dynamic-axios-config'],
  ['axios.get("https://api.test/users", {baseURL:"https://other.test"});','unsupported-or-dynamic-axios-config'],
  ['axios.get("https://api.test/users", {paramsSerializer:custom});','unsupported-or-dynamic-axios-config'],
  ['axios.get("https://api.test/users", {params:{q:value}});','dynamic-query-parameters'],
  ['axios.get("https://api.test/users", {method:"post"});','unsupported-axios-config-override'],
  ['axios.create({baseURL:"https://api.test"});','unsupported-axios-operation'],
  ['axios.defaults.baseURL="https://api.test"; axios.get("https://api.test/users");','axios-binding-or-configuration-unresolved'],
  ['const a=axios; axios.get("https://api.test/users");','axios-binding-or-configuration-unresolved'],
])('does not assume Axios runtime config: %s',(body,reason)=>expect(extractAxiosCalls('import axios from "axios";\n'+body).calls[0]!.reason).toBe(reason));
it('ignores Axios strings/comments and discloses CommonJS imports',()=>{
  expect(extractAxiosCalls('// axios.get("x")\nconst s="axios.get(fake)";').calls).toEqual([]);
  expect(extractAxiosCalls('const client=require("axios"); client.get("x");').issues).toContain('unsupported-axios-import');
  expect(extractAxiosCalls('import axios from "axios"; axios.get(').issues).toContain('unsupported-or-invalid-javascript');
});
it('caps combined fetch and Axios extraction',()=>{
  const result=extractJavascriptHttpCalls('import axios from "axios";\n'+('axios.get("https://api.test/users");\nfetch("https://api.test/users");\n').repeat(80),'client.js');
  expect(result.calls).toHaveLength(128);expect(result.issues).toContain('call-count-limit');
});

let root:string;
beforeEach(async()=>{
  root=await fs.mkdtemp(join(tmpdir(),'shipcheck-extra-clients-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));
  await fs.writeFile(join(root,'api.json'),JSON.stringify({openapi:'3.1.0',info:{title:'API',version:'1'},paths:{'/users':{get:{parameters:[{name:'q',in:'query',required:true,schema:{type:'string'}}]}}}}));
});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
it.each([
  ['js',(url:string)=>`import axios from "axios"; axios.get("${url}", {params:{q:"a"}});`],
  ['ts',(url:string)=>`import axios from "axios"; axios.get<User>("${url}", {params:{q:"a"}});`],
  ['py',(url:string)=>`import httpx\nwith httpx.Client() as c:\n c.get("${url}", params={"q":None})`],
] as const)('compares %s new client calls offline through the CLI',async(ext,source)=>{
  const path='client.'+ext;
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify({resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[{id:'client',resourceId:'api',baseUrl:'https://api.test',files:[path]}]}));
  for(const [url,exit,status] of [['https://api.test/users',0,'matched'],['https://api.test/missing',1,'mismatch']] as const){
    await fs.writeFile(join(root,path),source(url));const result=await runCli(['audit',root,'--json']);expect(result.exitCode).toBe(exit);expect(JSON.parse(result.stdout).contracts[0].calls[0].status).toBe(status);
  }
  expect(fetch).not.toHaveBeenCalled();
});
