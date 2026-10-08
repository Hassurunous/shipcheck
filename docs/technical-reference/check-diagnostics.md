# src/check-diagnostics.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The adapter validates ESLint/Ruff JSON, normalizes locations without reading source, maps severities, hashes each normalized claim with its check ID, deduplicates in a Map and sorts by ID. sourcePath rejects locations escaping the root. exceedsThreshold compares numeric ranks; never is above every diagnostic severity, but command exit classification still matters in runChecks.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `1cfd7a39b3df137867d780dba222461c26346e7f22bb54a75a37b65a64f48fc6`.

This chapter inventories **9 function bodies/callbacks**, **11 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:crypto</code>: <code>createHash</code>.
- <code>node:path</code>: <code>isAbsolute</code>, <code>relative</code>, <code>resolve</code>.
- <code>zod</code>: <code>z</code>.

## Module execution

- [L5](#l5) Bind <code>diagnosticSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),tool:z.enum(['eslint','ruff']),ruleId:z.string().nullable(), severity:z.enum(['error','warning','info']),message:z.string(), path:z.string().nullable(),line:z.number().int().positive().optional(),column:z.number().int().positive().o…</code>.
- [L13](#l13) Bind <code>location</code>: call the named operation with the supplied arguments: <code>z.object({row:z.number().int().positive(),column:z.number().int().positive()})</code>.
- [L14](#l14) Bind <code>eslintSchema</code>: call the named operation with the supplied arguments: <code>z.array(z.object({filePath:z.string().min(1),messages:z.array(z.object({ ruleId:z.string().nullable().optional(),severity:z.number().int().min(0).max(2),message:z.string().min(1), line:z.number().int().positive().optional(),column:z.number().int().positive(…</code>.
- [L18](#l18) Bind <code>ruffSchema</code>: call the named operation with the supplied arguments: <code>z.array(z.object({filename:z.string().nullable(),code:z.string().nullable(),message:z.string().min(1), location:location.nullable(), })).max(10000)</code>.

## Function index

- [sourcePath (22:1)](#fn-1165)
- [parseDiagnostics (32:8)](#fn-1867)
- [eslintSchema.parse(parsed).flatMap callback (35:42)](#fn-2124)
- [file.messages.filter callback (35:69)](#fn-2151)
- [file.messages.filter(message=&gt;message.severity!==0).map callback (35:104)](#fn-2186)
- [ruffSchema.parse(parsed).map callback (40:36)](#fn-2562)
- [[...unique.values()].sort callback (49:36)](#fn-3151)
- [exceedsThreshold (52:8)](#fn-3195)
- [diagnostics.some callback (54:27)](#fn-3367)

<a id="fn-1165"></a>
### sourcePath (22:1)

Synchronous function. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path:string&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L26](#l26) <code>normalized</code>: call the named operation with the supplied arguments: <code>relative(resolve(root),resolve(root,path.replace(/\\/g,'/')))</code>.

Execution:

- [L23](#l23) If <code>path===null</code> is truthy:
  - [L23](#l23) Return to the caller: use the literal <code>null</code>.
- [L24](#l24) If <code>!path &#124;&#124; /[\u0000-\u001f]/.test(path)</code> is truthy:
  - [L24](#l24) Throw <code>new Error('Invalid diagnostic path.')</code>; normal execution stops until an enclosing catch handles it.
- [L25](#l25) If <code>!isAbsolute(path) &amp;&amp; /^[A-Za-z]:/.test(path)</code> is truthy:
  - [L25](#l25) Throw <code>new Error('Unsupported absolute diagnostic path.')</code>; normal execution stops until an enclosing catch handles it.
- [L26](#l26) Bind <code>normalized</code>: call the named operation with the supplied arguments: <code>relative(resolve(root),resolve(root,path.replace(/\\/g,'/')))</code>.
- [L27](#l27) If <code>!normalized &#124;&#124; normalized==='..' &#124;&#124; normalized.startsWith('../') &#124;&#124; normalized.startsWith('..\\') &#124;&#124; isAbsolute(normalized)</code> is truthy:
  - [L28](#l28) Throw <code>new Error('Diagnostic path is outside the repository.')</code>; normal execution stops until an enclosing catch handles it.
- [L29](#l29) Return to the caller: produce a string with matching text replaced: <code>normalized.replace(/\\/g,'/')</code>.

<a id="fn-1867"></a>
### parseDiagnostics (32:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>format:DiagnosticFormat</code>: supplied by the caller; usage is shown in the steps below.
- <code>stdout:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>checkId:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L33](#l33) <code>parsed:unknown</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(stdout)</code>.
- [L34](#l34) <code>candidates:Omit&lt;Diagnostic,'id'&gt;[]</code>: test <code>format==='eslint-json'</code>; choose <code>eslintSchema.parse(parsed).flatMap(file=&gt;file.messages.filter(message=&gt;message.severity!==0).map(message=&gt;({ tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const, message:message.message,path…</code> when truthy, otherwise <code>ruffSchema.parse(parsed).map(message=&gt;({tool:'ruff' as const,ruleId:message.code,severity:'error' as const, message:message.message,path:sourcePath(root,message.filename), ...(message.filename!==null &amp;&amp; message.location?{line:message.location.row,column:mes…</code>.
- [L44](#l44) <code>unique</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L45](#l45) <code>diagnostic</code>: receive the next iterable value from <code>candidates</code> at the start of each loop iteration.
- [L46](#l46) <code>id</code>: use the literal <code>&#96;check/${checkId}:${createHash('sha256').update(JSON.stringify(diagnostic)).digest('hex').slice(0,20)}&#96;</code>.

Execution:

- [L33](#l33) Bind <code>parsed:unknown</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(stdout)</code>.
- [L34](#l34) Bind <code>candidates:Omit&lt;Diagnostic,'id'&gt;[]</code>: test <code>format==='eslint-json'</code>; choose <code>eslintSchema.parse(parsed).flatMap(file=&gt;file.messages.filter(message=&gt;message.severity!==0).map(message=&gt;({ tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const, message:message.message,path…</code> when truthy, otherwise <code>ruffSchema.parse(parsed).map(message=&gt;({tool:'ruff' as const,ruleId:message.code,severity:'error' as const, message:message.message,path:sourcePath(root,message.filename), ...(message.filename!==null &amp;&amp; message.location?{line:message.location.row,column:mes…</code>.
- [L44](#l44) Bind <code>unique</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L45](#l45) Iterate <code>candidates</code> values, binding <code>const diagnostic</code> for each iteration:
  - [L46](#l46) Bind <code>id</code>: use the literal <code>&#96;check/${checkId}:${createHash('sha256').update(JSON.stringify(diagnostic)).digest('hex').slice(0,20)}&#96;</code>.
  - [L47](#l47) store/replace a keyed entry in the Map: <code>unique.set(id,{id,...diagnostic})</code>.
- [L49](#l49) Return to the caller: sort the receiver array in place using the comparator: <code>[...unique.values()].sort((a,b)=&gt;a.id.localeCompare(b.id))</code>.

<a id="fn-2124"></a>
### eslintSchema.parse(parsed).flatMap callback (35:42)

Synchronous function. Lexically inside [parseDiagnostics (32:8)](#fn-1867). Passed to <code>eslintSchema.parse(parsed).flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L35](#l35) Implicitly return: transform each element into a new array: <code>file.messages.filter(message=&gt;message.severity!==0).map(message=&gt;({ tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const, message:message.message,path:sourcePath(root,file.filePath), ...(mess…</code>.

<a id="fn-2151"></a>
### file.messages.filter callback (35:69)

Synchronous function. Lexically inside [eslintSchema.parse(parsed).flatMap callback (35:42)](#fn-2124). Passed to <code>file.messages.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>message</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L35](#l35) Implicitly return: compute <code>message.severity!==0</code> with the <code>!==</code> operator.

<a id="fn-2186"></a>
### file.messages.filter(message=&gt;message.severity!==0).map callback (35:104)

Synchronous function. Lexically inside [eslintSchema.parse(parsed).flatMap callback (35:42)](#fn-2124). Passed to <code>file.messages.filter(message=&gt;message.severity!==0).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>message</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L35](#l35) Implicitly return: create an object with 8 property/spread entries: <code>{ tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const, message:message.message,path:sourcePath(root,file.filePath), ...(message.line?{line:message.line}:{}),...(message.column?{column:messag…</code>; later properties overwrite earlier spread values.

<a id="fn-2562"></a>
### ruffSchema.parse(parsed).map callback (40:36)

Synchronous function. Lexically inside [parseDiagnostics (32:8)](#fn-1867). Passed to <code>ruffSchema.parse(parsed).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>message</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: create an object with 7 property/spread entries: <code>{tool:'ruff' as const,ruleId:message.code,severity:'error' as const, message:message.message,path:sourcePath(root,message.filename), ...(message.filename!==null &amp;&amp; message.location?{line:message.location.row,column:message.location.column}:{}),origin:'exter…</code>; later properties overwrite earlier spread values.

<a id="fn-3151"></a>
### [...unique.values()].sort callback (49:36)

Synchronous function. Lexically inside [parseDiagnostics (32:8)](#fn-1867). Passed to <code>[...unique.values()].sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L49](#l49) Implicitly return: call the named operation with the supplied arguments: <code>a.id.localeCompare(b.id)</code>.

<a id="fn-3195"></a>
### exceedsThreshold (52:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>diagnostics:Diagnostic[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>threshold:'error'&#124;'warning'&#124;'info'&#124;'never'</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L53](#l53) <code>rank</code>: create an object with 4 property/spread entries: <code>{error:3,warning:2,info:1,never:4}</code>; later properties overwrite earlier spread values.

Execution:

- [L53](#l53) Bind <code>rank</code>: create an object with 4 property/spread entries: <code>{error:3,warning:2,info:1,never:4}</code>; later properties overwrite earlier spread values.
- [L54](#l54) Return to the caller: stop at the first truthy callback result, returning whether any matched: <code>diagnostics.some(diagnostic=&gt;rank[diagnostic.severity]&gt;=rank[threshold])</code>.

<a id="fn-3367"></a>
### diagnostics.some callback (54:27)

Synchronous function. Lexically inside [exceedsThreshold (52:8)](#fn-3195). Passed to <code>diagnostics.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>diagnostic</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L54](#l54) Implicitly return: compute <code>rank[diagnostic.severity]&gt;=rank[threshold]</code> with the <code>&gt;=</code> operator.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>diagnosticSchema</code> | <code>id</code> | <code>z.string()</code> | [L6](#l6) |
| <code>diagnosticSchema</code> | <code>tool</code> | <code>z.enum(['eslint','ruff'])</code> | [L6](#l6) |
| <code>diagnosticSchema</code> | <code>ruleId</code> | <code>z.string().nullable()</code> | [L6](#l6) |
| <code>diagnosticSchema</code> | <code>severity</code> | <code>z.enum(['error','warning','info'])</code> | [L7](#l7) |
| <code>diagnosticSchema</code> | <code>message</code> | <code>z.string()</code> | [L7](#l7) |
| <code>diagnosticSchema</code> | <code>path</code> | <code>z.string().nullable()</code> | [L8](#l8) |
| <code>diagnosticSchema</code> | <code>line</code> | <code>z.number().int().positive().optional()</code> | [L8](#l8) |
| <code>diagnosticSchema</code> | <code>column</code> | <code>z.number().int().positive().optional()</code> | [L8](#l8) |
| <code>diagnosticSchema</code> | <code>origin</code> | <code>z.literal('external-tool')</code> | [L9](#l9) |
| <code>location</code> | <code>row</code> | <code>z.number().int().positive()</code> | [L13](#l13) |
| <code>location</code> | <code>column</code> | <code>z.number().int().positive()</code> | [L13](#l13) |
| <code>eslintSchema</code> | <code>filePath</code> | <code>z.string().min(1)</code> | [L14](#l14) |
| <code>eslintSchema</code> | <code>messages</code> | <code>z.array(z.object({ ruleId:z.string().nullable().optional(),severity:z.number().int().min(0).max(2),message:z.string().min(1), line:z.number().int().positive().optional(),column:z.number().int().positive().optional(), })).max(10000)</code> | [L14](#l14) |
| <code>eslintSchema</code> | <code>messages.ruleId</code> | <code>z.string().nullable().optional()</code> | [L15](#l15) |
| <code>eslintSchema</code> | <code>messages.severity</code> | <code>z.number().int().min(0).max(2)</code> | [L15](#l15) |
| <code>eslintSchema</code> | <code>messages.message</code> | <code>z.string().min(1)</code> | [L15](#l15) |
| <code>eslintSchema</code> | <code>messages.line</code> | <code>z.number().int().positive().optional()</code> | [L16](#l16) |
| <code>eslintSchema</code> | <code>messages.column</code> | <code>z.number().int().positive().optional()</code> | [L16](#l16) |
| <code>ruffSchema</code> | <code>filename</code> | <code>z.string().nullable()</code> | [L18](#l18) |
| <code>ruffSchema</code> | <code>code</code> | <code>z.string().nullable()</code> | [L18](#l18) |
| <code>ruffSchema</code> | <code>message</code> | <code>z.string().min(1)</code> | [L18](#l18) |
| <code>ruffSchema</code> | <code>location</code> | <code>location.nullable()</code> | [L19](#l19) |

## Compile-time data contracts

### Diagnostic

```typescript
type Diagnostic=z.infer<typeof diagnosticSchema>;
```

Declared at [L11](#l11). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### DiagnosticFormat

```typescript
type DiagnosticFormat='eslint-json'|'ruff-json';
```

Declared at [L12](#l12). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L5](#l5) <code>diagnosticSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),tool:z.enum(['eslint','ruff']),ruleId:z.string().nullable(), severity:z.enum(['error','warning','info']),message:z.string(), path:z.string().nullable(),line:z.number().int().positive().optional(),column:z.number().int().positive().o…</code>.
- [L13](#l13) <code>location</code>: call the named operation with the supplied arguments: <code>z.object({row:z.number().int().positive(),column:z.number().int().positive()})</code>.
- [L14](#l14) <code>eslintSchema</code>: call the named operation with the supplied arguments: <code>z.array(z.object({filePath:z.string().min(1),messages:z.array(z.object({ ruleId:z.string().nullable().optional(),severity:z.number().int().min(0).max(2),message:z.string().min(1), line:z.number().int().positive().optional(),column:z.number().int().positive(…</code>.
- [L18](#l18) <code>ruffSchema</code>: call the named operation with the supplied arguments: <code>z.array(z.object({filename:z.string().nullable(),code:z.string().nullable(),message:z.string().min(1), location:location.nullable(), })).max(10000)</code>.

## Directly importing tests

- [check-diagnostics.test.ts](../../test/check-diagnostics.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
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
   1 | import {createHash} from 'node:crypto';
   2 | import {isAbsolute,relative,resolve} from 'node:path';
   3 | import {z} from 'zod';
   4 | 
   5 | export const diagnosticSchema=z.object({
   6 |   id:z.string(),tool:z.enum(['eslint','ruff']),ruleId:z.string().nullable(),
   7 |   severity:z.enum(['error','warning','info']),message:z.string(),
   8 |   path:z.string().nullable(),line:z.number().int().positive().optional(),column:z.number().int().positive().optional(),
   9 |   origin:z.literal('external-tool'),
  10 | });
  11 | export type Diagnostic=z.infer<typeof diagnosticSchema>;
  12 | export type DiagnosticFormat='eslint-json'|'ruff-json';
  13 | const location=z.object({row:z.number().int().positive(),column:z.number().int().positive()});
  14 | const eslintSchema=z.array(z.object({filePath:z.string().min(1),messages:z.array(z.object({
  15 |   ruleId:z.string().nullable().optional(),severity:z.number().int().min(0).max(2),message:z.string().min(1),
  16 |   line:z.number().int().positive().optional(),column:z.number().int().positive().optional(),
  17 | })).max(10000)})).max(10000);
  18 | const ruffSchema=z.array(z.object({filename:z.string().nullable(),code:z.string().nullable(),message:z.string().min(1),
  19 |   location:location.nullable(),
  20 | })).max(10000);
```

<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l40"></a>

```text
  21 | 
  22 | function sourcePath(root:string,path:string|null):string|null {
  23 |   if(path===null)return null;
  24 |   if(!path || /[\u0000-\u001f]/.test(path))throw new Error('Invalid diagnostic path.');
  25 |   if(!isAbsolute(path) && /^[A-Za-z]:/.test(path))throw new Error('Unsupported absolute diagnostic path.');
  26 |   const normalized=relative(resolve(root),resolve(root,path.replace(/\\/g,'/')));
  27 |   if(!normalized || normalized==='..' || normalized.startsWith('../') || normalized.startsWith('..\\') || isAbsolute(normalized))
  28 |     throw new Error('Diagnostic path is outside the repository.');
  29 |   return normalized.replace(/\\/g,'/');
  30 | }
  31 | /** Normalize tool claims only; no source read, fixes, or citation verification. */
  32 | export function parseDiagnostics(format:DiagnosticFormat,stdout:string,root:string,checkId:string):Diagnostic[] {
  33 |   const parsed:unknown=JSON.parse(stdout);
  34 |   const candidates:Omit<Diagnostic,'id'>[]=format==='eslint-json'
  35 |     ? eslintSchema.parse(parsed).flatMap(file=>file.messages.filter(message=>message.severity!==0).map(message=>({
  36 |       tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const,
  37 |       message:message.message,path:sourcePath(root,file.filePath),
  38 |       ...(message.line?{line:message.line}:{}),...(message.column?{column:message.column}:{}),origin:'external-tool' as const,
  39 |     })))
  40 |     : ruffSchema.parse(parsed).map(message=>({tool:'ruff' as const,ruleId:message.code,severity:'error' as const,
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l49"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>

```text
  41 |       message:message.message,path:sourcePath(root,message.filename),
  42 |       ...(message.filename!==null && message.location?{line:message.location.row,column:message.location.column}:{}),origin:'external-tool' as const,
  43 |     }));
  44 |   const unique=new Map<string,Diagnostic>();
  45 |   for(const diagnostic of candidates) {
  46 |     const id=`check/${checkId}:${createHash('sha256').update(JSON.stringify(diagnostic)).digest('hex').slice(0,20)}`;
  47 |     unique.set(id,{id,...diagnostic});
  48 |   }
  49 |   return [...unique.values()].sort((a,b)=>a.id.localeCompare(b.id));
  50 | }
  51 | 
  52 | export function exceedsThreshold(diagnostics:Diagnostic[],threshold:'error'|'warning'|'info'|'never') {
  53 |   const rank={error:3,warning:2,info:1,never:4};
  54 |   return diagnostics.some(diagnostic=>rank[diagnostic.severity]>=rank[threshold]);
  55 | }
  56 | 
```
