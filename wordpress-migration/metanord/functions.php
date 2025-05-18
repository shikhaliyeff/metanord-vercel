<?php
/**
 * MetaNord Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package MetaNord
 */

if (!defined('_S_VERSION')) {
    // Replace the version number of the theme on each release.
    define('_S_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function metanord_setup() {
    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     */
    load_theme_textdomain('metanord', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support('title-tag');

    /*
     * Enable support for Post Thumbnails on posts and pages.
     *
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support('post-thumbnails');

    // This theme uses wp_nav_menu() in one location.
    register_nav_menus(
        array(
            'primary' => esc_html__('Primary', 'metanord'),
            'footer' => esc_html__('Footer', 'metanord'),
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
     *
     * @link https://codex.wordpress.org/Theme_Logo
     */
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );
}
add_action('after_setup_theme', 'metanord_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function metanord_content_width() {
    $GLOBALS['content_width'] = apply_filters('metanord_content_width', 1280);
}
add_action('after_setup_theme', 'metanord_content_width', 0);

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function metanord_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'metanord'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'metanord'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
}
add_action('widgets_init', 'metanord_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function metanord_scripts() {
    wp_enqueue_style('metanord-style', get_stylesheet_uri(), array(), _S_VERSION);
    wp_enqueue_style('metanord-main', get_template_directory_uri() . '/assets/css/main.css', array(), _S_VERSION);
    
    wp_enqueue_script('metanord-main', get_template_directory_uri() . '/assets/js/main.js', array(), _S_VERSION, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
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
 * Custom Post Types for MetaNord products.
 */
require get_template_directory() . '/inc/post-types.php';

/**
 * Load Jetpack compatibility file.
 */
if (defined('JETPACK__VERSION')) {
    require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load WooCommerce compatibility file.
 */
if (class_exists('WooCommerce')) {
    require get_template_directory() . '/inc/woocommerce.php';
}

/**
 * Load language switcher functionality if Polylang or WPML is active
 */
function metanord_language_switcher() {
    // Check for Polylang
    if (function_exists('pll_the_languages')) {
        $languages = pll_the_languages(array('raw' => 1));
        if ($languages) {
            echo '<div class="language-switcher">';
            foreach ($languages as $language) {
                $class = $language['current_lang'] ? 'active' : '';
                echo '<a class="' . $class . '" href="' . $language['url'] . '">' . $language['name'] . '</a>';
            }
            echo '</div>';
        }
    } 
    // Check for WPML
    elseif (function_exists('icl_get_languages')) {
        $languages = icl_get_languages('skip_missing=0&orderby=code');
        if (!empty($languages)) {
            echo '<div class="language-switcher">';
            foreach ($languages as $language) {
                $class = $language['active'] ? 'active' : '';
                echo '<a class="' . $class . '" href="' . $language['url'] . '">' . $language['native_name'] . '</a>';
            }
            echo '</div>';
        }
    }
}