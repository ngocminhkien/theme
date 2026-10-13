import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'adversarial-probe-jwt-secret-long-random-key-12345';
const secret = process.env.JWT_SECRET;

const { app } = await import('../dist/app.js');
const { dbPool } = await import('../dist/config/database.js');
const { UserModel } = await import('../dist/models/user.model.js');

const originalQuery = dbPool.query;
const originalFindByEmail = UserModel.findByEmail;
const originalFindById = UserModel.findById;
const originalUpdateRole = UserModel.updateRole;
const originalCreateUser = UserModel.create;

let offlineMode = false;

// Mock database router
dbPool.query = async (sql, params = []) => {
  if (offlineMode) {
    const offlineErr = new Error('connect ECONNREFUSED 127.0.0.1:3306');
    offlineErr.code = 'ECONNREFUSED';
    throw offlineErr;
  }

  // 1. Dashboard stats & analytics queries
  if (sql.includes('GROUP BY currency')) {
    return [[
      { currency: 'VND', total_revenue: '599000' },
      { currency: 'USD', total_revenue: '29.00' },
    ]];
  }
  if (sql.includes('paid_orders')) {
    return [[{ total_orders: 5, paid_orders: 3, pending_orders: 1, failed_orders: 1 }]];
  }
  if (sql.includes('SELECT COUNT(*) AS total FROM themes')) {
    return [[{ total: 10 }]];
  }
  if (sql.includes('SELECT COUNT(*) AS total_themes FROM themes')) {
    return [[{ total_themes: 10 }]];
  }
  if (sql.includes('SELECT COUNT(*) AS total_customers FROM users WHERE role = \'customer\'')) {
    return [[{ total_customers: 4 }]];
  }
  if (sql.includes('SELECT COUNT(*) AS active_licenses FROM licenses WHERE status = \'active\'')) {
    return [[{ active_licenses: 3 }]];
  }
  if (sql.includes('FROM orders') && sql.includes('LIMIT 5')) {
    return [[
      { id: 1, order_number: 'ORD-TEST-1', customer_name: 'Customer 1', customer_email: 'c1@test.com', total_amount: '599000', currency: 'VND', payment_method: 'vietqr', payment_status: 'paid', order_status: 'completed', created_at: new Date() },
    ]];
  }
  if (sql.includes('DATE(created_at) AS date')) {
    return [[
      { date: '2026-10-12', revenue_vnd: '599000', revenue_usd: '0', orders: 1 },
      { date: '2026-10-13', revenue_vnd: '0', revenue_usd: '29.00', orders: 1 },
    ]];
  }
  if (sql.includes('FROM order_items oi') && sql.includes('LIMIT 5')) {
    return [[
      { id: 1, name: 'WoodMart', slug: 'woodmart', purchases: 2, revenue_vnd: '1198000', revenue_usd: '0' },
    ]];
  }

  // 2. Orders queries
  if (sql.includes('SELECT COUNT(*) AS total FROM orders')) {
    return [[{ total: 1 }]];
  }
  if (sql.includes('SELECT id, order_number, user_id, customer_email')) {
    return [[
      { id: 1, order_number: 'ORD-TEST-123', user_id: 3, customer_email: 'customer@example.test', customer_name: 'Customer Test', customer_phone: '0901234567', total_amount: '599000', currency: 'VND', payment_method: 'vietqr', payment_status: 'paid', order_status: 'completed', created_at: new Date() },
    ]];
  }
  if (sql.includes('FROM orders WHERE order_number = ? LIMIT 1')) {
    const orderNumber = params[0];
    if (orderNumber === 'ORD-TEST-123') {
      return [[{ id: 1, order_number: 'ORD-TEST-123', payment_status: 'pending', order_status: 'processing', customer_name: 'Customer Test', total_amount: '599000', currency: 'VND' }]];
    }
    return [[]]; // not found
  }
  if (sql.includes('FROM order_items oi WHERE oi.order_id = ?')) {
    return [[{ id: 1, order_id: 1, theme_id: 1, theme_name: 'WoodMart', theme_slug: 'woodmart', license_type: 'regular', unit_price: '599000', subtotal: '599000' }]];
  }
  if (sql.includes('FROM licenses l WHERE l.order_id = ?')) {
    return [[{ id: 1, license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6', license_type: 'regular', status: 'active', max_domains: 1, theme_name: 'WoodMart' }]];
  }
  if (sql.includes('FROM payments WHERE order_id = ?')) {
    return [[{ id: 1, transaction_id: 'MB-123', gateway: 'vietqr', amount: 599000, currency: 'VND', status: 'completed', created_at: new Date() }]];
  }
  if (sql.includes('UPDATE orders SET')) {
    return [{ affectedRows: 1 }];
  }

  // 3. Themes queries
  if (sql.includes('SELECT COUNT(*) AS total FROM themes t')) {
    return [[{ total: 1 }]];
  }
  if (sql.includes('SELECT t.id, t.category_id, t.name, t.slug')) {
    return [[
      { id: 1, category_id: 1, name: 'WoodMart', slug: 'woodmart', thumbnail_url: 'https://example.com/thumb.jpg', price_vnd: 599000, price_usd: 29.0, current_version: '8.6.2', status: 'published', is_featured: 1, total_sales: 10, rating_avg: 5.0, rating_count: 5, created_at: new Date(), category_name: 'WordPress Theme', author_name: 'XTemos' },
    ]];
  }
  if (sql.includes('FROM themes t WHERE t.id = ? LIMIT 1')) {
    const themeId = params[0];
    if (themeId === 1) {
      return [[{ id: 1, category_id: 1, name: 'WoodMart', slug: 'woodmart', price_vnd: 599000, price_usd: 29.0, rating_avg: 5.0 }]];
    }
    return [[]];
  }
  if (sql.includes('SELECT id FROM categories WHERE id = ?')) {
    return [[{ id: 1 }]];
  }
  if (sql.includes('INSERT INTO themes')) {
    return [{ insertId: 99 }];
  }
  if (sql.includes('UPDATE themes SET')) {
    return [{ affectedRows: 1 }];
  }
  if (sql.includes('FROM categories ORDER BY')) {
    return [[{ id: 1, name_vi: 'WordPress Theme', name_en: 'WordPress Theme', slug: 'wordpress-theme', is_active: 1, sort_order: 1 }]];
  }

  // 4. Licenses queries
  if (sql.includes('SELECT COUNT(*) AS total\n         FROM licenses l') || sql.includes('SELECT COUNT(*) AS total FROM licenses l')) {
    return [[{ total: 1 }]];
  }
  if (sql.includes('SELECT l.id, l.license_key, l.license_type')) {
    return [[
      { id: 1, license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6', license_type: 'regular', status: 'active', max_domains: 1, active_domains_count: 1, theme_name: 'WoodMart', customer_email: 'customer@test.com' },
    ]];
  }
  if (sql.includes('FROM licenses WHERE license_key = ? LIMIT 1') || sql.includes('FROM licenses l WHERE l.license_key = ? LIMIT 1')) {
    const key = params[0];
    if (key === 'WD-2026-TEST-A1B2-C3D4-E5F6') {
      return [[{ id: 1, license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6', license_type: 'regular', status: 'active', max_domains: 1, customer_email: 'customer@test.com' }]];
    }
    return [[]];
  }
  if (sql.includes('FROM license_activations WHERE license_id = ? ORDER BY activated_at DESC')) {
    return [[{ id: 1, license_id: 1, domain: 'testshop.local', ip_address: '127.0.0.1', is_active: 1, activated_at: new Date() }]];
  }
  if (sql.includes('FROM license_activations WHERE license_id = ? AND is_active = 1')) {
    return [[{ id: 1, license_id: 1, domain: 'testshop.local', ip_address: '127.0.0.1', is_active: 1 }]];
  }
  if (sql.includes('UPDATE license_activations SET is_active = 0')) {
    return [{ affectedRows: 1 }];
  }
  if (sql.includes('UPDATE licenses SET active_domains_count = GREATEST')) {
    return [{ affectedRows: 1 }];
  }

  // 5. Users / Customers queries
  if (sql.includes('SELECT COUNT(*) AS total FROM users u')) {
    return [[{ total: 1 }]];
  }
  if (sql.includes('SELECT u.id, u.email, u.full_name, u.phone')) {
    return [[
      { id: 3, email: 'customer@example.test', full_name: 'Customer Test', phone: '0901234567', role: 'customer', status: 'active', country_code: 'VN', created_at: new Date(), orders_count: 1, licenses_count: 1, total_spent_vnd: 599000, total_spent_usd: 0 },
    ]];
  }
  if (sql.includes('FROM users WHERE id = ? LIMIT 1')) {
    const userId = params[0];
    if (userId === 1) {
      return [[{ id: 1, email: 'admin@example.test', full_name: 'Super Admin', phone: null, role: 'admin', status: 'active', country_code: 'VN', created_at: new Date() }]];
    }
    if (userId === 3) {
      return [[{ id: 3, email: 'customer@example.test', full_name: 'Customer Test', phone: '0901234567', role: 'customer', status: 'active', country_code: 'VN', created_at: new Date() }]];
    }
    return [[]];
  }
  if (sql.includes('FROM orders WHERE user_id = ?')) {
    return [[{ id: 1, order_number: 'ORD-TEST-123', total_amount: 599000, currency: 'VND', payment_status: 'paid', order_status: 'completed', created_at: new Date() }]];
  }
  if (sql.includes('FROM licenses l WHERE l.user_id = ?')) {
    return [[{ id: 1, license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6', theme_name: 'WoodMart', status: 'active' }]];
  }
  if (sql.includes('UPDATE users SET role = ? WHERE id = ?')) {
    return [{ affectedRows: 1 }];
  }

  throw new Error(`[Mock DB] Unhandled SQL in probe: ${sql}`);
};

UserModel.findByEmail = async (email) => {
  if (email === 'existing@test.com') {
    return { id: 99, email: 'existing@test.com', full_name: 'Existing User', role: 'customer', status: 'active' };
  }
  return null;
};

UserModel.findById = async (id) => {
  if (id === 1) return { id: 1, email: 'admin@example.test', full_name: 'Super Admin', role: 'admin', status: 'active' };
  if (id === 3) return { id: 3, email: 'customer@example.test', full_name: 'Customer Test', role: 'admin', status: 'active' };
  return null;
};

UserModel.create = async (user) => {
  return 100;
};

UserModel.updateRole = async (userId, role) => {
  return true;
};

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Test server did not bind to a TCP port.');
const baseUrl = `http://127.0.0.1:${address.port}`;

const adminToken = jwt.sign({ id: 1, email: 'admin@example.test', role: 'admin' }, secret);
const customerToken = jwt.sign({ id: 3, email: 'customer@example.test', role: 'customer' }, secret);
const authorToken = jwt.sign({ id: 4, email: 'author@example.test', role: 'author' }, secret);
const forgedToken = jwt.sign({ id: 1, email: 'admin@example.test', role: 'admin' }, 'different-secret-key-attacker');

async function testRequest(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

let passedProbes = 0;
let totalProbes = 0;

function probeAssert(condition, message) {
  totalProbes++;
  if (!condition) {
    console.error(`❌ PROBE FAILED: ${message}`);
    throw new Error(`Probe failed: ${message}`);
  }
  passedProbes++;
  console.log(`  ✓ Probe passed: ${message}`);
}

try {
  console.log('================================================================');
  console.log('STARTING EMPIRICAL ADVERSARIAL BACKEND STRESS PROBES');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SUITE 1: AUTHENTICATION & STRICT RBAC BOUNDARY PROBES
  // -------------------------------------------------------------
  console.log('--- SUITE 1: AUTHENTICATION & RBAC ENFORCEMENT ---');

  const adminRoutes = [
    { method: 'GET', path: '/api/v1/admin/stats' },
    { method: 'GET', path: '/api/v1/admin/analytics' },
    { method: 'GET', path: '/api/v1/admin/orders' },
    { method: 'GET', path: '/api/v1/admin/orders/ORD-TEST-123' },
    { method: 'PATCH', path: '/api/v1/admin/orders/ORD-TEST-123/status', body: { payment_status: 'paid' } },
    { method: 'GET', path: '/api/v1/admin/themes' },
    { method: 'POST', path: '/api/v1/admin/themes', body: {} },
    { method: 'GET', path: '/api/v1/admin/themes/1' },
    { method: 'PUT', path: '/api/v1/admin/themes/1', body: {} },
    { method: 'GET', path: '/api/v1/admin/categories' },
    { method: 'GET', path: '/api/v1/admin/licenses' },
    { method: 'GET', path: '/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6' },
    { method: 'POST', path: '/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate', body: { domain: 'test.com' } },
    { method: 'GET', path: '/api/v1/admin/customers' },
    { method: 'POST', path: '/api/v1/admin/customers', body: {} },
    { method: 'GET', path: '/api/v1/admin/customers/1' },
    { method: 'PATCH', path: '/api/v1/admin/customers/1/role', body: { role: 'admin' } },
  ];

  for (const r of adminRoutes) {
    const resUnauth = await testRequest(r.path, {
      method: r.method,
      headers: r.body ? { 'Content-Type': 'application/json' } : {},
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    probeAssert(resUnauth.status === 401, `Unauthenticated ${r.method} ${r.path} returns HTTP 401`);

    const resCustomer = await testRequest(r.path, {
      method: r.method,
      headers: {
        Authorization: `Bearer ${customerToken}`,
        ...(r.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    probeAssert(resCustomer.status === 403, `Customer token on ${r.method} ${r.path} returns HTTP 403`);

    const resAuthor = await testRequest(r.path, {
      method: r.method,
      headers: {
        Authorization: `Bearer ${authorToken}`,
        ...(r.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    probeAssert(resAuthor.status === 403, `Author token on ${r.method} ${r.path} returns HTTP 403`);

    const resForged = await testRequest(r.path, {
      method: r.method,
      headers: {
        Authorization: `Bearer ${forgedToken}`,
        ...(r.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: r.body ? JSON.stringify(r.body) : undefined,
    });
    probeAssert(resForged.status === 401, `Forged JWT on ${r.method} ${r.path} returns HTTP 401`);
  }

  // -------------------------------------------------------------
  // SUITE 2: SELF-DEMOTION ATTACK VECTOR PROBES (INV-03)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: SELF-DEMOTION DEFENSE PROBES ---');

  // 2.1: Admin self-demoting to customer
  const demoteCustomer = await testRequest('/api/v1/admin/customers/1/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'customer' }),
  });
  probeAssert(demoteCustomer.status === 400, 'Self-demotion to customer rejected with HTTP 400');
  probeAssert((demoteCustomer.body?.error || demoteCustomer.body?.code) === 'SELF_DEMOTION_FORBIDDEN', 'Error code is SELF_DEMOTION_FORBIDDEN');
  probeAssert(demoteCustomer.body?.message?.includes('tự hạ quyền'), 'Message explains self-demotion prevention');

  // 2.2: Admin self-demoting to author
  const demoteAuthor = await testRequest('/api/v1/admin/customers/1/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'author' }),
  });
  probeAssert(demoteAuthor.status === 400, 'Self-demotion to author rejected with HTTP 400');
  probeAssert((demoteAuthor.body?.error || demoteAuthor.body?.code) === 'SELF_DEMOTION_FORBIDDEN', 'Self-demotion to author returns SELF_DEMOTION_FORBIDDEN');

  // 2.3: Admin changing another user's role to customer
  const otherRoleChange = await testRequest('/api/v1/admin/customers/3/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'customer' }),
  });
  probeAssert(otherRoleChange.status === 200, 'Promoting/updating another user returns HTTP 200');

  // 2.4: Admin idempotent role update on self (re-affirming admin role)
  const selfAffirmAdmin = await testRequest('/api/v1/admin/customers/1/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'admin' }),
  });
  probeAssert(selfAffirmAdmin.status === 200, 'Self role update to admin is allowed idempotently (HTTP 200)');

  // 2.5: Non-numeric user ID
  const invalidUserId = await testRequest('/api/v1/admin/customers/not-a-number/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'admin' }),
  });
  probeAssert(invalidUserId.status === 400, 'Non-numeric customer ID returns HTTP 400');
  probeAssert((invalidUserId.body?.error || invalidUserId.body?.code) === 'INVALID_ID', 'Non-numeric customer ID returns code INVALID_ID');

  // 2.6: Invalid role enum
  const invalidRoleEnum = await testRequest('/api/v1/admin/customers/3/role', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'superadmin_hacker' }),
  });
  probeAssert(invalidRoleEnum.status === 400, 'Invalid role enum returns HTTP 400');
  probeAssert((invalidRoleEnum.body?.error || invalidRoleEnum.body?.code) === 'INVALID_ROLE', 'Invalid role enum returns code INVALID_ROLE');

  // -------------------------------------------------------------
  // SUITE 3: MULTI-CURRENCY SEPARATION INVARIANT PROBES (INV-01)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: MULTI-CURRENCY SEPARATION PROBES ---');

  const statsRes = await testRequest('/api/v1/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(statsRes.status === 200, 'Stats endpoint returns HTTP 200');
  probeAssert(statsRes.body?.data?.revenue !== undefined, 'Stats data has revenue object');
  probeAssert(typeof statsRes.body?.data?.revenue?.vnd === 'number', 'revenue.vnd is a distinct number');
  probeAssert(typeof statsRes.body?.data?.revenue?.usd === 'number', 'revenue.usd is a distinct number');
  probeAssert(statsRes.body?.data?.revenue?.vnd === 599000, 'revenue.vnd has expected value');
  probeAssert(statsRes.body?.data?.revenue?.usd === 29, 'revenue.usd has expected value');
  probeAssert(statsRes.body?.data?.revenue?.total === undefined, 'No unified revenue.total field combining currencies');
  probeAssert(statsRes.body?.data?.total_revenue === undefined, 'No root total_revenue field combining currencies');

  const analyticsRes = await testRequest('/api/v1/admin/analytics?days=30', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(analyticsRes.status === 200, 'Analytics endpoint returns HTTP 200');
  const series = analyticsRes.body?.data?.series;
  probeAssert(Array.isArray(series) && series.length > 0, 'Analytics contains series array');
  probeAssert(series[0].revenue_vnd !== undefined && series[0].revenue_usd !== undefined, 'Series items have separate revenue_vnd and revenue_usd');
  probeAssert(series[0].revenue === undefined, 'Series items do not combine into a single revenue field');

  const topThemes = analyticsRes.body?.data?.top_themes;
  probeAssert(Array.isArray(topThemes) && topThemes.length > 0, 'Analytics contains top_themes array');
  probeAssert(topThemes[0].revenue_vnd !== undefined && topThemes[0].revenue_usd !== undefined, 'Top theme items have separate revenue_vnd and revenue_usd');

  const customersList = await testRequest('/api/v1/admin/customers', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(customersList.status === 200, 'Customers endpoint returns HTTP 200');
  const firstCustomer = customersList.body?.data?.customers?.[0];
  probeAssert(typeof firstCustomer?.total_spent_vnd === 'number', 'Customer item has total_spent_vnd number');
  probeAssert(typeof firstCustomer?.total_spent_usd === 'number', 'Customer item has total_spent_usd number');
  probeAssert(firstCustomer?.total_spent === undefined, 'Customer item does not have aggregated total_spent field');

  // -------------------------------------------------------------
  // SUITE 4: INPUT FUZZING & BOUNDARY VALIDATION PROBES
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: INPUT FUZZING & BOUNDARY VALIDATION ---');

  // 4.1 Order status update empty body
  const emptyOrderStatus = await testRequest('/api/v1/admin/orders/ORD-TEST-123/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  probeAssert(emptyOrderStatus.status === 400, 'Order status update with empty body returns HTTP 400');
  probeAssert((emptyOrderStatus.body?.error || emptyOrderStatus.body?.code) === 'INVALID_STATUS_UPDATE', 'Empty status returns INVALID_STATUS_UPDATE');

  // 4.2 Order status update invalid payment_status
  const invalidPaymentStatus = await testRequest('/api/v1/admin/orders/ORD-TEST-123/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: 'unsupported_status' }),
  });
  probeAssert(invalidPaymentStatus.status === 400, 'Invalid payment_status returns HTTP 400');

  // 4.3 Order status update invalid order_status
  const invalidOrderStatus = await testRequest('/api/v1/admin/orders/ORD-TEST-123/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_status: 'shipped' }),
  });
  probeAssert(invalidOrderStatus.status === 400, 'Invalid order_status (e.g. shipped) returns HTTP 400');

  // 4.4 Order status update non-existent order
  const notFoundOrder = await testRequest('/api/v1/admin/orders/ORD-NON-EXISTENT/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_status: 'completed' }),
  });
  probeAssert(notFoundOrder.status === 404, 'Updating non-existent order returns HTTP 404');

  // 4.5 License domain deactivation empty body
  const emptyDeact = await testRequest('/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  probeAssert(emptyDeact.status === 400, 'License deactivation with empty body returns HTTP 400');
  probeAssert((emptyDeact.body?.error || emptyDeact.body?.code) === 'INVALID_DOMAIN', 'Returns INVALID_DOMAIN code');

  // 4.6 License domain deactivation empty string domain
  const emptyStrDomain = await testRequest('/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: '' }),
  });
  probeAssert(emptyStrDomain.status === 400, 'License deactivation with empty domain returns HTTP 400');

  // 4.7 License domain deactivation too short domain
  const shortDomain = await testRequest('/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'ab' }),
  });
  probeAssert(shortDomain.status === 400, 'License deactivation with domain < 3 chars returns HTTP 400');

  // 4.8 License domain deactivation non-existent license key
  const notFoundLicense = await testRequest('/api/v1/admin/licenses/WD-NON-EXISTENT-KEY/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'myshop.com' }),
  });
  probeAssert(notFoundLicense.status === 404, 'License deactivation with non-existent key returns HTTP 404');

  // 4.9 Theme creation negative price_vnd
  const negPriceVnd = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Neg VND Theme',
      slug: 'neg-vnd-theme',
      price_vnd: -100,
      price_usd: 10,
      live_demo_url: 'https://demo.example.com',
      thumbnail_url: 'https://demo.example.com/thumb.jpg',
    }),
  });
  probeAssert(negPriceVnd.status === 400, 'Theme creation with negative price_vnd returns HTTP 400');
  probeAssert((negPriceVnd.body?.error || negPriceVnd.body?.code) === 'INVALID_THEME_PRICE', 'Negative price_vnd returns INVALID_THEME_PRICE');

  // 4.10 Theme creation negative price_usd
  const negPriceUsd = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Neg USD Theme',
      slug: 'neg-usd-theme',
      price_vnd: 100000,
      price_usd: -5,
      live_demo_url: 'https://demo.example.com',
      thumbnail_url: 'https://demo.example.com/thumb.jpg',
    }),
  });
  probeAssert(negPriceUsd.status === 400, 'Theme creation with negative price_usd returns HTTP 400');
  probeAssert((negPriceUsd.body?.error || negPriceUsd.body?.code) === 'INVALID_THEME_PRICE', 'Negative price_usd returns INVALID_THEME_PRICE');

  // 4.11 Theme creation uppercase slug with spaces
  const badSlugTheme = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bad Slug Theme',
      slug: 'BAD SLUG WITH SPACES',
      price_vnd: 100000,
      price_usd: 10,
      live_demo_url: 'https://demo.example.com',
      thumbnail_url: 'https://demo.example.com/thumb.jpg',
    }),
  });
  probeAssert(badSlugTheme.status === 400, 'Theme creation with uppercase/spaced slug returns HTTP 400');
  probeAssert((badSlugTheme.body?.error || badSlugTheme.body?.code) === 'INVALID_THEME_INPUT', 'Bad slug returns INVALID_THEME_INPUT');

  // 4.12 Theme creation invalid live demo URL (XSS probe)
  const xssUrlTheme = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'XSS URL Theme',
      slug: 'xss-url-theme',
      price_vnd: 100000,
      price_usd: 10,
      live_demo_url: 'javascript:alert(1)',
      thumbnail_url: 'https://demo.example.com/thumb.jpg',
    }),
  });
  probeAssert(xssUrlTheme.status === 400, 'Theme creation with javascript: URL returns HTTP 400');
  probeAssert((xssUrlTheme.body?.error || xssUrlTheme.body?.code) === 'INVALID_THEME_INPUT', 'XSS url returns INVALID_THEME_INPUT');

  // 4.13 Theme creation missing required name
  const missingNameTheme = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'missing-name-theme',
      price_vnd: 100000,
      price_usd: 10,
      live_demo_url: 'https://demo.example.com',
      thumbnail_url: 'https://demo.example.com/thumb.jpg',
    }),
  });
  probeAssert(missingNameTheme.status === 400, 'Theme creation without name returns HTTP 400');

  // 4.14 Theme update with empty payload
  const emptyThemeUpdate = await testRequest('/api/v1/admin/themes/1', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  probeAssert(emptyThemeUpdate.status === 400, 'Theme update with empty payload returns HTTP 400');
  probeAssert((emptyThemeUpdate.body?.error || emptyThemeUpdate.body?.code) === 'NO_VALID_FIELDS', 'Returns NO_VALID_FIELDS code');

  // 4.15 Customer creation short password (< 6 chars)
  const shortPassCustomer = await testRequest('/api/v1/admin/customers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'shortpass@example.test',
      full_name: 'Short Password Customer',
      password: '12345',
    }),
  });
  probeAssert(shortPassCustomer.status === 400, 'Customer creation with password < 6 chars returns HTTP 400');
  probeAssert((shortPassCustomer.body?.error || shortPassCustomer.body?.code) === 'INVALID_PASSWORD', 'Returns INVALID_PASSWORD code');

  // 4.16 Customer creation empty password
  const emptyPassCustomer = await testRequest('/api/v1/admin/customers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'emptypass@example.test',
      full_name: 'Empty Password Customer',
      password: '',
    }),
  });
  probeAssert(emptyPassCustomer.status === 400, 'Customer creation with empty password returns HTTP 400');

  // 4.17 Customer creation invalid email syntax
  const invalidEmailCustomer = await testRequest('/api/v1/admin/customers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'invalid-email-address',
      full_name: 'Invalid Email Customer',
      password: 'validPassword123',
    }),
  });
  probeAssert(invalidEmailCustomer.status === 400, 'Customer creation with invalid email returns HTTP 400');
  probeAssert((invalidEmailCustomer.body?.error || invalidEmailCustomer.body?.code) === 'INVALID_EMAIL', 'Returns INVALID_EMAIL code');

  // 4.18 Customer creation short full_name (< 2 chars)
  const shortNameCustomer = await testRequest('/api/v1/admin/customers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'validemail@example.test',
      full_name: 'A',
      password: 'validPassword123',
    }),
  });
  probeAssert(shortNameCustomer.status === 400, 'Customer creation with full_name < 2 chars returns HTTP 400');
  probeAssert((shortNameCustomer.body?.error || shortNameCustomer.body?.code) === 'INVALID_FULL_NAME', 'Returns INVALID_FULL_NAME code');

  // 4.19 Customer creation duplicate email conflict (409)
  const duplicateEmailCustomer = await testRequest('/api/v1/admin/customers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'existing@test.com',
      full_name: 'Existing Customer',
      password: 'validPassword123',
    }),
  });
  probeAssert(duplicateEmailCustomer.status === 409, 'Customer creation with existing email returns HTTP 409');
  probeAssert((duplicateEmailCustomer.body?.error || duplicateEmailCustomer.body?.code) === 'EMAIL_EXISTS', 'Returns EMAIL_EXISTS code');

  // -------------------------------------------------------------
  // SUITE 5: OFFLINE DATABASE RESILIENCE PROBES (INV-06)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: OFFLINE DATABASE RESILIENCE PROBES (INV-06) ---');
  offlineMode = true;

  // 5.1 Stats offline fallback
  const offlineStats = await testRequest('/api/v1/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineStats.status === 200, 'Offline DB: GET /stats returns HTTP 200 with fallback data');
  probeAssert(offlineStats.body?.data?.revenue?.vnd !== undefined, 'Offline DB: returns revenue.vnd');
  probeAssert(offlineStats.body?.data?.orders?.total !== undefined, 'Offline DB: returns orders.total');

  // 5.2 Analytics offline fallback
  const offlineAnalytics = await testRequest('/api/v1/admin/analytics?days=30', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineAnalytics.status === 200, 'Offline DB: GET /analytics returns HTTP 200');
  probeAssert(Array.isArray(offlineAnalytics.body?.data?.series), 'Offline DB: returns series array');

  // 5.3 Orders list offline fallback
  const offlineOrders = await testRequest('/api/v1/admin/orders', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineOrders.status === 200, 'Offline DB: GET /orders returns HTTP 200');
  probeAssert(Array.isArray(offlineOrders.body?.data?.orders), 'Offline DB: returns orders array');

  // 5.4 Order detail offline fallback
  const offlineOrderDetail = await testRequest('/api/v1/admin/orders/ORD-2026-8888', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineOrderDetail.status === 200, 'Offline DB: GET /orders/ORD-2026-8888 returns HTTP 200');
  probeAssert(offlineOrderDetail.body?.data?.order_number === 'ORD-2026-8888', 'Offline DB: order details match');

  // 5.5 Order status update offline fallback
  const offlineStatusUpdate = await testRequest('/api/v1/admin/orders/ORD-2026-8888/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: 'paid', order_status: 'completed' }),
  });
  probeAssert(offlineStatusUpdate.status === 200, 'Offline DB: PATCH /orders/ORD-2026-8888/status returns HTTP 200');
  probeAssert(offlineStatusUpdate.body?.data?.payment_status === 'paid', 'Offline DB: status updated in memory');

  // 5.6 Themes list offline fallback
  const offlineThemes = await testRequest('/api/v1/admin/themes', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineThemes.status === 200, 'Offline DB: GET /themes returns HTTP 200');
  probeAssert(Array.isArray(offlineThemes.body?.data?.themes), 'Offline DB: returns themes array');

  // 5.7 Theme creation in offline fallback mode
  const offlineThemeCreate = await testRequest('/api/v1/admin/themes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Offline Fallback Theme',
      slug: 'offline-fallback-theme-unique',
      price_vnd: 499000,
      price_usd: 25.0,
      live_demo_url: 'https://example.com/offline-demo',
      thumbnail_url: 'https://example.com/offline-thumb.jpg',
    }),
  });
  probeAssert(offlineThemeCreate.status === 201, 'Offline DB: POST /themes creates in-memory theme and returns HTTP 201');

  // 5.8 Categories offline fallback
  const offlineCategories = await testRequest('/api/v1/admin/categories', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineCategories.status === 200, 'Offline DB: GET /categories returns HTTP 200');
  probeAssert(Array.isArray(offlineCategories.body?.data?.categories), 'Offline DB: categories array present');

  // 5.9 Licenses list offline fallback
  const offlineLicenses = await testRequest('/api/v1/admin/licenses', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineLicenses.status === 200, 'Offline DB: GET /licenses returns HTTP 200');
  probeAssert(Array.isArray(offlineLicenses.body?.data?.licenses), 'Offline DB: licenses array present');

  // 5.10 License detail offline fallback
  const offlineLicenseDetail = await testRequest('/api/v1/admin/licenses/WD-2026-DEMO-A1B2-C3D4-E5F6', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineLicenseDetail.status === 200, 'Offline DB: GET /licenses/:key returns HTTP 200');
  probeAssert(Array.isArray(offlineLicenseDetail.body?.data?.activations), 'Offline DB: returns activations array');

  // 5.11 License domain deactivation in offline fallback mode
  const offlineDeact = await testRequest('/api/v1/admin/licenses/WD-2026-DEMO-A1B2-C3D4-E5F6/deactivate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'mytestshop.local' }),
  });
  probeAssert(offlineDeact.status === 200, 'Offline DB: POST /licenses/:key/deactivate returns HTTP 200');
  probeAssert(offlineDeact.body?.data?.is_active === 0, 'Offline DB: domain is_active set to 0');

  // 5.12 Customers list offline fallback
  const offlineCustomers = await testRequest('/api/v1/admin/customers', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineCustomers.status === 200, 'Offline DB: GET /customers returns HTTP 200');
  probeAssert(Array.isArray(offlineCustomers.body?.data?.customers), 'Offline DB: customers array present');

  // 5.13 Customer detail offline fallback
  const offlineCustomerDetail = await testRequest('/api/v1/admin/customers/3', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  probeAssert(offlineCustomerDetail.status === 200, 'Offline DB: GET /customers/3 returns HTTP 200');
  probeAssert(offlineCustomerDetail.body?.data?.customer?.id === 3, 'Offline DB: customer profile matches');

  offlineMode = false;

  console.log('\n================================================================');
  console.log(`ALL ADVERSARIAL STRESS PROBES PASSED! (${passedProbes}/${totalProbes})`);
  console.log('================================================================');
} finally {
  dbPool.query = originalQuery;
  UserModel.findByEmail = originalFindByEmail;
  UserModel.findById = originalFindById;
  UserModel.updateRole = originalUpdateRole;
  UserModel.create = originalCreateUser;
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
}
