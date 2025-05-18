<?php
/**
 * Template part for displaying the services section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get services section content
$services_title = 'Our';
$services_title_highlight = 'Services';
$services_subtitle = 'Comprehensive solutions for your industrial and infrastructure needs';

// Optional - check if ACF is active and use those fields
if (function_exists('get_field')) {
    $services_title = get_field('services_title') ?: $services_title;
    $services_title_highlight = get_field('services_title_highlight') ?: $services_title_highlight;
    $services_subtitle = get_field('services_subtitle') ?: $services_subtitle;
}

// Services data
$services = array(
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10a2 2 0 1 0 4 0 2 2 0 1 0-4 0"></path><path d="M10 2c2.236 0 4.5.5 6 2 1.5 1.5 2 3.764 2 6s-.5 4.5-2 6c-1.5 1.5-3.764 2-6 2s-4.5-.5-6-2c-1.5-1.5-2-3.764-2-6s.5-4.5 2-6c1.5-1.5 3.764-2 6-2Z"></path><path d="M6.5 15.5c1 1 2.5 1.5 3.5 1.5s2.5-.5 3.5-1.5"></path><path d="M22 22 12 12"></path></svg>',
        'title' => 'Product Sourcing',
        'description' => 'We identify and source high-quality industrial products from trusted European manufacturers to meet your specific project requirements.',
        'features' => array(
            'Manufacturer identification',
            'Quality assurance',
            'Technical specifications matching',
            'Competitive pricing',
            'European standards compliance'
        )
    ),
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>',
        'title' => 'Project Consultation',
        'description' => 'Our experienced team provides expert guidance to help you select the ideal products and solutions for your infrastructure projects.',
        'features' => array(
            'Technical requirements analysis',
            'Product selection guidance',
            'Budget optimization',
            'Timeline planning',
            'Industry-specific expertise'
        )
    ),
    array(
        'icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h14l-4.5 7H9.5L5 9Z"></path><path d="M13 16v2"></path><path d="M11 16v2"></path><path d="M9 3v2"></path><path d="M15 3v2"></path><path d="M12 3v4"></path></svg>',
        'title' => 'Distribution & Logistics',
        'description' => 'We handle the complete logistics process from manufacturers to your project site, ensuring timely and efficient delivery.',
        'features' => array(
            'International shipping coordination',
            'Customs documentation',
            'Inventory management',
            'Just-in-time delivery',
            'Multi-point distribution'
        )
    )
);

// Optional - check if ACF is active and use those fields
if (function_exists('get_field') && have_rows('services')) {
    $services = array();
    while (have_rows('services')) {
        the_row();
        
        $features = array();
        if (have_rows('features')) {
            while (have_rows('features')) {
                the_row();
                $features[] = get_sub_field('feature');
            }
        }
        
        $services[] = array(
            'icon' => get_sub_field('icon'),
            'title' => get_sub_field('title'),
            'description' => get_sub_field('description'),
            'features' => $features
        );
    }
}
?>

<!-- Services Section -->
<section id="services" class="services">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php echo esc_html($services_title); ?> <span class="text-primary"><?php echo esc_html($services_title_highlight); ?></span></h2>
            <p><?php echo esc_html($services_subtitle); ?></p>
        </div>
        
        <div class="row">
            <?php foreach ($services as $index => $service) : ?>
                <div class="col col-md-4 col-sm-12 mb-4">
                    <div class="service-card fade-in-up">
                        <div class="service-icon">
                            <?php echo $service['icon']; ?>
                        </div>
                        <h3><?php echo esc_html($service['title']); ?></h3>
                        <p><?php echo esc_html($service['description']); ?></p>
                        
                        <?php if (!empty($service['features'])) : ?>
                            <ul class="service-list">
                                <?php foreach ($service['features'] as $feature) : ?>
                                    <li><?php echo esc_html($feature); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>