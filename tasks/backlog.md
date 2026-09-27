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

## P6.1 — Audit reliability

- [x] Return early for empty diffs without repository inspection
- [x] Supply explicitly numbered source lines and retain strict citation checks
- [x] Prioritize related local imports and disclose missing context
- [x] Report selected, skipped, failed and rejected coverage clearly
- [x] Define and test canonical ancestor/root-link policy
- [x] Add repeatable isolated/mixed bug and clean-control evaluation with human semantic scoring
- [x] Run a bounded low-cost live evaluation and record limitations

## P7 — Multi-language checks and developer-agent feedback

In progress after P6/P6.1; this work does not expand the P6 release requirements.

First slice delivered:
- [x] Root config for language-independent commands and AI credential environment references
- [x] Command opt-in, direct-child timeout/output limits, and separate tool statuses
- [x] Whole-repository preview/mock batches with bounded requests and disclosed skips
- [x] Configurable AI concerns including race conditions and code smells
- [x] Configuration examples and baseline-to-diff developer workflow documentation

Remaining P7 work:
- [x] Persistent aggregate spending limits and live whole-repository batch execution
- [x] Best-effort descendant cleanup (Windows tree tested; POSIX group implementation awaits platform validation)

- [x] Define a small adapter contract for language-specific linters and analyzers
- [x] Add configurable language detection and check selection, initially JavaScript/TypeScript and Python
- [x] Integrate ESLint/Ruff JSON and normalize diagnostics, locations, severities, and tool failures (offline fixture validation)
- [x] Add explicitly authorized command execution with timeouts and output limits; never silently execute repository configuration
- [x] Define configurable pass/fail thresholds while distinguishing deterministic results from AI candidates
- [x] Document a developer-agent loop: implement, invoke Shipcheck, read JSON results, fix, repeat
- [x] Improve rule/configuration discoverability and include detailed documentation and language examples in distributed packages
- [x] Add offline integration fixtures and tests for multiple languages and execution failures
- [ ] Validate adapters against installed ESLint/Ruff versions and cleanup on POSIX before cross-platform release claims

## P8 — Reference resources and evidence

- [x] Explicit local resource configuration and bounded read-only loading
- [x] In-memory content snapshots, hashes, declared versions and provenance
- [x] Loading statuses, optional hash pins and standalone citation-verification helper
- [ ] Report missing, excluded, incompatible and changed references
- [ ] Cross-resource citation verification without claiming semantic correctness
- [ ] Scoped reference selection for AI requests with budget/coverage accounting
- [ ] Explicit external-repository roots and approved remote documentation snapshots
- [ ] Conflicting-source handling and reproducible evidence tests

## P9 — Contract auditing (planned)

- [ ] OpenAPI and installed TypeScript SDK declaration adapters
- [ ] Version-aware call/contract comparisons with consumer/provider evidence
- [ ] Cross-repository interface comparisons and missing-contract outcomes

## P10 — Requirements and architectural policies (planned)

- [ ] Requirement IDs, architecture/dependency-direction policies and conventions
- [ ] Evidence-based intent assessments with ambiguity and conflict outcomes
- [ ] Evaluation corpus for requirement/architecture violations and clean controls

## P11 — Inline current-task auditing (planned)

See `docs/P11_TASK_AUDITING.md` for the agreed ownership and write boundaries.

- [ ] Inline `currentTask` in tool configuration; no additional file required
- [ ] `shipcheck task` assesses that task, preserving explicit task-file support
- [ ] Per-criterion assessments, evidence and exact task content hash
- [ ] Document user-authorized developer-agent edits to requirements as accepted risk
- [ ] No editing capability for Shipcheck/AI reviewers; document external-check risks
- [ ] Recognized fix-mode guards, validation, tests and user examples

Issue-tracker connectors, background watching and enforced read-only sandboxes
remain outside these first implementations unless separately authorized.
