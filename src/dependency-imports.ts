import type {Node,Literal,CallExpression,Identifier} from 'acorn';
import {parser} from '@lezer/python';
import {parseHttpSyntax} from './fetch-calls.js';
import {syntaxTree,literal} from './standard-http-syntax.js';
import {preprocessJava} from './java-source.js';
export type ImportObservation={line:number;excerpt:string;specifier?:string;reason?:string};
export function dependencyLanguage(path:string) {
  return /\.[cm]?[jt]sx?$/.test(path)?'javascript':path.endsWith('.py')?'python':path.endsWith('.go')?'go':path.endsWith('.java')?'java':path.endsWith('.cs')?'csharp':undefined;
}
/** Parse declarations only. No target code, compiler, or module loader is executed. */
export function extractDependencyImports(source:string,path:string) {
  const imports:ImportObservation[]=[],issues:string[]=[],language=dependencyLanguage(path);
  const java=language==='java'?preprocessJava(source):undefined;
  if(java?.issues.length)return {imports,issues:java.issues};
  const add=(start:number,end:number,specifier?:string,reason?:string)=>{
    if(java){start=java.starts[start] ?? source.length;end=java.ends[end-1] ?? start;}
    if(imports.length>=128){if(!issues.includes('import-count-limit'))issues.push('import-count-limit');return;}
    const excerpt=source.slice(start,end),line=source.slice(0,start).split(/\r\n|\n|\r/).length;
    if(excerpt.length>2048){issues.push('import-excerpt-limit');return;}
    imports.push({line,excerpt,...(specifier===undefined?{}:{specifier}),...(reason?{reason}:{})});
  };
  if(!java && /\r(?!\n)/.test(source))return {imports,issues:['unsupported-line-endings']};
  if(language==='javascript') {
    const parsed=parseHttpSyntax(source,/\.tsx$/.test(path)?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript');
    issues.push(...parsed.issues);
    const ambiguousRequire=parsed.nodes.some(({node,parent})=>node.type==='Identifier' && (node as Identifier).name==='require'
      && !(parent?.type==='CallExpression' && (parent as CallExpression).callee===node));
    for(const {node} of parsed.nodes.sort((a,b)=>a.node.start-b.node.start)) {
      let value:Node|undefined,reason:string|undefined;
      if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type))value=(node as Node & {source?:Node}).source;
      else if(node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='require') {
        value=(node as CallExpression).arguments[0];reason=ambiguousRequire?'require-binding-or-alias-unresolved':undefined;
        if(!value){add(node.start,node.end,undefined,'missing-module-specifier');continue;}
      } else if(node.type==='TSExternalModuleReference')value=(node as Node & {expression:Node}).expression;
      if(value) add(node.start,node.end,value.type==='Literal' && typeof (value as Literal).value==='string'?(value as Literal).value as string:undefined,reason);
    }
    if(ambiguousRequire)issues.push('require-binding-or-alias-unresolved');
  } else if(language==='python') {
    const tree=parser.parse(source),cursor=tree.cursor();
    do {if(cursor.type.isError)issues.push('unsupported-or-invalid-python');}while(cursor.next());
    if(issues.length)return {imports,issues:[...new Set(issues)]};
    const walk=tree.cursor();
    do {if(walk.name!=='ImportStatement')continue;
      const children=[];for(let child=walk.node.firstChild;child;child=child.nextSibling)children.push(child);
      const tokens=children.map(n=>source.slice(n.from,n.to));
      if(tokens[0]==='from') {
        const stop=tokens.indexOf('import'),specifier=tokens.slice(1,stop).join('');
        add(walk.from,walk.to,specifier,/^\.+$/.test(specifier)?'relative-member-import-unresolved':undefined);
      } else {
        let parts:string[]=[];
        for(const token of [...tokens.slice(1),',']) {if(token===','){add(walk.from,walk.to,parts.slice(0,parts.indexOf('as')<0?parts.length:parts.indexOf('as')).join(''));parts=[];}else parts.push(token);}
      }
    }while(walk.next());
  } else if(language) {
    const parsed=syntaxTree(language,java?.text ?? source);issues.push(...parsed.issues);
    for(const node of parsed.nodes) {
      if(language==='go' && node.kind()==='import_spec')add(node.range().start.index,node.range().end.index,literal(node.field('path')));
      if(language==='java' && node.kind()==='import_declaration') {
        const text=node.text(),match=/^import\s+([\w.]+)\s*;$/.exec(text);
        add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'static-wildcard-or-unsupported-import');
      }
      if(language==='csharp' && node.kind()==='using_directive') {
        const match=/^using\s+([\w.]+)\s*;$/.exec(node.text());
        add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'alias-static-global-or-unsupported-using');
      }
    }
  } else issues.push('unsupported-language');
  return {imports,issues};
}
