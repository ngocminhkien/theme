# 📘 PHÂN CÔNG THÀNH VIÊN 04: FRONTEND DEVELOPER (STOREFRONT, CATALOG & LIVE PREVIEW)

> **Vị trí:** Lập trình viên Frontend Phụ trách Giao diện Bán hàng, Khám phá Theme & Thanh Trải nghiệm Demo (FE Storefront & UX)  
> **Mục tiêu:** Xây dựng giao diện mua sắm hiện đại, mượt mà trên Next.js 15, tối ưu điểm SEO và Core Web Vitals, tạo khung Live Preview kích thích khách bấm mua ngay.

---

## 1. PHẠM VI TRÁCH NHIỆM (SCOPE OF WORK)
* **Thư mục & Tệp phụ trách chính:**
  * `frontend/src/app/(store)/` (Trang chủ, Giới thiệu, Liên hệ)
  * `frontend/src/app/themes/` (Trang danh mục & Bộ lọc theme đa ngành)
  * `frontend/src/app/theme/[slug]/` (Trang chi tiết Theme tối ưu tỷ lệ chuyển đổi)
  * `frontend/src/app/preview/[slug]/` (Thanh điều khiển Live Preview responsive & Iframe)
  * `frontend/src/components/layout/` (Header, Footer, Mega Menu, Searchbar)
  * `frontend/src/components/theme/` (ThemeCard, FilterSidebar, DeviceSwitcher)

---

## 2. CÔNG NGHỆ & CÔNG CỤ SỬ DỤNG
* **Framework:** **Next.js 15 (React 19, App Router, Server Components)** + **TypeScript**.
* **CSS & UI:** **Tailwind CSS v4**, **Shadcn/UI** (Radix UI), Lucide Icons, Framer Motion (hiệu ứng mượt mà).
* **Quản lý trạng thái:** **Zustand** (lưu trạng thái Tiền tệ VND/USD, Ngôn ngữ VI/EN, Bộ lọc đang chọn).
* **Gọi API:** TanStack Query (React Query) hoặc Server Fetching của Next.js với ISR (Incremental Static Regeneration).

---

## 3. DANH SÁCH CÔNG VIỆC CHI TIẾT (SPRINT BACKLOG)

### Tuần 1: Khởi tạo Khung Giao Diện & Layout Chuẩn (Header/Footer)
- [x] Khởi tạo dự án Next.js 15 trong thư mục `frontend/`, tích hợp Tailwind CSS và bộ icon Lucide.
- [x] Xây dựng **Header & Navigation Bar**:
  * Bộ chuyển đổi tiền tệ tự động hoặc thủ công: `₫ VND` / `$ USD` (`HeaderTopBar.tsx`).
  * Bộ chuyển đổi ngôn ngữ: `Tiếng Việt` 🇻🇳 / `English` 🇺🇸 (`HeaderTopBar.tsx`).
  * Mega Menu chia theo các nhóm ngành: Thương mại điện tử, Doanh nghiệp B2B, Y tế & Spa, Tin tức & Blog, Công nghệ & Khóa học (`HeaderNavbar.tsx`).
  * Thanh tìm kiếm nhanh (Live Search Popup với gợi ý từ khóa và thumbnail) (`HeaderMain.tsx`).
  * Nút mở Mini-cart trượt (Offcanvas Cart Slideover) (`MiniCartSlideover.tsx`).
- [x] Xây dựng **Footer** đầy đủ thông tin pháp lý, phương thức thanh toán bảo chứng (VietQR, Stripe, PayPal), liên kết mạng xã hội (`Footer.tsx`).

### Tuần 2: Trang Chủ (Homepage) Đẳng Cấp Quốc Tế
- [x] Thiết kế **Hero Section**:
  * Khẩu hiệu mạnh mẽ: *"Kho Giao Diện Website & Template Bản Quyền Chuẩn SEO"*.
  * Widget lọc nhanh 3 bước ngay trên Hero: Chọn Ngành ➔ Chọn Trình dựng trang (Elementor/Gutenberg) ➔ Nút Khám Phá (`HeroSection.tsx`).
- [x] Thiết kế **Danh mục Ngành nổi bật**: Grid thẻ icon sống động với số lượng theme trong từng ngành (`PopularCategories.tsx`).
- [x] Thiết kế **Lưới Theme Bán Chạy (Best Seller Grid)**:
  * Component `ThemeCard`: Mockup bo góc đẹp mắt, huy hiệu giá (VND/USD), số sao đánh giá, nút "Live Preview" và "Mua Ngay" (`theme-card.tsx`).
- [x] Thiết kế **Banner Gói Hội Viên (All-Access Pass)** và khối Đánh giá của khách hàng (Testimonials) (`PromoDealBanner.tsx`, `FeaturedThemesSection.tsx`).

### Tuần 3: Trang Khám Phá Theme & Bộ Lọc Nâng Cao (Catalog & Filter)
- [x] Xây dựng trang `/themes`:
  * **Sidebar & Toolbar Filter đa tiêu chí**:
    * Lọc theo ngành nghề (Pill tabs & Checkbox nhiều lựa chọn).
    * Lọc theo Page Builder (Elementor, WooCommerce, Gutenberg, WPBakery).
    * Thanh trượt / dropdown chọn khoảng giá (Price Range Filter).
    * Sắp xếp: Mới nhất, Bán chạy nhất, Đánh giá cao nhất, Giá tăng/giảm.
  * Hỗ trợ đổi chế độ hiển thị: Grid view (lưới 3 cột) hoặc List view (danh sách ngang).
  * Tích hợp URL query params (ví dụ: `/themes?category=e-commerce&builder=elementor&sort=popular`) để người dùng có thể chia sẻ liên kết lọc (`themes-catalog.tsx`).

### Tuần 4: Trang Chi Tiết Theme & Khung Live Preview Bar (Core Feature)
- [x] Xây dựng trang `/theme/[slug]`:
  * Mockup gallery ảnh lớn, chọn ảnh thumbnail mượt mà (`ThemeDetailClient.tsx`).
  * Khối thông tin kỹ thuật: Phiên bản, ngày cập nhật, phiên bản WordPress/PHP tương thích.
  * Khối chọn loại bản quyền (Regular License vs Agency License vs Lifetime) với giá tiền cập nhật theo thời gian thực.
  * Nút to nổi bật: **"XEM LIVE DEMO TRỰC TIẾP"** và **"THÊM VÀO GIỎ HÀNG"**.
  * Tabs nội dung: Mô tả chi tiết, Danh sách tính năng, Changelog lịch sử, Đánh giá của người mua.
- [x] Xây dựng trang **Live Preview Frame** (`/preview/[slug]`):
  * **Top Bar điều khiển**:
    * Cụm nút chuyển đổi thiết bị: **Desktop (100%)**, **Tablet (768px)**, **Mobile (375px)** kèm viền mô phỏng thiết bị thực tế (`live-preview-bar.tsx`).
    * Dropdown chọn các biến thể demo (Demo 1, Demo 2, Electronics, Fashion...).
    * Nút hành động cố định: **"MUA THEME NÀY (BUY NOW)"** - click là đưa ngay vào giỏ hàng và chuyển checkout.
    * Nút tắt frame / mở trực tiếp trang demo gốc (`ExternalLink`).
  * Vùng hiển thị Iframe nhúng link demo thực tế với kích thước co giãn mượt mà theo thiết bị đã chọn.
- [x] Tối ưu hóa SEO: Thẻ Meta title/description tự động, SSG Static Generation với `generateStaticParams`, điểm kiểm thử toàn bộ 22/22 routes 200 OK.

---

## 4. ĐIỂM GIAO TIẾP VỚI CÁC THÀNH VIÊN KHÁC (DEPENDENCY CONTRACTS)

| Thành viên | Giao tiếp / Bàn giao |
| :--- | :--- |
| **Thành viên 01 (DevOps & DB)** | Yêu cầu cấu hình domain, SSL và tối ưu hóa CDN nén ảnh WebP/AVIF. |
| **Thành viên 02 (BE Core)** | Kết nối các API: danh mục, danh sách theme với bộ lọc query params, chi tiết theme theo slug. |
| **Thành viên 03 (BE Payment & License)** | Đồng bộ thông tin tiền tệ (VND/USD) và trigger thêm sản phẩm vào giỏ hàng. |
| **Thành viên 05 (FE Portal & Checkout)** | Khi khách bấm "Mua Ngay" hoặc "Xem giỏ hàng", chuyển tiếp dữ liệu mượt mà sang trang Checkout của Thành viên 05. |

---

## 5. TIÊU CHUẨN NGHIỆM THU (DEFINITION OF DONE - DoD)
1. Giao diện hiển thị hoàn hảo trên 100% các thiết bị (iPhone, iPad, Macbook, Desktop màn hình rộng).
2. Thanh Live Preview chuyển đổi mượt mà giữa Desktop, Tablet, Mobile mà iframe không bị vỡ giao diện.
3. Bộ lọc Theme phản hồi tức thì mà không cần tải lại toàn bộ trang (sử dụng Next.js Suspense & Client State).
4. Điểm số Google Lighthouse trên Mobile: Performance $\ge 85$, SEO $\ge 95$, Accessibility $\ge 90$.
