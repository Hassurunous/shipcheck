# Shipcheck

Shipcheck is an independent review layer for AI-assisted software development.
It combines deterministic checks and optional AI review, reports evidence and
coverage, and lets a separate developer or developer agent act on the results.
Shipcheck does not modify source, requirements or configuration during an audit.

## Current status

P0–P18 are delivered within their documented scope. Version 0.1.0 is private,
pre-alpha and available for local distribution. Qualification covers **Windows
x64 with Node.js 22 only**; macOS/Linux installation, CLI, native parsers and
process cleanup still need testing. No public npm release is authorized.
See [P18 qualification](P18_QUALIFICATION.md) for the actual experiments and limits,
and the [milestone record](../tasks/backlog.md) for delivery history and follow-ups.

## Workflows

- `shipcheck audit .`: inspect the repository using configured checks.
- `shipcheck diff .`: inspect current files changed relative to Git HEAD.
- `shipcheck task`: inspect files and expectations in configured `currentTask`.
- `shipcheck task <task-file>`: use an explicit structured JSON task instead.

Console, JSON and Markdown reports expose findings, operational failures and
incomplete coverage separately. See the [user guide](USER_GUIDE.md),
[agent operating guide](AGENT_GUIDE.md) and [report contract](REPORT_CONTRACT.md).

## Implemented capabilities

| Capability | Scope and configuration |
| --- | --- |
| Repository inspection and rules | File/language inventory, package structure, local references and optional repository policies; [rules](RULES.md) and [configuration](CONFIGURATION.md) |
| External checks | Explicitly authorized commands, bounded execution, ESLint/Ruff JSON diagnostics and thresholds; [check configuration](P7_CONFIGURATION.md) |
| AI review | Preview, synthetic mock and paid modes; selected-file or whole-repository batching with coverage reporting and persistent allowances; [AI context](P3_AI.md) and [live budgets](P7_LIVE_AUDITS.md) |
| Reference evidence | Scoped local snapshots, cross-file citations, conflicts and freshness checks; [reference-aware audits](P12_REFERENCE_AUDITS.md) |
| Task expectations | Inline or file-based requirements with identity, uncertainty and evidence-based AI assessments; [task assessment](P13_TASK_ASSESSMENT.md) |
| HTTP contracts | Bounded offline JS/TS, Python, Go, C# and Java client patterns compared with OpenAPI snapshots; [supported adapters](P14_2_ADDITIONAL_LANGUAGES.md) |
| Architecture policies | Supported import extraction, prohibited dependency directions and filename conventions; [architecture checks](P15_ARCHITECTURE.md) |
| External interfaces | Explicit secondary-root grants, pinned HTTPS references, semver range checks and narrow installed TypeScript SDK declaration comparisons; [external contracts](P16_EXTERNAL_CONTRACTS.md) |

## Operating boundaries

AI execution, paid spending, external commands and external reference access each
require their documented authorization. Configuration alone does not grant them.
Preview/mock use no model credits; an explicitly granted HTTPS reference can still
be fetched in those modes. Live pricing mappings and expiry are enforced as
specified in the budget documentation.

Shipcheck's AI reviewers receive data and return structured assessments, with no
editing tools or command execution. User-configured external programs run with
user permissions and are not a read-only sandbox. Budget records and explicitly
requested reports are permitted outputs separate from source edits.

Users may authorize developer agents to edit requirements. A task hash identifies
the expectations assessed; it neither proves approval nor preserves original
intent when code and requirements change together.

Citation matching verifies locations and excerpts, not diagnosis correctness.
Unsupported syntax, omitted context and incomplete stages stay visible. No clean
report proves overall correctness, security, runtime integration or task completion.
The bounded qualification corpus and supervised repair loop do not establish
broad autonomous-agent effectiveness.

## Non-goals for the current release

- Web dashboard, accounts, database or hosted backend
- IDE plugin or pull request integration
- Automated code modification or an autonomous developer agent
- Payment system
