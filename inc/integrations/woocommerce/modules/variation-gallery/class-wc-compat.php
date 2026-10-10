<?php
/**
 * WooCommerce native variation gallery compatibility and migration.
 *
 * Provides a fallback filter so that $variation->get_gallery_image_ids() returns
 * WoodMart's legacy gallery meta when the variation has not yet been migrated to
 * WooCommerce's native `_product_image_gallery`.
 *
 * Handles two legacy storage formats:
 *  - "new" (per-variation): `wd_additional_variation_images_data` on the variation post.
 *  - "old" (per-product):   `woodmart_variation_gallery_data` (serialised array) on the
 *                           parent product post, keyed by variation ID.
 *
 * Modelled on Automattic\WooCommerce\Internal\VariationGallery\Migration.
 *
 * @package woodmart
 */

namespace XTS\Modules\Variation_Gallery;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * WooCommerce compatibility and migration for legacy variation gallery storage.
 */
class WC_Compat {
	/**
	 * Cache of per-product legacy gallery data to avoid repeated DB reads.
	 *
	 * @var array<int, mixed>
	 */
	private array $parent_gallery_cache = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'woocommerce_product_variation_get_gallery_image_ids', array( $this, 'compat_gallery_image_ids' ), 5, 2 );
		add_action( 'admin_init', array( $this, 'schedule_migrations' ) );
		add_action( 'woodmart_gallery_run_migration_batch', array( $this, 'run_migration_batch_callback' ) );
	}

	/**
	 * Return legacy gallery IDs when a variation has not yet been migrated to
	 * WooCommerce's native `_product_image_gallery`.
	 *
	 * Checks (in order):
	 *  1. `wd_additional_variation_images_data` on the variation post ("new" storage).
	 *  2. `woodmart_variation_gallery_data` on the parent product post ("old" storage).
	 *
	 * Priority 5 – runs before WooCommerce's own legacy compat filter (priority 10).
	 *
	 * @param array|mixed           $gallery_image_ids Gallery IDs already resolved by core.
	 * @param \WC_Product_Variation $variation         Variation instance.
	 * @return array<int>
	 */
	public function compat_gallery_image_ids( $gallery_image_ids, $variation ): array {
		if ( ! empty( $gallery_image_ids ) ) {
			return $gallery_image_ids;
		}

		$variation_id = $variation->get_id();

		// Sentinel is set → variation was explicitly saved/migrated; respect "no images".
		if ( metadata_exists( 'post', $variation_id, '_wd_avi_gallery_migrated' ) ) {
			return array();
		}

		// 1. "new" per-variation storage.
		$new_ids = get_post_meta( $variation_id, 'wd_additional_variation_images_data', true );
		if ( ! empty( $new_ids ) ) {
			return array_values( wp_parse_id_list( $new_ids ) );
		}

		// 2. "old" per-product storage.
		$parent_id = $variation->get_parent_id();

		if ( ! array_key_exists( $parent_id, $this->parent_gallery_cache ) ) {
			$this->parent_gallery_cache[ $parent_id ] = get_post_meta( $parent_id, 'woodmart_variation_gallery_data', true );
		}

		$parent_data = $this->parent_gallery_cache[ $parent_id ];
		if ( is_array( $parent_data ) && ! empty( $parent_data[ $variation_id ] ) ) {
			return array_values( wp_parse_id_list( $parent_data[ $variation_id ] ) );
		}

		return array();
	}

	/**
	 * Migration: "new" storage – wd_additional_variation_images_data (per-variation).
	 *
	 * @return bool
	 */
	public function avi_migration_completed(): bool {
		return (bool) get_option( 'woodmart_avi_gallery_migration_completed_at' );
	}

	/**
	 * Process one batch of the "new" storage migration.
	 *
	 * Copies `wd_additional_variation_images_data` into `_product_image_gallery`
	 * for up to $batch_size variations that have not yet been processed.
	 *
	 * @param int $batch_size Maximum variations to process per call.
	 * @return bool Whether more unmigrated records remain.
	 */
	public function avi_migrate_gallery_batch( int $batch_size = 250 ): bool {
		global $wpdb;

		if ( $this->avi_migration_completed() ) {
			return false;
		}

		$sentinel_key = '_wd_avi_gallery_migrated';
		$legacy_key   = 'wd_additional_variation_images_data';
		$core_key     = '_product_image_gallery';

		$select_pending = function ( $limit ) use ( $wpdb, $legacy_key, $sentinel_key ) {
			return array_map(
				'intval',
				$wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
					$wpdb->prepare(
						"SELECT legacy.post_id
						FROM {$wpdb->postmeta} AS legacy
						INNER JOIN {$wpdb->posts} AS posts
							ON posts.ID = legacy.post_id
							AND posts.post_type = 'product_variation'
						LEFT JOIN {$wpdb->postmeta} AS migrated
							ON migrated.post_id = legacy.post_id
							AND migrated.meta_key = %s
						WHERE legacy.meta_key = %s
							AND legacy.meta_value <> ''
							AND migrated.post_id IS NULL
						GROUP BY legacy.post_id
						ORDER BY legacy.post_id ASC
						LIMIT %d",
						$sentinel_key,
						$legacy_key,
						$limit
					)
				)
			);
		};

		foreach ( $select_pending( $batch_size ) as $variation_id ) {
			$legacy_ids_raw = get_post_meta( $variation_id, $legacy_key, true );
			$legacy_ids     = array_values( array_filter( wp_parse_id_list( $legacy_ids_raw ) ) );

			if ( ! metadata_exists( 'post', $variation_id, $core_key ) && ! empty( $legacy_ids ) ) {
				update_post_meta( $variation_id, $core_key, implode( ',', $legacy_ids ) );
			}

			update_post_meta( $variation_id, $sentinel_key, 'yes' );
		}

		$has_more = ! empty( $select_pending( 1 ) );

		if ( ! $has_more && ! $this->avi_migration_completed() ) {
			update_option( 'woodmart_avi_gallery_migration_completed_at', time() );
		}

		return $has_more;
	}

	/**
	 * Migration: "old" storage – woodmart_variation_gallery_data (per-product).
	 *
	 * @return bool
	 */
	public function vg_migration_completed(): bool {
		return (bool) get_option( 'woodmart_vg_gallery_migration_completed_at' );
	}

	/**
	 * Process one batch of the "old" storage migration.
	 *
	 * The "old" format stores an associative array `[ variation_id => 'ids,string' ]`
	 * in `woodmart_variation_gallery_data` on the PARENT product post. This method
	 * iterates up to $batch_size products, copies each variation's IDs to
	 * `_product_image_gallery` on the variation post, and marks them with the sentinel.
	 *
	 * @param int $batch_size Maximum products to process per call.
	 * @return bool Whether more unprocessed products remain.
	 */
	public function vg_migrate_gallery_batch( int $batch_size = 50 ): bool {
		global $wpdb;

		if ( $this->vg_migration_completed() ) {
			return false;
		}

		$product_sentinel = '_wd_vg_gallery_migration_done';
		$sentinel_key     = '_wd_avi_gallery_migrated';
		$legacy_key       = 'woodmart_variation_gallery_data';
		$core_key         = '_product_image_gallery';

		$select_pending_products = function ( $limit ) use ( $wpdb, $legacy_key, $product_sentinel ) {
			return array_map(
				'intval',
				$wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
					$wpdb->prepare(
						"SELECT pm.post_id
						FROM {$wpdb->postmeta} AS pm
						INNER JOIN {$wpdb->posts} AS p
							ON p.ID = pm.post_id
							AND p.post_type = 'product'
						LEFT JOIN {$wpdb->postmeta} AS done
							ON done.post_id = pm.post_id
							AND done.meta_key = %s
						WHERE pm.meta_key = %s
							AND pm.meta_value NOT IN ('', 'a:0:{}')
							AND done.post_id IS NULL
						ORDER BY pm.post_id ASC
						LIMIT %d",
						$product_sentinel,
						$legacy_key,
						$limit
					)
				)
			);
		};

		foreach ( $select_pending_products( $batch_size ) as $product_id ) {
			$gallery_data = get_post_meta( $product_id, $legacy_key, true );

			if ( is_array( $gallery_data ) ) {
				foreach ( $gallery_data as $variation_id => $ids_raw ) {
					$variation_id = (int) $variation_id;
					$ids          = array_values( array_filter( wp_parse_id_list( $ids_raw ) ) );

					if ( ! metadata_exists( 'post', $variation_id, $core_key ) && ! empty( $ids ) ) {
						update_post_meta( $variation_id, $core_key, implode( ',', $ids ) );
					}

					// Mark the variation so the compat filter stops falling back.
					update_post_meta( $variation_id, $sentinel_key, 'yes' );
				}
			}

			// Mark the parent product as fully processed.
			update_post_meta( $product_id, $product_sentinel, 'yes' );
		}

		$has_more = ! empty( $select_pending_products( 1 ) );

		if ( ! $has_more && ! $this->vg_migration_completed() ) {
			update_option( 'woodmart_vg_gallery_migration_completed_at', time() );
		}

		return $has_more;
	}

	/**
	 * Whether both migration legs have completed.
	 *
	 * @return bool
	 */
	public function migrations_completed(): bool {
		if ( 'old' === woodmart_get_opt( 'variation_gallery_storage_method', 'new' ) ) {
			return $this->vg_migration_completed();
		}

		return $this->avi_migration_completed();
	}

	/**
	 * Schedule the combined migration if either leg has not completed.
	 *
	 * Hooked to admin_init so it fires once per admin page load until done.
	 *
	 * @return void
	 */
	public function schedule_migrations() {
		if ( $this->migrations_completed() ) {
			return;
		}

		if ( function_exists( 'as_has_scheduled_action' ) ) {
			if ( ! as_has_scheduled_action( 'woodmart_gallery_run_migration_batch' ) ) {
				as_schedule_single_action( time(), 'woodmart_gallery_run_migration_batch', array(), 'woodmart' );
			}
			return;
		}

		if ( ! wp_next_scheduled( 'woodmart_gallery_run_migration_batch' ) ) {
			wp_schedule_single_event( time() + 30, 'woodmart_gallery_run_migration_batch' );
		}
	}

	/**
	 * Run one batch of each migration leg and re-schedule when more work remains.
	 *
	 * @return void
	 */
	public function run_migration_batch_callback() {
		if ( 'old' === woodmart_get_opt( 'variation_gallery_storage_method', 'new' ) ) {
			$vg_has_more  = $this->vg_migrate_gallery_batch();
			$avi_has_more = false;
		} else {
			$avi_has_more = $this->avi_migrate_gallery_batch();
			$vg_has_more  = false;
		}

		if ( ! $avi_has_more && ! $vg_has_more ) {
			return;
		}

		if ( function_exists( 'as_schedule_single_action' ) ) {
			as_schedule_single_action( time(), 'woodmart_gallery_run_migration_batch', array(), 'woodmart' );
		} else {
			wp_schedule_single_event( time() + 5, 'woodmart_gallery_run_migration_batch' );
		}
	}
}

new WC_Compat();
