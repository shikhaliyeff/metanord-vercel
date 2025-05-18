import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  categoryClass: string;
  className?: string;
}

export function ProjectCard({
  image,
  title,
  description,
  category,
  categoryClass,
  className
}: ProjectCardProps) {
  const { t } = useTranslation();
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl shadow-soft h-96 hover-scale hover:shadow-lg neumorph transition-all duration-500 border border-white/40",
      className
    )}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {/* Category Badge */}
          <span className={cn(
            "inline-block text-white text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm mb-4",
            categoryClass
          )}>
            {category}
          </span>
          
          {/* Title with animated underline */}
          <div className="relative mb-3">
            <h3 className="text-white text-2xl font-inter font-bold">{title}</h3>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent/80 rounded group-hover:w-16 transition-all duration-500 delay-100"></div>
          </div>
          
          {/* Description with fade in effect */}
          <p className="text-white/90 font-roboto max-w-md opacity-85 transform group-hover:opacity-100 transition-all duration-300">
            {description}
          </p>
          
          {/* View Project Button (Optional) */}
          <div className="mt-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
            <button className="btn-gradient text-white hover-lift hover-glow text-sm px-4 py-2 rounded-lg shadow-accent border border-white/20 font-semibold flex items-center gap-2 group relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <span className="relative">{t("projects.viewProject", "View Project")}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
