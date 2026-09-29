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

Delivered for the documented command/adapter subset; installed-tool and cross-platform
qualification remain P18. This does not expand the historical P6 release requirements.

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
- [x] Report missing, excluded and changed local references (P12)
- [ ] Semantic version compatibility of contracts (P14/P16)
- [x] Cross-resource citation verification without claiming semantic correctness (P12)
- [x] Scoped reference selection for AI requests with budget/coverage accounting (P12)
- [ ] Explicit external-repository roots and approved remote documentation snapshots
- [x] Local conflicting-source outcomes and reproducible evidence tests (P12)

## P9 — Contract auditing (local OpenAPI delivered through P14; external/SDK work in P16)

- [x] Offline OpenAPI JSON operation index with provenance and explicit partial coverage
- [x] Integrate the index with CLI reports and consumer-call comparisons (P14-P14.2)

See `docs/P9_CONTRACT_AUDITING.md`; P8 remains partially implemented.

- [x] OpenAPI JSON adapter and supported multilingual HTTP-call comparisons (P14-P14.2)
- [ ] Installed TypeScript SDK declaration adapters (P16)
- [x] Exact version-pin mismatch and consumer/provider evidence (P14)
- [ ] Broader semantic version compatibility and external comparisons (P16)
- [ ] Cross-repository interface comparisons and missing-contract outcomes

## P10 — Requirements and architectural policies (documented scope delivered through P13/P15)

- [x] Pure policy schemas with stable requirement/boundary IDs and content hash
- [x] Evaluate supplied dependency observations against forbidden directory boundaries
- [x] Offline violation/clean controls and explicit unassessed requirement outcomes

See `docs/P10_INTENT_POLICIES.md`. Task assessment is delivered through P13;
automatic architecture checks are delivered through P15 within documented limits.

- [x] Requirement IDs, architecture/dependency-direction policies and conventions (P11/P13/P15)
- [x] Evidence-based intent assessments with ambiguity and conflict outcomes (P13; not semantic proof)
- [x] Bounded evaluation corpus for requirement/architecture violations and clean controls (P13/P15; broader qualification P18)

## P11 — Inline current-task auditing (completed through P13)

See `docs/P11_TASK_AUDITING.md` for the agreed ownership and write boundaries.

- [x] Inline `currentTask` in tool configuration; no additional file required
- [x] No-file task invocation with normalized task hash and explicitly unassessed criteria
- [x] `shipcheck task` assesses that task, preserving explicit task-file support (P13)
- [x] Per-criterion assessments, evidence and normalized task content hash (P13)
- [x] Document user-authorized developer-agent edits to requirements as accepted risk
- [x] No editing capability for Shipcheck/AI reviewers; document external-check risks
- [x] Recognized fix-mode guards, validation, tests and user examples

Issue-tracker connectors, background watching and enforced read-only sandboxes
remain outside these first implementations unless separately authorized.

## Remaining implementation milestones

P12-P15 deliver local reference, task, contract and architecture integration on the
P8-P11 foundations. Remaining external-resource/interface work is P16; operating
guides and release qualification are P17/P18, in execution order.
Documentation and evaluation should develop alongside implementation, with their
final integration and release gates in P17/P18.

### P12 — Reference-aware audits (completed for local references)

Completes core P8 integration.

- [x] Select relevant local reference content within context and spending limits
- [x] Supply references to reviewers and verify submitted/current reference citations
- [x] Offline integration tests for citations, omissions, changes and batch previews
- [x] Scored reference-dependent corpus and bounded live evaluation (four low-cost cases; see docs/P12_EVALUATION.md)
- [x] Report missing, changed, conflicting and omitted references and actual coverage

Completion: audits assess code using local specifications with evidence from both
sources and explicit insufficient-context outcomes.

### P13 — Requirement-aware task audits (completed)

Completes the central P10/P11 task-assessment capability.

- [x] Supply task requirements, description and non-goals to reviewers
- [x] Report per-criterion potential violations, supporting evidence, insufficient evidence and clarification needs
- [x] Verify code/reference citations and detect task changes during assessment
- [x] Keep task assessments separate from general code-quality findings
- [x] Offline safeguards and five-case live evaluation with explicit semantic labels (docs/P13_EVALUATION.md)

Completion: implemented, violated, ambiguous and unsupported requirements receive
evidence-backed assessments without treating uncertainty as a pass. Users retain
control over developer-agent edits to expectations; Shipcheck never rewrites them.

### P14 — Functional contract auditing

Completes the first end-to-end portion of P9.

- [x] Map source clients to service contracts and extract narrowly supported calls
- [x] Compare methods/routes and supported parameters with contract evidence
- [x] Distinguish version-pin mismatches, dynamic calls and unsupported operations
- [x] Integrate consumer/provider evidence into CLI reports

Completion: one documented language/client pattern works against OpenAPI with
seeded incorrect calls, clean controls and explicit unresolved-call limitations.
Delivered pattern: direct literal JavaScript fetch, OpenAPI JSON, method/route and
required scalar query-name presence. See docs/P14_CONTRACT_CHECKS.md.

### P14.1 — Multilingual contract auditing (completed)

- [x] Common offline call-observation interface and bundled adapter registry
- [x] TypeScript/TSX direct fetch and Python Requests literal-call patterns
- [x] Shared OpenAPI comparison and consumer/provider evidence across languages
- [x] Adapter/language/call-count reporting; zero supported calls are incomplete
- [x] Offline safeguards, clean/defect fixtures, and mixed-language CLI verification
- [x] Optional existing AI review stays separate; no automatic paid fallback

See docs/P14_1_MULTILINGUAL_CONTRACTS.md for exact patterns and exclusions.

### P14.2 — Additional language adapters (completed for documented patterns)

- [x] Go net/http literal request patterns
- [x] C# HttpClient literal request patterns
- [x] Java standard HTTP client literal request patterns
- [x] Per-adapter clean/defect/unsupported fixtures and installed CLI validation
- [x] Extend coverage for Python HTTPX/Sessions and JavaScript/TypeScript Axios
- [x] Prioritize Rust reqwest, Ruby Net::HTTP, then PHP cURL for subsequent adapter work

See docs/P14_2_ADDITIONAL_LANGUAGES.md. P15 follows this adapter milestone.

Prefer deterministic offline extraction and reuse the comparison/report contracts.
AI may supplement unsupported complexity with separate evidence-backed candidates;
it must not erase incomplete offline coverage or require spending for existing checks.
Shipcheck remains read-only. SDK resolution and external resources remain P16.

### P15 — Automatic architecture-policy checks (completed for documented import subset)

Completes deterministic P10 integration.

- [x] Configure policies and report them through the CLI
- [x] Extract dependencies and resolve supported imports/aliases
- [x] Evaluate dependency boundaries and precise convention rules
- [x] Disclose unsupported resolution and incomplete coverage

Completion: repository boundary checks run without manually supplied observations.

Implementation: optional `architecture` configuration, automatic glob selection,
parser-based JS/TS/Python/Go/Java/C# import extraction, explicit aliases, prohibited
directions, filename styles, hashed evidence, console/JSON/Markdown output and
exit-code integration. Partial and unsupported resolution remains visible.
See docs/P15_ARCHITECTURE.md for limits and packaged fixture.

### P16 — External contracts and broader interface support (completed for documented subset)

Completes broader P8/P9 resource scope.

- [x] Explicitly authorized secondary repository roots and controlled remote snapshots
- [x] Installed TypeScript SDK declaration support
- [x] Cross-repository consumer/provider comparisons with version/conflict handling

Completion: supported external integrations have reproducible contract evidence
and explicit access boundaries.

See docs/P16_EXTERNAL_CONTRACTS.md for runtime grants, pinned HTTPS snapshots,
direct named SDK function checks, semver handling and explicit coverage limits.

### P17 — User and developer-agent integration (completed)

- [x] Consolidated user setup and agent operating guides
- [x] Report schema/compatibility contract, exit codes and partial/failure handling
- [x] Reference development loop with iteration, spending and no-progress limits
- [x] Examples for source edits, requirement edits and human decisions

Completion: users and developer agents operate Shipcheck from documentation alone.

See docs/USER_GUIDE.md, docs/AGENT_GUIDE.md and docs/REPORT_CONTRACT.md. The packaged
examples/capture-audit.mjs demonstrates bounded offline JSON capture. Loop limits
are caller-enforced; no code-writing agent or autonomous fixer was added. Real
developer-agent effectiveness experiments remain P18.

### P18 — Adversarial validation and release qualification

Includes remaining P7 validation obligations.

- [ ] Installed ESLint/Ruff validation and supported-platform installation/process cleanup
- [ ] Scored defect/clean-control corpus and real developer-agent loop experiments
- [ ] Prompt-injection, stale-evidence, interrupted-request, budget-concurrency and malformed-output tests
- [ ] Published quality/cost measurements, limitations and release gates

Completion: repeatable tests and bounded live experiments establish the supported
workflows and their practical limitations.

## P1-P15 implementation audit

See `docs/P1_P15_AUDIT.md` for standards, evidence, corrected defects and deferred
requirements. Run `npm run verify` for typecheck, regression tests, build and offline
CLI acceptance; `npm run test:cli` runs only the executable acceptance suite.
