<?php
/**
 * Gutenberg post CSS class.
 *
 * @package woodmart
 */

namespace XTS\Gutenberg;

use WP_Query;
use XTS\Singleton;

/**
 * Post CSS module.
 *
 * @package woodmart
 */
class Template_Library extends Singleton {

	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'wp_ajax_woodmart_get_template', array( $this, 'get_template' ) );
	}

	/**
	 * Get template.
	 *
	 * @return void
	 */
	public function get_template() {
		if ( ! isset( $_GET['template_id'] ) || ! current_user_can( 'edit_posts' ) ) { // phpcs:ignore
			return;
		}

		$template_id = sanitize_text_field( $_GET['template_id'] ); // phpcs:ignore

		wp_send_json( $this->fetch_and_localize_template( $template_id ) );
	}

	/**
	 * Fetch one template's raw Gutenberg markup from the demo server, without
	 * localizing any images it references. Fast/cheap: a single HTTP request,
	 * no media library writes. Used where the caller cannot afford the
	 * (potentially slow, multi-image) synchronous sideload — e.g. the
	 * woodmart/gutenberg-get-template AI ability, which defers image
	 * localization to finalize time instead (see
	 * XTS\AI_Abilities\Gutenberg\localize_item_remote_images()).
	 *
	 * @param int|string $template_id Remote template id.
	 * @return array{success:bool, template?:string, message?:string|\WP_Error}
	 */
	public function fetch_template_markup( $template_id ) {
		$response = wp_remote_get( WOODMART_BASE_URL . '?woodmart_action=woodmart_get_template&id=' . $template_id );

		if ( is_wp_error( $response ) || ! is_array( $response ) ) {
			return array(
				'success' => false,
				'message' => $response,
			);
		}

		$data = json_decode( $response['body'], true );

		if ( is_object( $data ) && property_exists( $data, 'error' ) ) {
			return array(
				'success' => false,
				'message' => $data->error->message,
			);
		}

		if ( empty( $data['element']['gutenberg_content'] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'No template found', 'woodmart' ),
			);
		}

		return array(
			'success'  => true,
			'template' => $data['element']['gutenberg_content'],
		);
	}

	/**
	 * Fetch one template's Gutenberg markup from the demo server and localize its
	 * images (sideloaded into the media library, URLs/ids rewritten).
	 *
	 * Used by the wp_ajax_woodmart_get_template handler (human-facing Template
	 * Library UI, where a synchronous multi-image sideload is acceptable).
	 *
	 * @param int|string $template_id Remote template id.
	 * @return array{success:bool, template?:string, message?:string|\WP_Error}
	 */
	public function fetch_and_localize_template( $template_id ) {
		$result = $this->fetch_template_markup( $template_id );
		if ( empty( $result['success'] ) ) {
			return $result;
		}

		$template = $result['template'];
		$matches  = array();

		preg_match_all( '/id":\s*(\d+),\s*"url":"(https?:\/\/[^\"]+)"/', $template, $matches );

		if ( ! empty( $matches[1] ) && ! empty( $matches[2] ) ) {
			foreach ( $matches[1] as $key => $attachment_id ) {
				$attachment_url = $matches[2][ $key ];
				$attachment_id  = $matches[1][ $key ];

				$attachment_id_new = $this->get_image( $attachment_url );

				if ( is_wp_error( $attachment_id_new ) ) {
					return array(
						'success' => false,
						'message' => $attachment_id_new->get_error_message(),
					);
				}

				$attachment_url_new = wp_get_attachment_url( $attachment_id_new );

				$template = str_replace( $attachment_url, $attachment_url_new, $template );
				$template = str_replace( '"id":' . $attachment_id, '"id":' . $attachment_id_new, $template );
				$template = str_replace( 'wp-image-' . $attachment_id, 'wp-image-' . $attachment_id_new, $template );
			}
		}

		return array(
			'success'  => true,
			'template' => $template,
		);
	}

	/**
	 * Get imported image.
	 *
	 * Public so callers that localize images outside the eager
	 * fetch_and_localize_template() path (e.g.
	 * XTS\AI_Abilities\Gutenberg\TemplateLibrary\localize_remote_images())
	 * can reuse the same existing-attachment lookup / sideload logic.
	 *
	 * @param string $url Image URL.
	 * @return int|\WP_Error
	 */
	public function get_image( $url ) {
		$get_attachment = new WP_Query(
			array(
				'posts_per_page' => 1,
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'meta_query'     => array(
					array(
						'key'     => '_wp_attached_file',
						'value'   => pathinfo( wp_basename( $url ), PATHINFO_FILENAME ),
						'compare' => 'LIKE',
					),
				),
			)
		);

		if ( isset( $get_attachment->posts, $get_attachment->posts[0] ) ) {
			$id = $get_attachment->posts[0]->ID;
		} else {
			// media_sideload_image() (and the download_url()/image processing it calls)
			// lives in wp-admin/includes/*, which admin-ajax.php loads automatically but
			// the REST API does not. This method is now also called from a REST context
			// (finalize-time image localization, see
			// XTS\AI_Abilities\Gutenberg\localize_item_remote_images()), so load them
			// explicitly rather than relying on the caller's request type.
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/media.php';
			require_once ABSPATH . 'wp-admin/includes/image.php';

			add_filter( 'image_sideload_extensions', array( $this, 'allowed_image_sideload_extensions' ) );

			$id = media_sideload_image( $url, 0, '', 'id' );

			if ( ! is_wp_error( $id ) ) {
				$metadata = wp_get_attachment_metadata( $id );

				if ( empty( $metadata ) ) {
					require_once ABSPATH . 'wp-admin/includes/image.php';

					$metadata = wp_generate_attachment_metadata( $id, get_attached_file( $id ) );

					if ( ! empty( $metadata ) ) {
						wp_update_attachment_metadata( $id, $metadata );
					}
				}
			}

			remove_filter( 'image_sideload_extensions', array( $this, 'allowed_image_sideload_extensions' ) );
		}

		return $id;
	}

	/**
	 * Allow image sideload extensions.
	 *
	 * @param array $allowed_extensions Allowed extensions.
	 * @return array
	 */
	public function allowed_image_sideload_extensions( $allowed_extensions ) {
		$allowed_extensions[] = 'svg';

		return $allowed_extensions;
	}
}

Template_Library::get_instance();
