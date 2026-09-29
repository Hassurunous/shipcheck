# Cross-repository provider example

Run from the Shipcheck checkout:

```powershell
shipcheck audit fixtures/integrations/consumer --reference-root provider=fixtures/integrations/provider --json
```

Expect exit 0, one matched HTTP call and one matched SDK function call.
Without `--reference-root`, expect exit 2 and explicit denied/unavailable states.
Neither provider code nor client code executes; no network or AI is used.
To test defects, copy this fixture to a temporary directory and change the route
or pass a number to `getUser`. Definite mismatches exit 1; dynamic arguments yield
partial coverage and exit 2. See `docs/P16_EXTERNAL_CONTRACTS.md`.
