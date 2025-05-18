<?php
/**
 * Template part for displaying the CTA section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get CTA section content
$cta_title = 'Ready to Start Your Project?';
$cta_subtitle = 'Contact us today to discuss your needs or request our product catalog';
$cta_btn_text = 'Contact Us';
$cta_btn_link = '#contact';
$cta_btn2_text = 'Download Catalog';
$cta_btn2_link = '#';

// Optional - check if ACF is active and use those fields
if (function_exists('get_field')) {
    $cta_title = get_field('cta_title') ?: $cta_title;
    $cta_subtitle = get_field('cta_subtitle') ?: $cta_subtitle;
    $cta_btn_text = get_field('cta_btn_text') ?: $cta_btn_text;
    $cta_btn_link = get_field('cta_btn_link') ?: $cta_btn_link;
    $cta_btn2_text = get_field('cta_btn2_text') ?: $cta_btn2_text;
    $cta_btn2_link = get_field('cta_btn2_link') ?: $cta_btn2_link;
    
    // If the link is a page ID, convert to URL
    if (is_numeric($cta_btn_link)) {
        $cta_btn_link = get_permalink($cta_btn_link);
    }
    
    if (is_numeric($cta_btn2_link)) {
        $cta_btn2_link = get_permalink($cta_btn2_link);
    }
}

// Get contact page URL
$contact_page = get_page_by_path('contact');
$contact_url = $contact_page ? get_permalink($contact_page) : '#contact';

// If CTA button link is still a placeholder, use the contact page URL
if ($cta_btn_link == '#contact') {
    $cta_btn_link = $contact_url;
}

// Get catalog file if available
$catalog_file = '';
if (function_exists('get_field')) {
    $catalog_file = get_field('catalog_file', 'option');
    if ($catalog_file) {
        $cta_btn2_link = $catalog_file['url'];
    }
}
?>

<!-- CTA Section -->
<section class="cta">
    <div class="container">
        <div class="fade-in">
            <h2><?php echo esc_html($cta_title); ?></h2>
            <p><?php echo esc_html($cta_subtitle); ?></p>
            <div class="cta-buttons">
                <a href="<?php echo esc_url($cta_btn_link); ?>" class="btn btn-secondary">
                    <?php echo esc_html($cta_btn_text); ?>
                </a>
                
                <?php if (!empty($cta_btn2_link) && $cta_btn2_link != '#') : ?>
                    <a href="<?php echo esc_url($cta_btn2_link); ?>" class="btn btn-accent" <?php echo strpos($cta_btn2_link, 'http') === 0 ? 'target="_blank"' : ''; ?>>
                        <?php echo esc_html($cta_btn2_text); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>