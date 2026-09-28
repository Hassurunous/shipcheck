# P13 — Requirement-aware task audits

P13 adds evidence-backed, per-criterion AI assessments to both inline `currentTask`
and existing task files. It is complete for bounded task-file selection; it does not
prove task completion or automatically edit code, configuration or requirements.

## Usage

Define `currentTask` as shown in [P11](P11_TASK_AUDITING.md), then run from the
repository root:

```powershell
shipcheck task --ai preview --json
shipcheck task --ai mock --json
shipcheck task --ai live --budget development --json
```

Live requires credentials and an initialized allowance. Preview sends nothing.
Mock produces synthetic insufficient-evidence outcomes. Without `--ai`, task
selection/deterministic findings work as before and requirements remain unassessed.
`shipcheck task tasks/example.json --ai preview --json` preserves explicit task-file
support: legacy criterion strings receive positional IDs `criterion-1`, etc. Changing
their order changes identity. Inline stable IDs are preferable for ongoing work.
Repository `audit` and `diff` never implicitly assess `currentTask`.

## Assessments and evidence

The response must contain exactly one assessment for every supplied requirement ID.
Duplicate, omitted or unknown IDs, unknown related IDs and citations outside supplied
context fail the AI stage. Each assessment contains an explanation, related criterion
IDs and source/reference evidence where available:

- `supporting-evidence`: cited source supports the expectation; it is not proof.
- `potential-violation`: cited source appears inconsistent with the requirement.
- `insufficient-evidence`: necessary context or runtime evidence is unavailable.
- `needs-clarification`: expectations are ambiguous, incompatible or depend on a
  disputed reference. Conflicting criteria can cite each other's IDs without source
  evidence because the conflict is in the supplied expectations themselves.

Supporting/violating assessments must cite selected task source. Exact excerpts are
verified against submitted and freshly read source/reference content. Invalid
citations downgrade the effective outcome to insufficient evidence. Supporting
claims are also downgraded when selected files, imported dependencies or applicable
reference context are incomplete. Reference disputes produce clarification outcomes.
The original model status is retained as `proposedStatus`; consumers must use the
effective `status`. Semantic interpretation remains unverified even when text matches.

`currentTask` in the report summarizes IDs, text, hash and effective outcomes.
`ai.taskReview` provides full assessments, citation checks and task freshness.
Its `state` is `not-assessed`, `assessed`, `partial` or `changed`. **Assessed means an
assessment was produced, not that criteria passed**; it can include violations.
An unchanged task with uncertainty/clarification has partial assessment. AI coverage
also remains partial when the task assessment is incomplete.

Existing exit codes remain unchanged. AI requirement outcomes do not independently
set exit code 1. Agents must inspect statuses, freshness, evidence verification and
coverage; exit code 0 is never a task-completion decision. General AI candidates,
deterministic findings, external-check output and task assessments remain separate.

## Context and ownership boundaries

Task title, description, requirements, selected paths and non-goals are supplied to
the reviewer as untrusted expectations, never instructions to change role, execute
commands or suppress findings. Only the normalized task definition is included;
unrelated configuration and credentials are not. Likely credential-like task text
blocks AI preparation, but heuristics are not a complete secret scanner.

Task bytes are reserved within `ai.maxContextBytes` before source/reference
selection. The entire task must fit with at least 256 bytes available for source.
Numbered wrappers, schema and prompts add request overhead covered by full live
token counting and spending reservations. Large tasks may exceed context or output
limits; reduce their scope instead of treating a failed response as completion.

The normalized task hash is checked after AI review and again after authorized
external checks. Changed, missing or invalid task definitions invalidate effective
assessments. Explicit task-file repository changes also invalidate results. This is
change detection over a stable local workspace, not atomic locking or protection
against a change-and-revert race. Formatting/default normalization is not a semantic
change. The report retains the original assessed task identity.

Users may authorize developer agents to edit expectations. Shipcheck records the
current task, without imposing approval locks or rewriting it. Trusted external
checks retain their existing write-risk boundary. Reviewing tests does not execute
them, and external-check output is not automatically evidence for requirement
satisfaction. The library `reviewWithAi` task option requires a `reloadTask` callback
to establish freshness; missing reload capability invalidates task assessments.

## Validation

Offline tests cover identity completeness, fake/changed evidence, task changes,
excluded files, uncertain outcomes, reference conflicts, task-size/credential guards,
post-check mutation and legacy compatibility. [P13 evaluation](P13_EVALUATION.md)
records five live fixtures and reproducible scoring. Broad quality claims and
developer-agent-loop validation remain P18.
