import {syntaxTree,named,same,observation,setUrl,type Syntax} from './standard-http-syntax.js';
import type {CallExtraction} from './contract-adapter-types.js';

export function extractCsharpCalls(source:string):CallExtraction {
  const {nodes,issues}=syntaxTree('csharp',source),result:CallExtraction={calls:[],issues};if(issues.length)return result;
  if(nodes.some(n=>String(n.kind()).startsWith('preproc_'))){result.issues.push('conditional-compilation-unresolved');return result;}
  const imported=nodes.some(n=>n.kind()==='using_directive' && n.text().replace(/\s/g,'')==='usingSystem.Net.Http;');
  const shadowed=nodes.some(n=>['using_directive','class_declaration','struct_declaration','record_declaration','interface_declaration','type_parameter','variable_declarator','parameter'].includes(String(n.kind())) && n.field('name')?.text()==='HttpClient');
  const constructor=(n:Syntax|null|undefined)=>n?.kind()==='object_creation_expression' && (n.field('type')?.text()==='System.Net.Http.HttpClient' || imported && !shadowed && n.field('type')?.text()==='HttpClient');
  const plain=(n:Syntax)=>constructor(n) && n.field('arguments')?.kind()==='argument_list' && named(n.field('arguments')).length===0 && named(n).length===2;
  const bindings=new Map<string,{declaration:Syntax;creation:Syntax;valid:boolean}>();
  for(const node of nodes.filter(n=>n.kind()==='variable_declarator')) {
    const name=node.field('name'),creation=named(node).find(constructor);
    if(!name || !creation || node.parent()?.parent()?.kind()!=='local_declaration_statement')continue;
    const old=bindings.has(name.text());
    bindings.set(name.text(),{declaration:node,creation,valid:!old && plain(creation)});
  }
  for(const [name,binding] of bindings)for(const node of nodes.filter(n=>n.kind()==='identifier' && n.text()===name)) {
    if(same(node,binding.declaration.field('name')))continue;
    const parent=node.parent();
    if(parent?.kind()==='member_access_expression' && same(parent.field('expression'),node) && parent.parent()?.kind()==='invocation_expression' && same(parent.parent()?.field('function'),parent))continue;
    binding.valid=false;
  }
  const verbs:Record<string,string>={GetAsync:'GET',GetStringAsync:'GET',GetByteArrayAsync:'GET',GetStreamAsync:'GET',PostAsync:'POST',PutAsync:'PUT',PatchAsync:'PATCH',DeleteAsync:'DELETE'};
  for(const node of nodes.filter(n=>n.kind()==='invocation_expression')) {
    const fn=node.field('function');if(fn?.kind()!=='member_access_expression')continue;
    const receiver=fn.field('expression'),method=fn.field('name')?.text() ?? '';
    const binding=receiver?.kind()==='identifier'?bindings.get(receiver.text()):undefined;
    if(!constructor(receiver) && !binding && !Object.hasOwn(verbs,method) && method!=='SendAsync')continue;
    const call=observation(result,node,source);if(!call)continue;
    const block=(n:Syntax)=>n.ancestors().find(a=>a.kind()==='block');
    if(!(receiver && plain(receiver)) && !(binding?.valid && same(block(binding.declaration),block(node)) && binding.declaration.range().end.index<node.range().start.index)) {
      call.reason='httpclient-binding-or-configuration-unresolved';continue;
    }
    if(!Object.hasOwn(verbs,method)){call.reason='unsupported-httpclient-operation';continue;}
    const args=named(node.field('arguments'));
    const body=['POST','PUT','PATCH'].includes(verbs[method]!);
    if(args.length!==(body?2:1) || args.some(arg=>named(arg).length!==1)) {call.reason='unsupported-arguments';continue;}
    call.method=verbs[method]!;setUrl(call,named(args[0])[0]);
  }
  return result;
}
