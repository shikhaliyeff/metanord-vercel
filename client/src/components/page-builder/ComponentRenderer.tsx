import React, { useState } from "react";
import { PageComponent } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Map } from "@/components/page-components";

interface ComponentRendererProps {
  component: PageComponent;
  className?: string;
  // For nested components within columns
  nestedMode?: boolean;
}

export function ComponentRenderer({ component, className, nestedMode = false }: ComponentRendererProps) {
  const { type } = component;

  switch (type) {
    case "heading":
      return renderHeading(component, className);
    case "paragraph":
      return renderParagraph(component, className);
    case "image":
      return renderImage(component, className);
    case "button":
      return renderButton(component, className);
    case "divider":
      return renderDivider(component, className);
    case "list":
      return renderList(component, className);
    case "map":
      return <Map component={component} className={className} />;
    case "columns":
      return renderColumns(component, className);
    case "accordion":
      return renderAccordion(component, className);
    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded">
          Unknown component type: {type}
        </div>
      );
  }
}

function renderHeading(component: PageComponent, className?: string) {
  const {
    text = "Heading",
    level = "h2",
    align = "left",
    color = "text-gray-900",
    cssClasses = ""
  } = component.content || {};

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align] || "text-left";

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={cn(alignmentClass, color, cssClasses, className)}>
      {text}
    </HeadingTag>
  );
}

function renderParagraph(component: PageComponent, className?: string) {
  const {
    text = "",
    align = "left",
    color = "text-gray-700",
    cssClasses = ""
  } = component.content || {};

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align] || "text-left";

  return (
    <p className={cn(alignmentClass, color, cssClasses, className)}>
      {text}
    </p>
  );
}

function renderImage(component: PageComponent, className?: string) {
  const {
    src = "",
    alt = "",
    width = "100%",
    height = "auto",
    objectFit = "cover",
    cssClasses = ""
  } = component.content || {};

  return (
    <div className={cn("overflow-hidden", cssClasses, className)}>
      <img
        src={src}
        alt={alt}
        className={cn("object-cover")}
        style={{
          width,
          height,
          objectFit: objectFit as "cover" | "contain" | "fill" | "none" | "scale-down"
        }}
      />
    </div>
  );
}

function renderButton(component: PageComponent, className?: string) {
  const {
    text = "Button",
    url = "#",
    variant = "primary",
    size = "md",
    align = "left",
    cssClasses = ""
  } = component.content || {};

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-blue-600 hover:bg-gray-100"
  }[variant] || "bg-blue-600 hover:bg-blue-700 text-white";

  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg"
  }[size] || "py-2 px-4";

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }[align] || "justify-start";

  return (
    <div className={cn("flex", alignmentClass)}>
      <a
        href={url}
        className={cn(
          "inline-block rounded transition-colors",
          variantClasses,
          sizeClasses,
          cssClasses,
          className
        )}
      >
        {text}
      </a>
    </div>
  );
}

function renderDivider(component: PageComponent, className?: string) {
  const {
    width = "w-full",
    color = "border-gray-200",
    thickness = "border-t",
    align = "center",
    cssClasses = ""
  } = component.content || {};

  const alignmentClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto"
  }[align] || "mx-auto";

  return (
    <div className={cn("py-2", cssClasses, className)}>
      <div className={cn("border-0", thickness, color, width, alignmentClass)} />
    </div>
  );
}

function renderList(component: PageComponent, className?: string) {
  const {
    items = [],
    listType = "bullet",
    align = "left",
    color = "text-gray-700",
    cssClasses = ""
  } = component.content || {};

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align] || "text-left";

  if (listType === "ordered") {
    return (
      <ol className={cn("list-decimal pl-5", alignmentClass, color, cssClasses, className)}>
        {items.map((item, index) => (
          <li key={index} className="my-1">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={cn("list-disc pl-5", alignmentClass, color, cssClasses, className)}>
      {items.map((item, index) => (
        <li key={index} className="my-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

function renderColumns(component: PageComponent, className?: string) {
  const {
    columns = [
      { id: "col1", content: [], width: "1/2" },
      { id: "col2", content: [], width: "1/2" }
    ],
    spacing = "gap-6",
    columnsOnMobile = 1,
    cssClasses = ""
  } = component.content || {};

  // Calculate responsive column classes
  const getColumnClass = (width: string) => {
    const widthMap: Record<string, string> = {
      "1/1": "w-full",
      "1/2": "sm:w-1/2", 
      "1/3": "sm:w-1/3",
      "2/3": "sm:w-2/3",
      "1/4": "sm:w-1/4",
      "3/4": "sm:w-3/4",
      "auto": "sm:w-auto"
    };
    
    // Default to full width on mobile
    return `w-full ${widthMap[width] || "sm:w-full"}`;
  };

  // Mobile columns configuration
  const mobileClass = columnsOnMobile === 1 
    ? "flex-col sm:flex-row" // Stack on mobile, row on larger screens
    : "flex-row flex-wrap"; // Keep as row but allow wrapping

  return (
    <div className={cn("flex", mobileClass, spacing, cssClasses, className)}>
      {columns.map((column) => (
        <div key={column.id} className={cn(getColumnClass(column.width))}>
          {/* Render nested components */}
          <div className="h-full">
            {Array.isArray(column.content) && column.content.map((nestedComponent: PageComponent) => (
              <ComponentRenderer
                key={nestedComponent.id}
                component={nestedComponent}
                nestedMode={true}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderAccordion(component: PageComponent, className?: string) {
  const {
    items = [
      { title: "Accordion Item 1", content: "Content for accordion item 1" },
      { title: "Accordion Item 2", content: "Content for accordion item 2" }
    ],
    allowMultiple = false,
    defaultOpen = [],
    cssClasses = ""
  } = component.content || {};

  const [openItems, setOpenItems] = useState<string[]>(defaultOpen || []);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={cn("space-y-2", cssClasses, className)}>
      {items.map((item, index) => {
        const itemId = `accordion-${component.id}-${index}`;
        const isOpen = openItems.includes(itemId);
        
        return (
          <div key={itemId} className="border rounded-lg overflow-hidden">
            <button
              className={cn(
                "flex justify-between items-center w-full px-4 py-3 text-left font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                isOpen ? "bg-blue-50 text-blue-700" : "bg-white hover:bg-gray-50"
              )}
              onClick={() => toggleItem(itemId)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <svg
                className={cn("w-5 h-5 transition-transform duration-200", isOpen ? "transform rotate-180" : "")}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                isOpen ? "max-h-96" : "max-h-0"
              )}
            >
              <div className="p-4 border-t">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}