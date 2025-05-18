<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="page-header bg-primary text-white py-16">
        <div class="container">
            <h1 class="page-title text-center text-4xl font-bold"><?php esc_html_e('404', 'metanord'); ?></h1>
            <p class="text-center text-xl mt-4"><?php esc_html_e('Page Not Found', 'metanord'); ?></p>
        </div>
    </div>

    <div class="container py-16 text-center">
        <div class="error-404 not-found max-w-3xl mx-auto">
            <div class="page-content">
                <p class="mb-6 text-lg"><?php esc_html_e('It looks like nothing was found at this location. Maybe try a search?', 'metanord'); ?></p>
                <?php get_search_form(); ?>
                
                <div class="mt-12">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">
                        <?php esc_html_e('Return to Homepage', 'metanord'); ?>
                    </a>
                </div>
                
                <div class="widget mt-12">
                    <h2 class="widget-title text-2xl font-bold mb-6"><?php esc_html_e('Recent Posts', 'metanord'); ?></h2>
                    <ul class="recent-posts">
                        <?php
                        $recent_posts = wp_get_recent_posts(array(
                            'numberposts' => 5,
                            'post_status' => 'publish'
                        ));
                        
                        foreach ($recent_posts as $post) {
                            echo '<li><a href="' . esc_url(get_permalink($post['ID'])) . '">' . esc_html($post['post_title']) . '</a></li>';
                        }
                        wp_reset_postdata();
                        ?>
                    </ul>
                </div>
            </div><!-- .page-content -->
        </div><!-- .error-404 -->
    </div>
</main><!-- #main -->

<?php
get_footer();