-- =====================================================================
-- DATABASE SCHEMA: THEME MARKETPLACE PLATFORM (VIETNAM & GLOBAL)
-- Database: MySQL 8.0+ / MariaDB 10.11+
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `download_logs`;
DROP TABLE IF EXISTS `license_activations`;
DROP TABLE IF EXISTS `licenses`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `theme_versions`;
DROP TABLE IF EXISTS `themes`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS & ACCOUNTS
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` ENUM('customer', 'author', 'admin') NOT NULL DEFAULT 'customer',
    `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    `avatar_url` VARCHAR(255) DEFAULT NULL,
    `country_code` VARCHAR(5) DEFAULT 'VN',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    KEY `idx_users_role_status` (`role`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. THEME CATEGORIES & NICHES
CREATE TABLE `categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name_vi` VARCHAR(100) NOT NULL,
    `name_en` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `icon` VARCHAR(50) DEFAULT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_slug` (`slug`),
    KEY `fk_categories_parent` (`parent_id`),
    CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. THEMES MASTER CATALOG
CREATE TABLE `themes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `author_id` BIGINT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `short_desc_vi` TEXT DEFAULT NULL,
    `short_desc_en` TEXT DEFAULT NULL,
    `desc_vi` LONGTEXT DEFAULT NULL,
    `desc_en` LONGTEXT DEFAULT NULL,
    `current_version` VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    `price_vnd` DECIMAL(12, 0) NOT NULL DEFAULT 0,
    `price_usd` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `live_demo_url` VARCHAR(255) NOT NULL,
    `thumbnail_url` VARCHAR(255) NOT NULL,
    `preview_images` JSON DEFAULT NULL,
    `compatible_with` VARCHAR(255) DEFAULT 'WordPress 6.x, WooCommerce 9.x',
    `page_builders` VARCHAR(100) DEFAULT 'Elementor, Gutenberg',
    `total_sales` INT UNSIGNED NOT NULL DEFAULT 0,
    `rating_avg` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    `rating_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_themes_slug` (`slug`),
    KEY `idx_themes_author` (`author_id`),
    KEY `idx_themes_category` (`category_id`),
    KEY `idx_themes_status_sales` (`status`, `total_sales`),
    CONSTRAINT `fk_themes_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_themes_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. THEME RELEASE VERSIONS & CHANGELOG
CREATE TABLE `theme_versions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `theme_id` BIGINT UNSIGNED NOT NULL,
    `version` VARCHAR(20) NOT NULL,
    `changelog` TEXT NOT NULL,
    `file_path` VARCHAR(255) NOT NULL, -- Đường dẫn tệp nén trên Cloudflare R2 / S3
    `file_size_bytes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `php_version_min` VARCHAR(10) NOT NULL DEFAULT '7.4',
    `wp_version_min` VARCHAR(10) NOT NULL DEFAULT '6.0',
    `is_stable` TINYINT(1) NOT NULL DEFAULT 1,
    `released_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_theme_version` (`theme_id`, `version`),
    CONSTRAINT `fk_theme_versions_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDERS
CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_number` VARCHAR(32) NOT NULL,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `customer_email` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_phone` VARCHAR(25) DEFAULT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `currency` ENUM('VND', 'USD') NOT NULL DEFAULT 'VND',
    `payment_method` ENUM('vietqr', 'momo', 'zalopay', 'stripe', 'paypal') NOT NULL,
    `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `order_status` ENUM('processing', 'completed', 'cancelled') NOT NULL DEFAULT 'processing',
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_orders_number` (`order_number`),
    KEY `idx_orders_user` (`user_id`),
    KEY `idx_orders_email` (`customer_email`),
    KEY `idx_orders_status` (`payment_status`, `order_status`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ORDER ITEMS
CREATE TABLE `order_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `theme_id` BIGINT UNSIGNED NOT NULL,
    `license_type` ENUM('regular', 'agency', 'lifetime') NOT NULL DEFAULT 'regular',
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_items_order` (`order_id`),
    KEY `idx_order_items_theme` (`theme_id`),
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SOFTWARE LICENSES (HỆ THỐNG BẢN QUYỀN)
CREATE TABLE `licenses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `license_key` VARCHAR(64) NOT NULL,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `theme_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `license_type` ENUM('regular', 'agency', 'lifetime') NOT NULL DEFAULT 'regular',
    `max_domains` INT UNSIGNED NOT NULL DEFAULT 1,
    `active_domains_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('active', 'expired', 'revoked') NOT NULL DEFAULT 'active',
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_licenses_key` (`license_key`),
    KEY `idx_licenses_order` (`order_id`),
    KEY `idx_licenses_theme` (`theme_id`),
    KEY `idx_licenses_user` (`user_id`),
    CONSTRAINT `fk_licenses_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_licenses_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_licenses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DOMAIN ACTIVATIONS
CREATE TABLE `license_activations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `license_id` BIGINT UNSIGNED NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `activated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_check_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_license_domain` (`license_id`, `domain`),
    KEY `idx_activations_domain` (`domain`),
    CONSTRAINT `fk_activations_license` FOREIGN KEY (`license_id`) REFERENCES `licenses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PAYMENT TRANSACTIONS & WEBHOOKS LOG
CREATE TABLE `payments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL, -- Mã giao dịch ngân hàng / Stripe ID / PayPal ID
    `gateway` ENUM('vietqr', 'momo', 'zalopay', 'stripe', 'paypal') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` ENUM('VND', 'USD') NOT NULL,
    `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    `raw_payload` JSON DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_payments_trans` (`gateway`, `transaction_id`),
    KEY `idx_payments_order` (`order_id`),
    CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. DOWNLOAD AUDIT LOGS
CREATE TABLE `download_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `license_id` BIGINT UNSIGNED DEFAULT NULL,
    `theme_id` BIGINT UNSIGNED NOT NULL,
    `theme_version_id` BIGINT UNSIGNED NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `downloaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_downloads_license` (`license_id`),
    KEY `idx_downloads_theme` (`theme_id`),
    CONSTRAINT `fk_downloads_license` FOREIGN KEY (`license_id`) REFERENCES `licenses` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_downloads_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA: Please refer to database/seeds/01_seed_data.sql
-- =====================================================================
