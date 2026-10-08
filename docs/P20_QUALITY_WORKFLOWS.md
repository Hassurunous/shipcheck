# P20 — Practical offline quality workflows

Quality presets are optional configuration shortcuts around the existing bounded
external-check runner. They do not turn a default audit into a general quality
certification. No tools are installed, no package scripts are guessed, and no
commands or AI calls are authorized merely by configuration.

## Start with a preset

Merge this into the target repository's shipcheck.config.json:

```json
{
  "quality": {"presets": ["typescript"]},
  "ai": {"focus": ["correctness", "error-handling", "resource-management", "race-conditions", "code-smells"]}
}
```

```powershell
shipcheck audit . --json
shipcheck audit . --run-checks --json
shipcheck audit . --run-checks --ai preview --whole-repository --json
```

The first command discovers tools and discloses missing coverage without running
them. The second authorizes the configured programs. The third also previews AI
context without consulting a model. Existing --ai live --budget <name> controls
are required for paid review; presets grant no allowance. AI focus settings
already supported by Shipcheck select contextual review concerns. Preview and
mock responses are not quality diagnoses.

## Presets and exact discovery paths

| Preset | Default tools | Scope/requirements |
| --- | --- | --- |
| javascript | ESLint | node_modules/eslint/bin/eslint.js; project ESLint configuration |
| typescript | ESLint and TypeScript | Same ESLint entry point plus node_modules/typescript/bin/tsc and root tsconfig.json |
| python | Ruff | .venv/Scripts/ruff.exe on Windows; .venv/bin/ruff elsewhere |

Combining javascript and typescript schedules ESLint once. Automatic selection
uses the ignore-aware language inventory. Discovery checks regular local paths
without following links, searching PATH/ancestor directories, importing tool code
or executing version probes. A ready entry means a path was found, not that the
tool works. Symlinked package-manager layouts, other virtual environments,
monorepos and alternative tools should use explicit bindings.

ESLint runs on . with JSON output. Its existing configuration must support the
project's languages; the TypeScript preset does not install an ESLint parser or
rules. TypeScript runs with --project tsconfig.json --noEmit --incremental false
--pretty false. Composite/build-reference projects may need a custom check;
this command does not build referenced projects or prove every source was checked.
Ruff runs check . --no-fix --no-fix-only --no-cache --output-format json. Disabling
both fix modes prevents configured fix/fix-only settings from repairing sources.
See the official [Ruff CLI](https://docs.astral.sh/ruff/configuration/) and
[TypeScript options](https://www.typescriptlang.org/docs/handbook/compiler-options).

External tools use their own configuration and ignores. Shipcheck's ignore policy
only controls its own inventory, language selection and built-in/AI inspection;
it is not translated into external-tool exclusion flags. Tool code, plugins,
configuration and explicitly configured commands run with user permissions, not
inside a read-only sandbox. Presets request non-fixing operation but cannot
constrain arbitrary tool/plugin behavior.

## Bind existing checks and add tests

Bindings name an existing check ID; false disables a preset tool. The available
slots are eslint, typescript and ruff, each requiring its corresponding preset.
A bound check runs once using its own arguments, language gate, limits and format.
Bindings do not change those settings or infer the check's actual semantics.

```json
{
  "quality": {
    "presets": ["python"],
    "bindings": {"ruff": "python-lint"}
  },
  "checks": [
    {
      "id": "python-lint",
      "purpose": "lint",
      "command": ".venv/Scripts/ruff.exe",
      "args": ["check", ".", "--no-fix", "--no-fix-only", "--no-cache", "--output-format", "json"],
      "format": "ruff-json"
    },
    {
      "id": "tests",
      "purpose": "test",
      "command": ".venv/Scripts/python.exe",
      "args": ["-m", "pytest", "-p", "no:cacheprovider"],
      "languages": ["Python"]
    }
  ]
}
```

This example assumes an existing Windows virtual environment with Ruff and pytest.
Use its bin paths on other systems. Tests may have side effects: authorize only
trusted commands. Do not copy the example without adapting it to the project.

Explicit checks may declare purpose as lint, typecheck, test or other. This is a
user assertion, not verification that the command implements that purpose. Tests
are never inferred from package.json. Ruff does not typecheck Python; configure
a suitable separate command if required. Other languages continue to work through
explicit checks; text output is retained for tools without a structured adapter.

Preset-generated IDs are quality-eslint, quality-typescript and quality-ruff.
The quality- prefix is reserved while presets are enabled. Presets plus explicit
checks must fit the existing 20-check bound (validation conservatively counts
all selected slots, including disabled/bound slots). Generated checks use the
existing 60-second/64-KiB defaults. Bind a custom check to change those limits.

## Reading results

quality.tools records each slot, command/arguments when known, check ID, purpose,
source and discovery state: ready, unavailable, disabled or not-applicable.
Actual execution and diagnostics remain in checks. ESLint/Ruff diagnostics retain
rule IDs, paths, severity and locations; TypeScript and generic checks preserve
bounded text and exit status. Discovery does not attest exact file coverage.

Missing selected tools appear even without --run-checks. With authorization,
missing applicable tools produce check errors and exit 2. Violations produce
exit 1; disabled and non-applicable slots do not run. Existing exit precedence
still applies. quality.gaps and limitations disclose unconfigured tests, Python
typechecking and broader contextual limits. A configured purpose label does not
prove that a test command ran: inspect its actual result and language gate.

Presets run through audit/diff/task workflows, with whole-repository external
check scope. An empty diff retains its no-work shortcut. Lower-level
reviewRepository/reviewWithAi APIs do not resolve or run presets; their scope
summary discloses this. Use runWorkflow for the integrated pipeline.

## Verification and next milestone

Run npm run verify for the regression/build/CLI suite. For real tool qualification,
run node scripts/qualify-quality.mjs with an existing node_modules directory
containing ESLint and a Ruff executable; the harness also uses the checkout's
installed TypeScript. It creates temporary defect and clean cases and verifies
source/config preservation, including Ruff configured to fix automatically.
No dependency download or paid AI call is needed. Qualification remains Windows
only. P21 will evaluate broader effectiveness and developer repair loops; these
small integration fixtures are not real-world precision/recall evidence.

Keep virtual environments out of inspection with a repository-local .gitignore
entry such as .venv/. If you use explicit Shipcheck exclusions, include the virtual
environment there or enable respectGitignore alongside those exclusions. Presets
do not silently alter the repository ignore policy.

Discovery includes generated preset commands. Explicitly bound command arguments
are not copied into report metadata, since arbitrary arguments may hold sensitive
values. Their check IDs identify the original configuration.

### Local qualification evidence

Windows x64 / Node 22.23.3: typecheck and build passed; 590 regression tests passed.
The built and separately installed package each passed 26 offline CLI acceptance
groups; a strict NodeNext consumer checked the new configuration/report exports.
Six real-tool defect/clean cases passed using ESLint 10.11.0, Ruff 0.16.9 and
TypeScript 7.0.2. Source/configuration preservation was verified, including Ruff
fix/fix-only settings enabled in its configuration. Paid API spend: $0.
