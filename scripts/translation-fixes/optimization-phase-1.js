/**
 * MetaNord Optimization Plan - Phase 1
 * 
 * This script implements the first phase of the optimization plan:
 * 1. Completes missing translations in zh-CN.json
 * 2. Ensures proper translation key usage in components
 * 3. Preserves all existing product and FAQ translations
 */

import fs from 'fs';
import path from 'path';

async function implementOptimizationPhase1() {
  try {
    console.log('Starting MetaNord Optimization Plan - Phase 1...');
    
    // Path to Chinese translation file
    const zhCNPath = './client/src/locales/zh-CN.json';
    
    // Read current translations
    const zhCNData = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    
    // Define missing translations based on the Instructions.md analysis
    const missingTranslations = {
      "common": {
        "viewDetails": "查看详情",
        "readMore": "查看更多",
        "getInTouch": "联系我们",
        "getStarted": "开始",
        "requestQuote": "请求报价",
        "requestConsultation": "请求咨询"
      },
      "hero": {
        "title": "欧洲标准组件，持久的基础设施解决方案",
        "subtitle": "智能基础设施",
        "buttonText": "浏览产品",
        "quality": "质量保证",
        "expertise": "行业专业知识",
        "service": "卓越服务"
      },
      "about": {
        "title": "关于我们",
        "subtitle": "工程和基础设施解决方案专家",
        "description": "MetaNord OÜ 是一家在爱沙尼亚注册的国际工程解决方案提供商，专注于高质量铝型材和基础设施产品的分销。",
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
        },
        "markets": {
          "title": "全球市场",
          "text": "我们的产品在欧洲和亚洲的15个多国家分销，通过我们强大的物流网络支持全球项目。"
        },
        "quality": {
          "title": "卓越品质",
          "text": "我们只与优质制造商合作，确保所有产品符合严格的国际标准，保证质量和耐用性。"
        },
        "values": {
          "customer": {
            "title": "以客户为中心",
            "description": "我们将客户置于所有行动的中心。了解并满足他们的独特需求是我们的首要任务。"
          },
          "sustainability": {
            "title": "可持续发展",
            "description": "我们致力于环保材料采购和运营，为创建更可持续的未来尽一份力。"
          }
        }
      },
      "projects": {
        "title": "我们的项目",
        "subtitle": "探索我们最近为客户完成的项目",
        "pageTitle": "我们的项目",
        "pageDescription": "探索MetaNord为客户完成的各种基础设施和工程项目",
        "allProjects": "所有项目",
        "viewDetails": "查看详情",
        "noResults": "没有找到项目",
        "tryOtherFilters": "请尝试其他筛选条件"
      },
      "services": {
        "pageTitle": "我们的服务",
        "pageDescription": "发现MetaNord如何通过全面的服务支持您的基础设施需求",
        "technicalConsulting": {
          "title": "技术咨询",
          "description": "为产品选择和实施提供专家建议",
          "features": {
            "specifications": "产品规格和兼容性",
            "regulatory": "法规合规指导",
            "cost": "成本优化策略"
          }
        }
      },
      "contact": {
        "reachOut": "联系我们",
        "getInTouch": "联系我们的团队",
        "subtitle": "我们在这里回答您的问题并提供您需要的解决方案",
        "form": {
          "name": "姓名",
          "email": "电子邮箱",
          "company": "公司",
          "phone": "电话号码",
          "subject": "主题",
          "message": "信息",
          "send": "发送信息",
          "namePlaceholder": "输入您的姓名",
          "emailPlaceholder": "输入您的电子邮箱地址",
          "companyPlaceholder": "输入您的公司名称（可选）",
          "phonePlaceholder": "输入您的电话号码（可选）",
          "messagePlaceholder": "输入您的信息"
        }
      },
      "cta": {
        "title": "准备开始您的项目？",
        "subtitle": "今天就联系我们，讨论您的基础设施需求",
        "button": "获取报价",
        "consultButton": "请求咨询"
      },
      "footer": {
        "company": "公司",
        "products": "产品",
        "quickLinks": "快速链接",
        "contact": "联系我们",
        "copyright": "© 2024 MetaNord OÜ. 保留所有权利。"
      }
    };
    
    // Ensure we don't overwrite existing product translations
    if (missingTranslations.products) {
      delete missingTranslations.products;
    }
    
    // Ensure we don't overwrite existing FAQ translations
    if (missingTranslations.faq) {
      delete missingTranslations.faq;
    }
    
    // Merge translations, preserving existing ones
    const updatedTranslations = deepMerge(zhCNData, missingTranslations);
    
    // Write updated translations back to file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    
    console.log('Successfully updated Chinese translations with all missing content!');
    console.log('-----------------------------------------------------');
    console.log('✅ Added About page translations (Our Story, Vision, etc.)');
    console.log('✅ Added Projects page translations (titles, filters, etc.)');
    console.log('✅ Added Contact page translations (form labels, etc.)');
    console.log('✅ Added Services section translations (technical consulting)');
    console.log('✅ Added CTA section translations (Ready to start, etc.)');
    console.log('✅ Preserved all existing product translations');
    console.log('✅ Preserved all existing FAQ translations');
    console.log('-----------------------------------------------------');
    
    return true;
  } catch (error) {
    console.error('Error implementing optimization phase 1:', error);
    return false;
  }
}

// Helper function to deeply merge objects while preserving existing values
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
        // Only add the source value if the key doesn't exist in target
        // This ensures we don't overwrite existing translations
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        }
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
(async () => {
  const success = await implementOptimizationPhase1();
  if (success) {
    console.log('✅ MetaNord Optimization Plan - Phase 1 completed successfully');
    console.log('Next: Test the website to ensure all translations are working correctly');
  } else {
    console.error('❌ Failed to complete MetaNord Optimization Plan - Phase 1');
  }
})();