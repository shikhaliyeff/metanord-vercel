<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package MetaNord
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function metanord_body_classes($classes)
{
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

    // Add specific classes for front-page
    if (is_front_page() && !is_home()) {
        $classes[] = 'front-page';
    }

    // Add class for page templates
    if (is_page_template('page-templates/page-full-width.php')) {
        $classes[] = 'page-full-width';
    }

    return $classes;
}
add_filter('body_class', 'metanord_body_classes');

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function metanord_pingback_header()
{
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}
add_action('wp_head', 'metanord_pingback_header');

/**
 * Add customized excerpt length.
 */
function metanord_excerpt_length($length)
{
    return 25;
}
add_filter('excerpt_length', 'metanord_excerpt_length');

/**
 * Add customized excerpt more string.
 */
function metanord_excerpt_more($more)
{
    return '...';
}
add_filter('excerpt_more', 'metanord_excerpt_more');

/**
 * Process and save contact form submissions
 */
function metanord_process_contact_form()
{
    // Check nonce for security
    if (!isset($_POST['metanord_contact_nonce']) || !wp_verify_nonce($_POST['metanord_contact_nonce'], 'metanord_contact_nonce')) {
        wp_die(__('Security check failed. Please try again.', 'metanord'));
    }

    // Get form data
    $name = isset($_POST['metanord_name']) ? sanitize_text_field($_POST['metanord_name']) : '';
    $email = isset($_POST['metanord_email']) ? sanitize_email($_POST['metanord_email']) : '';
    $company = isset($_POST['metanord_company']) ? sanitize_text_field($_POST['metanord_company']) : '';
    $subject_option = isset($_POST['metanord_subject']) ? sanitize_text_field($_POST['metanord_subject']) : '';
    $message = isset($_POST['metanord_message']) ? sanitize_textarea_field($_POST['metanord_message']) : '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject_option) || empty($message)) {
        wp_die(__('Please fill in all required fields.', 'metanord'));
    }

    // Map subject option to readable text
    $subject_options = [
        'product_info' => __('Product Information', 'metanord'),
        'quote' => __('Request a Quote', 'metanord'),
        'support' => __('Technical Support', 'metanord'),
        'other' => __('Other Inquiry', 'metanord'),
    ];

    $subject = isset($subject_options[$subject_option]) ? $subject_options[$subject_option] : __('Website Inquiry', 'metanord');

    // Prepare email content
    $to = get_option('admin_email');
    $email_subject = sprintf('[%s] %s', get_bloginfo('name'), $subject);
    
    $email_body = sprintf(
        "Name: %s\n\nEmail: %s\n\nCompany: %s\n\nSubject: %s\n\nMessage:\n%s\n\n-- \nThis email was sent from the contact form on %s (%s)",
        $name,
        $email,
        $company,
        $subject,
        $message,
        get_bloginfo('name'),
        home_url()
    );

    $headers = [
        'From: ' . get_bloginfo('name') . ' <' . $to . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Content-Type: text/plain; charset=UTF-8',
    ];

    // Send email
    $mail_sent = wp_mail($to, $email_subject, $email_body, $headers);

    // Save submission to database (optional - requires custom table)
    // metanord_save_contact_submission($name, $email, $company, $subject, $message);

    // Redirect after submission
    if ($mail_sent) {
        $redirect_url = add_query_arg('contact', 'success', wp_get_referer());
    } else {
        $redirect_url = add_query_arg('contact', 'error', wp_get_referer());
    }

    wp_safe_redirect($redirect_url);
    exit;
}
add_action('admin_post_metanord_contact_form', 'metanord_process_contact_form');
add_action('admin_post_nopriv_metanord_contact_form', 'metanord_process_contact_form');