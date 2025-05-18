import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layout, 
  Image, 
  PlusCircle, 
  Check, 
  Grid, 
  Rows, 
  MessageSquare, 
  Building, 
  Share2, 
  Columns, 
  ListIcon 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Template categories
const TEMPLATE_CATEGORIES = [
  "all",
  "hero",
  "content",
  "gallery",
  "grid",
  "contact",
  "split"
];

// Define template interface
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage: string;
  usageCount: number;
}

// Sample templates
const TEMPLATES: Template[] = [
  {
    id: "hero-standard",
    name: "Standard Hero",
    description: "Hero section with headline, subtitle, background image, and 2 CTA buttons",
    category: "hero",
    previewImage: "/templates/hero-standard.png",
    usageCount: 12
  },
  {
    id: "hero-centered",
    name: "Centered Hero",
    description: "Centered hero with large headline and single CTA button",
    category: "hero",
    previewImage: "/templates/hero-centered.png",
    usageCount: 8
  },
  {
    id: "product-highlight",
    name: "Product Highlight",
    description: "Grid of product features with icons and descriptions",
    category: "content",
    previewImage: "/templates/product-highlight.png",
    usageCount: 6
  },
  {
    id: "project-gallery",
    name: "Project Gallery",
    description: "Showcase of projects with filterable categories",
    category: "gallery",
    previewImage: "/templates/project-gallery.png",
    usageCount: 9
  },
  {
    id: "client-logos",
    name: "Client Logos Grid",
    description: "Display client or partner logos in a responsive grid",
    category: "grid",
    previewImage: "/templates/client-logos.png",
    usageCount: 4
  },
  {
    id: "contact-with-map",
    name: "Contact Form with Map",
    description: "Contact form alongside an embedded Google Map",
    category: "contact",
    previewImage: "/templates/contact-with-map.png",
    usageCount: 2
  },
  {
    id: "split-why-us",
    name: "Why Choose Us",
    description: "Split-screen layout highlighting company benefits",
    category: "split",
    previewImage: "/templates/split-why-us.png",
    usageCount: 5
  }
];

// Template Preview Component
const TemplatePreview = ({ template }: { template: Template }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const useTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      // This would actually call the API to use the template
      // But for now we'll just simulate it
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Template Applied",
        description: `The "${template.name}" template has been applied to your page.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to apply template: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {/* We'd use real preview images here, for now just showing colored placeholders */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ 
            background: `linear-gradient(120deg, ${
              template.category === "hero" ? "#3b82f6" : 
              template.category === "content" ? "#10b981" : 
              template.category === "gallery" ? "#8b5cf6" : 
              template.category === "grid" ? "#f59e0b" : 
              template.category === "contact" ? "#ef4444" : 
              "#6366f1"
            }, ${
              template.category === "hero" ? "#1d4ed8" : 
              template.category === "content" ? "#059669" : 
              template.category === "gallery" ? "#7c3aed" : 
              template.category === "grid" ? "#d97706" : 
              template.category === "contact" ? "#b91c1c" : 
              "#4f46e5"
            })` 
          }}
        >
          {template.category === "hero" && <Layout className="text-white h-10 w-10" />}
          {template.category === "content" && <ListIcon className="text-white h-10 w-10" />}
          {template.category === "gallery" && <Image className="text-white h-10 w-10" />}
          {template.category === "grid" && <Grid className="text-white h-10 w-10" />}
          {template.category === "contact" && <MessageSquare className="text-white h-10 w-10" />}
          {template.category === "split" && <Columns className="text-white h-10 w-10" />}
        </div>
        
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2"
        >
          {template.category}
        </Badge>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{template.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 flex-1">
        <p className="text-sm text-muted-foreground mb-2">
          {template.description}
        </p>
        <div className="text-xs text-muted-foreground">
          Used {template.usageCount} times
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t bg-muted/20">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Template: {template.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="aspect-video relative overflow-hidden bg-muted rounded-md mb-4">
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(120deg, ${
                      template.category === "hero" ? "#3b82f6" : 
                      template.category === "content" ? "#10b981" : 
                      template.category === "gallery" ? "#8b5cf6" : 
                      template.category === "grid" ? "#f59e0b" : 
                      template.category === "contact" ? "#ef4444" : 
                      "#6366f1"
                    }, ${
                      template.category === "hero" ? "#1d4ed8" : 
                      template.category === "content" ? "#059669" : 
                      template.category === "gallery" ? "#7c3aed" : 
                      template.category === "grid" ? "#d97706" : 
                      template.category === "contact" ? "#b91c1c" : 
                      "#4f46e5"
                    })` 
                  }}
                >
                  {template.category === "hero" && <Layout className="text-white h-16 w-16" />}
                  {template.category === "content" && <ListIcon className="text-white h-16 w-16" />}
                  {template.category === "gallery" && <Image className="text-white h-16 w-16" />}
                  {template.category === "grid" && <Grid className="text-white h-16 w-16" />}
                  {template.category === "contact" && <MessageSquare className="text-white h-16 w-16" />}
                  {template.category === "split" && <Columns className="text-white h-16 w-16" />}
                </div>
              </div>
              
              <p className="mb-4">
                Are you sure you want to use the <strong>{template.name}</strong> template? 
                This will add a new section to your page using this template.
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Pre-configured layout based on MetaNord's design system
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Responsive design for all screen sizes
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  All text and images will be editable after applying
                </li>
              </ul>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => useTemplateMutation.mutate(template.id)}
                disabled={useTemplateMutation.isPending}
              >
                {useTemplateMutation.isPending ? "Applying..." : "Apply Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export function TemplateLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter templates by active category
  const filteredTemplates = activeCategory === "all"
    ? TEMPLATES
    : TEMPLATES.filter(template => template.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Template Library</h2>
        <p className="text-muted-foreground">
          Reusable content templates styled to MetaNord's design system. 
          Use these to quickly build new pages or add sections to existing pages.
        </p>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap">
          {TEMPLATE_CATEGORIES.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize"
            >
              {category === "all" && "All Templates"}
              {category === "hero" && "Hero Sections"}
              {category === "content" && "Content Blocks"}
              {category === "gallery" && "Gallery Layouts"}
              {category === "grid" && "Grid Displays"}
              {category === "contact" && "Contact Sections"}
              {category === "split" && "Split Layouts"}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {TEMPLATE_CATEGORIES.map(category => (
          <TabsContent key={category} value={category} className="p-0 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplatePreview key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default TemplateLibrary;