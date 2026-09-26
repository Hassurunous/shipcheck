import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { configSchema, createReport, inspectRepository, reviewRepository, type ConfigInput } from "../src/index.js";
import { isExcluded, matchesPattern } from "../src/config.js";

let root: string;
beforeEach(async () => { root = await fs.mkdtemp(join(tmpdir(), "shipcheck-rules-")); });
afterEach(async () => { await fs.rm(root, { recursive: true, force: true }); });
async function write(path: string, value = "") {
  await fs.mkdir(dirname(join(root, path)), { recursive: true });
  await fs.writeFile(join(root, path), value);
}
async function manifest(data: object, path = "package.json") { await write(path, JSON.stringify(data)); }
const ids = async (options?: ConfigInput) => (await reviewRepository(root, options)).findings.map(f => f.ruleId);

describe("configuration", () => {
  it("rejects typos, invalid severities, unknown fields and unsafe/unsupported patterns", () => {
    for (const config of [
      { rules: { "package/typo": "error" } }, { rules: { "package/invalid-json": "fatal" } },
      { rules: {}, typo: true }, { exclude: ["../secret"] }, { exclude: ["/absolute"] },
      { exclude: ["a?b"] }, { exclude: ["src/**.ts"] },
      { overrides: [{ files: ["**"], rules: {} }] },
    ]) expect(configSchema.safeParse(config).success).toBe(false);
  });

  it("matches the documented glob subset including root-level ** matches", () => {
    expect(matchesPattern("package.json", "**/package.json")).toBe(true);
    expect(matchesPattern("a/b/package.json", "**/package.json")).toBe(true);
    expect(matchesPattern("src/a.ts", "src/*.ts")).toBe(true);
    expect(matchesPattern("src/nested/a.ts", "src/*.ts")).toBe(false);
    expect(isExcluded("dist/src/index.js", ["dist/**"])).toBe(true);
    expect(isExcluded("nested/dist/index.js", ["dist/**"])).toBe(false);
    expect(isExcluded("nested/dist/index.js", ["**/dist/**"])).toBe(true);
    expect(matchesPattern("aXts", "a.ts")).toBe(false);
  });

  it("loads config and applies ordered path overrides", async () => {
    await write("fixtures/package.json", "{");
    await write("package.json", "{");
    await write("shipcheck.config.json", JSON.stringify({
      version: 1, rules: { "package/invalid-json": "warning" },
      overrides: [
        { files: ["fixtures/**"], rules: { "package/invalid-json": "info" }, reason: "Fixture" },
        { files: ["fixtures/**"], rules: { "package/invalid-json": "off" }, reason: "Intentional invalid JSON" },
      ],
    }));
    const report = await reviewRepository(root);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]).toMatchObject({ severity: "warning", evidence: [{ path: "package.json" }] });
  });

  it("fails on malformed configuration instead of silently using defaults", async () => {
    await write("shipcheck.config.json", "{broken");
    await expect(reviewRepository(root)).rejects.toThrow("Invalid shipcheck.config.json");
    expect(await ids({})).toEqual([]); // Explicit configuration replaces disk configuration.
  });

  it("excludes files before inspection and preserves warnings when disabling rules", async () => {
    await write("dist/package.json", "{");
    await write("binary.bin", "\0");
    const profile = await inspectRepository(root, { exclude: ["dist/**"] });
    expect(profile.files.map(f => f.path)).toEqual(["binary.bin"]);
    const report = createReport(profile, { rules: { "package/invalid-json": "off" } });
    expect(report.findings).toEqual([]);
    expect(report.inspectionWarnings[0]!.code).toBe("non-text-file");
  });
});

describe("additional rules", () => {
  it("reports competing managers in the same package, not nested or same-manager lockfiles", async () => {
    await manifest({});
    await write("package-lock.json");
    await write("npm-shrinkwrap.json");
    await write("nested/yarn.lock");
    expect(await ids()).toEqual([]);
    await write("yarn.lock");
    const report = await reviewRepository(root);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]!.ruleId).toBe("package/conflicting-lockfiles");
    expect(report.findings[0]!.evidence.map(e => e.path)).toContain("yarn.lock");
  });

  it("detects missing local dependencies, including nested relative references", async () => {
    await manifest({ dependencies: { present: "file:./local", missing: "file:./missing", external: "file:../outside", workspace: "workspace:*" } });
    await fs.mkdir(join(root, "local"));
    await manifest({ devDependencies: { missing: "file:../../absent" } }, "packages/child/package.json");
    const report = await reviewRepository(root);
    expect(report.findings).toHaveLength(2);
    expect(report.findings.every(f => f.ruleId === "package/missing-local-dependency" && f.severity === "error")).toBe(true);
    expect(report.findings.some(f => f.explanation.includes("at absent"))).toBe(true);
  });

  it("does not call excluded or linked dependency targets missing", async () => {
    await manifest({ dependencies: { generated: "file:dist/pkg", linked: "file:linked/missing", deps: "file:node_modules/a" } });
    await fs.mkdir(join(root, "actual"));
    await fs.symlink(join(root, "actual"), join(root, "linked"), "junction");
    const report = await reviewRepository(root, { exclude: ["dist/**"] });
    expect(report.findings).toEqual([]);
    expect(report.inspectionWarnings[0]!.code).toBe("symlink-skipped");
  });

  it("does not infer missing paths below an unreadable directory", async () => {
    await manifest({ dependencies: { hidden: "file:locked/pkg" } });
    const profile = await inspectRepository(root);
    profile.warnings.push({ path: "locked", code: "unreadable-directory", message: "Cannot read." });
    expect(createReport(profile).findings).toEqual([]);
  });

  it("checks only simple literal node/tsx script targets", async () => {
    await manifest({ scripts: {
      missing: "node scripts/missing.js", okay: "tsx src/ok.ts",
      pipeline: "node build.js && node app.js", flags: "node --loader tsx app.ts",
      quoted: 'node "path with spaces.js"', arguments: "node app.js --help", other: "vitest run",
    } });
    await write("src/ok.ts");
    expect(await ids()).toEqual(["package/missing-script-target"]);
  });

  it("keeps entry points opt-in and ignores extensionless main resolution", async () => {
    await manifest({ main: "dist/index.js", types: "index.d.ts", module: "extensionless", bin: { tool: "bin/tool" } });
    expect(await ids()).toEqual([]);
    const options: ConfigInput = { rules: { "package/missing-entry-point": "warning" } };
    expect(await ids(options)).toHaveLength(3);
    await write("dist/index.js"); await write("index.d.ts"); await write("bin/tool");
    expect(await ids(options)).toEqual([]);
  });

  it("keeps missing README/test policies opt-in and uses detected conventions", async () => {
    const options: ConfigInput = { rules: { "repository/missing-readme": "info", "repository/missing-tests": "info" } };
    expect(await ids()).toEqual([]);
    expect(await ids(options)).toEqual(["repository/missing-readme", "repository/missing-tests"]);
    await write("docs/README.md"); await write("test/app.test.ts");
    expect(await ids(options)).toEqual([]);
  });

  it("reports only the configured source FIXME convention with line evidence", async () => {
    await write("src/app.ts", '// FIXME: repair this\nconst message = "FIXME";\n// TODO: later');
    await write("test/app.test.ts", "// FIXME: fixture");
    await write("src/app.test.ts", "// FIXME: fixture");
    await write("README.md", "FIXME");
    expect(await ids()).toEqual([]);
    const report = await reviewRepository(root, { rules: { "source/fixme": "warning" } });
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]!.evidence[0]).toMatchObject({ path: "src/app.ts", line: 1, excerpt: "// FIXME: repair this" });
  });
});
