import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,cp,rm,readdir} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
// Supply existing installations. No downloads, package installation or paid calls.
const [modulesArg,ruffArg]=process.argv.slice(2);
if(!modulesArg || !ruffArg || process.argv.length!==4)throw Error('Usage: node scripts/qualify-quality.mjs <node_modules containing ESLint> <Ruff executable>');
const cli=fileURLToPath(new URL('../dist/src/cli.js',import.meta.url));
const root=await mkdtemp(join(tmpdir(),'shipcheck-quality-real-'));
const originalRoot=resolve(root);
const env={...process.env};for(const key of Object.keys(env))if(/KEY|TOKEN|SECRET|PASSWORD/i.test(key) || key.startsWith('RUFF_'))delete env[key];
const results=[];
async function snapshot(){const state={};async function visit(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name==='node_modules' || e.name==='.venv')continue;const path=join(dir,e.name);if(e.isDirectory())await visit(path);else state[relative(root,path)]=createHash('sha256').update(await readFile(path)).digest('hex');}}await visit(root);return state;}
async function run(presets,expected,bindings={}){
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({exclude:['.venv/**'],quality:{presets,bindings}}));
  const before=await snapshot();
  const output=spawnSync(process.execPath,[cli,'audit',root,'--json','--run-checks'],{env,encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024,windowsHide:true});
  assert.ifError(output.error);assert.equal(output.status,expected,output.stderr+output.stdout);
  const report=JSON.parse(output.stdout);assert.ok(report.checks.length>0);assert.equal(report.ai,undefined);
  if(presets.includes('typescript') && expected===1)assert.match(report.checks[0].output,/TS2322/);
  if(presets[0]==='javascript' && expected===1)assert.equal(report.checks[0].diagnostics[0].ruleId,'no-undef');
  if(presets[0]==='python' && expected===1)assert.equal(report.checks[0].diagnostics[0].ruleId,'F401');
  assert.deepEqual(await snapshot(),before,'Source/config/generated files changed');
  results.push({presets,expected,actual:output.status,checks:report.checks.map(c=>({id:c.id,status:c.status,diagnostics:c.diagnostics?.length}))});
}
try {
  await cp(resolve(modulesArg),join(root,'node_modules'),{recursive:true});
  await cp(fileURLToPath(new URL('../node_modules/typescript',import.meta.url)),join(root,'node_modules/typescript'),{recursive:true});
  const native=fileURLToPath(new URL('../node_modules/@typescript',import.meta.url));
  try {await cp(native,join(root,'node_modules/@typescript'),{recursive:true});} catch(error) {if(error.code!=='ENOENT')throw error;}
  const ruffPath=join(root,process.platform==='win32'?'.venv/Scripts/ruff.exe':'.venv/bin/ruff');
  await mkdir(join(ruffPath,'..'),{recursive:true});await cp(resolve(ruffArg),ruffPath);
  await writeFile(join(root,'eslint.config.mjs'),'export default [{files:["**/*.js"],rules:{"no-undef":"error"}}];');
  await writeFile(join(root,'main.js'),'export const x=missing;');await run(['javascript'],1);
  await writeFile(join(root,'main.js'),'export const x=1;');await run(['javascript'],0);
  await writeFile(join(root,'main.py'),'import os\nx=1\n');
  await writeFile(join(root,'ruff.toml'),'fix = true\nfix-only = true\n[lint]\nselect = ["F401"]\n');await run(['python'],1);
  await writeFile(join(root,'main.py'),'x=1\n');await run(['python'],0);
  await writeFile(join(root,'tsconfig.json'),JSON.stringify({compilerOptions:{strict:true,types:[]},files:['main.ts']}));
  await writeFile(join(root,'main.ts'),'const x:string=1;');await run(['typescript'],1,{eslint:false});
  await writeFile(join(root,'main.ts'),'const x:string="ok";');await run(['typescript'],0,{eslint:false});
  console.log(JSON.stringify({cases:results,apiSpendUsd:0,scope:'Real local ESLint/Ruff/TypeScript defect and clean cases; no source changes; current OS only.'},null,2));
} finally {
  assert.equal(resolve(root),originalRoot);assert.ok(root.startsWith(tmpdir()) && root.includes('shipcheck-quality-real-'));
  await rm(root,{recursive:true,force:true});
}
