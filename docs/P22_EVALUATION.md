# P22 live evidence comparison

P22 is complete for this bounded comparison. The experiment supports retaining
analysis context, but does not establish a general accuracy improvement.

## Frozen protocol

Eight cases, two arms each, one request per arm. The supplied arm receives actual
external-check observations; the withheld arm receives the identical selected
source, current prompt, model and response schema without those observations.
Arm order alternates. This isolates evidence availability rather than comparing
the old P21 product with the new P22 product. No prompt tuning or retries occurred.

Three defect/clean pairs cover root-file linting, empty-array averaging and
concurrent appends. Two controls cover timeout and unauthorized execution. The
lint pair is a known regression pattern; the other two pairs were newly authored
and frozen before model calls. This is not a blinded or independently authored
holdout. The author of the fixtures also reviewed the diagnoses.

Corpus: `fixtures/evidence-comparison/cases.json`.
SHA-256: `c36d8b2ca4601ee6de5b0961f360e6563ebfa43437a66de57065c6ed4849a2a7`.
See the fixture README for the predeclared protocol. The P21 corpus is unchanged.

## Results

| Measurement | Evidence withheld | Evidence supplied |
| --- | ---: | ---: |
| Seeded defects detected | 3 / 3 | 3 / 3 |
| Missed / unresolved seeded defects | 0 / 0 | 0 / 0 |
| False-positive diagnoses | 1 | 0 |
| Clean controls without candidates | 2 / 3 | 3 / 3 |
| Incomplete controls with no invented defect | 2 / 2 | 2 / 2 |
| Unsupported execution claims | 0 | 0 |
| Unassessed candidates | 0 | 0 |

Seven candidates were reviewed: six confirmed seeded diagnoses and one false
positive. All seven citations matched. The supplied-arm candidates made four
execution premises, all supported by the actual checks. No contradictory premise
was generated live; deterministic regression tests exercise that rejection path.
Both arms avoided the original P21 false lint-exclusion claim, so that specific
improvement cannot be attributed to the evidence payload in this comparison.

The extra complaint in the withheld arm concerned missing validation for NaN,
Infinity and non-number inputs to the repaired average function. The declared
input domain was arrays of finite numbers, and no requirement to validate inputs
or reject other types was supplied. The candidate hypothesized unconstrained
callers and recommended a new requirement, so it was labeled false-positive
within this fixture's declared domain. That label is a reviewer interpretation
of the input precondition; the fixture is not a proof of numerically robust
averaging for every possible finite-number array. No claim about arithmetic
overflow was made or scored. A different project contract could make validation
appropriate. The supplied arm's passing test does not prove validation is
unnecessary or establish why the model abstained.

Empty output on timeout/skipped controls is abstention, not evidence that the
model understood the execution problem. The actual `error` and `skipped` records
are preserved independently. The experiment did not add an overall-clean verdict.

## Cost and execution

- 16 completed requests; no retries, locked budget or unresolved attempts.
- `gpt-6-luna`, low reasoning, standard processing, maximum 2,000 output tokens.
- 16,386 input tokens; 2,215 output tokens.
- Dedicated allowance: `p22-comparison-20261012`, $0.25 authorized.
- Immutable reservations: **$0.10**; remaining unreserved allowance: **$0.15**.
- Shipped-policy priced usage upper bound: **$0.003164**, not an invoice.
- Windows x64, Node.js 22.23.3; real installed ESLint and synthetic Node assertions.
- Every fixture file was verified unchanged after each arm; no source edits by AI.

Current [official pricing](https://developers.openai.com/api/docs/pricing) and
[model information](https://developers.openai.com/api/docs/models/gpt-6-luna)
were checked before execution. The conservative shipped price policy was unchanged.
Only synthetic fixture source and captured check observations were submitted.
There is no reason to spend the unused allowance simply to exhaust it.

## Reproduction and review

Build first. The evaluator requires an installed ESLint path and refuses an
existing output directory. Live execution requires a fresh, resolved allowance
of at most $0.25 sufficient for the whole planned reservation. It stops at the
first operational failure and never initializes or resets an allowance itself.

```powershell
npm run build
node scripts/evidence-compare.mjs --offline .release-check/p22-new-offline <path-to-eslint.js>
node scripts/evidence-compare.mjs --live .release-check/p22-new-live <path-to-eslint.js> <new-authorized-budget>
node scripts/score-evidence-comparison.mjs <evaluation.json> <labels.json>
```

The harness uses production check execution, context preparation, request builder,
budgeted transport and evidence validators directly to hold source selection
constant. It is not another end-to-end CLI qualification. Existing CLI regression
coverage separately validates workflow integration.

Generated runs and assessments remain ignored under `.release-check/p22-live`.
The scorer checks the corpus hash, unique known runs/candidates and reviewer
labels bound to exact run hashes. Confirmed labels require matched citations and
no contradicted/unknown execution premises. Missing/unassessed responses remain
unresolved instead of disappearing from the denominator. Raw live results are not
versioned; the fixture, harness, protocol and this reviewed result are versioned.

Validation passed: typecheck, build and 635 tests across 42 files.
The six scorer tests cover confirmed/clean results, stale/duplicate/unknown
labels, contradicted premises, false positives and missing responses. A larger
independent corpus, repeated samples and real-project review are still needed
before making general claims about false-positive rates or effectiveness.
