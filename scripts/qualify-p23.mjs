import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {runCli} from '../dist/src/cli-command.js';
const [pyrightArg,...extra]=process.argv.slice(2);assert.ok(pyrightArg && !extra.length,'Usage: node scripts/qualify-p23.mjs <installed-pyright-index.js>');
const pyright=resolve(pyrightArg);globalThis.fetch=()=>{throw Error('Offline qualification forbids API calls');};
const corpus=JSON.parse(await readFile(new URL('../fixtures/evidence-comparison/cases.json',import.meta.url),'utf8'));
const behavioral=corpus.filter(item=>item.id.startsWith('empty-average-') || item.id.startsWith('concurrent-append-'));
const cases=[...['defect','clean'].map(kind=>({id:'python-types-'+kind,kind,files:{'main.py':kind==='defect'?'count: int = "three"\n':'count: int = 3\n'},script:null,rule:'reportAssignmentType',line:1})),
 ...['defect','clean'].map(kind=>({id:'python-await-'+kind,kind,files:{'main.py':'async def persist() -> None:\n    return\n\n'+(kind==='defect'?'def run() -> None:\n    persist()\n':'async def run() -> None:\n    await persist()\n')},script:null,rule:'reportUnusedCoroutine',line:5})),...behavioral];
for(const fixture of cases){
 const root=await mkdtemp(join(tmpdir(),'shipcheck-p23-qualification-'));
 try{
  for(const [name,text] of Object.entries(fixture.files))await writeFile(join(root,name),text);
  const check=fixture.script?{id:'tests',purpose:'test',required:true,command:process.execPath,args:['--input-type=module','-e',fixture.script]}:
    {id:'types',purpose:'typecheck',required:true,command:process.execPath,args:[pyright,'--outputjson'],format:'pyright-json'};
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({checks:[check]}));
  if(!fixture.script)await writeFile(join(root,'pyrightconfig.json'),JSON.stringify({include:['main.py'],typeCheckingMode:'strict'}));
  const snapshot=async()=>Object.fromEntries(await Promise.all((await readdir(root)).sort().map(async name=>[name,createHash('sha256').update(await readFile(join(root,name))).digest('hex')])));
  const before=await snapshot();const result=await runCli(['audit',root,'--run-checks','--json']);
  assert.equal(result.exitCode,fixture.kind==='defect'?1:0,result.stderr+result.stdout);
  const report=JSON.parse(result.stdout);assert.equal(report.checks[0].status,fixture.kind==='defect'?'failed':'passed');
  if(!fixture.script && fixture.kind==='defect')assert.ok(report.checks[0].diagnostics.some(d=>d.tool==='pyright' && d.ruleId===fixture.rule && d.path==='main.py' && d.line===fixture.line));
  assert.deepEqual(await snapshot(),before,'Audit changed files');
  console.log('PASS '+fixture.id+'; exit '+result.exitCode);
 }finally{const local=relative(tmpdir(),root);assert.ok(local.startsWith('shipcheck-p23-qualification-') && !local.includes('..'));await rm(root,{recursive:true,force:true});}
}
console.log('Eight real offline defect/clean checks passed; zero AI spend. Behavioral fixtures exercise test integration, not new static defect detection.');
