# src/sdk-contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

SDK bindings identify a package, explicit consumers, optional external root/package root and declaration entry, plus version checks. Results retain provider manifest/declaration hashes and evidence for individual calls. This schema describes a narrow declaration comparison, not TypeScript compiler resolution or runtime SDK compatibility.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `0cb0643d50095f37a8df9255712e3c548ba2cbccdb8651ac2adbc2ae27a09660`.

This chapter inventories **1 function bodies/callbacks**, **3 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./resource-contracts.js</code>: <code>resourceDefinitionSchema</code>.
- <code>./reference-access.js</code>: <code>rootIdSchema</code>.
- <code>./version-policy.js</code>: <code>versionRangeSchema</code>.

## Module execution

- [L5](#l5) Bind <code>path</code>: read <code>resourceDefinitionSchema.shape.path</code>.
- [L6](#l6) Bind <code>sdkBindingSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:rootIdSchema,package:z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/), files:z.array(path).min(1).max(32),rootId:rootIdSchema.optional(), packageRoot:z.union([path,z.literal('.')]).optional(), declarationFile:pat…</code>.
- [L13](#l13) Bind <code>sdkResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),package:z.string(),state:z.enum(['checked','partial','unavailable','version-mismatch']), scope:z.literal('direct-named-function-calls-only'),issues:z.array(z.string()), provider:z.object({manifestPath:z.string(),manifestSha256:z.str…</code>.

## Function index

- [path.refine callback (10:31)](#fn-549)

<a id="fn-549"></a>
### path.refine callback (10:31)

Synchronous function. Defined in module scope. Passed to <code>path.refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L10](#l10) Implicitly return: evaluate a regular expression against the value: <code>/\.d\.(?:ts&#124;mts&#124;cts)$/.test(value)</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>sdkBindingSchema</code> | <code>id</code> | <code>rootIdSchema</code> | [L7](#l7) |
| <code>sdkBindingSchema</code> | <code>package</code> | <code>z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/)</code> | [L7](#l7) |
| <code>sdkBindingSchema</code> | <code>files</code> | <code>z.array(path).min(1).max(32)</code> | [L8](#l8) |
| <code>sdkBindingSchema</code> | <code>rootId</code> | <code>rootIdSchema.optional()</code> | [L8](#l8) |
| <code>sdkBindingSchema</code> | <code>packageRoot</code> | <code>z.union([path,z.literal('.')]).optional()</code> | [L9](#l9) |
| <code>sdkBindingSchema</code> | <code>declarationFile</code> | <code>path.refine(value=&gt;/\.d\.(?:ts&#124;mts&#124;cts)$/.test(value),'Expected a declaration file.').optional()</code> | [L10](#l10) |
| <code>sdkBindingSchema</code> | <code>expectedVersion</code> | <code>z.string().min(1).max(128).optional()</code> | [L11](#l11) |
| <code>sdkBindingSchema</code> | <code>versionRange</code> | <code>versionRangeSchema.optional()</code> | [L11](#l11) |
| <code>sdkResultSchema</code> | <code>id</code> | <code>z.string()</code> | [L14](#l14) |
| <code>sdkResultSchema</code> | <code>package</code> | <code>z.string()</code> | [L14](#l14) |
| <code>sdkResultSchema</code> | <code>state</code> | <code>z.enum(['checked','partial','unavailable','version-mismatch'])</code> | [L14](#l14) |
| <code>sdkResultSchema</code> | <code>scope</code> | <code>z.literal('direct-named-function-calls-only')</code> | [L15](#l15) |
| <code>sdkResultSchema</code> | <code>issues</code> | <code>z.array(z.string())</code> | [L15](#l15) |
| <code>sdkResultSchema</code> | <code>provider</code> | <code>z.object({manifestPath:z.string(),manifestSha256:z.string().nullable(),version:z.string().optional(), declarationPath:z.string().optional(),declarationSha256:z.string().nullable().optional(),rootId:z.string().optional(),rootSha256:z.string().optional()}).op…</code> | [L16](#l16) |
| <code>sdkResultSchema</code> | <code>provider.manifestPath</code> | <code>z.string()</code> | [L16](#l16) |
| <code>sdkResultSchema</code> | <code>provider.manifestSha256</code> | <code>z.string().nullable()</code> | [L16](#l16) |
| <code>sdkResultSchema</code> | <code>provider.version</code> | <code>z.string().optional()</code> | [L16](#l16) |
| <code>sdkResultSchema</code> | <code>provider.declarationPath</code> | <code>z.string().optional()</code> | [L17](#l17) |
| <code>sdkResultSchema</code> | <code>provider.declarationSha256</code> | <code>z.string().nullable().optional()</code> | [L17](#l17) |
| <code>sdkResultSchema</code> | <code>provider.rootId</code> | <code>z.string().optional()</code> | [L17](#l17) |
| <code>sdkResultSchema</code> | <code>provider.rootSha256</code> | <code>z.string().optional()</code> | [L17](#l17) |
| <code>sdkResultSchema</code> | <code>files</code> | <code>z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()}))</code> | [L18](#l18) |
| <code>sdkResultSchema</code> | <code>files.path</code> | <code>z.string()</code> | [L18](#l18) |
| <code>sdkResultSchema</code> | <code>files.sha256</code> | <code>z.string().nullable()</code> | [L18](#l18) |
| <code>sdkResultSchema</code> | <code>files.status</code> | <code>z.string()</code> | [L18](#l18) |
| <code>sdkResultSchema</code> | <code>calls</code> | <code>z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(),symbol:z.string(), status:z.enum(['matched','mismatch','unresolved']),reason:z.string(), providerEvidence:z.array(z.object({line:z.number().int().positive(),excerpt:z.stri…</code> | [L19](#l19) |
| <code>sdkResultSchema</code> | <code>calls.path</code> | <code>z.string()</code> | [L19](#l19) |
| <code>sdkResultSchema</code> | <code>calls.line</code> | <code>z.number().int().positive()</code> | [L19](#l19) |
| <code>sdkResultSchema</code> | <code>calls.excerpt</code> | <code>z.string()</code> | [L19](#l19) |
| <code>sdkResultSchema</code> | <code>calls.symbol</code> | <code>z.string()</code> | [L19](#l19) |
| <code>sdkResultSchema</code> | <code>calls.status</code> | <code>z.enum(['matched','mismatch','unresolved'])</code> | [L20](#l20) |
| <code>sdkResultSchema</code> | <code>calls.reason</code> | <code>z.string()</code> | [L20](#l20) |
| <code>sdkResultSchema</code> | <code>calls.providerEvidence</code> | <code>z.array(z.object({line:z.number().int().positive(),excerpt:z.string()}))</code> | [L21](#l21) |
| <code>sdkResultSchema</code> | <code>calls.providerEvidence.line</code> | <code>z.number().int().positive()</code> | [L21](#l21) |
| <code>sdkResultSchema</code> | <code>calls.providerEvidence.excerpt</code> | <code>z.string()</code> | [L21](#l21) |

## Compile-time data contracts

### SdkResult

```typescript
type SdkResult=z.infer<typeof sdkResultSchema>;
```

Declared at [L23](#l23). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L5](#l5) <code>path</code>: read <code>resourceDefinitionSchema.shape.path</code>.
- [L6](#l6) <code>sdkBindingSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:rootIdSchema,package:z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/), files:z.array(path).min(1).max(32),rootId:rootIdSchema.optional(), packageRoot:z.union([path,z.literal('.')]).optional(), declarationFile:pat…</code>.
- [L13](#l13) <code>sdkResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),package:z.string(),state:z.enum(['checked','partial','unavailable','version-mismatch']), scope:z.literal('direct-named-function-calls-only'),issues:z.array(z.string()), provider:z.object({manifestPath:z.string(),manifestSha256:z.str…</code>.

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
   2 | import {resourceDefinitionSchema} from './resource-contracts.js';
   3 | import {rootIdSchema} from './reference-access.js';
   4 | import {versionRangeSchema} from './version-policy.js';
   5 | const path=resourceDefinitionSchema.shape.path;
   6 | export const sdkBindingSchema=z.object({
   7 |   id:rootIdSchema,package:z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/),
   8 |   files:z.array(path).min(1).max(32),rootId:rootIdSchema.optional(),
   9 |   packageRoot:z.union([path,z.literal('.')]).optional(),
  10 |   declarationFile:path.refine(value=>/\.d\.(?:ts|mts|cts)$/.test(value),'Expected a declaration file.').optional(),
  11 |   expectedVersion:z.string().min(1).max(128).optional(),versionRange:versionRangeSchema.optional(),
  12 | }).strict();
  13 | export const sdkResultSchema=z.object({
  14 |   id:z.string(),package:z.string(),state:z.enum(['checked','partial','unavailable','version-mismatch']),
  15 |   scope:z.literal('direct-named-function-calls-only'),issues:z.array(z.string()),
  16 |   provider:z.object({manifestPath:z.string(),manifestSha256:z.string().nullable(),version:z.string().optional(),
  17 |     declarationPath:z.string().optional(),declarationSha256:z.string().nullable().optional(),rootId:z.string().optional(),rootSha256:z.string().optional()}).optional(),
  18 |   files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})),
  19 |   calls:z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(),symbol:z.string(),
  20 |     status:z.enum(['matched','mismatch','unresolved']),reason:z.string(),
```

<a id="l21"></a>
<a id="l23"></a>

```text
  21 |     providerEvidence:z.array(z.object({line:z.number().int().positive(),excerpt:z.string()}))})),
  22 | });
  23 | export type SdkResult=z.infer<typeof sdkResultSchema>;
  24 | 
```
