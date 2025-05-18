import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Chinese translation file
const zhCNPath = path.join(__dirname, 'client/src/locales/zh-CN.json');
const directFixPath = path.join(__dirname, 'client/src/locales/direct-zh-CN-fix.json');

function updateChineseTranslations() {
  console.log('Starting direct Chinese translation update...');
  
  try {
    // Read the current Chinese translations
    const zhCN = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    const directFix = JSON.parse(fs.readFileSync(directFixPath, 'utf8'));
    
    // Merge the translations with priority to the direct fix values
    const updatedTranslations = deepMerge(zhCN, directFix);
    
    // Write the updated translations back to the file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log('Successfully updated Chinese translations');
  } catch (error) {
    console.error('Error updating Chinese translations:', error);
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

// Run the update
updateChineseTranslations();