import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const [evaluationPath,labelsPath,...extra]=process.argv.slice(2);
assert.ok(evaluationPath && labelsPath && !extra.length,'Usage: node scripts/score-evidence-comparison.mjs <evaluation.json> <labels.json>');
const hash=value=>createHash('sha256').update(value).digest('hex');
const corpus=await readFile(new URL('../fixtures/evidence-comparison/cases.json',import.meta.url),'utf8');
const cases=JSON.parse(corpus),evaluation=JSON.parse(await readFile(evaluationPath,'utf8')),labels=JSON.parse(await readFile(labelsPath,'utf8'));
assert.equal(evaluation.manifest.corpusSha256,hash(corpus),'Corpus changed');assert.equal(evaluation.manifest.mode,'--live');
const keys=new Set();
for(const run of evaluation.runs){const key=run.caseId+':'+run.arm;assert.ok(cases.some(c=>c.id===run.caseId) && ['withheld','supplied'].includes(run.arm) && !keys.has(key),'Unknown/duplicate run');keys.add(key);}
const assessed=new Map();
for(const label of labels){const run=evaluation.runs.find(r=>r.caseId===label.caseId && r.arm===label.arm);const key=label.caseId+':'+label.arm+':'+label.candidate;
 assert.ok(run && Number.isInteger(label.candidate) && run.output?.candidates[label.candidate] && !assessed.has(key),'Unknown/duplicate candidate');
 assert.equal(label.runHash,hash(JSON.stringify(run)),'Stale assessment');
 assert.ok(['confirmed','false-positive','uncertain'].includes(label.verdict) && typeof label.unsupportedExecution==='boolean' && typeof label.rationale==='string' && label.rationale.trim());
 if(label.verdict==='confirmed')assert.equal(cases.find(c=>c.id===label.caseId).kind,'defect','Clean/incomplete controls cannot confirm seeded defects');
 assessed.set(key,label);
}
const summaries={};
for(const arm of ['withheld','supplied']){
 const totals={expectedBugs:cases.filter(c=>c.kind==='defect').length,detectedBugs:0,missedBugs:0,unresolvedBugs:0,falsePositiveClaims:0,unassessedClaims:0,unsupportedExecutionClaims:0,cleanControlsClear:0,incompleteControlsAbstained:0,contradictedPremises:0,unknownPremises:0};
 for(const fixture of cases){const run=evaluation.runs.find(r=>r.caseId===fixture.id && r.arm===arm);let detected=false,unassessed=!run?.output;
  for(const [index] of (run?.output?.candidates ?? []).entries()){
   const label=assessed.get(fixture.id+':'+arm+':'+index),verification=run.verifications?.[index];
   if(label?.unsupportedExecution)totals.unsupportedExecutionClaims++;
   if(verification?.execution.status==='contradicted')totals.contradictedPremises++;
   if(verification?.execution.status==='unknown')totals.unknownPremises++;
   if(label?.verdict==='false-positive')totals.falsePositiveClaims++;
   else if(label?.verdict==='confirmed' && verification?.citations.status==='matched' && !['contradicted','unknown'].includes(verification?.execution.status))detected=true;
   else {totals.unassessedClaims++;unassessed=true;}
  }
  if(fixture.kind==='defect'){if(detected)totals.detectedBugs++;else if(unassessed)totals.unresolvedBugs++;else totals.missedBugs++;}
  if(fixture.kind==='clean' && run?.output?.candidates.length===0)totals.cleanControlsClear++;
  if(fixture.kind==='incomplete' && run?.output?.candidates.length===0)totals.incompleteControlsAbstained++;
 }
 summaries[arm]=totals;
}
console.log(JSON.stringify(summaries,null,2));
