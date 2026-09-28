import {readFile} from 'node:fs/promises';
import {readBoundedConfig} from '../dist/src/filesystem-policy.js';
import {scoreTaskEvaluation} from '../dist/src/ai/task-evaluation.js';
try {
  const path=process.argv[2];if(!path || process.argv.length!==3)throw new Error('Usage: node scripts/score-task-evaluation.mjs <recorded-evaluation.json>');
  const cases=JSON.parse(await readFile(new URL('../fixtures/task-evaluation/cases.json',import.meta.url),'utf8'));
  const recording=JSON.parse(await readBoundedConfig(path));
  const result=scoreTaskEvaluation(cases,recording.runs,recording.labels);
  console.log(JSON.stringify(result,null,2));if(result.passed!==result.cases)process.exitCode=1;
} catch(error){console.error(error instanceof Error?error.message:'Scoring failed');process.exitCode=2;}
