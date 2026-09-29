import {spawnSync} from 'node:child_process';
import {realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {reportSchema} from '../dist/src/index.js';

// A single offline audit capture, not an autonomous developer or acceptance gate.
// No shell, paid calls, external checks, external-root grants or file writes.
try {
  if(process.argv.length!==3)throw Error('Usage: node examples/capture-audit.mjs <repository>');
  const target=resolve(process.argv[2]),root=realpathSync.native(target);
  const cli=fileURLToPath(new URL('../dist/src/cli.js',import.meta.url));
  const result=spawnSync(process.execPath,[cli,'audit','--json','--',target],{
    encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:16*1024*1024,
  });
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.error || result.signal || ![0,1,2].includes(result.status))throw Error('Audit process failed, timed out, exceeded output limits or returned an unexpected exit code.');
  let report;
  try {report=JSON.parse(result.stdout);}catch {throw Error('No valid JSON report; treat this attempt as an operational failure.');}
  if(!reportSchema.safeParse(report).success)throw Error('Unsupported or malformed report; check the matching Shipcheck version.');
  if(realpathSync.native(report.root)!==root || report.workflow?.kind!=='audit')throw Error('Report scope does not match the requested audit.');
  // Retain the raw validated object, including additive fields unknown to this client.
  process.stdout.write(JSON.stringify({cliExitCode:result.status,report},null,2)+'\n');
  process.exitCode=result.status;
} catch(error) {
  process.stderr.write('Capture failed: '+(error instanceof Error?error.message:String(error))+'\n');
  process.exitCode=2;
}
