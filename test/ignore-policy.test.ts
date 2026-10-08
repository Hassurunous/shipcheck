import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import fs from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {inspectRepository} from '../src/inspect-repository.js';
import {reviewRepository} from '../src/review-repository.js';
import {configSchema} from '../src/config.js';
import {createIgnorePolicy} from '../src/ignore-policy.js';
import {collectContext} from '../src/ai/context.js';
import {aiSettingsSchema} from '../src/ai/contracts.js';
import {loadReferenceResources} from '../src/reference-resources.js';
import {changedPaths,runWorkflow} from '../src/workflows.js';
import {runCli} from '../src/cli-command.js';
let root:string;
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-ignore-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));});
afterEach(async()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();await fs.rm(root,{recursive:true,force:true});});
async function write(path:string,content:string|Buffer='export const value=1;'){await fs.mkdir(dirname(join(root,path)),{recursive:true});await fs.writeFile(join(root,path),content);}
function git(...args:string[]) {
  const result=spawnSync('git',['-c','core.ignorecase=false','-C',root,...args],{encoding:'utf8',windowsHide:true});
  if(result.error)throw result.error;return result;
}
it('defaults to Git ignores only when exclusions are absent, and survives config reparsing',()=>{
  for(const [input,expected] of [[{},true],[{ai:{mode:'balanced'}},true],[{exclude:[]},false],[{exclude:['build']},false],[{exclude:['build'],respectGitignore:true},true],[{respectGitignore:false},false]] as const) {
    const config=configSchema.parse(input);expect(config.respectGitignore).toBe(expected);expect(configSchema.parse(config)).toEqual(config);
  }
});
it('matches Git on nested rules, negations, anchored names, classes and ignored parents',async()=>{
  expect(git('init','--quiet').status).toBe(0);
  await write('.gitignore','# comment\n*.log\n/root.ts\ncache/\n*.generated.ts\nlocked/\n!locked/keep.ts\nitem[0-9].ts\n**/temp/**\n');
  await write('src/.gitignore','!keep.log\n/local.ts\n');
  const paths=['debug.log','src/debug.log','src/keep.log','root.ts','src/root.ts','src/local.ts','src/deep/local.ts','cache/file.ts','locked/keep.ts','src/a.generated.ts','item1.ts','itema.ts','src/temp/a.ts','good.ts'];
  for(const path of paths)await write(path);
  const policy=createIgnorePolicy(root);
  for(const path of paths){const result=git('check-ignore','--no-index','--',path);expect([0,1]).toContain(result.status);expect(!!await policy.reason(path),path).toBe(result.status===0);}
  const profile=await inspectRepository(root);
  expect(profile.files.map(f=>f.path)).toContain('src/keep.log');
  expect(profile.ignorePolicy?.sources.map(s=>s.path)).toEqual(['.gitignore','src/.gitignore']);
});
it('supports escaped hashes/exclamation marks, spaces, CRLF, BOM and directory-only patterns',async()=>{
  await write('.gitignore','\uFEFF\\#file.ts\r\n\\!file.ts\r\ntrailing\\ \r\nfolder/\r\nignored.ts   \r\n');
  for(const path of ['#file.ts','!file.ts','folder/a.ts','nested/folder','ignored.ts','visible.ts'])await write(path);
  const paths=(await inspectRepository(root)).files.map(f=>f.path);
  expect(await createIgnorePolicy(root).reason('trailing ')).toBeDefined();
  expect(await createIgnorePolicy(root).reason('trailing')).toBeUndefined();
  expect(paths).toContain('nested/folder');expect(paths).toContain('visible.ts');
  for(const p of ['#file.ts','!file.ts','trailing ','folder/a.ts','ignored.ts'])expect(paths).not.toContain(p);
});
it('prunes ignored trees before reading their files or nested ignore files, and reports provenance',async()=>{
  await write('.gitignore','generated/\n');await write('generated/.gitignore',Buffer.from([255]));await write('generated/bad.json',Buffer.from([0]));await write('node_modules/a/index.js');await write('.git/HEAD');
  const read=vi.spyOn(fs,'open');const profile=await inspectRepository(root);
  expect(profile.warnings).toEqual([]);expect(read.mock.calls.some(([p])=>String(p).includes('generated'))).toBe(false);
  expect(profile.ignorePolicy?.skipped).toContainEqual({path:'generated',kind:'directory',reason:'gitignore',source:'.gitignore',pattern:'generated/'});
  expect(profile.ignorePolicy?.skippedCount).toBe(3);
});
it('lets explicit excludes replace or combine with Git rules without disabling built-in exclusions',async()=>{
  await write('.gitignore','hidden.ts\n');await write('hidden.ts');await write('extra.ts');await write('node_modules/a.ts');
  for(const [config,hidden,extra] of [[{exclude:[]},true,true],[{exclude:['extra.ts']},true,false],[{exclude:['extra.ts'],respectGitignore:true},false,false]] as const){
    const profile=await inspectRepository(root,{...config,exclude:[...config.exclude]});const paths=profile.files.map(f=>f.path);
    expect(paths.includes('hidden.ts')).toBe(hidden);expect(paths.includes('extra.ts')).toBe(extra);expect(paths).not.toContain('node_modules/a.ts');
  }
});
it('fails closed on oversized or invalid ignore files, but does not apply them when disabled',async()=>{
  for(const data of [Buffer.alloc(65537,35),Buffer.from([255]),Buffer.from([0])]){
    await write('.gitignore',data);await write('visible.ts');
    expect((await runCli(['audit',root,'--json'])).exitCode).toBe(2);
    expect((await inspectRepository(root,{exclude:[]})).files.map(f=>f.path)).toContain('visible.ts');
  }
});
it('rejects linked ignore files',async()=>{
  await fs.mkdir(join(root,'rules'));await fs.symlink(join(root,'rules'),join(root,'.gitignore'),'junction');
  await expect(inspectRepository(root)).rejects.toThrow('Cannot apply .gitignore');
});
it('does not report ignored missing script targets as defects',async()=>{
  await write('.gitignore','generated/\nmissing.js\n');await write('package.json',JSON.stringify({scripts:{start:'node generated/main.js',other:'node missing.js'}}));
  expect((await reviewRepository(root)).findings).toEqual([]);
});
it('honors ignore policy during AI rereads and local reference loading',async()=>{
  await write('main.ts');await write('intent.md','Expected behavior.');const profile=await inspectRepository(root);
  await write('.gitignore','main.ts\nintent.md\n');
  const context=await collectContext(profile,aiSettingsSchema.parse({}),['main.ts']);expect(context.files).toEqual([]);expect(context.preview.skipped[0]?.reason).toBe('excluded');
  const refs=await loadReferenceResources(root,{resources:[{id:'intent',path:'intent.md'}]});expect(refs.report.resources[0]?.status).toBe('excluded');
});
it('reports bounded skip samples and consistent policy in JSON and console',async()=>{
  await write('.gitignore','*.tmp\n');for(let i=0;i<205;i++)await write(i+'.tmp');
  const result=await runCli(['audit',root,'--json']);const report=JSON.parse(result.stdout);
  expect(report.ignorePolicy).toMatchObject({mode:'gitignore',skippedCount:205,skippedTruncated:true});expect(report.ignorePolicy.skipped).toHaveLength(200);
  expect((await runCli(['audit',root])).stdout).toContain('Ignore policy: gitignore');
});
it('ignores global/info/ancestor ignore rules in audit and diff, including opt-out untracked files',async()=>{
  const outer=root;root=join(outer,'repo');await fs.mkdir(root);
  try {
    const global=join(outer,'global-ignore');await fs.writeFile(global,'global.ts\n');await fs.writeFile(join(outer,'.gitignore'),'ancestor.ts\n');
    const globalConfig=join(outer,'gitconfig');await fs.writeFile(globalConfig,'[core]\n excludesFile = '+global.replace(/\\/g,'/')+'\n');
    vi.stubEnv('GIT_CONFIG_GLOBAL',globalConfig);vi.stubEnv('GIT_CONFIG_NOSYSTEM','1');
    expect(git('init','--quiet').status).toBe(0);await write('baseline.ts');expect(git('add','baseline.ts').status).toBe(0);
    expect(git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','--quiet','-m','fixture').status).toBe(0);
    await write('.git/info/exclude','info.ts\n');await write('.gitignore','local.ts\n');
    for(const p of ['global.ts','info.ts','ancestor.ts','local.ts'])await write(p);
    const profile=await inspectRepository(root);const paths=profile.files.map(f=>f.path);
    for(const p of ['global.ts','info.ts','ancestor.ts'])expect(paths).toContain(p);
    expect(paths).not.toContain('local.ts');
    const diff=await changedPaths(root);for(const p of ['global.ts','info.ts','ancestor.ts'])expect(diff).toContain(p);expect(diff).not.toContain('local.ts');
    expect(await changedPaths(root,{exclude:[]})).toContain('local.ts');
    const report=await runWorkflow(root,'diff',undefined);expect(report.ignorePolicy?.respectGitignore).toBe(true);
  } finally {root=outer;}
});
it('limits total ignore-file bytes',async()=>{
  for(let i=0;i<17;i++){await write('d'+i+'/.gitignore','#'.repeat(65536));await write('d'+i+'/a.ts');}
  await expect(inspectRepository(root)).rejects.toThrow('Ignore policy exceeds read limits');
});
it('ignores local referenced source in task, contract and architecture assessments',async()=>{
  await write('.gitignore','hidden.ts\n');await write('hidden.ts','fetch("https://api.test/missing");');
  await write('api.json',JSON.stringify({openapi:'3.0.0',info:{title:'API',version:'1'},paths:{'/ok':{get:{}}}}));
  const config={currentTask:{id:'task',title:'Check behavior',files:['hidden.ts'],requirements:[{id:'R1',text:'Use the API correctly.'}]},
    resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[{id:'api',resourceId:'api',baseUrl:'https://api.test',files:['hidden.ts']}],
    architecture:{files:['hidden.ts'],boundaries:[{id:'layer',from:'src',to:'ui',reason:'Separate layers.'}]}};
  await write('shipcheck.config.json',JSON.stringify(config));
  const report=await runWorkflow(root,'task',{execution:'preview'},{currentTask:true});
  expect(report.contracts?.[0]?.files[0]?.status).toBe('excluded');
  expect(report.ai?.preview.files).toEqual([]);expect(report.architecture?.files[0]?.status).toBe('excluded');
  expect(report.ignorePolicy?.skipped.some(p=>p.path==='hidden.ts')).toBe(true);
});
