/**
 * Performance Optimizations Module
 * 
 * Provides utility functions to optimize web application performance including:
 * - Lazy loading
 * - Rendering optimization
 * - Resource loading improvements
 * - Browser API utilization
 */

import { useRef, useEffect, useState } from 'react';
import { preloadImages } from './asset-optimization';

// Type for our observer ref to allow mutable assignment
interface MutableObserverRef {
  current: IntersectionObserver | null;
}

/**
 * Create a lazy loader with intersection observer
 * 
 * @param rootMargin Distance from viewport to trigger loading
 * @returns Object with intersection observer methods
 */
export function createLazyLoader(rootMargin: string = '100px') {
  // Create a mutable ref object
  const observerRef: MutableObserverRef = { current: null };
  
  // List of observed elements and their callbacks
  const observed = new Map<Element, () => void>();
  
  // Create observer only on client side
  if (typeof window !== 'undefined') {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Get callback for this element
            const callback = observed.get(entry.target);
            if (callback) {
              // Call the callback
              callback();
            }
          }
        });
      },
      { rootMargin }
    );
  }
  
  // Observe element and register callback
  const observe = (element: Element, callback: () => void) => {
    if (!observerRef.current) return;
    
    // Save callback
    observed.set(element, callback);
    
    // Observe element
    observerRef.current.observe(element);
  };
  
  // Stop observing element
  const unobserve = (element: Element) => {
    if (!observerRef.current) return;
    
    // Remove from observed elements
    observed.delete(element);
    
    // Stop observing
    observerRef.current.unobserve(element);
  };
  
  return {
    observerRef,
    observe,
    unobserve
  };
}

/**
 * Optimize element rendering using browser APIs
 * 
 * @param element DOM element to optimize
 * @param containSize Container intrinsic size
 */
export function optimizeElementRendering(
  element: HTMLElement | null, 
  containSize: string = '0 500px'
): void {
  if (!element) return;
  
  // Use content-visibility for better rendering performance
  if ('contentVisibility' in element.style) {
    element.style.contentVisibility = 'auto';
    element.style.containIntrinsicSize = containSize;
  }
}

/**
 * React hook for lazy loading elements
 * 
 * @param rootMargin Distance from viewport to trigger loading
 * @returns Object with ref to attach and loading state
 */
export function useLazyLoad(rootMargin: string = '200px') {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;
    
    // Skip if IntersectionObserver not available (SSR or old browser)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    
    observer.observe(currentElement);
    
    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);
  
  return { ref: elementRef, isVisible };
}

/**
 * Optimize image loading for a list of product IDs
 * 
 * @param productIds List of product IDs
 * @param imagesMap Map of product IDs to image URLs
 */
export function optimizeProductImages(
  productIds: string[],
  imagesMap: Record<string, string>
): void {
  if (!productIds || !imagesMap) return;
  
  // Split into critical and non-critical images
  const criticalIds = productIds.slice(0, 4);
  const deferredIds = productIds.slice(4);
  
  // Preload critical images immediately
  const criticalImages = criticalIds
    .map(id => imagesMap[id])
    .filter(Boolean);
  
  if (criticalImages.length) {
    preloadImages(criticalImages, true);
  }
  
  // Preload remaining images with low priority
  if (deferredIds.length) {
    setTimeout(() => {
      const deferredImages = deferredIds
        .map(id => imagesMap[id])
        .filter(Boolean);
      
      if (deferredImages.length) {
        preloadImages(deferredImages, false);
      }
    }, 1000);
  }
}

/**
 * Monitor browser performance metrics
 * 
 * @returns Performance measurement functions
 */
export function usePerformanceMonitoring() {
  const marks: Record<string, number> = {};
  
  // Start measuring
  const startMeasure = (name: string) => {
    if (typeof performance === 'undefined') return;
    
    const markName = `${name}_start`;
    performance.mark(markName);
    marks[name] = Date.now();
  };
  
  // End measuring and get duration
  const endMeasure = (name: string): number => {
    if (typeof performance === 'undefined' || !marks[name]) return 0;
    
    const startMark = `${name}_start`;
    const endMark = `${name}_end`;
    
    performance.mark(endMark);
    
    try {
      performance.measure(name, startMark, endMark);
      const duration = Date.now() - marks[name];
      delete marks[name];
      return duration;
    } catch (e) {
      return 0;
    }
  };
  
  return { startMeasure, endMeasure };
}