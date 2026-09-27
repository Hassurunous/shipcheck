import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { initializeTrial, trialStatus, withTrialReservation, reservationMicroUsd, TRIAL_MODELS } from '../src/ai/trial-budget.js';
import { requestLiveQa } from '../src/ai/live.js';
import { buildRequest } from '../src/ai/client.js';
import { aiSettingsSchema, modeSchema } from '../src/ai/contracts.js';
import { runCli } from '../src/cli-command.js';

let root: string;
let directory: string;
const now = Date.parse('2026-09-26T12:00:00Z');
const hash = 'a'.repeat(64);
const context = {files:[{path:'src/a.ts',content:'export const a = 1;'}],preview:{files:[{path:'src/a.ts',bytes:19,lines:1,sha256:hash}],skipped:[],serializedBytes:60,limited:false}};
const settings = aiSettingsSchema.parse({maxOutputTokens:2000});
const request = (mode: keyof typeof TRIAL_MODELS = 'low-cost') => buildRequest(context,settings,TRIAL_MODELS[mode].model);
const usage = {input_tokens:1000,output_tokens:200};
const envelope = {status:'completed',service_tier:'default',usage,output:[{type:'message',content:[{type:'output_text',text:'{"candidates":[]}'}]}]};
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value),{status});
const count = () => json({object:'response.input_tokens',input_tokens:1000});
beforeEach(async()=> { root = await fs.mkdtemp(join(tmpdir(),'shipcheck-live-')); directory = join(root,'trial'); vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected network request');})); });
afterEach(async()=> { vi.unstubAllGlobals(); await fs.rm(root,{recursive:true,force:true}); });

it('persists three unique mode reservations, refuses repeats and never resets',async()=> {
  await initializeTrial(directory);
  for (const mode of modeSchema.options) {
    await withTrialReservation(mode,hash,async()=>({value:'ok',usage}),directory,now);
    await expect(withTrialReservation(mode,hash,async()=>({value:'bad',usage}),directory,now)).rejects.toMatchObject({code:'trial-state'});
  }
  const state = await trialStatus(directory);
  expect(state.attempts).toHaveLength(3);
  expect(state.reservedUsd).toBeLessThan(0.5);
  expect(state.reservedUsd).toBe(modeSchema.options.reduce((sum,m)=>sum+reservationMicroUsd(m),0)/1e6);
  expect(state.unresolved).toBe(false);
  await expect(initializeTrial(directory)).rejects.toMatchObject({code:'trial-init'});
  expect((await trialStatus(directory)).attempts).toHaveLength(3);
});
it('reserves durably before network and prices returned usage without claiming an invoice',async()=> {
  await initializeTrial(directory);
  const send = vi.fn<typeof fetch>(async(url,init)=> {
    const state = await trialStatus(directory);
    expect(state.locked).toBe(true); expect(state.unresolved).toBe(true);
    expect(state.attempts).toHaveLength(1);
    expect(init?.redirect).toBe('error');
    const payload = JSON.parse(init!.body as string);
    expect(payload.model).toBe('gpt-6-luna');
    if (String(url).endsWith('input_tokens')) return count();
    expect(payload).toMatchObject({store:false,max_output_tokens:2000,service_tier:'default',reasoning:{effort:'low'}});
    expect(payload).not.toHaveProperty('tools');
    return json(envelope);
  });
  const result = await requestLiveQa(request(),context,'low-cost',1000,'dummy',{fetch:send,directory,now});
  expect(send).toHaveBeenCalledTimes(2);
  expect(result.pricedUsageUpperBoundUsd).toBe(0.000225);
  expect((await trialStatus(directory)).unresolved).toBe(false);
  expect(JSON.stringify(await trialStatus(directory))).not.toContain('dummy');
  expect(fetch).not.toHaveBeenCalled();
});
it('blocks concurrent attempts across modes',async()=> {
  await initializeTrial(directory);
  let finish!: () => void;
  let started!: () => void;
  const entered = new Promise<void>(r=>{started=r;});
  const held = new Promise<void>(r=>{finish=r;});
  const first = withTrialReservation('low-cost',hash,async()=> { started(); await held; return {value:true,usage}; },directory,now);
  await entered;
  const other = vi.fn(async()=>({value:true,usage}));
  await expect(withTrialReservation('balanced',hash,other,directory,now)).rejects.toMatchObject({code:'trial-state'});
  expect(other).not.toHaveBeenCalled(); finish(); await first;
});
it.each(['missing','corrupt','stale-lock','expired'] as const)('fails closed for %s state before network',async kind=> {
  if (kind !== 'missing') await initializeTrial(directory);
  if (kind === 'corrupt') await fs.writeFile(join(directory,'policy.json'),'{');
  if (kind === 'stale-lock') await fs.writeFile(join(directory,'lock'),'');
  const send = vi.fn<typeof fetch>();
  await expect(requestLiveQa(request(),context,'low-cost',100,'dummy',{fetch:send,directory,now:kind==='expired'?Date.parse('2026-10-04'):now})).rejects.toBeDefined();
  expect(send).not.toHaveBeenCalled();
});
it('retains uncertainty across invocations and blocks all later modes',async()=> {
  await initializeTrial(directory);
  const send = vi.fn<typeof fetch>().mockResolvedValueOnce(count()).mockRejectedValueOnce(new Error('dummy-secret raw payload'));
  let error: unknown;
  try { await requestLiveQa(request(),context,'low-cost',1000,'dummy-secret',{fetch:send,directory,now}); } catch (e) {error=e;}
  expect(error).toMatchObject({code:'transport-error'}); expect(String(error)).not.toContain('dummy-secret');
  expect(send).toHaveBeenCalledTimes(2);
  expect((await trialStatus(directory))).toMatchObject({unresolved:true,locked:false});
  await expect(requestLiveQa(request('balanced'),context,'balanced',1000,'dummy',{fetch:send,directory,now})).rejects.toMatchObject({code:'trial-state'});
  expect(send).toHaveBeenCalledTimes(2);
});
it('rejects an oversized count before generation and consumes the attempt',async()=> {
  await initializeTrial(directory);
  const send = vi.fn<typeof fetch>().mockResolvedValue(json({object:'response.input_tokens',input_tokens:5001}));
  await expect(requestLiveQa(request(),context,'low-cost',1000,'dummy',{fetch:send,directory,now})).rejects.toMatchObject({code:'trial-input-limit'});
  expect(send).toHaveBeenCalledTimes(1); expect((await trialStatus(directory)).unresolved).toBe(true);
});
it.each([
  [json({error:'dummy-secret'},429),'rate-limit'],
  [json({...envelope,usage:{input_tokens:6000,output_tokens:100}}),'invalid-usage'],
  [json({...envelope,status:'incomplete'}),'incomplete'],
  [new Response('x'.repeat(131073)),'response-too-large'],
] as const)('does not retry or release a failed generation',async(response,code)=> {
  await initializeTrial(directory);
  const send = vi.fn<typeof fetch>().mockResolvedValueOnce(count()).mockResolvedValueOnce(response);
  await expect(requestLiveQa(request(),context,'low-cost',1000,'dummy',{fetch:send,directory,now})).rejects.toMatchObject({code});
  expect(send).toHaveBeenCalledTimes(2); expect((await trialStatus(directory)).unresolved).toBe(true);
});
it('times out and aborts a non-cooperating transport without retry',async()=> {
  await initializeTrial(directory);
  let signal: AbortSignal | null | undefined;
  const send = vi.fn<typeof fetch>(async(_url,init)=> {signal=init?.signal; return new Promise(()=>{});});
  await expect(requestLiveQa(request(),context,'low-cost',10,'dummy',{fetch:send,directory,now})).rejects.toMatchObject({code:'timeout'});
  expect(signal?.aborted).toBe(true); expect(send).toHaveBeenCalledTimes(1);
  expect((await trialStatus(directory)).unresolved).toBe(true);
});
it('rejects missing credentials, unapproved models and output limits before reservation',async()=> {
  await initializeTrial(directory);
  for (const [payload,key] of [[request(),undefined],[{...request(),model:'expensive'},'dummy'],[{...request(),max_output_tokens:4096},'dummy']] as const) {
    await expect(requestLiveQa(payload,context,'low-cost',100,key,{directory,now})).rejects.toBeDefined();
  }
  expect((await trialStatus(directory)).attempts).toEqual([]); expect(fetch).not.toHaveBeenCalled();
});
it('requires explicit CLI activation and rejects mismatched trial flags without network',async()=> {
  for (const args of [['review','--ai','live'],['review','--trial'],['review','--ai','mock','--trial']]) expect((await runCli(args)).exitCode).toBe(2);
  expect((await runCli(['help','trial'])).stdout).toContain('trial status'); expect(fetch).not.toHaveBeenCalled();
});
