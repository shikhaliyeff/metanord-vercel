/**
 * Optimized Product Loading System
 * 
 * This module provides efficient loading mechanisms for product data,
 * with batch processing, caching, and language-specific optimizations.
 */

import { safeTranslate } from "@/i18n";

// Product cache for faster loading
const productCache: Record<string, any> = {};

// Cache the default images for faster retrieval
const defaultImageCache: Record<string, string> = {};

/**
 * Set default image for a product to improve loading performance
 * 
 * @param productId The product ID
 * @param imageSrc The image source URL
 */
export function setDefaultProductImage(productId: string, imageSrc: string): void {
  defaultImageCache[productId] = imageSrc;
}

/**
 * Get a product from cache or translation
 * 
 * @param productId The product ID
 * @param language Current language
 * @returns The product data
 */
export function getProductData(productId: string, language: string): any {
  // Create cache key based on product ID and language
  const cacheKey = `${productId}-${language}`;
  
  // Return from cache if available
  if (productCache[cacheKey]) {
    return productCache[cacheKey];
  }
  
  // Get product title
  const title = safeTranslate(`products.${productId}.title`, productId.split('-').join(' '));
  
  // Get product description
  const description = safeTranslate(`products.${productId}.description`, 'Product details coming soon.');
  
  // Determine product category
  let category = 'other';
  if (productId.includes('profiles')) category = 'aluminum';
  if (productId.includes('pipes')) category = 'polyethylene';
  if (productId.includes('hsaw') || productId.includes('oil-gas')) category = 'steel';
  if (productId.includes('manhole') || productId.includes('grates') || productId.includes('grill')) category = 'cast-iron';
  
  // Get default image if available
  const image = defaultImageCache[productId] || '';
  
  // Build product data
  const productData = {
    id: productId,
    title,
    description,
    category,
    image,
    features: [],
    applications: [],
    specifications: {}
  };
  
  // Cache the product
  productCache[cacheKey] = productData;
  
  return productData;
}

/**
 * Load products in batches to improve performance
 * 
 * @param productIds Array of product IDs to load
 * @param language Current language
 * @param batchSize Size of each batch
 * @param onBatchComplete Callback for when a batch completes
 */
export function loadProductsInBatches(
  productIds: string[], 
  language: string,
  batchSize: number = 3,
  onBatchComplete?: (batchProducts: any[]) => void
): void {
  let processedCount = 0;
  
  const processBatch = () => {
    if (processedCount >= productIds.length) {
      return;
    }
    
    const currentBatch = productIds.slice(processedCount, processedCount + batchSize);
    processedCount += currentBatch.length;
    
    const batchProducts = currentBatch.map(id => getProductData(id, language));
    
    if (onBatchComplete) {
      onBatchComplete(batchProducts);
    }
    
    // Use requestAnimationFrame for better performance
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => processBatch());
    } else {
      setTimeout(processBatch, 10);
    }
  };
  
  processBatch();
}

/**
 * Clear product cache for a specific language or all languages
 * 
 * @param language Optional language to clear cache for
 */
export function clearProductCache(language?: string): void {
  if (language) {
    // Clear only for specific language
    Object.keys(productCache).forEach(key => {
      if (key.endsWith(`-${language}`)) {
        delete productCache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(productCache).forEach(key => {
      delete productCache[key];
    });
  }
}

/**
 * Get products by category
 * 
 * @param category The category to filter by
 * @param productIds All available product IDs
 * @returns Filtered product IDs
 */
export function getProductsByCategory(category: string, productIds: string[]): string[] {
  if (category === 'all') {
    return productIds;
  }
  
  return productIds.filter(id => {
    if (category === 'aluminum' && id.includes('profiles')) return true;
    if (category === 'polyethylene' && id.includes('pipes') && !id.includes('hsaw') && !id.includes('oil-gas')) return true;
    if (category === 'steel' && (id.includes('hsaw') || id.includes('oil-gas'))) return true;
    if (category === 'cast-iron' && (id.includes('manhole') || id.includes('grates') || id.includes('grill'))) return true;
    return false;
  });
}