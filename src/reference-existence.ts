import fs from 'node:fs/promises';
import { join, posix, relative } from 'node:path';
import { isExcluded } from './config.js';
import type { RepositoryProfile } from './repository-profile.js';

type Reference = RepositoryProfile['packageReferences'][number];

/** Capture existence using the filesystem's own case rules, without traversing links. */
export async function referenceExistence(root: string, reference: Reference, excluded: string[]): Promise<'exists' | 'missing' | 'unknown'> {
  if (!reference.target || /[:\\%$*?{}~]/.test(reference.target) || posix.isAbsolute(reference.target)) return 'unknown';
  const target = posix.normalize(posix.join(posix.dirname(reference.path), reference.target));
  if (target === '..' || target.startsWith('../') || target === '.') return 'unknown';
  if (isExcluded(target, excluded)) return 'unknown';
  try { root = await fs.realpath(root); } catch { return 'unknown'; }
  let current = root;
  const parts = target.split('/');
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]!;
    if (part === '.git' || part === 'node_modules') return 'unknown';
    current = join(current, part);
    try {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) return 'unknown';
      // Canonical casing also prevents exclusions being bypassed by a case alias.
      const actual = relative(root, await fs.realpath(current)).split('\\').join('/');
      if (actual.startsWith('../') || isExcluded(actual, excluded)
        || actual.split('/').some(p => p === '.git' || p === 'node_modules')) return 'unknown';
      if (index < parts.length - 1 && !stat.isDirectory()) return 'unknown';
    } catch (error) {
      return (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'missing' : 'unknown';
    }
  }
  return 'exists';
}
