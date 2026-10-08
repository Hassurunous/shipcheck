# src/sensitive-content.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

These two regular expressions are conservative filters, not a complete secret detector. sensitiveName matches credential-like filename segments; sensitiveContent matches private-key headers, selected credential prefixes and quoted assignments with credential-like keys. The same expressions are reused at source/reference/task context boundaries.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `e812c14f4b2965a99e6e9a9b36e91f8c545f41e8e85f02333cfbfc19ea517617`.

This chapter inventories **0 function bodies/callbacks**, **2 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators


## Module execution

- [L2](#l2) Bind <code>sensitiveName</code>: use the literal <code>/(?:^&#124;[._-])(?:secrets?&#124;credentials?&#124;tokens?&#124;passwords?&#124;private&#124;keys?)(?:[._-]&#124;$)/i</code>.
- [L3](#l3) Bind <code>sensitiveContent</code>: use the literal <code>/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----&#124;\bsk-[A-Za-z0-9_-]{16,}&#124;\bAKIA[A-Z0-9]{16}\b&#124;(?:api[_-]?key&#124;password&#124;secret&#124;token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i</code>.

## Function index


## Module bindings

- [L2](#l2) <code>sensitiveName</code>: use the literal <code>/(?:^&#124;[._-])(?:secrets?&#124;credentials?&#124;tokens?&#124;passwords?&#124;private&#124;keys?)(?:[._-]&#124;$)/i</code>.
- [L3](#l3) <code>sensitiveContent</code>: use the literal <code>/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----&#124;\bsk-[A-Za-z0-9_-]{16,}&#124;\bAKIA[A-Z0-9]{16}\b&#124;(?:api[_-]?key&#124;password&#124;secret&#124;token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>

```text
   1 | /** Conservative heuristics, not a guarantee that all secrets are detected. */
   2 | export const sensitiveName=/(?:^|[._-])(?:secrets?|credentials?|tokens?|passwords?|private|keys?)(?:[._-]|$)/i;
   3 | export const sensitiveContent=/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\bsk-[A-Za-z0-9_-]{16,}|\bAKIA[A-Z0-9]{16}\b|(?:api[_-]?key|password|secret|token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i;
   4 | 
```
