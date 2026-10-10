(function($) {
	$.each([
		'frontend/element_ready/wd_text_block.default',
		'frontend/element_ready/wd_title.default',
		'frontend/element_ready/wd_banner.default',
		'frontend/element_ready/wd_banner_carousel.default',
	], function(index, value) {
		woodmartThemeModule.wdElementorAddAction(value, function() {
			woodmartThemeModule.highlightedAnimation();
		});
	});

	woodmartThemeModule.highlightedAnimation = function() {
		$('.wd-rot-text').each(function() {
			let $animatedTextList = $(this);
			let $animatedTextWords = $animatedTextList.find('.wd-rot-text-item');
			let settings = JSON.parse($animatedTextList.attr('data-settings'));

			if ($animatedTextList.hasClass('wd-inited')) {
				return;
			}

			trimWords();
			runAnimation();

			function trimWords() {
				if ('typing' !== settings.animation) {
					return;
				}

				$animatedTextWords.each(function() {
					var $word = $(this);
					var letters = $word.text().trim().split('');

					for (var index = 0; index < letters.length; index++) {
						var letterClasses = '';

						if (0 === $word.index()) {
							letterClasses = 'wd-in';
						}

						if ( ' ' === letters[index] ) {
							letters[index] = '&nbsp;';
						}

						letters[index] = '<span class="' + letterClasses + '">' + letters[index] + '</span>';
					}

					$word.html(letters.join(''));
				});
			}

			function runAnimation() {
				if ('clip' !== settings.animation && 'typing' !== settings.animation) {
					$animatedTextList.css('width', getWordWidth($animatedTextWords.eq(0)));
				}

				setTimeout(function() {
					hideWord($animatedTextWords.eq(0));
				}, settings.delayTime);

				$animatedTextList.addClass('wd-inited');
			}

			function hideWord($word) {
				var nextWord = getNextWord($word);

				if ('typing' === settings.animation) {
					let selectionDuration = 500;
					let typeAnimationDelay = selectionDuration + 800;

					$animatedTextList.addClass('wd-selected');

					setTimeout(function() {
						$animatedTextList.removeClass('wd-selected');
						$word.addClass('wd-hide').removeClass('wd-active wd-first').children('span').removeClass('wd-in');
					}, selectionDuration);

					setTimeout(function() {
						showWord(nextWord, settings.durationTime);
					}, typeAnimationDelay);
				} else if ('clip' === settings.animation) {
					$animatedTextList.animate({width: '2px'}, settings.durationTime, function() {
						switchWord($word, nextWord);
						showWord(nextWord);
					});
				} else {
					switchWord($word, nextWord);

					setTimeout(function() {
						hideWord(nextWord);
					}, settings.delayTime);
				}
			}

			function showLetter($letter, $word, bool, duration) {
				$letter.addClass('wd-in');

				if (!$letter.is(':last-child')) {
					setTimeout(function() {
						showLetter($letter.next(), $word, bool, duration);
					}, duration);
				} else if (!bool) {
					setTimeout(function() {
						hideWord($word);
					}, settings.delayTime);
				}
			}

			function showWord($word, $duration) {
				if ('typing' === settings.animation) {
					let countLatters = $word.children('span').length ? $word.children('span').length : 1;					
					$duration = $duration / countLatters;

					showLetter($word.find('span').eq(0), $word, false, $duration);

					$word.addClass('wd-active').removeClass('wd-hide');
				} else if ('clip' === settings.animation) {
					$animatedTextList.animate({width: getWordWidth($word)}, settings.durationTime, function() {
						setTimeout(function() {
							hideWord($word);
						}, settings.delayTime);
					});
				}
			}

			function getNextWord($word) {
				return $word.is(':last-child') ? $word.parent().children().eq(0) : $word.next();
			}

			function getWordWidth($word) {
				var word = $word[0];
				var inlineStyle = word.getAttribute('style');

				// Slide/drop words are absolutely stretched (left/right: 0), so
				// measure the word as if it were a normal in-flow element.
				$word.css({
					position: 'static',
					left: 'auto',
					right: 'auto',
					width: 'auto',
				});

				var width = word.offsetWidth;

				// Restore the original inline styles.
				if (null === inlineStyle) {
					word.removeAttribute('style');
				} else {
					word.setAttribute('style', inlineStyle);
				}

				return width;
			}

			function switchWord($oldWord, $newWord) {
				if ('typing' !== settings.animation && 'clip' !== settings.animation) {
					$animatedTextWords.removeClass('wd-out');
					$oldWord.removeClass('wd-active wd-first').addClass('wd-out');
					$newWord.removeClass('wd-hide wd-out').addClass('wd-active');

					$animatedTextList.css({ width: getWordWidth($newWord) });
				} else {
					$oldWord.removeClass('wd-active wd-first').addClass('wd-hide');
					$newWord.removeClass('wd-hide').addClass('wd-active');
				}
			}
		});
	};

	$(document).ready(function() {
		woodmartThemeModule.highlightedAnimation();
	});
})(jQuery);
