<?php
/**
 * Template Name: Contact Page
 *
 * A template for displaying the contact page with map and contact form.
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

        <div class="contact-section">
            <div class="contact-container">
                <div class="contact-info">
                    <h3><?php esc_html_e('Contact Information', 'metanord'); ?></h3>
                    
                    <ul class="contact-details">
                        <?php if (metanord_get_option('company_name')) : ?>
                            <li>
                                <span class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                </span>
                                <span class="contact-text">
                                    <strong><?php esc_html_e('Company:', 'metanord'); ?></strong><br>
                                    <?php echo esc_html(metanord_get_option('company_name')); ?>
                                    <?php if (metanord_get_option('registry_code')) : ?>
                                        <br><?php esc_html_e('Registry Code:', 'metanord'); ?> <?php echo esc_html(metanord_get_option('registry_code')); ?>
                                    <?php endif; ?>
                                </span>
                            </li>
                        <?php endif; ?>
                        
                        <?php if (metanord_get_option('company_address')) : ?>
                            <li>
                                <span class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </span>
                                <span class="contact-text">
                                    <strong><?php esc_html_e('Address:', 'metanord'); ?></strong><br>
                                    <?php echo nl2br(esc_html(metanord_get_option('company_address'))); ?>
                                </span>
                            </li>
                        <?php endif; ?>
                        
                        <?php if (metanord_get_option('company_phone')) : ?>
                            <li>
                                <span class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </span>
                                <span class="contact-text">
                                    <strong><?php esc_html_e('Phone:', 'metanord'); ?></strong><br>
                                    <a href="tel:<?php echo esc_attr(metanord_get_option('company_phone')); ?>"><?php echo esc_html(metanord_get_option('company_phone')); ?></a>
                                </span>
                            </li>
                        <?php endif; ?>
                        
                        <?php if (metanord_get_option('company_email')) : ?>
                            <li>
                                <span class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </span>
                                <span class="contact-text">
                                    <strong><?php esc_html_e('Email:', 'metanord'); ?></strong><br>
                                    <a href="mailto:<?php echo esc_attr(metanord_get_option('company_email')); ?>"><?php echo esc_html(metanord_get_option('company_email')); ?></a>
                                </span>
                            </li>
                        <?php endif; ?>
                        
                        <?php if (metanord_get_option('company_website')) : ?>
                            <li>
                                <span class="contact-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                </span>
                                <span class="contact-text">
                                    <strong><?php esc_html_e('Website:', 'metanord'); ?></strong><br>
                                    <a href="<?php echo esc_url(metanord_get_option('company_website')); ?>" target="_blank" rel="noopener"><?php echo esc_html(metanord_get_option('company_website')); ?></a>
                                </span>
                            </li>
                        <?php endif; ?>
                    </ul>
                    
                    <div class="social-links mt-4">
                        <?php
                        $social_platforms = array(
                            'facebook_url' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
                            'twitter_url' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>',
                            'linkedin_url' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
                            'instagram_url' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
                            'youtube_url' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
                        );
                        
                        foreach ($social_platforms as $platform => $icon) {
                            $url = metanord_get_option($platform);
                            if (!empty($url)) {
                                echo '<a href="' . esc_url($url) . '" class="social-icon" target="_blank" rel="noopener">' . $icon . '</a>';
                            }
                        }
                        ?>
                    </div>
                </div>
                
                <div class="contact-form">
                    <h3><?php esc_html_e('Send Us a Message', 'metanord'); ?></h3>
                    
                    <?php
                    // Check if Contact Form 7 is active and a shortcode is set
                    $contact_form_shortcode = get_field('contact_form_shortcode');
                    
                    if (!empty($contact_form_shortcode) && function_exists('wpcf7_contact_form_tag_func')) {
                        echo do_shortcode($contact_form_shortcode);
                    } else {
                        // Fallback if no Contact Form 7 or no shortcode set
                        ?>
                        <div class="default-contact-form">
                            <form action="#" method="post" class="contact-form">
                                <div class="form-group">
                                    <label for="name"><?php esc_html_e('Your Name', 'metanord'); ?> *</label>
                                    <input type="text" name="name" id="name" class="form-control" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email"><?php esc_html_e('Your Email', 'metanord'); ?> *</label>
                                    <input type="email" name="email" id="email" class="form-control" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject"><?php esc_html_e('Subject', 'metanord'); ?></label>
                                    <input type="text" name="subject" id="subject" class="form-control">
                                </div>
                                
                                <div class="form-group">
                                    <label for="message"><?php esc_html_e('Your Message', 'metanord'); ?> *</label>
                                    <textarea name="message" id="message" class="form-control" rows="5" required></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <button type="submit" class="button button-primary"><?php esc_html_e('Send Message', 'metanord'); ?></button>
                                </div>
                                
                                <p class="form-note">
                                    <?php esc_html_e('* Required fields', 'metanord'); ?>
                                </p>
                            </form>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
        </div>
        
        <?php
        // Display Google Maps if available
        $google_maps_embed = get_field('google_maps_embed');
        if (!empty($google_maps_embed)) : ?>
            <div class="map-container">
                <?php echo $google_maps_embed; ?>
            </div>
        <?php endif; ?>
    </div>

</main><!-- #main -->

<?php
get_footer();