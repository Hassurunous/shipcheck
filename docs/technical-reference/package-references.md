# src/package-references.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

packageReferences decodes JSON independently and extracts only declared literal local targets. It collects file: dependency paths, narrowly matched node/tsx script commands, and entry fields/bin mappings. It deliberately does not interpret shell syntax, resolve dependencies, or execute scripts; malformed JSON yields no references because inspectPackage owns that diagnosis.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `f1a5f90ac54818155def8a486b9333cd249f2d41b43da03a7fc3417a27b4dec8`.

This chapter inventories **1 function bodies/callbacks**, **11 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./repository-profile.js</code>: <code>RepositoryProfile</code> (type only).

## Module execution


## Function index

- [packageReferences (4:8)](#fn-146)

<a id="fn-146"></a>
### packageReferences (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>content: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L5](#l5) <code>value: unknown</code>: leave the value undefined until a later assignment.
- [L8](#l8) <code>data</code>: evaluate <code>value</code>; the TypeScript assertion adds no runtime validation.
- [L9](#l9) <code>references: RepositoryProfile["packageReferences"]</code>: create a new empty array to accumulate ordered results.
- [L10](#l10) <code>field</code>: receive the next iterable value from <code>["dependencies", "devDependencies", "optionalDependencies"]</code> at the start of each loop iteration.
- [L11](#l11) <code>entries</code>: read <code>data[field]</code>.
- [L13](#l13) <code>[name, target]</code>: receive the next iterable value from <code>Object.entries(entries)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L19](#l19) <code>scripts</code>: read <code>data.scripts</code>.
- [L21](#l21) <code>[name, command]</code>: receive the next iterable value from <code>Object.entries(scripts)</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L23](#l23) <code>match</code>: call the named operation with the supplied arguments: <code>/^(?:node&#124;tsx)\s+([a-zA-Z0-9_./-]+\.(?:[cm]?js&#124;[cm]?ts))\s*$/.exec(command)</code>.
- [L27](#l27) <code>field</code>: receive the next iterable value from <code>["main", "module", "types", "typings"]</code> at the start of each loop iteration.
- [L32](#l32) <code>[name, target]</code>: receive the next iterable value from <code>Object.entries(data.bin)</code> at the start of each loop iteration; destructure that value into the displayed names.

Execution:

- [L5](#l5) Bind <code>value: unknown</code>: leave the value undefined until a later assignment.
- [L6](#l6) Run the protected block:
  - [L6](#l6) update <code>value</code> with <code>JSON.parse(content)</code> using <code>=</code>; this mutation is visible to later statements.
- [L6](#l6) If it throws:
  - [L6](#l6) Return to the caller: create a new empty array to accumulate ordered results.
- [L7](#l7) If <code>!value &#124;&#124; typeof value !== "object" &#124;&#124; Array.isArray(value)</code> is truthy:
  - [L7](#l7) Return to the caller: create a new empty array to accumulate ordered results.
- [L8](#l8) Bind <code>data</code>: evaluate <code>value</code>; the TypeScript assertion adds no runtime validation.
- [L9](#l9) Bind <code>references: RepositoryProfile["packageReferences"]</code>: create a new empty array to accumulate ordered results.
- [L10](#l10) Iterate <code>["dependencies", "devDependencies", "optionalDependencies"]</code> values, binding <code>const field</code> for each iteration:
  - [L11](#l11) Bind <code>entries</code>: read <code>data[field]</code>.
  - [L12](#l12) If <code>!entries &#124;&#124; typeof entries !== "object" &#124;&#124; Array.isArray(entries)</code> is truthy:
    - [L12](#l12) Skip the rest of this iteration and advance the enclosing loop.
  - [L13](#l13) Iterate <code>Object.entries(entries)</code> values, binding <code>const [name, target]</code> for each iteration:
    - [L14](#l14) If <code>typeof target === "string" &amp;&amp; target.startsWith("file:") &amp;&amp; target.length &gt; 5</code> is truthy:
      - [L15](#l15) append values to the existing array: <code>references.push({ path, field: &#96;${field}.${name}&#96;, target: target.slice(5), kind: "dependency" })</code>.
- [L19](#l19) Bind <code>scripts</code>: read <code>data.scripts</code>.
- [L20](#l20) If <code>scripts &amp;&amp; typeof scripts === "object" &amp;&amp; !Array.isArray(scripts)</code> is truthy:
  - [L21](#l21) Iterate <code>Object.entries(scripts)</code> values, binding <code>const [name, command]</code> for each iteration:
    - [L22](#l22) If <code>typeof command !== "string"</code> is truthy:
      - [L22](#l22) Skip the rest of this iteration and advance the enclosing loop.
    - [L23](#l23) Bind <code>match</code>: call the named operation with the supplied arguments: <code>/^(?:node&#124;tsx)\s+([a-zA-Z0-9_./-]+\.(?:[cm]?js&#124;[cm]?ts))\s*$/.exec(command)</code>.
    - [L24](#l24) If <code>match</code> is truthy:
      - [L24](#l24) append values to the existing array: <code>references.push({ path, field: &#96;scripts.${name}&#96;, target: match[1]!, kind: "script" })</code>.
- [L27](#l27) Iterate <code>["main", "module", "types", "typings"]</code> values, binding <code>const field</code> for each iteration:
  - [L28](#l28) If <code>typeof data[field] === "string"</code> is truthy:
    - [L28](#l28) append values to the existing array: <code>references.push({ path, field, target: data[field], kind: "entry" })</code>.
- [L30](#l30) If <code>typeof data.bin === "string"</code> is truthy:
  - [L30](#l30) append values to the existing array: <code>references.push({ path, field: "bin", target: data.bin, kind: "entry" })</code>.
- [L30](#l30) Otherwise:
  - [L31](#l31) If <code>data.bin &amp;&amp; typeof data.bin === "object" &amp;&amp; !Array.isArray(data.bin)</code> is truthy:
    - [L32](#l32) Iterate <code>Object.entries(data.bin)</code> values, binding <code>const [name, target]</code> for each iteration:
      - [L33](#l33) If <code>typeof target === "string"</code> is truthy:
        - [L33](#l33) append values to the existing array: <code>references.push({ path, field: &#96;bin.${name}&#96;, target, kind: "entry" })</code>.
- [L36](#l36) Return to the caller: evaluate <code>references</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
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
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import type { RepositoryProfile } from "./repository-profile.js";
   2 | 
   3 | /** Only recognize literal targets, never interpret a shell command. */
   4 | export function packageReferences(path: string, content: string): RepositoryProfile["packageReferences"] {
   5 |   let value: unknown;
   6 |   try { value = JSON.parse(content); } catch { return []; }
   7 |   if (!value || typeof value !== "object" || Array.isArray(value)) return [];
   8 |   const data = value as Record<string, unknown>;
   9 |   const references: RepositoryProfile["packageReferences"] = [];
  10 |   for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
  11 |     const entries = data[field];
  12 |     if (!entries || typeof entries !== "object" || Array.isArray(entries)) continue;
  13 |     for (const [name, target] of Object.entries(entries)) {
  14 |       if (typeof target === "string" && target.startsWith("file:") && target.length > 5) {
  15 |         references.push({ path, field: `${field}.${name}`, target: target.slice(5), kind: "dependency" });
  16 |       }
  17 |     }
  18 |   }
  19 |   const scripts = data.scripts;
  20 |   if (scripts && typeof scripts === "object" && !Array.isArray(scripts)) {
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l36"></a>

```text
  21 |     for (const [name, command] of Object.entries(scripts)) {
  22 |       if (typeof command !== "string") continue;
  23 |       const match = /^(?:node|tsx)\s+([a-zA-Z0-9_./-]+\.(?:[cm]?js|[cm]?ts))\s*$/.exec(command);
  24 |       if (match) references.push({ path, field: `scripts.${name}`, target: match[1]!, kind: "script" });
  25 |     }
  26 |   }
  27 |   for (const field of ["main", "module", "types", "typings"]) {
  28 |     if (typeof data[field] === "string") references.push({ path, field, target: data[field], kind: "entry" });
  29 |   }
  30 |   if (typeof data.bin === "string") references.push({ path, field: "bin", target: data.bin, kind: "entry" });
  31 |   else if (data.bin && typeof data.bin === "object" && !Array.isArray(data.bin)) {
  32 |     for (const [name, target] of Object.entries(data.bin)) {
  33 |       if (typeof target === "string") references.push({ path, field: `bin.${name}`, target, kind: "entry" });
  34 |     }
  35 |   }
  36 |   return references;
  37 | }
  38 | 
```
