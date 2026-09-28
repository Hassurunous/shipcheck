import {describeCurrentTask,type CurrentTask} from '../task-file.js';
import {taskReviewSchema,type AiResult,type QaOutput} from './contracts.js';
import type {AiContext} from './context.js';
import {verifyEvidence} from './verify-evidence.js';

export function pendingTaskReview(task:CurrentTask) {
  return taskReviewSchema.parse({taskHash:describeCurrentTask(task).sha256,state:'not-assessed',freshness:'not-checked',
    assessments:task.requirements.map(item=>({requirementId:item.id,status:'insufficient-evidence',proposedStatus:'insufficient-evidence',
      explanation:'No requirement assessment completed.',relatedRequirementIds:[],evidence:[]}))});
}
export function invalidateTaskReview(review:NonNullable<AiResult['taskReview']>) {
  review.state='changed';review.freshness='changed-or-unavailable';
  for(const assessment of review.assessments) {
    assessment.status='insufficient-evidence';
    assessment.explanation='Task expectations changed or became unavailable during review. Re-run before acting on the original assessment. '+assessment.explanation;
  }
}
export function finishTaskReview(task:CurrentTask,output:QaOutput,submitted:AiContext,current:AiContext,
  referenceConflicts:NonNullable<AiResult['referenceConflicts']>,synthetic:boolean) {
  const review=pendingTaskReview(task);
  const conflictedPaths=new Set(referenceConflicts.flatMap(item=>item.evidence.map(e=>e.path)));
  review.assessments=task.requirements.map(requirement=>{
    const assessment=output.taskAssessments!.find(item=>item.requirementId===requirement.id)!;
    const verification=assessment.evidence.length?verifyEvidence(assessment,submitted,current):undefined;
    let status=assessment.status,explanation=assessment.explanation;
    if(verification?.status==='rejected' || synthetic) {
      status='insufficient-evidence';explanation=(synthetic?'Synthetic mock; no real assessment. ':'Evidence could not be verified. ')+explanation;
    } else if(assessment.evidence.some(item=>conflictedPaths.has(item.path))) {
      status='needs-clarification';explanation='Cites a disputed reference. '+explanation;
    } else if(status==='supporting-evidence' && (task.files.some(path=>!submitted.files.some(file=>file.path===path))
      || task.files.some(path=>current.files.find(file=>file.path===path)?.content!==submitted.files.find(file=>file.path===path)?.content)
      || submitted.preview.dependencies?.some(item=>item.status!=='included')
      || submitted.preview.references?.some(item=>!['included','not-applicable'].includes(item.status) || item.freshness==='changed-or-unavailable'))) {
      status='insufficient-evidence';explanation='Selected task files or applicable reference context are incomplete or changed. '+explanation;
    }
    return {...assessment,status,explanation,proposedStatus:assessment.status,...(verification?{evidenceVerification:verification}:{})};
  });
  review.state=synthetic?'not-assessed':review.assessments.some(item=>['insufficient-evidence','needs-clarification'].includes(item.status))?'partial':'assessed';
  return review;
}
