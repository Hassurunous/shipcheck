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
it.each([{startLine:0},{startLine:3,endLine:2},{endLine:999},{startLine:-5,endLine:0.5},
  {excerpt:'second'}, {excerpt:'second\nthird'}])('matches quotations regardless of line metadata or full-line boundaries',overrides=> {
  expect(verifyEvidence(candidate(overrides),context(),context()).status).toBe('matched');
});
it.each([{excerpt:'invented'},{excerpt:'second\nchanged'},{excerpt:''},{excerpt:'  '}])('rejects absent or empty quotations',overrides=> {
  expect(verifyEvidence(candidate(overrides),context(),context()).checks[0]!.reason).toBe('excerpt-mismatch');
});
it('accepts repeated quotations without requiring a unique location',()=> {
  expect(verifyEvidence(candidate({excerpt:'second'}),context('second second'),context('second second')).status).toBe('matched');
});
it('rejects citations to files outside submitted context',()=> {
  expect(verifyEvidence(candidate({path:'../outside.ts'}),context(),context()).checks[0]!.reason).toBe('not-in-submitted-context');
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
