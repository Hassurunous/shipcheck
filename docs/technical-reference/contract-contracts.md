# src/contract-contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Binding schemas connect an explicit set of consumer paths to an OpenAPI resource and service base URL. Result schemas separate overall comparison availability from each call's matched/mismatch/unresolved/outside-service outcome. Provider hashes and JSON Pointers preserve which contract bytes support the comparison.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `c5e941168fd346d07eb6457accc2e8c6f507b43bb7319904e7d35d61e13106e7`.

This chapter inventories **1 function bodies/callbacks**, **3 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./resource-contracts.js</code>: <code>resourceDefinitionSchema</code>, <code>resourceRecordSchema</code>.
- <code>./version-policy.js</code>: <code>versionRangeSchema</code>.

## Module execution

- [L4](#l4) Bind <code>contractBindingSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), resourceId:z.string().min(1).max(64),files:z.array(resourceDefinitionSchema.shape.path).min(1).max(32), baseUrl:z.string().max(2048).refine(value=&gt;{try{const url=new URL(value);return ['https:'…</code>.
- [L11](#l11) Bind <code>contractResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string(),resourceId:z.string(), state:z.enum(['checked','partial','unavailable','version-mismatch']), reference:z.object({path:z.string(),sha256:z.string().nullable(),apiVersion:z.string().optional(),origin:resourceRecordSchema.shape.origin})…</code>.

## Function index

- [z.string().max(2048).refine callback (6:39)](#fn-409)

<a id="fn-409"></a>
### z.string().max(2048).refine callback (6:39)

Synchronous function. Defined in module scope. Passed to <code>z.string().max(2048).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L6](#l6) <code>url</code>: construct <code>URL</code> using <code>value</code>; this creates the local instance used below.

Execution:

- [L6](#l6) Run the protected block:
  - [L6](#l6) Bind <code>url</code>: construct <code>URL</code> using <code>value</code>; this creates the local instance used below.
  - [L6](#l6) Return to the caller: evaluate <code>['https:','http:'].includes(url.protocol) &amp;&amp; !url.username &amp;&amp; !url.password &amp;&amp; !url.search &amp;&amp; !url.hash</code> left to right with falsy short-circuiting.
- [L6](#l6) If it throws:
  - [L6](#l6) Return to the caller: use the literal <code>false</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>contractBindingSchema</code> | <code>id</code> | <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code> | [L4](#l4) |
| <code>contractBindingSchema</code> | <code>resourceId</code> | <code>z.string().min(1).max(64)</code> | [L5](#l5) |
| <code>contractBindingSchema</code> | <code>files</code> | <code>z.array(resourceDefinitionSchema.shape.path).min(1).max(32)</code> | [L5](#l5) |
| <code>contractBindingSchema</code> | <code>baseUrl</code> | <code>z.string().max(2048).refine(value=&gt;{try{const url=new URL(value);return ['https:','http:'].includes(url.protocol) &amp;&amp; !url.username &amp;&amp; !url.password &amp;&amp; !url.search &amp;&amp; !url.hash;}catch{return false;}},'Use an HTTP(S) service base URL without credentials, quer…</code> | [L6](#l6) |
| <code>contractBindingSchema</code> | <code>expectedVersion</code> | <code>z.string().min(1).max(128).optional()</code> | [L7](#l7) |
| <code>contractBindingSchema</code> | <code>versionRange</code> | <code>versionRangeSchema.optional()</code> | [L8](#l8) |
| <code>contractResultSchema</code> | <code>id</code> | <code>z.string()</code> | [L11](#l11) |
| <code>contractResultSchema</code> | <code>resourceId</code> | <code>z.string()</code> | [L11](#l11) |
| <code>contractResultSchema</code> | <code>state</code> | <code>z.enum(['checked','partial','unavailable','version-mismatch'])</code> | [L12](#l12) |
| <code>contractResultSchema</code> | <code>reference</code> | <code>z.object({path:z.string(),sha256:z.string().nullable(),apiVersion:z.string().optional(),origin:resourceRecordSchema.shape.origin}).optional()</code> | [L13](#l13) |
| <code>contractResultSchema</code> | <code>reference.path</code> | <code>z.string()</code> | [L13](#l13) |
| <code>contractResultSchema</code> | <code>reference.sha256</code> | <code>z.string().nullable()</code> | [L13](#l13) |
| <code>contractResultSchema</code> | <code>reference.apiVersion</code> | <code>z.string().optional()</code> | [L13](#l13) |
| <code>contractResultSchema</code> | <code>reference.origin</code> | <code>resourceRecordSchema.shape.origin</code> | [L13](#l13) |
| <code>contractResultSchema</code> | <code>issues</code> | <code>z.array(z.string())</code> | [L14](#l14) |
| <code>contractResultSchema</code> | <code>scope</code> | <code>z.enum(['literal-javascript-fetch-only','literal-http-calls-only'])</code> | [L14](#l14) |
| <code>contractResultSchema</code> | <code>files</code> | <code>z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string(), adapter:z.string().optional(),language:z.string().optional(),callCount:z.number().int().nonnegative().optional()}))</code> | [L15](#l15) |
| <code>contractResultSchema</code> | <code>files.path</code> | <code>z.string()</code> | [L15](#l15) |
| <code>contractResultSchema</code> | <code>files.sha256</code> | <code>z.string().nullable()</code> | [L15](#l15) |
| <code>contractResultSchema</code> | <code>files.status</code> | <code>z.string()</code> | [L15](#l15) |
| <code>contractResultSchema</code> | <code>files.adapter</code> | <code>z.string().optional()</code> | [L16](#l16) |
| <code>contractResultSchema</code> | <code>files.language</code> | <code>z.string().optional()</code> | [L16](#l16) |
| <code>contractResultSchema</code> | <code>files.callCount</code> | <code>z.number().int().nonnegative().optional()</code> | [L16](#l16) |
| <code>contractResultSchema</code> | <code>calls</code> | <code>z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(), observationKind:z.enum(['request-call','request-construction']).optional(), status:z.enum(['matched','mismatch','unresolved','outside-service']),reason:z.string(), method…</code> | [L17](#l17) |
| <code>contractResultSchema</code> | <code>calls.path</code> | <code>z.string()</code> | [L17](#l17) |
| <code>contractResultSchema</code> | <code>calls.line</code> | <code>z.number().int().positive()</code> | [L17](#l17) |
| <code>contractResultSchema</code> | <code>calls.excerpt</code> | <code>z.string()</code> | [L17](#l17) |
| <code>contractResultSchema</code> | <code>calls.observationKind</code> | <code>z.enum(['request-call','request-construction']).optional()</code> | [L18](#l18) |
| <code>contractResultSchema</code> | <code>calls.status</code> | <code>z.enum(['matched','mismatch','unresolved','outside-service'])</code> | [L19](#l19) |
| <code>contractResultSchema</code> | <code>calls.reason</code> | <code>z.string()</code> | [L19](#l19) |
| <code>contractResultSchema</code> | <code>calls.method</code> | <code>z.string().optional()</code> | [L20](#l20) |
| <code>contractResultSchema</code> | <code>calls.url</code> | <code>z.string().optional()</code> | [L20](#l20) |
| <code>contractResultSchema</code> | <code>calls.adapter</code> | <code>z.string().optional()</code> | [L20](#l20) |
| <code>contractResultSchema</code> | <code>calls.queryNames</code> | <code>z.array(z.string()).optional()</code> | [L20](#l20) |
| <code>contractResultSchema</code> | <code>calls.contractPointers</code> | <code>z.array(z.string())</code> | [L20](#l20) |

## Compile-time data contracts

### ContractBinding

```typescript
type ContractBinding=z.infer<typeof contractBindingSchema>;
```

Declared at [L10](#l10). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### ContractResult

```typescript
type ContractResult=z.infer<typeof contractResultSchema>;
```

Declared at [L22](#l22). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>contractBindingSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), resourceId:z.string().min(1).max(64),files:z.array(resourceDefinitionSchema.shape.path).min(1).max(32), baseUrl:z.string().max(2048).refine(value=&gt;{try{const url=new URL(value);return ['https:'…</code>.
- [L11](#l11) <code>contractResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string(),resourceId:z.string(), state:z.enum(['checked','partial','unavailable','version-mismatch']), reference:z.object({path:z.string(),sha256:z.string().nullable(),apiVersion:z.string().optional(),origin:resourceRecordSchema.shape.origin})…</code>.

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
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {z} from 'zod';
   2 | import {resourceDefinitionSchema,resourceRecordSchema} from './resource-contracts.js';
   3 | import {versionRangeSchema} from './version-policy.js';
   4 | export const contractBindingSchema=z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
   5 |   resourceId:z.string().min(1).max(64),files:z.array(resourceDefinitionSchema.shape.path).min(1).max(32),
   6 |   baseUrl:z.string().max(2048).refine(value=>{try{const url=new URL(value);return ['https:','http:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;}catch{return false;}},'Use an HTTP(S) service base URL without credentials, query or fragment.'),
   7 |   expectedVersion:z.string().min(1).max(128).optional(),
   8 |   versionRange:versionRangeSchema.optional(),
   9 | }).strict();
  10 | export type ContractBinding=z.infer<typeof contractBindingSchema>;
  11 | export const contractResultSchema=z.object({id:z.string(),resourceId:z.string(),
  12 |   state:z.enum(['checked','partial','unavailable','version-mismatch']),
  13 |   reference:z.object({path:z.string(),sha256:z.string().nullable(),apiVersion:z.string().optional(),origin:resourceRecordSchema.shape.origin}).optional(),
  14 |   issues:z.array(z.string()),scope:z.enum(['literal-javascript-fetch-only','literal-http-calls-only']),
  15 |   files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string(),
  16 |     adapter:z.string().optional(),language:z.string().optional(),callCount:z.number().int().nonnegative().optional()})),
  17 |   calls:z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(),
  18 |     observationKind:z.enum(['request-call','request-construction']).optional(),
  19 |     status:z.enum(['matched','mismatch','unresolved','outside-service']),reason:z.string(),
  20 |     method:z.string().optional(),url:z.string().optional(),adapter:z.string().optional(),queryNames:z.array(z.string()).optional(),contractPointers:z.array(z.string())})),
```

<a id="l22"></a>

```text
  21 | });
  22 | export type ContractResult=z.infer<typeof contractResultSchema>;
  23 | 
```
