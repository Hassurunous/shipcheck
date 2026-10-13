# P23 — Required checks and deeper offline auditing

P23 adds opt-in execution requirements, a Pyright JSON adapter and a separate
Python type-checking preset. Existing configurations retain their behavior.
There are no new runtime dependencies, automatic installs or implicit API calls.

## Require a configured check

```json
{
  "checks": [
    {
      "id": "tests",
      "purpose": "test",
      "required": true,
      "command": "node",
      "args": ["--test"]
    }
  ]
}
```

Run `shipcheck audit . --run-checks`. Requirements never grant execution
permission. Without authorization, a required check remains `skipped` in the
report, but the CLI exits 2 and its execution-summary stage is failed/incomplete.
Language-gated skips cannot satisfy a required check either. A completed failed
check still exits 1; operational errors exit 2; a passing check can satisfy its
requirement under its configured threshold and exit-code policy.

`required` means this specific configured command must complete, not that it
proves adequate coverage or code correctness. Purpose labels do not establish
what a tool actually checked. Users can weaken requirements or tool settings;
Shipcheck does not independently approve their configuration changes.

Required checks also apply to an empty `diff`, since external checks have
whole-repository scope. With no required checks, the existing empty-diff shortcut
remains. The shortcut for an unchanged invalid configuration also remains; an
empty diff with invalid configuration is not a policy attestation. Use a full
audit to enforce configuration validity. Low-level `reviewRepository` only
performs deterministic inspection; use the CLI or `runWorkflow` for execution.

## Python type checking

```json
{
  "quality": {
    "presets": ["python", "python-types"],
    "required": ["ruff", "pyright"]
  }
}
```

The existing `python` preset still selects Ruff only. The new `python-types`
preset discovers the regular, unlinked project-local file
`node_modules/pyright/index.js` and runs it with Node and `--outputjson`. It does
not look on PATH or in ancestor directories, install tools or probe versions.
Install Pyright yourself, or bind a separately configured check:

```json
{
  "quality": {
    "presets": ["python-types"],
    "bindings": {"pyright": "python-types"},
    "required": ["pyright"]
  },
  "checks": [
    {
      "id": "python-types",
      "purpose": "typecheck",
      "command": "pyright",
      "args": ["--outputjson"],
      "format": "pyright-json"
    }
  ]
}
```

Explicit bindings can use PATH because the user chose the command. A required
binding runs once and retains the check's settings; it is marked required in the
result. Required slots must have an enabled preset and cannot be disabled. A
required preset whose language is absent reports an unsatisfied skipped check.

Pyright controls its own includes, excludes and strictness. For a small project,
a `pyrightconfig.json` can contain:

```json
{"include": ["src"], "typeCheckingMode": "strict"}
```

The adapter normalizes `generalDiagnostics`, including `reportAssignmentType`
and `reportUnusedCoroutine`, to relative paths and one-based lines/columns.
Error, warning and information severities map to error, warning and info. Summary
counts must agree with diagnostics; malformed JSON, invalid ranges and paths
outside the audited root are operational errors. Tool diagnostics are not
independent source-citation verification. Exact analyzed-file coverage remains
unknown even when the tool reports a file count.

The preset treats exit 1 as findings and fatal/configuration exits as operational
errors. Existing `failOn` thresholds apply. Recognized `--createstub` flags are
rejected because they generate files. Trusted external programs are still not a
read-only sandbox. See the [official Pyright CLI/JSON contract](https://github.com/microsoft/pyright/blob/main/docs/command-line.md).

## What this detects offline

The real-tool qualification uses Pyright 1.1.414 for two paired cases: a Python
assignment type mismatch and an unawaited coroutine, each with a correct control.
These checks delegate language semantics to an existing analyzer; Shipcheck did
not add its own Python parser or general race detector.

The same harness runs Node assertions against the frozen P22 average and
concurrent-append defect/clean examples. All four outcomes demonstrate that
project tests can catch these behavioral failures without AI. They do not raise
the P21 general-detector score or imply Shipcheck invented the tests. The existing
corpus is unchanged. Developer agents remain responsible for writing and fixing
source/tests; Shipcheck only runs explicitly authorized audit commands.

Validation passed on Windows: typecheck, build, 653 tests, all 27 executable
CLI acceptance groups, and eight real-tool defect/clean checks. No AI spend
was used. Pyright 1.1.414 was installed only in an ignored qualification
directory; Shipcheck runtime dependencies were unchanged.

From a repository checkout, reproduce the eight real checks after building,
with an installed Pyright entry:

```powershell
npm run build
node scripts/qualify-p23.mjs <path-to-pyright-index.js>
```

The harness blocks AI requests, uses disposable repositories, asserts defective
exit 1 versus clean exit 0, validates actual diagnostic rules and locations, and
checks that fixture files remain unchanged. Qualification is Windows-only.

## Reporting and remaining limits

`checks[].required` is an optional additive report field. Skipped required checks
are visible in console/Markdown/JSON and flow into the P22 AI evidence context.
Other report fields and existing non-required behavior are retained.

This milestone improves Python coverage and the reliability of project quality
gates. Broader language adapters, independently evaluated source rules, and
historical real-repository accuracy qualification remain future work. Passing
all configured checks still does not establish general correctness.
