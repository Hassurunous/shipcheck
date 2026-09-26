import fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { inspectRepository, reviewRepository, loadConfig, MAX_FILE_BYTES, createReport } from '../src/index.js';

let root: string;
beforeEach(async () => { root = await fs.mkdtemp(join(tmpdir(), 'shipcheck-boundaries-')); });
afterEach(async () => { vi.restoreAllMocks(); await fs.rm(root, {recursive:true, force:true}); });

it('uses actual filesystem casing for script, dependency and entry targets', async () => {
  await fs.mkdir(join(root, 'Source'));
  await fs.writeFile(join(root, 'Source/Main.js'), '');
  await fs.writeFile(join(root, 'package.json'), JSON.stringify({scripts:{start:'node source/main.js'}, dependencies:{local:'file:source'}, main:'source/main.js'}));
  const exists = await fs.lstat(join(root,'source/main.js')).then(()=>true,()=>false);
  const profile = await inspectRepository(root);
  expect(profile.packageReferences.every(r=>r.existence === (exists ? 'exists' : 'missing'))).toBe(true);
  expect(createReport(profile, {rules:{'package/missing-entry-point':'warning'}}).findings).toHaveLength(exists ? 0 : 3);
});
it('preserves genuine missing targets and does not guess for older profile references', async () => {
  await fs.writeFile(join(root,'package.json'), JSON.stringify({scripts:{start:'node absent.js'}}));
  const profile = await inspectRepository(root);
  expect(profile.packageReferences[0]!.existence).toBe('missing');
  expect(createReport(profile).findings).toHaveLength(1);
  delete profile.packageReferences[0]!.existence;
  expect(createReport(profile).findings).toEqual([]);
});
it('does not follow a differently cased directory link', async () => {
  await fs.mkdir(join(root,'actual'));
  await fs.symlink(join(root,'actual'), join(root,'Linked'), 'junction');
  await fs.writeFile(join(root,'package.json'), JSON.stringify({dependencies:{local:'file:linked/absent'}}));
  const aliasExists = await fs.lstat(join(root,'linked')).then(()=>true,()=>false);
  const profile = await inspectRepository(root);
  expect(profile.packageReferences[0]!.existence).toBe(aliasExists ? 'unknown' : 'missing');
});
it('honors exclusions through existing case aliases', async () => {
  await fs.mkdir(join(root,'Generated'));
  await fs.writeFile(join(root,'package.json'), JSON.stringify({dependencies:{local:'file:generated/absent'}}));
  const aliasExists = await fs.lstat(join(root,'generated')).then(()=>true,()=>false);
  const profile = await inspectRepository(root,{exclude:['Generated/**']});
  expect(profile.packageReferences[0]!.existence).toBe(aliasExists ? 'unknown' : 'missing');
});
it('uses defaults only for a missing config in a valid root', async () => {
  expect((await loadConfig(root)).version).toBe(1);
  await expect(loadConfig(join(root,'absent'))).rejects.toThrow();
  await fs.writeFile(join(root,'file'),'');
  await expect(loadConfig(join(root,'file'))).rejects.toThrow('must be a directory');
});
it('rejects linked roots and linked configurations before opening content', async () => {
  await fs.mkdir(join(root,'actual'));
  await fs.symlink(join(root,'actual'),join(root,'linked'),'junction');
  await expect(loadConfig(join(root,'linked'))).rejects.toThrow('must be a directory');
  await fs.symlink(join(root,'actual'),join(root,'shipcheck.config.json'),'junction');
  const open = vi.spyOn(fs,'open');
  await expect(loadConfig(root)).rejects.toThrow('regular file');
  expect(open).not.toHaveBeenCalled();
});
it('rejects directories, oversized and non-UTF-8 configurations', async () => {
  const path = join(root,'shipcheck.config.json');
  await fs.mkdir(path);
  await expect(loadConfig(root)).rejects.toThrow('regular file');
  await fs.rmdir(path);
  await fs.writeFile(path, ' '.repeat(MAX_FILE_BYTES + 1));
  await expect(loadConfig(root)).rejects.toThrow('read limit');
  await fs.writeFile(path, Buffer.from([255,254]));
  await expect(loadConfig(root)).rejects.toThrow();
});
it('accepts a config exactly at the byte limit and an optional UTF-8 BOM', async () => {
  const path = join(root,'shipcheck.config.json');
  await fs.writeFile(path, '{}' + ' '.repeat(MAX_FILE_BYTES - 2));
  expect((await loadConfig(root)).version).toBe(1);
  await fs.writeFile(path, '\ufeff{}');
  expect((await loadConfig(root)).version).toBe(1);
});
it('enforces the read cap even when initial metadata reports a smaller file', async () => {
  const path = join(root,'shipcheck.config.json');
  await fs.writeFile(path, '{}' + ' '.repeat(MAX_FILE_BYTES));
  const realLstat = fs.lstat;
  vi.spyOn(fs,'lstat').mockImplementation(async (...args: Parameters<typeof fs.lstat>) => {
    const stat = await realLstat(...args);
    if (args[0] === path) stat.size = 0;
    return stat;
  });
  await expect(loadConfig(root)).rejects.toThrow('read limit');
});
it('returns operational errors for unsafe config through the review API', async () => {
  await fs.mkdir(join(root,'shipcheck.config.json'));
  await expect(reviewRepository(root)).rejects.toThrow('regular file');
});

it('does not lowercase paths when the filesystem rejects a case mismatch', async () => {
  await fs.mkdir(join(root,'src'));
  await fs.writeFile(join(root,'src/Main.js'),'');
  await fs.writeFile(join(root,'package.json'), JSON.stringify({scripts:{start:'node src/main.js'}}));
  const original = fs.lstat;
  vi.spyOn(fs,'lstat').mockImplementation(async (...args: Parameters<typeof fs.lstat>) => {
    if (String(args[0]).endsWith(join('src','main.js'))) throw Object.assign(new Error('Missing'), {code:'ENOENT'});
    return original(...args);
  });
  expect((await reviewRepository(root)).findings[0]!.ruleId).toBe('package/missing-script-target');
});
it('does not treat unreadable config as absent', async () => {
  const original = fs.lstat;
  vi.spyOn(fs,'lstat').mockImplementation(async (...args: Parameters<typeof fs.lstat>) => {
    if (String(args[0]).endsWith('shipcheck.config.json')) throw Object.assign(new Error('Denied'), {code:'EACCES'});
    return original(...args);
  });
  await expect(loadConfig(root)).rejects.toThrow('Denied');
});
