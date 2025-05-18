import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  priority?: boolean;  // For images above the fold which should load immediately
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager'; // Native HTML loading attribute for browser-level lazy loading
  blurEffect?: boolean; // Whether to apply a blur effect while loading
  sizes?: string; // Responsive image sizes attribute
  fetchpriority?: 'high' | 'low' | 'auto'; // Fetch priority hint
  decoding?: 'async' | 'sync' | 'auto'; // Image decoding hint
}

/**
 * LazyImage component that uses Intersection Observer API
 * to only load images when they're in the viewport
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  loadingClassName = 'animate-pulse bg-gray-200 dark:bg-gray-700',
  placeholderClassName = '',
  width,
  height,
  onLoad,
  onError,
  priority = false,
  objectFit = 'cover',
  loading = 'lazy',
  blurEffect = false,
  sizes,
  fetchpriority = 'auto',
  decoding = 'async',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fix URLs for Replit development
  const fixedSrc = src.startsWith('/attached_assets/') 
    ? src.replace('/attached_assets/', '/@fs/home/runner/workspace/attached_assets/') 
    : src.startsWith('/') 
      ? src 
      : `/${src}`;

  // Handle IntersectionObserver setup for lazy loading
  useEffect(() => {
    // If priority is true, we don't need the observer
    if (priority) return;

    // Only create observer if it doesn't exist and image should not be loaded yet
    if (!observerRef.current && !shouldLoad) {
      observerRef.current = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          
          // Disconnect observer once image should load
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }
      }, {
        // Root margin provides 200px buffer so images start loading just before they enter viewport
        rootMargin: '200px',
      });

      // Start observing the image element
      if (imageRef.current) {
        observerRef.current.observe(imageRef.current);
      }
    }

    // Cleanup observer on component unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [priority, shouldLoad]);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    onError?.(e);
  };

  // Various style classes based on state
  const imageClasses = cn(
    // Common styles
    "transition-opacity duration-500",
    
    // Conditionally applied styles
    {
      "opacity-0": !isLoaded && !error,
      "opacity-100": isLoaded && !error,
    },
    className
  );

  // Placeholder shown before image loads
  const placeholderClasses = cn(
    "absolute inset-0 transition-opacity duration-500 rounded-md overflow-hidden",
    {
      "opacity-100": !isLoaded && !error,
      "opacity-0": isLoaded || error,
    },
    loadingClassName,
    placeholderClassName
  );

  // Error state placeholder
  const errorClasses = cn(
    "absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md",
    {
      "opacity-0": !error,
      "opacity-100": error,
    }
  );

  return (
    <div 
      className="relative" 
      style={{ 
        width: width ? `${width}px` : '100%', 
        height: height ? `${height}px` : 'auto',
        minHeight: '50px' // Minimum height for placeholder
      }}
      ref={imageRef}
    >
      {/* Loading placeholder */}
      <div className={placeholderClasses}></div>
      
      {/* Error placeholder */}
      <div className={errorClasses}>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {alt || 'Image failed to load'}
        </span>
      </div>
      
      {/* Actual image - only load source if in viewport */}
      {shouldLoad && (
        <img
          src={fixedSrc}
          alt={alt}
          className={imageClasses}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
          }}
          loading={loading}
          width={width}
          height={height}
          decoding={decoding}
          fetchpriority={fetchpriority}
          sizes={sizes}
        />
      )}
    </div>
  );
};

export { LazyImage };