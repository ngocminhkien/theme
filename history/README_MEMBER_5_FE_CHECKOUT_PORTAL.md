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

### [2026-10-12] - Member 05 — Catalog Sync Frontend & MySQL

- **Nguyên nhân và nguồn dữ liệu:**
  - Catalog tĩnh cũ có 8 theme marketing; chỉ ID 1 cùng tên WoodMart nhưng slug/giá vẫn khác. MySQL seed có 10 theme `published`; từ ID 2 trở đi là các theme khác và thiếu ID 9/10 ở frontend.
  - Bảng `themes` MySQL là nguồn chính thức ở runtime: `GET /api/v1/themes`, `ThemeModel.findAll/findBySlug` và Checkout đều chỉ nhận bản ghi `published`. Frontend vẫn dùng catalog tĩnh vì toàn bộ routing/detail hiện được generate từ tĩnh; file tĩnh hiện là bản sao kiểm thử được của seed, còn backend vẫn xác minh MySQL khi đặt hàng.
- **Thêm mới (Add):**
  - [`frontend/tests/catalog-sync.test.cjs`](../frontend/tests/catalog-sync.test.cjs): đọc trực tiếp `database/seeds/01_seed_data.sql`, đối chiếu toàn bộ ID/tên/slug/giá VND-USD, uniqueness và số lượng category với catalog frontend.
- **Sửa đổi (Modify / Fix):**
  - [`frontend/src/shared/data/themes-data.ts`](../frontend/src/shared/data/themes-data.ts): đồng bộ đúng 10 bản ghi published (WoodMart, Flatsome, Porto, Astra Pro, Divi, Avada, Betheme, Electro, Enfold, OceanWP), category và giá Regular từ seed; không thêm giá Agency/Lifetime, tỷ giá hoặc khuyến mãi suy đoán.
  - [`frontend/src/components/home/{FeaturedThemesSection,HeroSection,PopularCategories,PromoDealBanner}.tsx`](../frontend/src/components/home), [`frontend/src/components/layout/{HeaderNavbar,HeaderTopBar,Footer,MiniCartSlideover}.tsx`](../frontend/src/components/layout), [`frontend/src/app/themes/page.tsx`](../frontend/src/app/themes/page.tsx): thay route category/slug cũ, bỏ entry deal/All-Access không có dữ liệu catalog và hiển thị số lượng catalog thực tế.
  - [`backend/src/models/theme.model.ts`](../backend/src/models/theme.model.ts): bỏ fallback WoodMart cũ giá 890.000đ/$49 khi query database lỗi; `findById` nay fail-closed theo MySQL published.
  - [`frontend/tests/cart.store.test.cjs`](../frontend/tests/cart.store.test.cjs), [`backend/tests/member5_checkout.test.ts`](../backend/tests/member5_checkout.test.ts): cập nhật giá seed và thêm case ID/slug bị giả phải trả `CATALOG_MISMATCH`.
- **Xác minh (Verification) — kết quả thực tế:**
  - `node --test tests/catalog-sync.test.cjs tests/cart.store.test.cjs tests/checkout.test.cjs`: **17/17 PASS** (catalog 2, cart 11, checkout 4).
  - `npm run type-check -- --incremental false` (frontend): PASS.
  - `backend/node_modules/.bin/tsx.cmd tests/member5_checkout.test.ts`: **6/6 PASS** với DB/model mock; bao gồm theme không tồn tại và ID/slug không trùng. Lần chạy trong sandbox lỗi `uv_os_get_passwd ENOMEM`, lần chạy được cấp quyền PASS.
  - Chưa khởi chạy MySQL hoặc gọi API thật; đối chiếu là với seed versioned và test controller mock, không tuyên bố đã xác minh database runtime.
- **Vấn đề còn tồn tại / chuyển phần sau:**
  - Nếu MySQL production không còn đúng seed này, cần owner dữ liệu chạy đối chiếu `GET /api/v1/themes`/DB thật và cập nhật catalog qua API hoặc một pipeline dữ liệu chính thức. Không thay seed/production trong phần này.
  - Agency/Lifetime vẫn khóa vì chưa có giá theo từng theme đã thống nhất. Không commit hoặc push.

### [2026-10-12] - Member 05 — Xác Minh Checkout Sau Catalog Sync

- **Luồng đã rà soát:**
  - Catalog → Cart: cart chỉ nhận ID có trong `THEMES_DATA`, khôi phục từ localStorage bằng ID và lấy lại giá/slug hiện hành; chỉ Regular.
  - Cart → Checkout: payload gửi `theme_id`, `theme_slug`, `license_type: regular`, dữ liệu khách hàng, currency và `total_amount` chỉ để đối chiếu giá. Giá không phải nguồn dữ liệu máy chủ.
  - Checkout → API: backend lookup slug trong MySQL published, đối chiếu ID, tự tính `price_vnd`, lưu `orders`, tất cả `order_items` và idempotency key trong một transaction. Retry cùng key/fingerprint trả lại đơn cũ, không ghi thêm.
- **Sửa đổi / kiểm thử bổ sung:**
  - [`frontend/next.config.js`](../frontend/next.config.js), [`frontend/tests/api-rewrite.test.cjs`](../frontend/tests/api-rewrite.test.cjs): chuẩn hóa `NEXT_PUBLIC_API_URL` khi đã chứa `/api/v1`; tránh rewrite sai thành `/api/v1/api/v1/orders/...` với `.env.example` và Docker hiện có.
  - [`frontend/tests/checkout.test.cjs`](../frontend/tests/checkout.test.cjs): xác minh API không khả dụng trả lỗi an toàn và vẫn giữ idempotency key để retry, không có logic xóa giỏ.
  - [`backend/tests/member5_checkout.test.ts`](../backend/tests/member5_checkout.test.ts): mock SePAY webhook xác minh đường đi paid + completed, payment VND và cấp license cho mọi `order_items`; không gọi ngân hàng hoặc database thật.
- **Trạng thái thanh toán:**
  - QR chỉ tạo đơn `pending`/`processing`; frontend chỉ xóa các item của chính đơn đó sau khi status API cùng mã đơn, currency, tổng tiền trả `paid` + `completed`. Lỗi API/tạo đơn và pending không xóa giỏ.
  - `paid`/`completed` được backend cập nhật qua `OrderModel.markAsPaid` khi webhook SePAY hợp lệ khớp mã đơn và số tiền; bản thân QR không được coi là thanh toán thành công.
- **Xác minh (Verification) — kết quả thực tế:**
  - `node --test tests/api-rewrite.test.cjs tests/catalog-sync.test.cjs tests/cart.store.test.cjs tests/checkout.test.cjs`: **19/19 PASS**. Đây là test frontend/static/mock fetch, không phải API runtime.
  - `backend/node_modules/.bin/tsx.cmd tests/member5_checkout.test.ts`: **7/7 PASS**; controller Checkout/Webhook đều dùng model/gateway mock.
  - `npm run type-check -- --incremental false` frontend, `npm run lint` backend (`tsc --noEmit`) và frontend production build (26/26 static pages): PASS. Frontend build tự bỏ qua lint/type validation theo config.
  - Runtime không khả dụng: port API 4000 không lắng nghe; `.env` local không có; Docker daemon/Compose không sử dụng được. Port 3306 mở nhưng truy vấn đọc-only bằng credential development bị `ER_ACCESS_DENIED_ERROR`. Vì vậy không gọi `GET /api/v1/themes`, không POST tạo đơn và không ghi bất kỳ dữ liệu DB nào.
- **Vấn đề còn tồn tại / bước tiếp theo:**
  - Frontend chưa gọi API catalog; hiện catalog tĩnh được guard so với seed. Cần chuyển sang API/pipeline catalog khi có môi trường runtime ổn định.
  - Chưa xác minh chữ ký webhook với SePAY thật. Payment + cấp license chưa chạy trong một transaction; lỗi sau `markAsPaid` có thể để đơn paid nhưng thiếu payment/license. Stripe routes vẫn là stub/test và không được Checkout dùng.
  - Không commit hoặc push.

### [2026-10-12] - Member 05 — Phần 4.1: Khảo Sát & Kế Hoạch VietQR/SePAY

- **Phạm vi:** Khảo sát source và lập kế hoạch; không sửa code nghiệp vụ, schema, cấu hình bí mật, không gọi SePAY/VietQR thật và không tạo thanh toán.
- **Luồng hiện có đã xác nhận từ source:**
  1. Checkout gửi item Regular, customer, VND/VietQR, total agreement và idempotency key tới `POST /api/v1/orders/checkout`.
  2. Backend xác minh catalog/giá MySQL, tạo `orders` + `order_items` + `checkout_requests` trong transaction và trả QR VietQR cùng trạng thái `pending`/`processing`.
  3. `VietQrModal` polling `GET /orders/:orderNumber/status` mỗi 5 giây; chỉ gọi `onPaid` khi mã đơn, currency, tổng tiền và cả `paid` + `completed` khớp.
  4. `POST /api/v1/webhooks/sepay` kiểm tra header Authorization theo key cấu hình, parse order number từ nội dung chuyển khoản, kiểm tra payment trùng/số tiền, gọi `markAsPaid`, ghi payment và cấp license cho các `order_items`.
  5. Không có route `/checkout/order-received`; sau `onPaid`, modal đóng/xóa item nhưng state `pending.order` vẫn là bản pending nên trang Checkout chưa có màn hình kết quả cuối chính xác.
- **Rủi ro đã xác nhận:**
  - Webhook/Payment/License không cùng transaction; lỗi sau `markAsPaid` có thể để paid/completed nhưng thiếu payment hoặc license. License không có unique key theo order item.
  - Guard payment trùng dựa vào query trước insert và lock trong một process. Dù DB có unique `(gateway, transaction_id)`, `PaymentModel.create` nuốt DB error sang in-memory nên webhook cạnh tranh nhiều instance vẫn có thể cấp license lặp.
  - Webhook không kiểm tra `gateway === vietqr`, `payment_method/currency` của order hoặc account đích; nhận số tiền `>=` tổng. Header key được compare constant-time khi cấu hình, nhưng `SEPAY_WEBHOOK_SECRET`/raw-body signature chưa được dùng và log invalid webhook có thể chứa toàn bộ headers.
  - QR không có expiry/cancel lifecycle; retry cùng browser dùng idempotency key, nhưng thông tin thay đổi/browser khác có thể tạo pending order khác. API/runtime SePAY và DB thật chưa kiểm thử.
- **Kế hoạch triển khai đề xuất (chưa thực hiện):**
  1. Tạo service xác nhận payment dùng DB transaction + lock order; validate gateway/currency/method/amount/order exact, insert transaction idempotently, cập nhật paid/completed và tạo license trong cùng transaction. Có migration unique fulfillment theo order item.
  2. Đối chiếu tài liệu SePAY trước khi đổi xác thực: dùng đúng cơ chế Authorization hoặc signature raw payload của nhà cung cấp; fail-closed khi thiếu secret, redact Authorization/raw payload khỏi logs và bổ sung rate limit/allowlist phù hợp.
  3. Thêm TTL cho QR/pending order và hành vi retry/cancel rõ ràng, không tái sử dụng QR quá hạn.
  4. Thêm `/checkout/order-received` hoặc cập nhật state bằng status cuối xác minh từ server; chỉ điều hướng/xóa giỏ sau fulfillment thành công. Thêm test retry/concurrency/failure-after-paid và E2E với SePAY sandbox/dev DB.
- **Xác minh / giới hạn:**
  - Đã đọc Checkout, modal, order/payment/license controller-model, route, schema/migration, `.env.example` và Docker Compose. Không chạy test hay runtime mới trong phần khảo sát.
  - API `:4000`, Docker daemon/Compose và credential MySQL development vẫn không khả dụng từ phần trước; không có `GET /themes`, checkout API, webhook hay database runtime test.
  - Không commit hoặc push.

### [2026-10-12] - Member 05 — Phần 4.2: An Toàn Webhook & Cấp License SePAY

- **Thiết kế/triển khai:**
  - [`backend/src/services/payment-fulfillment.service.ts`](../backend/src/services/payment-fulfillment.service.ts) xử lý SePAY/VietQR trực tiếp qua MySQL/InnoDB: transaction lấy `orders ... FOR UPDATE`, xác nhận order `vietqr`/`VND`/`pending`, account nhận (nếu SePAY gửi), số tiền VND **bằng đúng** tổng đơn, transaction ID và toàn bộ `order_items` Regular. Trong cùng transaction: ghi `payments`, cấp license từng item, rồi mới cập nhật `paid` + `completed`; bất kỳ lỗi ghi payment/license/status nào đều rollback. Pending order có license tồn tại sẵn bị chặn để đối soát thay vì tự đoán/cấp bù. Không dùng model fallback in-memory cho đường webhook này.
  - [`database/migrations/004_payment_fulfillment_idempotency.sql`](../database/migrations/004_payment_fulfillment_idempotency.sql) và [`database/schema.sql`](../database/schema.sql) thêm unique `licenses(order_id, theme_id, license_type)`. `payments(gateway, transaction_id)` đã có unique; hai lớp này cùng row lock ngăn replay/concurrency cấp license trùng. Migration chỉ thêm index khi chưa tồn tại và sẽ fail an toàn nếu database cũ có license trùng; chưa chạy migration.
  - [`backend/src/controllers/payment.controller.ts`](../backend/src/controllers/payment.controller.ts), [`validators/payment.validator.ts`](../backend/src/validators/payment.validator.ts): endpoint SePAY không còn mutex process-local/cập nhật trạng thái trước fulfillment/fallback theme ID 1. Payload sai account, order, VND, payment method, amount, item hoặc transaction bị reject/acknowledge an toàn; lỗi storage trả 503 để SePAY retry. Không log Authorization, body/content ngân hàng, account hay lỗi validation chứa giá trị người dùng; DB chỉ lưu audit payload đã rút gọn.
  - [`backend/src/services/sepay.service.ts`](../backend/src/services/sepay.service.ts), [`.env.example`](../.env.example): theo tài liệu SePAY API-key webhook, bắt buộc `Authorization: Apikey {SEPAY_API_KEY}` và fail-closed ở mọi environment khi key placeholder/thiếu. `SEPAY_WEBHOOK_SECRET` không được tự diễn giải thành HMAC/raw-body signature vì dashboard hiện chọn API Key; biến này được ghi chú là dành cho cấu hình HMAC tương lai.
- **Kiểm thử thực tế (mock/static, không phải MySQL/SePAY runtime):**
  - `backend npm run lint` và `backend npm run build`: PASS.
  - `backend/node_modules/.bin/tsx.cmd tests/member5_checkout.test.ts`: **9/9 PASS** — controller route, gateway/currency và API-key fail-closed.
  - `backend/node_modules/.bin/tsx.cmd tests/member5_payment_fulfillment.test.ts`: **6/6 PASS** — valid fulfillment, replay/concurrency mô phỏng (assert `FOR UPDATE`), mã đơn/amount/currency/method/account sai, paid/transaction trùng, payment/license failure rollback + retry, DB unavailable không fallback. Fake DB không thể thay thế kiểm thử concurrent lock của MySQL thật.
  - `frontend node --test tests/api-rewrite.test.cjs tests/catalog-sync.test.cjs tests/cart.store.test.cjs tests/checkout.test.cjs`: **19/19 PASS**; `frontend npm run type-check -- --incremental false`: PASS.
- **Giới hạn / bước tiếp theo:**
  - API :4000, Docker/Compose và credential MySQL local vẫn không chạy được; chưa chạy migration, không gọi webhook/API thật, không tạo payment thật. Cần DB owner review/chạy migration trên development database và kiểm tra MySQL row-lock/concurrency + SePAY sandbox thật trước release.
  - Đơn lịch sử đã `paid` nhưng thiếu license không được tự cấp lại từ webhook mới; cần quy trình đối soát/manual repair có kiểm soát. QR expiry, Order Received và Stripe/PayPal nằm ngoài phần này.
  - Không commit hoặc push.
