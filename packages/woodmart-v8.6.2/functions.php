<?php
/**
 * Woodmart Theme Functions and Definitions
 * Integrates WordPress Theme Auto-Updater (PUC) with Theme Marketplace License Engine
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('WOODMART_THEME_VERSION', '8.6.2');
define('WOODMART_UPDATER_ENDPOINT', 'http://localhost:4000/api/v1/updater/check');

// WordPress Theme Auto-Updater Hook
function woodmart_check_for_updates() {
    $license_key = get_option('woodmart_license_key', '');
    if (empty($license_key)) {
        return;
    }
    // PUC (Plugin Update Checker) Client integration point
}
add_action('admin_init', 'woodmart_check_for_updates');
