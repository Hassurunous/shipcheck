# src/version-policy.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

versionIssue checks declared-provider disagreement first, then an exact pin, then semver validity/range membership. Exact strings can describe non-semver APIs; only a range requires a semver value. The first failing condition determines the returned explanation, while undefined means none of the requested checks failed.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `9d864d0a09d2757f7b47e15d1fc4888111dc92bef1c349f8562aae37cd6a35cb`.

This chapter inventories **2 function bodies/callbacks**, **1 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>semver</code>: <code>valid</code>, <code>validRange</code>, <code>satisfies</code>.

## Module execution

- [L3](#l3) Bind <code>versionRangeSchema</code>: call the named operation with the supplied arguments: <code>z.string().trim().min(1).max(256).refine(value=&gt;validRange(value)!==null,'Expected an npm semantic version range.')</code>.

## Function index

- [z.string().trim().min(1).max(256).refine callback (3:74)](#fn-147)
- [versionIssue (4:8)](#fn-230)

<a id="fn-147"></a>
### z.string().trim().min(1).max(256).refine callback (3:74)

Synchronous function. Defined in module scope. Passed to <code>z.string().trim().min(1).max(256).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L3](#l3) Implicitly return: compute <code>validRange(value)!==null</code> with the <code>!==</code> operator.

<a id="fn-230"></a>
### versionIssue (4:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>actual:string&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.
- <code>expected?:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>range?:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>declared?:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L5](#l5) If <code>declared!==undefined &amp;&amp; declared!==actual</code> is truthy:
  - [L5](#l5) Return to the caller: use the literal <code>'Configured reference version conflicts with provider metadata.'</code>.
- [L6](#l6) If <code>expected!==undefined &amp;&amp; expected!==actual</code> is truthy:
  - [L6](#l6) Return to the caller: use the literal <code>'Provider version does not match the exact version pin.'</code>.
- [L7](#l7) If <code>range &amp;&amp; (!actual &#124;&#124; !valid(actual))</code> is truthy:
  - [L7](#l7) Return to the caller: use the literal <code>'Provider version is not a semantic version; range compatibility is unresolved.'</code>.
- [L8](#l8) If <code>range &amp;&amp; !satisfies(actual!,range)</code> is truthy:
  - [L8](#l8) Return to the caller: use the literal <code>'Provider version does not satisfy the configured semantic version range.'</code>.

## Module bindings

- [L3](#l3) <code>versionRangeSchema</code>: call the named operation with the supplied arguments: <code>z.string().trim().min(1).max(256).refine(value=&gt;validRange(value)!==null,'Expected an npm semantic version range.')</code>.

## Directly importing tests

- [version-policy.test.ts](../../test/version-policy.test.ts)

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
<a id="l8"></a>

```text
   1 | import {z} from 'zod';
   2 | import {valid,validRange,satisfies} from 'semver';
   3 | export const versionRangeSchema=z.string().trim().min(1).max(256).refine(value=>validRange(value)!==null,'Expected an npm semantic version range.');
   4 | export function versionIssue(actual:string|undefined,expected?:string,range?:string,declared?:string):string|undefined {
   5 |   if(declared!==undefined && declared!==actual)return 'Configured reference version conflicts with provider metadata.';
   6 |   if(expected!==undefined && expected!==actual)return 'Provider version does not match the exact version pin.';
   7 |   if(range && (!actual || !valid(actual)))return 'Provider version is not a semantic version; range compatibility is unresolved.';
   8 |   if(range && !satisfies(actual!,range))return 'Provider version does not satisfy the configured semantic version range.';
   9 | }
  10 | 
```
