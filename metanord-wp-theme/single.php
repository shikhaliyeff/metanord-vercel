<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php while (have_posts()) : the_post(); ?>
        
        <?php if (has_post_thumbnail()) : ?>
            <div class="featured-image-container">
                <?php the_post_thumbnail('full', ['class' => 'single-post-thumbnail']); ?>
                <div class="featured-image-overlay">
                    <div class="container">
                        <h1 class="entry-title"><?php the_title(); ?></h1>
                        <div class="post-meta">
                            <?php
                            metanord_posted_on();
                            metanord_posted_by();
                            ?>
                        </div>
                        
                        <?php
                        // Display breadcrumbs if Yoast SEO is active
                        if (function_exists('yoast_breadcrumb')) {
                            yoast_breadcrumb('<p id="breadcrumbs" class="breadcrumbs">', '</p>');
                        }
                        ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        
        <div class="container py-12">
            <div class="row">
                <div class="col-lg-8 col-md-12">
                
                    <?php if (!has_post_thumbnail()) : ?>
                        <header class="entry-header mb-8">
                            <h1 class="entry-title"><?php the_title(); ?></h1>
                            <div class="post-meta">
                                <?php
                                metanord_posted_on();
                                metanord_posted_by();
                                ?>
                            </div>
                            
                            <?php
                            // Display breadcrumbs if Yoast SEO is active
                            if (function_exists('yoast_breadcrumb')) {
                                yoast_breadcrumb('<p id="breadcrumbs" class="breadcrumbs">', '</p>');
                            }
                            ?>
                        </header>
                    <?php endif; ?>
                
                    <?php
                    get_template_part('template-parts/content', get_post_type());

                    // Previous/next post navigation
                    the_post_navigation(
                        array(
                            'prev_text' => '<span class="nav-subtitle">' . esc_html__('Previous:', 'metanord') . '</span> <span class="nav-title">%title</span>',
                            'next_text' => '<span class="nav-subtitle">' . esc_html__('Next:', 'metanord') . '</span> <span class="nav-title">%title</span>',
                        )
                    );

                    // If comments are open or we have at least one comment, load up the comment template.
                    if (comments_open() || get_comments_number()) :
                        comments_template();
                    endif;
                    ?>
                
                </div>
                
                <!-- Sidebar -->
                <div class="col-lg-4 col-md-12">
                    <?php get_sidebar(); ?>
                </div>
            </div>
        </div>

    <?php endwhile; // End of the loop. ?>
</main><!-- #main -->

<?php
get_footer();