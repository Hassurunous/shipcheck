import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,rm,readdir} from 'node:fs/promises';
import {join,resolve,dirname,relative} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {inspectRepository} from '../dist/src/inspect-repository.js';
import {configSchema} from '../dist/src/config.js';
import {collectContext} from '../dist/src/ai/context.js';
import {planAnalysisContext} from '../dist/src/ai/analysis-context.js';
import {buildRequest} from '../dist/src/ai/client.js';
import {requestBudgetQa} from '../dist/src/ai/live.js';
import {verifyEvidence} from '../dist/src/ai/verify-evidence.js';
import {verifyExecutionClaims} from '../dist/src/ai/verify-execution.js';
import {budgetStatus,AUDIT_MODELS,auditReservationMicroUsd} from '../dist/src/ai/audit-budget.js';
const [mode,out,eslintArg,budget,...extra]=process.argv.slice(2);
assert.ok(['--offline','--live'].includes(mode) && out && eslintArg && !extra.length && (mode==='--live')===Boolean(budget),
  'Usage: node scripts/evidence-compare.mjs --offline|--live <new-output-directory> <eslint.js> [fresh-budget]');
const live=mode==='--live',eslint=resolve(eslintArg),hash=value=>createHash('sha256').update(value).digest('hex');
const corpus=await readFile(new URL('../fixtures/evidence-comparison/cases.json',import.meta.url),'utf8');
const cases=JSON.parse(corpus);assert.equal(cases.length,8);assert.equal(new Set(cases.map(c=>c.id)).size,8);
const plannedReservations=cases.length*2*auditReservationMicroUsd('low-cost')/1e6;
if(live){const state=await budgetStatus(budget);assert.ok(!state.locked && !state.unresolved && state.attempts.length===0 && state.allowanceUsd<=0.25 && state.remainingUsd>=plannedReservations,'A fresh resolved budget <= $0.25 covering all planned reservations is required.');}
else globalThis.fetch=()=>{throw Error('Offline network forbidden');};
const apiKeyEnv=process.env.SHIPCHECK_API_KEY?'SHIPCHECK_API_KEY':'OPENAI_PROJECTDEV_API_KEY';
if(live)assert.ok(process.env[apiKeyEnv]?.trim(),'Configured credential is unavailable');
const output=resolve(out);await mkdir(dirname(output),{recursive:true});await mkdir(output);
const manifest={corpusSha256:hash(corpus),mode,model:AUDIT_MODELS['low-cost'].model,plannedRequests:cases.length*2,plannedReservations,
  node:process.version,platform:process.platform,eslintSha256:hash(await readFile(eslint)),order:'withheld first on even case indices; supplied first on odd',
  limitation:'Same new prompt/schema in both arms; measures supplied evidence, not old-vs-new product. Single sample per arm. Developer-authored, non-blind.'};
await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2),{flag:'wx'});
async function snapshot(root){const result={};async function visit(directory){for(const item of await readdir(directory,{withFileTypes:true})){const path=join(directory,item.name);assert.ok(!item.isSymbolicLink());if(item.isDirectory())await visit(path);else result[relative(root,path)]=hash(await readFile(path));}}await visit(root);return result;}
const runs=[];
try {
 for(const [index,fixture] of cases.entries()) {
  const root=await mkdtemp(join(tmpdir(),'shipcheck-p22-'));
  try {
   for(const [path,content] of Object.entries(fixture.files)){assert.ok(!path.includes('/') && !path.includes('\\') && !path.includes('..'));await writeFile(join(root,path),content);}
   const check=fixture.tool==='eslint'?{id:'lint',purpose:'lint',command:process.execPath,args:[eslint,'main.js','--format','json','--no-inline-config'],format:'eslint-json'}:
    {id:'tests',purpose:'test',command:process.execPath,args:['--input-type=module','-e',fixture.script ?? (fixture.tool==='timeout'?'setInterval(()=>{},1000)':'throw Error("must not run")')],...(fixture.tool==='timeout'?{timeoutMs:100}:{})};
   const config=configSchema.parse({checks:[check],ai:{mode:'low-cost',maxOutputTokens:2000,timeoutMs:60000,apiKeyEnv}});
   const before=await snapshot(root);
   // Configuration is explicit and only synthetic verifier commands are authorized.
   const {runChecks}=await import('../dist/src/checks.js');
   const checks=await runChecks(root,config.checks,fixture.tool!=='unauthorized',apiKeyEnv);
   assert.equal(checks[0]?.status,fixture.expectedStatus);
   const profile=await inspectRepository(root);
   const {createReport}=await import('../dist/src/findings.js');
   const captured={...createReport(profile,config),checks};
   const plan=planAnalysisContext(captured,config.ai.maxContextBytes,apiKeyEnv,process.env);
   assert.ok(plan.context && !plan.limited,'All evaluation evidence must fit');
   const context=await collectContext(profile,{...config.ai,maxContextBytes:config.ai.maxContextBytes-plan.bytes},fixture.paths);
   assert.equal(context.files.length,fixture.paths.length);assert.equal(context.preview.limited,false);
   let firstSource;
   for(const arm of index%2===0?['withheld','supplied']:['supplied','withheld']) {
    const supplied={...context,...(arm==='supplied'?{analysis:plan.context}:{})};
    const request=buildRequest(supplied,config.ai,AUDIT_MODELS['low-cost'].model);
    const input=JSON.parse(request.input[0].content);delete input.analysisResults;
    if(firstSource)assert.equal(JSON.stringify(input),firstSource);else firstSource=JSON.stringify(input);
    const requestHash=hash(JSON.stringify(request));
    const run={caseId:fixture.id,arm,requestHash,sourceHash:hash(firstSource),checks,capturedAnalysis:arm==='supplied'?plan.context:null};
    if(live){const result=await requestBudgetQa(request,supplied,'low-cost',60000,process.env[apiKeyEnv],budget);
     const fresh=await collectContext(profile,{...config.ai,maxContextBytes:config.ai.maxContextBytes-plan.bytes},fixture.paths);
     Object.assign(run,result,{verifications:result.output.candidates.map(candidate=>({citations:verifyEvidence(candidate,supplied,fresh),execution:verifyExecutionClaims(candidate.executionClaims,supplied.analysis)}))});
    }
    assert.deepEqual(await snapshot(root),before,'Audit changed source');
    // Capture only synthetic source/output; remove ephemeral absolute paths.
    let serialized=JSON.stringify(run,null,2);
    for(const path of [root,eslint])serialized=serialized.split(JSON.stringify(path).slice(1,-1)).join('<local-path>');
    const saved=JSON.parse(serialized);runs.push(saved);
    await writeFile(join(output,fixture.id+'-'+arm+'.json'),serialized,{flag:'wx'});
    console.log(JSON.stringify({caseId:fixture.id,arm,status:checks[0].status,candidates:run.output?.candidates.length ?? null}));
   }
  } finally {const resolved=relative(tmpdir(),root);assert.ok(resolved.startsWith('shipcheck-p22-') && !resolved.includes('..'));await rm(root,{recursive:true,force:true});}
 }
} catch(error) {await writeFile(join(output,'failure.json'),JSON.stringify({code:error.code ?? 'evaluation-failure',completed:runs.length}));throw error;}
finally {await writeFile(join(output,'evaluation.json'),JSON.stringify({manifest,runs,...(live?{budget:await budgetStatus(budget)}:{apiSpendUsd:0})},null,2),{flag:'wx'});}
