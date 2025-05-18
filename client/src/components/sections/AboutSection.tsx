import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Import product images from assets
import butterflyValve from "@assets/Butterfly valve cast iron DN100-700, PN10-16 .png";
import waterSupplyNetwork from "@assets/water supply network.jpg";
import metanordLogo from "@assets/Geometric Design Logo for MetaNord (3).png";

export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-inter font-bold mb-6">
              <span dangerouslySetInnerHTML={{ 
                __html: t("about.title", "About") + ' <span class="text-primary">MetaNord</span>'
              }} />
            </h2>
            <p className="text-lg text-neutral-dark mb-6 font-roboto">
              {t("about.description", "MetaNord is your trusted partner for premium infrastructure solutions in European markets. We combine Nordic quality standards with competitive pricing to deliver exceptional value.")}
            </p>
            <p className="text-lg text-neutral-dark mb-6 font-roboto">
              {t("about.subtitle", "Our diverse product portfolio includes high-performance aluminum profiles and durable infrastructure products that meet rigorous European standards. With reliable logistics and expert consultation, we ensure your projects succeed with materials that stand the test of time.")}
            </p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <div className="text-gradient-accent flex items-center justify-center p-1 rounded-full neumorph-btn shadow-sm">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="font-roboto font-medium">{t("about.product1", "Aluminum Profiles")}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-gradient-accent flex items-center justify-center p-1 rounded-full neumorph-btn shadow-sm">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="font-roboto font-medium">{t("about.product2", "Infrastructure Products")}</span>
              </li>
            </ul>
            <Link to="/about">
              <Button className="btn-gradient text-white hover-lift hover-glow px-8 py-3 rounded-lg font-semibold shadow-accent border border-white/20 group relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <span className="relative" dangerouslySetInnerHTML={{ __html: t("home.about.learnMore", "Learn More") }}></span>
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* An eye-catching 3D visual of infrastructure products */}
            <div className="relative h-full">
              {/* Main product image with 3D effect */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-700 border-2 border-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay z-10"></div>
                <img 
                  src={waterSupplyNetwork} 
                  alt="Water Supply Network" 
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Floating logo badge */}
                <div className="absolute top-6 right-6 z-20 glass-card bg-white/80 backdrop-blur-md p-4 rounded-full shadow-xl transform hover:rotate-3 transition-all duration-300 border border-accent/30">
                  <img 
                    src={metanordLogo} 
                    alt="MetaNord Logo" 
                    className="w-16 h-16 filter drop-shadow-sm"
                  />
                </div>
                
                {/* Floating product highlight badge */}
                <div className="absolute bottom-8 left-8 z-20 glass-card backdrop-blur-md p-5 rounded-xl shadow-xl transform hover:-rotate-1 transition-all duration-300 bg-gradient-to-br from-primary/90 to-accent/90 text-white border border-white/20 max-w-xs">
                  <h3 className="font-bold text-xl mb-2">{t("about.productHighlight", "Quality Infrastructure")}</h3>
                  <p className="text-sm text-white/90 font-medium mb-3">{t("about.productHighlightDesc", "European-standard components for lasting infrastructure solutions")}</p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white hover:underline font-medium text-sm">
                    {t("about.browseProducts", "Browse Products")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-6 left-6 w-24 h-24 border-t-2 border-l-2 border-white/40 rounded-tl-3xl"></div>
                  <div className="absolute bottom-6 right-6 w-24 h-24 border-b-2 border-r-2 border-white/40 rounded-br-3xl"></div>
                </div>
              </div>
              
              {/* Removed the floating secondary product image as requested */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
