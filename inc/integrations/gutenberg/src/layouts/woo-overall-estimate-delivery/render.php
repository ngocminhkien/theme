<?php
/**
 * WooCommerce Overall Estimate Delivery block render.
 *
 * @package woodmart
 */

use XTS\Modules\Layouts\Main;
use XTS\Modules\Estimate_Delivery\Overall_Delivery_Date;

if ( ! function_exists( 'wd_gutenberg_woo_overall_estimate_delivery' ) ) {
	/**
	 * Render WooCommerce Overall Estimate Delivery block.
	 *
	 * @param array  $block_attributes Block attributes.
	 * @param string $content Inner block content.
	 * @return string
	 */
	function wd_gutenberg_woo_overall_estimate_delivery( $block_attributes, $content ) {
		if ( ! woodmart_woocommerce_installed() || ! woodmart_get_opt( 'estimate_delivery_enabled' ) ) {
			return '';
		}

		$wrapper_classes = ' wd-style-' . $block_attributes['style'];

		if ( isset( $block_attributes['iconType'] ) && 'icon' === $block_attributes['iconType'] && $content ) {
			$wrapper_classes .= ' wd-with-icon';
		}

		Main::setup_preview();

		$products = array();

		if ( isset( WC()->cart ) ) {
			foreach ( WC()->cart->get_cart() as $cart_item ) {
				if ( isset( $cart_item['data'] ) ) {
					$products[] = $cart_item['data'];
				}
			}
		}

		$overall_dates        = new Overall_Delivery_Date( $products );
		$delivery_date_string = $overall_dates->get_date_string();

		Main::restore_preview();

		if ( empty( $delivery_date_string ) ) {
			return '';
		}

		if ( ! $content ) {
			$content = '<span class="wd-info-icon"></span>';
		}
		ob_start();

		woodmart_enqueue_inline_style( 'woo-mod-product-info' );
		woodmart_enqueue_inline_style( 'woo-opt-est-del' );

		woodmart_enqueue_js_script( 'estimate-delivery-on-block-cart' );

		?>
		<div class="wd-overall-est-del<?php echo esc_attr( wd_get_gutenberg_element_classes( $block_attributes ) ); ?>">
			<div class="wd-product-info wd-est-del<?php echo esc_attr( $wrapper_classes ); ?>">
				<?php echo do_shortcode( $content ); ?>
				<span class="wd-info-msg"><?php echo wp_kses( $delivery_date_string, 'strong' ); ?></span>
				<div class="wd-loader-overlay wd-fill"></div>
			</div>
		</div>
		<?php

		return ob_get_clean();
	}
}