import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {writeFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawn} from 'node:child_process';
import {requestCodexQa,codexEnvironment} from '../src/ai/codex.js';
import {currentTaskSchema} from '../src/task-file.js';
import {buildRequest} from '../src/ai/client.js';
import {aiSettingsSchema} from '../src/ai/contracts.js';
import {runCli} from '../src/cli-command.js';
import {reviewWithAi} from '../src/ai/review.js';
import {reviewWholeRepository} from '../src/ai/whole-repository.js';
import {renderConsoleReport} from '../src/reporters.js';
vi.mock('node:child_process',()=>({spawn:vi.fn(),execFile:vi.fn()}));
vi.mock('../src/check-process.js',()=>({terminateCheckTree:vi.fn(async()=>true)}));
const context={files:[{path:'a.ts',content:'const a = 1;'}],preview:{files:[{path:'a.ts',bytes:12,lines:1,sha256:'0'.repeat(64)}],skipped:[],serializedBytes:12,limited:false}};
const request=buildRequest(context,aiSettingsSchema.parse({}),'test-model');
let auth='Logged in using ChatGPT',response='{"candidates":[]}',exitCode=0,hang=false,root:string;
let calls:{args:string[];options:any;input:string}[];
beforeEach(async()=>{
  root=await mkdtemp(join(tmpdir(),'shipcheck-codex-test-'));
  auth='Logged in using ChatGPT';response='{"candidates":[]}';exitCode=0;hang=false;calls=[];
  vi.stubGlobal('fetch',vi.fn(()=>{throw Error('API must never be called');}));
  vi.mocked(spawn).mockImplementation(((_binary:string,args:string[],options:any)=>{
    const child=Object.assign(new EventEmitter(),{stdin:new PassThrough(),stdout:new PassThrough(),stderr:new PassThrough(),pid:123,kill:vi.fn()});
    const call={args,options,input:''};calls.push(call);
    child.stdin.on('data',chunk=>{call.input+=chunk.toString();});
    child.stdin.on('finish',()=>{void(async()=>{
      if(args.includes('login')){child.stderr.write(auth);child.emit('close',0);return;}
      if(hang)return;
      await writeFile(args[args.indexOf('--output-last-message')+1]!,response);
      child.emit('close',exitCode);
    })();});
    return child;
  }) as unknown as typeof spawn);
});
afterEach(async()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();vi.clearAllMocks();await rm(root,{recursive:true,force:true});});
it('uses subscription authentication, isolated read-only execution and structured output without API credentials',async()=>{
  vi.stubEnv('OPENAI_API_KEY','secret');vi.stubEnv('CODEX_API_KEY','secret');
  expect(await requestCodexQa(request,context,1000)).toEqual({candidates:[]});
  expect(calls).toHaveLength(2);
  expect(calls[1]!.args).toEqual(expect.arrayContaining(['--sandbox','read-only','forced_login_method="chatgpt"','--ignore-user-config','features.shell_tool=false','features.apps=false','--ephemeral']));
  expect(calls[1]!.options.shell).toBe(false);
  expect(calls[1]!.options.env.OPENAI_API_KEY).toBeUndefined();
  expect(calls[1]!.options.env.CODEX_API_KEY).toBeUndefined();
  expect(calls[1]!.input).toContain('const a = 1;');expect(fetch).not.toHaveBeenCalled();
});
it.each(['Logged in using an API key','Not logged in',''])('refuses non-subscription authentication (%s)',async value=>{
  auth=value;await expect(requestCodexQa(request,context,1000)).rejects.toMatchObject({code:'codex-auth'});
  expect(calls).toHaveLength(1);expect(fetch).not.toHaveBeenCalled();
});
it('retains only non-secret environment and Codex home for normal authentication',()=>{
  expect(codexEnvironment({CODEX_HOME:'home',PATH:'path',CODEX_ACCESS_TOKEN:'secret',OPENAI_BASE_URL:'bad',SHIPCHECK_API_KEY:'secret'})).toEqual({CODEX_HOME:'home',PATH:'path'});
});
it('fails without retries or API fallback when the subscription command fails',async()=>{
  exitCode=1;await expect(requestCodexQa(request,context,1000)).rejects.toMatchObject({code:'codex-failed'});
  expect(calls).toHaveLength(2);expect(fetch).not.toHaveBeenCalled();
});
it('rejects malformed structured output',async()=>{
  response='not json';await expect(requestCodexQa(request,context,1000)).rejects.toMatchObject({code:'invalid-output'});
});
it('bounds execution and stops rather than falling back',async()=>{
  hang=true;await expect(requestCodexQa(request,context,25)).rejects.toMatchObject({code:'codex-timeout'});
  expect(fetch).not.toHaveBeenCalled();
});
it('rejects shell launcher overrides',async()=>{
  vi.stubEnv('SHIPCHECK_CODEX_PATH','unsafe.cmd');
  await expect(requestCodexQa(request,context,1000)).rejects.toMatchObject({code:'codex-path'});expect(calls).toHaveLength(0);
});
it('rejects paid authorization on Codex CLI execution',async()=>{
  const result=await runCli(['audit',root,'--ai','codex','--budget','example','--json']);
  expect(result.exitCode).toBe(2);expect(calls).toHaveLength(0);
});
it('integrates Codex evidence, coverage and reporting without a key or ledger',async()=>{
  await writeFile(join(root,'a.ts'),'const a = 1;');
  response=JSON.stringify({candidates:[{title:'Example',severity:'warning',explanation:'Review example',suggestedAction:'Inspect',evidence:[{path:'a.ts',startLine:999,endLine:0,excerpt:'const a = 1;'}]}]});
  const report=await reviewWithAi(root,{execution:'codex'});
  expect(report.ai).toMatchObject({execution:'codex',status:'completed',actualCostUsd:0});
  expect(report.ai!.candidates[0]!.evidenceVerification!.status).toBe('matched');
  expect(report.ai!.budget).toBeUndefined();expect(report.ai!.trial).toBeUndefined();
  expect(renderConsoleReport(report)).toContain('Codex subscription review');expect(fetch).not.toHaveBeenCalled();
});
it('stops whole-repository batches at subscription failure and preserves deterministic results',async()=>{
  await writeFile(join(root,'a.ts'),'const a = 1;');await writeFile(join(root,'b.ts'),'const b = 2;');exitCode=1;
  const report=await reviewWholeRepository(root,{execution:'codex',config:{ai:{maxFiles:1}}});
  expect(report.aiAudit!.state).toBe('failed');expect(report.aiAudit!.batches).toHaveLength(1);
  expect(calls).toHaveLength(2);expect(fetch).not.toHaveBeenCalled();
});


it.each([
  String.raw`text.replace(/Life: \d+/g, '')`,
  String.raw`const path = "C:\\temp\\file";`,
  String.raw`const message = "say \"hello\"";`,
])('sends a single JSON context layer and preserves exact quotation: %s',async source=>{
  await writeFile(join(root,'a.ts'),source);
  response=JSON.stringify({candidates:[{title:'Example',severity:'warning',explanation:'Fixture',suggestedAction:'Inspect',
    evidence:[{path:'a.ts',startLine:1,endLine:1,excerpt:source}]}]});
  const report=await reviewWithAi(root,{execution:'codex'});
  const separator='Use only the supplied context. Do not use tools.\n';
  const payload=calls[1]!.input.split(separator)[1]!;
  const submitted=JSON.parse(payload);
  expect(submitted.sourceFiles[0].numberedLines[0].text).toBe(source);
  expect(Array.isArray(submitted)).toBe(false);
  expect(calls[1]!.input).toContain('Escape it exactly once');
  expect(report.ai?.candidates[0]?.evidence[0]?.excerpt).toBe(source);
  expect(report.ai?.candidates[0]?.evidenceVerification?.status).toBe('matched');
});
it.each([false,true])('preserves exact task quotation checks for doubled-backslash response: %s',async doubled=>{
  const source=String.raw`text.replace(/Life: \d+/g, '')`;
  const excerpt=doubled?String.raw`text.replace(/Life: \\d+/g, '')`:source;
  await writeFile(join(root,'a.ts'),source);
  const task=currentTaskSchema.parse({id:'regex',title:'Check tests',files:['a.ts'],requirements:[{id:'library-tests',text:'Strip life digits.'}]});
  response=JSON.stringify({candidates:[],taskAssessments:[{requirementId:'library-tests',status:'supporting-evidence',explanation:'Fixture',relatedRequirementIds:[],
    evidence:[{path:'a.ts',startLine:1,endLine:1,excerpt}]}]});
  const report=await reviewWithAi(root,{execution:'codex',task,reloadTask:async()=>task});
  const assessment=report.ai?.taskReview?.assessments[0];
  expect(assessment?.evidence[0]?.excerpt).toBe(excerpt);
  expect(assessment?.status).toBe(doubled?'insufficient-evidence':'supporting-evidence');
  expect(assessment?.evidenceVerification?.checks[0]?.reason).toBe(doubled?'excerpt-mismatch':'exact-quotation-match');
});
