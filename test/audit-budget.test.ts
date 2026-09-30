import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import * as budgets from '../src/ai/audit-budget.js';
import * as live from '../src/ai/live.js';
import {TRIAL_MODELS} from '../src/ai/trial-budget.js';
import {buildRequest} from '../src/ai/client.js';
import {aiSettingsSchema} from '../src/ai/contracts.js';
import {reviewWholeRepository} from '../src/ai/whole-repository.js';
import {runCli} from '../src/cli-command.js';

let root:string;let directory:string;
const now=Date.parse('2026-09-30T12:00:00Z');
const name='test-budget';const hash='a'.repeat(64);
const usage={input_tokens:1000,output_tokens:200};
const context={files:[{path:'a.py',content:'value = 1'}],preview:{files:[{path:'a.py',bytes:9,lines:1,sha256:hash}],skipped:[],serializedBytes:40,limited:false}};
const request=()=>buildRequest(context,aiSettingsSchema.parse({}),TRIAL_MODELS['low-cost'].model);
const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status});
const envelope={status:'completed',service_tier:'default',usage,output:[{type:'message',content:[{type:'output_text',text:'{"candidates":[]}'}]}]};
const count=()=>json({object:'response.input_tokens',input_tokens:1000});
const originalRequest=live.requestBudgetQa;
beforeEach(async()=>{
  root=await fs.mkdtemp(join(tmpdir(),'shipcheck-budget-'));directory=join(root,'budget');
  vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected network');}));
});
afterEach(async()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();await fs.rm(root,{recursive:true,force:true});});
const execute=()=>Promise.resolve({value:true,usage});
const reserve=(callback=execute)=>budgets.withAuditReservation(name,'low-cost',hash,callback,directory,now);

it('persists cumulative reservations across invocations and never recreates an allowance',async()=>{
  await budgets.initializeBudget(name,0.02,directory,now);
  await reserve();await reserve();await reserve();
  const callback=vi.fn(execute);
  await expect(reserve(callback)).rejects.toMatchObject({code:'budget-exhausted'});
  expect(callback).not.toHaveBeenCalled();
  expect(await budgets.budgetStatus(name,directory)).toMatchObject({allowanceUsd:0.02,reservedUsd:0.01875,remainingUsd:0.00125,unresolved:false,locked:false});
  await expect(budgets.initializeBudget(name,1,directory,now)).rejects.toMatchObject({code:'budget-init'});
  expect((await budgets.budgetStatus(name,directory)).allowanceUsd).toBe(0.02);
});
it('makes the reservation durable before either HTTP call and excludes secrets from the ledger',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  const send=vi.fn<typeof fetch>(async(url,init)=>{
    expect(await budgets.budgetStatus(name,directory)).toMatchObject({locked:true,unresolved:true,reservedUsd:0.00625});
    const payload=JSON.parse(init!.body as string);
    expect(init!.redirect).toBe('error');expect(payload).not.toHaveProperty('tools');
    return String(url).endsWith('/input_tokens')?count():json(envelope);
  });
  const result=await originalRequest(request(),context,'low-cost',1000,'dummy-secret',name,{fetch:send,directory,now});
  expect(result.pricedUsageUpperBoundUsd).toBe(0.000225);expect(send).toHaveBeenCalledTimes(2);
  const state=await budgets.budgetStatus(name,directory);
  expect(state).toMatchObject({unresolved:false,reservedUsd:0.00625});
  expect(JSON.stringify(state)).not.toContain('dummy-secret');expect(fetch).not.toHaveBeenCalled();
});
it('blocks simultaneous reservations using an exclusive lock',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  let start!:()=>void;let finish!:()=>void;
  const started=new Promise<void>(resolve=>{start=resolve;});const held=new Promise<void>(resolve=>{finish=resolve;});
  const first=reserve(async()=>{start();await held;return execute();});await started;
  const callback=vi.fn(execute);
  await expect(reserve(callback)).rejects.toMatchObject({code:'budget-state'});
  expect(callback).not.toHaveBeenCalled();finish();await first;
  expect((await budgets.budgetStatus(name,directory)).attempts).toHaveLength(1);
});
it('retains interrupted reservations and forbids spending again',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  await expect(reserve(async()=>{throw new Error('interrupted');})).rejects.toMatchObject({code:'budget-state'});
  expect(await budgets.budgetStatus(name,directory)).toMatchObject({unresolved:true,locked:false,reservedUsd:0.00625});
  const callback=vi.fn(execute);await expect(reserve(callback)).rejects.toMatchObject({code:'budget-state'});
  expect(callback).not.toHaveBeenCalled();
});
it('explicitly settles an unresolved attempt without refunding or resetting any funds',async()=>{
  await budgets.initializeBudget(name,0.02,directory,now);
  await expect(reserve(async()=>{throw new Error('incomplete');})).rejects.toBeDefined();
  const before=await budgets.budgetStatus(name,directory);
  await budgets.settleBudgetAttempt(name,'000001',directory);
  await budgets.settleBudgetAttempt(name,'000001',directory);
  const after=await budgets.budgetStatus(name,directory);
  expect(after.remainingUsd).toBe(before.remainingUsd);expect(after.reservedUsd).toBe(before.reservedUsd);
  expect(after.unresolved).toBe(false);expect(after.attempts[0]!.receipt).toBeNull();
  expect(after.attempts[0]!.settlement).toEqual({action:'charge-full-reservation',chargedMicroUsd:6250});
  await reserve();await reserve();await expect(reserve()).rejects.toMatchObject({code:'budget-exhausted'});
});
it('refuses settlement of active, missing, completed or malformed attempts',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);await reserve();
  for(const id of ['000001','000002','../escape'])await expect(budgets.settleBudgetAttempt(name,id,directory)).rejects.toBeDefined();
  await fs.writeFile(join(directory,'lock'),'');
  await expect(budgets.settleBudgetAttempt(name,'000002',directory)).rejects.toMatchObject({code:'budget-state'});
});
it('does not accept a forged settlement that refunds part of a reservation',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  await expect(reserve(async()=>{throw new Error('interrupted');})).rejects.toBeDefined();
  await fs.writeFile(join(directory,'000001.settlement.json'),JSON.stringify({action:'charge-full-reservation',chargedMicroUsd:1}));
  await expect(budgets.budgetStatus(name,directory)).rejects.toMatchObject({code:'budget-state'});
});
it.each(['missing','corrupt','lock','expired','unexpected-file','linked-ledger'] as const)('fails closed on %s before HTTP',async kind=>{
  if(kind!=='missing')await budgets.initializeBudget(name,0.5,directory,now);
  if(kind==='corrupt')await fs.writeFile(join(directory,'policy.json'),'{');
  if(kind==='lock')await fs.writeFile(join(directory,'lock'),'');
  if(kind==='unexpected-file')await fs.writeFile(join(directory,'unexpected'),'');
  if(kind==='linked-ledger') {await fs.rename(directory,join(root,'real-budget'));await fs.symlink(join(root,'real-budget'),directory,'junction');}
  const send=vi.fn<typeof fetch>();
  await expect(originalRequest(request(),context,'low-cost',1000,'dummy',name,{fetch:send,directory,now:kind==='expired'?Date.parse('2026-10-31'):now})).rejects.toBeDefined();
  expect(send).not.toHaveBeenCalled();
});
it('rejects higher-priced models, invalid output caps and missing credentials without reservations',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  for(const [payload,key] of [[{...request(),model:'expensive'},'dummy'],[{...request(),max_output_tokens:4096},'dummy'],[request(),undefined]] as const)
    await expect(originalRequest(payload,context,'low-cost',1000,key,name,{directory,now})).rejects.toBeDefined();
  expect((await budgets.budgetStatus(name,directory)).attempts).toEqual([]);
});
it('counts input before generation and retains an oversized attempt',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  const send=vi.fn<typeof fetch>().mockResolvedValue(json({object:'response.input_tokens',input_tokens:32001}));
  await expect(originalRequest(request(),context,'low-cost',1000,'dummy',name,{fetch:send,directory,now})).rejects.toMatchObject({code:'budget-input-limit'});
  expect(send).toHaveBeenCalledTimes(1);expect((await budgets.budgetStatus(name,directory)).unresolved).toBe(true);
});
it.each([
  [()=>json({error:'dummy-secret'},429),'rate-limit'],
  [()=>json({...envelope,service_tier:'priority'}),'invalid-usage'],
  [()=>json({...envelope,usage:{input_tokens:32001,output_tokens:200}}),'invalid-usage'],
  [()=>json({...envelope,usage:{input_tokens:1000,output_tokens:1001}}),'invalid-usage'],
  [()=>json({...envelope,status:'incomplete'}),'incomplete'],
] as const)('never refunds or retries failed generation',async(response,code)=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  const send=vi.fn<typeof fetch>().mockResolvedValueOnce(count()).mockResolvedValueOnce(response());
  await expect(originalRequest(request(),context,'low-cost',1000,'dummy',name,{fetch:send,directory,now})).rejects.toMatchObject({code});
  expect(send).toHaveBeenCalledTimes(2);expect((await budgets.budgetStatus(name,directory)).unresolved).toBe(true);
});
it('runs live batches through the shared ledger and retains successes when the allowance ends',async()=>{
  await budgets.initializeBudget(name,0.01,directory,now);
  const repo=join(root,'repo');await fs.mkdir(repo);
  for(const path of ['a.py','b.py','c.py'])await fs.writeFile(join(repo,path),'value = 1');
  vi.stubEnv('SHIPCHECK_API_KEY','dummy-secret');
  const send=vi.fn<typeof fetch>(async url=>String(url).endsWith('/input_tokens')?count():json(envelope));
  vi.spyOn(live,'requestBudgetQa').mockImplementation((request,context,mode,timeout,key,budget)=>
    originalRequest(request,context,mode,timeout,key,budget,{fetch:send,directory,now}));
  const report=await reviewWholeRepository(repo,{execution:'live',budget:name,config:{ai:{maxFiles:1}}});
  expect(report.aiAudit).toMatchObject({state:'failed',budgetName:name,stoppedReason:'budget-exhausted',validResponsePaths:['a.py']});
  expect(report.aiAudit!.batches.map(batch=>batch.status)).toEqual(['completed','failed']);
  expect(report.aiAudit!.skipped).toContainEqual({path:'c.py',reason:'stopped:budget-exhausted'});
  expect(send).toHaveBeenCalledTimes(2);expect((await budgets.budgetStatus(name,directory)).attempts).toHaveLength(1);
});
it('validates explicit CLI budget selection without allowing config to authorize spend',async()=>{
  for(const args of [['audit','--ai','live'],['audit','--ai','mock','--budget',name],['audit','--budget',name],
    ['audit','--ai','live','--budget',name,'--trial'],['audit','--ai','live','--budget','../escape']])
    expect((await runCli(args)).exitCode).toBe(2);
  expect((await runCli(['help','budget'])).stdout).toContain('budget init');expect(fetch).not.toHaveBeenCalled();
  for(const value of ['NaN','Infinity','0','-1','0.001','100.01','1e2'])expect(()=>budgets.parseAllowanceUsd(value)).toThrow();
  expect(budgets.parseAllowanceUsd('0.50')).toBe(0.5);
});
it('routes a full live CLI audit through the configured credential and shared allowance',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  const repo=join(root,'repo');await fs.mkdir(repo);
  await fs.writeFile(join(repo,'a.py'),'value = 1');await fs.writeFile(join(repo,'b.py'),'value = 2');
  await fs.writeFile(join(repo,'shipcheck.config.json'),JSON.stringify({ai:{maxFiles:1,apiKeyEnv:'CUSTOM_AUDIT_CREDENTIAL'}}));
  vi.stubEnv('CUSTOM_AUDIT_CREDENTIAL','dummy-custom');
  const send=vi.fn<typeof fetch>(async url=>String(url).endsWith('/input_tokens')?count():json(envelope));
  vi.spyOn(live,'requestBudgetQa').mockImplementation((request,context,mode,timeout,key,budget)=>{
    expect(key).toBe('dummy-custom');
    return originalRequest(request,context,mode,timeout,key,budget,{fetch:send,directory,now});
  });
  const result=await runCli(['audit',repo,'--whole-repository','--ai','live','--budget',name,'--json']);
  expect(result.exitCode).toBe(0);
  const report=JSON.parse(result.stdout);
  expect(report.aiAudit.validResponsePaths).toEqual(['a.py','b.py']);
  expect(report.aiAudit.batches.every((batch:{execution:string})=>batch.execution==='live')).toBe(true);
  expect(send).toHaveBeenCalledTimes(4);expect((await budgets.budgetStatus(name,directory)).reservedUsd).toBe(0.0125);
});
it('dispatches budget initialization and status without silently resetting a name',async()=>{
  const init=vi.spyOn(budgets,'initializeBudget').mockResolvedValue(undefined);
  const status=vi.spyOn(budgets,'budgetStatus').mockResolvedValue({name,allowanceUsd:0.5,reservedUsd:0,remainingUsd:0.5,
    expires:budgets.PRICING_EXPIRES,pricedUsageUpperBoundUsd:0,locked:false,unresolved:false,attempts:[]});
  expect((await runCli(['budget','init',name,'--usd','0.50'])).exitCode).toBe(0);
  expect(init).toHaveBeenCalledWith(name,0.5);
  expect((await runCli(['budget','status',name])).exitCode).toBe(0);
  expect(init).toHaveBeenCalledTimes(1);expect(status).toHaveBeenCalledTimes(2);
  const settle=vi.spyOn(budgets,'settleBudgetAttempt').mockResolvedValue(undefined);
  expect((await runCli(['budget','settle',name,'000003'])).exitCode).toBe(2);
  expect(settle).not.toHaveBeenCalled();
  expect((await runCli(['budget','settle',name,'000003','--charge-reservation'])).exitCode).toBe(0);
  expect(settle).toHaveBeenCalledWith(name,'000003');
});
it('preserves legacy ledger receipts and expiry without renewing an allowance',async()=>{
  await budgets.initializeBudget(name,0.5,directory,now);await reserve();
  const path=join(directory,'policy.json');
  const policy=JSON.parse(await fs.readFile(path,'utf8'));
  await fs.writeFile(path,JSON.stringify({...policy,version:1,expires:'2026-10-03T00:00:00.000Z'}));
  expect(await budgets.budgetStatus(name,directory)).toMatchObject({expires:'2026-10-03T00:00:00.000Z',reservedUsd:0.00625,remainingUsd:0.49375,pricedUsageUpperBoundUsd:0.000225});
  const callback=vi.fn(execute);await expect(reserve(callback)).rejects.toMatchObject({code:'pricing-expired'});expect(callback).not.toHaveBeenCalled();
  await fs.unlink(join(directory,'000001.receipt.json'));
  await budgets.settleBudgetAttempt(name,'000001',directory);
  expect(await budgets.budgetStatus(name,directory)).toMatchObject({unresolved:false,reservedUsd:0.00625,remainingUsd:0.49375});
  expect(JSON.parse(await fs.readFile(path,'utf8'))).toEqual({...policy,version:1,expires:'2026-10-03T00:00:00.000Z'});
});
it.each([{version:3},{version:1},{expires:'2099-01-01T00:00:00.000Z'}])('rejects unknown or mismatched policy versions %j',async(change)=>{
  await budgets.initializeBudget(name,0.5,directory,now);
  const path=join(directory,'policy.json'),policy=JSON.parse(await fs.readFile(path,'utf8'));
  await fs.writeFile(path,JSON.stringify({...policy,...change}));
  await expect(budgets.budgetStatus(name,directory)).rejects.toMatchObject({code:'budget-state'});
});
