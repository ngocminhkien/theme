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
  throw new Error(`Unexpected query in admin route test: ${sql}`);
};

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Test server did not bind to a TCP port.');
const baseUrl = `http://127.0.0.1:${address.port}`;
const secret = process.env.JWT_SECRET;

try {
  const anonymous = await fetch(`${baseUrl}/api/v1/admin/stats`);
  expect(anonymous.status === 401, 'admin stats must require a bearer token');

  const customerToken = jwt.sign({ id: 3, email: 'customer@example.test', role: 'customer' }, secret);
  const customer = await fetch(`${baseUrl}/api/v1/admin/stats`, { headers: { Authorization: `Bearer ${customerToken}` } });
  expect(customer.status === 403, 'a non-admin account must not reach admin data');

  const adminToken = jwt.sign({ id: 1, email: 'admin@example.test', role: 'admin' }, secret);
  const admin = await fetch(`${baseUrl}/api/v1/admin/stats`, { headers: { Authorization: `Bearer ${adminToken}` } });
  const body = await admin.json();
  expect(admin.status === 200 && body.success === true, 'an admin must reach the mounted stats route');
  expect(body.data?.revenue?.vnd === 599000 && body.data?.revenue?.usd === 29, 'revenue must keep VND and USD separate');
  console.log('Admin API RBAC and mounted route tests: 3/3 passed');
} finally {
  dbPool.query = originalQuery;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
