# P10 — Requirements and architecture policies (started)

P10 captures intended behavior and architecture, then assesses evidence against
those expectations. The initial implementation is an exported pure library API;
it is not yet part of CLI configuration or audit reports. P8/P9 integration and
inline P11 task configuration remain separate, unfinished work.

```js
import { assessIntentPolicy } from 'shipcheck';

const result = assessIntentPolicy({
  requirements: [{ id: 'AUTH1', text: 'Requests must be authorized.' }],
  boundaries: [{
    id: 'ARCH1', from: 'src/domain', to: 'src/ui',
    reason: 'Domain logic must not depend on UI code.'
  }]
}, [{
  from: 'src/domain/order.ts', to: 'src/ui/view.ts', line: 3,
  excerpt: 'import { view } from "../ui/view.js";'
}]);
```

Boundaries prohibit a dependency from a file/directory prefix to another prefix.
Matching is case-sensitive and respects slash boundaries: `src/domain` does not
match `src/domain-extra`. Paths must be repository-relative, without traversal or
backslashes. Callers must resolve dependencies and supply canonical relative paths;
the evaluator does not extract imports, resolve aliases, or read files.

A matching observation produces `potential-violation` with the original evidence.
Otherwise the outcome is `no-observed-violation`, never proof that the repository
satisfies the rule. Coverage is explicitly `supplied-observations-only`; line and
excerpt evidence is caller supplied and unverified. Duplicate observations are
deduplicated. Requirements always produce `insufficient-evidence` in this slice.
Optional requirement `resourceIds` identify intended references but are not yet
resolved or assessed.

IDs must be unique across requirements and boundaries. Schemas reject unknown
fields, empty text and oversized inputs: up to 100 requirements, 100 boundaries,
4,000 characters per requirement and 10,000 dependency observations per call.
The normalized policy receives a SHA-256 identifier. It identifies the current
policy, not user approval, immutability, or historical intent. Authorized developer
agents may change expectations; Shipcheck does not write them or edit code.

Remaining P10 work includes bounded source/dependency extraction, CLI configuration
and reporting, verified reference evidence, natural-language requirement assessment,
explicit ambiguity/conflict outcomes, conventions, and a broader evaluation corpus.
Current tests cover forbidden dependencies, allowed direction/prefix controls,
unassessed requirements, policy identity, deduplication and validation errors.
No AI requests, new dependencies or source-editing capabilities were introduced.
