<?php
/**
 * Single product tabs block assets.
 *
 * @package woodmart
 */

$assets = array(
	'styles'    => array(),
	'scripts'   => array(),
	'libraries' => array(),
);

if ( ! empty( $this->attrs['layout'] ) && 'accordion' === $this->attrs['layout'] ) {
	$assets['styles'][] = 'block-accordion';
}

return $assets;
