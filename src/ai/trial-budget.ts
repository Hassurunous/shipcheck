import * as fs from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { AiFailure } from './client.js';
import { modeSchema, type AiMode } from './contracts.js';

// USD per million tokens equals microdollars per token. Use the highest input
// rate (cache writes), no cache discounts, plus 25% reservation headroom.
// Verified https://developers.openai.com/api/docs/pricing on 2026-09-26.
export const TRIAL_MODELS = {
  'low-cost': {model:'gpt-6-luna', input:0.125, output:0.5},
  balanced: {model:'gpt-6-sol', input:2.5, output:10},
  'high-quality': {model:'gpt-6-astra', input:12.5, output:50},
} as const;
export const INPUT_LIMIT = 5000;
export const OUTPUT_LIMIT = 2000;
const BUDGET = 500000;
const EXPIRES = '2026-10-03T00:00:00.000Z';
const POLICY = {version:1, allowanceMicroUsd:BUDGET, maxRequests:3, expires:EXPIRES};
export const trialDirectory = () => join(homedir(), '.shipcheck', 'trial-v1');
export const usageMicroUsd = (mode: AiMode, input: number, output: number) =>
  Math.ceil(input * TRIAL_MODELS[mode].input + output * TRIAL_MODELS[mode].output);
export const reservationMicroUsd = (mode: AiMode) => Math.ceil(usageMicroUsd(mode, INPUT_LIMIT, OUTPUT_LIMIT) * 1.25);
const attemptSchema = z.object({mode:modeSchema, model:z.string(), reservedMicroUsd:z.number().int(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
export const usageSchema = z.object({input_tokens:z.number().int().min(0).max(INPUT_LIMIT), output_tokens:z.number().int().min(0).max(OUTPUT_LIMIT)});
export type TrialUsage = z.infer<typeof usageSchema>;
const receiptSchema = z.object({usage:usageSchema, pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict();
const fail = () => new AiFailure('trial-state','Trial state is unavailable, locked, unresolved, or exhausted. No further requests are allowed; inspect shipcheck trial status.');

async function writeExclusive(path: string, value: unknown) {
  const handle = await fs.open(path,'wx',0o600);
  try { await handle.writeFile(JSON.stringify(value)+'\n'); await handle.sync(); }
  finally { await handle.close(); }
}
async function readJson(path: string): Promise<unknown> {
  const stat = await fs.lstat(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 8192) throw fail();
  const handle = await fs.open(path,'r');
  try {
    const buffer = Buffer.alloc(8193);
    const {bytesRead} = await handle.read(buffer,0,buffer.length,0);
    if (bytesRead > 8192) throw fail();
    return JSON.parse(buffer.subarray(0,bytesRead).toString('utf8'));
  } finally { await handle.close(); }
}
export async function initializeTrial(directory = trialDirectory()) {
  try {
    await fs.mkdir(join(directory,'..'),{recursive:true});
    // Never overwrite an existing allowance, even if its state is incomplete.
    await fs.mkdir(directory);
    await writeExclusive(join(directory,'policy.json'),POLICY);
  } catch { throw new AiFailure('trial-init','Trial already exists or cannot be initialized. It has not been reset.'); }
}
export async function trialStatus(directory = trialDirectory()) {
  try {
    const stat = await fs.lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw fail();
    if (JSON.stringify(await readJson(join(directory,'policy.json'))) !== JSON.stringify(POLICY)) throw fail();
    const names = await fs.readdir(directory);
    const allowed = new Set(['policy.json','lock', ...Object.keys(TRIAL_MODELS).flatMap(mode=>[`${mode}.attempt.json`,`${mode}.receipt.json`])]);
    if (names.some(name=>!allowed.has(name))) throw fail();
    const attempts = [];
    for (const mode of modeSchema.options) {
      const hasAttempt = names.includes(`${mode}.attempt.json`);
      const hasReceipt = names.includes(`${mode}.receipt.json`);
      if (hasReceipt && !hasAttempt) throw fail();
      if (!hasAttempt) continue;
      const attempt = attemptSchema.parse(await readJson(join(directory,`${mode}.attempt.json`)));
      if (attempt.mode !== mode || attempt.model !== TRIAL_MODELS[mode].model || attempt.reservedMicroUsd !== reservationMicroUsd(mode)) throw fail();
      const receipt = hasReceipt ? receiptSchema.parse(await readJson(join(directory,`${mode}.receipt.json`))) : null;
      if (receipt && receipt.pricedUsageUpperBoundMicroUsd !== usageMicroUsd(mode,receipt.usage.input_tokens,receipt.usage.output_tokens)) throw fail();
      attempts.push({...attempt,receipt});
    }
    return {allowanceUsd:BUDGET/1e6, maxRequests:3, expires:EXPIRES,
      reservedUsd:attempts.reduce((sum,a)=>sum+a.reservedMicroUsd,0)/1e6,
      pricedUsageUpperBoundUsd:attempts.reduce((sum,a)=>sum+(a.receipt?.pricedUsageUpperBoundMicroUsd ?? 0),0)/1e6,
      locked:names.includes('lock'), unresolved:attempts.some(a=>!a.receipt), attempts};
  } catch { throw fail(); }
}

/** Directory and clock arguments are test seams, never repository configuration. */
export async function withTrialReservation<T>(mode: AiMode, requestHash: string,
  execute: () => Promise<{value:T; usage:TrialUsage}>, directory = trialDirectory(), now = Date.now()): Promise<T> {
  let lock;
  try {
    const before = await trialStatus(directory);
    if (before.locked || before.unresolved || before.attempts.some(a=>a.mode===mode) || before.attempts.length >= 3) throw fail();
    if (now >= Date.parse(EXPIRES) || now < Date.parse('2026-09-26T00:00:00Z')) throw new AiFailure('trial-expired','Trial pricing approval has expired or the clock is invalid.');
    lock = await fs.open(join(directory,'lock'),'wx',0o600);
    const state = await trialStatus(directory);
    const reservedMicroUsd = reservationMicroUsd(mode);
    if (state.unresolved || state.attempts.some(a=>a.mode===mode) || state.attempts.length >= 3
      || Math.round(state.reservedUsd*1e6)+reservedMicroUsd > BUDGET || reservedMicroUsd > 250000) throw fail();
    await writeExclusive(join(directory,`${mode}.attempt.json`),{mode,model:TRIAL_MODELS[mode].model,reservedMicroUsd,requestHash});
    // Reservation is durable BEFORE either HTTP call. Failure leaves it unresolved.
    const result = await execute();
    const usage = usageSchema.parse(result.usage);
    await writeExclusive(join(directory,`${mode}.receipt.json`),{usage,pricedUsageUpperBoundMicroUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)});
    return result.value;
  } catch (error) { if (error instanceof AiFailure) throw error; throw fail(); }
  finally { if (lock) { await lock.close(); await fs.unlink(join(directory,'lock')); } }
}
