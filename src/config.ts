import { readBoundedConfig, validateRoot } from "./filesystem-policy.js";
import { join } from "node:path";
import { z } from "zod";
import { aiSettingsSchema } from "./ai/contracts.js";

export const ruleDefaults = {
  "package/invalid-json": "error",
  "package/invalid-object": "error",
  "package/invalid-scripts": "error",
  "package/conflicting-lockfiles": "warning",
  "package/missing-local-dependency": "error",
  "package/missing-script-target": "warning",
  "package/missing-entry-point": "off",
  "repository/missing-readme": "off",
  "repository/missing-tests": "off",
  "source/fixme": "off",
} as const;
export type RuleId = keyof typeof ruleDefaults;
const levels = z.enum(["off", "error", "warning", "info"]);
const rulesSchema = z.record(z.string(), levels).superRefine((rules, ctx) => {
  for (const key of Object.keys(rules)) {
    if (!Object.hasOwn(ruleDefaults, key)) ctx.addIssue({ code: "custom", path: [key], message: `Unknown rule: ${key}` });
  }
});
const pattern = z.string().min(1).refine(value =>
  !value.startsWith("/") && !/[\\:?![\]{}]/.test(value)
  && value.split("/").every(part => part !== ".." && part !== "." && part !== "")
  && value.split("/").every(part => !part.includes("**") || part === "**"),
"Use relative slash-separated patterns with * or whole-segment ** only.");
export const configSchema = z.object({
  version: z.literal(1).default(1),
  exclude: z.array(pattern).default([]),
  rules: rulesSchema.default({}),
  ai: aiSettingsSchema.prefault({}),
  overrides: z.array(z.object({
    files: z.array(pattern).min(1), rules: rulesSchema,
    reason: z.string().min(1),
  }).strict()).default([]),
}).strict();
export type Config = z.infer<typeof configSchema>;
export type ConfigInput = z.input<typeof configSchema>;

/** Small documented glob subset; ** matches zero or more complete segments. */
export function matchesPattern(path: string, pattern: string): boolean {
  const parts = pattern.split("/");
  const expression = parts.map((part, index) => {
    if (part === "**") return index === parts.length - 1 ? ".*" : "(?:[^/]+/)*";
    const escaped = part.replace(/[.+^$()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
    return escaped + (index < parts.length - 1 ? "/" : "");
  }).join("");
  return new RegExp(`^${expression}$`).test(path)
    || (pattern.endsWith("/**") && path === pattern.slice(0, -3));
}

export function isExcluded(path: string, patterns: readonly string[]): boolean {
  const parts = path.split("/");
  return patterns.some(pattern => parts.some((_, index) => matchesPattern(parts.slice(0, index + 1).join("/"), pattern)));
}

export function ruleLevel(config: Config, rule: RuleId, path: string) {
  let level: z.infer<typeof levels> = config.rules[rule] ?? ruleDefaults[rule];
  for (const override of config.overrides) {
    if (override.files.some(pattern => matchesPattern(path, pattern))) level = override.rules[rule] ?? level;
  }
  return level;
}

export async function loadConfig(root: string): Promise<Config> {
  const validatedRoot = await validateRoot(root);
  const content = await readBoundedConfig(join(validatedRoot, "shipcheck.config.json"));
  if (content === undefined) return configSchema.parse({});
  try { return configSchema.parse(JSON.parse(content)); }
  catch (error) { throw new Error(`Invalid shipcheck.config.json: ${String(error)}`); }
}
