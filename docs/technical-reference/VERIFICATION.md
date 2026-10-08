# Documentation verification

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Verification was performed against the 2026-10-02 working tree, including its pre-existing uncommitted implementation changes. This documentation task did not change runtime source, tests, configuration or dependencies.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed. |
| Initial `npm test` | 565 of 566 tests passed; the architecture source/observation-cap test exceeded its five-second timeout. |
| Sandboxed focused reruns | Vitest could not load its configuration because a required process spawn failed with `EPERM`; these attempts did not run tests. |
| Focused `npm test -- test/architecture-audit.test.ts` with process permissions | 36 of 36 passed. |
| Full `npm test` with process permissions | 566 of 566 passed across 37 files. |

No test timeout setting, assertion or implementation was changed. The successful focused and full reruns show that the initial timeout was not reproduced; they do not establish its exact cause.

The reference inventories 64 runtime TypeScript modules, 550 function bodies/callbacks and 1,138 variable declarations. Parameters, destructured bindings, catch bindings, imported collaborators, type declarations and schema fields are additionally represented in the chapters. These are static syntax counts rather than invocation counts.

The source manifest hashes the exact source bytes, including original line endings. Display listings normalize line separators and add line-number prefixes. Source links land at the containing 20-line display block. Every block together reproduces the whole module; inline explanatory expressions may be abbreviated, but source listings are not.

Documentation checks verified every manifest hash against the current files, every function anchor against the parsed syntax tree, all variable/function inventory counts, each complete numbered listing against its source, and all local Markdown links/anchors across 68 Markdown files. All passed. Each of the 64 modules also has an authored explanation of its role and algorithm.

This was a documentation-only change. No paid model calls, live allowance operations, external service probes, deployment or public package publication were performed. Existing test transports/fixtures exercise relevant behavior offline. A build or new platform qualification was not required by the change and is not claimed here.
