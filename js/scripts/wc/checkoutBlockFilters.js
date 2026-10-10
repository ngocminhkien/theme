( function () {
	if ( window.wc?.blocksCheckout?.registerCheckoutFilters ) {
		const {registerCheckoutFilters} = window.wc.blocksCheckout;

		registerCheckoutFilters('woodmart-front', {
			itemName: function (defaultValue, extensions) {
				const fbtBadge = extensions?.['woodmart']?.fbt_badge_html ?? '';
				const freeGiftBadge = extensions?.['woodmart']?.free_gift_badge_html ?? '';

				if (!fbtBadge && !freeGiftBadge) {
					return defaultValue;
				}

				return defaultValue + fbtBadge + freeGiftBadge;
			},

			cartItemClass: function (defaultValue, extensions) {
				const fbtClass = extensions?.['woodmart']?.fbt_item_class;
				const isFreeGift = extensions?.['woodmart']?.free_gift_badge_html;

				let classes = defaultValue;

				if (fbtClass) {
					classes = (classes ? classes + ' ' : '') + fbtClass;
				}

				if (isFreeGift) {
					classes = (classes ? classes + ' ' : '') + 'wd-fg-item';
				}

				return classes;
			},

			showRemoveItemLink: function (defaultValue, extensions) {
				if (extensions?.['woodmart']?.is_fbt_child || extensions?.['woodmart']?.is_free_gift_automatic) {
					return false;
				}

				return defaultValue;
			},
		});
	}

	if ( window.wp?.data ) {
		const CART_STORE_KEY = 'wc/store/cart';
		const { subscribe, select } = window.wp.data;

		let isUpdating          = false;
		let cartInitialized     = false;
		let prevCartFingerprint = null;

		function getCartFingerprint( storeSelect ) {
			const cartData = storeSelect.getCartData();

			if ( ! cartData ) {
				return null;
			}

			return ( cartData.totals?.total_price ?? '' ) + '|' + ( cartData.items?.length ?? 0 );
		}

		function dispatchCartUpdated( cartData ) {
			document.dispatchEvent( new CustomEvent( 'woodmart:blockCartUpdated', {
				detail: { cartData },
			} ) );
		}

		function tryInitCart( storeSelect ) {
			const cartData = storeSelect.getCartData();

			if ( ! cartData || ! Array.isArray( cartData.items ) ) {
				return false;
			}

			cartInitialized     = true;
			prevCartFingerprint = getCartFingerprint( storeSelect );

			requestAnimationFrame( function () {
				dispatchCartUpdated( cartData );
			} );

			return true;
		}

		tryInitCart( select( CART_STORE_KEY ) );

		subscribe( function () {
			const storeSelect = select( CART_STORE_KEY );

			if ( ! cartInitialized ) {
				tryInitCart( storeSelect );
				return;
			}

			const currentlyUpdating = storeSelect.isShippingRateBeingSelected() || storeSelect.isAddressFieldsForShippingRatesUpdating() || storeSelect.isCustomerDataUpdating();

			if ( currentlyUpdating && ! isUpdating ) {
				isUpdating = true;
				document.dispatchEvent( new CustomEvent( 'woodmart:blockCartUpdating' ) );

				return;
			}

			if ( ! currentlyUpdating && isUpdating ) {
				isUpdating          = false;
				prevCartFingerprint = getCartFingerprint( storeSelect );

				dispatchCartUpdated( storeSelect.getCartData() );

				return;
			}

			if ( ! isUpdating ) {
				const fingerprint = getCartFingerprint( storeSelect );

				if ( fingerprint !== null && fingerprint !== prevCartFingerprint ) {
					prevCartFingerprint = fingerprint;

					dispatchCartUpdated( storeSelect.getCartData() );
				}
			}
		}, CART_STORE_KEY );
	}
} )();