# 📝 NHẬT KÝ THAY ĐỔI: THÀNH VIÊN 01 (LEAD DEVOPS & DATABASE ARCHITECT)

> **Mục đích:** Ghi nhận toàn bộ các thao tác thêm, sửa, xóa mã nguồn, cấu hình hạ tầng và cơ sở dữ liệu của Thành viên 01.

---

## 📅 LỊCH SỬ THAY ĐỔI (CHANGELOG)

### [2026-10-10] - Khởi tạo Cơ sở dữ liệu MySQL 8.0 & Migrations
- **Thêm mới (Add):**
  - [`database/schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/schema.sql): Thiết kế hoàn chỉnh 10 bảng CSDL quan hệ chuẩn MySQL 8.0 DDL (`users`, `categories`, `themes`, `theme_versions`, `orders`, `order_items`, `payments`, `licenses`, `license_activations`, `download_logs`) kèm ràng buộc Foreign Keys và Indexing tối ưu hiệu năng.
  - [`database/seeds/01_seed_data.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/seeds/01_seed_data.sql): Khởi tạo 10 theme thực tế, 2 tài khoản mẫu (Admin & Customer), đơn hàng, payment và license mẫu.
  - [`database/migrations/001_initial_schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/001_initial_schema.sql): File migration khởi tạo cấu trúc bảng.
  - [`database/migrations/002_seed_initial_data.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/002_seed_initial_data.sql): File migration nạp dữ liệu khởi tạo.
  - [`database/migrations/migrate.cjs`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/migrate.cjs): Node.js runner chạy migration tuần tự an toàn.

### [2026-10-10] - Triển khai Hạ tầng Docker, Nginx & Redis
- **Thêm mới (Add):**
  - [`docker-compose.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker-compose.yml): Cấu hình chạy cụm 4 dịch vụ Development (`mysql:8.0`, `redis:7-alpine`, `backend`, `frontend`) trên mạng nội bộ `marketplace_network`.
  - [`docker-compose.prod.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker-compose.prod.yml): Cấu hình môi trường Production tích hợp Nginx reverse proxy.
  - [`.env`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.env) & [`.env.production`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.env.production): Các biến môi trường kết nối chuẩn hóa.
  - [`docker/nginx/nginx.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/nginx/nginx.conf): Cấu hình reverse proxy, gzip compression, worker settings.
  - [`docker/nginx/conf.d/default.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/nginx/conf.d/default.conf): Định tuyến Frontend (`/`), API Backend (`/api`), WebSocket.
  - [`docker/redis/redis.conf`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/redis/redis.conf): In-memory cache với hạn mức 256mb và eviction policy LRU.
  - [`docker/scripts/backup-mysql.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/backup-mysql.sh): Script sao lưu CSDL tự động nén gzip, tự xóa file backup cũ > 7 ngày.
  - [`docker/scripts/restore-mysql.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/restore-mysql.sh): Script phục hồi CSDL từ bản backup gzip.
  - [`DEVOPS_HANDOVER_DOCUMENT.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/DEVOPS_HANDOVER_DOCUMENT.md): Tài liệu bàn giao hạ tầng toàn diện cho toàn đội ngũ.

### [2026-10-10] - Khắc phục Sự cố Lỗi Pipeline CI/CD GitHub Actions
- **Sửa (Fix):**
  - [`backend/src/models/order.model.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/models/order.model.ts): Thêm method `OrderModel.create` khắc phục lỗi `TS2339`, sửa số lượng placeholder câu lệnh `INSERT INTO orders`.
  - [`frontend/package-lock.json`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/package-lock.json): Đồng bộ lại lockfile khắc phục lỗi `npm ci` bị từ chối trên CI runner do thiếu `autoprefixer@10.6.1`.
  - [`frontend/src/app/page.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/page.tsx): Bổ sung `category` và `category_name_vi` cho mảng `DEMO_THEMES` khắc phục lỗi `TS2739`.
  - [`frontend/src/shared/types/index.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/shared/types/index.ts): Chuyển `category?: string; category_name_vi?: string;` thành optional nhằm tăng độ an toàn khi type check.
  - [`frontend/src/app/preview/[slug]/page.tsx`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/frontend/src/app/preview/%5Bslug%5D/page.tsx): Sửa lỗi `TS2322` bằng cách truyền đối tượng theme hợp lệ `{ theme: ThemeItem }` vào `<LivePreviewBar />`.

### [2026-10-12] - Thiết lập Tài liệu Nhật ký Lịch sử Toàn diện
- **Thêm mới (Add):**
  - [`history/WORK_HISTORY.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/history/WORK_HISTORY.md): Tạo tài liệu lưu trữ toàn bộ tiến độ, lịch sử thay đổi và quy tắc cập nhật bắt buộc cho mỗi lần làm việc tiếp theo.

### [2026-10-12] - Hoàn Thiện Toàn Diện 4 Hạng Mục DevOps, CI/CD Runner, MinIO Storage & Production VPS
- **Thêm mới (Add):**
  - [`backend/tests/run_all_tests.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/tests/run_all_tests.ts): Test runner tự động chạy trọn gói cả 5 bộ kiểm thử Backend (Member 2, 3, 5) và báo cáo ma trận trạng thái trực quan.
  - [`scripts/health-check.cjs`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/scripts/health-check.cjs): Tiện ích chẩn đoán hệ thống 1-click tự động kiểm tra toàn bộ 6 dịch vụ cụm (MySQL, Redis, Backend Health/Themes/Categories, Frontend Home/Preview, Nginx Proxy, MinIO).
  - [`docker/scripts/setup-production-vps.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/setup-production-vps.sh): Script tự động cấu hình máy chủ Ubuntu 22.04 LTS (Docker, Compose, UFW Firewall an toàn, Certbot Let's Encrypt).
  - [`docker/scripts/cron-backup-setup.sh`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/scripts/cron-backup-setup.sh): Script cài đặt Cronjob tự động sao lưu CSDL hàng ngày lúc 02:00 AM.
  - [`docker/nginx/conf.d/production-ssl.conf.template`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker/nginx/conf.d/production-ssl.conf.template): Mẫu cấu hình Nginx SSL HTTPS Let's Encrypt, HTTP/2, HSTS bảo mật A+ và Rate Limiting.
  - [`packages/woodmart-v8.6.2/`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/packages/woodmart-v8.6.2): Theme package mẫu và file zip `packages/woodmart-v8.6.2.zip`.
  - [`PRODUCTION_DEPLOYMENT_GUIDE.md`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/PRODUCTION_DEPLOYMENT_GUIDE.md): Tài liệu cẩm nang triển khai máy chủ thực tế và cấu hình GitHub Actions Secrets.
- **Sửa đổi (Modify / Fix):**
  - [`backend/package.json`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/package.json): Thiết lập lệnh `"test": "tsx tests/run_all_tests.ts"`.
  - [`backend/src/config/env.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/config/env.ts): Nạp tự động file `.env` từ cả thư mục hiện tại lẫn thư mục cha.
  - [`backend/src/services/storage.service.ts`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/backend/src/services/storage.service.ts): Xử lý chính xác placeholder credentials `your_...` tránh nhận nhầm là đã cấu hình lưu trữ cloud.
  - [`docker-compose.yml`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/docker-compose.yml): Tích hợp service `minio` và `minio-init` tự động khởi tạo bucket `theme-dist-packages`.
  - [`.env.example`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/.env.example): Bổ sung cấu hình mẫu MinIO S3 cho môi trường local.
- **Xác minh (Verification):**
  - Chạy `npm --prefix backend run test`: **5/5 SUITES PASS (100% THÀNH CÔNG)**.
  - Chạy `node scripts/health-check.cjs`: Hiển thị ma trận chẩn đoán trạng thái chuẩn xác.

