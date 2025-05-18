import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { PageHeader } from "@/components/ui/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";

export default function Faq() {
  const { t, i18n } = useTranslation();
  
  // Updated FAQ structure with translation keys
  const faqItems = [
    {
      id: 'product-types',
      questionKey: 'faq.items.0.question',
      questionDefault: 'What types of products does MetaNord supply?',
      answerKey: 'faq.items.0.answer',
      answerDefault: 'MetaNord specializes in distributing aluminum profiles, polyethylene pipes, steel components, and other infrastructure materials sourced from trusted global manufacturers.'
    },
    {
      id: 'custom-solutions',
      questionKey: 'faq.items.1.question',
      questionDefault: 'Do you offer custom manufacturing or tailored solutions?',
      answerKey: 'faq.items.1.answer',
      answerDefault: 'Yes. We can provide custom dimensions, finishes, or specifications based on project needs. Please contact our sales team for customized quotations and engineering review.'
    },
    {
      id: 'delivery-terms',
      questionKey: 'faq.items.2.question',
      questionDefault: 'What are your delivery times and terms?',
      answerKey: 'faq.items.2.answer',
      answerDefault: 'Delivery times depend on product type and quantity. Standard items are typically delivered within 7-14 business days across Europe. We also support express shipping upon request.'
    },
    {
      id: 'international-shipping',
      questionKey: 'faq.items.3.question',
      questionDefault: 'Can you deliver outside the European Union?',
      answerKey: 'faq.items.3.answer',
      answerDefault: 'Yes, we support international shipping to a wide range of markets, including non-EU countries. Please contact us with your location and required materials for a logistics assessment.'
    },
    {
      id: 'documentation',
      questionKey: 'faq.items.4.question',
      questionDefault: 'Do you provide product certificates and technical documentation?',
      answerKey: 'faq.items.4.answer',
      answerDefault: 'Absolutely. Most products come with EN standard certificates and detailed technical data sheets, available on the Documents page or on individual product pages.'
    },
    {
      id: 'quotation',
      questionKey: 'faq.items.5.question',
      questionDefault: 'How can I request a price quotation?',
      answerKey: 'faq.items.5.answer',
      answerDefault: 'You can request a price quotation through the contact form on our website, by emailing info@metanord.eu, or by calling +372 5771 3442. Please specify the required products, quantities, and delivery location.'
    },
    {
      id: 'quality-assurance',
      questionKey: 'faq.items.6.question',
      questionDefault: 'What quality assurance does MetaNord provide?',
      answerKey: 'faq.items.6.answer',
      answerDefault: 'All our products undergo rigorous quality checks to ensure they meet European standards for durability, safety, and performance. We partner with certified manufacturers who maintain strict quality control systems.'
    }
  ];
  
  // Enhanced fix for FAQ layout issues in all languages, with special focus on Chinese
  useEffect(() => {
    // Add a class to reset any problematic styles
    document.body.classList.add('faq-page-active');
    
    // Comprehensive fix for FAQ layout issues
    const fixFaqLayout = () => {
      try {
        // Remove problematic backgrounds and ensure consistent styling
        const faqElements = document.querySelectorAll('.accordion-item, .accordion-content, .accordion-trigger');
        faqElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Set consistent styling for all FAQ elements
            el.style.background = 'white';
            el.style.backgroundImage = 'none';
            el.style.color = '#333';
            
            // Improve text readability
            if (el.classList.contains('accordion-content')) {
              el.style.lineHeight = '1.6';
              el.style.fontSize = i18n.language === 'zh-CN' ? '16px' : '15px';
              el.style.fontWeight = '400';
              el.style.padding = '1rem 1.5rem';
            }
            
            // Fix question triggers
            if (el.classList.contains('accordion-trigger') || el.closest('.accordion-trigger')) {
              const trigger = el.classList.contains('accordion-trigger') ? el : el.closest('.accordion-trigger');
              if (trigger instanceof HTMLElement) {
                trigger.style.padding = '1rem 1.25rem';
                
                // Add extra spacing for Chinese characters
                if (i18n.language === 'zh-CN') {
                  trigger.style.letterSpacing = '0.025em';
                  trigger.style.wordSpacing = '0.05em';
                }
              }
            }
          }
        });
        
        // Special fixes for Chinese language
        if (i18n.language === 'zh-CN') {
          // Fix Chinese-specific layout issues
          document.querySelectorAll('.accordion-item').forEach(item => {
            if (item instanceof HTMLElement) {
              item.style.marginBottom = '1rem';
              item.style.borderRadius = '8px';
              item.style.overflow = 'hidden';
            }
          });
          
          // Ensure proper question text wrapping
          document.querySelectorAll('.accordion-trigger span').forEach(span => {
            if (span instanceof HTMLElement) {
              span.style.wordBreak = 'break-word';
              span.style.whiteSpace = 'normal';
              span.style.lineHeight = '1.5';
            }
          });
        }
      } catch (e) {
        console.error('Error fixing FAQ layout:', e);
      }
    };
    
    // Apply fixes after rendering with multiple checks
    // Initial fix
    setTimeout(fixFaqLayout, 100);
    // Secondary check after content is fully loaded
    setTimeout(fixFaqLayout, 500);
    // Final check for any dynamic content changes
    setTimeout(fixFaqLayout, 1000);
    
    // Cleanup
    return () => {
      document.body.classList.remove('faq-page-active');
    };
  }, [i18n.language]);

  // Using our updated structured faqItems with translation keys defined above

  // Structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": t(item.questionKey, item.questionDefault),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(item.answerKey, item.answerDefault)
      }
    }))
  };

  // Add useEffect to fix the mobile layout issues and Chinese translation problems
  useEffect(() => {
    // Force scroll to top on page load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
    
    // Fix layout issues on mobile
    const fixMobileLayout = () => {
      try {
        // Remove any problematic gradient overlays
        const overlays = document.querySelectorAll('.bg-gradient-to-b, [class*="gradient"]');
        overlays.forEach(el => {
          if (el instanceof HTMLElement) {
            if (el.classList.contains('glass-card')) {
              el.style.background = 'white';
              el.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
          }
        });
        
        // Fix any spacing or alignment issues
        const accordionItems = document.querySelectorAll('.accordion-item, [class*="accordion"]');
        accordionItems.forEach(item => {
          if (item instanceof HTMLElement) {
            item.style.marginBottom = '12px';
            item.style.overflow = 'hidden';
            item.style.borderRadius = '8px';
            item.style.border = '1px solid rgba(0, 0, 0, 0.1)';
          }
        });
        
        // Fix any text that might be cut off
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        textElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.overflowWrap = 'break-word';
            el.style.wordBreak = 'break-word';
          }
        });
      } catch (e) {
        console.error('Error fixing mobile layout:', e);
      }
    };
    
    // Apply fixes after a short delay to ensure content is rendered
    setTimeout(fixMobileLayout, 100);
    setTimeout(fixMobileLayout, 500); // Apply again in case of any dynamic updates
    
    // Handle Chinese language specifically
    if (i18n.language === 'zh-CN') {
      try {
        // On Chinese version, find any untranslated FAQ items
        const fixChineseTranslations = () => {
          // Get all accordion items that might contain untranslated content
          const accordionTriggers = document.querySelectorAll('.accordion-trigger, [role="button"]');
          const accordionContents = document.querySelectorAll('.accordion-content, [data-state]');
          
          // Check if the content is in English (simplistic check - could improve)
          const isEnglishText = (text: string) => {
            // Simple heuristic: if it contains mostly ASCII characters, it's likely English
            return /^[A-Za-z0-9\s\.,\?\!]+$/.test(text.trim());
          };
          
          // Fix any English text in Chinese version
          const chineseTranslations: Record<string, string> = {
            // Key FAQ questions in Chinese
            "What types of products does MetaNord supply?": "MetaNord供应哪些类型的产品？",
            "Do you offer custom manufacturing or tailored solutions?": "您是否提供定制制造或定制解决方案？",
            "What are your lead times and delivery terms?": "您的交货时间和交付条款是什么？",
            "Can you deliver outside the European Union?": "您能否在欧盟以外地区交付？",
            "Do you provide product certifications and technical documentation?": "您是否提供产品认证和技术文档？",
            "How can I request a quotation?": "如何申请报价？",
            "Do you offer volume pricing or B2B account options?": "您是否提供批量价格或B2B账户选项？",
            "Can you assist with logistics or unloading?": "您能否协助物流或卸货？",
            "How do I get technical support or speak with an expert?": "如何获得技术支持或与专家交谈？",
            "What payment methods do you accept?": "您接受哪些付款方式？",
            
            // Common answer content
            "MetaNord specializes in": "MetaNord专注于",
            "Yes.": "是的。",
            "Lead times depend": "交货时间取决于",
            "European Union": "欧盟",
            "Absolutely": "当然",
            "Request Quote": "请求报价",
            "competitive pricing": "有竞争力的价格",
            "logistics": "物流",
            "technical support": "技术支持",
            "payment methods": "付款方式"
          };
          
          // Apply translations to accordion triggers (questions)
          accordionTriggers.forEach(trigger => {
            const text = trigger.textContent || '';
            if (isEnglishText(text)) {
              // Try to find a matching Chinese translation
              Object.entries(chineseTranslations).forEach(([english, chinese]) => {
                if (text.includes(english)) {
                  trigger.textContent = text.replace(english, chinese);
                }
              });
            }
          });
          
          // Apply translations to accordion contents (answers)
          accordionContents.forEach(content => {
            const text = content.textContent || '';
            if (isEnglishText(text)) {
              let translatedText = text;
              // Apply multiple partial translations
              Object.entries(chineseTranslations).forEach(([english, chinese]) => {
                translatedText = translatedText.replace(new RegExp(english, 'g'), chinese);
              });
              if (translatedText !== text) {
                content.textContent = translatedText;
              }
            }
          });
        };
        
        // Apply Chinese fixes after some delay to ensure content is loaded
        setTimeout(fixChineseTranslations, 200);
        setTimeout(fixChineseTranslations, 600);
      } catch (e) {
        console.error('Error fixing Chinese translations:', e);
      }
    }
  }, [i18n.language]); // Re-run when language changes
  
  return (
    <>
      <Helmet>
        <title>{t("faq.metaTitle", "Frequently Asked Questions | MetaNord")}</title>
        <meta 
          name="description" 
          content={t("faq.metaDescription", "Find answers to common questions about MetaNord's products, services, delivery terms, and technical support. Get the information you need for your infrastructure projects.")}
        />
        <meta property="og:title" content={t("faq.metaTitle", "Frequently Asked Questions | MetaNord")} />
        <meta 
          property="og:description" 
          content={t("faq.metaDescription", "Find answers to common questions about MetaNord's products, services, delivery terms, and technical support.")}
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <PageHeader 
          title={t("faq.title", "Frequently Asked Questions")} 
          description={t("faq.description", "Find answers to common questions about our products, services, and business operations. If you don't see your question answered here, please contact us directly.")}
        />

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4 mobile-optimized-accordion">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={`faq-${index}`} 
                value={`item-${index}`}
                className={`bg-white border border-gray-200 rounded-lg px-2 py-0.5 overflow-hidden shadow-sm ${
  i18n.language === 'zh-CN' ? 'chinese-faq-item' : ''
}`}
                style={{
                  fontSize: i18n.language === 'zh-CN' ? '16px' : 'inherit',
                  lineHeight: i18n.language === 'zh-CN' ? '1.6' : 'inherit',
                  background: "white",
                  backgroundImage: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                <AccordionTrigger 
                  className="p-4 text-lg font-medium text-primary hover:text-accent flex" 
                  style={{
                    background: "white",
                    color: "#333"
                  }}
                >
                  <div className="flex items-center gap-2 text-left">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 text-accent/80" />
                    <span className="faq-item-question" data-faq-id={item.id}>{t(item.questionKey, item.questionDefault)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent 
                  className="p-4 pt-0 text-base text-gray-800 leading-relaxed faq-item-answer"
                  style={{
                    background: "white",
                    color: "#333",
                    backgroundImage: "none"
                  }}
                  data-faq-id={item.id}
                >
                  {t(item.answerKey, item.answerDefault)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            {t("faq.contactCallout", "Still have questions? We're here to help.")}
          </p>
          <div className="mt-4">
            <a 
              href="mailto:info@metanord.eu"
              className="text-accent hover:underline font-medium"
            >
              info@metanord.eu
            </a>
          </div>
        </div>
      </div>
    </>
  );
}