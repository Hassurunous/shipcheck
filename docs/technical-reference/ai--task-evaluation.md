# src/ai/task-evaluation.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Task scoring compares each expected criterion status with a report and an explicit reviewer acceptance label. Evidence-bearing claims must have matched citations; substantive claims cannot pass with no evidence. A case additionally requires a completed stage, unchanged task identity and exactly the expected assessment set. Agreement with expected status alone is insufficient.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `6cd71dfe9dab074126d13ab572b6e095e37378ff945fb0734ed47dca701c8ad4`.

This chapter inventories **13 function bodies/callbacks**, **10 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>../findings.js</code>: <code>reportSchema</code>, <code>Report</code> (type only).
- <code>./contracts.js</code>: <code>AiResult</code> (type only).

## Module execution


## Function index

- [scoreTaskEvaluation (7:8)](#fn-424)
- [cases.map callback (8:24)](#fn-544)
- [runs.map callback (8:80)](#fn-600)
- [runs.some callback (9:18)](#fn-656)
- [cases.some callback (9:35)](#fn-673)
- [runs.map callback (10:34)](#fn-798)
- [inline callback (14:128)](#fn-1109)
- [cases.map callback (18:27)](#fn-1329)
- [Object.entries(fixture.expected).map callback (20:57)](#fn-1466)
- [inline callback (21:49)](#fn-1533)
- [review.assessments.map callback (27:41)](#fn-2184)
- [criteria.every callback (27:109)](#fn-2252)
- [results.filter callback (29:52)](#fn-2330)

<a id="fn-424"></a>
### scoreTaskEvaluation (7:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>cases:Case[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>runs:{caseId:string;report:Report}[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>labels:Label[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L10](#l10) <code>reports</code>: construct <code>Map</code> using <code>runs.map(run=&gt;[run.caseId,reportSchema.parse(run.report)])</code>; this creates the local instance used below.
- [L11](#l11) <code>decisions</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L12](#l12) <code>label</code>: receive the next iterable value from <code>labels</code> at the start of each loop iteration.
- [L13](#l13) <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.requirementId}&#96;</code>.
- [L18](#l18) <code>results</code>: transform each element into a new array: <code>cases.map(fixture=&gt;{ const ai=reports.get(fixture.id)?.ai;const review=ai?.taskReview; const criteria=Object.entries(fixture.expected).map(([id,expected])=&gt;{ const assessment=review?.assessments.find(item=&gt;item.requirementId===id); const verified=assessment…</code>.

Execution:

- [L8](#l8) If <code>new Set(cases.map(item=&gt;item.id)).size!==cases.length &#124;&#124; new Set(runs.map(item=&gt;item.caseId)).size!==runs.length &#124;&#124; runs.some(run=&gt;!cases.some(item=&gt;item.id===run.caseId))</code> is truthy:
  - [L9](#l9) Throw <code>new Error('Cases and runs must have unique known IDs.')</code>; normal execution stops until an enclosing catch handles it.
- [L10](#l10) Bind <code>reports</code>: construct <code>Map</code> using <code>runs.map(run=&gt;[run.caseId,reportSchema.parse(run.report)])</code>; this creates the local instance used below.
- [L11](#l11) Bind <code>decisions</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L12](#l12) Iterate <code>labels</code> values, binding <code>const label</code> for each iteration:
  - [L13](#l13) Bind <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.requirementId}&#96;</code>.
  - [L14](#l14) If <code>typeof label.accepted!=='boolean' &#124;&#124; decisions.has(key) &#124;&#124; !reports.get(label.caseId)?.ai?.taskReview?.assessments.some(item=&gt;item.requirementId===label.requirementId)</code> is truthy:
    - [L15](#l15) Throw <code>new Error('Labels require an existing criterion, a boolean decision and no duplicates.')</code>; normal execution stops until an enclosing catch handles it.
  - [L16](#l16) store/replace a keyed entry in the Map: <code>decisions.set(key,label.accepted)</code>.
- [L18](#l18) Bind <code>results</code>: transform each element into a new array: <code>cases.map(fixture=&gt;{ const ai=reports.get(fixture.id)?.ai;const review=ai?.taskReview; const criteria=Object.entries(fixture.expected).map(([id,expected])=&gt;{ const assessment=review?.assessments.find(item=&gt;item.requirementId===id); const verified=assessment…</code>.
- [L29](#l29) Return to the caller: create an object with 3 property/spread entries: <code>{cases:cases.length,passed:results.filter(item=&gt;item.passed).length,results}</code>; later properties overwrite earlier spread values.

<a id="fn-544"></a>
### cases.map callback (8:24)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>cases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: read <code>item.id</code>.

<a id="fn-600"></a>
### runs.map callback (8:80)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: read <code>item.caseId</code>.

<a id="fn-656"></a>
### runs.some callback (9:18)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>runs.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>run</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: apply <code>!</code> to <code>cases.some(item=&gt;item.id===run.caseId)</code>.

<a id="fn-673"></a>
### cases.some callback (9:35)

Synchronous function. Lexically inside [runs.some callback (9:18)](#fn-656). Passed to <code>cases.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: compute <code>item.id===run.caseId</code> with the <code>===</code> operator.

<a id="fn-798"></a>
### runs.map callback (10:34)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>run</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L10](#l10) Implicitly return: create an array from <code>[run.caseId,reportSchema.parse(run.report)]</code>; spread elements insert the iterable values.

<a id="fn-1109"></a>
### inline callback (14:128)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: compute <code>item.requirementId===label.requirementId</code> with the <code>===</code> operator.

<a id="fn-1329"></a>
### cases.map callback (18:27)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>cases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>fixture</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L19](#l19) <code>ai</code>: read <code>reports.get(fixture.id)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
- [L19](#l19) <code>review</code>: read <code>ai?.taskReview</code>; optional access returns undefined when its receiver is null/undefined.
- [L20](#l20) <code>criteria</code>: transform each element into a new array: <code>Object.entries(fixture.expected).map(([id,expected])=&gt;{ const assessment=review?.assessments.find(item=&gt;item.requirementId===id); const verified=assessment &amp;&amp; (assessment.evidence.length&gt;0?assessment.evidenceVerification?.status==='matched':!['supporting-ev…</code>.

Execution:

- [L19](#l19) Bind <code>ai</code>: read <code>reports.get(fixture.id)?.ai</code>; optional access returns undefined when its receiver is null/undefined.
- [L19](#l19) Bind <code>review</code>: read <code>ai?.taskReview</code>; optional access returns undefined when its receiver is null/undefined.
- [L20](#l20) Bind <code>criteria</code>: transform each element into a new array: <code>Object.entries(fixture.expected).map(([id,expected])=&gt;{ const assessment=review?.assessments.find(item=&gt;item.requirementId===id); const verified=assessment &amp;&amp; (assessment.evidence.length&gt;0?assessment.evidenceVerification?.status==='matched':!['supporting-ev…</code>.
- [L25](#l25) Return to the caller: create an object with 3 property/spread entries: <code>{caseId:fixture.id,criteria,passed:ai?.status==='completed' &amp;&amp; review?.freshness==='unchanged' &amp;&amp; ['assessed','partial'].includes(review.state) &amp;&amp; review.assessments.length===criteria.length &amp;&amp; new Set(review.assessments.map(item=&gt;item.requirementId)).size=…</code>; later properties overwrite earlier spread values.

<a id="fn-1466"></a>
### Object.entries(fixture.expected).map callback (20:57)

Synchronous function. Lexically inside [cases.map callback (18:27)](#fn-1329). Passed to <code>Object.entries(fixture.expected).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>[id,expected]</code>: destructure the supplied value into these local bindings.

Local bindings (nested callback locals are documented with that callback):

- [L21](#l21) <code>assessment</code>: return the first matching element, or undefined: <code>review?.assessments.find(item=&gt;item.requirementId===id)</code>.
- [L22](#l22) <code>verified</code>: evaluate <code>assessment &amp;&amp; (assessment.evidence.length&gt;0?assessment.evidenceVerification?.status==='matched':!['supporting-evidence','potential-violation'].includes(assessment.status))</code> left to right with falsy short-circuiting.

Execution:

- [L21](#l21) Bind <code>assessment</code>: return the first matching element, or undefined: <code>review?.assessments.find(item=&gt;item.requirementId===id)</code>.
- [L22](#l22) Bind <code>verified</code>: evaluate <code>assessment &amp;&amp; (assessment.evidence.length&gt;0?assessment.evidenceVerification?.status==='matched':!['supporting-evidence','potential-violation'].includes(assessment.status))</code> left to right with falsy short-circuiting.
- [L23](#l23) Return to the caller: create an object with 4 property/spread entries: <code>{id,expected,observed:assessment?.status ?? null,passed:Boolean(verified &amp;&amp; assessment?.status===expected &amp;&amp; decisions.get(&#96;${fixture.id}:${id}&#96;)===true)}</code>; later properties overwrite earlier spread values.

<a id="fn-1533"></a>
### inline callback (21:49)

Synchronous function. Lexically inside [Object.entries(fixture.expected).map callback (20:57)](#fn-1466). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L21](#l21) Implicitly return: compute <code>item.requirementId===id</code> with the <code>===</code> operator.

<a id="fn-2184"></a>
### review.assessments.map callback (27:41)

Synchronous function. Lexically inside [cases.map callback (18:27)](#fn-1329). Passed to <code>review.assessments.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L27](#l27) Implicitly return: read <code>item.requirementId</code>.

<a id="fn-2252"></a>
### criteria.every callback (27:109)

Synchronous function. Lexically inside [cases.map callback (18:27)](#fn-1329). Passed to <code>criteria.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L27](#l27) Implicitly return: read <code>item.passed</code>.

<a id="fn-2330"></a>
### results.filter callback (29:52)

Synchronous function. Lexically inside [scoreTaskEvaluation (7:8)](#fn-424). Passed to <code>results.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: read <code>item.passed</code>.

## Compile-time data contracts

### Status

```typescript
type Status=NonNullable<AiResult['taskReview']>['assessments'][number]['status'];
```

Declared at [L3](#l3). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Case

```typescript
type Case={id:string;expected:Record<string,Status>};
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Label

```typescript
type Label={caseId:string;requirementId:string;accepted:boolean};
```

Declared at [L5](#l5). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Directly importing tests

- [task-evaluation.test.ts](../../test/task-evaluation.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
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
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {reportSchema,type Report} from '../findings.js';
   2 | import type {AiResult} from './contracts.js';
   3 | type Status=NonNullable<AiResult['taskReview']>['assessments'][number]['status'];
   4 | type Case={id:string;expected:Record<string,Status>};
   5 | type Label={caseId:string;requirementId:string;accepted:boolean};
   6 | /** Explicit reviewer labels complement structural/citation checks; statuses alone do not establish quality. */
   7 | export function scoreTaskEvaluation(cases:Case[],runs:{caseId:string;report:Report}[],labels:Label[]) {
   8 |   if(new Set(cases.map(item=>item.id)).size!==cases.length || new Set(runs.map(item=>item.caseId)).size!==runs.length
   9 |     || runs.some(run=>!cases.some(item=>item.id===run.caseId)))throw new Error('Cases and runs must have unique known IDs.');
  10 |   const reports=new Map(runs.map(run=>[run.caseId,reportSchema.parse(run.report)]));
  11 |   const decisions=new Map<string,boolean>();
  12 |   for(const label of labels) {
  13 |     const key=`${label.caseId}:${label.requirementId}`;
  14 |     if(typeof label.accepted!=='boolean' || decisions.has(key) || !reports.get(label.caseId)?.ai?.taskReview?.assessments.some(item=>item.requirementId===label.requirementId))
  15 |       throw new Error('Labels require an existing criterion, a boolean decision and no duplicates.');
  16 |     decisions.set(key,label.accepted);
  17 |   }
  18 |   const results=cases.map(fixture=>{
  19 |     const ai=reports.get(fixture.id)?.ai;const review=ai?.taskReview;
  20 |     const criteria=Object.entries(fixture.expected).map(([id,expected])=>{
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l29"></a>

```text
  21 |       const assessment=review?.assessments.find(item=>item.requirementId===id);
  22 |       const verified=assessment && (assessment.evidence.length>0?assessment.evidenceVerification?.status==='matched':!['supporting-evidence','potential-violation'].includes(assessment.status));
  23 |       return {id,expected,observed:assessment?.status ?? null,passed:Boolean(verified && assessment?.status===expected && decisions.get(`${fixture.id}:${id}`)===true)};
  24 |     });
  25 |     return {caseId:fixture.id,criteria,passed:ai?.status==='completed' && review?.freshness==='unchanged'
  26 |       && ['assessed','partial'].includes(review.state) && review.assessments.length===criteria.length
  27 |       && new Set(review.assessments.map(item=>item.requirementId)).size===criteria.length && criteria.every(item=>item.passed)};
  28 |   });
  29 |   return {cases:cases.length,passed:results.filter(item=>item.passed).length,results};
  30 | }
  31 | 
```
