import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, adminTheme, toggleTheme, toggleAdminTheme, isAdmin } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on client-side data
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle direct theme toggle to ensure it works
  const handleToggle = () => {
    // Determine which theme to use based on admin status
    const currentTheme = isAdmin ? adminTheme : theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // Update the document element right away
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    
    // Store in localStorage
    if (isAdmin) {
      localStorage.setItem("metanord-admin-theme", newTheme);
      toggleAdminTheme();
    } else {
      localStorage.setItem("metanord-theme", newTheme);
      toggleTheme();
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <Button variant="ghost" size="sm" className="relative w-9 px-0" />;
  }

  // Get the correct current theme based on admin status
  const currentTheme = isAdmin ? adminTheme : theme;
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="relative w-9 px-0"
      aria-label="Toggle theme"
      title={currentTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="sr-only">
        {currentTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute"
      >
        {currentTheme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </motion.div>
    </Button>
  );
}