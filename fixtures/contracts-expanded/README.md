# Expanded offline HTTP contract example

From the Shipcheck repository:

```text
shipcheck audit fixtures/contracts-expanded --json
```

Expected: eight matched observations, contract state `checked`, exit 0.
The Go constructor and Java builder are labeled `request-construction`; the
remaining observations are request calls. No source is executed, no HTTP requests
are sent, and the client languages/libraries do not need to be installed. The
bundled native parser must support the host platform (validated on Windows x64).

These are syntax fixtures, not production lifecycle or error-handling examples.
To exercise failures, copy this directory to a scratch location and change a
literal route to `/missing`: exit 1. Substitute a variable URL: unresolved, exit 2.
The reports do not establish runtime correctness or whether constructed requests
are ever sent. See `docs/P14_2_ADDITIONAL_LANGUAGES.md` for supported patterns.
