import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PhoneCall, BookOpen, ArrowRight } from "lucide-react";

export function CtaSection() {
  const { t } = useTranslation();
  
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Enhanced modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"></div>
      
      {/* Nordic-inspired geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#004080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      
      {/* Larger gradient orbs for enhanced visual effect */}
      <div className="absolute top-20 right-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-20 left-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-accent/20 to-primary/20 filter blur-[120px] opacity-70"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced glass card effect with subtle border */}
          <motion.div 
            className="glass-card backdrop-blur-md border border-white/50 shadow-2xl rounded-2xl overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/90 to-primary-dark/95 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]"></div>
            
            {/* Enhanced modern decorative elements */}
            <div className="absolute top-0 right-0 w-60 h-60 border-t-2 border-r-2 border-white/20 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 border-b-2 border-l-2 border-white/20 rounded-tr-full"></div>
            <div className="absolute top-[40%] left-0 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tr-full"></div>
            <div className="absolute top-[60%] right-0 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-bl-full"></div>
            
            {/* Content area with enhanced padding */}
            <div className="relative py-24 px-6 md:px-24">
              {/* Two column layout on larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left column - Enhanced text content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                    <span className="text-white/90 font-medium">
                      {t("cta.badge", "Request a quote today")}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                    {t("cta.title", "Ready to Start Your Project?")}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl">
                    {t("cta.subtitle", "Contact us today to discuss your infrastructure needs and get customized solutions tailored to your specific requirements.")}
                  </p>
                  
                  {/* Enhanced features list with icons */}
                  <div className="space-y-5 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 bg-accent rounded-full flex-shrink-0"></div>
                      <p className="text-white text-lg">{t("cta.feature1", "Expert consultation for your project needs")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 bg-accent rounded-full flex-shrink-0"></div>
                      <p className="text-white text-lg">{t("cta.feature2", "Competitive pricing and timely delivery")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 bg-accent rounded-full flex-shrink-0"></div>
                      <p className="text-white text-lg">{t("cta.feature3", "High-quality products with European standards")}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Right column - Enhanced CTA buttons with improved design */}
                <motion.div
                  className="flex flex-col gap-8"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* Enhanced Main CTA - Contact Us */}
                  <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl border border-white/30 hover-lift transition-transform duration-300 shadow-lg">
                    <h3 className="text-3xl font-bold text-white mb-4">{t("cta.contactTitle", "Get a Personalized Quote")}</h3>
                    <p className="text-white/90 text-lg mb-8">{t("cta.contactDesc", "Connect with our team to discuss your specific project requirements and timeline.")}</p>
                    <Link to="/contact">
                      <Button className="btn-gradient text-white hover-lift hover-glow px-10 py-7 rounded-lg shadow-xl border border-white/30 w-full text-xl font-bold flex items-center justify-center gap-3 group relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <PhoneCall className="h-6 w-6" />
                        <span>{t("header.requestQuote", "Request Quote")}</span>
                        <ArrowRight className="ml-1 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Enhanced Secondary CTA - Browse Products */}
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 hover-lift transition-transform duration-300 shadow-md">
                    <Link to="/products">
                      <Button className="btn-gradient-secondary bg-white text-primary hover:bg-white/90 hover-lift font-semibold rounded-lg w-full flex items-center justify-center gap-3 py-5 shadow-accent text-lg">
                        <BookOpen className="h-6 w-6" />
                        <span>{t("cta.catalog", "Browse Product Catalog")}</span>
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
