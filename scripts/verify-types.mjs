import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {join,resolve,relative,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
// Run from the development checkout against a separately installed tarball.
if(process.argv.length!==3)throw Error('Usage: node scripts/verify-types.mjs <installation-prefix>');
const prefix=await realpath(resolve(process.argv[2]));
const directory=await mkdtemp(join(prefix,'.shipcheck-types-'));
try {
  const consumer=join(directory,'consumer.mts');
  const installed=createRequire(consumer).resolve('shipcheck');
  assert.ok(installed.startsWith(join(prefix,'node_modules','shipcheck')+sep),'Expected Shipcheck in the selected fresh installation');
  await writeFile(consumer,`import {runWorkflow, reportSchema} from 'shipcheck';
const report=await runWorkflow('.', 'audit');
const parsed=reportSchema.parse(report);
const root:string=parsed.root;
// @ts-expect-error invalid workflow kind must remain a type error
await runWorkflow('.', 'invented-workflow');
console.log(root);
`);
  const compiler=fileURLToPath(new URL('../node_modules/typescript/bin/tsc',import.meta.url));
  const result=spawnSync(process.execPath,[compiler,'--ignoreConfig','--noEmit','--strict','--module','NodeNext','--moduleResolution','NodeNext','--target','ES2022',consumer],{encoding:'utf8',windowsHide:true,timeout:60000});
  assert.ifError(result.error);assert.equal(result.status,0,result.stdout+result.stderr);
  console.log('PASS strict NodeNext consumer of freshly installed Shipcheck, including invalid-call rejection.');
} finally {
  const child=relative(prefix,directory);
  assert.ok(child.startsWith('.shipcheck-types-') && !child.includes(sep));
  await rm(directory,{recursive:true,force:true});
}
