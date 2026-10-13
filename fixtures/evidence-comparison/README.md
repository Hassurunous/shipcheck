# P22 paired evidence comparison

Frozen before live execution. Corpus SHA-256:
`c36d8b2ca4601ee6de5b0961f360e6563ebfa43437a66de57065c6ed4849a2a7`.

Eight cases: three defect/clean pairs plus timed-out and unauthorized execution
controls. The root-lint pair is a P21 regression pattern; the boundary and
concurrency examples are newly authored. None was used to tune the P22 prompt.
This is developer-authored, non-blind evaluation, not an independent benchmark.

Both arms use the current model, instructions, output schema and identical source
selection. The supplied arm alone receives analysisResults. Alternate arm order
by case index; one request per arm, no retries, stop at first operational failure.
Use real ESLint and synthetic Node assertion checks. Freeze ground truth before
requests and assert all captured check statuses and unchanged fixture files.

Score each whole diagnosis as confirmed, false-positive or uncertain; a valid
citation alone cannot confirm it. Record unsupported execution statements,
structured execution-premise verification and citation rejection separately.
Count each expected bug once, count all extra false claims, and distinguish
missed bugs from failed/unassessed requests. Clean and incomplete controls must
not generate invented code defects or turn unavailable execution into a pass.
An empty candidate array on an incomplete control is abstention, not proof that
the model understood the execution failure. Preserve operational states outside
AI output. Compare counts, without claiming statistical significance.

Use scripts/evidence-compare.mjs with --offline first and --live only with an
explicit fresh allowance <= $0.25. Sixteen worst-case reservations consume $0.10
under the current shipped low-cost policy. Each request remains individually
metered. Generated reports and reviewer labels belong in ignored .release-check.
