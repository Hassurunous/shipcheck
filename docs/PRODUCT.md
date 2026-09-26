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
diff, task workflows and AI review are not implemented yet. P2 rules cover package
structure, lockfile conflicts, and missing local references, with optional
repository policies and configuration. They do not assess overall quality.

## Core promise

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
