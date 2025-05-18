<?php
/**
 * Advanced Custom Fields settings for MetaNord theme
 *
 * @package MetaNord
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register ACF options page
 */
function metanord_acf_options_page() {
    // Check if function exists
    if (function_exists('acf_add_options_page')) {
        // Add parent options page
        acf_add_options_page(array(
            'page_title'    => __('Theme Settings', 'metanord'),
            'menu_title'    => __('Theme Settings', 'metanord'),
            'menu_slug'     => 'theme-general-settings',
            'capability'    => 'edit_theme_options',
            'redirect'      => true,
            'position'      => '59.1',
            'icon_url'      => 'dashicons-admin-customizer',
        ));

        // Add sub options pages
        acf_add_options_sub_page(array(
            'page_title'    => __('General Settings', 'metanord'),
            'menu_title'    => __('General', 'metanord'),
            'parent_slug'   => 'theme-general-settings',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => __('Company Information', 'metanord'),
            'menu_title'    => __('Company Info', 'metanord'),
            'parent_slug'   => 'theme-general-settings',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => __('Social Media Links', 'metanord'),
            'menu_title'    => __('Social Media', 'metanord'),
            'parent_slug'   => 'theme-general-settings',
        ));

        acf_add_options_sub_page(array(
            'page_title'    => __('Footer Settings', 'metanord'),
            'menu_title'    => __('Footer', 'metanord'),
            'parent_slug'   => 'theme-general-settings',
        ));

        // Add WooCommerce settings page if WooCommerce is active
        if (class_exists('WooCommerce')) {
            acf_add_options_sub_page(array(
                'page_title'    => __('Shop Settings', 'metanord'),
                'menu_title'    => __('Shop Settings', 'metanord'),
                'parent_slug'   => 'theme-general-settings',
            ));
        }
    }
}
add_action('acf/init', 'metanord_acf_options_page');

/**
 * Setup ACF JSON save location
 */
function metanord_acf_json_save_point($path) {
    // Update path
    $path = get_stylesheet_directory() . '/acf-json';
    
    // Return path
    return $path;
}
add_filter('acf/settings/save_json', 'metanord_acf_json_save_point');

/**
 * Setup ACF JSON load location
 */
function metanord_acf_json_load_point($paths) {
    // Remove original path
    unset($paths[0]);
    
    // Append our path
    $paths[] = get_stylesheet_directory() . '/acf-json';
    
    // Return paths
    return $paths;
}
add_filter('acf/settings/load_json', 'metanord_acf_json_load_point');

/**
 * Register custom ACF blocks if ACF Pro is active
 */
function metanord_register_acf_blocks() {
    if (function_exists('acf_register_block_type')) {
        // Register hero block
        acf_register_block_type(array(
            'name'              => 'metanord-hero',
            'title'             => __('MetaNord Hero', 'metanord'),
            'description'       => __('A custom hero section block.', 'metanord'),
            'render_template'   => 'template-parts/blocks/hero/hero.php',
            'category'          => 'metanord-blocks',
            'icon'              => 'format-image',
            'keywords'          => array('hero', 'banner', 'header'),
            'enqueue_style'     => get_template_directory_uri() . '/template-parts/blocks/hero/hero.css',
            'supports'          => array(
                'align' => array('wide', 'full'),
            ),
        ));
        
        // Register product categories block
        acf_register_block_type(array(
            'name'              => 'metanord-product-categories',
            'title'             => __('MetaNord Product Categories', 'metanord'),
            'description'       => __('A block for displaying product categories.', 'metanord'),
            'render_template'   => 'template-parts/blocks/product-categories/product-categories.php',
            'category'          => 'metanord-blocks',
            'icon'              => 'grid-view',
            'keywords'          => array('products', 'categories', 'grid'),
            'enqueue_style'     => get_template_directory_uri() . '/template-parts/blocks/product-categories/product-categories.css',
        ));
        
        // Register call-to-action block
        acf_register_block_type(array(
            'name'              => 'metanord-cta',
            'title'             => __('MetaNord CTA', 'metanord'),
            'description'       => __('A call to action block.', 'metanord'),
            'render_template'   => 'template-parts/blocks/cta/cta.php',
            'category'          => 'metanord-blocks',
            'icon'              => 'megaphone',
            'keywords'          => array('cta', 'call', 'action'),
            'enqueue_style'     => get_template_directory_uri() . '/template-parts/blocks/cta/cta.css',
        ));
    }
}
add_action('acf/init', 'metanord_register_acf_blocks');

/**
 * Add custom block category
 */
function metanord_block_categories($categories, $post) {
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'metanord-blocks',
                'title' => __('MetaNord Blocks', 'metanord'),
            ),
        )
    );
}
add_filter('block_categories_all', 'metanord_block_categories', 10, 2);

/**
 * Helper function to get ACF field with fallback
 */
function metanord_get_field($field_name, $post_id = false, $default = '') {
    if (function_exists('get_field')) {
        $value = get_field($field_name, $post_id);
        return !empty($value) ? $value : $default;
    }
    return $default;
}

/**
 * Helper function to get option field with fallback
 */
function metanord_get_option($field_name, $default = '') {
    if (function_exists('get_field')) {
        $value = get_field($field_name, 'option');
        return !empty($value) ? $value : $default;
    }
    return $default;
}