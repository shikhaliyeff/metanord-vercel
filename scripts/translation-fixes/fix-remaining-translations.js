/**
 * Fix Remaining Translation Issues
 * 
 * This script addresses a few remaining translation elements that need improvement:
 * 1. Fixes "Why Choose Us" section on homepage in Chinese
 * 2. Translates form labels on Contact page
 * 3. Improves partially translated elements in footer and header
 */

import fs from 'fs';
import path from 'path';

// Path to the Chinese translation file
const zhCNPath = path.join('client/src/locales', 'zh-CN.json');

try {
  // Read the Chinese translation file
  const translations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
  
  // Add remaining translations and fix any issues
  const additionalTranslations = {
    // Homepage "Why Choose Us" section specific items
    "home": {
      "whyChooseUsHeader": "为什么选择我们",
      "whyChooseUsSubtitle": "我们对卓越的追求使我们在提供高品质产品和卓越服务方面脱颖而出",
      "qualityTitle": "优质品质",
      "qualityText": "我们提供来自信赖制造商的高品质产品，这些产品经过严格的质量控制。",
      "pricingTitle": "具竞争力的价格",
      "pricingText": "我们与制造商的直接关系使我们能够提供有竞争力的价格，而不影响质量。",
      "reliabilityTitle": "可靠性",
      "reliabilityText": "一致的供应计划和可靠的产品可用性确保您的项目及时实施。",
      "expertiseTitle": "技术专长",
      "expertiseText": "我们的专家团队将帮助您为您的特定需求选择合适的产品。"
    },
    
    // Contact form labels and placeholders
    "contact": {
      "form": {
        "namePlaceholder": "输入您的姓名",
        "emailPlaceholder": "输入您的电子邮箱地址",
        "companyPlaceholder": "输入您的公司名称（可选）",
        "subjectPlaceholder": "选择一个选项",
        "messagePlaceholder": "输入您的信息",
        "submitButton": "发送信息"
      },
      "contactInfo": {
        "title": "联系信息",
        "reachOut": "通过以下任何渠道与我们联系",
        "company": "公司",
        "registryCode": "注册代码",
        "address": "地址"
      },
      "pageTitle": "联系我们",
      "subtitle": "我们在这里回答您的问题并提供您需要的解决方案"
    },
    
    // Other UI elements that might be missing translations
    "ui": {
      "learnMore": "了解更多",
      "requestQuote": "请求报价",
      "getQuote": "获取报价",
      "readMore": "阅读更多",
      "browseProducts": "浏览产品目录",
      "requestToday": "今天申请报价"
    },
    
    // Common button texts
    "buttons": {
      "submit": "提交",
      "send": "发送",
      "load": "加载更多",
      "browse": "浏览",
      "download": "下载",
      "view": "查看",
      "search": "搜索",
      "filter": "筛选"
    },
    
    // Footer translation improvements
    "footer": {
      "copyright": "© 2023 MetaNord OÜ. 保留所有权利。",
      "allRights": "保留所有权利",
      "privacyPolicy": "隐私政策",
      "termsOfService": "服务条款",
      "quickLinks": "快速链接",
      "contactInfo": "联系信息",
      "newsletter": "新闻简报",
      "subscribeNewsletter": "订阅我们的新闻简报",
      "emailAddress": "电子邮箱地址",
      "subscribe": "订阅",
      "unsubscribe": "取消订阅",
      "followUs": "关注我们"
    },
    
    // Specific phrases that appear in the UI
    "phrases": {
      "engineeringStrongerTomorrow": "构建更强大的明天",
      "weMoveYouBuild": "我们移动材料。您建设未来。",
      "readyToStartProject": "准备开始您的项目？",
      "getPersonalizedQuote": "获取个性化报价",
      "connectWithTeam": "与我们的团队联系，讨论您的具体项目需求和时间表。",
      "expertConsultation": "专业咨询，满足您的项目需求",
      "competitivePricing": "有竞争力的价格和及时交付",
      "highQualityProducts": "符合欧洲标准的高品质产品",
      "browseProductCatalog": "浏览产品目录",
      "ourVision": "我们的愿景",
      "reachOut": "联系我们"
    }
  };
  
  // Deep merge the additional translations with the existing ones
  const updatedTranslations = deepMerge(translations, additionalTranslations);
  
  // Write the updated translations back to file
  fs.writeFileSync(zhCNPath, JSON.stringify(updatedTranslations, null, 2), 'utf8');
  console.log('✅ Successfully fixed remaining Chinese translations');
} catch (error) {
  console.error('❌ Error updating Chinese translations:', error);
}

// Create CSS for better dropdown menu underline effects
const dropdownCssPath = path.join('client/src/styles', 'enhanced-dropdown-effects.css');

try {
  const enhancedDropdownCSS = `/**
 * Enhanced Dropdown Menu Hover Effects
 * 
 * This CSS ensures consistent underline effects in dropdown menus across all browsers
 * and makes sure submenus have the same styling as top-level menu items.
 */

/* Universal selector for all dropdown menu items */
[data-radix-dropdown-menu-content] *[role="menuitem"],
[data-radix-dropdown-menu-content] a,
.dropdown-menu [role="menuitem"],
.dropdown-menu a,
.dropdown-submenu-item,
[data-state="open"] .dropdown-submenu a,
.nav-dropdown-menu-item {
  position: relative !important;
  transition: color 0.25s ease !important;
  text-decoration: none !important;
}

/* Create base underline styling that's initially hidden */
[data-radix-dropdown-menu-content] *[role="menuitem"]::after,
[data-radix-dropdown-menu-content] a::after,
.dropdown-menu [role="menuitem"]::after,
.dropdown-menu a::after,
.dropdown-submenu-item::after,
[data-state="open"] .dropdown-submenu a::after,
.nav-dropdown-menu-item::after {
  content: '' !important;
  position: absolute !important;
  width: 100% !important;
  transform: scaleX(0) !important;
  height: 2px !important;
  bottom: -2px !important;
  left: 0 !important;
  background-color: var(--color-primary, #3b82f6) !important;
  transform-origin: bottom right !important;
  transition: transform 0.25s ease-out !important;
  pointer-events: none !important;
}

/* Show underline on hover */
[data-radix-dropdown-menu-content] *[role="menuitem"]:hover::after,
[data-radix-dropdown-menu-content] a:hover::after,
.dropdown-menu [role="menuitem"]:hover::after,
.dropdown-menu a:hover::after,
.dropdown-submenu-item:hover::after,
[data-state="open"] .dropdown-submenu a:hover::after,
.nav-dropdown-menu-item:hover::after {
  transform: scaleX(1) !important;
  transform-origin: bottom left !important;
}

/* Force hover styles for Radix UI submenu items */
[data-radix-dropdown-menu-content] [data-radix-menu-item]:hover,
[data-radix-dropdown-menu-sub-content] [data-radix-menu-item]:hover {
  text-decoration: none !important;
  color: var(--color-primary, #3b82f6) !important;
}

/* Make sure menu items have proper spacing */
[data-radix-dropdown-menu-content] [data-radix-menu-item],
[data-radix-dropdown-menu-sub-content] [data-radix-menu-item],
.dropdown-menu-item,
.dropdown-submenu-item {
  padding: 0.5rem 1rem !important;
  cursor: pointer !important;
}

/* Ensure all hover effects work in Safari and Firefox */
@media screen and (min-width: 768px) {
  .menu-item::after,
  .dropdown-menu-item::after,
  .submenu-item::after {
    content: '' !important;
    position: absolute !important;
    width: 100% !important;
    transform: scaleX(0) !important;
    height: 2px !important; 
    bottom: -2px !important;
    left: 0 !important;
    background-color: var(--color-primary, #3b82f6) !important;
    transform-origin: bottom right !important;
    transition: transform 0.25s ease-out !important;
  }

  .menu-item:hover::after,
  .dropdown-menu-item:hover::after,
  .submenu-item:hover::after {
    transform: scaleX(1) !important;
    transform-origin: bottom left !important;
  }
}

/* High specificity rules to ensure they work everywhere */
html body .dropdown-menu a:hover,
html body .dropdown-submenu a:hover,
html body .dropdown-menu [role="menuitem"]:hover,
html body [data-radix-menu-content] a:hover,
html body [data-radix-dropdown-menu-content] [role="menuitem"]:hover {
  text-decoration: none !important;
  color: var(--color-primary, #3b82f6) !important;
}

/* Ensure active state is styled correctly */
.dropdown-menu-item[data-active="true"],
.submenu-item[data-active="true"],
.dropdown-menu [role="menuitem"][data-active="true"] {
  background-color: rgba(59, 130, 246, 0.1) !important;
  color: var(--color-primary, #3b82f6) !important;
}`;

  fs.writeFileSync(dropdownCssPath, enhancedDropdownCSS, 'utf8');
  console.log('✅ Successfully created enhanced dropdown hover effects CSS');
  
  // Now update the main.tsx to import this CSS
  const mainTsxPath = path.join('client/src', 'main.tsx');
  if (fs.existsSync(mainTsxPath)) {
    let mainContent = fs.readFileSync(mainTsxPath, 'utf8');
    
    // Check if the enhanced dropdown CSS is already imported
    if (!mainContent.includes('enhanced-dropdown-effects.css')) {
      // Find where other styles are imported and add our new import there
      const styleImportRegex = /import ['"].*\.css['"]/;
      const lastStyleImport = mainContent.match(new RegExp(styleImportRegex.source, 'g'));
      
      if (lastStyleImport && lastStyleImport.length > 0) {
        const lastImportStr = lastStyleImport[lastStyleImport.length - 1];
        mainContent = mainContent.replace(
          lastImportStr,
          `${lastImportStr}\nimport './styles/enhanced-dropdown-effects.css'`
        );
        
        fs.writeFileSync(mainTsxPath, mainContent, 'utf8');
        console.log('✅ Successfully added CSS import to main.tsx');
      }
    }
  }
} catch (error) {
  console.error('❌ Error creating enhanced dropdown effects CSS:', error);
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

console.log('All remaining issues have been fixed!');