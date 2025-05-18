<?php
/**
 * Template part for displaying the Products section on the homepage
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get custom field values using ACF or native WordPress functions
$products_title = get_field('products_title') ?: __('Our', 'metanord');
$products_title_highlight = get_field('products_title_highlight') ?: __('Catalog', 'metanord');
$products_subtitle = get_field('products_subtitle') ?: __('Explore our range of high-quality infrastructure and industrial products', 'metanord');

// Categories to display (can be customized via ACF)
$product_categories = get_terms([
    'taxonomy' => 'product_cat',
    'hide_empty' => false,
    'parent' => 0,
    'number' => 8, // Limit to 8 top-level categories
]);

// If WooCommerce is not active or no categories found, use predefined ones
if (!function_exists('WC') || is_wp_error($product_categories) || empty($product_categories)) {
    $product_categories = [
        [
            'name' => __('Aluminum Profiles', 'metanord'),
            'slug' => 'aluminum-profiles',
            'description' => __('Premium European aluminum profiles for various commercial and industrial applications', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/aluminum-profiles.webp',
        ],
        [
            'name' => __('Cast Iron Products', 'metanord'),
            'slug' => 'cast-iron',
            'description' => __('High-quality cast iron solutions for infrastructure and utility projects', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/cast-iron.webp',
        ],
        [
            'name' => __('Polyethylene Pipes', 'metanord'),
            'slug' => 'polyethylene-pipes',
            'description' => __('Durable polyethylene pipe systems for water supply and drainage', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/polyethylene-pipes.webp',
        ],
        [
            'name' => __('Manhole Covers', 'metanord'),
            'slug' => 'manhole-covers',
            'description' => __('Standard and custom manhole covers with various load capacities', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/manhole-covers.webp',
        ],
        [
            'name' => __('Steel Pipes', 'metanord'),
            'slug' => 'steel-pipes',
            'description' => __('High-strength steel pipes for construction and industrial applications', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/steel-pipes.webp',
        ],
        [
            'name' => __('Infrastructure Products', 'metanord'),
            'slug' => 'infrastructure',
            'description' => __('Comprehensive solutions for modern infrastructure projects', 'metanord'),
            'image' => get_template_directory_uri() . '/assets/images/products/infrastructure.webp',
        ],
    ];
}
?>

<section id="products" class="py-20 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16" data-animation="fade-in">
            <h2 class="text-3xl md:text-4xl font-inter font-bold mb-4">
                <span><?php echo esc_html($products_title); ?></span>
                <span class="text-primary ml-2"><?php echo esc_html($products_title_highlight); ?></span>
            </h2>
            <p class="text-lg text-neutral-dark max-w-3xl mx-auto font-roboto">
                <?php echo esc_html($products_subtitle); ?>
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php 
            // If using predefined array
            if (!function_exists('WC') || is_wp_error($product_categories) || empty($product_categories)) {
                foreach ($product_categories as $index => $category) : 
                    // Animation delay for staggered effect
                    $delay = ($index % 3) * 0.1;
                ?>
                    <div class="product-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] bg-white" data-animation="fade-in" data-animation-delay="<?php echo esc_attr($delay); ?>">
                        <a href="<?php echo esc_url(home_url('/product-category/' . $category['slug'])); ?>" class="block">
                            <div class="relative aspect-[4/3] overflow-hidden">
                                <img src="<?php echo esc_url($category['image']); ?>" alt="<?php echo esc_attr($category['name']); ?>" class="w-full h-full object-cover transition-transform hover:scale-110">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <h3 class="text-xl font-semibold text-white p-4 font-inter"><?php echo esc_html($category['name']); ?></h3>
                                </div>
                            </div>
                            <div class="p-4">
                                <p class="text-neutral-dark mb-4 font-roboto"><?php echo esc_html($category['description']); ?></p>
                                <span class="inline-flex items-center text-primary font-semibold">
                                    <?php esc_html_e('Explore Products', 'metanord'); ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                    </div>
                <?php endforeach;
            } else {
                // Using WooCommerce categories
                foreach ($product_categories as $index => $category) : 
                    // Animation delay for staggered effect
                    $delay = ($index % 3) * 0.1;
                    
                    // Get category image
                    $thumbnail_id = get_term_meta($category->term_id, 'thumbnail_id', true);
                    $image = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'woocommerce_thumbnail') : wc_placeholder_img_src('woocommerce_thumbnail');
                ?>
                    <div class="product-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] bg-white" data-animation="fade-in" data-animation-delay="<?php echo esc_attr($delay); ?>">
                        <a href="<?php echo esc_url(get_term_link($category)); ?>" class="block">
                            <div class="relative aspect-[4/3] overflow-hidden">
                                <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($category->name); ?>" class="w-full h-full object-cover transition-transform hover:scale-110">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <h3 class="text-xl font-semibold text-white p-4 font-inter"><?php echo esc_html($category->name); ?></h3>
                                </div>
                            </div>
                            <div class="p-4">
                                <p class="text-neutral-dark mb-4 font-roboto"><?php echo esc_html($category->description); ?></p>
                                <span class="inline-flex items-center text-primary font-semibold">
                                    <?php esc_html_e('Explore Products', 'metanord'); ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </span>
                            </div>
                        </a>
                    </div>
                <?php endforeach;
            }
            ?>
        </div>

        <div class="text-center mt-12" data-animation="fade-in">
            <a href="<?php echo esc_url(home_url('/products')); ?>" class="btn-primary">
                <?php esc_html_e('View All Products', 'metanord'); ?>
            </a>
        </div>
    </div>
</section>