import i18n from 'i18next';

// List of all supported languages
export const SUPPORTED_LANGUAGES = ['en', 'et', 'ru', 'lv', 'lt', 'pl', 'zh-CN'];

// Key sections to verify across all languages
export const CRITICAL_SECTIONS = [
  'header',
  'footer',
  'hero',
  'navigation',
  'products',
  'contact',
  'documents',
  'projects',
  'about',
  'services',
  'search',
  'common'
];

// Common UI elements that should be translated in all languages
export const COMMON_UI_ELEMENTS = [
  'navigation.home',
  'navigation.products',
  'navigation.services',
  'navigation.about',
  'navigation.contact',
  'header.getQuote',
  'header.requestQuote',
  'header.getPrice',
  'header.requestCallback',
  'products.requestQuote',
  'products.viewDetails',
  'products.downloadCatalog',
  'footer.newsletter.button',
  'footer.links.title',
  'footer.resources.title',
  'footer.products.title',
  'footer.legal.copyright',
  'footer.legal.privacy',
  'footer.legal.terms',
  'footer.legal.cookies',
  'hero.cta',
  'hero.learnMore'
];

/**
 * Verifies if a key exists and has proper translation in a given language
 * @param key The translation key to check
 * @param lang The language code to check
 * @returns Object with verification result
 */
export function verifyTranslation(key: string, lang: string): { 
  exists: boolean; 
  value: string | null;
  fallbackValue: string | null;
  isComplete: boolean;
} {
  try {
    // Check if the translation exists directly
    const hasKey = i18n.exists(key, { lng: lang });
    
    // Get the actual translation value
    const value = i18n.t(key, { lng: lang });
    
    // Get the fallback (English) value for comparison
    const fallbackValue = i18n.t(key, { lng: 'en' });
    
    // Check if it's the same as the key (missing translation)
    const isKeyValue = value === key;
    
    // Check if it's the same as English (not translated)
    const isSameAsEnglish = value === fallbackValue && lang !== 'en';
    
    return {
      exists: hasKey && !isKeyValue,
      value: hasKey ? value : null,
      fallbackValue,
      isComplete: hasKey && !isKeyValue && !isSameAsEnglish
    };
  } catch (e) {
    console.error(`Error verifying translation for key ${key} in ${lang}:`, e);
    return {
      exists: false,
      value: null,
      fallbackValue: null,
      isComplete: false
    };
  }
}

/**
 * Runs a full audit of translations for a specific language
 * @param lang The language code to audit
 * @returns Audit results
 */
export function auditLanguage(lang: string) {
  const results = {
    language: lang,
    criticalSections: {} as Record<string, boolean>,
    commonElements: {} as Record<string, boolean>,
    missingKeys: [] as string[],
    totalMissing: 0
  };
  
  // Check critical sections
  CRITICAL_SECTIONS.forEach(section => {
    try {
      const sectionData = i18n.t(section, { lng: lang, returnObjects: true });
      results.criticalSections[section] = Boolean(sectionData && typeof sectionData === 'object');
      
      if (!results.criticalSections[section]) {
        results.missingKeys.push(section);
        results.totalMissing++;
      }
    } catch (e) {
      results.criticalSections[section] = false;
      results.missingKeys.push(section);
      results.totalMissing++;
    }
  });
  
  // Check common UI elements
  COMMON_UI_ELEMENTS.forEach(element => {
    const { isComplete } = verifyTranslation(element, lang);
    results.commonElements[element] = isComplete;
    
    if (!isComplete) {
      results.missingKeys.push(element);
      results.totalMissing++;
    }
  });
  
  return results;
}

/**
 * Run a comprehensive audit across all languages
 * @returns Audit results for all languages
 */
export function auditAllLanguages() {
  return SUPPORTED_LANGUAGES.map(lang => auditLanguage(lang));
}

/**
 * Check specific key across all languages and report issues
 * @param key Translation key to check
 * @returns Verification results by language
 */
export function verifyKeyAcrossLanguages(key: string) {
  return SUPPORTED_LANGUAGES.reduce((results, lang) => {
    results[lang] = verifyTranslation(key, lang);
    return results;
  }, {} as Record<string, ReturnType<typeof verifyTranslation>>);
}

/**
 * Logs comprehensive translation audit to console
 */
export function logTranslationAudit() {
  console.group('🔍 TRANSLATION AUDIT REPORT');
  
  const results = auditAllLanguages();
  
  // Sort languages by completion rate
  const sortedResults = [...results].sort((a, b) => a.totalMissing - b.totalMissing);
  
  // Log summary table
  console.table(sortedResults.map(r => ({
    language: r.language,
    missingCount: r.totalMissing,
    completionRate: `${Math.round(100 * (1 - r.totalMissing / (CRITICAL_SECTIONS.length + COMMON_UI_ELEMENTS.length)))}%`
  })));
  
  // Log detailed results for each language
  sortedResults.forEach(result => {
    const { language, missingKeys } = result;
    
    if (missingKeys.length > 0) {
      console.group(`🚨 Issues in ${language} (${missingKeys.length} problems)`);
      
      // Group missing keys by section
      const groupedMissing = missingKeys.reduce((groups, key) => {
        const section = key.split('.')[0];
        if (!groups[section]) groups[section] = [];
        groups[section].push(key);
        return groups;
      }, {} as Record<string, string[]>);
      
      // Log grouped missing keys
      Object.entries(groupedMissing).forEach(([section, keys]) => {
        console.group(`${section} section (${keys.length} issues)`);
        keys.forEach(key => {
          const verification = verifyTranslation(key, language);
          console.log(`Key: ${key}`);
          console.log(`  Exists: ${verification.exists ? '✅' : '❌'}`);
          console.log(`  Value: ${verification.value || 'null'}`);
          console.log(`  English: ${verification.fallbackValue || 'null'}`);
          console.log(`  Complete: ${verification.isComplete ? '✅' : '❌'}`);
        });
        console.groupEnd();
      });
      
      console.groupEnd();
    } else {
      console.log(`✅ ${language} - All keys translated`);
    }
  });
  
  console.groupEnd();
}