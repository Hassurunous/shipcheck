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
export { taskSchema, loadTask } from './task-file.js';
export { reviewWithAi, type AiReviewOptions } from "./ai/review.js";
export { aiSettingsSchema, modeSchema, qaOutputSchema, type AiMode, type AiResult } from "./ai/contracts.js";
