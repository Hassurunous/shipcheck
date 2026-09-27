import { reportSchema, type Report } from './findings.js';
import { renderConsoleReport } from './reporters.js';

/** Fence all repository/model-controlled text so it cannot become Markdown markup. */
export function renderMarkdownReport(input: Report): string {
  const report = reportSchema.parse(input);
  const content = renderConsoleReport(report);
  const longest = Math.max(0,...Array.from(content.matchAll(/`+/g),match=>match[0].length));
  const fence = '`'.repeat(Math.max(3,longest+1));
  return ['# Shipcheck report','',
    `- Deterministic findings: ${report.findings.length}`,
    `- Inspection warnings: ${report.inspectionWarnings.length}`,
    `- AI candidates: ${report.ai?.candidates.length ?? 0}`,'',
    '## Review details','',fence+'text',content,fence,'',
    'A clean report does not establish correctness. AI diagnoses remain unverified.',''].join('\n');
}
