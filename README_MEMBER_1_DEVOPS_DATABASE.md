# 📘 PHÂN CÔNG THÀNH VIÊN 01: LEAD DEVOPS & DATABASE ARCHITECT

> **Vị trí:** Kỹ sư Trưởng Hạ tầng, DevOps & Quản trị Cơ sở Dữ liệu (DevOps & Database Lead)  
> **Mục tiêu:** Xây dựng và đảm bảo tính ổn định, bảo mật, tự động hóa toàn bộ hạ tầng từ máy chủ, Docker, CI/CD đến Cơ sở dữ liệu MySQL và lưu trữ tệp số.

---

## 1. PHẠM VI TRÁCH NHIỆM (SCOPE OF WORK)
* **Thư mục & Tệp phụ trách chính:**
  * `database/schema.sql`, `database/migrations/`, `database/seeds/`
  * `docker-compose.yml`, `docker-compose.prod.yml`, `docker/`
  * `.github/workflows/ci-cd.yml`, `.github/workflows/`
  * `.env.example`, `.env.production`
  * Cấu hình Nginx, Cloudflare CDN/WAF, Redis, và Cloud Storage (Cloudflare R2 / AWS S3).

---

## 2. CÔNG NGHỆ & CÔNG CỤ SỬ DỤNG
* **Cơ sở dữ liệu:** MySQL 8.0+ (InnoDB, `utf8mb4_unicode_ci`), Redis 7.x (Alpine).
* **Container hóa:** Docker Engine 24+, Docker Compose v2.20+.
* **CI/CD:** GitHub Actions, GitHub Container Registry (GHCR).
* **Máy chủ & Mạng:** VPS Ubuntu 22.04 LTS, Nginx Reverse Proxy, Let's Encrypt SSL, Cloudflare WAF/CDN.
* **Lưu trữ tệp:** Cloudflare R2 / AWS S3 (S3 Compatible Storage).

---

## 3. DANH SÁCH CÔNG VIỆC CHI TIẾT (SPRINT BACKLOG)

### Tuần 1: Chuẩn hóa Database & Môi trường Cục bộ (Local Environment)
- [ ] Kiểm tra và hoàn thiện file [`database/schema.sql`](./database/schema.sql): đảm bảo đầy đủ indexes, foreign keys cho 10 bảng.
- [ ] Viết script nạp dữ liệu mẫu (Seeding data): 7 danh mục ngành nghề, 10 sản phẩm theme demo, 2 user (admin & customer).
- [ ] Tối ưu hóa file [`docker-compose.yml`](./docker-compose.yml) cho môi trường Dev: cấu hình healthcheck, volume persistent data cho MySQL và Redis.
- [ ] Thiết lập quy trình Migration DB (sử dụng Prisma / Drizzle / TypeORM migration hoặc Knex).

### Tuần 2: Hệ thống Lưu trữ Tệp An Toàn & Redis Caching
- [ ] Khởi tạo Bucket lưu trữ trên Cloudflare R2 hoặc AWS S3 (`theme-dist-packages`).
- [ ] Cấu hình CORS và quyền truy cập Private (chỉ tạo Presigned URL có hạn 15 - 60 phút để tải file).
- [ ] Thiết lập Redis Cache: tối ưu cấu hình `maxmemory`, `eviction-policy: allkeys-lru` để phục vụ caching catalog và chống spam request.

### Tuần 3: Pipeline CI/CD & Đóng Gói Docker Tự Động
- [ ] Hoàn thiện file [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml):
  - Job Lint & Test tự động kích hoạt khi có Pull Request.
  - Job Build Docker image đa nền tảng (`linux/amd64`) và đẩy lên GitHub Container Registry (GHCR).
- [ ] Cấu hình Repository Secrets trên GitHub: `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`, `SERVER_PORT`.

### Tuần 4: Triển Khai Production Server & Bảo Mật
- [ ] Cài đặt VPS Production Ubuntu 22.04 LTS: Docker, Docker Compose, UFW Firewall (chỉ mở cổng 22, 80, 443).
- [ ] Cài đặt Nginx làm Reverse Proxy trỏ về FE port 3000 và BE port 4000; cấu hình SSL Let's Encrypt tự động gia hạn.
- [ ] Cấu hình Cloudflare WAF: Chống DDoS, Rate-limit (giới hạn 60 req/phút cho các API download và checkout).
- [ ] Thiết lập kịch bản tự động sao lưu dữ liệu MySQL hàng ngày (Automated Daily Backup) đẩy lên Cloudflare R2 / S3.

---

## 4. ĐIỂM GIAO TIẾP VỚI CÁC THÀNH VIÊN KHÁC (DEPENDENCY CONTRACTS)

| Thành viên | Giao tiếp / Bàn giao |
| :--- | :--- |
| **Thành viên 02 (BE Core)** | Cung cấp thông tin kết nối DB, Redis; hỗ trợ viết query tối ưu và đánh index cho chức năng lọc themes. |
| **Thành viên 03 (BE Payment & License)** | Cung cấp tài khoản S3/R2 SDK để tạo Presigned URL tải file; đảm bảo bảng `licenses` & `payments` an toàn giao dịch. |
| **Thành viên 04 (FE Storefront)** | Đảm bảo tốc độ CDN Cloudflare cho hình ảnh/CSS, thiết lập caching headers cho static assets. |
| **Thành viên 05 (FE Portal & Checkout)** | Đảm bảo kết nối an toàn HTTPS/WSS cho webhook thanh toán và xác thực session. |

---

## 5. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DoD)
1. Chỉ cần chạy `docker compose up -d` là toàn bộ cụm dịch vụ (MySQL, Redis, BE, FE) chạy trơn tru, không báo lỗi connection.
2. Quá trình push code vào `main` tự động build Docker và deploy thành công lên server trong vòng dưới 5 phút.
3. Database có cơ chế sao lưu tự động (auto backup) và khôi phục thành công.
4. Tỷ lệ uptime hệ thống đạt $\ge 99.9\%$.
