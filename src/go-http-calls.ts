import {syntaxTree,named,same,literal,observation,setUrl,type Syntax} from './standard-http-syntax.js';
import type {CallExtraction} from './contract-adapter-types.js';

export function extractGoCalls(source:string):CallExtraction {
  const {nodes,issues}=syntaxTree('go',source),result:CallExtraction={calls:[],issues};
  if(issues.length)return result;
  const imports=nodes.filter(node=>node.kind()==='import_spec' && literal(node.field('path'))==='net/http');
  const aliases=new Set(imports.map(node=>node.field('name')?.text() ?? 'http'));
  if(!imports.length){result.issues.push('net-http-import-not-established');return result;}
  if(imports.length!==1 || aliases.has('.') || aliases.has('_')){result.issues.push('unsupported-net-http-import');return result;}
  const ambiguous=nodes.some(node=>node.kind()==='identifier' && aliases.has(node.text()) &&
    !(node.parent()?.kind()==='selector_expression' && same(node.parent()?.field('operand'),node)));
  if(ambiguous)result.issues.push('net-http-binding-unresolved');
  const rootAlias=(node:Syntax|null):boolean=>{
    while(node?.kind()==='selector_expression')node=node.field('operand');
    return !!node && aliases.has(node.text());
  };
  for(const node of nodes.filter(n=>n.kind()==='call_expression')) {
    const fn=node.field('function');
    if(fn?.kind()!=='selector_expression' || !rootAlias(fn.field('operand')))continue;
    const method=fn.field('field')?.text() ?? '',args=named(node.field('arguments'));
    const construction=['NewRequest','NewRequestWithContext'].includes(method);
    const call=observation(result,node,source,construction?'request-construction':'request-call');if(!call)continue;
    if(ambiguous || !aliases.has(fn.field('operand')?.text() ?? '')){call.reason='net-http-binding-or-client-unresolved';continue;}
    if(['Get','Head','Post','PostForm'].includes(method)) {
      const count=method==='Post'?3:method==='PostForm'?2:1;
      if(args.length!==count){call.reason='unsupported-arguments';continue;}
      call.method=method==='Head'?'HEAD':method==='Get'?'GET':'POST';setUrl(call,args[0]);
    } else if(construction) {
      const offset=method==='NewRequestWithContext'?1:0;
      if(args.length!==3+offset){call.reason='unsupported-arguments';continue;}
      const value=args[offset]!;let verb=literal(value);
      if(value.kind()==='selector_expression' && aliases.has(value.field('operand')?.text() ?? '')) {
        const constant=value.field('field')?.text();
        const constants:Record<string,string>={MethodGet:'GET',MethodHead:'HEAD',MethodPost:'POST',MethodPut:'PUT',MethodPatch:'PATCH',MethodDelete:'DELETE',MethodOptions:'OPTIONS'};
        verb=constant && Object.hasOwn(constants,constant)?constants[constant]:undefined;
      }
      if(verb===undefined){call.reason='dynamic-method';continue;}
      call.method=verb===''?'GET':verb;setUrl(call,args[offset+1]);
    }else call.reason='unsupported-net-http-operation';
  }
  return result;
}
