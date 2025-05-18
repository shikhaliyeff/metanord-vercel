<?php
/**
 * Template part for displaying the products section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get products section content
$products_title = 'Our';
$products_title_highlight = 'Catalog';
$products_subtitle = 'Explore our range of high-quality infrastructure and industrial products';

// Optional - check if ACF is active and use those fields
if (function_exists('get_field')) {
    $products_title = get_field('products_title') ?: $products_title;
    $products_title_highlight = get_field('products_title_highlight') ?: $products_title_highlight;
    $products_subtitle = get_field('products_subtitle') ?: $products_subtitle;
}

// Product categories - if WooCommerce is active, use product categories
$product_categories = array(
    array(
        'title' => 'Aluminum Profiles',
        'description' => 'Premium European aluminum profiles for various commercial and industrial applications',
        'image' => get_template_directory_uri() . '/assets/images/products/aluminum-profiles.jpg',
        'link' => '#'
    ),
    array(
        'title' => 'Cast Iron Products',
        'description' => 'High-quality cast iron solutions for infrastructure and utility projects',
        'image' => get_template_directory_uri() . '/assets/images/Manhole cover D400(K) .png',
        'link' => '#'
    ),
    array(
        'title' => 'Polyethylene Pipes',
        'description' => 'Durable polyethylene pipe systems for water supply and drainage',
        'image' => get_template_directory_uri() . '/assets/images/HDPE pipes (PE pipes) .png',
        'link' => '#'
    ),
    array(
        'title' => 'Manhole Covers',
        'description' => 'Standard and custom manhole covers with various load capacities',
        'image' => get_template_directory_uri() . '/assets/images/Manhole cover D400 (B) Н140 .png',
        'link' => '#'
    ),
    array(
        'title' => 'Steel Pipes',
        'description' => 'High-strength steel pipes for construction and industrial applications',
        'image' => get_template_directory_uri() . '/assets/images/Steel Pipes For Oil and Gas Purpose .png',
        'link' => '#'
    ),
    array(
        'title' => 'Infrastructure Products',
        'description' => 'Comprehensive solutions for modern infrastructure projects',
        'image' => get_template_directory_uri() . '/assets/images/Gate valve cast iron DN50-500, PN10-16 .png',
        'link' => '#'
    )
);

// If WooCommerce is active, use product categories
if (class_exists('WooCommerce')) {
    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
        'parent' => 0,
        'number' => 6
    );
    
    $woo_categories = get_terms($args);
    
    if (!is_wp_error($woo_categories) && !empty($woo_categories)) {
        $product_categories = array();
        
        foreach ($woo_categories as $category) {
            $thumbnail_id = get_term_meta($category->term_id, 'thumbnail_id', true);
            $image = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : get_template_directory_uri() . '/assets/images/product-placeholder.jpg';
            
            $product_categories[] = array(
                'title' => $category->name,
                'description' => $category->description ? $category->description : __('Explore our range of high-quality products', 'metanord'),
                'image' => $image,
                'link' => get_term_link($category)
            );
        }
    }
}

// Optional - check if ACF is active and use those fields
if (function_exists('get_field') && have_rows('product_categories')) {
    $product_categories = array();
    while (have_rows('product_categories')) {
        the_row();
        $image = get_sub_field('image');
        
        $product_categories[] = array(
            'title' => get_sub_field('title'),
            'description' => get_sub_field('description'),
            'image' => $image ? $image['url'] : get_template_directory_uri() . '/assets/images/product-placeholder.jpg',
            'link' => get_sub_field('link')
        );
    }
}
?>

<!-- Products Section -->
<section id="products" class="products">
    <div class="container">
        <div class="section-header fade-in">
            <h2>
                <span><?php echo esc_html($products_title); ?></span>
                <span class="text-primary"><?php echo esc_html($products_title_highlight); ?></span>
            </h2>
            <p><?php echo esc_html($products_subtitle); ?></p>
        </div>
        
        <div class="row">
            <?php foreach ($product_categories as $index => $category) : ?>
                <div class="col col-md-4 col-sm-6 col-xs-12 mb-4">
                    <div class="product-card fade-in-up">
                        <div class="product-image-container">
                            <img src="<?php echo esc_url($category['image']); ?>" alt="<?php echo esc_attr($category['title']); ?>" class="product-image">
                            <div class="product-image-overlay">
                                <h3><?php echo esc_html($category['title']); ?></h3>
                            </div>
                        </div>
                        <div class="product-content">
                            <p><?php echo esc_html($category['description']); ?></p>
                            <a href="<?php echo esc_url($category['link']); ?>" class="view-more-link">
                                <?php esc_html_e('Explore Products', 'metanord'); ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="view-all-products text-center mt-12">
            <?php 
            $products_page = get_page_by_path('products');
            $products_link = $products_page ? get_permalink($products_page) : '#products';
            
            if (class_exists('WooCommerce')) {
                $products_link = get_permalink(wc_get_page_id('shop'));
            }
            ?>
            <a href="<?php echo esc_url($products_link); ?>" class="btn btn-primary">
                <?php esc_html_e('View All Products', 'metanord'); ?>
            </a>
        </div>
    </div>
</section>