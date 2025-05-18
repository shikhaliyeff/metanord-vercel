# ACF Field Groups for MetaNord Theme

This directory contains JSON files for Advanced Custom Fields (ACF) field groups used in the MetaNord theme.

## Importing Field Groups

To import these field groups:

1. Install and activate the Advanced Custom Fields Pro plugin
2. Go to Custom Fields → Tools
3. Select the "Import Field Groups" option
4. Choose the `metanord-acf-field-groups.json` file from this directory
5. Click "Import" to import all field groups

## Auto-sync Feature

This theme utilizes ACF's "Local JSON" feature, which allows for automatic synchronization of field groups. When ACF Pro is active, it will automatically:

1. Load field groups from this directory
2. Show a notification if the field groups need to be synchronized with the database
3. Allow you to sync changes with a single click

## Field Groups Included

The JSON file contains the following field groups:

1. **Company Information** - Company details like name, address, contact information
2. **Social Media** - Social media profile URLs
3. **Hero Section** - Hero section content for the front page
4. **Product Categories** - Product categories display settings
5. **Contact Page Settings** - Contact form shortcode and Google Maps embed

## Adding Custom Field Groups

If you create additional field groups through the WordPress admin interface, they will be automatically saved as JSON files in this directory if ACF Pro is active.

For more information, see the [ACF Documentation on Local JSON](https://www.advancedcustomfields.com/resources/local-json/).