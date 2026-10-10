<?php
/**
 * Import feedback.
 *
 * @package woodmart
 */

namespace XTS\Admin\Modules\Import;

use XTS\Admin\Modules\Setup_Wizard;
use XTS\Singleton;

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

/**
 * Import feedback.
 */
class Import_Feedback extends Singleton {

	/**
	 * Init.
	 */
	public function init() {
		add_action( 'wp_ajax_woodmart_import_feedback_rating', array( $this, 'send_rating' ) );
		add_action( 'wp_ajax_woodmart_import_feedback_message', array( $this, 'send_message' ) );
		add_action( 'wp_ajax_woodmart_first_heard_about', array( $this, 'send_first_heard_about' ) );
		add_action( 'wp_ajax_woodmart_dismiss_import_feedback', array( $this, 'dismiss_feedback' ) );
	}

	/**
	 * Whether the feedback block has already been shown for this site.
	 *
	 * @return bool
	 */
	public function is_shown() {
		return ( (bool) get_option( 'wd_import_feedback_shown', false ) || (bool) get_transient( 'wd_import_feedback_dismissed' ) ) && ! Setup_Wizard::get_instance()->is_setup();
	}

	/**
	 * Temporarily hide the feedback block after it has been closed.
	 */
	public function dismiss_feedback() {
		check_ajax_referer( 'woodmart-import-feedback-nonce', 'security' );

		set_transient( 'wd_import_feedback_dismissed', true, MONTH_IN_SECONDS );

		wp_send_json_success();
	}

	/**
	 * Handle rating AJAX request and forward it to the external API.
	 */
	public function send_rating() {
		check_ajax_referer( 'woodmart-import-feedback-nonce', 'security' );

		$rating = isset( $_POST['rating'] ) ? sanitize_text_field( wp_unslash( $_POST['rating'] ) ) : '';

		if ( ! in_array( $rating, array( 'like', 'dislike' ), true ) ) {
			wp_send_json_error();
			return;
		}

		update_option( 'wd_import_feedback_shown', true, false );

		$this->send_api_request(
			array(
				'rating' => $rating,
			)
		);

		wp_send_json_success();
	}

	/**
	 * Handle feedback message AJAX request and forward it to the external API.
	 */
	public function send_message() {
		check_ajax_referer( 'woodmart-import-feedback-nonce', 'security' );

		$rating  = isset( $_POST['rating'] ) ? sanitize_text_field( wp_unslash( $_POST['rating'] ) ) : '';
		$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

		if ( 'dislike' !== $rating || '' === $message ) {
			wp_send_json_error();
			return;
		}

		$this->send_api_request(
			array(
				'message' => $message,
			)
		);

		wp_send_json_success();
	}

	/**
	 * Forward the first heard about answer to the external API.
	 */
	public function send_first_heard_about() {
		check_ajax_referer( 'woodmart-import-feedback-nonce', 'security' );

		$answer          = isset( $_POST['answer'] ) ? sanitize_key( wp_unslash( $_POST['answer'] ) ) : '';
		$allowed_answers = array( 'themeforest', 'google', 'recommendations', 'ai-chatbot', 'other' );

		if ( ! in_array( $answer, $allowed_answers, true ) ) {
			wp_send_json_error();
			return;
		}

		wp_remote_post(
			WOODMART_API_URL . 'first-heard-about',
			array(
				'body'    => array(
					'answer' => $answer,
				),
				'timeout' => 10,
			)
		);

		wp_send_json_success();
	}

	/**
	 * Send import feedback data to the external API.
	 *
	 * @param array $body Request body.
	 */
	private function send_api_request( $body ) {
		wp_remote_post(
			WOODMART_API_URL . 'import-feedback',
			array(
				'body'    => $body,
				'timeout' => 10,
			)
		);
	}

	/**
	 * Render the floating feedback block HTML.
	 */
	public function render_block() {
		if ( $this->is_shown() ) {
			return;
		}

		?>
		<div class="xts-popup-feedback xts-theme-style" id="xts-popup-feedback">
			<a href="#" class="xts-popup-close xts-i-close xts-popup-feedback-close" aria-label="<?php esc_attr_e( 'Close', 'woodmart' ); ?>"></a>
			<div class="xts-popup-feedback-thanks xts-notice xts-success xts-hidden">
				<?php esc_html_e( 'Thank you for your feedback!', 'woodmart' ); ?>
			</div>
			<p class="xts-popup-feedback-question">
				<?php esc_html_e( 'How was your experience importing individual demo pages?', 'woodmart' ); ?>
			</p>
			<div class="xts-popup-feedback-actions">
				<a href="#" class="xts-popup-feedback-btn xts-btn xts-color-primary xts-size-s" data-rating="like">
					<?php esc_html_e( '👍 Works well', 'woodmart' ); ?>
				</a>
				<a href="#" class="xts-popup-feedback-btn xts-bordered-btn xts-size-s xts-color-default" data-rating="dislike">
					<?php esc_html_e( '👎 Needs improvement', 'woodmart' ); ?>
				</a>
			</div>
			<div class="xts-popup-feedback-form xts-hidden">
				<p class="xts-popup-feedback-question">
					<?php esc_html_e( 'What went wrong or could be improved?', 'woodmart' ); ?>
				</p>
				<textarea class="xts-popup-feedback-message" placeholder="<?php esc_attr_e( 'Describe the issue or share your suggestions... (optional)', 'woodmart' ); ?>" rows="3"></textarea>
				<a href="#" class="xts-popup-feedback-send xts-btn xts-color-primary xts-size-s">
					<?php esc_html_e( 'Send feedback', 'woodmart' ); ?>
				</a>
			</div>
		</div>
		<?php
	}


	/**
	 * Render the acquisition source question during the first Setup Wizard import.
	 *
	 * @return void
	 */
	public function render_first_heard_about_block() {
		if ( ! Setup_Wizard::get_instance()->is_setup() ) {
			return;
		}

		$answers = array(
			'themeforest'     => esc_html__( 'ThemeForest', 'woodmart' ),
			'google'          => esc_html__( 'Google', 'woodmart' ),
			'recommendations' => esc_html__( 'Recommendations', 'woodmart' ),
			'ai-chatbot'      => esc_html__( 'AI or chatbot', 'woodmart' ),
			'other'           => esc_html__( 'Other', 'woodmart' ),
		);

		?>
		<div class="xts-popup-feedback xts-first-heard-about-block xts-theme-style">
			<a href="#" class="xts-popup-close xts-i-close xts-first-heard-about-close" aria-label="<?php esc_attr_e( 'Close', 'woodmart' ); ?>"></a>
			<div class="xts-popup-feedback-thanks xts-notice xts-success xts-hidden">
				<?php esc_html_e( 'Thank you for your feedback!', 'woodmart' ); ?>
			</div>
			<p class="xts-popup-feedback-question">
				<?php esc_html_e( 'Where did you first hear about WoodMart?', 'woodmart' ); ?>
			</p>
			<div class="xts-popup-feedback-actions">
				<?php foreach ( $answers as $value => $label ) : ?>
					<a href="#" class="xts-first-heard-about-btn xts-bordered-btn xts-size-s xts-color-default" data-answer="<?php echo esc_attr( $value ); ?>">
						<?php echo esc_html( $label ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}
}

Import_Feedback::get_instance();
