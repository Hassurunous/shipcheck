# Test catalogue

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

This is an index of source test declarations, not a claim that each test currently passes. Parameterized declarations can expand into multiple executed tests. Names are quoted from the working tree; the linked files contain assertions, fixtures and cleanup. Verification outcomes are recorded separately in [VERIFICATION.md](VERIFICATION.md).

## additional-http-clients.test.ts

[Open test source](../../test/additional-http-clients.test.ts)

Runtime imports: <code>../src/python-calls.js</code>, <code>../src/axios-calls.js</code>, <code>../src/cli-command.js</code>.

- Line 9: supports direct HTTPX and fresh Python sessions: %s
- Line 20: preserves different Requests/HTTPX None query serialization
- Line 25: keeps configured or unsupported Python clients unresolved: %s
- Line 37: supports Axios direct literal calls: %s
- Line 47: supports Axios import aliases and typed calls alongside fetch
- Line 51: does not assume Axios runtime config: %s
- Line 63: ignores Axios strings/comments and discloses CommonJS imports
- Line 68: caps combined fetch and Axios extraction
- Line 79: compares %s new client calls offline through the CLI

## adversarial-review.test.ts

[Open test source](../../test/adversarial-review.test.ts)

Runtime imports: <code>../src/ai/review.js</code>.

- Line 15: keeps injection text as reference data, offers no tools and never executes suggested actions
- Line 30: rejects action-shaped or escaping model output while preserving deterministic findings
- Line 42: rejects exact-location fabricated excerpts instead of treating citation coordinates as proof

## ai.test.ts

[Open test source](../../test/ai.test.ts)

Runtime imports: <code>../src/index.js</code>, <code>../src/ai/context.js</code>, <code>../src/ai/client.js</code>, <code>../src/cli-command.js</code>.

- Line 21: explains recognized incomplete reasons without echoing arbitrary provider text
- Line 37: checks source freshness for an empty AI response: %s
- Line 51: keeps normal review offline with no AI field even when AI settings exist
- Line 56: exercises %s with a clearly synthetic response and zero network calls
- Line 66: defaults to low cost, honors configured mode, and permits explicit overrides
- Line 73: previews file metadata without content, credentials or transport invocation
- Line 83: rejects unknown modes, models shape, unsafe limits and live execution
- Line 93: excludes hidden, sensitive, generated, non-source, configured exclusions and recognizable credentials
- Line 103: enforces file count, serialized byte budget, size cap and invalid-text handling
- Line 115: rejects a link introduced between profile creation and context collection
- Line 124: has stable ordering and hashes for unchanged content
- Line 133: builds a bounded structured request with untrusted-source instructions and no absolute root
- Line 143: selects configured %s model through the injected client seam
- Line 151: preserves deterministic results on %s without retries
- Line 169: handles missing credentials/model without calling transport
- Line 175: times out, aborts, and does not expose provider errors
- Line 186: rejects reversed/out-of-range citations and unexpected candidate fields
- Line 193: exposes preview/mock commands and partial failure exit codes
- Line 208: uses the correct evidence line when mock source begins with blank lines
- Line 213: enforces serialized context budget even when individual files fit
- Line 220: never treats completed envelopes without output as clean reviews
- Line 226: checks exact evidence in the review pipeline and preserves rejected candidates visibly
- Line 237: rejects evidence when source is %s during review

## architecture-audit.test.ts

[Open test source](../../test/architecture-audit.test.ts)

Runtime imports: <code>../src/architecture-audit.js</code>, <code>../src/dependency-imports.js</code>, <code>../src/config.js</code>, <code>../src/cli-command.js</code>.

- Line 14: automatically reports a forbidden import in %s
- Line 30: preserves direction, prefix boundaries, exact excerpts and external declarations
- Line 36: discloses unsupported dependency forms in %s
- Line 47: discloses missing, ambiguous, excluded and escaping relative targets
- Line 53: keeps filename conventions precise and policies hashed
- Line 60: restricts scoped sources but resolves against the full inventory
- Line 66: reports unsupported languages, parse failures, empty selections and read limits
- Line 72: ignores comment/string pseudo imports across parsers
- Line 76: enforces policy validation
- Line 80: discloses overlapping aliases, while explicit aliases resolve Python absolute and TS imports
- Line 86: preserves Unicode source offsets in %s
- Line 89: makes source and observation caps visible
- Line 94: discloses the aggregate import limit without dropping the report
- Line 99: accepts the exact per-file byte boundary and discloses aggregate read exhaustion
- Line 106: documents exact basename handling for %s
- Line 112: does not invent import citations for %j separators
- Line 116: does not follow linked sources or excluded files
- Line 121: emits console, markdown and JSON policies with violation and partial exit precedence
- Line 132: CLI finds a Java boundary violation after preprocessing %s

## audit-budget.test.ts

[Open test source](../../test/audit-budget.test.ts)

Runtime imports: <code>../src/ai/audit-budget.js</code>, <code>../src/ai/live.js</code>, <code>../src/ai/trial-budget.js</code>, <code>../src/ai/client.js</code>, <code>../src/ai/contracts.js</code>, <code>../src/ai/whole-repository.js</code>, <code>../src/cli-command.js</code>.

- Line 31: persists cumulative reservations across invocations and never recreates an allowance
- Line 41: makes the reservation durable before either HTTP call and excludes secrets from the ledger
- Line 55: blocks simultaneous reservations using an exclusive lock
- Line 65: retains interrupted reservations and forbids spending again
- Line 72: explicitly settles an unresolved attempt without refunding or resetting any funds
- Line 84: refuses settlement of active, missing, completed or malformed attempts
- Line 90: does not accept a forged settlement that refunds part of a reservation
- Line 96: fails closed on %s before HTTP
- Line 106: rejects higher-priced models, invalid output caps and missing credentials without reservations
- Line 112: counts input before generation and retains an oversized attempt
- Line 118: never refunds or retries failed generation
- Line 130: runs live batches through the shared ledger and retains successes when the allowance ends
- Line 144: validates explicit CLI budget selection without allowing config to authorize spend
- Line 152: routes a full live CLI audit through the configured credential and shared allowance
- Line 170: dispatches budget initialization and status without silently resetting a name
- Line 184: preserves legacy ledger receipts and expiry without renewing an allowance
- Line 196: rejects unknown or mismatched policy versions %j

## audit-reliability.test.ts

[Open test source](../../test/audit-reliability.test.ts)

Runtime imports: <code>../src/index.js</code>, <code>../src/ai/context.js</code>, <code>../src/ai/contracts.js</code>, <code>../src/ai/client.js</code>, <code>../src/ai/local-imports.js</code>, <code>../src/filesystem-policy.js</code>, <code>../src/reporters.js</code>.

- Line 17: sends explicit one-based lines without changing verification source
- Line 24: includes local guards before unrelated files, resolves JS imports to TS, and terminates cycles
- Line 32: discloses omitted and unresolved dependencies and respects exclusions
- Line 42: adds supporting files for a scoped audit while keeping focus paths explicit
- Line 49: distinguishes invalid responses and rejected citations from clean reviews
- Line 58: canonicalizes ancestor aliases but rejects an explicitly linked root
- Line 64: resolves only inventoried local imports without traversing outside the root

## boundaries.test.ts

[Open test source](../../test/boundaries.test.ts)

Runtime imports: <code>../src/index.js</code>.

- Line 11: uses actual filesystem casing for script, dependency and entry targets
- Line 20: preserves genuine missing targets and does not guess for older profile references
- Line 28: does not follow a differently cased directory link
- Line 36: honors exclusions through existing case aliases
- Line 43: uses defaults only for a missing config in a valid root
- Line 49: rejects linked roots and linked configurations before opening content
- Line 58: rejects directories, oversized and non-UTF-8 configurations
- Line 68: accepts a config exactly at the byte limit and an optional UTF-8 BOM
- Line 75: enforces the read cap even when initial metadata reports a smaller file
- Line 86: returns operational errors for unsafe config through the review API
- Line 91: does not lowercase paths when the filesystem rejects a case mismatch
- Line 102: does not treat unreadable config as absent

## check-diagnostics.test.ts

[Open test source](../../test/check-diagnostics.test.ts)

Runtime imports: <code>../src/check-diagnostics.js</code>, <code>../src/checks.js</code>, <code>../src/cli-command.js</code>, <code>../src/index.js</code>.

- Line 19: normalizes ESLint relative/absolute paths, levels and stable diagnostic IDs
- Line 26: normalizes Ruff and preserves diagnostics lacking a file or rule without inventing locations
- Line 32: rejects escaping paths %s
- Line 36: treats malformed diagnostics as operational errors, not a clean result
- Line 40: keeps stderr separate from JSON and fails on structured errors even with exit zero
- Line 48: supports warning thresholds and never-policy without suppressing operational errors
- Line 55: runs Ruff through the CLI and returns normalized errors with exit one
- Line 61: selects language-specific checks from exclusion-aware inventory while keeping execution opt-in
- Line 72: terminates an ordinary spawned descendant when a check times out

## check-order.test.ts

[Open test source](../../test/check-order.test.ts)

Runtime imports: <code>../src/workflows.js</code>.

- Line 10: reviews source and reference snapshots after authorized checks (whole=%s)

## cli-command.test.ts

[Open test source](../../test/cli-command.test.ts)

Runtime imports: <code>../src/cli-command.js</code>.

- Line 8: removes review and directs users to audit without inspecting a target
- Line 18: shows help and version without inspecting a repository
- Line 26: rejects unknown commands, options and excess targets
- Line 31: prints JSON and returns 1 for error findings, respecting target configuration
- Line 40: reports config and inspection failures to stderr with exit code 2

## cli.test.ts

[Open test source](../../test/cli.test.ts)

Runtime imports: <code>../src/index.js</code>.

- Line 5: defaults to the current directory
- Line 9: prints the first target verbatim and ignores additional arguments

## contract-adapters.test.ts

[Open test source](../../test/contract-adapters.test.ts)

Runtime imports: <code>../src/contract-adapters.js</code>, <code>../src/python-calls.js</code>, <code>../src/fetch-calls.js</code>, <code>../src/contract-audit.js</code>, <code>../src/cli-command.js</code>, <code>../src/config.js</code>.

- Line 23: selects TypeScript %s and extracts typed direct fetch calls
- Line 28: parses TSX without mistaking JSX text, comments or strings for executed calls
- Line 32: rejects broken TypeScript and does not infer imported/shadowed fetch semantics
- Line 37: extracts Python Requests syntax: %s
- Line 48: discloses unresolved Python pattern: %s
- Line 70: does not extract Python comments/docstrings; rejects parser recovery and unsupported imports
- Line 76: bounds Python extraction
- Line 80: compares mixed-language clients offline with hashes and query-name evidence
- Line 93: reports zero extracted calls and unsupported languages as incomplete instead of passing
- Line 102: retains path scope/exclusion boundaries and mixed-language CLI exit codes
- Line 114: keeps optional AI context separate and does not write sources or clear unsupported coverage
- Line 126: checks TypeScript defect and unsupported controls: %s
- Line 137: audits the distributed multilingual example without runtime dependencies

## contract-audit.test.ts

[Open test source](../../test/contract-audit.test.ts)

Runtime imports: <code>../src/contract-audit.js</code>, <code>../src/fetch-calls.js</code>, <code>../src/config.js</code>, <code>../src/cli-command.js</code>.

- Line 17: finds route/method/query mismatches with hashed consumer/provider evidence and clean controls
- Line 25: discloses unsupported calls: %s
- Line 34: ignores comments and string contents, detects aliases and invalid syntax
- Line 39: discloses unsupported JS line separator %j without inventing citations
- Line 44: does not mistake another service or base prefix for a mismatch
- Line 48: discloses a version pin mismatch and incomplete references without negative inferences
- Line 54: respects exclusion, size and language boundaries and workflow scope
- Line 61: uses operation overrides and concrete-route precedence
- Line 66: does not infer missing parameters through references or complex serialization
- Line 72: provides CLI JSON, console and Markdown results with failure and incomplete exit codes
- Line 82: validates bounded mappings and rejects credential-bearing service URLs
- Line 86: bounds extraction and preserves Fetch method case semantics

## current-task.test.ts

[Open test source](../../test/current-task.test.ts)

Runtime imports: <code>../src/workflows.js</code>, <code>../src/cli-command.js</code>, <code>../src/config.js</code>, <code>../src/task-file.js</code>, <code>../src/checks.js</code>.

- Line 14: runs the no-file CLI task and preserves source and configuration
- Line 21: fails clearly for missing tasks and unavailable selected paths
- Line 26: keeps ordinary audits separate and shows unassessed criteria with mock AI
- Line 32: validates bounded inline tasks and changes identity when expectations change
- Line 37: rejects recognized fix flags but allows inspection arguments

## evaluation.test.ts

[Open test source](../../test/evaluation.test.ts)

Runtime imports: <code>../src/ai/evaluation.js</code>.

- Line 7: includes isolated and mixed bugs, clean controls and cross-file guards
- Line 12: replays the same fixtures without credentials or live calls and scores misses honestly
- Line 21: requires human semantic labels even when citations match
- Line 31: keeps failed and absent runs out of clean evaluation claims
- Line 36: does not count a confirmed label with rejected citations as an evidence-backed detection

## evidence.test.ts

[Open test source](../../test/evidence.test.ts)

Runtime imports: <code>../src/ai/verify-evidence.js</code>, <code>../src/ai/context.js</code>, <code>../src/ai/contracts.js</code>.

- Line 10: matches exact full-line excerpts, normalizing line endings only
- Line 15: rejects incorrect citations without repairing model output
- Line 26: rejects stale files even if the cited lines still match
- Line 29: rejects unavailable files and rejects a candidate if any citation fails

## external-references.test.ts

[Open test source](../../test/external-references.test.ts)

Runtime imports: <code>../src/reference-resources.js</code>, <code>../src/config.js</code>, <code>../src/cli-command.js</code>, <code>../src/ai/review.js</code>, <code>../src/contract-audit.js</code>, <code>../src/resource-contracts.js</code>.

- Line 14: validates external citation length once for definitions and loaded records
- Line 25: requires a runtime root grant, keeps paths virtual, and records source identity
- Line 31: rechecks bytes and root identity rather than trusting reference labels
- Line 41: rejects links and respects exclusions, sensitivity and byte limits in external roots
- Line 49: ignores inapplicable external references without requiring grants or network
- Line 53: requires an exact authorized origin and a hash pin for HTTPS snapshots
- Line 62: reports remote %s without accepting a snapshot
- Line 67: rejects unsafe reference URL %s
- Line 70: uses external references in AI context and verifies virtual-path citations
- Line 77: compares a consumer against another repository with semver and metadata conflict checks
- Line 85: wires runtime CLI grants and keeps config authorization impossible

## findings.test.ts

[Open test source](../../test/findings.test.ts)

Runtime imports: <code>../src/index.js</code>, <code>../src/inspect-package.js</code>.

- Line 26: reports %s as %s with file evidence
- Line 46: does not flag valid manifests: %s
- Line 51: does not turn absent docs/tests, markers, or read failures into defects
- Line 60: keeps legacy invalid-manifest warnings when detailed diagnostics are absent
- Line 66: sorts findings and warnings without mutating input or depending on enumeration order
- Line 86: rejects findings without evidence or a recognized severity
- Line 94: round trips findings and warnings through JSON without losing evidence
- Line 101: renders actionable findings and inspection limitations separately
- Line 114: limits the meaning of a zero-finding report
- Line 121: preserves ordinary Windows paths in console output
- Line 127: escapes terminal controls and newlines in repository-controlled text
- Line 139: connects real inspection to rules and both renderers without executing scripts

## ignore-policy.test.ts

[Open test source](../../test/ignore-policy.test.ts)

Runtime imports: <code>../src/inspect-repository.js</code>, <code>../src/review-repository.js</code>, <code>../src/config.js</code>, <code>../src/ignore-policy.js</code>, <code>../src/ai/context.js</code>, <code>../src/ai/contracts.js</code>, <code>../src/reference-resources.js</code>, <code>../src/workflows.js</code>, <code>../src/cli-command.js</code>.

- Line 23: defaults to Git ignores only when exclusions are absent, and survives config reparsing
- Line 28: matches Git on nested rules, negations, anchored names, classes and ignored parents
- Line 40: supports escaped hashes/exclamation marks, spaces, CRLF, BOM and directory-only patterns
- Line 49: prunes ignored trees before reading their files or nested ignore files, and reports provenance
- Line 56: lets explicit excludes replace or combine with Git rules without disabling built-in exclusions
- Line 63: fails closed on oversized or invalid ignore files, but does not apply them when disabled
- Line 70: rejects linked ignore files
- Line 74: does not report ignored missing script targets as defects
- Line 78: honors ignore policy during AI rereads and local reference loading
- Line 84: reports bounded skip samples and consistent policy in JSON and console
- Line 90: ignores global/info/ancestor ignore rules in audit and diff, including opt-out untracked files
- Line 108: limits total ignore-file bytes
- Line 112: ignores local referenced source in task, contract and architecture assessments

## intent-policy.test.ts

[Open test source](../../test/intent-policy.test.ts)

Runtime imports: <code>../src/intent-policy.js</code>.

- Line 6: reports observed forbidden dependency direction with evidence
- Line 11: does not confuse direction or sibling path prefixes
- Line 15: leaves natural-language criteria unassessed even without observed violations
- Line 20: hashes normalized policy content and deduplicates observations
- Line 25: rejects duplicate identifiers, invalid paths, oversized and unknown configuration

## java-source.test.ts

[Open test source](../../test/java-source.test.ts)

Runtime imports: <code>../src/java-source.js</code>, <code>../src/dependency-imports.js</code>.

- Line 4: translates Java lexical input %s without recursive expansion
- Line 16: rejects malformed eligible escapes %s
- Line 19: retains original evidence through Java preprocessing %s
- Line 24: does not expose an import hidden behind an ineligible escape

## live-ai.test.ts

[Open test source](../../test/live-ai.test.ts)

Runtime imports: <code>../src/ai/trial-budget.js</code>, <code>../src/ai/live.js</code>, <code>../src/ai/client.js</code>, <code>../src/ai/contracts.js</code>, <code>../src/cli-command.js</code>.

- Line 25: persists three unique mode reservations, refuses repeats and never resets
- Line 39: reserves durably before network and prices returned usage without claiming an invoice
- Line 60: blocks concurrent attempts across modes
- Line 72: fails closed for %s state before network
- Line 80: retains uncertainty across invocations and blocks all later modes
- Line 91: rejects an oversized count before generation and consumes the attempt
- Line 97: does not retry or release a failed generation
- Line 108: times out and aborts a non-cooperating transport without retry
- Line 116: rejects missing credentials, unapproved models and output limits before reservation
- Line 123: requires explicit CLI activation and rejects mismatched trial flags without network

## markdown.test.ts

[Open test source](../../test/markdown.test.ts)

Runtime imports: <code>../src/markdown-report.js</code>, <code>../src/cli-command.js</code>.

- Line 5: renders the demo with findings and maintains exit-code semantics
- Line 14: contains Markdown, HTML and fence delimiters inside a longer literal fence
- Line 20: preserves AI failure and synthetic citation labels in Markdown

## openapi-contract.test.ts

[Open test source](../../test/openapi-contract.test.ts)

Runtime imports: <code>../src/openapi-contract.js</code>, <code>../src/resource-contracts.js</code>.

- Line 11: indexes direct operations with stable pointers and snapshot provenance
- Line 19: discloses unresolved Path Items and preserves direct operations elsewhere
- Line 23: distinguishes unsupported versions and formats from invalid structure
- Line 29: reports malformed entries and duplicate identities without claiming a clean comparison
- Line 33: discloses webhook-only and partially covered documents
- Line 38: requires a loaded resource explicitly labeled OpenAPI

## p7.test.ts

[Open test source](../../test/p7.test.ts)

Runtime imports: <code>../src/cli-command.js</code>, <code>../src/config.js</code>, <code>../src/checks.js</code>, <code>../src/index.js</code>, <code>../src/ai/contracts.js</code>, <code>../src/ai/client.js</code>.

- Line 16: does not execute commands without explicit authorization
- Line 22: executes from the canonical repository root with literal arguments and captures results
- Line 28: distinguishes command failures from operational errors and propagates CLI exit codes
- Line 36: bounds runtime and output
- Line 43: does not forward credential variables to checks
- Line 48: validates credential references, limits and duplicate check IDs
- Line 56: batches every eligible source file beyond a single request cap
- Line 66: reports batch caps and oversized source instead of calling partial results complete
- Line 73: keeps later batch targets ahead of already-selected supporting dependencies
- Line 83: preview never claims valid AI responses and excludes sensitive content
- Line 90: blocks paid whole-repository batching and incompatible CLI scopes before any network access
- Line 96: shows the underlying batch error and actionable credential message on stderr
- Line 107: places configurable review concerns in the prompt without claiming verification

## reference-ai.test.ts

[Open test source](../../test/reference-ai.test.ts)

Runtime imports: <code>../src/ai/review.js</code>, <code>../src/ai/client.js</code>, <code>../src/ai/whole-repository.js</code>, <code>../src/reporters.js</code>.

- Line 18: includes numbered reference content and verifies both sides of a candidate
- Line 28: rejects changed reference citations even when source still matches
- Line 33: fails closed on required references that cannot fit before transport
- Line 39: discloses optional omissions and rejects citations to those omitted references
- Line 44: does not send references outside selected source scope
- Line 48: fails closed for ambiguous duplicate reference paths
- Line 52: requires source evidence instead of retaining reference-only candidates
- Line 56: counts references in request size and discloses changed context even with no candidates
- Line 66: includes scoped references in whole-repository batch previews without network calls
- Line 71: reports verified conflict citations as needs clarification and marks dependent candidates
- Line 80: rejects conflict citations to source or a single reference and missing conflict arrays
- Line 87: rejects fabricated conflict excerpts rather than accepting their locations alone

## reference-evaluation.test.ts

[Open test source](../../test/reference-evaluation.test.ts)

Runtime imports: <code>../src/ai/reference-evaluation.js</code>, <code>../src/findings.js</code>.

- Line 8: scores clean controls and distinguishes missing or failed runs
- Line 13: does not score %s context as a successful clean control
- Line 21: rejects invalid labels and duplicate or unknown runs
- Line 26: replays recorded live outcomes with explicit semantic labels and rejects unassessed or fabricated evidence

## reference-resources.test.ts

[Open test source](../../test/reference-resources.test.ts)

Runtime imports: <code>../src/reference-resources.js</code>, <code>../src/config.js</code>, <code>../src/cli-command.js</code>.

- Line 13: captures raw-byte hashes and decoded text without putting reference bodies in reports
- Line 21: checks exact citations against both submitted and fresh snapshots
- Line 34: rejects changed content pinned by an expected hash
- Line 39: distinguishes required, optional, and inapplicable missing resources
- Line 46: rejects escaping paths, malformed scopes, duplicate IDs and excessive resources
- Line 52: rejects linked directories and excluded references
- Line 57: bounds individual and aggregate snapshots
- Line 63: discards binary, invalid UTF8 and likely credential content
- Line 69: blocks live AI before spending when a required reference is unavailable
- Line 74: shows loaded references as unassessed in console reports
- Line 78: excludes Git metadata and environment files independent of declared casing

## remote-reference.test.ts

[Open test source](../../test/remote-reference.test.ts)

Runtime imports: <code>../src/remote-reference.js</code>.

- Line 15: rejects non-public or special address %s
- Line 18: allows ordinary public address %s
- Line 19: pins the validated DNS address and sends no authorization or cookies
- Line 26: rejects all DNS answers if any address is private
- Line 30: rejects unsafe URL before connection: %s
- Line 33: does not follow redirects or accept HTTP status %s
- Line 36: rejects compressed responses and destroys overflow streams
- Line 40: accepts an exact byte limit and rejects aborted streams
- Line 45: bounds unresolved DNS with the same request deadline
- Line 49: retains the deadline after DNS resolution for a stalled HTTPS request

## repository.test.ts

[Open test source](../../test/repository.test.ts)

Runtime imports: <code>../src/index.js</code>, <code>../src/classify.js</code>.

- Line 22: profiles nested files, scripts, languages and exact marker locations deterministically
- Line 64: supports empty directories and rejects missing or file targets
- Line 71: keeps malformed manifests as observations and reports warnings
- Line 83: skips binary, invalid UTF-8 and oversized content but enumerates the files
- Line 96: does not traverse directory links or accept linked roots
- Line 106: continues past unreadable files and subdirectories
- Line 128: rejects an unreadable root instead of returning an empty successful profile
- Line 133: rejects invalid evidence line numbers through the public schema
- Line 142: recognizes common conventions without treating ordinary source as tests

## rules-config.test.ts

[Open test source](../../test/rules-config.test.ts)

Runtime imports: <code>../src/index.js</code>, <code>../src/config.js</code>.

- Line 19: rejects typos, invalid severities, unknown fields and unsafe/unsupported patterns
- Line 28: matches the documented glob subset including root-level ** matches
- Line 39: loads config and applies ordered path overrides
- Line 54: fails on malformed configuration instead of silently using defaults
- Line 60: excludes files before inspection and preserves warnings when disabling rules
- Line 72: reports competing managers in the same package, not nested or same-manager lockfiles
- Line 85: detects missing local dependencies, including nested relative references
- Line 95: does not call excluded or linked dependency targets missing
- Line 104: does not infer missing paths below an unreadable directory
- Line 111: checks only simple literal node/tsx script targets
- Line 121: keeps entry points opt-in and ignores extensionless main resolution
- Line 130: keeps missing README/test policies opt-in and uses detected conventions
- Line 138: reports only the configured source FIXME convention with line evidence

## sdk-audit.test.ts

[Open test source](../../test/sdk-audit.test.ts)

Runtime imports: <code>../src/sdk-audit.js</code>, <code>../src/config.js</code>, <code>../src/cli-command.js</code>, <code>../src/sdk-syntax.js</code>.

- Line 17: checks named aliases, optional primitive arguments and provider/consumer evidence without importing code
- Line 24: reports proven direct call mismatch: %s
- Line 27: leaves ambiguous/dynamic calls unresolved: %s
- Line 30: does not silently pass unsupported imports or zero calls: %s
- Line 33: accepts supported overloads and does not infer mismatches through unsupported declarations
- Line 41: rejects identity/version conflicts and conditional resolution without an explicit mapping
- Line 49: rejects unsafe declaration entry %s
- Line 52: respects provider/consumer exclusions, byte limits and workflow scope
- Line 59: supports explicitly authorized secondary package roots
- Line 66: bounds declaration and call counts
- Line 72: validates SDK bindings and semver ranges
- Line 75: integrates JSON/console/Markdown and CLI exit precedence
- Line 80: keeps explicit provider access through Git ignores while excluding consumer source

## standard-http-adapters.test.ts

[Open test source](../../test/standard-http-adapters.test.ts)

Runtime imports: <code>../src/go-http-calls.js</code>, <code>../src/csharp-http-calls.js</code>, <code>../src/java-http-calls.js</code>, <code>../src/cli-command.js</code>, <code>../src/contract-audit.js</code>, <code>../src/contract-adapters.js</code>, <code>../src/config.js</code>.

- Line 17: extracts Go net/http verbs, import aliases, method constants and constructors
- Line 22: reports unsupported Go syntax: %s
- Line 31: discloses Go import and syntax failures and ignores comment/string lookalikes
- Line 36: preserves non-ASCII/CRLF citation lines and discloses CR-only source
- Line 41: extracts C# fresh local and inline HttpClient methods
- Line 45: reports unsupported C# syntax: %s
- Line 55: rejects C# parser recovery and conditional compilation and ignores strings/comments
- Line 61: extracts Java complete request builders with defaults, URI setters and custom methods
- Line 65: reports unsupported Java syntax: %s
- Line 72: does not infer Java standard classes without imports or through Unicode escapes
- Line 78: does not treat aliased or conflicting standard-client type names as proven bindings
- Line 84: bounds %s extracted calls
- Line 91: audits the distributed expanded example with explicit construction kinds
- Line 103: runs %s contract defect/clean/query controls through CLI and preserves evidence
- Line 121: bounds a 512-builder Java file within the normal test timeout

## task-ai.test.ts

[Open test source](../../test/task-ai.test.ts)

Runtime imports: <code>../src/ai/review.js</code>, <code>../src/workflows.js</code>, <code>../src/task-file.js</code>, <code>../src/config.js</code>, <code>../src/ai/client.js</code>.

- Line 21: sends expectations and non-goals, preserves IDs, verifies citations and leaves files untouched
- Line 27: downgrades stale task results while retaining original proposals
- Line 32: rejects incomplete, duplicate and invented criterion identities before accepting results
- Line 37: requires task-source evidence for substantive outcomes and rejects invented excerpts
- Line 42: keeps ambiguous criteria and absent runtime evidence uncertain
- Line 48: bounds task content and blocks likely credentials before transport
- Line 55: does not claim support when selected files were excluded
- Line 61: invalidates results when task reload fails and rejects changed source citations
- Line 66: marks task changes by explicitly authorized checks before AI review
- Line 72: uses verified reference evidence and requires clarification when that reference is disputed
- Line 81: exercises legacy task-file assessments without changing the original format

## task-evaluation.test.ts

[Open test source](../../test/task-evaluation.test.ts)

Runtime imports: <code>../src/ai/task-evaluation.js</code>.

- Line 4: scores recorded live cases with explicit semantic labels and fails closed for stale or unverified results

## version-policy.test.ts

[Open test source](../../test/version-policy.test.ts)

Runtime imports: <code>../src/version-policy.js</code>.

- Line 3: evaluates provider version %s against %s
- Line 8: retains exact pins for non-semver APIs and distinguishes metadata conflicts

## workflows.test.ts

[Open test source](../../test/workflows.test.ts)

Runtime imports: <code>../src/cli-command.js</code>, <code>../src/workflows.js</code>, <code>../src/task-file.js</code>, <code>../src/review-repository.js</code>.

- Line 25: audits with the existing library rules
- Line 34: combines staged, unstaged and untracked paths and scopes AI input
- Line 44: reports clean diffs without invoking AI and discloses deleted content
- Line 54: returns an empty diff without loading unrelated invalid repository configuration
- Line 63: filters deterministic findings to changed evidence paths
- Line 71: rejects non-Git, unborn, and nested diff roots
- Line 77: loads structured tasks relative to the task file and keeps criteria explicitly unassessed
- Line 87: rejects invalid tasks, path escapes and nonexistent selected files
- Line 98: respects AI exclusions even when a task explicitly lists a file
- Line 109: detects unstaged changes and safely retains unusual filenames
- Line 116: rejects task files reached through linked directories and oversized tasks
