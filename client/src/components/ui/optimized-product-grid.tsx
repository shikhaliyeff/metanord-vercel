import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from './product-card';
import { Button } from './button';
import { useTranslation } from 'react-i18next';
import { 
  preloadImages, 
  optimizeElementRendering, 
  createLazyLoader 
} from '@/lib/performance-optimizations';
import { getProductData } from '@/lib/optimized-product-loader';

interface OptimizedProductGridProps {
  productIds: string[];
  category?: string;
  imagesMap: Record<string, string>;
  className?: string;
}

/**
 * OptimizedProductGrid - A high-performance product grid with:
 * 1. Progressive loading for faster initial render
 * 2. Optimized image handling with preloading
 * 3. Smart caching and batch processing
 * 4. Reduced layout shifts
 */
export function OptimizedProductGrid({ 
  productIds,
  category = 'all',
  imagesMap,
  className = ''
}: OptimizedProductGridProps) {
  const { t, i18n } = useTranslation();
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedAll, setLoadedAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Filter products by category
  const filteredProductIds = category === 'all' 
    ? productIds 
    : productIds.filter(id => {
        if (category === 'aluminum' && id.includes('profiles')) return true;
        if (category === 'polyethylene' && id.includes('pipes') && !id.includes('hsaw') && !id.includes('oil-gas')) return true;
        if (category === 'steel' && (id.includes('hsaw') || id.includes('oil-gas'))) return true;
        if (category === 'cast-iron' && (id.includes('manhole') || id.includes('grates') || id.includes('grill'))) return true;
        return false;
      });
  
  // Create lazy loader for "load more" functionality
  const lazyLoader = useRef(createLazyLoader('100px'));
  
  // Preload critical images
  useEffect(() => {
    // Preload first batch with high priority
    const criticalImages = filteredProductIds.slice(0, 4).map(id => imagesMap[id]).filter(Boolean);
    preloadImages(criticalImages, true);
    
    // Preload remaining images with normal priority
    const remainingImages = filteredProductIds.slice(4).map(id => imagesMap[id]).filter(Boolean);
    preloadImages(remainingImages, false);
    
    // Set up content-visibility optimization for the grid
    if (gridRef.current) {
      gridRef.current.style.contentVisibility = 'auto';
      gridRef.current.style.containIntrinsicSize = '0 500px';
    }
    
    return () => {
      // Clean up observation when component unmounts
      if (loadMoreRef.current && lazyLoader.current.observerRef.current) {
        lazyLoader.current.observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [filteredProductIds, imagesMap]);
  
  // Load initial products
  useEffect(() => {
    setIsLoading(true);
    setVisibleProducts([]);
    setLoadedAll(false);
    
    // Define initial batch size - show more on desktop, fewer on mobile
    const isMobile = window.innerWidth < 768;
    const initialBatchSize = isMobile ? 4 : 8;
    
    // Load initial batch
    const initialBatch = filteredProductIds.slice(0, initialBatchSize).map(id => {
      const product = getProductData(id, i18n.language);
      return {
        ...product,
        image: imagesMap[id] || ''
      };
    });
    
    setVisibleProducts(initialBatch);
    setIsLoading(false);
    
    // If we've loaded all products, mark as complete
    if (initialBatchSize >= filteredProductIds.length) {
      setLoadedAll(true);
    }
    
    // Set up lazy loading for the "load more" trigger
    if (loadMoreRef.current && lazyLoader.current.observerRef.current) {
      lazyLoader.current.observe(loadMoreRef.current, loadNextBatch);
    }
  }, [category, i18n.language, filteredProductIds]);
  
  // Load more products when the user scrolls near the bottom
  const loadNextBatch = useCallback(() => {
    if (isLoading || loadedAll) return;
    
    setIsLoading(true);
    
    const currentlyLoaded = visibleProducts.length;
    const batchSize = 4; // Load 4 more products at a time
    
    // If there are no more products to load, mark as complete
    if (currentlyLoaded >= filteredProductIds.length) {
      setLoadedAll(true);
      setIsLoading(false);
      return;
    }
    
    // Load the next batch
    const nextBatch = filteredProductIds
      .slice(currentlyLoaded, currentlyLoaded + batchSize)
      .map(id => {
        const product = getProductData(id, i18n.language);
        return {
          ...product,
          image: imagesMap[id] || ''
        };
      });
    
    // Add the new products to the visible set
    setVisibleProducts(prev => [...prev, ...nextBatch]);
    setIsLoading(false);
    
    // If we've loaded all products, mark as complete
    if (currentlyLoaded + batchSize >= filteredProductIds.length) {
      setLoadedAll(true);
    }
  }, [visibleProducts.length, filteredProductIds, isLoading, loadedAll, i18n.language, imagesMap]);
  
  // Manual load more button handler
  const handleLoadMore = () => {
    loadNextBatch();
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Product grid with optimization */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
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
      </div>
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center mt-6">
          <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Load more trigger for intersection observer */}
      <div 
        ref={loadMoreRef}
        className="mt-8 flex justify-center"
      >
        {/* Load more button */}
        {!isLoading && !loadedAll && (
          <Button 
            onClick={handleLoadMore}
            variant="outline"
            className="px-6 py-2 bg-white/80 hover:bg-white text-primary hover:text-accent border border-primary/20 rounded-lg shadow-md"
          >
            {t("products.loadMore", "Load More Products")}
          </Button>
        )}
        
        {/* No products message */}
        {visibleProducts.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-4">
            {t("products.noProducts", "No products found in this category")}
          </div>
        )}
        
        {/* End of results message */}
        {loadedAll && visibleProducts.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            {t("products.endOfResults", "End of results")}
          </div>
        )}
      </div>
      
      {/* Add CSS for optimized animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .product-fade-in {
          opacity: 0;
          transform: translateY(10px);
          animation: productFadeIn 0.4s ease-out forwards;
        }
        
        @keyframes productFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .loading-spinner {
          border-color: #0959AB;
          border-top-color: transparent;
        }
      `}} />
    </div>
  );
}