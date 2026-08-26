#!/bin/bash
# ==============================================================================
# EduPortal Automated Database Backup Script
# Usage: ./scripts/backup-db.sh
# Cron example (Daily at 02:00 AM): 0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/eduportal-backup.log 2>&1
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/eduportal}"
CONTAINER_NAME="${CONTAINER_NAME:-eduportal-mysql-prod}"
DB_NAME="${DB_NAME:-student_management_db}"
RETENTION_DAYS=14
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/eduportal_${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Starting automated MySQL backup for ${DB_NAME}..."

# Execute mysqldump inside container and compress on the fly
docker exec "${CONTAINER_NAME}" mysqldump \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    -u root -p"${DB_PASSWORD}" "${DB_NAME}" | gzip -9 > "${BACKUP_FILE}"

if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
    FILESIZE=$(ls -lh "${BACKUP_FILE}" | awk '{print $5}')
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Backup created successfully: ${BACKUP_FILE} (Size: ${FILESIZE})"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Backup failed or output file is empty!"
    exit 1
fi

# Clean up backups older than RETENTION_DAYS
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "eduportal_${DB_NAME}_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🏁 Backup process finished."

