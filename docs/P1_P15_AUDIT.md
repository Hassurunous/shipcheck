# P1-P15 implementation audit

> Historical record: milestone-era status and future-work statements below describe
> the implementation at that time. See the [user guide](USER_GUIDE.md),
> [current architecture](ARCHITECTURE.md) and [P18 qualification](P18_QUALIFICATION.md)
> for current behavior and limits. Original test results are preserved.


This audit compares the roadmap with implementation, regression tests and real
CLI execution before P16. It covers the current working tree, including P15.
Milestone completion means its **documented bounded scope**, not every originally
imagined capability, exhaustive edge-case coverage, or proof of code correctness.

## Findings and corrections

1. **Stale source could appear complete after an empty AI response (P4/P6.1).**
   Source was reread for citation checking, but without candidates a changed or
   deleted file did not make coverage partial. Every submitted source now gets
   freshness metadata, displayed in console/Markdown/JSON; changes make coverage
   partial independently of findings. Regression cases cover changed, deleted,
   and unchanged sources with an empty response.
2. **Unicode JavaScript separators could produce incorrect evidence (P14/P15).**
   Parsers count U+2028/U+2029 as lines, while Shipcheck's evidence model counts
   CR/LF. The shared JS/TS parser now rejects these inputs with explicit
   unsupported-line-endings coverage. Tests verify no invented HTTP/import
   citations. Ordinary Unicode text and CRLF remain tested.
3. **Evaluation scoring could overstate results (P6.1/P12).** A confirmed label
   previously counted even with rejected citations; reference clean controls
   could pass despite limited/stale context or synthetic execution. Scoring now
   rejects these cases. Existing recorded P12/P13 evaluations still replay;
   their small fixture results do not establish repository-wide accuracy.
4. **The roadmap and architecture/release documents had stale statuses.**
   P9/P10 integration delivered by P13-P15 is now marked accordingly. P8/P9
   external resources, SDK declarations and broader version compatibility remain
   P16. P7 installed-tool and platform qualification remain P18.
5. **Executable acceptance was mostly manual.** A packaged, offline acceptance
   script now exercises actual CLI processes, asserts exit codes/report fields,
   blocks network attempts, and checks target-file preservation. It creates and
   cleans only synthetic temporary repositories, including an isolated Git repo.

Each correctness defect above was reproduced by a failing regression test before
the fix. No new dependencies or paid API requests were needed.

## Requirement-to-evidence matrix

Test paths below are relative to `test/`. Run any selection with
`npm test -- test/<name>.test.ts`.

| Milestone | Conformance and evidence | Limits / remaining work |
| --- | --- | --- |
| P1 inspection | `repository`, `boundaries`: deterministic inventory, nested ignores, classification, package scripts, markers, invalid roots/text, links, read limits and read failures. CLI audits exercise the inspector indirectly. | Only package JSON is structurally inspected; classification/test detection are heuristics. No total-tree read budget or atomic snapshot. |
| P2 findings | `findings`: schemas, stable IDs/sorting, malformed manifests, explicit evidence, warning separation, JSON roundtrip, terminal escaping. CLI suite asserts error findings and formats. | A zero-finding report proves nothing beyond implemented rules. |
| P2.5 configuration/CLI | `rules-config`, `cli-command`, `boundaries`: defaults/overrides, invalid config, excludes/globs, reference casing, missing versus uncertain targets, help/version/errors. | Limited glob and script-target syntax are intentional. `review` is removed; `audit` is preferred. |
| P3 optional AI | `ai`, `live-ai`: all three modes, preview/mock, bounded request/response, invalid envelopes, timeouts/abort, no retries, explicit live gates. CLI suite verifies preview and three mock modes. | One QA/reliability reviewer with configurable concerns; not autonomous developer agents. Historical live trial is evidence only for its fixtures, not a new live validation. |
| P4 evidence | `evidence`, `ai`: paths, ranges, excerpts, stale/deleted/linked sources and empty-response freshness. | Citation matching is not semantic verification. Reads assume a stable local tree rather than adversarial concurrent replacement. |
| P5 workflows | `workflows`, `current-task`, CLI suite: audit; staged/unstaged/untracked/deleted diff paths; empty diff; explicit/inline tasks; path/root restrictions. | Diff assesses current whole files. Empty diff intentionally skips even invalid unrelated configuration. |
| P6 packaging/reports | `markdown`, CLI suite and fresh local tarball installation: console/JSON/Markdown, injection-safe fencing, packaged executable and fixtures. | Local private pre-alpha distribution; no npm publication or cross-platform release claim. |
| P6.1 reliability | `audit-reliability`, `evaluation`, `ai`: numbered context, related imports/cycles, skips, citation rejections, explicit labels and replay. | Semantic labels are supplied by a reviewer; no automatic proof of diagnosis. |
| P7 checks/batching/budgets | `p7`, `check-diagnostics`, `audit-budget`, `live-ai`: command opt-in, limits, process cleanup, credentials, diagnostics/thresholds, batching, durable reservations, concurrency, corrupt/expired ledgers, interrupted attempts. CLI suite tests command opt-in and structured tool fixtures. | Installed ESLint/Ruff and POSIX cleanup/platform qualification remain P18. External tools are trusted, not a write-proof sandbox. Live priced model mappings remain pinned and expire. |
| P8 resources | `reference-resources`: bounded read-only local snapshots, raw-byte hashes, scope, missing/excluded/linked/sensitive files, UTF-8, hash pins and citations. | External roots, remote snapshots and semantic version compatibility remain P16. |
| P9 contract foundation | `openapi-contract`, `contract-audit`: OpenAPI JSON index, pointers, invalid/unsupported structures, unresolved refs; integrated by P14. | SDK declarations and cross-repository/version compatibility remain P16. Exact version pins are not semantic compatibility. |
| P10 intent foundation | `intent-policy`, `task-ai`, `architecture-audit`: unique IDs/hashes, supplied observations, direction/prefix controls; integrated by P13/P15. | Natural-language judgments remain AI assessments with uncertainty; policies are editable user expectations. |
| P11 inline tasks | `current-task`, `task-ai`, CLI suite: one config file, legacy task support, task hashes, selected files, recognized fix-flag rejection and no source/config changes during auditing. | Users may authorize external developer agents to change expectations. Arbitrary external check commands cannot be guaranteed read-only. |
| P12 references in AI | `reference-ai`, `reference-evaluation`: bounded source/reference context, numbered references, citations/freshness, omissions, duplicate paths, conflicts and recorded evaluation. CLI suite tests inclusion and missing-required-resource failure. | Local references only. Four recorded low-cost cases are not broad accuracy evidence. |
| P13 task assessment | `task-ai`, `task-evaluation`: per-criterion identities, supported/violated/uncertain outcomes, exact citations, incomplete context, task/source mutation and recorded five-case scoring. | Mock assessment is deliberately insufficient evidence. Task judgments do not automatically set failure exits. |
| P14/P14.1/P14.2 contracts | `contract-audit`, `contract-adapters`, `additional-http-clients`, `standard-http-adapters`: positive/negative/dynamic calls, language syntax, bindings, zero-call coverage, service/version scope, query names, limits and read-only evidence. CLI suite exercises JS/TS/Python/Go/C#/Java. | Only documented client patterns; no runtime behavior, authentication, body/response compatibility or general SDK resolution. Rust/Ruby/PHP remain follow-ups. |
| P15 architecture | `architecture-audit`: import extraction, aliases, paths, forbidden direction, naming styles, Unicode, scoped selection, links, unsupported inputs, file/import/read limits and report exits. CLI suite asserts violations, clean controls, partial imports and naming. | Explicit aliases, declared imports only, no compiler/transitive/runtime graph. Unmapped non-relative imports are outside the local graph. |

## Repeatable commands

From the source checkout (Node 22+, installed dependencies and Git):

```powershell
npm run verify
```

This runs typecheck, all regression tests, build, and 17 real-CLI acceptance groups.
An intentional fixture violation is a passing test only if Shipcheck returns the
expected exit and report; the test runner itself exits nonzero for regressions.
No API key or budget is needed. Unit tests use mocked/injected transports and
isolated ledgers; CLI acceptance strips credentials and blocks network attempts.

For smaller checks:

```powershell
npm test -- test/architecture-audit.test.ts
npm test -- test/reference-ai.test.ts test/task-ai.test.ts
npm run test:cli
```

Inspect examples directly (these are audit reports, not test-runner assertions):

```powershell
node dist/src/cli.js audit fixtures/demo --json
node dist/src/cli.js audit fixtures/contracts --json
node dist/src/cli.js audit fixtures/contracts-expanded --json
node dist/src/cli.js audit fixtures/architecture --json
```

The demo intentionally has two warnings (exit 0). The contract examples are clean
controls (three and eight matched calls, exit 0); the architecture example contains
a deliberate forbidden import (exit 1). Inspect `findings`, `contracts`,
`architecture`, `checks`, `ai`/`aiAudit`, and `currentTask` as applicable rather
than relying only on the findings count. Operational failures and incomplete
contract/architecture assessments exit 2. Partial AI coverage, AI candidates,
and uncertain task judgments must be inspected explicitly; they do not all
translate to nonzero exits.

To verify what users actually install:

```powershell
npm pack
npm install --prefix .release-check/audit-install --ignore-scripts --no-audit --no-fund ./shipcheck-0.1.0.tgz
node .release-check/audit-install/node_modules/shipcheck/scripts/cli-acceptance.mjs
& .release-check/audit-install/node_modules/.bin/shipcheck.cmd audit .release-check/audit-install/node_modules/shipcheck/fixtures/architecture --json
```

Installation may need registry access for dependencies; the acceptance suite is
offline. On non-Windows systems use the extensionless launcher. To test a chosen
compiled executable, pass its path to `node scripts/cli-acceptance.mjs <cli.js>`.

## Coverage interpretation and next steps

Validation on Windows/Node 22: typecheck and build passed; **426 tests across 29
files** passed, including 17 added regression/boundary cases. The checkout and
isolated installed package passed the executable acceptance checks; the actual
Windows `.cmd` launcher also returned the expected outcomes for all four shipped
examples. The tarball includes this guide and acceptance tooling and excludes
compiled tests, dependencies, environment files and local validation artifacts.
All audit verification was offline with **$0 API spend**. Other platforms were
not tested in this audit.

Regression coverage combines boundary-value cases, clean controls, seeded defects,
malformed inputs, failure injection, read/security boundaries and end-to-end CLI
checks. It does **not** enumerate every possible program, parser interaction,
filesystem race, platform behavior or model response. No coverage percentage is
claimed; line coverage alone would not prove these properties either.

Before public release, P18 still needs installed analyzer qualification, other
supported platforms, broader scored cases, repeated real developer-agent loops,
and adversarial evaluation. P16/P17 remain the next functional/integration work.
No claim of whole-repository correctness or universal language support follows
from this audit.
