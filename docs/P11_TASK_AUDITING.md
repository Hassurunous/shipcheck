# P11 — Inline current-task auditing (completed through P13)

Users will define the current working task in `shipcheck.config.json`, rather than
maintaining another task file. This milestone extends P5's existing task workflow;
the new configuration and no-argument task invocation are now implemented.

## Current implementation

Add this section to `shipcheck.config.json`, then run `shipcheck task --json`
from that repository root:

```json
{
  "currentTask": {
    "id": "AUTH-1",
    "title": "Enforce authorization",
    "description": "Restrict access to protected operations.",
    "files": ["src/auth.ts"],
    "requirements": [{ "id": "REQ-1", "text": "Reject unauthorized requests." }],
    "nonGoals": ["Change storage"]
  }
}
```

Explicit `task <file>` remains unchanged. No task filename means the current
directory's config is used; missing currentTask is an error. Audit/diff do not
become task assessments. Files are literal relative paths, not globs. Missing or
linked selected files fail before review. Existing exclusions and AI limits apply.

Reports identify the task and SHA-256 of its normalized schema content (including
defaulted fields), plus requirement IDs/text and non-goals. This is not a hash of
the config file's formatting. Limits: 256 files, 50 requirements, 50 non-goals,
2,000 characters per criterion/non-goal, and a 4,000-character description.

**P13 now assesses task requirements with explicit live AI.** Preview/mock and
deterministic-only runs remain unassessed. See [P13](P13_TASK_ASSESSMENT.md) for
per-criterion outcomes, source/reference evidence, task freshness and context limits.
Exit code 0 does not mean task completion; supporting evidence is not proof.

Configured checks reject standalone `--fix`, `--fix-only`, `--unsafe-fixes` and
`--write` flags, including equals forms. This is a conservative guard, not a sandbox:
wrappers, scripts and other flags may still write. Use trusted inspection commands.

## Intended workflow

`currentTask` contains a stable task ID, title/description, selected files,
requirements with stable criterion IDs, and optional non-goals. `shipcheck task`
uses this section. Explicit `shipcheck task <file>` remains available for existing
workflows. `audit` keeps its repository-wide meaning and does not silently become
a current-task assessment.

The developer AI implements work. Shipcheck independently evaluates supplied code
and supporting references against each criterion, reporting potential violations,
supporting evidence, insufficient evidence, or a need for clarification. Supporting
evidence is not proof of satisfaction. Reading test source is not running a test.
Reports identify the exact task content hash and criterion IDs assessed.

## Ownership and write boundaries

Users own requirements and decide which developer agents may change them. Authorized
agents may update `currentTask`; Shipcheck does not add a requirement approval gate,
lock, or requirement-immutability policy. A task hash identifies assessed content;
it neither proves user approval nor prevents the developer from changing criteria.
If code and requirements change together, an audit checks their present consistency,
not whether the original intent was preserved. Documentation must state that risk.

Shipcheck itself never applies fixes or rewrites source, requirements, or configuration
during an audit. AI reviewers return structured reports, with no editing tools or
command-execution capability. Task/reference text is evidence, not authority to
execute commands, increase spending, or expand filesystem access.

External checks are a separate trust boundary: user-configured programs run with
the user's permissions and can write files. They must be configured for inspection
only. Reject recognized fixing modes where practical and explain that arbitrary
commands cannot be guaranteed read-only without isolation. A true read-only sandbox
is a separate future capability, not a promise of P11. Shipcheck-owned budget state
and explicitly requested reports are separate from source edits.

## Risks to document

- A stale current task can assess the wrong expectations; show its ID/title clearly.
- One shared current task can conflict with parallel work; separate worktrees or
  later named-task support can address that workflow.
- Changes to code and requirements together may move the acceptance criteria.
- Invalid configuration must stop clearly before dependent execution.
- Sensitive task text may be sent with explicit live AI requests; disclose selection
  and bound size. Never send unrelated configuration or credentials.
- Ambiguous, conflicting or omitted criteria must be reported, not treated as passed.

## Acceptance checklist

- [x] Strict, bounded inline task schema and explicit current-task command behavior
- [x] Backward-compatible explicit task-file support
- [x] Per-criterion assessments with code/reference evidence and task content hash (P13)
- [x] No source/task/config rewriting or AI editing tools
- [x] Clear external-check write-risk documentation and recognized fix-mode guards
- [x] Tests for fulfilled/violated/ambiguous criteria, missing context and changed tasks (P13)
- [x] User documentation explaining authorized developer changes and accepted risks
