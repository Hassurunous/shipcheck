# src/sdk-syntax.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

indexSdkDeclarations projects top-level exported declare functions into named overload lists of primitive required/optional parameters, bounded by declaration/overload limits. compareSdkCalls establishes named imports, rejects ambiguous identifier uses and compares direct call arity and literal primitive types with supported overloads. It only calls an absent symbol a mismatch when the index is complete; dynamic values and unsupported signatures preserve uncertainty.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `2628ac2630b6825a27561c9743ff48c97d1942eb6c94b81535264ddc84c6cdaa`.

This chapter inventories **21 function bodies/callbacks**, **28 variable declarations**, and **5 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./fetch-calls.js</code>: <code>parseHttpSyntax</code>.

## Module execution

- [L8](#l8) Bind <code>primitiveKinds:Record&lt;string,Primitive&#124;undefined&gt;</code>: create an object with 3 property/spread entries: <code>{TSStringKeyword:'string',TSNumberKeyword:'number',TSBooleanKeyword:'boolean'}</code>; later properties overwrite earlier spread values.
- [L11](#l11) Bind <code>evidence</code>: create [evidence (11:16)](#fn-872); its body runs when called, not when this value is created.

## Function index

- [evidence (11:16)](#fn-872)
- [indexSdkDeclarations (12:8)](#fn-1011)
- [(fn.params ?? []).map callback (25:46)](#fn-1809)
- [(fn.params ?? []).every callback (27:98)](#fn-2048)
- [parameters.every callback (28:29)](#fn-2121)
- [parameters.every callback (28:72)](#fn-2164)
- [parameters.slice(0,i).some callback (28:121)](#fn-2213)
- [primitive (39:1)](#fn-2996)
- [compareSdkCalls (44:8)](#fn-3501)
- [[...bindings.keys()].filter callback (57:55)](#fn-4531)
- [entries.some callback (57:74)](#fn-4550)
- [entries.sort callback (60:36)](#fn-4824)
- [(signatures ?? []).filter callback (65:150)](#fn-5399)
- [(signatures ?? []).filter(s=&gt;s.excerpt.length&lt;=2048).map callback (65:181)](#fn-5430)
- [args.some callback (69:18)](#fn-5795)
- [signatures.filter callback (70:40)](#fn-5873)
- [s.parameters.filter callback (70:91)](#fn-5924)
- [compatible.some callback (71:24)](#fn-6008)
- [types.every callback (71:39)](#fn-6023)
- [signatures.every callback (72:30)](#fn-6299)
- [types.every callback (72:84)](#fn-6353)

<a id="fn-872"></a>
### evidence (11:16)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>node:Ast</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L11](#l11) Implicitly return: create an object with 2 property/spread entries: <code>{line:source.slice(0,node.start).split(/\r\n&#124;\n&#124;\r/).length,excerpt:source.slice(node.start,node.end)}</code>; later properties overwrite earlier spread values.

<a id="fn-1011"></a>
### indexSdkDeclarations (12:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,'typescript')</code>.
- [L14](#l14) <code>result:SdkIndex</code>: create an object with 3 property/spread entries: <code>{symbols:new Map(),complete:!parsed.issues.length,issues:[...parsed.issues]}</code>; later properties overwrite earlier spread values.
- [L15](#l15) <code>signatureCount</code>: use the literal <code>0</code>.
- [L16](#l16) <code>entry</code>: receive the next iterable value from <code>parsed.nodes</code> at the start of each loop iteration.
- [L18](#l18) <code>node</code>: read <code>entry.node</code>; the TypeScript assertion adds no runtime validation; the TypeScript assertion adds no runtime validation.
- [L20](#l20) <code>fn</code>: read <code>node.declaration</code>.
- [L20](#l20) <code>name</code>: read <code>fn.id?.name</code>; optional access returns undefined when its receiver is null/undefined.
- [L25](#l25) <code>parameters</code>: transform each element into a new array: <code>(fn.params ?? []).map(p=&gt;({kind:primitiveKinds[p.typeAnnotation?.typeAnnotation?.type ?? ''],optional:p.optional===true}))</code>.
- [L26](#l26) <code>cite</code>: call the named operation with the supplied arguments: <code>evidence(source,node)</code>.
- [L27](#l27) <code>supported</code>: evaluate <code>!fn.typeParameters &amp;&amp; cite.excerpt.length&lt;=2048 &amp;&amp; (fn.params ?? []).every(p=&gt;p.type==='Identifier' &amp;&amp; p.name!=='this') &amp;&amp; parameters.every(p=&gt;p.kind!==undefined) &amp;&amp; parameters.every((p,i)=&gt;p.optional &#124;&#124; !parameters.slice(0,i).some(before=&gt;before.optional))</code> left to right with falsy short-circuiting.

Execution:

- [L13](#l13) Bind <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,'typescript')</code>.
- [L14](#l14) Bind <code>result:SdkIndex</code>: create an object with 3 property/spread entries: <code>{symbols:new Map(),complete:!parsed.issues.length,issues:[...parsed.issues]}</code>; later properties overwrite earlier spread values.
- [L15](#l15) Bind <code>signatureCount</code>: use the literal <code>0</code>.
- [L16](#l16) Iterate <code>parsed.nodes</code> values, binding <code>const entry</code> for each iteration:
  - [L17](#l17) If <code>entry.parent?.type!=='Program'</code> is truthy:
    - [L17](#l17) Skip the rest of this iteration and advance the enclosing loop.
  - [L18](#l18) Bind <code>node</code>: read <code>entry.node</code>; the TypeScript assertion adds no runtime validation; the TypeScript assertion adds no runtime validation.
  - [L19](#l19) If <code>node.type==='ExportNamedDeclaration' &amp;&amp; node.declaration?.type==='TSDeclareFunction'</code> is truthy:
    - [L20](#l20) Bind <code>fn</code>: read <code>node.declaration</code>.
    - [L20](#l20) Bind <code>name</code>: read <code>fn.id?.name</code>; optional access returns undefined when its receiver is null/undefined.
    - [L21](#l21) If <code>!name</code> is truthy:
      - [L21](#l21) update <code>result.complete</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
      - [L21](#l21) Skip the rest of this iteration and advance the enclosing loop.
    - [L22](#l22) If <code>++signatureCount&gt;256 &#124;&#124; (result.symbols.get(name)?.length ?? 0)&gt;=16</code> is truthy:
      - [L23](#l23) call the named operation with the supplied arguments: <code>result.symbols.clear()</code>.
      - [L23](#l23) update <code>result.complete</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
      - [L23](#l23) append values to the existing array: <code>result.issues.push('declaration-count-limit')</code>.
      - [L23](#l23) Leave the enclosing loop/switch.
    - [L25](#l25) Bind <code>parameters</code>: transform each element into a new array: <code>(fn.params ?? []).map(p=&gt;({kind:primitiveKinds[p.typeAnnotation?.typeAnnotation?.type ?? ''],optional:p.optional===true}))</code>.
    - [L26](#l26) Bind <code>cite</code>: call the named operation with the supplied arguments: <code>evidence(source,node)</code>.
    - [L27](#l27) Bind <code>supported</code>: evaluate <code>!fn.typeParameters &amp;&amp; cite.excerpt.length&lt;=2048 &amp;&amp; (fn.params ?? []).every(p=&gt;p.type==='Identifier' &amp;&amp; p.name!=='this') &amp;&amp; parameters.every(p=&gt;p.kind!==undefined) &amp;&amp; parameters.every((p,i)=&gt;p.optional &#124;&#124; !parameters.slice(0,i).some(before=&gt;before.optional))</code> left to right with falsy short-circuiting.
    - [L29](#l29) store/replace a keyed entry in the Map: <code>result.symbols.set(name,[...(result.symbols.get(name) ?? []),{...cite,parameters,supported}])</code>.
  - [L19](#l19) Otherwise:
    - [L30](#l30) If <code>['ExportNamedDeclaration','ExportAllDeclaration','ExportDefaultDeclaration','TSExportAssignment','TSModuleDeclaration'].includes(node.type)</code> is truthy:
      - [L31](#l31) update <code>result.complete</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
      - [L31](#l31) append values to the existing array: <code>result.issues.push('unsupported-declaration-export')</code>.
- [L34](#l34) If <code>!result.symbols.size</code> is truthy:
  - [L34](#l34) update <code>result.complete</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
  - [L34](#l34) append values to the existing array: <code>result.issues.push('no-supported-function-declarations')</code>.
- [L35](#l35) If <code>/\/\/\/\s*&lt;reference\b/.test(source)</code> is truthy:
  - [L35](#l35) update <code>result.complete</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
  - [L35](#l35) append values to the existing array: <code>result.issues.push('declaration-reference-unresolved')</code>.
- [L36](#l36) Return to the caller: evaluate <code>result</code>.

<a id="fn-1809"></a>
### (fn.params ?? []).map callback (25:46)

Synchronous function. Lexically inside [indexSdkDeclarations (12:8)](#fn-1011). Passed to <code>(fn.params ?? []).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: create an object with 2 property/spread entries: <code>{kind:primitiveKinds[p.typeAnnotation?.typeAnnotation?.type ?? ''],optional:p.optional===true}</code>; later properties overwrite earlier spread values.

<a id="fn-2048"></a>
### (fn.params ?? []).every callback (27:98)

Synchronous function. Lexically inside [indexSdkDeclarations (12:8)](#fn-1011). Passed to <code>(fn.params ?? []).every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L27](#l27) Implicitly return: evaluate <code>p.type==='Identifier' &amp;&amp; p.name!=='this'</code> left to right with falsy short-circuiting.

<a id="fn-2121"></a>
### parameters.every callback (28:29)

Synchronous function. Lexically inside [indexSdkDeclarations (12:8)](#fn-1011). Passed to <code>parameters.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: compute <code>p.kind!==undefined</code> with the <code>!==</code> operator.

<a id="fn-2164"></a>
### parameters.every callback (28:72)

Synchronous function. Lexically inside [indexSdkDeclarations (12:8)](#fn-1011). Passed to <code>parameters.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: evaluate <code>p.optional &#124;&#124; !parameters.slice(0,i).some(before=&gt;before.optional)</code> left to right with truthy short-circuiting.

<a id="fn-2213"></a>
### parameters.slice(0,i).some callback (28:121)

Synchronous function. Lexically inside [parameters.every callback (28:72)](#fn-2164). Passed to <code>parameters.slice(0,i).some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>before</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: read <code>before.optional</code>.

<a id="fn-2996"></a>
### primitive (39:1)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:Ast</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L40](#l40) Repeat while <code>['TSAsExpression','TSTypeAssertion','TSNonNullExpression','TSSatisfiesExpression'].includes(node.type) &amp;&amp; node.expression</code>:
  - [L40](#l40) update <code>node</code> with <code>node.expression</code> using <code>=</code>; this mutation is visible to later statements.
- [L41](#l41) If <code>node.type==='Literal' &amp;&amp; ['string','number','boolean'].includes(typeof node.value)</code> is truthy:
  - [L41](#l41) Return to the caller: apply <code>typeof</code> to <code>node.value</code>; the TypeScript assertion adds no runtime validation.
- [L42](#l42) If <code>node.type==='UnaryExpression' &amp;&amp; ['+','-'].includes(node.operator!) &amp;&amp; node.argument?.type==='Literal' &amp;&amp; typeof node.argument.value==='number'</code> is truthy:
  - [L42](#l42) Return to the caller: use the literal <code>'number'</code>.

<a id="fn-3501"></a>
### compareSdkCalls (44:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>packageName:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>index:SdkIndex</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L45](#l45) <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,path.endsWith('.tsx')?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript')</code>.
- [L46](#l46) <code>entries</code>: read <code>parsed.nodes</code>; the TypeScript assertion adds no runtime validation; the TypeScript assertion adds no runtime validation.
- [L47](#l47) <code>issues</code>: create an array from <code>[...parsed.issues]</code>; spread elements insert the iterable values.
- [L47](#l47) <code>calls:Call[]</code>: create a new empty array to accumulate ordered results.
- [L47](#l47) <code>bindings</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L48](#l48) <code>{node}</code>: receive the next iterable value from <code>entries</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L50](#l50) <code>spec</code>: receive the next iterable value from <code>node.specifiers ?? []</code> at the start of each loop iteration.
- [L57](#l57) <code>ambiguous</code>: construct <code>Set</code> using <code>[...bindings.keys()].filter(name=&gt;entries.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; node.name===name &amp;&amp; !(parent?.type==='ImportSpecifier') &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; parent.callee===node)))</code>; this creates the local instance used below.
- [L60](#l60) <code>{node}</code>: receive the next iterable value from <code>entries.sort((a,b)=&gt;a.node.start-b.node.start)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L63](#l63) <code>cite</code>: call the named operation with the supplied arguments: <code>evidence(source,node)</code>.
- [L64](#l64) <code>symbol</code>: call the named operation with the supplied arguments: <code>bindings.get(node.callee.name!)</code>; the TypeScript assertion adds no runtime validation.
- [L64](#l64) <code>signatures</code>: call the named operation with the supplied arguments: <code>index.symbols.get(symbol)</code>.
- [L65](#l65) <code>call:Call</code>: create an object with 5 property/spread entries: <code>{...cite,symbol,status:'unresolved',reason:'Unsupported or dynamic call/declaration.',providerEvidence:(signatures ?? []).filter(s=&gt;s.excerpt.length&lt;=2048).map(s=&gt;({line:s.line,excerpt:s.excerpt}))}</code>; later properties overwrite earlier spread values.
- [L68](#l68) <code>args</code>: use <code>node.arguments</code> unless null/undefined, then evaluate <code>[]</code>.
- [L68](#l68) <code>types</code>: transform each element into a new array: <code>args.map(primitive)</code>.
- [L70](#l70) <code>compatible</code>: retain only elements whose callback returns a truthy value: <code>signatures.filter(s=&gt;s.supported &amp;&amp; args.length&gt;=s.parameters.filter(p=&gt;!p.optional).length &amp;&amp; args.length&lt;=s.parameters.length)</code>.

Execution:

- [L45](#l45) Bind <code>parsed</code>: call the named operation with the supplied arguments: <code>parseHttpSyntax(source,path.endsWith('.tsx')?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript')</code>.
- [L46](#l46) Bind <code>entries</code>: read <code>parsed.nodes</code>; the TypeScript assertion adds no runtime validation; the TypeScript assertion adds no runtime validation.
- [L47](#l47) Bind <code>issues</code>: create an array from <code>[...parsed.issues]</code>; spread elements insert the iterable values.
- [L47](#l47) Bind <code>calls:Call[]</code>: create a new empty array to accumulate ordered results.
- [L47](#l47) Bind <code>bindings</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L48](#l48) Iterate <code>entries</code> values, binding <code>const {node}</code> for each iteration:
  - [L49](#l49) If <code>node.type==='ImportDeclaration' &amp;&amp; node.source?.value===packageName</code> is truthy:
    - [L50](#l50) Iterate <code>node.specifiers ?? []</code> values, binding <code>const spec</code> for each iteration:
      - [L51](#l51) If <code>node.importKind==='type' &#124;&#124; spec.importKind==='type' &#124;&#124; spec.type!=='ImportSpecifier' &#124;&#124; !spec.local?.name &#124;&#124; !spec.imported?.name</code> is truthy:
        - [L51](#l51) append values to the existing array: <code>issues.push('unsupported-sdk-import')</code>.
      - [L51](#l51) Otherwise:
        - [L52](#l52) store/replace a keyed entry in the Map: <code>bindings.set(spec.local.name,spec.imported.name)</code>.
  - [L55](#l55) If <code>node.type==='ImportExpression' &#124;&#124; node.type==='CallExpression' &amp;&amp; node.callee?.name==='require' &amp;&amp; node.arguments?.[0]?.value===packageName</code> is truthy:
    - [L55](#l55) append values to the existing array: <code>issues.push('dynamic-or-commonjs-sdk-import')</code>.
- [L57](#l57) Bind <code>ambiguous</code>: construct <code>Set</code> using <code>[...bindings.keys()].filter(name=&gt;entries.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; node.name===name &amp;&amp; !(parent?.type==='ImportSpecifier') &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; parent.callee===node)))</code>; this creates the local instance used below.
- [L59](#l59) If <code>ambiguous.size</code> is truthy:
  - [L59](#l59) append values to the existing array: <code>issues.push('sdk-binding-or-alias-unresolved')</code>.
- [L60](#l60) Iterate <code>entries.sort((a,b)=&gt;a.node.start-b.node.start)</code> values, binding <code>const {node}</code> for each iteration:
  - [L61](#l61) If <code>node.type!=='CallExpression' &#124;&#124; node.callee?.type!=='Identifier' &#124;&#124; !bindings.has(node.callee.name!)</code> is truthy:
    - [L61](#l61) Skip the rest of this iteration and advance the enclosing loop.
  - [L62](#l62) If <code>calls.length&gt;=128</code> is truthy:
    - [L62](#l62) append values to the existing array: <code>issues.push('sdk-call-count-limit')</code>.
    - [L62](#l62) Leave the enclosing loop/switch.
  - [L63](#l63) Bind <code>cite</code>: call the named operation with the supplied arguments: <code>evidence(source,node)</code>.
  - [L63](#l63) If <code>cite.excerpt.length&gt;2048</code> is truthy:
    - [L63](#l63) append values to the existing array: <code>issues.push('source-excerpt-limit')</code>.
    - [L63](#l63) Skip the rest of this iteration and advance the enclosing loop.
  - [L64](#l64) Bind <code>symbol</code>: call the named operation with the supplied arguments: <code>bindings.get(node.callee.name!)</code>; the TypeScript assertion adds no runtime validation.
  - [L64](#l64) Bind <code>signatures</code>: call the named operation with the supplied arguments: <code>index.symbols.get(symbol)</code>.
  - [L65](#l65) Bind <code>call:Call</code>: create an object with 5 property/spread entries: <code>{...cite,symbol,status:'unresolved',reason:'Unsupported or dynamic call/declaration.',providerEvidence:(signatures ?? []).filter(s=&gt;s.excerpt.length&lt;=2048).map(s=&gt;({line:s.line,excerpt:s.excerpt}))}</code>; later properties overwrite earlier spread values.
  - [L65](#l65) append values to the existing array: <code>calls.push(call)</code>.
  - [L66](#l66) If <code>ambiguous.has(node.callee.name!) &#124;&#124; node.optional</code> is truthy:
    - [L66](#l66) Skip the rest of this iteration and advance the enclosing loop.
  - [L67](#l67) If <code>!signatures</code> is truthy:
    - [L67](#l67) If <code>index.complete</code> is truthy:
      - [L67](#l67) update <code>call.status</code> with <code>'mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L67](#l67) update <code>call.reason</code> with <code>'Named function is absent from the complete supported declaration index.'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L67](#l67) Skip the rest of this iteration and advance the enclosing loop.
  - [L68](#l68) Bind <code>args</code>: use <code>node.arguments</code> unless null/undefined, then evaluate <code>[]</code>.
  - [L68](#l68) Bind <code>types</code>: transform each element into a new array: <code>args.map(primitive)</code>.
  - [L69](#l69) If <code>args.some(a=&gt;a.type==='SpreadElement')</code> is truthy:
    - [L69](#l69) Skip the rest of this iteration and advance the enclosing loop.
  - [L70](#l70) Bind <code>compatible</code>: retain only elements whose callback returns a truthy value: <code>signatures.filter(s=&gt;s.supported &amp;&amp; args.length&gt;=s.parameters.filter(p=&gt;!p.optional).length &amp;&amp; args.length&lt;=s.parameters.length)</code>.
  - [L71](#l71) If <code>compatible.some(s=&gt;types.every((kind,i)=&gt;kind!==undefined &amp;&amp; s.parameters[i]!.kind===kind))</code> is truthy:
    - [L71](#l71) update <code>call.status</code> with <code>'matched'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L71](#l71) update <code>call.reason</code> with <code>'Direct named function, arity and literal primitive argument types match a declared overload; runtime behavior and return values are not assessed.'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L71](#l71) Otherwise:
    - [L72](#l72) If <code>signatures.every(s=&gt;s.supported) &amp;&amp; (!compatible.length &#124;&#124; types.every(t=&gt;t!==undefined))</code> is truthy:
      - [L72](#l72) update <code>call.status</code> with <code>'mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L72](#l72) update <code>call.reason</code> with <code>compatible.length?'Literal argument types do not match any supported overload.':'Argument count does not match any supported overload.'</code> using <code>=</code>; this mutation is visible to later statements.
- [L74](#l74) If <code>!calls.length</code> is truthy:
  - [L74](#l74) append values to the existing array: <code>issues.push('no-supported-sdk-calls')</code>.
- [L75](#l75) Return to the caller: create an object with 2 property/spread entries: <code>{calls,issues:[...new Set(issues)]}</code>; later properties overwrite earlier spread values.

<a id="fn-4531"></a>
### [...bindings.keys()].filter callback (57:55)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>[...bindings.keys()].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>name</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L57](#l57) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>entries.some(({node,parent})=&gt;node.type==='Identifier' &amp;&amp; node.name===name &amp;&amp; !(parent?.type==='ImportSpecifier') &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; parent.callee===node))</code>.

<a id="fn-4550"></a>
### entries.some callback (57:74)

Synchronous function. Lexically inside [[...bindings.keys()].filter callback (57:55)](#fn-4531). Passed to <code>entries.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{node,parent}</code>: destructure the supplied value into these local bindings.

Execution:

[L57](#l57) Implicitly return: evaluate <code>node.type==='Identifier' &amp;&amp; node.name===name &amp;&amp; !(parent?.type==='ImportSpecifier') &amp;&amp; !(parent?.type==='CallExpression' &amp;&amp; parent.callee===node)</code> left to right with falsy short-circuiting.

<a id="fn-4824"></a>
### entries.sort callback (60:36)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>entries.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: compute <code>a.node.start-b.node.start</code> with the <code>-</code> operator.

<a id="fn-5399"></a>
### (signatures ?? []).filter callback (65:150)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>(signatures ?? []).filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L65](#l65) Implicitly return: compute <code>s.excerpt.length&lt;=2048</code> with the <code>&lt;=</code> operator.

<a id="fn-5430"></a>
### (signatures ?? []).filter(s=&gt;s.excerpt.length&lt;=2048).map callback (65:181)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>(signatures ?? []).filter(s=&gt;s.excerpt.length&lt;=2048).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L65](#l65) Implicitly return: create an object with 2 property/spread entries: <code>{line:s.line,excerpt:s.excerpt}</code>; later properties overwrite earlier spread values.

<a id="fn-5795"></a>
### args.some callback (69:18)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>args.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L69](#l69) Implicitly return: compute <code>a.type==='SpreadElement'</code> with the <code>===</code> operator.

<a id="fn-5873"></a>
### signatures.filter callback (70:40)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>signatures.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L70](#l70) Implicitly return: evaluate <code>s.supported &amp;&amp; args.length&gt;=s.parameters.filter(p=&gt;!p.optional).length &amp;&amp; args.length&lt;=s.parameters.length</code> left to right with falsy short-circuiting.

<a id="fn-5924"></a>
### s.parameters.filter callback (70:91)

Synchronous function. Lexically inside [signatures.filter callback (70:40)](#fn-5873). Passed to <code>s.parameters.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L70](#l70) Implicitly return: apply <code>!</code> to <code>p.optional</code>.

<a id="fn-6008"></a>
### compatible.some callback (71:24)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>compatible.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: stop at the first falsy callback result, returning whether all matched: <code>types.every((kind,i)=&gt;kind!==undefined &amp;&amp; s.parameters[i]!.kind===kind)</code>.

<a id="fn-6023"></a>
### types.every callback (71:39)

Synchronous function. Lexically inside [compatible.some callback (71:24)](#fn-6008). Passed to <code>types.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>kind</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: evaluate <code>kind!==undefined &amp;&amp; s.parameters[i]!.kind===kind</code> left to right with falsy short-circuiting.

<a id="fn-6299"></a>
### signatures.every callback (72:30)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>signatures.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L72](#l72) Implicitly return: read <code>s.supported</code>.

<a id="fn-6353"></a>
### types.every callback (72:84)

Synchronous function. Lexically inside [compareSdkCalls (44:8)](#fn-3501). Passed to <code>types.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>t</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L72](#l72) Implicitly return: compute <code>t!==undefined</code> with the <code>!==</code> operator.

## Compile-time data contracts

### Ast

```typescript
type Ast={type:string;start:number;end:number;name?:string;value?:unknown;optional?:boolean;importKind?:string;
  source?:Ast;declaration?:Ast;id?:Ast;params?:Ast[];typeParameters?:unknown;typeAnnotation?:Ast;
  specifiers?:Ast[];imported?:Ast;local?:Ast;callee?:Ast;arguments?:Ast[];expression?:Ast;argument?:Ast;operator?:string};
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Primitive

```typescript
type Primitive='string'|'number'|'boolean';
```

Declared at [L7](#l7). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Signature

```typescript
type Signature={line:number;excerpt:string;parameters:{kind:Primitive|undefined;optional:boolean}[];supported:boolean};
```

Declared at [L9](#l9). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### SdkIndex

```typescript
type SdkIndex={symbols:Map<string,Signature[]>;complete:boolean;issues:string[]};
```

Declared at [L10](#l10). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Call

```typescript
type Call={line:number;excerpt:string;symbol:string;status:'matched'|'mismatch'|'unresolved';reason:string;providerEvidence:{line:number;excerpt:string}[]};
```

Declared at [L38](#l38). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L8](#l8) <code>primitiveKinds:Record&lt;string,Primitive&#124;undefined&gt;</code>: create an object with 3 property/spread entries: <code>{TSStringKeyword:'string',TSNumberKeyword:'number',TSBooleanKeyword:'boolean'}</code>; later properties overwrite earlier spread values.
- [L11](#l11) <code>evidence</code>: create [evidence (11:16)](#fn-872); its body runs when called, not when this value is created.

## Directly importing tests

- [sdk-audit.test.ts](../../test/sdk-audit.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
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
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {parseHttpSyntax} from './fetch-calls.js';
   2 | 
   3 | // Narrow ESTree/Babel projection; only discriminated shapes below are interpreted.
   4 | type Ast={type:string;start:number;end:number;name?:string;value?:unknown;optional?:boolean;importKind?:string;
   5 |   source?:Ast;declaration?:Ast;id?:Ast;params?:Ast[];typeParameters?:unknown;typeAnnotation?:Ast;
   6 |   specifiers?:Ast[];imported?:Ast;local?:Ast;callee?:Ast;arguments?:Ast[];expression?:Ast;argument?:Ast;operator?:string};
   7 | type Primitive='string'|'number'|'boolean';
   8 | const primitiveKinds:Record<string,Primitive|undefined>={TSStringKeyword:'string',TSNumberKeyword:'number',TSBooleanKeyword:'boolean'};
   9 | type Signature={line:number;excerpt:string;parameters:{kind:Primitive|undefined;optional:boolean}[];supported:boolean};
  10 | export type SdkIndex={symbols:Map<string,Signature[]>;complete:boolean;issues:string[]};
  11 | const evidence=(source:string,node:Ast)=>({line:source.slice(0,node.start).split(/\r\n|\n|\r/).length,excerpt:source.slice(node.start,node.end)});
  12 | export function indexSdkDeclarations(source:string):SdkIndex {
  13 |   const parsed=parseHttpSyntax(source,'typescript');
  14 |   const result:SdkIndex={symbols:new Map(),complete:!parsed.issues.length,issues:[...parsed.issues]};
  15 |   let signatureCount=0;
  16 |   for(const entry of parsed.nodes) {
  17 |     if(entry.parent?.type!=='Program')continue;
  18 |     const node=entry.node as unknown as Ast;
  19 |     if(node.type==='ExportNamedDeclaration' && node.declaration?.type==='TSDeclareFunction') {
  20 |       const fn=node.declaration,name=fn.id?.name;
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
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |       if(!name){result.complete=false;continue;}
  22 |       if(++signatureCount>256 || (result.symbols.get(name)?.length ?? 0)>=16) {
  23 |         result.symbols.clear();result.complete=false;result.issues.push('declaration-count-limit');break;
  24 |       }
  25 |       const parameters=(fn.params ?? []).map(p=>({kind:primitiveKinds[p.typeAnnotation?.typeAnnotation?.type ?? ''],optional:p.optional===true}));
  26 |       const cite=evidence(source,node);
  27 |       const supported=!fn.typeParameters && cite.excerpt.length<=2048 && (fn.params ?? []).every(p=>p.type==='Identifier' && p.name!=='this')
  28 |         && parameters.every(p=>p.kind!==undefined) && parameters.every((p,i)=>p.optional || !parameters.slice(0,i).some(before=>before.optional));
  29 |       result.symbols.set(name,[...(result.symbols.get(name) ?? []),{...cite,parameters,supported}]);
  30 |     } else if(['ExportNamedDeclaration','ExportAllDeclaration','ExportDefaultDeclaration','TSExportAssignment','TSModuleDeclaration'].includes(node.type)) {
  31 |       result.complete=false;result.issues.push('unsupported-declaration-export');
  32 |     }
  33 |   }
  34 |   if(!result.symbols.size){result.complete=false;result.issues.push('no-supported-function-declarations');}
  35 |   if(/\/\/\/\s*<reference\b/.test(source)){result.complete=false;result.issues.push('declaration-reference-unresolved');}
  36 |   return result;
  37 | }
  38 | type Call={line:number;excerpt:string;symbol:string;status:'matched'|'mismatch'|'unresolved';reason:string;providerEvidence:{line:number;excerpt:string}[]};
  39 | function primitive(node:Ast):Primitive|undefined {
  40 |   while(['TSAsExpression','TSTypeAssertion','TSNonNullExpression','TSSatisfiesExpression'].includes(node.type) && node.expression)node=node.expression;
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l55"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   if(node.type==='Literal' && ['string','number','boolean'].includes(typeof node.value))return typeof node.value as Primitive;
  42 |   if(node.type==='UnaryExpression' && ['+','-'].includes(node.operator!) && node.argument?.type==='Literal' && typeof node.argument.value==='number')return 'number';
  43 | }
  44 | export function compareSdkCalls(source:string,path:string,packageName:string,index:SdkIndex) {
  45 |   const parsed=parseHttpSyntax(source,path.endsWith('.tsx')?'tsx':/\.[cm]?ts$/.test(path)?'typescript':'javascript');
  46 |   const entries=parsed.nodes as unknown as {node:Ast;parent?:Ast}[];
  47 |   const issues=[...parsed.issues],calls:Call[]=[],bindings=new Map<string,string>();
  48 |   for(const {node} of entries) {
  49 |     if(node.type==='ImportDeclaration' && node.source?.value===packageName) {
  50 |       for(const spec of node.specifiers ?? []) {
  51 |         if(node.importKind==='type' || spec.importKind==='type' || spec.type!=='ImportSpecifier' || !spec.local?.name || !spec.imported?.name)issues.push('unsupported-sdk-import');
  52 |         else bindings.set(spec.local.name,spec.imported.name);
  53 |       }
  54 |     }
  55 |     if(node.type==='ImportExpression' || node.type==='CallExpression' && node.callee?.name==='require' && node.arguments?.[0]?.value===packageName)issues.push('dynamic-or-commonjs-sdk-import');
  56 |   }
  57 |   const ambiguous=new Set([...bindings.keys()].filter(name=>entries.some(({node,parent})=>node.type==='Identifier' && node.name===name
  58 |     && !(parent?.type==='ImportSpecifier') && !(parent?.type==='CallExpression' && parent.callee===node))));
  59 |   if(ambiguous.size)issues.push('sdk-binding-or-alias-unresolved');
  60 |   for(const {node} of entries.sort((a,b)=>a.node.start-b.node.start)) {
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
<a id="l70"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l74"></a>
<a id="l75"></a>

```text
  61 |     if(node.type!=='CallExpression' || node.callee?.type!=='Identifier' || !bindings.has(node.callee.name!))continue;
  62 |     if(calls.length>=128){issues.push('sdk-call-count-limit');break;}
  63 |     const cite=evidence(source,node);if(cite.excerpt.length>2048){issues.push('source-excerpt-limit');continue;}
  64 |     const symbol=bindings.get(node.callee.name!)!,signatures=index.symbols.get(symbol);
  65 |     const call:Call={...cite,symbol,status:'unresolved',reason:'Unsupported or dynamic call/declaration.',providerEvidence:(signatures ?? []).filter(s=>s.excerpt.length<=2048).map(s=>({line:s.line,excerpt:s.excerpt}))};calls.push(call);
  66 |     if(ambiguous.has(node.callee.name!) || node.optional)continue;
  67 |     if(!signatures) {if(index.complete){call.status='mismatch';call.reason='Named function is absent from the complete supported declaration index.';}continue;}
  68 |     const args=node.arguments ?? [],types=args.map(primitive);
  69 |     if(args.some(a=>a.type==='SpreadElement'))continue;
  70 |     const compatible=signatures.filter(s=>s.supported && args.length>=s.parameters.filter(p=>!p.optional).length && args.length<=s.parameters.length);
  71 |     if(compatible.some(s=>types.every((kind,i)=>kind!==undefined && s.parameters[i]!.kind===kind))) {call.status='matched';call.reason='Direct named function, arity and literal primitive argument types match a declared overload; runtime behavior and return values are not assessed.';}
  72 |     else if(signatures.every(s=>s.supported) && (!compatible.length || types.every(t=>t!==undefined))) {call.status='mismatch';call.reason=compatible.length?'Literal argument types do not match any supported overload.':'Argument count does not match any supported overload.';}
  73 |   }
  74 |   if(!calls.length)issues.push('no-supported-sdk-calls');
  75 |   return {calls,issues:[...new Set(issues)]};
  76 | }
  77 | 
```
