import { lstat } from 'node:fs/promises';
import { dirname, parse, resolve, join } from 'node:path';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { readBoundedConfig } from './filesystem-policy.js';

const relativePath = z.string().min(1).max(512).refine(value=> !/[:\\\u0000-\u001f]/.test(value)
  && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Expected a relative forward-slash file path.');
export const taskSchema = z.object({version:z.literal(1),repository:z.string().min(1),
  files:z.array(relativePath).min(1).max(256),criteria:z.array(z.string().trim().min(1).max(2000)).min(1).max(50)}).strict();
export const currentTaskSchema=z.object({
  id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  title:z.string().trim().min(1).max(200),description:z.string().max(4000).default(''),
  files:z.array(relativePath).min(1).max(256),
  requirements:z.array(z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
    text:z.string().trim().min(1).max(2000)}).strict()).min(1).max(50)
    .refine(items=>new Set(items.map(item=>item.id)).size===items.length,'Requirement IDs must be unique.'),
  nonGoals:z.array(z.string().trim().min(1).max(2000)).max(50).default([]),
}).strict();
export type CurrentTask=z.infer<typeof currentTaskSchema>;
export const currentTaskReportSchema=z.object({id:z.string(),title:z.string(),sha256:z.string(),
  source:z.enum(['configuration','task-file']),assessment:z.enum(['not-assessed','assessed','partial','changed']),
  requirements:z.array(z.object({id:z.string(),text:z.string(),status:z.enum(['insufficient-evidence','supporting-evidence','potential-violation','needs-clarification'])})),
  nonGoals:z.array(z.string())});
export function describeCurrentTask(input:z.input<typeof currentTaskSchema>) {
  const task=currentTaskSchema.parse(input);
  return currentTaskReportSchema.parse({id:task.id,title:task.title,
    sha256:createHash('sha256').update(JSON.stringify(task)).digest('hex'),source:'configuration',assessment:'not-assessed',
    requirements:task.requirements.map(item=>({...item,status:'insufficient-evidence'})),nonGoals:task.nonGoals});
}
export function normalizeLegacyTask(task:z.infer<typeof taskSchema>):CurrentTask {
  return currentTaskSchema.parse({id:'task-file',title:'Task file',files:task.files,
    requirements:task.criteria.map((text,index)=>({id:`criterion-${index+1}`,text}))});
}
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
