# P5 — audit, diff and task

All workflows are read-only and offline by default. They accept the existing
--json, --ai preview/mock/live, --mode, and --trial options. No scripts or tests
are executed, no code is modified, and AI spending limits are unchanged.

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
AI context is limited to selected paths and retains all prior exclusions and
size limits. Deterministic inspection uses repository context to resolve facts;
only findings with evidence on a changed path remain in the result. Consequently
this is not regression attribution: existing defects on changed files can
appear, and impacts whose evidence is solely on unchanged files can be omitted.
Repository-wide inspection warnings remain visible.

Deleted, linked, and non-regular selected paths are disclosed as unavailable.
An empty diff returns no scoped findings and skips AI. A nonempty scope with
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

Task mode scopes review to those paths. Criteria are displayed as requiring
human confirmation, not evaluated by deterministic rules or sent as AI
instructions. The workflow does not claim task completion or understand arbitrary
requirements. It uses the same QA reviewer and citation verifier as audit/diff.

## Reports and exits

The optional workflow field identifies kind, selected scope (null for whole
repository), HEAD baseline for diff, unavailable paths, and task criteria.
Existing reports retain schemaVersion 1. Exit 0 means completed without scoped
deterministic errors, 1 means deterministic error findings, and 2 means operational
failure. AI candidates and human acceptance criteria do not determine exit 1.

The approved live trial remains exhausted. P5 tests and smoke checks are offline
and do not extend its allowance.
