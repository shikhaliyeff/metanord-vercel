/**
 * Chinese Translation Fix Script
 * 
 * This script focuses on completing and fixing translations in the Chinese (zh-CN) version
 * for Homepage, Services, About, Documents, Projects, and Contact pages.
 */

import fs from 'fs';
import path from 'path';

const localesDir = 'client/src/locales';
const zhCNPath = path.join(localesDir, 'zh-CN.json');

// Load the Chinese translation file
let zhCNTranslations;
try {
  zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
  console.log('Chinese translation file loaded successfully');
} catch (error) {
  console.error('Error loading Chinese translation file:', error);
  process.exit(1);
}

// Define comprehensive Chinese translations for specific pages
const chineseTranslationFixes = {
  // Homepage translations
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
  
  // About page translations
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
  
  // Services page translations
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
  
  // Documents page translations
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
  
  // Projects page translations
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
  
  // Contact page additional missing translations
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
      "subtitle": "查找我们最常见问题的答案"
    }
  }
};

// Merge translations with existing Chinese translations
const updatedTranslations = deepMerge(zhCNTranslations, chineseTranslationFixes);

// Write updated translations back to file
try {
  fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
  console.log('✅ Chinese translations successfully updated!');
} catch (error) {
  console.error('❌ Error writing updated Chinese translations:', error);
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

console.log('Chinese translation fix completed successfully!');