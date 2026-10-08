# src/java-http-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The HTTP adapter recognizes complete inline HttpRequest.newBuilder(...).build() chains, with explicit standard-class imports or qualification and no conflicting declarations. It walks outward along receiver chains, accumulates supported URI/method setters and validates URI.create/new URI literal arguments. These are constructions, not proof send() is invoked. This adapter rejects Unicode escapes; the architecture import path has separate preprocessing.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `da92b50c225a935c4b9b9dccdf8331a1aed1a62b1c4413efaea91baa6ac8fabe`.

This chapter inventories **9 function bodies/callbacks**, **20 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./standard-http-syntax.js</code>: <code>syntaxTree</code>, <code>named</code>, <code>same</code>, <code>literal</code>, <code>observation</code>, <code>setUrl</code>, <code>Syntax</code> (type only).
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only).

## Module execution


## Function index

- [extractJavaCalls (4:8)](#fn-177)
- [nodes.filter callback (8:38)](#fn-581)
- [nodes.filter(n=&gt;n.kind()==='import_declaration').map callback (8:78)](#fn-621)
- [nodes.filter callback (9:43)](#fn-696)
- [nodes.filter(n=&gt;['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map callback (9:222)](#fn-875)
- [['java.net.http.HttpRequest','java.net.URI'].filter callback (10:78)](#fn-982)
- [[...imports].some callback (13:29)](#fn-1129)
- [type (15:14)](#fn-1214)
- [nodes.filter callback (17:34)](#fn-1407)

<a id="fn-177"></a>
### extractJavaCalls (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>source:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L7](#l7) <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('java',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L7](#l7) <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L8](#l8) <code>imports</code>: construct <code>Set</code> using <code>nodes.filter(n=&gt;n.kind()==='import_declaration').map(n=&gt;n.text().replace(/\s/g,''))</code>; this creates the local instance used below.
- [L9](#l9) <code>declarations</code>: construct <code>Set</code> using <code>nodes.filter(n=&gt;['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map(n=&gt;n.field('name')?.text())</code>; this creates the local instance used below.
- [L10](#l10) <code>resolved</code>: construct <code>Set</code> using <code>['java.net.http.HttpRequest','java.net.URI'].filter(full=&gt;{ const short=full.split('.').at(-1)!; return imports.has('import'+full+';') &amp;&amp; !declarations.has(short) &amp;&amp; ![...imports].some(item=&gt;item.endsWith('.'+short+';') &amp;&amp; item!=='import'+full+';'); })</code>; this creates the local instance used below.
- [L15](#l15) <code>type</code>: create [type (15:14)](#fn-1214); its body runs when called, not when this value is created.
- [L17](#l17) <code>seed</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.kind()==='method_invocation' &amp;&amp; n.field('name')?.text()==='newBuilder')</code> at the start of each loop iteration.
- [L18](#l18) <code>receiver</code>: call the named operation with the supplied arguments: <code>seed.field('object')</code>.
- [L20](#l20) <code>outer</code>: evaluate <code>seed</code>.
- [L20](#l20) <code>chain:Syntax[]</code>: create an array from <code>[seed]</code>; spread elements insert the iterable values.
- [L22](#l22) <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,outer,source,'request-construction')</code>.
- [L24](#l24) <code>initial</code>: call the named operation with the supplied arguments: <code>named(seed.field('arguments'))</code>.
- [L24](#l24) <code>uri:Syntax&#124;undefined</code>: read <code>initial[0]</code>.
- [L24](#l24) <code>method</code>: use the literal <code>'GET'</code>.
- [L24](#l24) <code>unsupported</code>: compute <code>initial.length&gt;1</code> with the <code>&gt;</code> operator.
- [L25](#l25) <code>step</code>: receive the next iterable value from <code>chain.slice(1,-1)</code> at the start of each loop iteration.
- [L26](#l26) <code>name</code>: call the named operation with the supplied arguments: <code>step.field('name')?.text()</code>.
- [L26](#l26) <code>args</code>: call the named operation with the supplied arguments: <code>named(step.field('arguments'))</code>.
- [L30](#l30) <code>verb</code>: call the named operation with the supplied arguments: <code>literal(args[0])</code>.

Execution:

- [L6](#l6) If <code>/\\u+[0-9a-fA-F]{4}/.test(source)</code> is truthy:
  - [L6](#l6) Return to the caller: create an object with 2 property/spread entries: <code>{calls:[],issues:['java-unicode-escape-unresolved']}</code>; later properties overwrite earlier spread values.
- [L7](#l7) Bind <code>{nodes,issues}</code>: call the named operation with the supplied arguments: <code>syntaxTree('java',source)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L7](#l7) Bind <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues}</code>; later properties overwrite earlier spread values.
- [L7](#l7) If <code>issues.length</code> is truthy:
  - [L7](#l7) Return to the caller: evaluate <code>result</code>.
- [L8](#l8) Bind <code>imports</code>: construct <code>Set</code> using <code>nodes.filter(n=&gt;n.kind()==='import_declaration').map(n=&gt;n.text().replace(/\s/g,''))</code>; this creates the local instance used below.
- [L9](#l9) Bind <code>declarations</code>: construct <code>Set</code> using <code>nodes.filter(n=&gt;['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map(n=&gt;n.field('name')?.text())</code>; this creates the local instance used below.
- [L10](#l10) Bind <code>resolved</code>: construct <code>Set</code> using <code>['java.net.http.HttpRequest','java.net.URI'].filter(full=&gt;{ const short=full.split('.').at(-1)!; return imports.has('import'+full+';') &amp;&amp; !declarations.has(short) &amp;&amp; ![...imports].some(item=&gt;item.endsWith('.'+short+';') &amp;&amp; item!=='import'+full+';'); })</code>; this creates the local instance used below.
- [L15](#l15) Bind <code>type</code>: create [type (15:14)](#fn-1214); its body runs when called, not when this value is created.
- [L17](#l17) Iterate <code>nodes.filter(n=&gt;n.kind()==='method_invocation' &amp;&amp; n.field('name')?.text()==='newBuilder')</code> values, binding <code>const seed</code> for each iteration:
  - [L18](#l18) Bind <code>receiver</code>: call the named operation with the supplied arguments: <code>seed.field('object')</code>.
  - [L18](#l18) If <code>!type(receiver,'HttpRequest','java.net.http.HttpRequest')</code> is truthy:
    - [L18](#l18) Skip the rest of this iteration and advance the enclosing loop.
  - [L19](#l19) If <code>result.calls.length&gt;=128</code> is truthy:
    - [L19](#l19) append values to the existing array: <code>result.issues.push('call-count-limit')</code>.
    - [L19](#l19) Leave the enclosing loop/switch.
  - [L20](#l20) Bind <code>outer</code>: evaluate <code>seed</code>.
  - [L20](#l20) Bind <code>chain:Syntax[]</code>: create an array from <code>[seed]</code>; spread elements insert the iterable values.
  - [L21](#l21) Repeat while <code>outer.parent()?.kind()==='method_invocation' &amp;&amp; same(outer.parent()?.field('object'),outer)</code>:
    - [L21](#l21) update <code>outer</code> with <code>outer.parent()!</code> using <code>=</code>; this mutation is visible to later statements.
    - [L21](#l21) append values to the existing array: <code>chain.push(outer)</code>.
  - [L22](#l22) Bind <code>call</code>: call the named operation with the supplied arguments: <code>observation(result,outer,source,'request-construction')</code>.
  - [L22](#l22) If <code>!call</code> is truthy:
    - [L22](#l22) Skip the rest of this iteration and advance the enclosing loop.
  - [L23](#l23) If <code>chain.at(-1)?.field('name')?.text()!=='build' &#124;&#124; named(chain.at(-1)?.field('arguments')).length!==0</code> is truthy:
    - [L23](#l23) update <code>call.reason</code> with <code>'request-builder-chain-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L23](#l23) Skip the rest of this iteration and advance the enclosing loop.
  - [L24](#l24) Bind <code>initial</code>: call the named operation with the supplied arguments: <code>named(seed.field('arguments'))</code>.
  - [L24](#l24) Bind <code>uri:Syntax&#124;undefined</code>: read <code>initial[0]</code>.
  - [L24](#l24) Bind <code>method</code>: use the literal <code>'GET'</code>.
  - [L24](#l24) Bind <code>unsupported</code>: compute <code>initial.length&gt;1</code> with the <code>&gt;</code> operator.
  - [L25](#l25) Iterate <code>chain.slice(1,-1)</code> values, binding <code>const step</code> for each iteration:
    - [L26](#l26) Bind <code>name</code>: call the named operation with the supplied arguments: <code>step.field('name')?.text()</code>.
    - [L26](#l26) Bind <code>args</code>: call the named operation with the supplied arguments: <code>named(step.field('arguments'))</code>.
    - [L27](#l27) If <code>name==='uri' &amp;&amp; args.length===1</code> is truthy:
      - [L27](#l27) update <code>uri</code> with <code>args[0]</code> using <code>=</code>; this mutation is visible to later statements.
    - [L27](#l27) Otherwise:
      - [L28](#l28) If <code>['GET','DELETE'].includes(name ?? '') &amp;&amp; args.length===0</code> is truthy:
        - [L28](#l28) update <code>method</code> with <code>name!</code> using <code>=</code>; this mutation is visible to later statements.
      - [L28](#l28) Otherwise:
        - [L29](#l29) If <code>['POST','PUT'].includes(name ?? '') &amp;&amp; args.length===1</code> is truthy:
          - [L29](#l29) update <code>method</code> with <code>name!</code> using <code>=</code>; this mutation is visible to later statements.
        - [L29](#l29) Otherwise:
          - [L30](#l30) If <code>name==='method' &amp;&amp; args.length===2</code> is truthy:
            - [L30](#l30) Bind <code>verb</code>: call the named operation with the supplied arguments: <code>literal(args[0])</code>.
            - [L30](#l30) If <code>verb===undefined</code> is truthy:
              - [L30](#l30) update <code>unsupported</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
            - [L30](#l30) Otherwise:
              - [L30](#l30) update <code>method</code> with <code>verb</code> using <code>=</code>; this mutation is visible to later statements.
          - [L30](#l30) Otherwise:
            - [L31](#l31) If <code>!(['header','setHeader'].includes(name ?? '') &amp;&amp; args.length===2 &#124;&#124; name==='headers' &amp;&amp; args.length&gt;0 &amp;&amp; args.length%2===0 &#124;&#124; ['timeout','version','expectContinue'].includes(name ?? '') &amp;&amp; args.length===1)</code> is truthy:
              - [L31](#l31) update <code>unsupported</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L33](#l33) If <code>unsupported</code> is truthy:
    - [L33](#l33) update <code>call.reason</code> with <code>'unsupported-builder-step'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L33](#l33) Skip the rest of this iteration and advance the enclosing loop.
  - [L34](#l34) update <code>call.method</code> with <code>method</code> using <code>=</code>; this mutation is visible to later statements.
  - [L35](#l35) If <code>uri?.kind()==='method_invocation' &amp;&amp; uri.field('name')?.text()==='create' &amp;&amp; type(uri.field('object'),'URI','java.net.URI') &amp;&amp; named(uri.field('arguments')).length===1</code> is truthy:
    - [L35](#l35) call the named operation with the supplied arguments: <code>setUrl(call,named(uri.field('arguments'))[0])</code>.
  - [L35](#l35) Otherwise:
    - [L36](#l36) If <code>uri?.kind()==='object_creation_expression' &amp;&amp; type(uri.field('type'),'URI','java.net.URI') &amp;&amp; named(uri.field('arguments')).length===1</code> is truthy:
      - [L36](#l36) call the named operation with the supplied arguments: <code>setUrl(call,named(uri.field('arguments'))[0])</code>.
    - [L36](#l36) Otherwise:
      - [L37](#l37) update <code>call.reason</code> with <code>'dynamic-or-unsupported-uri'</code> using <code>=</code>; this mutation is visible to later statements.
- [L39](#l39) Return to the caller: evaluate <code>result</code>.

<a id="fn-581"></a>
### nodes.filter callback (8:38)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: compute <code>n.kind()==='import_declaration'</code> with the <code>===</code> operator.

<a id="fn-621"></a>
### nodes.filter(n=&gt;n.kind()==='import_declaration').map callback (8:78)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>nodes.filter(n=&gt;n.kind()==='import_declaration').map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: produce a string with matching text replaced: <code>n.text().replace(/\s/g,'')</code>.

<a id="fn-696"></a>
### nodes.filter callback (9:43)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: call the named operation with the supplied arguments: <code>['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))</code>.

<a id="fn-875"></a>
### nodes.filter(n=&gt;['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map callback (9:222)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>nodes.filter(n=&gt;['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: call the named operation with the supplied arguments: <code>n.field('name')?.text()</code>.

<a id="fn-982"></a>
### ['java.net.http.HttpRequest','java.net.URI'].filter callback (10:78)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>['java.net.http.HttpRequest','java.net.URI'].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>full</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L11](#l11) <code>short</code>: call the named operation with the supplied arguments: <code>full.split('.').at(-1)</code>; the TypeScript assertion adds no runtime validation.

Execution:

- [L11](#l11) Bind <code>short</code>: call the named operation with the supplied arguments: <code>full.split('.').at(-1)</code>; the TypeScript assertion adds no runtime validation.
- [L12](#l12) Return to the caller: evaluate <code>imports.has('import'+full+';') &amp;&amp; !declarations.has(short) &amp;&amp; ![...imports].some(item=&gt;item.endsWith('.'+short+';') &amp;&amp; item!=='import'+full+';')</code> left to right with falsy short-circuiting.

<a id="fn-1129"></a>
### [...imports].some callback (13:29)

Synchronous function. Lexically inside [['java.net.http.HttpRequest','java.net.URI'].filter callback (10:78)](#fn-982). Passed to <code>[...imports].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: evaluate <code>item.endsWith('.'+short+';') &amp;&amp; item!=='import'+full+';'</code> left to right with falsy short-circuiting.

<a id="fn-1214"></a>
### type (15:14)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). 

Parameters:

- <code>node:Syntax&#124;null&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.
- <code>short:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>full:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L15](#l15) Implicitly return: evaluate <code>node?.text()===full &#124;&#124; node?.text()===short &amp;&amp; imports.has('import'+full+';') &amp;&amp; resolved.has(full)</code> left to right with truthy short-circuiting.

<a id="fn-1407"></a>
### nodes.filter callback (17:34)

Synchronous function. Lexically inside [extractJavaCalls (4:8)](#fn-177). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: evaluate <code>n.kind()==='method_invocation' &amp;&amp; n.field('name')?.text()==='newBuilder'</code> left to right with falsy short-circuiting.

## Directly importing tests

- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l4"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {syntaxTree,named,same,literal,observation,setUrl,type Syntax} from './standard-http-syntax.js';
   2 | import type {CallExtraction} from './contract-adapter-types.js';
   3 | 
   4 | export function extractJavaCalls(source:string):CallExtraction {
   5 |   // Java Unicode escapes are processed before tokenization, including within comments.
   6 |   if(/\\u+[0-9a-fA-F]{4}/.test(source))return {calls:[],issues:['java-unicode-escape-unresolved']};
   7 |   const {nodes,issues}=syntaxTree('java',source),result:CallExtraction={calls:[],issues};if(issues.length)return result;
   8 |   const imports=new Set(nodes.filter(n=>n.kind()==='import_declaration').map(n=>n.text().replace(/\s/g,'')));
   9 |   const declarations=new Set(nodes.filter(n=>['class_declaration','interface_declaration','record_declaration','enum_declaration','variable_declarator','formal_parameter','type_parameter'].includes(String(n.kind()))).map(n=>n.field('name')?.text()));
  10 |   const resolved=new Set(['java.net.http.HttpRequest','java.net.URI'].filter(full=>{
  11 |     const short=full.split('.').at(-1)!;
  12 |     return imports.has('import'+full+';') && !declarations.has(short)
  13 |       && ![...imports].some(item=>item.endsWith('.'+short+';') && item!=='import'+full+';');
  14 |   }));
  15 |   const type=(node:Syntax|null|undefined,short:string,full:string)=>node?.text()===full || node?.text()===short && imports.has('import'+full+';')
  16 |     && resolved.has(full);
  17 |   for(const seed of nodes.filter(n=>n.kind()==='method_invocation' && n.field('name')?.text()==='newBuilder')) {
  18 |     const receiver=seed.field('object');if(!type(receiver,'HttpRequest','java.net.http.HttpRequest'))continue;
  19 |     if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
  20 |     let outer=seed;const chain:Syntax[]=[seed];
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
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l39"></a>

```text
  21 |     while(outer.parent()?.kind()==='method_invocation' && same(outer.parent()?.field('object'),outer)){outer=outer.parent()!;chain.push(outer);}
  22 |     const call=observation(result,outer,source,'request-construction');if(!call)continue;
  23 |     if(chain.at(-1)?.field('name')?.text()!=='build' || named(chain.at(-1)?.field('arguments')).length!==0){call.reason='request-builder-chain-unresolved';continue;}
  24 |     const initial=named(seed.field('arguments'));let uri:Syntax|undefined=initial[0],method='GET',unsupported=initial.length>1;
  25 |     for(const step of chain.slice(1,-1)) {
  26 |       const name=step.field('name')?.text(),args=named(step.field('arguments'));
  27 |       if(name==='uri' && args.length===1)uri=args[0];
  28 |       else if(['GET','DELETE'].includes(name ?? '') && args.length===0)method=name!;
  29 |       else if(['POST','PUT'].includes(name ?? '') && args.length===1)method=name!;
  30 |       else if(name==='method' && args.length===2){const verb=literal(args[0]);if(verb===undefined)unsupported=true;else method=verb;}
  31 |       else if(!(['header','setHeader'].includes(name ?? '') && args.length===2 || name==='headers' && args.length>0 && args.length%2===0 || ['timeout','version','expectContinue'].includes(name ?? '') && args.length===1))unsupported=true;
  32 |     }
  33 |     if(unsupported){call.reason='unsupported-builder-step';continue;}
  34 |     call.method=method;
  35 |     if(uri?.kind()==='method_invocation' && uri.field('name')?.text()==='create' && type(uri.field('object'),'URI','java.net.URI') && named(uri.field('arguments')).length===1)setUrl(call,named(uri.field('arguments'))[0]);
  36 |     else if(uri?.kind()==='object_creation_expression' && type(uri.field('type'),'URI','java.net.URI') && named(uri.field('arguments')).length===1)setUrl(call,named(uri.field('arguments'))[0]);
  37 |     else call.reason='dynamic-or-unsupported-uri';
  38 |   }
  39 |   return result;
  40 | }
```


```text
  41 | 
```
