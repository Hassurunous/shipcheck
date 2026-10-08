import {z} from 'zod';
export const auditStageSchema=z.object({
  id:z.string(),label:z.string(),
  status:z.enum(['completed','partial','failed','blocked','preview','mock','injected','disabled','not-configured','not-requested','not-authorized','not-run','skipped']),
  explanation:z.string(),
  scope:z.enum(['repository','selected-paths','configured-paths','tool-defined']),
  files:z.array(z.string()).nullable(),
  selectedFiles:z.array(z.string()).default([]),
  omitted:z.array(z.object({path:z.string(),reason:z.string()})).default([]),
  limitations:z.array(z.string()).default([]),
});
export const auditSummarySchema=z.object({
  outcome:z.enum(['issues-reported','incomplete','no-issues-in-executed-checks','not-assessed']),
  generalQualityVerdict:z.literal('not-established'),
  conclusion:z.string(),stages:z.array(auditStageSchema),
});
export type AuditStage=z.infer<typeof auditStageSchema>;
export type AuditSummary=z.infer<typeof auditSummarySchema>;
