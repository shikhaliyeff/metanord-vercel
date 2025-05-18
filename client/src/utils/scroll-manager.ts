/**
 * Scroll position management utilities
 * 
 * These utilities help manage scroll position during navigation and language changes
 * to ensure a consistent user experience across devices
 */

// Reset scroll position to top of page with improved reliability
export const scrollToTop = (behavior: ScrollBehavior = 'auto'): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Force immediate scroll to top first - prevents footer showing issues
    window.scrollTo(0, 0);
    
    // Then try the smooth version for better UX
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
    
    // Extra safety for mobile browsers that might ignore the first attempt
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Force layout recalculation to ensure scroll took effect
    document.body.getBoundingClientRect();
  } catch (e) {
    // Fallback for older browsers
    window.scrollTo(0, 0);
    // Additional fallback
    if (document.body) document.body.scrollIntoView();
  }
};

// Reset scroll position after navigation - ultra-reliable version
export const resetScrollAfterNavigation = (): void => {
  if (typeof window === 'undefined') return;
  
  // Force immediate scroll reset
  window.scrollTo(0, 0);
  
  // Apply multiple scroll resets at staggered intervals to ensure it works
  // This addresses the "opens at footer" issue on mobile browsers
  const scrollTimes = [0, 10, 50, 100, 250, 500, 1000];
  
  scrollTimes.forEach(time => {
    setTimeout(() => {
      try {
        // Try multiple scroll methods for maximum compatibility
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // For mobile safari specifically
        if (document.body.scrollTo) {
          document.body.scrollTo(0, 0);
        }
        if (document.documentElement.scrollTo) {
          document.documentElement.scrollTo(0, 0);
        }
        
        // Force repaint to ensure scroll took effect
        document.body.getBoundingClientRect();
      } catch (e) {
        // Silent catch - ensure we don't break anything
      }
    }, time);
  });
};

// Reset scroll position after language change
export const resetScrollAfterLanguageChange = (): void => {
  if (typeof window === 'undefined') return;
  
  // Make sure this runs after the language change has completed
  setTimeout(() => {
    scrollToTop();
  }, 100);
};

// Handle scroll position before unloading current page
export const saveScrollPositionBeforeUnload = (): void => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  
  try {
    sessionStorage.setItem('lastScrollPosition', window.scrollY.toString());
  } catch (e) {
    // Silently handle storage errors
  }
};

// Setup scroll position listeners for the entire application
export const setupScrollPositionManagement = (): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  // Add event listeners
  window.addEventListener('beforeunload', saveScrollPositionBeforeUnload);
  window.addEventListener('popstate', () => scrollToTop());
  
  // When page loads, always scroll to top
  scrollToTop();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', saveScrollPositionBeforeUnload);
    window.removeEventListener('popstate', () => scrollToTop());
  };
};