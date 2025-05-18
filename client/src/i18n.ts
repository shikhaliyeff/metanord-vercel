import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import en from "./locales/en.json";
import et from "./locales/et.json";
import ru from "./locales/ru.json";
import lv from "./locales/lv.json";
import lt from "./locales/lt.json";
import pl from "./locales/pl.json";
import zhCN from "./locales/zh-CN.json";

// Import additional Chinese translations for deep merging
// These imports are not needed anymore since we merged all translations
// into the main zh-CN.json file using our fix script
// Left here for documentation purposes
// import zhCNAdditions from "./locales/zh-CN-additions.json";
// import zhCNCompleteUpdate from "./locales/zh-CN-complete-update.json";

// Log translation resource loading for debugging
console.log("Loading i18n resources...");

// Import optimizations using relative path
import { 
  cachedTranslate, 
  setupI18nOptimization, 
  preloadCommonTranslations 
} from './i18n-optimizations';

// Translation cache for better performance
const translationCache = new Map<string, string>();

// Initialize i18next with performance optimizations
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: "en",
    // Debug in development (reduce to improve performance)
    debug: false,
    // Resources containing translations
    resources: {
      en: { 
        translation: {
          ...en,
          products: {
            ...en.products,
            filter: {
              all: "All Products",
              aluminum: "Aluminum",
              polyethylene: "Polyethylene",
              steel: "Steel",
              castIron: "Cast Iron"
            },
            castIron: {
              ...en.products?.castIron,
              drainageGrates: {
                title: "Drainage Grates",
                description: "Cast iron drainage grates for stormwater collection systems, designed for varying traffic loads and flow capacities."
              }
            },
            categories: {
              ...en.products?.categories,
              "Cast Iron": "Cast Iron"
            }
          },
          common: {
            ...en.common,
            learnMore: "Learn More",
            viewDetails: "View Details"
          },
          header: {
            ...en.header,
            getPrice: "Request Quote",
            requestCallback: "Request Callback"
          }
        } 
      },
      et: { translation: et },
      ru: { translation: ru },
      lv: { translation: lv },
      lt: { translation: lt },
      pl: { translation: pl },
      "zh-CN": { translation: zhCN },
    },
    // Common options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Enable access to nested translation objects when needed
    returnObjects: true,
    // Performance optimization - disable async initialization for better reliability on mobile
    initImmediate: false,
    // Use all languages for more reliable loading
    load: 'all', // Load all languages upfront to prevent freeze issues
    // Remember language selection
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    // Fall back to English by default
    fallbackNS: false,
    // Minimize logging for better performance
    saveMissing: false,
    saveMissingTo: "fallback", // Save missing keys only to fallback language
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Missing translation key: "${key}" for languages: ${lngs.join(', ')}`);
      }
    },
    // Performance optimizations
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
  });

// Log when i18n is ready
i18n.on('initialized', () => {
  console.log('i18n initialized successfully');
  
  // Set up optimizations after initialization
  setupI18nOptimization();
});

// Optimized language switching performance
i18n.on('languageChanged', (lng) => {
  // Minimal logging to reduce performance impact
  console.log(`Language changed to: ${lng}`);
  
  // Add transition class for smoother language switching
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    document.documentElement.classList.add('lang-transition');
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('lang-transition');
    }, 300);
  }
  
  // Prevent UI freezing during language change
  try {
    if (typeof window !== 'undefined') {
      // Process translations in the background
      setTimeout(() => {
        // Critical navigation translations
        const criticalKeys = [
          'header.home', 'header.products', 'header.services', 'header.about', 'header.contact',
          'products.filter.all', 'products.filter.aluminum', 'products.filter.polyethylene', 
          'products.filter.steel', 'products.filter.castIron',
          // Additional critical keys for complete UI translation
          'hero.title', 'hero.subtitle', 'hero.tagline', 'hero.learnMore', 'hero.productTitle',
          'features.title', 'features.subtitle',
          'features.quality.title', 'features.competitive.title', 
          'features.reliability.title', 'features.expertise.title',
          'footer.description', 'footer.products.title', 'footer.links.title', 'footer.resources.title',
          'contact.form.title', 'contact.form.name', 'contact.form.email', 'contact.form.message',
          'contact.form.submitButton', 'about.mission.title', 'about.vision.title'
        ];
        
        // Cache critical translations for instant access
        for (const key of criticalKeys) {
          const cacheKey = `${lng}:${key}:{}`;
          if (!translationCache.has(cacheKey)) {
            translationCache.set(cacheKey, i18n.t(key, { lng }));
          }
        }
        
        // Load secondary translations after a small delay
        setTimeout(() => {
          const secondaryKeys = [
            'products.categories.aluminum', 'products.categories.polyethylene',
            'products.categories.steel', 'products.categories.castIron',
            'products.standard-profiles.title', 'products.hdpe-pipes.title',
            'products.manhole-covers.title', 'products.drainage-grates.title',
            'faq.title', 'faq.description'
          ];
          
          for (const key of secondaryKeys) {
            const cacheKey = `${lng}:${key}:{}`;
            if (!translationCache.has(cacheKey)) {
              translationCache.set(cacheKey, i18n.t(key, { lng }));
            }
          }
        }, 50);
      }, 0);
    }
  } catch (e) {
    // Fail silently to ensure UI remains responsive
    console.log("Language change optimization failed silently");
  }
});

// High-performance safe translation function with caching
export function safeTranslate(key: string, defaultValue: string = '', options: any = {}): string {
  // Create cache key from combination of language, key and options
  const cacheKey = `${i18n.language}:${key}:${JSON.stringify(options)}`;
  
  // Check cache first for instant retrieval
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey) as string;
  }
  
  // Fallback language order (current language first, then English)
  const languageOrder = [i18n.language, 'en'];
  let result: string = defaultValue || key;

  // Try each language in order
  for (const lng of languageOrder) {
    try {
      // Use getFixedT for better performance than t()
      const translated = i18n.getFixedT(lng)(key, { ...options, defaultValue: null });
      if (translated && typeof translated === 'string' && translated !== key) {
        result = translated;
        break; // Exit loop on first successful translation
      }
    } catch (error) {
      // Minimize console outputs in production for better performance
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Translation warning for key "${key}" in language "${lng}":`, error);
      }
    }
  }
  
  // If nothing found yet, try one last time with the global t function
  if (result === key || result === defaultValue) {
    try {
      const translated = i18n.t(key, { defaultValue, returnObjects: false });
      if (typeof translated === 'string' && translated !== key) {
        result = translated;
      }
    } catch (error) {
      // Silent error in production
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Translation error for key "${key}":`, error);
      }
    }
  }
  
  // Cache the result for future use
  translationCache.set(cacheKey, result);
  
  return result;
}

// Optimized category translation for all formats
export const translateProductCategory = (category: string): string => {
  try {
    // Safety check for null/undefined input
    if (!category) {
      return "Other";
    }
    
    // Minimal debug logging
    console.log(`Attempting to translate product category: ${category} in language: ${i18n.language}`);

    // Direct translations by language
    const translations: Record<string, Record<string, string>> = {
      // Lithuanian translations
      'lt': {
        "aluminum": "Aliuminis",
        "Aluminum": "Aliuminis",
        "polyethylene": "Polietilenas",
        "Polyethylene": "Polietilenas",
        "steel": "Plienas",
        "Steel": "Plienas",
        "cast-iron": "Ketaus",
        "cast_iron": "Ketaus",
        "castIron": "Ketaus",
        "Cast Iron": "Ketaus",
        "Fittings": "Jungtys",
        "fittings": "Jungtys"
      },
      // Russian translations
      'ru': {
        "aluminum": "Алюминий",
        "Aluminum": "Алюминий",
        "polyethylene": "Полиэтилен",
        "Polyethylene": "Полиэтилен",
        "steel": "Сталь",
        "Steel": "Сталь",
        "cast-iron": "Чугун",
        "cast_iron": "Чугун",
        "castIron": "Чугун",
        "Cast Iron": "Чугун",
        "Fittings": "Фитинги",
        "fittings": "Фитинги"
      },
      // Estonian translations
      'et': {
        "aluminum": "Alumiinium",
        "Aluminum": "Alumiinium",
        "polyethylene": "Polüetüleen",
        "Polyethylene": "Polüetüleen",
        "steel": "Teras",
        "Steel": "Teras",
        "cast-iron": "Malm",
        "cast_iron": "Malm",
        "castIron": "Malm",
        "Cast Iron": "Malm",
        "Fittings": "Liitmikud",
        "fittings": "Liitmikud"
      },
      // Latvian translations
      'lv': {
        "aluminum": "Alumīnijs",
        "Aluminum": "Alumīnijs",
        "polyethylene": "Polietilēns",
        "Polyethylene": "Polietilēns",
        "steel": "Tērauds",
        "Steel": "Tērauds",
        "cast-iron": "Čuguns",
        "cast_iron": "Čuguns",
        "castIron": "Čuguns",
        "Cast Iron": "Čuguns",
        "Fittings": "Cauruļu veidgabali",
        "fittings": "Cauruļu veidgabali"
      },
      // Polish translations
      'pl': {
        "aluminum": "Aluminium",
        "Aluminum": "Aluminium",
        "polyethylene": "Polietylen",
        "Polyethylene": "Polietylen",
        "steel": "Stal",
        "Steel": "Stal",
        "cast-iron": "Żeliwo",
        "cast_iron": "Żeliwo",
        "castIron": "Żeliwo",
        "Cast Iron": "Żeliwo",
        "Fittings": "Złączki",
        "fittings": "Złączki"
      },
      // Chinese translations
      'zh-CN': {
        "aluminum": "铝材",
        "Aluminum": "铝材",
        "polyethylene": "聚乙烯",
        "Polyethylene": "聚乙烯",
        "steel": "钢铁",
        "Steel": "钢铁",
        "cast-iron": "铸铁",
        "cast_iron": "铸铁",
        "castIron": "铸铁",
        "Cast Iron": "铸铁",
        "Fittings": "管道配件",
        "fittings": "管道配件"
      },
      // English (default) translations
      'en': {
        "aluminum": "Aluminum",
        "Aluminum": "Aluminum",
        "polyethylene": "Polyethylene",
        "Polyethylene": "Polyethylene",
        "steel": "Steel",
        "Steel": "Steel",
        "cast-iron": "Cast Iron",
        "cast_iron": "Cast Iron",
        "castIron": "Cast Iron",
        "Cast Iron": "Cast Iron",
        "Fittings": "Fittings",
        "fittings": "Fittings"
      }
    };
    
    // Check for direct translations in current language
    if (translations[i18n.language] && translations[i18n.language][category]) {
      return translations[i18n.language][category];
    }
    
    // Try translation lookup with different formats
    const formats = [
      `products.categories.${category}`,                          // Original format
      `products.categories.${category.toLowerCase()}`,            // Lowercase
      `products.categories.${category.replace(/[- ]/g, '_')}`,   // Convert to snake_case
      `products.categories.${category.replace(/[_ ]/g, '-')}`,   // Convert to kebab-case
      `product.categories.${category.toLowerCase()}`              // Alternative namespace
    ];
    
    // Try each format
    for (const format of formats) {
      const translated = i18n.t(format, { lng: i18n.language });
      if (translated && translated !== format) {
        console.log(`Found translation for ${category} in ${i18n.language}`);
        return translated;
      }
    }
    
    // Special case logging for Chinese
    if (i18n.language === 'zh-CN') {
      console.log(`Enhanced Chinese translation for product: ${category}`);
    }
    
    // Fallback to English if needed
    if (i18n.language !== 'en' && translations['en']) {
      const englishKey = Object.keys(translations['en'])
        .find(key => key.toLowerCase() === category.toLowerCase());
        
      if (englishKey) {
        console.log(`Using English fallback for: ${category} in ${i18n.language}`);
        return translations['en'][englishKey];
      }
    }
    
    // Last resort: return the original with proper capitalization
    const words = category.split(/[-_ ]/);
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    
    const finalResult = capitalizedWords.join(' ');
    console.log(`Translating category "${category}" to "${finalResult}" in language ${i18n.language}`);
    
    return finalResult;
  } catch (error) {
    console.error("Error in translateProductCategory:", error);
    return category; // In case of error, return original
  }
};

export default i18n;