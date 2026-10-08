import type {Report} from './findings.js';
import type {RepositoryProfile} from './repository-profile.js';
import {ruleDefaults,type Config} from './config.js';
import {auditSummarySchema,type AuditStage,type AuditSummary} from './audit-summary-contracts.js';
const unique=(paths:string[])=>[...new Set(paths)].sort();
function stage(id:string,label:string,status:AuditStage['status'],explanation:string,files:string[]|null=null,scope:AuditStage['scope']='configured-paths'):AuditStage {
  return {id,label,status,explanation,scope,files:files===null?null:unique(files),selectedFiles:[],omitted:[],limitations:[]};
}
/** Captured inspection facts only: inventory is never represented as semantic review. */
export function inspectionStages(profile:RepositoryProfile,config:Config):AuditStage[] {
  const inspection=stage('inspection','Repository inspection',profile.warnings.length?'partial':'completed',
    'Inventory, bounded text reads and manifest facts; not general code-quality analysis.',profile.inspectedFiles ?? null,'repository');
  inspection.selectedFiles=unique(profile.files.map(file=>file.path));
  inspection.omitted=profile.warnings.filter(w=>w.code!=='invalid-manifest').map(w=>({path:w.path,reason:w.code})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:a.reason<b.reason?-1:1);
  inspection.limitations=['Excluded subtrees were not enumerated; see ignorePolicy.',
    'Detected languages describe inventory, not analyzer support.',...(profile.inspectedFiles===undefined?['This older profile has no exact successful-read inventory.']:[])];
  const enabled=Object.entries(ruleDefaults).some(([id,level])=>(config.rules[id] ?? level)!=='off')
    || config.overrides.some(o=>Object.values(o.rules).some(level=>level!=='off'));
  const rules=stage('deterministic','Built-in deterministic rules',enabled?(inspection.status==='partial'?'partial':'completed'):'disabled',
    enabled?'Configured package/local-path checks and optional repository/marker policies were evaluated.':'All built-in rules are disabled by configuration.',enabled?profile.inspectedFiles ?? null:[],'repository');
  rules.limitations=['Rules have narrow triggers; reading a file does not mean its correctness, security or maintainability was analyzed.',
    'Per-path rule overrides apply. No linter, typechecker or tests are run by these rules.'];
  return [inspection,rules];
}
type Options={config?:Config;aiRequested?:'preview'|'mock'|'live'|undefined;checksAuthorized?:boolean|undefined;workflow?:boolean;emptyDiff?:boolean};
/** Derive stage disclosure from actual results, preserving detailed original report fields. */
export function summarizeAudit(report:Report,options:Options={}):AuditSummary {
  const config=options.config;
  const stages:AuditStage[]=(report.auditSummary?.stages.filter(s=>s.id==='inspection' || s.id==='deterministic') ?? []).map(s=>({...s}));
  if(options.emptyDiff) {
    for(const [id,label] of [['inspection','Repository inspection'],['deterministic','Built-in deterministic rules'],['external-checks','External checks'],['references','Reference loading'],['http-contracts','HTTP contracts'],['sdk-contracts','SDK contracts'],['architecture','Architecture policies'],['ai','AI code review'],['task','Task assessment']])
      stages.push(stage(id!,label!,'skipped','Empty diff: no content inspection or analysis was performed.',[],'selected-paths'));
    return auditSummarySchema.parse({outcome:'not-assessed',generalQualityVerdict:'not-established',conclusion:'No eligible changed paths. No code-quality assessment was performed.',stages});
  }
  if(report.workflow?.scope!==null && report.workflow?.scope!==undefined) {
    const rules=stages.find(s=>s.id==='deterministic');
    if(rules)rules.limitations=[...rules.limitations,'Repository facts were collected, but reported findings are filtered to workflow-selected paths.'];
  }
  const checks=report.checks ?? [];
  if(!checks.length)stages.push(stage('external-checks','External checks',config?.checks.length?'not-run':'not-configured',
    config?.checks.length?'Configured commands were not run by this entry point.':'No external checks are configured. Linting, typechecking and tests were not automatically performed.',[],'tool-defined'));
  for(const check of checks) {
    const state:AuditStage['status']=check.status==='skipped'?(options.checksAuthorized===false?'not-authorized':'skipped'):check.status==='error'?'failed':check.status==='failed'?'failed':'completed';
    const item=stage('external:'+check.id,'External check: '+check.id,state,check.status.toUpperCase()+': '+check.reason,check.status==='skipped'?[]:null,'tool-defined');
    item.limitations=['Exact checked files are not attested by this command result. Diagnostic paths alone are not a complete coverage list.',
      'A command name does not establish which analyses it performed. Its own configuration and ignores apply.'];stages.push(item);
  }
  const refs=report.references;
  const reference=stage('references','Reference loading',refs?(refs.resources.every(r=>r.status==='not-applicable')?'skipped':refs.resources.some(r=>!['loaded','not-applicable'].includes(r.status))?'partial':'completed'):config?.resources.length?'not-run':'not-configured',
    refs?'Reference snapshots were requested; loading documentation is not requirements verification.':'No reference snapshots were loaded.',refs?refs.resources.filter(r=>r.status==='loaded').map(r=>r.path):[]);
  if(refs)reference.omitted=refs.resources.filter(r=>r.status!=='loaded').map(r=>({path:r.path,reason:r.status}));stages.push(reference);
  for(const [id,label,results,configured] of [
    ['http-contracts','HTTP contracts',report.contracts,(config?.contracts.length ?? 0)>0],
    ['sdk-contracts','SDK contracts',report.sdkContracts,(config?.sdkContracts.length ?? 0)>0],
  ] as const) {
    const item=stage(id,label,results?.length?(results.some(r=>r.state!=='checked')?'partial':'completed'):configured?(options.workflow?'skipped':'not-run'):'not-configured',
      results?.length?'Only explicitly mapped interfaces and supported static call patterns were assessed.':'No mapped calls were assessed.',results?.flatMap(r=>r.files.filter(f=>f.sha256!==null && f.status!=='unsupported-language').map(f=>f.path)) ?? []);
    item.selectedFiles=unique(results?.flatMap(r=>r.files.map(f=>f.path)) ?? []);
    item.omitted=results?.flatMap(r=>r.files.filter(f=>f.status!=='loaded').map(f=>({path:f.path,reason:f.status}))) ?? [];
    item.limitations=results?.flatMap(r=>r.issues.map(issue=>r.id+': '+issue)) ?? [];stages.push(item);
  }
  const architecture=report.architecture;
  const arch=stage('architecture','Architecture policies',architecture?(architecture.state==='partial'?'partial':'completed'):config?.architecture?'not-run':'not-configured',
    architecture?'Only configured import boundaries and naming conventions were assessed.':'No architecture policies were assessed.',architecture?.files.filter(f=>f.sha256!==null).map(f=>f.path) ?? []);
  if(architecture){arch.selectedFiles=architecture.files.map(f=>f.path);arch.omitted=architecture.files.filter(f=>f.status!=='loaded').map(f=>({path:f.path,reason:f.status}));arch.limitations=architecture.issues;}stages.push(arch);
  const batches=report.aiAudit?.batches ?? (report.ai?[report.ai]:[]);
  const execution=batches[0]?.execution ?? options.aiRequested;
  let status:AuditStage['status']='not-requested';
  if(batches.length)status=batches.some(b=>b.status==='failed')?'failed':execution==='preview'?'preview':execution==='mock'?'mock':execution==='injected'?'injected':
    report.aiAudit?.state==='partial' || batches.some(b=>b.coverage?.state!=='complete')?'partial':'completed';
  else if(options.aiRequested)status=refs?.state==='incomplete'?'blocked':'skipped';
  const ai=stage('ai','AI code review',status,
    status==='preview'?'Input selection only. No model was consulted.':status==='mock'?'Synthetic offline responses exercised the pipeline; no AI diagnosis was performed.':status==='injected'?'Caller-supplied transport; no live-provider execution is established.':
    status==='not-requested'?'AI review was not requested.':status==='blocked'?'Required reference failures prevented AI review.':status==='skipped'?'No AI batches ran; no eligible source was assessed.':'See AI results for completed responses, failures and coverage gaps.',
    unique(batches.filter(b=>b.execution==='live' && b.status==='completed').flatMap(b=>b.coverage?.validResponsePaths ?? [])),report.aiAudit?'repository':'selected-paths');
  ai.selectedFiles=unique(report.aiAudit?.selectedPaths ?? batches.flatMap(b=>b.preview.files.map(f=>f.path)));
  ai.omitted=report.aiAudit?.skipped ?? batches.flatMap(b=>b.preview.skipped);
  ai.limitations=['A valid response or matched citation does not prove a diagnosis or whole-repository correctness.',
    ...batches.flatMap(b=>[...(b.error?[b.error.code+': '+b.error.message]:[]),...(b.coverage?.state==='partial'?['A batch has partial coverage; inspect detailed AI evidence and freshness results.']:[])])];stages.push(ai);
  const task=report.currentTask;
  const taskReview=report.ai?.taskReview;
  const taskState=task?.assessment ?? taskReview?.state;
  stages.push(stage('task','Task assessment',taskState?(taskState==='assessed'?'completed':taskState==='not-assessed'?'not-run':'partial'):'not-requested',
    taskState?'Requirement outcomes are reported separately; supporting evidence is not proof of task completion.':'No current-task assessment was requested.',null,'selected-paths'));
  const issues=report.findings.length>0 || checks.some(c=>c.status==='failed') || (report.contracts ?? []).some(r=>r.calls.some(c=>c.status==='mismatch'))
    || (report.sdkContracts ?? []).some(r=>r.calls.some(c=>c.status==='mismatch')) || architecture?.boundaries.some(b=>b.status==='violation') || architecture?.conventions.some(c=>c.status==='violation')
    || batches.some(b=>b.execution==='live' && b.candidates.length>0) || task?.requirements.some(r=>r.status==='potential-violation') || taskReview?.assessments.some(r=>r.status==='potential-violation')
    || (report.contracts ?? []).some(r=>r.state==='version-mismatch') || (report.sdkContracts ?? []).some(r=>r.state==='version-mismatch');
  const incomplete=stages.some(s=>['partial','failed','blocked'].includes(s.status));
  const outcome=issues?'issues-reported':incomplete?'incomplete':stages.some(s=>s.status==='completed')?'no-issues-in-executed-checks':'not-assessed';
  const conclusion=outcome==='issues-reported'?'Issues were reported; inspect their evidence and stage scope.':outcome==='incomplete'?'Some requested analysis was incomplete or failed.':outcome==='not-assessed'?'No completed assessment is established.':'No issues were reported by the executed checks.';
  return auditSummarySchema.parse({outcome,generalQualityVerdict:'not-established',conclusion:conclusion+' Overall code quality is not established; see stages that did not run and coverage limits.',stages});
}
