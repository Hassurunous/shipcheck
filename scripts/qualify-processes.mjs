import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {initializeBudget,budgetStatus} from '../dist/src/ai/audit-budget.js';
import {runChecks,checksSchema} from '../dist/src/checks.js';

// Synthetic ledgers and local processes only. Never accesses user budgets or HTTP.
const root=await mkdtemp(join(tmpdir(),'shipcheck-process-qualification-'));
const directory=join(root,'ledger'),now=Date.parse('2026-09-29T00:00:00Z'),name='qualification';
const moduleUrl=new URL('../dist/src/ai/audit-budget.js',import.meta.url).href;
let worker,descendant;
const reservation=`import {withAuditReservation} from ${JSON.stringify(moduleUrl)};`;
try {
  await initializeBudget(name,0.01,directory,now);
  worker=spawn(process.execPath,['--input-type=module','-e',reservation+`
    await withAuditReservation(${JSON.stringify(name)},'low-cost','a'.repeat(64),async()=>{
      process.send('reserved');await new Promise(()=>{setInterval(()=>{},1000)});
    },${JSON.stringify(directory)},${now});`],{stdio:['ignore','pipe','pipe','ipc'],windowsHide:true});
  const closed=new Promise(resolve=>worker.once('close',resolve));
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('Reservation worker did not start')),10000);
    worker.once('message',message=>{clearTimeout(timer);if(message==='reserved')resolve();else reject(Error('Unexpected worker message'));});
    worker.once('error',error=>{clearTimeout(timer);reject(error);});
    worker.once('exit',()=>{clearTimeout(timer);reject(Error('Worker exited before ready'));});
  });
  const second=spawnSync(process.execPath,['--input-type=module','-e',reservation+`
    try {await withAuditReservation(${JSON.stringify(name)},'low-cost','b'.repeat(64),async()=>{throw Error('Callback must not run')},${JSON.stringify(directory)},${now});process.exitCode=1;}
    catch(error){if(error.code!=='budget-state')throw error;console.log('blocked');}`],{encoding:'utf8',timeout:10000,windowsHide:true});
  assert.ifError(second.error);assert.equal(second.status,0,second.stderr);assert.equal(second.stdout.trim(),'blocked');
  worker.kill('SIGKILL');await closed;worker=undefined;
  const state=await budgetStatus(name,directory);assert.equal(state.locked,true);assert.equal(state.unresolved,true);assert.equal(state.attempts.length,1);assert.equal(state.reservedUsd,0.00625);
  const afterCrash=spawnSync(process.execPath,['--input-type=module','-e',reservation+`
    try {await withAuditReservation(${JSON.stringify(name)},'low-cost','c'.repeat(64),async()=>{throw Error('Callback must not run')},${JSON.stringify(directory)},${now});process.exitCode=1;}
    catch(error){if(error.code!=='budget-state')throw error;console.log('blocked');}`],{encoding:'utf8',timeout:10000,windowsHide:true});
  assert.ifError(afterCrash.error);assert.equal(afterCrash.status,0,afterCrash.stderr);assert.equal(afterCrash.stdout.trim(),'blocked');
  await writeFile(join(root,'parent.cjs'),`const {spawn}=require('node:child_process');const fs=require('node:fs');
    const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore',windowsHide:true});
    fs.writeFileSync('descendant.pid',String(child.pid));setInterval(()=>{},1000);`);
  const [timeout]=await runChecks(root,checksSchema.parse([{id:'tree',command:process.execPath,args:['parent.cjs'],timeoutMs:1500}]),true);
  descendant=Number(await readFile(join(root,'descendant.pid'),'utf8'));assert.ok(Number.isSafeInteger(descendant)&&descendant>0);
  assert.equal(timeout.status,'error');assert.match(timeout.reason,/Timeout/);
  let alive=true;for(let i=0;i<20;i++){try{process.kill(descendant,0);}catch(error){if(error.code!=='ESRCH')throw error;alive=false;break;}await delay(100);}
  assert.equal(alive,false,'Timed-out check left its descendant alive');descendant=undefined;
  console.log(JSON.stringify({platform:process.platform,node:process.version,crossProcessContention:'blocked',hardKilledReservation:'durable-and-blocked',reservedUsd:state.reservedUsd,timeoutDescendant:'terminated',apiSpendUsd:0,limits:'Synthetic local ledger; ordinary child tree only, not malicious detached-process containment.'},null,2));
} finally {
  if(worker && worker.exitCode===null && worker.signalCode===null){const stopped=new Promise(resolve=>worker.once('close',resolve));worker.kill('SIGKILL');await stopped;}
  if(descendant)try{process.kill(descendant,'SIGKILL');}catch{}
  await rm(root,{recursive:true,force:true});
}
