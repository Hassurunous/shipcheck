import {expect,it} from 'vitest';
import {assessIntentPolicy,intentPolicySchema} from '../src/intent-policy.js';
const policy={requirements:[{id:'REQ1',text:'Requests must be authorized.'}],
  boundaries:[{id:'ARCH1',from:'src/domain',to:'src/ui',reason:'Domain must not depend on UI.'}]};
const edge={from:'src/domain/order.ts',to:'src/ui/view.ts',line:3,excerpt:'import { view } from "../ui/view.js";'};
it('reports observed forbidden dependency direction with evidence',()=>{
  const result=assessIntentPolicy(policy,[edge]);
  expect(result.boundaries[0]).toMatchObject({status:'potential-violation',evidence:[edge]});
  expect(result.coverage).toBe('supplied-observations-only');expect(result.evidenceVerification).toBe('caller-supplied-unverified');
});
it('does not confuse direction or sibling path prefixes',()=>{
  for(const observation of [{...edge,from:edge.to,to:edge.from},{...edge,from:'src/domain-extra/a.ts'}, {...edge,to:'src/ui-extra/a.ts'}])
    expect(assessIntentPolicy(policy,[observation]).boundaries[0]!.status).toBe('no-observed-violation');
});
it('leaves natural-language criteria unassessed even without observed violations',()=>{
  const result=assessIntentPolicy(policy);
  expect(result.requirements[0]!.status).toBe('insufficient-evidence');
  expect(result.boundaries[0]!.status).toBe('no-observed-violation');
});
it('hashes normalized policy content and deduplicates observations',()=>{
  const result=assessIntentPolicy(policy,[edge,edge]);expect(result.boundaries[0]!.evidence).toHaveLength(1);
  expect(result.policySha256).toBe(assessIntentPolicy(policy).policySha256);
  expect(result.policySha256).not.toBe(assessIntentPolicy({...policy,requirements:[{id:'REQ1',text:'Changed expectation.'}]}).policySha256);
});
it('rejects duplicate identifiers, invalid paths, oversized and unknown configuration',()=>{
  expect(intentPolicySchema.safeParse({...policy,boundaries:[{...policy.boundaries[0]!,id:'REQ1'}]}).success).toBe(false);
  for(const from of ['../src','/src','C:/src','src\\domain'])expect(intentPolicySchema.safeParse({boundaries:[{...policy.boundaries[0]!,from}]}).success).toBe(false);
  expect(intentPolicySchema.safeParse({requirements:[{id:'A',text:'x'.repeat(4001)}]}).success).toBe(false);
  expect(intentPolicySchema.safeParse({allowEdits:true}).success).toBe(false);
  expect(()=>assessIntentPolicy(policy,[{...edge,line:0}])).toThrow();
});
