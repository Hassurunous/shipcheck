import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,mkdtemp,rm,readdir} from 'node:fs/promises';
import {join,resolve,dirname,relative} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {runCli} from '../dist/src/cli-command.js';
import {budgetStatus} from '../dist/src/ai/audit-budget.js';
import {effectivenessCaseSchema,scoreEffectiveness,reportHash} from '../dist/src/effectiveness.js';
const [mode,out,eslintPath,ruffPath,tscPath,budget,...extra]=process.argv.slice(2);
if(!['--offline','--live'].includes(mode) || !out || !eslintPath || !ruffPath || !tscPath || extra.length || (mode==='--live')!==Boolean(budget))throw Error('Usage: node scripts/effectiveness-evaluate.mjs --offline|--live <new-output-directory> <eslint.js> <ruff.exe> <tsc> [existing-budget]');
const live=mode==='--live';
if(!live)globalThis.fetch=()=>{throw Error('Offline evaluation forbids API requests');};
if(live){const state=await budgetStatus(budget);if(state.locked || state.unresolved || state.allowanceUsd>1)throw Error('Use a resolved, unlocked evaluation allowance of at most $1.');}
const corpusText=await readFile(new URL('../fixtures/effectiveness/cases.json',import.meta.url),'utf8');
const cases=JSON.parse(corpusText).map(c=>effectivenessCaseSchema.parse(c));
const hash=text=>createHash('sha256').update(text).digest('hex');
const output=resolve(out);await mkdir(dirname(output),{recursive:true});await mkdir(output); // Never overwrite earlier evidence.
const env={...process.env};for(const name of Object.keys(env))if(/KEY|TOKEN|SECRET|PASSWORD/i.test(name))delete env[name];
const version=(command,args)=>{const p=spawnSync(command,args,{env,encoding:'utf8',timeout:10000,windowsHide:true});assert.ifError(p.error);assert.equal(p.status,0,p.stderr);return p.stdout.trim();};
const tools={eslint:resolve(eslintPath),ruff:resolve(ruffPath),typescript:resolve(tscPath)};
const versions={node:process.version,platform:process.platform,arch:process.arch,eslint:version(process.execPath,[tools.eslint,'--version']),ruff:version(tools.ruff,['--version']),typescript:version(process.execPath,[tools.typescript,'--version'])};
const runs=[];const measurements=[];
async function write(root,path,content){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),content);}
async function snapshot(root){const state={};async function visit(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);assert.ok(!e.isSymbolicLink());if(e.isDirectory())await visit(path);else state[relative(root,path)]=hash(await readFile(path));}}await visit(root);return state;}
for(const fixture of cases){
  const root=await mkdtemp(join(tmpdir(),'shipcheck-p21-'));
  try {
    for(const [path,content] of Object.entries(fixture.files))await write(root,path,content);
    const config=structuredClone(fixture.config);config.checks=[];
    if(fixture.tools.includes('eslint')){
      await write(root,'eslint.config.mjs','export default [{files:["**/*.js"],rules:{"no-undef":"error"}}];');
      config.quality={presets:['javascript'],bindings:{eslint:'lint'}};
      config.checks.push({id:'lint',command:process.execPath,args:[tools.eslint,'main.js','--format','json','--no-inline-config'],format:'eslint-json'});
    }
    if(fixture.tools.includes('ruff')){config.quality={presets:['python'],bindings:{ruff:'lint'}};config.checks.push({id:'lint',command:tools.ruff,args:['check','main.py','--isolated','--no-fix','--no-fix-only','--no-cache','--select','F401','--output-format','json'],format:'ruff-json'});}
    if(fixture.tools.includes('typescript')){await write(root,'tsconfig.json',JSON.stringify({compilerOptions:{strict:true,types:[]},files:['main.ts']}));config.quality={presets:['typescript'],bindings:{eslint:false,typescript:'types'}};config.checks.push({id:'types',purpose:'typecheck',command:process.execPath,args:[tools.typescript,'--project','tsconfig.json','--noEmit','--incremental','false','--pretty','false'],failureExitCodes:[1,2]});}
    if(fixture.tools.includes('node-test'))config.checks.push({id:'tests',purpose:'test',command:process.execPath,args:['--test','test.mjs']});
    config.ai={mode:'low-cost',maxOutputTokens:2000,timeoutMs:60000,focus:['correctness','race-conditions','resource-management','error-handling','code-smells'],apiKeyEnv:process.env.SHIPCHECK_API_KEY?'SHIPCHECK_API_KEY':'OPENAI_PROJECTDEV_API_KEY'};
    await write(root,'shipcheck.config.json',JSON.stringify(config));
    const before=await snapshot(root),started=performance.now();
    const result=await runCli(['audit',root,'--run-checks','--json',...(live?['--ai','live','--budget',budget]:[])]);
    if(!result.stdout)throw Error('Audit did not produce a report: '+result.stderr);
    const original=JSON.parse(result.stdout);assert.deepEqual(await snapshot(root),before,'Audit changed fixture files');
    // Remove ephemeral repository and tool installation paths from persisted reports.
    let serialized=JSON.stringify(original);
    for(const value of [root,...Object.values(tools)])serialized=serialized.split(JSON.stringify(value).slice(1,-1)).join('<local-path>');
    const report=JSON.parse(serialized);const run={caseId:fixture.id,exitCode:result.exitCode,report};runs.push(run);
    let oracle=null;
    if(fixture.oracle){await write(root,'oracle.mjs',fixture.oracle);const p=spawnSync(process.execPath,['oracle.mjs'],{cwd:root,env,encoding:'utf8',timeout:10000,windowsHide:true});assert.ifError(p.error);oracle={passed:p.status===0,expectedPass:fixture.kind==='clean'};assert.equal(oracle.passed,oracle.expectedPass,'Ground-truth oracle contradicted fixture');}
    measurements.push({caseId:fixture.id,elapsedMs:Math.round(performance.now()-started),reportHash:reportHash(report),sourcePreserved:true,oracle});
    await writeFile(join(output,fixture.id+'.json'),JSON.stringify(run,null,2),{flag:'wx'});
    console.log(JSON.stringify({caseId:fixture.id,exitCode:result.exitCode,candidates:report.ai?.candidates.length,aiStatus:report.ai?.status}));
    if(live && report.ai?.status!=='completed'){process.exitCode=2;break;}
  } finally {assert.ok(relative(tmpdir(),root).startsWith('shipcheck-p21-'));await rm(root,{recursive:true,force:true});}
}
const evidence={schemaVersion:1,mode:live?'live':'offline',corpusSha256:hash(corpusText),versions,runs,measurements,assessments:[],
  summary:scoreEffectiveness(cases,runs,[],live?'live':'offline'),...(live?{budget:await budgetStatus(budget)}:{apiSpendUsd:0})};
await writeFile(join(output,'evaluation.json'),JSON.stringify(evidence,null,2),{flag:'wx'});
console.log(JSON.stringify({mode:evidence.mode,cases:runs.length,summary:evidence.summary,budget:evidence.budget?{reservedUsd:evidence.budget.reservedUsd,pricedUsageUpperBoundUsd:evidence.budget.pricedUsageUpperBoundUsd}:null}));
