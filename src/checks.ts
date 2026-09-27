import { spawn } from 'node:child_process';
import { z } from 'zod';

export const checkSchema = z.object({
  id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/),
  command:z.string().min(1).max(1024).refine(value=>!value.includes('\0')),
  args:z.array(z.string().max(4096).refine(value=>!value.includes('\0'))).max(100).default([]),
  timeoutMs:z.number().int().min(100).max(300000).default(60000),
  maxOutputBytes:z.number().int().min(128).max(1048576).default(65536),
  failureExitCodes:z.array(z.number().int().min(1).max(255)).default([1]),
}).strict();
export const checksSchema = z.array(checkSchema).max(20).default([]).refine(
  checks=>new Set(checks.map(check=>check.id)).size===checks.length,'Check IDs must be unique.');
export const checkResultSchema=z.object({
  id:z.string(),status:z.enum(['skipped','passed','failed','error']),
  exitCode:z.number().int().nullable(),reason:z.string(),output:z.string(),
  scope:z.literal('whole-repository'),
});
export type CheckResult=z.infer<typeof checkResultSchema>;

/** Explicitly trusted commands only. No shell interpretation or automatic install. */
export async function runChecks(root:string, checks:z.infer<typeof checksSchema>, authorized:boolean,
  credentialEnv='SHIPCHECK_API_KEY'):Promise<CheckResult[]> {
  const results:CheckResult[]=[];
  for(const check of checks) {
    const base={id:check.id,exitCode:null,output:'',scope:'whole-repository' as const};
    if(!authorized) {results.push({...base,status:'skipped',reason:'Requires --run-checks authorization.'});continue;}
    const result=await new Promise<CheckResult>(resolve=> {
      // Avoid forwarding API credentials to linters; commands still run with user privileges.
      const env={...process.env};
      const secrets=Object.entries(env).filter(([name,value])=>value &&
        (name.toUpperCase()===credentialEnv.toUpperCase() || /KEY|TOKEN|SECRET|PASSWORD/i.test(name)));
      for(const [name] of secrets) delete env[name];
      const chunks:Buffer[]=[];
      let bytes=0;
      let finished=false;
      let timer:ReturnType<typeof setTimeout>|undefined;
      const finish=(status:CheckResult['status'],reason:string,exitCode:number|null=null)=> {
        if(finished)return;
        finished=true;
        if(timer)clearTimeout(timer);
        let output=Buffer.concat(chunks).toString('utf8');
        for(const [,secret] of secrets) if(secret) output=output.split(secret).join('[REDACTED]');
        resolve({...base,status,reason,exitCode,output});
      };
      const child=spawn(check.command,check.args,{cwd:root,env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
      const stop=(reason:string)=> {
        // This bounds the direct child. Arbitrary detached grandchildren are not sandboxed.
        child.kill('SIGKILL');
        child.stdout.destroy();child.stderr.destroy();child.unref();
        finish('error',reason);
      };
      const capture=(chunk:Buffer)=> {
        if(finished)return;
        const remaining=check.maxOutputBytes-bytes;
        chunks.push(chunk.subarray(0,Math.max(0,remaining)));
        bytes+=chunk.length;
        if(bytes>check.maxOutputBytes)stop('Output limit exceeded; direct child terminated.');
      };
      child.stdout.on('data',capture);child.stderr.on('data',capture);
      child.on('error',()=>finish('error','Could not launch check. Verify the executable and arguments.'));
      child.on('close',code=>finish(code===0?'passed':code!==null && check.failureExitCodes.includes(code)?'failed':'error',
        code===0?'Command exited successfully.':code!==null && check.failureExitCodes.includes(code)?'Command reported check failures.':'Command did not complete successfully.',code));
      timer=setTimeout(()=>stop('Timeout exceeded; direct child terminated.'),check.timeoutMs);
    });
    results.push(result);
  }
  return results;
}
