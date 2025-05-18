import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { ProductCard } from '@/components/ui/product-card';
import { productDetailsMap, ProductDetails } from '@/data/product-data';
import { translateProductCategory } from '@/i18n';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchBar } from '@/components/ui/search-bar';
import { cn } from '@/lib/utils';

export default function SearchResults() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductDetails[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Extract query parameter on component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q') || '';
    setSearchQuery(query);
  }, [location]);
  
  // Perform search whenever the query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCategories([]);
      return;
    }
    
    // Get all products
    const allProducts = Object.values(productDetailsMap);
    
    // Filter products based on the search query (case insensitive)
    const lowerQuery = searchQuery.toLowerCase();
    const results = allProducts.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = product.description.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      
      // Also search in features and applications if available
      const featuresMatch = product.features?.some(
        feature => feature.toLowerCase().includes(lowerQuery)
      ) || false;
      
      const applicationsMatch = product.applications?.some(
        application => application.toLowerCase().includes(lowerQuery)
      ) || false;
      
      // Check specifications as well
      let specificationsMatch = false;
      if (product.specifications) {
        specificationsMatch = Object.values(product.specifications).some(
          value => value.toString().toLowerCase().includes(lowerQuery)
        );
      }
      
      return titleMatch || descriptionMatch || categoryMatch || 
             featuresMatch || applicationsMatch || specificationsMatch;
    });
    
    setSearchResults(results);
    
    // Extract unique categories from the results
    const uniqueCategories = Array.from(new Set(results.map(product => product.category)));
    setCategories(uniqueCategories);
    
    // Reset category filter when search changes
    setFilteredCategory(null);
  }, [searchQuery]);
  
  // Filter by category
  const filteredResults = filteredCategory 
    ? searchResults.filter(product => product.category === filteredCategory)
    : searchResults;
  
  // Handle category filter click
  const handleCategoryFilter = (category: string) => {
    setFilteredCategory(prevCategory => prevCategory === category ? null : category);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilteredCategory(null);
  };
  
  return (
    <main className="pt-8 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t('search.resultsFor', 'Search results for')} "{searchQuery}"
          </h1>
          
          <div className="mt-4 max-w-lg">
            <SearchBar placeholder={t("search.refineSearch", "Refine your search...")} />
          </div>
          
          <div className="mt-8 flex items-center flex-wrap gap-3">
            <span className="text-sm font-medium text-neutral-dark/80 mr-1">
              {t('search.filterByCategory', 'Filter by category:')}
            </span>
            
            {categories.map(category => (
              <Badge 
                key={category}
                variant={filteredCategory === category ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:bg-primary/10 transition-colors",
                  filteredCategory === category 
                    ? "bg-primary text-white" 
                    : "text-neutral-dark"
                )}
                onClick={() => handleCategoryFilter(category)}
              >
                {translateProductCategory(category)}
              </Badge>
            ))}
            
            {filteredCategory && (
              <Badge 
                variant="outline"
                className="cursor-pointer border-dashed border-red-400 text-red-500 hover:bg-red-50"
                onClick={clearFilters}
              >
                {t('search.clearFilters', 'Clear filters')}
              </Badge>
            )}
          </div>
        </div>
        
        <Separator className="mb-10" />
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-lg text-neutral-dark/70">
              {t('search.foundResults', {
                count: filteredResults.length,
                defaultValue: 'Found {{count}} result',
                defaultValue_plural: 'Found {{count}} results'
              })}
              {filteredCategory && (
                <span className="ml-1">
                  {t('search.inCategory', 'in category')} "{translateProductCategory(filteredCategory)}"
                </span>
              )}
            </p>
          </div>
        )}
        
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredResults.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                category={product.category}
                description={product.description}
                link={`/product?id=${product.id}`}
                features={product.features}
                applications={product.applications}
                specifications={product.specifications}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">
                {t('search.noResultsFound', 'No products found matching your search')}
              </h2>
              <p className="text-neutral-dark/70 mb-8">
                {t('search.tryDifferentTerms', 'Try searching with different terms or browse our product categories')}
              </p>
              <div className="flex justify-center">
                <a href="/products" className="text-primary hover:text-accent font-medium">
                  {t('search.browseAllProducts', 'Browse all products')}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}