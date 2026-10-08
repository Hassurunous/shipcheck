# P19 — Audit scope and execution transparency

Shipcheck consolidates bounded checks and evidence. A default offline audit is
not a comprehensive code-quality review. P19 makes this limitation visible in
every report, alongside the actual work performed.

## What changed

Console, Markdown and JSON expose an execution summary covering inspection,
built-in rules, external commands, references, HTTP/SDK contracts, architecture,
AI and task assessment. Configured but unauthorized commands are distinct from
unconfigured commands. Disabled rules, unavailable inputs, failed stages and
empty diffs cannot masquerade as completed analysis.

Preview selects AI input without consulting a model. Mock results are synthetic.
Injected transports do not establish live-provider execution. Completed live
responses retain their file coverage even when another batch fails. No eligible
AI source means no AI batches ran, not successful whole-repository review.

## Coverage has limits

- Inspection and built-in-rule file lists record successfully decoded bounded
  reads. Inventory or language detection does not mean semantic analysis occurred.
- External commands use their own scope and ignore configuration. Their exact
  checked files are unknown; diagnostic paths cannot establish the full set.
- Contract and architecture checks only cover documented patterns and explicit
  mappings/policies. Unsupported patterns and operational gaps remain visible in
  detailed results and summary limitations.
- AI selected files and files included in completed live responses are separate.
  Valid responses and matching citations do not prove diagnoses are correct.
- Ignore policy describes exclusions; skipped subtrees are not fully enumerated.
  A summary omission list is not an exhaustive list of every unexamined file.

The additive `auditSummary` field keeps report schema version 1. Its overall
quality verdict is always `not-established`. Existing exit codes and detailed
results remain unchanged. Consumers must check required stages, evidence and
coverage rather than treating exit 0 as certification. See the
[report contract](REPORT_CONTRACT.md) for field semantics.

## Reproduce without API spending

```powershell
npm run verify
shipcheck audit . --json
shipcheck audit . --ai preview --json
shipcheck audit . --ai mock --json
```

Authorize configured external commands explicitly with `--run-checks`. Inspection
does not automatically execute repository scripts. Tests use temporary fixtures,
real local check processes and synthetic AI results; no paid calls are needed to
validate this reporting milestone. CLI acceptance exercises the built executable
and network-denies its synthetic repositories.

## Offline checks and AI enhancement

Lint violations, type errors, known dependency/API shapes and explicit boundary
policies are well suited to deterministic tools. Broader offline coverage should
reuse configured language tools and consolidate their results (planned P20).

AI can help investigate contextual error handling, cross-file assumptions,
maintainability tradeoffs and requirements alignment. Race conditions may need
concurrency tests or specialized analysis as well as contextual review. No issue
category is made universally AI-only: when no suitable offline analyzer is
configured, the report should disclose that gap. AI observations remain evidence
for review, not guarantees. Representative defect/clean-control evaluation and
developer-loop measurements are planned for P21.

P19 adds no analyzers, dependencies, automatic execution grants or paid requests.
Shipcheck still reports results without rewriting source or task expectations.

## Local validation

Windows verification passed typechecking, all 576 regression tests, the build and
25 offline CLI acceptance groups. A built-CLI self-audit confirmed the summary
distinguishes completed inspection/rules, configured commands lacking run
authorization, unconfigured policies and AI not requested. No API calls or spending
were used for P19 validation. These checks validate disclosure behavior, not broader
analyzer effectiveness or non-Windows qualification.
