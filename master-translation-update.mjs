/**
 * Master Translation Update Script
 * 
 * This consolidated script replaces multiple individual translation scripts
 * and provides a unified way to update and manage translations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to locales directory
const LOCALES_DIR = path.join(__dirname, 'client/src/locales');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'et', 'ru', 'lv', 'lt', 'pl', 'zh-CN'];

// Base language for reference
const BASE_LANGUAGE = 'en';

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Helper function to check if value is an object
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Add translations to a specific language
 * @param {string} language Language code
 * @param {object} translations Translations to add
 */
function addTranslations(language, translations) {
  console.log(`Adding translations to ${language}...`);
  
  const filePath = path.join(LOCALES_DIR, `${language}.json`);
  
  if (fs.existsSync(filePath)) {
    // Read existing translations
    const existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge with new translations
    const updatedTranslations = deepMerge(existingTranslations, translations);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    console.log(`Updated ${language} translations successfully`);
  } else {
    console.error(`Language file ${language}.json not found`);
  }
}

/**
 * Find missing translation keys in all languages
 */
function findMissingTranslations() {
  console.log('Analyzing translation completeness...');
  
  // Load all language files
  const translations = {};
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      console.error(`Language file ${lang}.json not found`);
      translations[lang] = {};
    }
  });
  
  // Extract all keys from the base language
  const baseKeys = extractKeys(translations[BASE_LANGUAGE]);
  
  // Find missing keys in each language
  const missingTranslations = {};
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (lang === BASE_LANGUAGE) return;
    
    const langKeys = extractKeys(translations[lang]);
    const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missingKeys.length > 0) {
      missingTranslations[lang] = {
        count: missingKeys.length,
        keys: missingKeys
      };
    }
  });
  
  console.log('Missing translations analysis:');
  console.log(JSON.stringify(missingTranslations, null, 2));
  
  return missingTranslations;
}

/**
 * Extract all keys from an object (recursively)
 */
function extractKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (isObject(obj[key])) {
      keys = [...keys, ...extractKeys(obj[key], fullKey)];
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Run analysis if script is executed directly
findMissingTranslations();
