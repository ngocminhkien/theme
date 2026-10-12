# 📘 PHÂN CÔNG THÀNH VIÊN 03: BACKEND DEVELOPER (PAYMENT, ORDERS & LICENSE ENGINE)

> **Vị trí:** Lập trình viên Backend Phụ trách Cổng Thanh toán, Xử lý Đơn hàng & Hệ thống Bản quyền (BE Payment & Licensing)  
> **Mục tiêu:** Xây dựng cỗ máy thanh toán tự động không lỗi (VietQR & Stripe/PayPal), cấp phát License Key bảo mật và cung cấp API cập nhật tự động (Auto-Update Engine) cho khách hàng WordPress.

---

## 1. PHẠM VI TRÁCH NHIỆM (SCOPE OF WORK)
* **Thư mục & Tệp phụ trách chính:**
  * `backend/src/modules/orders/` (Quy trình tạo đơn, tính giá VND/USD, giỏ hàng)
  * `backend/src/modules/payments/` (Tích hợp VietQR/SePAY, Stripe, PayPal)
  * `backend/src/modules/licenses/` (Sinh License Key, xác thực và quản lý Domain)
  * `backend/src/modules/updater/` (API phục vụ cập nhật 1-click cho website WordPress)
  * `backend/src/modules/webhooks/` (Bảo mật chữ ký và xử lý Webhook bất đồng bộ)

---

## 2. CÔNG NGHỆ & CÔNG CỤ SỬ DỤNG
* **Framework:** Node.js (NestJS / TypeScript).
* **Cổng thanh toán:**
  * **Việt Nam:** SePAY API & Webhook (VietQR tự động).
  * **Quốc tế:** Stripe SDK (`stripe`), PayPal Checkout SDK.
* **Mã hóa & Bảo mật:** Node.js `crypto` (HMAC-SHA256 xác thực chữ ký Webhook, sinh UUID v4 / Cryptographic License Keys).
* **Hàng đợi xử lý (Queue):** BullMQ với Redis (xử lý kích hoạt đơn, gửi email biên lai tự động).

---

## 3. DANH SÁCH CÔNG VIỆC CHI TIẾT (SPRINT BACKLOG)

### Tuần 1: Module Đơn Hàng & Xử Lý Đa Tiền Tệ (VND & USD)
- [x] Xây dựng **OrdersModule**:
  - `POST /api/v1/orders/create`: Nhận giỏ hàng, thông tin khách hàng (Họ tên, Email), tự động chuyển đổi số tiền theo loại tiền tệ (`VND` hoặc `USD`).
  - Hỗ trợ Mua hàng không cần đăng nhập trước (Guest Checkout) ➔ tự động tạo tài khoản hoặc gán vào email khách.
  - Sinh mã đơn hàng duy nhất: Định dạng `OD-YYYYMMDD-XXXX`.
- [x] Thiết lập bảng `orders` và `order_items` với giao dịch Database Transaction (`ACID`), đảm bảo không thất thoát dữ liệu.

### Tuần 2: Cổng Thanh Toán Tự Động VietQR (SePAY) cho Thị Trường Việt Nam
- [x] Tích hợp API sinh dữ liệu VietQR:
  - Trả về mã QR (VietQR dynamic format) chứa đúng số tài khoản, số tiền và nội dung chuyển khoản là mã đơn hàng.
- [x] Xây dựng **Webhook SePAY Receiver** (`POST /api/v1/webhooks/sepay`):
  - Xác thực bảo mật: Kiểm tra Header `Authorization: Apikey <SEPAY_API_KEY>` hoặc webhook secret.
  - Phân tích nội dung chuyển khoản để khớp với mã đơn hàng.
  - Kiểm tra số tiền chuyển thực tế $\ge$ số tiền đơn hàng.
  - Cập nhật trạng thái đơn thành `paid` và lưu vết vào bảng `payments` (Idempotency - chống trùng lặp giao dịch).
  - Kích hoạt tiến trình sinh License Key tức thì (thời gian xử lý < 3 giây).

### Tuần 3: Cổng Thanh Toán Quốc Tế (Stripe & PayPal)
- [x] Tích hợp **Stripe Payment**:
  - `POST /api/v1/payments/stripe/create-session`: Tạo Stripe Checkout Session (hỗ trợ Thẻ quốc tế, Apple Pay, Google Pay).
  - Xây dựng Stripe Webhook: Lắng nghe sự kiện `checkout.session.completed` và `payment_intent.succeeded` có kiểm tra chữ ký `stripe-signature`.
- [x] Tích hợp **PayPal Webhook** lắng nghe sự kiện `PAYMENT.CAPTURE.COMPLETED`.

### Tuần 4: Hệ Thống Bản Quyền (License Engine) & WordPress Auto-Update API
- [x] Xây dựng **LicensesModule**:
  - Thuật toán sinh License Key ngẫu nhiên bảo mật (Ví dụ: `WD-A7X9-B2C4-88EF-2026`).
  - Giới hạn số lượng domain: `regular` (1 domain), `agency` (5 domain), `lifetime` (không giới hạn).
  - `POST /api/v1/licenses/activate`: Domain gửi request lên kèm license key ➔ ghi nhận vào `license_activations`.
  - `POST /api/v1/licenses/deactivate`: Cho phép khách hủy liên kết domain cũ để chuyển sang domain mới.
- [x] Xây dựng **WordPress Auto-Updater Endpoints**:
  - `GET /api/v1/updater/check?license_key=xxx&theme_slug=woodmart&version=8.6.2`:
    * Kiểm tra License Key còn hiệu lực không.
    * So sánh version: Nếu có bản mới (ví dụ v8.6.3), trả về JSON chứa changelog, URL tải, và thông số tương thích chuẩn WordPress.
  - `GET /api/v1/updater/download?license_key=xxx`:
    * Xác thực bản quyền hợp lệ ➔ Ghi nhận vào `download_logs` ➔ Redirect 302 đến Presigned S3/R2 URL.

---

## 4. ĐIỂM GIAO TIẾP VỚI CÁC THÀNH VIÊN KHÁC (DEPENDENCY CONTRACTS)

| Thành viên | Giao tiếp / Bàn giao |
| :--- | :--- |
| **Thành viên 01 (DevOps & DB)** | Yêu cầu mở port hoặc cấu hình Webhook URL trên Nginx; theo dõi log giao dịch thanh toán. |
| **Thành viên 02 (BE Core)** | Nhận thông tin giá theme (`price_vnd`, `price_usd`) và hàm lấy presigned URL từ `StorageModule`. |
| **Thành viên 04 (FE Storefront)** | Phối hợp hiển thị đúng tiền tệ (VND/USD) và nút "Mua Ngay" điều hướng sang giỏ hàng. |
| **Thành viên 05 (FE Portal & Checkout)** | Bàn giao API tạo đơn, API lấy mã QR VietQR, Client Secret của Stripe, và API quản lý License Keys của khách. |

---

## 5. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DoD)
1. Thử nghiệm quét mã VietQR mô phỏng (qua SePAY Sandbox): Đơn hàng tự động đổi sang trạng thái `paid` trong 3 giây.
2. Thử nghiệm thanh toán thẻ test Stripe (4242...): Webhook nhận diện và kích hoạt đơn thành công 100%.
3. Cơ chế bảo vệ Idempotency: Gửi lặp lại cùng 1 webhook không bao giờ sinh ra 2 license key hoặc cập nhật 2 lần.
4. Kiểm tra giả lập WordPress Client gửi request check update: Trả về đúng format JSON của `plugin-update-checker` (PUC).
