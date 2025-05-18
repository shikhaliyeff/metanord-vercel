import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  link: string;
  id: string;
}

// Optimized internal product card component
const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  category,
  link,
  id
}) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If image is already cached, it may have loaded before effect runs
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}
        <img
          ref={imageRef}
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>
        <div className="text-xs font-medium text-blue-500 uppercase mb-2">
          {t(`products.categories.${category}`, category)}
        </div>
      </div>
      <div className="p-4 pt-0">
        <a
          href={link}
          className="inline-block w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 text-center rounded transition-colors duration-200"
        >
          {t("common.viewDetails", "View Details")}
        </a>
      </div>
    </div>
  );
};

interface UnifiedProductGridProps {
  productIds: string[];
  category?: string;
  imagesMap: Record<string, string>;
  className?: string;
  getProductData: (id: string, lang: string) => any;
  getProductsByCategory: (category: string, allProductIds: string[]) => string[];
}

/**
 * UnifiedProductGrid - A high-performance, optimized product grid component
 * 
 * This component replaces multiple similar product grid implementations with a single,
 * optimized version that supports:
 * - Lazy loading with intersection observer
 * - Batch processing to prevent UI freezing
 * - Optimized image loading
 * - Caching of product data
 * - Category filtering
 */
export function UnifiedProductGrid({
  productIds,
  category = 'all',
  imagesMap,
  className = '',
  getProductData,
  getProductsByCategory
}: UnifiedProductGridProps) {
  const { t, i18n } = useTranslation();
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const productCache = useRef<Record<string, any>>({});
  
  // Products per page - show more on larger screens
  const productsPerPage = typeof window !== 'undefined' && window.innerWidth > 1024 ? 8 : 4;
  
  // Filter products by category
  const filteredProductIds = getProductsByCategory(category, productIds);
  
  // Preload critical product images
  useEffect(() => {
    // Preload first batch of images to improve perceived performance
    const initialIds = filteredProductIds.slice(0, productsPerPage);
    initialIds.forEach(id => {
      if (imagesMap[id]) {
        const img = new Image();
        img.src = imagesMap[id];
      }
    });
    
    // Apply content-visibility optimization for better rendering performance
    if (gridRef.current) {
      gridRef.current.style.contentVisibility = 'auto';
      gridRef.current.style.containIntrinsicSize = '0 1000px';
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredProductIds, imagesMap, productsPerPage]);
  
  // Load initial set of products and set up intersection observer
  useEffect(() => {
    setIsLoading(true);
    setVisibleProducts([]);
    setPage(1);
    
    // Load initial batch of products
    const initialIds = filteredProductIds.slice(0, productsPerPage);
    
    // Load products (use cache when available)
    const initialProducts = initialIds.map(id => {
      const cacheKey = `${id}-${i18n.language}`;
      
      if (!productCache.current[cacheKey]) {
        productCache.current[cacheKey] = getProductData(id, i18n.language);
      }
      
      return {
        ...productCache.current[cacheKey],
        image: imagesMap[id] || ''
      };
    });
    
    setVisibleProducts(initialProducts);
    setIsLoading(false);
    
    // Setup intersection observer for "load more" functionality
    if (loadMoreRef.current) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreProducts();
        }
      }, {
        rootMargin: '200px', // Start loading before user reaches the button
      });
      
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [category, i18n.language, filteredProductIds, getProductData]);
  
  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (page * productsPerPage >= filteredProductIds.length || isLoading) return;
    
    setIsLoading(true);
    
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = nextPage * productsPerPage;
    const nextIds = filteredProductIds.slice(startIndex, endIndex);
    
    // Process products in a small batch to prevent UI blocking
    setTimeout(() => {
      const nextProducts = nextIds.map(id => {
        const cacheKey = `${id}-${i18n.language}`;
        
        if (!productCache.current[cacheKey]) {
          productCache.current[cacheKey] = getProductData(id, i18n.language);
        }
        
        return {
          ...productCache.current[cacheKey],
          image: imagesMap[id] || ''
        };
      });
      
      setVisibleProducts(prev => [...prev, ...nextProducts]);
      setPage(nextPage);
      setIsLoading(false);
    }, 100);
  }, [page, productsPerPage, filteredProductIds, isLoading, i18n.language, getProductData, imagesMap]);
  
  return (
    <div className={`w-full ${className}`} ref={gridRef}>
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {visibleProducts.map((product, index) => (
          <div 
            key={`${product.id}-${i18n.language}-${index}`} 
            className="product-fade-in"
            style={{
              animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
            }}
          >
            <ProductCard
              image={product.image}
              title={product.title}
              description={product.description}
              category={product.category}
              link={`/product?id=${product.id}`}
              id={product.id}
            />
          </div>
        ))}
        
        {/* Skeleton placeholder while loading initial view */}
        {visibleProducts.length === 0 && isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
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
        )}
      </div>
      
      {/* Loading indicator */}
      {isLoading && visibleProducts.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Load more section */}
      <div ref={loadMoreRef} className="mt-8 flex justify-center">
        {!isLoading && visibleProducts.length > 0 && page * productsPerPage < filteredProductIds.length && (
          <Button 
            onClick={loadMoreProducts}
            variant="outline"
            className="px-6 py-2 bg-white/80 hover:bg-white text-primary hover:text-accent border border-primary/20 rounded-lg shadow-md"
          >
            {t("products.loadMore", "Load More Products")}
          </Button>
        )}
        
        {/* Empty state */}
        {visibleProducts.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-4">
            {t("products.noProducts", "No products found in this category")}
          </div>
        )}
        
        {/* End of results message */}
        {visibleProducts.length > 0 && page * productsPerPage >= filteredProductIds.length && (
          <div className="text-center text-gray-500 py-4">
            {t("products.endOfResults", "End of results")}
          </div>
        )}
      </div>
    </div>
  );
}