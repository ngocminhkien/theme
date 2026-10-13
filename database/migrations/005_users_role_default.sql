-- =====================================================================
-- Migration 005: Ensure users.role Column & Default 'customer' (Người dùng)
-- Purpose:
--   1. Đảm bảo bảng `users` có cột `role` để phân biệt Người dùng ('customer')
--      và Quản trị viên ('admin').
--   2. Giá trị mặc định (DEFAULT) khi tạo tài khoản mới luôn là 'customer' (Người dùng).
-- =====================================================================

-- 1. Thêm cột `role` nếu bảng `users` chưa có cột này (Idempotent)
SET @col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
);

SET @add_col_sql := IF(
  @col_exists = 0,
  "ALTER TABLE `users` ADD COLUMN `role` ENUM('customer', 'author', 'admin') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò: customer (Người dùng - Mặc định), author (Tác giả), admin (Quản trị viên)' AFTER `phone`",
  "ALTER TABLE `users` MODIFY COLUMN `role` ENUM('customer', 'author', 'admin') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò: customer (Người dùng - Mặc định), author (Tác giả), admin (Quản trị viên)'"
);

PREPARE stmt_role FROM @add_col_sql;
EXECUTE stmt_role;
DEALLOCATE PREPARE stmt_role;

-- 2. Chuẩn hóa mọi bản ghi chưa có role về mặc định 'customer' (Người dùng)
UPDATE `users`
SET `role` = 'customer'
WHERE `role` IS NULL OR `role` = '';

-- 3. Đảm bảo chỉ mục truy vấn nhanh theo (role, status)
SET @idx_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'idx_users_role_status'
);

SET @add_idx_sql := IF(
  @idx_exists = 0,
  "ALTER TABLE `users` ADD KEY `idx_users_role_status` (`role`, `status`)",
  "SELECT 1"
);

PREPARE stmt_idx FROM @add_idx_sql;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;
