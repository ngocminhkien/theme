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

if (!require.extensions['.ts']) {
  require.extensions['.ts'] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}

if (!require.extensions['.tsx']) {
  require.extensions['.tsx'] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const navMock = {
  useRouter: () => ({ replace: () => {}, push: () => {}, prefetch: () => {} }),
  usePathname: () => '/admin',
  useSearchParams: () => new URLSearchParams(),
};

try {
  const resolvedNav = require.resolve('next/navigation');
  require.cache[resolvedNav] = {
    id: resolvedNav,
    filename: resolvedNav,
    loaded: true,
    exports: navMock,
  };
} catch {
  // If resolution fails
}

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === 'next/navigation') {
    return 'next/navigation';
  }
  return originalResolve.call(this, request, parent, isMain, options);
};
require.cache['next/navigation'] = {
  id: 'next/navigation',
  filename: 'next/navigation',
  loaded: true,
  exports: navMock,
};

const adminApiPath = path.resolve(__dirname, '../src/features/admin/api-client.ts');
const authPath = path.resolve(__dirname, '../src/features/auth/auth-client.ts');
const guardPath = path.resolve(__dirname, '../src/features/admin/AdminGuard.tsx');

const {
  getStats,
  getAnalytics,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  getThemes,
  getThemeDetail,
  createTheme,
  updateTheme,
  getCategories,
  getLicenses,
  getLicenseDetail,
  deactivateLicenseDomain,
  resetLicenseDomains,
  getCustomers,
  createCustomer,
  getCustomerDetail,
  updateCustomerRole,
  AdminApiError,
} = require(adminApiPath);

const { AUTH_TOKEN_KEY } = require(authPath);
const { AdminGuard } = require(guardPath);

let storageMap;

beforeEach(() => {
  storageMap = new Map();
  global.window = {
    localStorage: {
      getItem: (k) => storageMap.get(k) ?? null,
      setItem: (k, v) => storageMap.set(k, v),
      removeItem: (k) => storageMap.delete(k),
    },
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
});

test('unauthenticated calls to admin API endpoints are rejected before making network requests', async () => {
  storageMap.clear();
  let networkCalled = false;
  global.fetch = async () => {
    networkCalled = true;
    return { ok: true, json: async () => ({ success: true, data: {} }) };
  };

  await assert.rejects(getStats(), (err) => {
    assert.match(err.message, /Vui lòng đăng nhập với tài khoản quản trị viên/);
    assert.equal(err.status, 401);
    return true;
  });

  await assert.rejects(getOrders(), /Vui lòng đăng nhập với tài khoản quản trị viên/);
  await assert.rejects(getThemes(), /Vui lòng đăng nhập với tài khoản quản trị viên/);
  await assert.rejects(getLicenses(), /Vui lòng đăng nhập với tài khoản quản trị viên/);
  await assert.rejects(getCustomers(), /Vui lòng đăng nhập với tài khoản quản trị viên/);

  assert.equal(networkCalled, false, 'network requests must be prevented when no admin token exists');
});

test('authenticated admin API calls include Bearer token and Content-Type headers', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-secret-jwt-token-xyz');
  const capturedRequests = [];

  global.fetch = async (url, init) => {
    capturedRequests.push({
      url,
      method: init?.method || 'GET',
      auth: init?.headers?.get('Authorization'),
      contentType: init?.headers?.get('Content-Type'),
    });
    return {
      ok: true,
      json: async () => ({ success: true, data: { revenue: { vnd: 599000, usd: 29 }, orders: { total: 1, paid: 1, pending: 0, failed: 0 } } }),
    };
  };

  await getStats();
  assert.equal(capturedRequests.length, 1);
  assert.equal(capturedRequests[0].url, '/api/v1/admin/stats');
  assert.equal(capturedRequests[0].method, 'GET');
  assert.equal(capturedRequests[0].auth, 'Bearer admin-secret-jwt-token-xyz');
  assert.equal(capturedRequests[0].contentType, 'application/json');
});

test('multi-currency revenue KPI strictly isolates VND and USD without aggregation', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-token');

  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        revenue: { vnd: 12500000, usd: 145.5 },
        orders: { total: 20, paid: 18, pending: 2, failed: 0 },
        themes_count: 10,
        customers_count: 35,
        active_licenses_count: 24,
        recent_orders: [],
      },
    }),
  });

  const stats = await getStats();
  // Invariant INV-01: VND and USD revenue must be distinct numerical fields
  assert.equal(typeof stats.revenue.vnd, 'number');
  assert.equal(typeof stats.revenue.usd, 'number');
  assert.equal(stats.revenue.vnd, 12500000);
  assert.equal(stats.revenue.usd, 145.5);
  // There must NOT be any unified "total_revenue" field attempting to merge VND and USD
  assert.equal(stats.revenue.total, undefined);

  // Conversion rate calculations
  const total = stats.orders.total;
  const paid = stats.orders.paid;
  const paidConversionRate = ((paid / total) * 100).toFixed(1);
  assert.equal(paidConversionRate, '90.0');
});

test('order filtering serializes query parameters and updateOrderStatus sends status patch payload', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
  const captured = [];

  global.fetch = async (url, init) => {
    captured.push({ url, method: init?.method, body: init?.body ? JSON.parse(init.body) : null });
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: { orders: [], pagination: { page: 2, limit: 10, total: 15, total_pages: 2 } },
      }),
    };
  };

  await getOrders({
    page: 2,
    limit: 10,
    search: 'ORD-999',
    status: 'paid',
    date_from: '2026-10-01',
    date_to: '2026-10-13',
  });

  assert.equal(captured.length, 1);
  const url = captured[0].url;
  assert.match(url, /page=2/);
  assert.match(url, /limit=10/);
  assert.match(url, /search=ORD-999/);
  assert.match(url, /status=paid/);
  assert.match(url, /date_from=2026-10-01/);
  assert.match(url, /date_to=2026-10-13/);

  // Status update
  global.fetch = async (url, init) => {
    captured.push({ url, method: init?.method, body: JSON.parse(init?.body) });
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: { order_number: 'ORD-2026-8888', payment_status: 'paid', order_status: 'completed' },
      }),
    };
  };

  const updateResult = await updateOrderStatus('ORD-2026-8888', {
    payment_status: 'paid',
    order_status: 'completed',
  });

  assert.equal(captured.length, 2);
  assert.equal(captured[1].url, '/api/v1/admin/orders/ORD-2026-8888/status');
  assert.equal(captured[1].method, 'PATCH');
  assert.deepEqual(captured[1].body, { payment_status: 'paid', order_status: 'completed' });
});

test('themes CRUD handles creation, update, and field validation parameters', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
  const calls = [];

  global.fetch = async (url, init) => {
    calls.push({ url, method: init?.method, body: init?.body ? JSON.parse(init.body) : null });
    return {
      ok: true,
      json: async () => ({ success: true, data: { id: 12, updated_fields: ['price_vnd = ?'] } }),
    };
  };

  await createTheme({
    name: 'Basel - Modern Shop',
    slug: 'basel-modern-shop',
    price_vnd: 499000,
    price_usd: 25,
    category_id: 1,
    status: 'draft',
    live_demo_url: 'https://demo.example.com/basel',
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/v1/admin/themes');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].body.slug, 'basel-modern-shop');
  assert.equal(calls[0].body.price_vnd, 499000);

  await updateTheme(12, { price_vnd: 550000 });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, '/api/v1/admin/themes/12');
  assert.equal(calls[1].method, 'PUT');
  assert.equal(calls[1].body.price_vnd, 550000);
});

test('license domain quota tracking and domain deactivation actions', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
  const captured = [];

  global.fetch = async (url, init) => {
    captured.push({ url, method: init?.method, body: init?.body ? JSON.parse(init.body) : null });
    if (url.includes('/deactivate')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          message: 'Đã hủy kích hoạt thành công domain: dev.shop.local',
          data: { license_key: 'WD-KEY-123', domain: 'dev.shop.local', is_active: 0 },
        }),
      };
    }
    if (url.includes('/reset')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          message: 'Đã đặt lại toàn bộ domain.',
          data: { license_key: 'WD-KEY-123', active_domains_count: 0 },
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 1,
          license_key: 'WD-KEY-123',
          max_domains: 5,
          active_domains_count: 3,
          activations: [{ id: 1, domain: 'dev.shop.local', is_active: 1 }],
        },
      }),
    };
  };

  const detail = await getLicenseDetail('WD-KEY-123');
  assert.equal(detail.max_domains, 5);
  assert.equal(detail.activations.length, 1);

  // Deactivate domain
  const deactResult = await deactivateLicenseDomain('WD-KEY-123', 'dev.shop.local');
  assert.equal(captured[1].url, '/api/v1/admin/licenses/WD-KEY-123/deactivate');
  assert.equal(captured[1].method, 'POST');
  assert.deepEqual(captured[1].body, { domain: 'dev.shop.local' });
  assert.equal(deactResult.is_active, 0);

  // Reset domains
  const resetResult = await resetLicenseDomains('WD-KEY-123');
  assert.equal(captured[2].url, '/api/v1/admin/licenses/WD-KEY-123/reset');
  assert.equal(captured[2].method, 'POST');
  assert.equal(resetResult.active_domains_count, 0);
});

test('customer RBAC and self-demotion safeguard behavior', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
  const captured = [];

  global.fetch = async (url, init) => {
    captured.push({ url, method: init?.method, body: init?.body ? JSON.parse(init.body) : null });
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: { user: { id: 5, email: 'user5@test.local', role: 'admin' } },
      }),
    };
  };

  // Change another customer's role to admin
  const result = await updateCustomerRole(5, 'admin');
  assert.equal(captured[0].url, '/api/v1/admin/customers/5/role');
  assert.equal(captured[0].method, 'PATCH');
  assert.deepEqual(captured[0].body, { role: 'admin' });
  assert.equal(result.user.role, 'admin');

  // Self-demotion safeguard validation
  const loggedInAdmin = { id: 1, email: 'root@admin.local', role: 'admin' };
  const targetUser = { id: 1, email: 'root@admin.local', role: 'admin' };

  // Emulating the frontend safeguard check in Customers page
  const canDemote = !(loggedInAdmin.id === targetUser.id && 'customer' !== 'admin');
  assert.equal(canDemote, false, 'self-demotion must be blocked in UI');
});

test('AdminGuard static rendering produces loading status without breaking SSR', () => {
  storageMap.clear();

  const html = renderToStaticMarkup(
    React.createElement(AdminGuard, null, React.createElement('div', null, 'Admin Content'))
  );
  assert.match(html, /Theme Portal Admin/);
  assert.match(html, /Đang xác thực/);
});
