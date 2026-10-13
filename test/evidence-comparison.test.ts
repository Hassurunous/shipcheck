import {afterEach,beforeEach,expect,it} from 'vitest';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
let root:string;
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-comparison-score-'));});
afterEach(async()=>{await rm(root,{recursive:true,force:true});});
async function fixture(){
 const corpus=await readFile(resolve('fixtures/evidence-comparison/cases.json'),'utf8');
 const cases=JSON.parse(corpus) as {id:string;kind:string}[];
 const runs=cases.flatMap(c=>['withheld','supplied'].map(arm=>({caseId:c.id,arm,output:{candidates:c.kind==='defect'?[{title:'fixture diagnosis'}]:[]},
  verifications:c.kind==='defect'?[{citations:{status:'matched'},execution:{status:'not-claimed'}}]:[]})));
 const labels=runs.flatMap(r=>r.output.candidates.map((_,candidate)=>({caseId:r.caseId,arm:r.arm,candidate,runHash:hash(JSON.stringify(r)),verdict:'confirmed',unsupportedExecution:false,rationale:'Fixture-specific reviewer confirmation.'})));
 return {evaluation:{manifest:{mode:'--live',corpusSha256:hash(corpus)},runs},labels};
}
async function score(data:Awaited<ReturnType<typeof fixture>>){
 const evaluation=join(root,'evaluation.json'),labels=join(root,'labels.json');
 await writeFile(evaluation,JSON.stringify(data.evaluation));await writeFile(labels,JSON.stringify(data.labels));
 return spawnSync(process.execPath,[resolve('scripts/score-evidence-comparison.mjs'),evaluation,labels],{encoding:'utf8',windowsHide:true,timeout:10000});
}
it('scores paired confirmed defects and clean controls without a model',async()=>{
 const result=await score(await fixture());expect(result.status).toBe(0);
 for(const summary of Object.values(JSON.parse(result.stdout)))expect(summary).toMatchObject({detectedBugs:3,missedBugs:0,falsePositiveClaims:0,cleanControlsClear:3,incompleteControlsAbstained:2});
});
it.each(['stale','duplicate','unknown'] as const)('rejects %s reviewer labels',async kind=>{
 const data=await fixture();
 if(kind==='stale')data.labels[0]!.runHash='0'.repeat(64);
 if(kind==='duplicate')data.labels.push(data.labels[0]!);
 if(kind==='unknown')data.labels[0]!.caseId='not-a-case';
 expect((await score(data)).status).not.toBe(0);
});
it('does not promote confirmed labels with rejected citations or contradicted premises',async()=>{
 const data=await fixture();const run=data.evaluation.runs[0]!;
 run.verifications[0]!.execution.status='contradicted';
 data.labels[0]!.runHash=hash(JSON.stringify(run));
 const result=await score(data);expect(result.status).toBe(0);
 expect(JSON.parse(result.stdout).withheld).toMatchObject({detectedBugs:2,unresolvedBugs:1,unassessedClaims:1,contradictedPremises:1});
});
it('counts false positives separately and never hides missing responses as misses',async()=>{
 const data=await fixture();data.labels[0]!.verdict='false-positive';
 data.evaluation.runs=data.evaluation.runs.filter(r=>r.caseId!=='empty-average-defect');
 data.labels=data.labels.filter(r=>r.caseId!=='empty-average-defect');
 const result=await score(data);expect(result.status).toBe(0);
 expect(JSON.parse(result.stdout).withheld).toMatchObject({detectedBugs:1,missedBugs:1,unresolvedBugs:1,falsePositiveClaims:1});
});
