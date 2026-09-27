import { expect, it } from 'vitest';
import { renderMarkdownReport } from '../src/markdown-report.js';
import { runCli } from '../src/cli-command.js';

it('renders the demo with findings and maintains exit-code semantics',async()=> {
  const result=await runCli(['audit','fixtures/demo','--markdown']);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain('# Shipcheck report');
  expect(result.stdout).toContain('Deterministic findings: 2');
  expect(result.stdout).toContain('package/missing-script-target');
  expect(result.stdout).toContain('source/fixme');
  expect((await runCli(['audit','--json','--markdown'])).exitCode).toBe(2);
});
it('contains Markdown, HTML and fence delimiters inside a longer literal fence',()=> {
  const report=renderMarkdownReport({schemaVersion:1,root:'```\n<script>x</script>\n![x](https://invalid.example)',findings:[],inspectionWarnings:[]});
  expect(report).toContain('````text\n');
  expect(report).toContain('Target: ```\\n<script>');
  expect(report).toContain('\n````\n');
});
it('preserves AI failure and synthetic citation labels in Markdown',async()=> {
  const mock=await runCli(['audit','fixtures/demo','--ai','mock','--markdown']);
  expect(mock.stdout).toContain('SYNTHETIC MOCK');
  expect(mock.stdout).toContain('Citation check: MATCHED');
});
