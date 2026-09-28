import type {Node,CallExpression,Identifier,Literal,MemberExpression,ObjectExpression,ImportDeclaration,ImportDefaultSpecifier} from 'acorn';
import {extractFetchCalls,parseHttpSyntax,unwrap} from './fetch-calls.js';
import type {CallExtraction,CallObservation} from './contract-adapter-types.js';

function properties(input:Node|undefined):Map<string,Node>|undefined {
  if(!input)return new Map();const node=unwrap(input);if(node.type!=='ObjectExpression')return;
  const entries=new Map<string,Node>();
  for(const item of (node as ObjectExpression).properties) {
    if(item.type!=='Property' || item.computed || item.kind!=='init' || item.method)return;
    const key=item.key.type==='Identifier'?item.key.name:item.key.type==='Literal'?item.key.value:undefined;
    if(typeof key!=='string' || key==='__proto__')return;
    entries.set(key,unwrap(item.value));
  }
  return entries;
}
const string=(node:Node|undefined)=>node?.type==='Literal' && typeof (node as Literal).value==='string'?(node as Literal).value as string:undefined;
export function extractAxiosCalls(source:string,syntax:'javascript'|'typescript'|'tsx'='javascript'):CallExtraction {
  const {nodes,issues}=parseHttpSyntax(source,syntax),result:CallExtraction={calls:[],issues};if(issues.length)return result;
  const imports=new Map<string,Node>();
  for(const {node} of nodes) {
    if(node.type==='ImportDeclaration' && (node as ImportDeclaration).source.value==='axios') {
      const declaration=node as ImportDeclaration;
      if(declaration.specifiers.length===1 && declaration.specifiers[0]?.type==='ImportDefaultSpecifier')imports.set(declaration.specifiers[0].local.name,declaration.specifiers[0]);
      else result.issues.push('unsupported-axios-import');
    }
    if(node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='require' && string((node as CallExpression).arguments[0])==='axios')result.issues.push('unsupported-axios-import');
  }
  const aliases=new Set(['axios',...imports.keys()]),ambiguous=new Set<string>();
  const callees=new Set<Node>(nodes.filter(entry=>entry.node.type==='CallExpression').map(entry=>(entry.node as CallExpression).callee));
  for(const {node,parent} of nodes) {
    if(node.type!=='Identifier' || !aliases.has((node as Identifier).name))continue;
    const name=(node as Identifier).name;
    if(parent===imports.get(name) && (parent as ImportDefaultSpecifier).local===node)continue;
    if(parent?.type==='CallExpression' && (parent as CallExpression).callee===node)continue;
    if(parent?.type==='MemberExpression' && (parent as MemberExpression).object===node && callees.has(parent))continue;
    ambiguous.add(name);
  }
  if(nodes.some(({node})=>node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='eval'))for(const alias of aliases)ambiguous.add(alias);
  if(ambiguous.size)result.issues.push('axios-binding-or-configuration-unresolved');
  for(const {node} of nodes.filter(entry=>entry.node.type==='CallExpression').sort((a,b)=>a.node.start-b.node.start)) {
    const invocation=node as CallExpression,callee=invocation.callee;
    const receiver=callee.type==='MemberExpression'?(callee as MemberExpression).object:callee;
    if(receiver.type!=='Identifier' || !aliases.has(receiver.name))continue;
    const method=callee.type==='MemberExpression' && !callee.computed && callee.property.type==='Identifier'?callee.property.name:callee.type==='Identifier'?'call':'';
    if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
    const line=node.loc!.start.line,excerpt=source.split(/\r\n|\n|\r/).slice(line-1,node.loc!.end.line).join('\n');
    if(excerpt.length>2048){result.issues.push('source-excerpt-limit');continue;}
    const call:CallObservation={line,excerpt};result.calls.push(call);
    if(!imports.has(receiver.name) || ambiguous.has(receiver.name)){call.reason='axios-binding-or-configuration-unresolved';continue;}
    if(invocation.optional || !['call','request','get','head','options','delete','post','put','patch'].includes(method)){call.reason='unsupported-axios-operation';continue;}
    const args=invocation.arguments.map(unwrap);let options:Map<string,Node>|undefined,url:string|undefined,verb:string|undefined;
    if(method==='request' || method==='call' && args[0]?.type==='ObjectExpression') {
      if(args.length!==1){call.reason='unsupported-arguments';continue;}
      options=properties(args[0]);url=string(options?.get('url'));verb=options?.has('method')?string(options.get('method')):'GET';
    } else {
      const body=['post','put','patch'].includes(method),index=body?2:1;
      if(!args.length || args.length>index+1){call.reason='unsupported-arguments';continue;}
      url=string(args[0]);options=properties(args[index]);verb=method==='call'?(options?.has('method')?string(options.get('method')):'GET'):method;
      if(options?.has('url') || method!=='call' && options?.has('method')){call.reason='unsupported-axios-config-override';continue;}
    }
    if(!options || [...options.keys()].some(key=>!['url','method','params','data','headers','timeout','signal','responseType'].includes(key))){call.reason='unsupported-or-dynamic-axios-config';continue;}
    if(url===undefined){call.reason='dynamic-url';continue;}call.url=url;
    if(verb===undefined){call.reason='dynamic-method';continue;}call.method=verb.toUpperCase();
    const params=options.get('params');if(!params || params.type==='Literal' && (params as Literal).value===null)continue;
    const query=properties(params);if(!query){call.reason='dynamic-query-parameters';continue;}
    call.queryNames=[];
    for(const [key,value] of query) {
      if(value.type!=='Literal' || !['string','number','boolean'].includes(typeof (value as Literal).value) && (value as Literal).value!==null){call.reason='dynamic-query-parameters';break;}
      if((value as Literal).value!==null)call.queryNames.push(key);
    }
  }
  result.issues=[...new Set(result.issues)];return result;
}
export function extractJavascriptHttpCalls(source:string,path:string):CallExtraction {
  const syntax=path.endsWith('.tsx')?'tsx':/\.(?:ts|mts|cts)$/.test(path)?'typescript':'javascript';
  const fetch=extractFetchCalls(source,syntax),axios=extractAxiosCalls(source,syntax);
  const calls=[...fetch.calls,...axios.calls].sort((a,b)=>a.line-b.line);
  return {calls:calls.slice(0,128),issues:[...new Set([...fetch.issues,...axios.issues,...(calls.length>128?['call-count-limit']:[])])]};
}
