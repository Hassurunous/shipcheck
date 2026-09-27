import {execFile,type ChildProcess} from 'node:child_process';
import {join} from 'node:path';
import {promisify} from 'node:util';
const exec=promisify(execFile);

/** Best-effort descendant cleanup, not a sandbox against deliberately detached processes. */
export async function terminateCheckTree(child:ChildProcess):Promise<boolean> {
  if(!child.pid)return false;
  try {
    if(process.platform==='win32') {
      if(!process.env.SystemRoot)throw new Error('System root unavailable.');
      await exec(join(process.env.SystemRoot,'System32','taskkill.exe'),['/PID',String(child.pid),'/T','/F'],
        {windowsHide:true,timeout:5000,maxBuffer:65536});
    } else process.kill(-child.pid,'SIGKILL');
    return true;
  } catch {child.kill('SIGKILL');return false;}
}
