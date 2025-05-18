/**
 * Unified Product Loader
 * 
 * A centralized, optimized product data handling system that:
 * - Provides efficient caching
 * - Handles batch loading for better performance
 * - Optimizes language-specific product data
 * - Consolidates multiple similar functions into a single system
 */

import { safeTranslate } from "@/i18n";

// Global product cache for faster retrieval
const productCache: Record<string, any> = {};

/**
 * Get product data with built-in caching
 * 
 * @param productId Product identifier
 * @param language Current language code
 * @returns Product data object
 */
export function getProductData(productId: string, language: string): any {
  // Create cache key based on product ID and language
  const cacheKey = `${productId}-${language}`;
  
  // Return from cache if available
  if (productCache[cacheKey]) {
    return productCache[cacheKey];
  }
  
  // Get product title with safe translation fallback
  const title = safeTranslate(`products.${productId}.title`, productId.split('-').join(' '));
  
  // Get product description
  const description = safeTranslate(`products.${productId}.description`, 'Product details coming soon.');
  
  // Determine product category
  let category = 'other';
  if (productId.includes('profiles')) category = 'aluminum';
  if (productId.includes('pipes') && !productId.includes('hsaw') && !productId.includes('oil-gas')) category = 'polyethylene';
  if (productId.includes('hsaw') || productId.includes('oil-gas')) category = 'steel';
  if (productId.includes('manhole') || productId.includes('grates') || productId.includes('drainage') || productId.includes('grill')) category = 'cast-iron';
  
  // Get features, applications, and specifications if available
  const features = [];
  for (let i = 1; i <= 5; i++) {
    const featureKey = `products.${productId}.features.${i}`;
    const feature = safeTranslate(featureKey, '');
    if (feature) features.push(feature);
  }
  
  const applications = [];
  for (let i = 1; i <= 5; i++) {
    const appKey = `products.${productId}.applications.${i}`;
    const application = safeTranslate(appKey, '');
    if (application) applications.push(application);
  }
  
  const specifications: Record<string, string> = {};
  const specKeys = ['material', 'dimensions', 'standards', 'coating', 'weight'];
  
  specKeys.forEach(key => {
    const specKey = `products.${productId}.specifications.${key}`;
    const spec = safeTranslate(specKey, '');
    if (spec) specifications[key] = spec;
  });
  
  // Build the complete product data object
  const productData = {
    id: productId,
    title,
    description,
    category,
    features,
    applications,
    specifications
  };
  
  // Cache for future use
  productCache[cacheKey] = productData;
  
  // Log successful translation for debugging
  if (title !== productId.split('-').join(' ')) {
    console.log(`Found translation for ${productId} in ${language}`);
  }
  
  // Special handling for Chinese translations
  if (language === 'zh-CN' && title !== productId.split('-').join(' ')) {
    console.log(`Enhanced Chinese translation for product: ${productId}`);
  }
  
  return productData;
}

/**
 * Load products in batches to improve UI responsiveness
 * 
 * @param productIds Array of product IDs to load
 * @param language Current language code
 * @param batchSize Number of products to process in each batch
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
    
    // Use requestAnimationFrame for smoother UI
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => processBatch());
    } else {
      setTimeout(processBatch, 10);
    }
  };
  
  processBatch();
}

/**
 * Get products filtered by category
 * 
 * @param category Category to filter by
 * @param productIds All available product IDs
 * @returns Filtered product IDs
 */
export function getProductsByCategory(category: string, productIds: string[]): string[] {
  if (category === 'all') {
    return productIds;
  }
  
  // Log the filtering process for debugging
  console.log(`Filtering products: active category = ${category}`);
  
  const filtered = productIds.filter(id => {
    switch(category) {
      case 'aluminum':
        return id.includes('profiles');
      case 'polyethylene':
        return id.includes('pipes') && !id.includes('hsaw') && !id.includes('oil-gas');
      case 'steel':
        return id.includes('hsaw') || id.includes('oil-gas');
      case 'cast-iron':
        return id.includes('manhole') || id.includes('grates') || id.includes('drainage') || id.includes('grill');
      default:
        return true;
    }
  });
  
  console.log(`Products filtered: ${filtered.length} items`);
  return filtered;
}

/**
 * Preload a batch of product data proactively
 * 
 * @param productIds Products to preload
 * @param language Current language
 */
export function preloadProductData(productIds: string[], language: string): void {
  // Only preload a few critical products for optimal performance
  const criticalProducts = productIds.slice(0, 4);
  
  criticalProducts.forEach(id => {
    const cacheKey = `${id}-${language}`;
    if (!productCache[cacheKey]) {
      // Load in the background
      setTimeout(() => {
        getProductData(id, language);
      }, 0);
    }
  });
}

/**
 * Translate product category names
 * 
 * @param category The category to translate
 * @param language Current language
 * @returns Translated category name
 */
export function translateCategory(category: string, language: string): string {
  console.log(`Attempting to translate product category: ${category} in language: ${language}`);
  
  const key = `products.categories.${category}`;
  const translated = safeTranslate(key, category);
  
  if (translated !== category) {
    console.log(`Translating category "${category}" to "${translated}" in language ${language}`);
  }
  
  return translated;
}

/**
 * Clear product cache for specific language or all languages
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