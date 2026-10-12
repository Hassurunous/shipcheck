import {createHash} from 'node:crypto';
import {z} from 'zod';
import {reportSchema,type Report} from './findings.js';
const path=z.string().min(1).refine(p=>!/[\\:\u0000-\u001f]/.test(p) && p.split('/').every(s=>s && s!=='.' && s!=='..'));
export const effectivenessCaseSchema=z.object({
  id:z.string().regex(/^[a-z][a-z0-9-]+$/),category:z.string(),kind:z.enum(['defect','clean','incomplete']),description:z.string(),
  files:z.record(path,z.string()),sourcePaths:z.array(path).min(1),config:z.record(z.string(),z.unknown()),
  tools:z.array(z.enum(['eslint','ruff','typescript','node-test'])),
  expectedBugs:z.array(z.object({id:z.string(),description:z.string(),signals:z.array(z.string())})),oracle:z.string().optional(),
}).strict().superRefine((c,ctx)=>{
  if(c.sourcePaths.some(p=>!Object.hasOwn(c.files,p)) || new Set(c.sourcePaths).size!==c.sourcePaths.length)ctx.addIssue({code:'custom',message:'Source paths must be unique fixture files.'});
  if((c.kind==='defect')!==(c.expectedBugs.length>0) || new Set(c.expectedBugs.map(b=>b.id)).size!==c.expectedBugs.length)ctx.addIssue({code:'custom',message:'Only defect cases have unique expected bugs.'});
});
export type EffectivenessCase=z.infer<typeof effectivenessCaseSchema>;
export const effectivenessLabelSchema=z.object({caseId:z.string(),reportHash:z.string().regex(/^[a-f0-9]{64}$/),claimId:z.string(),
  verdict:z.enum(['confirmed','false-positive','uncertain']),bugId:z.string().optional(),rationale:z.string().min(1)}).strict();
export type EffectivenessLabel=z.infer<typeof effectivenessLabelSchema>;
export type EffectivenessRun={caseId:string;exitCode:number;report:Report};
export const reportHash=(report:Report)=>createHash('sha256').update(JSON.stringify(report)).digest('hex');
type Claim={id:string;signal:string|null;verified:boolean};
/** Exact deterministic signals are fixture-specific assertions, not a general semantic classifier. */
export function effectivenessClaims(report:Report):Claim[] {
  const claims:Claim[]=[];
  for(const f of report.findings)claims.push({id:'finding:'+f.id,signal:'finding:'+f.ruleId,verified:true});
  for(const c of report.checks ?? []) {
    for(const d of c.diagnostics ?? [])claims.push({id:'diagnostic:'+d.id,signal:'diagnostic:'+d.tool+':'+d.ruleId+':'+d.path,verified:true});
    if(c.status==='failed' && !c.diagnostics?.length)claims.push({id:'check:'+c.id,signal:'check:'+c.id,verified:true});
  }
  for(const binding of report.contracts ?? [])for(const call of binding.calls)if(call.status==='mismatch')claims.push({id:'contract:'+binding.id+':'+call.path,signal:'contract:'+binding.id+':'+call.path,verified:true});
  for(const b of report.architecture?.boundaries ?? [])if(b.status==='violation')claims.push({id:'boundary:'+b.id,signal:'boundary:'+b.id,verified:true});
  for(const [i,c] of (report.ai?.candidates ?? []).entries())claims.push({id:'ai:'+i,signal:null,verified:c.evidenceVerification?.status==='matched'});
  for(const [i,c] of (report.ai?.referenceConflicts ?? []).entries())claims.push({id:'conflict:'+i,signal:null,verified:c.evidenceVerification?.status==='matched'});
  return [...new Map(claims.map(c=>[c.id,c])).values()];
}
export function scoreEffectiveness(caseInputs:EffectivenessCase[],runs:EffectivenessRun[],labelInputs:EffectivenessLabel[]=[],mode:'offline'|'live'='offline') {
  const cases=caseInputs.map(c=>effectivenessCaseSchema.parse(c));
  if(new Set(cases.map(c=>c.id)).size!==cases.length || new Set(runs.map(r=>r.caseId)).size!==runs.length || runs.some(r=>!cases.some(c=>c.id===r.caseId)))throw Error('Unique known case/run IDs required.');
  if(mode==='offline' && runs.some(r=>r.report.ai || r.report.aiAudit))throw Error('Offline scoring requires reports without AI execution.');
  const labels=labelInputs.map(l=>effectivenessLabelSchema.parse(l));
  const labelMap=new Map<string,EffectivenessLabel>();
  for(const l of labels){const run=runs.find(r=>r.caseId===l.caseId);const key=l.caseId+':'+l.claimId;
    if(!run || reportHash(run.report)!==l.reportHash || labelMap.has(key) || !effectivenessClaims(run.report).some(c=>c.id===l.claimId && c.signal===null))throw Error('Label must identify a unique AI claim in this exact report.');
    if(l.verdict==='confirmed' && !cases.find(c=>c.id===l.caseId)!.expectedBugs.some(b=>b.id===l.bugId))throw Error('Confirmation requires an expected bug ID.');
    labelMap.set(key,l);
  }
  const results=cases.map(c=>{
    const run=runs.find(r=>r.caseId===c.id),report=run?reportSchema.parse(run.report):undefined;
    const detected=new Set<string>();let falsePositives=0,unassessed=0;
    for(const claim of report?effectivenessClaims(report):[]) {
      if(claim.signal!==null){const bugs=c.expectedBugs.filter(b=>b.signals.includes(claim.signal!));if(bugs.length)bugs.forEach(b=>detected.add(b.id));else falsePositives++;}
      else if(mode==='live') {const label=labelMap.get(c.id+':'+claim.id);
        if(!label || label.verdict==='uncertain')unassessed++;
        else if(label.verdict==='false-positive')falsePositives++;
        else if(claim.verified && report?.ai?.status==='completed' && report.ai.execution==='live')detected.add(label.bugId!);
        else unassessed++;
      }
    }
    const ai=report?.ai;
    const aiIncomplete=mode==='live' && (!ai || ai.execution!=='live' || ai.status!=='completed' || ai.preview.limited
      || c.sourcePaths.some(p=>!ai.coverage?.validResponsePaths.includes(p))
      || ai.preview.files.some(f=>f.freshness==='changed-or-unavailable')
      || ai.preview.references?.some(r=>!['included','not-applicable'].includes(r.status) || r.freshness==='changed-or-unavailable'));
    const toolIds=c.tools.map(t=>t==='typescript'?'types':t==='node-test'?'tests':'lint');
    const toolIncomplete=toolIds.some(id=>!report?.checks?.some(check=>check.id===id && ['passed','failed'].includes(check.status)))
      || report?.checks?.some(check=>['error','skipped'].includes(check.status));
    const stageIncomplete=report?.references?.state==='incomplete' || report?.contracts?.some(binding=>binding.state!=='checked') || report?.architecture?.state==='partial';
    const incomplete=!run || run.exitCode===2 || (report?.inspectionWarnings.length ?? 0)>0 || toolIncomplete || stageIncomplete || aiIncomplete || unassessed>0;
    return {caseId:c.id,category:c.category,kind:c.kind,expectedBugs:c.expectedBugs.length,detectedBugs:detected.size,
      detectedIds:[...detected].sort(),missedBugs:incomplete?0:c.expectedBugs.length-detected.size,
      unresolvedBugs:incomplete?c.expectedBugs.length-detected.size:0,falsePositives,unassessed,incomplete:Boolean(incomplete),
      cleanControl:c.kind==='clean'?(incomplete?'incomplete':falsePositives?'false-positive':'clear'):null};
  });
  const sum=(key:'expectedBugs'|'detectedBugs'|'missedBugs'|'unresolvedBugs'|'falsePositives'|'unassessed')=>results.reduce((n,r)=>n+r[key],0);
  return {mode,cases:cases.length,completedCases:results.filter(r=>!r.incomplete).length,incompleteCases:results.filter(r=>r.incomplete).length,
    expectedBugs:sum('expectedBugs'),detectedBugs:sum('detectedBugs'),missedBugs:sum('missedBugs'),unresolvedBugs:sum('unresolvedBugs'),
    falsePositiveClaims:sum('falsePositives'),unassessedClaims:sum('unassessed'),
    detectionFraction:sum('expectedBugs')?sum('detectedBugs')/sum('expectedBugs'):null,
    cleanControls:{total:results.filter(r=>r.kind==='clean').length,clear:results.filter(r=>r.cleanControl==='clear').length,
      falsePositive:results.filter(r=>r.cleanControl==='false-positive').length,incomplete:results.filter(r=>r.cleanControl==='incomplete').length},
    results};
}
