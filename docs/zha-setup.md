# ZHA setup

ZHA exposes limited Amina S functionality without a custom quirk. Install the community [Amina S ZHA quirk](https://github.com/attaxia/amina_s_zha_quirk) following its installation instructions, restart Home Assistant, and reconfigure the charger in ZHA. If entities remain missing, follow the quirk's guidance to remove and pair the charger again.

After installation, use Home Assistant's **Recreate entity IDs** action on the device page, check the resulting IDs, and select the new EV status entity in the card. Update any existing card overrides and automation references as needed.

The card detects ZHA from the selected status entity's registry entry and uses `_total_power`, `_lqi`, and `_charge_current_limit` defaults. Actual IDs can differ; use **Optional override** to select them, particularly for the charger switch and thermal derating sensor.

Enable **LQI** manually under **Diagnostics** on the device page. Its expected ID is `sensor.<name>_lqi`. Link quality also requires manual enablement for Zigbee2MQTT.

Some quirk entities may briefly remain unknown until the charger reports its state. Both the quirk author and this card's testing have covered single-phase operation; live three-phase validation remains outstanding.

See [configuration](configuration.md) for expected IDs and overrides.
