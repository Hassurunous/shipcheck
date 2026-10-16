import {expect,it} from 'vitest';
import {scoreProjectQualification} from '../src/project-qualification.js';
const sha='a'.repeat(64);
const base=()=>({schemaVersion:1,project:'external',revision:'pinned',reportSha256:sha,inventoryScope:'All diagnostics and findings',coverage:'complete-for-declared-scope',knownDefectIds:['bug'],claimIds:['one','two'],assessments:[] as object[]});
const label=(claimId:string,verdict='confirmed',knownDefectIds:string[]=[])=>({claimId,verdict,knownDefectIds,reportSha256:sha,reviewer:'reviewer',rationale:'Compared against requirements and reproduced behavior.'});
it('leaves unexpected findings unassessed rather than calling them false positives',()=>{
  expect(scoreProjectQualification(base())).toMatchObject({falsePositiveClaims:0,unassessedClaims:2,unresolvedKnownDefects:1,adjudicatedPrecision:null});
});
it('accepts newly discovered bugs without requiring an existing known-bug label',()=>{
  const record=base();record.assessments=[label('one'),label('two','false-positive')];
  expect(scoreProjectQualification(record)).toMatchObject({confirmedClaims:1,falsePositiveClaims:1,adjudicatedPrecision:0.5,missedKnownDefects:1});
});
it('deduplicates known defects and separates precision from known-defect detection',()=>{
  const record=base();record.assessments=[label('one','confirmed',['bug']),label('two','confirmed',['bug'])];
  expect(scoreProjectQualification(record)).toMatchObject({confirmedClaims:2,detectedKnownDefects:1,knownDefectDetectionFraction:1,generalAccuracy:'not-established'});
});
it('keeps incomplete runs and uncertain judgments unresolved',()=>{
  for(const coverage of ['incomplete','complete-for-declared-scope']){
    const record={...base(),coverage,assessments:[label('one','uncertain'),label('two')]};
    expect(scoreProjectQualification(record)).toMatchObject({missedKnownDefects:0,unresolvedKnownDefects:1});
  }
});
it('does not manufacture accuracy for empty controls',()=>{
  expect(scoreProjectQualification({...base(),claimIds:[],knownDefectIds:[]})).toMatchObject({adjudicatedPrecision:null,knownDefectDetectionFraction:null,generalAccuracy:'not-established'});
});
it('rejects stale, duplicate, unknown and contradictory assessments',()=>{
  for(const assessments of [[{...label('one'),reportSha256:'b'.repeat(64)}],[label('one'),label('one')],[label('missing')],[label('one','confirmed',['unknown'])],[label('one','false-positive',['bug'])]])
    expect(()=>scoreProjectQualification({...base(),assessments})).toThrow();
  expect(()=>scoreProjectQualification({...base(),claimIds:['one','one']})).toThrow();
});
