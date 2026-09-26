# Shipcheck

Shipcheck is an independent review layer for
AI-assisted software development.

## Planned v0.1 workflows

shipcheck audit .
shipcheck diff .
shipcheck task <task-file>

Current status: pre-alpha, with repository inspection, deterministic package
findings, and console/JSON reporting available as a local TypeScript/JavaScript
API. The CLI still prints its target/readiness smoke test. These command
workflows and AI review are not implemented yet. P2 rules validate package JSON,
the top-level object, and script structure; they do not assess overall quality.

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
