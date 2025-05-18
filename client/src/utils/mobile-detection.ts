/**
 * Mobile detection utility
 * 
 * Provides functions to detect mobile devices and optimize performance accordingly
 */

// EMERGENCY FIX: Always force mobile detection to true on problematic devices
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Extremely aggressive mobile detection to ensure all mobile devices are caught
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|Tablet/i;
  
  const isMobileUserAgent = mobileRegex.test(userAgent);
  const isMobileWidth = window.innerWidth < 1024; // Treat all narrow screens as mobile
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Force detection for ALL iOS and Android devices regardless of browser
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  
  // Check if this is a preview/iframe environment
  const isPreviewEnvironment = window.self !== window.top;
  
  // SPECIAL HANDLING: Force mobile mode in ALL preview environments and emulators
  if (isPreviewEnvironment || isIOS || isAndroid) {
    console.log("🚨 FORCE MOBILE MODE: Preview/mobile environment detected");
    return true;
  }
  
  // Consider ANY small screen as mobile for maximum compatibility
  if (isMobileWidth || hasTouchScreen) {
    console.log("🚨 FORCE MOBILE MODE: Small screen or touch device detected");
    return true;
  }
  
  // Fall back to standard detection only when all above checks fail
  const signals = [isMobileUserAgent, isMobileWidth, hasTouchScreen];
  const mobileSignalCount = signals.filter(Boolean).length;
  
  return mobileSignalCount >= 1 || window.innerWidth < 1200; 
};

// CRITICAL FIX: More aggressive performance detection
export const isLowPerformanceDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Use multiple signals to detect potentially problematic devices
  const isSmallScreen = window.innerWidth < 768;
  const isNarrowScreen = window.innerWidth / window.innerHeight < 0.6;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isOlderDevice = /Android 4|Android 5|iOS 9|iOS 10|iPhone 6|iPhone 7/i.test(userAgent);
  
  // Consider all mobile devices as potentially low performance for products page
  // This is a conservative approach to ensure maximum compatibility
  return isMobileDevice() || isSmallScreen || isNarrowScreen || isOlderDevice;
};