<?php
/**
 * Custom Post Types for MetaNord theme
 *
 * @package MetaNord
 */

/**
 * Register custom post types for MetaNord theme
 */
function metanord_register_post_types() {
    // Register Project CPT
    register_post_type('project', array(
        'labels' => array(
            'name'               => _x('Projects', 'post type general name', 'metanord'),
            'singular_name'      => _x('Project', 'post type singular name', 'metanord'),
            'menu_name'          => _x('Projects', 'admin menu', 'metanord'),
            'name_admin_bar'     => _x('Project', 'add new on admin bar', 'metanord'),
            'add_new'            => _x('Add New', 'project', 'metanord'),
            'add_new_item'       => __('Add New Project', 'metanord'),
            'new_item'           => __('New Project', 'metanord'),
            'edit_item'          => __('Edit Project', 'metanord'),
            'view_item'          => __('View Project', 'metanord'),
            'all_items'          => __('All Projects', 'metanord'),
            'search_items'       => __('Search Projects', 'metanord'),
            'parent_item_colon'  => __('Parent Projects:', 'metanord'),
            'not_found'          => __('No projects found.', 'metanord'),
            'not_found_in_trash' => __('No projects found in Trash.', 'metanord'),
        ),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'projects'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 20,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array('title', 'editor', 'author', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
    ));

    // Register project categories taxonomy
    register_taxonomy('project_category', 'project', array(
        'labels' => array(
            'name'              => _x('Project Categories', 'taxonomy general name', 'metanord'),
            'singular_name'     => _x('Project Category', 'taxonomy singular name', 'metanord'),
            'search_items'      => __('Search Project Categories', 'metanord'),
            'all_items'         => __('All Project Categories', 'metanord'),
            'parent_item'       => __('Parent Project Category', 'metanord'),
            'parent_item_colon' => __('Parent Project Category:', 'metanord'),
            'edit_item'         => __('Edit Project Category', 'metanord'),
            'update_item'       => __('Update Project Category', 'metanord'),
            'add_new_item'      => __('Add New Project Category', 'metanord'),
            'new_item_name'     => __('New Project Category Name', 'metanord'),
            'menu_name'         => __('Categories', 'metanord'),
        ),
        'hierarchical'      => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'project-category'),
        'show_in_rest'      => true,
    ));

    // Register Testimonial CPT
    register_post_type('testimonial', array(
        'labels' => array(
            'name'               => _x('Testimonials', 'post type general name', 'metanord'),
            'singular_name'      => _x('Testimonial', 'post type singular name', 'metanord'),
            'menu_name'          => _x('Testimonials', 'admin menu', 'metanord'),
            'name_admin_bar'     => _x('Testimonial', 'add new on admin bar', 'metanord'),
            'add_new'            => _x('Add New', 'testimonial', 'metanord'),
            'add_new_item'       => __('Add New Testimonial', 'metanord'),
            'new_item'           => __('New Testimonial', 'metanord'),
            'edit_item'          => __('Edit Testimonial', 'metanord'),
            'view_item'          => __('View Testimonial', 'metanord'),
            'all_items'          => __('All Testimonials', 'metanord'),
            'search_items'       => __('Search Testimonials', 'metanord'),
            'parent_item_colon'  => __('Parent Testimonials:', 'metanord'),
            'not_found'          => __('No testimonials found.', 'metanord'),
            'not_found_in_trash' => __('No testimonials found in Trash.', 'metanord'),
        ),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'testimonials'),
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 21,
        'menu_icon'          => 'dashicons-format-quote',
        'supports'           => array('title', 'editor', 'thumbnail'),
        'show_in_rest'       => true,
    ));

    // Only register these custom post types if WooCommerce is not active
    if (!class_exists('WooCommerce')) {
        // Register Product CPT (only if WooCommerce is not active)
        register_post_type('metanord_product', array(
            'labels' => array(
                'name'               => _x('Products', 'post type general name', 'metanord'),
                'singular_name'      => _x('Product', 'post type singular name', 'metanord'),
                'menu_name'          => _x('Products', 'admin menu', 'metanord'),
                'name_admin_bar'     => _x('Product', 'add new on admin bar', 'metanord'),
                'add_new'            => _x('Add New', 'product', 'metanord'),
                'add_new_item'       => __('Add New Product', 'metanord'),
                'new_item'           => __('New Product', 'metanord'),
                'edit_item'          => __('Edit Product', 'metanord'),
                'view_item'          => __('View Product', 'metanord'),
                'all_items'          => __('All Products', 'metanord'),
                'search_items'       => __('Search Products', 'metanord'),
                'parent_item_colon'  => __('Parent Products:', 'metanord'),
                'not_found'          => __('No products found.', 'metanord'),
                'not_found_in_trash' => __('No products found in Trash.', 'metanord'),
            ),
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'products'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 22,
            'menu_icon'          => 'dashicons-products',
            'supports'           => array('title', 'editor', 'author', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
        ));

        // Register product categories taxonomy
        register_taxonomy('product_category', 'metanord_product', array(
            'labels' => array(
                'name'              => _x('Product Categories', 'taxonomy general name', 'metanord'),
                'singular_name'     => _x('Product Category', 'taxonomy singular name', 'metanord'),
                'search_items'      => __('Search Product Categories', 'metanord'),
                'all_items'         => __('All Product Categories', 'metanord'),
                'parent_item'       => __('Parent Product Category', 'metanord'),
                'parent_item_colon' => __('Parent Product Category:', 'metanord'),
                'edit_item'         => __('Edit Product Category', 'metanord'),
                'update_item'       => __('Update Product Category', 'metanord'),
                'add_new_item'      => __('Add New Product Category', 'metanord'),
                'new_item_name'     => __('New Product Category Name', 'metanord'),
                'menu_name'         => __('Categories', 'metanord'),
            ),
            'hierarchical'      => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'product-category'),
            'show_in_rest'      => true,
        ));
    }
}
add_action('init', 'metanord_register_post_types');

/**
 * Flush rewrite rules on theme activation
 */
function metanord_rewrite_flush() {
    metanord_register_post_types();
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'metanord_rewrite_flush');