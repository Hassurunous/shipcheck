import {it,expect} from 'vitest';
import {readFile} from 'node:fs/promises';
import {effectivenessCaseSchema,scoreEffectiveness,reportHash,type EffectivenessCase,type EffectivenessLabel} from '../src/effectiveness.js';
import {reportSchema,type Report} from '../src/findings.js';
const fixture=effectivenessCaseSchema.parse({id:'case-one',category:'test',kind:'defect',description:'Known failure',files:{'main.js':'export const x=1;'},sourcePaths:['main.js'],config:{},tools:[],expectedBugs:[{id:'bug',description:'Mismatch',signals:['check:tests']}]});
const base=():Report=>reportSchema.parse({schemaVersion:1,root:'fixture',findings:[],inspectionWarnings:[]});
function failure(){return {...base(),checks:[{id:'tests',status:'failed' as const,exitCode:1,reason:'Assertion failure',output:'',scope:'whole-repository' as const}]};}
function ai():Report{return reportSchema.parse({...base(),ai:{execution:'live',status:'completed',mode:'low-cost',reviewer:'qa/reliability-v2',model:'fixture',plannedModel:'fixture',preview:{files:[{path:'main.js',bytes:17,lines:1,sha256:'fixture',freshness:'unchanged'}],skipped:[],serializedBytes:17,limited:false},maxOutputTokens:2000,requestBytes:20,estimatedInputTokens:5,estimatedCostUsd:null,actualCostUsd:null,retries:0,error:null,candidates:[{id:'candidate',title:'Issue',severity:'warning',explanation:'A defect',suggestedAction:'Fix',evidence:[{path:'main.js',startLine:1,endLine:1,excerpt:'export const x=1;'}],evidenceStatus:'unverified',origin:'ai',evidenceVerification:{status:'matched',checks:[]}}],coverage:{state:'complete',selectedPaths:['main.js'],validResponsePaths:['main.js'],failedResponsePaths:[],skippedPaths:[],matchedCandidates:1,rejectedCandidates:0,outOfScopeCandidates:0}}});}
const run=(report:Report,exitCode=0)=>({caseId:fixture.id,report,exitCode});
const label=(report:Report):EffectivenessLabel=>({caseId:fixture.id,reportHash:reportHash(report),claimId:'ai:0',verdict:'confirmed',bugId:'bug',rationale:'Manually compared claim with prescribed bug.'});
it('counts true misses even when an audit exits successfully',()=>{const s=scoreEffectiveness([fixture],[run(base())]);expect(s.detectedBugs).toBe(0);expect(s.missedBugs).toBe(1);expect(s.detectionFraction).toBe(0);});
it('separates operationally unresolved cases and missing runs from misses',()=>{for(const runs of [[],[run(base(),2)]]){const s=scoreEffectiveness([fixture],runs);expect(s.missedBugs).toBe(0);expect(s.unresolvedBugs).toBe(1);}});
it('counts only the expected signal, and deduplicates multiple confirmations of one bug',()=>{const r=failure();const s=scoreEffectiveness([fixture],[run(r,1)]);expect(s.detectedBugs).toBe(1);expect(s.missedBugs).toBe(0);expect(s.falsePositiveClaims).toBe(0);r.checks![0]!.id='unrelated';expect(scoreEffectiveness([fixture],[run(r,1)]).falsePositiveClaims).toBe(1);});
it('reports false-positive clean controls rather than treating them as successful detection',()=>{const clean={...fixture,kind:'clean' as const,expectedBugs:[]};const s=scoreEffectiveness([clean],[run(failure(),1)]);expect(s.cleanControls).toMatchObject({falsePositive:1,clear:0});});
it('never promotes matched citations without a fresh semantic label',()=>{const r=ai();expect(scoreEffectiveness([fixture],[run(r)],[],'live')).toMatchObject({detectedBugs:0,unassessedClaims:1,unresolvedBugs:1});expect(scoreEffectiveness([fixture],[run(r)],[label(r)],'live').detectedBugs).toBe(1);});
it('rejects stale/duplicate/unknown labels and unrecognized bug IDs',()=>{const r=ai();for(const labels of [[{...label(r),reportHash:'0'.repeat(64)}],[label(r),label(r)],[{...label(r),bugId:'wrong'}],[{...label(r),claimId:'ai:99'}]])expect(()=>scoreEffectiveness([fixture],[run(r)],labels,'live')).toThrow();});
it('rejected citations and synthetic execution cannot establish true positives',()=>{for(const change of ['citation','mock'] as const){const r=ai();if(change==='citation')r.ai!.candidates[0]!.evidenceVerification!.status='rejected';else r.ai!.execution='mock';const s=scoreEffectiveness([fixture],[run(r)],[label(r)],'live');expect(s.detectedBugs).toBe(0);expect(s.unresolvedBugs).toBe(1);}});
it('source omissions and stale snapshots keep a zero-candidate run incomplete',()=>{for(const change of ['missing','stale'] as const){const r=ai();r.ai!.candidates=[];if(change==='missing')r.ai!.coverage!.validResponsePaths=[];else r.ai!.preview.files[0]!.freshness='changed-or-unavailable';expect(scoreEffectiveness([fixture],[run(r)],[],'live').unresolvedBugs).toBe(1);}});
it('does not let non-source selection omissions erase real source coverage',()=>{const r=ai();r.ai!.candidates=[];r.ai!.coverage!.state='partial';r.ai!.preview.skipped=[{path:'shipcheck.config.json',reason:'unsupported-language'}];expect(scoreEffectiveness([fixture],[run(r)],[],'live').missedBugs).toBe(1);});
it('rejects duplicate/unknown runs and AI reports passed as an offline baseline',()=>{expect(()=>scoreEffectiveness([fixture],[run(base()),run(base())])).toThrow();expect(()=>scoreEffectiveness([fixture],[{...run(base()),caseId:'unknown'}])).toThrow();expect(()=>scoreEffectiveness([fixture],[run(ai())])).toThrow();});
it('validates the frozen corpus including defect, clean and incomplete controls',async()=>{const cases=(JSON.parse(await readFile(new URL('../fixtures/effectiveness/cases.json',import.meta.url),'utf8')) as unknown[]).map(c=>effectivenessCaseSchema.parse(c));expect(cases).toHaveLength(20);expect(cases.filter(c=>c.kind==='defect')).toHaveLength(9);expect(cases.filter(c=>c.oracle)).toHaveLength(6);expect(new Set(cases.map(c=>c.id)).size).toBe(20);expect(effectivenessCaseSchema.safeParse({...fixture,files:{'../escape':'x'}}).success).toBe(false);});

it('uses stage evidence as well as exits to identify unexecuted or failed required tools',()=>{
  const required={...fixture,tools:['node-test' as const]};
  expect(scoreEffectiveness([required],[run(base())]).unresolvedBugs).toBe(1);
  const report:Report=failure();report.checks![0]!.status='error';
  expect(scoreEffectiveness([required],[run(report,0)]).unresolvedBugs).toBe(1);
});
it('does not double-count a bug confirmed by both a check and an AI candidate',()=>{
  const report=ai();report.checks=failure().checks!;
  const result=scoreEffectiveness([fixture],[run(report,1)],[label(report)],'live');
  expect(result.detectedBugs).toBe(1);expect(result.falsePositiveClaims).toBe(0);
});
