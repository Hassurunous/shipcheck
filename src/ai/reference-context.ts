import type {Config} from '../config.js';
import {loadReferenceResources,type ResourceSnapshot} from '../reference-resources.js';
import type {AiContext} from './context.js';

/** Fill remaining context space with complete references, never silently truncate. */
export async function attachReferences(root:string,config:Config,context:AiContext) {
  if(!config.resources.length)return;
  const loaded=await loadReferenceResources(root,config,context.files.map(file=>file.path));
  context.references=[];
  context.preview.references=[];
  let blocked=false;
  for(const record of loaded.report.resources) {
    let status:string=record.status;
    const snapshot=loaded.snapshots.find(item=>item.record.id===record.id);
    if(snapshot) {
      const duplicates=loaded.report.resources.filter(item=>item.path===record.path && item.status!=='not-applicable');
      if(duplicates.length>1 || context.files.some(file=>file.path===record.path))status='ambiguous-path';
      else {
        const next:ResourceSnapshot[]=[...(context.references ?? []),snapshot];
        const bytes=Buffer.byteLength(JSON.stringify(context.files))+Buffer.byteLength(JSON.stringify(next));
        if(bytes>config.ai.maxContextBytes)status='context-size-limit';
        else {context.references=next;context.preview.serializedBytes=bytes;status='included';}
      }
    }
    context.preview.references.push({id:record.id,path:record.path,sha256:record.sha256,status,required:record.required});
    if(!['included','not-applicable'].includes(status)) {
      context.preview.limited=true;
      if(record.required)blocked=true;
    }
  }
  return blocked;
}
