<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

/*
 * If the current post is protected by a password and
 * the visitor has not entered the password we will
 * return early without loading the comments.
 */
if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php
    // You can start editing here -- including this comment!
    if (have_comments()) :
    ?>
        <h2 class="comments-title">
            <?php
            $metanord_comment_count = get_comments_number();
            if ('1' === $metanord_comment_count) {
                printf(
                    /* translators: 1: title. */
                    esc_html__('One Comment on &ldquo;%1$s&rdquo;', 'metanord'),
                    '<span>' . wp_kses_post(get_the_title()) . '</span>'
                );
            } else {
                printf(
                    /* translators: 1: comment count number, 2: title. */
                    esc_html(_nx('%1$s Comment on &ldquo;%2$s&rdquo;', '%1$s Comments on &ldquo;%2$s&rdquo;', $metanord_comment_count, 'comments title', 'metanord')),
                    number_format_i18n($metanord_comment_count),
                    '<span>' . wp_kses_post(get_the_title()) . '</span>'
                );
            }
            ?>
        </h2><!-- .comments-title -->

        <?php the_comments_navigation(); ?>

        <ol class="comment-list">
            <?php
            wp_list_comments(
                array(
                    'style'      => 'ol',
                    'short_ping' => true,
                    'avatar_size' => 60,
                )
            );
            ?>
        </ol><!-- .comment-list -->

        <?php
        the_comments_navigation();

        // If comments are closed and there are comments, let's leave a little note, shall we?
        if (!comments_open()) :
        ?>
            <p class="no-comments"><?php esc_html_e('Comments are closed.', 'metanord'); ?></p>
        <?php
        endif;

    endif; // Check for have_comments().

    // Custom comment form settings
    $commenter = wp_get_current_commenter();
    $req = get_option('require_name_email');
    $aria_req = ($req ? " aria-required='true'" : '');
    
    $comment_form_args = array(
        'title_reply' => esc_html__('Leave a Comment', 'metanord'),
        'title_reply_before' => '<h3 id="reply-title" class="comment-reply-title">',
        'title_reply_after' => '</h3>',
        'class_form' => 'comment-form',
        'class_submit' => 'btn btn-primary',
        'comment_field' => '<div class="comment-form-comment form-group">
                            <label for="comment">' . esc_html__('Comment', 'metanord') . '</label>
                            <textarea id="comment" name="comment" class="form-control" rows="5" aria-required="true"></textarea>
                        </div>',
        'fields' => array(
            'author' => '<div class="comment-form-author form-group">
                        <label for="author">' . esc_html__('Name', 'metanord') . ($req ? ' <span class="required">*</span>' : '') . '</label>
                        <input id="author" name="author" type="text" class="form-control" value="' . esc_attr($commenter['comment_author']) . '" size="30"' . $aria_req . ' />
                    </div>',
            'email' => '<div class="comment-form-email form-group">
                        <label for="email">' . esc_html__('Email', 'metanord') . ($req ? ' <span class="required">*</span>' : '') . '</label>
                        <input id="email" name="email" type="email" class="form-control" value="' . esc_attr($commenter['comment_author_email']) . '" size="30"' . $aria_req . ' />
                    </div>',
            'url' => '<div class="comment-form-url form-group">
                     <label for="url">' . esc_html__('Website', 'metanord') . '</label>
                     <input id="url" name="url" type="url" class="form-control" value="' . esc_attr($commenter['comment_author_url']) . '" size="30" />
                 </div>',
        ),
        'comment_notes_before' => '<p class="comment-notes">' . esc_html__('Your email address will not be published. Required fields are marked *', 'metanord') . '</p>',
    );
    
    comment_form($comment_form_args);
    ?>

</div><!-- #comments -->