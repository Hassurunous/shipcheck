# src/filesystem-policy.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

validateRoot uses lstat to reject a linked final target, then realpath to canonicalize ancestors. readBoundedConfig distinguishes absence from read failure, checks type/size, and reads into a limit-plus-one buffer so growth after stat cannot bypass the cap. A finally block closes the file even if decoding or a guard fails. These checks assume a stable local tree.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `d39ad3d70e6edb02c8e9e37faa9a1a387acad152242849dcfcc7650b089b899c`.

This chapter inventories **2 function bodies/callbacks**, **9 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>resolve</code>.

## Module execution

- [L4](#l4) Bind <code>MAX_FILE_BYTES</code>: compute <code>1024 * 1024</code> with the <code>*</code> operator.

## Function index

- [validateRoot (6:8)](#fn-124)
- [readBoundedConfig (18:8)](#fn-681)

<a id="fn-124"></a>
### validateRoot (6:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L7](#l7) <code>root</code>: call the named operation with the supplied arguments: <code>resolve(target)</code>.
- [L8](#l8) <code>stat</code>: wait for <code>fs.lstat(root)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L7](#l7) Bind <code>root</code>: call the named operation with the supplied arguments: <code>resolve(target)</code>.
- [L8](#l8) Bind <code>stat</code>: wait for <code>fs.lstat(root)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L9](#l9) If <code>!stat.isDirectory() &#124;&#124; stat.isSymbolicLink()</code> is truthy:
  - [L10](#l10) Throw <code>new Error(&#96;Repository target must be a directory, not a file or symlink: ${root}&#96;)</code>; normal execution stops until an enclosing catch handles it.
- [L14](#l14) Return to the caller: resolve the filesystem path to its canonical location: <code>fs.realpath(root)</code>.

<a id="fn-681"></a>
### readBoundedConfig (18:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L19](#l19) <code>stat</code>: leave the value undefined until a later assignment.
- [L27](#l27) <code>handle</code>: wait for <code>fs.open(path, 'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L30](#l30) <code>bytes</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(MAX_FILE_BYTES + 1)</code>.
- [L31](#l31) <code>length</code>: use the literal <code>0</code>.
- [L33](#l33) <code>result</code>: wait for <code>handle.read(bytes, length, bytes.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L38](#l38) <code>content</code>: call the named operation with the supplied arguments: <code>bytes.subarray(0, length)</code>.

Execution:

- [L19](#l19) Bind <code>stat</code>: leave the value undefined until a later assignment.
- [L20](#l20) Run the protected block:
  - [L20](#l20) update <code>stat</code> with <code>await fs.lstat(path)</code> using <code>=</code>; this mutation is visible to later statements.
- [L20](#l20) If it throws, bind <code>error</code>:
  - [L22](#l22) If <code>(error as NodeJS.ErrnoException).code === 'ENOENT'</code> is truthy:
    - [L22](#l22) Return to the caller: evaluate <code>undefined</code>.
  - [L23](#l23) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
- [L25](#l25) If <code>stat.isSymbolicLink() &#124;&#124; !stat.isFile()</code> is truthy:
  - [L25](#l25) Throw <code>new Error('Configuration must be a regular file, not a symlink or directory.')</code>; normal execution stops until an enclosing catch handles it.
- [L26](#l26) If <code>stat.size &gt; MAX_FILE_BYTES</code> is truthy:
  - [L26](#l26) Throw <code>new Error(&#96;Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.&#96;)</code>; normal execution stops until an enclosing catch handles it.
- [L27](#l27) Bind <code>handle</code>: wait for <code>fs.open(path, 'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L28](#l28) Run the protected block:
  - [L29](#l29) If <code>!(await handle.stat()).isFile()</code> is truthy:
    - [L29](#l29) Throw <code>new Error('Configuration is no longer a regular file.')</code>; normal execution stops until an enclosing catch handles it.
  - [L30](#l30) Bind <code>bytes</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(MAX_FILE_BYTES + 1)</code>.
  - [L31](#l31) Bind <code>length</code>: use the literal <code>0</code>.
  - [L32](#l32) Repeat while <code>length &lt; bytes.length</code>:
    - [L33](#l33) Bind <code>result</code>: wait for <code>handle.read(bytes, length, bytes.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L34](#l34) If <code>result.bytesRead === 0</code> is truthy:
      - [L34](#l34) Leave the enclosing loop/switch.
    - [L35](#l35) update <code>length</code> with <code>result.bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L37](#l37) If <code>length &gt; MAX_FILE_BYTES</code> is truthy:
    - [L37](#l37) Throw <code>new Error(&#96;Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.&#96;)</code>; normal execution stops until an enclosing catch handles it.
  - [L38](#l38) Bind <code>content</code>: call the named operation with the supplied arguments: <code>bytes.subarray(0, length)</code>.
  - [L39](#l39) If <code>content.includes(0)</code> is truthy:
    - [L39](#l39) Throw <code>new Error('Configuration must be UTF-8 text.')</code>; normal execution stops until an enclosing catch handles it.
  - [L40](#l40) Return to the caller: call the named operation with the supplied arguments: <code>new TextDecoder('utf-8', {fatal: true}).decode(content)</code>.
- [L28](#l28) Always run cleanup on leaving the try/catch, including return or throw:
  - [L41](#l41) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

## Module bindings

- [L4](#l4) <code>MAX_FILE_BYTES</code>: compute <code>1024 * 1024</code> with the <code>*</code> operator.

## Directly importing tests

- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)

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
<a id="l10"></a>
<a id="l14"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import fs from 'node:fs/promises';
   2 | import { resolve } from 'node:path';
   3 | 
   4 | export const MAX_FILE_BYTES = 1024 * 1024;
   5 | 
   6 | export async function validateRoot(target: string): Promise<string> {
   7 |   const root = resolve(target);
   8 |   const stat = await fs.lstat(root);
   9 |   if (!stat.isDirectory() || stat.isSymbolicLink()) {
  10 |     throw new Error(`Repository target must be a directory, not a file or symlink: ${root}`);
  11 |   }
  12 |   // Ancestor aliases are allowed, but all subsequent inspection uses one
  13 |   // canonical root. The explicitly selected final directory cannot be a link.
  14 |   return fs.realpath(root);
  15 | }
  16 | 
  17 | /** For stable local trees; not a defense against concurrent path replacement. */
  18 | export async function readBoundedConfig(path: string): Promise<string | undefined> {
  19 |   let stat;
  20 |   try { stat = await fs.lstat(path); }
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   catch (error) {
  22 |     if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
  23 |     throw error;
  24 |   }
  25 |   if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Configuration must be a regular file, not a symlink or directory.');
  26 |   if (stat.size > MAX_FILE_BYTES) throw new Error(`Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
  27 |   const handle = await fs.open(path, 'r');
  28 |   try {
  29 |     if (!(await handle.stat()).isFile()) throw new Error('Configuration is no longer a regular file.');
  30 |     const bytes = Buffer.alloc(MAX_FILE_BYTES + 1);
  31 |     let length = 0;
  32 |     while (length < bytes.length) {
  33 |       const result = await handle.read(bytes, length, bytes.length - length, null);
  34 |       if (result.bytesRead === 0) break;
  35 |       length += result.bytesRead;
  36 |     }
  37 |     if (length > MAX_FILE_BYTES) throw new Error(`Configuration exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
  38 |     const content = bytes.subarray(0, length);
  39 |     if (content.includes(0)) throw new Error('Configuration must be UTF-8 text.');
  40 |     return new TextDecoder('utf-8', {fatal: true}).decode(content);
```

<a id="l41"></a>

```text
  41 |   } finally { await handle.close(); }
  42 | }
  43 | 
```
