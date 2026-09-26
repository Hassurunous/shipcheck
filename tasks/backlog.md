# Backlog

## P0 — Bootstrap
- [x] Project skeleton
- [x] TypeScript configuration
- [x] CLI smoke test
- [x] Test setup
- [x] Documentation

## P1 — Repository inspection
- [x] Recursive file enumeration
- [x] Ignore `.git`
- [x] Ignore `node_modules`
- [x] Classify files/languages
- [x] Detect manifests
- [x] Detect README
- [x] Detect tests
- [x] Inspect package scripts
- [x] Scan TODO/FIXME
- [x] Produce structured repository profile

## P2 — Findings
- [x] Define Finding schema
- [x] Support deterministic findings
- [x] Console renderer
- [x] JSON renderer

## P2.5 — Configurable rules and CLI convenience
- [x] Configurable levels, exclusions, and path overrides
- [x] Lockfile, local dependency, and simple script-target rules
- [x] Opt-in entry-point, README, test-detection, and FIXME policies
- [x] Review command with optional target and JSON output
- [x] Help and version commands
- [x] npm shortcuts and optional local executable linking instructions
- [x] Exit codes and command tests
- [x] Follow-up: avoid false missing-target findings caused by filesystem case differences
- [x] Follow-up: bound configuration reads and align config symlink handling with inspection

## P3 — AI review (offline implementation complete; live activation deferred)
- [x] Responses request/response adapter with injected transport
- [x] First QA/reliability reviewer prompt and mocked execution
- [x] Structured output validation
- [x] Error handling with no automatic retries
- [x] Explicit opt-in and bounded source-context selection with sensitive-file exclusions
- [x] AI finding provenance and unverified-evidence status
- [x] Configurable low-cost (default), balanced, and high-quality modes
- [x] Context/limit preview and offline mocked integration tests
- [ ] Agree real models, pricing, and spending ceiling before paid requests
- [ ] Add gated live transport and credential wiring after budget approval
- [ ] Approved live fixture comparison across all three modes

## P4 — Verification
- [ ] Validate evidence files
- [ ] Validate line ranges
- [ ] Validate excerpts
- [ ] Future semantic evidence verification

## P5 — Workflows
- [ ] Audit
- [ ] Diff
- [ ] Task

## P6 — Release
- [ ] README polish
- [ ] npm packaging
- [ ] Demo fixture
- [ ] Markdown reports
- [ ] Release checklist
