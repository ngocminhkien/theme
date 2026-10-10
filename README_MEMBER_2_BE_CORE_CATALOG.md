# 📘 PHÂN CÔNG THÀNH VIÊN 02: BACKEND DEVELOPER (CORE API, AUTH & CATALOG)

> **Vị trí:** Lập trình viên Backend Phụ trách Hệ thống Cốt lõi, Xác thực & Danh mục Theme (BE Core & Catalog)  
> **Mục tiêu:** Xây dựng nền tảng API RESTful chuẩn mực, hệ thống phân quyền an toàn, module quản lý sản phẩm số và các bộ lọc tìm kiếm theme đa chiều.

---

## 1. PHẠM VI TRÁCH NHIỆM (SCOPE OF WORK)
* **Thư mục & Tệp phụ trách chính:**
  * `backend/src/modules/auth/` (Đăng ký, Đăng nhập, JWT, RBAC)
  * `backend/src/modules/users/` (Quản lý Profile người dùng)
  * `backend/src/modules/categories/` (Danh mục ngành nghề)
  * `backend/src/modules/themes/` (Kho theme, phiên bản, changelog)
  * `backend/src/modules/storage/` (Tích hợp Cloudflare R2 / AWS S3 SDK)
  * `backend/src/common/` (Guards, Interceptors, DTOs, Swagger Docs)

---

## 2. CÔNG NGHỆ & CÔNG CỤ SỬ DỤNG
* **Framework:** Node.js với **NestJS** (khuyến nghị số 1) hoặc **Express.js + TypeScript**.
* **ORM / Query Builder:** Prisma ORM hoặc TypeORM (kết nối MySQL 8.0).
* **Bảo mật:** JWT (JSON Web Tokens), `bcryptjs`, Passport.js (Google OAuth2).
* **Caching:** `@nestjs/cache-manager` với Redis client.
* **Tài liệu API:** Swagger / OpenAPI (`/api/docs`).

---

## 3. DANH SÁCH CÔNG VIỆC CHI TIẾT (SPRINT BACKLOG)

### Tuần 1: Khởi tạo Khung Dự án Backend & Module Xác thực (Auth)
- [ ] Khởi tạo dự án NestJS/TypeScript trong thư mục `backend/`, kết nối với MySQL qua Prisma/TypeORM.
- [ ] Xây dựng **AuthModule**:
  - `POST /api/v1/auth/register` (Tạo tài khoản khách hàng mới, mã hóa mật khẩu bằng bcrypt).
  - `POST /api/v1/auth/login` (Xác thực email/mật khẩu, cấp cặp `accessToken` và `refreshToken`).
  - `POST /api/v1/auth/refresh-token` (Cấp lại accessToken khi hết hạn mà không bắt user đăng nhập lại).
  - `GET /api/v1/auth/me` (Lấy thông tin tài khoản hiện tại).
- [ ] Viết `JwtAuthGuard` và `RolesGuard` để phân quyền chặt chẽ (`customer`, `author`, `admin`).

### Tuần 2: Quản lý Danh Mục Ngành Nghề & Upload Tệp Media
- [ ] Xây dựng **CategoriesModule**:
  - `GET /api/v1/categories` (Lấy danh sách ngành: E-commerce, B2B, Y tế, Giáo dục... hỗ trợ song ngữ VI/EN).
  - `POST /api/v1/categories` & `PUT /api/v1/categories/:id` (Dành cho Admin quản lý danh mục).
- [ ] Xây dựng **StorageModule**:
  - Tích hợp `@aws-sdk/client-s3` và `@aws-sdk/s3-request-presigner`.
  - API upload ảnh mockup và screenshot của theme lên CDN.
  - Hàm tạo **Presigned Download URL** có hạn 30 phút cho file zip theme.

### Tuần 3: Module Sản Phẩm Theme & Bộ Lọc Nâng Cao (Faceted Search)
- [ ] Xây dựng **ThemesModule**:
  - `GET /api/v1/themes`: API danh sách theme hỗ trợ phân trang (Pagination), sắp xếp (Mới nhất, Bán chạy, Giá tăng/giảm), và bộ lọc đa tiêu chí:
    * Theo Danh mục ngành nghề (`category_id` / `category_slug`).
    * Theo Trình dựng trang (`builder`: Elementor, Gutenberg, Bricks).
    * Theo Khoảng giá (`min_price`, `max_price` theo tiền tệ VND hoặc USD).
    * Tìm kiếm từ khóa theo tên và mô tả (`q=...`).
  - `GET /api/v1/themes/:slug`: Chi tiết 1 theme kèm ảnh gallery, danh sách demo variations, lịch sử changelog các phiên bản.
- [ ] Áp dụng Redis Caching cho endpoint `GET /api/v1/themes` để giảm tải DB (TTL: 5 - 10 phút, tự xóa cache khi admin cập nhật theme).

### Tuần 4: Quản lý Phiên Bản Theme & Hoàn thiện Swagger Docs
- [ ] Xây dựng **ThemeVersionsModule**:
  - `POST /api/v1/themes/:id/versions` (Admin upload phiên bản mới v8.6.3, ghi chú changelog và file zip cập nhật).
- [ ] Tích hợp Swagger OpenAPI: Định nghĩa đầy đủ DTO request/response, mã trạng thái HTTP (200, 201, 400, 401, 404, 500).
- [ ] Viết Unit Test cho Auth Service và Theme Service (sử dụng Jest).

---

## 4. ĐIỂM GIAO TIẾP VỚI CÁC THÀNH VIÊN KHÁC (DEPENDENCY CONTRACTS)

| Thành viên | Giao tiếp / Bàn giao |
| :--- | :--- |
| **Thành viên 01 (DevOps & DB)** | Đồng bộ file Migration cơ sở dữ liệu; yêu cầu Redis keyspace và quyền S3/R2. |
| **Thành viên 03 (BE Payment & License)** | Chia sẻ Entity `Theme` và `User` để Thành viên 03 tạo `Order`, `License` và `DownloadLog`. |
| **Thành viên 04 (FE Storefront)** | Bàn giao tài liệu Swagger API: endpoints lấy danh mục, danh sách theme kèm filters, chi tiết theme. |
| **Thành viên 05 (FE Portal)** | Bàn giao API Auth (login, register, profile) để Thành viên 05 làm trang Đăng nhập & My Account. |

---

## 5. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DoD)
1. Tài liệu Swagger `/api/docs` hiển thị đầy đủ 100% các API do mình phụ trách, có thể test thử trực tiếp.
2. API lấy danh sách Theme phản hồi < 100ms khi có Redis cache.
3. Cơ chế bảo mật JWT hoạt động chuẩn xác; user thường không thể gọi API dành cho Admin.
4. Tỷ lệ bao phủ Unit Test (Code Coverage) cho module Auth và Theme đạt $\ge 80\%$.
