<?php // phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
/**
 * The template for displaying a size guide preview.
 *
 * @package woodmart
 */

if ( ! current_user_can( 'edit_post', get_queried_object_id() ) ) {
	wp_die( esc_html__( 'You do not have access.', 'woodmart' ), '', array( 'back_link' => true ) );
}

get_header();

woodmart_enqueue_inline_style( 'size-guide' );
?>

<div class="container">
	<?php while ( have_posts() ) : ?>
		<?php
		the_post();

		$size_tables = get_post_meta( get_the_ID(), 'woodmart_sguide', true );
		$show_table  = get_post_meta( get_the_ID(), 'woodmart_sguide_hide_table', true );
		?>
		<article <?php post_class( 'wd-sizeguide' ); ?>>
			<div class="title wd-sizeguide-title"><?php the_title(); ?></div>

			<div class="wd-sizeguide-content entry-content">
				<?php the_content(); ?>
			</div>

			<?php if ( 'hide' !== $show_table && is_array( $size_tables ) && $size_tables ) : ?>
				<div class="responsive-table">
					<table class="wd-sizeguide-table">
						<?php foreach ( $size_tables as $row ) : ?>
							<tr>
								<?php foreach ( $row as $column ) : ?>
									<td><?php echo esc_html( $column ); ?></td>
								<?php endforeach; ?>
							</tr>
						<?php endforeach; ?>
					</table>
				</div>
			<?php endif; ?>
		</article>
	<?php endwhile; ?>
</div>

<?php
get_footer();
