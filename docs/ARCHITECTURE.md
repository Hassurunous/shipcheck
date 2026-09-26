# Architecture

## Current implementation (P2)

`src/cli.ts` is the executable entry point. It passes command-line arguments to
the pure `formatStatus` function in `src/index.ts` and prints its result.
`test/cli.test.ts` verifies default and explicit targets without external state.
The CLI smoke-test output remains unchanged. The exported `inspectRepository`
API performs repository inspection. `createReport` evaluates captured facts and
returns deterministic findings with separate inspection warnings.
`renderConsoleReport` and `renderJsonReport` return report strings without I/O.
Evidence verification and AI review are not implemented yet.

`src/inspect-repository.ts` enumerates the tree and reads content sequentially.
`src/classify.ts` contains filename/extension heuristics. The Zod schema and
inferred `RepositoryProfile` type in `src/repository-profile.ts` define the
returned contract, which is validated before returning.

The profile contains an absolute root; sorted, relative forward-slash file
paths; language/file counts; manifest, README, and test indicators; package
scripts; TODO/FIXME markers with one-based lines and exact line excerpts; and
structured inspection warnings. No timestamps are included. Results are
deterministic for an unchanged, readable tree. File counts include content that
could not be read. Unknown extensions have a null language.

Inspection skips entries named `.git` or `node_modules` at any depth. Symlinks
and special files are skipped with warnings; a linked root is rejected. Reads
are capped at 1 MiB per file, including files that grow during reading. Binary
(NUL-containing) and invalid UTF-8 content is skipped with warnings. UTF-8 BOMs
are accepted. Missing, invalid, or unreadable roots reject the operation;
unreadable children produce warnings and inspection continues.

Manifest detection covers common Node, Python, Rust, Go, JVM, Ruby, PHP, Swift,
and .NET filenames. Only `package.json` content is parsed in P1. Scripts must
be string-valued; malformed manifests produce warnings. Scripts are never
executed. Test detection uses test directories and common JS/TS, Python, and Go
filename conventions; it does not establish coverage or test quality. Marker
scanning recognizes uppercase whole-word TODO/FIXME in any readable text,
including documentation and strings; markers are observations, not findings.

Limitations: `.gitignore` is not interpreted; build output, hidden files, and
other dependencies are included unless named above. Inspection does not create
a filesystem snapshot or protect against concurrent malicious path replacement;
use a stable local tree. Read limits are per file, not a total tree budget.
No files are written and no network calls are made.

TypeScript uses strict NodeNext ESM settings with explicit `.js` import paths.
One configuration checks source and tests and emits them under `dist/`; the
executable is `dist/src/cli.js`. The package file list includes only `dist/src`
and the README, so compiled tests are not part of the planned package contents.

## Findings and reporting

`src/inspect-package.ts` captures typed `packageIssues` during content inspection,
separating JSON syntax, top-level object, and scripts structure failures. The
original `invalid-manifest` warning is retained in repository profiles for
compatibility. Older profiles default to an empty `packageIssues` array; a fresh
inspection is needed to obtain detailed diagnoses.

`src/findings.ts` owns the Zod `Finding` and version-1 `Report` contracts and the
pure rule evaluation function. Findings have stable IDs derived from rule ID
and encoded relative path, severity, title, explanation, nonempty file-level
evidence, and suggested action. No line numbers or excerpts are invented for
parser failures. Findings are sorted by ID; inspection warnings are sorted by
path/code/message. Report creation validates and copies the input profile.

An invalid-manifest warning is removed from the report's inspection warnings
only when a detailed package finding covers the same path. All other warnings
remain visible, including legacy invalid-manifest warnings without diagnostics.
Missing documentation/tests and marker counts do not generate findings.

`src/reporters.ts` validates reports and formats console text or pretty JSON.
Console output escapes control characters in repository-controlled text and
states the limited rule scope. JSON preserves the report contract and evidence.
Neither renderer executes code, writes files, sets exit status, nor calls AI.
Evidence is captured during inspection; it is not reverified against disk at
report time. P4 will address evidence verification. See `docs/RULES.md` for rules.

## Near-term direction

```text
CLI
 ↓
Repository inspection
 ↓
Structured repository profile
 ↓
Deterministic findings
 ↓
Future specialist AI reviewers
 ↓
Evidence verification
 ↓
Reporters
```

Inspection, deterministic findings, and console/JSON reporters are implemented;
AI reviewers and evidence verification remain planned. Introduce small modules
only as their milestones require them. Prefer deterministic analysis before AI
analysis, structured data contracts, and evidence-backed findings. Execution is
local-first with minimal persistent state and no server requirement for v0.1.
