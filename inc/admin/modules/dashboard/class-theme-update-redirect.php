<?php
/**
 * Redirect to the theme changelog after a successful WoodMart update.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Dashboard;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Direct access not allowed.
}

/**
 * Theme update redirect class.
 */
class Theme_Update_Redirect {
	const UPDATE_TRANSIENT = 'woodmart_update_redirect';

	/**
	 * Register hooks.
	 */
	public function __construct() {
		add_action( 'upgrader_process_complete', array( $this, 'schedule_redirect' ), 10, 2 );
		add_action( 'admin_init', array( $this, 'redirect_after_update' ) );
	}

	/**
	 * Schedule a redirect after a successful WoodMart update.
	 *
	 * @param \WP_Upgrader $upgrader Upgrader instance.
	 * @param array        $options  Update data.
	 */
	public function schedule_redirect( $upgrader, $options ) {

		if ( ! $this->is_woodmart_update( $options ) ) {
			return;
		}

		if ( isset( $upgrader->result ) && is_wp_error( $upgrader->result ) ) {
			return;
		}

		$old_version = get_option( 'woodmart_version', '' );
		$new_version = ! empty( $upgrader->new_theme_data['Version'] )
			? $upgrader->new_theme_data['Version']
			: wp_get_theme( WOODMART_SLUG )->get( 'Version' );

		$this->set_redirect_transient( $old_version, $new_version );
	}

	/**
	 * Redirect an administrator to the changelog once.
	 */
	public function redirect_after_update() {
		$update_data = get_transient( self::UPDATE_TRANSIENT );

		if (
			! $update_data ||
			empty( $update_data['redirect'] ) ||
			! current_user_can( 'update_themes' ) ||
			wp_doing_ajax() ||
			wp_doing_cron() ||
			is_network_admin() ||
			( defined( 'WP_CLI' ) && WP_CLI )
		) {
			return;
		}

		$current_page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';

		delete_transient( self::UPDATE_TRANSIENT );

		if ( 'xts_whats_new' === $current_page ) {
			return;
		}

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'    => 'xts_whats_new',
					'updated' => '1',
				),
				admin_url( 'admin.php' )
			)
		);
		exit;
	}

	/**
	 * Check whether an update moves to a newer X.Y release.
	 *
	 * Patch updates within the same X.Y release do not trigger a redirect.
	 *
	 * @param string $old_version Installed version.
	 * @param string $new_version Updated version.
	 * @return bool
	 */
	private function is_new_release( $old_version, $new_version ) {
		if (
			! is_string( $old_version ) ||
			! is_string( $new_version ) ||
			! preg_match( '/^(\d+)\.(\d+)/', $old_version, $old_release ) ||
			! preg_match( '/^(\d+)\.(\d+)/', $new_version, $new_release )
		) {
			return false;
		}

		$old_release = $old_release[1] . '.' . $old_release[2];
		$new_release = $new_release[1] . '.' . $new_release[2];

		return version_compare( $new_version, $old_version, '>' ) && version_compare( $new_release, $old_release, '>' );
	}

	/**
	 * Check whether the upgrader operation updates WoodMart.
	 *
	 * @param array $options Update data.
	 * @return bool
	 */
	private function is_woodmart_update( $options ) {
		if ( empty( $options['type'] ) || 'theme' !== $options['type'] || empty( $options['action'] ) || 'update' !== $options['action'] ) {
			return false;
		}

		$themes = ! empty( $options['themes'] ) && is_array( $options['themes'] ) ? $options['themes'] : array();

		if ( ! empty( $options['theme'] ) ) {
			$themes[] = $options['theme'];
		}

		return in_array( WOODMART_SLUG, $themes, true );
	}

	/**
	 * Store the one-time redirect flag for a new X.Y release.
	 *
	 * @param string $old_version Previously installed theme version.
	 * @param string $new_version Updated theme version.
	 */
	private function set_redirect_transient( $old_version, $new_version ) {
		if ( ! $old_version || ! $new_version || ! $this->is_new_release( $old_version, $new_version ) ) {
			return;
		}

		set_transient(
			self::UPDATE_TRANSIENT,
			array(
				'old_version' => $old_version,
				'new_version' => $new_version,
				'redirect'    => true,
			),
			DAY_IN_SECONDS
		);
	}
}

new Theme_Update_Redirect();
