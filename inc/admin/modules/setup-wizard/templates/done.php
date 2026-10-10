<?php
/**
 * Done template.
 *
 * @package woodmart
 */

?>

<div class="xts-wizard-content-inner xts-wizard-done">
	<div class="xts-wizard-img">
		<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none">
			<circle cx="70" cy="70" r="70" fill="rgba(var(--xts-primary-color--rgb, 0, 124, 186), 0.15)"/>
			<circle cx="70" cy="70" r="50" fill="var(--xts-primary-color, #3858E9)"/>
			<path d="M60.2812 80.5938L89.1562 51.7188L93 55.5625L60.2812 88.2812L45 73L48.8438 69.1562L60.2812 80.5938Z" fill="white"/>
		</svg>
	</div>

	<h3>
		<?php esc_html_e( 'Everything is ready!', 'woodmart' ); ?>
	</h3>

	<p>
		<?php
		esc_html_e(
			'Congratulations! The theme is successfully installed and ready to go. You can now customize your pages, configure theme settings, and start adding products to create the perfect online store.',
			'woodmart'
		);
		?>
	</p>

	<?php if ( ! woodmart_is_license_activated() ) : ?>
		<div class="xts-subscribe-form-wrap">
			<h4><?php esc_html_e( 'Get essential setup tips, tutorials, and updates directly in your inbox', 'woodmart' ); ?></h4>
			<?php
			$subscription_source = 'setup_wizard';
			include get_parent_theme_file_path( WOODMART_FRAMEWORK . '/admin/modules/dashboard/templates/subscription.php' );
			?>
		</div>
	<?php endif; ?>

	<div class="xts-step-actions">
		<a class="xts-btn xts-color-primary xts-i-theme-settings<?php echo ! woodmart_is_license_activated() ? ' xts-not-subscribed' : ''; ?>" href="<?php echo esc_url( admin_url( 'admin.php?page=xts_dashboard' ) ); ?>">
			<?php esc_html_e( 'Start customizing', 'woodmart' ); ?>
		</a>
		<a class="xts-inline-btn xts-color-primary" href="<?php echo esc_url( get_home_url() ); ?>">
			<?php esc_html_e( 'Close and view website', 'woodmart' ); ?>
		</a>
	</div>
</div>
