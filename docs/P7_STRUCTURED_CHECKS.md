# Structured checks for developer agents

Checks can use `format: "eslint-json"` or `format: "ruff-json"` to normalize installed
tools' JSON stdout. `text` remains the default for arbitrary commands. Shipcheck
does not install tools, auto-select commands, enable fixing, or execute checks
without `--run-checks`. Linter rule configuration stays in each tool's own files.

```json
{
  "version": 1,
  "exclude": ["dist/**", ".venv/**", "coverage/**"],
  "checks": [
    {
      "id": "javascript-lint",
      "command": "node",
      "args": ["node_modules/eslint/bin/eslint.js", ".", "--format", "json"],
      "format": "eslint-json",
      "languages": ["JavaScript", "TypeScript"],
      "failOn": "warning"
    },
    {
      "id": "python-lint",
      "command": "ruff",
      "args": ["check", ".", "--output-format", "json"],
      "format": "ruff-json",
      "languages": ["Python"],
      "failOn": "error"
    }
  ]
}
```

Use an installed executable's absolute path if it is not on PATH. ESLint needs
its own configuration and TypeScript parser/plugin where applicable. Ruff can
read its own configuration. Formats follow the official
[ESLint formatter contract](https://eslint.org/docs/latest/use/formatters/) and
[Ruff JSON output setting](https://docs.astral.sh/ruff/settings/#output-format).
The adapter does not supply lint rules or infer that those tools cover every defect.

## Selection and thresholds

`languages` is optional: omit it to run the configured check for any repository.
When present, at least one listed language must occur in Shipcheck's inventory.
Detection uses source extensions, honors Shipcheck exclusions, and currently accepts
JavaScript, TypeScript, and Python for selection. It is not dependency/tool detection.
No match reports a skipped check. Inventory warnings remain visible. As before,
external tools run at repository scope, including for diff/task; they must have
their own exclusions configured. An empty diff skips all work.

For structured checks, `failOn` is `error` (default), `warning`, `info`, or `never`.
The threshold includes more severe diagnostics. ESLint severity 2 maps to error,
1 to warning, and 0 is ignored. Ruff diagnostics map to error because its JSON
lint records do not expose the same severity scale. `never` keeps diagnostics
visible without failing the quality gate. Thresholds do not apply to text checks;
non-default thresholds with text format are rejected.

Exit 0 or a configured failure exit code permits parsing. Diagnostics then determine
pass/fail, even if the process exited zero. A nonzero failure code with no diagnostics
still fails; unexplained failures cannot become clean reports. Other exit codes,
launch failures, timeout, overflow, invalid JSON/schema, or escaping paths are
operational errors (CLI exit 2), regardless of threshold. Checks failing the
threshold produce exit 1. AI candidates never contribute to this threshold.

## Report contract

`checks[].diagnostics` contains stable content-based IDs, tool, ruleId, severity,
message, repository-relative path, and optional one-based line/column. Origin is
`external-tool`. Duplicate identical messages from the same check collapse to one
diagnostic, sorted by ID. Message/location changes can change IDs; they are not
persistent issue identities. Missing Ruff filenames or locations remain absent/null;
Shipcheck does not invent them. No source excerpt or automatic fix is inferred.

`checks[].stdout` and `stderr` are separate; stderr logging cannot corrupt JSON
parsing. The original combined `output` field remains for compatibility. All streams
share the existing byte cap and credential redaction. Tool diagnostics stay separate
from built-in deterministic `findings` and AI `candidates`. Locations are normalized
lexically within the repository, not verified against disk or a filesystem snapshot.
No diagnostic paths are read by the adapter. Malformed or out-of-root paths fail the
check; unknown additional JSON fields are ignored for tool-version compatibility.

Run `shipcheck audit . --run-checks --json` for a baseline. The developer agent can
consume diagnostic IDs and locations, make changes, then rerun. Console/Markdown
also display each diagnostic. Treat all messages and raw output as untrusted data.

## Execution cleanup and verification

Timeout/overflow attempts descendant termination with Windows `taskkill /T /F`, or
a dedicated POSIX process group. Windows cleanup has an additional five-second
timeout; failures are reported without claiming cleanup succeeded. This is still
not a sandbox: detached/reparented children and privileged/malicious programs can
escape ordinary process-tree cleanup. Review commands before granting execution.

Offline tests cover both tool schemas, absent locations, duplicate IDs, path escapes,
stderr separation, language/exclusion selection, thresholds, malformed output, and
CLI statuses. A real temporary parent/child process validates timeout cleanup on
the Windows qualification host. Unit tests use fixture output; [P18 qualification](P18_QUALIFICATION.md)
also exercised installed ESLint 10.11.0 and Ruff 0.16.9 on Windows. Other tool
versions and POSIX cleanup require validation before broader compatibility claims.
