<?php
/**
 * Template part for displaying the Hero section on the homepage
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get custom field values using ACF or native WordPress functions
$hero_title = get_field('hero_title') ?: __('European Infrastructure', 'metanord');
$hero_title_highlight = get_field('hero_title_highlight') ?: __('Solutions', 'metanord');
$hero_subtitle = get_field('hero_subtitle') ?: __('Premium aluminum profiles and infrastructure products for European and international markets', 'metanord');
$hero_tagline = get_field('hero_tagline') ?: __('Engineering a Stronger Tomorrow', 'metanord');
$hero_cta_text = get_field('hero_cta_text') ?: __('Explore Products', 'metanord');
$hero_cta_link = get_field('hero_cta_link') ?: '#products';
$hero_secondary_cta_text = get_field('hero_secondary_cta_text') ?: __('Contact Us', 'metanord');
$hero_secondary_cta_link = get_field('hero_secondary_cta_link') ?: home_url('/contact');

// Hero background image
$hero_bg_image = get_field('hero_background_image');
$hero_bg_image_url = $hero_bg_image ? wp_get_attachment_image_url($hero_bg_image, 'full') : get_template_directory_uri() . '/assets/images/hero-bg.webp';
?>

<section id="hero" class="relative min-h-screen flex items-center overflow-hidden" style="background-image: url('<?php echo esc_url($hero_bg_image_url); ?>'); background-size: cover; background-position: center;">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/80"></div>
    
    <div class="container mx-auto px-4 relative z-10 py-24">
        <div class="max-w-3xl text-white" data-animation="fade-in-up">
            <h1 class="text-5xl md:text-6xl font-inter font-bold mb-6">
                <?php echo esc_html($hero_title); ?> 
                <span class="text-accent"><?php echo esc_html($hero_title_highlight); ?></span>
            </h1>
            
            <p class="text-xl md:text-2xl font-roboto mb-6">
                <?php echo esc_html($hero_subtitle); ?>
            </p>
            
            <p class="text-lg font-roboto italic text-neutral-lightest mb-10">
                <?php echo esc_html($hero_tagline); ?>
            </p>
            
            <div class="flex flex-wrap gap-4">
                <a href="<?php echo esc_url($hero_cta_link); ?>" class="btn-primary">
                    <?php echo esc_html($hero_cta_text); ?>
                </a>
                
                <a href="<?php echo esc_url($hero_secondary_cta_link); ?>" class="btn-secondary">
                    <?php echo esc_html($hero_secondary_cta_text); ?>
                </a>
            </div>
        </div>
    </div>
    
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white">
        <a href="#features" class="scroll-down-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-bounce">
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
            </svg>
        </a>
    </div>
</section>