const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const root = path.resolve(__dirname, '../src/features/checkout');
const { validateCheckout, buildCheckoutPayload } = require(path.join(root, 'checkout-schema.ts'));
const { CheckoutRequest } = require(path.join(root, 'checkout-request.ts'));
const { isConfirmedPaid } = require(path.join(root, 'api-client.ts'));

const regularItem = {
  theme: { id: 1, slug: 'woodmart', name: 'WoodMart', price_vnd: 599000, price_usd: 29 },
  license_type: 'regular', price: 599000, currency: 'VND',
};
const fields = { fullName: 'Nguyễn Văn An', email: 'an@example.com', phone: '0912 345 678' };
let storage;
let calls;

beforeEach(() => {
  storage = new Map();
  calls = 0;
  global.sessionStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
  global.fetch = async (_url, init) => {
    calls += 1;
    const body = JSON.parse(init.body);
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          orderId: 7, orderNumber: 'OD-20261012-A1B2C3',
          total_amount: 599000, currency: 'VND', payment_method: 'vietqr',
          payment_status: 'pending', order_status: 'processing',
          vietQrUrl: 'https://img.vietqr.io/image/970422-123456789-compact2.png?amount=599000&addInfo=OD-20261012-A1B2C3',
          receivedKey: body.idempotency_key,
        },
      }),
    };
  };
});

test('rejects missing customer data, empty cart, unsupported license and USD without changing cart', () => {
  assert.match(validateCheckout({ fullName: '', email: 'bad', phone: 'abc' }, [], 'VND').cart, /trống/);
  assert.ok(validateCheckout({ fullName: '', email: 'bad', phone: 'abc' }, [], 'VND').fullName);
  assert.ok(validateCheckout({ fullName: '', email: 'bad', phone: 'abc' }, [], 'VND').email);
  assert.ok(validateCheckout({ fullName: '', email: 'bad', phone: 'abc' }, [], 'VND').phone);
  assert.match(validateCheckout(fields, [{ ...regularItem, license_type: 'agency' }], 'VND').cart, /Regular/);
  assert.match(validateCheckout(fields, [regularItem], 'USD').payment, /USD/);
});

test('builds full regular item payload and price agreement from the cart', () => {
  const payload = buildCheckoutPayload(fields, [regularItem], 'VND');
  assert.deepEqual(payload.items, [{ theme_id: 1, theme_slug: 'woodmart', license_type: 'regular' }]);
  assert.equal(payload.total_amount, 599000);
  assert.equal(payload.customer_phone, '0912 345 678');
});

test('one submit promise prevents duplicate requests and retries reuse a random idempotency key', async () => {
  const payload = buildCheckoutPayload(fields, [regularItem], 'VND');
  const request = new CheckoutRequest();
  const [a, b] = await Promise.all([request.submit(payload), request.submit(payload)]);
  assert.equal(calls, 1);
  assert.equal(a.orderNumber, b.orderNumber);
  const key = [...storage.values()][0];
  assert.match(key, /^[a-f0-9-]{36}$/i);

  await request.submit(payload);
  assert.equal(calls, 2);
  assert.equal([...storage.values()][0], key);
});

test('an unavailable checkout API keeps the retry idempotency key and reports a safe error', async () => {
  global.fetch = async () => { throw new TypeError('offline'); };
  const request = new CheckoutRequest();
  await assert.rejects(request.submit(buildCheckoutPayload(fields, [regularItem], 'VND')), /Mất kết nối hoặc hết thời gian chờ/);
  const keys = [...storage.values()];
  assert.equal(keys.length, 1);
  assert.match(keys[0], /^[a-f0-9-]{36}$/i);
});

test('a cart is cleared only for the same order with paid and completed server status', () => {
  const order = { orderNumber: 'OD-20261012-A1B2C3', total_amount: 599000, currency: 'VND' };
  assert.equal(isConfirmedPaid({ ...order, payment_status: 'paid', order_status: 'completed' }, order), true);
  assert.equal(isConfirmedPaid({ ...order, payment_status: 'pending', order_status: 'processing' }, order), false);
  assert.equal(isConfirmedPaid({ ...order, orderNumber: 'OD-20261012-D4E5F6', payment_status: 'paid', order_status: 'completed' }, order), false);
});

