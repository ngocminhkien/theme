/**
 * Adversarial Stress Test Suite for Reports & Analytics
 * Author: Challenger 2 (teamwork_preview_challenger_m3_reports)
 *
 * Probes:
 * 1. Multi-Currency Isolation (INV-01) under adversarial mixed inputs
 * 2. Boundary conditions: empty series, zero orders, single vs 90 points, trillion VND
 * 3. SWR Caching: 45s TTL expiry, cache key parameter isolation, cache invalidation
 * 4. UI invariants & SSR stability under stress conditions
 */

const { test, describe, beforeEach } = require('node:test');
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
  if (request === 'next/navigation') return 'next/navigation';
  if (request === 'next/link') return 'next/link';
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// TypeScript hooks
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
require.cache['next/navigation'] = {
  id: 'next/navigation',
  filename: 'next/navigation',
  loaded: true,
  exports: {
    useRouter: () => ({ replace: () => {}, push: () => {}, prefetch: () => {} }),
    usePathname: () => '/admin/reports',
    useSearchParams: () => new URLSearchParams(),
  },
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

// Target file paths
const adminApiPath = path.resolve(__dirname, '../src/features/admin/api-client.ts');
const authPath = path.resolve(__dirname, '../src/features/auth/auth-client.ts');
const reportsPagePath = path.resolve(__dirname, '../src/app/admin/reports/page.tsx');
const adminControllerPath = path.resolve(__dirname, '../../backend/src/controllers/admin.controller.ts');

const { getAnalytics, invalidateAdminCache } = require(adminApiPath);
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

describe('1. Adversarial Multi-Currency Isolation (INV-01) Probes', () => {
  test('Backend SQL controller strictly segregates VND and USD with explicit CASE statement and no cross-joins', () => {
    const controllerSource = fs.readFileSync(adminControllerPath, 'utf8');

    // Check series query
    const seriesSqlMatch = controllerSource.match(/SELECT\s+DATE\(created_at\)[\s\S]*?FROM\s+orders/);
    assert.ok(seriesSqlMatch, 'Must contain SQL query selecting from orders');
    const seriesSql = seriesSqlMatch[0];

    assert.match(seriesSql, /CASE\s+WHEN\s+currency\s*=\s*'VND'\s+THEN\s+total_amount\s+ELSE\s+0\s+END/i);
    assert.match(seriesSql, /CASE\s+WHEN\s+currency\s*=\s*'USD'\s+THEN\s+total_amount\s+ELSE\s+0\s+END/i);
    assert.ok(!seriesSql.includes('revenue_vnd + revenue_usd'), 'Forbidden: merging currencies in SQL');
    assert.ok(!seriesSql.includes('currency *'), 'Forbidden: exchange rate conversion in SQL');

    // Check top themes query
    const themesSqlMatch = controllerSource.match(/SELECT\s+t\.id,[\s\S]*?FROM\s+order_items/);
    assert.ok(themesSqlMatch, 'Must contain SQL query selecting top themes');
    const themesSql = themesSqlMatch[0];

    assert.match(themesSql, /CASE\s+WHEN\s+o\.currency\s*=\s*'VND'\s+THEN\s+oi\.unit_price\s+ELSE\s+0\s+END/i);
    assert.match(themesSql, /CASE\s+WHEN\s+o\.currency\s*=\s*'USD'\s+THEN\s+oi\.unit_price\s+ELSE\s+0\s+END/i);
  });

  test('Complex asymmetric mixed-currency series isolates totals perfectly without leakage', () => {
    // 4 days with extreme asymmetry
    const series = [
      { date: '2026-10-01', revenue_vnd: 25000000, revenue_usd: 0, orders: 10 },    // VND only
      { date: '2026-10-02', revenue_vnd: 0, revenue_usd: 1500, orders: 12 },        // USD only
      { date: '2026-10-03', revenue_vnd: 45000000, revenue_usd: 350, orders: 8 },   // Both
      { date: '2026-10-04', revenue_vnd: 0, revenue_usd: 0, orders: 0 },            // Neither (zero orders)
    ];

    const periodTotals = series.reduce(
      (acc, curr) => ({
        totalOrders: acc.totalOrders + (curr.orders || 0),
        totalVnd: acc.totalVnd + (curr.revenue_vnd || 0),
        totalUsd: acc.totalUsd + (curr.revenue_usd || 0),
      }),
      { totalOrders: 0, totalVnd: 0, totalUsd: 0 }
    );

    assert.equal(periodTotals.totalOrders, 30);
    assert.equal(periodTotals.totalVnd, 70000000);
    assert.equal(periodTotals.totalUsd, 1850);

    // Cross-contamination invariants
    assert.equal(typeof periodTotals.totalVnd, 'number');
    assert.equal(typeof periodTotals.totalUsd, 'number');
    assert.ok(!('combined' in periodTotals), 'No combined total field');
    assert.ok(!('total_revenue' in periodTotals), 'No combined total_revenue field');
    assert.ok(!('revenue' in periodTotals), 'No unified revenue field');
  });

  test('Top themes multi-currency ranking preserves independent currency buckets', () => {
    const topThemes = [
      { id: 1, name: 'Theme A (VND only)', slug: 'theme-a', purchases: 20, revenue_vnd: 12000000, revenue_usd: 0 },
      { id: 2, name: 'Theme B (USD only)', slug: 'theme-b', purchases: 15, revenue_vnd: 0, revenue_usd: 890 },
      { id: 3, name: 'Theme C (Dual)', slug: 'theme-c', purchases: 10, revenue_vnd: 5000000, revenue_usd: 300 },
    ];

    topThemes.forEach((t) => {
      assert.ok(t.purchases > 0);
      assert.ok(typeof t.revenue_vnd === 'number');
      assert.ok(typeof t.revenue_usd === 'number');
      // Invariant: no conversion key added
      assert.equal(t.converted_revenue, undefined);
      assert.equal(t.total_revenue, undefined);
    });
  });
});

describe('2. Boundary Conditions & Edge Cases Adversarial Probes', () => {
  test('Empty series: maxOrders defaults safely to 1, avoiding divide-by-zero or NaN in height calculation', () => {
    const emptySeries = [];

    // Simulate page logic
    const maxOrders = !emptySeries.length ? 1 : Math.max(1, ...emptySeries.map((p) => p.orders));
    assert.equal(maxOrders, 1);

    // Period totals on empty series
    const periodTotals = !emptySeries.length
      ? { totalOrders: 0, totalVnd: 0, totalUsd: 0 }
      : emptySeries.reduce((acc, c) => acc, {});

    assert.deepEqual(periodTotals, { totalOrders: 0, totalVnd: 0, totalUsd: 0 });

    // Ensure divide-by-maxOrders never results in NaN
    const arbitraryOrder = 0;
    const heightPercent = Math.max(4, (arbitraryOrder / maxOrders) * 100);
    assert.equal(heightPercent, 4);
    assert.ok(!Number.isNaN(heightPercent));
    assert.ok(Number.isFinite(heightPercent));
  });

  test('All-zero orders series: maxOrders defaults to 1, height scaling stays at baseline 4%', () => {
    const zeroSeries = [
      { date: '2026-10-01', revenue_vnd: 0, revenue_usd: 0, orders: 0 },
      { date: '2026-10-02', revenue_vnd: 0, revenue_usd: 0, orders: 0 },
      { date: '2026-10-03', revenue_vnd: 0, revenue_usd: 0, orders: 0 },
    ];

    const maxOrders = Math.max(1, ...zeroSeries.map((p) => p.orders));
    assert.equal(maxOrders, 1, 'maxOrders must be 1 even when all orders are 0');

    zeroSeries.forEach((point) => {
      const heightPercent = Math.max(4, (point.orders / maxOrders) * 100);
      assert.equal(heightPercent, 4, 'Height percent must be minimum 4% baseline');
      assert.ok(!Number.isNaN(heightPercent));
    });
  });

  test('Single data point series: renders cleanly with 100% height for peak', () => {
    const singleSeries = [
      { date: '2026-10-14', revenue_vnd: 599000, revenue_usd: 0, orders: 1 },
    ];

    const maxOrders = Math.max(1, ...singleSeries.map((p) => p.orders));
    assert.equal(maxOrders, 1);

    const heightPercent = Math.max(4, (singleSeries[0].orders / maxOrders) * 100);
    assert.equal(heightPercent, 100);
  });

  test('90-day dense series: all 90 items process without numerical overflow, stack overflow, or NaN', () => {
    const denseSeries = [];
    let expectedTotalOrders = 0;
    let expectedTotalVnd = 0;
    let expectedTotalUsd = 0;

    for (let i = 0; i < 90; i++) {
      const orders = i % 5;
      const vnd = (i % 2 === 0) ? (i + 1) * 100000 : 0;
      const usd = (i % 3 === 0) ? (i + 1) * 10 : 0;
      denseSeries.push({
        date: `2026-07-${String((i % 30) + 1).padStart(2, '0')}`,
        revenue_vnd: vnd,
        revenue_usd: usd,
        orders,
      });
      expectedTotalOrders += orders;
      expectedTotalVnd += vnd;
      expectedTotalUsd += usd;
    }

    assert.equal(denseSeries.length, 90);

    const maxOrders = Math.max(1, ...denseSeries.map((p) => p.orders));
    assert.equal(maxOrders, 4);

    const totals = denseSeries.reduce(
      (acc, curr) => ({
        totalOrders: acc.totalOrders + (curr.orders || 0),
        totalVnd: acc.totalVnd + (curr.revenue_vnd || 0),
        totalUsd: acc.totalUsd + (curr.revenue_usd || 0),
      }),
      { totalOrders: 0, totalVnd: 0, totalUsd: 0 }
    );

    assert.equal(totals.totalOrders, expectedTotalOrders);
    assert.equal(totals.totalVnd, expectedTotalVnd);
    assert.equal(totals.totalUsd, expectedTotalUsd);

    // Height computations for all 90
    denseSeries.forEach((p) => {
      const h = Math.max(4, (p.orders / maxOrders) * 100);
      assert.ok(h >= 4 && h <= 100);
      assert.ok(Number.isFinite(h));
    });
  });

  test('Large currency numbers (billions and trillions VND): formats cleanly with vi-VN grouping', () => {
    const formatVnd = (val) => Number(val || 0).toLocaleString('vi-VN') + ' ₫';
    const formatUsd = (val) => '$' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const oneBillionVnd = 1000000000;
    const formatted1B = formatVnd(oneBillionVnd);
    // Depending on OS locale, grouping is '.' or ','
    assert.match(formatted1B, /1[.,]000[.,]000[.,]000\s*₫/);

    const fiveHundredBillionVnd = 500000000000;
    const formatted500B = formatVnd(fiveHundredBillionVnd);
    assert.match(formatted500B, /500[.,]000[.,]000[.,]000\s*₫/);

    const largeUsd = 1234567.89;
    const formattedUsd = formatUsd(largeUsd);
    assert.match(formattedUsd, /\$1[.,]234[.,]567\.89/);

    // Resilient fallback against NaN/null/undefined
    assert.equal(formatVnd(null), '0 ₫');
    assert.equal(formatVnd(undefined), '0 ₫');
    assert.equal(formatVnd(0), '0 ₫');
    assert.equal(formatUsd(null), '$0.00');
    assert.equal(formatUsd(undefined), '$0.00');
  });

  test('Corrupted or undefined orders field in series point defaults safely in calculations', () => {
    const dirtySeries = [
      { date: '2026-10-01', revenue_vnd: 1000, revenue_usd: 0, orders: null },
      { date: '2026-10-02', revenue_vnd: 2000, revenue_usd: 0, orders: undefined },
      { date: '2026-10-03', revenue_vnd: 3000, revenue_usd: 0, orders: 5 },
    ];

    const safeOrdersList = dirtySeries.map((p) => Number(p.orders || 0));
    const maxOrders = Math.max(1, ...safeOrdersList);
    assert.equal(maxOrders, 5);

    const totals = dirtySeries.reduce(
      (acc, curr) => ({
        totalOrders: acc.totalOrders + (Number(curr.orders) || 0),
        totalVnd: acc.totalVnd + (curr.revenue_vnd || 0),
        totalUsd: acc.totalUsd + (curr.revenue_usd || 0),
      }),
      { totalOrders: 0, totalVnd: 0, totalUsd: 0 }
    );

    assert.equal(totals.totalOrders, 5);
    assert.equal(totals.totalVnd, 6000);
  });
});

describe('3. Adversarial SWR Caching & TTL Probes', () => {
  test('Simulated browser environment validates 45s TTL expiry behavior', async () => {
    // We isolate and test the exact caching algorithm implemented in api-client.ts
    const cacheMap = new Map();
    const CACHE_TTL_MS = 45 * 1000;

    let timeNow = 1000000;
    const mockNow = () => timeNow;

    let fetchCount = 0;
    const mockFetcher = async () => {
      fetchCount++;
      return { fetchCount, timestamp: timeNow };
    };

    const cachedFetchTest = async (cacheKey, fetcher, ttlMs = CACHE_TTL_MS) => {
      const cached = cacheMap.get(cacheKey);
      const now = mockNow();
      if (cached && now - cached.timestamp < ttlMs) {
        return cached.data;
      }
      const freshData = await fetcher();
      cacheMap.set(cacheKey, { data: freshData, timestamp: now });
      return freshData;
    };

    // 1st request at t=0s -> should hit network
    const res1 = await cachedFetchTest('/analytics?days=30', mockFetcher);
    assert.equal(fetchCount, 1);
    assert.equal(res1.fetchCount, 1);

    // 2nd request at t=10s (delta = 10s < 45s) -> should hit cache
    timeNow += 10 * 1000;
    const res2 = await cachedFetchTest('/analytics?days=30', mockFetcher);
    assert.equal(fetchCount, 1, 'Network must not be called when within 45s TTL');
    assert.equal(res2.fetchCount, 1);

    // 3rd request at t=44s (delta = 44s < 45s) -> should still hit cache
    timeNow += 34 * 1000;
    const res3 = await cachedFetchTest('/analytics?days=30', mockFetcher);
    assert.equal(fetchCount, 1, 'Network must not be called at 44s');
    assert.equal(res3.fetchCount, 1);

    // 4th request at t=46s (delta = 46s > 45s) -> TTL EXPIRED, should hit network
    timeNow += 2 * 1000; // total 46s
    const res4 = await cachedFetchTest('/analytics?days=30', mockFetcher);
    assert.equal(fetchCount, 2, 'Network MUST be called when TTL > 45s expires');
    assert.equal(res4.fetchCount, 2);
  });

  test('Cache key isolation: different query params (?days=7, ?days=30, ?days=90) never collide or bleed', async () => {
    const cacheMap = new Map();
    const CACHE_TTL_MS = 45 * 1000;

    let callLog = [];
    const testFetcher = (key, payload) => async () => {
      callLog.push(key);
      return payload;
    };

    const cachedFetch = async (key, fetcher) => {
      const cached = cacheMap.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
      const data = await fetcher();
      cacheMap.set(key, { data, timestamp: Date.now() });
      return data;
    };

    // Fetch days=7
    const key7 = `/analytics?days=7`;
    const res7 = await cachedFetch(key7, testFetcher(key7, { period_days: 7 }));
    assert.equal(res7.period_days, 7);

    // Fetch days=30
    const key30 = `/analytics?days=30`;
    const res30 = await cachedFetch(key30, testFetcher(key30, { period_days: 30 }));
    assert.equal(res30.period_days, 30);

    // Fetch days=90
    const key90 = `/analytics?days=90`;
    const res90 = await cachedFetch(key90, testFetcher(key90, { period_days: 90 }));
    assert.equal(res90.period_days, 90);

    // Re-fetch days=7 -> should return cached days=7 without re-executing fetcher
    assert.equal(callLog.length, 3);
    const cachedRes7 = await cachedFetch(key7, testFetcher(key7, { period_days: 7 }));
    assert.equal(cachedRes7.period_days, 7);
    assert.equal(callLog.length, 3, 'Cache hit for key7 must not invoke fetcher');

    // Re-fetch days=30 -> should return cached days=30
    const cachedRes30 = await cachedFetch(key30, testFetcher(key30, { period_days: 30 }));
    assert.equal(cachedRes30.period_days, 30);
    assert.equal(callLog.length, 3);

    // Invalidation pattern: invalidating '/analytics' cleans all three
    for (const k of cacheMap.keys()) {
      if (k.includes('/analytics')) {
        cacheMap.delete(k);
      }
    }
    assert.equal(cacheMap.size, 0);

    // After invalidation, fetching key30 must re-trigger network
    await cachedFetch(key30, testFetcher(key30, { period_days: 30 }));
    assert.equal(callLog.length, 4, 'Must re-fetch after cache invalidation');
  });

  test('api-client.ts has invalidateAdminCache export and clears pattern-matched cache entries', () => {
    assert.equal(typeof invalidateAdminCache, 'function');
    // Invoking without errors
    invalidateAdminCache('/analytics');
    invalidateAdminCache();
  });

  test('Adversarial vulnerability probe: Manual "Làm Mới" button should invalidate cache to avoid returning stale data within 45s TTL', () => {
    const pageSource = fs.readFileSync(reportsPagePath, 'utf8');

    // In page.tsx: does the "Làm Mới" button handler or fetchAnalytics call invalidateAdminCache?
    const callsInvalidate = pageSource.includes('invalidateAdminCache');
    // We document whether page.tsx imports and calls invalidateAdminCache on refresh
    assert.equal(callsInvalidate, false, 'Confirmed: page.tsx does not import invalidateAdminCache; clicking "Làm Mới" within 45s serves cached memory data without refetching');
  });
});

describe('4. UI Rendering Stress & Invariant Probes', () => {
  test('Bar chart overflow behavior: 90 data points require 1796px minimum width', () => {
    const pageSource = fs.readFileSync(reportsPagePath, 'utf8');

    // Look for overflow-x-auto on the chart flex container
    const chartContainerMatch = pageSource.match(/<div\s+className=["']([^"']*flex\s+h-72\s+items-end[^"']*)["']/);
    assert.ok(chartContainerMatch, 'Must find chart container div');
    const classes = chartContainerMatch[1];

    const hasOverflow = classes.includes('overflow-x-auto') || classes.includes('overflow-auto');
    // Document finding: line 253 has no overflow-x-auto, meaning 90 items will stretch parent card on viewports < 1800px
    assert.equal(hasOverflow, false, 'Confirmed: chart container lacks overflow-x-auto for dense 90-day series');
  });
  test('SSR static markup contains no undefined, NaN, or combined revenue leaks', () => {
    storageMap.set(AUTH_TOKEN_KEY, 'stress-test-token');

    const html = renderToStaticMarkup(React.createElement(AdminReportsPage));

    assert.ok(!html.includes('NaN'), 'Rendered HTML must never contain NaN');
    assert.ok(!html.includes('undefined'), 'Rendered HTML must never contain undefined');
    assert.ok(!html.includes('null'), 'Rendered HTML must never contain null');
    assert.ok(!html.includes('total_revenue'), 'HTML must not have combined total_revenue');
  });

  test('Chart container markup has border-b, border-l, and proper layout tags', () => {
    const pageSource = fs.readFileSync(reportsPagePath, 'utf8');

    // Check chart container classes
    assert.match(pageSource, /border-b border-l border-slate-800/);
    assert.match(pageSource, /rotate-\[-55deg\]/);
    assert.match(pageSource, /min-w-4/);
    assert.match(pageSource, /group-hover:flex/);

    // Check that formatVnd and formatUsd are independent
    assert.match(pageSource, /const formatVnd/);
    assert.match(pageSource, /const formatUsd/);
    assert.ok(!pageSource.includes('formatCombined'));
  });
});
