<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package MetaNord
 */

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function metanord_pingback_header() {
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'metanord_pingback_header');

/**
 * Add custom classes to the body based on various conditions
 */
function metanord_body_classes($classes) {
    // Adds a class of hfeed to non-singular pages.
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }

    // Adds a class of no-sidebar when there is no sidebar present.
    if (!is_active_sidebar('sidebar-1')) {
        $classes[] = 'no-sidebar';
    }

    // Add class if we're viewing the Customizer for easier styling
    if (is_customize_preview()) {
        $classes[] = 'customizer-preview';
    }

    // Add class on front page
    if (is_front_page() && !is_home()) {
        $classes[] = 'front-page';
    }

    // Add class if we're on a product page
    if (function_exists('is_product') && is_product()) {
        $classes[] = 'single-product-page';
    }

    // Add a class if we're in dark mode
    if (isset($_COOKIE['metanord_dark_mode']) && $_COOKIE['metanord_dark_mode'] === 'true') {
        $classes[] = 'dark-mode';
    }

    return $classes;
}
add_filter('body_class', 'metanord_body_classes');

/**
 * Add a rel="preload" for Google Fonts
 */
function metanord_preload_fonts() {
    echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">';
    echo '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" as="style">';
}
add_action('wp_head', 'metanord_preload_fonts', 1);

/**
 * Replaces the excerpt "Read More" text with a custom link
 */
function metanord_excerpt_more($more) {
    return '... <a class="read-more" href="' . esc_url(get_permalink()) . '">' . esc_html__('Read More', 'metanord') . '</a>';
}
add_filter('excerpt_more', 'metanord_excerpt_more');

/**
 * Filter archive title to make it cleaner
 */
function metanord_archive_title($title) {
    if (is_category()) {
        $title = single_cat_title('', false);
    } elseif (is_tag()) {
        $title = single_tag_title('', false);
    } elseif (is_author()) {
        $title = '<span class="vcard">' . get_the_author() . '</span>';
    } elseif (is_post_type_archive()) {
        $title = post_type_archive_title('', false);
    } elseif (is_tax()) {
        $title = single_term_title('', false);
    }
    return $title;
}
add_filter('get_the_archive_title', 'metanord_archive_title');

/**
 * Add custom image sizes for the theme
 */
function metanord_custom_image_sizes() {
    // Add featured image size
    add_image_size('metanord-featured', 1200, 750, true);
    
    // Add hero image size
    add_image_size('metanord-hero', 1920, 800, true);
    
    // Add product thumbnail size
    add_image_size('metanord-product-thumb', 640, 480, true);
}
add_action('after_setup_theme', 'metanord_custom_image_sizes');

/**
 * Implement the Custom Header feature.
 */
function metanord_custom_header_setup() {
    add_theme_support(
        'custom-header',
        apply_filters(
            'metanord_custom_header_args',
            array(
                'default-image'      => '',
                'default-text-color' => '000000',
                'width'              => 1920,
                'height'             => 250,
                'flex-height'        => true,
                'wp-head-callback'   => 'metanord_header_style',
            )
        )
    );
}
add_action('after_setup_theme', 'metanord_custom_header_setup');

/**
 * Styles the header image and text displayed on the blog.
 */
function metanord_header_style() {
    $header_text_color = get_header_textcolor();

    // If no custom options for text are set, let's bail
    // get_header_textcolor() options: Any hex value, 'blank' to hide text
    if (get_theme_support('custom-header', 'default-text-color') === $header_text_color) {
        return;
    }

    // If we get this far, we have custom styles
    ?>
    <style type="text/css">
    <?php
    // Has the text been hidden?
    if ('blank' === $header_text_color) :
        ?>
        .site-title,
        .site-description {
            position: absolute;
            clip: rect(1px, 1px, 1px, 1px);
        }
        <?php
    else :
        ?>
        .site-title a,
        .site-description {
            color: #<?php echo esc_attr($header_text_color); ?>;
        }
        <?php
    endif;
    ?>
    </style>
    <?php
}

/**
 * Handle AJAX form submissions
 */
function metanord_handle_contact_form() {
    // Verify nonce
    if (!isset($_POST['contact_nonce']) || !wp_verify_nonce($_POST['contact_nonce'], 'metanord_contact_nonce')) {
        wp_send_json_error(__('Security verification failed. Please try again.', 'metanord'));
    }

    // Get form data
    $name = sanitize_text_field($_POST['name'] ?? '');
    $email = sanitize_email($_POST['email'] ?? '');
    $company = sanitize_text_field($_POST['company'] ?? '');
    $subject = sanitize_text_field($_POST['subject'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');

    // Validate form data
    if (empty($name) || empty($email) || empty($message)) {
        wp_send_json_error(__('Please fill all required fields.', 'metanord'));
    }

    // Subject options for dropdown
    $subject_options = [
        'product_info' => __('Product Information', 'metanord'),
        'quote' => __('Request a Quote', 'metanord'),
        'support' => __('Technical Support', 'metanord'),
        'other' => __('Other', 'metanord'),
    ];

    // Format the subject
    $email_subject = isset($subject_options[$subject]) ? $subject_options[$subject] : __('Contact Form Submission', 'metanord');

    // Admin email
    $admin_email = get_option('admin_email');

    // Email content
    $email_content = sprintf(
        // Translators: %1$s is the name, %2$s is the email, %3$s is the company, %4$s is the subject, %5$s is the message
        __('
        <p><strong>Name:</strong> %1$s</p>
        <p><strong>Email:</strong> %2$s</p>
        <p><strong>Company:</strong> %3$s</p>
        <p><strong>Subject:</strong> %4$s</p>
        <p><strong>Message:</strong></p>
        <p>%5$s</p>
        ', 'metanord'),
        $name,
        $email,
        $company,
        $email_subject,
        wpautop($message)
    );

    // Email headers
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $name . ' <' . $email . '>',
        'Reply-To: ' . $email
    ];

    // Send email
    $email_sent = wp_mail($admin_email, $email_subject, $email_content, $headers);

    // Check if email was sent
    if ($email_sent) {
        wp_send_json_success(__('Thank you for your message. We will get back to you soon!', 'metanord'));
    } else {
        wp_send_json_error(__('Failed to send message. Please try again later.', 'metanord'));
    }
}
add_action('wp_ajax_metanord_contact_form', 'metanord_handle_contact_form');
add_action('wp_ajax_nopriv_metanord_contact_form', 'metanord_handle_contact_form');

/**
 * Handle newsletter subscription
 */
function metanord_newsletter_subscribe() {
    // Verify nonce
    if (!isset($_POST['newsletter_nonce']) || !wp_verify_nonce($_POST['newsletter_nonce'], 'metanord_newsletter_nonce')) {
        wp_send_json_error(__('Security verification failed. Please try again.', 'metanord'));
    }

    // Get email
    $email = sanitize_email($_POST['subscriber_email'] ?? '');

    // Validate email
    if (empty($email) || !is_email($email)) {
        wp_send_json_error(__('Please enter a valid email address.', 'metanord'));
    }

    // Here you would typically add the email to your newsletter service
    // For example, integration with Mailchimp, MailerLite, etc.
    
    // For the purpose of this template, we'll just send a notification to the admin
    $admin_email = get_option('admin_email');
    $subject = __('New Newsletter Subscription', 'metanord');
    $message = sprintf(
        __('A new user has subscribed to the newsletter: %s', 'metanord'),
        $email
    );
    
    $email_sent = wp_mail($admin_email, $subject, $message);

    // Check if email was sent
    if ($email_sent) {
        wp_send_json_success(__('Thank you for subscribing to our newsletter!', 'metanord'));
    } else {
        wp_send_json_error(__('Failed to subscribe. Please try again later.', 'metanord'));
    }
}
add_action('wp_ajax_metanord_newsletter_subscribe', 'metanord_newsletter_subscribe');
add_action('wp_ajax_nopriv_metanord_newsletter_subscribe', 'metanord_newsletter_subscribe');