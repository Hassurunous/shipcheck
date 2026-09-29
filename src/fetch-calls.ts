import {parse,type Node,type CallExpression,type Identifier,type Literal,type ObjectExpression,type Property} from 'acorn';
import {parse as parseTyped} from '@babel/parser';
import type {CallObservation,CallExtraction} from './contract-adapter-types.js';
export type FetchCall=CallObservation;
// Type-only wrappers do not change a literal's runtime value.
export function unwrap(node:Node):Node {
  while(['TSAsExpression','TSTypeAssertion','TSSatisfiesExpression','TSNonNullExpression'].includes(node.type))
    node=(node as Node & {expression:Node}).expression;
  return node;
}
/** Syntax-only extraction. Bindings/aliases anywhere in the file disable direct-fetch inference. */
export function parseHttpSyntax(content:string,syntax:'javascript'|'typescript'|'tsx'='javascript') {
  // JS parsers count these separators as lines; Shipcheck's evidence format uses CR/LF.
  if(/[\u2028\u2029]/.test(content))return {nodes:[],issues:['unsupported-line-endings']};
  let tree:Node;
  try{tree=syntax==='javascript'?parse(content,{ecmaVersion:'latest',sourceType:'module',locations:true})
    :parseTyped(content,{sourceType:'module',attachComment:false,plugins:['estree','typescript',...(syntax==='tsx'?['jsx' as const]:[])]}).program as unknown as Node;}
  catch{return {nodes:[],issues:['unsupported-or-invalid-'+(syntax==='javascript'?'javascript':'typescript')]};}
  const nodes:{node:Node;parent?:Node}[]=[];const stack:{node:Node;parent?:Node}[]=[{node:tree}];
  while(stack.length) {
    const entry=stack.pop()!;nodes.push(entry);
    for(const value of Object.values(entry.node))for(const child of Array.isArray(value)?value:[value])
      if(child && typeof child==='object' && 'type' in child && typeof child.type==='string')stack.push({node:child as Node,parent:entry.node});
  }
  return {nodes,issues:[] as string[]};
}
export function extractFetchCalls(content:string,syntax:'javascript'|'typescript'|'tsx'='javascript'):CallExtraction {
  const parsed=parseHttpSyntax(content,syntax),nodes=parsed.nodes;
  if(parsed.issues.length)return {calls:[],issues:parsed.issues};
  const ambiguous=nodes.some(({node,parent})=>node.type==='Identifier' && (node as Identifier).name==='fetch'
    && !(parent?.type==='CallExpression' && (parent as CallExpression).callee===node))
    || nodes.some(({node})=>node.type==='WithStatement' || node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='eval');
  const calls:FetchCall[]=[];
  const issues:string[]=ambiguous?['fetch-binding-or-alias-unresolved']:[];
  const lines=content.split(/\r\n|\n|\r/);
  for(const {node} of nodes.sort((a,b)=>a.node.start-b.node.start)) {
    if(node.type!=='CallExpression')continue;
    const call=node as CallExpression;
    if(call.callee.type!=='Identifier' || (call.callee as Identifier).name!=='fetch')continue;
    if(calls.length>=128){issues.push('call-count-limit');break;}
    const result:FetchCall={line:node.loc!.start.line,excerpt:lines.slice(node.loc!.start.line-1,node.loc!.end.line).join('\n')};
    if(result.excerpt.length>2048){issues.push('source-excerpt-limit');continue;}
    calls.push(result);
    if(ambiguous){result.reason='fetch-binding-or-alias-unresolved';continue;}
    if(call.optional || call.arguments.length<1 || call.arguments.length>2){result.reason='unsupported-call-shape';continue;}
    const first=unwrap(call.arguments[0]!);
    if(first.type!=='Literal' || typeof (first as Literal).value!=='string'){result.reason='dynamic-url';continue;}
    result.url=(first as Literal).value as string;result.method='GET';
    const options=call.arguments[1]?unwrap(call.arguments[1]):undefined;
    if(!options)continue;
    if(options.type!=='ObjectExpression'){result.reason='dynamic-options';continue;}
    let sawMethod=false;
    for(const option of (options as ObjectExpression).properties) {
      if(option.type!=='Property' || option.computed || option.kind!=='init' || option.method){result.reason='dynamic-options';break;}
      const property=option as Property;
      const key=property.key.type==='Identifier'?property.key.name:property.key.type==='Literal'?property.key.value:undefined;
      if(typeof key!=='string' || key==='__proto__'){result.reason='dynamic-options';break;}
      if(key==='method') {
        const value=unwrap(property.value) as Literal;
        if(sawMethod || value.type!=='Literal' || typeof value.value!=='string'){result.reason='dynamic-method';break;}
        sawMethod=true;
        const method=value.value;
        result.method=/^(delete|get|head|options|post|put)$/i.test(method)?method.toUpperCase():method;
      }
    }
  }
  return {calls,issues:[...new Set(issues)]};
}
