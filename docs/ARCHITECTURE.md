# Architecture

## Current implementation (P1)

`src/cli.ts` is the executable entry point. It passes command-line arguments to
the pure `formatStatus` function in `src/index.ts` and prints its result.
`test/cli.test.ts` verifies default and explicit targets without external state.
The CLI smoke-test output remains unchanged. The exported `inspectRepository`
API now performs repository inspection; findings, evidence verification, and AI
review are not implemented yet.

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

This flow is a roadmap, not implemented functionality. Introduce small modules
only as their milestones require them. Prefer deterministic analysis before AI
analysis, structured data contracts, and evidence-backed findings. Execution is
local-first with minimal persistent state and no server requirement for v0.1.
