# P8 — Reference resources (in progress)

The first slice loads explicitly configured repository-local reference files and
reports their provenance. [P12](P12_REFERENCE_AUDITS.md) now integrates applicable
references into bounded AI context. `references.evaluation` is always `not-assessed`; `ready` means
loading succeeded, not that the implementation satisfies a contract.

Add resources to `shipcheck.config.json`:

```json
{
  "version": 1,
  "resources": [
    {
      "id": "service-contract",
      "path": "docs/service.openapi.json",
      "kind": "openapi",
      "authority": "authoritative",
      "version": "2026-09",
      "required": true,
      "appliesTo": ["src/**"]
    }
  ]
}
```

Run `shipcheck audit .` or `shipcheck audit . --json` to inspect loading metadata.
`diff` and `task <file>` load references whose `appliesTo` patterns match selected
paths. Repository audits consider every configured reference. An empty diff still
skips inspection. Existing task-file syntax is unchanged; inline tasks are documented
in [P11](P11_TASK_AUDITING.md).

Each resource requires a unique ID and a relative forward-slash file path. Defaults
are `kind: document`, `authority: supporting`, `required: true`, and
`appliesTo: ["**"]`. Supported kinds are `document`, `openapi`, `schema`, and
`source`; these are labels, not format-specific validators. Scope patterns follow
the existing configuration glob subset. Version and authority are user assertions;
Shipcheck does not infer compatibility or establish trust from these fields.

Optional `expectedSha256` pins the exact raw file bytes using 64 lowercase hex
characters. Reports include the actual SHA-256, bytes, lines, source path, declared
version, authority and loading status. A changed pinned file yields `hash-mismatch`.
Hashes identify content; they do not prove approval or authenticity. In-memory
snapshots preserve decoded text; reports do not contain reference bodies.

Limits and failures:

- At most 32 resources, 64 KiB per file and 256 KiB aggregate accepted reads, in
  configuration order. Sensitive or hash-mismatched reads also consume that limit.
- UTF-8 text only; binary/NUL content and invalid UTF-8 are rejected. A UTF-8 BOM
  is removed from decoded text but remains part of the raw-byte hash.
- Absolute paths, traversal, links/junctions, non-regular files, configured
  exclusions and `.git`/`.env` paths are rejected. Likely credential filenames and
  content are rejected using conservative heuristics, not a complete secret scanner.
- Missing, excluded, oversized, unreadable, sensitive or mismatched required
  resources make loading `incomplete`. The CLI returns exit code 2 and skips AI
  before spending. Deterministic results remain; explicitly authorized external
  checks still follow their normal execution policy. Optional failures stay visible.
- Readers assume a stable local tree. They do not provide a sandbox against a
  hostile process racing filesystem checks. No resource fetching or writing occurs.

The exported `loadReferenceResources` returns report metadata plus in-memory
snapshots. `verifyResourceEvidence` accepts a resource ID, snapshot SHA-256, line
range and exact complete-line excerpt, along with submitted and freshly reloaded
snapshots. It rejects unknown resources, wrong hashes, changed or unavailable
resources, and mismatched excerpts. Line endings are normalized for comparison.
Callers must reload snapshots before verification. A match establishes text
provenance only; it does not validate the diagnosis. P12 integrates this helper
into AI candidate verification for submitted reference paths.

P12 completes local reference-aware integration and conflict reporting. Remaining broader
work includes explicitly
authorized external-repository or remote snapshot sources. P9 adds semantic
contract adapters. P11 adds the inline current-task workflow.
