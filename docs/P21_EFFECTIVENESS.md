# P21 — Measured audit effectiveness

P21 adds a frozen evaluation corpus, a report scorer, reproducible offline/live
runners and a supervised developer repair protocol. It does not add product
analyzers or change audit prompts, exit codes, authorization or repair behavior.
Shipcheck still does not edit source. Evaluation is development tooling run from
the source checkout, not a new end-user audit command.

## Corpus and scoring

The 20 cases in fixtures/effectiveness/cases.json were defined before the measured
runs: nine single-defect cases, nine paired clean controls and two intentionally
incomplete cases. Corpus SHA-256:

18cbb9f33973860b7dd33aae0379413aaa3bf80a598c5b54017ed4bc21eaf4fa

The cases exercise existing JS/TS/Python checks, explicit HTTP and architecture
policies, a declared executable test, an untested edge case, a cross-file units
mismatch and a concurrent lost update. They are small authored fixtures, not
representative samples of real-world repositories. Expected bug labels and hidden
oracles are never transmitted to the model. Relevant intent documents and declared
source/test files are supplied equally to the offline and AI-enhanced workflows.
Hidden semantic oracles independently confirm the edge, units and race fixture
outcomes after each audit; their code is not part of the audited input.

The scorer matches prescribed deterministic signals for each seeded bug. A failed
check is not automatically a true positive for every bug. Duplicate tool/AI claims
about one bug count once. Operational errors, missing required checks, incomplete
contracts, missing source, stale AI context and unassessed AI claims remain distinct
from a completed audit that missed a defect. The detection fraction uses all expected
bugs; it does not silently drop unresolved cases from its denominator.

AI claims require fresh reviewer labels bound to the exact report hash, claim ID
and expected bug ID. Citation matching alone never establishes correctness. Unknown,
stale and duplicate labels are rejected. Preview/mock reports cannot establish live
AI detection. Unexpected extra claims count separately from whether the seeded bug
was caught. This is a fixture-specific scoring scheme, not an automatic semantic
judge for arbitrary project reports.

## Observed results, 2026-10-08

Windows x64, Node 22.23.3, ESLint 10.11.0, Ruff 0.16.9, TypeScript 7.0.2.

| Measurement | Offline | Offline plus live AI |
| --- | ---: | ---: |
| Seeded defects detected | 6/9 | 9/9 |
| Missed seeded defects | 3 | 0 |
| Extra false-positive claims | 0 | 1 |
| Clean controls with no claims | 9/9 | 9/9 |
| Intentionally incomplete cases disclosed | 2/2 | 2/2 |

| Seeded defect | Offline result | AI contribution |
| --- | --- | --- |
| Undefined identifier | ESLint detected it | Incorrect extra lint-coverage diagnosis |
| Unused Python import | Ruff detected it | No candidate |
| Invalid TypeScript assignment | Compiler detected it | Confirmed duplicate |
| Misspelled API route | Contract check detected it | Confirmed duplicate |
| Forbidden dependency direction | Architecture check detected it | No candidate |
| Untested zero-count charge | Missed | Confirmed defect |
| Same charge with configured test | Test detected it | Confirmed duplicate |
| Cross-file cents/dollars mismatch | Missed | Confirmed defect |
| Concurrent lost increment | Missed | Confirmed defect |

AI emitted seven candidates: six confirmed, one false positive. The model claimed
that ESLint's **/*.js pattern excluded a root main.js file and recommended changing
lint coverage. The actual ESLint result reported no-undef on that file. Its citations
were exact but its explanation and repair recommendation were wrong; mentioning
the real undefined identifier did not earn a confirmation for this claim.

The nine clean controls remained clear, but that must not hide the false positive
on a defective case. This demonstrates why overall detection and extra incorrect
claims need separate metrics, and why AI should enhance rather than replace the
existing tools. The AI-only confirmed set covers six bugs; the union covers nine.

Semantic labels were reviewed by the Codex assistant that authored the fixtures.
This was not blinded, independently human-scored or a repeated statistical study.
One low-cost model run on tiny examples establishes these observed outcomes only.
It does not establish general race detection, security review, large-repository
accuracy, broad maintainability analysis, or cross-platform qualification.

## Live spending and evidence

The user approved a maximum $1 P21 allowance. The dedicated ledger is
p21-evaluation-20261008. Twenty generation attempts completed, with no retries,
using gpt-6-luna, low-cost mode, low reasoning, standard processing, 2,000 maximum
output tokens and 60-second timeouts. Only synthetic fixture content was sent.

Usage: 15,320 input and 2,258 output tokens. The ledger reports a conservative
priced usage upper bound of **$0.003053**, not an invoice. Permanent reservations
are **$0.125**, leaving **$0.875** unreserved. No locked or unresolved attempt remains.
The remaining allowance was not spent merely because it was available.

The active policy expires October 30, 2026. Its conservative input/cache-write and
output rates were checked against [official pricing](https://developers.openai.com/api/docs/pricing)
and the [model documentation](https://developers.openai.com/api/docs/models/gpt-6-luna).
No pricing constants or expiry were changed for this experiment.

Raw reports, labels and generated outputs remain ignored under .release-check:
p21-offline/evaluation.json, p21-live/evaluation.json, p21-live/reviewed.json and
p21-repair/. They are local experiment artifacts, not distributed runtime data.
The corpus, scoring rules and reproduction commands are versioned. A new run
requires fresh semantic labels; never reuse old labels as proof of a new result.

## Developer repair exercise

The Codex assistant acted as the developer outside Shipcheck. This was a supervised,
fixture-aware exercise, not an independently recruited or blinded developer process.
The initial report exposed a failed acceptance assertion: charge(1) returned 0.07
instead of 7 cents. The corresponding live corpus report identified the same units
mistake. The developer removed the division by 100 in main.mjs and reran the audit.

The first of at most two edit/verify cycles passed. Only main.mjs changed. The
provider, requirements, audit configuration and external verifier kept identical
hashes. The verifier checks every integer input from 0 through 100 against count*7;
Shipcheck invokes it as an explicitly authorized test and consolidates its result.
A separate negative exercise rejected a requirement edit and refused a third cycle.
No patch is implemented inside the audit runtime or repair harness. The harness
only prepares a handoff, records snapshots, runs checks and verifies allowed changes.
Its local state is an accountability aid, not a sandbox against a hostile developer
with permission to modify the harness or its bookkeeping.

## Reproduce from a checkout

Install your preferred supported tool versions separately. These commands do not
install dependencies or initialize/reset spending automatically. Output directories
must be new, so experiments cannot silently overwrite their earlier evidence.

```powershell
npm run build
node scripts/effectiveness-evaluate.mjs --offline .release-check/p21-offline-new <eslint.js> <ruff.exe> <tsc>
node scripts/score-effectiveness.mjs .release-check/p21-offline-new/evaluation.json
node scripts/effectiveness-loop.mjs --prepare .release-check/p21-repair-new
# Give its HANDOFF.md and before.json to the developer; only main.mjs may change.
node scripts/effectiveness-loop.mjs --verify .release-check/p21-repair-new
```

A future paid run requires explicit authorization, credentials and an existing
resolved budget of at most $1. Use a new output directory and review every candidate.

```powershell
node scripts/effectiveness-evaluate.mjs --live .release-check/p21-live-new <eslint.js> <ruff.exe> <tsc> <existing-budget>
node scripts/score-effectiveness.mjs .release-check/p21-live-new/reviewed.json
```

Create reviewed.json as a copy of evaluation.json with a fresh assessments array.
Each label has caseId, reportHash (from measurements), claimId (ai:0, ai:1, or
conflict:0), verdict (confirmed, false-positive or uncertain), rationale, and bugId
for a confirmed seeded defect. score-effectiveness recomputes results; the original
summary in evaluation.json remains the unreviewed result. No automatic labels are
created from model confidence, title matching or citations.

The runner stops paid evaluation at the first non-completed AI stage and preserves
its durable reservation. Stop/resume is manual; it never silently retries a case.
Do not compare different corpus hashes or tool setups as if they were one experiment.

## Recommended next implementation work

1. Give the AI bounded, structured evidence of which external checks actually ran
   and what they reported. Today it receives source/reference context, not these
   results. Evaluate whether that reduces contradicted tool-coverage claims; do not
   assume that additional context guarantees correctness or treat tool text as instructions.
2. Make required project checks easier for developer callers to enforce. This run
   showed the same edge defect was caught offline only when a useful test was configured.
3. Extend targeted offline coverage and Python typechecking integrations using
   real analyzer output. Add defect/clean pairs before claiming new coverage.
4. Expand to larger external projects, more languages, independent reviewers and
   genuinely independent developer loops. Preserve false positives and misses in
   published measurements rather than tuning away difficult cases.

These are proposed follow-ups, not implemented analyzer improvements or new
milestone approvals. Existing platform and public-release decisions remain separate.

## Regression verification

Typecheck and build passed. All 603 tests passed with two test workers, and all
26 executable CLI acceptance groups passed. The first default-concurrency run
had one pre-existing architecture file-cap test exceed its five-second timeout;
its 36-test module passed alone, then the entire suite passed at reduced concurrency.
No product/test timeout was changed. A final offline corpus rerun reproduced all
case scores, and saved live reports were re-scored without additional API calls.
