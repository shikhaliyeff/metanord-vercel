/**
 * Unified Translation Management System
 * 
 * This script consolidates multiple translation management scripts into a single,
 * comprehensive solution that handles:
 * 
 * 1. Translation file backups
 * 2. Translation completeness analysis
 * 3. Merging and updating translations
 * 4. Fixing Chinese translations
 * 5. Optimizing language switching performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const LOCALES_DIR = path.join(__dirname, 'client/src/locales');
const BACKUP_DIR = path.join(__dirname, 'backups/translations');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'et', 'ru', 'lv', 'lt', 'pl', 'zh-CN'];
const BASE_LANGUAGE = 'en';

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

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
 * Create backup of all translation files
 */
function backupTranslations() {
  console.log('Creating backups of all translation files...');
  
  // Create timestamp for backup folder
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  // Create backup folder
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }
  
  // Backup each language file
  SUPPORTED_LANGUAGES.forEach(lang => {
    const sourcePath = path.join(LOCALES_DIR, `${lang}.json`);
    const destPath = path.join(backupFolder, `${lang}.json`);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Backed up ${lang}.json`);
    } else {
      console.warn(`Warning: ${lang}.json not found for backup`);
    }
  });
  
  console.log(`All translations backed up to ${backupFolder}`);
  return backupFolder;
}

/**
 * Consolidate Chinese translation files
 */
function consolidateChineseTranslations() {
  console.log('Consolidating Chinese translation files...');
  
  // List of Chinese translation files to consolidate
  const chineseFiles = [
    'zh-CN.json',
    'zh-CN-additions.json',
    'zh-CN-complete-update.json',
    'zh-CN-unified.json',
    'zh-CN-updates.json',
    'direct-zh-CN-fix.json'
  ];
  
  // Create backup of current zh-CN.json
  const mainZhFile = path.join(LOCALES_DIR, 'zh-CN.json');
  const backupZhFile = path.join(BACKUP_DIR, 'zh-CN.json.bak');
  fs.copyFileSync(mainZhFile, backupZhFile);
  console.log('Created backup of zh-CN.json');
  
  // Read main Chinese translations
  let mainTranslations = JSON.parse(fs.readFileSync(mainZhFile, 'utf8'));
  
  // Merge with each additional file
  chineseFiles.slice(1).forEach(filename => {
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
  
  // Add extra translations to ensure completion for key sections
  const additionalZhTranslations = {
    "home": {
      "hero": {
        "title": "智能基础设施解决方案",
        "subtitle": "工业金属，工程塑料和铸铁产品",
        "description": "MetaNord OÜ 为现代基础设施提供高质量的铝型材，聚乙烯管道和铸铁产品。我们的产品经过精心设计，以确保持久性和效率。",
        "cta": "探索我们的产品"
      },
      "whyChoose": {
        "title": "为什么选择我们",
        "point1": {
          "title": "质量保证",
          "description": "所有产品都符合国际质量标准"
        },
        "point2": {
          "title": "全球采购",
          "description": "从世界领先的制造商直接采购"
        },
        "point3": {
          "title": "完整解决方案",
          "description": "从咨询到交付的端到端服务"
        },
        "point4": {
          "title": "专业知识",
          "description": "材料科学和基础设施方面的行业领先专家"
        }
      }
    },
    "products": {
      "categories": {
        "all": "所有产品",
        "aluminum": "铝材",
        "polyethylene": "聚乙烯",
        "steel": "钢铁",
        "cast-iron": "铸铁"
      },
      "loadMore": "加载更多产品",
      "endOfResults": "结果已全部显示",
      "noProducts": "此类别中没有找到产品"
    },
    "navigation": {
      "home": "首页",
      "about": "关于我们",
      "products": "产品",
      "documents": "文档",
      "projects": "项目",
      "contact": "联系我们",
      "language": "语言"
    }
  };
  
  // Merge with additional translations
  mainTranslations = deepMerge(mainTranslations, additionalZhTranslations);
  
  // Write consolidated translations back to main file
  fs.writeFileSync(mainZhFile, JSON.stringify(mainTranslations, null, 2), 'utf8');
  console.log('Successfully consolidated Chinese translations into zh-CN.json');
  
  return mainTranslations;
}

/**
 * Analyze translation completeness across all languages
 */
function analyzeTranslationCompleteness() {
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

/**
 * Add or update translations for a specific language
 */
function updateTranslations(language, translations) {
  console.log(`Updating translations for ${language}...`);
  
  const filePath = path.join(LOCALES_DIR, `${language}.json`);
  
  if (fs.existsSync(filePath)) {
    // Read existing translations
    const existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge with new translations
    const updatedTranslations = deepMerge(existingTranslations, translations);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    console.log(`Updated ${language} translations successfully`);
    
    return updatedTranslations;
  } else {
    console.error(`Language file ${language}.json not found`);
    return null;
  }
}

/**
 * Optimize the translations for better performance
 */
function optimizeTranslations() {
  console.log('Optimizing translations for improved performance...');
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    
    if (fs.existsSync(filePath)) {
      // Read translations
      const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Flatten nested structures that are frequently accessed
      if (translations.products && translations.products.categories) {
        // Move categories to top level for faster access during filtering
        translations.productCategories = translations.products.categories;
      }
      
      // Write optimized translations back to file
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
    }
  });
  
  console.log('Translations optimized for performance');
}

/**
 * Main function to run all operations
 */
async function main() {
  // 1. Create backups
  const backupPath = backupTranslations();
  console.log(`Translations backed up to: ${backupPath}`);
  
  // 2. Consolidate Chinese translations
  const consolidatedChinese = consolidateChineseTranslations();
  console.log('Chinese translations consolidated successfully');
  
  // 3. Analyze translation completeness
  const analysisResult = analyzeTranslationCompleteness();
  console.log(`Translation analysis complete. ${Object.keys(analysisResult).length} languages have missing translations.`);
  
  // 4. Optimize translations for performance
  optimizeTranslations();
  console.log('All operations completed successfully!');
}

// Run the main function
main().catch(err => {
  console.error('Error running unified translation manager:', err);
  process.exit(1);
});