# 📝 NHẬT KÝ THAY ĐỔI: THÀNH VIÊN 05 (FRONTEND CHECKOUT, CUSTOMER PORTAL & ADMIN CMS)

> **Mục đích:** Ghi nhận toàn bộ các thao tác thêm, sửa, xóa mã nguồn liên quan đến One-Page Checkout, VietQR Modal, Khách hàng (/my-account) và Admin CMS (/admin) của Thành viên 05.

---

## 📅 LỊCH SỬ THAY ĐỔI (CHANGELOG)

### [2026-10-10] - Cấu hình & Chuẩn hóa ban đầu
- **Sửa (Fix):**
  - [`frontend/src/app/checkout/page.tsx`](file:///e:/VietNamChampion/theme/theme/frontend/src/app/checkout/page.tsx): Chuẩn hóa các câu lệnh import `useCartStore` và `VietQrModal`.

### [2026-10-12] - Member 05 — Cart Drawer
- **Thêm mới (Add):**
  - [`frontend/src/shared/stores/cart-storage.ts`](../frontend/src/shared/stores/cart-storage.ts): Adapter localStorage có xử lý JSON lỗi, storage bị chặn và lỗi quota. Chỉ lưu `theme_id`, `license_type`, `currency`; không lưu giá, thông tin thanh toán hoặc dữ liệu khách hàng.
  - [`frontend/src/components/layout/CartRoot.tsx`](../frontend/src/components/layout/CartRoot.tsx): Mount Drawer một lần ở root, khôi phục giỏ sau khi mount để tránh hydration mismatch và đóng Drawer khi chuyển route. Không đóng lại Drawer trong lần mount đầu.
  - [`frontend/tests/cart.store.test.cjs`](../frontend/tests/cart.store.test.cjs): Kiểm thử bằng Node test runner và TypeScript dependency có sẵn, không thêm test package.
- **Sửa đổi (Modify / Fix):**
  - [`frontend/src/shared/stores/cart.store.ts`](../frontend/src/shared/stores/cart.store.ts): Zustand persist có version và migration; đối chiếu ID với catalog, lấy lại giá VND/USD hiện hành, bỏ item lỗi/không tồn tại/license chưa được hỗ trợ, gộp ID trùng. Thêm lại cùng theme cập nhật item hiện có. Khôi phục giỏ trước thao tác ghi nếu người dùng tương tác trước mount effect. Chỉ nhận Regular, không thêm quantity và không quy đổi tiền tệ.
  - [`frontend/src/components/layout/MiniCartSlideover.tsx`](../frontend/src/components/layout/MiniCartSlideover.tsx): Hiển thị ảnh, tên đầy đủ, Regular License, giá, tạm tính/tổng cộng; xóa item, trạng thái trống và liên kết checkout/tiếp tục mua sắm. Bổ sung dialog semantics, nhãn nút, Escape, vòng focus, khôi phục focus và khóa cuộn nền. Tối ưu vùng cuộn và kích thước mobile.
  - [`frontend/src/components/layout/HeaderMain.tsx`](../frontend/src/components/layout/HeaderMain.tsx): Nút mở giỏ có nhãn truy cập và trạng thái mở/đóng.
  - [`frontend/src/app/layout.tsx`](../frontend/src/app/layout.tsx), [`frontend/src/app/page.tsx`](../frontend/src/app/page.tsx), [`frontend/src/app/themes/page.tsx`](../frontend/src/app/themes/page.tsx): Dùng Drawer tại root thay cho các instance riêng từng trang; header trên `/checkout` cũng mở được giỏ.
  - [`frontend/src/app/theme/[slug]/ThemeDetailClient.tsx`](../frontend/src/app/theme/[slug]/ThemeDetailClient.tsx): Giữ Regular theo giá catalog; vô hiệu hóa Agency/Lifetime và ghi “Tạm chưa mở bán”. Bỏ hiển thị giá suy ra cho hai gói bị khóa; không sửa hệ số hoặc API backend.
- **Chức năng đã hoàn thành:**
  - Thêm/xóa theme, không trùng ID; tổng tiền tự cập nhật theo giá catalog; persistence giỏ và loại tiền; xử lý dữ liệu lưu không hợp lệ; Drawer dùng chung desktop/mobile, mở/đóng và điều hướng `/checkout`.
  - Theo xác nhận của người dùng: chỉ bật Regular; chưa cho đổi sang Agency/Lifetime. Item Agency/Lifetime lưu cũ được loại bỏ, không tự chuyển sang gói khác. Không bổ sung quantity vì chưa có quy tắc bán nhiều license.
- **Xác minh (Verification) — kết quả thực tế:**
  - `npm ci --no-audit --no-fund`: Khôi phục 115 dependencies theo lockfile để kiểm thử; không thêm dependency, không sửa package manifest/lockfile. Lần chạy sandbox lỗi truy cập npm cache; lần chạy được cấp quyền hoàn tất.
  - `npm run type-check -- --incremental false`: PASS.
  - `npm run lint`: Exit code 0. Script hiện chỉ `echo`, chưa có lint thực sự.
  - `node --test tests/cart.store.test.cjs`: **11/11 PASS** — thêm/xóa/không trùng, khóa license, tổng VND/USD, refresh sau hydration, migration dữ liệu cũ, bỏ giá giả/ID lạ, JSON lỗi, storage bị chặn/quota, giỏ trống sau refresh và thao tác trước mount effect.
  - Trình duyệt tại `http://127.0.0.1:3000`: WoodMart + CorpPro = 1.680.000đ; thêm lại không tạo item trùng; xóa WoodMart còn 790.000đ; xóa hết hiện giỏ trống và refresh vẫn trống. Refresh giỏ có sản phẩm giữ đúng items; đổi USD và refresh giữ WoodMart $49; chuyển lại VND hiển thị 890.000đ.
  - Kiểm tra header mở Drawer ở trang chủ và checkout; link checkout tới đúng `/checkout` với tóm tắt sản phẩm; tiếp tục mua sắm tới `/themes`; thêm từ trang chi tiết; Agency/Lifetime disabled; đóng bằng nút và Escape; Tab từ nút cuối quay về nút đóng.
  - Kiểm tra viewport desktop 1366×900 và mobile 375×667, 320×568: Drawer không tràn ngang, vùng checkout nằm trong màn hình, danh sách có vùng cuộn riêng. Console không ghi nhận warning/error hay hydration mismatch trong các lượt kiểm tra.
  - `git diff --check`: PASS.
- **Vấn đề còn tồn tại / chuyển phần sau:**
  - Dữ liệu theme hiện chưa có giá riêng và danh sách license hỗ trợ theo từng sản phẩm. FE trước đây dùng Agency ×1.8/Lifetime ×2.5, BE dùng ×2/×3. Chờ thống nhất dữ liệu và quy tắc giá ở phần Checkout/Payment trước khi mở lại hai gói; backend giữ nguyên.
  - Các vấn đề checkout/API đã khảo sát trước đó (payload items, xử lý order items/giá nhiều sản phẩm, QR demo, xóa giỏ trước thanh toán, Stripe và route Order Received) nằm ngoài phần Cart Drawer và chưa được sửa/kiểm thử thanh toán.
  - Không commit hoặc push.
### [2026-10-12] - Member 05 — Checkout

- **Thêm mới (Add):**
  - `frontend/src/features/checkout/checkout-schema.ts`, `api-client.ts`, `checkout-request.ts`: validation phía client, dựng payload đầy đủ `items` Regular, kiểm tra response/status, timeout an toàn và idempotency key lưu trong `sessionStorage` dưới dạng random key theo digest (không lưu thông tin khách hàng hay thanh toán).
  - `database/migrations/003_checkout_requests.sql`: bảng idempotency bền vững, liên kết với `orders` trong cùng transaction. Đồng bộ định nghĩa cho database khởi tạo mới tại `database/schema.sql`.
  - `frontend/tests/checkout.test.cjs`, `backend/tests/member5_checkout.test.ts`: kiểm thử Checkout frontend và controller backend cô lập.
- **Sửa đổi (Modify / Fix):**
  - `frontend/src/app/checkout/page.tsx`, `features/checkout/components/vietqr-modal.tsx`: thay QR demo/fallback bằng response server đã kiểm tra; form name/email/phone có validation/error/loading; chặn gửi lặp; trạng thái trống; không xóa giỏ khi tạo đơn hoặc khi lỗi; chỉ bỏ các item của đơn sau status `paid` + `completed` được server xác nhận. Stripe/PayPal/USD được hiển thị chưa sẵn sàng, không đổi sang VietQR demo hoặc tự đổi tiền. Không điều hướng vào route Order Received chưa tồn tại.
  - `backend/src/validators/payment.validator.ts`: bắt buộc idempotency UUID, ít nhất một item, slug+ID và chỉ Regular; không nhận `unit_price` từ client.
  - `backend/src/controllers/order.controller.ts`, `models/order.model.ts`: lookup theme theo slug MySQL không fallback, đối chiếu ID+slug, tính tổng từ `price_vnd` server, lưu tất cả `order_items` atomically, trả lại cùng order cho retry cùng nội dung và không fallback in-memory cho Checkout. Từ chối gateway demo/chưa cấu hình.
- **Xác minh (Verification) — kết quả thực tế:**
  - `npm run type-check -- --incremental false` (frontend): PASS.
  - `npm run build` (frontend, Next production build): PASS; 22/22 static pages generated.
  - `node --test tests/checkout.test.cjs`: **4/4 PASS** — form invalid/empty cart/license/USD, payload items, duplicate submit/retry key, chỉ clear khi status paid/completed đúng order.
  - `node --test tests/cart.store.test.cjs`: **11/11 PASS** — Cart Drawer trước đó vẫn hoạt động.
  - `npm run build` và `npm run lint` (backend): PASS; backend lint là `tsc --noEmit`.
  - `backend/node_modules/.bin/tsx.cmd tests/member5_checkout.test.ts`: **5/5 PASS** với DB/model mock cô lập — items/giá server, price mismatch, schema, idempotency, Stripe/USD không tạo QR demo. Lần chạy trong sandbox bị lỗi hệ thống `uv_os_get_passwd ENOMEM`; chạy lại được cấp quyền PASS.
  - `npm run lint` frontend exit 0 nhưng script hiện chỉ `echo`, không phải lint thực sự. `git diff --check`: PASS.
  - Không chạy migration hay E2E với MySQL: Docker CLI của môi trường không có subcommand `compose` và bị từ chối đọc Docker config. Migration phải được review/chạy trên MySQL thật trước release. Không chạy legacy `backend npm test` ngoài sandbox vì script tạo order/payment/license thật và contract cũ không còn hợp lệ (nó không gửi `items`/idempotency).
- **Vấn đề còn tồn tại / chuyển phần sau:**
  - Catalog frontend hiện không khớp catalog MySQL: WoodMart frontend dùng slug/giá khác seed backend, và một số ID cũng chỉ theme khác. Checkout mới trả `CATALOG_MISMATCH`, giữ giỏ và không tạo đơn sai; cần owner dữ liệu thống nhất API catalog hoặc đồng bộ seed/frontend trước khi luồng thật có thể tạo đơn.
  - Agency/Lifetime vẫn khóa: frontend cũ ×1.8/×2.5 khác backend cũ ×2/×3; chưa có giá chính thức theo sản phẩm.
  - Stripe/PayPal hiện chỉ có code stub/test session, chưa được dùng cho Checkout. SePAY/VietQR cần account, account name, API key hợp lệ và migration thành công; QR không phải xác nhận thanh toán.
  - Không commit hoặc push.
