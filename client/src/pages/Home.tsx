import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import SocialMediaTags from "@/components/seo/SocialMediaTags";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Get base URL for canonical and alternate links
  const baseUrl = "https://metanord.eu";
  
  // Create language alternates for better SEO
  const languageAlternates = [
    { hrefLang: "en", href: `${baseUrl}/` },
    { hrefLang: "et", href: `${baseUrl}/et/` },
    { hrefLang: "ru", href: `${baseUrl}/ru/` },
    { hrefLang: "lv", href: `${baseUrl}/lv/` },
    { hrefLang: "lt", href: `${baseUrl}/lt/` },
    { hrefLang: "pl", href: `${baseUrl}/pl/` },
    { hrefLang: "x-default", href: `${baseUrl}/` }
  ];
  
  return (
    <>
      {/* Enhanced SEO metadata */}
      <MetaTags
        title={t('home.metaTitle', 'MetaNord - Premium Aluminum Profiles & Infrastructure Products')}
        description={t('home.metaDescription', 'MetaNord OÜ specializes in premium aluminum profiles and infrastructure products for European and international markets. High-quality solutions for construction, utilities, and industrial sectors.')}
        keywords={t('home.keywords', 'aluminum profiles, infrastructure products, construction materials, industrial solutions, MetaNord, European suppliers')}
        ogType="website"
        canonical={`${baseUrl}/${language !== 'en' ? language + '/' : ''}`}
        languageAlternates={languageAlternates}
      />
      
      {/* Schema.org structured data */}
      <SchemaOrg 
        type="website"
        title={t('home.metaTitle', 'MetaNord - Premium Aluminum Profiles & Infrastructure Products')}
        description={t('home.metaDescription', 'MetaNord OÜ specializes in premium aluminum profiles and infrastructure products for European and international markets.')}
        url={`${baseUrl}/${language !== 'en' ? language + '/' : ''}`}
        imageUrl={`${baseUrl}/logo.png`}
        breadcrumbs={[
          {
            name: t('navigation.home', 'Home'),
            url: `${baseUrl}/${language !== 'en' ? language + '/' : ''}`
          }
        ]}
      />
      
      {/* Add social media tags for better sharing */}
      <SocialMediaTags
        title={t('home.metaTitle', 'MetaNord - Premium Aluminum Profiles & Infrastructure Products')}
        description={t('home.metaDescription', 'MetaNord OÜ specializes in premium aluminum profiles and infrastructure products for European and international markets.')}
        url={`${baseUrl}/${language !== 'en' ? language + '/' : ''}`}
        image={`${baseUrl}/logo.png`}
        locale={language}
        alternateLocales={["en", "et", "ru", "lv", "lt", "pl"].filter(lang => lang !== language)}
      />
      <Hero />
      <Features />
      <AboutSection />
      <ProductsSection />
      <ProjectsSection />
      <ServicesSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}
