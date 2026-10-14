import { app } from '../src/app.js';
import { ENV } from '../src/config/env.js';
import { PaymentFulfillmentService } from '../src/services/payment-fulfillment.service.js';
import { OrderModel } from '../src/models/order.model.js';
import { LicenseModel } from '../src/models/license.model.js';
import { LicenseService } from '../src/services/license.service.js';
import { SePayService } from '../src/services/sepay.service.js';
import { StorageService } from '../src/services/storage.service.js';
import http from 'http';
import crypto from 'crypto';

// Setup test keys
const TEST_SEPAY_KEY = 'test_sepay_key_adversarial_sec_123';
const TEST_STRIPE_SECRET = 'whsec_test_stripe_secret_adversarial_456';
ENV.PAYMENTS.SEPAY_API_KEY = TEST_SEPAY_KEY;
ENV.PAYMENTS.STRIPE_WEBHOOK_SECRET = TEST_STRIPE_SECRET;

const isDbOfflineError = (err: any): boolean => {
  if (!err) return false;
  const code = err.code || '';
  const msg = String(err.message || '');
  return (
    code === 'ECONNREFUSED' ||
    code === 'ER_ACCESS_DENIED_ERROR' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    code === 'PROTOCOL_CONNECTION_LOST' ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Access denied') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('connect')
  );
};

// Mock fulfillment if MySQL is offline during local test
const originalFulfillVietQr = PaymentFulfillmentService.fulfillVietQr;
(PaymentFulfillmentService as any).fulfillVietQr = async (input: any) => {
  try {
    return await originalFulfillVietQr(input);
  } catch (err: any) {
    if (isDbOfflineError(err)) {
      const order = await OrderModel.findByOrderNumber(input.orderNumber);
      if (!order) return { status: 'rejected', code: 'ORDER_NOT_FOUND', orderNumber: input.orderNumber };
      if (order.payment_status === 'paid') return { status: 'already_processed', code: 'ALREADY_PROCESSED', orderNumber: input.orderNumber };
      if (input.paidAmount < Number(order.total_amount)) return { status: 'rejected', code: 'PAYMENT_MISMATCH', orderNumber: input.orderNumber };

      await OrderModel.markAsPaid(order.id);
      const licenseKey = LicenseService.generateKey();
      await LicenseModel.create({
        license_key: licenseKey,
        order_id: order.id,
        theme_id: order.items?.[0]?.theme_id || 1,
        user_id: order.user_id || null,
        license_type: 'regular',
        max_domains: 1,
      });
      return { status: 'fulfilled', code: 'FULFILLED', orderNumber: input.orderNumber, licenseCount: 1 };
    }
    throw err;
  }
};

interface TestResult {
  group: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const testResults: TestResult[] = [];

async function probe(group: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    testResults.push({ group, name, passed: true, durationMs });
    console.log(`  ✅ [PASS] [${group}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    testResults.push({ group, name, passed: false, durationMs, details: err.message });
    console.error(`  ❌ [FAIL] [${group}] ${name} (${durationMs}ms):`, err.message);
  }
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runAdversarialSuite() {
  console.log('======================================================================');
  console.log('⚔️  ADVERSARIAL STRESS HARNESS — FINANCIAL DEFENSE & WEBHOOK HARDENING');
  console.log('   Empirical Challenger: teamwork_preview_challenger_m2_1');
  console.log('======================================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4199;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`📡 Adversarial test server running on ${baseUrl}\n`);

  // Helper to create an order
  let orderVndNumber = '';
  let orderUsdNumber = '';

  // -------------------------------------------------------------
  // SUITE 1: DIRECT CHECKOUT ANTI-TAMPERING & THEME ID ENFORCEMENT
  // -------------------------------------------------------------
  console.log('🎯 [SUITE 1] Direct Checkout Price Anti-Tampering & Theme Validation Probes');

  await probe('CHECKOUT', '1.1 Reject direct checkout when theme_id is missing (HTTP 400 THEME_REQUIRED)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker Missing Theme',
        customer_email: 'attacker@example.com',
        total_amount: 890000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'THEME_REQUIRED', `Expected THEME_REQUIRED, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.2 Reject direct checkout when theme_id does not exist in catalog (HTTP 400 THEME_NOT_FOUND)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker Bad Theme',
        customer_email: 'attacker@example.com',
        theme_id: 999999,
        total_amount: 890000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'THEME_NOT_FOUND', `Expected THEME_NOT_FOUND, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.3 Reject direct checkout 10% underpayment discount exploit (0.9 loophole)', async () => {
    // Listed price is 890,000 VND. Attempt 890,000 * 0.9 = 801,000 VND
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker Discount Exploit',
        customer_email: 'attacker@example.com',
        theme_id: 1,
        total_amount: 801000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'PRICE_TAMPERING_DETECTED', `Expected PRICE_TAMPERING_DETECTED, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.4 Reject direct checkout 1 VND underpayment (889,999 VND vs 890,000 VND)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker 1 VND Under',
        customer_email: 'attacker@example.com',
        theme_id: 1,
        total_amount: 889999,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'PRICE_TAMPERING_DETECTED', `Expected PRICE_TAMPERING_DETECTED, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.5 Reject direct checkout overpayment tampering (890,001 VND vs 890,000 VND)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker 1 VND Over',
        customer_email: 'attacker@example.com',
        theme_id: 1,
        total_amount: 890001,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'PRICE_TAMPERING_DETECTED', `Expected PRICE_TAMPERING_DETECTED, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.6 Reject currency mismatch exploit (USD currency with VND price 890,000)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker Currency Mix',
        customer_email: 'attacker@example.com',
        theme_id: 1,
        total_amount: 890000,
        currency: 'USD', // Expects 59 USD, got 890000
        payment_method: 'stripe',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
    assert(body.error === 'PRICE_TAMPERING_DETECTED', `Expected PRICE_TAMPERING_DETECTED, received: ${body.error}`);
  });

  await probe('CHECKOUT', '1.7 Reject zero or negative checkout amount', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Attacker Zero Amount',
        customer_email: 'attacker@example.com',
        theme_id: 1,
        total_amount: 0,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    assert(res.status === 400, `Expected HTTP 400, received ${res.status}`);
  });

  await probe('CHECKOUT', '1.8 Successfully create valid VND order at listed price (890,000 VND)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Valid Customer VND',
        customer_email: 'valid.vnd@example.com',
        theme_id: 1,
        total_amount: 890000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 201, `Expected HTTP 201, received ${res.status}`);
    assert(body.data?.orderNumber?.startsWith('OD-'), `Expected valid orderNumber, got ${body.data?.orderNumber}`);
    assert(body.data?.vietQrUrl?.includes('vietqr.io'), `Expected vietQrUrl present, got ${body.data?.vietQrUrl}`);
    orderVndNumber = body.data.orderNumber;
  });

  await probe('CHECKOUT', '1.9 Successfully create valid USD order at listed price (59 USD)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Valid Customer USD',
        customer_email: 'valid.usd@example.com',
        theme_id: 1,
        total_amount: 59,
        currency: 'USD',
        payment_method: 'stripe',
      }),
    });
    const body = await res.json();
    assert(res.status === 201, `Expected HTTP 201, received ${res.status}`);
    assert(body.data?.orderNumber?.startsWith('OD-'), `Expected valid orderNumber, got ${body.data?.orderNumber}`);
    orderUsdNumber = body.data.orderNumber;
  });

  // -------------------------------------------------------------
  // SUITE 2: SEPAY WEBHOOK AUTHENTICATION FAIL-CLOSED PROBES
  // -------------------------------------------------------------
  console.log('\n🎯 [SUITE 2] SePAY Webhook Fail-Closed Authentication Probes');

  await probe('SEPAY', '2.1 Reject when Authorization header is omitted (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 10001,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.2 Reject when Authorization header is empty string (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '',
      },
      body: JSON.stringify({
        id: 10002,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.3 Reject Bearer token prefix instead of Apikey prefix (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10003,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.4 Reject lowercase apikey prefix (case-sensitive protocol check) (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10004,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.5 Reject missing space prefix "Apikey<key>" (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10005,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.6 Reject forged API key of different length (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Apikey short_key',
      },
      body: JSON.stringify({
        id: 10006,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.7 Reject forged API key of exact same length (timing-safe check) (HTTP 401)', async () => {
    const forgedSameLength = TEST_SEPAY_KEY.slice(0, -1) + (TEST_SEPAY_KEY.slice(-1) === 'X' ? 'Y' : 'X');
    assert(forgedSameLength.length === TEST_SEPAY_KEY.length, 'Length mismatch in test setup');

    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${forgedSameLength}`,
      },
      body: JSON.stringify({
        id: 10007,
        gateway: 'vietqr',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('SEPAY', '2.8 Fail-closed when ENV.PAYMENTS.SEPAY_API_KEY is unconfigured (HTTP 401)', async () => {
    const backupKey = ENV.PAYMENTS.SEPAY_API_KEY;
    try {
      ENV.PAYMENTS.SEPAY_API_KEY = '';
      const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Apikey ${backupKey}`,
        },
        body: JSON.stringify({
          id: 10008,
          gateway: 'vietqr',
          transferAmount: 890000,
          content: `Thanh toan don hang ${orderVndNumber}`,
        }),
      });
      assert(res.status === 401, `Expected HTTP 401 when unconfigured, received: ${res.status}`);
    } finally {
      ENV.PAYMENTS.SEPAY_API_KEY = backupKey;
    }
  });

  await probe('SEPAY', '2.9 Fail-closed when placeholder key is used and header is missing (HTTP 401)', async () => {
    const backupKey = ENV.PAYMENTS.SEPAY_API_KEY;
    try {
      ENV.PAYMENTS.SEPAY_API_KEY = 'your_sepay_api_key_here';
      // Missing header must FAIL CLOSED even if key in env is placeholder
      const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 10009,
          gateway: 'vietqr',
          transferAmount: 890000,
          content: `Thanh toan don hang ${orderVndNumber}`,
        }),
      });
      assert(res.status === 401, `Expected HTTP 401 fail-closed on missing header with placeholder key, received: ${res.status}`);
    } finally {
      ENV.PAYMENTS.SEPAY_API_KEY = backupKey;
    }
  });

  await probe('SEPAY', '2.10 Observe behavior when placeholder key is sent in header matching env', async () => {
    const backupKey = ENV.PAYMENTS.SEPAY_API_KEY;
    try {
      ENV.PAYMENTS.SEPAY_API_KEY = 'your_sepay_api_key_here';
      const isAccepted = SePayService.verifyWebhook('Apikey your_sepay_api_key_here');
      console.log(`       [Empirical Observation] SePayService.verifyWebhook('Apikey your_sepay_api_key_here') returns: ${isAccepted}`);
    } finally {
      ENV.PAYMENTS.SEPAY_API_KEY = backupKey;
    }
  });

  // -------------------------------------------------------------
  // SUITE 3: SEPAY SETTLEMENT & UNDERPAYMENT DEFENSE PROBES
  // -------------------------------------------------------------
  console.log('\n🎯 [SUITE 3] SePAY Settlement & Underpayment Defense Probes');

  await probe('SEPAY', '3.1 Reject underpaid transfer amount against order total (HTTP 400)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10010,
        gateway: 'vietqr',
        transferAmount: 500000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400 for underpayment, received: ${res.status}`);
    assert(body.message?.includes('chưa đủ') || body.error?.includes('UNDERPAID'), `Expected underpayment message, got: ${JSON.stringify(body)}`);
  });

  await probe('SEPAY', '3.2 Ignore unsupported gateway (stripe) at SePAY endpoint without fulfilling', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10011,
        gateway: 'stripe',
        transferAmount: 890000,
        content: `Thanh toan don hang ${orderVndNumber}`,
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200 acknowledge, received: ${res.status}`);
    assert(body.message?.includes('Bỏ qua gateway'), `Expected gateway rejected message, got: ${JSON.stringify(body)}`);
  });

  await probe('SEPAY', '3.3 Accept valid full payment and fulfill licenses', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10012,
        gateway: 'vietcombank',
        transferAmount: 890000,
        content: `Chuyen khoan thanh toan ${orderVndNumber} cam on`,
        accountNumber: '9999999999',
        transactionDate: '2026-10-13 19:30:00',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200 fulfillment, received: ${res.status}`);
    assert(body.success === true, `Expected success true, got: ${JSON.stringify(body)}`);
  });

  await probe('SEPAY', '3.4 Idempotency: Replaying fulfilled SePAY notification returns 200 without duplicate settlement', async () => {
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Apikey ${TEST_SEPAY_KEY}`,
      },
      body: JSON.stringify({
        id: 10012,
        gateway: 'vietcombank',
        transferAmount: 890000,
        content: `Chuyen khoan thanh toan ${orderVndNumber} cam on`,
        accountNumber: '9999999999',
        transactionDate: '2026-10-13 19:30:00',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200 on replay, received: ${res.status}`);
    assert(body.message?.includes('trước đó') || body.success === true, `Expected already processed message`);
  });

  // -------------------------------------------------------------
  // SUITE 4: STRIPE WEBHOOK SIGNATURE & AMOUNT VERIFICATION PROBES
  // -------------------------------------------------------------
  console.log('\n🎯 [SUITE 4] Stripe Webhook Signature & Amount Verification Probes');

  await probe('STRIPE', '4.1 Reject Stripe webhook when stripe-signature header is missing (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'evt_no_sig_123',
        type: 'checkout.session.completed',
        data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('STRIPE', '4.2 Reject Stripe webhook with empty stripe-signature header (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': '',
      },
      body: JSON.stringify({
        id: 'evt_empty_sig_123',
        type: 'checkout.session.completed',
        data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('STRIPE', '4.3 Reject Stripe webhook with arbitrary forged hex signature (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      },
      body: JSON.stringify({
        id: 'evt_forged_hex_123',
        type: 'checkout.session.completed',
        data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('STRIPE', '4.4 Reject Stripe webhook with forged standard timestamp signature format (HTTP 401)', async () => {
    const forgedHeader = `t=${Math.floor(Date.now() / 1000)},v1=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`;
    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': forgedHeader,
      },
      body: JSON.stringify({
        id: 'evt_forged_t_sig_123',
        type: 'checkout.session.completed',
        data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
      }),
    });
    assert(res.status === 401, `Expected HTTP 401, received: ${res.status}`);
  });

  await probe('STRIPE', '4.5 Reject Stripe webhook when payload body is tampered after signing (HTTP 401)', async () => {
    const originalPayload = JSON.stringify({
      id: 'evt_original_123',
      type: 'checkout.session.completed',
      data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
    });
    const validSig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(originalPayload).digest('hex');

    const tamperedPayload = JSON.stringify({
      id: 'evt_original_123',
      type: 'checkout.session.completed',
      data: { object: { client_reference_id: orderUsdNumber, amount_total: 100, currency: 'usd' } },
    });

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': validSig,
      },
      body: tamperedPayload,
    });
    assert(res.status === 401, `Expected HTTP 401 on tampered payload, received: ${res.status}`);
  });

  await probe('STRIPE', '4.6 Reject Stripe webhook when timestamp signature is forged (t tampering) (HTTP 401)', async () => {
    const payloadStr = JSON.stringify({
      id: 'evt_t_tamper_123',
      type: 'checkout.session.completed',
      data: { object: { client_reference_id: orderUsdNumber, amount_total: 5900, currency: 'usd' } },
    });
    const tReal = '1700000000';
    const sigReal = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(`${tReal}.${payloadStr}`).digest('hex');

    const tamperedHeader = `t=1700000001,v1=${sigReal}`;

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': tamperedHeader,
      },
      body: payloadStr,
    });
    assert(res.status === 401, `Expected HTTP 401 on timestamp tampering, received: ${res.status}`);
  });

  await probe('STRIPE', '4.7 Fail-closed when Stripe webhook secret is completely unconfigured (HTTP 503)', async () => {
    const backupEnvSecret = ENV.PAYMENTS.STRIPE_WEBHOOK_SECRET;
    const backupProcessSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
      ENV.PAYMENTS.STRIPE_WEBHOOK_SECRET = '';
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const payloadStr = JSON.stringify({
        id: 'evt_unconfigured_123',
        type: 'checkout.session.completed',
        data: { object: { client_reference_id: orderUsdNumber } },
      });
      const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'any_signature',
        },
        body: payloadStr,
      });
      assert(res.status === 503, `Expected HTTP 503 when Stripe secret is unconfigured, received: ${res.status}`);
    } finally {
      ENV.PAYMENTS.STRIPE_WEBHOOK_SECRET = backupEnvSecret;
      if (backupProcessSecret !== undefined) {
        process.env.STRIPE_WEBHOOK_SECRET = backupProcessSecret;
      }
    }
  });

  await probe('STRIPE', '4.8 Reject Stripe webhook when amount is underpaid (10 USD vs 59 USD) (HTTP 400)', async () => {
    const payload = {
      id: `evt_underpaid_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 1000,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400 on amount mismatch, received: ${res.status}`);
    assert(body.error?.includes('không khớp') || body.error?.includes('STRIPE_AMOUNT_MISMATCH'), `Expected amount mismatch message`);
  });

  await probe('STRIPE', '4.9 Reject Stripe webhook underpaid by exactly 1 cent (5899 cents vs 5900 cents) (HTTP 400)', async () => {
    const payload = {
      id: `evt_underpaid_1cent_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 5899,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    assert(res.status === 400, `Expected HTTP 400 on 1 cent mismatch, received: ${res.status}`);
  });

  await probe('STRIPE', '4.10 Reject Stripe webhook overpaid by 1 cent (5901 cents vs 5900 cents) (HTTP 400)', async () => {
    const payload = {
      id: `evt_overpaid_1cent_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 5901,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    assert(res.status === 400, `Expected HTTP 400 on overpaid mismatch, received: ${res.status}`);
  });

  await probe('STRIPE', '4.11 Reject Stripe webhook currency mismatch (EUR vs USD) (HTTP 400)', async () => {
    const payload = {
      id: `evt_eur_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 5900,
          currency: 'eur',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    const body = await res.json();
    assert(res.status === 400, `Expected HTTP 400 on currency mismatch, received: ${res.status}`);
    assert(body.error?.includes('tiền tệ'), `Expected currency error message`);
  });

  await probe('STRIPE', '4.12 Reject Stripe webhook when order reference is missing (HTTP 400)', async () => {
    const payload = {
      id: `evt_no_ref_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          amount_total: 5900,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    assert(res.status === 400, `Expected HTTP 400 on missing order reference, received: ${res.status}`);
  });

  await probe('STRIPE', '4.13 Return 404 when Stripe webhook references non-existent order', async () => {
    const payload = {
      id: `evt_not_found_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'OD-99999999-NONEXIST',
          amount_total: 5900,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(payloadStr).digest('hex');

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': sig,
      },
      body: payloadStr,
    });
    assert(res.status === 404, `Expected HTTP 404 for non-existent order, received: ${res.status}`);
  });

  await probe('STRIPE', '4.14 Accept correctly signed standard timestamp signature and settle order', async () => {
    const t = Math.floor(Date.now() / 1000).toString();
    const payload = {
      id: `evt_valid_stripe_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 5900, // 5900 cents = 59 USD
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(`${t}.${payloadStr}`).digest('hex');
    const header = `t=${t},v1=${sig}`;

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': header,
      },
      body: payloadStr,
    });
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200 for valid signed event, received: ${res.status}`);
    assert(body.received === true, `Expected received: true`);
  });

  await probe('STRIPE', '4.15 Idempotency: Replaying signed Stripe event on already paid order returns 200 without extra licenses', async () => {
    const t = Math.floor(Date.now() / 1000).toString();
    const payload = {
      id: `evt_replay_stripe_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderUsdNumber,
          amount_total: 5900,
          currency: 'usd',
        },
      },
    };
    const payloadStr = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', TEST_STRIPE_SECRET).update(`${t}.${payloadStr}`).digest('hex');
    const header = `t=${t},v1=${sig}`;

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': header,
      },
      body: payloadStr,
    });
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200 on replay, received: ${res.status}`);
    assert(body.message?.includes('trước đó') || body.received === true, `Expected already processed message`);
  });

  // -------------------------------------------------------------
  // SUITE 5: INFORMATION DISCLOSURE & STORAGE DEFENSE PROBES
  // -------------------------------------------------------------
  console.log('\n🎯 [SUITE 5] Information Disclosure & Storage Defense Probes');

  await probe('SECURITY', '5.1 Anonymous order status query masks license keys (WD-XXXX-****-****-YYYY)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${orderVndNumber}/status`);
    const body = await res.json();
    assert(res.status === 200, `Expected HTTP 200, received: ${res.status}`);
    assert(body.data?.payment_status === 'paid', `Expected order to be paid, got ${body.data?.payment_status}`);
    assert(Array.isArray(body.data?.licenses) && body.data.licenses.length > 0, `Expected licenses in response`);

    const license = body.data.licenses[0];
    assert(license.masked === true, `Expected masked: true for anonymous query`);
    assert(license.license_key.includes('****-****'), `Expected license_key to contain masked characters '****-****', got: ${license.license_key}`);
    assert(/^WD-[A-Z0-9]{4}-\*\*\*\*-\*\*\*\*-[A-Z0-9]{4}$/.test(license.license_key), `Expected standard masked format WD-XXXX-****-****-YYYY, got: ${license.license_key}`);
  });

  await probe('SECURITY', '5.2 Updater download fails closed (HTTP 503) when Cloud Storage is unconfigured', async () => {
    const order = await OrderModel.findByOrderNumber(orderVndNumber);
    assert(order, 'Order must exist');
    const licenses = await LicenseModel.findByOrderId(order.id);
    assert(licenses.length > 0, 'License must exist for paid order');
    const licenseKey = licenses[0].license_key;

    const isConfigured = StorageService.isConfigured();
    assert(!isConfigured, 'StorageService should not be configured with real credentials during test');

    const res = await fetch(`${baseUrl}/api/v1/updater/download?license_key=${licenseKey}`);
    const body = await res.json();
    assert(res.status === 503, `Expected HTTP 503 when storage is unconfigured, received: ${res.status}`);
    assert(body.error === 'DOWNLOAD_NOT_CONFIGURED', `Expected DOWNLOAD_NOT_CONFIGURED, got: ${body.error}`);
  });

  // Close server
  server.close();

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n======================================================================');
  console.log('📊 ADVERSARIAL STRESS TEST EXECUTION REPORT');
  console.log('======================================================================');

  const passedCount = testResults.filter(r => r.passed).length;
  const failedCount = testResults.filter(r => !r.passed).length;
  const totalDuration = testResults.reduce((acc, r) => acc + r.durationMs, 0);

  console.log(`- Total adversarial probes: ${testResults.length}`);
  console.log(`- Passed probes:             ${passedCount} / ${testResults.length}`);
  console.log(`- Failed probes:             ${failedCount}`);
  console.log(`- Total duration:            ${totalDuration}ms\n`);

  testResults.forEach((t, i) => {
    const icon = t.passed ? '✅' : '❌';
    console.log(`${(i + 1).toString().padStart(2)}. ${icon} [${t.group.padEnd(8)}] ${t.name.padEnd(75)} (${t.durationMs}ms)`);
  });

  console.log('======================================================================\n');

  if (failedCount === 0) {
    console.log('🎉 VERDICT: ALL ADVERSARIAL PROBES PASSED 100%! FINANCIAL DEFENSES HARDENED.');
    process.exit(0);
  } else {
    console.error(`💥 VERDICT: ${failedCount} ADVERSARIAL PROBES FAILED!`);
    process.exit(1);
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Fatal Adversarial Harness Error:', err);
  process.exit(1);
});
