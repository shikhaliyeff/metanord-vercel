import React from 'react';
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ui/product-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import OptimizedProductGrid from "@/components/products/OptimizedProductGrid";
import { registerProductImages, translateCategory } from "@/lib/consolidated-product-loader";
import { optimizeProductImages } from "@/lib/performance-optimizations";

// Import product images
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

// Product image mapping
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

// Product categories
const aluminumIds = ['standard-profiles', 'machine-building-profiles', 'led-profiles', 'special-profiles'];
const polyethyleneIds = ['hdpe-pipes', 'double-corrugated-pipes', 'reinforced-corrugated-pipes'];
const steelIds = ['hsaw-pipes', 'oil-gas-pipes'];
const castIronIds = ['manhole-covers', 'drainage-grates'];

const allProductIds = [...aluminumIds, ...polyethyleneIds, ...steelIds, ...castIronIds];
const productCategories = ['aluminum', 'polyethylene', 'steel', 'cast-iron'];

export default function ProductPage() {
  const { t, i18n } = useTranslation("products", { keyPrefix: "products" });
  const [activeCategory, setActiveCategory] = React.useState("all");

  React.useEffect(() => {
    // Force component refresh on mount
    const forceRefresh = () => {
      registerProductImages(productImagesMap);
      optimizeProductImages(allProductIds, productImagesMap);
      window.dispatchEvent(new Event('forceProductRefresh'));
    };
    
    forceRefresh();

    productCategories.forEach(category => {
      translateCategory(category, i18n.language);
    });
  }, [i18n.language]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div>
      <Helmet>
        <title>{t("products.hero.title")} | MetaNord</title>
        <meta name="description" content={t("products.hero.description")} />
      </Helmet>

      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("products.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-blue-100">
            {t("products.hero.subtitle")}
          </p>
          <p className="max-w-2xl mx-auto text-lg text-blue-50">
            {t("products.hero.description")}
          </p>
        </div>
      </section>

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
                  {t("products.categories.all")}
                </TabsTrigger>

                {productCategories.map(categoryKey => (
                  <TabsTrigger 
                    key={categoryKey}
                    value={categoryKey} 
                    onClick={() => handleCategoryChange(categoryKey)}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary whitespace-nowrap"
                  >
                    {t(`products.categories.${categoryKey}`)}
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