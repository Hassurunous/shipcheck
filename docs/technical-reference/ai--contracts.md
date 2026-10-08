# src/ai/contracts.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

These schemas bound settings, candidate shapes, exact citation locations, reference conflicts, task assessments and report coverage. Settings defaults do not authorize execution. Candidate evidenceStatus remains unverified even when a separate evidenceVerification says matched. The schema permits up to 4096 configured output tokens, but the current live allowance path enforces its narrower 2000-token cap.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `b48b364561c73a86bd002d3fffbea69731ba8d7df6c0722acde1e8d1ef82f707`.

This chapter inventories **2 function bodies/callbacks**, **13 variable declarations**, and **4 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators

- <code>zod</code>: <code>z</code>.

## Module execution

- [L3](#l3) Bind <code>modeSchema</code>: call the named operation with the supplied arguments: <code>z.enum(['low-cost', 'balanced', 'high-quality'])</code>.
- [L5](#l5) Bind <code>aiSettingsSchema</code>: call the named operation with the supplied arguments: <code>z.object({ apiKeyEnv:z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).default('SHIPCHECK_API_KEY'), scope:z.enum(['bounded','whole-repository']).default('bounded'), maxBatches:z.number().int().min(1).max(100).default(20), focus:z.array(z.enum(['correctness','ra…</code>.
- [L24](#l24) Bind <code>evidenceSchema</code>: call the named operation with the supplied arguments: <code>z.object({ path: z.string().min(1).max(512).refine(path =&gt; !/[:\\\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part =&gt; part !== '' &amp;&amp; part !== '.' &amp;&amp; part !== '..'), 'Expected a relative source path.'), startLine: z.number().int().positive(), endLine:…</code>.
- [L31](#l31) Bind <code>candidateSchema</code>: call the named operation with the supplied arguments: <code>z.object({ title: z.string().min(1).max(200), severity: z.enum(['error', 'warning', 'info']), explanation: z.string().min(1).max(4000), suggestedAction: z.string().min(1).max(2000), evidence: z.array(evidenceSchema).min(1).max(5), }).strict()</code>.
- [L38](#l38) Bind <code>qaOutputSchema</code>: call the named operation with the supplied arguments: <code>z.object({ candidates: z.array(candidateSchema).max(20) }).strict()</code>.
- [L39](#l39) Bind <code>referenceConflictSchema</code>: call the named operation with the supplied arguments: <code>z.object({explanation:z.string().min(1).max(4000), evidence:z.array(evidenceSchema).min(2).max(5)}).strict()</code>.
- [L41](#l41) Bind <code>referenceQaOutputSchema</code>: call the named operation with the supplied arguments: <code>qaOutputSchema.extend({referenceConflicts:z.array(referenceConflictSchema).max(10)}).strict()</code>.
- [L42](#l42) Bind <code>requirementStatusSchema</code>: call the named operation with the supplied arguments: <code>z.enum(['supporting-evidence','potential-violation','insufficient-evidence','needs-clarification'])</code>.
- [L43](#l43) Bind <code>requirementAssessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({requirementId:z.string().min(1).max(64),status:requirementStatusSchema, explanation:z.string().min(1).max(4000),relatedRequirementIds:z.array(z.string().min(1).max(64)).max(50), evidence:z.array(evidenceSchema).max(5)}).strict()</code>.
- [L48](#l48) Bind <code>verificationSchema</code>: call the named operation with the supplied arguments: <code>z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({ path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(), }))})</code>.
- [L51](#l51) Bind <code>taskReviewSchema</code>: call the named operation with the supplied arguments: <code>z.object({taskHash:z.string(),state:z.enum(['not-assessed','assessed','partial','changed']), freshness:z.enum(['not-checked','unchanged','changed-or-unavailable']), assessments:z.array(requirementAssessmentSchema.extend({proposedStatus:requirementStatusSche…</code>.
- [L56](#l56) Bind <code>contextPreviewSchema</code>: call the named operation with the supplied arguments: <code>z.object({ files: z.array(z.object({path: z.string(), bytes: z.number().int(), lines: z.number().int(), sha256: z.string(), freshness:z.enum(['unchanged','changed-or-unavailable']).optional()})), skipped: z.array(z.object({path: z.string(), reason: z.string…</code>.
- [L70](#l70) Bind <code>aiResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ execution: z.enum(['preview', 'mock', 'injected', 'live']), status: z.enum(['preview', 'completed', 'failed']), mode: modeSchema, reviewer: z.enum(['qa/reliability-v1','qa/reliability-v2']), model: z.string().nullable(), plannedModel: z.string().…</code>.

## Function index

- [z.string().min(1).max(512).refine callback (25:43)](#fn-1450)
- [path.split('/').every callback (26:30)](#fn-1520)

<a id="fn-1450"></a>
### z.string().min(1).max(512).refine callback (25:43)

Synchronous function. Defined in module scope. Passed to <code>z.string().min(1).max(512).refine</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>path</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L25](#l25) Implicitly return: evaluate <code>!/[:\\\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part =&gt; part !== '' &amp;&amp; part !== '.' &amp;&amp; part !== '..')</code> left to right with falsy short-circuiting.

<a id="fn-1520"></a>
### path.split('/').every callback (26:30)

Synchronous function. Lexically inside [z.string().min(1).max(512).refine callback (25:43)](#fn-1450). Passed to <code>path.split('/').every</code>; the receiving API determines when/how often it runs.

Parameters:

- <code>part</code>: supplied by the caller; usage is shown in the steps below.

Execution:

[L26](#l26) Implicitly return: evaluate <code>part !== '' &amp;&amp; part !== '.' &amp;&amp; part !== '..'</code> left to right with falsy short-circuiting.

## Schema field dictionary

Each row is the runtime constraint expression for that field. `optional` accepts omission, `nullable` accepts null, `default` supplies a missing value, `strict` rejects unknown keys, and refinement callbacks impose the additional conditions documented above. Nested paths identify nested object fields; arrays retain their array cardinality in the parent expression.

| Schema | Field | Constraint / conversion | Source |
| --- | --- | --- | --- |
| <code>aiSettingsSchema</code> | <code>apiKeyEnv</code> | <code>z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).default('SHIPCHECK_API_KEY')</code> | [L6](#l6) |
| <code>aiSettingsSchema</code> | <code>scope</code> | <code>z.enum(['bounded','whole-repository']).default('bounded')</code> | [L7](#l7) |
| <code>aiSettingsSchema</code> | <code>maxBatches</code> | <code>z.number().int().min(1).max(100).default(20)</code> | [L8](#l8) |
| <code>aiSettingsSchema</code> | <code>focus</code> | <code>z.array(z.enum(['correctness','race-conditions','resource-management','error-handling','code-smells'])).min(1).max(5).default(['correctness','race-conditions','resource-management','error-handling'])</code> | [L9](#l9) |
| <code>aiSettingsSchema</code> | <code>mode</code> | <code>modeSchema.default('low-cost')</code> | [L10](#l10) |
| <code>aiSettingsSchema</code> | <code>models</code> | <code>z.object({ 'low-cost': z.string().min(1).max(100).nullable().default(null), balanced: z.string().min(1).max(100).nullable().default(null), 'high-quality': z.string().min(1).max(100).nullable().default(null), }).strict().default({'low-cost': null, balanced: …</code> | [L11](#l11) |
| <code>aiSettingsSchema</code> | <code>models.'low-cost'</code> | <code>z.string().min(1).max(100).nullable().default(null)</code> | [L12](#l12) |
| <code>aiSettingsSchema</code> | <code>models.balanced</code> | <code>z.string().min(1).max(100).nullable().default(null)</code> | [L13](#l13) |
| <code>aiSettingsSchema</code> | <code>models.'high-quality'</code> | <code>z.string().min(1).max(100).nullable().default(null)</code> | [L14](#l14) |
| <code>aiSettingsSchema</code> | <code>maxFiles</code> | <code>z.number().int().min(1).max(64).default(12)</code> | [L16](#l16) |
| <code>aiSettingsSchema</code> | <code>maxFileBytes</code> | <code>z.number().int().min(128).max(65536).default(16000)</code> | [L17](#l17) |
| <code>aiSettingsSchema</code> | <code>maxContextBytes</code> | <code>z.number().int().min(256).max(262144).default(48000)</code> | [L18](#l18) |
| <code>aiSettingsSchema</code> | <code>maxOutputTokens</code> | <code>z.number().int().min(128).max(4096).default(1000)</code> | [L19](#l19) |
| <code>aiSettingsSchema</code> | <code>timeoutMs</code> | <code>z.number().int().min(10).max(60000).default(10000)</code> | [L20](#l20) |
| <code>evidenceSchema</code> | <code>path</code> | <code>z.string().min(1).max(512).refine(path =&gt; !/[:\\\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part =&gt; part !== '' &amp;&amp; part !== '.' &amp;&amp; part !== '..'), 'Expected a relative source path.')</code> | [L25](#l25) |
| <code>evidenceSchema</code> | <code>startLine</code> | <code>z.number().int().positive()</code> | [L27](#l27) |
| <code>evidenceSchema</code> | <code>endLine</code> | <code>z.number().int().positive()</code> | [L28](#l28) |
| <code>evidenceSchema</code> | <code>excerpt</code> | <code>z.string().min(1).max(4000)</code> | [L29](#l29) |
| <code>candidateSchema</code> | <code>title</code> | <code>z.string().min(1).max(200)</code> | [L32](#l32) |
| <code>candidateSchema</code> | <code>severity</code> | <code>z.enum(['error', 'warning', 'info'])</code> | [L33](#l33) |
| <code>candidateSchema</code> | <code>explanation</code> | <code>z.string().min(1).max(4000)</code> | [L34](#l34) |
| <code>candidateSchema</code> | <code>suggestedAction</code> | <code>z.string().min(1).max(2000)</code> | [L35](#l35) |
| <code>candidateSchema</code> | <code>evidence</code> | <code>z.array(evidenceSchema).min(1).max(5)</code> | [L36](#l36) |
| <code>qaOutputSchema</code> | <code>candidates</code> | <code>z.array(candidateSchema).max(20)</code> | [L38](#l38) |
| <code>referenceConflictSchema</code> | <code>explanation</code> | <code>z.string().min(1).max(4000)</code> | [L39](#l39) |
| <code>referenceConflictSchema</code> | <code>evidence</code> | <code>z.array(evidenceSchema).min(2).max(5)</code> | [L40](#l40) |
| <code>referenceQaOutputSchema</code> | <code>referenceConflicts</code> | <code>z.array(referenceConflictSchema).max(10)</code> | [L41](#l41) |
| <code>requirementAssessmentSchema</code> | <code>requirementId</code> | <code>z.string().min(1).max(64)</code> | [L43](#l43) |
| <code>requirementAssessmentSchema</code> | <code>status</code> | <code>requirementStatusSchema</code> | [L43](#l43) |
| <code>requirementAssessmentSchema</code> | <code>explanation</code> | <code>z.string().min(1).max(4000)</code> | [L44](#l44) |
| <code>requirementAssessmentSchema</code> | <code>relatedRequirementIds</code> | <code>z.array(z.string().min(1).max(64)).max(50)</code> | [L44](#l44) |
| <code>requirementAssessmentSchema</code> | <code>evidence</code> | <code>z.array(evidenceSchema).max(5)</code> | [L45](#l45) |
| <code>verificationSchema</code> | <code>status</code> | <code>z.enum(['matched','rejected'])</code> | [L48](#l48) |
| <code>verificationSchema</code> | <code>checks</code> | <code>z.array(z.object({ path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(), }))</code> | [L48](#l48) |
| <code>verificationSchema</code> | <code>checks.path</code> | <code>z.string()</code> | [L49](#l49) |
| <code>verificationSchema</code> | <code>checks.status</code> | <code>z.enum(['matched','rejected'])</code> | [L49](#l49) |
| <code>verificationSchema</code> | <code>checks.reason</code> | <code>z.string()</code> | [L49](#l49) |
| <code>taskReviewSchema</code> | <code>taskHash</code> | <code>z.string()</code> | [L51](#l51) |
| <code>taskReviewSchema</code> | <code>state</code> | <code>z.enum(['not-assessed','assessed','partial','changed'])</code> | [L51](#l51) |
| <code>taskReviewSchema</code> | <code>freshness</code> | <code>z.enum(['not-checked','unchanged','changed-or-unavailable'])</code> | [L52](#l52) |
| <code>taskReviewSchema</code> | <code>assessments</code> | <code>z.array(requirementAssessmentSchema.extend({proposedStatus:requirementStatusSchema, evidenceVerification:verificationSchema.optional()})).max(50)</code> | [L53](#l53) |
| <code>taskReviewSchema</code> | <code>assessments.proposedStatus</code> | <code>requirementStatusSchema</code> | [L53](#l53) |
| <code>taskReviewSchema</code> | <code>assessments.evidenceVerification</code> | <code>verificationSchema.optional()</code> | [L54](#l54) |
| <code>contextPreviewSchema</code> | <code>files</code> | <code>z.array(z.object({path: z.string(), bytes: z.number().int(), lines: z.number().int(), sha256: z.string(), freshness:z.enum(['unchanged','changed-or-unavailable']).optional()}))</code> | [L57](#l57) |
| <code>contextPreviewSchema</code> | <code>files.path</code> | <code>z.string()</code> | [L57](#l57) |
| <code>contextPreviewSchema</code> | <code>files.bytes</code> | <code>z.number().int()</code> | [L57](#l57) |
| <code>contextPreviewSchema</code> | <code>files.lines</code> | <code>z.number().int()</code> | [L57](#l57) |
| <code>contextPreviewSchema</code> | <code>files.sha256</code> | <code>z.string()</code> | [L57](#l57) |
| <code>contextPreviewSchema</code> | <code>files.freshness</code> | <code>z.enum(['unchanged','changed-or-unavailable']).optional()</code> | [L58](#l58) |
| <code>contextPreviewSchema</code> | <code>skipped</code> | <code>z.array(z.object({path: z.string(), reason: z.string()}))</code> | [L59](#l59) |
| <code>contextPreviewSchema</code> | <code>skipped.path</code> | <code>z.string()</code> | [L59](#l59) |
| <code>contextPreviewSchema</code> | <code>skipped.reason</code> | <code>z.string()</code> | [L59](#l59) |
| <code>contextPreviewSchema</code> | <code>serializedBytes</code> | <code>z.number().int().nonnegative()</code> | [L60](#l60) |
| <code>contextPreviewSchema</code> | <code>limited</code> | <code>z.boolean()</code> | [L61](#l61) |
| <code>contextPreviewSchema</code> | <code>task</code> | <code>z.object({id:z.string(),sha256:z.string(),bytes:z.number().int(),requirementIds:z.array(z.string())}).optional()</code> | [L62](#l62) |
| <code>contextPreviewSchema</code> | <code>task.id</code> | <code>z.string()</code> | [L62](#l62) |
| <code>contextPreviewSchema</code> | <code>task.sha256</code> | <code>z.string()</code> | [L62](#l62) |
| <code>contextPreviewSchema</code> | <code>task.bytes</code> | <code>z.number().int()</code> | [L62](#l62) |
| <code>contextPreviewSchema</code> | <code>task.requirementIds</code> | <code>z.array(z.string())</code> | [L62](#l62) |
| <code>contextPreviewSchema</code> | <code>references</code> | <code>z.array(z.object({id:z.string(),path:z.string(),sha256:z.string().nullable(), status:z.string(),required:z.boolean(),freshness:z.enum(['unchanged','changed-or-unavailable']).optional()})).optional()</code> | [L63](#l63) |
| <code>contextPreviewSchema</code> | <code>references.id</code> | <code>z.string()</code> | [L63](#l63) |
| <code>contextPreviewSchema</code> | <code>references.path</code> | <code>z.string()</code> | [L63](#l63) |
| <code>contextPreviewSchema</code> | <code>references.sha256</code> | <code>z.string().nullable()</code> | [L63](#l63) |
| <code>contextPreviewSchema</code> | <code>references.status</code> | <code>z.string()</code> | [L64](#l64) |
| <code>contextPreviewSchema</code> | <code>references.required</code> | <code>z.boolean()</code> | [L64](#l64) |
| <code>contextPreviewSchema</code> | <code>references.freshness</code> | <code>z.enum(['unchanged','changed-or-unavailable']).optional()</code> | [L64](#l64) |
| <code>contextPreviewSchema</code> | <code>requestedPaths</code> | <code>z.array(z.string()).optional()</code> | [L65](#l65) |
| <code>contextPreviewSchema</code> | <code>supportingPaths</code> | <code>z.array(z.string()).optional()</code> | [L66](#l66) |
| <code>contextPreviewSchema</code> | <code>dependencies</code> | <code>z.array(z.object({from:z.string(),specifier:z.string(),path:z.string().nullable(), status:z.enum(['included','unresolved','omitted'])})).optional()</code> | [L67](#l67) |
| <code>contextPreviewSchema</code> | <code>dependencies.from</code> | <code>z.string()</code> | [L67](#l67) |
| <code>contextPreviewSchema</code> | <code>dependencies.specifier</code> | <code>z.string()</code> | [L67](#l67) |
| <code>contextPreviewSchema</code> | <code>dependencies.path</code> | <code>z.string().nullable()</code> | [L67](#l67) |
| <code>contextPreviewSchema</code> | <code>dependencies.status</code> | <code>z.enum(['included','unresolved','omitted'])</code> | [L68](#l68) |
| <code>aiResultSchema</code> | <code>execution</code> | <code>z.enum(['preview', 'mock', 'injected', 'live'])</code> | [L71](#l71) |
| <code>aiResultSchema</code> | <code>status</code> | <code>z.enum(['preview', 'completed', 'failed'])</code> | [L72](#l72) |
| <code>aiResultSchema</code> | <code>mode</code> | <code>modeSchema</code> | [L73](#l73) |
| <code>aiResultSchema</code> | <code>reviewer</code> | <code>z.enum(['qa/reliability-v1','qa/reliability-v2'])</code> | [L74](#l74) |
| <code>aiResultSchema</code> | <code>model</code> | <code>z.string().nullable()</code> | [L75](#l75) |
| <code>aiResultSchema</code> | <code>plannedModel</code> | <code>z.string().nullable()</code> | [L76](#l76) |
| <code>aiResultSchema</code> | <code>preview</code> | <code>contextPreviewSchema</code> | [L77](#l77) |
| <code>aiResultSchema</code> | <code>maxOutputTokens</code> | <code>z.number().int()</code> | [L78](#l78) |
| <code>aiResultSchema</code> | <code>requestBytes</code> | <code>z.number().int().nonnegative()</code> | [L79](#l79) |
| <code>aiResultSchema</code> | <code>estimatedInputTokens</code> | <code>z.number().int().nonnegative()</code> | [L80](#l80) |
| <code>aiResultSchema</code> | <code>estimatedCostUsd</code> | <code>z.null()</code> | [L81](#l81) |
| <code>aiResultSchema</code> | <code>actualCostUsd</code> | <code>z.number().nullable()</code> | [L82](#l82) |
| <code>aiResultSchema</code> | <code>retries</code> | <code>z.literal(0)</code> | [L83](#l83) |
| <code>aiResultSchema</code> | <code>trial</code> | <code>z.object({countedInputTokens:z.number().int(), reservedUsd:z.number(), pricedUsageUpperBoundUsd:z.number(), usage:z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})}).optional()</code> | [L84](#l84) |
| <code>aiResultSchema</code> | <code>trial.countedInputTokens</code> | <code>z.number().int()</code> | [L84](#l84) |
| <code>aiResultSchema</code> | <code>trial.reservedUsd</code> | <code>z.number()</code> | [L84](#l84) |
| <code>aiResultSchema</code> | <code>trial.pricedUsageUpperBoundUsd</code> | <code>z.number()</code> | [L84](#l84) |
| <code>aiResultSchema</code> | <code>trial.usage</code> | <code>z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})</code> | [L85](#l85) |
| <code>aiResultSchema</code> | <code>trial.usage.input_tokens</code> | <code>z.number().int()</code> | [L85](#l85) |
| <code>aiResultSchema</code> | <code>trial.usage.output_tokens</code> | <code>z.number().int()</code> | [L85](#l85) |
| <code>aiResultSchema</code> | <code>budget</code> | <code>z.object({name:z.string(),countedInputTokens:z.number().int(),reservedUsd:z.number(),pricedUsageUpperBoundUsd:z.number(), usage:z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})}).optional()</code> | [L86](#l86) |
| <code>aiResultSchema</code> | <code>budget.name</code> | <code>z.string()</code> | [L86](#l86) |
| <code>aiResultSchema</code> | <code>budget.countedInputTokens</code> | <code>z.number().int()</code> | [L86](#l86) |
| <code>aiResultSchema</code> | <code>budget.reservedUsd</code> | <code>z.number()</code> | [L86](#l86) |
| <code>aiResultSchema</code> | <code>budget.pricedUsageUpperBoundUsd</code> | <code>z.number()</code> | [L86](#l86) |
| <code>aiResultSchema</code> | <code>budget.usage</code> | <code>z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})</code> | [L87](#l87) |
| <code>aiResultSchema</code> | <code>budget.usage.input_tokens</code> | <code>z.number().int()</code> | [L87](#l87) |
| <code>aiResultSchema</code> | <code>budget.usage.output_tokens</code> | <code>z.number().int()</code> | [L87](#l87) |
| <code>aiResultSchema</code> | <code>candidates</code> | <code>z.array(candidateSchema.extend({ id: z.string(), evidenceStatus: z.literal('unverified'), origin: z.literal('ai'), referenceConflict:z.boolean().optional(), evidenceVerification: z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({ path…</code> | [L88](#l88) |
| <code>aiResultSchema</code> | <code>candidates.id</code> | <code>z.string()</code> | [L89](#l89) |
| <code>aiResultSchema</code> | <code>candidates.evidenceStatus</code> | <code>z.literal('unverified')</code> | [L89](#l89) |
| <code>aiResultSchema</code> | <code>candidates.origin</code> | <code>z.literal('ai')</code> | [L89](#l89) |
| <code>aiResultSchema</code> | <code>candidates.referenceConflict</code> | <code>z.boolean().optional()</code> | [L90](#l90) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification</code> | <code>z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({ path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(), }))}).optional()</code> | [L91](#l91) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification.status</code> | <code>z.enum(['matched','rejected'])</code> | [L91](#l91) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification.checks</code> | <code>z.array(z.object({ path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(), }))</code> | [L91](#l91) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification.checks.path</code> | <code>z.string()</code> | [L92](#l92) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification.checks.status</code> | <code>z.enum(['matched','rejected'])</code> | [L92](#l92) |
| <code>aiResultSchema</code> | <code>candidates.evidenceVerification.checks.reason</code> | <code>z.string()</code> | [L92](#l92) |
| <code>aiResultSchema</code> | <code>referenceConflicts</code> | <code>z.array(referenceConflictSchema.extend({id:z.string(), status:z.literal('needs-clarification'),evidenceVerification:verificationSchema})).max(10).optional()</code> | [L95](#l95) |
| <code>aiResultSchema</code> | <code>referenceConflicts.id</code> | <code>z.string()</code> | [L95](#l95) |
| <code>aiResultSchema</code> | <code>referenceConflicts.status</code> | <code>z.literal('needs-clarification')</code> | [L96](#l96) |
| <code>aiResultSchema</code> | <code>referenceConflicts.evidenceVerification</code> | <code>verificationSchema</code> | [L96](#l96) |
| <code>aiResultSchema</code> | <code>error</code> | <code>z.object({code: z.string(), message: z.string()}).nullable()</code> | [L97](#l97) |
| <code>aiResultSchema</code> | <code>error.code</code> | <code>z.string()</code> | [L97](#l97) |
| <code>aiResultSchema</code> | <code>error.message</code> | <code>z.string()</code> | [L97](#l97) |
| <code>aiResultSchema</code> | <code>taskReview</code> | <code>taskReviewSchema.optional()</code> | [L98](#l98) |
| <code>aiResultSchema</code> | <code>coverage</code> | <code>z.object({state:z.enum(['preview','complete','partial','failed']),selectedPaths:z.array(z.string()), validResponsePaths:z.array(z.string()),failedResponsePaths:z.array(z.string()), skippedPaths:z.array(z.string()),matchedCandidates:z.number().int(),rejected…</code> | [L99](#l99) |
| <code>aiResultSchema</code> | <code>coverage.state</code> | <code>z.enum(['preview','complete','partial','failed'])</code> | [L99](#l99) |
| <code>aiResultSchema</code> | <code>coverage.selectedPaths</code> | <code>z.array(z.string())</code> | [L99](#l99) |
| <code>aiResultSchema</code> | <code>coverage.validResponsePaths</code> | <code>z.array(z.string())</code> | [L100](#l100) |
| <code>aiResultSchema</code> | <code>coverage.failedResponsePaths</code> | <code>z.array(z.string())</code> | [L100](#l100) |
| <code>aiResultSchema</code> | <code>coverage.skippedPaths</code> | <code>z.array(z.string())</code> | [L101](#l101) |
| <code>aiResultSchema</code> | <code>coverage.matchedCandidates</code> | <code>z.number().int()</code> | [L101](#l101) |
| <code>aiResultSchema</code> | <code>coverage.rejectedCandidates</code> | <code>z.number().int()</code> | [L101](#l101) |
| <code>aiResultSchema</code> | <code>coverage.outOfScopeCandidates</code> | <code>z.number().int()</code> | [L102](#l102) |

## Compile-time data contracts

### AiMode

```typescript
type AiMode = z.infer<typeof modeSchema>;
```

Declared at [L4](#l4). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### AiSettings

```typescript
type AiSettings = z.infer<typeof aiSettingsSchema>;
```

Declared at [L22](#l22). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### QaOutput

```typescript
type QaOutput = z.infer<typeof qaOutputSchema> & {referenceConflicts?:z.infer<typeof referenceConflictSchema>[];
  taskAssessments?:z.infer<typeof requirementAssessmentSchema>[]};
```

Declared at [L46](#l46). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

### AiResult

```typescript
type AiResult = z.infer<typeof aiResultSchema>;
```

Declared at [L104](#l104). This TypeScript declaration is erased during compilation; runtime validation occurs only where a schema/parser or explicit guard is called.

## Module bindings

- [L3](#l3) <code>modeSchema</code>: call the named operation with the supplied arguments: <code>z.enum(['low-cost', 'balanced', 'high-quality'])</code>.
- [L5](#l5) <code>aiSettingsSchema</code>: call the named operation with the supplied arguments: <code>z.object({ apiKeyEnv:z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).default('SHIPCHECK_API_KEY'), scope:z.enum(['bounded','whole-repository']).default('bounded'), maxBatches:z.number().int().min(1).max(100).default(20), focus:z.array(z.enum(['correctness','ra…</code>.
- [L24](#l24) <code>evidenceSchema</code>: call the named operation with the supplied arguments: <code>z.object({ path: z.string().min(1).max(512).refine(path =&gt; !/[:\\\u0000-\u001f]/.test(path) &amp;&amp; path.split('/').every(part =&gt; part !== '' &amp;&amp; part !== '.' &amp;&amp; part !== '..'), 'Expected a relative source path.'), startLine: z.number().int().positive(), endLine:…</code>.
- [L31](#l31) <code>candidateSchema</code>: call the named operation with the supplied arguments: <code>z.object({ title: z.string().min(1).max(200), severity: z.enum(['error', 'warning', 'info']), explanation: z.string().min(1).max(4000), suggestedAction: z.string().min(1).max(2000), evidence: z.array(evidenceSchema).min(1).max(5), }).strict()</code>.
- [L38](#l38) <code>qaOutputSchema</code>: call the named operation with the supplied arguments: <code>z.object({ candidates: z.array(candidateSchema).max(20) }).strict()</code>.
- [L39](#l39) <code>referenceConflictSchema</code>: call the named operation with the supplied arguments: <code>z.object({explanation:z.string().min(1).max(4000), evidence:z.array(evidenceSchema).min(2).max(5)}).strict()</code>.
- [L41](#l41) <code>referenceQaOutputSchema</code>: call the named operation with the supplied arguments: <code>qaOutputSchema.extend({referenceConflicts:z.array(referenceConflictSchema).max(10)}).strict()</code>.
- [L42](#l42) <code>requirementStatusSchema</code>: call the named operation with the supplied arguments: <code>z.enum(['supporting-evidence','potential-violation','insufficient-evidence','needs-clarification'])</code>.
- [L43](#l43) <code>requirementAssessmentSchema</code>: call the named operation with the supplied arguments: <code>z.object({requirementId:z.string().min(1).max(64),status:requirementStatusSchema, explanation:z.string().min(1).max(4000),relatedRequirementIds:z.array(z.string().min(1).max(64)).max(50), evidence:z.array(evidenceSchema).max(5)}).strict()</code>.
- [L48](#l48) <code>verificationSchema</code>: call the named operation with the supplied arguments: <code>z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({ path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(), }))})</code>.
- [L51](#l51) <code>taskReviewSchema</code>: call the named operation with the supplied arguments: <code>z.object({taskHash:z.string(),state:z.enum(['not-assessed','assessed','partial','changed']), freshness:z.enum(['not-checked','unchanged','changed-or-unavailable']), assessments:z.array(requirementAssessmentSchema.extend({proposedStatus:requirementStatusSche…</code>.
- [L56](#l56) <code>contextPreviewSchema</code>: call the named operation with the supplied arguments: <code>z.object({ files: z.array(z.object({path: z.string(), bytes: z.number().int(), lines: z.number().int(), sha256: z.string(), freshness:z.enum(['unchanged','changed-or-unavailable']).optional()})), skipped: z.array(z.object({path: z.string(), reason: z.string…</code>.
- [L70](#l70) <code>aiResultSchema</code>: call the named operation with the supplied arguments: <code>z.object({ execution: z.enum(['preview', 'mock', 'injected', 'live']), status: z.enum(['preview', 'completed', 'failed']), mode: modeSchema, reviewer: z.enum(['qa/reliability-v1','qa/reliability-v2']), model: z.string().nullable(), plannedModel: z.string().…</code>.

## Directly importing tests

- [audit-budget.test.ts](../../test/audit-budget.test.ts)
- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)
- [evidence.test.ts](../../test/evidence.test.ts)
- [ignore-policy.test.ts](../../test/ignore-policy.test.ts)
- [live-ai.test.ts](../../test/live-ai.test.ts)
- [p7.test.ts](../../test/p7.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
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
   1 | import { z } from 'zod';
   2 | 
   3 | export const modeSchema = z.enum(['low-cost', 'balanced', 'high-quality']);
   4 | export type AiMode = z.infer<typeof modeSchema>;
   5 | export const aiSettingsSchema = z.object({
   6 |   apiKeyEnv:z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).default('SHIPCHECK_API_KEY'),
   7 |   scope:z.enum(['bounded','whole-repository']).default('bounded'),
   8 |   maxBatches:z.number().int().min(1).max(100).default(20),
   9 |   focus:z.array(z.enum(['correctness','race-conditions','resource-management','error-handling','code-smells'])).min(1).max(5).default(['correctness','race-conditions','resource-management','error-handling']),
  10 |   mode: modeSchema.default('low-cost'),
  11 |   models: z.object({
  12 |     'low-cost': z.string().min(1).max(100).nullable().default(null),
  13 |     balanced: z.string().min(1).max(100).nullable().default(null),
  14 |     'high-quality': z.string().min(1).max(100).nullable().default(null),
  15 |   }).strict().default({'low-cost': null, balanced: null, 'high-quality': null}),
  16 |   maxFiles: z.number().int().min(1).max(64).default(12),
  17 |   maxFileBytes: z.number().int().min(128).max(65536).default(16000),
  18 |   maxContextBytes: z.number().int().min(256).max(262144).default(48000),
  19 |   maxOutputTokens: z.number().int().min(128).max(4096).default(1000),
  20 |   timeoutMs: z.number().int().min(10).max(60000).default(10000),
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
  21 | }).strict();
  22 | export type AiSettings = z.infer<typeof aiSettingsSchema>;
  23 | 
  24 | const evidenceSchema = z.object({
  25 |   path: z.string().min(1).max(512).refine(path => !/[:\\\u0000-\u001f]/.test(path)
  26 |     && path.split('/').every(part => part !== '' && part !== '.' && part !== '..'), 'Expected a relative source path.'),
  27 |   startLine: z.number().int().positive(),
  28 |   endLine: z.number().int().positive(),
  29 |   excerpt: z.string().min(1).max(4000),
  30 | }).strict();
  31 | export const candidateSchema = z.object({
  32 |   title: z.string().min(1).max(200),
  33 |   severity: z.enum(['error', 'warning', 'info']),
  34 |   explanation: z.string().min(1).max(4000),
  35 |   suggestedAction: z.string().min(1).max(2000),
  36 |   evidence: z.array(evidenceSchema).min(1).max(5),
  37 | }).strict();
  38 | export const qaOutputSchema = z.object({ candidates: z.array(candidateSchema).max(20) }).strict();
  39 | export const referenceConflictSchema=z.object({explanation:z.string().min(1).max(4000),
  40 |   evidence:z.array(evidenceSchema).min(2).max(5)}).strict();
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
<a id="l52"></a>
<a id="l53"></a>
<a id="l54"></a>
<a id="l56"></a>
<a id="l57"></a>
<a id="l58"></a>
<a id="l59"></a>
<a id="l60"></a>

```text
  41 | export const referenceQaOutputSchema=qaOutputSchema.extend({referenceConflicts:z.array(referenceConflictSchema).max(10)}).strict();
  42 | export const requirementStatusSchema=z.enum(['supporting-evidence','potential-violation','insufficient-evidence','needs-clarification']);
  43 | export const requirementAssessmentSchema=z.object({requirementId:z.string().min(1).max(64),status:requirementStatusSchema,
  44 |   explanation:z.string().min(1).max(4000),relatedRequirementIds:z.array(z.string().min(1).max(64)).max(50),
  45 |   evidence:z.array(evidenceSchema).max(5)}).strict();
  46 | export type QaOutput = z.infer<typeof qaOutputSchema> & {referenceConflicts?:z.infer<typeof referenceConflictSchema>[];
  47 |   taskAssessments?:z.infer<typeof requirementAssessmentSchema>[]};
  48 | const verificationSchema=z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({
  49 |   path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(),
  50 | }))});
  51 | export const taskReviewSchema=z.object({taskHash:z.string(),state:z.enum(['not-assessed','assessed','partial','changed']),
  52 |   freshness:z.enum(['not-checked','unchanged','changed-or-unavailable']),
  53 |   assessments:z.array(requirementAssessmentSchema.extend({proposedStatus:requirementStatusSchema,
  54 |     evidenceVerification:verificationSchema.optional()})).max(50)});
  55 | 
  56 | export const contextPreviewSchema = z.object({
  57 |   files: z.array(z.object({path: z.string(), bytes: z.number().int(), lines: z.number().int(), sha256: z.string(),
  58 |     freshness:z.enum(['unchanged','changed-or-unavailable']).optional()})),
  59 |   skipped: z.array(z.object({path: z.string(), reason: z.string()})),
  60 |   serializedBytes: z.number().int().nonnegative(),
```

<a id="l61"></a>
<a id="l62"></a>
<a id="l63"></a>
<a id="l64"></a>
<a id="l65"></a>
<a id="l66"></a>
<a id="l67"></a>
<a id="l68"></a>
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
  61 |   limited: z.boolean(),
  62 |   task:z.object({id:z.string(),sha256:z.string(),bytes:z.number().int(),requirementIds:z.array(z.string())}).optional(),
  63 |   references:z.array(z.object({id:z.string(),path:z.string(),sha256:z.string().nullable(),
  64 |     status:z.string(),required:z.boolean(),freshness:z.enum(['unchanged','changed-or-unavailable']).optional()})).optional(),
  65 |   requestedPaths:z.array(z.string()).optional(),
  66 |   supportingPaths:z.array(z.string()).optional(),
  67 |   dependencies:z.array(z.object({from:z.string(),specifier:z.string(),path:z.string().nullable(),
  68 |     status:z.enum(['included','unresolved','omitted'])})).optional(),
  69 | });
  70 | export const aiResultSchema = z.object({
  71 |   execution: z.enum(['preview', 'mock', 'injected', 'live']),
  72 |   status: z.enum(['preview', 'completed', 'failed']),
  73 |   mode: modeSchema,
  74 |   reviewer: z.enum(['qa/reliability-v1','qa/reliability-v2']),
  75 |   model: z.string().nullable(),
  76 |   plannedModel: z.string().nullable(),
  77 |   preview: contextPreviewSchema,
  78 |   maxOutputTokens: z.number().int(),
  79 |   requestBytes: z.number().int().nonnegative(),
  80 |   estimatedInputTokens: z.number().int().nonnegative(),
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
  81 |   estimatedCostUsd: z.null(),
  82 |   actualCostUsd: z.number().nullable(),
  83 |   retries: z.literal(0),
  84 |   trial: z.object({countedInputTokens:z.number().int(), reservedUsd:z.number(), pricedUsageUpperBoundUsd:z.number(),
  85 |     usage:z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})}).optional(),
  86 |   budget:z.object({name:z.string(),countedInputTokens:z.number().int(),reservedUsd:z.number(),pricedUsageUpperBoundUsd:z.number(),
  87 |     usage:z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})}).optional(),
  88 |   candidates: z.array(candidateSchema.extend({
  89 |     id: z.string(), evidenceStatus: z.literal('unverified'), origin: z.literal('ai'),
  90 |     referenceConflict:z.boolean().optional(),
  91 |     evidenceVerification: z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({
  92 |       path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(),
  93 |     }))}).optional(),
  94 |   })).max(20),
  95 |   referenceConflicts:z.array(referenceConflictSchema.extend({id:z.string(),
  96 |     status:z.literal('needs-clarification'),evidenceVerification:verificationSchema})).max(10).optional(),
  97 |   error: z.object({code: z.string(), message: z.string()}).nullable(),
  98 |   taskReview:taskReviewSchema.optional(),
  99 |   coverage:z.object({state:z.enum(['preview','complete','partial','failed']),selectedPaths:z.array(z.string()),
 100 |     validResponsePaths:z.array(z.string()),failedResponsePaths:z.array(z.string()),
```

<a id="l101"></a>
<a id="l102"></a>
<a id="l104"></a>

```text
 101 |     skippedPaths:z.array(z.string()),matchedCandidates:z.number().int(),rejectedCandidates:z.number().int(),
 102 |     outOfScopeCandidates:z.number().int()}).optional(),
 103 | });
 104 | export type AiResult = z.infer<typeof aiResultSchema>;
 105 | 
```
