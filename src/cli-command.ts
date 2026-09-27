import { formatStatus } from './index.js';
import { renderConsoleReport, renderJsonReport } from './reporters.js';
import { modeSchema } from './ai/contracts.js';
import { initializeTrial, trialStatus } from './ai/trial-budget.js';
import { initializeBudget, budgetStatus, budgetNameSchema, parseAllowanceUsd, settleBudgetAttempt } from './ai/audit-budget.js';
import { runWorkflow } from './workflows.js';
import { renderMarkdownReport } from './markdown-report.js';

const help = `Shipcheck v0.1

Usage: shipcheck <command> [target] [options]

Commands:
  audit [target]    Audit a repository using shipcheck.config.json (default: .)
  diff [target]     Review changed files versus HEAD, including untracked files
  task [task-file]  Review a task file, or currentTask in the current directory config
  trial init       Initialize the one-time $0.50 / three-mode trial (never resets)
  trial status     Show persistent trial reservations and usage
  budget init <name> --usd <amount> Create a persistent allowance (never resets)
  budget status <name> Show remaining reservations and recorded usage
  budget settle <name> <attempt> --charge-reservation Resolve a failure without refunding its reservation
  help [command]   Show help for audit, diff, task, trial, or budget
  --version        Show the version

Audit, diff, and task options:
  --json           Print the report as JSON
  --markdown       Print a Markdown report (exclusive with --json)
  --run-checks     Execute trusted configured checks (whole repository)
  --whole-repository Batch all eligible source for audit --ai preview/mock/live
  --ai preview     Preview bounded AI input metadata without sending anything
  --ai mock        Exercise the QA reviewer with a synthetic offline response
  --ai live --trial Run one approved trial attempt for the selected mode
  --ai live --budget <name> Use an existing allowance for live auditing
  --mode <mode>    low-cost (default), balanced, or high-quality
  -h, --help       Show help
  --               Treat remaining arguments as a target path

Local shortcuts:
  npm run audit -- .
  npm run audit -- . --json
  npm run shipcheck -- help

Exit codes: 0 completed, 1 error-level findings, 2 usage/configuration/inspection failure.
Warnings alone do not change the exit code. Live AI requires --trial or --budget and initialized allowance.
Mock candidates are synthetic and unverified, not diagnosed defects.
Running with no arguments or an explicit path (such as . or ./repo) retains the readiness smoke test.`;

export type CliResult = { stdout: string; stderr: string; exitCode: number };

export async function runCli(args: readonly string[]): Promise<CliResult> {
  const ok = (stdout: string): CliResult => ({ stdout, stderr: '', exitCode: 0 });
  const fail = (message: string): CliResult => ({ stdout: '', stderr: `Shipcheck: ${message}\nRun shipcheck help for usage.`, exitCode: 2 });
  const command = args[0];
  if(command==='budget') {
    try {
      const name=budgetNameSchema.parse(args[2]);
      if(args[1]==='init' && args.length===5 && args[3]==='--usd')await initializeBudget(name,parseAllowanceUsd(args[4]!));
      else if(args[1]==='settle' && args.length===5 && args[4]==='--charge-reservation')await settleBudgetAttempt(name,args[3]!);
      else if(args[1]!=='status' || args.length!==3)return fail('Use budget init <name> --usd <amount>, budget status <name>, or budget settle <name> <attempt> --charge-reservation.');
      return ok(JSON.stringify(await budgetStatus(name),null,2));
    } catch(error) {return fail(error instanceof Error?error.message:'Budget operation failed.');}
  }
  if (command === 'trial') {
    if (args.length !== 2 || !['init','status'].includes(args[1]!)) return fail('Use trial init or trial status.');
    try {
      if (args[1] === 'init') await initializeTrial();
      return ok(JSON.stringify(await trialStatus(),null,2));
    } catch (error) { return fail(error instanceof Error ? error.message : 'Trial state failed.'); }
  }
  if (command === 'help') {
    if (args.length > 2 || (args[1] && !['audit', 'diff', 'task', 'help', 'trial', 'budget'].includes(args[1]))) return fail('Unknown help topic.');
    return ok(help);
  }
  if (command === '--help' || command === '-h') return args.length === 1 ? ok(help) : fail('Unexpected arguments after help.');
  if (command === '--version' || command === '-v') return args.length === 1 ? ok('Shipcheck v0.1') : fail('Unexpected arguments after version.');
  if (command === 'review') return fail('The review command has been removed. Use shipcheck audit instead.');
  if (command !== 'audit' && command !== 'diff' && command !== 'task') {
    if (command === undefined) return ok(formatStatus());
    if (args.length === 1 && (command === '.' || command === '..' || /[\\/]/.test(command))) return ok(formatStatus(args));
    return fail(`Unknown command ${JSON.stringify(command)}.`);
  }
  let target: string | undefined;
  let json = false;
  let markdown = false;
  let literal = false;
  let wantsHelp = false;
  let ai: 'preview' | 'mock' | 'live' | undefined;
  let trial = false;
  let budget:string|undefined;
  let runChecks = false;
  let wholeRepository = false;
  let mode: string | undefined;
  for (let index = 1; index < args.length; index++) {
    const arg = args[index]!;
    if (!literal && arg === '--') { literal = true; continue; }
    if (!literal && (arg === '--help' || arg === '-h')) { wantsHelp = true; continue; }
    if (!literal && arg === '--json') { json = true; continue; }
    if (!literal && arg === '--markdown') { markdown = true; continue; }
    if (!literal && arg === '--trial') { trial = true; continue; }
    if (!literal && arg === '--budget') {
      const value=args[++index];
      if(!budgetNameSchema.safeParse(value).success)return fail('Budget name must be a lowercase letter followed by lowercase letters, digits or hyphens (up to 48 characters).');
      budget=value;continue;
    }
    if (!literal && arg === '--run-checks') { runChecks = true; continue; }
    if (!literal && arg === '--whole-repository') { wholeRepository = true; continue; }
    if (!literal && arg === '--ai') {
      const value = args[++index];
      if (value !== 'preview' && value !== 'mock' && value !== 'live') return fail('Use --ai preview, --ai mock, or --ai live with --budget/--trial.');
      ai = value; continue;
    }
    if (!literal && arg === '--mode') {
      const value = args[++index];
      if (!modeSchema.safeParse(value).success) return fail('Mode must be low-cost, balanced, or high-quality.');
      mode = value; continue;
    }
    if (!literal && arg.startsWith('-')) return fail(`Unknown option ${JSON.stringify(arg)}.`);
    if (target !== undefined) return fail('Expected at most one target directory.');
    target = arg;
  }
  if (wantsHelp) return ok(help);
  if (json && markdown) return fail('Choose --json or --markdown, not both.');
  if (mode && !ai) return fail('--mode requires --ai.');
  if (trial && budget) return fail('Choose --trial or --budget, not both.');
  if ((ai === 'live') !== Boolean(trial || budget)) return fail('Live AI requires --trial or --budget; spending authorization is only valid with --ai live.');
  try {
    const aiOptions = ai ? {execution:ai,trial,...(budget?{budget}:{}),...(mode ? {mode:modeSchema.parse(mode)} : {})} : undefined;
    const report = await runWorkflow(target ?? process.cwd(),command,aiOptions,{runChecks,wholeRepository,currentTask:command==='task' && target===undefined});
    const aiFailed = report.ai?.status === 'failed' || report.aiAudit?.state==='failed';
    const failedBatchIndex=report.aiAudit?.batches.findIndex(batch=>batch.status==='failed') ?? -1;
    const aiError=report.ai?.error ?? (failedBatchIndex>=0 ? report.aiAudit?.batches[failedBatchIndex]?.error : undefined);
    const errorCode=aiError?.code ?? report.aiAudit?.stoppedReason ?? 'unknown';
    const errorDetail=aiError?.message ? ` ${aiError.message.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g,' ')}` : '';
    const checkError=report.checks?.some(check=>check.status==='error');
    const referenceError=report.references?.state==='incomplete';
    const checkFailed=report.checks?.some(check=>check.status==='failed');
    return { stdout: json ? renderJsonReport(report) : markdown ? renderMarkdownReport(report) : renderConsoleReport(report),
      stderr: aiFailed ? `Shipcheck: AI stage failed (${errorCode})${failedBatchIndex>=0 ? ` in batch ${failedBatchIndex+1}` : ''}.${errorDetail} Deterministic results are retained.` : referenceError ? 'Shipcheck: Required reference resources could not be loaded; AI was not run. See reference statuses in the report.' : checkError ? 'Shipcheck: A configured check could not complete; see the report.' : '',
      exitCode: aiFailed || checkError || referenceError ? 2 : checkFailed || report.findings.some(f => f.severity === 'error') ? 1 : 0 };
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}
