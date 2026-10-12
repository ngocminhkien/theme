import { OrderController } from '../src/controllers/order.controller.js';
import { PaymentController } from '../src/controllers/payment.controller.js';
import { OrderModel, type Order } from '../src/models/order.model.js';
import { ThemeModel } from '../src/models/theme.model.js';
import { PaymentModel } from '../src/models/payment.model.js';
import { LicenseModel } from '../src/models/license.model.js';
import { SePayService } from '../src/services/sepay.service.js';
import { PaymentFulfillmentService } from '../src/services/payment-fulfillment.service.js';
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
function request(body: unknown, user: any = { id: 7, email: 'an@example.com', role: 'customer' }) {
  return { body, ip: '127.0.0.1', headers: {}, ...(user ? { user } : {}) } as any;
}
async function run(name: string, fn: () => Promise<void>) {
  try { await fn(); results.push({ name, passed: true }); console.log('  PASS ' + name); }
  catch (error) { const details = error instanceof Error ? error.message : String(error); results.push({ name, passed: false, details }); console.error('  FAIL ' + name + ': ' + details); }
}
function expect(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const originalThemeLookup = ThemeModel.findBySlug;
const originalFindKey = OrderModel.findByCheckoutKey;
const originalCreate = OrderModel.createWithItems;
const originalFindOrder = OrderModel.findByOrderNumber;
const originalMarkPaid = OrderModel.markAsPaid;
const originalFindPayment = PaymentModel.findByTransaction;
const originalCreatePayment = PaymentModel.create;
const originalCreateLicense = LicenseModel.create;
const originalVerifyWebhook = SePayService.verifyWebhook;
const originalFulfillVietQr = PaymentFulfillmentService.fulfillVietQr;

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

await run('unauthenticated checkout is rejected before pricing or order creation', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload(), null), res);
  expect(result().statusCode === 401 && result().body.error === 'UNAUTHORIZED', 'must require an authenticated owner');
  expect(writes.length === 0, 'must not create an anonymous order');
});

await run('valid checkout saves complete server-priced Regular items', async () => {
  stored = null; writes.length = 0;
  const { res, result } = response();
  await OrderController.checkout(request(payload()), res);
  const reply = result();
  expect(reply.statusCode === 201 && reply.body.success, 'must create a pending order');
  expect(writes.length === 1, 'must write exactly one order');
  expect(writes[0].user_id === 7, 'must attach the authenticated owner instead of a client user id');
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

await run('unknown or mismatched catalog identity does not write an order', async () => {
  stored = null; writes.length = 0;
  const unknown = response();
  await OrderController.checkout(request(payload({ items: [{ theme_id: 1, theme_slug: 'missing-theme', license_type: 'regular' }] })), unknown.res);
  expect(unknown.result().statusCode === 409 && unknown.result().body.error === 'CATALOG_MISMATCH', 'unknown theme must be rejected');
  const mismatched = response();
  await OrderController.checkout(request(payload({ items: [{ theme_id: 2, theme_slug: 'woodmart', license_type: 'regular' }] })), mismatched.res);
  expect(mismatched.result().statusCode === 409 && mismatched.result().body.error === 'CATALOG_MISMATCH', 'theme ID and slug must match');
  expect(writes.length === 0, 'must not persist rejected catalog items');
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

await run('missing VietQR configuration returns a clear error without creating an order', async () => {
  stored = null; writes.length = 0;
  const originalBankAccount = ENV.PAYMENTS.VIETQR_BANK_ACCOUNT;
  try {
    ENV.PAYMENTS.VIETQR_BANK_ACCOUNT = '';
    const { res, result } = response();
    await OrderController.checkout(request(payload()), res);
    expect(result().statusCode === 503 && result().body.error === 'PAYMENT_NOT_CONFIGURED', 'must report missing QR configuration');
    expect(writes.length === 0, 'must not create a pending order with no real QR');
  } finally {
    ENV.PAYMENTS.VIETQR_BANK_ACCOUNT = originalBankAccount;
  }
});

await run('a verified SePAY webhook delegates only to the transactional fulfillment service', async () => {
  let received: any;
  (SePayService as any).verifyWebhook = () => true;
  (PaymentFulfillmentService as any).fulfillVietQr = async (input: any) => {
    received = input;
    return { status: 'fulfilled', code: 'FULFILLED', orderNumber: input.orderNumber, licenseCount: 2 };
  };
  const { res, result } = response();
  await PaymentController.handleSepayWebhook(request({
    id: 'sepay-verified-71', gateway: 'vietqr', transferAmount: 1198000,
    content: 'Thanh toan OD-20261012-A1B2C3',
  }), res);
  expect(result().statusCode === 200 && result().body.success, 'verified webhook must succeed');
  expect(received?.orderNumber === 'OD-20261012-A1B2C3', 'must pass the parsed order number');
  expect(received?.transactionId === 'sepay-verified-71' && received?.paidAmount === 1198000, 'must pass the provider transaction and VND amount');
});

await run('the SePAY endpoint rejects alternate gateways and non-VND webhook payloads before fulfillment', async () => {
  (SePayService as any).verifyWebhook = () => true;
  const alternateGateway = response();
  await PaymentController.handleSepayWebhook(request({
    id: 'sepay-other-gateway', gateway: 'stripe', transferAmount: 1198000,
    content: 'Thanh toan OD-20261012-A1B2C3',
  }), alternateGateway.res);
  expect(alternateGateway.result().statusCode === 200 && alternateGateway.result().body.success, 'alternate gateway must be acknowledged without fulfillment');

  const foreignCurrency = response();
  await PaymentController.handleSepayWebhook(request({
    id: 'sepay-usd', gateway: 'Vietcombank', currency: 'USD', transferAmount: 1198000,
    content: 'Thanh toan OD-20261012-A1B2C3',
  }), foreignCurrency.res);
  expect(foreignCurrency.result().statusCode === 400, 'foreign currency must fail schema validation');

  let called = false;
  (PaymentFulfillmentService as any).fulfillVietQr = async () => { called = true; throw new Error('must not be called'); };
  const unknownOrderCode = response();
  await PaymentController.handleSepayWebhook(request({
    id: 'sepay-no-order', gateway: 'Vietcombank', transferAmount: 1198000,
    content: 'Thanh toan khong co ma don hop le',
  }), unknownOrderCode.res);
  expect(unknownOrderCode.result().statusCode === 200 && unknownOrderCode.result().body.success && !called, 'invalid order code must be acknowledged without fulfillment');
});

await run('SePAY API-key authentication is fail-closed and requires the documented header prefix', async () => {
  (SePayService as any).verifyWebhook = originalVerifyWebhook;
  ENV.PAYMENTS.SEPAY_API_KEY = 'test-sepay-key';
  expect(SePayService.verifyWebhook('Apikey test-sepay-key'), 'documented API-key header must pass');
  expect(!SePayService.verifyWebhook('test-sepay-key'), 'unprefixed authorization must fail');
  expect(!SePayService.verifyWebhook(undefined), 'missing authorization must fail');
  ENV.PAYMENTS.SEPAY_API_KEY = '';
  expect(!SePayService.verifyWebhook('Apikey anything'), 'unconfigured API key must fail in every environment');
  ENV.PAYMENTS.SEPAY_API_KEY = 'test-sepay-key';
});

(ThemeModel as any).findBySlug = originalThemeLookup;
(OrderModel as any).findByCheckoutKey = originalFindKey;
(OrderModel as any).createWithItems = originalCreate;
(OrderModel as any).findByOrderNumber = originalFindOrder;
(OrderModel as any).markAsPaid = originalMarkPaid;
(PaymentModel as any).findByTransaction = originalFindPayment;
(PaymentModel as any).create = originalCreatePayment;
(LicenseModel as any).create = originalCreateLicense;
(SePayService as any).verifyWebhook = originalVerifyWebhook;
(PaymentFulfillmentService as any).fulfillVietQr = originalFulfillVietQr;

const failures = results.filter(result => !result.passed);
console.log('Checkout controller tests: ' + (results.length - failures.length) + '/' + results.length + ' passed');
if (failures.length) process.exitCode = 1;

