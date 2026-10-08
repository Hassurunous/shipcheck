# src/contract-adapters.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The fixed registry chooses a bundled adapter by exact extension. JS and TS share the combined fetch/Axios extractor; Python, Go, C# and Java have separate extractors. No repository-selected plugin is imported, and an unsupported extension returns undefined so the audit can disclose incomplete coverage.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `23628852015d53476cdc009469aa87b24148aca87f3416a8d69d1f2df7b96fdf`.

This chapter inventories **2 function bodies/callbacks**, **2 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>extname</code>.
- <code>./axios-calls.js</code>: <code>extractJavascriptHttpCalls</code>.
- <code>./python-calls.js</code>: <code>extractPythonCalls</code>.
- <code>./contract-adapter-types.js</code>: <code>ContractAdapter</code> (type only).
- <code>./go-http-calls.js</code>: <code>extractGoCalls</code>.
- <code>./csharp-http-calls.js</code>: <code>extractCsharpCalls</code>.
- <code>./java-http-calls.js</code>: <code>extractJavaCalls</code>.

## Module execution

- [L10](#l10) Bind <code>contractAdapters:readonly ContractAdapter[]</code>: create an array from <code>[ {id:'javascript-http',language:'javascript',extensions:['.js','.mjs','.cjs'],extract:extractJavascriptHttpCalls}, {id:'typescript-http',language:'typescript',extensions:['.ts','.mts','.cts','.tsx'],extract:extractJavascriptHttpCalls}, {id:'python-http',la…</code>; spread elements insert the iterable values.
- [L18](#l18) Bind <code>contractAdapterFor</code>: create [contractAdapterFor (18:33)](#fn-1145); its body runs when called, not when this value is created.

## Function index

- [contractAdapterFor (18:33)](#fn-1145)
- [contractAdapters.find callback (18:70)](#fn-1182)

<a id="fn-1145"></a>
### contractAdapterFor (18:33)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: return the first matching element, or undefined: <code>contractAdapters.find(adapter=&gt;adapter.extensions.includes(extname(path)))</code>.

<a id="fn-1182"></a>
### contractAdapters.find callback (18:70)

Synchronous function. Lexically inside [contractAdapterFor (18:33)](#fn-1145). Passed to <code>contractAdapters.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>adapter</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: call the named operation with the supplied arguments: <code>adapter.extensions.includes(extname(path))</code>.

## Module bindings

- [L10](#l10) <code>contractAdapters:readonly ContractAdapter[]</code>: create an array from <code>[ {id:'javascript-http',language:'javascript',extensions:['.js','.mjs','.cjs'],extract:extractJavascriptHttpCalls}, {id:'typescript-http',language:'typescript',extensions:['.ts','.mts','.cts','.tsx'],extract:extractJavascriptHttpCalls}, {id:'python-http',la…</code>; spread elements insert the iterable values.
- [L18](#l18) <code>contractAdapterFor</code>: create [contractAdapterFor (18:33)](#fn-1145); its body runs when called, not when this value is created.

## Directly importing tests

- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)
- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l18"></a>

```text
   1 | import {extname} from 'node:path';
   2 | import {extractJavascriptHttpCalls} from './axios-calls.js';
   3 | import {extractPythonCalls} from './python-calls.js';
   4 | import type {ContractAdapter} from './contract-adapter-types.js';
   5 | import {extractGoCalls} from './go-http-calls.js';
   6 | import {extractCsharpCalls} from './csharp-http-calls.js';
   7 | import {extractJavaCalls} from './java-http-calls.js';
   8 | 
   9 | /** Bundled offline adapters; no repository-supplied code or plugins are loaded. */
  10 | export const contractAdapters:readonly ContractAdapter[]=[
  11 |   {id:'javascript-http',language:'javascript',extensions:['.js','.mjs','.cjs'],extract:extractJavascriptHttpCalls},
  12 |   {id:'typescript-http',language:'typescript',extensions:['.ts','.mts','.cts','.tsx'],extract:extractJavascriptHttpCalls},
  13 |   {id:'python-http',language:'python',extensions:['.py'],extract:extractPythonCalls},
  14 |   {id:'go-net-http',language:'go',extensions:['.go'],extract:extractGoCalls},
  15 |   {id:'csharp-httpclient',language:'csharp',extensions:['.cs'],extract:extractCsharpCalls},
  16 |   {id:'java-http-request',language:'java',extensions:['.java'],extract:extractJavaCalls},
  17 | ];
  18 | export const contractAdapterFor=(path:string)=>contractAdapters.find(adapter=>adapter.extensions.includes(extname(path)));
  19 | 
```
