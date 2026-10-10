<?php
/**
 * Import process.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Import;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import process.
 */
class Process {
	/**
	 * Available versions.
	 *
	 * @var $version_list
	 */
	private $version_list;
	/**
	 * Current version.
	 *
	 * @var $version
	 */
	private $version;
	/**
	 * Current version type.
	 *
	 * @var $type
	 */
	private $type;
	/**
	 * Current process.
	 *
	 * @var $version
	 */
	private $current_process;
	/**
	 * Is version imported.
	 *
	 * @var bool
	 */
	private $is_version_imported;
	/**
	 * Helpers.
	 *
	 * @var Helpers
	 */
	private $helpers;
	/**
	 * Config for the current version/page/element being imported.
	 *
	 * @var array
	 */
	private $version_config;
	/**
	 * Parent version slug (non-empty for partial page/element imports).
	 *
	 * @var string
	 */
	private $parent_version;

	/**
	 * Constructor.
	 *
	 * @param string $version Version slug.
	 * @param string $current_process Current process name.
	 * @param string $type Version type.
	 */
	public function __construct( $version, $current_process, $type ) {
		$this->version             = $version;
		$this->type                = $type;
		$this->current_process     = $current_process;
		$this->version_list        = woodmart_get_config( 'versions' );
		$this->parent_version      = isset( $_GET['parent_version'] ) ? sanitize_text_field( wp_unslash( $_GET['parent_version'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$this->version_config      = $this->resolve_version_config();
		$this->is_version_imported = $this->is_version_imported();
		$this->helpers             = Helpers::get_instance();

		$this->run_import();
	}

	/**
	 * Resolve version config from versions list using parent_version + version.
	 *
	 * @return array
	 */
	private function resolve_version_config() {
		if ( $this->parent_version && isset( $this->version_list[ $this->parent_version ]['partial'] ) ) {
			foreach ( $this->version_list[ $this->parent_version ]['partial'] as $partial_items ) {
				if ( isset( $partial_items[ $this->version ] ) ) {
					return $partial_items[ $this->version ];
				}
			}
		}

		return $this->version_list[ $this->version ] ?? array();
	}

	/**
	 * Run import.
	 */
	public function run_import() {
		if ( $this->need_process( 'xml' ) && 'xml' === $this->current_process && ( ! $this->is_version_imported || ( 'page' === $this->type || 'element' === $this->type ) ) ) {
			if ( 'base' === $this->type ) {
				Before::get_instance();
			}

			new XML( $this->version, 'posts' );
		}

		if ( $this->need_process( 'xml_images' ) && ! $this->is_version_imported && strpos( $this->current_process, 'images' ) !== false ) {
			new XML( $this->version, $this->current_process );
		}

		if ( 'other' === $this->current_process ) {
			if ( $this->need_process( 'widgets' ) ) {
				new Widgets( $this->version );
			}

			if ( $this->need_process( 'options' ) ) {
				new Options( $this->version, $this->type );
			}

			if ( $this->need_process( 'headers' ) && ! $this->is_version_imported ) {
				new Headers( $this->version );
			}

			if ( $this->need_process( 'home' ) ) {
				new Menu( $this->version );
			}

			if ( $this->need_process( 'images' ) ) {
				new Images( $this->version );
			}

			$import_after = After::get_instance();

			if ( 'base' === $this->type ) {
				$import_after->set_menu_locations();
				$import_after->set_blog_page();
				$import_after->set_shop_page();
				$import_after->enable_wpb_on_custom_post_types();
				$import_after->enable_elementor_on_custom_post_types();
				$import_after->show_all_fields_menu();
				$import_after->enable_myaccount_registration();
				$import_after->update_product_lookup_tables();
				$import_after->set_pages_sidebar();
				$import_after->wc_remove_uncategorized_cat();

				if ( 'elementor' === $this->helpers->get_page_builder() ) {
					$import_after->set_site_settings();
				}
			}

			$import_after->replace_db_urls( $this->version );

			$imported_versions = get_option( 'wd_import_imported_versions', array() );

			if ( ! in_array( $this->version, $imported_versions, true ) ) {
				$imported_versions[] = $this->version;

				update_option( 'wd_import_imported_versions', $imported_versions, false );
			}

			update_option( 'wd_import_theme_version', woodmart_get_theme_info( 'Version' ), false );
			update_option( 'woodmart_setup_status', 'done', false );

			if ( 'version' === $this->type ) {
				update_option( 'wd_import_current_version', $this->version, false );
			}

			if ( 'base' === $this->type ) {
				update_option( 'wd_import_current_base', $this->version, false );
			}

			$import_after->change_header_on_pages();

			do_action( 'woodmart_after_import' );
		}
	}

	/**
	 * Is need process.
	 *
	 * @param string $process Process name.
	 *
	 * @return bool
	 */
	private function need_process( $process ) {
		return in_array( $process, explode( ',', $this->version_config['process'] ?? '' ), true );
	}

	/**
	 * Is version imported.
	 *
	 * @return bool
	 */
	private function is_version_imported() {
		$imported_versions = get_option( 'wd_import_imported_versions', array() );
		$imported_data     = get_option( 'wd_imported_data_' . $this->version );

		return in_array( $this->version, $imported_versions, true ) && ! empty( $imported_data['page'] );
	}
}
