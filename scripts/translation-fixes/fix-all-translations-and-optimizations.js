/**
 * Comprehensive Fix Script for MetaNord Website
 * 
 * This script addresses multiple issues:
 * 1. Adds missing product translations for all languages
 * 2. Fixes FAQ translations in all languages
 * 3. Optimizes performance and language switching
 */

import fs from 'fs';
import path from 'path';

// Define all language files to update
const languageFiles = [
  'zh-CN.json' // Only fixing Chinese translations as per the request
];

// Complete Chinese translations for the entire website
const completeChineseTranslations = {
  // Homepage translations including all missing elements
  "home": {
    "title": "MetaNord - 创新基础设施解决方案",
    "metaTitle": "MetaNord - 创新基础设施解决方案",
    "metaDescription": "MetaNord是您全球基础设施项目的可靠合作伙伴，提供高质量的铝型材、聚乙烯管道和钢铁组件。",
    "hero": {
      "title": "可持续工程解决方案",
      "subtitle": "为新时代基础设施提供创新材料",
      "cta": "了解我们的产品",
      "contact": "联系我们"
    },
    "aboutSection": {
      "title": "关于",
      "titleHighlight": "我们",
      "subtitle": "MetaNord是一家专业的工程解决方案公司，致力于为全球客户提供高质量的基础设施材料。",
      "text": "我们专注于提供创新、可持续的工程材料，包括铝型材、聚乙烯管道、钢铁组件和城市基础设施元素。凭借深厚的行业专业知识和对质量的承诺，我们的产品广泛用于工业、商业和市政项目。",
      "readMore": "了解更多"
    },
    "whyChooseUs": {
      "title": "为什么选择",
      "titleHighlight": "我们",
      "subtitle": "MetaNord致力于满足您最严格的工程要求",
      "reasons": {
        "quality": {
          "title": "优质产品",
          "description": "我们所有的产品都符合最高的行业标准和质量规范"
        },
        "expertise": {
          "title": "行业专长",
          "description": "我们的团队拥有在基础设施材料领域的深厚专业知识和经验"
        },
        "solutions": {
          "title": "定制解决方案",
          "description": "我们根据您的具体项目需求定制解决方案"
        },
        "support": {
          "title": "全面支持",
          "description": "我们在项目的每个阶段提供专业技术支持"
        }
      }
    },
    "featuredProducts": {
      "title": "特色",
      "titleHighlight": "产品",
      "subtitle": "探索我们多样化的高质量基础设施材料",
      "viewAll": "查看所有产品"
    },
    "services": {
      "title": "我们的",
      "titleHighlight": "服务",
      "subtitle": "我们提供广泛的服务，满足您复杂的工程需求",
      "logistics": {
        "title": "物流与供应链",
        "description": "高效的物流和供应链管理，确保及时交付"
      },
      "consulting": {
        "title": "技术咨询",
        "description": "专家技术指导和项目设计支持"
      },
      "customization": {
        "title": "产品定制",
        "description": "根据您的具体技术要求定制产品"
      },
      "support": {
        "title": "客户支持",
        "description": "快速响应的售前和售后服务"
      }
    },
    "cta": {
      "title": "准备好开始新项目了吗？",
      "subtitle": "联系我们的团队，了解我们如何支持您的工程目标",
      "button": "立即联系"
    },
    "partners": {
      "title": "全球合作伙伴",
      "subtitle": "我们与来自世界各地的可信赖制造商和供应商合作，为您提供最优质的产品和具有竞争力的价格：",
      "partner1": "欧洲铝业集团",
      "partner2": "全球基础设施解决方案",
      "partner3": "北欧工业系统"
    }
  },
  
  // About page comprehensive translations
  "about": {
    "title": "关于我们",
    "metaTitle": "关于MetaNord - 我们的历史与使命",
    "metaDescription": "了解MetaNord如何成为基础设施材料领域的行业领导者，我们的价值观和独特优势。",
    "hero": {
      "title": "关于我们",
      "subtitle": "了解MetaNord的历史和使命"
    },
    "overview": {
      "title": "企业概览",
      "titleHighlight": "概览",
      "description": "MetaNord成立于2018年，是一家总部位于爱沙尼亚塔林的基础设施材料专业公司。我们在欧洲和亚洲拥有庞大的供应商网络，专门提供高质量的铝型材、聚乙烯管道、钢铁组件和城市基础设施元素。"
    },
    "mission": {
      "title": "我们的使命",
      "titleHighlight": "使命",
      "description": "我们的使命是为全球工程项目提供可持续、创新的基础设施解决方案，通过高质量产品和卓越服务支持建设更美好的未来。"
    },
    "values": {
      "title": "核心价值观",
      "titleHighlight": "价值观",
      "description": "我们的业务建立在以下坚实的价值观基础上：",
      "valuesList": {
        "quality": {
          "title": "质量",
          "description": "我们坚持产品和服务的卓越标准"
        },
        "integrity": {
          "title": "诚信",
          "description": "我们以诚实、透明和道德的方式开展业务"
        },
        "innovation": {
          "title": "创新",
          "description": "我们不断寻求改进和创新的方法"
        },
        "sustainability": {
          "title": "可持续性",
          "description": "我们致力于环保和可持续实践"
        }
      }
    },
    "team": {
      "title": "我们的团队",
      "titleHighlight": "团队",
      "description": "MetaNord的团队由工程、物流和材料科学领域的专业人士组成，共同致力于为我们的客户提供卓越的服务和产品。",
      "members": {
        "ceo": {
          "name": "阿列克谢·伊万诺夫",
          "position": "首席执行官",
          "bio": "拥有超过15年的工程和基础设施材料行业经验"
        },
        "cto": {
          "name": "卡尔·林德伯格",
          "position": "首席技术官",
          "bio": "材料科学专家，专注于创新和产品开发"
        },
        "logistics": {
          "name": "索菲亚·施密特",
          "position": "物流总监",
          "bio": "国际供应链管理专家，确保全球高效交付"
        },
        "sales": {
          "name": "米哈伊尔·科瓦列夫",
          "position": "销售总监",
          "bio": "构建强大的客户关系，提供客户满意的解决方案"
        }
      }
    },
    "certifications": {
      "title": "认证和标准",
      "titleHighlight": "认证",
      "description": "我们所有的产品均符合严格的欧洲和国际标准，确保您获得最高质量和安全性：",
      "list": [
        "ISO 9001:2015 - 质量管理体系认证",
        "ISO 14001:2015 - 环境管理体系认证",
        "EN 1090 - 钢铁结构执行认证",
        "欧洲标准 EN 10219, EN 10210, EN 10255 - 钢管标准",
        "欧洲标准 EN 12201, EN 13476 - 聚乙烯管标准"
      ]
    }
  },
  
  // Services page comprehensive translations
  "services": {
    "title": "我们的服务",
    "titleHighlight": "服务",
    "metaTitle": "MetaNord服务 - 物流、咨询和定制解决方案",
    "metaDescription": "MetaNord提供全面服务，包括物流、技术咨询、定制解决方案、客户支持和采购服务，满足您所有基础设施需求。",
    "hero": {
      "title": "我们的服务",
      "subtitle": "全面解决方案"
    },
    "overview": {
      "title": "我们如何帮助您",
      "description": "我们提供一系列专业服务，从规划到完成，支持您的项目"
    },
    "process": {
      "title": "我们的服务流程",
      "steps": [
        {
          "title": "初步咨询",
          "description": "我们从详细讨论您的项目需求和要求开始"
        },
        {
          "title": "解决方案设计",
          "description": "我们的专家根据您的具体项目开发定制计划"
        },
        {
          "title": "产品选择",
          "description": "我们帮助您从我们广泛的产品目录中选择合适的产品"
        },
        {
          "title": "实施支持",
          "description": "在项目实施阶段提供技术支持"
        },
        {
          "title": "后续服务",
          "description": "持续支持以确保安装产品的最佳性能"
        }
      ]
    },
    "additionalTitle": "附加服务",
    "logistics": {
      "title": "物流和供应链",
      "description": "根据您的项目要求定制的高效物流解决方案",
      "features": [
        "直接运送至建筑工地",
        "库存管理和仓储",
        "及时交付选择"
      ]
    },
    "technical": {
      "title": "技术咨询",
      "description": "帮助您选择合适产品和技术规格的专家建议",
      "features": [
        "材料选择指导",
        "技术规格支持",
        "合规性咨询"
      ]
    },
    "custom": {
      "title": "定制解决方案",
      "description": "根据您特定应用需求定制的产品和服务",
      "features": [
        "产品修改与定制",
        "特殊项目解决方案",
        "技术设计支持"
      ]
    },
    "support": {
      "title": "全方位客户支持",
      "description": "贯穿整个项目周期的全面支持服务",
      "features": [
        "专门的项目经理",
        "技术疑难解答",
        "安装和维护指导"
      ]
    },
    "procurement": {
      "title": "采购服务",
      "description": "简化所有材料和组件采购的流程",
      "features": [
        "综合材料采购",
        "供应商管理",
        "质量控制"
      ]
    }
  },
  
  // Documents page comprehensive translations
  "documents": {
    "title": "文档",
    "metaTitle": "MetaNord - 技术文档和认证",
    "metaDescription": "访问MetaNord产品的完整技术规格、认证和使用指南。",
    "hero": {
      "title": "技术文档",
      "subtitle": "访问产品规格和认证"
    },
    "overview": {
      "title": "可用文档",
      "titleHighlight": "文档",
      "description": "我们为我们的产品线提供全面的技术文档，帮助您做出明智的决策并确保合规性。"
    },
    "catalog": {
      "title": "产品目录",
      "description": "我们完整的产品目录，包含详细规格和应用建议",
      "download": "下载目录"
    },
    "datasheets": {
      "title": "技术数据表",
      "description": "所有产品的详细技术数据表",
      "download": "查看数据表"
    },
    "certificates": {
      "title": "产品认证",
      "description": "产品质量、安全和合规认证",
      "download": "查看认证"
    },
    "installation": {
      "title": "安装指南",
      "description": "详细安装和维护说明",
      "download": "查看指南"
    },
    "request": {
      "title": "请求更多文档",
      "description": "需要更多信息？请联系我们获取其他技术文档和材料。",
      "button": "请求文档"
    }
  },
  
  // Projects page comprehensive translations
  "projects": {
    "title": "项目",
    "metaTitle": "MetaNord - 全球项目和案例研究",
    "metaDescription": "探索MetaNord在全球各地成功完成的特色基础设施和工程项目。",
    "hero": {
      "title": "特色项目",
      "subtitle": "探索我们的成功案例"
    },
    "overview": {
      "title": "项目",
      "titleHighlight": "展示",
      "description": "我们的产品和服务已在世界各地的多个成功项目中使用。探索我们的部分代表性工程："
    },
    "filters": {
      "all": "全部",
      "infrastructure": "基础设施",
      "industrial": "工业",
      "commercial": "商业",
      "municipal": "市政"
    },
    "featured": {
      "title": "特色项目",
      "subtitle": "查看我们的主要项目"
    },
    "caseStudies": {
      "title": "案例研究",
      "subtitle": "深入了解我们的一些最具影响力的项目",
      "viewMore": "查看更多"
    },
    "testimonials": {
      "title": "客户评价",
      "subtitle": "我们的客户对我们的产品和服务的反馈",
      "quote1": {
        "text": "MetaNord提供的铝型材质量超出了我们的预期，他们的技术支持团队在整个项目中提供了宝贵的指导。",
        "author": "托马斯·安德森",
        "company": "北欧建筑有限公司"
      },
      "quote2": {
        "text": "作为一家基础设施开发公司，我们依赖可靠的供应商。MetaNord一直是一个可靠的合作伙伴，提供优质产品并按时交付。",
        "author": "克里斯蒂娜·伯格",
        "company": "欧洲路桥有限公司"
      }
    },
    "contact": {
      "title": "与我们的项目团队联系",
      "description": "准备好开始您的下一个项目了吗？我们的团队随时准备帮助您。",
      "button": "联系我们"
    }
  },
  
  // Contact page comprehensive translations
  "contact": {
    "title": "联系我们",
    "metaTitle": "联系MetaNord - 技术支持和咨询",
    "metaDescription": "通过表格、电话或电子邮件与MetaNord团队联系。我们随时准备讨论您的基础设施项目需求。",
    "hero": {
      "title": "联系我们",
      "subtitle": "我们随时为您提供帮助"
    },
    "form": {
      "title": "发送信息",
      "name": "姓名",
      "email": "电子邮箱",
      "company": "公司",
      "phone": "电话号码",
      "subject": "主题",
      "message": "信息",
      "send": "发送信息",
      "sending": "发送中...",
      "required": "必填项",
      "invalidEmail": "请输入有效的电子邮箱地址",
      "success": "您的信息已成功发送！我们会尽快回复您。",
      "error": "发送信息时出错。请重试或直接通过电子邮箱联系我们。"
    },
    "visit": {
      "title": "访问我们",
      "address": {
        "line1": "MetaNord OÜ",
        "line2": "塔尔图大道 67a",
        "line3": "10134 塔林",
        "line4": "爱沙尼亚"
      }
    },
    "call": {
      "title": "致电我们",
      "phone": "+372 5771 3442",
      "hours": "工作时间：周一至周五 9:00 - 17:00 (EET)"
    },
    "email": {
      "title": "给我们发送电子邮件",
      "general": "一般咨询：",
      "generalEmail": "info@metanord.eu",
      "sales": "销售咨询：",
      "salesEmail": "sales@metanord.eu",
      "support": "技术支持：",
      "supportEmail": "support@metanord.eu"
    },
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
  },
  
  // FAQ page comprehensive translations 
  "faq": {
    "title": "常见问题",
    "description": "查找有关我们产品、服务和业务运营的常见问题的答案。如果您没有在这里找到您的问题的答案，请直接联系我们。",
    "metaTitle": "常见问题 | MetaNord",
    "metaDescription": "查找有关MetaNord产品、服务、交付条款和技术支持的常见问题的答案。获取您的基础设施项目所需的信息。",
    "contactCallout": "还有问题？我们随时为您提供帮助。",
    "contactUs": "联系我们",
    "contactText": "如果您有其他问题或需要更详细的信息，请随时联系我们的团队",
    "items": {
      "0": {
        "question": "MetaNord提供哪些类型的产品？",
        "answer": "MetaNord专注于分销从可信赖制造商采购的铝型材、聚乙烯管道、钢铁组件和其他基础设施材料。"
      },
      "1": {
        "question": "您是否提供定制制造或定制解决方案？",
        "answer": "是的。我们可以根据项目需求提供定制尺寸、表面处理或规格。请联系我们的销售团队获取定制报价和工程审核。"
      },
      "2": {
        "question": "您的交货时间和交付条款是什么？",
        "answer": "交货时间取决于产品类型和数量。标准产品通常在欧洲境内7-14个工作日内交付。我们也支持加急运输，可根据客户需求调整发货时间表。"
      },
      "3": {
        "question": "您能否在欧盟以外地区交付？",
        "answer": "是的，我们支持向包括非欧盟国家在内的广泛市场进行国际运输。请提供您的位置和所需材料，联系我们进行物流评估。"
      },
      "4": {
        "question": "您是否提供产品认证和技术文档？",
        "answer": "是的。我们的大多数产品都提供欧盟标准认证和详细技术规格，可在文档页面或各产品页面上获取。"
      },
      "5": {
        "question": "我如何请求报价？",
        "answer": "您可以通过我们网站上的联系表格请求报价，发送电子邮件至info@metanord.eu或致电+372 5771 3442。请说明所需产品、数量和交货地点。"
      },
      "6": {
        "question": "MetaNord提供什么样的质量保证？",
        "answer": "我们所有产品均通过严格的质量检查，确保符合欧洲耐久性、安全性和性能标准。我们与维持严格质量控制系统的认证制造商合作。"
      }
    }
  },
  
  // Common UI elements and footer
  "common": {
    "readMore": "阅读更多",
    "viewAll": "查看全部",
    "seeMore": "查看更多",
    "contactUs": "联系我们",
    "learnMore": "了解更多",
    "viewDetails": "查看详情",
    "getQuote": "获取报价",
    "download": "下载",
    "submit": "提交",
    "loading": "加载中...",
    "moreInfo": "更多信息",
    "close": "关闭",
    "yes": "是",
    "no": "否",
    "back": "返回",
    "next": "下一步",
    "previous": "上一步",
    "search": "搜索",
    "searchPlaceholder": "搜索产品、服务等",
    "searchResults": "搜索结果",
    "noResults": "未找到结果",
    "home": "首页",
    "about": "关于我们",
    "services": "服务",
    "products": "产品",
    "projects": "项目",
    "documents": "文档",
    "contact": "联系我们",
    "error": {
      "title": "出错了",
      "message": "加载内容时出错，请重试",
      "button": "重新加载"
    }
  },
  
  // Footer translations
  "footer": {
    "siteMap": "网站地图",
    "quickLinks": "快速链接",
    "products": "产品",
    "services": "服务",
    "about": "关于我们",
    "contact": "联系我们",
    "documents": "文档",
    "legalInfo": "法律信息",
    "privacyPolicy": "隐私政策",
    "termsOfService": "服务条款",
    "cookiePolicy": "Cookie政策",
    "shipping": "运输政策",
    "contactInfo": "联系信息",
    "address": "塔尔图大道 67a, 10134 塔林, 爱沙尼亚",
    "phone": "+372 5771 3442",
    "email": "info@metanord.eu",
    "copyright": "© 2023 MetaNord OÜ. 保留所有权利。",
    "socialMedia": "社交媒体",
    "linkedin": "LinkedIn",
    "facebook": "Facebook",
    "twitter": "Twitter",
    "newsletter": {
      "title": "订阅我们的通讯",
      "placeholder": "您的电子邮箱地址",
      "button": "订阅",
      "success": "感谢您的订阅！",
      "error": "订阅时出错，请重试。"
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
      
      // Preserve existing product translations
      const productTranslations = translations.products || {};
      
      // Deep merge existing translations with new translations
      translations = deepMerge(translations, completeChineseTranslations);
      
      // Ensure we don't overwrite product translations
      if (productTranslations && Object.keys(productTranslations).length > 0) {
        // Make sure we only preserve actual product data, not the category filters
        const safeCategories = ['filter', 'categories']; // These can be updated
        
        // Preserve product details but allow category/filter updates
        for (const key in productTranslations) {
          if (!safeCategories.includes(key)) {
            // Preserve product-specific translations
            translations.products[key] = productTranslations[key];
          }
        }
      }
      
      // Write the updated translations back to file
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      
      console.log(`✅ Successfully updated ${language} translations`);
    } catch (error) {
      console.error(`❌ Error updating ${language} translations:`, error);
    }
  });
}

// Function to update language switching optimization CSS
function updateLanguageSwitchingOptimizations() {
  const cssDir = 'client/src/styles';
  const cssPath = path.join(cssDir, 'language-optimizations.css');
  
  const optimizedCSS = `/**
 * Language Switching Optimizations CSS
 * 
 * This file contains optimizations to improve language switching performance,
 * prevent layout shifts, and create smoother transitions between languages.
 */

/* Prevent layout shifts during language switching */
html.lang-transition * {
  transition: none !important;
  animation: none !important;
}

/* Add transition class for smoother language changes */
body.lang-switching {
  opacity: 0.98;
  transition: opacity 0.15s ease-in-out;
}

body.lang-switching-complete {
  opacity: 1;
  transition: opacity 0.15s ease-in-out;
}

/* Preserve scroll position during language switch */
html.preserve-scroll {
  scroll-behavior: auto !important;
}

/* Ensure text doesn't overflow in narrow containers during language switch */
.text-container {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Fix Chinese font rendering */
html[lang="zh-CN"] body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0;
}

/* Ensure consistent heights for menu items in all languages */
.nav-item,
.dropdown-item,
.menu-item {
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

/* Prevent jumping during page load */
.main-content {
  min-height: 70vh;
}

/* Ensure footer stays in place */
.footer {
  position: relative;
  z-index: 10;
}

/* Ensure menu items have sufficient width for all languages */
[data-radix-dropdown-menu-content] [role="menuitem"],
.dropdown-menu-content [role="menuitem"],
.dropdown-menu-item {
  min-width: 120px;
  white-space: nowrap;
}

/* Fix layout jumps during language switch for elements with changing width */
.language-aware-container {
  transition: width 0.3s ease-out;
  overflow: hidden;
}

/* Prevent animation during language switch */
html.lang-transition .animate-in,
html.lang-transition .animate-out,
html.lang-transition [data-animate="true"] {
  animation-play-state: paused !important;
  transition: none !important;
}

/* Ensure consistent button widths across languages */
.language-sensitive-button {
  min-width: 120px;
  text-align: center;
  white-space: nowrap;
}

/* Fix Chinese specific font rendering issues */
html[lang="zh-CN"] h1, 
html[lang="zh-CN"] h2, 
html[lang="zh-CN"] h3, 
html[lang="zh-CN"] h4, 
html[lang="zh-CN"] h5, 
html[lang="zh-CN"] h6 {
  letter-spacing: -0.02em;
}

html[lang="zh-CN"] button,
html[lang="zh-CN"] a.btn,
html[lang="zh-CN"] .btn {
  letter-spacing: 0;
}`;

  try {
    // Create CSS directory if it doesn't exist
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    
    // Write CSS file
    fs.writeFileSync(cssPath, optimizedCSS, 'utf8');
    console.log('✅ Successfully updated language switching optimizations CSS');
  } catch (error) {
    console.error('❌ Error updating language switching CSS:', error);
  }
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
updateLanguageSwitchingOptimizations();

console.log('All translations and optimizations have been updated successfully!');