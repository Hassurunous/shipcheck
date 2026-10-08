import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import fs from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {runWorkflow} from '../src/workflows.js';
import {reviewRepository} from '../src/review-repository.js';
import {reviewWithAi} from '../src/ai/review.js';
import {summarizeAudit} from '../src/audit-summary.js';
import {renderConsoleReport,renderJsonReport} from '../src/reporters.js';
import {renderMarkdownReport} from '../src/markdown-report.js';
import {reportSchema,type Report} from '../src/findings.js';
import {configSchema,ruleDefaults} from '../src/config.js';
let root:string;
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-p19-'));await fs.writeFile(join(root,'main.ts'),'export const value=1;');vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
const stage=(r:Report,id:string)=>r.auditSummary!.stages.find(s=>s.id===id)!;
async function config(value:unknown){await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify(value));}
it('makes the narrow default explicit and preserves old reports without inventing their coverage',async()=>{
  const r=await runWorkflow(root,'audit');expect(stage(r,'deterministic').status).toBe('completed');
  expect(stage(r,'inspection').files).toContain('main.ts');expect(stage(r,'external-checks').status).toBe('not-configured');
  expect(stage(r,'ai').status).toBe('not-requested');expect(stage(r,'architecture').status).toBe('not-configured');
  expect(r.auditSummary?.generalQualityVerdict).toBe('not-established');
  expect(renderConsoleReport(r)).toContain('Overall code quality is not established');
  expect(renderMarkdownReport(r)).toContain('AI review was not requested');
  expect(JSON.parse(renderJsonReport(r)).auditSummary).toEqual(r.auditSummary);
  const old=reportSchema.parse({schemaVersion:1,root,findings:[],inspectionWarnings:[]});
  expect(old.auditSummary).toBeUndefined();expect(renderConsoleReport(old)).toContain('Assessment scope unavailable');
});
it('separates unauthorized checks, language skips, failed checks and unavailable executables',async()=>{
  await config({checks:[{id:'typecheck',command:process.execPath,args:['-e','process.exit(0)']},{id:'lint',command:process.execPath,args:['-e','process.exit(1)']},{id:'python',command:process.execPath,languages:['Python']},{id:'missing',command:join(root,'missing-executable')}]});
  const blocked=await runWorkflow(root,'audit');expect(stage(blocked,'external:typecheck').status).toBe('not-authorized');
  const ran=await runWorkflow(root,'audit',undefined,{runChecks:true});
  expect(stage(ran,'external:typecheck')).toMatchObject({status:'completed',files:null,scope:'tool-defined'});
  expect(stage(ran,'external:lint').explanation).toContain('FAILED');expect(stage(ran,'external:missing').status).toBe('failed');
  expect(stage(ran,'external:python').status).toBe('skipped');expect(ran.auditSummary?.outcome).toBe('issues-reported');
});
it('distinguishes preview, mock and caller-supplied transport from live review',async()=>{
  for(const execution of ['preview','mock'] as const){const r=await runWorkflow(root,'audit',{execution});expect(stage(r,'ai').status).toBe(execution);expect(stage(r,'ai').files).toEqual([]);expect(stage(r,'ai').selectedFiles).toContain('main.ts');}
  const r=await reviewWithAi(root,{execution:'mock',config:{ai:{models:{'low-cost':'fixture'}}}},{apiKey:'offline-fixture',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'{"candidates":[]}'}]}]})})});
  expect(stage(r,'ai').status).toBe('injected');expect(fetch).not.toHaveBeenCalled();
});
it('discloses AI blocked by required resources rather than claiming it was not requested',async()=>{
  await config({resources:[{id:'spec',path:'missing.md'}]});
  const r=await runWorkflow(root,'audit',{execution:'preview'});
  expect(stage(r,'ai').status).toBe('blocked');expect(stage(r,'references').omitted).toEqual([{path:'missing.md',reason:'missing'}]);
  expect(r.auditSummary?.outcome).toBe('incomplete');
});
it('does not claim that unread or ignored files were examined',async()=>{
  await fs.writeFile(join(root,'binary.bin'),Buffer.from([0]));await fs.writeFile(join(root,'.gitignore'),'hidden.ts\n');await fs.writeFile(join(root,'hidden.ts'),'ignored');
  const r=await runWorkflow(root,'audit');expect(stage(r,'inspection').files).not.toContain('binary.bin');expect(stage(r,'inspection').files).not.toContain('hidden.ts');
  expect(stage(r,'inspection').omitted).toContainEqual({path:'binary.bin',reason:'non-text-file'});expect(stage(r,'inspection').status).toBe('partial');
});
it('keeps disabled rules and lower-level APIs separate from executed workflow stages',async()=>{
  await config({rules:Object.fromEntries(Object.keys(ruleDefaults).map(id=>[id,'off'])),checks:[{id:'lint',command:'never-run'}]});
  const r=await reviewRepository(root);expect(stage(r,'deterministic').status).toBe('disabled');expect(stage(r,'external-checks').status).toBe('not-run');
});
it('reports whole-repository batch omissions and no-source runs without a false AI success',async()=>{
  await fs.writeFile(join(root,'second.ts'),'export const x=2;');
  const r=await runWorkflow(root,'audit',{execution:'preview',config:{ai:{maxBatches:1,maxFiles:1}}},{wholeRepository:true});
  expect(stage(r,'ai').status).toBe('preview');expect(stage(r,'ai').omitted.some(s=>s.reason==='batch-count-limit')).toBe(true);
  await fs.unlink(join(root,'main.ts'));await fs.unlink(join(root,'second.ts'));
  const empty=await runWorkflow(root,'audit',{execution:'mock'},{wholeRepository:true});expect(stage(empty,'ai').status).toBe('skipped');
});
it('retains successful live-batch evidence when another batch fails, using offline report fixtures',async()=>{
  const base=await runWorkflow(root,'audit',{execution:'mock'});const batch=base.ai!;
  const completed={...batch,execution:'live' as const,candidates:[],coverage:{...batch.coverage!,state:'complete' as const}};
  const failed={...completed,status:'failed' as const,error:{code:'fixture-failure',message:'Synthetic failure'},coverage:{...completed.coverage,state:'failed' as const,validResponsePaths:[]}};
  delete base.ai;base.aiAudit={scope:'whole-repository',batches:[completed,failed],selectedPaths:['main.ts'],validResponsePaths:['main.ts'],skipped:[],state:'failed'};
  const summary=summarizeAudit(base,{config:configSchema.parse({}),aiRequested:'live'});
  expect(summary.stages.find(s=>s.id==='ai')).toMatchObject({status:'failed',files:['main.ts']});expect(summary.outcome).toBe('incomplete');
});
it('represents an empty diff as skipped, never successful analysis',()=>{
  const summary=summarizeAudit({schemaVersion:1,root,findings:[],inspectionWarnings:[]},{emptyDiff:true});
  expect(summary.outcome).toBe('not-assessed');expect(summary.stages.every(s=>s.status==='skipped')).toBe(true);
});

it('discloses filtered findings and direct-API task assessment without inventing a workflow',async()=>{
  const report=await runWorkflow(root,'audit',{execution:'mock'});
  report.workflow={kind:'diff',scope:['main.ts'],baseline:'HEAD',unavailablePaths:[]};
  report.ai!.taskReview={taskHash:'fixture',state:'partial',freshness:'changed-or-unavailable',assessments:[]};
  const summary=summarizeAudit(report);
  expect(summary.stages.find(s=>s.id==='task')?.status).toBe('partial');
  expect(summary.stages.find(s=>s.id==='deterministic')?.limitations).toContain('Repository facts were collected, but reported findings are filtered to workflow-selected paths.');
  expect(summary.outcome).toBe('incomplete');
});
