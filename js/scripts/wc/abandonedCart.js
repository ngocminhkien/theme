/* global woodmart_settings */
woodmartThemeModule.abandonedCart = function() {
	var init = function() {
		recoverGuestCart();
		recoverGuestCartBlocks();
	}

	var recoverGuestCartBlocks = function() {
		if ( document.querySelector( '#billing_email' ) ) {
			return;
		}

		if ( ! document.querySelector( '.wp-block-woocommerce-checkout' ) ) {
			return;
		}

		var emailInput    = null;
		var consentCheckbox = null;
		var needsConsent  = 'yes' === woodmart_settings.abandoned_cart_needs_privacy;

		var sendBlocksAjax = function( email ) {
			jQuery.ajax( {
				url    : woodmart_settings.ajaxurl,
				data   : {
					action  : 'woodmart_recover_guest_cart',
					security: woodmart_settings.abandoned_cart_security,
					email   : email,
					currency: woodmart_settings.abandoned_cart_currency,
					language: woodmart_settings.abandoned_cart_language,
				},
				method : 'POST',
				error  : function() {
					console.log( 'Ajax error of capturing the abandoned basket of the guest' );
				},
			} );
		};

		var checkBlocksPrivacy = function() {
			if ( ! needsConsent ) {
				return true;
			}

			var el = document.querySelector( '[id="contact-woodmart-recover-guest-cart-consent"]' );

			return el && el.checked;
		};

		var onEmailChange = function( e ) {
			var email = e.target.value;

			if ( ! isValidEmail( email ) || ! checkBlocksPrivacy() ) {
				return;
			}

			sendBlocksAjax( email );
		};

		var onConsentChange = function( e ) {
			if ( ! e.currentTarget.checked || ! emailInput || ! isValidEmail( emailInput.value ) ) {
				return;
			}

			sendBlocksAjax( emailInput.value );
		};

		var tryAttach = function() {
			if ( ! emailInput ) {
				var emailEl = document.querySelector( '.wp-block-woocommerce-checkout #email' );

				if ( emailEl ) {
					emailInput = emailEl;
					emailInput.addEventListener( 'change', onEmailChange );
				}
			}

			if ( needsConsent && ! consentCheckbox ) {
				var consentEl = document.querySelector( '[id="contact-woodmart-recover-guest-cart-consent"]' );

				if ( consentEl ) {
					consentCheckbox = consentEl;
					consentCheckbox.addEventListener( 'change', onConsentChange );
				}
			}

			return !! emailInput && ( ! needsConsent || !! consentCheckbox );
		};

		if ( ! tryAttach() && window.wp && window.wp.data ) {
			var unsubscribe = window.wp.data.subscribe( function() {
				if ( tryAttach() ) {
					unsubscribe();
				}
			} );
		}
	};

	var recoverGuestCart = function() {
		var inp_email  = document.querySelector('#billing_email');

		if ( ! inp_email ) {
			return;
		}

		var attachConsentListener = function( checkbox ) {
			if ( ! checkbox ) {
				return;
			}

			checkbox.addEventListener( 'change', function( e ) {
				e.stopPropagation();

				if ( e.currentTarget.checked && inp_email.value.length && isValidEmail( inp_email.value ) ) {
					inp_email.dispatchEvent( new Event( 'change' ) );
				}
			} );
		};

		attachConsentListener( document.querySelector( '#_wd_recover_guest_cart_consent' ) );

		inp_email.addEventListener('change', function (e) {
			var target = e.target;
			var email  = target.value;

			if ( ! checkPrivacy() || ! isValidEmail(email)) {
				return;
			}
		
			var first_name = document.querySelector('#billing_first_name');
			var last_name  = document.querySelector('#billing_last_name');
			var phone      = document.querySelector('#billing_phone');
		
			jQuery.ajax({
				url     : woodmart_settings.ajaxurl,
				data    : {
					action: 'woodmart_recover_guest_cart',
					security: woodmart_settings.abandoned_cart_security,
					email,
					phone: phone ? phone.value : '',
					first_name: first_name ? first_name.value : '',
					last_name: last_name ? last_name.value : '',
					currency: woodmart_settings.abandoned_cart_currency,
					language: woodmart_settings.abandoned_cart_language,
				},
				method  : 'POST',
				error   : function() {
					console.log('Ajax error of capturing the abandoned basket of the guest');
				},
			});
		});
	};

	var isValidEmail = function(email) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	}

	var checkPrivacy = function() {
		if ( 'no' === woodmart_settings.abandoned_cart_needs_privacy ) {
			return true;
		}

		var privacyInput = document.querySelector( '#_wd_recover_guest_cart_consent' );

		return privacyInput && privacyInput.checked;
	};

	init();
}

window.addEventListener('load', function() {
	woodmartThemeModule.abandonedCart();
});
