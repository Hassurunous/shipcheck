import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { realpath, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { validateRoot } from './filesystem-policy.js';
import { reviewRepository } from './review-repository.js';
import { reviewWithAi, type AiReviewOptions } from './ai/review.js';
import { reportSchema, type Report } from './findings.js';
import { loadTask } from './task-file.js';
import { configSchema, loadConfig } from './config.js';
import { runChecks } from './checks.js';
import { reviewWholeRepository } from './ai/whole-repository.js';
import { inspectRepository } from './inspect-repository.js';
import { loadReferenceResources } from './reference-resources.js';

export type WorkflowOptions={runChecks?:boolean;wholeRepository?:boolean};

const exec = promisify(execFile);
async function git(root:string, args:string[]) {
  try { return (await exec('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',timeout:10000,maxBuffer:1024*1024,windowsHide:true})).stdout; }
  catch { throw new Error('Git inspection failed. Use a Git repository with a valid HEAD; Git must be installed.'); }
}
export async function changedPaths(target:string): Promise<string[]> {
  const root = await realpath(await validateRoot(target));
  const top = (await git(root,['rev-parse','--show-toplevel'])).trim();
  if (await realpath(top) !== root) throw new Error('Diff target must be the Git repository root.');
  const tracked = await git(root,['diff','--no-ext-diff','--no-textconv','--name-only','-z','HEAD','--']);
  const untracked = await git(root,['ls-files','--others','--exclude-standard','-z']);
  return [...new Set((tracked+untracked).split('\0').filter(Boolean))].sort();
}
export async function runWorkflow(target:string, kind:'audit'|'diff'|'task', ai?:AiReviewOptions, options:WorkflowOptions={}): Promise<Report> {
  if(options.wholeRepository && (kind!=='audit' || !ai)) throw new Error('--whole-repository requires audit with --ai.');
  const task = kind==='task' ? await loadTask(target) : undefined;
  if (task) target = task.repository;
  const paths = kind==='diff' ? await changedPaths(target) : task ? [...new Set(task.files)].sort() : undefined;
  if (kind==='diff' && paths?.length===0) return reportSchema.parse({schemaVersion:1,
    root:await realpath(await validateRoot(target)),findings:[],inspectionWarnings:[],
    workflow:{kind:'diff',scope:[],baseline:'HEAD',unavailablePaths:[]}});
  const unavailablePaths: string[] = [];
  for (const path of paths ?? []) {
    let current = target;
    try {
      for (const part of path.split('/')) {
        current = join(current,part);
        if ((await lstat(current)).isSymbolicLink()) throw new Error('link');
      }
      if (!(await lstat(current)).isFile()) throw new Error('not-file');
    } catch { unavailablePaths.push(path); }
  }
  if (task && unavailablePaths.length) throw new Error('Task selects missing, linked, or non-regular files. Correct the task file before review.');
  const config=ai?.config===undefined?await loadConfig(target):configSchema.parse(ai.config);
  const whole=kind==='audit' && (options.wholeRepository || config.ai.scope==='whole-repository');
  const references=config.resources.length?(await loadReferenceResources(target,config,paths)).report:undefined;
  const report = ai && paths?.length !== 0 && references?.state!=='incomplete' ? whole ? await reviewWholeRepository(target,{...ai,config})
    : await reviewWithAi(target,{...ai,...(paths ? {paths} : {})}) : await reviewRepository(target);
  const languages=options.runChecks && config.checks.some(check=>check.languages)
    ? Object.keys((await inspectRepository(report.root,{exclude:config.exclude})).languages):undefined;
  const checks=await runChecks(report.root,config.checks,options.runChecks===true,config.ai.apiKeyEnv,languages);
  const selected = new Set(paths);
  return reportSchema.parse({...report,
    ...(references?{references}:{}),
    ...(checks.length?{checks}:{}),
    findings:paths ? report.findings.filter(f=>f.evidence.some(e=>selected.has(e.path))) : report.findings,
    workflow:{kind,scope:paths ?? null,baseline:kind==='diff'?'HEAD':null,unavailablePaths,...(task ? {criteria:task.criteria} : {})},
  });
}
