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

GitHub Actions runs tests, type checking, and the production build on Node.js 24 with npm caching and `npm ci`. Marketplace catalog validation runs in a separate job on pushes, pull requests, scheduled runs, and manual dispatches.

CI also checks that rebuilding leaves `dist/amina-s-card.js` unchanged. Commit the generated bundle whenever source changes affect it. Both jobs use read-only repository permissions; catalog validation PR comments are disabled.

## Marketplace requirements

Reviewed against the [validation reference](https://contributors.home-assistant.io/marketplace/reference/validation/) and [dashboard publishing guide](https://contributors.home-assistant.io/marketplace/guides/dashboard/) on November 27, 2026. The catalog still uses `hacs/action` with `category: plugin`, without ignored checks. Keep `hacs.json` in the repository root and the built `dist/amina-s-card.js` matching its `filename`. README screenshots are required for dashboard cards. Integration-only checks such as hassfest and integration branding do not apply.

The existing single-file distribution remains supported. Optional ZIP release packaging starts with Home Assistant 2026.12 and has additional archive checks; this repository does not use it. The Marketplace transition alone does not require raising the card's minimum Home Assistant version.

The README uses [Marketplace exclusion markers](https://contributors.home-assistant.io/marketplace/reference/repository-structure/#leave-part-of-your-readme-out-of-the-marketplace) around installation instructions. Home Assistant 2026.12 and later hide that section in Marketplace; GitHub and older versions still show it.

Catalog validation does not replace a live Marketplace installation/update check. Resource registration, browser reload, and adding the card from the picker still need verification in Home Assistant.

## Completed hardware verification

Both Zigbee2MQTT and ZHA with Attaxia's custom quirk are supported. Automatic entity discovery, single-phase and three-phase telemetry, and the dashboard performance fix have been verified in Home Assistant on real hardware.

The automated suite does not establish browser layout, accessibility, or every Home Assistant picker and service-delivery interaction. The catalog validation action requires its hosted/container execution environment and is not exercised by `npm test`.

Discovery performance regressions are checked with 2,000 state updates and renders using counted registry traversals and WebSocket requests. Additional tests cover 1,000 updates during a pending snapshot, editor updates, registry collection replacements, and event-driven refresh shared across cards. Normal state changes reuse cached charger mappings and phases even beyond the registry snapshot TTL; there is no scheduled polling. These are deterministic operation-count checks, not a browser CPU profile.

Subscription lifecycle regression tests use deferred promises to cover disconnects, rapid reconnects, out-of-order completions, shared cards/editors, rejection, stale callbacks, and connection switching. Session identities reject stale completions and callbacks; pending attempts are serialized per registry event type so reconnects cannot create duplicate subscriptions. The previously deferred race is reproduced by these tests and fixed.
