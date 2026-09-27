import { spawn } from 'node:child_process';
import { z } from 'zod';
import {diagnosticSchema,parseDiagnostics,exceedsThreshold} from './check-diagnostics.js';
import {terminateCheckTree} from './check-process.js';

export const checkSchema = z.object({
  id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/),
  command:z.string().min(1).max(1024).refine(value=>!value.includes('\0')),
  args:z.array(z.string().max(4096).refine(value=>!value.includes('\0'))).max(100).default([]),
  timeoutMs:z.number().int().min(100).max(300000).default(60000),
  maxOutputBytes:z.number().int().min(128).max(1048576).default(65536),
  failureExitCodes:z.array(z.number().int().min(1).max(255)).default([1]),
  format:z.enum(['text','eslint-json','ruff-json']).default('text'),
  failOn:z.enum(['error','warning','info','never']).default('error'),
  languages:z.array(z.enum(['JavaScript','TypeScript','Python'])).min(1).optional(),
}).strict().superRefine((check,context)=>{
  if(check.args.some(arg=>/^--(?:fix|fix-only|unsafe-fixes|write)(?:=|$)/i.test(arg)))
    context.addIssue({code:'custom',path:['args'],message:'Inspection checks must not use recognized fix/write flags.'});
  if(check.format==='text' && check.failOn!=='error')context.addIssue({code:'custom',path:['failOn'],message:'Severity thresholds require a structured JSON format.'});
});
export const checksSchema = z.array(checkSchema).max(20).default([]).refine(
  checks=>new Set(checks.map(check=>check.id)).size===checks.length,'Check IDs must be unique.');
export const checkResultSchema=z.object({
  id:z.string(),status:z.enum(['skipped','passed','failed','error']),
  exitCode:z.number().int().nullable(),reason:z.string(),output:z.string(),
  scope:z.literal('whole-repository'),
  diagnostics:z.array(diagnosticSchema).optional(),
  stdout:z.string().optional(),stderr:z.string().optional(),
});
export type CheckResult=z.infer<typeof checkResultSchema>;

/** Explicitly trusted commands only. No shell interpretation or automatic install. */
export async function runChecks(root:string, checks:z.infer<typeof checksSchema>, authorized:boolean,
  credentialEnv='SHIPCHECK_API_KEY',detectedLanguages?:readonly string[]):Promise<CheckResult[]> {
  const results:CheckResult[]=[];
  for(const check of checks) {
    const base={id:check.id,exitCode:null,output:'',scope:'whole-repository' as const};
    if(!authorized) {results.push({...base,status:'skipped',reason:'Requires --run-checks authorization.'});continue;}
    if(check.languages && (!detectedLanguages || !check.languages.some(language=>detectedLanguages.includes(language)))) {
      results.push({...base,status:'skipped',reason:detectedLanguages?'No configured language detected in the inspected inventory.':'Language selection requires an inspected inventory.'});continue;
    }
    const result=await new Promise<CheckResult>(resolve=> {
      // Avoid forwarding API credentials to linters; commands still run with user privileges.
      const env={...process.env};
      const secrets=Object.entries(env).filter(([name,value])=>value &&
        (name.toUpperCase()===credentialEnv.toUpperCase() || /KEY|TOKEN|SECRET|PASSWORD/i.test(name)));
      for(const [name] of secrets) delete env[name];
      const chunks:Buffer[]=[];
      const stdoutChunks:Buffer[]=[];const stderrChunks:Buffer[]=[];
      let bytes=0;
      let finished=false;
      let stopping=false;
      let timer:ReturnType<typeof setTimeout>|undefined;
      const finish=(status:CheckResult['status'],reason:string,exitCode:number|null=null)=> {
        if(finished)return;
        finished=true;
        if(timer)clearTimeout(timer);
        let output=Buffer.concat(chunks).toString('utf8');
        for(const [,secret] of secrets) if(secret) output=output.split(secret).join('[REDACTED]');
        const redact=(value:string)=>secrets.reduce((text,[,secret])=>secret?text.split(secret).join('[REDACTED]'):text,value);
        const stdout=redact(Buffer.concat(stdoutChunks).toString('utf8'));
        const stderr=redact(Buffer.concat(stderrChunks).toString('utf8'));
        let diagnostics:NonNullable<CheckResult['diagnostics']>|undefined;
        if(check.format!=='text' && status!=='error') {
          try {
            diagnostics=parseDiagnostics(check.format,stdout,root,check.id);
            const failed=exceedsThreshold(diagnostics,check.failOn) || (exitCode!==0 && diagnostics.length===0);
            status=failed?'failed':'passed';
            reason=failed?'Tool diagnostics or exit status failed the configured policy.':'Tool diagnostics passed the configured policy.';
          } catch {status='error';reason='Invalid structured tool output or out-of-root diagnostic path. Check the configured JSON format.';}
        }
        resolve({...base,status,reason,exitCode,output,stdout,stderr,...(diagnostics?{diagnostics}:{} )});
      };
      const child=spawn(check.command,check.args,{cwd:root,env,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
      const stop=(reason:string)=> {
        if(stopping || finished)return;
        stopping=true;
        child.stdout.destroy();child.stderr.destroy();child.unref();
        void terminateCheckTree(child).then(cleaned=>finish('error',`${reason} ${cleaned?'Process-tree termination requested.':'Descendant cleanup could not be confirmed.'}`));
      };
      const capture=(chunk:Buffer,stream:Buffer[])=> {
        if(finished || stopping)return;
        const remaining=check.maxOutputBytes-bytes;
        const bounded=chunk.subarray(0,Math.max(0,remaining));
        chunks.push(bounded);stream.push(bounded);
        bytes+=chunk.length;
        if(bytes>check.maxOutputBytes)stop('Output limit exceeded.');
      };
      child.stdout.on('data',chunk=>capture(chunk,stdoutChunks));child.stderr.on('data',chunk=>capture(chunk,stderrChunks));
      child.on('error',()=>{if(!stopping)finish('error','Could not launch check. Verify the executable and arguments.');});
      child.on('close',code=>{if(!stopping)finish(code===0?'passed':code!==null && check.failureExitCodes.includes(code)?'failed':'error',
        code===0?'Command exited successfully.':code!==null && check.failureExitCodes.includes(code)?'Command reported check failures.':'Command did not complete successfully.',code);});
      timer=setTimeout(()=>stop('Timeout exceeded.'),check.timeoutMs);
    });
    results.push(result);
  }
  return results;
}
