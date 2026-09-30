# P16: external contracts and SDK declarations

P16 extends references to explicitly authorized secondary repositories and pinned
HTTPS snapshots, and adds offline checks of direct named SDK function calls.
Shipcheck never installs or executes an SDK, runs a consumer request, or edits
source or expectations. These checks establish only the documented comparisons.

## Secondary repositories

Configuration declares a logical root; the caller separately grants its location:

```json
{
  "resources": [{"id":"api","rootId":"provider","path":"api.json","kind":"openapi"}],
  "contracts": [{"id":"service","resourceId":"api","files":["client.ts"],
    "baseUrl":"https://api.example.test","versionRange":"^1.0.0"}],
  "sdkContracts": [{"id":"sdk","package":"example-sdk","rootId":"provider",
    "packageRoot":".","files":["client.ts"],"versionRange":"^1.0.0"}]
}
```

From the Shipcheck checkout, this packaged example works without AI or network:

```powershell
shipcheck audit fixtures/integrations/consumer --reference-root provider=fixtures/integrations/provider --json
```

Expected: one matched HTTP call, one matched SDK call, exit 0. Without the grant,
the example exits 2. Root paths resolve relative to the invoking working directory.
Repeat `--reference-root id=path` for up to 16 roots. Config cannot grant access.
Local paths remain relative, links are rejected, and configured exclusions and
reference text/size/sensitive-file safeguards also apply to external roots.

External citations use `@references/<resource-id>/<path>`. Reports retain the
relative provider path, root ID, content SHA-256, and a hash of the canonical
root path. Absolute provider paths are not included in reference metadata.
Changing the root identity invalidates refreshed AI citations even for equal bytes.

## Controlled HTTPS snapshots

Use a resource `url` instead of `rootId`, retaining a descriptive relative `path`.
An `expectedSha256` of the raw response bytes is mandatory; obtain it through a
trusted process before configuring the resource. For example:

```json
{"resources":[{"id":"remote-api","path":"api.json","kind":"openapi",
  "url":"https://docs.example.com/api.json",
  "expectedSha256":"REPLACE_WITH_64_LOWERCASE_HEX_CHARACTERS"}]}
```

Replace the illustrative URL and hash marker before use; the marker is intentionally
not a valid hash. Authorize separately with
`--allow-reference-origin https://docs.example.com` for that example origin.
The grant must be the exact normalized origin, with no trailing slash or path.
Up to 16 origins are supported. Each configured URL is HTTPS with no credentials,
query or fragment. Literal IP hosts, private/reserved DNS results, redirects,
compressed responses and non-200 responses are rejected. DNS is checked and the
connection is pinned to an accepted public address. There are no credentials,
cookies, proxy settings or retries. The DNS-plus-response deadline is 10 seconds.

Snapshots are held in memory, not saved into the audited repository. Reference
loads retain the existing 64 KiB per-file and 256 KiB successful-read limits, with
at most 32 configured resources per load. These are per-load limits, not a single
global audit transfer allowance. Workflow stages, AI batches and freshness checks
may fetch a reference again. An explicit origin grant permits these GETs even in
preview/mock or otherwise AI-offline runs; no model request is implied.

## Installed TypeScript SDKs

```json
{"sdkContracts":[{"id":"client-sdk","package":"example-sdk",
  "files":["src/client.ts"],"versionRange":"^1.0.0"}]}
```

The default package root is `node_modules/<package>`. Unlike general repository
inspection, this explicit mapping reads the package manifest and declaration entry.
Use `packageRoot` for another relative directory and `rootId` for an authorized
external root. `package.json` must identify the configured package and its version.
Its `types` or `typings` selects a `.d.ts`, `.d.mts` or `.d.cts` file. Conditional
`exports` or `typesVersions` requires an explicit `declarationFile` relative to the
package root. That mapping is the user's assertion of the intended declaration;
Shipcheck does not implement TypeScript's module resolver.

Supported consumers are JS/TS/TSX files with direct named imports (including
aliases) and direct function calls. Supported declarations are exported declared
functions with string, number or boolean parameters, trailing optional parameters
and overloads. Checks cover symbol presence, argument count and literal primitive
argument types. Manifest, declaration and consumer hashes accompany the evidence.

Dynamic values, spread arguments, ambiguous/shadowed bindings, namespace/default
imports, generic/complex declarations and re-exports are unresolved or partial.
There is no general type inference, class/member analysis, return-value check,
transitive declaration resolution or runtime behavior proof. Limits include 20
SDK mappings, 32 consumer files per mapping, 256 declarations, 16 overloads per
symbol and 128 calls per consumer. Other languages retain their existing HTTP
contract adapters; SDK declaration analysis is specifically JS/TS.

## Versions, reports and limitations

`expectedVersion` remains an exact string pin. Optional `versionRange` uses
[npm semver](https://github.com/npm/node-semver) range semantics, including its
prerelease rules. The pinned semver dependency avoids maintaining a custom range
parser. A range does not prove behavioral compatibility. An OpenAPI resource's
configured `version` conflicting with `info.version` is reported explicitly.

JSON adds `sdkContracts` separately from findings and existing HTTP `contracts`.
Console and Markdown expose provider evidence and limitations. A supported
mismatch exits 1; unavailable, partial or version-mismatched contracts exit 2,
which takes precedence over observed mismatches. A completed clean comparison
exits 0 unless another report stage fails. Reference load failures retain their
existing required/optional handling. No calls is incomplete coverage, not a pass.

Library callers pass `referenceAccess: {roots: {provider: path}, origins: [...]}`
to workflow/AI options; reference and contract loading APIs also accept explicit
access arguments. These grants are runtime inputs, not configuration fields.

Use a stable tree. Reads are bounded sequential snapshots, not an atomic
cross-repository transaction or protection against malicious concurrent path
replacement. AI freshness checks verify cited bytes and origins; matching citations
still do not prove a diagnosis. No automatic paid fallback is introduced.

## Verification

`npm run verify` checks types, regression tests, build and CLI acceptance. The
acceptance suite includes denied/authorized external roots, clean/incorrect SDK
calls, dynamic arguments, version mismatch, and HTTPS permission/configuration
failures. Transport tests mock DNS and HTTPS to exercise public-address filtering,
connection pinning, rejection, byte limits and deadlines without network access.
They do not establish compatibility with every live HTTPS server. Package tests
exercise the installed Windows launcher and bundled consumer/provider fixture.
[P18 qualification](P18_QUALIFICATION.md) records adversarial checks and Windows
validation. macOS/Linux qualification remains outstanding.
