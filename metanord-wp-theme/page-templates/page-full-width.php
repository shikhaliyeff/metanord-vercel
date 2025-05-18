<?php
/**
 * Template Name: Full Width Page
 *
 * A template for displaying a page with no sidebar.
 *
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main full-width">

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
        // Check for Breadcrumbs
        if (function_exists('metanord_breadcrumbs')) {
            metanord_breadcrumbs();
        }
        ?>

        <div class="page-content full-width-content">
            <?php
            while (have_posts()) :
                the_post();
                
                the_content();
                
                // If comments are open or we have at least one comment, load up the comment template.
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
            endwhile; // End of the loop.
            ?>
        </div>
    </div>

</main><!-- #main -->

<?php
get_footer();