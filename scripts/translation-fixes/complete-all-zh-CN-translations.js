/**
 * Complete All Chinese Translations
 * 
 * This script ensures all remaining untranslated sections in the Chinese (zh-CN)
 * version of the MetaNord website are properly translated.
 */

import fs from 'fs';
import path from 'path';

// Path to the Chinese translation file
const zhCNPath = path.join('client/src/locales', 'zh-CN.json');

// Function to deep merge objects
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

// Function to fix all remaining Chinese translations
async function fixAllRemainingChineseTranslations() {
  try {
    console.log('Starting to fix all remaining Chinese translations...');
    
    // Read the existing Chinese translation file
    const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    
    // Create a comprehensive update with all missing translations
    const completeTranslations = {
      // HOMEPAGE - Request a Quote, Ready to Start Your Project, etc.
      "home": {
        "requestQuote": "立即请求报价",
        "requestQuoteToday": "今天请求报价",
        "readyToStart": "准备好开始您的项目？",
        "readyToStartSubtitle": "今天就联系我们，讨论您的基础设施需求，获取定制解决方案，满足您的特定要求。",
        "contactToday": "今天联系我们，讨论您的基础设施需求，并获取量身定制的解决方案。",
        "featureBullets": {
          "expertConsultation": "专业咨询，满足您的项目需求",
          "competitivePricing": "具有竞争力的价格和及时交付",
          "qualityProducts": "高质量产品，具有全面保证"
        },
        "cta": {
          "needAssistance": "需要项目帮助？",
          "getInTouch": "联系我们获取定制解决方案和您的基础设施需求的个性化报价",
          "requestQuote": "请求报价"
        },
        "browseProductCatalog": "浏览产品目录",
        "projectCta": {
          "title": "准备好开始您的项目？",
          "subtitle": "今天就联系我们，讨论您的基础设施需求，获取定制解决方案，满足您的特定要求。",
          "buttonText": "立即请求报价",
          "bulletPoints": {
            "expertConsultation": "专业咨询，满足您的项目需求",
            "competitivePricing": "具有竞争力的价格和及时交付",
            "qualityProducts": "高质量产品，具有全面保证"
          }
        }
      },
      
      // ABOUT PAGE - Our Vision, Our Story, etc.
      "about": {
        "visionTitle": "我们的愿景",
        "visionText": "为明天的世界打造可持续的基础设施解决方案",
        "storyTitle": "我们的故事",
        "storyText": "创立之初，我们的愿景是向波罗的海国家和更广阔的欧洲市场供应高质量的工业产品。",
        "industryExperience": "行业经验",
        "industryExperienceText": "在建筑材料和基础设施组件方面的专业知识",
        "sustainability": "可持续发展",
        "sustainabilityText": "致力于环保负责的材料采购和运营",
        "customerCentric": "以客户为中心",
        "customerCentricText": "我们将客户置于所有行动的中心。理解并满足他们的独特需求是我们的首要任务。",
        "factsAndFigures": {
          "europeanCountries": "欧洲国家",
          "productTypes": "产品类型",
          "specializedKnowledge": "在建筑材料和基础设施组件方面的专业知识"
        },
        "sections": {
          "ourStory": "我们的故事",
          "ourVision": "我们的愿景",
          "ourApproach": "我们的方法",
          "ourValues": "我们的价值观"
        }
      },
      
      // PROJECTS PAGE - Featured Projects, filters, etc.
      "projects": {
        "title": "我们的项目",
        "featuredTitle": "精选项目",
        "featuredSubtitle": "探索我们在波罗的海地区的过去和正在进行的项目，采用最高质量的材料和工程解决方案。",
        "filters": {
          "all": "所有项目",
          "infrastructure": "基础设施",
          "commercial": "商业"
        },
        "emptyState": {
          "noProjects": "未找到项目",
          "tryDifferent": "尝试不同的筛选类别"
        },
        "viewAll": "查看所有项目",
        "projectTypes": {
          "infrastructure": "基础设施",
          "commercial": "商业",
          "industrial": "工业",
          "residential": "住宅"
        },
        "featuredProjects": {
          "title": "精选项目",
          "subtitle": "探索我们在波罗的海地区的过去和正在进行的项目，采用最高质量的材料和工程解决方案。",
          "filterAll": "所有项目",
          "filterInfrastructure": "基础设施",
          "filterCommercial": "商业",
          "noProjects": "未找到项目",
          "tryDifferent": "尝试不同的筛选类别",
          "viewAllProjects": "查看所有项目"
        }
      },
      
      // CONTACT PAGE - Reach Out, section labels, etc.
      "contact": {
        "reachOut": "联系我们",
        "reachOutSubtitle": "我们在这里回答您的问题并提供您需要的解决方案",
        "contactInformation": "联系信息",
        "contactInfoSubtitle": "通过以下任何渠道与我们联系",
        "labelCompany": "公司",
        "labelRegistryCode": "注册代码",
        "labelAddress": "地址",
        "labelPhone": "电话",
        "labelEmail": "电子邮件",
        "contactForm": {
          "title": "发送信息",
          "subtitle": "填写下面的表格，我们将尽快回复您"
        },
        "contactInfo": {
          "title": "联系信息",
          "subtitle": "您可以通过以下方式与我们联系"
        }
      },
      
      // SERVICES SECTION - Technical Consulting, bullets, etc.
      "services": {
        "technicalConsulting": {
          "title": "技术咨询",
          "description": "为产品选择和实施提供专家建议",
          "features": {
            "productSpecifications": "产品规格和兼容性",
            "regulatoryCompliance": "法规合规指导",
            "costOptimization": "成本优化策略"
          }
        },
        "logisticsSupply": {
          "title": "物流和供应链",
          "description": "根据您的项目要求定制的高效物流解决方案",
          "features": {
            "directDelivery": "直接运送至建筑工地",
            "inventoryManagement": "库存管理和仓储",
            "justInTimeDelivery": "及时交付选择"
          }
        },
        "customSolutions": {
          "title": "定制解决方案",
          "description": "根据您特定应用需求定制的产品和服务",
          "features": {
            "productModification": "产品修改与定制",
            "specialProjects": "特殊项目解决方案",
            "technicalDesign": "技术设计支持"
          }
        },
        "customerSupport": {
          "title": "全方位客户支持",
          "description": "贯穿整个项目周期的全面支持服务",
          "features": {
            "dedicatedManager": "专门的项目经理",
            "technicalTroubleshooting": "技术疑难解答",
            "installationGuidance": "安装和维护指导"
          }
        },
        "bullets": {
          "productSpecifications": "产品规格和兼容性",
          "regulatoryCompliance": "法规合规指导",
          "costOptimization": "成本优化策略",
          "directDelivery": "直接连接至建筑工地",
          "inventoryManagement": "库存管理和仓储",
          "justInTimeDelivery": "及时交付服务",
          "productModification": "产品规格定制",
          "specialProjects": "特殊项目解决方案",
          "technicalDesign": "技术设计支持",
          "dedicatedManager": "专门的项目经理",
          "technicalTroubleshooting": "技术疑难解答",
          "installationGuidance": "安装和维护指导"
        },
        "learnMore": "了解更多"
      },
      
      // GENERAL UI Elements
      "common": {
        "allProjects": "所有项目",
        "infrastructure": "基础设施",
        "commercial": "商业",
        "noResults": "没有找到结果",
        "tryAgain": "请尝试其他筛选条件",
        "viewAll": "查看全部",
        "requestQuote": "请求报价",
        "browseProducts": "浏览产品",
        "needAssistance": "需要帮助？",
        "getInTouch": "联系我们"
      }
    };
    
    // Merge the complete translations with the existing ones
    const updatedTranslations = deepMerge(zhCNTranslations, completeTranslations);
    
    // Write the updated translations back to the file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log('Successfully updated all remaining Chinese translations');
    console.log('Fixed translations for:');
    console.log('- Homepage "Ready to Start Your Project" section');
    console.log('- "Browse Product Catalog" button');
    console.log('- About page "Our Vision", "Our Story" sections');
    console.log('- Projects page "Featured Projects" and filters');
    console.log('- Contact page "Reach Out" and labels');
    console.log('- Services section "Technical Consulting" and bullet points');
    
  } catch (error) {
    console.error('Error updating Chinese translations:', error);
  }
}

// Run the function
fixAllRemainingChineseTranslations();