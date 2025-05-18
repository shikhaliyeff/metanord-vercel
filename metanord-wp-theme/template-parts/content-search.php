<?php
/**
 * Template part for displaying results in search pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
    <div class="search-result-content">
        <header class="entry-header">
            <?php the_title(sprintf('<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>

            <?php if ('post' === get_post_type()) : ?>
            <div class="entry-meta">
                <?php
                metanord_posted_on();
                metanord_posted_by();
                ?>
            </div><!-- .entry-meta -->
            <?php endif; ?>
        </header><!-- .entry-header -->

        <div class="entry-summary">
            <?php the_excerpt(); ?>
        </div><!-- .entry-summary -->

        <footer class="entry-footer">
            <?php metanord_entry_footer(); ?>
        </footer><!-- .entry-footer -->
    </div>

    <?php if (has_post_thumbnail()) : ?>
    <div class="search-result-thumbnail">
        <a href="<?php the_permalink(); ?>">
            <?php the_post_thumbnail('thumbnail'); ?>
        </a>
    </div>
    <?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->