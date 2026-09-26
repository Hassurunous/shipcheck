# Shipcheck

Shipcheck is an independent review layer for AI-assisted software development.
Current status: **bootstrap / pre-alpha**. The CLI prints a target and readiness
message only. Repository analysis and AI review are planned but not implemented.

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
