<?php
/**
 * Woodmart WooCommerce Adjacent Products Class
 *
 * @since   2.4.3
 * @package woodmart
 */

namespace XTS\Modules;

use WC_Product;
use WP_Post;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WC_Adjacent_Products' ) ) :
	/**
	 * The Woodmart WooCommerce Adjacent Products Class
	 */
	class WC_Adjacent_Products {

		/**
		 * The current product ID.
		 *
		 * @var int|null
		 */
		private $current_product = null;

		/**
		 * Whether post should be in a same taxonomy term.
		 *
		 * @var bool
		 */
		private $in_same_term = false;

		/**
		 * List of excluded term IDs.
		 *
		 * @var string
		 */
		private $excluded_terms = '';

		/**
		 * Taxonomy slug.
		 *
		 * @var string
		 */
		private $taxonomy = 'product_cat';

		/**
		 * Whether to retrieve previous product.
		 *
		 * @var bool
		 */
		private $previous = false;

		/**
		 * Constructor.
		 *
		 * @since 2.4.3
		 *
		 * @param bool         $in_same_term Optional. Whether post should be in a same taxonomy term. Default false.
		 * @param array|string $excluded_terms Optional. Comma-separated list of excluded term IDs. Default empty.
		 * @param string       $taxonomy Optional. Taxonomy, if $in_same_term is true. Default 'product_cat'.
		 * @param bool         $previous Optional. Whether to retrieve previous product. Default false.
		 */
		public function __construct( $in_same_term = false, $excluded_terms = '', $taxonomy = 'product_cat', $previous = false ) {
			$this->in_same_term   = $in_same_term;
			$this->excluded_terms = $excluded_terms;
			$this->taxonomy       = $taxonomy;
			$this->previous       = $previous;
		}

		/**
		 * Get adjacent product or circle back to the first/last valid product.
		 *
		 * @since 2.4.3
		 *
		 * @return WC_Product|false Product object if successful. False if no valid product is found.
		 */
		public function get_product() {
			global $post;

			$product               = false;
			$this->current_product = $post->ID;

			// Try to get a valid product via `get_adjacent_post()`.
			$iteration      = 0;
			$visited_ids    = array();
			$max_iterations = max( 1, absint( apply_filters( 'woodmart_adjacent_products_max_iterations', 10 ) ) );

			// phpcs:ignore WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition
			while ( $iteration < $max_iterations && $adjacent = $this->get_adjacent() ) {
				$iteration++;

				if ( isset( $visited_ids[ $adjacent->ID ] ) ) {
					break;
				}

				$visited_ids[ $adjacent->ID ] = true;

				$product = wc_get_product( $adjacent->ID );

				if ( $product && $product->is_visible() ) {
					break;
				}

				$product               = false;
				$this->current_product = $adjacent->ID;
			}

			if ( $product ) {
				return $product;
			}

			// No valid product found; Query WC for first/last product.
			$product = $this->query_wc();

			if ( $product ) {
				return $product;
			}

			return false;
		}

		/**
		 * Get adjacent post.
		 *
		 * @since 2.4.3
		 *
		 * @return WP_POST|false Post object if successful. False if no valid post is found.
		 */
		private function get_adjacent() {
			$direction = $this->previous ? 'previous' : 'next';

			add_filter( 'get_' . $direction . '_post_join', array( $this, 'filter_post_join' ) );
			add_filter( 'get_' . $direction . '_post_where', array( $this, 'filter_post_where' ) );

			$adjacent = get_adjacent_post( $this->in_same_term, $this->excluded_terms, $this->previous, $this->taxonomy );

			remove_filter( 'get_' . $direction . '_post_join', array( $this, 'filter_post_join' ) );
			remove_filter( 'get_' . $direction . '_post_where', array( $this, 'filter_post_where' ) );

			return $adjacent;
		}

		/**
		 * Adds the WooCommerce product lookup table to an adjacent post query.
		 *
		 * @since 8.6.0
		 *
		 * @param string $join The `JOIN` clause in the SQL.
		 *
		 * @return string Filtered `JOIN` clause.
		 */
		public function filter_post_join( $join ) {
			global $wpdb;

			if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
				$join .= " INNER JOIN {$wpdb->wc_product_meta_lookup} AS wd_product_lookup ON wd_product_lookup.product_id = p.ID";
			}

			return $join;
		}

		/**
		 * Filters the WHERE clause in the SQL for an adjacent post query, replacing the
		 * date with date of the next post to consider.
		 *
		 * @since 2.4.3
		 *
		 * @param string $where The `WHERE` clause in the SQL.
		 *
		 * @return string Filtered `WHERE` clause.
		 */
		public function filter_post_where( $where ) {
			global $post, $wpdb;

			$current_post = get_post( $this->current_product );

			if ( ! $post instanceof WP_Post || ! $current_post instanceof WP_Post ) {
				return $where;
			}

			$where = str_replace( $post->post_date, $current_post->post_date, $where );

			$where = preg_replace(
				'/AND\s+p\.ID\s*[<>=]+\s*\d+/',
				sprintf( 'AND p.ID %s %d', $this->previous ? '<' : '>', $current_post->ID ),
				$where,
				1
			);

			if ( 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' ) ) {
				$where .= $wpdb->prepare( ' AND wd_product_lookup.stock_status <> %s', 'outofstock' );
			}

			$product_visibility_terms = wc_get_product_visibility_term_ids();
			$exclude_from_catalog_id  = isset( $product_visibility_terms['exclude-from-catalog'] ) ? absint( $product_visibility_terms['exclude-from-catalog'] ) : 0;

			if ( $exclude_from_catalog_id ) {
				$where .= $wpdb->prepare(
					" AND NOT EXISTS (
						SELECT 1
						FROM {$wpdb->term_relationships} AS wd_product_visibility
						WHERE wd_product_visibility.object_id = p.ID
						AND wd_product_visibility.term_taxonomy_id = %d
					)",
					$exclude_from_catalog_id
				);
			}

			return $where;
		}

		/**
		 * Query WooCommerce for either the first or last products.
		 *
		 * @since 2.4.3
		 *
		 * @return WC_Product|false Post object if successful. False if no valid post is found.
		 */
		private function query_wc() {
			global $post;

			$args = array(
				'limit'      => 2,
				'visibility' => 'catalog',
				'exclude'    => array( $post->ID ),
				'orderby'    => 'date',
				'status'     => 'publish',
			);

			if ( ! $this->previous ) {
				$args['order'] = 'ASC';
			}

			if ( $this->in_same_term ) {
				$terms = get_the_terms( $post->ID, $this->taxonomy );

				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					$args['category'] = wp_list_pluck( $terms, 'slug' );
				}
			}

			$products = wc_get_products( apply_filters( 'woodmart_woocommerce_adjacent_query_args', $args ) );

			// At least 2 results are required, otherwise previous/next will be the same.
			if ( ! empty( $products ) && count( $products ) >= 2 ) {
				return $products[0];
			}

			return false;
		}
	}

endif;
