import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface AminaCardConfig {
  title?: string;
  status_entity: string;
  power_entity?: string;
  current_entity?: string;
  voltage_entity?: string;
  linkquality_entity?: string;
  energy_entity?: string;
  charge_limit_entity?: string;
  charger_entity?: string;
  alarm_entity?: string;
  alarms_entity?: string;
  derated_entity?: string;
  advanced?: boolean;
}

class AminaCardConfigEditor extends HTMLElement {
  private _config: Partial<AminaCardConfig> = {};
  private _inputs: { [key: string]: HTMLInputElement | any } = {};
  private _hass: any;
  private _showOptional = false;

  set hass(value: any) {
    this._hass = value;
    if (this.isConnected) {
      this.querySelectorAll("ha-entity-picker").forEach((picker: any) => {
        picker.hass = value;
      });
    }
  }

  get hass() {
    return this._hass;
  }

  setConfig(config: Partial<AminaCardConfig>) {
    this._config = config || {};
    this.render();
  }

  private getEntityOptions(field: string) {
    const states = this.hass?.states ?? {};
    const entityIds = Object.keys(states);

    const filterMap: Record<string, (state: any) => boolean> = {
      status_entity: (state) => !state ? false : state.entity_id.startsWith("sensor."),
      power_entity: (state) => !state ? false : state.entity_id.startsWith("sensor.") && (state.attributes.device_class === "power" || state.attributes.unit_of_measurement === "kW" || state.attributes.unit_of_measurement === "W"),
      current_entity: (state) => !state ? false : state.entity_id.startsWith("sensor.") && (state.attributes.device_class === "current" || state.attributes.unit_of_measurement === "A"),
      voltage_entity: (state) => !state ? false : state.entity_id.startsWith("sensor.") && (state.attributes.device_class === "voltage" || state.attributes.unit_of_measurement === "V"),
      linkquality_entity: (state) => !state ? false : state.entity_id.startsWith("sensor.") && (state.attributes.device_class === "signal_strength" || state.attributes.device_class === "signal" || ["lqi", "dB", "dBm"].includes(state.attributes.unit_of_measurement) || state.entity_id.toLowerCase().includes("linkquality")),
      energy_entity: (state) => !state ? false : state.entity_id.startsWith("sensor.") && (state.attributes.device_class === "energy" || state.attributes.unit_of_measurement === "kWh" || state.attributes.unit_of_measurement === "Wh"),
      charge_limit_entity: (state) => !state ? false : state.entity_id.startsWith("number."),
      charger_entity: (state) => !state ? false : state.entity_id.startsWith("switch."),
      alarm_entity: (state) => !state ? false : state.entity_id.startsWith("binary_sensor."),
      alarms_entity: (state) => !state ? false : state.entity_id.startsWith("sensor."),
      derated_entity: (state) => !state ? false : state.entity_id.startsWith("binary_sensor."),
    };

    const matcher = filterMap[field] || (() => true);
    return entityIds.filter((entity_id) => matcher(this.hass.states[entity_id])).sort();
  }

  private getDefaultEntity(field: string): string | undefined {
    const statusEntity = (this._config.status_entity ?? "").trim();
    const entityName = statusEntity.split(".").pop() ?? "";
    const baseName = entityName
      .replace(/_status$/i, "")
      .replace(/_ev$/i, "")
      .replace(/_charger$/i, "")
      .trim();

    if (!baseName) return undefined;

    const defaults: Record<string, string> = {
      power_entity: `sensor.${baseName}_power`,
      current_entity: `sensor.${baseName}_current`,
      voltage_entity: `sensor.${baseName}_voltage`,
      linkquality_entity: `sensor.${baseName}_linkquality`,
      energy_entity: `sensor.${baseName}_last_session_energy`,
      charge_limit_entity: `number.${baseName}_charge_limit`,
      charger_entity: `switch.${baseName}`,
      alarm_entity: `binary_sensor.${baseName}_alarm_active`,
      alarms_entity: `sensor.${baseName}_alarms`,
      derated_entity: `binary_sensor.${baseName}_derated`,
    };

    return defaults[field];
  }

  private appendFieldHelper(wrapper: HTMLElement, field: string) {
    const helper = document.createElement("div");
    const defaultEntity = this.getDefaultEntity(field);
    helper.textContent = defaultEntity
      ? `Default: ${defaultEntity}`
      : "Select a status entity to calculate the default";
    helper.style.fontSize = "12px";
    helper.style.color = "var(--secondary-text-color)";
    wrapper.appendChild(helper);
  }

  private renderEntityField(key: string, label: string, required = false) {
    if (customElements.get("ha-entity-picker")) {
      const wrapper = document.createElement("div");
      wrapper.style.display = "grid";
      wrapper.style.gap = "4px";

      const labelEl = document.createElement("label");
      labelEl.textContent = label + (required ? " *" : "");
      labelEl.style.fontSize = "12px";
      labelEl.style.color = "var(--primary-text-color)";
      wrapper.appendChild(labelEl);
      if (key !== "status_entity") this.appendFieldHelper(wrapper, key);

      const picker = document.createElement("ha-entity-picker") as any;
      picker.dataset.key = key;
      picker.hass = this._hass;
      picker.value = (this._config as any)[key] ?? "";
      picker.includeDomains = this.getDomainForField(key);
      picker.includeDeviceClasses = this.getDeviceClassesForField(key);
      picker.includeUnitOfMeasurement = this.getUnitsForField(key);
      picker.style.width = "100%";
      picker.addEventListener("value-changed", (event: any) => {
        this.updateConfig(key, event.detail?.value);
      });
      wrapper.appendChild(picker);
      return wrapper;
    }

    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "4px";

    const labelEl = document.createElement("label");
    labelEl.textContent = label + (required ? " *" : "");
    labelEl.style.fontSize = "12px";
    labelEl.style.color = "var(--primary-text-color)";
    wrapper.appendChild(labelEl);
    if (key !== "status_entity") this.appendFieldHelper(wrapper, key);

    const select = document.createElement("select");
    select.dataset.key = key;
    select.style.width = "100%";
    select.style.padding = "8px 10px";
    select.style.border = "1px solid var(--divider-color)";
    select.style.borderRadius = "8px";
    select.style.background = "var(--card-background-color)";
    select.style.color = "var(--primary-text-color)";

    const value = (this._config as any)[key] ?? "";
    const options = this.getEntityOptions(key);
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select entity";
    select.appendChild(defaultOption);

    options.forEach((entityId) => {
      const option = document.createElement("option");
      option.value = entityId;
      option.textContent = entityId;
      option.selected = entityId === value;
      select.appendChild(option);
    });

    select.addEventListener("change", () => this.updateConfig(key, select.value));
    wrapper.appendChild(select);
    return wrapper;
  }

  private getDeviceClassesForField(field: string): string[] | undefined {
    const deviceClasses: Record<string, string> = {
      power_entity: "power",
      current_entity: "current",
      voltage_entity: "voltage",
      energy_entity: "energy",
    };

    return deviceClasses[field] ? [deviceClasses[field]] : undefined;
  }

  private getUnitsForField(field: string): string[] | undefined {
    return field === "linkquality_entity" ? ["lqi"] : undefined;
  }

  private renderTextField(key: string, label: string) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "4px";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.style.fontSize = "12px";
    labelEl.style.color = "var(--primary-text-color)";
    wrapper.appendChild(labelEl);

    const input = document.createElement("input");
    input.dataset.key = key;
    input.value = (this._config as any)[key] ?? "";
    input.style.padding = "8px 10px";
    input.style.border = "1px solid var(--divider-color)";
    input.style.borderRadius = "8px";
    input.style.background = "var(--card-background-color)";
    input.style.color = "var(--primary-text-color)";
    input.addEventListener("input", () => this.updateConfig());
    wrapper.appendChild(input);
    return wrapper;
  }

  private getDomainForField(field: string): string[] {
    const domains: Record<string, string[]> = {
      status_entity: ["sensor"],
      power_entity: ["sensor"],
      current_entity: ["sensor"],
      voltage_entity: ["sensor"],
      linkquality_entity: ["sensor"],
      energy_entity: ["sensor"],
      charge_limit_entity: ["number"],
      charger_entity: ["switch"],
      alarm_entity: ["binary_sensor"],
      alarms_entity: ["sensor"],
      derated_entity: ["binary_sensor"],
    };

    return domains[field] || ["sensor", "binary_sensor", "number", "switch"];
  }

  private updateConfig(changedKey?: string, changedValue?: string) {
    const config = { ...this._config };
    const inputs = this.querySelectorAll("[data-key]");
    inputs.forEach((input: any) => {
      const key = input.getAttribute("data-key");
      if (!key) return;
      const value = input.value ?? input.getAttribute("value") ?? "";
      if (value) {
        config[key as keyof AminaCardConfig] = value as any;
      } else {
        delete config[key as keyof AminaCardConfig];
      }
    });

    if (changedKey) {
      if (changedValue) {
        config[changedKey as keyof AminaCardConfig] = changedValue as any;
      } else {
        delete config[changedKey as keyof AminaCardConfig];
      }
    }

    this._config = config;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );

    if (changedKey === "status_entity") this.render();
  }

  render() {
    const root = document.createElement("div");
    root.style.display = "grid";
    root.style.gap = "12px";
    root.style.padding = "12px 0";

    root.appendChild(this.renderTextField("title", "Title"));
    root.appendChild(this.renderEntityField("status_entity", "Status entity", true));

    const optionalHeader = document.createElement("div");
    optionalHeader.style.display = "flex";
    optionalHeader.style.alignItems = "center";
    optionalHeader.style.justifyContent = "space-between";
    optionalHeader.style.marginTop = "4px";

    const optionalLabel = document.createElement("div");
    optionalLabel.textContent = "Optional override";
    optionalLabel.style.fontSize = "12px";
    optionalLabel.style.fontWeight = "600";
    optionalLabel.style.color = "var(--primary-text-color)";
    optionalHeader.appendChild(optionalLabel);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = this._showOptional ? "Hide" : "Show";
    toggleButton.style.border = "1px solid var(--divider-color)";
    toggleButton.style.borderRadius = "999px";
    toggleButton.style.background = "transparent";
    toggleButton.style.color = "var(--primary-text-color)";
    toggleButton.style.padding = "4px 10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.addEventListener("click", () => {
      this._showOptional = !this._showOptional;
      this.render();
    });
    optionalHeader.appendChild(toggleButton);
    root.appendChild(optionalHeader);

    if (this._showOptional) {
      [
        ["power_entity", "Power entity"],
        ["current_entity", "Current entity"],
        ["voltage_entity", "Voltage entity"],
        ["linkquality_entity", "Link quality entity"],
        ["energy_entity", "Session energy entity"],
        ["charge_limit_entity", "Charge limit entity"],
        ["charger_entity", "Switch entity"],
        ["alarm_entity", "Alarm entity"],
        ["alarms_entity", "Alarm list entity"],
        ["derated_entity", "Derated entity"],
      ].forEach(([key, label]) => {
        root.appendChild(this.renderEntityField(key, label, false));
      });
    }

    this.innerHTML = "";
    this.appendChild(root);
  }
}

@customElement("amina-s-card")
export class AminaSCard extends LitElement {
  @property({ attribute: false }) public hass: any;
  @property({ attribute: false }) public config!: AminaCardConfig;

  static styles = css`
    :host {
      display: block;
      --amina-card-bg: var(--card-background-color, #ffffff);
      --amina-card-surface: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      --amina-card-surface-strong: var(--ha-card-background, rgba(0, 0, 0, 0.06));
      --amina-text: var(--primary-text-color, #1d1d1f);
      --amina-muted: var(--secondary-text-color, #666c74);
      --amina-border: var(--divider-color, rgba(0, 0, 0, 0.12));
      --amina-accent: var(--state-icon-active-color, #3b82f6);
      --amina-accent-2: var(--success-color, #2eae69);
      --amina-warning: var(--warning-color, #d58f1b);
      --amina-danger: var(--error-color, #d64545);
      --amina-shadow: rgba(0, 0, 0, 0.12);
    }

    ha-card {
      display: block;
      background: var(--amina-card-bg);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 8px 20px var(--amina-shadow);
      border: 1px solid var(--amina-border);
    }

    .card {
      padding: 0 14px 10px;
      color: var(--amina-text);
      position: relative;
    }

    .card-header {
      padding: 16px 6px 12px;
      color: var(--amina-text);
      font-size: 1.5rem;
      line-height: 1.2;
      font-weight: 400;
    }

    .header {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 10px;
      margin-bottom: 12px;
    }

    .top-right {
      justify-self: end;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      padding-top: 2px;
      min-width: 72px;
    }

    .telemetry-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      font-size: 0.9rem;
      line-height: 1.15;
      letter-spacing: 0.04em;
      color: var(--amina-text);
      white-space: nowrap;
    }

    .telemetry-value {
      font-weight: 700;
      color: var(--amina-text);
    }

    .telemetry-icon {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
      display: inline-block;
      color: var(--amina-muted);
      opacity: 0.9;
      flex-shrink: 0;
    }

    .charger-visual {
      width: 78px;
      height: 114px;
      margin: 0;
      position: relative;
      display: grid;
      place-items: center;
    }

    .charger-icon {
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));
    }

    .status-wrap {
      text-align: left;
      margin: 0;
      min-width: 0;
    }

    .status-main {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: var(--amina-text);
    }

    .status-secondary {
      font-size: 0.8rem;
      color: var(--amina-muted);
      letter-spacing: 0.02em;
      min-height: 1.2em;
    }

    .status-warning {
      color: var(--amina-warning);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      margin-top: 6px;
      margin-bottom: 0;
      border-top: 1px solid var(--amina-border);
      border-bottom: 1px solid var(--amina-border);
    }

    .metric {
      padding: 10px 6px 8px;
      min-height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      text-align: center;
      border-right: 1px solid var(--amina-border);
      background: rgba(255,255,255,0.01);
    }

    .metric:last-child {
      border-right: none;
    }

    .action-toggle {
      appearance: none;
      border: 1px solid var(--amina-border);
      background: rgba(255,255,255,0.02);
      color: var(--amina-text);
      font-size: 0.8rem;
      line-height: 1;
      padding: 6px 10px 6px 8px;
      margin-top: 8px;
      cursor: pointer;
      opacity: 0.95;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .metric-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: var(--amina-muted);
    }

    .metric-value {
      font-size: 0.98rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--amina-text);
    }

    @media (max-width: 420px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;

  setConfig(config: Partial<AminaCardConfig>) {
    if (!config.status_entity) {
      throw new Error("You must set status_entity");
    }

    const statusEntity = config.status_entity;
    const baseName = this.extractStatusBaseName(statusEntity);

    const inferredConfig: Partial<AminaCardConfig> = {
      title: "Amina S Charger",
      status_entity: statusEntity,
      power_entity: baseName ? `sensor.${baseName}_power` : undefined,
      current_entity: baseName ? `sensor.${baseName}_current` : undefined,
      voltage_entity: baseName ? `sensor.${baseName}_voltage` : undefined,
      linkquality_entity: baseName ? `sensor.${baseName}_linkquality` : undefined,
      energy_entity: baseName ? `sensor.${baseName}_last_session_energy` : undefined,
      charge_limit_entity: baseName ? `number.${baseName}_charge_limit` : undefined,
      charger_entity: baseName ? `switch.${baseName}` : undefined,
      alarm_entity: baseName ? `binary_sensor.${baseName}_alarm_active` : undefined,
      alarms_entity: baseName ? `sensor.${baseName}_alarms` : undefined,
      derated_entity: baseName ? `binary_sensor.${baseName}_derated` : undefined,
    };

    this.config = {
      ...inferredConfig,
      ...config,
    } as AminaCardConfig;
  }

  private extractStatusBaseName(statusEntity: string): string {
    const entityId = statusEntity.split(".").pop() ?? statusEntity;
    if (!entityId) return "";

    return entityId
      .replace(/_status$/i, "")
      .replace(/_ev$/i, "")
      .replace(/_charger$/i, "")
      .trim();
  }

  private getEntity(entityId?: string) {
    if (!entityId || !this.hass?.states?.[entityId]) return undefined;
    return this.hass.states[entityId];
  }

  private getState(entityId?: string): string {
    return this.getEntity(entityId)?.state ?? "-";
  }

  private getEntityIcon(entityId?: string): string {
    const icon = this.getEntity(entityId)?.attributes?.icon;
    return typeof icon === "string" && icon.trim() ? icon : "";
  }

  private getEntityUnit(entityId?: string): string {
    const unit = this.getEntity(entityId)?.attributes?.unit_of_measurement;
    return typeof unit === "string" && unit.trim() ? unit : "";
  }

  private getNumberValue(entityId?: string): number {
    const state = this.getEntity(entityId)?.state;
    const parsed = Number(state);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private getBooleanValue(entityId?: string): boolean {
    const state = this.getState(entityId).toLowerCase();
    if (state === "on" || state === "true" || state === "enabled" || state === "enable") {
      return true;
    }
    if (state === "off" || state === "false" || state === "disabled" || state === "disable") {
      return false;
    }
    return false;
  }

  private normaliseStatus(value: string): string {
    return value?.trim() || "Unknown";
  }

  private getAlarmList(entityId?: string): string[] {
    const raw = this.getEntity(entityId)?.state;
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === "string") {
      const value = raw.replace(/\[|\]|'/g, "").trim();
      return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
    }
    return [];
  }

  private getAlarmMessage(): string {
    const alarmActive = this.getBooleanValue(this.config.alarm_entity);
    const derated = this.getBooleanValue(this.config.derated_entity);
    if (!alarmActive && !derated) return "";

    const list = this.getAlarmList(this.config.alarms_entity)
      .map((item) => item.trim())
      .filter((item) => !!item)
      .filter((item) => !["unknown", "none", "normal", "idle", "no alarm", "no_alarm", "-"].includes(item.toLowerCase()));

    if (list.length) {
      return list.join(", ");
    }

    return derated ? "Power reduced" : "Warning";
  }

  private showMoreInfo(entityId?: string) {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private formatNumber(value: number, digits = 1): string {
    if (!Number.isFinite(value)) return "-";

    const locale = this.hass?.config?.locale || this.hass?.locale || undefined;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: false,
    }).format(value);
  }

  private async toggleCharger() {
    const entityId = this.config.charger_entity;
    if (!entityId) return;

    const state = this.getState(entityId).toLowerCase();
    if (state === "on") {
      await this.hass.callService("switch", "turn_off", { entity_id: entityId });
      return;
    }

    await this.hass.callService("switch", "turn_on", { entity_id: entityId });
  }

  private getLedColor(): string {
    const status = this.normaliseStatus(this.getState(this.config.status_entity)).toLowerCase();
    const alarmActive = this.getBooleanValue(this.config.alarm_entity);
    const derated = this.getBooleanValue(this.config.derated_entity);

    if (status === "charging") return "#52d98f";
    if (alarmActive || derated) return "#ffb35c";
    if (status === "ev connected") return "#7ec8ff";
    return "#dfe7f2";
  }

  private getStatusMeta() {
    const status = this.normaliseStatus(this.getState(this.config.status_entity));
    const normalized = status.toLowerCase();
    const charging = normalized === "charging";
    const connected = normalized === "ev connected";
    const alarmActive = this.getBooleanValue(this.config.alarm_entity);
    const derated = this.getBooleanValue(this.config.derated_entity);
    const alarmText = this.getAlarmMessage();
    const hasAlarm = Boolean(alarmText);

    let mainStatus = status;
    let statusClass = "status-connected";

    if (normalized === "charging") {
      mainStatus = "Charging";
      statusClass = "status-charging";
    } else if (normalized === "ev connected") {
      mainStatus = "EV Connected";
      statusClass = "status-connected";
    } else if (normalized === "not connected") {
      mainStatus = "Not Connected";
      statusClass = "status-connected";
    } else if (normalized === "unavailable" || normalized === "unknown") {
      mainStatus = status;
      statusClass = "status-warning";
    }

    const secondary =
      hasAlarm
        ? alarmText
        : charging
          ? "Power is being delivered"
          : connected
            ? "Vehicle connected"
            : "Waiting for vehicle";

    return { status, connected, charging, alarmActive, derated, alarmText, mainStatus, statusClass, secondary };
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    const chargeLimit = this.getNumberValue(this.config.charge_limit_entity);

    const power = this.getNumberValue(this.config.power_entity);
    const current = this.getNumberValue(this.config.current_entity);
    const voltage = this.getNumberValue(this.config.voltage_entity);
    const linkquality = this.getNumberValue(this.config.linkquality_entity);
    const voltageIcon = this.getEntityIcon(this.config.voltage_entity) || "mdi:sine-wave";
    const linkqualityIcon = this.getEntityIcon(this.config.linkquality_entity) || "mdi:signal";
    const linkqualityUnit = this.getEntityUnit(this.config.linkquality_entity) || "";
    const { mainStatus, statusClass, secondary, charging, connected, alarmActive, derated, alarmText } = this.getStatusMeta();
    const isCharging = charging;
    const isConnected = connected;
    const sessionEnergy = this.getNumberValue(this.config.energy_entity);
    const displayEnergy = isCharging || isConnected ? sessionEnergy : Math.max(sessionEnergy, 0);

    const chargerState = this.getState(this.config.charger_entity).toLowerCase();
    const chargerOn = chargerState === "on";
    const ledColor = this.getLedColor();

    return html`
      <ha-card>
        <div class="card">
          <div class="card-header">${this.config.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${ledColor}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${statusClass}" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">${mainStatus}</div>
              <div class="status-secondary ${alarmActive || derated ? "status-warning" : ""}">${secondary}</div>
              <button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${chargerOn ? "Stop charging" : "Start charging"}">
                ${chargerOn ? "Stop ■" : "Start ▶"}
              </button>
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(voltage, 1)} V</span>
                <ha-icon class="telemetry-icon" .icon=${voltageIcon}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(linkquality, 0)}${linkqualityUnit ? ` ${linkqualityUnit}` : ""}</span>
                <ha-icon class="telemetry-icon" .icon=${linkqualityIcon}></ha-icon>
              </div>
            </div>
          </div>

          <div class="metrics">
            <div class="metric" @click=${() => this.showMoreInfo(this.config.charge_limit_entity)} style="cursor:pointer;">
              <div class="metric-label">Charge limit</div>
              <div class="metric-value">${this.formatNumber(chargeLimit, 0)} A</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.power_entity)} style="cursor:pointer;">
              <div class="metric-label">Power</div>
              <div class="metric-value">${this.formatNumber(power / 1000, 1)} kW</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.current_entity)} style="cursor:pointer;">
              <div class="metric-label">Current</div>
              <div class="metric-value">${this.formatNumber(current, 1)} A</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.energy_entity)} style="cursor:pointer;">
              <div class="metric-label">Session</div>
              <div class="metric-value">${this.formatNumber(displayEnergy, 2)} kWh</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 4;
  }

  static getStubConfig() {
    return {
      title: "Amina S Charger",
      status_entity: "sensor.amina_s_ev_status",
      power_entity: "sensor.amina_s_power",
      current_entity: "sensor.amina_s_current",
      voltage_entity: "sensor.amina_s_voltage",
      linkquality_entity: "sensor.amina_s_linkquality",
      energy_entity: "sensor.amina_s_last_session_energy",
      charge_limit_entity: "number.amina_s_charge_limit",
      charger_entity: "switch.amina_s",
      alarm_entity: "binary_sensor.amina_s_alarm_active",
      alarms_entity: "sensor.amina_s_alarms",
      derated_entity: "binary_sensor.amina_s_derated",
      advanced: false,
    };
  }

  static getConfigElement() {
    return document.createElement("amina-s-card-config-editor");
  }
}

customElements.define("amina-s-card-config-editor", AminaCardConfigEditor);

declare global {
  interface HTMLElementTagNameMap {
    "amina-s-card": AminaSCard;
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card using the native Zigbee2MQTT exposes."
});