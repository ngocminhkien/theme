<?php
/**
 * Dashboard page template.
 *
 * @package woodmart
 */

$woocommerce_onboarding = get_option( 'woocommerce_onboarding_profile', array() );

?>
<div class="xts-welcome-page">

	<?php if ( woodmart_get_opt( 'white_label' ) ) : ?>
		<div class="xts-box xts-white-label-box xts-theme-style">
			<div class="xts-box-content">
				<h3>
					<?php if ( woodmart_get_opt( 'white_label_dashboard_title' ) ) : ?>
						<?php echo esc_html( woodmart_get_opt( 'white_label_dashboard_title' ) ); ?>
					<?php else : ?>
						<?php esc_html_e( 'Welcome to WoodMart dashboard', 'woodmart' ); ?>
					<?php endif; ?>
				</h3>
				<div class="xts-about-text">
					<?php if ( woodmart_get_opt( 'white_label_dashboard_text' ) ) : ?>
						<?php echo do_shortcode( wpautop( woodmart_get_opt( 'white_label_dashboard_text' ) ) ); ?>
					<?php else : ?>
						<?php esc_html_e( 'Thank you for choosing WoodMart, our premium eCommerce theme! Get started building your stunning online store by easily importing one of our prebuilt demo sites and customizing the theme options to match your needs.', 'woodmart' ); ?>
					<?php endif; ?>
				</div>
			</div>
		</div>
	<?php else : ?>
		<div class="xts-box xts-welcome-box xts-theme-style xts-color-scheme-light">
			<div class="xts-box-content">
				<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/banner.png' ); ?>" alt="banner">

				<h3>
					<?php esc_html_e( 'Welcome to WoodMart', 'woodmart' ); ?>
				</h3>

				<p>
					<?php esc_html_e( 'Thank you for choosing WoodMart, our premium eCommerce theme! Get started building your stunning online store by easily importing one of our prebuilt demo sites and customizing the theme options to match your needs.', 'woodmart' ); ?>
				</p>

				<?php if ( woodmart_get_opt( 'white_label_whats_new_tab', '1' ) ) : ?>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=xts_whats_new' ) ); ?>" class="xts-btn">
						<?php esc_html_e( 'What\'s new', 'woodmart' ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>

		<div class="xts-row xts-welcome-row xts-sp-20 xts-theme-style">
			<?php if ( woodmart_woocommerce_installed() && empty( $woocommerce_onboarding['completed'] ) ) : ?>
				<div class="xts-col-12">
					<div class="xts-box xts-info-boxes xts-woo-setup xts-theme-style">
						<div class="xts-box-content">
							<h4>
								<?php esc_html_e( 'Finish your store configuration', 'woodmart' ); ?>
							</h4>
							<p>
								<?php esc_html_e( 'The theme is ready, but your store is not fully configured yet. Complete the WooCommerce wizard to set up payment methods, taxes, and shipping.', 'woodmart' ); ?>
							</p>
							<a href="<?php echo esc_url( wc_admin_url( '&path=/setup-wizard' ) ); ?>" class="xts-btn xts-color-primary xts-i-button-right">
								<?php esc_html_e( 'Complete WooCommerce setup', 'woodmart' ); ?>
							</a>
							<div class="xts-woo-img">
								<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 85.9 47.6">
									<path fill="#f3f1f1" d="M77.4,0.1c-4.3,0-7.1,1.4-9.6,6.1L56.4,27.7V8.6c0-5.7-2.7-8.5-7.7-8.5s-7.1,1.7-9.6,6.5L28.3,27.7V8.8  c0-6.1-2.5-8.7-8.6-8.7H7.3C2.6,0.1,0,2.3,0,6.3s2.5,6.4,7.1,6.4h5.1v24.1c0,6.8,4.6,10.8,11.2,10.8S33,45,36.3,38.9l7.2-13.5v11.4  c0,6.7,4.4,10.8,11.1,10.8s9.2-2.3,13-8.7l16.6-28c3.6-6.1,1.1-10.8-6.9-10.8C77.3,0.1,77.3,0.1,77.4,0.1z"/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			<?php endif; ?>

			<?php do_action( 'woodmart_after_welcome_box_content' ); ?>

			<div class="xts-col-12 xts-col-xl-6">
				<div class="xts-box xts-info-boxes xts-support xts-align-center">
					<div class="xts-box-content">
						<h4>
							<?php esc_html_e( 'Need assistance?', 'woodmart' ); ?>
						</h4>

						<p>
							<?php esc_html_e( 'Check out these links for more information and support!', 'woodmart' ); ?>
						</p>

						<div class="xts-row">
							<div class="xts-col">
								<div class="xts-info-box-img">
									<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/docs.jpg' ); ?>" alt="documentation banner">
								</div>
								<a href="https://go.xtemos.com/documentation?utm_source=woodmart_dashboard&utm_medium=referral&utm_campaign=need_assistance&utm_content=documentation" class="xts-bordered-btn xts-color-default" target="_blank">
									<?php esc_html_e( 'Documentation', 'woodmart' ); ?>
								</a>
							</div>

							<div class="xts-col">
								<div class="xts-info-box-img">
									<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/video.jpg' ); ?>" alt="video banner">
								</div>
								<a href="https://go.xtemos.com/videos?utm_source=woodmart_dashboard&utm_medium=referral&utm_campaign=need_assistance&utm_content=video" class="xts-bordered-btn xts-color-default" target="_blank">
									<?php esc_html_e( 'Video tutorials', 'woodmart' ); ?>
								</a>
							</div>

							<div class="xts-col">
								<div class="xts-info-box-img">
									<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/forum.jpg' ); ?>" alt="forum banner">
								</div>
								<a href="https://go.xtemos.com/support?utm_source=woodmart_dashboard&utm_medium=referral&utm_campaign=need_assistance&utm_content=forum" class="xts-bordered-btn xts-color-default" target="_blank">
									<?php esc_html_e( 'Support', 'woodmart' ); ?>
								</a>
							</div>

							<div class="xts-col">
								<div class="xts-info-box-img">
									<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/dashboard/vote.jpg' ); ?>" alt="facebook banner">
								</div>
								<a href="https://go.xtemos.com/facebook-community?utm_source=woodmart_dashboard&utm_medium=referral&utm_campaign=need_assistance&utm_content=facebook" class="xts-bordered-btn xts-color-default" target="_blank">
									<?php esc_html_e( 'Facebook community', 'woodmart' ); ?>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div class="xts-box xts-theme-style xts-info-boxes xts-subscribe xts-align-center">
					<div class="xts-box-content">
						<h4>
							<?php esc_html_e( 'Stay up to date with WoodMart', 'woodmart' ); ?>
						</h4>

						<p>
							<?php esc_html_e( 'Get new feature announcements, useful tutorials and important WoodMart news by email.', 'woodmart' ); ?>
						</p>
						<?php
						$subscription_source = 'dashboard';
						include get_parent_theme_file_path( WOODMART_FRAMEWORK . '/admin/modules/dashboard/templates/subscription.php' );
						?>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>

</div>
