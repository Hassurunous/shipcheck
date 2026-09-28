import {readFile} from 'node:fs/promises';
import {readBoundedConfig} from '../dist/src/filesystem-policy.js';
import {scoreReferenceEvaluation} from '../dist/src/ai/reference-evaluation.js';

// Offline only. Recorded reports and explicit reviewer labels are both required.
try {
  const path=process.argv[2];
  if(!path || process.argv.length!==3)throw new Error('Usage: node scripts/score-reference-evaluation.mjs <recorded-evaluation.json>');
  const cases=JSON.parse(await readFile(new URL('../fixtures/reference-evaluation/cases.json',import.meta.url),'utf8'));
  const input=JSON.parse(await readBoundedConfig(path));
  const result=scoreReferenceEvaluation(cases,input.runs,input.assessments);
  console.log(JSON.stringify(result,null,2));
  if(result.passed!==result.cases)process.exitCode=1;
} catch(error){console.error(error instanceof Error?error.message:'Scoring failed');process.exitCode=2;}
