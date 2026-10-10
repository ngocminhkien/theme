<?php
/**
 * What's New page template.
 *
 * Add the content for each WoodMart release to this template.
 *
 * @package woodmart
 */

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}
?>

<div class="xts-box xts-theme-style">
	<div class="xts-box-content">
		<style>
			.wd-wn {
				--wd-wn-accent: var(--xts-primary-color);
				--wd-wn-accent-soft: rgba(var(--xts-primary-color--rgb), .08);
				--wd-wn-border: var(--xts-option-border-color);
				--wd-wn-muted: #646970;
				color: #1d2327;
			}

			.wd-wn * {
				box-sizing: border-box;
			}

			.wd-wn-hero {
				margin-top: -20px;
				margin-inline: -20px;
				padding: 70px 0;
				border-radius: var(--xts-brd-radius) var(--xts-brd-radius) 0 0;
				background: linear-gradient(135deg, #111111 0%, var(--xts-primary-color-darker-10) 58%, var(--xts-primary-color) 100%);
				color: #fff;
			}

			.wd-wn-hero-inner {
				max-width: 1050px;
				margin: 0 auto;
				padding-inline: 24px;
			}


			.wd-wn-hero h1 {
				max-width: 880px;
				margin: 0 0 20px;
				color: inherit;
				font-size: clamp(32px, 5vw, 56px);
				line-height: 1.08;
			}

			.wd-wn-lead {
				max-width: 820px;
				margin: 0;
				color: rgba(255, 255, 255, .82);
				font-size: 18px;
				line-height: 1.7;
			}

			.wd-wn-content {
				max-width: 1050px;
				margin: 0 auto;
				padding: 70px 24px 20px;
			}

			.wd-wn-section {
				margin: 0 0 70px;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.wd-wn-section h2 {
				display: flex;
				align-items: center;
				gap: 12px;
				margin: 0 0 22px;
				color: #1d2327;
				font-size: 30px;
				line-height: 1.25;
			}

			.wd-wn-section h3 {
				margin: 32px 0 12px;
				color: #1d2327;
				font-size: 22px;
				line-height: 1.35;
			}

			.wd-wn-section h4 {
				margin: 22px 0 10px;
				color: #1d2327;
				font-size: 17px;
				line-height: 1.4;
				font-weight: 600;
			}

			.wd-wn-section p,
			.wd-wn-section li {
				font-size: 16px;
				line-height: 1.75;
				color: var(--wd-wn-muted);
			}

			.wd-wn-section strong {
				color: #1d2327;
			}

			.wd-wn-section a strong {
				color: inherit;
			}

			.wd-wn-section ul,
			.wd-wn-section ol {
				margin: 16px 0 0;
				padding-left: 24px;
				list-style-position: outside;
			}

			.wd-wn-section ul {
				list-style-type: disc;
			}

			.wd-wn-section ol {
				list-style-type: decimal;
			}

			.wd-wn-section li + li {
				margin-top: 10px;
			}

			.wd-wn-section ul + p,
			.wd-wn-section ol + p {
				margin-top: 20px;
			}

			.wd-wn a {
				color: var(--wd-wn-accent);
				transition: color .2s ease;
			}

			.wd-wn a:hover {
				color: var(--xts-primary-color-darker-10);
			}

			.wd-wn-section a {
				font-weight: 600;
			}

			.wd-wn-grid {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 18px;
			}

			.wd-wn-card {
				overflow: hidden;
				padding: 24px;
				border: 1px solid var(--xts-option-border-color);
				border-radius: var(--xts-brd-radius);
				background: #fff;
			}

			.wd-wn-card h3 {
				margin-top: 18px;
			}

			.wd-wn-card p {
				margin-bottom: 0;
			}

			.wd-wn-media {
				display: grid;
				place-items: center;
				min-height: 230px;
				margin: 0 0 26px;
				padding: 24px;
				border: 1px dashed var(--xts-option-border-color);
				border-radius: var(--xts-brd-radius);
				background: rgba(var(--xts-primary-color--rgb), .03);
				color: var(--wd-wn-muted);
				font-size: 14px;
				font-weight: 600;
				text-align: center;
			}

			.wd-wn-media-img {
				display: block;
				min-height: 0;
				margin: -24px -24px 0;
				padding: 0;
				overflow: hidden;
				border: none;
				border-bottom: 1px solid var(--xts-option-border-color);
				border-radius: 0;
				background: #fff;
			}

			.wd-wn-media-img img {
				display: block;
				width: 100%;
				height: auto;
				transition: transform .35s ease;
			}

			.wd-wn-media-img:hover img {
				transform: scale(1.025);
			}

			.wd-wn-media-banner,
			.wd-wn-media-video {
				min-height: 0;
				padding: 0;
				overflow: hidden;
				border: 1px solid var(--xts-option-border-color);
			}

			.wd-wn-media-banner a,
			.wd-wn-media-banner img,
			.wd-wn-media-video video {
				display: block;
				width: 100%;
				height: auto;
			}



			.wd-wn-num {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
				width: 34px;
				height: 34px;
				border: 2px solid var(--wd-wn-accent);
				border-radius: 50%;
				background: transparent;
				color: var(--wd-wn-accent);
				font-size: 15px;
				font-weight: 500;
				line-height: 1;

				&.wd-wn-num-info {
					font-style: italic;
					font-family: Georgia, 'Times New Roman', serif;
					font-size: 17px;
					font-weight: 400;
				}
			}



			.wd-wn-row {
				display: grid;
				grid-template-columns: 6fr 4fr;
				gap: 30px;
				align-items: start;

				&.wd-wn-reverse {
					grid-template-columns: 4fr 6fr;
				}

				&.wd-wn-equal {
					grid-template-columns: 4fr 6fr;
					align-items: center;
				}
			}

			.wd-wn-row .wd-wn-media {
				margin: 0;
			}

			@media (max-width: 782px) {
				.wd-wn-hero {
					padding: 34px 0;
				}

				.wd-wn-hero-inner {
					padding-inline: 20px;
				}

				.wd-wn-content {
					padding-right: 0;
					padding-left: 0;
				}

				.wd-wn-grid,
				.wd-wn-row {
					grid-template-columns: 1fr;
				}

				.wd-wn-row.wd-wn-reverse .wd-wn-media {
					order: -1;
				}
			}

			.xts-box.xts-subscribe {
				position: relative;
				margin-top: 50px;
				margin-inline: -20px;
				margin-bottom: -20px;
				border: none;
				border-radius: 0;
				background: linear-gradient(180deg, rgba(var(--xts-primary-color--rgb), .06) 0%, rgba(var(--xts-primary-color--rgb), .015) 100%);
				box-shadow: none;
			}

			.xts-box.xts-subscribe .xts-box-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				padding: 60px 0;
			}

			.xts-box.xts-subscribe h4 {
				margin: 0 0 12px;
				color: #1d2327;
				font-size: 26px;
				font-weight: 700;
				line-height: 1.25;
			}

			.xts-box.xts-subscribe p {
				margin: 0 auto 28px;
				font-size: 16px;
				line-height: 1.6;
				color: var(--wd-wn-muted);
			}

			.xts-box.xts-subscribe .xts-subscribe-form {
				width: 100%;
				max-width: 480px;
				margin: 0 auto;
			}
		</style>

		<article class="wd-wn">
			<header class="wd-wn-hero">
				<div class="wd-wn-hero-inner">
					<h1>WoodMart 8.6 Overview</h1>
					<p class="wd-wn-lead">
						Version 8.6 introduces Model Context Protocol (MCP) support, partial demo imports, WooCommerce Cart and Checkout blocks compatibility, new prebuilt layouts, and performance optimizations.
					</p>
				</div>
			</header>

			<div class="wd-wn-content">
				<section class="wd-wn-section">
					<h2>Key Changes and Improvements</h2>
					<p>
						This update focuses on developer tooling, granular demo management, WooCommerce blocks compatibility, and performance improvements across both admin and front-end environments. Below is a detailed summary of the main additions and technical updates in version 8.6.
					</p>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">1</span>New Books 2 Prebuilt Website</h2>
					<div class="wd-wn-row wd-wn-equal">
						<div class="wd-wn-media wd-wn-media-banner">
							<a href="https://go.xtemos.com/demo/books-2/" target="_blank" rel="noopener">
								<img src="https://woodmart.xtemos.com/dummy-content-new/books-2/preview.jpg" alt="Books 2 WoodMart prebuilt website preview" loading="lazy">
							</a>
						</div>
						<div class="wd-wn-row-content">
							<p>
								Update 8.6 adds a new <strong>Books 2</strong> prebuilt website, designed for online bookstores, publishing houses, and digital literary stores. It features a structured, bordered product grid, refined typography, and specialized catalog and product page layouts.
							</p>
							<p>
								<a href="https://go.xtemos.com/demo/books-2/" class="xts-inline-btn xts-color-primary" target="_blank" rel="noopener">Explore Books 2 live demo →</a>
							</p>
						</div>
					</div>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">2</span>Deep Integration with Cart &amp; Checkout Blocks</h2>
					<div class="wd-wn-row wd-wn-reverse">
						<div class="wd-wn-row-content">
							<p>
								The theme now offers full adaptation and styling for WooCommerce's modern cart and checkout blocks:
							</p>
							<ul>
								<li><strong>Marketing features now work in blocks:</strong> Free Shipping Bar, Estimate Delivery, Free Gifts, Abandoned Cart notices, and Marketing Consent.</li>
								<li><strong>Styling aligned with theme settings:</strong> The appearance of the cart and checkout blocks now matches WoodMart's theme options (colors, typography, border radius, and other global settings).</li>
								<li><strong>"Saved for Later" block:</strong> Full support and branded styling for the saved-items block.</li>
							</ul>
							<p>
								<a href="https://go.xtemos.com/doc/checkout-page" class="xts-inline-btn xts-color-primary" target="_blank" rel="noopener">Explore documentation →</a>
							</p>
						</div>
						<div class="wd-wn-media wd-wn-media-banner">
							<img src="https://xtemos.com/wp-content/uploads/2020/09/wd86-new-woo-checkout.jpg" alt="WooCommerce Cart and Checkout Blocks compatibility" loading="lazy">
						</div>
					</div>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">3</span>Partial Demo Content Import</h2>
					<p>
						One of the major additions in WoodMart 8.6 is the Partial Import system, which changes the approach to working with prebuilt demo sites. Instead of a full theme installation that risks overwriting current settings and cluttering the database with hundreds of unnecessary products and media files, users can now selectively import only the components they need. A dedicated interface lets you import global style settings (Theme Settings), specific pages ("About Us," Contact, Home), custom builder layouts (product cards, checkout, cart), or functional blocks individually, with a live preview of each element beforehand.
					</p>
					<div class="wd-wn-media wd-wn-media-banner">
						<img src="https://xtemos.com/wp-content/uploads/2020/09/wd86-new-import.jpg" alt="WoodMart Partial Demo Content Import" loading="lazy">
					</div>
					<p>
						Pages can be installed together with an optional Theme Settings Preset. In addition, a safe-removal function has been added for deleting only the imported fragments of a specific demo. This makes it possible to combine design solutions from different WoodMart layouts without risking the stability of an already-running store.
					</p>
					<p>
						<a href="https://go.xtemos.com/doc/partial-import" class="xts-inline-btn xts-color-primary" target="_blank" rel="noopener">Explore documentation →</a>
					</p>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">4</span>AI Agent Support via WoodMart MCP</h2>
					<div class="wd-wn-row">
						<div class="wd-wn-media wd-wn-media-banner">
							<img src="https://xtemos.com/wp-content/uploads/2020/09/wd86-ai-mcp.jpg" alt="WoodMart Model Context Protocol (MCP) Integration" loading="lazy">
						</div>
						<div class="wd-wn-row-content">
							<p>
								Support for the Model Context Protocol (MCP) has been added, an open protocol for AI interaction that lets you seamlessly connect modern AI agents directly to your WordPress site.
							</p>
							<p>
								Thanks to the WoodMart MCP Abilities module, connected AI assistants receive structured context about the store and can automate development and administration tasks: managing theme settings (Theme Settings), changing header logos, creating and editing content in Gutenberg, reading and modifying WoodMart Layouts, and applying prebuilt templates.
							</p>
							<p>
								<a href="https://go.xtemos.com/mcp-docs" class="xts-inline-btn xts-color-primary" target="_blank" rel="noopener">Explore documentation →</a>
							</p>
						</div>
					</div>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">5</span>Animated Rotating Text</h2>
					<p>
						Highlighted text fragments within Title and Text elements can now have a cyclical text-change animation effect applied to them. Available styles include: a typewriter effect, a clip transition, a slide-up, a drop-in, and others.
					</p>
					<div class="wd-wn-media wd-wn-media-video">
						<video src="https://xtemos.com/wp-content/uploads/2020/09/wd86-rotating-text.mp4" autoplay loop muted playsinline></video>
					</div>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">6</span>Other Theme Improvements</h2>
					<ul>
						<li><strong>WooCommerce Variation Gallery:</strong> Support for the native WooCommerce plugin feature for individual image galleries per product variation.</li>
						<li><strong>Preview Item:</strong> Ability to select a specific product, blog post, or portfolio item while editing Single Layout templates in Elementor and Gutenberg.</li>
						<li><strong>Cart price display with dynamic discounts:</strong> When the Dynamic Discounts option is enabled, the cart now shows the discount received based on the combined quantity of all matching products.</li>
						<li><strong>Full-width "Buy Now" button:</strong> An option to stretch the one-click purchase button to the full width of its container.</li>
						<li><strong>New "Style 2" pagination</strong> for the product card's hover image gallery.</li>
						<li><strong>Border Radius in Header Builder:</strong> Flexible corner-rounding controls for search, account, cart, wishlist, compare, and the mobile menu.</li>
						<li><strong>Styling for active menu states:</strong> Separate typography settings for Hover and Active states in navigation and the account menu.</li>
						<li><strong>Open Tabs on Hover:</strong> A new way to switch tabs within the tabs element.</li>
						<li><strong>New templates:</strong> Ready-made content for popups and floating blocks.</li>
					</ul>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">7</span>Speed, SEO, and Accessibility</h2>
					<ul>
						<li><strong>Local Google Fonts by default:</strong> The "Load Google Fonts locally" option is now enabled right after theme installation for better speed and GDPR compliance.</li>
						<li><strong>Carousel optimization:</strong> Carousels now initialize automatically only after the first page scroll, reducing main-thread blocking (Total Blocking Time, TBT).</li>
						<li><strong><code>&lt;img&gt;</code> option for background images:</strong> In Gutenberg blocks (Container, Section, Row, Column), backgrounds can now be rendered via an <code>&lt;img&gt;</code> tag instead of CSS <code>background-image</code>, benefiting Core Web Vitals (LCP) and image indexing by search engines.</li>
						<li><strong>Native lazy loading:</strong> Below-the-fold images now correctly receive the native <code>loading="lazy"</code> attribute.</li>
						<li><strong>Accessibility improvements:</strong> Clear accessibility labels added for compare, wishlist, price tracker, and quick-action buttons.</li>
						<li><strong>Video posters:</strong> Improved handling of video posters in Gutenberg blocks by switching to the native HTML <code>poster</code> attribute, with added support in the LCP optimization and image preloading system.</li>
						<li><strong>Partial removal of the imagesLoaded JS library</strong>, which was shifting image loading priority.</li>
					</ul>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num">8</span>Bug Fixes and Compatibility</h2>
					<p>
						A number of minor bugs were fixed in the 8.6 release, along with stability improvements:
					</p>
					<ul>
						<li>Updated compatibility with <strong>WPBakery 9</strong>, <strong>WordPress 7.1</strong>, and the latest <strong>WooCommerce</strong> templates.</li>
						<li>Fixed free-shipping calculation with currency conversion in <strong>WPML</strong> and <strong>WOOCS</strong>.</li>
						<li>Improved mobile header cache interaction with the <strong>WP Rocket</strong> plugin.</li>
						<li>Fixed field validation behavior in the dynamic discounts system and coupon handling.</li>
					</ul>
				</section>

				<section class="wd-wn-section">
					<h2><span class="wd-wn-num wd-wn-num-info">i</span>Useful Links</h2>
					<ul>
						<li>View the complete <a href="https://go.xtemos.com/changelog?utm_source=woodmart_whats_new&utm_medium=referral&utm_campaign=need_assistance&utm_content=changelog" target="_blank" rel="noopener">WoodMart changelog</a>.</li>
						<li>Discuss this update in our <a href="https://go.xtemos.com/facebook-community?utm_source=woodmart_whats_new&utm_medium=referral&utm_campaign=need_assistance&utm_content=facebook" target="_blank" rel="noopener">Facebook Community</a>.</li>
						<li>Suggest and vote for new features in our <a href="https://go.xtemos.com/feature-requests?utm_source=woodmart_whats_new&utm_medium=referral&utm_campaign=need_assistance&utm_content=feature_requests" target="_blank" rel="noopener">Feature Requests</a>.</li>
						<li>Explore theme <a href="https://go.xtemos.com/documentation?utm_source=woodmart_whats_new&utm_medium=referral&utm_campaign=need_assistance&utm_content=documentation" target="_blank" rel="noopener">documentation and tutorials</a>.</li>
					</ul>
				</section>
			</div>
		</article>

		<div class="xts-box xts-theme-style xts-info-boxes xts-subscribe xts-align-center">
			<div class="xts-box-content">
				<h4><?php esc_html_e( 'Stay up to date with WoodMart', 'woodmart' ); ?></h4>
				<p><?php esc_html_e( 'Get new feature announcements, useful tutorials, and important WoodMart news by email.', 'woodmart' ); ?></p>
				<?php
				$subscription_source = 'whats_new';
				include get_parent_theme_file_path( WOODMART_FRAMEWORK . '/admin/modules/dashboard/templates/subscription.php' );
				?>
			</div>
		</div>
	</div>
</div>
