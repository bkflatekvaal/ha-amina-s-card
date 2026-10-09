# Testing and validation

The tests use Node's built-in test runner and the existing TypeScript transpilation/VM approach. No running Home Assistant or additional test framework is required.

Run locally with Node.js 24:

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
```

The suite covers device-scoped discovery for MQTT and ZHA, power units, phase readings, missing values, start/stop service calls, alarm and derating messages, editor configuration events, asynchronous registry results, and multiple independent chargers.

The editor tests use a small DOM stub supporting the elements, selectors, and events exercised by the editor. They invoke the actual editor's rendering and event handlers. Card templates use a stub for Lit, so these checks validate values and conditional content rather than browser layout or Lit's DOM binding lifecycle.

GitHub Actions runs tests, type checking, and the production build on Node.js 24 with npm caching and `npm ci`. HACS compatibility runs in a separate job on pushes, pull requests, scheduled runs, and manual dispatches.

Remaining manual checks include real Home Assistant picker behavior, browser rendering and accessibility, end-to-end service delivery, and live three-phase charging. HACS's action requires its hosted/container execution environment and is not exercised by `npm test`.

Discovery performance regressions are checked with 2,000 state updates and renders using counted registry traversals and WebSocket requests. Additional tests cover 1,000 updates during a pending snapshot, editor updates, registry collection replacements, and event-driven refresh shared across cards. Normal state changes reuse cached charger mappings and phases even beyond the registry snapshot TTL; there is no scheduled polling. These are deterministic operation-count checks, not a browser CPU profile.
