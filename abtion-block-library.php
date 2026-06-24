<?php
/**
 * Plugin Name:       Abtion Block Library
 * Plugin URI:        https://abtion.com
 * Description:       Abtion Block Library is a collection of custom blocks.
 * Version:           1.12.0
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Author:            Abtion
 * Author URI:        https://abtion.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       abtion-block-library
 *
 * @package           abtion-block-library
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define plugin constants.
 */
define( 'ABTION_BLOCK_LIBRARY_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'ABTION_BLOCK_LIBRARY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers multiple block types from metadata loaded from a file.
 */
function abtion_block_library_register_blocks() {
	$build_dir = ABTION_BLOCK_LIBRARY_PLUGIN_PATH . '/build/blocks';

	if ( ! file_exists( $build_dir ) ) {
		return;
	}

	$block_json_files = glob( $build_dir . '/*/block.json' );

	foreach ( $block_json_files as $block_json_file ) {
		register_block_type( dirname( $block_json_file ) );
	}
}

add_action( 'init', 'abtion_block_library_register_blocks' );

/**
 * Register block category.
 *
 * @param array $categories Existing block categories.
 */
function abtion_block_library_register_block_category( array $categories ): array {
	$categories[] = array(
		'slug'  => 'abtion-blocks',
		'title' => __( 'Abtion Blocks', 'abtion-block-library' ),
	);

	return $categories;
}

add_filter( 'block_categories_all', 'abtion_block_library_register_block_category' );

/**
 * Fix for Dashicons styles bug
 * See https://github.com/WordPress/gutenberg/issues/53528
 */
function abtion_block_library_enqueue_dashicons() {
	if ( is_admin() ) {
		wp_enqueue_style( 'dashicons' );
	}
}

add_action( 'enqueue_block_assets', 'abtion_block_library_enqueue_dashicons' );

/**
 * Register Trustpilot script.
 */
function abtion_block_library_register_trustpilot_script() {
	wp_register_script(
		'abtion-block-library-trustpilot',
		'//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js',
		[],
		'1.0.0',
		true
	);
}

add_action( 'wp_enqueue_scripts', 'abtion_block_library_register_trustpilot_script' );

/**
 * Register Swiper styles and scripts. This is currently used by slider block.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		$css_rel = 'assets/vendor/swiper/swiper-bundle.min.css';
		$js_rel  = 'assets/vendor/swiper/swiper-bundle.min.js';

		$css_path = ABTION_BLOCK_LIBRARY_PLUGIN_PATH . $css_rel;
		$js_path  = ABTION_BLOCK_LIBRARY_PLUGIN_PATH . $js_rel;

		$css_url = ABTION_BLOCK_LIBRARY_PLUGIN_URL . $css_rel;
		$js_url  = ABTION_BLOCK_LIBRARY_PLUGIN_URL . $js_rel;

		$css_ver = file_exists( $css_path ) ? filemtime( $css_path ) : null;
		$js_ver  = file_exists( $js_path )  ? filemtime( $js_path )  : null;

		wp_register_style(
			'swiper',
			$css_url,
			[],
			$css_ver
		);

		wp_register_script(
			'swiper',
			$js_url,
			[],
			$js_ver,
			true
		);
	}
);

/**
 * Normalize the slider's dynamic (Query Loop) output into swiper markup.
 *
 * When the slider uses its dynamic content source it renders a core/query
 * carrying the `abtion-block-library/slider-query` variation namespace. Re-tag
 * that query's post-template <ul> as the swiper wrapper and each post <li> as a
 * swiper slide, so the slider's view script and styles (which key off those
 * classes) work unchanged.
 *
 * @param string $block_content The block HTML output.
 * @param array  $block         The block data.
 */
function abtion_block_library_slider_query_normalize( string $block_content, array $block ): string {
	if ( ( $block['attrs']['namespace'] ?? '' ) !== 'abtion-block-library/slider-query' ) {
		return $block_content;
	}

	if ( '' === trim( $block_content ) ) {
		return $block_content;
	}

	$tags = new WP_HTML_Tag_Processor( $block_content );

	// Re-tag the post-template <ul> as the swiper wrapper.
	while ( $tags->next_tag( 'ul' ) ) {
		$class = (string) $tags->get_attribute( 'class' );
		if ( str_contains( $class, 'wp-block-post-template' ) ) {
			$tags->add_class( 'swiper-wrapper' );
			$tags->add_class( 'wp-block-abtion-block-library-slider-slides' );
			break; // Only the post-template ul becomes the wrapper.
		}
	}

	// Re-tag each post <li> as a swiper slide.
	while ( $tags->next_tag( 'li' ) ) {
		$class = (string) $tags->get_attribute( 'class' );
		if ( str_contains( $class, 'wp-block-post' ) ) {
			$tags->add_class( 'wp-block-abtion-block-library-slider-slide' );
			$tags->add_class( 'swiper-slide' );
		}
	}

	return $tags->get_updated_html();
}

add_filter( 'render_block_core/query', 'abtion_block_library_slider_query_normalize', 10, 2 );
