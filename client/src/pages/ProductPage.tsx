import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the optimized product grid component
import OptimizedProductGrid from "@/components/products/OptimizedProductGrid";
import { registerProductImages, translateCategory } from "@/lib/consolidated-product-loader";
import { optimizeProductImages } from "@/lib/performance-optimizations";

// Import product images with better naming convention
import standardProfiles from '@assets/Aluminum U-Profiles.jpg';
import machineProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';
import hdpePipes from '@assets/HDPE pipes (PE pipes) .png';
import doubleCorrugatedPipes from '@assets/Double corrugated pipes .png';
import steelReinforcedPipe from '@assets/Steel reinforced corrugated polyethilene pipe.png';
import hsawPilesWater from '@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png';
import steelPipesOilGas from '@assets/Steel Pipes For Oil and Gas Purpose .png';
import manholeD400K from '@assets/Manhole cover D400 H100 (K) .png';
import rainwaterGrillD400 from '@assets/Rainwater grill D400 1 .png';

// Consistent product image mapping for all components
const productImagesMap: Record<string, string> = {
  'standard-profiles': standardProfiles,
  'machine-building-profiles': machineProfiles,
  'led-profiles': ledProfiles,
  'special-profiles': specialProfiles,
  'hdpe-pipes': hdpePipes,
  'double-corrugated-pipes': doubleCorrugatedPipes,
  'reinforced-corrugated-pipes': steelReinforcedPipe,
  'hsaw-pipes': hsawPilesWater,
  'oil-gas-pipes': steelPipesOilGas,
  'manhole-covers': manholeD400K,
  'drainage-grates': rainwaterGrillD400
};

// Define categorized product IDs
const aluminumIds = ['standard-profiles', 'machine-building-profiles', 'led-profiles', 'special-profiles'];
const polyethyleneIds = ['hdpe-pipes', 'double-corrugated-pipes', 'reinforced-corrugated-pipes'];
const steelIds = ['hsaw-pipes', 'oil-gas-pipes'];
const castIronIds = ['manhole-covers', 'drainage-grates'];

// All product IDs
const allProductIds = [
  ...aluminumIds,
  ...polyethyleneIds,
  ...steelIds,
  ...castIronIds
];

// Product categories
const productCategories = [
  'aluminum',
  'polyethylene',
  'steel',
  'cast-iron'
];

/**
 * Optimized Product Page Component
 * 
 * High-performance product listing page with:
 * - Categorized filtering
 * - Lazy loading
 * - Image optimization
 * - Translation caching
 */
export default function ProductPage() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Parse URL params for direct linking to specific categories
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && productCategories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [location]);
  
  // Initialize optimization features
  useEffect(() => {
    // Register all product images with the consolidated loader
    registerProductImages(productImagesMap);
    
    // Optimize image loading
    optimizeProductImages(allProductIds, productImagesMap);
    
    // Preload category translations
    productCategories.forEach(category => {
      translateCategory(category, i18n.language);
    });
    
    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": allProductIds.slice(0, 4).map((id, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": t(`products.${id}.title`, id),
          "description": t(`products.${id}.description`, ""),
          "image": productImagesMap[id]
        }
      }))
    };
    
    // Add structured data to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [i18n.language]);
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // Update URL without page reload for direct linking
    const url = new URL(window.location.href);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url.toString());
  };
  
  return (
    <div>
      <Helmet>
        <title>{t("products.hero.title")} | MetaNord</title>
        <meta name="description" content={t("products.hero.description", "Explore our extensive range of premium infrastructure products for industrial and construction applications.")} />
      </Helmet>
      
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("products.hero.title", "Our Products")}
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-blue-100">
            {t("products.hero.subtitle", "High-Quality Infrastructure Materials")}
          </p>
          <p className="max-w-2xl mx-auto text-lg text-blue-50">
            {t("products.hero.description", "Explore our extensive range of products including aluminum profiles, polyethylene pipes, and cast iron products for various infrastructure and industrial applications.")}
          </p>
        </div>
      </section>
      
      {/* Product categories */}
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue={activeCategory} value={activeCategory} className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="bg-gray-100 p-1 rounded-lg flex-nowrap">
                <TabsTrigger 
                  value="all" 
                  onClick={() => handleCategoryChange('all')}
                  className="data-[state=active]:bg-white data-[state=active]:text-primary whitespace-nowrap"
                >
                  {t("products.categories.all", "All Products")}
                </TabsTrigger>
                
                {productCategories.map(categoryKey => (
                  <TabsTrigger 
                    key={categoryKey}
                    value={categoryKey} 
                    onClick={() => handleCategoryChange(categoryKey)}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary whitespace-nowrap"
                  >
                    {t(`products.categories.${categoryKey}`, categoryKey)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeCategory} className="mt-0">
              <OptimizedProductGrid
                productIds={allProductIds}
                category={activeCategory}
                imagesMap={productImagesMap}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}