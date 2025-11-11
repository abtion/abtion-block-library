<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @package abtion-block-library
 */

$url = $attributes['reviewsUrl'];

?>

<div class="wp-block-abtion-block-library-trustpilot">
	<?php

	switch ( $attributes['widgetType'] ) {
		case 'micro-combo':
			?>

		<!-- TrustBox widget - Micro Combo -->
		<div class="trustpilot-widget micro-combo" data-locale="<?php echo esc_attr( $attributes['locale'] ); ?>" data-template-id="<?php echo esc_attr( $attributes['templateId'] ); ?>" data-businessunit-id="<?php echo esc_attr( $attributes['businessUnitId'] ); ?>" data-style-height="20px" data-style-width="100%">
			<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Trustpilot', 'abtion-block-library' ); ?></a>
		</div>
		<!-- End TrustBox widget -->

			<?php
			break;

		case 'carousel':
			?>

		<!-- TrustBox widget - Carousel -->
		<div class="trustpilot-widget" data-locale="<?php echo esc_attr( $attributes['locale'] ); ?>" data-template-id="<?php echo esc_attr( $attributes['templateId'] ); ?>" data-businessunit-id="<?php echo esc_attr( $attributes['businessUnitId'] ); ?>" data-style-height="140px" data-style-width="100%" data-stars="<?php echo esc_attr( $attributes['stars'] ); ?>" data-review-languages="<?php echo esc_attr( $attributes['reviewLanguages'] ); ?>">
			<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Trustpilot', 'abtion-block-library' ); ?></a>
		</div>
		<!-- End TrustBox widget -->

			<?php
			break;
	}

	?>
</div>
