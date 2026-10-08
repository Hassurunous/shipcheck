# src/ai/reference-context.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

attachReferences mutates the selected context by adding complete applicable snapshots only when their combined serialized representation fits. Duplicate citation paths or collisions with source are ambiguous. Every reference gets inclusion metadata; optional omission makes coverage limited, while required omission returns blocked so no model request is sent.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `ef7d1051da994ed51816baa57b6754873cb63324398cedc8bbfe0457ab5fc1ab`.

This chapter inventories **5 function bodies/callbacks**, **8 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>../config.js</code>: <code>Config</code> (type only).
- <code>../reference-resources.js</code>: <code>loadReferenceResources</code>, <code>ResourceSnapshot</code> (type only).
- <code>./context.js</code>: <code>AiContext</code> (type only).
- <code>../reference-access.js</code>: <code>ReferenceAccess</code> (type only).

## Module execution


## Function index

- [attachReferences (7:8)](#fn-331)
- [context.files.map callback (9:75)](#fn-548)
- [loaded.snapshots.find callback (15:42)](#fn-780)
- [loaded.report.resources.filter callback (17:55)](#fn-888)
- [context.files.some callback (18:52)](#fn-1005)

<a id="fn-331"></a>
### attachReferences (7:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>config:Config</code>: supplied by the caller; usage is shown in the steps below.
- <code>context:AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>access:ReferenceAccess={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L9](#l9) <code>loaded</code>: wait for <code>loadReferenceResources(root,config,context.files.map(file=&gt;file.path),access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L12](#l12) <code>blocked</code>: use the literal <code>false</code>.
- [L13](#l13) <code>record</code>: receive the next iterable value from <code>loaded.report.resources</code> at the start of each loop iteration.
- [L14](#l14) <code>status:string</code>: read <code>record.status</code>.
- [L15](#l15) <code>snapshot</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(item=&gt;item.record.id===record.id)</code>.
- [L17](#l17) <code>duplicates</code>: retain only elements whose callback returns a truthy value: <code>loaded.report.resources.filter(item=&gt;item.path===record.path &amp;&amp; item.status!=='not-applicable')</code>.
- [L20](#l20) <code>next:ResourceSnapshot[]</code>: create an array from <code>[...(context.references ?? []),snapshot]</code>; spread elements insert the iterable values.
- [L21](#l21) <code>bytes</code>: compute <code>Buffer.byteLength(JSON.stringify(context.files))+Buffer.byteLength(JSON.stringify(next))</code> with the <code>+</code> operator.

Execution:

- [L8](#l8) If <code>!config.resources.length</code> is truthy:
  - [L8](#l8) Return undefined immediately; remaining statements in this function do not execute.
- [L9](#l9) Bind <code>loaded</code>: wait for <code>loadReferenceResources(root,config,context.files.map(file=&gt;file.path),access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L10](#l10) update <code>context.references</code> with <code>[]</code> using <code>=</code>; this mutation is visible to later statements.
- [L11](#l11) update <code>context.preview.references</code> with <code>[]</code> using <code>=</code>; this mutation is visible to later statements.
- [L12](#l12) Bind <code>blocked</code>: use the literal <code>false</code>.
- [L13](#l13) Iterate <code>loaded.report.resources</code> values, binding <code>const record</code> for each iteration:
  - [L14](#l14) Bind <code>status:string</code>: read <code>record.status</code>.
  - [L15](#l15) Bind <code>snapshot</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(item=&gt;item.record.id===record.id)</code>.
  - [L16](#l16) If <code>snapshot</code> is truthy:
    - [L17](#l17) Bind <code>duplicates</code>: retain only elements whose callback returns a truthy value: <code>loaded.report.resources.filter(item=&gt;item.path===record.path &amp;&amp; item.status!=='not-applicable')</code>.
    - [L18](#l18) If <code>duplicates.length&gt;1 &#124;&#124; context.files.some(file=&gt;file.path===record.path)</code> is truthy:
      - [L18](#l18) update <code>status</code> with <code>'ambiguous-path'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L18](#l18) Otherwise:
      - [L20](#l20) Bind <code>next:ResourceSnapshot[]</code>: create an array from <code>[...(context.references ?? []),snapshot]</code>; spread elements insert the iterable values.
      - [L21](#l21) Bind <code>bytes</code>: compute <code>Buffer.byteLength(JSON.stringify(context.files))+Buffer.byteLength(JSON.stringify(next))</code> with the <code>+</code> operator.
      - [L22](#l22) If <code>bytes&gt;config.ai.maxContextBytes</code> is truthy:
        - [L22](#l22) update <code>status</code> with <code>'context-size-limit'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L22](#l22) Otherwise:
        - [L23](#l23) update <code>context.references</code> with <code>next</code> using <code>=</code>; this mutation is visible to later statements.
        - [L23](#l23) update <code>context.preview.serializedBytes</code> with <code>bytes</code> using <code>=</code>; this mutation is visible to later statements.
        - [L23](#l23) update <code>status</code> with <code>'included'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L26](#l26) append values to the existing array: <code>context.preview.references.push({id:record.id,path:record.path,sha256:record.sha256,status,required:record.required})</code>.
  - [L27](#l27) If <code>!['included','not-applicable'].includes(status)</code> is truthy:
    - [L28](#l28) update <code>context.preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L29](#l29) If <code>record.required</code> is truthy:
      - [L29](#l29) update <code>blocked</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
- [L32](#l32) Return to the caller: evaluate <code>blocked</code>.

<a id="fn-548"></a>
### context.files.map callback (9:75)

Synchronous function. Lexically inside [attachReferences (7:8)](#fn-331). Passed to <code>context.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: read <code>file.path</code>.

<a id="fn-780"></a>
### loaded.snapshots.find callback (15:42)

Synchronous function. Lexically inside [attachReferences (7:8)](#fn-331). Passed to <code>loaded.snapshots.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L15](#l15) Implicitly return: compute <code>item.record.id===record.id</code> with the <code>===</code> operator.

<a id="fn-888"></a>
### loaded.report.resources.filter callback (17:55)

Synchronous function. Lexically inside [attachReferences (7:8)](#fn-331). Passed to <code>loaded.report.resources.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: evaluate <code>item.path===record.path &amp;&amp; item.status!=='not-applicable'</code> left to right with falsy short-circuiting.

<a id="fn-1005"></a>
### context.files.some callback (18:52)

Synchronous function. Lexically inside [attachReferences (7:8)](#fn-331). Passed to <code>context.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: compute <code>file.path===record.path</code> with the <code>===</code> operator.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
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
   1 | import type {Config} from '../config.js';
   2 | import {loadReferenceResources,type ResourceSnapshot} from '../reference-resources.js';
   3 | import type {AiContext} from './context.js';
   4 | import type {ReferenceAccess} from '../reference-access.js';
   5 | 
   6 | /** Fill remaining context space with complete references, never silently truncate. */
   7 | export async function attachReferences(root:string,config:Config,context:AiContext,access:ReferenceAccess={}) {
   8 |   if(!config.resources.length)return;
   9 |   const loaded=await loadReferenceResources(root,config,context.files.map(file=>file.path),access);
  10 |   context.references=[];
  11 |   context.preview.references=[];
  12 |   let blocked=false;
  13 |   for(const record of loaded.report.resources) {
  14 |     let status:string=record.status;
  15 |     const snapshot=loaded.snapshots.find(item=>item.record.id===record.id);
  16 |     if(snapshot) {
  17 |       const duplicates=loaded.report.resources.filter(item=>item.path===record.path && item.status!=='not-applicable');
  18 |       if(duplicates.length>1 || context.files.some(file=>file.path===record.path))status='ambiguous-path';
  19 |       else {
  20 |         const next:ResourceSnapshot[]=[...(context.references ?? []),snapshot];
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l32"></a>

```text
  21 |         const bytes=Buffer.byteLength(JSON.stringify(context.files))+Buffer.byteLength(JSON.stringify(next));
  22 |         if(bytes>config.ai.maxContextBytes)status='context-size-limit';
  23 |         else {context.references=next;context.preview.serializedBytes=bytes;status='included';}
  24 |       }
  25 |     }
  26 |     context.preview.references.push({id:record.id,path:record.path,sha256:record.sha256,status,required:record.required});
  27 |     if(!['included','not-applicable'].includes(status)) {
  28 |       context.preview.limited=true;
  29 |       if(record.required)blocked=true;
  30 |     }
  31 |   }
  32 |   return blocked;
  33 | }
  34 | 
```
