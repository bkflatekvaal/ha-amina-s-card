const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadCard, makeCard, plain } = require('./helpers/card-harness.cjs');
const { Card } = loadCard();
test('on stops and off starts the selected switch with correct HA service calls', async () => {
  for (const platform of ['mqtt', 'zha']) {
    const { card, calls } = makeCard(Card, 'garage', platform);
    await card.toggleCharger();
    card.hass.states['switch.garage'].state = 'on';
    assert.ok(card.render().includes('Stop charging'));
    await card.toggleCharger();
    assert.deepEqual(plain(calls), [['switch', 'turn_on', { entity_id: 'switch.garage' }], ['switch', 'turn_off', { entity_id: 'switch.garage' }]]);
  }
});
test('unknown, unavailable, and missing switches never issue charging commands', async () => {
  const { card, calls } = makeCard(Card);
  for (const state of ['unknown', 'unavailable', undefined]) {
    if (state === undefined) delete card.hass.states['switch.garage'];
    else card.hass.states['switch.garage'].state = state;
    await card.toggleCharger();
  }
  assert.equal(calls.length, 0);
});
test('charger control override targets the explicit switch and propagates service errors', async () => {
  const { card, calls, state } = makeCard(Card);
  card.setConfig({ status_entity: 'sensor.garage_ev_status', charger_entity: 'switch.custom' });
  card.hass.states['switch.custom'] = state('on');
  await card.toggleCharger();
  assert.deepEqual(plain(calls[0]), ['switch', 'turn_off', { entity_id: 'switch.custom' }]);
  card.hass.callService = async () => { throw new Error('Service failed'); };
  await assert.rejects(card.toggleCharger(), /Service failed/);
});
test('status messages distinguish connected, charging, disconnected, and offline', () => {
  const { card } = makeCard(Card);
  for (const [status, main, secondary] of [['EV connected', 'EV Connected', 'Vehicle connected'], ['Charging', 'Charging', 'Power is being delivered'], ['Not connected', 'Not Connected', 'Waiting for vehicle'], ['unavailable', 'Unavailable', 'Waiting for charger to come online'], ['unknown', 'Unknown', 'Waiting for charger to come online']]) {
    card.hass.states['sensor.garage_ev_status'].state = status;
    const meta = card.getStatusMeta();
    assert.equal(meta.mainStatus, main); assert.equal(meta.secondary, secondary);
  }
});
test('active alarm lists filter placeholders and thermal derating supplies a fallback', () => {
  const { card, state } = makeCard(Card);
  card.hass.states['binary_sensor.garage_alarm_active'] = state('on');
  card.hass.states['sensor.garage_alarms'] = state("['No alarm', 'overvoltage', 'overcurrent']");
  assert.equal(card.getStatusMeta().secondary, 'overvoltage, overcurrent');
  assert.equal(card.getLedColor(), '#ffb35c');
  card.hass.states['sensor.garage_alarms'] = state('unknown');
  assert.equal(card.getStatusMeta().secondary, 'Warning');
  card.hass.states['binary_sensor.garage_alarm_active'] = state('off');
  card.hass.states['binary_sensor.garage_derated'] = state('on');
  assert.equal(card.getStatusMeta().secondary, 'Power reduced');
  card.hass.states['binary_sensor.garage_derated'] = state('off');
  assert.equal(card.getStatusMeta().secondary, 'Vehicle connected');
});
test('custom secondary status wins online while offline message takes precedence', () => {
  const { card, state } = makeCard(Card);
  card.setConfig({ status_entity: 'sensor.garage_ev_status', sub_status_entity: 'sensor.custom' });
  card.hass.states['sensor.custom'] = state('Scheduled overnight');
  card.hass.states['binary_sensor.garage_alarm_active'] = state('on');
  assert.equal(card.getStatusMeta().secondary, 'Scheduled overnight');
  card.hass.states['sensor.garage_ev_status'].state = 'unavailable';
  assert.equal(card.getStatusMeta().secondary, 'Waiting for charger to come online');
});
test('invalid sensor states show dashes and valid zeros remain visible', () => {
  const { card, state } = makeCard(Card);
  for (const value of ['unknown', 'unavailable', '', ' ', 'bad', null, undefined]) {
    for (const suffix of ['current', 'voltage', 'last_session_energy']) card.hass.states[`sensor.garage_${suffix}`] = state(value);
    assert.equal((card.render().match(/class="metric-value"[^>]*>\s*-\s*</g) ?? []).length, 2);
  }
  for (const suffix of ['current', 'voltage', 'last_session_energy']) card.hass.states[`sensor.garage_${suffix}`] = state('0');
  const output = card.render(); assert.ok(output.includes('0.0 A')); assert.ok(output.includes('0.0 V')); assert.ok(output.includes('0.00 kWh'));
});
test('more-info actions emit the selected entity with bubbling and composed events', () => {
  const { card } = makeCard(Card); let event;
  card.addEventListener('hass-more-info', value => { event = value; });
  card.showMoreInfo('sensor.garage_voltage');
  assert.deepEqual(plain(event.detail), { entityId: 'sensor.garage_voltage' }); assert.equal(event.bubbles, true); assert.equal(event.composed, true);
});
test('switching chargers and independent cards keep readings and service targets separate', async () => {
  const first = makeCard(Card, 'garage', 'mqtt'), second = makeCard(Card, 'driveway', 'zha');
  const hass = { ...first.card.hass, entities: { ...first.card.hass.entities, ...second.card.hass.entities }, states: { ...first.card.hass.states, ...second.card.hass.states } };
  hass.states['sensor.driveway_current'].state = '9';
  first.card.hass = hass; second.card.hass = hass;
  assert.ok(first.card.render().includes('14.0 A')); assert.ok(second.card.render().includes('9.0 A'));
  first.card.setConfig({ status_entity: 'sensor.driveway_ev_status' });
  assert.ok(first.card.render().includes('9.0 A')); assert.ok(!first.card.render().includes('14.0 A'));
  await first.card.toggleCharger();
  assert.deepEqual(plain(first.calls[0]), ['switch', 'turn_on', { entity_id: 'switch.driveway' }]);
});
