const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Use the project's TypeScript dependency; no additional test runtime is required.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const storePath = path.resolve(__dirname, '../src/shared/stores/cart.store.ts');
const { THEMES_DATA } = require('../src/shared/data/themes-data.ts');
const key = 'themestore-cart';
let storage;

function loadStore() {
  delete require.cache[storePath];
  return require(storePath).useCartStore;
}

beforeEach(() => {
  storage = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (name) => storage.get(name) ?? null,
      setItem: (name, value) => storage.set(name, value),
      removeItem: (name) => storage.delete(name),
    },
  });
});

test('add, replace duplicate, remove and clear recalculate catalog totals', () => {
  const cart = loadStore();
  cart.getState().addItem(THEMES_DATA[0]);
  cart.getState().addItem(THEMES_DATA[1]);
  cart.getState().addItem({ ...THEMES_DATA[0], price_vnd: 1 });
  assert.equal(cart.getState().items.length, 2);
  assert.equal(cart.getState().getTotal(), 1680000);
  assert.equal(cart.getState().isCartOpen, true);
  cart.getState().removeItem(1);
  assert.equal(cart.getState().getTotal(), 790000);
  cart.getState().clearCart();
  assert.equal(cart.getState().getTotal(), 0);
  assert.deepEqual(cart.getState().items, []);
});

test('Agency and Lifetime cannot be added or replace Regular', () => {
  const cart = loadStore();
  cart.getState().addItem(THEMES_DATA[0], 'agency');
  assert.equal(cart.getState().items.length, 0);
  cart.getState().addItem(THEMES_DATA[0], 'regular');
  cart.getState().addItem(THEMES_DATA[0], 'lifetime');
  assert.equal(cart.getState().items.length, 1);
  assert.equal(cart.getState().items[0].license_type, 'regular');
  assert.equal(cart.getState().getTotal(), 890000);
});

test('currency uses the listed VND and USD values without conversion', () => {
  const cart = loadStore();
  cart.getState().addItem(THEMES_DATA[0]);
  cart.getState().addItem(THEMES_DATA[1]);
  cart.getState().setCurrency('USD');
  assert.deepEqual(cart.getState().items.map((item) => item.price), [49, 42]);
  assert.equal(cart.getState().getTotal(), 91);
  cart.getState().setCurrency('EUR');
  assert.equal(cart.getState().currency, 'USD');
  cart.getState().setCurrency('VND');
  assert.equal(cart.getState().getTotal(), 1680000);
});

test('refresh restores after explicit hydration and stores only non-sensitive references', async () => {
  const original = loadStore();
  original.getState().addItem(THEMES_DATA[0]);
  original.getState().setCurrency('USD');
  assert.deepEqual(JSON.parse(storage.get(key)), {
    state: { currency: 'USD', items: [{ theme_id: 1, license_type: 'regular' }] }, version: 1,
  });
  const refreshed = loadStore();
  assert.equal(refreshed.persist.hasHydrated(), false);
  assert.equal(refreshed.getState().items.length, 0);
  assert.equal(refreshed.getState().currency, 'VND');
  await refreshed.persist.rehydrate();
  assert.equal(refreshed.persist.hasHydrated(), true);
  assert.equal(refreshed.getState().getTotal(), 49);
  assert.equal(refreshed.getState().isCartOpen, false);
  assert.equal(refreshed.getInitialState().items.length, 0);
});

test('old entries are deduplicated, re-priced and stripped of injected fields', async () => {
  storage.set(key, JSON.stringify({ version: 0, state: {
    currency: 'USD', isCartOpen: true, customer_email: 'must-not-persist@example.invalid',
    items: [
      { theme: { id: 1, name: 'fake', price_usd: 1 }, license_type: 'regular', price: 1 },
      { theme_id: 1, license_type: 'regular' },
      { theme_id: 2, license_type: 'agency' },
      { theme_id: 3, license_type: 'lifetime' },
      { theme_id: 999, license_type: 'regular' }, null,
    ],
  } }));
  const cart = loadStore();
  await cart.persist.rehydrate();
  assert.equal(cart.getState().items.length, 1);
  assert.equal(cart.getState().items[0].theme.name, THEMES_DATA[0].name);
  assert.equal(cart.getState().getTotal(), 49);
  assert.equal(cart.getState().isCartOpen, false);
  assert.equal(storage.get(key).includes('customer_email'), false);
});

test('malformed storage cannot break hydration or subsequent additions', async () => {
  for (const raw of ['{broken', 'null', '[]', '{"state":{"items":null}}', '{"state":{"items":[{},null,"bad"],"currency":"EUR"},"version":1}']) {
    storage.set(key, raw);
    const cart = loadStore();
    await cart.persist.rehydrate();
    assert.equal(cart.persist.hasHydrated(), true);
    assert.equal(cart.getState().items.length, 0);
    assert.equal(cart.getState().currency, 'VND');
    cart.getState().addItem(THEMES_DATA[0]);
    assert.equal(cart.getState().getTotal(), 890000);
  }
});

test('unavailable localStorage keeps the in-memory cart usable', async () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('Storage blocked'); },
  });
  const cart = loadStore();
  await cart.persist.rehydrate();
  assert.equal(cart.persist.hasHydrated(), true);
  assert.doesNotThrow(() => cart.getState().addItem(THEMES_DATA[0]));
  assert.equal(cart.getState().getTotal(), 890000);
  assert.doesNotThrow(() => cart.getState().removeItem(1));
  assert.equal(cart.getState().getTotal(), 0);
});

test('quota errors do not prevent live cart changes', () => {
  globalThis.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  const cart = loadStore();
  assert.doesNotThrow(() => cart.getState().addItem(THEMES_DATA[0]));
  assert.equal(cart.getState().getTotal(), 890000);
});

test('removed themes stay removed after refresh', async () => {
  const cart = loadStore();
  cart.getState().addItem(THEMES_DATA[0]);
  cart.getState().removeItem(1);
  const refreshed = loadStore();
  await refreshed.persist.rehydrate();
  assert.deepEqual(refreshed.getState().items, []);
});

test('interaction before the mount effect restores saved items before writing', () => {
  storage.set(key, JSON.stringify({ version: 1, state: {
    currency: 'USD', items: [{ theme_id: 1, license_type: 'regular' }],
  } }));
  const cart = loadStore();
  cart.getState().openCart();
  assert.equal(cart.getState().isCartOpen, true);
  assert.equal(cart.getState().getTotal(), 49);
  cart.getState().addItem(THEMES_DATA[1]);
  assert.equal(cart.getState().getTotal(), 91);
  assert.equal(JSON.parse(storage.get(key)).state.items.length, 2);
});

test('unknown products are ignored and drawer controls do not change totals', () => {
  const cart = loadStore();
  cart.getState().addItem({ ...THEMES_DATA[0], id: 999 });
  assert.equal(cart.getState().items.length, 0);
  cart.getState().openCart();
  assert.equal(cart.getState().isCartOpen, true);
  cart.getState().toggleCart();
  assert.equal(cart.getState().isCartOpen, false);
  cart.getState().closeCart();
  assert.equal(cart.getState().getTotal(), 0);
});
