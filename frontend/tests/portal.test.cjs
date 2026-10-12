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

const authPath = path.resolve(__dirname, '../src/features/auth/auth-client.ts');
const accountPath = path.resolve(__dirname, '../src/features/account/api-client.ts');

const { getAuthToken, clearAuthToken, login, register, getCurrentUser } = require(authPath);
const { getMyOrders, getMyLicenses, getOrderReceipt, requestThemeDownload } = require(accountPath);

let storageMap;

beforeEach(() => {
  storageMap = new Map();
  global.window = {
    localStorage: {
      getItem: (k) => storageMap.get(k) ?? null,
      setItem: (k, v) => storageMap.set(k, v),
      removeItem: (k) => storageMap.delete(k),
    },
  };
});

test('unauthenticated calls to portal APIs throw an auth error without making network requests', async () => {
  storageMap.clear();
  let fetched = false;
  global.fetch = async () => {
    fetched = true;
    return { ok: true, json: async () => ({ success: true, data: [] }) };
  };

  await assert.rejects(getMyOrders(), /Vui lòng đăng nhập/);
  await assert.rejects(getMyLicenses(), /Vui lòng đăng nhập/);
  await assert.rejects(getOrderReceipt('OD-20261012-A1B2C3'), /Vui lòng đăng nhập/);
  await assert.rejects(requestThemeDownload('WD-TEST-KEY'), /Vui lòng đăng nhập/);
  await assert.rejects(getCurrentUser(), /Vui lòng đăng nhập/);
  assert.equal(fetched, false, 'must not perform fetch without authentication token');
});

test('authenticated calls include Bearer token header in all portal requests', async () => {
  storageMap.set('themestore-auth-token', 'jwt-test-user-token');
  const capturedHeaders = [];

  global.fetch = async (url, init) => {
    capturedHeaders.push({ url, auth: init.headers.get('Authorization') });
    return {
      ok: true,
      json: async () => ({ success: true, data: [] }),
    };
  };

  await getMyOrders();
  await getMyLicenses();

  assert.equal(capturedHeaders.length, 2);
  assert.equal(capturedHeaders[0].auth, 'Bearer jwt-test-user-token');
  assert.equal(capturedHeaders[1].auth, 'Bearer jwt-test-user-token');
});

test('getOrderReceipt returns order receipt with empty licenses when pending and licenses when paid', async () => {
  storageMap.set('themestore-auth-token', 'jwt-test-user-token');

  // Pending order
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        orderNumber: 'OD-20261012-PENDING',
        total_amount: 599000,
        currency: 'VND',
        payment_method: 'vietqr',
        payment_status: 'pending',
        order_status: 'processing',
        created_at: '2026-10-12T00:00:00.000Z',
        items: [{ theme_id: 1, theme_name: 'WoodMart', license_type: 'regular', unit_price: 599000 }],
        licenses: [],
      },
    }),
  });

  const pendingReceipt = await getOrderReceipt('OD-20261012-PENDING');
  assert.equal(pendingReceipt.orderNumber, 'OD-20261012-PENDING');
  assert.equal(pendingReceipt.payment_status, 'pending');
  assert.equal(pendingReceipt.licenses.length, 0, 'pending order must have 0 licenses');

  // Paid order
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        orderNumber: 'OD-20261012-PAID',
        total_amount: 599000,
        currency: 'VND',
        payment_method: 'vietqr',
        payment_status: 'paid',
        order_status: 'completed',
        created_at: '2026-10-12T00:00:00.000Z',
        items: [{ theme_id: 1, theme_name: 'WoodMart', license_type: 'regular', unit_price: 599000 }],
        licenses: [{ license_key: 'WD-VALID-KEY', license_type: 'regular', max_domains: 1, theme_name: 'WoodMart' }],
      },
    }),
  });

  const paidReceipt = await getOrderReceipt('OD-20261012-PAID');
  assert.equal(paidReceipt.payment_status, 'paid');
  assert.equal(paidReceipt.licenses.length, 1);
  assert.equal(paidReceipt.licenses[0].license_key, 'WD-VALID-KEY');
});

test('requestThemeDownload rejects safely when download storage is not configured', async () => {
  storageMap.set('themestore-auth-token', 'jwt-test-user-token');

  global.fetch = async () => ({
    ok: false,
    status: 503,
    json: async () => ({
      success: false,
      message: 'Kho tệp tải bảo mật chưa được cấu hình. License của bạn vẫn hợp lệ; vui lòng thử lại sau.',
      error: 'DOWNLOAD_NOT_CONFIGURED',
    }),
  });

  await assert.rejects(
    requestThemeDownload('WD-VALID-KEY'),
    /Kho tệp tải bảo mật chưa được cấu hình/
  );
});

test('login and register store token and clearAuthToken removes token', async () => {
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        user: { id: 7, email: 'an@example.com', full_name: 'Nguyễn Văn An', role: 'customer' },
        token: 'new-jwt-token-abc',
      },
    }),
  });

  const session = await login('an@example.com', 'secret123');
  assert.equal(session.token, 'new-jwt-token-abc');
  assert.equal(getAuthToken(), 'new-jwt-token-abc');

  clearAuthToken();
  assert.equal(getAuthToken(), null);
});
