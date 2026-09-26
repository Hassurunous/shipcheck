import { resolve } from "node:path";
import { configSchema, loadConfig, type ConfigInput } from "./config.js";
import { inspectRepository } from "./inspect-repository.js";
import { createReport } from "./findings.js";

/** Load root configuration, inspect locally, and evaluate the enabled rules. */
export async function reviewRepository(target = ".", options?: ConfigInput) {
  const config = options === undefined ? await loadConfig(resolve(target)) : configSchema.parse(options);
  return createReport(await inspectRepository(target, { exclude: config.exclude }), config);
}
