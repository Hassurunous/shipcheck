# src/reference-resources.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

loadReferenceResources processes definitions in order under per-file and aggregate byte budgets. It filters applicability and exclusions before reading, establishes external grants, hashes raw bytes, rejects likely credentials and checks pins. Only successfully loaded snapshots contain text. verifyResourceEvidence requires the submitted identity/hash and a matching fresh snapshot, origin, metadata and exact complete-line excerpt.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `bbbcf7fc5fbae2ba2167bebe8f12e9405a687fce4959444f0acbced679986a64`.

This chapter inventories **12 function bodies/callbacks**, **35 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./ignore-policy.js</code>: <code>createIgnorePolicy</code>, <code>IgnorePolicy</code> (type only).
- <code>node:fs/promises</code>: <code>fs</code>.
- <code>node:path</code>: <code>join</code>, <code>relative</code>.
- <code>node:crypto</code>: <code>createHash</code>.
- <code>zod</code>: <code>z</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>isExcluded</code>, <code>matchesPattern</code>, <code>ConfigInput</code> (type only).
- <code>./filesystem-policy.js</code>: <code>validateRoot</code>.
- <code>./sensitive-content.js</code>: <code>sensitiveName</code>, <code>sensitiveContent</code>.
- <code>./resource-contracts.js</code>: <code>referencesSchema</code>, <code>resourceEvidenceSchema</code>, <code>ResourceRecord</code> (type only).
- <code>./reference-access.js</code>: <code>referenceAccessSchema</code>, <code>ReferenceAccess</code> (type only).
- <code>./remote-reference.js</code>: <code>readRemoteReference</code>.

## Module execution

- [L13](#l13) Bind <code>MAX_RESOURCE_BYTES</code>: use the literal <code>65536</code>.
- [L14](#l14) Bind <code>MAX_REFERENCE_BYTES</code>: use the literal <code>262144</code>.
- [L17](#l17) Execute <code>class ResourceFailure extends Error {constructor(public status:ResourceRecord['status']){super(status);}}</code>; see the exact listing for its full syntax.
- [L18](#l18) Bind <code>intrinsicallyExcluded</code>: create [intrinsicallyExcluded (18:29)](#fn-1053); its body runs when called, not when this value is created.

## Function index

- [constructor (17:38)](#fn-956)
- [intrinsicallyExcluded (18:29)](#fn-1053)
- [path.split('/').some callback (18:65)](#fn-1089)
- [readResource (19:1)](#fn-1157)
- [loadReferenceResources (46:8)](#fn-2878)
- [paths.some callback (59:29)](#fn-3792)
- [resource.appliesTo.some callback (59:59)](#fn-3822)
- [resource.path.split('/').some callback (61:38)](#fn-4069)
- [records.some callback (89:61)](#fn-6120)
- [verifyResourceEvidence (94:8)](#fn-6388)
- [submitted.find callback (98:33)](#fn-6728)
- [current.find callback (99:28)](#fn-6841)

<a id="fn-956"></a>
### constructor (17:38)

Synchronous function. Defined in module scope. 

Parameters:

- <code>public status:ResourceRecord['status']</code>: constructor parameter property: receive the argument and initialize the corresponding instance property.

Execution:

- [L17](#l17) call the named operation with the supplied arguments: <code>super(status)</code>.

<a id="fn-1053"></a>
### intrinsicallyExcluded (18:29)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>path.split('/').some(part=&gt;part.toLowerCase()==='.git' &#124;&#124; /^\.env(?:\.&#124;$)/i.test(part))</code>.

<a id="fn-1089"></a>
### path.split('/').some callback (18:65)

Synchronous function. Lexically inside [intrinsicallyExcluded (18:29)](#fn-1053). Passed to <code>path.split('/').some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L18](#l18) Implicitly return: evaluate <code>part.toLowerCase()==='.git' &#124;&#124; /^\.env(?:\.&#124;$)/i.test(part)</code> left to right with truthy short-circuiting.

<a id="fn-1157"></a>
### readResource (19:1)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>path:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>limit:number</code>: supplied by the caller; usage is shown in the steps below.
- <code>exclude:string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>policy?:IgnorePolicy</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L20](#l20) <code>current</code>: evaluate <code>root</code>.
- [L21](#l21) <code>part</code>: receive the next iterable value from <code>path.split('/')</code> at the start of each loop iteration.
- [L23](#l23) <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L25](#l25) <code>actual</code>: produce a string with matching text replaced: <code>relative(root,await fs.realpath(current)).replace(/\\/g,'/')</code>.
- [L28](#l28) <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L31](#l31) <code>handle</code>: wait for <code>fs.open(current,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L34](#l34) <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(limit+1)</code>.
- [L34](#l34) <code>size</code>: use the literal <code>0</code>.
- [L35](#l35) <code>read</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L37](#l37) <code>bytes</code>: call the named operation with the supplied arguments: <code>buffer.subarray(0,size)</code>.
- [L39](#l39) <code>content:string</code>: leave the value undefined until a later assignment.

Execution:

- [L20](#l20) Bind <code>current</code>: evaluate <code>root</code>.
- [L21](#l21) Iterate <code>path.split('/')</code> values, binding <code>const part</code> for each iteration:
  - [L22](#l22) update <code>current</code> with <code>join(current,part)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L23](#l23) Bind <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L24](#l24) If <code>stat.isSymbolicLink()</code> is truthy:
    - [L24](#l24) Throw <code>new ResourceFailure('linked')</code>; normal execution stops until an enclosing catch handles it.
  - [L25](#l25) Bind <code>actual</code>: produce a string with matching text replaced: <code>relative(root,await fs.realpath(current)).replace(/\\/g,'/')</code>.
  - [L26](#l26) If <code>actual==='..' &#124;&#124; actual.startsWith('../') &#124;&#124; intrinsicallyExcluded(actual) &#124;&#124; isExcluded(actual,exclude) &#124;&#124; await policy?.reason(actual,stat.isDirectory(),false)</code> is truthy:
    - [L26](#l26) Throw <code>new ResourceFailure('excluded')</code>; normal execution stops until an enclosing catch handles it.
- [L28](#l28) Bind <code>stat</code>: wait for <code>fs.lstat(current)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L29](#l29) If <code>!stat.isFile()</code> is truthy:
  - [L29](#l29) Throw <code>new ResourceFailure('non-regular')</code>; normal execution stops until an enclosing catch handles it.
- [L30](#l30) If <code>stat.size&gt;limit</code> is truthy:
  - [L30](#l30) Throw <code>new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit')</code>; normal execution stops until an enclosing catch handles it.
- [L31](#l31) Bind <code>handle</code>: wait for <code>fs.open(current,'r')</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L32](#l32) Run the protected block:
  - [L33](#l33) If <code>!(await handle.stat()).isFile()</code> is truthy:
    - [L33](#l33) Throw <code>new ResourceFailure('non-regular')</code>; normal execution stops until an enclosing catch handles it.
  - [L34](#l34) Bind <code>buffer</code>: call the named operation with the supplied arguments: <code>Buffer.alloc(limit+1)</code>.
  - [L34](#l34) Bind <code>size</code>: use the literal <code>0</code>.
  - [L35](#l35) Repeat while <code>size&lt;buffer.length</code>:
    - [L35](#l35) Bind <code>read</code>: wait for <code>handle.read(buffer,size,buffer.length-size,null)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
    - [L35](#l35) If <code>!read.bytesRead</code> is truthy:
      - [L35](#l35) Leave the enclosing loop/switch.
    - [L35](#l35) update <code>size</code> with <code>read.bytesRead</code> using <code>+=</code>; this mutation is visible to later statements.
  - [L36](#l36) If <code>size&gt;limit</code> is truthy:
    - [L36](#l36) Throw <code>new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit')</code>; normal execution stops until an enclosing catch handles it.
  - [L37](#l37) Bind <code>bytes</code>: call the named operation with the supplied arguments: <code>buffer.subarray(0,size)</code>.
  - [L38](#l38) If <code>bytes.includes(0)</code> is truthy:
    - [L38](#l38) Throw <code>new ResourceFailure('invalid-text')</code>; normal execution stops until an enclosing catch handles it.
  - [L39](#l39) Bind <code>content:string</code>: leave the value undefined until a later assignment.
  - [L40](#l40) Run the protected block:
    - [L40](#l40) update <code>content</code> with <code>new TextDecoder('utf-8',{fatal:true}).decode(bytes)</code> using <code>=</code>; this mutation is visible to later statements.
  - [L40](#l40) If it throws:
    - [L40](#l40) Throw <code>new ResourceFailure('invalid-text')</code>; normal execution stops until an enclosing catch handles it.
  - [L41](#l41) Return to the caller: create an object with 3 property/spread entries: <code>{content,bytes:size,sha256:createHash('sha256').update(bytes).digest('hex')}</code>; later properties overwrite earlier spread values.
- [L32](#l32) Always run cleanup on leaving the try/catch, including return or throw:
  - [L42](#l42) wait for <code>handle.close()</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

<a id="fn-2878"></a>
### loadReferenceResources (46:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>target:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>options:ConfigInput={}</code>: when omitted/undefined, initialize with <code>{}</code>.
- <code>paths?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>access:ReferenceAccess={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L47](#l47) <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L47](#l47) <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>.
- [L48](#l48) <code>grants</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>referenceAccessSchema.parse(access)</code>.
- [L49](#l49) <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,config)</code>.
- [L50](#l50) <code>records:ResourceRecord[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) <code>snapshots:ResourceSnapshot[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) <code>consumed</code>: use the literal <code>0</code>.
- [L51](#l51) <code>resource</code>: receive the next iterable value from <code>config.resources</code> at the start of each loop iteration.
- [L52](#l52) <code>record:ResourceRecord</code>: create an object with 5 property/spread entries: <code>{...resource,status:'loaded',sha256:null,bytes:0,lines:0}</code>; later properties overwrite earlier spread values.
- [L64](#l64) <code>sourceRoot</code>: evaluate <code>root</code>.
- [L65](#l65) <code>limit</code>: call the named operation with the supplied arguments: <code>Math.min(MAX_RESOURCE_BYTES,MAX_REFERENCE_BYTES-consumed)</code>.
- [L67](#l67) <code>granted</code>: test <code>Object.hasOwn(grants.roots,resource.rootId)</code>; choose <code>grants.roots[resource.rootId]</code> when truthy, otherwise <code>undefined</code>.
- [L72](#l72) <code>read</code>: leave the value undefined until a later assignment.
- [L75](#l75) <code>bytes:Buffer</code>: leave the value undefined until a later assignment.
- [L79](#l79) <code>content:string</code>: leave the value undefined until a later assignment.

Execution:

- [L47](#l47) Bind <code>root</code>: wait for <code>validateRoot(target)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L47](#l47) Bind <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>.
- [L48](#l48) Bind <code>grants</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>referenceAccessSchema.parse(access)</code>.
- [L49](#l49) Bind <code>policy</code>: call the named operation with the supplied arguments: <code>createIgnorePolicy(root,config)</code>.
- [L50](#l50) Bind <code>records:ResourceRecord[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) Bind <code>snapshots:ResourceSnapshot[]</code>: create a new empty array to accumulate ordered results.
- [L50](#l50) Bind <code>consumed</code>: use the literal <code>0</code>.
- [L51](#l51) Iterate <code>config.resources</code> values, binding <code>const resource</code> for each iteration:
  - [L52](#l52) Bind <code>record:ResourceRecord</code>: create an object with 5 property/spread entries: <code>{...resource,status:'loaded',sha256:null,bytes:0,lines:0}</code>; later properties overwrite earlier spread values.
  - [L53](#l53) If <code>resource.rootId &#124;&#124; resource.url</code> is truthy:
    - [L54](#l54) update <code>record.path</code> with <code>&#96;@references/${resource.id}/${resource.path}&#96;</code> using <code>=</code>; this mutation is visible to later statements.
    - [L55](#l55) update <code>record.origin</code> with <code>{kind:resource.rootId?'external-root':'https',path:resource.path, ...(resource.rootId?{rootId:resource.rootId}:{}),...(resource.url?{url:resource.url}:{})}</code> using <code>=</code>; this mutation is visible to later statements.
  - [L58](#l58) append values to the existing array: <code>records.push(record)</code>.
  - [L59](#l59) If <code>paths &amp;&amp; !paths.some(path=&gt;resource.appliesTo.some(pattern=&gt;matchesPattern(path,pattern)))</code> is truthy:
    - [L59](#l59) update <code>record.status</code> with <code>'not-applicable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L59](#l59) Skip the rest of this iteration and advance the enclosing loop.
  - [L60](#l60) If <code>isExcluded(resource.path,config.exclude) &#124;&#124; intrinsicallyExcluded(resource.path)</code> is truthy:
    - [L60](#l60) update <code>record.status</code> with <code>'excluded'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L60](#l60) Skip the rest of this iteration and advance the enclosing loop.
  - [L61](#l61) If <code>resource.path.split('/').some(part=&gt;sensitiveName.test(part))</code> is truthy:
    - [L61](#l61) update <code>record.status</code> with <code>'sensitive-content'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L61](#l61) Skip the rest of this iteration and advance the enclosing loop.
  - [L62](#l62) If <code>consumed&gt;=MAX_REFERENCE_BYTES</code> is truthy:
    - [L62](#l62) update <code>record.status</code> with <code>'total-size-limit'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L62](#l62) Skip the rest of this iteration and advance the enclosing loop.
  - [L63](#l63) Run the protected block:
    - [L64](#l64) Bind <code>sourceRoot</code>: evaluate <code>root</code>.
    - [L65](#l65) Bind <code>limit</code>: call the named operation with the supplied arguments: <code>Math.min(MAX_RESOURCE_BYTES,MAX_REFERENCE_BYTES-consumed)</code>.
    - [L66](#l66) If <code>resource.rootId</code> is truthy:
      - [L67](#l67) Bind <code>granted</code>: test <code>Object.hasOwn(grants.roots,resource.rootId)</code>; choose <code>grants.roots[resource.rootId]</code> when truthy, otherwise <code>undefined</code>.
      - [L68](#l68) If <code>!granted</code> is truthy:
        - [L68](#l68) Throw <code>new ResourceFailure('access-denied')</code>; normal execution stops until an enclosing catch handles it.
      - [L69](#l69) update <code>sourceRoot</code> with <code>await validateRoot(granted)</code> using <code>=</code>; this mutation is visible to later statements.
      - [L70](#l70) update <code>record.origin!.rootSha256</code> with <code>createHash('sha256').update(sourceRoot).digest('hex')</code> using <code>=</code>; this mutation is visible to later statements.
    - [L72](#l72) Bind <code>read</code>: leave the value undefined until a later assignment.
    - [L73](#l73) If <code>resource.url</code> is truthy:
      - [L74](#l74) If <code>!grants.origins.includes(new URL(resource.url).origin)</code> is truthy:
        - [L74](#l74) Throw <code>new ResourceFailure('access-denied')</code>; normal execution stops until an enclosing catch handles it.
      - [L75](#l75) Bind <code>bytes:Buffer</code>: leave the value undefined until a later assignment.
      - [L76](#l76) Run the protected block:
        - [L76](#l76) update <code>bytes</code> with <code>await readRemoteReference(resource.url,limit)</code> using <code>=</code>; this mutation is visible to later statements.
      - [L76](#l76) If it throws:
        - [L76](#l76) Throw <code>new ResourceFailure('remote-failed')</code>; normal execution stops until an enclosing catch handles it.
      - [L77](#l77) If <code>bytes.length&gt;limit</code> is truthy:
        - [L77](#l77) Throw <code>new ResourceFailure('file-size-limit')</code>; normal execution stops until an enclosing catch handles it.
      - [L78](#l78) If <code>bytes.includes(0)</code> is truthy:
        - [L78](#l78) Throw <code>new ResourceFailure('invalid-text')</code>; normal execution stops until an enclosing catch handles it.
      - [L79](#l79) Bind <code>content:string</code>: leave the value undefined until a later assignment.
      - [L79](#l79) Run the protected block:
        - [L79](#l79) update <code>content</code> with <code>new TextDecoder('utf-8',{fatal:true}).decode(bytes)</code> using <code>=</code>; this mutation is visible to later statements.
      - [L79](#l79) If it throws:
        - [L79](#l79) Throw <code>new ResourceFailure('invalid-text')</code>; normal execution stops until an enclosing catch handles it.
      - [L80](#l80) update <code>read</code> with <code>{content,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}</code> using <code>=</code>; this mutation is visible to later statements.
    - [L73](#l73) Otherwise:
      - [L81](#l81) update <code>read</code> with <code>await readResource(sourceRoot,resource.path,limit,config.exclude,resource.rootId?undefined:policy)</code> using <code>=</code>; this mutation is visible to later statements.
    - [L82](#l82) update <code>consumed</code> with <code>read.bytes</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L83](#l83) If <code>sensitiveContent.test(read.content)</code> is truthy:
      - [L83](#l83) update <code>record.status</code> with <code>'sensitive-content'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L83](#l83) Skip the rest of this iteration and advance the enclosing loop.
    - [L84](#l84) update <code>record.sha256</code> with <code>read.sha256</code> using <code>=</code>; this mutation is visible to later statements.
    - [L84](#l84) update <code>record.bytes</code> with <code>read.bytes</code> using <code>=</code>; this mutation is visible to later statements.
    - [L84](#l84) update <code>record.lines</code> with <code>read.content.split(/\r\n&#124;\n&#124;\r/).length</code> using <code>=</code>; this mutation is visible to later statements.
    - [L85](#l85) If <code>resource.expectedSha256 &amp;&amp; resource.expectedSha256!==read.sha256</code> is truthy:
      - [L85](#l85) update <code>record.status</code> with <code>'hash-mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L85](#l85) Skip the rest of this iteration and advance the enclosing loop.
    - [L86](#l86) append values to the existing array: <code>snapshots.push({record:{...record},content:read.content})</code>.
  - [L63](#l63) If it throws, bind <code>error</code>:
    - [L87](#l87) update <code>record.status</code> with <code>error instanceof ResourceFailure?error.status:(error as NodeJS.ErrnoException).code==='ENOENT'?'missing':'unreadable'</code> using <code>=</code>; this mutation is visible to later statements.
- [L89](#l89) Return to the caller: create an object with 2 property/spread entries: <code>{report:referencesSchema.parse({state:records.some(record=&gt;record.required &amp;&amp; !['loaded','not-applicable'].includes(record.status))?'incomplete':'ready', evaluation:'not-assessed',resources:records}),snapshots}</code>; later properties overwrite earlier spread values.

<a id="fn-3792"></a>
### paths.some callback (59:29)

Synchronous function. Lexically inside [loadReferenceResources (46:8)](#fn-2878). Passed to <code>paths.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L59](#l59) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>resource.appliesTo.some(pattern=&gt;matchesPattern(path,pattern))</code>.

<a id="fn-3822"></a>
### resource.appliesTo.some callback (59:59)

Synchronous function. Lexically inside [paths.some callback (59:29)](#fn-3792). Passed to <code>resource.appliesTo.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L59](#l59) Implicitly return: call the named operation with the supplied arguments: <code>matchesPattern(path,pattern)</code>.

<a id="fn-4069"></a>
### resource.path.split('/').some callback (61:38)

Synchronous function. Lexically inside [loadReferenceResources (46:8)](#fn-2878). Passed to <code>resource.path.split('/').some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L61](#l61) Implicitly return: evaluate a regular expression against the value: <code>sensitiveName.test(part)</code>.

<a id="fn-6120"></a>
### records.some callback (89:61)

Synchronous function. Lexically inside [loadReferenceResources (46:8)](#fn-2878). Passed to <code>records.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>record</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L89](#l89) Implicitly return: evaluate <code>record.required &amp;&amp; !['loaded','not-applicable'].includes(record.status)</code> left to right with falsy short-circuiting.

<a id="fn-6388"></a>
### verifyResourceEvidence (94:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>evidence:z.infer&lt;typeof resourceEvidenceSchema&gt;</code>: supplied by the caller; usage is shown in the steps below.
- <code>submitted:ResourceSnapshot[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>current:ResourceSnapshot[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L95](#l95) <code>parsed</code>: validate without throwing for schema failure, returning success/data or error: <code>resourceEvidenceSchema.safeParse(evidence)</code>.
- [L97](#l97) <code>item</code>: read <code>parsed.data</code>.
- [L98](#l98) <code>original</code>: return the first matching element, or undefined: <code>submitted.find(snapshot=&gt;snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded')</code>.
- [L99](#l99) <code>fresh</code>: return the first matching element, or undefined: <code>current.find(snapshot=&gt;snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded')</code>.
- [L100](#l100) <code>reason</code>: use the literal <code>'exact-line-match'</code>.
- [L108](#l108) <code>lines</code>: divide the string using the delimiter or regular expression: <code>fresh.content.split(/\r\n&#124;\n&#124;\r/)</code>.

Execution:

- [L95](#l95) Bind <code>parsed</code>: validate without throwing for schema failure, returning success/data or error: <code>resourceEvidenceSchema.safeParse(evidence)</code>.
- [L96](#l96) If <code>!parsed.success</code> is truthy:
  - [L96](#l96) Return to the caller: create an object with 2 property/spread entries: <code>{status:'rejected' as const,reason:'invalid-evidence'}</code>; later properties overwrite earlier spread values.
- [L97](#l97) Bind <code>item</code>: read <code>parsed.data</code>.
- [L98](#l98) Bind <code>original</code>: return the first matching element, or undefined: <code>submitted.find(snapshot=&gt;snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded')</code>.
- [L99](#l99) Bind <code>fresh</code>: return the first matching element, or undefined: <code>current.find(snapshot=&gt;snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded')</code>.
- [L100](#l100) Bind <code>reason</code>: use the literal <code>'exact-line-match'</code>.
- [L101](#l101) If <code>!original</code> is truthy:
  - [L101](#l101) update <code>reason</code> with <code>'not-in-submitted-resources'</code> using <code>=</code>; this mutation is visible to later statements.
- [L101](#l101) Otherwise:
  - [L102](#l102) If <code>item.snapshotSha256!==original.record.sha256</code> is truthy:
    - [L102](#l102) update <code>reason</code> with <code>'wrong-snapshot'</code> using <code>=</code>; this mutation is visible to later statements.
  - [L102](#l102) Otherwise:
    - [L103](#l103) If <code>!fresh</code> is truthy:
      - [L103](#l103) update <code>reason</code> with <code>'resource-unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L103](#l103) Otherwise:
      - [L104](#l104) If <code>fresh.record.sha256!==original.record.sha256 &#124;&#124; fresh.content!==original.content &#124;&#124; fresh.record.path!==original.record.path &#124;&#124; fresh.record.version!==original.record.version &#124;&#124; fresh.record.authority!==original.record.authority</code> is truthy:
        - [L105](#l105) update <code>reason</code> with <code>'resource-changed'</code> using <code>=</code>; this mutation is visible to later statements.
      - [L104](#l104) Otherwise:
        - [L106](#l106) If <code>JSON.stringify(fresh.record.origin)!==JSON.stringify(original.record.origin)</code> is truthy:
          - [L106](#l106) update <code>reason</code> with <code>'resource-origin-changed'</code> using <code>=</code>; this mutation is visible to later statements.
        - [L106](#l106) Otherwise:
          - [L108](#l108) Bind <code>lines</code>: divide the string using the delimiter or regular expression: <code>fresh.content.split(/\r\n&#124;\n&#124;\r/)</code>.
          - [L109](#l109) If <code>item.endLine&lt;item.startLine &#124;&#124; item.endLine&gt;lines.length</code> is truthy:
            - [L109](#l109) update <code>reason</code> with <code>'invalid-line-range'</code> using <code>=</code>; this mutation is visible to later statements.
          - [L109](#l109) Otherwise:
            - [L110](#l110) If <code>lines.slice(item.startLine-1,item.endLine).join('\n')!==item.excerpt.split(/\r\n&#124;\n&#124;\r/).join('\n')</code> is truthy:
              - [L110](#l110) update <code>reason</code> with <code>'excerpt-mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
- [L112](#l112) Return to the caller: create an object with 2 property/spread entries: <code>{status:reason==='exact-line-match'?'matched' as const:'rejected' as const,reason}</code>; later properties overwrite earlier spread values.

<a id="fn-6728"></a>
### submitted.find callback (98:33)

Synchronous function. Lexically inside [verifyResourceEvidence (94:8)](#fn-6388). Passed to <code>submitted.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>snapshot</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L98](#l98) Implicitly return: evaluate <code>snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded'</code> left to right with falsy short-circuiting.

<a id="fn-6841"></a>
### current.find callback (99:28)

Synchronous function. Lexically inside [verifyResourceEvidence (94:8)](#fn-6388). Passed to <code>current.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>snapshot</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L99](#l99) Implicitly return: evaluate <code>snapshot.record.id===item.resourceId &amp;&amp; snapshot.record.status==='loaded'</code> left to right with falsy short-circuiting.

## Compile-time data contracts

### ResourceSnapshot

```typescript
type ResourceSnapshot={record:ResourceRecord;content:string};
```

Declared at [L15](#l15). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### LoadedReferences

```typescript
type LoadedReferences={report:z.infer<typeof referencesSchema>;snapshots:ResourceSnapshot[]};
```

Declared at [L16](#l16). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L13](#l13) <code>MAX_RESOURCE_BYTES</code>: use the literal <code>65536</code>.
- [L14](#l14) <code>MAX_REFERENCE_BYTES</code>: use the literal <code>262144</code>.
- [L18](#l18) <code>intrinsicallyExcluded</code>: create [intrinsicallyExcluded (18:29)](#fn-1053); its body runs when called, not when this value is created.

## Directly importing tests

- [external-references.test.ts](../../test/external-references.test.ts)
- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
- [reference-resources.test.ts](../../test/reference-resources.test.ts)

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
<a id="l13"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {createIgnorePolicy,type IgnorePolicy} from './ignore-policy.js';
   2 | import * as fs from 'node:fs/promises';
   3 | import {join,relative} from 'node:path';
   4 | import {createHash} from 'node:crypto';
   5 | import {z} from 'zod';
   6 | import {configSchema,isExcluded,matchesPattern,type ConfigInput} from './config.js';
   7 | import {validateRoot} from './filesystem-policy.js';
   8 | import {sensitiveName,sensitiveContent} from './sensitive-content.js';
   9 | import {referencesSchema,resourceEvidenceSchema,type ResourceRecord} from './resource-contracts.js';
  10 | import {referenceAccessSchema,type ReferenceAccess} from './reference-access.js';
  11 | import {readRemoteReference} from './remote-reference.js';
  12 | 
  13 | export const MAX_RESOURCE_BYTES=65536;
  14 | export const MAX_REFERENCE_BYTES=262144;
  15 | export type ResourceSnapshot={record:ResourceRecord;content:string};
  16 | export type LoadedReferences={report:z.infer<typeof referencesSchema>;snapshots:ResourceSnapshot[]};
  17 | class ResourceFailure extends Error {constructor(public status:ResourceRecord['status']){super(status);}}
  18 | const intrinsicallyExcluded=(path:string)=>path.split('/').some(part=>part.toLowerCase()==='.git' || /^\.env(?:\.|$)/i.test(part));
  19 | async function readResource(root:string,path:string,limit:number,exclude:string[],policy?:IgnorePolicy) {
  20 |   let current=root;
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l28"></a>
<a id="l29"></a>
<a id="l30"></a>
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   for(const part of path.split('/')) {
  22 |     current=join(current,part);
  23 |     const stat=await fs.lstat(current);
  24 |     if(stat.isSymbolicLink())throw new ResourceFailure('linked');
  25 |     const actual=relative(root,await fs.realpath(current)).replace(/\\/g,'/');
  26 |     if(actual==='..' || actual.startsWith('../') || intrinsicallyExcluded(actual) || isExcluded(actual,exclude) || await policy?.reason(actual,stat.isDirectory(),false))throw new ResourceFailure('excluded');
  27 |   }
  28 |   const stat=await fs.lstat(current);
  29 |   if(!stat.isFile())throw new ResourceFailure('non-regular');
  30 |   if(stat.size>limit)throw new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit');
  31 |   const handle=await fs.open(current,'r');
  32 |   try {
  33 |     if(!(await handle.stat()).isFile())throw new ResourceFailure('non-regular');
  34 |     const buffer=Buffer.alloc(limit+1);let size=0;
  35 |     while(size<buffer.length) {const read=await handle.read(buffer,size,buffer.length-size,null);if(!read.bytesRead)break;size+=read.bytesRead;}
  36 |     if(size>limit)throw new ResourceFailure(limit===MAX_RESOURCE_BYTES?'file-size-limit':'total-size-limit');
  37 |     const bytes=buffer.subarray(0,size);
  38 |     if(bytes.includes(0))throw new ResourceFailure('invalid-text');
  39 |     let content:string;
  40 |     try {content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new ResourceFailure('invalid-text');}
```

<a id="l41"></a>
<a id="l42"></a>
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
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |     return {content,bytes:size,sha256:createHash('sha256').update(bytes).digest('hex')};
  42 |   } finally {await handle.close();}
  43 | }
  44 | 
  45 | /** In-memory snapshots only; external reads require separate runtime authorization. */
  46 | export async function loadReferenceResources(target:string,options:ConfigInput={},paths?:readonly string[],access:ReferenceAccess={}):Promise<LoadedReferences> {
  47 |   const root=await validateRoot(target);const config=configSchema.parse(options);
  48 |   const grants=referenceAccessSchema.parse(access);
  49 |   const policy=createIgnorePolicy(root,config);
  50 |   const records:ResourceRecord[]=[];const snapshots:ResourceSnapshot[]=[];let consumed=0;
  51 |   for(const resource of config.resources) {
  52 |     const record:ResourceRecord={...resource,status:'loaded',sha256:null,bytes:0,lines:0};
  53 |     if(resource.rootId || resource.url) {
  54 |       record.path=`@references/${resource.id}/${resource.path}`;
  55 |       record.origin={kind:resource.rootId?'external-root':'https',path:resource.path,
  56 |         ...(resource.rootId?{rootId:resource.rootId}:{}),...(resource.url?{url:resource.url}:{})};
  57 |     }
  58 |     records.push(record);
  59 |     if(paths && !paths.some(path=>resource.appliesTo.some(pattern=>matchesPattern(path,pattern)))) {record.status='not-applicable';continue;}
  60 |     if(isExcluded(resource.path,config.exclude) || intrinsicallyExcluded(resource.path)) {record.status='excluded';continue;}
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
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |     if(resource.path.split('/').some(part=>sensitiveName.test(part))) {record.status='sensitive-content';continue;}
  62 |     if(consumed>=MAX_REFERENCE_BYTES) {record.status='total-size-limit';continue;}
  63 |     try {
  64 |       let sourceRoot=root;
  65 |       const limit=Math.min(MAX_RESOURCE_BYTES,MAX_REFERENCE_BYTES-consumed);
  66 |       if(resource.rootId) {
  67 |         const granted=Object.hasOwn(grants.roots,resource.rootId)?grants.roots[resource.rootId]:undefined;
  68 |         if(!granted)throw new ResourceFailure('access-denied');
  69 |         sourceRoot=await validateRoot(granted);
  70 |         record.origin!.rootSha256=createHash('sha256').update(sourceRoot).digest('hex');
  71 |       }
  72 |       let read;
  73 |       if(resource.url) {
  74 |         if(!grants.origins.includes(new URL(resource.url).origin))throw new ResourceFailure('access-denied');
  75 |         let bytes:Buffer;
  76 |         try {bytes=await readRemoteReference(resource.url,limit);}catch{throw new ResourceFailure('remote-failed');}
  77 |         if(bytes.length>limit)throw new ResourceFailure('file-size-limit');
  78 |         if(bytes.includes(0))throw new ResourceFailure('invalid-text');
  79 |         let content:string;try{content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new ResourceFailure('invalid-text');}
  80 |         read={content,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
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
<a id="l94"></a>
<a id="l95"></a>
<a id="l96"></a>
<a id="l97"></a>
<a id="l98"></a>
<a id="l99"></a>
<a id="l100"></a>

```text
  81 |       } else read=await readResource(sourceRoot,resource.path,limit,config.exclude,resource.rootId?undefined:policy);
  82 |       consumed+=read.bytes;
  83 |       if(sensitiveContent.test(read.content)) {record.status='sensitive-content';continue;}
  84 |       record.sha256=read.sha256;record.bytes=read.bytes;record.lines=read.content.split(/\r\n|\n|\r/).length;
  85 |       if(resource.expectedSha256 && resource.expectedSha256!==read.sha256) {record.status='hash-mismatch';continue;}
  86 |       snapshots.push({record:{...record},content:read.content});
  87 |     } catch(error) {record.status=error instanceof ResourceFailure?error.status:(error as NodeJS.ErrnoException).code==='ENOENT'?'missing':'unreadable';}
  88 |   }
  89 |   return {report:referencesSchema.parse({state:records.some(record=>record.required && !['loaded','not-applicable'].includes(record.status))?'incomplete':'ready',
  90 |     evaluation:'not-assessed',resources:records}),snapshots};
  91 | }
  92 | 
  93 | /** Caller supplies submitted and freshly reloaded snapshots; verifies text, not meaning. */
  94 | export function verifyResourceEvidence(evidence:z.infer<typeof resourceEvidenceSchema>,submitted:ResourceSnapshot[],current:ResourceSnapshot[]) {
  95 |   const parsed=resourceEvidenceSchema.safeParse(evidence);
  96 |   if(!parsed.success)return {status:'rejected' as const,reason:'invalid-evidence'};
  97 |   const item=parsed.data;
  98 |   const original=submitted.find(snapshot=>snapshot.record.id===item.resourceId && snapshot.record.status==='loaded');
  99 |   const fresh=current.find(snapshot=>snapshot.record.id===item.resourceId && snapshot.record.status==='loaded');
 100 |   let reason='exact-line-match';
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l107"></a>
<a id="l108"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l112"></a>

```text
 101 |   if(!original)reason='not-in-submitted-resources';
 102 |   else if(item.snapshotSha256!==original.record.sha256)reason='wrong-snapshot';
 103 |   else if(!fresh)reason='resource-unavailable';
 104 |   else if(fresh.record.sha256!==original.record.sha256 || fresh.content!==original.content || fresh.record.path!==original.record.path
 105 |     || fresh.record.version!==original.record.version || fresh.record.authority!==original.record.authority)reason='resource-changed';
 106 |   else if(JSON.stringify(fresh.record.origin)!==JSON.stringify(original.record.origin))reason='resource-origin-changed';
 107 |   else {
 108 |     const lines=fresh.content.split(/\r\n|\n|\r/);
 109 |     if(item.endLine<item.startLine || item.endLine>lines.length)reason='invalid-line-range';
 110 |     else if(lines.slice(item.startLine-1,item.endLine).join('\n')!==item.excerpt.split(/\r\n|\n|\r/).join('\n'))reason='excerpt-mismatch';
 111 |   }
 112 |   return {status:reason==='exact-line-match'?'matched' as const:'rejected' as const,reason};
 113 | }
 114 | 
```
