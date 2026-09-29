import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { configSchema, loadConfig, type ConfigInput } from '../config.js';
import { inspectRepository } from '../inspect-repository.js';
import { createReport, reportSchema, type Report } from '../findings.js';
import { collectContext } from './context.js';
import { aiResultSchema, modeSchema, type AiMode, type AiResult } from './contracts.js';
import { AiFailure, buildRequest, mockTransport, requestQa, type ResponseTransport } from './client.js';
import { requestLiveQa, requestBudgetQa } from './live.js';
import { budgetNameSchema } from './audit-budget.js';
import { TRIAL_MODELS } from './trial-budget.js';
import { verifyEvidence } from './verify-evidence.js';
import {attachReferences} from './reference-context.js';
import {loadReferenceResources} from '../reference-resources.js';
import {currentTaskSchema,describeCurrentTask,type CurrentTask} from '../task-file.js';
import {pendingTaskReview,finishTaskReview,invalidateTaskReview} from './task-review.js';
import {sensitiveContent} from '../sensitive-content.js';
import type {ReferenceAccess} from '../reference-access.js';

export type AiReviewOptions = {
  execution: 'preview' | 'mock' | 'live';
  trial?: boolean;
  budget?: string;
  paths?: string[];
  mode?: AiMode;
  config?: ConfigInput;
  task?:CurrentTask;
  reloadTask?:()=>Promise<CurrentTask>;
  referenceAccess?:ReferenceAccess;
};
/** Offline test seam: caller supplies transport and dummy credentials. */
export type InjectedClient = {transport:ResponseTransport; apiKey?:string};

export async function reviewWithAi(target = '.', options: AiReviewOptions = {execution:'preview'}, injected?: InjectedClient): Promise<Report> {
  if (!['preview','mock','live'].includes(options.execution) || (options.execution === 'live' && (!(options.trial || options.budget) || injected))) throw new Error('Live AI is disabled without explicit --trial or --budget activation.');
  if(options.budget)budgetNameSchema.parse(options.budget);
  if(options.trial && options.budget)throw new Error('Choose --trial or --budget, not both.');
  if(options.execution!=='live' && (options.trial || options.budget))throw new Error('Spending authorization requires live AI.');
  const config = options.config === undefined ? await loadConfig(resolve(target)) : configSchema.parse(options.config);
  const mode = modeSchema.parse(options.mode ?? config.ai.mode);
  const profile = await inspectRepository(target,{exclude:config.exclude});
  const report = createReport(profile,config);
  const plannedModel = options.execution === 'live' ? (config.ai.models[mode] ?? TRIAL_MODELS[mode].model) : config.ai.models[mode];
  const execution = options.execution === 'live' ? 'live' : options.execution === 'preview' ? 'preview' : injected ? 'injected' : 'mock';
  const model = execution === 'mock' ? `mock-${mode}` : plannedModel;
  const result: AiResult = {
    execution, status:options.execution === 'preview' ? 'preview' : 'completed', mode,
    reviewer:'qa/reliability-v2',model,plannedModel,
    preview:{files:[],skipped:[],serializedBytes:0,limited:false},
    maxOutputTokens:config.ai.maxOutputTokens,requestBytes:0,estimatedInputTokens:0,
    estimatedCostUsd:null,actualCostUsd:execution === 'injected' || execution === 'live' ? null : 0,retries:0,candidates:[],error:null,
  };
  try {
    const task=options.task?currentTaskSchema.parse(options.task):undefined;
    if(task)result.taskReview=pendingTaskReview(task);
    const taskBytes=task?Buffer.byteLength(JSON.stringify(task)):0;
    if(task && [task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=>[item.id,item.text])].some(value=>sensitiveContent.test(value)))
      throw new AiFailure('sensitive-task','Task text resembles sensitive credentials; no request was sent.');
    if(taskBytes>config.ai.maxContextBytes-256)throw new AiFailure('task-context-limit','Task exceeds available context space; no request was sent.');
    const sourceSettings={...config.ai,maxContextBytes:config.ai.maxContextBytes-taskBytes};
    const context = await collectContext(profile,sourceSettings,options.paths ?? task?.files);
    if(task) {
      context.task=task;
      context.preview.task={id:task.id,sha256:describeCurrentTask(task).sha256,bytes:taskBytes,requirementIds:task.requirements.map(item=>item.id)};
    }
    result.preview = context.preview;
    const referencesBlocked=await attachReferences(profile.root,{...config,ai:sourceSettings},context,options.referenceAccess);
    context.preview.serializedBytes+=taskBytes;
    if(referencesBlocked)throw new AiFailure('reference-context','A required applicable reference is unavailable, ambiguous, or exceeds remaining context space. No request was sent.');
    const request = buildRequest(context,config.ai,model ?? 'MODEL_NOT_SELECTED');
    result.requestBytes = Buffer.byteLength(JSON.stringify(request));
    // Heuristic only, not a billing quote or token cap. Includes prompt/schema overhead.
    result.estimatedInputTokens = Math.ceil(result.requestBytes / 3);
    if (options.execution !== 'preview') {
      if (context.files.length === 0) throw new AiFailure('empty-context','No eligible source files were selected.');
      if (injected && !plannedModel) throw new AiFailure('missing-model','Select a model mapping before using an injected client.');
      let output;
      if (execution === 'live') {
        if(!process.env[config.ai.apiKeyEnv]?.trim()) throw new AiFailure('missing-credentials',`Set ${config.ai.apiKeyEnv} in this process before live review.`);
        const live = options.budget ? await requestBudgetQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv],options.budget)
          : await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv]);
        const {output:liveOutput,...accounting} = live;
        if(options.budget)result.budget={name:options.budget,...accounting};
        else result.trial = accounting;
        output = liveOutput;
      } else {
        output = await requestQa(injected?.transport ?? mockTransport(context),request,context,
          config.ai.timeoutMs,injected ? injected.apiKey : 'offline-mock');
      }
      // Reuse the same bounded, exclusion-aware, link-rejecting reads. A missing,
      // modified, or newly ineligible file cannot receive a matched citation.
      let current = {files:[],preview:context.preview} as typeof context;
      try { current = await collectContext(profile,sourceSettings,context.files.map(file=>file.path)); } catch { /* Fail closed for every citation. */ }
      // A no-candidate response still describes the submitted snapshot, not later edits.
      for(const source of context.files) {
        const unchanged=current.files.find(file=>file.path===source.path)?.content===source.content;
        const metadata=result.preview.files.find(file=>file.path===source.path)!;
        metadata.freshness=unchanged?'unchanged':'changed-or-unavailable';
        if(!unchanged)result.preview.limited=true;
      }
      if(context.references) {
        try { current.references=(await loadReferenceResources(profile.root,config,context.files.map(file=>file.path),options.referenceAccess)).snapshots; }
        catch { current.references=[]; }
        for(const reference of context.references) {
          const fresh=current.references.find(item=>item.record.id===reference.record.id);
          const unchanged=fresh?.record.sha256===reference.record.sha256 && fresh?.content===reference.content;
          const metadata=result.preview.references?.find(item=>item.id===reference.record.id);
          if(metadata)metadata.freshness=unchanged?'unchanged':'changed-or-unavailable';
          if(!unchanged)result.preview.limited=true;
        }
      }
      const candidates=output.candidates.filter(candidate=>candidate.evidence.some(evidence=>
        context.files.some(file=>file.path===evidence.path) && (!options.paths || options.paths.includes(evidence.path))));
      result.coverage={state:'complete',selectedPaths:[],validResponsePaths:[],failedResponsePaths:[],skippedPaths:[],
        matchedCandidates:0,rejectedCandidates:0,outOfScopeCandidates:output.candidates.length-candidates.length};
      if(context.references)result.referenceConflicts=(output.referenceConflicts ?? []).map(conflict=>({
        ...conflict,id:`ai/reference-conflict:${createHash('sha256').update(JSON.stringify(conflict)).digest('hex').slice(0,16)}`,
        status:'needs-clarification',evidenceVerification:verifyEvidence(conflict,context,current),
      }));
      const conflictedPaths=new Set((result.referenceConflicts ?? []).flatMap(conflict=>conflict.evidence.map(item=>item.path)));
      if(task) {
        result.taskReview=finishTaskReview(task,output,context,current,result.referenceConflicts ?? [],execution==='mock');
        try {
          if(!options.reloadTask || describeCurrentTask(await options.reloadTask()).sha256!==result.taskReview.taskHash)invalidateTaskReview(result.taskReview);
          else result.taskReview.freshness='unchanged';
        } catch {invalidateTaskReview(result.taskReview);}
      }
      result.candidates = candidates.map(candidate=>({
        ...candidate, id:`ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}`,
        evidenceStatus:'unverified', origin:'ai',
        ...(context.references?{referenceConflict:candidate.evidence.some(item=>conflictedPaths.has(item.path))}:{}),
        evidenceVerification:verifyEvidence(candidate,context,current),
      }));
    }
  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof AiFailure ? {code:error.code,message:error.message}
      : {code:'context-error',message:'AI context could not be prepared. Deterministic results are preserved.'};
  }
  const selectedPaths=result.preview.files.map(file=>file.path);
  const rejectedCandidates=result.candidates.filter(candidate=>candidate.evidenceVerification?.status!=='matched').length;
  result.coverage={state:result.status==='failed'?'failed':result.status==='preview'?'preview':
    result.preview.limited || result.preview.skipped.length>0 || rejectedCandidates>0 || (result.taskReview && result.taskReview.state!=='assessed') || (result.referenceConflicts?.length ?? 0)>0 || (result.coverage?.outOfScopeCandidates ?? 0)>0?'partial':'complete',
    selectedPaths,validResponsePaths:result.status==='completed'?selectedPaths:[],
    failedResponsePaths:result.status==='failed'?selectedPaths:[],skippedPaths:result.preview.skipped.map(file=>file.path),
    matchedCandidates:result.candidates.length-rejectedCandidates,rejectedCandidates,
    outOfScopeCandidates:result.coverage?.outOfScopeCandidates ?? 0};
  return reportSchema.parse({...report,ai:aiResultSchema.parse(result)});
}
