# P3 — offline AI review foundation

P3 supports offline previews/mocks and an explicitly gated live trial. The
approved $0.50 three-mode trial completed successfully. See [live controls and
results](LIVE_TRIAL.md); the sections below describe the shared foundation.

## Commands

```powershell
shipcheck audit . --ai preview
shipcheck audit . --ai mock
shipcheck audit . --ai mock --mode balanced
shipcheck audit . --ai mock --mode high-quality --json
```

Without a linked command, use `npm run audit -- . --ai mock`. Rebuild after
source changes when using the linked command. `--mode` requires `--ai`.
`--ai live` requires `--trial` and an initialized, unexhausted allowance.
Ordinary `shipcheck audit .` remains deterministic and does not prepare AI
context. Configuration alone never enables an AI run.

Preview lists selected paths, line counts, source bytes, hashes (JSON), skipped
paths/reasons (JSON), total serialized source bytes, request size, a heuristic
input-token estimate, output-token limit, and whether selection was limited.
It does not include source bodies or credentials in the report. No model runs.

Mock mode exercises the complete request/response validation path with one
synthetic informational candidate referring to the first selected file. All
modes intentionally use the same mock behavior. The candidate is explicitly
labeled synthetic/unverified, not a detected defect. No eligible source files
makes a mock run fail rather than masquerade as a successful clean review.

## Settings

Optional `ai` configuration in `shipcheck.config.json`:

```json
{
  "ai": {
    "mode": "low-cost",
    "models": {
      "low-cost": null,
      "balanced": null,
      "high-quality": null
    },
    "maxFiles": 12,
    "maxFileBytes": 16000,
    "maxContextBytes": 48000,
    "maxOutputTokens": 1000,
    "timeoutMs": 10000
  }
}
```

CLI mode overrides configuration. Model mappings can be specified for offline
adapter tests/previews but never enable network execution. There is no claim
that a named mode is better based on the tiny smoke test. Live model mappings
are pinned to the priced trial models; config cannot substitute another model.

Hard configurable ranges: files 1–64, file bytes 128–65,536, serialized context
bytes 256–262,144, output tokens 128–4,096, timeout 10–60,000 ms. Request size
includes additional instructions/schema overhead beyond the context limit.
Input tokens are estimated as request bytes / 3, rounded up, not counted with
a model tokenizer. They are not a strict token ceiling or billing quote.
Preview/mock actual API cost is zero. Live actualCostUsd remains null because
usage pricing is not an invoice; trial.pricedUsageUpperBoundUsd reports a
conservative calculation. Persistent trial reservations enforce the approved
$0.50 allowance. Retries are fixed at zero.

## Context and trust boundaries

Selection starts from the inspected inventory, ordered by root src/, then
root test/tests/, then other paths; each group is sorted. The selector accepts
common source extensions, not arbitrary text/config files. It always excludes
hidden paths, node_modules/dist/build/coverage/vendor directories, filenames
suggesting secrets/keys/credentials/tokens/passwords, and configured exclusions.
It additionally skips source containing recognizable credential assignments,
private-key headers, or common key patterns. These heuristics cannot guarantee
that arbitrary code is secret-free. Review the selected source before any
future external transmission.

Only selected source paths and content go in the request. The full repository
profile, absolute root, environment, marker excerpts, config, and deterministic
report are not sent. Whole files are skipped rather than truncated; source line
numbers remain usable. File-count/byte/read limitations are reported. Symlinks
are rechecked component by component before bounded reads. Like the inspector,
this assumes a stable tree, not hostile concurrent path replacement. Input
limits apply to AI context, not the preceding full deterministic inspection.

The QA/reliability prompt treats repository content as untrusted data, limits
analysis to supplied files, and requests concrete defects with evidence. There
are no tool calls, repository commands, code edits, or autonomous agent loops.
Instructions in source cannot authorize tool use because none is provided.

## Adapter and result contract

`src/ai/client.ts` builds a Responses API-shaped request with strict JSON Schema,
`store: false`, and `max_output_tokens`, then validates the response. It follows
the [official Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs).
The offline transport is injected. This
lets tests exercise successful responses, authentication/rate-limit failures,
refusals, incomplete output, malformed JSON, timeouts, and transport errors
without network access. The separate live transport enforces a response
stream byte limit and uses `ai.apiKeyEnv` (default `SHIPCHECK_API_KEY`) only for explicit live
execution. It uses native fetch with a fixed endpoint and no SDK.

Responses are limited to 128 KiB at the adapter boundary. Structured candidates
have bounded text and evidence counts. Citation paths must be relative and
belong to selected files; line ranges must fit the supplied content. Unexpected
fields, malformed citations, or incomplete results reject the AI stage as a
whole. Excerpt accuracy, current disk contents, and semantic validity remain
P4 work. All accepted candidates carry `evidenceStatus: unverified` and AI
origin; mode, model, execution type, and reviewer version identify provenance.

The report retains schemaVersion 1 and adds an optional `ai` section; existing
deterministic reports are unchanged. AI candidates remain separate from
`findings`. Failure includes a safe error code/message and preserves the
finished deterministic report. Raw provider errors/credentials are not echoed.
Timeout aborts the injected transport and fails even if it ignores cancellation.
There are no retries or silent fallback to another model.

CLI exit 2 means an AI stage failed; the partial report still goes to stdout
and a short diagnostic to stderr. Exit 1 remains for deterministic error-level
findings. Unverified AI candidates do not change exit status in this milestone.

## Live trial status

All three approved generation requests completed. Each identified the seeded
defect without flagging the clean control. The allowance is exhausted by its
request count, with conservative priced usage totaling $0.014746. Further
spending requires a new policy decision; see [trial record](LIVE_TRIAL.md).

## P4 extension

The P3 history above describes its initial boundary. AI candidates now receive
fresh-source and exact-excerpt checks after response validation; see
[P4 verification](P4_VERIFICATION.md). Semantic validity remains unverified.
