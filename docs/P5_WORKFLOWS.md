# P5 — audit, diff and task

All workflows inspect without editing source. AI is opt-in; configured scripts or
tests run only with `--run-checks` and are trusted external programs, not sandboxed.
Use `--json` or `--markdown` for reports and `--ai preview/mock/live` for AI stages.
Live calls require an initialized allowance; see [budgets](P7_LIVE_AUDITS.md).
External references require separate [runtime grants](P16_EXTERNAL_CONTRACTS.md).

```powershell
shipcheck audit .
shipcheck diff . --json
shipcheck diff . --ai preview
shipcheck task tasks/example.json --ai mock
```

## Audit

Audit runs the configured repository checks, with workflow metadata in the
report. It does not imply comprehensive correctness or security coverage.
The redundant review CLI command has been removed; use audit instead.
Bootstrap shortcuts remain available.

## Diff

Diff requires the Git repository root and a valid HEAD. It combines tracked
changes relative to HEAD (staged and unstaged) with untracked, non-ignored files.
Git runs with argument arrays, no shell, optional locks disabled, a ten-second
timeout and 1 MiB output cap. No external diff or text conversion is used.

Review uses current full-file contents, not patch hunks or historical contents.
AI context focuses on selected paths, with bounded supporting local imports, and retains all prior exclusions and
size limits. Deterministic inspection uses repository context to resolve facts;
only findings with evidence on a changed path remain in the result. Consequently
this is not regression attribution: existing defects on changed files can
appear, and impacts whose evidence is solely on unchanged files can be omitted.
Repository-wide inspection warnings remain visible.

Deleted, linked, and non-regular selected paths are disclosed as unavailable.
An empty diff returns no scoped findings and skips configuration loading, repository inspection and AI. A nonempty scope with
no eligible AI source fails explicitly if AI was requested. Renames follow
Git's name-only output; there is no rename-history analysis. Arbitrary bases,
staged-only review and merge-base comparisons are not implemented.

## Structured tasks

```json
{
  "version": 1,
  "repository": "..",
  "files": ["src/cli-command.ts", "src/workflows.ts"],
  "criteria": ["Audit reports configured findings."]
}
```

Repository paths resolve relative to the JSON task file. Files must be exact,
repository-relative forward-slash paths, not globs, absolute paths or traversal.
The schema rejects unknown fields; files and criteria must be nonempty. Tasks
allow at most 256 paths and 50 criteria, each criterion at most 2,000 characters.
Task reads are bounded to 1 MiB, valid UTF-8, regular files without linked path
components. Missing or linked selected files reject the task before review.
Repository exclusions still apply; listing a file does not override them.

Task mode scopes review to those paths. Offline runs leave criteria unassessed;
explicit AI runs include normalized criteria as untrusted expectations for
[P13 task assessment](P13_TASK_ASSESSMENT.md). Assessments include evidence and
uncertainty, not proof of task completion. Mock assessments are synthetic.
Use `shipcheck task` without a task file for the configured
[inline current task](P11_TASK_AUDITING.md).

## Reports and exits

The optional workflow field identifies kind, selected scope (null for whole
repository), HEAD baseline for diff, unavailable paths, and task criteria.
Existing reports retain schemaVersion 1. Exit 1 includes deterministic violations
and configured check failures; exit 2 takes precedence for operational failures and
incomplete required deterministic stages. AI candidates and task assessments do
not independently determine exit 1. Inspect stage coverage even after exit 0.
See the [report and exit contract](REPORT_CONTRACT.md) for exact semantics.
