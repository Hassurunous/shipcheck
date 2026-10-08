# src/ai/live.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The only production model endpoint is fixed in this module. post sends bounded, abortable HTTP with redirects rejected and no retry. Live functions validate credentials/model/output policy, hash the exact payload, reserve durable budget, count input tokens, generate, validate usage/tier and decode the structured result. Reservations wrap both network calls, so even a failed count can leave an unresolved durable attempt.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `816aafd602d741921857296ea519ddb63db6a62dc9c237d30dd55dc3e5748089`.

This chapter inventories **8 function bodies/callbacks**, **28 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:crypto</code>: <code>createHash</code>.
- <code>zod</code>: <code>z</code>.
- <code>./client.js</code>: <code>AiFailure</code>, <code>decodeResponse</code>, <code>QaRequest</code> (type only).
- <code>./context.js</code>: <code>AiContext</code> (type only).
- <code>./contracts.js</code>: <code>AiMode</code> (type only).
- <code>./trial-budget.js</code>: <code>INPUT_LIMIT</code>, <code>OUTPUT_LIMIT</code>, <code>TRIAL_MODELS</code>, <code>usageSchema</code>, <code>usageMicroUsd</code>, <code>reservationMicroUsd</code>, <code>withTrialReservation</code>.
- <code>./audit-budget.js</code>: <code>AUDIT_MODELS</code>, <code>auditUsageMicroUsd</code>, <code>AUDIT_INPUT_LIMIT</code>, <code>AUDIT_OUTPUT_LIMIT</code>, <code>auditUsageSchema</code>, <code>auditReservationMicroUsd</code>, <code>withAuditReservation</code>.

## Module execution

- [L9](#l9) Bind <code>ORIGIN</code>: use the literal <code>'https://api.openai.com/v1/responses'</code>.

## Function index

- [post (13:1)](#fn-778)
- [operation (16:21)](#fn-1006)
- [Promise callback (40:63)](#fn-2233)
- [setTimeout callback (41:26)](#fn-2273)
- [requestLiveQa (49:8)](#fn-2648)
- [withTrialReservation callback (56:41)](#fn-3453)
- [requestBudgetQa (75:8)](#fn-4932)
- [withAuditReservation callback (84:48)](#fn-5935)

<a id="fn-778"></a>
### post (13:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>url: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>payload: unknown</code>: supplied by the caller; usage is shown in the steps below.
- <code>apiKey: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>timeoutMs: number</code>: supplied by the caller; usage is shown in the steps below.
- <code>send: typeof fetch</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L14](#l14) <code>controller</code>: construct <code>AbortController</code> using <code></code>; this creates the local instance used below.
- [L15](#l15) <code>timer: ReturnType&lt;typeof setTimeout&gt; &#124; undefined</code>: leave the value undefined until a later assignment.
- [L16](#l16) <code>operation</code>: create [operation (16:21)](#fn-1006); its body runs when called, not when this value is created.

Execution:

- [L14](#l14) Bind <code>controller</code>: construct <code>AbortController</code> using <code></code>; this creates the local instance used below.
- [L15](#l15) Bind <code>timer: ReturnType&lt;typeof setTimeout&gt; &#124; undefined</code>: leave the value undefined until a later assignment.
- [L16](#l16) Bind <code>operation</code>: create [operation (16:21)](#fn-1006); its body runs when called, not when this value is created.
- [L39](#l39) Run the protected block:
  - [L40](#l40) Return to the caller: wait for <code>Promise.race([operation(),new Promise&lt;never&gt;((_,reject)=&gt; { timer = setTimeout(()=&gt; { controller.abort(); reject(new AiFailure('timeout','OpenAI request timed out; reservation retained, no retry.')); },timeoutMs); })])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L39](#l39) If it throws, bind <code>error</code>:
  - [L44](#l44) If <code>error instanceof AiFailure</code> is truthy:
    - [L44](#l44) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
  - [L45](#l45) Throw <code>new AiFailure('transport-error','OpenAI transport failed; reservation retained, no retry.')</code>; normal execution stops until an enclosing catch handles it.
- [L39](#l39) Always run cleanup on leaving the try/catch, including return or throw:
  - [L46](#l46) If <code>timer</code> is truthy:
    - [L46](#l46) call the named operation with the supplied arguments: <code>clearTimeout(timer)</code>.

<a id="fn-1006"></a>
### operation (16:21)

Asynchronous function: returns a Promise. Lexically inside [post (13:1)](#fn-778). 

Local bindings (nested callback locals are documented with that callback):

- [L17](#l17) <code>response</code>: wait for <code>send(url,{method:'POST',redirect:'error',signal:controller.signal, headers:{Authorization:&#96;Bearer ${apiKey}&#96;,'Content-Type':'application/json'},body:JSON.stringify(payload)})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L21](#l21) <code>code</code>: test <code>response.status === 401 &#124;&#124; response.status === 403</code>; choose <code>'authentication'</code> when truthy, otherwise <code>response.status === 429 ? 'rate-limit' : 'provider-error'</code>.
- [L25](#l25) <code>reader</code>: call the named operation with the supplied arguments: <code>response.body.getReader()</code>.
- [L26](#l26) <code>chunks: Uint8Array[]</code>: create a new empty array to accumulate ordered results.
- [L27](#l27) <code>size</code>: use the literal <code>0</code>.
- [L30](#l30) <code>{done,value}</code>: wait for <code>reader.read()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.

Execution:

- [L17](#l17) Bind <code>response</code>: wait for <code>send(url,{method:'POST',redirect:'error',signal:controller.signal, headers:{Authorization:&#96;Bearer ${apiKey}&#96;,'Content-Type':'application/json'},body:JSON.stringify(payload)})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L19](#l19) If <code>!response.ok</code> is truthy:
  - [L20](#l20) wait for <code>response.body?.cancel()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L21](#l21) Bind <code>code</code>: test <code>response.status === 401 &#124;&#124; response.status === 403</code>; choose <code>'authentication'</code> when truthy, otherwise <code>response.status === 429 ? 'rate-limit' : 'provider-error'</code>.
  - [L22](#l22) Throw <code>new AiFailure(code,&#96;OpenAI request failed (HTTP ${response.status}); no retry was attempted.&#96;)</code>; normal execution stops until an enclosing catch handles it.
- [L24](#l24) If <code>!response.body</code> is truthy:
  - [L24](#l24) Throw <code>new AiFailure('invalid-response','OpenAI returned no response body.')</code>; normal execution stops until an enclosing catch handles it.
- [L25](#l25) Bind <code>reader</code>: call the named operation with the supplied arguments: <code>response.body.getReader()</code>.
- [L26](#l26) Bind <code>chunks: Uint8Array[]</code>: create a new empty array to accumulate ordered results.
- [L27](#l27) Bind <code>size</code>: use the literal <code>0</code>.
- [L28](#l28) Run the protected block:
  - [L29](#l29) Repeat while <code>true</code>:
    - [L30](#l30) Bind <code>{done,value}</code>: wait for <code>reader.read()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.
    - [L31](#l31) If <code>done</code> is truthy:
      - [L31](#l31) Leave the enclosing loop/switch.
    - [L32](#l32) update <code>size</code> with <code>value.byteLength</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L33](#l33) If <code>size &gt; 131072</code> is truthy:
      - [L33](#l33) wait for <code>reader.cancel()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
      - [L33](#l33) Throw <code>new AiFailure('response-too-large','OpenAI response exceeded 128 KiB.')</code>; normal execution stops until an enclosing catch handles it.
    - [L34](#l34) append values to the existing array: <code>chunks.push(value)</code>.
  - [L36](#l36) Return to the caller: function toString() { [native code] }: <code>Buffer.concat(chunks).toString('utf8')</code>.
- [L28](#l28) Always run cleanup on leaving the try/catch, including return or throw:
  - [L37](#l37) call the named operation with the supplied arguments: <code>reader.releaseLock()</code>.

<a id="fn-2233"></a>
### Promise callback (40:63)

Synchronous function. Lexically inside [post (13:1)](#fn-778). 

Parameters:

- <code>_</code>: supplied by the caller; usage is shown in the steps below.
- <code>reject</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L41](#l41) update <code>timer</code> with <code>setTimeout(()=&gt; { controller.abort(); reject(new AiFailure('timeout','OpenAI request timed out; reservation retained, no retry.')); },timeoutMs)</code> using <code>=</code>; this mutation is visible to later statements.

<a id="fn-2273"></a>
### setTimeout callback (41:26)

Synchronous function. Lexically inside [Promise callback (40:63)](#fn-2233). Passed to <code>setTimeout</code>; the receiving API determines when/how often it runs.

Execution:

- [L41](#l41) call the named operation with the supplied arguments: <code>controller.abort()</code>.
- [L41](#l41) call the named operation with the supplied arguments: <code>reject(new AiFailure('timeout','OpenAI request timed out; reservation retained, no retry.'))</code>.

<a id="fn-2648"></a>
### requestLiveQa (49:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>request: QaRequest</code>: supplied by the caller; usage is shown in the steps below.
- <code>context: AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>mode: AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>timeoutMs: number</code>: supplied by the caller; usage is shown in the steps below.
- <code>apiKey: string &#124; undefined</code>: supplied by the caller; usage is shown in the steps below.
- <code>dependencies: LiveDependencies = {}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L54](#l54) <code>payload</code>: create an object with 3 property/spread entries: <code>{...request,reasoning:{effort:'low'},service_tier:'default'}</code>; later properties overwrite earlier spread values.
- [L55](#l55) <code>hash</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(payload)).digest('hex')</code>.

Execution:

- [L51](#l51) If <code>!apiKey?.trim()</code> is truthy:
  - [L51](#l51) Throw <code>new AiFailure('missing-credentials','Provide the configured API credential before live review.')</code>; normal execution stops until an enclosing catch handles it.
- [L52](#l52) If <code>request.model !== TRIAL_MODELS[mode].model</code> is truthy:
  - [L52](#l52) Throw <code>new AiFailure('trial-model','Model does not match the approved trial mapping.')</code>; normal execution stops until an enclosing catch handles it.
- [L53](#l53) If <code>request.max_output_tokens &gt; OUTPUT_LIMIT &#124;&#124; request.max_output_tokens &lt; 128</code> is truthy:
  - [L53](#l53) Throw <code>new AiFailure('trial-output-limit','Trial output limit is 128–2000 tokens.')</code>; normal execution stops until an enclosing catch handles it.
- [L54](#l54) Bind <code>payload</code>: create an object with 3 property/spread entries: <code>{...request,reasoning:{effort:'low'},service_tier:'default'}</code>; later properties overwrite earlier spread values.
- [L55](#l55) Bind <code>hash</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(payload)).digest('hex')</code>.
- [L56](#l56) Return to the caller: call the named operation with the supplied arguments: <code>withTrialReservation(mode,hash,async()=&gt; { const send = dependencies.fetch ?? fetch; // Same input, instructions, schema and reasoning settings as generation. const countPayload = {model:payload.model,input:payload.input,instructions:payload.instructions,te…</code>.

<a id="fn-3453"></a>
### withTrialReservation callback (56:41)

Asynchronous function: returns a Promise. Lexically inside [requestLiveQa (49:8)](#fn-2648). Passed to <code>withTrialReservation</code>; the receiving API determines when/how often it runs.

Local bindings (nested callback locals are documented with that callback):

- [L57](#l57) <code>send</code>: use <code>dependencies.fetch</code> unless null/undefined, then evaluate <code>fetch</code>.
- [L59](#l59) <code>countPayload</code>: create an object with 5 property/spread entries: <code>{model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning}</code>; later properties overwrite earlier spread values.
- [L60](#l60) <code>countBody</code>: wait for <code>post(&#96;${ORIGIN}/input_tokens&#96;,countPayload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L61](#l61) <code>countedInputTokens: number</code>: leave the value undefined until a later assignment.
- [L64](#l64) <code>body</code>: wait for <code>post(ORIGIN,payload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L65](#l65) <code>usage</code>: leave the value undefined until a later assignment.
- [L68](#l68) <code>output</code>: call the named operation with the supplied arguments: <code>decodeResponse(body,context)</code>.

Execution:

- [L57](#l57) Bind <code>send</code>: use <code>dependencies.fetch</code> unless null/undefined, then evaluate <code>fetch</code>.
- [L59](#l59) Bind <code>countPayload</code>: create an object with 5 property/spread entries: <code>{model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning}</code>; later properties overwrite earlier spread values.
- [L60](#l60) Bind <code>countBody</code>: wait for <code>post(&#96;${ORIGIN}/input_tokens&#96;,countPayload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L61](#l61) Bind <code>countedInputTokens: number</code>: leave the value undefined until a later assignment.
- [L62](#l62) Run the protected block:
  - [L62](#l62) update <code>countedInputTokens</code> with <code>z.object({object:z.literal('response.input_tokens'),input_tokens:z.number().int().min(1).max(INPUT_LIMIT)}).parse(JSON.parse(countBody)).input_tokens</code> using <code>=</code>; this mutation is visible to later statements.
- [L62](#l62) If it throws:
  - [L63](#l63) Throw <code>new AiFailure('trial-input-limit','Input count is invalid or exceeds the 5000-token trial limit; generation was not sent.')</code>; normal execution stops until an enclosing catch handles it.
- [L64](#l64) Bind <code>body</code>: wait for <code>post(ORIGIN,payload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L65](#l65) Bind <code>usage</code>: leave the value undefined until a later assignment.
- [L66](#l66) Run the protected block:
  - [L66](#l66) update <code>usage</code> with <code>z.object({usage:usageSchema, service_tier:z.literal('default').optional()}).parse(JSON.parse(body)).usage</code> using <code>=</code>; this mutation is visible to later statements.
- [L66](#l66) If it throws:
  - [L67](#l67) Throw <code>new AiFailure('invalid-usage','Response usage or processing tier cannot be reconciled; reservation retained.')</code>; normal execution stops until an enclosing catch handles it.
- [L68](#l68) Bind <code>output</code>: call the named operation with the supplied arguments: <code>decodeResponse(body,context)</code>.
- [L69](#l69) Return to the caller: create an object with 2 property/spread entries: <code>{usage,value:{output,usage,countedInputTokens,reservedUsd:reservationMicroUsd(mode)/1e6, pricedUsageUpperBoundUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)/1e6}}</code>; later properties overwrite earlier spread values.

<a id="fn-4932"></a>
### requestBudgetQa (75:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>request:QaRequest</code>: supplied by the caller; usage is shown in the steps below.
- <code>context:AiContext</code>: supplied by the caller; usage is shown in the steps below.
- <code>mode:AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>timeoutMs:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>apiKey:string&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.
- <code>budget:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>dependencies:LiveDependencies={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L81](#l81) <code>payload</code>: create an object with 8 property/spread entries: <code>{model:request.model,store:false,input:request.input,instructions:request.instructions,text:request.text, max_output_tokens:request.max_output_tokens,reasoning:{effort:'low'},service_tier:'default'}</code>; later properties overwrite earlier spread values.
- [L83](#l83) <code>hash</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(payload)).digest('hex')</code>.

Execution:

- [L77](#l77) If <code>!apiKey?.trim()</code> is truthy:
  - [L77](#l77) Throw <code>new AiFailure('missing-credentials','Provide the configured API credential before live review.')</code>; normal execution stops until an enclosing catch handles it.
- [L78](#l78) If <code>request.model!==AUDIT_MODELS[mode].model</code> is truthy:
  - [L78](#l78) Throw <code>new AiFailure('budget-model','Model does not match the pinned priced mapping.')</code>; normal execution stops until an enclosing catch handles it.
- [L79](#l79) If <code>!Number.isInteger(request.max_output_tokens) &#124;&#124; request.max_output_tokens&lt;128 &#124;&#124; request.max_output_tokens&gt;AUDIT_OUTPUT_LIMIT</code> is truthy:
  - [L80](#l80) Throw <code>new AiFailure('budget-output-limit','Budgeted output limit is 128–2000 tokens.')</code>; normal execution stops until an enclosing catch handles it.
- [L81](#l81) Bind <code>payload</code>: create an object with 8 property/spread entries: <code>{model:request.model,store:false,input:request.input,instructions:request.instructions,text:request.text, max_output_tokens:request.max_output_tokens,reasoning:{effort:'low'},service_tier:'default'}</code>; later properties overwrite earlier spread values.
- [L83](#l83) Bind <code>hash</code>: finish the hash and encode its bytes: <code>createHash('sha256').update(JSON.stringify(payload)).digest('hex')</code>.
- [L84](#l84) Return to the caller: call the named operation with the supplied arguments: <code>withAuditReservation(budget,mode,hash,async()=&gt;{ const send=dependencies.fetch ?? fetch; const countPayload={model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning}; const countBody=await post…</code>.

<a id="fn-5935"></a>
### withAuditReservation callback (84:48)

Asynchronous function: returns a Promise. Lexically inside [requestBudgetQa (75:8)](#fn-4932). Passed to <code>withAuditReservation</code>; the receiving API determines when/how often it runs.

Local bindings (nested callback locals are documented with that callback):

- [L85](#l85) <code>send</code>: use <code>dependencies.fetch</code> unless null/undefined, then evaluate <code>fetch</code>.
- [L86](#l86) <code>countPayload</code>: create an object with 5 property/spread entries: <code>{model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning}</code>; later properties overwrite earlier spread values.
- [L87](#l87) <code>countBody</code>: wait for <code>post(&#96;${ORIGIN}/input_tokens&#96;,countPayload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L88](#l88) <code>countedInputTokens:number</code>: leave the value undefined until a later assignment.
- [L91](#l91) <code>body</code>: wait for <code>post(ORIGIN,payload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L92](#l92) <code>usage</code>: leave the value undefined until a later assignment.
- [L97](#l97) <code>output</code>: call the named operation with the supplied arguments: <code>decodeResponse(body,context)</code>.

Execution:

- [L85](#l85) Bind <code>send</code>: use <code>dependencies.fetch</code> unless null/undefined, then evaluate <code>fetch</code>.
- [L86](#l86) Bind <code>countPayload</code>: create an object with 5 property/spread entries: <code>{model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning}</code>; later properties overwrite earlier spread values.
- [L87](#l87) Bind <code>countBody</code>: wait for <code>post(&#96;${ORIGIN}/input_tokens&#96;,countPayload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L88](#l88) Bind <code>countedInputTokens:number</code>: leave the value undefined until a later assignment.
- [L89](#l89) Run the protected block:
  - [L89](#l89) update <code>countedInputTokens</code> with <code>z.object({object:z.literal('response.input_tokens'),input_tokens:z.number().int().min(1).max(AUDIT_INPUT_LIMIT)}).parse(JSON.parse(countBody)).input_tokens</code> using <code>=</code>; this mutation is visible to later statements.
- [L89](#l89) If it throws:
  - [L90](#l90) Throw <code>new AiFailure('budget-input-limit','Input count is invalid or exceeds 32000 tokens; generation was not sent.')</code>; normal execution stops until an enclosing catch handles it.
- [L91](#l91) Bind <code>body</code>: wait for <code>post(ORIGIN,payload,apiKey,timeoutMs,send)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L92](#l92) Bind <code>usage</code>: leave the value undefined until a later assignment.
- [L93](#l93) Run the protected block:
  - [L94](#l94) update <code>usage</code> with <code>z.object({usage:auditUsageSchema,service_tier:z.literal('default')}).parse(JSON.parse(body)).usage</code> using <code>=</code>; this mutation is visible to later statements.
  - [L95](#l95) If <code>usage.output_tokens&gt;request.max_output_tokens</code> is truthy:
    - [L95](#l95) Throw <code>new Error('Output exceeded request limit.')</code>; normal execution stops until an enclosing catch handles it.
- [L93](#l93) If it throws:
  - [L96](#l96) Throw <code>new AiFailure('invalid-usage','Response usage or processing tier cannot be reconciled; reservation retained.')</code>; normal execution stops until an enclosing catch handles it.
- [L97](#l97) Bind <code>output</code>: call the named operation with the supplied arguments: <code>decodeResponse(body,context)</code>.
- [L98](#l98) Return to the caller: create an object with 2 property/spread entries: <code>{usage,value:{output,usage,countedInputTokens,reservedUsd:auditReservationMicroUsd(mode)/1e6, pricedUsageUpperBoundUsd:auditUsageMicroUsd(mode,usage.input_tokens,usage.output_tokens)/1e6}}</code>; later properties overwrite earlier spread values.

## Compile-time data contracts

### LiveDependencies

```typescript
type LiveDependencies = {fetch?:typeof fetch; directory?:string; now?:number};
```

Declared at [L11](#l11). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L9](#l9) <code>ORIGIN</code>: use the literal <code>'https://api.openai.com/v1/responses'</code>.

## Directly importing tests

- [audit-budget.test.ts](../../test/audit-budget.test.ts)
- [live-ai.test.ts](../../test/live-ai.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l9"></a>
<a id="l11"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import { createHash } from 'node:crypto';
   2 | import { z } from 'zod';
   3 | import { AiFailure, decodeResponse, type QaRequest } from './client.js';
   4 | import type { AiContext } from './context.js';
   5 | import type { AiMode } from './contracts.js';
   6 | import { INPUT_LIMIT, OUTPUT_LIMIT, TRIAL_MODELS, usageSchema, usageMicroUsd, reservationMicroUsd, withTrialReservation } from './trial-budget.js';
   7 | import { AUDIT_MODELS, auditUsageMicroUsd, AUDIT_INPUT_LIMIT, AUDIT_OUTPUT_LIMIT, auditUsageSchema, auditReservationMicroUsd, withAuditReservation } from './audit-budget.js';
   8 | 
   9 | const ORIGIN = 'https://api.openai.com/v1/responses';
  10 | /** A fetch seam for offline tests; production has no configurable endpoint. */
  11 | export type LiveDependencies = {fetch?:typeof fetch; directory?:string; now?:number};
  12 | 
  13 | async function post(url: string, payload: unknown, apiKey: string, timeoutMs: number, send: typeof fetch) {
  14 |   const controller = new AbortController();
  15 |   let timer: ReturnType<typeof setTimeout> | undefined;
  16 |   const operation = async () => {
  17 |     const response = await send(url,{method:'POST',redirect:'error',signal:controller.signal,
  18 |       headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  19 |     if (!response.ok) {
  20 |       await response.body?.cancel();
```

<a id="l21"></a>
<a id="l22"></a>
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
<a id="l37"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |       const code = response.status === 401 || response.status === 403 ? 'authentication' : response.status === 429 ? 'rate-limit' : 'provider-error';
  22 |       throw new AiFailure(code,`OpenAI request failed (HTTP ${response.status}); no retry was attempted.`);
  23 |     }
  24 |     if (!response.body) throw new AiFailure('invalid-response','OpenAI returned no response body.');
  25 |     const reader = response.body.getReader();
  26 |     const chunks: Uint8Array[] = [];
  27 |     let size = 0;
  28 |     try {
  29 |       while (true) {
  30 |         const {done,value} = await reader.read();
  31 |         if (done) break;
  32 |         size += value.byteLength;
  33 |         if (size > 131072) { await reader.cancel(); throw new AiFailure('response-too-large','OpenAI response exceeded 128 KiB.'); }
  34 |         chunks.push(value);
  35 |       }
  36 |       return Buffer.concat(chunks).toString('utf8');
  37 |     } finally { reader.releaseLock(); }
  38 |   };
  39 |   try {
  40 |     return await Promise.race([operation(),new Promise<never>((_,reject)=> {
```

<a id="l41"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |       timer = setTimeout(()=> { controller.abort(); reject(new AiFailure('timeout','OpenAI request timed out; reservation retained, no retry.')); },timeoutMs);
  42 |     })]);
  43 |   } catch (error) {
  44 |     if (error instanceof AiFailure) throw error;
  45 |     throw new AiFailure('transport-error','OpenAI transport failed; reservation retained, no retry.');
  46 |   } finally { if (timer) clearTimeout(timer); }
  47 | }
  48 | 
  49 | export async function requestLiveQa(request: QaRequest, context: AiContext, mode: AiMode, timeoutMs: number,
  50 |   apiKey: string | undefined, dependencies: LiveDependencies = {}) {
  51 |   if (!apiKey?.trim()) throw new AiFailure('missing-credentials','Provide the configured API credential before live review.');
  52 |   if (request.model !== TRIAL_MODELS[mode].model) throw new AiFailure('trial-model','Model does not match the approved trial mapping.');
  53 |   if (request.max_output_tokens > OUTPUT_LIMIT || request.max_output_tokens < 128) throw new AiFailure('trial-output-limit','Trial output limit is 128–2000 tokens.');
  54 |   const payload = {...request,reasoning:{effort:'low'},service_tier:'default'};
  55 |   const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  56 |   return withTrialReservation(mode,hash,async()=> {
  57 |     const send = dependencies.fetch ?? fetch;
  58 |     // Same input, instructions, schema and reasoning settings as generation.
  59 |     const countPayload = {model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning};
  60 |     const countBody = await post(`${ORIGIN}/input_tokens`,countPayload,apiKey,timeoutMs,send);
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |     let countedInputTokens: number;
  62 |     try { countedInputTokens = z.object({object:z.literal('response.input_tokens'),input_tokens:z.number().int().min(1).max(INPUT_LIMIT)}).parse(JSON.parse(countBody)).input_tokens; }
  63 |     catch { throw new AiFailure('trial-input-limit','Input count is invalid or exceeds the 5000-token trial limit; generation was not sent.'); }
  64 |     const body = await post(ORIGIN,payload,apiKey,timeoutMs,send);
  65 |     let usage;
  66 |     try { usage = z.object({usage:usageSchema, service_tier:z.literal('default').optional()}).parse(JSON.parse(body)).usage; }
  67 |     catch { throw new AiFailure('invalid-usage','Response usage or processing tier cannot be reconciled; reservation retained.'); }
  68 |     const output = decodeResponse(body,context);
  69 |     return {usage,value:{output,usage,countedInputTokens,reservedUsd:reservationMicroUsd(mode)/1e6,
  70 |       pricedUsageUpperBoundUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)/1e6}};
  71 |   },dependencies.directory,dependencies.now);
  72 | }
  73 | 
  74 | /** Paid auditing shares one durable named allowance across all batches and invocations. */
  75 | export async function requestBudgetQa(request:QaRequest,context:AiContext,mode:AiMode,timeoutMs:number,
  76 |   apiKey:string|undefined,budget:string,dependencies:LiveDependencies={}) {
  77 |   if(!apiKey?.trim())throw new AiFailure('missing-credentials','Provide the configured API credential before live review.');
  78 |   if(request.model!==AUDIT_MODELS[mode].model)throw new AiFailure('budget-model','Model does not match the pinned priced mapping.');
  79 |   if(!Number.isInteger(request.max_output_tokens) || request.max_output_tokens<128 || request.max_output_tokens>AUDIT_OUTPUT_LIMIT)
  80 |     throw new AiFailure('budget-output-limit','Budgeted output limit is 128–2000 tokens.');
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
<a id="l86"></a>
<a id="l87"></a>
<a id="l88"></a>
<a id="l89"></a>
<a id="l90"></a>
<a id="l91"></a>
<a id="l92"></a>
<a id="l93"></a>
<a id="l94"></a>
<a id="l95"></a>
<a id="l96"></a>
<a id="l97"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 |   const payload={model:request.model,store:false,input:request.input,instructions:request.instructions,text:request.text,
  82 |     max_output_tokens:request.max_output_tokens,reasoning:{effort:'low'},service_tier:'default'};
  83 |   const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  84 |   return withAuditReservation(budget,mode,hash,async()=>{
  85 |     const send=dependencies.fetch ?? fetch;
  86 |     const countPayload={model:payload.model,input:payload.input,instructions:payload.instructions,text:payload.text,reasoning:payload.reasoning};
  87 |     const countBody=await post(`${ORIGIN}/input_tokens`,countPayload,apiKey,timeoutMs,send);
  88 |     let countedInputTokens:number;
  89 |     try {countedInputTokens=z.object({object:z.literal('response.input_tokens'),input_tokens:z.number().int().min(1).max(AUDIT_INPUT_LIMIT)}).parse(JSON.parse(countBody)).input_tokens;}
  90 |     catch {throw new AiFailure('budget-input-limit','Input count is invalid or exceeds 32000 tokens; generation was not sent.');}
  91 |     const body=await post(ORIGIN,payload,apiKey,timeoutMs,send);
  92 |     let usage;
  93 |     try {
  94 |       usage=z.object({usage:auditUsageSchema,service_tier:z.literal('default')}).parse(JSON.parse(body)).usage;
  95 |       if(usage.output_tokens>request.max_output_tokens)throw new Error('Output exceeded request limit.');
  96 |     } catch {throw new AiFailure('invalid-usage','Response usage or processing tier cannot be reconciled; reservation retained.');}
  97 |     const output=decodeResponse(body,context);
  98 |     return {usage,value:{output,usage,countedInputTokens,reservedUsd:auditReservationMicroUsd(mode)/1e6,
  99 |       pricedUsageUpperBoundUsd:auditUsageMicroUsd(mode,usage.input_tokens,usage.output_tokens)/1e6}};
 100 |   },dependencies.directory,dependencies.now);
```


```text
 101 | }
 102 | 
```
