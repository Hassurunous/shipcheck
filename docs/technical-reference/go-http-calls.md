# src/go-http-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The Go adapter establishes a single net/http import and alias, then interprets direct package calls only. Get/Head/Post/PostForm imply fixed verbs; NewRequest constructors read a literal or known method constant and are labeled request-construction. Alias shadowing, custom clients and unsupported argument counts become unresolved observations.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `df6694a1efa6def15f45bd4b2ba593d6a029fe7de9e13b952daa1780c1f87be1`.

This chapter inventories **6 function bodies/callbacks**, **18 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./standard-http-syntax.js</code>: <code>syntaxTree</code>, <code>named</code>, <code>same</code>, <code>literal</code>, <code>observation</code>, <code>setUrl</code>, <code>Syntax</code> (type only).
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only).

## Module execution


## Function index

- [extractGoCalls (4:8)](#fn-177)
- [nodes.filter callback (7:30)](#fn-384)
- [imports.map callback (8:37)](#fn-500)
- [nodes.some callback (11:30)](#fn-798)
- [rootAlias (14:19)](#fn-1047)
- [nodes.filter callback (18:34)](#fn-1237)

<a id="fn-177"></a>
### extractGoCalls (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L5](#l5) <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('go',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L5](#l5) <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L7](#l7) <code>imports</code>: retain only elements whose callback returns a truthy value: <code>nodes.filter(node=&gt;node.kind()==='import_spec' &amp;&amp; literal(node.field('path'))==='net/http')</code>.
- [L8](#l8) <code>aliases</code>: construct <code>Set</code> using <code>imports.map(node=&gt;node.field('name')?.text() ?? 'http')</code>; this creates the local instance used below.
- [L11](#l11) <code>ambiguous</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(node=&gt;node.kind()==='identifier' &amp;&amp; aliases.has(node.text()) &amp;&amp; !(node.parent()?.kind()==='selector_expression' &amp;&amp; same(node.parent()?.field('operand'),node)))</code>.
- [L14](#l14) <code>rootAlias</code>: create [rootAlias (14:19)](#fn-1047); its body runs when called, not when this value is created.
- [L18](#l18) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.kind()==='call_expression')</code> at the start of each loop iteration.
- [L19](#l19) <code>fn</code>: call the named operation with the supplied arguments: <code>node.field('function')</code>.
- [L21](#l21) <code>method</code>: use <code>fn.field('field')?.text()</code> unless null/undefined, then evaluate <code>''</code>.
- [L21](#l21) <code>args</code>: call the named operation with the supplied arguments: <code>named(node.field('arguments'))</code>.
- [L22](#l22) <code>construction</code>: call the named operation with the supplied arguments: <code>['NewRequest','NewRequestWithContext'].includes(method)</code>.
- [L23](#l23) <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,node,source,construction?'request-construction':'request-call')</code>.
- [L26](#l26) <code>count</code>: test <code>method==='Post'</code>; choose <code>3</code> when truthy, otherwise <code>method==='PostForm'?2:1</code>.
- [L30](#l30) <code>offset</code>: test <code>method==='NewRequestWithContext'</code>; choose <code>1</code> when truthy, otherwise <code>0</code>.
- [L32](#l32) <code>value</code>: read <code>args[offset]</code>; the TypeScript assertion adds no runtime validation.
- [L32](#l32) <code>verb</code>: call the named operation with the supplied arguments: <code>literal(value)</code>.
- [L34](#l34) <code>constant</code>: call the named operation with the supplied arguments: <code>value.field('field')?.text()</code>.
- [L35](#l35) <code>constants:Record&lt;string,string&gt;</code>: create an object with 7 property/spread entries: <code>{MethodGet:'GET',MethodHead:'HEAD',MethodPost:'POST',MethodPut:'PUT',MethodPatch:'PATCH',MethodDelete:'DELETE',MethodOptions:'OPTIONS'}</code>; later properties overwrite earlier spread values.

Execution:

- [L5](#l5) Bind <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('go',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L5](#l5) Bind <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L6](#l6) If <code>issues.length</code> is truthy:
  - [L6](#l6) Return to the caller: evaluate <code>result</code>.
- [L7](#l7) Bind <code>imports</code>: retain only elements whose callback returns a truthy value: <code>nodes.filter(node=&gt;node.kind()==='import_spec' &amp;&amp; literal(node.field('path'))==='net/http')</code>.
- [L8](#l8) Bind <code>aliases</code>: construct <code>Set</code> using <code>imports.map(node=&gt;node.field('name')?.text() ?? 'http')</code>; this creates the local instance used below.
- [L9](#l9) If <code>!imports.length</code> is truthy:
  - [L9](#l9) append values to the existing array: <code>result.issues.push('net-http-import-not-established')</code>.
  - [L9](#l9) Return to the caller: evaluate <code>result</code>.
- [L10](#l10) If <code>imports.length!==1 &#124;&#124; aliases.has('.') &#124;&#124; aliases.has('_')</code> is truthy:
  - [L10](#l10) append values to the existing array: <code>result.issues.push('unsupported-net-http-import')</code>.
  - [L10](#l10) Return to the caller: evaluate <code>result</code>.
- [L11](#l11) Bind <code>ambiguous</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(node=&gt;node.kind()==='identifier' &amp;&amp; aliases.has(node.text()) &amp;&amp; !(node.parent()?.kind()==='selector_expression' &amp;&amp; same(node.parent()?.field('operand'),node)))</code>.
- [L13](#l13) If <code>ambiguous</code> is truthy:
  - [L13](#l13) append values to the existing array: <code>result.issues.push('net-http-binding-unresolved')</code>.
- [L14](#l14) Bind <code>rootAlias</code>: create [rootAlias (14:19)](#fn-1047); its body runs when called, not when this value is created.
- [L18](#l18) Iterate <code>nodes.filter(n=&gt;n.kind()==='call_expression')</code> values, binding <code>const node</code> for each iteration:
  - [L19](#l19) Bind <code>fn</code>: call the named operation with the supplied arguments: <code>node.field('function')</code>.
  - [L20](#l20) If <code>fn?.kind()!=='selector_expression' &#124;&#124; !rootAlias(fn.field('operand'))</code> is truthy:
    - [L20](#l20) Skip the rest of this iteration and advance the enclosing loop.
  - [L21](#l21) Bind <code>method</code>: use <code>fn.field('field')?.text()</code> unless null/undefined, then evaluate <code>''</code>.
  - [L21](#l21) Bind <code>args</code>: call the named operation with the supplied arguments: <code>named(node.field('arguments'))</code>.
  - [L22](#l22) Bind <code>construction</code>: call the named operation with the supplied arguments: <code>['NewRequest','NewRequestWithContext'].includes(method)</code>.
  - [L23](#l23) Bind <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,node,source,construction?'request-construction':'request-call')</code>.
  - [L23](#l23) If <code>!call</code> is truthy:
    - [L23](#l23) Skip the rest of this iteration and advance the enclosing loop.
  - [L24](#l24) If <code>ambiguous &#124;&#124; !aliases.has(fn.field('operand')?.text() ?? '')</code> is truthy:
    - [L24](#l24) update <code>call.reason</code> with <code>'net-http-binding-or-client-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L24](#l24) Skip the rest of this iteration and advance the enclosing loop.
  - [L25](#l25) If <code>['Get','Head','Post','PostForm'].includes(method)</code> is truthy:
    - [L26](#l26) Bind <code>count</code>: test <code>method==='Post'</code>; choose <code>3</code> when truthy, otherwise <code>method==='PostForm'?2:1</code>.
    - [L27](#l27) If <code>args.length!==count</code> is truthy:
      - [L27](#l27) update <code>call.reason</code> with <code>'unsupported-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L27](#l27) Skip the rest of this iteration and advance the enclosing loop.
    - [L28](#l28) update <code>call.method</code> with <code>method==='Head'?'HEAD':method==='Get'?'GET':'POST'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L28](#l28) call the named operation with the supplied arguments: <code>setUrl(call,args[0])</code>.
  - [L25](#l25) Otherwise:
    - [L29](#l29) If <code>construction</code> is truthy:
      - [L30](#l30) Bind <code>offset</code>: test <code>method==='NewRequestWithContext'</code>; choose <code>1</code> when truthy, otherwise <code>0</code>.
      - [L31](#l31) If <code>args.length!==3+offset</code> is truthy:
        - [L31](#l31) update <code>call.reason</code> with <code>'unsupported-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L31](#l31) Skip the rest of this iteration and advance the enclosing loop.
      - [L32](#l32) Bind <code>value</code>: read <code>args[offset]</code>; the TypeScript assertion adds no runtime validation.
      - [L32](#l32) Bind <code>verb</code>: call the named operation with the supplied arguments: <code>literal(value)</code>.
      - [L33](#l33) If <code>value.kind()==='selector_expression' &amp;&amp; aliases.has(value.field('operand')?.text() ?? '')</code> is truthy:
        - [L34](#l34) Bind <code>constant</code>: call the named operation with the supplied arguments: <code>value.field('field')?.text()</code>.
        - [L35](#l35) Bind <code>constants:Record&lt;string,string&gt;</code>: create an object with 7 property/spread entries: <code>{MethodGet:'GET',MethodHead:'HEAD',MethodPost:'POST',MethodPut:'PUT',MethodPatch:'PATCH',MethodDelete:'DELETE',MethodOptions:'OPTIONS'}</code>; later properties overwrite earlier spread values.
        - [L36](#l36) update <code>verb</code> with <code>constant &amp;&amp; Object.hasOwn(constants,constant)?constants[constant]:undefined</code> using <code>=</code>; this mutation is visible to later statements.
      - [L38](#l38) If <code>verb===undefined</code> is truthy:
        - [L38](#l38) update <code>call.reason</code> with <code>'dynamic-method'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L38](#l38) Skip the rest of this iteration and advance the enclosing loop.
      - [L39](#l39) update <code>call.method</code> with <code>verb===''?'GET':verb</code> using <code>=</code>; this mutation is visible to later statements.
      - [L39](#l39) call the named operation with the supplied arguments: <code>setUrl(call,args[offset+1])</code>.
    - [L29](#l29) Otherwise:
      - [L40](#l40) update <code>call.reason</code> with <code>'unsupported-net-http-operation'</code> using <code>=</code>; this mutation is visible to later statements.
- [L42](#l42) Return to the caller: evaluate <code>result</code>.

<a id="fn-384"></a>
### nodes.filter callback (7:30)

Synchronous function. Lexically inside [extractGoCalls (4:8)](#fn-177). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>node</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L7](#l7) Implicitly return: evaluate <code>node.kind()==='import_spec' &amp;&amp; literal(node.field('path'))==='net/http'</code> left to right with falsy short-circuiting.

<a id="fn-500"></a>
### imports.map callback (8:37)

Synchronous function. Lexically inside [extractGoCalls (4:8)](#fn-177). Passed to <code>imports.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>node</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: use <code>node.field('name')?.text()</code> unless null/undefined, then evaluate <code>'http'</code>.

<a id="fn-798"></a>
### nodes.some callback (11:30)

Synchronous function. Lexically inside [extractGoCalls (4:8)](#fn-177). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>node</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L11](#l11) Implicitly return: evaluate <code>node.kind()==='identifier' &amp;&amp; aliases.has(node.text()) &amp;&amp; !(node.parent()?.kind()==='selector_expression' &amp;&amp; same(node.parent()?.field('operand'),node))</code> left to right with falsy short-circuiting.

<a id="fn-1047"></a>
### rootAlias (14:19)

Synchronous function. Lexically inside [extractGoCalls (4:8)](#fn-177). 

Parameters:

- <code>node:Syntax&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L15](#l15) Repeat while <code>node?.kind()==='selector_expression'</code>:
  - [L15](#l15) update <code>node</code> with <code>node.field('operand')</code> using <code>=</code>; this mutation is visible to later statements.
- [L16](#l16) Return to the caller: evaluate <code>!!node &amp;&amp; aliases.has(node.text())</code> left to right with falsy short-circuiting.

<a id="fn-1237"></a>
### nodes.filter callback (18:34)

Synchronous function. Lexically inside [extractGoCalls (4:8)](#fn-177). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: compute <code>n.kind()==='call_expression'</code> with the <code>===</code> operator.

## Directly importing tests

- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {syntaxTree,named,same,literal,observation,setUrl,type Syntax} from './standard-http-syntax.js';
   2 | import type {CallExtraction} from './contract-adapter-types.js';
   3 | 
   4 | export function extractGoCalls(source:string):CallExtraction {
   5 |   const {nodes,issues}=syntaxTree('go',source),result:CallExtraction={calls:[],issues};
   6 |   if(issues.length)return result;
   7 |   const imports=nodes.filter(node=>node.kind()==='import_spec' && literal(node.field('path'))==='net/http');
   8 |   const aliases=new Set(imports.map(node=>node.field('name')?.text() ?? 'http'));
   9 |   if(!imports.length){result.issues.push('net-http-import-not-established');return result;}
  10 |   if(imports.length!==1 || aliases.has('.') || aliases.has('_')){result.issues.push('unsupported-net-http-import');return result;}
  11 |   const ambiguous=nodes.some(node=>node.kind()==='identifier' && aliases.has(node.text()) &&
  12 |     !(node.parent()?.kind()==='selector_expression' && same(node.parent()?.field('operand'),node)));
  13 |   if(ambiguous)result.issues.push('net-http-binding-unresolved');
  14 |   const rootAlias=(node:Syntax|null):boolean=>{
  15 |     while(node?.kind()==='selector_expression')node=node.field('operand');
  16 |     return !!node && aliases.has(node.text());
  17 |   };
  18 |   for(const node of nodes.filter(n=>n.kind()==='call_expression')) {
  19 |     const fn=node.field('function');
  20 |     if(fn?.kind()!=='selector_expression' || !rootAlias(fn.field('operand')))continue;
```

<a id="l21"></a>
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
<a id="l36"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     const method=fn.field('field')?.text() ?? '',args=named(node.field('arguments'));
  22 |     const construction=['NewRequest','NewRequestWithContext'].includes(method);
  23 |     const call=observation(result,node,source,construction?'request-construction':'request-call');if(!call)continue;
  24 |     if(ambiguous || !aliases.has(fn.field('operand')?.text() ?? '')){call.reason='net-http-binding-or-client-unresolved';continue;}
  25 |     if(['Get','Head','Post','PostForm'].includes(method)) {
  26 |       const count=method==='Post'?3:method==='PostForm'?2:1;
  27 |       if(args.length!==count){call.reason='unsupported-arguments';continue;}
  28 |       call.method=method==='Head'?'HEAD':method==='Get'?'GET':'POST';setUrl(call,args[0]);
  29 |     } else if(construction) {
  30 |       const offset=method==='NewRequestWithContext'?1:0;
  31 |       if(args.length!==3+offset){call.reason='unsupported-arguments';continue;}
  32 |       const value=args[offset]!;let verb=literal(value);
  33 |       if(value.kind()==='selector_expression' && aliases.has(value.field('operand')?.text() ?? '')) {
  34 |         const constant=value.field('field')?.text();
  35 |         const constants:Record<string,string>={MethodGet:'GET',MethodHead:'HEAD',MethodPost:'POST',MethodPut:'PUT',MethodPatch:'PATCH',MethodDelete:'DELETE',MethodOptions:'OPTIONS'};
  36 |         verb=constant && Object.hasOwn(constants,constant)?constants[constant]:undefined;
  37 |       }
  38 |       if(verb===undefined){call.reason='dynamic-method';continue;}
  39 |       call.method=verb===''?'GET':verb;setUrl(call,args[offset+1]);
  40 |     }else call.reason='unsupported-net-http-operation';
```

<a id="l42"></a>

```text
  41 |   }
  42 |   return result;
  43 | }
  44 | 
```
