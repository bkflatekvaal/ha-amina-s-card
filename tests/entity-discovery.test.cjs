const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
function setup() {
  let now = 0;
  const modules = {};
  const definitions = {};
  const html = (strings, ...values) => strings.reduce((result, text, i) => result + text + (typeof values[i] === 'function' ? '' : Array.isArray(values[i]) ? values[i].join('') : values[i] ?? ''), '');
  for (const name of ['entity-defaults', 'phase-telemetry', 'amina-s-card']) {
    const exports = {};
    runInNewContext(ts.transpileModule(readFileSync(`src/${name}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText, {
      exports, Date: { now: () => now }, HTMLElement: class {}, window: {}, customElements: { define(name, constructor) { definitions[name] = constructor; } },
      require: path => path.startsWith('./') ? modules[path.slice(2)] : path === 'lit' ? { LitElement: class { requestUpdate() { this.updates = (this.updates || 0) + 1; } disconnectedCallback() {} }, html, css: html } : { customElement: () => () => {}, property: () => () => {} }
    });
    modules[name] = exports;
  }
  return { ...modules['entity-defaults'], Card: modules['amina-s-card'].AminaSCard, Editor: definitions['amina-s-card-config-editor'], advance(ms) { now += ms; } };
}
function fixture(device, platform = 'mqtt', prefix = device) {
  const entry = (entity_id, original_name, domain = 'sensor', extra = {}) => ({ entity_id: `${domain}.${entity_id}`, device_id: device, platform, config_entry_id: platform + '-entry', original_name, ...extra });
  return [
    entry(`${prefix}_status`, 'EV status'),
    entry(`${prefix}_watts`, platform === 'zha' ? 'Total power' : 'Total active power', 'sensor', { unit_of_measurement: 'kW' }),
    entry(`${prefix}_amps`, 'Current'), entry(`${prefix}_amps_b`, 'Current phase B'), entry(`${prefix}_amps_c`, 'Current phase C'),
    entry(`${prefix}_volts`, 'Voltage'), entry(`${prefix}_volts_b`, 'Voltage phase B'), entry(`${prefix}_volts_c`, 'Voltage phase C'),
    entry(`${prefix}_signal`, 'LQI'), entry(`${prefix}_energy`, 'Last session energy'),
    entry(`${prefix}_limit`, 'Charge current limit', 'number'), entry(`${prefix}_control`, 'On off', 'switch'),
    entry(`${prefix}_fault`, 'Alarm active', 'binary_sensor'), entry(`${prefix}_alarms`, 'Alarms'),
    entry(`${prefix}_hot`, 'Thermal derating', 'binary_sensor'),
    entry(`${prefix}_offline`, 'Offline current limit', 'number'), entry(`${prefix}_single_phase`, 'Force single phase charging', 'switch'),
    entry(`${prefix}_lifetime`, 'Total energy'),
  ];
}
function hassWith(entities, devices = []) {
  return { connection: {}, states: {}, entities: Object.fromEntries(entities.map(entry => [entry.entity_id, entry])), devices: Object.fromEntries(devices.map(device => [device.id, device])) };
}

const flushSubscriptions = () => new Promise(resolve => setImmediate(resolve));
function subscriptionFixture() {
  const attempts = [], active = new Set();
  const hass = hassWith(fixture('one'));
  let requests = 0;
  hass.callWS = async message => { requests++; return message.type === 'config/entity_registry/list' ? fixture('one') : []; };
  hass.connection.subscribeEvents = (callback, type) => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    const attempt = { type, callback, unsubscribes: 0,
      resolve() { resolve(() => { attempt.unsubscribes++; active.delete(attempt); }); },
      reject() { active.delete(attempt); reject(new Error('Subscription denied')); }
    };
    // Model callbacks becoming live before the unsubscribe promise resolves.
    active.add(attempt);
    assert.equal([...active].filter(item => item.type === type).length, 1, `duplicate active ${type}`);
    attempts.push(attempt);
    return promise;
  };
  return { hass, attempts, active, get requests() { return requests; } };
}

test('subscription lifecycle: disconnect before resolution releases pending subscriptions', async () => {
  const api = setup(), f = subscriptionFixture();
  const stop = api.observeDiscovery(f.hass, () => assert.fail('disconnected listener called'));
  await flushSubscriptions();
  stop();
  for (const attempt of f.attempts) { attempt.callback(); attempt.resolve(); }
  await flushSubscriptions();
  assert.equal(f.requests, 0);
  assert.equal(f.active.size, 0);
  assert.ok(f.attempts.every(attempt => attempt.unsubscribes === 1));
});

test('subscription lifecycle: immediate reconnect waits for pending stale cleanup', async () => {
  const api = setup(), f = subscriptionFixture();
  const oldStop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  const old = [...f.attempts]; oldStop();
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  assert.equal(f.attempts.length, 2);
  for (const attempt of old) attempt.resolve();
  await flushSubscriptions();
  assert.equal(f.attempts.length, 4);
  assert.ok(old.every(attempt => attempt.unsubscribes === 1));
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions();
  oldStop(); // An obsolete disposer must not disconnect the new observer.
  assert.equal(f.active.size, 2);
  stop(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: old event type resolves after a new subscription', async () => {
  const api = setup(), f = subscriptionFixture();
  const oldStop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  const [oldEntity, oldDevice] = f.attempts; oldStop();
  const stop = api.observeDiscovery(f.hass, () => {});
  oldEntity.resolve(); await flushSubscriptions();
  const newEntity = f.attempts[2]; newEntity.resolve(); await flushSubscriptions();
  oldDevice.callback(); oldDevice.resolve(); await flushSubscriptions();
  const newDevice = f.attempts[3]; newDevice.resolve(); await flushSubscriptions();
  assert.equal(f.requests, 0);
  assert.equal(f.active.size, 2);
  assert.equal(oldEntity.unsubscribes, 1); assert.equal(oldDevice.unsubscribes, 1);
  stop(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: cards and editor share subscriptions until the last disconnect', async () => {
  const api = setup(), f = subscriptionFixture();
  const cards = [new api.Card(), new api.Card()], editor = new api.Editor();
  editor.render = () => {};
  for (const observer of [...cards, editor]) {
    observer.setConfig({ status_entity: 'sensor.one_status' }); observer.hass = f.hass;
  }
  for (const card of cards) card.willUpdate();
  await api.loadIntegration('sensor.one_status', f.hass); await flushSubscriptions();
  assert.equal(f.attempts.length, 2);
  for (const attempt of f.attempts) attempt.resolve();
  await flushSubscriptions();
  cards[0].disconnectedCallback(); cards[1].disconnectedCallback();
  assert.equal(f.active.size, 2);
  f.attempts[0].callback(); await flushSubscriptions();
  assert.equal(f.requests, 4);
  editor.disconnectedCallback(); editor.disconnectedCallback();
  assert.equal(f.active.size, 0);
  assert.ok(f.attempts.every(attempt => attempt.unsubscribes === 1));
});

test('subscription lifecycle: repeated reconnect cycles leave no subscriptions or callbacks', async () => {
  const api = setup(), f = subscriptionFixture();
  let stop = api.observeDiscovery(f.hass, () => {});
  for (let cycle = 0; cycle < 5; cycle++) {
    await flushSubscriptions();
    const pending = f.attempts.slice(-2);
    stop(); stop();
    stop = api.observeDiscovery(f.hass, () => {});
    for (const attempt of pending) { attempt.callback(); attempt.resolve(); }
    await flushSubscriptions();
    assert.equal(f.active.size, 2);
  }
  stop();
  for (const attempt of f.attempts.slice(-2)) attempt.resolve();
  await flushSubscriptions();
  for (const attempt of f.attempts) attempt.callback();
  await flushSubscriptions();
  assert.equal(f.requests, 0); assert.equal(f.active.size, 0);
  assert.ok(f.attempts.every(attempt => attempt.unsubscribes === 1));
});

test('subscription lifecycle: rejection is bounded and reconnect can subscribe again', async () => {
  const api = setup(), f = subscriptionFixture();
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  f.attempts[0].reject(); f.attempts[1].resolve(); await flushSubscriptions();
  assert.equal(f.attempts.length, 2); assert.equal(f.active.size, 1);
  stop();
  const nextStop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions();
  assert.equal(f.active.size, 2);
  nextStop(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: stale rejection cannot interfere with a reconnect', async () => {
  const api = setup(), f = subscriptionFixture();
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions(); stop();
  const nextStop = api.observeDiscovery(f.hass, () => {});
  f.attempts[0].reject(); f.attempts[1].reject(); await flushSubscriptions();
  assert.equal(f.attempts.length, 4);
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions();
  assert.equal(f.active.size, 2);
  nextStop(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: stale callbacks cannot refresh registries after reconnect', async () => {
  const api = setup(), f = subscriptionFixture();
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  const old = [...f.attempts];
  for (const attempt of old) attempt.resolve();
  await flushSubscriptions(); stop();
  const nextStop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions();
  for (const attempt of old) attempt.callback();
  await flushSubscriptions(); assert.equal(f.requests, 0);
  f.attempts[2].callback(); await flushSubscriptions(); assert.equal(f.requests, 2);
  nextStop();
  for (const attempt of f.attempts) attempt.callback();
  await flushSubscriptions(); assert.equal(f.requests, 2); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: synchronous subscription errors do not escape or loop', async () => {
  const api = setup(), f = subscriptionFixture(); let attempts = 0;
  f.hass.connection.subscribeEvents = () => { attempts++; throw new Error('Disconnected'); };
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions(); assert.equal(attempts, 2);
  stop();
  const nextStop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions(); assert.equal(attempts, 4);
  nextStop();
});

test('subscription lifecycle: many reconnects before resolution subscribe only the latest session', async () => {
  const api = setup(), f = subscriptionFixture();
  let stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  for (let i = 0; i < 10; i++) {
    stop(); stop = api.observeDiscovery(f.hass, () => {});
    await flushSubscriptions(); assert.equal(f.attempts.length, 2);
  }
  for (const attempt of [...f.attempts]) attempt.resolve();
  await flushSubscriptions(); assert.equal(f.attempts.length, 4);
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions(); assert.equal(f.active.size, 2);
  stop(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: stale callbacks cannot queue a refresh during pending discovery', async () => {
  const api = setup(), f = subscriptionFixture();
  const stop = api.observeDiscovery(f.hass, () => {});
  await flushSubscriptions();
  const old = [...f.attempts]; stop();
  const nextStop = api.observeDiscovery(f.hass, () => {});
  let resolveEntities, requests = 0;
  f.hass.callWS = message => {
    requests++;
    return message.type === 'config/entity_registry/list'
      ? new Promise(resolve => { resolveEntities = resolve; }) : Promise.resolve([]);
  };
  const pending = api.loadIntegration('sensor.one_status', f.hass);
  await flushSubscriptions();
  for (const attempt of old) { attempt.callback(); attempt.resolve(); }
  resolveEntities(fixture('one')); await pending; await flushSubscriptions();
  assert.equal(requests, 2);
  nextStop();
  for (const attempt of f.attempts.slice(2)) attempt.resolve();
  await flushSubscriptions(); assert.equal(f.active.size, 0);
});

test('subscription lifecycle: card reconnect and connection switching isolate pending subscriptions', async () => {
  const api = setup(), first = subscriptionFixture(), second = subscriptionFixture();
  const card = new api.Card(); card.setConfig({ status_entity: 'sensor.one_status' });
  card.hass = first.hass; card.willUpdate();
  await api.loadIntegration('sensor.one_status', first.hass); await flushSubscriptions();
  card.disconnectedCallback(); card.hass = first.hass; card.willUpdate();
  await flushSubscriptions(); assert.equal(first.attempts.length, 2);
  card.hass = second.hass; card.willUpdate();
  await api.loadIntegration('sensor.one_status', second.hass); await flushSubscriptions();
  for (const attempt of second.attempts) attempt.resolve();
  await flushSubscriptions();
  const updates = card.updates;
  for (const attempt of first.attempts) { attempt.callback(); attempt.resolve(); }
  await flushSubscriptions();
  assert.equal(first.requests, 2); assert.equal(first.active.size, 0);
  assert.equal(first.attempts.length, 2); assert.equal(card.updates, updates);
  assert.equal(second.active.size, 2);
  card.disconnectedCallback(); assert.equal(second.active.size, 0);
});
test('single charger resolves all roles from original names and correct domains', () => {
  const api = setup();
  const hass = hassWith(fixture('garage'));
  const result = api.getAutomaticEntities('sensor.garage_status', hass);
  for (const [field, id] of Object.entries({ power_entity: 'sensor.garage_watts', current_entity: 'sensor.garage_amps', voltage_entity: 'sensor.garage_volts', linkquality_entity: 'sensor.garage_signal', energy_entity: 'sensor.garage_energy', charge_limit_entity: 'number.garage_limit', charger_entity: 'switch.garage_control', alarm_entity: 'binary_sensor.garage_fault', alarms_entity: 'sensor.garage_alarms', derated_entity: 'binary_sensor.garage_hot' })) assert.equal(result[field], id);
});
test('multiple MQTT chargers stay isolated even with overlapping names', () => {
  const api = setup(), hass = hassWith([...fixture('one'), ...fixture('two')]);
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
  assert.equal(api.getAutomaticEntities('sensor.two_status', hass).current_entity, 'sensor.two_amps');
});
test('multiple ZHA chargers stay isolated and select ZHA defaults for missing roles', () => {
  const api = setup(), hass = hassWith([...fixture('one', 'zha'), ...fixture('two', 'zha')].filter(entry => !entry.original_name.includes('limit')));
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
  assert.equal(api.getAutomaticEntities('sensor.two_status', hass).charge_limit_entity, 'number.two_charge_current_limit');
});
test('mixed chargers and same-device entries from other integrations are isolated', () => {
  const api = setup(), entries = [...fixture('one', 'mqtt'), ...fixture('two', 'zha')];
  entries.push({ entity_id: 'sensor.wrong_power', device_id: 'one', platform: 'zha', original_name: 'Total active power' });
  const hass = hassWith(entries);
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
  assert.equal(api.getAutomaticEntities('sensor.two_status', hass).power_entity, 'sensor.two_watts');
});
test('unique IDs, translation keys, and device classes identify renamed entities', () => {
  const api = setup(), hass = hassWith([
    { entity_id: 'sensor.random_status', device_id: 'one', platform: 'mqtt' },
    { entity_id: 'sensor.random_energy', device_id: 'one', platform: 'mqtt', unique_id: '0x123_last_session_energy' },
    { entity_id: 'number.random_limit', device_id: 'one', platform: 'mqtt', translation_key: 'charge_limit' },
    { entity_id: 'sensor.random_current', device_id: 'one', platform: 'mqtt', original_device_class: 'current', original_name: 'Strom' },
  ]);
  const result = api.getAutomaticEntities('sensor.random_status', hass);
  assert.equal(result.energy_entity, 'sensor.random_energy');
  assert.equal(result.charge_limit_entity, 'number.random_limit');
  assert.equal(result.current_entity, 'sensor.random_current');
});
test('naming fallback refuses entities registered to another charger', () => {
  const api = setup(), hass = hassWith([
    { entity_id: 'sensor.amina_s_ev_status', device_id: 'one', platform: 'mqtt' },
    { entity_id: 'sensor.amina_s_total_active_power', device_id: 'two', platform: 'mqtt' },
    { entity_id: 'sensor.amina_s_current', device_id: 'two', platform: 'mqtt' },
    { entity_id: 'sensor.amina_s_current_phase_b', device_id: 'two', platform: 'mqtt' },
  ]);
  const result = api.getAutomaticEntities('sensor.amina_s_ev_status', hass);
  assert.equal(result.power_entity, undefined);
  assert.equal(result.current_entity, undefined);
  assert.equal(api.getPhaseEntities('sensor.amina_s_ev_status', hass, 'current', 'sensor.amina_s_current', false)[1], undefined);
});
test('missing registry retains backward-compatible naming defaults', () => {
  const api = setup();
  const result = api.getAutomaticEntities('sensor.amina_s_ev_status', { states: {} });
  assert.equal(result.power_entity, 'sensor.amina_s_total_active_power');
  assert.equal(result.current_entity, 'sensor.amina_s_current');
});
test('ambiguous same-device metadata does not pick an arbitrary candidate', () => {
  const api = setup(), entries = fixture('garage');
  entries.push({ ...entries[1], entity_id: 'sensor.duplicate_total' });
  assert.equal(api.getAutomaticEntities('sensor.garage_status', hassWith(entries)).power_entity, 'sensor.garage_total_active_power');
});
test('manual overrides remain authoritative and preserve phase suffixes', () => {
  const api = setup(), hass = hassWith(fixture('garage'));
  const card = new api.Card(); card.hass = hass;
  card.setConfig({ status_entity: 'sensor.garage_status', power_entity: 'sensor.helper_power', energy_entity: 'sensor.helper_energy', current_entity: 'sensor.manual_current' });
  assert.equal(card.config.power_entity, 'sensor.helper_power'); assert.equal(card.config.energy_entity, 'sensor.helper_energy');
  assert.equal(api.getPhaseEntities('sensor.garage_status', hass, 'current', card.config.current_entity, true)[1], 'sensor.manual_current_phase_b');
});
test('renamed phase entities are discovered on the same charger', () => {
  const api = setup(), hass = hassWith([...fixture('one'), ...fixture('two')]);
  const result = api.getAutomaticEntities('sensor.one_status', hass);
  assert.equal(api.getPhaseEntities('sensor.one_status', hass, 'current', result.current_entity, false)[1], 'sensor.one_amps_b');
  assert.equal(api.getPhaseEntities('sensor.one_status', hass, 'voltage', result.voltage_entity, false)[2], 'sensor.one_volts_c');
});
test('async snapshot is shared across cards, updates rendering, and supplies device name', async () => {
  const api = setup(); let finishEntities, finishDevices; const requests = [];
  const hass = { connection: {}, states: {}, callWS(message) {
    requests.push(message.type);
    return new Promise(resolve => { if (message.type === 'config/entity_registry/list') finishEntities = resolve; else finishDevices = resolve; });
  } };
  const card = new api.Card(); card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' });
  assert.equal(card.config.power_entity, 'sensor.one_total_active_power');
  card.willUpdate();
  const pending = api.loadIntegration('sensor.two_status', { ...hass });
  await Promise.resolve(); await Promise.resolve();
  finishEntities([...fixture('one'), ...fixture('two', 'zha')]); finishDevices([{ id: 'one', name_by_user: 'Garage charger' }]);
  await pending; await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length, 2);
  assert.equal(card.config.power_entity, 'sensor.one_watts'); assert.equal(card.config.title, 'Garage charger'); assert.ok(card.updates >= 2);
  assert.equal(api.getAutomaticEntities('sensor.two_status', hass).power_entity, 'sensor.two_watts');
  await api.loadIntegration('sensor.one_status', hass); assert.equal(requests.length, 2);
});
test('registry failure is bounded and retries after expiry; device registry failure is independent', async () => {
  const api = setup(); let requests = 0, available = false;
  const hass = { connection: {}, states: {}, async callWS(message) { requests++; if (!available || message.type === 'config/device_registry/list') throw new Error('Denied'); return fixture('one'); } };
  await api.loadIntegration('sensor.one_status', hass); const failedRequests = requests;
  await api.loadIntegration('sensor.one_status', hass); assert.equal(requests, failedRequests);
  available = true; api.advance(31_000); await api.loadIntegration('sensor.one_status', hass);
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
});
test('registry refresh replaces renamed entries after cache expiry', async () => {
  const api = setup(); let entries = fixture('one');
  const hass = { connection: {}, states: {}, callWS: async message => message.type === 'config/entity_registry/list' ? entries : [] };
  await api.loadIntegration('sensor.one_status', hass);
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
  entries = entries.map(entry => entry.entity_id === 'sensor.one_watts' ? { ...entry, entity_id: 'sensor.renamed_total' } : entry);
  api.advance(61_000); await api.loadIntegration('sensor.one_status', hass);
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.renamed_total');
});
test('a pending lookup cannot change a newly selected charger', async () => {
  const api = setup(); let finish;
  const hass = { connection: {}, states: {}, callWS: message => message.type === 'config/entity_registry/list' ? new Promise(resolve => { finish = resolve; }) : Promise.resolve([]) };
  const card = new api.Card(); card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' }); card.willUpdate();
  card.setConfig({ status_entity: 'sensor.two_status' }); card.willUpdate();
  await Promise.resolve(); await Promise.resolve(); finish([...fixture('one'), ...fixture('two', 'zha')]);
  await api.loadIntegration('sensor.two_status', hass);
  assert.equal(card.config.power_entity, 'sensor.two_watts'); assert.equal(api.getIntegration('sensor.two_status', hass), 'zha');
});
test('original metadata wins over misleading user entity IDs', () => {
  const api = setup(), hass = hassWith([
    { entity_id: 'sensor.garage_status', device_id: 'one', platform: 'mqtt' },
    { entity_id: 'sensor.voltage_phase_b', device_id: 'one', platform: 'mqtt', original_name: 'Current' },
    { entity_id: 'sensor.total_random', device_id: 'one', platform: 'mqtt', original_name: 'Last session energy' },
    { entity_id: 'sensor.random_b', device_id: 'one', platform: 'mqtt', unique_id: '0x123_current_phase_b_zigbee2mqtt' },
  ]);
  const result = api.getAutomaticEntities('sensor.garage_status', hass);
  assert.equal(result.current_entity, 'sensor.voltage_phase_b');
  assert.equal(result.energy_entity, 'sensor.total_random');
  assert.equal(api.getPhaseEntities('sensor.garage_status', hass, 'current', result.current_entity, false)[1], 'sensor.random_b');
});
test('editor helpers refresh after async discovery even without integration change', async () => {
  const api = setup(), editor = new api.Editor(); let renders = 0;
  editor.render = () => { renders++; };
  editor.setConfig({ status_entity: 'sensor.one_status' });
  const hass = { connection: {}, states: {}, callWS: async message => message.type === 'config/entity_registry/list' ? fixture('one') : [] };
  editor.hass = hass;
  await api.loadIntegration('sensor.one_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(editor.getDefaultEntity('power_entity'), 'sensor.one_watts');
  assert.ok(renders >= 2);
});
test('device registry identifiers supply integration when status metadata is partial', () => {
  const api = setup(), hass = hassWith([{ entity_id: 'sensor.one_status', device_id: 'one' }], [{ id: 'one', identifiers: [['zha', 'ieee-one']] }]);
  assert.equal(api.getIntegration('sensor.one_status', hass), 'zha');
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_total_power');
});
test('renamed phases render normally without individual power sensors', () => {
  const api = setup(), hass = hassWith(fixture('one'));
  hass.states['sensor.one_status'] = { state: 'Charging', attributes: {} };
  for (const [id, state, unit] of [['watts', '6.9', 'kW'], ['amps', '10', 'A'], ['amps_b', '11', 'A'], ['amps_c', '12', 'A'], ['volts', '230', 'V'], ['volts_b', '231', 'V'], ['volts_c', '229', 'V']]) hass.states[`sensor.one_${id}`] = { state, attributes: { unit_of_measurement: unit } };
  hass.locale = 'en-US';
  const card = new api.Card(); card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' });
  const output = card.render();
  for (const value of ['A: 10.0 A', 'B: 11.0 A', 'C: 12.0 A', '3p 230.0 V', '6.9 kW']) assert.ok(output.includes(value));
});
test('unavailable and disabled registry entries do not divert discovery to another charger', () => {
  const api = setup(), entries = [...fixture('one'), ...fixture('two')];
  entries.find(entry => entry.entity_id === 'sensor.one_signal').disabled_by = 'user';
  const hass = hassWith(entries);
  hass.states['sensor.one_watts'] = { state: 'unavailable', attributes: {} };
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).power_entity, 'sensor.one_watts');
  assert.equal(api.getAutomaticEntities('sensor.one_status', hass).linkquality_entity, 'sensor.one_signal');
});
test('same-device entities from another config entry cannot win matching', () => {
  const api = setup(), entries = fixture('one');
  entries.push({ entity_id: 'sensor.other_total', device_id: 'one', platform: 'mqtt', config_entry_id: 'another-entry', original_name: 'Total active power' });
  assert.equal(api.getAutomaticEntities('sensor.one_status', hassWith(entries)).power_entity, 'sensor.one_watts');
});


test('frequent HA state updates reuse discovery, config and phases without registry traversal or async renders', async () => {
  const api = setup(); let traversals = 0, requests = 0;
  const original = hassWith([...fixture('one'), ...fixture('two', 'zha')]);
  original.entities = new Proxy(original.entities, { ownKeys(target) { traversals++; return Reflect.ownKeys(target); } });
  original.callWS = async message => { requests++; return message.type === 'config/entity_registry/list' ? [...fixture('one'), ...fixture('two', 'zha')] : []; };
  const card = new api.Card(); card.hass = original; card.setConfig({ status_entity: 'sensor.one_status' }); card.willUpdate();
  await api.loadIntegration('sensor.one_status', original);
  await new Promise(resolve => setImmediate(resolve));
  const config = card.config;
  const phases = api.getPhaseEntities('sensor.one_status', original, 'current', config.current_entity, false);
  const scans = traversals, updates = card.updates, calls = requests;
  api.advance(120_000);
  for (let i = 0; i < 2000; i++) {
    card.hass = { ...original, states: { 'sensor.one_status': { state: 'Charging', attributes: {} }, 'sensor.one_amps': { state: String(i), attributes: {} } } };
    card.willUpdate();
    assert.equal(card.config, config);
    assert.equal(api.getPhaseEntities('sensor.one_status', card.hass, 'current', config.current_entity, false), phases);
    card.render();
  }
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(traversals, scans);
  assert.equal(requests, calls);
  assert.equal(card.updates, updates);
  card.setConfig({ status_entity: 'sensor.two_status', current_entity: 'sensor.manual' }); card.willUpdate();
  assert.equal(card.config.power_entity, 'sensor.two_watts');
  assert.equal(card.config.current_entity, 'sensor.manual');
  card.setConfig({ status_entity: 'sensor.two_status' });
  assert.equal(card.config.current_entity, 'sensor.two_amps');
});

test('registry collection replacements invalidate cached mappings and device titles', () => {
  const api = setup(); const hass = hassWith(fixture('one'), [{ id: 'one', name: 'Old name' }]);
  const card = new api.Card(); card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' });
  assert.equal(card.config.power_entity, 'sensor.one_watts');
  const entities = { ...hass.entities }; entities['sensor.renamed'] = { ...entities['sensor.one_watts'], entity_id: 'sensor.renamed' }; delete entities['sensor.one_watts'];
  card.hass = { ...hass, entities, devices: { one: { id: 'one', name_by_user: 'New name' } } }; card.willUpdate();
  assert.equal(card.config.power_entity, 'sensor.renamed');
  assert.equal(card.config.title, 'New name');
});

test('registry events refresh one shared snapshot and do not cause circular updates', async () => {
  const api = setup(); const events = {}; let requests = 0, entries = fixture('one');
  const hass = { connection: { subscribeEvents(callback, type) { events[type] = callback; return Promise.resolve(() => {}); } }, states: {}, callWS: async message => { requests++; return message.type === 'config/entity_registry/list' ? entries : [{ id: 'one', name: 'Garage' }]; } };
  const first = new api.Card(), second = new api.Card();
  for (const card of [first, second]) { card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' }); card.willUpdate(); }
  await api.loadIntegration('sensor.one_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests, 2);
  entries = entries.map(entry => entry.entity_id === 'sensor.one_watts' ? { ...entry, entity_id: 'sensor.new_total' } : entry);
  events.entity_registry_updated();
  await api.loadIntegration('sensor.one_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests, 4);
  for (const card of [first, second]) { assert.equal(card.config.power_entity, 'sensor.new_total'); card.willUpdate(); }
  const updates = first.updates;
  for (let i = 0; i < 100; i++) first.willUpdate();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(first.updates, updates); assert.equal(requests, 4);
});


test('state updates while discovery is pending register one completion per card', async () => {
  const api = setup(); let finish, requests = 0;
  const hass = { connection: {}, states: {}, callWS(message) { requests++; return message.type === 'config/entity_registry/list' ? new Promise(resolve => { finish = resolve; }) : Promise.resolve([]); } };
  const card = new api.Card(); card.hass = hass; card.setConfig({ status_entity: 'sensor.one_status' });
  const initial = card.updates;
  for (let i = 0; i < 1000; i++) { card.hass = { ...hass, states: {} }; card.willUpdate(); }
  await Promise.resolve(); await Promise.resolve();
  finish(fixture('one')); await api.loadIntegration('sensor.one_status', hass); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests, 2); assert.equal(card.updates, initial + 1);
  assert.equal(card.config.power_entity, 'sensor.one_watts');
});

test('editor state updates do not repeat discovery or rebuild the editor', async () => {
  const api = setup(); const editor = new api.Editor(); let renders = 0, requests = 0;
  editor.render = () => { renders++; };
  const hass = { connection: {}, states: {}, callWS: async message => { requests++; return message.type === 'config/entity_registry/list' ? fixture('one') : []; } };
  editor.setConfig({ status_entity: 'sensor.one_status' }); editor.hass = hass;
  await api.loadIntegration('sensor.one_status', hass); await new Promise(resolve => setImmediate(resolve));
  const count = renders;
  for (let i = 0; i < 1000; i++) editor.hass = { ...hass, states: {} };
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(renders, count); assert.equal(requests, 2);
  editor.disconnectedCallback();
});
