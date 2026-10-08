# src/cli.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The executable bridge is deliberately small. It removes Node's executable/script arguments, awaits runCli, prints only nonempty stdout/stderr strings, and assigns process.exitCode. Assigning the exit code lets Node finish pending output naturally. All command policy lives in cli-command.ts.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `32e6128c2efb4290f9001fe47881bae95c96f0cf90971fce44b31f68d3b44273`.

This chapter inventories **0 function bodies/callbacks**, **1 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./cli-command.js</code>: <code>runCli</code>.

## Module execution

- [L4](#l4) Bind <code>result</code>: wait for <code>runCli(process.argv.slice(2))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L5](#l5) If <code>result.stdout</code> is truthy:
  - [L5](#l5) call the named operation with the supplied arguments: <code>console.log(result.stdout)</code>.
- [L6](#l6) If <code>result.stderr</code> is truthy:
  - [L6](#l6) call the named operation with the supplied arguments: <code>console.error(result.stderr)</code>.
- [L7](#l7) update <code>process.exitCode</code> with <code>result.exitCode</code> using <code>=</code>; this mutation is visible to later statements.

## Function index


## Module bindings

- [L4](#l4) <code>result</code>: wait for <code>runCli(process.argv.slice(2))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>

```text
   1 | #!/usr/bin/env node
   2 | import { runCli } from "./cli-command.js";
   3 | 
   4 | const result = await runCli(process.argv.slice(2));
   5 | if (result.stdout) console.log(result.stdout);
   6 | if (result.stderr) console.error(result.stderr);
   7 | process.exitCode = result.exitCode;
   8 | 
```
