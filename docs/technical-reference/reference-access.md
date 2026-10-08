# src/reference-access.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

These schemas validate runtime grants separately from repository configuration. Exact origins omit a trailing slash and cannot contain credentials/query/fragment. Root IDs index caller-supplied filesystem paths. A configured URL/root ID names desired access but only a runtime grant authorizes it.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `daba2ceb59cb5deb8c4ec88e0071d2af062948809f608bef82071588b5eaa873`.

This chapter inventories **3 function bodies/callbacks**, **5 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.

## Module execution

- [L3](#l3) Bind <code>rootIdSchema</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L4](#l4) Bind <code>referenceUrlSchema</code>: call the named operation with the supplied arguments: <code>z.string().max(2048).refine(value=&gt;{ try {const url=new URL(value);return url.protocol==='https:' &amp;&amp; !url.username &amp;&amp; !url.password &amp;&amp; !url.search &amp;&amp; !url.hash &amp;&amp; !/[\u0000-\u0020\\]/.test(value); }catch{return false;} },'Use an HTTPS URL without credential…</code>.
- [L8](#l8) Bind <code>referenceOriginSchema</code>: call the named operation with the supplied arguments: <code>referenceUrlSchema.refine(value=&gt;new URL(value).pathname==='/' &amp;&amp; value===new URL(value).origin, 'Supply an exact HTTPS origin, without a trailing slash or path.')</code>.
- [L11](#l11) Bind <code>referenceAccessSchema</code>: call the named operation with the supplied arguments: <code>z.object({ roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}), origins:z.array(referenceOriginSchema).max(16).default([]), }).strict().refine(value=&gt;Object.keys(value.roots).length&lt;=16,'At most 16 external roots.')</code>.

## Function index

- [z.string().max(2048).refine callback (4:61)](#fn-161)
- [referenceUrlSchema.refine callback (8:62)](#fn-494)
- [z.object({ roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}), origins:z.array(referenceOriginSchema).max(16).default([]), }).strict().refine callback (14:20)](#fn-921)

<a id="fn-161"></a>
### z.string().max(2048).refine callback (4:61)

Synchronous function. Defined in module scope. Passed to <code>z.string().max(2048).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L5](#l5) <code>url</code>: construct <code>URL</code> using <code>value</code>; this creates the local instance used below.

Execution:

- [L5](#l5) Run the protected block:
  - [L5](#l5) Bind <code>url</code>: construct <code>URL</code> using <code>value</code>; this creates the local instance used below.
  - [L5](#l5) Return to the caller: evaluate <code>url.protocol==='https:' &amp;&amp; !url.username &amp;&amp; !url.password &amp;&amp; !url.search &amp;&amp; !url.hash &amp;&amp; !/[\u0000-\u0020\\]/.test(value)</code> left to right with falsy short-circuiting.
- [L5](#l5) If it throws:
  - [L6](#l6) Return to the caller: use the literal <code>false</code>.

<a id="fn-494"></a>
### referenceUrlSchema.refine callback (8:62)

Synchronous function. Defined in module scope. Passed to <code>referenceUrlSchema.refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: evaluate <code>new URL(value).pathname==='/' &amp;&amp; value===new URL(value).origin</code> left to right with falsy short-circuiting.

<a id="fn-921"></a>
### z.object({ roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}), origins:z.array(referenceOriginSchema).max(16).default([]), }).strict().refine callback (14:20)

Synchronous function. Defined in module scope. Passed to <code>z.object({ roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}), origins:z.array(referenceOriginSchema).max(16).default([]), }).strict().refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: compute <code>Object.keys(value.roots).length&lt;=16</code> with the <code>&lt;=</code> operator.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>referenceAccessSchema</code> | <code>roots</code> | <code>z.record(rootIdSchema,z.string().min(1).max(4096)).default({})</code> | [L12](#l12) |
| <code>referenceAccessSchema</code> | <code>origins</code> | <code>z.array(referenceOriginSchema).max(16).default([])</code> | [L13](#l13) |

## Compile-time data contracts

### ReferenceAccess

```typescript
type ReferenceAccess=z.input<typeof referenceAccessSchema>;
```

Declared at [L15](#l15). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L3](#l3) <code>rootIdSchema</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code>.
- [L4](#l4) <code>referenceUrlSchema</code>: call the named operation with the supplied arguments: <code>z.string().max(2048).refine(value=&gt;{ try {const url=new URL(value);return url.protocol==='https:' &amp;&amp; !url.username &amp;&amp; !url.password &amp;&amp; !url.search &amp;&amp; !url.hash &amp;&amp; !/[\u0000-\u0020\\]/.test(value); }catch{return false;} },'Use an HTTPS URL without credential…</code>.
- [L8](#l8) <code>referenceOriginSchema</code>: call the named operation with the supplied arguments: <code>referenceUrlSchema.refine(value=&gt;new URL(value).pathname==='/' &amp;&amp; value===new URL(value).origin, 'Supply an exact HTTPS origin, without a trailing slash or path.')</code>.
- [L11](#l11) <code>referenceAccessSchema</code>: call the named operation with the supplied arguments: <code>z.object({ roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}), origins:z.array(referenceOriginSchema).max(16).default([]), }).strict().refine(value=&gt;Object.keys(value.roots).length&lt;=16,'At most 16 external roots.')</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>

```text
   1 | import {z} from 'zod';
   2 | 
   3 | export const rootIdSchema=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
   4 | export const referenceUrlSchema=z.string().max(2048).refine(value=>{
   5 |   try {const url=new URL(value);return url.protocol==='https:' && !url.username && !url.password && !url.search && !url.hash
   6 |     && !/[\u0000-\u0020\\]/.test(value); }catch{return false;}
   7 | },'Use an HTTPS URL without credentials, query, fragment or whitespace.');
   8 | export const referenceOriginSchema=referenceUrlSchema.refine(value=>new URL(value).pathname==='/' && value===new URL(value).origin,
   9 |   'Supply an exact HTTPS origin, without a trailing slash or path.');
  10 | /** Runtime grants only. Repository configuration cannot authorize external access. */
  11 | export const referenceAccessSchema=z.object({
  12 |   roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}),
  13 |   origins:z.array(referenceOriginSchema).max(16).default([]),
  14 | }).strict().refine(value=>Object.keys(value.roots).length<=16,'At most 16 external roots.');
  15 | export type ReferenceAccess=z.input<typeof referenceAccessSchema>;
  16 | 
```
