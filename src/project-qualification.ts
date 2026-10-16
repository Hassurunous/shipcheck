import {z} from 'zod';

const id=z.string().trim().min(1);
const hash=z.string().regex(/^[a-f0-9]{64}$/);
/** Human-reviewed qualification evidence, not a production audit verdict. */
export const projectQualificationSchema=z.object({
  schemaVersion:z.literal(1),
  project:id,
  revision:id,
  reportSha256:hash,
  inventoryScope:id,
  coverage:z.enum(['complete-for-declared-scope','incomplete']),
  knownDefectIds:z.array(id),
  claimIds:z.array(id),
  assessments:z.array(z.object({
    claimId:id, reportSha256:hash, reviewer:id, rationale:id,
    verdict:z.enum(['confirmed','false-positive','uncertain']),
    knownDefectIds:z.array(id).default([]),
  }).strict()),
}).strict().superRefine((record,ctx)=>{
  const reject=(message:string)=>ctx.addIssue({code:'custom',message});
  for(const ids of [record.knownDefectIds,record.claimIds,record.assessments.map(a=>a.claimId)])
    if(new Set(ids).size!==ids.length)reject('Duplicate IDs are not allowed.');
  for(const assessment of record.assessments){
    if(assessment.reportSha256!==record.reportSha256 || !record.claimIds.includes(assessment.claimId))reject('Assessment must identify a claim in this exact report.');
    if(new Set(assessment.knownDefectIds).size!==assessment.knownDefectIds.length || assessment.knownDefectIds.some(b=>!record.knownDefectIds.includes(b)))reject('Unknown or duplicate known defect.');
    if(assessment.verdict!=='confirmed' && assessment.knownDefectIds.length)reject('Only confirmed claims can establish defect detection.');
  }
});

export function scoreProjectQualification(input:unknown){
  const record=projectQualificationSchema.parse(input);
  const confirmed=record.assessments.filter(a=>a.verdict==='confirmed');
  const falsePositives=record.assessments.filter(a=>a.verdict==='false-positive').length;
  const unassessed=record.claimIds.length-record.assessments.filter(a=>a.verdict!=='uncertain').length;
  const detected=new Set(confirmed.flatMap(a=>a.knownDefectIds));
  const unresolved=record.coverage==='incomplete' || unassessed>0;
  const remaining=record.knownDefectIds.length-detected.size;
  return {
    project:record.project,revision:record.revision,reportSha256:record.reportSha256,
    inventoryScope:record.inventoryScope,coverage:record.coverage,
    claims:record.claimIds.length,confirmedClaims:confirmed.length,falsePositiveClaims:falsePositives,
    unassessedClaims:unassessed,
    adjudicatedPrecision:confirmed.length+falsePositives?confirmed.length/(confirmed.length+falsePositives):null,
    knownDefects:record.knownDefectIds.length,detectedKnownDefects:detected.size,
    missedKnownDefects:unresolved?0:remaining,unresolvedKnownDefects:unresolved?remaining:0,
    knownDefectDetectionFraction:record.knownDefectIds.length?detected.size/record.knownDefectIds.length:null,
    generalAccuracy:'not-established' as const,
  };
}
