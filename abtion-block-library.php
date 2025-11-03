<?php
/**
 * Plugin Name:       Abtion Block Library
 * Plugin URI:        https://abtion.com
 * Description:       Abtion Block Library is a collection of custom blocks.
 * Version:           1.0.0
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
