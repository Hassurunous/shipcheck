# src/task-file.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Structured tasks are normalized through strict schemas before hashing. describeCurrentTask hashes JSON of the normalized definition and creates initially uncertain requirement summaries. Legacy criteria become positional criterion-N IDs. loadTask rejects links along the task-file path, performs a bounded JSON read, and resolves the repository relative to the task file's directory.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `70446ca771e36ffed93625f905c9bb41646158fde858e274c076d598e8cd2e5c`.

This chapter inventories **9 function bodies/callbacks**, **10 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:fs/promises</code>: <code>lstat</code>.
- <code>node:path</code>: <code>dirname</code>, <code>parse</code>, <code>resolve</code>, <code>join</code>.
- <code>zod</code>: <code>z</code>.
- <code>node:crypto</code>: <code>createHash</code>.
- <code>./filesystem-policy.js</code>: <code>readBoundedConfig</code>.

## Module execution

- [L7](#l7) Bind <code>relativePath</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(value=&gt; !/[:\\\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Expected a relative forward-slash file path.')</code>.
- [L9](#l9) Bind <code>taskSchema</code>: call the named operation with the supplied arguments: <code>z.object({version:z.literal(1),repository:z.string().min(1), files:z.array(relativePath).min(1).max(256),criteria:z.array(z.string().trim().min(1).max(2000)).min(1).max(50)}).strict()</code>.
- [L11](#l11) Bind <code>currentTaskSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), title:z.string().trim().min(1).max(200),description:z.string().max(4000).default(''), files:z.array(relativePath).min(1).max(256), requirements:z.array(z.object({id:z.string().regex(/^[a-zA-Z]…</code>.
- [L21](#l21) Bind <code>currentTaskReportSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string(),title:z.string(),sha256:z.string(), source:z.enum(['configuration','task-file']),assessment:z.enum(['not-assessed','assessed','partial','changed']), requirements:z.array(z.object({id:z.string(),text:z.string(),status:z.enum(['insuffi…</code>.

## Function index

- [z.string().min(1).max(512).refine callback (7:56)](#fn-284)
- [value.split('/').every callback (8:29)](#fn-354)
- [z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50) .refine callback (17:13)](#fn-1065)
- [items.map callback (17:38)](#fn-1090)
- [describeCurrentTask (25:8)](#fn-1737)
- [task.requirements.map callback (29:40)](#fn-2087)
- [normalizeLegacyTask (31:8)](#fn-2172)
- [task.criteria.map callback (33:36)](#fn-2368)
- [loadTask (35:8)](#fn-2430)

<a id="fn-284"></a>
### z.string().min(1).max(512).refine callback (7:56)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(512).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L7](#l7) Implicitly return: evaluate <code>!/[:\\\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..')</code> left to right with falsy short-circuiting.

<a id="fn-354"></a>
### value.split('/').every callback (8:29)

Synchronous function. Lexically inside [z.string().min(1).max(512).refine callback (7:56)](#fn-284). Passed to <code>value.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: evaluate <code>part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'</code> left to right with falsy short-circuiting.

<a id="fn-1065"></a>
### z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50) .refine callback (17:13)

Synchronous function. Defined in module scope. Passed to <code>z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50) .refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>items</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: compute <code>new Set(items.map(item=&gt;item.id)).size===items.length</code> with the <code>===</code> operator.

<a id="fn-1090"></a>
### items.map callback (17:38)

Synchronous function. Lexically inside [z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50) .refine callback (17:13)](#fn-1065). Passed to <code>items.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: read <code>item.id</code>.

<a id="fn-1737"></a>
### describeCurrentTask (25:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input:z.input&lt;typeof currentTaskSchema&gt;</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L26](#l26) <code>task</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>currentTaskSchema.parse(input)</code>.

Execution:

- [L26](#l26) Bind <code>task</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>currentTaskSchema.parse(input)</code>.
- [L27](#l27) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>currentTaskReportSchema.parse({id:task.id,title:task.title, sha256:createHash('sha256').update(JSON.stringify(task)).digest('hex'),source:'configuration',assessment:'not-assessed', requirements:task.requirements.map(item=&gt;({...item,status:'insufficient-evid…</code>.

<a id="fn-2087"></a>
### task.requirements.map callback (29:40)

Synchronous function. Lexically inside [describeCurrentTask (25:8)](#fn-1737). Passed to <code>task.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: create an object with 2 property/spread entries: <code>{...item,status:'insufficient-evidence'}</code>; later properties overwrite earlier spread values.

<a id="fn-2172"></a>
### normalizeLegacyTask (31:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>task:z.infer&lt;typeof taskSchema&gt;</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L32](#l32) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>currentTaskSchema.parse({id:'task-file',title:'Task file',files:task.files, requirements:task.criteria.map((text,index)=&gt;({id:&#96;criterion-${index+1}&#96;,text}))})</code>.

<a id="fn-2368"></a>
### task.criteria.map callback (33:36)

Synchronous function. Lexically inside [normalizeLegacyTask (31:8)](#fn-2172). Passed to <code>task.criteria.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>text</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L33](#l33) Implicitly return: create an object with 2 property/spread entries: <code>{id:&#96;criterion-${index+1}&#96;,text}</code>; later properties overwrite earlier spread values.

<a id="fn-2430"></a>
### loadTask (35:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L36](#l36) <code>absolute</code>: call the named operation with the supplied arguments: <code>resolve(path)</code>.
- [L37](#l37) <code>current</code>: read <code>parse(absolute).root</code>.
- [L38](#l38) <code>part</code>: receive the next iterable value from <code>absolute.slice(current.length).split(/[\\/]/)</code> at the start of each loop iteration.
- [L42](#l42) <code>content</code>: wait for <code>readBoundedConfig(absolute)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L44](#l44) <code>task</code>: leave the value undefined until a later assignment.

Execution:

- [L36](#l36) Bind <code>absolute</code>: call the named operation with the supplied arguments: <code>resolve(path)</code>.
- [L37](#l37) Bind <code>current</code>: read <code>parse(absolute).root</code>.
- [L38](#l38) Iterate <code>absolute.slice(current.length).split(/[\\/]/)</code> values, binding <code>const part</code> for each iteration:
  - [L39](#l39) update <code>current</code> with <code>join(current,part)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L40](#l40) If <code>(await lstat(current)).isSymbolicLink()</code> is truthy:
    - [L40](#l40) Throw <code>new Error('Task file paths must not contain symlinks.')</code>; normal execution stops until an enclosing catch handles it.
- [L42](#l42) Bind <code>content</code>: wait for <code>readBoundedConfig(absolute)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L43](#l43) If <code>content === undefined</code> is truthy:
  - [L43](#l43) Throw <code>new Error('Task file does not exist.')</code>; normal execution stops until an enclosing catch handles it.
- [L44](#l44) Bind <code>task</code>: leave the value undefined until a later assignment.
- [L45](#l45) Run the protected block:
  - [L45](#l45) update <code>task</code> with <code>taskSchema.parse(JSON.parse(content))</code> using <code>=</code>; this mutation is visible to later statements.
- [L45](#l45) If it throws:
  - [L46](#l46) Throw <code>new Error('Invalid task JSON. Expected version:1, repository, nonempty files and criteria arrays.')</code>; normal execution stops until an enclosing catch handles it.
- [L47](#l47) Return to the caller: create an object with 2 property/spread entries: <code>{...task,repository:resolve(dirname(absolute),task.repository)}</code>; later properties overwrite earlier spread values.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>taskSchema</code> | <code>version</code> | <code>z.literal(1)</code> | [L9](#l9) |
| <code>taskSchema</code> | <code>repository</code> | <code>z.string().min(1)</code> | [L9](#l9) |
| <code>taskSchema</code> | <code>files</code> | <code>z.array(relativePath).min(1).max(256)</code> | [L10](#l10) |
| <code>taskSchema</code> | <code>criteria</code> | <code>z.array(z.string().trim().min(1).max(2000)).min(1).max(50)</code> | [L10](#l10) |
| <code>currentTaskSchema</code> | <code>id</code> | <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code> | [L12](#l12) |
| <code>currentTaskSchema</code> | <code>title</code> | <code>z.string().trim().min(1).max(200)</code> | [L13](#l13) |
| <code>currentTaskSchema</code> | <code>description</code> | <code>z.string().max(4000).default('')</code> | [L13](#l13) |
| <code>currentTaskSchema</code> | <code>files</code> | <code>z.array(relativePath).min(1).max(256)</code> | [L14](#l14) |
| <code>currentTaskSchema</code> | <code>requirements</code> | <code>z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50) .refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length,'Requirement IDs must be unique.')</code> | [L15](#l15) |
| <code>currentTaskSchema</code> | <code>requirements.id</code> | <code>z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)</code> | [L15](#l15) |
| <code>currentTaskSchema</code> | <code>requirements.text</code> | <code>z.string().trim().min(1).max(2000)</code> | [L16](#l16) |
| <code>currentTaskSchema</code> | <code>nonGoals</code> | <code>z.array(z.string().trim().min(1).max(2000)).max(50).default([])</code> | [L18](#l18) |
| <code>currentTaskReportSchema</code> | <code>id</code> | <code>z.string()</code> | [L21](#l21) |
| <code>currentTaskReportSchema</code> | <code>title</code> | <code>z.string()</code> | [L21](#l21) |
| <code>currentTaskReportSchema</code> | <code>sha256</code> | <code>z.string()</code> | [L21](#l21) |
| <code>currentTaskReportSchema</code> | <code>source</code> | <code>z.enum(['configuration','task-file'])</code> | [L22](#l22) |
| <code>currentTaskReportSchema</code> | <code>assessment</code> | <code>z.enum(['not-assessed','assessed','partial','changed'])</code> | [L22](#l22) |
| <code>currentTaskReportSchema</code> | <code>requirements</code> | <code>z.array(z.object({id:z.string(),text:z.string(),status:z.enum(['insufficient-evidence','supporting-evidence','potential-violation','needs-clarification'])}))</code> | [L23](#l23) |
| <code>currentTaskReportSchema</code> | <code>requirements.id</code> | <code>z.string()</code> | [L23](#l23) |
| <code>currentTaskReportSchema</code> | <code>requirements.text</code> | <code>z.string()</code> | [L23](#l23) |
| <code>currentTaskReportSchema</code> | <code>requirements.status</code> | <code>z.enum(['insufficient-evidence','supporting-evidence','potential-violation','needs-clarification'])</code> | [L23](#l23) |
| <code>currentTaskReportSchema</code> | <code>nonGoals</code> | <code>z.array(z.string())</code> | [L24](#l24) |

## Compile-time data contracts

### CurrentTask

```typescript
type CurrentTask=z.infer<typeof currentTaskSchema>;
```

Declared at [L20](#l20). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L7](#l7) <code>relativePath</code>: call the named operation with the supplied arguments: <code>z.string().min(1).max(512).refine(value=&gt; !/[:\\\u0000-\u001f]/.test(value) &amp;&amp; value.split('/').every(part=&gt;part!=='' &amp;&amp; part!=='.' &amp;&amp; part!=='..'),'Expected a relative forward-slash file path.')</code>.
- [L9](#l9) <code>taskSchema</code>: call the named operation with the supplied arguments: <code>z.object({version:z.literal(1),repository:z.string().min(1), files:z.array(relativePath).min(1).max(256),criteria:z.array(z.string().trim().min(1).max(2000)).min(1).max(50)}).strict()</code>.
- [L11](#l11) <code>currentTaskSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/), title:z.string().trim().min(1).max(200),description:z.string().max(4000).default(''), files:z.array(relativePath).min(1).max(256), requirements:z.array(z.object({id:z.string().regex(/^[a-zA-Z]…</code>.
- [L21](#l21) <code>currentTaskReportSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string(),title:z.string(),sha256:z.string(), source:z.enum(['configuration','task-file']),assessment:z.enum(['not-assessed','assessed','partial','changed']), requirements:z.array(z.object({id:z.string(),text:z.string(),status:z.enum(['insuffi…</code>.

## Directly importing tests

- [current-task.test.ts](../../test/current-task.test.ts)
- [task-ai.test.ts](../../test/task-ai.test.ts)
- [workflows.test.ts](../../test/workflows.test.ts)

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
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import { lstat } from 'node:fs/promises';
   2 | import { dirname, parse, resolve, join } from 'node:path';
   3 | import { z } from 'zod';
   4 | import { createHash } from 'node:crypto';
   5 | import { readBoundedConfig } from './filesystem-policy.js';
   6 | 
   7 | const relativePath = z.string().min(1).max(512).refine(value=> !/[:\\\u0000-\u001f]/.test(value)
   8 |   && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Expected a relative forward-slash file path.');
   9 | export const taskSchema = z.object({version:z.literal(1),repository:z.string().min(1),
  10 |   files:z.array(relativePath).min(1).max(256),criteria:z.array(z.string().trim().min(1).max(2000)).min(1).max(50)}).strict();
  11 | export const currentTaskSchema=z.object({
  12 |   id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  13 |   title:z.string().trim().min(1).max(200),description:z.string().max(4000).default(''),
  14 |   files:z.array(relativePath).min(1).max(256),
  15 |   requirements:z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  16 |     text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50)
  17 |     .refine(items=>new Set(items.map(item=>item.id)).size===items.length,'Requirement IDs must be unique.'),
  18 |   nonGoals:z.array(z.string().trim().min(1).max(2000)).max(50).default([]),
  19 | }).strict();
  20 | export type CurrentTask=z.infer<typeof currentTaskSchema>;
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
<a id="l32"></a>
<a id="l33"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | export const currentTaskReportSchema=z.object({id:z.string(),title:z.string(),sha256:z.string(),
  22 |   source:z.enum(['configuration','task-file']),assessment:z.enum(['not-assessed','assessed','partial','changed']),
  23 |   requirements:z.array(z.object({id:z.string(),text:z.string(),status:z.enum(['insufficient-evidence','supporting-evidence','potential-violation','needs-clarification'])})),
  24 |   nonGoals:z.array(z.string())});
  25 | export function describeCurrentTask(input:z.input<typeof currentTaskSchema>) {
  26 |   const task=currentTaskSchema.parse(input);
  27 |   return currentTaskReportSchema.parse({id:task.id,title:task.title,
  28 |     sha256:createHash('sha256').update(JSON.stringify(task)).digest('hex'),source:'configuration',assessment:'not-assessed',
  29 |     requirements:task.requirements.map(item=>({...item,status:'insufficient-evidence'})),nonGoals:task.nonGoals});
  30 | }
  31 | export function normalizeLegacyTask(task:z.infer<typeof taskSchema>):CurrentTask {
  32 |   return currentTaskSchema.parse({id:'task-file',title:'Task file',files:task.files,
  33 |     requirements:task.criteria.map((text,index)=>({id:`criterion-${index+1}`,text}))});
  34 | }
  35 | export async function loadTask(path:string) {
  36 |   const absolute = resolve(path);
  37 |   let current = parse(absolute).root;
  38 |   for (const part of absolute.slice(current.length).split(/[\\/]/)) {
  39 |     current = join(current,part);
  40 |     if ((await lstat(current)).isSymbolicLink()) throw new Error('Task file paths must not contain symlinks.');
```

<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>

```text
  41 |   }
  42 |   const content = await readBoundedConfig(absolute);
  43 |   if (content === undefined) throw new Error('Task file does not exist.');
  44 |   let task;
  45 |   try { task = taskSchema.parse(JSON.parse(content)); }
  46 |   catch { throw new Error('Invalid task JSON. Expected version:1, repository, nonempty files and criteria arrays.'); }
  47 |   return {...task,repository:resolve(dirname(absolute),task.repository)};
  48 | }
  49 | 
```
