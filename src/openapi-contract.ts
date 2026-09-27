import {z} from 'zod';
import type {ResourceSnapshot} from './reference-resources.js';

const methods=['get','put','post','delete','options','head','patch','trace'] as const;
const object=(value:unknown):value is Record<string,unknown>=>typeof value==='object' && value!==null && !Array.isArray(value);
const pointer=(value:string)=>value.replace(/~/g,'~0').replace(/\//g,'~1');
export const openApiIndexSchema=z.object({
  resourceId:z.string(),snapshotSha256:z.string().nullable(),
  status:z.enum(['indexed','partial','unsupported','invalid','unavailable']),
  specificationVersion:z.string().optional(),apiVersion:z.string().optional(),
  operations:z.array(z.object({method:z.enum(methods),path:z.string(),pointer:z.string(),operationId:z.string().optional()})),
  issues:z.array(z.object({pointer:z.string(),reason:z.string()})),
  assessment:z.literal('not-compared'),
});
export type OpenApiIndex=z.infer<typeof openApiIndexSchema>;

/** Index direct OpenAPI operations only. No I/O, reference resolution or schema validation. */
export function indexOpenApi(snapshot:ResourceSnapshot):OpenApiIndex {
  const result:OpenApiIndex={resourceId:snapshot.record.id,snapshotSha256:snapshot.record.sha256,
    status:'indexed',operations:[],issues:[],assessment:'not-compared'};
  const issue=(at:string,reason:string)=>result.issues.push({pointer:at,reason});
  if(snapshot.record.status!=='loaded' || snapshot.record.kind!=='openapi') {
    result.status='unavailable';issue('','A loaded OpenAPI resource is required.');return result;
  }
  let document:unknown;
  try{document=JSON.parse(snapshot.content);}catch{
    result.status='unsupported';issue('','Only JSON documents are supported; YAML or malformed JSON cannot be indexed.');return result;
  }
  if(!object(document) || typeof document.openapi!=='string') {
    result.status='invalid';issue('/openapi','Expected an OpenAPI version string.');return result;
  }
  result.specificationVersion=document.openapi;
  if(!/^3\.(0|1)\.\d+$/.test(document.openapi)) {
    result.status='unsupported';issue('/openapi','Only OpenAPI 3.0.x and 3.1.x operation indexing is supported.');return result;
  }
  if(!object(document.info) || typeof document.info.version!=='string' || typeof document.info.title!=='string') {
    result.status='invalid';issue('/info','Expected info.title and info.version strings.');return result;
  }
  result.apiVersion=document.info.version;
  if(document.paths===undefined && document.openapi.startsWith('3.1.')) {
    result.status='partial';issue('/paths','No paths supplied; webhooks and component-only documents are not indexed.');return result;
  }
  if(!object(document.paths)) {result.status='invalid';issue('/paths','Expected a paths object.');return result;}
  const ids=new Set<string>();
  for(const path of Object.keys(document.paths).sort()) {
    if(path.startsWith('x-'))continue;
    const at=`/paths/${pointer(path)}`;const item=document.paths[path];
    if(!path.startsWith('/') || !object(item)) {issue(at,'Expected a slash-prefixed path and a Path Item object.');continue;}
    if(Object.hasOwn(item,'$ref')) {issue(at,'Referenced Path Items are not resolved; this entire Path Item is skipped.');continue;}
    for(const method of methods) {
      if(!Object.hasOwn(item,method))continue;
      const operation=item[method];const opPointer=`${at}/${method}`;
      if(!object(operation)) {issue(opPointer,'Expected an Operation object.');continue;}
      if(operation.operationId!==undefined && typeof operation.operationId!=='string') {issue(opPointer,'Expected a string operationId.');continue;}
      const operationId=operation.operationId as string|undefined;
      if(operationId!==undefined) {
        if(ids.has(operationId))issue(`${opPointer}/operationId`,'Duplicate operationId; identity is ambiguous.');
        ids.add(operationId);
      }
      result.operations.push({method,path,pointer:opPointer,...(operationId!==undefined?{operationId}:{})});
    }
  }
  if(document.webhooks!==undefined)issue('/webhooks','Webhook operations are not indexed.');
  if(result.issues.length)result.status='partial';
  return openApiIndexSchema.parse(result);
}
