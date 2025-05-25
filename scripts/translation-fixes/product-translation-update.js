/**
 * Product Translation Update Script
 * 
 * This script adds missing product translations to language files.
 */

import fs from 'fs';
import path from 'path';

// Latvian product translations
const lvProductTranslations = {
  "products.standard-profiles": {
    "title": "Standarta alumīnija profili",
    "description": "Augstas kvalitātes alumīnija profili struktūras, arhitektūras un rūpnieciskiem pielietojumiem"
  },
  "products.machine-building-profiles": {
    "title": "Mašīnbūves profili",
    "description": "Specializēti alumīnija profili, kas izstrādāti mašīnbūvei un automatizācijai"
  },
  "products.led-profiles": {
    "title": "LED profili",
    "description": "Alumīnija profili LED apgaismojumam ar integrētām gaismas difūzijas opcijām"
  },
  "products.special-profiles": {
    "title": "Speciālie profili",
    "description": "Pielāgoti alumīnija profili īpašiem projektiem un specifiskām vajadzībām"
  },
  "products.hdpe-pipes": {
    "title": "HDPE caurules",
    "description": "Augstas blīvuma polietilēna caurules ar izcilu ķīmisko izturību"
  },
  "products.double-corrugated-pipes": {
    "title": "Dubultsienu gofrētās caurules",
    "description": "Gofrētās dubultsienu caurules ar uzlabotu izturību un elastību"
  },
  "products.reinforced-corrugated-pipes": {
    "title": "Armētās gofrētās caurules",
    "description": "Tērauda armētās polietilēna caurules lielām slodzēm"
  },
  "products.hsaw-pipes": {
    "title": "Spirālmetinātās caurules",
    "description": "Spirālmetinātās tērauda caurules ūdens un pāļu sistēmām"
  },
  "products.oil-gas-pipes": {
    "title": "Naftas un gāzes caurules",
    "description": "Specializētas tērauda caurules naftas un gāzes produktu transportēšanai"
  },
  "products.manhole-covers": {
    "title": "Kanalizācijas lūkas",
    "description": "Čuguna kanalizācijas lūkas dažādās slodzes klasēs"
  },
  "products.drainage-grates": {
    "title": "Drenāžas restes",
    "description": "Čuguna drenāžas restes efektīvai ūdens novadīšanai"
  }
};

// Lithuanian product translations
const ltProductTranslations = {
  "products.standard-profiles": {
    "title": "Standartiniai aliuminio profiliai",
    "description": "Aukštos kokybės aliuminio profiliai struktūriniams, architektūriniams ir pramoniniams tikslams"
  },
  "products.machine-building-profiles": {
    "title": "Mašinų gamybos profiliai",
    "description": "Specializuoti aliuminio profiliai, skirti mašinų gamybai ir automatizavimui"
  },
  "products.led-profiles": {
    "title": "LED profiliai",
    "description": "Aliuminio profiliai LED apšvietimui su integruotomis šviesos sklaidymo galimybėmis"
  },
  "products.special-profiles": {
    "title": "Specialūs profiliai",
    "description": "Pritaikyti aliuminio profiliai specialiems projektams ir specifiniams poreikiams"
  },
  "products.hdpe-pipes": {
    "title": "HDPE vamzdžiai",
    "description": "Didelio tankio polietileno vamzdžiai su puikiu atsparumu cheminėms medžiagoms"
  },
  "products.double-corrugated-pipes": {
    "title": "Dvigubi gofruoti vamzdžiai",
    "description": "Gofruoti dvigubų sienelių vamzdžiai su pagerintu stiprumu ir lankstumu"
  },
  "products.reinforced-corrugated-pipes": {
    "title": "Armuoti gofruoti vamzdžiai",
    "description": "Plienu armuoti polietileno vamzdžiai sunkioms apkrovoms"
  },
  "products.hsaw-pipes": {
    "title": "Spiraliniai suvirintiniai vamzdžiai",
    "description": "Spiraliniai suvirintiniai plieniniai vamzdžiai vandens ir polinėms sistemoms"
  },
  "products.oil-gas-pipes": {
    "title": "Naftos ir dujų vamzdžiai",
    "description": "Specializuoti plieniniai vamzdžiai naftos ir dujų produktų transportavimui"
  },
  "products.manhole-covers": {
    "title": "Kanalizacijos šulinių dangčiai",
    "description": "Ketaus kanalizacijos šulinių dangčiai įvairioms apkrovų klasėms"
  },
  "products.drainage-grates": {
    "title": "Drenažo grotelės",
    "description": "Ketaus drenažo grotelės efektyviam vandens nuvedimui"
  }
};

// Polish product translations
const plProductTranslations = {
  "products.standard-profiles": {
    "title": "Standardowe profile aluminiowe",
    "description": "Wysokiej jakości profile aluminiowe do zastosowań konstrukcyjnych, architektonicznych i przemysłowych"
  },
  "products.machine-building-profiles": {
    "title": "Profile do budowy maszyn",
    "description": "Specjalistyczne profile aluminiowe zaprojektowane do budowy maszyn i automatyki"
  },
  "products.led-profiles": {
    "title": "Profile LED",
    "description": "Profile aluminiowe do oświetlenia LED z zintegrowanymi opcjami dyfuzji światła"
  },
  "products.special-profiles": {
    "title": "Profile specjalne",
    "description": "Niestandardowe profile aluminiowe do projektów specjalnych i określonych potrzeb"
  },
  "products.hdpe-pipes": {
    "title": "Rury HDPE",
    "description": "Rury z polietylenu o wysokiej gęstości o doskonałej odporności chemicznej"
  },
  "products.double-corrugated-pipes": {
    "title": "Rury dwuścienne karbowane",
    "description": "Karbowane rury dwuścienne o zwiększonej wytrzymałości i elastyczności"
  },
  "products.reinforced-corrugated-pipes": {
    "title": "Wzmocnione rury karbowane",
    "description": "Rury polietylenowe wzmocnione stalą do zastosowań pod dużym obciążeniem"
  },
  "products.hsaw-pipes": {
    "title": "Rury spawane spiralnie",
    "description": "Spiralnie spawane rury stalowe do zastosowań wodnych i palowych"
  },
  "products.oil-gas-pipes": {
    "title": "Rury do ropy i gazu",
    "description": "Specjalistyczne rury stalowe do transportu produktów naftowych i gazowych"
  },
  "products.manhole-covers": {
    "title": "Włazy studzienek",
    "description": "Żeliwne włazy studzienek kanalizacyjnych w różnych klasach obciążenia"
  },
  "products.drainage-grates": {
    "title": "Kraty ściekowe",
    "description": "Żeliwne kraty ściekowe zapewniające efektywne odprowadzanie wody"
  }
};

// Estonian product translations
const etProductTranslations = {
  "products.standard-profiles": {
    "title": "Standardsed alumiiniumprofiilid",
    "description": "Kõrgekvaliteetsed alumiiniumprofiilid konstruktsiooni-, arhitektuuri- ja tööstusrakendusteks"
  },
  "products.machine-building-profiles": {
    "title": "Masinaehituse profiilid",
    "description": "Spetsiaalsed alumiiniumprofiilid, mis on loodud masinaehituse ja automatiseerimise jaoks"
  },
  "products.led-profiles": {
    "title": "LED-profiilid",
    "description": "Alumiiniumprofiilid LED-valgustusele integreeritud valguse hajutamise võimalustega"
  },
  "products.special-profiles": {
    "title": "Eriprofiilid",
    "description": "Kohandatud alumiiniumprofiilid spetsiaalseteks projektideks ja konkreetseteks vajadusteks"
  },
  "products.hdpe-pipes": {
    "title": "HDPE-torud",
    "description": "Kõrge tihedusega polüetüleentorud suurepärase keemilise vastupidavusega"
  },
  "products.double-corrugated-pipes": {
    "title": "Kahekihilised gofreeritud torud",
    "description": "Kahekihilised gofreeritud torud suurendatud tugevuse ja paindlikkusega"
  },
  "products.reinforced-corrugated-pipes": {
    "title": "Tugevdatud gofreeritud torud",
    "description": "Terasega tugevdatud polüetüleentorud suurtele koormustele"
  },
  "products.hsaw-pipes": {
    "title": "Spiraalkeevitusega torud",
    "description": "Spiraalkeevitusega terastorud vee- ja vaiadusteks"
  },
  "products.oil-gas-pipes": {
    "title": "Nafta- ja gaasitorud",
    "description": "Spetsiaalsed terastorud nafta- ja gaasiproduktide transportimiseks"
  },
  "products.manhole-covers": {
    "title": "Kanalisatsioonikaevude kaaned",
    "description": "Malmikaaned kanalisatsioonikaevudele erinevates koormusklassides"
  },
  "products.drainage-grates": {
    "title": "Drenaaživõred",
    "description": "Malmist drenaaživõred tõhusaks vee ärajuhtimiseks"
  }
};

// Add all the Russian translations
const ruProductTranslations = {
  "products.standard-profiles": {
    "title": "Стандартные алюминиевые профили",
    "description": "Высококачественные алюминиевые профили для конструкционных, архитектурных и промышленных применений"
  },
  "products.machine-building-profiles": {
    "title": "Профили для машиностроения",
    "description": "Специализированные алюминиевые профили, разработанные для машиностроения и автоматизации"
  },
  "products.led-profiles": {
    "title": "LED-профили",
    "description": "Алюминиевые профили для LED-освещения с интегрированными возможностями рассеивания света"
  },
  "products.special-profiles": {
    "title": "Специальные профили",
    "description": "Индивидуально разработанные алюминиевые профили для специальных проектов и конкретных потребностей"
  },
  "products.hdpe-pipes": {
    "title": "HDPE-трубы",
    "description": "Трубы из полиэтилена высокой плотности с отличной химической стойкостью"
  },
  "products.double-corrugated-pipes": {
    "title": "Двустенные гофрированные трубы",
    "description": "Двустенные гофрированные трубы с повышенной прочностью и гибкостью"
  },
  "products.reinforced-corrugated-pipes": {
    "title": "Армированные гофрированные трубы",
    "description": "Армированные сталью полиэтиленовые трубы для высоких нагрузок"
  },
  "products.hsaw-pipes": {
    "title": "Спирально-сварные трубы",
    "description": "Спирально-сварные стальные трубы для водоснабжения и свайных систем"
  },
  "products.oil-gas-pipes": {
    "title": "Нефтегазовые трубы",
    "description": "Специализированные стальные трубы для транспортировки нефтегазовой продукции"
  },
  "products.manhole-covers": {
    "title": "Крышки люков",
    "description": "Чугунные крышки люков канализации различных классов нагрузки"
  },
  "products.drainage-grates": {
    "title": "Дренажные решетки",
    "description": "Чугунные дренажные решетки для эффективного отвода воды"
  }
};

// Update translations
function updateTranslations() {
  try {
    // Update Latvian translations
    updateLanguageFile('lv', lvProductTranslations);
    
    // Update Lithuanian translations
    updateLanguageFile('lt', ltProductTranslations);
    
    // Update Polish translations
    updateLanguageFile('pl', plProductTranslations);
    
    // Update Estonian translations
    updateLanguageFile('et', etProductTranslations);
    
    // Update Russian translations
    updateLanguageFile('ru', ruProductTranslations);
    
    console.log('All translations have been updated successfully!');
  } catch (error) {
    console.error('Error updating translations:', error);
  }
}

// Function to update a specific language file
function updateLanguageFile(lang, translations) {
  const filePath = path.join('client', 'src', 'locales', `${lang}.json`);
  
  try {
    // Read existing translations
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const existingTranslations = JSON.parse(fileContent);
    
    // Add new translations with nested path support
    for (const [key, value] of Object.entries(translations)) {
      const parts = key.split('.');
      let current = existingTranslations;
      
      // Navigate to the nested location
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the value at the final location
      const lastPart = parts[parts.length - 1];
      current[lastPart] = value;
    }
    
    // Write updated translations back to file
    fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2), 'utf8');
    console.log(`Updated ${lang}.json with new translations`);
  } catch (error) {
    console.error(`Error updating ${lang}.json:`, error);
  }
}

// Run the update
updateTranslations();