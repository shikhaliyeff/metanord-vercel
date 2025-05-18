import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PageComponent } from "@shared/schema";

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
  FileInput,
  Search,
  LayoutTemplate,
  Loader2,
  Plus,
  Settings,
  Edit,
  Trash,
  Save,
  FolderOpen,
  Archive
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";

// Common component categories
const COMPONENT_CATEGORIES = [
  "general",
  "layout",
  "content",
  "media",
  "navigation",
  "forms",
  "commerce",
  "marketing",
  "specialized"
];

export default function ComponentLibrary() {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<PageComponent | null>(null);
  
  // Form state
  const [componentForm, setComponentForm] = useState({
    name: "",
    description: "",
    category: "general",
    structure: {},
    isSystem: false,
    isArchived: false,
    thumbnail: "",
  });
  
  // Fetch components
  const { data: components, isLoading } = useQuery<PageComponent[]>({
    queryKey: ["/api/admin/page-components"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/page-components");
      if (!res.ok) throw new Error("Failed to fetch components");
      return res.json();
    }
  });
  
  // Create component mutation
  const createComponentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/page-components", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create component");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-components"] });
      setIsCreating(false);
      resetForm();
      toast({
        title: "Success",
        description: "Component created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create component: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update component mutation
  const updateComponentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/page-components/${id}`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update component");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-components"] });
      setIsEditing(false);
      setCurrentComponent(null);
      resetForm();
      toast({
        title: "Success",
        description: "Component updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update component: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete component mutation
  const deleteComponentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/page-components/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete component");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-components"] });
      toast({
        title: "Success",
        description: "Component deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete component: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Archive/unarchive component mutation
  const archiveComponentMutation = useMutation({
    mutationFn: async ({ id, archive }: { id: number, archive: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/page-components/${id}/archive`, { archive });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to archive/unarchive component");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-components"] });
      toast({
        title: "Success",
        description: "Component updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update component: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Reset form
  const resetForm = () => {
    setComponentForm({
      name: "",
      description: "",
      category: "general",
      structure: {},
      isSystem: false,
      isArchived: false,
      thumbnail: "",
    });
  };
  
  // Handle create
  const handleCreateComponent = () => {
    createComponentMutation.mutate(componentForm);
  };
  
  // Handle update
  const handleUpdateComponent = () => {
    if (!currentComponent) return;
    
    updateComponentMutation.mutate({
      id: currentComponent.id,
      data: componentForm
    });
  };
  
  // Handle delete
  const handleDeleteComponent = (component: PageComponent) => {
    if (component.isSystem) {
      toast({
        title: "Cannot Delete",
        description: "System components cannot be deleted",
        variant: "destructive",
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the component "${component.name}"?`)) {
      deleteComponentMutation.mutate(component.id);
    }
  };
  
  // Handle archive/unarchive
  const handleArchiveComponent = (component: PageComponent, archive: boolean) => {
    if (component.isSystem) {
      toast({
        title: "Cannot Archive",
        description: "System components cannot be archived",
        variant: "destructive",
      });
      return;
    }
    
    archiveComponentMutation.mutate({
      id: component.id,
      archive
    });
  };
  
  // Handle edit
  const handleEditComponent = (component: PageComponent) => {
    setCurrentComponent(component);
    setComponentForm({
      name: component.name,
      description: component.description || "",
      category: component.category || "general",
      structure: component.structure || {},
      isSystem: Boolean(component.isSystem),
      isArchived: Boolean(component.isArchived),
      thumbnail: component.thumbnail || "",
    });
    setIsEditing(true);
  };
  
  // Handle duplicating a component
  const handleDuplicateComponent = (component: PageComponent) => {
    setComponentForm({
      name: `${component.name} (Copy)`,
      description: component.description || "",
      category: component.category || "general",
      structure: component.structure || {},
      isSystem: false,
      isArchived: false,
      thumbnail: component.thumbnail || "",
    });
    setIsCreating(true);
  };
  
  // Filter and sort components
  const filteredComponents = components
    ? components
        .filter(component => {
          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              component.name.toLowerCase().includes(query) ||
              (component.description && component.description.toLowerCase().includes(query)) ||
              (component.category && component.category.toLowerCase().includes(query))
            );
          }
          return true;
        })
        .filter(component => {
          // Filter by active tab (category)
          if (activeTab === "all") return true;
          if (activeTab === "system") return component.isSystem;
          return component.category === activeTab;
        })
        .filter(component => {
          // Filter by archive status
          return showArchived ? true : !component.isArchived;
        })
        .sort((a, b) => {
          // Sort
          if (sortBy === "name") return a.name.localeCompare(b.name);
          if (sortBy === "category") return (a.category || "").localeCompare(b.category || "");
          return 0;
        })
    : [];
  
  // Group by category for the tabs
  const categoryCount = components
    ? components.reduce<Record<string, number>>((counts, component) => {
        if (!showArchived && component.isArchived) return counts;
        
        const category = component.category || "general";
        counts[category] = (counts[category] || 0) + 1;
        counts.all = (counts.all || 0) + 1;
        if (component.isSystem) {
          counts.system = (counts.system || 0) + 1;
        }
        return counts;
      }, {})
    : {};
  
  // Component form
  const renderComponentForm = () => {
    const FormWrapper = isMobile ? MobileFormLayout : "div";
    
    return (
      <FormWrapper>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="component-name">Component Name *</Label>
            <Input
              id="component-name"
              value={componentForm.name}
              onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
              placeholder="Enter component name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="component-description">Description</Label>
            <Textarea
              id="component-description"
              value={componentForm.description}
              onChange={(e) => setComponentForm({ ...componentForm, description: e.target.value })}
              placeholder="Describe this component's purpose"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="component-category">Category</Label>
            <Select
              value={componentForm.category}
              onValueChange={(value) => setComponentForm({ ...componentForm, category: value })}
            >
              <SelectTrigger id="component-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {COMPONENT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="component-thumbnail">Thumbnail URL</Label>
            <Input
              id="component-thumbnail"
              value={componentForm.thumbnail}
              onChange={(e) => setComponentForm({ ...componentForm, thumbnail: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="component-structure">Component Structure (JSON)</Label>
            <Textarea
              id="component-structure"
              value={JSON.stringify(componentForm.structure, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setComponentForm({ ...componentForm, structure: parsed });
                } catch (error) {
                  // Allow invalid JSON while typing, but don't update the structure
                }
              }}
              placeholder="{}"
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Define the component's default structure in JSON format
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="component-system"
              checked={componentForm.isSystem}
              onCheckedChange={(checked) => setComponentForm({ ...componentForm, isSystem: checked })}
            />
            <Label htmlFor="component-system">System Component</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="component-archived"
              checked={componentForm.isArchived}
              onCheckedChange={(checked) => setComponentForm({ ...componentForm, isArchived: checked })}
            />
            <Label htmlFor="component-archived">Archived</Label>
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
    <div className="component-library">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Component Library</h2>
          <p className="text-muted-foreground">
            Manage reusable components for the page builder
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
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
                Create Component
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Component</DialogTitle>
                <DialogDescription>
                  Define a new reusable component for the page builder
                </DialogDescription>
              </DialogHeader>
              
              {renderComponentForm()}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateComponent}
                  disabled={!componentForm.name}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Create Component
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Component</DialogTitle>
                <DialogDescription>
                  Update the component properties
                </DialogDescription>
              </DialogHeader>
              
              {renderComponentForm()}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setCurrentComponent(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateComponent}
                  disabled={!componentForm.name}
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
          <TabsTrigger value="system">
            System
            {categoryCount.system && <Badge variant="secondary" className="ml-2">{categoryCount.system}</Badge>}
          </TabsTrigger>
          {COMPONENT_CATEGORIES
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
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredComponents.map(component => (
                <Card 
                  key={component.id}
                  className={component.isArchived ? "opacity-70" : ""}
                >
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base truncate">{component.name}</CardTitle>
                        {component.description && (
                          <CardDescription className="text-xs line-clamp-2">
                            {component.description}
                          </CardDescription>
                        )}
                      </div>
                      
                      <div>
                        {component.isSystem && (
                          <Badge variant="secondary">System</Badge>
                        )}
                        {component.isArchived && (
                          <Badge variant="outline">Archived</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <div className="aspect-video relative bg-muted/50 flex items-center justify-center overflow-hidden">
                      {component.thumbnail ? (
                        <img
                          src={component.thumbnail}
                          alt={component.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileCode className="h-8 w-8 mb-1" />
                          <span className="text-xs capitalize">{component.category || "Component"}</span>
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
                        onClick={() => handleDuplicateComponent(component)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={() => handleEditComponent(component)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      {component.isArchived ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Unarchive"
                          onClick={() => handleArchiveComponent(component, false)}
                          disabled={component.isSystem}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Archive"
                          onClick={() => handleArchiveComponent(component, true)}
                          disabled={component.isSystem}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        title="Delete"
                        onClick={() => handleDeleteComponent(component)}
                        disabled={component.isSystem}
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
              <h3 className="text-lg font-medium mb-2">No Components Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "No components match your search criteria" 
                  : "Create your first component to get started"
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
                  Create First Component
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}