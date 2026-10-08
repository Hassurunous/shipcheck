# src/resource-contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Definitions capture a reference's ID, local path, declared kind/authority/version, required status and scope. External roots and URLs are mutually exclusive; HTTPS references require an expected byte hash. Records add load status, origin identity, byte/line counts and a nullable hash, while snapshots retain text privately in memory. Loading state and assessment state are intentionally separate.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `df9f9e58c15038a78911e988c7bab85d55e96c9271e8b6774eec11c2f5dcfcf0`.

This chapter inventories **3 function bodies/callbacks**, **6 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./reference-access.js</code>: <code>rootIdSchema</code>, <code>referenceUrlSchema</code>.

## Module execution

- [L4](#l4) Bind <code>pathSchema</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(path=&gt;!/[\\:\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Use a relative slash-separated file path inside the repository.')</code>.
- [L6](#l6) Bind <code>resourceDefinitionSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), path:pathSchema, rootId:rootIdSchema.optional(), url:referenceUrlSchema.optional(), kind:z.enum(['document','openapi','schema','source']).default('document'), authority:z.enum(['authoritative'…</code>.
- [L25](#l25) Bind <code>resourceRecordSchema</code>: call the named operation with the supplied arguments: <code>resourceDefinitionSchema.safeExtend({ status:z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit', 'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch','access-denied','remote-failed']…</code>.
- [L32](#l32) Bind <code>referencesSchema</code>: call the named operation with the supplied arguments: <code>z.object({ state:z.enum(['ready','incomplete']), evaluation:z.literal('not-assessed'), resources:z.array(resourceRecordSchema), })</code>.
- [L37](#l37) Bind <code>resourceEvidenceSchema</code>: call the named operation with the supplied arguments: <code>z.object({resourceId:z.string().min(1),snapshotSha256:z.string().regex(/^[a-f0-9]{64}$/), startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerpt:z.string().min(1).max(8000)}).strict()</code>.

## Function index

- [z.string().min(1).max(512).refine callback (4:52)](#fn-146)
- [path.split('/').every callback (5:28)](#fn-212)
- [z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), path:pathSchema, rootId:rootIdSchema.optional(), url:referenceUrlSchema.optional(), kind:z.enum(['document','openapi','schema','source']).default('document'), authority:z.enum(['authoritative'… callback (17:25)](#fn-903)

<a id="fn-146"></a>
### z.string().min(1).max(512).refine callback (4:52)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(512).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L4](#l4) Implicitly return: evaluate <code>!/[\\:\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..')</code> left to right with falsy short-circuiting.

<a id="fn-212"></a>
### path.split('/').every callback (5:28)

Synchronous function. Lexically inside [z.string().min(1).max(512).refine callback (4:52)](#fn-146). Passed to <code>path.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L5](#l5) Implicitly return: evaluate <code>part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'</code> left to right with falsy short-circuiting.

<a id="fn-903"></a>
### z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), path:pathSchema, rootId:rootIdSchema.optional(), url:referenceUrlSchema.optional(), kind:z.enum(['document','openapi','schema','source']).default('document'), authority:z.enum(['authoritative'… callback (17:25)

Synchronous function. Defined in module scope. Passed to <code>z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), path:pathSchema, rootId:rootIdSchema.optional(), url:referenceUrlSchema.optional(), kind:z.enum(['document','openapi','schema','source']).default('document'), authority:z.enum(['authoritative'…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.
- <code>ctx</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L21](#l21) <code>citationPath</code>: test <code>'origin' in value</code>; choose <code>value.path</code> when truthy, otherwise <code>&#96;@references/${value.id}/${value.path}&#96;</code>.

Execution:

- [L18](#l18) If <code>value.rootId &amp;&amp; value.url</code> is truthy:
  - [L18](#l18) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'Choose rootId or url, not both.'})</code>.
- [L19](#l19) If <code>value.url &amp;&amp; !value.expectedSha256</code> is truthy:
  - [L19](#l19) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'HTTPS references require expectedSha256.'})</code>.
- [L21](#l21) Bind <code>citationPath</code>: test <code>'origin' in value</code>; choose <code>value.path</code> when truthy, otherwise <code>&#96;@references/${value.id}/${value.path}&#96;</code>.
- [L22](#l22) If <code>(value.rootId &#124;&#124; value.url) &amp;&amp; citationPath.length&gt;512</code> is truthy:
  - [L22](#l22) call the named operation with the supplied arguments: <code>ctx.addIssue({code:'custom',message:'External citation path exceeds 512 characters.'})</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>resourceDefinitionSchema</code> | <code>id</code> | <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code> | [L7](#l7) |
| <code>resourceDefinitionSchema</code> | <code>path</code> | <code>pathSchema</code> | [L8](#l8) |
| <code>resourceDefinitionSchema</code> | <code>rootId</code> | <code>rootIdSchema.optional()</code> | [L9](#l9) |
| <code>resourceDefinitionSchema</code> | <code>url</code> | <code>referenceUrlSchema.optional()</code> | [L10](#l10) |
| <code>resourceDefinitionSchema</code> | <code>kind</code> | <code>z.enum(['document','openapi','schema','source']).default('document')</code> | [L11](#l11) |
| <code>resourceDefinitionSchema</code> | <code>authority</code> | <code>z.enum(['authoritative','supporting']).default('supporting')</code> | [L12](#l12) |
| <code>resourceDefinitionSchema</code> | <code>version</code> | <code>z.string().min(1).max(128).optional()</code> | [L13](#l13) |
| <code>resourceDefinitionSchema</code> | <code>expectedSha256</code> | <code>z.string().regex(/^[a-f0-9]{64}$/).optional()</code> | [L14](#l14) |
| <code>resourceDefinitionSchema</code> | <code>required</code> | <code>z.boolean().default(true)</code> | [L15](#l15) |
| <code>resourceDefinitionSchema</code> | <code>appliesTo</code> | <code>z.array(z.string()).min(1).default(['**'])</code> | [L16](#l16) |
| <code>resourceRecordSchema</code> | <code>status</code> | <code>z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit', 'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch','access-denied','remote-failed'])</code> | [L26](#l26) |
| <code>resourceRecordSchema</code> | <code>origin</code> | <code>z.object({kind:z.enum(['external-root','https']),path:z.string(),rootId:z.string().optional(),rootSha256:z.string().optional(),url:z.string().optional()}).optional()</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>origin.kind</code> | <code>z.enum(['external-root','https'])</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>origin.path</code> | <code>z.string()</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>origin.rootId</code> | <code>z.string().optional()</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>origin.rootSha256</code> | <code>z.string().optional()</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>origin.url</code> | <code>z.string().optional()</code> | [L28](#l28) |
| <code>resourceRecordSchema</code> | <code>sha256</code> | <code>z.string().nullable()</code> | [L29](#l29) |
| <code>resourceRecordSchema</code> | <code>bytes</code> | <code>z.number().int().nonnegative()</code> | [L29](#l29) |
| <code>resourceRecordSchema</code> | <code>lines</code> | <code>z.number().int().nonnegative()</code> | [L29](#l29) |
| <code>referencesSchema</code> | <code>state</code> | <code>z.enum(['ready','incomplete'])</code> | [L33](#l33) |
| <code>referencesSchema</code> | <code>evaluation</code> | <code>z.literal('not-assessed')</code> | [L34](#l34) |
| <code>referencesSchema</code> | <code>resources</code> | <code>z.array(resourceRecordSchema)</code> | [L35](#l35) |
| <code>resourceEvidenceSchema</code> | <code>resourceId</code> | <code>z.string().min(1)</code> | [L37](#l37) |
| <code>resourceEvidenceSchema</code> | <code>snapshotSha256</code> | <code>z.string().regex(/^[a-f0-9]{64}$/)</code> | [L37](#l37) |
| <code>resourceEvidenceSchema</code> | <code>startLine</code> | <code>z.number().int().positive()</code> | [L38](#l38) |
| <code>resourceEvidenceSchema</code> | <code>endLine</code> | <code>z.number().int().positive()</code> | [L38](#l38) |
| <code>resourceEvidenceSchema</code> | <code>excerpt</code> | <code>z.string().min(1).max(8000)</code> | [L38](#l38) |

## Compile-time data contracts

### ResourceDefinition

```typescript
type ResourceDefinition=z.infer<typeof resourceDefinitionSchema>;
```

Declared at [L24](#l24). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### ResourceRecord

```typescript
type ResourceRecord=z.infer<typeof resourceRecordSchema>;
```

Declared at [L31](#l31). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>pathSchema</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(path=&gt;!/[\\:\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Use a relative slash-separated file path inside the repository.')</code>.
- [L6](#l6) <code>resourceDefinitionSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), path:pathSchema, rootId:rootIdSchema.optional(), url:referenceUrlSchema.optional(), kind:z.enum(['document','openapi','schema','source']).default('document'), authority:z.enum(['authoritative'…</code>.
- [L25](#l25) <code>resourceRecordSchema</code>: call the named operation with the supplied arguments: <code>resourceDefinitionSchema.safeExtend({ status:z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit', 'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch','access-denied','remote-failed']…</code>.
- [L32](#l32) <code>referencesSchema</code>: call the named operation with the supplied arguments: <code>z.object({ state:z.enum(['ready','incomplete']), evaluation:z.literal('not-assessed'), resources:z.array(resourceRecordSchema), })</code>.
- [L37](#l37) <code>resourceEvidenceSchema</code>: call the named operation with the supplied arguments: <code>z.object({resourceId:z.string().min(1),snapshotSha256:z.string().regex(/^[a-f0-9]{64}$/), startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerpt:z.string().min(1).max(8000)}).strict()</code>.

## Directly importing tests

- [external-references.test.ts](../../test/external-references.test.ts)
- [openapi-contract.test.ts](../../test/openapi-contract.test.ts)

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
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>

```text
   1 | import {z} from 'zod';
   2 | import {rootIdSchema,referenceUrlSchema} from './reference-access.js';
   3 | 
   4 | const pathSchema=z.string().min(1).max(512).refine(path=>!/[\\:\u0000-\u001f]/.test(path)
   5 |   && path.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Use a relative slash-separated file path inside the repository.');
   6 | export const resourceDefinitionSchema=z.object({
   7 |   id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
   8 |   path:pathSchema,
   9 |   rootId:rootIdSchema.optional(),
  10 |   url:referenceUrlSchema.optional(),
  11 |   kind:z.enum(['document','openapi','schema','source']).default('document'),
  12 |   authority:z.enum(['authoritative','supporting']).default('supporting'),
  13 |   version:z.string().min(1).max(128).optional(),
  14 |   expectedSha256:z.string().regex(/^[a-f0-9]{64}$/).optional(),
  15 |   required:z.boolean().default(true),
  16 |   appliesTo:z.array(z.string()).min(1).default(['**']),
  17 | }).strict().superRefine((value,ctx)=>{
  18 |   if(value.rootId && value.url)ctx.addIssue({code:'custom',message:'Choose rootId or url, not both.'});
  19 |   if(value.url && !value.expectedSha256)ctx.addIssue({code:'custom',message:'HTTPS references require expectedSha256.'});
  20 |   // Records already contain the virtual prefix; definitions contain the source path.
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l37"></a>
<a id="l38"></a>

```text
  21 |   const citationPath='origin' in value ? value.path : `@references/${value.id}/${value.path}`;
  22 |   if((value.rootId || value.url) && citationPath.length>512)ctx.addIssue({code:'custom',message:'External citation path exceeds 512 characters.'});
  23 | });
  24 | export type ResourceDefinition=z.infer<typeof resourceDefinitionSchema>;
  25 | export const resourceRecordSchema=resourceDefinitionSchema.safeExtend({
  26 |   status:z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit',
  27 |     'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch','access-denied','remote-failed']),
  28 |   origin:z.object({kind:z.enum(['external-root','https']),path:z.string(),rootId:z.string().optional(),rootSha256:z.string().optional(),url:z.string().optional()}).optional(),
  29 |   sha256:z.string().nullable(),bytes:z.number().int().nonnegative(),lines:z.number().int().nonnegative(),
  30 | });
  31 | export type ResourceRecord=z.infer<typeof resourceRecordSchema>;
  32 | export const referencesSchema=z.object({
  33 |   state:z.enum(['ready','incomplete']),
  34 |   evaluation:z.literal('not-assessed'),
  35 |   resources:z.array(resourceRecordSchema),
  36 | });
  37 | export const resourceEvidenceSchema=z.object({resourceId:z.string().min(1),snapshotSha256:z.string().regex(/^[a-f0-9]{64}$/),
  38 |   startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerpt:z.string().min(1).max(8000)}).strict();
  39 | 
```
