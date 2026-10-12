const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const Module = require('node:module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const target = path.resolve(__dirname, '../src', request.slice(2));
    return originalResolveFilename.call(this, target, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
require.extensions['.tsx'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const root = path.resolve(__dirname, '../src/features/checkout');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { validateCheckout, buildCheckoutPayload } = require(path.join(root, 'checkout-schema.ts'));
const { CheckoutRequest } = require(path.join(root, 'checkout-request.ts'));
const { createCheckoutOrder, getPendingVietQrError, isConfirmedPaid } = require(path.join(root, 'api-client.ts'));
const { VietQrModal } = require(path.join(root, 'components', 'vietqr-modal.tsx'));

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
  const local = new Map();
  local.set('themestore-auth-token', 'mock-user-jwt');
  global.window = {
    localStorage: {
      getItem: key => local.get(key) ?? null,
      setItem: (key, value) => local.set(key, value),
      removeItem: key => local.delete(key),
    },
  };
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

test('accepts a server VietQR response and rejects missing or mismatched QR data without clearing the cart', async () => {
  const payload = buildCheckoutPayload(fields, [regularItem], 'VND');
  const valid = await createCheckoutOrder(payload, '4f3ef5b0-2446-4afe-aafb-002bd398ce71');
  assert.equal(getPendingVietQrError(valid), null);
  assert.match(valid.vietQrUrl, /^https:\/\/img\.vietqr\.io\/image\//);

  const response = (vietQrUrl) => ({ ok: true, json: async () => ({ success: true, data: {
    ...valid, orderId: 8, vietQrUrl,
  } }) });
  global.fetch = async () => response(null);
  await assert.rejects(createCheckoutOrder(payload, '5f3ef5b0-2446-4afe-aafb-002bd398ce71'), /chưa cung cấp mã VietQR hợp lệ/);

  global.fetch = async () => response('https://img.vietqr.io/image/970422-123456789-compact2.png?amount=1&addInfo=OD-20261012-A1B2C3');
  await assert.rejects(createCheckoutOrder(payload, '6f3ef5b0-2446-4afe-aafb-002bd398ce71'), /Mã VietQR không khớp đơn hàng/);
});

test('VietQR modal renders the server URL and has an explicit image-load error state', () => {
  const qrUrl = 'https://img.vietqr.io/image/970422-123456789-compact2.png?amount=599000&addInfo=OD-20261012-A1B2C3';
  const markup = renderToStaticMarkup(React.createElement(VietQrModal, {
    qrUrl,
    order: { orderId: 7, orderNumber: 'OD-20261012-A1B2C3', total_amount: 599000, currency: 'VND', payment_method: 'vietqr', payment_status: 'pending', order_status: 'processing', vietQrUrl: qrUrl },
    onPaid: () => {},
    onClose: () => {},
  }));
  assert.match(markup, /src="https:\/\/img\.vietqr\.io\/image\/970422-123456789-compact2\.png\?amount=599000&amp;addInfo=OD-20261012-A1B2C3"/);
  const modal = fs.readFileSync(path.join(root, 'components', 'vietqr-modal.tsx'), 'utf8');
  assert.match(modal, /onError=\{\(\) => setImageError\(true\)\}/);
  assert.match(modal, /Không tải được hình mã VietQR/);
});

test('checkout requires an authenticated JWT session and includes Authorization header', async () => {
  const payload = buildCheckoutPayload(fields, [regularItem], 'VND');

  // Without auth token
  global.window.localStorage.removeItem('themestore-auth-token');
  await assert.rejects(createCheckoutOrder(payload, 'test-key-no-auth'), /Vui lòng đăng nhập/);

  // With auth token
  let authHeader = null;
  global.window.localStorage.setItem('themestore-auth-token', 'valid-jwt-token-xyz');
  global.fetch = async (_url, init) => {
    authHeader = init.headers.get('Authorization');
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          orderId: 7, orderNumber: 'OD-20261012-A1B2C3',
          total_amount: 599000, currency: 'VND', payment_method: 'vietqr',
          payment_status: 'pending', order_status: 'processing',
          vietQrUrl: 'https://img.vietqr.io/image/970422-123456789-compact2.png?amount=599000&addInfo=OD-20261012-A1B2C3',
        },
      }),
    };
  };

  const order = await createCheckoutOrder(payload, 'test-key-auth');
  assert.equal(authHeader, 'Bearer valid-jwt-token-xyz');
  assert.equal(order.orderNumber, 'OD-20261012-A1B2C3');
});
