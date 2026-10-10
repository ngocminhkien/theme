<?php
/**
 * Dashboard email subscription form.
 *
 * @package woodmart
 */

wp_enqueue_script( 'xts-dashboard-subscription', WOODMART_ASSETS . '/js/dashboardSubscription.js', array(), WOODMART_VERSION, true );

$subscription_source = isset( $subscription_source ) ? sanitize_key( $subscription_source ) : 'woodmart_dashboard';
?>

<form
	class="xts-subscribe-form"
	data-endpoint="<?php echo esc_url( WOODMART_API_URL . 'email-subscriptions' ); ?>"
	data-success-message="<?php esc_attr_e( 'Thank you! You have successfully subscribed to WoodMart updates.', 'woodmart' ); ?>"
	data-error-message="<?php esc_attr_e( 'Something went wrong. Please try again later.', 'woodmart' ); ?>"
>
	<input type="hidden" name="source" value="<?php echo esc_attr( $subscription_source ); ?>">

	<div class="xts-subscribe-fields">
		<div class="xts-advanced-field">
			<input
				id="xts-subscribe-email"
				type="email"
				name="email"
				placeholder="wordpress@example.com"
				autocomplete="email"
				required
			>
			<label for="xts-subscribe-email"><?php esc_html_e( 'Enter your email address', 'woodmart' ); ?></label>
		</div>

		<button type="submit" class="xts-btn xts-color-primary">
			<?php esc_html_e( 'Subscribe', 'woodmart' ); ?>
		</button>
	</div>

	<div class="xts-subscribe-message xts-notice" role="status" aria-live="polite"></div>
</form>
