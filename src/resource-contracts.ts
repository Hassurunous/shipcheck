import {z} from 'zod';

const pathSchema=z.string().min(1).max(512).refine(path=>!/[\\:\u0000-\u001f]/.test(path)
  && path.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Use a relative slash-separated file path inside the repository.');
export const resourceDefinitionSchema=z.object({
  id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  path:pathSchema,
  kind:z.enum(['document','openapi','schema','source']).default('document'),
  authority:z.enum(['authoritative','supporting']).default('supporting'),
  version:z.string().min(1).max(128).optional(),
  expectedSha256:z.string().regex(/^[a-f0-9]{64}$/).optional(),
  required:z.boolean().default(true),
  appliesTo:z.array(z.string()).min(1).default(['**']),
}).strict();
export type ResourceDefinition=z.infer<typeof resourceDefinitionSchema>;
export const resourceRecordSchema=resourceDefinitionSchema.extend({
  status:z.enum(['loaded','not-applicable','excluded','missing','linked','non-regular','file-size-limit',
    'total-size-limit','invalid-text','unreadable','sensitive-content','hash-mismatch']),
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
