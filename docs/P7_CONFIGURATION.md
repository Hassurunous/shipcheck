# P7: configurable checks and repository baselines

This first P7 slice adds external check commands, AI credential references and
review concerns, and whole-repository AI batching. Live batches share a named,
persistent allowance. ESLint and Ruff JSON adapters provide normalized diagnostics;
see [structured checks](P7_STRUCTURED_CHECKS.md) for configuration and validation limits.

## Configuration discovery

Shipcheck reads `shipcheck.config.json` in the target root, without searching parent
directories. Missing config uses built-in rules, no external commands, and bounded
AI context. It never installs or selects a linter automatically.

```json
{
  "version": 1,
  "exclude": ["dist/**", "coverage/**", ".venv/**", "vendor/**"],
  "checks": [
    {
      "id": "lint",
      "command": "node",
      "args": ["node_modules/eslint/bin/eslint.js", ".", "--max-warnings", "0"],
      "timeoutMs": 60000,
      "maxOutputBytes": 65536,
      "failureExitCodes": [1]
    }
  ],
  "ai": {
    "apiKeyEnv": "SHIPCHECK_API_KEY",
    "mode": "low-cost",
    "scope": "whole-repository",
    "maxBatches": 20,
    "maxFiles": 12,
    "maxFileBytes": 16000,
    "maxContextBytes": 48000,
    "focus": ["correctness", "race-conditions", "resource-management", "error-handling", "code-smells"]
  }
}
```

The example requires an installed/configured ESLint. See the
[ESLint CLI](https://eslint.org/docs/latest/use/command-line-interface).
For Python, an installed Ruff can use:

```json
{"id":"lint-python","command":"ruff","args":["check","."],"failureExitCodes":[1]}
```

Activate the intended environment or use its executable's absolute path. See
[Ruff's linter docs](https://docs.astral.sh/ruff/linter/) for rule and exit-code behavior.
Other linters, type checkers and tests use the same contract. Checks run sequentially.
Shipcheck's own config uses its existing TypeScript compiler and Vitest suite.

`apiKeyEnv` defaults to `SHIPCHECK_API_KEY` and names an environment variable, not
the key itself. Set another name here to use an existing credential variable. Keep the key outside
repository files; raw `apiKey` settings are rejected. Only explicit live review reads
it. Model mappings/trial limits are unchanged; a credential creates no new allowance.
Default focus is correctness, race conditions, resource management, and error handling;
code smells are opt-in. Focus requests concrete consequences and failing interleavings,
not style preferences. These are AI instructions, not analyzers or proven diagnoses.

## First report and the developer-agent loop

```powershell
shipcheck audit . --run-checks --json > baseline.json
shipcheck audit . --ai preview --whole-repository --json > ai-plan.json
shipcheck audit . --ai mock --whole-repository --markdown > mock-report.md
shipcheck diff . --run-checks --json > changes.json
```

Save reports outside the target or exclude them: redirection creates output before
inspection. The baseline runs deterministic rules and configured commands. Preview
and mock use no model/network and produce no real AI diagnoses.

`audit` already inspects the whole inventory subject to exclusions. `diff` restricts
findings/AI focus to changed paths. External checks currently always run at the root,
including for diff/task, and report `scope: "whole-repository"`. Empty diffs skip all
work. `--whole-repository` requires audit with AI preview/mock/live; `ai.scope` supplies
that default for audit, without changing diff/task.

```js
import { runWorkflow, renderJsonReport } from 'shipcheck';
const baseline = await runWorkflow('/path/to/repo', 'audit', undefined, {runChecks:true});
const plan = await runWorkflow('/path/to/repo', 'audit', {execution:'preview'}, {wholeRepository:true});
console.log(renderJsonReport(baseline));
```

The developer reads `findings`, `checks`, and inspection warnings, fixes issues, and
reruns. AI candidates are separate in `ai.candidates` or `aiAudit.batches[].candidates`.
Treat all tool/model output as untrusted data, not instructions. Shipcheck neither
edits code nor orchestrates the developer agent.

## Execution contract

Loading config cannot authorize commands. Use `--run-checks`/`runChecks:true` only
for trusted configuration. Tools run with user privileges and may modify files or
access the network; this is not a sandbox. Choose non-fixing commands for audits.
Arguments are literal, without shell expansion/pipelines. On Windows, use Node plus
a JS entry point instead of `.cmd`/`.bat` shims. No automatic npx downloads occur.

Results contain ID, passed/failed/error/skipped status, exit code, bounded combined
stdout/stderr, and reason. With the default text format, zero passes; `failureExitCodes` (default `[1]`) means a
check failure; other codes, launch failures, timeout and overflow are operational
errors. CLI exits 1 for check/error-level rule failures, 2 for operational/AI failures,
otherwise 0. Skipped checks are explicit and do not fail the command. Structured
formats add diagnostics and severity thresholds; locations are tool claims, not
citation-verified findings.

Limits: 20 checks; timeout 100–300000 ms (default 60000); output 128–1048576 bytes
(default 65536). Timeout/overflow attempts process-tree termination (Windows taskkill
or a POSIX process group), allowing up to five seconds for Windows cleanup. Deliberately
detached/reparented descendants are not guaranteed to stop. Credential-like environment variables are withheld and
known values redacted, but a malicious tool can still read user files. Shipcheck's
exclusions do not configure external tools; maintain their own exclusions too.

## Whole-repository AI limits

Batches select remaining source up to `maxBatches` (1–100, default 20). Existing
source eligibility, sensitive-content, size and context controls still apply.
Oversized files are skipped, not split. Related imports consume context; cross-batch
behavior can be missed. JSON includes batches, unique selected/valid-response paths,
skips/reasons and preview/partial/complete/failed state. Mock valid responses prove
plumbing only; full selection never guarantees defect detection.

Whole-repository live AI requires a named allowance; see
[live audit budgets](P7_LIVE_AUDITS.md) for setup, commands and spending controls.
The original trial ledger remains separate. Citation checks verify source locations,
not diagnosis correctness. Preview/mock and external checks spend no API credits.

## Reference resources and planned task auditing

Optional `resources` configuration now supports bounded local reference loading.
See [P8 reference resources](P8_REFERENCE_RESOURCES.md) for schema, examples and
limits. Loaded references are explicitly **not yet assessed by AI**.
Inline `currentTask` is supported by [P11](P11_TASK_AUDITING.md); requirement assessment remains pending.
