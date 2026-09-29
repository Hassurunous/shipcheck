# P6.1 — audit reliability

This milestone addresses the self-audit's citation failures, missing cross-file
context and misleading clean-result risks. It precedes P7's multi-language work.

## Changes

- Empty Git diffs return immediately after Git/root validation. Repository config,
  content inspection and AI are not invoked. An invalid unchanged config cannot
  turn a genuinely empty diff into an inspection failure.
- Reviewer v2 supplies each file as numberedLines: explicit one-based line/text
  pairs. Excerpts must contain original full-line text without numbering. Original
  source is retained for P4 verification. Citations are never silently repaired.
- Source selection prioritizes local static import/export dependencies after
  their importer. Relative JS specifiers can resolve to inventoried TS files;
  common extensionless files/index modules are supported. Traversal is cycle-safe.
- Scoped diff/task reviews may include supporting dependencies outside their
  focus paths. Their paths are disclosed; candidates with no evidence on a focus
  path are counted as outside scope and omitted from the scoped candidate list.
- Dependencies share existing file-count, size, exclusions and sensitive-content
  controls. Omitted/unresolved dependencies are disclosed to the model and report.
- Reports distinguish selected files, valid responses, failed response coverage,
  skipped files and matched/rejected/out-of-scope candidates. Partial results carry
  an explicit warning, not a claim of a clean repository. Preview and mock remain
  labeled; valid response coverage is not proof of semantic correctness.
- Repository ancestor aliases are allowed and canonicalized. The final selected
  root cannot itself be a link. Task-file paths remain stricter: no linked path
  components. All reads still assume a stable tree; hostile replacement races
  are not solved by this milestone.

Import detection is a lexical heuristic, not a language parser. Multiline imports,
dynamic imports, require calls, aliases, package resolution and reverse callers
are not resolved. Import-like text may be mistaken for a declaration. Even with
dependency grouping, context caps can omit necessary code. This is not automatic
whole-repository batching; selected/skipped coverage remains essential.

## Repeatable quality evaluation

fixtures/evaluation/cases.json defines six version-controlled cases: seeded
removal bug, clean removal control and cross-file validation guard, each alone
and alongside unrelated code. Ground-truth descriptions are never sent as reviewer
instructions. runEvaluationCase accepts an explicit transport; it does not read
credentials, choose a paid provider or extend a spending allowance.

From a checkout, replay recorded provider envelopes without network access:

```powershell
npm run evaluate -- path/to/recorded-responses.json
```

Input shape:

```json
{
  "model": "recorded-model-name",
  "responses": {
    "seeded-isolated": {"status": 200, "body": "<Responses JSON envelope>", "costUsd": 0.001}
  },
  "assessments": [
    {"caseId": "seeded-isolated", "candidateIndex": 0, "verdict": "confirmed", "bugId": "missing-value-removal"}
  ]
}
```

Supply all six case IDs for a complete score. Missing/failed cases and unassessed
candidates prevent a complete semantic score. Human review labels candidates as
confirmed, false-positive or uncertain; confirmed labels must reference a known
bug. A confirmed label with rejected citations cannot count as an evidence-backed
detection and leaves the score incomplete. Matching citations alone do not count as detections. Scores include detected
and missed bugs, false positives, citation acceptance and cost when supplied.
Compare modes by recording and scoring the same cases separately. Replay elapsed
times measure local decoding, not original provider latency. Recorded costs are
caller-provided values, not billing API verification. The command is checkout
development tooling, not a packaged runtime command.

## Observed live evaluation — 2026-09-27

Using the existing authorization for AI audit calls, the fixed six-case low-cost
run reserved at most $0.012192 across six requests, with no retries. All six
completed. Both seeded bugs were found, four clean controls produced no candidates,
and both citations passed exact verification. Manual inspection confirmed both
diagnoses. Conservative priced token usage totaled $0.000587 (not an invoice).

The separate ledger is <user home>/.shipcheck/p6-1-evaluation-2026-09-27.
Original reports and annotations are saved locally under .release-check.
Prior ledgers and normal CLI spending controls are unchanged.

This is one small low-cost-model run, not a broad benchmark or a controlled
before/after comparison with the larger self-audit. Balanced/high-quality modes
were not rerun in P6.1. The evaluator supports comparing their recorded results
later without implying that untested modes improved.
