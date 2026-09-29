import {architectureResultSchema} from './architecture-contracts.js';
import { z } from "zod";
import { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";
import { configSchema, isExcluded, ruleLevel, type ConfigInput, type RuleId } from "./config.js";
import { additionalFindings } from "./additional-rules.js";
import { aiResultSchema } from "./ai/contracts.js";
import { checkResultSchema } from './checks.js';
import { referencesSchema } from './resource-contracts.js';
import { currentTaskReportSchema } from './task-file.js';
import {contractResultSchema} from './contract-contracts.js';

export const findingSchema = z.object({
  id: z.string().min(1),
  ruleId: z.string().min(1),
  severity: z.enum(["error", "warning", "info"]),
  title: z.string().min(1),
  explanation: z.string().min(1),
  evidence: z.array(z.object({
    path: z.string().min(1),
    observation: z.string().min(1),
    line: z.number().int().positive().optional(),
    excerpt: z.string().optional(),
  })).min(1),
  suggestedAction: z.string().min(1),
});
export type Finding = z.infer<typeof findingSchema>;

export const reportSchema = z.object({
  schemaVersion: z.literal(1),
  root: z.string().min(1),
  findings: z.array(findingSchema),
  inspectionWarnings: repositoryProfileSchema.shape.warnings,
  ai: aiResultSchema.optional(),
  checks:z.array(checkResultSchema).optional(),
  references:referencesSchema.optional(),
  contracts:z.array(contractResultSchema).optional(),
  architecture:architectureResultSchema.optional(),
  currentTask:currentTaskReportSchema.optional(),
  aiAudit:z.object({scope:z.literal('whole-repository'),batches:z.array(aiResultSchema),
    budgetName:z.string().optional(),stoppedReason:z.string().optional(),
    selectedPaths:z.array(z.string()),validResponsePaths:z.array(z.string()),
    skipped:z.array(z.object({path:z.string(),reason:z.string()})),
    state:z.enum(['preview','partial','complete','failed'])}).optional(),
  workflow: z.object({kind:z.enum(['audit','diff','task']),scope:z.array(z.string()).nullable(),baseline:z.string().nullable(),
    unavailablePaths:z.array(z.string()),
    criteria:z.array(z.string()).optional()}).optional(),
});
export type Report = z.infer<typeof reportSchema>;

const rules = {
  "invalid-json": {
    ruleId: "package/invalid-json",
    title: "Package manifest is not valid JSON",
    explanation: "Tools that consume package.json cannot parse this manifest as JSON.",
    suggestedAction: "Correct the JSON syntax in this package.json file.",
  },
  "invalid-package": {
    ruleId: "package/invalid-object",
    title: "Package manifest is not an object",
    explanation: "A package manifest must contain a JSON object; an array, primitive, or null cannot describe its fields.",
    suggestedAction: "Replace the top-level value with a JSON object containing the intended package fields.",
  },
  "invalid-scripts": {
    ruleId: "package/invalid-scripts",
    title: "Package scripts have an invalid structure",
    explanation: "The scripts field must map script names to command strings when present.",
    suggestedAction: "Use an object with string command values, or omit scripts if none are needed.",
  },
} satisfies Record<RepositoryProfile["packageIssues"][number]["code"],
  Pick<Finding, "ruleId" | "title" | "explanation" | "suggestedAction">>;

/** Evaluate captured facts only. Does not read files or execute repository code. */
export function createReport(input: RepositoryProfile, options: ConfigInput = {}): Report {
  const config = configSchema.parse(options);
  const profile = repositoryProfileSchema.parse(input);
  const candidates = profile.packageIssues.map(issue => {
    const rule = rules[issue.code];
    return findingSchema.parse({
      ...rule,
      id: `${rule.ruleId}:${encodeURIComponent(issue.path)}`,
      severity: "error",
      evidence: [{ path: issue.path, observation: issue.observation }],
    });
  }).concat(additionalFindings(profile, config));
  const findings = candidates.flatMap(finding => {
    const path = finding.evidence[0]!.path;
    if (isExcluded(path, [...profile.excluded, ...config.exclude])) return [];
    const severity = ruleLevel(config, finding.ruleId as RuleId, path);
    return severity === "off" ? [] : [{ ...finding, severity }];
  }).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const diagnosedPaths = new Set(profile.packageIssues.map(issue => issue.path));
  const inspectionWarnings = profile.warnings.filter(warning =>
    warning.code !== "invalid-manifest" || !diagnosedPaths.has(warning.path))
    .sort((a, b) => {
      const left = JSON.stringify([a.path, a.code, a.message]);
      const right = JSON.stringify([b.path, b.code, b.message]);
      return left < right ? -1 : left > right ? 1 : 0;
    });
  return reportSchema.parse({ schemaVersion: 1, root: profile.root, findings, inspectionWarnings });
}
