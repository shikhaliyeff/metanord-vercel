<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    // Display featured image as full-width header if available
    if (has_post_thumbnail()) :
        $featured_img_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
    ?>
        <div class="page-header" style="background-image: linear-gradient(rgba(0, 59, 102, 0.8), rgba(0, 59, 102, 0.8)), url('<?php echo esc_url($featured_img_url); ?>');">
            <div class="container">
                <h1 class="page-title"><?php the_title(); ?></h1>
                
                <?php
                // Display breadcrumbs if Yoast SEO is active
                if (function_exists('yoast_breadcrumb')) {
                    yoast_breadcrumb('<p id="breadcrumbs" class="breadcrumbs">', '</p>');
                }
                ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="container py-12">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
                <?php
                // If no featured image was displayed, show a simple title
                if (!has_post_thumbnail()) :
                ?>
                    <header class="page-header mb-8">
                        <h1 class="page-title"><?php the_title(); ?></h1>
                        
                        <?php
                        // Display breadcrumbs if Yoast SEO is active
                        if (function_exists('yoast_breadcrumb')) {
                            yoast_breadcrumb('<p id="breadcrumbs" class="breadcrumbs">', '</p>');
                        }
                        ?>
                    </header>
                <?php endif; ?>

                <?php
                while (have_posts()) :
                    the_post();

                    get_template_part('template-parts/content', 'page');

                    // If comments are open or we have at least one comment, load up the comment template.
                    if (comments_open() || get_comments_number()) :
                        comments_template();
                    endif;

                endwhile; // End of the loop.
                ?>
            </div>
        </div>
    </div>
</main><!-- #main -->

<?php
get_footer();