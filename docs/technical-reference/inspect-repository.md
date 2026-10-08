# src/inspect-repository.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The mutable profile accumulates facts while an explicit pending-directory stack avoids recursive call-stack growth. inspectFile records classification before bounded content reading, parses only package.json, and captures uppercase whole-word TODO/FIXME occurrences. After traversal, reference existence is checked and all observable collections are sorted before schema validation. Warnings describe uninspected content rather than automatically becoming defects.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `2132527d738e877b891662fe0d50f4622e6234789d6c94aae437fb3d9c8aa91e`.

This chapter inventories **14 function bodies/callbacks**, **23 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./ignore-policy.js</code>: <code>createIgnorePolicy</code>, <code>IgnoreOptions</code> (type only).
- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>join</code>.
- <code>./filesystem-policy.js</code>: <code>MAX_FILE_BYTES</code>, <code>validateRoot</code>.
- <code>./reference-existence.js</code>: <code>referenceExistence</code>.
- <code>./classify.js</code>: <code>classifyFile</code>.
- <code>./inspect-package.js</code>: <code>inspectPackage</code>.
- <code>./package-references.js</code>: <code>packageReferences</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>isExcluded</code>.
- <code>./repository-profile.js</code>: <code>repositoryProfileSchema</code>, <code>RepositoryProfile</code> (type only).

## Module execution

- [L12](#l12) Re-export the listed bindings; no wrapper function is introduced.
- [L14](#l14) Bind <code>compare</code>: create [compare (14:17)](#fn-661); its body runs when called, not when this value is created.

## Function index

- [compare (14:17)](#fn-661)
- [inspectRepository (17:8)](#fn-807)
- [warn (25:16)](#fn-1355)
- [inspectFile (29:3)](#fn-1505)
- [content.split(/\r\n&#124;\n&#124;\r/).forEach callback (90:41)](#fn-3964)
- [entries.sort callback (109:18)](#fn-4643)
- [profile.files.sort callback (124:22)](#fn-5499)
- [profile.packageReferences.sort callback (126:34)](#fn-5605)
- [profile.manifests.sort callback (127:26)](#fn-5695)
- [profile.packageScripts.sort callback (130:31)](#fn-5825)
- [profile.packageIssues.sort callback (131:30)](#fn-5890)
- [profile.markers.sort callback (132:24)](#fn-5976)
- [profile.warnings.sort callback (133:25)](#fn-6055)
- [Object.entries(profile.languages).sort callback (134:81)](#fn-6198)

<a id="fn-661"></a>
### compare (14:17)

Synchronous function. Defined in module scope. 

Parameters:

- <code>a: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>b: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: test <code>a &lt; b</code>; choose <code>-1</code> when truthy, otherwise <code>a &gt; b ? 1 : 0</code>.

<a id="fn-807"></a>
### inspectRepository (17:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target = "."</code>: when omitted/undefined, initialize with <code>"."</code>.
- <code>options: IgnoreOptions = {}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L18](#l18) <code>{ exclude,respectGitignore }</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L19](#l19) <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L20](#l20) <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,{exclude,respectGitignore})</code>.
- [L21](#l21) <code>profile: RepositoryProfile</code>: create an object with 13 property/spread entries: <code>{ root, directories: [], excluded: exclude, packageReferences: [], files: [], languages: {}, manifests: [], readmes: [], tests: [], packageScripts: [], packageIssues: [], markers: [], warnings: [], }</code>; later properties overwrite earlier spread values.
- [L25](#l25) <code>warn</code>: create [warn (25:16)](#fn-1355); its body runs when called, not when this value is created.
- [L98](#l98) <code>pending</code>: create an array from <code>[""]</code>; spread elements insert the iterable values.
- [L100](#l100) <code>directory</code>: call the named operation with the supplied arguments: <code>pending.pop()</code>; the TypeScript assertion adds no runtime validation.
- [L101](#l101) <code>entries</code>: leave the value undefined until a later assignment.
- [L110](#l110) <code>entry</code>: receive the next iterable value from <code>entries</code> at the start of each loop iteration.
- [L111](#l111) <code>path</code>: test <code>directory</code>; choose <code>&#96;${directory}/${entry.name}&#96;</code> when truthy, otherwise <code>entry.name</code>.
- [L112](#l112) <code>ignored</code>: wait for <code>policy.reason(path,entry.isDirectory())</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L121](#l121) <code>reference</code>: receive the next iterable value from <code>profile.packageReferences</code> at the start of each loop iteration.

Execution:

- [L18](#l18) Bind <code>{ exclude,respectGitignore }</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L19](#l19) Bind <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L20](#l20) Bind <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,{exclude,respectGitignore})</code>.
- [L21](#l21) Bind <code>profile: RepositoryProfile</code>: create an object with 13 property/spread entries: <code>{ root, directories: [], excluded: exclude, packageReferences: [], files: [], languages: {}, manifests: [], readmes: [], tests: [], packageScripts: [], packageIssues: [], markers: [], warnings: [], }</code>; later properties overwrite earlier spread values.
- [L25](#l25) Bind <code>warn</code>: create [warn (25:16)](#fn-1355); its body runs when called, not when this value is created.
- [L29](#l29) Declare helper [inspectFile (29:3)](#fn-1505); it captures this lexical environment.
- [L98](#l98) Bind <code>pending</code>: create an array from <code>[""]</code>; spread elements insert the iterable values.
- [L99](#l99) Repeat while <code>pending.length &gt; 0</code>:
  - [L100](#l100) Bind <code>directory</code>: call the named operation with the supplied arguments: <code>pending.pop()</code>; the TypeScript assertion adds no runtime validation.
  - [L101](#l101) Bind <code>entries</code>: leave the value undefined until a later assignment.
  - [L102](#l102) Run the protected block:
    - [L103](#l103) update <code>entries</code> with <code>await fs.readdir(join(root, directory), { withFileTypes: true })</code> using <code>=</code>; this mutation is visible to later statements.
  - [L102](#l102) If it throws, bind <code>error</code>:
    - [L105](#l105) If <code>directory === ""</code> is truthy:
      - [L105](#l105) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
    - [L106](#l106) call the named operation with the supplied arguments: <code>warn(directory, "unreadable-directory", "Could not enumerate directory.")</code>.
    - [L107](#l107) Skip the rest of this iteration and advance the enclosing loop.
  - [L109](#l109) sort the receiver array in place using the comparator: <code>entries.sort((a, b) =&gt; compare(a.name, b.name))</code>.
  - [L110](#l110) Iterate <code>entries</code> values, binding <code>const entry</code> for each iteration:
    - [L111](#l111) Bind <code>path</code>: test <code>directory</code>; choose <code>&#96;${directory}/${entry.name}&#96;</code> when truthy, otherwise <code>entry.name</code>.
    - [L112](#l112) Bind <code>ignored</code>: wait for <code>policy.reason(path,entry.isDirectory())</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L113](#l113) If <code>ignored</code> is truthy:
      - [L113](#l113) call the named operation with the supplied arguments: <code>policy.record(path,entry.isDirectory()?'directory':entry.isFile()?'file':'other',ignored)</code>.
      - [L113](#l113) Skip the rest of this iteration and advance the enclosing loop.
    - [L114](#l114) If <code>entry.isSymbolicLink()</code> is truthy:
      - [L114](#l114) call the named operation with the supplied arguments: <code>warn(path, "symlink-skipped", "Symbolic links are not followed.")</code>.
    - [L114](#l114) Otherwise:
      - [L115](#l115) If <code>entry.isDirectory()</code> is truthy:
        - [L115](#l115) append values to the existing array: <code>profile.directories.push(path)</code>.
        - [L115](#l115) append values to the existing array: <code>pending.push(path)</code>.
      - [L115](#l115) Otherwise:
        - [L116](#l116) If <code>entry.isFile()</code> is truthy:
          - [L116](#l116) wait for <code>inspectFile(path)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
        - [L116](#l116) Otherwise:
          - [L117](#l117) call the named operation with the supplied arguments: <code>warn(path, "special-file-skipped", "Only regular files and directories are inspected.")</code>.
- [L121](#l121) Iterate <code>profile.packageReferences</code> values, binding <code>const reference</code> for each iteration:
  - [L122](#l122) update <code>reference.existence</code> with <code>await referenceExistence(root, reference, exclude,policy)</code> using <code>=</code>; this mutation is visible to later statements.
- [L124](#l124) sort the receiver array in place using the comparator: <code>profile.files.sort((a, b) =&gt; compare(a.path, b.path))</code>.
- [L125](#l125) sort the receiver array in place using the comparator: <code>profile.directories.sort(compare)</code>.
- [L126](#l126) sort the receiver array in place using the comparator: <code>profile.packageReferences.sort((a, b) =&gt; compare(a.path, b.path) &#124;&#124; compare(a.field, b.field))</code>.
- [L127](#l127) sort the receiver array in place using the comparator: <code>profile.manifests.sort((a, b) =&gt; compare(a.path, b.path))</code>.
- [L128](#l128) sort the receiver array in place using the comparator: <code>profile.readmes.sort(compare)</code>.
- [L129](#l129) sort the receiver array in place using the comparator: <code>profile.tests.sort(compare)</code>.
- [L130](#l130) sort the receiver array in place using the comparator: <code>profile.packageScripts.sort((a, b) =&gt; compare(a.path, b.path))</code>.
- [L131](#l131) sort the receiver array in place using the comparator: <code>profile.packageIssues.sort((a, b) =&gt; compare(a.path, b.path) &#124;&#124; compare(a.code, b.code))</code>.
- [L132](#l132) sort the receiver array in place using the comparator: <code>profile.markers.sort((a, b) =&gt; compare(a.path, b.path) &#124;&#124; a.line - b.line)</code>.
- [L133](#l133) sort the receiver array in place using the comparator: <code>profile.warnings.sort((a, b) =&gt; compare(a.path, b.path) &#124;&#124; compare(a.code, b.code))</code>.
- [L134](#l134) update <code>profile.languages</code> with <code>Object.fromEntries(Object.entries(profile.languages).sort(([a], [b]) =&gt; compare(a, b)))</code> using <code>=</code>; this mutation is visible to later statements.
- [L135](#l135) update <code>profile.ignorePolicy</code> with <code>policy.describe()</code> using <code>=</code>; this mutation is visible to later statements.
- [L136](#l136) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>repositoryProfileSchema.parse(profile)</code>.

<a id="fn-1355"></a>
### warn (25:16)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>code: RepositoryProfile["warnings"][number]["code"]</code>: supplied by the caller; usage is shown in the steps below.
- <code>message: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L26](#l26) append values to the existing array: <code>profile.warnings.push({ path, code, message })</code>.

<a id="fn-1505"></a>
### inspectFile (29:3)

Asynchronous function: returns a Promise. Lexically inside [inspectRepository (17:8)](#fn-807). 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L30](#l30) <code>facts</code>: call the named operation with the supplied arguments: <code>classifyFile(path)</code>.
- [L37](#l37) <code>bytes: Buffer</code>: leave the value undefined until a later assignment.
- [L39](#l39) <code>handle</code>: wait for <code>fs.open(join(root, path), "r")</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L41](#l41) <code>stat</code>: wait for <code>handle.stat()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L51](#l51) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(MAX_FILE_BYTES + 1)</code>.
- [L52](#l52) <code>length</code>: use the literal <code>0</code>.
- [L54](#l54) <code>{ bytesRead }</code>: wait for <code>handle.read(buffer, length, buffer.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.
- [L71](#l71) <code>content: string</code>: leave the value undefined until a later assignment.
- [L82](#l82) <code>result</code>: call the named operation with the supplied arguments: <code>inspectPackage(path, content)</code>.

Execution:

- [L30](#l30) Bind <code>facts</code>: call the named operation with the supplied arguments: <code>classifyFile(path)</code>.
- [L31](#l31) append values to the existing array: <code>profile.files.push({ path, language: facts.language })</code>.
- [L32](#l32) If <code>facts.language</code> is truthy:
  - [L32](#l32) update <code>profile.languages[facts.language]</code> with <code>(profile.languages[facts.language] ?? 0) + 1</code> using <code>=</code>; this mutation is visible to later statements.
- [L33](#l33) If <code>facts.ecosystem</code> is truthy:
  - [L33](#l33) append values to the existing array: <code>profile.manifests.push({ path, ecosystem: facts.ecosystem })</code>.
- [L34](#l34) If <code>facts.isReadme</code> is truthy:
  - [L34](#l34) append values to the existing array: <code>profile.readmes.push(path)</code>.
- [L35](#l35) If <code>facts.isTest</code> is truthy:
  - [L35](#l35) append values to the existing array: <code>profile.tests.push(path)</code>.
- [L37](#l37) Bind <code>bytes: Buffer</code>: leave the value undefined until a later assignment.
- [L38](#l38) Run the protected block:
  - [L39](#l39) Bind <code>handle</code>: wait for <code>fs.open(join(root, path), "r")</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L40](#l40) Run the protected block:
    - [L41](#l41) Bind <code>stat</code>: wait for <code>handle.stat()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L42](#l42) If <code>!stat.isFile()</code> is truthy:
      - [L43](#l43) call the named operation with the supplied arguments: <code>warn(path, "special-file-skipped", "Entry is no longer a regular file.")</code>.
      - [L44](#l44) Return undefined immediately; remaining statements in this function do not execute.
    - [L46](#l46) If <code>stat.size &gt; MAX_FILE_BYTES</code> is truthy:
      - [L47](#l47) call the named operation with the supplied arguments: <code>warn(path, "file-too-large", &#96;Content exceeds the ${MAX_FILE_BYTES}-byte read limit.&#96;)</code>.
      - [L48](#l48) Return undefined immediately; remaining statements in this function do not execute.
    - [L51](#l51) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(MAX_FILE_BYTES + 1)</code>.
    - [L52](#l52) Bind <code>length</code>: use the literal <code>0</code>.
    - [L53](#l53) Repeat while <code>length &lt; buffer.length</code>:
      - [L54](#l54) Bind <code>{ bytesRead }</code>: wait for <code>handle.read(buffer, length, buffer.length - length, null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.
      - [L55](#l55) If <code>bytesRead === 0</code> is truthy:
        - [L55](#l55) Leave the enclosing loop/switch.
      - [L56](#l56) update <code>length</code> with <code>bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L58](#l58) If <code>length &gt; MAX_FILE_BYTES</code> is truthy:
      - [L59](#l59) call the named operation with the supplied arguments: <code>warn(path, "file-too-large", &#96;Content exceeds the ${MAX_FILE_BYTES}-byte read limit.&#96;)</code>.
      - [L60](#l60) Return undefined immediately; remaining statements in this function do not execute.
    - [L62](#l62) update <code>bytes</code> with <code>buffer.subarray(0, length)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L40](#l40) Always run cleanup on leaving the try/catch, including return or throw:
    - [L64](#l64) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L38](#l38) If it throws:
  - [L67](#l67) call the named operation with the supplied arguments: <code>warn(path, "unreadable-file", "Could not read file content.")</code>.
  - [L68](#l68) Return undefined immediately; remaining statements in this function do not execute.
- [L71](#l71) Bind <code>content: string</code>: leave the value undefined until a later assignment.
- [L72](#l72) Run the protected block:
  - [L73](#l73) If <code>bytes.includes(0)</code> is truthy:
    - [L73](#l73) Throw <code>new Error("NUL byte")</code>; normal execution stops until an enclosing catch handles it.
  - [L74](#l74) update <code>content</code> with <code>new TextDecoder("utf-8", { fatal: true }).decode(bytes)</code> using <code>=</code>; this mutation is visible to later statements.
- [L72](#l72) If it throws:
  - [L76](#l76) call the named operation with the supplied arguments: <code>warn(path, "non-text-file", "Content is binary or not valid UTF-8; content inspection skipped.")</code>.
  - [L77](#l77) Return undefined immediately; remaining statements in this function do not execute.
- [L80](#l80) If <code>path.split("/").at(-1) === "package.json"</code> is truthy:
  - [L81](#l81) append values to the existing array: <code>profile.packageReferences.push(...packageReferences(path, content))</code>.
  - [L82](#l82) Bind <code>result</code>: call the named operation with the supplied arguments: <code>inspectPackage(path, content)</code>.
  - [L83](#l83) If <code>result.issue</code> is truthy:
    - [L84](#l84) append values to the existing array: <code>profile.packageIssues.push(result.issue)</code>.
    - [L85](#l85) call the named operation with the supplied arguments: <code>warn(path, "invalid-manifest", "package.json must be a JSON object with optional string-valued scripts.")</code>.
  - [L83](#l83) Otherwise:
    - [L87](#l87) append values to the existing array: <code>profile.packageScripts.push({ path, scripts: result.scripts })</code>.
- [L90](#l90) call the named operation with the supplied arguments: <code>content.split(/\r\n&#124;\n&#124;\r/).forEach((excerpt, index) =&gt; { for (const match of excerpt.matchAll(/\b(TODO&#124;FIXME)\b/g)) { profile.markers.push({ path, line: index + 1, kind: match[0] as "TODO" &#124; "FIXME", excerpt }); } })</code>.

<a id="fn-3964"></a>
### content.split(/\r\n&#124;\n&#124;\r/).forEach callback (90:41)

Synchronous function. Lexically inside [inspectFile (29:3)](#fn-1505). Passed to <code>content.split(/\r\n&#124;\n&#124;\r/).forEach</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>excerpt</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L91](#l91) <code>match</code>: receive the next iterable value from <code>excerpt.matchAll(/\b(TODO&#124;FIXME)\b/g)</code> at the start of each loop iteration.

Execution:

- [L91](#l91) Iterate <code>excerpt.matchAll(/\b(TODO&#124;FIXME)\b/g)</code> values, binding <code>const match</code> for each iteration:
  - [L92](#l92) append values to the existing array: <code>profile.markers.push({ path, line: index + 1, kind: match[0] as "TODO" &#124; "FIXME", excerpt })</code>.

<a id="fn-4643"></a>
### entries.sort callback (109:18)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>entries.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L109](#l109) Implicitly return: call the named operation with the supplied arguments: <code>compare(a.name, b.name)</code>.

<a id="fn-5499"></a>
### profile.files.sort callback (124:22)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.files.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L124](#l124) Implicitly return: call the named operation with the supplied arguments: <code>compare(a.path, b.path)</code>.

<a id="fn-5605"></a>
### profile.packageReferences.sort callback (126:34)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.packageReferences.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L126](#l126) Implicitly return: evaluate <code>compare(a.path, b.path) &#124;&#124; compare(a.field, b.field)</code> left to right with truthy short-circuiting.

<a id="fn-5695"></a>
### profile.manifests.sort callback (127:26)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.manifests.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L127](#l127) Implicitly return: call the named operation with the supplied arguments: <code>compare(a.path, b.path)</code>.

<a id="fn-5825"></a>
### profile.packageScripts.sort callback (130:31)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.packageScripts.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L130](#l130) Implicitly return: call the named operation with the supplied arguments: <code>compare(a.path, b.path)</code>.

<a id="fn-5890"></a>
### profile.packageIssues.sort callback (131:30)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.packageIssues.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L131](#l131) Implicitly return: evaluate <code>compare(a.path, b.path) &#124;&#124; compare(a.code, b.code)</code> left to right with truthy short-circuiting.

<a id="fn-5976"></a>
### profile.markers.sort callback (132:24)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.markers.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L132](#l132) Implicitly return: evaluate <code>compare(a.path, b.path) &#124;&#124; a.line - b.line</code> left to right with truthy short-circuiting.

<a id="fn-6055"></a>
### profile.warnings.sort callback (133:25)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>profile.warnings.sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L133](#l133) Implicitly return: evaluate <code>compare(a.path, b.path) &#124;&#124; compare(a.code, b.code)</code> left to right with truthy short-circuiting.

<a id="fn-6198"></a>
### Object.entries(profile.languages).sort callback (134:81)

Synchronous function. Lexically inside [inspectRepository (17:8)](#fn-807). Passed to <code>Object.entries(profile.languages).sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>[a]</code>: destructure the supplied value into these local bindings.
- <code>[b]</code>: destructure the supplied value into these local bindings.

Execution:

[L134](#l134) Implicitly return: call the named operation with the supplied arguments: <code>compare(a, b)</code>.

## Module bindings

- [L14](#l14) <code>compare</code>: create [compare (14:17)](#fn-661); its body runs when called, not when this value is created.

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
<a id="l10"></a>
<a id="l12"></a>
<a id="l14"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {createIgnorePolicy,type IgnoreOptions} from './ignore-policy.js';
   2 | import fs from "node:fs/promises";
   3 | import { join } from "node:path";
   4 | import { MAX_FILE_BYTES, validateRoot } from "./filesystem-policy.js";
   5 | import { referenceExistence } from "./reference-existence.js";
   6 | import { classifyFile } from "./classify.js";
   7 | import { inspectPackage } from "./inspect-package.js";
   8 | import { packageReferences } from "./package-references.js";
   9 | import { configSchema, isExcluded } from "./config.js";
  10 | import { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
  11 | 
  12 | export { MAX_FILE_BYTES } from "./filesystem-policy.js";
  13 | 
  14 | const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
  15 | 
  16 | /** Read local repository facts. Never executes scripts or writes to the target. */
  17 | export async function inspectRepository(target = ".", options: IgnoreOptions = {}): Promise<RepositoryProfile> {
  18 |   const { exclude,respectGitignore } = configSchema.parse(options);
  19 |   const root = await validateRoot(target);
  20 |   const policy=createIgnorePolicy(root,{exclude,respectGitignore});
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
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
  21 |   const profile: RepositoryProfile = {
  22 |     root, directories: [], excluded: exclude, packageReferences: [], files: [], languages: {}, manifests: [], readmes: [], tests: [],
  23 |     packageScripts: [], packageIssues: [], markers: [], warnings: [],
  24 |   };
  25 |   const warn = (path: string, code: RepositoryProfile["warnings"][number]["code"], message: string) => {
  26 |     profile.warnings.push({ path, code, message });
  27 |   };
  28 | 
  29 |   async function inspectFile(path: string): Promise<void> {
  30 |     const facts = classifyFile(path);
  31 |     profile.files.push({ path, language: facts.language });
  32 |     if (facts.language) profile.languages[facts.language] = (profile.languages[facts.language] ?? 0) + 1;
  33 |     if (facts.ecosystem) profile.manifests.push({ path, ecosystem: facts.ecosystem });
  34 |     if (facts.isReadme) profile.readmes.push(path);
  35 |     if (facts.isTest) profile.tests.push(path);
  36 | 
  37 |     let bytes: Buffer;
  38 |     try {
  39 |       const handle = await fs.open(join(root, path), "r");
  40 |       try {
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |         const stat = await handle.stat();
  42 |         if (!stat.isFile()) {
  43 |           warn(path, "special-file-skipped", "Entry is no longer a regular file.");
  44 |           return;
  45 |         }
  46 |         if (stat.size > MAX_FILE_BYTES) {
  47 |           warn(path, "file-too-large", `Content exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
  48 |           return;
  49 |         }
  50 |         // Read at most limit + 1 even if a file grows after stat().
  51 |         const buffer = Buffer.alloc(MAX_FILE_BYTES + 1);
  52 |         let length = 0;
  53 |         while (length < buffer.length) {
  54 |           const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
  55 |           if (bytesRead === 0) break;
  56 |           length += bytesRead;
  57 |         }
  58 |         if (length > MAX_FILE_BYTES) {
  59 |           warn(path, "file-too-large", `Content exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
  60 |           return;
```

<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l80"></a>

```text
  61 |         }
  62 |         bytes = buffer.subarray(0, length);
  63 |       } finally {
  64 |         await handle.close();
  65 |       }
  66 |     } catch {
  67 |       warn(path, "unreadable-file", "Could not read file content.");
  68 |       return;
  69 |     }
  70 | 
  71 |     let content: string;
  72 |     try {
  73 |       if (bytes.includes(0)) throw new Error("NUL byte");
  74 |       content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  75 |     } catch {
  76 |       warn(path, "non-text-file", "Content is binary or not valid UTF-8; content inspection skipped.");
  77 |       return;
  78 |     }
  79 | 
  80 |     if (path.split("/").at(-1) === "package.json") {
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
<a id="l86"></a>
<a id="l87"></a>
<a id="l90"></a>
<a id="l91"></a>
<a id="l92"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 |       profile.packageReferences.push(...packageReferences(path, content));
  82 |       const result = inspectPackage(path, content);
  83 |       if (result.issue) {
  84 |         profile.packageIssues.push(result.issue);
  85 |         warn(path, "invalid-manifest", "package.json must be a JSON object with optional string-valued scripts.");
  86 |       } else {
  87 |         profile.packageScripts.push({ path, scripts: result.scripts });
  88 |       }
  89 |     }
  90 |     content.split(/\r\n|\n|\r/).forEach((excerpt, index) => {
  91 |       for (const match of excerpt.matchAll(/\b(TODO|FIXME)\b/g)) {
  92 |         profile.markers.push({ path, line: index + 1, kind: match[0] as "TODO" | "FIXME", excerpt });
  93 |       }
  94 |     });
  95 |   }
  96 | 
  97 |   // Iterative traversal avoids exhausting the call stack on deeply nested trees.
  98 |   const pending = [""];
  99 |   while (pending.length > 0) {
 100 |     const directory = pending.pop()!;
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l111"></a>
<a id="l112"></a>
<a id="l113"></a>
<a id="l114"></a>
<a id="l115"></a>
<a id="l116"></a>
<a id="l117"></a>

```text
 101 |     let entries;
 102 |     try {
 103 |       entries = await fs.readdir(join(root, directory), { withFileTypes: true });
 104 |     } catch (error) {
 105 |       if (directory === "") throw error;
 106 |       warn(directory, "unreadable-directory", "Could not enumerate directory.");
 107 |       continue;
 108 |     }
 109 |     entries.sort((a, b) => compare(a.name, b.name));
 110 |     for (const entry of entries) {
 111 |       const path = directory ? `${directory}/${entry.name}` : entry.name;
 112 |       const ignored=await policy.reason(path,entry.isDirectory());
 113 |       if(ignored){policy.record(path,entry.isDirectory()?'directory':entry.isFile()?'file':'other',ignored);continue;}
 114 |       if (entry.isSymbolicLink()) warn(path, "symlink-skipped", "Symbolic links are not followed.");
 115 |       else if (entry.isDirectory()) { profile.directories.push(path); pending.push(path); }
 116 |       else if (entry.isFile()) await inspectFile(path);
 117 |       else warn(path, "special-file-skipped", "Only regular files and directories are inspected.");
 118 |     }
 119 |   }
 120 | 
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>
<a id="l129"></a>
<a id="l130"></a>
<a id="l131"></a>
<a id="l132"></a>
<a id="l133"></a>
<a id="l134"></a>
<a id="l135"></a>
<a id="l136"></a>

```text
 121 |   for (const reference of profile.packageReferences) {
 122 |     reference.existence = await referenceExistence(root, reference, exclude,policy);
 123 |   }
 124 |   profile.files.sort((a, b) => compare(a.path, b.path));
 125 |   profile.directories.sort(compare);
 126 |   profile.packageReferences.sort((a, b) => compare(a.path, b.path) || compare(a.field, b.field));
 127 |   profile.manifests.sort((a, b) => compare(a.path, b.path));
 128 |   profile.readmes.sort(compare);
 129 |   profile.tests.sort(compare);
 130 |   profile.packageScripts.sort((a, b) => compare(a.path, b.path));
 131 |   profile.packageIssues.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code));
 132 |   profile.markers.sort((a, b) => compare(a.path, b.path) || a.line - b.line);
 133 |   profile.warnings.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code));
 134 |   profile.languages = Object.fromEntries(Object.entries(profile.languages).sort(([a], [b]) => compare(a, b)));
 135 |   profile.ignorePolicy=policy.describe();
 136 |   return repositoryProfileSchema.parse(profile);
 137 | }
 138 | 
```
