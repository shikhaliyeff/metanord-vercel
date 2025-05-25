import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to translation files
const zhCNPath = path.join(__dirname, 'client/src/locales/zh-CN.json');
const zhCNUpdatesPath = path.join(__dirname, 'client/src/locales/zh-CN-updates.json');

async function mergeTranslations() {
  console.log('Starting translation merge process...');
  
  try {
    // Read the current translation files
    const zhCN = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    const zhCNUpdates = JSON.parse(fs.readFileSync(zhCNUpdatesPath, 'utf8'));
    
    // Merge the translations using deep merge
    const mergedTranslations = deepMerge(zhCN, zhCNUpdates);
    
    // Write the merged translations back to zh-CN.json
    fs.writeFileSync(zhCNPath, JSON.stringify(mergedTranslations, null, 2), 'utf8');
    
    console.log('Successfully merged Chinese translations.');
  } catch (error) {
    console.error('Error merging translations:', error);
  }
}

// Helper function to deeply merge objects
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

// Helper function to check if value is an object
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Run the merge function
mergeTranslations();