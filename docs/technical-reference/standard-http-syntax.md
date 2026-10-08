# src/standard-http-syntax.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

syntaxTree lazily loads only fixed packaged native parsers and flattens their nodes. Recovery/error nodes or unsupported line endings stop inference. named removes comment nodes; same compares parser node IDs; literal accepts a restricted set of unescaped strings. observation adds complete-line evidence with count/excerpt caps, and setUrl rejects shapes whose client-specific normalization is uncertain.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `0eac430365ad0e73ed0768d4cb259e7b282c64309d1e6fe3db040067af5e852a`.

This chapter inventories **9 function bodies/callbacks**, **15 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:module</code>: <code>createRequire</code>.
- <code>@ast-grep/napi</code>: <code>SgNode</code> (type only).
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only), <code>CallObservation</code> (type only).

## Module execution

- [L5](#l5) Bind <code>require</code>: call the named operation with the supplied arguments: <code>createRequire(import.meta.url)</code>.
- [L6](#l6) Bind <code>runtime:typeof import('@ast-grep/napi')&#124;undefined</code>: leave the value undefined until a later assignment.
- [L25](#l25) Bind <code>named</code>: create [named (25:20)](#fn-1610); its body runs when called, not when this value is created.
- [L26](#l26) Bind <code>same</code>: create [same (26:19)](#fn-1777); its body runs when called, not when this value is created.

## Function index

- [syntaxTree (8:8)](#fn-396)
- [nodes.some callback (21:19)](#fn-1286)
- [nodes.sort callback (22:30)](#fn-1452)
- [named (25:20)](#fn-1610)
- [inline callback (25:79)](#fn-1669)
- [same (26:19)](#fn-1777)
- [literal (27:8)](#fn-1866)
- [observation (35:8)](#fn-2398)
- [setUrl (42:8)](#fn-3055)

<a id="fn-396"></a>
### syntaxTree (8:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>language:'go'&#124;'csharp'&#124;'java'</code>: supplied by the caller; usage is shown in the steps below.
- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>candidate</code>: call the named operation with the supplied arguments: <code>require('@ast-grep/napi')</code>; the TypeScript assertion adds no runtime validation.
- [L19](#l19) <code>root</code>: call the named operation with the supplied arguments: <code>runtime.parse('shipcheck_'+language,source).root()</code>.
- [L19](#l19) <code>nodes:Syntax[]</code>: create a new empty array to accumulate ordered results.
- [L19](#l19) <code>stack</code>: create an array from <code>[root]</code>; spread elements insert the iterable values.
- [L20](#l20) <code>node</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.

Execution:

- [L10](#l10) If <code>/\r(?!\n)/.test(source)</code> is truthy:
  - [L10](#l10) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['unsupported-line-endings']}</code>; later properties overwrite earlier spread values.
- [L11](#l11) Run the protected block:
  - [L12](#l12) If <code>!runtime</code> is truthy:
    - [L13](#l13) Bind <code>candidate</code>: call the named operation with the supplied arguments: <code>require('@ast-grep/napi')</code>; the TypeScript assertion adds no runtime validation.
    - [L14](#l14) call the named operation with the supplied arguments: <code>candidate.registerDynamicLanguage({shipcheck_go:require('@ast-grep/lang-go'),shipcheck_csharp:require('@ast-grep/lang-csharp'),shipcheck_java:require('@ast-grep/lang-java')})</code>.
    - [L15](#l15) update <code>runtime</code> with <code>candidate</code> using <code>=</code>; this mutation is visible to later statements.
- [L11](#l11) If it throws:
  - [L17](#l17) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['offline-parser-unavailable']}</code>; later properties overwrite earlier spread values.
- [L18](#l18) Run the protected block:
  - [L19](#l19) Bind <code>root</code>: call the named operation with the supplied arguments: <code>runtime.parse('shipcheck_'+language,source).root()</code>.
  - [L19](#l19) Bind <code>nodes:Syntax[]</code>: create a new empty array to accumulate ordered results.
  - [L19](#l19) Bind <code>stack</code>: create an array from <code>[root]</code>; spread elements insert the iterable values.
  - [L20](#l20) Repeat while <code>stack.length</code>:
    - [L20](#l20) Bind <code>node</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.
    - [L20](#l20) append values to the existing array: <code>nodes.push(node)</code>.
    - [L20](#l20) append values to the existing array: <code>stack.push(...node.children())</code>.
  - [L21](#l21) If <code>nodes.some(node=&gt;node.kind()==='ERROR' &#124;&#124; node.id()!==root.id() &amp;&amp; node.text()==='')</code> is truthy:
    - [L21](#l21) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['unsupported-or-invalid-'+language]}</code>; later properties overwrite earlier spread values.
  - [L22](#l22) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:nodes.sort((a,b)=&gt;a.range().start.index-b.range().start.index),issues:[]}</code>; later properties overwrite earlier spread values.
- [L18](#l18) If it throws:
  - [L23](#l23) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['unsupported-or-invalid-'+language]}</code>; later properties overwrite earlier spread values.

<a id="fn-1286"></a>
### nodes.some callback (21:19)

Synchronous function. Lexically inside [syntaxTree (8:8)](#fn-396). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>node</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L21](#l21) Implicitly return: evaluate <code>node.kind()==='ERROR' &#124;&#124; node.id()!==root.id() &amp;&amp; node.text()===''</code> left to right with truthy short-circuiting.

<a id="fn-1452"></a>
### nodes.sort callback (22:30)

Synchronous function. Lexically inside [syntaxTree (8:8)](#fn-396). Passed to <code>nodes.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L22](#l22) Implicitly return: compute <code>a.range().start.index-b.range().start.index</code> with the <code>-</code> operator.

<a id="fn-1610"></a>
### named (25:20)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:Syntax&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: use <code>node?.namedChildren().filter(child=&gt;!['comment','line_comment','block_comment'].includes(String(child.kind())))</code> unless null/undefined, then evaluate <code>[]</code>.

<a id="fn-1669"></a>
### inline callback (25:79)

Synchronous function. Lexically inside [named (25:20)](#fn-1610). 

Parameters:

- <code>child</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: apply <code>!</code> to <code>['comment','line_comment','block_comment'].includes(String(child.kind()))</code>.

<a id="fn-1777"></a>
### same (26:19)

Synchronous function. Defined in module scope. 

Parameters:

- <code>a:Syntax&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.
- <code>b:Syntax&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L26](#l26) Implicitly return: evaluate <code>!!a &amp;&amp; !!b &amp;&amp; a.id()===b.id()</code> left to right with falsy short-circuiting.

<a id="fn-1866"></a>
### literal (27:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:Syntax&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L29](#l29) <code>text</code>: call the named operation with the supplied arguments: <code>node.text()</code>.

Execution:

- [L28](#l28) If <code>!node &#124;&#124; !['string_literal','interpreted_string_literal','raw_string_literal','verbatim_string_literal'].includes(String(node.kind()))</code> is truthy:
  - [L28](#l28) Return to the caller: evaluate <code>undefined</code>.
- [L29](#l29) Bind <code>text</code>: call the named operation with the supplied arguments: <code>node.text()</code>.
- [L30](#l30) If <code>/^"[^"\\\r\n]*"$/.test(text)</code> is truthy:
  - [L30](#l30) Return to the caller: select a range without mutating the original array/string: <code>text.slice(1,-1)</code>.
- [L31](#l31) If <code>node.kind()==='raw_string_literal' &amp;&amp; /^&#96;[^&#96;\r\n]*&#96;$/.test(text)</code> is truthy:
  - [L31](#l31) Return to the caller: select a range without mutating the original array/string: <code>text.slice(1,-1)</code>.
- [L32](#l32) If <code>node.kind()==='verbatim_string_literal' &amp;&amp; /^@"[^"\r\n]*"$/.test(text)</code> is truthy:
  - [L32](#l32) Return to the caller: select a range without mutating the original array/string: <code>text.slice(2,-1)</code>.
- [L33](#l33) Return to the caller: evaluate <code>undefined</code>.

<a id="fn-2398"></a>
### observation (35:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>result:CallExtraction</code>: supplied by the caller; usage is shown in the steps below.
- <code>node:Syntax</code>: supplied by the caller; usage is shown in the steps below.
- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>kind:CallObservation['observationKind']='request-call'</code>: when omitted/undefined, initialize with <code>'request-call'</code>.

Local bindings (nested callback locals are documented with that callback):

- [L37](#l37) <code>range</code>: call the named operation with the supplied arguments: <code>node.range()</code>.
- [L37](#l37) <code>line</code>: compute <code>range.start.line+1</code> with the <code>+</code> operator.
- [L38](#l38) <code>excerpt</code>: concatenate the elements with the supplied separator: <code>source.split(/\r\n&#124;\n&#124;\r/).slice(line-1,range.end.line+1).join('\n')</code>.
- [L40](#l40) <code>call:CallObservation</code>: create an object with 3 property/spread entries: <code>{line,excerpt,observationKind:kind}</code>; later properties overwrite earlier spread values.

Execution:

- [L36](#l36) If <code>result.calls.length&gt;=128</code> is truthy:
  - [L36](#l36) If <code>!result.issues.includes('call-count-limit')</code> is truthy:
    - [L36](#l36) append values to the existing array: <code>result.issues.push('call-count-limit')</code>.
  - [L36](#l36) Return undefined immediately; remaining statements in this function do not execute.
- [L37](#l37) Bind <code>range</code>: call the named operation with the supplied arguments: <code>node.range()</code>.
- [L37](#l37) Bind <code>line</code>: compute <code>range.start.line+1</code> with the <code>+</code> operator.
- [L38](#l38) Bind <code>excerpt</code>: concatenate the elements with the supplied separator: <code>source.split(/\r\n&#124;\n&#124;\r/).slice(line-1,range.end.line+1).join('\n')</code>.
- [L39](#l39) If <code>excerpt.length&gt;2048</code> is truthy:
  - [L39](#l39) If <code>!result.issues.includes('source-excerpt-limit')</code> is truthy:
    - [L39](#l39) append values to the existing array: <code>result.issues.push('source-excerpt-limit')</code>.
  - [L39](#l39) Return undefined immediately; remaining statements in this function do not execute.
- [L40](#l40) Bind <code>call:CallObservation</code>: create an object with 3 property/spread entries: <code>{line,excerpt,observationKind:kind}</code>; later properties overwrite earlier spread values.
- [L40](#l40) append values to the existing array: <code>result.calls.push(call)</code>.
- [L40](#l40) Return to the caller: evaluate <code>call</code>.

<a id="fn-3055"></a>
### setUrl (42:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>call:CallObservation</code>: supplied by the caller; usage is shown in the steps below.
- <code>node:Syntax&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L43](#l43) <code>url</code>: call the named operation with the supplied arguments: <code>literal(node)</code>.

Execution:

- [L43](#l43) Bind <code>url</code>: call the named operation with the supplied arguments: <code>literal(node)</code>.
- [L44](#l44) If <code>url===undefined</code> is truthy:
  - [L44](#l44) update <code>call.reason</code> with <code>'dynamic-or-unsupported-url'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L44](#l44) Return undefined immediately; remaining statements in this function do not execute.
- [L45](#l45) update <code>call.url</code> with <code>url</code> using <code>=</code>; this mutation is visible to later statements.
- [L47](#l47) If <code>/[\\\s\u0000-\u001f\u007f]/.test(url) &#124;&#124; /\/\.{1,2}(?:\/&#124;[?#]&#124;$)/.test(url)</code> is truthy:
  - [L47](#l47) update <code>call.reason</code> with <code>'unsupported-url-shape'</code> using <code>=</code>; this mutation is visible to later statements.

## Compile-time data contracts

### Syntax

```typescript
type Syntax=SgNode;
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L5](#l5) <code>require</code>: call the named operation with the supplied arguments: <code>createRequire(import.meta.url)</code>.
- [L6](#l6) <code>runtime:typeof import('@ast-grep/napi')&#124;undefined</code>: leave the value undefined until a later assignment.
- [L25](#l25) <code>named</code>: create [named (25:20)](#fn-1610); its body runs when called, not when this value is created.
- [L26](#l26) <code>same</code>: create [same (26:19)](#fn-1777); its body runs when called, not when this value is created.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l8"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {createRequire} from 'node:module';
   2 | import type {SgNode} from '@ast-grep/napi';
   3 | import type {CallExtraction,CallObservation} from './contract-adapter-types.js';
   4 | export type Syntax=SgNode;
   5 | const require=createRequire(import.meta.url);
   6 | let runtime:typeof import('@ast-grep/napi')|undefined;
   7 | /** Load only packaged grammars, never paths/configuration from the inspected repository. */
   8 | export function syntaxTree(language:'go'|'csharp'|'java',source:string):{nodes:Syntax[];issues:string[]} {
   9 |   // Tree-sitter's line coordinates count LF; do not produce misleading CR-only citations.
  10 |   if(/\r(?!\n)/.test(source))return {nodes:[],issues:['unsupported-line-endings']};
  11 |   try {
  12 |     if(!runtime) {
  13 |       const candidate=require('@ast-grep/napi') as typeof import('@ast-grep/napi');
  14 |       candidate.registerDynamicLanguage({shipcheck_go:require('@ast-grep/lang-go'),shipcheck_csharp:require('@ast-grep/lang-csharp'),shipcheck_java:require('@ast-grep/lang-java')});
  15 |       runtime=candidate;
  16 |     }
  17 |   } catch {return {nodes:[],issues:['offline-parser-unavailable']};}
  18 |   try {
  19 |     const root=runtime.parse('shipcheck_'+language,source).root(),nodes:Syntax[]=[],stack=[root];
  20 |     while(stack.length){const node=stack.pop()!;nodes.push(node);stack.push(...node.children());}
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     if(nodes.some(node=>node.kind()==='ERROR' || node.id()!==root.id() && node.text()===''))return {nodes:[],issues:['unsupported-or-invalid-'+language]};
  22 |     return {nodes:nodes.sort((a,b)=>a.range().start.index-b.range().start.index),issues:[]};
  23 |   }catch{return {nodes:[],issues:['unsupported-or-invalid-'+language]};}
  24 | }
  25 | export const named=(node:Syntax|undefined|null)=>node?.namedChildren().filter(child=>!['comment','line_comment','block_comment'].includes(String(child.kind()))) ?? [];
  26 | export const same=(a:Syntax|undefined|null,b:Syntax|undefined|null)=>!!a && !!b && a.id()===b.id();
  27 | export function literal(node:Syntax|undefined|null):string|undefined {
  28 |   if(!node || !['string_literal','interpreted_string_literal','raw_string_literal','verbatim_string_literal'].includes(String(node.kind())))return undefined;
  29 |   const text=node.text();
  30 |   if(/^"[^"\\\r\n]*"$/.test(text))return text.slice(1,-1);
  31 |   if(node.kind()==='raw_string_literal' && /^`[^`\r\n]*`$/.test(text))return text.slice(1,-1);
  32 |   if(node.kind()==='verbatim_string_literal' && /^@"[^"\r\n]*"$/.test(text))return text.slice(2,-1);
  33 |   return undefined;
  34 | }
  35 | export function observation(result:CallExtraction,node:Syntax,source:string,kind:CallObservation['observationKind']='request-call'):CallObservation|undefined {
  36 |   if(result.calls.length>=128){if(!result.issues.includes('call-count-limit'))result.issues.push('call-count-limit');return;}
  37 |   const range=node.range(),line=range.start.line+1;
  38 |   const excerpt=source.split(/\r\n|\n|\r/).slice(line-1,range.end.line+1).join('\n');
  39 |   if(excerpt.length>2048){if(!result.issues.includes('source-excerpt-limit'))result.issues.push('source-excerpt-limit');return;}
  40 |   const call:CallObservation={line,excerpt,observationKind:kind};result.calls.push(call);return call;
```

<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l47"></a>

```text
  41 | }
  42 | export function setUrl(call:CallObservation,node:Syntax|undefined|null) {
  43 |   const url=literal(node);
  44 |   if(url===undefined){call.reason='dynamic-or-unsupported-url';return;}
  45 |   call.url=url;
  46 |   // These clients do not share browser URL normalization; avoid inferred rewrites.
  47 |   if(/[\\\s\u0000-\u001f\u007f]/.test(url) || /\/\.{1,2}(?:\/|[?#]|$)/.test(url))call.reason='unsupported-url-shape';
  48 | }
  49 | 
```
