import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {extractGoCalls} from '../src/go-http-calls.js';
import {extractCsharpCalls} from '../src/csharp-http-calls.js';
import {extractJavaCalls} from '../src/java-http-calls.js';
import {runCli} from '../src/cli-command.js';
import {auditContracts} from '../src/contract-audit.js';
import {contractAdapterFor} from '../src/contract-adapters.js';
import type {ConfigInput} from '../src/config.js';

const go=(body:string)=>`package main\nimport h "net/http"\nfunc run() {\n${body}\n}`;
const cs=(body:string)=>`using System.Net.Http;\nclass C { void Run() {\n${body}\n} }`;
const java=(body:string)=>`import java.net.URI;\nimport java.net.http.HttpRequest;\nclass C { void run() {\n${body}\n} }`;
const chain=(uri:string,verb='GET')=>`HttpRequest.newBuilder(URI.create("${uri}")).${verb}().build();`;
it('extracts Go net/http verbs, import aliases, method constants and constructors',()=>{
  const result=extractGoCalls(go('h.Get("https://api.test/users?q=a")\nh.Head(`https://api.test/users`)\nh.Post("https://api.test/users", "application/json", body)\nh.NewRequest(h.MethodDelete, "https://api.test/users/1", nil)\nh.NewRequestWithContext(ctx, "", "https://api.test/users", nil)'));
  expect(result.issues).toEqual([]);expect(result.calls.map(c=>c.method)).toEqual(['GET','HEAD','POST','DELETE','GET']);
  expect(result.calls.every(c=>!c.reason)).toBe(true);expect(result.calls[3]!.observationKind).toBe('request-construction');expect(result.calls[0]!.line).toBe(4);
});
it.each([
  ['h.Get(url)','dynamic-or-unsupported-url'],
  ['h.NewRequest(method, "https://api.test/users", nil)','dynamic-method'],
  ['h.NewRequest(h.constructor, "https://api.test/users", nil)','dynamic-method'],
  ['h.DefaultClient.Get("https://api.test/users")','net-http-binding-or-client-unresolved'],
  ['h.Get("https://api.test/a/../users")','unsupported-url-shape'],
  ['h.Get("https://api.test/users", extra)','unsupported-arguments'],
  ['h := custom; h.Get("https://api.test/users")','net-http-binding-or-client-unresolved'],
])('reports unsupported Go syntax: %s',(body,reason)=>expect(extractGoCalls(go(body)).calls[0]!.reason).toBe(reason));
it('discloses Go import and syntax failures and ignores comment/string lookalikes',()=>{
  expect(extractGoCalls('package main\nimport . "net/http"\nfunc f(){Get("x")}').issues).toContain('unsupported-net-http-import');
  expect(extractGoCalls(go('h.Get(')).issues).toContain('unsupported-or-invalid-go');
  expect(extractGoCalls(go('// h.Get("x")\ns := `h.Get("x")`')).calls).toEqual([]);
});
it('preserves non-ASCII/CRLF citation lines and discloses CR-only source',()=>{
  const source=go('// π is not an API call\nh.Get("https://api.test/users")').replace(/\n/g,'\r\n');
  const call=extractGoCalls(source).calls[0]!;expect(call.line).toBe(5);expect(call.excerpt).toBe('h.Get("https://api.test/users")');
  expect(extractGoCalls(source.replace(/\r\n/g,'\r')).issues).toContain('unsupported-line-endings');
});
it('extracts C# fresh local and inline HttpClient methods',()=>{
  const result=extractCsharpCalls(cs('using var client = new HttpClient();\nclient.GetAsync("https://api.test/users?q=a");\nclient.PostAsync("https://api.test/users", body);\nnew System.Net.Http.HttpClient().DeleteAsync(@"https://api.test/users/1");'));
  expect(result.issues).toEqual([]);expect(result.calls.map(c=>c.method)).toEqual(['GET','POST','DELETE']);expect(result.calls.every(c=>!c.reason)).toBe(true);
});
it.each([
  ['new HttpClient().GetAsync(url);','dynamic-or-unsupported-url'],
  ['new HttpClient(handler).GetAsync("https://api.test/users");','httpclient-binding-or-configuration-unresolved'],
  ['new HttpClient {BaseAddress = baseUri}.GetAsync("https://api.test/users");','httpclient-binding-or-configuration-unresolved'],
  ['var c = new HttpClient(); c = other; c.GetAsync("https://api.test/users");','httpclient-binding-or-configuration-unresolved'],
  ['var c = new HttpClient(); c.BaseAddress = baseUri; c.GetAsync("https://api.test/users");','httpclient-binding-or-configuration-unresolved'],
  ['var c = new HttpClient(); Pass(c); c.GetAsync("https://api.test/users");','httpclient-binding-or-configuration-unresolved'],
  ['new HttpClient().GetAsync(requestUri: "https://api.test/users");','unsupported-arguments'],
  ['new HttpClient().SendAsync(request);','unsupported-httpclient-operation'],
])('reports unsupported C# syntax: %s',(body,reason)=>expect(extractCsharpCalls(cs(body)).calls[0]!.reason).toBe(reason));
it('rejects C# parser recovery and conditional compilation and ignores strings/comments',()=>{
  expect(extractCsharpCalls(cs('new HttpClient().GetAsync(')).issues).toContain('unsupported-or-invalid-csharp');
  expect(extractCsharpCalls(cs('#if FEATURE\nnew HttpClient().GetAsync("x");\n#endif')).issues).toContain('conditional-compilation-unresolved');
  expect(extractCsharpCalls(cs('// new HttpClient().GetAsync("x");\nvar s = "GetAsync(fake)";')).calls).toEqual([]);
  const shadow=extractCsharpCalls(cs('new HttpClient().GetAsync("x");')+' class HttpClient {}');expect(shadow.calls[0]!.reason).toBe('httpclient-binding-or-configuration-unresolved');
});
it('extracts Java complete request builders with defaults, URI setters and custom methods',()=>{
  const result=extractJavaCalls(java('HttpRequest.newBuilder(URI.create("https://api.test/users?q=a")).build();\nHttpRequest.newBuilder().uri(new URI("https://api.test/users/1")).method("DELETE", body).header("X-Test","yes").build();'));
  expect(result.issues).toEqual([]);expect(result.calls.map(c=>c.method)).toEqual(['GET','DELETE']);expect(result.calls.every(c=>!c.reason && c.observationKind==='request-construction')).toBe(true);
});
it.each([
  ['HttpRequest.newBuilder(URI.create(url)).GET().build();','dynamic-or-unsupported-url'],
  ['HttpRequest.newBuilder(uri).GET().build();','dynamic-or-unsupported-uri'],
  ['HttpRequest.newBuilder(URI.create("https://api.test/users")).method(method,body).build();','unsupported-builder-step'],
  ['var b=HttpRequest.newBuilder(URI.create("https://api.test/users")); b.GET().build();','request-builder-chain-unresolved'],
  ['HttpRequest.newBuilder(URI.create("https://api.test/users")).unknown().build();','unsupported-builder-step'],
])('reports unsupported Java syntax: %s',(body,reason)=>expect(extractJavaCalls(java(body)).calls[0]!.reason).toBe(reason));
it('does not infer Java standard classes without imports or through Unicode escapes',()=>{
  expect(extractJavaCalls('class C{ void f(){'+chain('https://api.test/users')+'}}').calls).toEqual([]);
  expect(extractJavaCalls(java('// \\u000a changes tokenization\n'+chain('https://api.test/users'))).issues).toContain('java-unicode-escape-unresolved');
  expect(extractJavaCalls(java('HttpRequest.newBuilder(')).issues).toContain('unsupported-or-invalid-java');
  expect(extractJavaCalls(java('// '+chain('https://api.test/users'))).calls).toEqual([]);
});
it('does not treat aliased or conflicting standard-client type names as proven bindings',()=>{
  const csharp=extractCsharpCalls('using HttpClient = Custom;\n'+cs('new HttpClient().GetAsync("https://api.test/users");'));
  expect(csharp.calls[0]!.reason).toBe('httpclient-binding-or-configuration-unresolved');
  const conflicting=extractJavaCalls('import other.HttpRequest;\n'+java(chain('https://api.test/users')));
  expect(conflicting.calls).toEqual([]);
});
it.each([
  ['go',extractGoCalls,go('h.Get("x")\n'.repeat(129))],
  ['csharp',extractCsharpCalls,cs('new HttpClient().GetAsync("x");\n'.repeat(129))],
  ['java',extractJavaCalls,java((chain('https://api.test/users')+'\n').repeat(129))],
] as const)('bounds %s extracted calls',(_lang,extract,source)=>{expect(extract(source).calls).toHaveLength(128);expect(extract(source).issues).toContain('call-count-limit');});

let root:string;
it('audits the distributed expanded example with explicit construction kinds',async()=>{
  const result=await runCli(['audit','fixtures/contracts-expanded','--json']);expect(result.exitCode).toBe(0);
  const report=JSON.parse(result.stdout),calls=report.contracts[0].calls;
  expect(calls).toHaveLength(8);expect(calls.every((call:{status:string})=>call.status==='matched')).toBe(true);
  expect(calls.filter((call:{observationKind:string})=>call.observationKind==='request-construction')).toHaveLength(2);
  expect(fetch).not.toHaveBeenCalled();
});
beforeEach(async()=>{
  root=await fs.mkdtemp(join(tmpdir(),'shipcheck-standard-http-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Network forbidden');}));
  await fs.writeFile(join(root,'api.json'),JSON.stringify({openapi:'3.1.0',info:{title:'API',version:'1'},paths:{'/users':{get:{parameters:[{name:'q',in:'query',required:true,schema:{type:'string'}}]}}}}));
});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
it.each([
  ['go',(url:string)=>go(`h.Get("${url}")`)],
  ['cs',(url:string)=>cs(`var c = new HttpClient(); c.GetAsync("${url}");`)],
  ['java',(url:string)=>java(chain(url))],
] as const)('runs %s contract defect/clean/query controls through CLI and preserves evidence',(async(ext,source)=>{
  const path='client.'+ext,config:ConfigInput={resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[{id:'client',resourceId:'api',files:[path],baseUrl:'https://api.test'}]};
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify(config));
  for(const [url,status,exit] of [['https://api.test/users?q=a','matched',0],['https://api.test/missing','mismatch',1],['https://api.test/users','mismatch',1]] as const) {
    await fs.writeFile(join(root,path),source(url));const before=await fs.readFile(join(root,path));
    const run=await runCli(['audit',root,'--json']);expect(run.exitCode).toBe(exit);
    const report=JSON.parse(run.stdout);expect(report.contracts[0].calls[0].status).toBe(status);
    expect(report.contracts[0].files[0].adapter).toBe(contractAdapterFor(path)!.id);
    expect(report.contracts[0].files[0].sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(await fs.readFile(join(root,path))).toEqual(before);
  }
  const excluded=(await auditContracts(root,{...config,exclude:[path]}))[0]!;expect(excluded.state).toBe('partial');expect(excluded.files[0]!.status).toBe('excluded');
  expect(fetch).not.toHaveBeenCalled();
}));
