import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestSuite {
  name: string;
  file: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: 'Member 02 Suite',
    file: 'member2_auth_catalog.test.ts',
    description: 'Auth, User Profile, Categories, Faceted Search & Storage Presigned URLs',
  },
  {
    name: 'Member 03 Suite',
    file: 'member3_payment_licensing.test.ts',
    description: 'Orders, VietQR, SePAY Webhook, Stripe, License Issuance & WP Auto-Updater',
  },
  {
    name: 'Member 05 Checkout Suite',
    file: 'member5_checkout.test.ts',
    description: 'Checkout Order Creation, Validation & Payment Intent Flow',
  },
  {
    name: 'Member 05 Fulfillment Suite',
    file: 'member5_payment_fulfillment.test.ts',
    description: 'Payment Webhook Fulfillment & Automatic License Delivery',
  },
  {
    name: 'Member 05 Portal Suite',
    file: 'member5_portal.test.ts',
    description: 'Customer Portal, License Management & Domain Activation',
  },
];

console.log('======================================================================');
console.log('🚀 THEME MARKETPLACE PLATFORM - AUTOMATED BACKEND TEST RUNNER');
console.log('   DevOps Automated Verification for All Member Suites');
console.log('======================================================================\n');

let totalSuites = testSuites.length;
let passedSuites = 0;
let failedSuites = 0;
const summary: Array<{ name: string; file: string; status: 'PASSED' | 'FAILED'; durationMs: number }> = [];

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

for (const suite of testSuites) {
  const relPath = path.join('tests', suite.file);
  console.log(`▶ Đang chạy: ${suite.name} (${suite.file})`);
  console.log(`  Mô tả: ${suite.description}`);

  const startTime = Date.now();
  const result = spawnSync(npxCmd, ['tsx', relPath], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    shell: isWindows,
  });
  const durationMs = Date.now() - startTime;

  if (result.status === 0) {
    passedSuites++;
    summary.push({ name: suite.name, file: suite.file, status: 'PASSED', durationMs });
    console.log(`✔ [HOÀN TẤT] ${suite.name} đã vượt qua (${durationMs}ms)\n`);
  } else {
    failedSuites++;
    summary.push({ name: suite.name, file: suite.file, status: 'FAILED', durationMs });
    console.error(`✖ [THẤT BẠI] ${suite.name} gặp lỗi (Exit Code: ${result.status})\n`);
  }
}

console.log('======================================================================');
console.log('📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ (TEST EXECUTION SUMMARY)');
console.log('======================================================================');

summary.forEach((item, index) => {
  const icon = item.status === 'PASSED' ? '✅' : '❌';
  console.log(`${index + 1}. ${icon} ${item.name.padEnd(28)} | ${item.file.padEnd(35)} | ${item.status} (${item.durationMs}ms)`);
});

console.log('----------------------------------------------------------------------');
console.log(`Tổng số Suites: ${totalSuites} | Đạt: ${passedSuites} | Thất bại: ${failedSuites}`);
console.log('======================================================================\n');

if (failedSuites > 0) {
  console.error(`💥 Phát hiện ${failedSuites} test suite không đạt chuẩn! Vui lòng kiểm tra lại log.`);
  process.exit(1);
} else {
  console.log('🎉 TOÀN BỘ CÁC BỘ KIỂM THỬ ĐÃ VƯỢT QUA 100% THÀNH CÔNG!');
  process.exit(0);
}
