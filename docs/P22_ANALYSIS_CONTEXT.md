# P22 — Evidence-grounded AI review

## Implemented: captured analysis context

AI requests now include bounded observations collected before AI review:

- External check status, purpose, exit code, reason and normalized diagnostics.
- Bounded text output for unstructured checks, and stderr for structured checks.
- Deterministic findings and inspection warnings.
- Contract and SDK comparison states, issues, file provenance and call results.
- Architecture policy state, issues, boundary/convention results and file hashes.
- Quality-tool discovery results and documented coverage limits.

This applies to audit, diff and task workflows, including every whole-repository
AI batch. Authorized checks finish first; offline contract/SDK/architecture
analysis follows; AI runs afterward. The final report retains the original stage
results and exit-code behavior. Direct `reviewWithAi` callers receive inspection
and deterministic evidence and can supply captured `analysisResults`; this does
not execute tools or authorize commands.

No new CLI flag is needed. For example, with configured checks:

```powershell
shipcheck audit . --run-checks --ai preview --json
shipcheck audit . --run-checks --ai mock --whole-repository --json
```

Preview does not call a model; mock produces synthetic candidates. `--run-checks`
still authorizes configured external programs in either mode. Existing live
activation and spending allowances remain required for paid review.

## Evidence boundaries and reporting

Evidence receives at most 8 KiB and one quarter of the available context after
reserving task text. Source and reference selection use the remaining budget.
Statuses are prioritized before detailed diagnostics and excerpts. Complete
records that do not fit are omitted and counted. Individual strings are capped
at 1,200 characters and nested arrays at 20 items, with filtering disclosed.
Very small context budgets can omit the entire evidence payload.

`ai.preview.analysis` (also per whole-repository batch) reports submitted bytes,
record count, omitted record count, filtering and a SHA-256 fingerprint. The
fingerprint identifies the prepared evidence summary; if bytes is zero, that
summary was not submitted. Console and Markdown expose counts and limitations.
Omitted/filtered evidence marks AI coverage partial. Full request size and live
budget accounting include the submitted evidence.

Check file coverage remains **unknown**. A diagnostic is evidence that a tool
observed that path in that run, not proof it checked every line or used the right
configuration. Passed checks do not prove correctness; execution errors, skipped
checks and analysis gaps must not become clean results.

Captured execution evidence is labeled **not-revalidated**. External commands can
modify files, and concurrent edits can make results stale. Source/reference
citation freshness checks continue separately; they do not establish that a
captured tool result describes the same snapshot. Stabilize the tree during an
audit. Shipcheck does not rerun tools to resolve contradictions automatically.

Tool output and all analysis text are untrusted data. They cannot authorize
commands, change the reviewer's role or serve as source citations. Known
credential environment values and credential-like strings are withheld before
submission; discovery commands and arguments are not forwarded. This filtering
is heuristic, not a guarantee that arbitrary logs contain no sensitive data.
Users authorizing live AI should inspect what their configured tools emit.

## Validation and remaining work

Offline regression tests cover all four check states, bounded Unicode evidence,
credential filtering, command-argument exclusion, contradictory root-file lint
evidence, embedded tool-text instructions, real failed command execution before
AI, architecture observations in bounded/whole-repository workflows, paired
correct/incorrect imports, and tiny-context omission.

## Narrow execution-premise validation

New model requests require each candidate to include `executionClaims` (empty
when none apply). Each claim names a check ID and either its captured status
(`passed`, `failed`, `error`, `skipped`, with null path) or `path-observed` /
`path-not-observed` with an exact diagnostic path. Legacy responses/reports
without this additive field still parse.

`executionVerification` reports `supported`, `contradicted`, `unknown`, or
`not-claimed`, with per-premise reasons. Validation uses exactly the submitted
bounded evidence, not hidden omitted results. A diagnostic supports observation
and contradicts non-observation; no diagnostic proves neither. Status comparisons
apply only to a uniquely identified captured check. Unsupported combinations,
unknown IDs and omitted evidence remain unknown. Matching is exact, without
case folding or path normalization that could conflate distinct files.

An injected response deliberately repeats P21's false claim that a diagnosed
file was never linted. Its exact source citation still matches and its diagnosis
remains `unverified`, but its structured execution premise is `contradicted`.
The candidate is retained with an explicit console/Markdown warning against
acting on it until resolved. Contradicted or unknown premises make AI coverage
partial; existing exit-code behavior is unchanged. Supported premises do not
confirm a diagnosis. Empty claims do not certify that arbitrary natural-language
prose contains no false execution statement. This is not a general semantic
contradiction detector and does not validate task-assessment prose.

The outgoing structured schema requires all new fields, with nullable path,
following [official OpenAI structured-output guidance](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).

Validation on Windows: typecheck, 629 tests (including 26 P22 cases), executable
build and all 26 CLI acceptance groups passed. An executable preview audit of
Shipcheck itself included four analysis records without evidence omissions or
filtering. No model request was made.

## Live evaluation completed

The approved $0.25 paired comparison completed 16 requests. Both arms detected
3/3 seeded defects; the arm with analysis evidence had zero false-positive
diagnoses versus one in the arm without it. This is a small, non-blind comparison,
not a general accuracy claim. See [P22 results and costs](P22_EVALUATION.md).
P22 is complete within this documented scope; P23 addresses deeper offline
coverage separately.
