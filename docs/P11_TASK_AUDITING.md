# P11 — Inline current-task auditing (planned)

Users will define the current working task in `shipcheck.config.json`, rather than
maintaining another task file. This milestone extends P5's existing task workflow;
the new configuration and no-argument task invocation are not implemented yet.

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

- [ ] Strict, bounded inline task schema and explicit current-task command behavior
- [ ] Backward-compatible explicit task-file support
- [ ] Per-criterion assessments with code/reference evidence and task content hash
- [ ] No source/task/config rewriting or AI editing tools
- [ ] Clear external-check write-risk documentation and recognized fix-mode guards
- [ ] Tests for fulfilled/violated/ambiguous criteria, missing context and changed tasks
- [ ] User documentation explaining authorized developer changes and accepted risks
