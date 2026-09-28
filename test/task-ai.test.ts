import {beforeEach,afterEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {reviewWithAi} from '../src/ai/review.js';
import {runWorkflow} from '../src/workflows.js';
import {currentTaskSchema,describeCurrentTask} from '../src/task-file.js';
import {configSchema} from '../src/config.js';
import type {ResponseTransport} from '../src/ai/client.js';
const task=currentTaskSchema.parse({id:'FEE',title:'Implement fee',description:'Flat fee.',files:['fee.ts'],
  requirements:[{id:'R1',text:'Return exactly 7.'}],nonGoals:['Change unrelated code.']});
const source='export const fee = () => 5;';
const assessment={requirementId:'R1',status:'potential-violation',explanation:'Returns 5 rather than 7.',relatedRequirementIds:[],
  evidence:[{path:'fee.ts',startLine:1,endLine:1,excerpt:source}]};
const response=(assessments:unknown[],extras={})=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[],taskAssessments:assessments,...extras})}]}]})});
let root:string;
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-task-ai-'));await writeFile(join(root,'fee.ts'),source);await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({currentTask:task}));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));});
afterEach(async()=>{vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
const reloadTask=async()=>configSchema.parse(JSON.parse(await readFile(join(root,'shipcheck.config.json'),'utf8'))).currentTask!;
const run=(transport:ResponseTransport,extra={})=>reviewWithAi(root,{execution:'mock',task,reloadTask,config:{ai:{models:{'low-cost':'fixture'}}},...extra},{transport,apiKey:'offline-fixture'});
it('sends expectations and non-goals, preserves IDs, verifies citations and leaves files untouched',async()=>{
  const before=await readFile(join(root,'shipcheck.config.json'),'utf8');
  const report=await run(async request=>{expect(JSON.parse(request.input[0]!.content).currentTask).toEqual(task);return response([assessment]);});
  expect(report.ai?.taskReview).toMatchObject({taskHash:describeCurrentTask(task).sha256,state:'assessed',freshness:'unchanged',assessments:[{requirementId:'R1',status:'potential-violation',evidenceVerification:{status:'matched'}}]});
  expect(report.ai?.candidates).toEqual([]);expect(await readFile(join(root,'fee.ts'),'utf8')).toBe(source);expect(await readFile(join(root,'shipcheck.config.json'),'utf8')).toBe(before);expect(fetch).not.toHaveBeenCalled();
});
it('downgrades stale task results while retaining original proposals',async()=>{
  const report=await run(async()=>{await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({currentTask:{...task,nonGoals:['Changed']}}));return response([assessment]);});
  expect(report.ai?.taskReview).toMatchObject({state:'changed',freshness:'changed-or-unavailable',assessments:[{status:'insufficient-evidence',proposedStatus:'potential-violation'}]});
  expect(report.ai?.coverage?.state).toBe('partial');
});
it('rejects incomplete, duplicate and invented criterion identities before accepting results',async()=>{
  for(const items of [[],[assessment,assessment],[{...assessment,requirementId:'unknown'}],[{...assessment,relatedRequirementIds:['unknown']}]]) {
    const report=await run(async()=>response(items));expect(report.ai?.error?.code).toBe('invalid-task-assessment');expect(report.ai?.taskReview?.state).toBe('not-assessed');
  }
});
it('requires task-source evidence for substantive outcomes and rejects invented excerpts',async()=>{
  const empty=await run(async()=>response([{...assessment,evidence:[]}]));expect(empty.ai?.error?.code).toBe('invalid-task-assessment');
  const fake=await run(async()=>response([{...assessment,evidence:[{...assessment.evidence[0]!,excerpt:'invented'}]}]));
  expect(fake.ai?.taskReview?.assessments[0]).toMatchObject({status:'insufficient-evidence',evidenceVerification:{status:'rejected'}});
});
it('keeps ambiguous criteria and absent runtime evidence uncertain',async()=>{
  for(const status of ['needs-clarification','insufficient-evidence']) {
    const report=await run(async()=>response([{...assessment,status,evidence:[]}]));
    expect(report.ai?.taskReview?.state).toBe('partial');expect(report.ai?.taskReview?.assessments[0]?.status).toBe(status);
  }
});
it('bounds task content and blocks likely credentials before transport',async()=>{
  const transport=vi.fn(async()=>response([assessment]));
  const oversized=await run(transport,{task:{...task,description:'x'.repeat(1000)},config:{ai:{maxContextBytes:256}}});
  expect(oversized.ai?.error?.code).toBe('task-context-limit');
  const sensitive=await run(transport,{task:{...task,description:'api_key = "dummy-sensitive-value"'}});
  expect(sensitive.ai?.error?.code).toBe('sensitive-task');expect(transport).not.toHaveBeenCalled();
});
it('does not claim support when selected files were excluded',async()=>{
  await writeFile(join(root,'other.ts'),'export const other=1;');
  const extended={...task,files:['fee.ts','other.ts']};
  const report=await run(async()=>response([{...assessment,status:'supporting-evidence'}]),{task:extended,reloadTask:async()=>extended,config:{exclude:['other.ts'],ai:{models:{'low-cost':'fixture'}}}});
  expect(report.ai?.taskReview?.assessments[0]?.status).toBe('insufficient-evidence');
});
it('invalidates results when task reload fails and rejects changed source citations',async()=>{
  const stale=await run(async()=>response([assessment]),{reloadTask:async()=>{throw Error('Gone');}});expect(stale.ai?.taskReview?.state).toBe('changed');
  const changed=await run(async()=>{await writeFile(join(root,'fee.ts'),'export const fee=()=>7;');return response([assessment]);});
  expect(changed.ai?.taskReview?.assessments[0]?.evidenceVerification?.status).toBe('rejected');
});
it('marks task changes by explicitly authorized checks after AI review',async()=>{
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({currentTask:task,checks:[{id:'change',command:process.execPath,
    args:['-e',"const fs=require('fs');const p='shipcheck.config.json';const c=JSON.parse(fs.readFileSync(p));c.currentTask.title='Changed';fs.writeFileSync(p,JSON.stringify(c));"]}]}));
  const report=await runWorkflow(root,'task',{execution:'mock'},{currentTask:true,runChecks:true});
  expect(report.currentTask?.assessment).toBe('changed');expect(report.ai?.taskReview?.freshness).toBe('changed-or-unavailable');
});
it('uses verified reference evidence and requires clarification when that reference is disputed',async()=>{
  await writeFile(join(root,'policy.md'),'Return 7.');await writeFile(join(root,'other.md'),'Return 5.');
  const ref={path:'policy.md',startLine:1,endLine:1,excerpt:'Return 7.'};
  const other={path:'other.md',startLine:1,endLine:1,excerpt:'Return 5.'};
  const options={config:{resources:[{id:'policy',path:'policy.md'},{id:'other',path:'other.md'}],ai:{models:{'low-cost':'fixture'}}}};
  const report=await run(async()=>response([{...assessment,evidence:[...assessment.evidence,ref]}],
    {referenceConflicts:[{explanation:'Different expected values.',evidence:[ref,other]}]}),options);
  expect(report.ai?.taskReview?.assessments[0]).toMatchObject({status:'needs-clarification',proposedStatus:'potential-violation',evidenceVerification:{status:'matched'}});
});
it('exercises legacy task-file assessments without changing the original format',async()=>{
  const file=join(root,'task.json');await writeFile(file,JSON.stringify({version:1,repository:'.',files:['fee.ts'],criteria:['Return 7.']}));
  const report=await runWorkflow(file,'task',{execution:'mock'});
  expect(report.currentTask).toMatchObject({source:'task-file',assessment:'not-assessed',requirements:[{id:'criterion-1',status:'insufficient-evidence'}]});
  expect(report.ai?.taskReview?.freshness).toBe('unchanged');
});
