/* global woodmart_settings */
(function($) {
	woodmartThemeModule.productImages = function() {
		var $document = $(document);

		$document.off('.wdProductImages');

		$document.on('click.wdProductImages', '.woocommerce-product-gallery .woocommerce-product-gallery__image > a', function(e) {
			e.preventDefault();

			var $this = $(this);
			var $productGallery = $this.closest('.woocommerce-product-gallery');

			if (!$productGallery.hasClass('image-action-popup')) {
				return;
			}

			openPhotoSwipe(e, $productGallery);
		});

		$document.on('click.wdProductImages', '.woocommerce-product-gallery .wd-show-product-gallery-wrap > a', function(e) {
			e.preventDefault();

			openPhotoSwipe(e, $(this).closest('.woocommerce-product-gallery'));
		});

		var openPhotoSwipe = function(e, $productGallery) {
			woodmartThemeModule.callPhotoSwipe(getCurrentGalleryIndex(e), getProductItems($productGallery));
		};

		var getCurrentGalleryIndex = function(e) {
			var index = 0;
			var $currentTarget = $(e.currentTarget);

			if ( $currentTarget.parents('.wd-carousel-item').length ) {
				index = $currentTarget.parents('.wd-carousel-item').index();
			} else if ( $currentTarget.hasClass( 'woodmart-show-product-gallery' ) ) {
				var wrapperGallery = $currentTarget.parents('.woocommerce-product-gallery');

				if ( wrapperGallery.hasClass('thumbs-position-left') || wrapperGallery.hasClass('thumbs-position-bottom') || wrapperGallery.hasClass('thumbs-position-without') ) {
					index = $currentTarget.parents('.wd-gallery-images').find('.wd-carousel-item.wd-active').index();
				}
			}

			return index;
		};

		var getProductItems = function($productGallery) {
			var items = [];

			$productGallery.find('.woocommerce-product-gallery__wrapper figure a img').each(function() {
				var $this = $(this);
				var src     = $this.attr('data-large_image'),
					width   = $this.attr('data-large_image_width'),
					height  = $this.attr('data-large_image_height'),
					caption = $this.attr('data-caption');

				if ( $this.parents('.wd-carousel-item.wd-with-video').length ) {
					var videoContent = $this.parents('.wd-with-video')[0].outerHTML;

					if ( -1 !== videoContent.indexOf('wd-inited') ) {
						videoContent = videoContent.replace('wd-inited', 'wd-loaded').replace('wd-video-playing', '');
					}

					items.push({
						html       : videoContent,
						mainElement: $this.parents('.wd-with-video'),
					});
				} else {
					items.push({
						src  : src,
						w    : width,
						h    : height,
						title: (woodmart_settings.product_images_captions === 'yes') ? caption : false
					});
				}
			});

			return items;
		};
	};

	$(document).ready(function() {
		woodmartThemeModule.productImages();
	});
})(jQuery);
