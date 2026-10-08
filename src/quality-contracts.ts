import {z} from 'zod';
export const qualitySlotSchema=z.enum(['eslint','typescript','ruff']);
export const qualitySchema=z.object({
  presets:z.array(z.enum(['javascript','typescript','python'])).min(1).max(3)
    .refine(values=>new Set(values).size===values.length,'Quality presets must be unique.'),
  bindings:z.partialRecord(qualitySlotSchema,z.union([z.string().min(1),z.literal(false)])).default({}),
}).strict();
export const qualityReportSchema=z.object({
  presets:z.array(z.string()),
  tools:z.array(z.object({
    slot:qualitySlotSchema,checkId:z.string(),purpose:z.enum(['lint','typecheck']),
    source:z.enum(['project-local','configured']),
    status:z.enum(['ready','unavailable','disabled','not-applicable']),
    reason:z.string(),command:z.string().optional(),args:z.array(z.string()).optional(),
  })),
  gaps:z.array(z.string()),limitations:z.array(z.string()),
});
export type QualityReport=z.infer<typeof qualityReportSchema>;
