# src/ai/context.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

collectContext selects source from inventory, preserving explicit request order or otherwise ranking src before tests and other files. It rejects unsafe/sensitive/generated paths, reads complete files within limits and accounts for serialized JSON bytes. Local import hints are inserted immediately after the importer; visited prevents cycles, requested distinguishes supporting context, and dependencies exposes omitted/unresolved neighbors. Fresh rereads reuse these same guards.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `006a568600376e86afb70e7a8326e6b7a37487b2a4026d8a442efd5731f014a2`.

This chapter inventories **11 function bodies/callbacks**, **34 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>../ignore-policy.js</code>: <code>createIgnorePolicy</code>, <code>IgnorePolicy</code> (type only).
- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>join</code>, <code>posix</code>, <code>relative</code>.
- <code>node:crypto</code>: <code>createHash</code>.
- <code>../config.js</code>: <code>isExcluded</code>.
- <code>../filesystem-policy.js</code>: <code>validateRoot</code>.
- <code>../repository-profile.js</code>: <code>RepositoryProfile</code> (type only).
- <code>./contracts.js</code>: <code>AiSettings</code> (type only), <code>AiResult</code> (type only).
- <code>./local-imports.js</code>: <code>localImports</code>, <code>resolveLocalImport</code>.
- <code>../sensitive-content.js</code>: <code>deniedNames</code>, <code>looksSensitive</code>.
- <code>../reference-resources.js</code>: <code>ResourceSnapshot</code> (type only).
- <code>../task-file.js</code>: <code>CurrentTask</code> (type only).

## Module execution

- [L16](#l16) Bind <code>extensions</code>: construct <code>Set</code> using <code>['.ts','.tsx','.mts','.cts','.js','.jsx','.mjs','.cjs','.py','.go','.rs','.java','.cs','.c','.cpp','.h','.rb','.php','.swift']</code>; this creates the local instance used below.

## Function index

- [allowed (18:1)](#fn-1063)
- [parts.every callback (20:22)](#fn-1150)
- [readSource (25:1)](#fn-1401)
- [collectContext (55:8)](#fn-2874)
- [profile.files.map callback (60:47)](#fn-3389)
- [[...inventory].sort callback (63:76)](#fn-3629)
- [rank (64:18)](#fn-3656)
- [files.map callback (105:36)](#fn-6165)
- [files.filter callback (108:40)](#fn-6387)
- [files.filter(file=&gt;!requested.has(file.path)).map callback (108:77)](#fn-6424)
- [dependencies.some callback (110:24)](#fn-6502)

<a id="fn-1063"></a>
### allowed (18:1)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L19](#l19) <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.

Execution:

- [L19](#l19) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.
- [L20](#l20) Return to the caller: evaluate <code>parts.every(p =&gt; p &amp;&amp; p !== '..' &amp;&amp; !p.startsWith('.') &amp;&amp; !deniedNames.test(p) &amp;&amp; !['node_modules','dist','build','coverage','vendor'].includes(p.toLowerCase())) &amp;&amp; !/[:\\\u0000-\u001f]/.test(path) &amp;&amp; extensions.has(posix.extname(path).toLowerCase())</code> left to right with falsy short-circuiting.

<a id="fn-1150"></a>
### parts.every callback (20:22)

Synchronous function. Lexically inside [allowed (18:1)](#fn-1063). Passed to <code>parts.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L20](#l20) Implicitly return: evaluate <code>p &amp;&amp; p !== '..' &amp;&amp; !p.startsWith('.') &amp;&amp; !deniedNames.test(p) &amp;&amp; !['node_modules','dist','build','coverage','vendor'].includes(p.toLowerCase())</code> left to right with falsy short-circuiting.

<a id="fn-1401"></a>
### readSource (25:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>limit: number</code>: supplied by the caller; usage is shown in the steps below.
- <code>excluded: string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>policy:IgnorePolicy</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L26](#l26) <code>current</code>: evaluate <code>root</code>.
- [L27](#l27) <code>part</code>: receive the next iterable value from <code>path.split('/')</code> at the start of each loop iteration.
- [L29](#l29) <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L31](#l31) <code>actual</code>: concatenate the elements with the supplied separator: <code>relative(root, await fs.realpath(current)).split('\\').join('/')</code>.
- [L34](#l34) <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L37](#l37) <code>handle</code>: wait for <code>fs.open(current, 'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L40](#l40) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(limit + 1)</code>.
- [L41](#l41) <code>length</code>: use the literal <code>0</code>.
- [L43](#l43) <code>read</code>: wait for <code>handle.read(buffer, length, buffer.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L48](#l48) <code>bytes</code>: call the named operation with the supplied arguments: <code>buffer.subarray(0,length)</code>.

Execution:

- [L26](#l26) Bind <code>current</code>: evaluate <code>root</code>.
- [L27](#l27) Iterate <code>path.split('/')</code> values, binding <code>const part</code> for each iteration:
  - [L28](#l28) update <code>current</code> with <code>join(current, part)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L29](#l29) Bind <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L30](#l30) If <code>stat.isSymbolicLink()</code> is truthy:
    - [L30](#l30) Throw <code>new Error('symlink')</code>; normal execution stops until an enclosing catch handles it.
  - [L31](#l31) Bind <code>actual</code>: concatenate the elements with the supplied separator: <code>relative(root, await fs.realpath(current)).split('\\').join('/')</code>.
  - [L32](#l32) If <code>actual.startsWith('../') &#124;&#124; isExcluded(actual, excluded) &#124;&#124; await policy.reason(actual,stat.isDirectory())</code> is truthy:
    - [L32](#l32) Throw <code>new Error('excluded')</code>; normal execution stops until an enclosing catch handles it.
- [L34](#l34) Bind <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L35](#l35) If <code>!stat.isFile()</code> is truthy:
  - [L35](#l35) Throw <code>new Error('non-regular')</code>; normal execution stops until an enclosing catch handles it.
- [L36](#l36) If <code>stat.size &gt; limit</code> is truthy:
  - [L36](#l36) Throw <code>new Error('file-size-limit')</code>; normal execution stops until an enclosing catch handles it.
- [L37](#l37) Bind <code>handle</code>: wait for <code>fs.open(current, 'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L38](#l38) Run the protected block:
  - [L39](#l39) If <code>!(await handle.stat()).isFile()</code> is truthy:
    - [L39](#l39) Throw <code>new Error('non-regular')</code>; normal execution stops until an enclosing catch handles it.
  - [L40](#l40) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(limit + 1)</code>.
  - [L41](#l41) Bind <code>length</code>: use the literal <code>0</code>.
  - [L42](#l42) Repeat while <code>length &lt; buffer.length</code>:
    - [L43](#l43) Bind <code>read</code>: wait for <code>handle.read(buffer, length, buffer.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L44](#l44) If <code>!read.bytesRead</code> is truthy:
      - [L44](#l44) Leave the enclosing loop/switch.
    - [L45](#l45) update <code>length</code> with <code>read.bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L47](#l47) If <code>length &gt; limit</code> is truthy:
    - [L47](#l47) Throw <code>new Error('file-size-limit')</code>; normal execution stops until an enclosing catch handles it.
  - [L48](#l48) Bind <code>bytes</code>: call the named operation with the supplied arguments: <code>buffer.subarray(0,length)</code>.
  - [L49](#l49) If <code>bytes.includes(0)</code> is truthy:
    - [L49](#l49) Throw <code>new Error('non-text')</code>; normal execution stops until an enclosing catch handles it.
  - [L50](#l50) Return to the caller: call the named operation with the supplied arguments: <code>new TextDecoder('utf-8',{fatal:true}).decode(bytes)</code>.
- [L38](#l38) Always run cleanup on leaving the try/catch, including return or throw:
  - [L51](#l51) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-2874"></a>
### collectContext (55:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>profile: RepositoryProfile</code>: supplied by the caller; usage is shown in the steps below.
- <code>settings: AiSettings</code>: supplied by the caller; usage is shown in the steps below.
- <code>requestedPaths?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L56](#l56) <code>root</code>: wait for <code>fs.realpath(await validateRoot(profile.root))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L57](#l57) <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,{exclude:profile.excluded,respectGitignore:profile.ignorePolicy?.respectGitignore ?? false})</code>.
- [L58](#l58) <code>files: SourceFile[]</code>: create a new empty array to accumulate ordered results.
- [L59](#l59) <code>preview: AiResult['preview']</code>: create an object with 4 property/spread entries: <code>{files:[], skipped:[], serializedBytes:2, limited:false}</code>; later properties overwrite earlier spread values.
- [L60](#l60) <code>inventory</code>: construct <code>Set</code> using <code>profile.files.map(f=&gt;f.path)</code>; this creates the local instance used below.
- [L63](#l63) <code>paths</code>: test <code>requestedPaths</code>; choose <code>[...requestedPaths]</code> when truthy, otherwise <code>[...inventory].sort((a,b)=&gt; { const rank = (p: string) =&gt; p.startsWith('src/') ? 0 : /^(?:test&#124;tests)\//.test(p) ? 1 : 2; return rank(a)-rank(b) &#124;&#124; (a&lt;b ? -1 : a&gt;b ? 1 : 0); })</code>.
- [L67](#l67) <code>requested</code>: construct <code>Set</code> using <code>paths</code>; this creates the local instance used below.
- [L68](#l68) <code>visited</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L69](#l69) <code>dependencies: NonNullable&lt;AiResult['preview']['dependencies']&gt;</code>: create a new empty array to accumulate ordered results.
- [L70](#l70) <code>path</code>: receive the next iterable value from <code>paths</code> at the start of each loop iteration.
- [L73](#l73) <code>reason: string &#124; undefined</code>: leave the value undefined until a later assignment.
- [L78](#l78) <code>content: string</code>: leave the value undefined until a later assignment.
- [L81](#l81) <code>known</code>: create an array from <code>['symlink','excluded','non-regular','file-size-limit','non-text']</code>; spread elements insert the iterable values.
- [L82](#l82) <code>message</code>: test <code>error instanceof Error</code>; choose <code>error.message</code> when truthy, otherwise <code>''</code>.
- [L88](#l88) <code>next</code>: create an object with 2 property/spread entries: <code>{path,content}</code>; later properties overwrite earlier spread values.
- [L89](#l89) <code>size</code>: call the named operation with the supplied arguments: <code>Buffer.byteLength(JSON.stringify([...files,next]),'utf8')</code>.
- [L95](#l95) <code>related:string[]</code>: create a new empty array to accumulate ordered results.
- [L96](#l96) <code>specifier</code>: receive the next iterable value from <code>localImports(content)</code> at the start of each loop iteration.
- [L97](#l97) <code>dependency</code>: call the named operation with the supplied arguments: <code>resolveLocalImport(path,specifier,inventory)</code>.
- [L105](#l105) <code>included</code>: construct <code>Set</code> using <code>files.map(file=&gt;file.path)</code>; this creates the local instance used below.
- [L106](#l106) <code>dependency</code>: receive the next iterable value from <code>dependencies</code> at the start of each loop iteration.

Execution:

- [L56](#l56) Bind <code>root</code>: wait for <code>fs.realpath(await validateRoot(profile.root))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L57](#l57) Bind <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,{exclude:profile.excluded,respectGitignore:profile.ignorePolicy?.respectGitignore ?? false})</code>.
- [L58](#l58) Bind <code>files: SourceFile[]</code>: create a new empty array to accumulate ordered results.
- [L59](#l59) Bind <code>preview: AiResult['preview']</code>: create an object with 4 property/spread entries: <code>{files:[], skipped:[], serializedBytes:2, limited:false}</code>; later properties overwrite earlier spread values.
- [L60](#l60) Bind <code>inventory</code>: construct <code>Set</code> using <code>profile.files.map(f=&gt;f.path)</code>; this creates the local instance used below.
- [L63](#l63) Bind <code>paths</code>: test <code>requestedPaths</code>; choose <code>[...requestedPaths]</code> when truthy, otherwise <code>[...inventory].sort((a,b)=&gt; { const rank = (p: string) =&gt; p.startsWith('src/') ? 0 : /^(?:test&#124;tests)\//.test(p) ? 1 : 2; return rank(a)-rank(b) &#124;&#124; (a&lt;b ? -1 : a&gt;b ? 1 : 0); })</code>.
- [L67](#l67) Bind <code>requested</code>: construct <code>Set</code> using <code>paths</code>; this creates the local instance used below.
- [L68](#l68) Bind <code>visited</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L69](#l69) Bind <code>dependencies: NonNullable&lt;AiResult['preview']['dependencies']&gt;</code>: create a new empty array to accumulate ordered results.
- [L70](#l70) Iterate <code>paths</code> values, binding <code>const path</code> for each iteration:
  - [L71](#l71) If <code>visited.has(path)</code> is truthy:
    - [L71](#l71) Skip the rest of this iteration and advance the enclosing loop.
  - [L72](#l72) insert a unique value in the Set: <code>visited.add(path)</code>.
  - [L73](#l73) Bind <code>reason: string &#124; undefined</code>: leave the value undefined until a later assignment.
  - [L74](#l74) If <code>!inventory.has(path)</code> is truthy:
    - [L74](#l74) update <code>reason</code> with <code>'not-in-inventory'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L74](#l74) Otherwise:
    - [L75](#l75) If <code>!allowed(path) &#124;&#124; isExcluded(path, profile.excluded)</code> is truthy:
      - [L75](#l75) update <code>reason</code> with <code>'excluded-or-not-source'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L75](#l75) Otherwise:
      - [L76](#l76) If <code>files.length &gt;= settings.maxFiles</code> is truthy:
        - [L76](#l76) update <code>reason</code> with <code>'file-count-limit'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L76](#l76) update <code>preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L77](#l77) If <code>reason</code> is truthy:
    - [L77](#l77) append values to the existing array: <code>preview.skipped.push({path, reason})</code>.
    - [L77](#l77) Skip the rest of this iteration and advance the enclosing loop.
  - [L78](#l78) Bind <code>content: string</code>: leave the value undefined until a later assignment.
  - [L79](#l79) Run the protected block:
    - [L79](#l79) update <code>content</code> with <code>await readSource(root,path,settings.maxFileBytes,profile.excluded,policy)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L79](#l79) If it throws, bind <code>error</code>:
    - [L81](#l81) Bind <code>known</code>: create an array from <code>['symlink','excluded','non-regular','file-size-limit','non-text']</code>; spread elements insert the iterable values.
    - [L82](#l82) Bind <code>message</code>: test <code>error instanceof Error</code>; choose <code>error.message</code> when truthy, otherwise <code>''</code>.
    - [L83](#l83) update <code>reason</code> with <code>known.includes(message) ? message : 'unreadable-or-invalid-utf8'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L84](#l84) append values to the existing array: <code>preview.skipped.push({path, reason})</code>.
    - [L84](#l84) update <code>preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L84](#l84) Skip the rest of this iteration and advance the enclosing loop.
  - [L86](#l86) If <code>looksSensitive.test(content)</code> is truthy:
    - [L86](#l86) append values to the existing array: <code>preview.skipped.push({path, reason:'sensitive-content'})</code>.
    - [L86](#l86) update <code>preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L86](#l86) Skip the rest of this iteration and advance the enclosing loop.
  - [L87](#l87) If <code>!content.trim()</code> is truthy:
    - [L87](#l87) append values to the existing array: <code>preview.skipped.push({path, reason:'empty'})</code>.
    - [L87](#l87) Skip the rest of this iteration and advance the enclosing loop.
  - [L88](#l88) Bind <code>next</code>: create an object with 2 property/spread entries: <code>{path,content}</code>; later properties overwrite earlier spread values.
  - [L89](#l89) Bind <code>size</code>: call the named operation with the supplied arguments: <code>Buffer.byteLength(JSON.stringify([...files,next]),'utf8')</code>.
  - [L90](#l90) If <code>size &gt; settings.maxContextBytes</code> is truthy:
    - [L90](#l90) append values to the existing array: <code>preview.skipped.push({path,reason:'context-size-limit'})</code>.
    - [L90](#l90) update <code>preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L90](#l90) Skip the rest of this iteration and advance the enclosing loop.
  - [L91](#l91) append values to the existing array: <code>files.push(next)</code>.
  - [L92](#l92) update <code>preview.serializedBytes</code> with <code>size</code> using <code>=</code>; this mutation is visible to later statements.
  - [L93](#l93) append values to the existing array: <code>preview.files.push({path, bytes:Buffer.byteLength(content), lines:content.split(/\r\n&#124;\n&#124;\r/).length, sha256:createHash('sha256').update(content).digest('hex')})</code>.
  - [L95](#l95) Bind <code>related:string[]</code>: create a new empty array to accumulate ordered results.
  - [L96](#l96) Iterate <code>localImports(content)</code> values, binding <code>const specifier</code> for each iteration:
    - [L97](#l97) Bind <code>dependency</code>: call the named operation with the supplied arguments: <code>resolveLocalImport(path,specifier,inventory)</code>.
    - [L98](#l98) append values to the existing array: <code>dependencies.push({from:path,specifier,path:dependency ?? null,status:dependency?'omitted':'unresolved'})</code>.
    - [L99](#l99) If <code>dependency &amp;&amp; !visited.has(dependency)</code> is truthy:
      - [L99](#l99) append values to the existing array: <code>related.push(dependency)</code>.
  - [L103](#l103) insert/remove elements in the receiver array: <code>paths.splice(paths.indexOf(path)+1,0,...related)</code>.
- [L105](#l105) Bind <code>included</code>: construct <code>Set</code> using <code>files.map(file=&gt;file.path)</code>; this creates the local instance used below.
- [L106](#l106) Iterate <code>dependencies</code> values, binding <code>const dependency</code> for each iteration:
  - [L106](#l106) If <code>dependency.path &amp;&amp; included.has(dependency.path)</code> is truthy:
    - [L106](#l106) update <code>dependency.status</code> with <code>'included'</code> using <code>=</code>; this mutation is visible to later statements.
- [L107](#l107) update <code>preview.requestedPaths</code> with <code>[...requested]</code> using <code>=</code>; this mutation is visible to later statements.
- [L108](#l108) update <code>preview.supportingPaths</code> with <code>files.filter(file=&gt;!requested.has(file.path)).map(file=&gt;file.path)</code> using <code>=</code>; this mutation is visible to later statements.
- [L109](#l109) update <code>preview.dependencies</code> with <code>dependencies</code> using <code>=</code>; this mutation is visible to later statements.
- [L110](#l110) If <code>dependencies.some(dependency=&gt;dependency.status!=='included')</code> is truthy:
  - [L110](#l110) update <code>preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
- [L111](#l111) Return to the caller: create an object with 2 property/spread entries: <code>{files,preview}</code>; later properties overwrite earlier spread values.

<a id="fn-3389"></a>
### profile.files.map callback (60:47)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>profile.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: read <code>f.path</code>.

<a id="fn-3629"></a>
### [...inventory].sort callback (63:76)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>[...inventory].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L64](#l64) <code>rank</code>: create [rank (64:18)](#fn-3656); its body runs when called, not when this value is created.

Execution:

- [L64](#l64) Bind <code>rank</code>: create [rank (64:18)](#fn-3656); its body runs when called, not when this value is created.
- [L65](#l65) Return to the caller: evaluate <code>rank(a)-rank(b) &#124;&#124; (a&lt;b ? -1 : a&gt;b ? 1 : 0)</code> left to right with truthy short-circuiting.

<a id="fn-3656"></a>
### rank (64:18)

Synchronous function. Lexically inside [[...inventory].sort callback (63:76)](#fn-3629). 

Parameters:

- <code>p: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L64](#l64) Implicitly return: test <code>p.startsWith('src/')</code>; choose <code>0</code> when truthy, otherwise <code>/^(?:test&#124;tests)\//.test(p) ? 1 : 2</code>.

<a id="fn-6165"></a>
### files.map callback (105:36)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L105](#l105) Implicitly return: read <code>file.path</code>.

<a id="fn-6387"></a>
### files.filter callback (108:40)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>files.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L108](#l108) Implicitly return: apply <code>!</code> to <code>requested.has(file.path)</code>.

<a id="fn-6424"></a>
### files.filter(file=&gt;!requested.has(file.path)).map callback (108:77)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>files.filter(file=&gt;!requested.has(file.path)).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L108](#l108) Implicitly return: read <code>file.path</code>.

<a id="fn-6502"></a>
### dependencies.some callback (110:24)

Synchronous function. Lexically inside [collectContext (55:8)](#fn-2874). Passed to <code>dependencies.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>dependency</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L110](#l110) Implicitly return: compute <code>dependency.status!=='included'</code> with the <code>!==</code> operator.

## Compile-time data contracts

### SourceFile

```typescript
type SourceFile = {path: string; content: string};
```

Declared at [L14](#l14). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### AiContext

```typescript
type AiContext = {files: SourceFile[]; preview: AiResult['preview']; references?:ResourceSnapshot[]; task?:CurrentTask};
```

Declared at [L15](#l15). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L16](#l16) <code>extensions</code>: construct <code>Set</code> using <code>['.ts','.tsx','.mts','.cts','.js','.jsx','.mjs','.cjs','.py','.go','.rs','.java','.cs','.c','.cpp','.h','.rb','.php','.swift']</code>; this creates the local instance used below.

## Directly importing tests

- [ai.test.ts](../../test/ai.test.ts)
- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)
- [evidence.test.ts](../../test/evidence.test.ts)
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
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {createIgnorePolicy,type IgnorePolicy} from '../ignore-policy.js';
   2 | import fs from 'node:fs/promises';
   3 | import { join, posix, relative } from 'node:path';
   4 | import { createHash } from 'node:crypto';
   5 | import { isExcluded } from '../config.js';
   6 | import { validateRoot } from '../filesystem-policy.js';
   7 | import type { RepositoryProfile } from '../repository-profile.js';
   8 | import type { AiSettings, AiResult } from './contracts.js';
   9 | import { localImports, resolveLocalImport } from './local-imports.js';
  10 | import {sensitiveName as deniedNames,sensitiveContent as looksSensitive} from '../sensitive-content.js';
  11 | import type {ResourceSnapshot} from '../reference-resources.js';
  12 | import type {CurrentTask} from '../task-file.js';
  13 | 
  14 | export type SourceFile = {path: string; content: string};
  15 | export type AiContext = {files: SourceFile[]; preview: AiResult['preview']; references?:ResourceSnapshot[]; task?:CurrentTask};
  16 | const extensions = new Set(['.ts','.tsx','.mts','.cts','.js','.jsx','.mjs','.cjs','.py','.go','.rs','.java','.cs','.c','.cpp','.h','.rb','.php','.swift']);
  17 | 
  18 | function allowed(path: string) {
  19 |   const parts = path.split('/');
  20 |   return parts.every(p => p && p !== '..' && !p.startsWith('.') && !deniedNames.test(p)
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     && !['node_modules','dist','build','coverage','vendor'].includes(p.toLowerCase()))
  22 |     && !/[:\\\u0000-\u001f]/.test(path) && extensions.has(posix.extname(path).toLowerCase());
  23 | }
  24 | 
  25 | async function readSource(root: string, path: string, limit: number, excluded: string[],policy:IgnorePolicy): Promise<string> {
  26 |   let current = root;
  27 |   for (const part of path.split('/')) {
  28 |     current = join(current, part);
  29 |     const stat = await fs.lstat(current);
  30 |     if (stat.isSymbolicLink()) throw new Error('symlink');
  31 |     const actual = relative(root, await fs.realpath(current)).split('\\').join('/');
  32 |     if (actual.startsWith('../') || isExcluded(actual, excluded) || await policy.reason(actual,stat.isDirectory())) throw new Error('excluded');
  33 |   }
  34 |   const stat = await fs.lstat(current);
  35 |   if (!stat.isFile()) throw new Error('non-regular');
  36 |   if (stat.size > limit) throw new Error('file-size-limit');
  37 |   const handle = await fs.open(current, 'r');
  38 |   try {
  39 |     if (!(await handle.stat()).isFile()) throw new Error('non-regular');
  40 |     const buffer = Buffer.alloc(limit + 1);
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     let length = 0;
  42 |     while (length < buffer.length) {
  43 |       const read = await handle.read(buffer, length, buffer.length - length, null);
  44 |       if (!read.bytesRead) break;
  45 |       length += read.bytesRead;
  46 |     }
  47 |     if (length > limit) throw new Error('file-size-limit');
  48 |     const bytes = buffer.subarray(0,length);
  49 |     if (bytes.includes(0)) throw new Error('non-text');
  50 |     return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  51 |   } finally { await handle.close(); }
  52 | }
  53 | 
  54 | /** Only selected source is eligible for a request. Full profiles/marker excerpts are never sent. */
  55 | export async function collectContext(profile: RepositoryProfile, settings: AiSettings, requestedPaths?:readonly string[]): Promise<AiContext> {
  56 |   const root = await fs.realpath(await validateRoot(profile.root));
  57 |   const policy=createIgnorePolicy(root,{exclude:profile.excluded,respectGitignore:profile.ignorePolicy?.respectGitignore ?? false});
  58 |   const files: SourceFile[] = [];
  59 |   const preview: AiResult['preview'] = {files:[], skipped:[], serializedBytes:2, limited:false};
  60 |   const inventory = new Set(profile.files.map(f=>f.path));
```

<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   // Preserve explicit batch order: re-sorting can let supporting imports displace
  62 |   // the still-unreviewed file that seeded a whole-repository batch.
  63 |   const paths = requestedPaths ? [...requestedPaths] : [...inventory].sort((a,b)=> {
  64 |     const rank = (p: string) => p.startsWith('src/') ? 0 : /^(?:test|tests)\//.test(p) ? 1 : 2;
  65 |     return rank(a)-rank(b) || (a<b ? -1 : a>b ? 1 : 0);
  66 |   });
  67 |   const requested = new Set(paths);
  68 |   const visited = new Set<string>();
  69 |   const dependencies: NonNullable<AiResult['preview']['dependencies']> = [];
  70 |   for (const path of paths) {
  71 |     if (visited.has(path)) continue;
  72 |     visited.add(path);
  73 |     let reason: string | undefined;
  74 |     if (!inventory.has(path)) reason = 'not-in-inventory';
  75 |     else if (!allowed(path) || isExcluded(path, profile.excluded)) reason = 'excluded-or-not-source';
  76 |     else if (files.length >= settings.maxFiles) { reason = 'file-count-limit'; preview.limited = true; }
  77 |     if (reason) { preview.skipped.push({path, reason}); continue; }
  78 |     let content: string;
  79 |     try { content = await readSource(root,path,settings.maxFileBytes,profile.excluded,policy); }
  80 |     catch (error) {
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l86"></a>
<a id="l87"></a>
<a id="l88"></a>
<a id="l89"></a>
<a id="l90"></a>
<a id="l91"></a>
<a id="l92"></a>
<a id="l93"></a>
<a id="l94"></a>
<a id="l95"></a>
<a id="l96"></a>
<a id="l97"></a>
<a id="l98"></a>
<a id="l99"></a>

```text
  81 |       const known = ['symlink','excluded','non-regular','file-size-limit','non-text'];
  82 |       const message = error instanceof Error ? error.message : '';
  83 |       reason = known.includes(message) ? message : 'unreadable-or-invalid-utf8';
  84 |       preview.skipped.push({path, reason}); preview.limited = true; continue;
  85 |     }
  86 |     if (looksSensitive.test(content)) { preview.skipped.push({path, reason:'sensitive-content'}); preview.limited = true; continue; }
  87 |     if (!content.trim()) { preview.skipped.push({path, reason:'empty'}); continue; }
  88 |     const next = {path,content};
  89 |     const size = Buffer.byteLength(JSON.stringify([...files,next]),'utf8');
  90 |     if (size > settings.maxContextBytes) { preview.skipped.push({path,reason:'context-size-limit'}); preview.limited = true; continue; }
  91 |     files.push(next);
  92 |     preview.serializedBytes = size;
  93 |     preview.files.push({path, bytes:Buffer.byteLength(content), lines:content.split(/\r\n|\n|\r/).length,
  94 |       sha256:createHash('sha256').update(content).digest('hex')});
  95 |     const related:string[]=[];
  96 |     for (const specifier of localImports(content)) {
  97 |       const dependency=resolveLocalImport(path,specifier,inventory);
  98 |       dependencies.push({from:path,specifier,path:dependency ?? null,status:dependency?'omitted':'unresolved'});
  99 |       if(dependency && !visited.has(dependency)) related.push(dependency);
 100 |     }
```

<a id="l103"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l111"></a>

```text
 101 |     // Visit local dependencies immediately after their importer. Reads still use
 102 |     // the same exclusions, credential checks and shared file/context budgets.
 103 |     paths.splice(paths.indexOf(path)+1,0,...related);
 104 |   }
 105 |   const included=new Set(files.map(file=>file.path));
 106 |   for(const dependency of dependencies) if(dependency.path && included.has(dependency.path)) dependency.status='included';
 107 |   preview.requestedPaths=[...requested];
 108 |   preview.supportingPaths=files.filter(file=>!requested.has(file.path)).map(file=>file.path);
 109 |   preview.dependencies=dependencies;
 110 |   if(dependencies.some(dependency=>dependency.status!=='included')) preview.limited=true;
 111 |   return {files,preview};
 112 | }
 113 | 
```
