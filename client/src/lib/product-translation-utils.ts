/**
 * Product Translation Utilities
 * 
 * This module provides comprehensive translation utilities for product data,
 * ensuring consistent translations across all supported languages.
 */

import i18n from 'i18next';

/**
 * Normalize a product ID or category name to create consistent translation keys
 * @param input The product ID or category name to normalize
 * @returns Normalized string suitable for translation lookup
 */
export const normalizeTranslationKey = (input: string): string => {
  if (!input) return '';
  
  // Replace all symbols with underscores and convert to lowercase
  return input
    .toLowerCase()
    .replace(/[-\s]/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Standardize a category name across languages
 * @param category Raw category name
 * @returns Standardized category name
 */
export const standardizeCategory = (category: string): string => {
  if (!category) return '';
  
  // First check if there's a direct translation using the normalized key
  const normalizedKey = normalizeTranslationKey(category);
  const translationKey = `products.categories.${normalizedKey}`;
  const translated = i18n.t(translationKey);
  
  // If we got a valid translation (not the key itself), return it
  if (translated && translated !== translationKey) {
    return translated;
  }
  
  // Try alternate normalizations
  const alternateKeys = [
    `products.categories.${category.toLowerCase().replace(/[-\s]/g, '')}`,
    `products.categories.${category.toLowerCase().replace(/[-\s_]/g, '')}`,
    `products.filter.${category.toLowerCase().replace(/[-\s_]/g, '')}`,
  ];
  
  for (const key of alternateKeys) {
    const altTranslated = i18n.t(key);
    if (altTranslated && altTranslated !== key) {
      return altTranslated;
    }
  }
  
  // If no translation found, format nicely with title case
  return formatTitleCase(category);
};

/**
 * Format a string in title case
 * @param text Text to format
 * @returns Title-cased text
 */
export const formatTitleCase = (text: string): string => {
  if (!text) return '';
  
  return text
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get a translated product title
 * @param productId Product ID
 * @param defaultTitle Fallback title if translation not found
 * @returns Translated title or formatted default
 */
export const getTranslatedProductTitle = (productId: string, defaultTitle?: string): string => {
  if (!productId) return defaultTitle || '';
  
  // Try specific product translation first
  const translationKey = `products.${productId}.title`;
  const translated = i18n.t(translationKey);
  
  // If valid translation found, return it
  if (translated && translated !== translationKey) {
    console.log(`Found translation for ${productId} in ${i18n.language}`);
    return translated;
  }
  
  // No translation found, use default or format the ID
  console.log(`No translation found for ${productId} in ${i18n.language}, using default`);
  return defaultTitle || formatTitleCase(productId);
};

/**
 * Get a translated product description
 * @param productId Product ID
 * @param defaultDescription Fallback description if translation not found
 * @returns Translated description or formatted default
 */
export const getTranslatedProductDescription = (productId: string, defaultDescription?: string): string => {
  if (!productId) return defaultDescription || '';
  
  // Try specific product translation
  const translationKey = `products.${productId}.description`;
  const translated = i18n.t(translationKey);
  
  // If valid translation found, return it
  if (translated && translated !== translationKey) {
    return translated;
  }
  
  // No translation found, use default
  return defaultDescription || '';
};

/**
 * Get an appropriate default image for a product based on category
 * @param productId Product ID to determine category
 * @returns Path to default image
 */
export const getDefaultImageForCategory = (category: string): string => {
  const normalizedCategory = category?.toLowerCase() || '';
  
  if (normalizedCategory.includes('aluminum') || normalizedCategory.includes('aluminium')) {
    return '/images/products/default-aluminum.jpg';
  } else if (normalizedCategory.includes('steel')) {
    return '/images/products/default-steel.jpg';
  } else if (normalizedCategory.includes('pipe') || normalizedCategory.includes('hdpe') || normalizedCategory.includes('polyethylene')) {
    return '/images/products/default-pipe.jpg';
  } else if (normalizedCategory.includes('iron') || normalizedCategory.includes('cast')) {
    return '/images/products/default-cast-iron.jpg';
  } else if (normalizedCategory.includes('fitting')) {
    return '/images/products/default-fitting.jpg';
  }
  
  // General fallback
  return '/images/products/default-product.jpg';
};