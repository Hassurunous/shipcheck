# src/ignore-policy.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

createIgnorePolicy returns three closures sharing configuration, a promise cache, byte accounting and report state. reason checks built-in and Shipcheck exclusions before lazily loading each directory's .gitignore. It evaluates prefixes from the root down, applying scoped ignore/unignore rules, and returns immediately for an ignored parent. record counts pruned entries rather than their unenumerated descendants; describe returns sorted report arrays.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `04e0fa3dfd6d17943168e3fa0f7447d18341d0b7a2993590ebb183db746ed3c5`.

This chapter inventories **10 function bodies/callbacks**, **27 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>join</code>.
- <code>node:crypto</code>: <code>createHash</code>.
- <code>ignore</code>: <code>ignore</code>, <code>Ignore</code> (type only).
- <code>./config.js</code>: <code>isExcluded</code>.
- <code>./ignore-contracts.js</code>: <code>IgnorePolicyReport</code> (type only).

## Module execution

- [L9](#l9) Bind <code>LIMIT</code>: use the literal <code>65536</code>.
- [L9](#l9) Bind <code>MAX_FILES</code>: use the literal <code>256</code>.

## Function index

- [createIgnorePolicy (11:8)](#fn-534)
- [read (16:3)](#fn-1127)
- [reason (41:3)](#fn-2756)
- [path.split('/').some callback (42:62)](#fn-2909)
- [path.split('/').some callback (43:40)](#fn-3044)
- [exclude.find callback (44:81)](#fn-3189)
- [record (66:3)](#fn-4284)
- [describe (70:3)](#fn-4524)
- [[...report.sources].sort callback (71:56)](#fn-4620)
- [[...report.skipped].sort callback (71:116)](#fn-4680)

<a id="fn-534"></a>
### createIgnorePolicy (11:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>options:IgnoreOptions={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>exclude</code>: use <code>options.exclude</code> unless null/undefined, then evaluate <code>[]</code>.
- [L12](#l12) <code>enabled</code>: use <code>options.respectGitignore</code> unless null/undefined, then evaluate <code>options.exclude===undefined</code>.
- [L13](#l13) <code>report:IgnorePolicyReport</code>: create an object with 9 property/spread entries: <code>{mode:enabled?(exclude.length?'combined':'gitignore'):(exclude.length?'shipcheck':'built-in'), respectGitignore:enabled,exclude,builtIn:['.git','node_modules'],gitSettings:'repository-gitignore-only',sources:[],skipped:[],skippedCount:0,skippedTruncated:false}</code>; later properties overwrite earlier spread values.
- [L15](#l15) <code>cache</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L15](#l15) <code>bytesRead</code>: use the literal <code>0</code>.

Execution:

- [L12](#l12) Bind <code>exclude</code>: use <code>options.exclude</code> unless null/undefined, then evaluate <code>[]</code>.
- [L12](#l12) Bind <code>enabled</code>: use <code>options.respectGitignore</code> unless null/undefined, then evaluate <code>options.exclude===undefined</code>.
- [L13](#l13) Bind <code>report:IgnorePolicyReport</code>: create an object with 9 property/spread entries: <code>{mode:enabled?(exclude.length?'combined':'gitignore'):(exclude.length?'shipcheck':'built-in'), respectGitignore:enabled,exclude,builtIn:['.git','node_modules'],gitSettings:'repository-gitignore-only',sources:[],skipped:[],skippedCount:0,skippedTruncated:false}</code>; later properties overwrite earlier spread values.
- [L15](#l15) Bind <code>cache</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L15](#l15) Bind <code>bytesRead</code>: use the literal <code>0</code>.
- [L16](#l16) Declare helper [read (16:3)](#fn-1127); it captures this lexical environment.
- [L41](#l41) Declare helper [reason (41:3)](#fn-2756); it captures this lexical environment.
- [L66](#l66) Declare helper [record (66:3)](#fn-4284); it captures this lexical environment.
- [L70](#l70) Declare helper [describe (70:3)](#fn-4524); it captures this lexical environment.
- [L73](#l73) Return to the caller: create an object with 3 property/spread entries: <code>{reason,record,describe}</code>; later properties overwrite earlier spread values.

<a id="fn-1127"></a>
### read (16:3)

Asynchronous function: returns a Promise. Lexically inside [createIgnorePolicy (11:8)](#fn-534). 

Parameters:

- <code>directory:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L17](#l17) <code>file</code>: test <code>directory</code>; choose <code>directory+'/.gitignore'</code> when truthy, otherwise <code>'.gitignore'</code>.
- [L19](#l19) <code>parent</code>: wait for <code>fs.lstat(join(root,directory))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L20](#l20) <code>stat</code>: wait for <code>fs.lstat(join(root,file))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L23](#l23) <code>handle</code>: wait for <code>fs.open(join(root,file),'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L23](#l23) <code>bytes:Buffer</code>: leave the value undefined until a later assignment.
- [L26](#l26) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(LIMIT+1)</code>.
- [L26](#l26) <code>size</code>: use the literal <code>0</code>.
- [L27](#l27) <code>chunk</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L32](#l32) <code>content</code>: call the named operation with the supplied arguments: <code>new TextDecoder('utf-8',{fatal:true}).decode(bytes)</code>.
- [L33](#l33) <code>matcher</code>: insert a unique value in the Set: <code>ignore({ignorecase:false}).add(content)</code>.

Execution:

- [L17](#l17) Bind <code>file</code>: test <code>directory</code>; choose <code>directory+'/.gitignore'</code> when truthy, otherwise <code>'.gitignore'</code>.
- [L18](#l18) Run the protected block:
  - [L19](#l19) If <code>directory</code> is truthy:
    - [L19](#l19) Bind <code>parent</code>: wait for <code>fs.lstat(join(root,directory))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L19](#l19) If <code>parent.isSymbolicLink() &#124;&#124; !parent.isDirectory()</code> is truthy:
      - [L19](#l19) Return to the caller: use the literal <code>false</code>.
  - [L20](#l20) Bind <code>stat</code>: wait for <code>fs.lstat(join(root,file))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L21](#l21) If <code>stat.isSymbolicLink() &#124;&#124; !stat.isFile() &#124;&#124; stat.size&gt;LIMIT</code> is truthy:
    - [L21](#l21) Throw <code>Error('Ignore file must be a regular, unlinked file of at most 64 KiB')</code>; normal execution stops until an enclosing catch handles it.
  - [L22](#l22) If <code>report.sources.length&gt;=MAX_FILES</code> is truthy:
    - [L22](#l22) Throw <code>Error('More than 256 ignore files')</code>; normal execution stops until an enclosing catch handles it.
  - [L23](#l23) Bind <code>handle</code>: wait for <code>fs.open(join(root,file),'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L23](#l23) Bind <code>bytes:Buffer</code>: leave the value undefined until a later assignment.
  - [L24](#l24) Run the protected block:
    - [L25](#l25) If <code>!(await handle.stat()).isFile()</code> is truthy:
      - [L25](#l25) Throw <code>Error('Ignore file changed')</code>; normal execution stops until an enclosing catch handles it.
    - [L26](#l26) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(LIMIT+1)</code>.
    - [L26](#l26) Bind <code>size</code>: use the literal <code>0</code>.
    - [L27](#l27) Repeat while <code>size&lt;buffer.length</code>:
      - [L27](#l27) Bind <code>chunk</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
      - [L27](#l27) If <code>!chunk.bytesRead</code> is truthy:
        - [L27](#l27) Leave the enclosing loop/switch.
      - [L27](#l27) update <code>size</code> with <code>chunk.bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L28](#l28) If <code>size&gt;LIMIT &#124;&#124; bytesRead+size&gt;1024*1024</code> is truthy:
      - [L28](#l28) Throw <code>Error('Ignore policy exceeds read limits')</code>; normal execution stops until an enclosing catch handles it.
    - [L29](#l29) update <code>bytes</code> with <code>buffer.subarray(0,size)</code> using <code>=</code>; this mutation is visible to later statements.
    - [L29](#l29) update <code>bytesRead</code> with <code>size</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L24](#l24) Always run cleanup on leaving the try/catch, including return or throw:
    - [L30](#l30) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L31](#l31) If <code>bytes.includes(0)</code> is truthy:
    - [L31](#l31) Throw <code>Error('Binary ignore file')</code>; normal execution stops until an enclosing catch handles it.
  - [L32](#l32) Bind <code>content</code>: call the named operation with the supplied arguments: <code>new TextDecoder('utf-8',{fatal:true}).decode(bytes)</code>.
  - [L33](#l33) Bind <code>matcher</code>: insert a unique value in the Set: <code>ignore({ignorecase:false}).add(content)</code>.
  - [L34](#l34) append values to the existing array: <code>report.sources.push({path:file,sha256:createHash('sha256').update(bytes).digest('hex')})</code>.
  - [L35](#l35) Return to the caller: create an object with 3 property/spread entries: <code>{directory,file,matcher}</code>; later properties overwrite earlier spread values.
- [L18](#l18) If it throws, bind <code>error</code>:
  - [L37](#l37) If <code>(error as NodeJS.ErrnoException).code==='ENOENT'</code> is truthy:
    - [L37](#l37) Return undefined immediately; remaining statements in this function do not execute.
  - [L38](#l38) Throw <code>new Error(&#96;Cannot apply ${file}: ${error instanceof Error?error.message:'read failed'}&#96;)</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-2756"></a>
### reason (41:3)

Asynchronous function: returns a Promise. Lexically inside [createIgnorePolicy (11:8)](#fn-534). 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory=false</code>: when omitted/undefined, initialize with <code>false</code>.
- <code>builtIn=true</code>: when omitted/undefined, initialize with <code>true</code>.

Local bindings (nested callback locals are documented with that callback):

- [L46](#l46) <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.
- [L46](#l46) <code>scopes:{directory:string;file:string;matcher:Ignore}[]</code>: create a new empty array to accumulate ordered results.
- [L47](#l47) <code>i</code>: use the literal <code>0</code>.
- [L48](#l48) <code>parent</code>: concatenate the elements with the supplied separator: <code>parts.slice(0,i).join('/')</code>.
- [L50](#l50) <code>scope</code>: wait for <code>cache.get(parent)!</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L54](#l54) <code>prefix</code>: compute <code>parts.slice(0,i+1).join('/')+(i&lt;parts.length-1 &#124;&#124; directory?'/':'')</code> with the <code>+</code> operator.
- [L55](#l55) <code>matched:Reason&#124;undefined</code>: leave the value undefined until a later assignment.
- [L56](#l56) <code>scope</code>: receive the next iterable value from <code>scopes</code> at the start of each loop iteration.
- [L57](#l57) <code>relative</code>: test <code>scope.directory</code>; choose <code>prefix.slice(scope.directory.length+1)</code> when truthy, otherwise <code>prefix</code>.
- [L58](#l58) <code>result</code>: evaluate a regular expression against the value: <code>scope.matcher.test(relative)</code>.

Execution:

- [L42](#l42) If <code>!path &#124;&#124; path.startsWith('/') &#124;&#124; path.split('/').some(p=&gt;!p &#124;&#124; p==='.' &#124;&#124; p==='..') &#124;&#124; path.includes('\\')</code> is truthy:
  - [L42](#l42) Throw <code>Error('Invalid ignore-policy path')</code>; normal execution stops until an enclosing catch handles it.
- [L43](#l43) If <code>builtIn &amp;&amp; path.split('/').some(p=&gt;p==='.git' &#124;&#124; p==='node_modules')</code> is truthy:
  - [L43](#l43) Return to the caller: create an object with 1 property/spread entries: <code>{reason:'built-in'}</code>; later properties overwrite earlier spread values.
- [L44](#l44) If <code>isExcluded(path,exclude)</code> is truthy:
  - [L44](#l44) Return to the caller: create an object with 2 property/spread entries: <code>{reason:'shipcheck',pattern:exclude.find(pattern=&gt;isExcluded(path,[pattern]))!}</code>; later properties overwrite earlier spread values.
- [L45](#l45) If <code>!enabled</code> is truthy:
  - [L45](#l45) Return undefined immediately; remaining statements in this function do not execute.
- [L46](#l46) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.
- [L46](#l46) Bind <code>scopes:{directory:string;file:string;matcher:Ignore}[]</code>: create a new empty array to accumulate ordered results.
- [L47](#l47) Initialize <code>let i=0</code>; repeat while <code>i&lt;parts.length</code>; after each normal iteration evaluate <code>i++</code>:
  - [L48](#l48) Bind <code>parent</code>: concatenate the elements with the supplied separator: <code>parts.slice(0,i).join('/')</code>.
  - [L49](#l49) If <code>!cache.has(parent)</code> is truthy:
    - [L49](#l49) store/replace a keyed entry in the Map: <code>cache.set(parent,read(parent))</code>.
  - [L50](#l50) Bind <code>scope</code>: wait for <code>cache.get(parent)!</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L52](#l52) If <code>scope===false</code> is truthy:
    - [L52](#l52) Return undefined immediately; remaining statements in this function do not execute.
  - [L53](#l53) If <code>scope</code> is truthy:
    - [L53](#l53) append values to the existing array: <code>scopes.push(scope)</code>.
  - [L54](#l54) Bind <code>prefix</code>: compute <code>parts.slice(0,i+1).join('/')+(i&lt;parts.length-1 &#124;&#124; directory?'/':'')</code> with the <code>+</code> operator.
  - [L55](#l55) Bind <code>matched:Reason&#124;undefined</code>: leave the value undefined until a later assignment.
  - [L56](#l56) Iterate <code>scopes</code> values, binding <code>const scope</code> for each iteration:
    - [L57](#l57) Bind <code>relative</code>: test <code>scope.directory</code>; choose <code>prefix.slice(scope.directory.length+1)</code> when truthy, otherwise <code>prefix</code>.
    - [L58](#l58) Bind <code>result</code>: evaluate a regular expression against the value: <code>scope.matcher.test(relative)</code>.
    - [L59](#l59) If <code>result.ignored</code> is truthy:
      - [L59](#l59) update <code>matched</code> with <code>{reason:'gitignore',source:scope.file,...(result.rule?{pattern:result.rule.pattern}:{})}</code> using <code>=</code>; this mutation is visible to later statements.
    - [L59](#l59) Otherwise:
      - [L60](#l60) If <code>result.unignored</code> is truthy:
        - [L60](#l60) update <code>matched</code> with <code>undefined</code> using <code>=</code>; this mutation is visible to later statements.
  - [L63](#l63) If <code>matched</code> is truthy:
    - [L63](#l63) Return to the caller: evaluate <code>matched</code>.

<a id="fn-2909"></a>
### path.split('/').some callback (42:62)

Synchronous function. Lexically inside [reason (41:3)](#fn-2756). Passed to <code>path.split('/').some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L42](#l42) Implicitly return: evaluate <code>!p &#124;&#124; p==='.' &#124;&#124; p==='..'</code> left to right with truthy short-circuiting.

<a id="fn-3044"></a>
### path.split('/').some callback (43:40)

Synchronous function. Lexically inside [reason (41:3)](#fn-2756). Passed to <code>path.split('/').some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L43](#l43) Implicitly return: evaluate <code>p==='.git' &#124;&#124; p==='node_modules'</code> left to right with truthy short-circuiting.

<a id="fn-3189"></a>
### exclude.find callback (44:81)

Synchronous function. Lexically inside [reason (41:3)](#fn-2756). Passed to <code>exclude.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L44](#l44) Implicitly return: call the named operation with the supplied arguments: <code>isExcluded(path,[pattern])</code>.

<a id="fn-4284"></a>
### record (66:3)

Synchronous function. Lexically inside [createIgnorePolicy (11:8)](#fn-534). 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>kind:IgnorePolicyReport['skipped'][number]['kind']</code>: supplied by the caller; usage is shown in the steps below.
- <code>reason:Reason</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L67](#l67) increment <code>report.skippedCount</code> by one.
- [L68](#l68) If <code>report.skipped.length&lt;200</code> is truthy:
  - [L68](#l68) append values to the existing array: <code>report.skipped.push({path,kind,...reason})</code>.
- [L68](#l68) Otherwise:
  - [L68](#l68) update <code>report.skippedTruncated</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.

<a id="fn-4524"></a>
### describe (70:3)

Synchronous function. Lexically inside [createIgnorePolicy (11:8)](#fn-534). 

Execution:

- [L71](#l71) Return to the caller: create an object with 3 property/spread entries: <code>{...report,sources:[...report.sources].sort((a,b)=&gt;a.path&lt;b.path?-1:1),skipped:[...report.skipped].sort((a,b)=&gt;a.path&lt;b.path?-1:1)}</code>; later properties overwrite earlier spread values.

<a id="fn-4620"></a>
### [...report.sources].sort callback (71:56)

Synchronous function. Lexically inside [describe (70:3)](#fn-4524). Passed to <code>[...report.sources].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: test <code>a.path&lt;b.path</code>; choose <code>-1</code> when truthy, otherwise <code>1</code>.

<a id="fn-4680"></a>
### [...report.skipped].sort callback (71:116)

Synchronous function. Lexically inside [describe (70:3)](#fn-4524). Passed to <code>[...report.skipped].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: test <code>a.path&lt;b.path</code>; choose <code>-1</code> when truthy, otherwise <code>1</code>.

## Compile-time data contracts

### IgnoreOptions

```typescript
type IgnoreOptions={exclude?:string[];respectGitignore?:boolean};
```

Declared at [L7](#l7). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Reason

```typescript
type Reason=Pick<IgnorePolicyReport['skipped'][number],'reason'|'source'|'pattern'>;
```

Declared at [L8](#l8). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### IgnorePolicy

```typescript
type IgnorePolicy=ReturnType<typeof createIgnorePolicy>;
```

Declared at [L75](#l75). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L9](#l9) <code>LIMIT</code>: use the literal <code>65536</code>.
- [L9](#l9) <code>MAX_FILES</code>: use the literal <code>256</code>.

## Directly importing tests

- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)

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
   1 | import fs from 'node:fs/promises';
   2 | import {join} from 'node:path';
   3 | import {createHash} from 'node:crypto';
   4 | import ignore,{type Ignore} from 'ignore';
   5 | import {isExcluded} from './config.js';
   6 | import type {IgnorePolicyReport} from './ignore-contracts.js';
   7 | export type IgnoreOptions={exclude?:string[];respectGitignore?:boolean};
   8 | type Reason=Pick<IgnorePolicyReport['skipped'][number],'reason'|'source'|'pattern'>;
   9 | const LIMIT=65536,MAX_FILES=256;
  10 | /** No Git executable, user configuration, ancestor files or .git/info/exclude. */
  11 | export function createIgnorePolicy(root:string,options:IgnoreOptions={}) {
  12 |   const exclude=options.exclude ?? [],enabled=options.respectGitignore ?? options.exclude===undefined;
  13 |   const report:IgnorePolicyReport={mode:enabled?(exclude.length?'combined':'gitignore'):(exclude.length?'shipcheck':'built-in'),
  14 |     respectGitignore:enabled,exclude,builtIn:['.git','node_modules'],gitSettings:'repository-gitignore-only',sources:[],skipped:[],skippedCount:0,skippedTruncated:false};
  15 |   const cache=new Map<string,Promise<{directory:string;file:string;matcher:Ignore}|false|undefined>>();let bytesRead=0;
  16 |   async function read(directory:string) {
  17 |     const file=directory?directory+'/.gitignore':'.gitignore';
  18 |     try {
  19 |       if(directory) {const parent=await fs.lstat(join(root,directory));if(parent.isSymbolicLink() || !parent.isDirectory())return false;}
  20 |       const stat=await fs.lstat(join(root,file));
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
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
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>

```text
  21 |       if(stat.isSymbolicLink() || !stat.isFile() || stat.size>LIMIT)throw Error('Ignore file must be a regular, unlinked file of at most 64 KiB');
  22 |       if(report.sources.length>=MAX_FILES)throw Error('More than 256 ignore files');
  23 |       const handle=await fs.open(join(root,file),'r');let bytes:Buffer;
  24 |       try {
  25 |         if(!(await handle.stat()).isFile())throw Error('Ignore file changed');
  26 |         const buffer=Buffer.alloc(LIMIT+1);let size=0;
  27 |         while(size<buffer.length){const chunk=await handle.read(buffer,size,buffer.length-size,null);if(!chunk.bytesRead)break;size+=chunk.bytesRead;}
  28 |         if(size>LIMIT || bytesRead+size>1024*1024)throw Error('Ignore policy exceeds read limits');
  29 |         bytes=buffer.subarray(0,size);bytesRead+=size;
  30 |       } finally {await handle.close();}
  31 |       if(bytes.includes(0))throw Error('Binary ignore file');
  32 |       const content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  33 |       const matcher=ignore({ignorecase:false}).add(content);
  34 |       report.sources.push({path:file,sha256:createHash('sha256').update(bytes).digest('hex')});
  35 |       return {directory,file,matcher};
  36 |     } catch(error) {
  37 |       if((error as NodeJS.ErrnoException).code==='ENOENT')return;
  38 |       throw new Error(`Cannot apply ${file}: ${error instanceof Error?error.message:'read failed'}`);
  39 |     }
  40 |   }
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   async function reason(path:string,directory=false,builtIn=true):Promise<Reason|undefined> {
  42 |     if(!path || path.startsWith('/') || path.split('/').some(p=>!p || p==='.' || p==='..') || path.includes('\\'))throw Error('Invalid ignore-policy path');
  43 |     if(builtIn && path.split('/').some(p=>p==='.git' || p==='node_modules'))return {reason:'built-in'};
  44 |     if(isExcluded(path,exclude))return {reason:'shipcheck',pattern:exclude.find(pattern=>isExcluded(path,[pattern]))!};
  45 |     if(!enabled)return;
  46 |     const parts=path.split('/'),scopes:{directory:string;file:string;matcher:Ignore}[]=[];
  47 |     for(let i=0;i<parts.length;i++) {
  48 |       const parent=parts.slice(0,i).join('/');
  49 |       if(!cache.has(parent))cache.set(parent,read(parent));
  50 |       const scope=await cache.get(parent)!;
  51 |       // Callers classify links/non-directories; never discover rules through them.
  52 |       if(scope===false)return;
  53 |       if(scope)scopes.push(scope);
  54 |       const prefix=parts.slice(0,i+1).join('/')+(i<parts.length-1 || directory?'/':'');
  55 |       let matched:Reason|undefined;
  56 |       for(const scope of scopes) {
  57 |         const relative=scope.directory?prefix.slice(scope.directory.length+1):prefix;
  58 |         const result=scope.matcher.test(relative);
  59 |         if(result.ignored)matched={reason:'gitignore',source:scope.file,...(result.rule?{pattern:result.rule.pattern}:{})};
  60 |         else if(result.unignored)matched=undefined;
```

<a id="l63"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l73"></a>
<a id="l75"></a>

```text
  61 |       }
  62 |       // Git cannot re-include children while their parent remains ignored.
  63 |       if(matched)return matched;
  64 |     }
  65 |   }
  66 |   function record(path:string,kind:IgnorePolicyReport['skipped'][number]['kind'],reason:Reason) {
  67 |     report.skippedCount++;
  68 |     if(report.skipped.length<200)report.skipped.push({path,kind,...reason});else report.skippedTruncated=true;
  69 |   }
  70 |   function describe():IgnorePolicyReport {
  71 |     return {...report,sources:[...report.sources].sort((a,b)=>a.path<b.path?-1:1),skipped:[...report.skipped].sort((a,b)=>a.path<b.path?-1:1)};
  72 |   }
  73 |   return {reason,record,describe};
  74 | }
  75 | export type IgnorePolicy=ReturnType<typeof createIgnorePolicy>;
  76 | 
```
