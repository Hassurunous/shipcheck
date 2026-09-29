# Supervised developer-loop fixture

This intentionally defective client is an experiment fixture, not a working API
integration. Copy this directory into a disposable location before editing it.
Do not run against a real server; the test replaces fetch with a local fake.

1. Run `shipcheck audit <copy> --json` (expected exit 1, route mismatch).
2. Run `node --test <copy>/client.test.mjs` (expected failure).
3. Give a developer agent the report, task and source. Authorize editing only
   `client.mjs`, at most two edit/rerun cycles, no paid calls and no requirement,
   provider or test changes. Ask it to resolve the reported problem.
4. Rerun the same audit and test. Expect exit 0, a matched route and passing test.
5. Verify only client source changed. Record results and uncertainty.

This is a transparent, tiny, supervised exercise. The fixture author knows the
defect; it is not a blinded or independent measure of agent effectiveness. The
test checks a stubbed request, not runtime network behavior. Shipcheck itself
never applies the edit. See docs/P18_QUALIFICATION.md for measured results and gates.
