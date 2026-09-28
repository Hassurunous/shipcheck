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
    // Findings remain separate from task-criterion assessments.
    lines.push("", `[${finding.severity.toUpperCase()}] ${text(finding.ruleId)} — ${text(finding.title)}`,
      `  ${text(finding.explanation)}`);
    for (const evidence of finding.evidence) {
      lines.push(`  Evidence: ${text(evidence.path)}${evidence.line ? `:${evidence.line}` : ""} — ${text(evidence.observation)}`);
      if (evidence.excerpt !== undefined) lines.push(`    ${text(evidence.excerpt)}`);
    }
    lines.push(`  Suggested action: ${text(finding.suggestedAction)}`);
  }
  if (report.findings.length === 0) lines.push("", "No findings from the implemented rules.");
  if(report.currentTask) {
    const task=report.currentTask;
    lines.push('',`Current task: ${text(task.id)} — ${text(task.title)}`,`Task SHA256 (normalized content): ${task.sha256}`,
      `Task requirements: ${task.assessment.toUpperCase()}. Supporting evidence is not proof of completion.`);
    for(const item of task.requirements)lines.push(`  [${item.status.toUpperCase()}] ${text(item.id)}: ${text(item.text)}`);
    for(const nonGoal of task.nonGoals)lines.push(`  Non-goal: ${text(nonGoal)}`);
  }
  if(report.references) {
    // Resource loading and contract comparison are separate stages.
    lines.push('',`Reference loading: ${report.references.state.toUpperCase()} — NOT ASSESSED`,
      'Loading alone is not assessment. See each AI stage for reference inclusion. Hashes identify loaded bytes; declared versions and authority are user assertions.');
    for(const resource of report.references.resources)lines.push(
      `  [${resource.status.toUpperCase()}] ${text(resource.id)}: ${text(resource.path)} (${resource.kind}; ${resource.authority}; ${resource.required?'required':'optional'})`,
      `    Declared version: ${text(resource.version ?? 'unspecified')}; SHA256: ${resource.sha256 ?? 'unavailable'}; bytes: ${resource.bytes}`);
  }
  for(const contract of report.contracts ?? []) {
    lines.push('',`Contract ${text(contract.id)}: ${contract.state.toUpperCase()} — ${contract.scope==='literal-javascript-fetch-only'?'literal JavaScript fetch only':'literal HTTP calls; adapter-specific coverage'}`,
      `  Provider: ${text(contract.reference?.path ?? contract.resourceId)}; SHA256: ${contract.reference?.sha256 ?? 'unavailable'}; version: ${text(contract.reference?.apiVersion ?? 'unknown')}`);
    for(const issue of contract.issues)lines.push(`  Limitation: ${text(issue)}`);
    for(const file of contract.files)lines.push(`  Consumer: ${text(file.path)} [${text(file.status)}]; SHA256: ${file.sha256 ?? 'unavailable'}`,
      `    Adapter: ${text(file.adapter ?? 'unavailable')}; language: ${text(file.language ?? 'unsupported/unknown')}; extracted calls: ${file.callCount ?? 'not recorded'}`);
    for(const call of contract.calls)lines.push(`  [${call.status.toUpperCase()}] ${text(call.path)}:${call.line} — ${text(call.reason)}`,
      `    Observation: ${call.observationKind ?? 'request-call'}; construction does not establish that a request is sent.`,
      `    ${text(call.excerpt)}`,`    Contract pointers: ${call.contractPointers.map(text).join(', ') || '(none)'}`);
    lines.push('  No runtime requests executed. Only mapped files and supported direct calls assessed; a match does not prove integration correctness.');
  }
  if (report.inspectionWarnings.length > 0) {
    lines.push("", "Inspection warnings (some content was not analyzed):");
    for (const warning of report.inspectionWarnings) {
      lines.push(`  ${text(warning.path)} [${warning.code}]: ${text(warning.message)}`);
    }
  }
  if(report.checks?.length) {
    lines.push('', 'Configured checks (whole repository; tool output is not citation-verified):');
    for(const check of report.checks) {
      lines.push(`  [${check.status.toUpperCase()}] ${text(check.id)}: ${text(check.reason)}`);
      for(const diagnostic of check.diagnostics ?? [])lines.push(
        `    [${diagnostic.severity.toUpperCase()}] ${text(diagnostic.tool)}/${text(diagnostic.ruleId ?? 'unclassified')}: ${text(diagnostic.message)}`,
        `      ${text(diagnostic.path ?? '(no file location)')}${diagnostic.line?`:${diagnostic.line}`:''}${diagnostic.column?`:${diagnostic.column}`:''}`);
      if(check.output)lines.push(`    ${text(check.output)}`);
    }
  }
  lines.push("", report.checks?.some(check=>check.status!=='skipped')
    ? 'Scope: configured deterministic rules and explicitly authorized external checks. A successful command does not prove correctness.'
    : 'Scope: configured deterministic repository rules only. No scripts or tests were executed.');
  if(report.aiAudit) {
    const audit=report.aiAudit;
    lines.push('',`Whole-repository AI: ${audit.state.toUpperCase()}; ${audit.batches.length} batches; ${audit.selectedPaths.length} selected files; ${audit.validResponsePaths.length} files with valid responses; ${audit.skipped.length} skipped.`,
      'Whole-repository scope does not guarantee complete context or defect detection. Preview/mock results are not real diagnoses.');
    if(audit.budgetName)lines.push(`Persistent allowance: ${text(audit.budgetName)}; use shipcheck budget status to inspect reservations.`);
    if(audit.stoppedReason)lines.push(`Stopped: ${text(audit.stoppedReason)}. Completed batches are retained; remaining paths were not reviewed.`);
    for(const item of audit.skipped)lines.push(`  Skipped: ${text(item.path)} — ${text(item.reason)}`);
    audit.batches.forEach((ai,index)=>lines.push('',`AI batch ${index+1}:`,renderConsoleReport({schemaVersion:1,root:report.root,findings:[],inspectionWarnings:[],ai})));
  }
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
    for(const reference of ai.preview.references ?? [])lines.push(`  Reference [${text(reference.status)}]: ${text(reference.id)} — ${text(reference.path)}; SHA256: ${reference.sha256 ?? 'unavailable'}; freshness: ${reference.freshness ?? 'not-rechecked'}`);
    for (const skipped of ai.preview.skipped) lines.push(`  Skipped: ${text(skipped.path)} — ${text(skipped.reason)}`);
    for (const path of ai.preview.supportingPaths ?? []) lines.push(`  Supporting context: ${text(path)}`);
    for (const dependency of ai.preview.dependencies ?? []) if(dependency.status!=='included')
      lines.push(`  Missing dependency context: ${text(dependency.from)} -> ${text(dependency.specifier)} (${dependency.status})`);
    lines.push(`Request size: ${ai.requestBytes} bytes; approximate input tokens: ${ai.estimatedInputTokens} (heuristic)`,
      `Output limit: ${ai.maxOutputTokens} tokens; retries: 0`,
      ai.execution === 'live' ? ai.budget ? `Live budget: ${text(ai.budget.name)}; persistent reservations; no retries.`
        : ai.trial ? 'Live trial: $0.50 allowance; one attempt per mode; no retries. See shipcheck trial status.'
        : 'Live request failed; inspect the selected allowance for any retained reservation.'
        : 'Live cost estimate: unavailable in offline mode.');
    if (ai.execution === 'preview' || ai.execution === 'mock') lines.push('Offline only: no model ran, no network request, $0 API spend.');
    if (ai.trial) lines.push(`Counted input: ${ai.trial.countedInputTokens}; usage: ${ai.trial.usage.input_tokens} input / ${ai.trial.usage.output_tokens} output tokens`,
      `Reserved: $${ai.trial.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.trial.pricedUsageUpperBoundUsd.toFixed(6)} (not an invoice).`);
    if(ai.budget)lines.push(`Counted input: ${ai.budget.countedInputTokens}; usage: ${ai.budget.usage.input_tokens} input / ${ai.budget.usage.output_tokens} output tokens`,
      `Reserved: $${ai.budget.reservedUsd.toFixed(6)}; priced usage upper bound: $${ai.budget.pricedUsageUpperBoundUsd.toFixed(6)} (not an invoice).`);
    if (ai.error) lines.push(`AI failure [${text(ai.error.code)}]: ${text(ai.error.message)}`);
    if (ai.status === 'preview') lines.push('Preview only: no QA review was performed.');
    if (ai.status === 'completed') lines.push(`AI candidates: ${ai.candidates.length} — UNVERIFIED${ai.execution === 'mock' ? ' / SYNTHETIC MOCK' : ''}`);
    if(ai.taskReview) {
      lines.push('',`Requirement assessments: ${ai.taskReview.state.toUpperCase()}; task freshness: ${ai.taskReview.freshness}; hash: ${ai.taskReview.taskHash}`);
      for(const item of ai.taskReview.assessments) {
        lines.push(`  [${item.status.toUpperCase()}] ${text(item.requirementId)}: ${text(item.explanation)}`);
        if(item.status!==item.proposedStatus)lines.push(`    Original model status: ${item.proposedStatus}`);
        if(item.relatedRequirementIds.length)lines.push(`    Related criteria: ${item.relatedRequirementIds.map(text).join(', ')}`);
        if(item.evidenceVerification)lines.push(`    Citation check: ${item.evidenceVerification.status.toUpperCase()}`);
        for(const evidence of item.evidence)lines.push(`    ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
      }
    }
    for(const conflict of ai.referenceConflicts ?? []) {
      lines.push('',`Reference conflict — NEEDS CLARIFICATION (AI interpretation, unverified): ${text(conflict.explanation)}`,
        `  Citation check: ${conflict.evidenceVerification.status.toUpperCase()}; conflict makes coverage partial.`);
      for(const evidence of conflict.evidence)lines.push(`  ${text(evidence.path)}:${evidence.startLine}-${evidence.endLine} — ${text(evidence.excerpt)}`);
      for(const check of conflict.evidenceVerification.checks)if(check.status==='rejected')lines.push(`  Rejected: ${text(check.path)} — ${text(check.reason)}`);
    }
    for (const candidate of ai.candidates) {
      lines.push(`  [${candidate.severity.toUpperCase()}] ${text(candidate.title)}`, `    ${text(candidate.explanation)}`);
      if(candidate.referenceConflict)lines.push('    Depends on a disputed reference: clarify expectations before changing code.');
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
