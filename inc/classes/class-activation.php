<?php
/**
 * Activate theme.
 *
 * @package woodmart
 */

namespace XTS; // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Activate theme.
 */
class Activation {
	private $_api             = null;
	private $_notices         = null;

	function __construct() {
		$this->_api     = Registry::get_instance()->api;
		$this->_notices = Registry::get_instance()->notices;

		add_action( 'admin_init', array( $this, 'process_form' ) );
	}

	/**
	 * License page template.
	 *
	 * @return void
	 */
	public function form() {
		$classes = 'xts-box xts-license xts-theme-style';

		if ( woodmart_is_license_activated() ) {
			$classes .= ' xts-activated';
		}
		?>
		<div class="<?php echo esc_attr( $classes ); ?>">
			<div class="xts-box-header">
				<h3>
					<?php esc_html_e( 'Theme license', 'woodmart' ); ?>
				</h3>
			</div>

			<div class="xts-box-content">
				<div class="xts-row">
					<div class="xts-col-12 xts-col-xl-5 xts-license-img">
						<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/license.svg' ); ?>" alt="license banner">
					</div>

					<div class="xts-col-12 xts-col-xl-7 xts-license-content">

						<?php $this->_notices->show_msgs(); ?>

						<?php if ( woodmart_is_license_activated() ) : ?>
							<div class="xts-activated-message">
								<h3 class="xts-activated-title xts-i-check">
									<?php esc_html_e( 'Theme license is activated', 'woodmart' ); ?>
								</h3>

								<p class="xts-licanse-setup-label">
									<?php echo esc_html__( 'Now you are able to get automatic updates for our theme via', 'woodmart' ); ?> <strong><?php esc_html_e( 'Appearance → Themes', 'woodmart' ); ?></strong> <?php esc_html_e( 'or', 'woodmart' ); ?> <strong><?php esc_html_e( 'Dashboard → Updates', 'woodmart' ); ?></strong>. <?php esc_html_e( 'Once the theme installation is complete, you can also deactivate this domain on the', 'woodmart' ); ?> <strong><?php esc_html_e( 'Theme License', 'woodmart' ); ?></strong> <?php esc_html_e( 'page if you plan to transfer your website to a different domain or server.', 'woodmart' ); ?>
								</p>
								<p class="xts-licanse-dashboard-label">
									<?php
										printf(
											'%s <a href="' . esc_url( admin_url( 'themes.php' ) ) . '">%s</a> %s <a href="' . esc_url( admin_url( 'update-core.php?force-check=1' ) ) . '">%s</a>.%s',
											esc_html__( 'Now you are able to get automatic updates for our theme via', 'woodmart' ),
											esc_html__( 'Appearance → Themes', 'woodmart' ),
											esc_html__( 'or via', 'woodmart' ),
											esc_html__( 'Dashboard → Updates', 'woodmart' ),
											esc_html__( ' You can click this button to deactivate your license code from this domain if you are going to transfer your website to some other domain or server.', 'woodmart' )
										);
									?>
								</p>

								<?php if ( get_option( 'woodmart_dev_domain', false ) ) : ?>
									<div class="xts-notice xts-info xts-license-dev">
										<span class="xts-i-alert-info"></span>
										<?php echo esc_html__( 'Activated on development website.', 'woodmart' ); ?>
									</div>
								<?php endif; ?>

								<form action="" class="xts-form xts-activation-form" method="post">
									<?php wp_nonce_field( 'xts-license-deactivation' ); ?>
									<input type="hidden" name="purchase-code-deactivate" value="1"/>
									<div class="xts-license-btn xts-deactivate-btn xts-i-close">
										<input class="xts-btn xts-color-warning" type="submit" value="<?php esc_attr_e( 'Deactivate theme', 'woodmart' ); ?>" />
									</div>
								</form>
							</div>
						<?php else : ?>
							<?php if ( ! woodmart_get_opt( 'white_label' ) ) : ?>
								<div class="xts-license-label">
									<p>
										<?php esc_html_e( 'Activate your purchase code for this domain to enable automatic updates.', 'woodmart' ); ?>
									</p>

									<span>
										<span class="xts-hint">
											<span class="xts-tooltip xts-top xts-top-left">
												<span class="xts-tooltip-inner xts-scroll">
													<strong><?php esc_html_e( 'How to find your Envato Market purchase code', 'woodmart' ); ?>:</strong>
													<ol>
														<li><?php echo wp_kses( __( 'Log in to Envato Market and open <a href="https://themeforest.net/downloads" target="_blank">Downloads<span class="dashicons dashicons-external"></span></a>.', 'woodmart' ), array( 'a' => array( 'href' => array(), 'target' => array() ), 'span' => array( 'class' => array() ) ) ); ?></li>
														<li><?php echo wp_kses( __( 'Find the theme and click <em>Download → License certificate & purchase code</em>.', 'woodmart' ), array( 'em' => array() ) ); ?></li>
														<li><?php esc_html_e( 'Open the downloaded file to copy your purchase code.', 'woodmart' ); ?></li>
													</ol>
													<a href="#" class="xts-license-popup-opener">
														<img class="xts-purchase-code-img" src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/purchase-code.jpg' ); ?>" alt="<?php esc_attr_e( 'How to find purchase code', 'woodmart' ); ?>">
													</a>
												</span>
											</span>
										</span>
										<span><?php esc_html_e( 'Where is my code?', 'woodmart' ); ?></span>
									</span>
								</div>
							<?php endif; ?>
							<form action="" class="xts-form xts-activation-form" method="post">
								<?php wp_nonce_field( 'xts-license-activation' ); ?>

								<input type="hidden" name="source" value="<?php echo ! empty( $_GET['step'] ) ? 'setup_wizard' : 'license'; // phpcs:ignore ?>"/>

								<div class="xts-activation-form-inner xts-advanced-field">
									<input type="text" name="purchase-code" placeholder="14dcd648-68ea-48c0-865b-084662061e45" id="purchase-code" value="<?php echo esc_attr( isset( $_REQUEST['purchase-code'] ) ? $_REQUEST['purchase-code'] : '' ); ?>" required>
									<label for="purchase-code"><?php esc_html_e( 'Enter your purchase code', 'woodmart' ); ?><span class="required">*</span></label>
								</div>

								<div class="xts-activation-form-inner xts-advanced-field">
									<input type="email" name="email" class="xts-activation-email" placeholder="wordpress@example.com" id="email" value="<?php echo esc_attr( isset( $_REQUEST['email'] ) ? $_REQUEST['email'] : '' ); // phpcs:ignore ?>">
									<label for="email"><?php esc_html_e( 'Enter your email address', 'woodmart' ); ?><span class="required">*</span></label>
								</div>

								<div class="xts-dev-domain-agree">
									<label for="xts-dev-domain-label">
										<input id="xts-dev-domain-label" type="checkbox" name="xts-dev-domain" <?php checked( isset( $_REQUEST['xts-dev-domain'] ) && $_REQUEST['xts-dev-domain'], '1' ); // phpcs:ignore ?> value="1">
										<?php esc_html_e( 'This is a development domain', 'woodmart' ); ?>
									</label>

									<div class="xts-hint">
										<div class="xts-tooltip xts-top">
											<?php esc_html_e( 'A regular license allows using the theme on one domain. However, you can also activate it on one development/staging domain at the same time to receive automatic updates.', 'woodmart' ); ?>
										</div>
									</div>
								</div>

								<div class="xts-subscription-agree">
									<label for="xts-subscription" class="agree-label">
										<input id="xts-subscription" class="xts-activation-subscription" type="checkbox" name="xts-subscription" <?php checked( isset( $_REQUEST['xts-subscription'] ) && $_REQUEST['xts-subscription'], '1' ); // phpcs:ignore ?>>
										<?php esc_html_e( 'Receive WoodMart updates, tutorials, and news in your inbox', 'woodmart' ); ?>
									</label>
								</div>

								<div class="xts-license-btn xts-activate-btn xts-i-key">
									<input class="xts-btn xts-color-primary" name="woodmart-purchase-code" type="submit" value="<?php esc_attr_e( 'Activate theme', 'woodmart' ); ?>" />
								</div>

								<div class="xts-activation-terms">
									<?php
									echo wp_kses(
										__( 'By activating the theme, you agree to our <a href="https://go.xtemos.com/terms" target="_blank">Terms</a> and <a href="https://go.xtemos.com/privacy-policy" target="_blank">Privacy Policy</a>.', 'woodmart' ),
										array(
											'a' => array(
												'href'   => array(),
												'target' => array(),
											),
										)
									);
									?>
								</div>
							</form>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>

		<?php if ( ! woodmart_get_opt( 'white_label' ) ) : ?>
			<div class="xts-popup-holder xts-license-popup-holder">
				<div class="xts-popup-overlay"></div>
				<div class="xts-popup xts-size-l xts-theme-style">
					<div class="xts-popup-inner">
						<div class="xts-popup-header">
							<div class="xts-popup-title">
								<?php esc_html_e( 'How to find your Envato Market purchase code', 'woodmart' ); ?>
							</div>
							<a href="#" class="xts-popup-close xts-i-close">
								<?php esc_html_e( 'Close', 'woodmart' ); ?>
							</a>
						</div>
						<div class="xts-popup-content">
							<img class="xts-purchase-code-img" src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/purchase-code.jpg' ); ?>" alt="<?php esc_attr_e( 'How to find purchase code', 'woodmart' ); ?>">
						</div>
					</div>
				</div>
			</div>
		<?php endif; ?>
		<?php
	}

	/**
	 * Process activate theme.
	 *
	 * @return void
	 */
	public function process_form() {
		if ( isset( $_POST['purchase-code-deactivate'] ) ) {
			check_admin_referer( 'xts-license-deactivation' );
			$this->deactivate();
			$this->_notices->add_success( esc_html__( 'Theme license deactivated successfully.', 'woodmart' ) );
			return;
		}

		if ( empty( $_POST['purchase-code'] ) ) {
			return;
		}
		check_admin_referer( 'xts-license-activation' );

		$code         = sanitize_text_field( $_POST['purchase-code'] ); // phpcs:ignore
		$email        = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
		$dev          = (int) ( isset( $_POST['xts-dev-domain'] ) && $_POST['xts-dev-domain'] ); // phpcs:ignore
		$subscription = (int) ( isset( $_POST['xts-subscription'] ) && $_POST['xts-subscription'] ); // phpcs:ignore
		$source       = isset( $_POST['source'] ) ? sanitize_text_field( $_POST['source'] ) : ''; // phpcs:ignore

		$response = $this->_api->call(
			'activate?key=' . $code,
			array(
				'domain'       => get_site_url(),
				'theme'        => WOODMART_SLUG,
				'dev'          => $dev,
				'email'        => $email,
				'subscription' => $subscription,
				'source'       => $source,
			),
			'post'
		);

		if ( is_wp_error( $response ) ) {
			$this->_notices->add_error( esc_html__( 'The API server can\'t be reached. Please contact your hosting provider to check the connectivity with our xtemos.com server. If you need further help, please contact our support center too.', 'woodmart' ) );
			return;
		}

		$data = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $data['errors'] ) ) {
			$this->_notices->add_error( $data['errors'] );
			return;
		}

		if ( ( isset( $data['code'] ) && 'rest_forbidden' === $data['code'] ) || empty( $data['verified'] ) ) {
			$this->_notices->add_error( __( 'The purchase code is invalid. <a target="_blank" href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code-">Where can I get my purchase code?</a>', 'woodmart' ) );
			return;
		}

		$this->activate( $code, $data['token'], $dev );
	}

	/**
	 * Activate theme.
	 *
	 * @param string $purchase Theme token.
	 * @param string $token Purchase code.
	 * @param int    $dev Is developer activation? Set 1 or 0.
	 *
	 * @return void
	 */
	public function activate( $purchase, $token, $dev ) {
		update_option( 'woodmart_token', $token );
		update_option( 'woodmart_is_activated', true );
		update_option( 'woodmart_dev_domain', $dev );
	}

	/**
	 * Deactivated theme.
	 *
	 * @return void
	 */
	public function deactivate() {
		$this->_api->call( 'deactivate/?token=' . get_option( 'woodmart_token' ) );

		delete_option( 'woodmart_token' );
		delete_option( 'woodmart_is_activated' );
		delete_option( 'woodmart-update-time' );
		delete_option( 'woodmart-update-info' );
		delete_option( 'woodmart_dev_domain' );
	}
}
