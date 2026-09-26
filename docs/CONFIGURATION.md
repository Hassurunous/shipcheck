# Configuration

`reviewRepository(target)` loads `shipcheck.config.json` from the target root,
then inspects and reports with that configuration. No config file means defaults.
Malformed JSON, unknown keys/rule IDs, unsupported patterns, and invalid
severities fail clearly. Config is data only; no JavaScript is executed.

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
remain unconditionally skipped. `.gitignore` is not interpreted. No exclusions
are implicit beyond those two names; this repository's config excludes `dist`
and `coverage`. Missing-target rules skip targets under excluded locations.

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
reinspect to populate references and directory inventory. The P2.5 review CLI
returns 1 for error-level findings and 2 for usage or operational failures.
