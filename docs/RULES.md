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

Absent README/test indicators and TODO/FIXME occurrences remain observations.
Generated files remain in scope because `.gitignore` is not interpreted yet;
for example, an intentionally malformed package fixture may produce a finding.
Suppression and configurable exclusions are not implemented in P2.
