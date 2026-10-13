/**
 * Adversarial Empirical Verification Suite: Licensing Invariants & Info Leakage Probes
 * Challenger: teamwork_preview_challenger_m2_2
 * Role: EMPIRICAL CHALLENGER (critic, specialist)
 * Scope:
 *  - License domain activation quota enforcement under concurrent/repeat attempts
 *  - Order status polling anonymous license key masking and ownership isolation
 *  - Updater download fail-closed storage check and presigned URL verification
 */

import { app } from '../src/app.js';
import { ENV } from '../src/config/env.js';
import { OrderModel } from '../src/models/order.model.js';
import { LicenseModel, type License } from '../src/models/license.model.js';
import { StorageService } from '../src/services/storage.service.js';
import http from 'http';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const testResults: TestResult[] = [];

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runTest(suite: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    testResults.push({ suite, name, passed: true, durationMs });
    console.log(`  ✅ [PASS] [${suite}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    testResults.push({ suite, name, passed: false, durationMs, details: err.message });
    console.error(`  ❌ [FAIL] [${suite}] ${name} (${durationMs}ms):`, err.message);
  }
}

async function startTestServer(): Promise<{ server: http.Server; baseUrl: string }> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4500;
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

async function main() {
  console.log('======================================================================');
  console.log('⚡ ADVERSARIAL CHALLENGER: LICENSING INVARIANTS & INFO LEAKAGE SUITE');
  console.log('======================================================================\n');

  const { server, baseUrl } = await startTestServer();
  console.log(`📡 Adversarial Test Server running at: ${baseUrl}\n`);

  // JWT Helper for owner/non-owner testing
  const ownerUser = { id: 101, email: 'licensed_owner@example.com', role: 'customer' };
  const foreignUser = { id: 202, email: 'attacker_user@example.com', role: 'customer' };

  const ownerToken = jwt.sign(ownerUser, ENV.JWT.SECRET, { expiresIn: '1h' });
  const foreignToken = jwt.sign(foreignUser, ENV.JWT.SECRET, { expiresIn: '1h' });

  // =========================================================================
  // SUITE 1: LICENSE DOMAIN ACTIVATION QUOTA & CONCURRENCY
  // =========================================================================
  console.log('--- SUITE 1: LICENSE DOMAIN ACTIVATION QUOTA & CONCURRENCY ---');

  // Test 1.1: Single-domain quota strict enforcement (max_domains = 1)
  const singleKey = `WD-TEST-SNGL-${Date.now().toString(36).toUpperCase()}-2026`;
  await LicenseModel.create({
    license_key: singleKey,
    order_id: 8001,
    theme_id: 1,
    user_id: ownerUser.id,
    license_type: 'regular',
    max_domains: 1,
  });

  await runTest('Licensing Quota', '1.1 First domain activation succeeds', async () => {
    const res = await LicenseModel.activateDomain(singleKey, 'initial-site.com', '127.0.0.1');
    assert(res.success === true, `Expected success: true, got ${res.success}`);
    assert(res.remainingDomains === 0, `Expected 0 remaining domains, got ${res.remainingDomains}`);
  });

  await runTest('Licensing Quota', '1.2 Repeat activation of exact same domain is idempotent', async () => {
    const res = await LicenseModel.activateDomain(singleKey, 'initial-site.com', '127.0.0.1');
    assert(res.success === true, 'Repeat activation should succeed idempotently');
    assert(res.message.includes('trước đó'), `Message should indicate already active, got: ${res.message}`);
    assert(res.remainingDomains === 0, `Remaining domains should remain 0, got ${res.remainingDomains}`);
  });

  await runTest('Licensing Quota', '1.3 Repeat activation with URL prefix/trailing slash normalized idempotently', async () => {
    const res = await LicenseModel.activateDomain(singleKey, 'https://initial-site.com/', '127.0.0.1');
    assert(res.success === true, 'Normalized domain should succeed idempotently');
    assert(res.message.includes('trước đó'), `Message should indicate already active, got: ${res.message}`);
  });

  await runTest('Licensing Quota', '1.4 Activation of 2nd distinct domain on 1-domain quota is strictly rejected', async () => {
    const res = await LicenseModel.activateDomain(singleKey, 'second-distinct-site.com', '127.0.0.1');
    assert(res.success === false, 'Activation of second domain must be rejected');
    assert(res.message.includes('Đã đạt giới hạn'), `Message must state quota limit, got: ${res.message}`);
  });

  // Test 1.5: High Concurrency Attack: 15 concurrent activation attempts on 3-domain quota
  const multiKey = `WD-TEST-CONC-${Date.now().toString(36).toUpperCase()}-2026`;
  await LicenseModel.create({
    license_key: multiKey,
    order_id: 8002,
    theme_id: 1,
    user_id: ownerUser.id,
    license_type: 'agency',
    max_domains: 3,
  });

  await runTest('Licensing Quota', '1.5 Race condition stress: 15 concurrent distinct domain activations on max_domains=3', async () => {
    const domains = Array.from({ length: 15 }, (_, i) => `concurrent-domain-${i + 1}.org`);
    const results = await Promise.all(
      domains.map((dom) => LicenseModel.activateDomain(multiKey, dom, '127.0.0.1'))
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    assert(successCount === 3, `Invariant breach: exactly 3 activations must succeed, but got ${successCount}`);
    assert(failureCount === 12, `Invariant breach: exactly 12 activations must fail, but got ${failureCount}`);

    const lic = await LicenseModel.findByKey(multiKey);
    assert(lic !== null, 'License must exist');
    assert(lic!.active_domains_count === 3, `active_domains_count must be exactly 3, got ${lic!.active_domains_count}`);
  });

  // Test 1.6: Concurrent repeat activations of identical domain
  const repeatKey = `WD-TEST-RPTD-${Date.now().toString(36).toUpperCase()}-2026`;
  await LicenseModel.create({
    license_key: repeatKey,
    order_id: 8003,
    theme_id: 1,
    user_id: ownerUser.id,
    license_type: 'agency',
    max_domains: 2,
  });

  await runTest('Licensing Quota', '1.6 Concurrency repeat stress: 10 concurrent requests for same domain consume at most 1 slot', async () => {
    const results = await Promise.all(
      Array.from({ length: 10 }, () => LicenseModel.activateDomain(repeatKey, 'identical-domain.com', '127.0.0.1'))
    );

    const lic = await LicenseModel.findByKey(repeatKey);
    assert(lic !== null, 'License must exist');
    assert(lic!.active_domains_count === 1, `active_domains_count must be exactly 1 after 10 concurrent requests for same domain, got ${lic!.active_domains_count}`);

    // Verify remaining slot can still be activated once
    const secondRes = await LicenseModel.activateDomain(repeatKey, 'legitimate-second.com', '127.0.0.1');
    assert(secondRes.success === true, 'Should successfully activate second domain slot');

    const thirdRes = await LicenseModel.activateDomain(repeatKey, 'over-quota-third.com', '127.0.0.1');
    assert(thirdRes.success === false, 'Third domain must be rejected when quota is 2');
  });

  // Test 1.7: Slot re-allocation after deactivation
  await runTest('Licensing Quota', '1.7 Deactivation releases slot and allows subsequent activation', async () => {
    const deactRes = await LicenseModel.deactivateDomain(repeatKey, 'identical-domain.com');
    assert(deactRes.success === true, 'Deactivation must succeed');

    const licAfterDeact = await LicenseModel.findByKey(repeatKey);
    assert(licAfterDeact!.active_domains_count === 1, `active_domains_count should drop to 1, got ${licAfterDeact!.active_domains_count}`);

    const newRes = await LicenseModel.activateDomain(repeatKey, 'replacement-domain.com', '127.0.0.1');
    assert(newRes.success === true, 'Activation into released slot must succeed');
  });

  // Test 1.8: Revoked / expired license activation rejection
  const revokedKey = `WD-TEST-REVK-${Date.now().toString(36).toUpperCase()}-2026`;
  await LicenseModel.create({
    license_key: revokedKey,
    order_id: 8004,
    theme_id: 1,
    user_id: ownerUser.id,
    license_type: 'regular',
    max_domains: 1,
  });
  const revokedLic = await LicenseModel.findByKey(revokedKey);
  if (revokedLic) revokedLic.status = 'revoked';

  await runTest('Licensing Quota', '1.8 Revoked license activation is rejected', async () => {
    const res = await LicenseModel.activateDomain(revokedKey, 'site.com', '127.0.0.1');
    assert(res.success === false, 'Revoked license activation must fail');
    assert(res.message.includes('thu hồi'), `Message should indicate revoked, got: ${res.message}`);
  });

  // =========================================================================
  // SUITE 2: ORDER STATUS POLLING & DATA LEAKAGE PROBES
  // =========================================================================
  console.log('\n--- SUITE 2: ORDER STATUS POLLING & DATA LEAKAGE PROBES ---');

  // Seed Paid Order with License
  const paidOrderNumber = `OD-20261013-SECD${Math.floor(Math.random() * 8999 + 1000)}`;
  const secretLicenseKey = 'WD-PRIV-9876-5432-2026';

  (OrderModel as any).findByOrderNumber = async (num: string, strictUser = false) => {
    if (num === paidOrderNumber) {
      return {
        id: 9901,
        order_number: paidOrderNumber,
        user_id: ownerUser.id,
        customer_name: 'Licensed Customer',
        customer_email: ownerUser.email,
        total_amount: 890000,
        currency: 'VND',
        payment_method: 'vietqr',
        payment_status: 'paid',
        order_status: 'completed',
        created_at: new Date(),
        items: [{ theme_id: 1, theme_name: 'Woodmart', license_type: 'regular', unit_price: 890000 }],
      };
    }
    if (num === 'OD-PENDING-UNPAID') {
      return {
        id: 9902,
        order_number: 'OD-PENDING-UNPAID',
        user_id: ownerUser.id,
        customer_name: 'Pending Customer',
        customer_email: ownerUser.email,
        total_amount: 890000,
        currency: 'VND',
        payment_method: 'vietqr',
        payment_status: 'pending',
        order_status: 'processing',
        created_at: new Date(),
        items: [{ theme_id: 1, theme_name: 'Woodmart', license_type: 'regular', unit_price: 890000 }],
      };
    }
    return null;
  };

  (LicenseModel as any).findByOrderId = async (oid: number) => {
    if (oid === 9901) {
      return [
        {
          id: 501,
          license_key: secretLicenseKey,
          order_id: 9901,
          theme_id: 1,
          theme_name: 'Woodmart E-Commerce Theme',
          user_id: ownerUser.id,
          license_type: 'regular',
          max_domains: 1,
          active_domains_count: 0,
          status: 'active',
          created_at: new Date(),
        },
      ];
    }
    return [];
  };

  await runTest('Data Leakage', '2.1 Anonymous caller polling order status receives masked key only', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${paidOrderNumber}/status`);
    assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);
    const body = await res.json();

    assert(body.success === true, 'Response success must be true');
    assert(body.data?.licenses && body.data.licenses.length === 1, 'Licenses array must contain 1 item');

    const licInfo = body.data.licenses[0];
    assert(licInfo.masked === true, 'licInfo.masked must be true for unauthenticated request');
    assert(licInfo.license_key !== secretLicenseKey, 'Security breach: Plaintext license key exposed to anonymous caller in license_key');
    assert(licInfo.licenseKey !== secretLicenseKey, 'Security breach: Plaintext license key exposed to anonymous caller in licenseKey');

    // Invariant: Plaintext middle fragments (9876-5432) must NOT be present anywhere in the serialized payload
    const serialized = JSON.stringify(body);
    assert(!serialized.includes('9876-5432'), 'Security breach: Plaintext key fragments leaked into JSON payload');
    assert(licInfo.license_key === 'WD-PRIV-****-****-2026', `Masked key should match pattern WD-PRIV-****-****-2026, got: ${licInfo.license_key}`);
  });

  await runTest('Data Leakage', '2.2 Authenticated owner polling order status receives full plaintext key', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${paidOrderNumber}/status`, {
      headers: {
        Authorization: `Bearer ${ownerToken}`,
      },
    });
    assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);
    const body = await res.json();

    assert(body.data?.licenses && body.data.licenses.length === 1, 'Licenses array must contain 1 item');
    const licInfo = body.data.licenses[0];
    assert(licInfo.masked === false, 'licInfo.masked must be false for authenticated owner');
    assert(licInfo.license_key === secretLicenseKey, `Owner must receive full plaintext key: expected ${secretLicenseKey}, got ${licInfo.license_key}`);
  });

  await runTest('Data Leakage', '2.3 Authenticated non-owner polling foreign order is rejected with HTTP 404', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${paidOrderNumber}/status`, {
      headers: {
        Authorization: `Bearer ${foreignToken}`,
      },
    });
    assert(res.status === 404, `Foreign order status query must return 404 Not Found, got ${res.status}`);
    const body = await res.json();
    assert(body.success === false, 'success must be false');
  });

  await runTest('Data Leakage', '2.4 Anonymous polling of pending/unpaid order returns empty licenses array', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/OD-PENDING-UNPAID/status`);
    assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);
    const body = await res.json();
    assert(body.data?.payment_status === 'pending', 'payment_status must be pending');
    assert(Array.isArray(body.data?.licenses) && body.data.licenses.length === 0, 'Pending order must have empty licenses');
  });

  await runTest('Data Leakage', '2.5 Polling nonexistent order returns HTTP 404', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/OD-NONEXISTENT-9999/status`);
    assert(res.status === 404, `Nonexistent order must return 404, got ${res.status}`);
  });

  // =========================================================================
  // SUITE 3: UPDATER DOWNLOAD FAIL-CLOSED STORAGE PROTECTION
  // =========================================================================
  console.log('\n--- SUITE 3: UPDATER DOWNLOAD FAIL-CLOSED STORAGE PROTECTION ---');

  const updaterTestKey = `WD-TEST-UPDT-${Date.now().toString(36).toUpperCase()}-2026`;
  await LicenseModel.create({
    license_key: updaterTestKey,
    order_id: 8005,
    theme_id: 1,
    user_id: ownerUser.id,
    license_type: 'regular',
    max_domains: 1,
  });

  // Preserve initial environment storage state
  const origR2Account = process.env.R2_ACCOUNT_ID;
  const origR2Key = process.env.R2_ACCESS_KEY_ID;
  const origR2Secret = process.env.R2_SECRET_ACCESS_KEY;
  const origDriver = process.env.STORAGE_DRIVER;
  const origS3Bucket = process.env.AWS_S3_BUCKET;
  const origS3Key = process.env.AWS_ACCESS_KEY_ID;
  const origS3Secret = process.env.AWS_SECRET_ACCESS_KEY;

  try {
    // 3.1 Unconfigured storage: R2 keys unset or placeholder
    delete process.env.R2_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.AWS_S3_BUCKET;
    process.env.STORAGE_DRIVER = 'r2';

    await runTest('Storage Fail-Closed', '3.1 Updater download returns HTTP 503 DOWNLOAD_NOT_CONFIGURED when R2 credentials unset', async () => {
      assert(StorageService.isConfigured() === false, 'StorageService.isConfigured() must be false when keys are unset');
      const res = await fetch(`${baseUrl}/api/v1/updater/download?license_key=${updaterTestKey}`, {
        redirect: 'manual',
      });
      assert(res.status === 503, `Expected HTTP 503 Service Unavailable, got ${res.status}`);
      const body = await res.json();
      assert(body.error === 'DOWNLOAD_NOT_CONFIGURED', `Expected error code DOWNLOAD_NOT_CONFIGURED, got ${body.error}`);
    });

    await runTest('Storage Fail-Closed', '3.2 Updater download returns HTTP 503 when credentials are placeholder "your_*"', async () => {
      process.env.R2_ACCOUNT_ID = 'your_account_id';
      process.env.R2_ACCESS_KEY_ID = 'your_key';
      process.env.R2_SECRET_ACCESS_KEY = 'your_secret';

      assert(StorageService.isConfigured() === false, 'StorageService.isConfigured() must be false for placeholder credentials');
      const res = await fetch(`${baseUrl}/api/v1/updater/download?license_key=${updaterTestKey}`, {
        redirect: 'manual',
      });
      assert(res.status === 503, `Expected HTTP 503 Service Unavailable for placeholder credentials, got ${res.status}`);
      const body = await res.json();
      assert(body.error === 'DOWNLOAD_NOT_CONFIGURED', `Expected error DOWNLOAD_NOT_CONFIGURED, got ${body.error}`);
    });

    // 3.3 Configured storage: Valid non-placeholder R2 credentials
    await runTest('Storage Fail-Closed', '3.3 Updater download returns HTTP 302 Found redirect with signed URL when storage configured', async () => {
      process.env.R2_ACCOUNT_ID = 'cf_production_account_id_999';
      process.env.R2_ACCESS_KEY_ID = 'cf_production_access_key_999';
      process.env.R2_SECRET_ACCESS_KEY = 'cf_production_secret_key_super_secure_999';

      assert(StorageService.isConfigured() === true, 'StorageService.isConfigured() must be true for valid credentials');
      const res = await fetch(`${baseUrl}/api/v1/updater/download?license_key=${updaterTestKey}`, {
        redirect: 'manual',
      });
      assert(res.status === 302, `Expected HTTP 302 redirect, got ${res.status}`);
      const location = res.headers.get('location');
      assert(location !== null, 'Redirect must include Location header');
      assert(location!.includes('.zip'), 'Location header must point to .zip package');
      assert(location!.includes('expires='), 'Location must contain expires param');
      assert(location!.includes('sig='), 'Location must contain sig param');

      // Verify HMAC signature validity using StorageService.verifyPresignedUrl
      const urlObj = new URL(location!);
      const expiresAt = Number(urlObj.searchParams.get('expires'));
      const sig = urlObj.searchParams.get('sig') || '';
      const filePath = urlObj.pathname.replace(/^\/+/, '');

      const isSigValid = StorageService.verifyPresignedUrl(filePath, expiresAt, sig, updaterTestKey);
      assert(isSigValid === true, 'Presigned URL HMAC signature must pass cryptographic verification');
    });

    // 3.4 S3 Driver configuration verification
    await runTest('Storage Fail-Closed', '3.4 S3 storage driver recognizes configured vs unconfigured state', async () => {
      process.env.STORAGE_DRIVER = 's3';
      process.env.AWS_S3_BUCKET = 'your_s3_bucket';
      process.env.AWS_ACCESS_KEY_ID = 'your_key';
      process.env.AWS_SECRET_ACCESS_KEY = 'your_secret';
      assert(StorageService.isConfigured() === false, 'S3 driver must reject placeholder keys');

      process.env.AWS_S3_BUCKET = 'theme-production-releases';
      process.env.AWS_ACCESS_KEY_ID = 'AKIA_PRODUCTION_KEY_123';
      process.env.AWS_SECRET_ACCESS_KEY = 'aws_super_secret_access_key_123';
      assert(StorageService.isConfigured() === true, 'S3 driver must accept genuine keys');
    });

    // 3.5 Missing or invalid license key rejected with HTTP 401 even when storage IS configured
    await runTest('Storage Fail-Closed', '3.5 Updater download rejects missing or invalid license with HTTP 401', async () => {
      const resNoKey = await fetch(`${baseUrl}/api/v1/updater/download`, { redirect: 'manual' });
      assert(resNoKey.status === 401, `Expected HTTP 401 for missing key, got ${resNoKey.status}`);

      const resBadKey = await fetch(`${baseUrl}/api/v1/updater/download?license_key=FAKE-INVALID-NONEXISTENT`, { redirect: 'manual' });
      assert(resBadKey.status === 401, `Expected HTTP 401 for invalid key, got ${resBadKey.status}`);
    });
  } finally {
    // Restore original env vars
    if (origR2Account !== undefined) process.env.R2_ACCOUNT_ID = origR2Account; else delete process.env.R2_ACCOUNT_ID;
    if (origR2Key !== undefined) process.env.R2_ACCESS_KEY_ID = origR2Key; else delete process.env.R2_ACCESS_KEY_ID;
    if (origR2Secret !== undefined) process.env.R2_SECRET_ACCESS_KEY = origR2Secret; else delete process.env.R2_SECRET_ACCESS_KEY;
    if (origDriver !== undefined) process.env.STORAGE_DRIVER = origDriver; else delete process.env.STORAGE_DRIVER;
    if (origS3Bucket !== undefined) process.env.AWS_S3_BUCKET = origS3Bucket; else delete process.env.AWS_S3_BUCKET;
    if (origS3Key !== undefined) process.env.AWS_ACCESS_KEY_ID = origS3Key; else delete process.env.AWS_ACCESS_KEY_ID;
    if (origS3Secret !== undefined) process.env.AWS_SECRET_ACCESS_KEY = origS3Secret; else delete process.env.AWS_SECRET_ACCESS_KEY;
  }

  // Teardown server
  server.close();

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('\n======================================================================');
  console.log('📊 ADVERSARIAL CHALLENGER VERIFICATION SUMMARY');
  console.log('======================================================================');

  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;

  console.log(`- Total adversarial test probes executed: ${total}`);
  console.log(`- Probes PASSED: ${passed} / ${total}`);
  console.log(`- Probes FAILED: ${failed} / ${total}`);

  if (failed > 0) {
    console.error('\n🚨 ADVERSARIAL VERIFICATION FAILED: Violations detected!');
    process.exit(1);
  } else {
    console.log('\n🏆 ALL ADVERSARIAL INVARIANT PROBES PASSED 100% EMPIRICALLY!');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
