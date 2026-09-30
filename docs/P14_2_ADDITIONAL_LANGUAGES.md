# P14.2: additional offline HTTP contract adapters

Shipcheck now checks supported literal HTTP calls/request definitions in Go, C#
and Java, plus Axios, HTTPX and fresh Requests Sessions. All use the existing local
OpenAPI comparison and bounded file reads. No AI call or audited-source execution
is required. This expands specific client patterns, not complete language semantics.

Use the existing `contracts` configuration and list source paths in `files`.
Adapters are selected by extension. One binding can contain several languages.
Try `shipcheck audit fixtures/contracts-expanded --json`: eight matched observations,
exit 0. The example is also included in the npm package.

## Supported offline patterns

| Adapter ID | Files | First supported patterns |
| --- | --- | --- |
| `go-net-http` | `.go` | Imported net/http Get, Head, Post, PostForm, NewRequest, NewRequestWithContext |
| `csharp-httpclient` | `.cs` | Fresh HttpClient GetAsync/GetStringAsync/GetByteArrayAsync/GetStreamAsync, DeleteAsync, PostAsync/PutAsync/PatchAsync |
| `java-http-request` | `.java` | Complete inline HttpRequest.newBuilder(...).build() chains with literal URI and method |
| `javascript-http` | `.js`, `.mjs`, `.cjs` | Existing fetch plus default-imported Axios calls |
| `typescript-http` | `.ts`, `.mts`, `.cts`, `.tsx` | Existing typed fetch plus default-imported Axios calls |
| `python-http` | `.py` | Requests and HTTPX module calls; fresh Requests Session and HTTPX Client calls |

The JS/TS/Python adapter IDs replace `javascript-fetch`, `typescript-fetch` and
`python-requests` because each now covers multiple clients. Consumers must not
assume the old strings enumerate all supported adapters. The report schema still
accepts old string IDs. `contracts[].calls[].observationKind` distinguishes
`request-call` from `request-construction`. A Go NewRequest or Java builder describes
a proposed request; it does not establish that the request is sent. Existing reports
without that optional field remain readable.

All patterns require literal absolute URLs. The shared comparison still checks
only methods, routes and supported required scalar query-name presence. Values,
bodies, responses, auth, control flow, reachability and deployed behavior are not
validated. Hashes and source excerpts identify the snapshots examined. Unsupported
patterns, missing parsers and zero supported calls retain incomplete coverage and
exit 2. Contract mismatches return exit 1 only if no incomplete/operational condition
takes precedence. AI cannot clear these deterministic limitations.

## Go

```go
import h "net/http"
// Within a function:
h.Get("https://api.example.test/v1/users?q=alice")
h.NewRequest(h.MethodDelete, "https://api.example.test/v1/users/42", nil)
```

One ordinary or aliased net/http import is recognized. NewRequestWithContext uses
the same method/URL rules after its context argument. Known Method constants are
recognized; an empty method in NewRequest means GET. Method case is otherwise
preserved. Plain quoted strings without escapes and single-line raw strings are
supported. Bodies are not evaluated. Dot/blank imports, package alias shadowing,
custom clients, DefaultClient chains and unsupported package operations are
unresolved. Request construction may be checked even when never executed/sent.

## C#

```csharp
using System.Net.Http;
// Within a method:
using var client = new HttpClient();
await client.GetAsync("https://api.example.test/v1/users?q=alice");
```

An empty constructor can appear inline or in one uniquely named local variable;
uses must occur later in the same block. The short type needs an explicit
`using System.Net.Http;`; the full System.Net.Http.HttpClient name is also recognized.
Normal unescaped and simple verbatim string literals work. GET/DELETE helpers
accept one URL argument; POST/PUT/PATCH accept URL and content. Named arguments,
extra overload arguments, request-message SendAsync, injected/shared clients,
custom handlers, initializers, reassignment, alias escape, property mutation and
conditional compilation are unresolved. This is not a recommendation to create
a new production client per request; the example only shows the supported syntax.

## Java

```java
import java.net.URI;
import java.net.http.HttpRequest;
// Within a method:
HttpRequest.newBuilder(URI.create("https://api.example.test/v1/users?q=alice"))
    .GET().build();
```

Explicit imports or fully qualified standard names are required. The URI may be
in newBuilder or a chained `.uri(...)`, using URI.create or a one-argument URI
constructor. GET is the builder default; GET, DELETE, POST, PUT and literal
`.method("PATCH", body)` are recognized. Later supported method/URI setters win.
Header, timeout, version and expectContinue steps do not change the extracted
method/route. Split variable-backed builders, copy builders, unknown steps,
dynamic URI/method values, text blocks and Unicode escapes are unresolved. Java
Unicode escapes can change tokenization before parsing, so they invalidate this
adapter's whole-file extraction. Only complete chains ending in build are compared.

## Axios

```typescript
import api from 'axios';
api.get('https://api.example.test/v1/users', {params: {q: 'alice'}});
api.request({method: 'DELETE', url: 'https://api.example.test/v1/users/42'});
```

Supports a default ESM import (including aliases), Axios verb helpers, `axios(url,
config)` and `axios(config)`/`.request(config)`. Configuration must be an inline
object. Supported keys are url, method, params, data, headers, timeout, signal and
responseType, with literal URL/method as applicable. Params support inline scalar
properties and omit null. POST/PUT/PATCH's second argument is a body, not config;
their config is third. Axios defaults/interceptors, instance factories, CommonJS
imports, spreads, custom serialization/transports, baseURL and config URL/method
overrides on helpers are unresolved. Type-only literal wrappers are supported.
Runtime defaults set elsewhere cannot be proved absent; comparisons assume normal
unmodified library semantics.

## HTTPX and Requests Sessions

```python
import httpx
import requests

with httpx.Client() as client:
    client.get('https://api.example.test/v1/users', params={'q': 'alice'})

session = requests.Session()
session.get('https://api.example.test/v1/users', params={'q': 'alice'})
session.close()
```

Simple top-level imports/aliases are required. Fresh empty Client/Session
constructors may be inline, assigned to a unique simple name, or used in a simple
with statement. Assigned clients must be used later in the same body; with-bound
clients must be used in that with body. Explicit close is ignored for contract
extraction. Configuration, attribute mutation, reassignment, escaping aliases,
cross-body use and AsyncClient are unresolved. Only top-level Requests get supports
positional params; HTTPX and instance params must be keyword arguments.

Literal params retain Requests' omission of None values; HTTPX None values count
as present empty query values. Other literal restrictions from P14.1 remain.
`from ... import ...`, dynamic imports and nonliteral serialization are not resolved.
Library imports are assumed to mean the standard clients, not a local replacement.

## Parser and platform boundaries

Go/C#/Java use pinned ast-grep native runtime and packaged Tree-sitter grammars,
loaded lazily from Shipcheck's dependencies. Repository configuration cannot select
parser libraries. No target compiler/interpreter or client package is invoked.
Unavailable native parsers produce `offline-parser-unavailable` and incomplete
coverage; other workflows and existing JS/TS/Python parsing remain available.
Parser recovery errors invalidate extraction. Bare-CR line endings are unresolved
to preserve source coordinates; LF and CRLF are supported. No symbol/type/dependency
resolution is performed, and syntax acceptance is not proof of compilability.

Packaged grammar prebuilds include Windows x64 and selected Linux/macOS x64/ARM64
targets; this milestone validates Windows x64 only. npm installation needs its
dependencies available (registry or cache); auditing itself is offline. Installing
with `--ignore-scripts` works with the shipped Windows x64 prebuilds. Shipcheck
does not download/build parsers during audits or automatically invoke paid AI.

Existing read limits, exclusions, secret filtering and 128-call/2,048-character
excerpt limits remain. Unknown wrappers may coexist with supported calls without
being recognized; the report covers the named patterns, not every network action.

## Follow-up priority

For subsequent adapter work, prioritize
Rust reqwest literal RequestBuilder chains, Ruby Net::HTTP URI-based calls, then
PHP cURL literal URL/options. Each must preserve offline checks and include
clean/defect/unsupported fixtures, no-execution assertions, evidence and packaged
CLI checks. More complex instances, async clients, default configuration and SDK
resolution follow explicit data-flow/dependency work; they must not be silently
treated as supported. Optional bounded AI can supplement interpretation while
leaving unresolved offline coverage visible. See [P16](P16_EXTERNAL_CONTRACTS.md)
for implemented external contract and SDK checks and their limits.

References: [ast-grep JS API](https://ast-grep.github.io/guide/api-usage/js-api.html),
[Go net/http](https://pkg.go.dev/net/http),
[HttpClient](https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpclient),
[Java request builders](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpRequest.Builder.html),
[HTTPX API](https://www.python-httpx.org/api/),
[Axios API](https://axios.rest/pages/advanced/api-reference).

## Validation recorded 2026-09-28

- All 382 tests passed, including 72 added P14.2 cases; typecheck and build passed.
- The final tarball installed in isolation with `--ignore-scripts`, using the
  packaged Windows x64 native grammars without target-language compilers.
- Eighteen installed CLI scenarios passed: Go, C#, Java, Axios, HTTPX and Requests
  Sessions each returned matched/exit 0, wrong-route mismatch/exit 1 and dynamic-URL
  unresolved/exit 2. The packaged expanded example returned eight matches; help worked.
- Regression tests cover parser recovery, shadowing/aliases, client state mutation,
  import conflicts, query presence, comments/string lookalikes, source coordinates,
  extraction limits, exclusions and unchanged source bytes. Network calls are forbidden
  in fixture tests. Request construction remains distinct from execution.
- Paid API spend: $0. Non-Windows platforms and arbitrary runtime integrations are
  not established by these checks. [P18 qualification](P18_QUALIFICATION.md) is
  Windows-only; macOS/Linux still need testing.
