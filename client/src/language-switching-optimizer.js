/**
 * Language Switching Performance Optimization
 * 
 * This module provides enhanced performance when switching languages by:
 * 1. Preserving scroll position
 * 2. Eliminating visible UI flickering
 * 3. Optimizing translation loading to minimize lag
 */

import i18n from 'i18next';

// Store the current scroll position before language change
let savedScrollPosition = 0;

// Track language change in progress
let isChangingLanguage = false;

/**
 * Optimize language switching performance
 */
export function initLanguageSwitchingOptimizations() {
  // Apply optimizations when i18n is initialized
  if (i18n.isInitialized) {
    setupLanguageSwitchingOptimizations();
  } else {
    i18n.on('initialized', () => {
      setupLanguageSwitchingOptimizations();
    });
  }
}

/**
 * Set up all language switching optimizations
 */
function setupLanguageSwitchingOptimizations() {
  // Listen for language change events
  i18n.on('languageChanged', (lng) => {
    if (isChangingLanguage) return;
    
    try {
      isChangingLanguage = true;
      
      // Add transition class to prevent flickering
      document.documentElement.classList.add('lang-transition');
      document.body.classList.add('lang-switching');
      
      // Save current scroll position
      savedScrollPosition = window.scrollY;
      
      // Preserve scroll behavior during language switch
      document.documentElement.classList.add('preserve-scroll');
      
      // Update language attribute immediately for better accessibility
      document.documentElement.lang = lng;
      
      // Schedule removal of transition class after translations are loaded
      setTimeout(() => {
        document.documentElement.classList.remove('lang-transition');
        document.body.classList.remove('lang-switching');
        document.body.classList.add('lang-switching-complete');
        
        // Restore scroll position
        window.scrollTo(0, savedScrollPosition);
        
        // Re-enable smooth scrolling
        setTimeout(() => {
          document.documentElement.classList.remove('preserve-scroll');
          document.body.classList.remove('lang-switching-complete');
          isChangingLanguage = false;
        }, 300);
      }, 150);
    } catch (error) {
      console.error('Error during language switch optimization:', error);
      
      // Clean up in case of errors
      document.documentElement.classList.remove('lang-transition', 'preserve-scroll');
      document.body.classList.remove('lang-switching', 'lang-switching-complete');
      isChangingLanguage = false;
    }
  });
}

/**
 * Optimized function to change language with improved performance
 * @param {string} languageCode - The language code to switch to
 * @returns {Promise} Promise that resolves when language switch is complete
 */
export async function changeLanguageOptimized(languageCode) {
  if (!languageCode || languageCode === i18n.language) return;
  
  try {
    // Add optimization classes before the change
    document.documentElement.classList.add('lang-transition');
    document.body.classList.add('lang-switching');
    
    // Save scroll position
    savedScrollPosition = window.scrollY;
    
    // Change the language
    await i18n.changeLanguage(languageCode);
    
    // Return a promise that resolves when the language change is complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Restore scroll position
        window.scrollTo(0, savedScrollPosition);
        resolve();
      }, 100);
    });
  } catch (error) {
    console.error('Error changing language:', error);
    
    // Clean up in case of errors
    document.documentElement.classList.remove('lang-transition');
    document.body.classList.remove('lang-switching');
    
    throw error;
  }
}

/**
 * Preload language resources to reduce perceived latency on language switch
 * @param {string} languageCode - The language code to preload
 */
export function preloadLanguage(languageCode) {
  if (!languageCode || languageCode === i18n.language) return;
  
  // Trigger background loading of language resources
  i18n.loadLanguages(languageCode).catch(err => {
    console.error(`Error preloading language ${languageCode}:`, err);
  });
}