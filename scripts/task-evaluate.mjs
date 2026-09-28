import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {runCli} from '../dist/src/cli-command.js';
import {budgetStatus} from '../dist/src/ai/audit-budget.js';

const cases=JSON.parse(await readFile(new URL('../fixtures/task-evaluation/cases.json',import.meta.url),'utf8'));
const [mode,budget,outputDirectory,...extra]=process.argv.slice(2);
if(mode!=='--live' || !budget || !outputDirectory || extra.length) {
  console.error('Usage: node scripts/task-evaluate.mjs --live <existing-budget> <new-output-directory>');process.exitCode=2;
} else {
  await budgetStatus(budget);const output=resolve(outputDirectory);await mkdir(output);
  for(const fixture of cases) {
    const root=await mkdtemp(join(tmpdir(),'shipcheck-task-eval-'));const before=process.cwd();
    try {
      await writeFile(join(root,'fee.ts'),fixture.source);
      const configuration=JSON.stringify({currentTask:{id:fixture.id,title:'Fee task',description:'Assess only the stated expectations.',files:['fee.ts'],
        requirements:fixture.requirements,nonGoals:['No unrelated changes.']},ai:{maxOutputTokens:2000,timeoutMs:60000}});
      await writeFile(join(root,'shipcheck.config.json'),configuration);
      process.chdir(root);
      const result=await runCli(['task','--ai','live','--budget',budget,'--json']);
      const report=result.stdout?JSON.parse(result.stdout):null;
      const unchanged=(await readFile(join(root,'fee.ts'),'utf8'))===fixture.source && (await readFile(join(root,'shipcheck.config.json'),'utf8'))===configuration;
      await writeFile(join(output,`${fixture.id}.json`),JSON.stringify({caseId:fixture.id,unchanged,...result,report},null,2),{flag:'wx'});
      console.log(JSON.stringify({caseId:fixture.id,unchanged,status:report?.ai?.status,error:report?.ai?.error,
        assessments:report?.ai?.taskReview?.assessments.map(item=>({id:item.requirementId,status:item.status})),budget:report?.ai?.budget}));
      if(result.exitCode===2 || !unchanged){process.exitCode=2;break;}
    } finally {process.chdir(before);await rm(root,{recursive:true,force:true});}
  }
  const status=await budgetStatus(budget);await writeFile(join(output,'budget.json'),JSON.stringify(status,null,2),{flag:'wx'});
  console.log(JSON.stringify({reservedUsd:status.reservedUsd,pricedUsageUpperBoundUsd:status.pricedUsageUpperBoundUsd,unresolved:status.unresolved}));
}
