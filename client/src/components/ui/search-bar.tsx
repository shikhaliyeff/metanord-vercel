import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { productDetailsMap, ProductDetails } from '@/data/product-data';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

// Maximum number of recent searches to store
const MAX_RECENT_SEARCHES = 5;

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearchClick?: () => void;
  iconOnly?: boolean;
}

export function SearchBar({ className, placeholder, onSearchClick, iconOnly = false }: SearchBarProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<ProductDetails[]>([]);
  // Use the second value from useLocation for navigation
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('metanord-recent-searches');
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        // Reset if there's an error parsing
        localStorage.setItem('metanord-recent-searches', JSON.stringify([]));
        setRecentSearches([]);
      }
    }
  }, []);
  
  // For icon-only mode, we need to track if the full search is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle clicks outside to close the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (iconOnly) {
          setIsExpanded(false);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [iconOnly]);
  
  // Update search results when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Get all products from the map
    const allProducts = Object.values(productDetailsMap);
    
    // Filter products based on the search query (case insensitive)
    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter(product => {
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
      
      return titleMatch || descriptionMatch || categoryMatch || featuresMatch || applicationsMatch;
    });
    
    // Limit the number of results
    setSearchResults(filtered.slice(0, 5));
  }, [query]);
  
  // Add to recent searches and navigate to search results
  const handleSearch = (searchText: string = query) => {
    if (searchText.trim() === '') return;
    
    // Add to recent searches
    const newRecentSearches = [
      searchText, 
      ...recentSearches.filter(s => s !== searchText)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('metanord-recent-searches', JSON.stringify(newRecentSearches));
    
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
    
    // Close dropdown and clear input
    setIsOpen(false);
    setQuery('');
    
    // Call the parent's callback if provided
    if (onSearchClick) onSearchClick();
  };
  
  // Remove a recent search
  const removeRecentSearch = (searchText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecentSearches = recentSearches.filter(s => s !== searchText);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('metanord-recent-searches', JSON.stringify(newRecentSearches));
  };
  
  // Navigate to a product page
  const navigateToProduct = (productId: string) => {
    navigate(`/product?id=${encodeURIComponent(productId)}`);
    setIsOpen(false);
    setQuery('');
  };
  
  // Get the translatable placeholder
  const searchPlaceholder = placeholder || t('search.placeholder', 'Search products...');
  
  return (
    <div className={cn("relative", className)} ref={searchRef}>
      {/* Search Input */}
      {iconOnly ? (
        <div className="relative">
          <button 
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors text-neutral-dark/80 hover:text-primary"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={t('navigation.search')}
          >
            <Search size={18} />
          </button>
          
          {/* Expanded search input */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "240px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-0"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-neutral-dark/60">
                    <Search size={14} />
                  </div>
                  
                  <input
                    type="text"
                    className="w-full py-2 pl-9 pr-8 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary bg-white/90 backdrop-blur-sm"
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      } else if (e.key === 'Escape') {
                        setIsExpanded(false);
                        setIsOpen(false);
                      }
                    }}
                  />
                  
                  {query ? (
                    <button 
                      className="absolute right-3 text-neutral-dark/60 hover:text-primary transition-colors"
                      onClick={() => {
                        setQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <button 
                      className="absolute right-3 text-neutral-dark/60 hover:text-primary transition-colors"
                      onClick={() => {
                        setIsExpanded(false);
                        setIsOpen(false);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="relative flex items-center">
          <div className="absolute left-2.5 text-neutral-dark/60">
            <Search size={14} />
          </div>
          
          <input
            type="text"
            className="w-full py-1.5 pl-8 pr-8 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all bg-white/90 backdrop-blur-sm"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          
          {query && (
            <button 
              className="absolute right-2.5 text-neutral-dark/60 hover:text-primary transition-colors"
              onClick={() => {
                setQuery('');
                setSearchResults([]);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      
      {/* Search Results Dropdown */}
      <AnimatePresence>
        {(isOpen || isExpanded) && (query.trim() !== '' || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-lg shadow-lg z-50 max-h-[350px] overflow-y-auto overflow-x-hidden border border-gray-100"
            style={{ 
              minWidth: '280px',
              maxWidth: 'calc(100vw - 32px)'
            }}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-dark/90 flex items-center border-b border-gray-100 mb-1">
                  <Clock size={12} className="mr-1.5 text-accent" />
                  {t('search.recentSearches', 'Recent Searches')}
                </div>
                
                {recentSearches.map((searchText, index) => (
                  <div
                    key={`recent-search-${index}-${searchText.substring(0, 10)}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleSearch(searchText)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock size={16} className="text-neutral-dark/50 flex-shrink-0" />
                      <span className="text-sm truncate">{searchText}</span>
                    </div>
                    
                    <button 
                      className="p-1 text-neutral-dark/50 hover:text-primary hover:bg-neutral-100/50 rounded-full flex-shrink-0 ml-2"
                      onClick={(e) => removeRecentSearch(searchText, e)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {recentSearches.length > 0 && searchResults.length > 0 && (
                  <div className="border-t border-gray-100 my-1"></div>
                )}
              </div>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1.5 text-sm font-medium text-neutral-dark/90 flex items-center border-b border-gray-100 mb-1">
                  <Search size={12} className="mr-1.5 text-primary" />
                  {t('search.searchResults', 'Search Results')}
                </div>
                
                {searchResults.map((product, index) => (
                  <div
                    key={`search-result-${product.title}-${index}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-neutral-50 cursor-pointer"
                    onClick={() => navigateToProduct(product.id)}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-white flex-shrink-0 border border-gray-100 flex items-center justify-center">
                      <img 
                        src={product.image}
                        alt={product.title}
                        className="object-contain w-10 h-10"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0 overflow-hidden pr-2">
                      <div className="text-sm font-medium truncate">{product.title}</div>
                      <div className="text-xs text-neutral-dark/60 line-clamp-2 overflow-hidden">
                        {product.description.substring(0, 60)}
                        {product.description.length > 60 ? '...' : ''}
                      </div>
                    </div>
                    
                    <ArrowRight size={16} className="text-neutral-dark/50 ml-1 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Show "No Results" when there are no matching results */}
            {query.trim() !== '' && searchResults.length === 0 && (
              <div className="py-6 px-5 text-center">
                <div className="inline-flex justify-center items-center rounded-full bg-neutral-50 p-3 mb-3">
                  <Search size={18} className="text-neutral-dark/50" />
                </div>
                <div className="text-sm font-medium text-neutral-dark/80 mb-1.5">
                  {t('search.noResults', 'No products found for "{{query}}"', { query })}
                </div>
                <p className="text-xs text-neutral-dark/60">
                  {t('search.tryDifferent', 'Try different search terms or browse categories')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}