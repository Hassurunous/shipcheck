# P9 — OpenAPI contract index

The exported offline OpenAPI operation index underpins contract comparisons in
`audit`, `diff` and `task`. This page documents the standalone index API; see
[P14](P14_CONTRACT_CHECKS.md) and [multilingual adapters](P14_2_ADDITIONAL_LANGUAGES.md)
for consumer comparisons, and [P12](P12_REFERENCE_AUDITS.md) for AI reference use.

```js
import { loadReferenceResources, indexOpenApi } from 'shipcheck';

const loaded = await loadReferenceResources('.', {
  resources: [{ id: 'service', path: 'docs/api.json', kind: 'openapi' }]
});
const indexes = loaded.snapshots
  .filter(snapshot => snapshot.record.kind === 'openapi')
  .map(indexOpenApi);
console.log(JSON.stringify(indexes, null, 2));
```

Use the bounded P8 loader before indexing. The indexer itself is a pure function
over caller-supplied snapshots, with no filesystem/network access or writes. It
preserves the supplied resource ID/hash and records OpenAPI and API version strings
separately. It does not independently authenticate caller-supplied snapshot hashes.

Supported input is JSON with OpenAPI 3.0.x or 3.1.x metadata and direct Path Item
operations. Each indexed operation has a method, path, optional operation ID, and
an escaped JSON Pointer into that snapshot. These pointers are structural locations,
not line citations. Paths are sorted for reproducible output.

Statuses distinguish indexed, partial, unsupported, invalid, and unavailable.
`indexed` means direct operations were extracted, not that the document is valid
OpenAPI. The assessment is always `not-compared`. Duplicate operation IDs and
malformed path/operation entries produce explicit issues. Referenced Path Items are
skipped entirely; their sibling operations are not treated as resolved contracts.
No `$ref` is fetched, including local references. YAML, OpenAPI 2/3.2, webhooks,
callbacks, parameter/schema resolution and full specification validation are outside
this standalone index. An absent operation alone does not establish a hallucinated
API call: comparison also requires supported consumer extraction and complete provider coverage.

The implementation uses the Paths, Path Item and Operation definitions in the
[OpenAPI 3.1.1 specification](https://spec.openapis.org/oas/v3.1.1.html).
Tests cover direct extraction, provenance, escaped pointers, unsupported inputs,
unresolved references, duplicate identities and partial coverage.

P14 now supplies consumer call extraction, explicit service mapping, version pins,
and CLI comparisons with evidence on both sides for literal JavaScript fetch calls;
see [P14 contract checks](P14_CONTRACT_CHECKS.md). The standalone index retains its
not-compared assessment. [P16](P16_EXTERNAL_CONTRACTS.md) adds installed SDK
declarations and cross-repository contracts for its documented subset.
P9 itself introduced no dependencies or paid calls; P14 uses Acorn.
