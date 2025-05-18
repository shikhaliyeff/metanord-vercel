<?php
/**
 * Template part for displaying the about section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get about section content - can be customized with ACF fields
$about_title = 'About';
$about_title_highlight = 'MetaNord';
$about_subtitle = 'A trusted partner in industrial infrastructure solutions across Europe and beyond';

// Optional - check if ACF is active and use those fields instead if available
if (function_exists('get_field')) {
    $about_title = get_field('about_title') ?: $about_title;
    $about_title_highlight = get_field('about_title_highlight') ?: $about_title_highlight;
    $about_subtitle = get_field('about_subtitle') ?: $about_subtitle;
}

// Feature data - can be customized with ACF repeater field
$features = array(
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path><path d="M3 10v1"></path><path d="M3 14v7"></path><path d="M21 7v14"></path><path d="M6 21v-4"></path><path d="M10 21v-8"></path><path d="M14 21v-6"></path><path d="M18 21v-9"></path></svg>',
        'title' => 'European Quality',
        'description' => 'We source premium products from trusted European manufacturers, ensuring exceptional quality and durability for all infrastructure needs.'
    ),
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h.01"></path><path d="M12 8h.01"></path><path d="M18 8h.01"></path><path d="M6 12h.01"></path><path d="M12 12h.01"></path><path d="M18 12h.01"></path><path d="M6 16h.01"></path><path d="M12 16h.01"></path><path d="M18 16h.01"></path></svg>',
        'title' => 'Diverse Product Range',
        'description' => 'Our comprehensive catalog includes aluminum profiles, cast iron products, polyethylene pipes, and a wide range of infrastructure solutions.'
    ),
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m12 8 4 4-4 4"></path><path d="m8 12h8"></path></svg>',
        'title' => 'Global Reach',
        'description' => 'With logistics expertise and established partnerships, we efficiently deliver products to clients across Europe and international markets.'
    ),
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'title' => 'Expert Consultation',
        'description' => 'Our experienced team provides professional guidance to help you select the ideal products for your specific project requirements.'
    )
);

// Optional - check if ACF is active and use those fields instead if available
if (function_exists('get_field') && have_rows('features')) {
    $features = array();
    while (have_rows('features')) {
        the_row();
        $features[] = array(
            'icon' => get_sub_field('icon'),
            'title' => get_sub_field('title'),
            'description' => get_sub_field('description')
        );
    }
}
?>

<!-- About Section -->
<section id="about" class="features">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php echo esc_html($about_title); ?> <span class="text-primary"><?php echo esc_html($about_title_highlight); ?></span></h2>
            <p><?php echo esc_html($about_subtitle); ?></p>
        </div>
        
        <div class="row">
            <?php foreach ($features as $index => $feature) : ?>
                <div class="col col-md-6 col-sm-12 mb-4">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <?php echo $feature['icon']; ?>
                        </div>
                        <h3 class="feature-title"><?php echo esc_html($feature['title']); ?></h3>
                        <p><?php echo esc_html($feature['description']); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>