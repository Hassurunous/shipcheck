# src/axios-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

properties projects only plain object literal properties into a Map; string accepts only a string literal. extractAxiosCalls establishes one default import, rejects alias/configuration ambiguity, distinguishes URL-plus-options from config-object call forms, and interprets allowed fields and scalar query params. The combined extractor merges fetch and Axios calls in source order under a shared 128-call cap.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `370be360543ff2567e080f61043f9a0a2471d9ea523abf970537f71b3beec743`.

This chapter inventories **11 function bodies/callbacks**, **37 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>acorn</code>: <code>Node</code> (type only), <code>CallExpression</code> (type only), <code>Identifier</code> (type only), <code>Literal</code> (type only), <code>MemberExpression</code> (type only), <code>ObjectExpression</code> (type only), <code>ImportDeclaration</code> (type only), <code>ImportDefaultSpecifier</code> (type only).
- <code>./fetch-calls.js</code>: <code>extractFetchCalls</code>, <code>parseHttpSyntax</code>, <code>unwrap</code>.
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only), <code>CallObservation</code> (type only).

## Module execution

- [L16](#l16) Bind <code>string</code>: create [string (16:14)](#fn-904); its body runs when called, not when this value is created.

## Function index

- [properties (5:1)](#fn-299)
- [string (16:14)](#fn-904)
- [extractAxiosCalls (17:8)](#fn-1047)
- [nodes.filter callback (29:44)](#fn-2144)
- [nodes.filter(entry=&gt;entry.node.type==='CallExpression').map callback (29:91)](#fn-2191)
- [nodes.some callback (38:17)](#fn-2757)
- [nodes.filter callback (40:36)](#fn-3086)
- [nodes.filter(entry=&gt;entry.node.type==='CallExpression').sort callback (40:84)](#fn-3134)
- [[...options.keys()].some callback (61:45)](#fn-5172)
- [extractJavascriptHttpCalls (74:8)](#fn-6120)
- [[...fetch.calls,...axios.calls].sort callback (77:52)](#fn-6439)

<a id="fn-299"></a>
### properties (5:1)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input:Node&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L6](#l6) <code>node</code>: call the named operation with the supplied arguments: <code>unwrap(input)</code>.
- [L7](#l7) <code>entries</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L8](#l8) <code>item</code>: receive the next iterable value from <code>(node as ObjectExpression).properties</code> at the start of each loop iteration.
- [L10](#l10) <code>key</code>: test <code>item.key.type==='Identifier'</code>; choose <code>item.key.name</code> when truthy, otherwise <code>item.key.type==='Literal'?item.key.value:undefined</code>.

Execution:

- [L6](#l6) If <code>!input</code> is truthy:
  - [L6](#l6) Return to the caller: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L6](#l6) Bind <code>node</code>: call the named operation with the supplied arguments: <code>unwrap(input)</code>.
- [L6](#l6) If <code>node.type!=='ObjectExpression'</code> is truthy:
  - [L6](#l6) Return undefined immediately; remaining statements in this function do not execute.
- [L7](#l7) Bind <code>entries</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L8](#l8) Iterate <code>(node as ObjectExpression).properties</code> values, binding <code>const item</code> for each iteration:
  - [L9](#l9) If <code>item.type!=='Property' &#124;&#124; item.computed &#124;&#124; item.kind!=='init' &#124;&#124; item.method</code> is truthy:
    - [L9](#l9) Return undefined immediately; remaining statements in this function do not execute.
  - [L10](#l10) Bind <code>key</code>: test <code>item.key.type==='Identifier'</code>; choose <code>item.key.name</code> when truthy, otherwise <code>item.key.type==='Literal'?item.key.value:undefined</code>.
  - [L11](#l11) If <code>typeof key!=='string' &#124;&#124; key==='__proto__'</code> is truthy:
    - [L11](#l11) Return undefined immediately; remaining statements in this function do not execute.
  - [L12](#l12) store/replace a keyed entry in the Map: <code>entries.set(key,unwrap(item.value))</code>.
- [L14](#l14) Return to the caller: evaluate <code>entries</code>.

<a id="fn-904"></a>
### string (16:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:Node&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: test <code>node?.type==='Literal' &amp;&amp; typeof (node as Literal).value==='string'</code>; choose <code>(node as Literal).value as string</code> when truthy, otherwise <code>undefined</code>.

<a id="fn-1047"></a>
### extractAxiosCalls (17:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>syntax:'javascript'&#124;'typescript'&#124;'tsx'='javascript'</code>: when omitted/undefined, initialize with <code>'javascript'</code>.

Local bindings (nested callback locals are documented with that callback):

- [L18](#l18) <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,syntax)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L18](#l18) <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L19](#l19) <code>imports</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L20](#l20) <code>{node}</code>: receive the next iterable value from <code>nodes</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L22](#l22) <code>declaration</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
- [L28](#l28) <code>aliases</code>: construct <code>Set</code> using <code>['axios',...imports.keys()]</code>; this creates the local instance used below.
- [L28](#l28) <code>ambiguous</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L29](#l29) <code>callees</code>: construct <code>Set</code> using <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').map(entry=&gt;(entry.node as CallExpression).callee)</code>; this creates the local instance used below.
- [L30](#l30) <code>{node,parent}</code>: receive the next iterable value from <code>nodes</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L32](#l32) <code>name</code>: read <code>(node as Identifier).name</code>.
- [L38](#l38) <code>alias</code>: receive the next iterable value from <code>aliases</code> at the start of each loop iteration.
- [L40](#l40) <code>{node}</code>: receive the next iterable value from <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').sort((a,b)=&gt;a.node.start-b.node.start)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L41](#l41) <code>invocation</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
- [L41](#l41) <code>callee</code>: read <code>invocation.callee</code>.
- [L42](#l42) <code>receiver</code>: test <code>callee.type==='MemberExpression'</code>; choose <code>(callee as MemberExpression).object</code> when truthy, otherwise <code>callee</code>.
- [L44](#l44) <code>method</code>: test <code>callee.type==='MemberExpression' &amp;&amp; !callee.computed &amp;&amp; callee.property.type==='Identifier'</code>; choose <code>callee.property.name</code> when truthy, otherwise <code>callee.type==='Identifier'?'call':''</code>.
- [L46](#l46) <code>line</code>: read <code>node.loc!.start.line</code>.
- [L46](#l46) <code>excerpt</code>: concatenate the elements with the supplied separator: <code>source.split(/\r\n&#124;\n&#124;\r/).slice(line-1,node.loc!.end.line).join('\n')</code>.
- [L48](#l48) <code>call:CallObservation</code>: create an object with 2 property/spread entries: <code>{line,excerpt}</code>; later properties overwrite earlier spread values.
- [L51](#l51) <code>args</code>: transform each element into a new array: <code>invocation.arguments.map(unwrap)</code>.
- [L51](#l51) <code>options:Map&lt;string,Node&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
- [L51](#l51) <code>url:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L51](#l51) <code>verb:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L56](#l56) <code>body</code>: call the named operation with the supplied arguments: <code>['post','put','patch'].includes(method)</code>.
- [L56](#l56) <code>index</code>: test <code>body</code>; choose <code>2</code> when truthy, otherwise <code>1</code>.
- [L64](#l64) <code>params</code>: call the named operation with the supplied arguments: <code>options.get('params')</code>.
- [L65](#l65) <code>query</code>: call the named operation with the supplied arguments: <code>properties(params)</code>.
- [L67](#l67) <code>[key,value]</code>: receive the next iterable value from <code>query</code> at the start of each loop iteration; destructure that value into the displayed names.

Execution:

- [L18](#l18) Bind <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,syntax)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L18](#l18) Bind <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L18](#l18) If <code>issues.length</code> is truthy:
  - [L18](#l18) Return to the caller: evaluate <code>result</code>.
- [L19](#l19) Bind <code>imports</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L20](#l20) Iterate <code>nodes</code> values, binding <code>const {node}</code> for each iteration:
  - [L21](#l21) If <code>node.type==='ImportDeclaration' &amp;&amp; (node as ImportDeclaration).source.value==='axios'</code> is truthy:
    - [L22](#l22) Bind <code>declaration</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
    - [L23](#l23) If <code>declaration.specifiers.length===1 &amp;&amp; declaration.specifiers[0]?.type==='ImportDefaultSpecifier'</code> is truthy:
      - [L23](#l23) store/replace a keyed entry in the Map: <code>imports.set(declaration.specifiers[0].local.name,declaration.specifiers[0])</code>.
    - [L23](#l23) Otherwise:
      - [L24](#l24) append values to the existing array: <code>result.issues.push('unsupported-axios-import')</code>.
  - [L26](#l26) If <code>node.type==='CallExpression' &amp;&amp; (node as CallExpression).callee.type==='Identifier' &amp;&amp; ((node as CallExpression).callee as Identifier).name==='require' &amp;&amp; string((node as CallExpression).arguments[0])==='axios'</code> is truthy:
    - [L26](#l26) append values to the existing array: <code>result.issues.push('unsupported-axios-import')</code>.
- [L28](#l28) Bind <code>aliases</code>: construct <code>Set</code> using <code>['axios',...imports.keys()]</code>; this creates the local instance used below.
- [L28](#l28) Bind <code>ambiguous</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L29](#l29) Bind <code>callees</code>: construct <code>Set</code> using <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').map(entry=&gt;(entry.node as CallExpression).callee)</code>; this creates the local instance used below.
- [L30](#l30) Iterate <code>nodes</code> values, binding <code>const {node,parent}</code> for each iteration:
  - [L31](#l31) If <code>node.type!=='Identifier' &#124;&#124; !aliases.has((node as Identifier).name)</code> is truthy:
    - [L31](#l31) Skip the rest of this iteration and advance the enclosing loop.
  - [L32](#l32) Bind <code>name</code>: read <code>(node as Identifier).name</code>.
  - [L33](#l33) If <code>parent===imports.get(name) &amp;&amp; (parent as ImportDefaultSpecifier).local===node</code> is truthy:
    - [L33](#l33) Skip the rest of this iteration and advance the enclosing loop.
  - [L34](#l34) If <code>parent?.type==='CallExpression' &amp;&amp; (parent as CallExpression).callee===node</code> is truthy:
    - [L34](#l34) Skip the rest of this iteration and advance the enclosing loop.
  - [L35](#l35) If <code>parent?.type==='MemberExpression' &amp;&amp; (parent as MemberExpression).object===node &amp;&amp; callees.has(parent)</code> is truthy:
    - [L35](#l35) Skip the rest of this iteration and advance the enclosing loop.
  - [L36](#l36) insert a unique value in the Set: <code>ambiguous.add(name)</code>.
- [L38](#l38) If <code>nodes.some(({node})=&gt;node.type==='CallExpression' &amp;&amp; (node as CallExpression).callee.type==='Identifier' &amp;&amp; ((node as CallExpression).callee as Identifier).name==='eval')</code> is truthy:
  - [L38](#l38) Iterate <code>aliases</code> values, binding <code>const alias</code> for each iteration:
    - [L38](#l38) insert a unique value in the Set: <code>ambiguous.add(alias)</code>.
- [L39](#l39) If <code>ambiguous.size</code> is truthy:
  - [L39](#l39) append values to the existing array: <code>result.issues.push('axios-binding-or-configuration-unresolved')</code>.
- [L40](#l40) Iterate <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').sort((a,b)=&gt;a.node.start-b.node.start)</code> values, binding <code>const {node}</code> for each iteration:
  - [L41](#l41) Bind <code>invocation</code>: evaluate <code>node</code>; the TypeScript assertion adds no runtime validation.
  - [L41](#l41) Bind <code>callee</code>: read <code>invocation.callee</code>.
  - [L42](#l42) Bind <code>receiver</code>: test <code>callee.type==='MemberExpression'</code>; choose <code>(callee as MemberExpression).object</code> when truthy, otherwise <code>callee</code>.
  - [L43](#l43) If <code>receiver.type!=='Identifier' &#124;&#124; !aliases.has(receiver.name)</code> is truthy:
    - [L43](#l43) Skip the rest of this iteration and advance the enclosing loop.
  - [L44](#l44) Bind <code>method</code>: test <code>callee.type==='MemberExpression' &amp;&amp; !callee.computed &amp;&amp; callee.property.type==='Identifier'</code>; choose <code>callee.property.name</code> when truthy, otherwise <code>callee.type==='Identifier'?'call':''</code>.
  - [L45](#l45) If <code>result.calls.length&gt;=128</code> is truthy:
    - [L45](#l45) append values to the existing array: <code>result.issues.push('call-count-limit')</code>.
    - [L45](#l45) Leave the enclosing loop/switch.
  - [L46](#l46) Bind <code>line</code>: read <code>node.loc!.start.line</code>.
  - [L46](#l46) Bind <code>excerpt</code>: concatenate the elements with the supplied separator: <code>source.split(/\r\n&#124;\n&#124;\r/).slice(line-1,node.loc!.end.line).join('\n')</code>.
  - [L47](#l47) If <code>excerpt.length&gt;2048</code> is truthy:
    - [L47](#l47) append values to the existing array: <code>result.issues.push('source-excerpt-limit')</code>.
    - [L47](#l47) Skip the rest of this iteration and advance the enclosing loop.
  - [L48](#l48) Bind <code>call:CallObservation</code>: create an object with 2 property/spread entries: <code>{line,excerpt}</code>; later properties overwrite earlier spread values.
  - [L48](#l48) append values to the existing array: <code>result.calls.push(call)</code>.
  - [L49](#l49) If <code>!imports.has(receiver.name) &#124;&#124; ambiguous.has(receiver.name)</code> is truthy:
    - [L49](#l49) update <code>call.reason</code> with <code>'axios-binding-or-configuration-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L49](#l49) Skip the rest of this iteration and advance the enclosing loop.
  - [L50](#l50) If <code>invocation.optional &#124;&#124; !['call','request','get','head','options','delete','post','put','patch'].includes(method)</code> is truthy:
    - [L50](#l50) update <code>call.reason</code> with <code>'unsupported-axios-operation'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L50](#l50) Skip the rest of this iteration and advance the enclosing loop.
  - [L51](#l51) Bind <code>args</code>: transform each element into a new array: <code>invocation.arguments.map(unwrap)</code>.
  - [L51](#l51) Bind <code>options:Map&lt;string,Node&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
  - [L51](#l51) Bind <code>url:string&#124;undefined</code>: leave the value undefined until a later assignment.
  - [L51](#l51) Bind <code>verb:string&#124;undefined</code>: leave the value undefined until a later assignment.
  - [L52](#l52) If <code>method==='request' &#124;&#124; method==='call' &amp;&amp; args[0]?.type==='ObjectExpression'</code> is truthy:
    - [L53](#l53) If <code>args.length!==1</code> is truthy:
      - [L53](#l53) update <code>call.reason</code> with <code>'unsupported-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L53](#l53) Skip the rest of this iteration and advance the enclosing loop.
    - [L54](#l54) update <code>options</code> with <code>properties(args[0])</code> using <code>=</code>; this mutation is visible to later statements.
    - [L54](#l54) update <code>url</code> with <code>string(options?.get('url'))</code> using <code>=</code>; this mutation is visible to later statements.
    - [L54](#l54) update <code>verb</code> with <code>options?.has('method')?string(options.get('method')):'GET'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L52](#l52) Otherwise:
    - [L56](#l56) Bind <code>body</code>: call the named operation with the supplied arguments: <code>['post','put','patch'].includes(method)</code>.
    - [L56](#l56) Bind <code>index</code>: test <code>body</code>; choose <code>2</code> when truthy, otherwise <code>1</code>.
    - [L57](#l57) If <code>!args.length &#124;&#124; args.length&gt;index+1</code> is truthy:
      - [L57](#l57) update <code>call.reason</code> with <code>'unsupported-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L57](#l57) Skip the rest of this iteration and advance the enclosing loop.
    - [L58](#l58) update <code>url</code> with <code>string(args[0])</code> using <code>=</code>; this mutation is visible to later statements.
    - [L58](#l58) update <code>options</code> with <code>properties(args[index])</code> using <code>=</code>; this mutation is visible to later statements.
    - [L58](#l58) update <code>verb</code> with <code>method==='call'?(options?.has('method')?string(options.get('method')):'GET'):method</code> using <code>=</code>; this mutation is visible to later statements.
    - [L59](#l59) If <code>options?.has('url') &#124;&#124; method!=='call' &amp;&amp; options?.has('method')</code> is truthy:
      - [L59](#l59) update <code>call.reason</code> with <code>'unsupported-axios-config-override'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L59](#l59) Skip the rest of this iteration and advance the enclosing loop.
  - [L61](#l61) If <code>!options &#124;&#124; [...options.keys()].some(key=&gt;!['url','method','params','data','headers','timeout','signal','responseType'].includes(key))</code> is truthy:
    - [L61](#l61) update <code>call.reason</code> with <code>'unsupported-or-dynamic-axios-config'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L61](#l61) Skip the rest of this iteration and advance the enclosing loop.
  - [L62](#l62) If <code>url===undefined</code> is truthy:
    - [L62](#l62) update <code>call.reason</code> with <code>'dynamic-url'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L62](#l62) Skip the rest of this iteration and advance the enclosing loop.
  - [L62](#l62) update <code>call.url</code> with <code>url</code> using <code>=</code>; this mutation is visible to later statements.
  - [L63](#l63) If <code>verb===undefined</code> is truthy:
    - [L63](#l63) update <code>call.reason</code> with <code>'dynamic-method'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L63](#l63) Skip the rest of this iteration and advance the enclosing loop.
  - [L63](#l63) update <code>call.method</code> with <code>verb.toUpperCase()</code> using <code>=</code>; this mutation is visible to later statements.
  - [L64](#l64) Bind <code>params</code>: call the named operation with the supplied arguments: <code>options.get('params')</code>.
  - [L64](#l64) If <code>!params &#124;&#124; params.type==='Literal' &amp;&amp; (params as Literal).value===null</code> is truthy:
    - [L64](#l64) Skip the rest of this iteration and advance the enclosing loop.
  - [L65](#l65) Bind <code>query</code>: call the named operation with the supplied arguments: <code>properties(params)</code>.
  - [L65](#l65) If <code>!query</code> is truthy:
    - [L65](#l65) update <code>call.reason</code> with <code>'dynamic-query-parameters'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L65](#l65) Skip the rest of this iteration and advance the enclosing loop.
  - [L66](#l66) update <code>call.queryNames</code> with <code>[]</code> using <code>=</code>; this mutation is visible to later statements.
  - [L67](#l67) Iterate <code>query</code> values, binding <code>const [key,value]</code> for each iteration:
    - [L68](#l68) If <code>value.type!=='Literal' &#124;&#124; !['string','number','boolean'].includes(typeof (value as Literal).value) &amp;&amp; (value as Literal).value!==null</code> is truthy:
      - [L68](#l68) update <code>call.reason</code> with <code>'dynamic-query-parameters'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L68](#l68) Leave the enclosing loop/switch.
    - [L69](#l69) If <code>(value as Literal).value!==null</code> is truthy:
      - [L69](#l69) append values to the existing array: <code>call.queryNames.push(key)</code>.
- [L72](#l72) update <code>result.issues</code> with <code>[...new Set(result.issues)]</code> using <code>=</code>; this mutation is visible to later statements.
- [L72](#l72) Return to the caller: evaluate <code>result</code>.

<a id="fn-2144"></a>
### nodes.filter callback (29:44)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>entry</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: compute <code>entry.node.type==='CallExpression'</code> with the <code>===</code> operator.

<a id="fn-2191"></a>
### nodes.filter(entry=&gt;entry.node.type==='CallExpression').map callback (29:91)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>entry</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: read <code>(entry.node as CallExpression).callee</code>.

<a id="fn-2757"></a>
### nodes.some callback (38:17)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{node}</code>: destructure the supplied value into these local bindings.

Execution:

[L38](#l38) Implicitly return: evaluate <code>node.type==='CallExpression' &amp;&amp; (node as CallExpression).callee.type==='Identifier' &amp;&amp; ((node as CallExpression).callee as Identifier).name==='eval'</code> left to right with falsy short-circuiting.

<a id="fn-3086"></a>
### nodes.filter callback (40:36)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>entry</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: compute <code>entry.node.type==='CallExpression'</code> with the <code>===</code> operator.

<a id="fn-3134"></a>
### nodes.filter(entry=&gt;entry.node.type==='CallExpression').sort callback (40:84)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>nodes.filter(entry=&gt;entry.node.type==='CallExpression').sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: compute <code>a.node.start-b.node.start</code> with the <code>-</code> operator.

<a id="fn-5172"></a>
### [...options.keys()].some callback (61:45)

Synchronous function. Lexically inside [extractAxiosCalls (17:8)](#fn-1047). Passed to <code>[...options.keys()].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>key</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L61](#l61) Implicitly return: apply <code>!</code> to <code>['url','method','params','data','headers','timeout','signal','responseType'].includes(key)</code>.

<a id="fn-6120"></a>
### extractJavascriptHttpCalls (74:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L75](#l75) <code>syntax</code>: test <code>path.endsWith('.tsx')</code>; choose <code>'tsx'</code> when truthy, otherwise <code>/\.(?:ts&#124;mts&#124;cts)$/.test(path)?'typescript':'javascript'</code>.
- [L76](#l76) <code>fetch</code>: call the named operation with the supplied arguments: <code>extractFetchCalls(source,syntax)</code>.
- [L76](#l76) <code>axios</code>: call the named operation with the supplied arguments: <code>extractAxiosCalls(source,syntax)</code>.
- [L77](#l77) <code>calls</code>: sort the receiver array in place using the comparator: <code>[...fetch.calls,...axios.calls].sort((a,b)=&gt;a.line-b.line)</code>.

Execution:

- [L75](#l75) Bind <code>syntax</code>: test <code>path.endsWith('.tsx')</code>; choose <code>'tsx'</code> when truthy, otherwise <code>/\.(?:ts&#124;mts&#124;cts)$/.test(path)?'typescript':'javascript'</code>.
- [L76](#l76) Bind <code>fetch</code>: call the named operation with the supplied arguments: <code>extractFetchCalls(source,syntax)</code>.
- [L76](#l76) Bind <code>axios</code>: call the named operation with the supplied arguments: <code>extractAxiosCalls(source,syntax)</code>.
- [L77](#l77) Bind <code>calls</code>: sort the receiver array in place using the comparator: <code>[...fetch.calls,...axios.calls].sort((a,b)=&gt;a.line-b.line)</code>.
- [L78](#l78) Return to the caller: create an object with 2 property/spread entries: <code>{calls:calls.slice(0,128),issues:[...new Set([...fetch.issues,...axios.issues,...(calls.length&gt;128?['call-count-limit']:[])])]}</code>; later properties overwrite earlier spread values.

<a id="fn-6439"></a>
### [...fetch.calls,...axios.calls].sort callback (77:52)

Synchronous function. Lexically inside [extractJavascriptHttpCalls (74:8)](#fn-6120). Passed to <code>[...fetch.calls,...axios.calls].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L77](#l77) Implicitly return: compute <code>a.line-b.line</code> with the <code>-</code> operator.

## Module bindings

- [L16](#l16) <code>string</code>: create [string (16:14)](#fn-904); its body runs when called, not when this value is created.

## Directly importing tests

- [additional-http-clients.test.ts](../../test/additional-http-clients.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l14"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import type {Node,CallExpression,Identifier,Literal,MemberExpression,ObjectExpression,ImportDeclaration,ImportDefaultSpecifier} from 'acorn';
   2 | import {extractFetchCalls,parseHttpSyntax,unwrap} from './fetch-calls.js';
   3 | import type {CallExtraction,CallObservation} from './contract-adapter-types.js';
   4 | 
   5 | function properties(input:Node|undefined):Map<string,Node>|undefined {
   6 |   if(!input)return new Map();const node=unwrap(input);if(node.type!=='ObjectExpression')return;
   7 |   const entries=new Map<string,Node>();
   8 |   for(const item of (node as ObjectExpression).properties) {
   9 |     if(item.type!=='Property' || item.computed || item.kind!=='init' || item.method)return;
  10 |     const key=item.key.type==='Identifier'?item.key.name:item.key.type==='Literal'?item.key.value:undefined;
  11 |     if(typeof key!=='string' || key==='__proto__')return;
  12 |     entries.set(key,unwrap(item.value));
  13 |   }
  14 |   return entries;
  15 | }
  16 | const string=(node:Node|undefined)=>node?.type==='Literal' && typeof (node as Literal).value==='string'?(node as Literal).value as string:undefined;
  17 | export function extractAxiosCalls(source:string,syntax:'javascript'|'typescript'|'tsx'='javascript'):CallExtraction {
  18 |   const {nodes,issues}=parseHttpSyntax(source,syntax),result:CallExtraction={calls:[],issues};if(issues.length)return result;
  19 |   const imports=new Map<string,Node>();
  20 |   for(const {node} of nodes) {
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l26"></a>
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
  21 |     if(node.type==='ImportDeclaration' && (node as ImportDeclaration).source.value==='axios') {
  22 |       const declaration=node as ImportDeclaration;
  23 |       if(declaration.specifiers.length===1 && declaration.specifiers[0]?.type==='ImportDefaultSpecifier')imports.set(declaration.specifiers[0].local.name,declaration.specifiers[0]);
  24 |       else result.issues.push('unsupported-axios-import');
  25 |     }
  26 |     if(node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='require' && string((node as CallExpression).arguments[0])==='axios')result.issues.push('unsupported-axios-import');
  27 |   }
  28 |   const aliases=new Set(['axios',...imports.keys()]),ambiguous=new Set<string>();
  29 |   const callees=new Set<Node>(nodes.filter(entry=>entry.node.type==='CallExpression').map(entry=>(entry.node as CallExpression).callee));
  30 |   for(const {node,parent} of nodes) {
  31 |     if(node.type!=='Identifier' || !aliases.has((node as Identifier).name))continue;
  32 |     const name=(node as Identifier).name;
  33 |     if(parent===imports.get(name) && (parent as ImportDefaultSpecifier).local===node)continue;
  34 |     if(parent?.type==='CallExpression' && (parent as CallExpression).callee===node)continue;
  35 |     if(parent?.type==='MemberExpression' && (parent as MemberExpression).object===node && callees.has(parent))continue;
  36 |     ambiguous.add(name);
  37 |   }
  38 |   if(nodes.some(({node})=>node.type==='CallExpression' && (node as CallExpression).callee.type==='Identifier' && ((node as CallExpression).callee as Identifier).name==='eval'))for(const alias of aliases)ambiguous.add(alias);
  39 |   if(ambiguous.size)result.issues.push('axios-binding-or-configuration-unresolved');
  40 |   for(const {node} of nodes.filter(entry=>entry.node.type==='CallExpression').sort((a,b)=>a.node.start-b.node.start)) {
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

```text
  41 |     const invocation=node as CallExpression,callee=invocation.callee;
  42 |     const receiver=callee.type==='MemberExpression'?(callee as MemberExpression).object:callee;
  43 |     if(receiver.type!=='Identifier' || !aliases.has(receiver.name))continue;
  44 |     const method=callee.type==='MemberExpression' && !callee.computed && callee.property.type==='Identifier'?callee.property.name:callee.type==='Identifier'?'call':'';
  45 |     if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
  46 |     const line=node.loc!.start.line,excerpt=source.split(/\r\n|\n|\r/).slice(line-1,node.loc!.end.line).join('\n');
  47 |     if(excerpt.length>2048){result.issues.push('source-excerpt-limit');continue;}
  48 |     const call:CallObservation={line,excerpt};result.calls.push(call);
  49 |     if(!imports.has(receiver.name) || ambiguous.has(receiver.name)){call.reason='axios-binding-or-configuration-unresolved';continue;}
  50 |     if(invocation.optional || !['call','request','get','head','options','delete','post','put','patch'].includes(method)){call.reason='unsupported-axios-operation';continue;}
  51 |     const args=invocation.arguments.map(unwrap);let options:Map<string,Node>|undefined,url:string|undefined,verb:string|undefined;
  52 |     if(method==='request' || method==='call' && args[0]?.type==='ObjectExpression') {
  53 |       if(args.length!==1){call.reason='unsupported-arguments';continue;}
  54 |       options=properties(args[0]);url=string(options?.get('url'));verb=options?.has('method')?string(options.get('method')):'GET';
  55 |     } else {
  56 |       const body=['post','put','patch'].includes(method),index=body?2:1;
  57 |       if(!args.length || args.length>index+1){call.reason='unsupported-arguments';continue;}
  58 |       url=string(args[0]);options=properties(args[index]);verb=method==='call'?(options?.has('method')?string(options.get('method')):'GET'):method;
  59 |       if(options?.has('url') || method!=='call' && options?.has('method')){call.reason='unsupported-axios-config-override';continue;}
  60 |     }
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l72"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>

```text
  61 |     if(!options || [...options.keys()].some(key=>!['url','method','params','data','headers','timeout','signal','responseType'].includes(key))){call.reason='unsupported-or-dynamic-axios-config';continue;}
  62 |     if(url===undefined){call.reason='dynamic-url';continue;}call.url=url;
  63 |     if(verb===undefined){call.reason='dynamic-method';continue;}call.method=verb.toUpperCase();
  64 |     const params=options.get('params');if(!params || params.type==='Literal' && (params as Literal).value===null)continue;
  65 |     const query=properties(params);if(!query){call.reason='dynamic-query-parameters';continue;}
  66 |     call.queryNames=[];
  67 |     for(const [key,value] of query) {
  68 |       if(value.type!=='Literal' || !['string','number','boolean'].includes(typeof (value as Literal).value) && (value as Literal).value!==null){call.reason='dynamic-query-parameters';break;}
  69 |       if((value as Literal).value!==null)call.queryNames.push(key);
  70 |     }
  71 |   }
  72 |   result.issues=[...new Set(result.issues)];return result;
  73 | }
  74 | export function extractJavascriptHttpCalls(source:string,path:string):CallExtraction {
  75 |   const syntax=path.endsWith('.tsx')?'tsx':/\.(?:ts|mts|cts)$/.test(path)?'typescript':'javascript';
  76 |   const fetch=extractFetchCalls(source,syntax),axios=extractAxiosCalls(source,syntax);
  77 |   const calls=[...fetch.calls,...axios.calls].sort((a,b)=>a.line-b.line);
  78 |   return {calls:calls.slice(0,128),issues:[...new Set([...fetch.issues,...axios.issues,...(calls.length>128?['call-count-limit']:[])])]};
  79 | }
  80 | 
```
