import {referenceCoverage} from './context-coverage.js';
import {planAnalysisContext} from './analysis-context.js';
import {summarizeAudit} from '../audit-summary.js';
import { configSchema, loadConfig } from '../config.js';
import { inspectRepository } from '../inspect-repository.js';
import { createReport, reportSchema, type Report } from '../findings.js';
import { collectContext, isEligibleSourcePath } from './context.js';
import { reviewWithAi, type AiReviewOptions } from './review.js';

/** Bounded batching; live requests share a durable, explicitly named allowance. */
export async function reviewWholeRepository(target:string,options:AiReviewOptions):Promise<Report> {
  if(options.task)throw new Error('Task assessments use selected task files, not whole-repository batching.');
  if(options.execution==='live' && (!options.budget || options.trial)) throw new Error('Whole-repository live AI requires --budget NAME, not the one-time trial.');
  if(options.execution!=='live' && (options.budget || options.trial))throw new Error('Spending authorization requires live AI.');
  if(options.paths) throw new Error('Whole-repository AI cannot be combined with selected paths.');
  const config=options.config===undefined?await loadConfig(target):configSchema.parse(options.config);
  const profile=await inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude});
  const report=createReport(profile,config);
  const analysisPlan=planAnalysisContext({...report,...options.analysisResults},config.ai.maxContextBytes,config.ai.apiKeyEnv,process.env);
  const remaining=new Set(profile.files.map(file=>file.path));
  const selected=new Set<string>();
  const valid=new Set<string>();
  const skipped=new Map<string,string>();
  const batches:NonNullable<Report['aiAudit']>['batches']=[];
  let stoppedReason:string|undefined;
  while(remaining.size && batches.length<config.ai.maxBatches) {
    const context=await collectContext(profile,{...config.ai,maxContextBytes:config.ai.maxContextBytes-analysisPlan.bytes},[...remaining]);
    for(const item of context.preview.skipped) {
      if(!['file-count-limit','context-size-limit'].includes(item.reason)) {
        remaining.delete(item.path);if(!selected.has(item.path))skipped.set(item.path,item.reason);
      }
    }
    const paths=context.files.map(file=>file.path);
    if(!paths.length) {
      for(const path of remaining)skipped.set(path,'cannot-fit-context');
      remaining.clear();break;
    }
    // Explicit local references outside automatic source eligibility still belong
    // to the whole-repository context, including resources scoped to themselves.
    const referenceTargets=config.resources.filter(resource=>!resource.rootId && !resource.url && !isEligibleSourcePath(resource.path)).map(resource=>resource.path);
    const batch=(await reviewWithAi(target,{...options,config,paths:[...new Set([...paths,...referenceTargets])]})).ai!;
    batches.push(batch);
    for(const path of paths) {
      remaining.delete(path);
      if(!batch.preview.files.some(file=>file.path===path))skipped.set(path,'unavailable-during-batch');
    }
    for(const file of batch.preview.files) {selected.add(file.path);remaining.delete(file.path);skipped.delete(file.path);}
    for(const path of batch.coverage?.validResponsePaths ?? [])valid.add(path);
    if(batch.status==='failed') {stoppedReason=batch.error?.code ?? 'batch-failure';break;}
  }
  for(const path of remaining)skipped.set(path,stoppedReason?`stopped:${stoppedReason}`:'batch-count-limit');
  const referencePaths=[...new Set(batches.flatMap(batch=>referenceCoverage(batch.preview)))].sort();
  const validReferencePaths=referencePaths.filter(path=>batches.some(batch=>batch.coverage?.validReferencePaths?.includes(path))
    && !batches.some(batch=>batch.preview.references?.some(ref=>ref.path===path && ref.freshness==='changed-or-unavailable')));
  for(const path of referencePaths)selected.add(path);
  for(const path of options.execution==='preview'?referencePaths:validReferencePaths)skipped.delete(path);
  for(const path of referencePaths)if(!validReferencePaths.includes(path))valid.delete(path);
  const eligibleSourcePaths=profile.files.map(file=>file.path).filter(isEligibleSourcePath);
  const failed=batches.some(batch=>batch.status==='failed');
  const partial=skipped.size>0 || batches.some(batch=>batch.coverage?.state==='partial');
  const completed=reportSchema.parse({...report,aiAudit:{scope:'whole-repository',batches,...(options.budget?{budgetName:options.budget}:{}),
    ...(stoppedReason?{stoppedReason}:{}),
    selectedPaths:[...selected].sort(),validResponsePaths:[...valid].sort(),referencePaths,validReferencePaths,
    eligibleSourcePaths,eligibleSourceState:options.execution==='preview'?'preview':eligibleSourcePaths.every(path=>valid.has(path))?'complete':'partial',
    repositoryFileCoverage:'not-established',
    skipped:[...skipped].map(([path,reason])=>({path,reason})),
    state:failed?'failed':options.execution==='preview'?'preview':partial?'partial':'complete'}});
  completed.auditSummary=summarizeAudit(completed,{config,aiRequested:options.execution});
  return completed;
}
