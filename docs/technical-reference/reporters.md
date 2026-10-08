# src/reporters.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Rendering validates the report and appends strings into an ordered lines array. text escapes terminal controls in repository/model-supplied strings, preserving one-line console entries. Optional stages are formatted only when present; whole-repository batches reuse the same renderer recursively. JSON rendering retains the validated structured contract rather than the console's escaped presentation.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `137c6bd387d920896caced859a4dcdaadb437315835d896876af196a6fc9d25d`.

This chapter inventories **6 function bodies/callbacks**, **50 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./findings.js</code>: <code>reportSchema</code>, <code>Report</code> (type only).

## Module execution

- [L4](#l4) Bind <code>text</code>: create [text (4:14)](#fn-161); its body runs when called, not when this value is created.

## Function index

- [text (4:14)](#fn-161)
- [value .replace callback (5:57)](#fn-251)
- [renderConsoleReport (12:8)](#fn-462)
- [inline callback (111:38)](#fn-9591)
- [audit.batches.forEach callback (121:27)](#fn-10728)
- [renderJsonReport (187:8)](#fn-17162)

<a id="fn-161"></a>
### text (4:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>value: string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L4](#l4) Implicitly return: produce a string with matching text replaced: <code>value .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, char =&gt; { if (char === "\n") return "\\n"; if (char === "\r") return "\\r"; if (char === "\t") return "\\t"; return &#96;\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}&#96;; })</code>.

<a id="fn-251"></a>
### value .replace callback (5:57)

Synchronous function. Lexically inside [text (4:14)](#fn-161). Passed to <code>value .replace</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>char</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L6](#l6) If <code>char === "\n"</code> is truthy:
  - [L6](#l6) Return to the caller: use the literal <code>"\\n"</code>.
- [L7](#l7) If <code>char === "\r"</code> is truthy:
  - [L7](#l7) Return to the caller: use the literal <code>"\\r"</code>.
- [L8](#l8) If <code>char === "\t"</code> is truthy:
  - [L8](#l8) Return to the caller: use the literal <code>"\\t"</code>.
- [L9](#l9) Return to the caller: use the literal <code>&#96;\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}&#96;</code>.

<a id="fn-462"></a>
### renderConsoleReport (12:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input: Report</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L13](#l13) <code>report</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse(input)</code>.
- [L14](#l14) <code>lines</code>: create an array from <code>["Shipcheck — deterministic review", &#96;Target: ${text(report.root)}&#96;, "", &#96;Findings: ${report.findings.length}&#96;, &#96;Inspection warnings: ${report.inspectionWarnings.length}&#96;]</code>; spread elements insert the iterable values.
- [L17](#l17) <code>policy</code>: read <code>report.ignorePolicy</code>.
- [L20](#l20) <code>source</code>: receive the next iterable value from <code>policy.sources</code> at the start of each loop iteration.
- [L22](#l22) <code>item</code>: receive the next iterable value from <code>policy.skipped</code> at the start of each loop iteration.
- [L28](#l28) <code>path</code>: receive the next iterable value from <code>report.workflow.scope ?? []</code> at the start of each loop iteration.
- [L29](#l29) <code>path</code>: receive the next iterable value from <code>report.workflow.unavailablePaths</code> at the start of each loop iteration.
- [L30](#l30) <code>criterion</code>: receive the next iterable value from <code>report.workflow.criteria ?? []</code> at the start of each loop iteration.
- [L32](#l32) <code>finding</code>: receive the next iterable value from <code>report.findings</code> at the start of each loop iteration.
- [L36](#l36) <code>evidence</code>: receive the next iterable value from <code>finding.evidence</code> at the start of each loop iteration.
- [L44](#l44) <code>task</code>: read <code>report.currentTask</code>.
- [L47](#l47) <code>item</code>: receive the next iterable value from <code>task.requirements</code> at the start of each loop iteration.
- [L48](#l48) <code>nonGoal</code>: receive the next iterable value from <code>task.nonGoals</code> at the start of each loop iteration.
- [L54](#l54) <code>resource</code>: receive the next iterable value from <code>report.references.resources</code> at the start of each loop iteration.
- [L62](#l62) <code>a</code>: read <code>report.architecture</code>.
- [L64](#l64) <code>issue</code>: receive the next iterable value from <code>a.issues</code> at the start of each loop iteration.
- [L65](#l65) <code>file</code>: receive the next iterable value from <code>a.files</code> at the start of each loop iteration.
- [L66](#l66) <code>edge</code>: receive the next iterable value from <code>a.dependencies</code> at the start of each loop iteration.
- [L67](#l67) <code>rule</code>: receive the next iterable value from <code>a.boundaries</code> at the start of each loop iteration.
- [L68](#l68) <code>rule</code>: receive the next iterable value from <code>a.conventions</code> at the start of each loop iteration.
- [L71](#l71) <code>sdk</code>: receive the next iterable value from <code>report.sdkContracts ?? []</code> at the start of each loop iteration.
- [L76](#l76) <code>issue</code>: receive the next iterable value from <code>sdk.issues</code> at the start of each loop iteration.
- [L77](#l77) <code>file</code>: receive the next iterable value from <code>sdk.files</code> at the start of each loop iteration.
- [L78](#l78) <code>call</code>: receive the next iterable value from <code>sdk.calls</code> at the start of each loop iteration.
- [L80](#l80) <code>evidence</code>: receive the next iterable value from <code>call.providerEvidence</code> at the start of each loop iteration.
- [L84](#l84) <code>contract</code>: receive the next iterable value from <code>report.contracts ?? []</code> at the start of each loop iteration.
- [L87](#l87) <code>issue</code>: receive the next iterable value from <code>contract.issues</code> at the start of each loop iteration.
- [L88](#l88) <code>file</code>: receive the next iterable value from <code>contract.files</code> at the start of each loop iteration.
- [L90](#l90) <code>call</code>: receive the next iterable value from <code>contract.calls</code> at the start of each loop iteration.
- [L97](#l97) <code>warning</code>: receive the next iterable value from <code>report.inspectionWarnings</code> at the start of each loop iteration.
- [L103](#l103) <code>check</code>: receive the next iterable value from <code>report.checks</code> at the start of each loop iteration.
- [L105](#l105) <code>diagnostic</code>: receive the next iterable value from <code>check.diagnostics ?? []</code> at the start of each loop iteration.
- [L115](#l115) <code>audit</code>: read <code>report.aiAudit</code>.
- [L120](#l120) <code>item</code>: receive the next iterable value from <code>audit.skipped</code> at the start of each loop iteration.
- [L124](#l124) <code>ai</code>: read <code>report.ai</code>.
- [L126](#l126) <code>coverage</code>: read <code>ai.coverage</code>.
- [L136](#l136) <code>file</code>: receive the next iterable value from <code>ai.preview.files</code> at the start of each loop iteration.
- [L137](#l137) <code>reference</code>: receive the next iterable value from <code>ai.preview.references ?? []</code> at the start of each loop iteration.
- [L138](#l138) <code>skipped</code>: receive the next iterable value from <code>ai.preview.skipped</code> at the start of each loop iteration.
- [L139](#l139) <code>path</code>: receive the next iterable value from <code>ai.preview.supportingPaths ?? []</code> at the start of each loop iteration.
- [L140](#l140) <code>dependency</code>: receive the next iterable value from <code>ai.preview.dependencies ?? []</code> at the start of each loop iteration.
- [L158](#l158) <code>item</code>: receive the next iterable value from <code>ai.taskReview.assessments</code> at the start of each loop iteration.
- [L163](#l163) <code>evidence</code>: receive the next iterable value from <code>item.evidence</code> at the start of each loop iteration.
- [L166](#l166) <code>conflict</code>: receive the next iterable value from <code>ai.referenceConflicts ?? []</code> at the start of each loop iteration.
- [L169](#l169) <code>evidence</code>: receive the next iterable value from <code>conflict.evidence</code> at the start of each loop iteration.
- [L170](#l170) <code>check</code>: receive the next iterable value from <code>conflict.evidenceVerification.checks</code> at the start of each loop iteration.
- [L172](#l172) <code>candidate</code>: receive the next iterable value from <code>ai.candidates</code> at the start of each loop iteration.
- [L177](#l177) <code>check</code>: receive the next iterable value from <code>candidate.evidenceVerification.checks</code> at the start of each loop iteration.
- [L180](#l180) <code>evidence</code>: receive the next iterable value from <code>candidate.evidence</code> at the start of each loop iteration.

Execution:

- [L13](#l13) Bind <code>report</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse(input)</code>.
- [L14](#l14) Bind <code>lines</code>: create an array from <code>["Shipcheck — deterministic review", &#96;Target: ${text(report.root)}&#96;, "", &#96;Findings: ${report.findings.length}&#96;, &#96;Inspection warnings: ${report.inspectionWarnings.length}&#96;]</code>; spread elements insert the iterable values.
- [L16](#l16) If <code>report.ignorePolicy</code> is truthy:
  - [L17](#l17) Bind <code>policy</code>: read <code>report.ignorePolicy</code>.
  - [L18](#l18) append values to the existing array: <code>lines.push(&#96;Ignore policy: ${policy.mode}; repository .gitignore: ${policy.respectGitignore?'enabled':'disabled'}; global Git ignore settings: never used.&#96;)</code>.
  - [L19](#l19) If <code>policy.exclude.length</code> is truthy:
    - [L19](#l19) append values to the existing array: <code>lines.push('Shipcheck exclusions: '+policy.exclude.map(text).join(', '))</code>.
  - [L20](#l20) Iterate <code>policy.sources</code> values, binding <code>const source</code> for each iteration:
    - [L20](#l20) append values to the existing array: <code>lines.push(' Ignore file: '+text(source.path))</code>.
  - [L21](#l21) append values to the existing array: <code>lines.push(&#96;Ignored entries/subtrees: ${policy.skippedCount}${policy.skippedTruncated?' (first 200 listed in JSON)':''}; descendants of ignored directories were not enumerated.&#96;)</code>.
  - [L22](#l22) Iterate <code>policy.skipped</code> values, binding <code>const item</code> for each iteration:
    - [L22](#l22) append values to the existing array: <code>lines.push(&#96; Ignored: ${text(item.path)} — ${item.reason}${item.source?' ('+text(item.source)+')':''}${item.pattern?': '+text(item.pattern):''}&#96;)</code>.
- [L24](#l24) If <code>report.workflow</code> is truthy:
  - [L25](#l25) append values to the existing array: <code>lines.push(&#96;Workflow: ${report.workflow.kind}; scope: ${report.workflow.scope===null?'whole repository':&#96;${report.workflow.scope.length} selected paths&#96;}&#96;)</code>.
  - [L26](#l26) If <code>report.workflow.baseline</code> is truthy:
    - [L26](#l26) append values to the existing array: <code>lines.push(&#96;Git baseline: ${text(report.workflow.baseline)}; current file contents reviewed, not historical patches.&#96;)</code>.
  - [L27](#l27) If <code>report.workflow.kind==='diff' &amp;&amp; report.workflow.scope?.length===0</code> is truthy:
    - [L27](#l27) append values to the existing array: <code>lines.push('No changed paths. Repository inspection and AI were skipped.')</code>.
  - [L28](#l28) Iterate <code>report.workflow.scope ?? []</code> values, binding <code>const path</code> for each iteration:
    - [L28](#l28) append values to the existing array: <code>lines.push(&#96; Selected: ${text(path)}&#96;)</code>.
  - [L29](#l29) Iterate <code>report.workflow.unavailablePaths</code> values, binding <code>const path</code> for each iteration:
    - [L29](#l29) append values to the existing array: <code>lines.push(&#96; Content unavailable (deleted, linked, or non-regular): ${text(path)}&#96;)</code>.
  - [L30](#l30) Iterate <code>report.workflow.criteria ?? []</code> values, binding <code>const criterion</code> for each iteration:
    - [L30](#l30) append values to the existing array: <code>lines.push(&#96;Acceptance criterion (human confirmation required): ${text(criterion)}&#96;)</code>.
- [L32](#l32) Iterate <code>report.findings</code> values, binding <code>const finding</code> for each iteration:
  - [L34](#l34) append values to the existing array: <code>lines.push("", &#96;[${finding.severity.toUpperCase()}] ${text(finding.ruleId)} — ${text(finding.title)}&#96;, &#96; ${text(finding.explanation)}&#96;)</code>.
  - [L36](#l36) Iterate <code>finding.evidence</code> values, binding <code>const evidence</code> for each iteration:
    - [L37](#l37) append values to the existing array: <code>lines.push(&#96; Evidence: ${text(evidence.path)}${evidence.line ? &#96;:${evidence.line}&#96; : ""} — ${text(evidence.observation)}&#96;)</code>.
    - [L38](#l38) If <code>evidence.excerpt !== undefined</code> is truthy:
      - [L38](#l38) append values to the existing array: <code>lines.push(&#96; ${text(evidence.excerpt)}&#96;)</code>.
  - [L40](#l40) append values to the existing array: <code>lines.push(&#96; Suggested action: ${text(finding.suggestedAction)}&#96;)</code>.
- [L42](#l42) If <code>report.findings.length === 0</code> is truthy:
  - [L42](#l42) append values to the existing array: <code>lines.push("", "No findings from the implemented rules.")</code>.
- [L43](#l43) If <code>report.currentTask</code> is truthy:
  - [L44](#l44) Bind <code>task</code>: read <code>report.currentTask</code>.
  - [L45](#l45) append values to the existing array: <code>lines.push('',&#96;Current task: ${text(task.id)} — ${text(task.title)}&#96;,&#96;Task SHA256 (normalized content): ${task.sha256}&#96;, &#96;Task requirements: ${task.assessment.toUpperCase()}. Supporting evidence is not proof of completion.&#96;)</code>.
  - [L47](#l47) Iterate <code>task.requirements</code> values, binding <code>const item</code> for each iteration:
    - [L47](#l47) append values to the existing array: <code>lines.push(&#96; [${item.status.toUpperCase()}] ${text(item.id)}: ${text(item.text)}&#96;)</code>.
  - [L48](#l48) Iterate <code>task.nonGoals</code> values, binding <code>const nonGoal</code> for each iteration:
    - [L48](#l48) append values to the existing array: <code>lines.push(&#96; Non-goal: ${text(nonGoal)}&#96;)</code>.
- [L50](#l50) If <code>report.references</code> is truthy:
  - [L52](#l52) append values to the existing array: <code>lines.push('',&#96;Reference loading: ${report.references.state.toUpperCase()} — NOT ASSESSED&#96;, 'Loading alone is not assessment. See each AI stage for reference inclusion. Hashes identify loaded bytes; declared versions and authority are user assertions.')</code>.
  - [L54](#l54) Iterate <code>report.references.resources</code> values, binding <code>const resource</code> for each iteration:
    - [L55](#l55) append values to the existing array: <code>lines.push( &#96; [${resource.status.toUpperCase()}] ${text(resource.id)}: ${text(resource.path)} (${resource.kind}; ${resource.authority}; ${resource.required?'required':'optional'})&#96;, &#96; Declared version: ${text(resource.version ?? 'unspecified')}; SHA256: ${r…</code>.
    - [L58](#l58) If <code>resource.origin</code> is truthy:
      - [L58](#l58) append values to the existing array: <code>lines.push(&#96; Origin: ${resource.origin.kind}; ${text(resource.origin.url ?? resource.origin.rootId ?? '')}; source path: ${text(resource.origin.path)}; root identity: ${resource.origin.rootSha256 ?? 'not applicable'}&#96;)</code>.
- [L61](#l61) If <code>report.architecture</code> is truthy:
  - [L62](#l62) Bind <code>a</code>: read <code>report.architecture</code>.
  - [L63](#l63) append values to the existing array: <code>lines.push('',&#96;Architecture: ${a.state.toUpperCase()} — ${a.coverage}&#96;,&#96; Policy SHA256: ${a.policySha256}&#96;)</code>.
  - [L64](#l64) Iterate <code>a.issues</code> values, binding <code>const issue</code> for each iteration:
    - [L64](#l64) append values to the existing array: <code>lines.push(&#96; Limitation: ${text(issue)}&#96;)</code>.
  - [L65](#l65) Iterate <code>a.files</code> values, binding <code>const file</code> for each iteration:
    - [L65](#l65) append values to the existing array: <code>lines.push(&#96; Source: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}&#96;)</code>.
  - [L66](#l66) Iterate <code>a.dependencies</code> values, binding <code>const edge</code> for each iteration:
    - [L66](#l66) append values to the existing array: <code>lines.push(&#96; [${edge.status.toUpperCase()}] ${text(edge.from)}:${edge.line} -&gt; ${text(edge.to ?? edge.specifier ?? '(dynamic)')}: ${text(edge.reason)}&#96;,&#96; ${text(edge.excerpt)}&#96;)</code>.
  - [L67](#l67) Iterate <code>a.boundaries</code> values, binding <code>const rule</code> for each iteration:
    - [L67](#l67) append values to the existing array: <code>lines.push(&#96; [${rule.status.toUpperCase()}] ${text(rule.id)}: ${text(rule.reason)}; ${rule.evidence.length} prohibited imports&#96;)</code>.
  - [L68](#l68) Iterate <code>a.conventions</code> values, binding <code>const rule</code> for each iteration:
    - [L68](#l68) append values to the existing array: <code>lines.push(&#96; [${rule.status.toUpperCase()}] ${text(rule.id)}: ${text(rule.reason)}; paths: ${rule.evidence.map(text).join(', ') &#124;&#124; '(none)'}&#96;)</code>.
  - [L69](#l69) append values to the existing array: <code>lines.push(' Import declarations only; no-observed-violation is not proof of architectural correctness. Unmapped external modules are outside the local graph.')</code>.
- [L71](#l71) Iterate <code>report.sdkContracts ?? []</code> values, binding <code>const sdk</code> for each iteration:
  - [L72](#l72) append values to the existing array: <code>lines.push('',&#96;SDK ${text(sdk.id)}: ${sdk.state.toUpperCase()} — ${text(sdk.package)}; ${sdk.scope}&#96;)</code>.
  - [L73](#l73) If <code>sdk.provider</code> is truthy:
    - [L73](#l73) append values to the existing array: <code>lines.push(&#96; Package: ${text(sdk.provider.manifestPath)}; SHA256: ${sdk.provider.manifestSha256 ?? 'unavailable'}; version: ${text(sdk.provider.version ?? 'unknown')}&#96;, &#96; Declarations: ${text(sdk.provider.declarationPath ?? 'unavailable')}; SHA256: ${sdk.pr…</code>.
  - [L75](#l75) If <code>sdk.provider?.rootId</code> is truthy:
    - [L75](#l75) append values to the existing array: <code>lines.push(&#96; External root: ${text(sdk.provider.rootId)}; identity: ${sdk.provider.rootSha256 ?? 'unavailable'}&#96;)</code>.
  - [L76](#l76) Iterate <code>sdk.issues</code> values, binding <code>const issue</code> for each iteration:
    - [L76](#l76) append values to the existing array: <code>lines.push(&#96; Limitation: ${text(issue)}&#96;)</code>.
  - [L77](#l77) Iterate <code>sdk.files</code> values, binding <code>const file</code> for each iteration:
    - [L77](#l77) append values to the existing array: <code>lines.push(&#96; Consumer: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}&#96;)</code>.
  - [L78](#l78) Iterate <code>sdk.calls</code> values, binding <code>const call</code> for each iteration:
    - [L79](#l79) append values to the existing array: <code>lines.push(&#96; [${call.status.toUpperCase()}] ${text(call.path)}:${call.line} ${text(call.symbol)} — ${text(call.reason)}&#96;,&#96; ${text(call.excerpt)}&#96;)</code>.
    - [L80](#l80) Iterate <code>call.providerEvidence</code> values, binding <code>const evidence</code> for each iteration:
      - [L80](#l80) append values to the existing array: <code>lines.push(&#96; Declaration:${evidence.line} ${text(evidence.excerpt)}&#96;)</code>.
  - [L82](#l82) append values to the existing array: <code>lines.push(' Mapped declarations only; no SDK execution, installation, compiler resolution or runtime compatibility proof.')</code>.
- [L84](#l84) Iterate <code>report.contracts ?? []</code> values, binding <code>const contract</code> for each iteration:
  - [L85](#l85) append values to the existing array: <code>lines.push('',&#96;Contract ${text(contract.id)}: ${contract.state.toUpperCase()} — ${contract.scope==='literal-javascript-fetch-only'?'literal JavaScript fetch only':'literal HTTP calls; adapter-specific coverage'}&#96;, &#96; Provider: ${text(contract.reference?.path…</code>.
  - [L87](#l87) Iterate <code>contract.issues</code> values, binding <code>const issue</code> for each iteration:
    - [L87](#l87) append values to the existing array: <code>lines.push(&#96; Limitation: ${text(issue)}&#96;)</code>.
  - [L88](#l88) Iterate <code>contract.files</code> values, binding <code>const file</code> for each iteration:
    - [L88](#l88) append values to the existing array: <code>lines.push(&#96; Consumer: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}&#96;, &#96; Adapter: ${text(file.adapter ?? 'unavailable')}; language: ${text(file.language ?? 'unsupported/unknown')}; extracted calls: ${file.callCount ?? 'n…</code>.
  - [L90](#l90) Iterate <code>contract.calls</code> values, binding <code>const call</code> for each iteration:
    - [L90](#l90) append values to the existing array: <code>lines.push(&#96; [${call.status.toUpperCase()}] ${text(call.path)}:${call.line} — ${text(call.reason)}&#96;, &#96; Observation: ${call.observationKind ?? 'request-call'}; construction does not establish that a request is sent.&#96;, &#96; ${text(call.excerpt)}&#96;,&#96; Contract poin…</code>.
  - [L93](#l93) append values to the existing array: <code>lines.push(' No runtime requests executed. Only mapped files and supported direct calls assessed; a match does not prove integration correctness.')</code>.
- [L95](#l95) If <code>report.inspectionWarnings.length &gt; 0</code> is truthy:
  - [L96](#l96) append values to the existing array: <code>lines.push("", "Inspection warnings (some content was not analyzed):")</code>.
  - [L97](#l97) Iterate <code>report.inspectionWarnings</code> values, binding <code>const warning</code> for each iteration:
    - [L98](#l98) append values to the existing array: <code>lines.push(&#96; ${text(warning.path)} [${warning.code}]: ${text(warning.message)}&#96;)</code>.
- [L101](#l101) If <code>report.checks?.length</code> is truthy:
  - [L102](#l102) append values to the existing array: <code>lines.push('', 'Configured checks (whole repository; tool output is not citation-verified):')</code>.
  - [L103](#l103) Iterate <code>report.checks</code> values, binding <code>const check</code> for each iteration:
    - [L104](#l104) append values to the existing array: <code>lines.push(&#96; [${check.status.toUpperCase()}] ${text(check.id)}: ${text(check.reason)}&#96;)</code>.
    - [L105](#l105) Iterate <code>check.diagnostics ?? []</code> values, binding <code>const diagnostic</code> for each iteration:
      - [L105](#l105) append values to the existing array: <code>lines.push( &#96; [${diagnostic.severity.toUpperCase()}] ${text(diagnostic.tool)}/${text(diagnostic.ruleId ?? 'unclassified')}: ${text(diagnostic.message)}&#96;, &#96; ${text(diagnostic.path ?? '(no file location)')}${diagnostic.line?&#96;:${diagnostic.line}&#96;:''}${diagnost…</code>.
    - [L108](#l108) If <code>check.output</code> is truthy:
      - [L108](#l108) append values to the existing array: <code>lines.push(&#96; ${text(check.output)}&#96;)</code>.
- [L111](#l111) append values to the existing array: <code>lines.push("", report.checks?.some(check=&gt;check.status!=='skipped') ? 'Scope: configured deterministic rules and explicitly authorized external checks. A successful command does not prove correctness.' : 'Scope: configured deterministic repository rules onl…</code>.
- [L114](#l114) If <code>report.aiAudit</code> is truthy:
  - [L115](#l115) Bind <code>audit</code>: read <code>report.aiAudit</code>.
  - [L116](#l116) append values to the existing array: <code>lines.push('',&#96;Whole-repository AI: ${audit.state.toUpperCase()}; ${audit.batches.length} batches; ${audit.selectedPaths.length} selected files; ${audit.validResponsePaths.length} files with valid responses; ${audit.skipped.length} skipped.&#96;, 'Whole-reposit…</code>.
  - [L118](#l118) If <code>audit.budgetName</code> is truthy:
    - [L118](#l118) append values to the existing array: <code>lines.push(&#96;Persistent allowance: ${text(audit.budgetName)}; use shipcheck budget status to inspect reservations.&#96;)</code>.
  - [L119](#l119) If <code>audit.stoppedReason</code> is truthy:
    - [L119](#l119) append values to the existing array: <code>lines.push(&#96;Stopped: ${text(audit.stoppedReason)}. Completed batches are retained; remaining paths were not reviewed.&#96;)</code>.
  - [L120](#l120) Iterate <code>audit.skipped</code> values, binding <code>const item</code> for each iteration:
    - [L120](#l120) append values to the existing array: <code>lines.push(&#96; Skipped: ${text(item.path)} — ${text(item.reason)}&#96;)</code>.
  - [L121](#l121) call the named operation with the supplied arguments: <code>audit.batches.forEach((ai,index)=&gt;lines.push('',&#96;AI batch ${index+1}:&#96;,renderConsoleReport({schemaVersion:1,root:report.root,findings:[],inspectionWarnings:[],ai})))</code>.
- [L123](#l123) If <code>report.ai</code> is truthy:
  - [L124](#l124) Bind <code>ai</code>: read <code>report.ai</code>.
  - [L125](#l125) If <code>ai.coverage</code> is truthy:
    - [L126](#l126) Bind <code>coverage</code>: read <code>ai.coverage</code>.
    - [L127](#l127) append values to the existing array: <code>lines.push('',&#96;AI coverage: ${coverage.state.toUpperCase()} — ${coverage.validResponsePaths.length} files with a valid response; ${coverage.failedResponsePaths.length} without a valid response; ${coverage.skippedPaths.length} skipped&#96;, &#96;Citation candidates:…</code>.
    - [L130](#l130) If <code>coverage.state!=='complete'</code> is truthy:
      - [L130](#l130) append values to the existing array: <code>lines.push('This is not a clean whole-repository AI result.')</code>.
  - [L132](#l132) append values to the existing array: <code>lines.push('', &#96;AI stage: ${ai.execution.toUpperCase()} / ${ai.status} — ${ai.mode}&#96;, &#96;Reviewer: ${ai.reviewer}; model: ${text(ai.model ?? 'not selected')}&#96;, &#96;Planned real model: ${text(ai.plannedModel ?? 'not selected; budget discussion pending')}&#96;, &#96;Selec…</code>.
  - [L136](#l136) Iterate <code>ai.preview.files</code> values, binding <code>const file</code> for each iteration:
    - [L136](#l136) append values to the existing array: <code>lines.push(&#96; ${text(file.path)} (${file.bytes} bytes, ${file.lines} lines); freshness: ${file.freshness ?? 'not-rechecked'}&#96;)</code>.
  - [L137](#l137) Iterate <code>ai.preview.references ?? []</code> values, binding <code>const reference</code> for each iteration:
    - [L137](#l137) append values to the existing array: <code>lines.push(&#96; Reference [${text(reference.status)}]: ${text(reference.id)} — ${text(reference.path)}; SHA256: ${reference.sha256 ?? 'unavailable'}; freshness: ${reference.freshness ?? 'not-rechecked'}&#96;)</code>.
  - [L138](#l138) Iterate <code>ai.preview.skipped</code> values, binding <code>const skipped</code> for each iteration:
    - [L138](#l138) append values to the existing array: <code>lines.push(&#96; Skipped: ${text(skipped.path)} — ${text(skipped.reason)}&#96;)</code>.
  - [L139](#l139) Iterate <code>ai.preview.supportingPaths ?? []</code> values, binding <code>const path</code> for each iteration:
    - [L139](#l139) append values to the existing array: <code>lines.push(&#96; Supporting context: ${text(path)}&#96;)</code>.
  - [L140](#l140) Iterate <code>ai.preview.dependencies ?? []</code> values, binding <code>const dependency</code> for each iteration:
    - [L140](#l140) If <code>dependency.status!=='included'</code> is truthy:
      - [L141](#l141) append values to the existing array: <code>lines.push(&#96; Missing dependency context: ${text(dependency.from)} -&gt; ${text(dependency.specifier)} (${dependency.status})&#96;)</code>.
  - [L142](#l142) append values to the existing array: <code>lines.push(&#96;Request size: ${ai.requestBytes} bytes; approximate input tokens: ${ai.estimatedInputTokens} (heuristic)&#96;, &#96;Output limit: ${ai.maxOutputTokens} tokens; retries: 0&#96;, ai.execution === 'live' ? ai.budget ? &#96;Live budget: ${text(ai.budget.name)}; per…</code>.
  - [L148](#l148) If <code>ai.execution === 'preview' &#124;&#124; ai.execution === 'mock'</code> is truthy:
    - [L148](#l148) append values to the existing array: <code>lines.push('AI offline: no model ran; no AI API request; $0 AI API spend. Explicitly authorized HTTPS references may be fetched.')</code>.
  - [L149](#l149) If <code>ai.trial</code> is truthy:
    - [L149](#l149) append values to the existing array: <code>lines.push(&#96;Counted input: ${ai.trial.countedInputTokens}; usage: ${ai.trial.usage.input_tokens} input / ${ai.trial.usage.output_tokens} output tokens&#96;, &#96;Reserved: $${ai.trial.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.trial.pricedUsageUpperBo…</code>.
  - [L151](#l151) If <code>ai.budget</code> is truthy:
    - [L151](#l151) append values to the existing array: <code>lines.push(&#96;Counted input: ${ai.budget.countedInputTokens}; usage: ${ai.budget.usage.input_tokens} input / ${ai.budget.usage.output_tokens} output tokens&#96;, &#96;Reserved: $${ai.budget.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.budget.pricedUsageUp…</code>.
  - [L153](#l153) If <code>ai.error</code> is truthy:
    - [L153](#l153) append values to the existing array: <code>lines.push(&#96;AI failure [${text(ai.error.code)}]: ${text(ai.error.message)}&#96;)</code>.
  - [L154](#l154) If <code>ai.status === 'preview'</code> is truthy:
    - [L154](#l154) append values to the existing array: <code>lines.push('Preview only: no QA review was performed.')</code>.
  - [L155](#l155) If <code>ai.status === 'completed'</code> is truthy:
    - [L155](#l155) append values to the existing array: <code>lines.push(&#96;AI candidates: ${ai.candidates.length} — UNVERIFIED${ai.execution === 'mock' ? ' / SYNTHETIC MOCK' : ''}&#96;)</code>.
  - [L156](#l156) If <code>ai.taskReview</code> is truthy:
    - [L157](#l157) append values to the existing array: <code>lines.push('',&#96;Requirement assessments: ${ai.taskReview.state.toUpperCase()}; task freshness: ${ai.taskReview.freshness}; hash: ${ai.taskReview.taskHash}&#96;)</code>.
    - [L158](#l158) Iterate <code>ai.taskReview.assessments</code> values, binding <code>const item</code> for each iteration:
      - [L159](#l159) append values to the existing array: <code>lines.push(&#96; [${item.status.toUpperCase()}] ${text(item.requirementId)}: ${text(item.explanation)}&#96;)</code>.
      - [L160](#l160) If <code>item.status!==item.proposedStatus</code> is truthy:
        - [L160](#l160) append values to the existing array: <code>lines.push(&#96; Original model status: ${item.proposedStatus}&#96;)</code>.
      - [L161](#l161) If <code>item.relatedRequirementIds.length</code> is truthy:
        - [L161](#l161) append values to the existing array: <code>lines.push(&#96; Related criteria: ${item.relatedRequirementIds.map(text).join(', ')}&#96;)</code>.
      - [L162](#l162) If <code>item.evidenceVerification</code> is truthy:
        - [L162](#l162) append values to the existing array: <code>lines.push(&#96; Citation check: ${item.evidenceVerification.status.toUpperCase()}&#96;)</code>.
      - [L163](#l163) Iterate <code>item.evidence</code> values, binding <code>const evidence</code> for each iteration:
        - [L163](#l163) append values to the existing array: <code>lines.push(&#96; ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}&#96;)</code>.
  - [L166](#l166) Iterate <code>ai.referenceConflicts ?? []</code> values, binding <code>const conflict</code> for each iteration:
    - [L167](#l167) append values to the existing array: <code>lines.push('',&#96;Reference conflict — NEEDS CLARIFICATION (AI interpretation, unverified): ${text(conflict.explanation)}&#96;, &#96; Citation check: ${conflict.evidenceVerification.status.toUpperCase()}; conflict makes coverage partial.&#96;)</code>.
    - [L169](#l169) Iterate <code>conflict.evidence</code> values, binding <code>const evidence</code> for each iteration:
      - [L169](#l169) append values to the existing array: <code>lines.push(&#96; ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}&#96;)</code>.
    - [L170](#l170) Iterate <code>conflict.evidenceVerification.checks</code> values, binding <code>const check</code> for each iteration:
      - [L170](#l170) If <code>check.status==='rejected'</code> is truthy:
        - [L170](#l170) append values to the existing array: <code>lines.push(&#96; Rejected: ${text(check.path)} — ${text(check.reason)}&#96;)</code>.
  - [L172](#l172) Iterate <code>ai.candidates</code> values, binding <code>const candidate</code> for each iteration:
    - [L173](#l173) append values to the existing array: <code>lines.push(&#96; [${candidate.severity.toUpperCase()}] ${text(candidate.title)}&#96;, &#96; ${text(candidate.explanation)}&#96;)</code>.
    - [L174](#l174) If <code>candidate.referenceConflict</code> is truthy:
      - [L174](#l174) append values to the existing array: <code>lines.push(' Depends on a disputed reference: clarify expectations before changing code.')</code>.
    - [L175](#l175) If <code>candidate.evidenceVerification</code> is truthy:
      - [L176](#l176) append values to the existing array: <code>lines.push(&#96; Citation check: ${candidate.evidenceVerification.status.toUpperCase()} (diagnosis remains unverified)&#96;)</code>.
      - [L177](#l177) Iterate <code>candidate.evidenceVerification.checks</code> values, binding <code>const check</code> for each iteration:
        - [L177](#l177) If <code>check.status === 'rejected'</code> is truthy:
          - [L178](#l178) append values to the existing array: <code>lines.push(&#96; Rejected evidence: ${text(check.path)} — ${text(check.reason)}&#96;)</code>.
    - [L180](#l180) Iterate <code>candidate.evidence</code> values, binding <code>const evidence</code> for each iteration:
      - [L180](#l180) append values to the existing array: <code>lines.push(&#96; ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}&#96;)</code>.
    - [L181](#l181) append values to the existing array: <code>lines.push(&#96; Suggested action: ${text(candidate.suggestedAction)}&#96;)</code>.
- [L184](#l184) Return to the caller: concatenate the elements with the supplied separator: <code>lines.join("\n")</code>.

<a id="fn-9591"></a>
### inline callback (111:38)

Synchronous function. Lexically inside [renderConsoleReport (12:8)](#fn-462). 

Parameters:

- <code>check</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L111](#l111) Implicitly return: compute <code>check.status!=='skipped'</code> with the <code>!==</code> operator.

<a id="fn-10728"></a>
### audit.batches.forEach callback (121:27)

Synchronous function. Lexically inside [renderConsoleReport (12:8)](#fn-462). Passed to <code>audit.batches.forEach</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>ai</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L121](#l121) Implicitly return: append values to the existing array: <code>lines.push('',&#96;AI batch ${index+1}:&#96;,renderConsoleReport({schemaVersion:1,root:report.root,findings:[],inspectionWarnings:[],ai}))</code>.

<a id="fn-17162"></a>
### renderJsonReport (187:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input: Report</code>: supplied by the caller; usage is shown in the steps below.

Execution:

- [L188](#l188) Return to the caller: serialize the value as JSON: <code>JSON.stringify(reportSchema.parse(input), null, 2)</code>.

## Module bindings

- [L4](#l4) <code>text</code>: create [text (4:14)](#fn-161); its body runs when called, not when this value is created.

## Directly importing tests

- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)
- [reference-ai.test.ts](../../test/reference-ai.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l4"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l9"></a>
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
   1 | import { reportSchema, type Report } from "./findings.js";
   2 | 
   3 | // Keep repository-controlled text on one console line and escape terminal controls.
   4 | const text = (value: string): string => value
   5 |   .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, char => {
   6 |     if (char === "\n") return "\\n";
   7 |     if (char === "\r") return "\\r";
   8 |     if (char === "\t") return "\\t";
   9 |     return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
  10 |   });
  11 | 
  12 | export function renderConsoleReport(input: Report): string {
  13 |   const report = reportSchema.parse(input);
  14 |   const lines = ["Shipcheck — deterministic review", `Target: ${text(report.root)}`, "",
  15 |     `Findings: ${report.findings.length}`, `Inspection warnings: ${report.inspectionWarnings.length}`];
  16 |   if(report.ignorePolicy) {
  17 |     const policy=report.ignorePolicy;
  18 |     lines.push(`Ignore policy: ${policy.mode}; repository .gitignore: ${policy.respectGitignore?'enabled':'disabled'}; global Git ignore settings: never used.`);
  19 |     if(policy.exclude.length)lines.push('Shipcheck exclusions: '+policy.exclude.map(text).join(', '));
  20 |     for(const source of policy.sources)lines.push('  Ignore file: '+text(source.path));
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
<a id="l32"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l40"></a>

```text
  21 |     lines.push(`Ignored entries/subtrees: ${policy.skippedCount}${policy.skippedTruncated?' (first 200 listed in JSON)':''}; descendants of ignored directories were not enumerated.`);
  22 |     for(const item of policy.skipped)lines.push(`  Ignored: ${text(item.path)} — ${item.reason}${item.source?' ('+text(item.source)+')':''}${item.pattern?': '+text(item.pattern):''}`);
  23 |   }
  24 |   if (report.workflow) {
  25 |     lines.push(`Workflow: ${report.workflow.kind}; scope: ${report.workflow.scope===null?'whole repository':`${report.workflow.scope.length} selected paths`}`);
  26 |     if (report.workflow.baseline) lines.push(`Git baseline: ${text(report.workflow.baseline)}; current file contents reviewed, not historical patches.`);
  27 |     if (report.workflow.kind==='diff' && report.workflow.scope?.length===0) lines.push('No changed paths. Repository inspection and AI were skipped.');
  28 |     for (const path of report.workflow.scope ?? []) lines.push(`  Selected: ${text(path)}`);
  29 |     for (const path of report.workflow.unavailablePaths) lines.push(`  Content unavailable (deleted, linked, or non-regular): ${text(path)}`);
  30 |     for (const criterion of report.workflow.criteria ?? []) lines.push(`Acceptance criterion (human confirmation required): ${text(criterion)}`);
  31 |   }
  32 |   for (const finding of report.findings) {
  33 |     // Findings remain separate from task-criterion assessments.
  34 |     lines.push("", `[${finding.severity.toUpperCase()}] ${text(finding.ruleId)} — ${text(finding.title)}`,
  35 |       `  ${text(finding.explanation)}`);
  36 |     for (const evidence of finding.evidence) {
  37 |       lines.push(`  Evidence: ${text(evidence.path)}${evidence.line ? `:${evidence.line}` : ""} — ${text(evidence.observation)}`);
  38 |       if (evidence.excerpt !== undefined) lines.push(`    ${text(evidence.excerpt)}`);
  39 |     }
  40 |     lines.push(`  Suggested action: ${text(finding.suggestedAction)}`);
```

<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l47"></a>
<a id="l48"></a>
<a id="l50"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>

```text
  41 |   }
  42 |   if (report.findings.length === 0) lines.push("", "No findings from the implemented rules.");
  43 |   if(report.currentTask) {
  44 |     const task=report.currentTask;
  45 |     lines.push('',`Current task: ${text(task.id)} — ${text(task.title)}`,`Task SHA256 (normalized content): ${task.sha256}`,
  46 |       `Task requirements: ${task.assessment.toUpperCase()}. Supporting evidence is not proof of completion.`);
  47 |     for(const item of task.requirements)lines.push(`  [${item.status.toUpperCase()}] ${text(item.id)}: ${text(item.text)}`);
  48 |     for(const nonGoal of task.nonGoals)lines.push(`  Non-goal: ${text(nonGoal)}`);
  49 |   }
  50 |   if(report.references) {
  51 |     // Resource loading and contract comparison are separate stages.
  52 |     lines.push('',`Reference loading: ${report.references.state.toUpperCase()} — NOT ASSESSED`,
  53 |       'Loading alone is not assessment. See each AI stage for reference inclusion. Hashes identify loaded bytes; declared versions and authority are user assertions.');
  54 |     for(const resource of report.references.resources) {
  55 |       lines.push(
  56 |       `  [${resource.status.toUpperCase()}] ${text(resource.id)}: ${text(resource.path)} (${resource.kind}; ${resource.authority}; ${resource.required?'required':'optional'})`,
  57 |       `    Declared version: ${text(resource.version ?? 'unspecified')}; SHA256: ${resource.sha256 ?? 'unavailable'}; bytes: ${resource.bytes}`);
  58 |       if(resource.origin)lines.push(`    Origin: ${resource.origin.kind}; ${text(resource.origin.url ?? resource.origin.rootId ?? '')}; source path: ${text(resource.origin.path)}; root identity: ${resource.origin.rootSha256 ?? 'not applicable'}`);
  59 |     }
  60 |   }
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
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   if(report.architecture) {
  62 |     const a=report.architecture;
  63 |     lines.push('',`Architecture: ${a.state.toUpperCase()} — ${a.coverage}`,`  Policy SHA256: ${a.policySha256}`);
  64 |     for(const issue of a.issues)lines.push(`  Limitation: ${text(issue)}`);
  65 |     for(const file of a.files)lines.push(`  Source: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}`);
  66 |     for(const edge of a.dependencies)lines.push(`  [${edge.status.toUpperCase()}] ${text(edge.from)}:${edge.line} -> ${text(edge.to ?? edge.specifier ?? '(dynamic)')}: ${text(edge.reason)}`,`    ${text(edge.excerpt)}`);
  67 |     for(const rule of a.boundaries)lines.push(`  [${rule.status.toUpperCase()}] ${text(rule.id)}: ${text(rule.reason)}; ${rule.evidence.length} prohibited imports`);
  68 |     for(const rule of a.conventions)lines.push(`  [${rule.status.toUpperCase()}] ${text(rule.id)}: ${text(rule.reason)}; paths: ${rule.evidence.map(text).join(', ') || '(none)'}`);
  69 |     lines.push('  Import declarations only; no-observed-violation is not proof of architectural correctness. Unmapped external modules are outside the local graph.');
  70 |   }
  71 |   for(const sdk of report.sdkContracts ?? []) {
  72 |     lines.push('',`SDK ${text(sdk.id)}: ${sdk.state.toUpperCase()} — ${text(sdk.package)}; ${sdk.scope}`);
  73 |     if(sdk.provider)lines.push(`  Package: ${text(sdk.provider.manifestPath)}; SHA256: ${sdk.provider.manifestSha256 ?? 'unavailable'}; version: ${text(sdk.provider.version ?? 'unknown')}`,
  74 |       `  Declarations: ${text(sdk.provider.declarationPath ?? 'unavailable')}; SHA256: ${sdk.provider.declarationSha256 ?? 'unavailable'}`);
  75 |     if(sdk.provider?.rootId)lines.push(`  External root: ${text(sdk.provider.rootId)}; identity: ${sdk.provider.rootSha256 ?? 'unavailable'}`);
  76 |     for(const issue of sdk.issues)lines.push(`  Limitation: ${text(issue)}`);
  77 |     for(const file of sdk.files)lines.push(`  Consumer: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}`);
  78 |     for(const call of sdk.calls) {
  79 |       lines.push(`  [${call.status.toUpperCase()}] ${text(call.path)}:${call.line} ${text(call.symbol)} — ${text(call.reason)}`,`    ${text(call.excerpt)}`);
  80 |       for(const evidence of call.providerEvidence)lines.push(`    Declaration:${evidence.line} ${text(evidence.excerpt)}`);
```

<a id="l82"></a>
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
<a id="l95"></a>
<a id="l96"></a>
<a id="l97"></a>
<a id="l98"></a>

```text
  81 |     }
  82 |     lines.push('  Mapped declarations only; no SDK execution, installation, compiler resolution or runtime compatibility proof.');
  83 |   }
  84 |   for(const contract of report.contracts ?? []) {
  85 |     lines.push('',`Contract ${text(contract.id)}: ${contract.state.toUpperCase()} — ${contract.scope==='literal-javascript-fetch-only'?'literal JavaScript fetch only':'literal HTTP calls; adapter-specific coverage'}`,
  86 |       `  Provider: ${text(contract.reference?.path ?? contract.resourceId)}; SHA256: ${contract.reference?.sha256 ?? 'unavailable'}; version: ${text(contract.reference?.apiVersion ?? 'unknown')}`);
  87 |     for(const issue of contract.issues)lines.push(`  Limitation: ${text(issue)}`);
  88 |     for(const file of contract.files)lines.push(`  Consumer: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}`,
  89 |       `    Adapter: ${text(file.adapter ?? 'unavailable')}; language: ${text(file.language ?? 'unsupported/unknown')}; extracted calls: ${file.callCount ?? 'not recorded'}`);
  90 |     for(const call of contract.calls)lines.push(`  [${call.status.toUpperCase()}] ${text(call.path)}:${call.line} — ${text(call.reason)}`,
  91 |       `    Observation: ${call.observationKind ?? 'request-call'}; construction does not establish that a request is sent.`,
  92 |       `    ${text(call.excerpt)}`,`    Contract pointers: ${call.contractPointers.map(text).join(', ') || '(none)'}`);
  93 |     lines.push('  No runtime requests executed. Only mapped files and supported direct calls assessed; a match does not prove integration correctness.');
  94 |   }
  95 |   if (report.inspectionWarnings.length > 0) {
  96 |     lines.push("", "Inspection warnings (some content was not analyzed):");
  97 |     for (const warning of report.inspectionWarnings) {
  98 |       lines.push(`  ${text(warning.path)} [${warning.code}]: ${text(warning.message)}`);
  99 |     }
 100 |   }
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l111"></a>
<a id="l112"></a>
<a id="l113"></a>
<a id="l114"></a>
<a id="l115"></a>
<a id="l116"></a>
<a id="l117"></a>
<a id="l118"></a>
<a id="l119"></a>
<a id="l120"></a>

```text
 101 |   if(report.checks?.length) {
 102 |     lines.push('', 'Configured checks (whole repository; tool output is not citation-verified):');
 103 |     for(const check of report.checks) {
 104 |       lines.push(`  [${check.status.toUpperCase()}] ${text(check.id)}: ${text(check.reason)}`);
 105 |       for(const diagnostic of check.diagnostics ?? [])lines.push(
 106 |         `    [${diagnostic.severity.toUpperCase()}] ${text(diagnostic.tool)}/${text(diagnostic.ruleId ?? 'unclassified')}: ${text(diagnostic.message)}`,
 107 |         `      ${text(diagnostic.path ?? '(no file location)')}${diagnostic.line?`:${diagnostic.line}`:''}${diagnostic.column?`:${diagnostic.column}`:''}`);
 108 |       if(check.output)lines.push(`    ${text(check.output)}`);
 109 |     }
 110 |   }
 111 |   lines.push("", report.checks?.some(check=>check.status!=='skipped')
 112 |     ? 'Scope: configured deterministic rules and explicitly authorized external checks. A successful command does not prove correctness.'
 113 |     : 'Scope: configured deterministic repository rules only. No scripts or tests were executed.');
 114 |   if(report.aiAudit) {
 115 |     const audit=report.aiAudit;
 116 |     lines.push('',`Whole-repository AI: ${audit.state.toUpperCase()}; ${audit.batches.length} batches; ${audit.selectedPaths.length} selected files; ${audit.validResponsePaths.length} files with valid responses; ${audit.skipped.length} skipped.`,
 117 |       'Whole-repository scope does not guarantee complete context or defect detection. Preview/mock results are not real diagnoses.');
 118 |     if(audit.budgetName)lines.push(`Persistent allowance: ${text(audit.budgetName)}; use shipcheck budget status to inspect reservations.`);
 119 |     if(audit.stoppedReason)lines.push(`Stopped: ${text(audit.stoppedReason)}. Completed batches are retained; remaining paths were not reviewed.`);
 120 |     for(const item of audit.skipped)lines.push(`  Skipped: ${text(item.path)} — ${text(item.reason)}`);
```

<a id="l121"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>
<a id="l129"></a>
<a id="l130"></a>
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
 121 |     audit.batches.forEach((ai,index)=>lines.push('',`AI batch ${index+1}:`,renderConsoleReport({schemaVersion:1,root:report.root,findings:[],inspectionWarnings:[],ai})));
 122 |   }
 123 |   if (report.ai) {
 124 |     const ai = report.ai;
 125 |     if(ai.coverage) {
 126 |       const coverage=ai.coverage;
 127 |       lines.push('',`AI coverage: ${coverage.state.toUpperCase()} — ${coverage.validResponsePaths.length} files with a valid response; ${coverage.failedResponsePaths.length} without a valid response; ${coverage.skippedPaths.length} skipped`,
 128 |         `Citation candidates: ${coverage.matchedCandidates} matched, ${coverage.rejectedCandidates} rejected; ${coverage.outOfScopeCandidates} outside requested scope`,
 129 |         'Coverage describes supplied context, not proof that every defect was found.');
 130 |       if(coverage.state!=='complete') lines.push('This is not a clean whole-repository AI result.');
 131 |     }
 132 |     lines.push('', `AI stage: ${ai.execution.toUpperCase()} / ${ai.status} — ${ai.mode}`,
 133 |       `Reviewer: ${ai.reviewer}; model: ${text(ai.model ?? 'not selected')}`,
 134 |       `Planned real model: ${text(ai.plannedModel ?? 'not selected; budget discussion pending')}`,
 135 |       `Selected source files: ${ai.preview.files.length}; skipped: ${ai.preview.skipped.length}; limited: ${ai.preview.limited}`);
 136 |     for (const file of ai.preview.files) lines.push(`  ${text(file.path)} (${file.bytes} bytes, ${file.lines} lines); freshness: ${file.freshness ?? 'not-rechecked'}`);
 137 |     for(const reference of ai.preview.references ?? [])lines.push(`  Reference [${text(reference.status)}]: ${text(reference.id)} — ${text(reference.path)}; SHA256: ${reference.sha256 ?? 'unavailable'}; freshness: ${reference.freshness ?? 'not-rechecked'}`);
 138 |     for (const skipped of ai.preview.skipped) lines.push(`  Skipped: ${text(skipped.path)} — ${text(skipped.reason)}`);
 139 |     for (const path of ai.preview.supportingPaths ?? []) lines.push(`  Supporting context: ${text(path)}`);
 140 |     for (const dependency of ai.preview.dependencies ?? []) if(dependency.status!=='included')
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
 141 |       lines.push(`  Missing dependency context: ${text(dependency.from)} -> ${text(dependency.specifier)} (${dependency.status})`);
 142 |     lines.push(`Request size: ${ai.requestBytes} bytes; approximate input tokens: ${ai.estimatedInputTokens} (heuristic)`,
 143 |       `Output limit: ${ai.maxOutputTokens} tokens; retries: 0`,
 144 |       ai.execution === 'live' ? ai.budget ? `Live budget: ${text(ai.budget.name)}; persistent reservations; no retries.`
 145 |         : ai.trial ? 'Live trial: $0.50 allowance; one attempt per mode; no retries. See shipcheck trial status.'
 146 |         : 'Live request failed; inspect the selected allowance for any retained reservation.'
 147 |         : 'Live cost estimate: unavailable in offline mode.');
 148 |     if (ai.execution === 'preview' || ai.execution === 'mock') lines.push('AI offline: no model ran; no AI API request; $0 AI API spend. Explicitly authorized HTTPS references may be fetched.');
 149 |     if (ai.trial) lines.push(`Counted input: ${ai.trial.countedInputTokens}; usage: ${ai.trial.usage.input_tokens} input / ${ai.trial.usage.output_tokens} output tokens`,
 150 |       `Reserved: $${ai.trial.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.trial.pricedUsageUpperBoundUsd.toFixed(6)} (not an invoice).`);
 151 |     if(ai.budget)lines.push(`Counted input: ${ai.budget.countedInputTokens}; usage: ${ai.budget.usage.input_tokens} input / ${ai.budget.usage.output_tokens} output tokens`,
 152 |       `Reserved: $${ai.budget.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.budget.pricedUsageUpperBoundUsd.toFixed(6)} (not an invoice).`);
 153 |     if (ai.error) lines.push(`AI failure [${text(ai.error.code)}]: ${text(ai.error.message)}`);
 154 |     if (ai.status === 'preview') lines.push('Preview only: no QA review was performed.');
 155 |     if (ai.status === 'completed') lines.push(`AI candidates: ${ai.candidates.length} — UNVERIFIED${ai.execution === 'mock' ? ' / SYNTHETIC MOCK' : ''}`);
 156 |     if(ai.taskReview) {
 157 |       lines.push('',`Requirement assessments: ${ai.taskReview.state.toUpperCase()}; task freshness: ${ai.taskReview.freshness}; hash: ${ai.taskReview.taskHash}`);
 158 |       for(const item of ai.taskReview.assessments) {
 159 |         lines.push(`  [${item.status.toUpperCase()}] ${text(item.requirementId)}: ${text(item.explanation)}`);
 160 |         if(item.status!==item.proposedStatus)lines.push(`    Original model status: ${item.proposedStatus}`);
```

<a id="l161"></a>
<a id="l162"></a>
<a id="l163"></a>
<a id="l166"></a>
<a id="l167"></a>
<a id="l168"></a>
<a id="l169"></a>
<a id="l170"></a>
<a id="l172"></a>
<a id="l173"></a>
<a id="l174"></a>
<a id="l175"></a>
<a id="l176"></a>
<a id="l177"></a>
<a id="l178"></a>
<a id="l180"></a>

```text
 161 |         if(item.relatedRequirementIds.length)lines.push(`    Related criteria: ${item.relatedRequirementIds.map(text).join(', ')}`);
 162 |         if(item.evidenceVerification)lines.push(`    Citation check: ${item.evidenceVerification.status.toUpperCase()}`);
 163 |         for(const evidence of item.evidence)lines.push(`    ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
 164 |       }
 165 |     }
 166 |     for(const conflict of ai.referenceConflicts ?? []) {
 167 |       lines.push('',`Reference conflict — NEEDS CLARIFICATION (AI interpretation, unverified): ${text(conflict.explanation)}`,
 168 |         `  Citation check: ${conflict.evidenceVerification.status.toUpperCase()}; conflict makes coverage partial.`);
 169 |       for(const evidence of conflict.evidence)lines.push(`  ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
 170 |       for(const check of conflict.evidenceVerification.checks)if(check.status==='rejected')lines.push(`  Rejected: ${text(check.path)} — ${text(check.reason)}`);
 171 |     }
 172 |     for (const candidate of ai.candidates) {
 173 |       lines.push(`  [${candidate.severity.toUpperCase()}] ${text(candidate.title)}`, `    ${text(candidate.explanation)}`);
 174 |       if(candidate.referenceConflict)lines.push('    Depends on a disputed reference: clarify expectations before changing code.');
 175 |       if (candidate.evidenceVerification) {
 176 |         lines.push(`    Citation check: ${candidate.evidenceVerification.status.toUpperCase()} (diagnosis remains unverified)`);
 177 |         for (const check of candidate.evidenceVerification.checks) if (check.status === 'rejected')
 178 |           lines.push(`    Rejected evidence: ${text(check.path)} — ${text(check.reason)}`);
 179 |       }
 180 |       for (const evidence of candidate.evidence) lines.push(`    ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
```

<a id="l181"></a>
<a id="l184"></a>
<a id="l187"></a>
<a id="l188"></a>

```text
 181 |       lines.push(`    Suggested action: ${text(candidate.suggestedAction)}`);
 182 |     }
 183 |   }
 184 |   return lines.join("\n");
 185 | }
 186 | 
 187 | export function renderJsonReport(input: Report): string {
 188 |   return JSON.stringify(reportSchema.parse(input), null, 2);
 189 | }
 190 | 
```
