import { app } from '../src/app.js';
import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
}

const results: TestResult[] = [];

async function runTestCase(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, passed: true, durationMs });
    console.log(`  ✅ [PASS] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({ name, passed: false, durationMs, details: err.message });
    console.error(`  ❌ [FAIL] ${name} (${durationMs}ms):`, err.message);
  }
}

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function main() {
  console.log('================================================================');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN THÀNH VIÊN 03: BE PAYMENT & LICENSING');
  console.log('================================================================\n');

  // Khởi động Express Server trên cổng ngẫu nhiên
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4000;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`🌐 Test Server đang chạy tại: ${baseUrl}\n`);

  let orderNumberVnd = '';
  let orderNumberUsd = '';
  let generatedLicenseKey = '';

  // -------------------------------------------------------------
  // PHẦN 1: MODULE ĐƠN HÀNG (ORDERS & MULTI-CURRENCY)
  // -------------------------------------------------------------
  console.log('📦 NHÓM 1: QUY TRÌNH TẠO ĐƠN HÀNG & ĐA TIỀN TỆ (VND/USD)');

  await runTestCase('1.1 Tạo đơn hàng VND và sinh mã VietQR Quicklink', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Nguyễn Văn Test',
        customer_email: 'test.vietqr@example.com',
        total_amount: 999000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 201, `Status phải là 201 Created, nhận: ${res.status}`);
    assert(body.success === true, 'Response success phải là true');
    assert(body.data?.orderNumber, 'Phải có orderNumber');
    assert(/^OD-\d{8}-[A-F0-9]{6}$/.test(body.data.orderNumber), `Mã đơn ${body.data.orderNumber} sai format OD-YYYYMMDD-XXXXXX`);
    assert(body.data.vietQrUrl && body.data.vietQrUrl.includes('img.vietqr.io'), 'Phải sinh đúng VietQR URL Quicklink');
    orderNumberVnd = body.data.orderNumber;
  });

  await runTestCase('1.2 Hỗ trợ endpoint alias POST /api/v1/orders/create', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Khách Hàng Mới',
        customer_email: 'khachhang@example.com',
        total_amount: 500000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const body = await res.json();
    assert(res.status === 201, `Status phải là 201, nhận: ${res.status}`);
    assert(body.data?.orderNumber, 'Phải tạo thành công đơn hàng qua /create');
  });

  await runTestCase('1.3 Kiểm tra trạng thái đơn ban đầu (Pending)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${orderNumberVnd}/status`);
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.data?.payment_status === 'pending', `payment_status phải là pending, nhận: ${body.data?.payment_status}`);
    assert(body.data?.order_status === 'processing', `order_status phải là processing`);
  });

  await runTestCase('1.4 Tạo đơn hàng Quốc tế tiền tệ USD', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'John Doe',
        customer_email: 'johndoe@example.com',
        total_amount: 59,
        currency: 'USD',
        payment_method: 'stripe',
      }),
    });
    const body = await res.json();
    assert(res.status === 201, `Status phải là 201, nhận: ${res.status}`);
    assert(body.data?.currency === 'USD', 'Currency phải là USD');
    orderNumberUsd = body.data.orderNumber;
  });

  // -------------------------------------------------------------
  // PHẦN 2: CỔNG THANH TOÁN VIETQR SEPAY WEBHOOK (3S ENGINE)
  // -------------------------------------------------------------
  console.log('\n⚡ NHÓM 2: CỔNG THANH TOÁN VIETQR & SEPAY WEBHOOK (TỰ ĐỘNG 3S)');

  await runTestCase('2.1 Xử lý SePAY Webhook tự động, đổi trạng thái paid & cấp License Key', async () => {
    const webhookPayload = {
      id: 987654321,
      gateway: 'vietqr',
      transferAmount: 999000,
      content: `Chuyen khoan don hang ${orderNumberVnd} thanh toan woodmart`,
    };

    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.success === true, 'Webhook trả về success: true');
    assert(body.data?.licenses && body.data.licenses.length > 0, 'Phải cấp License Key tự động');
    generatedLicenseKey = body.data.licenses[0].licenseKey;
    assert(/^WD-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$/.test(generatedLicenseKey), `License Key ${generatedLicenseKey} không đúng format WD-XXXX-XXXX-XXXX-2026`);
  });

  await runTestCase('2.2 Polling trạng thái đơn hàng nhận trạng thái paid và đính kèm License Key', async () => {
    const res = await fetch(`${baseUrl}/api/v1/orders/${orderNumberVnd}/status`);
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200`);
    assert(body.data?.payment_status === 'paid', 'Đơn hàng phải chuyển thành paid');
    assert(body.data?.licenses && body.data.licenses.length > 0, 'Polling phải đính kèm licenses để Frontend hiển thị');
    assert(body.data.licenses[0].license_key === generatedLicenseKey, 'Key trong polling phải khớp với key đã cấp');
  });

  await runTestCase('2.3 Bảo vệ Idempotency: Gửi lại webhook trùng không sinh trùng lặp giao dịch/key', async () => {
    const webhookPayload = {
      id: 987654321,
      gateway: 'vietqr',
      transferAmount: 999000,
      content: `Chuyen khoan don hang ${orderNumberVnd} thanh toan woodmart`,
    };

    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
    const body = await res.json();
    assert(res.status === 200, 'Status phải là 200');
    assert(body.message.includes('Đơn hàng đã được xử lý trước đó'), `Phải chặn lặp giao dịch, nhận: ${body.message}`);
  });

  await runTestCase('2.4 Từ chối Webhook khi số tiền chuyển khoản không đủ', async () => {
    // Tạo 1 đơn mới giá 500k
    const createRes = await fetch(`${baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Khách Thiếu Tiền',
        customer_email: 'thieutien@example.com',
        total_amount: 500000,
        currency: 'VND',
        payment_method: 'vietqr',
      }),
    });
    const createBody = await createRes.json();
    const testOrder = createBody.data.orderNumber;

    // Gửi chuyển khoản chỉ 200k
    const res = await fetch(`${baseUrl}/api/v1/webhooks/sepay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 11223344,
        gateway: 'vietqr',
        transferAmount: 200000,
        content: `Thanh toan ${testOrder}`,
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Phải trả về status 400 Bad Request khi thiếu tiền, nhận: ${res.status}`);
    assert(body.success === false, 'success phải là false');
  });

  // -------------------------------------------------------------
  // PHẦN 3: CỔNG THANH TOÁN QUỐC TẾ (STRIPE)
  // -------------------------------------------------------------
  console.log('\n💳 NHÓM 3: CỔNG THANH TOÁN QUỐC TẾ (STRIPE SESSION & WEBHOOK)');

  await runTestCase('3.1 Khởi tạo phiên thanh toán Stripe Checkout Session (USD)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/payments/stripe/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber: orderNumberUsd }),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.data?.sessionId && body.data.sessionId.startsWith('cs_test_'), 'Phải sinh Stripe sessionId');
    assert(body.data?.clientSecret && body.data.clientSecret.startsWith('pi_'), 'Phải sinh Stripe clientSecret');
    assert(body.data?.currency === 'USD', 'Currency phải là USD');
  });

  await runTestCase('3.2 Xử lý Stripe Webhook checkout.session.completed', async () => {
    const stripePayload = {
      id: `evt_test_${Date.now()}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: orderNumberUsd,
          payment_status: 'paid',
        },
      },
    };

    const res = await fetch(`${baseUrl}/api/v1/payments/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stripePayload),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.received === true, 'Phải xác nhận received: true');

    // Kiểm tra lại order USD đã chuyển paid chưa
    const checkRes = await fetch(`${baseUrl}/api/v1/orders/${orderNumberUsd}/status`);
    const checkBody = await checkRes.json();
    assert(checkBody.data?.payment_status === 'paid', 'Đơn USD phải chuyển sang paid sau Stripe Webhook');
  });

  // -------------------------------------------------------------
  // PHẦN 4: HỆ THỐNG BẢN QUYỀN (LICENSE ENGINE & DOMAIN CONTROL)
  // -------------------------------------------------------------
  console.log('\n🔑 NHÓM 4: HỆ THỐNG BẢN QUYỀN (LICENSE ENGINE, ACTIVATION & DOMAINS)');

  await runTestCase('4.1 Tra cứu và xác thực thông tin License Key', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/verify?key=${generatedLicenseKey}`);
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.data?.license_key === generatedLicenseKey, 'Mã bản quyền phải khớp');
    assert(body.data?.status === 'active', 'Trạng thái bản quyền phải là active');
    assert(body.data?.max_domains === 1, 'Gói Regular phải giới hạn 1 domain');
    assert(body.data?.active_domains_count === 0, 'Ban đầu số domain active phải là 0');
  });

  await runTestCase('4.2 Kích hoạt Domain đầu tiên (mybusiness.vn)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: generatedLicenseKey,
        domain: 'mybusiness.vn',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.success === true, 'Kích hoạt thành công');
    assert(body.data?.remainingDomains === 0, 'Số domain còn lại phải là 0');
  });

  await runTestCase('4.3 Kích hoạt lại cùng domain mybusiness.vn (Idempotency check)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: generatedLicenseKey,
        domain: 'mybusiness.vn',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200`);
    assert(body.message.includes('trước đó'), 'Phải báo domain đã được kích hoạt trước đó');
  });

  await runTestCase('4.4 Chặn kích hoạt vượt hạn mức domain (Domain Limit Enforcement - HTTP 400)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: generatedLicenseKey,
        domain: 'shop2.vn',
      }),
    });
    const body = await res.json();
    assert(res.status === 400, `Phải trả về 400 Bad Request khi vượt hạn mức domain, nhận: ${res.status}`);
    assert(body.message.includes('Đã đạt giới hạn kích hoạt tối đa'), `Thông báo phải nêu rõ vượt giới hạn, nhận: ${body.message}`);
  });

  await runTestCase('4.5 Hủy kích hoạt domain cũ (mybusiness.vn)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/deactivate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: generatedLicenseKey,
        domain: 'mybusiness.vn',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.success === true, 'Hủy kích hoạt thành công');
  });

  await runTestCase('4.6 Kích hoạt domain mới (mynewstore.com) sau khi đã giải phóng slot', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: generatedLicenseKey,
        domain: 'mynewstore.com',
      }),
    });
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.success === true, 'Kích hoạt domain mới thành công sau khi chuyển đổi');
  });

  await runTestCase('4.7 Lấy danh sách bản quyền của khách hàng (My Account Portal)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/licenses/my-licenses?userId=1`);
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(Array.isArray(body.data), 'Dữ liệu trả về phải là một mảng');
  });

  // -------------------------------------------------------------
  // PHẦN 5: WORDPRESS AUTO-UPDATER ENGINE (CHUẨN PUC)
  // -------------------------------------------------------------
  console.log('\n🔄 NHÓM 5: WORDPRESS AUTO-UPDATER API (CHUẨN PLUGIN-UPDATE-CHECKER)');

  await runTestCase('5.1 Kiểm tra bản cập nhật WordPress Theme trả về đúng cấu trúc chuẩn PUC', async () => {
    const res = await fetch(`${baseUrl}/api/v1/updater/check?license_key=${generatedLicenseKey}&theme_slug=woodmart&version=8.6.0`);
    const body = await res.json();
    assert(res.status === 200, `Status phải là 200, nhận: ${res.status}`);
    assert(body.name === 'Woodmart Multipurpose Theme', 'name phải đúng');
    assert(body.slug === 'woodmart', 'slug phải đúng');
    assert(body.version === '8.6.2', 'version mới nhất phải là 8.6.2');
    assert(body.download_url && body.download_url.includes('/api/v1/updater/download'), 'download_url phải trỏ về endpoint updater download');
    assert(body.sections?.changelog, 'Phải có changelog chi tiết');
  });

  await runTestCase('5.2 Từ chối kiểm tra cập nhật khi License Key không hợp lệ (HTTP 401)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/updater/check?license_key=INVALID_KEY_XYZ&theme_slug=woodmart`);
    assert(res.status === 401, `Phải trả về 401 Unauthorized khi key không hợp lệ, nhận: ${res.status}`);
  });

  await runTestCase('5.3 Tải gói nén cập nhật .zip bảo mật chuyển hướng HTTP 302', async () => {
    const res = await fetch(`${baseUrl}/api/v1/updater/download?license_key=${generatedLicenseKey}`, {
      redirect: 'manual', // Không tự động follow để kiểm tra mã redirect 302
    });
    assert(res.status === 302, `Phải trả về 302 Found redirect, nhận: ${res.status}`);
    const location = res.headers.get('location');
    assert(location && location.includes('.zip'), `Location header phải trỏ đến file zip, nhận: ${location}`);
  });

  // Đóng server
  server.close();

  // -------------------------------------------------------------
  // TỔNG KẾT
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ THÀNH VIÊN 03');
  console.log('================================================================');

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

  console.log(`- Tổng số test cases: ${results.length}`);
  console.log(`- Số bài ĐẠT (PASS):  ${passedCount} / ${results.length}`);
  console.log(`- Số bài LỖI (FAIL):  ${failedCount}`);
  console.log(`- Thời gian hoàn tất: ${totalDuration}ms`);

  if (failedCount === 0) {
    console.log('\n🎉 TOÀN BỘ CHỨC NĂNG THÀNH VIÊN 03 ĐÃ ĐẠT 100% DEFINITION OF DONE (DoD)!');
    process.exit(0);
  } else {
    console.error('\n⚠️ CÓ BÀI TEST CHƯA ĐẠT. VUI LÒNG KIỂM TRA LẠI CHI TIẾT Ở TRÊN.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
