# Architecture decisions

Initial decisions — 2026-09-26

1. **TypeScript:** strict checking for small modules and future structured contracts.
2. **Node.js 22+:** modern Node runtime baseline for a local CLI.
3. **ESM:** native modules using NodeNext resolution and explicit `.js` imports.
4. **Vitest:** fast, local tests without network or service dependencies.
5. **tsx:** execute TypeScript directly during local development.
6. **Local-first CLI:** plain `process.argv`; no CLI framework needed for the bootstrap.
7. **No database:** the bootstrap requires no persistent application state.
8. **No server:** no hosted infrastructure or accounts are needed.
9. **No AI integration in this milestone:** implement deterministic foundations first.
10. **Zod:** retain the runtime dependency for future schema validation; no speculative schemas yet.
11. **Minimal packaging:** private package at 0.1.0 with a compiled executable mapping; publishing is deferred.
12. **Existing dependency ranges:** preserve the repository's dependency choices and lockfile; verify them with install, typecheck, tests, and build.

P1 decisions — 2026-09-26

13. **Inspection API first:** export `inspectRepository` and a Zod profile schema while preserving the bootstrap CLI. Command workflows remain P5 work.
14. **Facts before findings:** filename heuristics, scripts, and marker locations are observations; do not infer quality or execute repository code.
15. **Bounded content reads:** cap reads at 1 MiB per file and skip binary/non-UTF-8 content. Record child inspection failures as warnings; invalid or unreadable roots reject.
16. **Predictable traversal:** skip `.git` and `node_modules`, do not follow links, sort paths and maps, and avoid timestamps. Gitignore support and configurable exclusions are deferred.
17. **Focused manifest support:** recognize common ecosystem filenames, but parse only Node package scripts. No additional dependencies are needed.
