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
    <?php if (have_posts()) : ?>
        <header class="page-header bg-primary text-white py-16">
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto text-center" data-animation="fade-in-up">
                    <?php
                    the_archive_title('<h1 class="page-title text-4xl md:text-5xl font-inter font-bold mb-4">', '</h1>');
                    the_archive_description('<div class="archive-description text-lg md:text-xl font-roboto">', '</div>');
                    ?>
                </div>
            </div>
        </header><!-- .page-header -->

        <div class="container mx-auto px-4 py-16">
            <?php metanord_get_breadcrumbs(); ?>
            
            <?php
            // Check if we're on a product archive
            $is_product_archive = false;
            if (function_exists('is_product_category') && (is_product_category() || is_product_tag() || is_shop())) {
                $is_product_archive = true;
            } elseif (is_post_type_archive('metanord_product') || is_tax('product_category')) {
                $is_product_archive = true;
            }
            
            if ($is_product_archive) {
                // Product grid layout
                echo '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">';
                $index = 0;
                
                /* Start the Loop */
                while (have_posts()) :
                    the_post();
                    $delay = ($index % 3) * 0.1;
                    $index++;
                    
                    // Different display for WooCommerce vs custom products
                    if (function_exists('is_product') && is_product()) {
                        global $product;
                        metanord_display_product_card($product, array('animation_delay' => $delay));
                    } else {
                        metanord_display_product_card(get_the_ID(), array('animation_delay' => $delay));
                    }
                endwhile;
                
                echo '</div>';
            } else {
                // Blog post layout
                echo '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">';
                $index = 0;
                
                /* Start the Loop */
                while (have_posts()) :
                    the_post();
                    $delay = ($index % 3) * 0.1;
                    $index++;
                    ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-lg shadow-md overflow-hidden'); ?> data-animation="fade-in" data-animation-delay="<?php echo esc_attr($delay); ?>">
                        <?php metanord_post_thumbnail(); ?>
                        
                        <div class="p-6">
                            <header class="entry-header mb-4">
                                <?php
                                the_title('<h2 class="entry-title text-xl font-bold mb-2"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
                                
                                if ('post' === get_post_type()) :
                                    ?>
                                    <div class="entry-meta text-sm text-neutral-dark mb-2">
                                        <?php
                                        metanord_posted_on();
                                        metanord_posted_by();
                                        ?>
                                    </div><!-- .entry-meta -->
                                <?php endif; ?>
                            </header><!-- .entry-header -->

                            <div class="entry-content">
                                <?php the_excerpt(); ?>
                            </div><!-- .entry-content -->

                            <footer class="entry-footer mt-4">
                                <a href="<?php echo esc_url(get_permalink()); ?>" class="inline-flex items-center text-primary font-semibold">
                                    <?php esc_html_e('Read More', 'metanord'); ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </a>
                            </footer><!-- .entry-footer -->
                        </div>
                    </article><!-- #post-<?php the_ID(); ?> -->
                    <?php
                endwhile;
                
                echo '</div>';
            }
            ?>

            <div class="pagination-container mt-12 flex justify-center">
                <?php
                $pagination = get_the_posts_pagination(
                    array(
                        'mid_size'  => 2,
                        'prev_text' => sprintf(
                            '%s <span class="nav-prev-text">%s</span>',
                            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
                            __('Previous', 'metanord')
                        ),
                        'next_text' => sprintf(
                            '<span class="nav-next-text">%s</span> %s',
                            __('Next', 'metanord'),
                            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
                        ),
                    )
                );
                
                // Create pagination with custom classes
                echo str_replace(
                    'class="page-numbers',
                    'class="page-numbers px-4 py-2 mx-1 rounded-md',
                    $pagination
                );
                ?>
            </div>

        </div>

    <?php else : ?>

        <div class="container mx-auto px-4 py-16">
            <div class="max-w-2xl mx-auto text-center">
                <h1 class="text-3xl font-bold mb-4"><?php esc_html_e('Nothing Found', 'metanord'); ?></h1>
                
                <?php
                if (is_search()) :
                    ?>
                    <p><?php esc_html_e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'metanord'); ?></p>
                    <?php
                    get_search_form();
                else :
                    ?>
                    <p><?php esc_html_e('It seems we can\'t find what you\'re looking for. Perhaps searching can help.', 'metanord'); ?></p>
                    <?php
                    get_search_form();
                endif;
                ?>
            </div>
        </div>

    <?php endif; ?>
</main><!-- #main -->

<?php
get_footer();