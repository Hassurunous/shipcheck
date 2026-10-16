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
