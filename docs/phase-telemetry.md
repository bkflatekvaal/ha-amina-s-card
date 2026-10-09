# Power, current, and voltage

Three-phase behavior is experimental pending live verification. The card has been tested with single-phase charging on Zigbee2MQTT and ZHA, including multiple chargers with separate cards.

## Power

Power always uses the selected total power entity: `_total_active_power` for MQTT/Zigbee2MQTT or `_total_power` for detected ZHA, unless overridden. Readings in W are converted to kW; readings in kW are displayed directly. Without a unit, the standard `_total_active_power` name is treated as kW and other names as W.

Missing or invalid total power displays `-`. Individual phase powers are neither required nor summed.

## Phase detection and current

While the selected status reads `Charging` (case-insensitive), valid positive current on more than one phase triggers three-phase display. The card uses the selected current entity and its `_phase_b` and `_phase_c` companions, including manual overrides. Unknown or unavailable readings do not count as active phases.

Three-phase charging shows separate **A**, **B**, and **C** current lines. Missing readings show `-` independently; zero readings remain zero. Clicking each line opens its entity.

Single-phase charging and idle states show only the selected main current entity. The card does not sum phase currents. Missing companion entities alone do not trigger three-phase display.

## Voltage

Voltage uses the selected main entity and its `_phase_b` and `_phase_c` companions, including overrides.

| State | Voltage display |
| --- | --- |
| Three-phase charging, all three voltages valid and positive | Three-phase average with `3p`, e.g. `3p 230.0 V` |
| Three-phase charging, any phase voltage missing or invalid | `-` |
| Single-phase charging, exactly one phase has positive current | That phase's voltage, without `3p` |
| Charging with no detected active phase | Main voltage, without `3p` |
| Not charging, all three voltages valid and positive | Three-phase average with `3p` |
| Not charging, extra phase voltages missing, invalid, or zero | Main voltage, without `3p` |

Clicking voltage always opens the selected main voltage entity, including when an average or another phase is displayed.
