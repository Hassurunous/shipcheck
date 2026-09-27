import { createHash } from 'node:crypto';
import { z } from 'zod';
import { AiFailure, decodeResponse, type QaRequest } from './client.js';
import type { AiContext } from './context.js';
import type { AiMode } from './contracts.js';
import { INPUT_LIMIT, OUTPUT_LIMIT, TRIAL_MODELS, usageSchema, usageMicroUsd, reservationMicroUsd, withTrialReservation } from './trial-budget.js';

const ORIGIN = 'https://api.openai.com/v1/responses';
/** A fetch seam for offline tests; production has no configurable endpoint. */
export type LiveDependencies = {fetch?:typeof fetch; directory?:string; now?:number};

async function post(url: string, payload: unknown, apiKey: string, timeoutMs: number, send: typeof fetch) {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const operation = async () => {
    const response = await send(url,{method:'POST',redirect:'error',signal:controller.signal,
      headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if (!response.ok) {
      await response.body?.cancel();
      const code = response.status === 401 || response.status === 403 ? 'authentication' : response.status === 429 ? 'rate-limit' : 'provider-error';
      throw new AiFailure(code,`OpenAI request failed (HTTP ${response.status}); no retry was attempted.`);
    }
    if (!response.body) throw new AiFailure('invalid-response','OpenAI returned no response body.');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 131072) { await reader.cancel(); throw new AiFailure('response-too-large','OpenAI response exceeded 128 KiB.'); }
        chunks.push(value);
      }
      return Buffer.concat(chunks).toString('utf8');
    } finally { reader.releaseLock(); }
  };
  try {
    return await Promise.race([operation(),new Promise<never>((_,reject)=> {
      timer = setTimeout(()=> { controller.abort(); reject(new AiFailure('timeout','OpenAI request timed out; reservation retained, no retry.')); },timeoutMs);
    })]);
  } catch (error) {
    if (error instanceof AiFailure) throw error;
    throw new AiFailure('transport-error','OpenAI transport failed; reservation retained, no retry.');
  } finally { if (timer) clearTimeout(timer); }
}

export async function requestLiveQa(request: QaRequest, context: AiContext, mode: AiMode, timeoutMs: number,
  apiKey: string | undefined, dependencies: LiveDependencies = {}) {
  if (!apiKey?.trim()) throw new AiFailure('missing-credentials','Set OPENAI_PROJECTDEV_API_KEY in this process before live review.');
  if (request.model !== TRIAL_MODELS[mode].model) throw new AiFailure('trial-model','Model does not match the approved trial mapping.');
  if (request.max_output_tokens > OUTPUT_LIMIT || request.max_output_tokens < 128) throw new AiFailure('trial-output-limit','Trial output limit is 128–2000 tokens.');
  const payload = {...request,reasoning:{effort:'low'},service_tier:'default'};
  const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return withTrialReservation(mode,hash,async()=> {
    const send = dependencies.fetch ?? fetch;
    // Same input, instructions, schema and reasoning settings as generation.
    const countPayload = {model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning};
    const countBody = await post(`${ORIGIN}/input_tokens`,countPayload,apiKey,timeoutMs,send);
    let countedInputTokens: number;
    try { countedInputTokens = z.object({object:z.literal('response.input_tokens'),input_tokens:z.number().int().min(1).max(INPUT_LIMIT)}).parse(JSON.parse(countBody)).input_tokens; }
    catch { throw new AiFailure('trial-input-limit','Input count is invalid or exceeds the 5000-token trial limit; generation was not sent.'); }
    const body = await post(ORIGIN,payload,apiKey,timeoutMs,send);
    let usage;
    try { usage = z.object({usage:usageSchema, service_tier:z.literal('default').optional()}).parse(JSON.parse(body)).usage; }
    catch { throw new AiFailure('invalid-usage','Response usage or processing tier cannot be reconciled; reservation retained.'); }
    const output = decodeResponse(body,context);
    return {usage,value:{output,usage,countedInputTokens,reservedUsd:reservationMicroUsd(mode)/1e6,
      pricedUsageUpperBoundUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)/1e6}};
  },dependencies.directory,dependencies.now);
}
