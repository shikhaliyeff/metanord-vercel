/**
 * Contact Page FAQ Translations
 * 
 * This script updates all language files with proper FAQ translations
 * for the FAQ section on the Contact page.
 */

import fs from 'fs';
import path from 'path';

// Define all language files to update
const languageFiles = [
  'en.json', 
  'et.json', 
  'ru.json', 
  'lv.json', 
  'lt.json', 
  'pl.json', 
  'zh-CN.json'
];

// Contact page FAQ translations for all languages
const contactFaqTranslations = {
  'en': {
    "contact": {
      "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "Find answers to our most common questions",
        "q1": {
          "question": "What types of aluminum profiles do you offer?",
          "answer": "We offer a wide range of aluminum profiles including standard structural profiles, machine-building profiles, LED profiles, and custom solutions. Our catalog includes various shapes, sizes, and finishes suitable for different applications in construction, engineering, and design."
        },
        "q2": {
          "question": "Do you provide international shipping?",
          "answer": "Yes, we provide international shipping to most countries. Shipping costs and delivery times vary based on destination and order size. Please contact our sales team for specific shipping information for your region."
        },
        "q3": {
          "question": "Can I request custom specifications for products?",
          "answer": "Absolutely. We specialize in custom solutions and can adapt products to meet your specific project requirements. Please provide detailed specifications when requesting a quote, and our engineers will work with you to deliver exactly what you need."
        },
        "q4": {
          "question": "How can I get technical support for your products?",
          "answer": "Our technical support team is available to assist with product selection, installation advice, and troubleshooting. You can reach them via email at support@metanord.eu or by phone during business hours. We also provide comprehensive documentation for all our products."
        }
      }
    }
  },
  'et': {
    "contact": {
      "faq": {
        "title": "Korduma Kippuvad Küsimused",
        "subtitle": "Leia vastused meie kõige sagedamini esitatavatele küsimustele",
        "q1": {
          "question": "Milliseid alumiiniumprofiile te pakute?",
          "answer": "Pakume laia valikut alumiiniumprofiile, sealhulgas standardseid struktuuriprofiile, masinaehitusprofiile, LED-profiile ja kohandatud lahendusi. Meie kataloog sisaldab erinevaid kujusid, suurusi ja viimistlusi, mis sobivad erinevateks rakendusteks ehituses, inseneritöös ja disainis."
        },
        "q2": {
          "question": "Kas te pakute rahvusvahelist tarnet?",
          "answer": "Jah, pakume rahvusvahelist tarnet enamikesse riikidesse. Tarnekulud ja tarneajad varieeruvad sõltuvalt sihtkohast ja tellimuse suurusest. Palun võtke ühendust meie müügimeeskonnaga konkreetse tarneinfo saamiseks teie piirkonna kohta."
        },
        "q3": {
          "question": "Kas ma saan tellida kohandatud spetsifikatsioonidega tooteid?",
          "answer": "Kindlasti. Oleme spetsialiseerunud kohandatud lahendustele ja saame kohandada tooteid vastavalt teie projekti spetsiifilistele nõuetele. Palun esitage hinnapäringul üksikasjalikud spetsifikatsioonid ja meie insenerid töötavad teiega koos, et pakkuda täpselt seda, mida vajate."
        },
        "q4": {
          "question": "Kuidas saan teie toodetele tehnilist tuge?",
          "answer": "Meie tehnilise toe meeskond on valmis aitama toodete valikul, paigaldusnõuannete ja tõrkeotsingu küsimustes. Saate nendega ühendust võtta e-posti teel aadressil support@metanord.eu või telefoni teel tööajal. Pakume ka põhjalikke dokumentatsioone kõigile meie toodetele."
        }
      }
    }
  },
  'ru': {
    "contact": {
      "faq": {
        "title": "Часто Задаваемые Вопросы",
        "subtitle": "Найдите ответы на наши наиболее распространенные вопросы",
        "q1": {
          "question": "Какие типы алюминиевых профилей вы предлагаете?",
          "answer": "Мы предлагаем широкий спектр алюминиевых профилей, включая стандартные структурные профили, профили для машиностроения, LED-профили и индивидуальные решения. Наш каталог включает различные формы, размеры и отделки, подходящие для различных применений в строительстве, инженерии и дизайне."
        },
        "q2": {
          "question": "Осуществляете ли вы международную доставку?",
          "answer": "Да, мы осуществляем международную доставку в большинство стран. Стоимость доставки и сроки варьируются в зависимости от места назначения и размера заказа. Пожалуйста, свяжитесь с нашей командой продаж для получения конкретной информации о доставке в ваш регион."
        },
        "q3": {
          "question": "Могу ли я заказать продукцию по индивидуальным спецификациям?",
          "answer": "Абсолютно. Мы специализируемся на индивидуальных решениях и можем адаптировать продукты в соответствии с конкретными требованиями вашего проекта. Пожалуйста, предоставьте подробные спецификации при запросе коммерческого предложения, и наши инженеры будут работать с вами, чтобы предоставить именно то, что вам нужно."
        },
        "q4": {
          "question": "Как я могу получить техническую поддержку для ваших продуктов?",
          "answer": "Наша команда технической поддержки готова помочь с выбором продуктов, советами по установке и устранением неполадок. Вы можете связаться с ними по электронной почте support@metanord.eu или по телефону в рабочее время. Мы также предоставляем полную документацию для всех наших продуктов."
        }
      }
    }
  },
  'lv': {
    "contact": {
      "faq": {
        "title": "Biežāk Uzdotie Jautājumi",
        "subtitle": "Atrodiet atbildes uz mūsu visbiežāk uzdotajiem jautājumiem",
        "q1": {
          "question": "Kādus alumīnija profilu veidus jūs piedāvājat?",
          "answer": "Mēs piedāvājam plašu alumīnija profilu klāstu, ieskaitot standarta strukturālos profilus, mašīnbūves profilus, LED profilus un pielāgotus risinājumus. Mūsu katalogā ir iekļautas dažādas formas, izmēri un apdares, kas piemērotas dažādiem pielietojumiem būvniecībā, inženierijā un dizainā."
        },
        "q2": {
          "question": "Vai jūs nodrošināt starptautisko piegādi?",
          "answer": "Jā, mēs nodrošinām starptautisko piegādi uz vairākumu valstu. Piegādes izmaksas un piegādes laiks atšķiras atkarībā no galamērķa un pasūtījuma apjoma. Lūdzu, sazinieties ar mūsu pārdošanas komandu, lai iegūtu konkrētu informāciju par piegādi jūsu reģionā."
        },
        "q3": {
          "question": "Vai es varu pieprasīt pielāgotas specifikācijas produktiem?",
          "answer": "Noteikti. Mēs specializējamies pielāgotos risinājumos un varam pielāgot produktus, lai tie atbilstu jūsu specifiskajām projekta prasībām. Lūdzu, norādiet detalizētas specifikācijas, pieprasot cenu piedāvājumu, un mūsu inženieri strādās ar jums, lai nodrošinātu tieši to, kas jums nepieciešams."
        },
        "q4": {
          "question": "Kā es varu saņemt tehnisko atbalstu jūsu produktiem?",
          "answer": "Mūsu tehniskā atbalsta komanda ir pieejama, lai palīdzētu ar produktu izvēli, uzstādīšanas padomiem un problēmu novēršanu. Jūs varat sazināties ar viņiem pa e-pastu support@metanord.eu vai pa tālruni darba laikā. Mēs arī nodrošinām visaptverošu dokumentāciju visiem mūsu produktiem."
        }
      }
    }
  },
  'lt': {
    "contact": {
      "faq": {
        "title": "Dažnai Užduodami Klausimai",
        "subtitle": "Raskite atsakymus į mūsų dažniausiai užduodamus klausimus",
        "q1": {
          "question": "Kokius aliuminio profilių tipus siūlote?",
          "answer": "Siūlome platų aliuminio profilių asortimentą, įskaitant standartinius struktūrinius profilius, mašinų gamybos profilius, LED profilius ir pritaikytus sprendimus. Mūsų kataloge yra įvairių formų, dydžių ir apdailų, tinkamų įvairiems pritaikymams statyboje, inžinerijoje ir dizaine."
        },
        "q2": {
          "question": "Ar teikiate tarptautinį pristatymą?",
          "answer": "Taip, teikiame tarptautinį pristatymą į daugumą šalių. Pristatymo kainos ir trukmė skiriasi priklausomai nuo paskirties vietos ir užsakymo dydžio. Prašome susisiekti su mūsų pardavimų komanda dėl konkrečios informacijos apie pristatymą į jūsų regioną."
        },
        "q3": {
          "question": "Ar galiu užsakyti produktus pagal individualias specifikacijas?",
          "answer": "Absoliučiai. Mes specializuojamės individualiuose sprendimuose ir galime pritaikyti produktus pagal jūsų konkretaus projekto reikalavimus. Prašome pateikti išsamias specifikacijas prašant kainų pasiūlymo, ir mūsų inžinieriai bendradarbiaus su jumis, kad pateiktų būtent tai, ko jums reikia."
        },
        "q4": {
          "question": "Kaip galiu gauti techninę pagalbą jūsų produktams?",
          "answer": "Mūsų techninės pagalbos komanda yra pasirengusi padėti pasirenkant produktus, suteikti montavimo patarimų ir spręsti problemas. Galite su jais susisiekti el. paštu support@metanord.eu arba telefonu darbo valandomis. Taip pat teikiame išsamią dokumentaciją visiems mūsų produktams."
        }
      }
    }
  },
  'pl': {
    "contact": {
      "faq": {
        "title": "Często Zadawane Pytania",
        "subtitle": "Znajdź odpowiedzi na nasze najczęściej zadawane pytania",
        "q1": {
          "question": "Jakie rodzaje profili aluminiowych oferujecie?",
          "answer": "Oferujemy szeroki zakres profili aluminiowych, w tym standardowe profile konstrukcyjne, profile do budowy maszyn, profile LED oraz rozwiązania niestandardowe. Nasz katalog obejmuje różne kształty, rozmiary i wykończenia odpowiednie do różnych zastosowań w budownictwie, inżynierii i projektowaniu."
        },
        "q2": {
          "question": "Czy zapewniacie międzynarodową wysyłkę?",
          "answer": "Tak, zapewniamy międzynarodową wysyłkę do większości krajów. Koszty wysyłki i czasy dostawy różnią się w zależności od miejsca docelowego i wielkości zamówienia. Prosimy o kontakt z naszym zespołem sprzedaży w celu uzyskania szczegółowych informacji o wysyłce do Twojego regionu."
        },
        "q3": {
          "question": "Czy mogę zamówić produkty o niestandardowych specyfikacjach?",
          "answer": "Absolutnie. Specjalizujemy się w rozwiązaniach niestandardowych i możemy dostosować produkty do konkretnych wymagań Twojego projektu. Prosimy o podanie szczegółowych specyfikacji podczas prośby o wycenę, a nasi inżynierowie będą współpracować z Tobą, aby dostarczyć dokładnie to, czego potrzebujesz."
        },
        "q4": {
          "question": "Jak mogę uzyskać wsparcie techniczne dla Waszych produktów?",
          "answer": "Nasz zespół wsparcia technicznego jest dostępny, aby pomóc w wyborze produktów, doradzić w zakresie instalacji i rozwiązać problemy. Możesz skontaktować się z nimi przez e-mail pod adresem support@metanord.eu lub telefonicznie w godzinach pracy. Zapewniamy również kompleksową dokumentację dla wszystkich naszych produktów."
        }
      }
    }
  },
  'zh-CN': {
    "contact": {
      "faq": {
        "title": "常见问题",
        "subtitle": "查找我们最常见问题的答案",
        "q1": {
          "question": "你们提供哪些类型的铝型材？",
          "answer": "我们提供广泛的铝型材系列，包括标准结构型材、机械制造型材、LED型材和定制解决方案。我们的目录包括适用于建筑、工程和设计中不同应用的各种形状、尺寸和表面处理。"
        },
        "q2": {
          "question": "你们提供国际运输服务吗？",
          "answer": "是的，我们向大多数国家提供国际运输服务。运输成本和交货时间根据目的地和订单规模而有所不同。请联系我们的销售团队，了解您所在地区的具体运输信息。"
        },
        "q3": {
          "question": "我可以请求定制产品规格吗？",
          "answer": "当然可以。我们专注于定制解决方案，能够根据您项目的特定要求调整产品。请在请求报价时提供详细规格，我们的工程师将与您合作，提供您所需的精确产品。"
        },
        "q4": {
          "question": "如何获得你们产品的技术支持？",
          "answer": "我们的技术支持团队随时为您提供产品选择、安装建议和故障排除方面的帮助。您可以通过电子邮件 support@metanord.eu 或在工作时间通过电话联系他们。我们还为所有产品提供全面的技术文档。"
        }
      }
    }
  }
};

// Main function to update all translations
function updateAllTranslations() {
  const localesDir = 'client/src/locales';

  languageFiles.forEach(file => {
    const filePath = path.join(localesDir, file);
    const language = file.split('.')[0];
    
    try {
      console.log(`Processing language file: ${file}`);
      
      // Read the existing translation file
      let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Deep merge existing translations with new translations
      if (contactFaqTranslations[language]) {
        translations = deepMerge(translations, contactFaqTranslations[language]);
      }
      
      // Write the updated translations back to file
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      
      console.log(`✅ Successfully updated ${language} Contact FAQ translations`);
    } catch (error) {
      console.error(`❌ Error updating ${language} Contact FAQ translations:`, error);
    }
  });
}

// Helper function for deep merging objects
function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return target;
}

// Helper function to check if a value is an object
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Execute the translation update
updateAllTranslations();
console.log('All Contact page FAQ translations have been updated successfully!');