import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

const { createInitialAdmin } = await import('../dist/services/initial-admin.service.js');

class FakeConnection {
  constructor({ admins = [], users = [] } = {}) {
    this.admins = admins;
    this.users = users;
    this.calls = [];
    this.insertValues = null;
    this.committed = false;
    this.rolledBack = false;
  }
  async beginTransaction() { this.calls.push('begin'); }
  async commit() { this.committed = true; this.calls.push('commit'); }
  async rollback() { this.rolledBack = true; this.calls.push('rollback'); }
  async execute(sql, values = []) {
    this.calls.push(sql);
    if (sql.includes('WHERE role = ?')) return [this.admins, []];
    if (sql.includes('WHERE email = ?')) return [this.users.filter((user) => user.email === values[0]), []];
    if (sql.includes('INSERT INTO users')) {
      this.insertValues = values;
      return [{ insertId: 42 }, []];
    }
    throw new Error(`Unexpected SQL: ${sql}`);
  }
}

const input = { email: 'owner@example.test', password: 'admin-password-123', fullName: 'Initial Owner' };

{
  const connection = new FakeConnection();
  const result = await createInitialAdmin(connection, input);
  assert.deepEqual(result, { status: 'created', id: 42, email: input.email });
  assert.equal(connection.committed, true);
  assert.equal(connection.rolledBack, false);
  assert.equal(connection.insertValues[0], input.email);
  assert.equal(connection.insertValues[2], input.fullName);
  assert.equal(await bcrypt.compare(input.password, connection.insertValues[1]), true);
  assert.equal(connection.insertValues[3], 'admin');
  assert.equal(connection.insertValues[4], 'active');
}

{
  const connection = new FakeConnection({ admins: [{ id: 7, email: 'existing-admin@example.test' }] });
  const result = await createInitialAdmin(connection, input);
  assert.deepEqual(result, { status: 'exists', id: 7, email: 'existing-admin@example.test' });
  assert.equal(connection.insertValues, null, 'existing Admin must never be overwritten');
  assert.equal(connection.rolledBack, true);
}

{
  const connection = new FakeConnection({ users: [{ id: 8, email: input.email, role: 'customer' }] });
  await assert.rejects(() => createInitialAdmin(connection, input), /từ chối tự động nâng quyền/i);
  assert.equal(connection.insertValues, null, 'an existing customer cannot be promoted by bootstrap');
  assert.equal(connection.rolledBack, true);
}

await assert.rejects(
  () => createInitialAdmin(new FakeConnection(), { ...input, password: 'short' }),
  /ít nhất 12 ký tự/i,
);

console.log('Initial Admin bootstrap tests: 4/4 passed');
