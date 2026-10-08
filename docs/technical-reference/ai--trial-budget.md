# src/ai/trial-budget.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The legacy trial uses a fixed half-dollar allowance, one attempt per mode and three attempts total. Mode-named immutable files preserve attempts/receipts, and a lock prevents simultaneous spending. Trial state must match the shipped policy exactly; expired, repeated, corrupt or unresolved attempts stop spending. The read helper uses one bounded read, unlike the looped named-budget reader.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `ccc1d0c782ad9453c8f731e23ef55267da8dbc98f8d8d86c2b831343a7a7553f`.

This chapter inventories **16 function bodies/callbacks**, **33 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:os</code>: <code>homedir</code>.
- <code>node:path</code>: <code>join</code>.
- <code>zod</code>: <code>z</code>.
- <code>./client.js</code>: <code>AiFailure</code>.
- <code>./contracts.js</code>: <code>modeSchema</code>, <code>AiMode</code> (type only).

## Module execution

- [L11](#l11) Bind <code>TRIAL_MODELS</code>: create an object with 3 property/spread entries: <code>{ 'low-cost': {model:'gpt-6-luna', input:0.125, output:0.5}, balanced: {model:'gpt-6-sol', input:2.5, output:10}, 'high-quality': {model:'gpt-6-astra', input:12.5, output:50}, }</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L16](#l16) Bind <code>INPUT_LIMIT</code>: use the literal <code>5000</code>.
- [L17](#l17) Bind <code>OUTPUT_LIMIT</code>: use the literal <code>2000</code>.
- [L18](#l18) Bind <code>BUDGET</code>: use the literal <code>500000</code>.
- [L19](#l19) Bind <code>EXPIRES</code>: use the literal <code>'2026-10-03T00:00:00.000Z'</code>.
- [L20](#l20) Bind <code>POLICY</code>: create an object with 4 property/spread entries: <code>{version:1, allowanceMicroUsd:BUDGET, maxRequests:3, expires:EXPIRES}</code>; later properties overwrite earlier spread values.
- [L21](#l21) Bind <code>trialDirectory</code>: create [trialDirectory (21:31)](#fn-934); its body runs when called, not when this value is created.
- [L22](#l22) Bind <code>usageMicroUsd</code>: create [usageMicroUsd (22:30)](#fn-1012); its body runs when called, not when this value is created.
- [L24](#l24) Bind <code>reservationMicroUsd</code>: create [reservationMicroUsd (24:36)](#fn-1180); its body runs when called, not when this value is created.
- [L25](#l25) Bind <code>attemptSchema</code>: call the named operation with the supplied arguments: <code>z.object({mode:modeSchema, model:z.string(), reservedMicroUsd:z.number().int(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict()</code>.
- [L26](#l26) Bind <code>usageSchema</code>: call the named operation with the supplied arguments: <code>z.object({input_tokens:z.number().int().min(0).max(INPUT_LIMIT), output_tokens:z.number().int().min(0).max(OUTPUT_LIMIT)})</code>.
- [L28](#l28) Bind <code>receiptSchema</code>: call the named operation with the supplied arguments: <code>z.object({usage:usageSchema, pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict()</code>.
- [L29](#l29) Bind <code>fail</code>: create [fail (29:14)](#fn-1767); its body runs when called, not when this value is created.

## Function index

- [trialDirectory (21:31)](#fn-934)
- [usageMicroUsd (22:30)](#fn-1012)
- [reservationMicroUsd (24:36)](#fn-1180)
- [fail (29:14)](#fn-1767)
- [writeExclusive (31:1)](#fn-1933)
- [readJson (36:1)](#fn-2165)
- [initializeTrial (47:8)](#fn-2656)
- [trialStatus (55:8)](#fn-3090)
- [Object.keys(TRIAL_MODELS).flatMap callback (61:89)](#fn-3516)
- [names.some callback (62:20)](#fn-3593)
- [attempts.reduce callback (76:35)](#fn-4592)
- [attempts.reduce callback (77:48)](#fn-4679)
- [attempts.some callback (78:63)](#fn-4810)
- [withTrialReservation (83:8)](#fn-4960)
- [before.attempts.some callback (88:68)](#fn-5287)
- [state.attempts.some callback (93:49)](#fn-5744)

<a id="fn-934"></a>
### trialDirectory (21:31)

Synchronous function. Defined in module scope. 

Execution:

[L21](#l21) Implicitly return: call the named operation with the supplied arguments: <code>join(homedir(), '.shipcheck', 'trial-v1')</code>.

<a id="fn-1012"></a>
### usageMicroUsd (22:30)

Synchronous function. Defined in module scope. 

Parameters:

- <code>mode: AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>input: number</code>: supplied by the caller; usage is shown in the steps below.
- <code>output: number</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L23](#l23) Implicitly return: call the named operation with the supplied arguments: <code>Math.ceil(input * TRIAL_MODELS[mode].input + output * TRIAL_MODELS[mode].output)</code>.

<a id="fn-1180"></a>
### reservationMicroUsd (24:36)

Synchronous function. Defined in module scope. 

Parameters:

- <code>mode: AiMode</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L24](#l24) Implicitly return: call the named operation with the supplied arguments: <code>Math.ceil(usageMicroUsd(mode, INPUT_LIMIT, OUTPUT_LIMIT) * 1.25)</code>.

<a id="fn-1767"></a>
### fail (29:14)

Synchronous function. Defined in module scope. 

Execution:

[L29](#l29) Implicitly return: construct <code>AiFailure</code> using <code>'trial-state', 'Trial state is unavailable, locked, unresolved, or exhausted. No further requests are allowed; inspect shipcheck trial status.'</code>; this creates the local instance used below.

<a id="fn-1933"></a>
### writeExclusive (31:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>value: unknown</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L32](#l32) <code>handle</code>: wait for <code>fs.open(path,'wx',0o600)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L32](#l32) Bind <code>handle</code>: wait for <code>fs.open(path,'wx',0o600)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L33](#l33) Run the protected block:
  - [L33](#l33) wait for <code>handle.writeFile(JSON.stringify(value)+'\n')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L33](#l33) wait for <code>handle.sync()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L33](#l33) Always run cleanup on leaving the try/catch, including return or throw:
  - [L34](#l34) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-2165"></a>
### readJson (36:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L37](#l37) <code>stat</code>: wait for <code>fs.lstat(path)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L39](#l39) <code>handle</code>: wait for <code>fs.open(path,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L41](#l41) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(8193)</code>.
- [L42](#l42) <code>{bytesRead}</code>: wait for <code>handle.read(buffer,0,buffer.length,0)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.

Execution:

- [L37](#l37) Bind <code>stat</code>: wait for <code>fs.lstat(path)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L38](#l38) If <code>!stat.isFile() &#124;&#124; stat.isSymbolicLink() &#124;&#124; stat.size &gt; 8192</code> is truthy:
  - [L38](#l38) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
- [L39](#l39) Bind <code>handle</code>: wait for <code>fs.open(path,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L40](#l40) Run the protected block:
  - [L41](#l41) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(8193)</code>.
  - [L42](#l42) Bind <code>{bytesRead}</code>: wait for <code>handle.read(buffer,0,buffer.length,0)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch; destructure the resulting value by property name or array position into the displayed local bindings.
  - [L43](#l43) If <code>bytesRead &gt; 8192</code> is truthy:
    - [L43](#l43) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L44](#l44) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(buffer.subarray(0,bytesRead).toString('utf8'))</code>.
- [L40](#l40) Always run cleanup on leaving the try/catch, including return or throw:
  - [L45](#l45) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-2656"></a>
### initializeTrial (47:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>directory = trialDirectory()</code>: when omitted/undefined, initialize with <code>trialDirectory()</code>.

Execution:

- [L48](#l48) Run the protected block:
  - [L49](#l49) wait for <code>fs.mkdir(join(directory,'..'),{recursive:true})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L51](#l51) wait for <code>fs.mkdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L52](#l52) wait for <code>writeExclusive(join(directory,'policy.json'),POLICY)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L48](#l48) If it throws:
  - [L53](#l53) Throw <code>new AiFailure('trial-init','Trial already exists or cannot be initialized. It has not been reset.')</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-3090"></a>
### trialStatus (55:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>directory = trialDirectory()</code>: when omitted/undefined, initialize with <code>trialDirectory()</code>.

Local bindings (nested callback locals are documented with that callback):

- [L57](#l57) <code>stat</code>: wait for <code>fs.lstat(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L60](#l60) <code>names</code>: wait for <code>fs.readdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L61](#l61) <code>allowed</code>: construct <code>Set</code> using <code>['policy.json','lock', ...Object.keys(TRIAL_MODELS).flatMap(mode=&gt;[&#96;${mode}.attempt.json&#96;,&#96;${mode}.receipt.json&#96;])]</code>; this creates the local instance used below.
- [L63](#l63) <code>attempts</code>: create a new empty array to accumulate ordered results.
- [L64](#l64) <code>mode</code>: receive the next iterable value from <code>modeSchema.options</code> at the start of each loop iteration.
- [L65](#l65) <code>hasAttempt</code>: call the named operation with the supplied arguments: <code>names.includes(&#96;${mode}.attempt.json&#96;)</code>.
- [L66](#l66) <code>hasReceipt</code>: call the named operation with the supplied arguments: <code>names.includes(&#96;${mode}.receipt.json&#96;)</code>.
- [L69](#l69) <code>attempt</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>attemptSchema.parse(await readJson(join(directory,&#96;${mode}.attempt.json&#96;)))</code>.
- [L71](#l71) <code>receipt</code>: test <code>hasReceipt</code>; choose <code>receiptSchema.parse(await readJson(join(directory,&#96;${mode}.receipt.json&#96;)))</code> when truthy, otherwise <code>null</code>.

Execution:

- [L56](#l56) Run the protected block:
  - [L57](#l57) Bind <code>stat</code>: wait for <code>fs.lstat(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L58](#l58) If <code>!stat.isDirectory() &#124;&#124; stat.isSymbolicLink()</code> is truthy:
    - [L58](#l58) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L59](#l59) If <code>JSON.stringify(await readJson(join(directory,'policy.json'))) !== JSON.stringify(POLICY)</code> is truthy:
    - [L59](#l59) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L60](#l60) Bind <code>names</code>: wait for <code>fs.readdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L61](#l61) Bind <code>allowed</code>: construct <code>Set</code> using <code>['policy.json','lock', ...Object.keys(TRIAL_MODELS).flatMap(mode=&gt;[&#96;${mode}.attempt.json&#96;,&#96;${mode}.receipt.json&#96;])]</code>; this creates the local instance used below.
  - [L62](#l62) If <code>names.some(name=&gt;!allowed.has(name))</code> is truthy:
    - [L62](#l62) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L63](#l63) Bind <code>attempts</code>: create a new empty array to accumulate ordered results.
  - [L64](#l64) Iterate <code>modeSchema.options</code> values, binding <code>const mode</code> for each iteration:
    - [L65](#l65) Bind <code>hasAttempt</code>: call the named operation with the supplied arguments: <code>names.includes(&#96;${mode}.attempt.json&#96;)</code>.
    - [L66](#l66) Bind <code>hasReceipt</code>: call the named operation with the supplied arguments: <code>names.includes(&#96;${mode}.receipt.json&#96;)</code>.
    - [L67](#l67) If <code>hasReceipt &amp;&amp; !hasAttempt</code> is truthy:
      - [L67](#l67) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
    - [L68](#l68) If <code>!hasAttempt</code> is truthy:
      - [L68](#l68) Skip the rest of this iteration and advance the enclosing loop.
    - [L69](#l69) Bind <code>attempt</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>attemptSchema.parse(await readJson(join(directory,&#96;${mode}.attempt.json&#96;)))</code>.
    - [L70](#l70) If <code>attempt.mode !== mode &#124;&#124; attempt.model !== TRIAL_MODELS[mode].model &#124;&#124; attempt.reservedMicroUsd !== reservationMicroUsd(mode)</code> is truthy:
      - [L70](#l70) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
    - [L71](#l71) Bind <code>receipt</code>: test <code>hasReceipt</code>; choose <code>receiptSchema.parse(await readJson(join(directory,&#96;${mode}.receipt.json&#96;)))</code> when truthy, otherwise <code>null</code>.
    - [L72](#l72) If <code>receipt &amp;&amp; receipt.pricedUsageUpperBoundMicroUsd !== usageMicroUsd(mode,receipt.usage.input_tokens,receipt.usage.output_tokens)</code> is truthy:
      - [L72](#l72) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
    - [L73](#l73) append values to the existing array: <code>attempts.push({...attempt,receipt})</code>.
  - [L75](#l75) Return to the caller: create an object with 8 property/spread entries: <code>{allowanceUsd:BUDGET/1e6, maxRequests:3, expires:EXPIRES, reservedUsd:attempts.reduce((sum,a)=&gt;sum+a.reservedMicroUsd,0)/1e6, pricedUsageUpperBoundUsd:attempts.reduce((sum,a)=&gt;sum+(a.receipt?.pricedUsageUpperBoundMicroUsd ?? 0),0)/1e6, locked:names.includes…</code>; later properties overwrite earlier spread values.
- [L56](#l56) If it throws:
  - [L79](#l79) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-3516"></a>
### Object.keys(TRIAL_MODELS).flatMap callback (61:89)

Synchronous function. Lexically inside [trialStatus (55:8)](#fn-3090). Passed to <code>Object.keys(TRIAL_MODELS).flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>mode</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L61](#l61) Implicitly return: create an array from <code>[&#96;${mode}.attempt.json&#96;,&#96;${mode}.receipt.json&#96;]</code>; spread elements insert the iterable values.

<a id="fn-3593"></a>
### names.some callback (62:20)

Synchronous function. Lexically inside [trialStatus (55:8)](#fn-3090). Passed to <code>names.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>name</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L62](#l62) Implicitly return: apply <code>!</code> to <code>allowed.has(name)</code>.

<a id="fn-4592"></a>
### attempts.reduce callback (76:35)

Synchronous function. Lexically inside [trialStatus (55:8)](#fn-3090). Passed to <code>attempts.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L76](#l76) Implicitly return: compute <code>sum+a.reservedMicroUsd</code> with the <code>+</code> operator.

<a id="fn-4679"></a>
### attempts.reduce callback (77:48)

Synchronous function. Lexically inside [trialStatus (55:8)](#fn-3090). Passed to <code>attempts.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L77](#l77) Implicitly return: compute <code>sum+(a.receipt?.pricedUsageUpperBoundMicroUsd ?? 0)</code> with the <code>+</code> operator.

<a id="fn-4810"></a>
### attempts.some callback (78:63)

Synchronous function. Lexically inside [trialStatus (55:8)](#fn-3090). Passed to <code>attempts.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L78](#l78) Implicitly return: apply <code>!</code> to <code>a.receipt</code>.

<a id="fn-4960"></a>
### withTrialReservation (83:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>mode: AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>requestHash: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>execute: () =&gt; Promise&lt;{value:T; usage:TrialUsage}&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory = trialDirectory()</code>: when omitted/undefined, initialize with <code>trialDirectory()</code>.
- <code>now = Date.now()</code>: when omitted/undefined, initialize with <code>Date.now()</code>.

Local bindings (nested callback locals are documented with that callback):

- [L85](#l85) <code>lock</code>: leave the value undefined until a later assignment.
- [L87](#l87) <code>before</code>: wait for <code>trialStatus(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L91](#l91) <code>state</code>: wait for <code>trialStatus(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L92](#l92) <code>reservedMicroUsd</code>: call the named operation with the supplied arguments: <code>reservationMicroUsd(mode)</code>.
- [L97](#l97) <code>result</code>: wait for <code>execute()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L98](#l98) <code>usage</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>usageSchema.parse(result.usage)</code>.

Execution:

- [L85](#l85) Bind <code>lock</code>: leave the value undefined until a later assignment.
- [L86](#l86) Run the protected block:
  - [L87](#l87) Bind <code>before</code>: wait for <code>trialStatus(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L88](#l88) If <code>before.locked &#124;&#124; before.unresolved &#124;&#124; before.attempts.some(a=&gt;a.mode===mode) &#124;&#124; before.attempts.length &gt;= 3</code> is truthy:
    - [L88](#l88) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L89](#l89) If <code>now &gt;= Date.parse(EXPIRES) &#124;&#124; now &lt; Date.parse('2026-09-26T00:00:00Z')</code> is truthy:
    - [L89](#l89) Throw <code>new AiFailure('trial-expired','Trial pricing approval has expired or the clock is invalid.')</code>; normal execution stops until an enclosing catch handles it.
  - [L90](#l90) update <code>lock</code> with <code>await fs.open(join(directory,'lock'),'wx',0o600)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L91](#l91) Bind <code>state</code>: wait for <code>trialStatus(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L92](#l92) Bind <code>reservedMicroUsd</code>: call the named operation with the supplied arguments: <code>reservationMicroUsd(mode)</code>.
  - [L93](#l93) If <code>state.unresolved &#124;&#124; state.attempts.some(a=&gt;a.mode===mode) &#124;&#124; state.attempts.length &gt;= 3 &#124;&#124; Math.round(state.reservedUsd*1e6)+reservedMicroUsd &gt; BUDGET &#124;&#124; reservedMicroUsd &gt; 250000</code> is truthy:
    - [L94](#l94) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
  - [L95](#l95) wait for <code>writeExclusive(join(directory,&#96;${mode}.attempt.json&#96;),{mode,model:TRIAL_MODELS[mode].model,reservedMicroUsd,requestHash})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L97](#l97) Bind <code>result</code>: wait for <code>execute()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L98](#l98) Bind <code>usage</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>usageSchema.parse(result.usage)</code>.
  - [L99](#l99) wait for <code>writeExclusive(join(directory,&#96;${mode}.receipt.json&#96;),{usage,pricedUsageUpperBoundMicroUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L100](#l100) Return to the caller: read <code>result.value</code>.
- [L86](#l86) If it throws, bind <code>error</code>:
  - [L101](#l101) If <code>error instanceof AiFailure</code> is truthy:
    - [L101](#l101) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
  - [L101](#l101) Throw <code>fail()</code>; normal execution stops until an enclosing catch handles it.
- [L86](#l86) Always run cleanup on leaving the try/catch, including return or throw:
  - [L102](#l102) If <code>lock</code> is truthy:
    - [L102](#l102) wait for <code>lock.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L102](#l102) wait for <code>fs.unlink(join(directory,'lock'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-5287"></a>
### before.attempts.some callback (88:68)

Synchronous function. Lexically inside [withTrialReservation (83:8)](#fn-4960). Passed to <code>before.attempts.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L88](#l88) Implicitly return: compute <code>a.mode===mode</code> with the <code>===</code> operator.

<a id="fn-5744"></a>
### state.attempts.some callback (93:49)

Synchronous function. Lexically inside [withTrialReservation (83:8)](#fn-4960). Passed to <code>state.attempts.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L93](#l93) Implicitly return: compute <code>a.mode===mode</code> with the <code>===</code> operator.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>attemptSchema</code> | <code>mode</code> | <code>modeSchema</code> | [L25](#l25) |
| <code>attemptSchema</code> | <code>model</code> | <code>z.string()</code> | [L25](#l25) |
| <code>attemptSchema</code> | <code>reservedMicroUsd</code> | <code>z.number().int()</code> | [L25](#l25) |
| <code>attemptSchema</code> | <code>requestHash</code> | <code>z.string().regex(/^[a-f0-9]{64}$/)</code> | [L25](#l25) |
| <code>usageSchema</code> | <code>input_tokens</code> | <code>z.number().int().min(0).max(INPUT_LIMIT)</code> | [L26](#l26) |
| <code>usageSchema</code> | <code>output_tokens</code> | <code>z.number().int().min(0).max(OUTPUT_LIMIT)</code> | [L26](#l26) |
| <code>receiptSchema</code> | <code>usage</code> | <code>usageSchema</code> | [L28](#l28) |
| <code>receiptSchema</code> | <code>pricedUsageUpperBoundMicroUsd</code> | <code>z.number().int().nonnegative()</code> | [L28](#l28) |

## Compile-time data contracts

### TrialUsage

```typescript
type TrialUsage = z.infer<typeof usageSchema>;
```

Declared at [L27](#l27). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L11](#l11) <code>TRIAL_MODELS</code>: create an object with 3 property/spread entries: <code>{ 'low-cost': {model:'gpt-6-luna', input:0.125, output:0.5}, balanced: {model:'gpt-6-sol', input:2.5, output:10}, 'high-quality': {model:'gpt-6-astra', input:12.5, output:50}, }</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L16](#l16) <code>INPUT_LIMIT</code>: use the literal <code>5000</code>.
- [L17](#l17) <code>OUTPUT_LIMIT</code>: use the literal <code>2000</code>.
- [L18](#l18) <code>BUDGET</code>: use the literal <code>500000</code>.
- [L19](#l19) <code>EXPIRES</code>: use the literal <code>'2026-10-03T00:00:00.000Z'</code>.
- [L20](#l20) <code>POLICY</code>: create an object with 4 property/spread entries: <code>{version:1, allowanceMicroUsd:BUDGET, maxRequests:3, expires:EXPIRES}</code>; later properties overwrite earlier spread values.
- [L21](#l21) <code>trialDirectory</code>: create [trialDirectory (21:31)](#fn-934); its body runs when called, not when this value is created.
- [L22](#l22) <code>usageMicroUsd</code>: create [usageMicroUsd (22:30)](#fn-1012); its body runs when called, not when this value is created.
- [L24](#l24) <code>reservationMicroUsd</code>: create [reservationMicroUsd (24:36)](#fn-1180); its body runs when called, not when this value is created.
- [L25](#l25) <code>attemptSchema</code>: call the named operation with the supplied arguments: <code>z.object({mode:modeSchema, model:z.string(), reservedMicroUsd:z.number().int(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict()</code>.
- [L26](#l26) <code>usageSchema</code>: call the named operation with the supplied arguments: <code>z.object({input_tokens:z.number().int().min(0).max(INPUT_LIMIT), output_tokens:z.number().int().min(0).max(OUTPUT_LIMIT)})</code>.
- [L28](#l28) <code>receiptSchema</code>: call the named operation with the supplied arguments: <code>z.object({usage:usageSchema, pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict()</code>.
- [L29](#l29) <code>fail</code>: create [fail (29:14)](#fn-1767); its body runs when called, not when this value is created.

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
   1 | import * as fs from 'node:fs/promises';
   2 | import { homedir } from 'node:os';
   3 | import { join } from 'node:path';
   4 | import { z } from 'zod';
   5 | import { AiFailure } from './client.js';
   6 | import { modeSchema, type AiMode } from './contracts.js';
   7 | 
   8 | // USD per million tokens equals microdollars per token. Use the highest input
   9 | // rate (cache writes), no cache discounts, plus 25% reservation headroom.
  10 | // Verified https://developers.openai.com/api/docs/pricing on 2026-09-26.
  11 | export const TRIAL_MODELS = {
  12 |   'low-cost': {model:'gpt-6-luna', input:0.125, output:0.5},
  13 |   balanced: {model:'gpt-6-sol', input:2.5, output:10},
  14 |   'high-quality': {model:'gpt-6-astra', input:12.5, output:50},
  15 | } as const;
  16 | export const INPUT_LIMIT = 5000;
  17 | export const OUTPUT_LIMIT = 2000;
  18 | const BUDGET = 500000;
  19 | const EXPIRES = '2026-10-03T00:00:00.000Z';
  20 | const POLICY = {version:1, allowanceMicroUsd:BUDGET, maxRequests:3, expires:EXPIRES};
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
<a id="l34"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | export const trialDirectory = () => join(homedir(), '.shipcheck', 'trial-v1');
  22 | export const usageMicroUsd = (mode: AiMode, input: number, output: number) =>
  23 |   Math.ceil(input * TRIAL_MODELS[mode].input + output * TRIAL_MODELS[mode].output);
  24 | export const reservationMicroUsd = (mode: AiMode) => Math.ceil(usageMicroUsd(mode, INPUT_LIMIT, OUTPUT_LIMIT) * 1.25);
  25 | const attemptSchema = z.object({mode:modeSchema, model:z.string(), reservedMicroUsd:z.number().int(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
  26 | export const usageSchema = z.object({input_tokens:z.number().int().min(0).max(INPUT_LIMIT), output_tokens:z.number().int().min(0).max(OUTPUT_LIMIT)});
  27 | export type TrialUsage = z.infer<typeof usageSchema>;
  28 | const receiptSchema = z.object({usage:usageSchema, pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict();
  29 | const fail = () => new AiFailure('trial-state','Trial state is unavailable, locked, unresolved, or exhausted. No further requests are allowed; inspect shipcheck trial status.');
  30 | 
  31 | async function writeExclusive(path: string, value: unknown) {
  32 |   const handle = await fs.open(path,'wx',0o600);
  33 |   try { await handle.writeFile(JSON.stringify(value)+'\n'); await handle.sync(); }
  34 |   finally { await handle.close(); }
  35 | }
  36 | async function readJson(path: string): Promise<unknown> {
  37 |   const stat = await fs.lstat(path);
  38 |   if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 8192) throw fail();
  39 |   const handle = await fs.open(path,'r');
  40 |   try {
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l49"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     const buffer = Buffer.alloc(8193);
  42 |     const {bytesRead} = await handle.read(buffer,0,buffer.length,0);
  43 |     if (bytesRead > 8192) throw fail();
  44 |     return JSON.parse(buffer.subarray(0,bytesRead).toString('utf8'));
  45 |   } finally { await handle.close(); }
  46 | }
  47 | export async function initializeTrial(directory = trialDirectory()) {
  48 |   try {
  49 |     await fs.mkdir(join(directory,'..'),{recursive:true});
  50 |     // Never overwrite an existing allowance, even if its state is incomplete.
  51 |     await fs.mkdir(directory);
  52 |     await writeExclusive(join(directory,'policy.json'),POLICY);
  53 |   } catch { throw new AiFailure('trial-init','Trial already exists or cannot be initialized. It has not been reset.'); }
  54 | }
  55 | export async function trialStatus(directory = trialDirectory()) {
  56 |   try {
  57 |     const stat = await fs.lstat(directory);
  58 |     if (!stat.isDirectory() || stat.isSymbolicLink()) throw fail();
  59 |     if (JSON.stringify(await readJson(join(directory,'policy.json'))) !== JSON.stringify(POLICY)) throw fail();
  60 |     const names = await fs.readdir(directory);
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
<a id="l72"></a>
<a id="l73"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>

```text
  61 |     const allowed = new Set(['policy.json','lock', ...Object.keys(TRIAL_MODELS).flatMap(mode=>[`${mode}.attempt.json`,`${mode}.receipt.json`])]);
  62 |     if (names.some(name=>!allowed.has(name))) throw fail();
  63 |     const attempts = [];
  64 |     for (const mode of modeSchema.options) {
  65 |       const hasAttempt = names.includes(`${mode}.attempt.json`);
  66 |       const hasReceipt = names.includes(`${mode}.receipt.json`);
  67 |       if (hasReceipt && !hasAttempt) throw fail();
  68 |       if (!hasAttempt) continue;
  69 |       const attempt = attemptSchema.parse(await readJson(join(directory,`${mode}.attempt.json`)));
  70 |       if (attempt.mode !== mode || attempt.model !== TRIAL_MODELS[mode].model || attempt.reservedMicroUsd !== reservationMicroUsd(mode)) throw fail();
  71 |       const receipt = hasReceipt ? receiptSchema.parse(await readJson(join(directory,`${mode}.receipt.json`))) : null;
  72 |       if (receipt && receipt.pricedUsageUpperBoundMicroUsd !== usageMicroUsd(mode,receipt.usage.input_tokens,receipt.usage.output_tokens)) throw fail();
  73 |       attempts.push({...attempt,receipt});
  74 |     }
  75 |     return {allowanceUsd:BUDGET/1e6, maxRequests:3, expires:EXPIRES,
  76 |       reservedUsd:attempts.reduce((sum,a)=>sum+a.reservedMicroUsd,0)/1e6,
  77 |       pricedUsageUpperBoundUsd:attempts.reduce((sum,a)=>sum+(a.receipt?.pricedUsageUpperBoundMicroUsd ?? 0),0)/1e6,
  78 |       locked:names.includes('lock'), unresolved:attempts.some(a=>!a.receipt), attempts};
  79 |   } catch { throw fail(); }
  80 | }
```

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
<a id="l97"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 | 
  82 | /** Directory and clock arguments are test seams, never repository configuration. */
  83 | export async function withTrialReservation<T>(mode: AiMode, requestHash: string,
  84 |   execute: () => Promise<{value:T; usage:TrialUsage}>, directory = trialDirectory(), now = Date.now()): Promise<T> {
  85 |   let lock;
  86 |   try {
  87 |     const before = await trialStatus(directory);
  88 |     if (before.locked || before.unresolved || before.attempts.some(a=>a.mode===mode) || before.attempts.length >= 3) throw fail();
  89 |     if (now >= Date.parse(EXPIRES) || now < Date.parse('2026-09-26T00:00:00Z')) throw new AiFailure('trial-expired','Trial pricing approval has expired or the clock is invalid.');
  90 |     lock = await fs.open(join(directory,'lock'),'wx',0o600);
  91 |     const state = await trialStatus(directory);
  92 |     const reservedMicroUsd = reservationMicroUsd(mode);
  93 |     if (state.unresolved || state.attempts.some(a=>a.mode===mode) || state.attempts.length >= 3
  94 |       || Math.round(state.reservedUsd*1e6)+reservedMicroUsd > BUDGET || reservedMicroUsd > 250000) throw fail();
  95 |     await writeExclusive(join(directory,`${mode}.attempt.json`),{mode,model:TRIAL_MODELS[mode].model,reservedMicroUsd,requestHash});
  96 |     // Reservation is durable BEFORE either HTTP call. Failure leaves it unresolved.
  97 |     const result = await execute();
  98 |     const usage = usageSchema.parse(result.usage);
  99 |     await writeExclusive(join(directory,`${mode}.receipt.json`),{usage,pricedUsageUpperBoundMicroUsd:usageMicroUsd(mode,usage.input_tokens,usage.output_tokens)});
 100 |     return result.value;
```

<a id="l101"></a>
<a id="l102"></a>

```text
 101 |   } catch (error) { if (error instanceof AiFailure) throw error; throw fail(); }
 102 |   finally { if (lock) { await lock.close(); await fs.unlink(join(directory,'lock')); } }
 103 | }
 104 | 
```
