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

$block_tabs = [];

foreach ( $block->parsed_block['innerBlocks'] as $innerblockkey => $innerblock ) {
	$block_tabs[] = [
		'id'       => $innerblock['attrs']['id'],
		'label'    => $innerblock['attrs']['label'] ?? __( 'Tab', 'abtion-block-library' ),
		'isActive' => $innerblockkey === 0,
	];
}

?>

<div
	<?php
	// get_block_wrapper_attributes() returns a string of safe, escaped HTML attributes.
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo get_block_wrapper_attributes();
	?>
	data-wp-interactive="abtion-block-library/tabs"
	<?php
	// wp_interactivity_data_wp_context() returns safe, JSON-encoded/escaped interactivity context attributes.
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo wp_interactivity_data_wp_context(
		[
			'tabs' => $block_tabs,
		]
	);
	?>
>
	<div class="wp-block-abtion-block-library-tabs__navigation">
		<div class="wp-block-abtion-block-library-tabs__navigation-inner">
			<template data-wp-each="context.tabs">
				<div data-wp-on--click="actions.open" data-wp-class--wp-block-abtion-block-library-tabs__navigation-item--active="context.item.isActive" class="wp-block-abtion-block-library-tabs__navigation-item" data-wp-text="context.item.label"></div>
			</template>
		</div>
	</div>

	<div class="wp-block-abtion-block-library-tabs__content">
		<?php foreach ( $block->parsed_block['innerBlocks'] as $tab_inner_block_key => $tab_inner_block ) : ?>
			<div class="wp-block-abtion-block-library-tabs__content-item
			<?php
			if ( $tab_inner_block_key === 0 ) {
				echo 'wp-block-abtion-block-library-tabs__content-item--active'; }
			?>
			" data-tab-id="<?php echo esc_attr( $tab_inner_block['attrs']['id'] ); ?>">
				<?php foreach ( $tab_inner_block['innerBlocks'] as $inner_block ) : ?>
					<?php
					// render_block() returns the block's final HTML, which must not be escaped.
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo render_block( $inner_block );
					?>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>
	</div>

</div>
