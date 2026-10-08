# src/csharp-http-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The C# adapter rejects preprocessor-dependent source and establishes HttpClient through qualification or an unshadowed using. It tracks fresh parameterless local creations, invalidates unexpected identifier uses, and requires calls after declaration in the same block. Known method names imply HTTP verbs; dynamic/configured clients and SendAsync remain unresolved.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `c2bdf1a4912a83e1835846776137b0a4d13a04f153c9a5bcf6831544778bd3c6`.

This chapter inventories **12 function bodies/callbacks**, **24 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./standard-http-syntax.js</code>: <code>syntaxTree</code>, <code>named</code>, <code>same</code>, <code>observation</code>, <code>setUrl</code>, <code>Syntax</code> (type only).
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only).

## Module execution


## Function index

- [extractCsharpCalls (4:8)](#fn-169)
- [nodes.some callback (6:17)](#fn-368)
- [nodes.some callback (7:29)](#fn-514)
- [nodes.some callback (8:29)](#fn-632)
- [constructor (9:21)](#fn-883)
- [plain (10:15)](#fn-1093)
- [nodes.filter callback (12:34)](#fn-1356)
- [nodes.filter callback (18:71)](#fn-1777)
- [nodes.filter callback (25:34)](#fn-2381)
- [block (31:17)](#fn-2874)
- [n.ancestors().find callback (31:48)](#fn-2905)
- [args.some callback (38:46)](#fn-3439)

<a id="fn-169"></a>
### extractCsharpCalls (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L5](#l5) <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('csharp',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L5](#l5) <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L7](#l7) <code>imported</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(n=&gt;n.kind()==='using_directive' &amp;&amp; n.text().replace(/\s/g,'')==='usingSystem.Net.Http;')</code>.
- [L8](#l8) <code>shadowed</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(n=&gt;['using_directive','class_declaration','struct_declaration','record_declaration','interface_declaration','type_parameter','variable_declarator','parameter'].includes(String(n.kind())) &amp;&amp; n.field('name')?.text()==='HttpClient')</code>.
- [L9](#l9) <code>constructor</code>: create [constructor (9:21)](#fn-883); its body runs when called, not when this value is created.
- [L10](#l10) <code>plain</code>: create [plain (10:15)](#fn-1093); its body runs when called, not when this value is created.
- [L11](#l11) <code>bindings</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L12](#l12) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.kind()==='variable_declarator')</code> at the start of each loop iteration.
- [L13](#l13) <code>name</code>: call the named operation with the supplied arguments: <code>node.field('name')</code>.
- [L13](#l13) <code>creation</code>: return the first matching element, or undefined: <code>named(node).find(constructor)</code>.
- [L15](#l15) <code>old</code>: test membership without changing the collection: <code>bindings.has(name.text())</code>.
- [L18](#l18) <code>[name,binding]</code>: receive the next iterable value from <code>bindings</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L18](#l18) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.kind()==='identifier' &amp;&amp; n.text()===name)</code> at the start of each loop iteration.
- [L20](#l20) <code>parent</code>: call the named operation with the supplied arguments: <code>node.parent()</code>.
- [L24](#l24) <code>verbs:Record&lt;string,string&gt;</code>: create an object with 8 property/spread entries: <code>{GetAsync:'GET',GetStringAsync:'GET',GetByteArrayAsync:'GET',GetStreamAsync:'GET',PostAsync:'POST',PutAsync:'PUT',PatchAsync:'PATCH',DeleteAsync:'DELETE'}</code>; later properties overwrite earlier spread values.
- [L25](#l25) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.kind()==='invocation_expression')</code> at the start of each loop iteration.
- [L26](#l26) <code>fn</code>: call the named operation with the supplied arguments: <code>node.field('function')</code>.
- [L27](#l27) <code>receiver</code>: call the named operation with the supplied arguments: <code>fn.field('expression')</code>.
- [L27](#l27) <code>method</code>: use <code>fn.field('name')?.text()</code> unless null/undefined, then evaluate <code>''</code>.
- [L28](#l28) <code>binding</code>: test <code>receiver?.kind()==='identifier'</code>; choose <code>bindings.get(receiver.text())</code> when truthy, otherwise <code>undefined</code>.
- [L30](#l30) <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,node,source)</code>.
- [L31](#l31) <code>block</code>: create [block (31:17)](#fn-2874); its body runs when called, not when this value is created.
- [L36](#l36) <code>args</code>: call the named operation with the supplied arguments: <code>named(node.field('arguments'))</code>.
- [L37](#l37) <code>body</code>: call the named operation with the supplied arguments: <code>['POST','PUT','PATCH'].includes(verbs[method]!)</code>.

Execution:

- [L5](#l5) Bind <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('csharp',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L5](#l5) Bind <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L5](#l5) If <code>issues.length</code> is truthy:
  - [L5](#l5) Return to the caller: evaluate <code>result</code>.
- [L6](#l6) If <code>nodes.some(n=&gt;String(n.kind()).startsWith('preproc_'))</code> is truthy:
  - [L6](#l6) append values to the existing array: <code>result.issues.push('conditional-compilation-unresolved')</code>.
  - [L6](#l6) Return to the caller: evaluate <code>result</code>.
- [L7](#l7) Bind <code>imported</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(n=&gt;n.kind()==='using_directive' &amp;&amp; n.text().replace(/\s/g,'')==='usingSystem.Net.Http;')</code>.
- [L8](#l8) Bind <code>shadowed</code>: stop at the first truthy callback result, returning whether any matched: <code>nodes.some(n=&gt;['using_directive','class_declaration','struct_declaration','record_declaration','interface_declaration','type_parameter','variable_declarator','parameter'].includes(String(n.kind())) &amp;&amp; n.field('name')?.text()==='HttpClient')</code>.
- [L9](#l9) Bind <code>constructor</code>: create [constructor (9:21)](#fn-883); its body runs when called, not when this value is created.
- [L10](#l10) Bind <code>plain</code>: create [plain (10:15)](#fn-1093); its body runs when called, not when this value is created.
- [L11](#l11) Bind <code>bindings</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L12](#l12) Iterate <code>nodes.filter(n=&gt;n.kind()==='variable_declarator')</code> values, binding <code>const node</code> for each iteration:
  - [L13](#l13) Bind <code>name</code>: call the named operation with the supplied arguments: <code>node.field('name')</code>.
  - [L13](#l13) Bind <code>creation</code>: return the first matching element, or undefined: <code>named(node).find(constructor)</code>.
  - [L14](#l14) If <code>!name &#124;&#124; !creation &#124;&#124; node.parent()?.parent()?.kind()!=='local_declaration_statement'</code> is truthy:
    - [L14](#l14) Skip the rest of this iteration and advance the enclosing loop.
  - [L15](#l15) Bind <code>old</code>: test membership without changing the collection: <code>bindings.has(name.text())</code>.
  - [L16](#l16) store/replace a keyed entry in the Map: <code>bindings.set(name.text(),{declaration:node,creation,valid:!old &amp;&amp; plain(creation)})</code>.
- [L18](#l18) Iterate <code>bindings</code> values, binding <code>const [name,binding]</code> for each iteration:
  - [L18](#l18) Iterate <code>nodes.filter(n=&gt;n.kind()==='identifier' &amp;&amp; n.text()===name)</code> values, binding <code>const node</code> for each iteration:
    - [L19](#l19) If <code>same(node,binding.declaration.field('name'))</code> is truthy:
      - [L19](#l19) Skip the rest of this iteration and advance the enclosing loop.
    - [L20](#l20) Bind <code>parent</code>: call the named operation with the supplied arguments: <code>node.parent()</code>.
    - [L21](#l21) If <code>parent?.kind()==='member_access_expression' &amp;&amp; same(parent.field('expression'),node) &amp;&amp; parent.parent()?.kind()==='invocation_expression' &amp;&amp; same(parent.parent()?.field('function'),parent)</code> is truthy:
      - [L21](#l21) Skip the rest of this iteration and advance the enclosing loop.
    - [L22](#l22) update <code>binding.valid</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
- [L24](#l24) Bind <code>verbs:Record&lt;string,string&gt;</code>: create an object with 8 property/spread entries: <code>{GetAsync:'GET',GetStringAsync:'GET',GetByteArrayAsync:'GET',GetStreamAsync:'GET',PostAsync:'POST',PutAsync:'PUT',PatchAsync:'PATCH',DeleteAsync:'DELETE'}</code>; later properties overwrite earlier spread values.
- [L25](#l25) Iterate <code>nodes.filter(n=&gt;n.kind()==='invocation_expression')</code> values, binding <code>const node</code> for each iteration:
  - [L26](#l26) Bind <code>fn</code>: call the named operation with the supplied arguments: <code>node.field('function')</code>.
  - [L26](#l26) If <code>fn?.kind()!=='member_access_expression'</code> is truthy:
    - [L26](#l26) Skip the rest of this iteration and advance the enclosing loop.
  - [L27](#l27) Bind <code>receiver</code>: call the named operation with the supplied arguments: <code>fn.field('expression')</code>.
  - [L27](#l27) Bind <code>method</code>: use <code>fn.field('name')?.text()</code> unless null/undefined, then evaluate <code>''</code>.
  - [L28](#l28) Bind <code>binding</code>: test <code>receiver?.kind()==='identifier'</code>; choose <code>bindings.get(receiver.text())</code> when truthy, otherwise <code>undefined</code>.
  - [L29](#l29) If <code>!constructor(receiver) &amp;&amp; !binding &amp;&amp; !Object.hasOwn(verbs,method) &amp;&amp; method!=='SendAsync'</code> is truthy:
    - [L29](#l29) Skip the rest of this iteration and advance the enclosing loop.
  - [L30](#l30) Bind <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,node,source)</code>.
  - [L30](#l30) If <code>!call</code> is truthy:
    - [L30](#l30) Skip the rest of this iteration and advance the enclosing loop.
  - [L31](#l31) Bind <code>block</code>: create [block (31:17)](#fn-2874); its body runs when called, not when this value is created.
  - [L32](#l32) If <code>!(receiver &amp;&amp; plain(receiver)) &amp;&amp; !(binding?.valid &amp;&amp; same(block(binding.declaration),block(node)) &amp;&amp; binding.declaration.range().end.index&lt;node.range().start.index)</code> is truthy:
    - [L33](#l33) update <code>call.reason</code> with <code>'httpclient-binding-or-configuration-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L33](#l33) Skip the rest of this iteration and advance the enclosing loop.
  - [L35](#l35) If <code>!Object.hasOwn(verbs,method)</code> is truthy:
    - [L35](#l35) update <code>call.reason</code> with <code>'unsupported-httpclient-operation'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L35](#l35) Skip the rest of this iteration and advance the enclosing loop.
  - [L36](#l36) Bind <code>args</code>: call the named operation with the supplied arguments: <code>named(node.field('arguments'))</code>.
  - [L37](#l37) Bind <code>body</code>: call the named operation with the supplied arguments: <code>['POST','PUT','PATCH'].includes(verbs[method]!)</code>.
  - [L38](#l38) If <code>args.length!==(body?2:1) &#124;&#124; args.some(arg=&gt;named(arg).length!==1)</code> is truthy:
    - [L38](#l38) update <code>call.reason</code> with <code>'unsupported-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L38](#l38) Skip the rest of this iteration and advance the enclosing loop.
  - [L39](#l39) update <code>call.method</code> with <code>verbs[method]!</code> using <code>=</code>; this mutation is visible to later statements.
  - [L39](#l39) call the named operation with the supplied arguments: <code>setUrl(call,named(args[0])[0])</code>.
- [L41](#l41) Return to the caller: evaluate <code>result</code>.

<a id="fn-368"></a>
### nodes.some callback (6:17)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L6](#l6) Implicitly return: call the named operation with the supplied arguments: <code>String(n.kind()).startsWith('preproc_')</code>.

<a id="fn-514"></a>
### nodes.some callback (7:29)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L7](#l7) Implicitly return: evaluate <code>n.kind()==='using_directive' &amp;&amp; n.text().replace(/\s/g,'')==='usingSystem.Net.Http;'</code> left to right with falsy short-circuiting.

<a id="fn-632"></a>
### nodes.some callback (8:29)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: evaluate <code>['using_directive','class_declaration','struct_declaration','record_declaration','interface_declaration','type_parameter','variable_declarator','parameter'].includes(String(n.kind())) &amp;&amp; n.field('name')?.text()==='HttpClient'</code> left to right with falsy short-circuiting.

<a id="fn-883"></a>
### constructor (9:21)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). 

Parameters:

- <code>n:Syntax&#124;null&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: evaluate <code>n?.kind()==='object_creation_expression' &amp;&amp; (n.field('type')?.text()==='System.Net.Http.HttpClient' &#124;&#124; imported &amp;&amp; !shadowed &amp;&amp; n.field('type')?.text()==='HttpClient')</code> left to right with falsy short-circuiting.

<a id="fn-1093"></a>
### plain (10:15)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). 

Parameters:

- <code>n:Syntax</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L10](#l10) Implicitly return: evaluate <code>constructor(n) &amp;&amp; n.field('arguments')?.kind()==='argument_list' &amp;&amp; named(n.field('arguments')).length===0 &amp;&amp; named(n).length===2</code> left to right with falsy short-circuiting.

<a id="fn-1356"></a>
### nodes.filter callback (12:34)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L12](#l12) Implicitly return: compute <code>n.kind()==='variable_declarator'</code> with the <code>===</code> operator.

<a id="fn-1777"></a>
### nodes.filter callback (18:71)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: evaluate <code>n.kind()==='identifier' &amp;&amp; n.text()===name</code> left to right with falsy short-circuiting.

<a id="fn-2381"></a>
### nodes.filter callback (25:34)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: compute <code>n.kind()==='invocation_expression'</code> with the <code>===</code> operator.

<a id="fn-2874"></a>
### block (31:17)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). 

Parameters:

- <code>n:Syntax</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: return the first matching element, or undefined: <code>n.ancestors().find(a=&gt;a.kind()==='block')</code>.

<a id="fn-2905"></a>
### n.ancestors().find callback (31:48)

Synchronous function. Lexically inside [block (31:17)](#fn-2874). Passed to <code>n.ancestors().find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: compute <code>a.kind()==='block'</code> with the <code>===</code> operator.

<a id="fn-3439"></a>
### args.some callback (38:46)

Synchronous function. Lexically inside [extractCsharpCalls (4:8)](#fn-169). Passed to <code>args.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>arg</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L38](#l38) Implicitly return: compute <code>named(arg).length!==1</code> with the <code>!==</code> operator.

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
   1 | import {syntaxTree,named,same,observation,setUrl,type Syntax} from './standard-http-syntax.js';
   2 | import type {CallExtraction} from './contract-adapter-types.js';
   3 | 
   4 | export function extractCsharpCalls(source:string):CallExtraction {
   5 |   const {nodes,issues}=syntaxTree('csharp',source),result:CallExtraction={calls:[],issues};if(issues.length)return result;
   6 |   if(nodes.some(n=>String(n.kind()).startsWith('preproc_'))){result.issues.push('conditional-compilation-unresolved');return result;}
   7 |   const imported=nodes.some(n=>n.kind()==='using_directive' && n.text().replace(/\s/g,'')==='usingSystem.Net.Http;');
   8 |   const shadowed=nodes.some(n=>['using_directive','class_declaration','struct_declaration','record_declaration','interface_declaration','type_parameter','variable_declarator','parameter'].includes(String(n.kind())) && n.field('name')?.text()==='HttpClient');
   9 |   const constructor=(n:Syntax|null|undefined)=>n?.kind()==='object_creation_expression' && (n.field('type')?.text()==='System.Net.Http.HttpClient' || imported && !shadowed && n.field('type')?.text()==='HttpClient');
  10 |   const plain=(n:Syntax)=>constructor(n) && n.field('arguments')?.kind()==='argument_list' && named(n.field('arguments')).length===0 && named(n).length===2;
  11 |   const bindings=new Map<string,{declaration:Syntax;creation:Syntax;valid:boolean}>();
  12 |   for(const node of nodes.filter(n=>n.kind()==='variable_declarator')) {
  13 |     const name=node.field('name'),creation=named(node).find(constructor);
  14 |     if(!name || !creation || node.parent()?.parent()?.kind()!=='local_declaration_statement')continue;
  15 |     const old=bindings.has(name.text());
  16 |     bindings.set(name.text(),{declaration:node,creation,valid:!old && plain(creation)});
  17 |   }
  18 |   for(const [name,binding] of bindings)for(const node of nodes.filter(n=>n.kind()==='identifier' && n.text()===name)) {
  19 |     if(same(node,binding.declaration.field('name')))continue;
  20 |     const parent=node.parent();
```

<a id="l21"></a>
<a id="l22"></a>
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
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>

```text
  21 |     if(parent?.kind()==='member_access_expression' && same(parent.field('expression'),node) && parent.parent()?.kind()==='invocation_expression' && same(parent.parent()?.field('function'),parent))continue;
  22 |     binding.valid=false;
  23 |   }
  24 |   const verbs:Record<string,string>={GetAsync:'GET',GetStringAsync:'GET',GetByteArrayAsync:'GET',GetStreamAsync:'GET',PostAsync:'POST',PutAsync:'PUT',PatchAsync:'PATCH',DeleteAsync:'DELETE'};
  25 |   for(const node of nodes.filter(n=>n.kind()==='invocation_expression')) {
  26 |     const fn=node.field('function');if(fn?.kind()!=='member_access_expression')continue;
  27 |     const receiver=fn.field('expression'),method=fn.field('name')?.text() ?? '';
  28 |     const binding=receiver?.kind()==='identifier'?bindings.get(receiver.text()):undefined;
  29 |     if(!constructor(receiver) && !binding && !Object.hasOwn(verbs,method) && method!=='SendAsync')continue;
  30 |     const call=observation(result,node,source);if(!call)continue;
  31 |     const block=(n:Syntax)=>n.ancestors().find(a=>a.kind()==='block');
  32 |     if(!(receiver && plain(receiver)) && !(binding?.valid && same(block(binding.declaration),block(node)) && binding.declaration.range().end.index<node.range().start.index)) {
  33 |       call.reason='httpclient-binding-or-configuration-unresolved';continue;
  34 |     }
  35 |     if(!Object.hasOwn(verbs,method)){call.reason='unsupported-httpclient-operation';continue;}
  36 |     const args=named(node.field('arguments'));
  37 |     const body=['POST','PUT','PATCH'].includes(verbs[method]!);
  38 |     if(args.length!==(body?2:1) || args.some(arg=>named(arg).length!==1)) {call.reason='unsupported-arguments';continue;}
  39 |     call.method=verbs[method]!;setUrl(call,named(args[0])[0]);
  40 |   }
```

<a id="l41"></a>

```text
  41 |   return result;
  42 | }
  43 | 
```
