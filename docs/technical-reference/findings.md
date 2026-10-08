# src/findings.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

createReport schema-parses its inputs, converts package issues to findings, adds optional repository rules, applies exclusions and ordered severities, then sorts findings. A set of diagnosed package paths removes duplicate invalid-manifest warnings even when the corresponding rule is switched off. The report schema keeps deterministic findings, tool claims, AI candidates and coverage in distinct fields.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `1e501f700040f1fbcfcd3d0585506d8af285728f7fa3b32d07d4711d29f4dc02`.

This chapter inventories **7 function bodies/callbacks**, **14 variable declarations**, and **2 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>./architecture-contracts.js</code>: <code>architectureResultSchema</code>.
- <code>./sdk-contracts.js</code>: <code>sdkResultSchema</code>.
- <code>zod</code>: <code>z</code>.
- <code>./repository-profile.js</code>: <code>repositoryProfileSchema</code>, <code>RepositoryProfile</code> (type only).
- <code>./config.js</code>: <code>configSchema</code>, <code>isExcluded</code>, <code>ruleLevel</code>, <code>ConfigInput</code> (type only), <code>RuleId</code> (type only).
- <code>./additional-rules.js</code>: <code>additionalFindings</code>.
- <code>./ai/contracts.js</code>: <code>aiResultSchema</code>.
- <code>./checks.js</code>: <code>checkResultSchema</code>.
- <code>./resource-contracts.js</code>: <code>referencesSchema</code>.
- <code>./task-file.js</code>: <code>currentTaskReportSchema</code>.
- <code>./contract-contracts.js</code>: <code>contractResultSchema</code>.

## Module execution

- [L13](#l13) Bind <code>findingSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id: z.string().min(1), ruleId: z.string().min(1), severity: z.enum(["error", "warning", "info"]), title: z.string().min(1), explanation: z.string().min(1), evidence: z.array(z.object({ path: z.string().min(1), observation: z.string().min(1), line…</code>.
- [L29](#l29) Bind <code>reportSchema</code>: call the named operation with the supplied arguments: <code>z.object({ schemaVersion: z.literal(1), root: z.string().min(1), ignorePolicy:repositoryProfileSchema.shape.ignorePolicy, findings: z.array(findingSchema), inspectionWarnings: repositoryProfileSchema.shape.warnings, ai: aiResultSchema.optional(), checks:z.a…</code>.
- [L53](#l53) Bind <code>rules</code>: create an object with 3 property/spread entries: <code>{ "invalid-json": { ruleId: "package/invalid-json", title: "Package manifest is not valid JSON", explanation: "Tools that consume package.json cannot parse this manifest as JSON.", suggestedAction: "Correct the JSON syntax in this package.json file.", }, "i…</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.

## Function index

- [createReport (76:8)](#fn-3692)
- [profile.packageIssues.map callback (79:48)](#fn-3929)
- [candidates.flatMap callback (88:39)](#fn-4288)
- [candidates.flatMap(finding =&gt; { const path = finding.evidence[0]!.path; if (isExcluded(path, [...profile.excluded, ...config.exclude])) return []; const severity = ruleLevel(config, finding.ruleId as RuleId, path); return severity === "off" ? [] : [{ ...fin… callback (93:11)](#fn-4576)
- [profile.packageIssues.map callback (94:60)](#fn-4687)
- [profile.warnings.filter callback (95:54)](#fn-4764)
- [profile.warnings.filter(warning =&gt; warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)) .sort callback (97:11)](#fn-4865)

<a id="fn-3692"></a>
### createReport (76:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>input: RepositoryProfile</code>: supplied by the caller; usage is shown in the steps below.
- <code>options: ConfigInput = {}</code>: when omitted/undefined, initialize with <code>{}</code>.

Local bindings (nested callback locals are documented with that callback):

- [L77](#l77) <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>.
- [L78](#l78) <code>profile</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>repositoryProfileSchema.parse(input)</code>.
- [L79](#l79) <code>candidates</code>: call the named operation with the supplied arguments: <code>profile.packageIssues.map(issue =&gt; { const rule = rules[issue.code]; return findingSchema.parse({ ...rule, id: &#96;${rule.ruleId}:${encodeURIComponent(issue.path)}&#96;, severity: "error", evidence: [{ path: issue.path, observation: issue.observation }], }); }).co…</code>.
- [L88](#l88) <code>findings</code>: sort the receiver array in place using the comparator: <code>candidates.flatMap(finding =&gt; { const path = finding.evidence[0]!.path; if (isExcluded(path, [...profile.excluded, ...config.exclude])) return []; const severity = ruleLevel(config, finding.ruleId as RuleId, path); return severity === "off" ? [] : [{ ...fin…</code>.
- [L94](#l94) <code>diagnosedPaths</code>: construct <code>Set</code> using <code>profile.packageIssues.map(issue =&gt; issue.path)</code>; this creates the local instance used below.
- [L95](#l95) <code>inspectionWarnings</code>: sort the receiver array in place using the comparator: <code>profile.warnings.filter(warning =&gt; warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)) .sort((a, b) =&gt; { const left = JSON.stringify([a.path, a.code, a.message]); const right = JSON.stringify([b.path, b.code, b.message]); return left &lt;…</code>.

Execution:

- [L77](#l77) Bind <code>config</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>configSchema.parse(options)</code>.
- [L78](#l78) Bind <code>profile</code>: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>repositoryProfileSchema.parse(input)</code>.
- [L79](#l79) Bind <code>candidates</code>: call the named operation with the supplied arguments: <code>profile.packageIssues.map(issue =&gt; { const rule = rules[issue.code]; return findingSchema.parse({ ...rule, id: &#96;${rule.ruleId}:${encodeURIComponent(issue.path)}&#96;, severity: "error", evidence: [{ path: issue.path, observation: issue.observation }], }); }).co…</code>.
- [L88](#l88) Bind <code>findings</code>: sort the receiver array in place using the comparator: <code>candidates.flatMap(finding =&gt; { const path = finding.evidence[0]!.path; if (isExcluded(path, [...profile.excluded, ...config.exclude])) return []; const severity = ruleLevel(config, finding.ruleId as RuleId, path); return severity === "off" ? [] : [{ ...fin…</code>.
- [L94](#l94) Bind <code>diagnosedPaths</code>: construct <code>Set</code> using <code>profile.packageIssues.map(issue =&gt; issue.path)</code>; this creates the local instance used below.
- [L95](#l95) Bind <code>inspectionWarnings</code>: sort the receiver array in place using the comparator: <code>profile.warnings.filter(warning =&gt; warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)) .sort((a, b) =&gt; { const left = JSON.stringify([a.path, a.code, a.message]); const right = JSON.stringify([b.path, b.code, b.message]); return left &lt;…</code>.
- [L102](#l102) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>reportSchema.parse({ schemaVersion: 1, root: profile.root, findings, inspectionWarnings,...(profile.ignorePolicy?{ignorePolicy:profile.ignorePolicy}:{}) })</code>.

<a id="fn-3929"></a>
### profile.packageIssues.map callback (79:48)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>profile.packageIssues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L80](#l80) <code>rule</code>: read <code>rules[issue.code]</code>.

Execution:

- [L80](#l80) Bind <code>rule</code>: read <code>rules[issue.code]</code>.
- [L81](#l81) Return to the caller: validate/parse the supplied value (a schema parser throws on invalid input; JSON.parse decodes JSON): <code>findingSchema.parse({ ...rule, id: &#96;${rule.ruleId}:${encodeURIComponent(issue.path)}&#96;, severity: "error", evidence: [{ path: issue.path, observation: issue.observation }], })</code>.

<a id="fn-4288"></a>
### candidates.flatMap callback (88:39)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>candidates.flatMap</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>finding</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L89](#l89) <code>path</code>: read <code>finding.evidence[0]!.path</code>.
- [L91](#l91) <code>severity</code>: call the named operation with the supplied arguments: <code>ruleLevel(config, finding.ruleId as RuleId, path)</code>.

Execution:

- [L89](#l89) Bind <code>path</code>: read <code>finding.evidence[0]!.path</code>.
- [L90](#l90) If <code>isExcluded(path, [...profile.excluded, ...config.exclude])</code> is truthy:
  - [L90](#l90) Return to the caller: create a new empty array to accumulate ordered results.
- [L91](#l91) Bind <code>severity</code>: call the named operation with the supplied arguments: <code>ruleLevel(config, finding.ruleId as RuleId, path)</code>.
- [L92](#l92) Return to the caller: test <code>severity === "off"</code>; choose <code>[]</code> when truthy, otherwise <code>[{ ...finding, severity }]</code>.

<a id="fn-4576"></a>
### candidates.flatMap(finding =&gt; { const path = finding.evidence[0]!.path; if (isExcluded(path, [...profile.excluded, ...config.exclude])) return []; const severity = ruleLevel(config, finding.ruleId as RuleId, path); return severity === "off" ? [] : [{ ...fin… callback (93:11)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>candidates.flatMap(finding =&gt; { const path = finding.evidence[0]!.path; if (isExcluded(path, [...profile.excluded, ...config.exclude])) return []; const severity = ruleLevel(config, finding.ruleId as RuleId, path); return severity === "off" ? [] : [{ ...fin…</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L93](#l93) Implicitly return: test <code>a.id &lt; b.id</code>; choose <code>-1</code> when truthy, otherwise <code>a.id &gt; b.id ? 1 : 0</code>.

<a id="fn-4687"></a>
### profile.packageIssues.map callback (94:60)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>profile.packageIssues.map</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>issue</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L94](#l94) Implicitly return: read <code>issue.path</code>.

<a id="fn-4764"></a>
### profile.warnings.filter callback (95:54)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>profile.warnings.filter</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>warning</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L96](#l96) Implicitly return: evaluate <code>warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)</code> left to right with truthy short-circuiting.

<a id="fn-4865"></a>
### profile.warnings.filter(warning =&gt; warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)) .sort callback (97:11)

Synchronous function. Lexically inside [createReport (76:8)](#fn-3692). Passed to <code>profile.warnings.filter(warning =&gt; warning.code !== "invalid-manifest" &#124;&#124; !diagnosedPaths.has(warning.path)) .sort</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>a</code>: supplied by the caller; usage is shown in the steps below.
- <code>b</code>: supplied by the caller; usage is shown in the steps below.

Local bindings (nested callback locals are documented with that callback):

- [L98](#l98) <code>left</code>: serialize the value as JSON: <code>JSON.stringify([a.path, a.code, a.message])</code>.
- [L99](#l99) <code>right</code>: serialize the value as JSON: <code>JSON.stringify([b.path, b.code, b.message])</code>.

Execution:

- [L98](#l98) Bind <code>left</code>: serialize the value as JSON: <code>JSON.stringify([a.path, a.code, a.message])</code>.
- [L99](#l99) Bind <code>right</code>: serialize the value as JSON: <code>JSON.stringify([b.path, b.code, b.message])</code>.
- [L100](#l100) Return to the caller: test <code>left &lt; right</code>; choose <code>-1</code> when truthy, otherwise <code>left &gt; right ? 1 : 0</code>.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>findingSchema</code> | <code>id</code> | <code>z.string().min(1)</code> | [L14](#l14) |
| <code>findingSchema</code> | <code>ruleId</code> | <code>z.string().min(1)</code> | [L15](#l15) |
| <code>findingSchema</code> | <code>severity</code> | <code>z.enum(["error", "warning", "info"])</code> | [L16](#l16) |
| <code>findingSchema</code> | <code>title</code> | <code>z.string().min(1)</code> | [L17](#l17) |
| <code>findingSchema</code> | <code>explanation</code> | <code>z.string().min(1)</code> | [L18](#l18) |
| <code>findingSchema</code> | <code>evidence</code> | <code>z.array(z.object({ path: z.string().min(1), observation: z.string().min(1), line: z.number().int().positive().optional(), excerpt: z.string().optional(), })).min(1)</code> | [L19](#l19) |
| <code>findingSchema</code> | <code>evidence.path</code> | <code>z.string().min(1)</code> | [L20](#l20) |
| <code>findingSchema</code> | <code>evidence.observation</code> | <code>z.string().min(1)</code> | [L21](#l21) |
| <code>findingSchema</code> | <code>evidence.line</code> | <code>z.number().int().positive().optional()</code> | [L22](#l22) |
| <code>findingSchema</code> | <code>evidence.excerpt</code> | <code>z.string().optional()</code> | [L23](#l23) |
| <code>findingSchema</code> | <code>suggestedAction</code> | <code>z.string().min(1)</code> | [L25](#l25) |
| <code>reportSchema</code> | <code>schemaVersion</code> | <code>z.literal(1)</code> | [L30](#l30) |
| <code>reportSchema</code> | <code>root</code> | <code>z.string().min(1)</code> | [L31](#l31) |
| <code>reportSchema</code> | <code>ignorePolicy</code> | <code>repositoryProfileSchema.shape.ignorePolicy</code> | [L32](#l32) |
| <code>reportSchema</code> | <code>findings</code> | <code>z.array(findingSchema)</code> | [L33](#l33) |
| <code>reportSchema</code> | <code>inspectionWarnings</code> | <code>repositoryProfileSchema.shape.warnings</code> | [L34](#l34) |
| <code>reportSchema</code> | <code>ai</code> | <code>aiResultSchema.optional()</code> | [L35](#l35) |
| <code>reportSchema</code> | <code>checks</code> | <code>z.array(checkResultSchema).optional()</code> | [L36](#l36) |
| <code>reportSchema</code> | <code>references</code> | <code>referencesSchema.optional()</code> | [L37](#l37) |
| <code>reportSchema</code> | <code>contracts</code> | <code>z.array(contractResultSchema).optional()</code> | [L38](#l38) |
| <code>reportSchema</code> | <code>architecture</code> | <code>architectureResultSchema.optional()</code> | [L39](#l39) |
| <code>reportSchema</code> | <code>sdkContracts</code> | <code>z.array(sdkResultSchema).optional()</code> | [L40](#l40) |
| <code>reportSchema</code> | <code>currentTask</code> | <code>currentTaskReportSchema.optional()</code> | [L41](#l41) |
| <code>reportSchema</code> | <code>aiAudit</code> | <code>z.object({scope:z.literal('whole-repository'),batches:z.array(aiResultSchema), budgetName:z.string().optional(),stoppedReason:z.string().optional(), selectedPaths:z.array(z.string()),validResponsePaths:z.array(z.string()), skipped:z.array(z.object({path:z.s…</code> | [L42](#l42) |
| <code>reportSchema</code> | <code>aiAudit.scope</code> | <code>z.literal('whole-repository')</code> | [L42](#l42) |
| <code>reportSchema</code> | <code>aiAudit.batches</code> | <code>z.array(aiResultSchema)</code> | [L42](#l42) |
| <code>reportSchema</code> | <code>aiAudit.budgetName</code> | <code>z.string().optional()</code> | [L43](#l43) |
| <code>reportSchema</code> | <code>aiAudit.stoppedReason</code> | <code>z.string().optional()</code> | [L43](#l43) |
| <code>reportSchema</code> | <code>aiAudit.selectedPaths</code> | <code>z.array(z.string())</code> | [L44](#l44) |
| <code>reportSchema</code> | <code>aiAudit.validResponsePaths</code> | <code>z.array(z.string())</code> | [L44](#l44) |
| <code>reportSchema</code> | <code>aiAudit.skipped</code> | <code>z.array(z.object({path:z.string(),reason:z.string()}))</code> | [L45](#l45) |
| <code>reportSchema</code> | <code>aiAudit.skipped.path</code> | <code>z.string()</code> | [L45](#l45) |
| <code>reportSchema</code> | <code>aiAudit.skipped.reason</code> | <code>z.string()</code> | [L45](#l45) |
| <code>reportSchema</code> | <code>aiAudit.state</code> | <code>z.enum(['preview','partial','complete','failed'])</code> | [L46](#l46) |
| <code>reportSchema</code> | <code>workflow</code> | <code>z.object({kind:z.enum(['audit','diff','task']),scope:z.array(z.string()).nullable(),baseline:z.string().nullable(), unavailablePaths:z.array(z.string()), criteria:z.array(z.string()).optional()}).optional()</code> | [L47](#l47) |
| <code>reportSchema</code> | <code>workflow.kind</code> | <code>z.enum(['audit','diff','task'])</code> | [L47](#l47) |
| <code>reportSchema</code> | <code>workflow.scope</code> | <code>z.array(z.string()).nullable()</code> | [L47](#l47) |
| <code>reportSchema</code> | <code>workflow.baseline</code> | <code>z.string().nullable()</code> | [L47](#l47) |
| <code>reportSchema</code> | <code>workflow.unavailablePaths</code> | <code>z.array(z.string())</code> | [L48](#l48) |
| <code>reportSchema</code> | <code>workflow.criteria</code> | <code>z.array(z.string()).optional()</code> | [L49](#l49) |

## Compile-time data contracts

### Finding

```typescript
type Finding = z.infer<typeof findingSchema>;
```

Declared at [L27](#l27). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### Report

```typescript
type Report = z.infer<typeof reportSchema>;
```

Declared at [L51](#l51). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L13](#l13) <code>findingSchema</code>: call the named operation with the supplied arguments: <code>z.object({ id: z.string().min(1), ruleId: z.string().min(1), severity: z.enum(["error", "warning", "info"]), title: z.string().min(1), explanation: z.string().min(1), evidence: z.array(z.object({ path: z.string().min(1), observation: z.string().min(1), line…</code>.
- [L29](#l29) <code>reportSchema</code>: call the named operation with the supplied arguments: <code>z.object({ schemaVersion: z.literal(1), root: z.string().min(1), ignorePolicy:repositoryProfileSchema.shape.ignorePolicy, findings: z.array(findingSchema), inspectionWarnings: repositoryProfileSchema.shape.warnings, ai: aiResultSchema.optional(), checks:z.a…</code>.
- [L53](#l53) <code>rules</code>: create an object with 3 property/spread entries: <code>{ "invalid-json": { ruleId: "package/invalid-json", title: "Package manifest is not valid JSON", explanation: "Tools that consume package.json cannot parse this manifest as JSON.", suggestedAction: "Correct the JSON syntax in this package.json file.", }, "i…</code>; later properties overwrite earlier spread values; the TypeScript assertion adds no runtime validation.

## Directly importing tests

- [reference-evaluation.test.ts](../../test/reference-evaluation.test.ts)

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
   1 | import {architectureResultSchema} from './architecture-contracts.js';
   2 | import {sdkResultSchema} from './sdk-contracts.js';
   3 | import { z } from "zod";
   4 | import { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
   5 | import { configSchema, isExcluded, ruleLevel, type ConfigInput, type RuleId } from "./config.js";
   6 | import { additionalFindings } from "./additional-rules.js";
   7 | import { aiResultSchema } from "./ai/contracts.js";
   8 | import { checkResultSchema } from './checks.js';
   9 | import { referencesSchema } from './resource-contracts.js';
  10 | import { currentTaskReportSchema } from './task-file.js';
  11 | import {contractResultSchema} from './contract-contracts.js';
  12 | 
  13 | export const findingSchema = z.object({
  14 |   id: z.string().min(1),
  15 |   ruleId: z.string().min(1),
  16 |   severity: z.enum(["error", "warning", "info"]),
  17 |   title: z.string().min(1),
  18 |   explanation: z.string().min(1),
  19 |   evidence: z.array(z.object({
  20 |     path: z.string().min(1),
```

<a id="l21"></a>
<a id="l22"></a>
<a id="l23"></a>
<a id="l24"></a>
<a id="l25"></a>
<a id="l27"></a>
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
  21 |     observation: z.string().min(1),
  22 |     line: z.number().int().positive().optional(),
  23 |     excerpt: z.string().optional(),
  24 |   })).min(1),
  25 |   suggestedAction: z.string().min(1),
  26 | });
  27 | export type Finding = z.infer<typeof findingSchema>;
  28 | 
  29 | export const reportSchema = z.object({
  30 |   schemaVersion: z.literal(1),
  31 |   root: z.string().min(1),
  32 |   ignorePolicy:repositoryProfileSchema.shape.ignorePolicy,
  33 |   findings: z.array(findingSchema),
  34 |   inspectionWarnings: repositoryProfileSchema.shape.warnings,
  35 |   ai: aiResultSchema.optional(),
  36 |   checks:z.array(checkResultSchema).optional(),
  37 |   references:referencesSchema.optional(),
  38 |   contracts:z.array(contractResultSchema).optional(),
  39 |   architecture:architectureResultSchema.optional(),
  40 |   sdkContracts:z.array(sdkResultSchema).optional(),
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
<a id="l51"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l55"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l60"></a>

```text
  41 |   currentTask:currentTaskReportSchema.optional(),
  42 |   aiAudit:z.object({scope:z.literal('whole-repository'),batches:z.array(aiResultSchema),
  43 |     budgetName:z.string().optional(),stoppedReason:z.string().optional(),
  44 |     selectedPaths:z.array(z.string()),validResponsePaths:z.array(z.string()),
  45 |     skipped:z.array(z.object({path:z.string(),reason:z.string()})),
  46 |     state:z.enum(['preview','partial','complete','failed'])}).optional(),
  47 |   workflow: z.object({kind:z.enum(['audit','diff','task']),scope:z.array(z.string()).nullable(),baseline:z.string().nullable(),
  48 |     unavailablePaths:z.array(z.string()),
  49 |     criteria:z.array(z.string()).optional()}).optional(),
  50 | });
  51 | export type Report = z.infer<typeof reportSchema>;
  52 | 
  53 | const rules = {
  54 |   "invalid-json": {
  55 |     ruleId: "package/invalid-json",
  56 |     title: "Package manifest is not valid JSON",
  57 |     explanation: "Tools that consume package.json cannot parse this manifest as JSON.",
  58 |     suggestedAction: "Correct the JSON syntax in this package.json file.",
  59 |   },
  60 |   "invalid-package": {
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
<a id="l69"></a>
<a id="l70"></a>
<a id="l72"></a>
<a id="l73"></a>
<a id="l76"></a>
<a id="l77"></a>
<a id="l78"></a>
<a id="l79"></a>
<a id="l80"></a>

```text
  61 |     ruleId: "package/invalid-object",
  62 |     title: "Package manifest is not an object",
  63 |     explanation: "A package manifest must contain a JSON object; an array, primitive, or null cannot describe its fields.",
  64 |     suggestedAction: "Replace the top-level value with a JSON object containing the intended package fields.",
  65 |   },
  66 |   "invalid-scripts": {
  67 |     ruleId: "package/invalid-scripts",
  68 |     title: "Package scripts have an invalid structure",
  69 |     explanation: "The scripts field must map script names to command strings when present.",
  70 |     suggestedAction: "Use an object with string command values, or omit scripts if none are needed.",
  71 |   },
  72 | } satisfies Record<RepositoryProfile["packageIssues"][number]["code"],
  73 |   Pick<Finding, "ruleId" | "title" | "explanation" | "suggestedAction">>;
  74 | 
  75 | /** Evaluate captured facts only. Does not read files or execute repository code. */
  76 | export function createReport(input: RepositoryProfile, options: ConfigInput = {}): Report {
  77 |   const config = configSchema.parse(options);
  78 |   const profile = repositoryProfileSchema.parse(input);
  79 |   const candidates = profile.packageIssues.map(issue => {
  80 |     const rule = rules[issue.code];
```

<a id="l81"></a>
<a id="l82"></a>
<a id="l83"></a>
<a id="l84"></a>
<a id="l85"></a>
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
  81 |     return findingSchema.parse({
  82 |       ...rule,
  83 |       id: `${rule.ruleId}:${encodeURIComponent(issue.path)}`,
  84 |       severity: "error",
  85 |       evidence: [{ path: issue.path, observation: issue.observation }],
  86 |     });
  87 |   }).concat(additionalFindings(profile, config));
  88 |   const findings = candidates.flatMap(finding => {
  89 |     const path = finding.evidence[0]!.path;
  90 |     if (isExcluded(path, [...profile.excluded, ...config.exclude])) return [];
  91 |     const severity = ruleLevel(config, finding.ruleId as RuleId, path);
  92 |     return severity === "off" ? [] : [{ ...finding, severity }];
  93 |   }).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  94 |   const diagnosedPaths = new Set(profile.packageIssues.map(issue => issue.path));
  95 |   const inspectionWarnings = profile.warnings.filter(warning =>
  96 |     warning.code !== "invalid-manifest" || !diagnosedPaths.has(warning.path))
  97 |     .sort((a, b) => {
  98 |       const left = JSON.stringify([a.path, a.code, a.message]);
  99 |       const right = JSON.stringify([b.path, b.code, b.message]);
 100 |       return left < right ? -1 : left > right ? 1 : 0;
```

<a id="l102"></a>

```text
 101 |     });
 102 |   return reportSchema.parse({ schemaVersion: 1, root: profile.root, findings, inspectionWarnings,...(profile.ignorePolicy?{ignorePolicy:profile.ignorePolicy}:{}) });
 103 | }
 104 | 
```
