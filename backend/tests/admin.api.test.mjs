import jwt from 'jsonwebtoken';

// Set before importing compiled configuration so dotenv cannot replace the
// isolated test secret with a workstation value.
process.env.JWT_SECRET = 'admin-api-route-test-secret-which-is-long-enough';

const { app } = await import('../dist/app.js');
const { dbPool } = await import('../dist/config/database.js');

function expect(value, message) {
  if (!value) throw new Error(message);
}

const originalQuery = dbPool.query;
dbPool.query = async (sql) => {
  if (sql.includes('GROUP BY currency')) return [[{ currency: 'VND', total_revenue: '599000' }, { currency: 'USD', total_revenue: '29.00' }]];
  if (sql.includes('paid_orders')) return [[{ total_orders: 3, paid_orders: 2, pending_orders: 1, failed_orders: 0 }]];
  if (sql.includes('total_themes')) return [[{ total_themes: 10 }]];
  if (sql.includes('total_customers')) return [[{ total_customers: 2 }]];
  if (sql.includes('active_licenses')) return [[{ active_licenses: 2 }]];
  if (sql.includes('LIMIT 5')) return [[{ id: 1, order_number: 'OD-TEST', total_amount: '599000', currency: 'VND' }]];
  if (sql.includes('UPDATE users SET role = ?')) return [{ affectedRows: 1 }];
  if (sql.includes('FROM users WHERE id = ?')) return [[{ id: 3, email: 'customer@example.test', full_name: 'Customer Test', phone: null, role: 'admin', status: 'active' }]];
  if (sql.includes('SELECT COUNT(*) AS total FROM users u')) return [[{ total: 1 }]];
  if (sql.includes('FROM users u')) {
    return [[{
      id: 3,
      email: 'customer@example.test',
      full_name: 'Customer Test',
      phone: null,
      role: 'customer',
      status: 'active',
      country_code: 'VN',
      created_at: new Date().toISOString(),
      orders_count: 1,
      licenses_count: 2,
      total_spent_vnd: 599000,
      total_spent_usd: 0,
    }]];
  }
  if (sql.includes('FROM orders WHERE order_number = ?')) {
    return [[{ id: 1, order_number: 'ORD-TEST-123', payment_status: 'pending', order_status: 'processing' }]];
  }
  if (sql.includes('UPDATE orders SET')) return [{ affectedRows: 1 }];
  if (sql.includes('FROM licenses WHERE license_key = ?')) {
    return [[{ id: 1, license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6' }]];
  }
  if (sql.includes('FROM licenses l')) {
    return [[{
      id: 1,
      license_key: 'WD-2026-TEST-A1B2-C3D4-E5F6',
      status: 'active',
      max_domains: 1,
      active_domains_count: 1,
      theme_name: 'WoodMart',
    }]];
  }
  if (sql.includes('FROM license_activations WHERE license_id = ? AND is_active = 1')) {
    return [[{ id: 1, license_id: 1, domain: 'testshop.local', ip_address: '127.0.0.1', is_active: 1 }]];
  }
  if (sql.includes('UPDATE license_activations SET is_active = 0')) return [{ affectedRows: 1 }];
  if (sql.includes('UPDATE licenses SET active_domains_count = GREATEST')) return [{ affectedRows: 1 }];
  throw new Error(`Unexpected query in admin route test: ${sql}`);
};

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Test server did not bind to a TCP port.');
const baseUrl = `http://127.0.0.1:${address.port}`;
const secret = process.env.JWT_SECRET;

try {
  let passedCount = 0;

  // 1. Unauthenticated request rejected
  const anonymous = await fetch(`${baseUrl}/api/v1/admin/stats`);
  expect(anonymous.status === 401, 'admin stats must require a bearer token');
  passedCount++;

  // 2. Non-admin request rejected
  const customerToken = jwt.sign({ id: 3, email: 'customer@example.test', role: 'customer' }, secret);
  const customer = await fetch(`${baseUrl}/api/v1/admin/stats`, { headers: { Authorization: `Bearer ${customerToken}` } });
  expect(customer.status === 403, 'a non-admin account must not reach admin data');
  passedCount++;

  // 3. Admin stats & currency separation (INV-01)
  const adminToken = jwt.sign({ id: 1, email: 'admin@example.test', role: 'admin' }, secret);
  const admin = await fetch(`${baseUrl}/api/v1/admin/stats`, { headers: { Authorization: `Bearer ${adminToken}` } });
  const body = await admin.json();
  expect(admin.status === 200 && body.success === true, 'an admin must reach the mounted stats route');
  expect(body.data?.revenue?.vnd === 599000 && body.data?.revenue?.usd === 29, 'revenue must keep VND and USD separate');
  passedCount++;

  // 4. Self-demotion defense (INV-03)
  const selfDemote = await fetch(`${baseUrl}/api/v1/admin/customers/1/role`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'customer' }),
  });
  expect(selfDemote.status === 400, 'admin must not be allowed to demote their own account');
  passedCount++;

  // 5. Role update on another user
  const roleUpdate = await fetch(`${baseUrl}/api/v1/admin/customers/3/role`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'admin' }),
  });
  const roleBody = await roleUpdate.json();
  expect(roleUpdate.status === 200 && roleBody.success === true && roleBody.data?.user?.role === 'admin', 'admin must be able to update user role');
  passedCount++;

  // 6. Customers list with licenses_count
  const customersRes = await fetch(`${baseUrl}/api/v1/admin/customers`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const customersBody = await customersRes.json();
  expect(customersRes.status === 200 && customersBody.success === true, 'admin must be able to list customers');
  expect(customersBody.data?.customers?.[0]?.licenses_count === 2, 'customer item must include licenses_count');
  passedCount++;

  // 7. Order status update: PATCH /api/v1/admin/orders/:orderNumber/status
  const orderStatusUpdate = await fetch(`${baseUrl}/api/v1/admin/orders/ORD-TEST-123/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: 'paid', order_status: 'completed' }),
  });
  const orderStatusBody = await orderStatusUpdate.json();
  expect(orderStatusUpdate.status === 200 && orderStatusBody.success === true, 'order status update must succeed');
  expect(orderStatusBody.data?.order_number === 'ORD-TEST-123' && orderStatusBody.data?.payment_status === 'paid' && orderStatusBody.data?.order_status === 'completed', 'order status must reflect updated values');
  passedCount++;

  // 8. Order status update validation rejection: invalid payment_status
  const orderStatusInvalid = await fetch(`${baseUrl}/api/v1/admin/orders/ORD-TEST-123/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: 'unknown_status' }),
  });
  expect(orderStatusInvalid.status === 400, 'invalid order payment_status must be rejected with 400');
  passedCount++;

  // 9. Order status update validation rejection: empty payload
  const orderStatusEmpty = await fetch(`${baseUrl}/api/v1/admin/orders/ORD-TEST-123/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  expect(orderStatusEmpty.status === 400, 'empty order status update payload must be rejected with 400');
  passedCount++;

  // 10. License domain deactivation: POST /api/v1/admin/licenses/:licenseKey/deactivate
  const licenseDeactivate = await fetch(`${baseUrl}/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: 'testshop.local' }),
  });
  const licenseDeactBody = await licenseDeactivate.json();
  expect(licenseDeactivate.status === 200 && licenseDeactBody.success === true, 'domain deactivation must succeed');
  expect(licenseDeactBody.data?.is_active === 0 && licenseDeactBody.data?.domain === 'testshop.local', 'deactivated domain must be flagged is_active: 0');
  passedCount++;

  // 11. License domain deactivation rejection: missing/empty domain
  const licenseDeactEmpty = await fetch(`${baseUrl}/api/v1/admin/licenses/WD-2026-TEST-A1B2-C3D4-E5F6/deactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: '' }),
  });
  expect(licenseDeactEmpty.status === 400, 'domain deactivation with empty domain must return 400');
  passedCount++;

  // 12. Theme creation validation rejection: negative price
  const themeNegativePrice = await fetch(`${baseUrl}/api/v1/admin/themes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Invalid Price Theme',
      slug: 'invalid-price-theme',
      price_vnd: -1000,
      price_usd: 10,
      live_demo_url: 'https://example.com',
      thumbnail_url: 'https://example.com/thumb.jpg',
    }),
  });
  expect(themeNegativePrice.status === 400, 'theme creation with negative price must return 400');
  passedCount++;

  // 13. Theme creation validation rejection: malformed slug
  const themeBadSlug = await fetch(`${baseUrl}/api/v1/admin/themes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Invalid Slug Theme',
      slug: 'INVALID SLUG WITH SPACES',
      price_vnd: 500000,
      price_usd: 25,
      live_demo_url: 'https://example.com',
      thumbnail_url: 'https://example.com/thumb.jpg',
    }),
  });
  expect(themeBadSlug.status === 400, 'theme creation with malformed slug must return 400');
  passedCount++;

  // 14. Customer creation validation rejection: short password
  const customerShortPass = await fetch(`${baseUrl}/api/v1/admin/customers`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'shortpass@example.test',
      full_name: 'Test Customer',
      password: '123',
    }),
  });
  expect(customerShortPass.status === 400, 'customer creation with short password must return 400');
  passedCount++;

  // 15. Customer creation validation rejection: malformed email
  const customerBadEmail = await fetch(`${baseUrl}/api/v1/admin/customers`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'not-an-email',
      full_name: 'Test Customer',
      password: 'validPassword123',
    }),
  });
  expect(customerBadEmail.status === 400, 'customer creation with malformed email must return 400');
  passedCount++;

  console.log(`Admin API RBAC, mutations, validation and mounted route tests: ${passedCount}/${passedCount} passed`);
} finally {
  dbPool.query = originalQuery;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
