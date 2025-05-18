<?php
/**
 * Template part for displaying the FAQ section
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

// Get FAQ section content
$faq_title = 'Frequently Asked Questions';
$faq_subtitle = 'Find quick answers to common questions about our products and services';

// Optional - check if ACF is active and use those fields
if (function_exists('get_field')) {
    $faq_title = get_field('faq_title') ?: $faq_title;
    $faq_subtitle = get_field('faq_subtitle') ?: $faq_subtitle;
}

// FAQ items
$faqs = array(
    array(
        'question' => 'What types of aluminum profiles do you offer?',
        'answer' => 'We offer a wide range of aluminum profiles including standard structural profiles, machine-building profiles, LED profiles, and custom solutions. Our catalog includes various shapes, sizes, and finishes suitable for different applications in construction, engineering, and design.'
    ),
    array(
        'question' => 'Do you provide international shipping?',
        'answer' => 'Yes, we provide international shipping to most European countries and beyond. Shipping costs and delivery times vary based on destination and order size. Contact us for specific shipping information for your location.'
    ),
    array(
        'question' => 'Can I request customized products?',
        'answer' => 'Absolutely! We specialize in providing customized solutions to meet specific project requirements. Contact our team with your specifications, and we\'ll work with our manufacturing partners to create products tailored to your needs.'
    ),
    array(
        'question' => 'What payment methods do you accept?',
        'answer' => 'We accept various payment methods including bank transfers, credit cards, and purchase orders for established business clients. Payment terms can be discussed based on order size and business relationship.'
    )
);

// Optional - check if ACF is active and use those fields
if (function_exists('get_field') && have_rows('faqs')) {
    $faqs = array();
    while (have_rows('faqs')) {
        the_row();
        $faqs[] = array(
            'question' => get_sub_field('question'),
            'answer' => get_sub_field('answer')
        );
    }
}
?>

<!-- FAQ Section -->
<section class="faq">
    <div class="container">
        <div class="section-header fade-in">
            <h2><?php echo esc_html($faq_title); ?></h2>
            <p><?php echo esc_html($faq_subtitle); ?></p>
        </div>
        
        <div class="row">
            <div class="col col-md-8 col-sm-12 mx-auto">
                <?php foreach ($faqs as $index => $faq) : ?>
                    <div class="faq-item fade-in-up">
                        <h3 class="faq-question"><?php echo esc_html($faq['question']); ?></h3>
                        <p><?php echo esc_html($faq['answer']); ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>