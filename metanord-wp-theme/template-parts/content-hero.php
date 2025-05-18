<?php
/**
 * Template part for displaying the hero section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get theme mod values
$hero_title = get_theme_mod('metanord_hero_title', 'European Infrastructure');
$hero_title_highlight = get_theme_mod('metanord_hero_title_highlight', 'Solutions');
$hero_subtitle = get_theme_mod('metanord_hero_subtitle', 'Premium aluminum profiles and infrastructure products for European and international markets');
$hero_tagline = get_theme_mod('metanord_hero_tagline', 'Engineering a Stronger Tomorrow');

// Get hero background
$hero_bg_id = get_theme_mod('metanord_hero_background');
$hero_bg_url = $hero_bg_id ? wp_get_attachment_url($hero_bg_id) : get_template_directory_uri() . '/assets/images/hero-bg.jpg';

// Optional - check if ACF is active and use those fields instead if available
if (function_exists('get_field') && get_field('hero_title', get_the_ID())) {
    $hero_title = get_field('hero_title', get_the_ID());
    $hero_title_highlight = get_field('hero_title_highlight', get_the_ID());
    $hero_subtitle = get_field('hero_subtitle', get_the_ID());
    $hero_tagline = get_field('hero_tagline', get_the_ID());
    
    $hero_bg = get_field('hero_background', get_the_ID());
    if ($hero_bg) {
        $hero_bg_url = $hero_bg['url'];
    }
}
?>

<!-- Hero Section -->
<section id="hero" class="hero" style="background: linear-gradient(to right, rgba(0, 102, 179, 0.8), rgba(0, 59, 102, 0.8)), url('<?php echo esc_url($hero_bg_url); ?>');">
    <div class="container">
        <div class="hero-content fade-in-up">
            <h1>
                <?php echo esc_html($hero_title); ?> 
                <span class="hero-highlight"><?php echo esc_html($hero_title_highlight); ?></span>
            </h1>
            <p class="hero-subtitle"><?php echo esc_html($hero_subtitle); ?></p>
            <p class="hero-tagline"><?php echo esc_html($hero_tagline); ?></p>
            <div class="btn-group">
                <a href="#products" class="btn btn-primary"><?php esc_html_e('Explore Products', 'metanord'); ?></a>
                <a href="#contact" class="btn btn-secondary"><?php esc_html_e('Contact Us', 'metanord'); ?></a>
            </div>
        </div>
    </div>
</section>