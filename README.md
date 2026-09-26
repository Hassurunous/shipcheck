# Shipcheck

Shipcheck is an independent review layer for AI-assisted software development.
Current status: **pre-alpha / P1 repository inspection**. The CLI prints a target
and readiness message. Repository facts are available through the inspection
API; findings, command workflows, and AI review are not implemented yet.

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
