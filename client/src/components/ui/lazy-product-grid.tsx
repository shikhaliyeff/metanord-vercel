import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from './product-card';
import { Button } from './button';
import { useTranslation } from 'react-i18next';
import { getProductData, loadProductsInBatches, getProductsByCategory } from '@/lib/optimized-product-loader';

interface LazyProductGridProps {
  productIds: string[];
  category?: string;
  imagesMap: Record<string, string>;
  className?: string;
}

/**
 * LazyProductGrid - A performance-optimized product grid with:
 * 1. True lazy loading using Intersection Observer
 * 2. Batch processing to prevent UI freezing
 * 3. "Load More" button instead of loading all products at once
 * 4. Optimized for mobile devices
 */
export function LazyProductGrid({ 
  productIds,
  category = 'all',
  imagesMap,
  className = ''
}: LazyProductGridProps) {
  const { t, i18n } = useTranslation();
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 6; // Show 6 products per page
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  
  // Pre-register images for all products
  useEffect(() => {
    Object.entries(imagesMap).forEach(([id, imageSrc]) => {
      // Preload image
      const img = new Image();
      img.src = imageSrc;
    });
  }, [imagesMap]);
  
  // Filter products by category
  const filteredProductIds = getProductsByCategory(category, productIds);
  
  // Load initial set of products
  useEffect(() => {
    setIsLoading(true);
    setVisibleProducts([]);
    setPage(1);
    
    // Get initial batch of products
    const initialIds = filteredProductIds.slice(0, productsPerPage);
    
    loadProductsInBatches(
      initialIds,
      i18n.language,
      3, // Batch size
      (batchProducts) => {
        // Add image to each product
        const productsWithImages = batchProducts.map(product => ({
          ...product,
          image: imagesMap[product.id] || ''
        }));
        
        setVisibleProducts(prev => [...prev, ...productsWithImages]);
        setIsLoading(false);
      }
    );
  }, [category, i18n.language, filteredProductIds]);
  
  // Setup intersection observer for "load more" functionality
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    // Cleanup previous observer
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }
    
    // Create new observer
    intersectionObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadMoreProducts();
      }
    }, {
      rootMargin: '100px', // Load more before user reaches the button
    });
    
    // Start observing
    intersectionObserver.current.observe(loadMoreRef.current);
    
    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [loadMoreRef, isLoading, page, filteredProductIds.length]);
  
  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (page * productsPerPage >= filteredProductIds.length) return;
    
    setIsLoading(true);
    
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * productsPerPage;
    const endIndex = nextPage * productsPerPage;
    const nextIds = filteredProductIds.slice(startIndex, endIndex);
    
    loadProductsInBatches(
      nextIds,
      i18n.language,
      3, // Batch size
      (batchProducts) => {
        // Add image to each product
        const productsWithImages = batchProducts.map(product => ({
          ...product,
          image: imagesMap[product.id] || ''
        }));
        
        setVisibleProducts(prev => [...prev, ...productsWithImages]);
        setIsLoading(false);
        setPage(nextPage);
      }
    );
  }, [page, productsPerPage, filteredProductIds, i18n.language, imagesMap]);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Product grid with fade-in effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visibleProducts.map((product, index) => (
          <div 
            key={`${product.id}-${i18n.language}`} 
            className="fade-in"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              animation: 'fadeIn 0.3s ease-in-out forwards'
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
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center mt-6">
          <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Load more section */}
      <div ref={loadMoreRef} className="mt-8 flex justify-center">
        {!isLoading && page * productsPerPage < filteredProductIds.length && (
          <Button 
            onClick={loadMoreProducts}
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
        {page * productsPerPage >= filteredProductIds.length && visibleProducts.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            {t("products.endOfResults", "End of results")}
          </div>
        )}
      </div>
      
      {/* Add CSS for fade-in animation */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        `}
      </style>
    </div>
  );
}