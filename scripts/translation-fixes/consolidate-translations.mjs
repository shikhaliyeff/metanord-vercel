/**
 * Translation Consolidation Script
 * 
 * This script consolidates multiple translation files into a single unified file
 * for each language, with special focus on Chinese (zh-CN) which has multiple
 * fragmented files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const LOCALES_DIR = path.join(__dirname, 'client/src/locales');
const BACKUP_DIR = path.join(__dirname, 'backups/translations');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// List of Chinese translation files to consolidate
const CHINESE_FILES = [
  'zh-CN.json',
  'zh-CN-additions.json',
  'zh-CN-complete-update.json',
  'zh-CN-unified.json',
  'zh-CN-updates.json',
  'direct-zh-CN-fix.json'
];

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
 * Consolidate Chinese translation files
 */
function consolidateChineseTranslations() {
  console.log('Starting Chinese translation consolidation...');
  
  // Create backup of current zh-CN.json
  const mainZhFile = path.join(LOCALES_DIR, 'zh-CN.json');
  const backupZhFile = path.join(BACKUP_DIR, 'zh-CN.json.bak');
  fs.copyFileSync(mainZhFile, backupZhFile);
  console.log('Created backup of zh-CN.json');
  
  // Read main Chinese translations
  let mainTranslations = JSON.parse(fs.readFileSync(mainZhFile, 'utf8'));
  
  // Merge with each additional file
  CHINESE_FILES.slice(1).forEach(filename => {
    const filePath = path.join(LOCALES_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        const additionalTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Merging translations from ${filename}...`);
        mainTranslations = deepMerge(mainTranslations, additionalTranslations);
      } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
      }
    } else {
      console.log(`File ${filename} not found, skipping...`);
    }
  });
  
  // Write consolidated translations back to main file
  fs.writeFileSync(mainZhFile, JSON.stringify(mainTranslations, null, 2), 'utf8');
  console.log('Successfully consolidated Chinese translations into zh-CN.json');
}

/**
 * Create consolidated master translation script file
 */
function createMasterTranslationScript() {
  console.log('Creating master translation update script...');
  
  const scriptContent = `/**
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
  console.log(\`Adding translations to \${language}...\`);
  
  const filePath = path.join(LOCALES_DIR, \`\${language}.json\`);
  
  if (fs.existsSync(filePath)) {
    // Read existing translations
    const existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge with new translations
    const updatedTranslations = deepMerge(existingTranslations, translations);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    console.log(\`Updated \${language} translations successfully\`);
  } else {
    console.error(\`Language file \${language}.json not found\`);
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
    const filePath = path.join(LOCALES_DIR, \`\${lang}.json\`);
    if (fs.existsSync(filePath)) {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      console.error(\`Language file \${lang}.json not found\`);
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
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    
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
`;
  
  const scriptPath = path.join(__dirname, 'master-translation-update.mjs');
  fs.writeFileSync(scriptPath, scriptContent, 'utf8');
  console.log('Created master translation update script at master-translation-update.mjs');
}

// Run the consolidation
(function main() {
  consolidateChineseTranslations();
  createMasterTranslationScript();
  console.log('Translation consolidation completed successfully!');
})();