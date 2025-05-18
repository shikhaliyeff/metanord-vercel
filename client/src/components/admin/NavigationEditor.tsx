import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "react-beautiful-dnd";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Menu, 
  XCircle, 
  ExternalLink,
  ChevronUp,
  ChevronDown,
  GridIcon
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Form schema for menu items
const menuItemSchema = z.object({
  title: z.record(z.string(), z.string().min(1, "Title is required")),
  url: z.string().min(1, "URL is required"),
  isExternal: z.boolean().optional().default(false),
  order: z.number().optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

type MenuItem = z.infer<typeof menuItemSchema> & {
  id: string;
  children?: MenuItem[];
};

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

// Languages supported by the application
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

export function NavigationEditor() {
  const { toast } = useToast();
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([]);

  // Fetch navigation items
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["/api/admin/navigation"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/navigation");
        const data = await res.json();
        return data as MenuItem[];
      } catch (error) {
        console.error("Error fetching navigation:", error);
        // Return empty array if API fails
        return [];
      }
    },
  });

  // Form for adding/editing menu items
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      title: { en: "" },
      url: "",
      isExternal: false,
      order: 0,
      parentId: null,
      isActive: true,
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddMenuItemOpen) {
      form.reset({
        title: { en: "" },
        url: "",
        isExternal: false,
        order: 0,
        parentId: null,
        isActive: true,
      });
      setEditingMenuItem(null);
    }
  }, [isAddMenuItemOpen, form]);

  // Set form values when editing an item
  useEffect(() => {
    if (editingMenuItem) {
      form.reset({
        title: editingMenuItem.title,
        url: editingMenuItem.url,
        isExternal: editingMenuItem.isExternal || false,
        order: editingMenuItem.order || 0,
        parentId: editingMenuItem.parentId || null,
        isActive: editingMenuItem.isActive !== false,
      });
    }
  }, [editingMenuItem, form]);

  // Save navigation menu item mutation
  const saveMenuItemMutation = useMutation({
    mutationFn: async (values: MenuItemFormValues & { id?: string }) => {
      const endpoint = values.id 
        ? `/api/admin/navigation/${values.id}` 
        : "/api/admin/navigation";
      const method = values.id ? "PUT" : "POST";
      const res = await apiRequest(method, endpoint, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation"] });
      setIsAddMenuItemOpen(false);
      toast({
        title: editingMenuItem ? "Menu item updated" : "Menu item added",
        description: `The navigation menu has been successfully ${editingMenuItem ? "updated" : "created"}.`,
      });
      setEditingMenuItem(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingMenuItem ? "update" : "add"} menu item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/navigation/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation"] });
      toast({
        title: "Menu item deleted",
        description: "The navigation menu item has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete menu item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Reorder menu items mutation
  const reorderMenuItemsMutation = useMutation({
    mutationFn: async (items: MenuItem[]) => {
      const res = await apiRequest("PUT", "/api/admin/navigation/reorder", { items });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation"] });
      toast({
        title: "Menu order updated",
        description: "The navigation menu order has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reorder menu items: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Convert flat list to hierarchical structure
  const buildMenuTree = (items: MenuItem[] = []): MenuItem[] => {
    const itemMap: Record<string, MenuItem> = {};
    
    // First pass: create a map of all items
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });
    
    // Second pass: build the tree
    const rootItems: MenuItem[] = [];
    
    items.forEach(item => {
      if (item.parentId && itemMap[item.parentId]) {
        if (!itemMap[item.parentId].children) {
          itemMap[item.parentId].children = [];
        }
        itemMap[item.parentId].children!.push(itemMap[item.id]);
      } else {
        rootItems.push(itemMap[item.id]);
      }
    });
    
    // Sort items by order
    return rootItems.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Handle form submission
  const onSubmit = async (values: MenuItemFormValues) => {
    if (editingMenuItem) {
      await saveMenuItemMutation.mutateAsync({ ...values, id: editingMenuItem.id });
    } else {
      await saveMenuItemMutation.mutateAsync(values);
    }
  };

  // Handle drag and drop to reorder menu items
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !menuItems) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    if (startIndex === endIndex) return;
    
    const reorderedItems = Array.from(menuItems);
    const [removed] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, removed);
    
    // Update order property on all items
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    reorderMenuItemsMutation.mutate(updatedItems);
  };

  // Toggle expanded state for a menu item
  const toggleExpandMenuItem = (id: string) => {
    setExpandedMenuItems(prev => 
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Render a menu item
  const renderMenuItem = (item: MenuItem, index: number, level = 0) => {
    const isExpanded = expandedMenuItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.id} className="mb-1">
        <div 
          className={`flex items-center p-2 rounded-md ${level > 0 ? 'ml-6' : ''} ${item.isActive === false ? 'opacity-50' : ''}`}
          style={{ backgroundColor: level === 0 ? 'rgba(0,0,0,0.05)' : 'transparent' }}
        >
          {/* Drag handle and expand/collapse button */}
          <div className="flex items-center gap-1 mr-2">
            <Menu className="h-4 w-4 text-muted-foreground cursor-move" />
            {hasChildren && (
              <button onClick={() => toggleExpandMenuItem(item.id)} className="p-1">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>

          {/* Menu item title and URL */}
          <div className="flex-1">
            <div className="font-medium">{item.title[activeLanguage] || item.title.en}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {item.url}
              {item.isExternal && <ExternalLink className="h-3 w-3" />}
            </div>
          </div>

          {/* Status indicator */}
          <div className="mr-4">
            {item.isActive === false ? (
              <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setEditingMenuItem(item);
                setIsAddMenuItemOpen(true);
              }}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this menu item?')) {
                  deleteMenuItemMutation.mutate(item.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {item.children!.map((child, childIndex) => 
              renderMenuItem(child, childIndex, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const menuTree = buildMenuTree(menuItems || []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Navigation Editor</CardTitle>
            <CardDescription>Manage website navigation and menu structure</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={activeLanguage} 
              onValueChange={setActiveLanguage}
            >
              <SelectTrigger className="w-[140px]">
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
            
            <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                  <DialogDescription>
                    {editingMenuItem 
                      ? "Update the navigation menu item properties below."
                      : "Create a new navigation menu item by filling in the details below."}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs defaultValue="en">
                      <TabsList className="mb-4">
                        {LANGUAGES.map(lang => (
                          <TabsTrigger key={lang.code} value={lang.code}>
                            {lang.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {LANGUAGES.map(lang => (
                        <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`title.${lang.code}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title ({lang.name})</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={`Menu item name in ${lang.name}`} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                    
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., /products or https://example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use relative paths for internal links (/products) or full URLs for external links.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="parentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Menu</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                            defaultValue={field.value?.toString() || "none"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a parent menu item (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No parent (Top level)</SelectItem>
                              {menuItems?.filter(item => item.id !== editingMenuItem?.id).map(item => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.title[activeLanguage] || item.title.en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select a parent menu item to create a dropdown/submenu.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-4">
                      <FormField
                        control={form.control}
                        name="isExternal"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>External Link</FormLabel>
                              <FormDescription>
                                Opens in a new tab
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Active</FormLabel>
                              <FormDescription>
                                Show in navigation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddMenuItemOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saveMenuItemMutation.isPending}>
                        {saveMenuItemMutation.isPending ? (
                          "Saving..."
                        ) : editingMenuItem ? (
                          "Update Menu Item"
                        ) : (
                          "Add Menu Item"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : menuTree.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/40 inline-block p-4 rounded-full mb-4">
              <Menu className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No menu items yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first navigation menu item
            </p>
            <Button onClick={() => setIsAddMenuItemOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-1"
                >
                  {menuTree.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderMenuItem(item, index)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}

export default NavigationEditor;