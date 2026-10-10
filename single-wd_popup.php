<?php // phpcs:ignore phpcs: WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * The template for displaying custom popups.
 *
 * @package woodmart
 */

use Elementor\Plugin;
use XTS\Modules\Floating_Blocks\Manager;
use XTS\Modules\Floating_Blocks\Frontend;

if ( ! current_user_can( apply_filters( 'woodmart_wd_popup_access', 'edit_posts' ) ) ) {
	wp_die( 'You do not have access.', '', array( 'back_link' => true ) );
}

$wd_post_id     = get_the_ID();
$manager        = Manager::get_instance();
$active_builder = $manager->get_active_editor( $wd_post_id );

get_header();

woodmart_enqueue_inline_style( 'mfp-popup' );
woodmart_enqueue_inline_style( 'opt-popup-builder' );

?>
<?php if ( woodmart_is_elementor_installed() && ( woodmart_elementor_is_edit_mode() || woodmart_elementor_is_preview_page() || woodmart_elementor_is_preview_mode() || 'elementor' === $active_builder ) ) : ?>
	<?php

	$document        = Plugin::$instance->documents->get( $wd_post_id );
	$page_settings   = $document->get_settings();
	$prefix          = 'wd_popup_';
	$wrapper_classes = 'wd-mfp-popup-wrap-' . $wd_post_id;

	$hide_on_desktop = ! empty( $page_settings[ $prefix . 'hide_popup' ] );
	$hide_on_tablet  = ! empty( $page_settings[ $prefix . 'hide_popup_tablet' ] );
	$hide_on_mobile  = ! empty( $page_settings[ $prefix . 'hide_popup_mobile' ] );

	if ( $hide_on_desktop ) {
		$wrapper_classes .= ' wd-hide-lg';
	}

	if ( $hide_on_tablet ) {
		$wrapper_classes .= ' wd-hide-md-sm';
	}

	if ( $hide_on_mobile ) {
		$wrapper_classes .= ' wd-hide-sm';
	}

	$btn_classes = 'wd-popup-close wd-action-btn wd-cross-icon';

	if ( ! empty( $page_settings[ $prefix . 'close_btn_display' ] ) ) {
		$btn_classes .= ' wd-style-' . $page_settings[ $prefix . 'close_btn_display' ];
	} else {
		$btn_classes .= ' wd-style-icon';
	}

	?>
	<div class="mfp-bg mfp-ready wd-mfp-popup-bg-<?php echo esc_html( $wd_post_id ); ?> wd-fill"></div>
	<div class="mfp-wrap wd-popup-builder-wrap wd-scroll <?php echo esc_html( $wrapper_classes ); ?>">
		<div class="mfp-container mfp-s-ready mfp-inline-holder">
			<div class="mfp-content">
				<div class="wd-popup-wrap">
					<?php if ( isset( $page_settings[ $prefix . 'close_btn' ] ) && $page_settings[ $prefix . 'close_btn' ] ) : ?>
						<div class="<?php echo esc_attr( $btn_classes ); ?>">
							<a title="<?php esc_html_e( 'Close', 'woodmart' ); ?>" href="#" rel="nofollow">
								<span class="wd-action-icon"></span>
								<span class="wd-action-text"><?php esc_html_e( 'Close', 'woodmart' ); ?></span>
							</a>
						</div>
					<?php endif; ?>
					<div id="<?php echo esc_attr( 'popup-' . $wd_post_id ); ?>" class="wd-popup wd-deferred wd-scroll-content">
						<div class="wd-popup-inner wd-entry-content">
							<?php while ( have_posts() ) : ?>
								<?php the_post(); ?>
								<?php the_content(); ?>
							<?php endwhile; ?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php else : ?>
	<?php
	while ( have_posts() ) :
		the_post();

		if ( 'wpb' === $active_builder || 'gutenberg' === $active_builder ) :
			Frontend::get_instance()->get_css_for_popup( $wd_post_id );

			$wrapper_classes = 'wd-mfp-popup-wrap-' . $wd_post_id;
			$btn_classes     = 'wd-popup-close wd-action-btn wd-cross-icon';

			if ( 'wpb' === $active_builder ) {
				$hide_on_desktop   = get_post_meta( $wd_post_id, 'hide_popup', true );
				$hide_on_tablet    = get_post_meta( $wd_post_id, 'hide_popup_tablet', true );
				$hide_on_mobile    = get_post_meta( $wd_post_id, 'hide_popup_mobile', true );
				$close_btn         = get_post_meta( $wd_post_id, 'close_btn', true );
				$close_btn_display = get_post_meta( $wd_post_id, 'close_btn_display', true );
			} else {
				$hide_on_desktop   = $manager->get_gutenberg_option( $wd_post_id, 'hide_popup' );
				$hide_on_tablet    = $manager->get_gutenberg_option( $wd_post_id, 'hide_popup_tablet' );
				$hide_on_mobile    = $manager->get_gutenberg_option( $wd_post_id, 'hide_popup_mobile' );
				$close_btn         = $manager->get_gutenberg_option( $wd_post_id, 'close_btn' );
				$close_btn_display = $manager->get_gutenberg_option( $wd_post_id, 'close_btn_display' );
			}

			if ( $hide_on_desktop ) {
				$wrapper_classes .= ' wd-hide-lg';
			}

			if ( $hide_on_tablet ) {
				$wrapper_classes .= ' wd-hide-md-sm';
			}

			if ( $hide_on_mobile ) {
				$wrapper_classes .= ' wd-hide-sm';
			}

			$btn_classes .= ' wd-style-' . ( 'text' === $close_btn_display ? 'text' : 'icon' );
			?>
			<div class="mfp-bg mfp-ready wd-mfp-popup-bg-<?php echo esc_attr( $wd_post_id ); ?> wd-fill"></div>
			<div class="mfp-wrap wd-popup-builder-wrap wd-scroll <?php echo esc_attr( $wrapper_classes ); ?>">
				<div class="mfp-container mfp-s-ready mfp-inline-holder">
					<div class="mfp-content">
						<div class="wd-popup-wrap">
							<?php if ( $close_btn ) : ?>
								<div class="<?php echo esc_attr( $btn_classes ); ?>">
									<a title="<?php esc_html_e( 'Close', 'woodmart' ); ?>" href="#" rel="nofollow">
										<span class="wd-action-icon"></span>
										<span class="wd-action-text"><?php esc_html_e( 'Close', 'woodmart' ); ?></span>
									</a>
								</div>
							<?php endif; ?>
							<div id="<?php echo esc_attr( 'popup-' . $wd_post_id ); ?>" class="wd-popup wd-deferred wd-scroll-content">
								<div class="wd-popup-inner wd-entry-content">
									<?php the_content(); ?>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<?php
		else :
			the_content();
		endif;
	endwhile;
	?>
<?php endif; ?>
<?php

get_footer();
