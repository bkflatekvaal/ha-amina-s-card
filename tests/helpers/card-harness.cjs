const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

class Element {
  constructor(tag = '') { this.tagName = tag; this.children = []; this.style = {}; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.isConnected = true; }
  appendChild(child) { this.children.push(child); return child; }
  set innerHTML(value) { this.children = []; }
  getAttribute(name) { return name.startsWith('data-') ? this.dataset[name.slice(5)] ?? null : this.attributes[name] ?? null; }
  addEventListener(type, listener) { (this.listeners[type] ??= []).push(listener); }
  dispatchEvent(event) { for (const listener of this.listeners[event.type] ?? []) listener(event); return true; }
  querySelectorAll(selector) {
    const matches = [];
    for (const child of this.children) {
      if (selector === '[data-key]' ? child.dataset.key !== undefined : child.tagName === selector) matches.push(child);
      matches.push(...child.querySelectorAll(selector));
    }
    return matches;
  }
  requestUpdate() { this.updates = (this.updates ?? 0) + 1; }
}
class CustomEvent {
  constructor(type, options = {}) { this.type = type; Object.assign(this, options); }
}
function loadCard({ pickers = true } = {}) {
  const definitions = new Map(pickers ? [['ha-entity-picker', Element]] : []);
  const html = (strings, ...values) => strings.reduce((result, text, i) => result + text + (typeof values[i] === 'function' ? '' : Array.isArray(values[i]) ? values[i].join('') : values[i] ?? ''), '');
  const modules = {};
  for (const name of ['entity-defaults', 'phase-telemetry', 'amina-s-card']) {
    const exports = {};
    runInNewContext(ts.transpileModule(readFileSync(`src/${name}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText, {
      exports, HTMLElement: Element, CustomEvent, window: {}, document: { createElement: tag => new Element(tag) },
      customElements: { define: (tag, constructor) => definitions.set(tag, constructor), get: tag => definitions.get(tag) },
      require: path => path.startsWith('./') ? modules[path.slice(2)] : path === 'lit' ? { LitElement: Element, html, css: html } : { customElement: () => () => {}, property: () => () => {} }
    });
    modules[name] = exports;
  }
  return { Card: modules['amina-s-card'].AminaSCard, Editor: definitions.get('amina-s-card-config-editor'), ...modules['entity-defaults'] };
}
function makeCard(Card, name = 'garage', integration = 'mqtt') {
  const card = new Card();
  const calls = [];
  const state = (value, unit) => ({ state: value, attributes: unit ? { unit_of_measurement: unit } : {} });
  const status = `sensor.${name}_ev_status`;
  card.setConfig({ status_entity: status });
  card.hass = {
    locale: 'en-US', entities: { [status]: { platform: integration } },
    states: {
      [status]: state('EV connected'), [`switch.${name}`]: state('off'),
      [`sensor.${name}_${integration === 'zha' ? 'total_power' : 'total_active_power'}`]: state('3.2', 'kW'),
      [`sensor.${name}_current`]: state('14', 'A'), [`sensor.${name}_voltage`]: state('230', 'V'),
      [`sensor.${name}_last_session_energy`]: state('1.25', 'kWh'),
    },
    callService: async (...args) => { calls.push(args); },
  };
  return { card, calls, state };
}
const plain = value => JSON.parse(JSON.stringify(value));
module.exports = { loadCard, makeCard, CustomEvent, plain };
