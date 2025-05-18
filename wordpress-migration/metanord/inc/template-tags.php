<?php
/**
 * Custom template tags for this theme
 *
 * @package MetaNord
 */

if (!function_exists('metanord_posted_on')) :
    /**
     * Prints HTML with meta information for the current post-date/time.
     */
    function metanord_posted_on() {
        $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
        if (get_the_time('U') !== get_the_modified_time('U')) {
            $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
        }

        $time_string = sprintf(
            $time_string,
            esc_attr(get_the_date(DATE_W3C)),
            esc_html(get_the_date()),
            esc_attr(get_the_modified_date(DATE_W3C)),
            esc_html(get_the_modified_date())
        );

        echo '<span class="posted-on">' . $time_string . '</span>';
    }
endif;

if (!function_exists('metanord_posted_by')) :
    /**
     * Prints HTML with meta information for the current author.
     */
    function metanord_posted_by() {
        echo '<span class="byline">' . 
            sprintf(
                /* translators: %s: post author */
                esc_html_x('by %s', 'post author', 'metanord'),
                '<span class="author vcard"><a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>'
            ) . 
        '</span>';
    }
endif;

if (!function_exists('metanord_entry_footer')) :
    /**
     * Prints HTML with meta information for the categories, tags and comments.
     */
    function metanord_entry_footer() {
        // Hide category and tag text for pages.
        if ('post' === get_post_type()) {
            /* translators: used between list items, there is a space after the comma */
            $categories_list = get_the_category_list(esc_html__(', ', 'metanord'));
            if ($categories_list) {
                /* translators: 1: list of categories. */
                printf('<span class="cat-links">' . esc_html__('Posted in %1$s', 'metanord') . '</span>', $categories_list);
            }

            /* translators: used between list items, there is a space after the comma */
            $tags_list = get_the_tag_list('', esc_html_x(', ', 'list item separator', 'metanord'));
            if ($tags_list) {
                /* translators: 1: list of tags. */
                printf('<span class="tags-links">' . esc_html__('Tagged %1$s', 'metanord') . '</span>', $tags_list);
            }
        }

        if (!is_single() && !post_password_required() && (comments_open() || get_comments_number())) {
            echo '<span class="comments-link">';
            comments_popup_link(
                sprintf(
                    wp_kses(
                        /* translators: %s: post title */
                        __('Leave a Comment<span class="screen-reader-text"> on %s</span>', 'metanord'),
                        array(
                            'span' => array(
                                'class' => array(),
                            ),
                        )
                    ),
                    wp_kses_post(get_the_title())
                )
            );
            echo '</span>';
        }

        edit_post_link(
            sprintf(
                wp_kses(
                    /* translators: %s: Name of current post. Only visible to screen readers */
                    __('Edit <span class="screen-reader-text">%s</span>', 'metanord'),
                    array(
                        'span' => array(
                            'class' => array(),
                        ),
                    )
                ),
                wp_kses_post(get_the_title())
            ),
            '<span class="edit-link">',
            '</span>'
        );
    }
endif;

if (!function_exists('metanord_post_thumbnail')) :
    /**
     * Displays an optional post thumbnail.
     *
     * Wraps the post thumbnail in an anchor element on index views, or a div
     * element when on single views.
     */
    function metanord_post_thumbnail() {
        if (post_password_required() || is_attachment() || !has_post_thumbnail()) {
            return;
        }

        if (is_singular()) :
            ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail('large', array('class' => 'rounded-lg')); ?>
            </div>
        <?php else : ?>
            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                <?php
                the_post_thumbnail(
                    'medium',
                    array(
                        'alt' => the_title_attribute(
                            array(
                                'echo' => false,
                            )
                        ),
                        'class' => 'rounded-lg hover:opacity-90 transition-opacity',
                    )
                );
                ?>
            </a>
            <?php
        endif;
    }
endif;

if (!function_exists('metanord_get_breadcrumbs')) :
    /**
     * Display breadcrumbs
     */
    function metanord_get_breadcrumbs() {
        // Initialize breadcrumbs
        $delimiter = '<span class="delimiter">/</span>';
        $home = __('Home', 'metanord');
        $before = '<span class="current">';
        $after = '</span>';
        
        // Don't display breadcrumbs on the homepage
        if (!is_home() && !is_front_page() || is_paged()) {
            echo '<div class="breadcrumbs">';
            
            global $post;
            $homeLink = home_url('/');
            
            echo '<a href="' . $homeLink . '">' . $home . '</a> ' . $delimiter . ' ';
            
            if (is_category()) {
                global $wp_query;
                $cat_obj = $wp_query->get_queried_object();
                $thisCat = $cat_obj->term_id;
                $thisCat = get_category($thisCat);
                $parentCat = get_category($thisCat->parent);
                
                if ($thisCat->parent != 0) {
                    echo(get_category_parents($parentCat, TRUE, ' ' . $delimiter . ' '));
                }
                
                echo $before . single_cat_title('', false) . $after;
            } elseif (is_search()) {
                echo $before . __('Search Results for', 'metanord') . ' "' . get_search_query() . '"' . $after;
            } elseif (is_day()) {
                echo '<a href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a> ' . $delimiter . ' ';
                echo '<a href="' . get_month_link(get_the_time('Y'), get_the_time('m')) . '">' . get_the_time('F') . '</a> ' . $delimiter . ' ';
                echo $before . get_the_time('d') . $after;
            } elseif (is_month()) {
                echo '<a href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a> ' . $delimiter . ' ';
                echo $before . get_the_time('F') . $after;
            } elseif (is_year()) {
                echo $before . get_the_time('Y') . $after;
            } elseif (is_single() && !is_attachment()) {
                if (get_post_type() != 'post') {
                    $post_type = get_post_type_object(get_post_type());
                    $slug = $post_type->rewrite;
                    echo '<a href="' . $homeLink . $slug['slug'] . '/">' . $post_type->labels->singular_name . '</a> ' . $delimiter . ' ';
                    echo $before . get_the_title() . $after;
                } else {
                    $cat = get_the_category();
                    if ($cat) {
                        $cat = $cat[0];
                        echo get_category_parents($cat, TRUE, ' ' . $delimiter . ' ');
                    }
                    echo $before . get_the_title() . $after;
                }
            } elseif (is_attachment()) {
                $parent = get_post($post->post_parent);
                $cat = get_the_category($parent->ID);
                if ($cat) {
                    $cat = $cat[0];
                    echo get_category_parents($cat, TRUE, ' ' . $delimiter . ' ');
                }
                echo '<a href="' . get_permalink($parent) . '">' . $parent->post_title . '</a> ' . $delimiter . ' ';
                echo $before . get_the_title() . $after;
            } elseif (is_page() && !$post->post_parent) {
                echo $before . get_the_title() . $after;
            } elseif (is_page() && $post->post_parent) {
                $parent_id = $post->post_parent;
                $breadcrumbs = array();
                
                while ($parent_id) {
                    $page = get_page($parent_id);
                    $breadcrumbs[] = '<a href="' . get_permalink($page->ID) . '">' . get_the_title($page->ID) . '</a>';
                    $parent_id = $page->post_parent;
                }
                
                $breadcrumbs = array_reverse($breadcrumbs);
                
                foreach ($breadcrumbs as $crumb) {
                    echo $crumb . ' ' . $delimiter . ' ';
                }
                
                echo $before . get_the_title() . $after;
            } elseif (is_tag()) {
                echo $before . __('Posts tagged', 'metanord') . ' "' . single_tag_title('', false) . '"' . $after;
            } elseif (is_author()) {
                global $author;
                $userdata = get_userdata($author);
                echo $before . __('Articles posted by', 'metanord') . ' ' . $userdata->display_name . $after;
            } elseif (is_404()) {
                echo $before . __('Error 404', 'metanord') . $after;
            }
            
            if (get_query_var('paged')) {
                if (is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author()) {
                    echo ' (';
                }
                echo __('Page', 'metanord') . ' ' . get_query_var('paged');
                if (is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author()) {
                    echo ')';
                }
            }
            
            echo '</div>';
        }
    }
endif;

if (!function_exists('metanord_display_social_icons')) :
    /**
     * Display social media icons
     */
    function metanord_display_social_icons() {
        // Get social media links from theme customizer
        $facebook = get_theme_mod('facebook_url');
        $twitter = get_theme_mod('twitter_url');
        $instagram = get_theme_mod('instagram_url');
        $linkedin = get_theme_mod('linkedin_url');
        $youtube = get_theme_mod('youtube_url');
        
        echo '<div class="social-icons flex space-x-4">';
        
        if ($facebook) {
            echo '<a href="' . esc_url($facebook) . '" target="_blank" rel="noopener noreferrer" class="social-icon facebook">';
            echo '<span class="screen-reader-text">' . __('Facebook', 'metanord') . '</span>';
            echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>';
            echo '</a>';
        }
        
        if ($twitter) {
            echo '<a href="' . esc_url($twitter) . '" target="_blank" rel="noopener noreferrer" class="social-icon twitter">';
            echo '<span class="screen-reader-text">' . __('Twitter', 'metanord') . '</span>';
            echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>';
            echo '</a>';
        }
        
        if ($instagram) {
            echo '<a href="' . esc_url($instagram) . '" target="_blank" rel="noopener noreferrer" class="social-icon instagram">';
            echo '<span class="screen-reader-text">' . __('Instagram', 'metanord') . '</span>';
            echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';
            echo '</a>';
        }
        
        if ($linkedin) {
            echo '<a href="' . esc_url($linkedin) . '" target="_blank" rel="noopener noreferrer" class="social-icon linkedin">';
            echo '<span class="screen-reader-text">' . __('LinkedIn', 'metanord') . '</span>';
            echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
            echo '</a>';
        }
        
        if ($youtube) {
            echo '<a href="' . esc_url($youtube) . '" target="_blank" rel="noopener noreferrer" class="social-icon youtube">';
            echo '<span class="screen-reader-text">' . __('YouTube', 'metanord') . '</span>';
            echo '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>';
            echo '</a>';
        }
        
        echo '</div>';
    }
endif;

if (!function_exists('metanord_display_product_card')) :
    /**
     * Display product card
     * 
     * @param int|WP_Post $product Product ID or post object.
     * @param array $args Additional arguments.
     */
    function metanord_display_product_card($product, $args = array()) {
        $defaults = array(
            'show_description' => true,
            'show_price' => true,
            'show_button' => true,
            'button_text' => __('View Details', 'metanord'),
            'animation_delay' => 0,
        );
        
        $args = wp_parse_args($args, $defaults);
        $product_id = is_object($product) ? $product->ID : $product;
        
        // Get product data
        $title = get_the_title($product_id);
        $permalink = get_permalink($product_id);
        $thumbnail = get_the_post_thumbnail($product_id, 'metanord-product-thumb', array('class' => 'w-full h-full object-cover transition-transform hover:scale-110'));
        $description = wp_trim_words(get_the_excerpt($product_id), 15, '...');
        
        // For WooCommerce products
        $wc_product = null;
        if (function_exists('wc_get_product')) {
            $wc_product = wc_get_product($product_id);
        }
        
        // Animation delay
        $delay_attr = $args['animation_delay'] > 0 ? ' data-animation-delay="' . esc_attr($args['animation_delay']) . '"' : '';
        
        // Output card
        ?>
        <div class="product-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] bg-white" data-animation="fade-in"<?php echo $delay_attr; ?>>
            <a href="<?php echo esc_url($permalink); ?>" class="block">
                <div class="relative aspect-[4/3] overflow-hidden">
                    <?php 
                    if ($thumbnail) {
                        echo $thumbnail;
                    } else {
                        echo '<img src="' . esc_url(get_template_directory_uri() . '/assets/images/placeholder.webp') . '" alt="' . esc_attr($title) . '" class="w-full h-full object-cover">';
                    }
                    ?>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <h3 class="text-xl font-semibold text-white p-4 font-inter"><?php echo esc_html($title); ?></h3>
                    </div>
                </div>
                <div class="p-4">
                    <?php if ($args['show_description'] && $description) : ?>
                        <p class="text-neutral-dark mb-4 font-roboto"><?php echo esc_html($description); ?></p>
                    <?php endif; ?>
                    
                    <?php if ($args['show_price'] && $wc_product) : ?>
                        <div class="price text-primary font-semibold mb-4">
                            <?php echo $wc_product->get_price_html(); ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($args['show_button']) : ?>
                        <span class="inline-flex items-center text-primary font-semibold">
                            <?php echo esc_html($args['button_text']); ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </span>
                    <?php endif; ?>
                </div>
            </a>
        </div>
        <?php
    }
endif;