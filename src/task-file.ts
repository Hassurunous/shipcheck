import { lstat } from 'node:fs/promises';
import { dirname, parse, resolve, join } from 'node:path';
import { z } from 'zod';
import { readBoundedConfig } from './filesystem-policy.js';

const relativePath = z.string().min(1).max(512).refine(value=> !/[:\\\u0000-\u001f]/.test(value)
  && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Expected a relative forward-slash file path.');
export const taskSchema = z.object({version:z.literal(1),repository:z.string().min(1),
  files:z.array(relativePath).min(1).max(256),criteria:z.array(z.string().trim().min(1).max(2000)).min(1).max(50)}).strict();
export async function loadTask(path:string) {
  const absolute = resolve(path);
  let current = parse(absolute).root;
  for (const part of absolute.slice(current.length).split(/[\\/]/)) {
    current = join(current,part);
    if ((await lstat(current)).isSymbolicLink()) throw new Error('Task file paths must not contain symlinks.');
  }
  const content = await readBoundedConfig(absolute);
  if (content === undefined) throw new Error('Task file does not exist.');
  let task;
  try { task = taskSchema.parse(JSON.parse(content)); }
  catch { throw new Error('Invalid task JSON. Expected version:1, repository, nonempty files and criteria arrays.'); }
  return {...task,repository:resolve(dirname(absolute),task.repository)};
}
