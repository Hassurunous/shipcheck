import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {auditContracts} from '../src/contract-audit.js';
import {extractFetchCalls} from '../src/fetch-calls.js';
import {configSchema,type ConfigInput} from '../src/config.js';
import {runCli} from '../src/cli-command.js';

let root:string;
const contract=()=>({openapi:'3.1.0',info:{title:'Fixture',version:'1.0'},paths:{'/users':{get:{parameters:[{name:'q',in:'query',required:true,schema:{type:'string'}}]}},'/users/{id}':{delete:{}}}});
const config:ConfigInput={resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[{id:'client',resourceId:'api',files:['client.js'],baseUrl:'https://service.test/v1',expectedVersion:'1.0'}]};
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-contract-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));await fs.writeFile(join(root,'api.json'),JSON.stringify(contract()));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
async function audit(source:string,options:ConfigInput=config){await fs.writeFile(join(root,'client.js'),source);return (await auditContracts(root,options))[0]!;}

it('finds route/method/query mismatches with hashed consumer/provider evidence and clean controls',async()=>{
  const result=await audit(`fetch('https://service.test/v1/users?q=hello');\nfetch('https://service.test/v1/users/12',{method:'DELETE'});\nfetch('https://service.test/v1/unknown');\nfetch('https://service.test/v1/users',{method:'POST'});\nfetch('https://service.test/v1/users');`);
  expect(result.state).toBe('checked');
  expect(result.calls.map(c=>c.status)).toEqual(['matched','matched','mismatch','mismatch','mismatch']);
  expect(result.calls[4]!.contractPointers).toEqual(['/paths/~1users/get/parameters/0']);
  expect(result.calls[4]!.line).toBe(5);expect(result.files[0]!.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(result.reference!.sha256).toMatch(/^[a-f0-9]{64}$/);expect(fetch).not.toHaveBeenCalled();
});
it.each([
  ['fetch(url);','dynamic-url'],['fetch(`/users/${id}`);','dynamic-url'],
  ["fetch('https://service.test/v1/users', options);",'dynamic-options'],
  ["fetch('https://service.test/v1/users', {...options});",'dynamic-options'],
  ["fetch('https://service.test/v1/users', {method:verb});",'dynamic-method'],
  ["fetch('/users');",'relative-or-invalid-url'],
  ["function x(fetch){fetch('https://service.test/v1/users');}",'fetch-binding-or-alias-unresolved'],
  ["fetch('https://service.test/v1/users/%12');",'encoded-path'],
])('discloses unsupported calls: %s',async(source,reason)=>{const result=await audit(source);expect(result.state).toBe('partial');expect(result.calls[0]).toMatchObject({status:'unresolved',reason});});
it('ignores comments and string contents, detects aliases and invalid syntax',()=>{
  expect(extractFetchCalls('// fetch("x");\nconst text = `fetch("y")`;').calls).toEqual([]);
  expect(extractFetchCalls('const request=fetch; request("x");').issues).toContain('fetch-binding-or-alias-unresolved');
  expect(extractFetchCalls('const : =')).toEqual({calls:[],issues:['unsupported-or-invalid-javascript']});
});
it.each(['\u2028','\u2029'])('discloses unsupported JS line separator %j without inventing citations',async separator=>{
  const result=await audit('// comment'+separator+"fetch('https://service.test/v1/unknown');");
  expect(result.state).toBe('partial');expect(result.calls).toEqual([]);
  expect(result.issues.join(' ')).toContain('unsupported-line-endings');
});
it('does not mistake another service or base prefix for a mismatch',async()=>{
  const result=await audit("fetch('https://elsewhere.test/v1/users');fetch('https://service.test/v10/users');");
  expect(result.state).toBe('partial');expect(result.calls.every(c=>c.status==='outside-service')).toBe(true);
});
it('discloses a version pin mismatch and incomplete references without negative inferences',async()=>{
  const changed=contract();changed.info.version='2';await fs.writeFile(join(root,'api.json'),JSON.stringify(changed));
  expect((await audit('fetch("https://service.test/v1/missing");')).state).toBe('version-mismatch');
  await fs.writeFile(join(root,'api.json'),JSON.stringify({...contract(),paths:{'/users':{$ref:'#/components/pathItems/users'}}}));
  const result=await audit('fetch("https://service.test/v1/missing");');expect(result.state).toBe('unavailable');expect(result.calls).toEqual([]);
});
it('respects exclusion, size and language boundaries and workflow scope',async()=>{
  expect((await audit('fetch("x")',{...config,exclude:['client.js']})).files[0]!.status).toBe('excluded');
  expect((await audit(' '.repeat(65537))).files[0]!.status).toBe('file-size-limit');
  await fs.writeFile(join(root,'client.rb'),'puts 1');
  expect((await auditContracts(root,{...config,contracts:[{...config.contracts![0]!,files:['client.rb']}]}))[0]!.files[0]!.status).toBe('unsupported-language');
  expect(await auditContracts(root,config,['other.js'])).toEqual([]);
});
it('uses operation overrides and concrete-route precedence',async()=>{
  await fs.writeFile(join(root,'api.json'),JSON.stringify({...contract(),paths:{'/users':{parameters:[{name:'q',in:'query',required:true,schema:{type:'string'}}],get:{parameters:[{name:'q',in:'query',required:false,schema:{type:'string'}}]}},'/users/me':{get:{}},'/users/{id}':{delete:{}}}}));
  const result=await audit('fetch("https://service.test/v1/users");fetch("https://service.test/v1/users/me",{method:"DELETE"});');
  expect(result.calls.map(c=>c.status)).toEqual(['matched','mismatch']);
});
it('does not infer missing parameters through references or complex serialization',async()=>{
  for(const parameter of [{$ref:'#/components/parameters/q'},{name:'q',in:'query',required:true,schema:{type:'object'},style:'deepObject'}]) {
    await fs.writeFile(join(root,'api.json'),JSON.stringify({...contract(),paths:{'/users':{get:{parameters:[parameter]}}}}));
    expect((await audit('fetch("https://service.test/v1/users");')).calls[0]!.status).toBe('unresolved');
  }
});
it('provides CLI JSON, console and Markdown results with failure and incomplete exit codes',async()=>{
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify(config));
  await audit('fetch("https://service.test/v1/users?q=ok");');
  expect((await runCli(['audit',root,'--json'])).exitCode).toBe(0);
  await audit('fetch("https://service.test/v1/wrong");');
  const result=await runCli(['audit',root,'--json']);expect(result.exitCode).toBe(1);expect(JSON.parse(result.stdout).contracts[0].calls[0].status).toBe('mismatch');
  expect((await runCli(['audit',root])).stdout).toContain('[MISMATCH] client.js:1');
  expect((await runCli(['audit',root,'--markdown'])).stdout).toContain('Contract client: CHECKED');
  await audit('fetch(url);');expect((await runCli(['audit',root,'--json'])).exitCode).toBe(2);
});
it('validates bounded mappings and rejects credential-bearing service URLs',()=>{
  expect(configSchema.safeParse({...config,contracts:[{...config.contracts![0]!,baseUrl:'https://user:password@service.test'}]}).success).toBe(false);
  expect(configSchema.safeParse({...config,contracts:[{...config.contracts![0]!,files:Array(33).fill('x.js')}]}).success).toBe(false);
});
it('bounds extraction and preserves Fetch method case semantics',async()=>{
  expect(extractFetchCalls('fetch("x");\n'.repeat(129)).issues).toContain('call-count-limit');
  expect(extractFetchCalls('fetch("'+'x'.repeat(2048)+'");').issues).toContain('source-excerpt-limit');
  expect((await audit('fetch("https://service.test/v1/users",{method:"patch"});')).calls[0]!.status).toBe('unresolved');
  expect((await audit('fetch("https://service.test/v1/users",{method:"TRACE"});')).calls[0]!.status).toBe('unresolved');
});
