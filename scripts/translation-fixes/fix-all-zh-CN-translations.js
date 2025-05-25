/**
 * Comprehensive Chinese Translation Fix
 * 
 * This script consolidates all Chinese translations from multiple sources
 * and ensures they are properly applied to the website.
 */
import fs from 'fs';
import path from 'path';

const localesDir = 'client/src/locales';
const zhCNPath = path.join(localesDir, 'zh-CN.json');
const zhCNAdditionsPath = path.join(localesDir, 'zh-CN-additions.json');
const zhCNCompleteUpdatePath = path.join(localesDir, 'zh-CN-complete-update.json');
const outputPath = path.join(localesDir, 'zh-CN-unified.json');

// Deep merge function for proper object merging
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

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Main function to consolidate all translations
async function consolidateAllTranslations() {
  try {
    console.log('Starting Chinese translation consolidation process...');
    
    // Load all translation files
    const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    let zhCNAdditions = {};
    let zhCNCompleteUpdate = {};
    
    try {
      zhCNAdditions = JSON.parse(fs.readFileSync(zhCNAdditionsPath, 'utf8'));
      console.log('Successfully loaded zh-CN-additions.json');
    } catch (err) {
      console.log('No additions file found or error reading it:', err.message);
    }
    
    try {
      zhCNCompleteUpdate = JSON.parse(fs.readFileSync(zhCNCompleteUpdatePath, 'utf8'));
      console.log('Successfully loaded zh-CN-complete-update.json');
    } catch (err) {
      console.log('No complete update file found or error reading it:', err.message);
    }
    
    // Create deep merged unified translations
    const unifiedTranslations = deepMerge({}, zhCNTranslations);
    console.log('Starting deep merge with additions...');
    deepMerge(unifiedTranslations, zhCNAdditions);
    console.log('Starting deep merge with complete update...');
    deepMerge(unifiedTranslations, zhCNCompleteUpdate);
    
    console.log('Checking for missing critical translations...');
    
    // Add missing translations for problematic sections
    // Homepage hero section
    if (!unifiedTranslations.hero || !unifiedTranslations.hero.title) {
      console.log('Adding missing hero section translations');
      unifiedTranslations.hero = {
        ...(unifiedTranslations.hero || {}),
        title: "可持续工程解决方案",
        title_highlight: "为欧洲市场",
        subtitle: "为新时代基础设施提供创新材料",
        tagline: "工程更强大的明天",
        productTitle: "优质产品",
        productSubtitle: "高品质基础设施解决方案",
        globalShipping: "提供全球配送服务",
        learnMore: "了解更多",
        contact: "联系我们"
      };
    }
    
    // Why Choose Us section
    if (!unifiedTranslations.features) {
      console.log('Adding missing features/why choose us section translations');
      unifiedTranslations.features = {
        title: "为什么选择我们",
        subtitle: "我们对卓越的追求使我们在提供高品质产品和卓越服务方面脱颖而出",
        quality: {
          title: "优质品质",
          description: "我们提供来自信赖制造商的高品质产品，这些产品经过严格的质量控制。"
        },
        competitive: {
          title: "具有竞争力的价格",
          description: "通过我们的直接分销模式，我们能够提供优质产品和具有竞争力的价格。"
        },
        reliability: {
          title: "可靠的交付",
          description: "我们保证准时交付，并拥有高效的物流网络，确保您的产品安全送达。"
        },
        expertise: {
          title: "行业专长",
          description: "我们的团队拥有丰富的产品知识和行业经验，能够为您提供最佳解决方案。"
        }
      };
    }
    
    // Ensure footer translations are complete
    if (!unifiedTranslations.footer || !unifiedTranslations.footer.description) {
      console.log('Adding missing footer translations');
      unifiedTranslations.footer = {
        ...(unifiedTranslations.footer || {}),
        description: "MetaNord OÜ 专注于为欧洲和国际市场提供优质铝型材和基础设施产品。",
        products: {
          ...(unifiedTranslations.footer?.products || {}),
          title: "产品",
          aluminum: "铝制品",
          polyethylene: "聚乙烯制品",
          steel: "钢铁产品",
          castIron: "铸铁产品",
          infrastructure: "基础设施产品"
        },
        links: {
          ...(unifiedTranslations.footer?.links || {}),
          title: "快速链接",
          home: "首页",
          about: "关于我们",
          products: "产品",
          services: "服务",
          projects: "特色项目",
          contact: "联系我们"
        },
        resources: {
          ...(unifiedTranslations.footer?.resources || {}),
          title: "资源",
          documents: "文档",
          certifications: "认证",
          faq: "常见问题"
        },
        company: "公司",
        companyAbout: "关于我们",
        companyServices: "服务",
        companyProjects: "项目",
        companyDocuments: "文档",
        companyCareers: "职业发展",
        contact: "联系我们",
        contactAddress: "塔尔图大道 67a, 10134 塔林, 爱沙尼亚",
        contactPhone: "+372 5771 3442",
        contactEmail: "info@metanord.eu",
        newsletter: "订阅我们的通讯",
        newsletterDesc: "获取最新的产品更新和行业新闻。",
        subscribeBtn: "订阅",
        emailPlaceholder: "您的电子邮箱地址",
        copyright: "© 2025 MetaNord OÜ. 保留所有权利。",
        privacyPolicy: "隐私政策",
        termsOfService: "服务条款",
        cookiePolicy: "Cookie政策"
      };
    }
    
    // Ensure contact form translations are complete
    if (!unifiedTranslations.contact || !unifiedTranslations.contact.form) {
      console.log('Adding missing contact form translations');
      unifiedTranslations.contact = {
        ...(unifiedTranslations.contact || {}),
        form: {
          ...(unifiedTranslations.contact?.form || {}),
          title: "发送信息",
          name: "姓名",
          email: "电子邮箱",
          company: "公司",
          phone: "电话号码",
          subject: "主题",
          message: "信息",
          send: "发送信息",
          namePlaceholder: "输入您的姓名",
          emailPlaceholder: "输入您的电子邮箱地址",
          companyPlaceholder: "输入您的公司名称（可选）",
          phonePlaceholder: "输入您的电话号码（可选）",
          subjectPlaceholder: "请选择一个选项",
          messagePlaceholder: "输入您的信息",
          submitButton: "发送信息"
        },
        info: {
          ...(unifiedTranslations.contact?.info || {}),
          title: "联系信息",
          email: "电子邮箱",
          phone: "电话",
          address: "地址",
          hours: "工作时间"
        },
        faq: {
          ...(unifiedTranslations.contact?.faq || {}),
          title: "常见问题",
          subtitle: "关于我们服务的常见问题解答"
        }
      };
    }
    
    // Add missing translations for About page
    if (!unifiedTranslations.about || !unifiedTranslations.about.mission) {
      console.log('Adding missing about page translations');
      unifiedTranslations.about = {
        ...(unifiedTranslations.about || {}),
        mission: {
          ...(unifiedTranslations.about?.mission || {}),
          title: "我们的使命",
          description: "通过提供优质的基础设施材料和创新解决方案，为建设更可持续的未来做出贡献。"
        },
        vision: {
          ...(unifiedTranslations.about?.vision || {}),
          title: "我们的愿景",
          description: "成为欧洲基础设施材料分销领域值得信赖的合作伙伴，以卓越的质量和服务脱颖而出。"
        },
        values: {
          ...(unifiedTranslations.about?.values || {}),
          title: "我们的价值观",
          subtitle: "指导我们所有行动的核心原则",
          quality: {
            ...(unifiedTranslations.about?.values?.quality || {}),
            title: "产品质量",
            description: "我们确保所有产品符合最高的欧洲质量标准，在每个阶段都进行严格的测试和质量控制。"
          },
          integrity: {
            ...(unifiedTranslations.about?.values?.integrity || {}),
            title: "诚信",
            description: "我们在所有业务交易中保持透明和诚实，建立牢固的客户关系。"
          },
          sustainability: {
            ...(unifiedTranslations.about?.values?.sustainability || {}),
            title: "可持续性",
            description: "我们致力于提供环保材料，减少环境影响，支持可持续发展。"
          },
          innovation: {
            ...(unifiedTranslations.about?.values?.innovation || {}),
            title: "创新",
            description: "我们不断寻找新方法来改进我们的产品和服务，跟上行业最新发展。"
          }
        }
      };
    }
    
    // Ensure header translations are complete
    if (!unifiedTranslations.header || !unifiedTranslations.header.requestQuote) {
      console.log('Adding missing header translations');
      unifiedTranslations.header = {
        ...(unifiedTranslations.header || {}),
        home: "首页",
        products: "产品",
        services: "服务",
        about: "关于我们",
        contact: "联系",
        projects: "项目",
        documents: "文档",
        login: "登录",
        logout: "退出",
        dashboard: "仪表板",
        language: "语言",
        requestQuote: "请求报价",
        search: "搜索",
        menu: "菜单"
      };
    }
    
    // Write the unified translations back to zh-CN.json
    fs.writeFileSync(zhCNPath, JSON.stringify(unifiedTranslations, null, 2), 'utf8');
    console.log('Successfully unified all Chinese translations and updated zh-CN.json');
    
    // Also create a backup unified file
    fs.writeFileSync(outputPath, JSON.stringify(unifiedTranslations, null, 2), 'utf8');
    console.log('Created unified translation backup at zh-CN-unified.json');
    
  } catch (error) {
    console.error('Error in consolidateAllTranslations:', error);
  }
}

// Run the consolidation function
consolidateAllTranslations();