# Development Rules

Shipcheck v0.1 is a TypeScript CLI.

- Read `docs/PRODUCT.md` and `docs/ARCHITECTURE.md` before substantive implementation, then read relevant source and tests.
- Do not expand product scope without explicit instruction.
- Prefer small modules, pure functions, explicit data contracts, and deterministic behavior.
- Add or update tests for behavior changes. Run the narrowest relevant tests first.
- Run typecheck and the full test suite before declaring work complete; verify the build for executable or configuration changes.
- Do not add dependencies without justification.
- Do not introduce databases, web servers, authentication, or hosted infrastructure unless explicitly requested.
- Avoid unrelated refactors and preserve user-visible CLI behavior unless the task requires changing it.
- Update relevant documentation when architecture or behavior changes.
- Keep secrets and generated output out of version control.


Before implementing a task:
1. Read `docs/PRODUCT.md`.
2. Read `docs/ARCHITECTURE.md`.
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
