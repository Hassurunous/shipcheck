# src/workflows.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

This is the integrated orchestration layer. changedPaths obtains tracked changes against HEAD and enumerates untracked entries locally so ambient Git ignore settings cannot silently narrow scope. runWorkflow resolves task/scope/configuration, runs authorized external tools, loads references, chooses deterministic or AI review, rechecks task identity, performs HTTP/SDK/architecture assessments, then filters deterministic findings by evidence paths. These stages can read at different times: there is no atomic repository snapshot.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `4f62d2915b15a9ed636a991494c4fe8f1edb704d5ff4e12bb7a044f033480f13`.

This chapter inventories **9 function bodies/callbacks**, **42 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./ignore-policy.js</code>: <code>createIgnorePolicy</code>.
- <code>./architecture-audit.js</code>: <code>auditArchitecture</code>.
- <code>./sdk-audit.js</code>: <code>auditSdkContracts</code>.
- <code>node:child_process</code>: <code>execFile</code>.
- <code>node:util</code>: <code>promisify</code>.
- <code>node:fs/promises</code>: <code>realpath</code>, <code>lstat</code>, <code>readdir</code>.
- <code>node:path</code>: <code>join</code>, <code>resolve</code>.
- <code>./filesystem-policy.js</code>: <code>validateRoot</code>.
- <code>./review-repository.js</code>: <code>reviewRepository</code>.
- <code>./ai/review.js</code>: <code>reviewWithAi</code>, <code>AiReviewOptions</code> (type only).
- <code>./findings.js</code>: <code>reportSchema</code>, <code>Report</code> (type only).
- <code>./task-file.js</code>: <code>loadTask</code>, <code>describeCurrentTask</code>, <code>normalizeLegacyTask</code>.
- <code>./ai/task-review.js</code>: <code>invalidateTaskReview</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>loadConfig</code>, <code>ConfigInput</code> (type only).
- <code>./checks.js</code>: <code>runChecks</code>.
- <code>./ai/whole-repository.js</code>: <code>reviewWholeRepository</code>.
- <code>./inspect-repository.js</code>: <code>inspectRepository</code>.
- <code>./reference-resources.js</code>: <code>loadReferenceResources</code>.
- <code>./contract-audit.js</code>: <code>auditContracts</code>.
- <code>./reference-access.js</code>: <code>ReferenceAccess</code> (type only).

## Module execution

- [L24](#l24) Bind <code>exec</code>: call the named operation with the supplied arguments: <code>promisify(execFile)</code>.

## Function index

- [git (25:1)](#fn-1341)
- [changedPaths (29:8)](#fn-1677)
- [runWorkflow (57:8)](#fn-3311)
- [inlineTask.requirements.map callback (63:106)](#fn-4072)
- [reloadTask (68:20)](#fn-4379)
- [config.checks.some callback (99:59)](#fn-6165)
- [inline callback (114:114)](#fn-7644)
- [report.findings.filter callback (127:45)](#fn-8352)
- [f.evidence.some callback (127:64)](#fn-8371)

<a id="fn-1341"></a>
### git (25:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>args:string[]</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L26](#l26) Run the protected block:
  - [L26](#l26) Return to the caller: read <code>(await exec('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',timeout:10000,maxBuffer:1024*1024,windowsHide:true})).stdout</code>.
- [L26](#l26) If it throws:
  - [L27](#l27) Throw <code>new Error('Git inspection failed. Use a Git repository with a valid HEAD; Git must be installed.')</code>; normal execution stops until an enclosing catch handles it.

<a id="fn-1677"></a>
### changedPaths (29:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>input?:ConfigInput</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L30](#l30) <code>root</code>: wait for <code>realpath(await validateRoot(target))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L31](#l31) <code>top</code>: call the named operation with the supplied arguments: <code>(await git(root,['rev-parse','--show-toplevel'])).trim()</code>.
- [L33](#l33) <code>tracked</code>: wait for <code>git(root,['diff','--no-ext-diff','--no-textconv','--name-only','-z','HEAD','--'])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L36](#l36) <code>config</code>: leave the value undefined until a later assignment.
- [L36](#l36) <code>configError:unknown</code>: leave the value undefined until a later assignment.
- [L39](#l39) <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,config)</code>.
- [L40](#l40) <code>indexed</code>: construct <code>Set</code> using <code>(await git(root,['ls-files','--cached','-z'])).split('\0')</code>; this creates the local instance used below.
- [L41](#l41) <code>candidates</code>: retain only elements whose callback returns a truthy value: <code>tracked.split('\0').filter(Boolean)</code>.
- [L41](#l41) <code>pending</code>: create an array from <code>['']</code>; spread elements insert the iterable values.
- [L43](#l43) <code>parent</code>: call the named operation with the supplied arguments: <code>pending.pop()</code>; the TypeScript assertion adds no runtime validation.
- [L44](#l44) <code>entry</code>: receive the next iterable value from <code>await readdir(join(root,parent),{withFileTypes:true})</code> at the start of each loop iteration.
- [L45](#l45) <code>path</code>: test <code>parent</code>; choose <code>parent+'/'+entry.name</code> when truthy, otherwise <code>entry.name</code>.
- [L51](#l51) <code>selected:string[]</code>: create a new empty array to accumulate ordered results.
- [L52](#l52) <code>path</code>: receive the next iterable value from <code>[...new Set(candidates)].sort()</code> at the start of each loop iteration.

Execution:

- [L30](#l30) Bind <code>root</code>: wait for <code>realpath(await validateRoot(target))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L31](#l31) Bind <code>top</code>: call the named operation with the supplied arguments: <code>(await git(root,['rev-parse','--show-toplevel'])).trim()</code>.
- [L32](#l32) If <code>await realpath(top) !== root</code> is truthy:
  - [L32](#l32) Throw <code>new Error('Diff target must be the Git repository root.')</code>; normal execution stops until an enclosing catch handles it.
- [L33](#l33) Bind <code>tracked</code>: wait for <code>git(root,['diff','--no-ext-diff','--no-textconv','--name-only','-z','HEAD','--'])</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L36](#l36) Bind <code>config</code>: leave the value undefined until a later assignment.
- [L36](#l36) Bind <code>configError:unknown</code>: leave the value undefined until a later assignment.
- [L37](#l37) Run the protected block:
  - [L37](#l37) update <code>config</code> with <code>input===undefined?await loadConfig(root):configSchema.parse(input)</code> using <code>=</code>; this mutation is visible to later statements.
- [L37](#l37) If it throws, bind <code>error</code>:
  - [L38](#l38) update <code>configError</code> with <code>error</code> using <code>=</code>; this mutation is visible to later statements.
  - [L38](#l38) update <code>config</code> with <code>configSchema.parse({})</code> using <code>=</code>; this mutation is visible to later statements.
- [L39](#l39) Bind <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,config)</code>.
- [L40](#l40) Bind <code>indexed</code>: construct <code>Set</code> using <code>(await git(root,['ls-files','--cached','-z'])).split('\0')</code>; this creates the local instance used below.
- [L41](#l41) Bind <code>candidates</code>: retain only elements whose callback returns a truthy value: <code>tracked.split('\0').filter(Boolean)</code>.
- [L41](#l41) Bind <code>pending</code>: create an array from <code>['']</code>; spread elements insert the iterable values.
- [L42](#l42) Repeat while <code>pending.length</code>:
  - [L43](#l43) Bind <code>parent</code>: call the named operation with the supplied arguments: <code>pending.pop()</code>; the TypeScript assertion adds no runtime validation.
  - [L44](#l44) Iterate <code>await readdir(join(root,parent),{withFileTypes:true})</code> values, binding <code>const entry</code> for each iteration:
    - [L45](#l45) Bind <code>path</code>: test <code>parent</code>; choose <code>parent+'/'+entry.name</code> when truthy, otherwise <code>entry.name</code>.
    - [L46](#l46) If <code>await policy.reason(path,entry.isDirectory())</code> is truthy:
      - [L46](#l46) Skip the rest of this iteration and advance the enclosing loop.
    - [L47](#l47) If <code>entry.isDirectory()</code> is truthy:
      - [L47](#l47) append values to the existing array: <code>pending.push(path)</code>.
    - [L47](#l47) Otherwise:
      - [L48](#l48) If <code>!indexed.has(path)</code> is truthy:
        - [L48](#l48) append values to the existing array: <code>candidates.push(path)</code>.
- [L51](#l51) Bind <code>selected:string[]</code>: create a new empty array to accumulate ordered results.
- [L52](#l52) Iterate <code>[...new Set(candidates)].sort()</code> values, binding <code>const path</code> for each iteration:
  - [L52](#l52) If <code>!await policy.reason(path)</code> is truthy:
    - [L52](#l52) append values to the existing array: <code>selected.push(path)</code>.
- [L54](#l54) If <code>selected.length &amp;&amp; configError</code> is truthy:
  - [L54](#l54) Throw <code>configError</code>; normal execution stops until an enclosing catch handles it.
- [L55](#l55) Return to the caller: evaluate <code>selected</code>.

<a id="fn-3311"></a>
### runWorkflow (57:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>kind:'audit'&#124;'diff'&#124;'task'</code>: supplied by the caller; usage is shown in the steps below.
- <code>ai?:AiReviewOptions</code>: supplied by the caller; usage is shown in the steps below.
- <code>options:WorkflowOptions={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L60](#l60) <code>inlineConfig</code>: test <code>options.currentTask</code>; choose <code>await loadConfig(target)</code> when truthy, otherwise <code>undefined</code>.
- [L61](#l61) <code>inlineTask</code>: read <code>inlineConfig?.currentTask</code>; optional access returns undefined when its receiver is null/undefined.
- [L63](#l63) <code>task</code>: test <code>inlineTask</code>; choose <code>{repository:target,files:inlineTask.files,criteria:inlineTask.requirements.map(item=&gt;item.text)}</code> when truthy, otherwise <code>kind==='task' ? await loadTask(target) : undefined</code>.
- [L65](#l65) <code>taskFile</code>: test <code>kind==='task' &amp;&amp; !inlineTask</code>; choose <code>resolve(target)</code> when truthy, otherwise <code>undefined</code>.
- [L67](#l67) <code>taskDefinition</code>: use <code>inlineTask</code> unless null/undefined, then evaluate <code>task?normalizeLegacyTask({version:1,...task}):undefined</code>.
- [L68](#l68) <code>reloadTask</code>: create [reloadTask (68:20)](#fn-4379); its body runs when called, not when this value is created.
- [L78](#l78) <code>paths</code>: test <code>kind==='diff'</code>; choose <code>await changedPaths(target,ai?.config)</code> when truthy, otherwise <code>task ? [...new Set(task.files)].sort() : undefined</code>.
- [L82](#l82) <code>unavailablePaths: string[]</code>: create a new empty array to accumulate ordered results.
- [L83](#l83) <code>path</code>: receive the next iterable value from <code>paths ?? []</code> at the start of each loop iteration.
- [L84](#l84) <code>current</code>: evaluate <code>target</code>.
- [L86](#l86) <code>part</code>: receive the next iterable value from <code>path.split('/')</code> at the start of each loop iteration.
- [L94](#l94) <code>config</code>: use <code>inlineConfig</code> unless null/undefined, then evaluate <code>ai?.config===undefined?await loadConfig(target):configSchema.parse(ai.config)</code>.
- [L95](#l95) <code>referenceAccess</code>: use <code>options.referenceAccess ?? ai?.referenceAccess</code> unless null/undefined, then evaluate <code>{}</code>.
- [L96](#l96) <code>whole</code>: evaluate <code>kind==='audit' &amp;&amp; (options.wholeRepository &#124;&#124; config.ai.scope==='whole-repository')</code> left to right with falsy short-circuiting.
- [L98](#l98) <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L99](#l99) <code>languages</code>: test <code>options.runChecks &amp;&amp; config.checks.some(check=&gt;check.languages)</code>; choose <code>Object.keys((await inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude})).languages)</code> when truthy, otherwise <code>undefined</code>.
- [L101](#l101) <code>checks</code>: wait for <code>runChecks(root,config.checks,options.runChecks===true,config.ai.apiKeyEnv,languages)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L102](#l102) <code>references</code>: test <code>config.resources.length</code>; choose <code>(await loadReferenceResources(target,config,paths,referenceAccess)).report</code> when truthy, otherwise <code>undefined</code>.
- [L103](#l103) <code>report</code>: test <code>ai &amp;&amp; paths?.length !== 0 &amp;&amp; references?.state!=='incomplete'</code>; choose <code>whole ? await reviewWholeRepository(target,{...ai,config,referenceAccess}) : await reviewWithAi(target,{...ai,config,referenceAccess,...(taskDefinition?{task:taskDefinition,reloadTask}:{}),...(paths ? {paths} : {})})</code> when truthy, otherwise <code>await reviewRepository(target,config)</code>.
- [L110](#l110) <code>taskSummary</code>: test <code>taskDefinition</code>; choose <code>describeCurrentTask(taskDefinition)</code> when truthy, otherwise <code>undefined</code>.
- [L114](#l114) <code>requirement</code>: receive the next iterable value from <code>taskSummary.requirements</code> at the start of each loop iteration.
- [L116](#l116) <code>selected</code>: construct <code>Set</code> using <code>paths</code>; this creates the local instance used below.
- [L117](#l117) <code>contracts</code>: wait for <code>auditContracts(report.root,config,paths,referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L118](#l118) <code>sdkContracts</code>: wait for <code>auditSdkContracts(report.root,config,paths,referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L119](#l119) <code>architecture</code>: wait for <code>auditArchitecture(report.root,config,paths)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L58](#l58) If <code>options.wholeRepository &amp;&amp; (kind!=='audit' &#124;&#124; !ai)</code> is truthy:
  - [L58](#l58) Throw <code>new Error('--whole-repository requires audit with --ai.')</code>; normal execution stops until an enclosing catch handles it.
- [L59](#l59) If <code>options.currentTask &amp;&amp; kind!=='task'</code> is truthy:
  - [L59](#l59) Throw <code>new Error('Inline current task requires the task workflow.')</code>; normal execution stops until an enclosing catch handles it.
- [L60](#l60) Bind <code>inlineConfig</code>: test <code>options.currentTask</code>; choose <code>await loadConfig(target)</code> when truthy, otherwise <code>undefined</code>.
- [L61](#l61) Bind <code>inlineTask</code>: read <code>inlineConfig?.currentTask</code>; optional access returns undefined when its receiver is null/undefined.
- [L62](#l62) If <code>options.currentTask &amp;&amp; !inlineTask</code> is truthy:
  - [L62](#l62) Throw <code>new Error('No currentTask configured in shipcheck.config.json. Define it or use shipcheck task &lt;task-file&gt;.')</code>; normal execution stops until an enclosing catch handles it.
- [L63](#l63) Bind <code>task</code>: test <code>inlineTask</code>; choose <code>{repository:target,files:inlineTask.files,criteria:inlineTask.requirements.map(item=&gt;item.text)}</code> when truthy, otherwise <code>kind==='task' ? await loadTask(target) : undefined</code>.
- [L65](#l65) Bind <code>taskFile</code>: test <code>kind==='task' &amp;&amp; !inlineTask</code>; choose <code>resolve(target)</code> when truthy, otherwise <code>undefined</code>.
- [L66](#l66) If <code>task</code> is truthy:
  - [L66](#l66) update <code>target</code> with <code>task.repository</code> using <code>=</code>; this mutation is visible to later statements.
- [L67](#l67) Bind <code>taskDefinition</code>: use <code>inlineTask</code> unless null/undefined, then evaluate <code>task?normalizeLegacyTask({version:1,...task}):undefined</code>.
- [L68](#l68) Bind <code>reloadTask</code>: create [reloadTask (68:20)](#fn-4379); its body runs when called, not when this value is created.
- [L78](#l78) Bind <code>paths</code>: test <code>kind==='diff'</code>; choose <code>await changedPaths(target,ai?.config)</code> when truthy, otherwise <code>task ? [...new Set(task.files)].sort() : undefined</code>.
- [L79](#l79) If <code>kind==='diff' &amp;&amp; paths?.length===0</code> is truthy:
  - [L79](#l79) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse({schemaVersion:1, root:await realpath(await validateRoot(target)),findings:[],inspectionWarnings:[], workflow:{kind:'diff',scope:[],baseline:'HEAD',unavailablePaths:[]}})</code>.
- [L82](#l82) Bind <code>unavailablePaths: string[]</code>: create a new empty array to accumulate ordered results.
- [L83](#l83) Iterate <code>paths ?? []</code> values, binding <code>const path</code> for each iteration:
  - [L84](#l84) Bind <code>current</code>: evaluate <code>target</code>.
  - [L85](#l85) Run the protected block:
    - [L86](#l86) Iterate <code>path.split('/')</code> values, binding <code>const part</code> for each iteration:
      - [L87](#l87) update <code>current</code> with <code>join(current,part)</code> using <code>=</code>; this mutation is visible to later statements.
      - [L88](#l88) If <code>(await lstat(current)).isSymbolicLink()</code> is truthy:
        - [L88](#l88) Throw <code>new Error('link')</code>; normal execution stops until an enclosing catch handles it.
    - [L90](#l90) If <code>!(await lstat(current)).isFile()</code> is truthy:
      - [L90](#l90) Throw <code>new Error('not-file')</code>; normal execution stops until an enclosing catch handles it.
  - [L85](#l85) If it throws:
    - [L91](#l91) append values to the existing array: <code>unavailablePaths.push(path)</code>.
- [L93](#l93) If <code>task &amp;&amp; unavailablePaths.length</code> is truthy:
  - [L93](#l93) Throw <code>new Error('Task selects missing, linked, or non-regular files. Correct the task file before review.')</code>; normal execution stops until an enclosing catch handles it.
- [L94](#l94) Bind <code>config</code>: use <code>inlineConfig</code> unless null/undefined, then evaluate <code>ai?.config===undefined?await loadConfig(target):configSchema.parse(ai.config)</code>.
- [L95](#l95) Bind <code>referenceAccess</code>: use <code>options.referenceAccess ?? ai?.referenceAccess</code> unless null/undefined, then evaluate <code>{}</code>.
- [L96](#l96) Bind <code>whole</code>: evaluate <code>kind==='audit' &amp;&amp; (options.wholeRepository &#124;&#124; config.ai.scope==='whole-repository')</code> left to right with falsy short-circuiting.
- [L98](#l98) Bind <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L99](#l99) Bind <code>languages</code>: test <code>options.runChecks &amp;&amp; config.checks.some(check=&gt;check.languages)</code>; choose <code>Object.keys((await inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude})).languages)</code> when truthy, otherwise <code>undefined</code>.
- [L101](#l101) Bind <code>checks</code>: wait for <code>runChecks(root,config.checks,options.runChecks===true,config.ai.apiKeyEnv,languages)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L102](#l102) Bind <code>references</code>: test <code>config.resources.length</code>; choose <code>(await loadReferenceResources(target,config,paths,referenceAccess)).report</code> when truthy, otherwise <code>undefined</code>.
- [L103](#l103) Bind <code>report</code>: test <code>ai &amp;&amp; paths?.length !== 0 &amp;&amp; references?.state!=='incomplete'</code>; choose <code>whole ? await reviewWholeRepository(target,{...ai,config,referenceAccess}) : await reviewWithAi(target,{...ai,config,referenceAccess,...(taskDefinition?{task:taskDefinition,reloadTask}:{}),...(paths ? {paths} : {})})</code> when truthy, otherwise <code>await reviewRepository(target,config)</code>.
- [L105](#l105) If <code>report.ai?.taskReview &amp;&amp; report.ai.taskReview.freshness==='unchanged'</code> is truthy:
  - [L106](#l106) Run the protected block:
    - [L106](#l106) If <code>describeCurrentTask(await reloadTask()).sha256!==report.ai.taskReview.taskHash</code> is truthy:
      - [L106](#l106) call the named operation with the supplied arguments: <code>invalidateTaskReview(report.ai.taskReview)</code>.
  - [L106](#l106) If it throws:
    - [L107](#l107) call the named operation with the supplied arguments: <code>invalidateTaskReview(report.ai.taskReview)</code>.
  - [L108](#l108) If <code>report.ai.taskReview.state==='changed' &amp;&amp; report.ai.coverage</code> is truthy:
    - [L108](#l108) update <code>report.ai.coverage.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
- [L110](#l110) Bind <code>taskSummary</code>: test <code>taskDefinition</code>; choose <code>describeCurrentTask(taskDefinition)</code> when truthy, otherwise <code>undefined</code>.
- [L111](#l111) If <code>taskSummary</code> is truthy:
  - [L112](#l112) update <code>taskSummary.source</code> with <code>taskFile?'task-file':'configuration'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L113](#l113) update <code>taskSummary.assessment</code> with <code>report.ai?.taskReview?.state ?? 'not-assessed'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L114](#l114) Iterate <code>taskSummary.requirements</code> values, binding <code>const requirement</code> for each iteration:
    - [L114](#l114) update <code>requirement.status</code> with <code>report.ai?.taskReview?.assessments.find(item=&gt;item.requirementId===requirement.id)?.status ?? 'insufficient-evidence'</code> using <code>=</code>; this mutation is visible to later statements.
- [L116](#l116) Bind <code>selected</code>: construct <code>Set</code> using <code>paths</code>; this creates the local instance used below.
- [L117](#l117) Bind <code>contracts</code>: wait for <code>auditContracts(report.root,config,paths,referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L118](#l118) Bind <code>sdkContracts</code>: wait for <code>auditSdkContracts(report.root,config,paths,referenceAccess)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L119](#l119) Bind <code>architecture</code>: wait for <code>auditArchitecture(report.root,config,paths)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L120](#l120) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse({...report, ...(taskSummary?{currentTask:taskSummary}:{}), ...(references?{references}:{}), ...(checks.length?{checks}:{}), ...(contracts.length?{contracts}:{}), ...(sdkContracts.length?{sdkContracts}:{}), ...(architecture?{architecture}:…</code>.

<a id="fn-4072"></a>
### inlineTask.requirements.map callback (63:106)

Synchronous function. Lexically inside [runWorkflow (57:8)](#fn-3311). Passed to <code>inlineTask.requirements.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L63](#l63) Implicitly return: read <code>item.text</code>.

<a id="fn-4379"></a>
### reloadTask (68:20)

Asynchronous function: returns a Promise. Lexically inside [runWorkflow (57:8)](#fn-3311). 

Local bindings (nested callback locals are documented with that callback):

- [L70](#l70) <code>fresh</code>: wait for <code>loadTask(taskFile)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L74](#l74) <code>fresh</code>: read <code>(await loadConfig(target)).currentTask</code>.

Execution:

- [L69](#l69) If <code>taskFile</code> is truthy:
  - [L70](#l70) Bind <code>fresh</code>: wait for <code>loadTask(taskFile)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L71](#l71) If <code>resolve(fresh.repository)!==resolve(target)</code> is truthy:
    - [L71](#l71) Throw <code>new Error('Task repository changed.')</code>; normal execution stops until an enclosing catch handles it.
  - [L72](#l72) Return to the caller: call the named operation with the supplied arguments: <code>normalizeLegacyTask(fresh)</code>.
- [L74](#l74) Bind <code>fresh</code>: read <code>(await loadConfig(target)).currentTask</code>.
- [L75](#l75) If <code>!fresh</code> is truthy:
  - [L75](#l75) Throw <code>new Error('Current task is unavailable.')</code>; normal execution stops until an enclosing catch handles it.
- [L76](#l76) Return to the caller: evaluate <code>fresh</code>.

<a id="fn-6165"></a>
### config.checks.some callback (99:59)

Synchronous function. Lexically inside [runWorkflow (57:8)](#fn-3311). Passed to <code>config.checks.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L99](#l99) Implicitly return: read <code>check.languages</code>.

<a id="fn-7644"></a>
### inline callback (114:114)

Synchronous function. Lexically inside [runWorkflow (57:8)](#fn-3311). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L114](#l114) Implicitly return: compute <code>item.requirementId===requirement.id</code> with the <code>===</code> operator.

<a id="fn-8352"></a>
### report.findings.filter callback (127:45)

Synchronous function. Lexically inside [runWorkflow (57:8)](#fn-3311). Passed to <code>report.findings.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L127](#l127) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>f.evidence.some(e=&gt;selected.has(e.path))</code>.

<a id="fn-8371"></a>
### f.evidence.some callback (127:64)

Synchronous function. Lexically inside [report.findings.filter callback (127:45)](#fn-8352). Passed to <code>f.evidence.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>e</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L127](#l127) Implicitly return: test membership without changing the collection: <code>selected.has(e.path)</code>.

## Compile-time data contracts

### WorkflowOptions

```typescript
type WorkflowOptions={runChecks?:boolean;wholeRepository?:boolean;currentTask?:boolean;referenceAccess?:ReferenceAccess};
```

Declared at [L22](#l22). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L24](#l24) <code>exec</code>: call the named operation with the supplied arguments: <code>promisify(execFile)</code>.

## Directly importing tests

- [check-order.test.ts](../../test/check-order.test.ts)
- [current-task.test.ts](../../test/current-task.test.ts)
- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
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
<a id="l20"></a>

```text
   1 | import {createIgnorePolicy} from './ignore-policy.js';
   2 | import {auditArchitecture} from './architecture-audit.js';
   3 | import {auditSdkContracts} from './sdk-audit.js';
   4 | import { execFile } from 'node:child_process';
   5 | import { promisify } from 'node:util';
   6 | import { realpath, lstat, readdir } from 'node:fs/promises';
   7 | import { join,resolve } from 'node:path';
   8 | import { validateRoot } from './filesystem-policy.js';
   9 | import { reviewRepository } from './review-repository.js';
  10 | import { reviewWithAi, type AiReviewOptions } from './ai/review.js';
  11 | import { reportSchema, type Report } from './findings.js';
  12 | import { loadTask, describeCurrentTask,normalizeLegacyTask } from './task-file.js';
  13 | import {invalidateTaskReview} from './ai/task-review.js';
  14 | import { configSchema, loadConfig, type ConfigInput } from './config.js';
  15 | import { runChecks } from './checks.js';
  16 | import { reviewWholeRepository } from './ai/whole-repository.js';
  17 | import { inspectRepository } from './inspect-repository.js';
  18 | import { loadReferenceResources } from './reference-resources.js';
  19 | import {auditContracts} from './contract-audit.js';
  20 | import type {ReferenceAccess} from './reference-access.js';
```

<a id="l22"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 | 
  22 | export type WorkflowOptions={runChecks?:boolean;wholeRepository?:boolean;currentTask?:boolean;referenceAccess?:ReferenceAccess};
  23 | 
  24 | const exec = promisify(execFile);
  25 | async function git(root:string, args:string[]) {
  26 |   try { return (await exec('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',timeout:10000,maxBuffer:1024*1024,windowsHide:true})).stdout; }
  27 |   catch { throw new Error('Git inspection failed. Use a Git repository with a valid HEAD; Git must be installed.'); }
  28 | }
  29 | export async function changedPaths(target:string,input?:ConfigInput): Promise<string[]> {
  30 |   const root = await realpath(await validateRoot(target));
  31 |   const top = (await git(root,['rev-parse','--show-toplevel'])).trim();
  32 |   if (await realpath(top) !== root) throw new Error('Diff target must be the Git repository root.');
  33 |   const tracked = await git(root,['diff','--no-ext-diff','--no-textconv','--name-only','-z','HEAD','--']);
  34 |   // Enumerate locally: --exclude-standard would inherit global/info excludes,
  35 |   // and would hide ignored untracked files even when Shipcheck opts out.
  36 |   let config,configError:unknown;
  37 |   try {config=input===undefined?await loadConfig(root):configSchema.parse(input);}
  38 |   catch(error){configError=error;config=configSchema.parse({});}
  39 |   const policy=createIgnorePolicy(root,config);
  40 |   const indexed=new Set((await git(root,['ls-files','--cached','-z'])).split('\0'));
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   const candidates=tracked.split('\0').filter(Boolean),pending=[''];
  42 |   while(pending.length) {
  43 |     const parent=pending.pop()!;
  44 |     for(const entry of await readdir(join(root,parent),{withFileTypes:true})) {
  45 |       const path=parent?parent+'/'+entry.name:entry.name;
  46 |       if(await policy.reason(path,entry.isDirectory()))continue;
  47 |       if(entry.isDirectory())pending.push(path);
  48 |       else if(!indexed.has(path))candidates.push(path);
  49 |     }
  50 |   }
  51 |   const selected:string[]=[];
  52 |   for(const path of [...new Set(candidates)].sort())if(!await policy.reason(path))selected.push(path);
  53 |   // Retain the no-work shortcut even when an unchanged config is invalid.
  54 |   if(selected.length && configError)throw configError;
  55 |   return selected;
  56 | }
  57 | export async function runWorkflow(target:string, kind:'audit'|'diff'|'task', ai?:AiReviewOptions, options:WorkflowOptions={}): Promise<Report> {
  58 |   if(options.wholeRepository && (kind!=='audit' || !ai)) throw new Error('--whole-repository requires audit with --ai.');
  59 |   if(options.currentTask && kind!=='task')throw new Error('Inline current task requires the task workflow.');
  60 |   const inlineConfig=options.currentTask?await loadConfig(target):undefined;
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
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   const inlineTask=inlineConfig?.currentTask;
  62 |   if(options.currentTask && !inlineTask)throw new Error('No currentTask configured in shipcheck.config.json. Define it or use shipcheck task <task-file>.');
  63 |   const task = inlineTask?{repository:target,files:inlineTask.files,criteria:inlineTask.requirements.map(item=>item.text)}
  64 |     : kind==='task' ? await loadTask(target) : undefined;
  65 |   const taskFile=kind==='task' && !inlineTask?resolve(target):undefined;
  66 |   if (task) target = task.repository;
  67 |   const taskDefinition=inlineTask ?? (task?normalizeLegacyTask({version:1,...task}):undefined);
  68 |   const reloadTask=async()=>{
  69 |     if(taskFile) {
  70 |       const fresh=await loadTask(taskFile);
  71 |       if(resolve(fresh.repository)!==resolve(target))throw new Error('Task repository changed.');
  72 |       return normalizeLegacyTask(fresh);
  73 |     }
  74 |     const fresh=(await loadConfig(target)).currentTask;
  75 |     if(!fresh)throw new Error('Current task is unavailable.');
  76 |     return fresh;
  77 |   };
  78 |   const paths = kind==='diff' ? await changedPaths(target,ai?.config) : task ? [...new Set(task.files)].sort() : undefined;
  79 |   if (kind==='diff' && paths?.length===0) return reportSchema.parse({schemaVersion:1,
  80 |     root:await realpath(await validateRoot(target)),findings:[],inspectionWarnings:[],
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
<a id="l86"></a>
<a id="l87"></a>
<a id="l88"></a>
<a id="l90"></a>
<a id="l91"></a>
<a id="l93"></a>
<a id="l94"></a>
<a id="l95"></a>
<a id="l96"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 |     workflow:{kind:'diff',scope:[],baseline:'HEAD',unavailablePaths:[]}});
  82 |   const unavailablePaths: string[] = [];
  83 |   for (const path of paths ?? []) {
  84 |     let current = target;
  85 |     try {
  86 |       for (const part of path.split('/')) {
  87 |         current = join(current,part);
  88 |         if ((await lstat(current)).isSymbolicLink()) throw new Error('link');
  89 |       }
  90 |       if (!(await lstat(current)).isFile()) throw new Error('not-file');
  91 |     } catch { unavailablePaths.push(path); }
  92 |   }
  93 |   if (task && unavailablePaths.length) throw new Error('Task selects missing, linked, or non-regular files. Correct the task file before review.');
  94 |   const config=inlineConfig ?? (ai?.config===undefined?await loadConfig(target):configSchema.parse(ai.config));
  95 |   const referenceAccess=options.referenceAccess ?? ai?.referenceAccess ?? {};
  96 |   const whole=kind==='audit' && (options.wholeRepository || config.ai.scope==='whole-repository');
  97 |   // Authorized tools can write files. Collect review snapshots only after they finish.
  98 |   const root=await validateRoot(target);
  99 |   const languages=options.runChecks && config.checks.some(check=>check.languages)
 100 |     ? Object.keys((await inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude})).languages):undefined;
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l110"></a>
<a id="l111"></a>
<a id="l112"></a>
<a id="l113"></a>
<a id="l114"></a>
<a id="l116"></a>
<a id="l117"></a>
<a id="l118"></a>
<a id="l119"></a>
<a id="l120"></a>

```text
 101 |   const checks=await runChecks(root,config.checks,options.runChecks===true,config.ai.apiKeyEnv,languages);
 102 |   const references=config.resources.length?(await loadReferenceResources(target,config,paths,referenceAccess)).report:undefined;
 103 |   const report = ai && paths?.length !== 0 && references?.state!=='incomplete' ? whole ? await reviewWholeRepository(target,{...ai,config,referenceAccess})
 104 |     : await reviewWithAi(target,{...ai,config,referenceAccess,...(taskDefinition?{task:taskDefinition,reloadTask}:{}),...(paths ? {paths} : {})}) : await reviewRepository(target,config);
 105 |   if(report.ai?.taskReview && report.ai.taskReview.freshness==='unchanged') {
 106 |     try {if(describeCurrentTask(await reloadTask()).sha256!==report.ai.taskReview.taskHash)invalidateTaskReview(report.ai.taskReview);}
 107 |     catch {invalidateTaskReview(report.ai.taskReview);}
 108 |     if(report.ai.taskReview.state==='changed' && report.ai.coverage)report.ai.coverage.state='partial';
 109 |   }
 110 |   const taskSummary=taskDefinition?describeCurrentTask(taskDefinition):undefined;
 111 |   if(taskSummary) {
 112 |     taskSummary.source=taskFile?'task-file':'configuration';
 113 |     taskSummary.assessment=report.ai?.taskReview?.state ?? 'not-assessed';
 114 |     for(const requirement of taskSummary.requirements)requirement.status=report.ai?.taskReview?.assessments.find(item=>item.requirementId===requirement.id)?.status ?? 'insufficient-evidence';
 115 |   }
 116 |   const selected = new Set(paths);
 117 |   const contracts=await auditContracts(report.root,config,paths,referenceAccess);
 118 |   const sdkContracts=await auditSdkContracts(report.root,config,paths,referenceAccess);
 119 |   const architecture=await auditArchitecture(report.root,config,paths);
 120 |   return reportSchema.parse({...report,
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>

```text
 121 |     ...(taskSummary?{currentTask:taskSummary}:{}),
 122 |     ...(references?{references}:{}),
 123 |     ...(checks.length?{checks}:{}),
 124 |     ...(contracts.length?{contracts}:{}),
 125 |     ...(sdkContracts.length?{sdkContracts}:{}),
 126 |     ...(architecture?{architecture}:{}),
 127 |     findings:paths ? report.findings.filter(f=>f.evidence.some(e=>selected.has(e.path))) : report.findings,
 128 |     workflow:{kind,scope:paths ?? null,baseline:kind==='diff'?'HEAD':null,unavailablePaths,...(task ? {criteria:task.criteria} : {})},
 129 |   });
 130 | }
 131 | 
```
