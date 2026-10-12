#!/bin/bash
# ==============================================================================
# 🚀 AUTOMATED PRODUCTION VPS INITIALIZATION SCRIPT (UBUNTU 22.04 LTS)
# Theme Marketplace Platform - Lead DevOps (Member 01)
# ==============================================================================

set -e

echo "=============================================================================="
echo "🚀 BẮT ĐẦU CẤU HÌNH PRODUCTION SERVER CHO THEME MARKETPLACE"
echo "=============================================================================="

# 1. Cập nhật hệ điều hành
echo "==> 1. Cập nhật gói hệ điều hành Ubuntu..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git unzip htop ufw ca-certificates gnupg lsb-release

# 2. Cài đặt Docker Engine & Docker Compose chính hãng
echo "==> 2. Cài đặt Docker Engine chính hãng..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Thêm user hiện tại vào group docker
sudo usermod -aG docker $USER || true

# 3. Cấu hình Firewall UFW an toàn
echo "==> 3. Cấu hình Firewall UFW (Chỉ mở Port 22 SSH, 80 HTTP, 443 HTTPS)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH Port'
sudo ufw allow 80/tcp comment 'HTTP Web'
sudo ufw allow 443/tcp comment 'HTTPS Secure Web'
# Tuyệt đối không mở công khai 3306 (MySQL), 6379 (Redis), 9000 (MinIO) ra ngoài internet!
sudo ufw --force enable

# 4. Cài đặt Certbot (Let's Encrypt SSL)
echo "==> 4. Cài đặt Certbot Let's Encrypt..."
sudo apt-get install -y certbot

# 5. Khởi tạo thư mục mã nguồn triển khai
echo "==> 5. Khởi tạo thư mục dự án /var/www/theme-marketplace..."
sudo mkdir -p /var/www/theme-marketplace
sudo chown -R $USER:$USER /var/www/theme-marketplace

# 6. Thiết lập quyền thực thi cho các scripts bảo trì
echo "==> 6. Thiết lập quyền thực thi cho scripts..."
sudo chmod +x /var/www/theme-marketplace/docker/scripts/*.sh 2>/dev/null || true

echo "=============================================================================="
echo "🎉 HOÀN TẤT THIẾT LẬP MÁY CHỦ PRODUCTION VPS!"
echo "   - Docker Version: $(docker --version)"
echo "   - Docker Compose: $(docker compose version)"
echo "   - Firewall: UFW đã kích hoạt bảo vệ 3 cổng (22, 80, 443)"
echo "=============================================================================="
