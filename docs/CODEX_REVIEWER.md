# Codex subscription reviewer

Use `--ai codex` to explicitly select an installed Codex CLI signed in with
ChatGPT. `--ai live` remains the separate OpenAI API backend and still requires
an API key plus an authorized budget/trial. There is no automatic fallback in
either direction. Configuration alone cannot start a subscription review.

```powershell
codex login
codex login status
shipcheck audit . --run-checks --ai codex --json
shipcheck task --run-checks --ai codex --json
shipcheck audit . --whole-repository --ai codex --json
```

Codex must report `Logged in using ChatGPT`. API-key login, missing login,
missing executable, subscription limits and failed output stop the AI stage;
deterministic results are retained and the CLI reports AI failure (exit 2).
Do not combine Codex mode with --budget or --trial. Each user uses their own
Codex installation/login; no account credentials are packaged with Shipcheck.
Subscription usage competes with the user's other Codex activity. Account-level
credit/overage settings remain controlled by the user, not Shipcheck.

Install a trusted native `codex.exe` on Windows or `codex` executable on PATH.
For an installation not on PATH, set `SHIPCHECK_CODEX_PATH` to its absolute native
executable path. Shell shims (.cmd/.bat/.ps1) are not supported. Executable paths
are user environment settings, never executable commands supplied by repository
configuration. No dependency or CLI is downloaded automatically.

## Configuration and limits

Optional settings in the existing `ai` object:

```json
{"ai":{"mode":"low-cost","codexTimeoutMs":120000,"maxBatches":5}}
```

Codex uses the same per-mode `ai.models` overrides when present; otherwise current
mode defaults are gpt-6-luna, gpt-6-sol, and gpt-6-astra. These are requested model
names, not a guarantee of account availability or relative quality. Unsupported
models fail without switching provider. --mode overrides the configured mode.
`codexTimeoutMs` accepts 1000–300000 ms and applies to each generation subprocess;
authentication is separately bounded by at most 15 seconds. Existing source/context
limits and maxBatches still apply. Each whole-repository batch is a separate Codex
session. Use bounded task/diff reviews when a whole-repository review is unnecessary.

`ai.maxOutputTokens` is an API setting and is not enforced by the Codex CLI adapter.
Codex output is bounded to 128 KiB of final JSON and 1 MiB combined process output.
Shipcheck does not retry; Codex may perform its own internal transport recovery.
Shipcheck dollar ledgers do not measure or cap subscription allowance. Failures
never authorize API spending. No API key is needed for this backend.

## Review boundary and provenance

Shipcheck prepares the same selected source, references, requirements and offline
analysis context, and validates the returned response with the same schema,
quotation checks, task assessments and source-freshness checks as API review.
The report marks `ai.execution` as `codex`; it is not a mock or a direct API run.
A matching quotation does not prove a diagnosis, and task violations still do
not independently determine exit 1. Agents must read the report and completion
policy, not just process status.

The CLI runs in a newly created temporary directory, not the repository, with
read-only sandboxing and approvals disabled. User configuration/rules are not
loaded, project-document loading is disabled, and shell, apps, plugins, hooks,
browser, computer, image, code-mode and multi-agent features are disabled.
ChatGPT authentication and the OpenAI provider are explicitly selected. API keys,
access tokens and provider override environment variables are stripped from the
child environment. Codex retains its normal authentication store; Shipcheck does
not read, copy or rewrite it. Temporary response/schema files are removed afterward.
Codex itself can maintain its normal authentication/runtime caches.

This adapter depends on a trusted Codex installation honoring these controls;
it is not a new general-purpose sandbox. Managed installation requirements can
cause failures. No permissions bypass is used. The source snapshot in the prompt
is untrusted data, not instructions to execute actions. Review only that context.

Qualified initially on Windows / Node 22 with Codex CLI 0.162.0-alpha.17.2.
Other CLI versions and operating systems need qualification. Offline regression
tests cover auth rejection, missing credentials, output validation, timeout,
batch stop and absence of API fallback. A real ChatGPT-authenticated demo review
returned structured, quotation-matched output without direct API spending. A second
subscription task review identified the seeded suppressed-decrement violation and
returned supporting evidence for the other requirements. Actual CLI checks for a
missing executable and incompatible API budget flags both stopped with exit 2.
These are integration smoke tests, not general accuracy measurements.

Official references: [authentication](https://learn.chatgpt.com/docs/auth) and
[non-interactive Codex](https://learn.chatgpt.com/docs/non-interactive-mode).
