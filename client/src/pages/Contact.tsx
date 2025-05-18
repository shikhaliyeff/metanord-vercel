import { ContactSection } from "@/components/sections/ContactSection";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";

export default function Contact() {
  const { t } = useTranslation();
  
  return (
    <>
      <MetaTags
        title={t('contact.metaTitle', 'Contact Us - MetaNord | European & International Industrial Solutions')}
        description={t('contact.metaDescription', 'Contact MetaNord\'s team for inquiries about our aluminum profiles and infrastructure products for European and international markets. Request quotes, technical information, or support for your projects worldwide.')}
        keywords={["contact us", "MetaNord contact", "aluminum profiles inquiry", "infrastructure products support", "technical assistance", "quote request"]}
        type="contactpage"
      />
      
      <SchemaOrg
        type="contactpage"
        title={t('contact.metaTitle', 'Contact Us - MetaNord | European & International Industrial Solutions')}
        description={t('contact.metaDescription', 'Contact MetaNord\'s team for inquiries about our aluminum profiles and infrastructure products for European and international markets. Request quotes, technical information, or support for your projects worldwide.')}
        url="/contact"
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('contact.title', 'Contact'), url: '/contact' }
        ]}
      />
      
      {/* Hero Section - Mobile optimized */}
      <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient and overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark">
          {/* Decorative elements - optimized for mobile */}
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-full md:w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,196,255,0.15)_0%,_transparent_60%)]"></div>
          
          {/* Animated dots pattern - adjusted for smaller screens */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', 
              backgroundSize: '20px 20px' /* Reduced size for mobile */ 
            }}></div>
          </motion.div>
        </div>
        
        {/* Content - mobile optimized spacing */}
        <div className="container mx-auto px-4 relative z-10 py-12 sm:py-16 md:py-20">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block mb-4 sm:mb-6">
              <motion.div 
                className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white/90 text-xs sm:text-sm font-medium border border-white/10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('contact.getInTouch', 'Contact Our Team')}
              </motion.div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-inter font-bold mb-4 sm:mb-6 text-white">
              {t('contact.title', 'Contact')} <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-300">{t('contact.titleHighlight', 'Us')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl font-roboto text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t('contact.subtitle', 'Our experienced team is ready to assist you with product inquiries, custom solutions, and technical support for all your infrastructure and aluminum profile needs.')}
            </p>
            
            {/* Decorative element */}
            <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
              <motion.div 
                className="w-12 sm:w-16 h-1 bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "48px" }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto fill-white">
            <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,75C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* FAQ Section - Mobile optimized */}
      <section className="py-10 sm:py-12 md:py-16 bg-neutral-lightest">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.h2 
              className="text-2xl sm:text-2xl md:text-3xl font-inter font-bold mb-3 sm:mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('contact.faq.title')}
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-neutral-dark max-w-3xl mx-auto font-roboto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('contact.faq.subtitle')}
            </motion.p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg sm:text-xl font-inter font-semibold mb-1.5 sm:mb-2">{t('contact.faq.q1.question')}</h3>
              <p className="font-roboto text-neutral-dark text-sm sm:text-base">
                {t('contact.faq.q1.answer')}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg sm:text-xl font-inter font-semibold mb-1.5 sm:mb-2">{t('contact.faq.q2.question')}</h3>
              <p className="font-roboto text-neutral-dark text-sm sm:text-base">
                {t('contact.faq.q2.answer')}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-inter font-semibold mb-1.5 sm:mb-2">{t('contact.faq.q3.question')}</h3>
              <p className="font-roboto text-neutral-dark text-sm sm:text-base">
                {t('contact.faq.q3.answer')}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg sm:text-xl font-inter font-semibold mb-1.5 sm:mb-2">{t('contact.faq.q4.question')}</h3>
              <p className="font-roboto text-neutral-dark text-sm sm:text-base">
                {t('contact.faq.q4.answer')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
