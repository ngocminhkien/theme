<?php
/**
 * Layout settings for Elementor editor.
 *
 * @package woodmart
 */

use Elementor\Controls_Manager;
use Elementor\Core\Base\Document;

if ( ! function_exists( 'woodmart_register_layout_preview_controls' ) ) {
	/**
	 * Register Editor preview controls for single woodmart_layout types.
	 *
	 * @param Document $document The document instance.
	 */
	function woodmart_register_layout_preview_controls( $document ) {
		if ( ! method_exists( $document, 'get_main_id' ) ) {
			return;
		}

		$post_id = $document->get_main_id();

		if ( ! $post_id || 'woodmart_layout' !== get_post_type( $post_id ) ) {
			return;
		}

		$layout_type = get_post_meta( $post_id, 'wd_layout_type', true );

		$configs = array(
			'single_product'   => array(
				'label'     => esc_html__( 'Product', 'woodmart' ),
				'post_type' => 'product',
			),
			'single_post'      => array(
				'label'     => esc_html__( 'Post', 'woodmart' ),
				'post_type' => 'post',
			),
			'single_portfolio' => array(
				'label'     => esc_html__( 'Portfolio project', 'woodmart' ),
				'post_type' => 'portfolio',
			),
		);

		if ( ! isset( $configs[ $layout_type ] ) ) {
			return;
		}

		$config  = $configs[ $layout_type ];
		$meta_id = absint( get_post_meta( $post_id, 'wd_preview_post', true ) );

		$document->start_controls_section(
			'wd_layout_preview_section',
			array(
				'label' => esc_html__( 'Editor preview', 'woodmart' ),
				'tab'   => Controls_Manager::TAB_SETTINGS,
			)
		);

		$document->add_control(
			'wd_preview_post',
			array(
				'label'             => $config['label'],
				'type'              => 'wd_autocomplete',
				'default'           => $meta_id ? $meta_id : '',
				'post_type'         => $config['post_type'],
				'search'            => 'woodmart_get_posts_by_query',
				'render'            => 'woodmart_get_posts_title_by_id',
				'description'       => esc_html__( 'Choose a specific item to use as preview in the editor.', 'woodmart' ),
				'wd_reload_preview' => true,
			)
		);

		$document->end_controls_section();
	}

	add_action( 'elementor/documents/register_controls', 'woodmart_register_layout_preview_controls', 10, 1 );
}

if ( ! function_exists( 'woodmart_save_layout_preview_from_elementor' ) ) {
	/**
	 * Save the wd_preview_post meta when an Elementor woodmart_layout document is saved.
	 *
	 * @param \Elementor\Core\Base\Document $document The document instance.
	 * @param array                         $data     The document data.
	 */
	function woodmart_save_layout_preview_from_elementor( $document, $data ) {
		$post_id = $document->get_main_id();

		if ( 'woodmart_layout' !== get_post_type( $post_id ) ) {
			return;
		}

		$layout_type = get_post_meta( $post_id, 'wd_layout_type', true );

		if ( ! in_array( $layout_type, array( 'single_product', 'single_post', 'single_portfolio' ), true ) ) {
			return;
		}

		if ( ! isset( $data['settings']['wd_preview_post'] ) ) {
			return;
		}

		$value = $data['settings']['wd_preview_post'];

		if ( is_array( $value ) ) {
			$preview_id = ! empty( $value ) ? absint( reset( $value ) ) : 0;
		} else {
			$preview_id = absint( $value );
		}

		if ( $preview_id ) {
			update_post_meta( $post_id, 'wd_preview_post', $preview_id );
		} else {
			delete_post_meta( $post_id, 'wd_preview_post' );
		}
	}

	add_action( 'elementor/document/after_save', 'woodmart_save_layout_preview_from_elementor', 10, 2 );
}
