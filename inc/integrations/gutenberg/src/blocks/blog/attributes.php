<?php
/**
 * Blog block attributes.
 *
 * @package woodmart
 */

use XTS\Gutenberg\Block_Attributes;

if ( ! function_exists( 'wd_get_block_blog_attrs' ) ) {
	/**
	 * Get blog block attributes.
	 *
	 * @return array
	 */
	function wd_get_block_blog_attrs() {
		$attr = new Block_Attributes();

		$attr->add_attr(
			array(
				'show_title'           => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'post_type'            => array(
					'type'    => 'string',
					'default' => 'post',
				),
				'categoriesIds'        => array(
					'type' => 'string',
				),
				'tagsIds'              => array(
					'type' => 'string',
				),
				'include'              => array(
					'type' => 'string',
				),
				'items_per_page'       => array(
					'type'    => 'string',
					'default' => '12',
				),
				'pagination'           => array(
					'type' => 'string',
				),
				'layout'               => array(
					'type'    => 'string',
					'default' => 'grid',
				),
				'blog_carousel_design' => array(
					'type'    => 'string',
					'default' => 'masonry',
				),
				'blog_list_design'     => array(
					'type'    => 'string',
					'default' => 'default',
				),
				'blog_grid_design'     => array(
					'type'    => 'string',
					'default' => 'masonry',
				),
				'blog_columns'         => array(
					'type'       => 'number',
					'default'    => 3,
					'responsive' => true,
				),
				'blog_spacing'         => array(
					'type'       => 'string',
					'default'    => '20',
					'responsive' => true,
				),
				'blog_masonry'         => array(
					'type' => 'boolean',
				),
				'parts_title'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'parts_meta'           => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'parts_categories'     => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'parts_text'           => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'parts_btn'            => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'parts_published_date' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'orderby'              => array(
					'type' => 'string',
				),
				'order'                => array(
					'type' => 'string',
				),
				'meta_key'             => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
					'type' => 'string',
				),
				'offset'               => array(
					'type' => 'string',
				),
				'exclude'              => array(
					'type' => 'string',
				),
				'img_size'             => array(
					'type'    => 'string',
					'default' => 'medium',
				),
				'imgSizeCustomWidth'   => array(
					'type' => 'string',
				),
				'imgSizeCustomHeight'  => array(
					'type' => 'string',
				),
			)
		);

		wd_get_advanced_tab_attrs( $attr );
		wd_get_carousel_settings_attrs( $attr );

		return $attr->get_attr();
	}
}
