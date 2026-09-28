import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {runCli} from '../dist/src/cli-command.js';
import {budgetStatus} from '../dist/src/ai/audit-budget.js';

// Paid execution is explicit, uses the product CLI and an existing durable budget.
// Output paths must be new. No automatic retries or budget initialization.
const cases=JSON.parse(await readFile(new URL('../fixtures/reference-evaluation/cases.json',import.meta.url),'utf8'));
const [mode,budget,outputDirectory,...extra]=process.argv.slice(2);
if(mode!=='--live' || !budget || !outputDirectory || extra.length) {
  console.error('Usage: node scripts/reference-evaluate.mjs --live <existing-budget> <new-output-directory>');
  process.exitCode=2;
} else {
  const output=resolve(outputDirectory);
  await budgetStatus(budget);
  await mkdir(output); // Refuse to overwrite prior evidence.
  for(const fixture of cases) {
    const root=await mkdtemp(join(tmpdir(),'shipcheck-p12-eval-'));
    try {
      for(const [path,content] of Object.entries(fixture.files))await writeFile(join(root,path),content);
      for(const resource of fixture.references)await writeFile(join(root,resource.path),resource.content);
      await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({resources:fixture.references.map(({id,path})=>({id,path,authority:'authoritative'})),
        ai:{mode:'low-cost',maxOutputTokens:2000,timeoutMs:60000}}));
      const started=Date.now();
      const result=await runCli(['audit',root,'--ai','live','--budget',budget,'--json']);
      const report=result.stdout?JSON.parse(result.stdout):null;
      await writeFile(join(output,`${fixture.id}.json`),JSON.stringify({caseId:fixture.id,elapsedMs:Date.now()-started,...result,report},null,2),{flag:'wx'});
      console.log(JSON.stringify({caseId:fixture.id,exitCode:result.exitCode,status:report?.ai?.status,
        candidates:report?.ai?.candidates.length,conflicts:report?.ai?.referenceConflicts?.length,error:report?.ai?.error,
        budget:report?.ai?.budget}));
      if(result.exitCode===2){process.exitCode=2;break;}
    } finally {await rm(root,{recursive:true,force:true});}
  }
  const status=await budgetStatus(budget);
  await writeFile(join(output,'budget.json'),JSON.stringify(status,null,2),{flag:'wx'});
  console.log(JSON.stringify({reservedUsd:status.reservedUsd,pricedUsageUpperBoundUsd:status.pricedUsageUpperBoundUsd,unresolved:status.unresolved}));
}
