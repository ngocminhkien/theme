/* global woodmartConfig, woodmart_settings, elementor */

(function($) {
	'use strict';

	let tourSteps = [];

	window.addEventListener('load',function() {
		if (! $('body').hasClass('elementor-editor-wp-page')) {
			initGuide();
		}
	});

	if (typeof elementor !== 'undefined' && elementor.on) {
		elementor.once('preview:loaded', function() {
			const checkLoaderHidden = setInterval(() => {
				const loader = document.querySelector('#elementor-loading');

				if (!loader || loader.style.display === 'none') {
					clearInterval(checkLoaderHidden);

					initGuide()
				}
			}, 2000);
		});
	}

	function initGuide() {
		if (!window.driver || (('undefined' === typeof woodmartConfig && 'undefined' === typeof woodmart_settings) || (('undefined' !== typeof woodmartConfig && !woodmartConfig.guide_tour) && ('undefined' !== typeof woodmart_settings && !woodmart_settings.guide_tour)))) {
			return;
		}

		let config = getConfig();

		if ('undefined' === typeof config.guide_tour) {
			return;
		}

		const steps = config.guide_tour;
		const currentIndex = getCookieValue();

		tourSteps = steps;

		const validStepIndex = getValidStepIndex(steps, currentIndex);

		if (validStepIndex !== null) {
			const driverObj = window.driver.js.driver({
				showProgress: true,
				smoothScroll: true,
				overlayClickBehavior: 'none',
				allowKeyboardControl: false,
				nextBtnText: config.guide_next_text,
				prevBtnText: config.guide_back_text,
				doneBtnText: config.guide_done_text,
				steps: steps,
				onDestroyStarted: (element, step, options) => {
					if (options.driver.isLastStep()) {
						let url = config.guide_url_end;
						const param = 'wd_guide_done=' + getCookieValue('tour_id');

						if (url.includes('?')) {
							if (!url.includes('wd_guide_done=')) {
								url += '&' + param;
							}
						} else {
							url += '?' + param;
						}

						updateCookie(null);

						window.location.href = url;
					}
				},
				onHighlightStarted: ( element, step, options ) => {
					const activeStep = options.driver.getActiveIndex();

					trackStepProgress(activeStep);

					if (skipStepIfNeeded(step, activeStep, options)) {
						return;
					}

					bindStepCompletion(step, activeStep, options);
					scrollStepIntoView(element, step);

					setTimeout(function () {
						options.driver.refresh();
					}, 500)
				},
				onNextClick: (element, step, options) => {
					goToStep(options.driver.getActiveIndex() + 1, options);
				},
			});

			goToStep(validStepIndex, { driver: driverObj });

			$('.xts-tour-close').on('click', function() {
				driverObj.destroy();
				updateCookie(null);

				const url = new URL(window.location);
				url.searchParams.delete('wd_tour');

				let $body = $('body');

				$body.removeClass('driver-active-iframe')

				$body.attr('class').split(/\s+/).forEach(function(cls) {
					if (/^wd-guide-step-\d+$/.test(cls) || /^wd-guide-tour-\d+$/.test(cls)) {
						$body.removeClass(cls);
					}
				});

				window.history.replaceState({}, document.title, url.toString());
			});

			$('.xts-step-heading').on('click', function() {
				$(this).parents('.xts-tour-step').toggleClass('xts-open');
			});

			$('.xts-tour-collapse').on('click', function(e) {
				e.preventDefault();

				let $wrapper = $(this).parents('.xts-tour-navigation');

				$wrapper.toggleClass('xts-collapse');

				updateCookie( $wrapper.hasClass('xts-collapse'), 'collapse' );
			})
		} else {
			updateCookie(null);
		}
	}

	function goToStep(index, options) {
		const step = tourSteps[index];

		if (step && isIframeSelector(step.element)) {
			const iframeTarget = resolveIframeTarget(step.element);

			if (iframeTarget) {
				highlightStepInsideIframe(step, index, options, iframeTarget);

				return;
			}
		}

		$('body').removeClass('driver-active-iframe')

		if (options.driver.isActive()) {
			options.driver.moveNext();
		} else {
			options.driver.drive(index);
		}
	}

	function highlightStepInsideIframe(step, stepIndex, options, { iframe, innerElement }) {
		const config = getConfig();

		pauseOuterTour(options);

		$('body').addClass('driver-active-iframe')

		trackStepProgress(stepIndex);
		bindStepCompletion(step, stepIndex, options);

		const driverObjIframe = iframe.contentWindow.driver.js.driver({
			showProgress: true,
			smoothScroll: true,
			overlayClickBehavior: 'none',
			allowKeyboardControl: false,
			nextBtnText: config.guide_next_text,
			prevBtnText: config.guide_back_text,
			doneBtnText: config.guide_done_text,
			onNextClick: (iframeElement, iframeStep, iframeOptions) => {
				iframeOptions.driver.destroy();

				goToStep(stepIndex + 1, options);
			},
		});

		hidePreviousButton(step);
		destroyIframeDriverOnStepAction(step, innerElement, driverObjIframe);

		driverObjIframe.highlight({
			...step,
			element: innerElement,
		});
	}

	function destroyIframeDriverOnStepAction(step, innerElement, iframeDriver) {
		if ('button' !== step.type && 'hover' !== step.type) {
			return;
		}

		const $target = getTargetElement(innerElement);
		const action  = getTargetEventType($target, step.type);

		if (!$target || !action) {
			return;
		}

		$target.one( action + '.wdGuideStep', function () {
			iframeDriver.destroy();
		})
	}

	function pauseOuterTour(options) {
		options.driver.destroy();
	}

	function hidePreviousButton(step) {
		if (!step.popover || !Array.isArray(step.popover.showButtons)) {
			return;
		}

		const index = step.popover.showButtons.indexOf('previous');

		if (index !== -1) {
			step.popover.showButtons.splice(index, 1);
		}
	}

	function trackStepProgress(activeStep) {
		updateCookie(activeStep);
		updateTourNavigation(activeStep);
	}

	function skipStepIfNeeded(step, activeStep, options) {
		if (!stepIsSkipped(step)) {
			return false;
		}

		setTimeout(() => {
			goToStep(activeStep + 1, options);

			options.driver.refresh();
		})

		return true;
	}

	function bindStepCompletion(step, activeStep, options) {
		if (('button' !== step.type && 'hover' !== step.type) || !step.element) {
			return;
		}

		let navigatingAway = false;

		const $target = getTargetElement(step.element);
		const action  = getTargetEventType($target, step.type);

		if (!$target || !action) {
			return;
		}

		window.addEventListener('beforeunload', function () {
			navigatingAway = true;
		}, { once: true });

		$target.off(action + '.wdGuideStep').one( action + '.wdGuideStep', function () {
			setTimeout(function () {
				if (!navigatingAway) {
					if (step.isDone) {
						runStepIsDone(step, activeStep, options);

						pauseOuterTour(options);
					} else {
						goToStep(activeStep + 1, options);
					}
				}
			});

			if ( !step.isDone ) {
				updateCookie(activeStep + 1);
			}
		});
	}

	function scrollStepIntoView(element, step) {
		if (!element || 'undefined' === typeof step.offset || !step.offset) {
			return;
		}

		const rect = element.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const offset = step.offset;

		if (rect.height + offset >= viewportHeight) {
			return;
		}

		const distanceToBottom = viewportHeight - rect.bottom;

		if (distanceToBottom < offset) {
			const scrollY = window.scrollY + (offset - distanceToBottom) + 10;

			window.scrollTo({
				top: scrollY,
				behavior: 'smooth'
			});
		}
	}

	// Runs the step `isDone` script. It receives a `callback` that resumes the tour on the next step
	// once the step is considered completed (a request finished, a page finished reloading, etc.).
	function runStepIsDone(step, activeStep, options) {
		const callback = () => {
			updateCookie(activeStep + 1);

			goToStep(activeStep + 1, options);
		};

		try {
			const fn = new Function('options', 'activeStep', 'callback', step.isDone);

			fn(options, activeStep, callback);
		} catch (e) {
			console.error(e);
		}
	}

	function getValidStepIndex(steps, startIndex) {
		// Safeguard: advance past steps that are already completed before searching for the resume point.
		while (startIndex < steps.length && stepIsSkipped(steps[startIndex])) {
			updateCookie(startIndex + 1);
			updateTourNavigation(startIndex);

			startIndex++;
		}

		let validIndex = null;

		for (let i = startIndex; i >= 0; i--) {
			if (stepElementExists(steps[i]?.element)) {
				validIndex = i;
				break;
			}
		}

		if (validIndex === null) {
			return null;
		}

		let currentIndex = validIndex;

		if (steps[currentIndex].skipIf ) {
			while (currentIndex < steps.length) {
				const step = steps[currentIndex];

				if (!stepElementExists(step?.element)) {
					currentIndex++;
					continue;
				}

				if (stepIsSkipped(step)) {
					updateCookie(currentIndex);
					updateTourNavigation(currentIndex);

					currentIndex++;
					continue;
				}

				return currentIndex;
			}
		}

		return validIndex;
	}

	function stepIsSkipped(step) {
		if (!step || typeof step.skipIf !== 'string' || !step.skipIf) {
			return false;
		}

		try {
			return !! new Function(`return (${step.skipIf});`)();
		} catch (e) {
			console.error('Error in skipIf expression:', e);

			return false;
		}
	}

	function stepElementExists(selector) {
		if (!selector) {
			return false;
		}

		if (isIframeSelector(selector)) {
			return null !== resolveIframeTarget(selector);
		}

		return null !== document.querySelector(selector);
	}

	function isIframeSelector(selector) {
		return 'string' === typeof selector && selector.includes(' iframe ');
	}

	function splitIframeSelector(selector) {
		return {
			iframeSelector: selector.split(' iframe ')[0] + ' iframe',
			innerSelector : selector.split(' iframe ')[1],
		};
	}

	function resolveIframeTarget(selector) {
		const { iframeSelector, innerSelector } = splitIframeSelector(selector);
		const iframe = document.querySelector(iframeSelector);

		if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
			return null;
		}

		const innerElement = iframe.contentDocument.querySelector(innerSelector);

		if (!innerElement || !iframe.contentWindow.driver) {
			return null;
		}

		return { iframe, innerElement };
	}

	function getTargetElement(selector) {
		let $target = $(selector);

		if ( isIframeSelector(selector)) {
			$target = findTargetElementInIframe(selector);
		}

		$target = maybeFindActionableElement($target);

		return $target;
	}

	function findTargetElementInIframe(selector) {
		const { iframeSelector, innerSelector } = splitIframeSelector(selector);
		const iframe = document.querySelector(iframeSelector);

		if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
			return '';
		}

		return $(iframe.contentDocument.querySelector(innerSelector));
	}

	function maybeFindActionableElement($target) {
		const actionsSelectors = 'input:not([disabled], [type=hidden]), button, a, .wd-action, [draggable=true], [role="button"], [role="link"], [type="button"]';

		if ($target.is(actionsSelectors)) {
			return $target;
		}

		const $targetWIthActionsSelector = $target.find(actionsSelectors);

		return $targetWIthActionsSelector.length ? $targetWIthActionsSelector : $target;
	}

	function getTargetEventType($target, stepType = '') {
		if (!$target || !$target.length) {
			return '';
		}

		let action = 'click';

		if ( $target.is('input') && $target.attr('type') !== 'submit' ) {
			action = 'change';
		}

		action = stepType === 'hover' ? 'mouseenter' : action;

		return action;
	}

	function updateCookie(value, key = 'step') {
		const cookieName = 'woodmart_guide_tour';
		let config = typeof woodmartConfig !== 'undefined' ? woodmartConfig : woodmart_settings;
		let parsed = null;

		if (typeof Cookies === 'undefined') {
			return;
		}

		const rawValue = Cookies.get(cookieName);

		if (rawValue) {
			parsed = JSON.parse(rawValue);
		}

		if (!parsed || typeof parsed.tour_id === 'undefined' || !parsed.tour_id) {
			const urlParams = new URLSearchParams(window.location.search);
			const tourIdFromUrl = urlParams.get('wd_tour');

			parsed = {
				tour_id: tourIdFromUrl || null,
				[key]: value
			};
		} else {
			parsed[key] = value;
		}

		let newCookieValue = null;

		if (value != null) {
			newCookieValue = JSON.stringify(parsed)
		}

		Cookies.set(cookieName, newCookieValue, {
			expires: 1,
			path   : config.cookie_path,
			secure : config.cookie_secure_param
		});
	}

	function getCookieValue( name = 'step') {
		const cookieName = 'woodmart_guide_tour';
		const rawValue = Cookies.get(cookieName);

		if (rawValue) {
			const parsed = JSON.parse(rawValue);

			if (parsed && typeof parsed[name] !== 'undefined') {
				return parsed[name];
			}
		}

		if (name === 'tour_id') {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.has('wd_tour')) {
				return urlParams.get('wd_tour');
			}
		}

		return 0;
	}

	function updateTourNavigation( step ) {
		if ( ! step ) {
			return;
		}

		const $body = $('body');
		let $wrapper = $('.xts-tour-navigation');
		let $heading = $wrapper.find('.xts-tour-heading');
		let $steps = $wrapper.find('.xts-tour-step li');
		let $currentStep = $steps.eq(step);
		let $prevStep = $steps.filter('.xts-active');
		let $progressBar = $wrapper.find('.xts-tour-progress-bar');

		$body.attr('class').split(/\s+/).forEach(function(cls) {
			if (/^wd-guide-step-\d+$/.test(cls)) {
				$body.removeClass(cls);
			}
		});

		$heading.find('.xts-step-title').text( $currentStep.text() )

		if ( null !== $currentStep.length ) {
			$body.addClass(`wd-guide-step-${step}`);
		}

		$progressBar.css('width', `${(step + 1) / $steps.length * 100}%`);

		if (! $currentStep.parents('.xts-tour-step').hasClass('xts-active')) {
			$prevStep.parents('.xts-tour-step').removeClass('xts-active xts-open').addClass('xts-done');

			$currentStep.parents('.xts-tour-step').addClass('xts-active xts-open');
		}

		$prevStep.addClass('xts-done');

		$steps.each(function(index) {
			if (index >= step) {
				$(this).removeClass('xts-done');
				$(this).parents('.xts-tour-step').removeClass('xts-done');
			}
		});

		$steps.removeClass('xts-active')
		$currentStep.addClass('xts-active');
	}

	function getConfig() {
		return 'undefined' !== typeof woodmartConfig ? woodmartConfig : woodmart_settings;
	}
})(jQuery);
