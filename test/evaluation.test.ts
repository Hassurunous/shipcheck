import {readFile} from 'node:fs/promises';
import {expect,it} from 'vitest';
import {evaluationCaseSchema,runEvaluationCase,scoreEvaluation,type EvaluationCase} from '../src/ai/evaluation.js';

const cases:EvaluationCase[]=JSON.parse(await readFile(new URL('../fixtures/evaluation/cases.json',import.meta.url),'utf8')).map((c:unknown)=>evaluationCaseSchema.parse(c));
const empty=JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'{"candidates":[]}'}]}]});
it('includes isolated and mixed bugs, clean controls and cross-file guards',()=> {
  expect(cases).toHaveLength(6);
  expect(cases.filter(c=>c.expectedBugs.length)).toHaveLength(2);
  expect(cases.find(c=>c.id==='guard-isolated')!.files).toHaveLength(2);
});
it('replays the same fixtures without credentials or live calls and scores misses honestly',async()=> {
  const runs=[];
  for(const fixture of cases) runs.push(await runEvaluationCase(fixture,'offline-test',async(request)=> {
    const payload=JSON.parse(request.input[0]!.content);
    expect(payload.sourceFiles[0].numberedLines[0].line).toBe(1);
    return {status:200,body:empty};
  }));
  expect(scoreEvaluation(cases,runs)).toMatchObject({completed:6,expectedBugs:2,detectedBugs:0,missedBugs:2,costUsd:null,citationAcceptanceRate:null});
});
it('requires human semantic labels even when citations match',async()=> {
  const fixture=cases[0]!;
  const candidate={title:'Absent removal',severity:'error',explanation:'A missing value removes the last element.',suggestedAction:'Guard the index.',
    evidence:[{path:'src/remove.ts',startLine:3,endLine:3,excerpt:'  result.splice(result.indexOf(value), 1);'}]};
  const body=JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[candidate]})}]}]});
  const run=await runEvaluationCase(fixture,'offline-test',async()=>({status:200,body}));
  expect(scoreEvaluation([fixture],[run])).toMatchObject({citationAcceptanceRate:1,detectedBugs:0,missedBugs:null,semanticAssessmentComplete:false});
  expect(scoreEvaluation([fixture],[run],[{caseId:fixture.id,candidateIndex:0,verdict:'confirmed',bugId:'missing-value-removal'}])).toMatchObject({detectedBugs:1,missedBugs:0});
  expect(()=>scoreEvaluation([fixture],[run],[{caseId:fixture.id,candidateIndex:0,verdict:'confirmed',bugId:'invented'}])).toThrow('known expected bug');
});
it('keeps failed and absent runs out of clean evaluation claims',async()=> {
  const run=await runEvaluationCase(cases[0]!,'offline-test',async()=>({status:500,body:'provider details'}));
  expect(scoreEvaluation(cases,[run])).toMatchObject({failed:1,completed:0,missedBugs:null,semanticAssessmentComplete:false,costUsd:null});
  expect(()=>scoreEvaluation(cases,[run,run])).toThrow('unique');
});
it('does not count a confirmed label with rejected citations as an evidence-backed detection',()=>{
  const fixture=cases[0]!;
  const run={caseId:fixture.id,model:'offline',status:'completed' as const,error:null,elapsedMs:0,costUsd:0,
    candidates:[{title:'Unverified',explanation:'Fabricated citation',verification:'rejected' as const}]};
  expect(scoreEvaluation([fixture],[run],[{caseId:fixture.id,candidateIndex:0,verdict:'confirmed',bugId:'missing-value-removal'}]))
    .toMatchObject({detectedBugs:0,semanticAssessmentComplete:false,missedBugs:null});
});
