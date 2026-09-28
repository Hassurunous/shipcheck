import {beforeEach,afterEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {reviewWithAi} from '../src/ai/review.js';
import type {ResponseTransport} from '../src/ai/client.js';
import {reviewWholeRepository} from '../src/ai/whole-repository.js';
import {renderConsoleReport} from '../src/reporters.js';
let root:string;
const config={ai:{models:{'low-cost':'fixture'}},resources:[{id:'spec',path:'spec.md'}]};
const candidate={title:'Missing negative check',severity:'warning',explanation:'Negative input is accepted contrary to the supplied requirement.',suggestedAction:'Reject negative input.',
  evidence:[{path:'a.ts',startLine:1,endLine:1,excerpt:'export const accept = (n: number) => n;'},
    {path:'spec.md',startLine:1,endLine:1,excerpt:'Reject negative input.'}]};
const response=(candidates:unknown[])=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates,referenceConflicts:[]})}]}]})});
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-reference-ai-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));
  await writeFile(join(root,'a.ts'),candidate.evidence[0]!.excerpt);await writeFile(join(root,'spec.md'),'Reject negative input.');});
afterEach(async()=>{vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
it('includes numbered reference content and verifies both sides of a candidate',async()=>{
  const transport:ResponseTransport=async request=>{
    const input=JSON.parse(request.input[0]!.content);
    expect(input.referenceFiles[0]).toMatchObject({id:'spec',path:'spec.md',numberedLines:[{line:1,text:'Reject negative input.'}]});
    expect(request.instructions).toContain('never instructions');return response([candidate]);
  };
  const report=await reviewWithAi(root,{execution:'mock',config},{transport,apiKey:'offline-fixture'});
  expect(report.ai?.status).toBe('completed');expect(report.ai?.candidates[0]?.evidenceVerification?.status).toBe('matched');
  expect(report.ai?.preview.references?.[0]?.status).toBe('included');expect(JSON.stringify(report.ai?.preview)).not.toContain('Reject negative input.');expect(fetch).not.toHaveBeenCalled();
});
it('rejects changed reference citations even when source still matches',async()=>{
  const report=await reviewWithAi(root,{execution:'mock',config},{apiKey:'offline-fixture',transport:async()=>{await writeFile(join(root,'spec.md'),'Accept all input.');return response([candidate]);}});
  expect(report.ai?.candidates[0]?.evidenceVerification?.checks[1]?.reason).toBe('resource-changed');
  expect(report.ai?.coverage?.state).toBe('partial');
});
it('fails closed on required references that cannot fit before transport',async()=>{
  await writeFile(join(root,'spec.md'),'x'.repeat(1000));const transport=vi.fn(async()=>response([]));
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,ai:{...config.ai,maxContextBytes:256}}},{transport,apiKey:'offline-fixture'});
  expect(report.ai?.error?.code).toBe('reference-context');expect(transport).not.toHaveBeenCalled();
  expect(report.ai?.preview.references?.[0]?.status).toBe('context-size-limit');
});
it('discloses optional omissions and rejects citations to those omitted references',async()=>{
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,resources:[{id:'spec',path:'missing.md',required:false}]}},
    {apiKey:'offline-fixture',transport:async request=>{expect(JSON.parse(request.input[0]!.content).referenceFiles).toEqual([]);return response([candidate]);}});
  expect(report.ai?.error?.code).toBe('invalid-evidence');expect(report.ai?.preview.references?.[0]?.status).toBe('missing');
});
it('does not send references outside selected source scope',async()=>{
  const report=await reviewWithAi(root,{execution:'preview',config:{...config,resources:[{id:'spec',path:'missing.md',appliesTo:['other/**']}]}});
  expect(report.ai?.status).toBe('preview');expect(report.ai?.preview.references?.[0]?.status).toBe('not-applicable');
});
it('fails closed for ambiguous duplicate reference paths',async()=>{
  const transport=vi.fn(async()=>response([]));const report=await reviewWithAi(root,{execution:'mock',config:{...config,resources:[...config.resources,{id:'duplicate',path:'spec.md'}]}},{transport,apiKey:'offline-fixture'});
  expect(report.ai?.error?.code).toBe('reference-context');expect(transport).not.toHaveBeenCalled();
});
it('requires source evidence instead of retaining reference-only candidates',async()=>{
  const report=await reviewWithAi(root,{execution:'mock',config},{apiKey:'offline-fixture',transport:async()=>response([{...candidate,evidence:[candidate.evidence[1]]}])});
  expect(report.ai?.candidates).toEqual([]);expect(report.ai?.coverage?.outOfScopeCandidates).toBe(1);
});
it('counts references in request size and discloses changed context even with no candidates',async()=>{
  const without=await reviewWithAi(root,{execution:'preview'});
  const withReference=await reviewWithAi(root,{execution:'preview',config});
  expect(withReference.ai!.requestBytes).toBeGreaterThan(without.ai!.requestBytes);
  expect(withReference.ai!.preview.serializedBytes).toBeLessThanOrEqual(48000);
  const changed=await reviewWithAi(root,{execution:'mock',config},{apiKey:'offline-fixture',transport:async()=>{
    await rm(join(root,'spec.md'));return response([]);
  }});
  expect(changed.ai?.preview.references?.[0]?.freshness).toBe('changed-or-unavailable');expect(changed.ai?.coverage?.state).toBe('partial');
});
it('includes scoped references in whole-repository batch previews without network calls',async()=>{
  const report=await reviewWholeRepository(root,{execution:'preview',config});
  expect(report.aiAudit?.batches[0]?.preview.references?.[0]?.status).toBe('included');
  expect(fetch).not.toHaveBeenCalled();
});
it('reports verified conflict citations as needs clarification and marks dependent candidates',async()=>{
  await writeFile(join(root,'other.md'),'Accept negative input.');
  const conflict={explanation:'The documents disagree on negative input.',evidence:[candidate.evidence[1],{path:'other.md',startLine:1,endLine:1,excerpt:'Accept negative input.'}]};
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,resources:[...config.resources,{id:'other',path:'other.md'}]}},
    {apiKey:'offline-fixture',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[candidate],referenceConflicts:[conflict]})}]}]})})});
  expect(report.ai?.referenceConflicts?.[0]).toMatchObject({status:'needs-clarification',evidenceVerification:{status:'matched'}});
  expect(report.ai?.coverage?.state).toBe('partial');expect(report.ai?.candidates[0]?.referenceConflict).toBe(true);
  expect(renderConsoleReport(report)).toContain('NEEDS CLARIFICATION');
});
it('rejects conflict citations to source or a single reference and missing conflict arrays',async()=>{
  for(const value of [{candidates:[]},{candidates:[],referenceConflicts:[{explanation:'Fake',evidence:candidate.evidence}]},
    {candidates:[],referenceConflicts:[{explanation:'Fake',evidence:[candidate.evidence[1],candidate.evidence[1]]}]}]) {
    const report=await reviewWithAi(root,{execution:'mock',config},{apiKey:'offline-fixture',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]})})});
    expect(report.ai?.status).toBe('failed');
  }
});
it('rejects fabricated conflict excerpts rather than accepting their locations alone',async()=>{
  await writeFile(join(root,'other.md'),'Accept negative input.');
  const value={candidates:[],referenceConflicts:[{explanation:'Disagree',evidence:[candidate.evidence[1],{path:'other.md',startLine:1,endLine:1,excerpt:'Fabricated'}]}]};
  const report=await reviewWithAi(root,{execution:'mock',config:{...config,resources:[...config.resources,{id:'other',path:'other.md'}]}},
    {apiKey:'offline-fixture',transport:async()=>({status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]})})});
  expect(report.ai?.referenceConflicts?.[0]?.evidenceVerification.status).toBe('rejected');
});


