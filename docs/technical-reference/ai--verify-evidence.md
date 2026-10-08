# src/ai/verify-evidence.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

verifyEvidence checks every citation against both the submitted and fresh context. Sources must have identical whole-file content before line slicing; references delegate to the stronger resource identity check. It normalizes newline representations only for excerpt comparison and requires at least one citation with every check matched. This verifies text provenance, not the candidate's reasoning.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `9a5e54522baa34a364efdaf54ebee960a41061aaed2ba54724ce7ef0925db88c`.

This chapter inventories **7 function bodies/callbacks**, **8 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./context.js</code>: <code>AiContext</code> (type only).
- <code>./contracts.js</code>: <code>QaOutput</code> (type only).
- <code>../reference-resources.js</code>: <code>verifyResourceEvidence</code>.

## Module execution

- [L7](#l7) Bind <code>lines</code>: create [lines (7:15)](#fn-357); its body runs when called, not when this value is created.

## Function index

- [lines (7:15)](#fn-357)
- [verifyEvidence (10:8)](#fn-496)
- [candidate.evidence.map callback (12:58)](#fn-705)
- [inline callback (13:48)](#fn-765)
- [submitted.files.find callback (19:43)](#fn-1174)
- [current.files.find callback (20:38)](#fn-1245)
- [checks.every callback (33:52)](#fn-2103)

<a id="fn-357"></a>
### lines (7:15)

Synchronous function. Defined in module scope. 

Parameters:

- <code>value:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L7](#l7) Implicitly return: divide the string using the delimiter or regular expression: <code>value.split(/\r\n&#124;\n&#124;\r/)</code>.

<a id="fn-496"></a>
### verifyEvidence (10:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>candidate: Pick&lt;QaOutput['candidates'][number],'evidence'&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>submitted: AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>current: AiContext</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>checks: EvidenceCheck[]</code>: transform each element into a new array: <code>candidate.evidence.map(evidence=&gt; { const reference=submitted.references?.find(item=&gt;item.record.path===evidence.path); if(reference) { const check=verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!, startLine:evi…</code>.

Execution:

- [L12](#l12) Bind <code>checks: EvidenceCheck[]</code>: transform each element into a new array: <code>candidate.evidence.map(evidence=&gt; { const reference=submitted.references?.find(item=&gt;item.record.path===evidence.path); if(reference) { const check=verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!, startLine:evi…</code>.
- [L33](#l33) Return to the caller: create an object with 2 property/spread entries: <code>{status:checks.length &gt; 0 &amp;&amp; checks.every(check=&gt;check.status==='matched')?'matched':'rejected',checks}</code>; later properties overwrite earlier spread values.

<a id="fn-705"></a>
### candidate.evidence.map callback (12:58)

Synchronous function. Lexically inside [verifyEvidence (10:8)](#fn-496). Passed to <code>candidate.evidence.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>evidence</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>reference</code>: return the first matching element, or undefined: <code>submitted.references?.find(item=&gt;item.record.path===evidence.path)</code>.
- [L15](#l15) <code>check</code>: call the named operation with the supplied arguments: <code>verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!, startLine:evidence.startLine,endLine:evidence.endLine,excerpt:evidence.excerpt},submitted.references ?? [],current.references ?? [])</code>.
- [L19](#l19) <code>original</code>: return the first matching element, or undefined: <code>submitted.files.find(file=&gt;file.path===evidence.path)</code>.
- [L20](#l20) <code>fresh</code>: return the first matching element, or undefined: <code>current.files.find(file=&gt;file.path===evidence.path)</code>.
- [L21](#l21) <code>reason</code>: use the literal <code>'exact-line-match'</code>.
- [L26](#l26) <code>sourceLines</code>: call the named operation with the supplied arguments: <code>lines(fresh.content)</code>.

Execution:

- [L13](#l13) Bind <code>reference</code>: return the first matching element, or undefined: <code>submitted.references?.find(item=&gt;item.record.path===evidence.path)</code>.
- [L14](#l14) If <code>reference</code> is truthy:
  - [L15](#l15) Bind <code>check</code>: call the named operation with the supplied arguments: <code>verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!, startLine:evidence.startLine,endLine:evidence.endLine,excerpt:evidence.excerpt},submitted.references ?? [],current.references ?? [])</code>.
  - [L17](#l17) Return to the caller: create an object with 2 property/spread entries: <code>{path:evidence.path,...check}</code>; later properties overwrite earlier spread values.
- [L19](#l19) Bind <code>original</code>: return the first matching element, or undefined: <code>submitted.files.find(file=&gt;file.path===evidence.path)</code>.
- [L20](#l20) Bind <code>fresh</code>: return the first matching element, or undefined: <code>current.files.find(file=&gt;file.path===evidence.path)</code>.
- [L21](#l21) Bind <code>reason</code>: use the literal <code>'exact-line-match'</code>.
- [L22](#l22) If <code>!original</code> is truthy:
  - [L22](#l22) update <code>reason</code> with <code>'not-in-submitted-context'</code> using <code>=</code>; this mutation is visible to later statements.
- [L22](#l22) Otherwise:
  - [L23](#l23) If <code>!fresh</code> is truthy:
    - [L23](#l23) update <code>reason</code> with <code>'file-unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L23](#l23) Otherwise:
    - [L24](#l24) If <code>fresh.content !== original.content</code> is truthy:
      - [L24](#l24) update <code>reason</code> with <code>'source-changed'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L24](#l24) Otherwise:
      - [L26](#l26) Bind <code>sourceLines</code>: call the named operation with the supplied arguments: <code>lines(fresh.content)</code>.
      - [L27](#l27) If <code>!Number.isInteger(evidence.startLine) &#124;&#124; !Number.isInteger(evidence.endLine) &#124;&#124; evidence.startLine &lt; 1 &#124;&#124; evidence.endLine &lt; evidence.startLine &#124;&#124; evidence.endLine &gt; sourceLines.length</code> is truthy:
        - [L28](#l28) update <code>reason</code> with <code>'invalid-line-range'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L27](#l27) Otherwise:
        - [L29](#l29) If <code>sourceLines.slice(evidence.startLine-1,evidence.endLine).join('\n') !== lines(evidence.excerpt).join('\n')</code> is truthy:
          - [L29](#l29) update <code>reason</code> with <code>'excerpt-mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
- [L31](#l31) Return to the caller: create an object with 3 property/spread entries: <code>{path:evidence.path,status:reason==='exact-line-match'?'matched':'rejected',reason}</code>; later properties overwrite earlier spread values.

<a id="fn-765"></a>
### inline callback (13:48)

Synchronous function. Lexically inside [candidate.evidence.map callback (12:58)](#fn-705). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: compute <code>item.record.path===evidence.path</code> with the <code>===</code> operator.

<a id="fn-1174"></a>
### submitted.files.find callback (19:43)

Synchronous function. Lexically inside [candidate.evidence.map callback (12:58)](#fn-705). Passed to <code>submitted.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L19](#l19) Implicitly return: compute <code>file.path===evidence.path</code> with the <code>===</code> operator.

<a id="fn-1245"></a>
### current.files.find callback (20:38)

Synchronous function. Lexically inside [candidate.evidence.map callback (12:58)](#fn-705). Passed to <code>current.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L20](#l20) Implicitly return: compute <code>file.path===evidence.path</code> with the <code>===</code> operator.

<a id="fn-2103"></a>
### checks.every callback (33:52)

Synchronous function. Lexically inside [verifyEvidence (10:8)](#fn-496). Passed to <code>checks.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L33](#l33) Implicitly return: compute <code>check.status==='matched'</code> with the <code>===</code> operator.

## Compile-time data contracts

### EvidenceCheck

```typescript
type EvidenceCheck = {path:string; status:'matched' | 'rejected'; reason:string};
```

Declared at [L5](#l5). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### EvidenceVerification

```typescript
type EvidenceVerification = {status:'matched' | 'rejected'; checks:EvidenceCheck[]};
```

Declared at [L6](#l6). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L7](#l7) <code>lines</code>: create [lines (7:15)](#fn-357); its body runs when called, not when this value is created.

## Directly importing tests

- [evidence.test.ts](../../test/evidence.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
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
<a id="l17"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import type { AiContext } from './context.js';
   2 | import type { QaOutput } from './contracts.js';
   3 | import {verifyResourceEvidence} from '../reference-resources.js';
   4 | 
   5 | export type EvidenceCheck = {path:string; status:'matched' | 'rejected'; reason:string};
   6 | export type EvidenceVerification = {status:'matched' | 'rejected'; checks:EvidenceCheck[]};
   7 | const lines = (value:string) => value.split(/\r\n|\n|\r/);
   8 | 
   9 | /** Checks citations only. Matching source does not prove a candidate's diagnosis. */
  10 | export function verifyEvidence(candidate: Pick<QaOutput['candidates'][number],'evidence'>, submitted: AiContext,
  11 |   current: AiContext): EvidenceVerification {
  12 |   const checks: EvidenceCheck[] = candidate.evidence.map(evidence=> {
  13 |     const reference=submitted.references?.find(item=>item.record.path===evidence.path);
  14 |     if(reference) {
  15 |       const check=verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!,
  16 |         startLine:evidence.startLine,endLine:evidence.endLine,excerpt:evidence.excerpt},submitted.references ?? [],current.references ?? []);
  17 |       return {path:evidence.path,...check};
  18 |     }
  19 |     const original = submitted.files.find(file=>file.path===evidence.path);
  20 |     const fresh = current.files.find(file=>file.path===evidence.path);
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l31"></a>
<a id="l33"></a>

```text
  21 |     let reason = 'exact-line-match';
  22 |     if (!original) reason = 'not-in-submitted-context';
  23 |     else if (!fresh) reason = 'file-unavailable';
  24 |     else if (fresh.content !== original.content) reason = 'source-changed';
  25 |     else {
  26 |       const sourceLines = lines(fresh.content);
  27 |       if (!Number.isInteger(evidence.startLine) || !Number.isInteger(evidence.endLine)
  28 |         || evidence.startLine < 1 || evidence.endLine < evidence.startLine || evidence.endLine > sourceLines.length) reason = 'invalid-line-range';
  29 |       else if (sourceLines.slice(evidence.startLine-1,evidence.endLine).join('\n') !== lines(evidence.excerpt).join('\n')) reason = 'excerpt-mismatch';
  30 |     }
  31 |     return {path:evidence.path,status:reason==='exact-line-match'?'matched':'rejected',reason};
  32 |   });
  33 |   return {status:checks.length > 0 && checks.every(check=>check.status==='matched')?'matched':'rejected',checks};
  34 | }
  35 | 
```
