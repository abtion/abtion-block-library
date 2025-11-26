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

	$behavior = $attributes['behavior'] ?? 'normal';
	$classes = 'swiper is-' . $behavior;

?>

<div
	<?php echo get_block_wrapper_attributes( [ 'class' => $classes ] ); ?>
		data-wp-interactive="abtion-block-library"
		data-wp-init--setup="callbacks.setup"
	<?php
		echo wp_interactivity_data_wp_context(
			[
				'slidesPerViewDesktop' => $attributes['slidesPerViewDesktop'] ?? 2.5,
				'slidesPerViewMobile' => $attributes['slidesPerViewMobile'] ?? 1.5,
				'behavior'      => $behavior,
				'speed'         => $attributes['speed'] ?? 6000,
				'pauseOnHover'  => $attributes['pauseOnHover'] ?? true,
			]
		);
		?>
	
>
	<div class="swiper-wrapper wp-block-abtion-block-library-slider-slides">
		<?php echo $content; ?>
	</div>
	<div class="swiper-pagination"></div>
</div>
