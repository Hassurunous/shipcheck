# P24 — Real-project qualification (in progress)

P24 evaluates usefulness in real development. It does not add an autonomous fixer
or claim general accuracy. P23 remains the latest completed milestone.

## Completion criteria

- Run a baseline full audit in an owner-selected external project. Record the
  revision, dirty-file hashes, Shipcheck version, configuration hash, tool versions,
  commands, exits, report bytes and explicit stage/coverage limitations.
- Review every claim in the declared inventory, including unexpected findings.
  Record confirmed, false-positive or uncertain judgments with reviewer and
  rationale. A confirmed new issue need not match a previously known defect.
- Conduct a bounded developer repair loop in an isolated copy with authorized
  source edits, frozen requirements/configuration and independent project tests.
  Record before/after reports, changes, iterations and why the loop stopped.
  Shipcheck itself continues to have no editing authority.
- Freeze historical buggy/fixed pairs from at least three projects and two
  languages, targeting 20 pairs for an initial pilot. Record upstream provenance,
  license, revisions, bug evidence and reproducer results. Reject unreproducible
  pairs rather than inventing ground truth. Keep fixes and hidden regression
  tests out of audit context; record any prior knowledge or non-blind review.
- Score offline results separately from any explicitly budgeted AI experiment.
  Report per-project results, known-defect detection, false positives, uncertain
  judgments and repair discrimination. Fixed revisions are not presumed bug-free.
  No universal accuracy claim or release threshold follows from this pilot.

Project choice and permission for developer edits are required before the repair
trial. Initial work is offline. Earlier milestone API allowances are not reused.
Cross-platform qualification and public publication remain separate milestones.

## Qualification record and scoring

Build, then run:

```powershell
npm run build
node scripts/score-project-qualification.mjs qualification.json report.json
```

The scorer verifies the SHA-256 of the exact saved report bytes. Review records
contain these fields (hash and IDs must come from the actual experiment):

```text
schemaVersion: 1
project: repository identity
revision: pinned source revision
reportSha256: SHA-256 of report.json bytes
inventoryScope: exact claim inventory and any excluded report sections
coverage: complete-for-declared-scope | incomplete
knownDefectIds: unique known bug IDs, or [] for an exploratory baseline
claimIds: unique IDs of every claim in the declared inventory
assessments: [{ claimId, reportSha256, reviewer, rationale,
                verdict: confirmed | false-positive | uncertain,
                knownDefectIds: [] or confirmed known bug IDs }]
```

Claim inventory and coverage are **reviewer declarations**. This initial tool
does not extract claims or certify inventory completeness, source provenance,
reviewer independence, or report authenticity. Inspect the full report before
declaring coverage complete; an exit of zero is insufficient. Include tool
diagnostics and AI findings as well as deterministic findings, and document
unsupported sections. Missing or uncertain labels stay unassessed. Incomplete
coverage or unresolved labels leave undetected known defects unresolved rather
than established misses. Multiple claims for one known defect count once toward
detection. Confirmed unexpected issues count toward adjudicated precision.

Adjudicated precision covers resolved claims only and must always be read beside
the unassessed count. Known-defect detection covers only the listed bugs, not all
defects present. Neither metric establishes general accuracy. The prior synthetic
fixture scorer intentionally retains its closed-corpus assumptions.

Store raw reports, labels and source copies under ignored `.release-check/p24/`
or an approved external output directory. Review reports for sensitive material
before sharing. Publish only reviewed aggregate evidence and provenance that may
legally be redistributed. Do not commit credentials or private project sources.

## Current evidence

Qualification record validation and scoring are implemented. The owner-selected
[commander-tracker baseline](P24_COMMANDER_TRACKER.md) is captured and reviewed.
One supervised icon-repair trial is complete: baseline failed, a separate
developer task repaired the public assets, and its audit plus the supervisor's
independent rerun passed. Historical corpus evaluation remains pending. Unit
tests of scoring establish bookkeeping behavior, not audit accuracy. No P24
live calls or API spending have occurred.

## Agent-led configuration follow-up

[Shipcheck configuration setup for agents](AGENT_CONFIGURATION.md) is the reusable
onboarding procedure. A second developer assignment uses that guide to configure
a fresh Commander Tracker copy with project-owned checks and helpers. It must
preserve the first trial, avoid supervisor temporary-path dependencies, exercise
authorization and negative cases, and report guide shortcomings. This assignment
completed and passed supervisor review. The agent produced project-relative
configuration, fresh-build/asset-verification helpers and a project handoff.
Missing authorization exited 2; authorized execution passed; a disposable
missing-icon fixture failed, then passed after restoration. A supervisor rerun
through the real CLI independently passed all four checks. The first trial
remained unchanged. See [the qualification record](P24_COMMANDER_TRACKER.md).
This is one supervised onboarding example, not evidence that arbitrary projects
can be configured correctly without review.
