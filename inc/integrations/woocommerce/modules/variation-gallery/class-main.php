<?php
/**
 * Variation Gallery module.
 *
 * Entry point — loads all variation gallery sub-modules in the correct order:
 *   wc-compat.php WooCommerce native gallery compatibility + migration.
 *   old.php       Legacy per-product storage (woodmart_variation_gallery_data).
 *   new.php       Per-variation storage (wd_additional_variation_images_data).
 *
 * @package woodmart
 */

namespace XTS\Modules\Variation_Gallery;

use XTS\Singleton;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Variation Gallery main class.
 */
class Main extends Singleton {
	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {
		require_once __DIR__ . '/class-wc-compat.php';

		if ( 'old' === woodmart_get_opt( 'variation_gallery_storage_method', 'new' ) ) {
			require_once __DIR__ . '/class-storage-old.php';
		} else {
			require_once __DIR__ . '/class-storage-new.php';
		}
	}

	/**
	 * Whether WooCommerce's built-in variation gallery feature is active.
	 *
	 * @return bool
	 */
	public static function wc_native_gallery_enabled(): bool {
		return class_exists( '\Automattic\WooCommerce\Internal\VariationGallery\Package' )
			&& \Automattic\WooCommerce\Internal\VariationGallery\Package::is_enabled();
	}
}

Main::get_instance();
