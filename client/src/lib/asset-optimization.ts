/**
 * Asset Optimization Utilities
 * 
 * Provides tools for optimizing asset loading, preloading, and caching
 * to improve website performance and user experience.
 */

// Cache to keep track of preloaded images
const preloadedImageCache = new Set<string>();

// Cache to store image load status
const imageLoadedCache = new Map<string, boolean>();

/**
 * Preload images to improve perceived performance
 * 
 * @param imageSources Array of image URLs to preload
 * @param highPriority Whether images should be loaded with high priority
 */
export function preloadImages(imageSources: string[], highPriority: boolean = false): void {
  if (!imageSources || !imageSources.length) return;
  
  // Filter out already preloaded images
  const imagesToPreload = imageSources.filter(src => {
    if (!src || preloadedImageCache.has(src)) return false;
    preloadedImageCache.add(src);
    return true;
  });
  
  if (!imagesToPreload.length) return;
  
  // Use different preloading strategies depending on priority
  if (highPriority) {
    // High priority - load immediately
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageLoadedCache.set(src, true);
      };
    });
  } else {
    // Lower priority - use requestIdleCallback or setTimeout
    const preloadBatch = () => {
      const nextImage = imagesToPreload.shift();
      if (nextImage) {
        const img = new Image();
        img.src = nextImage;
        img.onload = () => {
          imageLoadedCache.set(nextImage, true);
          // Process next image when browser is idle
          if (typeof window !== 'undefined' && window.requestIdleCallback) {
            window.requestIdleCallback(() => preloadBatch());
          } else {
            setTimeout(preloadBatch, 50);
          }
        };
      }
    };
    
    // Start preloading
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(() => preloadBatch());
    } else {
      setTimeout(preloadBatch, 0);
    }
  }
}

/**
 * Check if an image is already loaded
 * 
 * @param src Image source URL
 * @returns Boolean indicating if the image is loaded
 */
export function isImageLoaded(src: string): boolean {
  return imageLoadedCache.get(src) || false;
}

/**
 * Apply lazy loading to an element
 * 
 * @param element The DOM element to observe
 * @param onVisible Callback function when element becomes visible
 */
export function setLazyLoad(
  element: HTMLElement,
  onVisible: () => void
): () => void {
  if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback for unsupported browsers
    onVisible();
    return () => {};
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onVisible();
        observer.disconnect();
      }
    });
  }, {
    rootMargin: '200px', // Start loading 200px before element comes into view
    threshold: 0.01
  });
  
  observer.observe(element);
  
  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Optimize responsive image loading
 * 
 * @param src Original image source
 * @param sizes Optional sizes for responsive images
 * @returns Optimized image attributes
 */
export function getOptimizedImageProps(
  src: string,
  sizes?: string
): { src: string; loading: "lazy" | "eager"; sizes?: string } {
  const isCritical = preloadedImageCache.has(src);
  
  return {
    src,
    loading: isCritical ? "eager" : "lazy",
    sizes: sizes || undefined
  };
}

// Type declaration for requestIdleCallback
declare global {
  interface Window {
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
  }
}