import type {z} from 'zod';
import type {executionClaimSchema,executionVerificationSchema} from './contracts.js';
import type {AnalysisContext} from './analysis-context.js';

/** Checks only explicit structured premises against exactly the submitted observations. */
export function verifyExecutionClaims(claims:z.infer<typeof executionClaimSchema>[] | undefined,
  context:AnalysisContext | undefined):z.infer<typeof executionVerificationSchema> {
  const checks=(claims ?? []).map(claim=>{
    const unknown={claim,status:'unknown' as const,reason:'No sufficient submitted observation supports or contradicts this premise.'};
    const records=context?.records.filter(record=>record.stage==='checks') ?? [];
    const executions=records.filter(record=>record.kind==='execution').map(record=>record.data as Record<string,unknown>)
      .filter(record=>record.id===claim.checkId);
    if(executions.length!==1)return unknown;
    if(claim.claim==='path-observed' || claim.claim==='path-not-observed') {
      if(!claim.path)return unknown;
      const observed=records.some(record=>record.kind==='diagnostic' &&
        (record.data as Record<string,unknown>).checkId===claim.checkId &&
        (record.data as Record<string,unknown>).path===claim.path);
      if(!observed)return unknown; // No diagnostic never proves exclusion or a clean file.
      return {claim,status:claim.claim==='path-observed'?'supported' as const:'contradicted' as const,
        reason:'A submitted diagnostic names this exact path in the captured run; current-source freshness is not established.'};
    }
    if(claim.path!==null)return unknown;
    const status=executions[0]!.status;
    if(!['passed','failed','error','skipped'].includes(String(status)))return unknown;
    return {claim,status:status===claim.claim?'supported' as const:'contradicted' as const,
      reason:`Captured check status is ${status}; this does not establish code correctness or current-source freshness.`};
  });
  return {scope:'captured-check-observations-only',checks,status:checks.length===0?'not-claimed':
    checks.some(check=>check.status==='contradicted')?'contradicted':checks.some(check=>check.status==='unknown')?'unknown':'supported'};
}
