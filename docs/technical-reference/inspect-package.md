# src/inspect-package.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

inspectPackage separates JSON syntax failure, a non-object top-level value, and invalid scripts structure. packageSchema validates only optional string-valued scripts; it is not a complete npm manifest validator. Successful scripts are sorted into a fresh object, ensuring stable output independent of JSON key order.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `92781aeef27bece9ab4bae4b52ba4544b5320b846e4ddac7aad874047072e5c4`.

This chapter inventories **2 function bodies/callbacks**, **4 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./repository-profile.js</code>: <code>RepositoryProfile</code> (type only).

## Module execution

- [L4](#l4) Bind <code>packageSchema</code>: call the named operation with the supplied arguments: <code>z.object({ scripts: z.record(z.string(), z.string()).optional() })</code>.

## Function index

- [inspectPackage (10:8)](#fn-465)
- [Object.entries(parsed.data.scripts ?? {}) .sort callback (25:11)](#fn-1255)

<a id="fn-465"></a>
### inspectPackage (10:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>content: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L11](#l11) <code>value: unknown</code>: leave the value undefined until a later assignment.
- [L20](#l20) <code>parsed</code>: validate without throwing for schema failure, returning success/data or error: <code>packageSchema.safeParse(value)</code>.
- [L24](#l24) <code>scripts</code>: call the named operation with the supplied arguments: <code>Object.fromEntries(Object.entries(parsed.data.scripts ?? {}) .sort(([a], [b]) =&gt; a &lt; b ? -1 : a &gt; b ? 1 : 0))</code>.

Execution:

- [L11](#l11) Bind <code>value: unknown</code>: leave the value undefined until a later assignment.
- [L12](#l12) Run the protected block:
  - [L13](#l13) update <code>value</code> with <code>JSON.parse(content)</code> using <code>=</code>; this mutation is visible to later statements.
- [L12](#l12) If it throws:
  - [L15](#l15) Return to the caller: create an object with 1 property/spread entries: <code>{ issue: { path, code: "invalid-json", observation: "package.json could not be parsed as JSON." } }</code>; later properties overwrite earlier spread values.
- [L17](#l17) If <code>value === null &#124;&#124; typeof value !== "object" &#124;&#124; Array.isArray(value)</code> is truthy:
  - [L18](#l18) Return to the caller: create an object with 1 property/spread entries: <code>{ issue: { path, code: "invalid-package", observation: "package.json contains a top-level value that is not an object." } }</code>; later properties overwrite earlier spread values.
- [L20](#l20) Bind <code>parsed</code>: validate without throwing for schema failure, returning success/data or error: <code>packageSchema.safeParse(value)</code>.
- [L21](#l21) If <code>!parsed.success</code> is truthy:
  - [L22](#l22) Return to the caller: create an object with 1 property/spread entries: <code>{ issue: { path, code: "invalid-scripts", observation: "The scripts field is not an object containing only string values." } }</code>; later properties overwrite earlier spread values.
- [L24](#l24) Bind <code>scripts</code>: call the named operation with the supplied arguments: <code>Object.fromEntries(Object.entries(parsed.data.scripts ?? {}) .sort(([a], [b]) =&gt; a &lt; b ? -1 : a &gt; b ? 1 : 0))</code>.
- [L26](#l26) Return to the caller: create an object with 1 property/spread entries: <code>{ scripts }</code>; later properties overwrite earlier spread values.

<a id="fn-1255"></a>
### Object.entries(parsed.data.scripts ?? {}) .sort callback (25:11)

Synchronous function. Lexically inside [inspectPackage (10:8)](#fn-465). Passed to <code>Object.entries(parsed.data.scripts ?? {}) .sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>[a]</code>: destructure the supplied value into these local bindings.
- <code>[b]</code>: destructure the supplied value into these local bindings.

Execution:

[L25](#l25) Implicitly return: test <code>a &lt; b</code>; choose <code>-1</code> when truthy, otherwise <code>a &gt; b ? 1 : 0</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>packageSchema</code> | <code>scripts</code> | <code>z.record(z.string(), z.string()).optional()</code> | [L4](#l4) |

## Compile-time data contracts

### PackageIssue

```typescript
type PackageIssue = RepositoryProfile["packageIssues"][number];
```

Declared at [L5](#l5). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### PackageInspection

```typescript
type PackageInspection = { scripts: Record<string, string>; issue?: never }
  | { issue: PackageIssue; scripts?: never };
```

Declared at [L6](#l6). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>packageSchema</code>: call the named operation with the supplied arguments: <code>z.object({ scripts: z.record(z.string(), z.string()).optional() })</code>.

## Directly importing tests

- [findings.test.ts](../../test/findings.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l20"></a>

```text
   1 | import { z } from "zod";
   2 | import type { RepositoryProfile } from "./repository-profile.js";
   3 | 
   4 | const packageSchema = z.object({ scripts: z.record(z.string(), z.string()).optional() });
   5 | type PackageIssue = RepositoryProfile["packageIssues"][number];
   6 | type PackageInspection = { scripts: Record<string, string>; issue?: never }
   7 |   | { issue: PackageIssue; scripts?: never };
   8 | 
   9 | /** Validate only JSON, the top-level object, and scripts; not the full npm manifest. */
  10 | export function inspectPackage(path: string, content: string): PackageInspection {
  11 |   let value: unknown;
  12 |   try {
  13 |     value = JSON.parse(content);
  14 |   } catch {
  15 |     return { issue: { path, code: "invalid-json", observation: "package.json could not be parsed as JSON." } };
  16 |   }
  17 |   if (value === null || typeof value !== "object" || Array.isArray(value)) {
  18 |     return { issue: { path, code: "invalid-package", observation: "package.json contains a top-level value that is not an object." } };
  19 |   }
  20 |   const parsed = packageSchema.safeParse(value);
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>

```text
  21 |   if (!parsed.success) {
  22 |     return { issue: { path, code: "invalid-scripts", observation: "The scripts field is not an object containing only string values." } };
  23 |   }
  24 |   const scripts = Object.fromEntries(Object.entries(parsed.data.scripts ?? {})
  25 |     .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  26 |   return { scripts };
  27 | }
  28 | 
```
