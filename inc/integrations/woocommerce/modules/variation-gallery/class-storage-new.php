<?php
/**
 * WoodMart variation gallery – "new" per-variation storage.
 *
 * Handles the `wd_additional_variation_images_data` meta key stored on each
 * variation post. Provides admin UI, save callbacks, WooCommerce export/import
 * integration, and front-end variation data filters.
 *
 * @package woodmart
 */

namespace XTS\Modules\Variation_Gallery;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Per-variation gallery storage ("new" format).
 */
class Storage_New {
	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'woocommerce_product_export_meta_value', array( $this, 'export_variation_gallery' ), 10, 4 );
		add_filter( 'woocommerce_product_importer_pre_expand_data', array( $this, 'importer_variation_gallery' ) );
		add_action( 'woocommerce_save_product_variation', array( $this, 'save_images' ), 10, 2 );
		add_action( 'woocommerce_variation_options', array( $this, 'admin_html' ), 10, 3 );
		add_filter( 'woocommerce_available_variation', array( $this, 'update_available_variation' ), 10, 3 );
	}

	/**
	 * Convert stored attachment IDs to full URLs for WooCommerce CSV export.
	 *
	 * @param mixed  $value    Meta value.
	 * @param object $meta     Meta object with a `key` property.
	 * @return mixed Comma-separated image URLs when the key matches; original $value otherwise.
	 */
	public function export_variation_gallery( $value, $meta ) {
		if ( ! $value || 'wd_additional_variation_images_data' !== $meta->key ) {
			return $value;
		}

		$image_ids  = explode( ',', $value );
		$images_src = array();

		foreach ( $image_ids as $image_id ) {
			$src = wp_get_attachment_image_src( $image_id, 'full' );

			if ( ! empty( $src[0] ) ) {
				$images_src[] = $src[0];
			}
		}

		if ( $image_ids ) {
			return implode( ', ', $images_src );
		}

		return $value;
	}

	/**
	 * Sideload gallery images from URLs during WooCommerce CSV import.
	 *
	 * @param array $data Pre-expanded importer row data.
	 * @return array Row data with attachment IDs substituted for URLs.
	 */
	public function importer_variation_gallery( $data ) {
		if ( ! empty( $data['meta:wd_additional_variation_images_data'] ) ) {
			$images_url = explode( ', ', $data['meta:wd_additional_variation_images_data'] );
			$images_id  = array();

			foreach ( $images_url as $url ) {
				$id = media_sideload_image( $url, 0, '', 'id' );

				if ( ! is_wp_error( $id ) ) {
					$images_id[] = $id;
				}
			}

			if ( $images_id ) {
				$data['meta:wd_additional_variation_images_data'] = implode( ',', $images_id );
			}
		}

		return $data;
	}

	/**
	 * Save variation gallery image IDs from the admin form submission.
	 *
	 * Also writes to `_product_image_gallery` (WC native) and sets the migration
	 * sentinel so the compat fallback filter no longer fires for this variation.
	 * Bails when WooCommerce's native gallery UI is active to avoid conflicts.
	 *
	 * @param int $variation_id Variation post ID.
	 * @return void
	 */
	public function save_images( $variation_id ) {
		if ( Main::wc_native_gallery_enabled() ) {
			if ( ! metadata_exists( 'post', $variation_id, '_wd_avi_gallery_migrated' ) ) {
				update_post_meta( $variation_id, '_wd_avi_gallery_migrated', 'yes' );
			}

			return;
		}

		if ( isset( $_POST['wd_additional_variation_images'] ) ) { // phpcs:ignore
			if ( isset( $_POST['wd_additional_variation_images'][ $variation_id ] ) ) { // phpcs:ignore
				$ids_raw = sanitize_text_field( wp_unslash( $_POST['wd_additional_variation_images'][ $variation_id ] ) ); // phpcs:ignore
				$ids     = array_filter( wp_parse_id_list( $ids_raw ) );

				update_post_meta( $variation_id, 'wd_additional_variation_images_data', implode( ',', $ids ) );
				update_post_meta( $variation_id, '_product_image_gallery', implode( ',', $ids ) );
				update_post_meta( $variation_id, '_wd_avi_gallery_migrated', 'yes' );
			} else {
				delete_post_meta( $variation_id, 'wd_additional_variation_images_data' );
				update_post_meta( $variation_id, '_product_image_gallery', '' );
				update_post_meta( $variation_id, '_wd_avi_gallery_migrated', 'yes' );
			}
		} else {
			delete_post_meta( $variation_id, 'wd_additional_variation_images_data' );
		}
	}

	/**
	 * Return attachment data arrays for all variation gallery images.
	 *
	 * @param WP_Post $variation Variation post object.
	 * @return array<array{id: int, url: array|false}> Attachment data list.
	 */
	private function get_attachments_data( $variation ) {
		$attachments      = $this->get_attachments( $variation );
		$attachments_data = array();

		if ( ! $attachments ) {
			return $attachments_data;
		}

		foreach ( $attachments as $attachment_id ) {
			$attachments_data[] = array(
				'id'  => $attachment_id,
				'url' => wp_get_attachment_image_src( $attachment_id ),
			);
		}

		return $attachments_data;
	}

	/**
	 * Return the gallery attachment IDs for a variation (admin context).
	 *
	 * @param WP_Post $variation Variation post object.
	 * @return array<int>
	 */
	private function get_attachments( $variation ) {
		$variation_obj = wc_get_product( $variation->ID );

		if ( $variation_obj instanceof \WC_Product_Variation ) {
			return array_values( array_filter( array_map( 'intval', $variation_obj->get_gallery_image_ids() ) ) );
		}

		$images_data = get_post_meta( $variation->ID, 'wd_additional_variation_images_data', true );
		return $images_data ? array_filter( explode( ',', $images_data ) ) : array();
	}

	/**
	 * Render the variation gallery admin UI within the WooCommerce variation form.
	 *
	 * @param int     $loop           Index of the current variation in the loop.
	 * @param array   $variation_data Variation meta data array.
	 * @param WP_Post $variation      Variation post object.
	 * @return void
	 */
	public function admin_html( $loop, $variation_data, $variation ) {
		if ( ! woodmart_get_opt( 'variation_gallery' ) ) {
			return;
		}

		if ( Main::wc_native_gallery_enabled() ) {
			return;
		}

		?>
		<div class="woodmart-variation-gallery-wrapper">
			<h4>
				<?php esc_html_e( 'Variation Image Gallery', 'woodmart' ); ?>
			</h4>

			<ul class="woodmart-variation-gallery-images">
				<?php foreach ( $this->get_attachments_data( $variation ) as $attachment ) : ?>
					<li class="image" data-attachment_id="<?php echo esc_attr( $attachment['id'] ); ?>">
						<img src="<?php echo esc_attr( $attachment['url'][0] ); ?>"
							width="<?php echo esc_attr( $attachment['url'][1] ); ?>"
							height="<?php echo esc_attr( $attachment['url'][2] ); ?>" alt="variation image">

						<a href="#" class="delete woodmart-remove-variation-gallery-image">
							<span class="xts-i-close"></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>

			<input type="hidden" class="variation-gallery-ids"
				name="wd_additional_variation_images[<?php echo esc_attr( $variation->ID ); ?>]"
				value="<?php echo esc_attr( implode( ',', $this->get_attachments( $variation ) ) ); ?>">

			<a href="#" class="button woodmart-add-variation-gallery-image">
				<?php esc_html_e( 'Add image', 'woodmart' ); ?>
			</a>
		</div>
		<?php
	}

	/**
	 * Append variation gallery image data to the JS variation object.
	 *
	 * @param array                $available_variation Available variation data array.
	 * @param WC_Product_Variable  $variation_object    Variable product object (unused – required by filter signature).
	 * @param WC_Product_Variation $variation           Variation object.
	 * @return array Modified variation data.
	 */
	public function update_available_variation( $available_variation, $variation_object, $variation ) {
		if ( ! woodmart_get_opt( 'variation_gallery' ) ) {
			return $available_variation;
		}

		$product_id          = $variation->get_parent_id();
		$default_images_data = $this->get_default_data( $product_id );
		$variation_id        = $available_variation['variation_id'];

		$ids = $variation->get_gallery_image_ids();

		if ( has_post_thumbnail( $variation_id ) ) {
			$available_variation['additional_variation_images'][] = $this->get_image_data( get_post_thumbnail_id( $variation_id ), true );
		}

		foreach ( $ids as $id ) {
			$available_variation['additional_variation_images'][] = $this->get_image_data( $id );
		}

		if ( $default_images_data ) {
			$available_variation['additional_variation_images_default'] = $default_images_data;
		}

		return $available_variation;
	}

	/**
	 * Build the default product gallery image data array for JS variation fallback.
	 *
	 * @param int $product_id Parent product post ID.
	 * @return array<array<string, mixed>>|string Image data arrays, or empty string when product not found.
	 */
	private function get_default_data( $product_id ) {
		$product = wc_get_product( $product_id );

		if ( ! $product ) {
			return '';
		}

		$default_image_ids = $product->get_gallery_image_ids();
		$images            = array();

		if ( has_post_thumbnail( $product_id ) ) {
			$images[] = $this->get_image_data( get_post_thumbnail_id( $product_id ), true );
		}

		if ( $default_image_ids && is_array( $default_image_ids ) ) {
			foreach ( $default_image_ids as $id ) {
				$images[] = $this->get_image_data( $id );
			}
		}

		return $images;
	}

	/**
	 * Build the image data array for a single attachment used in variation gallery JS.
	 *
	 * @param int  $attachment_id Attachment post ID.
	 * @param bool $main_image    Whether this is the main product image (adds wp-post-image class).
	 * @return array<string, mixed> Image data array, or empty array when attachment is invalid.
	 */
	public function get_image_data( $attachment_id, $main_image = false ) {
		woodmart_lazy_loading_deinit( true );

		$gallery_thumbnail = wc_get_image_size( 'gallery_thumbnail' );
		$thumbnail_size    = apply_filters(
			'woocommerce_gallery_thumbnail_size',
			array(
				$gallery_thumbnail['width'],
				$gallery_thumbnail['height'],
			)
		);
		$image_size        = 'woocommerce_single';
		$full_size         = apply_filters( 'woocommerce_gallery_full_size', apply_filters( 'woocommerce_product_thumbnails_large_size', 'full' ) );
		$thumbnail_src     = wp_get_attachment_image_src( $attachment_id, $thumbnail_size );
		$full_src          = wp_get_attachment_image_src( $attachment_id, $full_size );
		$image_src         = wp_get_attachment_image_src( $attachment_id, $image_size );
		$class             = esc_attr( $main_image ? 'wp-post-image' : '' );

		if ( ! is_array( $image_src ) ) {
			return array();
		}

		$output = array(
			'width'                   => isset( $image_src[1] ) ? $image_src[1] : '',
			'height'                  => isset( $image_src[2] ) ? $image_src[2] : '',
			'src'                     => isset( $image_src[0] ) ? $image_src[0] : '',
			'full_src'                => isset( $full_src[0] ) ? $full_src[0] : '',
			'thumbnail_src'           => isset( $thumbnail_src[0] ) ? $thumbnail_src[0] : '',
			'class'                   => apply_filters( 'woodmart_single_product_gallery_image_class', $class ),
			'alt'                     => trim( wp_strip_all_tags( get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ) ),
			'title'                   => _wp_specialchars( get_post_field( 'post_title', $attachment_id ), ENT_QUOTES, 'UTF-8', true ),
			'data_caption'            => _wp_specialchars( get_post_field( 'post_excerpt', $attachment_id ), ENT_QUOTES, 'UTF-8', true ),
			'data_src'                => isset( $full_src[0] ) ? esc_url( $full_src[0] ) : '',
			'data_large_image'        => isset( $full_src[0] ) ? esc_url( $full_src[0] ) : '',
			'data_large_image_width'  => isset( $full_src[1] ) ? esc_attr( $full_src[1] ) : '',
			'data_large_image_height' => isset( $full_src[2] ) ? esc_attr( $full_src[2] ) : '',
		);

		$image_meta = wp_get_attachment_metadata( $attachment_id );

		if ( is_array( $image_meta ) ) {
			$size_array = array( absint( $image_src[1] ), absint( $image_src[2] ) );
			$srcset     = wp_calculate_image_srcset( $size_array, $image_src[0], $image_meta, $attachment_id );
			$sizes      = wp_calculate_image_sizes( $size_array, $image_src[0], $image_meta, $attachment_id );

			if ( $srcset && ( $sizes || ! empty( $attr['sizes'] ) ) ) {
				$output['srcset'] = $srcset;

				if ( empty( $attr['sizes'] ) ) {
					$output['sizes'] = $sizes;
				}
			}
		}

		woodmart_lazy_loading_init();

		return apply_filters( 'woodmart_get_single_product_image_data', $output, $attachment_id, $main_image );
	}
}

new Storage_New();
