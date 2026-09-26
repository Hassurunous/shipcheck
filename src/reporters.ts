import { reportSchema, type Report } from "./findings.js";

// Keep repository-controlled text on one console line and escape terminal controls.
const text = (value: string): string => value
  .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, char => {
    if (char === "\n") return "\\n";
    if (char === "\r") return "\\r";
    if (char === "\t") return "\\t";
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
  });

export function renderConsoleReport(input: Report): string {
  const report = reportSchema.parse(input);
  const lines = ["Shipcheck — deterministic review", `Target: ${text(report.root)}`, "",
    `Findings: ${report.findings.length}`, `Inspection warnings: ${report.inspectionWarnings.length}`];
  for (const finding of report.findings) {
    lines.push("", `[${finding.severity.toUpperCase()}] ${text(finding.ruleId)} — ${text(finding.title)}`,
      `  ${text(finding.explanation)}`);
    for (const evidence of finding.evidence) {
      lines.push(`  Evidence: ${text(evidence.path)} — ${text(evidence.observation)}`);
    }
    lines.push(`  Suggested action: ${text(finding.suggestedAction)}`);
  }
  if (report.findings.length === 0) lines.push("", "No findings from the implemented rules.");
  if (report.inspectionWarnings.length > 0) {
    lines.push("", "Inspection warnings (some content was not analyzed):");
    for (const warning of report.inspectionWarnings) {
      lines.push(`  ${text(warning.path)} [${warning.code}]: ${text(warning.message)}`);
    }
  }
  lines.push("", "Scope: package JSON, top-level object, and scripts structure only. No scripts or tests were executed.");
  return lines.join("\n");
}

export function renderJsonReport(input: Report): string {
  return JSON.stringify(reportSchema.parse(input), null, 2);
}
