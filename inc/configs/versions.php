<?php
/**
 * Array of versions for dummy content import.
 *
 * @package woodmart
 */

if ( ! defined( 'WOODMART_THEME_DIR' ) ) {
	exit( 'No direct script access allowed' );
}

return apply_filters(
	'woodmart_get_versions_to_import',
	array(
		'main'                  => array(
			'title'      => 'WoodMart Main',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'home/',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
			'partial'    => array(
				'pages'    => array(
					'contact-us'            => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'contact-us/',
					),
					'contact-us-2'          => array(
						'title'   => 'Contact Us 2',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'contact-us-2/',
					),
					'contact-us-3'          => array(
						'title'   => 'Contact Us 3',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'contact-us-3/',
					),
					'contact-us-4'          => array(
						'title'   => 'Contact Us 4',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'contact-us-4/',
					),
					'about-us'              => array(
						'title'   => 'Old About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'about-us/',
					),
					'about-us-2'            => array(
						'title'     => 'Old About Us 2',
						'process'   => 'xml,options',
						'type'      => 'page',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'about-us-2/',
					),
					'about-us-3'            => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'about-us-3/',
					),
					'about-us-4'            => array(
						'title'   => 'About Us 2',
						'process' => 'xml,options,headers',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'about-us-4/',
					),
					'about-me'              => array(
						'title'   => 'Old About Me',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'about-me/',
					),
					'about-me-2'            => array(
						'title'   => 'About Me',
						'process' => 'xml,options,headers',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'about-me-2/',
					),
					'our-team'              => array(
						'title'   => 'Old Our Team',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'our-team/',
					),
					'our-team-2'            => array(
						'title'   => 'Our Team',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'our-team-2/',
					),
					'faqs'                  => array(
						'title'   => 'FAQs',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'faqs/',
					),
					'faqs-2'                => array(
						'title'   => 'FAQs 2',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'faqs-two/',
					),
					'custom-404'            => array(
						'title'   => 'Custom-404',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'custom-404-page/',
					),
					'custom-404-2'          => array(
						'title'   => 'Custom-404-2',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'custom-404-page-2/',
					),
					'custom-privacy-policy' => array(
						'title'   => 'Custom Privacy Policy',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'privacy-policy/',
					),
					'track-order'           => array(
						'title'     => 'Track Order',
						'process'   => 'xml,options',
						'type'      => 'page',
						'link'      => WOODMART_DEMO_URL . 'track-order/',
						'gutenberg' => false,
					),
					'cart'                  => array(
						'title'   => 'Cart',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'cart/',
					),
					'checkout'              => array(
						'title'   => 'Checkout',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'checkout/',
					),
				),
				'elements' => array(
					'marquee'             => array(
						'title'   => 'Marquee',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marquee/',
					),
					'compare-images'      => array(
						'title'   => 'Compare images',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'compare-images/',
					),
					'product-filters'     => array(
						'title'   => 'Product filters',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'product-filters/',
					),
					'parallax-scrolling'  => array(
						'title'   => 'Parallax scrolling',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'parallax-scrolling/',
					),
					'animations'          => array(
						'title'   => 'Animations',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'animations/',
					),
					'sliders'             => array(
						'title'   => 'Sliders',
						'process' => 'xml,wood_slider',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'sliders/',
					),
					'image-hotspot'       => array(
						'title'   => 'Image Hotspot',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'image-hotspot/',
					),
					'list-element'        => array(
						'title'   => 'List-element',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'list-element/',
					),
					'buttons'             => array(
						'title'   => 'Buttons',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'buttons/',
					),
					'video-element'       => array(
						'title'   => 'Video-element',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'video-element/',
					),
					'timeline'            => array(
						'title'   => 'Timeline',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'timeline/',
					),
					'top-rated-products'  => array(
						'title'     => 'Top Rated Products',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'top-rated-products/',
					),
					'sale-products'       => array(
						'title'     => 'Sale Products',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'sale-products/',
					),
					'products-categories' => array(
						'title'   => 'Products Categories',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'products-categories/',
					),
					'products-category'   => array(
						'title'     => 'Products Category',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'products-category/',
					),
					'products-by-id'      => array(
						'title'     => 'Products by ID',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'products-by-id/',
					),
					'featured-products'   => array(
						'title'     => 'Featured Products',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'featured-products/',
					),
					'recent-products'     => array(
						'title'     => 'Recent Products',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'recent-products/',
					),
					'gradients'           => array(
						'title'   => 'Gradients',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'gradients/',
					),
					'section-dividers'    => array(
						'title'   => 'Section Dividers',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'section-dividers/',
					),
					'brands-element'      => array(
						'title'   => 'Brands Element',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'brands-element/',
					),
					'button-with-popup'   => array(
						'title'   => 'Button with popup',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'button-with-popup/',
					),
					'ajax-products-tabs'  => array(
						'title'   => 'AJAX products tabs',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'ajax-products-tabs/',
					),
					'animated-counter'    => array(
						'title'   => 'Animated counter',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'animated-counter/',
					),
					'products-widgets'    => array(
						'title'   => 'Products widgets',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'products-widgets/',
					),
					'products-element'    => array(
						'title'     => 'Products grid',
						'process'   => 'xml',
						'type'      => 'element',
						'gutenberg' => false,
						'link'      => WOODMART_DEMO_URL . 'products-element/',
					),
					'blog-element'        => array(
						'title'   => 'Blog element',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'blog-element/',
					),
					'portfolio-element'   => array(
						'title'   => 'Portfolio element',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'portfolio-element/',
					),
					'menu-price'          => array(
						'title'   => 'Menu price',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'menu-price/',
					),
					'360-degree-view'     => array(
						'title'   => '360 degree view',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . '360-degree-view/',
					),
					'countdown-timer'     => array(
						'title'   => 'Countdown timer',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'countdown-timer/',
					),
					'testimonials'        => array(
						'title'   => 'Testimonials',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'testimonials/',
					),
					'team-member'         => array(
						'title'   => 'Team member',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'team-member/',
					),
					'social-buttons'      => array(
						'title'   => 'Social Buttons',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'social-buttons/',
					),
					'instagram'           => array(
						'title'   => 'Instagram',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'instagram/',
					),
					'google-maps'         => array(
						'title'   => 'Google maps',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'google-maps/',
					),
					'banners'             => array(
						'title'   => 'Banners',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'banners/',
					),
					'carousels'           => array(
						'title'   => 'Carousels',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'carousels/',
					),
					'titles'              => array(
						'title'   => 'Titles',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'titles/',
					),
					'images-gallery'      => array(
						'title'   => 'Images gallery',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'images-gallery/',
					),
					'pricing-tables'      => array(
						'title'   => 'Pricing Tables',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'pricing-tables/',
					),
					'infobox'             => array(
						'title'   => 'Infobox',
						'process' => 'xml',
						'type'    => 'element',
						'link'    => WOODMART_DEMO_URL . 'infobox/',
					),
				),
			),
		),
		'books-2'               => array(
			'title'      => 'Books 2',
			'process'    => 'xml,home,options,headers,widgets',
			'type'       => 'version',
			'base'       => 'books-2_base',
			'link'       => WOODMART_DEMO_URL . 'books-2/',
			'categories' => array(),
			'partial'    => array(
				'pages'   => array(
					'books-2-about-us'           => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/about-us/',
					),
					'books-2-contact-us'         => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/contact-us/',
					),
					'books-2-bookstore-location' => array(
						'title'   => 'Bookstore Location',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/bookstore-location/',
					),
					'books-2-orders-shipping'    => array(
						'title'   => 'Orders & Shipping',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/orders-shipping/',
					),
					'books-2-payment'            => array(
						'title'   => 'Payment',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/payment/',
					),
					'books-2-returns'            => array(
						'title'   => 'Returns',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/returns/',
					),
					'books-2-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/cart/',
					),
					'books-2-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/checkout/',
					),
				),
				'layouts' => array(
					'books-2-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/product/the-score/',
					),
					'books-2-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/product-category/paper-books/',
					),
					'books-2-thank-you-page'   => array(
						'title'   => 'Thank you page',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/checkout/',
					),
					'books-2-login-register'   => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/my-account/',
					),
					'books-2-my-account'       => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/my-account/',
					),
					'books-2-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/2026/06/18/from-page-to-screen-the-best-book-adaptations/',
					),
					'books-2-blog-archive'     => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/blog/',
					),
					'books-2-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/product-category/fiction/',
					),
					'books-2-loop-item-2'      => array(
						'title'   => 'Loop item 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'books-2/',
					),
				),
			),
		),
		'jewellery-2'           => array(
			'title'      => 'Jewellery 2',
			'process'    => 'xml,home,options,headers,widgets',
			'type'       => 'version',
			'base'       => 'jewellery-2_base',
			'link'       => WOODMART_DEMO_URL . 'jewellery-2/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'jewellery-2-about-us'    => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/about-us/',
					),
					'jewellery-2-contact-us'  => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/contact-us/',
					),
					'jewellery-2-collections' => array(
						'title'   => 'Collections',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/collections/',
					),
					'jewellery-2-showrooms'   => array(
						'title'   => 'Showrooms',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/showrooms/',
					),
				),
				'layouts' => array(
					'jewellery-2-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/product/baya-hoop-earrings/',
					),
					'jewellery-2-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/shop/',
					),
					'jewellery-2-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/cart/',
					),
					'jewellery-2-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/checkout/',
					),
					'jewellery-2-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/2026/04/29/how-ethical-sourcing-is-changing-the-jewellery-game/',
					),
					'jewellery-2-blog-archive'     => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/blog/',
					),
					'jewellery-2-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'jewellery-2/shop/',
					),
				),
			),
		),
		'edc'                   => array(
			'title'      => 'EDC',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'edc_base',
			'link'       => WOODMART_DEMO_URL . 'edc/',
			'categories' => array(
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'edc-about-us'    => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/about-us/',
					),
					'edc-contact-us'  => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/contact-us',
					),
					'edc-collections' => array(
						'title'   => 'Collections',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/collections/',
					),
				),
				'layouts' => array(
					'edc-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/product/alpaka-zip-pouch-pro/',
					),
					'edc-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/shop/',
					),
					'edc-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/cart/',
					),
					'edc-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/checkout/',
					),
					'edc-my-account'       => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/my-account/',
					),
					'edc-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/2026/03/26/daily-essentials-unpacked/',
					),
					'edc-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/shop/',
					),
					'edc-loop-item-2'      => array(
						'title'   => 'Loop item 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'edc/',
					),
				),
			),
		),
		'keyboards'             => array(
			'title'      => 'Keyboards',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'keyboards_base',
			'link'       => WOODMART_DEMO_URL . 'keyboards/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'keyboards-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/about-us',
					),
					'keyboards-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/contact-us',
					),
				),
				'layouts' => array(
					'keyboards-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/product/lofree-block/',
					),
					'keyboards-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/shop/',
					),
					'keyboards-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/cart/',
					),
					'keyboards-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/checkout/',
					),
					'keyboards-my-account'       => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/my-account/',
					),
					'keyboards-login-register'   => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/my-account/',
					),
					'keyboards-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/shop/',
					),
					'keyboards-loop-item-2'      => array(
						'title'   => 'Loop item 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'keyboards/product/lofree-block/',
					),
				),
			),
		),
		'electronics-3'         => array(
			'title'      => 'Electronics 3',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'electronics-3_base',
			'link'       => WOODMART_DEMO_URL . 'electronics-3/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'electronics-3-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/about-us/',
					),
					'electronics-3-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/contact-us/',
					),
				),
				'layouts' => array(
					'electronics-3-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/product/apple-iphone-17-pro/',
					),
					'electronics-3-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/product-category/smartphones/',
					),
					'electronics-3-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/cart/',
					),
					'electronics-3-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/checkout/',
					),
					'electronics-3-my-account'       => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/my-account/',
					),
					'electronics-3-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/2025/07/17/review-of-the-new-macbook-pro-on-the-powerful-m3-chip-series/',
					),
					'electronics-3-blog-archive'     => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/blog/',
					),
					'electronics-3-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/shop/',
					),
					'electronics-3-loop-item-2'      => array(
						'title'   => 'Loop item 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'electronics-3/shop/',
					),
				),
			),
		),
		'fashion-2'             => array(
			'title'      => 'Fashion 2',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'fashion-2_base',
			'link'       => WOODMART_DEMO_URL . 'fashion-2/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'fashion-2-about-us'         => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/about-us/',
					),
					'fashion-2-contact-us'       => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/contact-us/',
					),
					'fashion-2-customer-service' => array(
						'title'   => 'Customer Service',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/customer-service/',
					),
				),
				'layouts' => array(
					'fashion-2-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/product/hooded-technical-jacket/',
					),
					'fashion-2-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/product-category/women/',
					),
					'fashion-2-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/product-category/kids/accessories-kids/',
					),
					'fashion-2-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/cart/',
					),
					'fashion-2-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/checkout/',
					),
					'fashion-2-my-account'         => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/my-account/',
					),
					'fashion-2-single-post'        => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/2025/12/03/embracing-modern-styles-a-behind-the-scenes-story-of-fashion/',
					),
					'fashion-2-blog-archive'       => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/blog/',
					),
					'fashion-2-loop-item'          => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'fashion-2/shop/',
					),
				),
			),
		),
		'perfumes'              => array(
			'title'      => 'Perfumes',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'perfumes_base',
			'link'       => WOODMART_DEMO_URL . 'perfumes/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'perfumes-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/about-us/',
					),
					'perfumes-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/contact-us/',
					),
					'perfumes-fragrances' => array(
						'title'   => 'Fragrances',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/fragrances',
					),
				),
				'layouts' => array(
					'perfumes-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/product/abyss-bleu-50ml/',
					),
					'perfumes-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/shop/',
					),
					'perfumes-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/cart/',
					),
					'perfumes-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/checkout/',
					),
					'perfumes-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/2025/10/28/scent-sensibility/',
					),
					'perfumes-loop-item'        => array(
						'title'   => 'Loop item',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'perfumes/shop/',
					),
				),
			),
		),
		'merchandise'           => array(
			'title'      => 'Merchandise',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'merchandise_base',
			'link'       => WOODMART_DEMO_URL . 'merchandise/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'merchandise-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/about-us/',
					),
					'merchandise-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/contact-us/',
					),
				),
				'layouts' => array(
					'merchandise-single-product' => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/product/alex-minecraft-figure/',
					),
					'merchandise-cart'           => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/cart/',
					),
					'merchandise-checkout'       => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/checkout/',
					),
					'merchandise-my-account'     => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/my-account/',
					),
					'merchandise-login-register' => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/my-account/',
					),
					'merchandise-lost-password'  => array(
						'title'   => 'Lost password',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'merchandise/my-account/lost-password/',
					),
				),
			),
		),
		'christmas-2'           => array(
			'title'      => 'Christmas 2',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'christmas-2_base',
			'link'       => WOODMART_DEMO_URL . 'christmas-2/',
			'categories' => array(
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'christmas-2-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/about-us/',
					),
					'christmas-2-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/contact-us/',
					),
				),
				'layouts' => array(
					'christmas-2-single-product'    => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/product/frosted-christmas-tree/',
					),
					'christmas-2-products-archive'  => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/product-category/decorations/',
					),
					'christmas-2-cart'              => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/cart/',
					),
					'christmas-2-checkout'          => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/checkout/',
					),
					'christmas-2-my-account'        => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/my-account/',
					),
					'christmas-2-login-register'    => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/my-account/',
					),
					'christmas-2-lost-password'     => array(
						'title'   => 'Lost password',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/my-account/lost-password/',
					),
					'christmas-2-single-portfolio'  => array(
						'title'   => 'Single portfolio',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/portfolio/a-brief-history-of-fashion-2/',
					),
					'christmas-2-portfolio-archive' => array(
						'title'   => 'Portfolio archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-2/portfolio/',
					),
				),
			),
		),
		'pets'                  => array(
			'title'      => 'Pets',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'pets_base',
			'link'       => WOODMART_DEMO_URL . 'pets/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'pets-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/about-us/',
					),
					'pets-best-deals' => array(
						'title'   => 'Best Deals',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/best-deals/',
					),
					'pets-brands'     => array(
						'title'   => 'Brands',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/brands',
					),
				),
				'layouts' => array(
					'pets-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/product/advance-chicken-in-jelly-kitten-pouches/',
					),
					'pets-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/product-category/dogs/',
					),
					'pets-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/product-category/dogs/food/',
					),
					'pets-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/cart/',
					),
					'pets-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/checkout/',
					),
					'pets-my-account'         => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/my-account/',
					),
					'pets-login-register'     => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/my-account/',
					),
					'pets-single-post'        => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/2025/06/13/first-night-with-your-puppy-a-survival-guide/',
					),
					'pets-blog-archive'       => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pets/blog/',
					),
				),
			),
		),
		'vinyls'                => array(
			'title'      => 'Vinyls',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'vinyls_base',
			'link'       => WOODMART_DEMO_URL . 'vinyls/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'vinyls-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/about-us/',
					),
					'vinyls-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/contact-us/',
					),
				),
				'layouts' => array(
					'vinyls-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/product/algorithmic-allegro/',
					),
					'vinyls-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/product-category/albums/',
					),
					'vinyls-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/cart/',
					),
					'vinyls-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/checkout/',
					),
					'vinyls-my-account'       => array(
						'title'   => 'My account',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/my-account/',
					),
					'vinyls-login-register'   => array(
						'title'   => 'Login/Register',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vinyls/my-account/',
					),
				),
			),
		),
		'handmade-bags'         => array(
			'title'      => 'Handmade bags',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'handmade-bags_base',
			'link'       => WOODMART_DEMO_URL . 'handmade-bags/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages' => array(
					'handmade-bags-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'handmade-bags/about-us/',
					),
					'handmade-bags-contact-us' => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'handmade-bags/contact-us/',
					),
				),
			),
		),
		'hemp-shoes'            => array(
			'title'      => 'Hemp shoes',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-hemp-shoes/demo/hemp-shoes/',
			'categories' => array(
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		't-shirts'              => array(
			'title'      => 'T-shirts',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 't-shirts_base',
			'link'       => WOODMART_DEMO_URL . 't-shirts-prints/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					't-shirts-contact-us' => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/contact-us/',
					),
					't-shirts-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/about-us/',
					),
				),
				'layouts' => array(
					't-shirts-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/product/active-t-shirt/',
					),
					't-shirts-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/shop/',
					),
					't-shirts-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/cart/',
					),
					't-shirts-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/checkout/',
					),
					't-shirts-single-post'      => array(
						'title'   => 'Single post',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/2025/01/27/mug-printing-101-the-secret-to-a-perfect-personalized-gift/',
					),
					't-shirts-blog-archive'     => array(
						'title'   => 'Blog archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 't-shirts-prints/blog/',
					),
				),
			),
		),
		'barbershop'            => array(
			'title'      => 'Barbershop',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'barbershop/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'marketplace2'          => array(
			'title'      => 'Marketplace 2',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'marketplace2_base',
			'link'       => WOODMART_DEMO_URL . 'marketplace2/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'marketplace2-about-us'        => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/about-us/',
					),
					'marketplace2-contact-us'      => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/contact-us/',
					),
					'marketplace2-faqs'            => array(
						'title'   => 'FAQs',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/faqs/',
					),
					'marketplace2-our-partners'    => array(
						'title'   => 'Our Partners',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/our-partners/',
					),
					'marketplace2-track-you-order' => array(
						'title'   => 'Track You Order',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/track-you-order/',
					),
					'marketplace2-work-with-us'    => array(
						'title'   => 'Work With Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/work-with-us/',
					),
				),
				'layouts' => array(
					'marketplace2-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/product/apple-macbook-pro-16-m1-pro/',
					),
					'marketplace2-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/product-category/electronics/',
					),
					'marketplace2-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/product-category/electronics/computers/',
					),
					'marketplace2-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/cart/',
					),
					'marketplace2-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'marketplace2/checkout/',
					),
				),
			),
		),
		'makeup'                => array(
			'title'      => 'Makeup',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'makeup_base',
			'link'       => WOODMART_DEMO_URL . 'makeup/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'makeup-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/about-us/',
					),
					'makeup-contact-us' => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/contact-us/',
					),
				),
				'layouts' => array(
					'makeup-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/product/hidraderm-hyal-liposomal-serum-30ml/',
					),
					'makeup-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/shop/',
					),
					'makeup-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/cart/',
					),
					'makeup-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'makeup/checkout/',
					),
				),
			),
		),
		'vegetables'            => array(
			'title'      => 'Vegetables',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'vegetables_base',
			'link'       => WOODMART_DEMO_URL . 'vegetables/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'vegetables-about-us'        => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/about-us/',
					),
					'vegetables-contact-us'      => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/contact-us/',
					),
					'vegetables-delivery'        => array(
						'title'   => 'Delivery',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/delivery/',
					),
					'vegetables-promotions'      => array(
						'title'   => 'Promotions',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/promotions/',
					),
					'vegetables-store-locations' => array(
						'title'   => 'Store Locations',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/store-locations/',
					),
				),
				'layouts' => array(
					'vegetables-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/product/tomatoes/',
					),
					'vegetables-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/product-category/vegetables-fruits/',
					),
					'vegetables-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/shop/',
					),
					'vegetables-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/cart/',
					),
					'vegetables-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'vegetables/checkout/',
					),
				),
			),
		),
		'pottery'               => array(
			'title'      => 'Pottery',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'pottery_base',
			'link'       => WOODMART_DEMO_URL . 'pottery/',
			'categories' => array(),
			'partial'    => array(
				'pages'   => array(
					'pottery-about-me'      => array(
						'title'   => 'About Me',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/about-me/',
					),
					'pottery-pottery-class' => array(
						'title'   => 'Pottery Class',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/pottery-class/',
					),
				),
				'layouts' => array(
					'pottery-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/product/white-glazed-mug/',
					),
					'pottery-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/shop/',
					),
					'pottery-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/cart/',
					),
					'pottery-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pottery/checkout/',
					),
				),
			),
		),
		'pills'                 => array(
			'title'      => 'Pills',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'pills_base',
			'link'       => WOODMART_DEMO_URL . 'pills/',
			'categories' => array(),
			'partial'    => array(
				'pages'   => array(
					'pills-about-us'        => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/about-us/',
					),
					'pills-contact-us'      => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/contact-us/',
					),
					'pills-ingredients'     => array(
						'title'   => 'Ingredients',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/ingredients/',
					),
					'pills-medical-experts' => array(
						'title'   => 'Medical Experts',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/medical-experts/',
					),
				),
				'layouts' => array(
					'pills-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/product/allergy-relief-30-tablets/',
					),
					'pills-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/shop/',
					),
					'pills-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/cart/',
					),
					'pills-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'pills/checkout/',
					),
				),
			),
		),
		'organic-farm'          => array(
			'title'      => 'Organic Farm',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'organic-farm_base',
			'link'       => WOODMART_DEMO_URL . 'organic-farm/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'organic-farm-contact-us' => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/contact-us/',
					),
					'organic-farm-about-us'   => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/about-us/',
					),
				),
				'layouts' => array(
					'organic-farm-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/product/organic-fresh-milk/',
					),
					'organic-farm-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/shop/',
					),
					'organic-farm-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/cart/',
					),
					'organic-farm-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'organic-farm/checkout/',
					),
				),
			),
		),
		'kids'                  => array(
			'title'      => 'Kids',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'kids_base',
			'link'       => WOODMART_DEMO_URL . 'kids/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'kids-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'kids/about-us/',
					),
					'kids-contact-us' => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'kids/contact-us/',
					),
				),
				'layouts' => array(
					'kids-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'kids/product/zip-growsuit/',
					),
					'kids-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'kids/shop/',
					),
				),
			),
		),
		'plants'                => array(
			'title'      => 'Plants',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'plants_base',
			'link'       => WOODMART_DEMO_URL . 'plants/',
			'categories' => array(),
			'partial'    => array(
				'pages'   => array(
					'plants-about-us'        => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/about-us/',
					),
					'plants-care-library'    => array(
						'title'   => 'Care library',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/care-library/',
					),
					'plants-contact-us'      => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/contact-us/',
					),
					'plants-delivery-return' => array(
						'title'   => 'Delivery & Return',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/delivery-return/',
					),
				),
				'layouts' => array(
					'plants-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/product/golden-petra/',
					),
					'plants-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/shop/',
					),
					'plants-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/cart/',
					),
					'plants-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'plants/checkout/',
					),
				),
			),
		),
		'games-light'           => array(
			'title'      => 'Games',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'games-light_base',
			'link'       => WOODMART_DEMO_URL . 'games/',
			'categories' => array(
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'games-light-about-us'      => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/about-us/',
					),
					'games-light-contact-us'    => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/contact-us/',
					),
					'games-light-terms-service' => array(
						'title'   => 'Terms Of Service',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/terms-of-service/',
					),
				),
				'layouts' => array(
					'games-light-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/product/star-wars-jedi-survivor/',
					),
					'games-light-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/product-category/action/',
					),
					'games-light-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/cart/',
					),
					'games-light-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/checkout/',
					),
				),
			),
		),
		'games-dark'            => array(
			'title'      => 'Games Dark',
			'process'    => 'xml,home,options,widgets,images',
			'type'       => 'version',
			'base'       => 'games-dark_base',
			'link'       => WOODMART_DEMO_URL . 'games/home-dark/',
			'categories' => array(
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'games-dark-about-us'      => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/about-us-dark/',
					),
					'games-dark-contact-us'    => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/contact-us-dark',
					),
					'games-dark-terms-service' => array(
						'title'   => 'Terms Of Service',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/terms-of-service/?opts=home-dark',
					),
				),
				'layouts' => array(
					'games-dark-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/product/star-wars-jedi-survivor/?opts=home-dark',
					),
					'games-dark-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/product-category/action/?opts=home-dark',
					),
					'games-dark-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/cart/?opts=home-dark',
					),
					'games-dark-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'games/checkout/?opts=home-dark',
					),
				),
			),
		),
		'furniture2'            => array(
			'title'      => 'Furniture 2',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'furniture2_base',
			'link'       => WOODMART_DEMO_URL . 'furniture2/',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'furniture2-about-us'   => array(
						'title'   => 'About us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/about-us/',
					),
					'furniture2-contact-us' => array(
						'title'   => 'Contact us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/contact-us/',
					),
					'furniture2-gift-cards' => array(
						'title'   => 'Gift cards',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/gift-cards',
					),
					'furniture2-showrooms'  => array(
						'title'   => 'Showrooms',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/showrooms/',
					),
				),
				'layouts' => array(
					'furniture2-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/product/curve/',
					),
					'furniture2-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/product-category/chairs/',
					),
					'furniture2-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/cart/',
					),
					'furniture2-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'furniture2/checkout/',
					),
				),
			),
		),
		'food-delivery'         => array(
			'title'      => 'Food Delivery',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-food-delivery/demo/food-delivery/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'event-agency'          => array(
			'title'      => 'Event Agency',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-event-agency/demo/event-agency/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'developer'             => array(
			'title'      => 'Developer',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-developer/demo/developer/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'architecture-studio'   => array(
			'title'      => 'Architecture Studio',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-architecture-studio/demo/architecture-studio/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'mega-electronics'      => array(
			'title'      => 'Mega Electronics',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'mega-electronics_base',
			'link'       => WOODMART_DEMO_URL . 'mega-electronics/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'mega-electronics-promotions'     => array(
						'title'   => 'Promotions',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/promotions/',
					),
					'mega-electronics-shopping-event' => array(
						'title'   => 'Shopping Event',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/apple-shopping-event/',
					),
					'mega-electronics-stores'         => array(
						'title'   => 'Store',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/stores/',
					),
					'mega-electronics-broadway-store' => array(
						'title'   => 'Broadway Store',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/broadway-store/',
					),
					'mega-electronics-delivery'       => array(
						'title'   => 'Delivery',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/delivery-return/',
					),
					'mega-electronics-our-contacts'   => array(
						'title'   => 'Our Contacts',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/our-contacts/',
					),
					'mega-electronics-outlet'         => array(
						'title'   => 'Outlet',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/outlet/',
					),
				),
				'layouts' => array(
					'mega-electronics-single-product'   => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/product/apple-macbook-pro-16-m1-pro-2/',
					),
					'mega-electronics-products-archive' => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/product-category/hardware-components/',
					),
					'mega-electronics-cart'             => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/cart/',
					),
					'mega-electronics-checkout'         => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'mega-electronics/checkout/',
					),
				),
			),
		),
		'megamarket'            => array(
			'title'      => 'Megamarket',
			'process'    => 'xml,home,options,widgets',
			'type'       => 'version',
			'base'       => 'megamarket_base',
			'link'       => WOODMART_DEMO_URL . 'megamarket/',
			'categories' => array(
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'megamarket-contact-us'           => array(
						'title'   => 'Contact Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/contact-us/',
					),
					'megamarket-lighting-discount'    => array(
						'title'   => 'Lighting Discount',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/lighting-discount/',
					),
					'megamarket-delivery-information' => array(
						'title'   => 'Delivery Information',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/payment-and-delivery/',
					),
					'megamarket-promotions'           => array(
						'title'   => 'Promotions',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/promotions/',
					),
					'megamarket-services'             => array(
						'title'   => 'Services',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/services/',
					),
					'megamarket-track-order'          => array(
						'title'   => 'Track Order',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/track-order/',
					),
				),
				'layouts' => array(
					'megamarket-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/product/rectangular-sink/',
					),
					'megamarket-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/all-products/',
					),
					'megamarket-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/product-category/flooring/',
					),
					'megamarket-products-archive-3' => array(
						'title'   => 'Products archive 3',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/product-category/tools/',
					),
					'megamarket-cart'               => array(
						'title'   => 'Cart',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/cart/',
					),
					'megamarket-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'megamarket/checkout/',
					),
				),
			),
		),
		'accessories'           => array(
			'title'      => 'Accessories',
			'process'    => 'xml,home,options,widgets,headers',
			'type'       => 'version',
			'base'       => 'accessories_base',
			'link'       => WOODMART_DEMO_URL . 'accessories/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
			'partial'    => array(
				'pages'   => array(
					'accessories-about-us'    => array(
						'title'   => 'About Us',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/about-us/',
					),
					'accessories-faqs'        => array(
						'title'   => 'FAQs',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/faqs/',
					),
					'accessories-shipping'    => array(
						'title'   => 'Shipping',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/shipping/',
					),
					'accessories-track-order' => array(
						'title'   => 'Track Order',
						'process' => 'xml,options',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/track-order/',
					),
				),
				'layouts' => array(
					'accessories-single-product'     => array(
						'title'   => 'Single product',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/product/iphone-12-pro-moment-case-blue/',
					),
					'accessories-products-archive'   => array(
						'title'   => 'Products archive',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/product-category/cases/',
					),
					'accessories-products-archive-2' => array(
						'title'   => 'Products archive 2',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/product-category/cases/iphone-11/',
					),
					'accessories-products-archive-3' => array(
						'title'   => 'Products archive 3',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/shop/',
					),
					'accessories-checkout'           => array(
						'title'   => 'Checkout',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'accessories/checkout/',
					),
				),
			),
		),
		'smart-home'            => array(
			'title'      => 'Smart Home',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-smart-home/demo/smart-home/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'school'                => array(
			'title'      => 'School',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-school/demo/school/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'real-estate'           => array(
			'title'      => 'Real Estate',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-real-estate/demo/real-estate/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'beauty'                => array(
			'title'      => 'Beauty',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-beauty/demo/beauty/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'sweets-bakery'         => array(
			'title'      => 'Sweets Bakery',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-sweets-bakery/demo/sweets-bakery/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
		),
		'decor'                 => array(
			'title'      => 'Decor',
			'process'    => 'xml,home,options,widgets,wood_slider,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-decor/demo/decor/',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'retail'                => array(
			'title'      => 'Retail',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-retail/demo/retail/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
		),
		'books'                 => array(
			'title'      => 'Books',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-books/demo/books/',
			'categories' => array(),
		),
		'shoes'                 => array(
			'title'      => 'Shoes',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-shoes/demo/shoes/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'marketplace'           => array(
			'title'      => 'Marketplace',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-marketplace/demo/marketplace/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
		),
		'electronics'           => array(
			'title'      => 'Electronics',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-electronics/demo/electronics/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'fashion-color'         => array(
			'title'      => 'Fashion Color',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-fashion-colored/demo/fashion-colored/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
			'partial'    => array(
				'pages' => array(
					'fashion-color-maintenance' => array(
						'title'   => 'Maintenance',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'maintenance-3/?demo=fashion-colored&opt=disable_popup/',
					),
				),
			),
		),
		'fashion-minimalism'    => array(
			'title'      => 'Fashion Minimalism',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-fashion-minimalism/demo/fashion-minimalism/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'tools'                 => array(
			'title'      => 'Tools',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-tools/demo/tools/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'grocery'               => array(
			'title'      => 'Grocery',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-grocery/demo/grocery/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
		),
		'lingerie'              => array(
			'title'      => 'Lingerie',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-lingerie/demo/lingerie/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'glasses'               => array(
			'title'      => 'Glasses',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-glasses/demo/glasses/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'black-friday'          => array(
			'title'      => 'Black Friday',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-black-friday/demo/black-friday/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
		),
		'retail-2'              => array(
			'title'      => 'Retail 2',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-retail-2/demo/retail-2/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Mega Store',
					'slug' => 'mega_store',
				),
			),
		),
		'handmade'              => array(
			'title'      => 'Handmade',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'handmade/',
			'partial'    => array(
				'pages' => array(
					'about-factory' => array(
						'title'   => 'About Factory',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'handmade/about-factory/',
					),
				),
			),
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'repair'                => array(
			'title'      => 'Repair',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-repair/demo/repair/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'lawyer'                => array(
			'title'      => 'Lawyer',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-lawyer/demo/lawyer/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'corporate-2'           => array(
			'title'      => 'Corporate 2',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-corporate-2/demo/corporate-2/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'drinks'                => array(
			'title'      => 'Drinks',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-drinks/demo/drinks/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
			),
		),
		'medical-marijuana'     => array(
			'title'      => 'Medical Marijuana',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-medical-marijuana/demo/medical-marijuana/',
			'categories' => array(),
		),
		'electronics-2'         => array(
			'title'      => 'Electronics 2',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-electronics-2/demo/electronics-2/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'fashion'               => array(
			'title'      => 'Fashion',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-fashion/demo/fashion/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'medical'               => array(
			'title'      => 'Medical',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-medical/demo/medical/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
		),
		'coffee'                => array(
			'title'      => 'Coffee',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-coffee/demo/coffee/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
			),
		),
		'camping'               => array(
			'title'      => 'Camping',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-camping/demo/camping/',
			'categories' => array(),
		),
		'alternative-energy'    => array(
			'title'      => 'Alternative Energy',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-alternative-energy/demo/alternative-energy/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
			),
		),
		'flowers'               => array(
			'title'      => 'Flowers',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-flowers/demo/flowers/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
		),
		'fashion-flat'          => array(
			'title'      => 'Fashion Flat',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-fashion-flat/demo/flat/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'bikes'                 => array(
			'title'      => 'Bikes',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-bikes/demo/bikes/',
			'categories' => array(),
		),
		'wine'                  => array(
			'title'      => 'Wine',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-wine/demo/wine/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
			),
		),
		'landing-gadget'        => array(
			'title'      => 'Landing Gadget',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-landing-gadget/demo/landing-gadget/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'travel'                => array(
			'title'      => 'Travel',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-travel/demo/travel/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
		),
		'corporate'             => array(
			'title'      => 'Corporate',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-corporate/demo/corporate/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'magazine'              => array(
			'title'      => 'Magazine',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'magazine/',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
			),
		),
		'hardware'              => array(
			'title'      => 'Hardware',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-hardware/?opt=hardware',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'food'                  => array(
			'title'      => 'Food',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-food/demo/food/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
		),
		'cosmetics'             => array(
			'title'      => 'Cosmetics',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-cosmetics/demo/cosmetics/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'motorcycle'            => array(
			'title'      => 'Motorcycle',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-motorcycle/demo/motorcycle/',
			'categories' => array(),
		),
		'sport'                 => array(
			'title'      => 'Sport',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-sport/demo/sport/',
			'categories' => array(),
		),
		'minimalism'            => array(
			'title'      => 'Minimalism',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-minimalism/demo/minimalism/',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'organic'               => array(
			'title'      => 'Organic',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-organic/demo/organic/',
			'categories' => array(
				array(
					'name' => 'Food',
					'slug' => 'food',
				),
			),
		),
		'watches'               => array(
			'title'      => 'Watches',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-watches/demo/watch/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'digitals'              => array(
			'title'      => 'Digital',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-digitals/demo/digitals/',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'jewellery'             => array(
			'title'      => 'Jewellery',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-jewellery/demo/jewellery/',
			'categories' => array(
				array(
					'name' => 'Fashion',
					'slug' => 'fashion',
				),
			),
		),
		'toys'                  => array(
			'title'      => 'Toys',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-toys/demo/toys/',
			'categories' => array(),
		),
		'mobile-app'            => array(
			'title'      => 'Mobile App',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-mobile-app/?opt=mobile_app',
			'categories' => array(
				array(
					'name' => 'Corporate',
					'slug' => 'corporate',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'christmas'             => array(
			'title'      => 'Christmas',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-christmas/demo/christmas/',
			'categories' => array(),
			'partial'    => array(
				'pages' => array(
					'christmas-maintenance' => array(
						'title'   => 'Christmas maintenance',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'christmas-maintenance/?opt=maintenance_xmas',
					),
				),
			),
		),
		'dark'                  => array(
			'title'      => 'Dark',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-dark/?opt=dark',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'cars'                  => array(
			'title'      => 'Cars',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'home-cars/demo/cars/',
			'categories' => array(
				array(
					'name' => 'Service',
					'slug' => 'service',
				),
			),
			'partial'    => array(
				'pages' => array(
					'cars-maintenance' => array(
						'title'   => 'Maintenance',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'maintenance-2/?opt=maintenance2',
					),
				),
			),
		),
		'furniture'             => array(
			'title'      => 'Furniture',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'demo-furniture/demo/furniture/',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
			'partial'    => array(
				'pages' => array(
					'furniture-maintenance' => array(
						'title'   => 'Maintenance',
						'process' => 'xml',
						'type'    => 'page',
						'link'    => WOODMART_DEMO_URL . 'maintenance/?opt=maintenance',
					),
				),
			),
		),
		'base-rtl'              => array(
			'title'      => 'Base rtl',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'home-rtl/?rtl',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'basic'                 => array(
			'title'      => 'Basic',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-basic/?opt=layout_basic',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'boxed'                 => array(
			'title'      => 'Boxed',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-boxed/?opt=layout_boxed',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'categories'            => array(
			'title'      => 'Categories',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-categories/?opt=layout_categories',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'landing'               => array(
			'title'      => 'Landing',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'landing/?opt=layout_landing',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'lookbook'              => array(
			'title'      => 'Lookbook',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-lookbook/?opt=layout_lookbook',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'video'                 => array(
			'title'      => 'Shaders slider',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-video/?opt=layout_video',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'parallax'              => array(
			'title'      => 'Parallax',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-parallax/?opt=layout_parallax',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
				array(
					'name' => 'Landing',
					'slug' => 'landing',
				),
			),
		),
		'infinite-scrolling'    => array(
			'title'      => 'Infinite Scrolling',
			'process'    => 'xml,home,options,widgets,wood_slider,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'infinite-scrolling/?opt=layout_infinite',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'grid'                  => array(
			'title'      => 'Grid',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-grid-2/?opt=layout_grid2',
			'categories' => array(
				array(
					'name' => 'Furniture',
					'slug' => 'furniture',
				),
			),
		),
		'digital-portfolio'     => array(
			'title'      => 'Digital Portfolio',
			'process'    => 'xml,home,options,widgets,headers,images',
			'type'       => 'version',
			'base'       => 'base',
			'link'       => WOODMART_DEMO_URL . 'layout-digital-portfolio/?opt=layout_digital_portfolio',
			'categories' => array(
				array(
					'name' => 'Electronics',
					'slug' => 'electronics',
				),
			),
		),
		'base'                  => array(
			'title'   => 'Base content (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'megamarket_base'       => array(
			'title'   => 'Base content megamarket (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'accessories_base'      => array(
			'title'   => 'Base content accessories (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'mega-electronics_base' => array(
			'title'   => 'Base content mega electronics (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'furniture2_base'       => array(
			'title'   => 'Base content furniture 2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'plants_base'           => array(
			'title'   => 'Base content plants (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'kids_base'             => array(
			'title'   => 'Base content kids (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'games-light_base'      => array(
			'title'   => 'Base content games-light (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'games-dark_base'       => array(
			'title'   => 'Base content games-dark (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'organic-farm_base'     => array(
			'title'   => 'Base content organic-farm (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'pills_base'            => array(
			'title'   => 'Base content pills (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'pottery_base'          => array(
			'title'   => 'Base content pottery (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'vegetables_base'       => array(
			'title'   => 'Base content vegetables (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'makeup_base'           => array(
			'title'   => 'Base content makeup (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'marketplace2_base'     => array(
			'title'   => 'Base content marketplace2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		't-shirts_base'         => array(
			'title'   => 'Base content t-shirts (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'handmade-bags_base'    => array(
			'title'   => 'Base content handmade-bags (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'vinyls_base'           => array(
			'title'   => 'Base content vinyls (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'pets_base'             => array(
			'title'   => 'Base content pets (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'christmas-2_base'      => array(
			'title'   => 'Base content christmas-2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'merchandise_base'      => array(
			'title'   => 'Base content merchandise (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'perfumes_base'         => array(
			'title'   => 'Base content perfumes (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'fashion-2_base'        => array(
			'title'   => 'Base content fashion-2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'electronics-3_base'    => array(
			'title'   => 'Base content electronics-3 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'keyboards_base'        => array(
			'title'   => 'Base content keyboards (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'edc_base'              => array(
			'title'   => 'Base content edc (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'jewellery-2_base'      => array(
			'title'   => 'Base content jewellery-2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
		'books-2_base'          => array(
			'title'   => 'Base content books-2 (required)',
			'process' => 'xml,xml_images,widgets,options,headers',
			'type'    => 'base',
		),
	)
);
