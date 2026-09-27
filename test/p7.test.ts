import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {runCli} from '../src/cli-command.js';
import {configSchema} from '../src/config.js';
import {runChecks,checksSchema} from '../src/checks.js';
import {reviewWholeRepository,runWorkflow,renderMarkdownReport} from '../src/index.js';
import {aiSettingsSchema} from '../src/ai/contracts.js';
import {buildRequest} from '../src/ai/client.js';
let root:string;
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-p7-'));vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network forbidden');}));});
afterEach(async()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();await rm(root,{recursive:true,force:true});});
async function config(value:unknown){await writeFile(join(root,'shipcheck.config.json'),JSON.stringify(value));}
function check(script:string,extra:Record<string,unknown>={}){return checksSchema.parse([{id:'test',command:process.execPath,args:['-e',script],...extra}]);}
it('does not execute commands without explicit authorization',async()=>{
  const checks=check("require('fs').writeFileSync('marker','executed')");await config({checks});
  const result=await runCli(['audit',root,'--json']);
  expect(result.exitCode).toBe(0);expect(JSON.parse(result.stdout).checks[0].status).toBe('skipped');
  await expect(readFile(join(root,'marker'))).rejects.toThrow();
});
it('executes from the canonical repository root with literal arguments and captures results',async()=>{
  const checks=checksSchema.parse([{id:'literal',command:process.execPath,args:['-e','console.log(process.argv[1]);console.log(process.cwd())','a; echo unsafe']}]);
  const [result]=await runChecks(root,checks,true);
  expect(result!.status).toBe('passed');expect(result!.output).toContain('a; echo unsafe');
  expect(result!.output).toContain(root);
});
it('distinguishes command failures from operational errors and propagates CLI exit codes',async()=>{
  await config({checks:check('process.exit(1)')});
  expect((await runCli(['audit',root,'--run-checks'])).exitCode).toBe(1);
  await config({checks:check('process.exit(2)')});
  const failed=await runCli(['audit',root,'--run-checks','--json']);
  expect(failed.exitCode).toBe(2);expect(JSON.parse(failed.stdout).checks[0].status).toBe('error');
  expect((await runChecks(root,checksSchema.parse([{id:'absent',command:'shipcheck-no-such-executable'}]),true))[0]!.status).toBe('error');
});
it('bounds runtime and output',async()=>{
  const [timeout]=await runChecks(root,check('setInterval(()=>{},1000)',{timeoutMs:100}),true);
  expect(timeout).toMatchObject({status:'error',reason:expect.stringContaining('Timeout')});
  const [overflow]=await runChecks(root,check("console.log('x'.repeat(5000))",{maxOutputBytes:128}),true);
  expect(overflow).toMatchObject({status:'error',reason:expect.stringContaining('Output limit')});
  expect(Buffer.byteLength(overflow!.output)).toBeLessThanOrEqual(128);
});
it('does not forward credential variables to checks',async()=>{
  vi.stubEnv('CUSTOM_AI_CREDENTIAL','dummy-credential-value');vi.stubEnv('OTHER_API_KEY','another-dummy');
  const [result]=await runChecks(root,check("console.log(process.env.CUSTOM_AI_CREDENTIAL ?? 'absent');console.log(process.env.OTHER_API_KEY ?? 'absent')"),true,'CUSTOM_AI_CREDENTIAL');
  expect(result!.output).toBe('absent\nabsent\n');
});
it('validates credential references, limits and duplicate check IDs',()=>{
  expect(configSchema.parse({}).ai.apiKeyEnv).toBe('SHIPCHECK_API_KEY');
  expect(configSchema.parse({ai:{apiKeyEnv:'MY_PROJECT_KEY'}}).ai.apiKeyEnv).toBe('MY_PROJECT_KEY');
  expect(()=>configSchema.parse({ai:{apiKey:'raw-key'}})).toThrow();
  expect(()=>configSchema.parse({ai:{apiKeyEnv:'not a name'}})).toThrow();
  expect(()=>configSchema.parse({checks:[{id:'x',command:'node'},{id:'x',command:'node'}]})).toThrow();
  expect(()=>configSchema.parse({checks:[{id:'x',command:'node',timeoutMs:999999}]})).toThrow();
});
it('batches every eligible source file beyond a single request cap',async()=>{
  for(let i=0;i<5;i++)await writeFile(join(root,`file${i}.py`),`value = ${i}\n`);
  await config({ai:{maxFiles:2,scope:'whole-repository'}});
  const report=await runWorkflow(root,'audit',{execution:'mock'});
  expect(report.aiAudit!.batches).toHaveLength(3);
  expect(report.aiAudit!.validResponsePaths).toHaveLength(5);
  expect(report.aiAudit!.skipped).toContainEqual({path:'shipcheck.config.json',reason:'excluded-or-not-source'});
  expect(report.aiAudit!.batches.every(batch=>batch.execution==='mock')).toBe(true);
  expect(renderMarkdownReport(report)).toContain('AI candidates: 3');
});
it('reports batch caps and oversized source instead of calling partial results complete',async()=>{
  await writeFile(join(root,'a.py'),'value = 1');await writeFile(join(root,'b.py'),'value = 2');
  await writeFile(join(root,'c.py'),'x'.repeat(1000));
  const report=await reviewWholeRepository(root,{execution:'mock',config:{ai:{maxFiles:1,maxBatches:1,maxFileBytes:128}}});
  expect(report.aiAudit!.state).toBe('partial');expect(report.aiAudit!.validResponsePaths).toEqual(['a.py']);
  expect(report.aiAudit!.skipped.map(item=>item.path)).toEqual(['b.py','c.py']);
});
it('keeps later batch targets ahead of already-selected supporting dependencies',async()=>{
  await writeFile(join(root,'a.ts'),"import './b.js';\nexport const a=1;");
  await writeFile(join(root,'b.ts'),'export const b=2;');
  await writeFile(join(root,'z.ts'),"import './a.js';\nexport const z=3;");
  const report=await reviewWholeRepository(root,{execution:'mock',config:{ai:{maxFiles:2}}});
  expect(report.aiAudit!.selectedPaths).toEqual(['a.ts','b.ts','z.ts']);
  expect(report.aiAudit!.validResponsePaths).toEqual(['a.ts','b.ts','z.ts']);
  expect(report.aiAudit!.batches).toHaveLength(2);
  expect(report.aiAudit!.skipped).toEqual([]);
});
it('preview never claims valid AI responses and excludes sensitive content',async()=>{
  await writeFile(join(root,'a.py'),'value = 1');await writeFile(join(root,'secret.py'),'private_data = 2');
  const report=await reviewWholeRepository(root,{execution:'preview'});
  expect(report.aiAudit!.state).toBe('preview');expect(report.aiAudit!.validResponsePaths).toEqual([]);
  expect(report.aiAudit!.selectedPaths).toEqual(['a.py']);
  expect(fetch).not.toHaveBeenCalled();
});
it('blocks paid whole-repository batching and incompatible CLI scopes before any network access',async()=>{
  expect((await runCli(['audit',root,'--whole-repository','--ai','live','--trial'])).exitCode).toBe(2);
  expect((await runCli(['diff',root,'--whole-repository','--ai','preview'])).exitCode).toBe(2);
  expect((await runCli(['audit',root,'--whole-repository'])).exitCode).toBe(2);
  expect(fetch).not.toHaveBeenCalled();
});
it('shows the underlying batch error and actionable credential message on stderr',async()=>{
  vi.stubEnv('SHIPCHECK_API_KEY','');
  await writeFile(join(root,'a.py'),'value = 1');
  const result=await runCli(['audit',root,'--whole-repository','--ai','live','--budget','baseline','--json']);
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain('AI stage failed (missing-credentials) in batch 1');
  expect(result.stderr).toContain('Set SHIPCHECK_API_KEY in this process');
  expect(result.stderr).not.toContain('batch-failure');
  expect(JSON.parse(result.stdout).aiAudit.stoppedReason).toBe('missing-credentials');
  expect(fetch).not.toHaveBeenCalled();
});
it('places configurable review concerns in the prompt without claiming verification',()=>{
  const request=buildRequest({files:[],preview:{files:[],skipped:[],serializedBytes:2,limited:false}},aiSettingsSchema.parse({focus:['code-smells','race-conditions']}),'offline');
  expect(request.instructions).toContain('Review focus: code-smells, race-conditions');
  expect(request.instructions).toContain('concrete failing interleaving');
});
