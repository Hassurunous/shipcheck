# src/checks.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Each authorized check runs sequentially as a direct child with shell:false. A shared byte counter caps stdout and stderr together while separate arrays preserve parseable stdout. finish is idempotent, redacts inherited secret values and optionally parses diagnostics. stop prevents races with close events and requests process-tree termination before resolving an operational error. Removing credential environment variables does not sandbox arbitrary commands.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `1a6dfa2af954e49389b294d3d3cb7d94347c4932a21d5cb7a7cdb4bbdb27fecd`.

This chapter inventories **21 function bodies/callbacks**, **30 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:child_process</code>: <code>spawn</code>.
- <code>zod</code>: <code>z</code>.
- <code>./check-diagnostics.js</code>: <code>diagnosticSchema</code>, <code>parseDiagnostics</code>, <code>exceedsThreshold</code>.
- <code>./check-process.js</code>: <code>terminateCheckTree</code>.

## Module execution

- [L6](#l6) Bind <code>checkSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().…</code>.
- [L21](#l21) Bind <code>checksSchema</code>: call the named operation with the supplied arguments: <code>z.array(checkSchema).max(20).default([]).refine( checks=&gt;new Set(checks.map(check=&gt;check.id)).size===checks.length,'Check IDs must be unique.')</code>.
- [L23](#l23) Bind <code>checkResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),status:z.enum(['skipped','passed','failed','error']), exitCode:z.number().int().nullable(),reason:z.string(),output:z.string(), scope:z.literal('whole-repository'), diagnostics:z.array(diagnosticSchema).optional(), stdout:z.string()…</code>.

## Function index

- [z.string().min(1).max(1024).refine callback (8:46)](#fn-358)
- [z.string().max(4096).refine callback (9:44)](#fn-432)
- [z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().… callback (16:25)](#fn-946)
- [check.args.some callback (17:22)](#fn-986)
- [z.array(checkSchema).max(20).default([]).refine callback (22:3)](#fn-1425)
- [checks.map callback (22:30)](#fn-1452)
- [runChecks (33:8)](#fn-2019)
- [check.languages.some callback (39:72)](#fn-2556)
- [Promise callback (42:49)](#fn-2860)
- [Object.entries(env).filter callback (45:48)](#fn-3048)
- [finish (54:20)](#fn-3478)
- [redact (60:22)](#fn-3821)
- [secrets.reduce callback (60:53)](#fn-3852)
- [stop (75:18)](#fn-5047)
- [terminateCheckTree(child).then callback (79:45)](#fn-5243)
- [capture (81:21)](#fn-5405)
- [child.stdout.on callback (89:30)](#fn-5783)
- [child.stderr.on callback (89:89)](#fn-5842)
- [child.on callback (90:24)](#fn-5902)
- [child.on callback (91:24)](#fn-6026)
- [setTimeout callback (93:24)](#fn-6352)

<a id="fn-358"></a>
### z.string().min(1).max(1024).refine callback (8:46)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(1024).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L8](#l8) Implicitly return: apply <code>!</code> to <code>value.includes('\0')</code>.

<a id="fn-432"></a>
### z.string().max(4096).refine callback (9:44)

Synchronous function. Defined in module scope. Passed to <code>z.string().max(4096).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: apply <code>!</code> to <code>value.includes('\0')</code>.

<a id="fn-946"></a>
### z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().… callback (16:25)

Synchronous function. Defined in module scope. Passed to <code>z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.
- <code>context</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L17](#l17) If <code>check.args.some(arg=&gt;/^--(?:fix&#124;fix-only&#124;unsafe-fixes&#124;write)(?:=&#124;$)/i.test(arg))</code> is truthy:
  - [L18](#l18) call the named operation with the supplied arguments: <code>context.addIssue({code:'custom',path:['args'],message:'Inspection checks must not use recognized fix/write flags.'})</code>.
- [L19](#l19) If <code>check.format==='text' &amp;&amp; check.failOn!=='error'</code> is truthy:
  - [L19](#l19) call the named operation with the supplied arguments: <code>context.addIssue({code:'custom',path:['failOn'],message:'Severity thresholds require a structured JSON format.'})</code>.

<a id="fn-986"></a>
### check.args.some callback (17:22)

Synchronous function. Lexically inside [z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().… callback (16:25)](#fn-946). Passed to <code>check.args.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>arg</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L17](#l17) Implicitly return: evaluate a regular expression against the value: <code>/^--(?:fix&#124;fix-only&#124;unsafe-fixes&#124;write)(?:=&#124;$)/i.test(arg)</code>.

<a id="fn-1425"></a>
### z.array(checkSchema).max(20).default([]).refine callback (22:3)

Synchronous function. Defined in module scope. Passed to <code>z.array(checkSchema).max(20).default([]).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>checks</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L22](#l22) Implicitly return: compute <code>new Set(checks.map(check=&gt;check.id)).size===checks.length</code> with the <code>===</code> operator.

<a id="fn-1452"></a>
### checks.map callback (22:30)

Synchronous function. Lexically inside [z.array(checkSchema).max(20).default([]).refine callback (22:3)](#fn-1425). Passed to <code>checks.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L22](#l22) Implicitly return: read <code>check.id</code>.

<a id="fn-2019"></a>
### runChecks (33:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>checks:z.infer&lt;typeof checksSchema&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>authorized:boolean</code>: supplied by the caller; usage is shown in the steps below.
- <code>credentialEnv='SHIPCHECK_API_KEY'</code>: when omitted/undefined, initialize with <code>'SHIPCHECK_API_KEY'</code>.
- <code>detectedLanguages?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L35](#l35) <code>results:CheckResult[]</code>: create a new empty array to accumulate ordered results.
- [L36](#l36) <code>check</code>: receive the next iterable value from <code>checks</code> at the start of each loop iteration.
- [L37](#l37) <code>base</code>: create an object with 4 property/spread entries: <code>{id:check.id,exitCode:null,output:'',scope:'whole-repository' as const}</code>; later properties overwrite earlier spread values.
- [L42](#l42) <code>result</code>: wait for <code>new Promise&lt;CheckResult&gt;(resolve=&gt; { // Avoid forwarding API credentials to linters; commands still run with user privileges. const env={...process.env}; const secrets=Object.entries(env).filter(([name,value])=&gt;value &amp;&amp; (name.toUpperCase()===credentialEnv.t…</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L35](#l35) Bind <code>results:CheckResult[]</code>: create a new empty array to accumulate ordered results.
- [L36](#l36) Iterate <code>checks</code> values, binding <code>const check</code> for each iteration:
  - [L37](#l37) Bind <code>base</code>: create an object with 4 property/spread entries: <code>{id:check.id,exitCode:null,output:'',scope:'whole-repository' as const}</code>; later properties overwrite earlier spread values.
  - [L38](#l38) If <code>!authorized</code> is truthy:
    - [L38](#l38) append values to the existing array: <code>results.push({...base,status:'skipped',reason:'Requires --run-checks authorization.'})</code>.
    - [L38](#l38) Skip the rest of this iteration and advance the enclosing loop.
  - [L39](#l39) If <code>check.languages &amp;&amp; (!detectedLanguages &#124;&#124; !check.languages.some(language=&gt;detectedLanguages.includes(language)))</code> is truthy:
    - [L40](#l40) append values to the existing array: <code>results.push({...base,status:'skipped',reason:detectedLanguages?'No configured language detected in the inspected inventory.':'Language selection requires an inspected inventory.'})</code>.
    - [L40](#l40) Skip the rest of this iteration and advance the enclosing loop.
  - [L42](#l42) Bind <code>result</code>: wait for <code>new Promise&lt;CheckResult&gt;(resolve=&gt; { // Avoid forwarding API credentials to linters; commands still run with user privileges. const env={...process.env}; const secrets=Object.entries(env).filter(([name,value])=&gt;value &amp;&amp; (name.toUpperCase()===credentialEnv.t…</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L95](#l95) append values to the existing array: <code>results.push(result)</code>.
- [L97](#l97) Return to the caller: evaluate <code>results</code>.

<a id="fn-2556"></a>
### check.languages.some callback (39:72)

Synchronous function. Lexically inside [runChecks (33:8)](#fn-2019). Passed to <code>check.languages.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>language</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L39](#l39) Implicitly return: call the named operation with the supplied arguments: <code>detectedLanguages.includes(language)</code>.

<a id="fn-2860"></a>
### Promise callback (42:49)

Synchronous function. Lexically inside [runChecks (33:8)](#fn-2019). 

Parameters:

- <code>resolve</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L44](#l44) <code>env</code>: create an object with 1 property/spread entries: <code>{...process.env}</code>; later properties overwrite earlier spread values.
- [L45](#l45) <code>secrets</code>: retain only elements whose callback returns a truthy value: <code>Object.entries(env).filter(([name,value])=&gt;value &amp;&amp; (name.toUpperCase()===credentialEnv.toUpperCase() &#124;&#124; /KEY&#124;TOKEN&#124;SECRET&#124;PASSWORD/i.test(name)))</code>.
- [L47](#l47) <code>[name]</code>: receive the next iterable value from <code>secrets</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L48](#l48) <code>chunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L49](#l49) <code>stdoutChunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L49](#l49) <code>stderrChunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) <code>bytes</code>: use the literal <code>0</code>.
- [L51](#l51) <code>finished</code>: use the literal <code>false</code>.
- [L52](#l52) <code>stopping</code>: use the literal <code>false</code>.
- [L53](#l53) <code>timer:ReturnType&lt;typeof setTimeout&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
- [L54](#l54) <code>finish</code>: create [finish (54:20)](#fn-3478); its body runs when called, not when this value is created.
- [L74](#l74) <code>child</code>: call the named operation with the supplied arguments: <code>spawn(check.command,check.args,{cwd:root,env,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']})</code>.
- [L75](#l75) <code>stop</code>: create [stop (75:18)](#fn-5047); its body runs when called, not when this value is created.
- [L81](#l81) <code>capture</code>: create [capture (81:21)](#fn-5405); its body runs when called, not when this value is created.

Execution:

- [L44](#l44) Bind <code>env</code>: create an object with 1 property/spread entries: <code>{...process.env}</code>; later properties overwrite earlier spread values.
- [L45](#l45) Bind <code>secrets</code>: retain only elements whose callback returns a truthy value: <code>Object.entries(env).filter(([name,value])=&gt;value &amp;&amp; (name.toUpperCase()===credentialEnv.toUpperCase() &#124;&#124; /KEY&#124;TOKEN&#124;SECRET&#124;PASSWORD/i.test(name)))</code>.
- [L47](#l47) Iterate <code>secrets</code> values, binding <code>const [name]</code> for each iteration:
  - [L47](#l47) apply <code>delete</code> to <code>env[name]</code>.
- [L48](#l48) Bind <code>chunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L49](#l49) Bind <code>stdoutChunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L49](#l49) Bind <code>stderrChunks:Buffer[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) Bind <code>bytes</code>: use the literal <code>0</code>.
- [L51](#l51) Bind <code>finished</code>: use the literal <code>false</code>.
- [L52](#l52) Bind <code>stopping</code>: use the literal <code>false</code>.
- [L53](#l53) Bind <code>timer:ReturnType&lt;typeof setTimeout&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
- [L54](#l54) Bind <code>finish</code>: create [finish (54:20)](#fn-3478); its body runs when called, not when this value is created.
- [L74](#l74) Bind <code>child</code>: call the named operation with the supplied arguments: <code>spawn(check.command,check.args,{cwd:root,env,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']})</code>.
- [L75](#l75) Bind <code>stop</code>: create [stop (75:18)](#fn-5047); its body runs when called, not when this value is created.
- [L81](#l81) Bind <code>capture</code>: create [capture (81:21)](#fn-5405); its body runs when called, not when this value is created.
- [L89](#l89) call the named operation with the supplied arguments: <code>child.stdout.on('data',chunk=&gt;capture(chunk,stdoutChunks))</code>.
- [L89](#l89) call the named operation with the supplied arguments: <code>child.stderr.on('data',chunk=&gt;capture(chunk,stderrChunks))</code>.
- [L90](#l90) call the named operation with the supplied arguments: <code>child.on('error',()=&gt;{if(!stopping)finish('error','Could not launch check. Verify the executable and arguments.');})</code>.
- [L91](#l91) call the named operation with the supplied arguments: <code>child.on('close',code=&gt;{if(!stopping)finish(code===0?'passed':code!==null &amp;&amp; check.failureExitCodes.includes(code)?'failed':'error', code===0?'Command exited successfully.':code!==null &amp;&amp; check.failureExitCodes.includes(code)?'Command reported check failure…</code>.
- [L93](#l93) update <code>timer</code> with <code>setTimeout(()=&gt;stop('Timeout exceeded.'),check.timeoutMs)</code> using <code>=</code>; this mutation is visible to later statements.

<a id="fn-3048"></a>
### Object.entries(env).filter callback (45:48)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>Object.entries(env).filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>[name,value]</code>: destructure the supplied value into these local bindings.

Execution:

[L45](#l45) Implicitly return: evaluate <code>value &amp;&amp; (name.toUpperCase()===credentialEnv.toUpperCase() &#124;&#124; /KEY&#124;TOKEN&#124;SECRET&#124;PASSWORD/i.test(name))</code> left to right with falsy short-circuiting.

<a id="fn-3478"></a>
### finish (54:20)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). 

Parameters:

- <code>status:CheckResult['status']</code>: supplied by the caller; usage is shown in the steps below.
- <code>reason:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>exitCode:number&#124;null=null</code>: when omitted/undefined, initialize with <code>null</code>.

Local bindings (nested callback locals are documented with that callback):

- [L58](#l58) <code>output</code>: function toString() { [native code] }: <code>Buffer.concat(chunks).toString('utf8')</code>.
- [L59](#l59) <code>[,secret]</code>: receive the next iterable value from <code>secrets</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L60](#l60) <code>redact</code>: create [redact (60:22)](#fn-3821); its body runs when called, not when this value is created.
- [L61](#l61) <code>stdout</code>: call the named operation with the supplied arguments: <code>redact(Buffer.concat(stdoutChunks).toString('utf8'))</code>.
- [L62](#l62) <code>stderr</code>: call the named operation with the supplied arguments: <code>redact(Buffer.concat(stderrChunks).toString('utf8'))</code>.
- [L63](#l63) <code>diagnostics:NonNullable&lt;CheckResult['diagnostics']&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
- [L67](#l67) <code>failed</code>: evaluate <code>exceedsThreshold(diagnostics,check.failOn) &#124;&#124; (exitCode!==0 &amp;&amp; diagnostics.length===0)</code> left to right with truthy short-circuiting.

Execution:

- [L55](#l55) If <code>finished</code> is truthy:
  - [L55](#l55) Return undefined immediately; remaining statements in this function do not execute.
- [L56](#l56) update <code>finished</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
- [L57](#l57) If <code>timer</code> is truthy:
  - [L57](#l57) call the named operation with the supplied arguments: <code>clearTimeout(timer)</code>.
- [L58](#l58) Bind <code>output</code>: function toString() { [native code] }: <code>Buffer.concat(chunks).toString('utf8')</code>.
- [L59](#l59) Iterate <code>secrets</code> values, binding <code>const [,secret]</code> for each iteration:
  - [L59](#l59) If <code>secret</code> is truthy:
    - [L59](#l59) update <code>output</code> with <code>output.split(secret).join('[REDACTED]')</code> using <code>=</code>; this mutation is visible to later statements.
- [L60](#l60) Bind <code>redact</code>: create [redact (60:22)](#fn-3821); its body runs when called, not when this value is created.
- [L61](#l61) Bind <code>stdout</code>: call the named operation with the supplied arguments: <code>redact(Buffer.concat(stdoutChunks).toString('utf8'))</code>.
- [L62](#l62) Bind <code>stderr</code>: call the named operation with the supplied arguments: <code>redact(Buffer.concat(stderrChunks).toString('utf8'))</code>.
- [L63](#l63) Bind <code>diagnostics:NonNullable&lt;CheckResult['diagnostics']&gt;&#124;undefined</code>: leave the value undefined until a later assignment.
- [L64](#l64) If <code>check.format!=='text' &amp;&amp; status!=='error'</code> is truthy:
  - [L65](#l65) Run the protected block:
    - [L66](#l66) update <code>diagnostics</code> with <code>parseDiagnostics(check.format,stdout,root,check.id)</code> using <code>=</code>; this mutation is visible to later statements.
    - [L67](#l67) Bind <code>failed</code>: evaluate <code>exceedsThreshold(diagnostics,check.failOn) &#124;&#124; (exitCode!==0 &amp;&amp; diagnostics.length===0)</code> left to right with truthy short-circuiting.
    - [L68](#l68) update <code>status</code> with <code>failed?'failed':'passed'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L69](#l69) update <code>reason</code> with <code>failed?'Tool diagnostics or exit status failed the configured policy.':'Tool diagnostics passed the configured policy.'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L65](#l65) If it throws:
    - [L70](#l70) update <code>status</code> with <code>'error'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L70](#l70) update <code>reason</code> with <code>'Invalid structured tool output or out-of-root diagnostic path. Check the configured JSON format.'</code> using <code>=</code>; this mutation is visible to later statements.
- [L72](#l72) call the named operation with the supplied arguments: <code>resolve({...base,status,reason,exitCode,output,stdout,stderr,...(diagnostics?{diagnostics}:{} )})</code>.

<a id="fn-3821"></a>
### redact (60:22)

Synchronous function. Lexically inside [finish (54:20)](#fn-3478). 

Parameters:

- <code>value:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: fold the sequence into the accumulator: <code>secrets.reduce((text,[,secret])=&gt;secret?text.split(secret).join('[REDACTED]'):text,value)</code>.

<a id="fn-3852"></a>
### secrets.reduce callback (60:53)

Synchronous function. Lexically inside [redact (60:22)](#fn-3821). Passed to <code>secrets.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>text</code>: supplied by the caller; usage is shown in the steps below.
- <code>[,secret]</code>: destructure the supplied value into these local bindings.

Execution:

[L60](#l60) Implicitly return: test <code>secret</code>; choose <code>text.split(secret).join('[REDACTED]')</code> when truthy, otherwise <code>text</code>.

<a id="fn-5047"></a>
### stop (75:18)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). 

Parameters:

- <code>reason:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L76](#l76) If <code>stopping &#124;&#124; finished</code> is truthy:
  - [L76](#l76) Return undefined immediately; remaining statements in this function do not execute.
- [L77](#l77) update <code>stopping</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
- [L78](#l78) call the named operation with the supplied arguments: <code>child.stdout.destroy()</code>.
- [L78](#l78) call the named operation with the supplied arguments: <code>child.stderr.destroy()</code>.
- [L78](#l78) call the named operation with the supplied arguments: <code>child.unref()</code>.
- [L79](#l79) apply <code>void</code> to <code>terminateCheckTree(child).then(cleaned=&gt;finish('error',&#96;${reason} ${cleaned?'Process-tree termination requested.':'Descendant cleanup could not be confirmed.'}&#96;))</code>.

<a id="fn-5243"></a>
### terminateCheckTree(child).then callback (79:45)

Synchronous function. Lexically inside [stop (75:18)](#fn-5047). Passed to <code>terminateCheckTree(child).then</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>cleaned</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L79](#l79) Implicitly return: call the named operation with the supplied arguments: <code>finish('error',&#96;${reason} ${cleaned?'Process-tree termination requested.':'Descendant cleanup could not be confirmed.'}&#96;)</code>.

<a id="fn-5405"></a>
### capture (81:21)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). 

Parameters:

- <code>chunk:Buffer</code>: supplied by the caller; usage is shown in the steps below.
- <code>stream:Buffer[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L83](#l83) <code>remaining</code>: compute <code>check.maxOutputBytes-bytes</code> with the <code>-</code> operator.
- [L84](#l84) <code>bounded</code>: call the named operation with the supplied arguments: <code>chunk.subarray(0,Math.max(0,remaining))</code>.

Execution:

- [L82](#l82) If <code>finished &#124;&#124; stopping</code> is truthy:
  - [L82](#l82) Return undefined immediately; remaining statements in this function do not execute.
- [L83](#l83) Bind <code>remaining</code>: compute <code>check.maxOutputBytes-bytes</code> with the <code>-</code> operator.
- [L84](#l84) Bind <code>bounded</code>: call the named operation with the supplied arguments: <code>chunk.subarray(0,Math.max(0,remaining))</code>.
- [L85](#l85) append values to the existing array: <code>chunks.push(bounded)</code>.
- [L85](#l85) append values to the existing array: <code>stream.push(bounded)</code>.
- [L86](#l86) update <code>bytes</code> with <code>chunk.length</code> using <code>+=</code>; this mutation is visible to later statements.
- [L87](#l87) If <code>bytes&gt;check.maxOutputBytes</code> is truthy:
  - [L87](#l87) call the named operation with the supplied arguments: <code>stop('Output limit exceeded.')</code>.

<a id="fn-5783"></a>
### child.stdout.on callback (89:30)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>child.stdout.on</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>chunk</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L89](#l89) Implicitly return: call the named operation with the supplied arguments: <code>capture(chunk,stdoutChunks)</code>.

<a id="fn-5842"></a>
### child.stderr.on callback (89:89)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>child.stderr.on</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>chunk</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L89](#l89) Implicitly return: call the named operation with the supplied arguments: <code>capture(chunk,stderrChunks)</code>.

<a id="fn-5902"></a>
### child.on callback (90:24)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>child.on</code>; the receiving API determines when/how often it runs.

Execution:

- [L90](#l90) If <code>!stopping</code> is truthy:
  - [L90](#l90) call the named operation with the supplied arguments: <code>finish('error','Could not launch check. Verify the executable and arguments.')</code>.

<a id="fn-6026"></a>
### child.on callback (91:24)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>child.on</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>code</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L91](#l91) If <code>!stopping</code> is truthy:
  - [L91](#l91) call the named operation with the supplied arguments: <code>finish(code===0?'passed':code!==null &amp;&amp; check.failureExitCodes.includes(code)?'failed':'error', code===0?'Command exited successfully.':code!==null &amp;&amp; check.failureExitCodes.includes(code)?'Command reported check failures.':'Command did not complete success…</code>.

<a id="fn-6352"></a>
### setTimeout callback (93:24)

Synchronous function. Lexically inside [Promise callback (42:49)](#fn-2860). Passed to <code>setTimeout</code>; the receiving API determines when/how often it runs.

Execution:

[L93](#l93) Implicitly return: call the named operation with the supplied arguments: <code>stop('Timeout exceeded.')</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>checkSchema</code> | <code>id</code> | <code>z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/)</code> | [L7](#l7) |
| <code>checkSchema</code> | <code>command</code> | <code>z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0'))</code> | [L8](#l8) |
| <code>checkSchema</code> | <code>args</code> | <code>z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([])</code> | [L9](#l9) |
| <code>checkSchema</code> | <code>timeoutMs</code> | <code>z.number().int().min(100).max(300000).default(60000)</code> | [L10](#l10) |
| <code>checkSchema</code> | <code>maxOutputBytes</code> | <code>z.number().int().min(128).max(1048576).default(65536)</code> | [L11](#l11) |
| <code>checkSchema</code> | <code>failureExitCodes</code> | <code>z.array(z.number().int().min(1).max(255)).default([1])</code> | [L12](#l12) |
| <code>checkSchema</code> | <code>format</code> | <code>z.enum(['text','eslint-json','ruff-json']).default('text')</code> | [L13](#l13) |
| <code>checkSchema</code> | <code>failOn</code> | <code>z.enum(['error','warning','info','never']).default('error')</code> | [L14](#l14) |
| <code>checkSchema</code> | <code>languages</code> | <code>z.array(z.enum(['JavaScript','TypeScript','Python'])).min(1).optional()</code> | [L15](#l15) |
| <code>checkResultSchema</code> | <code>id</code> | <code>z.string()</code> | [L24](#l24) |
| <code>checkResultSchema</code> | <code>status</code> | <code>z.enum(['skipped','passed','failed','error'])</code> | [L24](#l24) |
| <code>checkResultSchema</code> | <code>exitCode</code> | <code>z.number().int().nullable()</code> | [L25](#l25) |
| <code>checkResultSchema</code> | <code>reason</code> | <code>z.string()</code> | [L25](#l25) |
| <code>checkResultSchema</code> | <code>output</code> | <code>z.string()</code> | [L25](#l25) |
| <code>checkResultSchema</code> | <code>scope</code> | <code>z.literal('whole-repository')</code> | [L26](#l26) |
| <code>checkResultSchema</code> | <code>diagnostics</code> | <code>z.array(diagnosticSchema).optional()</code> | [L27](#l27) |
| <code>checkResultSchema</code> | <code>stdout</code> | <code>z.string().optional()</code> | [L28](#l28) |
| <code>checkResultSchema</code> | <code>stderr</code> | <code>z.string().optional()</code> | [L28](#l28) |

## Compile-time data contracts

### CheckResult

```typescript
type CheckResult=z.infer<typeof checkResultSchema>;
```

Declared at [L30](#l30). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L6](#l6) <code>checkSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/), command:z.string().min(1).max(1024).refine(value=&gt;!value.includes('\0')), args:z.array(z.string().max(4096).refine(value=&gt;!value.includes('\0'))).max(100).default([]), timeoutMs:z.number().…</code>.
- [L21](#l21) <code>checksSchema</code>: call the named operation with the supplied arguments: <code>z.array(checkSchema).max(20).default([]).refine( checks=&gt;new Set(checks.map(check=&gt;check.id)).size===checks.length,'Check IDs must be unique.')</code>.
- [L23](#l23) <code>checkResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id:z.string(),status:z.enum(['skipped','passed','failed','error']), exitCode:z.number().int().nullable(),reason:z.string(),output:z.string(), scope:z.literal('whole-repository'), diagnostics:z.array(diagnosticSchema).optional(), stdout:z.string()…</code>.

## Directly importing tests

- [check-diagnostics.test.ts](../../test/check-diagnostics.test.ts)
- [current-task.test.ts](../../test/current-task.test.ts)
- [p7.test.ts](../../test/p7.test.ts)

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

```text
   1 | import { spawn } from 'node:child_process';
   2 | import { z } from 'zod';
   3 | import {diagnosticSchema,parseDiagnostics,exceedsThreshold} from './check-diagnostics.js';
   4 | import {terminateCheckTree} from './check-process.js';
   5 | 
   6 | export const checkSchema = z.object({
   7 |   id:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/),
   8 |   command:z.string().min(1).max(1024).refine(value=>!value.includes('\0')),
   9 |   args:z.array(z.string().max(4096).refine(value=>!value.includes('\0'))).max(100).default([]),
  10 |   timeoutMs:z.number().int().min(100).max(300000).default(60000),
  11 |   maxOutputBytes:z.number().int().min(128).max(1048576).default(65536),
  12 |   failureExitCodes:z.array(z.number().int().min(1).max(255)).default([1]),
  13 |   format:z.enum(['text','eslint-json','ruff-json']).default('text'),
  14 |   failOn:z.enum(['error','warning','info','never']).default('error'),
  15 |   languages:z.array(z.enum(['JavaScript','TypeScript','Python'])).min(1).optional(),
  16 | }).strict().superRefine((check,context)=>{
  17 |   if(check.args.some(arg=>/^--(?:fix|fix-only|unsafe-fixes|write)(?:=|$)/i.test(arg)))
  18 |     context.addIssue({code:'custom',path:['args'],message:'Inspection checks must not use recognized fix/write flags.'});
  19 |   if(check.format==='text' && check.failOn!=='error')context.addIssue({code:'custom',path:['failOn'],message:'Severity thresholds require a structured JSON format.'});
  20 | });
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
<a id="l30"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | export const checksSchema = z.array(checkSchema).max(20).default([]).refine(
  22 |   checks=>new Set(checks.map(check=>check.id)).size===checks.length,'Check IDs must be unique.');
  23 | export const checkResultSchema=z.object({
  24 |   id:z.string(),status:z.enum(['skipped','passed','failed','error']),
  25 |   exitCode:z.number().int().nullable(),reason:z.string(),output:z.string(),
  26 |   scope:z.literal('whole-repository'),
  27 |   diagnostics:z.array(diagnosticSchema).optional(),
  28 |   stdout:z.string().optional(),stderr:z.string().optional(),
  29 | });
  30 | export type CheckResult=z.infer<typeof checkResultSchema>;
  31 | 
  32 | /** Explicitly trusted commands only. No shell interpretation or automatic install. */
  33 | export async function runChecks(root:string, checks:z.infer<typeof checksSchema>, authorized:boolean,
  34 |   credentialEnv='SHIPCHECK_API_KEY',detectedLanguages?:readonly string[]):Promise<CheckResult[]> {
  35 |   const results:CheckResult[]=[];
  36 |   for(const check of checks) {
  37 |     const base={id:check.id,exitCode:null,output:'',scope:'whole-repository' as const};
  38 |     if(!authorized) {results.push({...base,status:'skipped',reason:'Requires --run-checks authorization.'});continue;}
  39 |     if(check.languages && (!detectedLanguages || !check.languages.some(language=>detectedLanguages.includes(language)))) {
  40 |       results.push({...base,status:'skipped',reason:detectedLanguages?'No configured language detected in the inspected inventory.':'Language selection requires an inspected inventory.'});continue;
```

<a id="l42"></a>
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
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     }
  42 |     const result=await new Promise<CheckResult>(resolve=> {
  43 |       // Avoid forwarding API credentials to linters; commands still run with user privileges.
  44 |       const env={...process.env};
  45 |       const secrets=Object.entries(env).filter(([name,value])=>value &&
  46 |         (name.toUpperCase()===credentialEnv.toUpperCase() || /KEY|TOKEN|SECRET|PASSWORD/i.test(name)));
  47 |       for(const [name] of secrets) delete env[name];
  48 |       const chunks:Buffer[]=[];
  49 |       const stdoutChunks:Buffer[]=[];const stderrChunks:Buffer[]=[];
  50 |       let bytes=0;
  51 |       let finished=false;
  52 |       let stopping=false;
  53 |       let timer:ReturnType<typeof setTimeout>|undefined;
  54 |       const finish=(status:CheckResult['status'],reason:string,exitCode:number|null=null)=> {
  55 |         if(finished)return;
  56 |         finished=true;
  57 |         if(timer)clearTimeout(timer);
  58 |         let output=Buffer.concat(chunks).toString('utf8');
  59 |         for(const [,secret] of secrets) if(secret) output=output.split(secret).join('[REDACTED]');
  60 |         const redact=(value:string)=>secrets.reduce((text,[,secret])=>secret?text.split(secret).join('[REDACTED]'):text,value);
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
<a id="l72"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>

```text
  61 |         const stdout=redact(Buffer.concat(stdoutChunks).toString('utf8'));
  62 |         const stderr=redact(Buffer.concat(stderrChunks).toString('utf8'));
  63 |         let diagnostics:NonNullable<CheckResult['diagnostics']>|undefined;
  64 |         if(check.format!=='text' && status!=='error') {
  65 |           try {
  66 |             diagnostics=parseDiagnostics(check.format,stdout,root,check.id);
  67 |             const failed=exceedsThreshold(diagnostics,check.failOn) || (exitCode!==0 && diagnostics.length===0);
  68 |             status=failed?'failed':'passed';
  69 |             reason=failed?'Tool diagnostics or exit status failed the configured policy.':'Tool diagnostics passed the configured policy.';
  70 |           } catch {status='error';reason='Invalid structured tool output or out-of-root diagnostic path. Check the configured JSON format.';}
  71 |         }
  72 |         resolve({...base,status,reason,exitCode,output,stdout,stderr,...(diagnostics?{diagnostics}:{} )});
  73 |       };
  74 |       const child=spawn(check.command,check.args,{cwd:root,env,shell:false,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
  75 |       const stop=(reason:string)=> {
  76 |         if(stopping || finished)return;
  77 |         stopping=true;
  78 |         child.stdout.destroy();child.stderr.destroy();child.unref();
  79 |         void terminateCheckTree(child).then(cleaned=>finish('error',`${reason} ${cleaned?'Process-tree termination requested.':'Descendant cleanup could not be confirmed.'}`));
  80 |       };
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
<a id="l86"></a>
<a id="l87"></a>
<a id="l89"></a>
<a id="l90"></a>
<a id="l91"></a>
<a id="l92"></a>
<a id="l93"></a>
<a id="l95"></a>
<a id="l97"></a>

```text
  81 |       const capture=(chunk:Buffer,stream:Buffer[])=> {
  82 |         if(finished || stopping)return;
  83 |         const remaining=check.maxOutputBytes-bytes;
  84 |         const bounded=chunk.subarray(0,Math.max(0,remaining));
  85 |         chunks.push(bounded);stream.push(bounded);
  86 |         bytes+=chunk.length;
  87 |         if(bytes>check.maxOutputBytes)stop('Output limit exceeded.');
  88 |       };
  89 |       child.stdout.on('data',chunk=>capture(chunk,stdoutChunks));child.stderr.on('data',chunk=>capture(chunk,stderrChunks));
  90 |       child.on('error',()=>{if(!stopping)finish('error','Could not launch check. Verify the executable and arguments.');});
  91 |       child.on('close',code=>{if(!stopping)finish(code===0?'passed':code!==null && check.failureExitCodes.includes(code)?'failed':'error',
  92 |         code===0?'Command exited successfully.':code!==null && check.failureExitCodes.includes(code)?'Command reported check failures.':'Command did not complete successfully.',code);});
  93 |       timer=setTimeout(()=>stop('Timeout exceeded.'),check.timeoutMs);
  94 |     });
  95 |     results.push(result);
  96 |   }
  97 |   return results;
  98 | }
  99 | 
```
