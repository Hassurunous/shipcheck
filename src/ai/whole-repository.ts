import { configSchema, loadConfig } from '../config.js';
import { inspectRepository } from '../inspect-repository.js';
import { createReport, reportSchema, type Report } from '../findings.js';
import { collectContext } from './context.js';
import { reviewWithAi, type AiReviewOptions } from './review.js';

/** Bounded offline batching. Live execution needs a separately approved aggregate budget. */
export async function reviewWholeRepository(target:string,options:AiReviewOptions):Promise<Report> {
  if(options.execution==='live') throw new Error('Whole-repository live AI is not enabled: aggregate spending limits are required. Use --ai preview or --ai mock.');
  if(options.paths) throw new Error('Whole-repository AI cannot be combined with selected paths.');
  const config=options.config===undefined?await loadConfig(target):configSchema.parse(options.config);
  const profile=await inspectRepository(target,{exclude:config.exclude});
  const report=createReport(profile,config);
  const remaining=new Set(profile.files.map(file=>file.path));
  const selected=new Set<string>();
  const valid=new Set<string>();
  const skipped=new Map<string,string>();
  const batches:NonNullable<Report['aiAudit']>['batches']=[];
  while(remaining.size && batches.length<config.ai.maxBatches) {
    const context=await collectContext(profile,config.ai,[...remaining]);
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
    const batch=(await reviewWithAi(target,{...options,config,paths})).ai!;
    batches.push(batch);
    for(const path of paths) {
      remaining.delete(path);
      if(!batch.preview.files.some(file=>file.path===path))skipped.set(path,'unavailable-during-batch');
    }
    for(const file of batch.preview.files) {selected.add(file.path);remaining.delete(file.path);skipped.delete(file.path);}
    for(const path of batch.coverage?.validResponsePaths ?? [])valid.add(path);
  }
  for(const path of remaining)skipped.set(path,'batch-count-limit');
  const failed=batches.some(batch=>batch.status==='failed');
  const partial=skipped.size>0 || batches.some(batch=>batch.coverage?.state==='partial');
  return reportSchema.parse({...report,aiAudit:{scope:'whole-repository',batches,
    selectedPaths:[...selected].sort(),validResponsePaths:[...valid].sort(),
    skipped:[...skipped].map(([path,reason])=>({path,reason})),
    state:failed?'failed':options.execution==='preview'?'preview':partial?'partial':'complete'}});
}
