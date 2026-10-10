# 🚀 QUY TRÌNH GIT & PHÁT TRIỂN CHUẨN CHỈ (GIT WORKFLOW & CONTRIBUTION GUIDE)

> **Dành cho toàn bộ 5 thành viên nhóm phát triển.**  
> Tài liệu này chuẩn hóa quy trình làm việc từ lúc nhận việc, tạo nhánh, viết mã, kiểm thử, tạo commit, mở Pull Request (PR) đến khi đẩy code lên nhánh chính (`main`/`develop`) khi **THÊM**, **SỬA** hoặc **XÓA** bất kỳ tính năng nào.

---

## 📌 NGUYÊN TẮC BẤT DI BẤT DỊCH (CORE PRINCIPLES)

1. **CẤM push trực tiếp lên nhánh `main`:** Nhánh `main` là môi trường chạy thật (Production). Mọi thay đổi bắt buộc phải đi qua nhánh phụ và được kiểm duyệt qua **Pull Request (PR)**.
2. **CẤM commit thông tin bảo mật:** Tuyệt đối không commit file `.env`, mật khẩu DB, khóa Stripe Secret, SePAY API Key, hoặc Token riêng tư.
3. **KHÔNG absorb file rác:** Không dùng lệnh `git add .` khi chưa kiểm tra `git status`. Tránh đưa các file tạm của IDE (`.vscode/`, `.idea/`), log, tệp build (`.next/`, `dist/`, `node_modules/`) vào kho mã nguồn.
4. **Phải chạy Lint & Test trước khi đẩy:** Đảm bảo code không gây lỗi biên dịch (compile error) hoặc làm hỏng pipeline CI/CD của nhóm.

---

## 🌿 1. CHIẾN LƯỢC PHÂN NHÁNH (BRANCHING STRATEGY)

```
[main] ─────────────────────────────────────────────────────────────► (Production)
   ▲                                                                      ▲
   │ (Sau khi test ổn định)                                               │ (Hotfix khẩn cấp)
[develop] ──────────────────────────────────────────► (Staging/Dev)       │
   ▲                        ▲                           ▲                 │
   │                        │                           │                 │
[feature/be-sepay]    [feature/fe-preview]       [fix/cart-calc]     [hotfix/stripe-key]
```

### 1.1. Các nhánh chính:
* **`main`**: Chứa code đã kiểm thử hoàn thiện, luôn sẵn sàng chạy trên server Production.
* **`develop`**: Nhánh tích hợp chung của cả 5 thành viên trước khi đưa lên `main`.

### 1.2. Quy tắc đặt tên nhánh làm việc (Branch Naming):
Tên nhánh phải viết bằng chữ thường, cách nhau bằng dấu gạch ngang `-`, theo cấu trúc:  
`loai-nhanh/module-ten-cong-viec`

| Mục đích | Tiền tố nhánh | Ví dụ đặt tên | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| **Thêm mới tính năng** | `feature/` | `feature/fe-live-preview-bar`<br>`feature/be-sepay-webhook` | Thêm thanh Live Preview trên FE<br>Tích hợp Webhook VietQR trên BE |
| **Sửa lỗi tính năng** | `fix/` | `fix/checkout-qr-timeout`<br>`fix/db-foreign-key-order` | Sửa lỗi đếm ngược QR code<br>Sửa lỗi khóa ngoại đơn hàng |
| **Tái cấu trúc code** | `refactor/` | `refactor/license-engine-crypto` | Tối ưu code sinh key bản quyền (không đổi hành vi) |
| **Tối ưu hiệu năng** | `perf/` | `perf/redis-cache-themes` | Tăng tốc độ load trang danh mục với Redis |
| **Xóa / Dọn dẹp code rác**| `chore/` hoặc `cleanup/` | `chore/remove-legacy-cart-v1`<br>`cleanup/delete-unused-images` | Xóa logic giỏ hàng cũ<br>Xóa ảnh và tệp thừa không sử dụng |
| **Sửa tài liệu** | `docs/` | `docs/update-swagger-api` | Bổ sung tài liệu API Swagger |
| **Vá lỗi khẩn cấp trên Production** | `hotfix/` | `hotfix/stripe-webhook-secret` | Sửa ngay lỗi webhook trên nhánh main |

---

## ✍️ 2. QUY CHUẨN THÔNG ĐIỆP COMMIT (CONVENTIONAL COMMITS)

Mọi thông điệp commit phải tuân thủ chuẩn **Conventional Commits 1.0.0** quốc tế:

```
<loại-thay-đổi>(<phạm-vi>): <mô tả ngắn bằng tiếng Việt hoặc tiếng Anh>

[Tùy chọn: Mô tả chi tiết lý do thay đổi và giải pháp]
```

### 2.1. Các loại thay đổi (`type`):
* **`feat`**: Thêm tính năng mới (Feature addition).
* **`fix`**: Sửa lỗi trong code (Bug fix).
* **`refactor`**: Sửa đổi cấu trúc code không thêm tính năng cũng không sửa bug (Refactoring).
* **`perf`**: Thay đổi nhằm cải thiện hiệu năng tải trang / truy vấn database.
* **`docs`**: Chỉ thay đổi hoặc bổ sung tài liệu (Markdown, README).
* **`style`**: Sửa định dạng, thụt lề, khoảng trắng, không ảnh hưởng logic.
* **`test`**: Thêm mới hoặc chỉnh sửa unit test, integration test.
* **`chore`**: Cập nhật file cấu hình, cài đặt thêm npm package, xóa code thừa.

---

## 🛠️ 3. QUY TRÌNH 7 BƯỚC CHO MỌI THAY ĐỔI (WORKFLOW CHI TIẾT)

Dưới đây là kịch bản chuẩn cho cả 3 trường hợp: **THÊM MỚI**, **SỬA LỖI**, và **XÓA TÍNH NĂNG**.

### BƯỚC 1: Cập nhật mã nguồn mới nhất từ nhóm
Trước khi bắt tay vào code bất kỳ thứ gì, luôn chuyển về nhánh `develop` (hoặc `main`) và kéo code mới nhất:
```bash
git checkout develop
git pull origin develop
```

---

### BƯỚC 2: Tạo nhánh làm việc mới từ `develop`
```bash
# Ví dụ: Thêm tính năng thanh toán VietQR
git checkout -b feature/be-vietqr-sepay

# Hoặc: Sửa lỗi hiển thị giá USD trên trang Checkout
git checkout -b fix/checkout-currency-usd

# Hoặc: Xóa chức năng giỏ hàng cũ không dùng
git checkout -b chore/remove-legacy-cart
```

---

### BƯỚC 3: Thực hiện code & Kiểm tra cục bộ (Lint & Test)
Sau khi viết mã hoặc sửa đổi tệp:
1. **Kiểm tra linter và kiểu dữ liệu (Type check):**
   ```bash
   # Nếu làm Backend:
   cd backend && npm run lint && npm run test

   # Nếu làm Frontend:
   cd frontend && npm run lint && npm run type-check
   ```
2. Đảm bảo ứng dụng chạy không phát sinh bất kỳ lỗi console (Error/Warning) nào.

---

### BƯỚC 4: Kiểm tra trạng thái và Stage file có chọn lọc
Chạy lệnh kiểm tra các file đã bị thay đổi:
```bash
git status
```
Chỉ stage các file liên quan trực tiếp đến tính năng đó:
```bash
# Thêm file cụ thể:
git add frontend/src/app/checkout/page.tsx
git add backend/src/modules/payments/sepay.service.ts

# KHÔNG BAO GIỜ add file .env hoặc thư mục node_modules:
# Nếu lỡ add nhầm, hủy stage ngay bằng:
git restore --staged .env
```

---

### BƯỚC 5: Tạo Commit chuẩn chỉ

#### 🟢 Trường hợp A: THÊM MỚI tính năng (Add Feature)
```bash
# Ví dụ 1: Thêm module tạo mã VietQR
git commit -m "feat(payments): integrate VietQR generator with SePAY webhook"

# Ví dụ 2: Thêm thanh chuyển đổi responsive trên giao diện Live Preview
git commit -m "feat(preview): add responsive device switcher (desktop/tablet/mobile)"
```

#### 🟡 Trường hợp B: SỬA tính năng / Fix Bug
```bash
# Ví dụ 1: Sửa lỗi tính sai tiền tệ khi chuyển từ VND sang USD
git commit -m "fix(checkout): resolve currency conversion rounding issue for USD"

# Ví dụ 2: Sửa lỗi đếm ngược QR code không tự hủy khi quá hạn
git commit -m "fix(payments): fix QR countdown timer reset on expired sessions"
```

#### 🔴 Trường hợp C: XÓA tính năng / Dọn dẹp code cũ (Remove / Deprecate)
> ⚠️ **LƯU Ý KHI XÓA TÍNH NĂNG:**
> Khi xóa một tính năng, bạn phải xóa triệt để: **Routes ➔ Controller ➔ Service ➔ DTO ➔ DB Schema (nếu có) ➔ Frontend UI Components**. Không để lại "code chết" (Dead code).
```bash
# Ví dụ 1: Xóa module vận chuyển hàng vật lý (chỉ giữ bán digital)
git commit -m "chore(shipping): remove physical shipping calculators and unused address fields"

# Ví dụ 2: Xóa thư viện font cũ không sử dụng để giảm dung lượng bundle
git commit -m "chore(assets): remove unused Google WebFonts to optimize bundle size"
```

---

### BƯỚC 6: Đẩy nhánh lên GitHub (Push)
```bash
git push -u origin feature/be-vietqr-sepay
```

---

### BƯỚC 7: Mở Pull Request (PR) & Code Review

1. Mở trình duyệt vào GitHub repo: `https://github.com/ngocminhkien/theme`.
2. Bấm nút **Compare & pull request**.
3. Điền mô tả PR theo mẫu chuẩn sau:

```markdown
### 🎯 Mục đích PR:
- [x] Thêm mới tính năng (feat)
- [ ] Sửa lỗi (fix)
- [ ] Xóa / Dọn dẹp code cũ (chore)

### 📝 Chi tiết thay đổi:
- Đã tích hợp API sinh VietQR từ SePAY.
- Thêm webhook endpoint lắng nghe phản hồi ngân hàng tự động trong 3 giây.
- Đã cập nhật Swagger Docs tại `/api/docs`.

### 🧪 Bằng chứng kiểm thử (Testing Evidence):
- [x] Đã chạy unit test đạt 100% pass (`npm run test`).
- [x] Đã thử nghiệm quét mã test và đơn hàng tự động kích hoạt license key.
- Ảnh chụp màn hình / GIF kết quả test (nếu có UI).

### 👥 Người Review (Reviewers):
@thanhvien-review (chỉ định ít nhất 1 thành viên khác review)
```

4. **Yêu cầu để được Merge:**
   * Pipeline CI/CD trên GitHub Actions phải hiện màu **Xanh** (All checks passed).
   * Có ít nhất **1 lượt Approve (Chấp thuận)** từ thành viên khác trong nhóm.
   * Chọn hình thức **Squash and Merge** để lịch sử commit trên nhánh chính luôn gọn gàng và dễ theo dõi.
5. Sau khi Merge xong, xóa nhánh làm việc cũ trên GitHub và máy local:
   ```bash
   git branch -d feature/be-vietqr-sepay
   ```

---

## 🚫 NHỮNG LỖI CẤM KỴ CẦN TRÁNH (DON'TS)

| Hành động | Lý do cấm | Hậu quả |
| :--- | :--- | :--- |
| `git push --force` lên `main` hoặc `develop` | Ghi đè và xóa sạch code của các thành viên khác đang cùng làm | Mất dữ liệu, xung đột toàn bộ dự án |
| Commit file `.env` chứa Secret Key | Lộ mã bí mật ngân hàng, Stripe, Server SSH | Bị hack tiền, lộ cơ sở dữ liệu |
| Commit `node_modules/` hoặc `.next/` | Dung lượng hàng trăm MB, làm phình to repo Git | Gây nghẽn mạng, clone repo mất hàng giờ |
| Commit với lời nhắn vô nghĩa: `fix`, `update`, `asdasd` | Không ai hiểu bạn vừa sửa gì, khó tra cứu bug trong tương lai | Bị từ chối (Reject) Pull Request |
| Vừa làm tính năng A vừa tiện tay sửa tính năng B | Vi phạm nguyên tắc Atomic Commit, khó rollback khi có lỗi | Dễ gây lỗi dây chuyền (Side-effects) |

---

## 🔄 XỬ LÝ XUNG ĐỘT MÃ NGUỒN (MERGE CONFLICTS)

Nếu khi tạo PR mà GitHub báo **"Can't automatically merge"** do người khác đã sửa cùng 1 file trước bạn:

1. Chuyển về nhánh của bạn:
   ```bash
   git checkout feature/cua-ban
   ```
2. Kéo code mới nhất của `develop` về để giải quyết xung đột cục bộ:
   ```bash
   git pull origin develop
   ```
3. Mở VS Code, tìm các đoạn có đánh dấu `<<<<<<< HEAD`, thảo luận với đồng đội và chọn đoạn code đúng.
4. Lưu file và tạo commit giải quyết xung đột:
   ```bash
   git add .
   git commit -m "chore(merge): resolve conflicts with develop branch"
   git push origin feature/cua-ban
   ```
5. Pull Request trên GitHub sẽ tự động chuyển sang trạng thái xanh và có thể merge an toàn!
