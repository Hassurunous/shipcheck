import {syntaxTree,named,same,literal,observation,setUrl,type Syntax} from './standard-http-syntax.js';
import type {CallExtraction} from './contract-adapter-types.js';

export function extractJavaCalls(source:string):CallExtraction {
  // Java Unicode escapes are processed before tokenization, including within comments.
  if(/\\u+[0-9a-fA-F]{4}/.test(source))return {calls:[],issues:['java-unicode-escape-unresolved']};
  const {nodes,issues}=syntaxTree('java',source),result:CallExtraction={calls:[],issues};if(issues.length)return result;
  const imports=new Set(nodes.filter(n=>n.kind()==='import_declaration').map(n=>n.text().replace(/\s/g,'')));
  const declarations=new Set(nodes.filter(n=>['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map(n=>n.field('name')?.text()));
  const resolved=new Set(['java.net.http.HttpRequest','java.net.URI'].filter(full=>{
    const short=full.split('.').at(-1)!;
    return imports.has('import'+full+';') && !declarations.has(short)
      && ![...imports].some(item=>item.endsWith('.'+short+';') && item!=='import'+full+';');
  }));
  const type=(node:Syntax|null|undefined,short:string,full:string)=>node?.text()===full || node?.text()===short && imports.has('import'+full+';')
    && resolved.has(full);
  for(const seed of nodes.filter(n=>n.kind()==='method_invocation' && n.field('name')?.text()==='newBuilder')) {
    const receiver=seed.field('object');if(!type(receiver,'HttpRequest','java.net.http.HttpRequest'))continue;
    if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
    let outer=seed;const chain:Syntax[]=[seed];
    while(outer.parent()?.kind()==='method_invocation' && same(outer.parent()?.field('object'),outer)){outer=outer.parent()!;chain.push(outer);}
    const call=observation(result,outer,source,'request-construction');if(!call)continue;
    if(chain.at(-1)?.field('name')?.text()!=='build' || named(chain.at(-1)?.field('arguments')).length!==0){call.reason='request-builder-chain-unresolved';continue;}
    const initial=named(seed.field('arguments'));let uri:Syntax|undefined=initial[0],method='GET',unsupported=initial.length>1;
    for(const step of chain.slice(1,-1)) {
      const name=step.field('name')?.text(),args=named(step.field('arguments'));
      if(name==='uri' && args.length===1)uri=args[0];
      else if(['GET','DELETE'].includes(name ?? '') && args.length===0)method=name!;
      else if(['POST','PUT'].includes(name ?? '') && args.length===1)method=name!;
      else if(name==='method' && args.length===2){const verb=literal(args[0]);if(verb===undefined)unsupported=true;else method=verb;}
      else if(!(['header','setHeader'].includes(name ?? '') && args.length===2 || name==='headers' && args.length>0 && args.length%2===0 || ['timeout','version','expectContinue'].includes(name ?? '') && args.length===1))unsupported=true;
    }
    if(unsupported){call.reason='unsupported-builder-step';continue;}
    call.method=method;
    if(uri?.kind()==='method_invocation' && uri.field('name')?.text()==='create' && type(uri.field('object'),'URI','java.net.URI') && named(uri.field('arguments')).length===1)setUrl(call,named(uri.field('arguments'))[0]);
    else if(uri?.kind()==='object_creation_expression' && type(uri.field('type'),'URI','java.net.URI') && named(uri.field('arguments')).length===1)setUrl(call,named(uri.field('arguments'))[0]);
    else call.reason='dynamic-or-unsupported-uri';
  }
  return result;
}
