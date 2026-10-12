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

---

## 6. 🚀 NHẬT KÝ NÂNG CẤP TOÀN DIỆN: GIAO DIỆN "THEME TỐT - THẾ GIỚI THEME & PLUGIN WORDPRESS BẢN QUYỀN GIÁ RẺ" [2026-10-12]

### 6.1. Danh Sách Các File & Component Đã Nâng Cấp (Changelog Chi Tiết)

1. **[`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx):**
   - **Thêm mới Thanh Thông Báo Ticker Chạy Chữ (Announcement Ticker):** Tích hợp hiệu ứng chuyển động xoay vòng thông báo siêu ưu đãi, voucher giảm 35% `THEMETOT`, quà tặng Plugin Pro và cam kết bản quyền sạch 100%.
   - **Tích hợp Hotline / Zalo 24/7:** Hiển thị số điện thoại hotline tư vấn nhanh `0988.666.888` kèm icon điện thoại nổi bật.
   - **Bộ chuyển đổi tiền tệ & Tra cứu:** Hỗ trợ chuyển đổi nhanh `₫ VND` / `$ USD` và nút tra cứu bản quyền License Key.

2. **[`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx):**
   - **Đổi mới thương hiệu & Logo sắc nét:** Nhận diện thương hiệu **THEME TỐT** (`THEMETOT.VN`) với biểu tượng đa tầng hiện đại, badge chứng nhận *"SỐ 1 VN"* và slogan *"Thế giới Theme & Plugin WordPress bản quyền giá rẻ"*.
   - **Thanh tìm kiếm thông minh (Smart Search Bar):** Tích hợp chọn nhanh ngành nghề, live search popup hiển thị thumbnail, tên theme, nhãn builder, giá VNĐ ưu đãi kèm giá gạch ngang.
   - **Gợi ý từ khóa Hot (Trending Tags):** Thanh pill từ khóa phổ biến ngay bên dưới ô tìm kiếm: *WoodMart, Flatsome, Theme Bán Hàng, Elementor Pro, Bất Động Sản*.
   - **Nút Tài khoản VIP:** Nút "Tài Khoản / Đăng Nhập VIP" chuyên nghiệp phong cách sàn thương mại điện tử cao cấp.
   - **Mini-cart Drawer Button:** Hiển thị tổng tiền VNĐ thời gian thực và badge số lượng sản phẩm.

3. **[`frontend/src/components/layout/HeaderNavbar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderNavbar.tsx):**
   - **Mega Menu "Tất Cả Danh Mục":** Nút bấm gradient với danh mục ngành nghề phong phú kèm số lượng theme tương ứng.
   - **Thanh điều hướng ngành nghề chuẩn SEO:** Liên kết nhanh đến Theme Bán Hàng, Theme Doanh Nghiệp, Elementor Pro, Bất Động Sản, Theme Chuẩn SEO và nút Live Demo nhấp nháy.
   - **Badge Flash Deal:** Nút nhấp nháy "Deal Giảm 35% Tuần Này" thu hút sự chú ý.

4. **[`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx):**
   - **Tiêu đề lớn & Phụ đề chuẩn SEO:** Headline hoành tráng *"Kho Giao Diện Website & Plugin WordPress Bản Quyền Giá Rẻ Chuẩn SEO"* với gradient text rực rỡ và mô tả chi tiết tối ưu Core Web Vitals, Google PageSpeed 99+, sạch 100% virus.
   - **Widget tìm kiếm trung tâm lớn:** Tích hợp bộ chọn ngành nhanh và nút tìm kiếm gradient bắt mắt.
   - **Cụm 3 nút CTA hành động mạnh mẽ:** "Khám Phá 500+ Themes", "Gói VIP All-Access (Tải Không Giới Hạn)" và "Tư Vấn Zalo 24/7 (0988.666.888)".
   - **Hai banner phụ nổi bật (Feature Banners):**
     * Banner 1: *Theme Bán Hàng Siêu Tốc Độ* (WooCommerce, WoodMart, Flatsome, tải trang dưới 0.8s, tích hợp VietQR).
     * Banner 2: *Gói Thành Viên VIP All-Access Pass* (Tải không giới hạn 500+ theme & plugin cho Agency & Freelancer, tiết kiệm 85%).
   - **Thanh Trust Stats Bar 4 tiêu chí:** 500+ Theme bản quyền sạch, 15.000+ Khách hàng tin dùng, 99/100 PageSpeed xanh, 4.9/5.0 Đánh giá 5 sao.

5. **[`frontend/src/components/home/MarqueeFeatures.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/MarqueeFeatures.tsx):**
   - Thiết kế 5 khối cam kết vàng của Theme Tốt:
     * 100% Bản Quyền Sạch (Quét VirusTotal an toàn).
     * Kích Hoạt VietQR Tự Động Trong 30 Giây.
     * Chuẩn SEO & Tốc Độ Siêu Nhanh 99+.
     * Tặng Kèm Bộ Plugin Pro (Elementor Pro, Rank Math Pro, WP Rocket).
     * Cài Đặt Demo 1-Click 24/7 Qua UltraViewer/Zalo.

6. **[`frontend/src/components/home/PopularCategories.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PopularCategories.tsx):**
   - Bổ sung lưới danh mục ngành hàng trực quan với icon sinh động:
     * Bán Hàng & Thương Mại Điện Tử (WooCommerce Shop).
     * Doanh Nghiệp, B2B & Agency (Hồ sơ năng lực).
     * Bất Động Sản & Xây Dựng (Dự án, môi giới nhà đất).
     * Công Nghệ, SaaS & Khóa Học (LMS, App di động).
     * Tin Tức, Báo Chí & Blog.
     * Đa Năng & Landing Page Chạy Ads Chuyển Đổi Cao.
   - Hiển thị đầy đủ số lượng theme, subcategories pill chips và nút khám phá.

7. **[`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/FeaturedThemesSection.tsx):**
   - Tích hợp Tabs chuyển đổi mượt mà: Tất Cả, Theme Bán Hàng, Doanh Nghiệp, Flash Sale -35%, Elementor Pro.
   - Lưới 4 cột hiển thị sản phẩm theo chuẩn thiết kế `ThemeCard` mới.

8. **[`frontend/src/components/home/PromoDealBanner.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PromoDealBanner.tsx):**
   - **Đồng hồ đếm ngược Flash Sale (Countdown Timer):** Hiển thị Ngày : Giờ : Phút : Giây với animation sống động.
   - **Thanh tiến độ số lượng bán:** "🔥 Đã bán: 86 / 100 suất ưu đãi trong ngày (Chỉ còn 14 suất cuối)" với progress bar đỏ/cam thu hút.
   - **Khối Quà Tặng Khủng trị giá 2.500.000₫:** Tặng Elementor Pro, Rank Math SEO, WP Rocket và hỗ trợ cài đặt trọn đời.

9. **[`frontend/src/features/themes/components/theme-card.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/theme-card.tsx):**
   - **Thiết kế lại thẻ sản phẩm chuẩn sàn TMĐT:**
     * Thumbnail sắc nét với hiệu ứng zoom hover 1.08x mượt mà.
     * Badges: `GIẢM 35%`, `🔥 BÁN CHẠY`, `✨ MỚI 2026`, badge Page Builder (`Elementor`, `Flatsome`, `Gutenberg`).
     * Lớp phủ kính mờ khi hover với 2 nút hành động nhanh: **"Xem Demo"** và **"Mua Ngay"** (Zustand Zap Buy chuyển thẳng sang checkout).
     * Đánh giá sao vàng: `★ 4.98 (320 đánh giá)` kèm `2,450+ đã bán`.
     * Giá tiền ưu đãi màu đỏ/rose lớn nổi bật kèm đơn vị `₫` / `VND`, giá gốc gạch ngang rõ ràng và nhãn *"Bản quyền trọn đời • Update 1-Click"*.
     * Nút thêm vào giỏ hàng và nút xem chi tiết.

10. **[`frontend/src/features/preview/components/live-preview-bar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/preview/components/live-preview-bar.tsx):**
    - **Thanh điều khiển cố định đỉnh màn hình (Fixed Top Bar):**
      * Nút quay lại sàn Theme Tốt.
      * Tên theme, phiên bản, thể loại.
      * Dropdown chuyển đổi biến thể layout demo trực tiếp.
      * **Device Switcher Segmented Pills:**
        - **Desktop (100% full width)**.
        - **Tablet (768px)**: Khung viền iPad chân thực với camera và viền bezel bo góc.
        - **Mobile (375px)**: Khung viền iPhone hiện đại tích hợp cụm Dynamic Island tinh tế.
      * Nút mở tab mới (`ExternalLink`).
      * Nút CTA nổi bật: **"MUA NGAY: [GIÁ TIỀN VNĐ]"**.

11. **[`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx):**
    - Bộ lọc đa tiêu chí mượt mà: Lọc danh mục ngành nghề, Page Builder, khoảng giá, từ khóa tìm kiếm real-time.
    - Active Filter Chips hiển thị rõ ràng cho phép xóa từng tiêu chí hoặc đặt lại toàn bộ.
    - Hỗ trợ chuyển đổi chế độ xem Grid View (Lưới) và List View (Danh sách ngang) đồng bộ query params.

12. **[`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx):**
    - Chân trang đa cột mang thương hiệu **THEME TỐT (THEMETOT.VN)**.
    - Dải đăng ký nhận mã ưu đãi giảm 20% & bộ plugin pro.
    - Thông tin doanh nghiệp, hotline, địa chỉ, email hỗ trợ.
    - Các cam kết bảo hành hoàn tiền 100%, quét sạch mã độc, cài đặt demo miễn phí.
    - Huy hiệu đối tác thanh toán VietQR, SePay, MBBank, Visa, MoMo, Stripe và chứng nhận mã hóa SSL 256-bit.

13. **[`frontend/src/app/layout.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/layout.tsx) & [`frontend/src/app/themes/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/themes/page.tsx):**
    - Chuẩn hóa toàn bộ thẻ Metadata SEO tiêu chuẩn cho thương hiệu Theme Tốt.

---

### 6.2. Kết Quả Kiểm Thử Toàn Diện (Verification Results)

| Bài kiểm tra | Lệnh thực thi | Kết quả | Chi tiết |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm run type-check` | ✅ **Exit code 0** | TypeScript 5.9 không có bất kỳ lỗi cú pháp nào. |
| **Production Build** | `npm run build` | ✅ **Exit code 0** | Next.js 15 prerender thành công 22/22 static pages bao gồm các dynamic routes `/preview/[slug]` và `/theme/[slug]`. |
| **Độ ổn định Dev Server** | `npm run dev -p 3000` | ✅ **Hoạt động liên tục** | Fast Refresh tức thì, khởi động sẵn sàng trong 4.9 giây. |
| **Kiểm tra HTTP Routes** | `GET http://localhost:3000` | ✅ `200 OK` | Trang chủ Theme Tốt với đầy đủ Hero, Categories, Flash Sale, Lưới theme. |
| **Kiểm tra Catalog** | `GET http://localhost:3000/themes` | ✅ `200 OK` | Bộ lọc đa tiêu chí, sắp xếp giá, active chips hoạt động trơn tru. |
| **Kiểm tra Live Preview** | `GET http://localhost:3000/preview/woodmart-multipurpose` | ✅ `200 OK` | Thanh điều khiển responsive Desktop / Tablet / Mobile mượt mà. |
| **Kiểm tra Chi Tiết Theme** | `GET http://localhost:3000/theme/woodmart-multipurpose` | ✅ `200 OK` | Trang chi tiết với 3 gói license và 4 tab kỹ thuật. |
| **Kiểm tra Thanh Toán** | `GET http://localhost:3000/checkout` | ✅ `200 OK` | Form thông tin và popup mã VietQR tự động. |

---

### 6.3. Hướng Dẫn Chạy Thử Giao Diện Mới

1. Mở terminal tại thư mục `frontend`:
   ```bash
   cd frontend
   npm run dev
   ```
2. Truy cập trình duyệt tại: **[http://localhost:3000](http://localhost:3000)** để trải nghiệm giao diện Theme Tốt.
3. Thử nghiệm các tính năng nổi bật:
   * **Thanh Ticker phía trên cùng:** Quan sát các dòng thông báo ưu đãi và hotline chạy chữ xoay vòng.
   * **Tìm kiếm thời gian thực:** Nhập từ khóa *"WoodMart"* hoặc *"Flatsome"* trên thanh tìm kiếm để xem gợi ý Live Search Popup.
   * **Chuyển đổi tiền tệ:** Bấm nút `₫ VND` hoặc `$ USD` để thấy toàn bộ giá sản phẩm cập nhật tự động.
   * **Live Preview Bar:** Bấm vào nút *"Xem Demo"* trên bất kỳ thẻ theme nào hoặc truy cập trực tiếp `http://localhost:3000/preview/woodmart-multipurpose`, sau đó bấm chọn các chế độ *Desktop*, *Tablet* (iPad) và *Mobile* (iPhone Dynamic Island).
   * **Đặt hàng nhanh:** Bấm nút *"Mua Ngay"* trên thẻ theme để được tự động thêm vào giỏ và chuyển sang trang Checkout với popup VietQR.

---

## 7. 🌟 NÂNG CẤP BỐ CỤC TRÀN VIỀN (FLUID LAYOUT 1720PX) & HỆ THỐNG ĐĂNG NHẬP / ĐĂNG KÝ SPLIT SCREEN [2026-10-12]

### 7.1. Bố Cục Tràn Viền Toàn Màn Hình (Fluid / Expansive E-Commerce Layout)
- **Chuẩn hóa container:** Loại bỏ hoàn toàn hạn chế khung hẹp `max-w-7xl` (1280px) vốn tạo khoảng trống lề quá lớn trên màn hình 2K/4K/FHD.
- **Tiêu chuẩn mới:** Tất cả các khối được quy hoạch đồng bộ theo tiêu chuẩn thương mại điện tử quốc tế (như Envato Elements, ThemeForest):
  ```tsx
  w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12
  ```
- **Các khối được nâng cấp tràn viền:**
  1. **Header Top Bar & Header Main:** Mở rộng tối đa, thanh tìm kiếm mở rộng tới `max-w-4xl` trên màn hình lớn.
  2. **Header Navigation:** Dải danh mục và mega menu trải rộng toàn màn hình với hiệu ứng border chân kính mờ.
  3. **Hero Section:** Banner, form tìm kiếm trung tâm lớn, 2 card khuyến mại phụ và thanh thống kê 4 cột bung rộng toàn màn hình.
  4. **Marquee Features:** 5 thẻ cam kết chất lượng tự động dãn đều theo độ rộng màn hình.
  5. **Khối Danh Mục (Popular Categories):** Mở rộng linh hoạt lên tới 6 cột trên màn hình siêu rộng (`2xl:grid-cols-6`).
  6. **Lưới Sản Phẩm Nổi Bật (Featured Themes):** Lưới 4 cột rộng rãi, thẻ sản phẩm tỉ lệ 16:10 sắc nét, không bị bó hẹp.
  7. **Promo Deal Banner & Footer:** Tràn viền cân đối, dải newsletter và 4 cột thông tin trải đều sang hai bên lề.
  8. **Trang Danh Mục `/themes` & Chi Tiết `/theme/[slug]`:** Sidebar bộ lọc và catalog mở rộng tối đa không gian hiển thị.

### 7.2. Hệ Thống Đăng Nhập & Đăng Ký Chuẩn Split Screen Đẳng Cấp
- **Định tuyến App Router:**
  - Tuyến đường Đăng nhập: [`/login`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/login/page.tsx)
  - Tuyến đường Đăng ký: [`/register`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/register/page.tsx)
- **Kiến trúc Split Screen (50/50):**
  - **Cột Trái (Brand Experience & Perks Showcase):**
    - Nền gradient công nghệ `bg-gradient-to-br from-slate-950 via-indigo-950/90 to-blue-950` kèm họa tiết lưới `bg-grid-pattern` và luồng sáng radial glow.
    - Huy hiệu nhận diện thương hiệu **THEMETOT.VN** sắc nét.
    - Khối quyền lợi VIP độc quyền: Kho 500+ Theme bản quyền, Plugin Pro kích hoạt sẵn (Elementor Pro, Rank Math Pro), hỗ trợ kỹ thuật 24/7 và bảo hành trọn đời.
    - Testimonial của Founder/Agency đánh giá 5 sao.
    - Quà tặng thành viên mới trị giá **2.500.000₫** kèm thanh thống kê tin cậy (15.000+ khách hàng, 99.8% hài lòng).
  - **Cột Phải (Interactive Authentication Form):**
    - Khung nhập liệu tinh tế với hiệu ứng focus viền sáng `focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10`.
    - Đăng nhập 1-Click qua mạng xã hội: **Google** (với icon Google chính thức) và **GitHub**.
    - Nút bật/tắt hiển thị mật khẩu trực quan (`Eye` / `EyeOff`).
    - **Thước đo độ mạnh mật khẩu (Password Strength Meter):** Đo lường thời gian thực từ Yếu (Đỏ) ➔ Trung bình (Vàng) ➔ Rất mạnh (Xanh) kèm 4 tiêu chí xác thực (độ dài $\ge 8$ ký tự, chữ hoa, số, ký tự đặc biệt).
    - Hộp kiểm *"Ghi nhớ đăng nhập"* và liên kết *"Quên mật khẩu?"*.
    - Nút Submit với hiệu ứng **Loading Spinner** mô phỏng xử lý xác thực bảo mật và thông báo đăng nhập/đăng ký thành công tức thì.
    - Chuyển đổi qua lại mượt mà giữa trang Đăng nhập và Đăng ký.

### 7.3. Danh Sách File Mới & Tinh Chỉnh

1. **[`frontend/src/app/login/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/login/page.tsx) (MỚI):**
   - Trang Đăng nhập Split Screen, xác thực đa phương thức, nhớ phiên đăng nhập, validation trực quan.
2. **[`frontend/src/app/register/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/register/page.tsx) (MỚI):**
   - Trang Đăng ký Split Screen, quà tặng 2.500.000₫, thước đo độ mạnh mật khẩu 4 cấp độ, đồng ý điều khoản dịch vụ.
3. **[`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx):**
   - Tinh chỉnh container `max-w-[1720px]`, bổ sung liên kết trực tiếp tới `/login` và `/register`.
4. **[`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx):**
   - Mở rộng container `max-w-[1720px]`, mở rộng ô tìm kiếm `max-w-4xl`, liên kết nút Tài khoản VIP tới `/login`.
5. **[`frontend/src/components/layout/HeaderNavbar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderNavbar.tsx):**
   - Tinh chỉnh `max-w-[1720px]` tràn viền đều hai bên.
6. **[`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx):**
   - Tinh chỉnh `max-w-[1720px]`, thanh tìm kiếm trung tâm lớn `max-w-3xl`, 4 cột trust stats bung rộng hoàn hảo.
7. **[`frontend/src/components/home/PopularCategories.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PopularCategories.tsx):**
   - Mở rộng lưới danh mục `2xl:grid-cols-6` tương thích màn hình lớn.
8. **[`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/FeaturedThemesSection.tsx):**
   - Mở rộng lưới sản phẩm `max-w-[1720px]`.
9. **[`frontend/src/components/home/PromoDealBanner.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PromoDealBanner.tsx):**
   - Căn chỉnh Flash Sale box và quà tặng plugin pro dàn đều sang hai bên viền `max-w-[1720px]`.
10. **[`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx):**
    - Mở rộng toàn bộ layout trang catalog sản phẩm sang `max-w-[1720px]`.
11. **[`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx):**
    - Mở rộng `max-w-[1720px]`, bổ sung liên kết điều hướng tới `/login` và `/register`.

### 7.4. Kết Quả Kiểm Thử (Verification Results)

| Kiểm Tra | Lệnh / URL | Trạng Thái | Ghi Chú |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm run type-check` | ✅ **Exit code 0** | Không có lỗi kiểu dữ liệu TypeScript. |
| **Next.js Production Build** | `npm run build` | ✅ **Exit code 0** | Prerender thành công **24/24 static pages** (bao gồm `/login` và `/register`). |
| **Route Trang Chủ (Full Width)** | `http://localhost:3000` | ✅ `200 OK` | Giao diện bung tràn viền 1720px cân đối, không còn lề thừa. |
| **Route Đăng Nhập** | `http://localhost:3000/login` | ✅ `200 OK` | Giao diện Split Screen hoàn chỉnh, nút ẩn/hiện pass, Google/GitHub login. |
| **Route Đăng Ký** | `http://localhost:3000/register` | ✅ `200 OK` | Thước đo password strength hoạt động mượt mà, xác thực điều khoản. |
| **Route Khám Phá Themes** | `http://localhost:3000/themes` | ✅ `200 OK` | Layout tràn viền, bộ lọc nhạy bén. |

### 7.5. Hướng Dẫn Kiểm Thử Giao Diện Mới (Test Guide)

1. **Kiểm tra Layout Tràn Viền:**
   - Truy cập **[http://localhost:3000](http://localhost:3000)** trên trình duyệt màn hình lớn (1080p, 2K hoặc phóng to/thu nhỏ `Ctrl + -`).
   - Quan sát Header, Hero Banner, Lưới danh mục 6 cột, Lưới theme và Footer tự động dãn đều theo độ rộng `1720px` sắc sảo, cân đối hai bên mép màn hình.
2. **Kiểm tra Trang Đăng Nhập (Login):**
   - Bấm vào nút *"Tài khoản VIP"* trên Header hoặc truy cập trực tiếp: **[http://localhost:3000/login](http://localhost:3000/login)**.
   - Thử nghiệm:
     - Bấm nút icon con mắt để ẩn/hiện mật khẩu.
     - Bấm nút đăng nhập qua Google hoặc GitHub.
     - Nhập email và mật khẩu rồi bấm *"Đăng Nhập Vào Hệ Thống"* để kiểm tra hiệu ứng loading spinner và thông báo thành công.
3. **Kiểm tra Trang Đăng Ký (Register):**
   - Bấm vào liên kết *"Đăng ký tài khoản mới"* hoặc truy cập trực tiếp: **[http://localhost:3000/register](http://localhost:3000/register)**.
   - Thử nghiệm:
     - Nhập mật khẩu từng ký tự để quan sát thanh màu đo độ mạnh mật khẩu (Yếu ➔ Trung bình ➔ Rất mạnh) và 4 tiêu chí tự động đổi màu xanh.
     - Bấm *"Đăng Ký & Nhận Quà Tặng"* để xem trạng thái loading và phản hồi hoàn tất.


---

## 8. 🌟 RÀ SOÁT VÀ NÂNG CẤP TOÀN DIỆN THƯƠNG HIỆU THEME STORE, BỎ BREADCRUMB & TĂNG SIZE CHỮ TOÀN DIỆN [2026-10-12]

### 8.1. Đồng bộ Thương hiệu & Thay thế Toàn diện Văn bản ("Theme Tốt" ➔ "Theme Store")
- **Quy chuẩn nhận diện thương hiệu:**
  - Thay thế toàn bộ 100% mọi xuất hiện của từ khóa **"Theme Tốt"**, **"THEMETOT"**, **"THEMETOT.VN"** thành thương hiệu chuẩn hóa duy nhất: **"Theme Store"** (Domain: `THEMESTORE.VN`, Voucher mặc định: `THEMESTORE` / `THEMESTORE20`).
  - Cố định lại logo chính của website hiển thị chuẩn **"Theme Store"** (`THEME` `<span className="text-amber-500">STORE</span>`) sắc nét, tinh tế, font dày hiện đại, có huy hiệu `OFFICIAL` tại thanh Header và Split Screen Banner.
- **Các thành phần được cập nhật thương hiệu:**
  1. [`frontend/src/app/layout.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/layout.tsx): Metadata title `THEME STORE - Sàn Thương Mại Điện Tử Theme & Plugin WordPress Bản Quyền`, keywords, OpenGraph titles và authors `THEMESTORE.VN Team`.
  2. [`frontend/src/app/themes/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/themes/page.tsx): Metadata title chuẩn `THEME STORE`.
  3. [`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx): Voucher `THEMESTORE`, hotline hỗ trợ, dải thông báo khuyến mại.
  4. [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx): Logo chuẩn **THEME STORE**, subtext *"Thế giới Theme & Plugin WordPress bản quyền chính hãng"*.
  5. [`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/FeaturedThemesSection.tsx): Mô tả *"Theme bản quyền tuyển chọn tại Theme Store"*.
  6. [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx): Empty state thông báo khi không tìm thấy theme tại Theme Store.
  7. [`frontend/src/features/preview/components/live-preview-bar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/preview/components/live-preview-bar.tsx): Nút quay lại *"Về Theme Store"*.
  8. [`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx): Huy hiệu `THEME STORE`, email `hotro@themestore.vn`, bản quyền `THEMESTORE.VN © 2026`.
  9. [`frontend/src/app/login/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/login/page.tsx): Logo Split Screen, khẩu hiệu và bản quyền Theme Store.
  10. [`frontend/src/app/register/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/register/page.tsx): Logo Split Screen, voucher chào mừng `THEMESTORE20`, điều khoản dịch vụ và footer Theme Store.
  11. [`frontend/src/app/checkout/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/checkout/page.tsx): Mã đơn hàng định dạng `TS-xxxxxx`, tên tài khoản nhận VietQR chuẩn hóa `THEMESTORE+VN`.

### 8.2. Tinh chỉnh Layout & Xóa bỏ Hoàn toàn Thành phần Thừa (Breadcrumbs)
- **Xóa bỏ Breadcrumb:**
  - Xóa bỏ triệt để thanh điều hướng phân cấp dạng breadcrumb (ví dụ: *"Trang Chủ > Kho Theme Tốt"*) trên trang Catalog danh mục ([`themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx)) và trang Chi tiết sản phẩm ([`ThemeDetailClient.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/theme/[slug]/ThemeDetailClient.tsx)).
  - Loại bỏ các import không dùng (`ChevronRight`) giúp mã nguồn sạch sẽ, không gian hiển thị thoáng đãng, sang trọng và chuẩn giao diện e-commerce hiện đại.
- **Layout Tràn Viền Tối Đa (Full-Width / Fluid Layout):**
  - Mở rộng toàn bộ layout ra toàn màn hình với container `w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12`.
  - Cân đối tràn viền đồng bộ giữa Header TopBar, Header Main, Navbar, Hero Banner, Khối danh mục, Lưới sản phẩm và Footer.

### 8.3. Nâng Cấp Kích Thước Chữ Toàn Diện (Typography Scaling Up)
- Khắc phục triệt để tình trạng chữ nhỏ, nâng cấp quy chuẩn kích thước chữ trên toàn bộ website lên 1 bậc:
  - **Body / Text cơ bản:** Nâng từ `text-xs` lên `text-sm`, `text-sm` lên `text-base`.
  - **Headings & Tiêu đề:**
    - Hero headline: Nâng lên `text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black`.
    - Section titles: Nâng lên `text-2xl sm:text-3xl xl:text-4xl font-black`.
    - Card titles: Nâng lên `text-base` / `text-lg font-bold`.
  - **Giá tiền & Khuyến mại:** Nâng lên `text-xl sm:text-2xl font-black` (trên thẻ theme), `text-3xl font-black` (trang chi tiết theme) và `text-2xl font-black` (trang checkout).
  - **Nhãn, Nút bấm & Form inputs:**
    - Tăng kích thước nút CTA (`py-3.5` ➔ `py-4`, `text-sm` ➔ `text-base font-black`).
    - Nâng cỡ chữ các trường input, label form (`text-xs sm:text-sm font-bold`), search inputs (`text-sm sm:text-base`).
    - Nâng cỡ chữ của bộ lọc pills, tabs chuyển đổi, badges (`text-xs font-black` thay vì `text-[10px]`).

### 8.4. Hoàn Thiện Trang Đăng Nhập & Đăng Ký Split Screen (Login / Register)
- **Thiết kế Split Screen sang trọng:**
  - **Cột Trái (Brand Showcase & Perks):** Trình diễn đặc quyền VIP, voucher `THEMESTORE20`, quà tặng 3 Plugin Pro bản quyền trị giá 2.500.000₫, cam kết license trọn đời và cộng đồng 15.000+ developer.
  - **Cột Phải (Authentication Form):**
    - Đăng nhập/Đăng ký nhanh qua **Google** và **GitHub** với hiệu ứng hover bóng đổ tinh tế.
    - Tính năng ẩn/hiện mật khẩu trực quan với icon Eye / EyeOff.
    - Thước đo độ mạnh mật khẩu (Password Strength Meter) theo thời gian thực (Yếu / Trung bình / Rất mạnh).
    - Hiệu ứng focus ring mượt mà (`focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10`).
    - Trạng thái loading spinner (`Loader2`) khi submit form, phản hồi kết quả và tự động chuyển hướng chuẩn Next.js App Router.

### 8.5. Bảng Tổng Hợp Kiểm Thử & Nghiệm Thu
| Nội dung kiểm tra | Phương thức thực hiện | Trạng thái | Đánh giá nghiệm thu |
| :--- | :--- | :--- | :--- |
| **Kiểm tra TypeScript** | `npm run type-check` | ✅ **Exit code 0** | Toàn bộ mã nguồn FE sạch lỗi kiểu dữ liệu. |
| **Kiểm tra Brand Sync** | Quét toàn bộ `frontend/src` | ✅ **0 xuất hiện "Theme Tốt"** | Đã chuyển đổi 100% sang "Theme Store". |
| **Kiểm tra Breadcrumbs** | Quét toàn bộ `frontend/src` | ✅ **Đã xóa sạch** | Không còn bất kỳ thanh breadcrumb nào trên UI. |
| **Kiểm tra HTTP `/`** | `GET http://localhost:3000` | ✅ `200 OK` | Logo Theme Store sắc nét, layout 1720px tràn viền, chữ to rõ ràng. |
| **Kiểm tra HTTP `/login`** | `GET http://localhost:3000/login` | ✅ `200 OK` | Split Screen hoàn chỉnh, ẩn/hiện mật khẩu mượt mà. |
| **Kiểm tra HTTP `/register`** | `GET http://localhost:3000/register` | ✅ `200 OK` | Thước đo mật khẩu, quà tặng THEMESTORE20, checkbox điều khoản. |
| **Kiểm tra HTTP `/themes`** | `GET http://localhost:3000/themes` | ✅ `200 OK` | Không có breadcrumb, tiêu đề lớn, bộ lọc pills nổi bật. |

### 8.6. Hướng Dẫn Kiểm Tra Nhanh (Quick Verification)
1. Khởi động môi trường nếu chưa chạy:
   ```bash
   cd frontend
   npm run dev
   ```
2. Truy cập trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**:
   - Kiểm tra Logo Header hiển thị: **THEME STORE** (chữ STORE màu vàng cam nổi bật).
   - Kiểm tra không còn thanh breadcrumb.
   - Kiểm tra độ rõ ràng của font chữ (heading, giá tiền, badge, thanh tìm kiếm).
3. Truy cập **[http://localhost:3000/login](http://localhost:3000/login)**:
   - Kiểm tra giao diện Split Screen 50/50, thử bấm nút icon con mắt để ẩn/hiện mật khẩu.
   - Thử bấm nút Google hoặc GitHub để xem phản hồi chuyển hướng mượt mà.
4. Truy cập **[http://localhost:3000/register](http://localhost:3000/register)**:
   - Nhập mật khẩu để quan sát thanh đo độ mạnh mật khẩu (Yếu ➔ Trung bình ➔ Rất mạnh).
   - Bấm *"Tạo Tài Khoản Ngay"* để trải nghiệm hiệu ứng loading và voucher chào mừng `THEMESTORE20`.
5. Truy cập **[http://localhost:3000/themes](http://localhost:3000/themes)**:
   - Xác nhận thanh breadcrumb đã bị xóa bỏ hoàn toàn, giao diện sạch đẹp và tràn viền `1720px`.


---

## 9. 🌟 TÍCH HỢP CỤM WIDGET NỔI CỐ ĐỊNH GÓC PHẢI (FLOATING ACTION BUTTONS / WIDGETS) [2026-10-12]

### 9.1. Kiến Trúc & Tính Năng Cụm Widget Nổi (Floating Widgets)
- **Tập tin tạo mới:** [`frontend/src/components/layout/FloatingWidgets.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/FloatingWidgets.tsx)
- **Tập tin cấu hình CSS & Animation:** [`frontend/src/app/globals.css`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/globals.css) (keyframes `gift-wiggle` và `hotline-ring`).
- **Tích hợp toàn cục:** [`frontend/src/app/layout.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/layout.tsx) (hiển thị cố định trên mọi trang storefront, tự động ẩn trên trang iframe Live Preview `/preview/[slug]`).
- **Bố cục cố định (Fixed Bottom-Right):**
  - Vị trí: `fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 select-none pointer-events-auto`.
  - Luôn nổi lên trên mọi thành phần giao diện (`z-50`), hỗ trợ responsive hoàn hảo trên mọi kích thước màn hình điện thoại, máy tính bảng và desktop.

### 9.2. Chi Tiết 3 Widget Nổi Thành Phần
1. **Nút Hộp Quà Ưu Đãi (Top Widget):**
   - **Vị trí:** Đặt ở trên cùng của cụm widget.
   - **Giao diện:** Thiết kế dạng viên thuốc (pill badge) nền gradient đỏ bắt mắt `bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black`.
   - **Hiệu ứng thu hút:** Icon hộp quà rung nhẹ theo chu kỳ (`animate-gift`), chấm thông báo nhấp nháy `animate-ping`, ngọn lửa khuyến mãi `animate-pulse` và bóng đổ sâu `shadow-xl shadow-red-500/35`.
   - **Dòng chữ:** *"Nhận Ưu Đãi Hôm Nay"*.
   - **Tương tác khi bấm:** Kích hoạt mở **Popup Modal Nhận Ưu Đãi Hôm Nay** sang trọng:
     - Hiển thị mã giảm giá độc quyền: `THEMESTORE20` (giảm 20% đơn đầu tiên) với nút **Sao Chép 1-Click** (chuyển sang "Đã chép" và thông báo xác nhận).
     - Liệt kê bộ quà tặng: Giảm 20%, Tặng 3 Plugin Pro (Elementor Pro, Rank Math Pro, WP Rocket) trị giá 2.500.000₫, hỗ trợ cài đặt qua UltraViewer.
     - Nút CTA chuyển hướng nhanh đến kho theme `/themes`.

2. **Nút Messenger (Middle Widget):**
   - **Vị trí:** Nằm ở giữa cụm widget.
   - **Giao diện:** Nút tròn kích thước chuẩn `w-12 h-12 sm:w-14 sm:h-14` với màu gradient xanh/tím đặc trưng của Messenger (`from-[#0078FF] via-[#00B2FE] to-[#A824FF]`).
   - **Biểu tượng:** Logo chính thức Messenger Chat Bubble dạng vector SVG sắc nét.
   - **Hiệu ứng:** Bóng đổ đa lớp `shadow-blue-500/35`, hiệu ứng nổi lên và phóng to khi rê chuột (`hover:-translate-y-1 hover:scale-110`).
   - **Tooltip mượt:** Hiển thị nhãn *"💬 Chat Messenger 24/7"* bên trái nút khi hover.
   - **Tương tác khi bấm:** Mở trực tiếp khung chat Messenger tại `https://m.me/themestore.vn` trong tab mới.

3. **Nút Hotline Điện Thoại (Thay thế hoàn toàn Zalo, Bottom Widget):**
   - **Vị trí:** Nằm ở vị trí dưới cùng của cụm widget.
   - **Yêu cầu thay thế:** Đã thay thế hoàn toàn biểu tượng Zalo bằng **icon Biểu tượng Điện thoại (Phone / Hotline)**.
   - **Giao diện:** Nút tròn nổi bật với màu xanh lá công nghệ `bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-500`.
   - **Hiệu ứng đặc biệt:** Vòng sóng radar tỏa ra liên tục (`animate-ping` và `animate-pulse`), icon `PhoneCall` rung chuông điện thoại (`animate-hotline-ring`).
   - **Tooltip Hotline:** Hiển thị nhãn *"📞 Hotline: 0988.666.888 (Gọi ngay)"* bên trái nút khi hover.
   - **Tương tác khi bấm:** Gắn link `href="tel:0988666888"` kích hoạt ứng dụng quay số gọi điện trực tiếp trên điện thoại hoặc máy tính.

### 9.3. Bảng Tổng Hợp Kiểm Thử & Nghiệm Thu
| Nội dung kiểm tra | Phương thức thực hiện | Trạng thái | Đánh giá nghiệm thu |
| :--- | :--- | :--- | :--- |
| **Kiểm tra TypeScript** | `npm run type-check` | ✅ **Exit code 0** | Không có lỗi kiểu dữ liệu. |
| **Kiểm tra Render HTML** | `GET http://localhost:3000` | ✅ **Rendered** | Đầy đủ nút Hộp quà, Messenger, Hotline trong HTML. |
| **Nút Hộp Quà Ưu Đãi** | Bấm nút trên UI | ✅ **Hoạt động tốt** | Mở popup ưu đãi, sao chép mã `THEMESTORE20` trơn tru. |
| **Nút Messenger** | Bấm nút trên UI | ✅ **Hoạt động tốt** | Mở liên kết `m.me/themestore.vn` tab mới, hover nổi mượt. |
| **Nút Hotline (Thay thế Zalo)** | Bấm nút trên UI | ✅ **Hoạt động tốt** | Kích hoạt gọi `tel:0988666888`, sóng radar lan tỏa. |
| **Độ bao phủ toàn hệ thống** | Kiểm tra `/`, `/themes`, `/login`, `/register`, `/checkout` | ✅ **Cố định mọi trang** | Luôn ghim cố định ở góc dưới bên phải (`z-50`). |

### 9.4. Hướng Dẫn Kiểm Tra Nhanh (Quick Test Guide)
1. Mở trình duyệt và truy cập bất kỳ trang nào (ví dụ: **[http://localhost:3000](http://localhost:3000)** hoặc **[http://localhost:3000/themes](http://localhost:3000/themes)**).
2. Quan sát góc dưới bên phải màn hình:
   - Thấy cụm 3 widget xếp dọc thẳng hàng gồm:
     - **Trên cùng:** Nút đỏ "Nhận Ưu Đãi Hôm Nay" kèm icon hộp quà rung nhẹ và ngọn lửa.
     - **Ở giữa:** Nút tròn Messenger gradient xanh tím.
     - **Dưới cùng:** Nút tròn Hotline xanh lá cây với sóng radar lan tỏa (đã thay thế Zalo).
3. Thử nghiệm tương tác:
   - **Bấm vào nút Hộp Quà:** Popup ưu đãi hiện lên với mã `THEMESTORE20`. Bấm nút *"Sao Chép"* để copy mã.
   - **Rê chuột vào nút Messenger:** Quan sát tooltip *"Chat Messenger 24/7"* hiện ra bên trái, nút nổi lên nhẹ nhàng.
   - **Rê chuột vào nút Hotline:** Quan sát tooltip *"Hotline: 0988.666.888"* và hiệu ứng rung chuông điện thoại. Bấm nút để kiểm tra kích hoạt gọi trực tiếp `tel:0988666888`.
4. Cuộn trang lên xuống: Xác nhận cụm widget luôn cố định (`fixed bottom-6 right-6 z-50`) và hiển thị đè lên trên tất cả các khối nội dung khác.


---

## 10. 🌟 TINH CHỈNH GIAO DIỆN, FIX LỖI CĂN CHỈNH & XÓA BỎ DÒNG GỢI Ý THỪA [2026-10-12]

### 10.1. Danh Sách Các Mục Đã Xử Lý & Khắc Phục Triệt Để
1. **Xóa Bỏ Hoàn Toàn Dòng Gợi Ý Thừa Phía Dưới Thanh Tìm Kiếm:**
   - **Tập tin tinh chỉnh:** [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx)
   - Đã loại bỏ hoàn toàn dải văn bản `"Gợi ý: WoodMart, Flatsome, Theme Bán Hàng..."` bên dưới thanh tìm kiếm.
   - Dọn sạch mảng `HOT_KEYWORDS` và hàm `handleKeywordClick` không còn dùng đến.
   - Giúp khu vực Header và thanh tìm kiếm chính trở nên thanh thoát, gọn gàng, thoáng đãng và chuẩn tỉ lệ UI/UX thương mại điện tử lớn.

2. **Khắc Phục Lỗi Căn Chỉnh Nút Giỏ Hàng (Cart Button) & Badge Logo:**
   - **Tập tin tinh chỉnh:** [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx) & [`frontend/tailwind.config.js`](file:///d:/DNU/intern/VanPhong/theme/frontend/tailwind.config.js)
   - **Lỗi cũ:** Lớp padding `px-4.5` không thuộc thang đo mặc định của Tailwind CSS dẫn đến việc nút không có khoảng đệm hai bên, khiến chữ `"Giỏ Hàng"` bị dính sát mép phải và đè chữ vào viền bo tròn.
   - **Khắc phục:**
     - Bổ sung cấu hình thang đo `spacing` mở rộng trong `tailwind.config.js` (`4.5`, `5.5`, `13`, `15`, `18`, `22`).
     - Tinh chỉnh nút Giỏ hàng với padding hào phóng `px-5 py-2.5`, chiều rộng tối thiểu `min-w-[140px]`, `gap-3.5`, `whitespace-nowrap`, căn chỉnh thẳng hàng dọc `flex flex-col` giữa dòng nhãn `"Giỏ Hàng"` (`text-xs font-medium text-slate-300`) và dòng giá tiền `0 ₫` (`text-sm font-black text-amber-400`).
     - Sửa lỗi badge `SỐ 1 VN` trên logo: thêm `whitespace-nowrap leading-none tracking-tight` để huy hiệu luôn nằm trên 1 hàng ngang duy nhất, khắc phục triệt để tình trạng vỡ chữ thành 3 dòng.

3. **Khắc Phục Căn Giữa & Padding Các Nút Hành Động ("Xem Demo" & "Mua Ngay"):**
   - **Tập tin tinh chỉnh:** [`frontend/src/features/themes/components/theme-card.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/theme-card.tsx) & [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx)
   - **Lỗi cũ:** Nút overlay trên thẻ theme thiếu `whitespace-nowrap` và padding chuẩn, làm chữ bị dính sát mép phải hoặc đè lên icon mắt / tia sét.
   - **Khắc phục:**
     - Thiết lập chuẩn `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap shrink-0 leading-normal`.
     - Chữ và icon được căn giữa tuyệt đối, khoảng cách hai bên lề đều đặn và cân xứng hoàn hảo.

4. **Căn Chỉnh Đồng Đều Thanh Tags "Từ Khóa Hot":**
   - **Tập tin tinh chỉnh:** [`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx)
   - **Lỗi cũ:** Các khung tag hình bầu dục bị thiếu padding dọc và ngang, chữ chạm sát đường viền trên dưới tạo cảm giác chật chội.
   - **Khắc phục:**
     - Căn chỉnh lại `inline-flex items-center justify-center px-4 py-2 sm:px-4.5 sm:py-2 rounded-full border border-slate-200/90 text-xs sm:text-sm font-bold leading-normal whitespace-nowrap`.
     - Tăng khoảng cách lề `gap-2 sm:gap-2.5`, căn lề container `max-w-4xl mx-auto mb-10` giúp các tag chữ có khoảng thở rộng rãi, đồng đều và sắc sảo.

5. **Tinh Chỉnh Tỉ Lệ Nút Nổi Ưu Đãi (Floating Widget):**
   - **Tập tin tinh chỉnh:** [`frontend/src/components/layout/FloatingWidgets.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/FloatingWidgets.tsx)
   - Thêm `whitespace-nowrap`, tinh chỉnh padding `pl-3 pr-4 sm:pl-3.5 sm:pr-4.5 py-2 sm:py-2.5` giúp nút gọn gàng, thanh thoát và không che khuất nội dung nền.

### 10.2. Bảng Tổng Hợp Kiểm Thử Sau Fix
| Bài kiểm tra | Phương thức thực thi | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TypeScript Type-Check** | `npm run type-check` | ✅ **Exit code 0** | 0 lỗi kiểu dữ liệu. |
| **Kiểm tra dòng gợi ý Header** | Tìm từ khóa `Gợi ý:` trong `HeaderMain.tsx` | ✅ **Đã xóa sạch** | Không còn dòng gợi ý thừa dưới search bar. |
| **Thẻ Giỏ hàng (`Cart Button`)** | Kiểm tra độ rộng và padding | ✅ **Không tràn viền** | `min-w-[140px] px-5`, chữ `Giỏ Hàng / 0 đ` thẳng hàng tuyệt đối. |
| **Huy hiệu Logo `SỐ 1 VN`** | Kiểm tra hiển thị | ✅ **Ngang 1 hàng** | Không còn bị bẻ dòng thành 3 chữ dọc. |
| **Nút "Xem Demo" & "Mua Ngay"** | Hover thẻ theme | ✅ **Căn giữa hoàn hảo** | Padding `px-5 py-2.5`, chữ cách đều lề trái phải, không dính mép. |
| **Tags "Từ khóa hot"** | Kiểm tra Hero banner | ✅ **Đều đặn, cân đối** | Khung pill rộng rãi, chữ không chạm mép viền. |

### 10.3. Hướng Dẫn Kiểm Tra Nhanh
1. Truy cập **[http://localhost:3000](http://localhost:3000)** trên trình duyệt.
2. Kiểm tra thanh Header:
   - Dòng chữ `"Gợi ý: WoodMart, Flatsome..."` đã biến mất hoàn toàn.
   - Nút Giỏ Hàng ở góc phải: Chữ `"Giỏ Hàng"` và giá tiền `"0 ₫"` nằm ngay ngắn bên trong khung màu đen, không bị chèn ép hay chạm sát cạnh phải.
   - Logo `THEME STORE`: Huy hiệu đỏ `SỐ 1 VN` hiển thị ngang gọn gàng.
3. Rê chuột lên bất kỳ Thẻ Theme nào ở phần Sản Phẩm Nổi Bật:
   - Hai nút `"Xem Demo"` (nền trắng) và `"Mua Ngay"` (nền vàng cam) hiển thị với chữ được căn giữa cân đối, padding trái phải đều đặn, không bị dính sát viền hay đè lên icon.
4. Kiểm tra hàng tags `"Từ khóa hot:"` dưới ô tìm kiếm Hero Banner:
   - Các khung tag bầu dục có khoảng thở trên/dưới/trái/phải đều tăm tắp và chữ hiển thị thanh thoát.
