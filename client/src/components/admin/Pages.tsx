import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { SeoSetting } from "@shared/schema";

// Interface for Custom Pages data
interface CustomPage {
  id: number;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  language: string;  // Single language per page instance
  status: string;
  content?: any;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  publishedAt?: string | null;
  templateId?: number | null;
  author?: number | null;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Eye, FileEdit, Pencil, Plus } from "lucide-react";

// Define website pages for navigation
const WEBSITE_PAGES = [
  { id: "home", name: "Home Page", path: "/" },
  { id: "about", name: "About Us", path: "/about" },
  { id: "products", name: "Products", path: "/products" },
  { id: "contact", name: "Contact Us", path: "/contact" },
  { id: "services", name: "Services", path: "/services" },
];

// Define available languages
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

interface PagesProps {
  onNavigate?: (tab: string, params?: Record<string, string>) => void;
}

export function Pages({ onNavigate }: PagesProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("home");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // SEO form state
  const [seoForm, setSeoForm] = useState({
    id: 0,
    pagePath: "/",
    title: "",
    metaDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    language: "en"
  });
  
  // Content form state
  const [contentForm, setContentForm] = useState({
    sections: [] as { key: string; value: string }[],
  });
  
  // Fetch custom pages
  const { data: customPages, isLoading: isCustomPagesLoading } = useQuery<CustomPage[]>({
    queryKey: ['/api/admin/pages'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/pages");
      if (!res.ok) {
        throw new Error("Failed to fetch custom pages");
      }
      return res.json();
    },
  });
  
  // Fetch SEO settings
  const { data: seoSettings, isLoading: isSeoLoading } = useQuery<SeoSetting>({
    queryKey: ['/api/admin/seo', activePage, activeLanguage],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/seo?pagePath=${WEBSITE_PAGES.find(p => p.id === activePage)?.path}&language=${activeLanguage}`);
      if (!res.ok) {
        throw new Error("Failed to fetch SEO settings");
      }
      return res.json();
    },
    enabled: !!activePage && !!activeLanguage,
  });
  
  // Fetch page content
  const { data: pageContent, isLoading: isContentLoading } = useQuery({
    queryKey: ['/api/admin/content', activePage, activeLanguage],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/content?section=${activePage}&language=${activeLanguage}`);
      if (!res.ok) {
        throw new Error("Failed to fetch page content");
      }
      return res.json();
    },
    enabled: !!activePage && !!activeLanguage,
  });
  
  // Update SEO settings
  const updateSeoMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/seo", data);
      if (!res.ok) {
        throw new Error("Failed to update SEO settings");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo'] });
      toast({
        title: "SEO settings updated",
        description: "The SEO settings have been updated successfully.",
      });
      
      // Create a content version for history
      createVersionMutation.mutate({
        contentType: "seo",
        contentId: activePage,
        data: seoForm,
        version: 1, // Will be incremented server-side
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update page content
  const updateContentMutation = useMutation({
    mutationFn: async (sections: any[]) => {
      const promises = sections.map(section => 
        apiRequest("POST", "/api/admin/content", section)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Content updated",
        description: "The page content has been updated successfully.",
      });
      
      // Create a content version for history
      createVersionMutation.mutate({
        contentType: "page",
        contentId: activePage,
        data: contentForm.sections,
        version: 1, // Will be incremented server-side
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Create content version for history
  const createVersionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/content/version", data);
      if (!res.ok) {
        throw new Error("Failed to create content version");
      }
      return res.json();
    },
    onError: (error) => {
      console.error("Failed to create content version:", error);
    }
  });
  
  // Update SEO form when data changes
  useEffect(() => {
    if (seoSettings) {
      setSeoForm({
        id: seoSettings.id || 0,
        pagePath: seoSettings.pagePath || WEBSITE_PAGES.find(p => p.id === activePage)?.path || "/",
        title: seoSettings.title || "",
        metaDescription: seoSettings.metaDescription || "",
        ogTitle: seoSettings.ogTitle || "",
        ogDescription: seoSettings.ogDescription || "",
        ogImage: seoSettings.ogImage || "",
        language: seoSettings.language || activeLanguage
      });
    } else if (activePage && activeLanguage) {
      setSeoForm({
        id: 0,
        pagePath: WEBSITE_PAGES.find(p => p.id === activePage)?.path || "/",
        title: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        language: activeLanguage
      });
    }
  }, [seoSettings, activePage, activeLanguage]);
  
  // Update content form when data changes
  useEffect(() => {
    if (pageContent) {
      setContentForm({
        sections: Array.isArray(pageContent) ? pageContent.map(item => ({
          key: item.key,
          value: item.value
        })) : []
      });
    } else {
      setContentForm({ sections: [] });
    }
  }, [pageContent]);
  
  // Handle page change
  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    setIsEditing(false);
  };
  
  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
  };
  
  // Handle SEO form change
  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle content form change
  const handleContentChange = (key: string, value: string) => {
    setContentForm(prev => ({
      sections: prev.sections.map(section => 
        section.key === key ? { ...section, value } : section
      )
    }));
  };
  
  // Save SEO settings
  const saveSeoSettings = () => {
    updateSeoMutation.mutate(seoForm);
  };
  
  // Save page content
  const savePageContent = () => {
    const sections = contentForm.sections.map(section => ({
      section: activePage,
      key: section.key,
      value: section.value,
      language: activeLanguage
    }));
    
    updateContentMutation.mutate(sections);
  };
  
  // Toggle preview mode
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
    
    if (!isPreviewOpen) {
      // Opening preview
      const pagePath = WEBSITE_PAGES.find(p => p.id === activePage)?.path || '/';
      const url = `${window.location.origin}${pagePath}`;
      window.open(url, '_blank');
    }
  };
  
  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  const handleCreatePage = () => {
    // If we have the onNavigate function from AdminDashboard, use it
    if (onNavigate) {
      onNavigate('page-builder', { mode: 'create' });
    } else {
      // Fallback to manual navigation
      const currentPath = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Set the new parameters
      urlParams.set('tab', 'page-builder');
      urlParams.set('mode', 'create');
      
      // Update the URL and reload the page
      const newUrl = `${currentPath}?${urlParams.toString()}`;
      window.location.href = newUrl;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Website Pages</h2>
        
        <div className="flex items-center gap-3">
          <Select value={activeLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewOpen ? "Close Preview" : "Preview"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEditing}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            {isEditing ? "View Mode" : "Edit Mode"}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleCreatePage}
          >
            Create Page
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>
                Select a page to edit its content and SEO settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                {WEBSITE_PAGES.map(page => (
                  <Button
                    key={page.id}
                    variant={activePage === page.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => handlePageChange(page.id)}
                  >
                    {page.name}
                  </Button>
                ))}
              </div>
              
              {/* Custom Pages Section */}
              {customPages && customPages.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-medium mb-3">Custom Pages</h3>
                  <div className="flex flex-col space-y-2">
                    {customPages.map(page => (
                      <Button
                        key={page.id}
                        variant="ghost"
                        className="justify-start hover:bg-accent"
                        onClick={() => onNavigate && onNavigate('page-builder', { id: page.id.toString(), mode: '' })}
                      >
                        <div className="flex items-center">
                          <span className="truncate">{page.title}</span>
                          <span className={`ml-2 w-2 h-2 rounded-full ${
                            page.status === 'published' ? 'bg-green-500' : 
                            page.status === 'draft' ? 'bg-yellow-500' : 
                            'bg-gray-500'
                          }`}></span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="col-span-3">
          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Page Content</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {`${WEBSITE_PAGES.find(p => p.id === activePage)?.name} Content`}
                  </CardTitle>
                  <CardDescription>
                    Edit the content for this page in {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isContentLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : contentForm.sections.length > 0 ? (
                    <>
                      {contentForm.sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          <div className="font-medium capitalize">
                            {section.key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          
                          {section.value.length > 100 ? (
                            <Textarea
                              rows={6}
                              name={section.key}
                              value={section.value}
                              onChange={(e) => handleContentChange(section.key, e.target.value)}
                              disabled={!isEditing}
                              className={!isEditing ? "opacity-70" : ""}
                            />
                          ) : (
                            <Input
                              name={section.key}
                              value={section.value}
                              onChange={(e) => handleContentChange(section.key, e.target.value)}
                              disabled={!isEditing}
                              className={!isEditing ? "opacity-70" : ""}
                            />
                          )}
                          
                          <Separator className="my-4" />
                        </div>
                      ))}
                      
                      {isEditing && (
                        <Button 
                          onClick={savePageContent}
                          className="mt-4"
                          disabled={updateContentMutation.isPending}
                        >
                          {updateContentMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <p>No content sections found for this page in {LANGUAGES.find(l => l.code === activeLanguage)?.name}.</p>
                      {isEditing && (
                        <Button 
                          variant="outline"
                          className="mt-4"
                        >
                          Initialize Content
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize search engine visibility for {WEBSITE_PAGES.find(p => p.id === activePage)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isSeoLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="font-medium">Page Title</div>
                        <Input
                          name="title"
                          value={seoForm.title}
                          onChange={handleSeoChange}
                          placeholder="Page title (60-70 characters recommended)"
                          disabled={!isEditing}
                          className={!isEditing ? "opacity-70" : ""}
                          maxLength={70}
                        />
                        {seoForm.title && (
                          <div className="text-xs text-muted-foreground">
                            {seoForm.title.length}/70 characters
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium">Meta Description</div>
                        <Textarea
                          name="metaDescription"
                          value={seoForm.metaDescription}
                          onChange={handleSeoChange}
                          placeholder="Meta description (150-160 characters recommended)"
                          rows={3}
                          disabled={!isEditing}
                          className={!isEditing ? "opacity-70" : ""}
                          maxLength={160}
                        />
                        {seoForm.metaDescription && (
                          <div className="text-xs text-muted-foreground">
                            {seoForm.metaDescription.length}/160 characters
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="font-medium">Open Graph Title</div>
                        <Input
                          name="ogTitle"
                          value={seoForm.ogTitle}
                          onChange={handleSeoChange}
                          placeholder="Title for social media sharing"
                          disabled={!isEditing}
                          className={!isEditing ? "opacity-70" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium">Open Graph Description</div>
                        <Textarea
                          name="ogDescription"
                          value={seoForm.ogDescription}
                          onChange={handleSeoChange}
                          placeholder="Description for social media sharing"
                          rows={3}
                          disabled={!isEditing}
                          className={!isEditing ? "opacity-70" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium">Open Graph Image URL</div>
                        <Input
                          name="ogImage"
                          value={seoForm.ogImage}
                          onChange={handleSeoChange}
                          placeholder="URL to image for social media sharing"
                          disabled={!isEditing}
                          className={!isEditing ? "opacity-70" : ""}
                        />
                      </div>
                      
                      {isEditing && (
                        <Button 
                          onClick={saveSeoSettings}
                          className="mt-4"
                          disabled={updateSeoMutation.isPending}
                        >
                          {updateSeoMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="mr-2 h-4 w-4" />
                          Save SEO Settings
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Custom Pages Cards Section */}
      {customPages && customPages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Custom Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customPages.map((page) => (
              <Card key={page.id} className="cursor-pointer hover:shadow-md transition duration-200"
                onClick={() => onNavigate && onNavigate('page-builder', { id: page.id.toString() })}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{page.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-muted-foreground">/{page.slug}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {LANGUAGES.find(l => l.code === page.language)?.name || page.language}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          page.status === 'published' ? 'bg-green-100 text-green-800' : 
                          page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate && onNavigate('page-builder', { id: page.id.toString() });
                      }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state when no custom pages */}
      {(!customPages || customPages.length === 0) && (
        <div className="mt-8 p-8 text-center border rounded-lg bg-background">
          <h3 className="font-medium mb-2">No custom pages yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first custom page to get started
          </p>
          {onNavigate && (
            <Button onClick={() => onNavigate('page-builder', { mode: 'create' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          )}
        </div>
      )}
    </div>
  );
}