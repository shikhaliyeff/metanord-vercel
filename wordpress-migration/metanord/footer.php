<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #page div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MetaNord
 */

?>

    <footer id="colophon" class="site-footer bg-primary-dark text-white py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Company Info -->
                <div class="footer-column">
                    <?php if (has_custom_logo()) : ?>
                        <div class="footer-logo mb-4">
                            <?php the_custom_logo(); ?>
                        </div>
                    <?php else : ?>
                        <h3 class="text-xl font-bold mb-4"><?php bloginfo('name'); ?></h3>
                    <?php endif; ?>
                    <p class="mb-4"><?php echo get_theme_mod('footer_description', __('MetaNord OÜ specializes in premium aluminum profiles and infrastructure products for European and international markets.', 'metanord')); ?></p>
                    <div class="social-icons flex space-x-4 mt-4">
                        <?php if (get_theme_mod('linkedin_url')) : ?>
                            <a href="<?php echo esc_url(get_theme_mod('linkedin_url')); ?>" target="_blank" rel="noopener noreferrer" class="text-white hover:text-accent transition-colors">
                                <span class="dashicons dashicons-linkedin"></span>
                            </a>
                        <?php endif; ?>
                        <?php if (get_theme_mod('facebook_url')) : ?>
                            <a href="<?php echo esc_url(get_theme_mod('facebook_url')); ?>" target="_blank" rel="noopener noreferrer" class="text-white hover:text-accent transition-colors">
                                <span class="dashicons dashicons-facebook"></span>
                            </a>
                        <?php endif; ?>
                        <?php if (get_theme_mod('instagram_url')) : ?>
                            <a href="<?php echo esc_url(get_theme_mod('instagram_url')); ?>" target="_blank" rel="noopener noreferrer" class="text-white hover:text-accent transition-colors">
                                <span class="dashicons dashicons-instagram"></span>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-column">
                    <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Quick Links', 'metanord'); ?></h3>
                    <?php
                    wp_nav_menu(
                        array(
                            'theme_location' => 'footer',
                            'menu_class'     => 'footer-menu',
                            'depth'          => 1,
                            'fallback_cb'    => false,
                            'container'      => false,
                            'before'         => '<span class="menu-item-icon"></span>',
                        )
                    );
                    ?>
                </div>

                <!-- Products -->
                <div class="footer-column">
                    <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Products', 'metanord'); ?></h3>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(home_url('/product-category/aluminum/')); ?>" class="text-white hover:text-accent transition-colors"><?php esc_html_e('Aluminum Products', 'metanord'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/product-category/cast-iron/')); ?>" class="text-white hover:text-accent transition-colors"><?php esc_html_e('Cast Iron Products', 'metanord'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/product-category/polyethylene/')); ?>" class="text-white hover:text-accent transition-colors"><?php esc_html_e('Polyethylene Products', 'metanord'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/product-category/steel/')); ?>" class="text-white hover:text-accent transition-colors"><?php esc_html_e('Steel Products', 'metanord'); ?></a></li>
                        <li><a href="<?php echo esc_url(home_url('/product-category/infrastructure/')); ?>" class="text-white hover:text-accent transition-colors"><?php esc_html_e('Infrastructure Products', 'metanord'); ?></a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="footer-column">
                    <h3 class="text-xl font-bold mb-4"><?php esc_html_e('Newsletter', 'metanord'); ?></h3>
                    <p class="mb-4"><?php esc_html_e('Subscribe to receive updates about our new products and special offers.', 'metanord'); ?></p>
                    
                    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post" class="newsletter-form">
                        <input type="hidden" name="action" value="metanord_newsletter_subscribe">
                        <?php wp_nonce_field('metanord_newsletter_nonce', 'newsletter_nonce'); ?>
                        
                        <div class="flex items-center">
                            <input type="email" name="subscriber_email" placeholder="<?php esc_attr_e('Your email address', 'metanord'); ?>" required 
                                class="py-2 px-4 w-full bg-primary-darker text-white border border-primary rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent">
                            <button type="submit" class="py-2 px-4 bg-accent text-white font-bold rounded-r-md hover:bg-accent-dark transition-colors">
                                <?php esc_html_e('Subscribe', 'metanord'); ?>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="mt-12 pt-6 border-t border-primary flex flex-col md:flex-row justify-between items-center">
                <div class="copyright mb-4 md:mb-0">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php esc_html_e('All rights reserved.', 'metanord'); ?></p>
                </div>
                
                <div class="legal-links flex flex-wrap justify-center">
                    <a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>" class="mx-2 text-white hover:text-accent transition-colors"><?php esc_html_e('Privacy Policy', 'metanord'); ?></a>
                    <a href="<?php echo esc_url(home_url('/terms-of-service/')); ?>" class="mx-2 text-white hover:text-accent transition-colors"><?php esc_html_e('Terms of Service', 'metanord'); ?></a>
                    <a href="<?php echo esc_url(home_url('/shipping-info/')); ?>" class="mx-2 text-white hover:text-accent transition-colors"><?php esc_html_e('Shipping Info', 'metanord'); ?></a>
                </div>
            </div>
        </div>
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>