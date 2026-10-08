# src/dependency-imports.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

This syntax-only extractor branches by source extension. JS handles import/export/dynamic import and unambiguous require; Python handles parsed import statements; native grammars provide Go imports, ordinary Java imports and ordinary C# using directives. Java's translated offsets map back to raw source. Bounded observations preserve unsupported constructs instead of pretending a complete dependency graph exists.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `be74d7045f263e96b49093aafcd967cbe830abc35c065c7e929ef1f3888636cf`.

This chapter inventories **6 function bodies/callbacks**, **27 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>acorn</code>: <code>Node</code> (type only), <code>Literal</code> (type only), <code>CallExpression</code> (type only), <code>Identifier</code> (type only).
- <code>@lezer/python</code>: <code>parser</code>.
- <code>./fetch-calls.js</code>: <code>parseHttpSyntax</code>.
- <code>./standard-http-syntax.js</code>: <code>syntaxTree</code>, <code>literal</code>.
- <code>./java-source.js</code>: <code>preprocessJava</code>.

## Module execution


## Function index

- [dependencyLanguage (7:8)](#fn-366)
- [extractDependencyImports (11:8)](#fn-684)
- [add (15:13)](#fn-979)
- [parsed.nodes.some callback (26:46)](#fn-1838)
- [parsed.nodes.sort callback (28:43)](#fn-2053)
- [children.map callback (45:33)](#fn-3533)

<a id="fn-366"></a>
### dependencyLanguage (7:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L8](#l8) Return to the caller: test <code>/\.[cm]?[jt]sx?$/.test(path)</code>; choose <code>'javascript'</code> when truthy, otherwise <code>path.endsWith('.py')?'python':path.endsWith('.go')?'go':path.endsWith('.java')?'java':path.endsWith('.cs')?'csharp':undefined</code>.

<a id="fn-684"></a>
### extractDependencyImports (11:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>imports:ImportObservation[]</code>: create a new empty array to accumulate ordered results.
- [L12](#l12) <code>issues:string[]</code>: create a new empty array to accumulate ordered results.
- [L12](#l12) <code>language</code>: call the named operation with the supplied arguments: <code>dependencyLanguage(path)</code>.
- [L13](#l13) <code>java</code>: test <code>language==='java'</code>; choose <code>preprocessJava(source)</code> when truthy, otherwise <code>undefined</code>.
- [L15](#l15) <code>add</code>: create [add (15:13)](#fn-979); its body runs when called, not when this value is created.
- [L24](#l24) <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,/\.tsx$/.test(path)?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript')</code>.
- [L26](#l26) <code>ambiguousRequire</code>: stop at the first truthy callback result, returning whether any matched: <code>parsed.nodes.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; (node as Identifier).name==='require' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node))</code>.
- [L28](#l28) <code>{node}</code>: receive the next iterable value from <code>parsed.nodes.sort((a,b)=&gt;a.node.start-b.node.start)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L29](#l29) <code>value:Node&#124;undefined</code>: leave the value undefined until a later assignment.
- [L29](#l29) <code>reason:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L39](#l39) <code>tree</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>parser.parse(source)</code>.
- [L39](#l39) <code>cursor</code>: call the named operation with the supplied arguments: <code>tree.cursor()</code>.
- [L42](#l42) <code>walk</code>: call the named operation with the supplied arguments: <code>tree.cursor()</code>.
- [L44](#l44) <code>children</code>: create a new empty array to accumulate ordered results.
- [L44](#l44) <code>child</code>: read <code>walk.node.firstChild</code>.
- [L45](#l45) <code>tokens</code>: transform each element into a new array: <code>children.map(n=&gt;source.slice(n.from,n.to))</code>.
- [L47](#l47) <code>stop</code>: call the named operation with the supplied arguments: <code>tokens.indexOf('import')</code>.
- [L47](#l47) <code>specifier</code>: concatenate the elements with the supplied separator: <code>tokens.slice(1,stop).join('')</code>.
- [L50](#l50) <code>parts:string[]</code>: create a new empty array to accumulate ordered results.
- [L51](#l51) <code>token</code>: receive the next iterable value from <code>[...tokens.slice(1),',']</code> at the start of each loop iteration.
- [L55](#l55) <code>parsed</code>: call the named operation with the supplied arguments: <code>syntaxTree(language,java?.text ?? source)</code>.
- [L56](#l56) <code>node</code>: receive the next iterable value from <code>parsed.nodes</code> at the start of each loop iteration.
- [L59](#l59) <code>text</code>: call the named operation with the supplied arguments: <code>node.text()</code>.
- [L59](#l59) <code>match</code>: call the named operation with the supplied arguments: <code>/^import\s+([\w.]+)\s*;$/.exec(text)</code>.
- [L63](#l63) <code>match</code>: call the named operation with the supplied arguments: <code>/^using\s+([\w.]+)\s*;$/.exec(node.text())</code>.

Execution:

- [L12](#l12) Bind <code>imports:ImportObservation[]</code>: create a new empty array to accumulate ordered results.
- [L12](#l12) Bind <code>issues:string[]</code>: create a new empty array to accumulate ordered results.
- [L12](#l12) Bind <code>language</code>: call the named operation with the supplied arguments: <code>dependencyLanguage(path)</code>.
- [L13](#l13) Bind <code>java</code>: test <code>language==='java'</code>; choose <code>preprocessJava(source)</code> when truthy, otherwise <code>undefined</code>.
- [L14](#l14) If <code>java?.issues.length</code> is truthy:
  - [L14](#l14) Return to the caller: create an object with 2 property/spread entries: <code>{imports,issues:java.issues}</code>; later properties overwrite earlier spread values.
- [L15](#l15) Bind <code>add</code>: create [add (15:13)](#fn-979); its body runs when called, not when this value is created.
- [L22](#l22) If <code>!java &amp;&amp; /\r(?!\n)/.test(source)</code> is truthy:
  - [L22](#l22) Return to the caller: create an object with 2 property/spread entries: <code>{imports,issues:['unsupported-line-endings']}</code>; later properties overwrite earlier spread values.
- [L23](#l23) If <code>language==='javascript'</code> is truthy:
  - [L24](#l24) Bind <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,/\.tsx$/.test(path)?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript')</code>.
  - [L25](#l25) append values to the existing array: <code>issues.push(...parsed.issues)</code>.
  - [L26](#l26) Bind <code>ambiguousRequire</code>: stop at the first truthy callback result, returning whether any matched: <code>parsed.nodes.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; (node as Identifier).name==='require' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node))</code>.
  - [L28](#l28) Iterate <code>parsed.nodes.sort((a,b)=&gt;a.node.start-b.node.start)</code> values, binding <code>const {node}</code> for each iteration:
    - [L29](#l29) Bind <code>value:Node&#124;undefined</code>: leave the value undefined until a later assignment.
    - [L29](#l29) Bind <code>reason:string&#124;undefined</code>: leave the value undefined until a later assignment.
    - [L30](#l30) If <code>['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type)</code> is truthy:
      - [L30](#l30) update <code>value</code> with <code>(node as Node &amp; {source?:Node}).source</code> using <code>=</code>; this mutation is visible to later statements.
    - [L30](#l30) Otherwise:
      - [L31](#l31) If <code>node.type==='CallExpression' &amp;&amp; (node as CallExpression).callee.type==='Identifier' &amp;&amp; ((node as CallExpression).callee as Identifier).name==='require'</code> is truthy:
        - [L32](#l32) update <code>value</code> with <code>(node as CallExpression).arguments[0]</code> using <code>=</code>; this mutation is visible to later statements.
        - [L32](#l32) update <code>reason</code> with <code>ambiguousRequire?'require-binding-or-alias-unresolved':undefined</code> using <code>=</code>; this mutation is visible to later statements.
        - [L33](#l33) If <code>!value</code> is truthy:
          - [L33](#l33) call the named operation with the supplied arguments: <code>add(node.start,node.end,undefined,'missing-module-specifier')</code>.
          - [L33](#l33) Skip the rest of this iteration and advance the enclosing loop.
      - [L31](#l31) Otherwise:
        - [L34](#l34) If <code>node.type==='TSExternalModuleReference'</code> is truthy:
          - [L34](#l34) update <code>value</code> with <code>(node as Node &amp; {expression:Node}).expression</code> using <code>=</code>; this mutation is visible to later statements.
    - [L35](#l35) If <code>value</code> is truthy:
      - [L35](#l35) call the named operation with the supplied arguments: <code>add(node.start,node.end,value.type==='Literal' &amp;&amp; typeof (value as Literal).value==='string'?(value as Literal).value as string:undefined,reason)</code>.
  - [L37](#l37) If <code>ambiguousRequire</code> is truthy:
    - [L37](#l37) append values to the existing array: <code>issues.push('require-binding-or-alias-unresolved')</code>.
- [L23](#l23) Otherwise:
  - [L38](#l38) If <code>language==='python'</code> is truthy:
    - [L39](#l39) Bind <code>tree</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>parser.parse(source)</code>.
    - [L39](#l39) Bind <code>cursor</code>: call the named operation with the supplied arguments: <code>tree.cursor()</code>.
    - [L40](#l40) Repeat at least once, then while <code>cursor.next()</code>:
      - [L40](#l40) If <code>cursor.type.isError</code> is truthy:
        - [L40](#l40) append values to the existing array: <code>issues.push('unsupported-or-invalid-python')</code>.
    - [L41](#l41) If <code>issues.length</code> is truthy:
      - [L41](#l41) Return to the caller: create an object with 2 property/spread entries: <code>{imports,issues:[...new Set(issues)]}</code>; later properties overwrite earlier spread values.
    - [L42](#l42) Bind <code>walk</code>: call the named operation with the supplied arguments: <code>tree.cursor()</code>.
    - [L43](#l43) Repeat at least once, then while <code>walk.next()</code>:
      - [L43](#l43) If <code>walk.name!=='ImportStatement'</code> is truthy:
        - [L43](#l43) Skip the rest of this iteration and advance the enclosing loop.
      - [L44](#l44) Bind <code>children</code>: create a new empty array to accumulate ordered results.
      - [L44](#l44) Initialize <code>let child=walk.node.firstChild</code>; repeat while <code>child</code>; after each normal iteration evaluate <code>child=child.nextSibling</code>:
        - [L44](#l44) append values to the existing array: <code>children.push(child)</code>.
      - [L45](#l45) Bind <code>tokens</code>: transform each element into a new array: <code>children.map(n=&gt;source.slice(n.from,n.to))</code>.
      - [L46](#l46) If <code>tokens[0]==='from'</code> is truthy:
        - [L47](#l47) Bind <code>stop</code>: call the named operation with the supplied arguments: <code>tokens.indexOf('import')</code>.
        - [L47](#l47) Bind <code>specifier</code>: concatenate the elements with the supplied separator: <code>tokens.slice(1,stop).join('')</code>.
        - [L48](#l48) call the named operation with the supplied arguments: <code>add(walk.from,walk.to,specifier,/^\.+$/.test(specifier)?'relative-member-import-unresolved':undefined)</code>.
      - [L46](#l46) Otherwise:
        - [L50](#l50) Bind <code>parts:string[]</code>: create a new empty array to accumulate ordered results.
        - [L51](#l51) Iterate <code>[...tokens.slice(1),',']</code> values, binding <code>const token</code> for each iteration:
          - [L51](#l51) If <code>token===','</code> is truthy:
            - [L51](#l51) call the named operation with the supplied arguments: <code>add(walk.from,walk.to,parts.slice(0,parts.indexOf('as')&lt;0?parts.length:parts.indexOf('as')).join(''))</code>.
            - [L51](#l51) update <code>parts</code> with <code>[]</code> using <code>=</code>; this mutation is visible to later statements.
          - [L51](#l51) Otherwise:
            - [L51](#l51) append values to the existing array: <code>parts.push(token)</code>.
  - [L38](#l38) Otherwise:
    - [L54](#l54) If <code>language</code> is truthy:
      - [L55](#l55) Bind <code>parsed</code>: call the named operation with the supplied arguments: <code>syntaxTree(language,java?.text ?? source)</code>.
      - [L55](#l55) append values to the existing array: <code>issues.push(...parsed.issues)</code>.
      - [L56](#l56) Iterate <code>parsed.nodes</code> values, binding <code>const node</code> for each iteration:
        - [L57](#l57) If <code>language==='go' &amp;&amp; node.kind()==='import_spec'</code> is truthy:
          - [L57](#l57) call the named operation with the supplied arguments: <code>add(node.range().start.index,node.range().end.index,literal(node.field('path')))</code>.
        - [L58](#l58) If <code>language==='java' &amp;&amp; node.kind()==='import_declaration'</code> is truthy:
          - [L59](#l59) Bind <code>text</code>: call the named operation with the supplied arguments: <code>node.text()</code>.
          - [L59](#l59) Bind <code>match</code>: call the named operation with the supplied arguments: <code>/^import\s+([\w.]+)\s*;$/.exec(text)</code>.
          - [L60](#l60) call the named operation with the supplied arguments: <code>add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'static-wildcard-or-unsupported-import')</code>.
        - [L62](#l62) If <code>language==='csharp' &amp;&amp; node.kind()==='using_directive'</code> is truthy:
          - [L63](#l63) Bind <code>match</code>: call the named operation with the supplied arguments: <code>/^using\s+([\w.]+)\s*;$/.exec(node.text())</code>.
          - [L64](#l64) call the named operation with the supplied arguments: <code>add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'alias-static-global-or-unsupported-using')</code>.
    - [L54](#l54) Otherwise:
      - [L67](#l67) append values to the existing array: <code>issues.push('unsupported-language')</code>.
- [L68](#l68) Return to the caller: create an object with 2 property/spread entries: <code>{imports,issues}</code>; later properties overwrite earlier spread values.

<a id="fn-979"></a>
### add (15:13)

Synchronous function. Lexically inside [extractDependencyImports (11:8)](#fn-684). 

Parameters:

- <code>start:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>end:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>specifier?:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>reason?:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L18](#l18) <code>excerpt</code>: select a range without mutating the original array/string: <code>source.slice(start,end)</code>.
- [L18](#l18) <code>line</code>: read <code>source.slice(0,start).split(/\r\n&#124;\n&#124;\r/).length</code>.

Execution:

- [L16](#l16) If <code>java</code> is truthy:
  - [L16](#l16) update <code>start</code> with <code>java.starts[start] ?? source.length</code> using <code>=</code>; this mutation is visible to later statements.
  - [L16](#l16) update <code>end</code> with <code>java.ends[end-1] ?? start</code> using <code>=</code>; this mutation is visible to later statements.
- [L17](#l17) If <code>imports.length&gt;=128</code> is truthy:
  - [L17](#l17) If <code>!issues.includes('import-count-limit')</code> is truthy:
    - [L17](#l17) append values to the existing array: <code>issues.push('import-count-limit')</code>.
  - [L17](#l17) Return undefined immediately; remaining statements in this function do not execute.
- [L18](#l18) Bind <code>excerpt</code>: select a range without mutating the original array/string: <code>source.slice(start,end)</code>.
- [L18](#l18) Bind <code>line</code>: read <code>source.slice(0,start).split(/\r\n&#124;\n&#124;\r/).length</code>.
- [L19](#l19) If <code>excerpt.length&gt;2048</code> is truthy:
  - [L19](#l19) append values to the existing array: <code>issues.push('import-excerpt-limit')</code>.
  - [L19](#l19) Return undefined immediately; remaining statements in this function do not execute.
- [L20](#l20) append values to the existing array: <code>imports.push({line,excerpt,...(specifier===undefined?{}:{specifier}),...(reason?{reason}:{})})</code>.

<a id="fn-1838"></a>
### parsed.nodes.some callback (26:46)

Synchronous function. Lexically inside [extractDependencyImports (11:8)](#fn-684). Passed to <code>parsed.nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{node,parent}</code>: destructure the supplied value into these local bindings.

Execution:

[L26](#l26) Implicitly return: evaluate <code>node.type==='Identifier' &amp;&amp; (node as Identifier).name==='require' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node)</code> left to right with falsy short-circuiting.

<a id="fn-2053"></a>
### parsed.nodes.sort callback (28:43)

Synchronous function. Lexically inside [extractDependencyImports (11:8)](#fn-684). Passed to <code>parsed.nodes.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: compute <code>a.node.start-b.node.start</code> with the <code>-</code> operator.

<a id="fn-3533"></a>
### children.map callback (45:33)

Synchronous function. Lexically inside [extractDependencyImports (11:8)](#fn-684). Passed to <code>children.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L45](#l45) Implicitly return: select a range without mutating the original array/string: <code>source.slice(n.from,n.to)</code>.

## Compile-time data contracts

### ImportObservation

```typescript
type ImportObservation={line:number;excerpt:string;specifier?:string;reason?:string};
```

Declared at [L6](#l6). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Directly importing tests

- [architecture-audit.test.ts](../../test/architecture-audit.test.ts)
- [java-source.test.ts](../../test/java-source.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import type {Node,Literal,CallExpression,Identifier} from 'acorn';
   2 | import {parser} from '@lezer/python';
   3 | import {parseHttpSyntax} from './fetch-calls.js';
   4 | import {syntaxTree,literal} from './standard-http-syntax.js';
   5 | import {preprocessJava} from './java-source.js';
   6 | export type ImportObservation={line:number;excerpt:string;specifier?:string;reason?:string};
   7 | export function dependencyLanguage(path:string) {
   8 |   return /\.[cm]?[jt]sx?$/.test(path)?'javascript':path.endsWith('.py')?'python':path.endsWith('.go')?'go':path.endsWith('.java')?'java':path.endsWith('.cs')?'csharp':undefined;
   9 | }
  10 | /** Parse declarations only. No target code, compiler, or module loader is executed. */
  11 | export function extractDependencyImports(source:string,path:string) {
  12 |   const imports:ImportObservation[]=[],issues:string[]=[],language=dependencyLanguage(path);
  13 |   const java=language==='java'?preprocessJava(source):undefined;
  14 |   if(java?.issues.length)return {imports,issues:java.issues};
  15 |   const add=(start:number,end:number,specifier?:string,reason?:string)=>{
  16 |     if(java){start=java.starts[start] ?? source.length;end=java.ends[end-1] ?? start;}
  17 |     if(imports.length>=128){if(!issues.includes('import-count-limit'))issues.push('import-count-limit');return;}
  18 |     const excerpt=source.slice(start,end),line=source.slice(0,start).split(/\r\n|\n|\r/).length;
  19 |     if(excerpt.length>2048){issues.push('import-excerpt-limit');return;}
  20 |     imports.push({line,excerpt,...(specifier===undefined?{}:{specifier}),...(reason?{reason}:{})});
```

<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   };
  22 |   if(!java && /\r(?!\n)/.test(source))return {imports,issues:['unsupported-line-endings']};
  23 |   if(language==='javascript') {
  24 |     const parsed=parseHttpSyntax(source,/\.tsx$/.test(path)?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript');
  25 |     issues.push(...parsed.issues);
  26 |     const ambiguousRequire=parsed.nodes.some(({node,parent})=>node.type==='Identifier' && (node as Identifier).name==='require'
  27 |       && !(parent?.type==='CallExpression' && (parent as CallExpression).callee===node));
  28 |     for(const {node} of parsed.nodes.sort((a,b)=>a.node.start-b.node.start)) {
  29 |       let value:Node|undefined,reason:string|undefined;
  30 |       if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','ImportExpression'].includes(node.type))value=(node as Node & {source?:Node}).source;
  31 |       else if(node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='require') {
  32 |         value=(node as CallExpression).arguments[0];reason=ambiguousRequire?'require-binding-or-alias-unresolved':undefined;
  33 |         if(!value){add(node.start,node.end,undefined,'missing-module-specifier');continue;}
  34 |       } else if(node.type==='TSExternalModuleReference')value=(node as Node & {expression:Node}).expression;
  35 |       if(value) add(node.start,node.end,value.type==='Literal' && typeof (value as Literal).value==='string'?(value as Literal).value as string:undefined,reason);
  36 |     }
  37 |     if(ambiguousRequire)issues.push('require-binding-or-alias-unresolved');
  38 |   } else if(language==='python') {
  39 |     const tree=parser.parse(source),cursor=tree.cursor();
  40 |     do {if(cursor.type.isError)issues.push('unsupported-or-invalid-python');}while(cursor.next());
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     if(issues.length)return {imports,issues:[...new Set(issues)]};
  42 |     const walk=tree.cursor();
  43 |     do {if(walk.name!=='ImportStatement')continue;
  44 |       const children=[];for(let child=walk.node.firstChild;child;child=child.nextSibling)children.push(child);
  45 |       const tokens=children.map(n=>source.slice(n.from,n.to));
  46 |       if(tokens[0]==='from') {
  47 |         const stop=tokens.indexOf('import'),specifier=tokens.slice(1,stop).join('');
  48 |         add(walk.from,walk.to,specifier,/^\.+$/.test(specifier)?'relative-member-import-unresolved':undefined);
  49 |       } else {
  50 |         let parts:string[]=[];
  51 |         for(const token of [...tokens.slice(1),',']) {if(token===','){add(walk.from,walk.to,parts.slice(0,parts.indexOf('as')<0?parts.length:parts.indexOf('as')).join(''));parts=[];}else parts.push(token);}
  52 |       }
  53 |     }while(walk.next());
  54 |   } else if(language) {
  55 |     const parsed=syntaxTree(language,java?.text ?? source);issues.push(...parsed.issues);
  56 |     for(const node of parsed.nodes) {
  57 |       if(language==='go' && node.kind()==='import_spec')add(node.range().start.index,node.range().end.index,literal(node.field('path')));
  58 |       if(language==='java' && node.kind()==='import_declaration') {
  59 |         const text=node.text(),match=/^import\s+([\w.]+)\s*;$/.exec(text);
  60 |         add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'static-wildcard-or-unsupported-import');
```

<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l67"></a>
<a id="l68"></a>

```text
  61 |       }
  62 |       if(language==='csharp' && node.kind()==='using_directive') {
  63 |         const match=/^using\s+([\w.]+)\s*;$/.exec(node.text());
  64 |         add(node.range().start.index,node.range().end.index,match?.[1],match?undefined:'alias-static-global-or-unsupported-using');
  65 |       }
  66 |     }
  67 |   } else issues.push('unsupported-language');
  68 |   return {imports,issues};
  69 | }
  70 | 
```
