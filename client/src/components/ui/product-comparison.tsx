import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LazyImage } from './lazy-image';
import { Button } from './button';
import { X, ArrowLeft, ArrowRight, Check, Plus, Info } from 'lucide-react';
import { ProductPreviewModal } from './product-preview-modal';
import { sanitizeSpecifications } from '@/data/product-data';
import { translateProductCategory } from '@/i18n';

// Define the product structure based on existing product cards
interface Product {
  id?: string;
  image: string;
  title: string;
  description: string;
  category: string;
  features?: string[];
  applications?: string[];
  specifications?: Record<string, string>;
  link?: string;
}

interface ProductComparisonProps {
  className?: string;
  products?: Product[];
  onClose?: () => void;
  maxProducts?: number;
  onAddProduct?: () => void;
}

/**
 * A tablet-optimized split-view component for comparing products side by side
 */
export function ProductComparison({
  className,
  products = [],
  onClose,
  maxProducts = 3,
  onAddProduct
}: ProductComparisonProps) {
  const { t, i18n } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [compareFeature, setCompareFeature] = useState<'specifications' | 'features' | 'applications'>('specifications');
  
  // Handle window resize for responsive layout
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    
    return () => {
      window.removeEventListener('resize', checkTablet);
    };
  }, []);
  
  // Handle removal of a product from comparison
  const handleRemoveProduct = (productId: string | undefined) => {
    if (!productId) return;
    
    setSelectedProducts(prev => 
      prev.filter(product => product.id !== productId)
    );
  };
  
  // Handle preview of a product
  const handlePreviewProduct = (product: Product) => {
    setActiveProduct(product);
    setIsPreviewOpen(true);
  };
  
  // Get all unique specification keys
  const getAllSpecificationKeys = (): string[] => {
    const keysSet = new Set<string>();
    
    selectedProducts.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => {
          keysSet.add(key);
        });
      }
    });
    
    return Array.from(keysSet);
  };
  
  // Get all unique feature items
  const getAllFeatures = (): string[] => {
    const featuresSet = new Set<string>();
    
    selectedProducts.forEach(product => {
      if (product.features) {
        product.features.forEach(feature => {
          featuresSet.add(feature);
        });
      }
    });
    
    return Array.from(featuresSet);
  };
  
  // Get all unique application items
  const getAllApplications = (): string[] => {
    const applicationsSet = new Set<string>();
    
    selectedProducts.forEach(product => {
      if (product.applications) {
        product.applications.forEach(application => {
          applicationsSet.add(application);
        });
      }
    });
    
    return Array.from(applicationsSet);
  };
  
  // Check if a product has a specific feature
  const hasFeature = (product: Product, feature: string): boolean => {
    return product.features?.includes(feature) || false;
  };
  
  // Check if a product has a specific application
  const hasApplication = (product: Product, application: string): boolean => {
    return product.applications?.includes(application) || false;
  };
  
  // Get a specification value with fallback
  const getSpecValue = (product: Product, key: string): string => {
    return product.specifications?.[key] || '-';
  };
  
  // If not in tablet mode, show nothing or minimal UI
  if (!isTablet && window.innerWidth < 768) {
    return (
      <div className="p-4 text-center text-sm">
        <p>{t("comparison.tabletOnly", "Product comparison view is optimized for tablet devices.")}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("comparison.back", "Back")}
        </Button>
      </div>
    );
  }
  
  // Helper for checking if we can add more products
  const canAddMoreProducts = selectedProducts.length < maxProducts;
  
  // Determine which comparison data to show
  const comparisonItems = 
    compareFeature === 'specifications' ? getAllSpecificationKeys() :
    compareFeature === 'features' ? getAllFeatures() :
    getAllApplications();
  
  return (
    <div className={cn(
      "w-full rounded-lg overflow-hidden bg-white shadow-lg border border-gray-100",
      className
    )}>
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("comparison.back", "Back")}
          </Button>
          <h3 className="text-lg font-medium text-gray-800">
            {t("comparison.title", "Product Comparison")}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Feature selection tabs */}
          <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-sm p-1">
            <button 
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors", 
                compareFeature === 'specifications' 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => setCompareFeature('specifications')}
            >
              {t("comparison.specs", "Specs")}
            </button>
            <button 
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors", 
                compareFeature === 'features' 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => setCompareFeature('features')}
            >
              {t("comparison.features", "Features")}
            </button>
            <button 
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors", 
                compareFeature === 'applications' 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => setCompareFeature('applications')}
            >
              {t("comparison.applications", "Applications")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Product cards in horizontal scroll area */}
      <div className="flex overflow-x-auto p-4 gap-4 bg-white">
        {selectedProducts.map((product) => (
          <div 
            key={product.id || product.title}
            className="flex-shrink-0 w-64 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Product header */}
            <div className="relative h-40 bg-gray-100">
              <LazyImage 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              <button 
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                onClick={() => handleRemoveProduct(product.id)}
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium bg-white/80 backdrop-blur-sm text-primary">
                {translateProductCategory(product.category)}
              </div>
            </div>
            
            {/* Product info */}
            <div className="p-3">
              <h4 className="font-medium text-base mb-1 line-clamp-1">{product.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{product.description}</p>
              
              <button 
                className="text-xs text-primary hover:text-accent flex items-center gap-1"
                onClick={() => handlePreviewProduct(product)}
              >
                <Info className="w-3 h-3" />
                {t("comparison.moreInfo", "More Info")}
              </button>
            </div>
          </div>
        ))}
        
        {/* Add product slot */}
        {canAddMoreProducts && onAddProduct && (
          <div className="flex-shrink-0 w-64 border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center h-64">
            <button 
              className="flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors p-4"
              onClick={onAddProduct}
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm">{t("comparison.addProduct", "Add Product")}</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Comparison table */}
      {selectedProducts.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border-b border-gray-200 w-1/3">{t("comparison.property", "Property")}</th>
                {selectedProducts.map((product) => (
                  <th 
                    key={`header-${product.id || product.title}`}
                    className="text-left p-2 border-b border-gray-200"
                  >
                    {product.title}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {comparisonItems.map((item, index) => (
                <tr 
                  key={`row-${item}-${index}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2 border-b border-gray-200 font-medium">{item}</td>
                  
                  {selectedProducts.map((product) => (
                    <td 
                      key={`cell-${product.id || product.title}-${item}`}
                      className="p-2 border-b border-gray-200"
                    >
                      {compareFeature === 'specifications' ? (
                        getSpecValue(product, item)
                      ) : compareFeature === 'features' ? (
                        hasFeature(product, item) ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300" />
                        )
                      ) : (
                        hasApplication(product, item) ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300" />
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Preview modal */}
      {activeProduct && (
        <ProductPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          product={{
            id: activeProduct.id,
            image: activeProduct.image,
            title: activeProduct.title,
            description: activeProduct.description,
            category: activeProduct.category,
            features: activeProduct.features || [],
            applications: activeProduct.applications || [],
            specifications: sanitizeSpecifications(activeProduct.specifications),
            link: activeProduct.link
          }}
        />
      )}
    </div>
  );
}