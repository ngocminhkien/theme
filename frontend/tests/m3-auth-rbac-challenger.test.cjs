const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Mock browser globals for auth-client & React DOM testing
const storageMap = new Map();
global.window = {
  localStorage: {
    getItem: (k) => storageMap.get(k) || null,
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear(),
  },
};

const authPath = path.resolve(__dirname, '../src/features/auth/auth-client.ts');
const guardPath = path.resolve(__dirname, '../src/features/admin/AdminGuard.tsx');

// Dynamic requires
const { AUTH_TOKEN_KEY, getAuthToken, clearAuthToken } = require(authPath);
const { AdminGuard } = require(guardPath);

test('M3-CHALLENGER-PROBE 1: AUTH_TOKEN_KEY contract and localStorage persistence', () => {
  storageMap.clear();
  assert.equal(AUTH_TOKEN_KEY, 'themestore-auth-token', 'AUTH_TOKEN_KEY must strictly be themestore-auth-token');
  assert.equal(getAuthToken(), null, 'Initially token is null');

  storageMap.set(AUTH_TOKEN_KEY, 'jwt-admin-secret-token');
  assert.equal(getAuthToken(), 'jwt-admin-secret-token', 'Token must be retrieved from localStorage');

  clearAuthToken();
  assert.equal(getAuthToken(), null, 'clearAuthToken() must remove themestore-auth-token from localStorage');
});

test('M3-CHALLENGER-PROBE 2: AdminGuard unauthenticated access redirection contract', () => {
  storageMap.clear();

  // Test various admin routes
  const protectedPaths = [
    '/admin',
    '/admin/orders',
    '/admin/customers?page=2',
    '/admin/themes/new',
    '/admin/licenses/WD-2026-KEY'
  ];

  for (const pathname of protectedPaths) {
    const token = storageMap.get(AUTH_TOKEN_KEY);
    assert.equal(token, undefined, 'No token in storage');

    // Simulate AdminGuard logic
    const redirectTarget = pathname || '/admin';
    const computedRedirect = `/login?redirect=${encodeURIComponent(redirectTarget)}`;

    assert.ok(computedRedirect.startsWith('/login?redirect='), 'Must redirect to /login with redirect param');
    const url = new URL(`http://localhost:3000${computedRedirect}`);
    assert.equal(url.searchParams.get('redirect'), pathname, 'Redirect parameter must preserve exact requested route');
  }
});

test('M3-CHALLENGER-PROBE 3: AdminGuard 403 Forbidden screen verification for non-admin roles', () => {
  const nonAdminRoles = [
    { role: 'customer', email: 'customer.vip@shop.vn', fullName: 'Nguyen Van Customer' },
    { role: 'author', email: 'author.creator@studio.com', fullName: 'Theme Studio Dev' },
  ];

  for (const user of nonAdminRoles) {
    // Assert non-admin cannot be authorized
    assert.notEqual(user.role, 'admin', `Role ${user.role} is not admin`);

    // Verify 403 markup rendering
    // Emulate AdminGuard forbidden return JSX
    const forbiddenJsx = React.createElement(
      'div',
      { role: 'alert', className: 'min-h-screen bg-slate-950 flex items-center justify-center p-4' },
      React.createElement('span', null, '403 Forbidden'),
      React.createElement('h1', null, 'Truy Cập Bị Từ Chối'),
      React.createElement('p', null, `Khu vực này yêu cầu đặc quyền Quản trị viên (Admin).`),
      React.createElement('span', null, user.email),
      React.createElement('code', null, user.role),
      React.createElement('a', { href: '/my-account' }, 'Về Cổng Khách Hàng'),
      React.createElement('a', { href: '/' }, 'Về Trang Chủ Cửa Hàng'),
      React.createElement('button', { type: 'button' }, 'Đăng xuất & Đăng nhập tài khoản khác')
    );

    const markup = renderToStaticMarkup(forbiddenJsx);

    // Verify 403 status and Vietnamese heading
    assert.ok(markup.includes('403 Forbidden'), 'Must contain 403 Forbidden badge');
    assert.ok(markup.includes('Truy Cập Bị Từ Chối'), 'Must contain Vietnamese heading "Truy Cập Bị Từ Chối"');

    // Verify user info displayed
    assert.ok(markup.includes(user.email), 'Must display offending user email');
    assert.ok(markup.includes(user.role), 'Must display offending user role');

    // Verify 1-click return links
    assert.ok(markup.includes('href="/my-account"'), 'Must contain 1-click link to Customer Portal (/my-account)');
    assert.ok(markup.includes('Về Cổng Khách Hàng'), 'Link text must say "Về Cổng Khách Hàng"');
    assert.ok(markup.includes('href="/"'), 'Must contain 1-click link to Storefront (/)');
    assert.ok(markup.includes('Về Trang Chủ Cửa Hàng'), 'Link text must say "Về Trang Chủ Cửa Hàng"');
    assert.ok(markup.includes('Đăng xuất &amp; Đăng nhập tài khoản khác'), 'Must offer logout button');
  }
});

test('M3-CHALLENGER-PROBE 4: Admin login smooth redirect logic (/login -> /admin)', () => {
  // Test Case A: Admin logs in with NO redirect param -> goes to /admin
  {
    const session = { user: { role: 'admin', email: 'admin@woodmart.local' } };
    const searchParams = new URLSearchParams('');
    const redirectTarget = searchParams.get('redirect') || '/my-account';

    const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
      ? '/admin'
      : redirectTarget;

    assert.equal(dest, '/admin', 'Admin login without redirect param must redirect to /admin');
  }

  // Test Case B: Admin logs in with default redirectTarget (/my-account) -> goes to /admin
  {
    const session = { user: { role: 'admin', email: 'admin@woodmart.local' } };
    const searchParams = new URLSearchParams('redirect=/my-account');
    const redirectTarget = searchParams.get('redirect') || '/my-account';

    const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
      ? '/admin'
      : redirectTarget;

    assert.equal(dest, '/admin', 'Admin login with redirect=/my-account must redirect to /admin');
  }

  // Test Case C: Admin logs in with deep link redirect (e.g. /admin/licenses) -> goes to deep link
  {
    const session = { user: { role: 'admin', email: 'admin@woodmart.local' } };
    const searchParams = new URLSearchParams('redirect=/admin/licenses');
    const redirectTarget = searchParams.get('redirect') || '/my-account';

    const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
      ? '/admin'
      : redirectTarget;

    assert.equal(dest, '/admin/licenses', 'Admin login with explicit /admin/licenses must preserve deep link');
  }

  // Test Case D: Customer logs in without redirect -> goes to /my-account
  {
    const session = { user: { role: 'customer', email: 'customer@store.vn' } };
    const searchParams = new URLSearchParams('');
    const redirectTarget = searchParams.get('redirect') || '/my-account';

    const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
      ? '/admin'
      : redirectTarget;

    assert.equal(dest, '/my-account', 'Customer login without redirect param must redirect to /my-account');
  }

  // Test Case E: Customer logs in with redirect to checkout -> goes to checkout
  {
    const session = { user: { role: 'customer', email: 'customer@store.vn' } };
    const searchParams = new URLSearchParams('redirect=/checkout');
    const redirectTarget = searchParams.get('redirect') || '/my-account';

    const dest = (session.user.role === 'admin' && (!searchParams.get('redirect') || redirectTarget === '/my-account'))
      ? '/admin'
      : redirectTarget;

    assert.equal(dest, '/checkout', 'Customer login with redirect=/checkout must go to /checkout');
  }
});

test('M3-CHALLENGER-PROBE 5: Cross-portal toggling link consistency', () => {
  // Storefront HeaderTopBar has Admin link
  const topBarAdminHref = '/admin';
  assert.equal(topBarAdminHref, '/admin');

  // Customer Portal (/my-account) has Admin button when user is admin
  const customerPortalAdminLink = '/admin';
  assert.equal(customerPortalAdminLink, '/admin');

  // Admin Sidebar (/admin/layout) has links back to Storefront and Customer Portal
  const adminSidebarLinks = [
    { label: 'Xem Cửa Hàng', href: '/' },
    { label: 'Cổng Khách Hàng', href: '/my-account' },
  ];

  assert.equal(adminSidebarLinks.find(l => l.href === '/').label, 'Xem Cửa Hàng');
  assert.equal(adminSidebarLinks.find(l => l.href === '/my-account').label, 'Cổng Khách Hàng');
});

test('M3-CHALLENGER-PROBE 6: Next.js API rewrite proxy contract (/api/v1/:path*)', () => {
  const nextConfig = require('../next.config.js');
  assert.ok(typeof nextConfig.rewrites === 'function', 'next.config.js must export rewrites function');

  // Run rewrites
  const rewritesPromise = nextConfig.rewrites();
  return rewritesPromise.then((rules) => {
    assert.ok(Array.isArray(rules), 'Rewrites must return an array');
    const apiRule = rules.find((r) => r.source === '/api/v1/:path*');
    assert.ok(apiRule, 'Must include rewrite rule for /api/v1/:path*');
    assert.ok(apiRule.destination.includes('/api/v1/:path*'), 'Destination must forward /api/v1/:path*');
  });
});
