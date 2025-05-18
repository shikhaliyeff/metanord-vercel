import { cn } from "@/lib/utils";
import logoImage from "@assets/Geometric Design Logo for MetaNord (3).png";

interface LogoProps {
  className?: string;
  variant?: "header" | "footer";
}

export const Logo = ({ className, variant = "header" }: LogoProps) => {
  // CRITICAL MOBILE FIX: Dramatically increased logo size on mobile for proper proportions
  const sizeClasses = variant === "footer"
    ? "w-full h-auto" // responsive size for footer
    : "h-14 xs:h-14 sm:h-14 md:h-14 w-auto"; // Maximum size for all devices to ensure visibility
  
  // For footer, we don't need any special treatment as it's displayed against white background
  // For header, we may want to adjust it for the dark background
  const visibilityClass = variant === "footer" 
    ? "" // retain original colors exactly as they are
    : ""; // no adjustments for header either
  
  return (
    <img 
      src={logoImage}
      alt="MetaNord Logo" 
      className={cn(
        sizeClasses,
        visibilityClass,
        "object-contain",
        className
      )} 
      aria-label="MetaNord Logo"
    />
  );
};
