import React from "react";
import { PageSection } from "@shared/schema";
import { ComponentRenderer } from "./ComponentRenderer";
import { cn } from "@/lib/utils";

interface PageRendererProps {
  pageStructure: {
    sections: PageSection[];
  };
  className?: string;
}

export function PageRenderer({ pageStructure, className }: PageRendererProps) {
  if (!pageStructure || !pageStructure.sections || pageStructure.sections.length === 0) {
    return (
      <div className={cn("p-8 text-center bg-gray-50", className)}>
        <p className="text-gray-500">No sections found in this page.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {pageStructure.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: PageSection;
  className?: string;
}

function SectionRenderer({ section, className }: SectionRendererProps) {
  const { 
    content,
    components = [] 
  } = section;
  
  // Default styling if not provided
  const padding = content?.padding || "py-8 px-4";
  const background = content?.background || "bg-white";
  const maxWidth = content?.maxWidth || "max-w-6xl";
  const fullWidth = content?.fullWidth || false;
  const cssClasses = content?.cssClasses || "";
  
  // Section ID for anchor links
  const sectionId = section.id;
  
  return (
    <section 
      id={sectionId}
      className={cn(
        padding,
        background,
        cssClasses,
        className
      )}
    >
      <div className={cn(
        !fullWidth ? maxWidth : "",
        !fullWidth ? "mx-auto px-4" : "w-full"
      )}>
        {components.map((component) => (
          <ComponentRenderer 
            key={component.id} 
            component={component} 
          />
        ))}
      </div>
    </section>
  );
}