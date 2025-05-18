<?php
/**
 * WooCommerce Compatibility File
 *
 * @link https://woocommerce.com/
 *
 * @package MetaNord
 */

/**
 * WooCommerce setup function.
 *
 * @link https://docs.woocommerce.com/document/third-party-custom-theme-compatibility/
 * @link https://github.com/woocommerce/woocommerce/wiki/Enabling-product-gallery-features-(zoom,-swipe,-lightbox)
 *
 * @return void
 */
function metanord_woocommerce_setup()
{
    add_theme_support(
        'woocommerce',
        array(
            'thumbnail_image_width' => 400,
            'single_image_width'    => 800,
            'product_grid'          => array(
                'default_rows'    => 4,
                'min_rows'        => 1,
                'default_columns' => 3,
                'min_columns'     => 1,
                'max_columns'     => 6,
            ),
        )
    );
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}
add_action('after_setup_theme', 'metanord_woocommerce_setup');

/**
 * WooCommerce specific scripts & stylesheets.
 *
 * @return void
 */
function metanord_woocommerce_scripts()
{
    wp_enqueue_style('metanord-woocommerce-style', get_template_directory_uri() . '/assets/css/woocommerce.css', array(), METANORD_VERSION);

    $font_path   = WC()->plugin_url() . '/assets/fonts/';
    $inline_font = '@font-face {
            font-family: "star";
            src: url("' . $font_path . 'star.eot");
            src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
                url("' . $font_path . 'star.woff") format("woff"),
                url("' . $font_path . 'star.ttf") format("truetype"),
                url("' . $font_path . 'star.svg#star") format("svg");
            font-weight: normal;
            font-style: normal;
        }';

    wp_add_inline_style('metanord-woocommerce-style', $inline_font);
    
    // WooCommerce specific scripts
    wp_enqueue_script('metanord-woocommerce', get_template_directory_uri() . '/assets/js/woocommerce.js', array('jquery'), METANORD_VERSION, true);
}
add_action('wp_enqueue_scripts', 'metanord_woocommerce_scripts');

/**
 * Disable the default WooCommerce stylesheet.
 *
 * Removing the default WooCommerce stylesheet and enqueueing your own will
 * protect you during WooCommerce core updates.
 *
 * @link https://docs.woocommerce.com/document/disable-the-default-stylesheet/
 */
add_filter('woocommerce_enqueue_styles', '__return_empty_array');

/**
 * Add 'woocommerce-active' class to the body tag.
 *
 * @param  array $classes CSS classes applied to the body tag.
 * @return array $classes modified to include 'woocommerce-active' class.
 */
function metanord_woocommerce_active_body_class($classes)
{
    $classes[] = 'woocommerce-active';

    return $classes;
}
add_filter('body_class', 'metanord_woocommerce_active_body_class');

/**
 * Related Products Args.
 *
 * @param array $args related products args.
 * @return array $args related products args.
 */
function metanord_woocommerce_related_products_args($args)
{
    $defaults = array(
        'posts_per_page' => 4,
        'columns'        => 4,
    );

    $args = wp_parse_args($defaults, $args);

    return $args;
}
add_filter('woocommerce_output_related_products_args', 'metanord_woocommerce_related_products_args');

/**
 * Remove default WooCommerce wrapper.
 */
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);

if (!function_exists('metanord_woocommerce_wrapper_before')) {
    /**
     * Before Content.
     *
     * Wraps all WooCommerce content in wrappers which match the theme markup.
     *
     * @return void
     */
    function metanord_woocommerce_wrapper_before()
    {
        ?>
        <main id="primary" class="site-main">
            <div class="container woocommerce-container">
                <div class="row">
                    <div class="col-lg-12">
        <?php
    }
}
add_action('woocommerce_before_main_content', 'metanord_woocommerce_wrapper_before');

if (!function_exists('metanord_woocommerce_wrapper_after')) {
    /**
     * After Content.
     *
     * Closes the wrapping divs.
     *
     * @return void
     */
    function metanord_woocommerce_wrapper_after()
    {
        ?>
                    </div>
                </div>
            </div>
        </main><!-- #main -->
        <?php
    }
}
add_action('woocommerce_after_main_content', 'metanord_woocommerce_wrapper_after');

/**
 * Products per page.
 *
 * @return integer number of products.
 */
function metanord_woocommerce_products_per_page()
{
    return 12;
}
add_filter('loop_shop_per_page', 'metanord_woocommerce_products_per_page');

/**
 * Product gallery thumbnail columns.
 *
 * @return integer number of columns.
 */
function metanord_woocommerce_thumbnail_columns()
{
    return 4;
}
add_filter('woocommerce_product_thumbnails_columns', 'metanord_woocommerce_thumbnail_columns');

/**
 * Default loop columns on product archives.
 *
 * @return integer products per row.
 */
function metanord_woocommerce_loop_columns()
{
    return 3;
}
add_filter('loop_shop_columns', 'metanord_woocommerce_loop_columns');

/**
 * Sample implementation of the WooCommerce Mini Cart.
 *
 * You can add the WooCommerce Mini Cart to header.php like so ...
 *
 * <?php
 * if ( function_exists( 'metanord_woocommerce_header_cart' ) ) {
 * metanord_woocommerce_header_cart();
 * }
 * ?>
 */

if (!function_exists('metanord_woocommerce_cart_link_fragment')) {
    /**
     * Cart Fragments.
     *
     * Ensure cart contents update when products are added to the cart via AJAX.
     *
     * @param array $fragments Fragments to refresh via AJAX.
     * @return array Fragments to refresh via AJAX.
     */
    function metanord_woocommerce_cart_link_fragment($fragments)
    {
        ob_start();
        metanord_woocommerce_cart_link();
        $fragments['a.cart-contents'] = ob_get_clean();

        return $fragments;
    }
}
add_filter('woocommerce_add_to_cart_fragments', 'metanord_woocommerce_cart_link_fragment');

if (!function_exists('metanord_woocommerce_cart_link')) {
    /**
     * Cart Link.
     *
     * Displayed a link to the cart including the number of items present and the cart total.
     *
     * @return void
     */
    function metanord_woocommerce_cart_link()
    {
        ?>
        <a class="cart-contents" href="<?php echo esc_url(wc_get_cart_url()); ?>" title="<?php esc_attr_e('View your shopping cart', 'metanord'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-count"><?php echo wp_kses_data(WC()->cart->get_cart_contents_count()); ?></span>
        </a>
        <?php
    }
}

if (!function_exists('metanord_woocommerce_header_cart')) {
    /**
     * Display Header Cart.
     *
     * @return void
     */
    function metanord_woocommerce_header_cart()
    {
        if (is_cart()) {
            $class = 'current-menu-item';
        } else {
            $class = '';
        }
        ?>
        <div class="site-header-cart">
            <div class="<?php echo esc_attr($class); ?>">
                <?php metanord_woocommerce_cart_link(); ?>
            </div>
            <div class="cart-dropdown">
                <?php
                $instance = array(
                    'title' => '',
                );
                the_widget('WC_Widget_Cart', $instance);
                ?>
            </div>
        </div>
        <?php
    }
}

/**
 * Remove default WooCommerce sidebar
 */
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);