import {z} from 'zod';
import {resourceDefinitionSchema} from './resource-contracts.js';
import {rootIdSchema} from './reference-access.js';
import {versionRangeSchema} from './version-policy.js';
const path=resourceDefinitionSchema.shape.path;
export const sdkBindingSchema=z.object({
  id:rootIdSchema,package:z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/),
  files:z.array(path).min(1).max(32),rootId:rootIdSchema.optional(),
  packageRoot:z.union([path,z.literal('.')]).optional(),
  declarationFile:path.refine(value=>/\.d\.(?:ts|mts|cts)$/.test(value),'Expected a declaration file.').optional(),
  expectedVersion:z.string().min(1).max(128).optional(),versionRange:versionRangeSchema.optional(),
}).strict();
export const sdkResultSchema=z.object({
  id:z.string(),package:z.string(),state:z.enum(['checked','partial','unavailable','version-mismatch']),
  scope:z.literal('direct-named-function-calls-only'),issues:z.array(z.string()),
  provider:z.object({manifestPath:z.string(),manifestSha256:z.string().nullable(),version:z.string().optional(),
    declarationPath:z.string().optional(),declarationSha256:z.string().nullable().optional(),rootId:z.string().optional(),rootSha256:z.string().optional()}).optional(),
  files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string()})),
  calls:z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(),symbol:z.string(),
    status:z.enum(['matched','mismatch','unresolved']),reason:z.string(),
    providerEvidence:z.array(z.object({line:z.number().int().positive(),excerpt:z.string()}))})),
});
export type SdkResult=z.infer<typeof sdkResultSchema>;
