# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG LÊN INTERNET (PAAS / CLOUD TỰ ĐỘNG)
# (VERCEL + RENDER / RAILWAY + TIDB CLOUD MYSQL)

Tài liệu này hướng dẫn chi tiết từng bước đưa toàn bộ hệ thống Digital Theme Marketplace lên Internet với mô hình Cloud PaaS hiện đại, chi phí 0đ (Free Tier) ban đầu, tự động hóa CI/CD khi cập nhật code.

---

## BẢN ĐỒ KIẾN TRÚC TRIỂN KHAI (DEPLOYMENT TOPOLOGY)

```
                       [ Khách Hàng / Quản Trị Viên ]
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────┐                       ┌───────────────────────────┐
│  Frontend Storefront      │                       │  Admin Portal             │
│  (Vercel Next.js 15)      │                       │  (Vercel Next.js 15)      │
│  https://store.domain.com │                       │  https://admin.domain.com │
└─────────────┬─────────────┘                       └─────────────┬─────────────┘
              │ (REST API & Proxy)                                │ (Admin REST API)
              └─────────────────────────┬─────────────────────────┘
                                        ▼
                        ┌───────────────────────────┐
                        │  Backend Core API         │
                        │  (Render / Railway Node)  │
                        │  https://api.domain.com   │
                        └─────────────┬─────────────┘
                                      │ (MySQL TCP + TLS)
                                      ▼
                        ┌───────────────────────────┐
                        │  TiDB Cloud / Aiven MySQL │
                        │  (Serverless MySQL DB)    │
                        └───────────────────────────┘
```

---

## BƯỚC 1: KHỞI TẠO CƠ SỞ DỮ LIỆU MYSQL TRÊN CLOUD

Bạn cần một máy chủ MySQL trên đám mây hoạt động 24/7. Khuyên dùng **TiDB Cloud Serverless** (hoàn toàn miễn phí 25GB vĩnh viễn, tương thích 100% giao thức MySQL):

1. Truy cập [https://tidbcloud.com](https://tidbcloud.com) và đăng ký tài khoản (miễn phí, không cần thẻ tín dụng).
2. Chọn **Create Cluster** -> Chọn loại **Serverless** (Free).
3. Đặt tên Cluster: `theme-marketplace-db` và chọn khu vực gần Việt Nam nhất (ví dụ: `Singapore` - `ap-southeast-1`).
4. Sau khi khởi tạo xong, hệ thống sẽ cấp cho bạn các thông số:
   - **Host:** `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` (hoặc tương tự)
   - **Port:** `4000`
   - **User:** `xxxx.root`
   - **Password:** `Mật khẩu do bạn tạo`
   - **Database Name:** `theme_marketplace` (tạo database bằng lệnh: `CREATE DATABASE theme_marketplace;`)
5. Nhấp vào tab **SQL Editor** trên giao diện TiDB Cloud:
   - Mở file `database/schema.sql` trong dự án, copy toàn bộ nội dung và dán vào SQL Editor rồi bấm **Run**.
   - Mở tiếp file `database/seeds/01_seed_data.sql`, copy và dán vào SQL Editor rồi bấm **Run** để nạp dữ liệu mẫu ban đầu.

---

## BƯỚC 2: ĐẨY TOÀN BỘ CODE DỰ ÁN LÊN GITHUB

Để các nền tảng Vercel và Render tự động nhận diện và build, bạn cần đưa source code lên GitHub:

1. Đăng nhập [https://github.com](https://github.com) và tạo một **New Repository** mới (ví dụ đặt tên là `theme-marketplace`, chọn chế độ **Private** hoặc **Public** tùy ý).
2. Mở terminal tại thư mục gốc của dự án (`woodmart`) và thực hiện lần lượt các lệnh:
   ```bash
   git add .
   git commit -m "feat: complete performance optimization and ready for cloud deployment"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-github-cua-ban>/theme-marketplace.git
   git push -u origin main
   ```

---

## BƯỚC 3: TRIỂN KHAI BACKEND API LÊN RENDER.COM (HOẶC RAILWAY)

1. Truy cập [https://render.com](https://render.com) và đăng nhập bằng tài khoản GitHub.
2. Tại trang Dashboard, chọn **New +** -> **Web Service**.
3. Chọn repository `theme-marketplace` bạn vừa tạo trên GitHub.
4. Cấu hình các thông số Web Service như sau:
   - **Name:** `theme-marketplace-api`
   - **Region:** `Singapore (Southeast Asia)`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Cuộn xuống mục **Environment Variables** (Biến môi trường) và thêm các giá trị:

| Tên biến | Giá trị mẫu | Ghi chú |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Môi trường production |
| `JWT_SECRET` | `super_secret_jwt_key_min32_characters_random_string` | Khóa bí mật JWT |
| `DB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` | Host từ TiDB Cloud |
| `DB_PORT` | `4000` | Port TiDB (hoặc 3306 nếu dùng Aiven/Railway) |
| `DB_NAME` | `theme_marketplace` | Tên cơ sở dữ liệu |
| `DB_USER` | `xxxx.root` | Tên user MySQL |
| `DB_PASSWORD` | `MatKhauCuaBan123@` | Mật khẩu MySQL |
| `DB_SSL` | `true` | Bắt buộc bật SSL khi kết nối TiDB Cloud |
| `SEPAY_API_KEY` | *(Khóa API từ SePAY nếu có)* | Dành cho thanh toán VietQR |
| `STRIPE_SECRET_KEY` | *(Khóa bí mật Stripe nếu có)* | Dành cho thanh toán Quốc tế |

6. Bấm **Create Web Service**. Render sẽ bắt đầu clone code, chạy `npm run build` và khởi động máy chủ.
7. Sau 2-3 phút, Render sẽ cấp cho bạn một đường link HTTPS công khai, ví dụ:
   `https://theme-marketplace-api.onrender.com`
   *(Bạn có thể kiểm tra sức khỏe tại: `https://theme-marketplace-api.onrender.com/health`)*

---

## BƯỚC 4: TRIỂN KHAI FRONTEND STOREFRONT LÊN VERCEL

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
2. Chọn **Add New...** -> **Project**.
3. Chọn repository `theme-marketplace`.
4. Trong màn hình **Configure Project**:
   - **Project Name:** `theme-marketplace-store`
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Bấm **Edit** và chọn thư mục `frontend`
5. Mở rộng mục **Environment Variables**:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://theme-marketplace-api.onrender.com/api/v1` *(URL Backend Render từ Bước 3)*
6. Bấm **Deploy**. Vercel sẽ tự động build Next.js 15 và cấp domain cho bạn:
   `https://theme-marketplace-store.vercel.app`

---

## BƯỚC 5: TRIỂN KHAI ADMIN PORTAL LÊN VERCEL

1. Tại Vercel Dashboard, tiếp tục bấm **Add New...** -> **Project**.
2. Chọn lại repository `theme-marketplace`.
3. Trong màn hình cấu hình:
   - **Project Name:** `theme-marketplace-admin`
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Bấm **Edit** và chọn thư mục `admin`
4. Mục **Environment Variables**:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://theme-marketplace-api.onrender.com/api/v1` *(URL Backend Render từ Bước 3)*
5. Bấm **Deploy**. Vercel sẽ cấp domain riêng cho trang Admin:
   `https://theme-marketplace-admin.vercel.app`

---

## BƯỚC 6: CẬP NHẬT CORS & CẤU HÌNH WEBHOOK THANH TOÁN

Sau khi đã có 2 domain Vercel:
1. Quay lại Dashboard Render của Backend:
   - Vào mục **Environment**
   - Thêm biến `FRONTEND_URL` = `https://theme-marketplace-store.vercel.app`
   - Thêm biến `ADMIN_URL` = `https://theme-marketplace-admin.vercel.app`
   - Bấm **Save Changes** để Render tự động khởi động lại với cấu hình CORS bảo mật.
2. Cấu hình Webhook thanh toán:
   - **SePAY (VietQR):** Vào cổng quản trị SePAY -> Cấu hình Webhook URL:
     `https://theme-marketplace-api.onrender.com/api/v1/orders/webhook/sepay`
   - **Stripe:** Vào Stripe Dashboard -> Webhooks -> Add endpoint:
     `https://theme-marketplace-api.onrender.com/api/v1/orders/webhook/stripe`

---

## TỔNG KẾT HỆ THỐNG SAU KHI TRIỂN KHAI

| Thành phần | Nền tảng Hosting | Chi phí | Địa chỉ truy cập mẫu |
| :--- | :--- | :---: | :--- |
| **Cơ sở dữ liệu** | TiDB Cloud Serverless | Miễn phí (25GB) | TCP port 4000 (TLS/SSL) |
| **Backend REST API** | Render.com Web Service | Miễn phí (512MB RAM) | `https://theme-marketplace-api.onrender.com` |
| **Frontend Storefront** | Vercel Serverless Edge | Miễn phí (Hạ tầng Next.js) | `https://theme-marketplace-store.vercel.app` |
| **Admin Portal** | Vercel Serverless Edge | Miễn phí | `https://theme-marketplace-admin.vercel.app` |
