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

export type AiReviewOptions = {
  execution: 'preview' | 'mock' | 'live';
  trial?: boolean;
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
    reviewer:'qa/reliability-v1',model,plannedModel,
    preview:{files:[],skipped:[],serializedBytes:0,limited:false},
    maxOutputTokens:config.ai.maxOutputTokens,requestBytes:0,estimatedInputTokens:0,
    estimatedCostUsd:null,actualCostUsd:execution === 'injected' || execution === 'live' ? null : 0,retries:0,candidates:[],error:null,
  };
  try {
    const context = await collectContext(profile,config.ai);
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
        const live = await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env.OPENAI_PROJECTDEV_API_KEY);
        const {output:liveOutput,...trial} = live;
        result.trial = trial;
        output = liveOutput;
      } else {
        output = await requestQa(injected?.transport ?? mockTransport(context),request,context,
          config.ai.timeoutMs,injected ? injected.apiKey : 'offline-mock');
      }
      result.candidates = output.candidates.map(candidate=>({
        ...candidate, id:`ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}`,
        evidenceStatus:'unverified', origin:'ai',
      }));
    }
  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof AiFailure ? {code:error.code,message:error.message}
      : {code:'context-error',message:'AI context could not be prepared. Deterministic results are preserved.'};
  }
  return reportSchema.parse({...report,ai:aiResultSchema.parse(result)});
}
