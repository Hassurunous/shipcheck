# src/fetch-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

parseHttpSyntax uses Acorn for JS or Babel ESTree/TypeScript for typed source and flattens nodes with parent links. extractFetchCalls first rejects file-wide ambiguity around fetch/eval, then interprets only direct literal calls and simple option objects. unwrap removes TypeScript wrappers because they do not change runtime literal values. Unsupported cases become observations with reasons rather than guessed URLs.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `70038954ed924d0ccdf1a1abff92b9ea0a9fde06b63b92ae7f00206c2387faec`.

This chapter inventories **6 function bodies/callbacks**, **23 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>acorn</code>: <code>parse</code>, <code>Node</code> (type only), <code>CallExpression</code> (type only), <code>Identifier</code> (type only), <code>Literal</code> (type only), <code>ObjectExpression</code> (type only), <code>Property</code> (type only).
- <code>@babel/parser</code>: <code>parseTyped</code>.
- <code>./contract-adapter-types.js</code>: <code>CallObservation</code> (type only), <code>CallExtraction</code> (type only).

## Module execution


## Function index

- [unwrap (6:8)](#fn-365)
- [parseHttpSyntax (12:8)](#fn-692)
- [extractFetchCalls (27:8)](#fn-1843)
- [nodes.some callback (30:30)](#fn-2117)
- [nodes.some callback (32:19)](#fn-2303)
- [nodes.sort callback (36:34)](#fn-2677)

<a id="fn-365"></a>
### unwrap (6:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:Node</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L7](#l7) Repeat while <code>['TSAsExpression','TSTypeAssertion','TSSatisfiesExpression','TSNonNullExpression'].includes(node.type)</code>:
  - [L8](#l8) update <code>node</code> with <code>(node as Node &amp; {expression:Node}).expression</code> using <code>=</code>; this mutation is visible to later statements.
- [L9](#l9) Return to the caller: evaluate <code>node</code>.

<a id="fn-692"></a>
### parseHttpSyntax (12:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>content:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>syntax:'javascript'&#124;'typescript'&#124;'tsx'='javascript'</code>: when omitted/undefined, initialize with <code>'javascript'</code>.

Local bindings (nested callback locals are documented with that callback):

- [L15](#l15) <code>tree:Node</code>: leave the value undefined until a later assignment.
- [L19](#l19) <code>nodes:{node:Node;parent?:Node}[]</code>: create a new empty array to accumulate ordered results.
- [L19](#l19) <code>stack:{node:Node;parent?:Node}[]</code>: create an array from <code>[{node:tree}]</code>; spread elements insert the iterable values.
- [L21](#l21) <code>entry</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.
- [L22](#l22) <code>value</code>: receive the next iterable value from <code>Object.values(entry.node)</code> at the start of each loop iteration.
- [L22](#l22) <code>child</code>: receive the next iterable value from <code>Array.isArray(value)?value:[value]</code> at the start of each loop iteration.

Execution:

- [L14](#l14) If <code>/[\u2028\u2029]/.test(content)</code> is truthy:
  - [L14](#l14) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['unsupported-line-endings']}</code>; later properties overwrite earlier spread values.
- [L15](#l15) Bind <code>tree:Node</code>: leave the value undefined until a later assignment.
- [L16](#l16) Run the protected block:
  - [L16](#l16) update <code>tree</code> with <code>syntax==='javascript'?parse(content,{ecmaVersion:'latest',sourceType:'module',locations:true}) :parseTyped(content,{sourceType:'module',attachComment:false,plugins:['estree','typescript',...(syntax==='tsx'?['jsx' as const]:[])]}).program as unknown as Node</code> using <code>=</code>; this mutation is visible to later statements.
- [L16](#l16) If it throws:
  - [L18](#l18) Return to the caller: create an object with 2 property/spread entries: <code>{nodes:[],issues:['unsupported-or-invalid-'+(syntax==='javascript'?'javascript':'typescript')]}</code>; later properties overwrite earlier spread values.
- [L19](#l19) Bind <code>nodes:{node:Node;parent?:Node}[]</code>: create a new empty array to accumulate ordered results.
- [L19](#l19) Bind <code>stack:{node:Node;parent?:Node}[]</code>: create an array from <code>[{node:tree}]</code>; spread elements insert the iterable values.
- [L20](#l20) Repeat while <code>stack.length</code>:
  - [L21](#l21) Bind <code>entry</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.
  - [L21](#l21) append values to the existing array: <code>nodes.push(entry)</code>.
  - [L22](#l22) Iterate <code>Object.values(entry.node)</code> values, binding <code>const value</code> for each iteration:
    - [L22](#l22) Iterate <code>Array.isArray(value)?value:[value]</code> values, binding <code>const child</code> for each iteration:
      - [L23](#l23) If <code>child &amp;&amp; typeof child==='object' &amp;&amp; 'type' in child &amp;&amp; typeof child.type==='string'</code> is truthy:
        - [L23](#l23) append values to the existing array: <code>stack.push({node:child as Node,parent:entry.node})</code>.
- [L25](#l25) Return to the caller: create an object with 2 property/spread entries: <code>{nodes,issues:[] as string[]}</code>; later properties overwrite earlier spread values.

<a id="fn-1843"></a>
### extractFetchCalls (27:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>content:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>syntax:'javascript'&#124;'typescript'&#124;'tsx'='javascript'</code>: when omitted/undefined, initialize with <code>'javascript'</code>.

Local bindings (nested callback locals are documented with that callback):

- [L28](#l28) <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(content,syntax)</code>.
- [L28](#l28) <code>nodes</code>: read <code>parsed.nodes</code>.
- [L30](#l30) <code>ambiguous</code>: evaluate <code>nodes.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; (node as Identifier).name==='fetch' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node)) &#124;&#124; nodes.some(({node})=&gt;node.type==='WithStatement' &#124;&#124; node.type==='CallExpression…</code> left to right with truthy short-circuiting.
- [L33](#l33) <code>calls:FetchCall[]</code>: create a new empty array to accumulate ordered results.
- [L34](#l34) <code>issues:string[]</code>: test <code>ambiguous</code>; choose <code>['fetch-binding-or-alias-unresolved']</code> when truthy, otherwise <code>[]</code>.
- [L35](#l35) <code>lines</code>: divide the string using the delimiter or regular expression: <code>content.split(/\r\n&#124;\n&#124;\r/)</code>.
- [L36](#l36) <code>{node}</code>: receive the next iterable value from <code>nodes.sort((a,b)=&gt;a.node.start-b.node.start)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L38](#l38) <code>call</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
- [L41](#l41) <code>result:FetchCall</code>: create an object with 2 property/spread entries: <code>{line:node.loc!.start.line,excerpt:lines.slice(node.loc!.start.line-1,node.loc!.end.line).join('\n')}</code>; later properties overwrite earlier spread values.
- [L46](#l46) <code>first</code>: call the named operation with the supplied arguments: <code>unwrap(call.arguments[0]!)</code>.
- [L49](#l49) <code>options</code>: test <code>call.arguments[1]</code>; choose <code>unwrap(call.arguments[1])</code> when truthy, otherwise <code>undefined</code>.
- [L52](#l52) <code>sawMethod</code>: use the literal <code>false</code>.
- [L53](#l53) <code>option</code>: receive the next iterable value from <code>(options as ObjectExpression).properties</code> at the start of each loop iteration.
- [L55](#l55) <code>property</code>: evaluate <code>option</code>; the TypeScript assertion adds no runtime validation.
- [L56](#l56) <code>key</code>: test <code>property.key.type==='Identifier'</code>; choose <code>property.key.name</code> when truthy, otherwise <code>property.key.type==='Literal'?property.key.value:undefined</code>.
- [L59](#l59) <code>value</code>: call the named operation with the supplied arguments: <code>unwrap(property.value)</code>; the TypeScript assertion adds no runtime validation.
- [L62](#l62) <code>method</code>: read <code>value.value</code>.

Execution:

- [L28](#l28) Bind <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(content,syntax)</code>.
- [L28](#l28) Bind <code>nodes</code>: read <code>parsed.nodes</code>.
- [L29](#l29) If <code>parsed.issues.length</code> is truthy:
  - [L29](#l29) Return to the caller: create an object with 2 property/spread entries: <code>{calls:[],issues:parsed.issues}</code>; later properties overwrite earlier spread values.
- [L30](#l30) Bind <code>ambiguous</code>: evaluate <code>nodes.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; (node as Identifier).name==='fetch' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node)) &#124;&#124; nodes.some(({node})=&gt;node.type==='WithStatement' &#124;&#124; node.type==='CallExpression…</code> left to right with truthy short-circuiting.
- [L33](#l33) Bind <code>calls:FetchCall[]</code>: create a new empty array to accumulate ordered results.
- [L34](#l34) Bind <code>issues:string[]</code>: test <code>ambiguous</code>; choose <code>['fetch-binding-or-alias-unresolved']</code> when truthy, otherwise <code>[]</code>.
- [L35](#l35) Bind <code>lines</code>: divide the string using the delimiter or regular expression: <code>content.split(/\r\n&#124;\n&#124;\r/)</code>.
- [L36](#l36) Iterate <code>nodes.sort((a,b)=&gt;a.node.start-b.node.start)</code> values, binding <code>const {node}</code> for each iteration:
  - [L37](#l37) If <code>node.type!=='CallExpression'</code> is truthy:
    - [L37](#l37) Skip the rest of this iteration and advance the enclosing loop.
  - [L38](#l38) Bind <code>call</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
  - [L39](#l39) If <code>call.callee.type!=='Identifier' &#124;&#124; (call.callee as Identifier).name!=='fetch'</code> is truthy:
    - [L39](#l39) Skip the rest of this iteration and advance the enclosing loop.
  - [L40](#l40) If <code>calls.length&gt;=128</code> is truthy:
    - [L40](#l40) append values to the existing array: <code>issues.push('call-count-limit')</code>.
    - [L40](#l40) Leave the enclosing loop/switch.
  - [L41](#l41) Bind <code>result:FetchCall</code>: create an object with 2 property/spread entries: <code>{line:node.loc!.start.line,excerpt:lines.slice(node.loc!.start.line-1,node.loc!.end.line).join('\n')}</code>; later properties overwrite earlier spread values.
  - [L42](#l42) If <code>result.excerpt.length&gt;2048</code> is truthy:
    - [L42](#l42) append values to the existing array: <code>issues.push('source-excerpt-limit')</code>.
    - [L42](#l42) Skip the rest of this iteration and advance the enclosing loop.
  - [L43](#l43) append values to the existing array: <code>calls.push(result)</code>.
  - [L44](#l44) If <code>ambiguous</code> is truthy:
    - [L44](#l44) update <code>result.reason</code> with <code>'fetch-binding-or-alias-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L44](#l44) Skip the rest of this iteration and advance the enclosing loop.
  - [L45](#l45) If <code>call.optional &#124;&#124; call.arguments.length&lt;1 &#124;&#124; call.arguments.length&gt;2</code> is truthy:
    - [L45](#l45) update <code>result.reason</code> with <code>'unsupported-call-shape'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L45](#l45) Skip the rest of this iteration and advance the enclosing loop.
  - [L46](#l46) Bind <code>first</code>: call the named operation with the supplied arguments: <code>unwrap(call.arguments[0]!)</code>.
  - [L47](#l47) If <code>first.type!=='Literal' &#124;&#124; typeof (first as Literal).value!=='string'</code> is truthy:
    - [L47](#l47) update <code>result.reason</code> with <code>'dynamic-url'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L47](#l47) Skip the rest of this iteration and advance the enclosing loop.
  - [L48](#l48) update <code>result.url</code> with <code>(first as Literal).value as string</code> using <code>=</code>; this mutation is visible to later statements.
  - [L48](#l48) update <code>result.method</code> with <code>'GET'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L49](#l49) Bind <code>options</code>: test <code>call.arguments[1]</code>; choose <code>unwrap(call.arguments[1])</code> when truthy, otherwise <code>undefined</code>.
  - [L50](#l50) If <code>!options</code> is truthy:
    - [L50](#l50) Skip the rest of this iteration and advance the enclosing loop.
  - [L51](#l51) If <code>options.type!=='ObjectExpression'</code> is truthy:
    - [L51](#l51) update <code>result.reason</code> with <code>'dynamic-options'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L51](#l51) Skip the rest of this iteration and advance the enclosing loop.
  - [L52](#l52) Bind <code>sawMethod</code>: use the literal <code>false</code>.
  - [L53](#l53) Iterate <code>(options as ObjectExpression).properties</code> values, binding <code>const option</code> for each iteration:
    - [L54](#l54) If <code>option.type!=='Property' &#124;&#124; option.computed &#124;&#124; option.kind!=='init' &#124;&#124; option.method</code> is truthy:
      - [L54](#l54) update <code>result.reason</code> with <code>'dynamic-options'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L54](#l54) Leave the enclosing loop/switch.
    - [L55](#l55) Bind <code>property</code>: evaluate <code>option</code>; the TypeScript assertion adds no runtime validation.
    - [L56](#l56) Bind <code>key</code>: test <code>property.key.type==='Identifier'</code>; choose <code>property.key.name</code> when truthy, otherwise <code>property.key.type==='Literal'?property.key.value:undefined</code>.
    - [L57](#l57) If <code>typeof key!=='string' &#124;&#124; key==='__proto__'</code> is truthy:
      - [L57](#l57) update <code>result.reason</code> with <code>'dynamic-options'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L57](#l57) Leave the enclosing loop/switch.
    - [L58](#l58) If <code>key==='method'</code> is truthy:
      - [L59](#l59) Bind <code>value</code>: call the named operation with the supplied arguments: <code>unwrap(property.value)</code>; the TypeScript assertion adds no runtime validation.
      - [L60](#l60) If <code>sawMethod &#124;&#124; value.type!=='Literal' &#124;&#124; typeof value.value!=='string'</code> is truthy:
        - [L60](#l60) update <code>result.reason</code> with <code>'dynamic-method'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L60](#l60) Leave the enclosing loop/switch.
      - [L61](#l61) update <code>sawMethod</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
      - [L62](#l62) Bind <code>method</code>: read <code>value.value</code>.
      - [L63](#l63) update <code>result.method</code> with <code>/^(delete&#124;get&#124;head&#124;options&#124;post&#124;put)$/i.test(method)?method.toUpperCase():method</code> using <code>=</code>; this mutation is visible to later statements.
- [L67](#l67) Return to the caller: create an object with 2 property/spread entries: <code>{calls,issues:[...new Set(issues)]}</code>; later properties overwrite earlier spread values.

<a id="fn-2117"></a>
### nodes.some callback (30:30)

Synchronous function. Lexically inside [extractFetchCalls (27:8)](#fn-1843). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{node,parent}</code>: destructure the supplied value into these local bindings.

Execution:

[L30](#l30) Implicitly return: evaluate <code>node.type==='Identifier' &amp;&amp; (node as Identifier).name==='fetch' &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node)</code> left to right with falsy short-circuiting.

<a id="fn-2303"></a>
### nodes.some callback (32:19)

Synchronous function. Lexically inside [extractFetchCalls (27:8)](#fn-1843). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{node}</code>: destructure the supplied value into these local bindings.

Execution:

[L32](#l32) Implicitly return: evaluate <code>node.type==='WithStatement' &#124;&#124; node.type==='CallExpression' &amp;&amp; (node as CallExpression).callee.type==='Identifier' &amp;&amp; ((node as CallExpression).callee as Identifier).name==='eval'</code> left to right with truthy short-circuiting.

<a id="fn-2677"></a>
### nodes.sort callback (36:34)

Synchronous function. Lexically inside [extractFetchCalls (27:8)](#fn-1843). Passed to <code>nodes.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L36](#l36) Implicitly return: compute <code>a.node.start-b.node.start</code> with the <code>-</code> operator.

## Compile-time data contracts

### FetchCall

```typescript
type FetchCall=CallObservation;
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Directly importing tests

- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)
- [contract-audit.test.ts](../../test/contract-audit.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l12"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {parse,type Node,type CallExpression,type Identifier,type Literal,type ObjectExpression,type Property} from 'acorn';
   2 | import {parse as parseTyped} from '@babel/parser';
   3 | import type {CallObservation,CallExtraction} from './contract-adapter-types.js';
   4 | export type FetchCall=CallObservation;
   5 | // Type-only wrappers do not change a literal's runtime value.
   6 | export function unwrap(node:Node):Node {
   7 |   while(['TSAsExpression','TSTypeAssertion','TSSatisfiesExpression','TSNonNullExpression'].includes(node.type))
   8 |     node=(node as Node & {expression:Node}).expression;
   9 |   return node;
  10 | }
  11 | /** Syntax-only extraction. Bindings/aliases anywhere in the file disable direct-fetch inference. */
  12 | export function parseHttpSyntax(content:string,syntax:'javascript'|'typescript'|'tsx'='javascript') {
  13 |   // JS parsers count these separators as lines; Shipcheck's evidence format uses CR/LF.
  14 |   if(/[\u2028\u2029]/.test(content))return {nodes:[],issues:['unsupported-line-endings']};
  15 |   let tree:Node;
  16 |   try{tree=syntax==='javascript'?parse(content,{ecmaVersion:'latest',sourceType:'module',locations:true})
  17 |     :parseTyped(content,{sourceType:'module',attachComment:false,plugins:['estree','typescript',...(syntax==='tsx'?['jsx' as const]:[])]}).program as unknown as Node;}
  18 |   catch{return {nodes:[],issues:['unsupported-or-invalid-'+(syntax==='javascript'?'javascript':'typescript')]};}
  19 |   const nodes:{node:Node;parent?:Node}[]=[];const stack:{node:Node;parent?:Node}[]=[{node:tree}];
  20 |   while(stack.length) {
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     const entry=stack.pop()!;nodes.push(entry);
  22 |     for(const value of Object.values(entry.node))for(const child of Array.isArray(value)?value:[value])
  23 |       if(child && typeof child==='object' && 'type' in child && typeof child.type==='string')stack.push({node:child as Node,parent:entry.node});
  24 |   }
  25 |   return {nodes,issues:[] as string[]};
  26 | }
  27 | export function extractFetchCalls(content:string,syntax:'javascript'|'typescript'|'tsx'='javascript'):CallExtraction {
  28 |   const parsed=parseHttpSyntax(content,syntax),nodes=parsed.nodes;
  29 |   if(parsed.issues.length)return {calls:[],issues:parsed.issues};
  30 |   const ambiguous=nodes.some(({node,parent})=>node.type==='Identifier' && (node as Identifier).name==='fetch'
  31 |     && !(parent?.type==='CallExpression' && (parent as CallExpression).callee===node))
  32 |     || nodes.some(({node})=>node.type==='WithStatement' || node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='eval');
  33 |   const calls:FetchCall[]=[];
  34 |   const issues:string[]=ambiguous?['fetch-binding-or-alias-unresolved']:[];
  35 |   const lines=content.split(/\r\n|\n|\r/);
  36 |   for(const {node} of nodes.sort((a,b)=>a.node.start-b.node.start)) {
  37 |     if(node.type!=='CallExpression')continue;
  38 |     const call=node as CallExpression;
  39 |     if(call.callee.type!=='Identifier' || (call.callee as Identifier).name!=='fetch')continue;
  40 |     if(calls.length>=128){issues.push('call-count-limit');break;}
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
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     const result:FetchCall={line:node.loc!.start.line,excerpt:lines.slice(node.loc!.start.line-1,node.loc!.end.line).join('\n')};
  42 |     if(result.excerpt.length>2048){issues.push('source-excerpt-limit');continue;}
  43 |     calls.push(result);
  44 |     if(ambiguous){result.reason='fetch-binding-or-alias-unresolved';continue;}
  45 |     if(call.optional || call.arguments.length<1 || call.arguments.length>2){result.reason='unsupported-call-shape';continue;}
  46 |     const first=unwrap(call.arguments[0]!);
  47 |     if(first.type!=='Literal' || typeof (first as Literal).value!=='string'){result.reason='dynamic-url';continue;}
  48 |     result.url=(first as Literal).value as string;result.method='GET';
  49 |     const options=call.arguments[1]?unwrap(call.arguments[1]):undefined;
  50 |     if(!options)continue;
  51 |     if(options.type!=='ObjectExpression'){result.reason='dynamic-options';continue;}
  52 |     let sawMethod=false;
  53 |     for(const option of (options as ObjectExpression).properties) {
  54 |       if(option.type!=='Property' || option.computed || option.kind!=='init' || option.method){result.reason='dynamic-options';break;}
  55 |       const property=option as Property;
  56 |       const key=property.key.type==='Identifier'?property.key.name:property.key.type==='Literal'?property.key.value:undefined;
  57 |       if(typeof key!=='string' || key==='__proto__'){result.reason='dynamic-options';break;}
  58 |       if(key==='method') {
  59 |         const value=unwrap(property.value) as Literal;
  60 |         if(sawMethod || value.type!=='Literal' || typeof value.value!=='string'){result.reason='dynamic-method';break;}
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l67"></a>

```text
  61 |         sawMethod=true;
  62 |         const method=value.value;
  63 |         result.method=/^(delete|get|head|options|post|put)$/i.test(method)?method.toUpperCase():method;
  64 |       }
  65 |     }
  66 |   }
  67 |   return {calls,issues:[...new Set(issues)]};
  68 | }
  69 | 
```
