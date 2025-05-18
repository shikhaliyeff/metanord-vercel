import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  FileCode,
  Globe,
  HomeIcon,
  Info,
  Layers,
  Loader2,
  Save,
  Settings,
  User
} from "lucide-react";

// Define the structure of website pages
const WEBSITE_PAGES = [
  { id: "home", name: "Home Page", path: "/", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
  { id: "about", name: "About Us", path: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
  { id: "products", name: "Products", path: "/products", icon: <Layers className="h-4 w-4 mr-2" /> },
  { id: "contact", name: "Contact", path: "/contact", icon: <User className="h-4 w-4 mr-2" /> },
];

// Languages supported by the site
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

export function PageEditor() {
  const [activePage, setActivePage] = useState("home");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewData, setPreviewData] = useState<{
    previewId: string;
    previewUrl: string;
    timestamp: number;
  } | null>(null);
  const { toast } = useToast();

  // Define content item type
  interface ContentItem {
    id: number;
    section: string;
    key: string;
    value: string;
    language: string;
  }
  
  // Fetch page content
  const { data: pageContent, isLoading: isLoadingPageContent } = useQuery<ContentItem[]>({
    queryKey: ["/api/content", activePage, activeLanguage],
    queryFn: async () => {
      const res = await fetch(`/api/content/section/${activePage}?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch page content");
      return res.json();
    }
  });
  
  // If we're on the home page, also fetch hero content
  const { data: heroContent, isLoading: isLoadingHeroContent } = useQuery<ContentItem[]>({
    queryKey: ["/api/hero", activeLanguage],
    queryFn: async () => {
      const res = await fetch(`/api/hero?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch hero content");
      return res.json();
    },
    enabled: activePage === "home"
  });
  
  // Define product type
  interface ProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    featured: boolean;
    images: string[];
    language: string;
  }
  
  // If we're on the products page, fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<ProductItem[]>({
    queryKey: ["/api/products", activeLanguage],
    queryFn: async () => {
      const res = await fetch(`/api/products?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: activePage === "products"
  });
  
  // Save content mutation
  const updateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/content", data);
      if (!res.ok) throw new Error("Failed to update content");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Success",
        description: "Page content updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update content: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Generate live preview for content
  const generatePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      // Gather all content from the form fields
      const contentData: Record<string, string> = {};
      
      // Get form elements based on active page
      const formElements = document.querySelectorAll(`#${activePage}-content input, #${activePage}-content textarea`);
      formElements.forEach((element: Element) => {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
        if (inputElement.id) {
          contentData[inputElement.id] = inputElement.value;
        }
      });
      
      // Gather hero content if on home page
      if (activePage === "home") {
        const heroElements = document.querySelectorAll(`#hero-content input, #hero-content textarea`);
        heroElements.forEach((element: Element) => {
          const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
          if (inputElement.id) {
            contentData[inputElement.id] = inputElement.value;
          }
        });
      }
      
      // Send to preview API
      const response = await apiRequest("POST", "/api/admin/preview", {
        contentType: activePage,
        content: contentData,
        language: activeLanguage
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate preview");
      }
      
      const result = await response.json();
      
      // Store preview data
      setPreviewData({
        previewId: result.previewId,
        previewUrl: result.previewUrl,
        timestamp: Date.now()
      });
      
      // Show a success toast
      toast({
        title: "Preview Generated",
        description: "Live preview is ready",
      });
      
      // Ensure preview is visible
      setShowPreview(true);
      
    } catch (error) {
      console.error("Preview generation error:", error);
      toast({
        title: "Preview Error",
        description: error instanceof Error ? error.message : "Failed to generate preview",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };
  
  // Handle save for all content on page
  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      // Gather all content from the form fields
      interface ContentUpdate {
        section: string;
        key: string;
        value: string;
        language: string;
      }
      
      const updates: ContentUpdate[] = [];
      
      // Get form elements based on active page
      const formElements = document.querySelectorAll(`#${activePage}-content input, #${activePage}-content textarea`);
      formElements.forEach((element: Element) => {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
        if (inputElement.id) {
          updates.push({
            section: activePage,
            key: inputElement.id.replace(/-/g, '_'),
            value: inputElement.value,
            language: activeLanguage
          });
        }
      });
      
      // Special handling for hero content on home page
      if (activePage === "home") {
        const heroElements = document.querySelectorAll(`#hero-content input, #hero-content textarea`);
        heroElements.forEach((element: Element) => {
          const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
          if (inputElement.id) {
            updates.push({
              section: "hero",
              key: inputElement.id.replace(/-/g, '_'),
              value: inputElement.value,
              language: activeLanguage
            });
          }
        });
      }
      
      // Save each content item
      for (const item of updates) {
        await updateContentMutation.mutateAsync(item);
      }
      
      // Create a content version for backup/history
      try {
        await apiRequest("POST", "/api/admin/content/version", {
          contentType: activePage,
          contentId: null, // Main content, not a specific item
          data: updates,
          version: 1, // Will be incremented server-side
          createdBy: null // Current user ID will be filled in server-side
        });
      } catch (versionError) {
        console.error("Failed to create content version:", versionError);
        // Don't throw, as the main content update succeeded
      }
      
      toast({
        title: "Success",
        description: "Page content saved successfully",
      });
      
      // Clear any preview since it's now outdated
      setPreviewData(null);
      
    } catch (error) {
      console.error("Content save error:", error);
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading states
  const isLoading = isLoadingPageContent || 
    (activePage === "home" && isLoadingHeroContent) || 
    (activePage === "products" && isLoadingProducts);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Website Pages Editor</CardTitle>
            <CardDescription>
              Edit content and preview all website pages
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select 
              value={activeLanguage} 
              onValueChange={setActiveLanguage}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="preview-mode"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="preview-mode">Preview</Label>
            </div>
            
            <Button 
              onClick={handleSaveContent} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page Navigation Sidebar */}
          <div className="col-span-1">
            <div className="rounded-md border">
              <div className="p-4 border-b bg-muted/40">
                <h3 className="text-sm font-medium">Website Pages</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a page to edit
                </p>
              </div>
              
              <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px]">
                <div className="p-2">
                  {WEBSITE_PAGES.map(page => (
                    <Button
                      key={page.id}
                      variant={activePage === page.id ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1 text-left"
                      onClick={() => setActivePage(page.id)}
                    >
                      {page.icon}
                      {page.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Content Editor and Preview */}
          <div className="col-span-1 lg:col-span-3">
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="p-4 border-b bg-muted/40 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">
                      {WEBSITE_PAGES.find(p => p.id === activePage)?.name} Content
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit content in {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generatePreview}
                      disabled={isGeneratingPreview}
                    >
                      {isGeneratingPreview ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Generate Preview
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Preview
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList>
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4 mt-4">
                      {activePage === "home" && (
                        <div className="space-y-4">
                          <div id="hero-content">
                            <div>
                              <Label htmlFor="hero-title">Hero Title</Label>
                              <Input 
                                id="hero-title" 
                                placeholder="Enter main headline" 
                                defaultValue={heroContent?.find((item: ContentItem) => item.key === "title")?.value || ""}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                              <Textarea 
                                id="hero-subtitle" 
                                placeholder="Enter subheadline" 
                                defaultValue={heroContent?.find((item: ContentItem) => item.key === "subtitle")?.value || ""}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="cta-primary">Primary Button Text</Label>
                                <Input 
                                  id="cta-primary" 
                                  placeholder="e.g., Learn More" 
                                  defaultValue={heroContent?.find((item: ContentItem) => item.key === "cta_primary")?.value || ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cta-primary-url">Primary Button URL</Label>
                                <Input 
                                  id="cta-primary-url" 
                                  placeholder="e.g., /about" 
                                  defaultValue={heroContent?.find((item: ContentItem) => item.key === "cta_primary_url")?.value || ""}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="cta-secondary">Secondary Button Text</Label>
                                <Input 
                                  id="cta-secondary" 
                                  placeholder="e.g., Contact Us" 
                                  defaultValue={heroContent?.find((item: ContentItem) => item.key === "cta_secondary")?.value || ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cta-secondary-url">Secondary Button URL</Label>
                                <Input 
                                  id="cta-secondary-url" 
                                  placeholder="e.g., /contact" 
                                  defaultValue={heroContent?.find((item: ContentItem) => item.key === "cta_secondary_url")?.value || ""}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div id="home-content">
                            <div>
                              <Label htmlFor="featured-section">Featured Section Content</Label>
                              <Textarea 
                                id="featured-section" 
                                rows={4}
                                placeholder="Enter featured section content" 
                                defaultValue={pageContent?.find((item: ContentItem) => item.key === "featured_section")?.value || ""}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activePage === "about" && (
                        <div className="space-y-4" id="about-content">
                          <div>
                            <Label htmlFor="about-title">About Page Title</Label>
                            <Input 
                              id="about-title" 
                              placeholder="Enter page title" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "page_title")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="company-description">Company Description</Label>
                            <Textarea 
                              id="company-description" 
                              rows={5}
                              placeholder="Enter company description" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "company_description")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="mission">Our Mission</Label>
                            <Textarea 
                              id="mission" 
                              rows={3}
                              placeholder="Enter company mission" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "mission")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="values">Our Values</Label>
                            <Textarea 
                              id="values" 
                              rows={3}
                              placeholder="Enter company values" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "values")?.value || ""}
                            />
                          </div>
                        </div>
                      )}
                      
                      {activePage === "products" && (
                        <div className="space-y-4" id="products-content">
                          <div>
                            <Label htmlFor="products-title">Products Page Title</Label>
                            <Input 
                              id="products-title" 
                              placeholder="Enter page title" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "page_title")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="products-intro">Products Introduction</Label>
                            <Textarea 
                              id="products-intro" 
                              rows={3}
                              placeholder="Enter products intro text" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "products_intro")?.value || ""}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Featured Products</h4>
                            <p className="text-xs text-muted-foreground mb-4">
                              Select products to feature on the main products page
                            </p>
                            
                            {products && products.length > 0 ? (
                              <div className="grid gap-2">
                                {products.slice(0, 3).map((product: ProductItem) => (
                                  <div key={product.id} className="flex items-center p-2 border rounded-md">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{product.title}</p>
                                      <p className="text-xs text-muted-foreground">{product.category}</p>
                                    </div>
                                    <Switch 
                                      checked={Boolean(product.featured)} 
                                      onCheckedChange={(checked) => {
                                        // This would be connected to a mutation to update the product
                                        console.log(`Set product ${product.id} featured: ${checked}`);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No products available</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {activePage === "contact" && (
                        <div className="space-y-4" id="contact-content">
                          <div>
                            <Label htmlFor="contact-title">Contact Page Title</Label>
                            <Input 
                              id="contact-title" 
                              placeholder="Enter page title" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "page_title")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contact-intro">Contact Introduction</Label>
                            <Textarea 
                              id="contact-intro" 
                              rows={3}
                              placeholder="Enter contact page intro text" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "contact_intro")?.value || ""}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="company-email">Email</Label>
                              <Input 
                                id="company-email" 
                                placeholder="Enter company email" 
                                defaultValue={pageContent?.find((item: ContentItem) => item.key === "email")?.value || ""}
                              />
                            </div>
                            <div>
                              <Label htmlFor="company-phone">Phone</Label>
                              <Input 
                                id="company-phone" 
                                placeholder="Enter company phone" 
                                defaultValue={pageContent?.find((item: ContentItem) => item.key === "phone")?.value || ""}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="company-address">Address</Label>
                            <Textarea 
                              id="company-address" 
                              rows={2}
                              placeholder="Enter company address" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "address")?.value || ""}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="contact-form-success">Success Message</Label>
                            <Input 
                              id="contact-form-success" 
                              placeholder="Message shown after form submission" 
                              defaultValue={pageContent?.find((item: ContentItem) => item.key === "form_success")?.value || ""}
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="settings" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="page-path">Page URL Path</Label>
                        <Input 
                          id="page-path" 
                          placeholder="e.g., /about"
                          defaultValue={WEBSITE_PAGES.find(p => p.id === activePage)?.path || ""}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground mt-1">Page paths are fixed in the site structure</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Page Status</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="page-published" defaultChecked />
                          <Label htmlFor="page-published">Published</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          When disabled, the page will not be accessible to visitors
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="seo" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="meta-title">Meta Title</Label>
                        <Input 
                          id="meta-title" 
                          placeholder="Enter page meta title"
                          defaultValue={pageContent?.find((item: ContentItem) => item.key === "meta_title")?.value || ""}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended length: 50-60 characters
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="meta-description">Meta Description</Label>
                        <Textarea 
                          id="meta-description" 
                          rows={3}
                          placeholder="Enter page meta description"
                          defaultValue={pageContent?.find((item: ContentItem) => item.key === "meta_description")?.value || ""}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended length: 150-160 characters
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
              {/* Page Preview */}
              {showPreview && (
                <div className="rounded-md border">
                  <div className="p-4 border-b bg-muted/40">
                    <h3 className="text-sm font-medium">Live Preview</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview of {WEBSITE_PAGES.find(p => p.id === activePage)?.name} in {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                    </p>
                  </div>
                  
                  <div className="p-0 h-[500px] overflow-hidden bg-white">
                    {previewData ? (
                      <>
                        <div className="bg-yellow-50 border-yellow-200 border-b px-4 py-2 text-xs text-yellow-800 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileCode className="h-4 w-4 mr-2" />
                            <span>
                              Live preview generated at {new Date(previewData.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewData(null)}
                            className="h-6 px-2 text-xs"
                          >
                            Reset to current page
                          </Button>
                        </div>
                        <iframe 
                          src={previewData.previewUrl} 
                          title={`Live preview of ${WEBSITE_PAGES.find(p => p.id === activePage)?.name}`}
                          className="w-full h-[calc(100%-32px)] border-0"
                        />
                      </>
                    ) : (
                      <iframe 
                        src={WEBSITE_PAGES.find(p => p.id === activePage)?.path || "/"} 
                        title={`Current version of ${WEBSITE_PAGES.find(p => p.id === activePage)?.name}`}
                        className="w-full h-full border-0"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}