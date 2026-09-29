# P6 local release checklist

Shipcheck 0.1.0 remains a private, pre-alpha package. This milestone prepares
and tests local distribution; it does not publish to npm or create a Git release.

## Reproduce the checks

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm pack
npm install --prefix .release-check/install --ignore-scripts --no-audit --no-fund ./shipcheck-0.1.0.tgz
& ./.release-check/install/node_modules/.bin/shipcheck.cmd help
& ./.release-check/install/node_modules/.bin/shipcheck.cmd audit .release-check/install/node_modules/shipcheck/fixtures/demo --markdown
```

On Linux/macOS, use the extensionless launcher in node_modules/.bin. Platform
verification recorded here covers Windows/Node 22; other platforms remain
unverified. The package contains compiled source and requires no TypeScript
toolchain at runtime. Packing invokes prepack to build from source first.

## Acceptance checks

- [x] README documents installation, commands, configuration, limits, and exits.
- [x] Console, JSON and Markdown reports are available; JSON/Markdown flags conflict explicitly.
- [x] Markdown contains untrusted report text in a fence that cannot be closed by embedded backticks.
- [x] Offline demo produces two expected warnings and exit 0.
- [x] Tarball includes compiled CLI, rule/configuration documentation, and demo.
- [x] Tarball excludes tests, node_modules, local environment files, and trial ledger.
- [x] Tarball installs in a separate local directory and its launcher runs the packaged demo.
- [x] Tests, typecheck and build pass (see current execution results).
- [x] Package stays private; no registry publication or additional API spending.

## Known limits and release decisions

The original one-time development trial is separate from P7 named persistent
allowances for subsequent opt-in live audits. Both retain fail-closed pricing
expiry and reservation controls; no ledger may be reset to obtain extra attempts.
See P7_LIVE_AUDITS.md. This audit uses no paid requests.

Deterministic checks include package rules, bounded multilingual HTTP contract
checks and architecture policies. External inspection tools execute only with
explicit --run-checks authorization; they are trusted programs, not sandboxed.
AI/task assessments and partial coverage require report inspection. Citation
matching is not semantic verification; diff reviews current files, not patch hunks.
Installed ESLint/Ruff qualification and other-platform validation remain P18.

Run `npm run verify` for the current checkout. After local installation, run
`node .release-check/install/node_modules/shipcheck/scripts/cli-acceptance.mjs`
to assert expected executable behavior without a TypeScript development toolchain.
See [P1-P15 audit](P1_P15_AUDIT.md) for the requirement/test matrix and limitations.

Before any public publication: explicitly approve publication, review the package
name/version and license/ownership metadata, decide the supported platforms and
live-usage policy, and rerun this checklist on the final commit. No public
publication, tag, or hosted release is authorized by this checklist.
