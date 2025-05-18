import { LucideIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  className?: string;
}

export function ServiceCard({ icon: Icon, title, description, features, className }: ServiceCardProps) {
  const { t } = useTranslation();
  return (
    <div className={cn(
      "group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 border-t-4 border-accent hover:scale-[1.02] backdrop-blur-sm",
      className
    )}>
      {/* Top highlight bar */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/10 to-accent/10"></div>
      
      {/* Content wrapper with gradient */}
      <div className="relative p-8">
        <div className="relative z-10">
          {/* Icon with top position */}
          <div className="mb-6 flex justify-start">
            <div className="bg-gradient-to-r from-primary to-accent p-[2px] rounded-lg shadow-md group-hover:shadow-accent/30 transition-all">
              <div className="bg-white w-16 h-16 rounded-lg flex items-center justify-center">
                <Icon className="h-8 w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
          
          {/* Title with accent color */}
          <h3 className="text-xl font-inter font-bold mb-3 text-primary">{title}</h3>
          
          {/* Divider */}
          <div className="w-16 h-1 bg-accent mb-4 rounded-full"></div>
          
          {/* Description */}
          <p className="font-roboto mb-6 text-gray-600">
            {description}
          </p>
          
          {/* Features with modern styling */}
          <ul className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-accent/10 p-1 rounded text-accent flex items-center justify-center mt-0.5">
                  <CheckIcon className="h-3.5 w-3.5" />
                </div>
                <span className="font-roboto text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          {/* Learn More Button */}
          <div className="pt-2">
            <button className="btn-gradient text-white hover-lift hover-glow font-semibold px-4 py-2 rounded-lg shadow-accent border border-white/20 text-sm relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <span className="relative">{t('common.learnMore', 'Learn More')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
