# Development Rules

Shipcheck v0.1 is a TypeScript CLI.

Before implementing a task:
1. Read PRODUCT.md.
2. Read ARCHITECTURE.md.
3. Read relevant source/tests.
4. Do not expand scope.

Every implementation task must:
- compile
- pass tests
- preserve CLI behavior
- include tests for new behavior
- avoid unrelated refactoring

Prefer:
- pure functions
- small modules
- explicit schemas
- deterministic behavior where possible

Do not:
- add databases
- add web servers
- add authentication
- add frameworks without justification
- silently change architecture