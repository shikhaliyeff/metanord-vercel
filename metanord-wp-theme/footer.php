<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MetaNord
 */

?>

    <footer id="colophon" class="site-footer">
        <div class="footer-widgets">
            <div class="container">
                <div class="row">
                    <!-- Footer Column 1: About Us -->
                    <div class="col col-md-4 col-sm-12">
                        <div class="footer-widget">
                            <?php
                            if (is_active_sidebar('footer-1')) {
                                dynamic_sidebar('footer-1');
                            } else {
                            ?>
                                <h3 class="footer-widget-title"><?php esc_html_e('About MetaNord', 'metanord'); ?></h3>
                                <?php
                                if (has_custom_logo()) {
                                    $custom_logo_id = get_theme_mod('custom_logo');
                                    $logo = wp_get_attachment_image_src($custom_logo_id, 'full');
                                    if ($logo) {
                                        echo '<div class="footer-logo"><img src="' . esc_url($logo[0]) . '" alt="' . get_bloginfo('name') . '"></div>';
                                    }
                                }
                                ?>
                                <p><?php esc_html_e('MetaNord OÜ is an Estonia-based trading and distribution company specializing in high-quality aluminum profiles and infrastructure products for construction, utilities, and industrial sectors across European and international markets.', 'metanord'); ?></p>
                                
                                <div class="registry-info">
                                    <p>
                                        <strong><?php esc_html_e('Registry Code:', 'metanord'); ?></strong> 
                                        <?php echo esc_html(get_theme_mod('metanord_registry_code', '17235227')); ?>
                                    </p>
                                </div>
                            <?php
                            }
                            ?>
                        </div>
                    </div>
                    
                    <!-- Footer Column 2: Quick Links -->
                    <div class="col col-md-3 col-sm-6">
                        <div class="footer-widget">
                            <?php
                            if (is_active_sidebar('footer-2')) {
                                dynamic_sidebar('footer-2');
                            } else {
                            ?>
                                <h3 class="footer-widget-title"><?php esc_html_e('Quick Links', 'metanord'); ?></h3>
                                <nav class="footer-nav">
                                    <?php
                                    wp_nav_menu(array(
                                        'theme_location' => 'footer-menu',
                                        'menu_id'        => 'footer-menu',
                                        'depth'          => 1,
                                        'container'      => false,
                                        'fallback_cb'    => function() {
                                            echo '<ul>
                                                <li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('Home', 'metanord') . '</a></li>
                                                <li><a href="' . esc_url(home_url('/about')) . '">' . esc_html__('About Us', 'metanord') . '</a></li>
                                                <li><a href="' . esc_url(home_url('/products')) . '">' . esc_html__('Products', 'metanord') . '</a></li>
                                                <li><a href="' . esc_url(home_url('/services')) . '">' . esc_html__('Services', 'metanord') . '</a></li>
                                                <li><a href="' . esc_url(home_url('/contact')) . '">' . esc_html__('Contact', 'metanord') . '</a></li>
                                            </ul>';
                                        }
                                    ));
                                    ?>
                                </nav>
                            <?php
                            }
                            ?>
                        </div>
                    </div>
                    
                    <!-- Footer Column 3: Products -->
                    <div class="col col-md-2 col-sm-6">
                        <div class="footer-widget">
                            <?php
                            if (is_active_sidebar('footer-3')) {
                                dynamic_sidebar('footer-3');
                            } else {
                            ?>
                                <h3 class="footer-widget-title"><?php esc_html_e('Products', 'metanord'); ?></h3>
                                <ul class="footer-links">
                                    <li><a href="<?php echo esc_url(home_url('/products/aluminum-profiles')); ?>"><?php esc_html_e('Aluminum Profiles', 'metanord'); ?></a></li>
                                    <li><a href="<?php echo esc_url(home_url('/products/cast-iron')); ?>"><?php esc_html_e('Cast Iron Products', 'metanord'); ?></a></li>
                                    <li><a href="<?php echo esc_url(home_url('/products/pipes')); ?>"><?php esc_html_e('Polyethylene Pipes', 'metanord'); ?></a></li>
                                    <li><a href="<?php echo esc_url(home_url('/products/manhole-covers')); ?>"><?php esc_html_e('Manhole Covers', 'metanord'); ?></a></li>
                                    <li><a href="<?php echo esc_url(home_url('/products/steel-pipes')); ?>"><?php esc_html_e('Steel Pipes', 'metanord'); ?></a></li>
                                </ul>
                            <?php
                            }
                            ?>
                        </div>
                    </div>
                    
                    <!-- Footer Column 4: Contact Info -->
                    <div class="col col-md-3 col-sm-12">
                        <div class="footer-widget">
                            <?php
                            if (is_active_sidebar('footer-4')) {
                                dynamic_sidebar('footer-4');
                            } else {
                            ?>
                                <h3 class="footer-widget-title"><?php esc_html_e('Contact Information', 'metanord'); ?></h3>
                                <ul class="contact-info">
                                    <li class="contact-address">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span><?php echo esc_html(get_theme_mod('metanord_company_address', 'Tornimäe tn 5, 10145 Tallinn, Estonia')); ?></span>
                                    </li>
                                    <li class="contact-phone">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', get_theme_mod('metanord_company_phone', '+372 5771 3442'))); ?>">
                                            <?php echo esc_html(get_theme_mod('metanord_company_phone', '+372 5771 3442')); ?>
                                        </a>
                                    </li>
                                    <li class="contact-email">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </svg>
                                        <a href="mailto:<?php echo esc_attr(get_theme_mod('metanord_company_email', 'info@metanord.eu')); ?>">
                                            <?php echo esc_html(get_theme_mod('metanord_company_email', 'info@metanord.eu')); ?>
                                        </a>
                                    </li>
                                    <li class="contact-website">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                            <path d="M2 12h20"></path>
                                        </svg>
                                        <a href="<?php echo esc_url('https://' . get_theme_mod('metanord_company_website', 'www.metanord.eu')); ?>" target="_blank">
                                            <?php echo esc_html(get_theme_mod('metanord_company_website', 'www.metanord.eu')); ?>
                                        </a>
                                    </li>
                                </ul>
                                
                                <div class="footer-social-icons">
                                    <?php
                                    $social_platforms = array(
                                        'facebook'  => 'Facebook',
                                        'twitter'   => 'Twitter',
                                        'linkedin'  => 'LinkedIn',
                                        'instagram' => 'Instagram',
                                        'youtube'   => 'YouTube',
                                    );

                                    foreach ($social_platforms as $platform => $label) {
                                        $url = get_theme_mod('metanord_social_' . $platform);
                                        if ($url) :
                                            echo '<a href="' . esc_url($url) . '" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="' . esc_attr($label) . '">';
                                            
                                            // Using SVG icons for social media
                                            switch ($platform) {
                                                case 'facebook':
                                                    echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>';
                                                    break;
                                                case 'twitter':
                                                    echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>';
                                                    break;
                                                case 'linkedin':
                                                    echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
                                                    break;
                                                case 'instagram':
                                                    echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';
                                                    break;
                                                case 'youtube':
                                                    echo '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>';
                                                    break;
                                            }
                                            
                                            echo '</a>';
                                        endif;
                                    }
                                    ?>
                                </div>
                            <?php
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="site-info">
            <div class="container">
                <div class="copyright">
                    <?php
                    $copyright_text = get_theme_mod('metanord_copyright_text', '© ' . date('Y') . ' MetaNord OÜ. All rights reserved.');
                    echo wp_kses_post($copyright_text);
                    ?>
                </div>
                
                <?php if (has_nav_menu('footer-links')) : ?>
                    <div class="footer-links-menu">
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'footer-links',
                            'menu_id'        => 'footer-links-menu',
                            'depth'          => 1,
                            'container'      => false,
                        ));
                        ?>
                    </div>
                <?php elseif (!is_active_sidebar('footer-4')) : ?>
                    <div class="footer-links-menu">
                        <ul>
                            <li><a href="<?php echo esc_url(home_url('/privacy-policy')); ?>"><?php esc_html_e('Privacy Policy', 'metanord'); ?></a></li>
                            <li><a href="<?php echo esc_url(home_url('/terms-of-service')); ?>"><?php esc_html_e('Terms of Service', 'metanord'); ?></a></li>
                            <li><a href="<?php echo esc_url(home_url('/sitemap')); ?>"><?php esc_html_e('Sitemap', 'metanord'); ?></a></li>
                        </ul>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>