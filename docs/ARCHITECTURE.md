# Architecture

## Current bootstrap

`src/cli.ts` is the executable entry point. It passes command-line arguments to
the pure `formatStatus` function in `src/index.ts` and prints its result.
`test/cli.test.ts` verifies default and explicit targets without external state.
There is no repository inspection, evidence verification, or AI review yet.
Zod is reserved for future runtime data validation.

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
