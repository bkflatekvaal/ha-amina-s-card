# Amina S Card

A compact Home Assistant Lovelace card for Amina S EV chargers exposed through Zigbee2MQTT or ZHA with the Amina S custom quirk. It shows the charger status, LED state, voltage, link quality, charge limit, power, current, and the last charging-session energy.

The card uses the real Amina S entities exposed by Home Assistant. It does not require template sensors or helper entities.

Tested and verified with Zigbee2MQTT and ZHA, including multiple chargers on the same Home Assistant system with a separate card for each charger.

## Installation

### HACS

1. Open **HACS** in Home Assistant.
2. Open **Frontend**.
3. Search for **Amina S Card** and select **Download**.
4. Refresh the browser when Home Assistant asks you to.
5. Add the card from the Lovelace card picker, or configure it in YAML.

HACS registers the JavaScript resource automatically.

### Manual installation

1. Download `dist/amina-s-card.js` from the repository.
2. Copy it to Home Assistant's `/config/www/amina-s-card/` directory.
3. Add it as a Lovelace resource:

```yaml
url: /local/amina-s-card/amina-s-card.js
type: module
```

Then add the card to a dashboard.

## Recent changes

### v1.0.5

- Detect ZHA or MQTT from each status entity's registry entry, defaulting to MQTT names when detection is unavailable.
- Select ZHA's total power entity automatically and preserve manual overrides.
- Show averaged three-phase voltage with `3p` while idle when all three voltages are available.

### v1.0.4

- Default power to the device's total active power entity.
- Added experimental three-phase detection, separate A/B/C current readings, and averaged voltage with a `3p` prefix.
- Derive phase B/C current and voltage entities from the selected entities, including manual overrides.
- Use the device name as the default heading, hide disabled or missing link quality, and show `-` for missing readings.
- Documented manual LQI enablement for both integrations and verification with multiple chargers.

### v1.0.3

- Added automatic lookup for ZHA LQI and charge-current-limit entity names.
- Preserved automatic lookup when entities become available after the card loads, while keeping manual overrides authoritative.
- Allowed ZHA LQI sensors without a unit in the configuration editor.
- Documented ZHA quirk installation, recreating entity IDs, enabling diagnostic LQI, and manual overrides.

See [changelog.md](changelog.md) for the release history.

### v1.0.2

- Improved the compact header layout by moving the charge-limit readout into the telemetry row.
- Added support for an optional `sub_status_entity` override to replace the secondary status text.
- Updated the config editor defaults and documentation for the override fields.

## Configuration

Only `status_entity` is required. The card derives the related entity IDs from its name. For example, `sensor.amina_s_ev_status` derives the Amina S entities using the `amina_s` base name.

The heading uses the device name associated with the selected status entity, preferring a name you have assigned in Home Assistant. Set `title` to override it, or leave the title blank to use the device name. If device information is unavailable, the status entity's friendly name or entity ID is shown instead. Each card resolves its own charger independently.

Missing, unknown, unavailable, or invalid numeric readings display `-`; actual zero readings still display zero. The link-quality row is hidden when its entity is disabled or absent.

```yaml
type: custom:amina-s-card
status_entity: sensor.amina_s_ev_status
```

The visual editor includes optional overrides for installations where an entity has a different name. The available override filters follow the entity metadata exposed by Home Assistant:

- Sub-status can use any entity type and replaces the secondary status text.
- Power, current, voltage, and energy use sensor device classes.
- Link quality can use the Zigbee2MQTT link-quality sensor or the ZHA LQI diagnostic sensor, including sensors without a unit.
- Charge limit uses a `number` entity.
- Charger control uses a `switch` entity.
- Alarm state and derated state use binary sensors.
- The alarm list uses a sensor entity.

The status entity is the source of truth for charging and EV connection status. Separate connected and charging entities are not required.

### ZHA setup

ZHA exposes only limited Amina S functionality without a custom quirk. Install the community [Amina S ZHA quirk](https://github.com/attaxia/amina_s_zha_quirk) using its installation instructions, restart Home Assistant, and reconfigure the charger in ZHA to create the additional entities. If entities are still missing, follow the quirk's guidance to remove and pair the device again.

After installing the quirk, recreate the entity IDs using Home Assistant's **Recreate entity IDs** action on the device page, then check the resulting IDs and select the new EV status entity in the card. Existing card overrides and automations may need their entity references updated. Some card entities may still need to be assigned manually under **Optional override**, especially the charger switch and thermal derating sensor.

LQI/link quality must be enabled manually for **both Zigbee2MQTT and ZHA**. On the charger's device page in Home Assistant, find the link-quality entity under **Diagnostics**, open its entity settings, and enable it. Its usual entity ID is `sensor.<name>_linkquality` for Zigbee2MQTT or `sensor.<name>_lqi` for ZHA. The card hides this row until the entity is enabled and available in Home Assistant's states. The ZHA charge-limit entity is normally `number.<name>_charge_current_limit`.

The card detects the integration from the selected status entity's Home Assistant entity registry entry, then uses the following names with the base name derived from `status_entity`:

| Card field | Zigbee2MQTT | ZHA |
| --- | --- | --- |
| Total power | `sensor.<name>_total_active_power` | `sensor.<name>_total_power` |
| Link quality | `sensor.<name>_linkquality` | `sensor.<name>_lqi` |
| Charge limit | `number.<name>_charge_limit` | `number.<name>_charge_current_limit` |

The `zha` platform selects ZHA names. The `mqtt` platform is treated as Zigbee2MQTT and selects its names. If neither is detected, or registry access is unavailable, the card uses Zigbee2MQTT/MQTT names. Detection runs independently for each card's status entity, so ZHA and MQTT chargers can coexist. Explicit overrides always take precedence. Renamed entities may require manual overrides, for example:

```yaml
type: custom:amina-s-card
status_entity: sensor.amina_s_ev_status
linkquality_entity: sensor.amina_s_lqi
charge_limit_entity: number.amina_s_charge_current_limit
# Set other overrides to the actual entity IDs shown on your ZHA device page.
```

## Three-phase charging

This card has currently only been tested with single-phase charging. Three-phase charging has not yet been validated, so the way aggregate power, current, voltage, and session energy are represented may require adjustment.

For Zigbee2MQTT's standard entity names, the card checks `sensor.<name>_power`, `_power_phase_b`, and `_power_phase_c` while the charger status is **Charging**. Power greater than zero on more than one phase is treated as three-phase charging; otherwise the card uses the single active phase (or the main phase when no phase is delivering power).

Power uses `sensor.<name>_total_active_power` for MQTT/Zigbee2MQTT or `sensor.<name>_total_power` for detected ZHA devices, regardless of charging mode. Readings in W are converted to kW; readings already in kW are displayed directly. Missing total power displays `-`; the card does not sum the individual phase powers. For installations with a different power entity, select it under **Optional override**.

Single-phase charging shows only `sensor.<name>_current`. Three-phase charging shows `_current`, `_current_phase_b`, and `_current_phase_c` on separate lines labeled **A**, **B**, and **C** under **Current**. Clicking a current line opens that phase's entity. Missing phase readings show `-` independently.

If all three voltage readings (`_voltage`, `_voltage_phase_b`, and `_voltage_phase_c`) are positive and available during three-phase charging or while not charging, the card shows their average prefixed with **3p**, for example `3p 230.0 V`. Single-phase charging shows only the active phase's voltage without the prefix. While not charging, missing or invalid extra phase voltages cause the card to show only the main voltage. Clicking voltage always opens the main configured voltage entity.

Current and voltage phase entities are derived from the selected entity, including manual overrides, by appending `_phase_b` and `_phase_c`. For example, overriding current to `sensor.garage_amperage` also selects `sensor.garage_amperage_phase_b` and `sensor.garage_amperage_phase_c`. No separate phase overrides are needed. Voltage clicks still open the selected main voltage entity, and current lines open their respective entities.

Missing readings required for the voltage average display `-`, and missing current phase readings show `-` on their own lines. Power overrides are displayed directly. Phase detection still uses the standard power phase names derived from the status entity. Phase detection and voltage averaging remain experimental until tested on a three-phase installation.

## Screenshots

The screenshots below show the card in dark and light Home Assistant themes.

### Dark theme

| Connected | Charging | Not connected |
| --- | --- | --- |
| ![Amina S Card connected in dark theme](screenshots/dark-connected.png) | ![Amina S Card charging in dark theme](screenshots/dark-charging.png) | ![Amina S Card not connected in dark theme](screenshots/dark-not-connected.png) |

### Light theme

| Connected | Charging | Not connected |
| --- | --- | --- |
| ![Amina S Card connected in light theme](screenshots/light-connected.png) | ![Amina S Card charging in light theme](screenshots/light-charging.png) | ![Amina S Card not connected in light theme](screenshots/light-not-connected.png) |

### Configuration editor

The card editor keeps the status entity required and groups manually assigned entities under optional overrides.

| Required configuration | Optional overrides |
| --- | --- |
| ![Amina S Card configuration editor with optional overrides collapsed](screenshots/config-collapsed.png) | ![Amina S Card configuration editor with optional overrides expanded](screenshots/config-expanded.png) |

## Development

```sh
npm install
npm run build
```

The production bundle is written to `dist/amina-s-card.js`.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
