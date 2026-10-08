# src/sdk-audit.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The SDK audit explicitly reads a package manifest and declaration file, including installed node_modules providers otherwise omitted from ordinary inventory. It checks package identity/version and requires an explicit declaration mapping when exports/typesVersions make resolution conditional. It never imports SDK code. Consumer files retain normal exclusions, and unsupported declarations or unresolved calls make the aggregate partial.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `431e515f06c2a7373a88ea8fd8e5fe35d0e7421381bc28a79eb2884f4328e5e4`.

This chapter inventories **7 function bodies/callbacks**, **20 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:path</code>: <code>posix</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>ConfigInput</code> (type only).
- <code>./reference-resources.js</code>: <code>loadReferenceResources</code>.
- <code>./reference-access.js</code>: <code>ReferenceAccess</code> (type only).
- <code>./version-policy.js</code>: <code>versionIssue</code>.
- <code>./resource-contracts.js</code>: <code>resourceDefinitionSchema</code>.
- <code>./sdk-syntax.js</code>: <code>indexSdkDeclarations</code>, <code>compareSdkCalls</code>.
- <code>./sdk-contracts.js</code>: <code>SdkResult</code> (type only).

## Module execution


## Function index

- [auditSdkContracts (11:8)](#fn-559)
- [[...new Set(binding.files)].filter callback (14:52)](#fn-862)
- [files.map callback (41:138)](#fn-4095)
- [sources.snapshots.find callback (46:43)](#fn-4561)
- [compared.issues.map callback (48:49)](#fn-4727)
- [compared.calls.map callback (48:121)](#fn-4799)
- [result.calls.some callback (50:50)](#fn-4892)

<a id="fn-559"></a>
### auditSdkContracts (11:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>input:ConfigInput={}</code>: when omitted/undefined, initialize with <code>{}</code>.
- <code>scope?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.
- <code>access:ReferenceAccess={}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L12](#l12) <code>results:SdkResult[]</code>: create a new empty array to accumulate ordered results.
- [L13](#l13) <code>binding</code>: receive the next iterable value from <code>config.sdkContracts</code> at the start of each loop iteration.
- [L14](#l14) <code>files</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(binding.files)].filter(path=&gt;!scope &#124;&#124; scope.includes(path))</code>.
- [L15](#l15) <code>result:SdkResult</code>: create an object with 7 property/spread entries: <code>{id:binding.id,package:binding.package,state:'checked',scope:'direct-named-function-calls-only',issues:[],files:[],calls:[]}</code>; later properties overwrite earlier spread values.
- [L16](#l16) <code>packageRoot</code>: use <code>binding.packageRoot</code> unless null/undefined, then evaluate <code>'node_modules/'+binding.package</code>.
- [L17](#l17) <code>rootOption</code>: test <code>binding.rootId</code>; choose <code>{rootId:binding.rootId}</code> when truthy, otherwise <code>{}</code>.
- [L18](#l18) <code>manifestRefs</code>: wait for <code>loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-manifest',path:posix.join(packageRoot,'package.json'),...rootOption}]},undefined,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L19](#l19) <code>manifest</code>: read <code>manifestRefs.snapshots[0]</code>.
- [L21](#l21) <code>rootHash</code>: read <code>manifestRefs.report.resources[0]!.origin?.rootSha256</code>; optional access returns undefined when its receiver is null/undefined.
- [L24](#l24) <code>metadata:{name?:unknown;version?:unknown;types?:unknown;typings?:unknown;exports?:unknown;typesVersions?:unknown}</code>: leave the value undefined until a later assignment.
- [L29](#l29) <code>versionProblem</code>: call the named operation with the supplied arguments: <code>versionIssue(metadata.version,binding.expectedVersion,binding.versionRange)</code>.
- [L31](#l31) <code>declared</code>: use <code>binding.declarationFile ?? metadata.types</code> unless null/undefined, then evaluate <code>metadata.typings</code>.
- [L36](#l36) <code>declarationRefs</code>: wait for <code>loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-declarations',path:posix.join(packageRoot,declared),kind:'source',...rootOption}]},undefined,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L37](#l37) <code>declaration</code>: read <code>declarationRefs.snapshots[0]</code>.
- [L40](#l40) <code>index</code>: call the named operation with the supplied arguments: <code>indexSdkDeclarations(declaration.content)</code>.
- [L41](#l41) <code>sources</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=&gt;({id:'sdk-source'+i,path,kind:'source'}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L42](#l42) <code>record</code>: receive the next iterable value from <code>sources.report.resources</code> at the start of each loop iteration.
- [L46](#l46) <code>source</code>: return the first matching element, or undefined: <code>sources.snapshots.find(s=&gt;s.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
- [L47](#l47) <code>compared</code>: call the named operation with the supplied arguments: <code>compareSdkCalls(source.content,record.path,binding.package,index)</code>.

Execution:

- [L12](#l12) Bind <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L12](#l12) Bind <code>results:SdkResult[]</code>: create a new empty array to accumulate ordered results.
- [L13](#l13) Iterate <code>config.sdkContracts</code> values, binding <code>const binding</code> for each iteration:
  - [L14](#l14) Bind <code>files</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(binding.files)].filter(path=&gt;!scope &#124;&#124; scope.includes(path))</code>.
  - [L14](#l14) If <code>!files.length</code> is truthy:
    - [L14](#l14) Skip the rest of this iteration and advance the enclosing loop.
  - [L15](#l15) Bind <code>result:SdkResult</code>: create an object with 7 property/spread entries: <code>{id:binding.id,package:binding.package,state:'checked',scope:'direct-named-function-calls-only',issues:[],files:[],calls:[]}</code>; later properties overwrite earlier spread values.
  - [L15](#l15) append values to the existing array: <code>results.push(result)</code>.
  - [L16](#l16) Bind <code>packageRoot</code>: use <code>binding.packageRoot</code> unless null/undefined, then evaluate <code>'node_modules/'+binding.package</code>.
  - [L17](#l17) Bind <code>rootOption</code>: test <code>binding.rootId</code>; choose <code>{rootId:binding.rootId}</code> when truthy, otherwise <code>{}</code>.
  - [L18](#l18) Bind <code>manifestRefs</code>: wait for <code>loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-manifest',path:posix.join(packageRoot,'package.json'),...rootOption}]},undefined,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L19](#l19) Bind <code>manifest</code>: read <code>manifestRefs.snapshots[0]</code>.
  - [L20](#l20) update <code>result.provider</code> with <code>{manifestPath:manifestRefs.report.resources[0]!.path,manifestSha256:manifestRefs.report.resources[0]!.sha256,...rootOption}</code> using <code>=</code>; this mutation is visible to later statements.
  - [L21](#l21) Bind <code>rootHash</code>: read <code>manifestRefs.report.resources[0]!.origin?.rootSha256</code>; optional access returns undefined when its receiver is null/undefined.
  - [L22](#l22) If <code>rootHash</code> is truthy:
    - [L22](#l22) update <code>result.provider.rootSha256</code> with <code>rootHash</code> using <code>=</code>; this mutation is visible to later statements.
  - [L23](#l23) If <code>!manifest</code> is truthy:
    - [L23](#l23) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L23](#l23) append values to the existing array: <code>result.issues.push('Package manifest '+manifestRefs.report.resources[0]!.status)</code>.
    - [L23](#l23) Skip the rest of this iteration and advance the enclosing loop.
  - [L24](#l24) Bind <code>metadata:{name?:unknown;version?:unknown;types?:unknown;typings?:unknown;exports?:unknown;typesVersions?:unknown}</code>: leave the value undefined until a later assignment.
  - [L25](#l25) Run the protected block:
    - [L25](#l25) update <code>metadata</code> with <code>JSON.parse(manifest.content)</code> using <code>=</code>; this mutation is visible to later statements.
    - [L25](#l25) If <code>!metadata &#124;&#124; Array.isArray(metadata) &#124;&#124; typeof metadata!=='object'</code> is truthy:
      - [L25](#l25) Throw <code>Error()</code>; normal execution stops until an enclosing catch handles it.
  - [L25](#l25) If it throws:
    - [L26](#l26) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L26](#l26) append values to the existing array: <code>result.issues.push('invalid-package-manifest')</code>.
    - [L26](#l26) Skip the rest of this iteration and advance the enclosing loop.
  - [L27](#l27) If <code>metadata.name!==binding.package &#124;&#124; typeof metadata.version!=='string'</code> is truthy:
    - [L27](#l27) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L27](#l27) append values to the existing array: <code>result.issues.push('package-identity-or-version-unavailable')</code>.
    - [L27](#l27) Skip the rest of this iteration and advance the enclosing loop.
  - [L28](#l28) update <code>result.provider.version</code> with <code>metadata.version</code> using <code>=</code>; this mutation is visible to later statements.
  - [L29](#l29) Bind <code>versionProblem</code>: call the named operation with the supplied arguments: <code>versionIssue(metadata.version,binding.expectedVersion,binding.versionRange)</code>.
  - [L30](#l30) If <code>versionProblem</code> is truthy:
    - [L30](#l30) update <code>result.state</code> with <code>'version-mismatch'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L30](#l30) append values to the existing array: <code>result.issues.push(versionProblem)</code>.
    - [L30](#l30) Skip the rest of this iteration and advance the enclosing loop.
  - [L31](#l31) Bind <code>declared</code>: use <code>binding.declarationFile ?? metadata.types</code> unless null/undefined, then evaluate <code>metadata.typings</code>.
  - [L32](#l32) If <code>!binding.declarationFile &amp;&amp; (metadata.exports!==undefined &#124;&#124; metadata.typesVersions!==undefined)</code> is truthy:
    - [L32](#l32) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L32](#l32) append values to the existing array: <code>result.issues.push('conditional-package-resolution: supply an explicit declarationFile mapping.')</code>.
    - [L32](#l32) Skip the rest of this iteration and advance the enclosing loop.
  - [L33](#l33) If <code>typeof declared!=='string' &#124;&#124; !/\.d\.(?:ts&#124;mts&#124;cts)$/.test(declared) &#124;&#124; !resourceDefinitionSchema.shape.path.safeParse(declared.replace(/^\.\//,'')).success</code> is truthy:
    - [L34](#l34) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L34](#l34) append values to the existing array: <code>result.issues.push('declaration-entry-unavailable-or-unsafe')</code>.
    - [L34](#l34) Skip the rest of this iteration and advance the enclosing loop.
  - [L36](#l36) Bind <code>declarationRefs</code>: wait for <code>loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-declarations',path:posix.join(packageRoot,declared),kind:'source',...rootOption}]},undefined,access)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L37](#l37) Bind <code>declaration</code>: read <code>declarationRefs.snapshots[0]</code>.
  - [L38](#l38) update <code>result.provider.declarationPath</code> with <code>declarationRefs.report.resources[0]!.path</code> using <code>=</code>; this mutation is visible to later statements.
  - [L38](#l38) update <code>result.provider.declarationSha256</code> with <code>declarationRefs.report.resources[0]!.sha256</code> using <code>=</code>; this mutation is visible to later statements.
  - [L39](#l39) If <code>!declaration</code> is truthy:
    - [L39](#l39) update <code>result.state</code> with <code>'unavailable'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L39](#l39) append values to the existing array: <code>result.issues.push('Declaration '+declarationRefs.report.resources[0]!.status)</code>.
    - [L39](#l39) Skip the rest of this iteration and advance the enclosing loop.
  - [L40](#l40) Bind <code>index</code>: call the named operation with the supplied arguments: <code>indexSdkDeclarations(declaration.content)</code>.
  - [L40](#l40) append values to the existing array: <code>result.issues.push(...index.issues)</code>.
  - [L41](#l41) Bind <code>sources</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=&gt;({id:'sdk-source'+i,path,kind:'source'}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L42](#l42) Iterate <code>sources.report.resources</code> values, binding <code>const record</code> for each iteration:
    - [L43](#l43) append values to the existing array: <code>result.files.push({path:record.path,sha256:record.sha256,status:record.status})</code>.
    - [L44](#l44) If <code>record.status!=='loaded'</code> is truthy:
      - [L44](#l44) append values to the existing array: <code>result.issues.push(record.path+': '+record.status)</code>.
      - [L44](#l44) Skip the rest of this iteration and advance the enclosing loop.
    - [L45](#l45) If <code>!/\.[cm]?[jt]s$&#124;\.tsx$/.test(record.path)</code> is truthy:
      - [L45](#l45) append values to the existing array: <code>result.issues.push(record.path+': unsupported-sdk-consumer-language')</code>.
      - [L45](#l45) Skip the rest of this iteration and advance the enclosing loop.
    - [L46](#l46) Bind <code>source</code>: return the first matching element, or undefined: <code>sources.snapshots.find(s=&gt;s.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
    - [L47](#l47) Bind <code>compared</code>: call the named operation with the supplied arguments: <code>compareSdkCalls(source.content,record.path,binding.package,index)</code>.
    - [L48](#l48) append values to the existing array: <code>result.issues.push(...compared.issues.map(issue=&gt;record.path+': '+issue))</code>.
    - [L48](#l48) append values to the existing array: <code>result.calls.push(...compared.calls.map(call=&gt;({path:record.path,...call})))</code>.
  - [L50](#l50) If <code>result.issues.length &#124;&#124; result.calls.some(call=&gt;call.status==='unresolved')</code> is truthy:
    - [L50](#l50) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
- [L52](#l52) Return to the caller: evaluate <code>results</code>.

<a id="fn-862"></a>
### [...new Set(binding.files)].filter callback (14:52)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>[...new Set(binding.files)].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: evaluate <code>!scope &#124;&#124; scope.includes(path)</code> left to right with truthy short-circuiting.

<a id="fn-4095"></a>
### files.map callback (41:138)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L41](#l41) Implicitly return: create an object with 3 property/spread entries: <code>{id:'sdk-source'+i,path,kind:'source'}</code>; later properties overwrite earlier spread values.

<a id="fn-4561"></a>
### sources.snapshots.find callback (46:43)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>sources.snapshots.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L46](#l46) Implicitly return: compute <code>s.record.id===record.id</code> with the <code>===</code> operator.

<a id="fn-4727"></a>
### compared.issues.map callback (48:49)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>compared.issues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L48](#l48) Implicitly return: compute <code>record.path+': '+issue</code> with the <code>+</code> operator.

<a id="fn-4799"></a>
### compared.calls.map callback (48:121)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>compared.calls.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>call</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L48](#l48) Implicitly return: create an object with 2 property/spread entries: <code>{path:record.path,...call}</code>; later properties overwrite earlier spread values.

<a id="fn-4892"></a>
### result.calls.some callback (50:50)

Synchronous function. Lexically inside [auditSdkContracts (11:8)](#fn-559). Passed to <code>result.calls.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>call</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L50](#l50) Implicitly return: compute <code>call.status==='unresolved'</code> with the <code>===</code> operator.

## Directly importing tests

- [sdk-audit.test.ts](../../test/sdk-audit.test.ts)

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
   1 | import {posix} from 'node:path';
   2 | import {configSchema,type ConfigInput} from './config.js';
   3 | import {loadReferenceResources} from './reference-resources.js';
   4 | import type {ReferenceAccess} from './reference-access.js';
   5 | import {versionIssue} from './version-policy.js';
   6 | import {resourceDefinitionSchema} from './resource-contracts.js';
   7 | import {indexSdkDeclarations,compareSdkCalls} from './sdk-syntax.js';
   8 | import type {SdkResult} from './sdk-contracts.js';
   9 | 
  10 | /** Read installed or explicitly mapped package metadata/declarations; never import SDK code. */
  11 | export async function auditSdkContracts(root:string,input:ConfigInput={},scope?:readonly string[],access:ReferenceAccess={}):Promise<SdkResult[]> {
  12 |   const config=configSchema.parse(input),results:SdkResult[]=[];
  13 |   for(const binding of config.sdkContracts) {
  14 |     const files=[...new Set(binding.files)].filter(path=>!scope || scope.includes(path));if(!files.length)continue;
  15 |     const result:SdkResult={id:binding.id,package:binding.package,state:'checked',scope:'direct-named-function-calls-only',issues:[],files:[],calls:[]};results.push(result);
  16 |     const packageRoot=binding.packageRoot ?? 'node_modules/'+binding.package;
  17 |     const rootOption=binding.rootId?{rootId:binding.rootId}:{};
  18 |     const manifestRefs=await loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-manifest',path:posix.join(packageRoot,'package.json'),...rootOption}]},undefined,access);
  19 |     const manifest=manifestRefs.snapshots[0];
  20 |     result.provider={manifestPath:manifestRefs.report.resources[0]!.path,manifestSha256:manifestRefs.report.resources[0]!.sha256,...rootOption};
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
<a id="l36"></a>
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     const rootHash=manifestRefs.report.resources[0]!.origin?.rootSha256;
  22 |     if(rootHash)result.provider.rootSha256=rootHash;
  23 |     if(!manifest){result.state='unavailable';result.issues.push('Package manifest '+manifestRefs.report.resources[0]!.status);continue;}
  24 |     let metadata:{name?:unknown;version?:unknown;types?:unknown;typings?:unknown;exports?:unknown;typesVersions?:unknown};
  25 |     try {metadata=JSON.parse(manifest.content);if(!metadata || Array.isArray(metadata) || typeof metadata!=='object')throw Error();}
  26 |     catch{result.state='unavailable';result.issues.push('invalid-package-manifest');continue;}
  27 |     if(metadata.name!==binding.package || typeof metadata.version!=='string'){result.state='unavailable';result.issues.push('package-identity-or-version-unavailable');continue;}
  28 |     result.provider.version=metadata.version;
  29 |     const versionProblem=versionIssue(metadata.version,binding.expectedVersion,binding.versionRange);
  30 |     if(versionProblem){result.state='version-mismatch';result.issues.push(versionProblem);continue;}
  31 |     const declared=binding.declarationFile ?? metadata.types ?? metadata.typings;
  32 |     if(!binding.declarationFile && (metadata.exports!==undefined || metadata.typesVersions!==undefined)) {result.state='partial';result.issues.push('conditional-package-resolution: supply an explicit declarationFile mapping.');continue;}
  33 |     if(typeof declared!=='string' || !/\.d\.(?:ts|mts|cts)$/.test(declared) || !resourceDefinitionSchema.shape.path.safeParse(declared.replace(/^\.\//,'')).success) {
  34 |       result.state='unavailable';result.issues.push('declaration-entry-unavailable-or-unsafe');continue;
  35 |     }
  36 |     const declarationRefs=await loadReferenceResources(root,{respectGitignore:false,exclude:config.exclude,resources:[{id:'sdk-declarations',path:posix.join(packageRoot,declared),kind:'source',...rootOption}]},undefined,access);
  37 |     const declaration=declarationRefs.snapshots[0];
  38 |     result.provider.declarationPath=declarationRefs.report.resources[0]!.path;result.provider.declarationSha256=declarationRefs.report.resources[0]!.sha256;
  39 |     if(!declaration){result.state='unavailable';result.issues.push('Declaration '+declarationRefs.report.resources[0]!.status);continue;}
  40 |     const index=indexSdkDeclarations(declaration.content);result.issues.push(...index.issues);
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
<a id="l52"></a>

```text
  41 |     const sources=await loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:files.map((path,i)=>({id:'sdk-source'+i,path,kind:'source'}))});
  42 |     for(const record of sources.report.resources) {
  43 |       result.files.push({path:record.path,sha256:record.sha256,status:record.status});
  44 |       if(record.status!=='loaded'){result.issues.push(record.path+': '+record.status);continue;}
  45 |       if(!/\.[cm]?[jt]s$|\.tsx$/.test(record.path)){result.issues.push(record.path+': unsupported-sdk-consumer-language');continue;}
  46 |       const source=sources.snapshots.find(s=>s.record.id===record.id)!;
  47 |       const compared=compareSdkCalls(source.content,record.path,binding.package,index);
  48 |       result.issues.push(...compared.issues.map(issue=>record.path+': '+issue));result.calls.push(...compared.calls.map(call=>({path:record.path,...call})));
  49 |     }
  50 |     if(result.issues.length || result.calls.some(call=>call.status==='unresolved'))result.state='partial';
  51 |   }
  52 |   return results;
  53 | }
  54 | 
```
