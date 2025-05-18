import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { translateProductCategory } from "@/i18n";
import { getProductDetails, sanitizeSpecifications } from "@/data/product-data";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown, Search, Filter, SplitSquareHorizontal, Info, Layers, X, Check } from "lucide-react";
import { ProductComparison } from "@/components/ui/product-comparison";
import { useMediaQuery } from "@/hooks";

// Import aluminum profile images from attached_assets (re-uploaded versions)
import standardProfiles from '@assets/Aluminum U-Profiles.jpg';
import machineProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';

// Import assets from attached_assets folder
import hdpePipes from "@assets/HDPE pipes (PE pipes) .png";
import doubleCorrugatedPipes from "@assets/Double corrugated pipes .png";
import steelReinforcedPipe from "@assets/Steel reinforced corrugated polyethilene pipe.png";
import elbow90 from "@assets/Elbow 90° (Injection) fitting .png";
import elbow45 from "@assets/Elbow 45° (Injection) fitting .png";
import equalTee from "@assets/Equal TEE 90° (Injection) fitting .png";

import hsawPilesWater from "@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png";
import steelPipesOilGas from "@assets/Steel Pipes For Oil and Gas Purpose .png";
import hsawPilesPurpose from "@assets/Helical Submerged Arc Welded (HSAW) Pipes For Pile Purpose.png";

import manholeD400K from "@assets/Manhole cover D400(K) .png";
import rainwaterGrillD400 from "@assets/Rainwater grill D400 1 .png";
import groundFireHydrant from "@assets/Ground fire hydrant .png";
import gateValve from "@assets/Gate valve cast iron DN50-500, PN10-16 .png";

export function ProductsSection() {
  const { t, i18n } = useTranslation();
  
  // We're using images from the attached_assets folder for all products
  const aluminumProducts = [
    {
      id: "standard-profiles",
      image: standardProfiles, // Using the aluminum u-profiles image
      title: t("products.aluminum.structuralProfiles.title", "Standard Profiles"),
      description: t("products.aluminum.structuralProfiles.description", "Versatile aluminum profiles for various construction, engineering, and design applications with diverse shapes and sizes."),
      category: translateProductCategory("aluminum"),
      link: "/product?id=standard-profiles",
      features: [
        "High tensile strength",
        "Excellent load-bearing capacity",
        "Corrosion resistant",
        "Lightweight compared to steel alternatives",
        "Various finishing options available"
      ],
      applications: [
        "Commercial building frames",
        "Residential construction",
        "Industrial facilities",
        "Infrastructure projects",
        "Support structures"
      ],
      specifications: {
        "Material": "High-grade aluminum alloys",
        "Alloy Types": "6000 series (6061, 6063, 6082)",
        "Finishing": "Mill finish, anodized, or powder coated",
        "Length": "Standard 6m or custom cut",
        "Design": "According to EN standards"
      }
    },
    {
      id: "machine-building-profiles",
      image: machineProfiles, // Using the aluminum t-profiles image
      title: t("products.aluminum.architecturalProfiles.title", "Machine Building Profiles"),
      description: t("products.aluminum.architecturalProfiles.description", "Specialized aluminum profiles for industrial equipment and machinery construction with emphasis on precision and durability."),
      category: translateProductCategory("aluminum"),
      link: "/product?id=machine-building-profiles",
      features: [
        "Precision engineering",
        "T-slot compatibility",
        "High structural integrity",
        "Versatile connectivity",
        "Modular design system"
      ],
      applications: [
        "Industrial automation",
        "Manufacturing equipment",
        "Protective enclosures",
        "Robotic frameworks",
        "Conveyor systems"
      ],
      specifications: {
        "Material": "Aluminum alloy EN AW-6060, EN AW-6063",
        "Alloy Temper": "T5, T6",
        "Surface Finish": "Natural, anodized 10μm",
        "Standard Length": "6000 mm (±10 mm)",
        "Special Features": "T-slot system, modular compatibility"
      }
    },
    {
      id: "led-profiles",
      image: ledProfiles, // Using the aluminum LED profile image
      title: t("products.aluminum.industrialProfiles.title", "LED Profiles"),
      description: t("products.aluminum.industrialProfiles.description", "Specialized aluminum profiles designed for LED lighting installations with optimized heat dissipation and diffusion characteristics."),
      category: translateProductCategory("aluminum"),
      link: "/product?id=led-profiles",
      features: [
        "Efficient heat dissipation",
        "Light diffusion capabilities",
        "Hidden mounting options",
        "Aesthetic finishing",
        "Cut-to-size availability"
      ],
      applications: [
        "Interior lighting",
        "Architectural illumination",
        "Display showcase lighting",
        "Cabinet and furniture lighting",
        "Commercial space lighting"
      ],
      specifications: {
        "Material": "Aluminum alloy EN AW-6060, EN AW-6063",
        "Surface Finish": "Anodized (silver, black, white, custom)",
        "LED Compatibility": "Strip LEDs up to 20mm width",
        "Diffuser Options": "Clear, frosted, opal",
        "Mounting": "Surface, recessed, suspended, corner"
      }
    },
    {
      id: "special-profiles",
      image: specialProfiles, // Using the aluminum special profiles image
      title: t("products.aluminum.customExtrusions.title", "Special Profiles"),
      description: t("products.aluminum.customExtrusions.description", "Custom-designed aluminum profiles for specialized applications with unique geometries and performance characteristics."),
      category: translateProductCategory("aluminum"),
      link: "/product?id=special-profiles",
      features: [
        "Complex geometries",
        "Specialized surface treatments",
        "Custom-engineered solutions",
        "Integrated functional elements",
        "High-performance alloys"
      ],
      applications: [
        "Transportation industry",
        "Specialized building systems",
        "Automotive components",
        "Medical equipment",
        "Defense and aerospace"
      ],
      specifications: {
        "Material": "Aluminum alloy EN AW-6060, EN AW-6063, EN AW-6082",
        "Surface Finish": "Custom finishes available",
        "Design Service": "Full technical support and consultation",
        "Minimum Order": "Variable based on complexity",
        "Special Features": "Custom geometries, complex cross-sections"
      }
    }
  ];

  // Polyethylene Products with actual images
  const polyethyleneProducts = [
    {
      id: "hdpe-pipes",
      image: hdpePipes,
      title: t("products.polyethylene.hdpePipes.title", "HDPE Pipes"),
      description: t("products.polyethylene.hdpePipes.description", "High-density polyethylene pipes for water supply, gas, and sewage systems with excellent durability."),
      category: translateProductCategory("polyethylene"),
      link: "/products#polyethylene",
      features: [
        "Excellent chemical resistance",
        "Long service life (50+ years)",
        "High pressure rating",
        "Flexible and lightweight",
        "Corrosion and rot resistant"
      ],
      applications: [
        "Potable water distribution",
        "Gas supply systems",
        "Industrial fluid transport",
        "Wastewater systems",
        "Irrigation networks"
      ],
      specifications: {
        "Material": "High-density polyethylene PE100",
        "Pressure Rating": "PN10, PN16, PN25",
        "Diameter Range": "20mm to 1200mm",
        "Standard Length": "6m or 12m (coils available for smaller diameters)",
        "Connection": "Butt fusion, electrofusion, or mechanical fittings"
      }
    },
    {
      id: "double-corrugated-pipes",
      image: doubleCorrugatedPipes,
      title: t("products.polyethylene.doubleCorrugatedPipes.title", "Double-Wall Corrugated Pipes"),
      description: t("products.polyethylene.doubleCorrugatedPipes.description", "Double-wall HDPE pipes with smooth interior and corrugated exterior for drainage and sewage systems."),
      category: translateProductCategory("polyethylene"),
      link: "/products#polyethylene",
      features: [
        "Double wall construction for strength",
        "High ring stiffness",
        "Excellent flow characteristics",
        "Lightweight and easy to install",
        "Chemical and abrasion resistant"
      ],
      applications: [
        "Stormwater drainage",
        "Gravity sewers",
        "Highway drainage systems",
        "Land drainage",
        "Cable protection"
      ],
      specifications: {
        "Material": "High-density polyethylene",
        "Ring Stiffness": "SN4, SN8, SN16",
        "Diameter Range": "100mm to 1200mm",
        "Wall Type": "Double-wall (smooth interior, corrugated exterior)",
        "Connection": "Bell and spigot with rubber seal"
      }
    },
    {
      id: "reinforced-corrugated-pipes",
      image: steelReinforcedPipe,
      title: t("products.polyethylene.reinforcedPipes.title", "Steel-Reinforced PE Pipes"),
      description: t("products.polyethylene.reinforcedPipes.description", "Steel-reinforced polyethylene pipes for extreme load applications with superior structural integrity."),
      category: t("products.categories.polyethylene"),
      link: "/products#polyethylene",
      features: [
        "Steel reinforcement for exceptional strength",
        "Very high load-bearing capacity",
        "Excellent resistance to deformation",
        "Suitable for high traffic areas",
        "Long service life in demanding conditions"
      ],
      applications: [
        "Railway infrastructure",
        "Highway culverts",
        "Heavy traffic areas",
        "Deep burial installations",
        "High groundwater table areas"
      ],
      specifications: {
        "Material": "HDPE with steel reinforcement",
        "Ring Stiffness": "SN16, SN24, SN32",
        "Diameter Range": "300mm to 2000mm",
        "Steel Type": "Galvanized steel reinforcement",
        "Installation Depth": "Up to 15m depending on conditions"
      }
    }
  ];
  
  // Steel Products with actual images
  const steelProducts = [
    {
      id: "hsaw-pipes",
      image: hsawPilesWater,
      title: t("products.steel.hsawPipes.title", "HSAW Steel Pipes"),
      description: t("products.steel.hsawPipes.description", "Helical submerged arc welded steel pipes for water transmission with excellent pressure resistance."),
      category: translateProductCategory("steel"),
      link: "/products#steel",
      features: [
        "Excellent strength-to-weight ratio",
        "High pressure resistance",
        "Superior weld integrity",
        "Factory applied protective coatings",
        "Long-span capability"
      ],
      applications: [
        "Water transmission pipelines",
        "Industrial water systems",
        "Municipal infrastructure",
        "Irrigation main lines",
        "Hydropower penstocks"
      ],
      specifications: {
        "Material": "Carbon steel (S275-S355)",
        "Diameter Range": "400mm to 3000mm",
        "Wall Thickness": "5mm to 25mm",
        "Coating": "Epoxy, polyethylene, or cement mortar lined",
        "Standard": "EN 10224, AWWA C200"
      }
    },
    {
      id: "oil-gas-pipes",
      image: steelPipesOilGas,
      title: t("products.steel.oilGasPipes.title", "Oil & Gas Pipes"),
      description: t("products.steel.oilGasPipes.description", "High-grade steel pipes for oil and gas transportation with specialized coatings and stringent quality testing."),
      category: translateProductCategory("steel"),
      link: "/products#steel",
      features: [
        "High-pressure rated",
        "Corrosion resistant coatings",
        "Specialized steel grades",
        "Stringent quality testing",
        "Certified for hydrocarbon transport"
      ],
      applications: [
        "Oil transportation",
        "Natural gas pipelines",
        "Refinery infrastructure",
        "Offshore platforms",
        "Terminal connections"
      ],
      specifications: {
        "Material": "API 5L Grade X42-X70",
        "Diameter Range": "100mm to 1200mm",
        "Wall Thickness": "6mm to 20mm",
        "Coating": "FBE, 3LPE, or specialized corrosion protection",
        "Standard": "API 5L, ISO 3183"
      }
    }
  ];
  
  // Cast Iron Products with actual images
  const castIronProducts = [
    {
      id: "manhole-covers",
      image: manholeD400K,
      title: t("products.castIron.manholeCovers.title", "Manhole Covers"),
      description: t("products.castIron.manholeCovers.description", "Heavy-duty cast iron manhole covers with various load ratings for urban infrastructure and utilities access."),
      category: translateProductCategory("cast-iron"),
      link: "/products#cast-iron",
      features: [
        "High load capacity",
        "Durable cast iron construction",
        "Various traffic classifications",
        "Anti-slip surface patterns",
        "Anti-theft design options"
      ],
      applications: [
        "Road infrastructure",
        "Pedestrian areas",
        "Water and sewage networks",
        "Telecommunications access",
        "Electrical utility access"
      ],
      specifications: {
        "Material": "Ductile iron EN-GJS-500-7",
        "Load Class": "A15 to F900 per EN 124",
        "Diameter Range": "600mm to 900mm",
        "Frame Height": "100mm to 150mm",
        "Coating": "Black bituminous paint or epoxy coating"
      }
    },
    {
      id: "drainage-grates",
      image: rainwaterGrillD400,
      title: t("products.castIron.drainageGrates.title", "Drainage Grates"),
      description: t("products.castIron.drainageGrates.description", "Cast iron drainage grates for stormwater collection systems, designed for varying traffic loads and flow capacities."),
      category: translateProductCategory("cast-iron"),
      link: "/products#cast-iron",
      features: [
        "High hydraulic efficiency",
        "Various load class options",
        "Anti-clogging design",
        "Secure installation features",
        "Custom dimensions available"
      ],
      applications: [
        "Street drainage",
        "Parking areas",
        "Industrial facilities",
        "Landscaped areas",
        "Highway systems"
      ],
      specifications: {
        "Material": "Ductile iron EN-GJS-500-7",
        "Load Class": "C250 to F900 per EN 124",
        "Standard Sizes": "300x300mm to 1000x500mm",
        "Slot Configuration": "Multiple designs for different flow rates",
        "Installation": "Integrated frame or separate frame options"
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // State for category filtering
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  // State for tablet-specific product comparison feature
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  
  // Helper functions for product comparison
  const toggleProductComparison = (product: any) => {
    if (!isTablet) return; // Only works on tablets
    
    if (selectedForComparison.some(p => p.id === product.id)) {
      // Remove product if already selected
      setSelectedForComparison(prev => prev.filter(p => p.id !== product.id));
    } else {
      // Add product if not at max capacity (3)
      if (selectedForComparison.length < 3) {
        setSelectedForComparison(prev => [...prev, product]);
      } else {
        // Optional: Show a notification that only 3 products can be compared
        console.log("Maximum 3 products can be compared");
      }
    }
  };
  
  const isProductSelected = (productId: string): boolean => {
    return selectedForComparison.some(p => p.id === productId);
  };
  
  const startComparison = () => {
    if (selectedForComparison.length > 0) {
      setCompareMode(true);
    }
  };
  
  const exitComparison = () => {
    setCompareMode(false);
  };
  
  const clearSelectedProducts = () => {
    setSelectedForComparison([]);
  };
  
  // Combine all products with proper type identifiers
  // Aluminum products are intentionally placed first to prioritize them in display order
  const allProducts = [
    ...aluminumProducts.map(p => ({ ...p, type: "aluminum" })),
    ...polyethyleneProducts.map(p => ({ ...p, type: "polyethylene" })),
    ...steelProducts.map(p => ({ ...p, type: "steel" })),
    ...castIronProducts.map(p => ({ ...p, type: "cast-iron" }))
  ];
  
  // Define filter categories - Aluminum is positioned second after "All" to match the request
  const filterCategories = [
    { id: "all", label: t("products.filters.all", "All Products") },
    { id: "aluminum", label: t("products.filters.aluminum", "Aluminum") },
    { id: "polyethylene", label: t("products.filters.polyethylene", "Polyethylene") },
    { id: "steel", label: t("products.filters.steel", "Steel") },
    { id: "cast-iron", label: t("products.filters.cast_iron", "Cast Iron") }
  ];
  
  // Initialize filtered products on component mount only
  useEffect(() => {
    setFilteredProducts(allProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filter products based on active category and search query
  useEffect(() => {
    // Log initial state for debugging
    console.log(`Starting filtering with category: ${activeCategory}, language: ${i18n.language}`);
    console.log(`Total available products: ${allProducts.length}`);
    
    // Get product types using reduce to avoid Set compatibility issues
    const uniqueTypes: string[] = allProducts.reduce((acc: string[], product) => {
      if (!acc.includes(product.type)) {
        acc.push(product.type);
      }
      return acc;
    }, []);
    console.log(`Available product types:`, uniqueTypes);
    
    let filtered = [...allProducts]; // Create a copy to avoid reference issues
    
    // Filter by category
    if (activeCategory !== "all") {
      console.log(`Filtering by category: ${activeCategory}`);
      
      // Log all product types before filtering
      const productTypes = filtered.map(p => p.type);
      console.log(`Product types before filtering:`, productTypes);
      console.log(`Product count by type before filtering:`, 
        productTypes.reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
      
      // Enhanced filtering with more robust type matching
      filtered = filtered.filter(product => {
        if (!product || !product.type) return false;
        
        // Handle various formats with more comprehensive matching
        const productType = String(product.type).toLowerCase().trim();
        const categoryToMatch = activeCategory.toLowerCase().trim();
        
        // Debug the current product being checked
        console.log(`Comparing product type: "${productType}" with category: "${categoryToMatch}"`);
        
        // More comprehensive matching for all type variations
        // Replace all hyphens and underscores globally (not just the first one)
        const normalizedProductType = productType.replace(/-/g, '').replace(/_/g, '');
        const normalizedCategory = categoryToMatch.replace(/-/g, '').replace(/_/g, '');
        
        // Check for direct match first, then normalized versions
        const isMatch = 
          productType === categoryToMatch || 
          productType.replace(/-/g, '_') === categoryToMatch ||
          categoryToMatch.replace(/-/g, '_') === productType ||
          normalizedProductType === normalizedCategory ||
          // Handle special case for cast-iron/cast_iron/castiron
          (categoryToMatch.includes('cast') && productType.includes('cast')) ||
          // Handle special case for variations of steel
          (categoryToMatch === 'steel' && normalizedProductType === 'steel');
        
        if (isMatch) {
          console.log(`✓ Match found: ${product.title} (${productType}) matches ${categoryToMatch}`);
        }
        
        return isMatch;
      });
      
      // Debug filter matches
      console.log(`Products of type ${activeCategory} after filtering:`, 
        filtered.length > 0 ? filtered.map(p => p.title) : 'No products found for this category');
    }
    
    // Filter by search query if present
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      console.log(`Filtering by search query: "${query}"`);
      
      const beforeCount = filtered.length;
      filtered = filtered.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        return titleMatch || descMatch;
      });
      
      console.log(`Search filtered ${beforeCount} → ${filtered.length} products`);
    }
    
    // Update state with filtered products
    setFilteredProducts(filtered);
    
    // Debug information
    console.log(`Filtering products: active category = ${activeCategory}`);
    console.log(`Products filtered: ${filtered.length} items`);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, i18n.language]);

  return (
    <section id="products" className="py-10 xs:py-14 sm:py-16 md:py-20 bg-white relative">
      {/* Tablet-specific comparison component */}
      {isTablet && compareMode && (
        <div className="fixed inset-0 z-50 bg-white">
          <ProductComparison
            products={selectedForComparison}
            onClose={exitComparison}
            maxProducts={3}
            onAddProduct={() => setCompareMode(false)}
          />
        </div>
      )}
      
      {/* Tablet-specific comparison floating action button */}
      {isTablet && selectedForComparison.length > 0 && !compareMode && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white shadow-lg px-3 py-2 rounded-full text-xs font-medium border border-primary/20">
              {t("comparison.productsSelected", "{{count}} products selected", {count: selectedForComparison.length})}
            </div>
            
            <div className="flex gap-2">
              <button
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-colors border border-primary/20"
                onClick={clearSelectedProducts}
                aria-label="Clear comparison"
              >
                <X className="w-5 h-5" />
              </button>
              
              <button
                className="w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                onClick={startComparison}
                aria-label="Compare products"
              >
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6">
        <div className="text-center mb-8 xs:mb-10 sm:mb-12">
          <motion.h2 
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-inter font-bold mb-3 xs:mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Direct translations with appropriate fallbacks */}
            <span>{i18n.language === 'lt' ? 'Mūsų' : t("products.title", "Our")}</span>
            <span className="text-primary font-bold ml-1 xs:ml-2">{i18n.language === 'lt' ? 'Katalogas' : t("products.titleHighlight", "Catalog")}</span>
          </motion.h2>
          <motion.p 
            className="text-sm xs:text-base sm:text-lg text-neutral-dark max-w-3xl mx-auto font-roboto mb-4 xs:mb-6 sm:mb-8 px-1 xs:px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("products.description", "MetaNord OÜ offers a wide range of high-quality infrastructure and industrial products sourced from European manufacturers, meeting the highest industry standards.")}
          </motion.p>
          
          {/* Mobile-friendly filter section */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4">
              <button
                onClick={() => setActiveCategory("all")}
                className={`relative group py-1.5 px-3 xs:py-2 xs:px-4 sm:py-2 sm:px-5 rounded-full text-xs xs:text-sm sm:text-base 
                  font-medium transition-all duration-300 touch-manipulation active:scale-95
                  ${activeCategory === "all" 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/80 text-neutral-dark hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t("products.filter.all", "All Products")}
              </button>
              <button
                onClick={() => setActiveCategory("aluminum")}
                className={`relative group py-1.5 px-3 xs:py-2 xs:px-4 sm:py-2 sm:px-5 rounded-full text-xs xs:text-sm sm:text-base 
                  font-medium transition-all duration-300 touch-manipulation active:scale-95
                  ${activeCategory === "aluminum" 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/80 text-neutral-dark hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t("products.filter.aluminum", "Aluminum")}
              </button>
              <button
                onClick={() => setActiveCategory("polyethylene")}
                className={`relative group py-1.5 px-3 xs:py-2 xs:px-4 sm:py-2 sm:px-5 rounded-full text-xs xs:text-sm sm:text-base 
                  font-medium transition-all duration-300 touch-manipulation active:scale-95
                  ${activeCategory === "polyethylene" 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/80 text-neutral-dark hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t("products.filter.polyethylene", "Polyethylene")}
              </button>
              <button
                onClick={() => setActiveCategory("steel")}
                className={`relative group py-1.5 px-3 xs:py-2 xs:px-4 sm:py-2 sm:px-5 rounded-full text-xs xs:text-sm sm:text-base 
                  font-medium transition-all duration-300 touch-manipulation active:scale-95
                  ${activeCategory === "steel" 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/80 text-neutral-dark hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t("products.filter.steel", "Steel")}
              </button>
              <button
                onClick={() => setActiveCategory("cast-iron")}
                className={`relative group py-1.5 px-3 xs:py-2 xs:px-4 sm:py-2 sm:px-5 rounded-full text-xs xs:text-sm sm:text-base 
                  font-medium transition-all duration-300 touch-manipulation active:scale-95
                  ${activeCategory === "cast-iron" 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/80 text-neutral-dark hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {t("products.filter.castIron", "Cast Iron")}
              </button>
            </div>
            
            {/* Mobile search input */}
            <div className="mt-4 sm:mt-6 max-w-md mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("products.search_placeholder", "Search products...")}
                  className="w-full py-2 px-4 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid with filtered products - mobile optimized */}
        <div className="mb-6 xs:mb-8 sm:mb-12 md:mb-16">
          <motion.div 
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredProducts.map((product, index) => {
              // Get translated product details when available
              const translatedProduct = product.id ? 
                getProductDetails(product.id, i18n.language) || product : 
                product;
              
              // Ensure we have all required fields with proper fallbacks
              const safeProduct = {
                ...product,
                ...translatedProduct,
                id: translatedProduct.id || product.id,
                title: translatedProduct.title || product.title,
                description: translatedProduct.description || product.description,
                image: translatedProduct.image || product.image,
                category: translatedProduct.category || product.category || translateProductCategory(product.type || "product"),
                features: translatedProduct.features || product.features || [],
                applications: translatedProduct.applications || product.applications || [],
                specifications: sanitizeSpecifications(translatedProduct.specifications || product.specifications || {}),
                link: translatedProduct.link || product.link
              };
                
              return (
                <motion.div 
                  key={safeProduct.id || index} 
                  variants={itemVariants}
                  className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg active:shadow-sm hover:translate-y-[-2px] active:translate-y-[1px] transition-all duration-300 relative touch-manipulation"
                >
                  {/* Tablet-specific comparison checkbox for product cards */}
                  {isTablet && (
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleProductComparison(safeProduct);
                        }}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center text-sm ${
                          isProductSelected(safeProduct.id) 
                            ? "bg-primary text-white" 
                            : "bg-white/80 text-gray-600 hover:bg-gray-100"
                        }`}
                        aria-label={isProductSelected(safeProduct.id) ? "Remove from comparison" : "Add to comparison"}
                      >
                        {isProductSelected(safeProduct.id) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <Layers className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  <ProductCard
                    id={safeProduct.id}
                    image={safeProduct.image}
                    title={safeProduct.title}
                    description={safeProduct.description}
                    category={safeProduct.category}
                    link={safeProduct.link}
                    features={safeProduct.features}
                    applications={safeProduct.applications}
                    specifications={safeProduct.specifications}
                    className="h-full"
                  />
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* No products message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-10 max-w-xl mx-auto rounded-lg border border-white/30 backdrop-blur-md shadow-soft"
              >
                <h3 className="text-2xl text-gradient-blue font-semibold mb-4">
                  {t("products.no_results", "No products found for the selected category or search.")}
                </h3>
                <p className="text-gray-700 mb-8 font-roboto">
                  {t("products.try_different", "Please try a different search term or category.")}
                </p>
                <Button 
                  className="btn-gradient text-white hover-lift hover-glow shadow-lg px-8 py-3 rounded-full border border-white/30 font-medium"
                  onClick={() => {
                    console.log("Resetting filters to show all products");
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                >
                  {t("products.view_all", "View All Products")}
                </Button>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Enhanced Contact button section - Mobile optimized */}
        <div className="mt-10 xs:mt-16 sm:mt-20 md:mt-24 py-8 xs:py-10 sm:py-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl sm:rounded-2xl shadow-inner border border-primary/10">
          <div className="text-center max-w-2xl mx-auto px-3 xs:px-4">
            <h3 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold mb-3 xs:mb-4 sm:mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {t("products.need_assistance", "Need Assistance With Your Project?")}
            </h3>
            <p className="text-sm xs:text-base sm:text-lg mb-5 xs:mb-6 sm:mb-8 text-neutral-dark">
              {t("products.contact_subtext", "Get in touch for custom solutions and personalized quotes for your infrastructure needs")}
            </p>
            <Link to="/contact">
              <Button 
                className="btn-gradient text-white px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-4 md:py-5 font-bold rounded-lg shadow-xl hover-lift text-sm xs:text-base sm:text-lg"
              >
                {t("header.requestQuote", "Request Quote")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
