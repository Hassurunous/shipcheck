# src/ignore-contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

This schema records how files were excluded: mode, enabled inheritance, explicit patterns, fixed exclusions, hashed .gitignore sources, a bounded sample and its total count. It makes a narrowed inventory explainable without pretending the skipped subtree's individual files were counted.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `e173d248087f676c8e140ad669e4a3314f509f579ca6a948aec9e8469d088bce`.

This chapter inventories **0 function bodies/callbacks**, **1 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.

## Module execution

- [L2](#l2) Bind <code>ignorePolicySchema</code>: call the named operation with the supplied arguments: <code>z.object({ mode:z.enum(['gitignore','shipcheck','combined','built-in']), respectGitignore:z.boolean(),exclude:z.array(z.string()), builtIn:z.array(z.string()),gitSettings:z.literal('repository-gitignore-only'), sources:z.array(z.object({path:z.string(),sha2…</code>.

## Function index


## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>ignorePolicySchema</code> | <code>mode</code> | <code>z.enum(['gitignore','shipcheck','combined','built-in'])</code> | [L3](#l3) |
| <code>ignorePolicySchema</code> | <code>respectGitignore</code> | <code>z.boolean()</code> | [L4](#l4) |
| <code>ignorePolicySchema</code> | <code>exclude</code> | <code>z.array(z.string())</code> | [L4](#l4) |
| <code>ignorePolicySchema</code> | <code>builtIn</code> | <code>z.array(z.string())</code> | [L5](#l5) |
| <code>ignorePolicySchema</code> | <code>gitSettings</code> | <code>z.literal('repository-gitignore-only')</code> | [L5](#l5) |
| <code>ignorePolicySchema</code> | <code>sources</code> | <code>z.array(z.object({path:z.string(),sha256:z.string()}))</code> | [L6](#l6) |
| <code>ignorePolicySchema</code> | <code>sources.path</code> | <code>z.string()</code> | [L6](#l6) |
| <code>ignorePolicySchema</code> | <code>sources.sha256</code> | <code>z.string()</code> | [L6](#l6) |
| <code>ignorePolicySchema</code> | <code>skipped</code> | <code>z.array(z.object({path:z.string(),kind:z.enum(['file','directory','other']),reason:z.enum(['built-in','shipcheck','gitignore']),source:z.string().optional(),pattern:z.string().optional()}))</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skipped.path</code> | <code>z.string()</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skipped.kind</code> | <code>z.enum(['file','directory','other'])</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skipped.reason</code> | <code>z.enum(['built-in','shipcheck','gitignore'])</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skipped.source</code> | <code>z.string().optional()</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skipped.pattern</code> | <code>z.string().optional()</code> | [L7](#l7) |
| <code>ignorePolicySchema</code> | <code>skippedCount</code> | <code>z.number().int().nonnegative()</code> | [L8](#l8) |
| <code>ignorePolicySchema</code> | <code>skippedTruncated</code> | <code>z.boolean()</code> | [L8](#l8) |

## Compile-time data contracts

### IgnorePolicyReport

```typescript
type IgnorePolicyReport=z.infer<typeof ignorePolicySchema>;
```

Declared at [L10](#l10). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L2](#l2) <code>ignorePolicySchema</code>: call the named operation with the supplied arguments: <code>z.object({ mode:z.enum(['gitignore','shipcheck','combined','built-in']), respectGitignore:z.boolean(),exclude:z.array(z.string()), builtIn:z.array(z.string()),gitSettings:z.literal('repository-gitignore-only'), sources:z.array(z.object({path:z.string(),sha2…</code>.

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
<a id="l10"></a>

```text
   1 | import {z} from 'zod';
   2 | export const ignorePolicySchema=z.object({
   3 |   mode:z.enum(['gitignore','shipcheck','combined','built-in']),
   4 |   respectGitignore:z.boolean(),exclude:z.array(z.string()),
   5 |   builtIn:z.array(z.string()),gitSettings:z.literal('repository-gitignore-only'),
   6 |   sources:z.array(z.object({path:z.string(),sha256:z.string()})),
   7 |   skipped:z.array(z.object({path:z.string(),kind:z.enum(['file','directory','other']),reason:z.enum(['built-in','shipcheck','gitignore']),source:z.string().optional(),pattern:z.string().optional()})),
   8 |   skippedCount:z.number().int().nonnegative(),skippedTruncated:z.boolean(),
   9 | });
  10 | export type IgnorePolicyReport=z.infer<typeof ignorePolicySchema>;
  11 | 
```
