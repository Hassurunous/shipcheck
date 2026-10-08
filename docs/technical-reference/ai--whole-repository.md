# src/ai/whole-repository.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

remaining is the unprocessed inventory; selected and valid distinguish sent files from valid responses; skipped records permanent exclusions or final omissions. Each iteration plans a bounded batch and calls reviewWithAi again, retaining results independently. Size/count omissions can be retried in later batches; permanent exclusions are removed. The first failed batch stops the loop and labels remaining paths with its stop reason.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `2c03d52eb042304c50be9fecf61e1ccf98ac0850783a7769397b86bfe9ced863`.

This chapter inventories **7 function bodies/callbacks**, **20 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>../config.js</code>: <code>configSchema</code>, <code>loadConfig</code>.
- <code>../inspect-repository.js</code>: <code>inspectRepository</code>.
- <code>../findings.js</code>: <code>createReport</code>, <code>reportSchema</code>, <code>Report</code> (type only).
- <code>./context.js</code>: <code>collectContext</code>.
- <code>./review.js</code>: <code>reviewWithAi</code>, <code>AiReviewOptions</code> (type only).

## Module execution


## Function index

- [reviewWholeRepository (8:8)](#fn-398)
- [profile.files.map callback (16:45)](#fn-1304)
- [context.files.map callback (29:35)](#fn-1947)
- [batch.preview.files.some callback (38:36)](#fn-2297)
- [batches.some callback (45:29)](#fn-2811)
- [batches.some callback (46:48)](#fn-2891)
- [[...skipped].map callback (50:30)](#fn-3216)

<a id="fn-398"></a>
### reviewWholeRepository (8:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>options:AiReviewOptions</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>config</code>: test <code>options.config===undefined</code>; choose <code>await loadConfig(target)</code> when truthy, otherwise <code>configSchema.parse(options.config)</code>.
- [L14](#l14) <code>profile</code>: wait for <code>inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L15](#l15) <code>report</code>: call the named operation with the supplied arguments: <code>createReport(profile,config)</code>.
- [L16](#l16) <code>remaining</code>: construct <code>Set</code> using <code>profile.files.map(file=&gt;file.path)</code>; this creates the local instance used below.
- [L17](#l17) <code>selected</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L18](#l18) <code>valid</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L19](#l19) <code>skipped</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L20](#l20) <code>batches:NonNullable&lt;Report['aiAudit']&gt;['batches']</code>: create a new empty array to accumulate ordered results.
- [L21](#l21) <code>stoppedReason:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L23](#l23) <code>context</code>: wait for <code>collectContext(profile,config.ai,[...remaining])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L24](#l24) <code>item</code>: receive the next iterable value from <code>context.preview.skipped</code> at the start of each loop iteration.
- [L29](#l29) <code>paths</code>: transform each element into a new array: <code>context.files.map(file=&gt;file.path)</code>.
- [L31](#l31) <code>path</code>: receive the next iterable value from <code>remaining</code> at the start of each loop iteration.
- [L34](#l34) <code>batch</code>: read <code>(await reviewWithAi(target,{...options,config,paths})).ai</code>; the TypeScript assertion adds no runtime validation.
- [L36](#l36) <code>path</code>: receive the next iterable value from <code>paths</code> at the start of each loop iteration.
- [L40](#l40) <code>file</code>: receive the next iterable value from <code>batch.preview.files</code> at the start of each loop iteration.
- [L41](#l41) <code>path</code>: receive the next iterable value from <code>batch.coverage?.validResponsePaths ?? []</code> at the start of each loop iteration.
- [L44](#l44) <code>path</code>: receive the next iterable value from <code>remaining</code> at the start of each loop iteration.
- [L45](#l45) <code>failed</code>: stop at the first truthy callback result, returning whether any matched: <code>batches.some(batch=&gt;batch.status==='failed')</code>.
- [L46](#l46) <code>partial</code>: evaluate <code>skipped.size&gt;0 &#124;&#124; batches.some(batch=&gt;batch.coverage?.state==='partial')</code> left to right with truthy short-circuiting.

Execution:

- [L9](#l9) If <code>options.task</code> is truthy:
  - [L9](#l9) Throw <code>new Error('Task assessments use selected task files, not whole-repository batching.')</code>; normal execution stops until an enclosing catch handles it.
- [L10](#l10) If <code>options.execution==='live' &amp;&amp; (!options.budget &#124;&#124; options.trial)</code> is truthy:
  - [L10](#l10) Throw <code>new Error('Whole-repository live AI requires --budget NAME, not the one-time trial.')</code>; normal execution stops until an enclosing catch handles it.
- [L11](#l11) If <code>options.execution!=='live' &amp;&amp; (options.budget &#124;&#124; options.trial)</code> is truthy:
  - [L11](#l11) Throw <code>new Error('Spending authorization requires live AI.')</code>; normal execution stops until an enclosing catch handles it.
- [L12](#l12) If <code>options.paths</code> is truthy:
  - [L12](#l12) Throw <code>new Error('Whole-repository AI cannot be combined with selected paths.')</code>; normal execution stops until an enclosing catch handles it.
- [L13](#l13) Bind <code>config</code>: test <code>options.config===undefined</code>; choose <code>await loadConfig(target)</code> when truthy, otherwise <code>configSchema.parse(options.config)</code>.
- [L14](#l14) Bind <code>profile</code>: wait for <code>inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L15](#l15) Bind <code>report</code>: call the named operation with the supplied arguments: <code>createReport(profile,config)</code>.
- [L16](#l16) Bind <code>remaining</code>: construct <code>Set</code> using <code>profile.files.map(file=&gt;file.path)</code>; this creates the local instance used below.
- [L17](#l17) Bind <code>selected</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L18](#l18) Bind <code>valid</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L19](#l19) Bind <code>skipped</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L20](#l20) Bind <code>batches:NonNullable&lt;Report['aiAudit']&gt;['batches']</code>: create a new empty array to accumulate ordered results.
- [L21](#l21) Bind <code>stoppedReason:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L22](#l22) Repeat while <code>remaining.size &amp;&amp; batches.length&lt;config.ai.maxBatches</code>:
  - [L23](#l23) Bind <code>context</code>: wait for <code>collectContext(profile,config.ai,[...remaining])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L24](#l24) Iterate <code>context.preview.skipped</code> values, binding <code>const item</code> for each iteration:
    - [L25](#l25) If <code>!['file-count-limit','context-size-limit'].includes(item.reason)</code> is truthy:
      - [L26](#l26) remove the keyed entry/value: <code>remaining.delete(item.path)</code>.
      - [L26](#l26) If <code>!selected.has(item.path)</code> is truthy:
        - [L26](#l26) store/replace a keyed entry in the Map: <code>skipped.set(item.path,item.reason)</code>.
  - [L29](#l29) Bind <code>paths</code>: transform each element into a new array: <code>context.files.map(file=&gt;file.path)</code>.
  - [L30](#l30) If <code>!paths.length</code> is truthy:
    - [L31](#l31) Iterate <code>remaining</code> values, binding <code>const path</code> for each iteration:
      - [L31](#l31) store/replace a keyed entry in the Map: <code>skipped.set(path,'cannot-fit-context')</code>.
    - [L32](#l32) call the named operation with the supplied arguments: <code>remaining.clear()</code>.
    - [L32](#l32) Leave the enclosing loop/switch.
  - [L34](#l34) Bind <code>batch</code>: read <code>(await reviewWithAi(target,{...options,config,paths})).ai</code>; the TypeScript assertion adds no runtime validation.
  - [L35](#l35) append values to the existing array: <code>batches.push(batch)</code>.
  - [L36](#l36) Iterate <code>paths</code> values, binding <code>const path</code> for each iteration:
    - [L37](#l37) remove the keyed entry/value: <code>remaining.delete(path)</code>.
    - [L38](#l38) If <code>!batch.preview.files.some(file=&gt;file.path===path)</code> is truthy:
      - [L38](#l38) store/replace a keyed entry in the Map: <code>skipped.set(path,'unavailable-during-batch')</code>.
  - [L40](#l40) Iterate <code>batch.preview.files</code> values, binding <code>const file</code> for each iteration:
    - [L40](#l40) insert a unique value in the Set: <code>selected.add(file.path)</code>.
    - [L40](#l40) remove the keyed entry/value: <code>remaining.delete(file.path)</code>.
    - [L40](#l40) remove the keyed entry/value: <code>skipped.delete(file.path)</code>.
  - [L41](#l41) Iterate <code>batch.coverage?.validResponsePaths ?? []</code> values, binding <code>const path</code> for each iteration:
    - [L41](#l41) insert a unique value in the Set: <code>valid.add(path)</code>.
  - [L42](#l42) If <code>batch.status==='failed'</code> is truthy:
    - [L42](#l42) update <code>stoppedReason</code> with <code>batch.error?.code ?? 'batch-failure'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L42](#l42) Leave the enclosing loop/switch.
- [L44](#l44) Iterate <code>remaining</code> values, binding <code>const path</code> for each iteration:
  - [L44](#l44) store/replace a keyed entry in the Map: <code>skipped.set(path,stoppedReason?&#96;stopped:${stoppedReason}&#96;:'batch-count-limit')</code>.
- [L45](#l45) Bind <code>failed</code>: stop at the first truthy callback result, returning whether any matched: <code>batches.some(batch=&gt;batch.status==='failed')</code>.
- [L46](#l46) Bind <code>partial</code>: evaluate <code>skipped.size&gt;0 &#124;&#124; batches.some(batch=&gt;batch.coverage?.state==='partial')</code> left to right with truthy short-circuiting.
- [L47](#l47) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse({...report,aiAudit:{scope:'whole-repository',batches,...(options.budget?{budgetName:options.budget}:{}), ...(stoppedReason?{stoppedReason}:{}), selectedPaths:[...selected].sort(),validResponsePaths:[...valid].sort(), skipped:[...skipped].…</code>.

<a id="fn-1304"></a>
### profile.files.map callback (16:45)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>profile.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: read <code>file.path</code>.

<a id="fn-1947"></a>
### context.files.map callback (29:35)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>context.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: read <code>file.path</code>.

<a id="fn-2297"></a>
### batch.preview.files.some callback (38:36)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>batch.preview.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L38](#l38) Implicitly return: compute <code>file.path===path</code> with the <code>===</code> operator.

<a id="fn-2811"></a>
### batches.some callback (45:29)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>batches.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>batch</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L45](#l45) Implicitly return: compute <code>batch.status==='failed'</code> with the <code>===</code> operator.

<a id="fn-2891"></a>
### batches.some callback (46:48)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>batches.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>batch</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L46](#l46) Implicitly return: compute <code>batch.coverage?.state==='partial'</code> with the <code>===</code> operator.

<a id="fn-3216"></a>
### [...skipped].map callback (50:30)

Synchronous function. Lexically inside [reviewWholeRepository (8:8)](#fn-398). Passed to <code>[...skipped].map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>[path,reason]</code>: destructure the supplied value into these local bindings.

Execution:

[L50](#l50) Implicitly return: create an object with 2 property/spread entries: <code>{path,reason}</code>; later properties overwrite earlier spread values.

## Directly importing tests

- [audit-budget.test.ts](../../test/audit-budget.test.ts)
- [reference-ai.test.ts](../../test/reference-ai.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
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
   1 | import { configSchema, loadConfig } from '../config.js';
   2 | import { inspectRepository } from '../inspect-repository.js';
   3 | import { createReport, reportSchema, type Report } from '../findings.js';
   4 | import { collectContext } from './context.js';
   5 | import { reviewWithAi, type AiReviewOptions } from './review.js';
   6 | 
   7 | /** Bounded batching; live requests share a durable, explicitly named allowance. */
   8 | export async function reviewWholeRepository(target:string,options:AiReviewOptions):Promise<Report> {
   9 |   if(options.task)throw new Error('Task assessments use selected task files, not whole-repository batching.');
  10 |   if(options.execution==='live' && (!options.budget || options.trial)) throw new Error('Whole-repository live AI requires --budget NAME, not the one-time trial.');
  11 |   if(options.execution!=='live' && (options.budget || options.trial))throw new Error('Spending authorization requires live AI.');
  12 |   if(options.paths) throw new Error('Whole-repository AI cannot be combined with selected paths.');
  13 |   const config=options.config===undefined?await loadConfig(target):configSchema.parse(options.config);
  14 |   const profile=await inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude});
  15 |   const report=createReport(profile,config);
  16 |   const remaining=new Set(profile.files.map(file=>file.path));
  17 |   const selected=new Set<string>();
  18 |   const valid=new Set<string>();
  19 |   const skipped=new Map<string,string>();
  20 |   const batches:NonNullable<Report['aiAudit']>['batches']=[];
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l40"></a>

```text
  21 |   let stoppedReason:string|undefined;
  22 |   while(remaining.size && batches.length<config.ai.maxBatches) {
  23 |     const context=await collectContext(profile,config.ai,[...remaining]);
  24 |     for(const item of context.preview.skipped) {
  25 |       if(!['file-count-limit','context-size-limit'].includes(item.reason)) {
  26 |         remaining.delete(item.path);if(!selected.has(item.path))skipped.set(item.path,item.reason);
  27 |       }
  28 |     }
  29 |     const paths=context.files.map(file=>file.path);
  30 |     if(!paths.length) {
  31 |       for(const path of remaining)skipped.set(path,'cannot-fit-context');
  32 |       remaining.clear();break;
  33 |     }
  34 |     const batch=(await reviewWithAi(target,{...options,config,paths})).ai!;
  35 |     batches.push(batch);
  36 |     for(const path of paths) {
  37 |       remaining.delete(path);
  38 |       if(!batch.preview.files.some(file=>file.path===path))skipped.set(path,'unavailable-during-batch');
  39 |     }
  40 |     for(const file of batch.preview.files) {selected.add(file.path);remaining.delete(file.path);skipped.delete(file.path);}
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>

```text
  41 |     for(const path of batch.coverage?.validResponsePaths ?? [])valid.add(path);
  42 |     if(batch.status==='failed') {stoppedReason=batch.error?.code ?? 'batch-failure';break;}
  43 |   }
  44 |   for(const path of remaining)skipped.set(path,stoppedReason?`stopped:${stoppedReason}`:'batch-count-limit');
  45 |   const failed=batches.some(batch=>batch.status==='failed');
  46 |   const partial=skipped.size>0 || batches.some(batch=>batch.coverage?.state==='partial');
  47 |   return reportSchema.parse({...report,aiAudit:{scope:'whole-repository',batches,...(options.budget?{budgetName:options.budget}:{}),
  48 |     ...(stoppedReason?{stoppedReason}:{}),
  49 |     selectedPaths:[...selected].sort(),validResponsePaths:[...valid].sort(),
  50 |     skipped:[...skipped].map(([path,reason])=>({path,reason})),
  51 |     state:failed?'failed':options.execution==='preview'?'preview':partial?'partial':'complete'}});
  52 | }
  53 | 
```
