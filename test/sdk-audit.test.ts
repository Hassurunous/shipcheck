import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {auditSdkContracts} from '../src/sdk-audit.js';
import {configSchema,type ConfigInput} from '../src/config.js';
import {runCli} from '../src/cli-command.js';
import {indexSdkDeclarations,compareSdkCalls} from '../src/sdk-syntax.js';
let root:string;
const config:ConfigInput={sdkContracts:[{id:'sdk',package:'fixture-sdk',files:['a.ts'],versionRange:'^1.0.0'}]};
const declaration='export declare function getUser(id: string, active?: boolean): string;\nexport declare function count(value: number): number;';
const manifest={name:'fixture-sdk',version:'1.2.3',types:'index.d.ts'};
async function write(path:string,content:string){await fs.mkdir(dirname(join(root,path)),{recursive:true});await fs.writeFile(join(root,path),content);}
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-sdk-'));await write('node_modules/fixture-sdk/package.json',JSON.stringify(manifest));await write('node_modules/fixture-sdk/index.d.ts',declaration);await write('node_modules/fixture-sdk/index.js','throw Error("Package must never execute");');vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
async function audit(source:string,options:ConfigInput=config){await write('a.ts',source);return (await auditSdkContracts(root,options))[0]!;}
it('checks named aliases, optional primitive arguments and provider/consumer evidence without importing code',async()=>{
  const source='import {getUser as user, count} from "fixture-sdk";\nuser("id"); user("id", true); count(-2);';
  const result=await audit(source);expect(result.state).toBe('checked');expect(result.calls.map(c=>c.status)).toEqual(['matched','matched','matched']);
  expect(result.calls[0]!.line).toBe(2);expect(result.calls[0]!.providerEvidence[0]!.excerpt).toContain('export declare function getUser');
  expect(result.provider!.manifestSha256).toMatch(/^[a-f0-9]{64}$/);expect(result.provider!.declarationSha256).toMatch(/^[a-f0-9]{64}$/);expect(result.files[0]!.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(await fs.readFile(join(root,'a.ts'),'utf8')).toBe(source);expect(fetch).not.toHaveBeenCalled();
});
it.each(['getUser();','getUser(42);','getUser("x",true,1);','count("x");','invented("x");'])('reports proven direct call mismatch: %s',async call=>{
  const result=await audit('import {getUser,count,invented} from "fixture-sdk"; '+call);expect(result.state).toBe('checked');expect(result.calls[0]!.status).toBe('mismatch');
});
it.each(['getUser(variable);','getUser(...args);','getUser?.("x");','function f(getUser) {getUser("x");}','const alias=getUser; alias("x");'])('leaves ambiguous/dynamic calls unresolved: %s',async call=>{
  const result=await audit('import {getUser} from "fixture-sdk"; '+call);expect(result.state).toBe('partial');expect(result.calls.every(c=>c.status==='unresolved')).toBe(true);
});
it.each(['import sdk from "fixture-sdk"; sdk.getUser("x");','import * as sdk from "fixture-sdk"; sdk.getUser("x");','const sdk=require("fixture-sdk"); sdk.getUser("x");','import type {getUser} from "fixture-sdk";','// getUser("x");'])('does not silently pass unsupported imports or zero calls: %s',async source=>{
  expect((await audit(source)).state).toBe('partial');
});
it('accepts supported overloads and does not infer mismatches through unsupported declarations',async()=>{
  await write('node_modules/fixture-sdk/index.d.ts','export declare function f(x: string): void; export declare function f(x: number): void;');
  expect((await audit('import {f} from "fixture-sdk"; f(1); f("x");')).calls.map(c=>c.status)).toEqual(['matched','matched']);
  await write('node_modules/fixture-sdk/index.d.ts','export declare function f<T>(x: T): void;');
  expect((await audit('import {f} from "fixture-sdk"; f("x");')).calls[0]!.status).toBe('unresolved');
  await write('node_modules/fixture-sdk/index.d.ts','export * from "./other";');
  expect((await audit('import {f} from "fixture-sdk"; f("x");')).calls[0]!.status).toBe('unresolved');
});
it('rejects identity/version conflicts and conditional resolution without an explicit mapping',async()=>{
  const source='import {getUser} from "fixture-sdk";getUser("x");';
  expect((await audit(source,{sdkContracts:[{...config.sdkContracts![0]!,versionRange:'^2'}]})).state).toBe('version-mismatch');
  await write('node_modules/fixture-sdk/package.json',JSON.stringify({...manifest,exports:{'.':{types:'./index.d.ts'}}}));
  expect((await audit(source)).state).toBe('partial');
  expect((await audit(source,{sdkContracts:[{...config.sdkContracts![0]!,declarationFile:'index.d.ts'}]})).state).toBe('checked');
  await write('node_modules/fixture-sdk/package.json',JSON.stringify({...manifest,name:'other'}));expect((await audit(source)).state).toBe('unavailable');
});
it.each(['../escape.d.ts','/outside.d.ts','C:/outside.d.ts'])('rejects unsafe declaration entry %s',async types=>{
  await write('node_modules/fixture-sdk/package.json',JSON.stringify({...manifest,types}));expect((await audit('import {getUser} from "fixture-sdk";getUser("x");')).state).toBe('unavailable');
});
it('respects provider/consumer exclusions, byte limits and workflow scope',async()=>{
  const source='import {getUser} from "fixture-sdk";getUser("x");';
  expect((await audit(source,{...config,exclude:['node_modules']})).state).toBe('unavailable');
  expect((await audit(source,{...config,exclude:['a.ts']})).state).toBe('partial');
  expect(await auditSdkContracts(root,config,['other.ts'])).toEqual([]);
  await write('node_modules/fixture-sdk/index.d.ts','x'.repeat(65537));expect((await audit(source)).issues.join()).toContain('file-size-limit');
});
it('supports explicitly authorized secondary package roots',async()=>{
  await write('a.ts','import {getUser} from "fixture-sdk";getUser("x");');
  const mapped:ConfigInput={sdkContracts:[{...config.sdkContracts![0]!,rootId:'sdk',packageRoot:'.'}]};
  expect((await auditSdkContracts(root,mapped))[0]!.state).toBe('unavailable');
  const result=(await auditSdkContracts(root,mapped,undefined,{roots:{sdk:join(root,'node_modules/fixture-sdk')}}))[0]!;
  expect(result.state).toBe('checked');expect(result.provider!.rootSha256).toMatch(/^[a-f0-9]{64}$/);
});
it('bounds declaration and call counts',()=>{
  expect(indexSdkDeclarations('export declare function f(x: string): void;'.repeat(17)).issues).toContain('declaration-count-limit');
  const index=indexSdkDeclarations(declaration);
  const result=compareSdkCalls('import {getUser} from "fixture-sdk";'+ 'getUser("x");'.repeat(129),'a.ts','fixture-sdk',index);
  expect(result.calls).toHaveLength(128);expect(result.issues).toContain('sdk-call-count-limit');
});
it('validates SDK bindings and semver ranges',()=>{
  for(const binding of [{...config.sdkContracts![0]!,package:'../outside'},{...config.sdkContracts![0]!,versionRange:'not-a-range'},{...config.sdkContracts![0]!,packageRoot:'../outside'}])expect(configSchema.safeParse({sdkContracts:[binding]}).success).toBe(false);
});
it('integrates JSON/console/Markdown and CLI exit precedence',async()=>{
  await write('shipcheck.config.json',JSON.stringify(config));await write('a.ts','import {getUser} from "fixture-sdk";getUser(1);');
  for(const args of [[],['--json'],['--markdown']]){const report=await runCli(['audit',root,...args]);expect(report.exitCode).toBe(1);expect(report.stdout).toMatch(/mismatch/i);}
  await write('a.ts','import {getUser} from "fixture-sdk";getUser(1);getUser(variable);');const partial=await runCli(['audit',root,'--json']);expect(partial.exitCode).toBe(2);expect(JSON.parse(partial.stdout).sdkContracts[0].state).toBe('partial');
});
