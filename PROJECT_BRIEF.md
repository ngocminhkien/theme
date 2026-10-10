# 📋 BẢN TÓM TẮT DỰ ÁN (PROJECT BRIEF)

> **Tên dự án:** Nền Tảng Thương Mại Giao Diện Kỹ Thuật Số (Digital Theme Marketplace)  
> **Khẩu hiệu (Slogan):** *"Kho Giao Diện Bản Quyền Đa Ngành Chuẩn SEO Cho Mọi Doanh Nghiệp Số"*  
> **Thị trường mục tiêu:** Việt Nam 🇻🇳 & Toàn Cầu 🌐  
> **Ngày phê duyệt:** Tháng 10/2026 | **Phiên bản:** 1.0.0

---

## 🎯 1. BỐI CẢNH & VẤN ĐỀ THỊ TRƯỜNG (PROBLEM STATEMENT)

### 1.1. Nỗi đau của khách hàng tại Việt Nam:
* **Khó khăn khi mua theme quốc tế (ThemeForest, Envato):** Giá thành cao ($59 - $79 tương đương 1.5 - 2 triệu VNĐ), bắt buộc phải có thẻ Visa/Mastercard (nhiều bạn trẻ/freelancer không có), rào cản tiếng Anh khi cần hỗ trợ kỹ thuật.
* **Vấn nạn Theme lậu (Null/GPL share trôi nổi):** Tràn lan mã độc, virus, backdoor làm website bị Google phạt hoặc bị hack sau vài tháng sử dụng.
* **Thiếu dịch vụ cài đặt hỗ trợ:** Người mua không biết cách cấu hình hosting, tăng `upload_max_filesize`, hay import demo giống mẫu.

### 1.2. Nỗi đau của khách hàng quốc tế:
* Cần các template tối ưu tốc độ cao (Core Web Vitals 95+), tương thích WooCommerce mới nhất, quy trình mua hàng nhanh gọn không cần tạo tài khoản rườm rà.

---

## 💡 2. GIẢI PHÁP CỦA DỰ ÁN (THE SOLUTION)

Xây dựng một **Nền tảng Thương mại Điện tử Sản phẩm Số (Digital Marketplace)** chuyên biệt:
1. **Thanh toán Bản địa hóa Siêu Tốc (VietQR):** Khách hàng Việt Nam chỉ cần quét mã QR bằng bất kỳ ứng dụng ngân hàng nào (Vietcombank, MBBank, Techcombank, MoMo), đơn hàng được kích hoạt tự động và cấp License Key trong **3 giây**.
2. **Thanh toán Toàn cầu (Stripe / PayPal):** Hỗ trợ khách hàng quốc tế thanh toán bằng thẻ tín dụng, Apple Pay, Google Pay chỉ bằng 1 chạm.
3. **Thanh Trải Nghiệm Trực Tiếp (Live Preview Bar Switcher):** Cho phép xem trước giao diện trực tiếp trên 3 thiết bị (Desktop, Tablet, Mobile) với nút "Mua Ngay" luôn cố định.
4. **Cập nhật Tự động 1-Click (WordPress Auto-Updater API):** Khách cài theme trên WordPress sẽ nhận được thông báo cập nhật bản mới và bấm update tự động ngay trong `wp-admin` giống hệt các theme mua trên ThemeForest.
5. **Kho giao diện Đa Lĩnh Vực:** Khởi đầu từ nền tảng Woodmart v8.6.2 cao cấp, mở rộng ra 7 ngành nghề mũi nhọn (E-commerce, B2B, Y tế & Spa, F&B, Giáo dục, Bất động sản, Portfolio).

---

## 👥 3. CHÂN DUNG KHÁCH HÀNG MỤC TIÊU (TARGET PERSONAS)

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     PERSONA 1: FREELANCER       │   │    PERSONA 2: CHỦ SHOP / SME    │   │    PERSONA 3: GLOBAL CLIENT     │
├─────────────────────────────────┤   ├─────────────────────────────────┤   ├─────────────────────────────────┤
│ • Lập trình viên thiết kế web   │   │ • Chủ doanh nghiệp, chủ shop    │   │ • Web Developers/Agencies ở US, │
│ • Cần giao diện chuẩn, mã sạch  │   │ • Cần website đẹp, ra mắt nhanh │     EU, Đông Nam Á                  │
│ • Mua gói Agency (5 - 20 sites) │   │ • Mua kèm dịch vụ Setup (+399k) │   │ • Thanh toán bằng thẻ qua Stripe│
│ • Quét VietQR nhận file tức thì │   │ • Cần hỗ trợ trực tiếp qua Zalo │   │ • Cần tài liệu tiếng Anh chuẩn  │
└─────────────────────────────────┘   └─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 💎 4. LỢI THẾ CẠNH TRANH ĐỘC BẢN (UNIQUE SELLING PROPOSITION - USP)

1. **Quy trình mua hàng không ma sát (Frictionless 30s Checkout):** Bỏ hoàn toàn các trường địa chỉ giao hàng vật lý; chỉ cần Họ tên + Email ➔ Quét QR ➔ Tải file `.zip` + Nhận License Key.
2. **Mức giá tối ưu theo sức mua (PPP Pricing):**
   * Thị trường Việt Nam: **499.000đ – 890.000đ** (tiết kiệm 50% so với thị trường quốc tế).
   * Thị trường Quốc tế: **$39 – $49 USD**.
3. **Bảo mật bản quyền thông minh:** Link tải tệp `.zip` là link có thời hạn (Presigned URL 30 phút trên Cloudflare R2 / AWS S3), chống bot tải hàng loạt.

---

## 📦 5. PHẠM VI DỰ ÁN (SCOPE OF WORK)

### ✅ Trong phạm vi (In-Scope - Giai đoạn 1 & 2):
* Xây dựng giao diện Storefront bằng **Next.js 15 (React 19)** với Live Preview Bar và One-Page Checkout.
* Xây dựng Backend API bằng **Node.js (Express & TypeScript)** theo kiến trúc **MVC**.
* Thiết kế cơ sở dữ liệu **MySQL 8.0** gồm 10 bảng chuẩn hóa có lưu vết thanh toán và quản lý domain.
* Tích hợp cổng thanh toán **VietQR (SePAY Webhook)** và **Stripe Elements**.
* Xây dựng cỗ máy sinh License Key và API phục vụ WordPress Client tự động kiểm tra bản cập nhật.
* Đóng gói Docker Compose và thiết lập CI/CD GitHub Actions deploy tự động lên VPS Production.

### ❌ Ngoài phạm vi (Out-of-Scope - Chưa làm trong giai đoạn 1):
* Không kinh doanh sản phẩm vật lý (không có giao hàng, không tính phí ship).
* Chưa mở sàn cho người ngoài tự do đăng bán theme (sẽ triển khai ở Phase 4 - Multi-vendor Marketplace).

---

## 🏗️ 6. TÓM TẮT CÔNG NGHỆ & HẠ TẦNG (TECH STACK)

| Phân hệ | Công nghệ lựa chọn | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Frontend (FE)** | **Next.js 15, Tailwind CSS, Zustand, TypeScript** | Tối ưu Core Web Vitals, SSR/ISR chuẩn SEO, kiến trúc Feature-Driven dễ bảo trì. |
| **Backend (BE)** | **Node.js, Express, TypeScript (Kiến trúc MVC)** | Xử lý Webhook non-blocking siêu nhanh, đồng bộ TypeScript với Frontend. |
| **Database** | **MySQL 8.0+ & Redis 7** | Đảm bảo tính toàn vẹn dữ liệu giao dịch (ACID), Redis cache API catalog. |
| **Cloud Storage** | **Cloudflare R2 / AWS S3** | Lưu trữ file theme `.zip` bảo mật, không tốn băng thông máy chủ chính. |
| **Cổng thanh toán** | **VietQR (SePAY Webhook), Stripe, PayPal** | Phủ sóng 100% khách hàng tại Việt Nam và Toàn cầu. |
| **DevOps & CI/CD** | **Docker, Docker Compose, GitHub Actions, Nginx** | Tự động hóa kiểm thử, build image và deploy không gián đoạn dịch vụ. |

---

## 👥 7. CƠ CẤU NHÂN SỰ & PHÂN CÔNG 5 VAI TRÒ (TEAM STRUCTURE)

* **Thành viên 01 (Lead DevOps & Database):** Quản trị MySQL 8.0, Redis, Docker Compose, CI/CD, Nginx, SSL, Cloudflare R2/S3.
* **Thành viên 02 (Backend Core & Catalog):** Auth JWT & RBAC, Quản lý kho Theme, Danh mục ngành nghề, Storage S3 SDK, Swagger Docs.
* **Thành viên 03 (Backend Payment & Licensing):** Quản lý đơn hàng, Webhook VietQR (SePAY 3s), Stripe, Cấp phát License Key, WordPress Auto-Updater API.
* **Thành viên 04 (Frontend Storefront & UX):** Next.js 15 Trang chủ, Bộ lọc Theme đa tiêu chí, Khung Live Preview Bar (Desktop/Tablet/Mobile).
* **Thành viên 05 (Frontend Checkout & Customer Portal):** One-Page Checkout, Popup VietQR tự động polling 3s, Customer Dashboard (`/my-account`), Admin CMS (`/admin`).

---

## 📊 8. CHỈ SỐ ĐO LƯỜNG THÀNH CÔNG (SUCCESS METRICS & KPIS)

1. **Hiệu năng Kỹ thuật:**
   * Thời gian xử lý Webhook thanh toán VietQR và cấp License: **$\le 3$ giây**.
   * Điểm Google PageSpeed / Lighthouse: **$\ge 90$ điểm**.
   * Thời gian tải trang (LCP): **$< 1.8$ giây**.
2. **Kinh doanh & Vận hành:**
   * Tỷ lệ thanh toán thành công (Checkout Conversion Rate): **$\ge 15\%$**.
   * Tỷ lệ hoàn tiền (Refund Rate): **$< 2\%$**.
   * 100% khách hàng có thể tự động cập nhật theme trên WordPress mà không cần hỗ trợ thủ công.

---

## 📅 9. TIẾN ĐỘ THỰC HIỆN DỰ KIẾN (TIMELINE)

* **Tuần 1 - 2:** Hoàn thiện Database, kết nối Docker, dựng khung Auth và Trang chủ.
* **Tuần 3:** Tích hợp cổng VietQR (SePAY) và trang One-Page Checkout.
* **Tuần 4:** Hoàn thiện thanh Live Preview Bar và hệ thống sinh License Key.
* **Tuần 5:** Tích hợp WordPress Auto-Updater API, kiểm thử toàn diện End-to-End.
* **Tuần 6:** Triển khai Production VPS, cấu hình Domain, SSL và bắt đầu mở bán chính thức.
