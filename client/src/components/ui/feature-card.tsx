import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: "border-accent" | "border-primary" | "border-secondary" | "border-accent-dark";
  iconColorClass: "text-accent" | "text-primary" | "text-secondary" | "text-accent-dark";
}

export function FeatureCard({ 
  icon: Icon,
  title, 
  description, 
  colorClass, 
  iconColorClass 
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden hover-scale shadow-soft">
      <div className={cn(
        "bg-white p-8 rounded-lg border border-neutral-200 transition-all duration-300 z-10 relative h-full",
      )}>
        {/* Accent border that appears on hover */}
        <div className={cn(
          "absolute bottom-0 left-0 w-0 h-1 transition-all duration-500 group-hover:w-full", 
          colorClass.replace("border-", "bg-")
        )}></div>
        
        {/* Icon with gradient background */}
        <div className="mb-6">
          <div className={cn(
            "w-14 h-14 rounded-lg flex items-center justify-center p-3 bg-gradient-to-br", 
            {
              "from-accent/10 to-accent/30": iconColorClass === "text-accent",
              "from-primary/10 to-primary/30": iconColorClass === "text-primary",
              "from-secondary/10 to-secondary/30": iconColorClass === "text-secondary",
              "from-accent-dark/10 to-accent-dark/30": iconColorClass === "text-accent-dark",
            }
          )}>
            <Icon className={cn("h-8 w-8 transition-all duration-300", iconColorClass)} />
          </div>
        </div>
        
        <h3 className="text-xl font-inter font-semibold mb-3 group-hover:text-primary transition-all duration-300">{title}</h3>
        <p className="font-roboto text-neutral-dark/90">
          {description}
        </p>
      </div>
    </div>
  );
}
