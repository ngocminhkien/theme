<?php
/**
 * Import options.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Import;

use XTS\Admin\Modules\Options as ThemeSettings;
use XTS\Admin\Modules\Options\Presets;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import options.
 */
class Options {
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
	private $type;
	/**
	 * Helpers.
	 *
	 * @var Helpers
	 */
	private $helpers;
	/**
	 * Config for the current version/page/element being imported.
	 *
	 * @var array|null
	 */
	private $version_config;
	/**
	 * Parent version slug for partial page/element imports.
	 *
	 * @var string
	 */
	private $parent_version;

	/**
	 * Constructor.
	 *
	 * @param string $version Version name.
	 * @param string $type Version type.
	 */
	public function __construct( $version, $type ) {
		$this->helpers        = Helpers::get_instance();
		$this->version        = $version;
		$this->type           = $type;
		$this->parent_version = isset( $_GET['parent_version'] ) ? sanitize_text_field( wp_unslash( $_GET['parent_version'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$this->version_config = $this->resolve_version_config();

		$options_import_mode = ! empty( $_GET['options_mode'] ) ? sanitize_text_field( wp_unslash( $_GET['options_mode'] ) ) : ''; // phpcs:ignore

		if ( 'none' === $options_import_mode ) {
			return;
		}

		if ( 'preset' === $options_import_mode ) {
			$this->import_as_preset();

			return;
		}

		if ( 'base' === $this->type ) {
			$this->import_presets();
			$this->import_options_presets();
		}

		$this->import_options();
	}

	/**
	 * Resolve version config from versions list using parent_version + version.
	 *
	 * @return array
	 */
	private function resolve_version_config() {
		$version_list = woodmart_get_config( 'versions' );

		if ( $this->parent_version && isset( $version_list[ $this->parent_version ]['partial'] ) ) {
			foreach ( $version_list[ $this->parent_version ]['partial'] as $partial_items ) {
				if ( isset( $partial_items[ $this->version ] ) ) {
					return $partial_items[ $this->version ];
				}
			}
		}

		return $version_list[ $this->version ] ?? array();
	}

	/**
	 * Import options presets.
	 */
	private function import_options_presets() {
		global $xts_woodmart_options;

		$file = $this->helpers->get_file_path( 'options_presets.json', $this->version );

		if ( 'elementor' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'options_presets-elementor.json' ) ) {
			$file = $this->helpers->get_file_path( 'options_presets-elementor.json', $this->version );
		} elseif ( 'gutenberg' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'options_presets-gutenberg.json' ) ) {
			$file = $this->helpers->get_file_path( 'options_presets-gutenberg.json', $this->version );
		}

		if ( ! $file ) {
			return;
		}

		$new_options_json = $this->helpers->links_replace( $this->helpers->get_local_file_content( $file ), '\\/', $this->version );

		$new_options = $xts_woodmart_options + json_decode( $new_options_json, true );

		$options = ThemeSettings::get_instance();

		$pseudo_post_data = array(
			'import-btn'    => true,
			'import_export' => wp_json_encode( $new_options ),
		);

		$sanitized_options = $options->sanitize_before_save( $pseudo_post_data );

		$options->update_options( $sanitized_options );
	}

	/**
	 * Import presets.
	 */
	private function import_presets() {
		$file = $this->helpers->get_file_path( 'presets.json', $this->version );

		if ( 'elementor' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'presets-elementor.json' ) ) {
			$file = $this->helpers->get_file_path( 'presets-elementor.json', $this->version );
		} elseif ( 'gutenberg' === $this->helpers->get_page_builder() && file_exists( $this->helpers->get_version_folder_path( $this->version ) . 'presets-gutenberg.json' ) ) {
			$file = $this->helpers->get_file_path( 'presets-gutenberg.json', $this->version );
		}

		if ( ! $file ) {
			return;
		}

		$presets = json_decode( $this->helpers->get_local_file_content( $file ), true );

		update_option( 'xts-options-presets', $presets );

		Presets::get_instance()->load_presets();
	}

	/**
	 * Import options.
	 */
	private function import_options() {
		global $xts_woodmart_options;

		$file = $this->get_options_file( 'options.json' );

		if ( ! $file ) {
			return;
		}

		$new_options_json = $this->helpers->links_replace( $this->helpers->get_local_file_content( $file ), '\\/', $this->version );

		$options = ThemeSettings::get_instance();

		$new_options = $this->filter_page_options( json_decode( $new_options_json, true ) );

		// Merge new options with new resetting values.
		$new_options = $new_options + $this->get_reset_options();

		// Set builder to WPB or Elementor.
		$xts_woodmart_options['current_builder']               = woodmart_get_opt( 'current_builder' );
		$xts_woodmart_options['enable_gutenberg_for_products'] = woodmart_get_opt( 'enable_gutenberg_for_products' );

		if ( 'native' === woodmart_get_opt( 'current_builder' ) ) {
			$xts_woodmart_options['woodmart_slider'] = 0;
		} else {
			$xts_woodmart_options['woodmart_slider'] = 1;
		}

		// Merge new options with other existed ones.
		$new_options = $new_options + $xts_woodmart_options;

		$pseudo_post_data = array(
			'import-btn'    => true,
			'import_export' => wp_json_encode( $new_options ),
		);

		$sanitized_options = $options->sanitize_before_save( $pseudo_post_data );

		$options->update_options( $sanitized_options );

		// Dynamic css options.
		foreach ( Presets::get_all() as $preset ) {
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-file-data' );
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-css-data' );
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-version' );
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-site-url' );
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-status' );
			delete_option( 'xts-theme_settings_' . $preset['id'] . '-credentials' );
		}

		delete_option( 'xts-theme_settings_default-file-data' );
		delete_option( 'xts-theme_settings_default-css-data' );
		delete_option( 'xts-theme_settings_default-version' );
		delete_option( 'xts-theme_settings_default-site-url' );
		delete_option( 'xts-theme_settings_default-status' );
		delete_option( 'xts-theme_settings_default-credentials' );

		$this->theme_settings_replace_post_ids();

		do_action( 'woodmart_after_import_theme_settings_options' );
	}

	/**
	 * Import options from options.json as a preset targeting the imported page by post ID.
	 *
	 * If a preset for this demo (identified by label title) already exists, a new condition
	 * rule is appended to it instead of creating a duplicate preset.
	 */
	private function import_as_preset() {
		$file = $this->get_options_file( 'options.json' );

		if ( ! $file ) {
			return;
		}

		$new_options = $this->filter_page_options(
			json_decode( $this->helpers->links_replace( $this->helpers->get_local_file_content( $file ), '\\/', $this->version ), true )
		);

		if ( empty( $new_options ) ) {
			return;
		}

		// Get the new post ID of the imported page for the preset condition.
		$imported_data = $this->helpers->get_imported_data( $this->version );
		$page_id       = null;

		if ( ! empty( $imported_data['page'] ) ) {
			$first_page = current( $imported_data['page'] );
			$page_id    = ! empty( $first_page['new'] ) ? (int) $first_page['new'] : null;
		}

		// Determine preset name from the demo label (groups all pages of the same demo).
		$version_list = woodmart_get_config( 'versions' );
		if ( $this->parent_version && isset( $version_list[ $this->parent_version ]['title'] ) ) {
			$preset_name = $version_list[ $this->parent_version ]['title'];
		} else {
			$preset_name = $this->version_config['title'] ?? $this->version;
		}

		// Look for an existing preset with the same name to avoid duplicates.
		$existing_preset_id = null;
		foreach ( Presets::get_all() as $id => $preset ) {
			if ( isset( $preset['name'] ) && $preset['name'] === $preset_name ) {
				$existing_preset_id = $id;
				break;
			}
		}

		if ( null !== $existing_preset_id ) {
			// Preset already exists — just add the new page condition rule.
			if ( $page_id ) {
				$all_presets       = Presets::get_all();
				$current_condition = isset( $all_presets[ $existing_preset_id ]['condition'] )
					? $all_presets[ $existing_preset_id ]['condition']
					: array(
						'relation' => 'OR',
						'rules'    => array(),
					);

				$current_condition['rules'][] = $this->build_post_id_condition_rule( $page_id );

				Presets::get_instance()->update_preset_conditions( $existing_preset_id, $current_condition );
			}

			$this->track_preset_in_imported_data( $existing_preset_id );

			return;
		}

		// No existing preset — create one, save its settings and set the initial condition.
		$new_options = $this->options_with_attachment( $new_options, $imported_data );
		$new_options = $this->options_with_post_id( $new_options, $imported_data );
		$new_options = $this->options_with_custom_fonts( $new_options, $imported_data );

		$new_options['fields_to_save'] = implode( ',', array_keys( $new_options ) );

		$preset_id = Presets::get_instance()->add_preset( $preset_name );

		if ( $page_id ) {
			Presets::get_instance()->update_preset_conditions(
				$preset_id,
				array(
					'relation' => 'OR',
					'rules'    => array( $this->build_post_id_condition_rule( $page_id ) ),
				)
			);
		}

		$theme_options               = get_option( 'xts-woodmart-options', array() );
		$theme_options[ $preset_id ] = $new_options;
		update_option( 'xts-woodmart-options', $theme_options );

		$this->track_preset_in_imported_data( $preset_id );
	}

	/**
	 * Save a preset ID to the current version's imported data for later removal tracking.
	 *
	 * @param string $preset_id Preset ID.
	 */
	private function track_preset_in_imported_data( $preset_id ) {
		$imported_data = get_option( 'wd_imported_data_' . $this->version, array() );

		if ( ! isset( $imported_data['presets'] ) ) {
			$imported_data['presets'] = array();
		}

		$imported_data['presets'][ $preset_id ] = array( 'id' => $preset_id );

		update_option( 'wd_imported_data_' . $this->version, $imported_data, false );
	}

	/**
	 * Remove items with a non-Google (custom/system) font-family from font option arrays.
	 * If the array becomes empty after filtering, the key is unset entirely.
	 *
	 * @param array $options Options array.
	 * @return array
	 */
	private function clear_non_google_fonts( array $options ) {
		foreach ( $this->get_font_option_keys() as $key ) {
			if ( ! isset( $options[ $key ] ) || ! is_array( $options[ $key ] ) ) {
				continue;
			}

			$result = array_values(
				array_filter(
					$options[ $key ],
					function ( $item ) {
						if ( ! is_array( $item ) || empty( $item['font-family'] ) ) {
							return true;
						}
						return isset( $item['google'] ) && ( '1' === (string) $item['google'] || 'true' === $item['google'] );
					}
				)
			);

			if ( empty( $result ) ) {
				unset( $options[ $key ] );
			} else {
				$options[ $key ] = $result;
			}
		}

		return $options;
	}

	/**
	 * For page imports, keep only the keys listed in get_page_allowed_option_keys().
	 * Any option value that is an array with an 'id' or 'url' key has those cleared to
	 * avoid carrying over attachment references that don't exist on the target site.
	 * Allowed keys absent from the imported JSON (or removed by font filtering) are
	 * filled with their default value from the theme settings controls.
	 * Returns the array unchanged for all other import types or when the list is empty.
	 *
	 * @param array $options Decoded options array.
	 * @return array
	 */
	private function filter_page_options( array $options ) {
		if ( ! in_array( $this->type, array( 'page', 'global' ), true ) ) {
			return $options;
		}

		$allowed = $this->get_page_allowed_option_keys();

		if ( empty( $allowed ) ) {
			return $options;
		}

		$filtered = array_intersect_key( $options, array_flip( $allowed ) );
		$filtered = $this->clear_non_google_fonts( $filtered );

		foreach ( $filtered as $key => $value ) {
			if ( is_array( $value ) ) {
				if ( array_key_exists( 'id', $value ) ) {
					$filtered[ $key ]['id'] = '';
				}
				if ( array_key_exists( 'url', $value ) ) {
					$filtered[ $key ]['url'] = '';
				}
			}
		}

		foreach ( $allowed as $key ) {
			if ( ! array_key_exists( $key, $filtered ) ) {
				$filtered[ $key ] = $this->get_default_option_value( $key );
			}
		}

		return $filtered;
	}

	/**
	 * Resolve an options file from a given version folder, preferring the builder-specific variant.
	 *
	 * @param string $version   Version folder name.
	 * @param string $file_name Base file name (e.g. 'options.json').
	 * @return false|string
	 */
	private function resolve_options_file( $version, $file_name ) {
		return $this->helpers->get_file_path( $file_name, $version );
	}

	/**
	 * Get options file path.
	 *
	 * For page imports, falls back to the matching version folder found via
	 * the page's category slugs when the page's own folder has no options file.
	 *
	 * @param string $file_name Base file name (e.g. 'options.json').
	 * @return false|string
	 */
	private function get_options_file( $file_name ) {
		$page_builder = $this->helpers->get_page_builder();
		$name         = pathinfo( $file_name, PATHINFO_FILENAME );
		$ext          = '.' . pathinfo( $file_name, PATHINFO_EXTENSION );

		if ( 'elementor' === $page_builder ) {
			$file_name = $name . '-elementor' . $ext;
		} elseif ( 'gutenberg' === $page_builder ) {
			$file_name = $name . '-gutenberg' . $ext;
		}

		$file = $this->resolve_options_file( $this->version, $file_name );

		if ( $file || 'page' !== $this->type ) {
			return $file;
		}

		// For partial pages, fall back to the parent version's options file.
		if ( $this->parent_version ) {
			return $this->resolve_options_file( $this->parent_version, $file_name );
		}

		return false;
	}

	/**
	 * Get reset options.
	 *
	 * @return array
	 */
	private function get_reset_options() {
		if ( 'global' === $this->type ) {
			return array();
		}

		$reset_options      = array();
		$version_type       = 'base' === $this->type ? 'version' : $this->type;
		$reset_options_keys = woodmart_get_config( 'reset-options-' . $version_type );

		foreach ( $reset_options_keys as $opt ) {
			$reset_options[ $opt ] = $this->get_default_option_value( $opt );
		}

		return $reset_options;
	}

	/**
	 * Get default options value.
	 *
	 * @param string $key Opt key.
	 *
	 * @return mixed|string
	 */
	private function get_default_option_value( $key ) {
		$all_fields = ThemeSettings::get_fields();

		foreach ( $all_fields as $field ) {
			if ( $field->args['id'] === $key ) {
				return isset( $field->args['default'] ) ? $field->args['default'] : '';
			}
		}

		return '';
	}

	/**
	 * Theme settings replace posts ids.
	 */
	private function theme_settings_replace_post_ids() {
		$imported_data = $this->helpers->get_imported_data( $this->version );
		$theme_options = get_option( 'xts-woodmart-options' );

		$theme_options = $this->options_with_attachment( $theme_options, $imported_data );
		$theme_options = $this->options_with_post_id( $theme_options, $imported_data );
		$theme_options = $this->options_with_custom_fonts( $theme_options, $imported_data );

		update_option( 'xts-woodmart-options', $theme_options );
	}

	/**
	 * Replace options with attachment.
	 *
	 * @param array $theme_options Options.
	 * @param array $imported_data Data.
	 */
	private function options_with_attachment( $theme_options, $imported_data ) {
		$options_with_attachment = array(
			'title-background',
			'body-background',
			'pages-background',
			'shop-background',
			'product-background',
			'blog-background',
			'blog-post-background',
			'portfolio-background',
			'portfolio-project-background',
			'footer-bar-bg',
			'age_verify_background',
			'popup-background',
			'header_banner_bg',
			'white_label_sidebar_icon_logo',
			'white_label_dashboard_logo',
			'white_label_appearance_screenshot',
			'link_1_icon',
			'link_2_icon',
			'link_3_icon',
			'link_4_icon',
			'link_5_icon',
			'preloader_image',
		);

		foreach ( $options_with_attachment as $option_name ) {
			if ( isset( $theme_options[ $option_name ]['id'] ) && $theme_options[ $option_name ]['id'] ) {
				$current_id = $theme_options[ $option_name ]['id'];
				$new_id     = '';

				if ( isset( $imported_data['attachment'][ $current_id ]['new'] ) && $imported_data['attachment'][ $current_id ]['new'] ) {
					$new_id = $imported_data['attachment'][ $current_id ]['new'];
				}

				if ( $new_id ) {
					$theme_options[ $option_name ]['id']  = $new_id;
					$theme_options[ $option_name ]['url'] = wp_get_attachment_image_url( $new_id, 'full' );
				}
			}
		}

		return $theme_options;
	}

	/**
	 * Replace options with post id.
	 *
	 * @param array $theme_options Options.
	 * @param array $imported_data Data.
	 */
	private function options_with_post_id( $theme_options, $imported_data ) {
		$options_with_post_id = array(
			'custom_404_page',
			'popup_html_block',
			'footer_html_block',
			'prefooter_html_block',
			'thank_you_page_html_block',
			'before_add_to_cart_html_block',
			'after_add_to_cart_html_block',
			'additional_tab_html_block',
			'additional_tab_2_html_block',
			'additional_tab_3_html_block',
			'cookies_policy_page',
			'compare_page',
			'wishlist_page',
			'full_search_content_html_block',
			'product_custom_hover',
			'product_custom_list',
		);

		foreach ( $options_with_post_id as $option_name ) {
			if ( isset( $theme_options[ $option_name ] ) && $theme_options[ $option_name ] ) {
				$current_id = $theme_options[ $option_name ];
				$new_id     = '';

				if ( isset( $imported_data['all_posts'][ $current_id ]['new'] ) && $imported_data['all_posts'][ $current_id ]['new'] ) {
					$new_id = $imported_data['all_posts'][ $current_id ]['new'];
				}

				if ( $new_id ) {
					$theme_options[ $option_name ] = $new_id;
				}
			}
		}

		return $theme_options;
	}

	/**
	 * Replace options with custom fonts.
	 *
	 * @param array $theme_options Options.
	 * @param array $imported_data Data.
	 */
	private function options_with_custom_fonts( $theme_options, $imported_data ) {
		$options_with_custom_fonts = array(
			'multi_custom_fonts',
		);

		foreach ( $options_with_custom_fonts as $option_name ) {
			if ( isset( $theme_options[ $option_name ] ) && $theme_options[ $option_name ] ) {
				foreach ( $theme_options[ $option_name ] as $font_data_key => $font_data ) {
					foreach ( $font_data as $key => $value ) {
						if ( isset( $value['id'] ) && $value['id'] ) {
							$current_id = $value['id'];
							$new_id     = '';

							if ( isset( $imported_data['attachment'][ $current_id ]['new'] ) && $imported_data['attachment'][ $current_id ]['new'] ) {
								$new_id = $imported_data['attachment'][ $current_id ]['new'];
							}

							if ( $new_id ) {
								$theme_options[ $option_name ][ $font_data_key ][ $key ]['id']  = $new_id;
								$theme_options[ $option_name ][ $font_data_key ][ $key ]['url'] = wp_get_attachment_image_url( $new_id, 'full' );
							}
						}
					}
				}
			}
		}

		return $theme_options;
	}

	/**
	 * Build a preset condition rule that matches a specific post by ID.
	 *
	 * @param int $page_id Post ID.
	 *
	 * @return array
	 */
	private function build_post_id_condition_rule( $page_id ) {
		return array(
			'type'                          => 'post_id',
			'comparison'                    => 'equals',
			'post_type'                     => '',
			'taxonomy'                      => '',
			'custom'                        => '',
			'value_id'                      => (string) $page_id,
			'user_role'                     => '',
			'filtered_product_term'         => '',
			'filtered_product_by_term'      => '',
			'filtered_product_term_any'     => '',
			'filtered_product_stock_status' => '',
		);
	}

	/**
	 * Option keys that contain arrays of font objects with 'google' and 'font-family' fields.
	 *
	 * @return string[]
	 */
	private function get_font_option_keys() {
		return array(
			'text-font',
			'primary-font',
			'post-titles-font',
			'widget-titles-font',
			'navigation-font',
			'secondary-font',
			'advanced_typography',
			'advanced_typography_button',
			'btns_default_typography',
			'btns_shop_typography',
		);
	}

	/**
	 * Option keys allowed to be imported when installing an additional page.
	 * Keys not listed here are ignored during page import. Return empty array to allow all keys.
	 *
	 * @return string[]
	 */
	private function get_page_allowed_option_keys() {
		return array_merge(
			$this->get_font_option_keys(),
			array(
				'main_layout',
				'site_width',
				'site_custom_width',
				'sticky_navigation_menu',
				'page-title-design',
				'page-title-size',
				'page-title-color',
				'title-background',
				'icon_font',
				'rounding_size',
				'custom_rounding_size',
				'primary-color',
				'secondary-color',
				'pages-background',
				'shop-background',
				'blog-background',
				'product-background',
				'blog-post-background',
				'btns_default_style',
				'btns_shop_style',
				'btns_shop_bg',
				'btns_shop_bg_hover',
				'form_fields_style',
				'form_border_width',
				'form_color',
				'form_placeholder_color',
				'form_bg',
				'products_bordered_grid',
				'products_bordered_grid_style',
				'products_with_background',
				'products_background',
				'products_shadow',
				'blog_with_shadow',
				'blog_style',
				'dark_version',
				'hide_categories_subcategories',
				'carousel_arrows_position',
				'carousel_arrows_icon_type',
				'carousel_arrows_hover_style',
				'carousel_arrows_sep_size',
				'carousel_arrows_sep_icon_size',
				'carousel_arrows_sep_offset_h',
				'carousel_arrows_sep_offset_v',
				'carousel_arrows_sep_color',
				'carousel_arrows_sep_color_hover',
				'carousel_arrows_sep_color_dis',
				'carousel_arrows_sep_bg_color',
				'carousel_arrows_sep_bg_color_hover',
				'carousel_arrows_sep_bg_color_dis',
				'carousel_arrows_sep_border_radius',
				'carousel_arrows_sep_border_style',
				'carousel_arrows_sep_border_width',
				'carousel_arrows_sep_border_color',
				'carousel_arrows_sep_border_color_hover',
				'carousel_arrows_sep_border_color_dis',
				'carousel_arrows_sep_box_shadow_color',
				'carousel_arrows_sep_box_shadow_offset_x',
				'carousel_arrows_sep_box_shadow_offset_y',
				'carousel_arrows_sep_box_shadow_blur',
				'carousel_arrows_sep_box_shadow_spread',
				'carousel_arrows_together_gap',
				'carousel_arrows_together_size',
				'carousel_arrows_together_icon_size',
				'carousel_arrows_together_offset_h',
				'carousel_arrows_together_offset_v',
				'carousel_arrows_together_color',
				'carousel_arrows_together_color_hover',
				'carousel_arrows_together_color_dis',
				'carousel_arrows_together_bg_color',
				'carousel_arrows_together_bg_color_hover',
				'carousel_arrows_together_bg_color_dis',
				'carousel_arrows_together_border_radius',
				'carousel_arrows_together_border_style',
				'carousel_arrows_together_border_width',
				'carousel_arrows_together_border_color',
				'carousel_arrows_together_border_color_hover',
				'carousel_arrows_together_border_color_dis',
				'carousel_arrows_together_box_shadow_color',
				'carousel_arrows_together_box_shadow_offset_x',
				'carousel_arrows_together_box_shadow_offset_y',
				'carousel_arrows_together_box_shadow_blur',
				'carousel_arrows_together_box_shadow_spread',
				'carousel_pagin_size',
				'carousel_pagin_bg_color',
				'carousel_pagin_bg_color_hover',
				'carousel_pagin_bg_color_dis',
				'carousel_pagin_bg_hover',
				'carousel_pagin_bg_color_dis',
				'carousel_pagin_bg_color_active',
				'carousel_pagin_border_radius',
				'carousel_pagin_border_style',
				'carousel_pagin_border_width',
				'carousel_pagin_border_color',
				'carousel_pagin_border_color_hover',
				'carousel_pagin_border_color_active',
				'carousel_scrollbar_height',
				'carousel_scrollbar_width',
				'carousel_scrollbar_bg_color',
				'carousel_scrollbar_drag_bg_color',
				'carousel_scrollbar_drag_bg_hover_color',

				'thums_position',
				'single_product_grid_columns_gap',
				'single_product_grid_column_desktop',
				'single_product_grid_column_tablet',
				'single_product_grid_column_mobile',
				'single_product_gallery_column_desktop',
				'single_product_gallery_column_tablet',
				'single_product_gallery_column_mobile',
				'single_product_thumbnails_vertical_items',
				'single_product_thumbnails_items_desktop',
				'single_product_thumbnails_items_tablet',
				'single_product_thumbnails_items_mobile',
				'main_gallery_on_tablet',
				'main_gallery_on_mobile',
				'main_gallery_center_mode',
				'single_product_thumbnails_wrap_in_mobile_devices',
				'single_product_thumbnails_gallery_width',
				'single_product_thumbnails_gallery_height',
			)
		);
	}
}
