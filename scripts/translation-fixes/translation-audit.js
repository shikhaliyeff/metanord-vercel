/**
 * Translation Audit Script
 * 
 * This script analyzes translation files to find missing keys across
 * all supported languages: EN, ET, RU, LV, LT, PL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported languages
const LANGUAGES = ['en', 'et', 'ru', 'lv', 'lt', 'pl'];
const BASE_LANGUAGE = 'en'; // The reference language with the most complete keys
const LOCALES_PATH = path.join(__dirname, 'client/src/locales');

// Function to recursively find all keys in a translation object
function extractKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively process nested objects
      keys = [...keys, ...extractKeys(obj[key], fullKey)];
    } else {
      // Add leaf key
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Function to get a value from an object using a dot-notation path
function getValueByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  
  return current;
}

// Function to set a value in an object using a dot-notation path
function setValueByPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // If we're at the last part, set the value
    if (i === parts.length - 1) {
      current[part] = value;
      return;
    }
    
    // If the path doesn't exist or isn't an object, create it
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    
    current = current[part];
  }
}

// Load all translation files
function loadTranslations() {
  const translations = {};
  
  LANGUAGES.forEach(lang => {
    try {
      const filePath = path.join(LOCALES_PATH, `${lang}.json`);
      const content = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(content);
    } catch (error) {
      console.error(`Error loading ${lang}.json:`, error.message);
      translations[lang] = {};
    }
  });
  
  return translations;
}

// Find missing keys in each language compared to the base language
function findMissingTranslations(translations) {
  const baseKeys = extractKeys(translations[BASE_LANGUAGE]);
  const missingTranslations = {};
  
  LANGUAGES.forEach(lang => {
    if (lang === BASE_LANGUAGE) return;
    
    const langKeys = extractKeys(translations[lang]);
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length > 0) {
      missingTranslations[lang] = missingKeys.map(key => ({
        key,
        baseValue: getValueByPath(translations[BASE_LANGUAGE], key)
      }));
    }
  });
  
  return missingTranslations;
}

// Count keys in each translation file
function countTranslationKeys(translations) {
  const counts = {};
  
  LANGUAGES.forEach(lang => {
    counts[lang] = extractKeys(translations[lang]).length;
  });
  
  return counts;
}

// Find recent console logs of missing keys
function reportConsoleMissingKeys() {
  console.log('--- Console Reported Missing Keys ---');
  console.log('These are keys that were logged as missing in the browser console:');
  console.log('- header.solutions: "Solutions"');
  console.log('- header.company: "Company"');
  console.log('- header.projects: "Case Studies"');
  console.log('- footer.links.projects: "Case Studies"');
  console.log('- footer.resources.title: "Resources"');
  console.log('- footer.resources.documents: "Documents"');
  console.log('- footer.resources.certifications: "Certifications"');
  console.log('- footer.resources.faq: "FAQ"');
  console.log('- footer.resources.privacy: "Privacy Policy"');
  console.log('- footer.resources.terms: "Terms of Use"');
  console.log('- search.tryDifferent: "Try different search terms or browse categories"');
  console.log('- home.keywords: "aluminum profiles, infrastructure products..."');
  console.log('');
}

// Generate translation fixes for identified console logs
function generateFixesForConsoleLogs(translations) {
  console.log('--- Generating translation fixes for console log issues ---');
  
  const missingConsoleKeys = {
    'header.solutions': 'Solutions',
    'header.company': 'Company',
    'header.projects': 'Case Studies',
    'footer.links.projects': 'Case Studies',
    'footer.resources.title': 'Resources',
    'footer.resources.documents': 'Documents',
    'footer.resources.certifications': 'Certifications',
    'footer.resources.faq': 'FAQ',
    'footer.resources.privacy': 'Privacy Policy',
    'footer.resources.terms': 'Terms of Use',
    'search.tryDifferent': 'Try different search terms or browse categories',
    'home.keywords': 'aluminum profiles, infrastructure products, construction materials, industrial solutions, MetaNord, European suppliers',
    'products.filter.all': 'All Products',
    'products.filter.aluminum': 'Aluminum',
    'products.filter.polyethylene': 'Polyethylene',
    'products.filter.steel': 'Steel',
    'products.filter.castIron': 'Cast Iron'
  };
  
  // Add these missing keys to all translation objects
  LANGUAGES.forEach(lang => {
    if (lang === BASE_LANGUAGE) return;
    
    Object.entries(missingConsoleKeys).forEach(([key, value]) => {
      // Check if the key exists in the English translation
      const baseValue = getValueByPath(translations[BASE_LANGUAGE], key) || value;
      
      // Check if this key is missing in the language
      if (!getValueByPath(translations[lang], key)) {
        console.log(`Missing in ${lang.toUpperCase()}: ${key} = "${baseValue}"`);
        // Add the key to the language's translation object
        setValueByPath(translations[lang], key, baseValue);
      }
    });
  });
  
  return translations;
}

// Main execution
function main() {
  console.log('=== MetaNord Translation Audit ===');
  console.log(`Analyzing translations for languages: ${LANGUAGES.join(', ')}`);
  console.log('');
  
  // Load all translations
  const translations = loadTranslations();
  
  // Count keys
  const counts = countTranslationKeys(translations);
  console.log('--- Translation Key Counts ---');
  Object.entries(counts).forEach(([lang, count]) => {
    console.log(`${lang.toUpperCase()}: ${count} keys`);
  });
  console.log('');
  
  // Find missing translations
  const missingTranslations = findMissingTranslations(translations);
  console.log('--- Missing Translations ---');
  
  let totalMissingKeys = 0;
  
  Object.entries(missingTranslations).forEach(([lang, missing]) => {
    console.log(`${lang.toUpperCase()}: ${missing.length} missing keys`);
    totalMissingKeys += missing.length;
    
    // Log the first 5 missing keys for each language
    if (missing.length > 0) {
      console.log('  Sample of missing keys:');
      missing.slice(0, 5).forEach(({ key, baseValue }) => {
        console.log(`  - ${key}: "${baseValue}"`);
      });
      
      if (missing.length > 5) {
        console.log(`  ... and ${missing.length - 5} more`);
      }
    }
    console.log('');
  });
  
  // Report recently logged missing keys
  reportConsoleMissingKeys();
  
  // Generate fixes for console log issues
  const updatedTranslations = generateFixesForConsoleLogs(translations);
  
  // Save updated translations
  console.log('--- Saving Updated Translations ---');
  LANGUAGES.forEach(lang => {
    const filePath = path.join(LOCALES_PATH, `${lang}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(updatedTranslations[lang], null, 2), 'utf8');
      console.log(`Updated ${lang}.json`);
    } catch (error) {
      console.error(`Error saving ${lang}.json:`, error.message);
    }
  });
  
  console.log('');
  console.log(`Translation audit complete. Found ${totalMissingKeys} total missing keys.`);
}

// Run the script
main();