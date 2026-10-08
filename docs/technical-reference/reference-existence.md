# src/reference-existence.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

referenceExistence returns exists, missing or unknown rather than treating every absent inventory entry as missing. It normalizes a manifest-relative target, rejects unsupported shapes, checks every path component with lstat and canonical casing, and consults exclusions again. Only an ENOENT that is not ignored establishes missing; links, special files and other failures remain unknown.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `1beaf2729614a1c620179a30f4ed4a36bcd2972f11b3f4212e28ac6844338296`.

This chapter inventories **2 function bodies/callbacks**, **7 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./ignore-policy.js</code>: <code>IgnorePolicy</code> (type only).
- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>join</code>, <code>posix</code>, <code>relative</code>.
- <code>./config.js</code>: <code>isExcluded</code>.
- <code>./repository-profile.js</code>: <code>RepositoryProfile</code> (type only).

## Module execution


## Function index

- [referenceExistence (10:8)](#fn-412)
- [actual.split('/').some callback (28:35)](#fn-1716)

<a id="fn-412"></a>
### referenceExistence (10:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>reference: Reference</code>: supplied by the caller; usage is shown in the steps below.
- <code>excluded: string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>policy?:IgnorePolicy</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>target</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(reference.path), reference.target))</code>.
- [L16](#l16) <code>current</code>: evaluate <code>root</code>.
- [L17](#l17) <code>parts</code>: divide the string using the delimiter or regular expression: <code>target.split('/')</code>.
- [L18](#l18) <code>index</code>: use the literal <code>0</code>.
- [L19](#l19) <code>part</code>: read <code>parts[index]</code>; the TypeScript assertion adds no runtime validation.
- [L23](#l23) <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L26](#l26) <code>actual</code>: concatenate the elements with the supplied separator: <code>relative(root, await fs.realpath(current)).split('\\').join('/')</code>.

Execution:

- [L11](#l11) If <code>!reference.target &#124;&#124; /[:\\%$*?{}~]/.test(reference.target) &#124;&#124; posix.isAbsolute(reference.target)</code> is truthy:
  - [L11](#l11) Return to the caller: use the literal <code>'unknown'</code>.
- [L12](#l12) Bind <code>target</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(reference.path), reference.target))</code>.
- [L13](#l13) If <code>target === '..' &#124;&#124; target.startsWith('../') &#124;&#124; target === '.'</code> is truthy:
  - [L13](#l13) Return to the caller: use the literal <code>'unknown'</code>.
- [L14](#l14) If <code>isExcluded(target, excluded)</code> is truthy:
  - [L14](#l14) Return to the caller: use the literal <code>'unknown'</code>.
- [L15](#l15) Run the protected block:
  - [L15](#l15) update <code>root</code> with <code>await fs.realpath(root)</code> using <code>=</code>; this mutation is visible to later statements.
- [L15](#l15) If it throws:
  - [L15](#l15) Return to the caller: use the literal <code>'unknown'</code>.
- [L16](#l16) Bind <code>current</code>: evaluate <code>root</code>.
- [L17](#l17) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>target.split('/')</code>.
- [L18](#l18) Initialize <code>let index = 0</code>; repeat while <code>index &lt; parts.length</code>; after each normal iteration evaluate <code>index++</code>:
  - [L19](#l19) Bind <code>part</code>: read <code>parts[index]</code>; the TypeScript assertion adds no runtime validation.
  - [L20](#l20) If <code>part === '.git' &#124;&#124; part === 'node_modules'</code> is truthy:
    - [L20](#l20) Return to the caller: use the literal <code>'unknown'</code>.
  - [L21](#l21) update <code>current</code> with <code>join(current, part)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L22](#l22) Run the protected block:
    - [L23](#l23) Bind <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L24](#l24) If <code>stat.isSymbolicLink() &#124;&#124; (!stat.isFile() &amp;&amp; !stat.isDirectory())</code> is truthy:
      - [L24](#l24) Return to the caller: use the literal <code>'unknown'</code>.
    - [L26](#l26) Bind <code>actual</code>: concatenate the elements with the supplied separator: <code>relative(root, await fs.realpath(current)).split('\\').join('/')</code>.
    - [L27](#l27) If <code>actual.startsWith('../') &#124;&#124; isExcluded(actual, excluded) &#124;&#124; await policy?.reason(actual,stat.isDirectory()) &#124;&#124; actual.split('/').some(p =&gt; p === '.git' &#124;&#124; p === 'node_modules')</code> is truthy:
      - [L28](#l28) Return to the caller: use the literal <code>'unknown'</code>.
    - [L29](#l29) If <code>index &lt; parts.length - 1 &amp;&amp; !stat.isDirectory()</code> is truthy:
      - [L29](#l29) Return to the caller: use the literal <code>'unknown'</code>.
  - [L22](#l22) If it throws, bind <code>error</code>:
    - [L31](#l31) Return to the caller: test <code>(error as NodeJS.ErrnoException).code === 'ENOENT' &amp;&amp; !await policy?.reason(target,true)</code>; choose <code>'missing'</code> when truthy, otherwise <code>'unknown'</code>.
- [L34](#l34) Return to the caller: use the literal <code>'exists'</code>.

<a id="fn-1716"></a>
### actual.split('/').some callback (28:35)

Synchronous function. Lexically inside [referenceExistence (10:8)](#fn-412). Passed to <code>actual.split('/').some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: evaluate <code>p === '.git' &#124;&#124; p === 'node_modules'</code> left to right with truthy short-circuiting.

## Compile-time data contracts

### Reference

```typescript
type Reference = RepositoryProfile['packageReferences'][number];
```

Declared at [L7](#l7). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

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
<a id="l7"></a>
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
   1 | import type {IgnorePolicy} from './ignore-policy.js';
   2 | import fs from 'node:fs/promises';
   3 | import { join, posix, relative } from 'node:path';
   4 | import { isExcluded } from './config.js';
   5 | import type { RepositoryProfile } from './repository-profile.js';
   6 | 
   7 | type Reference = RepositoryProfile['packageReferences'][number];
   8 | 
   9 | /** Capture existence using the filesystem's own case rules, without traversing links. */
  10 | export async function referenceExistence(root: string, reference: Reference, excluded: string[], policy?:IgnorePolicy): Promise<'exists' | 'missing' | 'unknown'> {
  11 |   if (!reference.target || /[:\\%$*?{}~]/.test(reference.target) || posix.isAbsolute(reference.target)) return 'unknown';
  12 |   const target = posix.normalize(posix.join(posix.dirname(reference.path), reference.target));
  13 |   if (target === '..' || target.startsWith('../') || target === '.') return 'unknown';
  14 |   if (isExcluded(target, excluded)) return 'unknown';
  15 |   try { root = await fs.realpath(root); } catch { return 'unknown'; }
  16 |   let current = root;
  17 |   const parts = target.split('/');
  18 |   for (let index = 0; index < parts.length; index++) {
  19 |     const part = parts[index]!;
  20 |     if (part === '.git' || part === 'node_modules') return 'unknown';
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
<a id="l34"></a>

```text
  21 |     current = join(current, part);
  22 |     try {
  23 |       const stat = await fs.lstat(current);
  24 |       if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) return 'unknown';
  25 |       // Canonical casing also prevents exclusions being bypassed by a case alias.
  26 |       const actual = relative(root, await fs.realpath(current)).split('\\').join('/');
  27 |       if (actual.startsWith('../') || isExcluded(actual, excluded) || await policy?.reason(actual,stat.isDirectory())
  28 |         || actual.split('/').some(p => p === '.git' || p === 'node_modules')) return 'unknown';
  29 |       if (index < parts.length - 1 && !stat.isDirectory()) return 'unknown';
  30 |     } catch (error) {
  31 |       return (error as NodeJS.ErrnoException).code === 'ENOENT' && !await policy?.reason(target,true) ? 'missing' : 'unknown';
  32 |     }
  33 |   }
  34 |   return 'exists';
  35 | }
  36 | 
```
