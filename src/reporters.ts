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
  if (report.workflow) {
    lines.push(`Workflow: ${report.workflow.kind}; scope: ${report.workflow.scope===null?'whole repository':`${report.workflow.scope.length} selected paths`}`);
    if (report.workflow.baseline) lines.push(`Git baseline: ${text(report.workflow.baseline)}; current file contents reviewed, not historical patches.`);
    if (report.workflow.kind==='diff' && report.workflow.scope?.length===0) lines.push('No changed paths. Repository inspection and AI were skipped.');
    for (const path of report.workflow.scope ?? []) lines.push(`  Selected: ${text(path)}`);
    for (const path of report.workflow.unavailablePaths) lines.push(`  Content unavailable (deleted, linked, or non-regular): ${text(path)}`);
    for (const criterion of report.workflow.criteria ?? []) lines.push(`Acceptance criterion (human confirmation required): ${text(criterion)}`);
  }
  for (const finding of report.findings) {
    lines.push("", `[${finding.severity.toUpperCase()}] ${text(finding.ruleId)} — ${text(finding.title)}`,
      `  ${text(finding.explanation)}`);
    for (const evidence of finding.evidence) {
      lines.push(`  Evidence: ${text(evidence.path)}${evidence.line ? `:${evidence.line}` : ""} — ${text(evidence.observation)}`);
      if (evidence.excerpt !== undefined) lines.push(`    ${text(evidence.excerpt)}`);
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
  lines.push("", "Scope: configured deterministic repository rules only. No scripts or tests were executed.");
  if (report.ai) {
    const ai = report.ai;
    if(ai.coverage) {
      const coverage=ai.coverage;
      lines.push('',`AI coverage: ${coverage.state.toUpperCase()} — ${coverage.validResponsePaths.length} files with a valid response; ${coverage.failedResponsePaths.length} without a valid response; ${coverage.skippedPaths.length} skipped`,
        `Citation candidates: ${coverage.matchedCandidates} matched, ${coverage.rejectedCandidates} rejected; ${coverage.outOfScopeCandidates} outside requested scope`,
        'Coverage describes supplied context, not proof that every defect was found.');
      if(coverage.state!=='complete') lines.push('This is not a clean whole-repository AI result.');
    }
    lines.push('', `AI stage: ${ai.execution.toUpperCase()} / ${ai.status} — ${ai.mode}`,
      `Reviewer: ${ai.reviewer}; model: ${text(ai.model ?? 'not selected')}`,
      `Planned real model: ${text(ai.plannedModel ?? 'not selected; budget discussion pending')}`,
      `Selected source files: ${ai.preview.files.length}; skipped: ${ai.preview.skipped.length}; limited: ${ai.preview.limited}`);
    for (const file of ai.preview.files) lines.push(`  ${text(file.path)} (${file.bytes} bytes, ${file.lines} lines)`);
    for (const skipped of ai.preview.skipped) lines.push(`  Skipped: ${text(skipped.path)} — ${text(skipped.reason)}`);
    for (const path of ai.preview.supportingPaths ?? []) lines.push(`  Supporting context: ${text(path)}`);
    for (const dependency of ai.preview.dependencies ?? []) if(dependency.status!=='included')
      lines.push(`  Missing dependency context: ${text(dependency.from)} -> ${text(dependency.specifier)} (${dependency.status})`);
    lines.push(`Request size: ${ai.requestBytes} bytes; approximate input tokens: ${ai.estimatedInputTokens} (heuristic)`,
      `Output limit: ${ai.maxOutputTokens} tokens; retries: 0`,
      ai.execution === 'live' ? 'Live trial: $0.50 allowance; one attempt per mode; no retries. See shipcheck trial status.'
        : 'Live cost estimate: unavailable in offline mode.');
    if (ai.execution === 'preview' || ai.execution === 'mock') lines.push('Offline only: no model ran, no network request, $0 API spend.');
    if (ai.trial) lines.push(`Counted input: ${ai.trial.countedInputTokens}; usage: ${ai.trial.usage.input_tokens} input / ${ai.trial.usage.output_tokens} output tokens`,
      `Reserved: $${ai.trial.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.trial.pricedUsageUpperBoundUsd.toFixed(6)} (not an invoice).`);
    if (ai.error) lines.push(`AI failure [${text(ai.error.code)}]: ${text(ai.error.message)}`);
    if (ai.status === 'preview') lines.push('Preview only: no QA review was performed.');
    if (ai.status === 'completed') lines.push(`AI candidates: ${ai.candidates.length} — UNVERIFIED${ai.execution === 'mock' ? ' / SYNTHETIC MOCK' : ''}`);
    for (const candidate of ai.candidates) {
      lines.push(`  [${candidate.severity.toUpperCase()}] ${text(candidate.title)}`, `    ${text(candidate.explanation)}`);
      if (candidate.evidenceVerification) {
        lines.push(`    Citation check: ${candidate.evidenceVerification.status.toUpperCase()} (diagnosis remains unverified)`);
        for (const check of candidate.evidenceVerification.checks) if (check.status === 'rejected')
          lines.push(`    Rejected evidence: ${text(check.path)} — ${text(check.reason)}`);
      }
      for (const evidence of candidate.evidence) lines.push(`    ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
      lines.push(`    Suggested action: ${text(candidate.suggestedAction)}`);
    }
  }
  return lines.join("\n");
}

export function renderJsonReport(input: Report): string {
  return JSON.stringify(reportSchema.parse(input), null, 2);
}
