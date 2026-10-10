# 📘 PHÂN CÔNG THÀNH VIÊN 05: FRONTEND / FULLSTACK DEVELOPER (CHECKOUT, CUSTOMER PORTAL & ADMIN CMS)

> **Vị trí:** Lập trình viên Frontend/Fullstack Phụ trách Quy trình Thanh toán, Cổng Tài khoản Khách hàng & Bảng Quản trị (FE Checkout & Portal)  
> **Mục tiêu:** Tạo trải nghiệm thanh toán 1 bước không rào cản (quét VietQR 3 giây và thanh toán thẻ Stripe), xây dựng Dashboard cho khách quản lý License Key và Bảng quản trị cho Admin.

---

## 1. PHẠM VI TRÁCH NHIỆM (SCOPE OF WORK)
* **Thư mục & Tệp phụ trách chính:**
  * `frontend/src/app/checkout/` (Trang thanh toán 1 bước One-Page Checkout)
  * `frontend/src/app/checkout/order-received/` (Trang cảm ơn, tải file tức thì & nhận License)
  * `frontend/src/app/my-account/` (Cổng khách hàng: Đăng nhập, Tải theme, Quản lý bản quyền)
  * `frontend/src/app/admin/` (Bảng điều khiển Quản trị viên: Quản lý đơn hàng, Doanh thu, License)
  * `frontend/src/components/checkout/` (VietQRModal, StripePaymentForm, CartDrawer)
  * `frontend/src/components/account/` (LicenseManagerCard, DownloadHistoryTable)

---

## 2. CÔNG NGHỆ & CÔNG CỤ SỬ DỤNG
* **Framework:** **Next.js 15 (App Router)** + **TypeScript**.
* **Thư viện Thanh toán:** `@stripe/stripe-js`, `@stripe/react-stripe-js`, `@paypal/react-paypal-js`.
* **Form & Validation:** `react-hook-form`, `zod` (validate form cực nhanh).
* **Biểu đồ & UI:** `recharts` (vẽ biểu đồ doanh thu Admin), Shadcn/UI (Dialog, Toast, Tabs, DataTable).
* **Realtime / Polling:** WebSocket hoặc SWR Polling (lắng nghe trạng thái quét mã VietQR thành công).

---

## 3. DANH SÁCH CÔNG VIỆC CHI TIẾT (SPRINT BACKLOG)

### Tuần 1: Giỏ Hàng Trượt (Cart Drawer) & Trang Thanh Toán 1 Bước (Checkout)
- [ ] Xây dựng **Slide-out Cart Drawer**:
  * Hiển thị danh sách theme trong giỏ, lựa chọn loại License (Regular / Agency), tổng tiền cập nhật tự động.
  * Tùy chọn thêm Dịch vụ Cài đặt hộ (+399.000đ / +$29) dạng checkbox tiện lợi.
- [ ] Xây dựng **Trang Thanh toán 1 Bước (One-Page Checkout - `/checkout`)**:
  * Tối giản form thông tin: Chỉ yêu cầu **Họ tên** và **Email** (để nhận key và file tải), bỏ hoàn toàn các trường địa chỉ giao hàng vật lý.
  * Tự động phát hiện loại tiền tệ của khách hàng (`VND` hoặc `USD`):
    * Khách VND ➔ Mặc định chọn phương thức **VietQR Chuyển khoản tự động (SePAY)** hoặc Ví MoMo.
    * Khách USD ➔ Mặc định chọn phương thức **Thẻ tín dụng quốc tế (Stripe)** hoặc **PayPal**.

### Tuần 2: Tích Hợp Giao Diện Thanh Toán VietQR Tự Động & Stripe Elements
- [ ] Xây dựng **Khung Thanh Toán VietQR (Popup / Box QR thông minh)**:
  * Gọi API của Thành viên 03 để sinh mã VietQR theo mã đơn hàng.
  * Hiển thị mã QR rõ nét, số tiền chính xác từng đồng, số tài khoản và cú pháp chuyển khoản.
  * Tích hợp đồng hồ đếm ngược 10 phút.
  * Cơ chế tự động lắng nghe (Auto Polling mỗi 2 giây): Ngay khi khách quét app ngân hàng và webhook thành công ➔ màn hình tự động chuyển sang trang Hoàn tất đơn hàng kèm âm thanh thành công.
- [ ] Tích hợp **Stripe Elements Form**:
  * Nhúng khung nhập thẻ bảo mật chuẩn PCI-DSS của Stripe.
  * Hỗ trợ thanh toán nhanh bằng 1 chạm qua **Apple Pay** và **Google Pay**.

### Tuần 3: Trang Nhận Hàng Tức Thì & Cổng Khách Hàng (Customer Dashboard)
- [ ] Xây dựng trang **Order Received (`/checkout/order-received`)**:
  * Thông báo: *"Thanh toán thành công! Đơn hàng của bạn đã sẵn sàng"*.
  * Hộp hiển thị **License Key** có nút bấm "1-Click Copy".
  * Nút to: **"TẢI VỀ THEME ZIP NGAY"** (gọi API lấy Presigned S3 URL tải tốc độ cao).
  * Hướng dẫn 3 bước cài đặt nhanh và link tài liệu hướng dẫn.
- [ ] Xây dựng **Cổng Khách Hàng (`/my-account`)**:
  * **Trang Đăng Nhập / Đăng Ký** bảo mật (kết nối API Auth của Thành viên 02).
  * **Tab Tải xuống (My Downloads)**: Bảng liệt kê tất cả các theme đã mua, hiển thị số hiệu phiên bản mới nhất, nút tải lại bất kỳ lúc nào.
  * **Tab Quản lý Bản quyền (My Licenses)**:
    * Hiển thị License Key tương ứng với từng theme.
    * Danh sách các Domain đang kích hoạt.
    * Nút **"Hủy kích hoạt domain này (Deactivate)"** để khách tự chuyển sang domain mới khi cần mà không phải nhờ hỗ trợ viên.

### Tuần 4: Bảng Điều Khiển Quản Trị Viên (Admin CMS Portal)
- [ ] Xây dựng trang Admin `/admin`:
  * **Dashboard Thống kê:** Tổng doanh thu (VND & USD), Số đơn hàng hôm nay, Theme bán chạy nhất, Biểu đồ doanh thu 30 ngày qua (Recharts).
  * **Quản lý Đơn hàng (Orders):** Bảng danh sách đơn hàng, tìm kiếm theo email/mã đơn, xem chi tiết giao dịch thanh toán.
  * **Quản lý License:** Tìm kiếm key, trạng thái active/revoked, nút thu hồi license nếu phát hiện vi phạm chia sẻ lậu.
  * **Quản lý Theme:** Form thêm theme mới hoặc cập nhật version zip lên Cloudflare R2 / S3.

---

## 4. ĐIỂM GIAO TIẾP VỚI CÁC THÀNH VIÊN KHÁC (DEPENDENCY CONTRACTS)

| Thành viên | Giao tiếp / Bàn giao |
| :--- | :--- |
| **Thành viên 01 (DevOps & DB)** | Yêu cầu cấu hình CORS, HTTPS để Stripe Elements và WebSocket/Polling hoạt động trơn tru. |
| **Thành viên 02 (BE Core)** | Kết nối API Auth (login, register), API thông tin Profile khách hàng và API upload theme trong Admin. |
| **Thành viên 03 (BE Payment & License)** | Nhận dữ liệu mã QR VietQR, Stripe Client Secret, API kiểm tra trạng thái đơn hàng (`polling status`), và API Deactivate license. |
| **Thành viên 04 (FE Storefront)** | Nhận giỏ hàng khi người dùng bấm "Mua Ngay" từ trang Theme Single hoặc thanh Live Preview Bar. |

---

## 5. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DoD)
1. Luồng mua hàng thực tế hoàn thành trơn tru trong dưới 30 giây: Điền form ➔ Quét QR ➔ Tự động chuyển sang trang tải file và nhận License Key.
2. Không yêu cầu bất kỳ thông tin thừa nào về vận chuyển vật lý (không hỏi địa chỉ nhà, quận/huyện, mã bưu điện).
3. Khách hàng đăng nhập vào `/my-account` có thể xem đầy đủ License Key và bấm nút Hủy kích hoạt Domain thành công.
4. Bảng điều khiển Admin `/admin` hiển thị số liệu doanh thu chính xác, tải mượt mà dưới 1 giây.
