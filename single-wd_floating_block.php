<?php // phpcs:ignore phpcs: WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * The template for displaying floating blocks.
 *
 * @package woodmart
 */

use Elementor\Plugin;
use XTS\Modules\Floating_Blocks\Manager;
use XTS\Modules\Floating_Blocks\Frontend;

if ( ! current_user_can( apply_filters( 'woodmart_wd_floating_block_access', 'edit_posts' ) ) ) {
	wp_die( 'You do not have access.', '', array( 'back_link' => true ) );
}

get_header();

$wd_post_id     = get_the_ID();
$manager        = Manager::get_instance();
$active_builder = $manager->get_active_editor( $wd_post_id );

woodmart_enqueue_inline_style( 'opt-floating-block' );

?>
<?php if ( woodmart_is_elementor_installed() && ( woodmart_elementor_is_edit_mode() || woodmart_elementor_is_preview_page() || woodmart_elementor_is_preview_mode() || 'elementor' === $active_builder ) ) : ?>
	<?php

	$document        = Plugin::$instance->documents->get( $wd_post_id );
	$page_settings   = $document->get_settings();
	$prefix          = 'wd_fb_';
	$wrapper_classes = 'wd-fb-holder wd-scroll';

	$hide_on_desktop = ! empty( $page_settings[ $prefix . 'hide_floating_block' ] );
	$hide_on_tablet  = ! empty( $page_settings[ $prefix . 'hide_floating_block_tablet' ] );
	$hide_on_mobile  = ! empty( $page_settings[ $prefix . 'hide_floating_block_mobile' ] );

	if ( $hide_on_desktop ) {
		$wrapper_classes .= ' wd-hide-lg';
	}

	if ( $hide_on_tablet ) {
		$wrapper_classes .= ' wd-hide-md-sm';
	}

	if ( $hide_on_mobile ) {
		$wrapper_classes .= ' wd-hide-sm';
	}

	$btn_classes = 'wd-fb-close wd-action-btn wd-cross-icon';

	if ( isset( $page_settings[ $prefix . 'positioning_area' ] ) && 'container' === $page_settings[ $prefix . 'positioning_area' ] ) {
		$wrapper_classes .= ' container';
	}

	if ( ! empty( $page_settings[ $prefix . 'close_btn_display' ] ) ) {
		$btn_classes .= ' wd-style-' . $page_settings[ $prefix . 'close_btn_display' ];
	} else {
		$btn_classes .= ' wd-style-icon';
	}

	$bg_image = $page_settings[ $prefix . 'background_image' ];
	?>
	<div id="<?php echo esc_attr( 'wd-fb-' . $wd_post_id ); ?>" class="<?php echo esc_attr( $wrapper_classes ); ?>">
		<div class="wd-fb-wrap">
			<?php if ( isset( $page_settings[ $prefix . 'close_btn' ] ) && $page_settings[ $prefix . 'close_btn' ] ) : ?>
				<div class="<?php echo esc_attr( $btn_classes ); ?>">
					<a title="<?php esc_html_e( 'Close', 'woodmart' ); ?>" href="#" rel="nofollow">
						<span class="wd-action-icon"></span>
						<span class="wd-action-text">
							<?php esc_html_e( 'Close', 'woodmart' ); ?>
						</span>
					</a>
				</div>
			<?php endif; ?>
			<div class="wd-fb">
				<?php if ( ! empty( $bg_image['id'] ) ) : ?>
					<picture class="wd-bg-img">
						<?php
						$image_size = isset( $bg_image['size'] ) ? $bg_image['size'] : 'full';
						echo woodmart_otf_get_image_html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							$bg_image['id'],
							$image_size,
							false
						);
						?>
					</picture>
				<?php endif; ?>
				<div class="wd-fb-inner wd-scroll-content wd-entry-content">
					<?php while ( have_posts() ) : ?>
						<?php the_post(); ?>
						<?php the_content(); ?>
					<?php endwhile; ?>
				</div>
			</div>
		</div>
	</div>
<?php else : ?>
	<?php
	while ( have_posts() ) :
		the_post();

		if ( 'wpb' === $active_builder || 'gutenberg' === $active_builder ) :
			Frontend::get_instance()->get_css_for_floating_block( $wd_post_id );

			$wrapper_classes = 'wd-fb-holder wd-scroll';
			$btn_classes     = 'wd-fb-close wd-action-btn wd-cross-icon';

			if ( 'wpb' === $active_builder ) {
				$hide_on_desktop   = get_post_meta( $wd_post_id, 'hide_floating_block', true );
				$hide_on_tablet    = get_post_meta( $wd_post_id, 'hide_floating_block_tablet', true );
				$hide_on_mobile    = get_post_meta( $wd_post_id, 'hide_floating_block_mobile', true );
				$positioning_area  = get_post_meta( $wd_post_id, 'positioning_area', true );
				$close_btn         = get_post_meta( $wd_post_id, 'close_btn', true );
				$close_btn_display = get_post_meta( $wd_post_id, 'close_btn_display', true );
				$bg_image          = get_post_meta( $wd_post_id, 'background_image', true );
				$bg_image_size     = get_post_meta( $wd_post_id, 'image_size', true );
			} else {
				$hide_on_desktop   = $manager->get_gutenberg_option( $wd_post_id, 'hide_floating_block' );
				$hide_on_tablet    = $manager->get_gutenberg_option( $wd_post_id, 'hide_floating_block_tablet' );
				$hide_on_mobile    = $manager->get_gutenberg_option( $wd_post_id, 'hide_floating_block_mobile' );
				$positioning_area  = $manager->get_gutenberg_option( $wd_post_id, 'positioning_area' );
				$close_btn         = $manager->get_gutenberg_option( $wd_post_id, 'close_btn' );
				$close_btn_display = $manager->get_gutenberg_option( $wd_post_id, 'close_btn_display' );
				$bg_image          = 'classic' === $manager->get_gutenberg_option( $wd_post_id, 'backgroundType' )
					? $manager->get_gutenberg_option( $wd_post_id, 'backgroundImage' )
					: array();
				$bg_image_size     = $manager->get_gutenberg_option( $wd_post_id, 'backgroundImageSize' );
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

			if ( 'container' === $positioning_area ) {
				$wrapper_classes .= ' container';
			}

			$btn_classes .= ' wd-style-' . ( 'text' === $close_btn_display ? 'text' : 'icon' );
			?>
			<div id="<?php echo esc_attr( 'wd-fb-' . $wd_post_id ); ?>" class="<?php echo esc_attr( $wrapper_classes ); ?>">
				<div class="wd-fb-wrap">
					<?php if ( $close_btn ) : ?>
						<div class="<?php echo esc_attr( $btn_classes ); ?>">
							<a title="<?php esc_html_e( 'Close', 'woodmart' ); ?>" href="#" rel="nofollow">
								<span class="wd-action-icon"></span>
								<span class="wd-action-text">
									<?php esc_html_e( 'Close', 'woodmart' ); ?>
								</span>
							</a>
						</div>
					<?php endif; ?>
					<div class="wd-fb">
						<?php if ( ! empty( $bg_image['id'] ) ) : ?>
							<?php
							woodmart_enqueue_inline_style( 'block-bg-base' );
							woodmart_enqueue_inline_style( 'block-bg-img' );
							?>
							<picture class="wd-bg-img">
								<?php
								$image_size = $bg_image_size ? $bg_image_size : ( isset( $bg_image['size'] ) ? $bg_image['size'] : 'full' );
								echo woodmart_otf_get_image_html( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									$bg_image['id'],
									$image_size,
									false
								);
								?>
							</picture>
						<?php endif; ?>
						<div class="wd-fb-inner wd-scroll-content wd-entry-content">
							<?php the_content(); ?>
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
