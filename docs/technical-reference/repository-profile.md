# src/repository-profile.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The profile schema is the contract between filesystem inspection and pure rules. Defaults on newer fields preserve older serialized profiles without inventing facts. Files and directory names, manifest scripts, marker excerpts, typed package issues and existence observations are separate because each supports a different kind of conclusion. Most path fields here are nonempty strings, not the stronger safe-path schema used at external input boundaries.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `21a58301fad40bb3bc556f408002d6b364a137382c1aef2133eb52bf8c104b8a`.

This chapter inventories **0 function bodies/callbacks**, **3 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./ignore-contracts.js</code>: <code>ignorePolicySchema</code>.
- <code>zod</code>: <code>z</code>.

## Module execution

- [L4](#l4) Bind <code>relativePath</code>: call the named operation with the supplied arguments: <code>z.string().min(1)</code>.
- [L6](#l6) Bind <code>packageIssueSchema</code>: call the named operation with the supplied arguments: <code>z.object({ path: relativePath, code: z.enum(["invalid-json", "invalid-package", "invalid-scripts"]), observation: z.string().min(1), })</code>.
- [L12](#l12) Bind <code>repositoryProfileSchema</code>: call the named operation with the supplied arguments: <code>z.object({ root: z.string().min(1), ignorePolicy:ignorePolicySchema.optional(), directories: z.array(relativePath).default([]), excluded: z.array(z.string()).default([]), packageReferences: z.array(z.object({ path: relativePath, field: z.string(), target: z…</code>.

## Function index


## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>packageIssueSchema</code> | <code>path</code> | <code>relativePath</code> | [L7](#l7) |
| <code>packageIssueSchema</code> | <code>code</code> | <code>z.enum(["invalid-json", "invalid-package", "invalid-scripts"])</code> | [L8](#l8) |
| <code>packageIssueSchema</code> | <code>observation</code> | <code>z.string().min(1)</code> | [L9](#l9) |
| <code>repositoryProfileSchema</code> | <code>root</code> | <code>z.string().min(1)</code> | [L13](#l13) |
| <code>repositoryProfileSchema</code> | <code>ignorePolicy</code> | <code>ignorePolicySchema.optional()</code> | [L14](#l14) |
| <code>repositoryProfileSchema</code> | <code>directories</code> | <code>z.array(relativePath).default([])</code> | [L15](#l15) |
| <code>repositoryProfileSchema</code> | <code>excluded</code> | <code>z.array(z.string()).default([])</code> | [L16](#l16) |
| <code>repositoryProfileSchema</code> | <code>packageReferences</code> | <code>z.array(z.object({ path: relativePath, field: z.string(), target: z.string(), kind: z.enum(["dependency", "script", "entry"]), existence: z.enum(["exists", "missing", "unknown"]).optional(), })).default([])</code> | [L17](#l17) |
| <code>repositoryProfileSchema</code> | <code>packageReferences.path</code> | <code>relativePath</code> | [L18](#l18) |
| <code>repositoryProfileSchema</code> | <code>packageReferences.field</code> | <code>z.string()</code> | [L18](#l18) |
| <code>repositoryProfileSchema</code> | <code>packageReferences.target</code> | <code>z.string()</code> | [L18](#l18) |
| <code>repositoryProfileSchema</code> | <code>packageReferences.kind</code> | <code>z.enum(["dependency", "script", "entry"])</code> | [L19](#l19) |
| <code>repositoryProfileSchema</code> | <code>packageReferences.existence</code> | <code>z.enum(["exists", "missing", "unknown"]).optional()</code> | [L20](#l20) |
| <code>repositoryProfileSchema</code> | <code>files</code> | <code>z.array(z.object({ path: relativePath, language: z.string().nullable(), }))</code> | [L22](#l22) |
| <code>repositoryProfileSchema</code> | <code>files.path</code> | <code>relativePath</code> | [L23](#l23) |
| <code>repositoryProfileSchema</code> | <code>files.language</code> | <code>z.string().nullable()</code> | [L24](#l24) |
| <code>repositoryProfileSchema</code> | <code>languages</code> | <code>z.record(z.string(), z.number().int().nonnegative())</code> | [L26](#l26) |
| <code>repositoryProfileSchema</code> | <code>manifests</code> | <code>z.array(z.object({ path: relativePath, ecosystem: z.string() }))</code> | [L27](#l27) |
| <code>repositoryProfileSchema</code> | <code>manifests.path</code> | <code>relativePath</code> | [L27](#l27) |
| <code>repositoryProfileSchema</code> | <code>manifests.ecosystem</code> | <code>z.string()</code> | [L27](#l27) |
| <code>repositoryProfileSchema</code> | <code>readmes</code> | <code>z.array(relativePath)</code> | [L28](#l28) |
| <code>repositoryProfileSchema</code> | <code>tests</code> | <code>z.array(relativePath)</code> | [L29](#l29) |
| <code>repositoryProfileSchema</code> | <code>packageScripts</code> | <code>z.array(z.object({ path: relativePath, scripts: z.record(z.string(), z.string()), }))</code> | [L30](#l30) |
| <code>repositoryProfileSchema</code> | <code>packageScripts.path</code> | <code>relativePath</code> | [L31](#l31) |
| <code>repositoryProfileSchema</code> | <code>packageScripts.scripts</code> | <code>z.record(z.string(), z.string())</code> | [L32](#l32) |
| <code>repositoryProfileSchema</code> | <code>packageIssues</code> | <code>z.array(packageIssueSchema).default([])</code> | [L35](#l35) |
| <code>repositoryProfileSchema</code> | <code>markers</code> | <code>z.array(z.object({ path: relativePath, line: z.number().int().positive(), kind: z.enum(["TODO", "FIXME"]), excerpt: z.string(), }))</code> | [L36](#l36) |
| <code>repositoryProfileSchema</code> | <code>markers.path</code> | <code>relativePath</code> | [L37](#l37) |
| <code>repositoryProfileSchema</code> | <code>markers.line</code> | <code>z.number().int().positive()</code> | [L38](#l38) |
| <code>repositoryProfileSchema</code> | <code>markers.kind</code> | <code>z.enum(["TODO", "FIXME"])</code> | [L39](#l39) |
| <code>repositoryProfileSchema</code> | <code>markers.excerpt</code> | <code>z.string()</code> | [L40](#l40) |
| <code>repositoryProfileSchema</code> | <code>warnings</code> | <code>z.array(z.object({ path: relativePath, code: z.enum([ "unreadable-directory", "unreadable-file", "invalid-manifest", "file-too-large", "non-text-file", "symlink-skipped", "special-file-skipped", ]), message: z.string(), }))</code> | [L42](#l42) |
| <code>repositoryProfileSchema</code> | <code>warnings.path</code> | <code>relativePath</code> | [L43](#l43) |
| <code>repositoryProfileSchema</code> | <code>warnings.code</code> | <code>z.enum([ "unreadable-directory", "unreadable-file", "invalid-manifest", "file-too-large", "non-text-file", "symlink-skipped", "special-file-skipped", ])</code> | [L44](#l44) |
| <code>repositoryProfileSchema</code> | <code>warnings.message</code> | <code>z.string()</code> | [L48](#l48) |

## Compile-time data contracts

### RepositoryProfile

```typescript
type RepositoryProfile = z.infer<typeof repositoryProfileSchema>;
```

Declared at [L52](#l52). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>relativePath</code>: call the named operation with the supplied arguments: <code>z.string().min(1)</code>.
- [L6](#l6) <code>packageIssueSchema</code>: call the named operation with the supplied arguments: <code>z.object({ path: relativePath, code: z.enum(["invalid-json", "invalid-package", "invalid-scripts"]), observation: z.string().min(1), })</code>.
- [L12](#l12) <code>repositoryProfileSchema</code>: call the named operation with the supplied arguments: <code>z.object({ root: z.string().min(1), ignorePolicy:ignorePolicySchema.optional(), directories: z.array(relativePath).default([]), excluded: z.array(z.string()).default([]), packageReferences: z.array(z.object({ path: relativePath, field: z.string(), target: z…</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

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
   1 | import {ignorePolicySchema} from './ignore-contracts.js';
   2 | import { z } from "zod";
   3 | 
   4 | const relativePath = z.string().min(1);
   5 | 
   6 | export const packageIssueSchema = z.object({
   7 |   path: relativePath,
   8 |   code: z.enum(["invalid-json", "invalid-package", "invalid-scripts"]),
   9 |   observation: z.string().min(1),
  10 | });
  11 | 
  12 | export const repositoryProfileSchema = z.object({
  13 |   root: z.string().min(1),
  14 |   ignorePolicy:ignorePolicySchema.optional(),
  15 |   directories: z.array(relativePath).default([]),
  16 |   excluded: z.array(z.string()).default([]),
  17 |   packageReferences: z.array(z.object({
  18 |     path: relativePath, field: z.string(), target: z.string(),
  19 |     kind: z.enum(["dependency", "script", "entry"]),
  20 |     existence: z.enum(["exists", "missing", "unknown"]).optional(),
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   })).default([]),
  22 |   files: z.array(z.object({
  23 |     path: relativePath,
  24 |     language: z.string().nullable(),
  25 |   })),
  26 |   languages: z.record(z.string(), z.number().int().nonnegative()),
  27 |   manifests: z.array(z.object({ path: relativePath, ecosystem: z.string() })),
  28 |   readmes: z.array(relativePath),
  29 |   tests: z.array(relativePath),
  30 |   packageScripts: z.array(z.object({
  31 |     path: relativePath,
  32 |     scripts: z.record(z.string(), z.string()),
  33 |   })),
  34 |   // Default keeps profiles produced before P2 readable, without inferring missing diagnostics.
  35 |   packageIssues: z.array(packageIssueSchema).default([]),
  36 |   markers: z.array(z.object({
  37 |     path: relativePath,
  38 |     line: z.number().int().positive(),
  39 |     kind: z.enum(["TODO", "FIXME"]),
  40 |     excerpt: z.string(),
```

<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l48"></a>
<a id="l52"></a>

```text
  41 |   })),
  42 |   warnings: z.array(z.object({
  43 |     path: relativePath,
  44 |     code: z.enum([
  45 |       "unreadable-directory", "unreadable-file", "invalid-manifest",
  46 |       "file-too-large", "non-text-file", "symlink-skipped", "special-file-skipped",
  47 |     ]),
  48 |     message: z.string(),
  49 |   })),
  50 | });
  51 | 
  52 | export type RepositoryProfile = z.infer<typeof repositoryProfileSchema>;
  53 | 
```
