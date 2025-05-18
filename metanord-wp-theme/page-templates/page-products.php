<?php
/**
 * Template Name: Products Page
 *
 * A template for displaying the product catalog.
 *
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">

    <?php if (has_post_thumbnail()) : ?>
        <div class="page-header" style="background-image: url('<?php echo esc_url(get_the_post_thumbnail_url(null, 'full')); ?>')">
            <div class="container">
                <h1 class="page-title"><?php the_title(); ?></h1>
                <?php
                // If there's a custom excerpt, display it as a subtitle
                $excerpt = get_the_excerpt();
                if (!empty($excerpt)) : ?>
                    <div class="page-subtitle"><?php echo wp_kses_post($excerpt); ?></div>
                <?php endif; ?>
            </div>
        </div>
    <?php else : ?>
        <div class="page-header">
            <div class="container">
                <h1 class="page-title"><?php the_title(); ?></h1>
                <?php
                // If there's a custom excerpt, display it as a subtitle
                $excerpt = get_the_excerpt();
                if (!empty($excerpt)) : ?>
                    <div class="page-subtitle"><?php echo wp_kses_post($excerpt); ?></div>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="container">
        <?php
        // Get the page content if any
        while (have_posts()) :
            the_post();
            
            if (get_the_content()) : ?>
                <div class="page-content">
                    <?php the_content(); ?>
                </div>
            <?php endif;
        endwhile;
        ?>

        <?php
        // Display product categories if ACF field exists
        $product_categories = get_field('product_categories');
        if ($product_categories) : ?>
            <div class="product-categories-section">
                <div class="section-title">
                    <h2>
                        <?php if (get_field('products_title')) : ?>
                            <?php echo esc_html(get_field('products_title')); ?>
                            <?php if (get_field('products_title_highlight')) : ?>
                                <span class="text-primary"><?php echo esc_html(get_field('products_title_highlight')); ?></span>
                            <?php endif; ?>
                        <?php else : ?>
                            <?php esc_html_e('Our Products', 'metanord'); ?>
                        <?php endif; ?>
                    </h2>
                    
                    <?php if (get_field('products_subtitle')) : ?>
                        <p><?php echo esc_html(get_field('products_subtitle')); ?></p>
                    <?php endif; ?>
                </div>

                <div class="product-categories-grid">
                    <?php foreach($product_categories as $category) : ?>
                        <div class="product-category">
                            <?php if (!empty($category['image'])) : ?>
                                <div class="product-category-image">
                                    <img src="<?php echo esc_url($category['image']['url']); ?>" alt="<?php echo esc_attr($category['title']); ?>">
                                </div>
                            <?php endif; ?>
                            
                            <div class="product-category-content">
                                <h3 class="product-category-title"><?php echo esc_html($category['title']); ?></h3>
                                <div class="product-category-description"><?php echo wp_kses_post($category['description']); ?></div>
                                
                                <?php if (!empty($category['link'])) : ?>
                                    <a href="<?php echo esc_url($category['link']); ?>" class="product-category-link">
                                        <?php esc_html_e('View Products', 'metanord'); ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php else : ?>
            <?php
            // If no ACF product categories, check for WooCommerce
            if (class_exists('WooCommerce')) :
                $product_categories = get_terms([
                    'taxonomy' => 'product_cat',
                    'hide_empty' => true,
                ]);
                
                if (!empty($product_categories) && !is_wp_error($product_categories)) : ?>
                    <div class="product-categories-section">
                        <div class="section-title">
                            <h2><?php esc_html_e('Our Products', 'metanord'); ?></h2>
                        </div>

                        <div class="product-categories-grid">
                            <?php foreach($product_categories as $category) : 
                                $category_thumbnail_id = get_term_meta($category->term_id, 'thumbnail_id', true);
                                $category_image = wp_get_attachment_url($category_thumbnail_id);
                                $category_link = get_term_link($category);
                            ?>
                                <div class="product-category">
                                    <?php if (!empty($category_image)) : ?>
                                        <div class="product-category-image">
                                            <img src="<?php echo esc_url($category_image); ?>" alt="<?php echo esc_attr($category->name); ?>">
                                        </div>
                                    <?php endif; ?>
                                    
                                    <div class="product-category-content">
                                        <h3 class="product-category-title"><?php echo esc_html($category->name); ?></h3>
                                        <div class="product-category-description"><?php echo wp_kses_post($category->description); ?></div>
                                        
                                        <a href="<?php echo esc_url($category_link); ?>" class="product-category-link">
                                            <?php esc_html_e('View Products', 'metanord'); ?>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif;
            endif; ?>
        <?php endif; ?>
    </div>
    
    <?php 
    // Check if the CTA template part should be included
    if (get_theme_mod('metanord_show_cta_on_products', true)) {
        get_template_part('template-parts/content', 'cta');
    }
    ?>

</main><!-- #main -->

<?php
get_footer();