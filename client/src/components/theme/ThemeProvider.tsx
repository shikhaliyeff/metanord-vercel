import React, { createContext, useContext, useEffect, useState } from "react";
import { applyAdminTheme, loadAdminCSS, unloadAdminCSS, resetAdminTheme } from "@/lib/admin-theme";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  adminTheme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleAdminTheme: () => void;
  setAdminTheme: (theme: Theme) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  // Alias for setIsAdmin for better readability in specific contexts
  setIsAdminMode: (isAdmin: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to get initial theme
const getInitialTheme = (): Theme => {
  // Check if we're in the browser
  if (typeof window === "undefined") return "light";
  
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const forceTheme = urlParams.get('forceTheme');
  const themeParam = urlParams.get('theme');
  const modeParam = urlParams.get('mode');
  
  // If any URL parameter forces light theme, return it
  if (forceTheme === 'light' || themeParam === 'light' || modeParam === 'light') {
    return "light";
  }

  // Check localStorage next
  const savedTheme = localStorage.getItem("metanord-theme") as Theme | null;
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  }
  
  // Default to light
  return "light";
};

// Helper to get initial admin theme
const getInitialAdminTheme = (): Theme => {
  // Check if we're in the browser
  if (typeof window === "undefined") return "dark";

  // Check localStorage first
  const savedTheme = localStorage.getItem("metanord-admin-theme") as Theme | null;
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  
  // Default admin theme is dark
  return "dark";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [adminTheme, setAdminThemeState] = useState<Theme>(getInitialAdminTheme);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Set the theme on the document element
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;
    
    // Only apply theme if we're not in admin mode
    if (!isAdmin) {
      const root = window.document.documentElement;
      
      // Remove both classes first
      root.classList.remove("light", "dark");
      
      // Add the current theme class
      root.classList.add(newTheme);
      
      // Save to localStorage
      localStorage.setItem("metanord-theme", newTheme);
    }
  };

  // Set theme with validation
  const setTheme = (newTheme: Theme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setThemeState(newTheme);
    
    // Only apply the general theme if we're not in admin mode
    if (!isAdmin) {
      applyTheme(newTheme);
    }
  };

  // Set the admin theme
  const applyAdminThemeInternal = (newTheme: Theme) => {
    if (typeof window === "undefined") return;
    
    // Only apply if we're in admin mode
    if (isAdmin) {
      // Load admin styles if needed
      loadAdminCSS();
      
      // Apply the admin-specific theme using the utility
      applyAdminTheme(newTheme === 'dark');
      
      // Save to localStorage
      localStorage.setItem("metanord-admin-theme", newTheme);
    }
  };

  // Set admin theme with validation
  const setAdminTheme = (newTheme: Theme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setAdminThemeState(newTheme);
    
    // Only apply if we're in admin mode
    if (isAdmin) {
      applyAdminThemeInternal(newTheme);
    }
  };

  // Toggle between light and dark for admin
  const toggleAdminTheme = () => {
    const newTheme = adminTheme === "light" ? "dark" : "light";
    setAdminTheme(newTheme);
  };

  // Toggle between light and dark for general site
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Apply theme when component mounts and when theme or admin status changes
  useEffect(() => {
    if (!mounted) {
      // Apply initial theme immediately on mount
      if (isAdmin) {
        applyAdminThemeInternal(adminTheme);
      } else {
        applyTheme(theme);
      }
      setMounted(true);
      return;
    }
    
    // Apply the appropriate theme based on admin status
    if (isAdmin) {
      // Load admin styles and apply admin theme
      applyAdminThemeInternal(adminTheme);
    } else {
      // Unload admin styles and apply regular theme
      unloadAdminCSS();
      resetAdminTheme(); // Reset any admin-specific theme variables
      applyTheme(theme);
    }
  }, [theme, adminTheme, isAdmin, mounted]);

  // Make sure we're providing the initialized theme value and functions
  const contextValue: ThemeContextType = {
    theme,
    adminTheme,
    toggleTheme,
    setTheme,
    toggleAdminTheme,
    setAdminTheme,
    isAdmin,
    setIsAdmin,
    // Alias for setIsAdmin with the same implementation
    setIsAdminMode: setIsAdmin
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}