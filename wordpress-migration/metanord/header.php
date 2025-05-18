<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and the site header
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MetaNord
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'metanord'); ?></a>

    <header id="masthead" class="site-header">
        <div class="container mx-auto px-4 flex justify-between items-center py-4">
            <div class="site-branding">
                <?php
                the_custom_logo();
                if (is_front_page() && is_home()) :
                    ?>
                    <h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a></h1>
                    <?php
                else :
                    ?>
                    <p class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a></p>
                    <?php
                endif;
                $metanord_description = get_bloginfo('description', 'display');
                if ($metanord_description || is_customize_preview()) :
                    ?>
                    <p class="site-description"><?php echo $metanord_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
                <?php endif; ?>
            </div><!-- .site-branding -->

            <nav id="site-navigation" class="main-navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'menu_id'        => 'primary-menu',
                        'container_class' => 'primary-menu-container',
                        'menu_class'     => 'flex space-x-6 items-center',
                    )
                );
                ?>
            </nav><!-- #site-navigation -->

            <div class="language-switcher-wrapper">
                <?php metanord_language_switcher(); ?>
            </div>
        </div>
    </header><!-- #masthead -->