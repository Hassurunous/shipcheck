# P13 evaluation

Five tiny live CLI tasks ran on 2026-09-28 UTC using `gpt-6-luna`, low reasoning,
standard processing and a 2,000-output-token limit. They reused the existing
`p12-validation-20260928` allowance and did not initialize a new budget or retry.

| Fixture | Expected and observed result |
| --- | --- |
| fulfilled | supporting-evidence for returning the required 7 cents |
| violated | potential-violation for returning 5 rather than 7 |
| ambiguous | needs-clarification for an undefined reasonable fee |
| conflicting | needs-clarification for both incompatible criteria, each identifying the other |
| runtime-unknown | insufficient-evidence for historical uptime without telemetry |

All five completed, covering six criteria. Every emitted citation matched. Source
and task configuration remained byte-for-byte unchanged. The Codex assistant
reviewed explanations against the fixture expectations and recorded explicit labels;
these are **not independent human judgments**. The tiny corpus establishes these
workflow behaviors, not broad correctness or model reliability.

P13 recorded 4,784 input and 746 output tokens. The conservative priced usage
upper bound was **$0.000973**, with **$0.03125** permanently reserved. Including P12,
the shared ledger totals **$0.00176** priced usage and **$0.05625** reserved, leaving
**$0.94375** unreserved under the original $1 cap. No attempts are unresolved. Usage
figures are ledger estimates, not an invoice. Pricing sources and expiry remain
those documented in [P12 evaluation](P12_EVALUATION.md).

Sanitized reports, fixtures and semantic labels are in `fixtures/task-evaluation`.
Offline scoring requires labels plus expected statuses, fresh task identity and
verified citations; it cannot count a stale or unlabelled assessment as passed.

```powershell
npm run build
node scripts/score-task-evaluation.mjs fixtures/task-evaluation/recorded-low-cost.json
```

To repeat live only with spending authorization, credentials and an existing budget:

```powershell
node scripts/task-evaluate.mjs --live <existing-budget> <new-output-directory>
```

The runner refuses to overwrite output, uses the no-file `task` CLI in temporary
repositories, checks source/configuration preservation, saves results, and stops on
operational failure. New responses need new semantic review; recorded labels are
not automatically transferable to later model runs.
