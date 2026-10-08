# src/ai/local-imports.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

localImports uses a deliberately narrow lexical regex for relative import/export hints and deduplicates/sorts them. resolveLocalImport normalizes the importer-relative path, rejects escapes and tries a fixed list of source/index extensions against inventory. It returns the first available candidate; this context helper is distinct from the architecture resolver that reports ambiguous multiple matches.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `045737d1ed47fde20cb8124707e762a8a9f091721bb952927cbb5d5df03b1679`.

This chapter inventories **4 function bodies/callbacks**, **6 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>posix</code>.

## Module execution


## Function index

- [localImports (4:8)](#fn-122)
- [resolveLocalImport (10:8)](#fn-420)
- [['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map callback (16:113)](#fn-1021)
- [candidates.find callback (17:26)](#fn-1063)

<a id="fn-122"></a>
### localImports (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>content:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L5](#l5) <code>imports</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L6](#l6) <code>pattern</code>: use the literal <code>/(?:^&#124;\n)\s*(?:import&#124;export)\s+(?:[^;\n]*?\s+from\s*)?["'](\.[^"'\r\n]+)["']/g</code>.
- [L7](#l7) <code>match</code>: receive the next iterable value from <code>content.matchAll(pattern)</code> at the start of each loop iteration.

Execution:

- [L5](#l5) Bind <code>imports</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L6](#l6) Bind <code>pattern</code>: use the literal <code>/(?:^&#124;\n)\s*(?:import&#124;export)\s+(?:[^;\n]*?\s+from\s*)?["'](\.[^"'\r\n]+)["']/g</code>.
- [L7](#l7) Iterate <code>content.matchAll(pattern)</code> values, binding <code>const match</code> for each iteration:
  - [L7](#l7) insert a unique value in the Set: <code>imports.add(match[1]!)</code>.
- [L8](#l8) Return to the caller: sort the receiver array in place using the comparator: <code>[...imports].sort()</code>.

<a id="fn-420"></a>
### resolveLocalImport (10:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>from:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>specifier:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>inventory:ReadonlySet&lt;string&gt;</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>path</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(from),specifier))</code>.
- [L14](#l14) <code>stem</code>: produce a string with matching text replaced: <code>path.replace(/\.(?:mjs&#124;cjs&#124;js&#124;jsx)$/,'')</code>.
- [L15](#l15) <code>candidates</code>: create an array from <code>[path,...(stem!==path ? [stem+'.ts',stem+'.tsx',stem+'.mts',stem+'.cts'] : []), ...(!posix.extname(path)?['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map(s=&gt;path+s):[])]</code>; spread elements insert the iterable values.

Execution:

- [L11](#l11) If <code>/[\\:\u0000-\u001f]/.test(specifier)</code> is truthy:
  - [L11](#l11) Return to the caller: evaluate <code>undefined</code>.
- [L12](#l12) Bind <code>path</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(from),specifier))</code>.
- [L13](#l13) If <code>path==='..' &#124;&#124; path.startsWith('../') &#124;&#124; posix.isAbsolute(path)</code> is truthy:
  - [L13](#l13) Return to the caller: evaluate <code>undefined</code>.
- [L14](#l14) Bind <code>stem</code>: produce a string with matching text replaced: <code>path.replace(/\.(?:mjs&#124;cjs&#124;js&#124;jsx)$/,'')</code>.
- [L15](#l15) Bind <code>candidates</code>: create an array from <code>[path,...(stem!==path ? [stem+'.ts',stem+'.tsx',stem+'.mts',stem+'.cts'] : []), ...(!posix.extname(path)?['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map(s=&gt;path+s):[])]</code>; spread elements insert the iterable values.
- [L17](#l17) Return to the caller: return the first matching element, or undefined: <code>candidates.find(candidate=&gt;inventory.has(candidate))</code>.

<a id="fn-1021"></a>
### ['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map callback (16:113)

Synchronous function. Lexically inside [resolveLocalImport (10:8)](#fn-420). Passed to <code>['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: compute <code>path+s</code> with the <code>+</code> operator.

<a id="fn-1063"></a>
### candidates.find callback (17:26)

Synchronous function. Lexically inside [resolveLocalImport (10:8)](#fn-420). Passed to <code>candidates.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: test membership without changing the collection: <code>inventory.has(candidate)</code>.

## Directly importing tests

- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>

```text
   1 | import { posix } from 'node:path';
   2 | 
   3 | /** Conservative lexical hints, not a JS parser or general module resolver. */
   4 | export function localImports(content:string): string[] {
   5 |   const imports = new Set<string>();
   6 |   const pattern = /(?:^|\n)\s*(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?["'](\.[^"'\r\n]+)["']/g;
   7 |   for (const match of content.matchAll(pattern)) imports.add(match[1]!);
   8 |   return [...imports].sort();
   9 | }
  10 | export function resolveLocalImport(from:string, specifier:string, inventory:ReadonlySet<string>):string | undefined {
  11 |   if (/[\\:\u0000-\u001f]/.test(specifier)) return undefined;
  12 |   const path=posix.normalize(posix.join(posix.dirname(from),specifier));
  13 |   if (path==='..' || path.startsWith('../') || posix.isAbsolute(path)) return undefined;
  14 |   const stem=path.replace(/\.(?:mjs|cjs|js|jsx)$/,'');
  15 |   const candidates=[path,...(stem!==path ? [stem+'.ts',stem+'.tsx',stem+'.mts',stem+'.cts'] : []),
  16 |     ...(!posix.extname(path)?['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map(s=>path+s):[])];
  17 |   return candidates.find(candidate=>inventory.has(candidate));
  18 | }
  19 | 
```
