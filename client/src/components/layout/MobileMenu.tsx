import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SimpleLanguageSwitcher } from "@/components/ui/simple-language-switcher";
import { SearchBar } from "@/components/ui/search-bar";
import { Mail, MapPin, Phone, PhoneCall, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { 
    href?: string; 
    label: string; 
    dropdown?: boolean; 
    items?: { href: string; label: string; icon?: React.ReactNode }[];
  }[];
  activeLink: string;
}

const MobileMenu = ({ isOpen, onClose, links, activeLink }: MobileMenuProps) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  
  useEffect(() => {
    // Listen for swipe gesture to close the menu
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current) return;
      
      const touchX = e.touches[0].clientX;
      const diff = touchStartX.current - touchX;
      
      // If swiping left (positive diff) and enough distance moved
      if (diff > 40) {
        touchStartX.current = null;
        onClose();
      }
    };
    
    const handleTouchEnd = () => {
      touchStartX.current = null;
    };
    
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener('touchstart', handleTouchStart);
      menuElement.addEventListener('touchmove', handleTouchMove);
      menuElement.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        menuElement.removeEventListener('touchstart', handleTouchStart);
        menuElement.removeEventListener('touchmove', handleTouchMove);
        menuElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [onClose]);
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const isActive = (path: string | undefined) => {
    if (!path) return false;
    // Special case for home page
    if (path === "/" && activeLink === "/") return true;
    // For other pages, check if the current path starts with the link path
    return path !== "/" && activeLink.startsWith(path);
  };

  // Handle anchor links smoothly
  const handleAnchorClick = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    onClose(); // Close menu first
    
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    }, 300); // Delay to allow menu to close first
  };

  return (
    <div className="fixed inset-0 lg:hidden z-50 pointer-events-none">
      {/* Backdrop with blur effect */}
      <div 
        className={cn(
          "absolute inset-0 bg-primary/40 backdrop-blur-lg transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
        onClick={onClose}
        style={{ backdropFilter: 'blur(12px)' }}
      />
      
      {/* Menu panel - enhanced for touch with swipe gesture support */}
      <div 
        id="mobile-menu"
        ref={menuRef}
        className={cn(
          "absolute top-[44px] xs:top-[48px] sm:top-[56px] md:top-[64px] right-0 w-full xs:w-11/12 sm:w-4/5 max-w-sm h-[calc(100vh-44px)] xs:h-[calc(100vh-48px)] sm:h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] bg-background shadow-xl transition-transform duration-500 ease-out pointer-events-auto overflow-y-auto overscroll-contain momentum-scroll glass-card border-l border-t border-white/30",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backdropFilter: 'blur(10px)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Accent top border */}
        <div className="absolute top-0 left-0 w-full h-1 xs:h-1.5 bg-gradient-to-r from-primary via-accent to-primary shadow-accent"></div>
        
        {/* Swipe indicator */}
        <div className="absolute top-2 right-4 flex items-center gap-1 text-sm text-gray-500/70">
          <span className="text-xs">swipe</span>
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </div>
        
        {/* Mobile handle/grip */}
        <div className="w-full flex justify-center py-1.5">
          <div className="w-12 h-1 bg-gray-200 rounded-full opacity-50"></div>
        </div>
        
        {/* Menu items - enhanced for touch */}
        <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col gap-2 xs:gap-3 md:gap-4">
          {links.map((link, index) => 
            link.dropdown ? (
              <div key={`dropdown-${index}`} className="relative">
                {/* Dropdown Category Label */}
                <div className="relative font-inter font-medium py-2.5 xs:py-3 sm:py-3.5 cursor-pointer transition-all duration-300 group text-base tap-highlight rounded-lg pl-3 xs:pl-4 text-primary font-semibold">
                  <span className="block">{link.label}</span>
                  {/* Bottom border */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-100/50"></div>
                </div>
                
                {/* Dropdown Items - Redesigned for clean, minimal look with white background */}
                <div className="pl-4 xs:pl-5 pt-2 bg-white rounded-md mt-1 mb-2">
                  {link.items?.map((item, subIndex) => (
                    <Link key={item.href} to={item.href} onClick={onClose}>
                      <div 
                        className={cn(
                          "relative font-inter py-3 cursor-pointer transition-all duration-200 group text-sm xs:text-base tap-highlight rounded-lg",
                          isActive(item.href) 
                            ? "text-accent font-medium pl-3 after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-accent" 
                            : "text-neutral-dark hover:text-accent hover:pl-3 active:bg-gray-50/30 hover:after:absolute hover:after:bottom-[-2px] hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-accent/70"
                        )}
                        style={{ transitionDelay: `${(index + subIndex) * 20}ms` }}
                      >
                        {/* CRITICAL FIX: Added active indicator bar for submenu items - matching parent menu style */}
                        <div className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 xs:h-6 rounded-sm bg-accent transition-opacity duration-300",
                          isActive(item.href) ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                        )}></div>
                        
                        <div className="flex justify-between items-center gap-2">
                          <span className="block flex-grow">{item.label}</span>
                          {/* Removed chevron icon for clean submenu design */}
                        </div>
                        
                        {/* Bottom border */}
                        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-100/50"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.href || ''} to={link.href || ''} onClick={onClose}>
                <div 
                  className={cn(
                    "relative font-inter font-medium py-2.5 xs:py-3 sm:py-3.5 cursor-pointer transition-all duration-300 group text-base tap-highlight rounded-lg",
                    isActive(link.href) 
                      ? "text-accent pl-3 xs:pl-4 bg-accent/5" 
                      : "text-neutral-dark hover:text-accent hover:pl-3 xs:hover:pl-4 hover:bg-gray-50/50 active:bg-gray-100/50"
                  )}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Active indicator */}
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 xs:h-6 rounded-sm bg-accent transition-opacity duration-300",
                    isActive(link.href) ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  )}></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="block">{link.label}</span>
                    {/* Removed chevron icon for clean menu design as required */}
                  </div>
                  
                  {/* Bottom border */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-100/50"></div>
                </div>
              </Link>
            )
          )}
          
          {/* Mobile-only Search Bar */}
          <div className="my-2 xs:my-3 sm:my-4 flex justify-start">
            <SearchBar 
              placeholder={t("search.placeholder", "Search products...")}
              onSearchClick={onClose}
              iconOnly={true}
            />
          </div>

          {/* Language Switcher - already present in the header, may be redundant here */}
          <div className="mb-1 xs:mb-2 hidden xs:block">
            <SimpleLanguageSwitcher />
          </div>
          
          {/* Call to action buttons - enhanced for touch */}
          <div className="mt-4 xs:mt-5 space-y-3 xs:space-y-4">
            {/* Get Price Button */}
            <Link to="/contact" onClick={onClose}>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white hover:shadow-md hover-scale w-full py-3.5 xs:py-4 sm:py-5 font-semibold rounded-lg text-sm xs:text-base sm:text-lg active:translate-y-0.5 transition-transform active:shadow-inner" 
              >
                <PhoneCall className="mr-2 xs:mr-2.5 h-4 xs:h-5 w-4 xs:w-5" />
                {t("header.requestQuote", "Request Quote")}
              </Button>
            </Link>
            
            {/* Request Callback Button */}
            <Link to="/contact" onClick={onClose}>
              <Button 
                variant="secondary"
                className="w-full py-3 xs:py-3.5 sm:py-4.5 bg-primary/10 text-primary hover:bg-primary/20 text-sm xs:text-base active:translate-y-0.5 transition-transform active:bg-primary/30 tap-highlight" 
              >
                {t("header.requestCallback", "Request Callback")}
              </Button>
            </Link>
          </div>
          
          {/* Contact info - enhanced for mobile with interactivity */}
          <div className="mt-6 xs:mt-8 sm:mt-10 p-4 xs:p-5 rounded-lg glass-card bg-white/80 text-neutral-700 shadow-sm border border-white/30">
            <h4 className="font-semibold text-primary mb-2 xs:mb-3 sm:mb-4 text-sm xs:text-base">
              {t("contact.info.title", "Contact Information")}
            </h4>
            <div className="space-y-3 xs:space-y-4">
              <a 
                href="mailto:info@metanord.eu" 
                className="flex items-center gap-2 xs:gap-3 p-2 -mx-2 rounded-md hover:bg-white/50 active:bg-white/80 transition-colors tap-highlight"
              >
                <div className="flex items-center justify-center h-8 w-8 bg-accent/10 rounded-full">
                  <Mail className="text-accent h-4 w-4" />
                </div>
                <p className="text-sm sm:text-base">info@metanord.eu</p>
              </a>
              
              <a 
                href="https://maps.google.com/?q=Tornimäe+tn+5,+10145+Tallinn,+Estonia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2 xs:gap-3 p-2 -mx-2 rounded-md hover:bg-white/50 active:bg-white/80 transition-colors tap-highlight"
              >
                <div className="flex items-center justify-center h-8 w-8 mt-0.5 bg-accent/10 rounded-full">
                  <MapPin className="text-accent h-4 w-4" />
                </div>
                <p className="text-sm sm:text-base">Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145</p>
              </a>
              
              <a 
                href="tel:+3725123456" 
                className="flex items-center gap-2 xs:gap-3 p-2 -mx-2 rounded-md hover:bg-white/50 active:bg-white/80 transition-colors tap-highlight"
              >
                <div className="flex items-center justify-center h-8 w-8 bg-accent/10 rounded-full">
                  <Phone className="text-accent h-4 w-4" />
                </div>
                <p className="text-sm sm:text-base">+372 5123 4567</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
