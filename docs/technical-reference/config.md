# src/config.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

Configuration is validated by strict Zod objects and a rule-name refinement. The final transform preserves the distinction between omitted exclude (inherit repository Git ignores by default) and explicitly supplied exclude, including an empty array (do not inherit by default). matchesPattern compiles a small slash-aware glob language to an anchored RegExp. ruleLevel starts with configured/default severity and overwrites it only when a later matching override specifies this rule.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `06d2550d5eef044dad7662b0d3a5bc842dff305ae9b75600bcab8e27793345aa`.

This chapter inventories **19 function bodies/callbacks**, **14 variable declarations**, and **3 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./architecture-contracts.js</code>: <code>architectureSchema</code>.
- <code>./sdk-contracts.js</code>: <code>sdkBindingSchema</code>.
- <code>./filesystem-policy.js</code>: <code>readBoundedConfig</code>, <code>validateRoot</code>.
- <code>node:path</code>: <code>join</code>.
- <code>zod</code>: <code>z</code>.
- <code>./ai/contracts.js</code>: <code>aiSettingsSchema</code>.
- <code>./checks.js</code>: <code>checksSchema</code>.
- <code>./resource-contracts.js</code>: <code>resourceDefinitionSchema</code>.
- <code>./task-file.js</code>: <code>currentTaskSchema</code>.
- <code>./contract-contracts.js</code>: <code>contractBindingSchema</code>.

## Module execution

- [L12](#l12) Bind <code>ruleDefaults</code>: create an object with 10 property/spread entries: <code>{ "package/invalid-json": "error", "package/invalid-object": "error", "package/invalid-scripts": "error", "package/conflicting-lockfiles": "warning", "package/missing-local-dependency": "error", "package/missing-script-target": "warning", "package/missing-e…</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L25](#l25) Bind <code>levels</code>: call the named operation with the supplied arguments: <code>z.enum(["off", "error", "warning", "info"])</code>.
- [L26](#l26) Bind <code>rulesSchema</code>: call the named operation with the supplied arguments: <code>z.record(z.string(), levels).superRefine((rules, ctx) =&gt; { for (const key of Object.keys(rules)) { if (!Object.hasOwn(ruleDefaults, key)) ctx.addIssue({ code: "custom", path: [key], message: &#96;Unknown rule: ${key}&#96; }); } })</code>.
- [L31](#l31) Bind <code>pattern</code>: call the named operation with the supplied arguments: <code>z.string().min(1).refine(value =&gt; !value.startsWith("/") &amp;&amp; !/[\\:?![\]{}]/.test(value) &amp;&amp; value.split("/").every(part =&gt; part !== ".." &amp;&amp; part !== "." &amp;&amp; part !== "") &amp;&amp; value.split("/").every(part =&gt; !part.includes("**") &#124;&#124; part === "**"), "Use relative s…</code>.
- [L36](#l36) Bind <code>configSchema</code>: call the named operation with the supplied arguments: <code>z.object({ version: z.literal(1).default(1), currentTask:currentTaskSchema.optional(), architecture:architectureSchema.optional(), sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length…</code>.

## Function index

- [z.record(z.string(), levels).superRefine callback (26:62)](#fn-1151)
- [z.string().min(1).refine callback (31:42)](#fn-1388)
- [value.split("/").every callback (33:29)](#fn-1483)
- [value.split("/").every callback (34:29)](#fn-1566)
- [z.array(sdkBindingSchema).max(20).default([]).refine callback (40:69)](#fn-1927)
- [items.map callback (40:94)](#fn-1952)
- [z.array(contractBindingSchema).max(20).default([]).refine callback (41:71)](#fn-2094)
- [items.map callback (41:96)](#fn-2119)
- [z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([]) .refine callback (48:13)](#fn-2521)
- [resources.map callback (48:46)](#fn-2554)
- [z.object({ version: z.literal(1).default(1), currentTask:currentTaskSchema.optional(), architecture:architectureSchema.optional(), sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length… callback (53:23)](#fn-2809)
- [matchesPattern (58:8)](#fn-3132)
- [parts.map callback (60:32)](#fn-3267)
- [isExcluded (69:8)](#fn-3663)
- [patterns.some callback (71:24)](#fn-3795)
- [parts.some callback (71:46)](#fn-3817)
- [ruleLevel (74:8)](#fn-3908)
- [override.files.some callback (77:29)](#fn-4129)
- [loadConfig (82:8)](#fn-4246)

<a id="fn-1151"></a>
### z.record(z.string(), levels).superRefine callback (26:62)

Synchronous function. Defined in module scope. Passed to <code>z.record(z.string(), levels).superRefine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>rules</code>: supplied by the caller; usage is shown in the steps below.
- <code>ctx</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L27](#l27) <code>key</code>: receive the next iterable value from <code>Object.keys(rules)</code> at the start of each loop iteration.

Execution:

- [L27](#l27) Iterate <code>Object.keys(rules)</code> values, binding <code>const key</code> for each iteration:
  - [L28](#l28) If <code>!Object.hasOwn(ruleDefaults, key)</code> is truthy:
    - [L28](#l28) call the named operation with the supplied arguments: <code>ctx.addIssue({ code: "custom", path: [key], message: &#96;Unknown rule: ${key}&#96; })</code>.

<a id="fn-1388"></a>
### z.string().min(1).refine callback (31:42)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>value</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L32](#l32) Implicitly return: evaluate <code>!value.startsWith("/") &amp;&amp; !/[\\:?![\]{}]/.test(value) &amp;&amp; value.split("/").every(part =&gt; part !== ".." &amp;&amp; part !== "." &amp;&amp; part !== "") &amp;&amp; value.split("/").every(part =&gt; !part.includes("**") &#124;&#124; part === "**")</code> left to right with falsy short-circuiting.

<a id="fn-1483"></a>
### value.split("/").every callback (33:29)

Synchronous function. Lexically inside [z.string().min(1).refine callback (31:42)](#fn-1388). Passed to <code>value.split("/").every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L33](#l33) Implicitly return: evaluate <code>part !== ".." &amp;&amp; part !== "." &amp;&amp; part !== ""</code> left to right with falsy short-circuiting.

<a id="fn-1566"></a>
### value.split("/").every callback (34:29)

Synchronous function. Lexically inside [z.string().min(1).refine callback (31:42)](#fn-1388). Passed to <code>value.split("/").every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L34](#l34) Implicitly return: evaluate <code>!part.includes("**") &#124;&#124; part === "**"</code> left to right with truthy short-circuiting.

<a id="fn-1927"></a>
### z.array(sdkBindingSchema).max(20).default([]).refine callback (40:69)

Synchronous function. Defined in module scope. Passed to <code>z.array(sdkBindingSchema).max(20).default([]).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>items</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: compute <code>new Set(items.map(item=&gt;item.id)).size===items.length</code> with the <code>===</code> operator.

<a id="fn-1952"></a>
### items.map callback (40:94)

Synchronous function. Lexically inside [z.array(sdkBindingSchema).max(20).default([]).refine callback (40:69)](#fn-1927). Passed to <code>items.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L40](#l40) Implicitly return: read <code>item.id</code>.

<a id="fn-2094"></a>
### z.array(contractBindingSchema).max(20).default([]).refine callback (41:71)

Synchronous function. Defined in module scope. Passed to <code>z.array(contractBindingSchema).max(20).default([]).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>items</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L41](#l41) Implicitly return: compute <code>new Set(items.map(item=&gt;item.id)).size===items.length</code> with the <code>===</code> operator.

<a id="fn-2119"></a>
### items.map callback (41:96)

Synchronous function. Lexically inside [z.array(contractBindingSchema).max(20).default([]).refine callback (41:71)](#fn-2094). Passed to <code>items.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>item</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L41](#l41) Implicitly return: read <code>item.id</code>.

<a id="fn-2521"></a>
### z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([]) .refine callback (48:13)

Synchronous function. Defined in module scope. Passed to <code>z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([]) .refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>resources</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L48](#l48) Implicitly return: compute <code>new Set(resources.map(resource=&gt;resource.id)).size===resources.length</code> with the <code>===</code> operator.

<a id="fn-2554"></a>
### resources.map callback (48:46)

Synchronous function. Lexically inside [z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([]) .refine callback (48:13)](#fn-2521). Passed to <code>resources.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>resource</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L48](#l48) Implicitly return: read <code>resource.id</code>.

<a id="fn-2809"></a>
### z.object({ version: z.literal(1).default(1), currentTask:currentTaskSchema.optional(), architecture:architectureSchema.optional(), sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length… callback (53:23)

Synchronous function. Defined in module scope. Passed to <code>z.object({ version: z.literal(1).default(1), currentTask:currentTaskSchema.optional(), architecture:architectureSchema.optional(), sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>config</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L53](#l53) Implicitly return: create an object with 3 property/spread entries: <code>{...config,exclude:config.exclude ?? [],respectGitignore:config.respectGitignore ?? config.exclude===undefined}</code>; later properties overwrite earlier spread values.

<a id="fn-3132"></a>
### matchesPattern (58:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>pattern: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L59](#l59) <code>parts</code>: divide the string using the delimiter or regular expression: <code>pattern.split("/")</code>.
- [L60](#l60) <code>expression</code>: concatenate the elements with the supplied separator: <code>parts.map((part, index) =&gt; { if (part === "**") return index === parts.length - 1 ? ".*" : "(?:[^/]+/)*"; const escaped = part.replace(/[.+^$()&#124;[\]\\]/g, "\\$&amp;").replace(/\*/g, "[^/]*"); return escaped + (index &lt; parts.length - 1 ? "/" : ""); }).join("")</code>.

Execution:

- [L59](#l59) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>pattern.split("/")</code>.
- [L60](#l60) Bind <code>expression</code>: concatenate the elements with the supplied separator: <code>parts.map((part, index) =&gt; { if (part === "**") return index === parts.length - 1 ? ".*" : "(?:[^/]+/)*"; const escaped = part.replace(/[.+^$()&#124;[\]\\]/g, "\\$&amp;").replace(/\*/g, "[^/]*"); return escaped + (index &lt; parts.length - 1 ? "/" : ""); }).join("")</code>.
- [L65](#l65) Return to the caller: evaluate <code>new RegExp(&#96;^${expression}$&#96;).test(path) &#124;&#124; (pattern.endsWith("/**") &amp;&amp; path === pattern.slice(0, -3))</code> left to right with truthy short-circuiting.

<a id="fn-3267"></a>
### parts.map callback (60:32)

Synchronous function. Lexically inside [matchesPattern (58:8)](#fn-3132). Passed to <code>parts.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L62](#l62) <code>escaped</code>: produce a string with matching text replaced: <code>part.replace(/[.+^$()&#124;[\]\\]/g, "\\$&amp;").replace(/\*/g, "[^/]*")</code>.

Execution:

- [L61](#l61) If <code>part === "**"</code> is truthy:
  - [L61](#l61) Return to the caller: test <code>index === parts.length - 1</code>; choose <code>".*"</code> when truthy, otherwise <code>"(?:[^/]+/)*"</code>.
- [L62](#l62) Bind <code>escaped</code>: produce a string with matching text replaced: <code>part.replace(/[.+^$()&#124;[\]\\]/g, "\\$&amp;").replace(/\*/g, "[^/]*")</code>.
- [L63](#l63) Return to the caller: compute <code>escaped + (index &lt; parts.length - 1 ? "/" : "")</code> with the <code>+</code> operator.

<a id="fn-3663"></a>
### isExcluded (69:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.
- <code>patterns: readonly string[]</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L70](#l70) <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split("/")</code>.

Execution:

- [L70](#l70) Bind <code>parts</code>: divide the string using the delimiter or regular expression: <code>path.split("/")</code>.
- [L71](#l71) Return to the caller: stop at the first truthy callback result, returning whether any matched: <code>patterns.some(pattern =&gt; parts.some((_, index) =&gt; matchesPattern(parts.slice(0, index + 1).join("/"), pattern)))</code>.

<a id="fn-3795"></a>
### patterns.some callback (71:24)

Synchronous function. Lexically inside [isExcluded (69:8)](#fn-3663). Passed to <code>patterns.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: stop at the first truthy callback result, returning whether any matched: <code>parts.some((_, index) =&gt; matchesPattern(parts.slice(0, index + 1).join("/"), pattern))</code>.

<a id="fn-3817"></a>
### parts.some callback (71:46)

Synchronous function. Lexically inside [patterns.some callback (71:24)](#fn-3795). Passed to <code>parts.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>_</code>: supplied by the caller; usage is shown in the steps below.
- <code>index</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L71](#l71) Implicitly return: call the named operation with the supplied arguments: <code>matchesPattern(parts.slice(0, index + 1).join("/"), pattern)</code>.

<a id="fn-3908"></a>
### ruleLevel (74:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>config: Config</code>: supplied by the caller; usage is shown in the steps below.
- <code>rule: RuleId</code>: supplied by the caller; usage is shown in the steps below.
- <code>path: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L75](#l75) <code>level: z.infer&lt;typeof levels&gt;</code>: use <code>config.rules[rule]</code> unless null/undefined, then evaluate <code>ruleDefaults[rule]</code>.
- [L76](#l76) <code>override</code>: receive the next iterable value from <code>config.overrides</code> at the start of each loop iteration.

Execution:

- [L75](#l75) Bind <code>level: z.infer&lt;typeof levels&gt;</code>: use <code>config.rules[rule]</code> unless null/undefined, then evaluate <code>ruleDefaults[rule]</code>.
- [L76](#l76) Iterate <code>config.overrides</code> values, binding <code>const override</code> for each iteration:
  - [L77](#l77) If <code>override.files.some(pattern =&gt; matchesPattern(path, pattern))</code> is truthy:
    - [L77](#l77) update <code>level</code> with <code>override.rules[rule] ?? level</code> using <code>=</code>; this mutation is visible to later statements.
- [L79](#l79) Return to the caller: evaluate <code>level</code>.

<a id="fn-4129"></a>
### override.files.some callback (77:29)

Synchronous function. Lexically inside [ruleLevel (74:8)](#fn-3908). Passed to <code>override.files.some</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>pattern</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L77](#l77) Implicitly return: call the named operation with the supplied arguments: <code>matchesPattern(path, pattern)</code>.

<a id="fn-4246"></a>
### loadConfig (82:8)

Asynchronous function: returns a Promise. Defined in module scope. 

Parameters:

- <code>root: string</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L83](#l83) <code>validatedRoot</code>: wait for <code>validateRoot(root)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L84](#l84) <code>content</code>: wait for <code>readBoundedConfig(join(validatedRoot, "shipcheck.config.json"))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.

Execution:

- [L83](#l83) Bind <code>validatedRoot</code>: wait for <code>validateRoot(root)</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L84](#l84) Bind <code>content</code>: wait for <code>readBoundedConfig(join(validatedRoot, "shipcheck.config.json"))</code> to settle, then use its resolved value; rejection transfers control to the nearest applicable catch.
- [L85](#l85) If <code>content === undefined</code> is truthy:
  - [L85](#l85) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse({})</code>.
- [L86](#l86) Run the protected block:
  - [L86](#l86) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(JSON.parse(content))</code>.
- [L86](#l86) If it throws, bind <code>error</code>:
  - [L87](#l87) Throw <code>new Error(&#96;Invalid shipcheck.config.json: ${String(error)}&#96;)</code>; normal execution stops until an enclosing catch handles it.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>configSchema</code> | <code>version</code> | <code>z.literal(1).default(1)</code> | [L37](#l37) |
| <code>configSchema</code> | <code>currentTask</code> | <code>currentTaskSchema.optional()</code> | [L38](#l38) |
| <code>configSchema</code> | <code>architecture</code> | <code>architectureSchema.optional()</code> | [L39](#l39) |
| <code>configSchema</code> | <code>sdkContracts</code> | <code>z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length,'SDK binding IDs must be unique.')</code> | [L40](#l40) |
| <code>configSchema</code> | <code>contracts</code> | <code>z.array(contractBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length,'Contract binding IDs must be unique.')</code> | [L41](#l41) |
| <code>configSchema</code> | <code>exclude</code> | <code>z.array(pattern).optional()</code> | [L42](#l42) |
| <code>configSchema</code> | <code>respectGitignore</code> | <code>z.boolean().optional()</code> | [L43](#l43) |
| <code>configSchema</code> | <code>rules</code> | <code>rulesSchema.default({})</code> | [L44](#l44) |
| <code>configSchema</code> | <code>ai</code> | <code>aiSettingsSchema.prefault({})</code> | [L45](#l45) |
| <code>configSchema</code> | <code>checks</code> | <code>checksSchema</code> | [L46](#l46) |
| <code>configSchema</code> | <code>resources</code> | <code>z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([]) .refine(resources=&gt;new Set(resources.map(resource=&gt;resource.id)).size===resources.length,'Resource IDs must be unique.')</code> | [L47](#l47) |
| <code>configSchema</code> | <code>resources.appliesTo</code> | <code>z.array(pattern).min(1).default(['**'])</code> | [L47](#l47) |
| <code>configSchema</code> | <code>overrides</code> | <code>z.array(z.object({ files: z.array(pattern).min(1), rules: rulesSchema, reason: z.string().min(1), }).strict()).default([])</code> | [L49](#l49) |
| <code>configSchema</code> | <code>overrides.files</code> | <code>z.array(pattern).min(1)</code> | [L50](#l50) |
| <code>configSchema</code> | <code>overrides.rules</code> | <code>rulesSchema</code> | [L50](#l50) |
| <code>configSchema</code> | <code>overrides.reason</code> | <code>z.string().min(1)</code> | [L51](#l51) |

## Compile-time data contracts

### RuleId

```typescript
type RuleId = keyof typeof ruleDefaults;
```

Declared at [L24](#l24). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Config

```typescript
type Config = z.infer<typeof configSchema>;
```

Declared at [L54](#l54). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### ConfigInput

```typescript
type ConfigInput = z.input<typeof configSchema>;
```

Declared at [L55](#l55). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L12](#l12) <code>ruleDefaults</code>: create an object with 10 property/spread entries: <code>{ "package/invalid-json": "error", "package/invalid-object": "error", "package/invalid-scripts": "error", "package/conflicting-lockfiles": "warning", "package/missing-local-dependency": "error", "package/missing-script-target": "warning", "package/missing-e…</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.
- [L25](#l25) <code>levels</code>: call the named operation with the supplied arguments: <code>z.enum(["off", "error", "warning", "info"])</code>.
- [L26](#l26) <code>rulesSchema</code>: call the named operation with the supplied arguments: <code>z.record(z.string(), levels).superRefine((rules, ctx) =&gt; { for (const key of Object.keys(rules)) { if (!Object.hasOwn(ruleDefaults, key)) ctx.addIssue({ code: "custom", path: [key], message: &#96;Unknown rule: ${key}&#96; }); } })</code>.
- [L31](#l31) <code>pattern</code>: call the named operation with the supplied arguments: <code>z.string().min(1).refine(value =&gt; !value.startsWith("/") &amp;&amp; !/[\\:?![\]{}]/.test(value) &amp;&amp; value.split("/").every(part =&gt; part !== ".." &amp;&amp; part !== "." &amp;&amp; part !== "") &amp;&amp; value.split("/").every(part =&gt; !part.includes("**") &#124;&#124; part === "**"), "Use relative s…</code>.
- [L36](#l36) <code>configSchema</code>: call the named operation with the supplied arguments: <code>z.object({ version: z.literal(1).default(1), currentTask:currentTaskSchema.optional(), architecture:architectureSchema.optional(), sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=&gt;new Set(items.map(item=&gt;item.id)).size===items.length…</code>.

## Directly importing tests

- [architecture-audit.test.ts](../../test/architecture-audit.test.ts)
- [contract-adapters.test.ts](../../test/contract-adapters.test.ts)
- [contract-audit.test.ts](../../test/contract-audit.test.ts)
- [current-task.test.ts](../../test/current-task.test.ts)
- [external-references.test.ts](../../test/external-references.test.ts)
- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
- [p7.test.ts](../../test/p7.test.ts)
- [reference-resources.test.ts](../../test/reference-resources.test.ts)
- [rules-config.test.ts](../../test/rules-config.test.ts)
- [sdk-audit.test.ts](../../test/sdk-audit.test.ts)
- [standard-http-adapters.test.ts](../../test/standard-http-adapters.test.ts)
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
   1 | import {architectureSchema} from './architecture-contracts.js';
   2 | import {sdkBindingSchema} from './sdk-contracts.js';
   3 | import { readBoundedConfig, validateRoot } from "./filesystem-policy.js";
   4 | import { join } from "node:path";
   5 | import { z } from "zod";
   6 | import { aiSettingsSchema } from "./ai/contracts.js";
   7 | import { checksSchema } from './checks.js';
   8 | import {resourceDefinitionSchema} from './resource-contracts.js';
   9 | import {currentTaskSchema} from './task-file.js';
  10 | import {contractBindingSchema} from './contract-contracts.js';
  11 | 
  12 | export const ruleDefaults = {
  13 |   "package/invalid-json": "error",
  14 |   "package/invalid-object": "error",
  15 |   "package/invalid-scripts": "error",
  16 |   "package/conflicting-lockfiles": "warning",
  17 |   "package/missing-local-dependency": "error",
  18 |   "package/missing-script-target": "warning",
  19 |   "package/missing-entry-point": "off",
  20 |   "repository/missing-readme": "off",
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l26"></a>
<a id="l27"></a>
<a id="l28"></a>
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
  21 |   "repository/missing-tests": "off",
  22 |   "source/fixme": "off",
  23 | } as const;
  24 | export type RuleId = keyof typeof ruleDefaults;
  25 | const levels = z.enum(["off", "error", "warning", "info"]);
  26 | const rulesSchema = z.record(z.string(), levels).superRefine((rules, ctx) => {
  27 |   for (const key of Object.keys(rules)) {
  28 |     if (!Object.hasOwn(ruleDefaults, key)) ctx.addIssue({ code: "custom", path: [key], message: `Unknown rule: ${key}` });
  29 |   }
  30 | });
  31 | const pattern = z.string().min(1).refine(value =>
  32 |   !value.startsWith("/") && !/[\\:?![\]{}]/.test(value)
  33 |   && value.split("/").every(part => part !== ".." && part !== "." && part !== "")
  34 |   && value.split("/").every(part => !part.includes("**") || part === "**"),
  35 | "Use relative slash-separated patterns with * or whole-segment ** only.");
  36 | export const configSchema = z.object({
  37 |   version: z.literal(1).default(1),
  38 |   currentTask:currentTaskSchema.optional(),
  39 |   architecture:architectureSchema.optional(),
  40 |   sdkContracts:z.array(sdkBindingSchema).max(20).default([]).refine(items=>new Set(items.map(item=>item.id)).size===items.length,'SDK binding IDs must be unique.'),
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
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 |   contracts:z.array(contractBindingSchema).max(20).default([]).refine(items=>new Set(items.map(item=>item.id)).size===items.length,'Contract binding IDs must be unique.'),
  42 |   exclude: z.array(pattern).optional(),
  43 |   respectGitignore:z.boolean().optional(),
  44 |   rules: rulesSchema.default({}),
  45 |   ai: aiSettingsSchema.prefault({}),
  46 |   checks: checksSchema,
  47 |   resources:z.array(resourceDefinitionSchema.safeExtend({appliesTo:z.array(pattern).min(1).default(['**'])})).max(32).default([])
  48 |     .refine(resources=>new Set(resources.map(resource=>resource.id)).size===resources.length,'Resource IDs must be unique.'),
  49 |   overrides: z.array(z.object({
  50 |     files: z.array(pattern).min(1), rules: rulesSchema,
  51 |     reason: z.string().min(1),
  52 |   }).strict()).default([]),
  53 | }).strict().transform(config=>({...config,exclude:config.exclude ?? [],respectGitignore:config.respectGitignore ?? config.exclude===undefined}));
  54 | export type Config = z.infer<typeof configSchema>;
  55 | export type ConfigInput = z.input<typeof configSchema>;
  56 | 
  57 | /** Small documented glob subset; ** matches zero or more complete segments. */
  58 | export function matchesPattern(path: string, pattern: string): boolean {
  59 |   const parts = pattern.split("/");
  60 |   const expression = parts.map((part, index) => {
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l71"></a>
<a id="l74"></a>
<a id="l75"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l79"></a>

```text
  61 |     if (part === "**") return index === parts.length - 1 ? ".*" : "(?:[^/]+/)*";
  62 |     const escaped = part.replace(/[.+^$()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  63 |     return escaped + (index < parts.length - 1 ? "/" : "");
  64 |   }).join("");
  65 |   return new RegExp(`^${expression}$`).test(path)
  66 |     || (pattern.endsWith("/**") && path === pattern.slice(0, -3));
  67 | }
  68 | 
  69 | export function isExcluded(path: string, patterns: readonly string[]): boolean {
  70 |   const parts = path.split("/");
  71 |   return patterns.some(pattern => parts.some((_, index) => matchesPattern(parts.slice(0, index + 1).join("/"), pattern)));
  72 | }
  73 | 
  74 | export function ruleLevel(config: Config, rule: RuleId, path: string) {
  75 |   let level: z.infer<typeof levels> = config.rules[rule] ?? ruleDefaults[rule];
  76 |   for (const override of config.overrides) {
  77 |     if (override.files.some(pattern => matchesPattern(path, pattern))) level = override.rules[rule] ?? level;
  78 |   }
  79 |   return level;
  80 | }
```

<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
<a id="l86"></a>
<a id="l87"></a>

```text
  81 | 
  82 | export async function loadConfig(root: string): Promise<Config> {
  83 |   const validatedRoot = await validateRoot(root);
  84 |   const content = await readBoundedConfig(join(validatedRoot, "shipcheck.config.json"));
  85 |   if (content === undefined) return configSchema.parse({});
  86 |   try { return configSchema.parse(JSON.parse(content)); }
  87 |   catch (error) { throw new Error(`Invalid shipcheck.config.json: ${String(error)}`); }
  88 | }
  89 | 
```
