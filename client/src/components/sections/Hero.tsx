import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Download, PhoneCall, ArrowRight, Globe, Clock, TruckIcon, Check } from "lucide-react";

// Import aluminum profile images from attached assets
import uProfiles from '@assets/Aluminum U-Profiles.jpg';
import tProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';

// Create compatibility variables for old references
const standardProfiles = uProfiles;
const machineProfiles = tProfiles;

// Import infrastructure product images
import steelPipes from '@assets/Steel Pipes For Oil and Gas Purpose .png';
import hdpePipes from '@assets/HDPE pipes (PE pipes) .png';
import manholeD400B from '@assets/Manhole cover D400(B) .png';
import drainageChannel from '@assets/Drainage channel 5066 high-resistance spherical graphite cast iron, C250 EN 1433 .png';

export function Hero() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Slider images
  const sliderImages = [
    {
      src: uProfiles, 
      alt: "Aluminum U-Profiles"
    },
    {
      src: tProfiles, 
      alt: "Aluminum T-Profiles"
    },
    {
      src: ledProfiles, 
      alt: "LED Aluminum Profiles"
    },
    {
      src: specialProfiles, 
      alt: "Special Aluminum Profiles"
    },
    {
      src: steelPipes, 
      alt: "Steel pipes for industrial applications"
    },
    {
      src: hdpePipes, 
      alt: "HDPE pipes for infrastructure"
    }
  ];
  
  // Auto-rotate slider with slightly longer interval for better user experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [sliderImages.length]);
  
  // Separate effect to preload next slide image for smoother transitions
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % sliderImages.length;
    const preloadImage = new Image();
    preloadImage.src = sliderImages[nextSlideIndex].src;
  }, [currentSlide, sliderImages]);
  
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Handle smooth scroll to products section
  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const productsSection = document.getElementById('products');
    if (productsSection) {
      window.scrollTo({
        top: productsSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section id="home" className="relative min-h-[90vh] sm:min-h-[85vh] overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {sliderImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Enhanced overlay matching desktop with improved mobile experience */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/85 via-blue-800/65 to-accent/45 mix-blend-multiply z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.05)_0%,_rgba(0,0,0,0.25)_100%)] z-10"></div>
            
            {/* Animated pattern overlay for visual interest (modern style) */}
            <div className="absolute inset-0 opacity-10 z-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }}></div>
            </div>
            
            {/* Enhanced image with smoother animation and better mobile performance */}
            <img 
              src={image.src} 
              alt={image.alt} 
              loading={index === 0 ? "eager" : "lazy"}
              className="absolute w-full h-full object-cover"
              style={{
                objectPosition: 'center center',
                transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 8s ease-in-out, opacity 0.8s ease-in-out',
                opacity: currentSlide === index ? 1 : 0
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Enhanced slider navigation dots - slim bar style for all devices */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`transition-all duration-500 ease-in-out rounded-full ${
              currentSlide === index 
                ? 'w-[22px] h-1.5 bg-white shadow-glow' 
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Content - mobile optimized */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 h-full min-h-[90vh] sm:min-h-[85vh] flex items-center pt-16 pb-14 sm:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xs:gap-5 sm:gap-6 lg:gap-12 items-center w-full">
          <div className="lg:col-span-7 z-20">
            {/* Tagline badge - smaller on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-accent/20 backdrop-blur-sm px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm md:text-base"
            >
              <span className="text-white font-medium tracking-wide">{t("hero.tagline", "Engineering a Stronger Tomorrow")}</span>
            </motion.div>
            
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Headline - smaller on mobile */}
              <motion.h1 
                className="text-white text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-inter font-bold leading-tight mb-2 xs:mb-3 sm:mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {t("hero.title", "Specialized Distribution")} <span className="text-white font-bold">{t("hero.title_highlight", "for European Markets")}</span>
              </motion.h1>
              
              {/* Subtitle - smaller on mobile */}
              <motion.p 
                className="text-white text-xs xs:text-sm sm:text-base md:text-xl mb-3 xs:mb-4 sm:mb-6 md:mb-8 font-medium max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {t("hero.subtitle", "Aluminum profiles and urban infrastructure products from trusted manufacturers")}
              </motion.p>
              
              {/* Buttons - stacked on mobile, side by side on larger screens */}
              <motion.div 
                className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full xs:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {/* Primary CTA - smaller on mobile */}
                <Link to="/contact" className="w-full xs:w-auto">
                  <Button className="btn-gradient text-white hover-lift hover-glow font-bold text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-10 py-3 xs:py-4 sm:py-5 md:py-7 shadow-xl border-2 border-white/30 rounded-lg group relative overflow-hidden transform hover:scale-105 transition-all duration-300 w-full xs:w-auto">
                    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <PhoneCall className="mr-1.5 xs:mr-2 md:mr-3 h-3.5 xs:h-4 md:h-5 w-3.5 xs:w-4 md:w-5 group-hover:scale-110 transition-transform duration-300" /> 
                    <span className="relative">{t("header.requestQuote", "Request Quote")}</span>
                  </Button>
                </Link>
                
                {/* Secondary CTA - smaller on mobile */}
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white backdrop-blur-sm font-bold text-sm xs:text-base md:text-lg px-4 xs:px-6 md:px-10 py-3 xs:py-4 sm:py-5 md:py-7 rounded-lg hover:bg-white/20 hover-lift border-2 border-white/40 group relative overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300 w-full xs:w-auto"
                  onClick={scrollToProducts}
                >
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative">{t("hero.learnMore", "Learn More")}</span> 
                  <ArrowRight className="ml-1.5 xs:ml-2 md:ml-3 h-3.5 xs:h-4 md:h-5 w-3.5 xs:w-4 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Product Info Card - hidden on mobile, shown on larger screens */}
          <motion.div 
            className="mt-6 lg:mt-0 lg:col-span-5 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="relative flex justify-end pr-8">
              <div className="glass-card backdrop-blur-lg bg-white/60 rounded-2xl p-6 shadow-xl rotate-3 transform hover:rotate-0 transition-all duration-500 border border-white/50 w-[260px] animate-bounce-subtle">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.9)_0%,_transparent_70%)]"></div>
                <div className="text-center relative z-10">
                  <h3 className="text-xl font-bold text-primary mb-3">{t("hero.productTitle", "Premium Products")}</h3>
                  <p className="text-base text-gray-800 font-medium mb-4">{t("hero.productSubtitle", "High-quality infrastructure solutions")}</p>
                  <div className="w-24 h-1 gradient-primary mx-auto rounded-full shadow-glow"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 right-0 z-10 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                <div className="btn-gradient text-white px-5 py-3 rounded-lg shadow-accent flex items-center relative overflow-hidden group border border-white/20">
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <TruckIcon className="mr-2 h-4 w-4" />
                  <span className="font-semibold text-sm">{t("hero.globalShipping", "Global Shipping Available")}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Mobile product info card - now matching desktop style */}
          <motion.div 
            className="lg:hidden flex justify-center mt-3 sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {/* Added product card for mobile matching desktop style */}
            <div className="glass-card backdrop-blur-lg bg-white/60 rounded-xl p-4 shadow-xl transform transition-all duration-500 border border-white/50 w-full max-w-[280px] relative">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.9)_0%,_transparent_70%)]"></div>
              <div className="text-center relative z-10">
                <h3 className="text-lg font-bold text-primary mb-2">{t("hero.productTitle", "Premium Products")}</h3>
                <p className="text-sm text-gray-800 font-medium mb-3">{t("hero.productSubtitle", "High-quality infrastructure solutions")}</p>
                <div className="w-20 h-1 gradient-primary mx-auto rounded-full shadow-glow mb-3"></div>
                
                {/* Shipping badge inside the card on mobile */}
                <div className="btn-gradient text-white px-3 py-2 rounded-lg shadow-accent flex items-center justify-center relative overflow-hidden group border border-white/20 mx-auto w-fit">
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <TruckIcon className="mr-2 h-3.5 w-3.5" />
                  <span className="font-medium text-xs xs:text-sm">{t("hero.globalShipping", "Global Shipping Available")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-10 sm:h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
}
