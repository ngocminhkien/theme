-- Durable checkout retries: the key and order are committed in the same transaction.
-- No customer details or payment secrets are stored in this table.
CREATE TABLE IF NOT EXISTS `checkout_requests` (
    `idempotency_key` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `fingerprint` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    `order_id` BIGINT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`idempotency_key`),
    UNIQUE KEY `uk_checkout_order` (`order_id`),
    CONSTRAINT `fk_checkout_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
