<?php
/**
 * Assets for the title block.
 *
 * @package Woodmart
 */

$assets = array(
	'styles'    => array( 'block-title' ),
	'scripts'   => array(),
	'libraries' => array(),
);

if ( ! empty( $this->attrs['design'] ) ) {
	$assets['styles'][] = 'block-title-style';
}

if ( ! empty( $this->attrs['highlighted_effect'] ) && 'none' !== $this->attrs['highlighted_effect'] ) {
	$animation_type = ! empty( $this->attrs['highlighted_animation'] ) ? str_replace( '_', '-', $this->attrs['highlighted_animation'] ) : 'typing';

	$assets['styles'][] = 'opt-text-rotation-' . $animation_type;
} elseif (
	( ! empty( $this->attrs['highlightedVerticalOffset'] ) && 0 !== $this->attrs['highlightedVerticalOffset'] ) ||
	( ! empty( $this->attrs['highlightedVerticalOffsetTablet'] ) && 0 !== $this->attrs['highlightedVerticalOffsetTablet'] ) ||
	( ! empty( $this->attrs['highlightedVerticalOffsetMobile'] ) && 0 !== $this->attrs['highlightedVerticalOffsetMobile'] )
) {
	$assets['styles'][] = 'opt-text-highlight';
}

return $assets;
