# ThemeStore Admin

Ứng dụng Next.js độc lập cho khu vực quản trị, chạy mặc định tại `http://localhost:3001`.

## Chạy local

1. Cài dependencies: `npm install`.
2. Sao chép `.env.example` thành `.env.local` nếu API không chạy tại `http://localhost:4000`.
3. Khởi động backend ở cổng 4000 và đặt `ADMIN_URL=http://localhost:3001` trong môi trường backend.
4. Chạy `npm run dev`.

Đăng nhập dùng endpoint JWT hiện có. API `/api/v1/admin/*` kiểm tra role `admin` tại server; giao diện không thể thay thế kiểm tra này.

## Lệnh kiểm tra

- `npm run type-check`
- `npm run build`

Không lưu secret, khóa thanh toán hoặc thông tin database trong ứng dụng Admin.

## Tạo Admin đầu tiên

Ứng dụng không có endpoint tự nâng quyền. Người vận hành phải tạo Admin đầu tiên
trên máy có kết nối tới đúng MySQL environment:

```bash
cd backend
ADMIN_EMAIL="admin@company.example" ADMIN_FULL_NAME="System Administrator" ADMIN_PASSWORD="use-a-unique-12-character-or-longer-password" npm run admin:create
```

Hoặc chạy `npm run admin:create` rồi nhập email, họ tên và mật khẩu qua terminal.
Script dùng bcrypt cost 12, transaction + row lock, chỉ tạo khi chưa có Admin,
và sẽ không ghi đè mật khẩu hay nâng quyền một tài khoản đã tồn tại. Cần đặt
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` cho database đích trước khi chạy.

Đăng nhập tại `http://localhost:3001/login` trong development. Storefront chỉ
hiển thị link “Khu vực quản trị” khi `NEXT_PUBLIC_ADMIN_URL` hợp lệ; production
phải dùng URL HTTPS của Admin, không dùng `localhost`.
