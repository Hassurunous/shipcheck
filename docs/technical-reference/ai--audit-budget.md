# src/ai/audit-budget.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Named allowances live outside repositories. Exclusive-create files and a lock serialize writers; immutable attempts reserve the worst-case token cost plus headroom before execution. budgetStatus reconstructs state from validated sequential records and recomputed prices. Success adds a receipt but never refunds reservation; explicit settlement records full-reservation charge without inventing usage. Pinned policy versions preserve historical interpretation.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `186523c4ab0ffda07f7bba5ad4cce2dab23a4ddc283a845755c138463280f909`.

This chapter inventories **22 function bodies/callbacks**, **51 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:os</code>: <code>homedir</code>.
- <code>node:path</code>: <code>join</code>.
- <code>zod</code>: <code>z</code>.
- <code>./client.js</code>: <code>AiFailure</code>.
- <code>./contracts.js</code>: <code>modeSchema</code>, <code>AiMode</code> (type only).
- <code>./trial-budget.js</code>: <code>TRIAL_MODELS</code>, <code>legacyUsageMicroUsd</code>.

## Module execution

- [L11](#l11) Bind <code>AUDIT_MODELS</code>: create an object with 3 property/spread entries: <code>{ 'low-cost':{model:'gpt-6-luna',input:0.125,output:0.5}, balanced:{model:'gpt-6-sol',input:2.5,output:10}, 'high-quality':{model:'gpt-6-astra',input:12.5,output:50}, }</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L16](#l16) Bind <code>auditUsageMicroUsd</code>: create [auditUsageMicroUsd (16:33)](#fn-719); its body runs when called, not when this value is created.
- [L17](#l17) Bind <code>AUDIT_INPUT_LIMIT</code>: use the literal <code>32000</code>.
- [L18](#l18) Bind <code>AUDIT_OUTPUT_LIMIT</code>: use the literal <code>2000</code>.
- [L19](#l19) Bind <code>PRICING_EXPIRES</code>: use the literal <code>'2026-10-30T00:00:00.000Z'</code>.
- [L20](#l20) Bind <code>PRICING_START</code>: use the literal <code>'2026-09-30T00:00:00.000Z'</code>.
- [L21](#l21) Bind <code>MAX_ATTEMPTS</code>: use the literal <code>1000</code>.
- [L22](#l22) Bind <code>budgetNameSchema</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine( value=&gt;! /^(con&#124;prn&#124;aux&#124;nul&#124;com[1-9]&#124;lpt[1-9])$/.test(value),'Reserved name.')</code>.
- [L24](#l24) Bind <code>auditUsageSchema</code>: call the named operation with the supplied arguments: <code>z.object({input_tokens:z.number().int().min(0).max(AUDIT_INPUT_LIMIT), output_tokens:z.number().int().min(0).max(AUDIT_OUTPUT_LIMIT)})</code>.
- [L27](#l27) Bind <code>auditReservationMicroUsd</code>: create [auditReservationMicroUsd (27:39)](#fn-1457); its body runs when called, not when this value is created.
- [L28](#l28) Bind <code>budgetDirectory</code>: create [budgetDirectory (28:30)](#fn-1580); its body runs when called, not when this value is created.
- [L29](#l29) Bind <code>policySchema</code>: call the named operation with the supplied arguments: <code>z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema, allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000), expires:z.string()}).strict().refine(policy=&gt;policy.expires===(policy.version===1?'2026-10-03T00:00…</code>.
- [L32](#l32) Bind <code>attemptSchema</code>: call the named operation with the supplied arguments: <code>z.object({mode:modeSchema,model:z.string(),reservedMicroUsd:z.number().int().positive(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict()</code>.
- [L34](#l34) Bind <code>receiptSchema</code>: call the named operation with the supplied arguments: <code>z.object({usage:auditUsageSchema,pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict()</code>.
- [L35](#l35) Bind <code>settlementSchema</code>: call the named operation with the supplied arguments: <code>z.object({action:z.literal('charge-full-reservation'),chargedMicroUsd:z.number().int().positive()}).strict()</code>.
- [L36](#l36) Bind <code>stateError</code>: create [stateError (36:18)](#fn-2419); its body runs when called, not when this value is created.

## Function index

- [auditUsageMicroUsd (16:33)](#fn-719)
- [z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine callback (23:3)](#fn-1126)
- [auditReservationMicroUsd (27:39)](#fn-1457)
- [budgetDirectory (28:30)](#fn-1580)
- [z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema, allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000), expires:z.string()}).strict().refine callback (31:40)](#fn-1882)
- [stateError (36:18)](#fn-2419)
- [directoryIsReal (38:1)](#fn-2578)
- [writeExclusive (42:1)](#fn-2741)
- [readJson (47:1)](#fn-2963)
- [parseAllowanceUsd (59:8)](#fn-3584)
- [initializeBudget (66:8)](#fn-4036)
- [budgetStatus (78:8)](#fn-4996)
- [names.some callback (85:52)](#fn-5468)
- [names.filter callback (86:37)](#fn-5631)
- [names.some callback (87:19)](#fn-5695)
- [names.some callback (88:19)](#fn-5829)
- [attempts.reduce callback (105:44)](#fn-7301)
- [attempts.reduce callback (109:48)](#fn-7649)
- [attempts.some callback (110:62)](#fn-7791)
- [settleBudgetAttempt (115:8)](#fn-7983)
- [state.attempts.find callback (123:39)](#fn-8452)
- [withAuditReservation (131:8)](#fn-8985)

<a id="fn-719"></a>
### auditUsageMicroUsd (16:33)

Synchronous function. Defined in module scope. 

Parameters:

- <code>mode:AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>input:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>output:number</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: call the named operation with the supplied arguments: <code>Math.ceil(input*AUDIT_MODELS[mode].input+output*AUDIT_MODELS[mode].output)</code>.

<a id="fn-1126"></a>
### z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine callback (23:3)

Synchronous function. Defined in module scope. Passed to <code>z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L23](#l23) Implicitly return: apply <code>!</code> to <code>/^(con&#124;prn&#124;aux&#124;nul&#124;com[1-9]&#124;lpt[1-9])$/.test(value)</code>.

<a id="fn-1457"></a>
### auditReservationMicroUsd (27:39)

Synchronous function. Defined in module scope. 

Parameters:

- <code>mode:AiMode</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L27](#l27) Implicitly return: call the named operation with the supplied arguments: <code>Math.ceil(auditUsageMicroUsd(mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25)</code>.

<a id="fn-1580"></a>
### budgetDirectory (28:30)

Synchronous function. Defined in module scope. 

Parameters:

- <code>name:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: call the named operation with the supplied arguments: <code>join(homedir(),'.shipcheck','budgets',budgetNameSchema.parse(name))</code>.

<a id="fn-1882"></a>
### z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema, allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000), expires:z.string()}).strict().refine callback (31:40)

Synchronous function. Defined in module scope. Passed to <code>z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema, allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000), expires:z.string()}).strict().refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>policy</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L31](#l31) Implicitly return: compute <code>policy.expires===(policy.version===1?'2026-10-03T00:00:00.000Z':PRICING_EXPIRES)</code> with the <code>===</code> operator.

<a id="fn-2419"></a>
### stateError (36:18)

Synchronous function. Defined in module scope. 

Execution:

[L36](#l36) Implicitly return: construct <code>AiFailure</code> using <code>'budget-state', 'Budget state is missing, invalid, locked, or unresolved. Inspect shipcheck budget status; no automatic reset is allowed.'</code>; this creates the local instance used below.

<a id="fn-2578"></a>
### directoryIsReal (38:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>directory:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L39](#l39) <code>stat</code>: wait for <code>fs.lstat(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L39](#l39) Bind <code>stat</code>: wait for <code>fs.lstat(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L40](#l40) If <code>!stat.isDirectory() &#124;&#124; stat.isSymbolicLink()</code> is truthy:
  - [L40](#l40) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-2741"></a>
### writeExclusive (42:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>value:unknown</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L43](#l43) <code>handle</code>: wait for <code>fs.open(path,'wx',0o600)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L43](#l43) Bind <code>handle</code>: wait for <code>fs.open(path,'wx',0o600)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L44](#l44) Run the protected block:
  - [L44](#l44) wait for <code>handle.writeFile(JSON.stringify(value)+'\n')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L44](#l44) wait for <code>handle.sync()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L44](#l44) Always run cleanup on leaving the try/catch, including return or throw:
  - [L45](#l45) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-2963"></a>
### readJson (47:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L48](#l48) <code>stat</code>: wait for <code>fs.lstat(path)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L50](#l50) <code>handle</code>: wait for <code>fs.open(path,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L53](#l53) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(8193)</code>.
- [L53](#l53) <code>size</code>: use the literal <code>0</code>.
- [L54](#l54) <code>read</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L48](#l48) Bind <code>stat</code>: wait for <code>fs.lstat(path)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L49](#l49) If <code>!stat.isFile() &#124;&#124; stat.isSymbolicLink() &#124;&#124; stat.size&gt;8192</code> is truthy:
  - [L49](#l49) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
- [L50](#l50) Bind <code>handle</code>: wait for <code>fs.open(path,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L51](#l51) Run the protected block:
  - [L52](#l52) If <code>!(await handle.stat()).isFile()</code> is truthy:
    - [L52](#l52) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L53](#l53) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(8193)</code>.
  - [L53](#l53) Bind <code>size</code>: use the literal <code>0</code>.
  - [L54](#l54) Repeat while <code>size&lt;buffer.length</code>:
    - [L54](#l54) Bind <code>read</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L54](#l54) If <code>!read.bytesRead</code> is truthy:
      - [L54](#l54) Leave the enclosing loop/switch.
    - [L54](#l54) update <code>size</code> with <code>read.bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L55](#l55) If <code>size&gt;8192</code> is truthy:
    - [L55](#l55) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L56](#l56) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(buffer.subarray(0,size).toString('utf8'))</code>.
- [L51](#l51) Always run cleanup on leaving the try/catch, including return or throw:
  - [L57](#l57) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-3584"></a>
### parseAllowanceUsd (59:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>value:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L61](#l61) <code>cents</code>: call the named operation with the supplied arguments: <code>Math.round(Number(value)*100)</code>.

Execution:

- [L60](#l60) If <code>!/^(?:0&#124;[1-9]\d{0,2})(?:\.\d{1,2})?$/.test(value)</code> is truthy:
  - [L60](#l60) Throw <code>new Error('Allowance must be a USD amount from 0.01 to 100.00, with at most two decimals.')</code>; normal execution stops until an enclosing catch handles it.
- [L61](#l61) Bind <code>cents</code>: call the named operation with the supplied arguments: <code>Math.round(Number(value)*100)</code>.
- [L62](#l62) If <code>cents&lt;1 &#124;&#124; cents&gt;10000</code> is truthy:
  - [L62](#l62) Throw <code>new Error('Allowance must be between $0.01 and $100.00.')</code>; normal execution stops until an enclosing catch handles it.
- [L63](#l63) Return to the caller: compute <code>cents/100</code> with the <code>/</code> operator.

<a id="fn-4036"></a>
### initializeBudget (66:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>name:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>allowanceUsd:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory=budgetDirectory(name)</code>: when omitted/undefined, initialize with <code>budgetDirectory(name)</code>.
- <code>now=Date.now()</code>: when omitted/undefined, initialize with <code>Date.now()</code>.

Local bindings (nested callback locals are documented with that callback):

- [L67](#l67) <code>allowanceMicroUsd</code>: call the named operation with the supplied arguments: <code>Math.round(allowanceUsd*1e6)</code>.
- [L69](#l69) <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse({version:2,name,allowanceMicroUsd,expires:PRICING_EXPIRES})</code>.

Execution:

- [L67](#l67) Bind <code>allowanceMicroUsd</code>: call the named operation with the supplied arguments: <code>Math.round(allowanceUsd*1e6)</code>.
- [L68](#l68) If <code>!Number.isFinite(allowanceUsd) &#124;&#124; Math.abs(allowanceMicroUsd/1e6-allowanceUsd)&gt;1e-10</code> is truthy:
  - [L68](#l68) Throw <code>new Error('Invalid allowance.')</code>; normal execution stops until an enclosing catch handles it.
- [L69](#l69) Bind <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse({version:2,name,allowanceMicroUsd,expires:PRICING_EXPIRES})</code>.
- [L70](#l70) If <code>now&lt;Date.parse(PRICING_START) &#124;&#124; now&gt;=Date.parse(PRICING_EXPIRES)</code> is truthy:
  - [L70](#l70) Throw <code>new AiFailure('pricing-expired','Refresh the shipped pricing policy before creating a new budget.')</code>; normal execution stops until an enclosing catch handles it.
- [L71](#l71) Run the protected block:
  - [L72](#l72) wait for <code>fs.mkdir(join(directory,'..'),{recursive:true})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L73](#l73) wait for <code>directoryIsReal(join(directory,'..'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L73](#l73) wait for <code>directoryIsReal(join(directory,'../..'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L74](#l74) wait for <code>fs.mkdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L75](#l75) wait for <code>writeExclusive(join(directory,'policy.json'),policy)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L71](#l71) If it throws:
  - [L76](#l76) Throw <code>new AiFailure('budget-init','Budget already exists or cannot be initialized. It has not been reset.')</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-4996"></a>
### budgetStatus (78:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>name:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory=budgetDirectory(name)</code>: when omitted/undefined, initialize with <code>budgetDirectory(name)</code>.

Local bindings (nested callback locals are documented with that callback):

- [L82](#l82) <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse(await readJson(join(directory,'policy.json')))</code>.
- [L84](#l84) <code>names</code>: wait for <code>fs.readdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L86](#l86) <code>attemptNames</code>: sort the receiver array in place using the comparator: <code>names.filter(file=&gt;file.endsWith('.attempt.json')).sort()</code>.
- [L89](#l89) <code>attempts</code>: create a new empty array to accumulate ordered results.
- [L90](#l90) <code>[index,file]</code>: receive the next iterable value from <code>attemptNames.entries()</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L91](#l91) <code>id</code>: call the named operation with the supplied arguments: <code>String(index+1).padStart(6,'0')</code>.
- [L93](#l93) <code>attempt</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>attemptSchema.parse(await readJson(join(directory,file)))</code>.
- [L94](#l94) <code>models</code>: test <code>policy.version===1</code>; choose <code>TRIAL_MODELS</code> when truthy, otherwise <code>AUDIT_MODELS</code>.
- [L95](#l95) <code>price</code>: test <code>policy.version===1</code>; choose <code>legacyUsageMicroUsd</code> when truthy, otherwise <code>auditUsageMicroUsd</code>.
- [L96](#l96) <code>reservation</code>: call the named operation with the supplied arguments: <code>Math.ceil(price(attempt.mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25)</code>.
- [L98](#l98) <code>receipt</code>: test <code>names.includes(&#96;${id}.receipt.json&#96;)</code>; choose <code>receiptSchema.parse(await readJson(join(directory,&#96;${id}.receipt.json&#96;)))</code> when truthy, otherwise <code>null</code>.
- [L99](#l99) <code>settlement</code>: test <code>names.includes(&#96;${id}.settlement.json&#96;)</code>; choose <code>settlementSchema.parse(await readJson(join(directory,&#96;${id}.settlement.json&#96;)))</code> when truthy, otherwise <code>null</code>.
- [L105](#l105) <code>reservedMicroUsd</code>: fold the sequence into the accumulator: <code>attempts.reduce((sum,attempt)=&gt;sum+attempt.reservedMicroUsd,0)</code>.

Execution:

- [L79](#l79) Run the protected block:
  - [L80](#l80) validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>budgetNameSchema.parse(name)</code>.
  - [L81](#l81) wait for <code>directoryIsReal(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L81](#l81) wait for <code>directoryIsReal(join(directory,'..'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L81](#l81) wait for <code>directoryIsReal(join(directory,'../..'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L82](#l82) Bind <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse(await readJson(join(directory,'policy.json')))</code>.
  - [L83](#l83) If <code>policy.name!==name</code> is truthy:
    - [L83](#l83) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L84](#l84) Bind <code>names</code>: wait for <code>fs.readdir(directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L85](#l85) If <code>names.length&gt;MAX_ATTEMPTS*2+2 &#124;&#124; names.some(file=&gt;!['policy.json','lock'].includes(file) &amp;&amp; !/^\d{6}\.(attempt&#124;receipt&#124;settlement)\.json$/.test(file))</code> is truthy:
    - [L85](#l85) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L86](#l86) Bind <code>attemptNames</code>: sort the receiver array in place using the comparator: <code>names.filter(file=&gt;file.endsWith('.attempt.json')).sort()</code>.
  - [L87](#l87) If <code>names.some(file=&gt;file.endsWith('.receipt.json') &amp;&amp; !names.includes(file.replace('.receipt.','.attempt.')))</code> is truthy:
    - [L87](#l87) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L88](#l88) If <code>names.some(file=&gt;file.endsWith('.settlement.json') &amp;&amp; !names.includes(file.replace('.settlement.','.attempt.')))</code> is truthy:
    - [L88](#l88) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L89](#l89) Bind <code>attempts</code>: create a new empty array to accumulate ordered results.
  - [L90](#l90) Iterate <code>attemptNames.entries()</code> values, binding <code>const [index,file]</code> for each iteration:
    - [L91](#l91) Bind <code>id</code>: call the named operation with the supplied arguments: <code>String(index+1).padStart(6,'0')</code>.
    - [L92](#l92) If <code>file!==&#96;${id}.attempt.json&#96;</code> is truthy:
      - [L92](#l92) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
    - [L93](#l93) Bind <code>attempt</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>attemptSchema.parse(await readJson(join(directory,file)))</code>.
    - [L94](#l94) Bind <code>models</code>: test <code>policy.version===1</code>; choose <code>TRIAL_MODELS</code> when truthy, otherwise <code>AUDIT_MODELS</code>.
    - [L95](#l95) Bind <code>price</code>: test <code>policy.version===1</code>; choose <code>legacyUsageMicroUsd</code> when truthy, otherwise <code>auditUsageMicroUsd</code>.
    - [L96](#l96) Bind <code>reservation</code>: call the named operation with the supplied arguments: <code>Math.ceil(price(attempt.mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25)</code>.
    - [L97](#l97) If <code>attempt.model!==models[attempt.mode].model &#124;&#124; attempt.reservedMicroUsd!==reservation</code> is truthy:
      - [L97](#l97) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
    - [L98](#l98) Bind <code>receipt</code>: test <code>names.includes(&#96;${id}.receipt.json&#96;)</code>; choose <code>receiptSchema.parse(await readJson(join(directory,&#96;${id}.receipt.json&#96;)))</code> when truthy, otherwise <code>null</code>.
    - [L99](#l99) Bind <code>settlement</code>: test <code>names.includes(&#96;${id}.settlement.json&#96;)</code>; choose <code>settlementSchema.parse(await readJson(join(directory,&#96;${id}.settlement.json&#96;)))</code> when truthy, otherwise <code>null</code>.
    - [L100](#l100) If <code>settlement &amp;&amp; (receipt &#124;&#124; settlement.chargedMicroUsd!==attempt.reservedMicroUsd)</code> is truthy:
      - [L100](#l100) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
    - [L101](#l101) If <code>receipt &amp;&amp; (receipt.pricedUsageUpperBoundMicroUsd!==price(attempt.mode,receipt.usage.input_tokens,receipt.usage.output_tokens) &#124;&#124; receipt.pricedUsageUpperBoundMicroUsd&gt;attempt.reservedMicroUsd)</code> is truthy:
      - [L102](#l102) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
    - [L103](#l103) append values to the existing array: <code>attempts.push({id,...attempt,receipt,settlement})</code>.
  - [L105](#l105) Bind <code>reservedMicroUsd</code>: fold the sequence into the accumulator: <code>attempts.reduce((sum,attempt)=&gt;sum+attempt.reservedMicroUsd,0)</code>.
  - [L106](#l106) If <code>reservedMicroUsd&gt;policy.allowanceMicroUsd</code> is truthy:
    - [L106](#l106) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L107](#l107) Return to the caller: create an object with 9 property/spread entries: <code>{name,allowanceUsd:policy.allowanceMicroUsd/1e6,reservedUsd:reservedMicroUsd/1e6, remainingUsd:(policy.allowanceMicroUsd-reservedMicroUsd)/1e6,expires:policy.expires, pricedUsageUpperBoundUsd:attempts.reduce((sum,attempt)=&gt;sum+(attempt.receipt?.pricedUsageU…</code>; later properties overwrite earlier spread values.
- [L79](#l79) If it throws:
  - [L111](#l111) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-5468"></a>
### names.some callback (85:52)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>names.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L85](#l85) Implicitly return: evaluate <code>!['policy.json','lock'].includes(file) &amp;&amp; !/^\d{6}\.(attempt&#124;receipt&#124;settlement)\.json$/.test(file)</code> left to right with falsy short-circuiting.

<a id="fn-5631"></a>
### names.filter callback (86:37)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>names.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L86](#l86) Implicitly return: call the named operation with the supplied arguments: <code>file.endsWith('.attempt.json')</code>.

<a id="fn-5695"></a>
### names.some callback (87:19)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>names.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L87](#l87) Implicitly return: evaluate <code>file.endsWith('.receipt.json') &amp;&amp; !names.includes(file.replace('.receipt.','.attempt.'))</code> left to right with falsy short-circuiting.

<a id="fn-5829"></a>
### names.some callback (88:19)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>names.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L88](#l88) Implicitly return: evaluate <code>file.endsWith('.settlement.json') &amp;&amp; !names.includes(file.replace('.settlement.','.attempt.'))</code> left to right with falsy short-circuiting.

<a id="fn-7301"></a>
### attempts.reduce callback (105:44)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>attempts.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>attempt</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L105](#l105) Implicitly return: compute <code>sum+attempt.reservedMicroUsd</code> with the <code>+</code> operator.

<a id="fn-7649"></a>
### attempts.reduce callback (109:48)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>attempts.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>attempt</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L109](#l109) Implicitly return: compute <code>sum+(attempt.receipt?.pricedUsageUpperBoundMicroUsd ?? 0)</code> with the <code>+</code> operator.

<a id="fn-7791"></a>
### attempts.some callback (110:62)

Synchronous function. Lexically inside [budgetStatus (78:8)](#fn-4996). Passed to <code>attempts.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>attempt</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L110](#l110) Implicitly return: evaluate <code>!attempt.receipt &amp;&amp; !attempt.settlement</code> left to right with falsy short-circuiting.

<a id="fn-7983"></a>
### settleBudgetAttempt (115:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>name:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>id:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory=budgetDirectory(name)</code>: when omitted/undefined, initialize with <code>budgetDirectory(name)</code>.

Local bindings (nested callback locals are documented with that callback):

- [L117](#l117) <code>lock</code>: leave the value undefined until a later assignment.
- [L119](#l119) <code>before</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L122](#l122) <code>state</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L123](#l123) <code>attempt</code>: return the first matching element, or undefined: <code>state.attempts.find(attempt=&gt;attempt.id===id)</code>.

Execution:

- [L116](#l116) If <code>!/^\d{6}$/.test(id)</code> is truthy:
  - [L116](#l116) Throw <code>new AiFailure('budget-settle','Use the six-digit attempt ID from budget status.')</code>; normal execution stops until an enclosing catch handles it.
- [L117](#l117) Bind <code>lock</code>: leave the value undefined until a later assignment.
- [L118](#l118) Run the protected block:
  - [L119](#l119) Bind <code>before</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L120](#l120) If <code>before.locked</code> is truthy:
    - [L120](#l120) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L121](#l121) update <code>lock</code> with <code>await fs.open(join(directory,'lock'),'wx',0o600)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L122](#l122) Bind <code>state</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L123](#l123) Bind <code>attempt</code>: return the first matching element, or undefined: <code>state.attempts.find(attempt=&gt;attempt.id===id)</code>.
  - [L124](#l124) If <code>!attempt &#124;&#124; attempt.receipt</code> is truthy:
    - [L124](#l124) Throw <code>new AiFailure('budget-settle','Only an unresolved attempt can be settled.')</code>; normal execution stops until an enclosing catch handles it.
  - [L125](#l125) If <code>attempt.settlement</code> is truthy:
    - [L125](#l125) Return undefined immediately; remaining statements in this function do not execute.
  - [L126](#l126) wait for <code>writeExclusive(join(directory,&#96;${id}.settlement.json&#96;),{action:'charge-full-reservation',chargedMicroUsd:attempt.reservedMicroUsd})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L118](#l118) If it throws, bind <code>error</code>:
  - [L127](#l127) If <code>error instanceof AiFailure</code> is truthy:
    - [L127](#l127) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
  - [L127](#l127) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
- [L118](#l118) Always run cleanup on leaving the try/catch, including return or throw:
  - [L128](#l128) If <code>lock</code> is truthy:
    - [L128](#l128) wait for <code>lock.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L128](#l128) wait for <code>fs.unlink(join(directory,'lock'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-8452"></a>
### state.attempts.find callback (123:39)

Synchronous function. Lexically inside [settleBudgetAttempt (115:8)](#fn-7983). Passed to <code>state.attempts.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>attempt</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L123](#l123) Implicitly return: compute <code>attempt.id===id</code> with the <code>===</code> operator.

<a id="fn-8985"></a>
### withAuditReservation (131:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>name:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>mode:AiMode</code>: supplied by the caller; usage is shown in the steps below.
- <code>requestHash:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>execute:()=&gt;Promise&lt;{value:T;usage:Usage}&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>directory=budgetDirectory(name)</code>: when omitted/undefined, initialize with <code>budgetDirectory(name)</code>.
- <code>now=Date.now()</code>: when omitted/undefined, initialize with <code>Date.now()</code>.

Local bindings (nested callback locals are documented with that callback):

- [L133](#l133) <code>lock</code>: leave the value undefined until a later assignment.
- [L136](#l136) <code>before</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L140](#l140) <code>state</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L142](#l142) <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse(await readJson(join(directory,'policy.json')))</code>.
- [L144](#l144) <code>reservedMicroUsd</code>: call the named operation with the supplied arguments: <code>auditReservationMicroUsd(mode)</code>.
- [L147](#l147) <code>id</code>: call the named operation with the supplied arguments: <code>String(state.attempts.length+1).padStart(6,'0')</code>.
- [L151](#l151) <code>result</code>: wait for <code>execute()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L152](#l152) <code>usage</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>auditUsageSchema.parse(result.usage)</code>.

Execution:

- [L133](#l133) Bind <code>lock</code>: leave the value undefined until a later assignment.
- [L134](#l134) Run the protected block:
  - [L135](#l135) validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>modeSchema.parse(mode)</code>.
  - [L136](#l136) Bind <code>before</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L137](#l137) If <code>before.locked &#124;&#124; before.unresolved</code> is truthy:
    - [L137](#l137) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L138](#l138) If <code>now&lt;Date.parse(PRICING_START) &#124;&#124; now&gt;=Date.parse(PRICING_EXPIRES) &#124;&#124; now&gt;=Date.parse(before.expires)</code> is truthy:
    - [L138](#l138) Throw <code>new AiFailure('pricing-expired','Pricing approval expired; historical budgets remain readable. A new budget requires a separately approved allowance; no request was sent.')</code>; normal execution stops until an enclosing catch handles it.
  - [L139](#l139) update <code>lock</code> with <code>await fs.open(join(directory,'lock'),'wx',0o600)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L140](#l140) Bind <code>state</code>: wait for <code>budgetStatus(name,directory)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L141](#l141) If <code>state.unresolved</code> is truthy:
    - [L141](#l141) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
  - [L142](#l142) Bind <code>policy</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>policySchema.parse(await readJson(join(directory,'policy.json')))</code>.
  - [L143](#l143) If <code>policy.version!==2</code> is truthy:
    - [L143](#l143) Throw <code>new AiFailure('pricing-expired','Legacy pricing policy is retired. Inspect the old ledger; explicitly approve a new named budget to continue.')</code>; normal execution stops until an enclosing catch handles it.
  - [L144](#l144) Bind <code>reservedMicroUsd</code>: call the named operation with the supplied arguments: <code>auditReservationMicroUsd(mode)</code>.
  - [L145](#l145) If <code>state.attempts.length&gt;=MAX_ATTEMPTS &#124;&#124; Math.round(state.remainingUsd*1e6)&lt;reservedMicroUsd</code> is truthy:
    - [L146](#l146) Throw <code>new AiFailure('budget-exhausted','Remaining allowance cannot reserve another request. Completed batches are retained.')</code>; normal execution stops until an enclosing catch handles it.
  - [L147](#l147) Bind <code>id</code>: call the named operation with the supplied arguments: <code>String(state.attempts.length+1).padStart(6,'0')</code>.
  - [L148](#l148) wait for <code>writeExclusive(join(directory,&#96;${id}.attempt.json&#96;),attemptSchema.parse({mode,model:AUDIT_MODELS[mode].model,reservedMicroUsd,requestHash}))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L151](#l151) Bind <code>result</code>: wait for <code>execute()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L152](#l152) Bind <code>usage</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>auditUsageSchema.parse(result.usage)</code>.
  - [L153](#l153) wait for <code>writeExclusive(join(directory,&#96;${id}.receipt.json&#96;),{usage,pricedUsageUpperBoundMicroUsd:auditUsageMicroUsd(mode,usage.input_tokens,usage.output_tokens)})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L154](#l154) Return to the caller: read <code>result.value</code>.
- [L134](#l134) If it throws, bind <code>error</code>:
  - [L155](#l155) If <code>error instanceof AiFailure</code> is truthy:
    - [L155](#l155) Throw <code>error</code>; normal execution stops until an enclosing catch handles it.
  - [L155](#l155) Throw <code>stateError()</code>; normal execution stops until an enclosing catch handles it.
- [L134](#l134) Always run cleanup on leaving the try/catch, including return or throw:
  - [L156](#l156) If <code>lock</code> is truthy:
    - [L156](#l156) wait for <code>lock.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L156](#l156) wait for <code>fs.unlink(join(directory,'lock'))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>auditUsageSchema</code> | <code>input_tokens</code> | <code>z.number().int().min(0).max(AUDIT_INPUT_LIMIT)</code> | [L24](#l24) |
| <code>auditUsageSchema</code> | <code>output_tokens</code> | <code>z.number().int().min(0).max(AUDIT_OUTPUT_LIMIT)</code> | [L25](#l25) |
| <code>policySchema</code> | <code>version</code> | <code>z.union([z.literal(1),z.literal(2)])</code> | [L29](#l29) |
| <code>policySchema</code> | <code>name</code> | <code>budgetNameSchema</code> | [L29](#l29) |
| <code>policySchema</code> | <code>allowanceMicroUsd</code> | <code>z.number().int().min(10000).max(100000000).multipleOf(10000)</code> | [L30](#l30) |
| <code>policySchema</code> | <code>expires</code> | <code>z.string()</code> | [L31](#l31) |
| <code>attemptSchema</code> | <code>mode</code> | <code>modeSchema</code> | [L32](#l32) |
| <code>attemptSchema</code> | <code>model</code> | <code>z.string()</code> | [L32](#l32) |
| <code>attemptSchema</code> | <code>reservedMicroUsd</code> | <code>z.number().int().positive()</code> | [L32](#l32) |
| <code>attemptSchema</code> | <code>requestHash</code> | <code>z.string().regex(/^[a-f0-9]{64}$/)</code> | [L33](#l33) |
| <code>receiptSchema</code> | <code>usage</code> | <code>auditUsageSchema</code> | [L34](#l34) |
| <code>receiptSchema</code> | <code>pricedUsageUpperBoundMicroUsd</code> | <code>z.number().int().nonnegative()</code> | [L34](#l34) |
| <code>settlementSchema</code> | <code>action</code> | <code>z.literal('charge-full-reservation')</code> | [L35](#l35) |
| <code>settlementSchema</code> | <code>chargedMicroUsd</code> | <code>z.number().int().positive()</code> | [L35](#l35) |

## Compile-time data contracts

### Usage

```typescript
type Usage=z.infer<typeof auditUsageSchema>;
```

Declared at [L26](#l26). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L11](#l11) <code>AUDIT_MODELS</code>: create an object with 3 property/spread entries: <code>{ 'low-cost':{model:'gpt-6-luna',input:0.125,output:0.5}, balanced:{model:'gpt-6-sol',input:2.5,output:10}, 'high-quality':{model:'gpt-6-astra',input:12.5,output:50}, }</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L16](#l16) <code>auditUsageMicroUsd</code>: create [auditUsageMicroUsd (16:33)](#fn-719); its body runs when called, not when this value is created.
- [L17](#l17) <code>AUDIT_INPUT_LIMIT</code>: use the literal <code>32000</code>.
- [L18](#l18) <code>AUDIT_OUTPUT_LIMIT</code>: use the literal <code>2000</code>.
- [L19](#l19) <code>PRICING_EXPIRES</code>: use the literal <code>'2026-10-30T00:00:00.000Z'</code>.
- [L20](#l20) <code>PRICING_START</code>: use the literal <code>'2026-09-30T00:00:00.000Z'</code>.
- [L21](#l21) <code>MAX_ATTEMPTS</code>: use the literal <code>1000</code>.
- [L22](#l22) <code>budgetNameSchema</code>: call the named operation with the supplied arguments: <code>z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine( value=&gt;! /^(con&#124;prn&#124;aux&#124;nul&#124;com[1-9]&#124;lpt[1-9])$/.test(value),'Reserved name.')</code>.
- [L24](#l24) <code>auditUsageSchema</code>: call the named operation with the supplied arguments: <code>z.object({input_tokens:z.number().int().min(0).max(AUDIT_INPUT_LIMIT), output_tokens:z.number().int().min(0).max(AUDIT_OUTPUT_LIMIT)})</code>.
- [L27](#l27) <code>auditReservationMicroUsd</code>: create [auditReservationMicroUsd (27:39)](#fn-1457); its body runs when called, not when this value is created.
- [L28](#l28) <code>budgetDirectory</code>: create [budgetDirectory (28:30)](#fn-1580); its body runs when called, not when this value is created.
- [L29](#l29) <code>policySchema</code>: call the named operation with the supplied arguments: <code>z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema, allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000), expires:z.string()}).strict().refine(policy=&gt;policy.expires===(policy.version===1?'2026-10-03T00:00…</code>.
- [L32](#l32) <code>attemptSchema</code>: call the named operation with the supplied arguments: <code>z.object({mode:modeSchema,model:z.string(),reservedMicroUsd:z.number().int().positive(), requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict()</code>.
- [L34](#l34) <code>receiptSchema</code>: call the named operation with the supplied arguments: <code>z.object({usage:auditUsageSchema,pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict()</code>.
- [L35](#l35) <code>settlementSchema</code>: call the named operation with the supplied arguments: <code>z.object({action:z.literal('charge-full-reservation'),chargedMicroUsd:z.number().int().positive()}).strict()</code>.
- [L36](#l36) <code>stateError</code>: create [stateError (36:18)](#fn-2419); its body runs when called, not when this value is created.

## Directly importing tests

- [audit-budget.test.ts](../../test/audit-budget.test.ts)

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
   7 | import { TRIAL_MODELS, usageMicroUsd as legacyUsageMicroUsd } from './trial-budget.js';
   8 | 
   9 | // Immutable policy versions: retain legacy rates for historical receipts.
  10 | // Standard short-context pricing rechecked 2026-09-30; no tools/premium tier.
  11 | export const AUDIT_MODELS={
  12 |   'low-cost':{model:'gpt-6-luna',input:0.125,output:0.5},
  13 |   balanced:{model:'gpt-6-sol',input:2.5,output:10},
  14 |   'high-quality':{model:'gpt-6-astra',input:12.5,output:50},
  15 | } as const;
  16 | export const auditUsageMicroUsd=(mode:AiMode,input:number,output:number)=>Math.ceil(input*AUDIT_MODELS[mode].input+output*AUDIT_MODELS[mode].output);
  17 | export const AUDIT_INPUT_LIMIT=32000;
  18 | export const AUDIT_OUTPUT_LIMIT=2000;
  19 | export const PRICING_EXPIRES='2026-10-30T00:00:00.000Z';
  20 | const PRICING_START='2026-09-30T00:00:00.000Z';
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
<a id="l35"></a>
<a id="l36"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | const MAX_ATTEMPTS=1000;
  22 | export const budgetNameSchema=z.string().regex(/^[a-z][a-z0-9-]{0,47}$/).refine(
  23 |   value=>! /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(value),'Reserved name.');
  24 | export const auditUsageSchema=z.object({input_tokens:z.number().int().min(0).max(AUDIT_INPUT_LIMIT),
  25 |   output_tokens:z.number().int().min(0).max(AUDIT_OUTPUT_LIMIT)});
  26 | type Usage=z.infer<typeof auditUsageSchema>;
  27 | export const auditReservationMicroUsd=(mode:AiMode)=>Math.ceil(auditUsageMicroUsd(mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25);
  28 | export const budgetDirectory=(name:string)=>join(homedir(),'.shipcheck','budgets',budgetNameSchema.parse(name));
  29 | const policySchema=z.object({version:z.union([z.literal(1),z.literal(2)]),name:budgetNameSchema,
  30 |   allowanceMicroUsd:z.number().int().min(10000).max(100000000).multipleOf(10000),
  31 |   expires:z.string()}).strict().refine(policy=>policy.expires===(policy.version===1?'2026-10-03T00:00:00.000Z':PRICING_EXPIRES));
  32 | const attemptSchema=z.object({mode:modeSchema,model:z.string(),reservedMicroUsd:z.number().int().positive(),
  33 |   requestHash:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
  34 | const receiptSchema=z.object({usage:auditUsageSchema,pricedUsageUpperBoundMicroUsd:z.number().int().nonnegative()}).strict();
  35 | const settlementSchema=z.object({action:z.literal('charge-full-reservation'),chargedMicroUsd:z.number().int().positive()}).strict();
  36 | const stateError=()=>new AiFailure('budget-state','Budget state is missing, invalid, locked, or unresolved. Inspect shipcheck budget status; no automatic reset is allowed.');
  37 | 
  38 | async function directoryIsReal(directory:string) {
  39 |   const stat=await fs.lstat(directory);
  40 |   if(!stat.isDirectory() || stat.isSymbolicLink())throw stateError();
```

<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
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
<a id="l59"></a>
<a id="l60"></a>

```text
  41 | }
  42 | async function writeExclusive(path:string,value:unknown) {
  43 |   const handle=await fs.open(path,'wx',0o600);
  44 |   try {await handle.writeFile(JSON.stringify(value)+'\n');await handle.sync();}
  45 |   finally {await handle.close();}
  46 | }
  47 | async function readJson(path:string):Promise<unknown> {
  48 |   const stat=await fs.lstat(path);
  49 |   if(!stat.isFile() || stat.isSymbolicLink() || stat.size>8192)throw stateError();
  50 |   const handle=await fs.open(path,'r');
  51 |   try {
  52 |     if(!(await handle.stat()).isFile())throw stateError();
  53 |     const buffer=Buffer.alloc(8193);let size=0;
  54 |     while(size<buffer.length) {const read=await handle.read(buffer,size,buffer.length-size,null);if(!read.bytesRead)break;size+=read.bytesRead;}
  55 |     if(size>8192)throw stateError();
  56 |     return JSON.parse(buffer.subarray(0,size).toString('utf8'));
  57 |   } finally {await handle.close();}
  58 | }
  59 | export function parseAllowanceUsd(value:string):number {
  60 |   if(!/^(?:0|[1-9]\d{0,2})(?:\.\d{1,2})?$/.test(value))throw new Error('Allowance must be a USD amount from 0.01 to 100.00, with at most two decimals.');
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   const cents=Math.round(Number(value)*100);
  62 |   if(cents<1 || cents>10000)throw new Error('Allowance must be between $0.01 and $100.00.');
  63 |   return cents/100;
  64 | }
  65 | /** Directory/clock arguments are test seams, never repository configuration. */
  66 | export async function initializeBudget(name:string,allowanceUsd:number,directory=budgetDirectory(name),now=Date.now()) {
  67 |   const allowanceMicroUsd=Math.round(allowanceUsd*1e6);
  68 |   if(!Number.isFinite(allowanceUsd) || Math.abs(allowanceMicroUsd/1e6-allowanceUsd)>1e-10)throw new Error('Invalid allowance.');
  69 |   const policy=policySchema.parse({version:2,name,allowanceMicroUsd,expires:PRICING_EXPIRES});
  70 |   if(now<Date.parse(PRICING_START) || now>=Date.parse(PRICING_EXPIRES))throw new AiFailure('pricing-expired','Refresh the shipped pricing policy before creating a new budget.');
  71 |   try {
  72 |     await fs.mkdir(join(directory,'..'),{recursive:true});
  73 |     await directoryIsReal(join(directory,'..'));await directoryIsReal(join(directory,'../..'));
  74 |     await fs.mkdir(directory);
  75 |     await writeExclusive(join(directory,'policy.json'),policy);
  76 |   } catch {throw new AiFailure('budget-init','Budget already exists or cannot be initialized. It has not been reset.');}
  77 | }
  78 | export async function budgetStatus(name:string,directory=budgetDirectory(name)) {
  79 |   try {
  80 |     budgetNameSchema.parse(name);
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
  81 |     await directoryIsReal(directory);await directoryIsReal(join(directory,'..'));await directoryIsReal(join(directory,'../..'));
  82 |     const policy=policySchema.parse(await readJson(join(directory,'policy.json')));
  83 |     if(policy.name!==name)throw stateError();
  84 |     const names=await fs.readdir(directory);
  85 |     if(names.length>MAX_ATTEMPTS*2+2 || names.some(file=>!['policy.json','lock'].includes(file) && !/^\d{6}\.(attempt|receipt|settlement)\.json$/.test(file)))throw stateError();
  86 |     const attemptNames=names.filter(file=>file.endsWith('.attempt.json')).sort();
  87 |     if(names.some(file=>file.endsWith('.receipt.json') && !names.includes(file.replace('.receipt.','.attempt.'))))throw stateError();
  88 |     if(names.some(file=>file.endsWith('.settlement.json') && !names.includes(file.replace('.settlement.','.attempt.'))))throw stateError();
  89 |     const attempts=[];
  90 |     for(const [index,file] of attemptNames.entries()) {
  91 |       const id=String(index+1).padStart(6,'0');
  92 |       if(file!==`${id}.attempt.json`)throw stateError();
  93 |       const attempt=attemptSchema.parse(await readJson(join(directory,file)));
  94 |       const models=policy.version===1?TRIAL_MODELS:AUDIT_MODELS;
  95 |       const price=policy.version===1?legacyUsageMicroUsd:auditUsageMicroUsd;
  96 |       const reservation=Math.ceil(price(attempt.mode,AUDIT_INPUT_LIMIT,AUDIT_OUTPUT_LIMIT)*1.25);
  97 |       if(attempt.model!==models[attempt.mode].model || attempt.reservedMicroUsd!==reservation)throw stateError();
  98 |       const receipt=names.includes(`${id}.receipt.json`)?receiptSchema.parse(await readJson(join(directory,`${id}.receipt.json`))):null;
  99 |       const settlement=names.includes(`${id}.settlement.json`)?settlementSchema.parse(await readJson(join(directory,`${id}.settlement.json`))):null;
 100 |       if(settlement && (receipt || settlement.chargedMicroUsd!==attempt.reservedMicroUsd))throw stateError();
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l111"></a>
<a id="l115"></a>
<a id="l116"></a>
<a id="l117"></a>
<a id="l118"></a>
<a id="l119"></a>
<a id="l120"></a>

```text
 101 |       if(receipt && (receipt.pricedUsageUpperBoundMicroUsd!==price(attempt.mode,receipt.usage.input_tokens,receipt.usage.output_tokens)
 102 |         || receipt.pricedUsageUpperBoundMicroUsd>attempt.reservedMicroUsd))throw stateError();
 103 |       attempts.push({id,...attempt,receipt,settlement});
 104 |     }
 105 |     const reservedMicroUsd=attempts.reduce((sum,attempt)=>sum+attempt.reservedMicroUsd,0);
 106 |     if(reservedMicroUsd>policy.allowanceMicroUsd)throw stateError();
 107 |     return {name,allowanceUsd:policy.allowanceMicroUsd/1e6,reservedUsd:reservedMicroUsd/1e6,
 108 |       remainingUsd:(policy.allowanceMicroUsd-reservedMicroUsd)/1e6,expires:policy.expires,
 109 |       pricedUsageUpperBoundUsd:attempts.reduce((sum,attempt)=>sum+(attempt.receipt?.pricedUsageUpperBoundMicroUsd ?? 0),0)/1e6,
 110 |       locked:names.includes('lock'),unresolved:attempts.some(attempt=>!attempt.receipt && !attempt.settlement),attempts};
 111 |   } catch {throw stateError();}
 112 | }
 113 | 
 114 | /** Explicit recovery: retains the entire charge, never invents usage or frees funds. */
 115 | export async function settleBudgetAttempt(name:string,id:string,directory=budgetDirectory(name)) {
 116 |   if(!/^\d{6}$/.test(id))throw new AiFailure('budget-settle','Use the six-digit attempt ID from budget status.');
 117 |   let lock;
 118 |   try {
 119 |     const before=await budgetStatus(name,directory);
 120 |     if(before.locked)throw stateError();
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>
<a id="l131"></a>
<a id="l132"></a>
<a id="l133"></a>
<a id="l134"></a>
<a id="l135"></a>
<a id="l136"></a>
<a id="l137"></a>
<a id="l138"></a>
<a id="l139"></a>
<a id="l140"></a>

```text
 121 |     lock=await fs.open(join(directory,'lock'),'wx',0o600);
 122 |     const state=await budgetStatus(name,directory);
 123 |     const attempt=state.attempts.find(attempt=>attempt.id===id);
 124 |     if(!attempt || attempt.receipt)throw new AiFailure('budget-settle','Only an unresolved attempt can be settled.');
 125 |     if(attempt.settlement)return; // Idempotent; no mutation or refund.
 126 |     await writeExclusive(join(directory,`${id}.settlement.json`),{action:'charge-full-reservation',chargedMicroUsd:attempt.reservedMicroUsd});
 127 |   } catch(error) {if(error instanceof AiFailure)throw error;throw stateError();}
 128 |   finally {if(lock){await lock.close();await fs.unlink(join(directory,'lock'));}}
 129 | }
 130 | 
 131 | export async function withAuditReservation<T>(name:string,mode:AiMode,requestHash:string,
 132 |   execute:()=>Promise<{value:T;usage:Usage}>,directory=budgetDirectory(name),now=Date.now()):Promise<T> {
 133 |   let lock;
 134 |   try {
 135 |     modeSchema.parse(mode);
 136 |     const before=await budgetStatus(name,directory);
 137 |     if(before.locked || before.unresolved)throw stateError();
 138 |     if(now<Date.parse(PRICING_START) || now>=Date.parse(PRICING_EXPIRES) || now>=Date.parse(before.expires))throw new AiFailure('pricing-expired','Pricing approval expired; historical budgets remain readable. A new budget requires a separately approved allowance; no request was sent.');
 139 |     lock=await fs.open(join(directory,'lock'),'wx',0o600);
 140 |     const state=await budgetStatus(name,directory);
```

<a id="l141"></a>
<a id="l142"></a>
<a id="l143"></a>
<a id="l144"></a>
<a id="l145"></a>
<a id="l146"></a>
<a id="l147"></a>
<a id="l148"></a>
<a id="l151"></a>
<a id="l152"></a>
<a id="l153"></a>
<a id="l154"></a>
<a id="l155"></a>
<a id="l156"></a>

```text
 141 |     if(state.unresolved)throw stateError();
 142 |     const policy=policySchema.parse(await readJson(join(directory,'policy.json')));
 143 |     if(policy.version!==2)throw new AiFailure('pricing-expired','Legacy pricing policy is retired. Inspect the old ledger; explicitly approve a new named budget to continue.');
 144 |     const reservedMicroUsd=auditReservationMicroUsd(mode);
 145 |     if(state.attempts.length>=MAX_ATTEMPTS || Math.round(state.remainingUsd*1e6)<reservedMicroUsd)
 146 |       throw new AiFailure('budget-exhausted','Remaining allowance cannot reserve another request. Completed batches are retained.');
 147 |     const id=String(state.attempts.length+1).padStart(6,'0');
 148 |     await writeExclusive(join(directory,`${id}.attempt.json`),attemptSchema.parse({mode,model:AUDIT_MODELS[mode].model,reservedMicroUsd,requestHash}));
 149 |     // Full worst-case reservation remains consumed even after a successful receipt.
 150 |     // Crashes/failures leave uncertainty durable and block this allowance.
 151 |     const result=await execute();
 152 |     const usage=auditUsageSchema.parse(result.usage);
 153 |     await writeExclusive(join(directory,`${id}.receipt.json`),{usage,pricedUsageUpperBoundMicroUsd:auditUsageMicroUsd(mode,usage.input_tokens,usage.output_tokens)});
 154 |     return result.value;
 155 |   } catch(error) {if(error instanceof AiFailure)throw error;throw stateError();}
 156 |   finally {if(lock){await lock.close();await fs.unlink(join(directory,'lock'));}}
 157 | }
 158 | 
```
