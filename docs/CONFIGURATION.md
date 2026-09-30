# Configuration

For `contracts` mappings from supported HTTP clients to OpenAPI resources, see
[P14 contract checks](P14_CONTRACT_CHECKS.md). These deterministic checks run in
audit/diff/task workflows without enabling AI or external commands.
Mappings may mix JavaScript, TypeScript/TSX, Python, Go, C# and Java source paths;
adapters are selected automatically by extension. See
[current language/client support](P14_2_ADDITIONAL_LANGUAGES.md).

`reviewRepository(target)` loads `shipcheck.config.json` from the target root,
then inspects and reports with that configuration. No config file means defaults.
Malformed JSON, unknown keys/rule IDs, unsupported patterns, and invalid
severities fail clearly. Loading config does not execute code. Configured commands
run only with explicit `--run-checks`; see [P7 settings](P7_CONFIGURATION.md).

The root must be a real directory, not a symlink. A missing config uses defaults;
linked, non-regular, unreadable, oversized, or invalid UTF-8 config files fail.
Config content is capped at 1 MiB, including growth during reading; UTF-8 BOMs
are accepted. Root and size policy are shared with inspection. As with the
inspector, this assumes a stable local tree rather than adversarial concurrent
path replacement.

```json
{
  "version": 1,
  "exclude": ["dist/**", "coverage/**"],
  "rules": {
    "package/conflicting-lockfiles": "warning",
    "repository/missing-readme": "info",
    "source/fixme": "off"
  },
  "overrides": [
    {
      "files": ["test/fixtures/**"],
      "rules": { "package/invalid-json": "off" },
      "reason": "Fixtures intentionally contain malformed manifests."
    }
  ]
}
```

Levels are `off`, `error`, `warning`, and `info`. Start with rule defaults, apply
global `rules`, then matching overrides in order (last match wins per rule).
Overrides match the primary evidence path, typically the declaring manifest,
not its referenced target. Repository-wide policies use `.` as their evidence
path; use global settings for these. Each override requires a reason.

Patterns are case-sensitive relative paths using `/`. `*` matches within one
segment; a whole-segment `**` matches zero or more segments. `dist/**` excludes
root build output; `**/dist/**` excludes nested build output too. Exact directory
exclusions also exclude descendants. Other glob syntax, absolute paths, `..`,
backslashes, and negation are unsupported and rejected.

Exclusions are applied before file reading/traversal. `.git` and `node_modules`
are skipped during general repository inspection. Explicit SDK mappings can read
installed declarations under [P16 rules](P16_EXTERNAL_CONTRACTS.md). `.gitignore`
is not interpreted. Other inspection exclusions must be configured explicitly.
Missing-target rules skip targets under excluded locations.

For explicit API configuration, `reviewRepository(target, config)` replaces
disk configuration. The lower-level `inspectRepository(target, { exclude })`
and `createReport(profile, config)` do not auto-load configuration. Passing
exclusions to `createReport` filters rule inputs but cannot undo prior reads;
use `reviewRepository` to exclude content before inspection.

Inspection warnings remain visible when rules are disabled. The existing
invalid-manifest diagnostic is still represented solely by its associated
rule, so disabling that rule suppresses that defect. Suppression does not
remove unrelated unreadable-file/directory or skipped-content warnings.

The report schema remains version 1 with optional evidence line/excerpt fields.
New profile fields default to empty arrays for older serialized profiles;
reinspect to populate references and directory inventory. See the
[report contract](REPORT_CONTRACT.md) for current CLI exit semantics.

## P3 AI settings

Optional `ai` settings configure mode, per-mode model mappings, context limits,
output limit, and timeout. See [P3 settings](P3_AI.md). Low cost is the default;
all real model mappings default to null. Ordinary review ignores AI execution
settings unless the caller explicitly requests AI execution. A config cannot
enable network execution. Unknown settings and out-of-range limits are rejected.
CLI `--mode` overrides `ai.mode`; automatic retries are fixed at zero.

Live requests use pinned priced models when mappings are null; other mappings
are rejected. Configuration cannot increase allowance or live token ceilings;
see [named budget limits](P7_LIVE_AUDITS.md) and the separate historical
[live trial](LIVE_TRIAL.md).

## Automatic architecture policies (P15)

Optional `architecture` configuration selects source files, prohibits import directions,
and checks filename conventions offline. JS/TS, Python, Go, Java, and C# have
bounded import extraction; unresolved dependencies remain explicit. See [P15 configuration and coverage](P15_ARCHITECTURE.md).

## External references and SDK contracts (P16)

Resources may specify `rootId` or a hash-pinned HTTPS `url`; runtime CLI/API grants
authorize access separately. `contracts` accepts `versionRange`, and `sdkContracts`
maps JS/TS consumers to installed or externally mapped package declarations.
See [P16 configuration, permissions, examples and limits](P16_EXTERNAL_CONTRACTS.md).
Explicit SDK mappings can read declarations under `node_modules`, which ordinary
inspection still skips. Authorized remote references may be fetched in AI-offline
runs; ordinary configuration alone never enables network execution.
