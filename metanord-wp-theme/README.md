# MetaNord WordPress Theme

A modern, Nordic-inspired WordPress theme for MetaNord OÜ, focusing on industrial infrastructure products with advanced multilingual and e-commerce capabilities.

## Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices.
- **Modern Aesthetic**: Clean Nordic-inspired design with industry-appropriate color scheme.
- **Product Catalog**: Built-in product catalog display with categorization.
- **WooCommerce Compatible**: Ready for e-commerce integration.
- **Multilingual Support**: Ready for translation with WPML or Polylang.
- **Advanced Custom Fields**: Extensive use of ACF for easy content management.
- **Modular Template Structure**: Reusable template parts for consistent design.
- **Custom Page Templates**: Specialized templates for different content needs.
- **Block Editor Support**: Enhanced support for the WordPress block editor.
- **Performance Optimized**: Fast loading and optimized code structure.

## Installation

1. Upload the theme folder to the `/wp-content/themes/` directory
2. Activate the theme through the 'Appearance' menu in WordPress
3. Configure theme options via the WordPress Customizer
4. Import ACF field groups from the `acf-json` directory if needed

## Required Plugins

- **Advanced Custom Fields Pro**: For custom fields and flexible content
- **WooCommerce** (Optional): For e-commerce functionality
- **WPML** or **Polylang** (Optional): For multilingual capabilities
- **Contact Form 7** (Optional): For contact forms
- **WP Rocket** (Recommended): For performance optimization

## Theme Setup

### Homepage Configuration

1. Create a new page and assign the "Front Page" template
2. Set this page as your static front page in Settings → Reading
3. Configure the homepage sections through ACF fields

### Menu Setup

1. Create menus in Appearance → Menus
2. Assign menus to:
   - Primary Navigation (Header)
   - Footer Navigation
   - Social Media Links

### Theme Customization

The theme can be customized through:

1. WordPress Customizer (Appearance → Customize)
2. ACF fields in each page/post
3. Theme settings page (Theme Options)

## Customizing Styles

The theme uses a modular CSS approach:

- `style.css` - Only contains the theme declaration
- `assets/css/main.css` - Main stylesheet with all styles
- `assets/css/editor-style.css` - Styles for the WordPress editor
- `assets/css/woocommerce.css` - WooCommerce specific styles

## Template Structure

```
metanord-wp-theme/
├── 404.php
├── archive.php
├── comments.php
├── footer.php
├── front-page.php
├── functions.php
├── header.php
├── index.php
├── page.php
├── search.php
├── sidebar.php
├── single.php
├── style.css
├── screenshot.png
├── acf-json/
│   └── metanord-acf-field-groups.json
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── inc/
│   ├── customizer.php
│   ├── template-functions.php
│   └── template-tags.php
├── languages/
├── page-templates/
│   ├── page-contact.php
│   ├── page-full-width.php
│   └── page-products.php
└── template-parts/
    ├── content-hero.php
    ├── content-about.php
    ├── content-products.php
    ├── content-services.php
    ├── content-cta.php
    ├── content-faq.php
    ├── content-contact.php
    ├── content-none.php
    ├── content-page.php
    └── content.php
```

## Development Guidelines

This theme follows WordPress coding standards and best practices:

- WordPress Coding Standards
- Proper prefixing with 'metanord_'
- Translation-ready with internationalization functions
- Accessibility considerations
- Sanitization and validation

## Credits

- Theme development: MetaNord OÜ
- Based on Underscores: https://underscores.me/
- Fonts: Inter, Montserrat via Google Fonts

## License

This theme is licensed under the GPL v2 or later.

---

© 2023 MetaNord OÜ. All rights reserved.