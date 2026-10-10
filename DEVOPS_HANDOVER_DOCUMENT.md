# 📋 BIÊN BẢN BÀN GIAO HẠ TẦNG VÀ CƠ SỞ DỮ LIỆU
## (DEVOPS & DATABASE HANDOVER SPECIFICATION)

> **Người bàn giao:** Thành viên 01 — Kỹ sư Trưởng Hạ tầng, DevOps & Quản trị Cơ sở Dữ liệu  
> **Người tiếp nhận:** Toàn bộ Đội ngũ Phát triển (Thành viên 02, 03, 04, 05)  
> **Trạng thái:** ✅ Đã hoàn thành 100% chuẩn bị và đã đẩy lên GitHub (`branch: main`)  
> **Ngày ban hành:** 10/10/2026

---

## 🏛️ 1. TỔNG QUAN HẠ TẦNG MÔI TRƯỜNG (INFRASTRUCTURE OVERVIEW)

Cụm dịch vụ đã được chuẩn hóa để khởi chạy bằng 1 lệnh duy nhất thông qua Docker Compose hoặc chạy độc lập từng service trên máy cá nhân:

| Dịch vụ | Tên Container | Cổng Nội bộ | Cổng Ngoại vi (Host) | Mục đích |
| :--- | :--- | :---: | :---: | :--- |
| **MySQL 8.0** | `theme_marketplace_mysql` | `3306` | `3306` | Lưu trữ dữ liệu quan hệ (Users, Themes, Orders, Licenses,...) |
| **Redis 7 Alpine** | `theme_marketplace_redis` | `6379` | `6379` | Caching danh mục, Session token, Rate limit counter, Queue |
| **Backend API** | `theme_marketplace_backend` | `4000` | `4000` | REST API (Node.js Express TypeScript MVC) |
| **Frontend** | `theme_marketplace_frontend` | `3000` | `3000` | Giao diện Next.js 15 App Router |
| **Nginx (Prod)** | `theme_prod_nginx` | `80, 443` | `80, 443` | Reverse Proxy, SSL, Gzip, Rate Limiting (Production) |

---

## 🔐 2. THÔNG SỐ KẾT NỐI (CONNECTION STRINGS)

### 2.1. Kết nối Cơ sở dữ liệu (MySQL 8.0):
* **Host nội bộ (Trong Docker Network):** `mysql`
* **Host ngoại vi (Từ máy máy Dev / DBeaver / Navicat):** `127.0.0.1`
* **Cổng (Port):** `3306`
* **Tên Database:** `theme_marketplace`
* **Tài khoản thường (Dành cho App Backend):**
  * **User:** `theme_user`
  * **Password:** `theme_password_secure`
* **Tài khoản Root (Quản trị):**
  * **User:** `root`
  * **Password:** `rootpassword_secure`
* **Chuỗi kết nối URL:**  
  `mysql://theme_user:theme_password_secure@127.0.0.1:3306/theme_marketplace`
* **Bộ mã ký tự:** `utf8mb4` / `utf8mb4_unicode_ci`

### 2.2. Kết nối Cache & Queue (Redis 7):
* **Host nội bộ (Trong Docker Network):** `redis`
* **Host ngoại vi (Từ máy Dev / Redis Insight):** `127.0.0.1`
* **Cổng (Port):** `6379`
* **Password:** *(Mặc định để trống trong môi trường Local Dev)*
* **Cấu hình tối ưu:**
  * Giới hạn RAM: `maxmemory 256mb`
  * Chính sách giải phóng: `maxmemory-policy allkeys-lru`
  * Bật ghi đĩa kép: RDB snapshot + AOF (`appendfsync everysec`)

---

## 🗄️ 3. BÀN GIAO DỮ LIỆU CƠ SỞ & TÀI KHOẢN MẪU (DATABASE SEEDS)

Cơ sở dữ liệu sẽ **tự động nạp cấu trúc 10 bảng** (`database/schema.sql`) và **bộ dữ liệu mẫu** (`database/seeds/01_seed_data.sql`) ngay khi container MySQL khởi chạy lần đầu tiên.

### 3.1. Danh mục 10 bảng dữ liệu (Core Tables):
1. **`users`**: Tài khoản quản trị viên, tác giả và khách hàng.
2. **`categories`**: 7 ngành nghề kinh doanh (E-commerce, Corporate, Health/Spa, Education, F&B, Real Estate, Portfolio).
3. **`themes`**: Thông tin 10 sản phẩm theme demo (VND & USD, demo URL, builder tags, điểm đánh giá).
4. **`theme_versions`**: Quản lý phiên bản phát hành, dung lượng tệp và changelog.
5. **`orders`**: Thông tin đơn hàng và trạng thái thanh toán.
6. **`order_items`**: Chi tiết theme trong đơn hàng và loại bản quyền.
7. **`licenses`**: Quản lý License Key, giới hạn số domain kích hoạt.
8. **`license_activations`**: Lưu vết domain WordPress đang kích hoạt license.
9. **`payments`**: Lưu vết chi tiết giao dịch VietQR, Stripe, PayPal.
10. **`download_logs`**: Nhật ký tải tệp nén để chống tải lậu hàng loạt.

### 3.2. Tài khoản thử nghiệm (Test Accounts):
| Vai trò | Email đăng nhập | Mật khẩu gốc | Mật khẩu băm (Bcrypt) | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **Super Admin** | `admin@thememarket.local` | `Admin@2026` | `$2a$12$e6jZvhT1K8M.V.fK2DkJ...` | `active` |
| **Theme Author**| `author@xtemos.local` | `Author@2026` | `$2a$12$e6jZvhT1K8M.V.fK2DkJ...` | `active` |
| **Customer** | `customer@thememarket.local`| `Customer@2026`| `$2a$12$e6jZvhT1K8M.V.fK2DkJ...` | `active` |

### 3.3. Dữ liệu thử nghiệm có sẵn:
* **Đơn hàng đã thanh toán thành công:** Mã đơn `ORD-2026-8888` (Thuộc sở hữu của khách hàng `customer@thememarket.local`).
* **License Key kích hoạt mẫu:** `WD-2026-DEMO-A1B2-C3D4-E5F6` (Gán cho domain: `mytestshop.local`).
* **10 Themes Demo:** `woodmart`, `flatsome`, `porto`, `astra-pro`, `divi`, `avada`, `betheme`, `electro`, `enfold`, `oceanwp`.

---

## 🔄 4. QUY TRÌNH CHẠY & TẠO DATABASE MIGRATION

Hệ thống cung cấp sẵn Migration Runner viết bằng Node.js tại [`database/migrations/migrate.cjs`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/migrations/migrate.cjs):

* **Lệnh thực thi migration:**
  ```bash
  # Cách 1: Chạy từ thư mục backend
  cd backend
  npm run db:migrate

  # Cách 2: Chạy trực tiếp qua node
  node database/migrations/migrate.cjs
  ```
* **Quy tắc tạo migration mới:**
  * Đặt tên file theo thứ tự: `003_ten_thay_doi.sql`, `004_ten_thay_doi.sql`.
  * Runner sẽ tự động ghi nhớ file đã chạy vào bảng `_migrations` và chỉ chạy các file mới chưa được nạp.

---

## ☁️ 5. HỢP ĐỒNG LƯU TRỮ TỆP SỐ & PRESIGNED URL (S3 / R2)

Dành riêng cho **Thành viên 02 (File Download)** & **Thành viên 03 (License Check)**:

* **Bucket Name:** `theme-dist-packages` (Khai báo trong `.env` biến `R2_BUCKET_NAME`).
* **Quyền hạn Bucket:** **Hoàn toàn Private (Không mở Public Read)**.
* **Quy tắc sinh link tải tệp:**
  1. Khi khách hàng bấm tải giao diện, Backend phải kiểm tra xem License có hợp lệ (`status = 'active'`).
  2. Backend sử dụng AWS SDK / Cloudflare R2 Client để sinh **Presigned GET URL**.
  3. Thời hạn hiệu lực của URL: **Tối đa 15 đến 30 phút** (`ExpiresIn: 1800`).
  4. Ghi 1 bản ghi vào bảng `download_logs` (lưu IP, user agent, thời gian).

---

## 🛡️ 6. CẤU HÌNH BẢO MẬT NGINX & RATE LIMITING

Dành cho **Thành viên 04 (Frontend)** & **Thành viên 05 (Checkout)**:

1. **Giới hạn lưu lượng (Rate Limit) qua Nginx:**
   * `/api/v1/orders/checkout`: Giới hạn **15 request / phút** (Chống spam sinh mã VietQR).
   * `/api/v1/*download*`: Giới hạn **20 request / phút** (Chống download crawler).
   * Các endpoint API khác: Giới hạn **60 request / phút**.
2. **Kích thước tải lên:**
   * `client_max_body_size 100M;` (Cho phép tải lên tệp zip theme dung lượng lớn).
3. **Chính sách Iframe cho Thanh Live Preview Bar:**
   * Header `Content-Security-Policy: frame-ancestors 'self' localhost;` đã được cấu hình sẵn để trang `/preview/[slug]` nhúng demo không bị chặn bởi trình duyệt.

---

## 🛠️ 7. HƯỚNG DẪN KHỞI CHẠY & VẬN HÀNH CHO NHÓM

### Khởi chạy môi trường Dev:
```bash
# 1. Đảm bảo đã có file .env (Đã tạo sẵn từ .env.example)
# 2. Khởi động tất cả các container:
docker compose up -d

# 3. Xem danh sách container đang chạy:
docker compose ps

# 4. Xem log theo dõi:
docker compose logs -f
```

### Sao lưu & Phục hồi Database:
* **Chạy sao lưu thủ công:**
  ```bash
  bash docker/scripts/backup-mysql.sh
  # File backup sẽ được tạo tại thư mục backups/*.sql.gz
  ```
* **Phục hồi dữ liệu từ file sao lưu:**
  ```bash
  bash docker/scripts/restore-mysql.sh backups/theme_marketplace_backup_xxxx.sql.gz
  ```

---

## 🤝 8. ĐẦU MỐI BÀN GIAO TIẾP THEO

* **Bàn giao cho Thành viên 02 (BE Core):** Toàn quyền sử dụng kết nối MySQL, 10 bảng đã nạp sẵn data để viết các endpoint `/api/v1/themes`, `/api/v1/categories`, `/api/v1/auth`.
* **Bàn giao cho Thành viên 03 (BE Payment & License):** Bảng `orders`, `licenses`, `payments` và cấu hình SePAY/VietQR đã sẵn sàng để phát triển Webhook 3s và WordPress Updater API.
