# P6 live audit verification — 2026-09-27

The user authorized a new maximum $0.50 verification spend. The original trial
ledger was preserved. A separate durable ledger at
`<user home>/.shipcheck/verification-2026-09-27` used the existing reservation,
locking, token-counting, output-limit and no-retry controls. Three generation
requests were made, one per mode, each preceded by an input-token count.

An explicit local test harness wired the real requestLiveQa transport through
reviewWithAi's injected adapter. Reports therefore identify execution as
injected, although the model responses were live, not synthetic. This exercised
the review pipeline, schema validation, fresh-source citation checks, and JSON
and Markdown rendering. It did not replenish the ordinary CLI trial allowance
or separately retest CLI dispatch, which remains covered by offline tests and
the earlier live CLI trial.

Only the two source files in fixtures/live-trial were transmitted. Each mode
identified the missing-value splice(-1) defect in remove-item.ts, produced no
candidate for remove-item-safe.ts, and passed exact citation verification.

| Mode | Input tokens | Output tokens | Conservative token cost |
| --- | ---: | ---: | ---: |
| low-cost | 390 | 234 | $0.000166 |
| balanced | 390 | 125 | $0.002225 |
| high-quality | 390 | 147 | $0.012225 |
| Total | 1,170 | 506 | $0.014616 |

Pricing was rechecked against [OpenAI pricing](https://developers.openai.com/api/docs/pricing).
Dollar values use the maximum Standard input rate and reported token usage;
they are not an invoice. Maximum reservations totaled $0.245782, below the
authorized $0.50. All receipts were reconciled, with no unresolved attempts.
This verification batch has used its three-attempt limit; no additional calls
are planned under it. No key was printed or saved in reports.

Local JSON/Markdown reports and the harness are under the ignored .release-check
directory. This smoke test confirms useful live auditing and evidence plumbing
on a known fixture, not broad model accuracy or semantic correctness.
