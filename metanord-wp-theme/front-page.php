<?php
/**
 * The template for displaying the front page
 *
 * This is the template that displays the homepage when a static page is set
 * as the front page in Settings → Reading.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php 
    // Hero section
    get_template_part('template-parts/content', 'hero');
    
    // About section
    get_template_part('template-parts/content', 'about');
    
    // Products section
    get_template_part('template-parts/content', 'products');
    
    // Services section
    get_template_part('template-parts/content', 'services');
    
    // CTA section
    get_template_part('template-parts/content', 'cta');
    
    // FAQ section - Optional based on theme settings
    if (get_theme_mod('metanord_show_faq', true)) {
        get_template_part('template-parts/content', 'faq');
    }
    
    // Contact section
    get_template_part('template-parts/content', 'contact');
    
    // The regular content from the WordPress editor, if any
    while (have_posts()) :
        the_post();
        
        if (get_the_content()) {
            ?>
            <section class="additional-content">
                <div class="container">
                    <div class="content-wrapper">
                        <?php the_content(); ?>
                    </div>
                </div>
            </section>
            <?php
        }
    endwhile;
    ?>
</main><!-- #main -->

<?php
get_footer();