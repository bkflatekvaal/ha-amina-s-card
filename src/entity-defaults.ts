/** Resolve naming conventions from live entities; explicit overrides stay authoritative. */
export function getEntityDefaults(statusEntity: string, states: Record<string, unknown> = {}) {
  const baseName = statusEntity.split(".").pop()
    ?.replace(/_status$/i, "")
    .replace(/_ev$/i, "")
    .replace(/_charger$/i, "")
    .trim();
  if (!baseName) return {};

  const choose = (...entityIds: string[]) =>
    entityIds.find((entityId) => entityId in states) ?? entityIds[0];

  return {
    power_entity: `sensor.${baseName}_total_active_power`,
    current_entity: `sensor.${baseName}_current`,
    voltage_entity: `sensor.${baseName}_voltage`,
    linkquality_entity: choose(`sensor.${baseName}_linkquality`, `sensor.${baseName}_lqi`),
    energy_entity: `sensor.${baseName}_last_session_energy`,
    charge_limit_entity: choose(`number.${baseName}_charge_limit`, `number.${baseName}_charge_current_limit`),
    charger_entity: `switch.${baseName}`,
    alarm_entity: `binary_sensor.${baseName}_alarm_active`,
    alarms_entity: `sensor.${baseName}_alarms`,
    derated_entity: `binary_sensor.${baseName}_derated`,
  };
}
