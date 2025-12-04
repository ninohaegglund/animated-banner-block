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
