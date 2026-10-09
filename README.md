# Amina S Card

A compact Home Assistant Lovelace card for Amina S EV chargers exposed through Zigbee2MQTT or ZHA with the Amina S custom quirk. It shows the charger status, LED state, voltage, link quality, charge limit, power, current, and the last charging-session energy.

The card uses the real Amina S entities exposed by Home Assistant. It does not require template sensors or helper entities.

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

On the charger's ZHA device page, find **LQI** under **Diagnostics**, open its entity settings, and enable it manually. Its usual entity ID is `sensor.<name>_lqi`. The ZHA charge-limit entity is normally `number.<name>_charge_current_limit`.

The card checks for existing entities with the following names, using the base name derived from `status_entity`:

| Card field | Zigbee2MQTT | ZHA |
| --- | --- | --- |
| Link quality | `sensor.<name>_linkquality` | `sensor.<name>_lqi` |
| Charge limit | `number.<name>_charge_limit` | `number.<name>_charge_current_limit` |

This automatically selects compatible entity names rather than definitively identifying the integration. If both names exist, the Zigbee2MQTT name takes precedence. Explicit overrides always take precedence over automatic lookup. Renamed entities may require manual overrides, for example:

```yaml
type: custom:amina-s-card
status_entity: sensor.amina_s_ev_status
linkquality_entity: sensor.amina_s_lqi
charge_limit_entity: number.amina_s_charge_current_limit
# Set other overrides to the actual entity IDs shown on your ZHA device page.
```

## Three-phase charging

This card has currently only been tested with single-phase charging. Three-phase charging has not yet been validated, so the way aggregate power, current, voltage, and session energy are represented may require adjustment.

The card currently displays the selected entities directly. It does not calculate a sum across phase-specific entities. If your Zigbee2MQTT device exposes separate phase entities, use the optional overrides to select the appropriate aggregate entities where available, and treat phase-specific display as experimental until tested.

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
