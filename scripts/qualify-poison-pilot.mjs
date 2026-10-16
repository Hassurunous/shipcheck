// Development-only qualification for the frozen Commander Tracker poison pilot.
// No source edits to the baseline, live AI, dependency downloads or cleanup.
import assert from 'node:assert/strict';
import {cp, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {resolve, join, relative, basename} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {fileURLToPath} from 'node:url';

const [baselineArg, outputArg, protocolArg, ...extra] = process.argv.slice(2);
if (!baselineArg || !outputArg || !protocolArg || extra.length)
  throw Error('Usage: node scripts/qualify-poison-pilot.mjs <completed-baseline> <new-output-directory> <frozen-protocol.json>');
const baseline = resolve(baselineArg), output = resolve(outputArg);
const inside = (parent, child) => {const path=relative(parent,child);return !path || (!path.startsWith('..') && !path.includes(':'));};
assert.ok(!inside(baseline,output) && !inside(output,baseline),'Baseline and output must be disjoint');
const workspace = join(output,'workspace');
const cli = fileURLToPath(new URL('../dist/src/cli.js',import.meta.url));
const compiled = fileURLToPath(new URL('../dist/src/',import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const skip = new Set(['.git','node_modules','dist']);
async function snapshot(root, exclusions=skip) {
  const files={};
  async function visit(dir) {
    for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
      if(exclusions.has(entry.name))continue;
      assert.ok(!entry.isSymbolicLink(),'Source snapshot must not traverse links');
      const path=join(dir,entry.name);
      if(entry.isDirectory())await visit(path);
      else {assert.ok(entry.isFile());files[relative(root,path).replaceAll('\\','/')]=hash(await readFile(path));}
    }
  }
  await visit(root);return files;
}
const baselineFiles=await snapshot(baseline), shipcheckFiles=await snapshot(compiled,new Set());
const protocolBytes=await readFile(protocolArg);
const protocol=JSON.parse(protocolBytes.toString('utf8').replace(/^\uFEFF/,''));
const source=await readFile(join(baseline,'src/poison.ts'),'utf8');
function replaceOnce(from,to) {assert.equal(source.split(from).length,2,'Mutation anchor must occur exactly once: '+from);return source.replace(from,to);}
const variants=[
  {id:'baseline',kind:'control',source},
  {id:'no-floor',kind:'defect',source:replaceOnce('Math.max(0, player.poison + delta)','player.poison + delta')},
  {id:'wrong-player',kind:'defect',source:replaceOnce('playerIndex === index','playerIndex === (index + 1) % players.length')},
  {id:'no-decrement',kind:'defect',source:replaceOnce('player.poison + delta','player.poison + Math.max(0, delta)')},
  {id:'comment-control',kind:'control',source:'// Poison changes preserve all other player fields.\n'+source},
  {id:'equivalent-floor',kind:'control',source:replaceOnce('Math.max(0, player.poison + delta)','Math.max(player.poison + delta, 0)')},
];
assert.deepEqual(protocol.cases.map(({id,kind})=>({id,kind})),variants.map(({id,kind})=>({id,kind})));
const ts=createRequire(join(baseline,'package.json'))('typescript');
function oracle(text) {
  const js=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const exports={};runInNewContext(js,{exports},{timeout:1000});assert.equal(typeof exports.updatePoison,'function');
  const failures=[];let cases=0;
  for(const first of [0,1,3])for(const second of [0,2])for(const index of [0,1])for(const delta of [-1,1]) {
    const players=Object.freeze([Object.freeze({name:'A',life:-2,poison:first}),Object.freeze({name:'B',life:40,poison:second})]);
    const expected=JSON.parse(JSON.stringify(players));
    expected[index].poison=delta===1?expected[index].poison+1:expected[index].poison===0?0:expected[index].poison-1;
    cases++;
    try {assert.deepEqual(JSON.parse(JSON.stringify(exports.updatePoison(players,index,delta))),expected);}
    catch {failures.push({poison:[first,second],index,delta});}
  }
  return {cases,failures};
}
const oracles=variants.map(v=>({id:v.id,...oracle(v.source)}));
for(const [i,v] of variants.entries())assert.equal(oracles[i].failures.length>0,v.kind==='defect','Independent oracle contradicts '+v.id);
await mkdir(output); // Fail rather than overwrite evidence from a previous run.
await writeFile(join(output,'protocol.json'),protocolBytes,{flag:'wx'});
await writeFile(join(output,'frozen.json'),JSON.stringify({baseline,baselineFiles,shipcheckFiles,protocolSha256:hash(protocolBytes),runnerSha256:hash(await readFile(fileURLToPath(import.meta.url))),node:process.version,typescript:ts.version,platform:process.platform,variants:variants.map(v=>({id:v.id,kind:v.kind,sha256:hash(v.source)})),oracles,apiSpendUsd:0},null,2),{flag:'wx'});
await cp(baseline,join(output,'baseline-source'),{recursive:true,filter:path=>!skip.has(basename(path))});
await cp(join(output,'baseline-source'),workspace,{recursive:true});
console.log('Frozen baseline, six variants and independent oracle; copying installed dependencies once.');
await cp(join(baseline,'node_modules'),join(workspace,'node_modules'),{recursive:true});
const env={...process.env};for(const name of Object.keys(env))if(/KEY|TOKEN|SECRET|PASSWORD/i.test(name))delete env[name];
const results=[];
for(const v of variants) {
  await writeFile(join(workspace,'src/poison.ts'),v.source);
  const before=await snapshot(workspace);
  assert.deepEqual(before,{...baselineFiles,'src/poison.ts':hash(v.source)},'Unexpected source/test/config change');
  const folder=join(output,v.id);await mkdir(folder);
  await writeFile(join(folder,'poison.ts'),v.source,{flag:'wx'});
  const started=performance.now();
  const args=[cli,'audit',workspace,'--run-checks','--json'];
  const run=spawnSync(process.execPath,args,{env,encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024,windowsHide:true,shell:false});
  const stdout=run.stdout??'',stderr=run.stderr??'';
  await writeFile(join(folder,'report.json'),stdout,{flag:'wx'});
  await writeFile(join(folder,'stderr.txt'),stderr,{flag:'wx'});
  const capture={command:process.execPath,args,exitCode:run.status,signal:run.signal,error:run.error?.message??null,elapsedMs:Math.round(performance.now()-started),reportSha256:hash(stdout),sourceSha256:hash(JSON.stringify(before))};
  await writeFile(join(folder,'capture.json'),JSON.stringify(capture,null,2),{flag:'wx'});
  assert.deepEqual(await snapshot(workspace),before,'Audit changed source/config/tests');
  assert.deepEqual(await snapshot(baseline),baselineFiles,'Baseline changed during pilot');
  assert.deepEqual(await snapshot(compiled,new Set()),shipcheckFiles,'Shipcheck changed during pilot');
  let report=null;try{report=JSON.parse(stdout);}catch{/* Preserve operational failure rather than calling it a miss. */}
  const checks=report?.checks?.map(({id,status,exitCode})=>({id,status,exitCode}))??[];
  const behavior=checks.find(c=>c.id==='behavior');
  const unresolved=Boolean(run.error || run.signal || !report || run.status===2 || !behavior || checks.some(c=>!['passed','failed'].includes(c.status)));
  const row={id:v.id,kind:v.kind,exitCode:run.status,checks,findings:report?.findings?.length??null,inspectionWarnings:report?.inspectionWarnings?.length??null,outcome:report?.auditSummary?.outcome??null,classification:unresolved?'unresolved':v.kind==='defect'?(behavior.status==='failed'?'behavioral-failure-needs-review':'missed'):(checks.every(c=>c.status==='passed')&&!report.findings.length?'control-clear':'control-needs-review')};
  results.push(row);console.log(JSON.stringify(row));
  await writeFile(join(output,'results.json'),JSON.stringify({results,apiSpendUsd:0,scope:'Non-blind six-variant offline pilot; failure classifications require report review'},null,2));
}
await writeFile(join(workspace,'src/poison.ts'),source);
assert.deepEqual(await snapshot(workspace),baselineFiles);
console.log('Pilot finished; disposable workspace restored to baseline. No test or rule changes.');
