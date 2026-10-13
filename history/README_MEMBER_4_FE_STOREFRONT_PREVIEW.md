# 📝 NHẬT KÝ THAY ĐỔI: THÀNH VIÊN 04 (FRONTEND STOREFRONT, CATALOG & LIVE PREVIEW)

> **Mục đích:** Ghi nhận toàn bộ các thao tác thêm, sửa, xóa mã nguồn liên quan đến Trang chủ, Danh mục Theme, Bộ lọc Faceted Search và Thanh điều khiển Live Preview của Thành viên 04.

---

## 📅 LỊCH SỬ THAY ĐỔI (CHANGELOG)

### [2026-10-10] - Cấu hình & Chuẩn hóa ban đầu
- **Thêm (Add):**
  - [`frontend/tailwind.config.js`](file:///d:/DNU/intern/VanPhong/theme/frontend/tailwind.config.js): Cấu hình Tailwind CSS cho toàn bộ thư mục app, features, shared.
  - [`frontend/postcss.config.js`](file:///d:/DNU/intern/VanPhong/theme/frontend/postcss.config.js): Cấu hình PostCSS loader.
- **Sửa (Fix):**
  - [`frontend/src/app/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/page.tsx): Bỏ đuôi `.js` trong các import cục bộ để tương thích Next.js bundler.
  - [`frontend/src/features/themes/components/theme-card.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/theme-card.tsx): Chuẩn hóa import types và Zustand store.
  - [`frontend/src/app/preview/[slug]/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/preview/%5Bslug%5D/page.tsx): Chuẩn hóa import component `LivePreviewBar`.

### [2026-10-10] - Triển khai Toàn diện Giao diện Storefront & Redesign Modern SaaS UI

- **Thêm mới các Component Giao diện (Add):**
  - [`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx): Thanh Top bar với hotline hỗ trợ, cam kết bản quyền, bộ chuyển đổi tiền tệ (`₫ VND` / `$ USD`) và ngôn ngữ.
  - [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx): Thanh Header chính với thương hiệu `THEMESTORE`, Search pill bo góc tích hợp Live Search Popup gợi ý từ khóa và thumbnail thời gian thực, nút mini-cart hiển thị số lượng và tổng tiền.
  - [`frontend/src/components/layout/HeaderNavbar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderNavbar.tsx): Mega Menu dropdown 8 chuyên mục, dải menu ngành nghề và badge ưu đãi tuần.
  - [`frontend/src/components/layout/Header.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Header.tsx): Header tổ hợp đa tầng cố định với hiệu ứng kính mờ (`backdrop-blur-xl`).
  - [`frontend/src/components/layout/MiniCartSlideover.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/MiniCartSlideover.tsx): Drawer giỏ hàng trượt offcanvas bên phải với chi tiết loại license, điều chỉnh số lượng và nút thanh toán nhanh.
  - [`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx): Chân trang Modern Dark SaaS với dải đăng ký newsletter gradient, 4 cột pháp lý & kỹ thuật, huy hiệu bảo chứng thanh toán (VietQR, Stripe, PayPal, Visa, MasterCard).
  - [`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx): Hero Section công nghệ với nền lưới `bg-grid-pattern`, luồng spotlight glow, thanh tìm kiếm lớn ở trung tâm, widget lọc nhanh 3 bước và 2 banner khuyến mại phụ.
  - [`frontend/src/components/home/MarqueeFeatures.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/MarqueeFeatures.tsx): Lưới 5 tiêu chuẩn uy tín: Giá tốt nhất, Cài đặt 1-Click, Code sạch chuẩn SEO, Bảo mật VietQR, Hỗ trợ 24/7.
  - [`frontend/src/components/home/PopularCategories.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PopularCategories.tsx): Lưới danh mục ngành nổi bật side-by-side với thumbnail, tiêu đề và liên kết subcategory.
  - [`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/FeaturedThemesSection.tsx): Lưới sản phẩm nổi bật với Tabs chuyển đổi (Tất cả, Bán chạy, Giảm giá tuần này, Elementor Pro).
  - [`frontend/src/components/home/PromoDealBanner.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PromoDealBanner.tsx): Khối banner Flash Sale với Countdown Timer đếm ngược và đặc quyền gói thành viên VIP All-Access.
  - [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx): Bộ lọc Catalog đa tiêu chí (danh mục pill trượt, Page Builder, khoảng giá, sắp xếp) đồng bộ 2 chiều với URL query params, hỗ trợ Active Filter Chips và chuyển đổi Grid/List view.
  - [`frontend/src/app/themes/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/themes/page.tsx): Tuyến đường `/themes` tối ưu Suspense và SSR metadata.
  - [`frontend/src/shared/data/themes-data.ts`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/shared/data/themes-data.ts): Kho dữ liệu mẫu 8 theme WordPress/WooCommerce bản quyền đa ngành.

- **Nâng cấp & Hoàn thiện Tính Năng Cốt Lõi (Upgrade & Refactor):**
  - [`frontend/src/features/themes/components/theme-card.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/theme-card.tsx):
    * Thẻ sản phẩm nổi bo góc `rounded-2xl`, hiệu ứng kính mờ glassmorphism overlay khi hover.
    * Nút thao tác nhanh: **Live Preview** và **Mua Ngay** (Zap Quick Buy tự động thêm giỏ và chuyển sang checkout).
    * Badges giảm giá %, nhãn HOT, MỚI 2026, Page Builder capsule và sao đánh giá.
  - [`frontend/src/features/preview/components/live-preview-bar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/preview/components/live-preview-bar.tsx):
    * Thanh điều khiển Dark Glassmorphism dính cố định đỉnh màn hình.
    * Cụm nút Device Switcher: **Desktop (100%)**, **Tablet (768px)**, **Mobile (375px)**.
    * Khung viền responsive mô phỏng thiết bị iPad và iPhone với cụm Dynamic Island tinh tế.
    * Dropdown chọn các biến thể demo layout và nút CTA **"MUA THEME NÀY"** cố định.
  - [`frontend/src/app/theme/[slug]/ThemeDetailClient.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/theme/%5Bslug%5D/ThemeDetailClient.tsx):
    * Tách Client Component phục vụ Next.js Static Site Generation (`generateStaticParams`).
    * Mockup gallery ảnh lớn kèm bộ chọn ảnh con, chọn 3 loại giấy phép (Regular, Agency, Lifetime) cập nhật giá tức thì.
    * 4 Tab kỹ thuật chi tiết: Mô tả & Tính năng, Thông số tương thích, Lịch sử Changelog, Đánh giá chuyên gia.
  - [`frontend/src/app/checkout/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/checkout/page.tsx):
    * Đồng bộ hệ màu Modern SaaS, form thông tin khách hàng, chọn VietQR / Stripe và popup quét mã QR tức thì.
  - [`frontend/src/shared/stores/cart.store.ts`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/shared/stores/cart.store.ts):
    * Quản lý trạng thái đa tiền tệ (`VND` / `USD`), điều chỉnh số lượng và điều khiển offcanvas mini-cart drawer.
  - [`frontend/src/app/globals.css`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/globals.css):
    * Bổ sung tiện ích `.glass-panel`, `.glass-card`, `.bg-grid-pattern`, `.text-gradient-brand`, `.shadow-glow` và custom scrollbar.

- **Kiểm thử & Nghiệm thu (Verification & Build Check):**
  - **Build Next.js 15 (`npm run build`):** Hoàn thành thành công 100% với exit code 0, prerender thành công 22/22 static pages bao gồm các dynamic routes `/theme/[slug]` và `/preview/[slug]`.
  - **Lint Check (`npm run lint`):** Đạt 100% không có cảnh báo hay lỗi.
  - **Kiểm thử HTTP các tuyến đường:**
    * `GET /`: **200 OK**
    * `GET /themes`: **200 OK**
    * `GET /theme/woodmart-multipurpose`: **200 OK**
    * `GET /preview/woodmart-multipurpose`: **200 OK**
    * `GET /checkout`: **200 OK**

### [2026-10-12] - Lột Xác Toàn Diện Giao Diện Thương Mại Điện Tử Theo Phong Cách "THEME TỐT" (THEMETOT.VN)

- **Nâng cấp Toàn diện Layout, Bố cục & Nhận Diện Thương Hiệu:**
  - [`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx):
    * Thêm thanh ticker thông báo chạy chữ hoạt họa xoay vòng các chương trình khuyến mãi (Flash Sale 35%, Kích hoạt VietQR 30 giây, Quà tặng Plugin Pro).
    * Bổ sung hotline/Zalo tư vấn kỹ thuật trực tiếp `0988.666.888`.
    * Bộ chuyển đổi tiền tệ (`₫ VND` / `$ USD`) và liên kết tra cứu License Key.
  - [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx):
    * Đổi thương hiệu sang **THEME TỐT** (`THEMETOT.VN`) kèm slogan *"Thế giới Theme & Plugin WordPress bản quyền giá rẻ"*.
    * Thanh tìm kiếm thông minh tích hợp bộ lọc danh mục và gợi ý Live Search Popup real-time.
    * Bổ sung dải gợi ý từ khóa hot bên dưới: WoodMart, Flatsome, Elementor Pro, Bán hàng, Bất động sản.
    * Nút tài khoản VIP chuyên nghiệp và nút Giỏ hàng hiển thị tổng tiền VNĐ thời gian thực.
  - [`frontend/src/components/layout/HeaderNavbar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderNavbar.tsx):
    * Mega Menu dropdown phân cấp rõ ràng 8 ngành nghề với số lượng theme tương ứng.
    * Thanh menu chính chuẩn SEO và nút Flash Deal nhấp nháy thu hút người dùng.
  - [`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx):
    * Tiêu đề hoành tráng chuẩn SEO: *"Kho Giao Diện Website & Plugin WordPress Bản Quyền Giá Rẻ Chuẩn SEO"*.
    * Ô tìm kiếm lớn ở trung tâm tích hợp chọn nhanh ngành nghề và nút tìm kiếm gradient.
    * Cụm 3 nút CTA: Khám Phá Themes, Gói VIP All-Access và Tư Vấn Zalo 24/7.
    * Hai banner phụ nổi bật: Theme Bán Hàng Siêu Tốc Độ (WooCommerce) và Gói VIP Pass (Tải không giới hạn cho Agency).
    * Thanh Trust Stats Bar 4 chỉ số: 500+ Theme bản quyền sạch, 15.000+ Khách hàng, 99/100 PageSpeed xanh, 4.9/5 sao.
  - [`frontend/src/components/home/MarqueeFeatures.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/MarqueeFeatures.tsx):
    * 5 cam kết vàng: 100% Bản quyền sạch, Kích hoạt VietQR 30s, Chuẩn SEO 99+, Tặng kèm Plugin Pro, Cài đặt 1-Click 24/7.
  - [`frontend/src/components/home/PopularCategories.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PopularCategories.tsx):
    * 6 nhóm ngành hàng nổi bật với icon trực quan, hình ảnh thumbnail sắc nét và subcategory tags.
  - [`frontend/src/components/home/PromoDealBanner.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PromoDealBanner.tsx):
    * Đồng hồ đếm ngược Countdown Timer Flash Sale trong ngày.
    * Thanh tiến độ số lượng: *"🔥 Đã bán 86/100 suất ưu đãi (Chỉ còn 14 suất cuối)"*.
    * Khối quà tặng khủng kèm theo trị giá 2.500.000₫ (Elementor Pro, Rank Math Pro, WP Rocket).
  - [`frontend/src/features/themes/components/theme-card.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/theme-card.tsx):
    * Thiết kế lại thẻ sản phẩm chuẩn sàn TMĐT: Thumbnail bo góc có zoom 1.08x, nhãn giảm giá %, HOT, MỚI 2026, Page Builder.
    * Glass overlay khi hover có nút "Xem Demo" và "Mua Ngay" (Quick Buy tự động mở checkout).
    * Hiển thị giá ưu đãi màu đỏ/rose lớn nổi bật kèm đơn vị `₫`, giá gốc gạch ngang rõ ràng.
  - [`frontend/src/features/preview/components/live-preview-bar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/preview/components/live-preview-bar.tsx):
    * Thanh công cụ cố định đỉnh màn hình hỗ trợ chuyển đổi linh hoạt: **Desktop (100%)**, **Tablet (768px frame iPad)**, **Mobile (375px frame iPhone Dynamic Island)**.
    * Nút CTA nổi bật *"MUA NGAY: [GIÁ TIỀN VNĐ]"* kích thích khách mua tức thì.
  - [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx):
    * Bộ lọc đa tiêu chí mượt mà không tải lại trang, đồng bộ URL query params, hỗ trợ Active Filter Chips và chuyển đổi Grid/List view.
  - [`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx):
    * Chân trang đa cột mang thương hiệu THEME TỐT (THEMETOT.VN), đối tác thanh toán VietQR/SePay và cam kết bảo hành hoàn tiền 100%.

- **Kiểm thử & Nghiệm thu (Verification & Build Check):**
  - **TypeScript Type Check (`npm run type-check`):** Passed 100% không lỗi.
  - **Build Next.js 15 (`npm run build`):** Exit code 0, prerender thành công 22/22 static pages.
  - **Kiểm thử HTTP các tuyến đường:**
    * `GET /`: **200 OK**
    * `GET /themes`: **200 OK**
    * `GET /preview/woodmart-multipurpose`: **200 OK**
    * `GET /theme/woodmart-multipurpose`: **200 OK**
    * `GET /checkout`: **200 OK**

### [2026-10-12] - Nâng Cấp Layout Tràn Viền Toàn Màn Hình (Fluid 1720px) & Hệ Thống Đăng Nhập / Đăng Ký Split Screen

- **Chỉnh sửa Bố Cục Tràn Viền Toàn Màn Hình (Fluid E-Commerce Layout):**
  - Loại bỏ giới hạn khung hẹp `max-w-7xl` (1280px), chuẩn hóa container toàn bộ hệ thống sang `w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12`.
  - Mở rộng toàn diện các khu vực:
    - [`frontend/src/components/layout/HeaderTopBar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderTopBar.tsx): Mở rộng tràn viền, bổ sung nút Đăng nhập & Đăng ký.
    - [`frontend/src/components/layout/HeaderMain.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderMain.tsx): Thanh tìm kiếm mở rộng tới `max-w-4xl`, liên kết nút Tài khoản VIP tới `/login`.
    - [`frontend/src/components/layout/HeaderNavbar.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/HeaderNavbar.tsx): Mega menu và danh mục dãn rộng ra hai mép màn hình.
    - [`frontend/src/components/home/HeroSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/HeroSection.tsx): Khung hero, ô search lớn `max-w-3xl` và thanh 4 cột trust stats bung rộng toàn màn hình.
    - [`frontend/src/components/home/MarqueeFeatures.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/MarqueeFeatures.tsx): 5 khối cam kết phân bổ cân đối.
    - [`frontend/src/components/home/PopularCategories.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PopularCategories.tsx): Lưới danh mục 6 cột trên màn hình siêu rộng (`2xl:grid-cols-6`).
    - [`frontend/src/components/home/FeaturedThemesSection.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/FeaturedThemesSection.tsx): Lưới 4 cột sản phẩm rộng mở.
    - [`frontend/src/components/home/PromoDealBanner.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/home/PromoDealBanner.tsx): Hộp Flash sale và khối quà tặng plugin 2.500.000₫ trải rộng.
    - [`frontend/src/features/themes/components/themes-catalog.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/features/themes/components/themes-catalog.tsx): Layout catalog tràn viền `max-w-[1720px]`.
    - [`frontend/src/app/theme/[slug]/ThemeDetailClient.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/theme/%5Bslug%5D/ThemeDetailClient.tsx): Container chi tiết theme `max-w-[1720px]`.
    - [`frontend/src/components/layout/Footer.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/Footer.tsx): Footer chân trang tràn viền `max-w-[1720px]`, bổ sung liên kết `/login` và `/register`.

- **Thêm Mới Hệ Thống Đăng Nhập & Đăng Ký Chuẩn Split Screen (Add):**
  - [`frontend/src/app/login/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/login/page.tsx):
    - Giao diện Split Screen 50/50: Banner nhận diện thương hiệu THEMETOT.VN, quà tặng VIP 2.500.000₫ và quyền lợi hỗ trợ trọn đời ở cột trái.
    - Form đăng nhập tinh tế ở cột phải: Đăng nhập Google, GitHub, ẩn/hiện mật khẩu, nhớ tài khoản, hiệu ứng loading spinner khi submit.
  - [`frontend/src/app/register/page.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/app/register/page.tsx):
    - Giao diện Split Screen 50/50: Trải nghiệm thương hiệu và quyền lợi độc quyền.
    - Form đăng ký: Thước đo độ mạnh mật khẩu (Password Strength Meter) theo thời gian thực từ Yếu đến Rất mạnh kèm 4 điều kiện bảo mật, đăng ký mạng xã hội, xác nhận điều khoản dịch vụ.

- **Kiểm Thử & Nghiệm Thu (Verification):**
  - **TypeScript Type Check (`npm run type-check`):** Exit code 0, không có lỗi kiểu.
  - **Production Build (`npm run build`):** Prerender thành công **24/24 static pages** (bao gồm `/login` và `/register`).
  - **HTTP Endpoints Check:**
    - `GET /login`: **200 OK**
    - `GET /register`: **200 OK**
    - `GET /`: **200 OK**
    - `GET /themes`: **200 OK**
    - `GET /checkout`: **200 OK**


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

5. **Nâng Cấp Hộp Quà Ưu Đãi Nổi 3D (Floating Widget Overhaul):**
   - **Tập tin tinh chỉnh:** [`frontend/src/components/layout/FloatingWidgets.tsx`](file:///d:/DNU/intern/VanPhong/theme/frontend/src/components/layout/FloatingWidgets.tsx) & [`frontend/public/images/promo-giftbox.png`](file:///d:/DNU/intern/VanPhong/theme/frontend/public/images/promo-giftbox.png)
   - **Thay đổi:** Thay thế nút thanh ngang bo tròn cũ bằng huy hiệu hộp quà 3D màu đỏ nổi bật với nơ vải đỏ, dải ruy băng vát góc chứa chữ **ƯU ĐÃI** màu vàng kim, kèm hai dòng chữ **NHẬN** và **HÔM NAY** màu trắng sắc nét, hiệu ứng hào quang phát sáng vàng ấm và chấm ping thông báo nhấp nháy, chuẩn theo mẫu thiết kế Ảnh 2.

### 10.2. Bảng Tổng Hợp Kiểm Thử Sau Fix
| Bài kiểm tra | Phương thức thực thi | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- |
| **TypeScript Type-Check** | `npm run type-check` | ✅ **Exit code 0** | 0 lỗi kiểu dữ liệu. |
| **Hộp Quà Ưu Đãi 3D** | Widget nổi góc dưới bên phải | ✅ **Chuẩn mẫu Ảnh 2** | Hộp quà đỏ 3D, nơ đỏ, banner "ƯU ĐÃI" vàng kim, popup hoạt động mượt mà. |
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

---

## 11. 📱 TỐI ƯU HÓA ĐA MÀN HÌNH (MULTI-SCREEN RESPONSIVE 320PX – 2560PX) [2026-10-13]

### 11.1. Các Hạng Mục Đã Nâng Cấp
1. **Hệ Thống Breakpoint & Chống Tràn Ngang (`tailwind.config.js`, `globals.css`):**
   - Bổ sung breakpoint `xs: '480px'` hỗ trợ tinh chỉnh chi tiết từ điện thoại nhỏ (`320px–375px`) đến phablet (`480px–640px`).
   - Thiết lập `overflow-x: hidden; min-width: 320px;` trên `html, body` và tiện ích `.no-scrollbar` cho các dải pill/tab cuộn ngang.
2. **Header, Tìm Kiếm Di Động & Menu Drawer (`HeaderTopBar.tsx`, `HeaderMain.tsx`, `HeaderNavbar.tsx`):**
   - Tích hợp nút bật/tắt **Thanh Tìm Kiếm Di Động** và **Menu Điều Hướng Di Động (Mobile Drawer)** trên màn hình `< 768px` (`md:hidden`), hiển thị đầy đủ danh mục ngành nghề, liên kết nhanh, cổng khách hàng VIP và Hotline.
   - Tối ưu thanh `HeaderNavbar` cuộn ngang mượt trên Tablet (`768px–1024px`).
3. **Trang Chủ, Kho Theme, Chi Tiết Theme & Live Preview (`HeroSection.tsx`, `PopularCategories.tsx`, `FeaturedThemesSection.tsx`, `PromoDealBanner.tsx`, `themes-catalog.tsx`, `ThemeDetailClient.tsx`, `live-preview-bar.tsx`):**
   - Căn chỉnh lưới sản phẩm đa cấp `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
   - Khung giả lập thiết bị trong `LivePreviewBar` tự động thích ứng (`w-full max-w-[768px]` và `w-full max-w-[375px]`, `h-dvh`) không gây tràn ngang trên màn hình nhỏ.
   - Đồng hồ đếm ngược `PromoDealBanner`, thẻ thống kê `HeroSection`, bộ lọc `ThemesCatalog`, liên kết `Footer` và cụm `FloatingWidgets` đều tự động co giãn chuẩn xác trên mọi thiết bị.

---

## 12. 💎 NÂNG CẤP GIAO DIỆN TRANG CHỦ THEO CHUẨN CLEAN & HIGH-CONVERSION E-COMMERCE [2026-10-13]

### 12.1. Các Hạng Mục Nâng Cấp Chi Tiết
1. **Hero Section (`HeroSection.tsx`):**
   - **Tín hiệu uy tín (Trust Badge):** Huy hiệu nền tối nổi bật với đèn ping xanh lá, biểu tượng ngôi sao vàng và thông điệp: *"Kho Theme WordPress Bản Quyền #1 VN • Kích Hoạt Tự Động 24/7"*.
   - **Thanh tìm kiếm tối ưu chuyển đổi:** Bổ sung nhãn phân loại ngành nghề nhanh, viền lấy nét nổi bật `ring-4 ring-brand-500/15`, nút tìm kiếm gradient trực quan.
   - **Thanh tags gợi ý:** Bổ sung icon trực quan cho từng nhóm từ khóa (🛒 Theme Bán Hàng, ⚡ Flatsome Shop, 🏬 WoodMart, 🏢 Doanh Nghiệp, 🎨 Elementor, 🏠 Bất Động Sản).
2. **Thẻ Sản Phẩm Theme (`theme-card.tsx`):**
   - **Huy hiệu giảm giá & builder:** Badge `GIẢM X%`, `BÁN CHẠY`, `MỚI 2026` và builder pill (Elementor/WooCommerce) với chấm xanh trạng thái rõ ràng.
   - **Lớp phủ xem trước khi hover:** Nút "Xem Demo" và "Mua Ngay" nổi bật trên nền kính mờ `backdrop-blur-[3px]`, tỉ lệ căn giữa hoàn hảo.
   - **Khu vực giá & mua sắm:** Giá khuyến mãi màu đỏ/hồng nổi bật, giá gốc gạch ngang, nhãn cam kết *"Sạch mã độc 100% • Tự động kích hoạt"* và nút thêm giỏ hàng có phản hồi trạng thái tích xanh ngay lập tức khi đã có trong giỏ.
3. **Danh Mục Ngành Nghề Bento Grid (`PopularCategories.tsx`):**
   - **Khả năng tương tác trực tiếp:** Chuyển đổi toàn bộ các nhãn subcategory (như *Thời Trang, Điện Máy, Chung Cư, Bảng Giá SaaS...*) thành **liên kết tương tác (`<Link>`)**, cho phép khách hàng nhấp chuột để lọc ngay lập tức.
   - Tối ưu hiệu ứng hover ảnh và nút "Khám Phá Theme" chuyển sang màu tối sang trọng khi rê chuột.
4. **Bộ Lọc Tabs Danh Mục (`FeaturedThemesSection.tsx`):**
   - Thêm danh mục `🏠 Bất Động Sản`, bổ sung icon phân loại cho từng tab (🛒 Bán Hàng, 🏢 Doanh Nghiệp, 🎨 Elementor Pro).
5. **Banner Khuyến Mãi Flash Sale (`PromoDealBanner.tsx`):**
   - Tích hợp ô **Sao chép mã ưu đãi 1-Click** trực tiếp trên banner với mã `THEMESTORE20`, tự động sao chép vào clipboard và đổi trạng thái thành *"✓ Đã Chép"*.

### 12.2. Kết Quả Kiểm Thử
| Bài kiểm tra | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- |
| **TypeScript Type-Check** | `npm.cmd run type-check` | ✅ **Exit code 0 (Không còn lỗi)** |
| **Server Response** | `Invoke-WebRequest http://localhost:3000` | ✅ **HTTP 200 OK** |
