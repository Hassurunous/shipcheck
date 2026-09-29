import * as fs from 'node:fs/promises';
import {join,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {configSchema,isExcluded,matchesPattern,type ConfigInput} from './config.js';
import {validateRoot} from './filesystem-policy.js';
import {sensitiveName,sensitiveContent} from './sensitive-content.js';
import {referencesSchema,resourceEvidenceSchema,type ResourceRecord} from './resource-contracts.js';
import {referenceAccessSchema,type ReferenceAccess} from './reference-access.js';
import {readRemoteReference} from './remote-reference.js';

export const MAX_RESOURCE_BYTES=65536;
export const MAX_REFERENCE_BYTES=262144;
export type ResourceSnapshot={record:ResourceRecord;content:string};
export type LoadedReferences={report:z.infer<typeof referencesSchema>;snapshots:ResourceSnapshot[]};
class ResourceFailure extends Error {constructor(public status:ResourceRecord['status']){super(status);}}
const intrinsicallyExcluded=(path:string)=>path.split('/').some(part=>part.toLowerCase()==='.git' || /^\.env(?:\.|$)/i.test(part));
async function readResource(root:string,path:string,limit:number,exclude:string[]) {
  let current=root;
  for(const part of path.split('/')) {
    current=join(current,part);
    const stat=await fs.lstat(current);
    if(stat.isSymbolicLink())throw new ResourceFailure('linked');
    const actual=relative(root,await fs.realpath(current)).replace(/\\/g,'/');
    if(actual==='..' || actual.startsWith('../') || intrinsicallyExcluded(actual) || isExcluded(actual,exclude))throw new ResourceFailure('excluded');
  }
  const stat=await fs.lstat(current);
  if(!stat.isFile())throw new ResourceFailure('non-regular');
  if(stat.size>limit)throw new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit');
  const handle=await fs.open(current,'r');
  try {
    if(!(await handle.stat()).isFile())throw new ResourceFailure('non-regular');
    const buffer=Buffer.alloc(limit+1);let size=0;
    while(size<buffer.length) {const read=await handle.read(buffer,size,buffer.length-size,null);if(!read.bytesRead)break;size+=read.bytesRead;}
    if(size>limit)throw new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit');
    const bytes=buffer.subarray(0,size);
    if(bytes.includes(0))throw new ResourceFailure('invalid-text');
    let content:string;
    try {content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new ResourceFailure('invalid-text');}
    return {content,bytes:size,sha256:createHash('sha256').update(bytes).digest('hex')};
  } finally {await handle.close();}
}

/** In-memory snapshots only; external reads require separate runtime authorization. */
export async function loadReferenceResources(target:string,options:ConfigInput={},paths?:readonly string[],access:ReferenceAccess={}):Promise<LoadedReferences> {
  const root=await validateRoot(target);const config=configSchema.parse(options);
  const grants=referenceAccessSchema.parse(access);
  const records:ResourceRecord[]=[];const snapshots:ResourceSnapshot[]=[];let consumed=0;
  for(const resource of config.resources) {
    const record:ResourceRecord={...resource,status:'loaded',sha256:null,bytes:0,lines:0};
    if(resource.rootId || resource.url) {
      record.path=`@references/${resource.id}/${resource.path}`;
      record.origin={kind:resource.rootId?'external-root':'https',path:resource.path,
        ...(resource.rootId?{rootId:resource.rootId}:{}),...(resource.url?{url:resource.url}:{})};
    }
    records.push(record);
    if(paths && !paths.some(path=>resource.appliesTo.some(pattern=>matchesPattern(path,pattern)))) {record.status='not-applicable';continue;}
    if(isExcluded(resource.path,config.exclude) || intrinsicallyExcluded(resource.path)) {record.status='excluded';continue;}
    if(resource.path.split('/').some(part=>sensitiveName.test(part))) {record.status='sensitive-content';continue;}
    if(consumed>=MAX_REFERENCE_BYTES) {record.status='total-size-limit';continue;}
    try {
      let sourceRoot=root;
      const limit=Math.min(MAX_RESOURCE_BYTES,MAX_REFERENCE_BYTES-consumed);
      if(resource.rootId) {
        const granted=Object.hasOwn(grants.roots,resource.rootId)?grants.roots[resource.rootId]:undefined;
        if(!granted)throw new ResourceFailure('access-denied');
        sourceRoot=await validateRoot(granted);
        record.origin!.rootSha256=createHash('sha256').update(sourceRoot).digest('hex');
      }
      let read;
      if(resource.url) {
        if(!grants.origins.includes(new URL(resource.url).origin))throw new ResourceFailure('access-denied');
        let bytes:Buffer;
        try {bytes=await readRemoteReference(resource.url,limit);}catch{throw new ResourceFailure('remote-failed');}
        if(bytes.length>limit)throw new ResourceFailure('file-size-limit');
        if(bytes.includes(0))throw new ResourceFailure('invalid-text');
        let content:string;try{content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new ResourceFailure('invalid-text');}
        read={content,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
      } else read=await readResource(sourceRoot,resource.path,limit,config.exclude);
      consumed+=read.bytes;
      if(sensitiveContent.test(read.content)) {record.status='sensitive-content';continue;}
      record.sha256=read.sha256;record.bytes=read.bytes;record.lines=read.content.split(/\r\n|\n|\r/).length;
      if(resource.expectedSha256 && resource.expectedSha256!==read.sha256) {record.status='hash-mismatch';continue;}
      snapshots.push({record:{...record},content:read.content});
    } catch(error) {record.status=error instanceof ResourceFailure?error.status:(error as NodeJS.ErrnoException).code==='ENOENT'?'missing':'unreadable';}
  }
  return {report:referencesSchema.parse({state:records.some(record=>record.required && !['loaded','not-applicable'].includes(record.status))?'incomplete':'ready',
    evaluation:'not-assessed',resources:records}),snapshots};
}

/** Caller supplies submitted and freshly reloaded snapshots; verifies text, not meaning. */
export function verifyResourceEvidence(evidence:z.infer<typeof resourceEvidenceSchema>,submitted:ResourceSnapshot[],current:ResourceSnapshot[]) {
  const parsed=resourceEvidenceSchema.safeParse(evidence);
  if(!parsed.success)return {status:'rejected' as const,reason:'invalid-evidence'};
  const item=parsed.data;
  const original=submitted.find(snapshot=>snapshot.record.id===item.resourceId && snapshot.record.status==='loaded');
  const fresh=current.find(snapshot=>snapshot.record.id===item.resourceId && snapshot.record.status==='loaded');
  let reason='exact-line-match';
  if(!original)reason='not-in-submitted-resources';
  else if(item.snapshotSha256!==original.record.sha256)reason='wrong-snapshot';
  else if(!fresh)reason='resource-unavailable';
  else if(fresh.record.sha256!==original.record.sha256 || fresh.content!==original.content || fresh.record.path!==original.record.path
    || fresh.record.version!==original.record.version || fresh.record.authority!==original.record.authority)reason='resource-changed';
  else if(JSON.stringify(fresh.record.origin)!==JSON.stringify(original.record.origin))reason='resource-origin-changed';
  else {
    const lines=fresh.content.split(/\r\n|\n|\r/);
    if(item.endLine<item.startLine || item.endLine>lines.length)reason='invalid-line-range';
    else if(lines.slice(item.startLine-1,item.endLine).join('\n')!==item.excerpt.split(/\r\n|\n|\r/).join('\n'))reason='excerpt-mismatch';
  }
  return {status:reason==='exact-line-match'?'matched' as const:'rejected' as const,reason};
}
