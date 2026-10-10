<?php
/**
 * Dashboard footer template.
 *
 * @package woodmart
 */

?>
<?php if ( ! woodmart_get_opt( 'white_label' ) ) : ?>
	<div class="xts-footer xts-theme-style">
		<div class="xts-row">
			<div class="xts-col">
				<a class="xts-logo" href="https://go.xtemos.com/site" target="_blank">
					<img src="<?php echo esc_url( WOODMART_ASSETS_IMAGES . '/xtemos-logo-dark.svg' ); ?>" alt="<?php esc_html_e( 'Logo', 'woodmart' ); ?>">
				</a>
			</div>

			<div class="xts-col-auto">
				<?php
				new XTS\Admin\Modules\Dashboard\Menu(
					array(
						'items' => array(
							array(
								'link' => array(
									'url'        => 'https://go.xtemos.com/documentation?utm_source=woodmart_dashboard_footer&utm_medium=referral&utm_campaign=need_assistance&utm_content=documentation',
									'new_window' => true,
								),
								'icon' => 'documentation',
								'text' => esc_html__( 'Documentation', 'woodmart' ),
							),
							array(
								'link' => array(
									'url'        => 'https://go.xtemos.com/videos?utm_source=woodmart_dashboard_footer&utm_medium=referral&utm_campaign=need_assistance&utm_content=videos',
									'new_window' => true,
								),
								'icon' => 'video-tutorials',
								'text' => esc_html__( 'Video tutorials', 'woodmart' ),
							),
							array(
								'link' => array(
									'url'        => 'https://go.xtemos.com/review?utm_source=woodmart_dashboard&utm_medium=referral&utm_campaign=need_assistance&utm_content=review',
									'new_window' => true,
								),
								'icon' => 'rate-theme',
								'text' => esc_html__( 'Rate our theme', 'woodmart' ),
							),
							array(
								'link' => array(
									'url'        => 'https://go.xtemos.com/support?utm_source=woodmart_dashboard_footer&utm_medium=referral&utm_campaign=need_assistance&utm_content=support',
									'new_window' => true,
								),
								'icon' => 'support-forum',
								'text' => esc_html__( 'Support', 'woodmart' ),
							),
							array(
								'link' => array(
									'url'        => 'https://go.xtemos.com/facebook-community?utm_source=woodmart_dashboard_footer&utm_medium=referral&utm_campaign=need_assistance&utm_content=facebook-community',
									'new_window' => true,
								),
								'icon' => '',
								'text' => esc_html__( 'Facebook community', 'woodmart' ),
							),
						),
					)
				);
				?>
			</div>
		</div>
	</div>
<?php endif; ?>
