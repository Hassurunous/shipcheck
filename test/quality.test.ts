import fs from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {configSchema} from '../src/config.js';
import {planQuality} from '../src/quality.js';
import {runWorkflow} from '../src/workflows.js';
import {runCli} from '../src/cli-command.js';
import {reviewRepository} from '../src/review-repository.js';
import {renderConsoleReport} from '../src/reporters.js';
let root:string;
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-quality-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Network forbidden');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
async function write(path:string,value:string){await fs.mkdir(dirname(join(root,path)),{recursive:true});await fs.writeFile(join(root,path),value);}
async function configure(value:unknown){await write('shipcheck.config.json',JSON.stringify(value));}
const eslint=(body:string)=>write('node_modules/eslint/bin/eslint.js',body);
it('rejects unknown/duplicate presets, dangling bindings, collisions and overflow',()=>{
  for(const value of [
    {quality:{presets:['rust']}},{quality:{presets:['python','python']}},
    {quality:{presets:['python'],bindings:{eslint:false}}},
    {quality:{presets:['python'],bindings:{ruff:'missing'}}},
    {quality:{presets:['python']},checks:[{id:'quality-ruff',command:'x'}]},
    {quality:{presets:['typescript']},checks:Array.from({length:19},(_,i)=>({id:'c'+i,command:'x'}))},
  ])expect(configSchema.safeParse(value).success).toBe(false);
});
it('default configuration does not discover or execute tools',async()=>{
  await write('main.js','const x=1;');const report=await runWorkflow(root,'audit');expect(report.quality).toBeUndefined();expect(report.checks).toBeUndefined();
});
it('discloses missing tools before authorization and returns operational failure when requested',async()=>{
  await write('main.ts','export const x=1;');await configure({quality:{presets:['typescript']}});
  const before=await runCli(['audit',root,'--json']);expect(before.exitCode).toBe(0);
  expect(JSON.parse(before.stdout).quality.tools.every((t:{status:string})=>t.status==='unavailable')).toBe(true);
  const after=await runCli(['audit',root,'--json','--run-checks']);expect(after.exitCode).toBe(2);
  expect(JSON.parse(after.stdout).checks.every((c:{status:string})=>c.status==='error')).toBe(true);
});
it('finds one ESLint for combined JS/TS presets without running a probe',async()=>{
  await write('main.ts','const x=1;');await eslint("throw Error('Must never execute discovery');");await configure({quality:{presets:['javascript','typescript']}});
  const report=await runWorkflow(root,'audit');expect(report.quality?.tools.filter(t=>t.slot==='eslint')).toHaveLength(1);
  expect(report.checks?.find(c=>c.id==='quality-eslint')?.status).toBe('skipped');expect(fetch).not.toHaveBeenCalled();
});
it('runs the project-local tool through bounded diagnostics and preserves purpose',async()=>{
  await write('main.js','missing();');await configure({quality:{presets:['javascript']}});
  await eslint('console.log(JSON.stringify([{filePath:process.cwd()+"/main.js",messages:[{ruleId:"no-undef",severity:2,message:"missing is undefined",line:1,column:1}]}]));process.exitCode=1;');
  const result=await runCli(['audit',root,'--run-checks','--json']);expect(result.exitCode).toBe(1);
  const report=JSON.parse(result.stdout);expect(report.checks[0]).toMatchObject({id:'quality-eslint',status:'failed',purpose:'lint'});
  expect(report.checks[0].diagnostics[0]).toMatchObject({ruleId:'no-undef',path:'main.js'});
  expect(report.auditSummary.outcome).toBe('issues-reported');expect(await fs.readFile(join(root,'main.js'),'utf8')).toBe('missing();');
});
it('reports invalid structured output as an error',async()=>{
  await write('main.js','const x=1;');await configure({quality:{presets:['javascript']}});await eslint('console.log("not JSON");');
  expect((await runWorkflow(root,'audit',undefined,{runChecks:true})).checks?.[0]?.status).toBe('error');
});
it('binds existing checks once and keeps their explicit settings, including test labeling',async()=>{
  await write('main.py','x=1');await configure({quality:{presets:['python'],bindings:{ruff:'lint'}},checks:[{id:'lint',command:process.execPath,args:['-e','console.log("[]")'],format:'ruff-json'},{id:'tests',purpose:'test',command:process.execPath,args:['-e','process.exit(0)']}]});
  const r=await runWorkflow(root,'audit',undefined,{runChecks:true});expect(r.checks).toHaveLength(2);expect(r.checks?.every(c=>c.status==='passed')).toBe(true);
  expect(r.quality?.tools[0]).toMatchObject({source:'configured',checkId:'lint'});expect(r.quality?.gaps.some(g=>g.includes('purpose: test'))).toBe(false);expect(r.quality?.gaps.some(g=>g.includes('typecheck Python'))).toBe(true);
});
it('respects explicit disabling and excludes ignored languages from automatic selection',async()=>{
  await write('hidden/main.py','x=1');await write('.gitignore','hidden/');await write('main.ts','const x=1;');
  await configure({quality:{presets:['typescript','python'],bindings:{eslint:false,typescript:false}}});
  const r=await runWorkflow(root,'audit',undefined,{runChecks:true});expect(r.checks).toBeUndefined();
  expect(r.quality?.tools.map(t=>t.status)).toEqual(['disabled','disabled','not-applicable']);
});
it('does not discover through linked directories',async()=>{
  await fs.mkdir(join(root,'external'));await fs.symlink(join(root,'external'),join(root,'node_modules'),'junction');
  const plan=await planQuality(root,configSchema.parse({quality:{presets:['javascript']}}),['JavaScript'],true);
  expect(plan.report?.tools[0]?.status).toBe('unavailable');
});
it('requires a root tsconfig and emits non-writing compiler arguments',async()=>{
  await write('node_modules/typescript/bin/tsc','');
  const config=configSchema.parse({quality:{presets:['typescript'],bindings:{eslint:false}}});
  expect((await planQuality(root,config,['TypeScript'],true)).report?.tools[1]?.status).toBe('unavailable');
  await write('tsconfig.json','{}');const plan=await planQuality(root,config,['TypeScript'],true);
  expect(plan.checks[0]?.args).toEqual([join(root,'node_modules/typescript/bin/tsc'),'--project','tsconfig.json','--noEmit','--incremental','false','--pretty','false']);
  expect(plan.checks[0]?.failureExitCodes).toEqual([1,2]);
});
it('plans Ruff with fixing and cache disabled and never reads its executable',async()=>{
  const path=process.platform==='win32'?'.venv/Scripts/ruff.exe':'.venv/bin/ruff';await write(path,'binary fixture');
  const plan=await planQuality(root,configSchema.parse({quality:{presets:['python']}}),['Python'],false);
  expect(plan.checks[0]?.args).toContain('--no-fix');expect(plan.checks[0]?.args).toContain('--no-cache');
});
it('composes authorized checks with optional AI preview and whole-repository mock, without spending',async()=>{
  await write('main.js','export const x=1;');await configure({quality:{presets:['javascript']},ai:{focus:['correctness','code-smells']}});await eslint('console.log("[]");');
  const r=await runWorkflow(root,'audit',{execution:'preview'},{runChecks:true});expect(r.checks?.[0]?.status).toBe('passed');expect(r.ai?.status).toBe('preview');expect(renderConsoleReport(r)).toContain('Quality presets: javascript');
  const whole=await runWorkflow(root,'audit',{execution:'mock'},{runChecks:true,wholeRepository:true});expect(whole.aiAudit?.batches[0]?.execution).toBe('mock');expect(fetch).not.toHaveBeenCalled();
});
it('discloses unexecuted presets in the lower-level API',async()=>{
  await configure({quality:{presets:['python']}});const r=await reviewRepository(root);expect(r.auditSummary?.stages.find(s=>s.id==='quality')?.status).toBe('not-run');
});

it('does not copy configured command arguments into discovery reports',async()=>{
  const config=configSchema.parse({quality:{presets:['python'],bindings:{ruff:'custom'}},checks:[{id:'custom',command:'private-command',args:['literal-sensitive-value']}]});
  const plan=await planQuality(root,config,['Python'],false);
  expect(JSON.stringify(plan.report)).not.toContain('literal-sensitive-value');
  expect(plan.report?.tools[0]).not.toHaveProperty('command');
});
