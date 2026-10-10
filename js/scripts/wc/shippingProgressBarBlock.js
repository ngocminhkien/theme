document.addEventListener( 'woodmart:blockCartUpdated', function ( event ) {
	var wrapper = document.querySelector( '.wd-shipping-progress-bar' );

	if ( ! wrapper ) {
		return;
	}

	var html = event.detail?.cartData?.extensions?.woodmart?.shipping_progress_bar_html;

	if ( typeof html !== 'undefined' ) {
		wrapper.innerHTML = html;
	}
} );