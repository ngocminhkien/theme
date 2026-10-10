#!/usr/bin/env bash
# =====================================================================
# AUTOMATED MYSQL BACKUP SCRIPT FOR THEME MARKETPLACE PLATFORM
# Features:
# - Dump full MySQL 8.0 schema & data safely (--single-transaction)
# - Compress with gzip (.sql.gz)
# - Retention cleanup (keep last 7 days)
# - Optional upload to Cloudflare R2 / AWS S3
# =====================================================================

set -eo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-theme_marketplace}"
DB_USER="${DB_USER:-theme_user}"
DB_PASSWORD="${DB_PASSWORD:-theme_password_secure}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

mkdir -p "${BACKUP_DIR}"

BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"

echo "=========================================================="
echo "[$(date)] Starting MySQL backup for database: ${DB_NAME}"
echo "=========================================================="

# 1. Run mysqldump with single transaction to prevent table locking
mysqldump \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --user="${DB_USER}" \
  --password="${DB_PASSWORD}" \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --default-character-set=utf8mb4 \
  "${DB_NAME}" | gzip -9 > "${BACKUP_FILE}"

FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "[$(date)] Backup completed successfully: ${BACKUP_FILE} (Size: ${FILE_SIZE})"

# 2. Upload to Cloud Storage if AWS CLI / S3 bucket is configured
if [ -n "${R2_BUCKET_NAME}" ] || [ -n "${S3_BUCKET}" ]; then
  BUCKET="${R2_BUCKET_NAME:-$S3_BUCKET}"
  echo "[$(date)] Uploading backup to S3/R2 Bucket: s3://${BUCKET}/db-backups/..."
  if command -v aws &> /dev/null; then
    aws s3 cp "${BACKUP_FILE}" "s3://${BUCKET}/db-backups/$(basename "${BACKUP_FILE}")"
    echo "[$(date)] Upload to S3/R2 completed."
  else
    echo "[$(date)] Notice: 'aws' CLI not installed in current environment, skipping cloud upload."
  fi
fi

# 3. Clean up older backups (Retention policy)
echo "[$(date)] Cleaning up local backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +"${RETENTION_DAYS}" -exec rm -f {} +
echo "[$(date)] Backup rotation completed. All systems operational."
