<?php
/**
 * Template Name: Contact Page
 *
 * The template for displaying the contact page.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MetaNord
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    // Hero Section
    $contact_title = get_field('contact_title') ?: __('Get in Touch', 'metanord');
    $contact_title_highlight = get_field('contact_title_highlight') ?: __('With Us', 'metanord');
    $contact_subtitle = get_field('contact_subtitle') ?: __('We\'re here to answer your questions and provide the solutions you need', 'metanord');
    ?>
    
    <!-- Hero Section -->
    <section class="bg-primary text-white py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center" data-animation="fade-in-up">
                <h1 class="text-4xl md:text-5xl font-inter font-bold mb-6">
                    <?php echo esc_html($contact_title); ?> <span class="text-accent"><?php echo esc_html($contact_title_highlight); ?></span>
                </h1>
                <p class="text-lg md:text-xl font-roboto">
                    <?php echo esc_html($contact_subtitle); ?>
                </p>
            </div>
        </div>
    </section>
    
    <!-- Contact Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <!-- Contact Form -->
                <div class="bg-neutral-lightest p-8 rounded-lg shadow-sm" data-animation="fade-in">
                    <h2 class="text-2xl font-inter font-bold mb-6"><?php esc_html_e('Send Us a Message', 'metanord'); ?></h2>
                    
                    <?php
                    // Display Contact Form 7 form or custom form
                    if (function_exists('wpcf7_contact_form')) {
                        $contact_form_id = get_field('contact_form_id');
                        if ($contact_form_id) {
                            echo do_shortcode('[contact-form-7 id="' . esc_attr($contact_form_id) . '"]');
                        } else {
                            // Default CF7 shortcode if none specified
                            echo do_shortcode('[contact-form-7 id="contact-form" title="Contact Form"]');
                        }
                    } else {
                        // Fallback contact form if CF7 is not installed
                        ?>
                        <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post" class="space-y-6">
                            <input type="hidden" name="action" value="metanord_contact_form">
                            <?php wp_nonce_field('metanord_contact_nonce', 'contact_nonce'); ?>
                            
                            <div class="space-y-2">
                                <label for="name" class="block text-neutral-dark font-medium"><?php esc_html_e('Your Name', 'metanord'); ?></label>
                                <input type="text" id="name" name="name" placeholder="<?php esc_attr_e('Enter your name', 'metanord'); ?>" required 
                                    class="w-full px-4 py-2 border border-neutral rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                            </div>
                            
                            <div class="space-y-2">
                                <label for="email" class="block text-neutral-dark font-medium"><?php esc_html_e('Email Address', 'metanord'); ?></label>
                                <input type="email" id="email" name="email" placeholder="<?php esc_attr_e('Enter your email address', 'metanord'); ?>" required 
                                    class="w-full px-4 py-2 border border-neutral rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                            </div>
                            
                            <div class="space-y-2">
                                <label for="company" class="block text-neutral-dark font-medium"><?php esc_html_e('Company', 'metanord'); ?></label>
                                <input type="text" id="company" name="company" placeholder="<?php esc_attr_e('Enter your company name (optional)', 'metanord'); ?>" 
                                    class="w-full px-4 py-2 border border-neutral rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                            </div>
                            
                            <div class="space-y-2">
                                <label for="subject" class="block text-neutral-dark font-medium"><?php esc_html_e('Subject', 'metanord'); ?></label>
                                <select id="subject" name="subject" required 
                                    class="w-full px-4 py-2 border border-neutral rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option value=""><?php esc_html_e('Select an option', 'metanord'); ?></option>
                                    <option value="product_info"><?php esc_html_e('Product Information', 'metanord'); ?></option>
                                    <option value="quote"><?php esc_html_e('Request a Quote', 'metanord'); ?></option>
                                    <option value="support"><?php esc_html_e('Technical Support', 'metanord'); ?></option>
                                    <option value="other"><?php esc_html_e('Other', 'metanord'); ?></option>
                                </select>
                            </div>
                            
                            <div class="space-y-2">
                                <label for="message" class="block text-neutral-dark font-medium"><?php esc_html_e('Your Message', 'metanord'); ?></label>
                                <textarea id="message" name="message" rows="6" placeholder="<?php esc_attr_e('Write your message here...', 'metanord'); ?>" required 
                                    class="w-full px-4 py-2 border border-neutral rounded-md focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                            </div>
                            
                            <button type="submit" class="btn-primary">
                                <?php esc_html_e('Submit', 'metanord'); ?>
                            </button>
                        </form>
                        <?php
                    }
                    ?>
                </div>
                
                <!-- Contact Information -->
                <div data-animation="fade-in" data-animation-delay="0.2">
                    <h2 class="text-2xl font-inter font-bold mb-6"><?php esc_html_e('Contact Information', 'metanord'); ?></h2>
                    <p class="mb-8 text-neutral-dark font-roboto">
                        <?php esc_html_e('Reach out to us through any of these channels', 'metanord'); ?>
                    </p>
                    
                    <div class="space-y-8">
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Company', 'metanord'); ?></h3>
                                <p class="text-neutral-dark"><?php echo esc_html(get_theme_mod('company_name', 'MetaNord OÜ')); ?></p>
                            </div>
                        </div>
                        
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Registry Code', 'metanord'); ?></h3>
                                <p class="text-neutral-dark"><?php echo esc_html(get_theme_mod('registry_code', '17235227')); ?></p>
                            </div>
                        </div>
                        
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Address', 'metanord'); ?></h3>
                                <p class="text-neutral-dark"><?php echo esc_html(get_theme_mod('company_address', 'Tornimäe tn 5, 10145 Tallinn, Estonia')); ?></p>
                            </div>
                        </div>
                        
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Phone', 'metanord'); ?></h3>
                                <p class="text-neutral-dark">
                                    <a href="tel:<?php echo esc_attr(get_theme_mod('company_phone', '+372 5771 3442')); ?>" class="hover:text-primary">
                                        <?php echo esc_html(get_theme_mod('company_phone', '+372 5771 3442')); ?>
                                    </a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Email', 'metanord'); ?></h3>
                                <p class="text-neutral-dark">
                                    <a href="mailto:<?php echo esc_attr(get_theme_mod('company_email', 'info@metanord.eu')); ?>" class="hover:text-primary">
                                        <?php echo esc_html(get_theme_mod('company_email', 'info@metanord.eu')); ?>
                                    </a>
                                </p>
                            </div>
                        </div>
                        
                        <div class="flex">
                            <div class="mr-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-lg mb-1"><?php esc_html_e('Website', 'metanord'); ?></h3>
                                <p class="text-neutral-dark">
                                    <a href="<?php echo esc_url(get_theme_mod('company_website', 'https://metanord.eu')); ?>" class="hover:text-primary" target="_blank">
                                        <?php echo esc_html(get_theme_mod('company_website_display', 'www.metanord.eu')); ?>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Map Section -->
    <section class="py-12 bg-neutral-lightest">
        <div class="container mx-auto px-4">
            <h2 class="text-2xl font-inter font-bold mb-8 text-center"><?php esc_html_e('Our Location', 'metanord'); ?></h2>
            
            <div class="rounded-lg overflow-hidden shadow-md">
                <?php
                // Get custom map embed code or use a default one
                $map_embed = get_field('map_embed_code');
                if ($map_embed) {
                    echo $map_embed;
                } else {
                    // Default map embed - Tallinn, Estonia
                    echo '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2029.034244510323!2d24.76020811258094!3d59.437522694901056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692935c7add43df%3A0x7ab2e4be625df996!2sTornim%C3%A4e%205%2C%2010145%20Tallinn%2C%20Estonia!5e0!3m2!1sen!2sus!4v1641988151824!5m2!1sen!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
                }
                ?>
            </div>
        </div>
    </section>
    
    <!-- FAQ Section -->
    <section class="py-16 bg-neutral-lightest">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16" data-animation="fade-in">
                <h2 class="text-3xl font-inter font-bold mb-4">
                    <?php esc_html_e('Frequently Asked Questions', 'metanord'); ?>
                </h2>
                <p class="text-lg text-neutral-dark max-w-3xl mx-auto font-roboto">
                    <?php esc_html_e('Find quick answers to common questions about our products and services', 'metanord'); ?>
                </p>
            </div>
            
            <div class="max-w-3xl mx-auto">
                <?php
                // Get FAQs from ACF repeater field or use default ones
                $faqs = get_field('faqs');
                if (!empty($faqs)) {
                    foreach ($faqs as $index => $faq) {
                        $delay = $index * 0.1;
                        ?>
                        <div class="bg-white rounded-lg shadow-sm p-6 mb-4" data-animation="fade-in" data-animation-delay="<?php echo esc_attr($delay); ?>">
                            <h3 class="text-xl font-inter font-semibold mb-2"><?php echo esc_html($faq['question']); ?></h3>
                            <p class="font-roboto text-neutral-dark">
                                <?php echo wp_kses_post($faq['answer']); ?>
                            </p>
                        </div>
                        <?php
                    }
                } else {
                    // Default FAQs
                    $default_faqs = [
                        [
                            'question' => __('What types of aluminum profiles do you offer?', 'metanord'),
                            'answer' => __('We offer a wide range of aluminum profiles including standard structural profiles, machine-building profiles, LED profiles, and custom solutions. Our catalog includes various shapes, sizes, and finishes suitable for different applications in construction, engineering, and design.', 'metanord')
                        ],
                        [
                            'question' => __('Do you provide international shipping?', 'metanord'),
                            'answer' => __('Yes, we provide international shipping to most European countries and beyond. Shipping costs and delivery times vary based on destination and order size. Contact us for specific shipping information for your location.', 'metanord')
                        ],
                        [
                            'question' => __('Can I request customized products?', 'metanord'),
                            'answer' => __('Absolutely! We specialize in providing customized solutions to meet specific project requirements. Contact our team with your specifications, and we\'ll work with our manufacturing partners to create products tailored to your needs.', 'metanord')
                        ],
                        [
                            'question' => __('What payment methods do you accept?', 'metanord'),
                            'answer' => __('We accept various payment methods including bank transfers, credit cards, and purchase orders for established business clients. Payment terms can be discussed based on order size and business relationship.', 'metanord')
                        ]
                    ];
                    
                    foreach ($default_faqs as $index => $faq) {
                        $delay = $index * 0.1;
                        ?>
                        <div class="bg-white rounded-lg shadow-sm p-6 mb-4" data-animation="fade-in" data-animation-delay="<?php echo esc_attr($delay); ?>">
                            <h3 class="text-xl font-inter font-semibold mb-2"><?php echo esc_html($faq['question']); ?></h3>
                            <p class="font-roboto text-neutral-dark">
                                <?php echo esc_html($faq['answer']); ?>
                            </p>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();