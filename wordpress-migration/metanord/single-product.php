<?php
/**
 * The Template for displaying all single products
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product.php.
 *
 * @see         https://docs.woocommerce.com/document/template-structure/
 * @package     MetaNord
 * @version     1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

get_header('shop');
?>

<div class="container mx-auto px-4 py-12">
    <div class="mb-6">
        <?php woocommerce_breadcrumb(); ?>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Product Content -->
        <div class="lg:col-span-2">
            <?php
            /**
             * woocommerce_before_main_content hook.
             *
             * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
             * @hooked woocommerce_breadcrumb - 20
             */
            do_action('woocommerce_before_main_content');
            ?>

            <?php while (have_posts()) : ?>
                <?php the_post(); ?>

                <?php wc_get_template_part('content', 'single-product'); ?>

            <?php endwhile; // end of the loop. ?>

            <?php
            /**
             * woocommerce_after_main_content hook.
             *
             * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
             */
            do_action('woocommerce_after_main_content');
            ?>
        </div>

        <!-- Product Sidebar -->
        <div class="lg:col-span-1">
            <?php
            /**
             * woocommerce_sidebar hook.
             *
             * @hooked woocommerce_get_sidebar - 10
             */
            do_action('woocommerce_sidebar');
            ?>

            <!-- Product Features -->
            <div class="bg-neutral-lightest p-6 rounded-lg shadow-sm mb-8">
                <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Key Features', 'metanord'); ?></h3>
                
                <?php
                // Get product features from ACF or product meta
                $product_features = get_field('product_features');
                if (!empty($product_features)) :
                ?>
                <ul class="space-y-2">
                    <?php foreach ($product_features as $feature) : ?>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <span><?php echo esc_html($feature); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php else : ?>
                <p><?php esc_html_e('Contact us for detailed product features.', 'metanord'); ?></p>
                <?php endif; ?>
            </div>

            <!-- Product Applications -->
            <div class="bg-neutral-lightest p-6 rounded-lg shadow-sm mb-8">
                <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Applications', 'metanord'); ?></h3>
                
                <?php
                // Get product applications from ACF or product meta
                $product_applications = get_field('product_applications');
                if (!empty($product_applications)) :
                ?>
                <ul class="space-y-2">
                    <?php foreach ($product_applications as $application) : ?>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                            </svg>
                            <span><?php echo esc_html($application); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php else : ?>
                <p><?php esc_html_e('Contact us to discuss potential applications for this product.', 'metanord'); ?></p>
                <?php endif; ?>
            </div>

            <!-- Contact CTA -->
            <div class="bg-primary text-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-bold mb-2"><?php esc_html_e('Need More Information?', 'metanord'); ?></h3>
                <p class="mb-4"><?php esc_html_e('Contact our team for detailed specifications, pricing, and availability.', 'metanord'); ?></p>
                <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-block bg-white text-primary font-bold py-2 px-6 rounded hover:bg-neutral-lightest transition-colors">
                    <?php esc_html_e('Contact Us', 'metanord'); ?>
                </a>
            </div>
        </div>
    </div>

    <!-- Related Products -->
    <div class="mt-16">
        <?php
        /**
         * woocommerce_after_single_product_summary hook.
         *
         * @hooked woocommerce_output_related_products - 20
         */
        do_action('woocommerce_after_single_product_summary');
        ?>
    </div>
</div>

<?php
get_footer('shop');