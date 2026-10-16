# Shipcheck configuration setup for agents

Use this guide when asked to configure an existing project for Shipcheck. Your
deliverable is a project-owned, reproducible setup another user or agent can run.
Start offline. Shipcheck audits; the developer agent makes authorized edits.

## 1. Inspect the project before choosing checks

Read the project's agent instructions, README, manifests, lockfiles, tool configs,
test commands and CI definitions. Preserve any existing `shipcheck.config.json`.
Identify the audit root, languages, installed tools, source roots, generated
outputs and workspaces. Do not mistake a root TypeScript config containing only
`references` for a config that checks all source files.

Record what you may change: Shipcheck configuration, helper scripts, test files,
ignore entries, documentation, dependencies and requirements are separate choices.
Use the owner's existing authorization; ask only about missing decisions. Do not
invent requirements, install new tools unnecessarily, or weaken existing checks
to obtain a passing report. Keep credentials out of files and command arguments.

Use a trusted installed Shipcheck command. Check `shipcheck --version` and
`shipcheck --help`. If it is not on PATH, use the verified built CLI explicitly:
`node <shipcheck-checkout>/dist/src/cli.js`. Do not silently download an unrelated
package with an unqualified `npx shipcheck` invocation. Record the version/commit.

## 2. Create or merge the root configuration

The exact filename is **`shipcheck.config.json`**, in the repository being audited.
Use strict JSON (no comments). Unknown keys fail validation. Paths/patterns in
Shipcheck settings use `/` and are relative to this root unless the relevant
setting explicitly supports something else. No config includes, environment
variable interpolation or shell expansion should be assumed.

Keep repository-local Git ignores by omitting `exclude`, or explicitly combine
them with audit-only exclusions:

```json
{
  "version": 1,
  "respectGitignore": true,
  "exclude": ["audit-reports/**"]
}
```

Adding `exclude`, even `[]`, otherwise disables Git-ignore inheritance. Shipcheck
never inherits global/ancestor Git ignores. `.git` and `node_modules` are always
skipped during ordinary inspection. Excluding report output from auditing does
not exclude it from Git: add an appropriate `.gitignore` entry if saving it inside
the repository. External tools use their own ignores.

### Choose presets when they match the project

| Preset | Tools | Required slot names |
| --- | --- | --- |
| `javascript` | Project-local ESLint | `eslint` |
| `typescript` | Project-local ESLint and root TypeScript config | `eslint`, `typescript` |
| `python` | Ruff in the local `.venv` | `ruff` |
| `python-types` | Project-local Node installation of Pyright | `pyright` |

Example for a single-root TypeScript project with compatible installed tools:

```json
{
  "version": 1,
  "quality": {
    "presets": ["typescript"],
    "required": ["eslint", "typescript"]
  }
}
```

Presets do not install tools, infer tests or enable execution. See
[exact paths and commands](P20_QUALITY_WORKFLOWS.md) and
[required checks/Pyright](P23_OFFLINE_CHECKS.md). Symlinked tool installations,
workspace layouts and referenced TypeScript projects often need explicit checks.

### Use explicit checks for project-specific commands

The following is a complete alternative example for a Vite-style project with
`tsconfig.app.json` and `tsconfig.node.json`. Adapt the actual filenames and tools;
do not copy this into a different layout unchanged.

```json
{
  "version": 1,
  "respectGitignore": true,
  "exclude": ["audit-reports/**"],
  "quality": {"presets": ["javascript"], "required": ["eslint"]},
  "checks": [
    {
      "id": "types-app",
      "purpose": "typecheck",
      "required": true,
      "command": "node",
      "args": ["node_modules/typescript/bin/tsc", "--project", "tsconfig.app.json", "--noEmit", "--pretty", "false"],
      "failureExitCodes": [1, 2]
    },
    {
      "id": "types-node",
      "purpose": "typecheck",
      "required": true,
      "command": "node",
      "args": ["node_modules/typescript/bin/tsc", "--project", "tsconfig.node.json", "--noEmit", "--pretty", "false"],
      "failureExitCodes": [1, 2]
    }
  ]
}
```

Explicit commands run with the audited root as their working directory, without a
shell. `node` requires a trusted Node installation on PATH. Use project-relative
tool entries rather than another developer's absolute installation path. Avoid
`&&`, redirects, shell variables, and assuming Windows `npm.cmd` works as a direct
executable. For a sequence, use a reviewed project-owned Node helper that launches
tools with `process.execPath`, argument arrays, bounded runtime and `shell: false`.

Add the project's actual tests as separate checks with `purpose: "test"` and
`required: true`. Do not invent a passing placeholder when no tests exist. Supported
structured formats are `eslint-json`, `ruff-json`, and `pyright-json`; otherwise
use `text` (the default), retaining output and exit status. `failureExitCodes`
defaults to `[1]`: configure real tool check-failure codes, never blanket-accept
all nonzero codes. Other exits are operational errors. Helpers should distinguish
assertion failures from launch, build and timeout failures.

Other languages can use explicit checks for their installed linters, compilers
and tests; there is no requirement to use a preset. Verify each tool's actual
scope and exit conventions before configuring it.

Defaults are 60 seconds and 64 KiB per check. `timeoutMs` may be 100–300000 and
`maxOutputBytes` 128–1048576. Choose bounded values for the actual workload, not
unlimited execution. Up to 20 checks are supported, with preset slots counted
conservatively. Preset binding IDs reference an existing explicit check; use
bindings to avoid duplicate execution. See [check settings](P7_CONFIGURATION.md).

## 3. Make artifact checks reproducible

A check of `dist/` can pass against stale output. If checking build artifacts,
either use an explicitly authorized build-then-verify helper or require a fresh
build as a documented prerequisite and capture its source identity. The former
is easier to reproduce with one command. A build failure must stop verification;
never fall back to old output. Use the build tool's supported clean-output behavior
and verify that behavior for the project.

State any outputs the helper writes, such as `dist/` and tool caches. Shipcheck
does not rewrite source, but authorized external commands are not sandboxed and
may have side effects. Do not use fixing flags or source-rewriting commands.
Keep helper scripts, assertions and necessary expected data inside the target
repository, not in a supervisor's temporary evidence directory.

Prefer ordinary project tests over custom verification frameworks. For example,
a small post-build integration test can read the generated PWA manifest and check
that its declared local icons exist inside the build output. Keep build testing
separate from routine lint/type audits when rebuilding on every audit adds little
value. Provide an explicit build-then-test command that stops if the build fails.
Do not require an exact icon list or byte-identical assets unless those are actual
project requirements. Exercise a valid build and a controlled missing-asset case
in disposable output. Do not change acceptance criteria to fit the output.

Check whether the existing linter/type checker covers newly added helper files.
For example, TypeScript/TSX-only rules may leave `.mjs` helpers effectively
unchecked. Exercise helpers directly and disclose remaining coverage gaps; do
not claim a passing project linter validates files its rules do not cover.

## 4. Keep optional analysis explicit

- API credentials belong in an environment variable. The default is
  `SHIPCHECK_API_KEY`; `ai.apiKeyEnv` changes the variable's **name**, not its value.
- `shipcheck audit . --ai preview --whole-repository --json` previews bounded AI
  context; it does not consult a model. Live review requires explicit authorization
  and an existing named allowance. Do not create, refill or reuse budgets without
  the owner's permission. See [live auditing](P7_LIVE_AUDITS.md).
- `currentTask` may hold authorized task expectations; use `shipcheck task` to
  assess them. Ordinary `audit` does not assess the task. Do not invent completion
  claims from an offline task report. See [inline tasks](P11_TASK_AUDITING.md).
- Configure resources, HTTP/SDK contracts and architecture policies only from
  real project requirements and available evidence. Use [configuration reference](CONFIGURATION.md)
  for their schemas. Do not guess providers, boundaries or contract versions.

Configuration never grants command execution, paid requests or external access.
Even preview runs can fetch remote resources if separately authorized; omit remote
access grants when validating an offline setup.

## 5. Validate through the actual CLI

Run from the target root; save stdout and stderr separately, and capture each
process exit immediately before another command overwrites it:

```powershell
shipcheck audit . --json
shipcheck audit . --run-checks --json
```

The first command loads/validates config without authorizing its checks. Required
checks should be skipped and yield exit 2. The second should execute every required
check. A project with defects may correctly exit 1; setup success does not require
hiding its defects. Operational failures must be resolved or clearly reported.
Use full `audit`, not an empty `diff`, to validate configuration.

Inspect the actual report, not just its exit or top-level findings:

- Confirm root, `ignorePolicy`, selected scope and expected files.
- Check every required entry in `checks` for actual execution, status, diagnostics
  and captured output. Preset discovery alone is not successful execution.
- Read `auditSummary`, inspection warnings and `quality.gaps` when present.
  Binary files can make text inspection incomplete even when an asset test passes.
- Exit 0 means the configured exit policy passed; exit 1 reports a policy/check
  failure; exit 2 means usage/configuration/operational or required-execution failure.
  None of these establishes general correctness. The detailed report is authoritative.
- Verify an expected negative case fails and a corrected case passes where
  practical. Preserve source/configuration hashes across audits and retain test
  evidence. Do not alter application source just to demonstrate setup without
  authorization; use disposable fixtures or generated outputs.

## 6. Deliver a handoff

Create a short project document (for example `docs/SHIPCHECK.md`) covering:

1. Prerequisites and the exact install/build/version of Shipcheck used.
2. Configuration/helper files created or changed and why each check exists.
3. Commands to run, working directory, PATH assumptions and platform validation.
4. Which operations require authorization and which outputs they write.
5. Observed exits/results for gated, executed, negative and corrected cases.
6. Missing tests, unsupported languages/patterns, stale-artifact risks and remaining
   coverage limits; whether AI was used and any approved spend.
7. How to add a check without weakening existing acceptance criteria.

Tell the owner whether the configuration is ready, ready with disclosed gaps,
or blocked. Keep private reports and credentials out of version control. Return
the changed files and evidence locations. Do not merge, publish or claim the
project is correct merely because setup validation succeeded.

## Optional Codex subscription review

Use `--ai codex` with your own ChatGPT-authenticated Codex CLI instead of the
direct API backend. It never falls back to paid API requests. See [setup and
limits](CODEX_REVIEWER.md). Local checks still require `--run-checks`; Codex consumes
your subscription allowance.
