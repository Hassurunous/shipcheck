# Pre-P3 audit

Audit baseline: e276481 (P2.5). Documentation changes accompany this review;
production behavior was not changed.

## Scope assessment

The implementation remains a local-first, read-only TypeScript/ESM CLI with
strict checking, Zod contracts, deterministic inspection, rules, and reports.
Zod is still the only runtime dependency. No network client, AI integration,
server, database, authentication, hosted service, code modification, or script
execution was introduced. Configurable rules and review/help/version commands
were explicitly approved as P2.5. Audit/diff/task are still future workflows.

Validation: all 50 tests, typecheck, and build passed. The installed launcher
successfully reviewed this repository with zero findings and warnings. These
checks do not establish correctness outside the tested rule scope.

## Findings and follow-ups

1. **Medium — false missing targets on case-insensitive filesystems.**
   `src/additional-rules.ts` checks exact-case inventory sets. A Windows fixture
   with `src/Main.js` and `node src/main.js` was accessible via filesystem stat,
   but review reported `package/missing-script-target`. The same comparison is
   shared by local dependency and entry-point checks. Fix with filesystem-aware
   reference facts, preserving genuine case-sensitive failures; do not blindly
   lowercase paths on all platforms. Add regression tests.
2. **Low — configuration reads bypass inspector boundaries.**
   `loadConfig` uses unrestricted `readFile` and runs before root inspection.
   It can follow a config symlink and does not apply the inspector's read cap.
   This is a boundary mismatch, not evidence of a network disclosure today.
   Align config loading with root/link and size policy before external context
   collection is introduced.

These are correctness/hardening follow-ups, not product scope expansion. No
fixes to these behaviors were made as part of this audit.

## P3 proposal (not implemented)

- Explicitly opt in to AI review; ordinary review stays offline and deterministic.
- Add one QA/reliability reviewer behind a small API adapter, using
  `OPENAI_PROJECTDEV_API_KEY`. Select the model and request limits before the
  first live run; avoid a provider framework or autonomous agent loop.
- Build bounded source context. The current profile contains metadata and
  marker excerpts, not enough code for substantive review. Respect exclusions,
  exclude sensitive files by default, retain relative paths/line numbers, cap
  total input, and disclose truncation. Treat repository text as untrusted data.
- Validate structured output and attach reviewer/model provenance. Keep AI
  candidates distinguishable from deterministic findings, with evidence marked
  unverified until P4 checks files, ranges, and excerpts. Schema validation is
  not factual verification.
- Handle missing credentials, timeouts, rate limits, malformed/refused/incomplete
  responses with bounded retries and explicit failure/partial status. Retain
  deterministic results; never present a failed AI run as a clean review.
- Mock the API in default tests. Add an explicitly invoked, bounded live smoke
  test only after implementation and request configuration are ready.

Done means one opt-in review works end to end with bounded input, validated
candidate findings, clear failures, and no regression to offline review. No
multi-reviewer orchestration, code editing, servers, or P5 workflows are needed.

## Follow-up resolution

Both audit items are now addressed in implementation. Local reference existence
is captured from component-wise filesystem lookups without lowercasing paths;
linked/excluded/inaccessible paths remain unknown. Configuration uses shared
root validation and the 1 MiB read cap, rejects linked/non-regular files, and
requires valid UTF-8. Tests cover native casing, simulated case-sensitive
failure, real missing targets, linked/excluded aliases, config boundary size,
growth, missing/invalid roots, links, and unreadable config. The historical
findings above describe the audited baseline, not the current fixed behavior.
