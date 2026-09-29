# P14: functional contract auditing

P14.1 extends this original JavaScript slice with TypeScript and Python adapters;
see [multilingual contract checks](P14_1_MULTILINGUAL_CONTRACTS.md) for current patterns
and coverage fields. Configuration examples below remain valid.

Shipcheck can compare direct JavaScript `fetch` calls with a locally configured
OpenAPI JSON document. This deterministic stage needs no AI, credentials or spending.
It reads snapshots and parses syntax; it never executes the client or sends requests.

JavaScript/TypeScript U+2028/U+2029 line separators are explicitly unsupported:
parser line numbering differs from Shipcheck's CR/LF evidence format. They produce
partial coverage without invented citations. Ordinary Unicode text remains supported.

Add these fields to `shipcheck.config.json`:

```json
{
  "resources": [{"id":"service","path":"docs/api.json","kind":"openapi"}],
  "contracts": [{
    "id":"client",
    "resourceId":"service",
    "files":["src/client.js"],
    "baseUrl":"https://api.example.test/v1",
    "expectedVersion":"1.0"
  }]
}
```

Run `shipcheck audit . --json` (or omit `--json` for readable output).
`diff` and `task` restrict comparison to mapped files in their selected scope.
Paths are explicit repository-relative files, not globs. Up to 20 bindings and
32 files per binding are supported. The reference's `appliesTo` must cover every
selected mapped file. `expectedVersion` optionally pins `info.version` exactly;
this is not semantic-version compatibility analysis. `baseUrl` is an explicit
user assertion about which service the consumer calls; contract `servers` is not
used to infer deployment URLs.

For example, `fetch('https://api.example.test/v1/users?q=alice')` is compared to
`GET /users`. Literal methods in an inline options object are supported. A missing
route, absent method, or missing required scalar query parameter name reports a
`mismatch`. Query values are not validated. Path-level parameters are inherited
and operation-level parameters override matching `(in, name)` pairs. Concrete
paths take precedence over templates; only whole-segment templates such as
`/users/{id}` are supported. Ambiguous matches are unresolved.

## Reports and automation

The JSON `contracts` array is separate from ordinary findings and AI candidates.
Each result includes provider path/hash/version, consumer paths/hashes, source
lines and excerpts, and provider JSON Pointers. These identify the snapshots used,
not a guarantee that files remain unchanged after the run. A pointer to `/paths`
supports absence in that snapshot, not proof about the deployed server.

- `checked`: all extracted calls were compared in the supported scope. Inspect
  each call for `matched` or `mismatch`; checked does not mean passed.
- `partial`: unresolved calls, calls outside the mapped service, unsupported source
  syntax/language, or unavailable source files prevented complete comparison.
- `unavailable`: missing/unsupported/incomplete contract or invalid resource mapping.
- `version-mismatch`: the configured version pin differs from the loaded document.

Exit code 1 indicates a contract mismatch (or an existing deterministic/check
failure). Exit code 2 takes precedence for any incomplete contract result or
existing operational failure. Exit code 0 does not prove integration correctness.
A file without supported calls now reports partial coverage and exit 2 (P14.1);
compare the call count and mapped files against expectations. A binding outside diff/task scope
is omitted. Console and Markdown reports include the same contract details.

## Deliberate limits

The original JavaScript adapter accepts `.js`, `.mjs` and `.cjs` files that parse as
modern JavaScript modules. Acorn ensures comments and strings are not interpreted
as calls. P14.1 adds TypeScript/TSX and Python Requests; plain JSX, SDKs and general
client resolution remain unsupported. Recognized fetch bindings/aliases conservatively disable inference for
the file. Static analysis assumes the global fetch implementation has normal
semantics; it cannot prove that another module or runtime has not replaced it.

URLs must be absolute string literals. Relative URLs depend on runtime document
location and are unresolved. Dynamic URLs/options/methods, encoded paths, option
spreads, computed options and complex path templates are unresolved. No control-flow
or reachability analysis occurs: calls in unused functions are still inspected.
Redirects, runtime header injection and URL rewriting are not modeled.

OpenAPI 3.0.x/3.1.x JSON direct operations are supported. YAML, referenced Path Items,
partial operation indexes and version mismatches block comparison. Parameter `$ref`
and unsupported required query serialization are unresolved. Required scalar query
parameters with default/form serialization support presence checks only. Bodies,
schemas/values, required headers/cookies, response handling, authentication, SDK
compatibility and deployed behavior are not assessed. This is not full OpenAPI
validation. See the [OpenAPI specification](https://spec.openapis.org/oas/v3.1.1.html).

Reads reuse the reference loader: root/link/exclusion/secret policies, 64 KiB per
file and 256 KiB total source bytes per binding, plus one bounded contract snapshot.
Extraction stops at 128 direct calls per file; source excerpts above 2,048 characters
are omitted with a partial-coverage issue. Forbidden Fetch methods and unnormalized
custom method spellings are unresolved.
No network or source writes are performed. File checks are not an atomic snapshot
or protection against a hostile process racing filesystem changes. Opt-in external
checks retain their existing execution permissions and are not sandboxed.

The tests seed incorrect routes/methods/query names, clean controls, unsupported
calls, version conflicts, scoped reads, and CLI exit/report behavior. No paid API
calls are needed to validate this milestone. P14.2 adds further offline language
and client patterns; external roots and SDK interfaces remain P16.

Validation on 2026-09-28: all 269 tests passed (18 P14 tests), typecheck and build
passed. A freshly packed tarball installed with runtime dependencies in an isolated
directory produced matched/exit 0, wrong-route mismatch/exit 1, and dynamic-call
unresolved/exit 2 through its Windows `shipcheck.cmd` executable. Help also worked.
This verifies the supported fixture workflow, not arbitrary integrations or runtime
behavior. API spend for P14 validation: $0.
