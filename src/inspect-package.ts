import { z } from "zod";
import type { RepositoryProfile } from "./repository-profile.js";

const packageSchema = z.object({ scripts: z.record(z.string(), z.string()).optional() });
type PackageIssue = RepositoryProfile["packageIssues"][number];
type PackageInspection = { scripts: Record<string, string>; issue?: never }
  | { issue: PackageIssue; scripts?: never };

/** Validate only JSON, the top-level object, and scripts; not the full npm manifest. */
export function inspectPackage(path: string, content: string): PackageInspection {
  let value: unknown;
  try {
    value = JSON.parse(content);
  } catch {
    return { issue: { path, code: "invalid-json", observation: "package.json could not be parsed as JSON." } };
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { issue: { path, code: "invalid-package", observation: "package.json contains a top-level value that is not an object." } };
  }
  const parsed = packageSchema.safeParse(value);
  if (!parsed.success) {
    return { issue: { path, code: "invalid-scripts", observation: "The scripts field is not an object containing only string values." } };
  }
  const scripts = Object.fromEntries(Object.entries(parsed.data.scripts ?? {})
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  return { scripts };
}
