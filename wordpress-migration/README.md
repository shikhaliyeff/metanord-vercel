# MetaNord WordPress Migration Guide

This document outlines the process for migrating the MetaNord website from its current React-based implementation to WordPress. The migration template provided serves as a foundation for converting the React components into WordPress templates.

## Overview

The WordPress migration template is structured to maintain the design, functionality, and multilingual capabilities of the original React website while allowing for easier content management through WordPress.

## Migration Steps

### 1. WordPress Setup

1. **Install WordPress:**
   - Install WordPress on your hosting provider
   - Set up a database for WordPress
   - Complete the installation process

2. **Install Required Plugins:**
   - **Advanced Custom Fields (ACF)** - For creating custom fields for products, projects, etc.
   - **Polylang or WPML** - For multilingual support
   - **WooCommerce** - For product catalog and e-commerce features (if needed)
   - **Contact Form 7** - For contact forms
   - **Yoast SEO** - For SEO optimization

3. **Upload and Activate Theme:**
   - Upload the entire `metanord` theme folder to `wp-content/themes/`
   - Activate the theme in WordPress admin

### 2. Content Migration

1. **Create Pages:**
   - Home
   - About
   - Products
   - Services
   - Contact
   - Privacy Policy
   - Terms of Service
   - Shipping Info

2. **Set Up Products:**
   - If using WooCommerce, create product categories matching the existing structure
   - Add products with specifications, features, and applications
   - Upload product images

3. **Projects and Testimonials:**
   - Add projects using the custom post type
   - Add testimonials using the custom post type

4. **Configure Menus:**
   - Create primary navigation menu
   - Create footer menu

### 3. Multilingual Setup

1. **Configure Polylang or WPML:**
   - Set up languages: English, Estonian, Russian, Latvian, Lithuanian, and Polish
   - Configure language switcher appearance

2. **Content Translation:**
   - Translate all pages
   - Translate product information
   - Translate custom fields (requires ACF integration with multilingual plugin)
   - Translate menus

### 4. Theme Customization

1. **Theme Customizer:**
   - Configure logo and site identity
   - Set up social media links
   - Configure company information (address, phone, email, etc.)
   - Set color scheme if different from default theme colors

2. **Widget Areas:**
   - Configure footer widgets
   - Configure sidebar widgets (if applicable)

### 5. Additional Setup

1. **Forms:**
   - Set up Contact Form 7 forms for contact page
   - Set up newsletter signup form

2. **SEO:**
   - Configure Yoast SEO settings
   - Set up meta descriptions for all pages
   - Create XML sitemap

3. **Analytics:**
   - Add Google Analytics or other tracking code

## File Structure and Purpose

The WordPress theme is structured according to WordPress standards:

- **style.css** - Theme metadata and main CSS file
- **functions.php** - Theme functions and setup
- **index.php** - Main template file
- **header.php** - Header template
- **footer.php** - Footer template
- **page.php** - Default page template
- **single.php** - Default single post template
- **single-product.php** - WooCommerce product template
- **page-contact.php** - Contact page template
- **template-parts/** - Template parts for various sections
- **inc/** - Additional PHP functionality
- **assets/** - CSS, JavaScript, fonts, and images

## Special Considerations

### Multilingual Implementation

The original site uses i18next for translations. In WordPress, use either Polylang or WPML to manage translations. The language switcher functionality is already included in the theme and will automatically work with these plugins.

### Product Data Structure

The current React implementation uses a custom data structure for products. In WordPress, this is handled through:

1. WooCommerce products (recommended)
2. Custom post type if WooCommerce is not needed

Custom fields are used to store additional product data like specifications, features, and applications.

### Contact Form

The contact form implementation varies based on the plugin used:

1. Contact Form 7 integration is included in the theme
2. A fallback form using WordPress admin-post.php is also included

### CSS & JavaScript

1. All CSS is compiled from Tailwind source files
2. JS animations should be recreated using appropriate WordPress-friendly libraries

## Technical Notes

1. The theme includes responsive design out of the box
2. Browser compatibility is maintained across modern browsers
3. The theme is optimized for performance with minimal HTTP requests

## Support

For additional support with the migration process, please contact the MetaNord development team.

---

© 2023 MetaNord OÜ. All rights reserved.