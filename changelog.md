# Changelog

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
