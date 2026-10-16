# P24 first external baseline: commander-tracker

## Provenance and setup

Owner-selected repository: https://github.com/Hassurunous/commander-tracker

Pinned revision: `5388fe35202a30c02818131e0a40be47cee28a7b`.
Windows x64, Node 22.23.3, Shipcheck 0.1.0 at `4b0c046` (P24 development
scoring additions uncommitted). Project dependencies were installed from its
lockfile with `npm ci --ignore-scripts --no-audit --no-fund`. ESLint 9.17.0,
TypeScript 5.6.3, Vite 6.0.6 and PWA plugin 0.21.1 were used. Installation used
the network; audit requests used no AI, remote references or paid API calls.

The isolated clone and raw evidence remain in ignored `.release-check/p24/`.
No upstream files were edited or pushed. SHA-256 snapshots of every tracked
project file matched before/after the configured audit. The sole untracked
input was the added `shipcheck.config.json`; build output is Git-ignored.

## Audit results

| Run | Result |
| --- | --- |
| Default full-repository audit | Zero findings; two binary-content inspection warnings |
| Full audit with required ESLint and two explicit TypeScript checks | Exit 0; all three checks passed; zero diagnostics/findings |
| Separate Vite production build | Exit 0; service worker generated; outdated browser database warning |

The configured audit used direct Node invocations, without fixing flags:

```text
node node_modules/eslint/bin/eslint.js . --format json
node node_modules/typescript/bin/tsc --project tsconfig.app.json --noEmit --pretty false
node node_modules/typescript/bin/tsc --project tsconfig.node.json --noEmit --pretty false
```

TypeScript failures 1/2 were configured as failed checks rather than operational
errors. Both project configs were checked explicitly; the root config contains
references and is not sufficient as an ordinary single-project check.

Shipcheck inherited the target repository's `.gitignore`, excluding node_modules
and build output. Both PNG assets were inventoried but skipped for text inspection.
Consequently `auditSummary.outcome` remained `incomplete` despite exit 0 and passed
checks. There is no existing test suite, and no task, API contract, architecture
policy or AI stage was configured. This is not a clean general-quality verdict.

Configured report SHA-256:
`a5d85109fad0ca65447f0c15f9003305914cb882cd480b035061a90f17861b56`.
Configuration SHA-256:
`020bcc8d2dd3751a3ed7bb3b6b9c8754ee750caa19447248715ce9d3aac5eb36`.
The local manifest retains commands, revision, versions and tracked-file hashes.
Configuration contains a machine-specific Node path; these hashes identify this
run rather than portable expected outputs.

## Separate reviewer observations

These are manual observations, **not Shipcheck-generated findings**:

1. **Missing deployed PWA icons, confirmed by build artifacts.** The emitted
   manifest references `/icon-192x192.png` and `/icon-512x512.png`, but neither
   exists in the completed build. Originals reside in `src/assets` and are not
   imported or copied to the public output. A build-output assertion would catch
   this; existing lint/type checks do not.
2. **Persistence promise not implemented, source-level evidence.** README promises
   persistent game state. LifeTracker initializes two players in component state
   and has no persistence integration. A browser reload test remains necessary
   for the development trial; no browser test has been claimed here.
3. **Documented MVP exceeds implemented UI.** Commander damage, random player
   selection and +/-5 adjustments are described but absent from the small UI.
   Because this is explicitly unfinished work, these are requirement/status gaps,
   not automatically regressions or approved implementation tasks.
4. **Documentation placeholders remain.** README clone instructions use
   `your-username`, the HTML title is the starter title, and LICENSE retains a
   copyright-owner placeholder. Owner identity must not be invented.

The qualification record has zero audit claims and no pre-registered known bugs;
precision and known-defect detection are therefore undefined, not 100%. Manual
discoveries after the run do not retrospectively become a blinded benchmark.

## Supervised developer trial: completed

The owner authorized a separate developer task, **Commander Tracker supervised
icon repair** (`01a13795-8fd7-7931-b920-73f55de6a70f`), to repair the icons in the
isolated clone. Limits were five iterations, stop after two without progress,
offline checks, frozen requirements/checks, no publishing and no Shipcheck edits.
The developer completed one iteration and stopped for supervisor review.

Before dispatch, the supervisor froze a required `pwa-icons` check and expected
SHA-256 values. It requires both exact manifest paths/sizes/PNG types and deployed
bytes identical to the original assets. It writes nothing. The configuration,
expectations and verifier were hash-checked before every trial audit.

| Checkpoint | Lint and both type checks | Icon check | Shipcheck exit |
| --- | --- | --- | --- |
| Frozen baseline | Passed | Failed: both deployed icons missing | 1 |
| Developer iteration 1, after fresh build | Passed | Passed | 0 |
| Independent supervisor rerun | Passed | Passed | 0 |

The developer added only `public/icon-192x192.png` and
`public/icon-512x512.png`, copied from the existing originals. A fresh Vite build
completed with exit 0 and precached seven entries, compared with five before.
The supervisor checked the saved build log and independently verified all four
checks, report hashes, frozen inputs, and original/public/deployed asset hashes.
Every baseline source/configuration file remained unchanged. The supervisor did
not perform a second build; the independent rerun checked the developer's emitted
artifacts. No upstream changes were committed or pushed. No API calls were made.

Raw evidence is retained under `.release-check/p24/icon-trial/`: `baseline`,
`iteration-1`, `review-1`, and `supervisor-verification.json`. Each audit includes
its exact JSON report, captured exit, report hash and source hashes. The developer
handoff includes build output and exit. These are local evidence, not package
contents. Approval was returned to the developer task with instructions to stop.

## What this establishes and what remains weak

- Shipcheck correctly ran and reported an explicit regression check, preserved
  source files during audits, and distinguished a failing check from a pass.
- This is **test integration**, not autonomous icon-defect discovery. The
  supervisor identified the defect and supplied its test before dispatch.
  The developer was also told the likely minimal repair; this is not a blind
  investigation or independent accuracy benchmark.
- The frozen check inspects build output but cannot prove it came from current
  source. Build freshness was established through this supervised workflow.
  Future automation should bind build evidence to the audited source snapshot
  or run a controlled build/check sequence before accepting results.
- Binary inspection warnings remain after repair (including the new public PNGs).
  Thus the report retains `outcome=incomplete` and
  `generalQualityVerdict=not-established`, while all required checks and exit
  status pass. Text-inspection coverage and explicit asset-test results must be
  interpreted separately. This is conservative disclosure, not an icon-test
  failure; clearer workflow guidance would help callers.
- The custom text check supplies useful failure output but no normalized
  file/line diagnostics or automatic repair instructions. The developer must
  inspect the check output, not only the top-level findings array.
- Browser installability, hosting behavior, persistence, other missing features,
  and general accuracy remain untested. No false-positive rate is inferred from
  a single known defect and its supervised repair.

This completes the bounded developer-loop portion of P24. Multi-project
historical qualification remains pending. A persistence trial would require
frozen behavioral expectations and browser tests as a separate experiment.

## Agent-led setup trial

The developer subsequently used [the reusable configuration guide](AGENT_CONFIGURATION.md)
to set up a separate `commander-setup` clone. It created a root config, two
project-owned Node helpers (`scripts/check-pwa-icons.mjs` and
`scripts/verify-pwa-icons.mjs`), and `docs/SHIPCHECK.md`. The two repaired public
icons were copied into this clone as the starting state. No original tracked
application file, dependency, linter/compiler config or first-trial input changed.

The setup uses Node on PATH and project-relative commands, with no dependency
on the supervisor's temporary verifier or configuration. It requires ESLint,
both actual TypeScript projects, and a fresh Vite build followed by icon assertions.
Build/launch/timeout failures map to operational exit 2; assertion failures to 1.
Vite runs with `--emptyOutDir`; a planted stale-output sentinel was removed.
Build outputs and tool caches are disclosed; source/configuration hashes matched
before and after validation. Launch/build/timeout error branches were reviewed
but not fault-injected, and descendant termination was not separately qualified.

| Setup validation | Observed exit |
| --- | --- |
| Real CLI audit without command authorization | 2; all four required checks skipped |
| Real CLI authorized audit | 0; all four checks passed |
| Direct verifier against disposable valid output | 0 |
| Same output with one required icon removed | 1, explicit assertion failure |
| Restored output | 0 |
| Independent supervisor CLI audit, including a new build | 0; all four checks passed |

Evidence is retained in `.release-check/p24/setup-trial`, including exact command,
exit and output hashes for the five developer runs and the `06-supervisor` rerun.
The supervisor checked saved output hashes, preservation snapshots, configuration
schema and executable helpers. The developer completed its handoff after a usage
interruption without replacing the earlier evidence. There was no API spending.

The developer reported no blocking guide ambiguity and suggested a future portable
helper example. Review exposed a useful clarification now added to the guide:
existing TS/TSX lint rules may not cover new `.mjs` helpers. Their direct tests
provide narrow coverage, not exhaustive error-branch validation. This setup fixes
the earlier stale-build workflow gap by rebuilding inside the required check;
it still does not establish UI behavior, browser installation or general quality.
The aggregate audit remains incomplete because binary text-inspection gaps remain.

## Simplification after owner review

The preceding helper-based trials are historical evidence. The owner judged the
permanent setup too elaborate for the icon defect. Commander Tracker PR #1 now
uses one Node integration test in `test/pwa-icons.test.mjs`; the two custom
scripts were removed in commit `9ec2b61856b8a0a0c92dad06024462016e06b23a`.
`test:integration` builds then tests only after build success; `test:artifacts`
checks existing output. Routine Shipcheck audits retain three required lint/type
checks and no longer build the application. The public icon fix remains.

The test requires nonempty icon declarations and local files contained within
dist, including resolved symlink targets. It permits added/reordered declarations
and imposes no fixed list or byte comparison. Saved validation includes build/test
success, missing-file/empty-declaration/missing-declaration/path-escape failures,
addition/reordering success, restored-output success and both authorization modes.
The supervisor independently reran the artifact test successfully. Evidence lives
in `.release-check/p24/integration-revision`; earlier evidence was preserved.

The developer prepared the revision; its delegated publication request was
rejected by approval review. The supervisor submitted the reviewed commit/push
from the directly authorized task, received approval, and updated the same PR.
The PR remains unmerged. This reinforces a setup lesson: prefer small ordinary
project tests and proportionate execution frequency over trial-specific helpers.
