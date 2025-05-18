import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/product-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { LazyImage } from "@/components/ui/lazy-image";
import { useTranslation } from "react-i18next";
import i18n, { safeTranslate } from "../i18n";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { getProductDetails } from "@/data/product-data";
import { useEffect, useState, useCallback, useMemo, useRef, Suspense, lazy } from "react";
import { isMobileDevice, isLowPerformanceDevice } from "@/utils/mobile-detection";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// Re-uploaded aluminum profile images
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';
import standardProfiles from '@assets/Aluminum U-Profiles.jpg';
import machineProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';

// Import assets from attached_assets folder
import rainwaterGrillD400 from "@assets/Rainwater grill D400 1 .png";
import rainwaterGrillD4002 from "@assets/Rainwater grill D400 2 .png";
import butterflyValve from "@assets/Butterfly valve cast iron DN100-700, PN10-16 .png";
import qualityAssurance from "@assets/quality assurance.webp";
import rainwaterGrillMeria from "@assets/Rainwater grill D400 MERIA .png";
import rainwaterGrillF900 from "@assets/Rainwater grill F900 .png";
import rainwaterGrillC250 from "@assets/Rainwater grille C250 .png";
import rainwaterGrillHighway from "@assets/Rainwater grill for highways (С250)D .png";
import rainwaterGrillC250H170 from "@assets/Rainwater grill C250 H170 .png";
import rainwaterGrillEN1433 from "@assets/Rainwater grill 5067 high-resistance spherical graphite cast iron, C250 EN 1433 .png";
import rainwaterGrillE600 from "@assets/Rainwater grill high-resistance spherical graphite cast iron, GGG50 E600 EN 1433.png";

import manholeD400K from "@assets/Manhole cover D400 H100 (K) .png";
import manholeD400B from "@assets/Manhole cover D400(B) .png";
import manholeD400B140 from "@assets/Manhole cover D400 (B) Н140 .png";
import manholeF900K from "@assets/Heavy tonnage manhole cover F900(K) Н100 .png";
import manholeE600K from "@assets/Circular manhole cover E600 (K) Н130 .png";
import manholeC250KH80 from "@assets/Circular manhole cover (С250)K H80 .png";
import manholeC250T from "@assets/Heavy manhole cover T(С250) .png";
import manholeBLeaf from "@assets/Manhole cover С(В125) \"Leaf decorated\" H75 .png";

import hdpePipes from "@assets/HDPE pipes (PE pipes) .png";
import doubleCorrugatedPipes from "@assets/Double corrugated pipes .png";
import steelReinforcedPipe from "@assets/Steel reinforced corrugated polyethilene pipe.png";

import elbow90 from "@assets/Elbow 90° (Injection) fitting .png";
import elbow45 from "@assets/Elbow 45° (Injection) fitting .png";
import tee90 from "@assets/Equal TEE 90° (Injection) fitting .png";
import flangeAdapter from "@assets/Flange adapter-Short type (Injection) .png";
import flangeAdapterLong20_355 from "@assets/Flange adapter-long type 20-355 (Injection).png";
import flangeAdapterLong400_500 from "@assets/Flange adapter-long type 400-500 (Injection).png";
import fittingCapInjection from "@assets/End Cap (Injection) .png";
import reducerTee90_125_225 from "@assets/Reduced TEE 90°125-225 (Injection) .png";
import reducerTee90_250_400 from "@assets/Reduced TEE 90° 250-400 (Injection) .png";
import reducer140_200 from "@assets/Reducer 140-200 (Injection) .png";
import reducer225_280 from "@assets/Reducer 225-280 (Injection) .png";
import reducer25_125 from "@assets/Reducer 25-125 (Injection) .png";
import reducer315_400 from "@assets/Reducer 315-400 (Injection) .png";

import hsawPilesWater from "@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png";
import hsawPilesPurpose from "@assets/Helical Submerged Arc Welded (HSAW) Pipes For Pile Purpose.png";
import steelPipesOilGas from "@assets/Steel Pipes For Oil and Gas Purpose .png";

import butterlyValve from "@assets/Butterfly valve cast iron DN100-700, PN10-16 .png";
import gateValve from "@assets/Gate valve cast iron DN50-500, PN10-16 .png";
import groundFireHydrant from "@assets/Ground fire hydrant .png";
import undergroundFireHydrant from "@assets/Underground fire hydrant .png";
import dismantlingPieces from "@assets/Dismantling pieces DN 50 - DN 700 EN 545 EN 1092-2 EN 10002-2 .png";

import trapC250 from "@assets/Trap C250 H165 .png";
import drainageChannel from "@assets/Drainage channel 5066 high-resistance spherical graphite cast iron, C250 EN 1433 .png";
import wellFacility from "@assets/Well facility .png";
import valveSurfaceBox from "@assets/Valve surface box .png";
import wireGate from "@assets/Wire mesh gate .jpg";
import wasteBox from "@assets/Waste box 30 l .png";
import flatWireMesh from "@assets/Flat type wire mesh .jpg";
import chainLinkFence from "@assets/Chain link fence .jpg";
import natoPost from "@assets/Nato type post .jpg";
import meterBox from "@assets/Meter box .png";
import castIronBarrier1 from "@assets/Cast iron barrier 1 .png";
import castIronBarrier2 from "@assets/Cast iron barrier 2 .png";

// Helper functions for fallback product data
function getDefaultImageForProduct(id: string): string {
  // Map product IDs to their default images to ensure we always have an image
  const imageMap: Record<string, string> = {
    "standard-profiles": standardProfiles,
    "machine-building-profiles": machineProfiles,
    "led-profiles": ledProfiles,
    "special-profiles": specialProfiles,
    "hdpe-pipes": hdpePipes,
    "double-corrugated-pipes": doubleCorrugatedPipes,
    "reinforced-corrugated-pipes": steelReinforcedPipe,
    "hsaw-pipes": hsawPilesWater,
    "oil-gas-pipes": steelPipesOilGas,
    "manhole-covers": manholeD400K,
    "drainage-grates": rainwaterGrillD400
  };
  
  return imageMap[id] || standardProfiles; // Fallback to standardProfiles if unknown ID
}

function getCategoryForProduct(id: string): string {
  // Determine the category based on the product ID
  if (id.includes('profiles')) return 'aluminum';
  if (id.includes('pipes')) return 'polyethylene';
  if (id.includes('hsaw') || id.includes('oil-gas')) return 'steel';
  if (id.includes('manhole') || id.includes('grates') || id.includes('grill')) return 'cast-iron';
  return 'aluminum'; // Default category
}

export default function Products() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [, forceUpdate] = useState({});
  // CRITICAL FIX: Force immediate display on mobile without waiting for API
  const isMobile = isMobileDevice() || isLowPerformanceDevice();
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(true);
const productLoadingQueue = useRef<string[]>([]);
const loadedProducts = useRef<Set<string>>(new Set());

// Implement virtual scrolling and progressive loading
const intersectionObserver = useRef<IntersectionObserver | null>(null); // Always start with content displayed
  const [activeFilter, setActiveFilter] = useState<string>("all");
  // CRITICAL FIX: Skip initial load animation entirely
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(false);
  
  // Product cache using ref to persist between renders
  const productCache = useRef<Record<string, any>>({});
  
  // Track the last loaded language to optimize language switching
  const lastLanguage = useRef<string>(i18n.language);
  
  // Completely optimized product loading system
  // High-performance implementation for all devices
  const memoizedProductPreloader = useCallback(() => {
    try {
      // Minimize console logging for better performance
      
      // Display content immediately if we have cached data
      if (Object.keys(productCache.current).length > 0) {
        setIsPageLoaded(true);
        forceUpdate({});
      } else {
        // Only show skeleton briefly if no cached data exists
        setIsPageLoaded(false);
      }
      
      // Don't force scroll to top during language changes
      // This allows for a seamless language switching experience while maintaining position
      
      // Universal core products that must be shown first
      const universalCoreProducts = [
        "standard-profiles",
        "machine-building-profiles", 
        "led-profiles",
        "special-profiles",
        "hdpe-pipes",
        "double-corrugated-pipes",
        "reinforced-corrugated-pipes",
        "hsaw-pipes",
        "oil-gas-pipes",
        "manhole-covers",
        "drainage-grates"
      ];
      
      // Safety measure: Always preload ALL critical products synchronously
      for (const id of universalCoreProducts) {
        try {
          const cacheKey = `${id}-${i18n.language}`;
          if (!productCache.current[cacheKey]) {
            // Load essential products immediately 
            productCache.current[cacheKey] = getTranslatedProduct(id);
            console.log(`Successfully cached product: ${id} in ${i18n.language}`);
          }
        } catch (err) {
          console.warn(`Product load warning: ${id}`, err);
          // Fallback mechanism - create safe product object with default values
          const fallbackImage = (() => {
            if (id.includes('profiles')) return id.includes('led') ? ledProfiles : standardProfiles;
            if (id.includes('pipes')) return hdpePipes;
            if (id.includes('manhole')) return manholeD400K;
            if (id.includes('grates') || id.includes('grill')) return rainwaterGrillD400;
            return standardProfiles;
          })();
          
          const fallbackCategory = (() => {
            if (id.includes('profiles')) return 'aluminum';
            if (id.includes('pipes')) return 'polyethylene';
            if (id.includes('hsaw') || id.includes('oil-gas')) return 'steel';
            if (id.includes('manhole') || id.includes('grates') || id.includes('grill')) return 'cast-iron';
            return 'aluminum';
          })();
          
          productCache.current[`${id}-${i18n.language}`] = {
            id,
            title: t(`products.${id}.title`, id.split('-').join(' ')),
            description: t(`products.${id}.description`, 'Product details coming soon.'),
            image: fallbackImage,
            category: fallbackCategory,
            features: [],
            applications: [],
            specifications: {}
          };
        }
      }
      
      // Force immediate render with core products
      setIsFirstLoad(false);
      forceUpdate({});
      
      // Optimized product loading for better performance with less UI blocking
      setTimeout(() => {
        // Load remaining product categories
        const allProductIds = Array.from(new Set([
          ...aluminumIds,
          ...polyethyleneIds,
          ...steelIds,
          ...castIronIds,
          ...rainwaterIds,
          ...fittingsIds,
          ...urbanIds
        ]));
        
        // Filter out already loaded products
        const remainingProducts = allProductIds.filter(id => 
          !universalCoreProducts.includes(id) && 
          !productCache.current[`${id}-${i18n.language}`]
        );
        
        // Use more aggressive batching to improve perceived performance
        // This prevents the UI thread from being blocked for too long
        const loadBatch = (startIndex: number) => {
          // Process a small batch that won't block the UI
          const batchSize = 5;
          const endIndex = Math.min(startIndex + batchSize, remainingProducts.length);
          
          // If we've processed all products, stop recursion
          if (startIndex >= remainingProducts.length) {
            forceUpdate({}); // Final update
            return;
          }
          
          // Process this batch
          for (let i = startIndex; i < endIndex; i++) {
            const id = remainingProducts[i];
            try {
              const cacheKey = `${id}-${i18n.language}`;
              if (!productCache.current[cacheKey]) {
                productCache.current[cacheKey] = getTranslatedProduct(id);
              }
            } catch (err) {
              // Silent error handling to prevent user-visible errors
            }
          }
          
          // Update the UI once per batch
          if ((endIndex - startIndex) > 0) {
            forceUpdate({});
          }
          
          // Schedule next batch with requestAnimationFrame for smoother experience
          if (endIndex < remainingProducts.length) {
            window.requestAnimationFrame(() => {
              loadBatch(endIndex);
            });
          }
        };
        
        // Start loading batches with first index
        loadBatch(0);
        
      }, 50); // Reduced delay for faster initial display
      
      // Desktop loading path continues below
      // Always immediately activate the skeleton UI for perceived performance
      if (isFirstLoad || i18n.language !== lastLanguage.current) {
        setIsPageLoaded(false); // Trigger skeleton display during language switch
      }
      
      // Record current language for future comparisons
      lastLanguage.current = i18n.language;
      
      // Critical path rendering - load bare minimum for initial display
      const criticalProducts = [
        "standard-profiles", 
        "hdpe-pipes", 
        "hsaw-pipes", 
        "manhole-covers"
      ];
      
      // Use RequestIdleCallback API when available for non-blocking loading
      const scheduleWork = (callback: () => void, delay = 1) => {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(callback, { timeout: 500 });
        } else {
          setTimeout(callback, delay);
        }
      };
      
      // Load critical products synchronously for immediate display
      criticalProducts.forEach(id => {
        const cacheKey = `${id}-${i18n.language}`;
        if (!productCache.current[cacheKey]) {
          productCache.current[cacheKey] = getTranslatedProduct(id);
        }
      });
      
      // Show content quickly on desktop
      setTimeout(() => {
        setIsPageLoaded(true);
        setIsFirstLoad(false);
        forceUpdate({});
      }, 200);
      
      // Asynchronously load remaining products in small batches
      scheduleWork(() => {
        // Collect all product IDs to preload
        const allProductIds = Array.from(new Set([
          ...aluminumIds,
          ...polyethyleneIds,
          ...steelIds,
          ...castIronIds,
          ...rainwaterIds,
          ...fittingsIds,
          ...urbanIds
        ]));
        
        // Filter out already loaded critical products
        const remainingProducts = allProductIds.filter(id => !criticalProducts.includes(id));
        
        // Use small batches with minimal UI impact
        let processed = 0;
        const batchSize = 3;
        
        const loadNextBatch = () => {
          if (processed >= remainingProducts.length) {
            forceUpdate({}); // Final update once all batches complete
            return;
          }
          
          const currentBatch = remainingProducts.slice(processed, processed + batchSize);
          processed += currentBatch.length;
          
          currentBatch.forEach(id => {
            const cacheKey = `${id}-${i18n.language}`;
            if (!productCache.current[cacheKey]) {
              productCache.current[cacheKey] = getTranslatedProduct(id);
            }
          });
          
          // Use a microtask to check browser stress level
          Promise.resolve().then(() => {
            scheduleWork(() => loadNextBatch());
          });
        };
        
        loadNextBatch();
      });
      
    } catch (error) {
      console.error("Error in optimized product loading:", error);
      setIsPageLoaded(true); // Ensure page is displayed even on error
    }
  }, [i18n.language]);
  
  // Use effect with memoized loader
  useEffect(() => {
    memoizedProductPreloader();
  }, [memoizedProductPreloader]);
  
  // Debug and safe filter change handler
  const handleFilterChange = (filter: string) => {
    console.log(`Starting filtering with category: ${filter}, language: ${currentLanguage}`);
    
    // Safety check - make sure we have product data for this filter
    const availableCategories = ["all", "aluminum", "cast-iron", "steel", "polyethylene"];
    const safeFilter = availableCategories.includes(filter) ? filter : "all";
    
    if (safeFilter !== filter) {
      console.log(`Filter '${filter}' not available, defaulting to 'all'`);
    }
    
    setActiveFilter(safeFilter);
    
    // Update URL hash without triggering the hash change listener
    const hashMap: Record<string, string> = {
      "all": "",
      "aluminum": "aluminum",
      "cast-iron": "cast-iron",
      "steel": "steel",
      "polyethylene": "polyethylene"
    };
    
    const newHash = hashMap[safeFilter] || "";
    
    if (newHash) {
      window.history.replaceState(null, "", `#${newHash}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };
  
  // Force component to update when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
      // Reset filter to "all" when language changes to avoid potential issues
      handleFilterChange("all");
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // Listen for hash changes to update the filter
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the # character
      const filter = sectionIdToFilter[hash];
      if (filter) {
        handleFilterChange(filter);
      }
    };
    
    // Initial check on mount
    handleHashChange();
    
    // Add event listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Get translated category name based on current language
  const getTranslatedCategory = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    const categoryId = lowerCategory.replace(/\s+/g, '-');
    const categoryData = getProductDetails(categoryId, currentLanguage);
    
    if (categoryData?.title) {
      return categoryData.title;
    }
    
    // Check for translations in i18n first using products.categories namespace
    const translationKey = `products.categories.${category}`;
    const translation = t(translationKey);
    if (translation && translation !== translationKey) {
      return translation;
    }
    
    // Fallback translations for main categories
    switch(lowerCategory) {
      case 'aluminum':
        return currentLanguage === 'ru' ? 'Алюминий' : 
               currentLanguage === 'et' ? 'Alumiinium' :
               currentLanguage === 'lv' ? 'Alumīnijs' :
               currentLanguage === 'lt' ? 'Aliuminis' :
               currentLanguage === 'pl' ? 'Aluminium' : 
               currentLanguage === 'zh-CN' ? '铝制品' : 'Aluminum';
      case 'polyethylene':
        return currentLanguage === 'ru' ? 'Полиэтилен' : 
               currentLanguage === 'et' ? 'Polüetüleen' :
               currentLanguage === 'lv' ? 'Polietilēns' :
               currentLanguage === 'lt' ? 'Polietilenas' :
               currentLanguage === 'pl' ? 'Polietylen' : 
               currentLanguage === 'zh-CN' ? '聚乙烯' : 'Polyethylene';
      case 'cast iron':
        return currentLanguage === 'ru' ? 'Чугун' : 
               currentLanguage === 'et' ? 'Malm' :
               currentLanguage === 'lv' ? 'Čuguns' :
               currentLanguage === 'lt' ? 'Ketaus' :
               currentLanguage === 'pl' ? 'Żeliwo' : 
               currentLanguage === 'zh-CN' ? '铸铁' : 'Cast Iron';
      case 'steel':
        return currentLanguage === 'ru' ? 'Сталь' : 
               currentLanguage === 'et' ? 'Teras' :
               currentLanguage === 'lv' ? 'Tērauds' :
               currentLanguage === 'lt' ? 'Plienas' :
               currentLanguage === 'pl' ? 'Stal' : 
               currentLanguage === 'zh-CN' ? '钢铁' : 'Steel';
      case 'fittings':
        return currentLanguage === 'ru' ? 'Фитинги' : 
               currentLanguage === 'et' ? 'Liitmikud' :
               currentLanguage === 'lv' ? 'Savienojumi' :
               currentLanguage === 'lt' ? 'Jungtys' :
               currentLanguage === 'pl' ? 'Złączki' : 
               currentLanguage === 'zh-CN' ? '管道配件' : 'Fittings';
      case 'urban infrastructure':
        return currentLanguage === 'ru' ? 'Городская Инфраструктура' : 
               currentLanguage === 'et' ? 'Linnainfrastruktuur' :
               currentLanguage === 'lv' ? 'Pilsētas Infrastruktūra' :
               currentLanguage === 'lt' ? 'Miesto Infrastruktūra' :
               currentLanguage === 'pl' ? 'Infrastruktura Miejska' : 
               currentLanguage === 'zh-CN' ? '城市基础设施' : 'Urban Infrastructure';
      default:
        return category;
    }
  };
  
  // Performance-optimized translation function with caching
  // CRITICAL FIX: Completely rewritten product loading function for guaranteed mobile rendering
  const getTranslatedProduct = (id: string) => {
    // Cache key combines product ID and language for proper localization
    const cacheKey = `${id}-${currentLanguage}`;
    
    // Check if this exact product+language combo is already in cache
    if (productCache.current[cacheKey]) {
      return productCache.current[cacheKey];
    }
    
    try {
      // First attempt: Try to get properly localized product
      const product = getProductDetails(id, currentLanguage);
      
      if (product) {
        // Found the proper translation - cache and return it
        productCache.current[cacheKey] = product;
        return product;
      }
      
      // Second attempt: Create a quality fallback with reliable data
      // CRITICAL FIX: More robust fallback mechanism for mobile
      console.log(`Creating reliable fallback for: ${id} in ${currentLanguage}`);
      
      // Get proper translated title if possible (mobile critical)
      const safeTitle = (() => {
        try {
          // Try i18n first
          const translationKey = `products.${id.replace(/-/g, '')}.title`;
          const translatedTitle = safeTranslate(translationKey, '', { lng: currentLanguage });
          
          if (translatedTitle && translatedTitle !== translationKey) {
            return translatedTitle;
          }
          
          // Fallback to cleaned ID
          return id.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        } catch (e) {
          // Ultimate fallback
          return id.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      })();
      
      // Get proper category and image (mobile critical)
      const category = getCategoryForProduct(id);
      const image = getDefaultImageForProduct(id);
      
      // Safe reliable fallback that won't break mobile rendering
      const fallbackProduct = {
        id,
        title: safeTitle,
        description: safeTranslate(`products.${id}.description`, `High-quality ${category} product from MetaNord.`),
        image: image || "",
        category: category || "other",
        features: [],
        applications: [],
        specifications: {},
        link: `/product?id=${id}`
      };
      
      // Cache the fallback result for better performance
      productCache.current[cacheKey] = fallbackProduct;
      return fallbackProduct;
    } catch (error) {
      // CRITICAL: Ultra-safe fallback - this MUST work on mobile
      console.error(`Emergency fallback for: ${id} in ${currentLanguage}`, error);
      const category = id.includes('profiles') ? 'aluminum' : 
                     id.includes('pipes') ? 'polyethylene' :
                     id.includes('manhole') || id.includes('grate') ? 'cast-iron' : 'other';
      
      const emergencyFallbackProduct = {
        id,
        title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Industrial product from MetaNord.`,
        image: getDefaultImageForProduct(id) || "",
        category: category,
        features: [],
        applications: [],
        specifications: {},
        link: `/product?id=${id}`
      };
      
      // Create and cache the emergency fallback
      const emergencyFallback = {
        id,
        title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Industrial product from MetaNord.`,
        image: getDefaultImageForProduct(id) || "",
        category: category,
        features: [],
        applications: [],
        specifications: {},
        link: `/product?id=${id}`
      };
      
      // Cache the emergency fallback
      productCache.current[cacheKey] = emergencyFallback;
      return emergencyFallback;
    }
  };
  
  // Function to standardize product category names
  const standardizeCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'cast iron': 'Cast Iron',
      'cast-iron': 'Cast Iron',
      'polyethylene': 'Polyethylene',
      'steel': 'Steel',
      'aluminum': 'Aluminum',
      'fittings': 'Fittings',
      'urban infrastructure': 'Urban Infrastructure'
    };
    
    return categoryMap[category.toLowerCase()] || category;
  };
  
  // Define all product IDs by category
  const aluminumIds = ["standard-profiles", "machine-building-profiles", "led-profiles", "special-profiles"];
  const polyethyleneIds = ["hdpe-pipes", "corrugated-pipes", "reinforced-pipe", "elbow-fitting"];
  const steelIds = ["hsaw-water-pipes", "steel-pipes-oil-gas", "pile-pipes"];
  const castIronIds = ["manhole-covers", "rainwater-grill-d400-standard", "ground-fire-hydrant", "gate-valve"];
  const rainwaterIds = ["rainwater-grill-d400-standard", "rainwater-grill-d400-type2", "rainwater-grill-meria", "rainwater-grill-f900"];
  const fittingsIds = ["elbow-fitting", "elbow-45-fitting", "tee-fitting", "flange-adapter"];
  const urbanIds = ["gate-valve", "ground-fire-hydrant", "drainage-channel", "waste-box"];
  
  // Map section IDs to filter values
  const sectionIdToFilter: Record<string, string> = {
    'aluminum': 'aluminum',
    'polyethylene': 'polyethylene',
    'steel': 'steel',
    'cast-iron': 'cast-iron',
    'rainwater': 'rainwater',
    'fittings': 'fittings',
    'urban': 'urban'
  };
  
  // Enhanced image mappings with guaranteed references
  const productImages: Record<string, any> = {
    // Aluminum images from local assets - fixed keys to match aluminumIds
    "standard-profiles": standardProfiles,
    "machine-building-profiles": machineProfiles,
    "led-profiles": ledProfiles,
    "special-profiles": specialProfiles,
    
    // Polyethylene images
    "hdpe-pipes": hdpePipes,
    "corrugated-pipes": doubleCorrugatedPipes,
    "reinforced-pipe": steelReinforcedPipe,
    
    // Steel images
    "hsaw-water-pipes": hsawPilesWater,
    "steel-pipes-oil-gas": steelPipesOilGas,
    "pile-pipes": hsawPilesPurpose,
    
    // Cast iron images
    "manhole-covers": manholeD400K,
    "rainwater-grill-d400-standard": rainwaterGrillD400,
    "ground-fire-hydrant": groundFireHydrant,
    "gate-valve": gateValve,
    
    // Rainwater images
    "rainwater-grill-d400-type2": rainwaterGrillD4002,
    "rainwater-grill-meria": rainwaterGrillMeria,
    "rainwater-grill-f900": rainwaterGrillF900,
    
    // Fittings images
    "elbow-fitting": elbow90,
    "elbow-45-fitting": elbow45,
    "tee-fitting": tee90,
    "flange-adapter": flangeAdapter,
    
    // Urban infrastructure
    "drainage-channel": drainageChannel,
    "waste-box": wasteBox
  };
  
  // Function to generate product list for any category
  // CRITICAL FIX: Guaranteed product generation for mobile devices
  const generateProducts = (ids: string[], defaultCategory: string) => {
    // Always provide guaranteed products for mobile display
    return ids.map(id => {
      // Get fallback image BEFORE requesting product (critical for mobile)
      const fallbackImage = productImages[id] || getDefaultImageForProduct(id);
      
      try {
        // Get translated product with error handling
        const product = getTranslatedProduct(id);
        
        // Debug logging for image paths
        if (defaultCategory === "Aluminum") {
          console.log(`Loading product with ID: ${id}, Image: ${!!fallbackImage}`);
        }
        
        // Use product data with guaranteed fallbacks for mobile
        return {
          id,
          image: product?.image || fallbackImage,
          title: product?.title || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: product?.description || `High-quality ${defaultCategory} product from MetaNord.`,
          category: standardizeCategory(product?.category || defaultCategory),
          link: `/product?id=${id}`
        };
      } catch (e) {
        // Emergency fallback - never return null/undefined on mobile
        console.error(`Emergency fallback for product ${id}`, e);
        return {
          id,
          image: fallbackImage,
          title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `High-quality ${defaultCategory} product.`,
          category: standardizeCategory(defaultCategory),
          link: `/product?id=${id}`
        };
      }
    });
  };
  
  // Define product IDs first - ensuring they're accessible in the right scope with explicit definitions
  const safeAluminumIds = ["standard-profiles", "machine-building-profiles", "led-profiles", "special-profiles"];
  const safePolyethyleneIds = ["hdpe-pipes", "double-corrugated-pipes", "reinforced-corrugated-pipes"];
  const safeSteelIds = ["hsaw-pipes", "oil-gas-pipes"];
  const safeCastIronIds = ["manhole-covers", "drainage-grates"];
  
  // Generate all product lists with more robust approach 
  // URGENT MOBILE FIX: Completely rewritten to guarantee products always show on mobile
  const getProductWithImage = (id: string, category: string) => {
    try {
      // First try to get the image directly - this is most reliable on mobile
      const directImage = productImages[id] || getDefaultImageForProduct(id);
      console.log(`MOBILE FIX - Image for ${id}: ${!!directImage}`);
      
      // Set guaranteed fallback data in case product retrieval fails
      const fallbackProduct = {
        id,
        image: directImage || `/@fs/home/runner/workspace/attached_assets/Aluminum U-Profiles.jpg`,
        title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `High-quality ${category} product from MetaNord.`,
        category: category,
        link: `/product?id=${id}`,
        features: [],
        applications: [],
        specifications: {}
      };
      
      try {
        // Try to get translated product data
        const product = getTranslatedProduct(id);
        
        if (!product) {
          console.log(`Product ${id} not found - using fallback`);
          return fallbackProduct;
        }
        
        // Return product with guaranteed image fallback
        return {
          id,
          image: product.image || directImage || fallbackProduct.image,
          title: product.title || fallbackProduct.title,
          description: product.description || fallbackProduct.description,
          category: category,
          link: `/product?id=${id}`,
          features: product.features || [],
          applications: product.applications || [],
          specifications: product.specifications || {}
        };
      } catch (e) {
        console.error(`Error getting product ${id} - using guaranteed fallback`);
        return fallbackProduct;
      }
    } catch (error) {
      // Ultimate emergency fallback - this MUST work on mobile
      console.error(`EMERGENCY FALLBACK for ${id}`);
      
      return {
        id,
        image: `/@fs/home/runner/workspace/attached_assets/Aluminum U-Profiles.jpg`,
        title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Product from MetaNord.`,
        category: category,
        link: `/product?id=${id}`,
        features: [],
        applications: [],
        specifications: {}
      };
    }
  };
  
  // URGENT MOBILE FIX: Always provide guaranteed hardcoded products that will display regardless of other issues
  console.log("CRITICAL: Forcing guaranteed products to display on all mobile devices");
  
  // Direct hardcoded products that MUST display on mobile
  const GUARANTEED_PRODUCTS = {
    aluminum: [
      {
        id: "standard-profiles",
        title: "Standard Profiles",
        description: "Aluminum standard profiles for general construction and industrial applications.",
        image: standardProfiles,
        category: "Aluminum",
        link: "/product?id=standard-profiles"
      },
      {
        id: "machine-building-profiles",
        title: "Machine Building Profiles",
        description: "Specialized aluminum profiles for machine building and industrial equipment.",
        image: machineProfiles,
        category: "Aluminum",
        link: "/product?id=machine-building-profiles"
      },
      {
        id: "led-profiles",
        title: "LED Profiles",
        description: "Aluminum profiles designed for LED lighting applications and fixtures.",
        image: ledProfiles,
        category: "Aluminum",
        link: "/product?id=led-profiles"
      },
      {
        id: "special-profiles",
        title: "Special Profiles",
        description: "Custom and specialized aluminum profiles for unique applications.",
        image: specialProfiles,
        category: "Aluminum",
        link: "/product?id=special-profiles"
      }
    ],
    polyethylene: [
      {
        id: "hdpe-pipes",
        title: "HDPE Pipes",
        description: "High-density polyethylene pipes for water and sewage infrastructure.",
        image: hdpePipes,
        category: "Polyethylene",
        link: "/product?id=hdpe-pipes"
      },
      {
        id: "double-corrugated-pipes",
        title: "Double Corrugated Pipes",
        description: "Double-wall corrugated pipes for drainage and sewage systems.",
        image: doubleCorrugatedPipes,
        category: "Polyethylene",
        link: "/product?id=double-corrugated-pipes"
      }
    ],
    steel: [
      {
        id: "hsaw-pipes",
        title: "HSAW Pipes",
        description: "Spiral welded steel pipes for water and oil transportation.",
        image: hsawPilesWater,
        category: "Steel",
        link: "/product?id=hsaw-pipes"
      },
      {
        id: "oil-gas-pipes",
        title: "Oil & Gas Pipes",
        description: "Steel pipes designed for oil and gas transportation systems.",
        image: steelPipesOilGas,
        category: "Steel",
        link: "/product?id=oil-gas-pipes"
      }
    ],
    castIron: [
      {
        id: "manhole-covers",
        title: "Manhole Covers",
        description: "Heavy-duty cast iron manhole covers for urban infrastructure.",
        image: manholeD400K,
        category: "Cast Iron",
        link: "/product?id=manhole-covers"
      },
      {
        id: "drainage-grates",
        title: "Drainage Grates",
        description: "Cast iron drainage grates for stormwater collection systems.",
        image: rainwaterGrillD400,
        category: "Cast Iron",
        link: "/product?id=drainage-grates"
      }
    ]
  };
  
  // Force use of guaranteed products that will always display on mobile
  const aluminumProducts = GUARANTEED_PRODUCTS.aluminum;
  
  // CRITICAL MOBILE FIX: Use guaranteed pre-defined products for ALL categories
  console.log("Processing polyethylene products - forcing guaranteed display");
  const polyethyleneProducts = GUARANTEED_PRODUCTS.polyethylene;
  
  console.log("Processing steel products - forcing guaranteed display");
  const steelProducts = GUARANTEED_PRODUCTS.steel;
  
  console.log("Processing cast iron products - forcing guaranteed display");
  const castIronProducts = GUARANTEED_PRODUCTS.castIron;
  
  // Secondary product lists - used for specialty filtering
  const rainwaterProducts = generateProducts(rainwaterIds, "Cast Iron");
  const fittingsProducts = generateProducts(fittingsIds, "Fittings");
  const urbanInfrastructureProducts = generateProducts(urbanIds, "Urban Infrastructure");
  
  // Main product groups organized by category

  return (
    <>
      <MetaTags
        title={`${t('products.title', 'Our Products')} | MetaNord`}
        description={t('products.metaDescription', 'Explore our comprehensive range of high-quality infrastructure and construction products. We offer cast iron manholes, HDPE pipes, and more for European markets.')}
        keywords="aluminum profiles, HDPE pipes, infrastructure products, cast iron manholes, construction materials, European markets"
        ogType="website"
      />
      
      <SchemaOrg
        type="website"
        title={`${t('products.title', 'Our Products')} | MetaNord`}
        description={t('products.metaDescription', 'Explore our comprehensive range of high-quality infrastructure and construction products. We offer cast iron manholes, HDPE pipes, and more for European markets.')}
        url="/products"
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('products.title', 'Our Products'), url: '/products' }
        ]}
      />
      
      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 md:pt-32 md:pb-28 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Hide loading completely on mobile for instant display */}
              {!isPageLoaded && !isMobile ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                {/* Desktop-only loading indicator */}
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-primary mb-3 sm:mb-4"></div>
                <p className="text-base sm:text-lg text-gray-600 text-center px-4">{t('products.loading', 'Loading products...')}</p>
                
                {/* Content that will show immediately on mobile */}
                <noscript>
                  <div className="mt-8 text-center">
                    <h1 className="text-2xl font-bold">{t('products.title', 'Our Products')}</h1>
                    <p>{t('products.subtitle', 'High-quality infrastructure and construction products')}</p>
                  </div>
                </noscript>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t('products.title', 'Our')} <span className="text-primary">{t('products.titleHighlight', 'Catalog')}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-10 max-w-3xl mx-auto px-2">
                  {t('products.subtitle', 'High-quality infrastructure and construction products for European markets')}
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="absolute -bottom-16 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white to-transparent z-10"></div>
        </section>
        
        {/* Product Catalog */}
        <AnimatedSection className="py-12 sm:py-16 md:py-20 bg-white" id="catalog">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
              {t('products.catalogTitle', 'Product Catalog')}
            </h2>
            
            {/* Category Filter */}
            <div className="max-w-4xl mx-auto bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm mb-10 sm:mb-16">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Check size={16} className="sm:h-[18px] sm:w-[18px] text-accent" />
                </motion.div>
                {t('products.filters.title', 'Filter by Category')}
              </h3>
              
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {/* Performance-optimized filter buttons using memoization */}
                {useMemo(() => {
                  // Define all categories to avoid repeating logic
                  const categories = [
                    { id: "all", label: t('products.filters.all', 'All Products') },
                    { id: "aluminum", label: getTranslatedCategory('Aluminum') },
                    { id: "cast-iron", label: getTranslatedCategory('Cast Iron') },
                    { id: "steel", label: getTranslatedCategory('Steel') },
                    { id: "polyethylene", label: getTranslatedCategory('Polyethylene') },
                    { id: "fittings", label: getTranslatedCategory('Fittings') },
                    { id: "rainwater", label: t('products.categories.rainwater', 'Rainwater Grills') },
                    { id: "urban", label: getTranslatedCategory('Urban Infrastructure') }
                  ];
                  
                  // Create filter button component to reduce duplicate code
                  const createFilterButton = (id: string, label: string) => (
                    <button 
                      key={`filter-${id}`}
                      onClick={() => handleFilterChange(id)}
                      className={`
                        px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300
                        border flex items-center justify-center gap-1.5 min-h-[40px] touch-manipulation
                        ${activeFilter === id 
                          ? "bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-md" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                        }
                      `}
                    >
                      {activeFilter === id && <Check size={14} className="min-w-[14px]" />}
                      <span className="line-clamp-1">{label}</span>
                    </button>
                  );
                  
                  // Render all filter buttons at once
                  return categories.map(category => 
                    createFilterButton(category.id, category.label)
                  );
                }, [activeFilter, currentLanguage, t])}
              </div>
            </div>
            
            {/* Aluminum Products with Skeleton Loading */}
            {(activeFilter === "all" || activeFilter === "aluminum") && (
              <section className="mb-16 sm:mb-20" id="aluminum">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-accent mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Aluminum')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {/* Performance-optimized rendering with skeleton fallback */}
                  {isFirstLoad ? (
                    // Show skeleton while loading on first visit
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={`skeleton-aluminum-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full transition-all duration-300">
                          <Skeleton className="w-full h-48 rounded-t-lg" />
                          <div className="p-4 flex-grow">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-5/6 mb-1" />
                            <Skeleton className="h-4 w-4/6" />
                          </div>
                          <div className="p-4 pt-0">
                            <Skeleton className="h-10 w-full rounded-md" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : !aluminumProducts.length ? (
                    // Guaranteed fallback products if data array is empty
                    <>
                      <ProductCard
                        key="aluminum-standard-profiles-fallback"
                        id="standard-profiles"
                        title="Standard Profiles"
                        description="Versatile aluminum profiles for various construction, engineering, and design applications with diverse shapes and sizes."
                        image={standardProfiles}
                        category="Aluminum"
                        link="/product?id=standard-profiles"
                      />
                      <ProductCard
                        key="aluminum-machine-building-profiles-fallback"
                        id="machine-building-profiles"
                        title="Machine Building Profiles"
                        description="Specialized aluminum profiles designed for industrial machinery and equipment construction, offering precision and durability."
                        image={machineProfiles}
                        category="Aluminum"
                        link="/product?id=machine-building-profiles"
                      />
                      <ProductCard
                        key="aluminum-led-profiles-fallback"
                        id="led-profiles"
                        title="LED Profiles"
                        description="Aluminum profiles designed specifically for LED lighting installations, providing efficient heat dissipation and elegant mounting options."
                        image={ledProfiles}
                        category="Aluminum"
                        link="/product?id=led-profiles"
                      />
                      <ProductCard
                        key="aluminum-special-profiles-fallback"
                        id="special-profiles"
                        title="Special Profiles"
                        description="Custom-designed aluminum profiles for specialized applications requiring unique shapes and properties."
                        image={specialProfiles}
                        category="Aluminum"
                        link="/product?id=special-profiles"
                      />
                    </>
                  ) : (
                    // Use memoized product data from cache when available
                    aluminumProducts.map((product, index) => (
                      <ProductCard
                        key={`aluminum-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Cast Iron Products with Skeleton Loading */}
            {(activeFilter === "all" || activeFilter === "cast-iron") && (
              <section className="mb-16 sm:mb-20" id="cast-iron">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-primary mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Cast Iron')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {isFirstLoad ? (
                    // Show skeleton while loading on first visit
                    <>
                      {[1, 2].map((i) => (
                        <div key={`skeleton-cast-iron-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full transition-all duration-300">
                          <Skeleton className="w-full h-48 rounded-t-lg" />
                          <div className="p-4 flex-grow">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-5/6 mb-1" />
                            <Skeleton className="h-4 w-4/6" />
                          </div>
                          <div className="p-4 pt-0">
                            <Skeleton className="h-10 w-full rounded-md" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : !castIronProducts.length ? (
                    <>
                      <ProductCard
                        key="cast-iron-manhole-covers-fallback"
                        id="manhole-covers"
                        title="Manhole Covers"
                        description="Heavy-duty cast iron manhole covers with various load ratings for urban infrastructure and utilities access."
                        image={manholeD400K}
                        category="Cast Iron"
                        link="/product?id=manhole-covers"
                      />
                      <ProductCard
                        key="cast-iron-drainage-grates-fallback"
                        id="drainage-grates"
                        title="Drainage Grates"
                        description="Cast iron drainage grates for stormwater collection systems, designed for varying traffic loads and flow capacities."
                        image={rainwaterGrillD400}
                        category="Cast Iron"
                        link="/product?id=drainage-grates"
                      />
                    </>
                  ) : (
                    castIronProducts.map((product, index) => (
                      <ProductCard
                        key={`cast-iron-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Rainwater Grills */}
            {(activeFilter === "all" || activeFilter === "rainwater") && (
              <section className="mb-16 sm:mb-20" id="rainwater">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-amber-500 mr-2 xs:mr-3 sm:mr-4"></span>
                  {t('products.categories.rainwater', 'Rainwater Grills')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {!rainwaterProducts.length ? (
                    <>
                      <ProductCard
                        key="rainwater-grill-d400-standard-fallback"
                        id="rainwater-grill-d400-standard"
                        title="Rainwater Grill D400"
                        description="Heavy-duty D400 rated rainwater grills for drainage systems in roads and parking areas."
                        image={rainwaterGrillD400}
                        category="Rainwater Management"
                        link="/product?id=rainwater-grill-d400-standard"
                      />
                      <ProductCard
                        key="rainwater-grill-d400-type2-fallback"
                        id="rainwater-grill-d400-type2"
                        title="Rainwater Grill D400 Type 2"
                        description="Alternative design D400 rated rainwater grills for urban drainage applications."
                        image={rainwaterGrillD4002}
                        category="Rainwater Management"
                        link="/product?id=rainwater-grill-d400-type2"
                      />
                      <ProductCard
                        key="rainwater-grill-meria-fallback"
                        id="rainwater-grill-meria"
                        title="Rainwater Grill Meria"
                        description="Specialized Meria design rainwater grills for efficient stormwater collection."
                        image={rainwaterGrillMeria}
                        category="Rainwater Management"
                        link="/product?id=rainwater-grill-meria"
                      />
                    </>
                  ) : (
                    rainwaterProducts.map((product, index) => (
                      <ProductCard
                        key={`rainwater-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Polyethylene Products */}
            {(activeFilter === "all" || activeFilter === "polyethylene") && (
              <section className="mb-16 sm:mb-20" id="polyethylene">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-blue-500 mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Polyethylene')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {!polyethyleneProducts.length ? (
                    <>
                      <ProductCard
                        key="polyethylene-hdpe-pipes-fallback"
                        id="hdpe-pipes"
                        title="HDPE Pipes"
                        description="High-density polyethylene pipes for water supply, gas distribution, and sewage systems."
                        image={hdpePipes}
                        category="Polyethylene"
                        link="/product?id=hdpe-pipes"
                      />
                      <ProductCard
                        key="polyethylene-corrugated-pipes-fallback"
                        id="corrugated-pipes"
                        title="Corrugated Pipes"
                        description="Double-wall corrugated polyethylene pipes for drainage and stormwater management."
                        image={doubleCorrugatedPipes}
                        category="Polyethylene"
                        link="/product?id=corrugated-pipes"
                      />
                      <ProductCard
                        key="polyethylene-reinforced-pipe-fallback"
                        id="reinforced-pipe"
                        title="Steel Reinforced Pipes"
                        description="Steel-reinforced corrugated polyethylene pipes for heavy-duty drainage applications."
                        image={steelReinforcedPipe}
                        category="Polyethylene"
                        link="/product?id=reinforced-pipe"
                      />
                    </>
                  ) : (
                    polyethyleneProducts.map((product, index) => (
                      <ProductCard
                        key={`polyethylene-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Fittings Products */}
            {(activeFilter === "all" || activeFilter === "fittings") && (
              <section className="mb-16 sm:mb-20" id="fittings">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-purple-500 mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Fittings')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {!fittingsProducts.length ? (
                    <>
                      <ProductCard
                        key="fittings-elbow-fitting-fallback"
                        id="elbow-fitting"
                        title="Elbow Fitting (90°)"
                        description="Polyethylene elbow fittings (90°) for changing pipe direction in water and wastewater systems."
                        image={elbow90}
                        category="Fittings"
                        link="/product?id=elbow-fitting"
                      />
                      <ProductCard
                        key="fittings-elbow-45-fitting-fallback"
                        id="elbow-45-fitting"
                        title="Elbow Fitting (45°)"
                        description="Polyethylene elbow fittings (45°) for creating gradual pipe direction changes."
                        image={elbow45}
                        category="Fittings"
                        link="/product?id=elbow-45-fitting"
                      />
                      <ProductCard
                        key="fittings-tee-fitting-fallback"
                        id="tee-fitting"
                        title="Tee Fitting"
                        description="Polyethylene tee fittings for creating pipe branches and connections."
                        image={tee90}
                        category="Fittings"
                        link="/product?id=tee-fitting"
                      />
                    </>
                  ) : (
                    fittingsProducts.map((product, index) => (
                      <ProductCard
                        key={`fittings-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Steel Products */}
            {(activeFilter === "all" || activeFilter === "steel") && (
              <section className="mb-16 sm:mb-20" id="steel">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-gray-600 mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Steel')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {!steelProducts.length ? (
                    <>
                      <ProductCard
                        key="steel-hsaw-pipes-fallback"
                        id="hsaw-pipes"
                        title="HSAW Pipes"
                        description="Helical Submerged Arc Welded steel pipes for water transportation and infrastructure projects."
                        image={hsawPilesWater}
                        category="Steel"
                        link="/product?id=hsaw-pipes"
                      />
                      <ProductCard
                        key="steel-oil-gas-pipes-fallback"
                        id="oil-gas-pipes"
                        title="Oil & Gas Pipes"
                        description="High-performance steel pipes designed specifically for oil and gas transportation applications."
                        image={steelPipesOilGas}
                        category="Steel"
                        link="/product?id=oil-gas-pipes"
                      />
                    </>
                  ) : (
                    steelProducts.map((product, index) => (
                      <ProductCard
                        key={`steel-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
            
            {/* Urban Infrastructure Products */}
            {(activeFilter === "all" || activeFilter === "urban") && (
              <section className="mb-16 sm:mb-20" id="urban">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 flex items-center">
                  <span className="w-6 xs:w-8 sm:w-12 h-1 bg-red-500 mr-2 xs:mr-3 sm:mr-4"></span>
                  {getTranslatedCategory('Urban Infrastructure')}
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {!urbanInfrastructureProducts.length ? (
                    <>
                      <ProductCard
                        key="urban-gate-valve-fallback"
                        id="gate-valve"
                        title="Gate Valve"
                        description="Cast iron gate valves for water and wastewater control in distribution systems."
                        image={gateValve}
                        category="Urban Infrastructure"
                        link="/product?id=gate-valve"
                      />
                      <ProductCard
                        key="urban-fire-hydrant-fallback"
                        id="ground-fire-hydrant"
                        title="Ground Fire Hydrant"
                        description="Ground-level fire hydrants for emergency water access in urban environments."
                        image={groundFireHydrant}
                        category="Urban Infrastructure"
                        link="/product?id=ground-fire-hydrant"
                      />
                    </>
                  ) : (
                    urbanInfrastructureProducts.map((product, index) => (
                      <ProductCard
                        key={`urban-${product.id}-${index}`}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        image={product.image}
                        category={product.category}
                        link={product.link}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </AnimatedSection>
        
        {/* Quality Assurance */}
        <AnimatedSection className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
              <div className="lg:w-1/2 order-2 lg:order-1 mt-8 lg:mt-0">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <LazyImage
                    src={qualityAssurance} 
                    alt={t('products.qualityImageAlt', 'Quality assurance testing of industrial products')}
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                  {t('products.qualityAssurance', 'Quality Assurance')}
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-green-100 p-1.5 sm:p-2 rounded-full text-green-600 flex-shrink-0">
                      <Check size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-base sm:text-lg text-gray-700">
                      {t('products.qualityText1', 'All our products undergo rigorous quality checks to ensure they meet European standards for durability, safety, and performance.')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-green-100 p-1.5 sm:p-2 rounded-full text-green-600 flex-shrink-0">
                      <Check size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-base sm:text-lg text-gray-700">
                      {t('products.qualityText2', 'We collaborate with certified manufacturers who maintain strict quality control systems and provide comprehensive documentation for each product.')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-green-100 p-1.5 sm:p-2 rounded-full text-green-600 flex-shrink-0">
                      <Check size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-base sm:text-lg text-gray-700">
                      {t('products.qualityText3', 'Our commitment to quality extends beyond products to our services, ensuring timely delivery and professional support for all your infrastructure needs.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
      </div>
    </>
  );
}