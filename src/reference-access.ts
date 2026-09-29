import {z} from 'zod';

export const rootIdSchema=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
export const referenceUrlSchema=z.string().max(2048).refine(value=>{
  try {const url=new URL(value);return url.protocol==='https:' && !url.username && !url.password && !url.search && !url.hash
    && !/[\u0000-\u0020\\]/.test(value); }catch{return false;}
},'Use an HTTPS URL without credentials, query, fragment or whitespace.');
export const referenceOriginSchema=referenceUrlSchema.refine(value=>new URL(value).pathname==='/' && value===new URL(value).origin,
  'Supply an exact HTTPS origin, without a trailing slash or path.');
/** Runtime grants only. Repository configuration cannot authorize external access. */
export const referenceAccessSchema=z.object({
  roots:z.record(rootIdSchema,z.string().min(1).max(4096)).default({}),
  origins:z.array(referenceOriginSchema).max(16).default([]),
}).strict().refine(value=>Object.keys(value.roots).length<=16,'At most 16 external roots.');
export type ReferenceAccess=z.input<typeof referenceAccessSchema>;
