<?php
/**
 * MetaNord functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package MetaNord
 */

if (!defined('METANORD_VERSION')) {
    // Replace the version number of the theme on each release.
    define('METANORD_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function metanord_setup()
{
    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     */
    load_theme_textdomain('metanord', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    /*
     * Let WordPress manage the document title.
     */
    add_theme_support('title-tag');

    /*
     * Enable support for Post Thumbnails on posts and pages.
     */
    add_theme_support('post-thumbnails');

    // Custom image sizes
    add_image_size('metanord-blog-thumbnail', 800, 450, true);
    add_image_size('metanord-blog-full', 1200, 675, true);
    add_image_size('metanord-product-thumbnail', 600, 600, true);

    // Register navigation menus
    register_nav_menus(
        array(
            'menu-1' => esc_html__('Primary Menu', 'metanord'),
            'footer-menu' => esc_html__('Footer Menu', 'metanord'),
            'footer-links' => esc_html__('Footer Links', 'metanord'),
        )
    );

    /*
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    /**
     * Add support for core custom logo.
     */
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 80,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );

    // Add support for Block Styles.
    add_theme_support('wp-block-styles');

    // Add support for full and wide alignment.
    add_theme_support('align-wide');

    // Add support for editor styles.
    add_theme_support('editor-styles');

    // Add support for responsive embeds.
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'metanord_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function metanord_content_width()
{
    $GLOBALS['content_width'] = apply_filters('metanord_content_width', 1200);
}
add_action('after_setup_theme', 'metanord_content_width', 0);

/**
 * Register widget areas.
 */
function metanord_widgets_init()
{
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'metanord'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here to appear in your sidebar.', 'metanord'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        )
    );

    // Footer Widget Areas
    for ($i = 1; $i <= 4; $i++) {
        register_sidebar(
            array(
                'name'          => sprintf(esc_html__('Footer %d', 'metanord'), $i),
                'id'            => 'footer-' . $i,
                'description'   => sprintf(esc_html__('Add widgets here to appear in footer column %d.', 'metanord'), $i),
                'before_widget' => '<section id="%1$s" class="widget %2$s">',
                'after_widget'  => '</section>',
                'before_title'  => '<h3 class="footer-widget-title">',
                'after_title'   => '</h3>',
            )
        );
    }
}
add_action('widgets_init', 'metanord_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function metanord_scripts()
{
    // Main stylesheet
    wp_enqueue_style('metanord-style', get_stylesheet_uri(), array(), METANORD_VERSION);
    
    // Custom fonts
    wp_enqueue_style('metanord-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap', array(), null);
    
    // Main stylesheet
    wp_enqueue_style('metanord-main', get_template_directory_uri() . '/assets/css/main.css', array(), METANORD_VERSION);
    
    // Navigation script
    wp_enqueue_script('metanord-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), METANORD_VERSION, true);
    
    // Main script
    wp_enqueue_script('metanord-main', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), METANORD_VERSION, true);
    
    // Localize script for screen reader text
    wp_localize_script('metanord-main', 'metanordScreenReaderText', array(
        'backToTop' => __('Back to top', 'metanord'),
        'expandMenu' => __('Expand menu', 'metanord'),
        'collapseMenu' => __('Collapse menu', 'metanord'),
    ));

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
    
    // WooCommerce styles and scripts if active
    if (class_exists('WooCommerce')) {
        wp_enqueue_style('metanord-woocommerce', get_template_directory_uri() . '/assets/css/woocommerce.css', array(), METANORD_VERSION);
        wp_enqueue_script('metanord-woocommerce', get_template_directory_uri() . '/assets/js/woocommerce.js', array('jquery'), METANORD_VERSION, true);
    }
}
add_action('wp_enqueue_scripts', 'metanord_scripts');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load WooCommerce compatibility file if WooCommerce is activated.
 */
if (class_exists('WooCommerce')) {
    require get_template_directory() . '/inc/woocommerce.php';
}

/**
 * Filter the excerpt length to 25 words.
 */
function metanord_excerpt_length($length)
{
    return 25;
}
add_filter('excerpt_length', 'metanord_excerpt_length');

/**
 * Filter the excerpt "read more" string.
 */
function metanord_excerpt_more($more)
{
    return '...';
}
add_filter('excerpt_more', 'metanord_excerpt_more');

/**
 * Add a custom class to menu items that have children
 */
function metanord_add_menu_parent_class($items)
{
    $parents = array();
    foreach ($items as $item) {
        if ($item->menu_item_parent && $item->menu_item_parent > 0) {
            $parents[] = $item->menu_item_parent;
        }
    }
    
    foreach ($items as $item) {
        if (in_array($item->ID, $parents)) {
            $item->classes[] = 'menu-item-has-children';
        }
    }
    
    return $items;
}
add_filter('wp_nav_menu_objects', 'metanord_add_menu_parent_class');

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function metanord_pingback_header()
{
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'metanord_pingback_header');

/**
 * Create custom global ACF options pages
 */
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => __('Theme General Settings', 'metanord'),
        'menu_title'    => __('Theme Settings', 'metanord'),
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));
    
    acf_add_options_sub_page(array(
        'page_title'    => __('Theme Header Settings', 'metanord'),
        'menu_title'    => __('Header', 'metanord'),
        'parent_slug'   => 'theme-general-settings',
    ));
    
    acf_add_options_sub_page(array(
        'page_title'    => __('Theme Footer Settings', 'metanord'),
        'menu_title'    => __('Footer', 'metanord'),
        'parent_slug'   => 'theme-general-settings',
    ));
    
    acf_add_options_sub_page(array(
        'page_title'    => __('Company Information', 'metanord'),
        'menu_title'    => __('Company Info', 'metanord'),
        'parent_slug'   => 'theme-general-settings',
    ));
}

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Load ACF settings if ACF is active.
 */
if (class_exists('ACF')) {
    require get_template_directory() . '/inc/acf-settings.php';
}

/**
 * Custom breadcrumb function
 */
function metanord_breadcrumbs()
{
    // If Yoast SEO breadcrumbs are available, use those
    if (function_exists('yoast_breadcrumb')) {
        yoast_breadcrumb('<div class="breadcrumbs">', '</div>');
        return;
    }
    
    // Otherwise use our custom breadcrumbs
    $separator = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    $home_text = __('Home', 'metanord');
    
    echo '<div class="breadcrumbs">';
    
    // Home link
    echo '<span class="breadcrumb-item"><a href="' . esc_url(home_url('/')) . '">' . esc_html($home_text) . '</a></span>';
    
    if (is_category() || is_single()) {
        echo '<span class="separator">' . $separator . '</span>';
        
        // If post is in a category, show the category
        $categories = get_the_category();
        if ($categories) {
            $category = $categories[0];
            echo '<span class="breadcrumb-item"><a href="' . esc_url(get_category_link($category->term_id)) . '">' . esc_html($category->name) . '</a></span>';
        }
        
        // If it's a single post, show the title
        if (is_single()) {
            echo '<span class="separator">' . $separator . '</span>';
            echo '<span class="breadcrumb-item current">' . esc_html(get_the_title()) . '</span>';
        }
    } elseif (is_page()) {
        // If the page has ancestors, show them in the breadcrumb
        $ancestors = get_post_ancestors(get_the_ID());
        if ($ancestors) {
            $ancestors = array_reverse($ancestors);
            foreach ($ancestors as $ancestor) {
                echo '<span class="separator">' . $separator . '</span>';
                echo '<span class="breadcrumb-item"><a href="' . esc_url(get_permalink($ancestor)) . '">' . esc_html(get_the_title($ancestor)) . '</a></span>';
            }
        }
        
        // Show current page title
        echo '<span class="separator">' . $separator . '</span>';
        echo '<span class="breadcrumb-item current">' . esc_html(get_the_title()) . '</span>';
    } elseif (is_search()) {
        // Search results
        echo '<span class="separator">' . $separator . '</span>';
        echo '<span class="breadcrumb-item current">' . sprintf(__('Search Results for: %s', 'metanord'), get_search_query()) . '</span>';
    } elseif (is_404()) {
        // 404 page
        echo '<span class="separator">' . $separator . '</span>';
        echo '<span class="breadcrumb-item current">' . __('404 Not Found', 'metanord') . '</span>';
    } elseif (is_archive()) {
        // Archive pages
        echo '<span class="separator">' . $separator . '</span>';
        echo '<span class="breadcrumb-item current">' . get_the_archive_title() . '</span>';
    }
    
    echo '</div>';
}