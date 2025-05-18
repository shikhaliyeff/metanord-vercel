# MetaNord WordPress Theme Setup Guide

This guide will help you set up your WordPress website using the MetaNord theme.

## Initial Setup

### Step 1: Install the Theme

1. Go to WordPress Admin → Appearance → Themes → Add New → Upload Theme
2. Browse to the MetaNord theme zip file and click "Install Now"
3. After installation, click "Activate" to activate the theme

### Step 2: Install Required Plugins

For full functionality, the following plugins are recommended:

1. **Advanced Custom Fields Pro** - For advanced content editing capabilities
2. **Contact Form 7** - For creating and managing contact forms
3. **Polylang** or **WPML** - For multilingual support
4. **Yoast SEO** - For SEO optimization and breadcrumbs
5. **WooCommerce** - If you plan to sell products online

Install these plugins from the WordPress Admin → Plugins → Add New section.

### Step 3: Import Demo Content (Optional)

To quickly set up your site like the demo:

1. Install and activate the "WordPress Importer" plugin
2. Go to Tools → Import → WordPress
3. Upload the provided `metanord-demo-content.xml` file

## Theme Configuration

### Step 1: General Settings

1. Go to Settings → General
2. Set your site title and tagline
3. Choose your preferred language settings

### Step 2: Customize Theme Appearance

1. Go to Appearance → Customize to access the Theme Customizer
2. Explore the following settings:
   - Site Identity: Upload your logo and favicon
   - Colors: Adjust primary, secondary, and accent colors
   - Typography: Select fonts and sizes
   - Header Settings: Configure header layout and elements
   - Footer Settings: Set up footer widgets and copyright text
   - Social Media: Add your social media profiles

### Step 3: Set Up Front Page

1. Create a new page titled "Home" or similar
2. Select the "Front Page" template from the Page Attributes section
3. Add content using the provided blocks or ACF fields
4. Go to Settings → Reading
5. Select "A static page" for "Your homepage displays"
6. Choose your new page as the "Homepage"

### Step 4: Configure Navigation Menus

1. Go to Appearance → Menus
2. Create a new menu for your main navigation
3. Add your most important pages
4. Under "Menu Settings" select "Primary Menu" as the display location
5. Create additional menus for Footer Menu and Footer Links if needed

### Step 5: Customize Product Catalog

If you're using WooCommerce:

1. Go to WooCommerce → Settings to configure your shop
2. Set up product categories that match your business offerings
3. Add products with high-quality images and detailed descriptions
4. Create a "Products" page using the "Products Page" template

If you're not using WooCommerce:

1. Create a "Products" page using the "Products Page" template
2. Edit the page and use the ACF fields to add your product categories

### Step 6: Set Up Contact Page

1. Create a new page titled "Contact" or similar
2. Select the "Contact Page" template from the Page Attributes section
3. If using Contact Form 7:
   - Create a new form in Contact Form 7
   - Copy the shortcode (e.g., `[contact-form-7 id="123" title="Contact Form"]`)
   - Paste it into the "Contact Form Shortcode" field on your Contact page
4. Add Google Maps embed code if desired
5. Update company information in Theme Settings or ACF fields

### Step 7: Set Up Multilingual Support

If using Polylang:

1. Go to Languages → Settings
2. Add the languages you want to support
3. Configure URL structure and other settings
4. Use the language switcher in the Widgets section or via shortcode

If using WPML:

1. Go to WPML → Languages
2. Set up your languages and configure settings
3. Use the WPML Language Switcher widget or shortcode

## Advanced Configuration

### Customizing the Theme with CSS

1. Go to Appearance → Customize → Additional CSS
2. Add your custom CSS rules
3. Use browser developer tools to identify elements to customize

### Using ACF Fields

If using Advanced Custom Fields Pro:

1. Go to Custom Fields to view all field groups
2. Edit existing fields or create new ones
3. Use ACF fields in templates to customize content

### Setting Up Blog Posts

1. Create categories for your blog posts in Posts → Categories
2. Create new posts in Posts → Add New
3. Assign categories and featured images to posts
4. If desired, create a "Blog" page to display your posts

### Theme File Structure

If you need to modify theme files:

1. Create a child theme to avoid losing changes during updates
2. Important theme files:
   - `style.css`: Main stylesheet
   - `functions.php`: Theme functions
   - `header.php` & `footer.php`: Site header and footer
   - `front-page.php`: Front page template
   - `page.php`: Standard page template
   - `single.php`: Single post template
   - `archive.php`: Archive pages template
   - `template-parts/`: Template components
   - `page-templates/`: Custom page templates
   - `inc/`: Theme functionality files

## Troubleshooting

### Common Issues

- **Menu Not Appearing**: Check if you've assigned it to the correct location
- **Widgets Not Showing**: Verify they're assigned to the correct widget areas
- **Contact Form Not Working**: Check for JavaScript errors and correct setup in Contact Form 7
- **Missing Content**: Ensure all ACF fields are populated
- **Styling Issues**: Clear browser cache and check for CSS customizations

### Getting Help

For additional support, please contact:

- Email: info@metanord.eu
- Website: https://metanord.eu

## Extending the Theme

### WooCommerce Integration

The theme includes built-in WooCommerce support. To customize the shop pages:

1. Create a `woocommerce` folder in your child theme
2. Copy template files from the WooCommerce plugin to this folder
3. Modify the copied templates as needed

### Adding Custom Post Types

If you need custom post types beyond the default Pages and Posts:

1. Use a plugin like "Custom Post Type UI"
2. Create the required post types and taxonomies
3. Create template files named `single-{post_type}.php` and `archive-{post_type}.php`

---

Thank you for choosing the MetaNord theme for your website. We hope this guide helps you set up your site quickly and effectively.