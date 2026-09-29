import {z} from 'zod';
import {reportSchema,type Report} from '../findings.js';

export const referenceAssessmentSchema=z.object({caseId:z.string(),kind:z.enum(['candidate','conflict']),
  index:z.number().int().nonnegative(),verdict:z.enum(['confirmed','false-positive','uncertain'])}).strict();
type Case={id:string;expected:'defect'|'clean'|'conflict'};
type Run={caseId:string;report:Report};
type Assessment=z.infer<typeof referenceAssessmentSchema>;

/** Semantic verdicts are supplied by a reviewer, never inferred from citation matches. */
export function scoreReferenceEvaluation(cases:Case[],runs:Run[],assessments:Assessment[]) {
  if(new Set(cases.map(item=>item.id)).size!==cases.length || new Set(runs.map(item=>item.caseId)).size!==runs.length
    || runs.some(run=>!cases.some(item=>item.id===run.caseId)))throw new Error('Cases and runs require unique known IDs.');
  const reports=new Map(runs.map(run=>[run.caseId,reportSchema.parse(run.report)]));
  const labels=new Map<string,Assessment>();
  for(const input of assessments) {
    const label=referenceAssessmentSchema.parse(input);const key=`${label.caseId}:${label.kind}:${label.index}`;
    const ai=reports.get(label.caseId)?.ai;
    const item=label.kind==='candidate'?ai?.candidates[label.index]:ai?.referenceConflicts?.[label.index];
    if(!item || labels.has(key))throw new Error('Assessment must identify an existing result exactly once.');
    labels.set(key,label);
  }
  const results=cases.map(fixture=>{
    const ai=reports.get(fixture.id)?.ai;
    let confirmedCandidates=0,confirmedConflicts=0,falsePositives=0,unassessed=0,rejectedCitations=0;
    for(const kind of ['candidate','conflict'] as const) {
      const items=kind==='candidate'?ai?.candidates ?? []:ai?.referenceConflicts ?? [];
      items.forEach((item,index)=>{
        const label=labels.get(`${fixture.id}:${kind}:${index}`);
        if(item.evidenceVerification?.status!=='matched')rejectedCitations++;
        if(!label || label.verdict==='uncertain')unassessed++;
        else if(label.verdict==='false-positive')falsePositives++;
        else if(kind==='candidate')confirmedCandidates++;
        else confirmedConflicts++;
      });
    }
    const observedCandidates=ai?.candidates.length ?? 0,observedConflicts=ai?.referenceConflicts?.length ?? 0;
    const contextUsable=ai && !ai.preview.limited
      && !ai.preview.files.some(file=>file.freshness==='changed-or-unavailable')
      && !ai.preview.references?.some(ref=>!['included','not-applicable'].includes(ref.status) || ref.freshness==='changed-or-unavailable');
    const supported=ai?.status==='completed' && ['live','injected'].includes(ai.execution) && contextUsable
      && unassessed===0 && rejectedCitations===0 && falsePositives===0;
    const passed=Boolean(supported && (fixture.expected==='defect'?confirmedCandidates>0 && observedConflicts===0
      :fixture.expected==='conflict'?confirmedConflicts>0 && observedCandidates===0
      :observedCandidates===0 && observedConflicts===0));
    return {caseId:fixture.id,expected:fixture.expected,completed:ai?.status==='completed',passed,
      confirmedCandidates,confirmedConflicts,falsePositives,unassessed,rejectedCitations};
  });
  return {cases:results.length,passed:results.filter(item=>item.passed).length,
    completed:results.filter(item=>item.completed).length,results};
}
