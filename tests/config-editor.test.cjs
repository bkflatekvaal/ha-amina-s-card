const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadCard, CustomEvent, plain } = require('./helpers/card-harness.cjs');
const fire = (element, type, detail) => element.dispatchEvent(new CustomEvent(type, { detail }));
function setup(pickers = true) {
  const api = loadCard({ pickers });
  const editor = new api.Editor();
  const events = [];
  editor.addEventListener('config-changed', event => events.push(event));
  editor.hass = { states: {
    'sensor.garage_ev_status': { entity_id: 'sensor.garage_ev_status', state: 'EV connected', attributes: {} },
    'sensor.garage_power': { entity_id: 'sensor.garage_power', state: '3200', attributes: { device_class: 'power', unit_of_measurement: 'W' } },
    'sensor.garage_lqi': { entity_id: 'sensor.garage_lqi', state: '100', attributes: {} },
  } };
  editor.setConfig({ status_entity: 'sensor.garage_ev_status', title: 'Garage' });
  return { ...api, editor, events };
}
function field(editor, key) { return editor.querySelectorAll('[data-key]').find(element => element.dataset.key === key); }
function expand(editor) { fire(editor.querySelectorAll('button')[0], 'click'); }
test('status picker selection emits a bubbling composed configuration event', () => {
  const { editor, events } = setup();
  fire(field(editor, 'status_entity'), 'value-changed', { value: 'sensor.driveway_ev_status' });
  assert.equal(events.length, 1);
  assert.deepEqual(plain(events[0].detail.config), { status_entity: 'sensor.driveway_ev_status', title: 'Garage' });
  assert.equal(events[0].bubbles, true); assert.equal(events[0].composed, true);
  assert.equal(field(editor, 'status_entity').value, 'sensor.driveway_ev_status');
});
test('optional entity overrides can be added and cleared without losing required configuration', () => {
  const { editor, events } = setup(); expand(editor);
  fire(field(editor, 'power_entity'), 'value-changed', { value: 'sensor.garage_power' });
  assert.equal(events.at(-1).detail.config.power_entity, 'sensor.garage_power');
  fire(field(editor, 'power_entity'), 'value-changed', { value: '' });
  assert.equal(events.at(-1).detail.config.power_entity, undefined);
  assert.equal(events.at(-1).detail.config.status_entity, 'sensor.garage_ev_status');
});
test('title input changes and optional expand/collapse retain existing overrides', () => {
  const { editor, events } = setup();
  editor.setConfig({ status_entity: 'sensor.garage_ev_status', energy_entity: 'sensor.custom_energy' });
  field(editor, 'title').value = 'My charger'; fire(field(editor, 'title'), 'input');
  assert.equal(events.at(-1).detail.config.title, 'My charger');
  expand(editor); assert.equal(field(editor, 'energy_entity').value, 'sensor.custom_energy');
  expand(editor); assert.equal(field(editor, 'energy_entity'), undefined);
  assert.equal(editor._config.energy_entity, 'sensor.custom_energy');
  field(editor, 'title').value = ''; fire(field(editor, 'title'), 'input');
  assert.equal(events.at(-1).detail.config.title, undefined);
});
test('fallback selects support status and overrides without Home Assistant picker elements', () => {
  const { editor, events } = setup(false);
  field(editor, 'status_entity').value = 'sensor.garage_ev_status'; fire(field(editor, 'status_entity'), 'change');
  expand(editor);
  field(editor, 'power_entity').value = 'sensor.garage_power'; fire(field(editor, 'power_entity'), 'change');
  assert.equal(events.at(-1).detail.config.power_entity, 'sensor.garage_power');
  const lqiOptions = field(editor, 'linkquality_entity').children.map(option => option.value);
  assert.ok(lqiOptions.includes('sensor.garage_lqi'));
});
test('editor asynchronously updates same-device defaults without emitting config changes', async () => {
  const { editor, events, loadIntegration } = setup();
  const hass = { connection: {}, states: {}, callWS: async message => message.type === 'config/device_registry/list' ? [{ id: 'garage', name: 'Garage' }] : [
    { entity_id: 'sensor.garage_ev_status', device_id: 'garage', platform: 'zha' },
    { entity_id: 'sensor.custom_total', device_id: 'garage', platform: 'zha', original_name: 'Total power' },
  ] };
  editor.hass = hass;
  await loadIntegration('sensor.garage_ev_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(editor.getDefaultEntity('power_entity'), 'sensor.custom_total');
  assert.equal(editor.getDefaultEntity('charge_limit_entity'), 'number.garage_charge_current_limit');
  assert.equal(events.length, 0);
  expand(editor); assert.equal(field(editor, 'power_entity').hass, hass);
});
test('pending registry discovery follows a newly selected status entity', async () => {
  const { editor, events, loadIntegration } = setup(); let finish;
  const hass = { connection: {}, states: {}, callWS: message => message.type === 'config/device_registry/list' ? Promise.resolve([]) : new Promise(resolve => { finish = resolve; }) };
  editor.hass = hass;
  fire(field(editor, 'status_entity'), 'value-changed', { value: 'sensor.driveway_ev_status' });
  await Promise.resolve(); await Promise.resolve();
  finish([
    { entity_id: 'sensor.garage_ev_status', device_id: 'garage', platform: 'mqtt' },
    { entity_id: 'sensor.driveway_ev_status', device_id: 'driveway', platform: 'zha' },
    { entity_id: 'sensor.driveway_total', device_id: 'driveway', platform: 'zha', original_name: 'Total power' },
  ]);
  await loadIntegration('sensor.driveway_ev_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(editor._config.status_entity, 'sensor.driveway_ev_status');
  assert.equal(editor.getDefaultEntity('power_entity'), 'sensor.driveway_total');
  assert.equal(events.length, 1);
});
