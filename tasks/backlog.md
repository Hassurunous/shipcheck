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
- [x] Repository command with optional target and JSON output (now audit)
- [x] Help and version commands
- [x] npm shortcuts and optional local executable linking instructions
- [x] Exit codes and command tests
- [x] Follow-up: avoid false missing-target findings caused by filesystem case differences
- [x] Follow-up: bound configuration reads and align config symlink handling with inspection

## P3 — AI review (complete with bounded live trial)
- [x] Responses request/response adapter with injected transport
- [x] First QA/reliability reviewer prompt and mocked execution
- [x] Structured output validation
- [x] Error handling with no automatic retries
- [x] Explicit opt-in and bounded source-context selection with sensitive-file exclusions
- [x] AI finding provenance and unverified-evidence status
- [x] Configurable low-cost (default), balanced, and high-quality modes
- [x] Context/limit preview and offline mocked integration tests
- [x] Agree real models, pricing, and spending ceiling before paid requests
- [x] Add gated live transport and credential wiring after budget approval
- [x] Approved live fixture comparison across all three modes

## P4 — Verification
- [x] Validate evidence files
- [x] Validate line ranges
- [x] Validate excerpts
- [ ] Future semantic evidence verification

## P5 — Workflows
- [x] Audit
- [x] Diff
- [x] Task

## P6 — Release
- [x] README polish
- [x] npm packaging
- [x] Demo fixture
- [x] Markdown reports
- [x] Release checklist

## P6.1 � Audit reliability

- [x] Return early for empty diffs without repository inspection
- [x] Supply explicitly numbered source lines and retain strict citation checks
- [x] Prioritize related local imports and disclose missing context
- [x] Report selected, skipped, failed and rejected coverage clearly
- [x] Define and test canonical ancestor/root-link policy
- [x] Add repeatable isolated/mixed bug and clean-control evaluation with human semantic scoring
- [x] Run a bounded low-cost live evaluation and record limitations

## P7 — Multi-language checks and developer-agent feedback

Planned after P6; this work does not expand the P6 release requirements.

- [ ] Define a small adapter contract for language-specific linters and analyzers
- [ ] Add configurable language detection and check selection, initially JavaScript/TypeScript and Python
- [ ] Integrate established tools and normalize findings, locations, severities, and tool failures
- [ ] Add explicitly authorized command execution with timeouts and output limits; never silently execute repository configuration
- [ ] Define configurable pass/fail thresholds while distinguishing deterministic results from AI candidates
- [ ] Document a developer-agent loop: implement, invoke Shipcheck, read JSON results, fix, repeat
- [ ] Improve rule/configuration discoverability and include detailed documentation and language examples in distributed packages
- [ ] Add offline integration fixtures and tests for multiple languages and execution failures

Start with explicit invocation by the developer agent. Background watching,
additional languages, and further capabilities can be proposed as P8 and later
milestones as development continues; they are not committed P7 requirements.
