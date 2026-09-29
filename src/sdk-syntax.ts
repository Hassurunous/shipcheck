import {parseHttpSyntax} from './fetch-calls.js';

// Narrow ESTree/Babel projection; only discriminated shapes below are interpreted.
type Ast={type:string;start:number;end:number;name?:string;value?:unknown;optional?:boolean;importKind?:string;
  source?:Ast;declaration?:Ast;id?:Ast;params?:Ast[];typeParameters?:unknown;typeAnnotation?:Ast;
  specifiers?:Ast[];imported?:Ast;local?:Ast;callee?:Ast;arguments?:Ast[];expression?:Ast;argument?:Ast;operator?:string};
type Primitive='string'|'number'|'boolean';
const primitiveKinds:Record<string,Primitive|undefined>={TSStringKeyword:'string',TSNumberKeyword:'number',TSBooleanKeyword:'boolean'};
type Signature={line:number;excerpt:string;parameters:{kind:Primitive|undefined;optional:boolean}[];supported:boolean};
export type SdkIndex={symbols:Map<string,Signature[]>;complete:boolean;issues:string[]};
const evidence=(source:string,node:Ast)=>({line:source.slice(0,node.start).split(/\r\n|\n|\r/).length,excerpt:source.slice(node.start,node.end)});
export function indexSdkDeclarations(source:string):SdkIndex {
  const parsed=parseHttpSyntax(source,'typescript');
  const result:SdkIndex={symbols:new Map(),complete:!parsed.issues.length,issues:[...parsed.issues]};
  let signatureCount=0;
  for(const entry of parsed.nodes) {
    if(entry.parent?.type!=='Program')continue;
    const node=entry.node as unknown as Ast;
    if(node.type==='ExportNamedDeclaration' && node.declaration?.type==='TSDeclareFunction') {
      const fn=node.declaration,name=fn.id?.name;
      if(!name){result.complete=false;continue;}
      if(++signatureCount>256 || (result.symbols.get(name)?.length ?? 0)>=16) {
        result.symbols.clear();result.complete=false;result.issues.push('declaration-count-limit');break;
      }
      const parameters=(fn.params ?? []).map(p=>({kind:primitiveKinds[p.typeAnnotation?.typeAnnotation?.type ?? ''],optional:p.optional===true}));
      const cite=evidence(source,node);
      const supported=!fn.typeParameters && cite.excerpt.length<=2048 && (fn.params ?? []).every(p=>p.type==='Identifier' && p.name!=='this')
        && parameters.every(p=>p.kind!==undefined) && parameters.every((p,i)=>p.optional || !parameters.slice(0,i).some(before=>before.optional));
      result.symbols.set(name,[...(result.symbols.get(name) ?? []),{...cite,parameters,supported}]);
    } else if(['ExportNamedDeclaration','ExportAllDeclaration','ExportDefaultDeclaration','TSExportAssignment','TSModuleDeclaration'].includes(node.type)) {
      result.complete=false;result.issues.push('unsupported-declaration-export');
    }
  }
  if(!result.symbols.size){result.complete=false;result.issues.push('no-supported-function-declarations');}
  if(/\/\/\/\s*<reference\b/.test(source)){result.complete=false;result.issues.push('declaration-reference-unresolved');}
  return result;
}
type Call={line:number;excerpt:string;symbol:string;status:'matched'|'mismatch'|'unresolved';reason:string;providerEvidence:{line:number;excerpt:string}[]};
function primitive(node:Ast):Primitive|undefined {
  while(['TSAsExpression','TSTypeAssertion','TSNonNullExpression','TSSatisfiesExpression'].includes(node.type) && node.expression)node=node.expression;
  if(node.type==='Literal' && ['string','number','boolean'].includes(typeof node.value))return typeof node.value as Primitive;
  if(node.type==='UnaryExpression' && ['+','-'].includes(node.operator!) && node.argument?.type==='Literal' && typeof node.argument.value==='number')return 'number';
}
export function compareSdkCalls(source:string,path:string,packageName:string,index:SdkIndex) {
  const parsed=parseHttpSyntax(source,path.endsWith('.tsx')?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript');
  const entries=parsed.nodes as unknown as {node:Ast;parent?:Ast}[];
  const issues=[...parsed.issues],calls:Call[]=[],bindings=new Map<string,string>();
  for(const {node} of entries) {
    if(node.type==='ImportDeclaration' && node.source?.value===packageName) {
      for(const spec of node.specifiers ?? []) {
        if(node.importKind==='type' || spec.importKind==='type' || spec.type!=='ImportSpecifier' || !spec.local?.name || !spec.imported?.name)issues.push('unsupported-sdk-import');
        else bindings.set(spec.local.name,spec.imported.name);
      }
    }
    if(node.type==='ImportExpression' || node.type==='CallExpression' && node.callee?.name==='require' && node.arguments?.[0]?.value===packageName)issues.push('dynamic-or-commonjs-sdk-import');
  }
  const ambiguous=new Set([...bindings.keys()].filter(name=>entries.some(({node,parent})=>node.type==='Identifier' && node.name===name
    && !(parent?.type==='ImportSpecifier') && !(parent?.type==='CallExpression' && parent.callee===node))));
  if(ambiguous.size)issues.push('sdk-binding-or-alias-unresolved');
  for(const {node} of entries.sort((a,b)=>a.node.start-b.node.start)) {
    if(node.type!=='CallExpression' || node.callee?.type!=='Identifier' || !bindings.has(node.callee.name!))continue;
    if(calls.length>=128){issues.push('sdk-call-count-limit');break;}
    const cite=evidence(source,node);if(cite.excerpt.length>2048){issues.push('source-excerpt-limit');continue;}
    const symbol=bindings.get(node.callee.name!)!,signatures=index.symbols.get(symbol);
    const call:Call={...cite,symbol,status:'unresolved',reason:'Unsupported or dynamic call/declaration.',providerEvidence:(signatures ?? []).filter(s=>s.excerpt.length<=2048).map(s=>({line:s.line,excerpt:s.excerpt}))};calls.push(call);
    if(ambiguous.has(node.callee.name!) || node.optional)continue;
    if(!signatures) {if(index.complete){call.status='mismatch';call.reason='Named function is absent from the complete supported declaration index.';}continue;}
    const args=node.arguments ?? [],types=args.map(primitive);
    if(args.some(a=>a.type==='SpreadElement'))continue;
    const compatible=signatures.filter(s=>s.supported && args.length>=s.parameters.filter(p=>!p.optional).length && args.length<=s.parameters.length);
    if(compatible.some(s=>types.every((kind,i)=>kind!==undefined && s.parameters[i]!.kind===kind))) {call.status='matched';call.reason='Direct named function, arity and literal primitive argument types match a declared overload; runtime behavior and return values are not assessed.';}
    else if(signatures.every(s=>s.supported) && (!compatible.length || types.every(t=>t!==undefined))) {call.status='mismatch';call.reason=compatible.length?'Literal argument types do not match any supported overload.':'Argument count does not match any supported overload.';}
  }
  if(!calls.length)issues.push('no-supported-sdk-calls');
  return {calls,issues:[...new Set(issues)]};
}
