import { z } from 'zod';

export const modeSchema = z.enum(['low-cost', 'balanced', 'high-quality']);
export type AiMode = z.infer<typeof modeSchema>;
export const aiSettingsSchema = z.object({
  mode: modeSchema.default('low-cost'),
  models: z.object({
    'low-cost': z.string().min(1).max(100).nullable().default(null),
    balanced: z.string().min(1).max(100).nullable().default(null),
    'high-quality': z.string().min(1).max(100).nullable().default(null),
  }).strict().default({'low-cost': null, balanced: null, 'high-quality': null}),
  maxFiles: z.number().int().min(1).max(64).default(12),
  maxFileBytes: z.number().int().min(128).max(65536).default(16000),
  maxContextBytes: z.number().int().min(256).max(262144).default(48000),
  maxOutputTokens: z.number().int().min(128).max(4096).default(1000),
  timeoutMs: z.number().int().min(10).max(60000).default(10000),
}).strict();
export type AiSettings = z.infer<typeof aiSettingsSchema>;

const evidenceSchema = z.object({
  path: z.string().min(1).max(512).refine(path => !/[:\\\u0000-\u001f]/.test(path)
    && path.split('/').every(part => part !== '' && part !== '.' && part !== '..'), 'Expected a relative source path.'),
  startLine: z.number().int().positive(),
  endLine: z.number().int().positive(),
  excerpt: z.string().min(1).max(4000),
}).strict();
export const candidateSchema = z.object({
  title: z.string().min(1).max(200),
  severity: z.enum(['error', 'warning', 'info']),
  explanation: z.string().min(1).max(4000),
  suggestedAction: z.string().min(1).max(2000),
  evidence: z.array(evidenceSchema).min(1).max(5),
}).strict();
export const qaOutputSchema = z.object({ candidates: z.array(candidateSchema).max(20) }).strict();
export type QaOutput = z.infer<typeof qaOutputSchema>;

export const contextPreviewSchema = z.object({
  files: z.array(z.object({path: z.string(), bytes: z.number().int(), lines: z.number().int(), sha256: z.string()})),
  skipped: z.array(z.object({path: z.string(), reason: z.string()})),
  serializedBytes: z.number().int().nonnegative(),
  limited: z.boolean(),
  requestedPaths:z.array(z.string()).optional(),
  supportingPaths:z.array(z.string()).optional(),
  dependencies:z.array(z.object({from:z.string(),specifier:z.string(),path:z.string().nullable(),
    status:z.enum(['included','unresolved','omitted'])})).optional(),
});
export const aiResultSchema = z.object({
  execution: z.enum(['preview', 'mock', 'injected', 'live']),
  status: z.enum(['preview', 'completed', 'failed']),
  mode: modeSchema,
  reviewer: z.enum(['qa/reliability-v1','qa/reliability-v2']),
  model: z.string().nullable(),
  plannedModel: z.string().nullable(),
  preview: contextPreviewSchema,
  maxOutputTokens: z.number().int(),
  requestBytes: z.number().int().nonnegative(),
  estimatedInputTokens: z.number().int().nonnegative(),
  estimatedCostUsd: z.null(),
  actualCostUsd: z.number().nullable(),
  retries: z.literal(0),
  trial: z.object({countedInputTokens:z.number().int(), reservedUsd:z.number(), pricedUsageUpperBoundUsd:z.number(),
    usage:z.object({input_tokens:z.number().int(),output_tokens:z.number().int()})}).optional(),
  candidates: z.array(candidateSchema.extend({
    id: z.string(), evidenceStatus: z.literal('unverified'), origin: z.literal('ai'),
    evidenceVerification: z.object({status:z.enum(['matched','rejected']),checks:z.array(z.object({
      path:z.string(),status:z.enum(['matched','rejected']),reason:z.string(),
    }))}).optional(),
  })).max(20),
  error: z.object({code: z.string(), message: z.string()}).nullable(),
  coverage:z.object({state:z.enum(['preview','complete','partial','failed']),selectedPaths:z.array(z.string()),
    validResponsePaths:z.array(z.string()),failedResponsePaths:z.array(z.string()),
    skippedPaths:z.array(z.string()),matchedCandidates:z.number().int(),rejectedCandidates:z.number().int(),
    outOfScopeCandidates:z.number().int()}).optional(),
});
export type AiResult = z.infer<typeof aiResultSchema>;
