# P24 poison-counter pilot

This is a supervised, non-blind seeded-defect experiment on Commander Tracker.
It tests configured offline checks, not general audit accuracy or AI review.

## Feature baseline

The developer started from merged Commander Tracker revision
`b9ff14d0ccb49e9dd62bc5e92899ff527d5a3305` on local branch
`codex/poison-counter-baseline`. The feature floors poison counters at zero,
updates only the selected player and leaves life behavior unchanged, including
negative life. Accessible control names distinguish players and counter types.

The small pure poison updater has seven unit cases for boundary behavior,
increments/decrements, player isolation and frozen-input immutability. Four
component integration tests render React in jsdom and click actual controls.
The existing post-build icon integration test is retained. The behavioral suite
is a required Shipcheck check; production-build testing stays separate.

New development dependencies are pinned: Vitest 3.2.4, jsdom 26.1.0, React Testing
Library 16.3.0 and user-event 14.6.1. They provide TypeScript/React execution, a
test DOM, component queries and user interactions. No runtime dependency was
added. The lockfile records their transitive dependencies.

Windows x64 / Node 22.23.3 baseline validation passed: 11 behavioral tests,
ESLint, application/Vite configuration type checks, production build and icon
test, and actual Shipcheck execution with all four required checks. An interrupted
build without a saved result was not credited; resumed runs used fresh evidence
IDs. A final documentation-only wording clarification preceded the source freeze.

## Experimental controls

The six-case protocol was recorded before baseline completion and audit results.
The supervisor prepared three mutations in `src/poison.ts`: remove the floor,
update the wrong player, and suppress decrements. Controls are the unchanged
baseline, a comment addition, and equivalent ordering of `Math.max` operands.
Only that application source file changes; tests, configuration and dependencies
remain fixed. No detector was added after observing a mutation's audit result.

An external checker transpiles the actual updater and compares 24 combinations
of poison values, selected player and increment/decrement against independently
written expected updates. Frozen inputs also expose mutation attempts. All three
controls pass these combinations. The defects violate 5, 22 and 7 combinations,
respectively. This checker never appears in the audited source or project tests.
It is supervisor-authored, not an independent reviewer or exhaustive proof.

`scripts/qualify-poison-pilot.mjs` freezes source/check/config hashes, compiled
Shipcheck hashes, runner/protocol hashes and exact variant content before audits.
It copies installed dependencies once into a disposable workspace, runs each
variant through the real CLI with unchanged required checks, preserves reports
and exit metadata, checks source preservation, and restores the workspace at the
end. The original developer checkout is never mutated. Raw records and copies
are ignored under `.release-check/p24/poison-pilot/run-1/`.

Reproduction requires the completed developer baseline and its installed locked
dependencies, the saved protocol, a built Shipcheck checkout and a new output
directory outside the baseline:

```powershell
node scripts/qualify-poison-pilot.mjs <baseline> <new-output-directory> <protocol.json>
```

The runner is intentionally specific to this baseline's updater; it rejects
missing/ambiguous mutation anchors. It is a development qualification script,
not a new product workflow. It does not install tools or invoke paid models.

## Results — October 16, 2026

All six runs completed without operational failures. The supervisor reviewed the
actual assertion output before classifying the three failed checks as detections.

| Variant | Unit failures / 7 | Component failures / 4 | CLI result |
| --- | --- | --- | --- |
| Baseline | 0 | 0 | Checks passed — exit 0 |
| Removed floor | 1 | 2 | Expected assertion failures — exit 1 |
| Wrong player | 2 | 3 | Expected assertion failures — exit 1 |
| Suppressed decrement | 4 | 2 | Expected assertion failures — exit 1 |
| Comment only | 0 | 0 | Checks passed — exit 0 |
| Equivalent floor | 0 | 0 | Checks passed — exit 0 |

Configured behavioral tests detected 3/3 seeded defects; all three controls passed.
Lint and both type checks passed every variant. Shipcheck produced zero standalone
findings in every run: detection came from the project tests, with Shipcheck
preserving their output and applying the required-check exit policy. No AI ran.
There were no unexpected findings or operationally unresolved runs in this set.

Every report retained four `non-text-file` warnings for the original and public
PNG icons. Consequently controls have aggregate outcome `incomplete` despite
checks passing; they are not whole-repository clean bills of health. The runner's
`control-clear` label describes checks/findings only. Defect reports have outcome
`issues-reported`. These existing warnings are coverage disclosures, not false
positive defect claims.

The runner verified source, test, configuration and compiled-tool hashes after
each run and restored its disposable workspace. The developer checkout was not
mutated. Frozen manifest SHA-256:
`3d1cb57cb8610654acd36fec9a1d7bc75e10f283256b819d92b747606c8b0d4b`.
Each variant directory retains its exact source, report and report-hash capture;
`results.json` retains the unadjudicated automated classifications. This table is
the supervisor's subsequent assessment. API spend was $0.

After user authorization, the feature and tests were committed as `a710c83`
on `codex/poison-counter-baseline`, pushed, and submitted as
[Commander Tracker PR #2](https://github.com/Hassurunous/commander-tracker/pull/2).
Seeded defects are confined to disposable pilot copies.

After the pilot, Shipcheck validation passed: six focused qualification tests,
typecheck, all 659 tests across 44 files, build, and all 27 CLI acceptance groups
(`npm run verify`). The pilot runner also passed Node's syntax check.

## Interpretation limits

These mutations directly target the feature's acceptance criteria. The developer
wrote its tests before receiving mutation details, but both tests and mutations
share those requirements. The supervisor knows the defects and reviews results;
this is not blinded, independently scored or representative of arbitrary bugs.

Record behavioral-test detection separately from lint/type/built-in detection.
A failing test propagated by Shipcheck is useful test integration, not autonomous
discovery by Shipcheck. Any unrelated findings need review rather than automatic
false-positive labels. Inspection warnings for binary icons may keep aggregate
coverage incomplete even when the requested behavioral checks complete.

The small pilot cannot establish false-positive rates, full UI coverage, browser
behavior, all edge cases, or historical real-project accuracy. The planned
multi-project historical evaluation remains unfinished. No API spending is used.

## Next experiment: discovery without test diagnostics

The user clarified that the intended experiment is independent discovery, not
propagation of failures from project tests. The first pilot does not satisfy that
objective. Reuse the same three defects and three controls, freeze source and
configuration before reviewing results, and withhold behavioral-test execution
equally for every variant. Keep lint/type results separate from Shipcheck findings.
Do not add rules or tests after seeing results. Record unavailable checks as
coverage gaps, never as passing tests.

Run offline first, then optional real AI review under a newly authorized spending
cap. Mock AI is not detection evidence. Give every variant identical requirement
context explaining the zero floor, selected-player isolation and working positive
decrements; do not expose mutation labels or external oracle results to the model.
Record whether test source is included in model context. Review findings against
the frozen external oracle and exact code, including findings on controls.
Count a defect as detected only when a finding correctly identifies its behavioral
failure, not merely because the process returns nonzero. Report misses, false
claims and incomplete executions separately. The supervisor remains unblinded.

## Discovery experiment results — October 16, 2026

The follow-up was executed after the user authorized up to $1. The offline arm
disabled all external checks equally and retained the same source variants.
Built-in rules reported no findings in all six cases: 0/3 seeded bugs detected.
All reports retained the four binary warnings. An initial sandbox subprocess
failure was preserved as `offline-1`; `offline-2` completed with execution
permission. No detector or source was tuned between attempts.

The live arm used the real `task --ai live` CLI, low-cost `gpt-6-luna`, with one
call per variant and no retries. Neutral case names were used; the model received
only `src/LifeTracker.tsx`, `src/poison.ts`, and identical requirements. Tests were
excluded, no project checks ran, no test failures were supplied, and the external
oracle and variant labels were withheld. Previews confirmed both implementation
files fit without omissions and source hashes remained unchanged after each call.
This is requirements-assisted task review, not an unassisted whole-repository
audit. The defect class was known to the supervisor; the evaluation is non-blind.

| Case | Variant | Seeded-defect assessment |
| --- | --- | --- |
| 1 | Comment control | No poison defect claim; additional life claim rejected |
| 2 | Wrong player | Correct potential violations of updates/isolation, citations matched |
| 3 | Baseline control | No poison defect claim; additional life claim rejected |
| 4 | Suppressed decrement | Correct diagnosis proposed; citation rejected, downgraded to insufficient evidence |
| 5 | Equivalent floor | No violation proposed; supporting assessments had rejected citations |
| 6 | Removed floor | Correct updates violation with matched citation; separate floor assessment citation rejected |

The model described all three seeded failures correctly without project-test
diagnostics. Only 2/3 retained at least one citation-matched potential violation.
The remaining diagnosis quoted through a closing brace on line 13 while declaring
lines 7–12. Multiple supporting assessments also had line-range/excerpt mismatches.
These are real evidence-quality failures; rejected output is not promoted to a
verified detection. Exact citation matching is not semantic proof.

All six runs returned **review completed — exit 0**, despite two reports retaining
potential task violations. The CLI currently gates deterministic errors and
execution failures, not task assessments. Top-level `findings` was empty in every
case; the defects appear in `ai.taskReview.assessments`. Agents must inspect that
field and coverage, not infer approval from exit 0 or an empty findings list.
This is a practical integration gap for a future explicit task-gating policy.

Cases 1 and 3 proposed a general life-counter warning and an isolation violation.
Both cited mismatching ranges and were rejected. The claim combines a real
existing state-mutation problem with an unsupported lost-update explanation.
A supervisor probe extracted the actual life-handler body and invoked it twice
against the same captured state: both increments accumulated to 42, while the
prior snapshot was indeed mutated. That contradicts the stated lost-update
mechanism in this scenario; it is not a full React concurrency proof. Treat these
as mixed/partly incorrect claims, not confirmed bugs or clean control passes.
No accepted false poison-violation claim appeared, but these controls do not
establish a general false-positive rate. All control task reviews remained partial.

Raw previews, frozen configuration/mapping, exact reports, captures and the
life-claim probe are retained under `.release-check/p24/poison-discovery/`.
The budget `p24-poison-discovery-20261016` completed six requests with no unresolved
attempts: $0.037500 permanently reserved; $0.004754 priced usage upper bound (not
an invoice); $0.962500 allowance remaining. Rates were checked against the
[official model documentation](https://developers.openai.com/api/docs/models/gpt-6-luna).
No further spending was needed for this comparison.

Recommended follow-ups: improve citation reliability without accepting ambiguous
evidence; define explicit task-violation/uncertainty gating; add regression cases
for the misleading life-update claim; then test new defects with passing project
tests across additional repositories. Keep this frozen trial unchanged when
evaluating improvements.
