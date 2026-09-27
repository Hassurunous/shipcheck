import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { runCli } from '../src/cli-command.js';
import { changedPaths } from '../src/workflows.js';
import { loadTask } from '../src/task-file.js';
import { reviewRepository } from '../src/review-repository.js';
const exec = promisify(execFile);
let root:string;
const git = (...args:string[]) => exec('git',['-C',root,...args],{windowsHide:true});
beforeEach(async()=> {
  root=await fs.mkdtemp(join(tmpdir(),'shipcheck-workflows-'));
  vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network forbidden');}));
});
afterEach(async()=> {vi.unstubAllGlobals(); await fs.rm(root,{recursive:true,force:true});});
async function initialize() {
  await git('init'); await git('config','user.name','Test'); await git('config','user.email','test@example.invalid');
  await fs.writeFile(join(root,'a.ts'),'export const a = 1;\n');
  await fs.writeFile(join(root,'b.ts'),'export const b = 1;\n');
  await git('add','.'); await git('commit','-m','fixture');
}
it('audits with the existing library rules',async()=> {
  await fs.writeFile(join(root,'package.json'),'{');
  const audit=await runCli(['audit',root,'--json']);
  const review=await reviewRepository(root);
  expect(audit.exitCode).toBe(1);
  expect(JSON.parse(audit.stdout).findings).toEqual(review.findings);
  expect(JSON.parse(audit.stdout).workflow.kind).toBe('audit');
  expect(review.workflow).toBeUndefined();
});
it('combines staged, unstaged and untracked paths and scopes AI input',async()=> {
  await initialize();
  await fs.writeFile(join(root,'a.ts'),'export const a = 2;\n'); await git('add','a.ts');
  await fs.writeFile(join(root,'new file.ts'),'export const n = 3;\n');
  expect(await changedPaths(root)).toEqual(['a.ts','new file.ts']);
  const result = await runCli(['diff',root,'--ai','mock','--json']);
  expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout).ai.preview.files.map((f:{path:string})=>f.path)).toEqual(['a.ts','new file.ts']);
  expect(fetch).not.toHaveBeenCalled();
});
it('reports clean diffs without invoking AI and discloses deleted content',async()=> {
  await initialize();
  const clean = await runCli(['diff',root,'--ai','mock','--json']);
  expect(JSON.parse(clean.stdout).workflow.scope).toEqual([]);
  expect(JSON.parse(clean.stdout).ai).toBeUndefined();
  await fs.unlink(join(root,'b.ts'));
  const deleted=await runCli(['diff',root,'--json']);
  expect(JSON.parse(deleted.stdout).workflow.unavailablePaths).toEqual(['b.ts']);
});
it('filters deterministic findings to changed evidence paths',async()=> {
  await initialize();
  await fs.writeFile(join(root,'package.json'),'{'); await git('add','.'); await git('commit','-m','existing bad manifest');
  await fs.writeFile(join(root,'a.ts'),'export const a = 2;');
  expect(JSON.parse((await runCli(['diff',root,'--json'])).stdout).findings).toEqual([]);
  await fs.writeFile(join(root,'package.json'),'[]');
  expect((await runCli(['diff',root])).exitCode).toBe(1);
});
it('rejects non-Git, unborn, and nested diff roots',async()=> {
  expect((await runCli(['diff',root])).exitCode).toBe(2);
  await git('init'); expect((await runCli(['diff',root])).exitCode).toBe(2);
  await initialize(); await fs.mkdir(join(root,'sub'));
  expect((await runCli(['diff',join(root,'sub')])).exitCode).toBe(2);
});
it('loads structured tasks relative to the task file and keeps criteria explicitly unassessed',async()=> {
  await fs.mkdir(join(root,'repo')); await fs.writeFile(join(root,'repo','a.ts'),'export const a = 1;');
  const path=join(root,'task.json');
  await fs.writeFile(path,JSON.stringify({version:1,repository:'repo',files:['a.ts'],criteria:['Preserve correct behavior']}));
  const result=await runCli(['task',path,'--ai','mock','--json']);
  expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout).workflow).toMatchObject({kind:'task',scope:['a.ts'],criteria:['Preserve correct behavior']});
  expect((await runCli(['task',path])).stdout).toContain('human confirmation required');
  expect(fetch).not.toHaveBeenCalled();
});
it('rejects invalid tasks, path escapes and nonexistent selected files',async()=> {
  const path=join(root,'task.json');
  for(const files of [['../escape.ts'],['C:/escape.ts'],['missing.ts']]) {
    await fs.writeFile(path,JSON.stringify({version:1,repository:'.',files,criteria:['Check']}));
    expect((await runCli(['task',path])).exitCode).toBe(2);
  }
  await fs.writeFile(path,'not JSON'); await expect(loadTask(path)).rejects.toThrow('Invalid task');
  expect((await runCli(['task'])).exitCode).toBe(2);
  expect((await runCli(['help','task'])).exitCode).toBe(0);
});

it('respects AI exclusions even when a task explicitly lists a file',async()=> {
  await fs.writeFile(join(root,'a.ts'),'export const a = 1;');
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify({exclude:['a.ts']}));
  const path=join(root,'task.json');
  await fs.writeFile(path,JSON.stringify({version:1,repository:'.',files:['a.ts'],criteria:['Check']}));
  const result=await runCli(['task',path,'--ai','mock','--json']);
  expect(result.exitCode).toBe(2);
  expect(JSON.parse(result.stdout).ai.error.code).toBe('empty-context');
  expect(fetch).not.toHaveBeenCalled();
});

it('detects unstaged changes and safely retains unusual filenames',async()=> {
  await initialize();
  await fs.writeFile(join(root,'b.ts'),'export const b = 2;');
  await fs.writeFile(join(root,'-special name.ts'),'export const n = 1;');
  expect(await changedPaths(root)).toEqual(['-special name.ts','b.ts']);
});

it('rejects task files reached through linked directories and oversized tasks',async()=> {
  await fs.mkdir(join(root,'real'));
  await fs.writeFile(join(root,'real','task.json'),'{}');
  await fs.symlink(join(root,'real'),join(root,'linked'),'junction');
  await expect(loadTask(join(root,'linked','task.json'))).rejects.toThrow('symlinks');
  await fs.writeFile(join(root,'large.json'),' '.repeat(1024*1024+1));
  await expect(loadTask(join(root,'large.json'))).rejects.toThrow('limit');
});
