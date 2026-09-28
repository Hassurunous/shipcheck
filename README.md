# Shipcheck

Shipcheck is a local review tool for AI-assisted software development.
**Status: pre-alpha, local v0.1 release preparation.** It provides configurable
repository checks, audit/diff/task workflows, console/JSON/Markdown reports,
and optional AI review with citation checks. Most deterministic checks currently
focus on Node package manifests. P7 adds opt-in external tool commands; normalized
ESLint/Ruff JSON adapters provide multi-language diagnostics. Live whole-repository AI uses a
named persistent allowance; see [live audit budgets](docs/P7_LIVE_AUDITS.md).

## Install from this repository

Requires Node.js 22+ and npm. Git is required for the diff workflow.

```powershell
npm ci
npm run build
npm link
shipcheck help
shipcheck audit .
```

On Windows, ensure `npm prefix -g` is on your user PATH and restart the terminal
after changing PATH. Check `Get-Command shipcheck`. Rebuild after source changes.
Without linking, use `npm run audit -- .` or `node dist/src/cli.js audit .`.
Use `npm run audit`, not `npm audit` (which is npm's dependency security command).

## Commands

```powershell
shipcheck audit .
shipcheck diff . --json
shipcheck task tasks/example.json
shipcheck audit . --markdown > report.md
shipcheck audit . --ai preview
shipcheck audit fixtures/demo --ai mock
shipcheck help audit
```

- **audit:** configured repository checks. Replaces the removed review command.
- **diff:** current contents of changed files versus HEAD, including staged,
  unstaged, and untracked non-ignored files. Requires the Git repository root
  and a valid HEAD. It does not analyze patch hunks or establish regressions.
- **task:** files selected by a JSON task; acceptance criteria require human
  confirmation. Repository paths resolve relative to the task file.

All workflows are offline by default. They do not execute project scripts or
modify source. --json and --markdown are mutually exclusive. Reports go to
stdout, diagnostics to stderr. Redirection saves a report; choose a path outside
the audited tree to avoid including a previous report in later inspection.
Exit codes: 0 completed without deterministic errors, 1 deterministic error
findings, 2 usage/configuration/inspection/AI failure. AI candidates do not set
exit 1. Bare invocation and an explicit path retain the bootstrap readiness test;
use audit to inspect files. Use `--` before a target starting with a dash.

## Rules and configuration

Create `shipcheck.config.json` in the audited repository root. Missing settings
use defaults; `rules: {}` does not disable checks.

```json
{
  "version": 1,
  "exclude": ["dist/**", "coverage/**"],
  "rules": {"repository/missing-readme": "warning"},
  "overrides": []
}
```

See the [rule catalog](docs/RULES.md), [configuration reference](docs/CONFIGURATION.md),
and [workflow/task format](docs/P5_WORKFLOWS.md). Levels are off/info/warning/error.
Rules include malformed manifests, conflicting lockfiles and missing local
references; README, test detection, entry points and FIXME policies are opt-in.
No linter, type checker or test runner is executed. Zero findings is not proof
of correctness. Inspection ignores .git and node_modules, rejects/skips links,
and bounds reads; .gitignore is not generally interpreted.

## AI and evidence

Preview shows source selection metadata without transmitting it. Mock generates
explicitly synthetic candidates, with no API key or network required. Citation
checks re-read selected source and compare files, ranges and exact excerpts;
matching citations do not establish that the diagnosis is correct.

Legacy trial execution requires --ai live --trial, SHIPCHECK_API_KEY (or the configured ai.apiKeyEnv), and an
initialized persistent trial allowance. The approved development trial is
complete and exhausted. Its fixed pricing approval expires October 3, 2026 UTC.
This is not an ongoing production spending policy. Do not delete the ledger to
reset spending. See [AI limits](docs/P3_AI.md), [trial results](docs/LIVE_TRIAL.md),
and [citation verification](docs/P4_VERIFICATION.md).

## Offline demonstration

```powershell
shipcheck audit fixtures/demo --markdown
```

Expected: two warnings (missing-script-target and source/fixme), exit 0. Add
--ai mock for a synthetic AI candidate with a matching citation. No spending.

## Local package and development

```powershell
npm run typecheck
npm test
npm pack
npm install --global ./shipcheck-0.1.0.tgz
```

Packing builds first. The package includes compiled source, docs, and the offline
demo, excluding tests and credentials. It remains private to prevent accidental
registry publication; local tarball installation is supported. The demo is inside
the installed package's fixtures/demo directory. The example task in tasks/
targets checkout source and is intended for repository users.

Library exports include inspectRepository, reviewRepository, reviewWithAi,
runWorkflow, and renderConsoleReport/renderJsonReport/renderMarkdownReport.
Renderers return strings; they do not write files. For development use
`npm run dev -- audit .` and `npm run test:watch`.

See [release checks](docs/RELEASE_CHECKLIST.md), [product](docs/PRODUCT.md),
[architecture](docs/ARCHITECTURE.md), and [milestone backlog](tasks/backlog.md).

## Audit reliability (P6.1)

AI requests use explicit line numbers and bounded local-import context. Reports
show missing dependency context, skipped/failed coverage and rejected citations.
Empty diffs skip inspection. See [P6.1 behavior and evaluation](docs/P6_1_AUDIT_RELIABILITY.md).
For checkout-only offline replay: `npm run evaluate -- recorded-responses.json`.
## P7 setup

Shipcheck supports explicitly authorized external checks and whole-repository AI
previews/mocks. Configure `checks`, `ai.apiKeyEnv`, `ai.focus`, and `ai.scope` in
`shipcheck.config.json`. See [P7 configuration](docs/P7_CONFIGURATION.md) for
JavaScript/Python examples, importing the API, execution limits, and remaining work.

```powershell
shipcheck audit . --run-checks --json
shipcheck audit . --ai preview --whole-repository --json
```

Whole-repository paid AI uses `--ai live --budget <name>` after explicit budget
initialization. See [live audit commands and limits](docs/P7_LIVE_AUDITS.md).
Preview/mock do not diagnose bugs.

See [structured linter checks](docs/P7_STRUCTURED_CHECKS.md) for ESLint/Ruff examples,
language selection, severity thresholds, and diagnostic fields for developer agents.

## Reference resources and roadmap

P8 has started with [local reference loading](docs/P8_REFERENCE_RESOURCES.md):
configure document/contract paths and inspect bounded snapshots, hashes and loading
statuses. [P12](docs/P12_REFERENCE_AUDITS.md) integrates local references into bounded AI requests.
[P11 task auditing](docs/P11_TASK_AUDITING.md)
documents the inline `currentTask` configuration and `shipcheck task` workflow.
Task criteria remain explicitly unassessed; requirement-aware AI review is pending.

[P9 contract auditing](docs/P9_CONTRACT_AUDITING.md) has started with an exported
offline OpenAPI operation index. CLI integration and source/contract comparisons
remain pending.

[P10 intent policies](docs/P10_INTENT_POLICIES.md) now provides a library foundation
for requirement identities and forbidden dependency boundaries. It evaluates
supplied observations only; automatic source extraction and CLI integration are pending.
