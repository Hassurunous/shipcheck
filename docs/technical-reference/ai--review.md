# src/ai/review.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

reviewWithAi first preserves a deterministic report, then builds a separate AI result inside a failure-catching boundary. It reserves task context space, selects source/references, builds the request, dispatches preview/mock/injected/live behavior and rereads snapshots. It filters candidates to source scope, verifies evidence, tracks reference conflicts and rechecks task identity. Its final coverage expression exposes every skipped/stale/rejected/incomplete component without promoting candidates to deterministic findings.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `2c21f1e5984e328850f499409f7122ae3a180714d090948c12ebcaed4acc9f56`.

This chapter inventories **21 function bodies/callbacks**, **29 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:crypto</code>: <code>createHash</code>.
- <code>node:path</code>: <code>resolve</code>.
- <code>../config.js</code>: <code>configSchema</code>, <code>loadConfig</code>, <code>ConfigInput</code> (type only).
- <code>../inspect-repository.js</code>: <code>inspectRepository</code>.
- <code>../findings.js</code>: <code>createReport</code>, <code>reportSchema</code>, <code>Report</code> (type only).
- <code>./context.js</code>: <code>collectContext</code>.
- <code>./contracts.js</code>: <code>aiResultSchema</code>, <code>modeSchema</code>, <code>AiMode</code> (type only), <code>AiResult</code> (type only).
- <code>./client.js</code>: <code>AiFailure</code>, <code>buildRequest</code>, <code>mockTransport</code>, <code>requestQa</code>, <code>ResponseTransport</code> (type only).
- <code>./live.js</code>: <code>requestLiveQa</code>, <code>requestBudgetQa</code>.
- <code>./audit-budget.js</code>: <code>budgetNameSchema</code>.
- <code>./audit-budget.js</code>: <code>AUDIT_MODELS</code>.
- <code>./trial-budget.js</code>: <code>TRIAL_MODELS</code>.
- <code>./verify-evidence.js</code>: <code>verifyEvidence</code>.
- <code>./reference-context.js</code>: <code>attachReferences</code>.
- <code>../reference-resources.js</code>: <code>loadReferenceResources</code>.
- <code>../task-file.js</code>: <code>currentTaskSchema</code>, <code>describeCurrentTask</code>, <code>CurrentTask</code> (type only).
- <code>./task-review.js</code>: <code>pendingTaskReview</code>, <code>finishTaskReview</code>, <code>invalidateTaskReview</code>.
- <code>../sensitive-content.js</code>: <code>sensitiveContent</code>.
- <code>../reference-access.js</code>: <code>ReferenceAccess</code> (type only).

## Module execution


## Function index

- [reviewWithAi (35:8)](#fn-1653)
- [task.requirements.flatMap callback (58:113)](#fn-3815)
- [[task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=&gt;[item.id,item.text])].some callback (58:146)](#fn-3848)
- [task.requirements.map callback (65:133)](#fn-4508)
- [context.files.map callback (94:85)](#fn-6727)
- [current.files.find callback (97:44)](#fn-6972)
- [result.preview.files.find callback (98:50)](#fn-7079)
- [context.files.map callback (103:102)](#fn-7378)
- [current.references.find callback (106:47)](#fn-7574)
- [inline callback (108:58)](#fn-7788)
- [output.candidates.filter callback (113:49)](#fn-8034)
- [candidate.evidence.some callback (113:84)](#fn-8069)
- [context.files.some callback (114:28)](#fn-8107)
- [(output.referenceConflicts ?? []).map callback (117:93)](#fn-8530)
- [(result.referenceConflicts ?? []).flatMap callback (121:79)](#fn-8863)
- [conflict.evidence.map callback (121:111)](#fn-8895)
- [candidates.map callback (129:42)](#fn-9395)
- [candidate.evidence.some callback (132:75)](#fn-9651)
- [result.preview.files.map callback (141:48)](#fn-10086)
- [result.candidates.filter callback (142:53)](#fn-10156)
- [result.preview.skipped.map callback (146:107)](#fn-10779)

<a id="fn-1653"></a>
### reviewWithAi (35:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target = '.'</code>: when omitted/undefined, initialize with <code>'.'</code>.
- <code>options: AiReviewOptions = {execution:'preview'}</code>: when omitted/undefined, initialize with <code>{execution:'preview'}</code>.
- <code>injected?: InjectedClient</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L40](#l40) <code>config</code>: test <code>options.config === undefined</code>; choose <code>await loadConfig(resolve(target))</code> when truthy, otherwise <code>configSchema.parse(options.config)</code>.
- [L41](#l41) <code>mode</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>modeSchema.parse(options.mode ?? config.ai.mode)</code>.
- [L42](#l42) <code>profile</code>: wait for <code>inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L43](#l43) <code>report</code>: call the named operation with the supplied arguments: <code>createReport(profile,config)</code>.
- [L44](#l44) <code>plannedModel</code>: test <code>options.execution === 'live'</code>; choose <code>config.ai.models[mode] ?? (options.budget?AUDIT_MODELS:TRIAL_MODELS)[mode].model</code> when truthy, otherwise <code>config.ai.models[mode]</code>.
- [L45](#l45) <code>execution</code>: test <code>options.execution === 'live'</code>; choose <code>'live'</code> when truthy, otherwise <code>options.execution === 'preview' ? 'preview' : injected ? 'injected' : 'mock'</code>.
- [L46](#l46) <code>model</code>: test <code>execution === 'mock'</code>; choose <code>&#96;mock-${mode}&#96;</code> when truthy, otherwise <code>plannedModel</code>.
- [L47](#l47) <code>result: AiResult</code>: create an object with 15 property/spread entries: <code>{ execution, status:options.execution === 'preview' ? 'preview' : 'completed', mode, reviewer:'qa/reliability-v2',model,plannedModel, preview:{files:[],skipped:[],serializedBytes:0,limited:false}, maxOutputTokens:config.ai.maxOutputTokens,requestBytes:0,est…</code>; later properties overwrite earlier spread values.
- [L55](#l55) <code>task</code>: test <code>options.task</code>; choose <code>currentTaskSchema.parse(options.task)</code> when truthy, otherwise <code>undefined</code>.
- [L57](#l57) <code>taskBytes</code>: test <code>task</code>; choose <code>Buffer.byteLength(JSON.stringify(task))</code> when truthy, otherwise <code>0</code>.
- [L61](#l61) <code>sourceSettings</code>: create an object with 2 property/spread entries: <code>{...config.ai,maxContextBytes:config.ai.maxContextBytes-taskBytes}</code>; later properties overwrite earlier spread values.
- [L62](#l62) <code>context</code>: wait for <code>collectContext(profile,sourceSettings,options.paths ?? task?.files)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L68](#l68) <code>referencesBlocked</code>: wait for <code>attachReferences(profile.root,{...config,ai:sourceSettings},context,options.referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L71](#l71) <code>request</code>: call the named operation with the supplied arguments: <code>buildRequest(context,config.ai,model ?? 'MODEL_NOT_SELECTED')</code>.
- [L78](#l78) <code>output</code>: leave the value undefined until a later assignment.
- [L81](#l81) <code>live</code>: test <code>options.budget</code>; choose <code>await requestBudgetQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv],options.budget)</code> when truthy, otherwise <code>await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv])</code>.
- [L83](#l83) <code>{output:liveOutput,...accounting}</code>: evaluate <code>live</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L93](#l93) <code>current</code>: create an object with 2 property/spread entries: <code>{files:[],preview:context.preview}</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L96](#l96) <code>source</code>: receive the next iterable value from <code>context.files</code> at the start of each loop iteration.
- [L97](#l97) <code>unchanged</code>: compute <code>current.files.find(file=&gt;file.path===source.path)?.content===source.content</code> with the <code>===</code> operator.
- [L98](#l98) <code>metadata</code>: return the first matching element, or undefined: <code>result.preview.files.find(file=&gt;file.path===source.path)</code>; the TypeScript assertion adds no runtime validation.
- [L105](#l105) <code>reference</code>: receive the next iterable value from <code>context.references</code> at the start of each loop iteration.
- [L106](#l106) <code>fresh</code>: return the first matching element, or undefined: <code>current.references.find(item=&gt;item.record.id===reference.record.id)</code>.
- [L107](#l107) <code>unchanged</code>: evaluate <code>fresh?.record.sha256===reference.record.sha256 &amp;&amp; fresh?.content===reference.content</code> left to right with falsy short-circuiting.
- [L108](#l108) <code>metadata</code>: return the first matching element, or undefined: <code>result.preview.references?.find(item=&gt;item.id===reference.record.id)</code>.
- [L113](#l113) <code>candidates</code>: retain only elements whose callback returns a truthy value: <code>output.candidates.filter(candidate=&gt;candidate.evidence.some(evidence=&gt; context.files.some(file=&gt;file.path===evidence.path) &amp;&amp; (!options.paths &#124;&#124; options.paths.includes(evidence.path))))</code>.
- [L121](#l121) <code>conflictedPaths</code>: construct <code>Set</code> using <code>(result.referenceConflicts ?? []).flatMap(conflict=&gt;conflict.evidence.map(item=&gt;item.path))</code>; this creates the local instance used below.
- [L141](#l141) <code>selectedPaths</code>: transform each element into a new array: <code>result.preview.files.map(file=&gt;file.path)</code>.
- [L142](#l142) <code>rejectedCandidates</code>: read <code>result.candidates.filter(candidate=&gt;candidate.evidenceVerification?.status!=='matched').length</code>.

Execution:

- [L36](#l36) If <code>!['preview','mock','live'].includes(options.execution) &#124;&#124; (options.execution === 'live' &amp;&amp; (!(options.trial &#124;&#124; options.budget) &#124;&#124; injected))</code> is truthy:
  - [L36](#l36) Throw <code>new Error('Live AI is disabled without explicit --trial or --budget activation.')</code>; normal execution stops until an enclosing catch handles it.
- [L37](#l37) If <code>options.budget</code> is truthy:
  - [L37](#l37) validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>budgetNameSchema.parse(options.budget)</code>.
- [L38](#l38) If <code>options.trial &amp;&amp; options.budget</code> is truthy:
  - [L38](#l38) Throw <code>new Error('Choose --trial or --budget, not both.')</code>; normal execution stops until an enclosing catch handles it.
- [L39](#l39) If <code>options.execution!=='live' &amp;&amp; (options.trial &#124;&#124; options.budget)</code> is truthy:
  - [L39](#l39) Throw <code>new Error('Spending authorization requires live AI.')</code>; normal execution stops until an enclosing catch handles it.
- [L40](#l40) Bind <code>config</code>: test <code>options.config === undefined</code>; choose <code>await loadConfig(resolve(target))</code> when truthy, otherwise <code>configSchema.parse(options.config)</code>.
- [L41](#l41) Bind <code>mode</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>modeSchema.parse(options.mode ?? config.ai.mode)</code>.
- [L42](#l42) Bind <code>profile</code>: wait for <code>inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L43](#l43) Bind <code>report</code>: call the named operation with the supplied arguments: <code>createReport(profile,config)</code>.
- [L44](#l44) Bind <code>plannedModel</code>: test <code>options.execution === 'live'</code>; choose <code>config.ai.models[mode] ?? (options.budget?AUDIT_MODELS:TRIAL_MODELS)[mode].model</code> when truthy, otherwise <code>config.ai.models[mode]</code>.
- [L45](#l45) Bind <code>execution</code>: test <code>options.execution === 'live'</code>; choose <code>'live'</code> when truthy, otherwise <code>options.execution === 'preview' ? 'preview' : injected ? 'injected' : 'mock'</code>.
- [L46](#l46) Bind <code>model</code>: test <code>execution === 'mock'</code>; choose <code>&#96;mock-${mode}&#96;</code> when truthy, otherwise <code>plannedModel</code>.
- [L47](#l47) Bind <code>result: AiResult</code>: create an object with 15 property/spread entries: <code>{ execution, status:options.execution === 'preview' ? 'preview' : 'completed', mode, reviewer:'qa/reliability-v2',model,plannedModel, preview:{files:[],skipped:[],serializedBytes:0,limited:false}, maxOutputTokens:config.ai.maxOutputTokens,requestBytes:0,est…</code>; later properties overwrite earlier spread values.
- [L54](#l54) Run the protected block:
  - [L55](#l55) Bind <code>task</code>: test <code>options.task</code>; choose <code>currentTaskSchema.parse(options.task)</code> when truthy, otherwise <code>undefined</code>.
  - [L56](#l56) If <code>task</code> is truthy:
    - [L56](#l56) update <code>result.taskReview</code> with <code>pendingTaskReview(task)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L57](#l57) Bind <code>taskBytes</code>: test <code>task</code>; choose <code>Buffer.byteLength(JSON.stringify(task))</code> when truthy, otherwise <code>0</code>.
  - [L58](#l58) If <code>task &amp;&amp; [task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=&gt;[item.id,item.text])].some(value=&gt;sensitiveContent.test(value))</code> is truthy:
    - [L59](#l59) Throw <code>new AiFailure('sensitive-task','Task text resembles sensitive credentials; no request was sent.')</code>; normal execution stops until an enclosing catch handles it.
  - [L60](#l60) If <code>taskBytes&gt;config.ai.maxContextBytes-256</code> is truthy:
    - [L60](#l60) Throw <code>new AiFailure('task-context-limit','Task exceeds available context space; no request was sent.')</code>; normal execution stops until an enclosing catch handles it.
  - [L61](#l61) Bind <code>sourceSettings</code>: create an object with 2 property/spread entries: <code>{...config.ai,maxContextBytes:config.ai.maxContextBytes-taskBytes}</code>; later properties overwrite earlier spread values.
  - [L62](#l62) Bind <code>context</code>: wait for <code>collectContext(profile,sourceSettings,options.paths ?? task?.files)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L63](#l63) If <code>task</code> is truthy:
    - [L64](#l64) update <code>context.task</code> with <code>task</code> using <code>=</code>; this mutation is visible to later statements.
    - [L65](#l65) update <code>context.preview.task</code> with <code>{id:task.id,sha256:describeCurrentTask(task).sha256,bytes:taskBytes,requirementIds:task.requirements.map(item=&gt;item.id)}</code> using <code>=</code>; this mutation is visible to later statements.
  - [L67](#l67) update <code>result.preview</code> with <code>context.preview</code> using <code>=</code>; this mutation is visible to later statements.
  - [L68](#l68) Bind <code>referencesBlocked</code>: wait for <code>attachReferences(profile.root,{...config,ai:sourceSettings},context,options.referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L69](#l69) update <code>context.preview.serializedBytes</code> with <code>taskBytes</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L70](#l70) If <code>referencesBlocked</code> is truthy:
    - [L70](#l70) Throw <code>new AiFailure('reference-context','A required applicable reference is unavailable, ambiguous, or exceeds remaining context space. No request was sent.')</code>; normal execution stops until an enclosing catch handles it.
  - [L71](#l71) Bind <code>request</code>: call the named operation with the supplied arguments: <code>buildRequest(context,config.ai,model ?? 'MODEL_NOT_SELECTED')</code>.
  - [L72](#l72) update <code>result.requestBytes</code> with <code>Buffer.byteLength(JSON.stringify(request))</code> using <code>=</code>; this mutation is visible to later statements.
  - [L74](#l74) update <code>result.estimatedInputTokens</code> with <code>Math.ceil(result.requestBytes / 3)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L75](#l75) If <code>options.execution !== 'preview'</code> is truthy:
    - [L76](#l76) If <code>context.files.length === 0</code> is truthy:
      - [L76](#l76) Throw <code>new AiFailure('empty-context','No eligible source files were selected.')</code>; normal execution stops until an enclosing catch handles it.
    - [L77](#l77) If <code>injected &amp;&amp; !plannedModel</code> is truthy:
      - [L77](#l77) Throw <code>new AiFailure('missing-model','Select a model mapping before using an injected client.')</code>; normal execution stops until an enclosing catch handles it.
    - [L78](#l78) Bind <code>output</code>: leave the value undefined until a later assignment.
    - [L79](#l79) If <code>execution === 'live'</code> is truthy:
      - [L80](#l80) If <code>!process.env[config.ai.apiKeyEnv]?.trim()</code> is truthy:
        - [L80](#l80) Throw <code>new AiFailure('missing-credentials',&#96;Set ${config.ai.apiKeyEnv} in this process before live review.&#96;)</code>; normal execution stops until an enclosing catch handles it.
      - [L81](#l81) Bind <code>live</code>: test <code>options.budget</code>; choose <code>await requestBudgetQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv],options.budget)</code> when truthy, otherwise <code>await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv])</code>.
      - [L83](#l83) Bind <code>{output:liveOutput,...accounting}</code>: evaluate <code>live</code>; destructure the resulting value by property name or array position into the displayed local bindings.
      - [L84](#l84) If <code>options.budget</code> is truthy:
        - [L84](#l84) update <code>result.budget</code> with <code>{name:options.budget,...accounting}</code> using <code>=</code>; this mutation is visible to later statements.
      - [L84](#l84) Otherwise:
        - [L85](#l85) update <code>result.trial</code> with <code>accounting</code> using <code>=</code>; this mutation is visible to later statements.
      - [L86](#l86) update <code>output</code> with <code>liveOutput</code> using <code>=</code>; this mutation is visible to later statements.
    - [L79](#l79) Otherwise:
      - [L88](#l88) update <code>output</code> with <code>await requestQa(injected?.transport ?? mockTransport(context),request,context, config.ai.timeoutMs,injected ? injected.apiKey : 'offline-mock')</code> using <code>=</code>; this mutation is visible to later statements.
    - [L93](#l93) Bind <code>current</code>: create an object with 2 property/spread entries: <code>{files:[],preview:context.preview}</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
    - [L94](#l94) Run the protected block:
      - [L94](#l94) update <code>current</code> with <code>await collectContext(profile,sourceSettings,context.files.map(file=&gt;file.path))</code> using <code>=</code>; this mutation is visible to later statements.
    - [L94](#l94) If it throws:
    - [L96](#l96) Iterate <code>context.files</code> values, binding <code>const source</code> for each iteration:
      - [L97](#l97) Bind <code>unchanged</code>: compute <code>current.files.find(file=&gt;file.path===source.path)?.content===source.content</code> with the <code>===</code> operator.
      - [L98](#l98) Bind <code>metadata</code>: return the first matching element, or undefined: <code>result.preview.files.find(file=&gt;file.path===source.path)</code>; the TypeScript assertion adds no runtime validation.
      - [L99](#l99) update <code>metadata.freshness</code> with <code>unchanged?'unchanged':'changed-or-unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L100](#l100) If <code>!unchanged</code> is truthy:
        - [L100](#l100) update <code>result.preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L102](#l102) If <code>context.references</code> is truthy:
      - [L103](#l103) Run the protected block:
        - [L103](#l103) update <code>current.references</code> with <code>(await loadReferenceResources(profile.root,config,context.files.map(file=&gt;file.path),options.referenceAccess)).snapshots</code> using <code>=</code>; this mutation is visible to later statements.
      - [L103](#l103) If it throws:
        - [L104](#l104) update <code>current.references</code> with <code>[]</code> using <code>=</code>; this mutation is visible to later statements.
      - [L105](#l105) Iterate <code>context.references</code> values, binding <code>const reference</code> for each iteration:
        - [L106](#l106) Bind <code>fresh</code>: return the first matching element, or undefined: <code>current.references.find(item=&gt;item.record.id===reference.record.id)</code>.
        - [L107](#l107) Bind <code>unchanged</code>: evaluate <code>fresh?.record.sha256===reference.record.sha256 &amp;&amp; fresh?.content===reference.content</code> left to right with falsy short-circuiting.
        - [L108](#l108) Bind <code>metadata</code>: return the first matching element, or undefined: <code>result.preview.references?.find(item=&gt;item.id===reference.record.id)</code>.
        - [L109](#l109) If <code>metadata</code> is truthy:
          - [L109](#l109) update <code>metadata.freshness</code> with <code>unchanged?'unchanged':'changed-or-unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L110](#l110) If <code>!unchanged</code> is truthy:
          - [L110](#l110) update <code>result.preview.limited</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L113](#l113) Bind <code>candidates</code>: retain only elements whose callback returns a truthy value: <code>output.candidates.filter(candidate=&gt;candidate.evidence.some(evidence=&gt; context.files.some(file=&gt;file.path===evidence.path) &amp;&amp; (!options.paths &#124;&#124; options.paths.includes(evidence.path))))</code>.
    - [L115](#l115) update <code>result.coverage</code> with <code>{state:'complete',selectedPaths:[],validResponsePaths:[],failedResponsePaths:[],skippedPaths:[], matchedCandidates:0,rejectedCandidates:0,outOfScopeCandidates:output.candidates.length-candidates.length}</code> using <code>=</code>; this mutation is visible to later statements.
    - [L117](#l117) If <code>context.references</code> is truthy:
      - [L117](#l117) update <code>result.referenceConflicts</code> with <code>(output.referenceConflicts ?? []).map(conflict=&gt;({ ...conflict,id:&#96;ai/reference-conflict:${createHash('sha256').update(JSON.stringify(conflict)).digest('hex').slice(0,16)}&#96;, status:'needs-clarification',evidenceVerification:verifyEvidence(conflict,context,c…</code> using <code>=</code>; this mutation is visible to later statements.
    - [L121](#l121) Bind <code>conflictedPaths</code>: construct <code>Set</code> using <code>(result.referenceConflicts ?? []).flatMap(conflict=&gt;conflict.evidence.map(item=&gt;item.path))</code>; this creates the local instance used below.
    - [L122](#l122) If <code>task</code> is truthy:
      - [L123](#l123) update <code>result.taskReview</code> with <code>finishTaskReview(task,output,context,current,result.referenceConflicts ?? [],execution==='mock')</code> using <code>=</code>; this mutation is visible to later statements.
      - [L124](#l124) Run the protected block:
        - [L125](#l125) If <code>!options.reloadTask &#124;&#124; describeCurrentTask(await options.reloadTask()).sha256!==result.taskReview.taskHash</code> is truthy:
          - [L125](#l125) call the named operation with the supplied arguments: <code>invalidateTaskReview(result.taskReview)</code>.
        - [L125](#l125) Otherwise:
          - [L126](#l126) update <code>result.taskReview.freshness</code> with <code>'unchanged'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L124](#l124) If it throws:
        - [L127](#l127) call the named operation with the supplied arguments: <code>invalidateTaskReview(result.taskReview)</code>.
    - [L129](#l129) update <code>result.candidates</code> with <code>candidates.map(candidate=&gt;({ ...candidate, id:&#96;ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}&#96;, evidenceStatus:'unverified', origin:'ai', ...(context.references?{referenceConflict:candidate.evidence.some(item=&gt;conf…</code> using <code>=</code>; this mutation is visible to later statements.
- [L54](#l54) If it throws, bind <code>error</code>:
  - [L137](#l137) update <code>result.status</code> with <code>'failed'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L138](#l138) update <code>result.error</code> with <code>error instanceof AiFailure ? {code:error.code,message:error.message} : {code:'context-error',message:'AI context could not be prepared. Deterministic results are preserved.'}</code> using <code>=</code>; this mutation is visible to later statements.
- [L141](#l141) Bind <code>selectedPaths</code>: transform each element into a new array: <code>result.preview.files.map(file=&gt;file.path)</code>.
- [L142](#l142) Bind <code>rejectedCandidates</code>: read <code>result.candidates.filter(candidate=&gt;candidate.evidenceVerification?.status!=='matched').length</code>.
- [L143](#l143) update <code>result.coverage</code> with <code>{state:result.status==='failed'?'failed':result.status==='preview'?'preview': result.preview.limited &#124;&#124; result.preview.skipped.length&gt;0 &#124;&#124; rejectedCandidates&gt;0 &#124;&#124; (result.taskReview &amp;&amp; result.taskReview.state!=='assessed') &#124;&#124; (result.referenceConflicts?.len…</code> using <code>=</code>; this mutation is visible to later statements.
- [L149](#l149) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse({...report,ai:aiResultSchema.parse(result)})</code>.

<a id="fn-3815"></a>
### task.requirements.flatMap callback (58:113)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>task.requirements.flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L58](#l58) Implicitly return: create an array from <code>[item.id,item.text]</code>; spread elements insert the iterable values.

<a id="fn-3848"></a>
### [task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=&gt;[item.id,item.text])].some callback (58:146)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>[task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=&gt;[item.id,item.text])].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L58](#l58) Implicitly return: evaluate a regular expression against the value: <code>sensitiveContent.test(value)</code>.

<a id="fn-4508"></a>
### task.requirements.map callback (65:133)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>task.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L65](#l65) Implicitly return: read <code>item.id</code>.

<a id="fn-6727"></a>
### context.files.map callback (94:85)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>context.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L94](#l94) Implicitly return: read <code>file.path</code>.

<a id="fn-6972"></a>
### current.files.find callback (97:44)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>current.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L97](#l97) Implicitly return: compute <code>file.path===source.path</code> with the <code>===</code> operator.

<a id="fn-7079"></a>
### result.preview.files.find callback (98:50)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>result.preview.files.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L98](#l98) Implicitly return: compute <code>file.path===source.path</code> with the <code>===</code> operator.

<a id="fn-7378"></a>
### context.files.map callback (103:102)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>context.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L103](#l103) Implicitly return: read <code>file.path</code>.

<a id="fn-7574"></a>
### current.references.find callback (106:47)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>current.references.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L106](#l106) Implicitly return: compute <code>item.record.id===reference.record.id</code> with the <code>===</code> operator.

<a id="fn-7788"></a>
### inline callback (108:58)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L108](#l108) Implicitly return: compute <code>item.id===reference.record.id</code> with the <code>===</code> operator.

<a id="fn-8034"></a>
### output.candidates.filter callback (113:49)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>output.candidates.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L113](#l113) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>candidate.evidence.some(evidence=&gt; context.files.some(file=&gt;file.path===evidence.path) &amp;&amp; (!options.paths &#124;&#124; options.paths.includes(evidence.path)))</code>.

<a id="fn-8069"></a>
### candidate.evidence.some callback (113:84)

Synchronous function. Lexically inside [output.candidates.filter callback (113:49)](#fn-8034). Passed to <code>candidate.evidence.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>evidence</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L114](#l114) Implicitly return: evaluate <code>context.files.some(file=&gt;file.path===evidence.path) &amp;&amp; (!options.paths &#124;&#124; options.paths.includes(evidence.path))</code> left to right with falsy short-circuiting.

<a id="fn-8107"></a>
### context.files.some callback (114:28)

Synchronous function. Lexically inside [candidate.evidence.some callback (113:84)](#fn-8069). Passed to <code>context.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L114](#l114) Implicitly return: compute <code>file.path===evidence.path</code> with the <code>===</code> operator.

<a id="fn-8530"></a>
### (output.referenceConflicts ?? []).map callback (117:93)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>(output.referenceConflicts ?? []).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>conflict</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L117](#l117) Implicitly return: create an object with 4 property/spread entries: <code>{ ...conflict,id:&#96;ai/reference-conflict:${createHash('sha256').update(JSON.stringify(conflict)).digest('hex').slice(0,16)}&#96;, status:'needs-clarification',evidenceVerification:verifyEvidence(conflict,context,current), }</code>; later properties overwrite earlier spread values.

<a id="fn-8863"></a>
### (result.referenceConflicts ?? []).flatMap callback (121:79)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>(result.referenceConflicts ?? []).flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>conflict</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L121](#l121) Implicitly return: transform each element into a new array: <code>conflict.evidence.map(item=&gt;item.path)</code>.

<a id="fn-8895"></a>
### conflict.evidence.map callback (121:111)

Synchronous function. Lexically inside [(result.referenceConflicts ?? []).flatMap callback (121:79)](#fn-8863). Passed to <code>conflict.evidence.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L121](#l121) Implicitly return: read <code>item.path</code>.

<a id="fn-9395"></a>
### candidates.map callback (129:42)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>candidates.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L129](#l129) Implicitly return: create an object with 6 property/spread entries: <code>{ ...candidate, id:&#96;ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}&#96;, evidenceStatus:'unverified', origin:'ai', ...(context.references?{referenceConflict:candidate.evidence.some(item=&gt;conflictedPaths.has(item.path))…</code>; later properties overwrite earlier spread values.

<a id="fn-9651"></a>
### candidate.evidence.some callback (132:75)

Synchronous function. Lexically inside [candidates.map callback (129:42)](#fn-9395). Passed to <code>candidate.evidence.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L132](#l132) Implicitly return: test membership without changing the collection: <code>conflictedPaths.has(item.path)</code>.

<a id="fn-10086"></a>
### result.preview.files.map callback (141:48)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>result.preview.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L141](#l141) Implicitly return: read <code>file.path</code>.

<a id="fn-10156"></a>
### result.candidates.filter callback (142:53)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>result.candidates.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>candidate</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L142](#l142) Implicitly return: compute <code>candidate.evidenceVerification?.status!=='matched'</code> with the <code>!==</code> operator.

<a id="fn-10779"></a>
### result.preview.skipped.map callback (146:107)

Synchronous function. Lexically inside [reviewWithAi (35:8)](#fn-1653). Passed to <code>result.preview.skipped.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>file</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L146](#l146) Implicitly return: read <code>file.path</code>.

## Compile-time data contracts

### AiReviewOptions

```typescript
type AiReviewOptions = {
  execution: 'preview' | 'mock' | 'live';
  trial?: boolean;
  budget?: string;
  paths?: string[];
  mode?: AiMode;
  config?: ConfigInput;
  task?:CurrentTask;
  reloadTask?:()=>Promise<CurrentTask>;
  referenceAccess?:ReferenceAccess;
};
```

Declared at [L21](#l21). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### InjectedClient

```typescript
type InjectedClient = {transport:ResponseTransport; apiKey?:string};
```

Declared at [L33](#l33). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Directly importing tests

- [adversarial-review.test.ts](../../test/adversarial-review.test.ts)
- [external-references.test.ts](../../test/external-references.test.ts)
- [reference-ai.test.ts](../../test/reference-ai.test.ts)
- [task-ai.test.ts](../../test/task-ai.test.ts)

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
   1 | import { createHash } from 'node:crypto';
   2 | import { resolve } from 'node:path';
   3 | import { configSchema, loadConfig, type ConfigInput } from '../config.js';
   4 | import { inspectRepository } from '../inspect-repository.js';
   5 | import { createReport, reportSchema, type Report } from '../findings.js';
   6 | import { collectContext } from './context.js';
   7 | import { aiResultSchema, modeSchema, type AiMode, type AiResult } from './contracts.js';
   8 | import { AiFailure, buildRequest, mockTransport, requestQa, type ResponseTransport } from './client.js';
   9 | import { requestLiveQa, requestBudgetQa } from './live.js';
  10 | import { budgetNameSchema } from './audit-budget.js';
  11 | import { AUDIT_MODELS } from './audit-budget.js';
  12 | import { TRIAL_MODELS } from './trial-budget.js';
  13 | import { verifyEvidence } from './verify-evidence.js';
  14 | import {attachReferences} from './reference-context.js';
  15 | import {loadReferenceResources} from '../reference-resources.js';
  16 | import {currentTaskSchema,describeCurrentTask,type CurrentTask} from '../task-file.js';
  17 | import {pendingTaskReview,finishTaskReview,invalidateTaskReview} from './task-review.js';
  18 | import {sensitiveContent} from '../sensitive-content.js';
  19 | import type {ReferenceAccess} from '../reference-access.js';
  20 | 
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
<a id="l33"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | export type AiReviewOptions = {
  22 |   execution: 'preview' | 'mock' | 'live';
  23 |   trial?: boolean;
  24 |   budget?: string;
  25 |   paths?: string[];
  26 |   mode?: AiMode;
  27 |   config?: ConfigInput;
  28 |   task?:CurrentTask;
  29 |   reloadTask?:()=>Promise<CurrentTask>;
  30 |   referenceAccess?:ReferenceAccess;
  31 | };
  32 | /** Offline test seam: caller supplies transport and dummy credentials. */
  33 | export type InjectedClient = {transport:ResponseTransport; apiKey?:string};
  34 | 
  35 | export async function reviewWithAi(target = '.', options: AiReviewOptions = {execution:'preview'}, injected?: InjectedClient): Promise<Report> {
  36 |   if (!['preview','mock','live'].includes(options.execution) || (options.execution === 'live' && (!(options.trial || options.budget) || injected))) throw new Error('Live AI is disabled without explicit --trial or --budget activation.');
  37 |   if(options.budget)budgetNameSchema.parse(options.budget);
  38 |   if(options.trial && options.budget)throw new Error('Choose --trial or --budget, not both.');
  39 |   if(options.execution!=='live' && (options.trial || options.budget))throw new Error('Spending authorization requires live AI.');
  40 |   const config = options.config === undefined ? await loadConfig(resolve(target)) : configSchema.parse(options.config);
```

<a id="l41"></a>
<a id="l42"></a>
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
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   const mode = modeSchema.parse(options.mode ?? config.ai.mode);
  42 |   const profile = await inspectRepository(target,{respectGitignore:config.respectGitignore,exclude:config.exclude});
  43 |   const report = createReport(profile,config);
  44 |   const plannedModel = options.execution === 'live' ? (config.ai.models[mode] ?? (options.budget?AUDIT_MODELS:TRIAL_MODELS)[mode].model) : config.ai.models[mode];
  45 |   const execution = options.execution === 'live' ? 'live' : options.execution === 'preview' ? 'preview' : injected ? 'injected' : 'mock';
  46 |   const model = execution === 'mock' ? `mock-${mode}` : plannedModel;
  47 |   const result: AiResult = {
  48 |     execution, status:options.execution === 'preview' ? 'preview' : 'completed', mode,
  49 |     reviewer:'qa/reliability-v2',model,plannedModel,
  50 |     preview:{files:[],skipped:[],serializedBytes:0,limited:false},
  51 |     maxOutputTokens:config.ai.maxOutputTokens,requestBytes:0,estimatedInputTokens:0,
  52 |     estimatedCostUsd:null,actualCostUsd:execution === 'injected' || execution === 'live' ? null : 0,retries:0,candidates:[],error:null,
  53 |   };
  54 |   try {
  55 |     const task=options.task?currentTaskSchema.parse(options.task):undefined;
  56 |     if(task)result.taskReview=pendingTaskReview(task);
  57 |     const taskBytes=task?Buffer.byteLength(JSON.stringify(task)):0;
  58 |     if(task && [task.id,task.title,task.description,...task.files,...task.nonGoals,...task.requirements.flatMap(item=>[item.id,item.text])].some(value=>sensitiveContent.test(value)))
  59 |       throw new AiFailure('sensitive-task','Task text resembles sensitive credentials; no request was sent.');
  60 |     if(taskBytes>config.ai.maxContextBytes-256)throw new AiFailure('task-context-limit','Task exceeds available context space; no request was sent.');
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |     const sourceSettings={...config.ai,maxContextBytes:config.ai.maxContextBytes-taskBytes};
  62 |     const context = await collectContext(profile,sourceSettings,options.paths ?? task?.files);
  63 |     if(task) {
  64 |       context.task=task;
  65 |       context.preview.task={id:task.id,sha256:describeCurrentTask(task).sha256,bytes:taskBytes,requirementIds:task.requirements.map(item=>item.id)};
  66 |     }
  67 |     result.preview = context.preview;
  68 |     const referencesBlocked=await attachReferences(profile.root,{...config,ai:sourceSettings},context,options.referenceAccess);
  69 |     context.preview.serializedBytes+=taskBytes;
  70 |     if(referencesBlocked)throw new AiFailure('reference-context','A required applicable reference is unavailable, ambiguous, or exceeds remaining context space. No request was sent.');
  71 |     const request = buildRequest(context,config.ai,model ?? 'MODEL_NOT_SELECTED');
  72 |     result.requestBytes = Buffer.byteLength(JSON.stringify(request));
  73 |     // Heuristic only, not a billing quote or token cap. Includes prompt/schema overhead.
  74 |     result.estimatedInputTokens = Math.ceil(result.requestBytes / 3);
  75 |     if (options.execution !== 'preview') {
  76 |       if (context.files.length === 0) throw new AiFailure('empty-context','No eligible source files were selected.');
  77 |       if (injected && !plannedModel) throw new AiFailure('missing-model','Select a model mapping before using an injected client.');
  78 |       let output;
  79 |       if (execution === 'live') {
  80 |         if(!process.env[config.ai.apiKeyEnv]?.trim()) throw new AiFailure('missing-credentials',`Set ${config.ai.apiKeyEnv} in this process before live review.`);
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
<a id="l93"></a>
<a id="l94"></a>
<a id="l96"></a>
<a id="l97"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 |         const live = options.budget ? await requestBudgetQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv],options.budget)
  82 |           : await requestLiveQa(request,context,mode,config.ai.timeoutMs,process.env[config.ai.apiKeyEnv]);
  83 |         const {output:liveOutput,...accounting} = live;
  84 |         if(options.budget)result.budget={name:options.budget,...accounting};
  85 |         else result.trial = accounting;
  86 |         output = liveOutput;
  87 |       } else {
  88 |         output = await requestQa(injected?.transport ?? mockTransport(context),request,context,
  89 |           config.ai.timeoutMs,injected ? injected.apiKey : 'offline-mock');
  90 |       }
  91 |       // Reuse the same bounded, exclusion-aware, link-rejecting reads. A missing,
  92 |       // modified, or newly ineligible file cannot receive a matched citation.
  93 |       let current = {files:[],preview:context.preview} as typeof context;
  94 |       try { current = await collectContext(profile,sourceSettings,context.files.map(file=>file.path)); } catch { /* Fail closed for every citation. */ }
  95 |       // A no-candidate response still describes the submitted snapshot, not later edits.
  96 |       for(const source of context.files) {
  97 |         const unchanged=current.files.find(file=>file.path===source.path)?.content===source.content;
  98 |         const metadata=result.preview.files.find(file=>file.path===source.path)!;
  99 |         metadata.freshness=unchanged?'unchanged':'changed-or-unavailable';
 100 |         if(!unchanged)result.preview.limited=true;
```

<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l113"></a>
<a id="l114"></a>
<a id="l115"></a>
<a id="l116"></a>
<a id="l117"></a>
<a id="l118"></a>
<a id="l119"></a>

```text
 101 |       }
 102 |       if(context.references) {
 103 |         try { current.references=(await loadReferenceResources(profile.root,config,context.files.map(file=>file.path),options.referenceAccess)).snapshots; }
 104 |         catch { current.references=[]; }
 105 |         for(const reference of context.references) {
 106 |           const fresh=current.references.find(item=>item.record.id===reference.record.id);
 107 |           const unchanged=fresh?.record.sha256===reference.record.sha256 && fresh?.content===reference.content;
 108 |           const metadata=result.preview.references?.find(item=>item.id===reference.record.id);
 109 |           if(metadata)metadata.freshness=unchanged?'unchanged':'changed-or-unavailable';
 110 |           if(!unchanged)result.preview.limited=true;
 111 |         }
 112 |       }
 113 |       const candidates=output.candidates.filter(candidate=>candidate.evidence.some(evidence=>
 114 |         context.files.some(file=>file.path===evidence.path) && (!options.paths || options.paths.includes(evidence.path))));
 115 |       result.coverage={state:'complete',selectedPaths:[],validResponsePaths:[],failedResponsePaths:[],skippedPaths:[],
 116 |         matchedCandidates:0,rejectedCandidates:0,outOfScopeCandidates:output.candidates.length-candidates.length};
 117 |       if(context.references)result.referenceConflicts=(output.referenceConflicts ?? []).map(conflict=>({
 118 |         ...conflict,id:`ai/reference-conflict:${createHash('sha256').update(JSON.stringify(conflict)).digest('hex').slice(0,16)}`,
 119 |         status:'needs-clarification',evidenceVerification:verifyEvidence(conflict,context,current),
 120 |       }));
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l129"></a>
<a id="l130"></a>
<a id="l131"></a>
<a id="l132"></a>
<a id="l133"></a>
<a id="l136"></a>
<a id="l137"></a>
<a id="l138"></a>
<a id="l139"></a>

```text
 121 |       const conflictedPaths=new Set((result.referenceConflicts ?? []).flatMap(conflict=>conflict.evidence.map(item=>item.path)));
 122 |       if(task) {
 123 |         result.taskReview=finishTaskReview(task,output,context,current,result.referenceConflicts ?? [],execution==='mock');
 124 |         try {
 125 |           if(!options.reloadTask || describeCurrentTask(await options.reloadTask()).sha256!==result.taskReview.taskHash)invalidateTaskReview(result.taskReview);
 126 |           else result.taskReview.freshness='unchanged';
 127 |         } catch {invalidateTaskReview(result.taskReview);}
 128 |       }
 129 |       result.candidates = candidates.map(candidate=>({
 130 |         ...candidate, id:`ai/qa:${createHash('sha256').update(JSON.stringify(candidate)).digest('hex').slice(0,16)}`,
 131 |         evidenceStatus:'unverified', origin:'ai',
 132 |         ...(context.references?{referenceConflict:candidate.evidence.some(item=>conflictedPaths.has(item.path))}:{}),
 133 |         evidenceVerification:verifyEvidence(candidate,context,current),
 134 |       }));
 135 |     }
 136 |   } catch (error) {
 137 |     result.status = 'failed';
 138 |     result.error = error instanceof AiFailure ? {code:error.code,message:error.message}
 139 |       : {code:'context-error',message:'AI context could not be prepared. Deterministic results are preserved.'};
 140 |   }
```

<a id="l141"></a>
<a id="l142"></a>
<a id="l143"></a>
<a id="l144"></a>
<a id="l145"></a>
<a id="l146"></a>
<a id="l147"></a>
<a id="l148"></a>
<a id="l149"></a>

```text
 141 |   const selectedPaths=result.preview.files.map(file=>file.path);
 142 |   const rejectedCandidates=result.candidates.filter(candidate=>candidate.evidenceVerification?.status!=='matched').length;
 143 |   result.coverage={state:result.status==='failed'?'failed':result.status==='preview'?'preview':
 144 |     result.preview.limited || result.preview.skipped.length>0 || rejectedCandidates>0 || (result.taskReview && result.taskReview.state!=='assessed') || (result.referenceConflicts?.length ?? 0)>0 || (result.coverage?.outOfScopeCandidates ?? 0)>0?'partial':'complete',
 145 |     selectedPaths,validResponsePaths:result.status==='completed'?selectedPaths:[],
 146 |     failedResponsePaths:result.status==='failed'?selectedPaths:[],skippedPaths:result.preview.skipped.map(file=>file.path),
 147 |     matchedCandidates:result.candidates.length-rejectedCandidates,rejectedCandidates,
 148 |     outOfScopeCandidates:result.coverage?.outOfScopeCandidates ?? 0};
 149 |   return reportSchema.parse({...report,ai:aiResultSchema.parse(result)});
 150 | }
 151 | 
```
