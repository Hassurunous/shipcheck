# src/openapi-contract.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

indexOpenApi is a pure operation index, not a full OpenAPI validator. It decodes JSON, accepts supported 3.0/3.1 version strings, verifies minimal info/paths structure and iterates sorted direct operations. JSON Pointer escaping preserves provider locations. Unresolved Path Item references, duplicate operation IDs, malformed entries or webhooks produce explicit partial coverage.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `8d5e177410d4253e9e4797231dbe363101718a6b073211e59025578be5efc573`.

This chapter inventories **4 function bodies/callbacks**, **15 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>./reference-resources.js</code>: <code>ResourceSnapshot</code> (type only).

## Module execution

- [L4](#l4) Bind <code>methods</code>: create an array from <code>['get','put','post','delete','options','head','patch','trace']</code>; spread elements insert the iterable values; the TypeScript assertion adds no runtime validation.
- [L5](#l5) Bind <code>object</code>: create [object (5:14)](#fn-188); its body runs when called, not when this value is created.
- [L6](#l6) Bind <code>pointer</code>: create [pointer (6:15)](#fn-317); its body runs when called, not when this value is created.
- [L7](#l7) Bind <code>openApiIndexSchema</code>: call the named operation with the supplied arguments: <code>z.object({ resourceId:z.string(),snapshotSha256:z.string().nullable(), status:z.enum(['indexed','partial','unsupported','invalid','unavailable']), specificationVersion:z.string().optional(),apiVersion:z.string().optional(), operations:z.array(z.object({meth…</code>.

## Function index

- [object (5:14)](#fn-188)
- [pointer (6:15)](#fn-317)
- [indexOpenApi (18:8)](#fn-1045)
- [issue (21:15)](#fn-1294)

<a id="fn-188"></a>
### object (5:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>value:unknown</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L5](#l5) Implicitly return: evaluate <code>typeof value==='object' &amp;&amp; value!==null &amp;&amp; !Array.isArray(value)</code> left to right with falsy short-circuiting.

<a id="fn-317"></a>
### pointer (6:15)

Synchronous function. Defined in module scope. 

Parameters:

- <code>value:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L6](#l6) Implicitly return: produce a string with matching text replaced: <code>value.replace(/~/g,'~0').replace(/\//g,'~1')</code>.

<a id="fn-1045"></a>
### indexOpenApi (18:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>snapshot:ResourceSnapshot</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L19](#l19) <code>result:OpenApiIndex</code>: create an object with 6 property/spread entries: <code>{resourceId:snapshot.record.id,snapshotSha256:snapshot.record.sha256, status:'indexed',operations:[],issues:[],assessment:'not-compared'}</code>; later properties overwrite earlier spread values.
- [L21](#l21) <code>issue</code>: create [issue (21:15)](#fn-1294); its body runs when called, not when this value is created.
- [L25](#l25) <code>document:unknown</code>: leave the value undefined until a later assignment.
- [L44](#l44) <code>ids</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L45](#l45) <code>path</code>: receive the next iterable value from <code>Object.keys(document.paths).sort()</code> at the start of each loop iteration.
- [L47](#l47) <code>at</code>: use the literal <code>&#96;/paths/${pointer(path)}&#96;</code>.
- [L47](#l47) <code>item</code>: read <code>document.paths[path]</code>.
- [L50](#l50) <code>method</code>: receive the next iterable value from <code>methods</code> at the start of each loop iteration.
- [L52](#l52) <code>operation</code>: read <code>item[method]</code>.
- [L52](#l52) <code>opPointer</code>: use the literal <code>&#96;${at}/${method}&#96;</code>.
- [L55](#l55) <code>operationId</code>: read <code>operation.operationId</code>; the TypeScript assertion adds no runtime validation.

Execution:

- [L19](#l19) Bind <code>result:OpenApiIndex</code>: create an object with 6 property/spread entries: <code>{resourceId:snapshot.record.id,snapshotSha256:snapshot.record.sha256, status:'indexed',operations:[],issues:[],assessment:'not-compared'}</code>; later properties overwrite earlier spread values.
- [L21](#l21) Bind <code>issue</code>: create [issue (21:15)](#fn-1294); its body runs when called, not when this value is created.
- [L22](#l22) If <code>snapshot.record.status!=='loaded' &#124;&#124; snapshot.record.kind!=='openapi'</code> is truthy:
  - [L23](#l23) update <code>result.status</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L23](#l23) call the named operation with the supplied arguments: <code>issue('','A loaded OpenAPI resource is required.')</code>.
  - [L23](#l23) Return to the caller: evaluate <code>result</code>.
- [L25](#l25) Bind <code>document:unknown</code>: leave the value undefined until a later assignment.
- [L26](#l26) Run the protected block:
  - [L26](#l26) update <code>document</code> with <code>JSON.parse(snapshot.content)</code> using <code>=</code>; this mutation is visible to later statements.
- [L26](#l26) If it throws:
  - [L27](#l27) update <code>result.status</code> with <code>'unsupported'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L27](#l27) call the named operation with the supplied arguments: <code>issue('','Only JSON documents are supported; YAML or malformed JSON cannot be indexed.')</code>.
  - [L27](#l27) Return to the caller: evaluate <code>result</code>.
- [L29](#l29) If <code>!object(document) &#124;&#124; typeof document.openapi!=='string'</code> is truthy:
  - [L30](#l30) update <code>result.status</code> with <code>'invalid'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L30](#l30) call the named operation with the supplied arguments: <code>issue('/openapi','Expected an OpenAPI version string.')</code>.
  - [L30](#l30) Return to the caller: evaluate <code>result</code>.
- [L32](#l32) update <code>result.specificationVersion</code> with <code>document.openapi</code> using <code>=</code>; this mutation is visible to later statements.
- [L33](#l33) If <code>!/^3\.(0&#124;1)\.\d+$/.test(document.openapi)</code> is truthy:
  - [L34](#l34) update <code>result.status</code> with <code>'unsupported'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L34](#l34) call the named operation with the supplied arguments: <code>issue('/openapi','Only OpenAPI 3.0.x and 3.1.x operation indexing is supported.')</code>.
  - [L34](#l34) Return to the caller: evaluate <code>result</code>.
- [L36](#l36) If <code>!object(document.info) &#124;&#124; typeof document.info.version!=='string' &#124;&#124; typeof document.info.title!=='string'</code> is truthy:
  - [L37](#l37) update <code>result.status</code> with <code>'invalid'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L37](#l37) call the named operation with the supplied arguments: <code>issue('/info','Expected info.title and info.version strings.')</code>.
  - [L37](#l37) Return to the caller: evaluate <code>result</code>.
- [L39](#l39) update <code>result.apiVersion</code> with <code>document.info.version</code> using <code>=</code>; this mutation is visible to later statements.
- [L40](#l40) If <code>document.paths===undefined &amp;&amp; document.openapi.startsWith('3.1.')</code> is truthy:
  - [L41](#l41) update <code>result.status</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L41](#l41) call the named operation with the supplied arguments: <code>issue('/paths','No paths supplied; webhooks and component-only documents are not indexed.')</code>.
  - [L41](#l41) Return to the caller: evaluate <code>result</code>.
- [L43](#l43) If <code>!object(document.paths)</code> is truthy:
  - [L43](#l43) update <code>result.status</code> with <code>'invalid'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L43](#l43) call the named operation with the supplied arguments: <code>issue('/paths','Expected a paths object.')</code>.
  - [L43](#l43) Return to the caller: evaluate <code>result</code>.
- [L44](#l44) Bind <code>ids</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L45](#l45) Iterate <code>Object.keys(document.paths).sort()</code> values, binding <code>const path</code> for each iteration:
  - [L46](#l46) If <code>path.startsWith('x-')</code> is truthy:
    - [L46](#l46) Skip the rest of this iteration and advance the enclosing loop.
  - [L47](#l47) Bind <code>at</code>: use the literal <code>&#96;/paths/${pointer(path)}&#96;</code>.
  - [L47](#l47) Bind <code>item</code>: read <code>document.paths[path]</code>.
  - [L48](#l48) If <code>!path.startsWith('/') &#124;&#124; !object(item)</code> is truthy:
    - [L48](#l48) call the named operation with the supplied arguments: <code>issue(at,'Expected a slash-prefixed path and a Path Item object.')</code>.
    - [L48](#l48) Skip the rest of this iteration and advance the enclosing loop.
  - [L49](#l49) If <code>Object.hasOwn(item,'$ref')</code> is truthy:
    - [L49](#l49) call the named operation with the supplied arguments: <code>issue(at,'Referenced Path Items are not resolved; this entire Path Item is skipped.')</code>.
    - [L49](#l49) Skip the rest of this iteration and advance the enclosing loop.
  - [L50](#l50) Iterate <code>methods</code> values, binding <code>const method</code> for each iteration:
    - [L51](#l51) If <code>!Object.hasOwn(item,method)</code> is truthy:
      - [L51](#l51) Skip the rest of this iteration and advance the enclosing loop.
    - [L52](#l52) Bind <code>operation</code>: read <code>item[method]</code>.
    - [L52](#l52) Bind <code>opPointer</code>: use the literal <code>&#96;${at}/${method}&#96;</code>.
    - [L53](#l53) If <code>!object(operation)</code> is truthy:
      - [L53](#l53) call the named operation with the supplied arguments: <code>issue(opPointer,'Expected an Operation object.')</code>.
      - [L53](#l53) Skip the rest of this iteration and advance the enclosing loop.
    - [L54](#l54) If <code>operation.operationId!==undefined &amp;&amp; typeof operation.operationId!=='string'</code> is truthy:
      - [L54](#l54) call the named operation with the supplied arguments: <code>issue(opPointer,'Expected a string operationId.')</code>.
      - [L54](#l54) Skip the rest of this iteration and advance the enclosing loop.
    - [L55](#l55) Bind <code>operationId</code>: read <code>operation.operationId</code>; the TypeScript assertion adds no runtime validation.
    - [L56](#l56) If <code>operationId!==undefined</code> is truthy:
      - [L57](#l57) If <code>ids.has(operationId)</code> is truthy:
        - [L57](#l57) call the named operation with the supplied arguments: <code>issue(&#96;${opPointer}/operationId&#96;,'Duplicate operationId; identity is ambiguous.')</code>.
      - [L58](#l58) insert a unique value in the Set: <code>ids.add(operationId)</code>.
    - [L60](#l60) append values to the existing array: <code>result.operations.push({method,path,pointer:opPointer,...(operationId!==undefined?{operationId}:{})})</code>.
- [L63](#l63) If <code>document.webhooks!==undefined</code> is truthy:
  - [L63](#l63) call the named operation with the supplied arguments: <code>issue('/webhooks','Webhook operations are not indexed.')</code>.
- [L64](#l64) If <code>result.issues.length</code> is truthy:
  - [L64](#l64) update <code>result.status</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
- [L65](#l65) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>openApiIndexSchema.parse(result)</code>.

<a id="fn-1294"></a>
### issue (21:15)

Synchronous function. Lexically inside [indexOpenApi (18:8)](#fn-1045). 

Parameters:

- <code>at:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>reason:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L21](#l21) Implicitly return: append values to the existing array: <code>result.issues.push({pointer:at,reason})</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>openApiIndexSchema</code> | <code>resourceId</code> | <code>z.string()</code> | [L8](#l8) |
| <code>openApiIndexSchema</code> | <code>snapshotSha256</code> | <code>z.string().nullable()</code> | [L8](#l8) |
| <code>openApiIndexSchema</code> | <code>status</code> | <code>z.enum(['indexed','partial','unsupported','invalid','unavailable'])</code> | [L9](#l9) |
| <code>openApiIndexSchema</code> | <code>specificationVersion</code> | <code>z.string().optional()</code> | [L10](#l10) |
| <code>openApiIndexSchema</code> | <code>apiVersion</code> | <code>z.string().optional()</code> | [L10](#l10) |
| <code>openApiIndexSchema</code> | <code>operations</code> | <code>z.array(z.object({method:z.enum(methods),path:z.string(),pointer:z.string(),operationId:z.string().optional()}))</code> | [L11](#l11) |
| <code>openApiIndexSchema</code> | <code>operations.method</code> | <code>z.enum(methods)</code> | [L11](#l11) |
| <code>openApiIndexSchema</code> | <code>operations.path</code> | <code>z.string()</code> | [L11](#l11) |
| <code>openApiIndexSchema</code> | <code>operations.pointer</code> | <code>z.string()</code> | [L11](#l11) |
| <code>openApiIndexSchema</code> | <code>operations.operationId</code> | <code>z.string().optional()</code> | [L11](#l11) |
| <code>openApiIndexSchema</code> | <code>issues</code> | <code>z.array(z.object({pointer:z.string(),reason:z.string()}))</code> | [L12](#l12) |
| <code>openApiIndexSchema</code> | <code>issues.pointer</code> | <code>z.string()</code> | [L12](#l12) |
| <code>openApiIndexSchema</code> | <code>issues.reason</code> | <code>z.string()</code> | [L12](#l12) |
| <code>openApiIndexSchema</code> | <code>assessment</code> | <code>z.literal('not-compared')</code> | [L13](#l13) |

## Compile-time data contracts

### OpenApiIndex

```typescript
type OpenApiIndex=z.infer<typeof openApiIndexSchema>;
```

Declared at [L15](#l15). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L4](#l4) <code>methods</code>: create an array from <code>['get','put','post','delete','options','head','patch','trace']</code>; spread elements insert the iterable values; the TypeScript assertion adds no runtime validation.
- [L5](#l5) <code>object</code>: create [object (5:14)](#fn-188); its body runs when called, not when this value is created.
- [L6](#l6) <code>pointer</code>: create [pointer (6:15)](#fn-317); its body runs when called, not when this value is created.
- [L7](#l7) <code>openApiIndexSchema</code>: call the named operation with the supplied arguments: <code>z.object({ resourceId:z.string(),snapshotSha256:z.string().nullable(), status:z.enum(['indexed','partial','unsupported','invalid','unavailable']), specificationVersion:z.string().optional(),apiVersion:z.string().optional(), operations:z.array(z.object({meth…</code>.

## Directly importing tests

- [openapi-contract.test.ts](../../test/openapi-contract.test.ts)

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
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l15"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {z} from 'zod';
   2 | import type {ResourceSnapshot} from './reference-resources.js';
   3 | 
   4 | const methods=['get','put','post','delete','options','head','patch','trace'] as const;
   5 | const object=(value:unknown):value is Record<string,unknown>=>typeof value==='object' && value!==null && !Array.isArray(value);
   6 | const pointer=(value:string)=>value.replace(/~/g,'~0').replace(/\//g,'~1');
   7 | export const openApiIndexSchema=z.object({
   8 |   resourceId:z.string(),snapshotSha256:z.string().nullable(),
   9 |   status:z.enum(['indexed','partial','unsupported','invalid','unavailable']),
  10 |   specificationVersion:z.string().optional(),apiVersion:z.string().optional(),
  11 |   operations:z.array(z.object({method:z.enum(methods),path:z.string(),pointer:z.string(),operationId:z.string().optional()})),
  12 |   issues:z.array(z.object({pointer:z.string(),reason:z.string()})),
  13 |   assessment:z.literal('not-compared'),
  14 | });
  15 | export type OpenApiIndex=z.infer<typeof openApiIndexSchema>;
  16 | 
  17 | /** Index direct OpenAPI operations only. No I/O, reference resolution or schema validation. */
  18 | export function indexOpenApi(snapshot:ResourceSnapshot):OpenApiIndex {
  19 |   const result:OpenApiIndex={resourceId:snapshot.record.id,snapshotSha256:snapshot.record.sha256,
  20 |     status:'indexed',operations:[],issues:[],assessment:'not-compared'};
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   const issue=(at:string,reason:string)=>result.issues.push({pointer:at,reason});
  22 |   if(snapshot.record.status!=='loaded' || snapshot.record.kind!=='openapi') {
  23 |     result.status='unavailable';issue('','A loaded OpenAPI resource is required.');return result;
  24 |   }
  25 |   let document:unknown;
  26 |   try{document=JSON.parse(snapshot.content);}catch{
  27 |     result.status='unsupported';issue('','Only JSON documents are supported; YAML or malformed JSON cannot be indexed.');return result;
  28 |   }
  29 |   if(!object(document) || typeof document.openapi!=='string') {
  30 |     result.status='invalid';issue('/openapi','Expected an OpenAPI version string.');return result;
  31 |   }
  32 |   result.specificationVersion=document.openapi;
  33 |   if(!/^3\.(0|1)\.\d+$/.test(document.openapi)) {
  34 |     result.status='unsupported';issue('/openapi','Only OpenAPI 3.0.x and 3.1.x operation indexing is supported.');return result;
  35 |   }
  36 |   if(!object(document.info) || typeof document.info.version!=='string' || typeof document.info.title!=='string') {
  37 |     result.status='invalid';issue('/info','Expected info.title and info.version strings.');return result;
  38 |   }
  39 |   result.apiVersion=document.info.version;
  40 |   if(document.paths===undefined && document.openapi.startsWith('3.1.')) {
```

<a id="l41"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l60"></a>

```text
  41 |     result.status='partial';issue('/paths','No paths supplied; webhooks and component-only documents are not indexed.');return result;
  42 |   }
  43 |   if(!object(document.paths)) {result.status='invalid';issue('/paths','Expected a paths object.');return result;}
  44 |   const ids=new Set<string>();
  45 |   for(const path of Object.keys(document.paths).sort()) {
  46 |     if(path.startsWith('x-'))continue;
  47 |     const at=`/paths/${pointer(path)}`;const item=document.paths[path];
  48 |     if(!path.startsWith('/') || !object(item)) {issue(at,'Expected a slash-prefixed path and a Path Item object.');continue;}
  49 |     if(Object.hasOwn(item,'$ref')) {issue(at,'Referenced Path Items are not resolved; this entire Path Item is skipped.');continue;}
  50 |     for(const method of methods) {
  51 |       if(!Object.hasOwn(item,method))continue;
  52 |       const operation=item[method];const opPointer=`${at}/${method}`;
  53 |       if(!object(operation)) {issue(opPointer,'Expected an Operation object.');continue;}
  54 |       if(operation.operationId!==undefined && typeof operation.operationId!=='string') {issue(opPointer,'Expected a string operationId.');continue;}
  55 |       const operationId=operation.operationId as string|undefined;
  56 |       if(operationId!==undefined) {
  57 |         if(ids.has(operationId))issue(`${opPointer}/operationId`,'Duplicate operationId; identity is ambiguous.');
  58 |         ids.add(operationId);
  59 |       }
  60 |       result.operations.push({method,path,pointer:opPointer,...(operationId!==undefined?{operationId}:{})});
```

<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>

```text
  61 |     }
  62 |   }
  63 |   if(document.webhooks!==undefined)issue('/webhooks','Webhook operations are not indexed.');
  64 |   if(result.issues.length)result.status='partial';
  65 |   return openApiIndexSchema.parse(result);
  66 | }
  67 | 
```
