/**
 * Complete Chinese Translations Fix
 * 
 * This script merges all the additional and updated Chinese translations
 * and fixes remaining issues with incomplete or missing translations.
 */

import fs from 'fs';
import path from 'path';

// Define paths
const localesDir = 'client/src/locales';
const zhCNPath = path.join(localesDir, 'zh-CN.json');
const zhCNAdditionsPath = path.join(localesDir, 'zh-CN-additions.json');
const zhCNCompleteUpdatePath = path.join(localesDir, 'zh-CN-complete-update.json');

// Function to deep merge objects
function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  });
  
  return target;
}

// Helper function to check if value is an object
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Main function to update all translations
async function updateAllTranslations() {
  try {
    console.log('Loading Chinese translation files...');
    
    // Load the main Chinese translation file
    const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    console.log('Main zh-CN.json file loaded successfully');
    
    // Load additional Chinese translations
    let zhCNAdditions = {};
    try {
      zhCNAdditions = JSON.parse(fs.readFileSync(zhCNAdditionsPath, 'utf8'));
      console.log('Additional zh-CN translations loaded successfully');
    } catch (err) {
      console.log('No additional translations file found or error reading it:', err.message);
    }
    
    // Load complete update file
    let zhCNCompleteUpdate = {};
    try {
      zhCNCompleteUpdate = JSON.parse(fs.readFileSync(zhCNCompleteUpdatePath, 'utf8'));
      console.log('Complete update translations loaded successfully');
    } catch (err) {
      console.log('No complete update translations file found or error reading it:', err.message);
    }
    
    // Merge translations
    const updatedTranslations = deepMerge({}, zhCNTranslations);
    deepMerge(updatedTranslations, zhCNAdditions);
    deepMerge(updatedTranslations, zhCNCompleteUpdate);
    
    console.log('Successfully merged all Chinese translations');
    
    // Add missing footer translations
    if (!updatedTranslations.footer) {
      updatedTranslations.footer = {
        "company": "公司",
        "companyAbout": "关于我们",
        "companyServices": "服务",
        "companyProjects": "项目",
        "companyDocuments": "文档",
        "companyCareers": "职业发展",
        "products": "产品",
        "productsAluminum": "铝型材",
        "productsPolyethylene": "聚乙烯管道",
        "productsSteel": "钢铁组件",
        "productsCastIron": "铸铁产品",
        "resources": "资源",
        "resourcesDocuments": "技术文档",
        "resourcesBlog": "博客",
        "resourcesFAQ": "常见问题",
        "contact": "联系我们",
        "contactAddress": "塔尔图大道 67a, 10134 塔林, 爱沙尼亚",
        "contactPhone": "+372 5771 3442",
        "contactEmail": "info@metanord.eu",
        "newsletter": "订阅我们的通讯",
        "newsletterDesc": "获取最新的产品更新和行业新闻。",
        "subscribeBtn": "订阅",
        "emailPlaceholder": "您的电子邮箱地址",
        "copyright": "© 2025 MetaNord OÜ. 保留所有权利。",
        "privacyPolicy": "隐私政策",
        "termsOfService": "服务条款",
        "cookiePolicy": "Cookie政策"
      };
    }
    
    // Add missing projects translations
    if (!updatedTranslations.projects || Object.keys(updatedTranslations.projects).length < 5) {
      updatedTranslations.projects = {
        "title": "我们的项目",
        "titleHighlight": "项目",
        "subtitle": "探索我们最近完成的基础设施项目",
        "metaTitle": "MetaNord项目案例研究",
        "metaDescription": "了解MetaNord如何在各种基础设施项目中帮助客户实现工程目标。浏览我们的项目案例和成功案例。",
        "viewProject": "查看项目",
        "location": "位置",
        "sector": "行业",
        "year": "年份",
        "challenge": "挑战",
        "solution": "解决方案",
        "results": "结果",
        "contactCta": "有类似项目？与我们的团队讨论您的需求。",
        "contactBtn": "联系我们"
      };
    }
    
    // Add missing documents translations
    if (!updatedTranslations.documents || Object.keys(updatedTranslations.documents).length < 5) {
      updatedTranslations.documents = {
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
          "description": "我们完整的产品目录，包含详细规格和应用建议"
        }
      };
    }

    // Fix Chinese translations for "Why Choose Us" section on homepage
    if (updatedTranslations.home && updatedTranslations.home.whyChooseUs) {
      // Ensure the subtitle is properly translated
      if (!updatedTranslations.home.whyChooseUs.subtitle || 
          updatedTranslations.home.whyChooseUs.subtitle.includes("strict")) {
        updatedTranslations.home.whyChooseUs.subtitle = "我们对卓越的追求使我们在提供高品质产品和卓越服务方面脱颖而出";
      }
    }
    
    // Fix Contact page form placeholder translations
    if (updatedTranslations.contact && updatedTranslations.contact.form) {
      updatedTranslations.contact.form.namePlaceholder = "输入您的姓名";
      updatedTranslations.contact.form.emailPlaceholder = "输入您的电子邮箱地址";
      updatedTranslations.contact.form.companyPlaceholder = "输入您的公司名称（可选）";
      updatedTranslations.contact.form.phonePlaceholder = "输入您的电话号码（可选）";
      updatedTranslations.contact.form.subjectPlaceholder = "选择一个选项";
      updatedTranslations.contact.form.messagePlaceholder = "输入您的信息";
      updatedTranslations.contact.form.submitButton = "发送信息";
    }
    
    // Write the updated translations back to the file
    fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
    console.log('Chinese translations have been successfully updated and saved to zh-CN.json');
    
    return true;
  } catch (error) {
    console.error('Error updating Chinese translations:', error);
    return false;
  }
}

// Run the update function
updateAllTranslations()
  .then(success => {
    if (success) {
      console.log('Chinese translation update process completed successfully');
    } else {
      console.error('Chinese translation update process failed');
    }
  })
  .catch(err => {
    console.error('Error running translation update:', err);
  });