import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Type, 
  Save, 
  Undo, 
  Code,
  CheckIcon,
  RefreshCcw,
  EyeIcon,
  LayoutGrid
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SketchPicker } from 'react-color';

// Theme schema
const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  fontPrimary: z.string().min(1, "Primary font is required"),
  fontSecondary: z.string().min(1, "Secondary font is required"),
  borderRadius: z.string().min(1, "Border radius is required"),
  isActive: z.boolean().default(false),
  isDefault: z.boolean().default(false),
});

type Theme = z.infer<typeof themeSchema> & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Raleway", value: "Raleway, sans-serif" },
  { label: "Noto Sans", value: "Noto Sans, sans-serif" },
  { label: "Source Sans Pro", value: "Source Sans Pro, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Rubik", value: "Rubik, sans-serif" },
  { label: "Work Sans", value: "Work Sans, sans-serif" },
  { label: "Nunito", value: "Nunito, sans-serif" },
];

const BORDER_RADIUS_OPTIONS = [
  { label: "None", value: "0px" },
  { label: "Small", value: "4px" },
  { label: "Medium", value: "8px" },
  { label: "Large", value: "12px" },
  { label: "XL", value: "16px" },
  { label: "2XL", value: "24px" },
  { label: "Full", value: "9999px" },
];

export function ThemeEditor() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("colors");
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [colorPickerField, setColorPickerField] = useState<string | null>(null);
  const [previewStyle, setPreviewStyle] = useState<Record<string, string>>({});
  
  // Form for theme editing
  const form = useForm<z.infer<typeof themeSchema>>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      name: "",
      primaryColor: "#005fa3",
      secondaryColor: "#00c4ff",
      accentColor: "#f3f4f6",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      fontPrimary: "Inter, sans-serif",
      fontSecondary: "Raleway, sans-serif",
      borderRadius: "8px",
      isActive: true,
      isDefault: false,
    },
  });

  // Watch values for preview
  const watchedValues = form.watch();
  
  // Fetch themes
  const { data: themes, isLoading } = useQuery({
    queryKey: ["/api/admin/themes"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/themes");
        const data = await res.json();
        // If there's no selected theme and we have themes, select the active one or the first one
        if (!selectedTheme && data && data.length > 0) {
          const activeTheme = data.find((t: Theme) => t.isActive) || data[0];
          setSelectedTheme(activeTheme);
          form.reset(activeTheme);
          updatePreviewStyle(activeTheme);
        }
        return data as Theme[];
      } catch (error) {
        console.error("Error fetching themes:", error);
        // Return empty array if API fails
        return [];
      }
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof themeSchema>) => {
      const endpoint = selectedTheme 
        ? `/api/admin/themes/${selectedTheme.id}` 
        : "/api/admin/themes";
      const method = selectedTheme ? "PUT" : "POST";
      
      const res = await apiRequest(method, endpoint, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      toast({
        title: selectedTheme ? "Theme updated" : "Theme created",
        description: `The theme has been successfully ${selectedTheme ? "updated" : "created"}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${selectedTheme ? "update" : "create"} theme: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Set theme as active mutation
  const setActiveThemeMutation = useMutation({
    mutationFn: async (themeId: number) => {
      const res = await apiRequest("POST", `/api/admin/themes/${themeId}/activate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      toast({
        title: "Theme activated",
        description: "The selected theme is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to activate theme: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete theme mutation
  const deleteThemeMutation = useMutation({
    mutationFn: async (themeId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/themes/${themeId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/themes"] });
      setSelectedTheme(null);
      form.reset({
        name: "",
        primaryColor: "#005fa3",
        secondaryColor: "#00c4ff",
        accentColor: "#f3f4f6",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        fontPrimary: "Inter, sans-serif",
        fontSecondary: "Raleway, sans-serif",
        borderRadius: "8px",
        isActive: true,
        isDefault: false,
      });
      toast({
        title: "Theme deleted",
        description: "The theme has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete theme: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle theme selection
  const handleSelectTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    form.reset(theme);
    updatePreviewStyle(theme);
  };

  // Update preview style based on form values
  const updatePreviewStyle = (values: any) => {
    setPreviewStyle({
      "--primary": values.primaryColor,
      "--secondary": values.secondaryColor,
      "--accent": values.accentColor,
      "--background": values.backgroundColor,
      "--foreground": values.textColor,
      "--font-primary": values.fontPrimary,
      "--font-secondary": values.fontSecondary,
      "--radius": values.borderRadius,
    });
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof themeSchema>) => {
    await updateThemeMutation.mutateAsync(values);
  };

  // Color picker component
  const renderColorPicker = (fieldName: string) => {
    const currentColor = form.getValues(fieldName as any);
    
    return (
      <div className="relative">
        <div 
          className="w-8 h-8 rounded-md border cursor-pointer"
          style={{ backgroundColor: currentColor }}
          onClick={() => setColorPickerField(fieldName === colorPickerField ? null : fieldName)}
        />
        
        {colorPickerField === fieldName && (
          <div className="absolute z-10 mt-2">
            <div 
              className="fixed inset-0 bg-transparent" 
              onClick={() => setColorPickerField(null)}
            />
            <SketchPicker
              color={currentColor}
              onChange={(color) => {
                form.setValue(fieldName as any, color.hex);
                updatePreviewStyle({ ...watchedValues, [fieldName]: color.hex });
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Preview component
  const ThemePreview = () => (
    <div 
      className="border rounded-lg p-6 bg-white flex flex-col space-y-6"
      style={previewStyle as any}
    >
      <div className="space-y-4">
        <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--foreground)' }} className="text-2xl font-bold">
          Theme Preview
        </h2>
        <p style={{ fontFamily: 'var(--font-secondary)', color: 'var(--foreground)' }} className="text-sm">
          This is how your theme will look on the website.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-primary)'
          }}
          className="px-4 py-2"
        >
          Primary Button
        </button>
        
        <button 
          style={{ 
            backgroundColor: 'var(--secondary)', 
            color: 'white',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-primary)'
          }}
          className="px-4 py-2"
        >
          Secondary Button
        </button>
        
        <button 
          style={{ 
            backgroundColor: 'var(--accent)', 
            color: 'var(--foreground)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-primary)'
          }}
          className="px-4 py-2"
        >
          Accent Button
        </button>
      </div>
      
      <div 
        style={{ 
          backgroundColor: 'var(--accent)', 
          color: 'var(--foreground)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-secondary)'
        }}
        className="p-4"
      >
        <h3 style={{ fontFamily: 'var(--font-primary)' }} className="font-medium mb-2">Sample Content Block</h3>
        <p className="text-sm">This shows how content will look with your theme's accent background.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Theme Editor</CardTitle>
              <CardDescription>Manage website appearance and visual style</CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Select
                value={selectedTheme ? String(selectedTheme.id) : ""}
                onValueChange={(value) => {
                  const theme = themes?.find(t => t.id === Number(value));
                  if (theme) handleSelectTheme(theme);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes?.map(theme => (
                    <SelectItem key={theme.id} value={String(theme.id)}>
                      {theme.name} {theme.isActive && "(Active)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedTheme(null);
                  form.reset({
                    name: "New Theme",
                    primaryColor: "#005fa3",
                    secondaryColor: "#00c4ff",
                    accentColor: "#f3f4f6",
                    backgroundColor: "#ffffff",
                    textColor: "#111827",
                    fontPrimary: "Inter, sans-serif",
                    fontSecondary: "Raleway, sans-serif",
                    borderRadius: "8px",
                    isActive: false,
                    isDefault: false,
                  });
                  updatePreviewStyle({
                    primaryColor: "#005fa3",
                    secondaryColor: "#00c4ff",
                    accentColor: "#f3f4f6",
                    backgroundColor: "#ffffff",
                    textColor: "#111827",
                    fontPrimary: "Inter, sans-serif",
                    fontSecondary: "Raleway, sans-serif",
                    borderRadius: "8px",
                  });
                }}
              >
                New Theme
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Theme Settings Form */}
              <div className="md:col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Light Theme, Dark Mode, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="colors">
                          <Palette className="h-4 w-4 mr-2" />
                          Colors
                        </TabsTrigger>
                        <TabsTrigger value="typography">
                          <Type className="h-4 w-4 mr-2" />
                          Typography & Layout
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="colors" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input {...field} />
                                    {renderColorPicker("primaryColor")}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input {...field} />
                                    {renderColorPicker("secondaryColor")}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Accent Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input {...field} />
                                    {renderColorPicker("accentColor")}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="backgroundColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Background Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input {...field} />
                                    {renderColorPicker("backgroundColor")}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Text Color</FormLabel>
                                <FormControl>
                                  <div className="flex items-center gap-2">
                                    <Input {...field} />
                                    {renderColorPicker("textColor")}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="typography" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fontPrimary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Font</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {FONT_OPTIONS.map(font => (
                                      <SelectItem key={font.value} value={font.value}>
                                        {font.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Used for headings and important text
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="fontSecondary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Font</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {FONT_OPTIONS.map(font => (
                                      <SelectItem key={font.value} value={font.value}>
                                        {font.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Used for body text and paragraphs
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="borderRadius"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Border Radius</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select border radius" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {BORDER_RADIUS_OPTIONS.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Controls rounded corners across UI elements
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4 mt-6">
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Make Active Theme</FormLabel>
                                  <FormDescription>
                                    Use this theme for the public website
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Set as Default Theme</FormLabel>
                                  <FormDescription>
                                    This theme will be used as a fallback
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex gap-2">
                        {selectedTheme && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this theme?")) {
                                deleteThemeMutation.mutate(selectedTheme.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (selectedTheme) {
                              handleSelectTheme(selectedTheme);
                            } else {
                              form.reset();
                            }
                          }}
                        >
                          <Undo className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                        
                        <Button 
                          type="submit" 
                          disabled={updateThemeMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {updateThemeMutation.isPending
                            ? "Saving..."
                            : selectedTheme
                              ? "Update Theme"
                              : "Save Theme"
                          }
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
              
              {/* Preview Panel */}
              <div className="md:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Live Preview</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePreviewStyle(form.getValues())}
                    >
                      <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                      Refresh
                    </Button>
                  </div>
                  
                  <ThemePreview />
                  
                  <div className="bg-muted/30 p-4 rounded-md space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      CSS Variables
                    </h4>
                    <div className="text-xs font-mono bg-background/50 p-3 rounded overflow-auto max-h-40">
                      {`/* Theme: ${form.getValues("name") || "New Theme"} */\n:root {\n  --primary: ${form.getValues("primaryColor")};\n  --secondary: ${form.getValues("secondaryColor")};\n  --accent: ${form.getValues("accentColor")};\n  --background: ${form.getValues("backgroundColor")};\n  --foreground: ${form.getValues("textColor")};\n  --font-primary: ${form.getValues("fontPrimary")};\n  --font-secondary: ${form.getValues("fontSecondary")};\n  --radius: ${form.getValues("borderRadius")};\n}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemeEditor;