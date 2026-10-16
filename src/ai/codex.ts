import {spawn} from 'node:child_process';
import {mkdtemp,writeFile,readFile,lstat,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,isAbsolute} from 'node:path';
import {terminateCheckTree} from '../check-process.js';
import {AiFailure,decodeResponse,type QaRequest} from './client.js';
import type {AiContext} from './context.js';

/** Never pass API credentials or provider overrides to the subscription client. */
export function codexEnvironment(source:NodeJS.ProcessEnv):NodeJS.ProcessEnv {
  const env:NodeJS.ProcessEnv={};
  for(const [key,value] of Object.entries(source)) {
    if(/KEY|TOKEN|SECRET|PASSWORD/i.test(key) || /^(OPENAI|AZURE|ANTHROPIC|AWS|GOOGLE)_/i.test(key)
      || (/^CODEX_/i.test(key) && key.toUpperCase()!=='CODEX_HOME'))continue;
    env[key]=value;
  }
  return env;
}

export const codexRestrictions=[
  '-c','forced_login_method="chatgpt"','-c','model_provider="openai"',
  '-c','approval_policy="never"','-c','web_search="disabled"',
  '-c','project_doc_max_bytes=0','-c','mcp_servers={}',
  ...['shell_tool','unified_exec','apps','plugins','hooks','multi_agent','multi_agent_v2',
    'browser_use','browser_use_external','computer_use','in_app_browser','image_generation','code_mode','code_mode_host']
    .flatMap(name=>['-c',`features.${name}=false`]),
];

async function run(binary:string,args:string[],cwd:string,env:NodeJS.ProcessEnv,timeoutMs:number,input='') {
  return new Promise<{stdout:string;stderr:string;code:number|null}>((resolve,reject)=> {
    const child=spawn(binary,args,{cwd,env,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:'pipe'});
    let stdout='',stderr='',bytes=0,stopped=false;
    const stop=(code:string,message:string)=> {
      if(stopped)return;stopped=true;clearTimeout(timer);
      void terminateCheckTree(child).finally(()=>reject(new AiFailure(code,message)));
    };
    const timer=setTimeout(()=>stop('codex-timeout','Codex exceeded its timeout. No API fallback was attempted.'),timeoutMs);
    const collect=(chunk:Buffer,stream:'stdout'|'stderr')=> {
      bytes+=chunk.length;
      if(bytes>1024*1024){stop('codex-output-limit','Codex exceeded its output limit.');return;}
      if(stream==='stdout')stdout+=chunk.toString('utf8');else stderr+=chunk.toString('utf8');
    };
    child.stdout.on('data',(chunk:Buffer)=>collect(chunk,'stdout'));
    child.stderr.on('data',(chunk:Buffer)=>collect(chunk,'stderr'));
    child.on('error',()=>{clearTimeout(timer);if(!stopped){stopped=true;reject(new AiFailure('codex-unavailable','Cannot launch Codex. Install a trusted native Codex executable on PATH or set SHIPCHECK_CODEX_PATH to its absolute path.'));}});
    child.on('close',code=>{clearTimeout(timer);if(!stopped){stopped=true;resolve({stdout,stderr,code});}});
    child.stdin.on('error',()=>{});child.stdin.end(input);
  });
}

/** Explicit subscription execution only. No API transport, keys, retries or budget fallback. */
export async function requestCodexQa(request:QaRequest,context:AiContext,timeoutMs:number) {
  const override=process.env.SHIPCHECK_CODEX_PATH;
  if(override && (!isAbsolute(override) || /\.(cmd|bat|ps1)$/i.test(override)))
    throw new AiFailure('codex-path','SHIPCHECK_CODEX_PATH must name an absolute native executable, not a shell shim.');
  const binary=override ?? (process.platform==='win32'?'codex.exe':'codex');
  const env=codexEnvironment(process.env);
  const scratch=await mkdtemp(join(tmpdir(),'shipcheck-codex-'));
  try {
    const auth=await run(binary,['-c','forced_login_method="chatgpt"','login','status'],scratch,env,Math.min(timeoutMs,15000));
    if(auth.code!==0 || !/^Logged in using ChatGPT\s*$/m.test(auth.stdout+'\n'+auth.stderr))
      throw new AiFailure('codex-auth','Codex requires ChatGPT subscription login. Run codex login yourself; API-key login is not accepted.');
    const schema=join(scratch,'response-schema.json'),output=join(scratch,'response.json');
    await writeFile(schema,JSON.stringify(request.text.format.schema),{flag:'wx',mode:0o600});
    const result=await run(binary,['exec','--ignore-user-config','--ignore-rules','--ephemeral',
      '--skip-git-repo-check','--sandbox','read-only',...codexRestrictions,
      '--model',request.model,'--output-schema',schema,'--output-last-message',output,'-'],
      scratch,env,timeoutMs,request.instructions+'\nUse only the supplied context. Do not use tools.\n'+JSON.stringify(request.input));
    if(result.code!==0)throw new AiFailure('codex-failed','Codex review failed or subscription access was unavailable. No retry or API fallback was attempted.');
    let body:string;
    try {
      const stat=await lstat(output);
      if(!stat.isFile() || stat.isSymbolicLink() || stat.size>128*1024)throw Error();
      body=await readFile(output,'utf8');
      if(Buffer.byteLength(body)>128*1024)throw Error();
    } catch {throw new AiFailure('codex-output','Codex did not produce a bounded structured response.');}
    return decodeResponse(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:body}]}]}),context);
  } finally {
    // Only this freshly allocated temporary directory; never the audited repository or Codex home.
    await rm(scratch,{recursive:true,force:true});
  }
}
