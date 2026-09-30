# P4 — citation verification

AI reviews now re-read bounded source context after the reviewer returns, using
the same root, exclusions, file limits, UTF-8 validation, and link policy as
initial selection. Missing, linked, unreadable, oversized, or newly excluded
source cannot pass. The complete decoded file must match the submitted source;
changes elsewhere in that file also reject stale citations.

Every submitted source is rechecked even when the response contains no candidates.
The report's `ai.preview.files[].freshness` distinguishes `unchanged` from
`changed-or-unavailable`; the latter makes coverage partial. Preview-only runs
leave freshness absent because no post-response check occurred. This check is
snapshot-relative, not an atomic guarantee against subsequent file changes.

Each citation must refer to a submitted file, use a valid one-based inclusive
line range, and quote every complete line in that range exactly. Only newline
conventions are normalized; whitespace, spelling, indentation, and punctuation
are not repaired. Every citation must pass for the candidate to receive a
matched result. Failed checks retain a reason and the original candidate.

Reports add candidate.evidenceVerification with status matched/rejected and
per-citation checks. Console output displays that status and rejection reasons.
Older reports without this field remain readable. The existing evidenceStatus
stays unverified because citation matching does not establish semantic truth.
Neither matching nor rejected AI candidates are promoted into deterministic
findings or affect exit codes. Mock candidates remain explicitly synthetic.

This stage verifies AI citations. Deterministic findings retain their captured
observations and existing contract; pure createReport still performs no I/O.
The existing provider boundary continues to reject malformed or out-of-context
citations before this stage. Citation matching does not establish semantic correctness.

The check assumes a stable local tree and does not guarantee a snapshot against
hostile concurrent filesystem changes. All P4 tests run offline; no new trial
allowance or paid requests are required.
