import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {join,resolve,relative,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {runCli} from '../dist/src/cli-command.js';
const [mode,directory,...extra]=process.argv.slice(2);
if(!['--prepare','--verify'].includes(mode) || !directory || extra.length)throw Error('Usage: node scripts/effectiveness-loop.mjs --prepare|--verify <exercise-directory>');
const output=resolve(directory),root=join(output,'repository');
globalThis.fetch=()=>{throw Error('Repair exercise is offline only');};
const hash=value=>createHash('sha256').update(value).digest('hex');
async function snapshot(){const result={};async function visit(dir){for(const e of await readdir(dir,{withFileTypes:true})){assert.ok(!e.isSymbolicLink());const p=join(dir,e.name);if(e.isDirectory())await visit(p);else result[relative(output,p).replaceAll('\\','/')]=hash(await readFile(p));}}await visit(root);result['verify.mjs']=hash(await readFile(join(output,'verify.mjs')));return result;}
async function audit(){const before=await snapshot();const r=await runCli(['audit',root,'--run-checks','--json']);assert.deepEqual(await snapshot(),before,'Audit modified the exercise');return {exitCode:r.exitCode,report:JSON.parse(r.stdout)};}
if(mode==='--prepare'){
  const cases=JSON.parse(await readFile(new URL('../fixtures/effectiveness/cases.json',import.meta.url),'utf8'));
  const fixture=cases.find(c=>c.id==='units-defect');await mkdir(dirname(output),{recursive:true});await mkdir(output);await mkdir(root);
  for(const [path,content] of Object.entries(fixture.files))await writeFile(join(root,path),content);
  await writeFile(join(output,'verify.mjs'),'import assert from "node:assert/strict"; import {charge} from "./repository/main.mjs"; for(let count=0;count<=100;count++)assert.equal(charge(count),count*7,"count="+count);');
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({...fixture.config,checks:[{id:'acceptance',purpose:'test',command:process.execPath,args:[join(output,'verify.mjs')]}]},null,2));
  const baseline=await snapshot();const before=await audit();assert.equal(before.exitCode,1);
  await writeFile(join(output,'before.json'),JSON.stringify(before,null,2));
  await writeFile(join(output,'state.json'),JSON.stringify({baseline,allowed:['repository/main.mjs'],maxIterations:2,iterations:0},null,2));
  await writeFile(join(output,'HANDOFF.md'),'Repair the issue reported in before.json. Only repository/main.mjs may change. Preserve provider, requirements, configuration and external verifier. At most two edit/verify cycles; no paid calls. Run node scripts/effectiveness-loop.mjs --verify with this directory after editing.');
  console.log(JSON.stringify({root,report:join(output,'before.json'),exitCode:before.exitCode,allowed:['repository/main.mjs'],maxIterations:2}));
} else {
  const state=JSON.parse(await readFile(join(output,'state.json'),'utf8'));assert.ok(state.iterations<state.maxIterations,'Iteration limit reached');
  state.iterations++;await writeFile(join(output,'state.json'),JSON.stringify(state,null,2));
  const current=await snapshot();const changed=[...new Set([...Object.keys(state.baseline),...Object.keys(current)])].filter(p=>state.baseline[p]!==current[p]);
  const protectedUnchanged=changed.every(p=>state.allowed.includes(p));
  const after=protectedUnchanged?await audit():null;
  const result={iteration:state.iterations,changed,protectedUnchanged,passed:protectedUnchanged && changed.length>0 && after?.exitCode===0,
    verifier:'Every integer count from 0 through 100 is checked against the frozen cents requirement.',after};
  await writeFile(join(output,'iteration-'+state.iterations+'.json'),JSON.stringify(result,null,2),{flag:'wx'});
  console.log(JSON.stringify({iteration:result.iteration,changed,protectedUnchanged,passed:result.passed,exitCode:after?.exitCode}));
  if(!result.passed)process.exitCode=1;
}
