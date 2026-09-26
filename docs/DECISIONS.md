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
