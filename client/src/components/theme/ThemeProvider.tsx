import React, { createContext, useContext } from "react";

type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsAdminMode: (isAdmin: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  // Force light theme
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  const contextValue: ThemeContextType = {
    theme: "light",
    isAdmin,
    setIsAdmin,
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