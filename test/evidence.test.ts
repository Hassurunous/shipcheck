import { expect, it } from 'vitest';
import { verifyEvidence } from '../src/ai/verify-evidence.js';
import type { AiContext } from '../src/ai/context.js';
import type { QaOutput } from '../src/ai/contracts.js';

const context = (content = 'first\n  second\nthird'): AiContext => ({files:[{path:'src/a.ts',content}],preview:{files:[],skipped:[],serializedBytes:0,limited:false}});
const candidate = (overrides = {}): QaOutput['candidates'][number] => ({title:'Example',severity:'warning',explanation:'Test',suggestedAction:'Inspect',
  evidence:[{path:'src/a.ts',startLine:2,endLine:3,excerpt:'  second\nthird',...overrides}]});

it('matches exact full-line excerpts, normalizing line endings only',()=> {
  expect(verifyEvidence(candidate(),context(),context()).status).toBe('matched');
  const crlf = context('first\r\n  second\r\nthird');
  expect(verifyEvidence(candidate(),crlf,crlf).status).toBe('matched');
});
it.each([
  [{excerpt:'second\nthird'},'excerpt-mismatch'],
  [{excerpt:'second'},'excerpt-mismatch'],
  [{startLine:0},'invalid-line-range'],
  [{startLine:3,endLine:2},'invalid-line-range'],
  [{endLine:4},'invalid-line-range'],
  [{path:'../outside.ts'},'not-in-submitted-context'],
])('rejects incorrect citations without repairing model output', (overrides,reason)=> {
  const result = verifyEvidence(candidate(overrides),context(),context());
  expect(result.status).toBe('rejected'); expect(result.checks[0]!.reason).toBe(reason);
});
it('rejects stale files even if the cited lines still match',()=> {
  expect(verifyEvidence(candidate(),context(),context('changed\n  second\nthird')).checks[0]!.reason).toBe('source-changed');
});
it('rejects unavailable files and rejects a candidate if any citation fails',()=> {
  expect(verifyEvidence(candidate(),context(),{...context(),files:[]}).checks[0]!.reason).toBe('file-unavailable');
  const mixed = candidate(); mixed.evidence.push({...mixed.evidence[0]!,excerpt:'invented'});
  const result = verifyEvidence(mixed,context(),context());
  expect(result.status).toBe('rejected'); expect(result.checks.map(c=>c.status)).toEqual(['matched','rejected']);
});
