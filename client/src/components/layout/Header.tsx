import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, PhoneCall, Search, ChevronDown, FileText, HelpCircle, Layers, Users, FolderOpen } from "lucide-react";
import { SimpleLanguageSwitcher } from "@/components/ui/simple-language-switcher";
import MobileMenu from "./MobileMenu";
import { SearchBar } from "@/components/ui/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom desktop dropdown component that shows on hover
const DesktopNavDropdown = ({ link }: { link: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    // Delay closing by 200ms to allow for natural mouse movement
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={dropdownRef} 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group flex items-center overflow-hidden">
        <div className="font-inter font-medium transition-all duration-300 cursor-pointer hover:text-accent">
          {link.label}
          <ChevronDown className={`ml-1 h-4 w-4 inline transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {/* Enhanced underline effect for main dropdown menu items */}
        <div className="absolute -bottom-[1px] left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></div>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50 animate-in fade-in-50 duration-100 w-auto bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden">
          <div className="py-1 flex flex-col min-w-[180px]">
            {link.items?.map((item: any) => (
              <Link key={item.href} to={item.href}>
                <div className="px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dropdown-submenu-item submenu-item">
                  <div className="relative group overflow-hidden">
                    <span className="text-gray-800 group-hover:text-accent text-[14px] font-medium transition-colors duration-200">{item.label}</span>
                    {/* Enhanced submenu underline effect to match parent items */}
                    <div className="absolute -bottom-[1px] left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  // Track scroll position to apply different styles
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Fix for dropdown hover blocking page scrolling
  useEffect(() => {
    // Ensure body overflow is never hidden when dropdown menus are hovered
    document.body.style.overflow = '';
    
    return () => {
      // Cleanup in case component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: t("header.home", "Home") },
    { href: "/products", label: t("header.products", "Products") },
    { 
      dropdown: true, 
      label: t("header.solutions", "Solutions"),
      items: [
        { href: "/services", label: t("header.services", "Services") }
      ]
    },
    { 
      dropdown: true, 
      label: t("header.company", "Company"),
      items: [
        { href: "/about", label: t("header.about", "About Us") },
        { href: "/projects", label: t("header.featuredProjects", "Featured Projects") }
      ]
    },
    { href: "/contact", label: t("header.contact", "Contact") }
  ];

  const isActive = (path: string | undefined) => {
    if (!path) return false;
    // Special case for home page
    if (path === "/" && location === "/") return true;
    // For other pages, check if the current path starts with the link path
    return path !== "/" && location.startsWith(path);
  };

  // Handle anchor links smoothly
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const element = document.getElementById(anchor);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-1 sm:py-1.5 shadow-xl' : 'py-2 sm:py-2.5'
    }`}>
      <div className={`absolute inset-0 ${
        scrolled ? 'glass-nav bg-white/80 backdrop-blur-xl border-b border-white/30' : 'glass-effect backdrop-blur-lg border-b border-white/20'
      }`} style={{ backdropFilter: 'blur(15px)' }}></div>
      <div className="container relative z-10 mx-auto px-2 sm:px-4 md:px-6 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center cursor-pointer hover-scale transition-transform duration-300">
            <Logo className={`${scrolled ? 'h-14 xs:h-16 sm:h-20 lg:h-24 w-auto' : 'h-16 xs:h-20 sm:h-24 lg:h-28 w-auto'} transition-all duration-300`} />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link, idx) => 
            link.dropdown ? (
              // Use our custom hover dropdown for desktop menu items
              <DesktopNavDropdown key={`desktop-dropdown-${idx}`} link={link} />
            ) : (
              <Link key={`nav-link-${idx}`} to={link.href || ""}>
                <div className="relative group overflow-hidden">
                  <div className={`font-inter font-medium transition-all duration-300 cursor-pointer ${
                    isActive(link.href) ? 'text-accent font-bold' : 'hover:text-accent'
                  }`}>
                    {link.label}
                  </div>
                  {/* Improved animated underline effect with overflow handling */}
                  <div className={`absolute -bottom-[1px] left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
                    isActive(link.href) ? 'w-full shadow-accent' : 'group-hover:w-full'
                  }`}></div>
                </div>
              </Link>
            )
          )}
          
          {/* Search Icon */}
          <div className="w-auto">
            <SearchBar 
              placeholder={t("search.placeholder", "Search products...")}
              iconOnly={true}
            />
          </div>
          
          {/* Language Switcher */}
          <div className="mx-1">
            <SimpleLanguageSwitcher />
          </div>
          
          {/* Get Price Button */}
          <Link to="/contact">
            <Button 
              className="btn-gradient text-white hover-lift hover-glow font-semibold ml-2 px-3 lg:px-4 py-2 shadow-accent border border-white/20 whitespace-nowrap"
            >
              <PhoneCall className="mr-1 h-4 w-4" /> {t("header.requestQuote", "Request Quote")}
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Toggle & Mobile Actions */}
        <div className="lg:hidden flex items-center gap-1 xs:gap-1.5 sm:gap-2">
          {/* Mobile Search - tablet only */}
          <div className="hidden xs:block sm:block">
            <SearchBar 
              placeholder={t("search.placeholder", "Search products...")}
              iconOnly={true}
            />
          </div>
          
          {/* Mobile Language Switcher - xs and up */}
          <div className="block">
            <SimpleLanguageSwitcher />
          </div>
          
          {/* Mobile Call Button */}
          <Link to="/contact">
            <Button 
              size="sm"
              className="btn-gradient hover-lift hover-glow text-white px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 shadow-accent border border-white/20 text-xs sm:text-sm font-medium"
              aria-label={t("header.requestCallback", "Request Callback")}
            >
              <PhoneCall className="h-3 xs:h-3.5 sm:h-4 w-3 xs:w-3.5 sm:w-4" />
              <span className="ml-1 hidden xs:inline whitespace-nowrap">{t("header.requestCallback", "Request Callback")}</span>
            </Button>
          </Link>
          
          {/* Menu Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="neumorph-btn text-primary hover:text-accent p-1 xs:p-1.5 sm:p-2 rounded-full hover-lift hover-glow shadow-md border border-white/30"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-3.5 xs:h-4 sm:h-5 w-3.5 xs:w-4 sm:w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen} 
        onClose={closeMenu} 
        links={navLinks}
        activeLink={location}
      />
    </header>
  );
};

export default Header;
