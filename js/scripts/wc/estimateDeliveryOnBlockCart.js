( function () {
	document.addEventListener( 'woodmart:blockCartUpdating', function () {
		const loaderOverlay = document.querySelector( '.wd-overall-est-del .wd-loader-overlay' );

		if ( loaderOverlay ) {
			loaderOverlay.classList.add( 'wd-loading' );
		}
	} );

	document.addEventListener( 'woodmart:blockCartUpdated', function ( event ) {
		const wrapper = document.querySelector( '.wd-overall-est-del' );

		if ( ! wrapper ) {
			return;
		}

		const loaderOverlay = wrapper.querySelector( '.wd-loader-overlay' );
		const infoMsg       = wrapper.querySelector( '.wd-info-msg' );

		if ( loaderOverlay ) {
			loaderOverlay.classList.remove( 'wd-loading' );
		}

		const estDelValue = event.detail?.cartData?.extensions?.woodmart?.overall_estimate_delivery;

		if ( typeof estDelValue !== 'undefined' && infoMsg ) {
			infoMsg.innerHTML = estDelValue;
		}
	} );
} )();