import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseDiagnostics} from '../src/check-diagnostics.js';
import {runCli} from '../src/cli-command.js';
import {configSchema} from '../src/config.js';
import {planQuality} from '../src/quality.js';
let root:string;
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-p23-'));vi.stubGlobal('fetch',()=>{throw Error('Network forbidden');});});
afterEach(async()=>{vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
const json=(severity='error',file='main.py')=>({generalDiagnostics:[{file,severity,message:'Type mismatch',rule:'reportAssignmentType',range:{start:{line:0,character:0},end:{line:0,character:1}}}],summary:{filesAnalyzed:1,errorCount:severity==='error'?1:0,warningCount:severity==='warning'?1:0,informationCount:severity==='information'?1:0}});
it.each(['error','warning','information'])('normalizes Pyright %s with one-based locations',severity=>{
 expect(parseDiagnostics('pyright-json',JSON.stringify(json(severity)),root,'types')[0]).toMatchObject({tool:'pyright',path:'main.py',line:1,column:1,severity:severity==='information'?'info':severity});
});
it.each(['outside','count','range','unknown'])('rejects misleading Pyright data: %s',kind=>{
 const value=json();if(kind==='outside')value.generalDiagnostics[0]!.file='../outside.py';
 if(kind==='count')value.summary.errorCount=0;
 if(kind==='range')value.generalDiagnostics[0]!.range.end.line=-1;
 if(kind==='unknown')value.generalDiagnostics[0]!.severity='success';
 expect(()=>parseDiagnostics('pyright-json',JSON.stringify(value),root,'types')).toThrow();
});
async function configure(check:object){await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({checks:[{id:'tests',command:process.execPath,args:['-e','process.exit(0)'],...check}]}));}
it('required does not authorize commands and makes omission incomplete',async()=>{
 await configure({required:true,args:['-e','throw Error("must not execute")']});
 const result=await runCli(['audit',root,'--json']);expect(result.exitCode).toBe(2);
 const report=JSON.parse(result.stdout);expect(report.checks[0]).toMatchObject({required:true,status:'skipped'});expect(report.auditSummary.outcome).toBe('incomplete');
});
it.each([0,1,2])('preserves required executed exit %s semantics',async code=>{
 await configure({required:true,args:['-e',`process.exit(${code})`]});
 expect((await runCli(['audit',root,'--run-checks','--json'])).exitCode).toBe(code);
});
it('language-skipped required checks cannot pass',async()=>{
 await configure({required:true,languages:['Python']});
 expect((await runCli(['audit',root,'--run-checks','--json'])).exitCode).toBe(2);
});
it('default optional skips still preserve exit zero',async()=>{
 await configure({});expect((await runCli(['audit',root,'--json'])).exitCode).toBe(0);
});
it('plans opt-in Python types, preserves existing Python lint and rejects disabled requirements',async()=>{
 for(const input of [{quality:{presets:['python'],required:['pyright']}},{quality:{presets:['python-types'],required:['pyright'],bindings:{pyright:false}}}])expect(configSchema.safeParse(input).success).toBe(false);
 await mkdir(join(root,'node_modules/pyright'),{recursive:true});await writeFile(join(root,'node_modules/pyright/index.js'),'throw Error("no discovery execution");');
 const planned=await planQuality(root,configSchema.parse({quality:{presets:['python-types'],required:['pyright']}}),['Python'],false);
 expect(planned.checks[0]).toMatchObject({id:'quality-pyright',required:true,format:'pyright-json',purpose:'typecheck'});
 expect(planned.checks[0]?.args).toEqual([join(root,'node_modules/pyright/index.js'),'--outputjson']);
 const absent=await planQuality(root,configSchema.parse({quality:{presets:['python-types'],required:['pyright']}}),[],true);
 expect(absent.unavailable[0]).toMatchObject({required:true,status:'skipped'});
});
it('required bindings are applied without mutating config or duplicating execution',async()=>{
 const config=configSchema.parse({quality:{presets:['python-types'],required:['pyright'],bindings:{pyright:'types'}},checks:[{id:'types',command:'tool'}]});
 const planned=await planQuality(root,config,[],false);expect(planned.checks).toHaveLength(1);expect(planned.checks[0]?.required).toBe(true);expect(config.checks[0]?.required).toBeUndefined();
});
it('uses the structured parser through a real child process and retains operational errors',async()=>{
 for(const code of [1,2]){
 await configure({format:'pyright-json',args:['-e',`console.log(${JSON.stringify(JSON.stringify(json()))});process.exit(${code})`]});
 const result=await runCli(['audit',root,'--run-checks','--json']);expect(result.exitCode).toBe(code);
 expect(JSON.parse(result.stdout).checks[0].status).toBe(code===1?'failed':'error');
 }
});
it('enforces required checks on an empty diff',async()=>{
 await configure({required:true});
 const git=(...args:string[])=>{const result=spawnSync('git',['-C',root,...args],{encoding:'utf8',windowsHide:true});expect(result.status,result.stderr).toBe(0);};
 git('init');git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture');
 expect((await runCli(['diff',root,'--json'])).exitCode).toBe(2);
 expect((await runCli(['diff',root,'--json','--run-checks'])).exitCode).toBe(0);
});

it('rejects Pyright stub generation in audit checks',()=>{
 expect(configSchema.safeParse({checks:[{id:'types',command:'pyright',args:['--createstub','package']}]}).success).toBe(false);
});
