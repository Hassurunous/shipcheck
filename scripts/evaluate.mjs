import {readFile} from 'node:fs/promises';
import {readBoundedConfig} from '../dist/src/filesystem-policy.js';
import {evaluationCaseSchema,runEvaluationCase,scoreEvaluation} from '../dist/src/ai/evaluation.js';

// Replay saved provider envelopes; this command never calls a network service.
// Input: {model, responses:{caseId:{status,body,costUsd?}}, assessments?:[]}
try {
  const path=process.argv[2];
  if(!path || process.argv.length>3) throw new Error('Usage: npm run evaluate -- <recorded-responses.json> (offline replay only)');
  const input=JSON.parse(await readBoundedConfig(path));
  if(typeof input.model!=='string' || !input.responses || typeof input.responses!=='object') throw new Error('Expected model and responses.');
  const cases=JSON.parse(await readFile(new URL('../fixtures/evaluation/cases.json',import.meta.url),'utf8')).map(c=>evaluationCaseSchema.parse(c));
  const runs=[];
  for(const fixture of cases) {
    const response=input.responses[fixture.id];
    if(!response) continue;
    if(!Number.isInteger(response.status) || typeof response.body!=='string') throw new Error('Each recorded response requires HTTP status and body text.');
    const run=await runEvaluationCase(fixture,input.model,async()=>({status:response.status,body:response.body}));
    if(response.costUsd!==undefined) {
      if(typeof response.costUsd!=='number' || !Number.isFinite(response.costUsd) || response.costUsd<0) throw new Error('Invalid recorded cost.');
      run.costUsd=response.costUsd;
    }
    runs.push(run);
  }
  console.log(JSON.stringify({summary:scoreEvaluation(cases,runs,input.assessments??[]),runs},null,2));
} catch(error) {console.error(error instanceof Error?error.message:'Evaluation failed');process.exitCode=2;}
