import { motion } from "framer-motion";
import { CheckCircleIcon, LightbulbIcon, GlobeIcon, UsersIcon, BarChart3Icon, ArrowRightIcon, LeafIcon, BriefcaseIcon, BuildingIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";

// Import product images
import aluminumUProfile from "@assets/Aluminum U-Profiles.jpg";
import aluminumTProfile from "@assets/Aluminum T-Profiles.jpg";
import aluminumLEDProfile from "@assets/Aluminum LED Profile.jpg";
import aluminumExtrusion from "@assets/Aluminum-Profile-Extrusion.webp";
import manholeD400K from "@assets/Manhole cover D400(K) .png";
import logo from "@assets/Geometric Design Logo for MetaNord (3).png";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <MetaTags
        title={t('about.metaTitle', 'About Us - MetaNord | Premium Industrial Solutions for European & International Markets')}
        description={t('about.metaDescription', 'Learn about MetaNord OÜ, an Estonia-based global trading and distribution company specializing in aluminum profiles and infrastructure products for European and international markets.')}
        keywords="MetaNord company, aluminum profiles supplier, infrastructure products Estonia, European markets trading, industrial solutions, premium aluminum supplier"
        ogType="website"
      />
      
      <SchemaOrg
        type="website"
        title={t('about.metaTitle', 'About Us - MetaNord | Premium Industrial Solutions for European & International Markets')}
        description={t('about.metaDescription', 'Learn about MetaNord OÜ, an Estonia-based global trading and distribution company specializing in aluminum profiles and infrastructure products for European and international markets.')}
        url="/about"
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('about.title', 'About Us'), url: '/about' }
        ]}
      />

      {/* Hero Section with more modern design */}
      <section className="relative pb-24 pt-32 overflow-hidden">
        {/* Background with gradient and overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,196,255,0.15)_0%,_transparent_60%)]"></div>

          {/* Animated dots pattern */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}></div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-16">
            <motion.div 
              className="lg:w-1/2 text-white"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center mb-4">
                <img src={logo} alt="MetaNord Logo" className="h-16 mr-4" />
                <h1 className="text-4xl md:text-5xl font-inter font-bold leading-tight">
                  <span className="text-primary">MetaNord</span>
                </h1>
              </div>

              <h2 className="text-xl md:text-2xl mb-6 font-light text-white/90">
                {t('about.subtitle')}
              </h2>

              <p className="text-lg text-white/80 mb-8 font-roboto max-w-xl">
                {t('about.description')}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center">
                  <div className="mr-3 text-accent">
                    <GlobeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{t('about.countries')}</p>
                    <p className="text-white font-bold text-xl">15+</p>
                  </div>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center">
                  <div className="mr-3 text-accent">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{t('about.products')}</p>
                    <p className="text-white font-bold text-xl">200+</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="glass-card backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                <div className="grid grid-cols-2 gap-2 p-3">
                  <div className="glass-card rounded-xl overflow-hidden">
                    <img 
                      src={aluminumExtrusion} 
                      alt="Aluminum Profile Extrusions" 
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    <div className="glass-card rounded-xl overflow-hidden bg-white/90">
                      <img 
                        src={aluminumUProfile}
                        alt="Aluminum U-Profiles" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="glass-card rounded-xl overflow-hidden bg-white/90">
                      <img 
                        src={aluminumTProfile}
                        alt="Aluminum T-Profiles" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="glass-card rounded-xl overflow-hidden bg-white/90">
                      <img 
                        src={aluminumLEDProfile}
                        alt="Aluminum LED Profiles" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="glass-card rounded-xl overflow-hidden bg-white/90">
                      <img 
                        src={aluminumExtrusion}
                        alt="Aluminum Profile Extrusion" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 text-white">
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                      {t('about.product1')}
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                      {t('about.product2')}
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                      {t('about.product3')}
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                      {t('about.product4')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{t('about.product_categories')}</h3>
                  <p className="text-white/70">Distribution across European markets</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto fill-white">
            <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,75C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Vision & Strategy Section - NEW! */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card backdrop-blur-md bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 shadow-soft neumorph">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-6">
                  <LightbulbIcon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-inter font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {t('about.vision.title')}
                </h2>
                <p className="text-lg text-neutral-dark mb-6 font-roboto">
                  {t('about.vision.text')}
                </p>
                <div className="border-t border-primary/10 pt-6 mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-neutral-dark/60 text-sm mb-1">{t('about.experience.title')}</p>
                      <p className="text-lg font-medium">{t('about.experience.text')}</p>
                    </div>
                    <div>
                      <p className="text-neutral-dark/60 text-sm mb-1">{t('about.sustainability.title')}</p>
                      <p className="text-lg font-medium">{t('about.sustainability.text')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-soft neumorph">
                  <div className="text-accent mb-4">
                    <GlobeIcon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold mb-3">{t('about.markets.title')}</h3>
                  <p className="font-roboto text-neutral-dark">
                    {t('about.markets.text')}
                  </p>
                </div>

                <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-soft neumorph">
                  <div className="text-accent mb-4">
                    <BarChart3Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold mb-3">{t('about.quality.title')}</h3>
                  <p className="font-roboto text-neutral-dark">
                    {t('about.quality.text')}
                  </p>
                </div>

                <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-soft neumorph">
                  <div className="text-accent mb-4">
                    <LeafIcon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold mb-3">{t('about.values.sustainability.title')}</h3>
                  <p className="font-roboto text-neutral-dark">
                    {t('about.values.sustainability.description')}
                  </p>
                </div>

                <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-6 shadow-soft neumorph">
                  <div className="text-accent mb-4">
                    <UsersIcon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-inter font-semibold mb-3">{t('about.values.customer.title')}</h3>
                  <p className="font-roboto text-neutral-dark">
                    {t('about.values.customer.description')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story Section - REDESIGNED */}
      <section className="py-24 bg-neutral-lightest">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-inter font-bold mb-6 relative inline-block">
                {t('about.story.title')}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </h2>
            </motion.div>

            <motion.div
              className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-8 md:p-10 shadow-soft neumorph"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-neutral-dark mb-6 font-roboto">
                {t('about.story.paragraph1')}
              </p>
              <p className="text-lg text-neutral-dark mb-6 font-roboto">
                {t('about.story.paragraph2')}
              </p>
              <p className="text-lg text-neutral-dark font-roboto">
                {t('about.story.paragraph3')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-neutral-light">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">15+</div>
                  <p className="text-neutral-dark mt-2">{t('about.countries')}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">200+</div>
                  <p className="text-neutral-dark mt-2">{t('about.products')}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('about.experience.years')}</div>
                  <p className="text-neutral-dark mt-2">{t('about.experience.text')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values - ENHANCED */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Modern gradient background with geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#004080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        {/* Gradient orbs for modern aesthetics */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 filter blur-[80px] opacity-60"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-inter font-bold mb-6 relative inline-block"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {t('about.mission.title', 'Our Mission & Values')}
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-neutral-dark/80 max-w-3xl mx-auto font-roboto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('about.mission.subtitle', 'Delivering excellence in industrial solutions with a commitment to quality, reliability, and customer satisfaction.')}
            </motion.p>
          </div>

          {/* Values cards with enhanced design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Quality Value */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2 overflow-hidden relative neumorph">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon with gradient */}
                <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-3">
                  <CheckCircleIcon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-2xl font-inter font-semibold mb-4 relative z-10">
                  {t('about.values.quality.title', 'Product Quality')}
                </h3>
                <p className="font-roboto text-neutral-dark/80 relative z-10">
                  {t('about.values.quality.description', 'We ensure all products meet the highest European quality standards, with rigorous testing and quality control at every stage.')}
                </p>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/10 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>

            {/* Partnership Value */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2 overflow-hidden relative neumorph">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon with gradient */}
                <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-3">
                  <BuildingIcon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-2xl font-inter font-semibold mb-4 relative z-10">
                  {t('about.values.customer.title', 'Customer Focus')}
                </h3>
                <p className="font-roboto text-neutral-dark/80 relative z-10">
                  {t('about.values.customer.description', 'We put our customers first, building relationships based on understanding their needs and providing personalized solutions.')}
                </p>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/10 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>

            {/* Global Value */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="glass-card backdrop-blur-md bg-white border border-white/40 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2 overflow-hidden relative neumorph">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon with gradient */}
                <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-3">
                  <LeafIcon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-2xl font-inter font-semibold mb-4 relative z-10">
                  {t('about.values.sustainability.title', 'Sustainability')}
                </h3>
                <p className="font-roboto text-neutral-dark/80 relative z-10">
                  {t('about.values.sustainability.description', 'Tvarumas Esame įsipareigoję tvariems verslo metodams ir aplinkai draugiškoms veiklos operacijoms visoje tiekimo grandinėje.')}
                </p>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/10 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="inline-block">
              <Link to="/contact">
                <Button className="btn-gradient text-white hover-lift hover-glow px-8 py-6 rounded-lg shadow-xl border border-white/30 text-lg font-bold flex items-center justify-center gap-2 group relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <span>{t('contact.title', 'Contact Us')}</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}