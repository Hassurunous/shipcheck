/** Format the bootstrap status without inspecting or modifying the target. */
export function formatStatus(args: readonly string[] = []): string {
  const target = args[0] ?? ".";
  return `Shipcheck v0.1\n\nTarget: ${target}\nStatus: ready`;
}
export { inspectRepository, MAX_FILE_BYTES } from "./inspect-repository.js";
export { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
export { createReport, findingSchema, reportSchema, type Finding, type Report } from "./findings.js";
export { renderConsoleReport, renderJsonReport } from "./reporters.js";
