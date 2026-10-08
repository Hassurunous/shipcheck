# src/review-repository.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

This small composition function either loads root configuration or validates the supplied configuration, passes its ignore options to inspection, then passes the captured profile and same config to createReport. It does not run checks, contracts, tasks, or AI; runWorkflow is the broader composition API.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `eb47f5dd81e18f664d4412979db3edf48bfa966b09dea4be2da012a2bbd1be6d`.

This chapter inventories **1 function bodies/callbacks**, **1 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>resolve</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>loadConfig</code>, <code>ConfigInput</code> (type only).
- <code>./inspect-repository.js</code>: <code>inspectRepository</code>.
- <code>./findings.js</code>: <code>createReport</code>.

## Module execution


## Function index

- [reviewRepository (7:8)](#fn-307)

<a id="fn-307"></a>
### reviewRepository (7:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target = "."</code>: when omitted/undefined, initialize with <code>"."</code>.
- <code>options?: ConfigInput</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L8](#l8) <code>config</code>: test <code>options === undefined</code>; choose <code>await loadConfig(resolve(target))</code> when truthy, otherwise <code>configSchema.parse(options)</code>.

Execution:

- [L8](#l8) Bind <code>config</code>: test <code>options === undefined</code>; choose <code>await loadConfig(resolve(target))</code> when truthy, otherwise <code>configSchema.parse(options)</code>.
- [L9](#l9) Return to the caller: call the named operation with the supplied arguments: <code>createReport(await inspectRepository(target, { respectGitignore:config.respectGitignore,exclude: config.exclude }), config)</code>.

## Directly importing tests

- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
- [workflows.test.ts](../../test/workflows.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>

```text
   1 | import { resolve } from "node:path";
   2 | import { configSchema, loadConfig, type ConfigInput } from "./config.js";
   3 | import { inspectRepository } from "./inspect-repository.js";
   4 | import { createReport } from "./findings.js";
   5 | 
   6 | /** Load root configuration, inspect locally, and evaluate the enabled rules. */
   7 | export async function reviewRepository(target = ".", options?: ConfigInput) {
   8 |   const config = options === undefined ? await loadConfig(resolve(target)) : configSchema.parse(options);
   9 |   return createReport(await inspectRepository(target, { respectGitignore:config.respectGitignore,exclude: config.exclude }), config);
  10 | }
  11 | 
```
