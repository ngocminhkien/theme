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
- [ ] Khởi tạo dự án Next.js 15 trong thư mục `frontend/`, tích hợp Tailwind CSS và bộ icon Lucide.
- [ ] Xây dựng **Header & Navigation Bar**:
  * Bộ chuyển đổi tiền tệ tự động hoặc thủ công: `₫ VND` / `$ USD`.
  * Bộ chuyển đổi ngôn ngữ: `Tiếng Việt` 🇻🇳 / `English` 🇺🇸.
  * Mega Menu chia theo 6 nhóm ngành: Thương mại điện tử, Doanh nghiệp B2B, Y tế & Spa, F&B, Giáo dục, Portfolio.
  * Thanh tìm kiếm nhanh (Live Search Popup với gợi ý từ khóa và thumbnail).
  * Nút mở Mini-cart trượt (Offcanvas Cart Slideover).
- [ ] Xây dựng **Footer** đầy đủ thông tin pháp lý, phương thức thanh toán bảo chứng (VietQR, Stripe, PayPal), liên kết mạng xã hội.

### Tuần 2: Trang Chủ (Homepage) Đẳng Cấp Quốc Tế
- [ ] Thiết kế **Hero Section**:
  * Khẩu hiệu mạnh mẽ: *"Kho Giao Diện WordPress Bản Quyền Cho Mọi Lĩnh Vực"*.
  * Widget lọc nhanh 3 bước ngay trên Hero: Chọn Ngành ➔ Chọn Trình dựng trang (Elementor/Gutenberg) ➔ Nút Khám Phá.
- [ ] Thiết kế **Danh mục Ngành nổi bật**: Grid thẻ icon sống động với số lượng theme trong từng ngành.
- [ ] Thiết kế **Lưới Theme Bán Chạy (Best Seller Grid)**:
  * Component `ThemeCard`: Mockup bo góc đẹp mắt, huy hiệu giá (VND/USD), số sao đánh giá, nút "Xem Demo" và "Chi tiết".
- [ ] Thiết kế **Banner Gói Hội Viên (All-Access Pass)** và khối Đánh giá của khách hàng (Testimonials).

### Tuần 3: Trang Khám Phá Theme & Bộ Lọc Nâng Cao (Catalog & Filter)
- [ ] Xây dựng trang `/themes`:
  * **Sidebar Filter đa tiêu chí**:
    * Lọc theo ngành nghề (Checkbox nhiều lựa chọn).
    * Lọc theo Page Builder (Elementor, WooCommerce, Gutenberg, Bricks).
    * Thanh trượt chọn khoảng giá (Price Range Slider).
    * Sắp xếp: Mới nhất, Bán chạy nhất, Đánh giá cao nhất, Giá tăng/giảm.
  * Hỗ trợ đổi chế độ hiển thị: Grid view (lưới 3 cột) hoặc List view (danh sách ngang).
  * Tích hợp URL query params (ví dụ: `/themes?category=e-commerce&builder=elementor&sort=popular`) để người dùng có thể chia sẻ liên kết lọc.

### Tuần 4: Trang Chi Tiết Theme & Khung Live Preview Bar (Core Feature)
- [ ] Xây dựng trang `/theme/[slug]`:
  * Slider hình ảnh mockup chi tiết và video giới thiệu.
  * Khối thông tin kỹ thuật: Phiên bản, ngày cập nhật, phiên bản WordPress/PHP tương thích.
  * Khối chọn loại bản quyền (Regular License vs Agency License) với giá tiền cập nhật theo thời gian thực.
  * Nút to nổi bật: **"XEM LIVE DEMO TRỰC TIẾP"** và **"THÊM VÀO GIỎ HÀNG"**.
  * Tabs nội dung: Mô tả chi tiết, Danh sách tính năng, Changelog lịch sử, Đánh giá của người mua.
- [ ] Xây dựng trang **Live Preview Frame** (`/preview/[slug]`):
  * **Top Bar điều khiển**:
    * Nút chọn thiết bị: **Desktop (100%)**, **Tablet (768px)**, **Mobile (375px)**.
    * Dropdown chọn các biến thể demo (Demo 1, Demo 2...).
    * Nút hành động cố định: **"MUA THEME NÀY (BUY NOW)"** - click là đưa ngay vào giỏ hàng.
    * Nút tắt frame (mở trực tiếp trang demo).
  * Vùng hiển thị Iframe nhúng link demo thực tế với kích thước co giãn mượt mà theo thiết bị đã chọn.
- [ ] Tối ưu hóa SEO: Thẻ Meta title/description tự động, Schema.org Product Rich Snippets, điểm Lighthouse Performance $\ge 90$.

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
