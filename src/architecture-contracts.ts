import {z} from 'zod';
import {intentPolicySchema,dependencyObservationSchema} from './intent-policy.js';
const path=dependencyObservationSchema.shape.from;
const id=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
export const architectureSchema=z.object({
  files:z.array(z.string().min(1).max(512).refine(v=>!/[\\:?![\]{}\u0000-\u001f]/.test(v)
    && v.split('/').every(p=>!!p && p!=='.' && p!=='..' && (!p.includes('**') || p==='**')))).min(1).max(32),
  boundaries:intentPolicySchema.shape.boundaries,
  conventions:z.array(z.object({id,within:path,style:z.enum(['snake_case','kebab-case','PascalCase']),
    reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([]),
  aliases:z.array(z.object({prefix:z.string().min(1).max(256).regex(/^[a-zA-Z@][a-zA-Z0-9_@./-]*$/),target:path}).strict()).max(100).default([]),
}).strict().superRefine((v,ctx)=>{
  const ids=[...v.boundaries,...v.conventions].map(p=>p.id);
  if(!ids.length || new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Provide at least one policy; policy IDs must be unique.'});
  if(new Set(v.aliases.map(a=>a.prefix)).size!==v.aliases.length)ctx.addIssue({code:'custom',message:'Alias prefixes must be unique.'});
});
export const architectureResultSchema=z.object({
  state:z.enum(['checked','partial']),policySha256:z.string(),coverage:z.literal('configured-import-declarations-only'),
  files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})),
  dependencies:z.array(z.object({from:z.string(),line:z.number(),excerpt:z.string(),specifier:z.string().optional(),
    status:z.enum(['resolved','external','unresolved']),to:z.string().optional(),reason:z.string()})),
  boundaries:z.array(z.object({id:z.string(),from:z.string(),to:z.string(),reason:z.string(),
    status:z.enum(['violation','no-observed-violation']),evidence:z.array(dependencyObservationSchema)})),
  conventions:z.array(z.object({id:z.string(),within:z.string(),style:z.string(),reason:z.string(),
    status:z.enum(['violation','no-observed-violation']),evidence:z.array(z.string())})),issues:z.array(z.string()),
});
export type ArchitectureResult=z.infer<typeof architectureResultSchema>;
