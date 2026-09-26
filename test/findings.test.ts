import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createReport, findingSchema, inspectRepository, renderConsoleReport,
  renderJsonReport, reportSchema, repositoryProfileSchema,
} from "../src/index.js";
import { inspectPackage } from "../src/inspect-package.js";

function profile() {
  return repositoryProfileSchema.parse({
    root: "/example", files: [], languages: {}, manifests: [], readmes: [],
    tests: [], packageScripts: [], markers: [], warnings: [],
  });
}

function reportFor(content: string) {
  const input = profile();
  const result = inspectPackage("package.json", content);
  if (result.issue) input.packageIssues.push(result.issue);
  return createReport(input);
}

describe("deterministic package rules", () => {
  it.each([
    ["{broken", "package/invalid-json"],
    ["[]", "package/invalid-object"],
    ["null", "package/invalid-object"],
    ['"text"', "package/invalid-object"],
    ['{"scripts":{"test":123}}', "package/invalid-scripts"],
    ['{"scripts":null}', "package/invalid-scripts"],
    ['{"scripts":[]}', "package/invalid-scripts"],
    ['{"scripts":"npm test"}', "package/invalid-scripts"],
  ])("reports %s as %s with file evidence", (content, ruleId) => {
    const report = reportFor(content);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]).toMatchObject({
      id: `${ruleId}:package.json`, ruleId, severity: "error",
      evidence: [{ path: "package.json", observation: expect.any(String) }],
      explanation: expect.any(String), suggestedAction: expect.any(String),
    });
    expect(report.findings[0]!.evidence[0]).not.toHaveProperty("line");
  });

  it.each(['{}', '{"scripts":{}}', '{"scripts":{"test":"vitest","empty":""}}',
    '{"name":"example","other":123}'])("does not flag valid manifests: %s", content => {
    expect(reportFor(content).findings).toEqual([]);
  });

  it("does not turn absent docs/tests, markers, or read failures into defects", () => {
    const input = profile();
    input.markers.push({ path: "a.ts", line: 1, kind: "TODO", excerpt: "// TODO" });
    input.warnings.push({ path: "package.json", code: "unreadable-file", message: "Could not read." });
    const report = createReport(input);
    expect(report.findings).toEqual([]);
    expect(report.inspectionWarnings).toEqual(input.warnings);
  });

  it("keeps legacy invalid-manifest warnings when detailed diagnostics are absent", () => {
    const input = profile();
    input.warnings.push({ path: "package.json", code: "invalid-manifest", message: "Invalid manifest." });
    expect(createReport(input)).toMatchObject({ findings: [], inspectionWarnings: input.warnings });
  });

  it("sorts findings and warnings without mutating input or depending on enumeration order", () => {
    const input = profile();
    for (const path of ["z/package.json", "a/package.json"]) {
      input.packageIssues.push(inspectPackage(path, "{").issue!);
      input.warnings.push({ path, code: "invalid-manifest", message: "Invalid manifest." });
      input.warnings.push({ path: path + ".bak", code: "unreadable-file", message: "Cannot read." });
    }
    const saved = structuredClone(input);
    const first = createReport(input);
    expect(input).toEqual(saved);
    input.packageIssues.reverse();
    input.warnings.reverse();
    expect(createReport(input)).toEqual(first);
    expect(first.findings.map(f => f.evidence[0]!.path)).toEqual(["a/package.json", "z/package.json"]);
    expect(first.inspectionWarnings).toHaveLength(2);
    expect(first.inspectionWarnings.every(w => w.code === "unreadable-file")).toBe(true);
  });
});

describe("report contracts and rendering", () => {
  it("rejects findings without evidence or a recognized severity", () => {
    const finding = reportFor("{").findings[0]!;
    expect(findingSchema.safeParse({ ...finding, evidence: [] }).success).toBe(false);
    expect(findingSchema.safeParse({ ...finding, severity: "critical" }).success).toBe(false);
    expect(findingSchema.safeParse({ ...finding, suggestedAction: "" }).success).toBe(false);
    expect(reportSchema.safeParse({ ...reportFor("{}"), schemaVersion: 2 }).success).toBe(false);
  });

  it("round trips findings and warnings through JSON without losing evidence", () => {
    const report = reportFor("{");
    report.inspectionWarnings.push({ path: "locked", code: "unreadable-directory", message: "Cannot enumerate." });
    expect(reportSchema.parse(JSON.parse(renderJsonReport(report)))).toEqual(report);
    expect(renderJsonReport(report)).toBe(renderJsonReport(report));
  });

  it("renders actionable findings and inspection limitations separately", () => {
    const report = reportFor('{"scripts":false}');
    report.inspectionWarnings.push({ path: "locked", code: "unreadable-directory", message: "Cannot enumerate." });
    const rendered = renderConsoleReport(report);
    expect(rendered).toContain("Findings: 1\nInspection warnings: 1");
    expect(rendered).toContain("[ERROR] package/invalid-scripts");
    expect(rendered).toContain("Evidence: package.json");
    expect(rendered).toContain("Suggested action: Use an object");
    expect(rendered).toContain("Inspection warnings (some content was not analyzed):");
    expect(rendered).toContain("locked [unreadable-directory]");
    expect(rendered).toContain("No scripts or tests were executed.");
  });

  it("limits the meaning of a zero-finding report", () => {
    const rendered = renderConsoleReport(reportFor("{}"));
    expect(rendered).toContain("No findings from the implemented rules.");
    expect(rendered).toContain("Scope: configured deterministic repository rules only.");
    expect(rendered).not.toContain("Inspection warnings (some content was not analyzed):");
  });

  it("preserves ordinary Windows paths in console output", () => {
    const report = reportFor("{}");
    report.root = "D:\\Projects\\shipcheck";
    expect(renderConsoleReport(report)).toContain(`Target: ${report.root}`);
  });

  it("escapes terminal controls and newlines in repository-controlled text", () => {
    const report = reportFor("{");
    report.root = "repo\n\u001b[31m";
    report.findings[0]!.evidence[0]!.path = "bad\nname\u009b.ts";
    const rendered = renderConsoleReport(report);
    expect(rendered).toContain("Target: repo\\n\\u001b[31m");
    expect(rendered).toContain("bad\\nname\\u009b.ts");
    expect(rendered).not.toContain("\u001b");
    expect(rendered).not.toContain("\u009b");
  });
});

it("connects real inspection to rules and both renderers without executing scripts", async () => {
  const root = await fs.mkdtemp(join(tmpdir(), "shipcheck-findings-"));
  try {
    await fs.writeFile(join(root, "package.json"), '{"scripts":{"test":42}}');
    await fs.mkdir(join(root, "valid"));
    await fs.writeFile(join(root, "valid/package.json"), JSON.stringify({
      scripts: { test: "this-command-must-never-run" },
    }));
    const inspected = await inspectRepository(root);
    expect(inspected.packageIssues).toHaveLength(1);
    const report = createReport(inspected);
    expect(report.findings.map(f => f.ruleId)).toEqual(["package/invalid-scripts"]);
    expect(report.findings[0]!.evidence[0]!.path).toBe("package.json");
    expect(report.inspectionWarnings).toEqual([]);
    expect(JSON.parse(renderJsonReport(report))).toEqual(report);
    expect(renderConsoleReport(report)).toContain("Findings: 1");
    expect(await fs.readFile(join(root, "package.json"), "utf8")).toBe('{"scripts":{"test":42}}');
  } finally {
    // Only remove this test's directory returned directly by mkdtemp().
    await fs.rm(root, { recursive: true, force: true });
  }
});
