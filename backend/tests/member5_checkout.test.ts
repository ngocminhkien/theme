import { OrderController } from '../src/controllers/order.controller.js';
import { OrderModel, type Order } from '../src/models/order.model.js';
import { ThemeModel } from '../src/models/theme.model.js';
import { ENV } from '../src/config/env.js';

interface Result { statusCode: number; body: any }
const results: Array<{ name: string; passed: boolean; details?: string }> = [];

function response(): { res: any; result: () => Result } {
  let result: Result = { statusCode: 0, body: null };
  return {
    res: { status(code: number) { result.statusCode = code; return this; }, json(body: any) { result.body = body; return this; } },
    result: () => result,
  };
}
function request(body: unknown) { return { body, ip: '127.0.0.1', headers: {} } as any; }
async function run(name: string, fn: () => Promise<void>) {
  try { await fn(); results.push({ name, passed: true }); console.log('  PASS ' + name); }
  catch (error) { const details = error instanceof Error ? error.message : String(error); results.push({ name, passed: false, details }); console.error('  FAIL ' + name + ': ' + details); }
}
function expect(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const originalThemeLookup = ThemeModel.findBySlug;
const originalFindKey = OrderModel.findByCheckoutKey;
const originalCreate = OrderModel.createWithItems;

ENV.PAYMENTS.VIETQR_BANK_BIN = '970422';
ENV.PAYMENTS.VIETQR_BANK_ACCOUNT = '123456789';
ENV.PAYMENTS.VIETQR_ACCOUNT_NAME = 'THEME STORE';
ENV.PAYMENTS.SEPAY_API_KEY = 'test-sepay-key';

const payload = (overrides: Record<string, unknown> = {}) => ({
  customer_name: 'Nguyễn Văn An', customer_email: 'an@example.com', customer_phone: null,
  total_amount: 599000, currency: 'VND', payment_method: 'vietqr',
  idempotency_key: '1f3ef5b0-2446-4afe-aafb-002bd398ce71',
  items: [{ theme_id: 1, theme_slug: 'woodmart', license_type: 'regular' }],
  ...overrides,
});

let stored: (Order & { fingerprint: string }) | null = null;
const writes: any[] = [];
(ThemeModel as any).findBySlug = async (slug: string) => slug === 'woodmart'
  ? { id: 1, slug, price_vnd: '599000', price_usd: '29', status: 'published' } : null;
(OrderModel as any).findByCheckoutKey = async () => stored;
(OrderModel as any).createWithItems = async (data: any) => {
  writes.push(data);
  stored = {
    id: 41, order_number: data.order_number, customer_name: data.customer_name, customer_email: data.customer_email,
    customer_phone: data.customer_phone, total_amount: data.total_amount, currency: data.currency,
    payment_method: data.payment_method, payment_status: 'pending', order_status: 'processing',
    created_at: new Date(), fingerprint: data.checkout.fingerprint, items: data.items,
  };
  return { orderId: 41, orderNumber: data.order_number };
};

await run('valid checkout saves complete server-priced Regular items', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload()), res);
  const reply = result();
  expect(reply.statusCode === 201 && reply.body.success, 'must create a pending order');
  expect(writes.length === 1, 'must write exactly one order');
  expect(writes[0].items.length === 1 && writes[0].items[0].unit_price === 599000, 'must persist server price and item');
  expect(writes[0].items[0].license_type === 'regular', 'must persist Regular only');
  expect(reply.body.data.vietQrUrl.includes('addInfo=' + reply.body.data.orderNumber), 'must return server QR tied to order');
});

await run('client amount mismatch does not write an order', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload({ total_amount: 1 })), res);
  expect(result().statusCode === 409 && result().body.error === 'PRICE_CHANGED', 'must reject stale/tampered agreement price');
  expect(writes.length === 0, 'must not persist rejected order');
});

await run('empty cart and non-Regular licenses are rejected by the API schema', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload({ items: [] })), res);
  expect(result().statusCode === 400 && result().body.error === 'VALIDATION_ERROR', 'empty cart must be invalid');
  const second = response();
  await OrderController.checkout(request(payload({ items: [{ theme_id: 1, theme_slug: 'woodmart', license_type: 'agency' }] })), second.res);
  expect(second.result().statusCode === 400, 'agency must be unavailable');
});

await run('a matching idempotency key returns the original order without another write', async () => {
  writes.length = 0;
  stored = {
    id: 41, order_number: 'OD-20261012-A1B2C3', customer_name: 'Nguyễn Văn An', customer_email: 'an@example.com',
    customer_phone: null, total_amount: 599000, currency: 'VND', payment_method: 'vietqr',
    payment_status: 'pending', order_status: 'processing', created_at: new Date(),
    fingerprint: '', items: [{ theme_id: 1, license_type: 'regular', unit_price: 599000 }],
  };
  // First request establishes its normalized fingerprint in the stored record.
  const initial = response();
  stored = null;
  await OrderController.checkout(request(payload()), initial.res);
  const retry = response();
  await OrderController.checkout(request(payload()), retry.res);
  expect(retry.result().statusCode === 200 && retry.result().body.data.orderNumber === initial.result().body.data.orderNumber, 'must restore order');
  expect(writes.length === 1, 'retry must not create a second order');
});

await run('USD/Stripe is not silently replaced by a demo QR order', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload({ currency: 'USD', payment_method: 'stripe', total_amount: 29 })), res);
  expect(result().statusCode === 503 && result().body.error === 'PAYMENT_UNAVAILABLE', 'must report unavailable gateway');
  expect(writes.length === 0, 'must not create a fallback order');
});

(ThemeModel as any).findBySlug = originalThemeLookup;
(OrderModel as any).findByCheckoutKey = originalFindKey;
(OrderModel as any).createWithItems = originalCreate;

const failures = results.filter(result => !result.passed);
console.log('Checkout controller tests: ' + (results.length - failures.length) + '/' + results.length + ' passed');
if (failures.length) process.exitCode = 1;

