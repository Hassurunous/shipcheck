# P12 — Reference-aware audits (completed for local references)

Configured local resources now accompany AI source context in audit, diff, task
and whole-repository batches. Use the existing `resources` configuration described
in [P8](P8_REFERENCE_RESOURCES.md); no new command is needed.

```powershell
shipcheck audit . --ai preview --json
shipcheck audit . --ai mock --json
shipcheck audit . --ai live --budget development --json
```

Preview shows selection without sending content. Mock exercises plumbing and does
not diagnose defects. Live mode requires the existing initialized spending allowance
and credentials. Reference content is sent to the provider only in live mode (or to
an explicitly injected test transport). Secret heuristics are not a complete secret
scanner; users remain responsible for what they designate as reference material.

## Selection and bounds

Source is selected first. Each reference's `appliesTo` patterns are matched against
the selected source, including supporting imports. Applicable references fill the
remaining `ai.maxContextBytes` budget in configuration order. The combined serialized
source/reference snapshot size is bounded; complete references are included or
omitted, never truncated. Numbered-line wrappers and prompt/schema overhead are
additional request bytes. The full request size and input estimate include them,
and existing live token counting/reservation controls cover the full request.

Missing, oversized, excluded, sensitive or ambiguous required references stop the
request before transport. Optional failures remain visible and make coverage partial.
Reduce source selection or increase configured context limits when a required
reference cannot fit. Existing live request limits still apply. Workflow-level
required-reference loading checks can also stop AI before batch planning.

Multiple resource IDs using the same applicable path are ambiguous and omitted;
required ambiguity blocks transport. A path selected as both source and reference
is also ambiguous. This prevents citation paths from identifying multiple snapshots.
This is not semantic contradiction detection across different documents.

## Evidence and reporting

Requests identify references separately from source, carrying resource IDs, paths,
raw-byte hashes, declared versions/authority and numbered text. Reference content
is untrusted data, never permission to execute commands or change files. Reviewers
are instructed to cite both affected source and references for reference-based
diagnoses and report incompatible expectations as separate `referenceConflicts`.

Each conflict has an explanation, exact citations to at least two distinct submitted
reference files, citation verification and `status: needs-clarification`. Conflicts
make AI coverage partial even when their citations match. Candidates citing a
disputed reference are marked `referenceConflict: true` and console output requests
clarification before code changes. Conflict interpretations remain AI judgments,
not deterministic findings. Missing/fabricated reference locations fail validation;
incorrect excerpts remain visibly rejected. An empty conflict list does not prove
that references agree. Existing exit codes remain unchanged: AI candidates and
conflicts require report inspection even when the command exits zero.

Candidates use the existing path/line/excerpt evidence format. Reference paths must
be in the submitted context; verification binds them to the captured resource ID
and hash and freshly reloads reference content. Changed/unavailable references and
incorrect excerpts reject citations. Reference-only candidates are not retained:
at least one citation must identify selected source (and workflow focus when scoped).
These checks establish text provenance, not diagnosis correctness or complete use
of every applicable requirement. The system cannot prove that the reviewer cited
every reference it relied on.

Each AI stage exposes `preview.references` with inclusion/omission reasons and
post-response freshness when available. References changed during review make
coverage partial even if the response contains no candidates. Top-level
`references.evaluation: not-assessed` describes loading only; inspect AI stage
metadata and individual candidate citations for actual request inclusion. Inclusion
does not prove that a model meaningfully assessed a document. Report previews omit
reference bodies, but candidate evidence may quote them.

## Validation and remaining limits

The local-reference implementation and evaluation gate are complete. See
[P12 evaluation results](P12_EVALUATION.md) for the four-case live evaluation,
recorded reports, explicit semantic labels, offline scoring commands and cost.

Offline injected-transport tests validate plumbing, bounds, changed references,
cross-file citations, ambiguity, omissions and batch previews. They do not establish
live model quality. The live corpus is deliberately small and does not establish
general diagnosis accuracy or comprehensive injection resistance. External roots/remote references remain P16; inline task
requirement assessment remains P13. No source-editing capability is introduced.
