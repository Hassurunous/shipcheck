# src/classify.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Classification is filename-only. Lowercased basename and extension feed lookup tables for language/ecosystem and regexes for README/test conventions. A test-like path counts only if its extension belongs to testExtensions. This permits inventory before content reads and explains why an unreadable file can still count as a test or manifest.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `0e0eb688da64de13c1207b28170bf729b19119d94e207f50ccd9a3352a417267`.

This chapter inventories **1 function bodies/callbacks**, **5 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>posix</code>.

## Module execution

- [L3](#l3) Bind <code>languages: Record&lt;string, string&gt;</code>: create an object with 35 property/spread entries: <code>{ ".ts": "TypeScript", ".tsx": "TypeScript", ".mts": "TypeScript", ".cts": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript", ".py": "Python", ".rs": "Rust", ".go": "Go", ".java": "Java", ".kt": "Kotlin", ".…</code>; later properties overwrite earlier spread values.
- [L14](#l14) Bind <code>manifests: Record&lt;string, string&gt;</code>: create an object with 13 property/spread entries: <code>{ "package.json": "Node.js", "pyproject.toml": "Python", "requirements.txt": "Python", "setup.py": "Python", "setup.cfg": "Python", "cargo.toml": "Rust", "go.mod": "Go", "pom.xml": "Java", "build.gradle": "JVM", "build.gradle.kts": "JVM", "gemfile": "Ruby",…</code>; later properties overwrite earlier spread values.
- [L21](#l21) Bind <code>testExtensions</code>: construct <code>Set</code> using <code>[ ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs", ".py", ".rs", ".go", ".java", ".kt", ".c", ".cpp", ".cs", ".rb", ".php", ".swift", ".sh", ".ps1", ]</code>; this creates the local instance used below.

## Function index

- [classifyFile (27:8)](#fn-1360)

<a id="fn-1360"></a>
### classifyFile (27:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L28](#l28) <code>name</code>: call the named operation with the supplied arguments: <code>posix.basename(path).toLowerCase()</code>.
- [L29](#l29) <code>extension</code>: call the named operation with the supplied arguments: <code>posix.extname(name)</code>.

Execution:

- [L28](#l28) Bind <code>name</code>: call the named operation with the supplied arguments: <code>posix.basename(path).toLowerCase()</code>.
- [L29](#l29) Bind <code>extension</code>: call the named operation with the supplied arguments: <code>posix.extname(name)</code>.
- [L30](#l30) Return to the caller: create an object with 4 property/spread entries: <code>{ language: languages[extension] ?? null, ecosystem: Object.hasOwn(manifests, name) ? manifests[name]! : [".csproj", ".fsproj", ".vbproj"].includes(extension) ? ".NET" : null, isReadme: /^readme(?:\..+)?$/i.test(name), isTest: testExtensions.has(extension) …</code>; later properties overwrite earlier spread values.

## Module bindings

- [L3](#l3) <code>languages: Record&lt;string, string&gt;</code>: create an object with 35 property/spread entries: <code>{ ".ts": "TypeScript", ".tsx": "TypeScript", ".mts": "TypeScript", ".cts": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript", ".py": "Python", ".rs": "Rust", ".go": "Go", ".java": "Java", ".kt": "Kotlin", ".…</code>; later properties overwrite earlier spread values.
- [L14](#l14) <code>manifests: Record&lt;string, string&gt;</code>: create an object with 13 property/spread entries: <code>{ "package.json": "Node.js", "pyproject.toml": "Python", "requirements.txt": "Python", "setup.py": "Python", "setup.cfg": "Python", "cargo.toml": "Rust", "go.mod": "Go", "pom.xml": "Java", "build.gradle": "JVM", "build.gradle.kts": "JVM", "gemfile": "Ruby",…</code>; later properties overwrite earlier spread values.
- [L21](#l21) <code>testExtensions</code>: construct <code>Set</code> using <code>[ ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs", ".py", ".rs", ".go", ".java", ".kt", ".c", ".cpp", ".cs", ".rb", ".php", ".swift", ".sh", ".ps1", ]</code>; this creates the local instance used below.

## Directly importing tests

- [repository.test.ts](../../test/repository.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>

```text
   1 | import { posix } from "node:path";
   2 | 
   3 | const languages: Record<string, string> = {
   4 |   ".ts": "TypeScript", ".tsx": "TypeScript", ".mts": "TypeScript", ".cts": "TypeScript",
   5 |   ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
   6 |   ".py": "Python", ".rs": "Rust", ".go": "Go", ".java": "Java", ".kt": "Kotlin",
   7 |   ".c": "C", ".h": "C", ".cpp": "C++", ".hpp": "C++", ".cs": "C#",
   8 |   ".rb": "Ruby", ".php": "PHP", ".swift": "Swift", ".sh": "Shell", ".ps1": "PowerShell",
   9 |   ".html": "HTML", ".css": "CSS", ".scss": "SCSS", ".vue": "Vue", ".svelte": "Svelte",
  10 |   ".json": "JSON", ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML",
  11 |   ".md": "Markdown", ".mdx": "MDX", ".sql": "SQL",
  12 | };
  13 | 
  14 | const manifests: Record<string, string> = {
  15 |   "package.json": "Node.js", "pyproject.toml": "Python", "requirements.txt": "Python",
  16 |   "setup.py": "Python", "setup.cfg": "Python", "cargo.toml": "Rust", "go.mod": "Go",
  17 |   "pom.xml": "Java", "build.gradle": "JVM", "build.gradle.kts": "JVM",
  18 |   "gemfile": "Ruby", "composer.json": "PHP", "package.swift": "Swift",
  19 | };
  20 | 
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
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
  21 | const testExtensions = new Set([
  22 |   ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs",
  23 |   ".py", ".rs", ".go", ".java", ".kt", ".c", ".cpp", ".cs", ".rb", ".php", ".swift", ".sh", ".ps1",
  24 | ]);
  25 | 
  26 | /** Paths must use repository-relative forward slashes. Detection is heuristic. */
  27 | export function classifyFile(path: string) {
  28 |   const name = posix.basename(path).toLowerCase();
  29 |   const extension = posix.extname(name);
  30 |   return {
  31 |     language: languages[extension] ?? null,
  32 |     ecosystem: Object.hasOwn(manifests, name) ? manifests[name]! :
  33 |       [".csproj", ".fsproj", ".vbproj"].includes(extension) ? ".NET" : null,
  34 |     isReadme: /^readme(?:\..+)?$/i.test(name),
  35 |     isTest: testExtensions.has(extension) && (/(?:^|\/)(?:tests?|__tests__)\//i.test(path)
  36 |       || /(?:^test_.+|.+_test)\.py$/.test(name)
  37 |       || /\.(?:test|spec)\.[^.]+$/.test(name)
  38 |       || /_test\.go$/.test(name)),
  39 |   };
  40 | }
```


```text
  41 | 
```
