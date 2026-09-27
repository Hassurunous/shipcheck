import {beforeEach,afterEach,it,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseDiagnostics} from '../src/check-diagnostics.js';
import {checksSchema,runChecks} from '../src/checks.js';
import {runCli} from '../src/cli-command.js';
import {renderConsoleReport,renderMarkdownReport} from '../src/index.js';
let root:string;
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-diagnostics-'));});
afterEach(async()=>{await rm(root,{recursive:true,force:true});});
const eslint=(severity=2)=>[{filePath:'src/a.ts',messages:[{ruleId:'no-unused-vars',severity,message:'Unused local binding.',line:2,column:7}]}];
const ruff=()=>[{filename:'src/a.py',code:'F401',message:'Unused import.',location:{row:1,column:8},end_location:{row:1,column:10}}];
async function command(output:unknown,exitCode=0,format='eslint-json',extra:Record<string,unknown>={}) {
  const file=join(root,'tool.cjs');
  await writeFile(file,`process.stdout.write(${JSON.stringify(JSON.stringify(output))});process.stderr.write('tool warning');process.exit(${exitCode});`);
  return checksSchema.parse([{id:'lint',command:process.execPath,args:[file],format,...extra}]);
}
it('normalizes ESLint relative/absolute paths, levels and stable diagnostic IDs',()=>{
  const source=eslint(1);source[0]!.filePath=join(root,'src','a.ts');
  const result=parseDiagnostics('eslint-json',JSON.stringify(source),root,'lint');
  expect(result[0]).toMatchObject({tool:'eslint',ruleId:'no-unused-vars',severity:'warning',path:'src/a.ts',line:2,column:7,origin:'external-tool'});
  expect(parseDiagnostics('eslint-json',JSON.stringify(source),root,'lint')).toEqual(result);
  expect(parseDiagnostics('eslint-json',JSON.stringify([...source,...source]),root,'lint')).toHaveLength(1);
});
it('normalizes Ruff and preserves diagnostics lacking a file or rule without inventing locations',()=>{
  const result=parseDiagnostics('ruff-json',JSON.stringify(ruff()),root,'python');
  expect(result[0]).toMatchObject({tool:'ruff',ruleId:'F401',severity:'error',path:'src/a.py',line:1,column:8});
  const noLocation=parseDiagnostics('ruff-json',JSON.stringify([{filename:null,code:null,message:'General diagnostic',location:null}]),root,'python');
  expect(noLocation[0]).toMatchObject({path:null,ruleId:null});expect(noLocation[0]).not.toHaveProperty('line');
});
it.each(['../outside.ts','..\\outside.ts'])('rejects escaping paths %s',path=>{
  const source=eslint();source[0]!.filePath=path;
  expect(()=>parseDiagnostics('eslint-json',JSON.stringify(source),root,'lint')).toThrow('outside');
});
it('treats malformed diagnostics as operational errors, not a clean result',async()=>{
  const checks=await command([{filePath:'a.ts',messages:[{message:'missing severity'}]}]);
  expect((await runChecks(root,checks,true))[0]).toMatchObject({status:'error',reason:expect.stringContaining('Invalid structured')});
});
it('keeps stderr separate from JSON and fails on structured errors even with exit zero',async()=>{
  const [result]=await runChecks(root,await command(eslint()),true);
  expect(result).toMatchObject({status:'failed',exitCode:0,stderr:'tool warning'});
  expect(JSON.parse(result!.stdout!)).toEqual(eslint());expect(result!.diagnostics).toHaveLength(1);
  const report={schemaVersion:1 as const,root,findings:[],inspectionWarnings:[],checks:[result!]};
  expect(renderConsoleReport(report)).toContain('src/a.ts:2:7');
  expect(renderMarkdownReport(report)).toContain('no-unused-vars');
});
it('supports warning thresholds and never-policy without suppressing operational errors',async()=>{
  expect((await runChecks(root,await command(eslint(1)),true))[0]!.status).toBe('passed');
  expect((await runChecks(root,await command(eslint(1),0,'eslint-json',{failOn:'warning'}),true))[0]!.status).toBe('failed');
  expect((await runChecks(root,await command(eslint(),1,'eslint-json',{failOn:'never'}),true))[0]!.status).toBe('passed');
  expect((await runChecks(root,await command(eslint(),2,'eslint-json',{failOn:'never'}),true))[0]!.status).toBe('error');
  expect((await runChecks(root,await command([],1,'eslint-json',{failOn:'never'}),true))[0]!.status).toBe('failed');
});
it('runs Ruff through the CLI and returns normalized errors with exit one',async()=>{
  const checks=await command(ruff(),1,'ruff-json');
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({checks}));
  const result=await runCli(['audit',root,'--run-checks','--json']);
  expect(result.exitCode).toBe(1);expect(JSON.parse(result.stdout).checks[0].diagnostics[0].ruleId).toBe('F401');
});
it('selects language-specific checks from exclusion-aware inventory while keeping execution opt-in',async()=>{
  await mkdir(join(root,'src'));await writeFile(join(root,'src','a.py'),'value = 1');
  const checks=await command(ruff(),1,'ruff-json',{languages:['Python']});
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({checks,exclude:['src/**']}));
  const excluded=await runCli(['audit',root,'--run-checks','--json']);
  expect(JSON.parse(excluded.stdout).checks[0]).toMatchObject({status:'skipped',reason:expect.stringContaining('No configured language')});
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({checks}));
  expect((await runCli(['audit',root,'--run-checks','--json'])).exitCode).toBe(1);
  const unauthorized=await runCli(['audit',root,'--json']);
  expect(JSON.parse(unauthorized.stdout).checks[0]).toMatchObject({status:'skipped',reason:expect.stringContaining('--run-checks')});
});
it('terminates an ordinary spawned descendant when a check times out',async()=>{
  await writeFile(join(root,'parent.cjs'),`const {spawn}=require('node:child_process');
    const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});
    require('node:fs').writeFileSync('child.pid',String(child.pid));setInterval(()=>{},1000);`);
  let pid:number|undefined;
  try {
    const [result]=await runChecks(root,checksSchema.parse([{id:'tree',command:process.execPath,args:['parent.cjs'],timeoutMs:1500}]),true);
    expect(result).toMatchObject({status:'error',reason:expect.stringContaining('Timeout')});
    pid=Number(await readFile(join(root,'child.pid'),'utf8'));
    expect(Number.isInteger(pid) && pid>0).toBe(true);
    expect(()=>process.kill(pid!,0)).toThrow();
  } finally {if(pid && Number.isInteger(pid) && pid>0)try {process.kill(pid,'SIGKILL');} catch { /* Already terminated. */ }}
});
