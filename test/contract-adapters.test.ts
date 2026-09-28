import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {contractAdapterFor} from '../src/contract-adapters.js';
import {extractPythonCalls} from '../src/python-calls.js';
import {extractFetchCalls} from '../src/fetch-calls.js';
import {auditContracts} from '../src/contract-audit.js';
import {runCli} from '../src/cli-command.js';
import type {ConfigInput} from '../src/config.js';

let root:string;
const binding={id:'clients',resourceId:'api',baseUrl:'https://api.test',files:['client.ts','client.py']};
const config:ConfigInput={resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[binding]};
beforeEach(async()=>{
  root=await fs.mkdtemp(join(tmpdir(),'shipcheck-adapters-'));
  vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Network forbidden');}));
  await fs.writeFile(join(root,'api.json'),JSON.stringify({openapi:'3.1.0',info:{title:'API',version:'1'},paths:{'/users':{get:{parameters:[{name:'q',in:'query',required:true,schema:{type:'string'}}]}},'/users/{id}':{delete:{}},'/items':{post:{}}}}));
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify(config));
});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});

it.each(['.ts','.mts','.cts','.tsx'])('selects TypeScript %s and extracts typed direct fetch calls',ext=>{
  const adapter=contractAdapterFor('client'+ext)!;expect(adapter.id).toBe('typescript-http');
  const result=adapter.extract('const response: Promise<Response> = fetch("https://api.test/users?q=a" as const, {method: "GET" as const} satisfies RequestInit);','client'+ext);
  expect(result.issues).toEqual([]);expect(result.calls[0]).toMatchObject({method:'GET',url:'https://api.test/users?q=a',line:1});
});
it('parses TSX without mistaking JSX text, comments or strings for executed calls',()=>{
  const result=extractFetchCalls('const C = () => <div>fetch("fake")</div>;\n// fetch("fake")\nconst s: string = "fetch(fake)";\nfetch("https://api.test/items", {method: "POST"});','tsx');
  expect(result.issues).toEqual([]);expect(result.calls).toHaveLength(1);expect(result.calls[0]!.line).toBe(4);
});
it('rejects broken TypeScript and does not infer imported/shadowed fetch semantics',()=>{
  expect(extractFetchCalls('const x: = ;','typescript').issues).toContain('unsupported-or-invalid-typescript');
  for(const source of ['import fetch from "custom"; fetch("https://api.test/items");','function run(fetch: Function) {fetch("https://api.test/items");}'])
    expect(extractFetchCalls(source,'typescript').calls[0]!.reason).toBe('fetch-binding-or-alias-unresolved');
});
it.each([
  ['import requests\nrequests.get("https://api.test/users", params={"q":"yes"})','GET','https://api.test/users',['q']],
  ['import requests as r\nr.request(method="post", url="https://api.test/items", json={"a": value})','POST','https://api.test/items',undefined],
  ['import requests as http\nhttp.post("https://api.test/items")','POST','https://api.test/items',undefined],
  ['import requests\nrequests.delete(url="https://api.test/users/12")','DELETE','https://api.test/users/12',undefined],
  ['import requests\nrequests.get("https://api.test/users", {"q":True,"absent":None,"count":2})','GET','https://api.test/users',['q','count']],
  ['import requests\nrequests.get("https://api.test/users", params={"q":"yes","q":None})','GET','https://api.test/users',[]],
])('extracts Python Requests syntax: %s',(source,method,url,queryNames)=>{
  const result=extractPythonCalls(source);expect(result.issues).toEqual([]);expect(result.calls).toHaveLength(1);
  expect(result.calls[0]).toMatchObject({method,url});expect(result.calls[0]!.queryNames).toEqual(queryNames);expect(result.calls[0]!.reason).toBeUndefined();
});
it.each([
  ['requests.get("https://api.test/items")','requests-binding-or-alias-unresolved'],
  ['import requests\nrequests = custom\nrequests.get("https://api.test/items")','requests-binding-or-alias-unresolved'],
  ['import requests\ndef run(requests):\n requests.get("https://api.test/items")','requests-binding-or-alias-unresolved'],
  ['import requests\nrequests.get = custom\nrequests.get("https://api.test/items")','requests-binding-or-alias-unresolved'],
  ['import requests\nrequests.get(url)','dynamic-url'],
  ['import requests\nrequests.get(f"https://api.test/{name}")','dynamic-url'],
  ['import requests\nrequests.get("https://api.test/" + "items")','dynamic-url'],
  ['import requests\nrequests.get("https://api.test/" "items")','dynamic-url'],
  ['import requests\nrequests.get(r"https://api.test/items")','dynamic-url'],
  ['import requests\nrequests.get("https://api.test/\\x69tems")','dynamic-url'],
  ['import requests\nrequests.request(method, "https://api.test/items")','dynamic-method'],
  ['import requests\nrequests.get("https://api.test/items", **options)','unsupported-or-dynamic-arguments'],
  ['import requests\nrequests.get("https://api.test/items", url="https://api.test/other")','unsupported-or-dynamic-arguments'],
  ['import requests\nrequests.get("https://api.test/items", params={"q": value})','dynamic-query-parameters'],
  ['import requests\nrequests.get("https://api.test/items", params={**values})','dynamic-query-parameters'],
  ['import requests\nrequests.get("https://api.test/items", params=values)','dynamic-query-parameters'],
  ['import requests\nrequests.get("https://api.test/a b")','unsupported-url-shape'],
  ['import requests\nrequests.Session(options).get("https://api.test/items")','requests-binding-or-alias-unresolved'],
])('discloses unresolved Python pattern: %s',(source,reason)=>{
  expect(extractPythonCalls(source).calls[0]!.reason).toBe(reason);
});
it('does not extract Python comments/docstrings; rejects parser recovery and unsupported imports',()=>{
  expect(extractPythonCalls('# requests.get("x")\n"""requests.get("x")"""').calls).toEqual([]);
  expect(extractPythonCalls('import requests\nrequests.get(').issues).toContain('unsupported-or-invalid-python');
  expect(extractPythonCalls('from requests import get\nget("x")').issues).toContain('unsupported-requests-import');
  expect(extractPythonCalls('import aiohttp\naiohttp.get("x")').issues).toContain('unsupported-python-http-client');
});
it('bounds Python extraction',()=>{
  expect(extractPythonCalls('import requests\n'+'requests.get("x")\n'.repeat(129)).issues).toContain('call-count-limit');
  expect(extractPythonCalls('import requests\nrequests.get("'+'x'.repeat(2048)+'")').issues).toContain('source-excerpt-limit');
});
it('compares mixed-language clients offline with hashes and query-name evidence',async()=>{
  await fs.writeFile(join(root,'client.ts'),'const response: Promise<Response> = fetch("https://api.test/users?q=ok");');
  await fs.writeFile(join(root,'client.py'),'import requests as r\nr.get("https://api.test/users", params={"q":"ok"})\nr.delete("https://api.test/users/1")\nr.get("https://api.test/wrong")\nr.post("https://api.test/users")\nr.get("https://api.test/users", params={"q":None})');
  const report=(await auditContracts(root,config))[0]!;
  expect(report.state).toBe('checked');expect(report.scope).toBe('literal-http-calls-only');
  expect(report.calls.map(c=>c.status)).toEqual(['matched','matched','matched','mismatch','mismatch','mismatch']);
  expect(report.files.map(f=>f.adapter)).toEqual(['typescript-http','python-http']);
  expect(report.files.map(f=>f.callCount)).toEqual([1,5]);
  expect(report.calls[1]!.queryNames).toEqual(['q']);expect(report.calls[1]!.adapter).toBe('python-http');
  expect(report.calls[5]!.contractPointers).toEqual(['/paths/~1users/get/parameters/0']);
  expect(report.files.every(f=>/^[a-f0-9]{64}$/.test(f.sha256!))).toBe(true);
  expect(fetch).not.toHaveBeenCalled();
});
it('reports zero extracted calls and unsupported languages as incomplete instead of passing',async()=>{
  await fs.writeFile(join(root,'client.ts'),'export const answer: number = 42;');
  await fs.writeFile(join(root,'client.py'),'import aiohttp\naiohttp.get("https://api.test/users")');
  const result=await runCli(['audit',root,'--json']);expect(result.exitCode).toBe(2);
  expect(JSON.parse(result.stdout).contracts[0].files.every((f:{status:string})=>f.status==='no-supported-calls')).toBe(true);
  await fs.writeFile(join(root,'client.rb'),'puts 1');
  const report=(await auditContracts(root,{...config,contracts:[{...binding,files:['client.rb']}]}))[0]!;
  expect(report.state).toBe('partial');expect(report.files[0]!.status).toBe('unsupported-language');
});
it('retains path scope/exclusion boundaries and mixed-language CLI exit codes',async()=>{
  await fs.writeFile(join(root,'client.ts'),'fetch("https://api.test/items", {method:"POST"});');
  await fs.writeFile(join(root,'client.py'),'import requests\nrequests.post("https://api.test/items")');
  expect((await runCli(['audit',root])).stdout).toContain('Adapter: python-http; language: python; extracted calls: 1');
  expect((await runCli(['audit',root,'--json'])).exitCode).toBe(0);
  await fs.writeFile(join(root,'client.py'),'import requests\nrequests.post("https://api.test/missing")');
  expect((await runCli(['audit',root,'--json'])).exitCode).toBe(1);
  const scoped=(await auditContracts(root,config,['client.ts']))[0]!;expect(scoped.files).toHaveLength(1);expect(scoped.state).toBe('checked');
  const excluded=(await auditContracts(root,{...config,exclude:['client.py']}))[0]!;expect(excluded.files[1]!.status).toBe('excluded');expect(excluded.state).toBe('partial');
  await fs.writeFile(join(root,'client.py'),'import requests\nrequests.get(url)');
  expect((await runCli(['audit',root,'--markdown'])).exitCode).toBe(2);
});
it('keeps optional AI context separate and does not write sources or clear unsupported coverage',async()=>{
  const source='import aiohttp\naiohttp.get("https://api.test/items")';
  await fs.writeFile(join(root,'client.py'),source);
  await fs.writeFile(join(root,'client.ts'),'fetch("https://api.test/items", {method:"POST"});');
  const before=await fs.readdir(root);
  const result=await runCli(['audit',root,'--ai','preview','--json']);
  const report=JSON.parse(result.stdout);
  expect(result.exitCode).toBe(2);expect(report.contracts[0].state).toBe('partial');
  expect(report.ai.preview.files.some((file:{path:string})=>file.path==='client.py')).toBe(true);
  expect(await fs.readFile(join(root,'client.py'),'utf8')).toBe(source);
  expect(await fs.readdir(root)).toEqual(before);expect(fetch).not.toHaveBeenCalled();
});
it.each([
  ['fetch("https://api.test/missing" as const);','mismatch'],
  ['fetch("https://api.test/users", {method:"POST"} satisfies RequestInit);','mismatch'],
  ['fetch("https://api.test/users");','mismatch'],
  ['const url: string = "https://api.test/users"; fetch(url);','unresolved'],
])('checks TypeScript defect and unsupported controls: %s',async(source,status)=>{
  await fs.writeFile(join(root,'client.ts'),source);
  const result=(await auditContracts(root,config,['client.ts']))[0]!;
  expect(result.calls[0]!.status).toBe(status);
  expect(result.state).toBe(status==='unresolved'?'partial':'checked');
});
it('audits the distributed multilingual example without runtime dependencies',async()=>{
  const result=await runCli(['audit','fixtures/contracts','--json']);
  expect(result.exitCode).toBe(0);
  const report=JSON.parse(result.stdout);expect(report.contracts[0].calls.map((c:{status:string})=>c.status)).toEqual(['matched','matched','matched']);
  expect(fetch).not.toHaveBeenCalled();
});
