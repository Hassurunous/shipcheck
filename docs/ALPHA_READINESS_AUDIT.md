# Alpha readiness audit — 2026-09-30

## Stabilization outcome — 2026-09-30

The six findings below have been addressed in the working tree. The original
audit evidence is retained as history; the earlier hold recommendation describes
the candidate before these fixes, not the updated verification results.

| Finding | Resolution |
| --- | --- |
| A1 | Java architecture parsing translates Unicode escapes before tokenization, normalizes Java line terminators, and maps evidence to raw source offsets. Literal and escaped forbidden imports both exit 1; malformed escapes remain partial/exit 2. |
| A2 | Binding/shadowing facts are computed once and expensive call extraction stops at 128 observations. The 512-builder case now completed in 682 ms locally, versus the previous 15-second timeout. |
| A3 | New named ledgers use pricing policy version 2, rechecked September 30 and expiring October 30 at 00:00 UTC. Version 1 retains its original rates, receipts, expiry and settlement support; it is retired for requests. No existing allowance is renewed or refunded. The legacy trial is unchanged. |
| A4 | The package exposes its type entry point and contains 63 declaration files. A strict NodeNext consumer of the fresh installation compiled, including a negative type-check case. |
| A5 | Explicitly authorized external checks finish before review snapshots. Regressions verify updated source/reference hashes in bounded and whole-repository AI workflows and preserve task-change invalidation. |
| A6 | The guides now describe Markdown as the human-readable rendering and JSON as the complete structured report. |

Validation: normal `npm run verify` passed (552 tests with unchanged timeouts,
typecheck, build and 22 CLI groups). The expanded installed-tarball CLI harness
then passed all 23 groups, including Unicode preprocessing and malformed escapes.
The strict installed consumer, all 13 installed ESLint/Ruff corpus cases, budget
contention/crash recovery and Windows descendant cleanup checks also passed.
No API spend or real allowance changes were made.

Targeted reproduction/benchmark artifacts are in the ignored
`.release-check/alpha-fixes-20260930/` directory. These fixes do not change the
Windows-only qualification or authorize a commit, publication, license choice,
new spending allowance or broad semantic-accuracy claim. Java HTTP Unicode escape
handling remains explicitly unsupported; the new preprocessing addresses Java
architecture imports.

## Original recommendation

**Hold an advertised AI-enabled alpha release for a focused stabilization pass.**
The Windows CLI and packaged examples work, but this audit reproduced a false-clean
architecture result, materially slow bounded Java analysis, and a broken TypeScript
library-consumer path. The live pricing policy also has an imminent expiry.

This is an audit, not an implementation change or publication approval. Runtime
source and tests were not edited. The preceding documentation cleanup is still
uncommitted and was included in the tested package. This report was added after
the package qualification; it changes no executable behavior.

## Candidate and scope

- Base commit: `4d8587bab171c2ebe9d40be24bcf43572ea97241`, plus the existing documentation edits.
- Environment: Windows x64, Node 22.23.3. No new macOS/Linux qualification claim.
- Reviewed CLI/workflow composition, inspection/configuration boundaries, reference
  access, HTTP/SDK/architecture analysis, AI selection/verification, spending
  ledgers, external checks, reporting, packaging and documentation.
- Ran normal verification, fresh-tarball acceptance, real installed ESLint/Ruff
  qualification, process/crash checks, dependency scans and targeted reproductions.
- No paid model calls, real budget changes, global installs, commits or publication.
- This does not establish exhaustive defect detection, complete branch coverage,
  independent security certification or general developer-agent effectiveness.

## Findings

### A1 — High: Java architecture checks can return a false clean result

Location: `src/dependency-imports.ts:50`, contrasted with the existing Unicode
escape guard in `src/java-http-calls.ts:6`.

With a configured `core` → `ui` prohibition and `ui.` alias, this source correctly
reports a violation and exits 1:

```java
package core;
import ui.Foo;
class Main {}
```

Replacing the import line with the following produces exit 0, architecture state
`checked`, zero dependencies and `no-observed-violation`:

```java
package core;
// \u000a import ui.Foo;
class Main {}
```

Java translates Unicode escapes before identifying comments and tokens, so the
second form still imports `ui.Foo`. See the
[Java lexical translation specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html#jls-3.2).
Shipcheck's HTTP adapter already rejects these escapes conservatively, but its
architecture adapter does not. This is an undisclosed coverage gap, not merely an
unsupported pattern being reported as incomplete.

**Before release:** apply equivalent fail-closed handling to architecture
extraction, with CLI regression cases for ordinary and repeated-`u` escapes.
Unsupported escaped source should remain partial/exit 2 unless correctly analyzed.

### A2 — High: Java call bounds do not bound expensive analysis

Location: `src/java-http-calls.ts:9–16`; stress test at
`test/standard-http-adapters.test.ts:88`.

The type-binding helper repeatedly scans the entire syntax-node array for each
builder and URI expression. The loop continues doing binding work after the
128-call reporting cap has been reached. Normal `npm run verify` failed again:
525/526 tests passed; the Java call-cap test took about 7 seconds against its
5-second limit, preventing the combined command from reaching CLI acceptance.

Separate built-JavaScript subprocess measurements reproduced the scaling outside
Vitest. Each subprocess had a 15-second termination limit:

| Builder chains | Source bytes | Observed extraction time | Result |
| ---: | ---: | ---: | --- |
| 64 | 4,945 | 726 ms | 64 calls |
| 128 | 9,809 | 2,358 ms | 128 calls |
| 256 | 19,537 | 6,612 ms | 128 calls plus limit issue |
| 512 | 38,993 | Exceeded 15,000 ms | Subprocess terminated |

These are single-run local measurements, not a broad benchmark. All inputs are
below the documented 64 KiB source limit. Merely increasing the test timeout
would leave the production scaling problem intact.

**Before release:** precompute binding/shadowing facts, stop unnecessary work at
the extraction cap, and verify bounded larger inputs plus the unchanged normal
release gate.

### A3 — High for an AI-enabled release: pricing expires on October 3

Location: `src/ai/audit-budget.ts:12,22–24,63,128` and
`src/ai/trial-budget.ts:19`.

Both shipped live policies expire at `2026-10-03T00:00:00.000Z`. After that,
new named budgets and live requests fail closed regardless of available credits.
This is intentional spending protection, but an alpha distributed now would lose
its paid-AI functionality shortly afterward.

Renewal also needs compatibility design: stored policies validate their expiry
against the current compiled literal, and historical attempts validate models and
reservation amounts against the current model table. Simply changing those
constants can make existing ledger status/settlement unreadable. This compatibility
concern follows from code inspection; no real ledger was modified to test it.

**Before advertising ongoing live support:** reverify models/prices, version the
pricing policy, preserve historical reservation/receipt interpretation, and test
expiry plus upgrades without granting or refunding money. Do not remove the guard
or silently extend existing spending authorization. An explicitly offline-only
alpha could defer this work, with that limitation prominent in setup instructions.

### A4 — Medium: the installed library has no TypeScript declarations

Location: `package.json:7` and `tsconfig.json:7–15`.

The fresh tarball contains compiled JavaScript but zero `dist/**/*.d.ts` files.
A strict NodeNext TypeScript consumer importing `runWorkflow` from `shipcheck`
fails with TS7016: the module has no declaration file and is implicitly `any`.
The documentation advertises library exports and runtime schemas, so this affects
programmatic integration even though JavaScript callers and the CLI work.

**Before advertising a typed library:** emit and package declarations, expose the
type entry point, and add a fresh-install strict TypeScript consumer check. It is
reasonable to ship a CLI-only alpha first if the library limitation is explicit.

### A5 — Medium, conditional: authorized checks can stale earlier AI evidence

Location: `src/workflows.ts:77–85`.

AI review and citation freshness checks run before external commands. A disposable
fixture used an explicitly authorized Node check that changed `main.ts` from
`value = 1` to `value = 2`. The final report still described the old source as
`freshness: unchanged` and its old citation as `matched`. Only task-definition
freshness is rechecked after external commands; source/reference freshness is not.

This is not an arbitrary-command authorization bypass: configured external tools
are already documented as trusted and not sandboxed, and users are instructed to
choose inspection-only commands. It is a conditional reporting gap when a test,
generator or misconfigured check writes source. The offline mock reproduces the
same workflow ordering without making a paid request.

**Recommended before agent-loop use:** execute checks before collecting review
snapshots, or revalidate the relevant source/reference snapshots afterward and
mark changed evidence partial/rejected. Keep task mutation protection. Otherwise
explicitly identify verification as preceding external checks and prohibit use of
such a report as final acceptance after a writing check.

### A6 — Low: Markdown is described as preserving the complete report

Locations: `docs/USER_GUIDE.md:130`, `docs/ARCHITECTURE.md:193`,
`src/markdown-report.ts:5–19`.

The guides call Markdown a summary plus a complete report. The implementation
fences the console rendering; it does not embed the full JSON report. Machine
metadata such as selected-source hashes and detailed coverage fields is not
preserved as a complete serialized report.

**Fix:** call it the human-readable report and direct evidence retention and
integrations to `--json`, or deliberately include full JSON. Existing guidance to
parse JSON rather than Markdown is correct.

## Verification results

| Check | Result |
| --- | --- |
| Typecheck | Passed in normal verification |
| Build / `npm pack` | Passed; fresh tarball installed successfully |
| Normal full test suite | 525 passed, 1 Java stress-test timeout; release gate failed |
| Diagnostic suite with `--testTimeout=15000` | 526/526 passed; timeout override only, not a passing normal release gate |
| Installed package CLI acceptance | 22/22 groups passed; network guard observed no attempts |
| Installed ESLint 10.11.0 / Ruff 0.16.9 corpus | 13/13 expected outcomes; synthetic inputs unchanged |
| Process qualification | Contending reservation blocked; killed worker reservation retained; ordinary Windows descendant terminated |
| npm runtime and full dependency audits | Zero known vulnerabilities reported; not proof that dependencies are vulnerability-free |
| Documentation checks | 43 Markdown files; 159 local links and 17 JSON examples valid before adding this report |
| Strict installed TypeScript consumer | Failed TS7016, confirming A4 |
| Java architecture equivalence reproduction | Literal import exit 1; escaped equivalent exit 0, confirming A1 |
| Post-check source mutation reproduction | Stale source remained marked unchanged/matched, confirming A5 |

Shipcheck also audited its own repository with whole-repository **AI preview**.
The deterministic result contained one intentional missing-script warning in
`fixtures/demo/package.json` and zero inspection warnings. Preview selected 81
source paths in 20 batches and skipped 114 paths: 73 non-source/excluded, 3 over the
file-size cap, 6 sensitive-content matches and 32 beyond the batch cap. These are
selection results, not an AI diagnosis or a whole-repository quality certificate.
The default configuration contains no architecture/HTTP/SDK mappings for Shipcheck
itself, so that self-run cannot establish those properties of this repository.

## Distribution decisions and remaining limits

- The package is still private/pre-alpha. Choose local tarball versus public npm
  distribution and a release version before publishing. This audit authorizes neither.
- `package.json` declares ISC, has an empty author field, and the tarball has no
  project license file. Confirm intended license/ownership metadata and include
  the chosen license text before public distribution; the auditor has not selected
  or changed ownership terms.
- Preserve the accepted Windows-only qualification notice. macOS/Linux testing
  remains a follow-up, not a newly imposed blocker for a Windows alpha.
- No fresh live API qualification was performed. P18 remains historical evidence
  for its four live fixtures; it does not validate a future pricing/model update.
- General semantic verification, broader language patterns and independently
  measured developer-agent effectiveness remain documented limitations.

## Suggested stabilization order

1. Fix A1 and A2 with regression cases; get the normal `npm run verify` gate green.
2. Resolve A3 for an AI-enabled release, with backward-compatible ledger tests.
3. Address A4 if shipping the library, and A5 for reliable mixed check/AI workflows.
4. Correct A6 and finalize distribution metadata without broadening support claims.
5. Pack the final candidate, rerun installed acceptance and qualification, then
   record a reproducible release commit/artifact and the owner's publication decision.

Local raw evidence is under the ignored `.release-check/alpha-audit-20260930/`:
`reproductions.json`, `java-timings.json`, `self-audit.json`, `pack.json`,
`tool-qualification.json`, `process-qualification.json`, `all-dependencies.json`
and `docs-check.json`. `reproduce.mjs` and `java-timings.mjs` reproduce the targeted
cases without API spending. Those local files are not part of the published package.
