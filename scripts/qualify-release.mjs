import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {runCli} from '../dist/src/cli-command.js';

// Real installed tools on synthetic inputs only. No package install or AI request.
const [eslintArg,ruffArg]=process.argv.slice(2);
if(!eslintArg || !ruffArg || process.argv.length!==4)throw Error('Usage: node scripts/qualify-release.mjs <eslint/bin/eslint.js> <ruff executable>');
const eslint=resolve(eslintArg),ruff=resolve(ruffArg);
function version(command,args){const p=spawnSync(command,args,{encoding:'utf8',timeout:10000,windowsHide:true});assert.ifError(p.error);assert.equal(p.status,0,p.stderr);return p.stdout.trim();}
const versions={node:process.version,platform:process.platform,arch:process.arch,eslint:version(process.execPath,[eslint,'--version']),ruff:version(ruff,['--version'])};
globalThis.fetch=()=>{throw Error('Qualification must not call AI/network');};
const workspace=await mkdtemp(join(tmpdir(),'shipcheck-qualification-')),results=[];
async function write(root,path,text){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),text);}
async function snapshot(root){const output={};async function visit(path,prefix=''){for(const entry of await readdir(path,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())await visit(join(path,entry.name),name+'/');else {assert.ok(entry.isFile());output[name]=createHash('sha256').update(await readFile(join(path,entry.name))).digest('hex');}}}await visit(root);return output;}
const specs=[];
for(const [id,source,expected] of [['defect','export const value = missing;','violation'],['clean','export const value = 1;','clean']]) {
  specs.push({id:'eslint-'+id,expected,files:{'main.js':source,'eslint.config.mjs':'export default [{files:["**/*.js"],rules:{"no-undef":"error"}}];'},config:{checks:[{id:'eslint',command:process.execPath,args:[eslint,'main.js','--format','json','--no-inline-config'],format:'eslint-json'}]},stage:'checks'});
}
for(const [id,source,expected] of [['defect','import os\nvalue = 1\n','violation'],['clean','value = 1\n','clean']])specs.push({id:'ruff-'+id,expected,files:{'main.py':source},config:{checks:[{id:'ruff',command:ruff,args:['check','main.py','--isolated','--no-cache','--select','F401','--output-format','json'],format:'ruff-json'}]},stage:'checks'});
for(const [id,source,expected] of [['defect','fetch("https://api.example.test/usres");','violation'],['clean','fetch("https://api.example.test/users");','clean'],['dynamic','fetch(url);','incomplete']])specs.push({id:'http-'+id,expected,files:{'main.js':source,'api.json':JSON.stringify({openapi:'3.1.0',info:{title:'Test',version:'1.0.0'},paths:{'/users':{get:{}}}})},config:{resources:[{id:'api',path:'api.json',kind:'openapi'}],contracts:[{id:'api',resourceId:'api',files:['main.js'],baseUrl:'https://api.example.test'}]},stage:'contracts'});
for(const [id,source,expected] of [['defect','getUser(1);','violation'],['clean','getUser("id");','clean'],['dynamic','getUser(value);','incomplete']])specs.push({id:'sdk-'+id,expected,files:{'main.ts':'import {getUser} from "fixture-sdk";'+source,'node_modules/fixture-sdk/package.json':JSON.stringify({name:'fixture-sdk',version:'1.0.0',types:'index.d.ts'}),'node_modules/fixture-sdk/index.d.ts':'export declare function getUser(id: string): string;'},config:{sdkContracts:[{id:'sdk',package:'fixture-sdk',files:['main.ts']}]},stage:'sdkContracts'});
for(const [id,source,expected] of [['defect','import "../ui/view.js";','violation'],['clean','import "node:fs";','clean'],['dynamic','import(name);','incomplete']])specs.push({id:'architecture-'+id,expected,files:{'core/main.ts':source,'ui/view.ts':'export const value=1;'},config:{architecture:{files:['core/**'],boundaries:[{id:'boundary',from:'core',to:'ui',reason:'Core must not import UI.'}]}},stage:'architecture'});
try {
  for(const spec of specs) {
    const root=join(workspace,spec.id);await mkdir(root);
    for(const [path,text] of Object.entries(spec.files))await write(root,path,text);
    await write(root,'shipcheck.config.json',JSON.stringify(spec.config));
    const before=await snapshot(root),start=performance.now();
    const output=await runCli(['audit',root,'--json','--run-checks']);
    const report=JSON.parse(output.stdout);
    const actual=output.exitCode===2?'incomplete':output.exitCode===1?'violation':'clean';
    assert.equal(actual,spec.expected,spec.id+': '+output.stderr);
    if(spec.stage==='checks') {
      assert.equal(report.checks[0].status,spec.expected==='clean'?'passed':'failed');
      assert.equal(report.checks[0].diagnostics.length,spec.expected==='clean'?0:1);
      if(spec.expected==='violation')assert.equal(report.checks[0].diagnostics[0].ruleId,spec.id.startsWith('eslint-')?'no-undef':'F401');
    } else if(spec.stage==='architecture')assert.equal(report.architecture.state,spec.expected==='incomplete'?'partial':'checked');
    else {assert.equal(report[spec.stage][0].state,spec.expected==='incomplete'?'partial':'checked');assert.equal(report[spec.stage][0].calls[0].status,spec.expected==='clean'?'matched':spec.expected==='violation'?'mismatch':'unresolved');}
    assert.deepEqual(await snapshot(root),before,'Audit mutated '+spec.id);
    results.push({id:spec.id,expected:spec.expected,actual,exitCode:output.exitCode,elapsedMs:Math.round(performance.now()-start)});
  }
  console.log(JSON.stringify({kind:'deterministic-seeded-corpus',versions,cases:results,score:{cases:results.length,correct:results.length,defects:results.filter(r=>r.expected==='violation').length,cleanControls:results.filter(r=>r.expected==='clean').length,incompleteControls:results.filter(r=>r.expected==='incomplete').length},apiSpendUsd:0,limitations:['Handwritten supported-pattern fixtures, not real-world precision/recall.','External-tool versions and this operating system only.','No live-model behavior measured.']},null,2));
} finally {await rm(workspace,{recursive:true,force:true});}
