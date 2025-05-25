import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common translations that should be in all language files
const productTranslations = {
  en: {
    "categories.aluminum": {
      "title": "Aluminum Products",
      "description": "High-quality aluminum profiles for structural, architectural, and industrial applications. Our aluminum products meet international standards and offer excellent strength-to-weight ratio."
    },
    "categories.infrastructure": {
      "title": "Infrastructure Products",
      "description": "Comprehensive range of infrastructure products designed for durability and compliance with European standards. Our solutions support construction, utilities, and urban development projects."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Polyethylene Products"
      },
      "steel": {
        "title": "Steel Products"
      },
      "castIron": {
        "title": "Cast Iron Products"
      },
      "rainwaterGrills": {
        "title": "Rainwater Grills"
      },
      "pipeFittings": {
        "title": "Pipe Fittings"
      },
      "urbanInfrastructure": {
        "title": "Urban Infrastructure"
      }
    },
    "qualityAssurance": {
      "title": "Quality Assurance",
      "paragraph1": "All our products undergo rigorous quality checks to ensure they meet European standards for durability, safety, and performance.",
      "paragraph2": "We collaborate with certified manufacturers who maintain strict quality control systems and provide comprehensive documentation for each product.",
      "paragraph3": "Our commitment to quality extends beyond products to our services, ensuring timely delivery and professional support for all your infrastructure needs.",
      "imageAlt": "Quality assurance testing of industrial products"
    }
  },
  ru: {
    "categories.aluminum": {
      "title": "Алюминиевые Изделия",
      "description": "Высококачественные алюминиевые профили для структурных, архитектурных и промышленных применений. Наши алюминиевые изделия соответствуют международным стандартам и предлагают отличное соотношение прочности к весу."
    },
    "categories.infrastructure": {
      "title": "Инфраструктурные Изделия",
      "description": "Комплексный ассортимент инфраструктурных изделий, разработанных для долговечности и соответствия европейским стандартам. Наши решения поддерживают проекты в строительстве, коммунальном хозяйстве и городском развитии."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Изделия из Полиэтилена"
      },
      "steel": {
        "title": "Стальные Изделия"
      },
      "castIron": {
        "title": "Чугунные Изделия"
      },
      "rainwaterGrills": {
        "title": "Дождеприемные Решетки"
      },
      "pipeFittings": {
        "title": "Трубные Фитинги"
      },
      "urbanInfrastructure": {
        "title": "Городская Инфраструктура"
      }
    },
    "qualityAssurance": {
      "title": "Контроль Качества",
      "paragraph1": "Все наши изделия проходят строгий контроль качества, чтобы гарантировать соответствие европейским стандартам долговечности, безопасности и производительности.",
      "paragraph2": "Мы сотрудничаем с сертифицированными производителями, которые поддерживают строгие системы контроля качества и предоставляют полную документацию на каждое изделие.",
      "paragraph3": "Наше стремление к качеству выходит за рамки продукции и распространяется на наши услуги, обеспечивая своевременную доставку и профессиональную поддержку для всех ваших инфраструктурных потребностей.",
      "imageAlt": "Тестирование обеспечения качества промышленных изделий"
    }
  },
  lv: {
    "categories.aluminum": {
      "title": "Alumīnija Produkti",
      "description": "Augstas kvalitātes alumīnija profili strukturāliem, arhitektūras un rūpnieciskiem pielietojumiem. Mūsu alumīnija produkti atbilst starptautiskiem standartiem un piedāvā izcilu stiprības un svara attiecību."
    },
    "categories.infrastructure": {
      "title": "Infrastruktūras Produkti",
      "description": "Plašs infrastruktūras produktu klāsts, kas izstrādāts, lai nodrošinātu ilgmūžību un atbilstību Eiropas standartiem. Mūsu risinājumi atbalsta būvniecības, komunālo pakalpojumu un pilsētvides attīstības projektus."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Polietilēna Produkti"
      },
      "steel": {
        "title": "Tērauda Produkti"
      },
      "castIron": {
        "title": "Čuguna Produkti"
      },
      "rainwaterGrills": {
        "title": "Lietus Ūdens Restes"
      },
      "pipeFittings": {
        "title": "Cauruļu Savienojumi"
      },
      "urbanInfrastructure": {
        "title": "Pilsētas Infrastruktūra"
      }
    },
    "qualityAssurance": {
      "title": "Kvalitātes Nodrošināšana",
      "paragraph1": "Visi mūsu produkti iziet stingras kvalitātes pārbaudes, lai nodrošinātu to atbilstību Eiropas standartiem par izturību, drošību un veiktspēju.",
      "paragraph2": "Mēs sadarbojamies ar sertificētiem ražotājiem, kas uztur stingras kvalitātes kontroles sistēmas un nodrošina pilnīgu dokumentāciju katram produktam.",
      "paragraph3": "Mūsu apņemšanās par kvalitāti pārsniedz produktus un attiecas arī uz mūsu pakalpojumiem, nodrošinot savlaicīgu piegādi un profesionālu atbalstu visām jūsu infrastruktūras vajadzībām.",
      "imageAlt": "Rūpniecisko produktu kvalitātes nodrošināšanas pārbaude"
    }
  },
  lt: {
    "categories.aluminum": {
      "title": "Aliuminio Produktai",
      "description": "Aukštos kokybės aliuminio profiliai struktūriniams, architektūriniams ir pramoniniams tikslams. Mūsų aliuminio produktai atitinka tarptautinius standartus ir siūlo puikų stiprumo ir svorio santykį."
    },
    "categories.infrastructure": {
      "title": "Infrastruktūros Produktai",
      "description": "Išsamus infrastruktūros produktų asortimentas, sukurtas ilgaamžiškumui ir atitikti Europos standartams. Mūsų sprendimai palaiko statybų, komunalinių paslaugų ir miestų plėtros projektus."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Polietileno Produktai"
      },
      "steel": {
        "title": "Plieno Produktai"
      },
      "castIron": {
        "title": "Ketaus Produktai"
      },
      "rainwaterGrills": {
        "title": "Lietaus Nutekėjimo Grotelės"
      },
      "pipeFittings": {
        "title": "Vamzdžių Jungtys"
      },
      "urbanInfrastructure": {
        "title": "Miesto Infrastruktūra"
      }
    },
    "qualityAssurance": {
      "title": "Kokybės Užtikrinimas",
      "paragraph1": "Visi mūsų produktai pereina griežtus kokybės patikrinimus, kad užtikrintų jų atitikimą Europos standartams dėl ilgaamžiškumo, saugumo ir efektyvumo.",
      "paragraph2": "Mes bendradarbiaujame su sertifikuotais gamintojais, kurie palaiko griežtas kokybės kontrolės sistemas ir teikia išsamią dokumentaciją kiekvienam produktui.",
      "paragraph3": "Mūsų įsipareigojimas kokybei apima ne tik produktus, bet ir mūsų paslaugas, užtikrinant laiku pristatymą ir profesionalią pagalbą visoms jūsų infrastruktūros reikmėms.",
      "imageAlt": "Pramoninių produktų kokybės užtikrinimo testavimas"
    }
  },
  et: {
    "categories.aluminum": {
      "title": "Alumiinium Tooted",
      "description": "Kõrgekvaliteetsed alumiiniumprofiilid konstruktiivseks, arhitektuuriliseks ja tööstuslikuks kasutamiseks. Meie alumiiniumtooted vastavad rahvusvahelistele standarditele ja pakuvad suurepärast tugevuse ja massi suhet."
    },
    "categories.infrastructure": {
      "title": "Infrastruktuuri Tooted",
      "description": "Laiaulatuslik infrastruktuuritoodete valik, mis on projekteeritud vastupidavuseks ja Euroopa standarditele vastavuseks. Meie lahendused toetavad ehitus-, kommunaal- ja linnaarendusprojekte."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Polüetüleeni Tooted"
      },
      "steel": {
        "title": "Terastooted"
      },
      "castIron": {
        "title": "Valumalm Tooted"
      },
      "rainwaterGrills": {
        "title": "Vihmavee Restid"
      },
      "pipeFittings": {
        "title": "Torufitingud"
      },
      "urbanInfrastructure": {
        "title": "Linnainfrastruktuur"
      }
    },
    "qualityAssurance": {
      "title": "Kvaliteedi Tagamine",
      "paragraph1": "Kõik meie tooted läbivad ranged kvaliteedikontrollid, et tagada nende vastavus Euroopa standarditele vastupidavuse, ohutuse ja jõudluse osas.",
      "paragraph2": "Teeme koostööd sertifitseeritud tootjatega, kes hoiavad rangeid kvaliteedikontrolli süsteeme ja pakuvad igale tootele põhjalikku dokumentatsiooni.",
      "paragraph3": "Meie pühendumus kvaliteedile ulatub kaugemale toodetest, hõlmates ka meie teenuseid, tagades õigeaegse kohaletoimetamise ja professionaalse toe kõigile teie infrastruktuurivajadustele.",
      "imageAlt": "Tööstustoodete kvaliteedi tagamise testimine"
    }
  },
  pl: {
    "categories.aluminum": {
      "title": "Produkty Aluminiowe",
      "description": "Wysokiej jakości profile aluminiowe do zastosowań konstrukcyjnych, architektonicznych i przemysłowych. Nasze produkty aluminiowe spełniają międzynarodowe standardy i oferują doskonały stosunek wytrzymałości do masy."
    },
    "categories.infrastructure": {
      "title": "Produkty Infrastrukturalne",
      "description": "Kompleksowa gama produktów infrastrukturalnych zaprojektowanych z myślą o trwałości i zgodności z normami europejskimi. Nasze rozwiązania wspierają projekty budowlane, użyteczności publicznej i rozwoju miejskiego."
    },
    "subcategories": {
      "polyethylene": {
        "title": "Produkty Polietylenowe"
      },
      "steel": {
        "title": "Produkty Stalowe"
      },
      "castIron": {
        "title": "Produkty z Żeliwa"
      },
      "rainwaterGrills": {
        "title": "Kratki Ściekowe"
      },
      "pipeFittings": {
        "title": "Złączki Rurowe"
      },
      "urbanInfrastructure": {
        "title": "Infrastruktura Miejska"
      }
    },
    "qualityAssurance": {
      "title": "Zapewnienie Jakości",
      "paragraph1": "Wszystkie nasze produkty przechodzą rygorystyczne kontrole jakości, aby zapewnić ich zgodność z europejskimi normami trwałości, bezpieczeństwa i wydajności.",
      "paragraph2": "Współpracujemy z certyfikowanymi producentami, którzy utrzymują rygorystyczne systemy kontroli jakości i dostarczają kompleksową dokumentację dla każdego produktu.",
      "paragraph3": "Nasze zaangażowanie w jakość wykracza poza same produkty, obejmując również nasze usługi, zapewniając terminową dostawę i profesjonalne wsparcie dla wszystkich potrzeb infrastrukturalnych.",
      "imageAlt": "Testowanie zapewnienia jakości produktów przemysłowych"
    }
  }
};

// Read each language file and update it with the required translations
const localesDir = path.join('client', 'src', 'locales');
const languageFiles = ['en.json', 'ru.json', 'lv.json', 'lt.json', 'et.json', 'pl.json'];

languageFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  const language = file.split('.')[0];
  
  try {
    // Read the existing file content
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ensure products object exists
    if (!fileContent.products) {
      fileContent.products = {};
    }
    
    // Update with the required translations
    if (productTranslations[language]) {
      // Add the categories.aluminum translations
      fileContent.products['categories.aluminum'] = productTranslations[language]['categories.aluminum'];
      
      // Add the categories.infrastructure translations
      fileContent.products['categories.infrastructure'] = productTranslations[language]['categories.infrastructure'];
      
      // Add the subcategories translations
      fileContent.products.subcategories = {
        ...fileContent.products.subcategories || {},
        ...productTranslations[language].subcategories
      };
      
      // Add the qualityAssurance translations
      fileContent.products.qualityAssurance = {
        ...fileContent.products.qualityAssurance || {},
        ...productTranslations[language].qualityAssurance
      };
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
    console.log(`Updated translations for ${file}`);
    
  } catch (error) {
    console.error(`Error updating ${file}:`, error);
  }
});

console.log('All translations updated successfully!');