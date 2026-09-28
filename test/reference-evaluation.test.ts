import {expect,it} from 'vitest';
import {readFile} from 'node:fs/promises';
import {scoreReferenceEvaluation} from '../src/ai/reference-evaluation.js';
import {reportSchema} from '../src/findings.js';
const cases=[{id:'clean',expected:'clean' as const}];
const report=reportSchema.parse({schemaVersion:1,root:'fixture',findings:[],inspectionWarnings:[],ai:{execution:'injected',status:'completed',mode:'low-cost',reviewer:'qa/reliability-v2',model:'fixture',plannedModel:'fixture',
  preview:{files:[],skipped:[],serializedBytes:0,limited:false},maxOutputTokens:2000,requestBytes:0,estimatedInputTokens:0,estimatedCostUsd:null,actualCostUsd:null,retries:0,candidates:[],referenceConflicts:[],error:null}});
it('scores clean controls and distinguishes missing or failed runs',()=>{
  expect(scoreReferenceEvaluation(cases,[{caseId:'clean',report}],[]).passed).toBe(1);
  expect(scoreReferenceEvaluation(cases,[],[]).passed).toBe(0);
  expect(scoreReferenceEvaluation(cases,[{caseId:'clean',report:{...report,ai:{...report.ai!,status:'failed'}}}],[]).passed).toBe(0);
});
it('rejects invalid labels and duplicate or unknown runs',()=>{
  expect(()=>scoreReferenceEvaluation(cases,[{caseId:'unknown',report}],[])).toThrow();
  expect(()=>scoreReferenceEvaluation(cases,[{caseId:'clean',report},{caseId:'clean',report}],[])).toThrow();
  expect(()=>scoreReferenceEvaluation(cases,[{caseId:'clean',report}],[{caseId:'clean',kind:'candidate',index:0,verdict:'confirmed'}])).toThrow();
});
it('replays recorded live outcomes with explicit semantic labels and rejects unassessed or fabricated evidence',async()=>{
  const fixtures=JSON.parse(await readFile(new URL('../fixtures/reference-evaluation/cases.json',import.meta.url),'utf8'));
  const recording=JSON.parse(await readFile(new URL('../fixtures/reference-evaluation/recorded-low-cost.json',import.meta.url),'utf8'));
  expect(scoreReferenceEvaluation(fixtures,recording.runs,recording.assessments).passed).toBe(4);
  expect(scoreReferenceEvaluation(fixtures,recording.runs,[]).passed).toBe(1);
  recording.runs[0].report.ai.candidates[0].evidenceVerification.status='rejected';
  expect(scoreReferenceEvaluation(fixtures,recording.runs,recording.assessments).passed).toBe(3);
});
