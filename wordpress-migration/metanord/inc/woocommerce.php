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
function metanord_woocommerce_setup() {
    add_theme_support(
        'woocommerce',
        array(
            'thumbnail_image_width' => 350,
            'single_image_width'    => 600,
            'product_grid'          => array(
                'default_rows'    => 3,
                'min_rows'        => 1,
                'default_columns' => 4,
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
function metanord_woocommerce_scripts() {
    wp_enqueue_style('metanord-woocommerce-style', get_template_directory_uri() . '/assets/css/woocommerce.css', array(), _S_VERSION);

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
 * @param array $classes CSS classes applied to the body tag.
 * @return array $classes modified to include 'woocommerce-active' class.
 */
function metanord_woocommerce_active_body_class($classes) {
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
function metanord_woocommerce_related_products_args($args) {
    $defaults = array(
        'posts_per_page' => 3,
        'columns'        => 3,
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
    function metanord_woocommerce_wrapper_before() {
        ?>
        <div id="primary" class="content-area">
            <main id="main" class="site-main">
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
    function metanord_woocommerce_wrapper_after() {
        ?>
            </main><!-- #main -->
        </div><!-- #primary -->
        <?php
    }
}
add_action('woocommerce_after_main_content', 'metanord_woocommerce_wrapper_after');

/**
 * Sample implementation of the WooCommerce Mini Cart.
 *
 * You can add the WooCommerce Mini Cart to header.php like so ...
 *
 * <?php
 * if ( function_exists( 'metanord_woocommerce_header_cart' ) ) {
 *     metanord_woocommerce_header_cart();
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
    function metanord_woocommerce_cart_link_fragment($fragments) {
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
    function metanord_woocommerce_cart_link() {
        ?>
        <a class="cart-contents" href="<?php echo esc_url(wc_get_cart_url()); ?>" title="<?php esc_attr_e('View your shopping cart', 'metanord'); ?>">
            <span class="cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </span>
            <span class="count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
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
    function metanord_woocommerce_header_cart() {
        if (is_cart()) {
            $class = 'current-menu-item';
        } else {
            $class = '';
        }
        ?>
        <div id="site-header-cart" class="site-header-cart">
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
 * Customize WooCommerce product display
 */

// Add custom fields to product pages
function metanord_woocommerce_custom_product_tabs($tabs) {
    // Add specifications tab
    $tabs['specifications_tab'] = array(
        'title'    => __('Specifications', 'metanord'),
        'priority' => 20,
        'callback' => 'metanord_woocommerce_specifications_tab_content',
    );

    // Add applications tab
    $tabs['applications_tab'] = array(
        'title'    => __('Applications', 'metanord'),
        'priority' => 30,
        'callback' => 'metanord_woocommerce_applications_tab_content',
    );

    return $tabs;
}
add_filter('woocommerce_product_tabs', 'metanord_woocommerce_custom_product_tabs');

// Specifications tab content
function metanord_woocommerce_specifications_tab_content() {
    global $product;
    
    // Get specifications from ACF fields
    $specifications = get_field('product_specifications', $product->get_id());
    
    if (!empty($specifications) && is_array($specifications)) {
        echo '<div class="product-specifications">';
        echo '<table class="specifications-table">';
        
        foreach ($specifications as $spec_key => $spec_value) {
            echo '<tr>';
            echo '<th>' . esc_html($spec_key) . '</th>';
            echo '<td>' . esc_html($spec_value) . '</td>';
            echo '</tr>';
        }
        
        echo '</table>';
        echo '</div>';
    } else {
        echo '<p>' . esc_html__('No specifications available for this product.', 'metanord') . '</p>';
    }
}

// Applications tab content
function metanord_woocommerce_applications_tab_content() {
    global $product;
    
    // Get applications from ACF fields
    $applications = get_field('product_applications', $product->get_id());
    
    if (!empty($applications) && is_array($applications)) {
        echo '<div class="product-applications">';
        echo '<ul class="applications-list">';
        
        foreach ($applications as $application) {
            echo '<li>' . esc_html($application) . '</li>';
        }
        
        echo '</ul>';
        echo '</div>';
    } else {
        echo '<p>' . esc_html__('No application information available for this product.', 'metanord') . '</p>';
    }
}

// Add features list before add to cart button
function metanord_woocommerce_product_features() {
    global $product;
    
    // Get features from ACF fields
    $features = get_field('product_features', $product->get_id());
    
    if (!empty($features) && is_array($features)) {
        echo '<div class="product-features mb-4">';
        echo '<h3>' . esc_html__('Key Features', 'metanord') . '</h3>';
        echo '<ul class="features-list mt-2">';
        
        foreach ($features as $feature) {
            echo '<li class="flex items-start mb-2">';
            echo '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">';
            echo '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />';
            echo '</svg>';
            echo '<span>' . esc_html($feature) . '</span>';
            echo '</li>';
        }
        
        echo '</ul>';
        echo '</div>';
    }
}
add_action('woocommerce_single_product_summary', 'metanord_woocommerce_product_features', 25);

// Customize shop page columns
function metanord_woocommerce_loop_columns() {
    return 3; // 3 products per row
}
add_filter('loop_shop_columns', 'metanord_woocommerce_loop_columns', 999);