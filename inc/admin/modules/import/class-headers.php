<?php
/**
 * Import headers.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Import;

use Exception;
use XTS\Modules\Header_Builder;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import headers.
 */
class Headers {
	/**
	 * Version name.
	 *
	 * @var string
	 */
	private $version;
	/**
	 * Helpers.
	 *
	 * @var Helpers
	 */
	private $helpers;

	/**
	 * Constructor.
	 *
	 * @param string $version Version name.
	 */
	public function __construct( $version ) {
		$this->helpers = Helpers::get_instance();
		$this->version = $version;

		$this->import_headers();
	}

	/**
	 * Import headers.
	 */
	private function import_headers() {
		try {
			for ( $i = 1; $i <= 5; $i++ ) {
				$header = $this->helpers->get_file_path( 'header-' . $i . '.json', $this->version );

				if ( 'elementor' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'header-' . $i . '-elementor.json' ) ) {
					$header = $this->helpers->get_file_path( 'header-' . $i . '-elementor.json', $this->version );
				} elseif ( 'gutenberg' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'header-' . $i . '-gutenberg.json' ) ) {
					$header = $this->helpers->get_file_path( 'header-' . $i . '-gutenberg.json', $this->version );
				}

				if ( $header ) {
					$this->create_new_header( $header, 1 === $i );
				}
			}
		} catch ( Exception $e ) {
			echo esc_html( '[ERROR] Header import<br>' );
		}
	}

	/**
	 * Create new header.
	 *
	 * @param string $file       File.
	 * @param bool   $is_default Default header.
	 */
	private function create_new_header( $file, $is_default = false ) {
		$builder       = Header_Builder::get_instance();
		$imported_data = get_option( 'wd_imported_data_' . $this->version );

		$header_data = $this->helpers->links_replace( $this->helpers->get_local_file_content( $file ), '/', $this->version );
		$header_data = $this->update_posts_id( $header_data );

		$header_data = json_decode( $header_data, true );

		$builder->list->add_header( $header_data['id'], $header_data['name'] );
		$builder->factory->create_new( $header_data['id'], $header_data['name'], $header_data['structure'], $header_data['settings'] );

		$imported_data['headers'][ $header_data['id'] ] = $header_data['id'];

		update_option( 'wd_imported_data_' . $this->version, $imported_data, false );

		if ( $is_default ) {
			update_option( 'whb_main_header', $header_data['id'] );
		}
	}

	/**
	 * Update html block id in header.
	 *
	 * @param string $header_data Header data.
	 *
	 * @return string
	 */
	private function update_posts_id( $header_data ) {
		$header_data_decoded = json_decode( $header_data, true );
		$imported_data       = $this->helpers->get_imported_data( $this->version );

		foreach ( $header_data_decoded['structure']['content'] as $row_idx => $row ) {
			$this->replace_attachment_in_bg( $header_data_decoded['structure']['content'][ $row_idx ]['params']['background']['value'], $imported_data );

			foreach ( $row['content'] as $col_idx => $column ) {
				if ( ! empty( $column['params']['background']['value'] ) ) {
					$this->replace_attachment_in_bg( $header_data_decoded['structure']['content'][ $row_idx ]['content'][ $col_idx ]['params']['background']['value'], $imported_data );
				}

				foreach ( $column['content'] as $el_idx => $element ) {
					if ( 'HTMLBlock' === $element['type'] ) {
						$current_id = $element['params']['block_id']['value'];

						if ( isset( $imported_data['all_posts'][ $current_id ]['new'] ) ) {
							$header_data_decoded['structure']['content'][ $row_idx ]['content'][ $col_idx ]['content'][ $el_idx ]['params']['block_id']['value'] = $imported_data['all_posts'][ $current_id ]['new'];
						}
					}

					foreach ( $element['params'] as $param_key => $param ) {
						if ( 'image' === $param['type'] && ! empty( $param['value']['id'] ) ) {
							$current_id = $param['value']['id'];

							if ( isset( $imported_data['all_posts'][ $current_id ]['new'] ) ) {
								$new_id = $imported_data['all_posts'][ $current_id ]['new'];
								$header_data_decoded['structure']['content'][ $row_idx ]['content'][ $col_idx ]['content'][ $el_idx ]['params'][ $param_key ]['value']['id']  = $new_id;
								$header_data_decoded['structure']['content'][ $row_idx ]['content'][ $col_idx ]['content'][ $el_idx ]['params'][ $param_key ]['value']['url'] = wp_get_attachment_url( $new_id );
							}
						}
					}
				}
			}
		}

		return wp_json_encode( $header_data_decoded );
	}

	/**
	 * Replace attachment id and url inside a background value array.
	 *
	 * @param mixed $bg_value    Reference to the background value.
	 * @param array $imported_data Imported data map.
	 */
	private function replace_attachment_in_bg( &$bg_value, $imported_data ) {
		if ( ! is_array( $bg_value ) || empty( $bg_value['background-image']['id'] ) ) {
			return;
		}

		$current_id = $bg_value['background-image']['id'];

		if ( isset( $imported_data['all_posts'][ $current_id ]['new'] ) ) {
			$new_id = $imported_data['all_posts'][ $current_id ]['new'];

			$bg_value['background-image']['id']  = $new_id;
			$bg_value['background-image']['url'] = wp_get_attachment_url( $new_id );
		}
	}
}
