# 🛠️ DANH SÁCH CẦN CÀI ĐẶT CHO DỰ ÁN (DEV SETUP & PREREQUISITES)

> **Dành cho toàn bộ thành viên trong nhóm phát triển.**  
> Tài liệu này liệt kê chi tiết mọi phần mềm, công cụ, tiện ích mở rộng (extensions) và tài khoản dịch vụ cần cài đặt trên máy tính cá nhân trước khi bắt tay vào code.

---

## 📋 1. DANH MỤC CÀI ĐẶT CHUNG (BẮT BUỘC CHO CẢ 5 THÀNH VIÊN)

Mọi thành viên (dù làm BE, FE, hay DevOps) đều cần cài đặt các công cụ nền tảng sau:

| STT | Công cụ / Phần mềm | Phiên bản tối thiểu | Mục đích sử dụng | Link tải chính thức |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Git** | `v2.40+` | Quản lý phiên bản mã nguồn, tạo nhánh và PR | [git-scm.com](https://git-scm.com/) |
| **2** | **Node.js & npm** | `Node v20.x` hoặc `v22+` (kèm `npm v10+`) | Chạy Backend Express/NestJS và Frontend Next.js 15 | [nodejs.org](https://nodejs.org/) |
| **3** | **Docker Desktop** | `Docker v24+` & `Compose v2.20+` | Chạy cụm dịch vụ MySQL, Redis và môi trường giả lập | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **4** | **Trình soạn thảo mã nguồn** | **VS Code** (khuyên dùng) hoặc WebStorm / Cursor | Viết mã và debug | [code.visualstudio.com](https://code.visualstudio.com/) |

### 🧩 Bộ Tiện Ích Mở Rộng (VS Code Extensions) Cần Cài:
Mở tab Extensions trên VS Code (`Ctrl + Shift + X` trên Windows hoặc `Cmd + Shift + X` trên Mac) và tìm kiếm cài đặt:
1. **ESLint** (`dbaeumer.vscode-eslint`): Tự động phát hiện lỗi cú pháp và chuẩn code.
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`): Định dạng code thụt lề chuẩn.
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Gợi ý class CSS cho Frontend.
4. **DotENV** (`mikestead.dotenv`): Highlight màu cho các file `.env`.
5. **GitLens** (`eamodio.gitlens`): Xem lịch sử commit, ai đã sửa dòng code nào.
6. **Thunder Client** hoặc **Postman Extension**: Kiểm tra gọi thử API RESTful ngay trong VS Code.

---

## 👥 2. DANH MỤC CÀI ĐẶT CHI TIẾT THEO TỪNG VAI TRÒ

---

### 📘 THÀNH VIÊN 01: LEAD DEVOPS & DATABASE
Ngoài các công cụ chung ở Mục 1, bạn cần cài đặt thêm:

* **Công cụ quản trị Cơ sở dữ liệu (Database GUI Client):**
  * **DBeaver Community** *(Khuyên dùng, miễn phí 100%)* hoặc **Navicat / TablePlus**: Kết nối quản trị MySQL 8.0, xem bảng, chạy query, export/import file `schema.sql`.
* **Công cụ quản trị Cache (Redis GUI):**
  * **Redis Insight** *(Chính chủ Redis, miễn phí)*: Xem các key cache, token, theo dõi memory usage.
* **Công cụ dòng lệnh máy chủ:**
  * **OpenSSH Client**: Kết nối SSH vào VPS Linux (`ssh user@server_ip`).
  * **Cloudflare Wrangler CLI** *(Tùy chọn)*: Để quản lý Bucket Cloudflare R2 (`npm install -g wrangler`).

---

### 📘 THÀNH VIÊN 02 & 03: BACKEND DEVELOPERS (BE CORE & BE PAYMENT/LICENSE)
Ngoài các công cụ chung ở Mục 1, 2 bạn Backend cần cài đặt thêm:

* **Công cụ Kiểm thử API Chuyên Sâu:**
  * **Postman Desktop** hoặc **Bruno / Insomnia**: Để tạo Collections test toàn bộ API Auth, Theme Catalog, Order, Webhook.
* **Công cụ Tạo Đường Hầm Mạng Cục Bộ (Tunneling Tool - BẮT BUỘC):**
  * **ngrok** ([ngrok.com](https://ngrok.com/)) hoặc **Localtunnel** / **Cloudflare Tunnel**:
    * *Tại sao cần?* Cổng thanh toán VietQR (SePAY) và Stripe ở ngoài Internet cần gửi Webhook về máy local của bạn (`http://localhost:4000/api/v1/webhooks/...`). `ngrok` sẽ tạo 1 URL công khai (ví dụ `https://xyz.ngrok-free.app`) trỏ về cổng 4000 của bạn để test nhận tiền trong 3 giây.
    * Lệnh chạy: `ngrok http 4000`
* **Đăng ký Tài khoản Sandbox Phát triển (Developer Accounts):**
  * **SePAY:** Đăng ký tài khoản miễn phí tại [my.sepay.vn](https://my.sepay.vn) để lấy API Key test quét VietQR.
  * **Stripe:** Đăng ký tài khoản tại [dashboard.stripe.com/register](https://dashboard.stripe.com/register), bật chế độ `Test Mode` để lấy `pk_test_...` và `sk_test_...`.

---

### 📘 THÀNH VIÊN 04 & 05: FRONTEND DEVELOPERS (FE STOREFRONT & FE CHECKOUT/PORTAL)
Ngoài các công cụ chung ở Mục 1, 2 bạn Frontend cần cài đặt thêm:

* **Tiện ích Trình duyệt (Browser Extensions for Chrome / Edge):**
  * **React Developer Tools**: Soi component React 19 và props/state.
  * **Redux / Zustand DevTools**: Giám sát dữ liệu giỏ hàng và tiền tệ (VND/USD) theo thời gian thực.
* **Công cụ Giả lập Thiết bị Di Động:**
  * Sử dụng tính năng **Toggle Device Toolbar** sẵn có trong Chrome DevTools (`F12` ➔ `Ctrl + Shift + M`) để test hiển thị trên iPhone 14/15, iPad Air, Samsung Galaxy.

---

### 📦 DÀNH CHO NGƯỜI MUỐN TEST CÀI ĐẶT THEME WOODMART TRÊN WORDPRESS (NẾU CÓ)
Nếu bạn muốn chạy thử trực tiếp theme Woodmart trên WordPress để xem demo:
* Cài đặt **Laragon** *(Khuyên dùng trên Windows, rất nhẹ và nhanh)* hoặc **Local by Flywheel** ([localwp.com](https://localwp.com/)).
* Khởi tạo 1 site WordPress mẫu và làm theo hướng dẫn tại [`INSTALLATION_GUIDE.md`](./INSTALLATION_GUIDE.md).

---

## 🧪 3. BẢNG LỆNH KIỂM TRA MÁY ĐÃ CÀI ĐẶT THÀNH CÔNG CHƯA

Mở Terminal (Command Prompt / PowerShell trên Windows hoặc Terminal trên Mac) và chạy lần lượt các lệnh sau:

```bash
# 1. Kiểm tra Git
git --version
# Kết quả mong đợi: git version 2.40.0 trở lên

# 2. Kiểm tra Node.js
node -v
# Kết quả mong đợi: v20.x hoặc v22.x, v24.x

# 3. Kiểm tra npm
npm -v
# Kết quả mong đợi: 10.x trở lên

# 4. Kiểm tra Docker
docker --version
# Kết quả mong đợi: Docker version 24.x trở lên

# 5. Kiểm tra Docker Compose
docker compose version
# Kết quả mong đợi: Docker Compose version v2.20.x trở lên
```

---

## ⚡ 4. QUY TRÌNH 3 BƯỚC KHỞI ĐỘNG DỰ ÁN KHI NHẬN MÁY MỚI

Sau khi đã cài đầy đủ các công cụ trên, thành viên mới chỉ cần làm 3 bước sau là có thể bắt đầu code ngay:

### Bước 1: Clone kho mã nguồn về máy
```bash
git clone https://github.com/ngocminhkien/theme.git
cd theme
```

### Bước 2: Tạo tệp cấu hình môi trường
```bash
cp .env.example .env
```

### Bước 3: Khởi chạy toàn bộ hạ tầng
```bash
# Lựa chọn A (Khuyên dùng): Chạy tất cả bằng Docker (MySQL, Redis, BE, FE)
docker compose up -d

# Lựa chọn B: Chạy thủ công từng phần
# Tab terminal 1:
cd backend && npm install && npm run dev
# Tab terminal 2:
cd frontend && npm install && npm run dev
```

* Backend API sẵn sàng tại: `http://localhost:4000` (Kiểm tra tại: `http://localhost:4000/health`)
* Frontend sẵn sàng tại: `http://localhost:3000`
