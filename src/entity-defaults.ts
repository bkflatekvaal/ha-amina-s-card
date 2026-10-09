type Integration = "zha" | "mqtt";
interface RegistryEntity {
  entity_id: string;
  device_id?: string;
  platform?: string;
  config_entry_id?: string;
  original_name?: string;
  name?: string;
  unique_id?: string;
  translation_key?: string;
  original_device_class?: string;
  device_class?: string;
  unit_of_measurement?: string;
  disabled_by?: string;
}
interface RegistryCache {
  entities: Record<string, RegistryEntity>;
  devices: Record<string, any>;
  promise?: Promise<void>;
  expires: number;
  statusLookups: Map<string, Promise<void>>;
}
const registries = new WeakMap<object, RegistryCache>();
const CACHE_MS = 60_000;
const RETRY_MS = 30_000;

function cacheFor(hass: any): RegistryCache | undefined {
  const key = hass?.connection ?? hass;
  if (!key || typeof key !== "object") return undefined;
  let cache = registries.get(key);
  if (!cache) {
    cache = { entities: {}, devices: {}, expires: 0, statusLookups: new Map() };
    registries.set(key, cache);
  }
  return cache;
}

function entityEntries(hass: any): Record<string, RegistryEntity> {
  const cached = cacheFor(hass)?.entities ?? {};
  const entries = { ...cached };
  for (const [id, value] of Object.entries(hass?.entities ?? {})) {
    entries[id] = { ...cached[id], ...(value as RegistryEntity), entity_id: id };
  }
  return entries;
}

export function getRegistryEntity(entityId: string, hass: any): RegistryEntity | undefined {
  return entityEntries(hass)[entityId];
}

export function getRegistryDevice(statusEntity: string, hass: any) {
  const deviceId = getRegistryEntity(statusEntity, hass)?.device_id;
  return deviceId ? hass?.devices?.[deviceId] ?? cacheFor(hass)?.devices[deviceId] : undefined;
}

/** MQTT is treated as Zigbee2MQTT; unknown platforms also use those defaults. */
export function getIntegration(statusEntity: string, hass: any): Integration {
  const platform = getRegistryEntity(statusEntity, hass)?.platform;
  if (platform) return platform === "zha" ? "zha" : "mqtt";
  const identifiers = getRegistryDevice(statusEntity, hass)?.identifiers ?? [];
  const platforms = new Set(identifiers.map(([integration]) => integration)
    .filter((integration) => integration === "zha" || integration === "mqtt"));
  return platforms.size === 1 && platforms.has("zha") ? "zha" : "mqtt";
}

/** One snapshot per connection, shared by cards and editors; bounded retry/refresh. */
export async function loadIntegration(statusEntity: string, hass: any): Promise<void> {
  if (!statusEntity || !hass?.callWS) return;
  const cache = cacheFor(hass);
  if (!cache) return;
  if (!cache.promise && Date.now() >= cache.expires) {
    cache.promise = (async () => {
      const [entities, devices] = await Promise.allSettled([
        Promise.resolve().then(() => hass.callWS({ type: "config/entity_registry/list" })),
        Promise.resolve().then(() => hass.callWS({ type: "config/device_registry/list" })),
      ]);
      if (entities.status === "fulfilled" && Array.isArray(entities.value)) {
        cache.entities = Object.fromEntries(entities.value.filter((entry) => entry?.entity_id).map((entry) => [entry.entity_id, entry]));
      }
      if (devices.status === "fulfilled" && Array.isArray(devices.value)) {
        cache.devices = Object.fromEntries(devices.value.filter((entry) => entry?.id).map((entry) => [entry.id, entry]));
      }
      cache.statusLookups.clear();
      cache.expires = Date.now() + (entities.status === "fulfilled" && Array.isArray(entities.value) ? CACHE_MS : RETRY_MS);
    })().finally(() => { cache.promise = undefined; });
  }
  if (cache.promise) await cache.promise;
  const status = getRegistryEntity(statusEntity, hass);
  if ((!status?.device_id || !status?.platform) && !cache.statusLookups.has(statusEntity)) {
    const lookup = Promise.resolve().then(() => hass.callWS({ type: "config/entity_registry/get", entity_id: statusEntity }))
      .then((entry) => {
        if (entry && typeof entry === "object") cache.entities[statusEntity] = { ...entry, entity_id: statusEntity };
      }).catch(() => { /* Keep naming defaults if registry access is unavailable. */ });
    cache.statusLookups.set(statusEntity, lookup);
  }
  await cache.statusLookups.get(statusEntity);
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

const roles: Record<string, { domain: string; labels: string[]; deviceClass?: string; unit?: string }> = {
  power_entity: { domain: "sensor", labels: ["total active power", "total power"] },
  current_entity: { domain: "sensor", labels: ["current", "rms current", "current phase a"], deviceClass: "current", unit: "A" },
  voltage_entity: { domain: "sensor", labels: ["voltage", "rms voltage", "voltage phase a"], deviceClass: "voltage", unit: "V" },
  linkquality_entity: { domain: "sensor", labels: ["linkquality", "link quality", "lqi"] },
  energy_entity: { domain: "sensor", labels: ["last session energy", "session energy"] },
  charge_limit_entity: { domain: "number", labels: ["charge current limit", "charge limit"] },
  charger_entity: { domain: "switch", labels: ["state", "switch", "on off", "charger", "charger control", "charging enabled"] },
  alarm_entity: { domain: "binary_sensor", labels: ["alarm active"] },
  alarms_entity: { domain: "sensor", labels: ["alarms"] },
  derated_entity: { domain: "binary_sensor", labels: ["derated", "thermal derating"] },
  current_phase_b: { domain: "sensor", labels: ["current phase b", "rms current phase b"] },
  current_phase_c: { domain: "sensor", labels: ["current phase c", "rms current phase c"] },
  voltage_phase_b: { domain: "sensor", labels: ["voltage phase b", "rms voltage phase b"] },
  voltage_phase_c: { domain: "sensor", labels: ["voltage phase c", "rms voltage phase c"] },
};

const normalize = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const endsWithLabel = (text: string, label: string) => text === label || text.endsWith(` ${label}`);

function scoreEntity(entry: RegistryEntity, field: string, hass: any): number {
  const role = roles[field];
  if (entry.entity_id.split(".")[0] !== role.domain) return 0;
  const texts = [entry.translation_key, entry.original_name, entry.unique_id, entry.name, entry.entity_id.split(".")[1]]
    .map((text) => typeof text === "string" ? normalize(text).replace(/ zigbee2mqtt$/, "") : "");
  const stableLabel = texts.slice(0, 3).find((text) => Object.values(roles)
    .some((candidate) => candidate.labels.some((label) => endsWithLabel(text, label))));
  // Original integration metadata outranks user-assigned names, even if those
  // names contain another measurement's suffix.
  if (stableLabel && !role.labels.some((label) => endsWithLabel(stableLabel, label))) return 0;
  const semanticTexts = stableLabel ? [stableLabel] : texts;
  // Never confuse secondary phases, offline limits, or totals with a main reading.
  if (["current_entity", "voltage_entity"].includes(field)
    && semanticTexts.some((text) => /\b(phase [bc]|limit|frequency)\b/.test(text))) return 0;
  if (field === "charge_limit_entity" && semanticTexts.some((text) => /\b(offline|hardware)\b/.test(text))) return 0;
  if (field === "charger_entity" && semanticTexts.some((text) => /\b(offline|single phase|force|restart)\b/.test(text))) return 0;
  if (field === "energy_entity" && semanticTexts.some((text) => /\btotal\b/.test(text))) return 0;
  let score = 0;
  texts.forEach((text, index) => {
    if (role.labels.some((label) => endsWithLabel(text, label))) score = Math.max(score, [100, 95, 90, 70, 60][index]);
  });
  const attributes = hass?.states?.[entry.entity_id]?.attributes ?? {};
  const deviceClass = entry.original_device_class ?? entry.device_class ?? attributes.device_class;
  const unit = entry.unit_of_measurement ?? attributes.unit_of_measurement;
  // Main electrical readings can be identified without English names when unique.
  if (role.deviceClass && (deviceClass === role.deviceClass || unit === role.unit)) score = Math.max(score, 30);
  return score;
}

function belongsToStatus(entry: RegistryEntity, status: RegistryEntity): boolean {
  return Boolean(status.device_id && entry.device_id === status.device_id)
    && (!status.platform || !entry.platform || entry.platform === status.platform)
    && (!status.config_entry_id || !entry.config_entry_id || entry.config_entry_id === status.config_entry_id);
}

/** Naming fallbacks are rejected if the registry cannot confirm the selected owner. */
function safeFallback(entityId: string, status: RegistryEntity | undefined, entries: Record<string, RegistryEntity>): string | undefined {
  const entry = entries[entityId];
  if (!entry) return entityId;
  if (entry.device_id) return status && belongsToStatus(entry, status) ? entityId : undefined;
  if (status?.device_id || (status?.platform && entry.platform && status.platform !== entry.platform)) return undefined;
  return entityId;
}

function findEntity(field: string, fallback: string, status: RegistryEntity | undefined, entries: Record<string, RegistryEntity>, hass: any): string | undefined {
  if (status?.device_id) {
    const candidates = Object.values(entries).filter((entry) => belongsToStatus(entry, status))
      .map((entry) => ({ entry, score: scoreEntity(entry, field, hass) }))
      .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
    // Ties are ambiguous. Do not depend on registry ordering to pick a sensor.
    if (candidates.length && (candidates.length === 1 || candidates[0].score > candidates[1].score)) {
      return candidates[0].entry.entity_id;
    }
  }
  return safeFallback(fallback, status, entries);
}

export function getAutomaticEntities(statusEntity: string, hass: any): Record<string, string | undefined> {
  const defaults = getEntityDefaults(statusEntity, getIntegration(statusEntity, hass));
  const entries = entityEntries(hass);
  const status = entries[statusEntity];
  return Object.fromEntries(Object.entries(defaults).map(([field, fallback]) =>
    [field, findEntity(field, fallback, status, entries, hass)]));
}

export function getPhaseEntities(statusEntity: string, hass: any, field: "current" | "voltage", mainEntity: string | undefined, manualOverride: boolean): (string | undefined)[] {
  const entries = entityEntries(hass);
  const status = entries[statusEntity];
  return [mainEntity, ...["b", "c"].map((phase) => {
    if (!mainEntity) return undefined;
    const fallback = `${mainEntity}_phase_${phase}`;
    // Explicit main overrides retain the documented suffix convention.
    return manualOverride ? fallback : findEntity(`${field}_phase_${phase}`, fallback, status, entries, hass);
  })];
}

export function getDiscoverySignature(statusEntity: string, hass: any): string {
  const entities = getAutomaticEntities(statusEntity, hass);
  return JSON.stringify({ entities, device: getRegistryDevice(statusEntity, hass),
    current: getPhaseEntities(statusEntity, hass, "current", entities.current_entity, false),
    voltage: getPhaseEntities(statusEntity, hass, "voltage", entities.voltage_entity, false) });
}
