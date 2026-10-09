# Changelog

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
