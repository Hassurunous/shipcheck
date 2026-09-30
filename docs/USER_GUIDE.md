# Using Shipcheck

Shipcheck audits code and reports evidence. Your editor or developer agent makes
changes. Shipcheck does not repair source, rewrite requirements or decide that a
project is complete. Start offline; opt into local tools, external references and
paid AI separately when needed.

## Install and verify

Use Node.js 22+ and npm. In the downloaded Shipcheck repository:

Qualification currently covers Windows x64 with Node.js 22 only. macOS and Linux
still require installation, CLI, native-parser and process-cleanup testing;
compatibility on those operating systems is unverified.

```powershell
npm ci
npm run build
npm link
shipcheck help
shipcheck audit fixtures/demo --json
```

The demo has two warnings and exits 0. On Windows, restart PowerShell after PATH
changes; `Get-Command shipcheck` should resolve the launcher. Without linking, use
`node dist/src/cli.js audit <repository>`. From another directory, supply the
absolute path to that CLI. Bare `shipcheck` is only a readiness message.

For local distribution, `npm pack` builds a tarball; install that exact tarball
with `npm install --global ./shipcheck-0.1.0.tgz`. The package is private and is
not published to the npm registry. Rebuild after source changes. Pin the package
artifact or Git commit used by automation; the pre-alpha version alone does not
identify every development change.

## Set expectations in the target repository

Create `shipcheck.config.json` at its root. Example for a repository with
`src/client.ts` (replace task paths and requirements with your own):

```json
{
  "version": 1,
  "exclude": ["dist/**", "coverage/**"],
  "rules": {"repository/missing-readme":"warning"},
  "ai": {"apiKeyEnv":"SHIPCHECK_API_KEY", "mode":"low-cost"},
  "currentTask": {
    "id":"client-errors",
    "title":"Handle unavailable users",
    "files":["src/client.ts"],
    "requirements":[{"id":"not-found","text":"A missing user produces a documented not-found result."}],
    "nonGoals":["Do not change authentication behavior."]
  }
}
```

Run commands from the target root:

```powershell
shipcheck audit . --json
shipcheck diff . --json
shipcheck task --json
shipcheck task --ai preview --json
```

| Workflow | What it selects | Important limit |
| --- | --- | --- |
| `audit .` | Repository checks | AI remains bounded unless whole-repository batching is selected |
| `diff .` | Changed files versus HEAD, including staged, unstaged and untracked files | Requires Git root and HEAD; analyzes current files, not patch semantics; empty diffs skip stages |
| `task` | Inline `currentTask.files` | Run from the configured repository; offline requirements are unassessed |
| `task path/to/task.json` | Explicit legacy JSON task | Its repository path resolves relative to that file |

Task and contract file lists are explicit paths, not globs. Architecture selectors
and exclusions have their own documented glob subset. General inspection skips
`.git` and `node_modules`, but does not apply `.gitignore`. Add generated output
and report directories to exclusions, or save reports outside the audited tree.

## Choose checks

There is no default linter installation or automatic project-script execution.
Configure trusted inspection commands in `checks`, then pass `--run-checks`.
Checks have whole-repository scope even during diff/task runs. They run with your
permissions, so review commands before authorizing them; recognized fixing flags
are rejected, but arbitrary programs are not sandboxed read-only.

| Need | Configuration and reference |
| --- | --- |
| Manifest and optional repository rules | [Rules](RULES.md), [configuration](CONFIGURATION.md) |
| ESLint/Ruff or your own test/typecheck command | [Structured checks](P7_STRUCTURED_CHECKS.md), [command configuration](P7_CONFIGURATION.md) |
| Requirements in the same config | [Task definition](P11_TASK_AUDITING.md), [AI assessment](P13_TASK_ASSESSMENT.md) |
| HTTP contract checks in supported languages | [Contract mapping](P14_CONTRACT_CHECKS.md), [language coverage](P14_2_ADDITIONAL_LANGUAGES.md) |
| Import boundaries and filename conventions | [Architecture policies](P15_ARCHITECTURE.md) |
| Documents, another repository, HTTPS or SDK declarations | [Local references](P8_REFERENCE_RESOURCES.md), [external access](P16_EXTERNAL_CONTRACTS.md) |

## Add AI deliberately

First inspect selection without model requests:

```powershell
shipcheck audit . --whole-repository --ai preview --json
```

Whole-repository means batching eligible source within limits, not reading every
byte or proving all behavior. Inspect skipped paths and coverage. Mock mode tests
plumbing with synthetic responses and cannot diagnose your code.

When you explicitly choose paid execution, set the credential in the environment
named by `ai.apiKeyEnv` (default `SHIPCHECK_API_KEY`), not in config. Then initialize
one named allowance and reuse it:

```powershell
shipcheck budget init my-audit --usd 0.50
shipcheck audit . --whole-repository --ai live --budget my-audit --mode low-cost --json
shipcheck budget status my-audit
```

These are opt-in spending instructions, not commands run by this guide. Config
cannot authorize spending. Read [budget policy](P7_LIVE_AUDITS.md) before use:
reservations are permanent, unresolved attempts block further calls, and pricing
approval has an expiry. Do not reset ledgers, change names to bypass exhaustion,
or automatically settle interrupted requests. A budget is not an account-wide cap.
Low-cost, balanced and high-quality modes share the selected allowance.

Reference grants are independent. `--reference-root id=path` allows the specified
secondary root; `--allow-reference-origin https://host` allows pinned HTTPS reads.
Authorized remote references can be fetched even without AI or in preview/mock.

## Read and save results

Console is for people; `--json` is for automation. `--markdown` includes a readable
summary and human-readable report; use JSON to retain all structured metadata. Keep stderr separate from JSON. For PowerShell:

```powershell
shipcheck audit . --json 1> ../shipcheck-report.json 2> ../shipcheck-errors.txt
$auditExit = $LASTEXITCODE
```

Capture the exit immediately. Exit 1 means observed deterministic failures; exit 2
means failure/incomplete configured comparison and may still include useful JSON.
Exit 0 is not a universal pass: skipped checks, inspection warnings, AI uncertainty
and unassessed tasks require review. See the [report contract](REPORT_CONTRACT.md).

If a call fails, inspect its stage, scope, stderr and retained report before retrying.
For AI failures also inspect budget status. If evidence changed, stabilize the tree
and rerun. If requirements conflict or the tool cannot assess a pattern, choose
another check or a human decision instead of treating missing evidence as success.

Use the [agent guide](AGENT_GUIDE.md) for an editing/auditing loop. `npm run verify`
checks Shipcheck itself; it does not run the target project's test suite.

When `--run-checks` is authorized, external checks finish before deterministic and
AI review snapshots are collected. This lets the review see files changed by a
check. Checks remain trusted commands, not a sandbox; prefer inspection-only tools.
Task-definition changes still invalidate task assessment.
