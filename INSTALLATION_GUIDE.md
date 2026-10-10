# HƯỚNG DẪN CÀI ĐẶT TOÀN DIỆN (INSTALLATION & DEPLOYMENT GUIDE)

Tài liệu này bao gồm 2 phần hướng dẫn độc lập:
* **Phần 1:** Hướng dẫn triển khai **Hạ tầng Nền tảng Sàn bán Theme** (Backend, Frontend, MySQL 8.0, Redis, Docker, CI/CD) dành cho Developers & DevOps.
* **Phần 2:** Hướng dẫn cài đặt và sử dụng **Mã nguồn Giao diện Woodmart trên WordPress** dành cho Kỹ thuật viên & Khách hàng.

---

# PHẦN 1: TRIỂN KHAI HỆ THỐNG SÀN BÁN THEME (DEV & DEVOPS)

## 1. YÊU CẦU TIÊN QUYẾT (SYSTEM PREREQUISITES)

### Môi trường phát triển cục bộ (Local Development):
* **Hệ điều hành:** Windows 10/11 (khuyến nghị WSL2), macOS hoặc Linux (Ubuntu 22.04+).
* **Docker Engine** (v24.0+) & **Docker Compose** (v2.20+).
* **Node.js** (v20.x LTS trở lên) & **npm** (v10+).
* **Git** (v2.40+).
* *(Tùy chọn nếu không dùng Docker)*: MySQL 8.0+, Redis 7.x.

---

## 2. KHỞI CHẠY NHANH BẰNG DOCKER COMPOSE (KHUYẾN NGHỊ)

Đây là phương thức nhanh nhất và đảm bảo môi trường đồng nhất giữa các thành viên trong đội ngũ.

### Bước 1: Sao chép tệp biến môi trường
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
cp .env.example .env
```

### Bước 2: Khởi động toàn bộ cụm dịch vụ
```bash
docker compose up -d
```
Quá trình này sẽ tự động:
1. Khởi động **MySQL 8.0** tại cổng `3306` và tự động thực thi script khởi tạo [`database/schema.sql`](file:///c:/Users/Ngoc%20Minh%20Kien/Downloads/instalaveis_woodmart-woocommerce_woodmart-8.6.2/woodmart/database/schema.sql).
2. Khởi động **Redis 7** tại cổng `6379`.
3. Build và khởi động dịch vụ **Backend API** tại cổng `4000`.
4. Build và khởi động dịch vụ **Frontend Next.js** tại cổng `3000`.

### Bước 3: Kiểm tra trạng thái các container
```bash
docker compose ps
```
Nếu tất cả các dịch vụ đều báo `Up` (healthy), bạn có thể truy cập:
* **Giao diện người dùng (Storefront):** [http://localhost:3000](http://localhost:3000)
* **Backend API Docs:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
* **MySQL Database:** `127.0.0.1:3306` (User: `theme_user`, Password: `theme_password_secure`, Database: `theme_marketplace`)

### Dừng dịch vụ:
```bash
docker compose down
# Hoặc xóa cả ổ đĩa dữ liệu (Reset sạch sẽ):
docker compose down -v
```

---

## 3. KHỞI CHẠY THỦ CÔNG KHÔNG DÙNG DOCKER (MANUAL SETUP)

Nếu bạn muốn debug trực tiếp từng ứng dụng trên máy:

### 3.1. Cấu hình Cơ sở dữ liệu MySQL
1. Mở MySQL CLI hoặc phần mềm quản lý (Navicat, DBeaver, phpMyAdmin).
2. Tạo cơ sở dữ liệu mới và import schema:
   ```sql
   CREATE DATABASE theme_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import tệp SQL từ terminal:
   ```bash
   mysql -u root -p theme_marketplace < database/schema.sql
   ```

### 3.2. Cấu hình Backend (Node.js)
```bash
cd backend
npm install
# Cập nhật thông số kết nối DB trong file .env
npm run start:dev
```
API sẽ lắng nghe tại `http://localhost:4000`.

### 3.3. Cấu hình Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
Website sẽ chạy tại `http://localhost:3000`.

---

## 4. CẤU HÌNH CỔNG THANH TOÁN THỰC TẾ

### 4.1. Cổng VietQR tự động (SePAY / Cassio) cho thị trường Việt Nam:
1. Đăng ký tài khoản doanh nghiệp hoặc cá nhân tại [SePAY.vn](https://sepay.vn).
2. Thêm số tài khoản ngân hàng và lấy **API Key**.
3. Cấu hình Webhook URL trong trang quản trị SePAY trỏ về:
   `https://api.yourdomain.com/api/v1/webhooks/sepay`
4. Điền các thông số vào file `.env`:
   ```ini
   SEPAY_API_KEY=your_sepay_api_key
   SEPAY_WEBHOOK_SECRET=your_webhook_secret
   VIETQR_BANK_ACCOUNT=1234567890
   VIETQR_BANK_BIN=970422
   VIETQR_ACCOUNT_NAME=TEN CHU TAI KHOAN
   ```

### 4.2. Cổng Stripe & PayPal cho thị trường Quốc tế:
1. Đăng nhập [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) lấy `STRIPE_PUBLISHABLE_KEY` và `STRIPE_SECRET_KEY`.
2. Tạo Webhook endpoint trong Stripe trỏ tới: `https://api.yourdomain.com/api/v1/webhooks/stripe` và copy `STRIPE_WEBHOOK_SECRET`.
3. Điền các khóa vào `.env`.

---

## 5. TRIỂN KHAI LÊN MÁY CHỦ VPS PRODUCTION

1. **Chuẩn bị máy chủ:** VPS Ubuntu 22.04 LTS (Khuyến nghị: 4 vCPU, 8GB RAM, 80GB SSD).
2. **Cài đặt Docker trên VPS:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   ```
3. **Cấu hình Nginx Reverse Proxy & SSL Let's Encrypt:**
   Cài đặt Certbot và trỏ domain về IP máy chủ:
   ```bash
   sudo apt install certbot python3-certbot-nginx nginx -y
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```
4. **Kích hoạt CI/CD tự động:**
   * Thêm 4 Repository Secrets trên GitHub (`SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`, `SERVER_PORT`).
   * Mỗi khi push vào nhánh `main`, GitHub Actions sẽ tự động SSH vào server và chạy triển khai không downtime.

---

# PHẦN 2: HƯỚNG DẪN CÀI ĐẶT & SỬ DỤNG THEME WOODMART TRÊN WORDPRESS

Dành cho khách hàng mua theme hoặc lập trình viên triển khai website bán hàng bằng Woodmart.

## 1. YÊU CẦU MÁY CHỦ WORDPRESS TỐI THIỂU

Để theme vận hành trơn tru và import demo không bị gián đoạn, máy chủ WordPress/Hosting cần đạt các thông số sau trong `php.ini`:

| Thông số PHP | Giá trị tối thiểu | Khuyến nghị tối ưu |
| :--- | :--- | :--- |
| **Phiên bản PHP** | PHP 7.4 | **PHP 8.1 - PHP 8.2** |
| `memory_limit` | 256M | **512M** |
| `upload_max_filesize` | 32M | **128M** |
| `post_max_size` | 64M | **128M** |
| `max_execution_time` | 180 | **300 - 600** |
| `max_input_vars` | 3000 | **5000** |

---

## 2. QUY TRÌNH CÀI ĐẶT THEME

### Cách 1: Cài đặt trực tiếp qua Giao diện WordPress Admin (Khuyến nghị)
1. Đăng nhập vào trang quản trị WordPress (`https://yourdomain.com/wp-admin`).
2. Điều hướng tới menu: **Giao diện (Appearance)** ➔ **Giao diện (Themes)** ➔ Chọn **Thêm mới (Add New)** ➔ **Tải giao diện lên (Upload Theme)**.
3. Chọn tệp nén **`woodmart.zip`** từ máy tính của bạn và nhấn **Cài đặt ngay (Install Now)**.
4. Sau khi cài đặt hoàn tất, nhấn **Kích hoạt (Activate)**.
5. *(Khuyến nghị)*: Lặp lại bước trên để cài đặt tiếp tệp **`woodmart-child.zip`** (Child Theme) và kích hoạt Child Theme này để bảo vệ các đoạn mã tùy biến khi nâng cấp bản mới.

### Cách 2: Cài đặt thủ công qua FTP hoặc Quản lý tệp cPanel/DirectAdmin
*(Sử dụng khi hosting giới hạn dung lượng upload qua web)*:
1. Giải nén tệp `woodmart.zip` trên máy tính thành thư mục `woodmart`.
2. Mở phần mềm FTP (FileZilla) hoặc File Manager của cPanel.
3. Tải toàn bộ thư mục `woodmart` lên đường dẫn:
   `/wp-content/themes/woodmart/`
4. Vào **Appearance ➔ Themes** trong trang quản trị WordPress và nhấn **Activate**.

---

## 3. THIẾT LẬP WIZARD & CÀI ĐẶT PLUGIN BẮT BUỘC

Ngay sau khi kích hoạt theme, giao diện **Woodmart Setup Wizard** sẽ tự động xuất hiện:

1. **Bước 1 - Kích hoạt Bản quyền (License Activation):**
   * Nhập License Key nhận được từ đơn hàng trên website để kích hoạt tính năng tự động cập nhật và mở khóa toàn bộ thư viện demo.
2. **Bước 2 - Cài đặt Child Theme:**
   * Chọn tạo hoặc kích hoạt Child Theme.
3. **Bước 3 - Chọn Trình dựng trang (Page Builder):**
   * Bạn có thể lựa chọn giữa **Elementor** (phổ biến, dễ tùy biến kéo thả) hoặc **WPBakery Page Builder**.
4. **Bước 4 - Cài đặt Plugin cốt lõi:**
   * **Woodmart Core** *(Bắt buộc)*: Chứa toàn bộ tính năng và element độc quyền của theme.
   * **WooCommerce** *(Bắt buộc)*: Nền tảng bán hàng thương mại điện tử.
   * **Slider Revolution** *(Tùy chọn)*: Tạo banner chuyển động đẹp mắt.
   * Nhấn **Install & Activate All** và đợi hệ thống hoàn tất.

---

## 4. HƯỚNG DẪN IMPORT DỮ LIỆU DEMO 1-CLICK (DUMMY CONTENT)

Theme Woodmart tích hợp sẵn hơn 80+ giao diện mẫu cho mọi ngành nghề:

1. Trong thanh menu quản trị bên trái, vào **Woodmart** ➔ **Pre-built websites** (hoặc **Dummy Content**).
2. Sử dụng thanh tìm kiếm hoặc lọc theo ngành nghề:
   * *Fashion* (Thời trang)
   * *Electronics* (Điện máy, công nghệ)
   * *Furniture* (Nội thất)
   * *Cosmetics / Beauty* (Mỹ phẩm, Spa)
   * *Food / Grocery* (Thực phẩm sạch, Siêu thị)
   * *Corporate / B2B* (Doanh nghiệp)
3. Rê chuột vào mẫu demo yêu thích và bấm **Set up** hoặc **Import**.
4. Chờ thanh tiến trình chạy từ 0% đến 100% (thường mất từ 1 - 3 phút tùy tốc độ mạng hosting).
5. Sau khi hoàn thành, truy cập trang chủ website để chiêm ngưỡng giao diện hoàn chỉnh có sẵn sản phẩm, bài viết và banner mẫu!

---

# PHẦN 3: XỬ LÝ LỖI PHỔ BIẾN (TROUBLESHOOTING & FAQ)

### 1. Lỗi: "The uploaded file exceeds the upload_max_filesize directive in php.ini"
* **Nguyên nhân:** File `woodmart.zip` dung lượng lớn hơn giới hạn tải lên mặc định của hosting (thường mặc định chỉ 2MB).
* **Cách khắc phục:**
  * Mở tệp `.htaccess` ở thư mục gốc website và thêm các dòng sau:
    ```apache
    php_value upload_max_filesize 128M
    php_value post_max_size 128M
    php_value memory_limit 512M
    php_value max_execution_time 300
    ```
  * Hoặc tải thư mục theme qua FTP theo **Cách 2**.

### 2. Lỗi: "Are you sure you want to do this? / Link you followed has expired"
* **Nguyên nhân:** Quá thời gian xử lý (`max_execution_time`) hoặc thiếu bộ nhớ (`post_max_size`) khi upload.
* **Cách khắc phục:** Nâng `max_execution_time` lên `300` và `post_max_size` lên `128M` trong cPanel hoặc file `.user.ini`.

### 3. Lỗi: Quá trình Import Demo bị treo ở 30% hoặc 80%
* **Nguyên nhân:** Máy chủ hosting hết thời gian phản hồi (Timeout) khi tải ảnh demo từ máy chủ CDN.
* **Cách khắc phục:**
  1. Kiểm tra lại thông số `max_execution_time` đã đặt tối thiểu `300` giây chưa.
  2. Tạm thời tắt các plugin bảo mật hoặc tường lửa chặn cURL.
  3. Nhấn F5 tải lại trang và bấm nút **Import** lại lần nữa (hệ thống sẽ tự động tiếp tục tải các phần chưa xong mà không bị trùng lặp).

### 4. Lỗi: Cổng 3306 bị chiếm dụng khi chạy Docker trên máy Windows
* **Nguyên nhân:** Đang có dịch vụ MySQL cục bộ hoặc XAMPP/WampServer đang chạy chiếm cổng 3306.
* **Cách khắc phục:** Đổi cổng mapping trong `docker-compose.yml` từ `"3306:3306"` thành `"3307:3306"`.
