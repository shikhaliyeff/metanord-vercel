<?php
/**
 * Template part for displaying the contact section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get contact section content
$contact_title = 'Get in';
$contact_title_highlight = 'Touch';
$contact_subtitle = 'We\'re here to answer your questions and provide the solutions you need';

// Optional - check if ACF is active and use those fields
if (function_exists('get_field')) {
    $contact_title = get_field('contact_title') ?: $contact_title;
    $contact_title_highlight = get_field('contact_title_highlight') ?: $contact_title_highlight;
    $contact_subtitle = get_field('contact_subtitle') ?: $contact_subtitle;
}

// Company info
$company_name = 'MetaNord OÜ';
$registry_code = get_theme_mod('metanord_registry_code', '17235227');
$company_address = get_theme_mod('metanord_company_address', 'Tornimäe tn 5, 10145 Tallinn, Estonia');
$company_phone = get_theme_mod('metanord_company_phone', '+372 5771 3442');
$company_email = get_theme_mod('metanord_company_email', 'info@metanord.eu');
$company_website = get_theme_mod('metanord_company_website', 'www.metanord.eu');

// Override with ACF fields if available
if (function_exists('get_field')) {
    $company_info = get_field('company_info', 'option');
    if ($company_info) {
        $company_name = $company_info['name'] ?: $company_name;
        $registry_code = $company_info['registry_code'] ?: $registry_code;
        $company_address = $company_info['address'] ?: $company_address;
        $company_phone = $company_info['phone'] ?: $company_phone;
        $company_email = $company_info['email'] ?: $company_email;
        $company_website = $company_info['website'] ?: $company_website;
    }
}

// Contact Form 7 shortcode
$cf7_shortcode = '';
if (function_exists('get_field')) {
    $cf7_shortcode = get_field('contact_form_shortcode');
}
?>

<!-- Contact Section -->
<section id="contact" class="contact">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php echo esc_html($contact_title); ?> <span class="text-primary"><?php echo esc_html($contact_title_highlight); ?></span></h2>
            <p><?php echo esc_html($contact_subtitle); ?></p>
        </div>
        
        <div class="row">
            <!-- Contact Form -->
            <div class="col col-md-6 col-sm-12">
                <div class="contact-form-container fade-in-up">
                    <h3 class="mb-4"><?php esc_html_e('Send Us a Message', 'metanord'); ?></h3>
                    
                    <?php
                    // If Contact Form 7 is active and shortcode is provided
                    if (function_exists('wpcf7_contact_form_tag_func') && !empty($cf7_shortcode)) {
                        echo do_shortcode($cf7_shortcode);
                    } else {
                        // Default form that submits to admin-post.php
                    ?>
                        <form class="contact-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                            <input type="hidden" name="action" value="metanord_contact_form">
                            <?php wp_nonce_field('metanord_contact_nonce', 'metanord_contact_nonce'); ?>
                            
                            <div class="form-group">
                                <label for="name" class="form-label"><?php esc_html_e('Your Name', 'metanord'); ?></label>
                                <input type="text" id="name" name="metanord_name" class="form-control" placeholder="<?php esc_attr_e('Enter your name', 'metanord'); ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="email" class="form-label"><?php esc_html_e('Email Address', 'metanord'); ?></label>
                                <input type="email" id="email" name="metanord_email" class="form-control" placeholder="<?php esc_attr_e('Enter your email address', 'metanord'); ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="company" class="form-label"><?php esc_html_e('Company', 'metanord'); ?></label>
                                <input type="text" id="company" name="metanord_company" class="form-control" placeholder="<?php esc_attr_e('Enter your company name (optional)', 'metanord'); ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="subject" class="form-label"><?php esc_html_e('Subject', 'metanord'); ?></label>
                                <select id="subject" name="metanord_subject" class="form-control" required>
                                    <option value=""><?php esc_html_e('Select an option', 'metanord'); ?></option>
                                    <option value="product_info"><?php esc_html_e('Product Information', 'metanord'); ?></option>
                                    <option value="quote"><?php esc_html_e('Request a Quote', 'metanord'); ?></option>
                                    <option value="support"><?php esc_html_e('Technical Support', 'metanord'); ?></option>
                                    <option value="other"><?php esc_html_e('Other', 'metanord'); ?></option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="message" class="form-label"><?php esc_html_e('Your Message', 'metanord'); ?></label>
                                <textarea id="message" name="metanord_message" class="form-control" rows="6" placeholder="<?php esc_attr_e('Write your message here...', 'metanord'); ?>" required></textarea>
                            </div>
                            
                            <button type="submit" class="btn btn-primary"><?php esc_html_e('Submit', 'metanord'); ?></button>
                        </form>
                    <?php
                    }
                    ?>
                </div>
            </div>
            
            <!-- Contact Information -->
            <div class="col col-md-6 col-sm-12">
                <div class="contact-info fade-in-up">
                    <h3 class="mb-4"><?php esc_html_e('Contact Information', 'metanord'); ?></h3>
                    <p class="mb-4"><?php esc_html_e('Reach out to us through any of these channels:', 'metanord'); ?></p>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Company', 'metanord'); ?></h4>
                            <p><?php echo esc_html($company_name); ?></p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Registry Code', 'metanord'); ?></h4>
                            <p><?php echo esc_html($registry_code); ?></p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Address', 'metanord'); ?></h4>
                            <p><?php echo esc_html($company_address); ?></p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Phone', 'metanord'); ?></h4>
                            <p><a href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', $company_phone)); ?>"><?php echo esc_html($company_phone); ?></a></p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Email', 'metanord'); ?></h4>
                            <p><a href="mailto:<?php echo esc_attr($company_email); ?>"><?php echo esc_html($company_email); ?></a></p>
                        </div>
                    </div>
                    
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h4><?php esc_html_e('Website', 'metanord'); ?></h4>
                            <p><a href="<?php echo esc_url('https://' . $company_website); ?>" target="_blank"><?php echo esc_html($company_website); ?></a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>