import type { AiContext } from './context.js';
import type { QaOutput } from './contracts.js';
import {verifyResourceEvidence} from '../reference-resources.js';

export type EvidenceCheck = {path:string; status:'matched' | 'rejected'; reason:string};
export type EvidenceVerification = {status:'matched' | 'rejected'; checks:EvidenceCheck[]};
const lines = (value:string) => value.split(/\r\n|\n|\r/);

/** Checks citations only. Matching source does not prove a candidate's diagnosis. */
export function verifyEvidence(candidate: Pick<QaOutput['candidates'][number],'evidence'>, submitted: AiContext,
  current: AiContext): EvidenceVerification {
  const checks: EvidenceCheck[] = candidate.evidence.map(evidence=> {
    const reference=submitted.references?.find(item=>item.record.path===evidence.path);
    if(reference) {
      const check=verifyResourceEvidence({resourceId:reference.record.id,snapshotSha256:reference.record.sha256!,
        startLine:evidence.startLine,endLine:evidence.endLine,excerpt:evidence.excerpt},submitted.references ?? [],current.references ?? []);
      return {path:evidence.path,...check};
    }
    const original = submitted.files.find(file=>file.path===evidence.path);
    const fresh = current.files.find(file=>file.path===evidence.path);
    let reason = 'exact-line-match';
    if (!original) reason = 'not-in-submitted-context';
    else if (!fresh) reason = 'file-unavailable';
    else if (fresh.content !== original.content) reason = 'source-changed';
    else {
      const sourceLines = lines(fresh.content);
      if (!Number.isInteger(evidence.startLine) || !Number.isInteger(evidence.endLine)
        || evidence.startLine < 1 || evidence.endLine < evidence.startLine || evidence.endLine > sourceLines.length) reason = 'invalid-line-range';
      else if (sourceLines.slice(evidence.startLine-1,evidence.endLine).join('\n') !== lines(evidence.excerpt).join('\n')) reason = 'excerpt-mismatch';
    }
    return {path:evidence.path,status:reason==='exact-line-match'?'matched':'rejected',reason};
  });
  return {status:checks.length > 0 && checks.every(check=>check.status==='matched')?'matched':'rejected',checks};
}
