# Architecture

## Current implementation (P3 with bounded live trial)

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
executable is `dist/src/cli.js`. The package file list includes only `dist/src`
and the README, so compiled tests are not part of the planned package contents.

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
report time. P4 will address evidence verification. See `docs/RULES.md` for rules.

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
FIXME comment rule. No language AST is parsed; multiline strings can resemble
comments. See `docs/CONFIGURATION.md` for configuration precedence and patterns.

## Near-term direction

```text
CLI
 ↓
Repository inspection
 ↓
Structured repository profile
 ↓
Deterministic findings
 ↓
Future specialist AI reviewers
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
to `audit`. This is a deterministic review command, not the planned AI audit,
Git diff, or task workflow.

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
attaches per-candidate verification results. Deterministic createReport remains
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
applicable reference fails to load. Reference bodies are not yet AI context.
The standalone verifier compares submitted and fresh snapshots and exact line
excerpts; integration with AI evidence is pending. See P8_REFERENCE_RESOURCES.md.

## P9 operation-index foundation

openapi-contract.ts indexes direct operations from loaded OpenAPI JSON snapshots
as a pure exported API. Snapshot hashes and JSON Pointers preserve structural
provenance; unresolved references and malformed entries produce explicit issues.
It does not yet participate in workflow reports or compare source calls. See
P9_CONTRACT_AUDITING.md for supported input and limitations.

## P10 policy foundation

intent-policy.ts validates requirements and forbidden dependency directions,
hashes normalized policy content and evaluates caller-supplied dependency
observations. It performs no I/O and does not verify evidence or assess natural
language. Results explicitly disclose observation-only coverage. It is exported
as a library API; CLI integration remains pending. See P10_INTENT_POLICIES.md.

## P11 inline task selection

task-file.ts defines bounded currentTask configuration and normalized task identity.
The no-file CLI task invocation selects currentTask from the working directory's
configuration; explicit task files retain their existing behavior. Workflow reports
include unassessed per-criterion statuses. AI requirement assessment is pending.
Checks reject recognized fixing flags; arbitrary external commands are not sandboxed.
