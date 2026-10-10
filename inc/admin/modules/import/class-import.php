<?php
/**
 * Import.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules;

use Elementor\Plugin;
use WP_Query;
use WP_Filesystem_Base;
use XTS\Admin\Modules\Import\Helpers;
use XTS\Admin\Modules\Import\Import_Feedback;
use XTS\Admin\Modules\Import\Options as ImportOptions;
use XTS\Admin\Modules\Import\Process;
use XTS\Admin\Modules\Import\Remove;
use XTS\Singleton;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import.
 */
class Import extends Singleton {
	/**
	 * Available versions.
	 *
	 * @var array
	 */
	private $version_list = array();

	/**
	 * Helpers.
	 *
	 * @var Helpers
	 */
	private $helpers;

	/**
	 * Constructor.
	 */
	public function init() {
		add_filter( 'woodmart_get_versions_to_import', array( $this, 'add_partial_for_base_versions' ) );

		$this->include_files();

		$this->helpers = Helpers::get_instance();

		add_action( 'admin_init', array( $this, 'set_versions_list' ) );
		add_action( 'wp_ajax_woodmart_import_action', array( $this, 'import_action' ) );
		add_action( 'wp_ajax_woodmart_import_theme_settings', array( $this, 'import_theme_settings_action' ) );
	}

	/**
	 * Include files.
	 *
	 * @return void
	 */
	public function include_files() {
		$files = array(
			'class-helpers',
			'class-process',
			'class-widgets',
			'class-xml',
			'class-options',
			'class-headers',
			'class-after',
			'class-remove',
			'class-before',
			'class-images',
			'class-menu',
			'class-import-feedback',
		);

		foreach ( $files as $file ) {
			require_once get_parent_theme_file_path( WOODMART_FRAMEWORK . '/admin/modules/import/' . $file . '.php' );
		}
	}

	/**
	 * Import action.
	 */
	public function import_action() {
		check_ajax_referer( 'woodmart-import-nonce', 'security' );

		if ( empty( $_GET['version'] ) || empty( $_GET['type'] ) || empty( $_GET['process'] ) ) {
			return;
		}

		$version = sanitize_text_field( wp_unslash( $_GET['version'] ) );
		$type    = sanitize_text_field( wp_unslash( $_GET['type'] ) );
		$process = sanitize_text_field( wp_unslash( $_GET['process'] ) );

		if ( ! empty( $_GET['hostname'] ) && ! empty( $_GET['username'] ) && ! empty( $_GET['password'] ) ) {
			global $wp_filesystem;

			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once ABSPATH . '/wp-admin/includes/file.php';
			}

			$ftp_constants = array(
				'hostname'    => 'FTP_HOST',
				'username'    => 'FTP_USER',
				'password'    => 'FTP_PASS',
				'public_key'  => 'FTP_PUBKEY',
				'private_key' => 'FTP_PRIKEY',
			);

			foreach ( $ftp_constants as $key => $constant ) {
				if ( ! empty( $_GET[ $key ] ) ) {
					define( $constant, sanitize_text_field( wp_unslash( $_GET[ $key ] ) ) );  // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.VariableConstantNameFound
				}
			}

			ob_start();
			$credentials = request_filesystem_credentials( self_admin_url() );
			ob_end_clean();

			if ( false === $credentials || ! WP_Filesystem( $credentials ) ) {
				$status['errorCode']    = 'unable_to_connect_to_filesystem';
				$status['errorMessage'] = __( 'Unable to connect to the filesystem. Please confirm your credentials.', 'woodmart' );

				// Pass through the error from WP_Filesystem if one was raised.
				if ( $wp_filesystem instanceof WP_Filesystem_Base && is_wp_error( $wp_filesystem->errors ) && $wp_filesystem->errors->has_errors() ) {
					$status['errorMessage'] = esc_html( $wp_filesystem->errors->get_error_message() );
				}

				wp_send_json_error( $status );
			}
		}

		new Process( $version, $process, $type );

		$parent_version = ! empty( $_GET['parent_version'] ) ? sanitize_text_field( wp_unslash( $_GET['parent_version'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		$response = array(
			'preview_url' => $this->get_preview_url( $version, $type ),
			'remove_html' => Remove::get_instance()->popup_content( true, 'import' ),
			'success'     => true,
		);

		if ( $parent_version ) {
			$response['partial_remove_html'] = Remove::get_instance()->partial_popup_content( true, 'import', $parent_version );
		}

		wp_send_json( $response );
	}

	/**
	 * Imports theme options globally from the given version.
	 */
	public function import_theme_settings_action() {
		check_ajax_referer( 'woodmart-import-nonce', 'security' );

		if ( empty( $_GET['version'] ) ) {
			return;
		}

		$version = sanitize_text_field( wp_unslash( $_GET['version'] ) );

		new ImportOptions( $version, 'global' );

		update_option( 'wd_import_global_settings_version', $version, false );

		wp_send_json_success( array( 'version' => $version ) );
	}

	/**
	 * Get categories.
	 */
	public function get_categories() {
		$categories = array();

		foreach ( $this->version_list as $version_data ) {
			if ( ! isset( $version_data['categories'] ) ) {
				continue;
			}

			$type = 'version' === $version_data['type'] ? 'version' : 'page';

			foreach ( $version_data['categories'] as $category ) {
				$count = ! empty( $categories[ $type ][ $category['slug'] ]['count'] ) ? $categories[ $type ][ $category['slug'] ]['count'] : 0;

				$categories[ $type ][ $category['slug'] ] = array(
					'data'  => $category,
					'count' => $count + 1,
				);
			}
		}

		return $categories;
	}

	/**
	 * Get all category count by type.
	 *
	 * @param string $count_type Count type.
	 *
	 * @return int|mixed
	 */
	public function get_all_category_count( $count_type ) {
		$output = array();

		foreach ( $this->version_list as $version_data ) {
			$type = 'version' === $version_data['type'] ? 'version' : 'page';

			$output[ $type ] = isset( $output[ $type ] ) ? $output[ $type ] + 1 : 1;
		}

		return $output[ $count_type ];
	}

	/**
	 * Interface.
	 */
	public function render() {
		wp_enqueue_script( 'xts-import', WOODMART_ASSETS . '/js/import.js', array(), WOODMART_VERSION, true );

		$wrapper_classes = '';
		$items_classes   = '';

		$base_versions = $this->helpers->get_base_version();

		if ( $base_versions ) {
			foreach ( $base_versions as $version ) {
				if ( $this->is_imported( $version ) ) {
					$wrapper_classes .= ' xts-base-imported';

					break;
				}
			}
		}

		if ( Remove::get_instance()->has_data_to_remove() ) {
			$wrapper_classes .= ' xts-has-data';
		}

		if ( $this->get_notices() ) {
			$items_classes .= ' xts-disabled';
		}

		$version                 = woodmart_get_theme_info( 'Version' );
		$current_base            = get_option( 'wd_import_current_base', 'base' );
		$is_setup_wizard         = Setup_Wizard::get_instance()->is_setup();
		$global_settings_version = get_option( 'wd_import_global_settings_version', '' );

		wp_enqueue_script( 'woodmart-theme', WOODMART_SCRIPTS . '/scripts/global/helpers.min.js', array(), $version, true );
		wp_enqueue_script( 'xts-lazy-load', WOODMART_SCRIPTS . '/scripts/global/lazyLoading.min.js', array(), $version, true );
		wp_enqueue_style( 'xts-lazy-load', WOODMART_STYLES . '/parts/opt-lazy-load.css', array(), $version );

		$all_categories = $this->get_categories();
		$version_items  = array();
		foreach ( $this->version_list as $_slug => $_data ) {
			if ( 'version' === $_data['type'] ) {
				$version_items[ $_slug ] = $_data;
			}
		}

		?>
		<script>
			var woodmart_settings = {
				lazy_loading_offset: 0
			};
		</script>
		<div class="xts-box xts-import xts-theme-style<?php echo esc_attr( $wrapper_classes ); ?>" data-current-base="<?php echo esc_attr( $current_base ); ?>">
			<div class="xts-box-header">
				<div class="xts-row">
					<div class="xts-col">
						<div class="xts-import-websites">
							<h3>
								<?php esc_html_e( 'Prebuilt websites', 'woodmart' ); ?>
							</h3>
							<div class="xts-import-search xts-search xts-i-search">
								<input type="text" placeholder="<?php echo esc_attr__( 'Search by name', 'woodmart' ); ?>" aria-label="<?php echo esc_attr__( 'Search by name', 'woodmart' ); ?>">
							</div>
						</div>
						<div class="xts-import-part xts-hidden">
							<a href="#" class="xts-back-website xts-btn xts-i-arrow-left">
								<?php esc_html_e( 'Back', 'woodmart' ); ?>
							</a>
							<h3></h3>
						</div>
					</div>
					<div class="xts-col-auto xts-col-remove-content">
						<?php Remove::get_instance()->render(); ?>
					</div>
				</div>
			</div>
			<div class="xts-box-content">
				<div class="xts-notices-wrapper xts-notices-sticky xts-import-notices"><?php $this->print_notices(); // Must be in one line. ?></div>
				<div class="xts-row xts-sp-20 xts-import-row xts-active" data-type="version">
					<div class="xts-col-12 xts-col-lg-3 xts-col-xl-2 xts-col-dummy-nav">
						<div class="xts-import-cats-list-wrap">
							<div class="xts-import-cats-list">
								<?php if ( ! empty( $all_categories['version'] ) ) : ?>
									<ul class="xts-filter" data-type="version">
										<li data-cat="*" class="xts-active">
											<a>
												<span><?php esc_html_e( 'All', 'woodmart' ); ?></span>
												<span class="xts-filter-count"><?php echo esc_html( $this->get_all_category_count( 'version' ) ); ?></span>
											</a>
										</li>
										<?php foreach ( $all_categories['version'] as $category ) : ?>
											<li data-cat="<?php echo esc_attr( $category['data']['slug'] ); ?>">
												<a>
													<span><?php echo esc_html( $category['data']['name'] ); ?></span>
													<span class="xts-filter-count"><?php echo esc_html( $category['count'] ); ?></span>
												</a>
											</li>
										<?php endforeach; ?>
									</ul>
								<?php endif; ?>
							</div>
						</div>
					</div>

					<div class="xts-col">
						<div class="xts-import-items xts-import-items-version xts-row xts-sp-20<?php echo esc_attr( $items_classes ); ?>">
							<?php foreach ( $version_items as $slug => $version_data ) : ?>
								<?php
								$item_classes = '';

								$type       = $version_data['type'];
								$base       = isset( $version_data['base'] ) ? $version_data['base'] : '';
								$tags       = isset( $version_data['tags'] ) ? $version_data['tags'] : '';
								$categories = isset( $version_data['categories'] ) ? $version_data['categories'] : array();

								if ( $this->is_imported( $slug, $base ) ) {
									$item_classes .= ' xts-imported';
								}

								$categories_array = array();
								foreach ( $categories as $category ) {
									$categories_array[] = $category['slug'];
								}

								?>
								<div class="xts-import-item-wrap xts-cat-show xts-col-12 xts-col-lg-6 xts-col-xl-4">
									<div class="xts-import-item<?php echo esc_attr( $item_classes ); ?>" data-version="<?php echo esc_attr( $slug ); ?>" data-base="<?php echo esc_attr( $base ); ?>" data-type="<?php echo esc_attr( $type ); ?>" data-tags="<?php echo esc_attr( $tags ); ?>" data-cats="<?php echo esc_attr( implode( ',', $categories_array ) ); ?>">
										<div class="xts-import-item-image">
											<img data-src="<?php echo esc_url( WOODMART_DUMMY_URL . $slug . '/preview.jpg' ); ?>" src="<?php echo esc_url( woodmart_lazy_get_default_preview() ); ?>" class="wd-lazy-load wd-lazy-fade" alt="<?php echo esc_attr__( 'Import preview', 'woodmart' ); ?>" loading="lazy">
											<div class="xts-box-labels">
												<?php if ( 'main' === $slug ) : ?>
													<div class="xts-box-label xts-label-default xts-i-flag">
														<?php echo esc_attr__( 'Default', 'woodmart' ); ?>
													</div>
												<?php endif; ?>
												<div class="xts-box-label xts-label-warning xts-i-check">
													<?php echo esc_attr__( 'Imported', 'woodmart' ); ?>
												</div>
											</div>
											<a href="<?php echo esc_url( $this->get_demo_preview_url( $slug, $version_data ) ); ?>" class="xts-btn xts-color-white xts-import-item-preview xts-i-view" target="_blank">
												<?php esc_html_e( 'Live preview', 'woodmart' ); ?>
											</a>
											<div class="xts-import-progress-bar" data-progress="0"></div>
											<div class="xts-import-progress-bar-percent">0%</div>
										</div>
										<footer class="xts-import-item-footer">
											<span class="xts-import-item-title">
												<?php echo esc_html( $version_data['title'] ); ?>
											</span>

											<?php if ( ! $is_setup_wizard && ! empty( $version_data['partial'] ) ) : ?>
												<a href="#" class="xts-partial-btn xts-bordered-btn xts-size-s xts-color-default xts-i-slides">
													<?php esc_html_e( 'Partial', 'woodmart' ); ?>
												</a>
											<?php endif; ?>

											<a href="#" class="xts-import-btn xts-btn xts-size-s xts-color-alt xts-i-check">
												<?php esc_html_e( 'Activate', 'woodmart' ); ?>
											</a>
											<a href="#" class="xts-import-btn xts-bordered-btn xts-size-s xts-color-primary xts-i-import">
												<?php esc_html_e( 'Import', 'woodmart' ); ?>
											</a>
											<a href="<?php echo esc_url( $this->get_preview_url( $slug, $type ) ); ?>" target="_blank" class="xts-view-item-btn xts-btn xts-size-s xts-color-alt xts-i-expand">
												<?php esc_html_e( 'View page', 'woodmart' ); ?>
											</a>
										</footer>
									</div>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				</div>
				<?php foreach ( $version_items as $slug => $version_data ) : ?>
					<?php if ( ! empty( $version_data['partial'] ) ) : ?>
						<div class="xts-import-part-row xts-hidden" data-version="<?php echo esc_attr( $slug ); ?>">
							<div class="xts-import-part-row-header">
								<?php Remove::get_instance()->render_partial( $slug ); ?>
							</div>
							<?php
							$partial_type_labels = array(
								'pages'    => esc_html__( 'Pages', 'woodmart' ),
								'layouts'  => esc_html__( 'Layouts', 'woodmart' ),
								'elements' => esc_html__( 'Elements', 'woodmart' ),
							);
							?>
							<div class="xts-import-part-section xts-import-part-section-settings<?php echo $slug === $global_settings_version ? ' xts-settings-imported' : ''; ?>">
								<div class="xts-title-icon xts-i-file-code-css"></div>
								<div class="xts-import-part-preset-heading">
									<h4 class="xts-import-part-section-title">
										<?php esc_html_e( 'Theme settings', 'woodmart' ); ?>
									</h4>
									<p><?php esc_html_e( 'Overwrites current theme settings, including colors, typography, layouts, backgrounds, buttons, forms, and carousels, with this demo\'s design.', 'woodmart' ); ?></p>
								</div>
								<div class="xts-box-label xts-label-warning xts-i-check">
									<?php echo esc_attr__( 'Imported', 'woodmart' ); ?>
								</div>
								<a href="#" class="xts-import-btn xts-import-settings-btn xts-btn xts-color-primary xts-i-import" data-version="<?php echo esc_attr( $slug ); ?>">
									<?php esc_html_e( 'Import settings', 'woodmart' ); ?>
								</a>
							</div>
							<div class="xts-notice xts-info">
								<?php esc_html_e( 'Note that the installed content may not look exactly like the live preview, as this also depends on the Theme settings. You can import them as well if you’d like a closer match.', 'woodmart' ); ?>
							</div>
							<?php if ( ! $is_setup_wizard ) : ?>
								<?php foreach ( $version_data['partial'] as $partial_type => $partial_items ) : ?>
									<div class="xts-import-part-section xts-import-part-section-<?php echo esc_attr( $partial_type ); ?>">
										<div class="xts-import-part-preset-heading">
											<h4 class="xts-import-part-section-title">
												<?php echo esc_html( $partial_type_labels[ $partial_type ] ); ?>
											</h4>
											<?php if ( 'pages' === $partial_type ) : ?>
												<label class="xts-import-preset-label">
													<input type="checkbox" <?php echo $slug !== $global_settings_version ? 'checked' : ''; ?>>
													<?php esc_html_e( 'Preset', 'woodmart' ); ?>
													<span class="xts-hint">
														<div class="xts-tooltip xts-top">
															<div class="xts-tooltip-inner">
																<?php
																echo wp_kses(
																	sprintf(
																		__( 'If you leave this enabled, the imported page will get its own Theme Settings preset — a set of colors, fonts, typography, backgrounds, and button/form styles scoped only to this page, activating when the page is viewed. If you don\'t enable the preset, the imported page will inherit your current global settings. You can see all imported presets in <a href="%s">Theme Settings -> Presets</a>.', 'woodmart' ),
																		esc_url( admin_url( 'admin.php?page=xts_theme_settings_presets' ) )
																	),
																	woodmart_get_allowed_html()
																);
																?>
															</div>
														</div>
													</span>
												</label>
											<?php endif; ?>
										</div>
										<div class="xts-import-items xts-import-items-partial xts-row xts-sp-20">
											<?php foreach ( $partial_items as $partial_slug => $partial_item ) : ?>
												<?php $partial_item_classes = $this->is_imported( $partial_slug ) ? ' xts-imported' : ''; ?>
												<div class="xts-import-part-item-wrap xts-col-12 xts-col-lg-6 xts-col-xl-3">
													<div class="xts-import-item xts-import-item-partial<?php echo esc_attr( $partial_item_classes ); ?>" data-version="<?php echo esc_attr( $partial_slug ); ?>" data-type="<?php echo esc_attr( $partial_item['type'] ); ?>" data-parent-version="<?php echo esc_attr( $slug ); ?>">
														<div class="xts-import-item-image">
															<img data-src="<?php echo esc_url( WOODMART_DUMMY_URL . $partial_slug . '/preview.jpg' ); ?>" src="<?php echo esc_url( woodmart_lazy_get_default_preview() ); ?>" class="wd-lazy-load wd-lazy-fade" alt="<?php echo esc_attr__( 'Import preview', 'woodmart' ); ?>" loading="lazy">
															<div class="xts-box-labels">
																<div class="xts-box-label xts-label-warning xts-i-check">
																	<?php echo esc_attr__( 'Imported', 'woodmart' ); ?>
																</div>
															</div>
															<?php if ( isset( $partial_item['link'] ) ) : ?>
																<a href="<?php echo esc_url( $this->get_demo_preview_url( $partial_slug, $partial_item ) ); ?>" class="xts-btn xts-color-white xts-import-item-preview xts-i-view" target="_blank">
																	<?php esc_html_e( 'Live preview', 'woodmart' ); ?>
																</a>
															<?php endif; ?>
															<div class="xts-import-progress-bar" data-progress="0"></div>
															<div class="xts-import-progress-bar-percent">0%</div>
														</div>
														<footer class="xts-import-item-footer">
															<span class="xts-import-item-title">
																<?php echo esc_html( $partial_item['title'] ); ?>
															</span>
															<a href="#" class="xts-import-btn xts-bordered-btn xts-size-s xts-color-primary xts-i-import">
																<?php esc_html_e( 'Import', 'woodmart' ); ?>
															</a>
															<a href="<?php echo esc_url( $this->get_preview_url( $slug, 'page' ) ); ?>" target="_blank" class="xts-view-item-btn xts-btn xts-size-s xts-color-alt xts-i-expand">
																<?php if ( 'layouts' === $partial_type ) : ?>
																	<?php esc_html_e( 'View layout', 'woodmart' ); ?>
																<?php else : ?>
																	<?php esc_html_e( 'View page', 'woodmart' ); ?>
																<?php endif; ?>
															</a>
														</footer>
													</div>
												</div>
											<?php endforeach; ?>
										</div>
									</div>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
			<div class="xts-box-footer">
				<p>
					<?php esc_html_e( 'Import a full prebuilt website with all demo pages, layouts, and sample content, or install only specific parts you need. You can easily switch between demos or remove imported content at any time.', 'woodmart' ); ?>
				</p>
			</div>
		</div>

		<?php $this->get_request_filesystem_credentials(); ?>
		<?php Import_Feedback::get_instance()->render_block(); ?>
		<?php
	}

	/**
	 * Print notices.
	 */
	public function print_notices() {
		$notices = $this->get_notices();

		if ( $notices ) {
			foreach ( $notices as $notice ) {
				$this->print_notice( $notice['type'], $notice['message'] );
			}
		}
	}

	/**
	 * Print notices.
	 */
	public function get_notices() {
		$notices = array();

		if ( $this->get_required_plugins() ) {
			$notices[] = array(
				'type'    => 'warning',
				// translators: 1. Link to the plugins page, 2. List of required plugins.
				'message' => sprintf( __( 'You need to install the following plugins to use our import function: <strong><a href="%1$s">%2$s</a></strong>', 'woodmart' ), esc_url( add_query_arg( 'page', rawurlencode( 'xts_plugins' ), admin_url( 'admin.php' ) ) ), implode( ', ', $this->get_required_plugins() ) ),
			);
		}

		if ( woodmart_is_core_installed() && version_compare( WOODMART_CORE_PLUGIN_VERSION, WOODMART_CORE_VERSION, '<' ) ) {
			$notices[] = array(
				'type'    => 'warning',
				'message' => esc_html__( 'Please, update Woodmart Core plugin to the latest version to use our import function properly.', 'woodmart' ),
			);
		}

		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			if ( defined( 'WPB_PLUGIN_DIR' ) ) {
				$notices[] = array(
					'type'    => 'warning',
					'message' => __( 'Please, deactivate one of the builders and leave only ONE plugin either <strong>WPBakery page builder</strong> or <strong>Elementor</strong>.', 'woodmart' ),
				);
			}

			if ( class_exists( 'Elementor\Plugin' ) && ! Plugin::$instance->experiments->is_feature_active( 'container' ) ) {
				$notices[] = array(
					'type'    => 'warning',
					'message' => __( 'You need to enable Elementor Flexbox Container feature in Elementor -> Settings -> Features to import our dummy content properly.', 'woodmart' ),
				);
			}
		}

		if ( ! class_exists( 'DOMDocument' ) ) {
			$notices[] = array(
				'type'    => 'warning',
				'message' => __( 'Please, contact the host support and ask them to enable <strong>DOMDocument</strong>.', 'woodmart' ),
			);
		}

		if ( ! function_exists( 'simplexml_load_file' ) ) {
			$notices[] = array(
				'type'    => 'warning',
				'message' => __( 'Please, contact the host support and ask them to enable <strong>simplexml_load_file</strong>.', 'woodmart' ),
			);
		}

		$protocol = is_ssl() ? 'https' : 'http';

		if ( wp_parse_url( get_home_url(), PHP_URL_SCHEME ) !== $protocol || wp_parse_url( get_home_url(), PHP_URL_SCHEME ) !== wp_parse_url( get_site_url(), PHP_URL_SCHEME ) ) {
			$notices[] = array(
				'type'    => 'warning',
				'message' => __( 'In your settings, the HTTP protocol is specified, but you opened the page via HTTPS. This can lead to an error during import. You need to correct the settings and specify the protocol https:// in WordPress -> Settings -> General.', 'woodmart' ),
			);
		}

		return $notices;
	}

	/**
	 * Get required plugins.
	 */
	public function get_required_plugins() {
		$plugins = array();

		if ( ! woodmart_is_core_installed() ) {
			$plugins[] = 'Woodmart Core';
		}

		if ( ! function_exists( 'is_shop' ) ) {
			$plugins[] = 'WooCommerce';
		}

		if ( 'native' !== woodmart_get_opt( 'current_builder' ) && ! defined( 'ELEMENTOR_VERSION' ) && ! defined( 'WPB_PLUGIN_DIR' ) ) {
			$plugins[] = 'Elementor';
		}

		return $plugins;
	}

	/**
	 * Print notice.
	 *
	 * @param string $type    Type.
	 * @param string $message Message.
	 */
	private function print_notice( $type, $message ) {
		?>
		<div class="xts-notice xts-<?php echo esc_attr( $type ); ?>">
			<?php echo wp_kses( $message, woodmart_get_allowed_html() ); ?>
		</div>
		<?php
	}

	/**
	 * Is version imported.
	 *
	 * @param string $slug          Slug.
	 * @param string $required_base Base version slug that must also be installed.
	 *
	 * @return bool
	 */
	public function is_imported( $slug, $required_base = '' ) {
		$imported_versions = get_option( 'wd_import_imported_versions', array() );

		if ( ! in_array( $slug, $imported_versions, true ) ) {
			return false;
		}

		if ( $required_base && ! in_array( $required_base, $imported_versions, true ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get demo preview URL.
	 *
	 * @param string $slug         Slug.
	 * @param array  $version_data Data.
	 *
	 * @return string
	 */
	private function get_demo_preview_url( $slug, $version_data ) {
		$url = WOODMART_DEMO_URL . $slug . '/';

		if ( 'version' === $version_data['type'] ) {
			$url = WOODMART_DEMO_URL . 'demo-' . $slug . '/demo/' . $slug . '/';
		}

		if ( isset( $version_data['link'] ) ) {
			$url = $version_data['link'];
		}

		return $url;
	}

	/**
	 * Get preview URL.
	 *
	 * @param string $slug Slug.
	 * @param string $type Type.
	 *
	 * @return string
	 */
	private function get_preview_url( $slug, $type ) {
		$import_data = get_option( 'wd_imported_data_' . $slug );
		$query_args  = array(
			'post_type'              => 'page',
			'posts_per_page'         => 1,
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
		);
		$page = '';

		if ( 'version' === $type ) {
			$query_args['title'] = 'Home ' . $slug;

			$query = new WP_Query( $query_args );
			$page  = ! empty( $query->post ) ? $query->post : null;
		} elseif ( $import_data && 'page' === $type ) {
			if ( ! empty( $import_data['page'] ) ) {
				return get_permalink( current( $import_data['page'] )['new'] );
			} elseif ( ! empty( $import_data['woodmart_layout'] ) ) {
				return get_permalink( current( $import_data['woodmart_layout'] )['new'] );
			} elseif ( empty( $import_data['page'] ) && ( str_contains( $slug, 'cart' ) || str_contains( $slug, 'checkout' ) ) ) {
				if ( str_contains( $slug, 'cart' ) ) {
					return get_permalink( get_option( 'woocommerce_cart_page_id' ) );
				} else {
					return get_permalink( get_option( 'woocommerce_checkout_page_id' ) );
				}
			}
		} else {
			$page = get_page_by_path( $slug, OBJECT, array( 'page' ) );
		}

		if ( ! $page ) {
			$query_args['title'] = str_replace( '-', ' ', $slug );

			$query = new WP_Query( $query_args );
			$page  = ! empty( $query->post ) ? $query->post : null;
		}

		if ( ! $page ) {
			return '';
		}

		return get_permalink( $page->ID );
	}

	/**
	 * Set versions list.
	 */
	public function set_versions_list() {
		$this->version_list = woodmart_get_config( 'versions' );
		$current_builder    = $this->helpers->get_page_builder();

		$base_versions = $this->helpers->get_base_version();

		if ( $base_versions ) {
			foreach ( $base_versions as $version ) {
				unset( $this->version_list[ $version ] );
			}
		}

		if ( 'gutenberg' === $current_builder ) {
			foreach ( $this->version_list as $key => $value ) {
				if ( isset( $value[ $current_builder ] ) && ! $value[ $current_builder ] ) {
					unset( $this->version_list[ $key ] );
					continue;
				}

				if ( empty( $value['partial'] ) ) {
					continue;
				}

				foreach ( $value['partial'] as $partial_type => $partial_items ) {
					foreach ( $partial_items as $partial_key => $partial_item ) {
						if ( isset( $partial_item[ $current_builder ] ) && ! $partial_item[ $current_builder ] ) {
							unset( $this->version_list[ $key ]['partial'][ $partial_type ][ $partial_key ] );
						}
					}

					if ( empty( $this->version_list[ $key ]['partial'][ $partial_type ] ) ) {
						unset( $this->version_list[ $key ]['partial'][ $partial_type ] );
					}
				}
			}
		}
	}

	/**
	 * Auto-add partial for versions that use the shared base.
	 *
	 * @param array $versions Versions list.
	 * @return array
	 */
	public function add_partial_for_base_versions( $versions ) {
		foreach ( $versions as $key => &$value ) {
			if ( isset( $value['type'] ) && 'version' === $value['type'] ) {
				$partial_item = array(
					'title'   => 'Home',
					'process' => 'xml,options',
					'type'    => 'page',
				);

				if ( isset( $value['link'] ) ) {
					$partial_item['link'] = $value['link'];
				}

				if ( ! empty( $value['partial'] ) ) {
					$value['partial']['pages'] = array_merge(
						array(
							$key => $partial_item,
						),
						$value['partial']['pages']
					);
				} else {
					$value['partial'] = array(
						'pages' => array(
							$key => $partial_item,
						),
					);
				}
			}
		}

		return $versions;
	}

	/**
	 * Get request filesystem credentials.
	 *
	 * @return void
	 */
	private function get_request_filesystem_credentials() {
		ob_start();

		wp_print_request_filesystem_credentials_modal();

		$credentials = ob_get_clean();

		if ( $credentials ) {
			echo '<div class="xts-request-credentials">' . $credentials . '</div>'; // phpcs:ignore
		}
	}
}

Import::get_instance();
