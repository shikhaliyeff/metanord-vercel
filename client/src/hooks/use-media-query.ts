import { useEffect, useState } from "react";

/**
 * Custom hook for responsive design that detects if a media query matches
 * 
 * @param query The media query to check, e.g. "(min-width: 768px)"
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
 * const isDesktop = useMediaQuery("(min-width: 1025px)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Initial check
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Create callback for media query changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for changes
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      // For older browsers
      media.addListener(listener);
    }

    // Cleanup function
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        // For older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Common media query breakpoints
 */
export const breakpoints = {
  xs: "(max-width: 479px)",
  sm: "(min-width: 480px) and (max-width: 639px)",
  md: "(min-width: 640px) and (max-width: 767px)",
  lg: "(min-width: 768px) and (max-width: 1023px)",
  xl: "(min-width: 1024px) and (max-width: 1279px)",
  xxl: "(min-width: 1280px)",
  // Additional device-focused breakpoints
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  // Orientation
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
  // Touch capability
  touch: "(hover: none) and (pointer: coarse)",
  // Reduced motion preference
  reducedMotion: "(prefers-reduced-motion: reduce)",
};