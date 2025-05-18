/**
 * Final Chinese Translation Fix Script
 * 
 * This script adds complete Chinese translations for all missing content
 * based on the screenshots showing untranslated sections.
 */

import fs from 'fs';
import path from 'path';

async function fixChineseTranslations() {
  try {
    console.log('Starting comprehensive Chinese translation fix...');
    
    // Path to Chinese translation file
    const zhCNPath = './client/src/locales/zh-CN.json';
    
    // Read current translations
    const zhCNData = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    
    // New translations to add or update
    const newTranslations = {
      "common": {
        "readMore": "查看更多",
        "getInTouch": "联系我们",
        "viewDetails": "查看详情",
        "learnMore": "了解更多"
      },
      "hero": {
        "title": "欧洲标准组件，持久的基础设施解决方案",
        "subtitle": "智能基础设施",
        "buttonText": "浏览产品",
        "quality": "质量保证",
        "expertise": "行业专业知识",
        "service": "卓越服务"
      },
      "products": {
        "viewAll": "查看所有产品",
        "viewDetails": "查看详情"
      },
      "about": {
        "title": "关于我们",
        "subtitle": "工程和基础设施解决方案专家",
        "story": {
          "title": "我们的故事",
          "paragraph1": "MetaNord成立于2018年，由一群在建筑和工程领域拥有丰富经验的专业人士创立，致力于解决市场上高质量材料供应和创新解决方案的缺口。",
          "paragraph2": "多年来，我们持续扩大产品组合和市场范围，发展成为服务于15多个欧洲国家的可靠合作伙伴，为各种工程项目提供全面的基础设施材料。",
          "paragraph3": "如今，我们自豪地提供超过200种产品，并继续拓展我们的网络、专业知识和服务，为客户提供一流的解决方案。"
        },
        "vision": {
          "title": "我们的愿景",
          "text": "为明天的世界设计可持续的基础设施解决方案"
        },
        "experience": {
          "title": "行业经验",
          "text": "建筑材料和基础设施组件专业知识"
        },
        "sustainability": {
          "title": "可持续发展",
          "text": "对环保材料采购和运营的承诺"
        }
      },
      "contact": {
        "reachOut": "联系我们",
        "subtitle": "我们在这里回答您的问题并提供您需要的解决方案"
      },
      "projects": {
        "allProjects": "所有项目",
        "viewDetails": "查看详情",
        "pageTitle": "我们的项目",
        "pageDescription": "探索MetaNord为客户完成的各种基础设施和工程项目"
      },
      "services": {
        "pageTitle": "我们的服务",
        "pageDescription": "发现MetaNord如何通过全面的服务支持您的基础设施需求"
      },
      "cta": {
        "title": "准备开始您的项目？",
        "subtitle": "今天就联系我们，讨论您的基础设施需求",
        "button": "获取报价"
      },
      "footer": {
        "company": "公司",
        "products": "产品",
        "quickLinks": "快速链接",
        "contact": "联系我们",
        "copyright": "© 2024 MetaNord OÜ. 保留所有权利。"
      }
    };
    
    // Merge translations
    const updatedTranslations = deepMerge(zhCNData, newTranslations);
    
    // Write updated translations back to file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log('Successfully updated Chinese translations with all missing content.');
    console.log('✅ Fixed "Reach Out" text in Contact section');
    console.log('✅ Fixed About page section headings');
    console.log('✅ Fixed Projects page title and descriptions');
    console.log('✅ Fixed Service section headings');
    console.log('✅ Fixed CTA section text');
    console.log('✅ Ensured all common UI elements are translated');
    
    return true;
  } catch (error) {
    console.error('Error updating Chinese translations:', error);
    return false;
  }
}

// Helper function to deeply merge objects
function deepMerge(target, source) {
  const output = { ...target };
  
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

// Run the function
// IIFE to allow async/await in ESM module
(async () => {
  const success = await fixChineseTranslations();
  if (success) {
    console.log('✅ Chinese translation fix completed successfully');
  } else {
    console.error('❌ Failed to complete Chinese translation fix');
  }
})();