/**
 * Complete Product Translation Update Script
 * 
 * This script adds comprehensive product translations to all language files.
 */

import fs from 'fs';
import path from 'path';

// Define all language files to update
const languages = ['en', 'et', 'ru', 'lv', 'lt', 'pl', 'zh-CN'];

// Complete product translations for all language files
const productTranslations = {
  // English product translations (as reference)
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
      },
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
        "description": "High-density polyethylene pipes with excellent chemical resistance."
      },
      "double-corrugated-pipes": {
        "title": "Double-Wall Corrugated Pipes",
        "description": "Corrugated double-wall pipes with enhanced strength and flexibility."
      },
      "reinforced-corrugated-pipes": {
        "title": "Reinforced Corrugated Pipes",
        "description": "Steel-reinforced polyethylene pipes for high-load applications."
      },
      "hsaw-pipes": {
        "title": "Spiral Welded Pipes",
        "description": "Spiral welded steel pipes for water and pile systems."
      },
      "oil-gas-pipes": {
        "title": "Oil and Gas Pipes",
        "description": "Specialized steel pipes for oil and gas product transportation."
      },
      "manhole-covers": {
        "title": "Manhole Covers",
        "description": "Cast iron manhole covers in various load classes."
      },
      "drainage-grates": {
        "title": "Drainage Grates",
        "description": "Cast iron drainage grates for efficient water removal."
      },
      "elbow-fitting": {
        "title": "90° Elbow Fitting",
        "description": "90° elbow fitting for polyethylene piping systems."
      },
      "elbow-45-fitting": {
        "title": "45° Elbow Fitting",
        "description": "45° elbow fitting for polyethylene piping systems."
      },
      "tee-fitting": {
        "title": "Tee Fitting",
        "description": "T-shaped fitting for polyethylene piping systems."
      },
      "flange-adapter": {
        "title": "Flange Adapter",
        "description": "Flange adapter for polyethylene piping systems."
      },
      "gate-valve": {
        "title": "Gate Valve",
        "description": "Cast iron gate valve for water systems."
      },
      "butterfly-valve": {
        "title": "Butterfly Valve",
        "description": "Cast iron butterfly valve for various applications."
      },
      "ground-fire-hydrant": {
        "title": "Ground Fire Hydrant",
        "description": "Ground fire hydrant for emergency water access."
      },
      "drainage-channel": {
        "title": "Drainage Channel",
        "description": "High-resistance drainage channel for stormwater collection."
      },
      "rainwater-grill-d400-standard": {
        "title": "D400 Rainwater Grill",
        "description": "Standard D400 load class rainwater grill for roads."
      },
      "rainwater-grill-d400-type2": {
        "title": "D400 Type 2 Rainwater Grill",
        "description": "Enhanced D400 load class rainwater grill for heavy traffic areas."
      },
      "rainwater-grill-meria": {
        "title": "Meria Rainwater Grill",
        "description": "Specialized Meria design rainwater grill for urban applications."
      },
      "rainwater-grill-f900": {
        "title": "F900 Rainwater Grill",
        "description": "F900 extremely heavy-duty rainwater grill for industrial applications."
      },
      "waste-box": {
        "title": "Waste Collection Box",
        "description": "Urban waste collection solution for public spaces."
      }
    }
  },
  
  // Estonian product translations
  'et': {
    "products": {
      "filter": {
        "all": "Kõik tooted",
        "aluminum": "Alumiinium",
        "polyethylene": "Polüetüleen",
        "steel": "Teras",
        "castIron": "Malm",
        "urbanInfrastructure": "Linnainfrastruktuur",
        "fittings": "Toruliitmikud",
        "rainwater": "Vihmaveerennid"
      },
      "categories": {
        "aluminum": "Alumiinium",
        "polyethylene": "Polüetüleen",
        "steel": "Teras",
        "castIron": "Malm",
        "cast_iron": "Malm",
        "cast-iron": "Malm",
        "fittings": "Toruliitmikud",
        "urbanInfrastructure": "Linnainfrastruktuur"
      },
      "standard-profiles": {
        "title": "Standardsed alumiiniumprofiilid",
        "description": "Kõrgekvaliteetsed alumiiniumprofiilid konstruktsiooni-, arhitektuuri- ja tööstusrakendusteks"
      },
      "machine-building-profiles": {
        "title": "Masinaehituse profiilid",
        "description": "Spetsiaalsed alumiiniumprofiilid, mis on loodud masinaehituse ja automatiseerimise jaoks"
      },
      "led-profiles": {
        "title": "LED-profiilid",
        "description": "Alumiiniumprofiilid LED-valgustusele integreeritud valguse hajutamise võimalustega"
      },
      "special-profiles": {
        "title": "Eriprofiilid",
        "description": "Kohandatud alumiiniumprofiilid spetsiaalseteks projektideks ja konkreetseteks vajadusteks"
      },
      "hdpe-pipes": {
        "title": "HDPE-torud",
        "description": "Kõrge tihedusega polüetüleentorud suurepärase keemilise vastupidavusega"
      },
      "double-corrugated-pipes": {
        "title": "Kahekihilised gofreeritud torud",
        "description": "Kahekihilised gofreeritud torud suurendatud tugevuse ja paindlikkusega"
      },
      "reinforced-corrugated-pipes": {
        "title": "Tugevdatud gofreeritud torud",
        "description": "Terasega tugevdatud polüetüleentorud suurtele koormustele"
      },
      "hsaw-pipes": {
        "title": "Spiraalkeevitusega torud",
        "description": "Spiraalkeevitusega terastorud vee- ja vaiadusteks"
      },
      "oil-gas-pipes": {
        "title": "Nafta- ja gaasitorud",
        "description": "Spetsiaalsed terastorud nafta- ja gaasiproduktide transportimiseks"
      },
      "manhole-covers": {
        "title": "Kanalisatsioonikaevude kaaned",
        "description": "Malmikaaned kanalisatsioonikaevudele erinevates koormusklassides"
      },
      "drainage-grates": {
        "title": "Drenaaživõred",
        "description": "Malmist drenaaživõred tõhusaks vee ärajuhtimiseks"
      },
      "elbow-fitting": {
        "title": "90° põlv",
        "description": "90° põlv polüetüleenist torusüsteemidele"
      },
      "elbow-45-fitting": {
        "title": "45° põlv",
        "description": "45° põlv polüetüleenist torusüsteemidele"
      },
      "tee-fitting": {
        "title": "T-liitmik",
        "description": "T-liitmik polüetüleenist torusüsteemidele"
      },
      "flange-adapter": {
        "title": "Äärikadapter",
        "description": "Äärikadapter polüetüleenist torusüsteemidele"
      },
      "gate-valve": {
        "title": "Siibriventii",
        "description": "Malmist siibriventii veesüsteemidele"
      },
      "butterfly-valve": {
        "title": "Libliklapp",
        "description": "Malmist libliklapp erinevateks rakendusteks"
      },
      "ground-fire-hydrant": {
        "title": "Maapealne tuletõrjehüdrant",
        "description": "Maapealne tuletõrjehüdrant hädaolukorra veevarustuseks"
      },
      "drainage-channel": {
        "title": "Drenaaž kanal",
        "description": "Kõrge vastupidavusega drenaaž kanal vihmavee kogumiseks"
      },
      "rainwater-grill-d400-standard": {
        "title": "D400 vihmatratt",
        "description": "Standardne D400 koormusklassi vihmatratt teedele"
      },
      "rainwater-grill-d400-type2": {
        "title": "D400 tüüp 2 vihmatratt",
        "description": "Täiustatud D400 koormusklassi vihmatratt suure liiklusega aladele"
      },
      "rainwater-grill-meria": {
        "title": "Meria vihmatratt",
        "description": "Spetsiaalne Meria disainiga vihmatratt linnarakendusteks"
      },
      "rainwater-grill-f900": {
        "title": "F900 vihmatratt",
        "description": "F900 eriti tugev vihmatratt tööstusrakendusteks"
      },
      "waste-box": {
        "title": "Jäätmekogumiskast",
        "description": "Linnajäätmete kogumislahendus avalikele ruumidele"
      }
    }
  },
  
  // Russian product translations
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
        "rainwater": "Ливневые решетки"
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
      },
      "standard-profiles": {
        "title": "Стандартные алюминиевые профили",
        "description": "Высококачественные алюминиевые профили для конструкционных, архитектурных и промышленных применений"
      },
      "machine-building-profiles": {
        "title": "Профили для машиностроения",
        "description": "Специализированные алюминиевые профили, разработанные для машиностроения и автоматизации"
      },
      "led-profiles": {
        "title": "LED-профили",
        "description": "Алюминиевые профили для LED-освещения с интегрированными возможностями рассеивания света"
      },
      "special-profiles": {
        "title": "Специальные профили",
        "description": "Индивидуально разработанные алюминиевые профили для специальных проектов и конкретных потребностей"
      },
      "hdpe-pipes": {
        "title": "HDPE-трубы",
        "description": "Трубы из полиэтилена высокой плотности с отличной химической стойкостью"
      },
      "double-corrugated-pipes": {
        "title": "Двустенные гофрированные трубы",
        "description": "Двустенные гофрированные трубы с повышенной прочностью и гибкостью"
      },
      "reinforced-corrugated-pipes": {
        "title": "Армированные гофрированные трубы",
        "description": "Армированные сталью полиэтиленовые трубы для высоких нагрузок"
      },
      "hsaw-pipes": {
        "title": "Спирально-сварные трубы",
        "description": "Спирально-сварные стальные трубы для водоснабжения и свайных систем"
      },
      "oil-gas-pipes": {
        "title": "Нефтегазовые трубы",
        "description": "Специализированные стальные трубы для транспортировки нефтегазовой продукции"
      },
      "manhole-covers": {
        "title": "Крышки люков",
        "description": "Чугунные крышки люков канализации различных классов нагрузки"
      },
      "drainage-grates": {
        "title": "Дренажные решетки",
        "description": "Чугунные дренажные решетки для эффективного отвода воды"
      },
      "elbow-fitting": {
        "title": "Отвод 90°",
        "description": "Отвод 90° для полиэтиленовых трубопроводных систем"
      },
      "elbow-45-fitting": {
        "title": "Отвод 45°",
        "description": "Отвод 45° для полиэтиленовых трубопроводных систем"
      },
      "tee-fitting": {
        "title": "Тройник",
        "description": "Тройник для полиэтиленовых трубопроводных систем"
      },
      "flange-adapter": {
        "title": "Фланцевый адаптер",
        "description": "Фланцевый адаптер для полиэтиленовых трубопроводных систем"
      },
      "gate-valve": {
        "title": "Задвижка",
        "description": "Чугунная задвижка для водопроводных систем"
      },
      "butterfly-valve": {
        "title": "Дисковый затвор",
        "description": "Чугунный дисковый затвор для различных применений"
      },
      "ground-fire-hydrant": {
        "title": "Наземный пожарный гидрант",
        "description": "Наземный пожарный гидрант для экстренного доступа к воде"
      },
      "drainage-channel": {
        "title": "Дренажный канал",
        "description": "Высокопрочный дренажный канал для сбора ливневых вод"
      },
      "rainwater-grill-d400-standard": {
        "title": "Ливневая решетка D400",
        "description": "Стандартная ливневая решетка класса D400 для дорог"
      },
      "rainwater-grill-d400-type2": {
        "title": "Ливневая решетка D400 тип 2",
        "description": "Улучшенная ливневая решетка класса D400 для зон с интенсивным движением"
      },
      "rainwater-grill-meria": {
        "title": "Ливневая решетка Meria",
        "description": "Специализированная ливневая решетка дизайна Meria для городского применения"
      },
      "rainwater-grill-f900": {
        "title": "Ливневая решетка F900",
        "description": "Ливневая решетка F900 сверхвысокой прочности для промышленного применения"
      },
      "waste-box": {
        "title": "Контейнер для мусора",
        "description": "Городское решение для сбора отходов в общественных местах"
      }
    }
  },
  
  // Latvian product translations
  'lv': {
    "products": {
      "filter": {
        "all": "Visi produkti",
        "aluminum": "Alumīnijs",
        "polyethylene": "Polietilēns",
        "steel": "Tērauds",
        "castIron": "Čuguns",
        "urbanInfrastructure": "Pilsētas infrastruktūra",
        "fittings": "Cauruļu veidgabali",
        "rainwater": "Lietus ūdens režģi"
      },
      "categories": {
        "aluminum": "Alumīnijs",
        "polyethylene": "Polietilēns",
        "steel": "Tērauds",
        "castIron": "Čuguns", 
        "cast_iron": "Čuguns",
        "cast-iron": "Čuguns",
        "fittings": "Cauruļu veidgabali",
        "urbanInfrastructure": "Pilsētas infrastruktūra"
      },
      "standard-profiles": {
        "title": "Standarta alumīnija profili",
        "description": "Augstas kvalitātes alumīnija profili struktūras, arhitektūras un rūpnieciskiem pielietojumiem"
      },
      "machine-building-profiles": {
        "title": "Mašīnbūves profili",
        "description": "Specializēti alumīnija profili, kas izstrādāti mašīnbūvei un automatizācijai"
      },
      "led-profiles": {
        "title": "LED profili",
        "description": "Alumīnija profili LED apgaismojumam ar integrētām gaismas difūzijas opcijām"
      },
      "special-profiles": {
        "title": "Speciālie profili",
        "description": "Pielāgoti alumīnija profili īpašiem projektiem un specifiskām vajadzībām"
      },
      "hdpe-pipes": {
        "title": "HDPE caurules",
        "description": "Augstas blīvuma polietilēna caurules ar izcilu ķīmisko izturību"
      },
      "double-corrugated-pipes": {
        "title": "Dubultsienu gofrētās caurules",
        "description": "Gofrētās dubultsienu caurules ar uzlabotu izturību un elastību"
      },
      "reinforced-corrugated-pipes": {
        "title": "Armētās gofrētās caurules",
        "description": "Tērauda armētās polietilēna caurules lielām slodzēm"
      },
      "hsaw-pipes": {
        "title": "Spirālmetinātās caurules",
        "description": "Spirālmetinātās tērauda caurules ūdens un pāļu sistēmām"
      },
      "oil-gas-pipes": {
        "title": "Naftas un gāzes caurules",
        "description": "Specializētas tērauda caurules naftas un gāzes produktu transportēšanai"
      },
      "manhole-covers": {
        "title": "Kanalizācijas lūkas",
        "description": "Čuguna kanalizācijas lūkas dažādās slodzes klasēs"
      },
      "drainage-grates": {
        "title": "Drenāžas restes",
        "description": "Čuguna drenāžas restes efektīvai ūdens novadīšanai"
      },
      "elbow-fitting": {
        "title": "90° līkuma savienojums",
        "description": "90° līkuma savienojums polietilēna cauruļu sistēmām"
      },
      "elbow-45-fitting": {
        "title": "45° līkuma savienojums",
        "description": "45° līkuma savienojums polietilēna cauruļu sistēmām"
      },
      "tee-fitting": {
        "title": "T-veida savienojums",
        "description": "T-veida savienojums polietilēna cauruļu sistēmām"
      },
      "flange-adapter": {
        "title": "Atloka adapteris",
        "description": "Atloka adapteris polietilēna cauruļu sistēmām"
      },
      "gate-valve": {
        "title": "Aizbīdnis",
        "description": "Čuguna aizbīdnis ūdens sistēmām"
      },
      "butterfly-valve": {
        "title": "Tauriņvārsts",
        "description": "Čuguna tauriņvārsts dažādiem pielietojumiem"
      },
      "ground-fire-hydrant": {
        "title": "Virszemes ugunsdzēsības hidrants",
        "description": "Virszemes ugunsdzēsības hidrants ārkārtas ūdens piekļuvei"
      },
      "drainage-channel": {
        "title": "Drenāžas kanāls",
        "description": "Augsti izturīgs drenāžas kanāls lietus ūdens savākšanai"
      },
      "rainwater-grill-d400-standard": {
        "title": "D400 lietus ūdens reste",
        "description": "Standarta D400 slodzes klases lietus ūdens reste ceļiem"
      },
      "rainwater-grill-d400-type2": {
        "title": "D400 2. tipa lietus ūdens reste",
        "description": "Uzlabota D400 slodzes klases lietus ūdens reste intensīvas satiksmes zonām"
      },
      "rainwater-grill-meria": {
        "title": "Meria lietus ūdens reste",
        "description": "Specializēta Meria dizaina lietus ūdens reste pilsētvides pielietojumiem"
      },
      "rainwater-grill-f900": {
        "title": "F900 lietus ūdens reste",
        "description": "F900 īpaši izturīga lietus ūdens reste rūpnieciskajiem pielietojumiem"
      },
      "waste-box": {
        "title": "Atkritumu savākšanas kaste",
        "description": "Pilsētas atkritumu savākšanas risinājums sabiedriskām vietām"
      }
    }
  },
  
  // Lithuanian product translations
  'lt': {
    "products": {
      "filter": {
        "all": "Visi produktai",
        "aluminum": "Aliuminis",
        "polyethylene": "Polietilenas",
        "steel": "Plienas",
        "castIron": "Ketaus",
        "urbanInfrastructure": "Miesto infrastruktūra",
        "fittings": "Vamzdžių jungtys",
        "rainwater": "Lietaus vandens grotelės"
      },
      "categories": {
        "aluminum": "Aliuminis",
        "polyethylene": "Polietilenas",
        "steel": "Plienas",
        "castIron": "Ketaus",
        "cast_iron": "Ketaus",
        "cast-iron": "Ketaus",
        "fittings": "Vamzdžių jungtys",
        "urbanInfrastructure": "Miesto infrastruktūra"
      },
      "standard-profiles": {
        "title": "Standartiniai aliuminio profiliai",
        "description": "Aukštos kokybės aliuminio profiliai struktūriniams, architektūriniams ir pramoniniams tikslams"
      },
      "machine-building-profiles": {
        "title": "Mašinų gamybos profiliai",
        "description": "Specializuoti aliuminio profiliai, skirti mašinų gamybai ir automatizavimui"
      },
      "led-profiles": {
        "title": "LED profiliai",
        "description": "Aliuminio profiliai LED apšvietimui su integruotomis šviesos sklaidymo galimybėmis"
      },
      "special-profiles": {
        "title": "Specialūs profiliai",
        "description": "Pritaikyti aliuminio profiliai specialiems projektams ir specifiniams poreikiams"
      },
      "hdpe-pipes": {
        "title": "HDPE vamzdžiai",
        "description": "Didelio tankio polietileno vamzdžiai su puikiu atsparumu cheminėms medžiagoms"
      },
      "double-corrugated-pipes": {
        "title": "Dvigubi gofruoti vamzdžiai",
        "description": "Gofruoti dvigubų sienelių vamzdžiai su pagerintu stiprumu ir lankstumu"
      },
      "reinforced-corrugated-pipes": {
        "title": "Armuoti gofruoti vamzdžiai",
        "description": "Plienu armuoti polietileno vamzdžiai sunkioms apkrovoms"
      },
      "hsaw-pipes": {
        "title": "Spiraliniai suvirintiniai vamzdžiai",
        "description": "Spiraliniai suvirintiniai plieniniai vamzdžiai vandens ir polinėms sistemoms"
      },
      "oil-gas-pipes": {
        "title": "Naftos ir dujų vamzdžiai",
        "description": "Specializuoti plieniniai vamzdžiai naftos ir dujų produktų transportavimui"
      },
      "manhole-covers": {
        "title": "Kanalizacijos šulinių dangčiai",
        "description": "Ketaus kanalizacijos šulinių dangčiai įvairioms apkrovų klasėms"
      },
      "drainage-grates": {
        "title": "Drenažo grotelės",
        "description": "Ketaus drenažo grotelės efektyviam vandens nuvedimui"
      },
      "elbow-fitting": {
        "title": "90° alkūnės jungtis",
        "description": "90° alkūnės jungtis polietileno vamzdžių sistemoms"
      },
      "elbow-45-fitting": {
        "title": "45° alkūnės jungtis",
        "description": "45° alkūnės jungtis polietileno vamzdžių sistemoms"
      },
      "tee-fitting": {
        "title": "T formos jungtis",
        "description": "T formos jungtis polietileno vamzdžių sistemoms"
      },
      "flange-adapter": {
        "title": "Jungės adapteris",
        "description": "Jungės adapteris polietileno vamzdžių sistemoms"
      },
      "gate-valve": {
        "title": "Sklendė",
        "description": "Ketaus sklendė vandens sistemoms"
      },
      "butterfly-valve": {
        "title": "Droselinė sklendė",
        "description": "Ketaus droselinė sklendė įvairiems pritaikymams"
      },
      "ground-fire-hydrant": {
        "title": "Antžeminis gaisrinis hidrantas",
        "description": "Antžeminis gaisrinis hidrantas avariniam vandens tiekimui"
      },
      "drainage-channel": {
        "title": "Drenažo kanalas",
        "description": "Didelio atsparumo drenažo kanalas lietaus vandens surinkimui"
      },
      "rainwater-grill-d400-standard": {
        "title": "D400 lietaus vandens grotelės",
        "description": "Standartinės D400 apkrovos klasės lietaus vandens grotelės keliams"
      },
      "rainwater-grill-d400-type2": {
        "title": "D400 2 tipo lietaus vandens grotelės",
        "description": "Pagerintos D400 apkrovos klasės lietaus vandens grotelės intensyvaus eismo zonoms"
      },
      "rainwater-grill-meria": {
        "title": "Meria lietaus vandens grotelės",
        "description": "Specializuotos Meria dizaino lietaus vandens grotelės miesto poreikiams"
      },
      "rainwater-grill-f900": {
        "title": "F900 lietaus vandens grotelės",
        "description": "F900 ypač didelio atsparumo lietaus vandens grotelės pramoniniam naudojimui"
      },
      "waste-box": {
        "title": "Atliekų surinkimo dėžė",
        "description": "Miesto atliekų surinkimo sprendimas viešosioms erdvėms"
      }
    }
  },
  
  // Polish product translations
  'pl': {
    "products": {
      "filter": {
        "all": "Wszystkie produkty",
        "aluminum": "Aluminium",
        "polyethylene": "Polietylen",
        "steel": "Stal",
        "castIron": "Żeliwo",
        "urbanInfrastructure": "Infrastruktura miejska",
        "fittings": "Złączki rurowe",
        "rainwater": "Kraty deszczowe"
      },
      "categories": {
        "aluminum": "Aluminium",
        "polyethylene": "Polietylen",
        "steel": "Stal",
        "castIron": "Żeliwo",
        "cast_iron": "Żeliwo",
        "cast-iron": "Żeliwo",
        "fittings": "Złączki rurowe",
        "urbanInfrastructure": "Infrastruktura miejska"
      },
      "standard-profiles": {
        "title": "Standardowe profile aluminiowe",
        "description": "Wysokiej jakości profile aluminiowe do zastosowań konstrukcyjnych, architektonicznych i przemysłowych"
      },
      "machine-building-profiles": {
        "title": "Profile do budowy maszyn",
        "description": "Specjalistyczne profile aluminiowe zaprojektowane do budowy maszyn i automatyki"
      },
      "led-profiles": {
        "title": "Profile LED",
        "description": "Profile aluminiowe do oświetlenia LED z zintegrowanymi opcjami dyfuzji światła"
      },
      "special-profiles": {
        "title": "Profile specjalne",
        "description": "Niestandardowe profile aluminiowe do projektów specjalnych i określonych potrzeb"
      },
      "hdpe-pipes": {
        "title": "Rury HDPE",
        "description": "Rury z polietylenu o wysokiej gęstości o doskonałej odporności chemicznej"
      },
      "double-corrugated-pipes": {
        "title": "Rury dwuścienne karbowane",
        "description": "Karbowane rury dwuścienne o zwiększonej wytrzymałości i elastyczności"
      },
      "reinforced-corrugated-pipes": {
        "title": "Wzmocnione rury karbowane",
        "description": "Rury polietylenowe wzmocnione stalą do zastosowań pod dużym obciążeniem"
      },
      "hsaw-pipes": {
        "title": "Rury spawane spiralnie",
        "description": "Spiralnie spawane rury stalowe do zastosowań wodnych i palowych"
      },
      "oil-gas-pipes": {
        "title": "Rury do ropy i gazu",
        "description": "Specjalistyczne rury stalowe do transportu produktów naftowych i gazowych"
      },
      "manhole-covers": {
        "title": "Włazy studzienek",
        "description": "Żeliwne włazy studzienek kanalizacyjnych w różnych klasach obciążenia"
      },
      "drainage-grates": {
        "title": "Kraty ściekowe",
        "description": "Żeliwne kraty ściekowe zapewniające efektywne odprowadzanie wody"
      },
      "elbow-fitting": {
        "title": "Kolano 90°",
        "description": "Kolano 90° do systemów rurowych z polietylenu"
      },
      "elbow-45-fitting": {
        "title": "Kolano 45°",
        "description": "Kolano 45° do systemów rurowych z polietylenu"
      },
      "tee-fitting": {
        "title": "Trójnik",
        "description": "Trójnik do systemów rurowych z polietylenu"
      },
      "flange-adapter": {
        "title": "Adapter kołnierzowy",
        "description": "Adapter kołnierzowy do systemów rurowych z polietylenu"
      },
      "gate-valve": {
        "title": "Zasuwa",
        "description": "Żeliwna zasuwa do systemów wodnych"
      },
      "butterfly-valve": {
        "title": "Zawór motylkowy",
        "description": "Żeliwny zawór motylkowy do różnych zastosowań"
      },
      "ground-fire-hydrant": {
        "title": "Naziemny hydrant przeciwpożarowy",
        "description": "Naziemny hydrant przeciwpożarowy do awaryjnego dostępu do wody"
      },
      "drainage-channel": {
        "title": "Kanał odwadniający",
        "description": "Wysoko wytrzymały kanał odwadniający do zbierania wód opadowych"
      },
      "rainwater-grill-d400-standard": {
        "title": "Krata deszczowa D400",
        "description": "Standardowa krata deszczowa klasy obciążenia D400 do dróg"
      },
      "rainwater-grill-d400-type2": {
        "title": "Krata deszczowa D400 typu 2",
        "description": "Ulepszona krata deszczowa klasy obciążenia D400 do obszarów o dużym natężeniu ruchu"
      },
      "rainwater-grill-meria": {
        "title": "Krata deszczowa Meria",
        "description": "Specjalistyczna krata deszczowa o konstrukcji Meria do zastosowań miejskich"
      },
      "rainwater-grill-f900": {
        "title": "Krata deszczowa F900",
        "description": "Krata deszczowa F900 o wyjątkowo dużej wytrzymałości do zastosowań przemysłowych"
      },
      "waste-box": {
        "title": "Pojemnik na odpady",
        "description": "Miejskie rozwiązanie do zbierania odpadów w przestrzeniach publicznych"
      }
    }
  },
  
  // Chinese product translations
  'zh-CN': {
    "products": {
      "filter": {
        "all": "所有产品",
        "aluminum": "铝材",
        "polyethylene": "聚乙烯",
        "steel": "钢铁",
        "castIron": "铸铁",
        "urbanInfrastructure": "城市基础设施",
        "fittings": "管道配件",
        "rainwater": "雨水格栅"
      },
      "categories": {
        "aluminum": "铝材",
        "polyethylene": "聚乙烯",
        "steel": "钢铁",
        "castIron": "铸铁",
        "cast_iron": "铸铁",
        "cast-iron": "铸铁",
        "fittings": "管道配件",
        "urbanInfrastructure": "城市基础设施"
      },
      "standard-profiles": {
        "title": "标准铝型材",
        "description": "高质量铝型材，用于结构、建筑和工业应用"
      },
      "machine-building-profiles": {
        "title": "机械制造铝型材",
        "description": "专为机械工程和自动化设备设计的特殊铝型材系统"
      },
      "led-profiles": {
        "title": "LED灯铝型材",
        "description": "用于LED照明系统的铝型材，具有集成光扩散选项"
      },
      "special-profiles": {
        "title": "特殊铝型材",
        "description": "为特殊项目和特定需求定制设计的铝型材"
      },
      "hdpe-pipes": {
        "title": "HDPE管道",
        "description": "具有优异耐化学性的高密度聚乙烯管道"
      },
      "double-corrugated-pipes": {
        "title": "双壁波纹管",
        "description": "具有增强强度和灵活性的双壁波纹管"
      },
      "reinforced-corrugated-pipes": {
        "title": "钢筋增强波纹管",
        "description": "用于高负载应用的钢筋强化聚乙烯管"
      },
      "hsaw-pipes": {
        "title": "螺旋焊接钢管",
        "description": "用于水和桩工程的螺旋焊接钢管"
      },
      "oil-gas-pipes": {
        "title": "油气用钢管",
        "description": "专为油气产品运输设计的专业钢管"
      },
      "manhole-covers": {
        "title": "井盖",
        "description": "各种负载等级的铸铁井盖"
      },
      "drainage-grates": {
        "title": "排水沟盖板",
        "description": "用于高效排水的铸铁排水沟盖板"
      },
      "elbow-fitting": {
        "title": "90°弯头",
        "description": "聚乙烯管道系统用90°弯头"
      },
      "elbow-45-fitting": {
        "title": "45°弯头",
        "description": "聚乙烯管道系统用45°弯头"
      },
      "tee-fitting": {
        "title": "三通",
        "description": "聚乙烯管道系统用三通"
      },
      "flange-adapter": {
        "title": "法兰适配器",
        "description": "聚乙烯管道系统用法兰适配器"
      },
      "gate-valve": {
        "title": "闸阀",
        "description": "水系统用铸铁闸阀"
      },
      "butterfly-valve": {
        "title": "蝶阀",
        "description": "各种应用的铸铁蝶阀"
      },
      "ground-fire-hydrant": {
        "title": "地上消防栓",
        "description": "紧急供水用地上消防栓"
      },
      "drainage-channel": {
        "title": "排水渠",
        "description": "用于雨水收集的高强度排水渠"
      },
      "rainwater-grill-d400-standard": {
        "title": "D400雨水格栅",
        "description": "用于道路的标准D400负载级别雨水格栅"
      },
      "rainwater-grill-d400-type2": {
        "title": "D400二型雨水格栅",
        "description": "用于高交通区域的加强型D400负载级别雨水格栅"
      },
      "rainwater-grill-meria": {
        "title": "Meria雨水格栅",
        "description": "专为城市应用设计的Meria款式雨水格栅"
      },
      "rainwater-grill-f900": {
        "title": "F900雨水格栅",
        "description": "用于工业应用的F900超重型雨水格栅"
      },
      "waste-box": {
        "title": "垃圾收集箱",
        "description": "公共场所城市垃圾收集解决方案"
      }
    }
  }
};

// Function to update language files with translations
function updateLanguageFile(lang, translations) {
  const filePath = path.join('client', 'src', 'locales', `${lang}.json`);
  
  try {
    // Read existing translations
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let existingTranslations = JSON.parse(fileContent);
    
    // Deep merge the translations
    existingTranslations = deepMerge(existingTranslations, translations);
    
    // Write updated translations back to file
    fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2), 'utf8');
    console.log(`Updated ${lang}.json with complete product translations`);
  } catch (error) {
    console.error(`Error updating ${lang}.json:`, error);
  }
}

// Helper function for deep merging objects
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(source) && isObject(output)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in output)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(output[key], source[key]);
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

// Update all translations
function updateAllTranslations() {
  // Update all supported languages
  for (const lang of languages) {
    if (productTranslations[lang]) {
      updateLanguageFile(lang, productTranslations[lang]);
    }
  }
  
  console.log("All product translations have been updated successfully!");
}

// Run the update
updateAllTranslations();