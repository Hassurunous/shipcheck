# Architecture

## Current implementation through P17

`src/cli.ts` is the executable entry point, with command dispatch in
`src/cli-command.ts`. `audit` performs configured review; help/version explain
usage without inspecting files. The no-argument and `.` smoke-test output
remains unchanged. The exported `inspectRepository`
API performs repository inspection. `createReport` evaluates captured facts and
returns deterministic findings with separate inspection warnings.
`renderConsoleReport` and `renderJsonReport` return report strings without I/O.
AI citation verification is implemented; semantic verification remains future work. Opt-in AI
context previews and mocked QA review are implemented separately from the
ordinary deterministic path; see `docs/P3_AI.md`.

`src/inspect-repository.ts` enumerates the tree and reads content sequentially.
`src/classify.ts` contains filename/extension heuristics. The Zod schema and
inferred `RepositoryProfile` type in `src/repository-profile.ts` define the
returned contract, which is validated before returning.

The profile contains an absolute root; sorted, relative forward-slash file
paths; language/file counts; manifest, README, and test indicators; package
scripts; TODO/FIXME markers with one-based lines and exact line excerpts; and
structured inspection warnings. No timestamps are included. Results are
deterministic for an unchanged, readable tree. File counts include content that
could not be read. Unknown extensions have a null language.

Inspection skips entries named `.git` or `node_modules` at any depth. Symlinks
and special files are skipped with warnings; a linked root is rejected. Reads
are capped at 1 MiB per file, including files that grow during reading. Binary
(NUL-containing) and invalid UTF-8 content is skipped with warnings. UTF-8 BOMs
are accepted. Missing, invalid, or unreadable roots reject the operation;
unreadable children produce warnings and inspection continues.

Manifest detection covers common Node, Python, Rust, Go, JVM, Ruby, PHP, Swift,
and .NET filenames. Only `package.json` content is parsed in P1. Scripts must
be string-valued; malformed manifests produce warnings. Scripts are never
executed. Test detection uses test directories and common JS/TS, Python, and Go
filename conventions; it does not establish coverage or test quality. Marker
scanning recognizes uppercase whole-word TODO/FIXME in any readable text,
including documentation and strings; markers are observations, not findings.

Limitations: `.gitignore` is not interpreted; build output, hidden files, and
other dependencies are included unless named above or explicitly excluded in
inspection options. `reviewRepository` loads root configuration and passes its
exclusions into inspection. Inspection does not create
a filesystem snapshot or protect against concurrent malicious path replacement;
use a stable local tree. Read limits are per file, not a total tree budget.
Deterministic inspection writes no files and makes no network calls.

TypeScript uses strict NodeNext ESM settings with explicit `.js` import paths.
One configuration checks source and tests and emits them under `dist/`; the
executable is `dist/src/cli.js`. The package allowlist includes `dist/src`, README, documentation, selected fixtures,
roadmap/task examples and the CLI acceptance script. Compiled tests are excluded.

## Findings and reporting

`src/inspect-package.ts` captures typed `packageIssues` during content inspection,
separating JSON syntax, top-level object, and scripts structure failures. The
original `invalid-manifest` warning is retained in repository profiles for
compatibility. Older profiles default to an empty `packageIssues` array; a fresh
inspection is needed to obtain detailed diagnoses.

`src/findings.ts` owns the Zod `Finding` and version-1 `Report` contracts and the
pure rule evaluation function. Findings have stable IDs derived from rule ID
and encoded relative path, severity, title, explanation, nonempty file-level
evidence, and suggested action. No line numbers or excerpts are invented for
parser failures. Findings are sorted by ID; inspection warnings are sorted by
path/code/message. Report creation validates and copies the input profile.

An invalid-manifest warning is removed from the report's inspection warnings
only when a detailed package finding covers the same path. All other warnings
remain visible, including legacy invalid-manifest warnings without diagnostics.
Missing documentation/tests and FIXME comments generate findings only when
their optional policies are enabled; raw marker counts are never findings.

`src/reporters.ts` validates reports and formats console text or pretty JSON.
Console output escapes control characters in repository-controlled text and
states the limited rule scope. JSON preserves the report contract and evidence.
Neither renderer executes code, writes files, sets exit status, nor calls AI.
Evidence is captured during inspection; it is not reverified against disk at
report time. P4 verifies AI citations separately. See `docs/RULES.md` for rules.

## Configurable rules

`src/config.ts` validates JSON configuration, supplies rule defaults, matches a
small glob subset, and applies ordered overrides. `review-repository.ts` loads
configuration and composes inspection with reporting; lower-level functions
remain explicit and do not auto-load files.

`src/package-references.ts` collects literal `file:` dependencies, narrowly
recognized Node/tsx commands, and main/module/types/typings/bin declarations.
Directory inventory and exclusions are included in profiles. Additional rules
in `src/additional-rules.ts` evaluate lockfile conflicts, missing references,
and opt-in repository policies. Missing-reference checks stay within the root
and avoid excluded or uncertain filesystem locations. No shell parsing,
dependency resolution, build execution, or general module resolution occurs.

Evidence may include an optional one-based line and excerpt for the heuristic
FIXME comment rule. This marker rule does not parse a language AST; multiline strings can resemble
comments. P14/P15 use parsers for their separate call/import analyses. See `docs/CONFIGURATION.md` for configuration precedence and patterns.

## Processing structure

```text
CLI
 ↓
Repository inspection
 ↓
Structured repository profile
 ↓
Deterministic findings
 ↓
Optional QA/reliability AI reviewer
 ↓
Evidence verification
 ↓
Reporters
```

Inspection, deterministic findings, and console/JSON reporters are implemented;
QA review supports offline execution and an explicitly gated live trial;
semantic verification remains planned. Introduce small modules
only as their milestones require them. Prefer deterministic analysis before AI
analysis, structured data contracts, and evidence-backed findings. Execution is
local-first with minimal persistent state and no server requirement for v0.1.

## P2.5 command interface

`src/cli-command.ts` parses commands and returns stdout, stderr, and exit code;
`src/cli.ts` handles process I/O. `audit [target] [--json]` composes configured
inspection and reporting. Help/version do not inspect files. Local npm scripts
expose `audit` and `shipcheck`; the existing bin mapping supports optional npm
link after building. No CLI framework was added.

Exit codes are 0 for completed reviews without error-level findings, 1 for
error-level findings, and 2 for usage/configuration/inspection failures. Warnings
alone do not fail the command. The no-argument and explicit-path readiness
entry points remain for bootstrap compatibility; named targets should be passed
to `audit`. These were the original P2.5 semantics. Current workflows add opt-in AI, diff,
task, external checks, contract and architecture assessments; incomplete contract
or architecture analysis exits 2, observed violations exit 1. Partial AI coverage
and uncertain task assessments remain report fields rather than automatic failures.

## P2.5 audit follow-up implementation

`src/filesystem-policy.ts` shares the root validation and 1 MiB byte limit.
Config loading validates the root before opening config, rejects links and
non-regular files, and bounds reads even if the file grows. Absent config alone
uses defaults; read failures are operational errors.

`src/reference-existence.ts` records exists/missing/unknown for local references
by checking path components with the filesystem's native case behavior. It
stops at links and special entries, and honors exclusions using canonical
casing as well as the declared path. Rules require explicit missing evidence;
old profiles without those facts do not infer absence. Referenced content is
never read and pure report generation still performs no filesystem I/O.

## P3 offline modules

`ai/contracts.ts` defines settings, candidate output, and result schemas.
`ai/context.ts` selects bounded source files and emits preview metadata without
source bodies. `ai/client.ts` builds a QA/reliability request, validates bounded
Responses envelopes, and exposes an injected transport seam plus a synthetic
mock. It has no default HTTP implementation. `ai/review.ts` composes these after
deterministic inspection, preserving deterministic results on AI-stage failure.
The optional report.ai section separates unverified candidates from findings.
No SDK or retry was introduced. The separate ai/live.ts module implements
bounded HTTP for explicit --ai live --trial execution. ai/trial-budget.ts
persists reservations and receipts outside repositories and locks concurrent
requests. Only live execution reads the configured ai.apiKeyEnv (default SHIPCHECK_API_KEY). See
LIVE_TRIAL.md for allowance limits and observed three-mode results.

## P4 citation verification

ai/verify-evidence.ts compares citations against submitted and freshly read
source. ai/review.ts reuses bounded context collection after the response and
attaches per-candidate verification results. Every submitted source snapshot is
rechecked even when no candidates are returned; changed/unavailable source makes
coverage partial and is identified in preview metadata. Deterministic createReport remains
pure. See P4_VERIFICATION.md for matching rules, failures, and limitations.

## P5 workflow composition

workflows.ts composes existing review functions for audit, HEAD-relative changed
file review and structured tasks. task-file.ts validates bounded JSON task
files. AI context is restricted before source collection; deterministic findings
are filtered after full-context rule evaluation. Reporters display workflow
scope and unassessed task criteria. See P5_WORKFLOWS.md for limitations.

## P6 local distribution

markdown-report.ts produces a summary and a safely fenced complete report.
--markdown is available on audit/diff/task and is exclusive with --json. Renderers
return strings; shell redirection can save output. prepack builds the CLI; the
package allowlist includes docs and the offline demo but excludes tests and
local artifacts. See RELEASE_CHECKLIST.md for validation and known limits.

## P6.1 audit reliability

Empty diffs stop before config loading/inspection. The AI context selector follows
static local import hints within existing limits; requests serialize explicit
numbered lines. Coverage is separate from citation and semantic validity.
Ancestor aliases are canonicalized while linked final roots remain rejected.
Evaluation tooling replays responses and scores human assessments against fixed
cases. See P6_1_AUDIT_RELIABILITY.md for limits and live evaluation results.
## P7 first implementation slice

checks.ts validates commands and executes direct child processes only after explicit
authorization. Reports retain external check statuses and bounded raw output separately
from deterministic findings and AI candidates. Checks always have whole-repository scope.
ai/whole-repository.ts batches source with existing selection controls, a maximum
batch count, and explicit coverage. Live calls require a named audit-budget.ts
allowance; immutable reservations and receipts persist under the user home.
Reservations consume worst-case cost before HTTP and are never refunded. Unresolved
attempts block further spending. The first failed batch stops the audit while
retaining earlier results and disclosing remaining paths. P7_LIVE_AUDITS.md documents
the pinned pricing expiry, commands, and operational limits.
ai.apiKeyEnv references credentials outside the repository; ai.focus configures review
concerns. See P7_CONFIGURATION.md for contracts and execution limitations.

## P7 structured checks

check-diagnostics.ts parses ESLint/Ruff JSON stdout into external-tool diagnostics,
normalizes paths without reading their content, and evaluates severity thresholds.
Checks keep stdout/stderr separate under one output cap. Optional language gates
use an exclusion-aware repository inventory; they never authorize execution.
check-process.ts performs best-effort Windows tree/POSIX group termination after
timeout or overflow. P7_STRUCTURED_CHECKS.md documents schemas and validation limits.

## P8 local references (first slice)

resource-contracts.ts defines resource metadata and citation contracts. Config
validates explicit local paths and scope patterns. reference-resources.ts performs
bounded reads, rejects links/exclusions/likely secrets, and captures raw-byte hashes
with in-memory text snapshots. Workflows report metadata and skip AI if a required
applicable reference fails to load. P12 adds reference bodies to AI context.
The verifier compares submitted and fresh snapshots and exact line excerpts;
P12 integrates it with AI evidence. See P8_REFERENCE_RESOURCES.md.

## P9 operation-index foundation

openapi-contract.ts indexes direct operations from loaded OpenAPI JSON snapshots
as a pure exported API. Snapshot hashes and JSON Pointers preserve structural
provenance; unresolved references and malformed entries produce explicit issues.
P14 connects the index to workflow reports and narrow source-call comparisons. See
P9_CONTRACT_AUDITING.md for supported input and limitations.

## P10 policy foundation

intent-policy.ts validates requirements and forbidden dependency directions,
hashes normalized policy content and evaluates caller-supplied dependency
observations. It performs no I/O and does not verify evidence or assess natural
language. Results explicitly disclose observation-only coverage. It is exported
as a library API; P13 integrates task assessment and P15 integrates automatic
source extraction and architecture policies. See P10_INTENT_POLICIES.md.

## P11 inline task selection

task-file.ts defines bounded currentTask configuration and normalized task identity.
The no-file CLI task invocation selects currentTask from the working directory's
configuration; explicit task files retain their existing behavior. Workflow reports
include per-criterion summaries; P13 adds AI requirement assessment.
Checks reject recognized fixing flags; arbitrary external commands are not sandboxed.

## P12 local reference context

ai/reference-context.ts fills remaining source-context space with scoped reference
snapshots. Required failures block requests; optional omissions disclose partial
coverage. Requests separate reference metadata/numbered text from source. Response
citations use the existing path format and are checked against captured and fresh
reference snapshots. Full request accounting includes reference payloads. A separate
required conflict array is requested when reference context is present; conflicting
reference citations are verified and make coverage partial. Offline tests and a
four-case live corpus validate local integration; see P12_REFERENCE_AUDITS.md and
P12_EVALUATION.md for evidence and quality limitations.

## P13 task assessment

Task workflows pass normalized expectations and a reload callback into reviewWithAi.
Task bytes reserve space before source/reference selection. Conditional structured
output requires exactly one assessment per criterion. task-review.ts verifies
citations, downgrades unsupported outcomes and invalidates changed/unavailable tasks.
Workflow-level rechecking also catches task mutations by authorized external checks.
Legacy task-file strings map to positional criterion IDs. AI outcomes remain separate
from general findings and do not independently change CLI exit codes. See
P13_TASK_ASSESSMENT.md and P13_EVALUATION.md.

## P14 contract comparison

contract-audit.ts loads bounded contract/source snapshots and compares mapped
JavaScript calls extracted with Acorn in fetch-calls.ts. Structured contracts
results retain both hashes and provider JSON Pointers. Workflows scope mappings,
reporters expose limitations, and CLI exit codes distinguish mismatches from
incomplete comparisons. No runtime requests or client execution occur. See
P14_CONTRACT_CHECKS.md for the deliberately narrow supported pattern.

## P14.1 multilingual adapters

contract-adapter-types.ts defines language-neutral call observations and extraction
issues; contract-adapters.ts selects bundled adapters by extension. fetch-calls.ts
uses Acorn for JavaScript and Babel's ESTree/TypeScript parser for typed syntax.
python-calls.ts uses Lezer's Python grammar entirely inside Node to identify direct
Requests calls and literal query-name dictionaries. Neither adapter executes source,
imports repository modules, or requires a target-language runtime. Shared comparison
preserves snapshot evidence and labels unsupported/zero-call coverage as partial.
Reports expose adapter, language and call count; optional AI results stay separate.
See P14_1_MULTILINGUAL_CONTRACTS.md and the P14.2 extension below.

## P14.2 additional HTTP clients

standard-http-syntax.ts lazily loads the fixed, packaged ast-grep native runtime
and Go/C#/Java Tree-sitter grammars. Language modules produce the same bounded
observations without source execution or target compilers. Recovery errors and
parser availability failures remain explicit; existing JS/TS/Python extraction
does not require native initialization. axios-calls.ts reuses the JS/TS parser and
combines Axios/fetch observations under a per-file call cap. python-calls.ts adds
HTTPX and fresh Session/Client bindings with conservative mutation/scope checks.
Report observationKind separates constructions from request-call syntax. Adapter
IDs for JS/TS/Python now end in -http to reflect multiple clients. See
P14_2_ADDITIONAL_LANGUAGES.md for exact limitations and packaged validation.

## Automatic architecture policies (P15)

Optional `architecture` configuration selects source files, prohibits import directions,
and checks filename conventions offline. JS/TS, Python, Go, Java, and C# have
bounded import extraction; unresolved dependencies remain explicit. See [P15 configuration and coverage](P15_ARCHITECTURE.md).

## P16 external contracts

reference-access.ts validates runtime-only root/origin grants. reference-resources.ts
applies existing bounded reads to authorized roots and uses remote-reference.ts
for pinned, bounded public HTTPS snapshots. Virtual paths and origin identities
extend evidence provenance and AI freshness verification. version-policy.ts uses
semver for optional OpenAPI/SDK ranges and preserves exact version pins.
sdk-audit.ts loads explicit package manifests/declarations without importing code;
sdk-syntax.ts compares the documented named-function subset using existing parsers.
SDK results are separate optional report fields and participate in contract exit
semantics. No new service, credential store or source-writing capability is added.
See [P16 boundaries and verification](P16_EXTERNAL_CONTRACTS.md).

## P17 operating contract

USER_GUIDE.md, AGENT_GUIDE.md and REPORT_CONTRACT.md consolidate setup, stage/exit
interpretation, compatibility policy and a bounded caller-controlled development
loop. examples/capture-audit.mjs invokes the CLI without a shell, validates its
report/root and preserves exit codes with bounded runtime/output. It writes no
files and grants no checks, external access or AI spending. Shipcheck remains a
reviewer; developer editing/orchestration stays outside its runtime. CLI acceptance
tests exercise the packaged example through clean, defect and failure outcomes.

## P18 qualification harnesses

scripts/qualify-release.mjs scores deterministic seeded defect/clean/incomplete
cases using real installed ESLint/Ruff and internal contract/architecture checks.
scripts/qualify-processes.mjs exercises OS-process ledger contention, crash retention
and check descendant cleanup with disposable state. These are explicit development
qualification tools; they add no product runtime behavior or external-tool dependency.
The developer-loop fixture supports a supervised source-only repair exercise.
See P18_QUALIFICATION.md for measurements and remaining release decisions.
