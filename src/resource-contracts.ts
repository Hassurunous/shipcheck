import {z} from 'zod';
import {rootIdSchema,referenceUrlSchema} from './reference-access.js';

const pathSchema=z.string().min(1).max(512).refine(path=>!/[\\:\u0000-\u001f]/.test(path)
  && path.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Use a relative slash-separated file path inside the repository.');
export const resourceDefinitionSchema=z.object({
  id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  path:pathSchema,
  rootId:rootIdSchema.optional(),
  url:referenceUrlSchema.optional(),
  kind:z.enum(['document','openapi','schema','source']).default('document'),
  authority:z.enum(['authoritative','supporting']).default('supporting'),
  version:z.string().min(1).max(128).optional(),
  expectedSha256:z.string().regex(/^[a-f0-9]{64}$/).optional(),
  required:z.boolean().default(true),
  appliesTo:z.array(z.string()).min(1).default(['**']),
}).strict().superRefine((value,ctx)=>{
  if(value.rootId && value.url)ctx.addIssue({code:'custom',message:'Choose rootId or url, not both.'});
  if(value.url && !value.expectedSha256)ctx.addIssue({code:'custom',message:'HTTPS references require expectedSha256.'});
  // Records already contain the virtual prefix; definitions contain the source path.
  const citationPath='origin' in value ? value.path : `@references/${value.id}/${value.path}`;
  if((value.rootId || value.url) && citationPath.length>512)ctx.addIssue({code:'custom',message:'External citation path exceeds 512 characters.'});
});
export type ResourceDefinition=z.infer<typeof resourceDefinitionSchema>;
export const resourceRecordSchema=resourceDefinitionSchema.safeExtend({
  status:z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit',
    'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch','access-denied','remote-failed']),
  origin:z.object({kind:z.enum(['external-root','https']),path:z.string(),rootId:z.string().optional(),rootSha256:z.string().optional(),url:z.string().optional()}).optional(),
  sha256:z.string().nullable(),bytes:z.number().int().nonnegative(),lines:z.number().int().nonnegative(),
});
export type ResourceRecord=z.infer<typeof resourceRecordSchema>;
export const referencesSchema=z.object({
  state:z.enum(['ready','incomplete']),
  evaluation:z.literal('not-assessed'),
  resources:z.array(resourceRecordSchema),
});
export const resourceEvidenceSchema=z.object({resourceId:z.string().min(1),snapshotSha256:z.string().regex(/^[a-f0-9]{64}$/),
  startLine:z.number().int().positive(),endLine:z.number().int().positive(),excerpt:z.string().min(1).max(8000)}).strict();
