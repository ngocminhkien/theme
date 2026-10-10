/* global woodmartThemeModule */
woodmartThemeModule.$document.on('wdSearchFullScreenContentLoaded wdShopPageInit wdRecentlyViewedProductLoaded wdProductsTabsLoaded', function() {
	woodmartThemeModule.mobileCarouselSimple();
});

woodmartThemeModule.mobileCarouselSimple = function() {
	var isRtl = woodmartThemeModule.$body.hasClass('rtl');

	document.querySelectorAll('.wd-carousel-container.wd-carousel-dis-mb:not(.wd-carousel-simple-mb)').forEach(function(container) {
		if (woodmartThemeModule.windowWidth > 1024) {
			return;
		}

		var carouselWrap = container.querySelector('.wd-carousel-wrap');
		var prevArrow    = container.querySelector('.wd-btn-arrow.wd-prev');
		var nextArrow    = container.querySelector('.wd-btn-arrow.wd-next');

		if (!carouselWrap || !prevArrow || !nextArrow) {
			return;
		}

		container.classList.add('wd-carousel-simple-mb');

		function getArrowsState() {
			if (woodmartThemeModule.windowWidth > 1024) {
				return null;
			}

			var scrollLeft  = carouselWrap.scrollLeft;
			var clientWidth = carouselWrap.clientWidth;
			var scrollWidth = carouselWrap.scrollWidth;
			var normalScroll = isRtl
				? (scrollLeft <= 0 ? Math.abs(scrollLeft) : scrollWidth - clientWidth - scrollLeft)
				: scrollLeft;

			return {
				hide: scrollWidth <= clientWidth,
				prevDisabled: normalScroll <= 1,
				nextDisabled: normalScroll + clientWidth >= scrollWidth - 1
			};
		}

		function updateArrows(arrowsState) {
			prevArrow.classList.toggle('wd-hide', arrowsState.hide);
			nextArrow.classList.toggle('wd-hide', arrowsState.hide);
			prevArrow.classList.toggle('wd-disabled', !arrowsState.hide && arrowsState.prevDisabled);
			nextArrow.classList.toggle('wd-disabled', !arrowsState.hide && arrowsState.nextDisabled);
		}

		function onArrowClick(e, direction) {
			if (woodmartThemeModule.windowWidth > 1024) {
				return;
			}

			e.preventDefault();

			var clientWidth = carouselWrap.clientWidth;
			var scrollWidth = carouselWrap.scrollWidth;
			var maxScroll   = scrollWidth - clientWidth;

			var currentScroll = Math.max(0, Math.min(carouselWrap.scrollLeft, maxScroll));

			var delta = direction === 'next' ? clientWidth : -clientWidth;

			if (isRtl) {
				delta = -delta;
			}

			var target = Math.max(0, Math.min(currentScroll + delta, maxScroll));

			carouselWrap.scrollTo({ left: target, behavior: 'smooth' });
		}

		var arrowsUpdateScheduled = false;
		var arrowsUpdatePending   = false;

		function scheduleArrowsUpdate() {
			if (arrowsUpdateScheduled) {
				arrowsUpdatePending = true;
				return;
			}

			arrowsUpdateScheduled = true;

			requestAnimationFrame(function() {
				var arrowsState = getArrowsState();

				if (!arrowsState) {
					arrowsUpdateScheduled = false;
					arrowsUpdatePending = false;
					return;
				}

				requestAnimationFrame(function() {
					updateArrows(arrowsState);
					arrowsUpdateScheduled = false;

					if (arrowsUpdatePending) {
						arrowsUpdatePending = false;
						scheduleArrowsUpdate();
					}
				});
			});
		}

		prevArrow.addEventListener('click', function(e) { onArrowClick(e, 'prev'); });
		nextArrow.addEventListener('click', function(e) { onArrowClick(e, 'next'); });

		carouselWrap.addEventListener('scroll', scheduleArrowsUpdate, { passive: true });

		scheduleArrowsUpdate();
	});
};

window.addEventListener('load', function() {
	woodmartThemeModule.mobileCarouselSimple();
});
