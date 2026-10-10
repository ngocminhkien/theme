#!/usr/bin/env bash
# =====================================================================
# RESTORE MYSQL BACKUP SCRIPT FOR THEME MARKETPLACE PLATFORM
# Usage: ./restore-mysql.sh /path/to/backup.sql.gz
# =====================================================================

set -eo pipefail

BACKUP_FILE="$1"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-theme_marketplace}"
DB_USER="${DB_USER:-theme_user}"
DB_PASSWORD="${DB_PASSWORD:-theme_password_secure}"

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file not specified or not found."
  echo "Usage: $0 <path_to_backup.sql.gz>"
  exit 1
fi

echo "=========================================================="
echo "WARNING: Restoring database will OVERWRITE existing data in '${DB_NAME}'!"
echo "Target file: ${BACKUP_FILE}"
echo "=========================================================="

if [[ "${BACKUP_FILE}" == *.gz ]]; then
  gunzip < "${BACKUP_FILE}" | mysql --host="${DB_HOST}" --port="${DB_PORT}" --user="${DB_USER}" --password="${DB_PASSWORD}" "${DB_NAME}"
else
  mysql --host="${DB_HOST}" --port="${DB_PORT}" --user="${DB_USER}" --password="${DB_PASSWORD}" "${DB_NAME}" < "${BACKUP_FILE}"
fi

echo "[$(date)] Database restored successfully from ${BACKUP_FILE}!"
