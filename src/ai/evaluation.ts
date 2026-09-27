import {z} from 'zod';
import {createHash} from 'node:crypto';
import {aiSettingsSchema} from './contracts.js';
import {buildRequest,requestQa,type ResponseTransport,AiFailure} from './client.js';
import {verifyEvidence} from './verify-evidence.js';
import type {AiContext} from './context.js';

export const evaluationCaseSchema=z.object({id:z.string().min(1),variant:z.enum(['isolated','mixed','cross-file']),
  description:z.string(),expectedBugs:z.array(z.object({id:z.string(),description:z.string()})),
  files:z.array(z.object({path:z.string(),content:z.string()})).min(1)}).strict();
export type EvaluationCase=z.infer<typeof evaluationCaseSchema>;
export type EvaluationRun={caseId:string;model:string;status:'completed'|'failed';error:string|null;
  candidates:Array<{title:string;explanation:string;verification:'matched'|'rejected'}>;
  elapsedMs:number;costUsd:number|null};

/** Explicit transport only: evaluation never looks up credentials or starts live requests itself. */
export async function runEvaluationCase(input:EvaluationCase,model:string,transport:ResponseTransport,apiKey='offline-evaluation'):Promise<EvaluationRun> {
  const fixture=evaluationCaseSchema.parse(input);
  const context:AiContext={files:fixture.files,preview:{files:fixture.files.map(file=>({path:file.path,
    bytes:Buffer.byteLength(file.content),lines:file.content.split(/\r\n|\n|\r/).length,
    sha256:createHash('sha256').update(file.content).digest('hex')})),skipped:[],limited:false,
    serializedBytes:Buffer.byteLength(JSON.stringify(fixture.files))}};
  const started=Date.now();
  try {
    const output=await requestQa(transport,buildRequest(context,aiSettingsSchema.parse({maxOutputTokens:2000,timeoutMs:60000}),model),context,60000,apiKey);
    return {caseId:fixture.id,model,status:'completed',error:null,candidates:output.candidates.map(candidate=>({
      title:candidate.title,explanation:candidate.explanation,verification:verifyEvidence(candidate,context,context).status})),elapsedMs:Date.now()-started,costUsd:null};
  } catch(error) {
    return {caseId:fixture.id,model,status:'failed',error:error instanceof AiFailure?error.code:'evaluation-error',candidates:[],elapsedMs:Date.now()-started,costUsd:null};
  }
}

export const assessmentSchema=z.object({caseId:z.string(),candidateIndex:z.number().int().nonnegative(),
  verdict:z.enum(['confirmed','false-positive','uncertain']),bugId:z.string().optional()}).strict();
export type Assessment=z.infer<typeof assessmentSchema>;

/** Human labels establish semantic outcomes; citation matches alone never count as true positives. */
export function scoreEvaluation(cases:EvaluationCase[],runs:EvaluationRun[],assessments:Assessment[]=[]) {
  const caseMap=new Map(cases.map(c=>[c.id,c]));
  if(caseMap.size!==cases.length || new Set(runs.map(r=>r.caseId)).size!==runs.length || runs.some(r=>!caseMap.has(r.caseId))) throw new Error('Each evaluation case/run must have a unique known case ID. Score one model run at a time.');
  if(new Set(runs.map(r=>r.model)).size>1) throw new Error('Score models separately.');
  const labels=new Map<string,Assessment>();
  for(const input of assessments) {
    const label=assessmentSchema.parse(input);const key=`${label.caseId}:${label.candidateIndex}`;
    const run=runs.find(r=>r.caseId===label.caseId);
    if(!run?.candidates[label.candidateIndex] || labels.has(key)) throw new Error('Assessment must reference one existing candidate exactly once.');
    if(label.verdict==='confirmed' && !caseMap.get(label.caseId)!.expectedBugs.some(b=>b.id===label.bugId)) throw new Error('Confirmed assessment requires a known expected bug ID.');
    labels.set(key,label);
  }
  let confirmed=0,falsePositives=0,unassessed=0,matched=0,total=0;
  const detected=new Set<string>();
  for(const run of runs) run.candidates.forEach((candidate,index)=>{
    total++;if(candidate.verification==='matched')matched++;
    const label=labels.get(`${run.caseId}:${index}`);
    if(!label || label.verdict==='uncertain')unassessed++;
    else if(label.verdict==='false-positive')falsePositives++;
    else {confirmed++;detected.add(`${run.caseId}:${label.bugId}`);}
  });
  const expected=cases.reduce((sum,c)=>sum+c.expectedBugs.length,0);
  const incomplete=runs.length!==cases.length || runs.some(r=>r.status==='failed') || unassessed>0;
  return {cases:cases.length,completed:runs.filter(r=>r.status==='completed').length,failed:runs.filter(r=>r.status==='failed').length,
    candidates:total,citationMatches:matched,citationAcceptanceRate:total?matched/total:null,
    confirmedCandidates:confirmed,falsePositives,unassessedCandidates:unassessed,expectedBugs:expected,
    detectedBugs:detected.size,missedBugs:incomplete?null:expected-detected.size,semanticAssessmentComplete:!incomplete,
    costUsd:runs.length===cases.length && runs.every(r=>r.costUsd!==null)?runs.reduce((sum,r)=>sum+r.costUsd!,0):null};
}
