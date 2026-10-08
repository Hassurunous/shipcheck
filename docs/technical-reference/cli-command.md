# src/cli-command.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

runCli is an argument-state machine followed by workflow composition and exit classification. The argument cursor advances an extra position for value-taking flags. The literal flag makes everything after -- a target token; target rejects a second positional argument. The final exit expression gives operational incompleteness precedence over observed defects. AI candidate severity is not part of the defect-exit expression.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `97c3af935345471d1525885afd30d36d6fafc5d97835582b832a982896f3b712`.

This chapter inventories **14 function bodies/callbacks**, **44 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./index.js</code>: <code>formatStatus</code>.
- <code>./reporters.js</code>: <code>renderConsoleReport</code>, <code>renderJsonReport</code>.
- <code>./ai/contracts.js</code>: <code>modeSchema</code>.
- <code>./ai/trial-budget.js</code>: <code>initializeTrial</code>, <code>trialStatus</code>.
- <code>./ai/audit-budget.js</code>: <code>initializeBudget</code>, <code>budgetStatus</code>, <code>budgetNameSchema</code>, <code>parseAllowanceUsd</code>, <code>settleBudgetAttempt</code>.
- <code>./workflows.js</code>: <code>runWorkflow</code>.
- <code>./markdown-report.js</code>: <code>renderMarkdownReport</code>.
- <code>./reference-access.js</code>: <code>rootIdSchema</code>, <code>referenceOriginSchema</code>.

## Module execution

- [L10](#l10) Bind <code>help</code>: use the literal <code>&#96;Shipcheck v0.1 Usage: shipcheck &lt;command&gt; [target] [options] Commands: audit [target] Audit a repository using shipcheck.config.json (default: .) diff [target] Review changed files versus HEAD, including untracked files task [task-file] Review a task file,…</code>.

## Function index

- [runCli (54:8)](#fn-3015)
- [ok (55:14)](#fn-3098)
- [fail (56:16)](#fn-3184)
- [inline callback (145:62)](#fn-9029)
- [inline callback (149:42)](#fn-9444)
- [inline callback (151:43)](#fn-9586)
- [[...report.architecture.boundaries,...report.architecture.conventions].some callback (153:129)](#fn-9817)
- [inline callback (155:48)](#fn-10047)
- [inline callback (155:107)](#fn-10106)
- [inline callback (156:49)](#fn-10185)
- [item.calls.some callback (156:71)](#fn-10207)
- [inline callback (156:133)](#fn-10269)
- [item.calls.some callback (156:155)](#fn-10291)
- [report.findings.some callback (160:178)](#fn-11231)

<a id="fn-3015"></a>
### runCli (54:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>args: readonly string[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L55](#l55) <code>ok</code>: create [ok (55:14)](#fn-3098); its body runs when called, not when this value is created.
- [L56](#l56) <code>fail</code>: create [fail (56:16)](#fn-3184); its body runs when called, not when this value is created.
- [L57](#l57) <code>command</code>: read <code>args[0]</code>.
- [L60](#l60) <code>name</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>budgetNameSchema.parse(args[2])</code>.
- [L86](#l86) <code>target: string &#124; undefined</code>: leave the value undefined until a later assignment.
- [L87](#l87) <code>json</code>: use the literal <code>false</code>.
- [L88](#l88) <code>markdown</code>: use the literal <code>false</code>.
- [L89](#l89) <code>literal</code>: use the literal <code>false</code>.
- [L90](#l90) <code>wantsHelp</code>: use the literal <code>false</code>.
- [L91](#l91) <code>ai: 'preview' &#124; 'mock' &#124; 'live' &#124; undefined</code>: leave the value undefined until a later assignment.
- [L92](#l92) <code>trial</code>: use the literal <code>false</code>.
- [L93](#l93) <code>budget:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L94](#l94) <code>runChecks</code>: use the literal <code>false</code>.
- [L95](#l95) <code>referenceRoots:Record&lt;string,string&gt;</code>: create a new empty object.
- [L95](#l95) <code>referenceOrigins:string[]</code>: create a new empty array to accumulate ordered results.
- [L96](#l96) <code>wholeRepository</code>: use the literal <code>false</code>.
- [L97](#l97) <code>mode: string &#124; undefined</code>: leave the value undefined until a later assignment.
- [L98](#l98) <code>index</code>: use the literal <code>1</code>.
- [L99](#l99) <code>arg</code>: read <code>args[index]</code>; the TypeScript assertion adds no runtime validation.
- [L106](#l106) <code>value</code>: read <code>args[++index]</code>.
- [L112](#l112) <code>value</code>: use <code>args[++index]</code> unless null/undefined, then evaluate <code>''</code>.
- [L112](#l112) <code>at</code>: call the named operation with the supplied arguments: <code>value.indexOf('=')</code>.
- [L112](#l112) <code>id</code>: select a range without mutating the original array/string: <code>value.slice(0,at)</code>.
- [L112](#l112) <code>path</code>: select a range without mutating the original array/string: <code>value.slice(at+1)</code>.
- [L117](#l117) <code>value</code>: read <code>args[++index]</code>.
- [L122](#l122) <code>value</code>: read <code>args[++index]</code>.
- [L127](#l127) <code>value</code>: read <code>args[++index]</code>.
- [L141](#l141) <code>aiOptions</code>: test <code>ai</code>; choose <code>{execution:ai,trial,...(budget?{budget}:{}),...(mode ? {mode:modeSchema.parse(mode)} : {})}</code> when truthy, otherwise <code>undefined</code>.
- [L142](#l142) <code>report</code>: wait for <code>runWorkflow(target ?? process.cwd(),command,aiOptions,{runChecks,wholeRepository,currentTask:command==='task' &amp;&amp; target===undefined, referenceAccess:{roots:referenceRoots,origins:referenceOrigins}})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L144](#l144) <code>aiFailed</code>: evaluate <code>report.ai?.status === 'failed' &#124;&#124; report.aiAudit?.state==='failed'</code> left to right with truthy short-circuiting.
- [L145](#l145) <code>failedBatchIndex</code>: use <code>report.aiAudit?.batches.findIndex(batch=&gt;batch.status==='failed')</code> unless null/undefined, then evaluate <code>-1</code>.
- [L146](#l146) <code>aiError</code>: use <code>report.ai?.error</code> unless null/undefined, then evaluate <code>failedBatchIndex&gt;=0 ? report.aiAudit?.batches[failedBatchIndex]?.error : undefined</code>.
- [L147](#l147) <code>errorCode</code>: use <code>aiError?.code ?? report.aiAudit?.stoppedReason</code> unless null/undefined, then evaluate <code>'unknown'</code>.
- [L148](#l148) <code>errorDetail</code>: test <code>aiError?.message</code>; choose <code>&#96; ${aiError.message.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g,' ')}&#96;</code> when truthy, otherwise <code>''</code>.
- [L149](#l149) <code>checkError</code>: stop at the first truthy callback result, returning whether any matched: <code>report.checks?.some(check=&gt;check.status==='error')</code>.
- [L150](#l150) <code>referenceError</code>: compute <code>report.references?.state==='incomplete'</code> with the <code>===</code> operator.
- [L151](#l151) <code>checkFailed</code>: stop at the first truthy callback result, returning whether any matched: <code>report.checks?.some(check=&gt;check.status==='failed')</code>.
- [L152](#l152) <code>architectureError</code>: compute <code>report.architecture?.state==='partial'</code> with the <code>===</code> operator.
- [L153](#l153) <code>architectureFailed</code>: evaluate <code>report.architecture &amp;&amp; [...report.architecture.boundaries,...report.architecture.conventions].some(p=&gt;p.status==='violation')</code> left to right with falsy short-circuiting.
- [L154](#l154) <code>architectureWarning</code>: test <code>architectureError</code>; choose <code>'Shipcheck: Architecture assessment is incomplete; inspect unresolved imports and coverage issues. '</code> when truthy, otherwise <code>''</code>.
- [L155](#l155) <code>contractError</code>: evaluate <code>report.contracts?.some(item=&gt;item.state!=='checked') &#124;&#124; report.sdkContracts?.some(item=&gt;item.state!=='checked')</code> left to right with truthy short-circuiting.
- [L156](#l156) <code>contractFailed</code>: evaluate <code>report.contracts?.some(item=&gt;item.calls.some(call=&gt;call.status==='mismatch')) &#124;&#124; report.sdkContracts?.some(item=&gt;item.calls.some(call=&gt;call.status==='mismatch'))</code> left to right with truthy short-circuiting.
- [L157](#l157) <code>contractWarning</code>: test <code>contractError</code>; choose <code>'Shipcheck: Contract comparison is incomplete; inspect contract states, file statuses and unresolved calls. '</code> when truthy, otherwise <code>''</code>.

Execution:

- [L55](#l55) Bind <code>ok</code>: create [ok (55:14)](#fn-3098); its body runs when called, not when this value is created.
- [L56](#l56) Bind <code>fail</code>: create [fail (56:16)](#fn-3184); its body runs when called, not when this value is created.
- [L57](#l57) Bind <code>command</code>: read <code>args[0]</code>.
- [L58](#l58) If <code>command==='budget'</code> is truthy:
  - [L59](#l59) Run the protected block:
    - [L60](#l60) Bind <code>name</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>budgetNameSchema.parse(args[2])</code>.
    - [L61](#l61) If <code>args[1]==='init' &amp;&amp; args.length===5 &amp;&amp; args[3]==='--usd'</code> is truthy:
      - [L61](#l61) wait for <code>initializeBudget(name,parseAllowanceUsd(args[4]!))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L61](#l61) Otherwise:
      - [L62](#l62) If <code>args[1]==='settle' &amp;&amp; args.length===5 &amp;&amp; args[4]==='--charge-reservation'</code> is truthy:
        - [L62](#l62) wait for <code>settleBudgetAttempt(name,args[3]!)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
      - [L62](#l62) Otherwise:
        - [L63](#l63) If <code>args[1]!=='status' &#124;&#124; args.length!==3</code> is truthy:
          - [L63](#l63) Return to the caller: call the named operation with the supplied arguments: <code>fail('Use budget init &lt;name&gt; --usd &lt;amount&gt;, budget status &lt;name&gt;, or budget settle &lt;name&gt; &lt;attempt&gt; --charge-reservation.')</code>.
    - [L64](#l64) Return to the caller: call the named operation with the supplied arguments: <code>ok(JSON.stringify(await budgetStatus(name),null,2))</code>.
  - [L59](#l59) If it throws, bind <code>error</code>:
    - [L65](#l65) Return to the caller: call the named operation with the supplied arguments: <code>fail(error instanceof Error?error.message:'Budget operation failed.')</code>.
- [L67](#l67) If <code>command === 'trial'</code> is truthy:
  - [L68](#l68) If <code>args.length !== 2 &#124;&#124; !['init','status'].includes(args[1]!)</code> is truthy:
    - [L68](#l68) Return to the caller: call the named operation with the supplied arguments: <code>fail('Use trial init or trial status.')</code>.
  - [L69](#l69) Run the protected block:
    - [L70](#l70) If <code>args[1] === 'init'</code> is truthy:
      - [L70](#l70) wait for <code>initializeTrial()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L71](#l71) Return to the caller: call the named operation with the supplied arguments: <code>ok(JSON.stringify(await trialStatus(),null,2))</code>.
  - [L69](#l69) If it throws, bind <code>error</code>:
    - [L72](#l72) Return to the caller: call the named operation with the supplied arguments: <code>fail(error instanceof Error ? error.message : 'Trial state failed.')</code>.
- [L74](#l74) If <code>command === 'help'</code> is truthy:
  - [L75](#l75) If <code>args.length &gt; 2 &#124;&#124; (args[1] &amp;&amp; !['audit', 'diff', 'task', 'help', 'trial', 'budget'].includes(args[1]))</code> is truthy:
    - [L75](#l75) Return to the caller: call the named operation with the supplied arguments: <code>fail('Unknown help topic.')</code>.
  - [L76](#l76) Return to the caller: call the named operation with the supplied arguments: <code>ok(help)</code>.
- [L78](#l78) If <code>command === '--help' &#124;&#124; command === '-h'</code> is truthy:
  - [L78](#l78) Return to the caller: test <code>args.length === 1</code>; choose <code>ok(help)</code> when truthy, otherwise <code>fail('Unexpected arguments after help.')</code>.
- [L79](#l79) If <code>command === '--version' &#124;&#124; command === '-v'</code> is truthy:
  - [L79](#l79) Return to the caller: test <code>args.length === 1</code>; choose <code>ok('Shipcheck v0.1')</code> when truthy, otherwise <code>fail('Unexpected arguments after version.')</code>.
- [L80](#l80) If <code>command === 'review'</code> is truthy:
  - [L80](#l80) Return to the caller: call the named operation with the supplied arguments: <code>fail('The review command has been removed. Use shipcheck audit instead.')</code>.
- [L81](#l81) If <code>command !== 'audit' &amp;&amp; command !== 'diff' &amp;&amp; command !== 'task'</code> is truthy:
  - [L82](#l82) If <code>command === undefined</code> is truthy:
    - [L82](#l82) Return to the caller: call the named operation with the supplied arguments: <code>ok(formatStatus())</code>.
  - [L83](#l83) If <code>args.length === 1 &amp;&amp; (command === '.' &#124;&#124; command === '..' &#124;&#124; /[\\/]/.test(command))</code> is truthy:
    - [L83](#l83) Return to the caller: call the named operation with the supplied arguments: <code>ok(formatStatus(args))</code>.
  - [L84](#l84) Return to the caller: call the named operation with the supplied arguments: <code>fail(&#96;Unknown command ${JSON.stringify(command)}.&#96;)</code>.
- [L86](#l86) Bind <code>target: string &#124; undefined</code>: leave the value undefined until a later assignment.
- [L87](#l87) Bind <code>json</code>: use the literal <code>false</code>.
- [L88](#l88) Bind <code>markdown</code>: use the literal <code>false</code>.
- [L89](#l89) Bind <code>literal</code>: use the literal <code>false</code>.
- [L90](#l90) Bind <code>wantsHelp</code>: use the literal <code>false</code>.
- [L91](#l91) Bind <code>ai: 'preview' &#124; 'mock' &#124; 'live' &#124; undefined</code>: leave the value undefined until a later assignment.
- [L92](#l92) Bind <code>trial</code>: use the literal <code>false</code>.
- [L93](#l93) Bind <code>budget:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L94](#l94) Bind <code>runChecks</code>: use the literal <code>false</code>.
- [L95](#l95) Bind <code>referenceRoots:Record&lt;string,string&gt;</code>: create a new empty object.
- [L95](#l95) Bind <code>referenceOrigins:string[]</code>: create a new empty array to accumulate ordered results.
- [L96](#l96) Bind <code>wholeRepository</code>: use the literal <code>false</code>.
- [L97](#l97) Bind <code>mode: string &#124; undefined</code>: leave the value undefined until a later assignment.
- [L98](#l98) Initialize <code>let index = 1</code>; repeat while <code>index &lt; args.length</code>; after each normal iteration evaluate <code>index++</code>:
  - [L99](#l99) Bind <code>arg</code>: read <code>args[index]</code>; the TypeScript assertion adds no runtime validation.
  - [L100](#l100) If <code>!literal &amp;&amp; arg === '--'</code> is truthy:
    - [L100](#l100) update <code>literal</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L100](#l100) Skip the rest of this iteration and advance the enclosing loop.
  - [L101](#l101) If <code>!literal &amp;&amp; (arg === '--help' &#124;&#124; arg === '-h')</code> is truthy:
    - [L101](#l101) update <code>wantsHelp</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L101](#l101) Skip the rest of this iteration and advance the enclosing loop.
  - [L102](#l102) If <code>!literal &amp;&amp; arg === '--json'</code> is truthy:
    - [L102](#l102) update <code>json</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L102](#l102) Skip the rest of this iteration and advance the enclosing loop.
  - [L103](#l103) If <code>!literal &amp;&amp; arg === '--markdown'</code> is truthy:
    - [L103](#l103) update <code>markdown</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L103](#l103) Skip the rest of this iteration and advance the enclosing loop.
  - [L104](#l104) If <code>!literal &amp;&amp; arg === '--trial'</code> is truthy:
    - [L104](#l104) update <code>trial</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L104](#l104) Skip the rest of this iteration and advance the enclosing loop.
  - [L105](#l105) If <code>!literal &amp;&amp; arg === '--budget'</code> is truthy:
    - [L106](#l106) Bind <code>value</code>: read <code>args[++index]</code>.
    - [L107](#l107) If <code>!budgetNameSchema.safeParse(value).success</code> is truthy:
      - [L107](#l107) Return to the caller: call the named operation with the supplied arguments: <code>fail('Budget name must be a lowercase letter followed by lowercase letters, digits or hyphens (up to 48 characters).')</code>.
    - [L108](#l108) update <code>budget</code> with <code>value</code> using <code>=</code>; this mutation is visible to later statements.
    - [L108](#l108) Skip the rest of this iteration and advance the enclosing loop.
  - [L110](#l110) If <code>!literal &amp;&amp; arg === '--run-checks'</code> is truthy:
    - [L110](#l110) update <code>runChecks</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L110](#l110) Skip the rest of this iteration and advance the enclosing loop.
  - [L111](#l111) If <code>!literal &amp;&amp; arg==='--reference-root'</code> is truthy:
    - [L112](#l112) Bind <code>value</code>: use <code>args[++index]</code> unless null/undefined, then evaluate <code>''</code>.
    - [L112](#l112) Bind <code>at</code>: call the named operation with the supplied arguments: <code>value.indexOf('=')</code>.
    - [L112](#l112) Bind <code>id</code>: select a range without mutating the original array/string: <code>value.slice(0,at)</code>.
    - [L112](#l112) Bind <code>path</code>: select a range without mutating the original array/string: <code>value.slice(at+1)</code>.
    - [L113](#l113) If <code>at&lt;1 &#124;&#124; !rootIdSchema.safeParse(id).success &#124;&#124; !path &#124;&#124; Object.hasOwn(referenceRoots,id) &#124;&#124; Object.keys(referenceRoots).length&gt;=16</code> is truthy:
      - [L113](#l113) Return to the caller: call the named operation with the supplied arguments: <code>fail('Use distinct --reference-root id=path grants (maximum 16).')</code>.
    - [L114](#l114) update <code>referenceRoots[id]</code> with <code>path</code> using <code>=</code>; this mutation is visible to later statements.
    - [L114](#l114) Skip the rest of this iteration and advance the enclosing loop.
  - [L116](#l116) If <code>!literal &amp;&amp; arg==='--allow-reference-origin'</code> is truthy:
    - [L117](#l117) Bind <code>value</code>: read <code>args[++index]</code>.
    - [L117](#l117) If <code>!referenceOriginSchema.safeParse(value).success &#124;&#124; referenceOrigins.length&gt;=16</code> is truthy:
      - [L117](#l117) Return to the caller: call the named operation with the supplied arguments: <code>fail('Use --allow-reference-origin https://host with an exact origin (maximum 16).')</code>.
    - [L118](#l118) append values to the existing array: <code>referenceOrigins.push(value!)</code>.
    - [L118](#l118) Skip the rest of this iteration and advance the enclosing loop.
  - [L120](#l120) If <code>!literal &amp;&amp; arg === '--whole-repository'</code> is truthy:
    - [L120](#l120) update <code>wholeRepository</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
    - [L120](#l120) Skip the rest of this iteration and advance the enclosing loop.
  - [L121](#l121) If <code>!literal &amp;&amp; arg === '--ai'</code> is truthy:
    - [L122](#l122) Bind <code>value</code>: read <code>args[++index]</code>.
    - [L123](#l123) If <code>value !== 'preview' &amp;&amp; value !== 'mock' &amp;&amp; value !== 'live'</code> is truthy:
      - [L123](#l123) Return to the caller: call the named operation with the supplied arguments: <code>fail('Use --ai preview, --ai mock, or --ai live with --budget/--trial.')</code>.
    - [L124](#l124) update <code>ai</code> with <code>value</code> using <code>=</code>; this mutation is visible to later statements.
    - [L124](#l124) Skip the rest of this iteration and advance the enclosing loop.
  - [L126](#l126) If <code>!literal &amp;&amp; arg === '--mode'</code> is truthy:
    - [L127](#l127) Bind <code>value</code>: read <code>args[++index]</code>.
    - [L128](#l128) If <code>!modeSchema.safeParse(value).success</code> is truthy:
      - [L128](#l128) Return to the caller: call the named operation with the supplied arguments: <code>fail('Mode must be low-cost, balanced, or high-quality.')</code>.
    - [L129](#l129) update <code>mode</code> with <code>value</code> using <code>=</code>; this mutation is visible to later statements.
    - [L129](#l129) Skip the rest of this iteration and advance the enclosing loop.
  - [L131](#l131) If <code>!literal &amp;&amp; arg.startsWith('-')</code> is truthy:
    - [L131](#l131) Return to the caller: call the named operation with the supplied arguments: <code>fail(&#96;Unknown option ${JSON.stringify(arg)}.&#96;)</code>.
  - [L132](#l132) If <code>target !== undefined</code> is truthy:
    - [L132](#l132) Return to the caller: call the named operation with the supplied arguments: <code>fail('Expected at most one target directory.')</code>.
  - [L133](#l133) update <code>target</code> with <code>arg</code> using <code>=</code>; this mutation is visible to later statements.
- [L135](#l135) If <code>wantsHelp</code> is truthy:
  - [L135](#l135) Return to the caller: call the named operation with the supplied arguments: <code>ok(help)</code>.
- [L136](#l136) If <code>json &amp;&amp; markdown</code> is truthy:
  - [L136](#l136) Return to the caller: call the named operation with the supplied arguments: <code>fail('Choose --json or --markdown, not both.')</code>.
- [L137](#l137) If <code>mode &amp;&amp; !ai</code> is truthy:
  - [L137](#l137) Return to the caller: call the named operation with the supplied arguments: <code>fail('--mode requires --ai.')</code>.
- [L138](#l138) If <code>trial &amp;&amp; budget</code> is truthy:
  - [L138](#l138) Return to the caller: call the named operation with the supplied arguments: <code>fail('Choose --trial or --budget, not both.')</code>.
- [L139](#l139) If <code>(ai === 'live') !== Boolean(trial &#124;&#124; budget)</code> is truthy:
  - [L139](#l139) Return to the caller: call the named operation with the supplied arguments: <code>fail('Live AI requires --trial or --budget; spending authorization is only valid with --ai live.')</code>.
- [L140](#l140) Run the protected block:
  - [L141](#l141) Bind <code>aiOptions</code>: test <code>ai</code>; choose <code>{execution:ai,trial,...(budget?{budget}:{}),...(mode ? {mode:modeSchema.parse(mode)} : {})}</code> when truthy, otherwise <code>undefined</code>.
  - [L142](#l142) Bind <code>report</code>: wait for <code>runWorkflow(target ?? process.cwd(),command,aiOptions,{runChecks,wholeRepository,currentTask:command==='task' &amp;&amp; target===undefined, referenceAccess:{roots:referenceRoots,origins:referenceOrigins}})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L144](#l144) Bind <code>aiFailed</code>: evaluate <code>report.ai?.status === 'failed' &#124;&#124; report.aiAudit?.state==='failed'</code> left to right with truthy short-circuiting.
  - [L145](#l145) Bind <code>failedBatchIndex</code>: use <code>report.aiAudit?.batches.findIndex(batch=&gt;batch.status==='failed')</code> unless null/undefined, then evaluate <code>-1</code>.
  - [L146](#l146) Bind <code>aiError</code>: use <code>report.ai?.error</code> unless null/undefined, then evaluate <code>failedBatchIndex&gt;=0 ? report.aiAudit?.batches[failedBatchIndex]?.error : undefined</code>.
  - [L147](#l147) Bind <code>errorCode</code>: use <code>aiError?.code ?? report.aiAudit?.stoppedReason</code> unless null/undefined, then evaluate <code>'unknown'</code>.
  - [L148](#l148) Bind <code>errorDetail</code>: test <code>aiError?.message</code>; choose <code>&#96; ${aiError.message.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g,' ')}&#96;</code> when truthy, otherwise <code>''</code>.
  - [L149](#l149) Bind <code>checkError</code>: stop at the first truthy callback result, returning whether any matched: <code>report.checks?.some(check=&gt;check.status==='error')</code>.
  - [L150](#l150) Bind <code>referenceError</code>: compute <code>report.references?.state==='incomplete'</code> with the <code>===</code> operator.
  - [L151](#l151) Bind <code>checkFailed</code>: stop at the first truthy callback result, returning whether any matched: <code>report.checks?.some(check=&gt;check.status==='failed')</code>.
  - [L152](#l152) Bind <code>architectureError</code>: compute <code>report.architecture?.state==='partial'</code> with the <code>===</code> operator.
  - [L153](#l153) Bind <code>architectureFailed</code>: evaluate <code>report.architecture &amp;&amp; [...report.architecture.boundaries,...report.architecture.conventions].some(p=&gt;p.status==='violation')</code> left to right with falsy short-circuiting.
  - [L154](#l154) Bind <code>architectureWarning</code>: test <code>architectureError</code>; choose <code>'Shipcheck: Architecture assessment is incomplete; inspect unresolved imports and coverage issues. '</code> when truthy, otherwise <code>''</code>.
  - [L155](#l155) Bind <code>contractError</code>: evaluate <code>report.contracts?.some(item=&gt;item.state!=='checked') &#124;&#124; report.sdkContracts?.some(item=&gt;item.state!=='checked')</code> left to right with truthy short-circuiting.
  - [L156](#l156) Bind <code>contractFailed</code>: evaluate <code>report.contracts?.some(item=&gt;item.calls.some(call=&gt;call.status==='mismatch')) &#124;&#124; report.sdkContracts?.some(item=&gt;item.calls.some(call=&gt;call.status==='mismatch'))</code> left to right with truthy short-circuiting.
  - [L157](#l157) Bind <code>contractWarning</code>: test <code>contractError</code>; choose <code>'Shipcheck: Contract comparison is incomplete; inspect contract states, file statuses and unresolved calls. '</code> when truthy, otherwise <code>''</code>.
  - [L158](#l158) Return to the caller: create an object with 3 property/spread entries: <code>{ stdout: json ? renderJsonReport(report) : markdown ? renderMarkdownReport(report) : renderConsoleReport(report), stderr: architectureWarning+contractWarning+(aiFailed ? &#96;Shipcheck: AI stage failed (${errorCode})${failedBatchIndex&gt;=0 ? &#96; in batch ${failedB…</code>; later properties overwrite earlier spread values.
- [L140](#l140) If it throws, bind <code>error</code>:
  - [L162](#l162) Return to the caller: call the named operation with the supplied arguments: <code>fail(error instanceof Error ? error.message : String(error))</code>.

<a id="fn-3098"></a>
### ok (55:14)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>stdout: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L55](#l55) Implicitly return: create an object with 3 property/spread entries: <code>{ stdout, stderr: '', exitCode: 0 }</code>; later properties overwrite earlier spread values.

<a id="fn-3184"></a>
### fail (56:16)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>message: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L56](#l56) Implicitly return: create an object with 3 property/spread entries: <code>{ stdout: '', stderr: &#96;Shipcheck: ${message}\nRun shipcheck help for usage.&#96;, exitCode: 2 }</code>; later properties overwrite earlier spread values.

<a id="fn-9029"></a>
### inline callback (145:62)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>batch</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L145](#l145) Implicitly return: compute <code>batch.status==='failed'</code> with the <code>===</code> operator.

<a id="fn-9444"></a>
### inline callback (149:42)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L149](#l149) Implicitly return: compute <code>check.status==='error'</code> with the <code>===</code> operator.

<a id="fn-9586"></a>
### inline callback (151:43)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L151](#l151) Implicitly return: compute <code>check.status==='failed'</code> with the <code>===</code> operator.

<a id="fn-9817"></a>
### [...report.architecture.boundaries,...report.architecture.conventions].some callback (153:129)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). Passed to <code>[...report.architecture.boundaries,...report.architecture.conventions].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L153](#l153) Implicitly return: compute <code>p.status==='violation'</code> with the <code>===</code> operator.

<a id="fn-10047"></a>
### inline callback (155:48)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L155](#l155) Implicitly return: compute <code>item.state!=='checked'</code> with the <code>!==</code> operator.

<a id="fn-10106"></a>
### inline callback (155:107)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L155](#l155) Implicitly return: compute <code>item.state!=='checked'</code> with the <code>!==</code> operator.

<a id="fn-10185"></a>
### inline callback (156:49)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L156](#l156) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>item.calls.some(call=&gt;call.status==='mismatch')</code>.

<a id="fn-10207"></a>
### item.calls.some callback (156:71)

Synchronous function. Lexically inside [inline callback (156:49)](#fn-10185). Passed to <code>item.calls.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>call</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L156](#l156) Implicitly return: compute <code>call.status==='mismatch'</code> with the <code>===</code> operator.

<a id="fn-10269"></a>
### inline callback (156:133)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). 

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L156](#l156) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>item.calls.some(call=&gt;call.status==='mismatch')</code>.

<a id="fn-10291"></a>
### item.calls.some callback (156:155)

Synchronous function. Lexically inside [inline callback (156:133)](#fn-10269). Passed to <code>item.calls.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>call</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L156](#l156) Implicitly return: compute <code>call.status==='mismatch'</code> with the <code>===</code> operator.

<a id="fn-11231"></a>
### report.findings.some callback (160:178)

Synchronous function. Lexically inside [runCli (54:8)](#fn-3015). Passed to <code>report.findings.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L160](#l160) Implicitly return: compute <code>f.severity === 'error'</code> with the <code>===</code> operator.

## Compile-time data contracts

### CliResult

```typescript
type CliResult = { stdout: string; stderr: string; exitCode: number };
```

Declared at [L52](#l52). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L10](#l10) <code>help</code>: use the literal <code>&#96;Shipcheck v0.1 Usage: shipcheck &lt;command&gt; [target] [options] Commands: audit [target] Audit a repository using shipcheck.config.json (default: .) diff [target] Review changed files versus HEAD, including untracked files task [task-file] Review a task file,…</code>.

## Directly importing tests

- [additional-http-clients.test.ts](../../test/additional-http-clients.test.ts)
- [ai.test.ts](../../test/ai.test.ts)
- [architecture-audit.test.ts](../../test/architecture-audit.test.ts)
- [audit-budget.test.ts](../../test/audit-budget.test.ts)
- [check-diagnostics.test.ts](../../test/check-diagnostics.test.ts)
- [cli-command.test.ts](../../test/cli-command.test.ts)
- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)
- [contract-audit.test.ts](../../test/contract-audit.test.ts)
- [current-task.test.ts](../../test/current-task.test.ts)
- [external-references.test.ts](../../test/external-references.test.ts)
- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
- [live-ai.test.ts](../../test/live-ai.test.ts)
- [markdown.test.ts](../../test/markdown.test.ts)
- [p7.test.ts](../../test/p7.test.ts)
- [reference-resources.test.ts](../../test/reference-resources.test.ts)
- [sdk-audit.test.ts](../../test/sdk-audit.test.ts)
- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)
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
<a id="l10"></a>

```text
   1 | import { formatStatus } from './index.js';
   2 | import { renderConsoleReport, renderJsonReport } from './reporters.js';
   3 | import { modeSchema } from './ai/contracts.js';
   4 | import { initializeTrial, trialStatus } from './ai/trial-budget.js';
   5 | import { initializeBudget, budgetStatus, budgetNameSchema, parseAllowanceUsd, settleBudgetAttempt } from './ai/audit-budget.js';
   6 | import { runWorkflow } from './workflows.js';
   7 | import { renderMarkdownReport } from './markdown-report.js';
   8 | import {rootIdSchema,referenceOriginSchema} from './reference-access.js';
   9 | 
  10 | const help = `Shipcheck v0.1
  11 | 
  12 | Usage: shipcheck <command> [target] [options]
  13 | 
  14 | Commands:
  15 |   audit [target]    Audit a repository using shipcheck.config.json (default: .)
  16 |   diff [target]     Review changed files versus HEAD, including untracked files
  17 |   task [task-file]  Review a task file, or currentTask in the current directory config
  18 |   trial init       Initialize the one-time $0.50 / three-mode trial (never resets)
  19 |   trial status     Show persistent trial reservations and usage
  20 |   budget init <name> --usd <amount> Create a persistent allowance (never resets)
```


```text
  21 |   budget status <name> Show remaining reservations and recorded usage
  22 |   budget settle <name> <attempt> --charge-reservation Resolve a failure without refunding its reservation
  23 |   help [command]   Show help for audit, diff, task, trial, or budget
  24 |   --version        Show the version
  25 | 
  26 | Audit, diff, and task options:
  27 |   --json           Print the report as JSON
  28 |   --markdown       Print a Markdown report (exclusive with --json)
  29 |   --run-checks     Execute trusted configured checks (whole repository)
  30 |   --reference-root <id=path> Authorize one external resource root (repeatable)
  31 |   --allow-reference-origin <https://host> Authorize pinned HTTPS references (repeatable)
  32 |   --whole-repository Batch all eligible source for audit --ai preview/mock/live
  33 |   --ai preview     Preview bounded AI input metadata without contacting a model
  34 |   --ai mock        Exercise the QA reviewer with a synthetic offline response
  35 |   --ai live --trial Run one approved trial attempt for the selected mode
  36 |   --ai live --budget <name> Use an existing allowance for live auditing
  37 |   --mode <mode>    low-cost (default), balanced, or high-quality
  38 |   -h, --help       Show help
  39 |   --               Treat remaining arguments as a target path
  40 | 
```

<a id="l52"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 | Local shortcuts:
  42 |   npm run audit -- .
  43 |   npm run audit -- . --json
  44 |   npm run shipcheck -- help
  45 | 
  46 | Exit codes: 0 completed, 1 error-level findings/check failures/contract mismatches/architecture violations,
  47 | 2 usage/configuration/inspection failure or incomplete contract/architecture assessment.
  48 | Warnings alone do not change the exit code. Live AI requires --trial or --budget and initialized allowance.
  49 | Mock candidates are synthetic and unverified, not diagnosed defects.
  50 | Running with no arguments or an explicit path (such as . or ./repo) retains the readiness smoke test.`;
  51 | 
  52 | export type CliResult = { stdout: string; stderr: string; exitCode: number };
  53 | 
  54 | export async function runCli(args: readonly string[]): Promise<CliResult> {
  55 |   const ok = (stdout: string): CliResult => ({ stdout, stderr: '', exitCode: 0 });
  56 |   const fail = (message: string): CliResult => ({ stdout: '', stderr: `Shipcheck: ${message}\nRun shipcheck help for usage.`, exitCode: 2 });
  57 |   const command = args[0];
  58 |   if(command==='budget') {
  59 |     try {
  60 |       const name=budgetNameSchema.parse(args[2]);
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
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |       if(args[1]==='init' && args.length===5 && args[3]==='--usd')await initializeBudget(name,parseAllowanceUsd(args[4]!));
  62 |       else if(args[1]==='settle' && args.length===5 && args[4]==='--charge-reservation')await settleBudgetAttempt(name,args[3]!);
  63 |       else if(args[1]!=='status' || args.length!==3)return fail('Use budget init <name> --usd <amount>, budget status <name>, or budget settle <name> <attempt> --charge-reservation.');
  64 |       return ok(JSON.stringify(await budgetStatus(name),null,2));
  65 |     } catch(error) {return fail(error instanceof Error?error.message:'Budget operation failed.');}
  66 |   }
  67 |   if (command === 'trial') {
  68 |     if (args.length !== 2 || !['init','status'].includes(args[1]!)) return fail('Use trial init or trial status.');
  69 |     try {
  70 |       if (args[1] === 'init') await initializeTrial();
  71 |       return ok(JSON.stringify(await trialStatus(),null,2));
  72 |     } catch (error) { return fail(error instanceof Error ? error.message : 'Trial state failed.'); }
  73 |   }
  74 |   if (command === 'help') {
  75 |     if (args.length > 2 || (args[1] && !['audit', 'diff', 'task', 'help', 'trial', 'budget'].includes(args[1]))) return fail('Unknown help topic.');
  76 |     return ok(help);
  77 |   }
  78 |   if (command === '--help' || command === '-h') return args.length === 1 ? ok(help) : fail('Unexpected arguments after help.');
  79 |   if (command === '--version' || command === '-v') return args.length === 1 ? ok('Shipcheck v0.1') : fail('Unexpected arguments after version.');
  80 |   if (command === 'review') return fail('The review command has been removed. Use shipcheck audit instead.');
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
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
  81 |   if (command !== 'audit' && command !== 'diff' && command !== 'task') {
  82 |     if (command === undefined) return ok(formatStatus());
  83 |     if (args.length === 1 && (command === '.' || command === '..' || /[\\/]/.test(command))) return ok(formatStatus(args));
  84 |     return fail(`Unknown command ${JSON.stringify(command)}.`);
  85 |   }
  86 |   let target: string | undefined;
  87 |   let json = false;
  88 |   let markdown = false;
  89 |   let literal = false;
  90 |   let wantsHelp = false;
  91 |   let ai: 'preview' | 'mock' | 'live' | undefined;
  92 |   let trial = false;
  93 |   let budget:string|undefined;
  94 |   let runChecks = false;
  95 |   const referenceRoots:Record<string,string>={};const referenceOrigins:string[]=[];
  96 |   let wholeRepository = false;
  97 |   let mode: string | undefined;
  98 |   for (let index = 1; index < args.length; index++) {
  99 |     const arg = args[index]!;
 100 |     if (!literal && arg === '--') { literal = true; continue; }
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
<a id="l120"></a>

```text
 101 |     if (!literal && (arg === '--help' || arg === '-h')) { wantsHelp = true; continue; }
 102 |     if (!literal && arg === '--json') { json = true; continue; }
 103 |     if (!literal && arg === '--markdown') { markdown = true; continue; }
 104 |     if (!literal && arg === '--trial') { trial = true; continue; }
 105 |     if (!literal && arg === '--budget') {
 106 |       const value=args[++index];
 107 |       if(!budgetNameSchema.safeParse(value).success)return fail('Budget name must be a lowercase letter followed by lowercase letters, digits or hyphens (up to 48 characters).');
 108 |       budget=value;continue;
 109 |     }
 110 |     if (!literal && arg === '--run-checks') { runChecks = true; continue; }
 111 |     if(!literal && arg==='--reference-root') {
 112 |       const value=args[++index] ?? '',at=value.indexOf('='),id=value.slice(0,at),path=value.slice(at+1);
 113 |       if(at<1 || !rootIdSchema.safeParse(id).success || !path || Object.hasOwn(referenceRoots,id) || Object.keys(referenceRoots).length>=16)return fail('Use distinct --reference-root id=path grants (maximum 16).');
 114 |       referenceRoots[id]=path;continue;
 115 |     }
 116 |     if(!literal && arg==='--allow-reference-origin') {
 117 |       const value=args[++index];if(!referenceOriginSchema.safeParse(value).success || referenceOrigins.length>=16)return fail('Use --allow-reference-origin https://host with an exact origin (maximum 16).');
 118 |       referenceOrigins.push(value!);continue;
 119 |     }
 120 |     if (!literal && arg === '--whole-repository') { wholeRepository = true; continue; }
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>
<a id="l129"></a>
<a id="l131"></a>
<a id="l132"></a>
<a id="l133"></a>
<a id="l135"></a>
<a id="l136"></a>
<a id="l137"></a>
<a id="l138"></a>
<a id="l139"></a>
<a id="l140"></a>

```text
 121 |     if (!literal && arg === '--ai') {
 122 |       const value = args[++index];
 123 |       if (value !== 'preview' && value !== 'mock' && value !== 'live') return fail('Use --ai preview, --ai mock, or --ai live with --budget/--trial.');
 124 |       ai = value; continue;
 125 |     }
 126 |     if (!literal && arg === '--mode') {
 127 |       const value = args[++index];
 128 |       if (!modeSchema.safeParse(value).success) return fail('Mode must be low-cost, balanced, or high-quality.');
 129 |       mode = value; continue;
 130 |     }
 131 |     if (!literal && arg.startsWith('-')) return fail(`Unknown option ${JSON.stringify(arg)}.`);
 132 |     if (target !== undefined) return fail('Expected at most one target directory.');
 133 |     target = arg;
 134 |   }
 135 |   if (wantsHelp) return ok(help);
 136 |   if (json && markdown) return fail('Choose --json or --markdown, not both.');
 137 |   if (mode && !ai) return fail('--mode requires --ai.');
 138 |   if (trial && budget) return fail('Choose --trial or --budget, not both.');
 139 |   if ((ai === 'live') !== Boolean(trial || budget)) return fail('Live AI requires --trial or --budget; spending authorization is only valid with --ai live.');
 140 |   try {
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
<a id="l150"></a>
<a id="l151"></a>
<a id="l152"></a>
<a id="l153"></a>
<a id="l154"></a>
<a id="l155"></a>
<a id="l156"></a>
<a id="l157"></a>
<a id="l158"></a>
<a id="l159"></a>
<a id="l160"></a>

```text
 141 |     const aiOptions = ai ? {execution:ai,trial,...(budget?{budget}:{}),...(mode ? {mode:modeSchema.parse(mode)} : {})} : undefined;
 142 |     const report = await runWorkflow(target ?? process.cwd(),command,aiOptions,{runChecks,wholeRepository,currentTask:command==='task' && target===undefined,
 143 |       referenceAccess:{roots:referenceRoots,origins:referenceOrigins}});
 144 |     const aiFailed = report.ai?.status === 'failed' || report.aiAudit?.state==='failed';
 145 |     const failedBatchIndex=report.aiAudit?.batches.findIndex(batch=>batch.status==='failed') ?? -1;
 146 |     const aiError=report.ai?.error ?? (failedBatchIndex>=0 ? report.aiAudit?.batches[failedBatchIndex]?.error : undefined);
 147 |     const errorCode=aiError?.code ?? report.aiAudit?.stoppedReason ?? 'unknown';
 148 |     const errorDetail=aiError?.message ? ` ${aiError.message.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g,' ')}` : '';
 149 |     const checkError=report.checks?.some(check=>check.status==='error');
 150 |     const referenceError=report.references?.state==='incomplete';
 151 |     const checkFailed=report.checks?.some(check=>check.status==='failed');
 152 |     const architectureError=report.architecture?.state==='partial';
 153 |     const architectureFailed=report.architecture && [...report.architecture.boundaries,...report.architecture.conventions].some(p=>p.status==='violation');
 154 |     const architectureWarning=architectureError?'Shipcheck: Architecture assessment is incomplete; inspect unresolved imports and coverage issues. ':'';
 155 |     const contractError=report.contracts?.some(item=>item.state!=='checked') || report.sdkContracts?.some(item=>item.state!=='checked');
 156 |     const contractFailed=report.contracts?.some(item=>item.calls.some(call=>call.status==='mismatch')) || report.sdkContracts?.some(item=>item.calls.some(call=>call.status==='mismatch'));
 157 |     const contractWarning=contractError?'Shipcheck: Contract comparison is incomplete; inspect contract states, file statuses and unresolved calls. ':'';
 158 |     return { stdout: json ? renderJsonReport(report) : markdown ? renderMarkdownReport(report) : renderConsoleReport(report),
 159 |       stderr: architectureWarning+contractWarning+(aiFailed ? `Shipcheck: AI stage failed (${errorCode})${failedBatchIndex>=0 ? ` in batch ${failedBatchIndex+1}` : ''}.${errorDetail} Deterministic results are retained.` : referenceError ? 'Shipcheck: Required reference resources could not be loaded; AI was not run. See reference statuses in the report.' : checkError ? 'Shipcheck: A configured check could not complete; see the report.' : ''),
 160 |       exitCode: aiFailed || checkError || referenceError || contractError || architectureError ? 2 : checkFailed || contractFailed || architectureFailed || report.findings.some(f => f.severity === 'error') ? 1 : 0 };
```

<a id="l161"></a>
<a id="l162"></a>

```text
 161 |   } catch (error) {
 162 |     return fail(error instanceof Error ? error.message : String(error));
 163 |   }
 164 | }
 165 | 
```
