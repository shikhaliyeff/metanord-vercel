/**
 * Complete Chinese Translation Fix
 * 
 * A comprehensive script to fix all Chinese translation issues in the MetaNord website.
 * This script focuses on ensuring complete translations for the Hero section and 
 * other critical UI components.
 */
import fs from 'fs';
import path from 'path';

// Define the path to Chinese translation file
const zhCNPath = path.join('client/src/locales', 'zh-CN.json');

async function fixChineseTranslations() {
  try {
    console.log('Starting comprehensive Chinese translation fix...');
    
    // Load the current zh-CN.json file
    const zhCNTranslations = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
    
    // Add or update critical hero section translations
    zhCNTranslations.hero = {
      ...(zhCNTranslations.hero || {}),
      title: "专业分销",
      title_highlight: "为欧洲市场",
      subtitle: "来自可信赖制造商的铝型材和城市基础设施产品",
      tagline: "工程更强大的明天",
      productTitle: "优质产品",
      productSubtitle: "高品质基础设施解决方案",
      globalShipping: "提供全球配送服务",
      learnMore: "了解更多",
      contact: "联系我们"
    };
    
    // Add or update Features/Why Choose Us section
    zhCNTranslations.features = {
      ...(zhCNTranslations.features || {}),
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
    
    // Add or update header translations
    zhCNTranslations.header = {
      ...(zhCNTranslations.header || {}),
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
    
    // Add or update About page translations
    zhCNTranslations.about = {
      ...(zhCNTranslations.about || {}),
      title: "关于我们",
      subtitle: "了解我们如何为欧洲基础设施项目提供高品质材料",
      description: "MetaNord OÜ是一家专注于分销欧洲基础设施项目所需的优质材料的公司。我们通过可靠的供应链和专业知识，确保我们的客户收到满足其项目需求的高品质产品。",
      mission: {
        title: "我们的使命",
        description: "通过提供优质的基础设施材料和创新解决方案，为建设更可持续的未来做出贡献。"
      },
      vision: {
        title: "我们的愿景",
        description: "成为欧洲基础设施材料分销领域值得信赖的合作伙伴，以卓越的质量和服务脱颖而出。"
      },
      values: {
        title: "我们的价值观",
        subtitle: "指导我们所有行动的核心原则",
        quality: {
          title: "产品质量",
          description: "我们确保所有产品符合最高的欧洲质量标准，在每个阶段都进行严格的测试和质量控制。"
        },
        integrity: {
          title: "诚信",
          description: "我们在所有业务交易中保持透明和诚实，建立牢固的客户关系。"
        },
        sustainability: {
          title: "可持续性",
          description: "我们致力于提供环保材料，减少环境影响，支持可持续发展。"
        },
        innovation: {
          title: "创新",
          description: "我们不断寻找新方法来改进我们的产品和服务，跟上行业最新发展。"
        }
      }
    };
    
    // Add or update contact form translations
    zhCNTranslations.contact = {
      ...(zhCNTranslations.contact || {}),
      title: "联系我们",
      subtitle: "有疑问或需要更多信息？我们很乐意为您提供帮助。",
      form: {
        ...(zhCNTranslations.contact?.form || {}),
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
        subjectPlaceholder: "选择一个选项",
        messagePlaceholder: "输入您的信息",
        submitButton: "发送信息"
      },
      info: {
        ...(zhCNTranslations.contact?.info || {}),
        title: "联系信息",
        email: "电子邮箱",
        phone: "电话",
        address: "地址",
        hours: "工作时间"
      },
      faq: {
        ...(zhCNTranslations.contact?.faq || {}),
        title: "常见问题",
        subtitle: "关于我们服务的常见问题解答"
      }
    };
    
    // Add or update product page translations
    zhCNTranslations.products = {
      ...(zhCNTranslations.products || {}),
      heading: "我们的产品",
      subheading: "高品质基础设施产品，用于建筑和公用事业项目",
      metaTitle: "高品质基础设施产品 - MetaNord",
      metaDescription: "探索MetaNord广泛的铝型材、聚乙烯管道、钢铁产品和铸铁基础设施解决方案，适用于建筑和公用事业项目。",
      keywords: "铝型材，基础设施产品，聚乙烯管道，铸铁产品，建筑材料",
      schemaTitle: "MetaNord基础设施产品",
      schemaDescription: "适用于建筑和公用事业项目的高品质基础设施产品",
      filter: {
        ...(zhCNTranslations.products?.filter || {}),
        all: "所有产品",
        aluminum: "铝制品",
        polyethylene: "聚乙烯",
        steel: "钢铁",
        castIron: "铸铁"
      },
      loadMore: "加载更多产品",
      noProducts: "该类别中没有找到产品",
      endOfResults: "结果结束",
      quickPreview: "快速预览",
      viewDetails: "查看详情"
    };
    
    // Add or update footer translations
    zhCNTranslations.footer = {
      ...(zhCNTranslations.footer || {}),
      description: "MetaNord OÜ 专注于为欧洲和国际市场提供优质铝型材和基础设施产品。",
      products: {
        ...(zhCNTranslations.footer?.products || {}),
        title: "产品",
        aluminum: "铝制品",
        polyethylene: "聚乙烯制品",
        steel: "钢铁产品",
        castIron: "铸铁产品",
        infrastructure: "基础设施产品"
      },
      links: {
        ...(zhCNTranslations.footer?.links || {}),
        title: "快速链接",
        home: "首页",
        about: "关于我们",
        products: "产品",
        services: "服务",
        projects: "特色项目",
        contact: "联系我们"
      },
      resources: {
        ...(zhCNTranslations.footer?.resources || {}),
        title: "资源",
        documents: "文档",
        certifications: "认证",
        faq: "常见问题"
      }
    };
    
    // Write the updated translations back to the file
    fs.writeFileSync(zhCNPath, JSON.stringify(zhCNTranslations, null, 2), 'utf8');
    console.log('Successfully updated Chinese translations in zh-CN.json');
    
  } catch (error) {
    console.error('Error fixing Chinese translations:', error);
  }
}

// Run the fix
fixChineseTranslations();