import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {inspectRepository,reviewWithAi} from '../src/index.js';
import {collectContext} from '../src/ai/context.js';
import {aiSettingsSchema} from '../src/ai/contracts.js';
import {buildRequest} from '../src/ai/client.js';
import {resolveLocalImport,localImports} from '../src/ai/local-imports.js';
import {validateRoot} from '../src/filesystem-policy.js';
import {renderConsoleReport} from '../src/reporters.js';
let root:string;
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-reliability-'));vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network forbidden');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
const settings=aiSettingsSchema.parse({});
async function write(path:string,content:string) {await fs.writeFile(join(root,path),content);}
it('sends explicit one-based lines without changing verification source',async()=> {
  await write('a.ts','\r\n  const a = 1;\r\n');
  const context=await collectContext(await inspectRepository(root),settings);
  const payload=JSON.parse(buildRequest(context,settings,'test').input[0]!.content);
  expect(payload.sourceFiles[0].numberedLines).toEqual([{line:1,text:''},{line:2,text:'  const a = 1;'},{line:3,text:''}]);
  expect(context.files[0]!.content).toBe('\r\n  const a = 1;\r\n');
});
it('includes local guards before unrelated files, resolves JS imports to TS, and terminates cycles',async()=> {
  await write('a.ts',"import {guard} from './z.js';\nexport const a=guard(1);");
  await write('b.ts','export const distractor=1;');
  await write('z.ts',"import './a.js';\nexport const guard=(x:number)=>x;");
  const context=await collectContext(await inspectRepository(root),aiSettingsSchema.parse({maxFiles:2}));
  expect(context.files.map(f=>f.path)).toEqual(['a.ts','z.ts']);
  expect(context.preview.dependencies!.every(d=>d.status==='included')).toBe(true);
});
it('discloses omitted and unresolved dependencies and respects exclusions',async()=> {
  await write('a.ts',"import './excluded.js';\nimport './missing.js';\nimport './guard.js';");
  await write('excluded.ts','export const secret=1;'); await write('guard.ts','export const guard=1;');
  const profile=await inspectRepository(root,{exclude:['excluded.ts']});
  const context=await collectContext(profile,aiSettingsSchema.parse({maxFiles:1}),['a.ts']);
  expect(context.files.map(f=>f.path)).toEqual(['a.ts']);
  expect(context.preview.dependencies!.map(d=>d.status)).toEqual(['unresolved','omitted','unresolved']);
  const payload=JSON.parse(buildRequest(context,settings,'test').input[0]!.content);
  expect(payload.missingDependencies).toHaveLength(3);
});
it('adds supporting files for a scoped audit while keeping focus paths explicit',async()=> {
  await write('a.ts',"import './guard.js';"); await write('guard.ts','export const guard=1;');
  const report=await reviewWithAi(root,{execution:'preview',paths:['a.ts']});
  expect(report.ai!.preview.supportingPaths).toEqual(['guard.ts']);
  expect(report.ai!.coverage).toMatchObject({state:'preview',selectedPaths:['a.ts','guard.ts'],validResponsePaths:[]});
  expect(renderConsoleReport(report)).toContain('not a clean whole-repository AI result');
});
it('distinguishes invalid responses and rejected citations from clean reviews',async()=> {
  await write('a.ts','export const a=1;');
  const options={execution:'mock' as const,config:{ai:{models:{'low-cost':'test'}}}};
  const failed=await reviewWithAi(root,options,{apiKey:'dummy',transport:async()=>({status:200,body:'invalid'})});
  expect(failed.ai!.coverage).toMatchObject({state:'failed',failedResponsePaths:['a.ts'],validResponsePaths:[]});
  const candidate={title:'Test',severity:'warning',explanation:'Test',suggestedAction:'Inspect',evidence:[{path:'a.ts',startLine:1,endLine:1,excerpt:'invented'}]};
  const rejected=await reviewWithAi(root,options,{apiKey:'dummy',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[candidate]})}]}]})})});
  expect(rejected.ai!.coverage).toMatchObject({state:'partial',matchedCandidates:0,rejectedCandidates:1,validResponsePaths:['a.ts']});
});
it('canonicalizes ancestor aliases but rejects an explicitly linked root',async()=> {
  await fs.mkdir(join(root,'real')); await fs.mkdir(join(root,'real','repo'));
  await fs.symlink(join(root,'real'),join(root,'alias'),'junction');
  expect(await validateRoot(join(root,'alias','repo'))).toBe(await fs.realpath(join(root,'real','repo')));
  await expect(validateRoot(join(root,'alias'))).rejects.toThrow('symlink');
});
it('resolves only inventoried local imports without traversing outside the root',()=> {
  const inventory=new Set(['src/guard.ts','outside.ts']);
  expect(resolveLocalImport('src/a.ts','./guard.js',inventory)).toBe('src/guard.ts');
  expect(resolveLocalImport('src/a.ts','../../outside.ts',inventory)).toBeUndefined();
  expect(localImports("import {guard} from './guard.js';\nexport {guard} from './guard.js';\nimport 'external';")).toEqual(['./guard.js']);
});
