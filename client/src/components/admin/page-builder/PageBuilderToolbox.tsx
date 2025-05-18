import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageComponent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateId } from "@/lib/utils";
import {
  AlignLeft,
  Box,
  ChevronsLeft,
  ChevronsRight,
  Columns,
  Divide,
  FileImage,
  GalleryHorizontalEnd,
  Heading1,
  LayoutGrid,
  List,
  LucideIcon,
  Map,
  MessageSquareQuote,
  Plus,
  MonitorPlay,
  Search,
  Text,
  Video
} from "lucide-react";

interface ComponentCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  components: ComponentTemplate[];
}

interface ComponentTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  template: Partial<PageComponent>;
}

interface PageBuilderToolboxProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, component: PageComponent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function PageBuilderToolbox({
  onDragStart,
  isCollapsed = false,
  onToggleCollapse
}: PageBuilderToolboxProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Define component categories
  const componentCategories: ComponentCategory[] = [
    {
      id: "layout",
      name: t("pageBuilder.categories.layout", "Layout"),
      icon: LayoutGrid,
      components: [
        {
          id: "section",
          name: t("pageBuilder.components.section", "Section"),
          icon: Box,
          description: t("pageBuilder.components.sectionDesc", "A container section with customizable background"),
          template: {
            id: generateId("component"),
            type: "section",
            name: "Section",
            content: {
              padding: "py-8",
              background: "bg-white",
              fullWidth: false,
              maxWidth: "max-w-7xl",
              cssClasses: ""
            }
          }
        },
        {
          id: "container",
          name: t("pageBuilder.components.container", "Container"),
          icon: Box,
          description: t("pageBuilder.components.containerDesc", "A basic container with customizable width"),
          template: {
            id: generateId("component"),
            type: "container",
            name: "Container",
            content: {
              padding: "p-4",
              maxWidth: "max-w-7xl",
              cssClasses: "",
              centered: true
            }
          }
        },
        {
          id: "columns",
          name: t("pageBuilder.components.columns", "Columns"),
          icon: Columns,
          description: t("pageBuilder.components.columnsDesc", "Multi-column layout with responsive sizing"),
          template: {
            id: generateId("component"),
            type: "columns",
            name: "Columns",
            content: {
              columns: [
                { id: "col1", content: [], width: "1/2" },
                { id: "col2", content: [], width: "1/2" }
              ],
              spacing: "gap-6",
              columnsOnMobile: 1
            }
          }
        },
        {
          id: "divider",
          name: t("pageBuilder.components.divider", "Divider"),
          icon: Divide,
          description: t("pageBuilder.components.dividerDesc", "A simple horizontal divider"),
          template: {
            id: generateId("component"),
            type: "divider",
            name: "Divider",
            content: {
              style: "solid",
              color: "#e2e8f0",
              width: "100%",
              height: "1px",
              margin: "my-6"
            }
          }
        }
      ]
    },
    {
      id: "text",
      name: t("pageBuilder.categories.text", "Text"),
      icon: Text,
      components: [
        {
          id: "heading",
          name: t("pageBuilder.components.heading", "Heading"),
          icon: Heading1,
          description: t("pageBuilder.components.headingDesc", "A heading text element with customizable size"),
          template: {
            id: generateId("component"),
            type: "heading",
            name: "Heading",
            content: {
              text: "Heading Text",
              size: "h2",
              alignment: "left",
              color: "#000000",
              margin: "mb-4"
            }
          }
        },
        {
          id: "paragraph",
          name: t("pageBuilder.components.paragraph", "Paragraph"),
          icon: AlignLeft,
          description: t("pageBuilder.components.paragraphDesc", "A paragraph text element"),
          template: {
            id: generateId("component"),
            type: "paragraph",
            name: "Paragraph",
            content: {
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              size: "base",
              alignment: "left",
              color: "#374151",
              margin: "mb-4",
              fontWeight: "normal"
            }
          }
        },
        {
          id: "list",
          name: t("pageBuilder.components.list", "List"),
          icon: List,
          description: t("pageBuilder.components.listDesc", "An ordered or unordered list"),
          template: {
            id: generateId("component"),
            type: "list",
            name: "List",
            content: {
              items: [
                "List item one",
                "List item two",
                "List item three"
              ],
              type: "unordered",
              iconType: "bullet",
              spacing: "normal"
            }
          }
        },
        {
          id: "quote",
          name: t("pageBuilder.components.quote", "Quote"),
          icon: MessageSquareQuote,
          description: t("pageBuilder.components.quoteDesc", "A stylized quote or testimonial"),
          template: {
            id: generateId("component"),
            type: "quote",
            name: "Quote",
            content: {
              text: "This is a quote or testimonial text.",
              author: "Author Name",
              position: "Author Position",
              alignment: "left",
              style: "default"
            }
          }
        }
      ]
    },
    {
      id: "media",
      name: t("pageBuilder.categories.media", "Media"),
      icon: FileImage,
      components: [
        {
          id: "image",
          name: t("pageBuilder.components.image", "Image"),
          icon: FileImage,
          description: t("pageBuilder.components.imageDesc", "A single responsive image"),
          template: {
            id: generateId("component"),
            type: "image",
            name: "Image",
            content: {
              src: "/placeholder-image.jpg",
              alt: "Image description",
              width: "100%",
              height: "auto",
              alignment: "center",
              borderRadius: "none",
              caption: ""
            }
          }
        },
        {
          id: "gallery",
          name: t("pageBuilder.components.gallery", "Gallery"),
          icon: GalleryHorizontalEnd,
          description: t("pageBuilder.components.galleryDesc", "A responsive image gallery"),
          template: {
            id: generateId("component"),
            type: "gallery",
            name: "Gallery",
            content: {
              images: [
                { src: "/placeholder-image-1.jpg", alt: "Gallery image 1", caption: "" },
                { src: "/placeholder-image-2.jpg", alt: "Gallery image 2", caption: "" },
                { src: "/placeholder-image-3.jpg", alt: "Gallery image 3", caption: "" }
              ],
              columns: 3,
              columnsOnMobile: 1,
              spacing: "gap-4",
              aspectRatio: "square",
              lightbox: true
            }
          }
        },
        {
          id: "video",
          name: t("pageBuilder.components.video", "Video"),
          icon: Video,
          description: t("pageBuilder.components.videoDesc", "Embed a video from YouTube or other sources"),
          template: {
            id: generateId("component"),
            type: "video",
            name: "Video",
            content: {
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              aspectRatio: "16/9",
              autoplay: false,
              controls: true,
              muted: false,
              caption: ""
            }
          }
        },
        {
          id: "map",
          name: t("pageBuilder.components.map", "Map"),
          icon: Map,
          description: t("pageBuilder.components.mapDesc", "Embed a Google Map or OpenStreetMap"),
          template: {
            id: generateId("component"),
            type: "map",
            name: "Map",
            content: {
              address: "Tallinn, Estonia",
              zoom: 14,
              height: "400px",
              mapType: "roadmap",
              showMarker: true
            }
          }
        }
      ]
    },
    {
      id: "interactive",
      name: t("pageBuilder.categories.interactive", "Interactive"),
      icon: MonitorPlay,
      components: [
        {
          id: "button",
          name: t("pageBuilder.components.button", "Button"),
          icon: Box,
          description: t("pageBuilder.components.buttonDesc", "A customizable button with link"),
          template: {
            id: generateId("component"),
            type: "button",
            name: "Button",
            content: {
              text: "Click Me",
              url: "#",
              type: "primary",
              size: "medium",
              alignment: "left",
              openInNewTab: false,
              fullWidth: false
            }
          }
        },
        {
          id: "cta",
          name: t("pageBuilder.components.cta", "Call-to-Action"),
          icon: MessageSquareQuote,
          description: t("pageBuilder.components.ctaDesc", "Eye-catching call-to-action section"),
          template: {
            id: generateId("component"),
            type: "cta",
            name: "Call-to-Action",
            content: {
              heading: "Ready to Get Started?",
              text: "Contact us today to learn more about our products and services.",
              buttonText: "Contact Us",
              buttonUrl: "/contact",
              buttonType: "primary",
              background: "bg-primary/10",
              textColor: "#000000",
              layout: "horizontal",
              alignment: "center",
              localized: {
                heading: {},
                text: {},
                buttonText: {}
              }
            }
          }
        },
        {
          id: "product-grid",
          name: t("pageBuilder.components.productGrid", "Product Grid"),
          icon: LayoutGrid,
          description: t("pageBuilder.components.productGridDesc", "Display a grid of products"),
          template: {
            id: generateId("component"),
            type: "product-grid",
            name: "Product Grid",
            content: {
              productIds: [],
              category: "",
              columns: 3,
              columnsOnMobile: 1,
              displayType: "grid",
              showDescription: true,
              showCategory: true
            }
          }
        }
      ]
    }
  ];
  
  // Helper function to filter components based on search term
  const filterComponents = () => {
    let filteredCategories = [...componentCategories];
    
    if (searchTerm) {
      // Filter components within each category that match the search term
      filteredCategories = filteredCategories.map(category => {
        return {
          ...category,
          components: category.components.filter(component => 
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        };
      });
      
      // Only keep categories that have matching components
      filteredCategories = filteredCategories.filter(category => category.components.length > 0);
    }
    
    if (activeCategory !== 'all') {
      // Only show components from the selected category
      filteredCategories = filteredCategories.filter(category => category.id === activeCategory);
    }
    
    return filteredCategories;
  };
  
  // Handle component drag start
  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, template: Partial<PageComponent>) => {
    // Create a full component from the template
    const component: PageComponent = {
      id: generateId("component"),
      type: template.type || "unknown",
      name: template.name || "Unnamed Component",
      content: template.content || {}
    };
    
    // Call the parent drag start handler
    onDragStart(e, component);
    
    // Set drag image and data
    e.dataTransfer.setData("component", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
    
    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.className = "bg-primary text-white rounded px-2 py-1 text-sm";
    dragImage.textContent = component.name;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image element after a short timeout
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 100);
  };
  
  if (isCollapsed) {
    return (
      <div className="w-12 flex-shrink-0 flex flex-col items-center border-r bg-background p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronsRight className="h-5 w-5" />
        </Button>
        
        {componentCategories.map(category => (
          <div 
            key={category.id}
            className="w-8 h-8 flex items-center justify-center mb-2 rounded hover:bg-accent cursor-pointer"
            title={category.name}
          >
            <category.icon className="h-5 w-5 text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="w-64 flex-shrink-0 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-sm font-medium">{t("pageBuilder.toolbox", "Components")}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("pageBuilder.searchComponents", "Search components...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
        <TabsList className="mx-2 bg-muted/50">
          <TabsTrigger value="all" className="text-xs">
            {t("pageBuilder.allComponents", "All")}
          </TabsTrigger>
          {componentCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs flex items-center gap-1">
              <category.icon className="h-3 w-3" />
              <span className="hidden md:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <ScrollArea className="flex-1 p-2">
          {filterComponents().map(category => (
            <div key={category.id} className="mb-4">
              {(activeCategory === 'all' || filterComponents().length > 1) && (
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.name}
                </h3>
              )}
              
              <div className="grid gap-2">
                {category.components.map(component => (
                  <div
                    key={component.id}
                    className="border rounded-md p-2 cursor-move hover:bg-accent/50 transition-colors"
                    draggable
                    onDragStart={(e) => handleComponentDragStart(e, component.template)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted">
                        <component.icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{component.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{component.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </Tabs>
      
      <div className="p-2 border-t">
        <Button variant="outline" className="w-full text-xs h-9 text-muted-foreground" size="sm">
          <Plus className="h-3 w-3 mr-2" />
          {t("pageBuilder.createComponent", "Create Component")}
        </Button>
      </div>
    </div>
  );
}