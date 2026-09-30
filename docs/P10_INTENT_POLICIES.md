# P10 — Requirements and architecture policies (pure policy API)

P10 introduced the pure policy evaluator below. P15 now integrates automatic
bounded import extraction, dependency resolution, boundary and naming checks into
CLI configuration and reports; see [P15](P15_ARCHITECTURE.md). Natural-language
task configuration and assessment are implemented separately in P11/P13.
The pure API remains caller-supplied and does not claim verified observations.

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
deduplicated. Requirements always produce `insufficient-evidence` in this pure API.
Optional requirement `resourceIds` are metadata; this API does not resolve or
assess them. Workflow-level task assessment is documented in [P13](P13_TASK_ASSESSMENT.md).

IDs must be unique across requirements and boundaries. Schemas reject unknown
fields, empty text and oversized inputs: up to 100 requirements, 100 boundaries,
4,000 characters per requirement and 10,000 dependency observations per call.
The normalized policy receives a SHA-256 identifier. It identifies the current
policy, not user approval, immutability, or historical intent. Authorized developer
agents may change expectations; Shipcheck does not write them or edit code.

P15 completes the automatic architecture slice with explicit coverage limits.
The pure API tests retain forbidden dependencies, allowed direction/prefix controls,
unassessed requirements, policy identity, deduplication and validation errors.
Neither API authorizes source editing.
