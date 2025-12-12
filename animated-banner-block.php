<?php
/**
 * Plugin Name: Animated Banner Block
 * Description: A custom animated banner Gutenberg block.
 * Version: 1.1.0
 * Author: Nino Hägglund
 */

function abb_register_block() {
    register_block_type( __DIR__ . '/src' );
}
add_action( 'init', 'abb_register_block' );

// Provide icons base URL to the block editor so edit.js can preview SVGs.
function abb_enqueue_editor_assets() {
    $base = plugin_dir_url( __FILE__ ) . 'assets/icons/';
    $script = 'window.abbIconsBase = ' . wp_json_encode( $base ) . ';';
    // Attach to a core block script to ensure availability; editor will already load wp-blocks.
    wp_add_inline_script( 'wp-blocks', $script, 'after' );
}
add_action( 'enqueue_block_editor_assets', 'abb_enqueue_editor_assets' );
