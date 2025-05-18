/**
 * Comprehensive Translation Update Script for MetaNord
 * 
 * This script:
 * 1. Adds complete FAQ translations for all languages
 * 2. Fixes product translations for all categories and individual products
 * 3. Ensures consistent category naming across all languages
 * 4. Optimizes translation structure for better performance
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

// Complete FAQ translations for all languages
const faqTranslations = {
  'en': {
    "faq": {
      "title": "Frequently Asked Questions",
      "description": "Find answers to common questions about our products, services, and business operations. If you don't see your question answered here, please contact us directly.",
      "metaTitle": "Frequently Asked Questions | MetaNord",
      "metaDescription": "Find answers to common questions about MetaNord's products, services, delivery terms, and technical support. Get the information you need for your infrastructure projects.",
      "items": {
        "0": {
          "question": "What types of products does MetaNord supply?",
          "answer": "MetaNord specializes in distributing aluminum profiles, polyethylene pipes, steel components, and other infrastructure materials sourced from trusted global manufacturers."
        },
        "1": {
          "question": "Do you offer custom manufacturing or tailored solutions?",
          "answer": "Yes. We can provide custom dimensions, finishes, or specifications based on project needs. Please contact our sales team for customized quotations and engineering review."
        },
        "2": {
          "question": "What are your delivery times and terms?",
          "answer": "Delivery times depend on product type and quantity. Standard items are typically delivered within 7-14 business days across Europe. We also support express shipping upon request."
        },
        "3": {
          "question": "Can you deliver outside the European Union?",
          "answer": "Yes, we support international shipping to a wide range of markets, including non-EU countries. Please contact us with your location and required materials for a logistics assessment."
        },
        "4": {
          "question": "Do you provide product certificates and technical documentation?",
          "answer": "Absolutely. Most products come with EN standard certificates and detailed technical data sheets, available on the Documents page or on individual product pages."
        },
        "5": {
          "question": "How can I request a price quotation?",
          "answer": "You can request a price quotation through the contact form on our website, by emailing info@metanord.eu, or by calling +372 5771 3442. Please specify the required products, quantities, and delivery location."
        },
        "6": {
          "question": "What quality assurance does MetaNord provide?",
          "answer": "All our products undergo rigorous quality checks to ensure they meet European standards for durability, safety, and performance. We partner with certified manufacturers who maintain strict quality control systems."
        }
      }
    }
  },
  'et': {
    "faq": {
      "title": "Korduma Kippuvad Küsimused",
      "description": "Leia vastused levinud küsimustele meie toodete, teenuste ja äritegevuse kohta. Kui sa ei leia oma küsimusele vastust, võta meiega otse ühendust.",
      "metaTitle": "Korduma Kippuvad Küsimused | MetaNord",
      "metaDescription": "Leia vastuseid MetaNordi toodete, teenuste, tarnetingimuste ja tehnilise toe kohta. Saa vajalik teave oma infrastruktuuriprojektide jaoks.",
      "items": {
        "0": {
          "question": "Milliseid tooteid MetaNord pakub?",
          "answer": "MetaNord on spetsialiseerunud alumiiniumprofiilidele, polüetüleentorudele, teraskomponentidele ja muudele usaldusväärsetelt globaalsetelt tootjatelt pärit infrastruktuurimaterjalidele."
        },
        "1": {
          "question": "Kas pakute kohandatud tootmist või erilahendusi?",
          "answer": "Jah. Saame pakkuda kohandatud mõõtmeid, viimistlust või spetsifikatsioone vastavalt projekti vajadustele. Palun võtke ühendust meie müügimeeskonnaga kohandatud pakkumiste ja tehnilise konsultatsiooni saamiseks."
        },
        "2": {
          "question": "Millised on teie tarneajad ja -tingimused?",
          "answer": "Tarneajad sõltuvad toote tüübist ja kogusest. Standardsed tooted tarnitakse tavaliselt 7-14 tööpäeva jooksul üle Euroopa. Pakume ka kiirtarne võimalust."
        },
        "3": {
          "question": "Kas saate tarnida ka väljaspoole Euroopa Liitu?",
          "answer": "Jah, toetame rahvusvahelist tarnimist paljudele turgudele, sealhulgas väljaspool EL-i. Palun võtke meiega ühendust oma asukoha ja vajalike materjalide osas logistilise hinnangu saamiseks."
        },
        "4": {
          "question": "Kas pakute tootesertifikaate ja tehnilist dokumentatsiooni?",
          "answer": "Absoluutselt. Enamik tooteid on varustatud EN-standardile vastavate sertifikaatide ja üksikasjalike tehniliste andmelehtedega, mis on saadaval Dokumentide lehel või üksikute toodete lehtedel."
        },
        "5": {
          "question": "Kuidas saan küsida hinnapakkumist?",
          "answer": "Saate hinnapakkumist küsida meie veebilehel oleva kontaktivormi kaudu, saates e-kirja aadressile info@metanord.eu või helistades numbril +372 5771 3442. Palun täpsustage soovitud tooted, kogused ja tarnekoht."
        },
        "6": {
          "question": "Millist kvaliteedikontrolli MetaNord pakub?",
          "answer": "Kõik meie tooted läbivad ranged kvaliteedikontrollid, et tagada nende vastavus Euroopa standarditele vastupidavuse, ohutuse ja jõudluse osas. Teeme koostööd sertifitseeritud tootjatega, kes rakendavad rangeid kvaliteedikontrollisüsteeme."
        }
      }
    }
  },
  'ru': {
    "faq": {
      "title": "Часто Задаваемые Вопросы",
      "description": "Найдите ответы на распространенные вопросы о наших продуктах, услугах и бизнес-операциях. Если вы не нашли ответ на свой вопрос, пожалуйста, свяжитесь с нами напрямую.",
      "metaTitle": "Часто Задаваемые Вопросы | MetaNord",
      "metaDescription": "Найдите ответы на распространенные вопросы о продуктах, услугах, условиях доставки и технической поддержке MetaNord. Получите необходимую информацию для ваших инфраструктурных проектов.",
      "items": {
        "0": {
          "question": "Какие типы продукции поставляет MetaNord?",
          "answer": "MetaNord специализируется на распространении алюминиевых профилей, полиэтиленовых труб, стальных компонентов и других инфраструктурных материалов от надежных мировых производителей."
        },
        "1": {
          "question": "Предлагаете ли вы индивидуальное производство или специализированные решения?",
          "answer": "Да. Мы можем предоставить индивидуальные размеры, отделку или спецификации в соответствии с потребностями проекта. Пожалуйста, свяжитесь с нашей командой продаж для получения индивидуальных расценок и инженерной консультации."
        },
        "2": {
          "question": "Каковы сроки и условия доставки?",
          "answer": "Сроки доставки зависят от типа и количества продукции. Стандартные товары обычно доставляются в течение 7-14 рабочих дней по всей Европе. Мы также поддерживаем экспресс-доставку по запросу."
        },
        "3": {
          "question": "Можете ли вы доставлять за пределы Европейского Союза?",
          "answer": "Да, мы поддерживаем международную доставку на широкий спектр рынков, включая страны, не входящие в ЕС. Пожалуйста, свяжитесь с нами, указав ваше местоположение и необходимые материалы для логистической оценки."
        },
        "4": {
          "question": "Предоставляете ли вы сертификаты на продукцию и техническую документацию?",
          "answer": "Безусловно. Большинство продуктов поставляются с сертификатами стандарта EN и подробными техническими паспортами, доступными на странице Документы или на страницах отдельных продуктов."
        },
        "5": {
          "question": "Как я могу запросить ценовое предложение?",
          "answer": "Вы можете запросить ценовое предложение через контактную форму на нашем сайте, отправив письмо на info@metanord.eu или позвонив по телефону +372 5771 3442. Пожалуйста, укажите требуемые продукты, количество и место доставки."
        },
        "6": {
          "question": "Какое обеспечение качества предоставляет MetaNord?",
          "answer": "Все наши продукты проходят строгий контроль качества, чтобы убедиться, что они соответствуют европейским стандартам долговечности, безопасности и производительности. Мы сотрудничаем с сертифицированными производителями, которые поддерживают строгие системы контроля качества."
        }
      }
    }
  },
  'lv': {
    "faq": {
      "title": "Biežāk Uzdotie Jautājumi",
      "description": "Atrodiet atbildes uz biežāk uzdotajiem jautājumiem par mūsu produktiem, pakalpojumiem un uzņēmējdarbību. Ja neatrodat atbildi uz savu jautājumu, lūdzu, sazinieties ar mums tieši.",
      "metaTitle": "Biežāk Uzdotie Jautājumi | MetaNord",
      "metaDescription": "Atrodiet atbildes uz biežāk uzdotajiem jautājumiem par MetaNord produktiem, pakalpojumiem, piegādes nosacījumiem un tehnisko atbalstu. Iegūstiet nepieciešamo informāciju jūsu infrastruktūras projektiem.",
      "items": {
        "0": {
          "question": "Kāda veida produktus piegādā MetaNord?",
          "answer": "MetaNord specializējas alumīnija profilu, polietilēna cauruļu, tērauda komponentu un citu infrastruktūras materiālu izplatīšanā no uzticamiem globāliem ražotājiem."
        },
        "1": {
          "question": "Vai jūs piedāvājat individuālu ražošanu vai pielāgotus risinājumus?",
          "answer": "Jā. Mēs varam nodrošināt pielāgotus izmērus, apdari vai specifikācijas, pamatojoties uz projekta vajadzībām. Lūdzu, sazinieties ar mūsu pārdošanas komandu, lai saņemtu individuālus piedāvājumus un inženiertehnisko pārskatu."
        },
        "2": {
          "question": "Kādi ir jūsu piegādes laiki un nosacījumi?",
          "answer": "Piegādes laiki ir atkarīgi no produkta veida un daudzuma. Standarta preces parasti tiek piegādātas 7-14 darba dienu laikā visā Eiropā. Mēs arī atbalstām ekspress piegādi pēc pieprasījuma."
        },
        "3": {
          "question": "Vai jūs varat piegādāt ārpus Eiropas Savienības?",
          "answer": "Jā, mēs atbalstām starptautiskos sūtījumus uz plašu tirgu klāstu, ieskaitot valstis ārpus ES. Lūdzu, sazinieties ar mums, norādot jūsu atrašanās vietu un nepieciešamos materiālus loģistikas novērtējumam."
        },
        "4": {
          "question": "Vai jūs nodrošināt produktu sertifikātus un tehnisko dokumentāciju?",
          "answer": "Noteikti. Lielākā daļa produktu nāk ar EN standarta sertifikātiem un detalizētām tehniskajām datu lapām, kas pieejamas Dokumentu lapā vai atsevišķu produktu lapās."
        },
        "5": {
          "question": "Kā es varu pieprasīt cenu piedāvājumu?",
          "answer": "Jūs varat pieprasīt cenu piedāvājumu, izmantojot kontaktformu mūsu tīmekļa vietnē, sūtot e-pastu uz info@metanord.eu vai zvanot uz +372 5771 3442. Lūdzu, norādiet nepieciešamos produktus, daudzumus un piegādes vietu."
        },
        "6": {
          "question": "Kādu kvalitātes nodrošinājumu sniedz MetaNord?",
          "answer": "Visi mūsu produkti iziet stingras kvalitātes pārbaudes, lai nodrošinātu, ka tie atbilst Eiropas standartiem attiecībā uz izturību, drošību un veiktspēju. Mēs sadarbojamies ar sertificētiem ražotājiem, kuri uztur stingras kvalitātes kontroles sistēmas."
        }
      }
    }
  },
  'lt': {
    "faq": {
      "title": "Dažnai Užduodami Klausimai",
      "description": "Raskite atsakymus į dažnai užduodamus klausimus apie mūsų produktus, paslaugas ir verslo operacijas. Jei nematote savo klausimo atsakymo čia, prašome susisiekti su mumis tiesiogiai.",
      "metaTitle": "Dažnai Užduodami Klausimai | MetaNord",
      "metaDescription": "Raskite atsakymus į dažnai užduodamus klausimus apie MetaNord produktus, paslaugas, pristatymo sąlygas ir techninę pagalbą. Gaukite reikalingą informaciją jūsų infrastruktūros projektams.",
      "items": {
        "0": {
          "question": "Kokio tipo produktus tiekia MetaNord?",
          "answer": "MetaNord specializuojasi aliuminio profilių, polietileno vamzdžių, plieno komponentų ir kitų infrastruktūros medžiagų, gautų iš patikimų pasaulinių gamintojų, platinime."
        },
        "1": {
          "question": "Ar siūlote individualią gamybą ar pritaikytus sprendimus?",
          "answer": "Taip. Galime pateikti pritaikytas dimensijas, apdailas ar specifikacijas pagal projekto poreikius. Prašome susisiekti su mūsų pardavimų komanda dėl pritaikytų kainų pasiūlymų ir inžinerinio vertinimo."
        },
        "2": {
          "question": "Kokie yra jūsų pristatymo terminai ir sąlygos?",
          "answer": "Pristatymo terminai priklauso nuo produkto tipo ir kiekio. Standartiniai produktai paprastai pristatomi per 7-14 darbo dienų visoje Europoje. Taip pat palaikome ekspres pristatymą pagal užklausą."
        },
        "3": {
          "question": "Ar galite pristatyti už Europos Sąjungos ribų?",
          "answer": "Taip, mes palaikome tarptautinį pristatymą į įvairias rinkas, įskaitant ne ES šalis. Prašome susisiekti su mumis dėl jūsų vietos ir reikalingų medžiagų logistikos įvertinimui."
        },
        "4": {
          "question": "Ar teikiate produktų sertifikatus ir techninę dokumentaciją?",
          "answer": "Absoliučiai. Dauguma produktų pateikiami su EN standarto sertifikatais ir išsamiais techniniais duomenų lapais, prieinamais Dokumentų puslapyje arba atskirų produktų puslapiuose."
        },
        "5": {
          "question": "Kaip galiu paprašyti kainos pasiūlymo?",
          "answer": "Galite paprašyti kainos pasiūlymo per kontaktų formą mūsų svetainėje, siųsdami el. laišką adresu info@metanord.eu arba skambindami telefonu +372 5771 3442. Prašome nurodyti reikalingus produktus, kiekius ir pristatymo vietą."
        },
        "6": {
          "question": "Kokį kokybės užtikrinimą teikia MetaNord?",
          "answer": "Visi mūsų produktai pereina griežtus kokybės patikrinimus, kad užtikrintų, jog jie atitinka Europos standartus dėl patvarumo, saugumo ir našumo. Mes bendradarbiaujame su sertifikuotais gamintojais, kurie palaiko griežtas kokybės kontrolės sistemas."
        }
      }
    }
  },
  'pl': {
    "faq": {
      "title": "Często Zadawane Pytania",
      "description": "Znajdź odpowiedzi na często zadawane pytania dotyczące naszych produktów, usług i działalności biznesowej. Jeśli nie widzisz odpowiedzi na swoje pytanie, skontaktuj się z nami bezpośrednio.",
      "metaTitle": "Często Zadawane Pytania | MetaNord",
      "metaDescription": "Znajdź odpowiedzi na często zadawane pytania dotyczące produktów, usług, warunków dostawy i wsparcia technicznego MetaNord. Uzyskaj informacje niezbędne dla Twoich projektów infrastrukturalnych.",
      "items": {
        "0": {
          "question": "Jakie rodzaje produktów dostarcza MetaNord?",
          "answer": "MetaNord specjalizuje się w dystrybucji profili aluminiowych, rur polietylenowych, komponentów stalowych i innych materiałów infrastrukturalnych pochodzących od zaufanych globalnych producentów."
        },
        "1": {
          "question": "Czy oferujecie niestandardową produkcję lub dostosowane rozwiązania?",
          "answer": "Tak. Możemy zapewnić niestandardowe wymiary, wykończenia lub specyfikacje w oparciu o potrzeby projektu. Prosimy o kontakt z naszym zespołem sprzedaży w celu uzyskania spersonalizowanych wycen i przeglądu inżynieryjnego."
        },
        "2": {
          "question": "Jakie są Wasze terminy i warunki dostawy?",
          "answer": "Czasy dostawy zależą od rodzaju i ilości produktu. Standardowe przedmioty są zazwyczaj dostarczane w ciągu 7-14 dni roboczych w całej Europie. Wspieramy również ekspresową wysyłkę na żądanie."
        },
        "3": {
          "question": "Czy możecie dostarczać poza Unię Europejską?",
          "answer": "Tak, wspieramy międzynarodową wysyłkę do szerokiego zakresu rynków, w tym krajów spoza UE. Prosimy o kontakt z nami wraz z informacją o lokalizacji i wymaganych materiałach do oceny logistycznej."
        },
        "4": {
          "question": "Czy dostarczacie certyfikaty produktów i dokumentację techniczną?",
          "answer": "Absolutnie. Większość produktów dostarczana jest z certyfikatami zgodności z normami EN i szczegółowymi kartami danych technicznych, dostępnymi na stronie Dokumenty lub na stronach poszczególnych produktów."
        },
        "5": {
          "question": "Jak mogę poprosić o wycenę?",
          "answer": "Możesz poprosić o wycenę poprzez formularz kontaktowy na naszej stronie internetowej, wysyłając e-mail na adres info@metanord.eu lub dzwoniąc pod numer +372 5771 3442. Prosimy o określenie wymaganych produktów, ilości i miejsca dostawy."
        },
        "6": {
          "question": "Jakie zapewnienie jakości oferuje MetaNord?",
          "answer": "Wszystkie nasze produkty przechodzą rygorystyczne kontrole jakości, aby upewnić się, że spełniają europejskie normy dotyczące trwałości, bezpieczeństwa i wydajności. Współpracujemy z certyfikowanymi producentami, którzy utrzymują rygorystyczne systemy kontroli jakości."
        }
      }
    }
  },
  'zh-CN': {
    "faq": {
      "title": "常见问题",
      "description": "查找有关我们产品、服务和业务运营的常见问题的答案。如果您没有在这里找到您的问题的答案，请直接联系我们。",
      "metaTitle": "常见问题 | MetaNord",
      "metaDescription": "查找有关MetaNord产品、服务、交付条款和技术支持的常见问题的答案。获取您的基础设施项目所需的信息。",
      "items": {
        "0": {
          "question": "MetaNord供应哪些类型的产品？",
          "answer": "MetaNord专门从可信赖的全球制造商那里分销铝型材、聚乙烯管道、钢铁组件和其他基础设施材料。"
        },
        "1": {
          "question": "你们提供定制制造或定制解决方案吗？",
          "answer": "是的。我们可以根据项目需要提供定制尺寸、表面处理或规格。请联系我们的销售团队获取定制报价和工程审查。"
        },
        "2": {
          "question": "你们的交货时间和条款是什么？",
          "answer": "交货时间取决于产品类型和数量。标准物品通常在7-14个工作日内在欧洲各地交付。我们还支持根据要求进行快速运输。"
        },
        "3": {
          "question": "你们能否向欧盟以外地区交付？",
          "answer": "是的，我们支持向广泛的市场进行国际运输，包括非欧盟国家。请联系我们，提供您的位置和所需材料进行物流评估。"
        },
        "4": {
          "question": "你们提供产品证书和技术文档吗？",
          "answer": "当然。大多数产品都带有EN标准证书和详细的技术数据表，可在文档页面或单个产品页面上获取。"
        },
        "5": {
          "question": "我如何请求报价？",
          "answer": "您可以通过我们网站上的联系表格、发送电子邮件至info@metanord.eu或拨打+372 5771 3442请求报价。请注明所需产品、数量和交货地点。"
        },
        "6": {
          "question": "MetaNord提供什么质量保证？",
          "answer": "我们所有的产品都经过严格的质量检查，以确保它们符合欧洲耐久性、安全性和性能标准。我们与保持严格质量控制系统的认证制造商合作。"
        }
      }
    }
  }
};

// Comprehensive product category translations
const productCategoryTranslations = {
  'en': {
    "products": {
      "filter": {
        "all": "All Products",
        "aluminum": "Aluminum",
        "polyethylene": "Polyethylene",
        "steel": "Steel",
        "castIron": "Cast Iron",
        "urbanInfrastructure": "Urban Infrastructure",
        "fittings": "Fittings",
        "rainwater": "Rainwater Solutions"
      },
      "categories": {
        "aluminum": "Aluminum",
        "polyethylene": "Polyethylene",
        "steel": "Steel",
        "castIron": "Cast Iron",
        "cast_iron": "Cast Iron",
        "cast-iron": "Cast Iron",
        "fittings": "Fittings",
        "urbanInfrastructure": "Urban Infrastructure"
      }
    }
  },
  'et': {
    "products": {
      "filter": {
        "all": "Kõik tooted",
        "aluminum": "Alumiinium",
        "polyethylene": "Polüetüleen",
        "steel": "Teras",
        "castIron": "Malm",
        "urbanInfrastructure": "Linnainfrastruktuur",
        "fittings": "Liitmikud",
        "rainwater": "Vihmaveeärastuslahendused"
      },
      "categories": {
        "aluminum": "Alumiinium",
        "polyethylene": "Polüetüleen",
        "steel": "Teras",
        "castIron": "Malm",
        "cast_iron": "Malm",
        "cast-iron": "Malm",
        "fittings": "Liitmikud",
        "urbanInfrastructure": "Linnainfrastruktuur"
      }
    }
  },
  'ru': {
    "products": {
      "filter": {
        "all": "Все продукты",
        "aluminum": "Алюминий",
        "polyethylene": "Полиэтилен",
        "steel": "Сталь",
        "castIron": "Чугун",
        "urbanInfrastructure": "Городская инфраструктура",
        "fittings": "Фитинги",
        "rainwater": "Решения для дождевой воды"
      },
      "categories": {
        "aluminum": "Алюминий",
        "polyethylene": "Полиэтилен",
        "steel": "Сталь",
        "castIron": "Чугун",
        "cast_iron": "Чугун",
        "cast-iron": "Чугун",
        "fittings": "Фитинги",
        "urbanInfrastructure": "Городская инфраструктура"
      }
    }
  },
  'lv': {
    "products": {
      "filter": {
        "all": "Visi produkti",
        "aluminum": "Alumīnijs",
        "polyethylene": "Polietilēns",
        "steel": "Tērauds",
        "castIron": "Čuguns",
        "urbanInfrastructure": "Pilsētas infrastruktūra",
        "fittings": "Savienojumi",
        "rainwater": "Lietus ūdens risinājumi"
      },
      "categories": {
        "aluminum": "Alumīnijs",
        "polyethylene": "Polietilēns",
        "steel": "Tērauds",
        "castIron": "Čuguns",
        "cast_iron": "Čuguns",
        "cast-iron": "Čuguns",
        "fittings": "Savienojumi",
        "urbanInfrastructure": "Pilsētas infrastruktūra"
      }
    }
  },
  'lt': {
    "products": {
      "filter": {
        "all": "Visi produktai",
        "aluminum": "Aliuminis",
        "polyethylene": "Polietilenas",
        "steel": "Plienas",
        "castIron": "Ketus",
        "urbanInfrastructure": "Miesto infrastruktūra",
        "fittings": "Jungtys",
        "rainwater": "Lietaus vandens sprendimai"
      },
      "categories": {
        "aluminum": "Aliuminis",
        "polyethylene": "Polietilenas",
        "steel": "Plienas",
        "castIron": "Ketus",
        "cast_iron": "Ketus",
        "cast-iron": "Ketus",
        "fittings": "Jungtys",
        "urbanInfrastructure": "Miesto infrastruktūra"
      }
    }
  },
  'pl': {
    "products": {
      "filter": {
        "all": "Wszystkie produkty",
        "aluminum": "Aluminium",
        "polyethylene": "Polietylen",
        "steel": "Stal",
        "castIron": "Żeliwo",
        "urbanInfrastructure": "Infrastruktura miejska",
        "fittings": "Złączki",
        "rainwater": "Rozwiązania do wody deszczowej"
      },
      "categories": {
        "aluminum": "Aluminium",
        "polyethylene": "Polietylen",
        "steel": "Stal",
        "castIron": "Żeliwo",
        "cast_iron": "Żeliwo",
        "cast-iron": "Żeliwo",
        "fittings": "Złączki",
        "urbanInfrastructure": "Infrastruktura miejska"
      }
    }
  },
  'zh-CN': {
    "products": {
      "filter": {
        "all": "所有产品",
        "aluminum": "铝",
        "polyethylene": "聚乙烯",
        "steel": "钢",
        "castIron": "铸铁",
        "urbanInfrastructure": "城市基础设施",
        "fittings": "配件",
        "rainwater": "雨水解决方案"
      },
      "categories": {
        "aluminum": "铝",
        "polyethylene": "聚乙烯",
        "steel": "钢",
        "castIron": "铸铁",
        "cast_iron": "铸铁",
        "cast-iron": "铸铁",
        "fittings": "配件",
        "urbanInfrastructure": "城市基础设施"
      }
    }
  }
};

// Translations for specific products
const specificProductTranslations = {
  'en': {
    "products": {
      "standard-profiles": {
        "title": "Standard Aluminum Profiles",
        "description": "High-quality aluminum profiles for structural, architectural, and industrial applications."
      },
      "machine-building-profiles": {
        "title": "Machine Building Profiles",
        "description": "Specialized aluminum profiles designed for machine building and automation."
      },
      "led-profiles": {
        "title": "LED Profiles",
        "description": "Aluminum profiles for LED lighting with integrated light diffusion options."
      },
      "special-profiles": {
        "title": "Special Profiles",
        "description": "Custom aluminum profiles for special projects and specific needs."
      },
      "hdpe-pipes": {
        "title": "HDPE Pipes",
        "description": "High-density polyethylene pipes for water supply, sewage, and gas distribution."
      },
      "double-corrugated-pipes": {
        "title": "Double Corrugated Pipes",
        "description": "Double-wall corrugated polyethylene pipes for drainage and sewage systems."
      },
      "reinforced-corrugated-pipes": {
        "title": "Reinforced Corrugated Pipes",
        "description": "Extra-strength corrugated pipes with enhanced load-bearing capacity."
      },
      "hsaw-pipes": {
        "title": "HSAW Steel Pipes",
        "description": "Helical submerged arc welded steel pipes for various infrastructure applications."
      },
      "oil-gas-pipes": {
        "title": "Oil & Gas Pipes",
        "description": "High-pressure steel pipes designed specifically for oil and gas transportation."
      }
    }
  },
  'et': {
    "products": {
      "standard-profiles": {
        "title": "Standardsed Alumiiniumprofiilid",
        "description": "Kõrgekvaliteedilised alumiiniumprofiilid ehituslikeks, arhitektuurilisteks ja tööstuslikeks rakendusteks."
      },
      "machine-building-profiles": {
        "title": "Masinaehitusprofiilid",
        "description": "Spetsiaalsed alumiiniumprofiilid, mis on mõeldud masinaehituseks ja automatiseerimiseks."
      },
      "led-profiles": {
        "title": "LED Profiilid",
        "description": "Alumiiniumprofiilid LED-valgustusele integreeritud valguse hajutamise võimalustega."
      },
      "special-profiles": {
        "title": "Eriprofiilid",
        "description": "Kohandatud alumiiniumprofiilid eriprojektidele ja spetsiifilistele vajadustele."
      },
      "hdpe-pipes": {
        "title": "HDPE Torud",
        "description": "Kõrgtihedusega polüetüleentorud veevarustuseks, kanalisatsiooniks ja gaasijaotuseks."
      },
      "double-corrugated-pipes": {
        "title": "Kahekordse Seinaga Gofreeritud Torud",
        "description": "Kahekordse seinaga gofreeritud polüetüleentorud drenaaži- ja kanalisatsioonisüsteemideks."
      },
      "reinforced-corrugated-pipes": {
        "title": "Tugevdatud Gofreeritud Torud",
        "description": "Eriti tugevad gofreeritud torud suurema kandevõimega."
      },
      "hsaw-pipes": {
        "title": "HSAW Terastorud",
        "description": "Spiraalselt sukeldatud kaarkeevitatud terastorud erinevateks infrastruktuuri rakendusteks."
      },
      "oil-gas-pipes": {
        "title": "Nafta ja Gaasi Torud",
        "description": "Kõrgsurve terastorud, mis on spetsiaalselt loodud nafta ja gaasi transportimiseks."
      }
    }
  },
  'ru': {
    "products": {
      "standard-profiles": {
        "title": "Стандартные Алюминиевые Профили",
        "description": "Высококачественные алюминиевые профили для конструкционных, архитектурных и промышленных применений."
      },
      "machine-building-profiles": {
        "title": "Профили для Машиностроения",
        "description": "Специализированные алюминиевые профили, разработанные для машиностроения и автоматизации."
      },
      "led-profiles": {
        "title": "LED Профили",
        "description": "Алюминиевые профили для светодиодного освещения с интегрированными опциями рассеивания света."
      },
      "special-profiles": {
        "title": "Специальные Профили",
        "description": "Индивидуальные алюминиевые профили для специальных проектов и конкретных потребностей."
      },
      "hdpe-pipes": {
        "title": "HDPE Трубы",
        "description": "Трубы из полиэтилена высокой плотности для водоснабжения, канализации и распределения газа."
      },
      "double-corrugated-pipes": {
        "title": "Двустенные Гофрированные Трубы",
        "description": "Двустенные гофрированные полиэтиленовые трубы для дренажных и канализационных систем."
      },
      "reinforced-corrugated-pipes": {
        "title": "Усиленные Гофрированные Трубы",
        "description": "Гофрированные трубы повышенной прочности с улучшенной несущей способностью."
      },
      "hsaw-pipes": {
        "title": "HSAW Стальные Трубы",
        "description": "Спирально-сварные стальные трубы для различных инфраструктурных применений."
      },
      "oil-gas-pipes": {
        "title": "Трубы для Нефти и Газа",
        "description": "Стальные трубы высокого давления, специально разработанные для транспортировки нефти и газа."
      }
    }
  },
  'lv': {
    "products": {
      "standard-profiles": {
        "title": "Standarta Alumīnija Profili",
        "description": "Augstas kvalitātes alumīnija profili strukturāliem, arhitektoniskiem un rūpnieciskiem pielietojumiem."
      },
      "machine-building-profiles": {
        "title": "Mašīnbūves Profili",
        "description": "Specializēti alumīnija profili, kas paredzēti mašīnbūvei un automatizācijai."
      },
      "led-profiles": {
        "title": "LED Profili",
        "description": "Alumīnija profili LED apgaismojumam ar integrētām gaismas difūzijas iespējām."
      },
      "special-profiles": {
        "title": "Speciālie Profili",
        "description": "Pielāgoti alumīnija profili īpašiem projektiem un specifiskām vajadzībām."
      },
      "hdpe-pipes": {
        "title": "HDPE Caurules",
        "description": "Augstas blīvuma polietilēna caurules ūdens apgādei, kanalizācijai un gāzes sadalei."
      },
      "double-corrugated-pipes": {
        "title": "Dubultsienu Gofrētās Caurules",
        "description": "Dubultsienu gofrētās polietilēna caurules drenāžas un kanalizācijas sistēmām."
      },
      "reinforced-corrugated-pipes": {
        "title": "Pastiprinātas Gofrētās Caurules",
        "description": "Īpaši izturīgas gofrētās caurules ar uzlabotu nestspēju."
      },
      "hsaw-pipes": {
        "title": "HSAW Tērauda Caurules",
        "description": "Spirāliski iegremdētas loka metinātas tērauda caurules dažādiem infrastruktūras pielietojumiem."
      },
      "oil-gas-pipes": {
        "title": "Naftas un Gāzes Caurules",
        "description": "Augstspiediena tērauda caurules, kas īpaši izstrādātas naftas un gāzes transportēšanai."
      }
    }
  },
  'lt': {
    "products": {
      "standard-profiles": {
        "title": "Standartiniai Aliuminio Profiliai",
        "description": "Aukštos kokybės aliuminio profiliai struktūriniams, architektūriniams ir pramoniniams pritaikymams."
      },
      "machine-building-profiles": {
        "title": "Mašinų Gamybos Profiliai",
        "description": "Specializuoti aliuminio profiliai, skirti mašinų gamybai ir automatizavimui."
      },
      "led-profiles": {
        "title": "LED Profiliai",
        "description": "Aliuminio profiliai LED apšvietimui su integruotomis šviesos difuzijos galimybėmis."
      },
      "special-profiles": {
        "title": "Specialūs Profiliai",
        "description": "Pritaikyti aliuminio profiliai specialiems projektams ir konkretiems poreikiams."
      },
      "hdpe-pipes": {
        "title": "HDPE Vamzdžiai",
        "description": "Didelio tankio polietileno vamzdžiai vandens tiekimui, nuotekoms ir dujų paskirstymui."
      },
      "double-corrugated-pipes": {
        "title": "Dvigubos Sienelės Gofruoti Vamzdžiai",
        "description": "Dvigubos sienelės gofruoti polietileno vamzdžiai drenažo ir nuotekų sistemoms."
      },
      "reinforced-corrugated-pipes": {
        "title": "Sustiprintas Gofruotos Vamzdžiai",
        "description": "Papildomos stiprybės gofruoti vamzdžiai su pagerintu apkrovos laikymo pajėgumu."
      },
      "hsaw-pipes": {
        "title": "HSAW Plieno Vamzdžiai",
        "description": "Spiralinio panardinto lanko suvirinimo plieno vamzdžiai įvairiems infrastruktūros pritaikymams."
      },
      "oil-gas-pipes": {
        "title": "Naftos ir Dujų Vamzdžiai",
        "description": "Aukšto slėgio plieno vamzdžiai, specialiai sukurti naftos ir dujų transportavimui."
      }
    }
  },
  'pl': {
    "products": {
      "standard-profiles": {
        "title": "Standardowe Profile Aluminiowe",
        "description": "Wysokiej jakości profile aluminiowe do zastosowań konstrukcyjnych, architektonicznych i przemysłowych."
      },
      "machine-building-profiles": {
        "title": "Profile do Budowy Maszyn",
        "description": "Specjalistyczne profile aluminiowe zaprojektowane do budowy maszyn i automatyzacji."
      },
      "led-profiles": {
        "title": "Profile LED",
        "description": "Profile aluminiowe do oświetlenia LED z zintegrowanymi opcjami dyfuzji światła."
      },
      "special-profiles": {
        "title": "Profile Specjalne",
        "description": "Niestandardowe profile aluminiowe do specjalnych projektów i specyficznych potrzeb."
      },
      "hdpe-pipes": {
        "title": "Rury HDPE",
        "description": "Rury z polietylenu o wysokiej gęstości do zaopatrzenia w wodę, kanalizacji i dystrybucji gazu."
      },
      "double-corrugated-pipes": {
        "title": "Rury Karbowane Dwuścienne",
        "description": "Dwuścienne rury karbowane z polietylenu do systemów drenażowych i kanalizacyjnych."
      },
      "reinforced-corrugated-pipes": {
        "title": "Wzmocnione Rury Karbowane",
        "description": "Rury karbowane o zwiększonej wytrzymałości i poprawionej nośności."
      },
      "hsaw-pipes": {
        "title": "Rury Stalowe HSAW",
        "description": "Spiralnie spawane rury stalowe do różnych zastosowań infrastrukturalnych."
      },
      "oil-gas-pipes": {
        "title": "Rury do Ropy i Gazu",
        "description": "Rury stalowe wysokociśnieniowe zaprojektowane specjalnie do transportu ropy i gazu."
      }
    }
  },
  'zh-CN': {
    "products": {
      "standard-profiles": {
        "title": "标准铝型材",
        "description": "用于结构、建筑和工业应用的高质量铝型材。"
      },
      "machine-building-profiles": {
        "title": "机械制造型材",
        "description": "专为机械制造和自动化设计的专用铝型材。"
      },
      "led-profiles": {
        "title": "LED型材",
        "description": "带有集成光扩散选项的LED照明铝型材。"
      },
      "special-profiles": {
        "title": "特殊型材",
        "description": "为特殊项目和特定需求定制的铝型材。"
      },
      "hdpe-pipes": {
        "title": "HDPE管道",
        "description": "用于供水、污水和燃气分配的高密度聚乙烯管道。"
      },
      "double-corrugated-pipes": {
        "title": "双壁波纹管",
        "description": "用于排水和污水系统的双壁波纹聚乙烯管道。"
      },
      "reinforced-corrugated-pipes": {
        "title": "加强波纹管",
        "description": "具有增强承载能力的超强波纹管。"
      },
      "hsaw-pipes": {
        "title": "HSAW钢管",
        "description": "用于各种基础设施应用的螺旋埋弧焊钢管。"
      },
      "oil-gas-pipes": {
        "title": "油气管道",
        "description": "专为石油和天然气运输设计的高压钢管。"
      }
    }
  }
};

// Main translation update function
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
      
      // 1. Add FAQ translations
      if (faqTranslations[language]) {
        translations = deepMerge(translations, faqTranslations[language]);
      }
      
      // 2. Add product category translations
      if (productCategoryTranslations[language]) {
        translations = deepMerge(translations, productCategoryTranslations[language]);
      }
      
      // 3. Add specific product translations
      if (specificProductTranslations[language]) {
        translations = deepMerge(translations, specificProductTranslations[language]);
      }
      
      // Write the updated translations back to file
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      
      console.log(`✅ Successfully updated ${language} translations`);
    } catch (error) {
      console.error(`❌ Error updating ${language} translations:`, error);
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
console.log('All translations have been updated successfully!');