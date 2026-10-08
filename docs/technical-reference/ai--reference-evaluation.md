# src/ai/reference-evaluation.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Reference scoring validates report/label identities and counts confirmed defects, conflicts, false positives, rejected citations and unassessed results. Passing also requires usable fresh context and a real/injected completed run. A clean control must have zero candidates and conflicts; a conflict case must not also assert code defects requiring an unresolved choice.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `892591effa90005428b9af595abe6ab9b1d9d5a6d432e2dab79ff118e8bca194`.

This chapter inventories **12 function bodies/callbacks**, **23 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>../findings.js</code>: <code>reportSchema</code>, <code>Report</code> (type only).

## Module execution

- [L4](#l4) Bind <code>referenceAssessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({caseId:z.string(),kind:z.enum(['candidate','conflict']), index:z.number().int().nonnegative(),verdict:z.enum(['confirmed','false-positive','uncertain'])}).strict()</code>.

## Function index

- [scoreReferenceEvaluation (11:8)](#fn-555)
- [cases.map callback (12:24)](#fn-664)
- [runs.map callback (12:80)](#fn-720)
- [runs.some callback (13:18)](#fn-776)
- [cases.some callback (13:35)](#fn-793)
- [runs.map callback (14:34)](#fn-916)
- [cases.map callback (23:27)](#fn-1480)
- [items.forEach callback (28:21)](#fn-1802)
- [ai.preview.files.some callback (39:33)](#fn-2394)
- [inline callback (40:39)](#fn-2481)
- [results.filter callback (49:54)](#fn-3269)
- [results.filter callback (50:30)](#fn-3325)

<a id="fn-555"></a>
### scoreReferenceEvaluation (11:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>cases:Case[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>runs:Run[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>assessments:Assessment[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L14](#l14) <code>reports</code>: construct <code>Map</code> using <code>runs.map(run=&gt;[run.caseId,reportSchema.parse(run.report)])</code>; this creates the local instance used below.
- [L15](#l15) <code>labels</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L16](#l16) <code>input</code>: receive the next iterable value from <code>assessments</code> at the start of each loop iteration.
- [L17](#l17) <code>label</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>referenceAssessmentSchema.parse(input)</code>.
- [L17](#l17) <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.kind}:${label.index}&#96;</code>.
- [L18](#l18) <code>ai</code>: read <code>reports.get(label.caseId)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
- [L19](#l19) <code>item</code>: test <code>label.kind==='candidate'</code>; choose <code>ai?.candidates[label.index]</code> when truthy, otherwise <code>ai?.referenceConflicts?.[label.index]</code>.
- [L23](#l23) <code>results</code>: transform each element into a new array: <code>cases.map(fixture=&gt;{ const ai=reports.get(fixture.id)?.ai; let confirmedCandidates=0,confirmedConflicts=0,falsePositives=0,unassessed=0,rejectedCitations=0; for(const kind of ['candidate','conflict'] as const) { const items=kind==='candidate'?ai?.candidates…</code>.

Execution:

- [L12](#l12) If <code>new Set(cases.map(item=&gt;item.id)).size!==cases.length &#124;&#124; new Set(runs.map(item=&gt;item.caseId)).size!==runs.length &#124;&#124; runs.some(run=&gt;!cases.some(item=&gt;item.id===run.caseId))</code> is truthy:
  - [L13](#l13) Throw <code>new Error('Cases and runs require unique known IDs.')</code>; normal execution stops until an enclosing catch handles it.
- [L14](#l14) Bind <code>reports</code>: construct <code>Map</code> using <code>runs.map(run=&gt;[run.caseId,reportSchema.parse(run.report)])</code>; this creates the local instance used below.
- [L15](#l15) Bind <code>labels</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L16](#l16) Iterate <code>assessments</code> values, binding <code>const input</code> for each iteration:
  - [L17](#l17) Bind <code>label</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>referenceAssessmentSchema.parse(input)</code>.
  - [L17](#l17) Bind <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.kind}:${label.index}&#96;</code>.
  - [L18](#l18) Bind <code>ai</code>: read <code>reports.get(label.caseId)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
  - [L19](#l19) Bind <code>item</code>: test <code>label.kind==='candidate'</code>; choose <code>ai?.candidates[label.index]</code> when truthy, otherwise <code>ai?.referenceConflicts?.[label.index]</code>.
  - [L20](#l20) If <code>!item &#124;&#124; labels.has(key)</code> is truthy:
    - [L20](#l20) Throw <code>new Error('Assessment must identify an existing result exactly once.')</code>; normal execution stops until an enclosing catch handles it.
  - [L21](#l21) store/replace a keyed entry in the Map: <code>labels.set(key,label)</code>.
- [L23](#l23) Bind <code>results</code>: transform each element into a new array: <code>cases.map(fixture=&gt;{ const ai=reports.get(fixture.id)?.ai; let confirmedCandidates=0,confirmedConflicts=0,falsePositives=0,unassessed=0,rejectedCitations=0; for(const kind of ['candidate','conflict'] as const) { const items=kind==='candidate'?ai?.candidates…</code>.
- [L49](#l49) Return to the caller: create an object with 4 property/spread entries: <code>{cases:results.length,passed:results.filter(item=&gt;item.passed).length, completed:results.filter(item=&gt;item.completed).length,results}</code>; later properties overwrite earlier spread values.

<a id="fn-664"></a>
### cases.map callback (12:24)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>cases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L12](#l12) Implicitly return: read <code>item.id</code>.

<a id="fn-720"></a>
### runs.map callback (12:80)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L12](#l12) Implicitly return: read <code>item.caseId</code>.

<a id="fn-776"></a>
### runs.some callback (13:18)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>runs.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>run</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: apply <code>!</code> to <code>cases.some(item=&gt;item.id===run.caseId)</code>.

<a id="fn-793"></a>
### cases.some callback (13:35)

Synchronous function. Lexically inside [runs.some callback (13:18)](#fn-776). Passed to <code>cases.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L13](#l13) Implicitly return: compute <code>item.id===run.caseId</code> with the <code>===</code> operator.

<a id="fn-916"></a>
### runs.map callback (14:34)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>run</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: create an array from <code>[run.caseId,reportSchema.parse(run.report)]</code>; spread elements insert the iterable values.

<a id="fn-1480"></a>
### cases.map callback (23:27)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>cases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>fixture</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L24](#l24) <code>ai</code>: read <code>reports.get(fixture.id)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
- [L25](#l25) <code>confirmedCandidates</code>: use the literal <code>0</code>.
- [L25](#l25) <code>confirmedConflicts</code>: use the literal <code>0</code>.
- [L25](#l25) <code>falsePositives</code>: use the literal <code>0</code>.
- [L25](#l25) <code>unassessed</code>: use the literal <code>0</code>.
- [L25](#l25) <code>rejectedCitations</code>: use the literal <code>0</code>.
- [L26](#l26) <code>kind</code>: receive the next iterable value from <code>['candidate','conflict'] as const</code> at the start of each loop iteration.
- [L27](#l27) <code>items</code>: test <code>kind==='candidate'</code>; choose <code>ai?.candidates ?? []</code> when truthy, otherwise <code>ai?.referenceConflicts ?? []</code>.
- [L37](#l37) <code>observedCandidates</code>: use <code>ai?.candidates.length</code> unless null/undefined, then evaluate <code>0</code>.
- [L37](#l37) <code>observedConflicts</code>: use <code>ai?.referenceConflicts?.length</code> unless null/undefined, then evaluate <code>0</code>.
- [L38](#l38) <code>contextUsable</code>: evaluate <code>ai &amp;&amp; !ai.preview.limited &amp;&amp; !ai.preview.files.some(file=&gt;file.freshness==='changed-or-unavailable') &amp;&amp; !ai.preview.references?.some(ref=&gt;!['included','not-applicable'].includes(ref.status) &#124;&#124; ref.freshness==='changed-or-unavailable')</code> left to right with falsy short-circuiting.
- [L41](#l41) <code>supported</code>: evaluate <code>ai?.status==='completed' &amp;&amp; ['live','injected'].includes(ai.execution) &amp;&amp; contextUsable &amp;&amp; unassessed===0 &amp;&amp; rejectedCitations===0 &amp;&amp; falsePositives===0</code> left to right with falsy short-circuiting.
- [L43](#l43) <code>passed</code>: call the named operation with the supplied arguments: <code>Boolean(supported &amp;&amp; (fixture.expected==='defect'?confirmedCandidates&gt;0 &amp;&amp; observedConflicts===0 :fixture.expected==='conflict'?confirmedConflicts&gt;0 &amp;&amp; observedCandidates===0 :observedCandidates===0 &amp;&amp; observedConflicts===0))</code>.

Execution:

- [L24](#l24) Bind <code>ai</code>: read <code>reports.get(fixture.id)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
- [L25](#l25) Bind <code>confirmedCandidates</code>: use the literal <code>0</code>.
- [L25](#l25) Bind <code>confirmedConflicts</code>: use the literal <code>0</code>.
- [L25](#l25) Bind <code>falsePositives</code>: use the literal <code>0</code>.
- [L25](#l25) Bind <code>unassessed</code>: use the literal <code>0</code>.
- [L25](#l25) Bind <code>rejectedCitations</code>: use the literal <code>0</code>.
- [L26](#l26) Iterate <code>['candidate','conflict'] as const</code> values, binding <code>const kind</code> for each iteration:
  - [L27](#l27) Bind <code>items</code>: test <code>kind==='candidate'</code>; choose <code>ai?.candidates ?? []</code> when truthy, otherwise <code>ai?.referenceConflicts ?? []</code>.
  - [L28](#l28) call the named operation with the supplied arguments: <code>items.forEach((item,index)=&gt;{ const label=labels.get(&#96;${fixture.id}:${kind}:${index}&#96;); if(item.evidenceVerification?.status!=='matched')rejectedCitations++; if(!label &#124;&#124; label.verdict==='uncertain')unassessed++; else if(label.verdict==='false-positive')fal…</code>.
- [L37](#l37) Bind <code>observedCandidates</code>: use <code>ai?.candidates.length</code> unless null/undefined, then evaluate <code>0</code>.
- [L37](#l37) Bind <code>observedConflicts</code>: use <code>ai?.referenceConflicts?.length</code> unless null/undefined, then evaluate <code>0</code>.
- [L38](#l38) Bind <code>contextUsable</code>: evaluate <code>ai &amp;&amp; !ai.preview.limited &amp;&amp; !ai.preview.files.some(file=&gt;file.freshness==='changed-or-unavailable') &amp;&amp; !ai.preview.references?.some(ref=&gt;!['included','not-applicable'].includes(ref.status) &#124;&#124; ref.freshness==='changed-or-unavailable')</code> left to right with falsy short-circuiting.
- [L41](#l41) Bind <code>supported</code>: evaluate <code>ai?.status==='completed' &amp;&amp; ['live','injected'].includes(ai.execution) &amp;&amp; contextUsable &amp;&amp; unassessed===0 &amp;&amp; rejectedCitations===0 &amp;&amp; falsePositives===0</code> left to right with falsy short-circuiting.
- [L43](#l43) Bind <code>passed</code>: call the named operation with the supplied arguments: <code>Boolean(supported &amp;&amp; (fixture.expected==='defect'?confirmedCandidates&gt;0 &amp;&amp; observedConflicts===0 :fixture.expected==='conflict'?confirmedConflicts&gt;0 &amp;&amp; observedCandidates===0 :observedCandidates===0 &amp;&amp; observedConflicts===0))</code>.
- [L46](#l46) Return to the caller: create an object with 9 property/spread entries: <code>{caseId:fixture.id,expected:fixture.expected,completed:ai?.status==='completed',passed, confirmedCandidates,confirmedConflicts,falsePositives,unassessed,rejectedCitations}</code>; later properties overwrite earlier spread values.

<a id="fn-1802"></a>
### items.forEach callback (28:21)

Synchronous function. Lexically inside [cases.map callback (23:27)](#fn-1480). Passed to <code>items.forEach</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L29](#l29) <code>label</code>: call the named operation with the supplied arguments: <code>labels.get(&#96;${fixture.id}:${kind}:${index}&#96;)</code>.

Execution:

- [L29](#l29) Bind <code>label</code>: call the named operation with the supplied arguments: <code>labels.get(&#96;${fixture.id}:${kind}:${index}&#96;)</code>.
- [L30](#l30) If <code>item.evidenceVerification?.status!=='matched'</code> is truthy:
  - [L30](#l30) increment <code>rejectedCitations</code> by one.
- [L31](#l31) If <code>!label &#124;&#124; label.verdict==='uncertain'</code> is truthy:
  - [L31](#l31) increment <code>unassessed</code> by one.
- [L31](#l31) Otherwise:
  - [L32](#l32) If <code>label.verdict==='false-positive'</code> is truthy:
    - [L32](#l32) increment <code>falsePositives</code> by one.
  - [L32](#l32) Otherwise:
    - [L33](#l33) If <code>kind==='candidate'</code> is truthy:
      - [L33](#l33) increment <code>confirmedCandidates</code> by one.
    - [L33](#l33) Otherwise:
      - [L34](#l34) increment <code>confirmedConflicts</code> by one.

<a id="fn-2394"></a>
### ai.preview.files.some callback (39:33)

Synchronous function. Lexically inside [cases.map callback (23:27)](#fn-1480). Passed to <code>ai.preview.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L39](#l39) Implicitly return: compute <code>file.freshness==='changed-or-unavailable'</code> with the <code>===</code> operator.

<a id="fn-2481"></a>
### inline callback (40:39)

Synchronous function. Lexically inside [cases.map callback (23:27)](#fn-1480). 

Parameters:

- <code>ref</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: evaluate <code>!['included','not-applicable'].includes(ref.status) &#124;&#124; ref.freshness==='changed-or-unavailable'</code> left to right with truthy short-circuiting.

<a id="fn-3269"></a>
### results.filter callback (49:54)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>results.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L49](#l49) Implicitly return: read <code>item.passed</code>.

<a id="fn-3325"></a>
### results.filter callback (50:30)

Synchronous function. Lexically inside [scoreReferenceEvaluation (11:8)](#fn-555). Passed to <code>results.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L50](#l50) Implicitly return: read <code>item.completed</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>referenceAssessmentSchema</code> | <code>caseId</code> | <code>z.string()</code> | [L4](#l4) |
| <code>referenceAssessmentSchema</code> | <code>kind</code> | <code>z.enum(['candidate','conflict'])</code> | [L4](#l4) |
| <code>referenceAssessmentSchema</code> | <code>index</code> | <code>z.number().int().nonnegative()</code> | [L5](#l5) |
| <code>referenceAssessmentSchema</code> | <code>verdict</code> | <code>z.enum(['confirmed','false-positive','uncertain'])</code> | [L5](#l5) |

## Compile-time data contracts

### Case

```typescript
type Case={id:string;expected:'defect'|'clean'|'conflict'};
```

Declared at [L6](#l6). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Run

```typescript
type Run={caseId:string;report:Report};
```

Declared at [L7](#l7). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Assessment

```typescript
type Assessment=z.infer<typeof referenceAssessmentSchema>;
```

Declared at [L8](#l8). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>referenceAssessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({caseId:z.string(),kind:z.enum(['candidate','conflict']), index:z.number().int().nonnegative(),verdict:z.enum(['confirmed','false-positive','uncertain'])}).strict()</code>.

## Directly importing tests

- [reference-evaluation.test.ts](../../test/reference-evaluation.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {z} from 'zod';
   2 | import {reportSchema,type Report} from '../findings.js';
   3 | 
   4 | export const referenceAssessmentSchema=z.object({caseId:z.string(),kind:z.enum(['candidate','conflict']),
   5 |   index:z.number().int().nonnegative(),verdict:z.enum(['confirmed','false-positive','uncertain'])}).strict();
   6 | type Case={id:string;expected:'defect'|'clean'|'conflict'};
   7 | type Run={caseId:string;report:Report};
   8 | type Assessment=z.infer<typeof referenceAssessmentSchema>;
   9 | 
  10 | /** Semantic verdicts are supplied by a reviewer, never inferred from citation matches. */
  11 | export function scoreReferenceEvaluation(cases:Case[],runs:Run[],assessments:Assessment[]) {
  12 |   if(new Set(cases.map(item=>item.id)).size!==cases.length || new Set(runs.map(item=>item.caseId)).size!==runs.length
  13 |     || runs.some(run=>!cases.some(item=>item.id===run.caseId)))throw new Error('Cases and runs require unique known IDs.');
  14 |   const reports=new Map(runs.map(run=>[run.caseId,reportSchema.parse(run.report)]));
  15 |   const labels=new Map<string,Assessment>();
  16 |   for(const input of assessments) {
  17 |     const label=referenceAssessmentSchema.parse(input);const key=`${label.caseId}:${label.kind}:${label.index}`;
  18 |     const ai=reports.get(label.caseId)?.ai;
  19 |     const item=label.kind==='candidate'?ai?.candidates[label.index]:ai?.referenceConflicts?.[label.index];
  20 |     if(!item || labels.has(key))throw new Error('Assessment must identify an existing result exactly once.');
```

<a id="l21"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     labels.set(key,label);
  22 |   }
  23 |   const results=cases.map(fixture=>{
  24 |     const ai=reports.get(fixture.id)?.ai;
  25 |     let confirmedCandidates=0,confirmedConflicts=0,falsePositives=0,unassessed=0,rejectedCitations=0;
  26 |     for(const kind of ['candidate','conflict'] as const) {
  27 |       const items=kind==='candidate'?ai?.candidates ?? []:ai?.referenceConflicts ?? [];
  28 |       items.forEach((item,index)=>{
  29 |         const label=labels.get(`${fixture.id}:${kind}:${index}`);
  30 |         if(item.evidenceVerification?.status!=='matched')rejectedCitations++;
  31 |         if(!label || label.verdict==='uncertain')unassessed++;
  32 |         else if(label.verdict==='false-positive')falsePositives++;
  33 |         else if(kind==='candidate')confirmedCandidates++;
  34 |         else confirmedConflicts++;
  35 |       });
  36 |     }
  37 |     const observedCandidates=ai?.candidates.length ?? 0,observedConflicts=ai?.referenceConflicts?.length ?? 0;
  38 |     const contextUsable=ai && !ai.preview.limited
  39 |       && !ai.preview.files.some(file=>file.freshness==='changed-or-unavailable')
  40 |       && !ai.preview.references?.some(ref=>!['included','not-applicable'].includes(ref.status) || ref.freshness==='changed-or-unavailable');
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l49"></a>
<a id="l50"></a>

```text
  41 |     const supported=ai?.status==='completed' && ['live','injected'].includes(ai.execution) && contextUsable
  42 |       && unassessed===0 && rejectedCitations===0 && falsePositives===0;
  43 |     const passed=Boolean(supported && (fixture.expected==='defect'?confirmedCandidates>0 && observedConflicts===0
  44 |       :fixture.expected==='conflict'?confirmedConflicts>0 && observedCandidates===0
  45 |       :observedCandidates===0 && observedConflicts===0));
  46 |     return {caseId:fixture.id,expected:fixture.expected,completed:ai?.status==='completed',passed,
  47 |       confirmedCandidates,confirmedConflicts,falsePositives,unassessed,rejectedCitations};
  48 |   });
  49 |   return {cases:results.length,passed:results.filter(item=>item.passed).length,
  50 |     completed:results.filter(item=>item.completed).length,results};
  51 | }
  52 | 
```
