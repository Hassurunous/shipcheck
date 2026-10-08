# src/markdown-report.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The Markdown renderer first obtains validated console content, finds its longest backtick run, and surrounds it with a longer fence. Repository/model text therefore stays literal even if it contains Markdown or fence delimiters. Summary counts sit outside the fence, while the complete human-readable detail stays inside.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `37bd60e806955f8e2df35398aa537330ada7b88a751d567ed2858fd2e700e8c4`.

This chapter inventories **4 function bodies/callbacks**, **4 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./findings.js</code>: <code>reportSchema</code>, <code>Report</code> (type only).
- <code>./reporters.js</code>: <code>renderConsoleReport</code>.

## Module execution


## Function index

- [renderMarkdownReport (5:8)](#fn-208)
- [Array.from callback (8:68)](#fn-421)
- [inline callback (13:93)](#fn-750)
- [report.checks.filter callback (14:102)](#fn-904)

<a id="fn-208"></a>
### renderMarkdownReport (5:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input: Report</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L6](#l6) <code>report</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse(input)</code>.
- [L7](#l7) <code>content</code>: call the named operation with the supplied arguments: <code>renderConsoleReport(report)</code>.
- [L8](#l8) <code>longest</code>: call the named operation with the supplied arguments: <code>Math.max(0,...Array.from(content.matchAll(/&#96;+/g),match=&gt;match[0].length))</code>.
- [L9](#l9) <code>fence</code>: call the named operation with the supplied arguments: <code>'&#96;'.repeat(Math.max(3,longest+1))</code>.

Execution:

- [L6](#l6) Bind <code>report</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse(input)</code>.
- [L7](#l7) Bind <code>content</code>: call the named operation with the supplied arguments: <code>renderConsoleReport(report)</code>.
- [L8](#l8) Bind <code>longest</code>: call the named operation with the supplied arguments: <code>Math.max(0,...Array.from(content.matchAll(/&#96;+/g),match=&gt;match[0].length))</code>.
- [L9](#l9) Bind <code>fence</code>: call the named operation with the supplied arguments: <code>'&#96;'.repeat(Math.max(3,longest+1))</code>.
- [L10](#l10) Return to the caller: concatenate the elements with the supplied separator: <code>['# Shipcheck report','', &#96;- Deterministic findings: ${report.findings.length}&#96;, &#96;- Inspection warnings: ${report.inspectionWarnings.length}&#96;, &#96;- AI candidates: ${(report.ai?.candidates.length ?? 0)+(report.aiAudit?.batches.reduce((sum,batch)=&gt;sum+batch.can…</code>.

<a id="fn-421"></a>
### Array.from callback (8:68)

Synchronous function. Lexically inside [renderMarkdownReport (5:8)](#fn-208). Passed to <code>Array.from</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>match</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: read <code>match[0].length</code>.

<a id="fn-750"></a>
### inline callback (13:93)

Synchronous function. Lexically inside [renderMarkdownReport (5:8)](#fn-208). 

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>batch</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: compute <code>sum+batch.candidates.length</code> with the <code>+</code> operator.

<a id="fn-904"></a>
### report.checks.filter callback (14:102)

Synchronous function. Lexically inside [renderMarkdownReport (5:8)](#fn-208). Passed to <code>report.checks.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: compute <code>check.status==='passed'</code> with the <code>===</code> operator.

## Directly importing tests

- [markdown.test.ts](../../test/markdown.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>

```text
   1 | import { reportSchema, type Report } from './findings.js';
   2 | import { renderConsoleReport } from './reporters.js';
   3 | 
   4 | /** Fence all repository/model-controlled text so it cannot become Markdown markup. */
   5 | export function renderMarkdownReport(input: Report): string {
   6 |   const report = reportSchema.parse(input);
   7 |   const content = renderConsoleReport(report);
   8 |   const longest = Math.max(0,...Array.from(content.matchAll(/`+/g),match=>match[0].length));
   9 |   const fence = '`'.repeat(Math.max(3,longest+1));
  10 |   return ['# Shipcheck report','',
  11 |     `- Deterministic findings: ${report.findings.length}`,
  12 |     `- Inspection warnings: ${report.inspectionWarnings.length}`,
  13 |     `- AI candidates: ${(report.ai?.candidates.length ?? 0)+(report.aiAudit?.batches.reduce((sum,batch)=>sum+batch.candidates.length,0) ?? 0)}`,
  14 |     ...(report.checks?.length ? [`- External checks: ${report.checks.length}; ${report.checks.filter(check=>check.status==='passed').length} passed`] : []),'',
  15 |     '## Review details','',fence+'text',content,fence,'',
  16 |     'A clean report does not establish correctness. AI diagnoses remain unverified.',''].join('\n');
  17 | }
  18 | 
```
