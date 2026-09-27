import { afterEach, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCli } from '../src/cli-command.js';

const roots: string[] = [];
it('removes review and directs users to audit without inspecting a target', async () => {
  const result = await runCli(['review', 'nonexistent']);
  expect(result.exitCode).toBe(2);
  expect(result.stdout).toBe('');
  expect(result.stderr).toContain('Use shipcheck audit instead');
  expect((await runCli(['help', 'review'])).exitCode).toBe(2);
  expect((await runCli(['help'])).stdout).not.toContain('review [target]');
});
afterEach(async () => { for (const root of roots.splice(0)) await fs.rm(root, {recursive: true, force: true}); });
async function fixture() { const root = await fs.mkdtemp(join(tmpdir(), 'shipcheck-cli-')); roots.push(root); return root; }
it('shows help and version without inspecting a repository', async () => {
  for (const args of [['help'], ['help', 'audit'], ['--help'], ['audit', '--help']]) {
    const result = await runCli(args);
    expect(result.exitCode).toBe(0); expect(result.stdout).toContain('audit [target]');
  }
  expect((await runCli(['--version'])).stdout).toBe('Shipcheck v0.1');
  expect((await runCli(['.'])).stdout).toContain('Status: ready');
});
it('rejects unknown commands, options and excess targets', async () => {
  for (const args of [['rewiew'], ['help', 'nope'], ['audit', '--bad'], ['audit', '.', 'extra']]) {
    const result = await runCli(args); expect(result.exitCode).toBe(2); expect(result.stdout).toBe(''); expect(result.stderr).toContain('usage');
  }
});
it('prints JSON and returns 1 for error findings, respecting target configuration', async () => {
  const root = await fixture();
  await fs.writeFile(join(root, 'package.json'), '{');
  const result = await runCli(['audit', '--json', '--', root]);
  expect(result.exitCode).toBe(1); expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout).findings[0].ruleId).toBe('package/invalid-json');
  await fs.writeFile(join(root, 'shipcheck.config.json'), JSON.stringify({rules: {'package/invalid-json': 'warning'}}));
  expect((await runCli(['audit', root])).exitCode).toBe(0);
});
it('reports config and inspection failures to stderr with exit code 2', async () => {
  const root = await fixture();
  expect((await runCli(['audit', join(root, 'missing')])).exitCode).toBe(2);
  await fs.writeFile(join(root, 'shipcheck.config.json'), '{');
  const result = await runCli(['audit', root, '--json']);
  expect(result.exitCode).toBe(2); expect(result.stdout).toBe(''); expect(result.stderr).toContain('Invalid shipcheck.config.json');
});
