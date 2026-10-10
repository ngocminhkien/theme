(function($) {
	$.each([
		'frontend/element_ready/wd_tabs.default',
	], function(index, value) {
		woodmartThemeModule.wdElementorAddAction(value, function() {
			woodmartThemeModule.tabs();
		});
	});

	woodmartThemeModule.$document.on('wdTabsInit', function() {
		woodmartThemeModule.tabs();
	});

	woodmartThemeModule.tabs = function () {
		var animationClass = 'wd-in';
		var animationTime  = 100;

		function init() {
			var $tabsElements = $('.wd-tabs:not(.wd-products-tabs)');

			$tabsElements.each(initOneTabElement);
		}

		function initOneTabElement(index, tabsElement) {
			var $tabsElement = $(tabsElement);

			addTabEventHandlers($tabsElement);

			maybeOpenFirstTab($tabsElement);

			setTimeout(function() {
				$tabsElement.addClass( 'wd-inited' );
			}, animationTime * 2);
		}

		function addTabEventHandlers($tabsElement) {
			var $tabsList = getTabsList($tabsElement);

			if ('hover' === $tabsElement.data('open-on')) {
				$tabsList.on('mouseover', openTabContentHandler);
			}

			$tabsList.on('click', openTabContentHandler);
		}

		function maybeOpenFirstTab($tabsElement) {
			var firstTab = getTabsList($tabsElement)[0];

			if ( !$(firstTab).hasClass( 'wd-active' ) && !$tabsElement.hasClass( 'wd-inited' ) ) {
				$(firstTab).trigger( 'click' );
			}
		}

		function openTabContentHandler(e) {
			e.preventDefault();

			var $thisTab       = $(this);
			var $activeContent = getTabContent($thisTab);

			$activeContent.siblings().removeClass(animationClass);

			setTimeout(function() {
				$thisTab.siblings().removeClass('wd-active');

				$activeContent.siblings().removeClass('wd-active');
			}, animationTime);

			setTimeout(function() {
				$thisTab.addClass('wd-active');

				$activeContent.siblings().removeClass('wd-active');
				$activeContent.addClass('wd-active');
			}, animationTime);

			setTimeout(function() {
				$activeContent.addClass(animationClass);

				woodmartThemeModule.$document.trigger('resize.vcRowBehaviour');
				woodmartThemeModule.$document.trigger('wood-images-loaded');
			}, animationTime * 2);
		}

		function getTabsList($tabElement) {
			return $tabElement.find('> .wd-tabs-header > .wd-nav-wrapper > .wd-nav-tabs > li');
		}

		function getTabContent($tab) {
			var $tabsElement = $tab.closest('.wd-tabs:not(.wd-products-tabs)');

			return $tabsElement.find('> .wd-tabs-content-wrapper > .wd-tab-content').eq($tab.index());
		}

		init();
	};

	$(document).ready(function() {
		woodmartThemeModule.tabs();
	});
})(jQuery);