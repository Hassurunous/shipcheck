import {reportSchema,type Report} from '../findings.js';
import type {AiResult} from './contracts.js';
type Status=NonNullable<AiResult['taskReview']>['assessments'][number]['status'];
type Case={id:string;expected:Record<string,Status>};
type Label={caseId:string;requirementId:string;accepted:boolean};
/** Explicit reviewer labels complement structural/citation checks; statuses alone do not establish quality. */
export function scoreTaskEvaluation(cases:Case[],runs:{caseId:string;report:Report}[],labels:Label[]) {
  if(new Set(cases.map(item=>item.id)).size!==cases.length || new Set(runs.map(item=>item.caseId)).size!==runs.length
    || runs.some(run=>!cases.some(item=>item.id===run.caseId)))throw new Error('Cases and runs must have unique known IDs.');
  const reports=new Map(runs.map(run=>[run.caseId,reportSchema.parse(run.report)]));
  const decisions=new Map<string,boolean>();
  for(const label of labels) {
    const key=`${label.caseId}:${label.requirementId}`;
    if(typeof label.accepted!=='boolean' || decisions.has(key) || !reports.get(label.caseId)?.ai?.taskReview?.assessments.some(item=>item.requirementId===label.requirementId))
      throw new Error('Labels require an existing criterion, a boolean decision and no duplicates.');
    decisions.set(key,label.accepted);
  }
  const results=cases.map(fixture=>{
    const ai=reports.get(fixture.id)?.ai;const review=ai?.taskReview;
    const criteria=Object.entries(fixture.expected).map(([id,expected])=>{
      const assessment=review?.assessments.find(item=>item.requirementId===id);
      const verified=assessment && (assessment.evidence.length>0?assessment.evidenceVerification?.status==='matched':!['supporting-evidence','potential-violation'].includes(assessment.status));
      return {id,expected,observed:assessment?.status ?? null,passed:Boolean(verified && assessment?.status===expected && decisions.get(`${fixture.id}:${id}`)===true)};
    });
    return {caseId:fixture.id,criteria,passed:ai?.status==='completed' && review?.freshness==='unchanged'
      && ['assessed','partial'].includes(review.state) && review.assessments.length===criteria.length
      && new Set(review.assessments.map(item=>item.requirementId)).size===criteria.length && criteria.every(item=>item.passed)};
  });
  return {cases:cases.length,passed:results.filter(item=>item.passed).length,results};
}
