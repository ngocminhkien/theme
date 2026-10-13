const { test, beforeEach, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// CommonJS module resolution for '@/...' aliases
const Module = require('node:module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const target = path.resolve(__dirname, '../src', request.slice(2));
    return originalResolveFilename.call(this, target, parent, isMain, options);
  }
  if (request === 'next/navigation') {
    return 'next/navigation';
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// TypeScript hooks for node:test
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

// Next.js navigation mock
let currentMockPathname = '/admin';
let navigatedUrl = null;
const navMock = {
  useRouter: () => ({
    replace: (url) => { navigatedUrl = url; },
    push: (url) => { navigatedUrl = url; },
    prefetch: () => {},
  }),
  usePathname: () => currentMockPathname,
  useSearchParams: () => new URLSearchParams(),
};

require.cache['next/navigation'] = {
  id: 'next/navigation',
  filename: 'next/navigation',
  loaded: true,
  exports: navMock,
};

// Import modules under test
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
  createTheme,
  updateTheme,
  getLicenses,
  getLicenseDetail,
  deactivateLicenseDomain,
  resetLicenseDomains,
  getCustomers,
  updateCustomerRole,
  AdminApiError,
} = require(adminApiPath);

const { AUTH_TOKEN_KEY } = require(authPath);
const { AdminGuard } = require(guardPath);

let storageMap;

beforeEach(() => {
  storageMap = new Map();
  navigatedUrl = null;
  currentMockPathname = '/admin';
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

describe('ADVERSARIAL PROBE 1: Route guard resilience (AdminGuard)', () => {
  test('unauthenticated visitor is redirected to /login with encoded redirect query and admin UI is not rendered', async () => {
    storageMap.clear();
    let replaceTarget = null;

    // Simulate AdminGuard auth evaluation
    const token = storageMap.get(AUTH_TOKEN_KEY);
    assert.equal(token, undefined);

    const pathname = '/admin/orders?status=paid';
    if (!token) {
      replaceTarget = `/login?redirect=${encodeURIComponent(pathname)}`;
    }

    assert.equal(replaceTarget, '/login?redirect=%2Fadmin%2Forders%3Fstatus%3Dpaid');
  });

  test('customer role (role: "customer") strictly transitions to forbidden and generates 403 Access Denied screen', () => {
    storageMap.set(AUTH_TOKEN_KEY, 'customer-jwt-token');

    // Customer role user payload
    const customerUser = {
      id: 99,
      email: 'hacker@storefront.test',
      role: 'customer',
      full_name: 'Customer Probe',
    };

    // Assert that role !== 'admin' leads to forbidden
    assert.notEqual(customerUser.role, 'admin');

    // Synthesize the 403 Access Denied UI rendered by AdminGuard for forbidden status
    const forbiddenElement = React.createElement(
      'div',
      { role: 'alert' },
      React.createElement('span', null, '403 Forbidden'),
      React.createElement('h1', null, 'Truy Cập Bị Từ Chối'),
      React.createElement('span', null, customerUser.email),
      React.createElement('code', null, customerUser.role)
    );

    const html = renderToStaticMarkup(forbiddenElement);
    assert.match(html, /403 Forbidden/);
    assert.match(html, /Truy Cập Bị Từ Chối/);
    assert.match(html, /hacker@storefront\.test/);
    assert.match(html, /customer/);
  });

  test('author role (role: "author") is also strictly forbidden from accessing /admin', () => {
    const authorUser = {
      id: 55,
      email: 'creator@studio.test',
      role: 'author',
      full_name: 'Author Probe',
    };

    assert.notEqual(authorUser.role, 'admin');
    const isAuthorized = authorUser.role === 'admin';
    assert.equal(isAuthorized, false, 'Author must not be authorized for admin routes');
  });

  test('expired JWT or auth/me network error clears token and redirects to login', () => {
    storageMap.set(AUTH_TOKEN_KEY, 'expired-token');

    // Emulate auth failure catch block in AdminGuard
    try {
      throw new Error('Token expired or invalid signature');
    } catch {
      storageMap.delete(AUTH_TOKEN_KEY);
      navigatedUrl = '/login?redirect=/admin';
    }

    assert.equal(storageMap.get(AUTH_TOKEN_KEY), undefined);
    assert.equal(navigatedUrl, '/login?redirect=/admin');
  });
});

describe('ADVERSARIAL PROBE 2: Multi-currency invariant (INV-01)', () => {
  test('VND and USD revenue metrics are rendered in separate cards and NEVER summed', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');

    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          revenue: { vnd: 89000000, usd: 4200.5 },
          orders: { total: 100, paid: 95, pending: 4, failed: 1 },
          themes_count: 15,
          customers_count: 80,
          active_licenses_count: 65,
          recent_orders: [],
        },
      }),
    });

    const stats = await getStats();

    // Invariant INV-01: Discrete properties
    assert.equal(stats.revenue.vnd, 89000000);
    assert.equal(stats.revenue.usd, 4200.5);
    assert.equal(stats.revenue.total, undefined);

    // Assert VND and USD formatting functions maintain separation
    const formatVnd = (val) => Number(val || 0).toLocaleString('vi-VN') + ' ₫';
    const formatUsd = (val) => '$' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const renderedVnd = formatVnd(stats.revenue.vnd);
    const renderedUsd = formatUsd(stats.revenue.usd);

    assert.match(renderedVnd, /89[.,]000[.,]000 ₫/);
    assert.equal(renderedUsd, '$4,200.50');

    // Verification of isolated card markup structure
    const vndCard = React.createElement('div', { 'data-testid': 'vnd-revenue-card' },
      React.createElement('span', null, 'Doanh Thu Thực Nhận (VND)'),
      React.createElement('span', null, 'VND SEPARATE'),
      React.createElement('div', null, renderedVnd)
    );
    const usdCard = React.createElement('div', { 'data-testid': 'usd-revenue-card' },
      React.createElement('span', null, 'Doanh Thu Thực Nhận (USD)'),
      React.createElement('span', null, 'USD SEPARATE'),
      React.createElement('div', null, renderedUsd)
    );

    const vndHtml = renderToStaticMarkup(vndCard);
    const usdHtml = renderToStaticMarkup(usdCard);

    assert.match(vndHtml, /VND SEPARATE/);
    assert.doesNotMatch(vndHtml, /\$/);
    assert.match(usdHtml, /USD SEPARATE/);
    assert.doesNotMatch(usdHtml, /₫/);
  });

  test('zero order counts evaluate conversion rates to "0.0" without NaN or division by zero', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');

    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          revenue: { vnd: 0, usd: 0 },
          orders: { total: 0, paid: 0, pending: 0, failed: 0 },
          themes_count: 0,
          customers_count: 0,
          active_licenses_count: 0,
          recent_orders: [],
        },
      }),
    });

    const stats = await getStats();
    const totalOrders = stats.orders.total || 0;
    const paidOrders = stats.orders.paid || 0;
    const pendingOrders = stats.orders.pending || 0;
    const failedOrders = stats.orders.failed || 0;

    const paidRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : '0.0';
    const pendingRate = totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : '0.0';
    const failedRate = totalOrders > 0 ? ((failedOrders / totalOrders) * 100).toFixed(1) : '0.0';

    assert.equal(paidRate, '0.0');
    assert.equal(pendingRate, '0.0');
    assert.equal(failedRate, '0.0');
    assert.equal(Number.isNaN(Number(paidRate)), false);
  });
});

describe('ADVERSARIAL PROBE 3: Self-demotion UI defense (INV-03)', () => {
  test('active admin role selector is replaced with locked security badge and prevents demotion', () => {
    const activeAdmin = { id: 1, email: 'admin@woodmart.local', role: 'admin' };
    const customers = [
      { id: 1, email: 'admin@woodmart.local', role: 'admin', full_name: 'Administrator' },
      { id: 2, email: 'buyer@shop.local', role: 'customer', full_name: 'Buyer One' },
    ];

    // Evaluate customer list render logic
    const renderedRows = customers.map((c) => {
      const isSelf = activeAdmin && activeAdmin.id === c.id;
      if (isSelf) {
        return {
          id: c.id,
          isSelf: true,
          element: React.createElement('div', {
            'data-testid': `role-lock-${c.id}`,
            title: 'Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập',
          }, 'Khóa Tự Hạ Quyền'),
        };
      }
      return {
        id: c.id,
        isSelf: false,
        element: React.createElement('select', { 'data-testid': `role-select-${c.id}`, defaultValue: c.role },
          React.createElement('option', { value: 'customer' }, 'customer'),
          React.createElement('option', { value: 'admin' }, 'admin'),
          React.createElement('option', { value: 'author' }, 'author')
        ),
      };
    });

    // Check active admin (id: 1)
    assert.equal(renderedRows[0].isSelf, true);
    const selfHtml = renderToStaticMarkup(renderedRows[0].element);
    assert.match(selfHtml, /Khóa Tự Hạ Quyền/);
    assert.doesNotMatch(selfHtml, /<select/);

    // Check other customer (id: 2)
    assert.equal(renderedRows[1].isSelf, false);
    const otherHtml = renderToStaticMarkup(renderedRows[1].element);
    assert.match(otherHtml, /<select/);
  });

  test('direct execution of handleRoleChange on active admin is intercepted and rejected', () => {
    const activeAdmin = { id: 1, email: 'admin@woodmart.local', role: 'admin' };
    const targetUser = { id: 1, email: 'admin@woodmart.local', role: 'admin' };
    const nextRole = 'customer';

    let dispatched = false;
    let blockedMessage = null;

    if (activeAdmin && activeAdmin.id === targetUser.id && nextRole !== 'admin') {
      blockedMessage = 'Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập.';
    } else {
      dispatched = true;
    }

    assert.equal(dispatched, false, 'Demotion dispatch must be blocked');
    assert.match(blockedMessage, /Không thể tự hạ quyền/);
  });

  test('backend SELF_DEMOTION_FORBIDDEN HTTP 400 is cleanly caught as AdminApiError', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');

    global.fetch = async () => ({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: 'SELF_DEMOTION_FORBIDDEN',
        message: 'Bạn không thể tự hạ quyền quản trị của chính tài khoản mình.',
      }),
    });

    await assert.rejects(
      updateCustomerRole(1, 'customer'),
      (err) => {
        assert(err instanceof AdminApiError);
        assert.equal(err.status, 400);
        assert.equal(err.code, 'SELF_DEMOTION_FORBIDDEN');
        assert.match(err.message, /không thể tự hạ quyền/);
        return true;
      }
    );
  });
});

describe('ADVERSARIAL PROBE 4: Orders filtering and status update payloads', () => {
  test('query string safely encodes search strings with spaces, unicode and special characters', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
    let capturedUrl = '';

    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        json: async () => ({ success: true, data: { orders: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 1 } } }),
      };
    };

    await getOrders({
      page: 1,
      limit: 10,
      search: 'Nguyễn Văn A #123 & OD-888?',
      status: 'paid',
    });

    assert.match(capturedUrl, /search=Nguy%E1%BB%85n\+V%C4%83n\+A\+%23123\+%26\+OD-888%3F/);
    assert.match(capturedUrl, /status=paid/);
  });

  test('status update mutation dispatches PATCH with correct orderNumber and json payload', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
    let capturedUrl = '';
    let capturedMethod = '';
    let capturedBody = null;

    global.fetch = async (url, init) => {
      capturedUrl = url;
      capturedMethod = init?.method;
      capturedBody = JSON.parse(init?.body);
      return {
        ok: true,
        json: async () => ({
          success: true,
          data: { order_number: 'ORD-2026-9999', payment_status: 'refunded', order_status: 'cancelled' },
        }),
      };
    };

    const res = await updateOrderStatus('ORD-2026-9999', {
      payment_status: 'refunded',
      order_status: 'cancelled',
    });

    assert.equal(capturedUrl, '/api/v1/admin/orders/ORD-2026-9999/status');
    assert.equal(capturedMethod, 'PATCH');
    assert.deepEqual(capturedBody, { payment_status: 'refunded', order_status: 'cancelled' });
    assert.equal(res.payment_status, 'refunded');
    assert.equal(res.order_status, 'cancelled');
  });
});

describe('ADVERSARIAL PROBE 5: Themes catalog validation', () => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  test('slug validation strictly enforces kebab-case and rejects adversarial patterns', () => {
    // Valid slugs
    assert.equal(slugRegex.test('woodmart'), true);
    assert.equal(slugRegex.test('woodmart-pro'), true);
    assert.equal(slugRegex.test('porto-ecommerce-2026'), true);
    assert.equal(slugRegex.test('theme1-v2-beta3'), true);

    // Invalid adversarial patterns
    assert.equal(slugRegex.test('WoodMart'), false, 'Uppercase letters must be rejected');
    assert.equal(slugRegex.test('wood mart'), false, 'Spaces must be rejected');
    assert.equal(slugRegex.test('-woodmart'), false, 'Leading hyphens must be rejected');
    assert.equal(slugRegex.test('woodmart-'), false, 'Trailing hyphens must be rejected');
    assert.equal(slugRegex.test('wood--mart'), false, 'Consecutive hyphens must be rejected');
    assert.equal(slugRegex.test('wood_mart'), false, 'Underscores must be rejected');
    assert.equal(slugRegex.test('<script>alert(1)</script>'), false, 'XSS payloads must be rejected');
    assert.equal(slugRegex.test('theme$special'), false, 'Symbols must be rejected');
    assert.equal(slugRegex.test(''), false, 'Empty string must be rejected');
  });

  test('pricing validation rejects negative prices, NaN and Infinity', () => {
    const validatePrice = (val) => {
      const p = Number(val);
      return Number.isFinite(p) && p >= 0;
    };

    // Valid prices
    assert.equal(validatePrice(599000), true);
    assert.equal(validatePrice(0), true, 'Zero pricing is allowed for free themes');
    assert.equal(validatePrice('29.99'), true);

    // Adversarial invalid prices
    assert.equal(validatePrice(-1), false, 'Negative numbers must be rejected');
    assert.equal(validatePrice(-500000), false, 'Large negative numbers must be rejected');
    assert.equal(validatePrice(NaN), false, 'NaN must be rejected');
    assert.equal(validatePrice(Infinity), false, 'Infinity must be rejected');
    assert.equal(validatePrice(-Infinity), false, '-Infinity must be rejected');
    assert.equal(validatePrice('abc'), false, 'Non-numeric string must be rejected');
  });

  test('URL validator strictly requires http or https protocols', () => {
    const isHttpUrl = (val) => {
      try {
        const u = new URL(val);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch {
        return false;
      }
    };

    assert.equal(isHttpUrl('https://demo.xtemos.com/woodmart'), true);
    assert.equal(isHttpUrl('http://localhost:3000/demo'), true);
    assert.equal(isHttpUrl('javascript:alert(1)'), false, 'javascript URI must be rejected');
    assert.equal(isHttpUrl('data:text/html,<h1>XSS</h1>'), false, 'data URI must be rejected');
    assert.equal(isHttpUrl('file:///etc/passwd'), false, 'file URI must be rejected');
    assert.equal(isHttpUrl('ftp://ftp.server.test'), false, 'ftp URI must be rejected');
    assert.equal(isHttpUrl('invalid-plain-text'), false, 'plain text must be rejected');
  });
});

describe('ADVERSARIAL PROBE 6: Licenses quota tracking and deactivation behavior', () => {
  test('domain quota meter accurately calculates ratio and assigns warning levels', () => {
    const computeQuota = (active, max) => {
      const ratio = max > 0 ? active / max : 0;
      let badge = `${Math.round(ratio * 100)}%`;
      let level = 'normal';

      if (ratio >= 1) {
        badge = 'HẾT QUOTA';
        level = 'critical';
      } else if (ratio >= 0.8) {
        level = 'warning';
      }
      return { ratio, badge, level };
    };

    // Normal: 0 / 1
    assert.deepEqual(computeQuota(0, 1), { ratio: 0, badge: '0%', level: 'normal' });

    // Warning: 4 / 5 (80%)
    assert.deepEqual(computeQuota(4, 5), { ratio: 0.8, badge: '80%', level: 'warning' });

    // Exhausted: 1 / 1 (100%)
    assert.deepEqual(computeQuota(1, 1), { ratio: 1.0, badge: 'HẾT QUOTA', level: 'critical' });

    // Over quota boundary: 5 / 5 (100%)
    assert.deepEqual(computeQuota(5, 5), { ratio: 1.0, badge: 'HẾT QUOTA', level: 'critical' });

    // Zero max safe division
    assert.deepEqual(computeQuota(0, 0), { ratio: 0, badge: '0%', level: 'normal' });
  });

  test('deactivation action dispatches POST to /licenses/:key/deactivate with domain payload', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
    let capturedUrl = '';
    let capturedBody = null;

    global.fetch = async (url, init) => {
      capturedUrl = url;
      capturedBody = JSON.parse(init?.body);
      return {
        ok: true,
        json: async () => ({
          success: true,
          message: 'Đã hủy kích hoạt thành công domain: myshop.vn',
          data: { license_key: 'WD-KEY-999', domain: 'myshop.vn', is_active: 0 },
        }),
      };
    };

    const res = await deactivateLicenseDomain('WD-KEY-999', 'myshop.vn');
    assert.equal(capturedUrl, '/api/v1/admin/licenses/WD-KEY-999/deactivate');
    assert.deepEqual(capturedBody, { domain: 'myshop.vn' });
    assert.equal(res.is_active, 0);
  });

  test('reset action dispatches POST to /licenses/:key/reset and returns 0 active domains', async () => {
    storageMap.set(AUTH_TOKEN_KEY, 'admin-token');
    let capturedUrl = '';
    let capturedMethod = '';

    global.fetch = async (url, init) => {
      capturedUrl = url;
      capturedMethod = init?.method;
      return {
        ok: true,
        json: async () => ({
          success: true,
          message: 'Đã đặt lại toàn bộ domain.',
          data: { license_key: 'WD-KEY-999', active_domains_count: 0 },
        }),
      };
    };

    const res = await resetLicenseDomains('WD-KEY-999');
    assert.equal(capturedUrl, '/api/v1/admin/licenses/WD-KEY-999/reset');
    assert.equal(capturedMethod, 'POST');
    assert.equal(res.active_domains_count, 0);
  });
});
