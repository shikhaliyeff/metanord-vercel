<?php
/**
 * MetaNord Theme Customizer
 *
 * @package MetaNord
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function metanord_customize_register($wp_customize)
{
    // Default selective refresh
    $wp_customize->get_setting('blogname')->transport         = 'postMessage';
    $wp_customize->get_setting('blogdescription')->transport  = 'postMessage';
    $wp_customize->get_setting('header_textcolor')->transport = 'postMessage';

    if (isset($wp_customize->selective_refresh)) {
        $wp_customize->selective_refresh->add_partial(
            'blogname',
            array(
                'selector'        => '.site-title a',
                'render_callback' => 'metanord_customize_partial_blogname',
            )
        );
        $wp_customize->selective_refresh->add_partial(
            'blogdescription',
            array(
                'selector'        => '.site-description',
                'render_callback' => 'metanord_customize_partial_blogdescription',
            )
        );
    }

    // Hero Section Settings
    $wp_customize->add_section('metanord_hero_section', array(
        'title'    => __('Hero Section', 'metanord'),
        'priority' => 120,
    ));

    $wp_customize->add_setting('metanord_hero_title', array(
        'default'           => 'European Infrastructure',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('metanord_hero_title', array(
        'label'   => __('Title', 'metanord'),
        'section' => 'metanord_hero_section',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_hero_title_highlight', array(
        'default'           => 'Solutions',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('metanord_hero_title_highlight', array(
        'label'   => __('Title Highlight', 'metanord'),
        'section' => 'metanord_hero_section',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_hero_subtitle', array(
        'default'           => 'Premium aluminum profiles and infrastructure products for European and international markets',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('metanord_hero_subtitle', array(
        'label'   => __('Subtitle', 'metanord'),
        'section' => 'metanord_hero_section',
        'type'    => 'textarea',
    ));

    $wp_customize->add_setting('metanord_hero_tagline', array(
        'default'           => 'Engineering a Stronger Tomorrow',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('metanord_hero_tagline', array(
        'label'   => __('Tagline', 'metanord'),
        'section' => 'metanord_hero_section',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_hero_background', array(
        'default'           => '',
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'metanord_hero_background', array(
        'label'     => __('Background Image', 'metanord'),
        'section'   => 'metanord_hero_section',
        'mime_type' => 'image',
    )));

    // Contact Information
    $wp_customize->add_section('metanord_contact_info', array(
        'title'    => __('Contact Information', 'metanord'),
        'priority' => 130,
    ));

    $wp_customize->add_setting('metanord_company_address', array(
        'default'           => 'Tornimäe tn 5, 10145 Tallinn, Estonia',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('metanord_company_address', array(
        'label'   => __('Company Address', 'metanord'),
        'section' => 'metanord_contact_info',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_company_phone', array(
        'default'           => '+372 5771 3442',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('metanord_company_phone', array(
        'label'   => __('Phone Number', 'metanord'),
        'section' => 'metanord_contact_info',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_company_email', array(
        'default'           => 'info@metanord.eu',
        'sanitize_callback' => 'sanitize_email',
    ));

    $wp_customize->add_control('metanord_company_email', array(
        'label'   => __('Email Address', 'metanord'),
        'section' => 'metanord_contact_info',
        'type'    => 'email',
    ));

    $wp_customize->add_setting('metanord_company_website', array(
        'default'           => 'www.metanord.eu',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('metanord_company_website', array(
        'label'   => __('Website URL', 'metanord'),
        'section' => 'metanord_contact_info',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('metanord_registry_code', array(
        'default'           => '17235227',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('metanord_registry_code', array(
        'label'   => __('Registry Code', 'metanord'),
        'section' => 'metanord_contact_info',
        'type'    => 'text',
    ));

    // Social Media Settings
    $wp_customize->add_section('metanord_social_media', array(
        'title'    => __('Social Media', 'metanord'),
        'priority' => 140,
    ));

    $social_platforms = array(
        'facebook'  => __('Facebook URL', 'metanord'),
        'twitter'   => __('Twitter URL', 'metanord'),
        'linkedin'  => __('LinkedIn URL', 'metanord'),
        'instagram' => __('Instagram URL', 'metanord'),
        'youtube'   => __('YouTube URL', 'metanord'),
    );

    foreach ($social_platforms as $platform => $label) {
        $wp_customize->add_setting('metanord_social_' . $platform, array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control('metanord_social_' . $platform, array(
            'label'   => $label,
            'section' => 'metanord_social_media',
            'type'    => 'url',
        ));
    }

    // Footer Settings
    $wp_customize->add_section('metanord_footer', array(
        'title'    => __('Footer Settings', 'metanord'),
        'priority' => 150,
    ));

    $wp_customize->add_setting('metanord_copyright_text', array(
        'default'           => '© ' . date('Y') . ' MetaNord OÜ. All rights reserved.',
        'sanitize_callback' => 'wp_kses_post',
    ));

    $wp_customize->add_control('metanord_copyright_text', array(
        'label'   => __('Copyright Text', 'metanord'),
        'section' => 'metanord_footer',
        'type'    => 'textarea',
    ));

    // Blog/Archive Page Settings
    $wp_customize->add_section('metanord_blog_settings', array(
        'title'    => __('Blog Settings', 'metanord'),
        'priority' => 160,
    ));

    $wp_customize->add_setting('metanord_blog_header_image', array(
        'default'           => '',
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'metanord_blog_header_image', array(
        'label'     => __('Blog Header Image', 'metanord'),
        'description' => __('Used for blog, archive, and search pages if featured images are not set', 'metanord'),
        'section'   => 'metanord_blog_settings',
        'mime_type' => 'image',
    )));

    // Additional Settings - FAQ Toggle
    $wp_customize->add_section('metanord_additional_settings', array(
        'title'    => __('Additional Settings', 'metanord'),
        'priority' => 170,
    ));

    $wp_customize->add_setting('metanord_show_faq', array(
        'default'           => true,
        'sanitize_callback' => 'metanord_sanitize_checkbox',
    ));

    $wp_customize->add_control('metanord_show_faq', array(
        'label'       => __('Show FAQ Section on Homepage', 'metanord'),
        'section'     => 'metanord_additional_settings',
        'type'        => 'checkbox',
    ));
}
add_action('customize_register', 'metanord_customize_register');

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function metanord_customize_partial_blogname()
{
    bloginfo('name');
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function metanord_customize_partial_blogdescription()
{
    bloginfo('description');
}

/**
 * Sanitize checkbox values.
 *
 * @param bool $checked Whether the checkbox is checked.
 * @return bool
 */
function metanord_sanitize_checkbox($checked)
{
    return ((isset($checked) && true == $checked) ? true : false);
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function metanord_customize_preview_js()
{
    wp_enqueue_script('metanord-customizer', get_template_directory_uri() . '/assets/js/customizer.js', array('customize-preview'), '1.0.0', true);
}
add_action('customize_preview_init', 'metanord_customize_preview_js');