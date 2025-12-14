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

?>

<div
	<?php
	// get_block_wrapper_attributes() returns a string of safe, escaped HTML attributes.
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo get_block_wrapper_attributes();
	?>
	data-wp-interactive="abtion-block-library/tabs"
>
	<div class="wp-block-abtion-block-library-tab__content">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $content;
		?>
	</div>
</div>
