import {parser} from '@lezer/python';
import type {SyntaxNode} from '@lezer/common';
import type {CallExtraction,CallObservation} from './contract-adapter-types.js';

const children=(node:SyntaxNode):SyntaxNode[]=>{
  const result:SyntaxNode[]=[];
  for(let child=node.firstChild;child;child=child.nextSibling)if(child.name!=='Comment')result.push(child);
  return result;
};
const same=(a:SyntaxNode|undefined|null,b:SyntaxNode|undefined|null)=>!!a && !!b && a.from===b.from && a.to===b.to && a.name===b.name;
const verbs=new Set(['get','post','put','patch','delete','head','options','request']);

/** Bundled Python syntax parsing only; no interpreter, imports or repository execution. */
export function extractPythonCalls(content:string):CallExtraction {
  const result:CallExtraction={calls:[],issues:[]};
  let root:SyntaxNode;try{root=parser.parse(content).topNode;}catch{return {calls:[],issues:['unsupported-or-invalid-python']};}
  const nodes:SyntaxNode[]=[],stack=[root];
  while(stack.length){const node=stack.pop()!;nodes.push(node);stack.push(...children(node));}
  if(nodes.some(n=>n.type.isError))return {calls:[],issues:['unsupported-or-invalid-python']};
  const text=(node:SyntaxNode)=>content.slice(node.from,node.to);
  // Deliberately reject escapes, prefixes and concatenation rather than guess Python values.
  const literal=(node:SyntaxNode|undefined):string|undefined=>{
    if(node?.name!=='String')return undefined;
    const value=text(node);
    if(!/^(['"])[^\r\n\\]*\1$/.test(value) || value.startsWith('"""') || value.startsWith("'''"))return undefined;
    return value.slice(1,-1);
  };
  const imports=new Map<string,{node:SyntaxNode;library:string}>();
  for(const node of nodes.filter(n=>n.name==='ImportStatement')) {
    const parts=children(node),values=parts.map(text);
    if(values[0]==='import' && ['requests','httpx'].includes(values[1] ?? '') && (parts.length===2 || parts.length===4 && values[2]==='as') && node.parent?.name==='Script') {
      const alias=values[3] ?? values[1]!;
      if(imports.has(alias))result.issues.push('duplicate-requests-import');
      imports.set(alias,{node,library:values[1]!});
    } else if(values.includes('requests') || values.includes('httpx'))result.issues.push('unsupported-requests-import');
    const modules=values[0]==='from'?values.slice(1,2):values.filter((_value,i)=>i===1 || values[i-1]===',');
    if(modules.some(value=>['aiohttp','urllib','http'].includes(value.split('.')[0]!)))result.issues.push('unsupported-python-http-client');
  }
  const aliases=new Set(['requests','httpx',...imports.keys()]);
  const ambiguous=new Set<string>();
  for(const node of nodes) {
    if(node.name!=='VariableName' || !aliases.has(text(node)))continue;
    const alias=text(node),parent=node.parent;
    if([...imports.values()].some(importNode=>same(parent,importNode.node)))continue;
    if(parent?.name==='MemberExpression' && same(parent.firstChild,node) && parent.parent?.name==='CallExpression' && same(parent.parent.firstChild,parent))continue;
    ambiguous.add(alias);
  }
  // Runtime namespace manipulation prevents reliable module binding inference.
  if(nodes.some(n=>n.name==='CallExpression' && ['exec','eval','globals','locals','setattr','delattr'].includes(text(n.firstChild!))))
    for(const alias of aliases)ambiguous.add(alias);
  if(ambiguous.size)result.issues.push('requests-binding-or-alias-unresolved');
  const constructor=(node:SyntaxNode|undefined)=>{
    if(node?.name!=='CallExpression')return;
    const [callee,args]=children(node);if(callee?.name!=='MemberExpression')return;
    const [receiver,dot,name]=children(callee),imported=receiver?imports.get(text(receiver)):undefined;
    if(!receiver || dot?.name!=='.' || !imported || !name || text(name)!==(imported.library==='requests'?'Session':'Client'))return;
    return {alias:text(receiver),library:imported.library,valid:!ambiguous.has(text(receiver)) && args?.name==='ArgList' && children(args).length===2};
  };
  const scope=(node:SyntaxNode)=>{let current:SyntaxNode|null=node.parent;while(current && !['Body','Script'].includes(current.name))current=current.parent;return current;};
  const sessions=new Map<string,{name:SyntaxNode;creation:SyntaxNode;owner:SyntaxNode|null;library:string;valid:boolean}>();
  for(const node of nodes) {
    const parts=children(node);
    if(node.name==='AssignStatement' && parts.length===3 && parts[0]?.name==='VariableName' && parts[1]?.name==='AssignOp') {
      const creation=parts[2]!,info=constructor(creation);if(!info)continue;
      const name=parts[0];sessions.set(text(name),{name,creation,owner:scope(node),library:info.library,valid:info.valid && !sessions.has(text(name))});
    }else if(node.name==='WithStatement' && parts.length===5 && parts[2]?.name==='as' && parts[3]?.name==='VariableName' && parts[4]?.name==='Body') {
      const creation=parts[1]!,info=constructor(creation);if(!info)continue;
      const name=parts[3];sessions.set(text(name),{name,creation,owner:parts[4],library:info.library,valid:info.valid && !sessions.has(text(name))});
    }
  }
  for(const [name,binding] of sessions)for(const node of nodes.filter(n=>n.name==='VariableName' && text(n)===name)) {
    if(same(node,binding.name))continue;
    const parent=node.parent;
    if(parent?.name==='MemberExpression' && same(parent.firstChild,node) && parent.parent?.name==='CallExpression' && same(parent.parent.firstChild,parent) && (verbs.has(text(children(parent)[2]!)) || text(children(parent)[2]!)==='close'))continue;
    binding.valid=false;
  }
  for(const node of nodes.filter(n=>n.name==='CallExpression').sort((a,b)=>a.from-b.from)) {
    const [callee,args]=children(node);
    if(callee?.name!=='MemberExpression' || args?.name!=='ArgList')continue;
    const member=children(callee),receiver=member[0];
    const session=receiver?.name==='VariableName'?sessions.get(text(receiver)):undefined;
    const inline=constructor(receiver);
    if(!receiver || !session && !inline && (receiver.name!=='VariableName' || !aliases.has(text(receiver))))continue;
    if(constructor(node) && ([...sessions.values()].some(binding=>same(binding.creation,node)) || node.parent?.name==='MemberExpression' && same(node.parent.firstChild,node)))continue;
    const alias=inline?.alias ?? text(receiver),method=member.length===3 && member[1]!.name==='.'?text(member[2]!):'';
    const library=session?.library ?? inline?.library ?? imports.get(alias)?.library ?? 'requests';
    if(session && method==='close' && children(args).length===2)continue;
    if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
    const line=content.slice(0,node.from).split(/\r\n|\n|\r/).length;
    const end=content.slice(0,node.to).split(/\r\n|\n|\r/).length;
    const excerpt=content.split(/\r\n|\n|\r/).slice(line-1,end).join('\n');
    if(excerpt.length>2048){result.issues.push('source-excerpt-limit');continue;}
    const call:CallObservation={line,excerpt};result.calls.push(call);
    const valid=session?session.valid && same(session.owner,scope(node)) && session.creation.to<node.from:inline?inline.valid:imports.has(alias) && !ambiguous.has(alias);
    if(!valid || result.issues.includes('unsupported-requests-import') || result.issues.includes('duplicate-requests-import')){call.reason='requests-binding-or-alias-unresolved';continue;}
    if(!verbs.has(method)){call.reason='unsupported-requests-client';continue;}
    const parts=children(args).slice(1,-1),groups:SyntaxNode[][]=[[]];
    for(const part of parts)if(part.name===',')groups.push([]);else groups.at(-1)!.push(part);
    const positional:SyntaxNode[]=[],keywords=new Map<string,SyntaxNode>();
    let invalid=false,sawKeyword=false;
    for(const group of groups.filter(g=>g.length)) {
      if(group.length===1 && !sawKeyword)positional.push(group[0]!);
      else if(group.length===3 && group[0]!.name==='VariableName' && group[1]!.name==='AssignOp') {
        const key=text(group[0]!);if(keywords.has(key))invalid=true;
        keywords.set(key,group[2]!);sawKeyword=true;
      } else invalid=true;
    }
    const names=method==='request'?['method','url']:method==='get' && library==='requests' && !session && !inline?['url','params']:['url'];
    if(positional.length>names.length)invalid=true;
    positional.forEach((arg,i)=>{const key=names[i];if(key){if(keywords.has(key))invalid=true;keywords.set(key,arg);}});
    const allowed=new Set(['url','params','data','json','headers','cookies','files','auth','timeout',...(library==='requests'?['allow_redirects','proxies','verify','stream','cert']:['content','follow_redirects','verify','trust_env']),...(method==='request'?['method']:[])]);
    if([...keywords.keys()].some(key=>!allowed.has(key)))invalid=true;
    if(library==='httpx' && (['get','head','options','delete'].includes(method) && ['data','json','files','content'].some(key=>keywords.has(key)) || session && ['verify','trust_env'].some(key=>keywords.has(key))))invalid=true;
    if(invalid){call.reason='unsupported-or-dynamic-arguments';continue;}
    const url=literal(keywords.get('url'));
    if(url===undefined){call.reason='dynamic-url';continue;}
    call.url=url;
    // Avoid applying browser URL normalization to Requests-specific URL syntax.
    if(/[\\\s\u0000-\u001f\u007f]/.test(url)){call.reason='unsupported-url-shape';continue;}
    const verb=method==='request'?literal(keywords.get('method')):method;
    if(verb===undefined){call.reason='dynamic-method';continue;}
    call.method=verb.toUpperCase();
    const params=keywords.get('params');
    if(!params || params.name==='None')continue;
    if(params.name!=='DictionaryExpression'){call.reason='dynamic-query-parameters';continue;}
    const entries=children(params).slice(1,-1),queryNames=new Set<string>();
    for(let i=0;i<entries.length;) {
      const key=literal(entries[i]),colon=entries[i+1],value=entries[i+2];
      if(key===undefined || colon?.name!==':' || !value){invalid=true;break;}
      const scalar=literal(value)!==undefined || value.name==='Boolean' || value.name==='Number' && /^\d+(?:\.\d+)?$/.test(text(value));
      if(value.name==='None' && library==='requests')queryNames.delete(key);
      else if(value.name==='None')queryNames.add(key);
      else if(scalar)queryNames.add(key);
      else {invalid=true;break;}
      i+=3;
      if(i<entries.length){if(entries[i]!.name!==','){invalid=true;break;}i++;}
    }
    if(invalid){call.reason='dynamic-query-parameters';continue;}
    call.queryNames=[...queryNames];
  }
  result.issues=[...new Set(result.issues)];return result;
}
