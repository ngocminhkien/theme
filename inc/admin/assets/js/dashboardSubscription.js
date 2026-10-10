(function() {
	'use strict';

	function initSubscriptionForm(form) {
		if (form.dataset.subscriptionInitialized) {
			return;
		}

		form.dataset.subscriptionInitialized = 'true';

		var emailInput = form.querySelector('[name="email"]');
		var sourceInput = form.querySelector('[name="source"]');
		var submitButton = form.querySelector('[type="submit"]');
		var message = form.querySelector('.xts-subscribe-message');
		var endpoint = form.dataset.endpoint;
		var successMessage = form.dataset.successMessage;
		var errorMessage = form.dataset.errorMessage;

		function showMessage(text, type) {
			message.textContent = text;
			message.classList.remove('xts-success', 'xts-error');
			message.classList.add('success' === type ? 'xts-success' : 'xts-error');
		}

		form.addEventListener('submit', function(event) {
			event.preventDefault();

			if (!form.reportValidity()) {
				return;
			}

			submitButton.disabled = true;
			submitButton.setAttribute('aria-busy', 'true');
			form.classList.add('xts-loading');
			message.textContent = '';
			message.classList.remove('xts-success', 'xts-error');

			fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: emailInput.value.trim(),
					source: sourceInput.value
				})
			})
				.then(function(response) {
					return response.json().catch(function() {
						return {};
					}).then(function(data) {
						if (!response.ok) {
							throw new Error(data.message || errorMessage);
						}

						return data;
					});
				})
				.then(function(data) {
					showMessage(data.message || successMessage, 'success');
					emailInput.value = '';

					var formWrap = form.closest('.xts-subscribe-form-wrap');
					if (formWrap) {
						formWrap.classList.add('xts-success');
					}

					document.querySelectorAll('.xts-not-subscribed')
						.forEach(el => el.classList.remove('xts-not-subscribed'));
				})
				.catch(function(error) {
					showMessage(error.message || errorMessage, 'error');
				})
				.finally(function() {
					form.classList.remove('xts-loading');
					submitButton.disabled = false;
					submitButton.removeAttribute('aria-busy');
				});
		});
	}

	document.querySelectorAll('.xts-subscribe-form').forEach(initSubscriptionForm);
})();
