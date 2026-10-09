# Power, current, and voltage

Three-phase behavior is experimental pending live verification. The card has been tested with single-phase charging on Zigbee2MQTT and ZHA, including multiple chargers with separate cards.

## Power

Power uses the selected total power entity, discovered from the charger device or falling back to `_total_active_power` for MQTT/Zigbee2MQTT and `_total_power` for ZHA, unless overridden. The entity's live `unit_of_measurement` determines conversion: W is divided by 1000, kW is displayed directly, and MW is multiplied by 1000. Displayed power always uses kW.

Missing or invalid total power, or a missing or unsupported unit, displays `-`. Units are not inferred from entity names or registry metadata. Valid zero readings remain visible. This applies equally to both integrations and manual overrides. Individual phase powers are neither required nor summed.

## Phase detection and current

While the selected status reads `Charging` (case-insensitive), valid positive current on more than one phase triggers three-phase display. The card discovers main and phase current entities from the same device. Naming fallbacks and explicit current overrides use `_phase_b` and `_phase_c` companions. Unknown or unavailable readings do not count as active phases.

Three-phase charging shows separate **A**, **B**, and **C** current lines. Missing readings show `-` independently; zero readings remain zero. Clicking each line opens its entity.

Single-phase charging and idle states show only the selected main current entity. The card does not sum phase currents. Missing companion entities alone do not trigger three-phase display.

## Voltage

Voltage uses the selected main entity and phase B/C entities discovered on the same device. Naming fallbacks and explicit voltage overrides use `_phase_b` and `_phase_c` companions.

| State | Voltage display |
| --- | --- |
| Three-phase charging, all three voltages valid and positive | Three-phase average with `3p`, e.g. `3p 230.0 V` |
| Three-phase charging, any phase voltage missing or invalid | `-` |
| Single-phase charging, exactly one phase has positive current | That phase's voltage, without `3p` |
| Charging with no detected active phase | Main voltage, without `3p` |
| Not charging, all three voltages valid and positive | Three-phase average with `3p` |
| Not charging, extra phase voltages missing, invalid, or zero | Main voltage, without `3p` |

Clicking voltage always opens the selected main voltage entity, including when an average or another phase is displayed.
