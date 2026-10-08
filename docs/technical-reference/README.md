# Complete runtime source reference

[Read the technical manual first](../TECHNICAL_MANUAL.md). Every runtime TypeScript module is covered, including nested helpers and anonymous callbacks. The descriptions and full listings refer to the working tree, not only the last commit.

| Module | Function bodies | Variable declarations | Types |
| --- | ---: | ---: | ---: |
| [src/additional-rules.ts](additional-rules.md) | 13 | 16 | 0 |
| [src/ai/audit-budget.ts](ai--audit-budget.md) | 22 | 51 | 1 |
| [src/ai/client.ts](ai--client.md) | 31 | 32 | 2 |
| [src/ai/context.ts](ai--context.md) | 11 | 34 | 2 |
| [src/ai/contracts.ts](ai--contracts.md) | 2 | 13 | 4 |
| [src/ai/evaluation.ts](ai--evaluation.md) | 17 | 22 | 3 |
| [src/ai/live.ts](ai--live.md) | 8 | 28 | 1 |
| [src/ai/local-imports.ts](ai--local-imports.md) | 4 | 6 | 0 |
| [src/ai/reference-context.ts](ai--reference-context.md) | 5 | 8 | 0 |
| [src/ai/reference-evaluation.ts](ai--reference-evaluation.md) | 12 | 23 | 3 |
| [src/ai/review.ts](ai--review.md) | 21 | 29 | 2 |
| [src/ai/task-evaluation.ts](ai--task-evaluation.md) | 13 | 10 | 3 |
| [src/ai/task-review.ts](ai--task-review.md) | 17 | 7 | 0 |
| [src/ai/trial-budget.ts](ai--trial-budget.md) | 16 | 33 | 1 |
| [src/ai/verify-evidence.ts](ai--verify-evidence.md) | 7 | 8 | 2 |
| [src/ai/whole-repository.ts](ai--whole-repository.md) | 7 | 20 | 0 |
| [src/architecture-audit.ts](architecture-audit.md) | 22 | 31 | 0 |
| [src/architecture-contracts.ts](architecture-contracts.md) | 5 | 5 | 1 |
| [src/axios-calls.ts](axios-calls.md) | 11 | 37 | 0 |
| [src/check-diagnostics.ts](check-diagnostics.md) | 9 | 11 | 2 |
| [src/check-process.ts](check-process.md) | 1 | 1 | 0 |
| [src/checks.ts](checks.md) | 21 | 30 | 1 |
| [src/classify.ts](classify.md) | 1 | 5 | 0 |
| [src/cli-command.ts](cli-command.md) | 14 | 44 | 1 |
| [src/cli.ts](cli.md) | 0 | 1 | 0 |
| [src/config.ts](config.md) | 19 | 14 | 3 |
| [src/contract-adapter-types.ts](contract-adapter-types.md) | 0 | 0 | 3 |
| [src/contract-adapters.ts](contract-adapters.md) | 2 | 2 | 0 |
| [src/contract-audit.ts](contract-audit.md) | 22 | 44 | 1 |
| [src/contract-contracts.ts](contract-contracts.md) | 1 | 3 | 2 |
| [src/csharp-http-calls.ts](csharp-http-calls.md) | 12 | 24 | 0 |
| [src/dependency-imports.ts](dependency-imports.md) | 6 | 27 | 1 |
| [src/fetch-calls.ts](fetch-calls.md) | 6 | 23 | 1 |
| [src/filesystem-policy.ts](filesystem-policy.md) | 2 | 9 | 0 |
| [src/findings.ts](findings.md) | 7 | 14 | 2 |
| [src/go-http-calls.ts](go-http-calls.md) | 6 | 18 | 0 |
| [src/ignore-contracts.ts](ignore-contracts.md) | 0 | 1 | 1 |
| [src/ignore-policy.ts](ignore-policy.md) | 10 | 27 | 3 |
| [src/index.ts](index.md) | 1 | 1 | 0 |
| [src/inspect-package.ts](inspect-package.md) | 2 | 4 | 2 |
| [src/inspect-repository.ts](inspect-repository.md) | 14 | 23 | 0 |
| [src/intent-policy.ts](intent-policy.md) | 11 | 10 | 0 |
| [src/java-http-calls.ts](java-http-calls.md) | 9 | 20 | 0 |
| [src/java-source.ts](java-source.md) | 1 | 17 | 0 |
| [src/markdown-report.ts](markdown-report.md) | 4 | 4 | 0 |
| [src/openapi-contract.ts](openapi-contract.md) | 4 | 15 | 1 |
| [src/package-references.ts](package-references.md) | 1 | 11 | 0 |
| [src/python-calls.ts](python-calls.md) | 22 | 79 | 0 |
| [src/reference-access.ts](reference-access.md) | 3 | 5 | 1 |
| [src/reference-existence.ts](reference-existence.md) | 2 | 7 | 1 |
| [src/reference-resources.ts](reference-resources.md) | 12 | 35 | 2 |
| [src/remote-reference.ts](remote-reference.md) | 13 | 15 | 0 |
| [src/reporters.ts](reporters.md) | 6 | 50 | 0 |
| [src/repository-profile.ts](repository-profile.md) | 0 | 3 | 1 |
| [src/resource-contracts.ts](resource-contracts.md) | 3 | 6 | 2 |
| [src/review-repository.ts](review-repository.md) | 1 | 1 | 0 |
| [src/sdk-audit.ts](sdk-audit.md) | 7 | 20 | 0 |
| [src/sdk-contracts.ts](sdk-contracts.md) | 1 | 3 | 1 |
| [src/sdk-syntax.ts](sdk-syntax.md) | 21 | 28 | 5 |
| [src/sensitive-content.ts](sensitive-content.md) | 0 | 2 | 0 |
| [src/standard-http-syntax.ts](standard-http-syntax.md) | 9 | 15 | 1 |
| [src/task-file.ts](task-file.md) | 9 | 10 | 1 |
| [src/version-policy.ts](version-policy.md) | 2 | 1 | 0 |
| [src/workflows.ts](workflows.md) | 9 | 42 | 1 |

Total: 64 modules, 550 function bodies/callbacks, 1138 variable declarations, 65 type declarations. Parameter and catch bindings appear in their execution traces. Destructured declarations can introduce several variable names. These are static syntax counts, not runtime invocation counts.

[Source hashes](source-manifest.json) allow checking whether the manual still describes the current implementation.
