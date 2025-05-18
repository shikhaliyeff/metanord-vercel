/**
 * Translation Generator Script
 * 
 * This script translates missing keys from English to other supported languages
 * and updates the translation files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported languages
const LANGUAGES = ['en', 'et', 'ru', 'lv', 'lt', 'pl'];
const BASE_LANGUAGE = 'en'; // The reference language
const LOCALES_PATH = path.join(__dirname, 'client/src/locales');

// Translation mapping for recently identified missing keys
const TRANSLATIONS = {
  // Estonian translations (ET)
  'et': {
    'header.solutions': 'Lahendused',
    'header.company': 'Ettevõte',
    'header.projects': 'Projektid',
    'footer.links.projects': 'Projektid',
    'footer.resources.title': 'Ressursid',
    'footer.resources.documents': 'Dokumendid',
    'footer.resources.certifications': 'Sertifikaadid',
    'footer.resources.faq': 'KKK',
    'footer.resources.privacy': 'Privaatsuspoliitika',
    'footer.resources.terms': 'Kasutustingimused',
    'search.tryDifferent': 'Proovi erinevaid otsingusõnu või sirvi kategooriaid',
    'home.keywords': 'alumiiniumprofiilid, infrastruktuuritooted, ehitusmaterjalid, tööstuslikud lahendused, MetaNord, Euroopa tarnijad',
    'products.filter.all': 'Kõik tooted',
    'products.filter.aluminum': 'Alumiinium',
    'products.filter.polyethylene': 'Polüetüleen',
    'products.filter.steel': 'Teras',
    'products.filter.castIron': 'Malm'
  },
  // Russian translations (RU)
  'ru': {
    'header.solutions': 'Решения',
    'header.company': 'Компания',
    'header.projects': 'Проекты',
    'footer.links.projects': 'Проекты',
    'footer.resources.title': 'Ресурсы',
    'footer.resources.documents': 'Документы',
    'footer.resources.certifications': 'Сертификаты',
    'footer.resources.faq': 'FAQ',
    'footer.resources.privacy': 'Политика конфиденциальности',
    'footer.resources.terms': 'Условия использования',
    'search.tryDifferent': 'Попробуйте другие поисковые запросы или просмотрите категории',
    'home.keywords': 'алюминиевые профили, инфраструктурные продукты, строительные материалы, промышленные решения, MetaNord, европейские поставщики',
    'products.filter.all': 'Все продукты',
    'products.filter.aluminum': 'Алюминий',
    'products.filter.polyethylene': 'Полиэтилен',
    'products.filter.steel': 'Сталь',
    'products.filter.castIron': 'Чугун'
  },
  // Latvian translations (LV)
  'lv': {
    'header.solutions': 'Risinājumi',
    'header.company': 'Uzņēmums',
    'header.projects': 'Projekti',
    'footer.links.projects': 'Projekti',
    'footer.resources.title': 'Resursi',
    'footer.resources.documents': 'Dokumenti',
    'footer.resources.certifications': 'Sertifikāti',
    'footer.resources.faq': 'BUJ',
    'footer.resources.privacy': 'Privātuma politika',
    'footer.resources.terms': 'Lietošanas noteikumi',
    'search.tryDifferent': 'Izmēģiniet citus meklēšanas terminus vai pārlūkojiet kategorijas',
    'home.keywords': 'alumīnija profili, infrastruktūras produkti, būvmateriāli, rūpnieciskie risinājumi, MetaNord, Eiropas piegādātāji',
    'products.filter.all': 'Visi produkti',
    'products.filter.aluminum': 'Alumīnijs',
    'products.filter.polyethylene': 'Polietilēns',
    'products.filter.steel': 'Tērauds',
    'products.filter.castIron': 'Čuguns'
  },
  // Lithuanian translations (LT)
  'lt': {
    'header.solutions': 'Sprendimai',
    'header.company': 'Įmonė',
    'header.projects': 'Projektai',
    'footer.links.projects': 'Projektai',
    'footer.resources.title': 'Ištekliai',
    'footer.resources.documents': 'Dokumentai',
    'footer.resources.certifications': 'Sertifikatai',
    'footer.resources.faq': 'DUK',
    'footer.resources.privacy': 'Privatumo politika',
    'footer.resources.terms': 'Naudojimo sąlygos',
    'search.tryDifferent': 'Išbandykite skirtingus paieškos terminus arba naršykite kategorijas',
    'home.keywords': 'aliuminio profiliai, infrastruktūros produktai, statybinės medžiagos, pramoniniai sprendimai, MetaNord, Europos tiekėjai',
    'products.filter.all': 'Visi produktai',
    'products.filter.aluminum': 'Aliuminis',
    'products.filter.polyethylene': 'Polietilenas',
    'products.filter.steel': 'Plienas',
    'products.filter.castIron': 'Ketus'
  },
  // Polish translations (PL)
  'pl': {
    'header.solutions': 'Rozwiązania',
    'header.company': 'Firma',
    'header.projects': 'Projekty',
    'footer.links.projects': 'Projekty',
    'footer.resources.title': 'Zasoby',
    'footer.resources.documents': 'Dokumenty',
    'footer.resources.certifications': 'Certyfikaty',
    'footer.resources.faq': 'FAQ',
    'footer.resources.privacy': 'Polityka prywatności',
    'footer.resources.terms': 'Warunki użytkowania',
    'search.tryDifferent': 'Wypróbuj inne hasła wyszukiwania lub przeglądaj kategorie',
    'home.keywords': 'profile aluminiowe, produkty infrastrukturalne, materiały budowlane, rozwiązania przemysłowe, MetaNord, europejscy dostawcy',
    'products.filter.all': 'Wszystkie produkty',
    'products.filter.aluminum': 'Aluminium',
    'products.filter.polyethylene': 'Polietylen',
    'products.filter.steel': 'Stal',
    'products.filter.castIron': 'Żeliwo'
  }
};

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

// Add proper translations for missing keys
function addMissingTranslations(translations) {
  // Processing the missing keys with their proper translations
  Object.entries(TRANSLATIONS).forEach(([lang, keyMap]) => {
    Object.entries(keyMap).forEach(([key, translation]) => {
      // Only add if it doesn't already exist
      if (!getValueByPath(translations[lang], key)) {
        setValueByPath(translations[lang], key, translation);
        console.log(`Added translation for ${lang.toUpperCase()}: ${key} = "${translation}"`);
      }
    });
  });
  
  return translations;
}

// Save the updated translations
function saveTranslations(translations) {
  console.log('--- Saving Updated Translations ---');
  LANGUAGES.forEach(lang => {
    const filePath = path.join(LOCALES_PATH, `${lang}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(translations[lang], null, 2), 'utf8');
      console.log(`Updated ${lang}.json`);
    } catch (error) {
      console.error(`Error saving ${lang}.json:`, error.message);
    }
  });
}

// Main execution
function main() {
  console.log('=== MetaNord Translation Generator ===');
  console.log(`Adding proper translations for the missing keys in ${LANGUAGES.slice(1).join(', ')} languages`);
  console.log('');
  
  // Load all translations
  const translations = loadTranslations();
  
  // Add proper translations for missing keys
  const updatedTranslations = addMissingTranslations(translations);
  
  // Save the updated translations
  saveTranslations(updatedTranslations);
  
  console.log('');
  console.log('Translation update complete.');
}

// Run the script
main();