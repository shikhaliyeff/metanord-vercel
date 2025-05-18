import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Hook that detects clicks outside of a specified element
 * @param ref Reference to the element to detect clicks outside of
 * @param handler Function to call when a click outside is detected
 * @param exceptionalRefs Optional array of refs that should not trigger the handler
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  exceptionalRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Check if the click is outside the main ref
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      // Check if the click is inside any of the exceptional refs
      for (const exRef of exceptionalRefs) {
        if (exRef.current && exRef.current.contains(target)) {
          return;
        }
      }
      
      handler(event);
    };
    
    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, exceptionalRefs]);
}