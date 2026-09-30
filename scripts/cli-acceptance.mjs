import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname,join,resolve,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

// Real process-level checks, usable from the repository or the installed package.
// Only synthetic repositories are modified; no API calls or budget operations.
if(process.argv.length>3)throw Error('Usage: node scripts/cli-acceptance.mjs [path/to/cli.js]');
const cli=process.argv[2]?resolve(process.argv[2]):fileURLToPath(new URL('../dist/src/cli.js',import.meta.url));
await readFile(cli); // Fail clearly when build/install is missing.
const workspace=await mkdtemp(join(tmpdir(),'shipcheck-cli-acceptance-'));
const repo=join(workspace,'repository with spaces');
const results=[];
const env={...process.env};
for(const key of Object.keys(env))if(/KEY|TOKEN|SECRET|PASSWORD/i.test(key) || key.startsWith('GIT_'))delete env[key];
const networkMarker=join(workspace,'network-attempt');
const guard=join(workspace,'offline-guard.mjs');
await writeFile(guard,`import {writeFileSync} from 'node:fs';
import net from 'node:net'; import http from 'node:http'; import https from 'node:https';
import {syncBuiltinESMExports} from 'node:module';
const deny=()=>{writeFileSync(${JSON.stringify(networkMarker)},'attempt');throw Error('Network forbidden in CLI acceptance');};
globalThis.fetch=deny; net.Socket.prototype.connect=deny;
http.request=deny; http.get=deny; https.request=deny; https.get=deny; syncBuiltinESMExports();
`);
env.NODE_OPTIONS=`--import=${pathToFileURL(guard).href}`;
// Isolate Git configuration/hooks; no changes to the developer's repository or identity.
env.GIT_CONFIG_NOSYSTEM='1';env.GIT_CONFIG_GLOBAL=join(workspace,'empty-gitconfig');
await writeFile(env.GIT_CONFIG_GLOBAL,'');
async function write(path,content){const target=join(repo,path);await mkdir(dirname(target),{recursive:true});await writeFile(target,content);}
const configure=value=>write('shipcheck.config.json',JSON.stringify(value));
function command(args,expected=0,cwd=repo) {
  const output=spawnSync(process.execPath,[cli,...args],{cwd,env,encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024,windowsHide:true});
  assert.ifError(output.error);
  assert.equal(output.status,expected,`CLI ${args.join(' ')}\n${output.stderr}\n${output.stdout}`);
  return output;
}
const json=(args,expected=0)=>JSON.parse(command([...args,'--json'],expected).stdout);
async function check(name,fn){await fn();results.push(name);console.log(`PASS ${name}`);}
async function snapshot(directory=repo,prefix='') {
  const state={};
  for(const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
    if(entry.name==='.git')continue;
    const path=join(directory,entry.name),key=prefix+entry.name;
    if(entry.isDirectory())Object.assign(state,await snapshot(path,key+'/'));
    else {assert.ok(entry.isFile(),'Unexpected special entry in synthetic repository');state[key]=createHash('sha256').update(await readFile(path)).digest('hex');}
  }
  return state;
}
function git(args) {
  const output=spawnSync('git',['-c','core.hooksPath='+join(workspace,'no-hooks'),'-c','commit.gpgsign=false',...args],{cwd:repo,env,encoding:'utf8',timeout:10000,windowsHide:true});
  assert.ifError(output.error);assert.equal(output.status,0,output.stderr);return output.stdout;
}
try {
  await write('src/main.ts','export const value = 1;\n');
  await write('README.md','# Synthetic CLI acceptance repository\n');
  await write('test/main.test.ts','// fixture only; never executed\n');
  await write('package.json',JSON.stringify({scripts:{test:'node forbidden-execution.js'}}));
  await write('forbidden-execution.js',"throw Error('Repository scripts must not execute');");
  await configure({});
  await check('help/version and paths with spaces',()=>{
    assert.match(command(['help']).stdout,/Usage: shipcheck/);
    assert.match(command(['--version']).stdout,/Shipcheck/);
    assert.match(command([]).stdout,/Shipcheck/);
    assert.equal(json(['audit',repo]).workflow.kind,'audit');
  });
  await check('invalid command/options fail with exit 2',()=>{
    assert.match(command(['review'],2).stderr,/audit/);
    command(['audit','--json','--markdown'],2);command(['audit','--unknown'],2);
    command(['audit',join(workspace,'missing')],2);
  });
  await check('offline audit preserves every target file',async()=>{
    const before=await snapshot();const report=json(['audit',repo]);
    assert.equal(report.schemaVersion,1);assert.equal(report.findings.length,0);assert.equal(report.ai,undefined);
    assert.deepEqual(await snapshot(),before);
  });
  await check('manifest error and config override control exit 1',async()=>{
    await write('package.json','{');assert.equal(json(['audit',repo],1).findings[0].ruleId,'package/invalid-json');
    await configure({rules:{'package/invalid-json':'off'}});assert.equal(json(['audit',repo]).findings.length,0);
    await write('package.json','{}');await configure({unknown:true});command(['audit',repo],2);await configure({});
  });
  await check('console and Markdown output include actual findings',async()=>{
    await write('package.json','[]');assert.match(command(['audit',repo],1).stdout,/package\/invalid-object/);
    assert.match(command(['audit',repo,'--markdown'],1).stdout,/package\/invalid-object/);await write('package.json','{}');
  });
  await check('preview and three mock modes are offline and synthetic',()=>{
    assert.equal(json(['audit',repo,'--ai','preview']).ai.status,'preview');
    for(const mode of ['low-cost','balanced','high-quality']){
      const ai=json(['audit',repo,'--ai','mock','--mode',mode]).ai;
      assert.equal(ai.mode,mode);assert.equal(ai.execution,'mock');assert.equal(ai.actualCostUsd,0);
      assert.ok(ai.candidates.length>0);assert.equal(ai.candidates[0].evidenceVerification.status,'matched');
    }
    command(['audit',repo,'--ai','live'],2); // No allowance: rejected before any request.
  });
  await check('whole-repository preview/mock expose bounded coverage',async()=>{
    await configure({ai:{maxFiles:1,maxBatches:1}});
    const preview=json(['audit',repo,'--whole-repository','--ai','preview']).aiAudit;assert.equal(preview.state,'preview');assert.equal(preview.batches.length,1);
    const mock=json(['audit',repo,'--whole-repository','--ai','mock']).aiAudit;assert.equal(mock.state,'partial');assert.ok(mock.skipped.length>0);await configure({});
  });
  await check('reference inclusion and missing-required-resource failure',async()=>{
    await write('spec.md','The value must equal one.');await configure({resources:[{id:'spec',path:'spec.md'}]});
    assert.equal(json(['audit',repo,'--ai','mock']).ai.preview.references[0].status,'included');
    await configure({resources:[{id:'spec',path:'absent.md'}]});const report=json(['audit',repo,'--ai','mock'],2);
    assert.equal(report.references.state,'incomplete');assert.equal(report.ai,undefined);await configure({});
  });
  await check('inline and explicit task workflows preserve requirements',async()=>{
    await configure({currentTask:{id:'value',title:'Value task',files:['src/main.ts'],requirements:[{id:'one',text:'Export the value one.'}]}});
    const before=await snapshot();const report=json(['task','--ai','mock']);assert.equal(report.currentTask.source,'configuration');
    assert.equal(report.ai.taskReview.assessments[0].status,'insufficient-evidence');assert.deepEqual(await snapshot(),before);
    await write('task.json',JSON.stringify({version:1,repository:'.',files:['src/main.ts'],criteria:['Export the value one.']}));
    assert.equal(json(['task',join(repo,'task.json')]).currentTask.source,'task-file');await configure({});
  });
  await check('external checks require authorization and normalize diagnostics',async()=>{
    const check={id:'lint',command:process.execPath,args:['-e','console.log(JSON.stringify([{filePath:"src/main.ts",messages:[{ruleId:"fixture",severity:2,message:"Seeded error",line:1,column:1}]}]))'],format:'eslint-json'};
    await configure({checks:[check]});assert.equal(json(['audit',repo]).checks[0].status,'skipped');
    const before=await snapshot();const report=json(['audit',repo,'--run-checks'],1);assert.equal(report.checks[0].diagnostics[0].ruleId,'fixture');assert.deepEqual(await snapshot(),before);
    await configure({checks:[{...check,args:['-e','console.log("not-json")']}]});assert.equal(json(['audit',repo,'--run-checks'],2).checks[0].status,'error');await configure({});
  });
  const contract={openapi:'3.1.0',info:{title:'Fixture',version:'1.0'},paths:{'/users':{get:{}}}};
  const contractConfig={resources:[{id:'api',kind:'openapi',path:'api.json'}],contracts:[{id:'client',resourceId:'api',baseUrl:'https://example.test',files:['client.ts']}]};
  await check('contract mismatch, clean call, and dynamic call have distinct exits',async()=>{
    await write('api.json',JSON.stringify(contract));await configure(contractConfig);
    await write('client.ts','fetch("https://example.test/missing");');assert.equal(json(['audit',repo],1).contracts[0].calls[0].status,'mismatch');
    await write('client.ts','fetch("https://example.test/users");');assert.equal(json(['audit',repo]).contracts[0].calls[0].status,'matched');
    await write('client.ts','fetch(url);');assert.equal(json(['audit',repo],2).contracts[0].state,'partial');await configure({});
  });
  await check('multilingual HTTP adapters work through the executable',async()=>{
    const sources={
      'clients/a.js':'fetch("https://example.test/users");',
      'clients/a.ts':'fetch("https://example.test/users");',
      'clients/a.py':'import requests\nrequests.get("https://example.test/users")',
      'clients/a.go':'package clients\nimport "net/http"\nfunc call() { http.Get("https://example.test/users") }',
      'clients/A.cs':'using System.Net.Http; class A { void Run() { new HttpClient().GetAsync("https://example.test/users"); } }',
      'clients/A.java':'import java.net.URI; import java.net.http.HttpRequest; class A { void run() { HttpRequest.newBuilder(URI.create("https://example.test/users")).GET().build(); } }'
    };
    for(const [path,source] of Object.entries(sources))await write(path,source);
    await configure({...contractConfig,contracts:[{...contractConfig.contracts[0],files:Object.keys(sources)}]});
    const report=json(['audit',repo]).contracts[0];assert.equal(report.calls.length,6);assert.ok(report.calls.every(c=>c.status==='matched'));await configure({});
  });
  const architecture={files:['core/**'],boundaries:[{id:'layers',from:'core',to:'ui',reason:'Core cannot import UI.'}]};
  await check('architecture violation, clean and unresolved imports have distinct exits',async()=>{
    await write('ui/view.ts','export const view = 1;');await write('core/order.ts','import "../ui/view.js";');await configure({architecture});
    assert.equal(json(['audit',repo],1).architecture.boundaries[0].status,'violation');
    await write('core/order.ts','import "node:fs";');assert.equal(json(['audit',repo]).architecture.boundaries[0].status,'no-observed-violation');
    await write('core/order.ts','import(name);');assert.equal(json(['audit',repo],2).architecture.state,'partial');
    await write('core/order.ts','export const order = 1;');await configure({});
  });
  await check('Java Unicode preprocessing preserves forbidden imports and raw evidence',async()=>{
    await write('ui/Foo.java','package ui; class Foo {}');
    await configure({architecture:{files:['core/*.java'],aliases:[{prefix:'ui.',target:'ui'}],boundaries:[{id:'layer',from:'core',to:'ui',reason:'Keep layers separate.'}]}});
    for(const escape of ['\\u000a','\\uu000d']) {
      await write('core/Main.java','package core;\n// '+escape+' \\u0069mport ui.Foo;\nclass Main {}');
      const report=json(['audit',repo],1);
      assert.equal(report.architecture.boundaries[0].status,'violation');
      assert.equal(report.architecture.dependencies[0].excerpt,'\\u0069mport ui.Foo;');
      assert.equal(report.architecture.dependencies[0].line,2);
    }
    await write('core/Main.java','// \\u00xx\nclass Main {}');
    assert.equal(json(['audit',repo],2).architecture.state,'partial');
    await write('core/Main.java','class Main {}');await configure({});
  });
  await check('filename conventions work independently of language parsing',async()=>{
    await write('core/BadName.rs','fn main() {}');await configure({architecture:{files:['core/*.rs'],conventions:[{id:'names',within:'core',style:'snake_case',reason:'Use snake case.'}]}});
    assert.deepEqual(json(['audit',repo],1).architecture.conventions[0].evidence,['core/BadName.rs']);await configure({});
  });
  await check('diff includes staged, unstaged, untracked and deleted paths',async()=>{
    git(['init','--quiet']);git(['add','.']);git(['-c','user.name=Shipcheck Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Synthetic baseline']);
    await write('shipcheck.config.json','{');git(['add','shipcheck.config.json']);git(['-c','user.name=Shipcheck Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Invalid config baseline']);
    assert.deepEqual(json(['diff',repo,'--ai','mock']).workflow.scope,[]); // Empty diff skips config/AI.
    await configure({});await write('staged.ts','export const staged=1;');git(['add','staged.ts']);await write('new file.ts','export const untracked=1;');await rm(join(repo,'src/main.ts'));
    const report=json(['diff',repo]);assert.ok(report.workflow.scope.includes('staged.ts'));assert.ok(report.workflow.scope.includes('new file.ts'));assert.ok(report.workflow.unavailablePaths.includes('src/main.ts'));
    command(['diff',join(repo,'core')],2);
  });
  await check('shipped examples retain their documented outcomes',()=>{
    const fixtures=fileURLToPath(new URL('../fixtures/',import.meta.url));
    assert.equal(json(['audit',join(fixtures,'demo')]).findings.length,2);
    for(const [name,count] of [['contracts',3],['contracts-expanded',8]]) {
      const report=json(['audit',join(fixtures,name)]).contracts[0];
      assert.equal(report.state,'checked');assert.equal(report.calls.length,count);assert.ok(report.calls.every(call=>call.status==='matched'));
    }
    assert.equal(json(['audit',join(fixtures,'architecture')],1).architecture.boundaries[0].status,'violation');
  });
  await check('cross-repository HTTP and SDK checks require explicit grants',()=>{
    const fixtures=fileURLToPath(new URL('../fixtures/integrations/',import.meta.url));
    const target=join(fixtures,'consumer');
    const denied=json(['audit',target],2);assert.equal(denied.references.resources[0].status,'access-denied');
    const allowed=json(['audit',target,'--reference-root','provider='+join(fixtures,'provider')]);
    assert.equal(allowed.contracts[0].calls[0].status,'matched');assert.equal(allowed.sdkContracts[0].calls[0].status,'matched');
    assert.equal(allowed.references.resources[0].origin.rootId,'provider');
  });
  await check('installed SDK declarations check types, versions and incomplete calls',async()=>{
    await write('node_modules/example-sdk/package.json',JSON.stringify({name:'example-sdk',version:'1.2.3',types:'index.d.ts'}));
    await write('node_modules/example-sdk/index.d.ts','export declare function getUser(id: string): string;');
    await write('node_modules/example-sdk/index.js','throw Error("Do not execute SDK code");');
    const sdk={id:'sdk',package:'example-sdk',files:['sdk-client.ts'],versionRange:'^1.0.0'};
    await configure({sdkContracts:[sdk]});await write('sdk-client.ts','import {getUser} from "example-sdk";getUser("x");');
    assert.equal(json(['audit',repo]).sdkContracts[0].calls[0].status,'matched');
    await write('sdk-client.ts','import {getUser} from "example-sdk";getUser(1);');assert.equal(json(['audit',repo],1).sdkContracts[0].calls[0].status,'mismatch');
    await write('sdk-client.ts','import {getUser} from "example-sdk";getUser(value);');assert.equal(json(['audit',repo],2).sdkContracts[0].state,'partial');
    await configure({sdkContracts:[{...sdk,versionRange:'^2'}]});assert.equal(json(['audit',repo],2).sdkContracts[0].state,'version-mismatch');await configure({});
  });
  await check('HTTPS configuration cannot authorize network access by itself',async()=>{
    await configure({resources:[{id:'remote',path:'spec.md',url:'https://docs.example.test/spec.md',expectedSha256:'0'.repeat(64)}]});
    assert.equal(json(['audit',repo],2).references.resources[0].status,'access-denied');
    command(['audit',repo,'--allow-reference-origin','https://docs.example.test/path'],2);
    await configure({resources:[{id:'remote',path:'spec.md',url:'https://docs.example.test/spec.md'}]});command(['audit',repo],2);await configure({});
  });
  await check('agent capture preserves clean, defect and incomplete reports; rejects missing reports',async()=>{
    const example=fileURLToPath(new URL('../examples/capture-audit.mjs',import.meta.url));
    const capture=expected=>{
      const result=spawnSync(process.execPath,[example,repo],{env,encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024,windowsHide:true});
      assert.equal(result.error,undefined);assert.equal(result.signal,null);assert.equal(result.status,expected,result.stderr);
      return result;
    };
    await write('package.json','{}');await configure({});
    const before=await snapshot();
    let output=capture(0);assert.equal(JSON.parse(output.stdout).cliExitCode,0);assert.deepEqual(await snapshot(),before);
    await write('package.json','{"scripts":[]}');
    output=capture(1);assert.equal(JSON.parse(output.stdout).report.findings[0].ruleId,'package/invalid-scripts');
    await write('package.json','{}');
    await configure({resources:[{id:'missing',path:'missing-spec.md'}]});
    output=capture(2);assert.equal(JSON.parse(output.stdout).report.references.state,'incomplete');assert.ok(output.stderr.includes('Required reference'));
    await write('shipcheck.config.json','{');output=capture(2);assert.equal(output.stdout,'');assert.ok(output.stderr.includes('Capture failed'));
    await configure({});
  });
  await check('user guide configuration supports inline task and preview commands',async()=>{
    const guide=await readFile(new URL('../docs/USER_GUIDE.md',import.meta.url),'utf8');
    const example=JSON.parse(guide.match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
    await write('src/client.ts','export function getUser() { return {kind: "not-found"}; }');
    await configure(example);
    const task=json(['task']);assert.equal(task.currentTask.id,'client-errors');assert.equal(task.currentTask.assessment,'not-assessed');
    const preview=json(['task','--ai','preview']);assert.equal(preview.ai.status,'preview');assert.equal(preview.ai.preview.task.id,'client-errors');
    await configure({});
  });
  await check('no network attempts occurred',async()=>{await assert.rejects(readFile(networkMarker),{code:'ENOENT'});});
  console.log(`\n${results.length} CLI acceptance groups passed; zero API spend. Synthetic target files verified unchanged during read-only checks.`);
} finally {
  // Only remove the freshly created temporary workspace, never the selected CLI/project.
  const child=relative(resolve(tmpdir()),workspace);
  assert.ok(child && child!=='..' && !child.startsWith('..'+sep) && !child.includes(sep));
  assert.ok(child.startsWith('shipcheck-cli-acceptance-'));
  await rm(workspace,{recursive:true,force:true});
}
