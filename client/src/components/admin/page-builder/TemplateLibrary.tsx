import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageTemplate } from "@shared/schema";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  FileCode,
  FolderOpen,
  LayoutTemplate,
  Loader2,
  Plus,
  Settings,
  Edit,
  Trash,
  Save,
  Archive,
  Search
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";

// Common template categories
const TEMPLATE_CATEGORIES = [
  "general",
  "landing",
  "product",
  "services",
  "about",
  "contact",
  "blog",
  "portfolio",
  "specialized"
];

export function TemplateLibrary() {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PageTemplate | null>(null);
  
  // Form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "general",
    structure: {},
    isArchived: false,
    thumbnail: "",
  });
  
  // Fetch templates
  const { data: templates, isLoading } = useQuery<PageTemplate[]>({
    queryKey: ["/api/admin/page-templates"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/page-templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    }
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/page-templates", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create template");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-templates"] });
      setIsCreating(false);
      resetForm();
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create template: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/page-templates/${id}`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update template");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-templates"] });
      setIsEditing(false);
      setCurrentTemplate(null);
      resetForm();
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update template: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/page-templates/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete template");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete template: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Archive/unarchive template mutation
  const archiveTemplateMutation = useMutation({
    mutationFn: async ({ id, archive }: { id: number, archive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/page-templates/${id}/archive`, { archive });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to archive/unarchive template");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-templates"] });
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update template: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Reset form
  const resetForm = () => {
    setTemplateForm({
      name: "",
      slug: "",
      description: "",
      category: "general",
      structure: {},
      isArchived: false,
      thumbnail: "",
    });
  };
  
  // Handle create
  const handleCreateTemplate = () => {
    const formData = {
      ...templateForm,
      slug: templateForm.slug || templateForm.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    createTemplateMutation.mutate(formData);
  };
  
  // Handle update
  const handleUpdateTemplate = () => {
    if (!currentTemplate) return;
    
    const formData = {
      ...templateForm,
      slug: templateForm.slug || templateForm.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    updateTemplateMutation.mutate({
      id: currentTemplate.id,
      data: formData
    });
  };
  
  // Handle delete
  const handleDeleteTemplate = (template: PageTemplate) => {
    if (window.confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      deleteTemplateMutation.mutate(template.id);
    }
  };
  
  // Handle archive/unarchive
  const handleArchiveTemplate = (template: PageTemplate, archive: boolean) => {
    archiveTemplateMutation.mutate({
      id: template.id,
      archive
    });
  };
  
  // Handle edit
  const handleEditTemplate = (template: PageTemplate) => {
    setCurrentTemplate(template);
    setTemplateForm({
      name: template.name,
      slug: template.slug,
      description: template.description || "",
      category: template.category || "general",
      structure: template.structure || {},
      isArchived: Boolean(template.isArchived),
      thumbnail: template.thumbnail || "",
    });
    setIsEditing(true);
  };
  
  // Handle duplicating a template
  const handleDuplicateTemplate = (template: PageTemplate) => {
    const timestamp = Date.now();
    
    setTemplateForm({
      name: `${template.name} (Copy)`,
      slug: `${template.slug}-copy-${timestamp}`,
      description: template.description || "",
      category: template.category || "general",
      structure: template.structure || {},
      isArchived: false,
      thumbnail: template.thumbnail || "",
    });
    setIsCreating(true);
  };
  
  // Filter and sort templates
  const filteredTemplates = templates
    ? templates
        .filter(template => {
          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              template.name.toLowerCase().includes(query) ||
              (template.description && template.description.toLowerCase().includes(query)) ||
              (template.category && template.category.toLowerCase().includes(query)) ||
              template.slug.toLowerCase().includes(query)
            );
          }
          return true;
        })
        .filter(template => {
          // Filter by active tab (category)
          if (activeTab === "all") return true;
          return template.category === activeTab;
        })
        .filter(template => {
          // Filter by archive status
          return showArchived ? true : !template.isArchived;
        })
        .sort((a, b) => {
          // Sort
          if (sortBy === "name") return a.name.localeCompare(b.name);
          if (sortBy === "category") return (a.category || "").localeCompare(b.category || "");
          return 0;
        })
    : [];
  
  // Group by category for the tabs
  const categoryCount = templates
    ? templates.reduce<Record<string, number>>((counts, template) => {
        if (!showArchived && template.isArchived) return counts;
        
        counts.all = (counts.all || 0) + 1;
        const category = template.category || "general";
        counts[category] = (counts[category] || 0) + 1;
        return counts;
      }, {})
    : {};
  
  // Template form
  const renderTemplateForm = () => {
    const FormWrapper = isMobile ? MobileFormLayout : "div";
    
    return (
      <FormWrapper>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={templateForm.name}
              onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              placeholder="Enter template name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-slug">Slug</Label>
            <Input
              id="template-slug"
              value={templateForm.slug}
              onChange={(e) => setTemplateForm({ ...templateForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="template-slug"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Used as a unique identifier. Will be auto-generated if left empty.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={templateForm.description}
              onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              placeholder="Describe this template's purpose"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-category">Category</Label>
            <Select
              value={templateForm.category}
              onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
            >
              <SelectTrigger id="template-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-thumbnail">Thumbnail URL</Label>
            <Input
              id="template-thumbnail"
              value={templateForm.thumbnail}
              onChange={(e) => setTemplateForm({ ...templateForm, thumbnail: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template-structure">Template Structure (JSON)</Label>
            <Textarea
              id="template-structure"
              value={JSON.stringify(templateForm.structure, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setTemplateForm({ ...templateForm, structure: parsed });
                } catch (error) {
                  // Allow invalid JSON while typing, but don't update the structure
                }
              }}
              placeholder="{}"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Define the template's structure in JSON format
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="template-archived"
              checked={templateForm.isArchived}
              onCheckedChange={(checked) => setTemplateForm({ ...templateForm, isArchived: checked })}
            />
            <Label htmlFor="template-archived">Archived</Label>
          </div>
        </div>
      </FormWrapper>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="template-library">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Template Library</h2>
          <p className="text-muted-foreground">
            Manage page templates for the page builder
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <Settings className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="show-archived"
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label htmlFor="show-archived" className="whitespace-nowrap">
                Show Archived
              </Label>
            </div>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Define a new page template for the page builder
                </DialogDescription>
              </DialogHeader>
              
              {renderTemplateForm()}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTemplate}
                  disabled={!templateForm.name}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogDescription>
                  Update the template properties
                </DialogDescription>
              </DialogHeader>
              
              {renderTemplateForm()}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setCurrentTemplate(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateTemplate}
                  disabled={!templateForm.name}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
            {categoryCount.all && <Badge variant="secondary" className="ml-2">{categoryCount.all}</Badge>}
          </TabsTrigger>
          {TEMPLATE_CATEGORIES
            .filter(category => categoryCount[category] && categoryCount[category] > 0)
            .map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
                {categoryCount[category] && <Badge variant="secondary" className="ml-2">{categoryCount[category]}</Badge>}
              </TabsTrigger>
            ))
          }
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id}
                  className={template.isArchived ? "opacity-70" : ""}
                >
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base truncate">{template.name}</CardTitle>
                        {template.description && (
                          <CardDescription className="text-xs line-clamp-2">
                            {template.description}
                          </CardDescription>
                        )}
                      </div>
                      
                      <div>
                        {template.isArchived && (
                          <Badge variant="outline">Archived</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{template.slug}</code>
                    </p>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <div className="aspect-video relative bg-muted/50 flex items-center justify-center overflow-hidden">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <LayoutTemplate className="h-8 w-8 mb-1" />
                          <span className="text-xs capitalize">{template.category || "Template"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-between">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Duplicate"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      {template.isArchived ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Unarchive"
                          onClick={() => handleArchiveTemplate(template, false)}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Archive"
                          onClick={() => handleArchiveTemplate(template, true)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        title="Delete"
                        onClick={() => handleDeleteTemplate(template)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/40 border rounded-md p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "No templates match your search criteria" 
                  : "Create your first template to get started"
                }
              </p>
              {searchQuery ? (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Template
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}