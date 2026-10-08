# src/python-calls.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Lezer parses Python without an interpreter. The extractor identifies top-level Requests/HTTPX module imports, tracks simple fresh Session/Client creations and conservatively invalidates bindings on other uses. It splits positional/keyword syntax, applies client-specific supported argument rules, accepts only simple quoted literals, and derives query names from literal dictionaries. Requests None removes a query key; HTTPX None retains its name in this supported model.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `f19bb7fdcd69dc750cc7ca74dfc59b6994438887b6aef8d9103cb6041e524410`.

This chapter inventories **22 function bodies/callbacks**, **79 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>@lezer/python</code>: <code>parser</code>.
- <code>@lezer/common</code>: <code>SyntaxNode</code> (type only).
- <code>./contract-adapter-types.js</code>: <code>CallExtraction</code> (type only), <code>CallObservation</code> (type only).

## Module execution

- [L5](#l5) Bind <code>children</code>: create [children (5:16)](#fn-182); its body runs when called, not when this value is created.
- [L10](#l10) Bind <code>same</code>: create [same (10:12)](#fn-387); its body runs when called, not when this value is created.
- [L11](#l11) Bind <code>verbs</code>: construct <code>Set</code> using <code>['get','post','put','patch','delete','head','options','request']</code>; this creates the local instance used below.

## Function index

- [children (5:16)](#fn-182)
- [same (10:12)](#fn-387)
- [extractPythonCalls (14:8)](#fn-698)
- [nodes.some callback (19:17)](#fn-1095)
- [text (20:14)](#fn-1187)
- [literal (22:17)](#fn-1350)
- [nodes.filter callback (29:34)](#fn-1724)
- [values.filter callback (36:70)](#fn-2350)
- [modules.some callback (37:21)](#fn-2411)
- [[...imports.values()].some callback (44:35)](#fn-2820)
- [nodes.some callback (49:17)](#fn-3164)
- [constructor (52:21)](#fn-3436)
- [scope (59:15)](#fn-4004)
- [nodes.filter callback (71:71)](#fn-5164)
- [nodes.filter callback (77:34)](#fn-5595)
- [nodes.filter(n=&gt;n.name==='CallExpression').sort callback (77:69)](#fn-5630)
- [[...sessions.values()].some callback (84:58)](#fn-6131)
- [groups.filter callback (101:38)](#fn-7757)
- [positional.forEach callback (110:24)](#fn-8312)
- [[...keywords.keys()].some callback (112:34)](#fn-8718)
- [['data','json','files','content'].some callback (113:123)](#fn-8878)
- [['verify','trust_env'].some callback (113:189)](#fn-8944)

<a id="fn-182"></a>
### children (5:16)

Synchronous function. Defined in module scope. 

Parameters:

- <code>node:SyntaxNode</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L6](#l6) <code>result:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
- [L7](#l7) <code>child</code>: read <code>node.firstChild</code>.

Execution:

- [L6](#l6) Bind <code>result:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
- [L7](#l7) Initialize <code>let child=node.firstChild</code>; repeat while <code>child</code>; after each normal iteration evaluate <code>child=child.nextSibling</code>:
  - [L7](#l7) If <code>child.name!=='Comment'</code> is truthy:
    - [L7](#l7) append values to the existing array: <code>result.push(child)</code>.
- [L8](#l8) Return to the caller: evaluate <code>result</code>.

<a id="fn-387"></a>
### same (10:12)

Synchronous function. Defined in module scope. 

Parameters:

- <code>a:SyntaxNode&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.
- <code>b:SyntaxNode&#124;undefined&#124;null</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L10](#l10) Implicitly return: evaluate <code>!!a &amp;&amp; !!b &amp;&amp; a.from===b.from &amp;&amp; a.to===b.to &amp;&amp; a.name===b.name</code> left to right with falsy short-circuiting.

<a id="fn-698"></a>
### extractPythonCalls (14:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>content:string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L15](#l15) <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues:[]}</code>; later properties overwrite earlier spread values.
- [L16](#l16) <code>root:SyntaxNode</code>: leave the value undefined until a later assignment.
- [L17](#l17) <code>nodes:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
- [L17](#l17) <code>stack</code>: create an array from <code>[root]</code>; spread elements insert the iterable values.
- [L18](#l18) <code>node</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.
- [L20](#l20) <code>text</code>: create [text (20:14)](#fn-1187); its body runs when called, not when this value is created.
- [L22](#l22) <code>literal</code>: create [literal (22:17)](#fn-1350); its body runs when called, not when this value is created.
- [L28](#l28) <code>imports</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L29](#l29) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.name==='ImportStatement')</code> at the start of each loop iteration.
- [L30](#l30) <code>parts</code>: call the named operation with the supplied arguments: <code>children(node)</code>.
- [L30](#l30) <code>values</code>: transform each element into a new array: <code>parts.map(text)</code>.
- [L32](#l32) <code>alias</code>: use <code>values[3]</code> unless null/undefined, then evaluate <code>values[1]!</code>.
- [L36](#l36) <code>modules</code>: test <code>values[0]==='from'</code>; choose <code>values.slice(1,2)</code> when truthy, otherwise <code>values.filter((_value,i)=&gt;i===1 &#124;&#124; values[i-1]===',')</code>.
- [L39](#l39) <code>aliases</code>: construct <code>Set</code> using <code>['requests','httpx',...imports.keys()]</code>; this creates the local instance used below.
- [L40](#l40) <code>ambiguous</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L41](#l41) <code>node</code>: receive the next iterable value from <code>nodes</code> at the start of each loop iteration.
- [L43](#l43) <code>alias</code>: call the named operation with the supplied arguments: <code>text(node)</code>.
- [L43](#l43) <code>parent</code>: read <code>node.parent</code>.
- [L50](#l50) <code>alias</code>: receive the next iterable value from <code>aliases</code> at the start of each loop iteration.
- [L52](#l52) <code>constructor</code>: create [constructor (52:21)](#fn-3436); its body runs when called, not when this value is created.
- [L59](#l59) <code>scope</code>: create [scope (59:15)](#fn-4004); its body runs when called, not when this value is created.
- [L60](#l60) <code>sessions</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L61](#l61) <code>node</code>: receive the next iterable value from <code>nodes</code> at the start of each loop iteration.
- [L62](#l62) <code>parts</code>: call the named operation with the supplied arguments: <code>children(node)</code>.
- [L64](#l64) <code>creation</code>: read <code>parts[2]</code>; the TypeScript assertion adds no runtime validation.
- [L64](#l64) <code>info</code>: call the named operation with the supplied arguments: <code>constructor(creation)</code>.
- [L65](#l65) <code>name</code>: read <code>parts[0]</code>.
- [L67](#l67) <code>creation</code>: read <code>parts[1]</code>; the TypeScript assertion adds no runtime validation.
- [L67](#l67) <code>info</code>: call the named operation with the supplied arguments: <code>constructor(creation)</code>.
- [L68](#l68) <code>name</code>: read <code>parts[3]</code>.
- [L71](#l71) <code>[name,binding]</code>: receive the next iterable value from <code>sessions</code> at the start of each loop iteration; destructure that value into the displayed names.
- [L71](#l71) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.name==='VariableName' &amp;&amp; text(n)===name)</code> at the start of each loop iteration.
- [L73](#l73) <code>parent</code>: read <code>node.parent</code>.
- [L77](#l77) <code>node</code>: receive the next iterable value from <code>nodes.filter(n=&gt;n.name==='CallExpression').sort((a,b)=&gt;a.from-b.from)</code> at the start of each loop iteration.
- [L78](#l78) <code>[callee,args]</code>: call the named operation with the supplied arguments: <code>children(node)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L80](#l80) <code>member</code>: call the named operation with the supplied arguments: <code>children(callee)</code>.
- [L80](#l80) <code>receiver</code>: read <code>member[0]</code>.
- [L81](#l81) <code>session</code>: test <code>receiver?.name==='VariableName'</code>; choose <code>sessions.get(text(receiver))</code> when truthy, otherwise <code>undefined</code>.
- [L82](#l82) <code>inline</code>: call the named operation with the supplied arguments: <code>constructor(receiver)</code>.
- [L85](#l85) <code>alias</code>: use <code>inline?.alias</code> unless null/undefined, then evaluate <code>text(receiver)</code>.
- [L85](#l85) <code>method</code>: test <code>member.length===3 &amp;&amp; member[1]!.name==='.'</code>; choose <code>text(member[2]!)</code> when truthy, otherwise <code>''</code>.
- [L86](#l86) <code>library</code>: use <code>session?.library ?? inline?.library ?? imports.get(alias)?.library</code> unless null/undefined, then evaluate <code>'requests'</code>.
- [L89](#l89) <code>line</code>: read <code>content.slice(0,node.from).split(/\r\n&#124;\n&#124;\r/).length</code>.
- [L90](#l90) <code>end</code>: read <code>content.slice(0,node.to).split(/\r\n&#124;\n&#124;\r/).length</code>.
- [L91](#l91) <code>excerpt</code>: concatenate the elements with the supplied separator: <code>content.split(/\r\n&#124;\n&#124;\r/).slice(line-1,end).join('\n')</code>.
- [L93](#l93) <code>call:CallObservation</code>: create an object with 2 property/spread entries: <code>{line,excerpt}</code>; later properties overwrite earlier spread values.
- [L94](#l94) <code>valid</code>: test <code>session</code>; choose <code>session.valid &amp;&amp; same(session.owner,scope(node)) &amp;&amp; session.creation.to&lt;node.from</code> when truthy, otherwise <code>inline?inline.valid:imports.has(alias) &amp;&amp; !ambiguous.has(alias)</code>.
- [L97](#l97) <code>parts</code>: select a range without mutating the original array/string: <code>children(args).slice(1,-1)</code>.
- [L97](#l97) <code>groups:SyntaxNode[][]</code>: create an array from <code>[[]]</code>; spread elements insert the iterable values.
- [L98](#l98) <code>part</code>: receive the next iterable value from <code>parts</code> at the start of each loop iteration.
- [L99](#l99) <code>positional:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
- [L99](#l99) <code>keywords</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L100](#l100) <code>invalid</code>: use the literal <code>false</code>.
- [L100](#l100) <code>sawKeyword</code>: use the literal <code>false</code>.
- [L101](#l101) <code>group</code>: receive the next iterable value from <code>groups.filter(g=&gt;g.length)</code> at the start of each loop iteration.
- [L104](#l104) <code>key</code>: call the named operation with the supplied arguments: <code>text(group[0]!)</code>.
- [L108](#l108) <code>names</code>: test <code>method==='request'</code>; choose <code>['method','url']</code> when truthy, otherwise <code>method==='get' &amp;&amp; library==='requests' &amp;&amp; !session &amp;&amp; !inline?['url','params']:['url']</code>.
- [L111](#l111) <code>allowed</code>: construct <code>Set</code> using <code>['url','params','data','json','headers','cookies','files','auth','timeout',...(library==='requests'?['allow_redirects','proxies','verify','stream','cert']:['content','follow_redirects','verify','trust_env']),...(method==='request'?['method']:[])]</code>; this creates the local instance used below.
- [L115](#l115) <code>url</code>: call the named operation with the supplied arguments: <code>literal(keywords.get('url'))</code>.
- [L120](#l120) <code>verb</code>: test <code>method==='request'</code>; choose <code>literal(keywords.get('method'))</code> when truthy, otherwise <code>method</code>.
- [L123](#l123) <code>params</code>: call the named operation with the supplied arguments: <code>keywords.get('params')</code>.
- [L126](#l126) <code>entries</code>: select a range without mutating the original array/string: <code>children(params).slice(1,-1)</code>.
- [L126](#l126) <code>queryNames</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L127](#l127) <code>i</code>: use the literal <code>0</code>.
- [L128](#l128) <code>key</code>: call the named operation with the supplied arguments: <code>literal(entries[i])</code>.
- [L128](#l128) <code>colon</code>: read <code>entries[i+1]</code>.
- [L128](#l128) <code>value</code>: read <code>entries[i+2]</code>.
- [L130](#l130) <code>scalar</code>: evaluate <code>literal(value)!==undefined &#124;&#124; value.name==='Boolean' &#124;&#124; value.name==='Number' &amp;&amp; /^\d+(?:\.\d+)?$/.test(text(value))</code> left to right with truthy short-circuiting.

Execution:

- [L15](#l15) Bind <code>result:CallExtraction</code>: create an object with 2 property/spread entries: <code>{calls:[],issues:[]}</code>; later properties overwrite earlier spread values.
- [L16](#l16) Bind <code>root:SyntaxNode</code>: leave the value undefined until a later assignment.
- [L16](#l16) Run the protected block:
  - [L16](#l16) update <code>root</code> with <code>parser.parse(content).topNode</code> using <code>=</code>; this mutation is visible to later statements.
- [L16](#l16) If it throws:
  - [L16](#l16) Return to the caller: create an object with 2 property/spread entries: <code>{calls:[],issues:['unsupported-or-invalid-python']}</code>; later properties overwrite earlier spread values.
- [L17](#l17) Bind <code>nodes:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
- [L17](#l17) Bind <code>stack</code>: create an array from <code>[root]</code>; spread elements insert the iterable values.
- [L18](#l18) Repeat while <code>stack.length</code>:
  - [L18](#l18) Bind <code>node</code>: call the named operation with the supplied arguments: <code>stack.pop()</code>; the TypeScript assertion adds no runtime validation.
  - [L18](#l18) append values to the existing array: <code>nodes.push(node)</code>.
  - [L18](#l18) append values to the existing array: <code>stack.push(...children(node))</code>.
- [L19](#l19) If <code>nodes.some(n=&gt;n.type.isError)</code> is truthy:
  - [L19](#l19) Return to the caller: create an object with 2 property/spread entries: <code>{calls:[],issues:['unsupported-or-invalid-python']}</code>; later properties overwrite earlier spread values.
- [L20](#l20) Bind <code>text</code>: create [text (20:14)](#fn-1187); its body runs when called, not when this value is created.
- [L22](#l22) Bind <code>literal</code>: create [literal (22:17)](#fn-1350); its body runs when called, not when this value is created.
- [L28](#l28) Bind <code>imports</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L29](#l29) Iterate <code>nodes.filter(n=&gt;n.name==='ImportStatement')</code> values, binding <code>const node</code> for each iteration:
  - [L30](#l30) Bind <code>parts</code>: call the named operation with the supplied arguments: <code>children(node)</code>.
  - [L30](#l30) Bind <code>values</code>: transform each element into a new array: <code>parts.map(text)</code>.
  - [L31](#l31) If <code>values[0]==='import' &amp;&amp; ['requests','httpx'].includes(values[1] ?? '') &amp;&amp; (parts.length===2 &#124;&#124; parts.length===4 &amp;&amp; values[2]==='as') &amp;&amp; node.parent?.name==='Script'</code> is truthy:
    - [L32](#l32) Bind <code>alias</code>: use <code>values[3]</code> unless null/undefined, then evaluate <code>values[1]!</code>.
    - [L33](#l33) If <code>imports.has(alias)</code> is truthy:
      - [L33](#l33) append values to the existing array: <code>result.issues.push('duplicate-requests-import')</code>.
    - [L34](#l34) store/replace a keyed entry in the Map: <code>imports.set(alias,{node,library:values[1]!})</code>.
  - [L31](#l31) Otherwise:
    - [L35](#l35) If <code>values.includes('requests') &#124;&#124; values.includes('httpx')</code> is truthy:
      - [L35](#l35) append values to the existing array: <code>result.issues.push('unsupported-requests-import')</code>.
  - [L36](#l36) Bind <code>modules</code>: test <code>values[0]==='from'</code>; choose <code>values.slice(1,2)</code> when truthy, otherwise <code>values.filter((_value,i)=&gt;i===1 &#124;&#124; values[i-1]===',')</code>.
  - [L37](#l37) If <code>modules.some(value=&gt;['aiohttp','urllib','http'].includes(value.split('.')[0]!))</code> is truthy:
    - [L37](#l37) append values to the existing array: <code>result.issues.push('unsupported-python-http-client')</code>.
- [L39](#l39) Bind <code>aliases</code>: construct <code>Set</code> using <code>['requests','httpx',...imports.keys()]</code>; this creates the local instance used below.
- [L40](#l40) Bind <code>ambiguous</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
- [L41](#l41) Iterate <code>nodes</code> values, binding <code>const node</code> for each iteration:
  - [L42](#l42) If <code>node.name!=='VariableName' &#124;&#124; !aliases.has(text(node))</code> is truthy:
    - [L42](#l42) Skip the rest of this iteration and advance the enclosing loop.
  - [L43](#l43) Bind <code>alias</code>: call the named operation with the supplied arguments: <code>text(node)</code>.
  - [L43](#l43) Bind <code>parent</code>: read <code>node.parent</code>.
  - [L44](#l44) If <code>[...imports.values()].some(importNode=&gt;same(parent,importNode.node))</code> is truthy:
    - [L44](#l44) Skip the rest of this iteration and advance the enclosing loop.
  - [L45](#l45) If <code>parent?.name==='MemberExpression' &amp;&amp; same(parent.firstChild,node) &amp;&amp; parent.parent?.name==='CallExpression' &amp;&amp; same(parent.parent.firstChild,parent)</code> is truthy:
    - [L45](#l45) Skip the rest of this iteration and advance the enclosing loop.
  - [L46](#l46) insert a unique value in the Set: <code>ambiguous.add(alias)</code>.
- [L49](#l49) If <code>nodes.some(n=&gt;n.name==='CallExpression' &amp;&amp; ['exec','eval','globals','locals','setattr','delattr'].includes(text(n.firstChild!)))</code> is truthy:
  - [L50](#l50) Iterate <code>aliases</code> values, binding <code>const alias</code> for each iteration:
    - [L50](#l50) insert a unique value in the Set: <code>ambiguous.add(alias)</code>.
- [L51](#l51) If <code>ambiguous.size</code> is truthy:
  - [L51](#l51) append values to the existing array: <code>result.issues.push('requests-binding-or-alias-unresolved')</code>.
- [L52](#l52) Bind <code>constructor</code>: create [constructor (52:21)](#fn-3436); its body runs when called, not when this value is created.
- [L59](#l59) Bind <code>scope</code>: create [scope (59:15)](#fn-4004); its body runs when called, not when this value is created.
- [L60](#l60) Bind <code>sessions</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
- [L61](#l61) Iterate <code>nodes</code> values, binding <code>const node</code> for each iteration:
  - [L62](#l62) Bind <code>parts</code>: call the named operation with the supplied arguments: <code>children(node)</code>.
  - [L63](#l63) If <code>node.name==='AssignStatement' &amp;&amp; parts.length===3 &amp;&amp; parts[0]?.name==='VariableName' &amp;&amp; parts[1]?.name==='AssignOp'</code> is truthy:
    - [L64](#l64) Bind <code>creation</code>: read <code>parts[2]</code>; the TypeScript assertion adds no runtime validation.
    - [L64](#l64) Bind <code>info</code>: call the named operation with the supplied arguments: <code>constructor(creation)</code>.
    - [L64](#l64) If <code>!info</code> is truthy:
      - [L64](#l64) Skip the rest of this iteration and advance the enclosing loop.
    - [L65](#l65) Bind <code>name</code>: read <code>parts[0]</code>.
    - [L65](#l65) store/replace a keyed entry in the Map: <code>sessions.set(text(name),{name,creation,owner:scope(node),library:info.library,valid:info.valid &amp;&amp; !sessions.has(text(name))})</code>.
  - [L63](#l63) Otherwise:
    - [L66](#l66) If <code>node.name==='WithStatement' &amp;&amp; parts.length===5 &amp;&amp; parts[2]?.name==='as' &amp;&amp; parts[3]?.name==='VariableName' &amp;&amp; parts[4]?.name==='Body'</code> is truthy:
      - [L67](#l67) Bind <code>creation</code>: read <code>parts[1]</code>; the TypeScript assertion adds no runtime validation.
      - [L67](#l67) Bind <code>info</code>: call the named operation with the supplied arguments: <code>constructor(creation)</code>.
      - [L67](#l67) If <code>!info</code> is truthy:
        - [L67](#l67) Skip the rest of this iteration and advance the enclosing loop.
      - [L68](#l68) Bind <code>name</code>: read <code>parts[3]</code>.
      - [L68](#l68) store/replace a keyed entry in the Map: <code>sessions.set(text(name),{name,creation,owner:parts[4],library:info.library,valid:info.valid &amp;&amp; !sessions.has(text(name))})</code>.
- [L71](#l71) Iterate <code>sessions</code> values, binding <code>const [name,binding]</code> for each iteration:
  - [L71](#l71) Iterate <code>nodes.filter(n=&gt;n.name==='VariableName' &amp;&amp; text(n)===name)</code> values, binding <code>const node</code> for each iteration:
    - [L72](#l72) If <code>same(node,binding.name)</code> is truthy:
      - [L72](#l72) Skip the rest of this iteration and advance the enclosing loop.
    - [L73](#l73) Bind <code>parent</code>: read <code>node.parent</code>.
    - [L74](#l74) If <code>parent?.name==='MemberExpression' &amp;&amp; same(parent.firstChild,node) &amp;&amp; parent.parent?.name==='CallExpression' &amp;&amp; same(parent.parent.firstChild,parent) &amp;&amp; (verbs.has(text(children(parent)[2]!)) &#124;&#124; text(children(parent)[2]!)==='close')</code> is truthy:
      - [L74](#l74) Skip the rest of this iteration and advance the enclosing loop.
    - [L75](#l75) update <code>binding.valid</code> with <code>false</code> using <code>=</code>; this mutation is visible to later statements.
- [L77](#l77) Iterate <code>nodes.filter(n=&gt;n.name==='CallExpression').sort((a,b)=&gt;a.from-b.from)</code> values, binding <code>const node</code> for each iteration:
  - [L78](#l78) Bind <code>[callee,args]</code>: call the named operation with the supplied arguments: <code>children(node)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
  - [L79](#l79) If <code>callee?.name!=='MemberExpression' &#124;&#124; args?.name!=='ArgList'</code> is truthy:
    - [L79](#l79) Skip the rest of this iteration and advance the enclosing loop.
  - [L80](#l80) Bind <code>member</code>: call the named operation with the supplied arguments: <code>children(callee)</code>.
  - [L80](#l80) Bind <code>receiver</code>: read <code>member[0]</code>.
  - [L81](#l81) Bind <code>session</code>: test <code>receiver?.name==='VariableName'</code>; choose <code>sessions.get(text(receiver))</code> when truthy, otherwise <code>undefined</code>.
  - [L82](#l82) Bind <code>inline</code>: call the named operation with the supplied arguments: <code>constructor(receiver)</code>.
  - [L83](#l83) If <code>!receiver &#124;&#124; !session &amp;&amp; !inline &amp;&amp; (receiver.name!=='VariableName' &#124;&#124; !aliases.has(text(receiver)))</code> is truthy:
    - [L83](#l83) Skip the rest of this iteration and advance the enclosing loop.
  - [L84](#l84) If <code>constructor(node) &amp;&amp; ([...sessions.values()].some(binding=&gt;same(binding.creation,node)) &#124;&#124; node.parent?.name==='MemberExpression' &amp;&amp; same(node.parent.firstChild,node))</code> is truthy:
    - [L84](#l84) Skip the rest of this iteration and advance the enclosing loop.
  - [L85](#l85) Bind <code>alias</code>: use <code>inline?.alias</code> unless null/undefined, then evaluate <code>text(receiver)</code>.
  - [L85](#l85) Bind <code>method</code>: test <code>member.length===3 &amp;&amp; member[1]!.name==='.'</code>; choose <code>text(member[2]!)</code> when truthy, otherwise <code>''</code>.
  - [L86](#l86) Bind <code>library</code>: use <code>session?.library ?? inline?.library ?? imports.get(alias)?.library</code> unless null/undefined, then evaluate <code>'requests'</code>.
  - [L87](#l87) If <code>session &amp;&amp; method==='close' &amp;&amp; children(args).length===2</code> is truthy:
    - [L87](#l87) Skip the rest of this iteration and advance the enclosing loop.
  - [L88](#l88) If <code>result.calls.length&gt;=128</code> is truthy:
    - [L88](#l88) append values to the existing array: <code>result.issues.push('call-count-limit')</code>.
    - [L88](#l88) Leave the enclosing loop/switch.
  - [L89](#l89) Bind <code>line</code>: read <code>content.slice(0,node.from).split(/\r\n&#124;\n&#124;\r/).length</code>.
  - [L90](#l90) Bind <code>end</code>: read <code>content.slice(0,node.to).split(/\r\n&#124;\n&#124;\r/).length</code>.
  - [L91](#l91) Bind <code>excerpt</code>: concatenate the elements with the supplied separator: <code>content.split(/\r\n&#124;\n&#124;\r/).slice(line-1,end).join('\n')</code>.
  - [L92](#l92) If <code>excerpt.length&gt;2048</code> is truthy:
    - [L92](#l92) append values to the existing array: <code>result.issues.push('source-excerpt-limit')</code>.
    - [L92](#l92) Skip the rest of this iteration and advance the enclosing loop.
  - [L93](#l93) Bind <code>call:CallObservation</code>: create an object with 2 property/spread entries: <code>{line,excerpt}</code>; later properties overwrite earlier spread values.
  - [L93](#l93) append values to the existing array: <code>result.calls.push(call)</code>.
  - [L94](#l94) Bind <code>valid</code>: test <code>session</code>; choose <code>session.valid &amp;&amp; same(session.owner,scope(node)) &amp;&amp; session.creation.to&lt;node.from</code> when truthy, otherwise <code>inline?inline.valid:imports.has(alias) &amp;&amp; !ambiguous.has(alias)</code>.
  - [L95](#l95) If <code>!valid &#124;&#124; result.issues.includes('unsupported-requests-import') &#124;&#124; result.issues.includes('duplicate-requests-import')</code> is truthy:
    - [L95](#l95) update <code>call.reason</code> with <code>'requests-binding-or-alias-unresolved'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L95](#l95) Skip the rest of this iteration and advance the enclosing loop.
  - [L96](#l96) If <code>!verbs.has(method)</code> is truthy:
    - [L96](#l96) update <code>call.reason</code> with <code>'unsupported-requests-client'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L96](#l96) Skip the rest of this iteration and advance the enclosing loop.
  - [L97](#l97) Bind <code>parts</code>: select a range without mutating the original array/string: <code>children(args).slice(1,-1)</code>.
  - [L97](#l97) Bind <code>groups:SyntaxNode[][]</code>: create an array from <code>[[]]</code>; spread elements insert the iterable values.
  - [L98](#l98) Iterate <code>parts</code> values, binding <code>const part</code> for each iteration:
    - [L98](#l98) If <code>part.name===','</code> is truthy:
      - [L98](#l98) append values to the existing array: <code>groups.push([])</code>.
    - [L98](#l98) Otherwise:
      - [L98](#l98) append values to the existing array: <code>groups.at(-1)!.push(part)</code>.
  - [L99](#l99) Bind <code>positional:SyntaxNode[]</code>: create a new empty array to accumulate ordered results.
  - [L99](#l99) Bind <code>keywords</code>: construct <code>Map</code> using <code></code>; this creates the local instance used below.
  - [L100](#l100) Bind <code>invalid</code>: use the literal <code>false</code>.
  - [L100](#l100) Bind <code>sawKeyword</code>: use the literal <code>false</code>.
  - [L101](#l101) Iterate <code>groups.filter(g=&gt;g.length)</code> values, binding <code>const group</code> for each iteration:
    - [L102](#l102) If <code>group.length===1 &amp;&amp; !sawKeyword</code> is truthy:
      - [L102](#l102) append values to the existing array: <code>positional.push(group[0]!)</code>.
    - [L102](#l102) Otherwise:
      - [L103](#l103) If <code>group.length===3 &amp;&amp; group[0]!.name==='VariableName' &amp;&amp; group[1]!.name==='AssignOp'</code> is truthy:
        - [L104](#l104) Bind <code>key</code>: call the named operation with the supplied arguments: <code>text(group[0]!)</code>.
        - [L104](#l104) If <code>keywords.has(key)</code> is truthy:
          - [L104](#l104) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
        - [L105](#l105) store/replace a keyed entry in the Map: <code>keywords.set(key,group[2]!)</code>.
        - [L105](#l105) update <code>sawKeyword</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
      - [L103](#l103) Otherwise:
        - [L106](#l106) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L108](#l108) Bind <code>names</code>: test <code>method==='request'</code>; choose <code>['method','url']</code> when truthy, otherwise <code>method==='get' &amp;&amp; library==='requests' &amp;&amp; !session &amp;&amp; !inline?['url','params']:['url']</code>.
  - [L109](#l109) If <code>positional.length&gt;names.length</code> is truthy:
    - [L109](#l109) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L110](#l110) call the named operation with the supplied arguments: <code>positional.forEach((arg,i)=&gt;{const key=names[i];if(key){if(keywords.has(key))invalid=true;keywords.set(key,arg);}})</code>.
  - [L111](#l111) Bind <code>allowed</code>: construct <code>Set</code> using <code>['url','params','data','json','headers','cookies','files','auth','timeout',...(library==='requests'?['allow_redirects','proxies','verify','stream','cert']:['content','follow_redirects','verify','trust_env']),...(method==='request'?['method']:[])]</code>; this creates the local instance used below.
  - [L112](#l112) If <code>[...keywords.keys()].some(key=&gt;!allowed.has(key))</code> is truthy:
    - [L112](#l112) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L113](#l113) If <code>library==='httpx' &amp;&amp; (['get','head','options','delete'].includes(method) &amp;&amp; ['data','json','files','content'].some(key=&gt;keywords.has(key)) &#124;&#124; session &amp;&amp; ['verify','trust_env'].some(key=&gt;keywords.has(key)))</code> is truthy:
    - [L113](#l113) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L114](#l114) If <code>invalid</code> is truthy:
    - [L114](#l114) update <code>call.reason</code> with <code>'unsupported-or-dynamic-arguments'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L114](#l114) Skip the rest of this iteration and advance the enclosing loop.
  - [L115](#l115) Bind <code>url</code>: call the named operation with the supplied arguments: <code>literal(keywords.get('url'))</code>.
  - [L116](#l116) If <code>url===undefined</code> is truthy:
    - [L116](#l116) update <code>call.reason</code> with <code>'dynamic-url'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L116](#l116) Skip the rest of this iteration and advance the enclosing loop.
  - [L117](#l117) update <code>call.url</code> with <code>url</code> using <code>=</code>; this mutation is visible to later statements.
  - [L119](#l119) If <code>/[\\\s\u0000-\u001f\u007f]/.test(url)</code> is truthy:
    - [L119](#l119) update <code>call.reason</code> with <code>'unsupported-url-shape'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L119](#l119) Skip the rest of this iteration and advance the enclosing loop.
  - [L120](#l120) Bind <code>verb</code>: test <code>method==='request'</code>; choose <code>literal(keywords.get('method'))</code> when truthy, otherwise <code>method</code>.
  - [L121](#l121) If <code>verb===undefined</code> is truthy:
    - [L121](#l121) update <code>call.reason</code> with <code>'dynamic-method'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L121](#l121) Skip the rest of this iteration and advance the enclosing loop.
  - [L122](#l122) update <code>call.method</code> with <code>verb.toUpperCase()</code> using <code>=</code>; this mutation is visible to later statements.
  - [L123](#l123) Bind <code>params</code>: call the named operation with the supplied arguments: <code>keywords.get('params')</code>.
  - [L124](#l124) If <code>!params &#124;&#124; params.name==='None'</code> is truthy:
    - [L124](#l124) Skip the rest of this iteration and advance the enclosing loop.
  - [L125](#l125) If <code>params.name!=='DictionaryExpression'</code> is truthy:
    - [L125](#l125) update <code>call.reason</code> with <code>'dynamic-query-parameters'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L125](#l125) Skip the rest of this iteration and advance the enclosing loop.
  - [L126](#l126) Bind <code>entries</code>: select a range without mutating the original array/string: <code>children(params).slice(1,-1)</code>.
  - [L126](#l126) Bind <code>queryNames</code>: construct <code>Set</code> using <code></code>; this creates the local instance used below.
  - [L127](#l127) Initialize <code>let i=0</code>; repeat while <code>i&lt;entries.length</code>; after each normal iteration evaluate <code></code>:
    - [L128](#l128) Bind <code>key</code>: call the named operation with the supplied arguments: <code>literal(entries[i])</code>.
    - [L128](#l128) Bind <code>colon</code>: read <code>entries[i+1]</code>.
    - [L128](#l128) Bind <code>value</code>: read <code>entries[i+2]</code>.
    - [L129](#l129) If <code>key===undefined &#124;&#124; colon?.name!==':' &#124;&#124; !value</code> is truthy:
      - [L129](#l129) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
      - [L129](#l129) Leave the enclosing loop/switch.
    - [L130](#l130) Bind <code>scalar</code>: evaluate <code>literal(value)!==undefined &#124;&#124; value.name==='Boolean' &#124;&#124; value.name==='Number' &amp;&amp; /^\d+(?:\.\d+)?$/.test(text(value))</code> left to right with truthy short-circuiting.
    - [L131](#l131) If <code>value.name==='None' &amp;&amp; library==='requests'</code> is truthy:
      - [L131](#l131) remove the keyed entry/value: <code>queryNames.delete(key)</code>.
    - [L131](#l131) Otherwise:
      - [L132](#l132) If <code>value.name==='None'</code> is truthy:
        - [L132](#l132) insert a unique value in the Set: <code>queryNames.add(key)</code>.
      - [L132](#l132) Otherwise:
        - [L133](#l133) If <code>scalar</code> is truthy:
          - [L133](#l133) insert a unique value in the Set: <code>queryNames.add(key)</code>.
        - [L133](#l133) Otherwise:
          - [L134](#l134) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
          - [L134](#l134) Leave the enclosing loop/switch.
    - [L135](#l135) update <code>i</code> with <code>3</code> using <code>+=</code>; this mutation is visible to later statements.
    - [L136](#l136) If <code>i&lt;entries.length</code> is truthy:
      - [L136](#l136) If <code>entries[i]!.name!==','</code> is truthy:
        - [L136](#l136) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
        - [L136](#l136) Leave the enclosing loop/switch.
      - [L136](#l136) increment <code>i</code> by one.
  - [L138](#l138) If <code>invalid</code> is truthy:
    - [L138](#l138) update <code>call.reason</code> with <code>'dynamic-query-parameters'</code> using <code>=</code>; this mutation is visible to later statements.
    - [L138](#l138) Skip the rest of this iteration and advance the enclosing loop.
  - [L139](#l139) update <code>call.queryNames</code> with <code>[...queryNames]</code> using <code>=</code>; this mutation is visible to later statements.
- [L141](#l141) update <code>result.issues</code> with <code>[...new Set(result.issues)]</code> using <code>=</code>; this mutation is visible to later statements.
- [L141](#l141) Return to the caller: evaluate <code>result</code>.

<a id="fn-1095"></a>
### nodes.some callback (19:17)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L19](#l19) Implicitly return: read <code>n.type.isError</code>.

<a id="fn-1187"></a>
### text (20:14)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). 

Parameters:

- <code>node:SyntaxNode</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L20](#l20) Implicitly return: select a range without mutating the original array/string: <code>content.slice(node.from,node.to)</code>.

<a id="fn-1350"></a>
### literal (22:17)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). 

Parameters:

- <code>node:SyntaxNode&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L24](#l24) <code>value</code>: call the named operation with the supplied arguments: <code>text(node)</code>.

Execution:

- [L23](#l23) If <code>node?.name!=='String'</code> is truthy:
  - [L23](#l23) Return to the caller: evaluate <code>undefined</code>.
- [L24](#l24) Bind <code>value</code>: call the named operation with the supplied arguments: <code>text(node)</code>.
- [L25](#l25) If <code>!/^(['"])[^\r\n\\]*\1$/.test(value) &#124;&#124; value.startsWith('"""') &#124;&#124; value.startsWith("'''")</code> is truthy:
  - [L25](#l25) Return to the caller: evaluate <code>undefined</code>.
- [L26](#l26) Return to the caller: select a range without mutating the original array/string: <code>value.slice(1,-1)</code>.

<a id="fn-1724"></a>
### nodes.filter callback (29:34)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L29](#l29) Implicitly return: compute <code>n.name==='ImportStatement'</code> with the <code>===</code> operator.

<a id="fn-2350"></a>
### values.filter callback (36:70)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>values.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>_value</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L36](#l36) Implicitly return: evaluate <code>i===1 &#124;&#124; values[i-1]===','</code> left to right with truthy short-circuiting.

<a id="fn-2411"></a>
### modules.some callback (37:21)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>modules.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L37](#l37) Implicitly return: call the named operation with the supplied arguments: <code>['aiohttp','urllib','http'].includes(value.split('.')[0]!)</code>.

<a id="fn-2820"></a>
### [...imports.values()].some callback (44:35)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>[...imports.values()].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>importNode</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L44](#l44) Implicitly return: call the named operation with the supplied arguments: <code>same(parent,importNode.node)</code>.

<a id="fn-3164"></a>
### nodes.some callback (49:17)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L49](#l49) Implicitly return: evaluate <code>n.name==='CallExpression' &amp;&amp; ['exec','eval','globals','locals','setattr','delattr'].includes(text(n.firstChild!))</code> left to right with falsy short-circuiting.

<a id="fn-3436"></a>
### constructor (52:21)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). 

Parameters:

- <code>node:SyntaxNode&#124;undefined</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L54](#l54) <code>[callee,args]</code>: call the named operation with the supplied arguments: <code>children(node)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L55](#l55) <code>[receiver,dot,name]</code>: call the named operation with the supplied arguments: <code>children(callee)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L55](#l55) <code>imported</code>: test <code>receiver</code>; choose <code>imports.get(text(receiver))</code> when truthy, otherwise <code>undefined</code>.

Execution:

- [L53](#l53) If <code>node?.name!=='CallExpression'</code> is truthy:
  - [L53](#l53) Return undefined immediately; remaining statements in this function do not execute.
- [L54](#l54) Bind <code>[callee,args]</code>: call the named operation with the supplied arguments: <code>children(node)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L54](#l54) If <code>callee?.name!=='MemberExpression'</code> is truthy:
  - [L54](#l54) Return undefined immediately; remaining statements in this function do not execute.
- [L55](#l55) Bind <code>[receiver,dot,name]</code>: call the named operation with the supplied arguments: <code>children(callee)</code>; destructure the resulting value by property name or array position into the displayed local bindings.
- [L55](#l55) Bind <code>imported</code>: test <code>receiver</code>; choose <code>imports.get(text(receiver))</code> when truthy, otherwise <code>undefined</code>.
- [L56](#l56) If <code>!receiver &#124;&#124; dot?.name!=='.' &#124;&#124; !imported &#124;&#124; !name &#124;&#124; text(name)!==(imported.library==='requests'?'Session':'Client')</code> is truthy:
  - [L56](#l56) Return undefined immediately; remaining statements in this function do not execute.
- [L57](#l57) Return to the caller: create an object with 3 property/spread entries: <code>{alias:text(receiver),library:imported.library,valid:!ambiguous.has(text(receiver)) &amp;&amp; args?.name==='ArgList' &amp;&amp; children(args).length===2}</code>; later properties overwrite earlier spread values.

<a id="fn-4004"></a>
### scope (59:15)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). 

Parameters:

- <code>node:SyntaxNode</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L59](#l59) <code>current:SyntaxNode&#124;null</code>: read <code>node.parent</code>.

Execution:

- [L59](#l59) Bind <code>current:SyntaxNode&#124;null</code>: read <code>node.parent</code>.
- [L59](#l59) Repeat while <code>current &amp;&amp; !['Body','Script'].includes(current.name)</code>:
  - [L59](#l59) update <code>current</code> with <code>current.parent</code> using <code>=</code>; this mutation is visible to later statements.
- [L59](#l59) Return to the caller: evaluate <code>current</code>.

<a id="fn-5164"></a>
### nodes.filter callback (71:71)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: evaluate <code>n.name==='VariableName' &amp;&amp; text(n)===name</code> left to right with falsy short-circuiting.

<a id="fn-5595"></a>
### nodes.filter callback (77:34)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>n</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L77](#l77) Implicitly return: compute <code>n.name==='CallExpression'</code> with the <code>===</code> operator.

<a id="fn-5630"></a>
### nodes.filter(n=&gt;n.name==='CallExpression').sort callback (77:69)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>nodes.filter(n=&gt;n.name==='CallExpression').sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L77](#l77) Implicitly return: compute <code>a.from-b.from</code> with the <code>-</code> operator.

<a id="fn-6131"></a>
### [...sessions.values()].some callback (84:58)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>[...sessions.values()].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>binding</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L84](#l84) Implicitly return: call the named operation with the supplied arguments: <code>same(binding.creation,node)</code>.

<a id="fn-7757"></a>
### groups.filter callback (101:38)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>groups.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>g</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L101](#l101) Implicitly return: read <code>g.length</code>.

<a id="fn-8312"></a>
### positional.forEach callback (110:24)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>positional.forEach</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>arg</code>: supplied by the caller; usage is shown in the steps below.
- <code>i</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L110](#l110) <code>key</code>: read <code>names[i]</code>.

Execution:

- [L110](#l110) Bind <code>key</code>: read <code>names[i]</code>.
- [L110](#l110) If <code>key</code> is truthy:
  - [L110](#l110) If <code>keywords.has(key)</code> is truthy:
    - [L110](#l110) update <code>invalid</code> with <code>true</code> using <code>=</code>; this mutation is visible to later statements.
  - [L110](#l110) store/replace a keyed entry in the Map: <code>keywords.set(key,arg)</code>.

<a id="fn-8718"></a>
### [...keywords.keys()].some callback (112:34)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>[...keywords.keys()].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>key</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L112](#l112) Implicitly return: apply <code>!</code> to <code>allowed.has(key)</code>.

<a id="fn-8878"></a>
### ['data','json','files','content'].some callback (113:123)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>['data','json','files','content'].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>key</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L113](#l113) Implicitly return: test membership without changing the collection: <code>keywords.has(key)</code>.

<a id="fn-8944"></a>
### ['verify','trust_env'].some callback (113:189)

Synchronous function. Lexically inside [extractPythonCalls (14:8)](#fn-698). Passed to <code>['verify','trust_env'].some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>key</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L113](#l113) Implicitly return: test membership without changing the collection: <code>keywords.has(key)</code>.

## Module bindings

- [L5](#l5) <code>children</code>: create [children (5:16)](#fn-182); its body runs when called, not when this value is created.
- [L10](#l10) <code>same</code>: create [same (10:12)](#fn-387); its body runs when called, not when this value is created.
- [L11](#l11) <code>verbs</code>: construct <code>Set</code> using <code>['get','post','put','patch','delete','head','options','request']</code>; this creates the local instance used below.

## Directly importing tests

- [additional-http-clients.test.ts](../../test/additional-http-clients.test.ts)
- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l5"></a>
<a id="l6"></a>
<a id="l7"></a>
<a id="l8"></a>
<a id="l10"></a>
<a id="l11"></a>
<a id="l14"></a>
<a id="l15"></a>
<a id="l16"></a>
<a id="l17"></a>
<a id="l18"></a>
<a id="l19"></a>
<a id="l20"></a>

```text
   1 | import {parser} from '@lezer/python';
   2 | import type {SyntaxNode} from '@lezer/common';
   3 | import type {CallExtraction,CallObservation} from './contract-adapter-types.js';
   4 | 
   5 | const children=(node:SyntaxNode):SyntaxNode[]=>{
   6 |   const result:SyntaxNode[]=[];
   7 |   for(let child=node.firstChild;child;child=child.nextSibling)if(child.name!=='Comment')result.push(child);
   8 |   return result;
   9 | };
  10 | const same=(a:SyntaxNode|undefined|null,b:SyntaxNode|undefined|null)=>!!a && !!b && a.from===b.from && a.to===b.to && a.name===b.name;
  11 | const verbs=new Set(['get','post','put','patch','delete','head','options','request']);
  12 | 
  13 | /** Bundled Python syntax parsing only; no interpreter, imports or repository execution. */
  14 | export function extractPythonCalls(content:string):CallExtraction {
  15 |   const result:CallExtraction={calls:[],issues:[]};
  16 |   let root:SyntaxNode;try{root=parser.parse(content).topNode;}catch{return {calls:[],issues:['unsupported-or-invalid-python']};}
  17 |   const nodes:SyntaxNode[]=[],stack=[root];
  18 |   while(stack.length){const node=stack.pop()!;nodes.push(node);stack.push(...children(node));}
  19 |   if(nodes.some(n=>n.type.isError))return {calls:[],issues:['unsupported-or-invalid-python']};
  20 |   const text=(node:SyntaxNode)=>content.slice(node.from,node.to);
```

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
<a id="l39"></a>
<a id="l40"></a>

```text
  21 |   // Deliberately reject escapes, prefixes and concatenation rather than guess Python values.
  22 |   const literal=(node:SyntaxNode|undefined):string|undefined=>{
  23 |     if(node?.name!=='String')return undefined;
  24 |     const value=text(node);
  25 |     if(!/^(['"])[^\r\n\\]*\1$/.test(value) || value.startsWith('"""') || value.startsWith("'''"))return undefined;
  26 |     return value.slice(1,-1);
  27 |   };
  28 |   const imports=new Map<string,{node:SyntaxNode;library:string}>();
  29 |   for(const node of nodes.filter(n=>n.name==='ImportStatement')) {
  30 |     const parts=children(node),values=parts.map(text);
  31 |     if(values[0]==='import' && ['requests','httpx'].includes(values[1] ?? '') && (parts.length===2 || parts.length===4 && values[2]==='as') && node.parent?.name==='Script') {
  32 |       const alias=values[3] ?? values[1]!;
  33 |       if(imports.has(alias))result.issues.push('duplicate-requests-import');
  34 |       imports.set(alias,{node,library:values[1]!});
  35 |     } else if(values.includes('requests') || values.includes('httpx'))result.issues.push('unsupported-requests-import');
  36 |     const modules=values[0]==='from'?values.slice(1,2):values.filter((_value,i)=>i===1 || values[i-1]===',');
  37 |     if(modules.some(value=>['aiohttp','urllib','http'].includes(value.split('.')[0]!)))result.issues.push('unsupported-python-http-client');
  38 |   }
  39 |   const aliases=new Set(['requests','httpx',...imports.keys()]);
  40 |   const ambiguous=new Set<string>();
```

<a id="l41"></a>
<a id="l42"></a>
<a id="l43"></a>
<a id="l44"></a>
<a id="l45"></a>
<a id="l46"></a>
<a id="l49"></a>
<a id="l50"></a>
<a id="l51"></a>
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   for(const node of nodes) {
  42 |     if(node.name!=='VariableName' || !aliases.has(text(node)))continue;
  43 |     const alias=text(node),parent=node.parent;
  44 |     if([...imports.values()].some(importNode=>same(parent,importNode.node)))continue;
  45 |     if(parent?.name==='MemberExpression' && same(parent.firstChild,node) && parent.parent?.name==='CallExpression' && same(parent.parent.firstChild,parent))continue;
  46 |     ambiguous.add(alias);
  47 |   }
  48 |   // Runtime namespace manipulation prevents reliable module binding inference.
  49 |   if(nodes.some(n=>n.name==='CallExpression' && ['exec','eval','globals','locals','setattr','delattr'].includes(text(n.firstChild!))))
  50 |     for(const alias of aliases)ambiguous.add(alias);
  51 |   if(ambiguous.size)result.issues.push('requests-binding-or-alias-unresolved');
  52 |   const constructor=(node:SyntaxNode|undefined)=>{
  53 |     if(node?.name!=='CallExpression')return;
  54 |     const [callee,args]=children(node);if(callee?.name!=='MemberExpression')return;
  55 |     const [receiver,dot,name]=children(callee),imported=receiver?imports.get(text(receiver)):undefined;
  56 |     if(!receiver || dot?.name!=='.' || !imported || !name || text(name)!==(imported.library==='requests'?'Session':'Client'))return;
  57 |     return {alias:text(receiver),library:imported.library,valid:!ambiguous.has(text(receiver)) && args?.name==='ArgList' && children(args).length===2};
  58 |   };
  59 |   const scope=(node:SyntaxNode)=>{let current:SyntaxNode|null=node.parent;while(current && !['Body','Script'].includes(current.name))current=current.parent;return current;};
  60 |   const sessions=new Map<string,{name:SyntaxNode;creation:SyntaxNode;owner:SyntaxNode|null;library:string;valid:boolean}>();
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l71"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |   for(const node of nodes) {
  62 |     const parts=children(node);
  63 |     if(node.name==='AssignStatement' && parts.length===3 && parts[0]?.name==='VariableName' && parts[1]?.name==='AssignOp') {
  64 |       const creation=parts[2]!,info=constructor(creation);if(!info)continue;
  65 |       const name=parts[0];sessions.set(text(name),{name,creation,owner:scope(node),library:info.library,valid:info.valid && !sessions.has(text(name))});
  66 |     }else if(node.name==='WithStatement' && parts.length===5 && parts[2]?.name==='as' && parts[3]?.name==='VariableName' && parts[4]?.name==='Body') {
  67 |       const creation=parts[1]!,info=constructor(creation);if(!info)continue;
  68 |       const name=parts[3];sessions.set(text(name),{name,creation,owner:parts[4],library:info.library,valid:info.valid && !sessions.has(text(name))});
  69 |     }
  70 |   }
  71 |   for(const [name,binding] of sessions)for(const node of nodes.filter(n=>n.name==='VariableName' && text(n)===name)) {
  72 |     if(same(node,binding.name))continue;
  73 |     const parent=node.parent;
  74 |     if(parent?.name==='MemberExpression' && same(parent.firstChild,node) && parent.parent?.name==='CallExpression' && same(parent.parent.firstChild,parent) && (verbs.has(text(children(parent)[2]!)) || text(children(parent)[2]!)==='close'))continue;
  75 |     binding.valid=false;
  76 |   }
  77 |   for(const node of nodes.filter(n=>n.name==='CallExpression').sort((a,b)=>a.from-b.from)) {
  78 |     const [callee,args]=children(node);
  79 |     if(callee?.name!=='MemberExpression' || args?.name!=='ArgList')continue;
  80 |     const member=children(callee),receiver=member[0];
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
  81 |     const session=receiver?.name==='VariableName'?sessions.get(text(receiver)):undefined;
  82 |     const inline=constructor(receiver);
  83 |     if(!receiver || !session && !inline && (receiver.name!=='VariableName' || !aliases.has(text(receiver))))continue;
  84 |     if(constructor(node) && ([...sessions.values()].some(binding=>same(binding.creation,node)) || node.parent?.name==='MemberExpression' && same(node.parent.firstChild,node)))continue;
  85 |     const alias=inline?.alias ?? text(receiver),method=member.length===3 && member[1]!.name==='.'?text(member[2]!):'';
  86 |     const library=session?.library ?? inline?.library ?? imports.get(alias)?.library ?? 'requests';
  87 |     if(session && method==='close' && children(args).length===2)continue;
  88 |     if(result.calls.length>=128){result.issues.push('call-count-limit');break;}
  89 |     const line=content.slice(0,node.from).split(/\r\n|\n|\r/).length;
  90 |     const end=content.slice(0,node.to).split(/\r\n|\n|\r/).length;
  91 |     const excerpt=content.split(/\r\n|\n|\r/).slice(line-1,end).join('\n');
  92 |     if(excerpt.length>2048){result.issues.push('source-excerpt-limit');continue;}
  93 |     const call:CallObservation={line,excerpt};result.calls.push(call);
  94 |     const valid=session?session.valid && same(session.owner,scope(node)) && session.creation.to<node.from:inline?inline.valid:imports.has(alias) && !ambiguous.has(alias);
  95 |     if(!valid || result.issues.includes('unsupported-requests-import') || result.issues.includes('duplicate-requests-import')){call.reason='requests-binding-or-alias-unresolved';continue;}
  96 |     if(!verbs.has(method)){call.reason='unsupported-requests-client';continue;}
  97 |     const parts=children(args).slice(1,-1),groups:SyntaxNode[][]=[[]];
  98 |     for(const part of parts)if(part.name===',')groups.push([]);else groups.at(-1)!.push(part);
  99 |     const positional:SyntaxNode[]=[],keywords=new Map<string,SyntaxNode>();
 100 |     let invalid=false,sawKeyword=false;
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l103"></a>
<a id="l104"></a>
<a id="l105"></a>
<a id="l106"></a>
<a id="l108"></a>
<a id="l109"></a>
<a id="l110"></a>
<a id="l111"></a>
<a id="l112"></a>
<a id="l113"></a>
<a id="l114"></a>
<a id="l115"></a>
<a id="l116"></a>
<a id="l117"></a>
<a id="l119"></a>
<a id="l120"></a>

```text
 101 |     for(const group of groups.filter(g=>g.length)) {
 102 |       if(group.length===1 && !sawKeyword)positional.push(group[0]!);
 103 |       else if(group.length===3 && group[0]!.name==='VariableName' && group[1]!.name==='AssignOp') {
 104 |         const key=text(group[0]!);if(keywords.has(key))invalid=true;
 105 |         keywords.set(key,group[2]!);sawKeyword=true;
 106 |       } else invalid=true;
 107 |     }
 108 |     const names=method==='request'?['method','url']:method==='get' && library==='requests' && !session && !inline?['url','params']:['url'];
 109 |     if(positional.length>names.length)invalid=true;
 110 |     positional.forEach((arg,i)=>{const key=names[i];if(key){if(keywords.has(key))invalid=true;keywords.set(key,arg);}});
 111 |     const allowed=new Set(['url','params','data','json','headers','cookies','files','auth','timeout',...(library==='requests'?['allow_redirects','proxies','verify','stream','cert']:['content','follow_redirects','verify','trust_env']),...(method==='request'?['method']:[])]);
 112 |     if([...keywords.keys()].some(key=>!allowed.has(key)))invalid=true;
 113 |     if(library==='httpx' && (['get','head','options','delete'].includes(method) && ['data','json','files','content'].some(key=>keywords.has(key)) || session && ['verify','trust_env'].some(key=>keywords.has(key))))invalid=true;
 114 |     if(invalid){call.reason='unsupported-or-dynamic-arguments';continue;}
 115 |     const url=literal(keywords.get('url'));
 116 |     if(url===undefined){call.reason='dynamic-url';continue;}
 117 |     call.url=url;
 118 |     // Avoid applying browser URL normalization to Requests-specific URL syntax.
 119 |     if(/[\\\s\u0000-\u001f\u007f]/.test(url)){call.reason='unsupported-url-shape';continue;}
 120 |     const verb=method==='request'?literal(keywords.get('method')):method;
```

<a id="l121"></a>
<a id="l122"></a>
<a id="l123"></a>
<a id="l124"></a>
<a id="l125"></a>
<a id="l126"></a>
<a id="l127"></a>
<a id="l128"></a>
<a id="l129"></a>
<a id="l130"></a>
<a id="l131"></a>
<a id="l132"></a>
<a id="l133"></a>
<a id="l134"></a>
<a id="l135"></a>
<a id="l136"></a>
<a id="l138"></a>
<a id="l139"></a>

```text
 121 |     if(verb===undefined){call.reason='dynamic-method';continue;}
 122 |     call.method=verb.toUpperCase();
 123 |     const params=keywords.get('params');
 124 |     if(!params || params.name==='None')continue;
 125 |     if(params.name!=='DictionaryExpression'){call.reason='dynamic-query-parameters';continue;}
 126 |     const entries=children(params).slice(1,-1),queryNames=new Set<string>();
 127 |     for(let i=0;i<entries.length;) {
 128 |       const key=literal(entries[i]),colon=entries[i+1],value=entries[i+2];
 129 |       if(key===undefined || colon?.name!==':' || !value){invalid=true;break;}
 130 |       const scalar=literal(value)!==undefined || value.name==='Boolean' || value.name==='Number' && /^\d+(?:\.\d+)?$/.test(text(value));
 131 |       if(value.name==='None' && library==='requests')queryNames.delete(key);
 132 |       else if(value.name==='None')queryNames.add(key);
 133 |       else if(scalar)queryNames.add(key);
 134 |       else {invalid=true;break;}
 135 |       i+=3;
 136 |       if(i<entries.length){if(entries[i]!.name!==','){invalid=true;break;}i++;}
 137 |     }
 138 |     if(invalid){call.reason='dynamic-query-parameters';continue;}
 139 |     call.queryNames=[...queryNames];
 140 |   }
```

<a id="l141"></a>

```text
 141 |   result.issues=[...new Set(result.issues)];return result;
 142 | }
 143 | 
```
