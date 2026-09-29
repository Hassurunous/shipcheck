/** Format the bootstrap status without inspecting or modifying the target. */
export function formatStatus(args: readonly string[] = []): string {
  const target = args[0] ?? ".";
  return `Shipcheck v0.1\n\nTarget: ${target}\nStatus: ready`;
}
export { inspectRepository, MAX_FILE_BYTES } from "./inspect-repository.js";
export { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
export { createReport, findingSchema, reportSchema, type Finding, type Report } from "./findings.js";
export { renderConsoleReport, renderJsonReport } from "./reporters.js";
export { renderMarkdownReport } from './markdown-report.js';
export { configSchema, loadConfig, ruleDefaults, type Config, type ConfigInput, type RuleId } from "./config.js";
export { reviewRepository } from "./review-repository.js";
export { runWorkflow, changedPaths } from './workflows.js';
export { type WorkflowOptions } from './workflows.js';
export { reviewWholeRepository } from './ai/whole-repository.js';
export { initializeBudget, budgetStatus, settleBudgetAttempt } from './ai/audit-budget.js';
export { checkSchema, checkResultSchema, type CheckResult } from './checks.js';
export { loadReferenceResources, verifyResourceEvidence, type ResourceSnapshot } from './reference-resources.js';
export { resourceDefinitionSchema, resourceEvidenceSchema, referencesSchema } from './resource-contracts.js';
export { indexOpenApi, openApiIndexSchema, type OpenApiIndex } from './openapi-contract.js';
export {auditContracts} from './contract-audit.js';
export {contractAdapters,contractAdapterFor} from './contract-adapters.js';
export type {ContractAdapter,CallObservation,CallExtraction} from './contract-adapter-types.js';
export {contractBindingSchema,contractResultSchema,type ContractResult,type ContractBinding} from './contract-contracts.js';
export { intentPolicySchema, dependencyObservationSchema, assessIntentPolicy } from './intent-policy.js';
export { taskSchema, loadTask } from './task-file.js';
export { currentTaskSchema, describeCurrentTask, type CurrentTask } from './task-file.js';
export { reviewWithAi, type AiReviewOptions } from "./ai/review.js";
export { aiSettingsSchema, modeSchema, qaOutputSchema, type AiMode, type AiResult } from "./ai/contracts.js";

export {auditArchitecture} from './architecture-audit.js';
export {architectureSchema,architectureResultSchema} from './architecture-contracts.js';
export {auditSdkContracts} from './sdk-audit.js';
export {sdkBindingSchema,sdkResultSchema,type SdkResult} from './sdk-contracts.js';
export {referenceAccessSchema,type ReferenceAccess} from './reference-access.js';
