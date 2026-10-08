# src/contract-audit.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

auditContracts scopes mapped files, loads/indexes a pinned provider snapshot, enforces version constraints, then reads consumers and dispatches syntax adapters. compare resolves literal absolute URLs against the configured service prefix, matches exact routes before simple templates, overlays operation parameters over path parameters, and checks supported required query-name presence. Unsupported syntax or outside-service calls make coverage partial; an actual route/method/name mismatch remains an assessed mismatch.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `843c8fc6d0fc635eb966f52c2ab31083025c5a19ce819bf25e6a5baf12e9bd83`.

This chapter inventories **22 function bodies/callbacks**, **44 variable declarations**, and **1 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./config.js</code>: <code>configSchema</code>, <code>matchesPattern</code>, <code>ConfigInput</code> (type only).
- <code>./reference-resources.js</code>: <code>loadReferenceResources</code>.
- <code>./openapi-contract.js</code>: <code>indexOpenApi</code>.
- <code>./contract-adapter-types.js</code>: <code>CallObservation</code> (type only).
- <code>./contract-adapters.js</code>: <code>contractAdapterFor</code>.
- <code>./contract-contracts.js</code>: <code>ContractResult</code> (type only).
- <code>./reference-access.js</code>: <code>ReferenceAccess</code> (type only).
- <code>./version-policy.js</code>: <code>versionIssue</code>.

## Module execution

- [L10](#l10) Bind <code>object</code>: create [object (10:14)](#fn-501); its body runs when called, not when this value is created.
- [L11](#l11) Bind <code>pointer</code>: create [pointer (11:15)](#fn-605); its body runs when called, not when this value is created.
- [L13](#l13) Bind <code>outcome</code>: create [outcome (13:15)](#fn-765); its body runs when called, not when this value is created.

## Function index

- [object (10:14)](#fn-501)
- [pointer (11:15)](#fn-605)
- [outcome (13:15)](#fn-765)
- [compare (16:1)](#fn-980)
- [Object.keys(paths).filter callback (27:41)](#fn-1976)
- [supported (28:19)](#fn-2023)
- [path.split('/').every callback (28:56)](#fn-2060)
- [names.some callback (29:17)](#fn-2133)
- [names.filter callback (30:65)](#fn-2279)
- [parts.every callback (32:56)](#fn-2399)
- [[...parameters.values()].filter callback (59:49)](#fn-4498)
- [missing.map callback (60:106)](#fn-4745)
- [missing.map callback (60:146)](#fn-4785)
- [auditContracts (64:8)](#fn-4980)
- [[...new Set(binding.files)].filter callback (67:52)](#fn-5287)
- [config.resources.find callback (71:42)](#fn-5579)
- [files.some callback (73:19)](#fn-5789)
- [resource.appliesTo.some callback (73:50)](#fn-5820)
- [index.issues.map callback (81:131)](#fn-6720)
- [files.map callback (85:137)](#fn-7211)
- [loaded.snapshots.find callback (92:42)](#fn-7792)
- [extracted.issues.map callback (96:78)](#fn-8216)

<a id="fn-501"></a>
### object (10:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>v:unknown</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L10](#l10) Implicitly return: evaluate <code>!!v &amp;&amp; typeof v==='object' &amp;&amp; !Array.isArray(v)</code> left to right with falsy short-circuiting.

<a id="fn-605"></a>
### pointer (11:15)

Synchronous function. Defined in module scope. 

Parameters:

- <code>v:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L11](#l11) Implicitly return: produce a string with matching text replaced: <code>v.replace(/~/g,'~0').replace(/\//g,'~1')</code>.

<a id="fn-765"></a>
### outcome (13:15)

Synchronous function. Defined in module scope. 

Parameters:

- <code>status:Comparison['status']</code>: supplied by the caller; usage is shown in the steps below.
- <code>reason:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>contractPointers:string[]=[]</code>: when omitted/undefined, initialize with <code>[]</code>.

Execution:

[L13](#l13) Implicitly return: create an object with 3 property/spread entries: <code>{status,reason,contractPointers}</code>; later properties overwrite earlier spread values.

<a id="fn-980"></a>
### compare (16:1)

Synchronous function. Defined in module scope. 

Parameters:

- <code>call:CallObservation</code>: supplied by the caller; usage is shown in the steps below.
- <code>baseUrl:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>paths:Record&lt;string,unknown&gt;</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L19](#l19) <code>url:URL</code>: leave the value undefined until a later assignment.
- [L20](#l20) <code>base</code>: construct <code>URL</code> using <code>baseUrl</code>; this creates the local instance used below.
- [L20](#l20) <code>prefix</code>: produce a string with matching text replaced: <code>base.pathname.replace(/\/$/,'')</code>.
- [L25](#l25) <code>route</code>: evaluate <code>url.pathname.slice(prefix.length) &#124;&#124; '/'</code> left to right with truthy short-circuiting.
- [L27](#l27) <code>names</code>: retain only elements whose callback returns a truthy value: <code>Object.keys(paths).filter(path=&gt;path.startsWith('/'))</code>.
- [L28](#l28) <code>supported</code>: create [supported (28:19)](#fn-2023); its body runs when called, not when this value is created.
- [L30](#l30) <code>matches</code>: test <code>Object.hasOwn(paths,route)</code>; choose <code>[route]</code> when truthy, otherwise <code>names.filter(path=&gt;{ const parts=path.split('/'),actual=route.split('/'); return parts.length===actual.length &amp;&amp; parts.every((part,i)=&gt;part===actual[i] &#124;&#124; /^\{[^{}]+\}$/.test(part) &amp;&amp; !!actual[i]); })</code>.
- [L36](#l36) <code>path</code>: read <code>matches[0]</code>; the TypeScript assertion adds no runtime validation.
- [L36](#l36) <code>at</code>: compute <code>'/paths/'+pointer(path)</code> with the <code>+</code> operator.
- [L36](#l36) <code>item</code>: read <code>paths[path]</code>.
- [L38](#l38) <code>method</code>: call the named operation with the supplied arguments: <code>call.method!.toLowerCase()</code>.
- [L38](#l38) <code>operation</code>: read <code>item[method]</code>.
- [L41](#l41) <code>parameters</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L42](#l42) <code>[owner,location]</code>: receive the next iterable value from <code>[[item,at],[operation,at+'/'+method]] as const</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L45](#l45) <code>seen</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L46](#l46) <code>[i,param]</code>: receive the next iterable value from <code>owner.parameters.entries()</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L49](#l49) <code>key</code>: compute <code>param.in+':'+param.name</code> with the <code>+</code> operator.
- [L55](#l55) <code>{value:p,at:location}</code>: receive the next iterable value from <code>parameters.values()</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L59](#l59) <code>missing</code>: retain only elements whose callback returns a truthy value: <code>[...parameters.values()].filter(({value:p})=&gt;p.in==='query' &amp;&amp; p.required===true &amp;&amp; !url.searchParams.has(p.name as string) &amp;&amp; !call.queryNames?.includes(p.name as string))</code>.

Execution:

- [L17](#l17) If <code>call.reason</code> is truthy:
  - [L17](#l17) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved',call.reason)</code>.
- [L19](#l19) Bind <code>url:URL</code>: leave the value undefined until a later assignment.
- [L19](#l19) Run the protected block:
  - [L19](#l19) update <code>url</code> with <code>new URL(call.url!)</code> using <code>=</code>; this mutation is visible to later statements.
- [L19](#l19) If it throws:
  - [L19](#l19) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','relative-or-invalid-url')</code>.
- [L20](#l20) Bind <code>base</code>: construct <code>URL</code> using <code>baseUrl</code>; this creates the local instance used below.
- [L20](#l20) Bind <code>prefix</code>: produce a string with matching text replaced: <code>base.pathname.replace(/\/$/,'')</code>.
- [L21](#l21) If <code>url.username &#124;&#124; url.password</code> is truthy:
  - [L21](#l21) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','credential-bearing-url')</code>.
- [L22](#l22) If <code>url.origin!==base.origin &#124;&#124; !(url.pathname===prefix &#124;&#124; url.pathname.startsWith(prefix+'/'))</code> is truthy:
  - [L23](#l23) Return to the caller: call the named operation with the supplied arguments: <code>outcome('outside-service','URL is outside the configured service base.')</code>.
- [L24](#l24) If <code>!['GET','POST','PUT','DELETE','HEAD','OPTIONS','PATCH'].includes(call.method!)</code> is truthy:
  - [L24](#l24) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','unsupported-method')</code>.
- [L25](#l25) Bind <code>route</code>: evaluate <code>url.pathname.slice(prefix.length) &#124;&#124; '/'</code> left to right with truthy short-circuiting.
- [L26](#l26) If <code>route.includes('%')</code> is truthy:
  - [L26](#l26) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','encoded-path')</code>.
- [L27](#l27) Bind <code>names</code>: retain only elements whose callback returns a truthy value: <code>Object.keys(paths).filter(path=&gt;path.startsWith('/'))</code>.
- [L28](#l28) Bind <code>supported</code>: create [supported (28:19)](#fn-2023); its body runs when called, not when this value is created.
- [L29](#l29) If <code>names.some(path=&gt;!supported(path))</code> is truthy:
  - [L29](#l29) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','unsupported-path-template')</code>.
- [L30](#l30) Bind <code>matches</code>: test <code>Object.hasOwn(paths,route)</code>; choose <code>[route]</code> when truthy, otherwise <code>names.filter(path=&gt;{ const parts=path.split('/'),actual=route.split('/'); return parts.length===actual.length &amp;&amp; parts.every((part,i)=&gt;part===actual[i] &#124;&#124; /^\{[^{}]+\}$/.test(part) &amp;&amp; !!actual[i]); })</code>.
- [L34](#l34) If <code>matches.length&gt;1</code> is truthy:
  - [L34](#l34) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','ambiguous-path-template')</code>.
- [L35](#l35) If <code>!matches.length</code> is truthy:
  - [L35](#l35) Return to the caller: call the named operation with the supplied arguments: <code>outcome('mismatch','Route is absent from the configured contract.',['/paths'])</code>.
- [L36](#l36) Bind <code>path</code>: read <code>matches[0]</code>; the TypeScript assertion adds no runtime validation.
- [L36](#l36) Bind <code>at</code>: compute <code>'/paths/'+pointer(path)</code> with the <code>+</code> operator.
- [L36](#l36) Bind <code>item</code>: read <code>paths[path]</code>.
- [L37](#l37) If <code>!object(item)</code> is truthy:
  - [L37](#l37) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','invalid-path-item')</code>.
- [L38](#l38) Bind <code>method</code>: call the named operation with the supplied arguments: <code>call.method!.toLowerCase()</code>.
- [L38](#l38) Bind <code>operation</code>: read <code>item[method]</code>.
- [L39](#l39) If <code>!Object.hasOwn(item,method)</code> is truthy:
  - [L39](#l39) Return to the caller: call the named operation with the supplied arguments: <code>outcome('mismatch','Method is absent for the matched route.',[at])</code>.
- [L40](#l40) If <code>!object(operation)</code> is truthy:
  - [L40](#l40) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','invalid-operation')</code>.
- [L41](#l41) Bind <code>parameters</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L42](#l42) Iterate <code>[[item,at],[operation,at+'/'+method]] as const</code> values, binding <code>const [owner,location]</code> for each iteration:
  - [L43](#l43) If <code>owner.parameters===undefined</code> is truthy:
    - [L43](#l43) Skip the rest of this iteration and advance the enclosing loop.
  - [L44](#l44) If <code>!Array.isArray(owner.parameters)</code> is truthy:
    - [L44](#l44) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','unsupported-parameters',[location])</code>.
  - [L45](#l45) Bind <code>seen</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
  - [L46](#l46) Iterate <code>owner.parameters.entries()</code> values, binding <code>const [i,param]</code> for each iteration:
    - [L47](#l47) If <code>!object(param) &#124;&#124; '$ref' in param &#124;&#124; typeof param.name!=='string' &#124;&#124; !['query','path','header','cookie'].includes(String(param.in)) &#124;&#124; (param.required!==undefined &amp;&amp; typeof param.required!=='boolean')</code> is truthy:
      - [L48](#l48) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','unsupported-parameter-definition',[location+'/parameters'])</code>.
    - [L49](#l49) Bind <code>key</code>: compute <code>param.in+':'+param.name</code> with the <code>+</code> operator.
    - [L50](#l50) If <code>seen.has(key)</code> is truthy:
      - [L50](#l50) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','duplicate-parameter',[location+'/parameters'])</code>.
    - [L51](#l51) insert a unique value in the Set: <code>seen.add(key)</code>.
    - [L51](#l51) store/replace a keyed entry in the Map: <code>parameters.set(key,{value:param,at:location+'/parameters/'+i})</code>.
- [L55](#l55) Iterate <code>parameters.values()</code> values, binding <code>const {value:p,at:location}</code> for each iteration:
  - [L55](#l55) If <code>p.in==='query' &amp;&amp; p.required===true</code> is truthy:
    - [L56](#l56) If <code>p.content!==undefined &#124;&#124; !object(p.schema) &#124;&#124; !['string','number','integer','boolean'].includes(String(p.schema.type)) &#124;&#124; (p.style!==undefined &amp;&amp; p.style!=='form')</code> is truthy:
      - [L57](#l57) Return to the caller: call the named operation with the supplied arguments: <code>outcome('unresolved','unsupported-required-query-serialization',[location])</code>.
- [L59](#l59) Bind <code>missing</code>: retain only elements whose callback returns a truthy value: <code>[...parameters.values()].filter(({value:p})=&gt;p.in==='query' &amp;&amp; p.required===true &amp;&amp; !url.searchParams.has(p.name as string) &amp;&amp; !call.queryNames?.includes(p.name as string))</code>.
- [L60](#l60) If <code>missing.length</code> is truthy:
  - [L60](#l60) Return to the caller: call the named operation with the supplied arguments: <code>outcome('mismatch','Required query parameter names are missing: '+missing.map(p=&gt;p.value.name).join(', '),missing.map(p=&gt;p.at))</code>.
- [L61](#l61) Return to the caller: call the named operation with the supplied arguments: <code>outcome('matched','Method, route and supported required query-name presence match; values, bodies, responses and authentication are not assessed.',[at+'/'+method])</code>.

<a id="fn-1976"></a>
### Object.keys(paths).filter callback (27:41)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>Object.keys(paths).filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L27](#l27) Implicitly return: call the named operation with the supplied arguments: <code>path.startsWith('/')</code>.

<a id="fn-2023"></a>
### supported (28:19)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: stop at the first falsy callback result, returning whether all matched: <code>path.split('/').every(part=&gt;!/[{}]/.test(part) &#124;&#124; /^\{[^{}/]+\}$/.test(part))</code>.

<a id="fn-2060"></a>
### path.split('/').every callback (28:56)

Synchronous function. Lexically inside [supported (28:19)](#fn-2023). Passed to <code>path.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L28](#l28) Implicitly return: evaluate <code>!/[{}]/.test(part) &#124;&#124; /^\{[^{}/]+\}$/.test(part)</code> left to right with truthy short-circuiting.

<a id="fn-2133"></a>
### names.some callback (29:17)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>names.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: apply <code>!</code> to <code>supported(path)</code>.

<a id="fn-2279"></a>
### names.filter callback (30:65)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>names.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L31](#l31) <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.
- [L31](#l31) <code>actual</code>: divide the string using the delimiter or regular expression: <code>route.split('/')</code>.

Execution:

- [L31](#l31) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split('/')</code>.
- [L31](#l31) Bind <code>actual</code>: divide the string using the delimiter or regular expression: <code>route.split('/')</code>.
- [L32](#l32) Return to the caller: evaluate <code>parts.length===actual.length &amp;&amp; parts.every((part,i)=&gt;part===actual[i] &#124;&#124; /^\{[^{}]+\}$/.test(part) &amp;&amp; !!actual[i])</code> left to right with falsy short-circuiting.

<a id="fn-2399"></a>
### parts.every callback (32:56)

Synchronous function. Lexically inside [names.filter callback (30:65)](#fn-2279). Passed to <code>parts.every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L32](#l32) Implicitly return: evaluate <code>part===actual[i] &#124;&#124; /^\{[^{}]+\}$/.test(part) &amp;&amp; !!actual[i]</code> left to right with truthy short-circuiting.

<a id="fn-4498"></a>
### [...parameters.values()].filter callback (59:49)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>[...parameters.values()].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>{value:p}</code>: destructure the supplied value into these local bindings.

Execution:

[L59](#l59) Implicitly return: evaluate <code>p.in==='query' &amp;&amp; p.required===true &amp;&amp; !url.searchParams.has(p.name as string) &amp;&amp; !call.queryNames?.includes(p.name as string)</code> left to right with falsy short-circuiting.

<a id="fn-4745"></a>
### missing.map callback (60:106)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>missing.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: read <code>p.value.name</code>.

<a id="fn-4785"></a>
### missing.map callback (60:146)

Synchronous function. Lexically inside [compare (16:1)](#fn-980). Passed to <code>missing.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L60](#l60) Implicitly return: read <code>p.at</code>.

<a id="fn-4980"></a>
### auditContracts (64:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>input:ConfigInput={}</code>: when omitted/undefined, initialize with <code>{}</code>.
- <code>scope?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>access:ReferenceAccess={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L65](#l65) <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L65](#l65) <code>results:ContractResult[]</code>: create a new empty array to accumulate ordered results.
- [L66](#l66) <code>binding</code>: receive the next iterable value from <code>config.contracts</code> at the start of each loop iteration.
- [L67](#l67) <code>files</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(binding.files)].filter(path=&gt;!scope &#124;&#124; scope.includes(path))</code>.
- [L69](#l69) <code>result:ContractResult</code>: create an object with 7 property/spread entries: <code>{id:binding.id,resourceId:binding.resourceId,state:'checked',scope:'literal-http-calls-only',issues:[],files:[],calls:[]}</code>; later properties overwrite earlier spread values.
- [L71](#l71) <code>resource</code>: return the first matching element, or undefined: <code>config.resources.find(item=&gt;item.id===binding.resourceId)</code>.
- [L74](#l74) <code>references</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:[resource]},files,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L75](#l75) <code>snapshot</code>: read <code>references.snapshots[0]</code>.
- [L76](#l76) <code>provider</code>: read <code>references.report.resources[0]</code>; the TypeScript assertion adds no runtime validation.
- [L79](#l79) <code>index</code>: call the named operation with the supplied arguments: <code>indexOpenApi(snapshot)</code>.
- [L82](#l82) <code>versionProblem</code>: call the named operation with the supplied arguments: <code>versionIssue(index.apiVersion,binding.expectedVersion,binding.versionRange,resource.version)</code>.
- [L84](#l84) <code>document</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(snapshot.content)</code>; the TypeScript assertion adds no runtime validation.
- [L85](#l85) <code>loaded</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=&gt;({id:'source'+i,path,kind:'source' as const}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L86](#l86) <code>record</code>: receive the next iterable value from <code>loaded.report.resources</code> at the start of each loop iteration.
- [L87](#l87) <code>adapter</code>: call the named operation with the supplied arguments: <code>contractAdapterFor(record.path)</code>.
- [L88](#l88) <code>file:ContractResult['files'][number]</code>: create an object with 5 property/spread entries: <code>{path:record.path,sha256:record.sha256,status:record.status,callCount:0, ...(adapter?{adapter:adapter.id,language:adapter.language}:{})}</code>; later properties overwrite earlier spread values.
- [L92](#l92) <code>source</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(item=&gt;item.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
- [L93](#l93) <code>extracted</code>: call the named operation with the supplied arguments: <code>adapter.extract(source.content,record.path)</code>.
- [L97](#l97) <code>call</code>: receive the next iterable value from <code>extracted.calls</code> at the start of each loop iteration.
- [L98](#l98) <code>comparison</code>: call the named operation with the supplied arguments: <code>compare(call,binding.baseUrl,document.paths)</code>.

Execution:

- [L65](#l65) Bind <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L65](#l65) Bind <code>results:ContractResult[]</code>: create a new empty array to accumulate ordered results.
- [L66](#l66) Iterate <code>config.contracts</code> values, binding <code>const binding</code> for each iteration:
  - [L67](#l67) Bind <code>files</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(binding.files)].filter(path=&gt;!scope &#124;&#124; scope.includes(path))</code>.
  - [L68](#l68) If <code>!files.length</code> is truthy:
    - [L68](#l68) Skip the rest of this iteration and advance the enclosing loop.
  - [L69](#l69) Bind <code>result:ContractResult</code>: create an object with 7 property/spread entries: <code>{id:binding.id,resourceId:binding.resourceId,state:'checked',scope:'literal-http-calls-only',issues:[],files:[],calls:[]}</code>; later properties overwrite earlier spread values.
  - [L70](#l70) append values to the existing array: <code>results.push(result)</code>.
  - [L71](#l71) Bind <code>resource</code>: return the first matching element, or undefined: <code>config.resources.find(item=&gt;item.id===binding.resourceId)</code>.
  - [L72](#l72) If <code>!resource &#124;&#124; resource.kind!=='openapi'</code> is truthy:
    - [L72](#l72) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L72](#l72) append values to the existing array: <code>result.issues.push('Binding requires a configured OpenAPI resource.')</code>.
    - [L72](#l72) Skip the rest of this iteration and advance the enclosing loop.
  - [L73](#l73) If <code>files.some(path=&gt;!resource.appliesTo.some(pattern=&gt;matchesPattern(path,pattern)))</code> is truthy:
    - [L73](#l73) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L73](#l73) append values to the existing array: <code>result.issues.push('Mapped files are outside reference appliesTo scope.')</code>.
    - [L73](#l73) Skip the rest of this iteration and advance the enclosing loop.
  - [L74](#l74) Bind <code>references</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:[resource]},files,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L75](#l75) Bind <code>snapshot</code>: read <code>references.snapshots[0]</code>.
  - [L76](#l76) Bind <code>provider</code>: read <code>references.report.resources[0]</code>; the TypeScript assertion adds no runtime validation.
  - [L77](#l77) update <code>result.reference</code> with <code>{path:provider.path,sha256:provider.sha256,...(provider.origin?{origin:provider.origin}:{})}</code> using <code>=</code>; this mutation is visible to later statements.
  - [L78](#l78) If <code>!snapshot</code> is truthy:
    - [L78](#l78) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L78](#l78) append values to the existing array: <code>result.issues.push('Contract '+references.report.resources[0]!.status)</code>.
    - [L78](#l78) Skip the rest of this iteration and advance the enclosing loop.
  - [L79](#l79) Bind <code>index</code>: call the named operation with the supplied arguments: <code>indexOpenApi(snapshot)</code>.
  - [L80](#l80) If <code>index.apiVersion!==undefined</code> is truthy:
    - [L80](#l80) update <code>result.reference.apiVersion</code> with <code>index.apiVersion</code> using <code>=</code>; this mutation is visible to later statements.
  - [L81](#l81) If <code>index.status!=='indexed'</code> is truthy:
    - [L81](#l81) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L81](#l81) append values to the existing array: <code>result.issues.push('Contract index '+index.status,...index.issues.map(issue=&gt;issue.pointer+': '+issue.reason))</code>.
    - [L81](#l81) Skip the rest of this iteration and advance the enclosing loop.
  - [L82](#l82) Bind <code>versionProblem</code>: call the named operation with the supplied arguments: <code>versionIssue(index.apiVersion,binding.expectedVersion,binding.versionRange,resource.version)</code>.
  - [L83](#l83) If <code>versionProblem</code> is truthy:
    - [L83](#l83) update <code>result.state</code> with <code>'version-mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L83](#l83) append values to the existing array: <code>result.issues.push(versionProblem)</code>.
    - [L83](#l83) Skip the rest of this iteration and advance the enclosing loop.
  - [L84](#l84) Bind <code>document</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>JSON.parse(snapshot.content)</code>; the TypeScript assertion adds no runtime validation.
  - [L85](#l85) Bind <code>loaded</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=&gt;({id:'source'+i,path,kind:'source' as const}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L86](#l86) Iterate <code>loaded.report.resources</code> values, binding <code>const record</code> for each iteration:
    - [L87](#l87) Bind <code>adapter</code>: call the named operation with the supplied arguments: <code>contractAdapterFor(record.path)</code>.
    - [L88](#l88) Bind <code>file:ContractResult['files'][number]</code>: create an object with 5 property/spread entries: <code>{path:record.path,sha256:record.sha256,status:record.status,callCount:0, ...(adapter?{adapter:adapter.id,language:adapter.language}:{})}</code>; later properties overwrite earlier spread values.
    - [L89](#l89) append values to the existing array: <code>result.files.push(file)</code>.
    - [L90](#l90) If <code>record.status!=='loaded'</code> is truthy:
      - [L90](#l90) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L90](#l90) Skip the rest of this iteration and advance the enclosing loop.
    - [L91](#l91) If <code>!adapter</code> is truthy:
      - [L91](#l91) update <code>file.status</code> with <code>'unsupported-language'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L91](#l91) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L91](#l91) Skip the rest of this iteration and advance the enclosing loop.
    - [L92](#l92) Bind <code>source</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(item=&gt;item.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
    - [L93](#l93) Bind <code>extracted</code>: call the named operation with the supplied arguments: <code>adapter.extract(source.content,record.path)</code>.
    - [L94](#l94) update <code>file.callCount</code> with <code>extracted.calls.length</code> using <code>=</code>; this mutation is visible to later statements.
    - [L95](#l95) If <code>!extracted.calls.length</code> is truthy:
      - [L95](#l95) update <code>file.status</code> with <code>'no-supported-calls'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L95](#l95) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L95](#l95) append values to the existing array: <code>result.issues.push(record.path+': no supported calls extracted; this is not a clean contract assessment.')</code>.
    - [L96](#l96) If <code>extracted.issues.length</code> is truthy:
      - [L96](#l96) append values to the existing array: <code>result.issues.push(...extracted.issues.map(issue=&gt;record.path+': '+issue))</code>.
      - [L96](#l96) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L97](#l97) Iterate <code>extracted.calls</code> values, binding <code>const call</code> for each iteration:
      - [L98](#l98) Bind <code>comparison</code>: call the named operation with the supplied arguments: <code>compare(call,binding.baseUrl,document.paths)</code>.
      - [L99](#l99) append values to the existing array: <code>result.calls.push({path:record.path,adapter:adapter.id,...call,observationKind:call.observationKind ?? 'request-call',...comparison})</code>.
      - [L100](#l100) If <code>comparison.status==='unresolved' &#124;&#124; comparison.status==='outside-service'</code> is truthy:
        - [L100](#l100) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
- [L104](#l104) Return to the caller: evaluate <code>results</code>.

<a id="fn-5287"></a>
### [...new Set(binding.files)].filter callback (67:52)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>[...new Set(binding.files)].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L67](#l67) Implicitly return: evaluate <code>!scope &#124;&#124; scope.includes(path)</code> left to right with truthy short-circuiting.

<a id="fn-5579"></a>
### config.resources.find callback (71:42)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>config.resources.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: compute <code>item.id===binding.resourceId</code> with the <code>===</code> operator.

<a id="fn-5789"></a>
### files.some callback (73:19)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L73](#l73) Implicitly return: apply <code>!</code> to <code>resource.appliesTo.some(pattern=&gt;matchesPattern(path,pattern))</code>.

<a id="fn-5820"></a>
### resource.appliesTo.some callback (73:50)

Synchronous function. Lexically inside [files.some callback (73:19)](#fn-5789). Passed to <code>resource.appliesTo.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L73](#l73) Implicitly return: call the named operation with the supplied arguments: <code>matchesPattern(path,pattern)</code>.

<a id="fn-6720"></a>
### index.issues.map callback (81:131)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>index.issues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L81](#l81) Implicitly return: compute <code>issue.pointer+': '+issue.reason</code> with the <code>+</code> operator.

<a id="fn-7211"></a>
### files.map callback (85:137)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L85](#l85) Implicitly return: create an object with 3 property/spread entries: <code>{id:'source'+i,path,kind:'source' as const}</code>; later properties overwrite earlier spread values.

<a id="fn-7792"></a>
### loaded.snapshots.find callback (92:42)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>loaded.snapshots.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L92](#l92) Implicitly return: compute <code>item.record.id===record.id</code> with the <code>===</code> operator.

<a id="fn-8216"></a>
### extracted.issues.map callback (96:78)

Synchronous function. Lexically inside [auditContracts (64:8)](#fn-4980). Passed to <code>extracted.issues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L96](#l96) Implicitly return: compute <code>record.path+': '+issue</code> with the <code>+</code> operator.

## Compile-time data contracts

### Comparison

```typescript
type Comparison=Pick<ContractResult['calls'][number],'status'|'reason'|'contractPointers'>;
```

Declared at [L12](#l12). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L10](#l10) <code>object</code>: create [object (10:14)](#fn-501); its body runs when called, not when this value is created.
- [L11](#l11) <code>pointer</code>: create [pointer (11:15)](#fn-605); its body runs when called, not when this value is created.
- [L13](#l13) <code>outcome</code>: create [outcome (13:15)](#fn-765); its body runs when called, not when this value is created.

## Directly importing tests

- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)
- [contract-audit.test.ts](../../test/contract-audit.test.ts)
- [external-references.test.ts](../../test/external-references.test.ts)
- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)

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
<a id="l11"></a>
<a id="l12"></a>
<a id="l13"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {configSchema,matchesPattern,type ConfigInput} from './config.js';
   2 | import {loadReferenceResources} from './reference-resources.js';
   3 | import {indexOpenApi} from './openapi-contract.js';
   4 | import type {CallObservation} from './contract-adapter-types.js';
   5 | import {contractAdapterFor} from './contract-adapters.js';
   6 | import {type ContractResult} from './contract-contracts.js';
   7 | import type {ReferenceAccess} from './reference-access.js';
   8 | import {versionIssue} from './version-policy.js';
   9 | 
  10 | const object=(v:unknown):v is Record<string,unknown>=>!!v && typeof v==='object' && !Array.isArray(v);
  11 | const pointer=(v:string)=>v.replace(/~/g,'~0').replace(/\//g,'~1');
  12 | type Comparison=Pick<ContractResult['calls'][number],'status'|'reason'|'contractPointers'>;
  13 | const outcome=(status:Comparison['status'],reason:string,contractPointers:string[]=[]):Comparison=>({status,reason,contractPointers});
  14 | 
  15 | /** Compare only method, route and required query-name presence; never execute a request. */
  16 | function compare(call:CallObservation,baseUrl:string,paths:Record<string,unknown>):Comparison {
  17 |   if(call.reason)return outcome('unresolved',call.reason);
  18 |   // Relative URLs depend on the runtime document URL, not the configured service URL.
  19 |   let url:URL;try{url=new URL(call.url!);}catch{return outcome('unresolved','relative-or-invalid-url');}
  20 |   const base=new URL(baseUrl);const prefix=base.pathname.replace(/\/$/,'');
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
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   if(url.username || url.password)return outcome('unresolved','credential-bearing-url');
  22 |   if(url.origin!==base.origin || !(url.pathname===prefix || url.pathname.startsWith(prefix+'/')))
  23 |     return outcome('outside-service','URL is outside the configured service base.');
  24 |   if(!['GET','POST','PUT','DELETE','HEAD','OPTIONS','PATCH'].includes(call.method!))return outcome('unresolved','unsupported-method');
  25 |   const route=url.pathname.slice(prefix.length) || '/';
  26 |   if(route.includes('%'))return outcome('unresolved','encoded-path');
  27 |   const names=Object.keys(paths).filter(path=>path.startsWith('/'));
  28 |   const supported=(path:string)=>path.split('/').every(part=>!/[{}]/.test(part) || /^\{[^{}/]+\}$/.test(part));
  29 |   if(names.some(path=>!supported(path)))return outcome('unresolved','unsupported-path-template');
  30 |   const matches=Object.hasOwn(paths,route)?[route]:names.filter(path=>{
  31 |     const parts=path.split('/'),actual=route.split('/');
  32 |     return parts.length===actual.length && parts.every((part,i)=>part===actual[i] || /^\{[^{}]+\}$/.test(part) && !!actual[i]);
  33 |   });
  34 |   if(matches.length>1)return outcome('unresolved','ambiguous-path-template');
  35 |   if(!matches.length)return outcome('mismatch','Route is absent from the configured contract.',['/paths']);
  36 |   const path=matches[0]!,at='/paths/'+pointer(path),item=paths[path];
  37 |   if(!object(item))return outcome('unresolved','invalid-path-item');
  38 |   const method=call.method!.toLowerCase(),operation=item[method];
  39 |   if(!Object.hasOwn(item,method))return outcome('mismatch','Method is absent for the matched route.',[at]);
  40 |   if(!object(operation))return outcome('unresolved','invalid-operation');
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
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   const parameters=new Map<string,{value:Record<string,unknown>;at:string}>();
  42 |   for(const [owner,location] of [[item,at],[operation,at+'/'+method]] as const) {
  43 |     if(owner.parameters===undefined)continue;
  44 |     if(!Array.isArray(owner.parameters))return outcome('unresolved','unsupported-parameters',[location]);
  45 |     const seen=new Set<string>();
  46 |     for(const [i,param] of owner.parameters.entries()) {
  47 |       if(!object(param) || '$ref' in param || typeof param.name!=='string' || !['query','path','header','cookie'].includes(String(param.in)) || (param.required!==undefined && typeof param.required!=='boolean'))
  48 |         return outcome('unresolved','unsupported-parameter-definition',[location+'/parameters']);
  49 |       const key=param.in+':'+param.name;
  50 |       if(seen.has(key))return outcome('unresolved','duplicate-parameter',[location+'/parameters']);
  51 |       seen.add(key);parameters.set(key,{value:param,at:location+'/parameters/'+i});
  52 |     }
  53 |   }
  54 |   // Serialization such as deepObject may require names other than the declared name.
  55 |   for(const {value:p,at:location} of parameters.values())if(p.in==='query' && p.required===true) {
  56 |     if(p.content!==undefined || !object(p.schema) || !['string','number','integer','boolean'].includes(String(p.schema.type)) || (p.style!==undefined && p.style!=='form'))
  57 |       return outcome('unresolved','unsupported-required-query-serialization',[location]);
  58 |   }
  59 |   const missing=[...parameters.values()].filter(({value:p})=>p.in==='query' && p.required===true && !url.searchParams.has(p.name as string) && !call.queryNames?.includes(p.name as string));
  60 |   if(missing.length)return outcome('mismatch','Required query parameter names are missing: '+missing.map(p=>p.value.name).join(', '),missing.map(p=>p.at));
```

<a id="l61"></a>
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
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   return outcome('matched','Method, route and supported required query-name presence match; values, bodies, responses and authentication are not assessed.',[at+'/'+method]);
  62 | }
  63 | 
  64 | export async function auditContracts(root:string,input:ConfigInput={},scope?:readonly string[],access:ReferenceAccess={}):Promise<ContractResult[]> {
  65 |   const config=configSchema.parse(input),results:ContractResult[]=[];
  66 |   for(const binding of config.contracts) {
  67 |     const files=[...new Set(binding.files)].filter(path=>!scope || scope.includes(path));
  68 |     if(!files.length)continue;
  69 |     const result:ContractResult={id:binding.id,resourceId:binding.resourceId,state:'checked',scope:'literal-http-calls-only',issues:[],files:[],calls:[]};
  70 |     results.push(result);
  71 |     const resource=config.resources.find(item=>item.id===binding.resourceId);
  72 |     if(!resource || resource.kind!=='openapi'){result.state='unavailable';result.issues.push('Binding requires a configured OpenAPI resource.');continue;}
  73 |     if(files.some(path=>!resource.appliesTo.some(pattern=>matchesPattern(path,pattern)))){result.state='unavailable';result.issues.push('Mapped files are outside reference appliesTo scope.');continue;}
  74 |     const references=await loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:[resource]},files,access);
  75 |     const snapshot=references.snapshots[0];
  76 |     const provider=references.report.resources[0]!;
  77 |     result.reference={path:provider.path,sha256:provider.sha256,...(provider.origin?{origin:provider.origin}:{})};
  78 |     if(!snapshot){result.state='unavailable';result.issues.push('Contract '+references.report.resources[0]!.status);continue;}
  79 |     const index=indexOpenApi(snapshot);
  80 |     if(index.apiVersion!==undefined)result.reference.apiVersion=index.apiVersion;
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
  81 |     if(index.status!=='indexed'){result.state='unavailable';result.issues.push('Contract index '+index.status,...index.issues.map(issue=>issue.pointer+': '+issue.reason));continue;}
  82 |     const versionProblem=versionIssue(index.apiVersion,binding.expectedVersion,binding.versionRange,resource.version);
  83 |     if(versionProblem){result.state='version-mismatch';result.issues.push(versionProblem);continue;}
  84 |     const document=JSON.parse(snapshot.content) as {paths:Record<string,unknown>};
  85 |     const loaded=await loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=>({id:'source'+i,path,kind:'source' as const}))});
  86 |     for(const record of loaded.report.resources) {
  87 |       const adapter=contractAdapterFor(record.path);
  88 |       const file:ContractResult['files'][number]={path:record.path,sha256:record.sha256,status:record.status,callCount:0,
  89 |         ...(adapter?{adapter:adapter.id,language:adapter.language}:{})};result.files.push(file);
  90 |       if(record.status!=='loaded'){result.state='partial';continue;}
  91 |       if(!adapter){file.status='unsupported-language';result.state='partial';continue;}
  92 |       const source=loaded.snapshots.find(item=>item.record.id===record.id)!;
  93 |       const extracted=adapter.extract(source.content,record.path);
  94 |       file.callCount=extracted.calls.length;
  95 |       if(!extracted.calls.length){file.status='no-supported-calls';result.state='partial';result.issues.push(record.path+': no supported calls extracted; this is not a clean contract assessment.');}
  96 |       if(extracted.issues.length){result.issues.push(...extracted.issues.map(issue=>record.path+': '+issue));result.state='partial';}
  97 |       for(const call of extracted.calls) {
  98 |         const comparison=compare(call,binding.baseUrl,document.paths);
  99 |         result.calls.push({path:record.path,adapter:adapter.id,...call,observationKind:call.observationKind ?? 'request-call',...comparison});
 100 |         if(comparison.status==='unresolved' || comparison.status==='outside-service')result.state='partial';
```

<a id="l104"></a>

```text
 101 |       }
 102 |     }
 103 |   }
 104 |   return results;
 105 | }
 106 | 
```
