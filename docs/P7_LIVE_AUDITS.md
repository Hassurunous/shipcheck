# Live repository audits with a shared budget

Set `SHIPCHECK_API_KEY` in your environment, or configure `ai.apiKeyEnv` with an
existing variable's name. Never put the key itself in repository configuration.
The commands below use credits; preview/mock do not.

If you previously used `OPENAI_PROJECTDEV_API_KEY`, set the new name in the same
PowerShell session without printing its value:

```powershell
$env:SHIPCHECK_API_KEY = $env:OPENAI_PROJECTDEV_API_KEY
```

This assignment lasts for that session. Alternatively, keep the existing variable
and set `ai.apiKeyEnv` to `OPENAI_PROJECTDEV_API_KEY` in repository configuration.
If setting a persistent Windows environment variable, reopen PowerShell afterward
so the new process inherits it. Missing credentials stop before any reservation
or API call. CLI errors include the failing batch number and its underlying cause.

```powershell
shipcheck audit . --whole-repository --ai preview --json
shipcheck budget init baseline --usd 0.50
shipcheck audit . --whole-repository --ai live --budget baseline --mode low-cost --json
shipcheck budget status baseline
```

The example explicitly creates a fifty-cent allowance. Choose your own amount
between $0.01 and $100.00, with at most two decimals. Initialization never resets
an existing name. Each allowance permits at most 1000 attempts. Names use a lowercase letter followed by lowercase letters,
digits or hyphens, at most 48 characters; Windows reserved names are rejected.
Creating a budget makes no API requests. Repository config cannot create/select
an allowance or authorize paid requests. `--budget` is valid only with `--ai live`.

Use the same name on later runs to share its remaining allowance, including
`shipcheck diff . --ai live --budget baseline`. `--run-checks` independently
authorizes configured local checks. Trial and named budgets are mutually exclusive;
the old trial ledger is unchanged and does not authorize whole-repository batching.

For slower reviews, set `ai.timeoutMs` to 60000. The default remains 10000 ms.
`ai.maxOutputTokens` can be increased to 2000 for live audits; the default is 1000.
No auto-retry is performed for timeout, incomplete output, invalid citations or
other provider failures.

## Spending controls

The ledger lives outside the repository at `<home>/.shipcheck/budgets/<name>`.
It stores an immutable policy, request hashes, reservations and usage receipts,
not source bodies or credentials. A lock serializes reservations across processes.
Malformed, linked, missing, stale-locked or unresolved state fails closed.
Do not delete a ledger to reset its allowance. A different name is an additional
allowance, not a continuation; this is not an account-wide OpenAI spending cap.

Before token counting or generation, each request reserves its worst-case token
cost plus 25% headroom. All reservations permanently count against that allowance,
even when reported usage is lower. This deliberately favors a simple conservative
bound over reclaiming unused funds. Failed/interrupted attempts remain unresolved
and prevent further calls against that name. Status is read-only; there is no
automatic unlock, refund, refill or reset.

To recover an unresolved attempt after the audit has stopped, explicitly charge
its full reservation against the allowance (use its ID from `budget status`):

```powershell
shipcheck budget settle baseline 000003 --charge-reservation
```

This records a settlement, not a successful review or a usage receipt. It makes
no API calls, refunds nothing, and leaves the original allowance and remaining
balance unchanged. It permits later requests against the remaining balance.
Active/stale locks still block settlement; it never deletes a lock or attempt.
Repeating settlement is idempotent. Do not create a new allowance just to bypass
an unresolved attempt.

Incomplete responses now explain recognized provider reasons, including output
token exhaustion and content filtering. The output cap includes reasoning as well
as visible output; see [OpenAI's reasoning guide](https://developers.openai.com/api/docs/guides/reasoning).
This repository now sets `ai.maxOutputTokens` to 2000, within the existing reserved
maximum. Other repositories still default to 1000. This may reduce truncation but
does not guarantee completion. Partial structured output is never accepted.

Generation is capped at 32000 input tokens and 2000 output tokens. The
[Responses input-token endpoint](https://developers.openai.com/api/docs/guides/token-counting)
counts the exact proposed input/instructions/schema before generation. An oversized
count stops generation and retains the reservation. Returned usage and processing
tier must validate before a receipt is recorded.

Models/prices are pinned to the existing low-cost/balanced/high-quality mapping.
Configured alternatives are rejected before reservation. Standard processing,
no tools, no retries, and the highest short-context input rate (cache writes) are
used. [Official pricing](https://developers.openai.com/api/docs/pricing) was checked
September 30, 2026 (including the [GPT-6 Sol rate table](https://developers.openai.com/api/docs/models/gpt-6-sol)). New version-2 budgets expire **October 30, 2026 at 00:00 UTC**: a reviewed
pricing-policy update is required afterward; config cannot extend it.

| Mode | Model | Reservation per request |
| --- | --- | ---: |
| low-cost | gpt-6-luna | $0.006250 |
| balanced | gpt-6-sol | $0.125000 |
| high-quality | gpt-6-astra | $0.625000 |

These are worst-case reservations, not expected charges or an invoice. Sixteen
low-cost batches reserve $0.10. A $0.50 allowance cannot fund even one high-quality
batch under this conservative policy. Remaining requests also depend on
`ai.maxBatches` and context limits. Provider-side project limits remain useful as
an additional control; Shipcheck cannot constrain other applications or changes
to provider pricing/account billing.

## Reports and stopping

Live calls use the same selection, sensitive-content filtering, related-import
context, structured-output and exact-citation checks as the existing reviewer.
Each successful batch has budget name, counted tokens, reservation, usage and a
priced usage upper bound. Diagnoses remain semantically unverified.

The first failed batch stops subsequent batches. Reports preserve completed
results, the failed batch, `aiAudit.stoppedReason`, and remaining paths marked
`stopped:<reason>`. Budget exhaustion returns exit 2 with the report still available.
It is not a clean audit. Inspect `budget status` for retained reservations even
if a request failed before its accounting could be attached to the report.

Rerunning starts a fresh audit and consumes further reservations; this version
does not cache/resume completed batches. An exhausted allowance cannot be reused
for spending. Oversized, excluded, sensitive or capped files remain disclosed
skips. Whole-repository scope never guarantees full context or defect detection.

## Library usage

```js
import { initializeBudget, runWorkflow, budgetStatus } from 'shipcheck';
// Once, only after explicit spending authorization:
await initializeBudget('baseline', 0.50);
const report = await runWorkflow('/path/to/repo', 'audit',
  {execution:'live', budget:'baseline'}, {wholeRepository:true});
console.log(await budgetStatus('baseline'));
```

## Pricing policy upgrades

Ledger policies and their model/rate mappings are versioned. Version-1 ledgers
retain their October 3 expiry and all reservations, receipts and settlement support,
but are retired for new requests in this release. The original three-request trial
is unchanged. Upgrading Shipcheck never resets or renews an existing allowance.
After inspecting and resolving an old ledger, explicitly approve a separate
allowance and initialize a new name with `shipcheck budget init <new-name> --usd <amount>`.
This is additional spending authorization, not a transfer or refund of unused funds.
Do not delete an old ledger or recreate it to bypass its accounting.
Maintainers: add a new pricing policy version when changing rates, models, limits
or expiry. Preserve every historical version's rates and validation rules so
status and settlement keep working; never repoint an old version to a new table.
