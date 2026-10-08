# src/index.ts

[Technical manual](../TECHNICAL_MANUAL.md) · [Module index](README.md)

The package facade re-exports the supported library entry points and types without adding orchestration. formatStatus is the historical readiness message, not an inspection. Importing runWorkflow gives the caller the integrated pipeline; importing createReport only gives pure rule evaluation of supplied facts.

Snapshot: 2026-10-02 working tree. SHA-256 of exact source bytes: `dcae06b95108bd00405c96cff892c7233942d29463f914dc12d29d75512b8f5f`.

This chapter inventories **1 function bodies/callbacks**, **1 variable declarations**, and **0 type declarations**. Coordinates are one-based original source line:column. Function traces describe syntax and control flow; the manual explains why the operations serve the product. Ellipses only shorten inline displays; the full source listing below is unabridged.

## Imports and collaborators


## Module execution

- [L6](#l6) Re-export the listed bindings; no wrapper function is introduced.
- [L7](#l7) Re-export the listed bindings; no wrapper function is introduced.
- [L8](#l8) Re-export the listed bindings; no wrapper function is introduced.
- [L9](#l9) Re-export the listed bindings; no wrapper function is introduced.
- [L10](#l10) Re-export the listed bindings; no wrapper function is introduced.
- [L11](#l11) Re-export the listed bindings; no wrapper function is introduced.
- [L12](#l12) Re-export the listed bindings; no wrapper function is introduced.
- [L13](#l13) Re-export the listed bindings; no wrapper function is introduced.
- [L14](#l14) Re-export the listed bindings; no wrapper function is introduced.
- [L15](#l15) Re-export the listed bindings; no wrapper function is introduced.
- [L16](#l16) Re-export the listed bindings; no wrapper function is introduced.
- [L17](#l17) Re-export the listed bindings; no wrapper function is introduced.
- [L18](#l18) Re-export the listed bindings; no wrapper function is introduced.
- [L19](#l19) Re-export the listed bindings; no wrapper function is introduced.
- [L20](#l20) Re-export the listed bindings; no wrapper function is introduced.
- [L21](#l21) Re-export the listed bindings; no wrapper function is introduced.
- [L22](#l22) Re-export the listed bindings; no wrapper function is introduced.
- [L23](#l23) Re-export the listed bindings; no wrapper function is introduced.
- [L24](#l24) Re-export the listed bindings; no wrapper function is introduced.
- [L25](#l25) Re-export the listed bindings; no wrapper function is introduced.
- [L26](#l26) Re-export the listed bindings; no wrapper function is introduced.
- [L27](#l27) Re-export the listed bindings; no wrapper function is introduced.
- [L28](#l28) Re-export the listed bindings; no wrapper function is introduced.
- [L29](#l29) Re-export the listed bindings; no wrapper function is introduced.
- [L31](#l31) Re-export the listed bindings; no wrapper function is introduced.
- [L32](#l32) Re-export the listed bindings; no wrapper function is introduced.
- [L33](#l33) Re-export the listed bindings; no wrapper function is introduced.
- [L34](#l34) Re-export the listed bindings; no wrapper function is introduced.
- [L35](#l35) Re-export the listed bindings; no wrapper function is introduced.
- [L37](#l37) Re-export the listed bindings; no wrapper function is introduced.
- [L38](#l38) Re-export the listed bindings; no wrapper function is introduced.

## Function index

- [formatStatus (2:8)](#fn-87)

<a id="fn-87"></a>
### formatStatus (2:8)

Synchronous function. Defined in module scope. 

Parameters:

- <code>args: readonly string[] = []</code>: when omitted/undefined, initialize with <code>[]</code>.

Local bindings (nested callback locals are documented with that callback):

- [L3](#l3) <code>target</code>: use <code>args[0]</code> unless null/undefined, then evaluate <code>"."</code>.

Execution:

- [L3](#l3) Bind <code>target</code>: use <code>args[0]</code> unless null/undefined, then evaluate <code>"."</code>.
- [L4](#l4) Return to the caller: use the literal <code>&#96;Shipcheck v0.1\n\nTarget: ${target}\nStatus: ready&#96;</code>.

## Directly importing tests

- [ai.test.ts](../../test/ai.test.ts)
- [audit-reliability.test.ts](../../test/audit-reliability.test.ts)
- [boundaries.test.ts](../../test/boundaries.test.ts)
- [check-diagnostics.test.ts](../../test/check-diagnostics.test.ts)
- [cli.test.ts](../../test/cli.test.ts)
- [findings.test.ts](../../test/findings.test.ts)
- [p7.test.ts](../../test/p7.test.ts)
- [repository.test.ts](../../test/repository.test.ts)
- [rules-config.test.ts](../../test/rules-config.test.ts)

## Exact source listing

The numbered lines preserve the source text (apart from the display-only line prefix and normalized display newlines). Use this listing to expand any abbreviated expression in the explanations.

Source links land at the containing 20-line block. All blocks together reproduce the entire module.

<a id="l1"></a>
<a id="l2"></a>
<a id="l3"></a>
<a id="l4"></a>
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
   1 | /** Format the bootstrap status without inspecting or modifying the target. */
   2 | export function formatStatus(args: readonly string[] = []): string {
   3 |   const target = args[0] ?? ".";
   4 |   return `Shipcheck v0.1\n\nTarget: ${target}\nStatus: ready`;
   5 | }
   6 | export { inspectRepository, MAX_FILE_BYTES } from "./inspect-repository.js";
   7 | export { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
   8 | export { createReport, findingSchema, reportSchema, type Finding, type Report } from "./findings.js";
   9 | export { renderConsoleReport, renderJsonReport } from "./reporters.js";
  10 | export { renderMarkdownReport } from './markdown-report.js';
  11 | export { configSchema, loadConfig, ruleDefaults, type Config, type ConfigInput, type RuleId } from "./config.js";
  12 | export { reviewRepository } from "./review-repository.js";
  13 | export { runWorkflow, changedPaths } from './workflows.js';
  14 | export { type WorkflowOptions } from './workflows.js';
  15 | export { reviewWholeRepository } from './ai/whole-repository.js';
  16 | export { initializeBudget, budgetStatus, settleBudgetAttempt } from './ai/audit-budget.js';
  17 | export { checkSchema, checkResultSchema, type CheckResult } from './checks.js';
  18 | export { loadReferenceResources, verifyResourceEvidence, type ResourceSnapshot } from './reference-resources.js';
  19 | export { resourceDefinitionSchema, resourceEvidenceSchema, referencesSchema } from './resource-contracts.js';
  20 | export { indexOpenApi, openApiIndexSchema, type OpenApiIndex } from './openapi-contract.js';
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
<a id="l31"></a>
<a id="l32"></a>
<a id="l33"></a>
<a id="l34"></a>
<a id="l35"></a>
<a id="l37"></a>
<a id="l38"></a>

```text
  21 | export {auditContracts} from './contract-audit.js';
  22 | export {contractAdapters,contractAdapterFor} from './contract-adapters.js';
  23 | export type {ContractAdapter,CallObservation,CallExtraction} from './contract-adapter-types.js';
  24 | export {contractBindingSchema,contractResultSchema,type ContractResult,type ContractBinding} from './contract-contracts.js';
  25 | export { intentPolicySchema, dependencyObservationSchema, assessIntentPolicy } from './intent-policy.js';
  26 | export { taskSchema, loadTask } from './task-file.js';
  27 | export { currentTaskSchema, describeCurrentTask, type CurrentTask } from './task-file.js';
  28 | export { reviewWithAi, type AiReviewOptions } from "./ai/review.js";
  29 | export { aiSettingsSchema, modeSchema, qaOutputSchema, type AiMode, type AiResult } from "./ai/contracts.js";
  30 | 
  31 | export {auditArchitecture} from './architecture-audit.js';
  32 | export {architectureSchema,architectureResultSchema} from './architecture-contracts.js';
  33 | export {auditSdkContracts} from './sdk-audit.js';
  34 | export {sdkBindingSchema,sdkResultSchema,type SdkResult} from './sdk-contracts.js';
  35 | export {referenceAccessSchema,type ReferenceAccess} from './reference-access.js';
  36 | 
  37 | export {ignorePolicySchema,type IgnorePolicyReport} from './ignore-contracts.js';
  38 | export type {IgnoreOptions} from './ignore-policy.js';
  39 | 
```
