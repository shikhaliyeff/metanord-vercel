<?php
/**
 * Custom search form template
 *
 * @package MetaNord
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
    <div class="search-form-wrapper">
        <label class="screen-reader-text" for="search-input"><?php esc_html_e('Search for:', 'metanord'); ?></label>
        <input type="search" id="search-input" class="search-field form-control" placeholder="<?php echo esc_attr_x('Search...', 'placeholder', 'metanord'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
        <button type="submit" class="search-submit" aria-label="<?php esc_attr_e('Submit search', 'metanord'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
    </div>
</form>