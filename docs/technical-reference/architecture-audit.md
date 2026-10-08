# src/architecture-audit.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The architecture audit builds inventory, expands configured patterns and explicit scoped paths, and reads at most 128 sources in groups of 32. resolveImport uses relative paths or explicit aliases, tests a bounded set of candidates and requires exactly one local match. Only resolved edges feed forbidden-direction evaluation. Filename policies test the basename without its final extension; unresolved edges or coverage issues make the stage partial.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `ff6a3c71422ff3dff710912587dd45e6dfb92a9a18ffcf65c3c51cea21837334`.

This chapter inventories **22 function bodies/callbacks**, **31 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>node:crypto</code>: <code>createHash</code>.
- <code>node:path</code>: <code>posix</code>.
- <code>./config.js</code>: <code>configSchema</code>, <code>matchesPattern</code>, <code>isExcluded</code>, <code>ConfigInput</code> (type only).
- <code>./inspect-repository.js</code>: <code>inspectRepository</code>.
- <code>./reference-resources.js</code>: <code>loadReferenceResources</code>.
- <code>./intent-policy.js</code>: <code>assessIntentPolicy</code>.
- <code>./dependency-imports.js</code>: <code>dependencyLanguage</code>, <code>extractDependencyImports</code>, <code>ImportObservation</code> (type only).
- <code>./architecture-contracts.js</code>: <code>ArchitectureResult</code> (type only).

## Module execution

- [L9](#l9) Bind <code>within</code>: create [within (9:14)](#fn-527); its body runs when called, not when this value is created.

## Function index

- [within (9:14)](#fn-527)
- [auditArchitecture (11:8)](#fn-601)
- [profile.files.map callback (14:41)](#fn-973)
- [policy.files.filter callback (15:80)](#fn-1106)
- [[...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter callback (16:13)](#fn-1142)
- [policy.files.some callback (16:67)](#fn-1196)
- [resolveImport (23:23)](#fn-1977)
- [unresolved (25:22)](#fn-2237)
- [policy.aliases.filter callback (36:43)](#fn-3126)
- [['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap callback (44:121)](#fn-3866)
- [[...new Set(candidates)].filter callback (46:51)](#fn-4128)
- [selected.slice(offset,Math.min(offset+32,128)).map callback (51:178)](#fn-4787)
- [loaded.snapshots.find callback (56:42)](#fn-5191)
- [extracted.issues.map callback (59:50)](#fn-5402)
- [extracted.imports.slice(0,remaining).map callback (62:76)](#fn-5672)
- [result.dependencies.filter callback (65:42)](#fn-5758)
- [result.dependencies.filter(e=&gt;e.status==='resolved').map callback (65:72)](#fn-5788)
- [assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map callback (66:93)](#fn-5940)
- [policy.conventions.map callback (68:45)](#fn-6206)
- [result.files.filter callback (69:40)](#fn-6253)
- [result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map callback (69:168)](#fn-6381)
- [result.dependencies.some callback (72:55)](#fn-6543)

<a id="fn-527"></a>
### within (9:14)

Synchronous function. Defined in module scope. 

Parameters:

- <code>p:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>prefix:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L9](#l9) Implicitly return: evaluate <code>p===prefix &#124;&#124; p.startsWith(prefix+'/')</code> left to right with truthy short-circuiting.

<a id="fn-601"></a>
### auditArchitecture (11:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>input:ConfigInput={}</code>: when omitted/undefined, initialize with <code>{}</code>.
- <code>scope?:readonly string[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L12](#l12) <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L12](#l12) <code>policy</code>: read <code>config.architecture</code>.
- [L13](#l13) <code>profile</code>: wait for <code>inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L14](#l14) <code>files</code>: construct <code>Set</code> using <code>profile.files.map(f=&gt;f.path)</code>; this creates the local instance used below.
- [L14](#l14) <code>directories</code>: construct <code>Set</code> using <code>profile.directories</code>; this creates the local instance used below.
- [L15](#l15) <code>selected</code>: sort the receiver array in place using the comparator: <code>[...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter(p=&gt;(!scope &#124;&#124; scope.includes(p)) &amp;&amp; policy.files.some(pattern=&gt;matchesPattern(p,pattern)) &amp;&amp; !isExcluded(p,config.exclude)).sort()</code>.
- [L17](#l17) <code>result:ArchitectureResult</code>: create an object with 8 property/spread entries: <code>{state:'checked',coverage:'configured-import-declarations-only', policySha256:createHash('sha256').update(JSON.stringify(policy)).digest('hex'),files:[],dependencies:[],boundaries:[],conventions:[],issues:[]}</code>; later properties overwrite earlier spread values.
- [L20](#l20) <code>warning</code>: receive the next iterable value from <code>profile.warnings</code> at the start of each loop iteration.
- [L23](#l23) <code>resolveImport</code>: create [resolveImport (23:23)](#fn-1977); its body runs when called, not when this value is created.
- [L50](#l50) <code>offset</code>: use the literal <code>0</code>.
- [L51](#l51) <code>loaded</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:selected.slice(offset,Math.min(offset+32,128)).map((path,i)=&gt;({id:'architecture'+i,path,kind:'source'}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L52](#l52) <code>record</code>: receive the next iterable value from <code>loaded.report.resources</code> at the start of each loop iteration.
- [L53](#l53) <code>file</code>: create an object with 3 property/spread entries: <code>{path:record.path,sha256:record.sha256,status:record.status as string}</code>; later properties overwrite earlier spread values.
- [L56](#l56) <code>source</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(s=&gt;s.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
- [L57](#l57) <code>extracted</code>: call the named operation with the supplied arguments: <code>extractDependencyImports(source.content,record.path)</code>.
- [L60](#l60) <code>remaining</code>: compute <code>10000-result.dependencies.length</code> with the <code>-</code> operator.
- [L65](#l65) <code>edges</code>: transform each element into a new array: <code>result.dependencies.filter(e=&gt;e.status==='resolved').map(e=&gt;({from:e.from,to:e.to!,line:e.line,excerpt:e.excerpt}))</code>.
- [L67](#l67) <code>styles</code>: create an object with 3 property/spread entries: <code>{'snake_case':/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/,'kebab-case':/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,'PascalCase':/^[A-Z][a-zA-Z0-9]*$/}</code>; later properties overwrite earlier spread values.

Execution:

- [L12](#l12) Bind <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(input)</code>.
- [L12](#l12) Bind <code>policy</code>: read <code>config.architecture</code>.
- [L12](#l12) If <code>!policy</code> is truthy:
  - [L12](#l12) Return undefined immediately; remaining statements in this function do not execute.
- [L13](#l13) Bind <code>profile</code>: wait for <code>inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L14](#l14) Bind <code>files</code>: construct <code>Set</code> using <code>profile.files.map(f=&gt;f.path)</code>; this creates the local instance used below.
- [L14](#l14) Bind <code>directories</code>: construct <code>Set</code> using <code>profile.directories</code>; this creates the local instance used below.
- [L15](#l15) Bind <code>selected</code>: sort the receiver array in place using the comparator: <code>[...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter(p=&gt;(!scope &#124;&#124; scope.includes(p)) &amp;&amp; policy.files.some(pattern=&gt;matchesPattern(p,pattern)) &amp;&amp; !isExcluded(p,config.exclude)).sort()</code>.
- [L17](#l17) Bind <code>result:ArchitectureResult</code>: create an object with 8 property/spread entries: <code>{state:'checked',coverage:'configured-import-declarations-only', policySha256:createHash('sha256').update(JSON.stringify(policy)).digest('hex'),files:[],dependencies:[],boundaries:[],conventions:[],issues:[]}</code>; later properties overwrite earlier spread values.
- [L19](#l19) If <code>!selected.length</code> is truthy:
  - [L19](#l19) append values to the existing array: <code>result.issues.push('No source paths selected; no architecture assessment performed.')</code>.
- [L20](#l20) Iterate <code>profile.warnings</code> values, binding <code>const warning</code> for each iteration:
  - [L20](#l20) If <code>warning.code==='unreadable-directory' &#124;&#124; warning.code==='symlink-skipped'</code> is truthy:
    - [L21](#l21) append values to the existing array: <code>result.issues.push(warning.path+': '+warning.code+'; inventory may be incomplete.')</code>.
- [L22](#l22) If <code>selected.length&gt;128</code> is truthy:
  - [L22](#l22) append values to the existing array: <code>result.issues.push('source-file-limit: '+selected.length+' selected; first 128 assessed.')</code>.
- [L23](#l23) Bind <code>resolveImport</code>: create [resolveImport (23:23)](#fn-1977); its body runs when called, not when this value is created.
- [L50](#l50) Initialize <code>let offset=0</code>; repeat while <code>offset&lt;Math.min(selected.length,128)</code>; after each normal iteration evaluate <code>offset+=32</code>:
  - [L51](#l51) Bind <code>loaded</code>: wait for <code>loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:selected.slice(offset,Math.min(offset+32,128)).map((path,i)=&gt;({id:'architecture'+i,path,kind:'source'}))})</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
  - [L52](#l52) Iterate <code>loaded.report.resources</code> values, binding <code>const record</code> for each iteration:
    - [L53](#l53) Bind <code>file</code>: create an object with 3 property/spread entries: <code>{path:record.path,sha256:record.sha256,status:record.status as string}</code>; later properties overwrite earlier spread values.
    - [L53](#l53) append values to the existing array: <code>result.files.push(file)</code>.
    - [L54](#l54) If <code>record.status!=='loaded'</code> is truthy:
      - [L54](#l54) append values to the existing array: <code>result.issues.push(record.path+': '+record.status)</code>.
      - [L54](#l54) Skip the rest of this iteration and advance the enclosing loop.
    - [L55](#l55) If <code>!policy.boundaries.length</code> is truthy:
      - [L55](#l55) Skip the rest of this iteration and advance the enclosing loop.
    - [L56](#l56) Bind <code>source</code>: return the first matching element, or undefined: <code>loaded.snapshots.find(s=&gt;s.record.id===record.id)</code>; the TypeScript assertion adds no runtime validation.
    - [L57](#l57) Bind <code>extracted</code>: call the named operation with the supplied arguments: <code>extractDependencyImports(source.content,record.path)</code>.
    - [L58](#l58) If <code>extracted.issues.length</code> is truthy:
      - [L58](#l58) update <code>file.status</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L59](#l59) append values to the existing array: <code>result.issues.push(...extracted.issues.map(issue=&gt;record.path+': '+issue))</code>.
    - [L60](#l60) Bind <code>remaining</code>: compute <code>10000-result.dependencies.length</code> with the <code>-</code> operator.
    - [L61](#l61) If <code>extracted.imports.length&gt;remaining</code> is truthy:
      - [L61](#l61) append values to the existing array: <code>result.issues.push(record.path+': total-import-count-limit')</code>.
    - [L62](#l62) append values to the existing array: <code>result.dependencies.push(...extracted.imports.slice(0,remaining).map(o=&gt;resolveImport(record.path,o)))</code>.
- [L65](#l65) Bind <code>edges</code>: transform each element into a new array: <code>result.dependencies.filter(e=&gt;e.status==='resolved').map(e=&gt;({from:e.from,to:e.to!,line:e.line,excerpt:e.excerpt}))</code>.
- [L66](#l66) update <code>result.boundaries</code> with <code>assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map(b=&gt;({...b,status:b.evidence.length?'violation':'no-observed-violation'}))</code> using <code>=</code>; this mutation is visible to later statements.
- [L67](#l67) Bind <code>styles</code>: create an object with 3 property/spread entries: <code>{'snake_case':/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/,'kebab-case':/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,'PascalCase':/^[A-Z][a-zA-Z0-9]*$/}</code>; later properties overwrite earlier spread values.
- [L68](#l68) update <code>result.conventions</code> with <code>policy.conventions.map(rule=&gt;{ const evidence=result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map(f=&gt;f.path); return {...rule,status:evidence.length?'violation':…</code> using <code>=</code>; this mutation is visible to later statements.
- [L72](#l72) If <code>result.issues.length &#124;&#124; result.dependencies.some(d=&gt;d.status==='unresolved')</code> is truthy:
  - [L72](#l72) update <code>result.state</code> with <code>'partial'</code> using <code>=</code>; this mutation is visible to later statements.
- [L73](#l73) Return to the caller: evaluate <code>result</code>.

<a id="fn-973"></a>
### profile.files.map callback (14:41)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>profile.files.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L14](#l14) Implicitly return: read <code>f.path</code>.

<a id="fn-1106"></a>
### policy.files.filter callback (15:80)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>policy.files.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L15](#l15) Implicitly return: apply <code>!</code> to <code>p.includes('*')</code>.

<a id="fn-1142"></a>
### [...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter callback (16:13)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>[...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: evaluate <code>(!scope &#124;&#124; scope.includes(p)) &amp;&amp; policy.files.some(pattern=&gt;matchesPattern(p,pattern)) &amp;&amp; !isExcluded(p,config.exclude)</code> left to right with falsy short-circuiting.

<a id="fn-1196"></a>
### policy.files.some callback (16:67)

Synchronous function. Lexically inside [[...new Set([...files,...(scope ?? []),...policy.files.filter(p=&gt;!p.includes('*'))])] .filter callback (16:13)](#fn-1142). Passed to <code>policy.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L16](#l16) Implicitly return: call the named operation with the supplied arguments: <code>matchesPattern(p,pattern)</code>.

<a id="fn-1977"></a>
### resolveImport (23:23)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). 

Parameters:

- <code>from:string</code>: supplied by the caller; usage is shown in the steps below.
- <code>observation:ImportObservation</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L24](#l24) <code>edge</code>: create an object with 4 property/spread entries: <code>{from,line:observation.line,excerpt:observation.excerpt,...(observation.specifier===undefined?{}:{specifier:observation.specifier})}</code>; later properties overwrite earlier spread values.
- [L25](#l25) <code>unresolved</code>: create [unresolved (25:22)](#fn-2237); its body runs when called, not when this value is created.
- [L26](#l26) <code>spec</code>: read <code>observation.specifier</code>.
- [L26](#l26) <code>language</code>: call the named operation with the supplied arguments: <code>dependencyLanguage(from)</code>.
- [L30](#l30) <code>target:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L33](#l33) <code>dots</code>: read <code>spec.match(/^\.+/)![0].length</code>.
- [L36](#l36) <code>aliases</code>: retain only elements whose callback returns a truthy value: <code>policy.aliases.filter(a=&gt;spec===a.prefix &#124;&#124; /[/.]$/.test(a.prefix) &amp;&amp; spec.startsWith(a.prefix))</code>.
- [L39](#l39) <code>alias</code>: read <code>aliases[0]</code>; the TypeScript assertion adds no runtime validation.
- [L39](#l39) <code>suffix</code>: select a range without mutating the original array/string: <code>spec.slice(alias.prefix.length)</code>.
- [L44](#l44) <code>candidates</code>: test <code>language==='javascript'</code>; choose <code>[target,...['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap(ext=&gt;[target+ext,target+'/index'+ext]),...(/\.[cm]?js$/.test(target)?[target.replace(/js$/,'ts')]:[])]</code> when truthy, otherwise <code>language==='python'?[target+'.py',target+'/__init__.py']:language==='java'?[target+'.java']:[target]</code>.
- [L46](#l46) <code>matches</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(candidates)].filter(p=&gt;!isExcluded(p,config.exclude) &amp;&amp; (language==='go' &#124;&#124; language==='csharp'?directories.has(p):files.has(p)))</code>.

Execution:

- [L24](#l24) Bind <code>edge</code>: create an object with 4 property/spread entries: <code>{from,line:observation.line,excerpt:observation.excerpt,...(observation.specifier===undefined?{}:{specifier:observation.specifier})}</code>; later properties overwrite earlier spread values.
- [L25](#l25) Bind <code>unresolved</code>: create [unresolved (25:22)](#fn-2237); its body runs when called, not when this value is created.
- [L26](#l26) Bind <code>spec</code>: read <code>observation.specifier</code>.
- [L26](#l26) Bind <code>language</code>: call the named operation with the supplied arguments: <code>dependencyLanguage(from)</code>.
- [L27](#l27) If <code>observation.reason &#124;&#124; !spec</code> is truthy:
  - [L27](#l27) Return to the caller: call the named operation with the supplied arguments: <code>unresolved(observation.reason ?? 'dynamic-or-unsupported-import')</code>.
- [L28](#l28) If <code>spec.startsWith('/')</code> is truthy:
  - [L28](#l28) Return to the caller: call the named operation with the supplied arguments: <code>unresolved('absolute-module-specifier')</code>.
- [L29](#l29) If <code>/[\\\u0000-\u0020:#?%]/.test(spec) &amp;&amp; !(language==='javascript' &amp;&amp; /^node:[\w/]+$/.test(spec))</code> is truthy:
  - [L29](#l29) Return to the caller: call the named operation with the supplied arguments: <code>unresolved('unsupported-module-specifier')</code>.
- [L30](#l30) Bind <code>target:string&#124;undefined</code>: leave the value undefined until a later assignment.
- [L31](#l31) If <code>language==='javascript' &amp;&amp; spec.startsWith('.')</code> is truthy:
  - [L31](#l31) update <code>target</code> with <code>posix.join(posix.dirname(from),spec)</code> using <code>=</code>; this mutation is visible to later statements.
- [L31](#l31) Otherwise:
  - [L32](#l32) If <code>language==='python' &amp;&amp; spec.startsWith('.')</code> is truthy:
    - [L33](#l33) Bind <code>dots</code>: read <code>spec.match(/^\.+/)![0].length</code>.
    - [L34](#l34) update <code>target</code> with <code>posix.join(posix.dirname(from),...Array&lt;string&gt;(dots-1).fill('..'),spec.slice(dots).replace(/\./g,'/'))</code> using <code>=</code>; this mutation is visible to later statements.
  - [L32](#l32) Otherwise:
    - [L36](#l36) Bind <code>aliases</code>: retain only elements whose callback returns a truthy value: <code>policy.aliases.filter(a=&gt;spec===a.prefix &#124;&#124; /[/.]$/.test(a.prefix) &amp;&amp; spec.startsWith(a.prefix))</code>.
    - [L37](#l37) If <code>aliases.length&gt;1</code> is truthy:
      - [L37](#l37) Return to the caller: call the named operation with the supplied arguments: <code>unresolved('ambiguous-alias')</code>.
    - [L38](#l38) If <code>aliases.length</code> is truthy:
      - [L39](#l39) Bind <code>alias</code>: read <code>aliases[0]</code>; the TypeScript assertion adds no runtime validation.
      - [L39](#l39) Bind <code>suffix</code>: select a range without mutating the original array/string: <code>spec.slice(alias.prefix.length)</code>.
      - [L40](#l40) update <code>target</code> with <code>posix.join(alias.target,['python','java','csharp'].includes(language!)?suffix.replace(/\./g,'/'):suffix)</code> using <code>=</code>; this mutation is visible to later statements.
    - [L38](#l38) Otherwise:
      - [L41](#l41) Return to the caller: create an object with 3 property/spread entries: <code>{...edge,status:'external',reason:'Unmapped non-relative import; outside configured local graph.'}</code>; later properties overwrite earlier spread values.
- [L43](#l43) If <code>target==='.' &#124;&#124; target==='..' &#124;&#124; target.startsWith('../') &#124;&#124; posix.isAbsolute(target)</code> is truthy:
  - [L43](#l43) Return to the caller: call the named operation with the supplied arguments: <code>unresolved('outside-repository')</code>.
- [L44](#l44) Bind <code>candidates</code>: test <code>language==='javascript'</code>; choose <code>[target,...['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap(ext=&gt;[target+ext,target+'/index'+ext]),...(/\.[cm]?js$/.test(target)?[target.replace(/js$/,'ts')]:[])]</code> when truthy, otherwise <code>language==='python'?[target+'.py',target+'/__init__.py']:language==='java'?[target+'.java']:[target]</code>.
- [L46](#l46) Bind <code>matches</code>: retain only elements whose callback returns a truthy value: <code>[...new Set(candidates)].filter(p=&gt;!isExcluded(p,config.exclude) &amp;&amp; (language==='go' &#124;&#124; language==='csharp'?directories.has(p):files.has(p)))</code>.
- [L47](#l47) If <code>matches.length!==1</code> is truthy:
  - [L47](#l47) Return to the caller: call the named operation with the supplied arguments: <code>unresolved(matches.length?'ambiguous-local-target':'local-target-unavailable')</code>.
- [L48](#l48) Return to the caller: create an object with 4 property/spread entries: <code>{...edge,status:'resolved',to:matches[0]!,reason:language==='csharp'?'Mapped namespace declaration; actual type use is not assessed.':'Resolved configured local import.'}</code>; later properties overwrite earlier spread values.

<a id="fn-2237"></a>
### unresolved (25:22)

Synchronous function. Lexically inside [resolveImport (23:23)](#fn-1977). 

Parameters:

- <code>reason:string</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: create an object with 3 property/spread entries: <code>{...edge,status:'unresolved' as const,reason}</code>; later properties overwrite earlier spread values.

<a id="fn-3126"></a>
### policy.aliases.filter callback (36:43)

Synchronous function. Lexically inside [resolveImport (23:23)](#fn-1977). Passed to <code>policy.aliases.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L36](#l36) Implicitly return: evaluate <code>spec===a.prefix &#124;&#124; /[/.]$/.test(a.prefix) &amp;&amp; spec.startsWith(a.prefix)</code> left to right with truthy short-circuiting.

<a id="fn-3866"></a>
### ['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap callback (44:121)

Synchronous function. Lexically inside [resolveImport (23:23)](#fn-1977). Passed to <code>['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>ext</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L44](#l44) Implicitly return: create an array from <code>[target+ext,target+'/index'+ext]</code>; spread elements insert the iterable values.

<a id="fn-4128"></a>
### [...new Set(candidates)].filter callback (46:51)

Synchronous function. Lexically inside [resolveImport (23:23)](#fn-1977). Passed to <code>[...new Set(candidates)].filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>p</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L46](#l46) Implicitly return: evaluate <code>!isExcluded(p,config.exclude) &amp;&amp; (language==='go' &#124;&#124; language==='csharp'?directories.has(p):files.has(p))</code> left to right with falsy short-circuiting.

<a id="fn-4787"></a>
### selected.slice(offset,Math.min(offset+32,128)).map callback (51:178)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>selected.slice(offset,Math.min(offset+32,128)).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L51](#l51) Implicitly return: create an object with 3 property/spread entries: <code>{id:'architecture'+i,path,kind:'source'}</code>; later properties overwrite earlier spread values.

<a id="fn-5191"></a>
### loaded.snapshots.find callback (56:42)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>loaded.snapshots.find</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>s</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L56](#l56) Implicitly return: compute <code>s.record.id===record.id</code> with the <code>===</code> operator.

<a id="fn-5402"></a>
### extracted.issues.map callback (59:50)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>extracted.issues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L59](#l59) Implicitly return: compute <code>record.path+': '+issue</code> with the <code>+</code> operator.

<a id="fn-5672"></a>
### extracted.imports.slice(0,remaining).map callback (62:76)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>extracted.imports.slice(0,remaining).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>o</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L62](#l62) Implicitly return: call the named operation with the supplied arguments: <code>resolveImport(record.path,o)</code>.

<a id="fn-5758"></a>
### result.dependencies.filter callback (65:42)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>result.dependencies.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>e</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L65](#l65) Implicitly return: compute <code>e.status==='resolved'</code> with the <code>===</code> operator.

<a id="fn-5788"></a>
### result.dependencies.filter(e=&gt;e.status==='resolved').map callback (65:72)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>result.dependencies.filter(e=&gt;e.status==='resolved').map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>e</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L65](#l65) Implicitly return: create an object with 4 property/spread entries: <code>{from:e.from,to:e.to!,line:e.line,excerpt:e.excerpt}</code>; later properties overwrite earlier spread values.

<a id="fn-5940"></a>
### assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map callback (66:93)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L66](#l66) Implicitly return: create an object with 2 property/spread entries: <code>{...b,status:b.evidence.length?'violation':'no-observed-violation'}</code>; later properties overwrite earlier spread values.

<a id="fn-6206"></a>
### policy.conventions.map callback (68:45)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>policy.conventions.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>rule</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L69](#l69) <code>evidence</code>: transform each element into a new array: <code>result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map(f=&gt;f.path)</code>.

Execution:

- [L69](#l69) Bind <code>evidence</code>: transform each element into a new array: <code>result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map(f=&gt;f.path)</code>.
- [L70](#l70) Return to the caller: create an object with 3 property/spread entries: <code>{...rule,status:evidence.length?'violation':'no-observed-violation',evidence}</code>; later properties overwrite earlier spread values.

<a id="fn-6253"></a>
### result.files.filter callback (69:40)

Synchronous function. Lexically inside [policy.conventions.map callback (68:45)](#fn-6206). Passed to <code>result.files.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L69](#l69) Implicitly return: evaluate <code>f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))</code> left to right with falsy short-circuiting.

<a id="fn-6381"></a>
### result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map callback (69:168)

Synchronous function. Lexically inside [policy.conventions.map callback (68:45)](#fn-6206). Passed to <code>result.files.filter(f=&gt;f.sha256!==null &amp;&amp; within(f.path,rule.within) &amp;&amp; !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>f</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L69](#l69) Implicitly return: read <code>f.path</code>.

<a id="fn-6543"></a>
### result.dependencies.some callback (72:55)

Synchronous function. Lexically inside [auditArchitecture (11:8)](#fn-601). Passed to <code>result.dependencies.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>d</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L72](#l72) Implicitly return: compute <code>d.status==='unresolved'</code> with the <code>===</code> operator.

## Module bindings

- [L9](#l9) <code>within</code>: create [within (9:14)](#fn-527); its body runs when called, not when this value is created.

## Directly importing tests

- [architecture-audit.test.ts](../../test/architecture-audit.test.ts)

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
   1 | import {createHash} from 'node:crypto';
   2 | import {posix} from 'node:path';
   3 | import {configSchema,matchesPattern,isExcluded,type ConfigInput} from './config.js';
   4 | import {inspectRepository} from './inspect-repository.js';
   5 | import {loadReferenceResources} from './reference-resources.js';
   6 | import {assessIntentPolicy} from './intent-policy.js';
   7 | import {dependencyLanguage,extractDependencyImports,type ImportObservation} from './dependency-imports.js';
   8 | import type {ArchitectureResult} from './architecture-contracts.js';
   9 | const within=(p:string,prefix:string)=>p===prefix || p.startsWith(prefix+'/');
  10 | 
  11 | export async function auditArchitecture(root:string,input:ConfigInput={},scope?:readonly string[]):Promise<ArchitectureResult|undefined> {
  12 |   const config=configSchema.parse(input),policy=config.architecture;if(!policy)return;
  13 |   const profile=await inspectRepository(root,{respectGitignore:config.respectGitignore,exclude:config.exclude});
  14 |   const files=new Set(profile.files.map(f=>f.path)),directories=new Set(profile.directories);
  15 |   const selected=[...new Set([...files,...(scope ?? []),...policy.files.filter(p=>!p.includes('*'))])]
  16 |     .filter(p=>(!scope || scope.includes(p)) && policy.files.some(pattern=>matchesPattern(p,pattern)) && !isExcluded(p,config.exclude)).sort();
  17 |   const result:ArchitectureResult={state:'checked',coverage:'configured-import-declarations-only',
  18 |     policySha256:createHash('sha256').update(JSON.stringify(policy)).digest('hex'),files:[],dependencies:[],boundaries:[],conventions:[],issues:[]};
  19 |   if(!selected.length)result.issues.push('No source paths selected; no architecture assessment performed.');
  20 |   for(const warning of profile.warnings)if(warning.code==='unreadable-directory' || warning.code==='symlink-skipped')
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
<a id="l37"></a>
<a id="l38"></a>
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |     result.issues.push(warning.path+': '+warning.code+'; inventory may be incomplete.');
  22 |   if(selected.length>128)result.issues.push('source-file-limit: '+selected.length+' selected; first 128 assessed.');
  23 |   const resolveImport=(from:string,observation:ImportObservation):ArchitectureResult['dependencies'][number]=>{
  24 |     const edge={from,line:observation.line,excerpt:observation.excerpt,...(observation.specifier===undefined?{}:{specifier:observation.specifier})};
  25 |     const unresolved=(reason:string)=>({...edge,status:'unresolved' as const,reason});
  26 |     const spec=observation.specifier,language=dependencyLanguage(from);
  27 |     if(observation.reason || !spec)return unresolved(observation.reason ?? 'dynamic-or-unsupported-import');
  28 |     if(spec.startsWith('/'))return unresolved('absolute-module-specifier');
  29 |     if(/[\\\u0000-\u0020:#?%]/.test(spec) && !(language==='javascript' && /^node:[\w/]+$/.test(spec)))return unresolved('unsupported-module-specifier');
  30 |     let target:string|undefined;
  31 |     if(language==='javascript' && spec.startsWith('.'))target=posix.join(posix.dirname(from),spec);
  32 |     else if(language==='python' && spec.startsWith('.')) {
  33 |       const dots=spec.match(/^\.+/)![0].length;
  34 |       target=posix.join(posix.dirname(from),...Array<string>(dots-1).fill('..'),spec.slice(dots).replace(/\./g,'/'));
  35 |     } else {
  36 |       const aliases=policy.aliases.filter(a=>spec===a.prefix || /[/.]$/.test(a.prefix) && spec.startsWith(a.prefix));
  37 |       if(aliases.length>1)return unresolved('ambiguous-alias');
  38 |       if(aliases.length) {
  39 |         const alias=aliases[0]!,suffix=spec.slice(alias.prefix.length);
  40 |         target=posix.join(alias.target,['python','java','csharp'].includes(language!)?suffix.replace(/\./g,'/'):suffix);
```

<a id="l41"></a>
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
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |       } else return {...edge,status:'external',reason:'Unmapped non-relative import; outside configured local graph.'};
  42 |     }
  43 |     if(target==='.' || target==='..' || target.startsWith('../') || posix.isAbsolute(target))return unresolved('outside-repository');
  44 |     const candidates=language==='javascript'?[target,...['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap(ext=>[target+ext,target+'/index'+ext]),...(/\.[cm]?js$/.test(target)?[target.replace(/js$/,'ts')]:[])]:
  45 |       language==='python'?[target+'.py',target+'/__init__.py']:language==='java'?[target+'.java']:[target];
  46 |     const matches=[...new Set(candidates)].filter(p=>!isExcluded(p,config.exclude) && (language==='go' || language==='csharp'?directories.has(p):files.has(p)));
  47 |     if(matches.length!==1)return unresolved(matches.length?'ambiguous-local-target':'local-target-unavailable');
  48 |     return {...edge,status:'resolved',to:matches[0]!,reason:language==='csharp'?'Mapped namespace declaration; actual type use is not assessed.':'Resolved configured local import.'};
  49 |   };
  50 |   for(let offset=0;offset<Math.min(selected.length,128);offset+=32) {
  51 |     const loaded=await loadReferenceResources(root,{respectGitignore:config.respectGitignore,exclude:config.exclude,resources:selected.slice(offset,Math.min(offset+32,128)).map((path,i)=>({id:'architecture'+i,path,kind:'source'}))});
  52 |     for(const record of loaded.report.resources) {
  53 |       const file={path:record.path,sha256:record.sha256,status:record.status as string};result.files.push(file);
  54 |       if(record.status!=='loaded'){result.issues.push(record.path+': '+record.status);continue;}
  55 |       if(!policy.boundaries.length)continue;
  56 |       const source=loaded.snapshots.find(s=>s.record.id===record.id)!;
  57 |       const extracted=extractDependencyImports(source.content,record.path);
  58 |       if(extracted.issues.length)file.status='partial';
  59 |       result.issues.push(...extracted.issues.map(issue=>record.path+': '+issue));
  60 |       const remaining=10000-result.dependencies.length;
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l72"></a>
<a id="l73"></a>

```text
  61 |       if(extracted.imports.length>remaining)result.issues.push(record.path+': total-import-count-limit');
  62 |       result.dependencies.push(...extracted.imports.slice(0,remaining).map(o=>resolveImport(record.path,o)));
  63 |     }
  64 |   }
  65 |   const edges=result.dependencies.filter(e=>e.status==='resolved').map(e=>({from:e.from,to:e.to!,line:e.line,excerpt:e.excerpt}));
  66 |   result.boundaries=assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map(b=>({...b,status:b.evidence.length?'violation':'no-observed-violation'}));
  67 |   const styles={'snake_case':/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/,'kebab-case':/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,'PascalCase':/^[A-Z][a-zA-Z0-9]*$/};
  68 |   result.conventions=policy.conventions.map(rule=>{
  69 |     const evidence=result.files.filter(f=>f.sha256!==null && within(f.path,rule.within) && !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map(f=>f.path);
  70 |     return {...rule,status:evidence.length?'violation':'no-observed-violation',evidence};
  71 |   });
  72 |   if(result.issues.length || result.dependencies.some(d=>d.status==='unresolved'))result.state='partial';
  73 |   return result;
  74 | }
  75 | 
```
