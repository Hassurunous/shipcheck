# Offline demo

From a checkout, run `shipcheck audit fixtures/demo --markdown`.
Expected: two warnings, package/missing-script-target and source/fixme, exit 0.
The missing script is intentional; Shipcheck never executes it.
Add --ai mock to demonstrate synthetic AI output and citation verification
without credentials or spending. The mock is not an actual diagnosis.
