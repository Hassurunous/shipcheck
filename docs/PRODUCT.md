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
LIVE_TRIAL.md. P7 adds named persistent allowances for repeated/batched audits;
see P7_LIVE_AUDITS.md for limits and pricing expiry.
P4 now checks AI evidence files, line ranges, and exact excerpts; semantic
verification remains future work. P5 implements those workflows, and P6 prepares a release. The
P2.5 audit follow-ups are resolved. Mock AI candidates are not real diagnoses.

Find meaningful software problems using a combination
of deterministic analysis and specialized AI review,
and support every reported finding with evidence.

## Post-release direction

P6 remains focused on release preparation for the current implementation.
P6.1 strengthens citation/context reliability and evaluation of the current reviewer.
P7 is in progress: configurable external commands and whole-repository AI batching
with explicit named budgets are implemented; see P7_CONFIGURATION.md for limits.
P7 now provides ESLint/Ruff JSON adapters, language-based check selection and
severity thresholds for a developer-agent feedback workflow: a separate developer process edits code, invokes Shipcheck, consumes
its report, and iterates. Shipcheck remains the reviewer and does not modify
code. Planned checks will reuse established language tools, with explicit
execution authorization and bounded execution. AI candidates will remain
distinct from deterministic failures; a clean report will not prove correctness.
P8 adds explicit reference resources, reproducible snapshots and evidence handling.
P9/P10 cover contract auditing and requirements/architecture policies. P11 adds
inline current-task auditing; see `docs/P11_TASK_AUDITING.md`. Users may authorize
their developer agents to change requirements. Shipcheck assesses the current
expectations and reports their identity without imposing approval/locking rules.
Shipcheck and its AI reviewers do not edit source, task definitions or configuration.
External check programs must be trusted and configured for inspection: they run
with user permissions and are not a read-only sandbox. Budget records and explicitly
requested report files are separate permitted outputs. See `tasks/backlog.md`.

P12 completes local reference-aware AI requests with bounded selection, cross-file
citations and explicit reference-conflict outcomes. Its four-case low-cost live
evaluation passed; see P12_EVALUATION.md for limits. P13 adds bounded task requirement
assessments with citation verification and task freshness; its five live fixtures
met expectations (P13_EVALUATION.md). External reference sources remain P16.

## Non-goals for the current release

- No web dashboard
- No accounts
- No database
- No hosted backend
- No IDE plugin
- No automated code modification
- No pull request integration
- No payment system
