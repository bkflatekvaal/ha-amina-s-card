type Integration = "zha" | "mqtt";
const registryLookups = new WeakMap<object, Map<string, { platform?: string; promise: Promise<void> }>>();

function registryEntry(statusEntity: string, hass: any) {
  return registryLookups.get(hass?.connection ?? hass)?.get(statusEntity);
}

/** MQTT is treated as Zigbee2MQTT; unknown platforms also use those defaults. */
export function getIntegration(statusEntity: string, hass: any): Integration {
  const platform = hass?.entities?.[statusEntity]?.platform ?? registryEntry(statusEntity, hass)?.platform;
  return platform === "zha" ? "zha" : "mqtt";
}

export function loadIntegration(statusEntity: string, hass: any): Promise<void> {
  if (!statusEntity || !hass?.callWS || hass.entities?.[statusEntity]?.platform) return Promise.resolve();
  const key = hass.connection ?? hass;
  let entries = registryLookups.get(key);
  if (!entries) registryLookups.set(key, entries = new Map());
  const cached = entries.get(statusEntity);
  if (cached) return cached.promise;
  const entry = { platform: undefined as string | undefined, promise: undefined as Promise<void> };
  entry.promise = Promise.resolve().then(() => hass.callWS({
    type: "config/entity_registry/get", entity_id: statusEntity,
  })).then((result) => { entry.platform = result?.platform; }).catch(() => {
    // Registry access may be unavailable; retain the requested MQTT defaults.
  });
  entries.set(statusEntity, entry);
  return entry.promise;
}

/** Explicit overrides are applied by the caller after integration defaults. */
export function getEntityDefaults(statusEntity: string, integration: Integration = "mqtt") {
  const baseName = statusEntity.split(".").pop()
    ?.replace(/_status$/i, "")
    .replace(/_ev$/i, "")
    .replace(/_charger$/i, "")
    .trim();
  if (!baseName) return {};

  const zha = integration === "zha";
  return {
    power_entity: `sensor.${baseName}_${zha ? "total_power" : "total_active_power"}`,
    current_entity: `sensor.${baseName}_current`,
    voltage_entity: `sensor.${baseName}_voltage`,
    linkquality_entity: `sensor.${baseName}_${zha ? "lqi" : "linkquality"}`,
    energy_entity: `sensor.${baseName}_last_session_energy`,
    charge_limit_entity: `number.${baseName}_${zha ? "charge_current_limit" : "charge_limit"}`,
    charger_entity: `switch.${baseName}`,
    alarm_entity: `binary_sensor.${baseName}_alarm_active`,
    alarms_entity: `sensor.${baseName}_alarms`,
    derated_entity: `binary_sensor.${baseName}_derated`,
  };
}
