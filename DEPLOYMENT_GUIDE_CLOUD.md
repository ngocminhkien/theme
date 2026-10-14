# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG LÊN INTERNET (KIẾN TRÚC GỘP GỌN GÀNG)
# (VERCEL UNIFIED FRONTEND + RENDER BACKEND + TIDB CLOUD MYSQL)

Tài liệu này hướng dẫn chi tiết từng bước đưa hệ thống Digital Theme Marketplace lên Internet với mô hình Cloud PaaS tinh gọn (Frontend và Admin chạy chung 1 ứng dụng Next.js 15 trên Vercel, Backend chạy trên Render.com, Cơ sở dữ liệu chạy trên TiDB Cloud Serverless).

---

## BẢN ĐỒ KIẾN TRÚC TRIỂN KHAI (TINH GỌN)

```
                       [ Khách Hàng & Quản Trị Viên ]
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │  Unified Frontend (Vercel Next.js 15)   │
                │  - Cửa hàng : https://your-app.vercel.app/     │
                │  - Quản trị : https://your-app.vercel.app/admin│
                └────────────────────┬────────────────────┘
                                     │ (REST API & Proxy)
                                     ▼
                        ┌───────────────────────────┐
                        │  Backend Core API         │
                        │  (Render.com Node.js)     │
                        │  https://api.onrender.com │
                        └─────────────┬─────────────┘
                                      │ (MySQL TCP + TLS)
                                      ▼
                        ┌───────────────────────────┐
                        │  TiDB Cloud Serverless    │
                        │  (MySQL Database 25GB)    │
                        └───────────────────────────┘
```

---

## BƯỚC 1: KHỞI TẠO CƠ SỞ DỮ LIỆU MYSQL CLOUD (1 PHÚT)

Bạn cần cơ sở dữ liệu MySQL hoạt động 24/7 trên đám mây. Khuyên dùng **TiDB Cloud Serverless** (miễn phí 25GB vĩnh viễn, tương thích 100% MySQL):

1. Truy cập [https://tidbcloud.com](https://tidbcloud.com) và đăng nhập bằng tài khoản **GitHub**.
2. Bấm **Create Cluster** -> Chọn loại **Serverless** (Free).
3. Đặt tên: `theme-db`, chọn khu vực: `Singapore (ap-southeast-1)`. Bấm **Create**.
4. Lưu lại thông tin kết nối:
   - **Host:** (ví dụ: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
   - **Port:** `4000`
   - **User:** (ví dụ: `xxxx.root`)
   - **Password:** *(mật khẩu bạn vừa đặt)*
   - **Database Name:** `theme_marketplace`
5. Nhấp vào tab **SQL Editor** trên TiDB Cloud:
   - Copy nội dung file `database/schema.sql` -> Dán vào SQL Editor và bấm **Run**.
   - Copy nội dung file `database/seeds/01_seed_data.sql` -> Dán vào SQL Editor và bấm **Run** để nạp dữ liệu mẫu ban đầu.

---

## BƯỚC 2: ĐẨY CODE ĐÃ GỘP LÊN GITHUB

Mở terminal tại thư mục gốc dự án và chạy:
```bash
git add .
git commit -m "feat: unify storefront and admin into single frontend, ready for cloud deployment"
git push origin main
```

---

## BƯỚC 3: TRIỂN KHAI BACKEND API LÊN RENDER.COM

1. Truy cập [https://dashboard.render.com](https://dashboard.render.com) (đăng nhập bằng GitHub).
2. Chọn **New +** -> **Web Service** -> Chọn repository **`ngocminhkien/theme`**.
3. Cấu hình các thông số Web Service:
   - **Name:** `theme-marketplace-backend`
   - **Region:** `Singapore (Southeast Asia)`
   - **Branch:** `main`
   - **Root Directory:** `backend` *(Bắt buộc điền chữ `backend`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Cuộn xuống mục **Environment Variables** (Biến môi trường) và thêm:

| Key | Value mẫu | Ghi chú |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Môi trường production |
| `JWT_SECRET` | `theme_prod_jwt_secret_key_random_64_characters_2026_xyz` | Khóa bí mật JWT |
| `DB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` | Host từ TiDB Cloud ở Bước 1 |
| `DB_PORT` | `4000` | Port TiDB Cloud |
| `DB_NAME` | `theme_marketplace` | Tên database |
| `DB_USER` | `xxxx.root` | Tên user TiDB |
| `DB_PASSWORD` | *(Mật khẩu TiDB)* | Mật khẩu TiDB |
| `DB_SSL` | `true` | Bật kết nối SSL cho cloud database |

5. Bấm **Create Web Service**.  
   Sau khoảng 2–3 phút, Render sẽ cấp cho bạn một URL công khai:
   👉 **`https://theme-marketplace-backend-xxxx.onrender.com`**

---

## BƯỚC 4: TRIỂN KHAI UNIFIED FRONTEND LÊN VERCEL (CHỈ CẦN 1 DỰ ÁN DUY NHẤT)

1. Truy cập [https://vercel.com/new](https://vercel.com/new) (đăng nhập bằng GitHub).
2. Chọn repository **`ngocminhkien/theme`** -> Bấm **Import single project** tại dòng **`frontend`**.
3. Cấu hình dự án trên Vercel:
   - **Project Name:** `theme-marketplace` (hoặc tên tùy thích)
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `frontend`
4. Mở rộng mục **Environment Variables**:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://theme-marketplace-backend-xxxx.onrender.com/api/v1` *(URL Backend Render ở Bước 3)*
5. Bấm **Deploy**.  
   Vercel sẽ tự động build mã nguồn và cấp cho bạn đường link duy nhất:
   👉 **`https://theme-marketplace-xxxx.vercel.app`**

Khi đó:
- **Khách hàng duyệt web & mua theme tại:** `https://theme-marketplace-xxxx.vercel.app`
- **Quản trị viên đăng nhập quản lý tại:** `https://theme-marketplace-xxxx.vercel.app/admin`

---

## BƯỚC 5: CẬP NHẬT CORS VÀ WEBHOOK

1. Quay lại trang quản trị Render của Backend:
   - Vào mục **Environment**
   - Thêm biến `FRONTEND_URL` = `https://theme-marketplace-xxxx.vercel.app`
   - Bấm **Save Changes** để hoàn tất phân quyền CORS an toàn.
2. Cấu hình Webhook thanh toán SePAY / Stripe:
   - **SePAY (VietQR):** `https://theme-marketplace-backend-xxxx.onrender.com/api/v1/orders/webhook/sepay`
   - **Stripe:** `https://theme-marketplace-backend-xxxx.onrender.com/api/v1/orders/webhook/stripe`
