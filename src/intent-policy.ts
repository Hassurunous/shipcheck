import {createHash} from 'node:crypto';
import {z} from 'zod';

const id=z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);
const path=z.string().min(1).max(512).refine(value=>!/[\\:\u0000-\u001f]/.test(value)
  && value.split('/').every(part=>part!=='' && part!=='.' && part!=='..'),'Expected a repository-relative slash-separated path.');
export const intentPolicySchema=z.object({
  requirements:z.array(z.object({id,text:z.string().trim().min(1).max(4000),
    resourceIds:z.array(id).max(32).default([])}).strict()).max(100).default([]),
  boundaries:z.array(z.object({id,from:path,to:path,
    reason:z.string().trim().min(1).max(1000)}).strict()).max(100).default([]),
}).strict().superRefine((value,ctx)=>{
  const ids=[...value.requirements,...value.boundaries].map(item=>item.id);
  if(new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Policy IDs must be unique across requirements and boundaries.'});
});
export const dependencyObservationSchema=z.object({
  from:path,to:path,line:z.number().int().positive(),excerpt:z.string().min(1).max(8000),
}).strict();
const within=(file:string,prefix:string)=>file===prefix || file.startsWith(`${prefix}/`);

/** Evaluate supplied dependency observations; does not inspect code or infer intent. */
export function assessIntentPolicy(input:z.input<typeof intentPolicySchema>,
  observations:z.input<typeof dependencyObservationSchema>[]=[]) {
  const policy=intentPolicySchema.parse(input);
  const edges=z.array(dependencyObservationSchema).max(10000).parse(observations);
  const policySha256=createHash('sha256').update(JSON.stringify(policy)).digest('hex');
  return {
    policySha256,
    requirements:policy.requirements.map(requirement=>({id:requirement.id,text:requirement.text,
      resourceIds:requirement.resourceIds,status:'insufficient-evidence' as const,
      reason:'Natural-language requirements have not been assessed.'})),
    boundaries:policy.boundaries.map(boundary=>{
      const evidence=[...new Map(edges.filter(edge=>within(edge.from,boundary.from) && within(edge.to,boundary.to))
        .map(edge=>[JSON.stringify(edge),edge])).values()].sort((a,b)=>a.from.localeCompare(b.from) || a.line-b.line || a.to.localeCompare(b.to));
      return {id:boundary.id,from:boundary.from,to:boundary.to,reason:boundary.reason,
        status:evidence.length?'potential-violation' as const:'no-observed-violation' as const,evidence};
    }),
    coverage:'supplied-observations-only' as const,
    evidenceVerification:'caller-supplied-unverified' as const,
  };
}
