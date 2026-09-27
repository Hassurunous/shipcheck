import { formatStatus } from './index.js';
import { renderConsoleReport, renderJsonReport } from './reporters.js';
import { modeSchema } from './ai/contracts.js';
import { initializeTrial, trialStatus } from './ai/trial-budget.js';
import { runWorkflow } from './workflows.js';
import { renderMarkdownReport } from './markdown-report.js';

const help = `Shipcheck v0.1

Usage: shipcheck <command> [target] [options]

Commands:
  audit [target]    Audit a repository using shipcheck.config.json (default: .)
  diff [target]     Review changed files versus HEAD, including untracked files
  task <task-file>  Review files selected by a structured JSON task
  trial init       Initialize the one-time $0.50 / three-mode trial (never resets)
  trial status     Show persistent trial reservations and usage
  help [command]   Show help for audit, diff, task, or trial
  --version        Show the version

Audit, diff, and task options:
  --json           Print the report as JSON
  --markdown       Print a Markdown report (exclusive with --json)
  --ai preview     Preview bounded AI input metadata without sending anything
  --ai mock        Exercise the QA reviewer with a synthetic offline response
  --ai live --trial Run one approved trial attempt for the selected mode
  --mode <mode>    low-cost (default), balanced, or high-quality
  -h, --help       Show help
  --               Treat remaining arguments as a target path

Local shortcuts:
  npm run audit -- .
  npm run audit -- . --json
  npm run shipcheck -- help

Exit codes: 0 completed, 1 error-level findings, 2 usage/configuration/inspection failure.
Warnings alone do not change the exit code. Live AI requires --trial and initialized allowance.
Mock candidates are synthetic and unverified, not diagnosed defects.
Running with no arguments or an explicit path (such as . or ./repo) retains the readiness smoke test.`;

export type CliResult = { stdout: string; stderr: string; exitCode: number };

export async function runCli(args: readonly string[]): Promise<CliResult> {
  const ok = (stdout: string): CliResult => ({ stdout, stderr: '', exitCode: 0 });
  const fail = (message: string): CliResult => ({ stdout: '', stderr: `Shipcheck: ${message}\nRun shipcheck help for usage.`, exitCode: 2 });
  const command = args[0];
  if (command === 'trial') {
    if (args.length !== 2 || !['init','status'].includes(args[1]!)) return fail('Use trial init or trial status.');
    try {
      if (args[1] === 'init') await initializeTrial();
      return ok(JSON.stringify(await trialStatus(),null,2));
    } catch (error) { return fail(error instanceof Error ? error.message : 'Trial state failed.'); }
  }
  if (command === 'help') {
    if (args.length > 2 || (args[1] && !['audit', 'diff', 'task', 'help', 'trial'].includes(args[1]))) return fail('Unknown help topic.');
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
  let mode: string | undefined;
  for (let index = 1; index < args.length; index++) {
    const arg = args[index]!;
    if (!literal && arg === '--') { literal = true; continue; }
    if (!literal && (arg === '--help' || arg === '-h')) { wantsHelp = true; continue; }
    if (!literal && arg === '--json') { json = true; continue; }
    if (!literal && arg === '--markdown') { markdown = true; continue; }
    if (!literal && arg === '--trial') { trial = true; continue; }
    if (!literal && arg === '--ai') {
      const value = args[++index];
      if (value !== 'preview' && value !== 'mock' && value !== 'live') return fail('Use --ai preview, --ai mock, or --ai live --trial.');
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
  if (command==='task' && !target) return fail('task requires a JSON task file.');
  if (mode && !ai) return fail('--mode requires --ai.');
  if ((ai === 'live') !== trial) return fail('Live AI requires --trial; --trial is only valid with --ai live.');
  try {
    const aiOptions = ai ? {execution:ai,trial,...(mode ? {mode:modeSchema.parse(mode)} : {})} : undefined;
    const report = await runWorkflow(target ?? '.',command,aiOptions);
    const aiFailed = report.ai?.status === 'failed';
    return { stdout: json ? renderJsonReport(report) : markdown ? renderMarkdownReport(report) : renderConsoleReport(report),
      stderr: aiFailed ? `Shipcheck: AI stage failed (${report.ai?.error?.code}); deterministic results are retained.` : '',
      exitCode: aiFailed ? 2 : report.findings.some(f => f.severity === 'error') ? 1 : 0 };
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}
