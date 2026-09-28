import {expect,it} from 'vitest';
import {readFile} from 'node:fs/promises';
import {scoreTaskEvaluation} from '../src/ai/task-evaluation.js';
it('scores recorded live cases with explicit semantic labels and fails closed for stale or unverified results',async()=>{
  const cases=JSON.parse(await readFile(new URL('../fixtures/task-evaluation/cases.json',import.meta.url),'utf8'));
  const record=JSON.parse(await readFile(new URL('../fixtures/task-evaluation/recorded-low-cost.json',import.meta.url),'utf8'));
  expect(scoreTaskEvaluation(cases,record.runs,record.labels).passed).toBe(5);
  expect(scoreTaskEvaluation(cases,record.runs,[]).passed).toBe(0);
  expect(scoreTaskEvaluation(cases,[],[]).passed).toBe(0);
  expect(()=>scoreTaskEvaluation(cases,record.runs,[...record.labels,record.labels[0]])).toThrow();
  record.runs[0].report.ai.taskReview.freshness='changed-or-unavailable';
  expect(scoreTaskEvaluation(cases,record.runs,record.labels).passed).toBe(4);
  record.runs[1].report.ai.taskReview.assessments[0].evidenceVerification.status='rejected';
  expect(scoreTaskEvaluation(cases,record.runs,record.labels).passed).toBe(3);
});
