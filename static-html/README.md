# MetaNord Static HTML Template

This package contains a static HTML version of the MetaNord website, prepared for easy migration to WordPress using Elementor. The structure is optimized for block-by-block visual translation.

## Contents

- **index.html** - Complete static HTML page with all content sections
- **css/styles.css** - All styles consolidated into a single CSS file
- **js/main.js** - Minimal JavaScript for basic interactions
- **images/** - All product images and assets
- **fonts/** - Directory for any custom fonts (empty by default, using Google Fonts)

## Structure Overview

The HTML is organized into semantic sections that map directly to Elementor sections:

1. **Header & Navigation** - Site logo, navigation menu, and language switcher
2. **Hero Section** - Main banner with headline, subheading, and call-to-action buttons
3. **About Section** - Company features and benefits
4. **Products Section** - Product categories displayed in a grid
5. **Services Section** - Service offerings with icons and descriptions
6. **CTA Section** - Call-to-action with buttons
7. **Contact Section** - Contact form and company information
8. **FAQ Section** - Frequently asked questions
9. **Footer** - Company info, quick links, product categories, and newsletter signup

## WordPress/Elementor Migration Tips

1. Create a new WordPress site with Elementor Pro installed
2. Use the "Import Template" feature in Elementor to start with a blank canvas
3. Create a new page and build section by section, referring to the HTML structure
4. For styling:
   - Copy colors, fonts, and spacing from the CSS file
   - Use Elementor's controls to match the visual design
5. For images:
   - Upload the images from the `images/` folder to the WordPress Media Library
   - Replace image references in the Elementor elements
6. For interactive elements:
   - Use Elementor's built-in form widget instead of the static form
   - Implement the language switcher using a multilingual plugin (WPML or Polylang)

## Key Design Elements

### Color Palette

- Primary: #0066b3 (Blue)
- Primary Dark: #00508a
- Primary Darker: #003b66
- Accent: #ff6b35 (Orange)
- Light Background: #f7f9fc
- Text Dark: #2e3440
- Text Medium: #6e7a94

### Typography

- Headings: Inter (Bold)
- Body: Roboto (Regular, Light)

## Content Assets

All product images are included in the `images/` folder with their original filenames. The company logo is available as "Geometric Design Logo for MetaNord (3).png" and can be used for both the header logo and favicon.

## Contact

For any questions about this template, please contact MetaNord OÜ:
- Email: info@metanord.eu
- Website: www.metanord.eu