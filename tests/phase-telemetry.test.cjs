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
test('offline status hides controls and overrides stale secondary text; recovery restores controls', async () => {
  const card = makeCard();
  card.hass.states['sensor.custom_substatus'] = { state: 'Vehicle connected', attributes: {} };
  card.setConfig({ status_entity: 'sensor.garage_ev_status', sub_status_entity: 'sensor.custom_substatus' });
  let serviceCalls = 0;
  card.hass.callService = async () => { serviceCalls++; };
  for (const state of ['unavailable', 'unknown', null]) {
    if (state === null) delete card.hass.states['sensor.garage_ev_status'];
    else card.hass.states['sensor.garage_ev_status'].state = state;
    const output = card.render();
    assert.ok(output.includes('Waiting for charger to come online'));
    assert.ok(!output.includes('Waiting for vehicle'));
    assert.ok(!output.includes('class="action-toggle"'));
    await card.toggleCharger();
  }
  assert.equal(serviceCalls, 0);
  card.hass.states['sensor.garage_ev_status'] = { state: 'EV connected', attributes: {} };
  assert.ok(card.render().includes('class="action-toggle"'));
  assert.ok(!card.render().includes('Waiting for charger to come online'));
  await card.toggleCharger();
  assert.equal(serviceCalls, 1);
});
function makeCard(charging = true) {
  const card = new modules['amina-s-card'].AminaSCard();
  card.setConfig({ status_entity: 'sensor.garage_ev_status' });
  const states = { 'sensor.garage_ev_status': { state: charging ? 'Charging' : 'EV connected', attributes: {} } };
  for (const [suffix, power, current, voltage] of [['', 2300, 10, 230], ['_phase_b', 2310, 11, 231], ['_phase_c', 2290, 12, 229]]) {
    for (const [kind, value, unit] of [['current', current, 'A'], ['voltage', voltage, 'V']]) {
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
  card.hass.states['sensor.garage_current'].state = '0';
  card.hass.states['sensor.garage_current_phase_c'].state = '0';
  const output = card.render();
  assert.ok(output.includes('0.0 A'));
  assert.ok(!output.includes('11.0 A'));
  assert.ok(!output.includes('3p '));
  assert.ok(output.includes('231.0 V'));
  assert.ok(output.includes('7.5 kW'));
});
test('ZHA total power is selected automatically and converts W to kW', () => {
  const card = makeCard();
  card.hass.entities = { 'sensor.garage_ev_status': { platform: 'zha' } };
  delete card.hass.states['sensor.garage_total_active_power'];
  card.hass.states['sensor.garage_total_power'] = { state: '7500', attributes: { unit_of_measurement: 'W' } };
  assert.equal(card.config.power_entity, 'sensor.garage_total_power');
  assert.ok(card.render().includes('7.5 kW'));
  assert.ok(card.render().includes('3p 230.0 V'));
  card.hass.states['sensor.garage_total_power'] = { state: '7.5', attributes: { unit_of_measurement: 'kW' } };
  assert.ok(card.render().includes('7.5 kW'));
});
test('MQTT defaults win when integration is unknown even if ZHA names exist', () => {
  const card = makeCard();
  card.hass.states['sensor.garage_total_power'] = { state: '1000', attributes: { unit_of_measurement: 'W' } };
  assert.equal(card.config.power_entity, 'sensor.garage_total_active_power');
  assert.ok(card.render().includes('7.5 kW'));
});
test('integration detection selects defaults per status entity and honors overrides', () => {
  const card = makeCard();
  card.hass.entities = { 'sensor.garage_ev_status': { platform: 'zha' }, 'sensor.driveway_ev_status': { platform: 'mqtt' } };
  assert.equal(card.config.power_entity, 'sensor.garage_total_power');
  assert.equal(card.config.linkquality_entity, 'sensor.garage_lqi');
  assert.equal(card.config.charge_limit_entity, 'number.garage_charge_current_limit');
  card.setConfig({ status_entity: 'sensor.driveway_ev_status' });
  assert.equal(card.config.power_entity, 'sensor.driveway_total_active_power');
  card.setConfig({ status_entity: 'sensor.garage_ev_status', power_entity: 'sensor.custom_total' });
  assert.equal(card.config.power_entity, 'sensor.custom_total');
});
test('registry lookup is cached across cards and resolves ZHA asynchronously', async () => {
  const { loadIntegration, getIntegration } = modules['entity-defaults'];
  let calls = 0;
  const connection = {};
  const hass = { connection, callWS: async (message) => {
    calls++;
    assert.equal(message.type, 'config/entity_registry/get');
    assert.equal(message.entity_id, 'sensor.garage_ev_status');
    return { platform: 'zha' };
  } };
  assert.equal(getIntegration('sensor.garage_ev_status', hass), 'mqtt');
  await Promise.all([loadIntegration('sensor.garage_ev_status', hass), loadIntegration('sensor.garage_ev_status', { ...hass })]);
  assert.equal(calls, 1);
  assert.equal(getIntegration('sensor.garage_ev_status', hass), 'zha');
});
test('failed registry access and other platforms fall back to MQTT defaults', async () => {
  const { loadIntegration, getIntegration } = modules['entity-defaults'];
  const hass = { connection: {}, callWS: async () => { throw new Error('Access unavailable'); } };
  await loadIntegration('sensor.garage_ev_status', hass);
  assert.equal(getIntegration('sensor.garage_ev_status', hass), 'mqtt');
  assert.equal(getIntegration('sensor.garage_ev_status', { entities: { 'sensor.garage_ev_status': { platform: 'template' } } }), 'mqtt');
});
test('missing total power shows dash instead of summing phase powers', () => {
  const card = makeCard();
  delete card.hass.states['sensor.garage_total_active_power'];
  assert.ok(/Power<\/div>\s*<div class="metric-value">-<\/div>/.test(card.render()));
});
test('missing current phase shows dash independently; actual zero remains visible', () => {
  const card = makeCard();
  card.hass.states['sensor.garage_current_phase_b'].state = 'unavailable';
  const output = card.render();
  assert.ok(output.includes('A: 10.0 A')); assert.ok(output.includes('B: -')); assert.ok(output.includes('C: 12.0 A'));
  card.hass.states['sensor.garage_current_phase_b'].state = '0';
  assert.ok(card.render().includes('B: 0.0 A'));
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
  card.hass.states['sensor.custom_current_phase_b'].state = '0';
  card.hass.states['sensor.custom_current_phase_c'].state = '0';
  const singleOutput = card.render();
  assert.ok(singleOutput.includes('16.0 A'));
  assert.ok(singleOutput.includes('240.0 V'));
  assert.ok(!singleOutput.includes('B: '));
  assert.ok(!singleOutput.includes('3p '));
});

test('missing override phase entities do not trigger three-phase from default currents', () => {
  const card = makeCard();
  card.hass.states['sensor.custom_current'] = { state: '16', attributes: {} };
  card.hass.states['sensor.custom_voltage'] = { state: '240', attributes: {} };
  card.setConfig({ status_entity: 'sensor.garage_ev_status', current_entity: 'sensor.custom_current', voltage_entity: 'sensor.custom_voltage' });
  const output = card.render();
  assert.ok(output.includes('16.0 A'));
  assert.ok(!output.includes('B: '));
  assert.ok(!output.includes('3p '));
  assert.ok(output.includes('240.0 V'));
});
test('more than one positive current is three-phase; idle ignores stale phase currents', () => {
  assert.equal(getPhaseTelemetry(true, [10, 11, 0], [230, 231, 232]).threePhase, true);
  const output = makeCard(false).render();
  assert.ok(output.includes('3p 230.0 V')); assert.ok(!output.includes('B: ')); assert.ok(output.includes('7.5 kW'));
});
test('idle voltage uses three available phases even with no power delivery', () => {
  const card = makeCard(false);
  for (const suffix of ['', '_phase_b', '_phase_c']) card.hass.states[`sensor.garage_current${suffix}`].state = '0';
  assert.ok(card.render().includes('3p 230.0 V'));
});
test('idle voltage falls back to the main phase when extra voltages are invalid', () => {
  for (const state of ['0', 'unavailable', 'unknown']) {
    const card = makeCard(false);
    card.hass.states['sensor.garage_voltage_phase_b'].state = state;
    const output = card.render();
    assert.ok(output.includes('230.0 V'));
    assert.ok(!output.includes('3p '));
  }
});
test('missing or zero voltage cannot produce a misleading average', () => {
  for (const value of [NaN, 0]) {
    const result = getPhaseTelemetry(true, [10, 11, 12], [230, 231, value]);
    assert.ok(Number.isNaN(result.voltage)); assert.equal(result.threePhaseVoltage, false);
  }
});
