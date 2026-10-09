# More frequent energy updates

The charger's energy reports can arrive infrequently. This optional setup estimates charging-session energy from live power readings independently of the charger's energy reports.

The flow is: **charger total power → Integral helper → Utility Meter**. An automation sets the Utility Meter to zero when EV status changes from connected to charging.

## Create the helpers

1. Create an [Integral helper](https://www.home-assistant.io/integrations/integration/) using the charger's total power sensor, for example `sensor.amina_s_total_active_power`.
2. Configure its result in **kWh**: use hours as the integration time, with no metric prefix for a kW source, or the `k` prefix for a W source. Set a maximum sub-interval, such as one minute, to update the estimate even when power stays constant.
3. Create a [Utility Meter](https://www.home-assistant.io/integrations/utility_meter/) with the Integral helper as its source. Use a cumulative source, not delta values, and no scheduled reset cycle: the automation starts each session at zero. If configuring it in YAML, omit `cycle`.
4. Name the resulting meter `sensor.amina_s_total_active_energy_live`, or substitute your own ID below.

The Integral helper keeps accumulating energy. Setting the Utility Meter to zero does not reset the Integral helper; the meter continues tracking subsequent energy increments in **kWh**.

## Start each charging session at zero

Add this automation, using the exact status text reported by your entity. The example uses `EV connected` and `Charging`; adjust capitalization if your states differ:

```yaml
alias: Reset Amina S Live Session Energy
description: ""
triggers:
  - trigger: state
    entity_id:
      - sensor.amina_s_ev_status
    from: "EV connected"
    to: "Charging"
conditions: []
actions:
  - action: utility_meter.calibrate
    target:
      entity_id: sensor.amina_s_total_active_energy_live
    data:
      value: 0
mode: single
```

On that transition, the meter starts at zero and then accumulates energy from the Integral helper. This reset reflects the actual charger's session reporting, including when charging is stopped and started again. No calibration against the charger's energy reports is needed.

## Use it in the card

Select the live meter under **Optional override → Session energy entity**, or set:

```yaml
type: custom:amina-s-card
status_entity: sensor.amina_s_ev_status
energy_entity: sensor.amina_s_total_active_energy_live
```

This replaces the card's **Session** energy reading with the helper's estimate for the session.

## Energy dashboard

The live helper can also be used in Home Assistant's Energy dashboard. For tracking the charger's device consumption there, prefer the native `sensor.amina_s_total_active_energy` entity: it uses the charger's reported energy rather than an estimate from power. The live helper is useful for more frequent session updates in the card.

Adapt the power, status, and helper IDs for each charger or integration. The example keeps `sensor.amina_s_total_active_energy_live` as the existing helper ID, although it now represents session energy. This is an optional workaround: estimates depend on the power reports and do not make the charger itself report energy more frequently.
