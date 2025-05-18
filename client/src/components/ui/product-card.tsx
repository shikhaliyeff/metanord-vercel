import { cn } from "@/lib/utils";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "wouter";
import { LazyImage } from "./lazy-image";
import { motion } from "framer-motion";
// Import memo for performance optimization
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ProductPreviewModal } from "./product-preview-modal";
import { Button } from "./button";
import { sanitizeSpecifications } from "@/data/product-data";
import { translateProductCategory } from "@/i18n";
import { getTranslatedProductTitle, getTranslatedProductDescription } from "@/lib/product-translation-utils";

// Helper function for reliable translations with Russian fallbacks
const helpTranslate = (i18n: any, key: string, defaultText: string, russianText: string): string => {
  return i18n.language === 'ru' ? russianText : defaultText;
};

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  link: string;
  features?: string[];
  applications?: string[];
  specifications?: Record<string, string>;
  id?: string;
  className?: string;
}

// Define the component in normal way and then wrap with memo at the end
export function ProductCard({ 
  image, 
  title, 
  description, 
  category,
  link,
  features,
  applications,
  specifications,
  id,
  className 
}: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Create safe defaults for all props to prevent rendering failures
  const safeTitle = title || (id ? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Product');
  const safeDescription = description || '';
  const safeLink = link || '#';
  const safeImage = image || '';
  const safeFeatures = Array.isArray(features) ? features : [];
  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeSpecifications = specifications || {};
  
  // Use flexible translation keys for better language support
  const quickPreviewText = t("products.quickPreview") || t("quickPreview", "Quick Preview");
  const viewDetailsText = t("products.viewDetails") || t("viewDetails", "View Details");
  
  // Enhanced translation of product title and description
  const translatedTitle = id ? t(`products.${id}.title`, safeTitle) : safeTitle;
  const translatedDescription = id ? t(`products.${id}.description`, safeDescription) : safeDescription;
  
  // Handle quick preview action
  const handleQuickPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Opening quick preview for product: ${id || 'unknown'}`);
    setIsPreviewOpen(true);
  };
  
  // Get translated category with fallback
  const safeCategory = category || 'other';
  const translatedCategory = translateProductCategory(safeCategory) || safeCategory;
  console.log(`Translating category "${safeCategory}" to "${translatedCategory}" in language ${i18n.language}`);
  
  // Use motion.div for animation when language changes
  return (
    <>
      <motion.div 
        className={cn(
          "group overflow-hidden h-full flex flex-col transition-all duration-500 hover:scale-[1.02] active:scale-[0.99] sm:hover:scale-[1.03] hover-lift shadow-md xs:shadow-lg sm:shadow-xl border border-white/40 backdrop-blur-lg bg-white/20 rounded-xl xs:rounded-xl sm:rounded-2xl relative",
          className
        )}
        key={`${safeTitle}-${i18n.language}`} // Force re-render on language change with safe title
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-product-id={id} // Add this attribute for scroll targeting
      >
        {/* Product Image with Enhanced Overlay - Mobile touch optimized */}
        <div 
          className="relative h-36 xs:h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden cursor-pointer touch-target" 
          onClick={handleQuickPreview}
        >
          {/* Enhanced duotone gradient overlay with mobile hover/touch states */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 xs:from-primary/50 sm:from-primary/40 via-primary-dark/30 to-transparent opacity-40 xs:opacity-30 sm:opacity-20 group-hover:opacity-80 transition-opacity duration-500 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.2)_100%)] opacity-20 xs:opacity-10 sm:opacity-5 group-hover:opacity-70 transition-opacity duration-500 z-10"></div>
          
          <LazyImage 
            src={safeImage} 
            alt={safeTitle} 
            loading="lazy"
            width={400}
            height={300}
            className="w-full h-full object-cover transform group-hover:scale-110 group-active:scale-105 group-hover:rotate-1 transition-all duration-700 ease-in-out"
            blurEffect
            fetchpriority="low"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            onLoad={() => {
              // Mark this image as loaded in the cache for better performance
              if (typeof window !== 'undefined' && window.sessionStorage) {
                try {
                  window.sessionStorage.setItem(`img_loaded_${id || safeTitle}`, 'true');
                } catch (e) {
                  // Silently handle storage errors
                }
              }
            }}
          />
          
          {/* Enhanced Category Badge with glassmorphism - mobile optimized */}
          <div className="absolute top-1.5 xs:top-2 sm:top-3 md:top-4 right-1.5 xs:right-2 sm:right-3 md:right-4 z-20">
            <div className="backdrop-blur-md bg-white/40 xs:bg-white/30 text-2xs xs:text-xs sm:text-sm font-medium xs:font-semibold text-primary px-1.5 xs:px-2 sm:px-2.5 md:px-3.5 py-0.5 xs:py-0.5 sm:py-1 md:py-1.5 rounded-full shadow-md xs:shadow-md sm:shadow-xl border border-white/60 group-hover:bg-accent/20 group-hover:text-white transition-all duration-300">
              {translatedCategory || safeCategory}
            </div>
          </div>
          
          {/* CRITICAL FIX: Completely redesigned Quick Preview button for guaranteed mobile visibility */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-1 py-1.5
                          flex justify-center items-center
                          bg-gradient-to-t from-black/30 to-transparent
                          opacity-100 transition-all duration-300">
            <Button 
              size="sm"
              variant="secondary" 
              className="bg-white text-primary font-medium rounded-md 
                         px-4 py-2
                         hover:bg-gray-100 active:bg-gray-200 border border-gray-200 
                         text-xs shadow-md"
              onClick={handleQuickPreview}
            >
              <Eye className="mr-1.5 h-3 w-3 text-primary" /> 
              <span className="whitespace-nowrap">{quickPreviewText}</span>
            </Button>
          </div>
        </div>
        
        {/* Content - mobile optimized with better spacing */}
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-grow bg-white/90 backdrop-blur-md relative shadow-inner border-t border-white/60">
          {/* Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-0.5 xs:h-1 sm:h-1.5 md:h-2 gradient-primary opacity-80 group-hover:opacity-100 transition-all duration-300 shadow-sm animate-shimmer"></div>
          
          <h4 
            className="text-sm xs:text-base sm:text-lg md:text-xl font-inter font-semibold mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 group-hover:text-primary transition-all duration-300 cursor-pointer hover:tracking-tight line-clamp-2 product-card-title"
            onClick={handleQuickPreview}
            data-product-title={id}
          >
            {translatedTitle}
          </h4>
          
          <p className="font-roboto text-neutral-dark/90 mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-grow line-clamp-2 xs:line-clamp-2 sm:line-clamp-2 md:line-clamp-3 text-2xs xs:text-2xs sm:text-xs md:text-sm product-card-description"
             data-product-description={id}>
            {translatedDescription}
          </p>
          
          <div className="flex justify-end items-center mt-auto">
            <Link to={`/product?id=${id}`} onClick={(e) => {
              // CRITICAL MOBILE FIX: Added more aggressive scroll handling
              if (typeof window !== 'undefined') {
                e.preventDefault(); // Stop default navigation temporarily
                
                // Reset scroll position immediately and with multiple approaches
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                
                // Force browser to acknowledge scroll reset before navigation
                setTimeout(() => {
                  // Then navigate programmatically
                  window.location.href = `/product?id=${id}`;
                }, 10);
              }
            }}>
              <div className="text-primary hover:text-accent active:text-accent/80 flex items-center gap-0.5 xs:gap-1 font-medium transition-colors duration-300 text-xs xs:text-sm cursor-pointer py-1 xs:py-1.5 sm:py-2 touch-target">
                <span>{viewDetailsText}</span>
                <ArrowRight className="h-3 xs:h-3.5 sm:h-4 w-3 xs:w-3.5 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Product Preview Modal with safe values */}
      {id && (
        <ProductPreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)}
          product={{
            id,
            image: safeImage,
            title: safeTitle,
            description: safeDescription,
            category: safeCategory,
            features: safeFeatures,
            applications: safeApplications,
            specifications: sanitizeSpecifications(safeSpecifications),
            link: safeLink
          }}
        />
      )}
    </>
  );
}