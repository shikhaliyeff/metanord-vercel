import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { getProductDetails, ProductDetails, sanitizeSpecifications } from '@/data/product-data';

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id?: string;
    title: string;
    description: string;
    image: string;
    category: string;
    features?: string[];
    applications?: string[];
    specifications?: Record<string, string>;
    link?: string;
  };
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'features' | 'applications' | 'specifications'>('features');
  const [detailedProduct, setDetailedProduct] = useState<ProductDetails | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Mobile optimization: Ensure modal is properly mounted before animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      // Delayed unmount for smooth exit animation
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Get detailed product info from the data store with error handling
  useEffect(() => {
    if (product?.id) {
      try {
        // Always get fresh product details when language changes
        const details = getProductDetails(product.id, i18n.language);
        if (details) {
          console.log(`Found translation for ${product.id} in ${i18n.language}`);
          setDetailedProduct(details);
        } else {
          // If no details found, create a fallback from the provided product data
          console.log(`Creating fallback product for: ${product.id} in ${i18n.language}`);
          const fallbackProduct: ProductDetails = {
            id: product.id,
            title: product.title || product.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            description: product.description || '',
            image: product.image || '',
            category: product.category || 'other',
            link: product.link || `/product?id=${product.id}`,
            features: product.features || [],
            applications: product.applications || [],
            specifications: product.specifications || {},
            status: 'available',
            documents: []
          };
          setDetailedProduct(fallbackProduct);
        }
      } catch (error) {
        console.error(`Error loading product ${product.id}:`, error);
        // Create minimal product to prevent UI from breaking
        setDetailedProduct({
          id: product.id,
          title: product.title || 'Product',
          description: product.description || '',
          image: product.image || '',
          category: 'other',
          link: '#',
          features: [],
          applications: [],
          specifications: {},
          status: 'available',
          documents: []
        });
      }
    }
  }, [product?.id, i18n.language, product]);

  // Create a safe product with complete data
  // Merge data from both sources to ensure we have all required fields
  const displayProduct = {
    ...product,
    ...detailedProduct,
    id: detailedProduct?.id || product?.id || '',
    title: detailedProduct?.title || product.title,
    description: detailedProduct?.description || product.description,
    image: detailedProduct?.image || product.image,
    category: detailedProduct?.category || product.category,
    features: detailedProduct?.features || product.features || [],
    applications: detailedProduct?.applications || product.applications || [],
    specifications: sanitizeSpecifications(detailedProduct?.specifications || product.specifications),
    link: detailedProduct?.link || product.link
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modal = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // State for modal position
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // CRITICAL FIX: Completely reworked modal positioning for mobile compatibility
  useEffect(() => {
    if (isOpen) {
      // Don't try to position relative to products on mobile - always center
      // This prevents erratic modal positioning on small screens
      if (typeof window !== 'undefined') {
        // Force scroll top to prevent modal from opening near page bottom
        setTimeout(() => {
          try {
            // For accessibility on mobile, ensure the modal is visible
            const modalElement = document.querySelector('.modal-content');
            if (modalElement && modalElement instanceof HTMLElement) {
              modalElement.focus();
            }
          } catch (error) {
            console.error("Error focusing modal:", error);
          }
        }, 50);
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* EMERGENCY MOBILE FIX: Almost transparent background with no blur effect */}
          <motion.div 
            className="fixed inset-0 bg-black/10"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{backdropFilter: 'none'}}
          />
          
          <div className="min-h-screen w-full relative">
            <motion.div 
              className="bg-white rounded-lg xs:rounded-xl shadow-lg xs:shadow-xl border border-gray-200 max-w-4xl w-[94%] xs:w-[92%] md:w-[85%] max-h-[82vh] sm:max-h-[85vh] overflow-auto z-[101] fixed m-auto modal-content"
              style={{ 
                height: 'auto',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed',
                overflow: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                maxHeight: '85vh',
                backgroundColor: '#ffffff'
              }}
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              {/* Mobile-specific drag indicator */}
              <div className="md:hidden w-full flex justify-center pt-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full opacity-70"></div>
              </div>
              
              <div className="flex flex-col md:flex-row max-h-[90vh] xs:max-h-[92vh] md:max-h-[90vh]">
                {/* Image Section - Mobile optimized with swipe gestures */}
                <div className="w-full md:w-2/5 gradient-background-light p-3 xs:p-4 sm:p-5 md:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/20">
                  <div 
                    className="relative w-full h-40 xs:h-48 sm:h-60 md:h-[350px] p-2 xs:p-3 rounded-lg glass-card bg-white/50 backdrop-blur-md shadow-sm xs:shadow-soft border border-white/40 neumorph"
                    onTouchStart={(e) => {
                      // Track touch position for swipe detection
                      const touchDown = e.touches[0].clientX;
                      // Store in data attribute
                      e.currentTarget.setAttribute('data-touchstart', touchDown.toString());
                    }}
                    onTouchMove={(e) => {
                      // Skip if no starting position stored
                      const touchStart = e.currentTarget.getAttribute('data-touchstart');
                      if (!touchStart) return;
                      
                      // Calculate swipe distance
                      const currentTouch = e.touches[0].clientX;
                      const diff = parseInt(touchStart) - currentTouch;
                      
                      // Threshold for detection (px)
                      const threshold = 50;
                      
                      // Detect swipe direction
                      if (diff > threshold) {
                        // Right to left swipe - go to next tab
                        const tabs = ['features', 'applications', 'specifications'];
                        const currentIndex = tabs.indexOf(activeTab);
                        const nextIndex = (currentIndex + 1) % tabs.length;
                        setActiveTab(tabs[nextIndex] as 'features' | 'applications' | 'specifications');
                        e.currentTarget.removeAttribute('data-touchstart');
                      } else if (diff < -threshold) {
                        // Left to right swipe - go to previous tab
                        const tabs = ['features', 'applications', 'specifications'];
                        const currentIndex = tabs.indexOf(activeTab);
                        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                        setActiveTab(tabs[prevIndex] as 'features' | 'applications' | 'specifications');
                        e.currentTarget.removeAttribute('data-touchstart');
                      }
                    }}
                  >
                    <img 
                      src={
                        displayProduct.image.startsWith('/attached_assets/') 
                          ? displayProduct.image.replace('/attached_assets/', '/@fs/home/runner/workspace/attached_assets/') 
                          : displayProduct.image.startsWith('/') 
                            ? displayProduct.image 
                            : `/${displayProduct.image}`
                      } 
                      alt={displayProduct.title} 
                      className="w-full h-full object-contain shadow-soft rounded-md transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        console.log("Image failed to load:", displayProduct.image);
                        // If image fails to load in a specific language, try using the original image path
                        if (product.image && product.image !== displayProduct.image) {
                          console.log("Falling back to original image:", product.image);
                          const fixedPath = product.image.startsWith('/attached_assets/') 
                            ? product.image.replace('/attached_assets/', '/@fs/home/runner/workspace/attached_assets/') 
                            : product.image.startsWith('/') 
                              ? product.image 
                              : `/${product.image}`;
                          e.currentTarget.src = fixedPath;
                        }
                      }}
                    />
                    
                    {/* Swipe indicator for mobile */}
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 md:hidden">
                      <div className="text-xs text-gray-500 opacity-70 flex items-center bg-white/50 px-2 py-0.5 rounded-full">
                        <span className="animate-pulse">←</span>
                        <span className="mx-1 text-[10px]">swipe</span>
                        <span className="animate-pulse">→</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CRITICAL FIX: Completely redesigned content section for reliable mobile view */}
                <div className="modal-content w-full md:w-3/5 p-3 xs:p-4 sm:p-5 md:p-6 overflow-y-auto max-h-[60vh] xs:max-h-[65vh] sm:max-h-[70vh] md:max-h-[600px] bg-white overscroll-contain">
                  <div className="flex justify-between items-start mb-3 xs:mb-4">
                    <div className="max-w-[80%]"> {/* Reduced width to prevent close button overlap */}
                      <span className="inline-block px-3 xs:px-4 py-1 xs:py-1.5 text-xs xs:text-sm font-semibold bg-accent text-white rounded-full mb-2 xs:mb-3 shadow-sm">
                        {t(`products.categories.${displayProduct.category.toLowerCase().replace(/\s+/g, '_')}`, displayProduct.category)}
                      </span>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary tracking-tight break-words">{displayProduct.title}</h3>
                    </div>
                    <button 
                      className="text-gray-700 hover:text-accent transition-all duration-300 p-2 xs:p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm flex-shrink-0"
                      onClick={onClose}
                      aria-label={t('common.close', 'Close')}
                    >
                      <X className="w-5 h-5 xs:w-6 xs:h-6" />
                    </button>
                  </div>
                  
                  <p className="font-roboto text-gray-700 mb-4 xs:mb-5 p-3 xs:p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm xs:text-base break-words">
                    {displayProduct.description}
                  </p>
                  
                  {/* CRITICAL FIX: Completely redesigned tab navigation for maximum mobile reliability */}
                  <div className="flex mb-3 xs:mb-4 sm:mb-5 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                      className={`flex-1 px-3 xs:px-4 py-3 xs:py-3 text-sm font-medium transition-all duration-300 ${activeTab === 'features' ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}`}
                      onClick={() => setActiveTab('features')}
                    >
                      {t('products.features', 'Features')}
                    </button>
                    <button
                      className={`flex-1 px-3 xs:px-4 py-3 xs:py-3 text-sm font-medium transition-all duration-300 ${activeTab === 'applications' ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}`}
                      onClick={() => setActiveTab('applications')}
                    >
                      {t('products.applications', 'Uses')}
                    </button>
                    <button
                      className={`flex-1 px-3 xs:px-4 py-3 xs:py-3 text-sm font-medium transition-all duration-300 ${activeTab === 'specifications' ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'}`}
                      onClick={() => setActiveTab('specifications')}
                    >
                      {t('products.specifications', 'Specs')}
                    </button>
                  </div>
                  
                  {/* Tab Content - Enhanced for mobile experience with improved readability */}
                  <div className="mb-3 xs:mb-4 sm:mb-5">
                    {activeTab === 'features' && displayProduct.features && (
                      <ul className="grid grid-cols-1 gap-2.5 xs:gap-3">
                        {displayProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 xs:gap-3 p-2.5 xs:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
                            <span className="flex-shrink-0 w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-primary" />
                            </span>
                            <span className="text-neutral-dark font-roboto text-sm xs:text-base break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {activeTab === 'applications' && displayProduct.applications && (
                      <ul className="grid grid-cols-1 gap-2.5 xs:gap-3">
                        {displayProduct.applications.map((application, index) => (
                          <li key={index} className="flex items-start gap-2 xs:gap-3 p-2.5 xs:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
                            <span className="flex-shrink-0 text-primary">
                              <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 mt-0.5" />
                            </span>
                            <span className="text-neutral-dark font-roboto text-sm xs:text-base break-words">{application}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {activeTab === 'specifications' && displayProduct.specifications && (
                      <div className="p-3 xs:p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
                        <div className="grid grid-cols-1 gap-2.5 xs:gap-3">
                          {Object.entries(displayProduct.specifications).map(([key, value], index) => (
                            <div key={index} className="flex flex-col xs:flex-row border-b border-neutral-100/60 pb-2.5 xs:pb-3 last:border-0 last:pb-0">
                              <span className="font-medium text-primary w-full xs:w-1/3 text-sm xs:text-base mb-1 xs:mb-0">{t(`products.specs.${key}`, key)}:</span>
                              <span className="text-neutral-dark font-roboto w-full xs:w-2/3 text-sm xs:text-base break-words">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions - Enhanced for improved mobile touch targets */}
                  <div className="flex justify-between items-center pt-3 xs:pt-4 sm:pt-5 border-t border-white/40 mt-3 xs:mt-4">
                    <Link 
                      to={`/product?id=${displayProduct.id}`}
                      className="inline-flex items-center text-primary hover-lift px-3 xs:px-4 sm:px-5 py-2.5 xs:py-3 rounded-lg bg-white/50 shadow-sm transition-all duration-300 border border-white/40 hover:border-white/60 group"
                    >
                      <span className="font-medium relative text-sm xs:text-base">
                        {t('products.viewDetails', 'View Details')}
                      </span>
                      <ExternalLink className="ml-1.5 xs:ml-2 stroke-[2] w-4 h-4 xs:w-5 xs:h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Link>
                    
                    <button
                      className="px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 border border-white/20 shadow-sm font-medium transition-all duration-300 text-sm xs:text-base"
                      onClick={onClose}
                    >
                      <span>{t('common.close', 'Close')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};