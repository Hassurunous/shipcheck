# Offline multilingual contract example

From the Shipcheck repository, run:

```text
shipcheck audit fixtures/contracts --json
```

Expected: three `matched` calls across TypeScript and Python, contract state
`checked`, exit code 0. Shipcheck parses the files; it does not execute their
functions or send requests. Python and Requests do not need to be installed.

To try a mismatch, copy this folder to a scratch directory and change `/users`
to `/missing` in either client. An absent route produces a mismatch and exit 1.
Changing the URL argument to a variable produces unresolved coverage and exit 2.
These fixtures demonstrate method/route/query-name checks, not runtime correctness.
See `docs/P14_1_MULTILINGUAL_CONTRACTS.md` for the full limitations and configuration.
