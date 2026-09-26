# Shipcheck

Shipcheck is an independent review layer for AI-assisted software development.
Current status: **pre-alpha / P2 deterministic findings**. Repository inspection,
three package-manifest rules, and console/JSON reports are available through the
API. The CLI still prints a readiness message. Command workflows and AI review
are not implemented yet.

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
content is skipped. `.gitignore` and build-output exclusions are not supported
yet. Detection is heuristic; marker matches and test indicators are facts, not
quality findings. See the architecture document for boundaries and limitations.

## Generate a report (API)

After building, run this from the repository root (PowerShell or a typical shell):

```sh
node --input-type=module -e "import { inspectRepository, createReport, renderConsoleReport } from './dist/src/index.js'; console.log(renderConsoleReport(createReport(await inspectRepository('.'))));"
```

For JSON output, replace both occurrences of `renderConsoleReport` with
`renderJsonReport`. These functions return strings; callers choose where to
print or save them. No files are written by the report functions.

P2 checks invalid package JSON, non-object manifests, and invalid `scripts`
structures. Findings include rule IDs, severity, explanation, file-level
evidence, and suggested actions. Inspection warnings are listed separately.
Zero findings means these limited checks found nothing; it is not a general
quality assessment. Missing README/tests and TODO/FIXME matches do not produce
findings. See [the rule catalog](docs/RULES.md) for exact triggers and limitations.
