# src/ai/evaluation.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The evaluation runner constructs context from explicit fixtures and an injected transport; it never discovers live credentials. scoreEvaluation combines candidate citation acceptance with separate human labels and expected bug identities. Unique detected bugs and confirmed candidates are different counters. Missing/failed/unassessed runs prevent a definitive missed-bug total.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `07789128b0865599652d78a4a78230b5cad222440f0cffd83a615246dffb6ca7`.

This chapter inventories **17 function bodies/callbacks**, **22 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.
- <code>node:crypto</code>: <code>createHash</code>.
- <code>./contracts.js</code>: <code>aiSettingsSchema</code>.
- <code>./client.js</code>: <code>buildRequest</code>, <code>requestQa</code>, <code>ResponseTransport</code> (type only), <code>AiFailure</code>.
- <code>./verify-evidence.js</code>: <code>verifyEvidence</code>.
- <code>./context.js</code>: <code>AiContext</code> (type only).

## Module execution

- [L8](#l8) Bind <code>evaluationCaseSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string().min(1),variant:z.enum(['isolated','mixed','cross-file']), description:z.string(),expectedBugs:z.array(z.object({id:z.string(),description:z.string()})), files:z.array(z.object({path:z.string(),content:z.string()})).min(1)}).strict()</code>.
- [L33](#l33) Bind <code>assessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({caseId:z.string(),candidateIndex:z.number().int().nonnegative(), verdict:z.enum(['confirmed','false-positive','uncertain']),bugId:z.string().optional()}).strict()</code>.

## Function index

- [runEvaluationCase (17:8)](#fn-998)
- [fixture.files.map callback (19:81)](#fn-1278)
- [output.candidates.map callback (26:100)](#fn-1851)
- [scoreEvaluation (38:8)](#fn-2609)
- [cases.map callback (39:35)](#fn-2743)
- [runs.map callback (40:54)](#fn-2811)
- [runs.some callback (40:100)](#fn-2857)
- [runs.map callback (41:23)](#fn-3017)
- [runs.find callback (45:25)](#fn-3287)
- [caseMap.get(label.caseId)!.expectedBugs.some callback (47:85)](#fn-3549)
- [run.candidates.forEach callback (52:49)](#fn-3830)
- [cases.reduce callback (60:31)](#fn-4283)
- [runs.some callback (61:60)](#fn-4381)
- [runs.filter callback (62:52)](#fn-4473)
- [runs.filter callback (62:105)](#fn-4526)
- [runs.every callback (66:54)](#fn-4930)
- [runs.reduce callback (66:87)](#fn-4963)

<a id="fn-998"></a>
### runEvaluationCase (17:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>input:EvaluationCase</code>: supplied by the caller; usage is shown in the steps below.
- <code>model:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>transport:ResponseTransport</code>: supplied by the caller; usage is shown in the steps below.
- <code>apiKey='offline-evaluation'</code>: when omitted/undefined, initialize with <code>'offline-evaluation'</code>.

Local bindings (nested callback locals are documented with that callback):

- [L18](#l18) <code>fixture</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>evaluationCaseSchema.parse(input)</code>.
- [L19](#l19) <code>context:AiContext</code>: create an object with 2 property/spread entries: <code>{files:fixture.files,preview:{files:fixture.files.map(file=&gt;({path:file.path, bytes:Buffer.byteLength(file.content),lines:file.content.split(/\r\n&#124;\n&#124;\r/).length, sha256:createHash('sha256').update(file.content).digest('hex')})),skipped:[],limited:false, se…</code>; later properties overwrite earlier spread values.
- [L23](#l23) <code>started</code>: call the named operation with the supplied arguments: <code>Date.now()</code>.
- [L25](#l25) <code>output</code>: wait for <code>requestQa(transport,buildRequest(context,aiSettingsSchema.parse({maxOutputTokens:2000,timeoutMs:60000}),model),context,60000,apiKey)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L18](#l18) Bind <code>fixture</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>evaluationCaseSchema.parse(input)</code>.
- [L19](#l19) Bind <code>context:AiContext</code>: create an object with 2 property/spread entries: <code>{files:fixture.files,preview:{files:fixture.files.map(file=&gt;({path:file.path, bytes:Buffer.byteLength(file.content),lines:file.content.split(/\r\n&#124;\n&#124;\r/).length, sha256:createHash('sha256').update(file.content).digest('hex')})),skipped:[],limited:false, se…</code>; later properties overwrite earlier spread values.
- [L23](#l23) Bind <code>started</code>: call the named operation with the supplied arguments: <code>Date.now()</code>.
- [L24](#l24) Run the protected block:
  - [L25](#l25) Bind <code>output</code>: wait for <code>requestQa(transport,buildRequest(context,aiSettingsSchema.parse({maxOutputTokens:2000,timeoutMs:60000}),model),context,60000,apiKey)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L26](#l26) Return to the caller: create an object with 7 property/spread entries: <code>{caseId:fixture.id,model,status:'completed',error:null,candidates:output.candidates.map(candidate=&gt;({ title:candidate.title,explanation:candidate.explanation,verification:verifyEvidence(candidate,context,context).status})),elapsedMs:Date.now()-started,costU…</code>; later properties overwrite earlier spread values.
- [L24](#l24) If it throws, bind <code>error</code>:
  - [L29](#l29) Return to the caller: create an object with 7 property/spread entries: <code>{caseId:fixture.id,model,status:'failed',error:error instanceof AiFailure?error.code:'evaluation-error',candidates:[],elapsedMs:Date.now()-started,costUsd:null}</code>; later properties overwrite earlier spread values.

<a id="fn-1278"></a>
### fixture.files.map callback (19:81)

Synchronous function. Lexically inside [runEvaluationCase (17:8)](#fn-998). Passed to <code>fixture.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L19](#l19) Implicitly return: create an object with 4 property/spread entries: <code>{path:file.path, bytes:Buffer.byteLength(file.content),lines:file.content.split(/\r\n&#124;\n&#124;\r/).length, sha256:createHash('sha256').update(file.content).digest('hex')}</code>; later properties overwrite earlier spread values.

<a id="fn-1851"></a>
### output.candidates.map callback (26:100)

Synchronous function. Lexically inside [runEvaluationCase (17:8)](#fn-998). Passed to <code>output.candidates.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L26](#l26) Implicitly return: create an object with 3 property/spread entries: <code>{ title:candidate.title,explanation:candidate.explanation,verification:verifyEvidence(candidate,context,context).status}</code>; later properties overwrite earlier spread values.

<a id="fn-2609"></a>
### scoreEvaluation (38:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>cases:EvaluationCase[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>runs:EvaluationRun[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>assessments:Assessment[]=[]</code>: when omitted/undefined, initialize with <code>[]</code>.

Local bindings (nested callback locals are documented with that callback):

- [L39](#l39) <code>caseMap</code>: construct <code>Map</code> using <code>cases.map(c=&gt;[c.id,c])</code>; this creates the local instance used below.
- [L42](#l42) <code>labels</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L43](#l43) <code>input</code>: receive the next iterable value from <code>assessments</code> at the start of each loop iteration.
- [L44](#l44) <code>label</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>assessmentSchema.parse(input)</code>.
- [L44](#l44) <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.candidateIndex}&#96;</code>.
- [L45](#l45) <code>run</code>: return the first matching element, or undefined: <code>runs.find(r=&gt;r.caseId===label.caseId)</code>.
- [L50](#l50) <code>confirmed</code>: use the literal <code>0</code>.
- [L50](#l50) <code>falsePositives</code>: use the literal <code>0</code>.
- [L50](#l50) <code>unassessed</code>: use the literal <code>0</code>.
- [L50](#l50) <code>matched</code>: use the literal <code>0</code>.
- [L50](#l50) <code>total</code>: use the literal <code>0</code>.
- [L51](#l51) <code>detected</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L52](#l52) <code>run</code>: receive the next iterable value from <code>runs</code> at the start of each loop iteration.
- [L60](#l60) <code>expected</code>: fold the sequence into the accumulator: <code>cases.reduce((sum,c)=&gt;sum+c.expectedBugs.length,0)</code>.
- [L61](#l61) <code>incomplete</code>: evaluate <code>runs.length!==cases.length &#124;&#124; runs.some(r=&gt;r.status==='failed') &#124;&#124; unassessed&gt;0</code> left to right with truthy short-circuiting.

Execution:

- [L39](#l39) Bind <code>caseMap</code>: construct <code>Map</code> using <code>cases.map(c=&gt;[c.id,c])</code>; this creates the local instance used below.
- [L40](#l40) If <code>caseMap.size!==cases.length &#124;&#124; new Set(runs.map(r=&gt;r.caseId)).size!==runs.length &#124;&#124; runs.some(r=&gt;!caseMap.has(r.caseId))</code> is truthy:
  - [L40](#l40) Throw <code>new Error('Each evaluation case/run must have a unique known case ID. Score one model run at a time.')</code>; normal execution stops until an enclosing catch handles it.
- [L41](#l41) If <code>new Set(runs.map(r=&gt;r.model)).size&gt;1</code> is truthy:
  - [L41](#l41) Throw <code>new Error('Score models separately.')</code>; normal execution stops until an enclosing catch handles it.
- [L42](#l42) Bind <code>labels</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L43](#l43) Iterate <code>assessments</code> values, binding <code>const input</code> for each iteration:
  - [L44](#l44) Bind <code>label</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>assessmentSchema.parse(input)</code>.
  - [L44](#l44) Bind <code>key</code>: use the literal <code>&#96;${label.caseId}:${label.candidateIndex}&#96;</code>.
  - [L45](#l45) Bind <code>run</code>: return the first matching element, or undefined: <code>runs.find(r=&gt;r.caseId===label.caseId)</code>.
  - [L46](#l46) If <code>!run?.candidates[label.candidateIndex] &#124;&#124; labels.has(key)</code> is truthy:
    - [L46](#l46) Throw <code>new Error('Assessment must reference one existing candidate exactly once.')</code>; normal execution stops until an enclosing catch handles it.
  - [L47](#l47) If <code>label.verdict==='confirmed' &amp;&amp; !caseMap.get(label.caseId)!.expectedBugs.some(b=&gt;b.id===label.bugId)</code> is truthy:
    - [L47](#l47) Throw <code>new Error('Confirmed assessment requires a known expected bug ID.')</code>; normal execution stops until an enclosing catch handles it.
  - [L48](#l48) store/replace a keyed entry in the Map: <code>labels.set(key,label)</code>.
- [L50](#l50) Bind <code>confirmed</code>: use the literal <code>0</code>.
- [L50](#l50) Bind <code>falsePositives</code>: use the literal <code>0</code>.
- [L50](#l50) Bind <code>unassessed</code>: use the literal <code>0</code>.
- [L50](#l50) Bind <code>matched</code>: use the literal <code>0</code>.
- [L50](#l50) Bind <code>total</code>: use the literal <code>0</code>.
- [L51](#l51) Bind <code>detected</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L52](#l52) Iterate <code>runs</code> values, binding <code>const run</code> for each iteration:
  - [L52](#l52) call the named operation with the supplied arguments: <code>run.candidates.forEach((candidate,index)=&gt;{ total++;if(candidate.verification==='matched')matched++; const label=labels.get(&#96;${run.caseId}:${index}&#96;); if(!label &#124;&#124; label.verdict==='uncertain')unassessed++; else if(label.verdict==='false-positive')falsePosit…</code>.
- [L60](#l60) Bind <code>expected</code>: fold the sequence into the accumulator: <code>cases.reduce((sum,c)=&gt;sum+c.expectedBugs.length,0)</code>.
- [L61](#l61) Bind <code>incomplete</code>: evaluate <code>runs.length!==cases.length &#124;&#124; runs.some(r=&gt;r.status==='failed') &#124;&#124; unassessed&gt;0</code> left to right with truthy short-circuiting.
- [L62](#l62) Return to the caller: create an object with 14 property/spread entries: <code>{cases:cases.length,completed:runs.filter(r=&gt;r.status==='completed').length,failed:runs.filter(r=&gt;r.status==='failed').length, candidates:total,citationMatches:matched,citationAcceptanceRate:total?matched/total:null, confirmedCandidates:confirmed,falsePosit…</code>; later properties overwrite earlier spread values.

<a id="fn-2743"></a>
### cases.map callback (39:35)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>cases.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>c</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L39](#l39) Implicitly return: create an array from <code>[c.id,c]</code>; spread elements insert the iterable values.

<a id="fn-2811"></a>
### runs.map callback (40:54)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: read <code>r.caseId</code>.

<a id="fn-2857"></a>
### runs.some callback (40:100)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: apply <code>!</code> to <code>caseMap.has(r.caseId)</code>.

<a id="fn-3017"></a>
### runs.map callback (41:23)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L41](#l41) Implicitly return: read <code>r.model</code>.

<a id="fn-3287"></a>
### runs.find callback (45:25)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L45](#l45) Implicitly return: compute <code>r.caseId===label.caseId</code> with the <code>===</code> operator.

<a id="fn-3549"></a>
### caseMap.get(label.caseId)!.expectedBugs.some callback (47:85)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>caseMap.get(label.caseId)!.expectedBugs.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L47](#l47) Implicitly return: compute <code>b.id===label.bugId</code> with the <code>===</code> operator.

<a id="fn-3830"></a>
### run.candidates.forEach callback (52:49)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>run.candidates.forEach</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L54](#l54) <code>label</code>: call the named operation with the supplied arguments: <code>labels.get(&#96;${run.caseId}:${index}&#96;)</code>.

Execution:

- [L53](#l53) increment <code>total</code> by one.
- [L53](#l53) If <code>candidate.verification==='matched'</code> is truthy:
  - [L53](#l53) increment <code>matched</code> by one.
- [L54](#l54) Bind <code>label</code>: call the named operation with the supplied arguments: <code>labels.get(&#96;${run.caseId}:${index}&#96;)</code>.
- [L55](#l55) If <code>!label &#124;&#124; label.verdict==='uncertain'</code> is truthy:
  - [L55](#l55) increment <code>unassessed</code> by one.
- [L55](#l55) Otherwise:
  - [L56](#l56) If <code>label.verdict==='false-positive'</code> is truthy:
    - [L56](#l56) increment <code>falsePositives</code> by one.
  - [L56](#l56) Otherwise:
    - [L57](#l57) If <code>run.status==='completed' &amp;&amp; candidate.verification==='matched'</code> is truthy:
      - [L57](#l57) increment <code>confirmed</code> by one.
      - [L57](#l57) insert a unique value in the Set: <code>detected.add(&#96;${run.caseId}:${label.bugId}&#96;)</code>.
    - [L57](#l57) Otherwise:
      - [L58](#l58) increment <code>unassessed</code> by one.

<a id="fn-4283"></a>
### cases.reduce callback (60:31)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>cases.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>c</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: compute <code>sum+c.expectedBugs.length</code> with the <code>+</code> operator.

<a id="fn-4381"></a>
### runs.some callback (61:60)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L61](#l61) Implicitly return: compute <code>r.status==='failed'</code> with the <code>===</code> operator.

<a id="fn-4473"></a>
### runs.filter callback (62:52)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L62](#l62) Implicitly return: compute <code>r.status==='completed'</code> with the <code>===</code> operator.

<a id="fn-4526"></a>
### runs.filter callback (62:105)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L62](#l62) Implicitly return: compute <code>r.status==='failed'</code> with the <code>===</code> operator.

<a id="fn-4930"></a>
### runs.every callback (66:54)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L66](#l66) Implicitly return: compute <code>r.costUsd!==null</code> with the <code>!==</code> operator.

<a id="fn-4963"></a>
### runs.reduce callback (66:87)

Synchronous function. Lexically inside [scoreEvaluation (38:8)](#fn-2609). Passed to <code>runs.reduce</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>sum</code>: supplied by the caller; usage is shown in the steps below.
- <code>r</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L66](#l66) Implicitly return: compute <code>sum+r.costUsd!</code> with the <code>+</code> operator.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>evaluationCaseSchema</code> | <code>id</code> | <code>z.string().min(1)</code> | [L8](#l8) |
| <code>evaluationCaseSchema</code> | <code>variant</code> | <code>z.enum(['isolated','mixed','cross-file'])</code> | [L8](#l8) |
| <code>evaluationCaseSchema</code> | <code>description</code> | <code>z.string()</code> | [L9](#l9) |
| <code>evaluationCaseSchema</code> | <code>expectedBugs</code> | <code>z.array(z.object({id:z.string(),description:z.string()}))</code> | [L9](#l9) |
| <code>evaluationCaseSchema</code> | <code>expectedBugs.id</code> | <code>z.string()</code> | [L9](#l9) |
| <code>evaluationCaseSchema</code> | <code>expectedBugs.description</code> | <code>z.string()</code> | [L9](#l9) |
| <code>evaluationCaseSchema</code> | <code>files</code> | <code>z.array(z.object({path:z.string(),content:z.string()})).min(1)</code> | [L10](#l10) |
| <code>evaluationCaseSchema</code> | <code>files.path</code> | <code>z.string()</code> | [L10](#l10) |
| <code>evaluationCaseSchema</code> | <code>files.content</code> | <code>z.string()</code> | [L10](#l10) |
| <code>assessmentSchema</code> | <code>caseId</code> | <code>z.string()</code> | [L33](#l33) |
| <code>assessmentSchema</code> | <code>candidateIndex</code> | <code>z.number().int().nonnegative()</code> | [L33](#l33) |
| <code>assessmentSchema</code> | <code>verdict</code> | <code>z.enum(['confirmed','false-positive','uncertain'])</code> | [L34](#l34) |
| <code>assessmentSchema</code> | <code>bugId</code> | <code>z.string().optional()</code> | [L34](#l34) |

## Compile-time data contracts

### EvaluationCase

```typescript
type EvaluationCase=z.infer<typeof evaluationCaseSchema>;
```

Declared at [L11](#l11). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### EvaluationRun

```typescript
type EvaluationRun={caseId:string;model:string;status:'completed'|'failed';error:string|null;
  candidates:Array<{title:string;explanation:string;verification:'matched'|'rejected'}>;
  elapsedMs:number;costUsd:number|null};
```

Declared at [L12](#l12). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Assessment

```typescript
type Assessment=z.infer<typeof assessmentSchema>;
```

Declared at [L35](#l35). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L8](#l8) <code>evaluationCaseSchema</code>: call the named operation with the supplied arguments: <code>z.object({id:z.string().min(1),variant:z.enum(['isolated','mixed','cross-file']), description:z.string(),expectedBugs:z.array(z.object({id:z.string(),description:z.string()})), files:z.array(z.object({path:z.string(),content:z.string()})).min(1)}).strict()</code>.
- [L33](#l33) <code>assessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({caseId:z.string(),candidateIndex:z.number().int().nonnegative(), verdict:z.enum(['confirmed','false-positive','uncertain']),bugId:z.string().optional()}).strict()</code>.

## Directly importing tests

- [evaluation.test.ts](../../test/evaluation.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l8"></a>
<a id="l9"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l14"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {z} from 'zod';
   2 | import {createHash} from 'node:crypto';
   3 | import {aiSettingsSchema} from './contracts.js';
   4 | import {buildRequest,requestQa,type ResponseTransport,AiFailure} from './client.js';
   5 | import {verifyEvidence} from './verify-evidence.js';
   6 | import type {AiContext} from './context.js';
   7 | 
   8 | export const evaluationCaseSchema=z.object({id:z.string().min(1),variant:z.enum(['isolated','mixed','cross-file']),
   9 |   description:z.string(),expectedBugs:z.array(z.object({id:z.string(),description:z.string()})),
  10 |   files:z.array(z.object({path:z.string(),content:z.string()})).min(1)}).strict();
  11 | export type EvaluationCase=z.infer<typeof evaluationCaseSchema>;
  12 | export type EvaluationRun={caseId:string;model:string;status:'completed'|'failed';error:string|null;
  13 |   candidates:Array<{title:string;explanation:string;verification:'matched'|'rejected'}>;
  14 |   elapsedMs:number;costUsd:number|null};
  15 | 
  16 | /** Explicit transport only: evaluation never looks up credentials or starts live requests itself. */
  17 | export async function runEvaluationCase(input:EvaluationCase,model:string,transport:ResponseTransport,apiKey='offline-evaluation'):Promise<EvaluationRun> {
  18 |   const fixture=evaluationCaseSchema.parse(input);
  19 |   const context:AiContext={files:fixture.files,preview:{files:fixture.files.map(file=>({path:file.path,
  20 |     bytes:Buffer.byteLength(file.content),lines:file.content.split(/\r\n|\n|\r/).length,
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
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     sha256:createHash('sha256').update(file.content).digest('hex')})),skipped:[],limited:false,
  22 |     serializedBytes:Buffer.byteLength(JSON.stringify(fixture.files))}};
  23 |   const started=Date.now();
  24 |   try {
  25 |     const output=await requestQa(transport,buildRequest(context,aiSettingsSchema.parse({maxOutputTokens:2000,timeoutMs:60000}),model),context,60000,apiKey);
  26 |     return {caseId:fixture.id,model,status:'completed',error:null,candidates:output.candidates.map(candidate=>({
  27 |       title:candidate.title,explanation:candidate.explanation,verification:verifyEvidence(candidate,context,context).status})),elapsedMs:Date.now()-started,costUsd:null};
  28 |   } catch(error) {
  29 |     return {caseId:fixture.id,model,status:'failed',error:error instanceof AiFailure?error.code:'evaluation-error',candidates:[],elapsedMs:Date.now()-started,costUsd:null};
  30 |   }
  31 | }
  32 | 
  33 | export const assessmentSchema=z.object({caseId:z.string(),candidateIndex:z.number().int().nonnegative(),
  34 |   verdict:z.enum(['confirmed','false-positive','uncertain']),bugId:z.string().optional()}).strict();
  35 | export type Assessment=z.infer<typeof assessmentSchema>;
  36 | 
  37 | /** Human labels establish semantic outcomes; citation matches alone never count as true positives. */
  38 | export function scoreEvaluation(cases:EvaluationCase[],runs:EvaluationRun[],assessments:Assessment[]=[]) {
  39 |   const caseMap=new Map(cases.map(c=>[c.id,c]));
  40 |   if(caseMap.size!==cases.length || new Set(runs.map(r=>r.caseId)).size!==runs.length || runs.some(r=>!caseMap.has(r.caseId))) throw new Error('Each evaluation case/run must have a unique known case ID. Score one model run at a time.');
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
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
  41 |   if(new Set(runs.map(r=>r.model)).size>1) throw new Error('Score models separately.');
  42 |   const labels=new Map<string,Assessment>();
  43 |   for(const input of assessments) {
  44 |     const label=assessmentSchema.parse(input);const key=`${label.caseId}:${label.candidateIndex}`;
  45 |     const run=runs.find(r=>r.caseId===label.caseId);
  46 |     if(!run?.candidates[label.candidateIndex] || labels.has(key)) throw new Error('Assessment must reference one existing candidate exactly once.');
  47 |     if(label.verdict==='confirmed' && !caseMap.get(label.caseId)!.expectedBugs.some(b=>b.id===label.bugId)) throw new Error('Confirmed assessment requires a known expected bug ID.');
  48 |     labels.set(key,label);
  49 |   }
  50 |   let confirmed=0,falsePositives=0,unassessed=0,matched=0,total=0;
  51 |   const detected=new Set<string>();
  52 |   for(const run of runs) run.candidates.forEach((candidate,index)=>{
  53 |     total++;if(candidate.verification==='matched')matched++;
  54 |     const label=labels.get(`${run.caseId}:${index}`);
  55 |     if(!label || label.verdict==='uncertain')unassessed++;
  56 |     else if(label.verdict==='false-positive')falsePositives++;
  57 |     else if(run.status==='completed' && candidate.verification==='matched') {confirmed++;detected.add(`${run.caseId}:${label.bugId}`);}
  58 |     else unassessed++;
  59 |   });
  60 |   const expected=cases.reduce((sum,c)=>sum+c.expectedBugs.length,0);
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>

```text
  61 |   const incomplete=runs.length!==cases.length || runs.some(r=>r.status==='failed') || unassessed>0;
  62 |   return {cases:cases.length,completed:runs.filter(r=>r.status==='completed').length,failed:runs.filter(r=>r.status==='failed').length,
  63 |     candidates:total,citationMatches:matched,citationAcceptanceRate:total?matched/total:null,
  64 |     confirmedCandidates:confirmed,falsePositives,unassessedCandidates:unassessed,expectedBugs:expected,
  65 |     detectedBugs:detected.size,missedBugs:incomplete?null:expected-detected.size,semanticAssessmentComplete:!incomplete,
  66 |     costUsd:runs.length===cases.length && runs.every(r=>r.costUsd!==null)?runs.reduce((sum,r)=>sum+r.costUsd!,0):null};
  67 | }
  68 | 
```
