import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { configSchema, loadConfig, type ConfigInput } from '../config.js';
import { inspectRepository } from '../inspect-repository.js';
import { createReport, reportSchema, type Report } from '../findings.js';
import { collectContext } from './context.js';
import { aiResultSchema, modeSchema, type AiMode, type AiResult } from './contracts.js';
import { AiFailure, buildRequest, mockTransport, requestQa, type ResponseTransport } from './client.js';
import { requestLiveQa } from './live.js';
import { TRIAL_MODELS } from './trial-budget.js';
import { verifyEvidence } from './verify-evidence.js';

export type AiReviewOptions = {
  execution: 'preview' | 'mock' | 'live';
  trial?: boolean;
  paths?: string[];
  mode?: AiMode;
  config?: ConfigInput;
};
/** Offline test seam: caller supplies transport and dummy credentials. */
export type InjectedClient = {transport:ResponseTransport; apiKey?:string};

export async function reviewWithAi(target = '.', options: AiReviewOptions = {execution:'preview'}, injected?: InjectedClient): Promise<Report> {
  if (!['preview','mock','live'].includes(options.execution) || (options.execution === 'live' && (!options.trial || injected))) throw new Error('Live AI is disabled without explicit trial activation.');
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
    const context = await collectContext(profile,config.ai,options.paths);
    result.preview = context.preview;
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
        const live = await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv]);
        const {output:liveOutput,...trial} = live;
        result.trial = trial;
        output = liveOutput;
      } else {
        output = await requestQa(injected?.transport ?? mockTransport(context),request,context,
          config.ai.timeoutMs,injected ? injected.apiKey : 'offline-mock');
      }
      // Reuse the same bounded, exclusion-aware, link-rejecting reads. A missing,
      // modified, or newly ineligible file cannot receive a matched citation.
      let current = {files:[],preview:context.preview} as typeof context;
      try { current = await collectContext(profile,config.ai,context.files.map(file=>file.path)); } catch { /* Fail closed for every citation. */ }
      const candidates=output.candidates.filter(candidate=>!options.paths || candidate.evidence.some(evidence=>options.paths!.includes(evidence.path)));
      result.coverage={state:'complete',selectedPaths:[],validResponsePaths:[],failedResponsePaths:[],skippedPaths:[],
        matchedCandidates:0,rejectedCandidates:0,outOfScopeCandidates:output.candidates.length-candidates.length};
      result.candidates = candidates.map(candidate=>({
        ...candidate, id:`ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}`,
        evidenceStatus:'unverified', origin:'ai',
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
    result.preview.limited || result.preview.skipped.length>0 || rejectedCandidates>0 || (result.coverage?.outOfScopeCandidates ?? 0)>0?'partial':'complete',
    selectedPaths,validResponsePaths:result.status==='completed'?selectedPaths:[],
    failedResponsePaths:result.status==='failed'?selectedPaths:[],skippedPaths:result.preview.skipped.map(file=>file.path),
    matchedCandidates:result.candidates.length-rejectedCandidates,rejectedCandidates,
    outOfScopeCandidates:result.coverage?.outOfScopeCandidates ?? 0};
  return reportSchema.parse({...report,ai:aiResultSchema.parse(result)});
}
