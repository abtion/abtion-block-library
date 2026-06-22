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
 * @formatter Prettier
 */

	$behavior           = $attributes['behavior'] ?? 'normal';
	$classes            = 'swiper is-' . $behavior;
	$progress_bar_color = sanitize_hex_color( $attributes['progressBarColor'] ?? '#C6FA5F' );
	if ( ! $progress_bar_color ) {
		$progress_bar_color = '#C6FA5F';
	}
	$dot_active_color = sanitize_hex_color( $attributes['dotActiveColor'] ?? '#062929' );
	if ( ! $dot_active_color ) {
		$dot_active_color = '#062929';
	}

	$wrapper_style = '';
	if ( $behavior === 'hero-progress' ) {
		$wrapper_style = '--slider-progress-color:' . esc_attr( $progress_bar_color ) . ';';
	} elseif ( $behavior === 'gallery' ) {
		$wrapper_style = '--slider-dot-color:' . esc_attr( $dot_active_color ) . ';';
	}

?>

<div
	<?php
	// get_block_wrapper_attributes() returns a string of safe, escaped HTML attributes.
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo get_block_wrapper_attributes(
		[
			'class' => $classes,
			'style' => $wrapper_style,
		]
	);
	?>
		data-wp-interactive="abtion-block-library/slider"
		data-wp-init--setup="callbacks.setup"
	<?php
		// wp_interactivity_data_wp_context() returns safe, JSON-encoded/escaped interactivity context attributes.
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wp_interactivity_data_wp_context(
			[
				'slidesPerViewDesktop' => $attributes['slidesPerViewDesktop'] ?? 2.5,
				'slidesPerViewMobile'  => $attributes['slidesPerViewMobile'] ?? 1.5,
				'behavior'             => $behavior,
				'autoSlideDuration'    => isset( $attributes['autoSlideDuration'] ) ? (int) $attributes['autoSlideDuration'] : 0,
			]
		);
		?>
	
>
	<div class="swiper-wrapper wp-block-abtion-block-library-slider-slides">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $content;
		?>
	</div>

	<?php if ( $behavior === 'vertical' ) : ?>
	<!-- JS will populate this -->
	<ul
		class="swiper-text-nav swiper-no-swiping"
		aria-label="<?php esc_attr_e( 'Slider navigation', 'abtion-block-library' ); ?>"
	></ul>
	<?php elseif ( $behavior === 'normal' ) : ?>
		<div class="swiper-controls">
			<div class="swiper-scrollbar"></div>

			<div class="swiper-nav">
				<button
					class="swiper-button-prev"
					type="button"
					aria-label="<?php esc_attr_e( 'Previous slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>

				<button
					class="swiper-button-next"
					type="button"
					aria-label="<?php esc_attr_e( 'Next slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	<?php elseif ( $behavior === 'testimonials' ) : ?>
		<div class="swiper-controls swiper-controls--testimonials">
			<div class="swiper-nav">
				<button
					class="swiper-button-prev"
					type="button"
					aria-label="<?php esc_attr_e( 'Previous slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
						<path d="M15 6C15 6 9 10.4189 9 12C9 13.5812 15 18 15 18" fill="none" stroke="#062929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>

				<button
					class="swiper-button-next"
					type="button"
					aria-label="<?php esc_attr_e( 'Next slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
						<path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" fill="none" stroke="#062929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	<?php elseif ( $behavior === 'hero-progress' ) : ?>
		<div class="swiper-progress-bar" aria-hidden="true"></div>

		<div class="swiper-controls swiper-controls--hero-progress">
			<div class="swiper-nav">
				<button
					class="swiper-button-prev"
					type="button"
					aria-label="<?php esc_attr_e( 'Previous slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>

				<span class="swiper-page-counter"></span>

				<button
					class="swiper-button-next"
					type="button"
					aria-label="<?php esc_attr_e( 'Next slide', 'abtion-block-library' ); ?>"
				>
					<svg class="swiper-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	<?php elseif ( $behavior === 'gallery' ) : ?>
		<!-- JS will populate this -->
		<div
			class="swiper-dots"
			aria-label="<?php esc_attr_e( 'Slider navigation', 'abtion-block-library' ); ?>"
		></div>
	<?php endif; ?>
</div>
