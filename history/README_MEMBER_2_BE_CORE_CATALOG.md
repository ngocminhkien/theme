# 📝 NHẬT KÝ THAY ĐỔI: THÀNH VIÊN 02 (BACKEND CORE & CATALOG)

> **Mục đích:** Ghi nhận toàn bộ các thao tác thêm, sửa, xóa mã nguồn liên quan đến Auth, User, Categories, Themes và Storage của Thành viên 02.

---

## 📅 LỊCH SỬ THAY ĐỔI (CHANGELOG)

### [2026-10-10] - Khắc phục lỗi kiểu dữ liệu TypeScript cho API Theme
- **Sửa (Fix):**
  - [`backend/src/controllers/theme.controller.ts`](file:///e:/VietNamChampion/theme/theme/backend/src/controllers/theme.controller.ts): Ép kiểu `slug` sang `string` (`req.params.slug as string`) tương thích chuẩn kiểu của `@types/express` v5, giải quyết triệt để lỗi TypeScript `TS2345: Argument of type 'string | string[]' is not assignable to parameter of type 'string'` trong CI/CD pipeline.
