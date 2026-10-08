import fs from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import ignore,{type Ignore} from 'ignore';
import {isExcluded} from './config.js';
import type {IgnorePolicyReport} from './ignore-contracts.js';
export type IgnoreOptions={exclude?:string[];respectGitignore?:boolean};
type Reason=Pick<IgnorePolicyReport['skipped'][number],'reason'|'source'|'pattern'>;
const LIMIT=65536,MAX_FILES=256;
/** No Git executable, user configuration, ancestor files or .git/info/exclude. */
export function createIgnorePolicy(root:string,options:IgnoreOptions={}) {
  const exclude=options.exclude ?? [],enabled=options.respectGitignore ?? options.exclude===undefined;
  const report:IgnorePolicyReport={mode:enabled?(exclude.length?'combined':'gitignore'):(exclude.length?'shipcheck':'built-in'),
    respectGitignore:enabled,exclude,builtIn:['.git','node_modules'],gitSettings:'repository-gitignore-only',sources:[],skipped:[],skippedCount:0,skippedTruncated:false};
  const cache=new Map<string,Promise<{directory:string;file:string;matcher:Ignore}|false|undefined>>();let bytesRead=0;
  async function read(directory:string) {
    const file=directory?directory+'/.gitignore':'.gitignore';
    try {
      if(directory) {const parent=await fs.lstat(join(root,directory));if(parent.isSymbolicLink() || !parent.isDirectory())return false;}
      const stat=await fs.lstat(join(root,file));
      if(stat.isSymbolicLink() || !stat.isFile() || stat.size>LIMIT)throw Error('Ignore file must be a regular, unlinked file of at most 64 KiB');
      if(report.sources.length>=MAX_FILES)throw Error('More than 256 ignore files');
      const handle=await fs.open(join(root,file),'r');let bytes:Buffer;
      try {
        if(!(await handle.stat()).isFile())throw Error('Ignore file changed');
        const buffer=Buffer.alloc(LIMIT+1);let size=0;
        while(size<buffer.length){const chunk=await handle.read(buffer,size,buffer.length-size,null);if(!chunk.bytesRead)break;size+=chunk.bytesRead;}
        if(size>LIMIT || bytesRead+size>1024*1024)throw Error('Ignore policy exceeds read limits');
        bytes=buffer.subarray(0,size);bytesRead+=size;
      } finally {await handle.close();}
      if(bytes.includes(0))throw Error('Binary ignore file');
      const content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
      const matcher=ignore({ignorecase:false}).add(content);
      report.sources.push({path:file,sha256:createHash('sha256').update(bytes).digest('hex')});
      return {directory,file,matcher};
    } catch(error) {
      if((error as NodeJS.ErrnoException).code==='ENOENT')return;
      throw new Error(`Cannot apply ${file}: ${error instanceof Error?error.message:'read failed'}`);
    }
  }
  async function reason(path:string,directory=false,builtIn=true):Promise<Reason|undefined> {
    if(!path || path.startsWith('/') || path.split('/').some(p=>!p || p==='.' || p==='..') || path.includes('\\'))throw Error('Invalid ignore-policy path');
    if(builtIn && path.split('/').some(p=>p==='.git' || p==='node_modules'))return {reason:'built-in'};
    if(isExcluded(path,exclude))return {reason:'shipcheck',pattern:exclude.find(pattern=>isExcluded(path,[pattern]))!};
    if(!enabled)return;
    const parts=path.split('/'),scopes:{directory:string;file:string;matcher:Ignore}[]=[];
    for(let i=0;i<parts.length;i++) {
      const parent=parts.slice(0,i).join('/');
      if(!cache.has(parent))cache.set(parent,read(parent));
      const scope=await cache.get(parent)!;
      // Callers classify links/non-directories; never discover rules through them.
      if(scope===false)return;
      if(scope)scopes.push(scope);
      const prefix=parts.slice(0,i+1).join('/')+(i<parts.length-1 || directory?'/':'');
      let matched:Reason|undefined;
      for(const scope of scopes) {
        const relative=scope.directory?prefix.slice(scope.directory.length+1):prefix;
        const result=scope.matcher.test(relative);
        if(result.ignored)matched={reason:'gitignore',source:scope.file,...(result.rule?{pattern:result.rule.pattern}:{})};
        else if(result.unignored)matched=undefined;
      }
      // Git cannot re-include children while their parent remains ignored.
      if(matched)return matched;
    }
  }
  function record(path:string,kind:IgnorePolicyReport['skipped'][number]['kind'],reason:Reason) {
    report.skippedCount++;
    if(report.skipped.length<200)report.skipped.push({path,kind,...reason});else report.skippedTruncated=true;
  }
  function describe():IgnorePolicyReport {
    return {...report,sources:[...report.sources].sort((a,b)=>a.path<b.path?-1:1),skipped:[...report.skipped].sort((a,b)=>a.path<b.path?-1:1)};
  }
  return {reason,record,describe};
}
export type IgnorePolicy=ReturnType<typeof createIgnorePolicy>;
