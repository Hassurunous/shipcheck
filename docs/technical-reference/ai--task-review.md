# src/ai/task-review.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

pendingTaskReview starts every criterion as insufficient-evidence. finishTaskReview retains proposedStatus, verifies citations, downgrades synthetic/rejected evidence, flags disputed references and prevents supporting-evidence when relevant context is missing or changed. invalidateTaskReview mutates the review to changed and every status to insufficient-evidence while preserving the original model proposal.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `094bda2c89e91a1d3b432bec4a152d9fe1f7921d7257b0cb7cee98ac0e43d503`.

This chapter inventories **17 function bodies/callbacks**, **7 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>../task-file.js</code>: <code>describeCurrentTask</code>, <code>CurrentTask</code> (type only).
- <code>./contracts.js</code>: <code>taskReviewSchema</code>, <code>AiResult</code> (type only), <code>QaOutput</code> (type only).
- <code>./context.js</code>: <code>AiContext</code> (type only).
- <code>./verify-evidence.js</code>: <code>verifyEvidence</code>.

## Module execution


## Function index

- [pendingTaskReview (6:8)](#fn-253)
- [task.requirements.map callback (8:39)](#fn-459)
- [invalidateTaskReview (11:8)](#fn-669)
- [finishTaskReview (18:8)](#fn-1087)
- [referenceConflicts.flatMap callback (21:60)](#fn-1370)
- [item.evidence.map callback (21:84)](#fn-1394)
- [task.requirements.map callback (22:44)](#fn-1451)
- [output.taskAssessments!.find callback (23:51)](#fn-1516)
- [assessment.evidence.some callback (28:40)](#fn-1980)
- [task.files.some callback (30:66)](#fn-2177)
- [submitted.files.some callback (30:94)](#fn-2205)
- [task.files.some callback (31:26)](#fn-2255)
- [current.files.find callback (31:51)](#fn-2280)
- [submitted.files.find callback (31:107)](#fn-2336)
- [inline callback (32:47)](#fn-2416)
- [inline callback (33:45)](#fn-2492)
- [review.assessments.some callback (38:65)](#fn-2958)

<a id="fn-253"></a>
### pendingTaskReview (6:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>task:CurrentTask</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L7](#l7) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>taskReviewSchema.parse({taskHash:describeCurrentTask(task).sha256,state:'not-assessed',freshness:'not-checked', assessments:task.requirements.map(item=&gt;({requirementId:item.id,status:'insufficient-evidence',proposedStatus:'insufficient-evidence', explanatio…</code>.

<a id="fn-459"></a>
### task.requirements.map callback (8:39)

Synchronous function. Lexically inside [pendingTaskReview (6:8)](#fn-253). Passed to <code>task.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: create an object with 6 property/spread entries: <code>{requirementId:item.id,status:'insufficient-evidence',proposedStatus:'insufficient-evidence', explanation:'No requirement assessment completed.',relatedRequirementIds:[],evidence:[]}</code>; later properties overwrite earlier spread values.

<a id="fn-669"></a>
### invalidateTaskReview (11:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>review:NonNullable&lt;AiResult['taskReview']&gt;</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>assessment</code>: receive the next iterable value from <code>review.assessments</code> at the start of each loop iteration.

Execution:

- [L12](#l12) update <code>review.state</code> with <code>'changed'</code> using <code>=</code>; this mutation is visible to later statements.
- [L12](#l12) update <code>review.freshness</code> with <code>'changed-or-unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
- [L13](#l13) Iterate <code>review.assessments</code> values, binding <code>const assessment</code> for each iteration:
  - [L14](#l14) update <code>assessment.status</code> with <code>'insufficient-evidence'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L15](#l15) update <code>assessment.explanation</code> with <code>'Task expectations changed or became unavailable during review. Re-run before acting on the original assessment. '+assessment.explanation</code> using <code>=</code>; this mutation is visible to later statements.

<a id="fn-1087"></a>
### finishTaskReview (18:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>task:CurrentTask</code>: supplied by the caller; usage is shown in the steps below.
- <code>output:QaOutput</code>: supplied by the caller; usage is shown in the steps below.
- <code>submitted:AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>current:AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>referenceConflicts:NonNullable&lt;AiResult['referenceConflicts']&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>synthetic:boolean</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L20](#l20) <code>review</code>: call the named operation with the supplied arguments: <code>pendingTaskReview(task)</code>.
- [L21](#l21) <code>conflictedPaths</code>: construct <code>Set</code> using <code>referenceConflicts.flatMap(item=&gt;item.evidence.map(e=&gt;e.path))</code>; this creates the local instance used below.

Execution:

- [L20](#l20) Bind <code>review</code>: call the named operation with the supplied arguments: <code>pendingTaskReview(task)</code>.
- [L21](#l21) Bind <code>conflictedPaths</code>: construct <code>Set</code> using <code>referenceConflicts.flatMap(item=&gt;item.evidence.map(e=&gt;e.path))</code>; this creates the local instance used below.
- [L22](#l22) update <code>review.assessments</code> with <code>task.requirements.map(requirement=&gt;{ const assessment=output.taskAssessments!.find(item=&gt;item.requirementId===requirement.id)!; const verification=assessment.evidence.length?verifyEvidence(assessment,submitted,current):undefined; let status=assessment.statu…</code> using <code>=</code>; this mutation is visible to later statements.
- [L38](#l38) update <code>review.state</code> with <code>synthetic?'not-assessed':review.assessments.some(item=&gt;['insufficient-evidence','needs-clarification'].includes(item.status))?'partial':'assessed'</code> using <code>=</code>; this mutation is visible to later statements.
- [L39](#l39) Return to the caller: evaluate <code>review</code>.

<a id="fn-1370"></a>
### referenceConflicts.flatMap callback (21:60)

Synchronous function. Lexically inside [finishTaskReview (18:8)](#fn-1087). Passed to <code>referenceConflicts.flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L21](#l21) Implicitly return: transform each element into a new array: <code>item.evidence.map(e=&gt;e.path)</code>.

<a id="fn-1394"></a>
### item.evidence.map callback (21:84)

Synchronous function. Lexically inside [referenceConflicts.flatMap callback (21:60)](#fn-1370). Passed to <code>item.evidence.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>e</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L21](#l21) Implicitly return: read <code>e.path</code>.

<a id="fn-1451"></a>
### task.requirements.map callback (22:44)

Synchronous function. Lexically inside [finishTaskReview (18:8)](#fn-1087). Passed to <code>task.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>requirement</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L23](#l23) <code>assessment</code>: return the first matching element, or undefined: <code>output.taskAssessments!.find(item=&gt;item.requirementId===requirement.id)</code>; the TypeScript assertion adds no runtime validation.
- [L24](#l24) <code>verification</code>: test <code>assessment.evidence.length</code>; choose <code>verifyEvidence(assessment,submitted,current)</code> when truthy, otherwise <code>undefined</code>.
- [L25](#l25) <code>status</code>: read <code>assessment.status</code>.
- [L25](#l25) <code>explanation</code>: read <code>assessment.explanation</code>.

Execution:

- [L23](#l23) Bind <code>assessment</code>: return the first matching element, or undefined: <code>output.taskAssessments!.find(item=&gt;item.requirementId===requirement.id)</code>; the TypeScript assertion adds no runtime validation.
- [L24](#l24) Bind <code>verification</code>: test <code>assessment.evidence.length</code>; choose <code>verifyEvidence(assessment,submitted,current)</code> when truthy, otherwise <code>undefined</code>.
- [L25](#l25) Bind <code>status</code>: read <code>assessment.status</code>.
- [L25](#l25) Bind <code>explanation</code>: read <code>assessment.explanation</code>.
- [L26](#l26) If <code>verification?.status==='rejected' &#124;&#124; synthetic</code> is truthy:
  - [L27](#l27) update <code>status</code> with <code>'insufficient-evidence'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L27](#l27) update <code>explanation</code> with <code>(synthetic?'Synthetic mock; no real assessment. ':'Evidence could not be verified. ')+explanation</code> using <code>=</code>; this mutation is visible to later statements.
- [L26](#l26) Otherwise:
  - [L28](#l28) If <code>assessment.evidence.some(item=&gt;conflictedPaths.has(item.path))</code> is truthy:
    - [L29](#l29) update <code>status</code> with <code>'needs-clarification'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L29](#l29) update <code>explanation</code> with <code>'Cites a disputed reference. '+explanation</code> using <code>=</code>; this mutation is visible to later statements.
  - [L28](#l28) Otherwise:
    - [L30](#l30) If <code>status==='supporting-evidence' &amp;&amp; (task.files.some(path=&gt;!submitted.files.some(file=&gt;file.path===path)) &#124;&#124; task.files.some(path=&gt;current.files.find(file=&gt;file.path===path)?.content!==submitted.files.find(file=&gt;file.path===path)?.content) &#124;&#124; submitted.previe…</code> is truthy:
      - [L34](#l34) update <code>status</code> with <code>'insufficient-evidence'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L34](#l34) update <code>explanation</code> with <code>'Selected task files or applicable reference context are incomplete or changed. '+explanation</code> using <code>=</code>; this mutation is visible to later statements.
- [L36](#l36) Return to the caller: create an object with 5 property/spread entries: <code>{...assessment,status,explanation,proposedStatus:assessment.status,...(verification?{evidenceVerification:verification}:{})}</code>; later properties overwrite earlier spread values.

<a id="fn-1516"></a>
### output.taskAssessments!.find callback (23:51)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). Passed to <code>output.taskAssessments!.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L23](#l23) Implicitly return: compute <code>item.requirementId===requirement.id</code> with the <code>===</code> operator.

<a id="fn-1980"></a>
### assessment.evidence.some callback (28:40)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). Passed to <code>assessment.evidence.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: test membership without changing the collection: <code>conflictedPaths.has(item.path)</code>.

<a id="fn-2177"></a>
### task.files.some callback (30:66)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). Passed to <code>task.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L30](#l30) Implicitly return: apply <code>!</code> to <code>submitted.files.some(file=&gt;file.path===path)</code>.

<a id="fn-2205"></a>
### submitted.files.some callback (30:94)

Synchronous function. Lexically inside [task.files.some callback (30:66)](#fn-2177). Passed to <code>submitted.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L30](#l30) Implicitly return: compute <code>file.path===path</code> with the <code>===</code> operator.

<a id="fn-2255"></a>
### task.files.some callback (31:26)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). Passed to <code>task.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: compute <code>current.files.find(file=&gt;file.path===path)?.content!==submitted.files.find(file=&gt;file.path===path)?.content</code> with the <code>!==</code> operator.

<a id="fn-2280"></a>
### current.files.find callback (31:51)

Synchronous function. Lexically inside [task.files.some callback (31:26)](#fn-2255). Passed to <code>current.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: compute <code>file.path===path</code> with the <code>===</code> operator.

<a id="fn-2336"></a>
### submitted.files.find callback (31:107)

Synchronous function. Lexically inside [task.files.some callback (31:26)](#fn-2255). Passed to <code>submitted.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: compute <code>file.path===path</code> with the <code>===</code> operator.

<a id="fn-2416"></a>
### inline callback (32:47)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L32](#l32) Implicitly return: compute <code>item.status!=='included'</code> with the <code>!==</code> operator.

<a id="fn-2492"></a>
### inline callback (33:45)

Synchronous function. Lexically inside [task.requirements.map callback (22:44)](#fn-1451). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L33](#l33) Implicitly return: evaluate <code>!['included','not-applicable'].includes(item.status) &#124;&#124; item.freshness==='changed-or-unavailable'</code> left to right with truthy short-circuiting.

<a id="fn-2958"></a>
### review.assessments.some callback (38:65)

Synchronous function. Lexically inside [finishTaskReview (18:8)](#fn-1087). Passed to <code>review.assessments.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L38](#l38) Implicitly return: call the named operation with the supplied arguments: <code>['insufficient-evidence','needs-clarification'].includes(item.status)</code>.

## Directly importing tests

No test file directly imports this module by its relative module path; it may be exercised through its callers.

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {describeCurrentTask,type CurrentTask} from '../task-file.js';
   2 | import {taskReviewSchema,type AiResult,type QaOutput} from './contracts.js';
   3 | import type {AiContext} from './context.js';
   4 | import {verifyEvidence} from './verify-evidence.js';
   5 | 
   6 | export function pendingTaskReview(task:CurrentTask) {
   7 |   return taskReviewSchema.parse({taskHash:describeCurrentTask(task).sha256,state:'not-assessed',freshness:'not-checked',
   8 |     assessments:task.requirements.map(item=>({requirementId:item.id,status:'insufficient-evidence',proposedStatus:'insufficient-evidence',
   9 |       explanation:'No requirement assessment completed.',relatedRequirementIds:[],evidence:[]}))});
  10 | }
  11 | export function invalidateTaskReview(review:NonNullable<AiResult['taskReview']>) {
  12 |   review.state='changed';review.freshness='changed-or-unavailable';
  13 |   for(const assessment of review.assessments) {
  14 |     assessment.status='insufficient-evidence';
  15 |     assessment.explanation='Task expectations changed or became unavailable during review. Re-run before acting on the original assessment. '+assessment.explanation;
  16 |   }
  17 | }
  18 | export function finishTaskReview(task:CurrentTask,output:QaOutput,submitted:AiContext,current:AiContext,
  19 |   referenceConflicts:NonNullable<AiResult['referenceConflicts']>,synthetic:boolean) {
  20 |   const review=pendingTaskReview(task);
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
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l36"></a>
<a id="l38"></a>
<a id="l39"></a>

```text
  21 |   const conflictedPaths=new Set(referenceConflicts.flatMap(item=>item.evidence.map(e=>e.path)));
  22 |   review.assessments=task.requirements.map(requirement=>{
  23 |     const assessment=output.taskAssessments!.find(item=>item.requirementId===requirement.id)!;
  24 |     const verification=assessment.evidence.length?verifyEvidence(assessment,submitted,current):undefined;
  25 |     let status=assessment.status,explanation=assessment.explanation;
  26 |     if(verification?.status==='rejected' || synthetic) {
  27 |       status='insufficient-evidence';explanation=(synthetic?'Synthetic mock; no real assessment. ':'Evidence could not be verified. ')+explanation;
  28 |     } else if(assessment.evidence.some(item=>conflictedPaths.has(item.path))) {
  29 |       status='needs-clarification';explanation='Cites a disputed reference. '+explanation;
  30 |     } else if(status==='supporting-evidence' && (task.files.some(path=>!submitted.files.some(file=>file.path===path))
  31 |       || task.files.some(path=>current.files.find(file=>file.path===path)?.content!==submitted.files.find(file=>file.path===path)?.content)
  32 |       || submitted.preview.dependencies?.some(item=>item.status!=='included')
  33 |       || submitted.preview.references?.some(item=>!['included','not-applicable'].includes(item.status) || item.freshness==='changed-or-unavailable'))) {
  34 |       status='insufficient-evidence';explanation='Selected task files or applicable reference context are incomplete or changed. '+explanation;
  35 |     }
  36 |     return {...assessment,status,explanation,proposedStatus:assessment.status,...(verification?{evidenceVerification:verification}:{})};
  37 |   });
  38 |   review.state=synthetic?'not-assessed':review.assessments.some(item=>['insufficient-evidence','needs-clarification'].includes(item.status))?'partial':'assessed';
  39 |   return review;
  40 | }
```


```text
  41 | 
```
