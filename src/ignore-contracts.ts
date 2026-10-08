import {z} from 'zod';
export const ignorePolicySchema=z.object({
  mode:z.enum(['gitignore','shipcheck','combined','built-in']),
  respectGitignore:z.boolean(),exclude:z.array(z.string()),
  builtIn:z.array(z.string()),gitSettings:z.literal('repository-gitignore-only'),
  sources:z.array(z.object({path:z.string(),sha256:z.string()})),
  skipped:z.array(z.object({path:z.string(),kind:z.enum(['file','directory','other']),reason:z.enum(['built-in','shipcheck','gitignore']),source:z.string().optional(),pattern:z.string().optional()})),
  skippedCount:z.number().int().nonnegative(),skippedTruncated:z.boolean(),
});
export type IgnorePolicyReport=z.infer<typeof ignorePolicySchema>;
