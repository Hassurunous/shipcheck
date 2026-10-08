# src/architecture-contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The configuration combines selected source patterns, forbidden directions, naming conventions and explicit aliases. A refinement requires at least one policy and unique IDs/prefixes. Results separate resolved local edges, external imports and unresolved observations, with a policy hash and partial-coverage issues.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `80152f4c968878f20d8a6aa4b3b64a7d47df7030e43b5c648d3a6dae1f43db84`.

This chapter inventories **5 function bodies/callbacks**, **5 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./intent-policy.js</code>: <code>intentPolicySchema</code>, <code>dependencyObservationSchema</code>.

## Module execution

- [L3](#l3) Bind <code>path</code>: read <code>dependencyObservationSchema.shape.from</code>.
- [L4](#l4) Bind <code>id</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L5](#l5) Bind <code>architectureSchema</code>: call the named operation with the supplied arguments: <code>z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv…</code>.
- [L17](#l17) Bind <code>architectureResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ state:z.enum(['checked','partial']),policySha256:z.string(),coverage:z.literal('configured-import-declarations-only'), files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})), dependencies:z.array(z.object({from:…</code>.

## Function index

- [z.string().min(1).max(512).refine callback (6:51)](#fn-310)
- [v.split('/').every callback (7:27)](#fn-376)
- [z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv… callback (12:25)](#fn-863)
- [[...v.boundaries,...v.conventions].map callback (13:52)](#fn-925)
- [v.aliases.map callback (15:28)](#fn-1110)

<a id="fn-310"></a>
### z.string().min(1).max(512).refine callback (6:51)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(512).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>v</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L6](#l6) Implicitly return: evaluate <code>!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**'))</code> left to right with falsy short-circuiting.

<a id="fn-376"></a>
### v.split('/').every callback (7:27)

Synchronous function. Lexically inside [z.string().min(1).max(512).refine callback (6:51)](#fn-310). Passed to <code>v.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L7](#l7) Implicitly return: evaluate <code>!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')</code> left to right with falsy short-circuiting.

<a id="fn-863"></a>
### z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv… callback (12:25)

Synchronous function. Defined in module scope. Passed to <code>z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>v</code>: supplied by the caller; usage is shown in the steps below.
- <code>ctx</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>ids</code>: transform each element into a new array: <code>[...v.boundaries,...v.conventions].map(p=&gt;p.id)</code>.

Execution:

- [L13](#l13) Bind <code>ids</code>: transform each element into a new array: <code>[...v.boundaries,...v.conventions].map(p=&gt;p.id)</code>.
- [L14](#l14) If <code>!ids.length &#124;&#124; new Set(ids).size!==ids.length</code> is truthy:
  - [L14](#l14) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'Provide at least one policy; policy IDs must be unique.'})</code>.
- [L15](#l15) If <code>new Set(v.aliases.map(a=&gt;a.prefix)).size!==v.aliases.length</code> is truthy:
  - [L15](#l15) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'Alias prefixes must be unique.'})</code>.

<a id="fn-925"></a>
### [...v.boundaries,...v.conventions].map callback (13:52)

Synchronous function. Lexically inside [z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv… callback (12:25)](#fn-863). Passed to <code>[...v.boundaries,...v.conventions].map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: read <code>p.id</code>.

<a id="fn-1110"></a>
### v.aliases.map callback (15:28)

Synchronous function. Lexically inside [z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv… callback (12:25)](#fn-863). Passed to <code>v.aliases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L15](#l15) Implicitly return: read <code>a.prefix</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>architectureSchema</code> | <code>files</code> | <code>z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32)</code> | [L6](#l6) |
| <code>architectureSchema</code> | <code>boundaries</code> | <code>intentPolicySchema.shape.boundaries</code> | [L8](#l8) |
| <code>architectureSchema</code> | <code>conventions</code> | <code>z.array(z.object({id,within:path,style:z.enum(['snake_case','kebab-case','PascalCase']), reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([])</code> | [L9](#l9) |
| <code>architectureSchema</code> | <code>conventions.id</code> | <code>id</code> | [L9](#l9) |
| <code>architectureSchema</code> | <code>conventions.within</code> | <code>path</code> | [L9](#l9) |
| <code>architectureSchema</code> | <code>conventions.style</code> | <code>z.enum(['snake_case','kebab-case','PascalCase'])</code> | [L9](#l9) |
| <code>architectureSchema</code> | <code>conventions.reason</code> | <code>z.string().trim().min(1).max(1000)</code> | [L10](#l10) |
| <code>architectureSchema</code> | <code>aliases</code> | <code>z.array(z.object({prefix:z.string().min(1).max(256).regex(/^[a-zA-Z@][a-zA-Z0-9_@./-]*$/),target:path}).strict()).max(100).default([])</code> | [L11](#l11) |
| <code>architectureSchema</code> | <code>aliases.prefix</code> | <code>z.string().min(1).max(256).regex(/^[a-zA-Z@][a-zA-Z0-9_@./-]*$/)</code> | [L11](#l11) |
| <code>architectureSchema</code> | <code>aliases.target</code> | <code>path</code> | [L11](#l11) |
| <code>architectureResultSchema</code> | <code>state</code> | <code>z.enum(['checked','partial'])</code> | [L18](#l18) |
| <code>architectureResultSchema</code> | <code>policySha256</code> | <code>z.string()</code> | [L18](#l18) |
| <code>architectureResultSchema</code> | <code>coverage</code> | <code>z.literal('configured-import-declarations-only')</code> | [L18](#l18) |
| <code>architectureResultSchema</code> | <code>files</code> | <code>z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()}))</code> | [L19](#l19) |
| <code>architectureResultSchema</code> | <code>files.path</code> | <code>z.string()</code> | [L19](#l19) |
| <code>architectureResultSchema</code> | <code>files.sha256</code> | <code>z.string().nullable()</code> | [L19](#l19) |
| <code>architectureResultSchema</code> | <code>files.status</code> | <code>z.string()</code> | [L19](#l19) |
| <code>architectureResultSchema</code> | <code>dependencies</code> | <code>z.array(z.object({from:z.string(),line:z.number(),excerpt:z.string(),specifier:z.string().optional(), status:z.enum(['resolved','external','unresolved']),to:z.string().optional(),reason:z.string()}))</code> | [L20](#l20) |
| <code>architectureResultSchema</code> | <code>dependencies.from</code> | <code>z.string()</code> | [L20](#l20) |
| <code>architectureResultSchema</code> | <code>dependencies.line</code> | <code>z.number()</code> | [L20](#l20) |
| <code>architectureResultSchema</code> | <code>dependencies.excerpt</code> | <code>z.string()</code> | [L20](#l20) |
| <code>architectureResultSchema</code> | <code>dependencies.specifier</code> | <code>z.string().optional()</code> | [L20](#l20) |
| <code>architectureResultSchema</code> | <code>dependencies.status</code> | <code>z.enum(['resolved','external','unresolved'])</code> | [L21](#l21) |
| <code>architectureResultSchema</code> | <code>dependencies.to</code> | <code>z.string().optional()</code> | [L21](#l21) |
| <code>architectureResultSchema</code> | <code>dependencies.reason</code> | <code>z.string()</code> | [L21](#l21) |
| <code>architectureResultSchema</code> | <code>boundaries</code> | <code>z.array(z.object({id:z.string(),from:z.string(),to:z.string(),reason:z.string(), status:z.enum(['violation','no-observed-violation']),evidence:z.array(dependencyObservationSchema)}))</code> | [L22](#l22) |
| <code>architectureResultSchema</code> | <code>boundaries.id</code> | <code>z.string()</code> | [L22](#l22) |
| <code>architectureResultSchema</code> | <code>boundaries.from</code> | <code>z.string()</code> | [L22](#l22) |
| <code>architectureResultSchema</code> | <code>boundaries.to</code> | <code>z.string()</code> | [L22](#l22) |
| <code>architectureResultSchema</code> | <code>boundaries.reason</code> | <code>z.string()</code> | [L22](#l22) |
| <code>architectureResultSchema</code> | <code>boundaries.status</code> | <code>z.enum(['violation','no-observed-violation'])</code> | [L23](#l23) |
| <code>architectureResultSchema</code> | <code>boundaries.evidence</code> | <code>z.array(dependencyObservationSchema)</code> | [L23](#l23) |
| <code>architectureResultSchema</code> | <code>conventions</code> | <code>z.array(z.object({id:z.string(),within:z.string(),style:z.string(),reason:z.string(), status:z.enum(['violation','no-observed-violation']),evidence:z.array(z.string())}))</code> | [L24](#l24) |
| <code>architectureResultSchema</code> | <code>conventions.id</code> | <code>z.string()</code> | [L24](#l24) |
| <code>architectureResultSchema</code> | <code>conventions.within</code> | <code>z.string()</code> | [L24](#l24) |
| <code>architectureResultSchema</code> | <code>conventions.style</code> | <code>z.string()</code> | [L24](#l24) |
| <code>architectureResultSchema</code> | <code>conventions.reason</code> | <code>z.string()</code> | [L24](#l24) |
| <code>architectureResultSchema</code> | <code>conventions.status</code> | <code>z.enum(['violation','no-observed-violation'])</code> | [L25](#l25) |
| <code>architectureResultSchema</code> | <code>conventions.evidence</code> | <code>z.array(z.string())</code> | [L25](#l25) |
| <code>architectureResultSchema</code> | <code>issues</code> | <code>z.array(z.string())</code> | [L25](#l25) |

## Compile-time data contracts

### ArchitectureResult

```typescript
type ArchitectureResult=z.infer<typeof architectureResultSchema>;
```

Declared at [L27](#l27). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L3](#l3) <code>path</code>: read <code>dependencyObservationSchema.shape.from</code>.
- [L4](#l4) <code>id</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L5](#l5) <code>architectureSchema</code>: call the named operation with the supplied arguments: <code>z.object({ files:z.array(z.string().min(1).max(512).refine(v=&gt;!/[\\:?![\]{}\u0000-\u001f]/.test(v) &amp;&amp; v.split('/').every(p=&gt;!!p &amp;&amp; p!=='.' &amp;&amp; p!=='..' &amp;&amp; (!p.includes('**') &#124;&#124; p==='**')))).min(1).max(32), boundaries:intentPolicySchema.shape.boundaries, conv…</code>.
- [L17](#l17) <code>architectureResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ state:z.enum(['checked','partial']),policySha256:z.string(),coverage:z.literal('configured-import-declarations-only'), files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})), dependencies:z.array(z.object({from:…</code>.

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
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
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
   1 | import {z} from 'zod';
   2 | import {intentPolicySchema,dependencyObservationSchema} from './intent-policy.js';
   3 | const path=dependencyObservationSchema.shape.from;
   4 | const id=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
   5 | export const architectureSchema=z.object({
   6 |   files:z.array(z.string().min(1).max(512).refine(v=>!/[\\:?![\]{}\u0000-\u001f]/.test(v)
   7 |     && v.split('/').every(p=>!!p && p!=='.' && p!=='..' && (!p.includes('**') || p==='**')))).min(1).max(32),
   8 |   boundaries:intentPolicySchema.shape.boundaries,
   9 |   conventions:z.array(z.object({id,within:path,style:z.enum(['snake_case','kebab-case','PascalCase']),
  10 |     reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([]),
  11 |   aliases:z.array(z.object({prefix:z.string().min(1).max(256).regex(/^[a-zA-Z@][a-zA-Z0-9_@./-]*$/),target:path}).strict()).max(100).default([]),
  12 | }).strict().superRefine((v,ctx)=>{
  13 |   const ids=[...v.boundaries,...v.conventions].map(p=>p.id);
  14 |   if(!ids.length || new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Provide at least one policy; policy IDs must be unique.'});
  15 |   if(new Set(v.aliases.map(a=>a.prefix)).size!==v.aliases.length)ctx.addIssue({code:'custom',message:'Alias prefixes must be unique.'});
  16 | });
  17 | export const architectureResultSchema=z.object({
  18 |   state:z.enum(['checked','partial']),policySha256:z.string(),coverage:z.literal('configured-import-declarations-only'),
  19 |   files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})),
  20 |   dependencies:z.array(z.object({from:z.string(),line:z.number(),excerpt:z.string(),specifier:z.string().optional(),
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l27"></a>

```text
  21 |     status:z.enum(['resolved','external','unresolved']),to:z.string().optional(),reason:z.string()})),
  22 |   boundaries:z.array(z.object({id:z.string(),from:z.string(),to:z.string(),reason:z.string(),
  23 |     status:z.enum(['violation','no-observed-violation']),evidence:z.array(dependencyObservationSchema)})),
  24 |   conventions:z.array(z.object({id:z.string(),within:z.string(),style:z.string(),reason:z.string(),
  25 |     status:z.enum(['violation','no-observed-violation']),evidence:z.array(z.string())})),issues:z.array(z.string()),
  26 | });
  27 | export type ArchitectureResult=z.infer<typeof architectureResultSchema>;
  28 | 
```
