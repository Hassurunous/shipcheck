# Shipcheck

Shipcheck is an independent review layer for
AI-assisted software development.

## v0.1 workflows

shipcheck audit .
shipcheck diff .
shipcheck task <task-file>

Current status: pre-alpha, with repository inspection, deterministic package
findings, and console/JSON reporting available as a local TypeScript/JavaScript
API and a `audit` CLI command with help and JSON output. Audit, diff and structured JSON task workflows are implemented; see P5_WORKFLOWS.md. P3 provides
explicit source-context previews, mocked QA review, and a bounded live trial with
low-cost, balanced, and high-quality modes. P2 rules cover package
structure, lockfile conflicts, and missing local references, with optional
repository policies and configuration. They do not assess overall quality.

## Core promise

Milestone status: P0 bootstrap, P1 inspection, P2 findings/reporters, and the
user-approved P2.5 configurable rules and review/help/version CLI are delivered.
P2.5 makes deterministic review convenient; it does not implement the planned
audit/diff/task workflows. P3's offline implementation and approved $0.50 live
trial are delivered. All three modes passed the tiny fixture smoke test; see
LIVE_TRIAL.md. General recurring live budgets are not implemented.
P4 now checks AI evidence files, line ranges, and exact excerpts; semantic
verification remains future work. P5 implements those workflows, and P6 prepares a release. The
P2.5 audit follow-ups are resolved. Mock AI candidates are not real diagnoses.

Find meaningful software problems using a combination
of deterministic analysis and specialized AI review,
and support every reported finding with evidence.

## Post-release direction

P6 remains focused on release preparation for the current implementation.
P7 will add multi-language check integrations and a developer-agent feedback
workflow: a separate developer process edits code, invokes Shipcheck, consumes
its report, and iterates. Shipcheck remains the reviewer and does not modify
code. Planned checks will reuse established language tools, with explicit
execution authorization and bounded execution. AI candidates will remain
distinct from deterministic failures; a clean report will not prove correctness.
See `tasks/backlog.md` for P7 scope. Further development will use P8 and later
milestone numbers as scope is agreed.

## Non-goals for the current release

- No web dashboard
- No accounts
- No database
- No hosted backend
- No IDE plugin
- No automated code modification
- No pull request integration
- No payment system
