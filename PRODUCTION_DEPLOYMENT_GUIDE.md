# 🚀 HƯỚNG DẪN TRIỂN KHAI MÁY CHỦ PRODUCTION & AUTOMATED CI/CD (MEMBER 01 DEVOPS)

> **Tài liệu chuẩn hóa:** Dành cho Lead DevOps, Quản trị viên Hệ thống (SysAdmin) và Đội ngũ Phát triển khi đưa nền tảng Theme Marketplace lên máy chủ Production thực tế (Ubuntu 22.04 LTS VPS).

---

## 📌 1. YÊU CẦU CẤU HÌNH PHẦN CỨNG MÁY CHỦ (VPS SPECS)

| Thông số | Mức tối thiểu (MVP) | Mức khuyến nghị (Production) |
| :--- | :--- | :--- |
| **Hệ điều hành** | Ubuntu 22.04 LTS (x86_64) | Ubuntu 22.04 LTS (x86_64) |
| **CPU** | 2 vCPUs | 4 vCPUs |
| **RAM** | 4 GB | 8 GB |
| **Ổ cứng** | 40 GB NVMe SSD | 80+ GB NVMe SSD |
| **Băng thông** | 100 Mbps Unlimited | 1 Gbps Unlimited |
| **Nhà cung cấp** | Hetzner / DigitalOcean / Vultr / Vietnix | Hetzner Cloud / AWS EC2 / Linode |

---

## ⚡ 2. KHỞI TẠO MÁY CHỦ TỰ ĐỘNG (1-COMMAND SETUP)

Sau khi tạo VPS và SSH vào máy chủ dưới quyền `root` hoặc `sudo user`:

```bash
# 1. Tải script khởi tạo môi trường VPS
curl -fsSL https://raw.githubusercontent.com/ngocminhkien/theme/main/docker/scripts/setup-production-vps.sh -o setup-vps.sh
chmod +x setup-vps.sh

# 2. Chạy kịch bản cài đặt tự động (Cài Docker, Compose, Firewall UFW, Certbot)
sudo ./setup-vps.sh
```

---

## 🔒 3. CẤU HÌNH TÊN MIỀN & CHỨNG CHỈ SSL LET'S ENCRYPT

### Bước 1: Trỏ DNS Tên miền
Trỏ bản ghi DNS của tên miền về địa chỉ IP của VPS:
- `A` record: `@` ➔ `IP_CỦA_VPS`
- `A` record: `www` ➔ `IP_CỦA_VPS`
- `A` record: `api` ➔ `IP_CỦA_VPS` (nếu tách subdomain)

### Bước 2: Cấp chứng chỉ SSL miễn phí tự động
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```
*Chứng chỉ sẽ được lưu trữ tại `/etc/letsencrypt/live/yourdomain.com/`*.

### Bước 3: Kích hoạt file cấu hình Nginx SSL
```bash
cd /var/www/theme-marketplace
cp docker/nginx/conf.d/production-ssl.conf.template docker/nginx/conf.d/default.conf

# Sửa yourdomain.com thành tên miền thật của bạn
sed -i 's/yourdomain.com/tenmiencuaban.com/g' docker/nginx/conf.d/default.conf
```

---

## 🔄 4. THIẾT LẬP REPOSITORY SECRETS CHO GITHUB ACTIONS CD

Để kích hoạt tính năng **tự động deploy khi push code vào nhánh `main`**, hãy truy cập GitHub Repository:  
👉 **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ **New repository secret**:

| Tên Secret | Giá trị mẫu | Mô tả |
| :--- | :--- | :--- |
| `SERVER_HOST` | `103.153.xx.xx` hoặc `yourdomain.com` | Địa chỉ IP hoặc hostname VPS |
| `SERVER_USER` | `ubuntu` hoặc `root` | Tên người dùng SSH |
| `SERVER_PORT` | `22` | Cổng SSH |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Khóa SSH Private Key không mật khẩu |

---

## ⏰ 5. CẤU HÌNH SAO LƯU CƠ SỞ DỮ LIỆU TỰ ĐỘNG (DAILY CRON)

Trên VPS, chạy script sau để kích hoạt lịch sao lưu MySQL tự động vào lúc 02:00 AM mỗi ngày:

```bash
cd /var/www/theme-marketplace
sudo ./docker/scripts/cron-backup-setup.sh
```

- **Vị trí lưu file sao lưu:** `/var/www/theme-marketplace/database/backups/`
- **Tự động dọn dẹp:** Bản sao lưu cũ hơn 7 ngày sẽ tự động được xóa để tiết kiệm dung lượng đĩa.
- **Xem nhật ký sao lưu:**
```bash
tail -f /var/log/theme_backup.log
```

---

## 🩺 6. KIỂM TRA SỨC KHỎE TOÀN BỘ HỆ THỐNG (SMOKE TEST)

Bất kỳ lúc nào sau khi deploy hoặc khởi động, chạy lệnh sau để kiểm tra trạng thái toàn bộ 6 dịch vụ:

```bash
node scripts/health-check.cjs
```

Bảng ma trận kết quả sẽ hiển thị chi tiết:
- ✅ **MySQL 8.0:** Đã kết nối, schema & dữ liệu đầy đủ.
- ✅ **Redis 7.x:** Phản hồi PONG sẵn sàng cache.
- ✅ **Backend API (:4000):** Đạt chuẩn `/health`, `/api/v1/themes`, `/api/v1/categories`.
- ✅ **Frontend Next.js (:3000):** Trang chủ HTTP 200, Live Preview HTTP 200.
- ✅ **Nginx Reverse Proxy (:80 / :443):** Bảo vệ bằng SSL và Rate Limit.
- ✅ **MinIO / Cloudflare R2:** Lưu trữ file theme `.zip` sẵn sàng cấp Presigned URL.
