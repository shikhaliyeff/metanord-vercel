/**
 * i18n Performance Optimizations
 * 
 * This module provides functions to optimize i18n loading and usage
 * without modifying the core i18n setup.
 */

import i18n from 'i18next';

// Cache for translated strings to avoid redundant lookups
const translationCache: Record<string, Record<string, string>> = {};

/**
 * Get a translated string with caching
 * 
 * @param key Translation key
 * @param fallback Fallback text if key is missing
 * @param language Optional language override
 * @returns Translated string
 */
export function cachedTranslate(
  key: string,
  fallback: string = '',
  language?: string
): string {
  // Use current language if not specified
  const currentLang = language || i18n.language;
  
  // Initialize language cache if needed
  if (!translationCache[currentLang]) {
    translationCache[currentLang] = {};
  }
  
  // Return from cache if available
  if (translationCache[currentLang][key] !== undefined) {
    return translationCache[currentLang][key];
  }
  
  // Get translation
  const translation = i18n.t(key, { lng: currentLang, defaultValue: fallback });
  
  // Cache result
  translationCache[currentLang][key] = translation;
  
  return translation;
}

/**
 * Preload translations for common UI elements
 * 
 * @param language Language to preload
 */
export function preloadCommonTranslations(language: string): void {
  const commonKeys = [
    'common.viewDetails',
    'products.loadMore',
    'products.noProducts',
    'products.endOfResults',
    'nav.home',
    'nav.products',
    'nav.about',
    'nav.services',
    'nav.contact',
    'footer.copyright',
    'footer.allRightsReserved'
  ];
  
  // Preload each key
  commonKeys.forEach(key => {
    cachedTranslate(key, '', language);
  });
  
  console.log(`Preloaded ${commonKeys.length} common translations for ${language}`);
}

/**
 * Clear translation cache for specific language
 * 
 * @param language Optional language to clear (all if not specified)
 */
export function clearTranslationCache(language?: string): void {
  if (language) {
    // Clear specific language
    delete translationCache[language];
  } else {
    // Clear all languages
    Object.keys(translationCache).forEach(lang => {
      delete translationCache[lang];
    });
  }
}

/**
 * Get translation status for logging/debugging
 */
export function getTranslationStatus(): {
  languagesLoaded: string[],
  cachedKeys: Record<string, number>,
  activeLanguage: string
} {
  const languagesWithCache = Object.keys(translationCache);
  const cachedKeys: Record<string, number> = {};
  
  languagesWithCache.forEach(lang => {
    cachedKeys[lang] = Object.keys(translationCache[lang]).length;
  });
  
  return {
    languagesLoaded: languagesWithCache,
    cachedKeys,
    activeLanguage: i18n.language
  };
}

/**
 * Register i18n change listener to clear caches on language change
 */
export function setupI18nOptimization(): void {
  // Event handler for language change
  const handleLanguageChanged = (newLanguage: string) => {
    // Clear cache for all languages except the new one to save memory
    Object.keys(translationCache).forEach(lang => {
      if (lang !== newLanguage) {
        delete translationCache[lang];
      }
    });
    
    // Preload common translations for the new language
    preloadCommonTranslations(newLanguage);
    
    console.log(`Language changed to: ${newLanguage}`);
  };
  
  // Listen for language change
  i18n.on('languageChanged', handleLanguageChanged);
  
  // Preload initial language
  preloadCommonTranslations(i18n.language);
  
  console.log('i18n optimization initialized');
}