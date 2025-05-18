import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateId } from "@/lib/utils";
import { PageBuilderToolbox } from "./page-builder/PageBuilderToolbox";
import { PageBuilderCanvas } from "./page-builder/PageBuilderCanvas";
import { PageBuilderProperties } from "./page-builder/PageBuilderProperties";
import { PageSection, PageComponent, insertCustomPageSchema } from "@shared/schema";
import { 
  Save, 
  Undo2, 
  Redo2, 
  FileJson, 
  Download, 
  Upload, 
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Plus
} from "lucide-react";

interface PageBuilderProps {
  initialContent?: PageSection[];
  pageId?: string;
  onSave?: (content: PageSection[]) => Promise<void>;
  onNavigateBack?: () => void;
}

export function PageBuilder({ initialContent = [], pageId, onSave, onNavigateBack }: PageBuilderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Check URL params for create mode
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const isCreateMode = mode === 'create';
  const hasPageId = !!pageId;
  
  // Load existing page data if pageId is provided
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['/api/admin/pages', pageId],
    queryFn: async () => {
      if (!pageId) return null;
      const res = await apiRequest("GET", `/api/admin/pages/${pageId}`);
      if (!res.ok) {
        throw new Error("Failed to load page data");
      }
      return res.json();
    },
    enabled: !!pageId,
  });

  // State
  const [pageContent, setPageContent] = useState<PageSection[]>(initialContent);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);
  const [history, setHistory] = useState<PageSection[][]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  // Only show the new page dialog if we're in create mode AND we don't have a pageId
  const [showNewPageDialog, setShowNewPageDialog] = useState(isCreateMode && !hasPageId);
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    description: '',
    language: 'en'
  });
  
  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      const res = await apiRequest("POST", "/api/admin/pages", pageData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create page");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("pageBuilder.pageCreated", "Page created"),
        description: t("pageBuilder.pageCreatedDesc", "The page has been created successfully. You can now add content."),
      });
      
      // Close the dialog
      setShowNewPageDialog(false);
      
      // Decide what to do after page creation based on preferences/props
      if (data.id) {
        if (onNavigateBack) {
          // If we have a navigation callback, use it to return to the Pages tab
          onNavigateBack();
        } else {
          // Otherwise, update the URL to edit the new page
          const newUrlParams = new URLSearchParams(window.location.search);
          newUrlParams.set('tab', 'page-builder');
          newUrlParams.set('id', data.id.toString());
          newUrlParams.delete('mode'); // Clear the create mode
          
          const currentPath = window.location.pathname;
          const newUrl = `${currentPath}?${newUrlParams.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("pageBuilder.createFailed", "Failed to create page"),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle new page form change
  const handleNewPageFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPageForm(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title if slug is empty
      slug: name === 'title' && !newPageForm.slug ? 
        value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 
        prev.slug
    }));
  };
  
  // Create new page
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pageData = {
      ...newPageForm,
      content: {},
      status: 'draft'
    };
    
    createPageMutation.mutate(pageData);
  };
  
  // Effect to use page data when it's loaded
  useEffect(() => {
    if (pageData) {
      // Initialize with page content if it exists
      if (pageData.content && typeof pageData.content === 'object') {
        // Check if content is an array (old format) or an object (new format)
        const pageContentValue = Array.isArray(pageData.content) ? 
          pageData.content : 
          (pageData.content.sections || []);
          
        setPageContent(pageContentValue);
        setHistory([pageContentValue]);
        setHistoryIndex(0);
      }
      
      // Close the new page dialog if it's open
      setShowNewPageDialog(false);
    }
  }, [pageData]);
  
  // Add to history when content changes
  const addToHistory = (content: PageSection[]) => {
    if (historyIndex < history.length - 1) {
      // If we're not at the end of history, truncate future history
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    // Add new state to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(content))]);
    setHistoryIndex(prev => prev + 1);
  };
  
  // Update page content with history tracking
  const updatePageContent = (content: PageSection[]) => {
    setPageContent(content);
    addToHistory(content);
  };
  
  // Undo/Redo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setPageContent(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setPageContent(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };
  
  // Save the page content
  const saveMutation = useMutation({
    mutationFn: async (content: PageSection[]) => {
      if (onSave) {
        return onSave(content);
      } else if (pageId) {
        const res = await apiRequest("PUT", `/api/admin/pages/${pageId}/content`, { content });
        return res.json();
      }
      return null;
    },
    onSuccess: () => {
      toast({
        title: t("pageBuilder.saved", "Saved"),
        description: t("pageBuilder.pageContentSaved", "Page content has been saved successfully."),
      });
      
      if (pageId) {
        queryClient.invalidateQueries({ queryKey: [`/api/admin/pages/${pageId}`] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("pageBuilder.saveFailed", "Save Failed"),
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle drag start from toolbox
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: PageComponent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
  };
  
  // Import/Export functionality
  const handleExport = () => {
    const dataStr = JSON.stringify(pageContent, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `page-builder-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (Array.isArray(content)) {
          updatePageContent(content);
          setSelectedSection(null);
          setSelectedComponent(null);
          toast({
            title: t("pageBuilder.imported", "Imported"),
            description: t("pageBuilder.pageContentImported", "Page content has been imported successfully."),
          });
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        toast({
          title: t("pageBuilder.importFailed", "Import Failed"),
          description: t("pageBuilder.invalidFileFormat", "The file format is invalid."),
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input value so the same file can be selected again
    e.target.value = "";
  };
  
  // Update section/component
  const handleUpdateSection = (section: PageSection) => {
    const updatedContent = pageContent.map(s => 
      s.id === section.id ? section : s
    );
    updatePageContent(updatedContent);
  };
  
  const handleUpdateComponent = (component: PageComponent) => {
    const sectionId = component.parentSectionId;
    if (!sectionId) return;
    
    const updatedContent = pageContent.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.map(comp => 
            comp.id === component.id ? component : comp
          )
        };
      }
      return section;
    });
    
    updatePageContent(updatedContent);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* New Page Dialog */}
      <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pageBuilder.createPage", "Create New Page")}</DialogTitle>
            <DialogDescription>
              {t("pageBuilder.createPageDesc", "Enter the details for your new page. You'll be able to add content after creation.")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  {t("pageBuilder.pageTitle", "Title")}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newPageForm.title}
                  onChange={handleNewPageFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  {t("pageBuilder.urlSlug", "URL Slug")}
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={newPageForm.slug}
                  onChange={handleNewPageFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  {t("pageBuilder.description", "Description")}
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={newPageForm.description}
                  onChange={handleNewPageFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">
                  {t("pageBuilder.language", "Language")}
                </Label>
                <select 
                  id="language"
                  name="language"
                  value={newPageForm.language}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, language: e.target.value }))}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="et">Estonian</option>
                  <option value="ru">Russian</option>
                  <option value="lv">Latvian</option>
                  <option value="lt">Lithuanian</option>
                  <option value="pl">Polish</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createPageMutation.isPending}>
                {createPageMutation.isPending 
                  ? t("pageBuilder.creating", "Creating...") 
                  : t("pageBuilder.createPageBtn", "Create Page")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Toolbar */}
      <div className="border-b bg-background z-10">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={saveMutation.isPending || historyIndex === 0}
              onClick={handleUndo}
              title={t("pageBuilder.undo", "Undo")}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={saveMutation.isPending || historyIndex === history.length - 1}
              onClick={handleRedo}
              title={t("pageBuilder.redo", "Redo")}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              title={isPreviewMode ? t("pageBuilder.edit", "Edit") : t("pageBuilder.preview", "Preview")}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? t("pageBuilder.edit", "Edit") : t("pageBuilder.preview", "Preview")}
            </Button>
            {isPreviewMode && (
              <div className="flex border rounded-md p-0.5 ml-2">
                <Button 
                  variant={viewportSize === "mobile" ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setViewportSize("mobile")}
                  title={t("pageBuilder.mobileView", "Mobile View")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewportSize === "tablet" ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewportSize("tablet")}
                  title={t("pageBuilder.tabletView", "Tablet View")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewportSize === "desktop" ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewportSize("desktop")}
                  title={t("pageBuilder.desktopView", "Desktop View")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImport}
                className="sr-only"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={saveMutation.isPending}
                onClick={() => document.getElementById("import-file")?.click()}
                title={t("pageBuilder.import", "Import")}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t("pageBuilder.import", "Import")}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={saveMutation.isPending || pageContent.length === 0}
              onClick={handleExport}
              title={t("pageBuilder.export", "Export")}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("pageBuilder.export", "Export")}
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate(pageContent)}
            >
              {saveMutation.isPending ? (
                <>
                  <span className="mr-2">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("pageBuilder.save", "Save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbox - only shown in edit mode */}
        {!isPreviewMode && (
          <PageBuilderToolbox onDragStart={handleDragStart} />
        )}
        
        {/* Canvas */}
        <PageBuilderCanvas
          pageContent={pageContent}
          selectedSection={selectedSection}
          selectedComponent={selectedComponent}
          onSelectSection={setSelectedSection}
          onSelectComponent={setSelectedComponent}
          onUpdatePageContent={updatePageContent}
          isLoading={saveMutation.isPending}
          previewMode={isPreviewMode}
          viewportSize={viewportSize}
        />
        
        {/* Properties panel - only shown in edit mode */}
        {!isPreviewMode && (
          <PageBuilderProperties
            selectedSection={selectedSection}
            selectedComponent={selectedComponent}
            onUpdateSection={handleUpdateSection}
            onUpdateComponent={handleUpdateComponent}
          />
        )}
      </div>
    </div>
  );
}