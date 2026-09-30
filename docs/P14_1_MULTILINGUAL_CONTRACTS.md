# P14.1: offline multilingual contract adapters

This page describes the P14.1 baseline. [P14.2](P14_2_ADDITIONAL_LANGUAGES.md)
extends it with Go/C#/Java, Axios, HTTPX and fresh sessions; it also renames the
JS/TS/Python adapter IDs to javascript-http, typescript-http and python-http.
Use that page for the current support matrix and expanded client patterns.

Contract auditing now supports JavaScript, TypeScript and Python through bundled
syntax adapters. Existing `contracts` configuration is unchanged: list the consumer
files and Shipcheck selects an adapter by extension. Multiple languages can share
one service mapping. No Python installation, compiler execution, Requests installation,
AI credentials or network connection is needed to analyze the supported patterns.

```json
{
  "resources": [{"id":"service","path":"docs/api.json","kind":"openapi"}],
  "contracts": [{
    "id":"consumers",
    "resourceId":"service",
    "files":["web/client.ts","jobs/client.py"],
    "baseUrl":"https://api.example.test/v1",
    "expectedVersion":"1.0"
  }]
}
```

Run `shipcheck audit . --json`. The same comparison operates in `diff` and `task`
for selected mapped paths. Existing reference scope, hash, secret, exclusion, link
and read-size protections still apply. Shipcheck does not execute client code,
import repository modules, modify code or resolve/install client dependencies.

Try the included example with `shipcheck audit fixtures/contracts --json` from
the repository. Expected: three matched calls across TypeScript and Python, exit 0.
The same example is included in the packed npm artifact.

## Supported client patterns

| Adapter | Files | Offline extraction |
| --- | --- | --- |
| `javascript-fetch` | `.js`, `.mjs`, `.cjs` | Existing direct literal `fetch` calls |
| `typescript-fetch` | `.ts`, `.mts`, `.cts`, `.tsx` | Direct literal `fetch`, with type annotations and TSX syntax |
| `python-requests` | `.py` | Module-level Requests verb calls and `request(method, url)` following a simple top-level `import requests` or `import requests as alias` |

TypeScript example:

```typescript
const response: Promise<Response> = fetch(
  'https://api.example.test/v1/users?q=alice' as const,
  {method: 'GET' as const} satisfies RequestInit
);
```

Type-only wrappers around literal URLs, option objects and methods can be unwrapped.
No typechecking, constant propagation, import resolution or runtime evaluation is
performed. Imported/shadowed/aliased fetch bindings remain unresolved. Annotations
do not make variable URLs static. Invalid/unsupported syntax is not interpreted as
an empty clean file. The Babel parser supplies TypeScript/TSX syntax; Acorn retains
the existing JavaScript path. Neither parser executes code.

Python example:

```python
import requests as http

http.get('https://api.example.test/v1/users', params={'q': 'alice'}, timeout=5)
http.request(method='DELETE', url='https://api.example.test/v1/users/42')
```

Supported verbs are get, post, put, patch, delete, head and options. The URL may be
the first positional argument or `url=`; `request` also accepts literal positional
or keyword `method`. `get` permits a second positional `params` dictionary. Other
positional body arguments are conservatively unresolved; use keyword body arguments
for this supported pattern. Bodies themselves are not assessed.

Simple literal `params` dictionaries contribute query names alongside names in
the URL. String, boolean and ordinary nonnegative decimal numeric values count
as present; `None` is omitted, including when it overwrites an earlier dictionary
key. Dynamic values, dictionary spreads, lists/tuples, parameter variables and
unknown serialization are unresolved. No query values or schemas are validated.

Python strings must be single- or double-quoted literals without escapes, prefixes
or newlines. F-strings, concatenation, triple-quoted strings and dynamic URLs remain
unresolved. Whitespace/backslashes in URL values are unresolved to avoid silently
applying browser normalization to Requests. Lezer parses syntax in Node; Python
is never launched. Parser recovery errors invalidate extraction from that file.

Requests Sessions, `from requests import ...`, conditional/local imports, binding
reassignments, function aliases, star arguments and duplicate arguments are not
resolved. Recognized namespace mutation and shadowing prevent binding inference.
Known imports of HTTPX, aiohttp, urllib or http are disclosed as unsupported client
coverage. Unknown wrappers/clients cannot be exhaustively identified. The adapter
assumes imports refer to standard Requests with normal semantics; local modules,
runtime monkey-patching, custom auth handlers and dependency versions are not proven.

## Coverage and agent behavior

`contracts[].scope` is now `literal-http-calls-only`. Report parsing still accepts
the earlier `literal-javascript-fetch-only` value. Each consumer file includes an
adapter, language and extracted call count when available. Calls identify their
adapter; Python calls may also include `queryNames` from literal `params`. This is
additive report metadata, not a guarantee of exhaustive source coverage.

Unsupported languages have file status `unsupported-language`. A mapped file with
zero extracted supported calls has `no-supported-calls`, including a file using
an unknown client. Both make the contract result partial and return exit 2. This
intentionally replaces P14's zero-call success behavior: agents must inspect coverage,
not interpret silence as a passed contract check. Mismatches return exit 1 only
when there is no higher-priority incomplete/operational failure. All mismatches are
retained in partial reports. Matches still check only methods, routes and required
scalar query-name presence against a snapshot, not complete integration correctness.

The shared `ContractAdapter` interface returns syntax-only `CallObservation` records
and explicit extraction issues. The registry selects bundled adapters by extension;
configuration cannot load arbitrary adapter code. Future adapters reuse the same
OpenAPI comparison, reporting and read boundaries. Adding an adapter requires defect
fixtures, clean controls, unsupported-pattern cases and packaged CLI validation.

## Optional AI and near-term expansion

Existing reference-aware AI review can supplement these checks for supported source
context, including Python/TypeScript and other eligible languages. Start with
`shipcheck audit . --ai preview --json` to inspect selected context. Live review
still requires explicit `--ai live --budget <name>` and an initialized allowance.
Source/reference limits and exclusions may omit relevant context. AI interpretations
remain separate candidates; they neither clear unresolved deterministic coverage
nor establish a deterministic contract match. P14.1 introduces no automatic paid
fallback and requires no paid validation.

P14.2 has delivered Go `net/http`, C# `HttpClient`, Java request builders and
Python HTTPX/Session and JS/TS Axios patterns with explicit limits. Rust reqwest,
Ruby Net::HTTP and PHP cURL are prioritized for subsequent adapter work.
Offline extraction is preferred; AI may supplement complex cases without replacing
existing offline checks. [P16](P16_EXTERNAL_CONTRACTS.md) documents external roots
and narrow installed SDK declaration checks, not general SDK resolution.

Implementation references: [Babel parser](https://babeljs.io/docs/babel-parser),
[Lezer Python grammar](https://github.com/lezer-parser/python), and
[Requests interface](https://requests.readthedocs.io/en/latest/api/).

## Validation

On 2026-09-28, all 310 tests passed, including 41 multilingual-adapter tests;
typecheck and the package build passed. A fresh tarball installation successfully
ran six Windows CLI cases: TypeScript and Python each produced clean/exit 0,
wrong-route/exit 1 and dynamic-URL/exit 2 outcomes with the expected adapter metadata.
The packaged mixed-language example produced three matched calls, and help worked.
Tests also cover method/query defects, alias/shadowing hazards, malformed syntax,
comments/strings, extraction bounds, excluded/scoped files, unsupported clients,
zero-call coverage, and optional AI preview without source changes or network calls.
No paid API calls were made. This validates the documented syntax patterns, not
arbitrary clients, installed dependency identity or runtime integration behavior.
