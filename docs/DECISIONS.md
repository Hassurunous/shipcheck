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

P2 decisions — 2026-09-26

18. **Conservative initial rules:** report invalid package JSON, non-object manifests, and invalid scripts structure. Missing README/tests and text markers remain observations.
19. **Typed diagnostics:** capture package issues during inspection instead of parsing warning prose or rereading files in rules. Preserve the original warning in profiles, but avoid duplicating diagnosed issues in reports.
20. **File-level evidence:** include the manifest path and observed failure. Do not invent parser line numbers or excerpts. Evidence verification remains P4.
21. **Pure reporting API:** version the JSON report contract, validate it with Zod, and return console/JSON strings. Leave CLI workflows and exit-code policy to P5. No new dependencies or AI integration.

22. **Configurable rule follow-up:** use strict version-1 JSON configuration with severity/off settings, ordered path overrides with reasons, and a small documented glob subset. Unknown settings fail clearly; no new dependencies.
23. **Conservative local references:** inspect literal local dependency/script/entry paths without executing commands or resolving general module syntax. Avoid missing-path findings for excluded or uncertain locations.
24. **Policy defaults:** lockfile conflicts and missing simple script targets warn; missing local dependencies error. Entry-point, README, test-detection, and source FIXME checks are disabled by default.

25. **P2.5 command shortcuts:** expose review/help/version using plain argument parsing and npm scripts. Keep reports on stdout and failures on stderr; use exit codes 0 (completed), 1 (error findings), and 2 (operational/usage failure). Global linking remains optional.

P2.5 scope clarification — pre-P3 audit

26. **Approved intermediate milestone:** decisions 22–25 belong to P2.5. This supersedes the earlier blanket deferral of CLI conveniences and exit-code policy to P5; audit/diff/task remain P5 work. The expansion was explicitly requested and does not authorize additional infrastructure or automatic modification.
27. **P3 credential convention:** use the user-provided environment variable name `OPENAI_PROJECTDEV_API_KEY` when AI integration is implemented. No current code reads it, and no key value is stored in project files.

28. **P2.5 audit fixes:** capture filesystem-aware reference existence instead of inferring absence from exact-case inventory sets. Treat skipped/inaccessible references as unknown. Share root validation and byte limits with config loading, rejecting linked/non-regular config files and propagating read failures.

29. **P3 offline first:** explicitly support preview/mock only. Low-cost is the default of three modes; real model mappings are unset until budget discussion. An injected Responses adapter tests the provider boundary without a shipped network transport or SDK.
30. **Bounded selected context:** source-extension allowlist, sensitive-path/content filters, whole-file selection, and total serialized context limits. Preview metadata and hashes do not contain source bodies. Secret detection is heuristic and requires human review before future live use.
31. **Candidate provenance:** keep AI candidates separate from deterministic findings, with model/mode/reviewer/execution provenance and unverified evidence. Citation membership/range constraints are input boundaries, not P4 factual verification.
32. **No unexpected spend:** no credential lookup, live CLI option, automatic retries, or invented pricing. Model/price/budget selection and explicit network activation remain gated; mock results carry no quality claims.
