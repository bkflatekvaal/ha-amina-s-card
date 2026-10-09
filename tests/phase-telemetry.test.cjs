const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const modules = {};
const html = (strings, ...values) => strings.reduce((result, text, i) => result + text + (typeof values[i] === 'function' ? '' : Array.isArray(values[i]) ? values[i].join('') : values[i] ?? ''), '');
for (const name of ['entity-defaults', 'phase-telemetry', 'amina-s-card']) {
  const exports = {};
  runInNewContext(ts.transpileModule(readFileSync(`src/${name}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText, {
    exports, HTMLElement: class {}, window: {}, customElements: { define() {} },
    require: path => path.startsWith('./') ? modules[path.slice(2)] : path === 'lit' ? { LitElement: class { requestUpdate() {} }, html, css: html } : { customElement: () => () => {}, property: () => () => {} }
  });
  modules[name] = exports;
}
const { getPhaseTelemetry } = modules['phase-telemetry'];
function makeCard(charging = true) {
  const card = new modules['amina-s-card'].AminaSCard();
  card.setConfig({ status_entity: 'sensor.garage_ev_status' });
  const states = { 'sensor.garage_ev_status': { state: charging ? 'Charging' : 'EV connected', attributes: {} } };
  for (const [suffix, power, current, voltage] of [['', 2300, 10, 230], ['_phase_b', 2310, 11, 231], ['_phase_c', 2290, 12, 229]]) {
    for (const [kind, value, unit] of [['power', power, 'W'], ['current', current, 'A'], ['voltage', voltage, 'V']]) {
      states[`sensor.garage_${kind}${suffix}`] = { state: String(value), attributes: { unit_of_measurement: unit } };
    }
  }
  states['sensor.garage_total_active_power'] = { state: '7.5', attributes: { unit_of_measurement: 'kW' } };
  card.hass = { states, locale: 'en-US' };
  return card;
}
test('three-phase renders individual current lines, average voltage, and device total power', () => {
  const output = makeCard().render();
  for (const reading of ['A: 10.0 A', 'B: 11.0 A', 'C: 12.0 A', '3p 230.0 V', '7.5 kW']) assert.ok(output.includes(reading));
  assert.ok(!output.includes('33.0 A'));
});
test('single-phase renders only main current and always uses total power', () => {
  const card = makeCard();
  card.hass.states['sensor.garage_power'].state = '0';
  card.hass.states['sensor.garage_power_phase_c'].state = '0';
  const output = card.render();
  assert.ok(output.includes('10.0 A'));
  assert.ok(!output.includes('11.0 A'));
  assert.ok(!output.includes('3p '));
  assert.ok(output.includes('231.0 V'));
  assert.ok(output.includes('7.5 kW'));
});
test('missing total power shows dash instead of summing phase powers', () => {
  const card = makeCard();
  delete card.hass.states['sensor.garage_total_active_power'];
  assert.ok(/Power<\/div>\s*<div class="metric-value">-<\/div>/.test(card.render()));
});
test('missing current phase shows dash independently; actual zero remains visible', () => {
  const card = makeCard();
  card.hass.states['sensor.garage_current_phase_b'].state = 'unavailable';
  card.hass.states['sensor.garage_current_phase_c'].state = '0';
  const output = card.render();
  assert.ok(output.includes('A: 10.0 A')); assert.ok(output.includes('B: -')); assert.ok(output.includes('C: 0.0 A'));
});
test('custom current and voltage overrides derive their phase entities', () => {
  const card = makeCard();
  card.hass.states['sensor.custom_power'] = { state: '8000', attributes: { unit_of_measurement: 'W' } };
  card.hass.states['sensor.custom_current'] = { state: '16', attributes: {} };
  card.hass.states['sensor.custom_current_phase_b'] = { state: '17', attributes: {} };
  card.hass.states['sensor.custom_current_phase_c'] = { state: '18', attributes: {} };
  card.hass.states['sensor.custom_voltage'] = { state: '240', attributes: {} };
  card.hass.states['sensor.custom_voltage_phase_b'] = { state: '243', attributes: {} };
  card.hass.states['sensor.custom_voltage_phase_c'] = { state: '246', attributes: {} };
  card.setConfig({ status_entity: 'sensor.garage_ev_status', power_entity: 'sensor.custom_power', current_entity: 'sensor.custom_current', voltage_entity: 'sensor.custom_voltage' });
  const output = card.render();
  for (const reading of ['8.0 kW', 'A: 16.0 A', 'B: 17.0 A', 'C: 18.0 A', '3p 243.0 V']) assert.ok(output.includes(reading));
  assert.ok(!output.includes('B: 11.0 A'));
  card.hass.states['sensor.garage_power_phase_b'].state = '0';
  card.hass.states['sensor.garage_power_phase_c'].state = '0';
  const singleOutput = card.render();
  assert.ok(singleOutput.includes('16.0 A'));
  assert.ok(singleOutput.includes('240.0 V'));
  assert.ok(!singleOutput.includes('B: '));
  assert.ok(!singleOutput.includes('3p '));
});

test('missing override phase entities show dashes rather than using default phases', () => {
  const card = makeCard();
  card.hass.states['sensor.custom_current'] = { state: '16', attributes: {} };
  card.hass.states['sensor.custom_voltage'] = { state: '240', attributes: {} };
  card.setConfig({ status_entity: 'sensor.garage_ev_status', current_entity: 'sensor.custom_current', voltage_entity: 'sensor.custom_voltage' });
  const output = card.render();
  assert.ok(output.includes('A: 16.0 A'));
  assert.ok(output.includes('B: -'));
  assert.ok(output.includes('C: -'));
  assert.ok(!output.includes('3p '));
  assert.ok(!output.includes('230.0 V'));
});
test('more than one powered phase is three-phase; idle ignores stale phase powers', () => {
  assert.equal(getPhaseTelemetry(true, [2300, 2300, 0], [10, 11, 0], [230, 231, 232]).threePhase, true);
  const output = makeCard(false).render();
  assert.ok(!output.includes('3p ')); assert.ok(!output.includes('B: ')); assert.ok(output.includes('7.5 kW'));
});
test('missing or zero voltage cannot produce a misleading average', () => {
  for (const value of [NaN, 0]) {
    const result = getPhaseTelemetry(true, [2300, 2300, 2300], [10, 11, 12], [230, 231, value]);
    assert.ok(Number.isNaN(result.voltage)); assert.equal(result.threePhaseVoltage, false);
  }
});
