<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    // Archive page header
    $archive_image = get_theme_mod('metanord_archive_header_image');
    $archive_title = get_the_archive_title();
    $archive_description = get_the_archive_description();
    ?>

    <div class="page-header" style="background-image: linear-gradient(rgba(0, 59, 102, 0.8), rgba(0, 59, 102, 0.8)), url('<?php echo esc_url($archive_image); ?>');">
        <div class="container">
            <h1 class="page-title"><?php echo wp_kses_post($archive_title); ?></h1>
            
            <?php if ($archive_description) : ?>
                <div class="archive-description">
                    <?php echo wp_kses_post($archive_description); ?>
                </div>
            <?php endif; ?>
            
            <?php
            // Display breadcrumbs if Yoast SEO is active
            if (function_exists('yoast_breadcrumb')) {
                yoast_breadcrumb('<p id="breadcrumbs" class="breadcrumbs">', '</p>');
            }
            ?>
        </div>
    </div>

    <div class="container py-12">
        <div class="row">
            <!-- Archive Posts -->
            <div class="col-lg-8 col-md-12">
                <?php if (have_posts()) : ?>
                    <div class="archive-posts">
                        <?php
                        /* Start the Loop */
                        while (have_posts()) :
                            the_post();

                            /*
                            * Include the Post-Type-specific template for the content.
                            * If you want to override this in a child theme, then include a file
                            * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                            */
                            get_template_part('template-parts/content', get_post_type());

                        endwhile;
                        ?>
                    </div>

                    <?php
                    // Pagination
                    ?>
                    <div class="pagination-container">
                        <?php
                        the_posts_pagination(array(
                            'mid_size' => 2,
                            'prev_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> ' . esc_html__('Previous', 'metanord'),
                            'next_text' => esc_html__('Next', 'metanord') . ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
                        ));
                        ?>
                    </div>

                <?php
                else :
                    get_template_part('template-parts/content', 'none');
                endif;
                ?>
            </div>
            
            <!-- Sidebar -->
            <div class="col-lg-4 col-md-12">
                <?php get_sidebar(); ?>
            </div>
        </div>
    </div>
</main><!-- #main -->

<?php
get_footer();