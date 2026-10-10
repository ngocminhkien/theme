# 📝 NHẬT KÝ THAY ĐỔI: THÀNH VIÊN 04 (FRONTEND STOREFRONT, CATALOG & LIVE PREVIEW)

> **Mục đích:** Ghi nhận toàn bộ các thao tác thêm, sửa, xóa mã nguồn liên quan đến Trang chủ, Danh mục Theme, Bộ lọc Faceted Search và Thanh điều khiển Live Preview của Thành viên 04.

---

## 📅 LỊCH SỬ THAY ĐỔI (CHANGELOG)

### [2026-10-10] - Cấu hình & Chuẩn hóa ban đầu
- **Thêm (Add):**
  - [`frontend/tailwind.config.js`](file:///e:/VietNamChampion/theme/theme/frontend/tailwind.config.js): Cấu hình Tailwind CSS cho toàn bộ thư mục app, features, shared.
  - [`frontend/postcss.config.js`](file:///e:/VietNamChampion/theme/theme/frontend/postcss.config.js): Cấu hình PostCSS loader.
- **Sửa (Fix):**
  - [`frontend/src/app/page.tsx`](file:///e:/VietNamChampion/theme/theme/frontend/src/app/page.tsx): Bỏ đuôi `.js` trong các import cục bộ để tương thích Next.js bundler.
  - [`frontend/src/features/themes/components/theme-card.tsx`](file:///e:/VietNamChampion/theme/theme/frontend/src/features/themes/components/theme-card.tsx): Chuẩn hóa import types và Zustand store.
  - [`frontend/src/app/preview/[slug]/page.tsx`](file:///e:/VietNamChampion/theme/theme/frontend/src/app/preview/%5Bslug%5D/page.tsx): Chuẩn hóa import component `LivePreviewBar`.
