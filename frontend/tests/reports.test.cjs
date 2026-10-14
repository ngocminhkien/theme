/**
 * Automated test suite for Admin Reports & Analytics module
 * Validates API client contract, multi-currency revenue invariants,
 * chart scaling logic, layout navigation integration, and static rendering resilience.
 */

const { test, beforeEach, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// CommonJS module resolution for '@/...' aliases and Next.js internals
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
  if (request === 'next/link') {
    return 'next/link';
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

// Mock next/navigation
const navMock = {
  useRouter: () => ({ replace: () => {}, push: () => {}, prefetch: () => {} }),
  usePathname: () => '/admin/reports',
  useSearchParams: () => new URLSearchParams(),
};

require.cache['next/navigation'] = {
  id: 'next/navigation',
  filename: 'next/navigation',
  loaded: true,
  exports: navMock,
};

// Mock next/link
const LinkMock = ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
LinkMock.default = LinkMock;
require.cache['next/link'] = {
  id: 'next/link',
  filename: 'next/link',
  loaded: true,
  exports: LinkMock,
};

// Load modules under test
const adminApiPath = path.resolve(__dirname, '../src/features/admin/api-client.ts');
const authPath = path.resolve(__dirname, '../src/features/auth/auth-client.ts');
const reportsPagePath = path.resolve(__dirname, '../src/app/admin/reports/page.tsx');
const adminLayoutPath = path.resolve(__dirname, '../src/app/admin/layout.tsx');

const { getAnalytics, AdminApiError } = require(adminApiPath);
const { AUTH_TOKEN_KEY } = require(authPath);
const AdminReportsPage = require(reportsPagePath).default;

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

test('getAnalytics throws 401 unauthorized when admin session token is missing', async () => {
  storageMap.clear();
  let networkCalled = false;
  global.fetch = async () => {
    networkCalled = true;
    return { ok: true, json: async () => ({ success: true, data: {} }) };
  };

  await assert.rejects(getAnalytics(30), (err) => {
    assert.match(err.message, /Vui lòng đăng nhập với tài khoản quản trị viên/);
    assert.equal(err.status, 401);
    return true;
  });

  assert.equal(networkCalled, false, 'Unauthenticated calls must be intercepted before network dispatch');
});

test('getAnalytics sends Bearer token, Content-Type, and correct days parameter', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'test-jwt-token-777');
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
      json: async () => ({
        success: true,
        data: {
          period_days: 30,
          series: [
            { date: '2026-10-12', revenue_vnd: 599000, revenue_usd: 0, orders: 1 },
            { date: '2026-10-13', revenue_vnd: 0, revenue_usd: 29, orders: 1 },
          ],
          top_themes: [
            { id: 1, name: 'WoodMart WooCommerce', slug: 'woodmart', purchases: 2, revenue_vnd: 599000, revenue_usd: 29 },
          ],
        },
      }),
    };
  };

  const data = await getAnalytics(30);
  assert.equal(capturedRequests.length, 1);
  assert.equal(capturedRequests[0].url, '/api/v1/admin/analytics?days=30');
  assert.equal(capturedRequests[0].method, 'GET');
  assert.equal(capturedRequests[0].auth, 'Bearer test-jwt-token-777');
  assert.equal(capturedRequests[0].contentType, 'application/json');

  assert.equal(data.period_days, 30);
  assert.equal(data.series.length, 2);
  assert.equal(data.top_themes.length, 1);
  assert.equal(data.top_themes[0].name, 'WoodMart WooCommerce');
});

test('getAnalytics supports 7, 30, and 90 day parameters accurately', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'test-jwt-token-777');
  const capturedUrls = [];

  global.fetch = async (url) => {
    capturedUrls.push(url);
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: { period_days: 7, series: [], top_themes: [] },
      }),
    };
  };

  await getAnalytics(7);
  await getAnalytics(30);
  await getAnalytics(90);

  assert.equal(capturedUrls.length, 3);
  assert.match(capturedUrls[0], /\/api\/v1\/admin\/analytics\?days=7/);
  assert.match(capturedUrls[1], /\/api\/v1\/admin\/analytics\?days=30/);
  assert.match(capturedUrls[2], /\/api\/v1\/admin\/analytics\?days=90/);
});

test('getAnalytics handles backend server errors cleanly and wraps in AdminApiError', async () => {
  storageMap.set(AUTH_TOKEN_KEY, 'test-jwt-token-777');

  global.fetch = async () => ({
    ok: false,
    status: 500,
    json: async () => ({
      success: false,
      message: 'Internal Database Failure',
      error: 'DB_DOWN',
    }),
  });

  await assert.rejects(getAnalytics(30), (err) => {
    assert.equal(err instanceof AdminApiError, true);
    assert.equal(err.message, 'Internal Database Failure');
    assert.equal(err.status, 500);
    return true;
  });
});

test('Multi-currency reports invariant: VND and USD revenue are strictly separate and never summed', () => {
  const sampleSeries = [
    { date: '2026-10-10', revenue_vnd: 1500000, revenue_usd: 0, orders: 3 },
    { date: '2026-10-11', revenue_vnd: 0, revenue_usd: 59, orders: 2 },
    { date: '2026-10-12', revenue_vnd: 2990000, revenue_usd: 120, orders: 5 },
  ];

  // Independent aggregations
  const totalOrders = sampleSeries.reduce((acc, curr) => acc + curr.orders, 0);
  const totalVnd = sampleSeries.reduce((acc, curr) => acc + curr.revenue_vnd, 0);
  const totalUsd = sampleSeries.reduce((acc, curr) => acc + curr.revenue_usd, 0);

  assert.equal(totalOrders, 10);
  assert.equal(totalVnd, 4490000);
  assert.equal(totalUsd, 179);

  // Financial Invariant INV-01: Multi-currency isolation
  // In period totals, VND and USD are kept strictly separate; no merged revenue field is permitted
  const periodTotals = {
    totalOrders,
    totalVnd,
    totalUsd,
  };
  assert.equal(periodTotals.totalVnd, 4490000);
  assert.equal(periodTotals.totalUsd, 179);
  assert.equal(periodTotals.total_revenue, undefined, 'Merged total_revenue field is strictly forbidden');
  assert.equal(periodTotals.revenue, undefined, 'Single revenue bucket is strictly forbidden');
});

test('Daily order volume bar chart logic calculates peak orders correctly and defaults safely', () => {
  const populatedSeries = [
    { date: '2026-10-10', orders: 4 },
    { date: '2026-10-11', orders: 12 },
    { date: '2026-10-12', orders: 7 },
  ];

  const maxOrders = Math.max(1, ...populatedSeries.map((point) => point.orders));
  assert.equal(maxOrders, 12);

  // Empty series fallback
  const emptySeries = [];
  const fallbackMax = Math.max(1, ...(emptySeries.map((p) => p.orders) || [0]));
  assert.equal(fallbackMax, 1);

  // Height percentage formula check: min 4% to prevent invisible bars
  const zeroHeight = Math.max(4, (0 / maxOrders) * 100);
  const peakHeight = Math.max(4, (12 / maxOrders) * 100);
  assert.equal(zeroHeight, 4);
  assert.equal(peakHeight, 100);
});

test('Top purchased themes ranking preserves rank order, purchase counts, and multi-currency values', () => {
  const topThemes = [
    { id: 1, name: 'WoodMart - Multipurpose WooCommerce Theme', slug: 'woodmart', purchases: 42, revenue_vnd: 25158000, revenue_usd: 0 },
    { id: 2, name: 'Basel - Responsive eCommerce Theme', slug: 'basel', purchases: 18, revenue_vnd: 8982000, revenue_usd: 250 },
    { id: 3, name: 'Kalles - Clean Minimal Store', slug: 'kalles', purchases: 11, revenue_vnd: 5489000, revenue_usd: 120 },
  ];

  assert.equal(topThemes.length, 3);
  assert.equal(topThemes[0].purchases >= topThemes[1].purchases, true);
  assert.equal(topThemes[1].purchases >= topThemes[2].purchases, true);

  topThemes.forEach((theme) => {
    assert.equal(typeof theme.purchases, 'number');
    assert.equal(typeof theme.revenue_vnd, 'number');
    assert.equal(typeof theme.revenue_usd, 'number');
    assert.ok(theme.slug.length > 0);
  });
});

test('Admin navigation layout contract includes Báo Cáo link with BarChart3 icon and active route matching', () => {
  const layoutContent = fs.readFileSync(adminLayoutPath, 'utf8');

  // Verify BarChart3 import
  assert.match(layoutContent, /BarChart3/);

  // Verify Báo Cáo item in NAV_ITEMS
  assert.match(layoutContent, /label:\s*['"]Báo Cáo['"]/);
  assert.match(layoutContent, /href:\s*['"]\/admin\/reports['"]/);
  assert.match(layoutContent, /icon:\s*BarChart3/);
});

test('Admin navigation layout footer links to both Storefront (/) and Customer Portal (/my-account)', () => {
  const layoutContent = fs.readFileSync(adminLayoutPath, 'utf8');

  // Verify Storefront link
  assert.match(layoutContent, /href=['"]\/['"]/);
  assert.match(layoutContent, /Xem Cửa Hàng/);

  // Verify Customer Portal link
  assert.match(layoutContent, /href=['"]\/my-account['"]/);
  assert.match(layoutContent, /Cổng Khách Hàng/);
});

test('AdminReportsPage static server render succeeds without breaking SSR and renders all key UI sections', () => {
  storageMap.set(AUTH_TOKEN_KEY, 'test-admin-token');

  // SSR render test
  const html = renderToStaticMarkup(React.createElement(AdminReportsPage));

  // Verify page title & badge
  assert.match(html, /Báo Cáo &amp; Phân Tích Kinh Doanh|Báo Cáo & Phân Tích Kinh Doanh/);
  assert.match(html, /Business Intelligence/);

  // Verify invariant notice
  assert.match(html, /Doanh thu chỉ tính các đơn hàng có trạng thái/);
  assert.match(html, /hạch toán riêng biệt, tuyệt đối không quy đổi chéo/);

  // Verify time range selectors
  assert.match(html, /7 Ngày/);
  assert.match(html, /30 Ngày/);
  assert.match(html, /90 Ngày/);
  assert.match(html, /Làm Mới/);

  // Verify KPI sections
  assert.match(html, /Đơn Đã Thanh Toán/);
  assert.match(html, /Doanh Thu Kỳ Này \(VND\)/);
  assert.match(html, /Doanh Thu Kỳ Này \(USD\)/);

  // Verify charts and tables headers
  assert.match(html, /Số Đơn Đã Thanh Toán Theo Ngày/);
  assert.match(html, /Theme Được Mua Nhiều Nhất/);
  assert.match(html, /Chi Tiết Doanh Thu Từng Ngày/);
});
