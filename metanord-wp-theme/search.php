<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    // Search header
    $search_image = get_theme_mod('metanord_search_header_image');
    $search_title = sprintf(
        /* translators: %s: search query */
        esc_html__('Search Results for: %s', 'metanord'),
        '<span>' . get_search_query() . '</span>'
    );
    ?>

    <div class="page-header" style="background-image: linear-gradient(rgba(0, 59, 102, 0.8), rgba(0, 59, 102, 0.8)), url('<?php echo esc_url($search_image); ?>');">
        <div class="container">
            <h1 class="page-title"><?php echo wp_kses_post($search_title); ?></h1>
            
            <div class="search-form-container">
                <?php get_search_form(); ?>
            </div>
            
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
            <!-- Search Results -->
            <div class="col-lg-8 col-md-12">
                <?php if (have_posts()) : ?>
                    <div class="search-results-count mb-6">
                        <?php
                        printf(
                            /* translators: %s: Number of results */
                            esc_html(_n('%s result found', '%s results found', $wp_query->found_posts, 'metanord')),
                            number_format_i18n($wp_query->found_posts)
                        );
                        ?>
                    </div>

                    <div class="search-results">
                        <?php
                        /* Start the Loop */
                        while (have_posts()) :
                            the_post();

                            /**
                             * Run the loop for the search to output the results.
                             * If you want to overload this in a child theme then include a file
                             * called content-search.php and that will be used instead.
                             */
                            get_template_part('template-parts/content', 'search');

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