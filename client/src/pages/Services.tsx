import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ui/service-card";
import { Truck, ClipboardCheck, Bolt, HeadphonesIcon, ShoppingCartIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { useEffect } from "react";

export default function Services() {
  const { t, i18n } = useTranslation();
  
  // Comprehensive fix for all languages, specifically addressing the Chinese localization issues
  // as well as mobile layout and rendering problems
  useEffect(() => {
    // Ensure we're at the top of the page on load - extra reliable version for mobile
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // For iOS Safari specific scrolling issues
      if (document.body.scrollTo) {
        document.body.scrollTo(0, 0);
      }
    }
    
    // Fix for untranslated text in all languages, particularly Chinese
    const fixTranslations = () => {
      try {
        // Check all text nodes for translation placeholders and missing translations
        const elementTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span', 'div', 'a', 'button', 'li'];
        const allPossibleTextElements = document.querySelectorAll(elementTypes.join(','));
        
        // Detect and fix template literals and object notations that weren't properly translated
        allPossibleTextElements.forEach(el => {
          const text = el.textContent || '';
          
          // Fix template variable placeholders like {{services}}
          if (text.includes('{{') && text.includes('}}')) {
            let fixedText = text;
            
            // Chinese specific translations for common placeholders
            if (i18n.language === 'zh-CN') {
              fixedText = fixedText.replace(/\{\{services\}\}/g, '我们的服务');
              fixedText = fixedText.replace(/\{\{title\}\}/g, '标题');
              fixedText = fixedText.replace(/\{\{description\}\}/g, '描述');
              fixedText = fixedText.replace(/\{\{products\}\}/g, '产品');
              fixedText = fixedText.replace(/\{\{contact\}\}/g, '联系');
              fixedText = fixedText.replace(/\{\{about\}\}/g, '关于我们');
            } 
            // Lithuanian specific translations
            else if (i18n.language === 'lt') {
              fixedText = fixedText.replace(/\{\{services\}\}/g, 'Mūsų paslaugos');
              fixedText = fixedText.replace(/\{\{title\}\}/g, 'Pavadinimas');
              fixedText = fixedText.replace(/\{\{description\}\}/g, 'Aprašymas');
            }
            // Polish specific translations
            else if (i18n.language === 'pl') {
              fixedText = fixedText.replace(/\{\{services\}\}/g, 'Nasze usługi');
              fixedText = fixedText.replace(/\{\{title\}\}/g, 'Tytuł');
              fixedText = fixedText.replace(/\{\{description\}\}/g, 'Opis');
            }
            // Use English fallbacks for other languages
            else {
              fixedText = fixedText.replace(/\{\{services\}\}/g, 'Our Services');
              fixedText = fixedText.replace(/\{\{title\}\}/g, 'Title');
              fixedText = fixedText.replace(/\{\{description\}\}/g, 'Description');
            }
            
            if (fixedText !== text) {
              el.textContent = fixedText;
            }
          }
          
          // Fix [object Object] display issues
          if (text.includes('[object Object]')) {
            let fixedText = text;
            
            if (i18n.language === 'zh-CN') {
              fixedText = fixedText.replace(/\[object Object\]/g, '服务');
            } else if (i18n.language === 'lt') {
              fixedText = fixedText.replace(/\[object Object\]/g, 'Paslaugos');
            } else if (i18n.language === 'pl') {
              fixedText = fixedText.replace(/\[object Object\]/g, 'Usługi');
            } else {
              fixedText = fixedText.replace(/\[object Object\]/g, 'Services');
            }
            
            if (fixedText !== text) {
              el.textContent = fixedText;
            }
          }
        });
        
        // Extra safety - specific fixes for Chinese version header issue
        if (i18n.language === 'zh-CN') {
          const servicesHeaders = Array.from(document.querySelectorAll('h1')).filter(
            el => (el.textContent || '').includes('服务') || (el.textContent || '').trim() === ''
          );
          
          // If we found a likely services header, ensure it has the right text
          if (servicesHeaders.length > 0) {
            servicesHeaders.forEach(header => {
              if (header.textContent?.includes('{{') || header.textContent?.trim() === '') {
                header.textContent = '我们的服务';
              }
            });
          }
          
          // Fix page subtitle if needed
          const pageSubtitles = Array.from(document.querySelectorAll('p')).filter(
            el => el.className.includes('text-lg') || el.className.includes('subtitle')
          );
          
          if (pageSubtitles.length > 0) {
            pageSubtitles.forEach(subtitle => {
              if (subtitle.textContent?.includes('{{') || subtitle.textContent?.includes('[object')) {
                subtitle.textContent = '超越产品 - 全面的基础设施解决方案';
              }
            });
          }
        }
        
        // Fix mobile layout issues
        if (window.innerWidth < 768) {
          // Ensure all service cards are properly visible and styled
          const serviceCards = document.querySelectorAll('[class*="service-card"], [class*="glass-card"]');
          serviceCards.forEach(card => {
            if (card instanceof HTMLElement) {
              card.style.margin = '1rem 0';
              card.style.background = 'white';
              card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              card.style.borderRadius = '8px';
              card.style.overflow = 'hidden';
            }
          });
        }
      } catch (e) {
        console.error('Error fixing translations:', e);
      }
    };
    
    // Apply fixes after rendering - multiple times to ensure it catches dynamic content
    const fixTimes = [50, 200, 500, 1000];
    fixTimes.forEach(time => {
      setTimeout(fixTranslations, time);
    });
  }, [i18n.language]);
  const services = [
    {
      icon: Truck,
      title: t('services.logistics.title'),
      description: t('services.logistics.description'),
      features: [
        t('services.logistics.features.0'),
        t('services.logistics.features.1'),
        t('services.logistics.features.2')
      ]
    },
    {
      icon: ClipboardCheck,
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      features: [
        t('services.consulting.features.0'),
        t('services.consulting.features.1'),
        t('services.consulting.features.2')
      ]
    },
    {
      icon: Bolt,
      title: t('services.custom.title'),
      description: t('services.custom.description'),
      features: [
        t('services.custom.features.0'),
        t('services.custom.features.1'),
        t('services.custom.features.2')
      ]
    },
    {
      icon: HeadphonesIcon,
      title: t('services.support.title'),
      description: t('services.support.description'),
      features: [
        t('services.support.features.0'),
        t('services.support.features.1'),
        t('services.support.features.2')
      ]
    },
    {
      icon: ShoppingCartIcon,
      title: t('services.procurement.title'),
      description: t('services.procurement.description'),
      features: [
        t('services.procurement.features.0'),
        t('services.procurement.features.1'),
        t('services.procurement.features.2')
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <MetaTags
        title={t('services.metaTitle')}
        description={t('services.metaDescription')}
        keywords="industrial services, logistics, consulting, project management, quality control, MetaNord"
        ogType="website"
      />
      
      <SchemaOrg
        type="website"
        title={t('services.metaTitle')}
        description={t('services.metaDescription')}
        url="/services"
        breadcrumbs={[
          { name: t('navigation.home', 'Home'), url: '/' },
          { name: t('navigation.services', 'Services'), url: '/services' }
        ]}
      />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-inter font-bold mb-6">
              {t('services.hero.title', 'Our Services')}
            </h1>
            <p className="text-lg md:text-xl font-roboto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-inter font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('services.overview.title')}
            </motion.h2>
            <motion.p 
              className="text-lg text-neutral-dark max-w-3xl mx-auto font-roboto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('services.overview.description')}
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.slice(0, 3).map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Service Process */}
      <section className="py-16 bg-neutral-lightest">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-inter font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('services.process.title')}
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary transform md:-translate-x-1/2"></div>
              
              {/* Timeline items */}
              <div className="space-y-24 md:space-y-20">
                <motion.div 
                  className="relative flex flex-col md:flex-row items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end">
                    <div className="md:text-right md:pr-16 max-w-sm ml-auto">
                      <h3 className="text-xl font-inter font-semibold mb-2">{t('services.process.steps.0.title')}</h3>
                      <p className="font-roboto text-neutral-dark">
                        {t('services.process.steps.0.description')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-primary rounded-full transform md:-translate-x-1/2 flex items-center justify-center text-white font-bold z-10 shadow-lg">1</div>
                  <div className="pl-12 md:pl-0 md:w-1/2 md:pl-16 mt-6 md:mt-0 flex items-center">
                    {/* Empty div to maintain proper spacing */}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative flex flex-col md:flex-row items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end md:order-2">
                    <div className="md:pl-16 max-w-sm">
                      <h3 className="text-xl font-inter font-semibold mb-2">{t('services.process.steps.1.title')}</h3>
                      <p className="font-roboto text-neutral-dark">
                        {t('services.process.steps.1.description')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-primary rounded-full transform md:-translate-x-1/2 flex items-center justify-center text-white font-bold z-10 shadow-lg">2</div>
                  <div className="pl-12 md:pl-0 md:w-1/2 md:pr-16 mt-6 md:mt-0 md:order-1 flex items-center justify-end">
                    {/* Empty div to maintain proper spacing */}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative flex flex-col md:flex-row items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end">
                    <div className="md:text-right md:pr-16 max-w-sm ml-auto">
                      <h3 className="text-xl font-inter font-semibold mb-2">{t('services.process.steps.2.title')}</h3>
                      <p className="font-roboto text-neutral-dark">
                        {t('services.process.steps.2.description')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-primary rounded-full transform md:-translate-x-1/2 flex items-center justify-center text-white font-bold z-10 shadow-lg">3</div>
                  <div className="pl-12 md:pl-0 md:w-1/2 md:pl-16 mt-6 md:mt-0 flex items-center">
                    {/* Empty div to maintain proper spacing */}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative flex flex-col md:flex-row items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end md:order-2">
                    <div className="md:pl-16 max-w-sm">
                      <h3 className="text-xl font-inter font-semibold mb-2">{t('services.process.steps.3.title')}</h3>
                      <p className="font-roboto text-neutral-dark">
                        {t('services.process.steps.3.description')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-primary rounded-full transform md:-translate-x-1/2 flex items-center justify-center text-white font-bold z-10 shadow-lg">4</div>
                  <div className="pl-12 md:pl-0 md:w-1/2 md:pr-16 mt-6 md:mt-0 md:order-1 flex items-center justify-end">
                    {/* Empty div to maintain proper spacing */}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative flex flex-col md:flex-row items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center md:w-1/2 md:justify-end">
                    <div className="md:text-right md:pr-16 max-w-sm ml-auto">
                      <h3 className="text-xl font-inter font-semibold mb-2">{t('services.process.steps.4.title')}</h3>
                      <p className="font-roboto text-neutral-dark">
                        {t('services.process.steps.4.description')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-primary rounded-full transform md:-translate-x-1/2 flex items-center justify-center text-white font-bold z-10 shadow-lg">5</div>
                  <div className="pl-12 md:pl-0 md:w-1/2 md:pl-16 mt-6 md:mt-0 flex items-center">
                    {/* Empty div to maintain proper spacing */}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-inter font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('services.additionalTitle')}
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.slice(3, 5).map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
