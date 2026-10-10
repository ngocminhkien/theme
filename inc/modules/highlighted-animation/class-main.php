<?php
/**
 * Highlighted Animation Main Class.
 *
 * @package woodmart
 */

namespace XTS\Modules\HighlightedAnimation;

use XTS\Singleton;

/**
 * Highlighted Animation Main Class.
 */
class Main extends Singleton {
	/**
	 * Normalized settings.
	 *
	 * @var array
	 */
	protected $settings;

	/**
	 * Precomputed render settings (classes, style, data-settings).
	 *
	 * @var array
	 */
	private $render_settings;

	/**
	 * Init.
	 */
	public function init() {
		$this->add_gutenberg_filters();
	}

	/**
	 * Add Gutenberg render_block filters.
	 */
	public function add_gutenberg_filters() {
		add_filter( 'render_block_wd/paragraph', array( $this, 'prepare_block' ), 10, 2 );
		add_filter( 'render_block_wd/title', array( $this, 'prepare_block' ), 10, 2 );
	}

	/**
	 * Render callback: apply highlighted animation to the block HTML.
	 *
	 * @param string $block_content Block HTML.
	 * @param array  $block         Parsed block data.
	 *
	 * @return string
	 */
	public function prepare_block( $block_content, $block ) {
		$atts           = isset( $block['attrs'] ) ? $block['attrs'] : array();
		$this->settings = $this->build_settings( $atts );

		if ( ! $this->is_enabled() ) {
			return $block_content;
		}

		$this->render_settings = $this->build_render_settings();
		$preg_pattern          = '/<span[^>]*class="[^"]*\bwd-highlight\b[^"]*"[^>]*>(?<text>.*?)<\/span>/s';

		woodmart_enqueue_js_script( 'highlighted-animation' );

		return $this->get_highlighted_html( $block_content, $preg_pattern );
	}

	/**
	 * Prepare highlighted animation for external builders.
	 *
	 * @param string $content Source HTML.
	 * @param array  $atts    Highlighted animation settings.
	 *
	 * @return string Transformed HTML.
	 */
	public function prepare_external( $content, $atts = array() ) {
		$this->settings = $this->build_settings( $atts );

		if ( ! $this->is_enabled() ) {
			return $content;
		}

		$this->render_settings = $this->build_render_settings();

		woodmart_enqueue_js_script( 'highlighted-animation' );
		woodmart_enqueue_inline_style( 'opt-text-rotation-' . str_replace( '_', '-', $this->settings['highlighted_animation'] ) );

		return $this->get_highlighted_html( $content );
	}

	/**
	 * Normalize settings with defaults.
	 *
	 * @param array $settings Raw settings.
	 *
	 * @return array Normalized settings.
	 */
	protected function build_settings( $settings ) {
		$defaults = array(
			'highlighted_effect'        => 'none',
			'highlighted_animation'     => 'typing',
			'highlighted_duration_time' => '',
			'highlighted_delay_time'    => '',
		);
		$settings = wp_parse_args( $settings, $defaults );

		if ( '' === $settings['highlighted_duration_time'] ) {
			$settings['highlighted_duration_time'] = 600;
		}

		if ( '' === $settings['highlighted_delay_time'] ) {
			$settings['highlighted_delay_time'] = 2500;
		}

		return $settings;
	}

	/**
	 * Build the render settings from the normalized settings.
	 *
	 * @return array
	 */
	private function build_render_settings() {
		$settings = $this->settings;

		$render_settings = array(
			'classes'       => 'wd-' . str_replace( '_', '-', $settings['highlighted_effect'] ),
			'style'         => '',
			'data-settings' => array(),
		);

		$animation = str_replace( '_', '-', $settings['highlighted_animation'] );

		if ( 'rot_text' === $settings['highlighted_effect'] ) {
			$render_settings['classes'] .= ' wd-anim-' . $animation;
			$render_settings['style']    = '--wd-anim-duration: ' . $settings['highlighted_duration_time'] . 'ms;';

			$render_settings['data-settings'] = array(
				'animation'    => $settings['highlighted_animation'],
				'durationTime' => intval( $settings['highlighted_duration_time'] ),
				'delayTime'    => intval( $settings['highlighted_delay_time'] ),
			);
		}

		return $render_settings;
	}

	/**
	 * Whether the highlighted animation is enabled for the current settings.
	 *
	 * @return bool
	 */
	public function is_enabled() {
		return ! empty( $this->settings['highlighted_effect'] ) && 'none' !== $this->settings['highlighted_effect'];
	}

	/**
	 * Get the transformed HTML with highlighted animation applied.
	 * Find tags matching the regex pattern and replace them with the animated markup.
	 *
	 * @param string $html Source HTML.
	 * @param string $preg_pattern Regex pattern for highlighted regions. By default, it matches <u> tags for external builders.
	 *
	 * @return string
	 */
	public function get_highlighted_html( $html, $preg_pattern = '/<u>(?<text>.*?)<\/u>/s' ) {
		return preg_replace_callback(
			$preg_pattern,
			function ( $matches ) {
				return $this->render_rotation_text_html( $matches['text'] );
			},
			$html
		);
	}

	/**
	 * Render the animated markup for a single highlighted region.
	 *
	 * @param string $text Raw inner text; multiple lines are separated by "|".
	 *
	 * @return string
	 */
	public function render_rotation_text_html( $text ) {
		$lines = explode( '|', $text );

		ob_start();
		?>
		<span class="<?php echo esc_attr( $this->render_settings['classes'] ); ?>" data-settings="<?php echo esc_attr( wp_json_encode( $this->render_settings['data-settings'] ) ); ?>" style="<?php echo esc_attr( $this->render_settings['style'] ); ?>">
			<?php foreach ( $lines as $key => $line ) : ?>
				<?php $line_classes = 0 === $key ? 'wd-active wd-first' : 'wd-hide'; ?>

				<span class="wd-rot-text-item wd-highlight <?php echo esc_attr( $line_classes ); ?>"><?php echo esc_html( $line ); ?></span>
			<?php endforeach; ?>
		</span>
		<?php
		return ob_get_clean();
	}
}

Main::get_instance();
