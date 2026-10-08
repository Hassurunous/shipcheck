# src/intent-policy.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

assessIntentPolicy validates caller-supplied edges, hashes normalized policy, and filters edges by both forbidden source and destination prefixes. A Map removes exact duplicate evidence and sorting stabilizes output. Natural-language requirements stay insufficient-evidence because this pure helper has no source reader or language-reasoning stage.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `3851fc5c103fddc0eb59d4f2fd08d581721108ea50db06f0ba8d220e52fe4277`.

This chapter inventories **11 function bodies/callbacks**, **10 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:crypto</code>: <code>createHash</code>.
- <code>zod</code>: <code>z</code>.

## Module execution

- [L4](#l4) Bind <code>id</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L5](#l5) Bind <code>path</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(value=&gt;!/[\\:\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Expected a repository-relative slash-separated path.')</code>.
- [L7](#l7) Bind <code>intentPolicySchema</code>: call the named operation with the supplied arguments: <code>z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}…</code>.
- [L16](#l16) Bind <code>dependencyObservationSchema</code>: call the named operation with the supplied arguments: <code>z.object({ from:path,to:path,line:z.number().int().positive(),excerpt:z.string().min(1).max(8000), }).strict()</code>.
- [L19](#l19) Bind <code>within</code>: create [within (19:14)](#fn-1102); its body runs when called, not when this value is created.

## Function index

- [z.string().min(1).max(512).refine callback (5:46)](#fn-169)
- [value.split('/').every callback (6:29)](#fn-238)
- [z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}… callback (12:25)](#fn-700)
- [[...value.requirements,...value.boundaries].map callback (13:61)](#fn-775)
- [within (19:14)](#fn-1102)
- [assessIntentPolicy (22:8)](#fn-1276)
- [policy.requirements.map callback (29:42)](#fn-1702)
- [policy.boundaries.map callback (32:38)](#fn-1951)
- [edges.filter callback (33:47)](#fn-2009)
- [edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map callback (34:14)](#fn-2092)
- [[...new Map(edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map(edge=&gt;[JSON.stringify(edge),edge])).values()].sort callback (34:65)](#fn-2143)

<a id="fn-169"></a>
### z.string().min(1).max(512).refine callback (5:46)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(512).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L5](#l5) Implicitly return: evaluate <code>!/[\\:\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..')</code> left to right with falsy short-circuiting.

<a id="fn-238"></a>
### value.split('/').every callback (6:29)

Synchronous function. Lexically inside [z.string().min(1).max(512).refine callback (5:46)](#fn-169). Passed to <code>value.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L6](#l6) Implicitly return: evaluate <code>part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'</code> left to right with falsy short-circuiting.

<a id="fn-700"></a>
### z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}… callback (12:25)

Synchronous function. Defined in module scope. Passed to <code>z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.
- <code>ctx</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>ids</code>: transform each element into a new array: <code>[...value.requirements,...value.boundaries].map(item=&gt;item.id)</code>.

Execution:

- [L13](#l13) Bind <code>ids</code>: transform each element into a new array: <code>[...value.requirements,...value.boundaries].map(item=&gt;item.id)</code>.
- [L14](#l14) If <code>new Set(ids).size!==ids.length</code> is truthy:
  - [L14](#l14) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'Policy IDs must be unique across requirements and boundaries.'})</code>.

<a id="fn-775"></a>
### [...value.requirements,...value.boundaries].map callback (13:61)

Synchronous function. Lexically inside [z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}… callback (12:25)](#fn-700). Passed to <code>[...value.requirements,...value.boundaries].map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: read <code>item.id</code>.

<a id="fn-1102"></a>
### within (19:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>file:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>prefix:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L19](#l19) Implicitly return: evaluate <code>file===prefix &#124;&#124; file.startsWith(&#96;${prefix}/&#96;)</code> left to right with truthy short-circuiting.

<a id="fn-1276"></a>
### assessIntentPolicy (22:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input:z.input&lt;typeof intentPolicySchema&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>observations:z.input&lt;typeof dependencyObservationSchema&gt;[]=[]</code>: when omitted/undefined, initialize with <code>[]</code>.

Local bindings (nested callback locals are documented with that callback):

- [L24](#l24) <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>intentPolicySchema.parse(input)</code>.
- [L25](#l25) <code>edges</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>z.array(dependencyObservationSchema).max(10000).parse(observations)</code>.
- [L26](#l26) <code>policySha256</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(policy)).digest('hex')</code>.

Execution:

- [L24](#l24) Bind <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>intentPolicySchema.parse(input)</code>.
- [L25](#l25) Bind <code>edges</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>z.array(dependencyObservationSchema).max(10000).parse(observations)</code>.
- [L26](#l26) Bind <code>policySha256</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(policy)).digest('hex')</code>.
- [L27](#l27) Return to the caller: create an object with 5 property/spread entries: <code>{ policySha256, requirements:policy.requirements.map(requirement=&gt;({id:requirement.id,text:requirement.text, resourceIds:requirement.resourceIds,status:'insufficient-evidence' as const, reason:'Natural-language requirements have not been assessed.'})), boun…</code>; later properties overwrite earlier spread values.

<a id="fn-1702"></a>
### policy.requirements.map callback (29:42)

Synchronous function. Lexically inside [assessIntentPolicy (22:8)](#fn-1276). Passed to <code>policy.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>requirement</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: create an object with 5 property/spread entries: <code>{id:requirement.id,text:requirement.text, resourceIds:requirement.resourceIds,status:'insufficient-evidence' as const, reason:'Natural-language requirements have not been assessed.'}</code>; later properties overwrite earlier spread values.

<a id="fn-1951"></a>
### policy.boundaries.map callback (32:38)

Synchronous function. Lexically inside [assessIntentPolicy (22:8)](#fn-1276). Passed to <code>policy.boundaries.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>boundary</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L33](#l33) <code>evidence</code>: sort the receiver array in place using the comparator: <code>[...new Map(edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map(edge=&gt;[JSON.stringify(edge),edge])).values()].sort((a,b)=&gt;a.from.localeCompare(b.from) &#124;&#124; a.line-b.line &#124;&#124; a.to.localeCompare(b.to))</code>.

Execution:

- [L33](#l33) Bind <code>evidence</code>: sort the receiver array in place using the comparator: <code>[...new Map(edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map(edge=&gt;[JSON.stringify(edge),edge])).values()].sort((a,b)=&gt;a.from.localeCompare(b.from) &#124;&#124; a.line-b.line &#124;&#124; a.to.localeCompare(b.to))</code>.
- [L35](#l35) Return to the caller: create an object with 6 property/spread entries: <code>{id:boundary.id,from:boundary.from,to:boundary.to,reason:boundary.reason, status:evidence.length?'potential-violation' as const:'no-observed-violation' as const,evidence}</code>; later properties overwrite earlier spread values.

<a id="fn-2009"></a>
### edges.filter callback (33:47)

Synchronous function. Lexically inside [policy.boundaries.map callback (32:38)](#fn-1951). Passed to <code>edges.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>edge</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L33](#l33) Implicitly return: evaluate <code>within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)</code> left to right with falsy short-circuiting.

<a id="fn-2092"></a>
### edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map callback (34:14)

Synchronous function. Lexically inside [policy.boundaries.map callback (32:38)](#fn-1951). Passed to <code>edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>edge</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L34](#l34) Implicitly return: create an array from <code>[JSON.stringify(edge),edge]</code>; spread elements insert the iterable values.

<a id="fn-2143"></a>
### [...new Map(edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map(edge=&gt;[JSON.stringify(edge),edge])).values()].sort callback (34:65)

Synchronous function. Lexically inside [policy.boundaries.map callback (32:38)](#fn-1951). Passed to <code>[...new Map(edges.filter(edge=&gt;within(edge.from,boundary.from) &amp;&amp; within(edge.to,boundary.to)) .map(edge=&gt;[JSON.stringify(edge),edge])).values()].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L34](#l34) Implicitly return: evaluate <code>a.from.localeCompare(b.from) &#124;&#124; a.line-b.line &#124;&#124; a.to.localeCompare(b.to)</code> left to right with truthy short-circuiting.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>intentPolicySchema</code> | <code>requirements</code> | <code>z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([])</code> | [L8](#l8) |
| <code>intentPolicySchema</code> | <code>requirements.id</code> | <code>id</code> | [L8](#l8) |
| <code>intentPolicySchema</code> | <code>requirements.text</code> | <code>z.string().trim().min(1).max(4000)</code> | [L8](#l8) |
| <code>intentPolicySchema</code> | <code>requirements.resourceIds</code> | <code>z.array(id).max(32).default([])</code> | [L9](#l9) |
| <code>intentPolicySchema</code> | <code>boundaries</code> | <code>z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([])</code> | [L10](#l10) |
| <code>intentPolicySchema</code> | <code>boundaries.id</code> | <code>id</code> | [L10](#l10) |
| <code>intentPolicySchema</code> | <code>boundaries.from</code> | <code>path</code> | [L10](#l10) |
| <code>intentPolicySchema</code> | <code>boundaries.to</code> | <code>path</code> | [L10](#l10) |
| <code>intentPolicySchema</code> | <code>boundaries.reason</code> | <code>z.string().trim().min(1).max(1000)</code> | [L11](#l11) |
| <code>dependencyObservationSchema</code> | <code>from</code> | <code>path</code> | [L17](#l17) |
| <code>dependencyObservationSchema</code> | <code>to</code> | <code>path</code> | [L17](#l17) |
| <code>dependencyObservationSchema</code> | <code>line</code> | <code>z.number().int().positive()</code> | [L17](#l17) |
| <code>dependencyObservationSchema</code> | <code>excerpt</code> | <code>z.string().min(1).max(8000)</code> | [L17](#l17) |

## Module bindings

- [L4](#l4) <code>id</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L5](#l5) <code>path</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(value=&gt;!/[\\:\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Expected a repository-relative slash-separated path.')</code>.
- [L7](#l7) <code>intentPolicySchema</code>: call the named operation with the supplied arguments: <code>z.object({ requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000), resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]), boundaries:z.array(z.object({id,from:path,to:path, reason:z.string().trim().min(1).max(1000)}…</code>.
- [L16](#l16) <code>dependencyObservationSchema</code>: call the named operation with the supplied arguments: <code>z.object({ from:path,to:path,line:z.number().int().positive(),excerpt:z.string().min(1).max(8000), }).strict()</code>.
- [L19](#l19) <code>within</code>: create [within (19:14)](#fn-1102); its body runs when called, not when this value is created.

## Directly importing tests

- [intent-policy.test.ts](../../test/intent-policy.test.ts)

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
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>

```text
   1 | import {createHash} from 'node:crypto';
   2 | import {z} from 'zod';
   3 | 
   4 | const id=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
   5 | const path=z.string().min(1).max(512).refine(value=>!/[\\:\u0000-\u001f]/.test(value)
   6 |   && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Expected a repository-relative slash-separated path.');
   7 | export const intentPolicySchema=z.object({
   8 |   requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000),
   9 |     resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]),
  10 |   boundaries:z.array(z.object({id,from:path,to:path,
  11 |     reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([]),
  12 | }).strict().superRefine((value,ctx)=>{
  13 |   const ids=[...value.requirements,...value.boundaries].map(item=>item.id);
  14 |   if(new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Policy IDs must be unique across requirements and boundaries.'});
  15 | });
  16 | export const dependencyObservationSchema=z.object({
  17 |   from:path,to:path,line:z.number().int().positive(),excerpt:z.string().min(1).max(8000),
  18 | }).strict();
  19 | const within=(file:string,prefix:string)=>file===prefix || file.startsWith(`${prefix}/`);
  20 | 
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
<a id="l36"></a>
<a id="l38"></a>
<a id="l39"></a>

```text
  21 | /** Evaluate supplied dependency observations; does not inspect code or infer intent. */
  22 | export function assessIntentPolicy(input:z.input<typeof intentPolicySchema>,
  23 |   observations:z.input<typeof dependencyObservationSchema>[]=[]) {
  24 |   const policy=intentPolicySchema.parse(input);
  25 |   const edges=z.array(dependencyObservationSchema).max(10000).parse(observations);
  26 |   const policySha256=createHash('sha256').update(JSON.stringify(policy)).digest('hex');
  27 |   return {
  28 |     policySha256,
  29 |     requirements:policy.requirements.map(requirement=>({id:requirement.id,text:requirement.text,
  30 |       resourceIds:requirement.resourceIds,status:'insufficient-evidence' as const,
  31 |       reason:'Natural-language requirements have not been assessed.'})),
  32 |     boundaries:policy.boundaries.map(boundary=>{
  33 |       const evidence=[...new Map(edges.filter(edge=>within(edge.from,boundary.from) && within(edge.to,boundary.to))
  34 |         .map(edge=>[JSON.stringify(edge),edge])).values()].sort((a,b)=>a.from.localeCompare(b.from) || a.line-b.line || a.to.localeCompare(b.to));
  35 |       return {id:boundary.id,from:boundary.from,to:boundary.to,reason:boundary.reason,
  36 |         status:evidence.length?'potential-violation' as const:'no-observed-violation' as const,evidence};
  37 |     }),
  38 |     coverage:'supplied-observations-only' as const,
  39 |     evidenceVerification:'caller-supplied-unverified' as const,
  40 |   };
```


```text
  41 | }
  42 | 
```
