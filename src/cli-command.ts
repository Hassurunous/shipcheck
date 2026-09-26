import { formatStatus } from './index.js';
import { reviewRepository } from './review-repository.js';
import { renderConsoleReport, renderJsonReport } from './reporters.js';

const help = `Shipcheck v0.1

Usage: shipcheck <command> [target] [options]

Commands:
  review [target]   Review a repository using shipcheck.config.json (default: .)
  help [command]   Show this help or help for review
  --version        Show the version

Review options:
  --json           Print the report as JSON
  -h, --help       Show help
  --               Treat remaining arguments as a target path

Local shortcuts:
  npm run review -- .
  npm run review -- . --json
  npm run shipcheck -- help

Exit codes: 0 completed, 1 error-level findings, 2 usage/configuration/inspection failure.
Warnings alone do not change the exit code. No AI review or script execution.
Running with no arguments or an explicit path (such as . or ./repo) retains the readiness smoke test.`;

export type CliResult = { stdout: string; stderr: string; exitCode: number };

export async function runCli(args: readonly string[]): Promise<CliResult> {
  const ok = (stdout: string): CliResult => ({ stdout, stderr: '', exitCode: 0 });
  const fail = (message: string): CliResult => ({ stdout: '', stderr: `Shipcheck: ${message}\nRun shipcheck help for usage.`, exitCode: 2 });
  const command = args[0];
  if (command === 'help') {
    if (args.length > 2 || (args[1] && !['review', 'help'].includes(args[1]))) return fail('Unknown help topic.');
    return ok(help);
  }
  if (command === '--help' || command === '-h') return args.length === 1 ? ok(help) : fail('Unexpected arguments after help.');
  if (command === '--version' || command === '-v') return args.length === 1 ? ok('Shipcheck v0.1') : fail('Unexpected arguments after version.');
  if (command !== 'review') {
    if (command === undefined) return ok(formatStatus());
    if (args.length === 1 && (command === '.' || command === '..' || /[\\/]/.test(command))) return ok(formatStatus(args));
    return fail(`Unknown command ${JSON.stringify(command)}.`);
  }
  let target: string | undefined;
  let json = false;
  let literal = false;
  let wantsHelp = false;
  for (const arg of args.slice(1)) {
    if (!literal && arg === '--') { literal = true; continue; }
    if (!literal && (arg === '--help' || arg === '-h')) { wantsHelp = true; continue; }
    if (!literal && arg === '--json') { json = true; continue; }
    if (!literal && arg.startsWith('-')) return fail(`Unknown option ${JSON.stringify(arg)}.`);
    if (target !== undefined) return fail('Expected at most one target directory.');
    target = arg;
  }
  if (wantsHelp) return ok(help);
  try {
    const report = await reviewRepository(target ?? '.');
    return { stdout: json ? renderJsonReport(report) : renderConsoleReport(report), stderr: '',
      exitCode: report.findings.some(f => f.severity === 'error') ? 1 : 0 };
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}
