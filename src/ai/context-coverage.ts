import type {AiContext} from './context.js';
import type {AiResult} from './contracts.js';

/** Local reference snapshots may supply task files without expanding automatic source selection. */
export function suppliedLocalPaths(context:AiContext):string[] {
  return [...new Set([...context.files.map(file=>file.path),...(context.references ?? [])
    .filter(item=>!item.record.origin && item.record.status==='loaded').map(item=>item.record.path)])];
}
export function freshLocalPath(path:string,submitted:AiContext,current:AiContext):boolean {
  const source=submitted.files.find(file=>file.path===path);
  if(source)return current.files.find(file=>file.path===path)?.content===source.content;
  const ref=submitted.references?.find(item=>!item.record.origin && item.record.path===path);
  const fresh=current.references?.find(item=>item.record.id===ref?.record.id && !item.record.origin);
  return !!ref && !!fresh && ref.record.status==='loaded' && fresh.record.status==='loaded'
    && ref.record.path===fresh.record.path && ref.record.sha256===fresh.record.sha256 && ref.content===fresh.content;
}
export function referenceCoverage(preview:AiResult['preview'],freshOnly=false):string[] {
  return [...new Set((preview.references ?? []).filter(ref=>ref.status==='included'
    && !ref.path.startsWith('@references/') && (!freshOnly || ref.freshness==='unchanged')).map(ref=>ref.path))];
}

/** Reconcile effective context without erasing source-collection provenance. */
export function reconcileContextCoverage(preview:AiResult['preview'],freshOnly:boolean) {
  const references=new Set(referenceCoverage(preview,freshOnly));
  const sources=new Set(preview.files.filter(file=>!freshOnly || file.freshness==='unchanged').map(file=>file.path));
  const limitations:NonNullable<AiResult['preview']['limitations']>=[];
  for(const dependency of preview.dependencies ?? []) {
    const via=dependency.path && sources.has(dependency.path)?'source':dependency.path && references.has(dependency.path)?'local-reference':undefined;
    dependency.effectiveStatus=via?'included':dependency.status==='unresolved'?'unresolved':'omitted';
    if(via)dependency.suppliedVia=via;
    else {
      delete dependency.suppliedVia;
      limitations.push({kind:'dependency',path:dependency.path ?? dependency.from,reason:dependency.specifier+': '+dependency.effectiveStatus});
    }
  }
  for(const file of preview.skipped)if(!references.has(file.path))
    limitations.push({kind:'source',path:file.path,reason:file.reason});
  for(const file of preview.files)if(file.freshness==='changed-or-unavailable')
    limitations.push({kind:'source',path:file.path,reason:'changed-or-unavailable'});
  for(const ref of preview.references ?? []) {
    if(!['included','not-applicable'].includes(ref.status))limitations.push({kind:'reference',path:ref.path,reason:ref.status});
    else if(ref.freshness==='changed-or-unavailable')limitations.push({kind:'reference',path:ref.path,reason:'changed-or-unavailable'});
  }
  const analysis=preview.analysis;
  if(analysis && (analysis.omittedRecords>0 || analysis.filtered || analysis.bytes===0))
    limitations.push({kind:'analysis',reason:'Analysis context was omitted or filtered.'});
  preview.limitations=limitations;
  preview.limited=limitations.length>0;
}
