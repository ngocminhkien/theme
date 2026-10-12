import { OrderController } from '../src/controllers/order.controller.js';
import { LicenseController } from '../src/controllers/license.controller.js';
import { OrderModel, type Order } from '../src/models/order.model.js';
import { LicenseModel } from '../src/models/license.model.js';

interface Result { statusCode: number; body: any }
const results: Array<{ name: string; passed: boolean; details?: string }> = [];

function response(): { res: any; result: () => Result } {
  let value: Result = { statusCode: 0, body: null };
  return {
    res: { status(code: number) { value.statusCode = code; return this; }, json(body: any) { value.body = body; return this; } },
    result: () => value,
  };
}
function request(params: Record<string, string> = {}, user?: any) {
  return { params, query: {}, headers: {}, ...(user ? { user } : {}) } as any;
}
function owner(id = 7) { return { id, email: 'owner@example.com', role: 'customer' }; }
async function run(name: string, fn: () => Promise<void>) {
  try { await fn(); results.push({ name, passed: true }); console.log('  PASS ' + name); }
  catch (error) { const details = error instanceof Error ? error.message : String(error); results.push({ name, passed: false, details }); console.error('  FAIL ' + name + ': ' + details); }
}
function expect(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const originalFindOrder = OrderModel.findByOrderNumber;
const originalFindOrders = OrderModel.findByUserId;
const originalFindOrderLicenses = LicenseModel.findByOrderId;
const originalFindUserLicenses = LicenseModel.findByUserId;
const originalFindKey = LicenseModel.findByKey;

const paidOrder: Order = {
  id: 11, order_number: 'OD-20261012-A1B2C3', user_id: 7,
  customer_name: 'Owner', customer_email: 'owner@example.com', total_amount: 599000,
  currency: 'VND', payment_method: 'vietqr', payment_status: 'paid', order_status: 'completed',
  created_at: new Date('2026-10-12T00:00:00.000Z'),
  items: [{ theme_id: 1, theme_name: 'WoodMart', license_type: 'regular', unit_price: 599000 }],
};

await run('receipt requires an authenticated account', async () => {
  const { res, result } = response();
  await OrderController.getReceipt(request({ orderNumber: paidOrder.order_number }), res);
  expect(result().statusCode === 401, 'receipt must reject an unauthenticated request');
});

await run('receipt hides orders that belong to another account', async () => {
  (OrderModel as any).findByOrderNumber = async () => paidOrder;
  let licenseReads = 0;
  (LicenseModel as any).findByOrderId = async () => { licenseReads += 1; return []; };
  const { res, result } = response();
  await OrderController.getReceipt(request({ orderNumber: paidOrder.order_number }, owner(8)), res);
  expect(result().statusCode === 404, 'foreign order must be indistinguishable from absent order');
  expect(licenseReads === 0, 'must not load licenses for a foreign order');
});

await run('pending receipt returns order items but never licenses', async () => {
  const pending = { ...paidOrder, payment_status: 'pending' as const, order_status: 'processing' as const };
  (OrderModel as any).findByOrderNumber = async () => pending;
  let licenseReads = 0;
  (LicenseModel as any).findByOrderId = async () => { licenseReads += 1; return [{ license_key: 'must-not-leak' }]; };
  const { res, result } = response();
  await OrderController.getReceipt(request({ orderNumber: pending.order_number }, owner()), res);
  expect(result().statusCode === 200 && result().body.data.licenses.length === 0, 'pending receipt must not expose licenses');
  expect(licenseReads === 0, 'pending receipt must not query licenses');
});

await run('paid owner receives its receipt and licenses', async () => {
  (OrderModel as any).findByOrderNumber = async () => paidOrder;
  (LicenseModel as any).findByOrderId = async () => [{ license_key: 'LIC-OWNER-ONLY', license_type: 'regular', max_domains: 1, theme_name: 'WoodMart' }];
  const { res, result } = response();
  await OrderController.getReceipt(request({ orderNumber: paidOrder.order_number }, owner()), res);
  expect(result().statusCode === 200 && result().body.data.licenses[0].license_key === 'LIC-OWNER-ONLY', 'paid receipt must include its license');
});

await run('order history and licenses derive user identity only from JWT middleware', async () => {
  let historyUserId: number | undefined;
  let licensesUserId: number | undefined;
  (OrderModel as any).findByUserId = async (userId: number) => { historyUserId = userId; return [paidOrder]; };
  (LicenseModel as any).findByUserId = async (userId: number) => { licensesUserId = userId; return [{ license_key: 'LIC-OWNER-ONLY', user_id: userId, status: 'active' }]; };
  const history = response();
  await OrderController.getMyOrders(request({}, owner()), history.res);
  const licenses = response();
  await LicenseController.getMyLicenses(request({}, owner()), licenses.res);
  expect(history.result().statusCode === 200 && historyUserId === 7, 'history must use authenticated user id');
  expect(licenses.result().statusCode === 200 && licensesUserId === 7, 'licenses must use authenticated user id');
});

await run('download refuses unauthenticated or foreign licenses and never redirects to a placeholder asset', async () => {
  (LicenseModel as any).findByKey = async () => ({ license_key: 'LIC-OWNER-ONLY', user_id: 7, status: 'active' });
  const anonymous = response();
  await LicenseController.downloadForOwner(request({ licenseKey: 'LIC-OWNER-ONLY' }), anonymous.res);
  expect(anonymous.result().statusCode === 401, 'download must require authentication');
  const foreign = response();
  await LicenseController.downloadForOwner(request({ licenseKey: 'LIC-OWNER-ONLY' }, owner(8)), foreign.res);
  expect(foreign.result().statusCode === 404, 'foreign account must not see the license');
  const valid = response();
  await LicenseController.downloadForOwner(request({ licenseKey: 'LIC-OWNER-ONLY' }, owner()), valid.res);
  expect(valid.result().statusCode === 503 && valid.result().body.error === 'DOWNLOAD_NOT_CONFIGURED', 'configured storage is required before issuing a download');
});

(OrderModel as any).findByOrderNumber = originalFindOrder;
(OrderModel as any).findByUserId = originalFindOrders;
(LicenseModel as any).findByOrderId = originalFindOrderLicenses;
(LicenseModel as any).findByUserId = originalFindUserLicenses;
(LicenseModel as any).findByKey = originalFindKey;

const failures = results.filter(result => !result.passed);
console.log('Portal ownership tests: ' + (results.length - failures.length) + '/' + results.length + ' passed');
if (failures.length) process.exitCode = 1;
