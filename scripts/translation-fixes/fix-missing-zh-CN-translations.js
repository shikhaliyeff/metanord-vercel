/**
 * Fix Missing Chinese Translations
 * 
 * This script specifically addresses the untranslated sections on the mobile version
 * of the MetaNord website in Chinese language (zh-CN).
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

// Function to fix missing Chinese translations
async function fixMissingChineseTranslations() {
  try {
    console.log('Starting to fix missing Chinese translations...');
    
    // Read the existing Chinese translation file
    const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    
    // Create a comprehensive update with all missing translations
    const missingTranslations = {
      // Homepage "Ready to Start Your Project" section
      "home": {
        "projectCta": {
          "title": "准备好开始您的项目？",
          "subtitle": "今天就联系我们，讨论您的基础设施需求，获取定制解决方案，满足您的特定要求。",
          "bulletPoints": {
            "consultation": "为您的项目需求提供专业咨询",
            "pricing": "具有竞争力的价格和及时交付",
            "quality": "高质量产品，提供全面保证"
          },
          "buttonText": "立即请求报价"
        },
        "ctaSection": {
          "needAssistance": "需要项目帮助？",
          "getInTouch": "联系我们获取定制解决方案和您的基础设施需求的个性化报价"
        },
        "browseProductCatalog": "浏览产品目录"
      },
      
      // Contact Page sections
      "contact": {
        "reachOut": "联系我们",
        "contactInformation": "联系信息",
        "companyLabel": "公司",
        "registryCodeLabel": "注册代码",
        "addressLabel": "地址",
        "phoneLabel": "电话"
      },
      
      // Projects Page sections
      "projects": {
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
      
      // About Page sections
      "about": {
        "facts": {
          "europeanCountries": "欧洲国家",
          "productTypes": "产品类型",
          "specializedKnowledge": "在建筑材料和基础设施组件方面的专业知识"
        },
        "sections": {
          "ourStory": "我们的故事",
          "ourVision": "我们的愿景",
          "sustainability": {
            "title": "可持续发展",
            "commitment": "致力于环保负责的材料采购和运营"
          },
          "expertise": {
            "title": "行业经验",
            "specialized": "在建筑材料和基础设施组件方面的专业知识"
          }
        },
        "quote": {
          "content": "我们将客户置于所有行动的中心。理解并满足他们的独特需求是我们的首要任务。",
          "founder": "- MetaNord创始人"
        }
      },
      
      // Service Sections on Homepage
      "services": {
        "technicalConsulting": {
          "title": "技术咨询",
          "description": "为产品选择和实施提供专家建议",
          "features": {
            "specifications": "产品规格和兼容性",
            "regulatory": "法规合规指导",
            "cost": "成本优化策略"
          }
        }
      }
    };
    
    // Merge the missing translations with the existing ones
    const updatedTranslations = deepMerge(zhCNTranslations, missingTranslations);
    
    // Write the updated translations back to the file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log('Successfully updated Chinese translations with missing content');
    console.log('Fixed translations for:');
    console.log('- Homepage "Ready to Start Your Project" section');
    console.log('- "Browse Product Catalog" button');
    console.log('- Contact page section headers and labels');
    console.log('- Projects page titles and filters');
    console.log('- About page facts and sections');
    console.log('- Service sections descriptions');
    
  } catch (error) {
    console.error('Error updating Chinese translations:', error);
  }
}

// Run the function
fixMissingChineseTranslations();