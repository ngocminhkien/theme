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

## 📌 HƯỚNG DẪN CẬP NHẬT KHI CÓ THAY ĐỔI MỚI (MAINTENANCE RULE)
Mỗi lần thực hiện bất kỳ công việc nào tiếp theo, người phụ trách/trợ lý AI **bắt buộc** phải tuân thủ:
1. Thêm một mục mục con mới tương ứng ngày thực hiện `[YYYY-MM-DD] - Tiêu đề công việc`.
2. Phân loại rõ ràng:
   - **Thêm mới (Add):** Đường dẫn file + mục đích thêm mới.
   - **Sửa đổi (Modify / Fix):** Đường dẫn file + nguyên nhân sửa + kết quả sau sửa.
   - **Xác minh (Verification):** Lệnh kiểm thử đã chạy (Docker, cURL, Unit Test, Type-check) + kết quả đầu ra.
3. Commit tài liệu này cùng với các file mã nguồn liên quan khi đẩy lên Git.
