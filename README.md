# Shipcheck

Shipcheck is an independent review layer for AI-assisted software development.
Current status: **pre-alpha / P3 AI review with bounded live trial**. Repository inspection,
configurable deterministic rules, and console/JSON reports are available through the
API and the `review` command. Help and JSON output are available. Audit, diff,
task workflows remain planned. AI previews and mocked QA review are offline;
explicit live trial review has been tested in all three modes.

## Local development

Requires Node.js 22+ and npm. From the repository root:

```sh
npm install
npm run dev -- .
npm run typecheck
npm test
npm run build
```

Expected CLI output:

```text
Shipcheck v0.1

Target: .
Status: ready
```

The first argument is the target, defaulting to `.`. No files are inspected or
modified, and no environment variables or network access are needed at runtime.
Use `npm run test:watch` for watch mode. After building, run
`node dist/src/cli.js .`. The package has a future `shipcheck` executable mapping
and is private to prevent accidental publication.

See [product scope](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md),
[decisions](docs/DECISIONS.md), and [backlog](tasks/backlog.md).

## Inspect a repository (API)

After `npm run build`, import the inspector from JavaScript:

```js
import { inspectRepository } from "./dist/src/index.js";

const profile = await inspectRepository(".");
console.log(JSON.stringify(profile, null, 2));
```

The validated profile includes files, languages, manifests, README/test
indicators, package scripts, TODO/FIXME locations, and inspection warnings.
Inspection is read-only and never executes package scripts. It skips `.git`,
`node_modules`, and symlinks, and reads at most 1 MiB per file. Binary or non-UTF-8
content is skipped. `.gitignore` is not interpreted; explicit exclusions are
supported through inspection options or review configuration. Detection is
heuristic; marker matches and test indicators are facts, not
quality findings. See the architecture document for boundaries and limitations.

## Generate a report (API)

After building, run this from the repository root (PowerShell or a typical shell):

```sh
node --input-type=module -e "import { reviewRepository, renderConsoleReport } from './dist/src/index.js'; console.log(renderConsoleReport(await reviewRepository('.')));"
```

For JSON output, replace both occurrences of `renderConsoleReport` with
`renderJsonReport`. These functions return strings; callers choose where to
print or save them. No files are written by the report functions.

`reviewRepository` loads `shipcheck.config.json` from the target root. This
repository excludes build/coverage output. P2 checks package structure,
conflicting lockfiles, missing local dependencies, and simple script targets.
Entry-point, README, test-detection, and source FIXME policies are opt-in.
Findings include rule IDs, severity, explanation, evidence, and suggested
actions. Inspection warnings are separate. Zero findings is not a general
quality assessment. See [the rule catalog](docs/RULES.md) and
[configuration](docs/CONFIGURATION.md) for defaults and limitations.

## Command-line shortcuts (P2.5)

From the checkout, no build or global installation is needed:

```powershell
npm run review
npm run review -- "D:\path\to\repository"
npm run review -- . --json
npm run shipcheck -- help
npm run shipcheck -- help review
npm run shipcheck -- --version
```

`review` defaults to the current directory and loads the target's configuration.
For clean JSON without npm's script banner, use `npm run --silent review -- . --json`.
Unknown options, extra targets, and unknown commands produce usage errors.
Use `review -- --leading-dash-folder` for a target beginning with a dash.

For a direct `shipcheck` command, optionally run `npm run build` then `npm link`
locally once. This creates a local command link, not a published package:

On Windows, npm's global prefix must also be on PATH. Check it with
`npm prefix -g` and verify command discovery with `Get-Command shipcheck`.
Some Node version managers install launchers in a version-specific folder that
is not on PATH. To make the linked command available in the current PowerShell:

```powershell
$env:Path += ";$(npm prefix -g)"
Get-Command shipcheck
shipcheck --version
```

For persistence, add that prefix to your **user PATH** in Windows Environment
Variables. Restart the terminal application afterward; existing terminals keep
their old environment. Recheck the prefix and link after switching Node versions.
`npm run review` does not require global PATH setup.

```powershell
shipcheck review .
shipcheck review . --json
shipcheck help
shipcheck help review
shipcheck --version
```

Rebuild after source changes when using the linked command. Remove the link
with `npm uninstall -g shipcheck` when no longer needed. Alternatively run
`node dist/src/cli.js review .` after building.

Exit codes: **0** completed without error-level findings, **1** error-level
findings, **2** usage/configuration/inspection failure. Warnings alone return 0.
Reports go to stdout; failures go to stderr (including with `--json`). The
no-argument and `.` readiness smoke tests remain available. Use `review` for
inspection; audit/diff/task workflows remain unimplemented.

## P3 preview and mock modes

```powershell
shipcheck review . --ai preview
shipcheck review . --ai mock
shipcheck review . --ai mock --mode balanced
shipcheck review . --ai mock --mode high-quality --json
```

Use `npm run review -- . --ai mock` without a global link. Low cost is the
default mode. Mock results are synthetic plumbing checks, not software defects
or real model evaluations. Preview and mock never read credentials or use the
network. Live review requires --ai live --trial and a persistent allowance.
The approved three-mode trial is complete; further attempts are blocked.
Run `shipcheck trial status` for reservations and usage. See [live trial results
and controls](docs/LIVE_TRIAL.md). Automatic retries are disabled.
See [P3 behavior and limits](docs/P3_AI.md).

## P4 citation checks

AI candidates now include file freshness, line-range, and exact-excerpt checks.
Console reports show MATCHED or REJECTED citations; diagnoses remain unverified.
See [verification behavior](docs/P4_VERIFICATION.md). No extra API call is needed.
