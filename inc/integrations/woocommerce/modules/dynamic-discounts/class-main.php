<?php
/**
 * Dynamic discounts class.
 *
 * @package woodmart
 */

namespace XTS\Modules\Dynamic_Discounts;

use XTS\Admin\Modules\Options;
use WC_Cart;

/**
 * Dynamic discounts class.
 */
class Main {
	/**
	 * Make sure that the same discount is not applied twice for the same product.
	 *
	 * @var array A list of product IDs for which a discount has already been applied.
	 */
	public $applied = array();

	/**
	 * Cache of summed quantities per parent product ID (individual_product mode).
	 * Null means not yet built for the current cart calculation.
	 *
	 * @var array|null
	 */
	private $variations_quantity = null;

	/**
	 * Cache of summed quantities per discount rule ID (cart_items mode).
	 * Null means not yet built for the current cart calculation.
	 *
	 * @var array|null
	 */
	private $combined_rule_quantities = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'add_options' ) );

		if ( woodmart_get_opt( 'discounts_enabled' ) ) {
			add_action( 'woocommerce_before_calculate_totals', array( $this, 'calculate_discounts' ), 10, 1 );
		}

		woodmart_include_files(
			__DIR__,
			array(
				'./class-manager',
				'./class-admin',
				'./class-frontend',
			)
		);
	}

	/**
	 * Add options in theme settings.
	 */
	public function add_options() {
		Options::add_field(
			array(
				'id'          => 'discounts_enabled',
				'name'        => esc_html__( 'Enable "Dynamic discounts"', 'woodmart' ),
				'hint'        => wp_kses( '<img data-src="' . WOODMART_TOOLTIP_URL . 'discounts-enabled.jpg" alt="">', true ),
				'description' => esc_html__( 'You can configure your discounts in Dashboard -> Products -> Dynamic Discounts.', 'woodmart' ),
				'group'       => esc_html__( 'Dynamic discounts', 'woodmart' ),
				'type'        => 'switcher',
				'section'     => 'shop_section',
				'default'     => '0',
				'on-text'     => esc_html__( 'Yes', 'woodmart' ),
				'off-text'    => esc_html__( 'No', 'woodmart' ),
				'priority'    => 130,
				'class'       => 'xts-preset-field-disabled',
			)
		);

		Options::add_field(
			array(
				'id'          => 'show_discounts_table',
				'name'        => esc_html__( 'Show discounts table', 'woodmart' ),
				'description' => esc_html__( 'Dynamic pricing table on the single product page.', 'woodmart' ),
				'group'       => esc_html__( 'Dynamic discounts', 'woodmart' ),
				'type'        => 'switcher',
				'section'     => 'shop_section',
				'default'     => '0',
				'on-text'     => esc_html__( 'Yes', 'woodmart' ),
				'off-text'    => esc_html__( 'No', 'woodmart' ),
				'priority'    => 140,
				'class'       => 'xts-preset-field-disabled',
				'requires'    => array(
					array(
						'key'     => 'discounts_enabled',
						'compare' => 'equals',
						'value'   => '1',
					),
				),
			)
		);
	}

	/**
	 * Calculate price with discounts.
	 *
	 * @param WC_Cart $cart WC_Cart class.
	 *
	 * @return void
	 */
	public function calculate_discounts( $cart ) {
		// @codeCoverageIgnoreStart
		// Woocommerce wpml compatibility. Make sure that the discount is calculated only once.
		if ( class_exists( 'woocommerce_wpml' ) && ! defined( 'PAYPAL_API_URL' ) && doing_action( 'woocommerce_cart_loaded_from_session' ) ) {
			return;
		}
		// @codeCoverageIgnoreEnd

		$this->variations_quantity      = null;
		$this->combined_rule_quantities = null;

		$cart_items = $cart->get_cart();

		foreach ( $cart_items as $cart_item_key => $cart_item ) {
			$product        = $cart_item['data'];
			$product_price  = apply_filters( 'woodmart_pricing_before_calculate_discounts', (float) $product->get_price( 'edit' ), $cart_item );
			$original_price = $product_price;
			$discount       = Manager::get_instance()->get_discount_rules( $product );

			if ( ! empty( $this->applied ) && in_array( $product->get_id(), $this->applied, true ) ) {
				continue;
			}

			if ( empty( $product_price ) || empty( $discount ) || isset( $cart_item['wd_is_free_gift'] ) || isset( $cart_item['wd_fbt_bundle_id'] ) ) {
				unset( $cart->cart_contents[ $cart_item_key ]['wd_is_dynamic_discount'] );

				continue;
			}

			$item_quantity = $this->get_item_quantity( $cart_item, $cart_items );

			switch ( $discount['_woodmart_rule_type'] ) {
				case 'bulk':
					foreach ( $discount['discount_rules'] as $key => $discount_rule ) {
						if ( $discount_rule['_woodmart_discount_rules_from'] <= $item_quantity && ( $item_quantity <= $discount_rule['_woodmart_discount_rules_to'] || ( array_key_last( $discount['discount_rules'] ) === $key && empty( $discount_rule['_woodmart_discount_rules_to'] ) ) ) ) {
							$discount_type  = $discount_rule['_woodmart_discount_type'];
							$discount_value = $discount_rule[ '_woodmart_discount_' . $discount_type . '_value' ];

							// @codeCoverageIgnoreStart
							// WPML woocommerce-multilingual compatibility.
							if ( class_exists( 'woocommerce_wpml' ) && 'amount' === $discount_type ) {
								$discount_value = apply_filters( 'woodmart_dynamic_discount_calculated_price_amount', $discount_value );
							}
							// @codeCoverageIgnoreEnd

							$product_price = Manager::get_instance()->get_product_price(
								$product_price,
								array(
									'type'  => $discount_type,
									'value' => $discount_value,
								)
							);
						}
					}
					break;
			}

			$product_price = apply_filters( 'woodmart_pricing_after_calculate_discounts', $product_price, $cart_item );

			if ( $product_price < 0 ) {
				$product_price = 0;
			}

			if ( (float) $product_price === (float) $original_price ) {
				unset( $cart->cart_contents[ $cart_item_key ]['wd_is_dynamic_discount'] );

				continue;
			}

			$product->set_regular_price( $original_price );
			$product->set_price( $product_price );
			$product->set_sale_price( $product_price );

			$cart->cart_contents[ $cart_item_key ]['wd_is_dynamic_discount'] = true;

			$this->applied[] = $product->get_id();
		}
	}

	/**
	 * Resolve the effective item quantity for a cart item based on discount_quantities mode.
	 *
	 * @param array $cart_item  Cart item data.
	 * @param array $cart_items All cart items fetched once from the cart.
	 *
	 * @return int
	 */
	public function get_item_quantity( array $cart_item, array $cart_items ): int {
		$discount = Manager::get_instance()->get_discount_rules( $cart_item['data'] );
		$mode     = ! empty( $discount['discount_quantities'] ) ? $discount['discount_quantities'] : 'individual_variation';

		if ( 'individual_product' === $mode ) {
			return $this->get_item_quantity_individual_product( $cart_item, $cart_items );
		}

		if ( 'cart_items' === $mode ) {
			return $this->get_item_quantity_cart_items( (int) $discount['post_id'], $cart_items );
		}

		return (int) $cart_item['quantity'];
	}

	/**
	 * Effective quantity for individual_product mode: sum across all variations of the same parent.
	 *
	 * For simple products get_parent_id() returns 0, so no cart item matches and the
	 * method falls back to the individual item quantity.
	 *
	 * @param array $cart_item  Current cart item.
	 * @param array $cart_items All cart items.
	 *
	 * @return int
	 */
	private function get_item_quantity_individual_product( array $cart_item, array $cart_items ): int {
		if ( null === $this->variations_quantity ) {
			$this->variations_quantity = $this->build_variations_quantity( $cart_items );
		}

		$parent_id = $cart_item['data']->get_parent_id();

		return $this->variations_quantity[ $parent_id ] ?? (int) $cart_item['quantity'];
	}

	/**
	 * Build a map of parent product ID → total quantity across all cart items.
	 *
	 * @param array $cart_items All cart items.
	 *
	 * @return array
	 */
	private function build_variations_quantity( array $cart_items ): array {
		$result = array();

		foreach ( $cart_items as $item ) {
			$parent_id = (int) $item['product_id'];

			$result[ $parent_id ] = ( $result[ $parent_id ] ?? 0 ) + (int) $item['quantity'];
		}

		return $result;
	}

	/**
	 * Effective quantity for cart_items mode: sum across all items sharing the same discount rule.
	 *
	 * @param int   $rule_id    Discount rule post ID for the current item.
	 * @param array $cart_items All cart items.
	 *
	 * @return int
	 */
	private function get_item_quantity_cart_items( int $rule_id, array $cart_items ): int {
		if ( null === $this->combined_rule_quantities ) {
			$this->combined_rule_quantities = $this->build_combined_rule_quantities( $cart_items );
		}

		return $this->combined_rule_quantities[ $rule_id ] ?? 0;
	}

	/**
	 * Build a map of discount rule ID → total quantity across all cart items that match the rule.
	 *
	 * @param array $cart_items All cart items.
	 *
	 * @return array
	 */
	private function build_combined_rule_quantities( array $cart_items ): array {
		$result = array();

		foreach ( $cart_items as $item ) {
			$item_discount = Manager::get_instance()->get_discount_rules( $item['data'] );

			if ( empty( $item_discount['post_id'] ) ) {
				continue;
			}

			$item_rule_id = (int) $item_discount['post_id'];

			$result[ $item_rule_id ] = ( $result[ $item_rule_id ] ?? 0 ) + (int) $item['quantity'];
		}

		return $result;
	}
}

new Main();
