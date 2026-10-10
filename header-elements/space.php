<?php
/**
 * Header space element.
 *
 * @package woodmart
 */

$classes  = ' whb-' . $id;
$classes .= ' ' . $params['css_class'];
$unit     = isset( $params['width_unit'] ) ? $params['width_unit'] : 'px';
?>

<div class="whb-space-element<?php echo esc_attr( $classes ); ?>" style="width:<?php echo esc_attr( $params['width'] . $unit ); ?>;"></div>
