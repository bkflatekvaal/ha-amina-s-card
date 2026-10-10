# Changelog

## 1.1.1 — 2026-10-10

- Document support for both Zigbee2MQTT and ZHA with Attaxia's custom quirk.
- Verify automatic entity discovery and single-phase and three-phase telemetry on real hardware. Remove outdated experimental and pending-live-testing statements from current documentation.
- Confirm the v1.1.0 dashboard performance regression fix in Home Assistant on real hardware.
- Correct discovery documentation to describe cached mappings and event-driven registry refresh rather than periodic refresh on ordinary state updates. Preserve status-only setup, existing overrides, and both integrations.
- Clarify that ZHA still requires a custom quirk installation.
- Preserve the low-priority, unconfirmed asynchronous subscription/disconnect race as a documented TODO; make no discovery refactor or card behavior changes.
- Add CI verification that the committed distribution matches the production build, and explicitly disable HACS PR comments for validation with read-only permissions.
- Synchronize package and lockfile versions at 1.1.1; pass all 60 automated tests, TypeScript checks, and a clean production build. The rebuilt distribution matches the committed bundle.

## 1.1.0 — 2026-10-09

- Fix the severe dashboard performance regression introduced with registry-based automatic entity discovery in v1.0.7.
- Cache resolved entity mappings and phase entities per charger and connection, reuse resolved configuration, and avoid registry traversal and discovery-signature serialization on ordinary Home Assistant state updates.
- Refresh shared registry snapshots when entity or device registry events arrive, invalidate mappings when registry collections change, and preserve charger switching, renamed entities, manual overrides, and multiple ZHA/Zigbee2MQTT chargers.
- Prevent redundant discovery requests and accumulated asynchronous render callbacks; clean up subscriptions when cards and editors disconnect. Add no polling or timers.
- Add regression coverage for frequent state updates, pending discovery, editor updates, registry replacements, and shared event-driven refresh. Across 2,000 simulated updates and renders, verify no additional registry traversal, WebSocket requests, or discovery-triggered updates.
- Validate all 60 tests, TypeScript checks, and the production build; rebuild the distributed card bundle.

## 1.0.7 — 2026-10-09

- Extend Node-based tests for charger service calls, switch states, alarms, thermal derating, status text, sensor values, editor events, asynchronous discovery, and isolation between chargers.
- Fix an existing control bug: unknown, unavailable, or missing charger switches no longer trigger a `turn_on` command. Only `on` and `off` switch states permit control actions.
- Add Node.js 24 CI validation with npm caching, clean dependency installation, automated tests, TypeScript checks, and production builds alongside HACS validation.
- Use the selected power entity's live unit of measurement for W/kW/MW conversion to kW. Show `-` for missing or unsupported units instead of inferring units from entity IDs or registry metadata; preserve valid zero readings and invalid-state handling across integrations and overrides.
- Add power-unit tests for W, kW, MW, missing and unsupported units, invalid states, zero readings, and manual overrides across MQTT and ZHA setups.
- Discover related entities within the selected status entity's device and integration using registry metadata, including renamed current and voltage phases. Reject naming fallbacks associated with another charger and preserve manual overrides.
- Share cached entity/device registry snapshots across cards and editors, update after asynchronous discovery, and refresh or retry at bounded intervals.
- Preserve existing naming defaults when registry information is missing or ambiguous, and retain the phase-suffix convention for explicit current and voltage overrides. Keep the card layout and required configuration unchanged.
- Add automated coverage for single and multiple MQTT/ZHA chargers, mixed integrations, renamed entities, overrides, ambiguous metadata, failures, cache refresh, and asynchronous selection changes.
- Hide Start/Stop controls when the main status entity is unavailable, unknown, or missing, and show **Waiting for charger to come online** instead of vehicle-waiting text.
- Document live session-energy estimation with Integral and Utility Meter helpers, resetting the meter when charging starts, and overriding the card's energy entity.
- Clarify HACS installation through a custom repository while the card is not listed in HACS.

## 1.0.6 — 2026-10-09

- Detect three-phase charging from positive current on more than one phase, using the selected current entity and its derived phase B/C companions. Remove dependency on individual phase power sensors.
- Simplify the README and move configuration, ZHA setup, phase telemetry, and screenshot details into linked documentation.
- Review setup instructions and document the current entity defaults, missing readings, and experimental three-phase behavior.

## 1.0.5 — 2026-10-09

- Detect each status entity's integration through Home Assistant's entity registry: ZHA selects ZHA names, MQTT selects Zigbee2MQTT names, and unknown integrations or unavailable registry access fall back to MQTT names.
- Use ZHA's `_total_power` or Zigbee2MQTT's `_total_active_power` for power, converting W readings to kW and preserving manual overrides.
- Cache registry lookups across cards while keeping defaults independent per charger; apply detected defaults to the configuration editor as well.
- Show averaged voltage with a `3p` prefix while idle when all three phase voltages are valid; retain the active phase voltage during single-phase charging.
- Extend automated coverage for integration detection, fallback behavior, total power units, and idle voltage display.

## 1.0.4 — 2026-10-09

- Detect three-phase charging from power delivery on more than one phase while charging, using standard Zigbee2MQTT entity names.
- Always default power to the device's total active power in kW, with no calculated fallback when it is missing.
- Show the main current during single-phase charging and individual A/B/C current lines during three-phase charging, with each line opening its own entity.
- Average valid phase voltages with a `3p` prefix during three-phase charging; show the active phase's voltage during single-phase charging and keep voltage clicks on the main voltage entity.
- Preserve custom entity overrides.
- Derive current and voltage phase B/C entities by appending `_phase_b` and `_phase_c` to the selected main entities, including overrides, without separate phase configuration.
- Use the charger's Home Assistant device name as the default heading, with optional custom title and entity-name fallbacks.
- Hide link quality when its entity is disabled or absent.
- Display `-` for missing or invalid numeric readings instead of zero, while preserving actual zero readings.
- Document manual LQI enablement for both Zigbee2MQTT and ZHA.
- Record user verification with both integrations and multiple chargers using separate cards on the same system.
- Add automated coverage for phase detection, per-phase current display, voltage averaging, overrides, and missing readings. Live three-phase verification remains outstanding.

## 1.0.3 — 2026-10-09

- Added automatic lookup for ZHA's `sensor.<name>_lqi` and `number.<name>_charge_current_limit`, alongside the existing Zigbee2MQTT names.
- Shared entity defaults between the card and configuration editor. Defaults follow live entities, including entities loaded after card configuration; explicit overrides take precedence.
- Removed fixed entity overrides from the initial card configuration so automatic lookup can work for either naming convention.
- Allowed selection of ZHA LQI sensors without a unit in the configuration editor.
- Documented the Amina S ZHA quirk, recreating entity IDs after installation, manually enabling diagnostic LQI, and possible card overrides.
- Rebuilt the production bundle and synchronized package and lockfile versions.

## 1.0.2

- Improved the compact header layout by moving the charge-limit readout into the telemetry row.
- Added support for an optional `sub_status_entity` override to replace the secondary status text.
- Updated the configuration editor defaults and documentation for the override fields.
