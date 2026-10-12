import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'admin-auth-test-secret-that-is-not-used-outside-tests';

const { app } = await import('../dist/app.js');
const { UserModel } = await import('../dist/models/user.model.js');
const { dbPool } = await import('../dist/config/database.js');

const password = 'correct-admin-password';
const admin = {
  id: 1, email: 'admin@example.test', password_hash: await bcrypt.hash(password, 12),
  full_name: 'Admin Test', role: 'admin', status: 'active', created_at: new Date(),
};
const customer = {
  id: 2, email: 'customer@example.test', password_hash: await bcrypt.hash('customer-password-123', 12),
  full_name: 'Customer Test', role: 'customer', status: 'active', created_at: new Date(),
};

const original = {
  findByEmail: UserModel.findByEmail,
  findById: UserModel.findById,
  create: UserModel.create,
  query: dbPool.query,
};
let createdUser;
UserModel.findByEmail = async (email) => [admin, customer].find((user) => user.email === email) || null;
UserModel.findById = async (id) => {
  const user = [admin, customer].find((candidate) => candidate.id === id);
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};
UserModel.create = async (input) => { createdUser = input; return customer.id; };
dbPool.query = async (sql) => {
  if (sql.includes('GROUP BY currency')) return [[{ currency: 'VND', total_revenue: '0' }]];
  if (sql.includes('paid_orders')) return [[{ total_orders: 0, paid_orders: 0, pending_orders: 0, failed_orders: 0 }]];
  if (sql.includes('total_themes')) return [[{ total_themes: 0 }]];
  if (sql.includes('total_customers')) return [[{ total_customers: 0 }]];
  if (sql.includes('active_licenses')) return [[{ active_licenses: 0 }]];
  if (sql.includes('LIMIT 5')) return [[]];
  throw new Error(`Unexpected query: ${sql}`);
};

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Test server did not bind to a TCP port.');
const baseUrl = `http://127.0.0.1:${address.port}`;

async function request(path, init = {}) {
  const response = await fetch(baseUrl + path, init);
  return { response, body: await response.json() };
}

try {
  const successful = await request('/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: admin.email, password }),
  });
  assert.equal(successful.response.status, 200);
  assert.equal(successful.body.data.user.role, 'admin');
  assert.equal('password_hash' in successful.body.data.user, false, 'login must not expose password hashes');
  assert.equal(jwt.verify(successful.body.data.token, process.env.JWT_SECRET).role, 'admin');

  const wrongPassword = await request('/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: admin.email, password: 'wrong-password' }),
  });
  assert.equal(wrongPassword.response.status, 401);

  const customerLogin = await request('/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: customer.email, password: 'customer-password-123' }),
  });
  const forbidden = await request('/api/v1/admin/stats', { headers: { Authorization: `Bearer ${customerLogin.body.data.token}` } });
  assert.equal(forbidden.response.status, 403, 'a customer token must not access Admin API');

  const invalid = await request('/api/v1/auth/me', { headers: { Authorization: 'Bearer invalid-token' } });
  assert.equal(invalid.response.status, 401);
  const expiredToken = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: -1 });
  const expired = await request('/api/v1/auth/me', { headers: { Authorization: `Bearer ${expiredToken}` } });
  assert.equal(expired.response.status, 401);

  const registration = await request('/api/v1/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'new-user@example.test', password: 'customer-password-123', full_name: 'New User', role: 'admin' }),
  });
  assert.equal(registration.response.status, 201);
  assert.equal(createdUser.role, undefined, 'public registration must not set the role supplied by a client');
  assert.equal(registration.body.data.user.role, 'customer');
  assert.equal('password_hash' in registration.body.data.user, false);

  const adminStats = await request('/api/v1/admin/stats', { headers: { Authorization: `Bearer ${successful.body.data.token}` } });
  assert.equal(adminStats.response.status, 200, 'a valid Admin token must reach Admin API');
  console.log('Admin auth and RBAC tests: 7/7 passed');
} finally {
  UserModel.findByEmail = original.findByEmail;
  UserModel.findById = original.findById;
  UserModel.create = original.create;
  dbPool.query = original.query;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
