<?php
/**
 * Import XML.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Import;

use Elementor\Plugin;
use Exception;
use WOODMART_CORE\Importer\Import;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import XML.
 */
class XML {
	/**
	 * Version name.
	 *
	 * @var string
	 */
	private $version;
	/**
	 * Version type.
	 *
	 * @var string
	 */
	private $version_type;
	/**
	 * File type.
	 *
	 * @var string
	 */
	private $type;
	/**
	 * Imported data.
	 *
	 * @var array
	 */
	private $imported_data;
	/**
	 * Helpers.
	 *
	 * @var Helpers
	 */
	private $helpers;

	/**
	 * File name.
	 *
	 * @var string
	 */
	private $file;

	/**
	 * Constructor.
	 *
	 * @param string $version Version name.
	 * @param string $type    File type.
	 * @param string $file_path File path.
	 */
	public function __construct( $version = '', $type = '', $file_path = '' ) {
		if ( ! $version || ! $type ) {
			return;
		}

		$this->helpers      = Helpers::get_instance();
		$this->version      = $version;
		$this->type         = $type;
		$this->version_type = ! empty( $_REQUEST['type'] ) ? sanitize_key( $_REQUEST['type'] ) : 'version'; // phpcs:ignore
		$this->file         = $file_path ? $file_path : $this->helpers->get_file_path( $this->get_file_name(), $this->version );

		if ( ! defined( 'WP_IMPORTING' ) ) {
			define( 'WP_IMPORTING', true ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
		}

		$this->import_xml();

		$this->imported_data = $this->helpers->get_imported_data( $version );

		$this->term_replace();
		$this->post_meta_replace();

		if ( 'elementor' === $this->helpers->get_page_builder() ) {
			$this->elementor_post_content_replace();
			$this->elementor_page_settings_replace();
		} elseif ( 'gutenberg' === $this->helpers->get_page_builder() ) {
			$this->gutenberg_post_content_replace();
		} else {
			$this->wpb_post_content_replace();
		}
	}

	/**
	 * Get file name.
	 */
	private function get_file_name() {
		$file_name = 'content';

		if ( 'elementor' === $this->helpers->get_page_builder() ) {
			$file_name .= '-elementor';
		} elseif ( 'gutenberg' === $this->helpers->get_page_builder() ) {
			$file_name .= '-gutenberg';
		}

		if ( 'posts' !== $this->type ) {
			$file_name .= '-' . $this->type;
		}

		$file_name .= '.xml';

		return $file_name;
	}

	/**
	 * Import XML.
	 */
	private function import_xml() {
		ob_start(); // Don`t remove this line, it`s needed for correct import process.

		if ( ! function_exists( 'woodmart_get_importer' ) ) {
			echo esc_html( '[ERROR] Importer not exists<br>' );

			return;
		}

		$importer = woodmart_get_importer();

		if ( ! $this->file ) {
			return;
		}

		try {
			add_filter( 'wp_revisions_to_keep', '__return_zero' );
			add_filter(
				'intermediate_image_sizes',
				function () {
					return array();
				}
			);

			$importer->fetch_attachments = true;

			add_filter( 'wp_import_post_data_raw', array( $this, 'process_woocommerce_page' ) );
			add_filter( 'wp_import_existing_post', array( $this, 'bypass_post_exists' ), 10, 2 );
			add_filter( 'wp_import_post_data_processed', array( $this, 'clear_import_id_for_trashed' ), 10, 2 );
			add_filter( 'woodmart_import_menu_item_missing_taxonomy', array( $this, 'get_fallback_term_id' ), 10, 2 );
			add_filter( 'woodmart_import_menu_item_missing_post_type', array( $this, 'get_fallback_post_id' ), 10, 2 );

			$importer->import( $this->file, $this->version );

			remove_filter( 'wp_import_post_data_raw', array( $this, 'process_woocommerce_page' ) );
			remove_filter( 'wp_import_existing_post', array( $this, 'bypass_post_exists' ) );
			remove_filter( 'wp_import_post_data_processed', array( $this, 'clear_import_id_for_trashed' ) );
		} catch ( Exception $e ) {
			echo esc_html( '[ERROR] XML import<br>' );
		}

		ob_get_clean(); // Don`t remove this line, it`s needed for correct import process.
	}

	/**
	 * Term replace.
	 */
	private function term_replace() {
		$term_meta_key_list = array(
			'thumbnail_id',
			'category_icon_alt',
			'category_icon',
			'title_image',
			'image',
		);

		if ( ! empty( $this->imported_data['term'] ) ) {
			foreach ( $this->imported_data['term'] as $terms ) {
				foreach ( $terms as $term ) {
					if ( $this->is_replaced( $term['new'], 'term_meta' ) ) {
						continue;
					}

					foreach ( $term_meta_key_list as $meta_key ) {
						$flag      = false;
						$term_meta = get_term_meta( $term['new'], $meta_key, true );

						if ( ! $term_meta ) {
							continue;
						}

						if ( is_numeric( $term_meta ) ) {
							if ( ! isset( $this->imported_data['attachment'][ $term_meta ] ) ) {
								continue;
							}

							$flag      = true;
							$term_meta = $this->imported_data['attachment'][ $term_meta ]['new'];
						} elseif ( is_array( $term_meta ) && ! empty( $term_meta['id'] ) ) {
							if ( ! isset( $this->imported_data['attachment'][ $term_meta['id'] ] ) ) {
								continue;
							}

							$flag      = true;
							$term_meta = array(
								'url' => wp_get_attachment_image_url( $this->imported_data['attachment'][ $term_meta['id'] ]['new'], 'full' ),
								'id'  => $this->imported_data['attachment'][ $term_meta['id'] ]['new'],
							);
						}

						if ( $flag ) {
							$this->add_to_replaced( $term['new'], 'term_meta' );
							update_term_meta( $term['new'], $meta_key, $term_meta );
						}
					}
				}
			}
		}
	}

	/**
	 * Post meta replace.
	 */
	private function post_meta_replace() {
		$post_meta_key_list = array(
			'_woodmart_title_image',
			'_thumbnail_id',
			'bg_image_desktop',
			'bg_image_tablet',
			'bg_image_mobile',
			'_menu_item_block',
			'woodmart_sguide_select',
			'wd_layout_conditions',
			'wd_backgroundImage',
			'wd_backgroundImageTablet',
			'wd_backgroundImageMobile',
			'background',
			'background_tablet',
			'background_mobile',
			'background_image',
			'image',
			'woodmart_wc_video_gallery',
		);
		if ( ! empty( $this->imported_data['all_posts'] ) ) {
			foreach ( $this->imported_data['all_posts'] as $value ) {
				$data = (array) $this->imported_data['all_posts'];

				if ( $this->is_replaced( $value['new'], 'post_meta' ) ) {
					continue;
				}

				foreach ( $post_meta_key_list as $meta_key ) {
					$post_meta = get_post_meta( $value['new'], $meta_key, true );

					if ( ! $post_meta ) {
						continue;
					}

					$flag = false;

					if ( is_string( $post_meta ) && strpos( $post_meta, ',' ) ) {
						$output = array();
						$ids    = explode( ',', $post_meta );

						foreach ( $ids as $id ) {
							if ( ! isset( $data[ $id ] ) ) {
								continue;
							}

							$output[] = $data[ $id ]['new'];
						}

						$flag      = true;
						$post_meta = implode( ',', $output );
					} elseif ( 'woodmart_sguide_select' === $meta_key && is_numeric( $post_meta ) ) {
						if ( ! isset( $this->imported_data['term']['product_cat'][ $post_meta ] ) ) {
							continue;
						}

						$flag      = true;
						$post_meta = $this->imported_data['term']['product_cat'][ $post_meta ]['new'];
					} elseif ( is_numeric( $post_meta ) ) {
						if ( ! isset( $data[ $post_meta ] ) ) {
							continue;
						}

						$flag      = true;
						$post_meta = $data[ $post_meta ]['new'];
					} elseif ( is_array( $post_meta ) && ! empty( $post_meta['id'] ) ) {
						if ( ! isset( $this->imported_data['attachment'][ $post_meta['id'] ] ) ) {
							continue;
						}

						$flag             = true;
						$post_meta['id']  = $this->imported_data['attachment'][ $post_meta['id'] ]['new'];
						$post_meta['url'] = wp_get_attachment_image_url( $post_meta['id'], 'full' );
					} elseif ( 'wd_layout_conditions' === $meta_key && is_array( $post_meta ) ) {
						foreach ( $post_meta as $key => $condition ) {
							if ( ! isset( $this->imported_data['term']['product_cat'][ $condition['condition_query'] ] ) ) {
								continue;
							}

							$flag = true;

							$post_meta[ $key ]['condition_query'] = $this->imported_data['term']['product_cat'][ $condition['condition_query'] ]['new'];
						}
					} elseif ( 'woodmart_wc_video_gallery' === $meta_key && is_array( $post_meta ) ) {
						foreach ( $post_meta as $img_id => $img_data ) {
							if ( isset( $this->imported_data['attachment'][ $img_id ] ) && $this->imported_data['attachment'][ $img_id ]['new'] !== $this->imported_data['attachment'][ $img_id ]['old'] ) {
								$post_meta[ $this->imported_data['attachment'][ $img_id ]['new'] ] = $img_data;
								unset( $post_meta[ $img_id ] );
								$img_id = $this->imported_data['attachment'][ $img_id ]['new'];
							}

							if ( ! isset( $img_data['upload_video_id'] ) || ! isset( $this->imported_data['attachment'][ $img_data['upload_video_id'] ] ) ) {
								continue;
							}

							$flag = true;

							$post_meta[ $img_id ]['upload_video_id']  = $this->imported_data['attachment'][ $img_data['upload_video_id'] ]['new'];
							$post_meta[ $img_id ]['upload_video_url'] = wp_get_attachment_url( $img_data['upload_video_id'] );
						}
					}

					if ( $flag ) {
						$this->add_to_replaced( $value['new'], 'post_meta' );
						update_post_meta( $value['new'], $meta_key, $post_meta );
					}
				}

				if ( woodmart_is_import_demo_content() && ( 'product_loop_item' === get_post_meta( $value['new'], 'wd_layout_type', true ) || get_post_type( $value['new'] ) === 'wd_custom_label' ) ) {
					wp_update_post(
						array(
							'ID'            => $value['new'],
							'post_modified' => current_time( 'mysql' ),
						)
					);
				}
			}
		}
	}

	/**
	 * Update Elementor page settings URLs to local base.
	 *
	 * @since 1.0.0
	 */
	private function elementor_page_settings_replace() {
		if ( empty( $this->imported_data['all_posts'] ) ) {
			return;
		}

		$image_keys = array(
			'wd_fb_background_image',
			'wd_bg_image',
			'wd_image',
			'background_image',
			'wd__woodmart_title_image',
		);

		foreach ( $this->imported_data['all_posts'] as $imported_post ) {
			$post_id  = $imported_post['new'];
			$settings = get_post_meta( $post_id, '_elementor_page_settings', true );

			if ( ! $settings || ! is_array( $settings ) ) {
				continue;
			}

			if ( ! str_contains( maybe_serialize( $settings ), 'dummy.xtemos.com' ) ) {
				continue;
			}

			$flag = false;

			foreach ( $image_keys as $key ) {
				if ( ! empty( $settings[ $key ]['id'] ) && ! empty( $this->imported_data['attachment'][ $settings[ $key ]['id'] ] ) ) {
					$new_id = $this->imported_data['attachment'][ $settings[ $key ]['id'] ]['new'];

					$settings[ $key ]['id']  = $new_id;
					$settings[ $key ]['url'] = wp_get_attachment_image_url( $new_id, 'full' );
					$flag                    = true;
				}
			}

			if ( $flag ) {
				update_post_meta( $post_id, '_elementor_page_settings', $settings );
			}
		}
	}

	/**
	 * Post content replace.
	 */
	private function gutenberg_post_content_replace() {
		if ( ! empty( $this->imported_data['all_posts'] ) ) {
			foreach ( $this->imported_data['all_posts'] as $value ) {
				if ( isset( $value['type'] ) || $this->is_replaced( $value['new'], 'post_content' ) ) {
					continue;
				}

				$wd_post = get_post( $value['new'] );

				if ( ! $wd_post || ( is_object( $wd_post ) && ! property_exists( $wd_post, 'post_content' ) ) || empty( $wd_post->post_content ) ) {
					continue;
				}

				$wd_post_content = $wd_post->post_content;

				// Terms replace.
				$terms_data = array();

				if ( isset( $this->imported_data['term'] ) ) {
					foreach ( $this->imported_data['term'] as $terms ) {
						foreach ( $terms as $key => $term ) {
							$terms_data[ $key ] = $term;
						}
					}
				}

				$wd_post_content = $this->gutenberg_post_content_replace_process(
					$terms_data,
					$wd_post_content,
					$value['new'],
					array(
						'/"ids":"([^"]*)"/i',
						'/"tagsIds":"([^"]*)"/i',
						'/"categoriesIds":"([^"]*)"/i',
						'/"nav_menu":"([^"]*)"/i',
						'/&quot;ids&quot;:&quot;([^&]*)&quot;/i',
						'/&quot;tagsIds&quot;:&quot;([^&]*)&quot;/i',
						'/&quot;categoriesIds&quot;:&quot;([^&]*)&quot;/i',
						'/&quot;taxonomies&quot;:&quot;([^&]*)&quot;/i',
					),
					$this->should_remove_unmatched()
				);

				// Post and attachment replace.
				$wd_post_content = $this->gutenberg_post_content_replace_process(
					$this->imported_data['all_posts'],
					$wd_post_content,
					$value['new'],
					array(
						'/"id":([^"]*),/i',
						'/"include":"([^"]*)"/i',
						'/"form_id":"([^"]*)"/i',
						'/"productId":"([^"]*)"/i',
						'/"sidebar_id":"([^"]*)"/i',
						'/wp-image-(\d+)/i',
					),
					$this->should_remove_unmatched()
				);

				$wd_post_content = str_replace( '{/{', '', $wd_post_content );
				$wd_post_content = str_replace( '}/}', '', $wd_post_content );

				$wd_post_content = preg_replace_callback(
					'/<!-- wp:wd\/countdown-timer\s+({.*?"date":"[^"]+.*?})\s+-->(.*?)<!-- \/wp:wd\/countdown-timer -->/s',
					function ( $matches ) {
						$block_data = json_decode( $matches[1], true );
						if ( isset( $block_data['date'] ) ) {
							$block_data['date'] = ( gmdate( 'Y' ) + 1 ) . '/01/01';
						}
						$updated_json = wp_json_encode( $block_data, JSON_UNESCAPED_SLASHES );

						$html_content         = $matches[2];
						$updated_html_content = preg_replace(
							'/data-end-date="[^"]+"/',
							'data-end-date="' . ( gmdate( 'Y' ) + 1 ) . '/01/01"',
							$html_content
						);

						return '<!-- wp:wd/countdown-timer ' . $updated_json . ' -->' . $updated_html_content . '<!-- /wp:wd/countdown-timer -->';
					},
					$wd_post_content
				);

				$wd_post_content = $this->replace_url_in_content( $wd_post_content );

				wp_update_post(
					array(
						'ID'           => $value['new'],
						'post_content' => wp_slash( $wd_post_content ),
					)
				);
			}
		}
	}

	/**
	 * Post content replace.
	 *
	 * @param array   $post_data        Data.
	 * @param string  $wd_post_content  Content.
	 * @param integer $post_id          Post id.
	 * @param array   $attrs            Attributes to replace.
	 * @param bool    $remove_unmatched Whether to clear IDs that have no match in $post_data (page import).
	 *
	 * @return array|mixed|string|string[]
	 */
	private function gutenberg_post_content_replace_process( $post_data, $wd_post_content, $post_id, $attrs, $remove_unmatched = false ) {
		foreach ( $attrs as $attr ) {
			$array = array();
			preg_match_all( $attr, $wd_post_content, $array );

			if ( empty( $array[1] ) ) {
				continue;
			}

			foreach ( $array[1] as $found_value_key => $found_value ) {
				$replaced_value = $found_value;
				$diff           = array();
				$flag           = false;

				if ( strpos( $found_value, 'sidebar' ) ) {
					foreach ( $post_data as $data ) {
						if ( 'sidebar-' . $data['old'] === $found_value ) {
							$replaced_value       = '{/{sidebar-' . $data['new'] . '}/}';
							$diff[ $data['old'] ] = $data['new'];
							$flag                 = true;
							break;
						}
					}
					if ( $remove_unmatched && ! $flag ) {
						$replaced_value = '0';
						$flag           = true;
					}
				} elseif ( strpos( $found_value, ',' ) ) {
					$ids = explode( ',', $found_value );
					foreach ( $ids as $key => $id ) {
						$matched = false;
						foreach ( $post_data as $data ) {
							if ( (int) $data['old'] === (int) $id ) {
								$ids[ $key ]          = '{/{' . $data['new'] . '}/}';
								$diff[ $data['old'] ] = $data['new'];
								$flag                 = true;
								$matched              = true;
								break;
							}
						}
						if ( $remove_unmatched && ! $matched && is_numeric( $id ) ) {
							unset( $ids[ $key ] );
							$flag = true;
						}
					}
					$replaced_value = implode( ',', $ids );
				} else {
					foreach ( $post_data as $data ) {
						if ( (int) $data['old'] === (int) $found_value ) {
							$replaced_value       = '{/{' . $data['new'] . '}/}';
							$diff[ $data['old'] ] = $data['new'];
							$flag                 = true;
							break;
						}
					}
					if ( $remove_unmatched && ! $flag && is_numeric( $found_value ) && (int) $found_value > 0 ) {
						$replaced_value = '0';
						$flag           = true;
					}
				}

				if ( $flag ) {
					if ( ! empty( $diff ) ) {
						$this->add_to_replaced( $post_id, 'post_content', $diff );
					}
					$old_value       = $array[0][ $found_value_key ];
					$new_value       = str_replace( $found_value, $replaced_value, $old_value );
					$wd_post_content = str_replace( $old_value, $new_value, $wd_post_content );
				}
			}
		}

		return $wd_post_content;
	}

	/**
	 * Post content replace.
	 */
	private function wpb_post_content_replace() {
		if ( ! empty( $this->imported_data['all_posts'] ) ) {
			foreach ( $this->imported_data['all_posts'] as $value ) {
				if ( isset( $value['type'] ) ) {
					continue;
				}

				$wd_post = get_post( $value['new'] );

				if ( ! $wd_post || ( is_object( $wd_post ) && ! property_exists( $wd_post, 'post_content' ) ) ) {
					continue;
				}

				$wd_post_content = $wd_post->post_content;

				// Terms replace.
				$terms_data = array();

				if ( isset( $this->imported_data['term'] ) ) {
					foreach ( $this->imported_data['term'] as $terms ) {
						foreach ( $terms as $key => $term ) {
							$terms_data[ $key ] = $term;
						}
					}
				}

				$wd_post_content = $this->wpb_post_content_replace_process(
					$terms_data,
					$wd_post_content,
					$value['new'],
					array(
						'/ids="([^"]*)"/i',
						'/taxonomies="([^"]*)"/i',
						'/categories="([^"]*)"/i',
					),
					$this->should_remove_unmatched()
				);

				// Post and attachment replace.
				$wd_post_content = $this->wpb_post_content_replace_process(
					$this->imported_data['all_posts'],
					$wd_post_content,
					$value['new'],
					array(
						'/list="([^"]*)"/i',
						'/images="([^"]*)"/i',
						'/image="([^"]*)"/i',
						'/bg_image_box="([^"]*)"/i',
						'/img_id="([^"]*)"/i',
						'/img="([^"]*)"/i',
						'/icon="([^"]*)"/i',
						'/video="([^"]*)"/i',
						'/video_hosted="([^"]*)"/i',
						'/video_poster="([^"]*)"/i',
						'/video_image_overlay="([^"]*)"/i',
						'/form_id="([^"]*)"/i',
						'/contact-form-7 id="([^"]*)"/i',
						'/html_block id="([^"]*)"/i',
						'/product_id="([^"]*)"/i',
						'/poster_image="([^"]*)"/i',
						'/include="([^"]*)"/i',
						'/sidebar_id="([^"]*)"/i',
						'/html_block_id="([^"]*)"/i',
						'/product_custom_hover="([^"]*)"/i',
						'/wp-image-(\d+)/i',
						'/marquee_contents="([^"]*)"/i',
					),
					$this->should_remove_unmatched()
				);

				$wd_post_content = str_replace( '{/{', '', $wd_post_content );
				$wd_post_content = str_replace( '}/}', '', $wd_post_content );

				$wd_post_content = preg_replace_callback(
					'/\[(woodmart_countdown_timer|promo_banner)([^\]]*?)date="([^"]+)"([^\]]*?)\]/',
					function ( $matches ) {
						return '[' . $matches[1] . $matches[2] . 'date="' . ( gmdate( 'Y' ) + 1 ) . '/01/01"' . $matches[4] . ']';
					},
					$wd_post_content
				);

				$wd_post_content = $this->replace_url_in_content( $wd_post_content );

				if ( has_blocks( $wd_post_content ) ) {
					$wd_post_content = wp_slash( $wd_post_content );
				}

				wp_update_post(
					array(
						'ID'           => $value['new'],
						'post_content' => $wd_post_content,
					)
				);
			}
		}
	}

	/**
	 * Post content replace.
	 *
	 * @param array   $post_data        Data.
	 * @param string  $wd_post_content  Content.
	 * @param integer $post_id          Post id.
	 * @param array   $attrs            Attributes to replace.
	 * @param bool    $remove_unmatched Whether to clear IDs that have no match in $post_data (page import).
	 *
	 * @return array|mixed|string|string[]
	 */
	private function wpb_post_content_replace_process( $post_data, $wd_post_content, $post_id, $attrs, $remove_unmatched = false ) {
		foreach ( $attrs as $attr ) {
			$array = array();
			preg_match_all( $attr, $wd_post_content, $array );

			if ( ! isset( $array[1] ) ) {
				continue;
			}

			foreach ( $array[1] as $found_value_key => $found_value ) {
				$replaced_value = $found_value;
				$diff           = array();
				$flag           = false;

				if ( strpos( $found_value, 'list-content' ) || strpos( $attr, 'marquee_contents' ) ) {
					$data_decoded = json_decode( urldecode( $found_value ), true );
					foreach ( $data_decoded as $key => $list_data ) {
						if ( ! isset( $list_data['image_id'] ) ) {
							continue;
						}
						foreach ( $post_data as $data ) {
							if ( (int) $data['old'] === (int) $list_data['image_id'] ) {
								$data_decoded[ $key ]['image_id'] = $data['new'];
								$diff[ $data['old'] ]             = $data['new'];
								$flag                             = true;
								break;
							}
						}
					}
					$replaced_value = rawurlencode( wp_json_encode( $data_decoded ) );
				} elseif ( strpos( $found_value, 'sidebar' ) ) {
					foreach ( $post_data as $data ) {
						if ( 'sidebar-' . $data['old'] === $found_value ) {
							$replaced_value       = '{/{sidebar-' . $data['new'] . '}/}';
							$diff[ $data['old'] ] = $data['new'];
							$flag                 = true;
							break;
						}
					}
					if ( $remove_unmatched && ! $flag ) {
						$replaced_value = '0';
						$flag           = true;
					}
				} elseif ( strpos( $found_value, ',' ) ) {
					$ids = explode( ',', $found_value );
					foreach ( $ids as $key => $id ) {
						$matched = false;
						foreach ( $post_data as $data ) {
							if ( (int) $data['old'] === (int) $id ) {
								$ids[ $key ]          = '{/{' . $data['new'] . '}/}';
								$diff[ $data['old'] ] = $data['new'];
								$flag                 = true;
								$matched              = true;
								break;
							}
						}
						if ( $remove_unmatched && ! $matched && is_numeric( $id ) ) {
							unset( $ids[ $key ] );
							$flag = true;
						}
					}
					$replaced_value = implode( ',', $ids );
				} else {
					foreach ( $post_data as $data ) {
						if ( (int) $data['old'] === (int) $found_value ) {
							$replaced_value       = '{/{' . $data['new'] . '}/}';
							$diff[ $data['old'] ] = $data['new'];
							$flag                 = true;
							break;
						}
					}
					if ( $remove_unmatched && ! $flag && is_numeric( $found_value ) && (int) $found_value > 0 ) {
						$replaced_value = '0';
						$flag           = true;
					}
				}

				if ( $flag ) {
					if ( ! empty( $diff ) ) {
						$this->add_to_replaced( $post_id, 'post_content', $diff );
					}
					$old_value       = $array[0][ $found_value_key ];
					$new_value       = str_replace( $found_value, $replaced_value, $old_value );
					$wd_post_content = str_replace( $old_value, $new_value, $wd_post_content );
				}
			}
		}

		return $wd_post_content;
	}

	/**
	 * Elementor content replace.
	 */
	private function elementor_post_content_replace() {
		if ( ! woodmart_is_elementor_installed() ) {
			return;
		}

		if ( ! empty( $this->imported_data['all_posts'] ) ) {
			foreach ( $this->imported_data['all_posts'] as $value ) {
				if ( ! isset( $value['type'] ) || 'elementor' !== $value['type'] ) {
					continue;
				}

				$raw_post_meta = get_post_meta( $value['new'], '_elementor_data', true );

				if ( ! $raw_post_meta ) {
					continue;
				}

				if ( is_array( $raw_post_meta ) ) {
					$raw_post_meta = current( $raw_post_meta );
				} elseif ( strpos( $raw_post_meta, '{\"' ) ) {
					$raw_post_meta = wp_unslash( $raw_post_meta );
				}

				$post_meta = json_decode( $raw_post_meta, true );

				if ( ! $post_meta ) {
					continue;
				}

				$imported_data = $this->imported_data;

				$post_meta = Plugin::$instance->db->iterate_data(
					$post_meta,
					function ( $element_data ) use ( $imported_data ) {
						$element = Plugin::$instance->elements_manager->create_element_instance( $element_data );

						if ( is_null( $element ) ) {
							return $element_data;
						}

						$terms_data = array();

						if ( isset( $imported_data['term'] ) ) {
							foreach ( $imported_data['term'] as $terms ) {
								foreach ( $terms as $key => $term ) {
									$terms_data[ $key ] = $term;
								}
							}
						}

						$posts_data = $imported_data['all_posts'];

						$repeater_id_fields     = array( 'content_html_block', 'html_block_id', 'include', 'exclude', 'product_id', 'include_products', 'marquee_contents' );
						$repeater_media_fields  = array( 'video', 'video_poster', 'image', 'image_secondary', 'image_primary' );
						$select_id_fields       = array( 'content', 'form_id', 'product_custom_hover' );
						$autocomplete_id_fields = array( 'include', 'exclude', 'product_id', 'include_products' );
						$remove_unmatched       = $this->should_remove_unmatched();

						foreach ( $element->get_controls() as $control ) {
							if ( ! isset( $element_data['settings'][ $control['name'] ] ) ) {
								continue;
							}

							$settings = $element_data['settings'][ $control['name'] ];

							if ( 'repeater' === $control['type'] ) {
								foreach ( $settings as $key => $value ) {
									if ( empty( $value ) ) {
										continue;
									}

									foreach ( $repeater_id_fields as $field ) {
										if ( ! isset( $value[ $field ] ) ) {
											continue;
										}
										$remove_this_value = $remove_unmatched;
										foreach ( $posts_data as $data ) {
											if ( (int) $value[ $field ] === (int) $data['old'] ) {
												$settings[ $key ][ $field ] = strval( '{/{' . $data['new'] . '}/}' );

												$remove_this_value = false;
												break;
											}
										}

										if ( $remove_this_value ) {
											$settings[ $key ][ $field ] = '';
										}
									}

									foreach ( $repeater_media_fields as $field ) {
										if ( empty( $value[ $field ]['id'] ) ) {
											continue;
										}

										foreach ( $posts_data as $data ) {
											if ( (int) $value[ $field ]['id'] === (int) $data['old'] ) {
												$settings[ $key ][ $field ]['id']  = '{/{' . $data['new'] . '}/}';
												$settings[ $key ][ $field ]['url'] = wp_get_attachment_url( $data['new'] );

												break;
											}
										}
									}
								}
							}

							if ( ( 'select' === $control['type'] || 'select2' === $control['type'] ) && in_array( $control['name'], $select_id_fields, true ) ) {
								if ( ! empty( $settings ) ) {
									$remove_this_value = $remove_unmatched;
									foreach ( $posts_data as $data ) {
										if ( (int) $settings === (int) $data['old'] ) {
											$settings = strval( '{/{' . $data['new'] . '}/}' );

											$remove_this_value = false;
											break;
										}
									}
									if ( $remove_this_value ) {
										$settings = '0';
									}
								}
							}

							if ( 'wd_autocomplete' === $control['type'] && in_array( $control['name'], $autocomplete_id_fields, true ) ) {
								foreach ( $settings as $key => $value ) {
									if ( empty( $value ) ) {
										continue;
									}
									$remove_this_value = $remove_unmatched;
									foreach ( $posts_data as $data ) {
										if ( (int) $value === (int) $data['old'] ) {
											$settings[ $key ] = strval( '{/{' . $data['new'] . '}/}' );

											$remove_this_value = false;
											break;
										}
									}
									if ( $remove_this_value ) {
										unset( $settings[ $key ] );
									}
								}
								$settings = array_values( $settings );
							}

							if ( 'media' === $control['type'] && ! empty( $settings['url'] ) ) {
								foreach ( $posts_data as $data ) {
									if ( (int) $settings['id'] === (int) $data['old'] ) {
										$settings['url'] = wp_get_attachment_url( $data['new'] );
										$settings['id']  = '{/{' . $data['new'] . '}/}';
										break;
									}
								}
							}

							if ( 'gallery' === $control['type'] ) {
								foreach ( $settings as $key => $value ) {
									if ( empty( $value['url'] ) ) {
										continue;
									}
									foreach ( $posts_data as $data ) {
										if ( (int) $value['id'] === (int) $data['old'] ) {
											$settings[ $key ]['url'] = wp_get_attachment_image_url( $data['new'], 'full' );
											$settings[ $key ]['id']  = '{/{' . $data['new'] . '}/}';
											break;
										}
									}
								}
								$settings = array_values( $settings );
							}

							if ( 'date_time' === $control['type'] && 'date' === $control['name'] && $settings ) {
								$settings = ( gmdate( 'Y' ) + 1 ) . '/01/01';
							}

							$element_data['settings'][ $control['name'] ] = $settings;
						}

						$term_repeater_fields     = array( 'taxonomies', 'ids', 'categories' );
						$term_select_fields       = array( 'nav_menu' );
						$term_autocomplete_fields = array( 'taxonomies', 'ids', 'categories' );

						foreach ( $element->get_controls() as $control ) {
							if ( ! isset( $element_data['settings'][ $control['name'] ] ) ) {
								continue;
							}

							$settings = $element_data['settings'][ $control['name'] ];

							if ( 'repeater' === $control['type'] ) {
								foreach ( $settings as $key => $value ) {
									if ( empty( $value ) ) {
										continue;
									}
									foreach ( $term_repeater_fields as $field ) {
										if ( ! isset( $value[ $field ] ) ) {
											continue;
										}
										$remove_this_value = $remove_unmatched;
										foreach ( $terms_data as $data ) {
											if ( (int) $value[ $field ] === (int) $data['old'] ) {
												$settings[ $key ][ $field ] = strval( '{/{' . $data['new'] . '}/}' );

												$remove_this_value = false;
												break;
											}
										}
										if ( $remove_this_value ) {
											$settings[ $key ][ $field ] = '';
										}
									}
								}
							}

							if ( ( 'select' === $control['type'] || 'select2' === $control['type'] ) && in_array( $control['name'], $term_select_fields, true ) ) {
								if ( ! empty( $settings ) ) {
									$remove_this_value = $remove_unmatched;
									foreach ( $terms_data as $data ) {
										if ( (int) $settings === (int) $data['old'] ) {
											$settings = strval( '{/{' . $data['new'] . '}/}' );

											$remove_this_value = false;
											break;
										}
									}

									if ( $remove_this_value ) {
										$settings = '';
									}
								}
							}

							if ( 'wd_autocomplete' === $control['type'] && in_array( $control['name'], $term_autocomplete_fields, true ) ) {
								foreach ( $settings as $key => $value ) {
									if ( empty( $value ) ) {
										continue;
									}
									$remove_this_value = $remove_unmatched;
									foreach ( $terms_data as $data ) {
										if ( (int) $value === (int) $data['old'] ) {
											$settings[ $key ] = strval( '{/{' . $data['new'] . '}/}' );

											$remove_this_value = false;
											break;
										}
									}

									if ( $remove_this_value ) {
										unset( $settings[ $key ] );
									}
								}
								$settings = array_values( $settings );
							}

							$element_data['settings'][ $control['name'] ] = $settings;
						}

						return $element_data;
					}
				);

				$post_meta = wp_json_encode( $post_meta );

				$post_meta = str_replace( '{\/{', '', $post_meta );
				$post_meta = str_replace( '}\/}', '', $post_meta );

				$this->add_to_replaced( $value['new'], 'post_content' );

				update_post_meta( $value['new'], '_elementor_data', wp_slash( $post_meta ) );
			}
		}
	}

	/**
	 * Replace URL in content.
	 *
	 * @param string $content Content to replace URLs in.
	 * @return string
	 */
	private function replace_url_in_content( $content ) {
		if ( str_contains( $content, 'dummy.xtemos.com' ) ) {
			$content = $this->helpers->links_replace( $content, '/', $this->version );
		}

		return $content;
	}

	/**
	 * Add to replace.
	 *
	 * @param int        $id   Post id.
	 * @param string     $type Data type.
	 * @param bool|array $diff Diff data.
	 */
	private function add_to_replaced( $id, $type, $diff = false ) {
		$data = get_option( 'wd_import_replaced_items', array() );

		$data[ $id ][ $type ] = $type;

		if ( $diff ) {
			$data[ $id ]['diff'][] = $diff;
		}

		update_option( 'wd_import_replaced_items', $data, false );
	}

	/**
	 * Whether unmatched IDs should be removed during content replace.
	 *
	 * True for partial imports (page, single_product, shop_archive) where
	 * referenced posts/terms may not exist on the target site.
	 *
	 * @return bool
	 */
	private function should_remove_unmatched() {
		$partial_types = array( 'page', 'single_product', 'shop_archive' );

		return in_array( $this->version_type, $partial_types, true );
	}

	/**
	 * Is replaced.
	 *
	 * @param int    $id   Post id.
	 * @param string $type Data type.
	 *
	 * @return bool
	 */
	private function is_replaced( $id, $type ) {
		$data = get_option( 'wd_import_replaced_items', array() );

		return isset( $data[ $id ] ) && in_array( $type, $data[ $id ], true );
	}

	/**
	 * Bypass post exists check to force import of page
	 *
	 * @param int   $post_exists Post ID, or 0 if post did not exist.
	 * @param array $post        The post array to be inserted.
	 *
	 * @return int
	 */
	public function bypass_post_exists( $post_exists, $post ) {
		if ( 'page' === $this->version_type && 'page' === $post['post_type'] ) { //phpcs:ignore
			return false;
		}

		return $post_exists;
	}

	/**
	 * Apply imported Cart or Checkout data to the existing WooCommerce page.
	 *
	 * The imported post is changed to auto-draft so the WXR importer skips it.
	 *
	 * @param array $post Raw post data from WXR.
	 *
	 * @return array Raw post data.
	 */
	public function process_woocommerce_page( $post ) {
		if ( empty( $post['post_title'] ) || 'page' !== $post['post_type'] ) {
			return $post;
		}

		$page_key = sanitize_title( $post['post_title'] );

		if ( ! in_array( $page_key, array( 'cart', 'checkout' ), true ) ) {
			return $post;
		}

		$page_id = (int) get_option( 'woocommerce_' . $page_key . '_page_id' );

		if ( ! $page_id || 'page' !== get_post_type( $page_id ) || 'trash' === get_post_status( $page_id ) ) {
			return $post;
		}

		$woodmart_post_meta = array_filter(
			$post['postmeta'] ?? array(),
			function ( $meta ) {
				return ! empty( $meta['key'] ) && str_contains( $meta['key'], 'woodmart_' );
			}
		);

		foreach ( array_keys( get_post_meta( $page_id ) ) as $meta_key ) {
			if ( str_contains( $meta_key, 'woodmart_' ) ) {
				delete_post_meta( $page_id, $meta_key );
			}
		}

		foreach ( $woodmart_post_meta as $meta ) {
			add_post_meta( $page_id, $meta['key'], wp_slash( maybe_unserialize( $meta['value'] ) ) );
		}

		$cache_invalidation_suspended = wp_suspend_cache_invalidation( false );
		$result                       = wp_update_post(
			array(
				'ID'           => $page_id,
				'post_content' => wp_slash( $this->replace_url_in_content( $post['post_content'] ) ) ?? '',
			),
			true
		);

		wp_suspend_cache_invalidation( $cache_invalidation_suspended );

		if ( is_wp_error( $result ) ) {
			return $post;
		}

		$post['status'] = 'auto-draft';

		return $post;
	}

	/**
	 * Clear import_id when the post with that ID is in the trash so wp_insert_post
	 * creates a new post instead of updating the trashed one.
	 *
	 * @param array $postdata Processed post data.
	 * @param array $post     Raw post data from WXR.
	 *
	 * @return array
	 */
	public function clear_import_id_for_trashed( $postdata, $post ) { //phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		if ( ! empty( $postdata['import_id'] ) && 'page' === $this->version_type && 'page' === $post['post_type'] ) { //phpcs:ignore
			unset( $postdata['import_id'] );
		}
		return $postdata;
	}

	/**
	 * Return a fallback term ID when a taxonomy menu item's term was not imported.
	 *
	 * Hooked to 'woodmart_import_menu_item_missing_taxonomy'. Picks the first
	 * existing term in the same taxonomy so the menu item remains valid.
	 *
	 * @param int    $object_id Default fallback ID (0 = no fallback).
	 * @param string $taxonomy  Taxonomy slug (e.g. 'product_cat', 'category').
	 * @return int Existing term ID, or 0 if none found.
	 */
	public function get_fallback_term_id( $object_id, $taxonomy ) {
		if ( ! $taxonomy ) {
			return $object_id;
		}

		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'number'     => 20,
				'fields'     => 'ids',
			)
		);

		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			return (int) $terms[ array_rand( $terms ) ];
		}

		return $object_id;
	}

	/**
	 * Return a fallback post ID when a post_type menu item's post was not imported.
	 *
	 * Hooked to 'woodmart_import_menu_item_missing_post_type'. Picks the first
	 * published post of the same post type so the menu item remains valid.
	 *
	 * @param int    $object_id Default fallback ID (0 = no fallback).
	 * @param string $post_type Post type slug (e.g. 'page', 'product').
	 * @return int Existing post ID, or 0 if none found.
	 */
	public function get_fallback_post_id( $object_id, $post_type ) {
		if ( ! $post_type ) {
			return $object_id;
		}

		$posts = get_posts(
			array(
				'post_type'      => $post_type,
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'orderby'        => 'rand',
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);

		if ( ! empty( $posts ) ) {
			return (int) reset( $posts );
		}

		return $object_id;
	}
}
