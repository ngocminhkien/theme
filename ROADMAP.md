# LỘ TRÌNH THỰC THI (ROADMAP): TỪ SOURCE GIAO DIỆN ĐẾN SÀN BÁN THEME TOÀN CẦU

Tài liệu này xác định chi tiết lộ trình phát triển theo từng giai đoạn (Phase 0 đến Phase 4), các cột mốc quan trọng (Milestones), nhiệm vụ kỹ thuật, chỉ số đo lường (KPIs), và quản trị rủi ro.

---

## 1. TỔNG QUAN LỘ TRÌNH (HIGH-LEVEL TIMELINE)

```
[THÁNG 1] ───────────────► [THÁNG 2] ───────────────► [THÁNG 3 - 4] ────────────► [THÁNG 5+]
Phase 1:                   Phase 2:                   Phase 3:                    Phase 4:
MVP DIGITAL STORE          LICENSE & AUTO-UPDATE      GLOBAL & GROWTH             MULTI-VENDOR MARKETPLACE
• Tinh chỉnh Woodmart      • License Key Generator    • Đa ngôn ngữ (VI/EN)       • Hệ thống Author/Vendor
• Cổng thanh toán kép      • WordPress Update API     • Đa tiền tệ (VND/USD)      • Kiểm duyệt theme tự động
• Live Preview Bar         • Cloud Storage (S3/R2)    • Affiliate Program (30%)   • Gói Hội viên All-Access
• 10 Theme Demo đầu tiên   • Help Center / Docs       • SEO & Marketing Funnel    • Mở rộng Plugin / UI Kits
```

---

## 2. CHI TIẾT CÁC GIAI ĐOẠN PHÁT TRIỂN

### GIAI ĐOẠN 0: CHUẨN BỊ & THIẾT LẬP NỀN TẢNG (TUẦN 1 - 2)
**Mục tiêu:** Định hình kiến trúc phần mềm, dọn dẹp các tính năng thừa của Woodmart và thiết lập môi trường máy chủ.

* **Nhiệm vụ Kỹ thuật:**
  * [ ] **Cấu hình WooCommerce Digital Goods:**
    * Vô hiệu hóa trường địa chỉ giao hàng, phương thức vận chuyển vật lý trong WooCommerce (`unset($fields['billing']['billing_address_1'])`, v.v.).
    * Tự động hoàn thành đơn hàng (Auto-complete Order) ngay khi cổng thanh toán phản hồi thành công để khách tải file tức thì.
  * [ ] **Bảo vệ File tải xuống:**
    * Thiết lập phương thức tải an toàn: `Force Downloads` hoặc `X-Accel-Redirect/X-Sendfile` thông qua Nginx.
    * Tạo thư mục lưu trữ file Theme `.zip` tách biệt với thư mục media công khai.
  * [ ] **Hạ tầng Server & Tối ưu:**
    * Cài đặt VPS cấu hình cao (Nginx, PHP 8.2+ OPcache, Redis Object Cache, MariaDB 10.11+).
    * Thiết lập Cloudflare CDN & WAF chống DDoS, bảo vệ tài nguyên demo.

---

### GIAI ĐOẠN 1: RA MẮT PHIÊN BẢN MVP (THÁNG 1)
**Mục tiêu:** Ra mắt phiên bản tối thiểu (Minimum Viable Product) có thể bắt đầu bán theme và thu tiền thật tại thị trường Việt Nam.

* **Nhiệm vụ Sản phẩm & Tính năng:**
  * [ ] **Tích hợp Cổng thanh toán Việt Nam (Ưu tiên số 1):**
    * Cài đặt cổng **VietQR tự động (SePAY / Cassio)**: Tự động hiển thị mã QR kèm nội dung chuyển khoản độc nhất cho từng đơn hàng; webhook xác nhận thanh toán trong 3 giây không cần nhân viên check thủ công.
    * Tích hợp cổng dự phòng: MoMo Business hoặc ZaloPay.
  * [ ] **Xây dựng Thanh Live Preview Bar (Demo Switcher):**
    * Tạo template trang iframe responsive `/preview/{theme-slug}`.
    * Tích hợp topbar chuyển đổi view: Desktop, iPad, Mobile và nút kêu gọi hành động "Mua Ngay".
  * [ ] **Tạo 10 - 15 Theme Demo khởi động:**
    * Đóng gói 10 theme chất lượng cao trải đều trên các ngành: Bán hàng thời trang, Đồ điện tử, Mỹ phẩm, Bất động sản, Giới thiệu công ty B2B, Nhà hàng/Café.
    * Chuẩn bị file đóng gói chuẩn: `theme-name.zip`, `theme-name-child.zip`, `dummy-data.xml`, file `README.txt` hướng dẫn.
  * [ ] **Tối ưu trải nghiệm trang thanh toán:**
    * Rút gọn form đặt hàng xuống còn 2 ô: Tên & Email.
    * Trang cảm ơn hiển thị trực tiếp nút tải file và hướng dẫn cài đặt.
* **Cột mốc (Milestone 1):** Bán được 10 đơn hàng đầu tiên, quy trình thanh toán và tải file tự động vận hành trơn tru không lỗi.

---

### GIAI ĐOẠN 2: HỆ THỐNG BẢN QUYỀN & CẬP NHẬT TỰ ĐỘNG (THÁNG 2)
**Mục tiêu:** Bảo vệ bản quyền, nâng cao giá trị sản phẩm bằng tính năng tự động cập nhật như các hãng theme quốc tế chuyên nghiệp.

* **Nhiệm vụ Kỹ thuật:**
  * [ ] **Xây dựng License Engine (Hệ thống khóa bản quyền):**
    * Tích hợp WooCommerce Software Add-on hoặc License Manager for WooCommerce.
    * Mỗi đơn hàng tự động sinh 1 chuỗi License Key (Ví dụ: `THEME-XXXX-YYYY-ZZZZ`).
    * Gắn giới hạn số lượng domain kích hoạt (1 domain cho Regular, 5 domain cho Agency).
  * [ ] **Xây dựng WordPress Theme Updater API:**
    * Tích hợp thư viện `plugin-update-checker` (PUC) vào mã nguồn theme xuất xưởng.
    * Khi quản trị viên phát hành bản vá/nâng cấp (Ví dụ: v8.6.3), website của khách hàng đã mua và kích hoạt license sẽ nhận thông báo: *"Đã có bản cập nhật mới v8.6.3 - Bấm vào đây để cập nhật tự động"*.
  * [ ] **Di chuyển kho lưu trữ sang Cloud Storage chuyên dụng:**
    * Đưa toàn bộ file download lên **Cloudflare R2** hoặc **Amazon S3** để tiết kiệm băng thông máy chủ và đảm bảo link tải tốc độ cao, có thời hạn (Presigned URL 24h).
  * [ ] **Xây dựng Trung tâm Tài liệu (Knowledge Base):**
    * Viết tài liệu hướng dẫn chuẩn hóa: Hướng dẫn cài đặt, Khắc phục lỗi thường gặp (`upload_max_filesize`, `max_execution_time`), Cấu hình API Google Maps,...
    * Sản xuất 5 video ngắn hướng dẫn trực quan.
* **Cột mốc (Milestone 2):** Khách hàng có thể tự động kích hoạt license và cập nhật theme 1-click mà không cần nhờ nhân viên kỹ thuật gửi file thủ công.

---

### GIAI ĐOẠN 3: ĐA NGÔN NGỮ, THANH TOÁN QUỐC TẾ & TĂNG TRƯỞNG (THÁNG 3 - 4)
**Mục tiêu:** Mở rộng thị trường ra toàn cầu (US, EU, Đông Nam Á) và đẩy mạnh các kênh tiếp thị chuyển đổi cao.

* **Nhiệm vụ Quốc tế hóa:**
  * [ ] **Hệ thống Song ngữ hoàn chỉnh:**
    * Cài đặt Polylang / WPML chuyển đổi giữa Tiếng Việt và Tiếng Anh.
    * Chuẩn hóa toàn bộ nội dung mô tả, tính năng, email thông báo sang Tiếng Anh chuyên nghiệp.
  * [ ] **Tích hợp Cổng thanh toán Toàn cầu:**
    * Tích hợp **Stripe Elements** (hỗ trợ Thẻ Visa, Mastercard, Apple Pay, Google Pay).
    * Tích hợp **PayPal Express Checkout**.
    * Tùy chọn mở rộng: Kết nối **Lemon Squeezy** hoặc **Paddle** để ủy thác xử lý thuế VAT/Sales Tax tự động cho khách hàng quốc tế.
  * [ ] **Tự động chuyển đổi Tiền tệ (VND / USD):**
    * Tích hợp WOOCS / Multi-currency selector: Tự động nhận diện IP khách hàng để hiển thị giá tiền VND cho người dùng Việt Nam và USD cho người dùng quốc tế.
* **Nhiệm vụ Tăng trưởng & Marketing (GTM):**
  * [ ] **Hệ thống Tiếp thị liên kết (Affiliate Program):**
    * Cài đặt AffiliateWP hoặc SolidAffiliate.
    * Thiết lập mức hoa hồng hấp dẫn: 25% - 30% cho mỗi đơn hàng thành công.
    * Tuyển dụng 20 affiliate đầu tiên: Lập trình viên WordPress, các kênh Youtube chia sẻ kiến thức thiết kế website, các blogger công nghệ.
  * [ ] **Chiến dịch SEO Niche:**
    * Viết 30 bài viết SEO chất lượng cao nhắm vào các từ khóa thương mại: *"Top 10 theme bán hàng WordPress tốt nhất 2026"*, *"Best Elementor WooCommerce Themes"*.
* **Cột mốc (Milestone 3):** Đạt doanh số 100 đơn hàng/tháng, trong đó tỷ trọng đơn hàng quốc tế đạt từ 25 - 35%.

---

### GIAI ĐOẠN 4: NÂNG CẤP THÀNH SÀN THƯƠNG MẠI ĐA TÁC GIẢ (THÁNG 5+)
**Mục tiêu:** Chuyển đổi từ mô hình Single Store sang Multi-vendor Marketplace (tương tự ThemeForest/Envato) để mở rộng quy mô sản phẩm vô hạn.

* **Nhiệm vụ Nâng cấp Hệ thống:**
  * [ ] **Mô hình Đa Tác Giả (Multi-vendor Architecture):**
    * Tích hợp giải pháp Marketplace chuyên nghiệp (Dokan Pro hoặc WCFM Marketplace).
    * Cổng đăng ký dành riêng cho Tác giả (Author Sign-up & Verification).
    * Bảng điều khiển riêng cho tác giả: Thống kê lượt bán, biểu đồ doanh thu, cài đặt tài khoản nhận thanh toán (Ngân hàng VN / PayPal / Payoneer).
  * [ ] **Quy trình Kiểm duyệt Theme (Theme Review & Approval Process):**
    * Xây dựng bộ tiêu chuẩn chất lượng (Theme Quality Standards): Kiểm tra mã độc, tính hợp lệ của mã HTML/PHP, tốc độ tải, khả năng responsive.
  * [ ] **Ra mắt Gói Hội Viên Toàn Quyền (All-Access Subscription Pass):**
    * Áp dụng WooCommerce Subscriptions: Khách hàng trả định kỳ $149/năm hoặc 2.990.000đ/năm để tải không giới hạn toàn bộ theme trên sàn.
    * Tự động chia sẻ doanh thu từ quỹ hội viên cho các tác giả dựa trên số lượt tải (Download-pool revenue share).
  * [ ] **Mở rộng danh mục sản phẩm:**
    * Bổ sung phân phối Template Kits (Elementor Kits, Bricks Templates).
    * Bổ sung phân phối Plugin tiện ích WordPress.
    * Bổ sung UI Kits (Figma, Adobe XD).
* **Cột mốc (Milestone 4):** Thu hút 50+ tác giả độc lập, cán mốc 500+ theme trên hệ thống, đạt doanh thu bền vững.

---

## 3. MA TRẬN QUẢN TRỊ RỦI RO (RISK MANAGEMENT MATRIX)

| Rủi ro tiềm ẩn | Mức độ | Biện pháp phòng ngừa & Xử lý của CEO |
| :--- | :---: | :--- |
| **Chia sẻ lậu file zip (Warez / Piracy)** | Cao | Tích hợp License Key gắn liền với tính năng cập nhật tự động (Auto-update) và thư viện mẫu demo độc quyền. Dù người dùng chia sẻ file theme thì cũng không thể cập nhật và import demo được nếu thiếu key. |
| **Gian lận thẻ & Chargeback quốc tế** | Trung bình | Kích hoạt 3D Secure trên Stripe; sử dụng công cụ phát hiện gian lận Stripe Radar; không cho phép mua nhiều đơn hàng cùng lúc từ cùng 1 IP trong thời gian ngắn. |
| **Khiếu nại yêu cầu hoàn tiền (Refund Abuse)** | Trung bình | Công khai chính sách hoàn tiền minh bạch: Chỉ hoàn tiền nếu theme phát sinh lỗi code PHP nghiêm trọng và đội ngũ không sửa được trong 48h. Từ chối hoàn tiền vì lý do "đổi ý" hoặc "không thích". |
| **Server quá tải khi nhiều người xem Demo** | Trung bình | Tách server website bán hàng chính (Shop) riêng biệt với server chứa các site chạy thử nghiệm Demo (Demo instances); sử dụng Full-page Cache và Cloudflare. |
| **Vấn đề bản quyền nguồn gốc theme** | Rất cao | Đảm bảo 100% theme phát hành tuân thủ giấy phép GNU General Public License (GPL); toàn bộ ảnh, font chữ và icon sử dụng trong bản demo phải dùng tài nguyên bản quyền thương mại tự do (Unsplash, Pexels, Google Fonts). |

---

## 4. BẢNG PHÂN BỔ NHÂN SỰ & VẬN HÀNH (TEAM STRUCTURE)

```
                              ┌────────────────┐
                              │      CEO       │
                              │ (Chiến lược &  │
                              │  Tăng trưởng)  │
                              └───────┬────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │ TECH LEAD / DEV │       │ MARKETING & GTM │       │ CUSTOMER CARE   │
   │ • Tùy biến web  │       │ • SEO Content   │       │ • Duyệt đơn     │
   │ • Quản lý server│       │ • Chạy Ads      │       │ • Hỗ trợ Zalo   │
   │ • License API   │       │ • Tuyển Affiliate│      │ • Ticket xử lý  │
   └─────────────────┘       └─────────────────┘       └─────────────────┘
```
