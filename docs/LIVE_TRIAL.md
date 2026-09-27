# P3 live trial

The approved trial is $0.50 total, at most three generation requests, one per
mode, with zero retries or model fallbacks. It completed on 2026-09-26 using
the linked Windows CLI and OPENAI_PROJECTDEV_API_KEY. No credential is stored
in the repository or ledger. Ordinary review, preview and mock stay offline.

## Commands

```powershell
shipcheck trial status
shipcheck review fixtures/live-trial --ai preview
shipcheck review fixtures/live-trial --ai live --trial --mode low-cost
```

`shipcheck trial init` creates an allowance once; it never resets an existing
allowance. This trial has used all three attempts. Further live runs fail
before network access. A new spending policy requires a separate decision;
do not delete the ledger to bypass the limit.

## Limits and persistence

State is kept at `<user home>/.shipcheck/trial-v1`, independently of repository
configuration and working directory. Exclusive locking prevents concurrent
runs. Each reservation is written and synced before network access. Reservations
are never refunded or reused. An interrupted, failed, corrupt, or unresolved
attempt blocks further requests; stale locks require manual investigation.
There is no automatic recovery that might repeat a billed request.

Each attempt permits one input-token counting request followed by at most one
Responses generation request. The count includes instructions and output schema;
input above 5,000 tokens is rejected before generation. Output is capped at
2,000 tokens including reasoning. Each HTTP operation has the configured timeout
(at most 60 seconds), a 128 KiB response limit, and no redirects or retries.
Requests use the fixed OpenAI HTTPS endpoint, Standard processing, low reasoning,
store:false, and no tools. Live mode must be explicitly activated with --trial.
Repository config cannot raise the allowance or substitute an unpriced model.

Pricing uses the highest Standard input rate (cache writes), output rates,
and 25% reservation headroom. Total worst-case reservations for all three modes
are $0.245782, within the $0.50 allowance and $0.25 per-request ceiling. Prices
were checked on 2026-09-26; this fixed approval expires 2026-10-03 UTC. These
controls cover this local trial, not other API clients or account spending.
They assume an intact ledger and do not prevent its owner from tampering with
files. Provider billing, taxes and pricing changes are not a locally guaranteed
invoice amount. Keep the project spend limit enabled.

## Observed results

Only the two small fixture source files were submitted (390 source bytes).
Each model found the missing-value splice(-1) bug in remove-item.ts and produced
no candidate for remove-item-safe.ts. Cited excerpts matched the fixture during
manual review. Automated evidence verification remains P4; candidates retain
the unverified label. This tiny smoke test does not establish comparative quality.

| Mode | Model | Input tokens | Output tokens | Priced usage upper bound |
| --- | --- | ---: | ---: | ---: |
| low-cost | gpt-6-luna | 378 | 156 | $0.000126 |
| balanced | gpt-6-sol | 378 | 135 | $0.002295 |
| high-quality | gpt-6-astra | 378 | 152 | $0.012325 |
| Total | | 1,134 | 443 | $0.014746 |

Usage values came from the Responses results. Dollar values conservatively
price those tokens, not an invoice or account-cost query. actualCostUsd remains
null; trial.pricedUsageUpperBoundUsd distinguishes the calculation. The count
preflight returned 378 input tokens for each mode, matching reported usage.

Implementation: ai/live.ts handles bounded HTTP; ai/trial-budget.ts handles
durable allowance state. Offline tests cover limits, concurrency, persistence,
credential/model rejection, failures and timeouts without making API calls.

References: [OpenAI pricing](https://developers.openai.com/api/docs/pricing),
[input token counting](https://developers.openai.com/api/docs/guides/token-counting),
[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
