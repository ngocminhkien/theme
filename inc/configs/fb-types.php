<?php if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );}

/**
 * -------------------------------------------------------------------------------
 * Floating block types
 * -----------------------------------------------------------------------------
 */

return array(
	'popup'          => array(
		'post_type'   => 'wd_popup',
		'label'       => esc_html__( 'Popup', 'woodmart' ),
		'ajax_action' => 'wd_popup_create',
		'prefix'      => 'wd_popup_',
		'options'     => array(
			'version',
			'close_by_selector',
			'animation',
			'close_btn',
			'close_btn_display',
			'hide_popup',
			'hide_popup_tablet',
			'hide_popup_mobile',
			'enable_page_scrolling',
			'close_by_overlay',
			'close_by_esc',
			'persistent_close',
		),
		'create_form' => array(
			'label_text'       => esc_html__( 'Predefined popups', 'woodmart' ),
			'name_label'       => esc_html__( 'Popup name', 'woodmart' ),
			'name_placeholder' => esc_html__( 'Enter popup name', 'woodmart' ),
			'default_name'     => esc_html__( 'Popup', 'woodmart' ),
			'submit_text'      => esc_html__( 'Create popup', 'woodmart' ),
			'templates_label'  => esc_html__( 'Popup templates', 'woodmart' ),
			'preview_alt'      => esc_html__( 'Popup preview', 'woodmart' ),
		),
		'templates'   => array(
			'promotion'    => array(
				'title'   => esc_html__( 'Promotion', 'woodmart' ),
				'layouts' => array(
					'layout-1'  => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2'  => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3'  => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4'  => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5'  => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6'  => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
					'layout-7'  => array(
						'title' => esc_html__( 'Simple7', 'woodmart' ),
					),
					'layout-8'  => array(
						'title' => esc_html__( 'Simple8', 'woodmart' ),
					),
					'layout-9'  => array(
						'title' => esc_html__( 'Simple9', 'woodmart' ),
					),
					'layout-10' => array(
						'title' => esc_html__( 'Simple10', 'woodmart' ),
					),
					'layout-11' => array(
						'title' => esc_html__( 'Simple11', 'woodmart' ),
					),
					'layout-12' => array(
						'title' => esc_html__( 'Simple12', 'woodmart' ),
					),
					'layout-13' => array(
						'title' => esc_html__( 'Simple13', 'woodmart' ),
					),
					'layout-14' => array(
						'title' => esc_html__( 'Simple14', 'woodmart' ),
					),
					'layout-15' => array(
						'title' => esc_html__( 'Simple15', 'woodmart' ),
					),
					'layout-16' => array(
						'title' => esc_html__( 'Simple16', 'woodmart' ),
					),
					'layout-17' => array(
						'title' => esc_html__( 'Simple17', 'woodmart' ),
					),
					'layout-18' => array(
						'title' => esc_html__( 'Simple18', 'woodmart' ),
					),
					'layout-19' => array(
						'title' => esc_html__( 'Simple19', 'woodmart' ),
					),
				),
			),
			'newsletter'   => array(
				'title'   => esc_html__( 'Newsletter', 'woodmart' ),
				'layouts' => array(
					'layout-1'  => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2'  => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3'  => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4'  => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5'  => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6'  => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
					'layout-7'  => array(
						'title' => esc_html__( 'Simple7', 'woodmart' ),
					),
					'layout-8'  => array(
						'title' => esc_html__( 'Simple8', 'woodmart' ),
					),
					'layout-9'  => array(
						'title' => esc_html__( 'Simple9', 'woodmart' ),
					),
					'layout-10' => array(
						'title' => esc_html__( 'Simple10', 'woodmart' ),
					),
					'layout-11' => array(
						'title' => esc_html__( 'Simple11', 'woodmart' ),
					),
					'layout-12' => array(
						'title' => esc_html__( 'Simple12', 'woodmart' ),
					),
					'layout-13' => array(
						'title' => esc_html__( 'Simple13', 'woodmart' ),
					),
					'layout-14' => array(
						'title' => esc_html__( 'Simple14', 'woodmart' ),
					),
				),
			),
			'contact_form' => array(
				'title'   => esc_html__( 'Contact Form', 'woodmart' ),
				'layouts' => array(
					'layout-1' => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2' => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3' => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4' => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5' => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
				),
			),
			'exit_intent'  => array(
				'title'   => esc_html__( 'Exit Intent', 'woodmart' ),
				'layouts' => array(
					'layout-1'  => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2'  => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3'  => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4'  => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5'  => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6'  => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
					'layout-7'  => array(
						'title' => esc_html__( 'Simple7', 'woodmart' ),
					),
					'layout-8'  => array(
						'title' => esc_html__( 'Simple8', 'woodmart' ),
					),
					'layout-9'  => array(
						'title' => esc_html__( 'Simple9', 'woodmart' ),
					),
					'layout-10' => array(
						'title' => esc_html__( 'Simple10', 'woodmart' ),
					),
					'layout-11' => array(
						'title' => esc_html__( 'Simple11', 'woodmart' ),
					),
					'layout-12' => array(
						'title' => esc_html__( 'Simple12', 'woodmart' ),
					),
				),
			),
			'information'  => array(
				'title'   => esc_html__( 'Information', 'woodmart' ),
				'layouts' => array(
					'layout-1'  => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2'  => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3'  => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4'  => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5'  => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6'  => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
					'layout-7'  => array(
						'title' => esc_html__( 'Simple7', 'woodmart' ),
					),
					'layout-8'  => array(
						'title' => esc_html__( 'Simple8', 'woodmart' ),
					),
					'layout-9'  => array(
						'title' => esc_html__( 'Simple9', 'woodmart' ),
					),
					'layout-10' => array(
						'title' => esc_html__( 'Simple10', 'woodmart' ),
					),
					'layout-11' => array(
						'title' => esc_html__( 'Simple11', 'woodmart' ),
					),
					'layout-12' => array(
						'title' => esc_html__( 'Simple12', 'woodmart' ),
					),
					'layout-13' => array(
						'title' => esc_html__( 'Simple13', 'woodmart' ),
					),
					'layout-14' => array(
						'title' => esc_html__( 'Simple14', 'woodmart' ),
					),
					'layout-15' => array(
						'title' => esc_html__( 'Simple15', 'woodmart' ),
					),
				),
			),
		),
	),

	'floating-block' => array(
		'post_type'   => 'wd_floating_block',
		'label'       => esc_html__( 'Floating Block', 'woodmart' ),
		'ajax_action' => 'wd_floating_block_create',
		'prefix'      => 'wd_fb_',
		'options'     => array(
			'version',
			'close_by_selector',
			'persistent_close',
		),
		'create_form' => array(
			'label_text'       => esc_html__( 'Predefined floating blocks', 'woodmart' ),
			'name_label'       => esc_html__( 'Floating block name', 'woodmart' ),
			'name_placeholder' => esc_html__( 'Enter floating block name', 'woodmart' ),
			'default_name'     => esc_html__( 'Floating block', 'woodmart' ),
			'submit_text'      => esc_html__( 'Create floating block', 'woodmart' ),
			'templates_label'  => esc_html__( 'Floating blocks templates', 'woodmart' ),
			'preview_alt'      => esc_html__( 'Floating block preview', 'woodmart' ),
		),
		'templates'   => array(
			'button' => array(
				'title'   => esc_html__( 'Button', 'woodmart' ),
				'layouts' => array(
					'layout-1' => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2' => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3' => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4' => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5' => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6' => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
				),
			),
			'banner' => array(
				'title'   => esc_html__( 'Banner', 'woodmart' ),
				'layouts' => array(
					'layout-1'  => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2'  => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3'  => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4'  => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5'  => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6'  => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
					'layout-7'  => array(
						'title' => esc_html__( 'Simple7', 'woodmart' ),
					),
					'layout-8'  => array(
						'title' => esc_html__( 'Simple8', 'woodmart' ),
					),
					'layout-9'  => array(
						'title' => esc_html__( 'Simple9', 'woodmart' ),
					),
					'layout-10' => array(
						'title' => esc_html__( 'Simple10', 'woodmart' ),
					),
					'layout-11' => array(
						'title' => esc_html__( 'Simple11', 'woodmart' ),
					),
					'layout-12' => array(
						'title' => esc_html__( 'Simple12', 'woodmart' ),
					),
					'layout-13' => array(
						'title' => esc_html__( 'Simple13', 'woodmart' ),
					),
					'layout-14' => array(
						'title' => esc_html__( 'Simple14', 'woodmart' ),
					),
					'layout-15' => array(
						'title' => esc_html__( 'Simple15', 'woodmart' ),
					),
					'layout-16' => array(
						'title' => esc_html__( 'Simple16', 'woodmart' ),
					),
					'layout-17' => array(
						'title' => esc_html__( 'Simple17', 'woodmart' ),
					),
					'layout-18' => array(
						'title' => esc_html__( 'Simple18', 'woodmart' ),
					),
					'layout-19' => array(
						'title' => esc_html__( 'Simple19', 'woodmart' ),
					),
					'layout-20' => array(
						'title' => esc_html__( 'Simple20', 'woodmart' ),
					),
					'layout-21' => array(
						'title' => esc_html__( 'Simple21', 'woodmart' ),
					),
					'layout-22' => array(
						'title' => esc_html__( 'Simple22', 'woodmart' ),
					),
					'layout-23' => array(
						'title' => esc_html__( 'Simple23', 'woodmart' ),
					),
					'layout-24' => array(
						'title' => esc_html__( 'Simple24', 'woodmart' ),
					),
					'layout-25' => array(
						'title' => esc_html__( 'Simple25', 'woodmart' ),
					),
					'layout-26' => array(
						'title' => esc_html__( 'Simple26', 'woodmart' ),
					),
					'layout-27' => array(
						'title' => esc_html__( 'Simple27', 'woodmart' ),
					),
					'layout-28' => array(
						'title' => esc_html__( 'Simple28', 'woodmart' ),
					),
					'layout-29' => array(
						'title' => esc_html__( 'Simple29', 'woodmart' ),
					),
					'layout-30' => array(
						'title' => esc_html__( 'Simple30', 'woodmart' ),
					),
					'layout-31' => array(
						'title' => esc_html__( 'Simple31', 'woodmart' ),
					),
					'layout-32' => array(
						'title' => esc_html__( 'Simple32', 'woodmart' ),
					),
					'layout-33' => array(
						'title' => esc_html__( 'Simple33', 'woodmart' ),
					),
					'layout-34' => array(
						'title' => esc_html__( 'Simple34', 'woodmart' ),
					),
					'layout-35' => array(
						'title' => esc_html__( 'Simple35', 'woodmart' ),
					),
					'layout-36' => array(
						'title' => esc_html__( 'Simple36', 'woodmart' ),
					),
					'layout-37' => array(
						'title' => esc_html__( 'Simple37', 'woodmart' ),
					),
					'layout-38' => array(
						'title' => esc_html__( 'Simple38', 'woodmart' ),
					),
					'layout-39' => array(
						'title' => esc_html__( 'Simple39', 'woodmart' ),
					),
					'layout-40' => array(
						'title' => esc_html__( 'Simple40', 'woodmart' ),
					),
					'layout-41' => array(
						'title' => esc_html__( 'Simple41', 'woodmart' ),
					),
					'layout-42' => array(
						'title' => esc_html__( 'Simple42', 'woodmart' ),
					),
					'layout-43' => array(
						'title' => esc_html__( 'Simple43', 'woodmart' ),
					),
					'layout-44' => array(
						'title' => esc_html__( 'Simple44', 'woodmart' ),
					),
					'layout-45' => array(
						'title' => esc_html__( 'Simple45', 'woodmart' ),
					),
					'layout-46' => array(
						'title' => esc_html__( 'Simple46', 'woodmart' ),
					),
					'layout-47' => array(
						'title' => esc_html__( 'Simple47', 'woodmart' ),
					),
					'layout-48' => array(
						'title' => esc_html__( 'Simple48', 'woodmart' ),
					),
					'layout-49' => array(
						'title' => esc_html__( 'Simple49', 'woodmart' ),
					),
					'layout-50' => array(
						'title' => esc_html__( 'Simple50', 'woodmart' ),
					),
					'layout-51' => array(
						'title' => esc_html__( 'Simple51', 'woodmart' ),
					),
					'layout-52' => array(
						'title' => esc_html__( 'Simple52', 'woodmart' ),
					),
					'layout-53' => array(
						'title' => esc_html__( 'Simple53', 'woodmart' ),
					),
					'layout-54' => array(
						'title' => esc_html__( 'Simple54', 'woodmart' ),
					),
					'layout-55' => array(
						'title' => esc_html__( 'Simple55', 'woodmart' ),
					),
					'layout-56' => array(
						'title' => esc_html__( 'Simple56', 'woodmart' ),
					),
					'layout-57' => array(
						'title' => esc_html__( 'Simple57', 'woodmart' ),
					),
					'layout-58' => array(
						'title' => esc_html__( 'Simple58', 'woodmart' ),
					),
					'layout-59' => array(
						'title' => esc_html__( 'Simple59', 'woodmart' ),
					),
					'layout-60' => array(
						'title' => esc_html__( 'Simple60', 'woodmart' ),
					),
					'layout-61' => array(
						'title' => esc_html__( 'Simple61', 'woodmart' ),
					),
					'layout-62' => array(
						'title' => esc_html__( 'Simple62', 'woodmart' ),
					),
					'layout-63' => array(
						'title' => esc_html__( 'Simple63', 'woodmart' ),
					),
					'layout-64' => array(
						'title' => esc_html__( 'Simple64', 'woodmart' ),
					),
					'layout-65' => array(
						'title' => esc_html__( 'Simple65', 'woodmart' ),
					),
					'layout-66' => array(
						'title' => esc_html__( 'Simple66', 'woodmart' ),
					),
					'layout-67' => array(
						'title' => esc_html__( 'Simple67', 'woodmart' ),
					),
					'layout-68' => array(
						'title' => esc_html__( 'Simple68', 'woodmart' ),
					),
				),
			),
			'bar'    => array(
				'title'   => esc_html__( 'Bar', 'woodmart' ),
				'layouts' => array(
					'layout-1' => array(
						'title' => esc_html__( 'Simple', 'woodmart' ),
					),
					'layout-2' => array(
						'title' => esc_html__( 'Simple2', 'woodmart' ),
					),
					'layout-3' => array(
						'title' => esc_html__( 'Simple3', 'woodmart' ),
					),
					'layout-4' => array(
						'title' => esc_html__( 'Simple4', 'woodmart' ),
					),
					'layout-5' => array(
						'title' => esc_html__( 'Simple5', 'woodmart' ),
					),
					'layout-6' => array(
						'title' => esc_html__( 'Simple6', 'woodmart' ),
					),
				),
			),
		),
	),
);
