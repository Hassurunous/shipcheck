# src/additional-rules.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Sets of included files/directories support inexpensive existence tests. Lockfiles are grouped by their package directory and package manager. Missing-reference candidates require an explicit missing observation plus additional uncertainty guards. README/test policies are suppressed by incomplete traversal, while FIXME candidates require a src path, supported extension, non-test file and comment-start regex. createReport later applies whether each policy is enabled.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `4b13055fbd9e5b866b247103263a21639d111586e6cc786b712e4dd48cfa4ac9`.

This chapter inventories **13 function bodies/callbacks**, **16 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>posix</code>.
- <code>./config.js</code>: <code>isExcluded</code>, <code>Config</code> (type only).
- <code>./findings.js</code>: <code>Finding</code> (type only).
- <code>./repository-profile.js</code>: <code>RepositoryProfile</code> (type only).

## Module execution


## Function index

- [additionalFindings (6:8)](#fn-210)
- [profile.files.filter callback (9:46)](#fn-435)
- [profile.files.filter(f =&gt; !isExcluded(f.path, excluded)).map callback (9:86)](#fn-475)
- [add (11:15)](#fn-556)
- [Object.keys(lockManagers).map callback (23:49)](#fn-1337)
- [Object.keys(lockManagers).map(name =&gt; posix.join(directory, name)).filter callback (23:93)](#fn-1381)
- [locks.map callback (24:27)](#fn-1440)
- [locks.map callback (28:51)](#fn-1866)
- [target.split("/").some callback (39:32)](#fn-2536)
- [profile.warnings.some callback (41:31)](#fn-2725)
- [profile.warnings.some callback (53:44)](#fn-3681)
- [profile.readmes.some callback (54:44)](#fn-3816)
- [profile.tests.some callback (59:42)](#fn-4144)

<a id="fn-210"></a>
### additionalFindings (6:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>profile: RepositoryProfile</code>: supplied by the caller; usage is shown in the steps below.
- <code>config: Config</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L7](#l7) <code>findings: Finding[]</code>: create a new empty array to accumulate ordered results.
- [L8](#l8) <code>excluded</code>: create an array from <code>[...profile.excluded, ...config.exclude]</code>; spread elements insert the iterable values.
- [L9](#l9) <code>files</code>: construct <code>Set</code> using <code>profile.files.filter(f =&gt; !isExcluded(f.path, excluded)).map(f =&gt; f.path)</code>; this creates the local instance used below.
- [L10](#l10) <code>directories</code>: construct <code>Set</code> using <code>profile.directories</code>; this creates the local instance used below.
- [L11](#l11) <code>add</code>: create [add (11:15)](#fn-556); its body runs when called, not when this value is created.
- [L16](#l16) <code>lockManagers: Record&lt;string, string&gt;</code>: create an object with 6 property/spread entries: <code>{ "package-lock.json": "npm", "npm-shrinkwrap.json": "npm", "yarn.lock": "Yarn", "pnpm-lock.yaml": "pnpm", "bun.lock": "Bun", "bun.lockb": "Bun", }</code>; later properties overwrite earlier spread values.
- [L20](#l20) <code>manifest</code>: receive the next iterable value from <code>profile.manifests</code> at the start of each loop iteration.
- [L22](#l22) <code>directory</code>: call the named operation with the supplied arguments: <code>posix.dirname(manifest.path)</code>.
- [L23](#l23) <code>locks</code>: sort the receiver array in place using the comparator: <code>Object.keys(lockManagers).map(name =&gt; posix.join(directory, name)).filter(path =&gt; files.has(path)).sort()</code>.
- [L32](#l32) <code>reference</code>: receive the next iterable value from <code>profile.packageReferences</code> at the start of each loop iteration.
- [L37](#l37) <code>target</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(reference.path), reference.target))</code>.
- [L44](#l44) <code>ruleId</code>: test <code>reference.kind === "dependency"</code>; choose <code>"package/missing-local-dependency"</code> when truthy, otherwise <code>reference.kind === "script" ? "package/missing-script-target" : "package/missing-entry-point"</code>.
- [L53](#l53) <code>incomplete</code>: stop at the first truthy callback result, returning whether any matched: <code>profile.warnings.some(w =&gt; ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code))</code>.
- [L64](#l64) <code>seen</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L65](#l65) <code>marker</code>: receive the next iterable value from <code>profile.markers</code> at the start of each loop iteration.
- [L69](#l69) <code>key</code>: use the literal <code>&#96;${marker.path}:${marker.line}&#96;</code>.

Execution:

- [L7](#l7) Bind <code>findings: Finding[]</code>: create a new empty array to accumulate ordered results.
- [L8](#l8) Bind <code>excluded</code>: create an array from <code>[...profile.excluded, ...config.exclude]</code>; spread elements insert the iterable values.
- [L9](#l9) Bind <code>files</code>: construct <code>Set</code> using <code>profile.files.filter(f =&gt; !isExcluded(f.path, excluded)).map(f =&gt; f.path)</code>; this creates the local instance used below.
- [L10](#l10) Bind <code>directories</code>: construct <code>Set</code> using <code>profile.directories</code>; this creates the local instance used below.
- [L11](#l11) Bind <code>add</code>: create [add (11:15)](#fn-556); its body runs when called, not when this value is created.
- [L16](#l16) Bind <code>lockManagers: Record&lt;string, string&gt;</code>: create an object with 6 property/spread entries: <code>{ "package-lock.json": "npm", "npm-shrinkwrap.json": "npm", "yarn.lock": "Yarn", "pnpm-lock.yaml": "pnpm", "bun.lock": "Bun", "bun.lockb": "Bun", }</code>; later properties overwrite earlier spread values.
- [L20](#l20) Iterate <code>profile.manifests</code> values, binding <code>const manifest</code> for each iteration:
  - [L21](#l21) If <code>posix.basename(manifest.path) !== "package.json" &#124;&#124; !files.has(manifest.path)</code> is truthy:
    - [L21](#l21) Skip the rest of this iteration and advance the enclosing loop.
  - [L22](#l22) Bind <code>directory</code>: call the named operation with the supplied arguments: <code>posix.dirname(manifest.path)</code>.
  - [L23](#l23) Bind <code>locks</code>: sort the receiver array in place using the comparator: <code>Object.keys(lockManagers).map(name =&gt; posix.join(directory, name)).filter(path =&gt; files.has(path)).sort()</code>.
  - [L24](#l24) If <code>new Set(locks.map(path =&gt; lockManagers[posix.basename(path)])).size &gt; 1</code> is truthy:
    - [L25](#l25) call the named operation with the supplied arguments: <code>add("package/conflicting-lockfiles", manifest.path, "Multiple package managers have lockfiles", &#96;Lockfiles from different package managers exist in this package directory: ${locks.join(", ")}.&#96;, "Choose the intended package manager, or suppress this rule if…</code>.
    - [L28](#l28) append values to the existing array: <code>findings.at(-1)!.evidence.push(...locks.map(path =&gt; ({ path, observation: "Lockfile exists in the package directory." })))</code>.
- [L32](#l32) Iterate <code>profile.packageReferences</code> values, binding <code>const reference</code> for each iteration:
  - [L33](#l33) If <code>reference.existence !== "missing"</code> is truthy:
    - [L33](#l33) Skip the rest of this iteration and advance the enclosing loop.
  - [L34](#l34) If <code>!files.has(reference.path)</code> is truthy:
    - [L34](#l34) Skip the rest of this iteration and advance the enclosing loop.
  - [L36](#l36) If <code>!reference.target &#124;&#124; /[:\\%$*?{}~]/.test(reference.target) &#124;&#124; posix.isAbsolute(reference.target)</code> is truthy:
    - [L36](#l36) Skip the rest of this iteration and advance the enclosing loop.
  - [L37](#l37) Bind <code>target</code>: call the named operation with the supplied arguments: <code>posix.normalize(posix.join(posix.dirname(reference.path), reference.target))</code>.
  - [L38](#l38) If <code>target === ".." &#124;&#124; target.startsWith("../") &#124;&#124; target === "."</code> is truthy:
    - [L38](#l38) Skip the rest of this iteration and advance the enclosing loop.
  - [L39](#l39) If <code>target.split("/").some(part =&gt; part === ".git" &#124;&#124; part === "node_modules")</code> is truthy:
    - [L39](#l39) Skip the rest of this iteration and advance the enclosing loop.
  - [L40](#l40) If <code>isExcluded(target, excluded) &#124;&#124; files.has(target) &#124;&#124; directories.has(target)</code> is truthy:
    - [L40](#l40) Skip the rest of this iteration and advance the enclosing loop.
  - [L41](#l41) If <code>profile.warnings.some(w =&gt; ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code) &amp;&amp; (target === w.path &#124;&#124; target.startsWith(&#96;${w.path}/&#96;)))</code> is truthy:
    - [L42](#l42) Skip the rest of this iteration and advance the enclosing loop.
  - [L43](#l43) If <code>reference.kind === "entry" &amp;&amp; !reference.field.startsWith("bin") &amp;&amp; !posix.extname(target)</code> is truthy:
    - [L43](#l43) Skip the rest of this iteration and advance the enclosing loop.
  - [L44](#l44) Bind <code>ruleId</code>: test <code>reference.kind === "dependency"</code>; choose <code>"package/missing-local-dependency"</code> when truthy, otherwise <code>reference.kind === "script" ? "package/missing-script-target" : "package/missing-entry-point"</code>.
  - [L46](#l46) call the named operation with the supplied arguments: <code>add(ruleId, reference.path, "Declared local target was not found", &#96;${reference.field} references ${reference.target}; no file or directory was found at ${target}.&#96;, reference.kind === "entry" ? "Build the package first if this file is generated, or correct…</code>.
- [L53](#l53) Bind <code>incomplete</code>: stop at the first truthy callback result, returning whether any matched: <code>profile.warnings.some(w =&gt; ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code))</code>.
- [L54](#l54) If <code>!incomplete &amp;&amp; !profile.readmes.some(path =&gt; files.has(path))</code> is truthy:
  - [L55](#l55) call the named operation with the supplied arguments: <code>add("repository/missing-readme", ".", "No README detected in inspected files", "No included filename matched the README conventions. Excluded paths were not checked.", "Add a README if repository documentation is required by your team.")</code>.
- [L59](#l59) If <code>!incomplete &amp;&amp; !profile.tests.some(path =&gt; files.has(path))</code> is truthy:
  - [L60](#l60) call the named operation with the supplied arguments: <code>add("repository/missing-tests", ".", "No test files detected in inspected files", "No included files matched Shipcheck's test filename conventions. This does not establish that tests are absent.", "Check the project's test conventions before deciding whethe…</code>.
- [L64](#l64) Bind <code>seen</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L65](#l65) Iterate <code>profile.markers</code> values, binding <code>const marker</code> for each iteration:
  - [L66](#l66) If <code>marker.kind !== "FIXME" &#124;&#124; !marker.path.startsWith("src/") &#124;&#124; !/\.(?:[cm]?[jt]sx?&#124;py&#124;go&#124;rs&#124;java&#124;cs&#124;cpp&#124;c)$/.test(marker.path) &#124;&#124; !files.has(marker.path) &#124;&#124; profile.tests.includes(marker.path)</code> is truthy:
    - [L67](#l67) Skip the rest of this iteration and advance the enclosing loop.
  - [L68](#l68) If <code>!/^\s*(?:\/\/&#124;#&#124;\/\*&#124;\*)\s*FIXME\b/.test(marker.excerpt)</code> is truthy:
    - [L68](#l68) Skip the rest of this iteration and advance the enclosing loop.
  - [L69](#l69) Bind <code>key</code>: use the literal <code>&#96;${marker.path}:${marker.line}&#96;</code>.
  - [L70](#l70) If <code>seen.has(key)</code> is truthy:
    - [L70](#l70) Skip the rest of this iteration and advance the enclosing loop.
  - [L71](#l71) insert a unique value in the Set: <code>seen.add(key)</code>.
  - [L72](#l72) call the named operation with the supplied arguments: <code>add("source/fixme", marker.path, "FIXME comment matches configured source policy", &#96;Line ${marker.line} begins with a FIXME comment marker.&#96;, "Review the comment and resolve it or document an intentional exception.", String(marker.line))</code>.
  - [L75](#l75) update <code>findings.at(-1)!.evidence[0]</code> with <code>{ path: marker.path, observation: "FIXME comment marker detected.", line: marker.line, excerpt: marker.excerpt }</code> using <code>=</code>; this mutation is visible to later statements.
- [L77](#l77) Return to the caller: evaluate <code>findings</code>.

<a id="fn-435"></a>
### profile.files.filter callback (9:46)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.files.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: apply <code>!</code> to <code>isExcluded(f.path, excluded)</code>.

<a id="fn-475"></a>
### profile.files.filter(f =&gt; !isExcluded(f.path, excluded)).map callback (9:86)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.files.filter(f =&gt; !isExcluded(f.path, excluded)).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: read <code>f.path</code>.

<a id="fn-556"></a>
### add (11:15)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). 

Parameters:

- <code>ruleId: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>title: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>observation: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>action: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>key = ""</code>: when omitted/undefined, initialize with <code>""</code>.

Execution:

- [L12](#l12) append values to the existing array: <code>findings.push({ id: &#96;${ruleId}:${encodeURIComponent(path)}:${encodeURIComponent(key)}&#96;, ruleId, severity: "warning", title, explanation: observation, evidence: [{ path, observation }], suggestedAction: action })</code>.

<a id="fn-1337"></a>
### Object.keys(lockManagers).map callback (23:49)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>Object.keys(lockManagers).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>name</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L23](#l23) Implicitly return: concatenate the elements with the supplied separator: <code>posix.join(directory, name)</code>.

<a id="fn-1381"></a>
### Object.keys(lockManagers).map(name =&gt; posix.join(directory, name)).filter callback (23:93)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>Object.keys(lockManagers).map(name =&gt; posix.join(directory, name)).filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L23](#l23) Implicitly return: test membership without changing the collection: <code>files.has(path)</code>.

<a id="fn-1440"></a>
### locks.map callback (24:27)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>locks.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L24](#l24) Implicitly return: read <code>lockManagers[posix.basename(path)]</code>.

<a id="fn-1866"></a>
### locks.map callback (28:51)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>locks.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: create an object with 2 property/spread entries: <code>{ path, observation: "Lockfile exists in the package directory." }</code>; later properties overwrite earlier spread values.

<a id="fn-2536"></a>
### target.split("/").some callback (39:32)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>target.split("/").some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L39](#l39) Implicitly return: evaluate <code>part === ".git" &#124;&#124; part === "node_modules"</code> left to right with truthy short-circuiting.

<a id="fn-2725"></a>
### profile.warnings.some callback (41:31)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.warnings.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>w</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L41](#l41) Implicitly return: evaluate <code>["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code) &amp;&amp; (target === w.path &#124;&#124; target.startsWith(&#96;${w.path}/&#96;))</code> left to right with falsy short-circuiting.

<a id="fn-3681"></a>
### profile.warnings.some callback (53:44)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.warnings.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>w</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L53](#l53) Implicitly return: call the named operation with the supplied arguments: <code>["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code)</code>.

<a id="fn-3816"></a>
### profile.readmes.some callback (54:44)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.readmes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L54](#l54) Implicitly return: test membership without changing the collection: <code>files.has(path)</code>.

<a id="fn-4144"></a>
### profile.tests.some callback (59:42)

Synchronous function. Lexically inside [additionalFindings (6:8)](#fn-210). Passed to <code>profile.tests.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L59](#l59) Implicitly return: test membership without changing the collection: <code>files.has(path)</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l20"></a>

```text
   1 | import { posix } from "node:path";
   2 | import { isExcluded, type Config } from "./config.js";
   3 | import type { Finding } from "./findings.js";
   4 | import type { RepositoryProfile } from "./repository-profile.js";
   5 | 
   6 | export function additionalFindings(profile: RepositoryProfile, config: Config): Finding[] {
   7 |   const findings: Finding[] = [];
   8 |   const excluded = [...profile.excluded, ...config.exclude];
   9 |   const files = new Set(profile.files.filter(f => !isExcluded(f.path, excluded)).map(f => f.path));
  10 |   const directories = new Set(profile.directories);
  11 |   const add = (ruleId: string, path: string, title: string, observation: string, action: string, key = "") => {
  12 |     findings.push({ id: `${ruleId}:${encodeURIComponent(path)}:${encodeURIComponent(key)}`,
  13 |       ruleId, severity: "warning", title, explanation: observation,
  14 |       evidence: [{ path, observation }], suggestedAction: action });
  15 |   };
  16 |   const lockManagers: Record<string, string> = {
  17 |     "package-lock.json": "npm", "npm-shrinkwrap.json": "npm", "yarn.lock": "Yarn",
  18 |     "pnpm-lock.yaml": "pnpm", "bun.lock": "Bun", "bun.lockb": "Bun",
  19 |   };
  20 |   for (const manifest of profile.manifests) {
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     if (posix.basename(manifest.path) !== "package.json" || !files.has(manifest.path)) continue;
  22 |     const directory = posix.dirname(manifest.path);
  23 |     const locks = Object.keys(lockManagers).map(name => posix.join(directory, name)).filter(path => files.has(path)).sort();
  24 |     if (new Set(locks.map(path => lockManagers[posix.basename(path)])).size > 1) {
  25 |       add("package/conflicting-lockfiles", manifest.path, "Multiple package managers have lockfiles",
  26 |         `Lockfiles from different package managers exist in this package directory: ${locks.join(", ")}.`,
  27 |         "Choose the intended package manager, or suppress this rule if multiple lockfiles are intentional.");
  28 |       findings.at(-1)!.evidence.push(...locks.map(path => ({ path, observation: "Lockfile exists in the package directory." })));
  29 |     }
  30 |   }
  31 | 
  32 |   for (const reference of profile.packageReferences) {
  33 |     if (reference.existence !== "missing") continue;
  34 |     if (!files.has(reference.path)) continue;
  35 |     // Skip protocols, expansion, encoded paths, Windows paths and absolute/out-of-root references.
  36 |     if (!reference.target || /[:\\%$*?{}~]/.test(reference.target) || posix.isAbsolute(reference.target)) continue;
  37 |     const target = posix.normalize(posix.join(posix.dirname(reference.path), reference.target));
  38 |     if (target === ".." || target.startsWith("../") || target === ".") continue;
  39 |     if (target.split("/").some(part => part === ".git" || part === "node_modules")) continue;
  40 |     if (isExcluded(target, excluded) || files.has(target) || directories.has(target)) continue;
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
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     if (profile.warnings.some(w => ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code)
  42 |       && (target === w.path || target.startsWith(`${w.path}/`)))) continue;
  43 |     if (reference.kind === "entry" && !reference.field.startsWith("bin") && !posix.extname(target)) continue;
  44 |     const ruleId = reference.kind === "dependency" ? "package/missing-local-dependency"
  45 |       : reference.kind === "script" ? "package/missing-script-target" : "package/missing-entry-point";
  46 |     add(ruleId, reference.path, "Declared local target was not found",
  47 |       `${reference.field} references ${reference.target}; no file or directory was found at ${target}.`,
  48 |       reference.kind === "entry" ? "Build the package first if this file is generated, or correct the declaration."
  49 |         : "Restore the local target or correct the manifest reference. If generated, build first or configure an override.",
  50 |       reference.field);
  51 |   }
  52 | 
  53 |   const incomplete = profile.warnings.some(w => ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code));
  54 |   if (!incomplete && !profile.readmes.some(path => files.has(path))) {
  55 |     add("repository/missing-readme", ".", "No README detected in inspected files",
  56 |       "No included filename matched the README conventions. Excluded paths were not checked.",
  57 |       "Add a README if repository documentation is required by your team.");
  58 |   }
  59 |   if (!incomplete && !profile.tests.some(path => files.has(path))) {
  60 |     add("repository/missing-tests", ".", "No test files detected in inspected files",
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l77"></a>

```text
  61 |       "No included files matched Shipcheck's test filename conventions. This does not establish that tests are absent.",
  62 |       "Check the project's test conventions before deciding whether tests need to be added.");
  63 |   }
  64 |   const seen = new Set<string>();
  65 |   for (const marker of profile.markers) {
  66 |     if (marker.kind !== "FIXME" || !marker.path.startsWith("src/") || !/\.(?:[cm]?[jt]sx?|py|go|rs|java|cs|cpp|c)$/.test(marker.path)
  67 |       || !files.has(marker.path) || profile.tests.includes(marker.path)) continue;
  68 |     if (!/^\s*(?:\/\/|#|\/\*|\*)\s*FIXME\b/.test(marker.excerpt)) continue;
  69 |     const key = `${marker.path}:${marker.line}`;
  70 |     if (seen.has(key)) continue;
  71 |     seen.add(key);
  72 |     add("source/fixme", marker.path, "FIXME comment matches configured source policy",
  73 |       `Line ${marker.line} begins with a FIXME comment marker.`,
  74 |       "Review the comment and resolve it or document an intentional exception.", String(marker.line));
  75 |     findings.at(-1)!.evidence[0] = { path: marker.path, observation: "FIXME comment marker detected.", line: marker.line, excerpt: marker.excerpt };
  76 |   }
  77 |   return findings;
  78 | }
  79 | 
```
