import * as fs from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { AiFailure } from './client.js';
import { modeSchema, type AiMode } from './contracts.js';
import { TRIAL_MODELS, usageMicroUsd } from './trial-budget.js';

// Standard short-context pricing checked 2026-09-27. No tools or premium tier.
export const AUDIT_INPUT_LIMIT=32000;
export const AUDIT_OUTPUT_LIMIT=2000;
export const PRICING_EXPIRES='2026-10-03T00:00:00.000Z';
const PRICING_START='2026-09-27T00:00:00.000Z';
const MAX_ATTEMPTS=1000;
export const budgetNameSchema=z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine(
  value=>! /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(value),'Reserved name.');
export const auditUsageSchema=z.object({input_tokens:z.number().int().min(0).max(AUDIT_INPUT_LIMIT),
  output_tokens:z.number().int().min(0).max(AUDIT_OUTPUT_LIMIT)});
type Usage=z.infer<typeof auditUsageSchema>;
export const auditReservationMicroUsd=(mode:AiMode)=>Math.ceil(usageMicroUsd(mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25);
export const budgetDirectory=(name:string)=>join(homedir(),'.shipcheck','budgets',budgetNameSchema.parse(name));
const policySchema=z.object({version:z.literal(1),name:budgetNameSchema,
  allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000),
  expires:z.literal(PRICING_EXPIRES)}).strict();
const attemptSchema=z.object({mode:modeSchema,model:z.string(),reservedMicroUsd:z.number().int().positive(),
  requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
const receiptSchema=z.object({usage:auditUsageSchema,pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict();
const settlementSchema=z.object({action:z.literal('charge-full-reservation'),chargedMicroUsd:z.number().int().positive()}).strict();
const stateError=()=>new AiFailure('budget-state','Budget state is missing, invalid, locked, or unresolved. Inspect shipcheck budget status; no automatic reset is allowed.');

async function directoryIsReal(directory:string) {
  const stat=await fs.lstat(directory);
  if(!stat.isDirectory() || stat.isSymbolicLink())throw stateError();
}
async function writeExclusive(path:string,value:unknown) {
  const handle=await fs.open(path,'wx',0o600);
  try {await handle.writeFile(JSON.stringify(value)+'\n');await handle.sync();}
  finally {await handle.close();}
}
async function readJson(path:string):Promise<unknown> {
  const stat=await fs.lstat(path);
  if(!stat.isFile() || stat.isSymbolicLink() || stat.size>8192)throw stateError();
  const handle=await fs.open(path,'r');
  try {
    if(!(await handle.stat()).isFile())throw stateError();
    const buffer=Buffer.alloc(8193);let size=0;
    while(size<buffer.length) {const read=await handle.read(buffer,size,buffer.length-size,null);if(!read.bytesRead)break;size+=read.bytesRead;}
    if(size>8192)throw stateError();
    return JSON.parse(buffer.subarray(0,size).toString('utf8'));
  } finally {await handle.close();}
}
export function parseAllowanceUsd(value:string):number {
  if(!/^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/.test(value))throw new Error('Allowance must be a USD amount from 0.01 to 100.00, with at most two decimals.');
  const cents=Math.round(Number(value)*100);
  if(cents<1 || cents>10000)throw new Error('Allowance must be between $0.01 and $100.00.');
  return cents/100;
}
/** Directory/clock arguments are test seams, never repository configuration. */
export async function initializeBudget(name:string,allowanceUsd:number,directory=budgetDirectory(name),now=Date.now()) {
  const allowanceMicroUsd=Math.round(allowanceUsd*1e6);
  if(!Number.isFinite(allowanceUsd) || Math.abs(allowanceMicroUsd/1e6-allowanceUsd)>1e-10)throw new Error('Invalid allowance.');
  const policy=policySchema.parse({version:1,name,allowanceMicroUsd,expires:PRICING_EXPIRES});
  if(now<Date.parse(PRICING_START) || now>=Date.parse(PRICING_EXPIRES))throw new AiFailure('pricing-expired','Refresh the shipped pricing policy before creating a new budget.');
  try {
    await fs.mkdir(join(directory,'..'),{recursive:true});
    await directoryIsReal(join(directory,'..'));await directoryIsReal(join(directory,'../..'));
    await fs.mkdir(directory);
    await writeExclusive(join(directory,'policy.json'),policy);
  } catch {throw new AiFailure('budget-init','Budget already exists or cannot be initialized. It has not been reset.');}
}
export async function budgetStatus(name:string,directory=budgetDirectory(name)) {
  try {
    budgetNameSchema.parse(name);
    await directoryIsReal(directory);await directoryIsReal(join(directory,'..'));await directoryIsReal(join(directory,'../..'));
    const policy=policySchema.parse(await readJson(join(directory,'policy.json')));
    if(policy.name!==name)throw stateError();
    const names=await fs.readdir(directory);
    if(names.length>MAX_ATTEMPTS*2+2 || names.some(file=>!['policy.json','lock'].includes(file) && !/^\d{6}\.(attempt|receipt|settlement)\.json$/.test(file)))throw stateError();
    const attemptNames=names.filter(file=>file.endsWith('.attempt.json')).sort();
    if(names.some(file=>file.endsWith('.receipt.json') && !names.includes(file.replace('.receipt.','.attempt.'))))throw stateError();
    if(names.some(file=>file.endsWith('.settlement.json') && !names.includes(file.replace('.settlement.','.attempt.'))))throw stateError();
    const attempts=[];
    for(const [index,file] of attemptNames.entries()) {
      const id=String(index+1).padStart(6,'0');
      if(file!==`${id}.attempt.json`)throw stateError();
      const attempt=attemptSchema.parse(await readJson(join(directory,file)));
      if(attempt.model!==TRIAL_MODELS[attempt.mode].model || attempt.reservedMicroUsd!==auditReservationMicroUsd(attempt.mode))throw stateError();
      const receipt=names.includes(`${id}.receipt.json`)?receiptSchema.parse(await readJson(join(directory,`${id}.receipt.json`))):null;
      const settlement=names.includes(`${id}.settlement.json`)?settlementSchema.parse(await readJson(join(directory,`${id}.settlement.json`))):null;
      if(settlement && (receipt || settlement.chargedMicroUsd!==attempt.reservedMicroUsd))throw stateError();
      if(receipt && (receipt.pricedUsageUpperBoundMicroUsd!==usageMicroUsd(attempt.mode,receipt.usage.input_tokens,receipt.usage.output_tokens)
        || receipt.pricedUsageUpperBoundMicroUsd>attempt.reservedMicroUsd))throw stateError();
      attempts.push({id,...attempt,receipt,settlement});
    }
    const reservedMicroUsd=attempts.reduce((sum,attempt)=>sum+attempt.reservedMicroUsd,0);
    if(reservedMicroUsd>policy.allowanceMicroUsd)throw stateError();
    return {name,allowanceUsd:policy.allowanceMicroUsd/1e6,reservedUsd:reservedMicroUsd/1e6,
      remainingUsd:(policy.allowanceMicroUsd-reservedMicroUsd)/1e6,expires:policy.expires,
      pricedUsageUpperBoundUsd:attempts.reduce((sum,attempt)=>sum+(attempt.receipt?.pricedUsageUpperBoundMicroUsd ?? 0),0)/1e6,
      locked:names.includes('lock'),unresolved:attempts.some(attempt=>!attempt.receipt && !attempt.settlement),attempts};
  } catch {throw stateError();}
}

/** Explicit recovery: retains the entire charge, never invents usage or frees funds. */
export async function settleBudgetAttempt(name:string,id:string,directory=budgetDirectory(name)) {
  if(!/^\d{6}$/.test(id))throw new AiFailure('budget-settle','Use the six-digit attempt ID from budget status.');
  let lock;
  try {
    const before=await budgetStatus(name,directory);
    if(before.locked)throw stateError();
    lock=await fs.open(join(directory,'lock'),'wx',0o600);
    const state=await budgetStatus(name,directory);
    const attempt=state.attempts.find(attempt=>attempt.id===id);
    if(!attempt || attempt.receipt)throw new AiFailure('budget-settle','Only an unresolved attempt can be settled.');
    if(attempt.settlement)return; // Idempotent; no mutation or refund.
    await writeExclusive(join(directory,`${id}.settlement.json`),{action:'charge-full-reservation',chargedMicroUsd:attempt.reservedMicroUsd});
  } catch(error) {if(error instanceof AiFailure)throw error;throw stateError();}
  finally {if(lock){await lock.close();await fs.unlink(join(directory,'lock'));}}
}

export async function withAuditReservation<T>(name:string,mode:AiMode,requestHash:string,
  execute:()=>Promise<{value:T;usage:Usage}>,directory=budgetDirectory(name),now=Date.now()):Promise<T> {
  let lock;
  try {
    modeSchema.parse(mode);
    const before=await budgetStatus(name,directory);
    if(before.locked || before.unresolved)throw stateError();
    if(now<Date.parse(PRICING_START) || now>=Date.parse(PRICING_EXPIRES))throw new AiFailure('pricing-expired','Shipped pricing approval has expired; no request was sent.');
    lock=await fs.open(join(directory,'lock'),'wx',0o600);
    const state=await budgetStatus(name,directory);
    if(state.unresolved)throw stateError();
    const reservedMicroUsd=auditReservationMicroUsd(mode);
    if(state.attempts.length>=MAX_ATTEMPTS || Math.round(state.remainingUsd*1e6)<reservedMicroUsd)
      throw new AiFailure('budget-exhausted','Remaining allowance cannot reserve another request. Completed batches are retained.');
    const id=String(state.attempts.length+1).padStart(6,'0');
    await writeExclusive(join(directory,`${id}.attempt.json`),attemptSchema.parse({mode,model:TRIAL_MODELS[mode].model,reservedMicroUsd,requestHash}));
    // Full worst-case reservation remains consumed even after a successful receipt.
    // Crashes/failures leave uncertainty durable and block this allowance.
    const result=await execute();
    const usage=auditUsageSchema.parse(result.usage);
    await writeExclusive(join(directory,`${id}.receipt.json`),{usage,pricedUsageUpperBoundMicroUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)});
    return result.value;
  } catch(error) {if(error instanceof AiFailure)throw error;throw stateError();}
  finally {if(lock){await lock.close();await fs.unlink(join(directory,'lock'));}}
}
