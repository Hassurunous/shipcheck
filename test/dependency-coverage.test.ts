import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {renderConsoleReport} from '../src/reporters.js';
import {reviewWithAi} from '../src/ai/review.js';
import {reviewWholeRepository} from '../src/ai/whole-repository.js';
import {reconcileContextCoverage} from '../src/ai/context-coverage.js';
import type {AiResult} from '../src/ai/contracts.js';
let root:string;
const config={ai:{models:{'low-cost':'fixture'}},resources:[{id:'css',path:'index.css',required:false}]};
const response=()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[],referenceConflicts:[]})}]}]})});
beforeEach(async()=>{
  root=await mkdtemp(join(tmpdir(),'shipcheck-dependency-'));
  await writeFile(join(root,'index.ts'),"import './index.css';");
  await writeFile(join(root,'index.css'),'.counter { color: red; }');
  vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));
});
afterEach(async()=>{vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
it('resolves imported CSS through fresh reference context while preserving collection history',async()=>{
  const report=await reviewWithAi(root,{execution:'mock',config},{apiKey:'fixture',transport:async request=>{
    expect(JSON.parse(request.input[0]!.content).missingDependencies).toEqual([]);
    return response();
  }});
  expect(report.ai?.preview.dependencies).toEqual([{from:'index.ts',specifier:'./index.css',path:'index.css',status:'omitted',effectiveStatus:'included',suppliedVia:'local-reference'}]);
  expect(report.ai?.preview.skipped).toContainEqual({path:'index.css',reason:'excluded-or-not-source'});
  expect(report.ai?.preview).toMatchObject({limited:false,limitations:[]});
  expect(report.ai?.coverage?.state).toBe('complete');
  expect(renderConsoleReport(report)).not.toContain('Missing dependency context:');
  const whole=await reviewWholeRepository(root,{execution:'mock',config});
  expect(whole.aiAudit?.state).toBe('complete');
  expect(fetch).not.toHaveBeenCalled();
});
it.each(['missing','stale','deleted','oversized','excluded','context-limit','other-dependency','failed-response'])('keeps genuine %s gaps visible',async condition=>{
  if(condition==='missing')await rm(join(root,'index.css'));
  if(condition==='oversized')await writeFile(join(root,'index.css'),'x'.repeat(65537));
  if(condition==='context-limit')await writeFile(join(root,'index.css'),'x'.repeat(2000));
  if(condition==='other-dependency')await writeFile(join(root,'index.ts'),"import './index.css';\nimport './missing.ts';");
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,
    exclude:condition==='excluded'?['index.css']:[],ai:{...config.ai,...(condition==='context-limit'?{maxContextBytes:1000}:{})}}},
    {apiKey:'fixture',transport:async()=>{
      if(condition==='stale')await writeFile(join(root,'index.css'),'changed');
      if(condition==='deleted')await rm(join(root,'index.css'));
      if(condition==='failed-response')return {status:500,body:''};
      return response();
    }});
  expect(report.ai?.coverage?.state).toBe(condition==='failed-response'?'failed':'partial');
  expect(report.ai?.preview.limited).toBe(true);
  const dependency=report.ai?.preview.dependencies?.find(item=>item.specifier==='./index.css');
  expect(dependency?.effectiveStatus).toBe(condition==='other-dependency'?'included':condition==='missing' || condition==='excluded'?'unresolved':'omitted');
});
it.each(['analysis-omission','analysis-filter','analysis-absent','other-size-limit','external-reference'])('reconciliation preserves %s independently of resolved CSS',condition=>{
  const preview:AiResult['preview']={files:[],skipped:[],serializedBytes:100,limited:true,
    dependencies:[{from:'index.ts',specifier:'./index.css',path:'index.css',status:'omitted'}],
    references:[{id:'css',path:condition==='external-reference'?'@references/css/index.css':'index.css',sha256:'hash',status:'included',required:true,freshness:'unchanged'}]};
  if(condition.startsWith('analysis'))preview.analysis={bytes:condition==='analysis-absent'?0:100,sha256:'hash',records:0,
    omittedRecords:condition==='analysis-omission'?1:0,filtered:condition==='analysis-filter',freshness:'not-revalidated'};
  if(condition==='other-size-limit')preview.skipped.push({path:'other.ts',reason:'file-size-limit'});
  reconcileContextCoverage(preview,true);
  expect(preview.limited).toBe(true);
  expect(preview.limitations?.length).toBeGreaterThan(0);
  expect(preview.dependencies?.[0]?.effectiveStatus).toBe(condition==='external-reference'?'omitted':'included');
});
it('does not resolve reference conflicts when CSS dependency coverage is satisfied',async()=>{
  await writeFile(join(root,'policy.md'),'Use blue.');
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,resources:[...config.resources,{id:'policy',path:'policy.md'}]}},
    {apiKey:'fixture',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[],referenceConflicts:[{explanation:'Conflicting colors.',evidence:[
      {path:'index.css',startLine:1,endLine:1,excerpt:'color: red;'},
      {path:'policy.md',startLine:1,endLine:1,excerpt:'Use blue.'}]}]})}]}]})})});
  expect(report.ai?.preview.dependencies?.[0]?.effectiveStatus).toBe('included');
  expect(report.ai?.referenceConflicts?.[0]?.evidenceVerification.status).toBe('matched');
  expect(report.ai?.coverage?.state).toBe('partial');
});
