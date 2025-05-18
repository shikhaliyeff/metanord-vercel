import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageSection, PageComponent } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Layers,
  PlusCircle,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Move,
  Smartphone,
  Tablet,
  Monitor,
  AlignLeft,
  Image,
  List,
  Box,
  Map,
  GalleryHorizontalEnd,
  MessageSquareQuote
} from "lucide-react";

export interface PageBuilderCanvasProps {
  pageContent: PageSection[];
  selectedSection: PageSection | null;
  selectedComponent: PageComponent | null;
  onSelectSection: (section: PageSection | null) => void;
  onSelectComponent: (component: PageComponent | null) => void;
  onUpdatePageContent: (content: PageSection[]) => void;
  isLoading?: boolean;
  previewMode?: boolean;
  viewportSize?: "desktop" | "tablet" | "mobile";
}

// Helper function to get localized content based on current language
function getLocalizedContent(component: PageComponent, field: string, language?: string): string {
  const { i18n } = useTranslation();
  const currentLang = language || i18n.language.split('-')[0] || "en";
  
  if (!component.content?.localized?.[field]?.[currentLang]) {
    return component.content?.[field] || "";
  }
  return component.content.localized[field][currentLang];
}

// Helper function to get localized list items
function getLocalizedListItems(component: PageComponent, language?: string): string[] {
  const { i18n } = useTranslation();
  const currentLang = language || i18n.language.split('-')[0] || "en";
  
  if (!component.content?.localized?.items?.[currentLang]) {
    return component.content?.items || [];
  }
  return component.content.localized.items[currentLang] || [];
}

export function PageBuilderCanvas({
  pageContent,
  selectedSection,
  selectedComponent,
  onSelectSection,
  onSelectComponent,
  onUpdatePageContent,
  isLoading = false,
  previewMode = false,
  viewportSize = "desktop"
}: PageBuilderCanvasProps) {
  const { t, i18n } = useTranslation();
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  const addNewSection = () => {
    const newSection: PageSection = {
      id: generateId(),
      title: t("pageBuilder.newSection", "New Section"),
      type: "default",
      components: [],
      settings: {
        fullWidth: false,
        maxWidth: "max-w-7xl",
        paddingTop: "pt-8",
        paddingBottom: "pb-8",
        backgroundColor: "bg-white"
      }
    };
    
    const updatedContent = [...pageContent, newSection];
    onUpdatePageContent(updatedContent);
    onSelectSection(newSection);
    onSelectComponent(null);
  };
  
  const removeSection = (sectionId: string) => {
    const updatedContent = pageContent.filter(section => section.id !== sectionId);
    onUpdatePageContent(updatedContent);
    
    if (selectedSection?.id === sectionId) {
      onSelectSection(null);
      onSelectComponent(null);
    }
  };
  
  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = pageContent.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const updatedContent = [...pageContent];
    
    if (direction === "up" && sectionIndex > 0) {
      const temp = updatedContent[sectionIndex];
      updatedContent[sectionIndex] = updatedContent[sectionIndex - 1];
      updatedContent[sectionIndex - 1] = temp;
    } else if (direction === "down" && sectionIndex < pageContent.length - 1) {
      const temp = updatedContent[sectionIndex];
      updatedContent[sectionIndex] = updatedContent[sectionIndex + 1];
      updatedContent[sectionIndex + 1] = temp;
    }
    
    onUpdatePageContent(updatedContent);
  };
  
  const duplicateSection = (section: PageSection) => {
    const duplicatedSection: PageSection = {
      ...section,
      id: generateId(),
      title: `${section.title} (${t("pageBuilder.copy", "Copy")})`,
      components: section.components.map(component => ({
        ...component,
        id: generateId()
      }))
    };
    
    const sectionIndex = pageContent.findIndex(s => s.id === section.id);
    const updatedContent = [...pageContent];
    updatedContent.splice(sectionIndex + 1, 0, duplicatedSection);
    
    onUpdatePageContent(updatedContent);
  };
  
  const removeComponent = (sectionId: string, componentId: string) => {
    const updatedContent = pageContent.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.filter(component => component.id !== componentId)
        };
      }
      return section;
    });
    
    onUpdatePageContent(updatedContent);
    
    if (selectedComponent?.id === componentId) {
      onSelectComponent(null);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: PageComponent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, section: PageSection) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setDragOverSectionId(section.id);
  };
  
  const handleDragLeave = () => {
    setDragOverSectionId(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSection: PageSection) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);
    
    try {
      const componentData = e.dataTransfer.getData("application/json");
      if (!componentData) return;
      
      const droppedComponent: PageComponent = JSON.parse(componentData);
      
      // If dragging from toolbox, create a new component
      if (!droppedComponent.parentSectionId) {
        const newComponent: PageComponent = {
          ...droppedComponent,
          id: generateId(),
          parentSectionId: targetSection.id
        };
        
        const updatedContent = pageContent.map(section => {
          if (section.id === targetSection.id) {
            return {
              ...section,
              components: [...section.components, newComponent]
            };
          }
          return section;
        });
        
        onUpdatePageContent(updatedContent);
        onSelectComponent(newComponent);
      } else {
        // If dragging from another section, move component
        const sourceSectionId = droppedComponent.parentSectionId;
        
        if (sourceSectionId === targetSection.id) {
          // Already in the same section, do nothing
          return;
        }
        
        // Remove from source section
        let updatedContent = pageContent.map(section => {
          if (section.id === sourceSectionId) {
            return {
              ...section,
              components: section.components.filter(comp => comp.id !== droppedComponent.id)
            };
          }
          return section;
        });
        
        // Add to target section
        const newComponent: PageComponent = {
          ...droppedComponent,
          parentSectionId: targetSection.id
        };
        
        updatedContent = updatedContent.map(section => {
          if (section.id === targetSection.id) {
            return {
              ...section,
              components: [...section.components, newComponent]
            };
          }
          return section;
        });
        
        onUpdatePageContent(updatedContent);
        onSelectComponent(newComponent);
      }
    } catch (err) {
      console.error("Error handling drop:", err);
    }
  };
  
  const handleComponentClick = (e: React.MouseEvent, component: PageComponent) => {
    e.stopPropagation();
    onSelectComponent(component);
    onSelectSection(null);
  };
  
  const handleSectionClick = (e: React.MouseEvent, section: PageSection) => {
    onSelectSection(section);
    onSelectComponent(null);
  };
  
  const duplicateComponent = (e: React.MouseEvent, sectionId: string, component: PageComponent) => {
    e.stopPropagation();
    
    const duplicatedComponent: PageComponent = {
      ...component,
      id: generateId(),
      name: `${component.name} (${t("pageBuilder.copy", "Copy")})`
    };
    
    const updatedContent = pageContent.map(section => {
      if (section.id === sectionId) {
        const componentIndex = section.components.findIndex(c => c.id === component.id);
        const updatedComponents = [...section.components];
        updatedComponents.splice(componentIndex + 1, 0, duplicatedComponent);
        
        return {
          ...section,
          components: updatedComponents
        };
      }
      return section;
    });
    
    onUpdatePageContent(updatedContent);
    onSelectComponent(duplicatedComponent);
  };
  
  const getComponentDisplay = (component: PageComponent) => {
    if (previewMode) {
      switch (component.type) {
        case "heading":
          const headingSize = component.content?.size || "h2";
          const headingText = getLocalizedContent(component, "text");
          const headingAlignment = component.content?.alignment || "left";
          const textColor = component.content?.color || "#000000";
          
          let HeadingTag: keyof JSX.IntrinsicElements = "h2";
          let sizeClass = "text-2xl";
          
          switch (headingSize) {
            case "h1":
              HeadingTag = "h1";
              sizeClass = "text-4xl font-bold";
              break;
            case "h2":
              HeadingTag = "h2";
              sizeClass = "text-3xl font-semibold";
              break;
            case "h3":
              HeadingTag = "h3";
              sizeClass = "text-2xl font-semibold";
              break;
            case "h4":
              HeadingTag = "h4";
              sizeClass = "text-xl font-semibold";
              break;
            case "h5":
              HeadingTag = "h5";
              sizeClass = "text-lg font-semibold";
              break;
            case "h6":
              HeadingTag = "h6";
              sizeClass = "text-base font-semibold";
              break;
          }
          
          let alignClass = "text-left";
          switch (headingAlignment) {
            case "center":
              alignClass = "text-center";
              break;
            case "right":
              alignClass = "text-right";
              break;
          }
          
          return (
            <HeadingTag 
              className={`${sizeClass} ${alignClass} mb-4`}
              style={{ color: textColor }}
            >
              {headingText}
            </HeadingTag>
          );
          
        case "paragraph":
          const paragraphText = getLocalizedContent(component, "text");
          const paragraphSize = component.content?.size || "base";
          const paragraphAlignment = component.content?.alignment || "left";
          const paragraphColor = component.content?.color || "#374151";
          
          let textSizeClass = "text-base";
          switch (paragraphSize) {
            case "xs":
              textSizeClass = "text-xs";
              break;
            case "sm":
              textSizeClass = "text-sm";
              break;
            case "base":
              textSizeClass = "text-base";
              break;
            case "lg":
              textSizeClass = "text-lg";
              break;
            case "xl":
              textSizeClass = "text-xl";
              break;
          }
          
          let textAlignClass = "text-left";
          switch (paragraphAlignment) {
            case "center":
              textAlignClass = "text-center";
              break;
            case "right":
              textAlignClass = "text-right";
              break;
            case "justify":
              textAlignClass = "text-justify";
              break;
          }
          
          return (
            <p 
              className={`${textSizeClass} ${textAlignClass} mb-4`}
              style={{ color: paragraphColor }}
            >
              {paragraphText}
            </p>
          );
          
        case "image":
          const src = component.content?.src || "";
          const alt = component.content?.alt || "";
          const width = component.content?.width || "100%";
          const height = component.content?.height || "auto";
          const borderRadius = component.content?.borderRadius || "none";
          const caption = getLocalizedContent(component, "caption");
          
          return (
            <figure className="mb-4">
              <img 
                src={src} 
                alt={alt} 
                style={{ 
                  width, 
                  height, 
                  borderRadius,
                  display: "block",
                  maxWidth: "100%",
                  margin: "0 auto"
                }}
                className="object-cover"
              />
              {caption && (
                <figcaption className="text-sm text-center text-muted-foreground mt-2">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
          
        case "list":
          const listItems = getLocalizedListItems(component);
          const listType = component.content?.type || "unordered";
          
          if (listType === "ordered") {
            return (
              <ol className="list-decimal pl-5 mb-4 space-y-1">
                {listItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            );
          } else {
            return (
              <ul className="list-disc pl-5 mb-4 space-y-1">
                {listItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );
          }
          
        case "button":
          const buttonText = getLocalizedContent(component, "text") || t("pageBuilder.button", "Button");
          const buttonUrl = component.content?.url || "#";
          const buttonType = component.content?.type || "primary";
          const buttonSize = component.content?.size || "medium";
          const openInNewTab = component.content?.openInNewTab || false;
          
          let buttonVariant = "bg-primary hover:bg-primary/90 text-white";
          switch (buttonType) {
            case "secondary":
              buttonVariant = "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
              break;
            case "outline":
              buttonVariant = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
              break;
            case "ghost":
              buttonVariant = "hover:bg-accent hover:text-accent-foreground";
              break;
            case "link":
              buttonVariant = "text-primary underline-offset-4 hover:underline";
              break;
          }
          
          let buttonSizeClass = "h-10 px-4 py-2";
          switch (buttonSize) {
            case "small":
              buttonSizeClass = "h-8 px-3 py-1 text-sm";
              break;
            case "large":
              buttonSizeClass = "h-12 px-6 py-3";
              break;
          }
          
          return (
            <a 
              href={buttonUrl}
              target={openInNewTab ? "_blank" : "_self"}
              rel={openInNewTab ? "noopener noreferrer" : ""}
              className={`inline-flex items-center justify-center rounded-md ${buttonVariant} ${buttonSizeClass} font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background`}
            >
              {buttonText}
            </a>
          );
          
        case "divider":
          const dividerColor = component.content?.color || "#e2e8f0";
          const dividerWidth = component.content?.width || "100%";
          const dividerHeight = component.content?.height || "1px";
          const dividerMargin = component.content?.margin || "my-6";
          
          return (
            <hr 
              className={dividerMargin}
              style={{ 
                width: dividerWidth, 
                height: dividerHeight, 
                backgroundColor: dividerColor,
                border: "none",
                margin: "auto"
              }}
            />
          );

        case "map":
          const mapAddress = getLocalizedContent(component, "address") || "Tallinn, Estonia";
          const mapZoom = component.content?.zoom || 14;
          const mapHeight = component.content?.height || "400px";
          const mapType = component.content?.mapType || "roadmap";
          const showMarker = component.content?.showMarker !== false;
          
          // Create a clean address string for URLs (no spaces, special chars)
          const cleanAddress = encodeURIComponent(mapAddress);
          
          return (
            <div 
              className="w-full rounded-md overflow-hidden"
              style={{ height: mapHeight }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBGWRD_q_LfVkzRcRZKaJl1fLj-8wHT8TY&q=${cleanAddress}&zoom=${mapZoom}&maptype=${mapType}`}
                allowFullScreen
              ></iframe>
            </div>
          );
          
        case "gallery":
          const galleryImages = component.content?.images || [];
          const columns = component.content?.columns || 3;
          const columnsOnMobile = component.content?.columnsOnMobile || 1;
          const spacing = component.content?.spacing || "gap-4";
          const galleryLayout = component.content?.layout || "grid";
          
          let gridTemplateColumns = "";
          if (viewportSize === "mobile") {
            gridTemplateColumns = `repeat(${columnsOnMobile}, 1fr)`;
          } else {
            gridTemplateColumns = `repeat(${columns}, 1fr)`;
          }
          
          return (
            <div className={`w-full ${spacing}`}>
              <div 
                className={`grid ${spacing}`} 
                style={{ gridTemplateColumns }}
              >
                {galleryImages.map((image: any, index: number) => {
                  // Get localized caption if available
                  const caption = getLocalizedContent(
                    { 
                      content: { 
                        localized: image.localized || {} 
                      } 
                    } as any, 
                    "caption"
                  ) || image.caption || "";
                  
                  return (
                    <div key={index} className="relative group">
                      <img 
                        src={image.src} 
                        alt={image.alt || ""} 
                        className="w-full h-auto rounded-md object-cover aspect-square"
                      />
                      {caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                          {caption}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case "cta":
          // Get localized content
          const ctaHeading = getLocalizedContent(component, "heading") || "Ready to Get Started?";
          const ctaText = getLocalizedContent(component, "text") || "Contact us today to learn more about our products and services.";
          const ctaButtonText = getLocalizedContent(component, "buttonText") || "Contact Us";
          const ctaButtonUrl = component.content?.buttonUrl || "/contact";
          const ctaButtonType = component.content?.buttonType || "primary";
          const ctaBackground = component.content?.background || "bg-primary/10";
          const ctaTextColor = component.content?.textColor || "#000000";
          const ctaLayout = component.content?.layout || "horizontal";
          const ctaAlignment = component.content?.alignment || "center";
          
          // Determine layout classes
          const ctaFlexDirection = ctaLayout === "horizontal" ? "flex-row" : "flex-col";
          let ctaAlignmentClass = "items-center justify-center text-center";
          if (ctaAlignment === "left") {
            ctaAlignmentClass = "items-start justify-start text-left";
          } else if (ctaAlignment === "right") {
            ctaAlignmentClass = "items-end justify-end text-right";
          }
          
          // Determine button style
          let ctaButtonClass = "bg-primary text-white hover:bg-primary/90";
          if (ctaButtonType === "secondary") {
            ctaButtonClass = "bg-secondary text-secondary-foreground hover:bg-secondary/90";
          } else if (ctaButtonType === "outline") {
            ctaButtonClass = "border border-primary text-primary hover:bg-primary/10";
          }
          
          return (
            <div className={`w-full p-8 rounded-lg ${ctaBackground}`}>
              <div className={`flex gap-6 ${ctaFlexDirection} ${ctaAlignmentClass}`} style={{ color: ctaTextColor }}>
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-2xl font-bold">{ctaHeading}</h3>
                  <p>{ctaText}</p>
                </div>
                <div className="flex-shrink-0">
                  <a 
                    href={ctaButtonUrl}
                    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${ctaButtonClass}`}
                  >
                    {ctaButtonText}
                  </a>
                </div>
              </div>
            </div>
          );
          
        default:
          return <div className="p-4 border border-dashed rounded-md">Component: {component.type}</div>;
      }
    } else {
      // Editor mode - simplified component representation
      let icon;
      switch (component.type) {
        case "heading":
          icon = <AlignLeft className="h-4 w-4" />;
          break;
        case "image":
          icon = <Image className="h-4 w-4" />;
          break;
        case "list":
          icon = <List className="h-4 w-4" />;
          break;
        case "map":
          icon = <Map className="h-4 w-4" />;
          break;
        case "gallery":
          icon = <GalleryHorizontalEnd className="h-4 w-4" />;
          break;
        case "cta":
          icon = <MessageSquareQuote className="h-4 w-4" />;
          break;
        default:
          icon = <Box className="h-4 w-4" />;
      }
      
      const isSelected = selectedComponent?.id === component.id;
      
      return (
        <div
          className={cn(
            "p-4 mb-2 border rounded-md flex items-center group",
            isSelected ? "border-primary bg-primary/5" : "border-dashed hover:border-border"
          )}
          onClick={(e) => handleComponentClick(e, component)}
        >
          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            {icon}
          </div>
          <div className="flex-1 overflow-hidden text-sm">
            <div className="font-medium truncate">{component.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {component.type}: {component.content?.text || ""}
            </div>
          </div>
          
          {!previewMode && (
            <div className={cn(
              "flex items-center gap-1",
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => duplicateComponent(e, component.parentSectionId!, component)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeComponent(component.parentSectionId!, component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      );
    }
  };
  
  const getViewportClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "max-w-full";
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Viewport size controls for preview */}
      {previewMode && (
        <div className="flex justify-center items-center gap-2 p-2 border-b">
          <Button 
            variant={viewportSize === "mobile" ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => {}}
            title={t("pageBuilder.mobileView", "Mobile View")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewportSize === "tablet" ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => {}}
            title={t("pageBuilder.tabletView", "Tablet View")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewportSize === "desktop" ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => {}}
            title={t("pageBuilder.desktopView", "Desktop View")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <ScrollArea className="flex-1 overflow-auto">
        <div className="min-h-full p-6 bg-accent/20">
          <div className={cn("mx-auto bg-background rounded-lg shadow-sm transition-all duration-200", getViewportClass())}>
            {/* Page content */}
            {pageContent.map((section) => {
              const isSelected = selectedSection?.id === section.id;
              const isDragOver = dragOverSectionId === section.id;
              
              // Get section CSS classes from settings
              const sectionMaxWidth = section.settings?.maxWidth || "max-w-7xl";
              const sectionPaddingTop = section.settings?.paddingTop || "pt-8";
              const sectionPaddingBottom = section.settings?.paddingBottom || "pb-8";
              const sectionBgColor = section.settings?.backgroundColor || "bg-white";
              const sectionFullWidth = section.settings?.fullWidth || false;
              const sectionCustomClasses = section.settings?.cssClasses || "";
              
              return (
                <div 
                  key={section.id}
                  className={cn(
                    sectionBgColor,
                    sectionFullWidth ? "w-full" : "",
                    sectionCustomClasses,
                    !previewMode && "group relative",
                    !previewMode && (isSelected ? "outline outline-2 outline-primary" : "hover:outline hover:outline-1 hover:outline-muted-foreground/30")
                  )}
                  onClick={(e) => !previewMode && handleSectionClick(e, section)}
                  onDragOver={(e) => !previewMode && handleDragOver(e, section)}
                  onDragLeave={() => !previewMode && handleDragLeave()}
                  onDrop={(e) => !previewMode && handleDrop(e, section)}
                >
                  {/* Section control toolbar - only in editor mode */}
                  {!previewMode && (
                    <div className={cn(
                      "absolute -top-3 left-4 flex items-center space-x-1 text-xs rounded-md border bg-background shadow-sm",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      <div className="flex items-center px-2 py-1 bg-primary/10 rounded-l-md">
                        <Layers className="h-3 w-3 mr-1 text-primary" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(section.id, "up");
                        }}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(section.id, "down");
                        }}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(section);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Section content wrapper */}
                  <div 
                    className={cn(
                      "mx-auto px-4",
                      sectionMaxWidth,
                      sectionPaddingTop,
                      sectionPaddingBottom
                    )}
                  >
                    {section.components.length > 0 ? (
                      // Render components
                      section.components.map((component) => (
                        <div key={component.id} className="mb-4">
                          {getComponentDisplay(component)}
                        </div>
                      ))
                    ) : (
                      // Empty section placeholder - only in editor mode
                      !previewMode && (
                        <div 
                          className={cn(
                            "p-8 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground",
                            isDragOver ? "border-primary bg-primary/5" : ""
                          )}
                        >
                          <Move className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">
                            {t("pageBuilder.dragComponentsHere", "Drag components here")}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add section button - only in editor mode */}
            {!previewMode && (
              <div className="flex justify-center p-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={addNewSection}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("pageBuilder.addSection", "Add Section")}
                </Button>
              </div>
            )}
            
            {/* Empty state for new pages */}
            {pageContent.length === 0 && !previewMode && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("pageBuilder.emptyPage", "Empty Page")}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {t("pageBuilder.emptyPageDescription", "Start building your page by adding a section. Then drag and drop components from the toolbox.")}
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={addNewSection}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("pageBuilder.addFirstSection", "Add Your First Section")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}