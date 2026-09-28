import {z} from 'zod';
import {resourceDefinitionSchema} from './resource-contracts.js';
export const contractBindingSchema=z.object({id:z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  resourceId:z.string().min(1).max(64),files:z.array(resourceDefinitionSchema.shape.path).min(1).max(32),
  baseUrl:z.string().max(2048).refine(value=>{try{const url=new URL(value);return ['https:','http:'].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;}catch{return false;}},'Use an HTTP(S) service base URL without credentials, query or fragment.'),
  expectedVersion:z.string().min(1).max(128).optional(),
}).strict();
export type ContractBinding=z.infer<typeof contractBindingSchema>;
export const contractResultSchema=z.object({id:z.string(),resourceId:z.string(),
  state:z.enum(['checked','partial','unavailable','version-mismatch']),
  reference:z.object({path:z.string(),sha256:z.string().nullable(),apiVersion:z.string().optional()}).optional(),
  issues:z.array(z.string()),scope:z.enum(['literal-javascript-fetch-only','literal-http-calls-only']),
  files:z.array(z.object({path:z.string(),sha256:z.string().nullable(),status:z.string(),
    adapter:z.string().optional(),language:z.string().optional(),callCount:z.number().int().nonnegative().optional()})),
  calls:z.array(z.object({path:z.string(),line:z.number().int().positive(),excerpt:z.string(),
    observationKind:z.enum(['request-call','request-construction']).optional(),
    status:z.enum(['matched','mismatch','unresolved','outside-service']),reason:z.string(),
    method:z.string().optional(),url:z.string().optional(),adapter:z.string().optional(),queryNames:z.array(z.string()).optional(),contractPointers:z.array(z.string())})),
});
export type ContractResult=z.infer<typeof contractResultSchema>;
