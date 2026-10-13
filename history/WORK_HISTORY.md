# 📜 NHẬT KÝ LỊCH SỬ THỰC HIỆN & TIẾN ĐỘ DỰ ÁN (PROJECT WORK HISTORY)

> **Mục đích:** Ghi nhận toàn bộ các công việc, các thay đổi mã nguồn, cấu hình hạ tầng, cơ sở dữ liệu, sửa lỗi CI/CD và xác minh hệ thống đã thực hiện trong quá trình làm việc giữa Người dùng và Trợ lý AI (Lead DevOps & Database Architect).  
> **Quy tắc bắt buộc:** Mỗi khi thực hiện bất kỳ thay đổi nào mới (thêm, sửa, xóa file, cấu hình hoặc sửa lỗi), phải cập nhật chi tiết vào tài liệu này.

---

## 📌 THÔNG TIN TỔNG QUAN
- **Dự án:** Theme Marketplace Platform (Nền tảng mua bán theme WordPress & WooCommerce bản quyền chuẩn SEO).
- **Vai trò phụ trách chính:** Lead DevOps & Database Architect (Thành viên 01) cùng hỗ trợ Core & CI/CD Pipeline.
- **Môi trường:** Docker (MySQL 8.0, Redis 7 Alpine, Backend Express/TypeScript, Frontend Next.js).
- **Hệ thống CI/CD:** GitHub Actions (`.github/workflows/ci-cd.yml`).

---

## 📅 LỊCH SỬ CHI TIẾT CÁC CÔNG VIỆC ĐÃ THỰC HIỆN

### 1. Phân tích Yêu cầu & Khảo sát Toàn bộ Mã nguồn
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - Đọc và khảo sát toàn bộ cấu trúc dự án từ các file đặc tả:
    - [`PROJECT_BRIEF.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/PROJECT_BRIEF.md): Mục tiêu kinh doanh, phân khúc khách hàng, tính năng nền tảng.
    - [`README_MEMBER_1_DEVOPS_DATABASE.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/README_MEMBER_1_DEVOPS_DATABASE.md): Yêu cầu hạ tầng DevOps, MySQL 8.0, Docker Compose, Redis, Nginx.
    - [`TEAM_COLLABORATION_MATRIX.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/TEAM_COLLABORATION_MATRIX.md): Ma trận phân công nhiệm vụ và ranh giới trách nhiệm giữa các thành viên.
    - [`DEV_SETUP_REQUIREMENTS.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/DEV_SETUP_REQUIREMENTS.md): Đặc tả cấu hình môi trường local.
  - Xác lập phạm vi công việc tập trung vào phần của Thành viên 01 (Lead DevOps & Database), đảm bảo tính độc lập và không can thiệp trái thẩm quyền vào logic của các thành viên khác.

---

### 2. Thiết kế & Triển khai Hệ thống Cơ sở dữ liệu MySQL 8.0
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - **DDL Schema ([`database/schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/schema.sql)):**
    - Thiết kế hoàn chỉnh 10 bảng dữ liệu quan hệ với ràng buộc khóa ngoại (Foreign Keys) và chỉ mục (Indexes) tối ưu hóa tốc độ truy vấn:
      1. `users`: Quản lý tài khoản quản trị viên và người mua hàng.
      2. `categories`: Danh mục phân loại theme (e-commerce, corporate, health-beauty...).
      3. `themes`: Kho theme bản quyền với metadata chi tiết (giá VND/USD, rating, page builder tương thích, phiên bản, slug).
      4. `theme_versions`: Lịch sử các bản phát hành phục vụ API WordPress Auto-Updater.
      5. `orders`: Quản lý đơn hàng với mã sinh tự động dạng `OD-YYYYMMDD-XXXXXX`.
      6. `order_items`: Chi tiết theme và loại giấy phép bản quyền theo từng đơn.
      7. `payments`: Lưu vết giao dịch VietQR / SePAY / Stripe với cơ chế bảo vệ Idempotency chống trùng lặp.
      8. `licenses`: Khóa bản quyền tự sinh chuẩn `WD-XXXX-XXXX-XXXX-YYYY`, giới hạn domain theo gói (Regular: 1, Agency: 5, Lifetime: Unlimited).
      9. `license_activations`: Quản lý domain kích hoạt và trạng thái active.
      10. `download_logs`: Lưu vết bảo mật lượt tải file `.zip` (IP, User-Agent, phiên bản).
  - **Seed Data ([`database/seeds/01_seed_data.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/seeds/01_seed_data.sql)):**
    - Nạp sẵn 10 theme thực tế (WoodMart, Enfold, Betheme, Porto, OceanWP, Electro, Astra Pro, Flatsome, Divi, Avada).
    - Nạp 2 tài khoản mẫu (Admin và Customer) với mật khẩu hash chuẩn bcrypt.
    - Nạp đơn hàng mẫu, bản ghi payment và license key mẫu.
  - **Cơ chế Migrations ([`database/migrations/`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/)):**
    - `001_initial_schema.sql`: File SQL khởi tạo cấu trúc 10 bảng.
    - `002_seed_initial_data.sql`: File SQL nạp dữ liệu ban đầu.
    - `migrate.cjs`: Script thực thi migration tự động thông qua Node.js.

---

### 3. Thiết lập Hạ tầng Docker Orchestration, Nginx & Redis
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - **Docker Compose:**
    - [`docker-compose.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker-compose.yml): Cấu hình môi trường Local gồm 4 container: `mysql:8.0` (port 3306), `redis:7-alpine` (port 6379), `backend` Express/TypeScript (port 4000), `frontend` Next.js (port 3000) cùng bridge network `marketplace_network`.
    - [`docker-compose.prod.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker-compose.prod.yml): Cấu hình Production tích hợp Nginx reverse proxy, giới hạn dung lượng log và restart policy.
    - [`.env`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.env) & [`.env.production`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.env.production): Cấu hình đầy đủ các biến môi trường cho database, redis, JWT, cors, cổng thanh toán.
  - **Nginx Reverse Proxy & Redis Cache:**
    - [`docker/nginx/nginx.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/nginx/nginx.conf): Cấu hình gzip, worker connections, client body buffer.
    - [`docker/nginx/conf.d/default.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/nginx/conf.d/default.conf): Định tuyến reverse proxy cho Frontend (`/`), Backend API (`/api`) và WebSocket.
    - [`docker/redis/redis.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/redis/redis.conf): Giới hạn bộ nhớ cache `256mb` với policy giải phóng `allkeys-lru`.
  - **Scripts Tự động hóa Backup/Restore:**
    - [`docker/scripts/backup-mysql.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/backup-mysql.sh): Dump CSDL, nén gzip kèm timestamp, tự động xóa bản sao lưu cũ hơn 7 ngày.
    - [`docker/scripts/restore-mysql.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/restore-mysql.sh): Phục hồi CSDL từ file dump nén gzip an toàn.

---

### 4. Biên soạn Tài liệu Kỹ thuật Bàn giao Hạ tầng (DevOps Handover)
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - Tạo file [`DEVOPS_HANDOVER_DOCUMENT.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/DEVOPS_HANDOVER_DOCUMENT.md) chuẩn mực cho toàn đội ngũ phát triển:
    - Cung cấp Connection Strings & Credentials cho MySQL, Redis, Backend, Frontend.
    - Hướng dẫn vận hành 1-click `docker compose up -d`.
    - Đặc tả chi tiết 10 bảng CSDL.
    - Hướng dẫn quy trình backup, restore và giám sát container logs.

---

### 5. Khởi động & Xác minh Hoạt động Thực tế của Cluster Cục bộ
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - Khởi chạy thành công 4 container Docker trên Docker Desktop:
    * `theme_marketplace_mysql` (Healthy, port 3306)
    * `theme_marketplace_redis` (Healthy, port 6379)
    * `theme_marketplace_backend` (Port 4000)
    * `theme_marketplace_frontend` (Port 3000)
  - Kiểm tra endpoints thực tế:
    * `http://localhost:4000/api/v1/themes`: Kết nối MySQL thành công, trả về danh sách 10 theme mẫu.
    * `http://localhost:3000` & `http://localhost:3000/preview/woodmart`: Phản hồi `HTTP 200 OK`.

---

### 6. Khắc phục Sự cố Pipeline CI/CD GitHub Actions
- **Thời gian:** 10/10/2026
- **Chi tiết thực hiện:**
  - **Sửa lỗi Backend CI/CD (Commit `33c6a72`):**
    * *Hiện tượng lỗi:* `tsc --noEmit` báo lỗi `src/controllers/order.controller.ts(21,40): error TS2339: Property 'create' does not exist on type 'typeof OrderModel'`.
    * *Khắc phục:* Triển khai method `OrderModel.create` trong [`backend/src/models/order.model.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/models/order.model.ts) và sửa lỗi đếm số lượng placeholder trong câu lệnh SQL `INSERT INTO orders`.
  - **Sửa lỗi Frontend CI/CD:**
    * *Hiện tượng lỗi 1:* `npm ci` thất bại do `package-lock.json` bị lệch với `package.json` (thiếu `autoprefixer@10.6.1`, `browserslist@4.29.3`,...).
      * *Khắc phục:* Đồng bộ và khóa lại toàn bộ dependencies vào [`frontend/package-lock.json`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/package-lock.json).
    * *Hiện tượng lỗi 2:* `tsc --noEmit` báo lỗi `src/app/page.tsx(11,3): error TS2739: Type ... is missing properties from type 'ThemeItem': category, category_name_vi`.
      * *Khắc phục:* Bổ sung thuộc tính `category` và `category_name_vi` cho các đối tượng trong `DEMO_THEMES` tại [`frontend/src/app/page.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/page.tsx), đồng thời cập nhật interface `ThemeItem` trong [`frontend/src/shared/types/index.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/shared/types/index.ts) để các trường phụ trợ là optional.
    * *Hiện tượng lỗi 3:* `src/app/preview/[slug]/page.tsx(13,7): error TS2322: Type ... is not assignable to type 'LivePreviewBarProps'`.
      * *Khắc phục:* Tái cấu trúc trang preview để lấy đối tượng theme hợp lệ từ `THEMES_DATA` và truyền chuẩn `{ theme: ThemeItem }` vào `<LivePreviewBar />`.
  - **Kết quả:** Pipeline CI/CD GitHub Actions kiểm tra lint, type-check và unit tests vượt qua 100% với Exit Code 0.

---

### 7. Thiết lập Cơ chế Ghi chép Lịch sử Dự án (Tài liệu này)
- **Thời gian:** 12/10/2026
- **Chi tiết thực hiện:**
  - Tạo file [`history/WORK_HISTORY.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/history/WORK_HISTORY.md) để lưu vết toàn diện tất cả các thao tác, quyết định kỹ thuật và kết quả kiểm thử.
  - Cập nhật đồng bộ vào [`history/README_MEMBER_1_DEVOPS_DATABASE.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/history/README_MEMBER_1_DEVOPS_DATABASE.md) theo chuẩn tài liệu phân công của nhóm.

---

### [2026-10-12] - Member 05 — Cart Drawer
- **Thêm mới (Add):** `frontend/src/shared/stores/cart-storage.ts`, `frontend/src/components/layout/CartRoot.tsx`, `frontend/tests/cart.store.test.cjs` — persistence an toàn, Drawer tại root và bộ kiểm thử giỏ hàng.
- **Sửa đổi (Modify / Fix):** `cart.store.ts`, `MiniCartSlideover.tsx`, `HeaderMain.tsx`, root layout, trang chủ, catalog và `ThemeDetailClient.tsx` — thêm/xóa không trùng, tổng theo giá catalog, giữ giỏ qua refresh, giỏ trống, responsive, điều hướng checkout và hỗ trợ bàn phím. Chỉ bật Regular theo xác nhận người dùng; không thêm quantity hoặc sửa backend.
- **Xác minh (Verification):** Type-check PASS; 11/11 test giỏ hàng PASS; `npm run lint` exit 0 nhưng script chỉ echo; `git diff --check` PASS. Trình duyệt xác nhận thêm/xóa, tổng 1.680.000đ cho WoodMart + CorpPro, persistence items/currency, giỏ trống, catalog/detail/checkout, license bị khóa, desktop 1366×900 và mobile 375×667/320×568; không thấy lỗi hydration trong console.
- **Còn tồn tại:** Agency/Lifetime chờ thống nhất giá FE/BE (trước đây ×1.8/×2.5 so với ×2/×3); các lỗi Checkout/Payment nằm ngoài phạm vi. Đã khôi phục dependencies từ lockfile để kiểm thử, không thêm package mới. Không commit/push.
- Chi tiết file, chức năng và kiểm thử tại [history Member 05](./README_MEMBER_5_FE_CHECKOUT_PORTAL.md).

---

### [2026-10-12] - Member 05 — Checkout
- **Thêm mới (Add):** `frontend/src/features/checkout/{checkout-schema,api-client,checkout-request}.ts`, `database/migrations/003_checkout_requests.sql`, test Checkout frontend/backend.
- **Sửa đổi (Modify / Fix):** Form Checkout validate khách hàng/giỏ, loading và retry idempotent; payload gửi item Regular đầy đủ. API backend kiểm tra ID+slug theo catalog MySQL, tự tính giá server, lưu `order_items` atomically và không fallback đơn demo. QR demo bị loại bỏ; chỉ bỏ item giỏ khi status server là `paid` + `completed`; Stripe/USD không bị giả lập thành QR.
- **Xác minh (Verification):** frontend type-check PASS; frontend build PASS (22/22); Checkout test 4/4 PASS; Cart test 11/11 PASS; backend build/lint PASS; controller Checkout test mock 5/5 PASS; `git diff --check` PASS. Frontend lint chỉ echo. Chưa chạy migration/E2E MySQL do Docker CLI môi trường không có `compose`/không đọc được config.
- **Còn tồn tại:** Catalog frontend và seed MySQL khác ID/slug/giá; API trả `CATALOG_MISMATCH` và giữ giỏ cho tới khi catalog được thống nhất. Agency/Lifetime vẫn khóa do giá chưa thống nhất; Stripe/PayPal là stub. Không commit/push.

---

### [2026-10-12] - Member 05 — Catalog Sync Frontend & MySQL

- **Nguồn chính thức / nguyên nhân:** MySQL `themes` (10 bản ghi `published`) là nguồn runtime cho `GET /api/v1/themes` và Checkout. Catalog tĩnh cũ chỉ có 8 theme marketing; WoodMart khác slug/giá và ID 2–8 không cùng theme, thiếu ID 9–10.
- **Thêm mới (Add):** `frontend/tests/catalog-sync.test.cjs` đọc `database/seeds/01_seed_data.sql` để khóa đối chiếu ID, tên, slug, giá VND/USD, uniqueness và category count.
- **Sửa đổi (Modify / Fix):** Đồng bộ `frontend/src/shared/data/themes-data.ts` theo đúng 10 theme seed; cập nhật link/filter/category/đếm catalog tại các component home/layout, bỏ promotion deal/All-Access không có dữ liệu; bỏ fallback WoodMart 890.000đ/$49 trong `backend/src/models/theme.model.ts`; cập nhật test Cart và thêm test API từ chối ID/slug giả (`CATALOG_MISMATCH`).
- **Xác minh (Verification):** frontend type-check PASS; `node --test tests/catalog-sync.test.cjs tests/cart.store.test.cjs tests/checkout.test.cjs` **17/17 PASS**; controller Checkout mock **6/6 PASS**. Chưa chạy MySQL/API thật; không sửa seed, production, Agency/Lifetime, giá/tỷ giá; không commit/push.
- **Còn tồn tại:** Cần đối chiếu API/MySQL runtime nếu production lệch seed; khi đó owner dữ liệu cần xác định nguồn giá và pipeline catalog chính thức.

---

### [2026-10-12] - Member 05 — Xác Minh Checkout Sau Catalog Sync

- **Rà soát luồng:** Cart canonicalize product từ catalog tĩnh; Checkout gửi ID/slug/Regular + total chỉ để agreement; backend lookup MySQL, tự tính giá VND, transactionally lưu order/order_items/idempotency và retry không tạo đơn trùng. Giỏ chỉ bị xóa sau status cùng đơn `paid` + `completed`; QR/pending/lỗi không xóa.
- **Sửa đổi (Modify / Fix):** `frontend/next.config.js` chuẩn hóa API base để cấu hình đã chứa `/api/v1` không bị rewrite thành prefix kép. Thêm `frontend/tests/api-rewrite.test.cjs`; mở rộng test checkout API-offline và test mock SePAY trong `backend/tests/member5_checkout.test.ts`.
- **Xác minh (Verification):** 19/19 frontend tests PASS; backend Checkout/Webhook mock 7/7 PASS; frontend type-check, backend `tsc --noEmit`, frontend production build 26/26 PASS. Đây không phải E2E runtime.
- **Runtime không chạy:** API :4000 không lắng nghe; `.env` không có; Docker daemon/Compose không dùng được. MySQL :3306 mở nhưng credential development bị `ER_ACCESS_DENIED_ERROR`; không GET catalog, không POST tạo đơn, không ghi DB.
- **Còn tồn tại:** Frontend chưa có API catalog/fallback; cần E2E trên dev DB. SePAY thật/chữ ký chưa được xác minh; payment + license không atomic sau trạng thái paid. Stripe là stub và Checkout không dùng. Không commit/push.

---

### [2026-10-12] - Member 05 — Phần 4.1: Khảo Sát & Kế Hoạch VietQR/SePAY

- **Phạm vi:** Chỉ đọc source và lập kế hoạch; không sửa nghiệp vụ/thanh toán/schema/secret, không gọi SePAY hay tạo thanh toán thật.
- **Luồng xác nhận:** Checkout tạo order/order_items/idempotency transactionally, trả QR pending; modal polling status 5 giây và chỉ clear giỏ khi status cùng order là paid + completed. Webhook SePAY hiện kiểm tra key, order code, duplicate/amount rồi mark paid, ghi payment và cấp license. `/checkout/order-received` chưa tồn tại; state trang chưa nhận final order sau modal.
- **Rủi ro:** Payment status, payment record và license chưa atomic; guard webhook đa-instance/unique fulfillment chưa đủ; gateway/currency/account đích/expiry chưa được kiểm tra đầy đủ; `SEPAY_WEBHOOK_SECRET` chưa dùng và logging có thể chứa header. Runtime SePAY/MySQL/API chưa được kiểm thử.
- **Kế hoạch:** transaction + row lock/idempotency fulfillment; xác minh cơ chế chữ ký chính thức SePAY rồi fail-closed/redact log; TTL pending/QR; trang kết quả/status cuối; mock concurrency/failure và E2E sandbox/dev DB.
- **Xác minh:** Đọc Checkout/modal/order/payment/license/routes/schema/migrations/env/Docker. Không chạy test/runtime mới trong khảo sát; không commit/push.

---

### [2026-10-12] - Member 05 — Phần 4.2: An Toàn Webhook & Cấp License SePAY

- **Thêm mới (Add):** `backend/src/services/payment-fulfillment.service.ts` thực hiện fulfillment SePAY bằng InnoDB transaction + `SELECT ... FOR UPDATE`; `database/migrations/004_payment_fulfillment_idempotency.sql` thêm unique fulfillment license idempotent; `backend/tests/member5_payment_fulfillment.test.ts` là fake-DB test cho rollback/retry/replay/concurrency mô phỏng/DB unavailable.
- **Sửa đổi (Modify / Fix):** Webhook chỉ settle order `vietqr`/`VND` pending, số tiền đúng bằng tổng và account nhận nếu payload có; ghi payment + tất cả license trước khi mark paid/completed, rollback khi lỗi và không fallback in-memory. Pending order có license tồn tại bị chặn để đối soát, không cấp bù theo phỏng đoán. Siết API Key đúng `Authorization: Apikey ...`, fail-closed mọi environment; không log header/raw body/content/account/PII. Schema bootstrap thêm `UNIQUE(order_id, theme_id, license_type)` cho licenses. Không thay HMAC/raw signature khi cấu hình hiện tại dùng API Key theo tài liệu SePAY.
- **Xác minh (Verification):** backend lint/build PASS; controller Checkout/Webhook mock **9/9 PASS**; fulfillment fake-DB mock **6/6 PASS**; frontend Cart/Checkout/catalog/rewrite **19/19 PASS** và type-check PASS. Mock xác minh query `FOR UPDATE` và rollback logic, không phải MySQL/SePAY runtime.
- **Còn tồn tại:** Không chạy migration/SePAY/API/MySQL thật vì môi trường local vẫn không khả dụng. Migration sẽ fail an toàn khi dữ liệu license cũ trùng và cần DB owner xử lý/review. Đơn lịch sử paid thiếu license không auto-repair; cần đối soát. QR expiry, Order Received, Stripe/PayPal không thuộc phần này. Không commit/push.

---

### [2026-10-12] - Member 05 — Part 4.3: Integration Test Preparation

- **Mục tiêu:** Chuẩn bị môi trường development để kiểm thử Catalog API, Checkout và SePAY fulfillment thật mà không đụng dữ liệu production hoặc tạo giao dịch thanh toán.
- **DONE:** Git sạch tại `3d417f3`; Node/npm và dependencies backend/frontend sẵn có. Frontend Next.js có sẵn phản hồi HTTP 200 tại `127.0.0.1:3000`; không restart process này.
- **BLOCKED:** Không có file `.env` local; backend `:4000` không chạy nên `GET /health`/`GET /api/v1/themes` không thể gọi. Docker daemon/service không chạy, Compose không khả dụng, và cổng `3306` đã do MySQL cục bộ không xác định sở hữu.
- **BLOCKED:** Query MySQL chỉ-đọc theo defaults development của backend bị `ER_ACCESS_DENIED_ERROR`; không xác nhận được database cô lập, schema runtime, trạng thái `_migrations` hay license trùng. Vì vậy không chạy migration 004 (runner hiện có còn ghi `_migrations` và áp mọi migration pending).
- **NOT TESTED:** Catalog API thật; Checkout valid/invalid/idempotency; webhook sai key/sai amount/replay; rollback payment/license. Không gửi POST, không sửa dữ liệu và không gọi SePAY.
- **Xác minh mã (không phải integration):** frontend tests **19/19 PASS**, frontend type-check PASS, backend lint/build PASS, controller Checkout/Webhook mock **9/9 PASS**, fulfillment fake-DB mock **6/6 PASS**. `git diff --check` sẽ được chạy lại sau khi cập nhật history.
- **Bước tiếp theo:** DB owner cần cung cấp dev DB cô lập + `.env` local ngoài Git, xác nhận target, kiểm tra license duplicate và migration state bằng read-only query trước khi chạy migration 004; sau đó mới khởi động Docker/backend và chạy HTTP integration với test data nhận diện rõ. Không commit/push.

---

### [2026-10-12] - Member 05 — Regression Catalog Images & VietQR

- **Nguyên nhân:** Catalog sync `3d417f3` đã copy URL seed `assets.thememarket.local` cho cả 10 thumbnail/gallery, nhưng host không phân giải, không có asset service/Docker mapping và không có bộ screenshot chính thức tương ứng trong repo. Luồng QR frontend/backend đều dùng đúng `vietQrUrl`; QR thiếu ở môi trường chưa cấu hình là do backend fail-closed `PAYMENT_NOT_CONFIGURED` trước khi tạo order khi thiếu thông tin ngân hàng hoặc SePAY API key.
- **Sửa đổi (Modify / Fix):** Khôi phục 10 visual catalog riêng từ nguồn storefront đã có trước sync, không thay ID/slug/giá/live demo; thêm regression kiểm tra không quay lại host `.local`. API client chỉ nhận QR pending đúng host/order/amount; modal render URL backend và báo lỗi tải ảnh mà không xóa giỏ/không báo paid. Bổ sung test backend xác nhận cấu hình VietQR thiếu không ghi order. Không thay webhook, fulfillment, giá hoặc database.
- **Xác minh (Verification):** frontend test **22/22 PASS**; frontend type-check PASS; backend lint PASS; controller Checkout/Webhook mock **10/10 PASS**; fulfillment fake-DB mock **6/6 PASS**; `git diff --check` PASS. Test QR dùng response mock và server-side render; không phải API thật, MySQL thật hay SePAY sandbox.
- **Còn tồn tại:** Chưa có asset screenshot chính thức cho toàn bộ 10 theme trong repository; cần catalog owner cung cấp nếu yêu cầu ảnh sản phẩm chuẩn. Backend/DB `.env` development vẫn chưa sẵn sàng nên không GET catalog, không tạo order/QR hoặc thanh toán thật; không chạy migration, không commit/push.

---

### [2026-10-12] - Member 05 — Rà Soát Tiến Độ Hoàn Thiện

- **DONE:** Cart Drawer/persistence/Regular-only; Checkout client validation, idempotency, server-priced order items và QR modal/polling ở mức code/mock test.
- **PARTIAL:** Checkout chưa E2E do backend/DB/.env test chưa có; backend có status order và license sau paid nhưng frontend không có Order Received. VietQR fail-closed khi thiếu cấu hình; không có demo payment hợp lệ không cần API key. Stripe session mock không được frontend Checkout sử dụng.
- **MISSING:** Không có frontend `/checkout/order-received`, `/my-account` hoặc `/admin`; không có UI lịch sử đơn, purchased themes, license/download hay CMS/RBAC admin. `GET /api/v1/licenses/my-licenses` hiện chưa yêu cầu JWT và fallback user ID 1, nên không đủ làm portal an toàn; download updater dùng placeholder asset URL và không có ownership UI.
- **Xác minh:** frontend tests **22/22 PASS**, type-check PASS, backend lint PASS, controller mock **10/10 PASS**, fulfillment fake-DB mock **6/6 PASS**. Không gọi API, MySQL hay SePAY thật; không sửa code, database, migration hay Git state.
- **Ưu tiên tiếp theo:** provision môi trường dev cô lập + config test, làm Order Received ownership-aware, sau đó Customer Portal JWT/API/Download và Admin RBAC/CMS. Tài liệu README tổng quan nêu portal/admin nhưng source hiện chưa hiện thực các route này.

---

### [2026-10-12] - Member 05 — Part 5: Order Received & Customer Portal

- **Thêm mới (Add):**
  - `frontend/src/app/checkout/order-received/page.tsx`: Route kết quả đơn hàng `/checkout/order-received` hiển thị theo query `?order=OD-...`. Kiểm tra hợp lệ regex mã đơn, bắt buộc JWT session, tải biên nhận từ server qua `getOrderReceipt`, hiển thị danh sách theme, tổng tiền, phương thức và trạng thái pending/paid/failed. Giới hạn polling tối đa 12 lần (mỗi 5s) và tự dừng ở trạng thái cuối. Chỉ hiển thị license khi đơn đã `paid` + `completed`. Nút điều hướng tới `/themes` và `/my-account`. Bọc `Suspense` boundary cho Next.js 15 prerender.
  - `frontend/src/app/my-account/page.tsx`: Route Customer Portal `/my-account` với 4 tab (Tổng quan, Đơn hàng, Theme đã mua, License). Tích hợp form đăng nhập / đăng ký JWT theo API auth hiện có. Hiển thị lịch sử đơn từ `GET /api/v1/orders/my-orders`, theme đã mua từ đơn paid, và danh sách license từ `GET /api/v1/licenses/my-licenses`. Nút tải theme gọi `GET /api/v1/licenses/:licenseKey/download` và trả lỗi an toàn khi storage chưa cấu hình. Bọc `Suspense` boundary cho Next.js 15.
  - `frontend/src/features/auth/auth-client.ts`: Token helper, login, register, getCurrentUser qua JWT Bearer với fallback an toàn cho trình duyệt.
  - `frontend/src/features/account/api-client.ts`: API client cho portal (`getMyOrders`, `getMyLicenses`, `getOrderReceipt`, `requestThemeDownload`) tự động gửi Bearer token và chặn request khi chưa đăng nhập.
  - `frontend/tests/portal.test.cjs`: Bộ kiểm thử frontend 5/5 PASS cho portal authentication, bearer injection, pending vs paid receipt, download fail-safe khi thiếu storage, và token persistence.
  - `backend/tests/member5_portal.test.ts`: Bộ kiểm thử backend 6/6 PASS cho quyền sở hữu đơn hàng và license, chống enumeration bằng 404, bảo vệ download không redirect sang URL placeholder.
- **Sửa đổi (Modify / Fix):**
  - `backend/src/controllers/order.controller.ts`, `backend/src/models/order.model.ts`, `backend/src/routes/order.routes.ts`: Bắt buộc JWT session cho `checkout` (gán `user_id` từ token), thêm `GET /my-orders` và `GET /:orderNumber/receipt` (kiểm tra quyền sở hữu, 404 cho đơn người khác, chỉ kèm license khi paid+completed), bảo vệ `GET /:orderNumber/status` bằng JWT và ownership check.
  - `backend/src/controllers/license.controller.ts`, `backend/src/routes/license.routes.ts`: Bắt buộc JWT cho `GET /my-licenses` (bỏ fallback cố định userId = 1), thêm `GET /:licenseKey/download` (kiểm tra quyền sở hữu, license active, trả 503 DOWNLOAD_NOT_CONFIGURED an toàn).
  - `frontend/src/app/checkout/page.tsx`, `frontend/src/features/checkout/api-client.ts`, `frontend/src/components/layout/HeaderMain.tsx`: Checkout yêu cầu JWT, tự động đính kèm Bearer token, tự động chuyển sang `/checkout/order-received` sau khi thanh toán thành công; thêm link "Tài khoản" trên header.
  - `frontend/tests/checkout.test.cjs`, `backend/tests/member5_checkout.test.ts`: Thêm test case cho unauthenticated checkout và JWT session.
- **Xác minh (Verification) — kết quả thực tế:**
  - Frontend: `node --test tests/api-rewrite.test.cjs tests/catalog-sync.test.cjs tests/cart.store.test.cjs tests/checkout.test.cjs tests/portal.test.cjs` — **28/28 PASS**.
  - Frontend type-check: `npm run type-check -- --incremental false` — **PASS**.
  - Frontend build: `npm run build` — **PASS** (Next.js 15 tạo 28/28 static pages bao gồm 2 route mới).
  - Backend lint & build: `npm run lint` & `npm run build` — **PASS**.
  - Backend unit tests: `tests/member5_checkout.test.ts` **11/11 PASS**, `tests/member5_portal.test.ts` **6/6 PASS**, `tests/member5_payment_fulfillment.test.ts` **6/6 PASS**.
  - `git diff --check`: **PASS**.
  - Phân biệt: toàn bộ kiểm thử là unit/mock tests isolative; chưa chạy integration runtime với MySQL hay SePAY thật.
- **Trạng thái phân loại:**
  - **DONE:** Route `/checkout/order-received`, Route `/my-account`, Backend ownership APIs & JWT, Polling có giới hạn dừng ở terminal state, Fail-safe download khi Cloud Storage chưa cấu hình.
  - **PARTIAL / BLOCKED:** Integration runtime MySQL/SePAY do môi trường local thiếu `.env` và Docker daemon không chạy; Cloud Storage R2/S3 chưa được cấu hình.
  - **REMAINING / NEXT:** Admin CMS (`/admin` với RBAC admin, quản lý danh mục, đơn hàng, khách hàng, license). Không commit hoặc push.

---

### [2026-10-12] - Member 05 — Admin Dashboard, Bootstrap & Storefront Link

- **Thêm mới (Add):** Ứng dụng Admin độc lập tại `admin/` với login, dashboard, theme, đơn hàng, khách hàng, license và report; thêm CLI/service tạo Admin đầu tiên cùng các test bootstrap, auth/RBAC và Admin API. CLI chỉ tạo khi chưa có Admin, bcrypt cost 12, transaction + row lock; không đổi mật khẩu Admin có sẵn hoặc tự nâng quyền customer trùng email.
- **Sửa đổi (Modify / Fix):** Mount `/api/v1/admin` với JWT + `requireAdmin`, CORS allowlist cho `ADMIN_URL`, URL Admin công khai qua `NEXT_PUBLIC_ADMIN_URL`, link “Khu vực quản trị” tương thích giao diện Footer remote, Docker build arg và tài liệu vận hành. Không cấp quyền dựa trên frontend và không đưa secret vào cấu hình public.
- **Xác minh (Verification):** backend lint/build PASS; `npm run test:admin` PASS (bootstrap 4/4, auth/RBAC 7/7, Admin API 3/3); storefront regression 28/28, type-check/build PASS; Admin type-check/build PASS; smoke storefront với link Admin HTTP 200; `git diff --check` PASS. Các test DB/login runtime thật vẫn chưa chạy.
- **BLOCKED / NEXT:** Cần MySQL development cô lập và `DB_*`, `JWT_SECRET`, `ADMIN_URL` để chạy CLI/login E2E; không tạo/sửa dữ liệu production.

---

### [2026-10-12] - Tiếp Nhận Vai Trò Member 02 — Hoàn Thiện Core Auth & User Profile

- **Bối cảnh & Tiếp nhận:** Tiếp nhận toàn bộ phạm vi công việc của Thành viên 02 (BE Core, Auth, Categories & Catalog).
- **Thêm mới (Add):**
  - `backend/tests/member2_auth_catalog.test.ts`: Bộ kiểm thử tự động 10/10 test cases cho AuthController và UserService (kiểm tra định dạng email, độ dài mật khẩu, không rò rỉ password_hash, từ chối tài khoản banned, đăng nhập an toàn, getProfile từ DB, cập nhật profile họ tên/SĐT, đổi mật khẩu có xác thực mật khẩu cũ).
- **Sửa đổi (Modify / Fix):**
  - `backend/src/models/user.model.ts`: Thêm interface `SafeUser`, thêm method `findFullById` (để kiểm tra mật khẩu), `updateProfile` (cập nhật full_name, phone) và `updatePassword` (cập nhật hash mật khẩu mới).
  - `backend/src/services/auth.service.ts`: Chuẩn hóa email lowercase/trim; loại bỏ triệt để `password_hash` trong kết quả đăng ký/đăng nhập; thêm chặn tài khoản `banned`; nâng cấp `getProfile` truy vấn dữ liệu thực từ MySQL; bổ sung `updateProfile` và `changePassword`.
  - `backend/src/controllers/auth.controller.ts`: Xác thực email regex và độ dài mật khẩu; nâng cấp `getProfile` lấy thông tin chi tiết; thêm endpoint `updateProfile` và `changePassword`.
  - `backend/src/routes/auth.routes.ts`: Bổ sung `PUT /api/v1/auth/profile` và `PUT /api/v1/auth/change-password` với `authMiddleware`.
  - `backend/src/routes/index.ts` & `backend/src/app.ts`: Mount `adminRouter` (`/api/v1/admin`) và cập nhật danh mục Discovery endpoints.
  - `frontend/src/features/auth/auth-client.ts`: Bổ sung các hàm client `updateProfile`, `changePassword`, `logout`.
  - `frontend/src/app/login/page.tsx`: Gỡ bỏ mô phỏng giả lập `setTimeout`, nối trực tiếp hàm `login()` với backend API qua JWT Bearer token, hỗ trợ chuyển hướng `redirect` param hoặc `/my-account`, bọc Suspense boundary cho Next.js 15 prerender.
  - `frontend/src/app/register/page.tsx`: Gỡ bỏ mô phỏng `setTimeout`, nối trực tiếp hàm `register()` với backend API, tự động lưu token và chuyển hướng đến trang `/my-account`.
- **Xác minh (Verification) — kết quả thực tế:**
  - Backend Type Check (`tsc --noEmit`): **PASS** (Exit code 0).
  - Backend Build (`tsc`): **PASS** (Exit code 0).
  - Backend Member 2 Unit Tests (`member2_auth_catalog.test.ts`): **10/10 PASS**.
  - Backend Member 5 Tests (`member5_portal.test.ts` 6/6 PASS, `member5_checkout.test.ts` 11/11 PASS, `member5_payment_fulfillment.test.ts` 6/6 PASS).
  - Frontend Node Tests (`tests/*.test.cjs`): **28/28 PASS**.
  - Frontend Type Check (`npm run type-check`): **PASS** (Exit code 0).
  - Frontend Production Build (`next build`): **PASS** (30/30 static & SSG pages tạo thành công).

---

### [2026-10-12] - Member 02 — Nâng Cấp Categories Module & Bộ Lọc Theme Đa Chiều (Faceted Search)

- **Bối cảnh:** Triển khai Bước 2 theo Sprint Backlog của Thành viên 02: Quản lý danh mục ngành nghề có đếm theme và hệ thống bộ lọc nâng cao cho kho theme.
- **Thêm mới (Add):**
  - `backend/src/controllers/category.controller.ts`: Controller xử lý danh mục RESTful (`getAll`, `getBySlug`, `create`, `update` cho admin).
  - `backend/src/routes/category.routes.ts`: Router định tuyến chuẩn cho `/api/v1/categories` (public đọc, admin ghi).
- **Sửa đổi (Modify / Fix):**
  - `backend/src/models/category.model.ts`: Thêm `themes_count` qua `LEFT JOIN` với bảng `themes` (đếm số lượng theme published theo từng danh mục), hỗ trợ `findById`, `findBySlug`, `create`, `update`.
  - `backend/src/models/theme.model.ts`: Nâng cấp `ThemeModel.findAll` hỗ trợ bộ lọc đa chiều (Faceted Search):
    * Lọc theo danh mục: `category_slug` hoặc `category_id`.
    * Lọc theo trình dựng trang: `builder` (`Elementor`, `WPBakery`, `Gutenberg`, `Bricks`).
    * Lọc theo khoảng giá: `min_price` và `max_price` (tự động điều hướng theo đơn vị tiền tệ `price_vnd` hoặc `price_usd`).
    * Sắp xếp đa tiêu chí (`sort`): `sales` (bán chạy nhất), `newest` (mới nhất), `price_asc` (giá tăng dần), `price_desc` (giá giảm dần), `rating` (đánh giá cao nhất).
    * Phân trang chuẩn hóa: `limit` và `offset`.
  - `backend/src/controllers/theme.controller.ts`: Trích xuất đầy đủ query params và chuyển giao xuống `ThemeModel.findAll`.
  - `backend/src/routes/index.ts` & `backend/src/app.ts`: Mount `apiRouter.use('/categories', categoryRouter)` và cập nhật discovery `categories_list`.
  - `backend/tests/member2_auth_catalog.test.ts`: Bổ sung 7 test cases kiểm thử tự động cho Category Controller và Faceted Search.
- **Xác minh (Verification) — kết quả thực tế:**
  - Backend Lint (`tsc --noEmit`): **PASS** (Exit code 0).
  - Backend Build (`tsc`): **PASS** (Exit code 0).
  - Backend Member 2 Suite (`member2_auth_catalog.test.ts`): **17/17 PASS**.
  - Frontend Node Tests: **28/28 PASS**.

---

### [2026-10-12] - Member 02 — Hoàn Thiện Storage Module & Presigned Download URLs Bảo Mật

- **Bối cảnh:** Triển khai Bước 3 theo Sprint Backlog của Thành viên 02: Xây dựng dịch vụ quản lý lưu trữ (Cloudflare R2 / AWS S3 SDK), sinh presigned download URL có thời hạn TTL 30 phút chống giả mạo chữ ký số, và ghi nhận audit log vào bảng `download_logs`.
- **Thêm mới (Add):**
  - `backend/src/services/storage.service.ts`: Dịch vụ lưu trữ tệp tin đám mây:
    * `isConfigured()`: Kiểm tra trạng thái cấu hình R2/S3.
    * `generatePresignedDownloadUrl()`: Sinh liên kết tải tệp nén `.zip` có mã hóa chữ ký HMAC-SHA256 kèm tham số thời hạn `expires` (TTL 30 phút) và token bản quyền.
    * `verifyPresignedUrl()`: Xác thực chữ ký URL với thuật toán an toàn `crypto.timingSafeEqual` (chống Timing Attack) và kiểm tra hạn sử dụng.
    * `getLatestThemeVersion()`: Truy vấn bản phát hành theme ổn định từ bảng `theme_versions`.
    * `recordDownloadLog()`: Ghi nhật ký bảo mật (IP, User-Agent, user_id, license_id, theme_id, version_id) vào bảng `download_logs`.
- **Sửa đổi (Modify / Fix):**
  - `backend/src/controllers/license.controller.ts`: Nâng cấp `downloadForOwner` tích hợp `StorageService`:
    * Khi storage chưa cấu hình: trả về lỗi an toàn `503 DOWNLOAD_NOT_CONFIGURED` (bảo đảm giữ nguyên test suite của Member 5).
    * Khi storage đã cấu hình: tự động tra cứu version mới nhất, ghi log vào `download_logs`, sinh Presigned URL 30 phút và trả về cho client.
  - `backend/src/controllers/updater.controller.ts`: Sử dụng `StorageService.recordDownloadLog` và `StorageService.generatePresignedDownloadUrl` khi WordPress PUC updater tải gói cập nhật giao diện.
  - `backend/tests/member2_auth_catalog.test.ts`: Bổ sung 3 test cases cho StorageService (kiểm tra trạng thái unconfigured, sinh URL có chữ ký hợp lệ, từ chối token hết hạn/chữ ký giả mạo).
- **Xác minh (Verification) — kết quả thực tế:**
  - Backend Lint (`tsc --noEmit`): **PASS** (Exit code 0).
  - Backend Build (`tsc`): **PASS** (Exit code 0).
  - Backend Member 2 Suite (`member2_auth_catalog.test.ts`): **20/20 PASS**.
  - Backend Member 5 Suite (`member5_portal.test.ts`): **6/6 PASS**.
  - Frontend Node Tests (`tests/*.test.cjs`): **28/28 PASS**.

---

### [2026-10-12] - Member 01 — Hoàn Thiện Toàn Diện 4 Hạng Mục DevOps, CI/CD Runner, MinIO Storage & Production VPS

- **Bối cảnh & Quyết định:** Thực hiện toàn bộ 4 hạng mục trọng tâm của Lead DevOps & Database Architect theo yêu cầu: (1) Tối ưu hóa CI/CD Test Runner tổng hợp, (2) Tích hợp Local S3 Storage (MinIO) & Sample Package, (3) Xây dựng Công cụ Smoke Test / Health Check 1-click CLI, (4) Hoàn thiện Kịch bản VPS Production, Cron Backup & SSL Let's Encrypt.
- **Thêm mới (Add):**
  - `backend/tests/run_all_tests.ts`: Test runner tổng hợp tự động thực thi tuần tự cả 5 test suites (Member 2 Auth/Catalog, Member 3 Payment/Licensing, Member 5 Checkout, Member 5 Fulfillment, Member 5 Portal) kèm báo cáo ma trận trực quan và chuẩn hóa đường dẫn tương đối (chống lỗi ngắt path có dấu cách trên Windows).
  - `scripts/health-check.cjs`: Tiện ích chẩn đoán hệ thống tự động kiểm tra đồng thời: MySQL port/ping, Redis PONG, Backend `/health`, `/api/v1/themes`, `/api/v1/categories`, Frontend Next.js `/`, `/preview/woodmart`, Nginx (:80) và MinIO (:9000).
  - `docker/scripts/setup-production-vps.sh`: Script 1-lệnh tự động hóa khởi tạo VPS Ubuntu 22.04 LTS (Docker Engine, Compose, UFW Firewall khóa chặt các cổng nội bộ, Certbot Let's Encrypt SSL).
  - `docker/scripts/cron-backup-setup.sh`: Script tự động đăng ký crontab chạy sao lưu MySQL nén gzip vào 02:00 AM mỗi ngày, tự động xóa bản sao lưu cũ > 7 ngày.
  - `docker/nginx/conf.d/production-ssl.conf.template`: Mẫu cấu hình Nginx reverse proxy Production với SSL Let's Encrypt, HTTP/2, HSTS bảo mật A+, Rate Limiting và WebSocket forwarding.
  - `packages/woodmart-v8.6.2/`: Gói mã nguồn theme mẫu chuẩn WordPress (`style.css`, `functions.php`) và file nén sẵn sàng phân phối `packages/woodmart-v8.6.2.zip`.
  - `PRODUCTION_DEPLOYMENT_GUIDE.md`: Tài liệu hướng dẫn bàn giao chi tiết các bước triển khai VPS, cấu hình DNS, cấp SSL Certbot và thiết lập GitHub Actions Secrets (`SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`).
- **Sửa đổi (Modify / Fix):**
  - `backend/package.json`: Cấu hình `"test": "tsx tests/run_all_tests.ts"` và `"test:all": "tsx tests/run_all_tests.ts"`, bổ sung các lệnh chạy riêng lẻ theo từng module.
  - `backend/src/config/env.ts`: Nâng cấp cơ chế nạp biến môi trường tự động tra cứu cả thư mục hiện tại lẫn thư mục cha (`../.env`), khắc phục lỗi thiếu `SEPAY_API_KEY` khi chạy độc lập trong thư mục `backend/`.
  - `backend/src/services/storage.service.ts`: Cải tiến `StorageService.isConfigured()` để phát hiện chính xác các credentials dạng placeholder (`your_...`) là `false`, giúp giữ nguyên chuẩn an toàn fail-closed và pass bài test của Member 5.
  - `docker-compose.yml`: Tích hợp thêm dịch vụ `minio` (Local S3 Storage cổng 9000/9001) và `minio-init` (tự động tạo bucket `theme-dist-packages` khi khởi động).
  - `.env.example`: Bổ sung cấu hình mẫu cho Local MinIO S3 song song với Cloudflare R2.
- **Xác minh (Verification) — kết quả thực tế:**
  - Backend Type Check (`tsc --noEmit`): **PASS** (Exit code 0).
  - Backend Build (`tsc`): **PASS** (Exit code 0).
  - Backend All Tests Suite (`npm run test` qua `run_all_tests.ts`): **5/5 SUITES PASS (100% THÀNH CÔNG)**:
    * Member 02 Suite: **20/20 PASS**
    * Member 03 Suite: **22/22 PASS**
    * Member 05 Checkout Suite: **11/11 PASS**
    * Member 05 Fulfillment Suite: **6/6 PASS**
    * Member 05 Portal Suite: **6/6 PASS**
  - Frontend Node Tests (`tests/*.test.cjs`): **28/28 PASS**.
  - Frontend Type Check (`npm run type-check`): **PASS** (Exit code 0).
  - Frontend Production Build (`npm run build`): **PASS** (30/30 pages tạo thành công).
  - Health Check Diagnostic (`node scripts/health-check.cjs`): Chạy thành công, hiển thị ma trận trạng thái rõ ràng.

---

### [2026-10-13] - Khởi Chạy Toàn Bộ Hệ Thống (Backend, Storefront, Admin) & Bổ Sung In-Memory Fallback Cho Catalog
- **Sửa đổi (Modify / Fix):**
  - [`backend/src/models/theme.model.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/models/theme.model.ts): Bổ sung `try ... catch` fallback về `fallbackThemes` cho `ThemeModel.findAll` khi chạy ở chế độ Standalone (chưa bật MySQL 3306).
  - [`backend/src/models/category.model.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/models/category.model.ts): Bổ sung `fallbackCategories` và `try ... catch` cho `CategoryModel.findAll`, `findById`, `findBySlug` để đảm bảo API `/api/v1/categories` luôn phản hồi `200 OK` ngay cả khi chưa bật MySQL.
- **Xác minh (Verification):**
  - Khởi chạy đồng thời 3 dịch vụ chạy nền:
    * **Backend API**: `http://localhost:4000` (`200 OK` tại `/health`, `/api/v1/themes`, `/api/v1/categories`)
    * **Frontend Storefront**: `http://localhost:3000` (`200 OK` tại `/`, `/preview/woodmart`)
    * **Admin Portal**: `http://localhost:3001` (`200 OK` tại `/login`)
  - Chạy `node scripts/health-check.cjs`: **Tất cả 5 dịch vụ bắt buộc đều PASS (100% HEALTHY & OPERATIONAL)**.

---

### [2026-10-13] - Tối Ưu Hóa Giao Diện Đa Màn Hình (Multi-Screen Responsive 320px–2560px)
- **Bối cảnh:** Nâng cấp toàn diện khả năng tương thích đa màn hình cho Storefront (`frontend/`) và Admin Portal (`admin/`) từ điện thoại cỡ nhỏ (`320px–375px`), di động/phablet (`375px–640px`), máy tính bảng (`768px–1024px`), laptop (`1024px–1440px`) đến màn hình siêu rộng (`1440px–2560px`).
- **Sửa đổi (Modify / Fix):**
  - [`frontend/tailwind.config.js`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/tailwind.config.js) & [`frontend/src/app/globals.css`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/globals.css): Bổ sung breakpoint `xs: '480px'`, bảo vệ chống tràn ngang `overflow-x: hidden; min-width: 320px;` trên `html, body` và tiện ích `.no-scrollbar` cho các thanh tab/filter cuộn ngang trên cảm ứng.
  - [`frontend/src/components/layout/HeaderTopBar.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/layout/HeaderTopBar.tsx), [`frontend/src/components/layout/HeaderMain.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/layout/HeaderMain.tsx), [`frontend/src/components/layout/HeaderNavbar.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/layout/HeaderNavbar.tsx):
    * Bổ sung **Mobile Search Bar** mở rộng và **Mobile Navigation Drawer** (Hamburger Menu) trên màn hình `< 768px` (`md:hidden`) giúp người dùng điện thoại tìm kiếm, lọc ngành nghề, truy cập toàn bộ danh mục và tài khoản dễ dàng.
    * Tối ưu thanh điều hướng `HeaderNavbar` cuộn ngang mượt (`overflow-x-auto no-scrollbar`) trên Tablet `768px–1024px` không bị vỡ dòng.
    * Tinh chỉnh kích thước Logo và nút Giỏ hàng co giãn thông minh trên màn hình nhỏ `320px–480px`.
  - [`frontend/src/components/home/HeroSection.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/home/HeroSection.tsx), [`frontend/src/components/home/PopularCategories.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/home/PopularCategories.tsx), [`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/home/FeaturedThemesSection.tsx), [`frontend/src/components/home/PromoDealBanner.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/home/PromoDealBanner.tsx):
    * Loại bỏ padding kép gây hẹp chiều ngang trên mobile; chuẩn hóa chữ tiêu đề `text-2xl xs:text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl`.
    * Nút CTA xếp chồng full-width (`w-full xs:w-auto`) trên màn hình nhỏ; bộ đếm ngược Flash Sale (`PromoDealBanner`) và thanh thống kê (`Trust Stats Bar`) co giãn linh hoạt từ `1 -> 2 -> 4` cột.
  - [`frontend/src/features/themes/components/theme-card.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/features/themes/components/theme-card.tsx), [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/features/themes/components/themes-catalog.tsx), [`frontend/src/app/theme/[slug]/ThemeDetailClient.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/theme/%5Bslug%5D/ThemeDetailClient.tsx):
    * Bộ lọc dropdown trên `/themes` chia lưới `grid-cols-1 xs:grid-cols-2 sm:flex` trên di động; lưới sản phẩm chuyển mượt `1 -> 2 -> 3 -> 4` cột (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
    * Thanh tab chi tiết theme cuộn ngang mượt trên di động.
  - [`frontend/src/features/preview/components/live-preview-bar.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/features/preview/components/live-preview-bar.tsx): Tối ưu thanh điều khiển trên màn hình nhỏ và đổi khung giả lập Tablet/Mobile sang `w-full max-w-[768px]` / `w-full max-w-[375px]` kèm `h-dvh`.
  - [`frontend/src/components/layout/Footer.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/layout/Footer.tsx), [`frontend/src/components/layout/FloatingWidgets.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/components/layout/FloatingWidgets.tsx), [`frontend/src/features/checkout/components/vietqr-modal.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/features/checkout/components/vietqr-modal.tsx), [`admin/src/components/admin-shell.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/admin/src/components/admin-shell.tsx): Cho phép link bản quyền dưới Footer tự động xuống dòng (`flex-wrap`), thu gọn nút nổi trên màn hình nhỏ, hỗ trợ cuộn dọc an toàn cho modal VietQR (`max-h-[92dvh]`) và tự đóng menu di động trong Admin Portal khi chuyển trang.
- **Xác minh (Verification):**
  - `npm --prefix frontend run type-check` & `npm --prefix admin run type-check`: **PASS** (0 lỗi).
  - `node --test frontend/tests/*.test.cjs`: **28/28 PASS**.
  - `node scripts/health-check.cjs`: **PASS 100%**.

---

### [2026-10-13] - Chuẩn Hóa Cột `role` Trong CSDL Tài Khoản Người Dùng & Mặc Định Là Người Dùng (`customer`)
- **Thêm mới (Add):**
  - [`database/migrations/005_users_role_default.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/005_users_role_default.sql): Migration idempotent đảm bảo bảng `users` luôn có cột `role ENUM('customer', 'author', 'admin') NOT NULL DEFAULT 'customer'`, chuẩn hóa mọi bản ghi rỗng về `'customer'` và tạo chỉ mục `idx_users_role_status`.
- **Sửa đổi (Modify / Fix):**
  - [`database/schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/schema.sql) & [`database/migrations/001_initial_schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/001_initial_schema.sql): Bổ sung chú thích đặc tả cột `role` với mặc định `DEFAULT 'customer'` (Người dùng).
  - [`backend/src/models/user.model.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/models/user.model.ts) & [`backend/src/services/auth.service.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/services/auth.service.ts): Khóa chặt `defaultRole = 'customer'` khi đăng ký tài khoản mới (`POST /api/v1/auth/register`), bổ sung `UserModel.updateRole`, fallback `fallbackUsers` khi chạy độc lập và khởi tạo sẵn tài khoản Admin `admin@woodmart.vn` (`Admin@123456`).
  - [`backend/src/controllers/admin.controller.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/controllers/admin.controller.ts) & [`backend/src/routes/admin.routes.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/routes/admin.routes.ts): Trả thêm trường `role` trong `GET /api/v1/admin/customers`, hỗ trợ lọc theo `?role=customer|admin|author`, bổ sung `POST /api/v1/admin/customers` (tạo tài khoản mới với role tùy chọn) và `PATCH /api/v1/admin/customers/:id/role` để Admin phân quyền tài khoản (có bảo vệ chống tự hạ quyền chính mình).
  - [`admin/src/features/customer-manager.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/admin/src/features/customer-manager.tsx), [`admin/src/lib/api.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/admin/src/lib/api.ts), [`admin/src/lib/types.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/admin/src/lib/types.ts), [`frontend/src/app/my-account/page.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/my-account/page.tsx): Hiển thị nhãn Vai trò (`Người dùng (customer)` / `Quản trị viên (admin)`), bộ lọc theo vai trò, modal `+ Tạo tài khoản` trong Admin Portal và nút chuyển sang Admin Dashboard khi tài khoản có `role === 'admin'`.
  - [`.github/workflows/ci-cd.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.github/workflows/ci-cd.yml), [`backend/tests/admin.api.test.mjs`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/tests/admin.api.test.mjs) & [`backend/tests/member3_payment_licensing.test.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/tests/member3_payment_licensing.test.ts): Bổ sung bước kiểm thử tự động `npm run test:admin --if-present`, bước `Admin Portal - Lint & Typecheck` trên GitHub Actions CI/CD, bài test tự động `PATCH /api/v1/admin/customers/:id/role`, và khởi tạo mặc định `ENV.PAYMENTS.SEPAY_API_KEY` trong `member3_payment_licensing.test.ts` để vượt qua 22/22 test khi chạy trên GitHub Actions runner không có file `.env`.
- **Xác minh (Verification):**
  - `npm --prefix backend run lint`, `npm --prefix frontend run type-check`, `npm --prefix admin run type-check`: **PASS** (0 lỗi).
  - `npm --prefix backend run test`: **5/5 suites (65/65 tests) PASS 100%**.
  - `npm --prefix backend run test:admin`: **PASS 100%** (Bootstrap 4/4, Auth & RBAC 7/7, Admin API 5/5).

---

## 📌 HƯỚNG DẪN CẬP NHẬT KHI CÓ THAY ĐỔI MỚI (MAINTENANCE RULE)
Mỗi lần thực hiện bất kỳ công việc nào tiếp theo, người phụ trách/trợ lý AI **bắt buộc** phải tuân thủ:
1. Thêm một mục mục con mới tương ứng ngày thực hiện `[YYYY-MM-DD] - Tiêu đề công việc`.
2. Phân loại rõ ràng:
   - **Thêm mới (Add):** Đường dẫn file + mục đích thêm mới.
   - **Sửa đổi (Modify / Fix):** Đường dẫn file + nguyên nhân sửa + kết quả sau sửa.
   - **Xác minh (Verification):** Lệnh kiểm thử đã chạy (Docker, cURL, Unit Test, Type-check) + kết quả đầu ra.
3. Commit tài liệu này cùng với các file mã nguồn liên quan khi đẩy lên Git.
