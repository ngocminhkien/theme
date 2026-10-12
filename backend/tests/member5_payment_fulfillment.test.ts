import { dbPool } from '../src/config/database.js';
import { ENV } from '../src/config/env.js';
import { PaymentFulfillmentService } from '../src/services/payment-fulfillment.service.js';

interface Result { name: string; passed: boolean; details?: string }
const results: Result[] = [];

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

async function run(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log('  PASS ' + name);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, details });
    console.error('  FAIL ' + name + ': ' + details);
  }
}

type State = {
  order: any | null;
  items: any[];
  payments: any[];
  licenses: any[];
};

type Faults = { paymentInsert?: boolean; licenseInsertAt?: number };

class FakeDatabase {
  public queryLog: string[] = [];
  public commits = 0;
  public rollbacks = 0;

  constructor(public state: State, private readonly faults: Faults = {}) {}

  getConnection = async () => new FakeConnection(this, this.faults);
}

class FakeConnection {
  private working!: State;
  private licenseInsertCount = 0;

  constructor(private readonly database: FakeDatabase, private readonly faults: Faults) {}

  async beginTransaction() {
    this.working = structuredClone(this.database.state);
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    this.database.queryLog.push(normalized);

    if (normalized.includes('FROM orders')) {
      return [this.working.order ? [structuredClone(this.working.order)] : []];
    }
    if (normalized.includes('FROM payments')) {
      const transactionId = params[0];
      return [this.working.payments
        .filter(payment => payment.gateway === 'vietqr' && payment.transaction_id === transactionId)
        .map(payment => ({ id: payment.id, order_id: payment.order_id }))];
    }
    if (normalized.includes('FROM order_items')) {
      return [structuredClone(this.working.items)];
    }
    if (normalized.includes('FROM licenses')) {
      return [this.working.licenses
        .filter(license => license.order_id === params[0])
        .map(license => ({ id: license.id }))];
    }
    if (normalized.startsWith('INSERT INTO payments')) {
      if (this.faults.paymentInsert) throw new Error('PAYMENT_INSERT_FAILED');
      this.working.payments.push({
        id: this.working.payments.length + 1,
        order_id: params[0],
        transaction_id: params[1],
        gateway: 'vietqr',
        amount: params[2],
      });
      return [{ insertId: this.working.payments.length }];
    }
    if (normalized.startsWith('INSERT INTO licenses')) {
      this.licenseInsertCount += 1;
      if (this.faults.licenseInsertAt === this.licenseInsertCount) throw new Error('LICENSE_INSERT_FAILED');
      this.working.licenses.push({
        id: this.working.licenses.length + 1,
        license_key: params[0],
        order_id: params[1],
        theme_id: params[2],
        user_id: params[3],
        license_type: 'regular',
      });
      return [{ insertId: this.working.licenses.length }];
    }
    if (normalized.startsWith('UPDATE orders')) {
      const orderId = params[0];
      if (this.working.order?.id === orderId
        && this.working.order.payment_status === 'pending'
        && this.working.order.order_status === 'processing') {
        this.working.order.payment_status = 'paid';
        this.working.order.order_status = 'completed';
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    throw new Error('Unexpected query: ' + normalized);
  }

  async commit() {
    this.database.state = structuredClone(this.working);
    this.database.commits += 1;
  }

  async rollback() {
    this.database.rollbacks += 1;
  }

  release() {}
}

function state(overrides: Partial<State> = {}): State {
  return {
    order: {
      id: 71,
      order_number: 'OD-20261012-A1B2C3',
      user_id: null,
      total_amount: 1198000,
      currency: 'VND',
      payment_method: 'vietqr',
      payment_status: 'pending',
      order_status: 'processing',
    },
    items: [
      { id: 1, theme_id: 1, license_type: 'regular' },
      { id: 2, theme_id: 2, license_type: 'regular' },
    ],
    payments: [],
    licenses: [],
    ...overrides,
  };
}

const input = (overrides: Record<string, unknown> = {}) => ({
  orderNumber: 'OD-20261012-A1B2C3',
  transactionId: 'sepay-tx-71',
  paidAmount: 1198000,
  accountNumber: '123456789',
  transactionDate: '2026-10-12 10:00:00',
  ...overrides,
});

const originalGetConnection = dbPool.getConnection;
ENV.PAYMENTS.VIETQR_BANK_ACCOUNT = '123456789';

async function withDatabase(database: FakeDatabase, fn: () => Promise<void>) {
  (dbPool as any).getConnection = database.getConnection;
  try {
    await fn();
  } finally {
    (dbPool as any).getConnection = originalGetConnection;
  }
}

await run('valid webhook commits payment, every license, then paid/completed together', async () => {
  const database = new FakeDatabase(state());
  await withDatabase(database, async () => {
    const result = await PaymentFulfillmentService.fulfillVietQr(input());
    expect(result.status === 'fulfilled' && result.licenseCount === 2, 'must fulfill all order items');
    expect(database.commits === 1 && database.rollbacks === 0, 'must commit one transaction');
    expect(database.state.payments.length === 1 && database.state.licenses.length === 2, 'must persist one payment and two licenses');
    expect(database.state.order?.payment_status === 'paid' && database.state.order?.order_status === 'completed', 'must update final order state');
    expect(database.queryLog.some(query => query.includes('FROM orders') && query.includes('FOR UPDATE')), 'must lock the order row');
  });
});

await run('replayed webhook and simulated concurrent second delivery do not duplicate payment or licenses', async () => {
  const database = new FakeDatabase(state());
  await withDatabase(database, async () => {
    const first = await PaymentFulfillmentService.fulfillVietQr(input());
    const second = await PaymentFulfillmentService.fulfillVietQr(input());
    expect(first.status === 'fulfilled' && second.status === 'already_processed', 'second delivery must be idempotent');
    expect(database.state.payments.length === 1 && database.state.licenses.length === 2, 'must not duplicate fulfillment records');
    expect(database.queryLog.filter(query => query.includes('FROM orders') && query.includes('FOR UPDATE')).length === 2, 'each delivery must acquire the database row lock');
  });
});

await run('rejects wrong order, exact-amount mismatch, wrong currency, wrong payment method and account mismatch', async () => {
  const notFound = new FakeDatabase(state({ order: null }));
  await withDatabase(notFound, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).code === 'ORDER_NOT_FOUND', 'unknown order must be rejected');
  });

  const wrongAmount = new FakeDatabase(state());
  await withDatabase(wrongAmount, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input({ paidAmount: 1198001 }))).code === 'PAYMENT_MISMATCH', 'overpayment needs explicit policy and must be rejected');
  });

  const wrongCurrency = new FakeDatabase(state({ order: { ...state().order, currency: 'USD' } }));
  await withDatabase(wrongCurrency, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).code === 'ORDER_NOT_ELIGIBLE', 'USD order must not settle through SePAY');
  });

  const wrongMethod = new FakeDatabase(state({ order: { ...state().order, payment_method: 'stripe' } }));
  await withDatabase(wrongMethod, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).code === 'ORDER_NOT_ELIGIBLE', 'non-VietQR order must be rejected');
  });

  const wrongAccount = new FakeDatabase(state());
  await withDatabase(wrongAccount, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input({ accountNumber: '999999999' }))).code === 'PAYMENT_MISMATCH', 'wrong receiving account must be rejected');
  });
});

await run('existing paid order or transaction id is idempotent and never grants another license', async () => {
  const paid = new FakeDatabase(state({ order: { ...state().order, payment_status: 'paid', order_status: 'completed' } }));
  await withDatabase(paid, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).status === 'already_processed', 'paid order must not be fulfilled again');
    expect(paid.state.payments.length === 0 && paid.state.licenses.length === 0, 'must not write a second fulfillment');
  });

  const duplicateTx = new FakeDatabase(state({ payments: [{ id: 8, order_id: 99, gateway: 'vietqr', transaction_id: 'sepay-tx-71' }] }));
  await withDatabase(duplicateTx, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).code === 'DUPLICATE_TRANSACTION', 'transaction used by another order must be rejected');
  });

  const partialLegacy = new FakeDatabase(state({ licenses: [{ id: 5, order_id: 71, theme_id: 1, license_type: 'regular' }] }));
  await withDatabase(partialLegacy, async () => {
    expect((await PaymentFulfillmentService.fulfillVietQr(input())).code === 'ORDER_NOT_ELIGIBLE', 'legacy partial fulfillment must not be guessed or duplicated');
  });
});

await run('payment or any license write failure rolls back and a retry can settle once', async () => {
  const paymentFailure = new FakeDatabase(state(), { paymentInsert: true });
  await withDatabase(paymentFailure, async () => {
    await PaymentFulfillmentService.fulfillVietQr(input()).then(
      () => { throw new Error('payment insert failure must throw'); },
      () => undefined
    );
    expect(paymentFailure.rollbacks === 1 && paymentFailure.state.payments.length === 0, 'failed payment write must roll back');
  });

  const licenseFailure = new FakeDatabase(state(), { licenseInsertAt: 2 });
  await withDatabase(licenseFailure, async () => {
    await PaymentFulfillmentService.fulfillVietQr(input()).then(
      () => { throw new Error('license insert failure must throw'); },
      () => undefined
    );
    expect(licenseFailure.rollbacks === 1, 'license failure must roll back');
    expect(licenseFailure.state.payments.length === 0 && licenseFailure.state.licenses.length === 0, 'rollback must leave no partial payment or license');
  });

  const retry = new FakeDatabase(state());
  await withDatabase(retry, async () => {
    const result = await PaymentFulfillmentService.fulfillVietQr(input());
    expect(result.status === 'fulfilled' && retry.state.payments.length === 1 && retry.state.licenses.length === 2, 'retry after rollback must settle exactly once');
  });
});

await run('database unavailability throws instead of falling back to in-memory fulfillment', async () => {
  (dbPool as any).getConnection = async () => { throw new Error('DB_UNAVAILABLE'); };
  try {
    await PaymentFulfillmentService.fulfillVietQr(input()).then(
      () => { throw new Error('database failure must not fulfill'); },
      () => undefined
    );
  } finally {
    (dbPool as any).getConnection = originalGetConnection;
  }
});

const failures = results.filter(result => !result.passed);
console.log('Payment fulfillment tests: ' + (results.length - failures.length) + '/' + results.length + ' passed');
if (failures.length) process.exitCode = 1;
