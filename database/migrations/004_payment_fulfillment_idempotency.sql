-- One checkout currently permits one license type per theme. This unique key makes
-- fulfillment idempotent even if an operator retries an already-settled order.
-- Existing duplicate rows make ALTER fail safely; resolve them before re-running.
SET @license_fulfillment_index_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'licenses'
    AND index_name = 'uk_licenses_order_theme_type'
);
SET @license_fulfillment_index_sql := IF(
  @license_fulfillment_index_exists = 0,
  'ALTER TABLE licenses ADD UNIQUE KEY uk_licenses_order_theme_type (order_id, theme_id, license_type)',
  'SELECT 1'
);
PREPARE license_fulfillment_index_statement FROM @license_fulfillment_index_sql;
EXECUTE license_fulfillment_index_statement;
DEALLOCATE PREPARE license_fulfillment_index_statement;
