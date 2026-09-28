import {configSchema,matchesPattern,type ConfigInput} from './config.js';
import {loadReferenceResources} from './reference-resources.js';
import {indexOpenApi} from './openapi-contract.js';
import type {CallObservation} from './contract-adapter-types.js';
import {contractAdapterFor} from './contract-adapters.js';
import {type ContractResult} from './contract-contracts.js';

const object=(v:unknown):v is Record<string,unknown>=>!!v && typeof v==='object' && !Array.isArray(v);
const pointer=(v:string)=>v.replace(/~/g,'~0').replace(/\//g,'~1');
type Comparison=Pick<ContractResult['calls'][number],'status'|'reason'|'contractPointers'>;
const outcome=(status:Comparison['status'],reason:string,contractPointers:string[]=[]):Comparison=>({status,reason,contractPointers});

/** Compare only method, route and required query-name presence; never execute a request. */
function compare(call:CallObservation,baseUrl:string,paths:Record<string,unknown>):Comparison {
  if(call.reason)return outcome('unresolved',call.reason);
  // Relative URLs depend on the runtime document URL, not the configured service URL.
  let url:URL;try{url=new URL(call.url!);}catch{return outcome('unresolved','relative-or-invalid-url');}
  const base=new URL(baseUrl);const prefix=base.pathname.replace(/\/$/,'');
  if(url.username || url.password)return outcome('unresolved','credential-bearing-url');
  if(url.origin!==base.origin || !(url.pathname===prefix || url.pathname.startsWith(prefix+'/')))
    return outcome('outside-service','URL is outside the configured service base.');
  if(!['GET','POST','PUT','DELETE','HEAD','OPTIONS','PATCH'].includes(call.method!))return outcome('unresolved','unsupported-method');
  const route=url.pathname.slice(prefix.length) || '/';
  if(route.includes('%'))return outcome('unresolved','encoded-path');
  const names=Object.keys(paths).filter(path=>path.startsWith('/'));
  const supported=(path:string)=>path.split('/').every(part=>!/[{}]/.test(part) || /^\{[^{}/]+\}$/.test(part));
  if(names.some(path=>!supported(path)))return outcome('unresolved','unsupported-path-template');
  const matches=Object.hasOwn(paths,route)?[route]:names.filter(path=>{
    const parts=path.split('/'),actual=route.split('/');
    return parts.length===actual.length && parts.every((part,i)=>part===actual[i] || /^\{[^{}]+\}$/.test(part) && !!actual[i]);
  });
  if(matches.length>1)return outcome('unresolved','ambiguous-path-template');
  if(!matches.length)return outcome('mismatch','Route is absent from the configured contract.',['/paths']);
  const path=matches[0]!,at='/paths/'+pointer(path),item=paths[path];
  if(!object(item))return outcome('unresolved','invalid-path-item');
  const method=call.method!.toLowerCase(),operation=item[method];
  if(!Object.hasOwn(item,method))return outcome('mismatch','Method is absent for the matched route.',[at]);
  if(!object(operation))return outcome('unresolved','invalid-operation');
  const parameters=new Map<string,{value:Record<string,unknown>;at:string}>();
  for(const [owner,location] of [[item,at],[operation,at+'/'+method]] as const) {
    if(owner.parameters===undefined)continue;
    if(!Array.isArray(owner.parameters))return outcome('unresolved','unsupported-parameters',[location]);
    const seen=new Set<string>();
    for(const [i,param] of owner.parameters.entries()) {
      if(!object(param) || '$ref' in param || typeof param.name!=='string' || !['query','path','header','cookie'].includes(String(param.in)) || (param.required!==undefined && typeof param.required!=='boolean'))
        return outcome('unresolved','unsupported-parameter-definition',[location+'/parameters']);
      const key=param.in+':'+param.name;
      if(seen.has(key))return outcome('unresolved','duplicate-parameter',[location+'/parameters']);
      seen.add(key);parameters.set(key,{value:param,at:location+'/parameters/'+i});
    }
  }
  // Serialization such as deepObject may require names other than the declared name.
  for(const {value:p,at:location} of parameters.values())if(p.in==='query' && p.required===true) {
    if(p.content!==undefined || !object(p.schema) || !['string','number','integer','boolean'].includes(String(p.schema.type)) || (p.style!==undefined && p.style!=='form'))
      return outcome('unresolved','unsupported-required-query-serialization',[location]);
  }
  const missing=[...parameters.values()].filter(({value:p})=>p.in==='query' && p.required===true && !url.searchParams.has(p.name as string) && !call.queryNames?.includes(p.name as string));
  if(missing.length)return outcome('mismatch','Required query parameter names are missing: '+missing.map(p=>p.value.name).join(', '),missing.map(p=>p.at));
  return outcome('matched','Method, route and supported required query-name presence match; values, bodies, responses and authentication are not assessed.',[at+'/'+method]);
}

export async function auditContracts(root:string,input:ConfigInput={},scope?:readonly string[]):Promise<ContractResult[]> {
  const config=configSchema.parse(input),results:ContractResult[]=[];
  for(const binding of config.contracts) {
    const files=[...new Set(binding.files)].filter(path=>!scope || scope.includes(path));
    if(!files.length)continue;
    const result:ContractResult={id:binding.id,resourceId:binding.resourceId,state:'checked',scope:'literal-http-calls-only',issues:[],files:[],calls:[]};
    results.push(result);
    const resource=config.resources.find(item=>item.id===binding.resourceId);
    if(!resource || resource.kind!=='openapi'){result.state='unavailable';result.issues.push('Binding requires a configured OpenAPI resource.');continue;}
    if(files.some(path=>!resource.appliesTo.some(pattern=>matchesPattern(path,pattern)))){result.state='unavailable';result.issues.push('Mapped files are outside reference appliesTo scope.');continue;}
    const references=await loadReferenceResources(root,{exclude:config.exclude,resources:[resource]},files);
    const snapshot=references.snapshots[0];
    result.reference={path:resource.path,sha256:references.report.resources[0]!.sha256};
    if(!snapshot){result.state='unavailable';result.issues.push('Contract '+references.report.resources[0]!.status);continue;}
    const index=indexOpenApi(snapshot);
    if(index.apiVersion!==undefined)result.reference.apiVersion=index.apiVersion;
    if(index.status!=='indexed'){result.state='unavailable';result.issues.push('Contract index '+index.status,...index.issues.map(issue=>issue.pointer+': '+issue.reason));continue;}
    if(binding.expectedVersion!==undefined && binding.expectedVersion!==index.apiVersion){result.state='version-mismatch';result.issues.push('Expected info.version '+binding.expectedVersion+'; received '+index.apiVersion);continue;}
    const document=JSON.parse(snapshot.content) as {paths:Record<string,unknown>};
    const loaded=await loadReferenceResources(root,{exclude:config.exclude,resources:files.map((path,i)=>({id:'source'+i,path,kind:'source' as const}))});
    for(const record of loaded.report.resources) {
      const adapter=contractAdapterFor(record.path);
      const file:ContractResult['files'][number]={path:record.path,sha256:record.sha256,status:record.status,callCount:0,
        ...(adapter?{adapter:adapter.id,language:adapter.language}:{})};result.files.push(file);
      if(record.status!=='loaded'){result.state='partial';continue;}
      if(!adapter){file.status='unsupported-language';result.state='partial';continue;}
      const source=loaded.snapshots.find(item=>item.record.id===record.id)!;
      const extracted=adapter.extract(source.content,record.path);
      file.callCount=extracted.calls.length;
      if(!extracted.calls.length){file.status='no-supported-calls';result.state='partial';result.issues.push(record.path+': no supported calls extracted; this is not a clean contract assessment.');}
      if(extracted.issues.length){result.issues.push(...extracted.issues.map(issue=>record.path+': '+issue));result.state='partial';}
      for(const call of extracted.calls) {
        const comparison=compare(call,binding.baseUrl,document.paths);
        result.calls.push({path:record.path,adapter:adapter.id,...call,observationKind:call.observationKind ?? 'request-call',...comparison});
        if(comparison.status==='unresolved' || comparison.status==='outside-service')result.state='partial';
      }
    }
  }
  return results;
}
