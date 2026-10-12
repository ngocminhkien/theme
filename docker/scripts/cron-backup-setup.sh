#!/bin/bash
# ==============================================================================
# ⏰ AUTOMATED CRON BACKUP SCHEDULER SETUP (DAILY AT 02:00 AM)
# Theme Marketplace Platform - Lead DevOps (Member 01)
# ==============================================================================

set -e

PROJECT_DIR="/var/www/theme-marketplace"
BACKUP_SCRIPT="${PROJECT_DIR}/docker/scripts/backup-mysql.sh"
LOG_FILE="/var/log/theme_backup.log"

echo "=============================================================================="
echo "⏰ THIẾT LẬP CRONJOB TỰ ĐỘNG SAO LƯU DỮ LIỆU MYSQL HÀNG NGÀY"
echo "=============================================================================="

# Đảm bảo file backup script có quyền thực thi
if [ -f "$BACKUP_SCRIPT" ]; then
    chmod +x "$BACKUP_SCRIPT"
    echo "✔ Đã cấp quyền execute cho: $BACKUP_SCRIPT"
else
    echo "⚠️ Cảnh báo: Không tìm thấy $BACKUP_SCRIPT, vui lòng kiểm tra thư mục cài đặt."
fi

# Tạo file log nếu chưa tồn tại
sudo touch "$LOG_FILE"
sudo chmod 0666 "$LOG_FILE"

# Định nghĩa cronjob: Chạy vào lúc 02:00 sáng mỗi ngày
CRON_JOB="0 2 * * * ${BACKUP_SCRIPT} >> ${LOG_FILE} 2>&1"

# Kiểm tra xem cronjob đã tồn tại chưa để tránh lặp
if crontab -l 2>/dev/null | grep -F "$BACKUP_SCRIPT" >/dev/null; then
    echo "ℹ️ Cronjob sao lưu đã được cài đặt trước đó."
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✔ Đã đăng ký Cronjob tự động vào Crontab hệ thống:"
    echo "   [$CRON_JOB]"
fi

echo "=============================================================================="
echo "🎉 HOÀN TẤT CẤU HÌNH SAO LƯU TỰ ĐỘNG!"
echo "   - Lịch chạy: Hàng ngày lúc 02:00 AM"
echo "   - File lưu trữ: ${PROJECT_DIR}/database/backups/db_backup_YYYYMMDD_HHMMSS.sql.gz"
echo "   - Nhật ký sao lưu: tail -f ${LOG_FILE}"
echo "=============================================================================="
