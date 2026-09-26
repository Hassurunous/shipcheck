# Shipcheck

Shipcheck is an independent review layer for
AI-assisted software development.

## Planned v0.1 workflows

shipcheck audit .
shipcheck diff .
shipcheck task <task-file>

Current status: pre-alpha, with repository inspection, deterministic package
findings, and console/JSON reporting available as a local TypeScript/JavaScript
API and a `review` CLI command with help and JSON output. The planned audit,
diff, task workflows and live AI review are not implemented yet. P3 provides
explicit source-context previews and mocked QA review with configurable
low-cost, balanced, and high-quality modes. P2 rules cover package
structure, lockfile conflicts, and missing local references, with optional
repository policies and configuration. They do not assess overall quality.

## Core promise

Milestone status: P0 bootstrap, P1 inspection, P2 findings/reporters, and the
user-approved P2.5 configurable rules and review/help/version CLI are delivered.
P2.5 makes deterministic review convenient; it does not implement the planned
audit/diff/task workflows. P3's offline implementation is delivered; live model
selection, budget agreement, network activation, and evaluation are deferred.
P4 verifies evidence, P5 adds those workflows, and P6 prepares a release. The
P2.5 audit follow-ups are resolved. Mock AI candidates are not real diagnoses.

Find meaningful software problems using a combination
of deterministic analysis and specialized AI review,
and support every reported finding with evidence.

## Non-goals

- No web dashboard
- No accounts
- No database
- No hosted backend
- No IDE plugin
- No automated code modification
- No pull request integration
- No payment system
