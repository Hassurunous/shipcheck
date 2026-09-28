import {createRequire} from 'node:module';
import type {SgNode} from '@ast-grep/napi';
import type {CallExtraction,CallObservation} from './contract-adapter-types.js';
export type Syntax=SgNode;
const require=createRequire(import.meta.url);
let runtime:typeof import('@ast-grep/napi')|undefined;
/** Load only packaged grammars, never paths/configuration from the inspected repository. */
export function syntaxTree(language:'go'|'csharp'|'java',source:string):{nodes:Syntax[];issues:string[]} {
  // Tree-sitter's line coordinates count LF; do not produce misleading CR-only citations.
  if(/\r(?!\n)/.test(source))return {nodes:[],issues:['unsupported-line-endings']};
  try {
    if(!runtime) {
      const candidate=require('@ast-grep/napi') as typeof import('@ast-grep/napi');
      candidate.registerDynamicLanguage({shipcheck_go:require('@ast-grep/lang-go'),shipcheck_csharp:require('@ast-grep/lang-csharp'),shipcheck_java:require('@ast-grep/lang-java')});
      runtime=candidate;
    }
  } catch {return {nodes:[],issues:['offline-parser-unavailable']};}
  try {
    const root=runtime.parse('shipcheck_'+language,source).root(),nodes:Syntax[]=[],stack=[root];
    while(stack.length){const node=stack.pop()!;nodes.push(node);stack.push(...node.children());}
    if(nodes.some(node=>node.kind()==='ERROR' || node.id()!==root.id() && node.text()===''))return {nodes:[],issues:['unsupported-or-invalid-'+language]};
    return {nodes:nodes.sort((a,b)=>a.range().start.index-b.range().start.index),issues:[]};
  }catch{return {nodes:[],issues:['unsupported-or-invalid-'+language]};}
}
export const named=(node:Syntax|undefined|null)=>node?.namedChildren().filter(child=>!['comment','line_comment','block_comment'].includes(String(child.kind()))) ?? [];
export const same=(a:Syntax|undefined|null,b:Syntax|undefined|null)=>!!a && !!b && a.id()===b.id();
export function literal(node:Syntax|undefined|null):string|undefined {
  if(!node || !['string_literal','interpreted_string_literal','raw_string_literal','verbatim_string_literal'].includes(String(node.kind())))return undefined;
  const text=node.text();
  if(/^"[^"\\\r\n]*"$/.test(text))return text.slice(1,-1);
  if(node.kind()==='raw_string_literal' && /^`[^`\r\n]*`$/.test(text))return text.slice(1,-1);
  if(node.kind()==='verbatim_string_literal' && /^@"[^"\r\n]*"$/.test(text))return text.slice(2,-1);
  return undefined;
}
export function observation(result:CallExtraction,node:Syntax,source:string,kind:CallObservation['observationKind']='request-call'):CallObservation|undefined {
  if(result.calls.length>=128){if(!result.issues.includes('call-count-limit'))result.issues.push('call-count-limit');return;}
  const range=node.range(),line=range.start.line+1;
  const excerpt=source.split(/\r\n|\n|\r/).slice(line-1,range.end.line+1).join('\n');
  if(excerpt.length>2048){if(!result.issues.includes('source-excerpt-limit'))result.issues.push('source-excerpt-limit');return;}
  const call:CallObservation={line,excerpt,observationKind:kind};result.calls.push(call);return call;
}
export function setUrl(call:CallObservation,node:Syntax|undefined|null) {
  const url=literal(node);
  if(url===undefined){call.reason='dynamic-or-unsupported-url';return;}
  call.url=url;
  // These clients do not share browser URL normalization; avoid inferred rewrites.
  if(/[\\\s\u0000-\u001f\u007f]/.test(url) || /\/\.{1,2}(?:\/|[?#]|$)/.test(url))call.reason='unsupported-url-shape';
}
