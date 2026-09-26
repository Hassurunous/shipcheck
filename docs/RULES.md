# Deterministic rules (P2)

All initial rules operate on typed diagnostics captured while inspecting readable
files named exactly `package.json`, including nested packages. They report
severity `error` because these are structural manifest defects. This severity
does not set a process exit code; command workflows are deferred.

| Rule ID | Trigger | Suggested action |
| --- | --- | --- |
| `package/invalid-json` | JSON parsing fails. | Correct the manifest's JSON syntax. |
| `package/invalid-object` | JSON parses, but the top-level value is null, an array, or a primitive. | Use a top-level JSON object. |
| `package/invalid-scripts` | An object has a scripts field that is not an object of string values. | Use string-valued scripts or omit the field. |

Only the first applicable validation stage reports an issue for each manifest.
Missing scripts, an empty scripts object, and empty command strings are accepted.
Other package fields are not validated. Script commands are never executed, and
no claim is made about whether they would succeed.

Evidence contains the relative manifest path and a parser/validator observation.
Line numbers and excerpts are omitted because P2 does not locate JSON errors
reliably. These are captured facts from the inspected tree, not fresh evidence
verification at report time. Reports made from externally supplied profiles
rely on the accuracy of those profiles.

Unreadable, oversized, binary, or skipped content produces inspection warnings,
not package findings. Existing profiles without typed package diagnostics must
be reinspected to produce these findings. A zero-finding report means only that
these rules did not identify a defect in the content they could inspect.

## Additional rules and defaults

| Rule ID | Default | Trigger and limits |
| --- | --- | --- |
| `package/conflicting-lockfiles` | warning | A package directory contains lockfiles from more than one of npm, Yarn, pnpm, or Bun. Two npm or two Bun lockfiles alone do not trigger this rule; nested packages are independent. |
| `package/missing-local-dependency` | error | A literal relative `file:` dependency in dependencies/devDependencies/optionalDependencies references no inventoried file or directory. Workspace protocols and external/absolute paths are skipped. |
| `package/missing-script-target` | warning | A script consists solely of `node path.js` or `tsx path.ts` (including cjs/mjs/cts/mts). Only unquoted literal paths are recognized; flags, arguments, spaces in paths, pipelines, and command chains are skipped. |
| `package/missing-entry-point` | off | A main/module/types/typings/bin target is absent. Existing directories and extensionless non-bin targets are skipped because module resolution is not implemented. Build first for generated entries. Exports maps are not checked. |
| `repository/missing-readme` | off | No included README filename is detected anywhere in the inspected tree. It is a documentation policy, not a claim of defective code. |
| `repository/missing-tests` | off | No included file matches test conventions. It does not prove tests are absent. |
| `source/fixme` | off | A source file under root `src/` has a line beginning with `//`, `#`, `/*`, or `*`, then FIXME. Known test files are excluded. Line/excerpt evidence is included, once per line. This is lexical, not AST-based; multiline strings may match. |

Reference existence is captured during inspection using filesystem lookups,
preserving the actual volume's case sensitivity. A missing-target finding
requires an explicit `missing` observation; older profiles without existence
facts must be reinspected. Links and inaccessible paths produce `unknown`,
not a missing-target finding. No referenced file contents are read.

All missing-target checks skip paths outside the root, protocols/encoded paths,
excluded paths, `.git`/`node_modules`, and paths at or below skipped links,
special files, or unreadable directories. Files and directories are treated as
existing targets; target type and package contents are not validated. Generated
script/dependency targets may be absent before a build: configure an override
or exclude the generated location. Missing README/test policies are suppressed
when directory/link warnings make enumeration incomplete. With exclusions,
their conclusions explicitly concern included files only.

TODO matches are not findings. FIXME policy intentionally covers only a narrow
source convention; use overrides for fixtures or disable the rule. Generated
files remain in scope unless excluded, because `.gitignore` is not interpreted.
See [configuration](CONFIGURATION.md) for exclusions, levels, and overrides.
