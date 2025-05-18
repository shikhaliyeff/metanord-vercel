import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Globe, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Languages supported by the site
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

// Define the form schema with validation
const heroContentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  title_highlight: z.string(),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  tagline: z.string().optional(),
  cta_text: z.string().min(2, "Button text must be at least 2 characters"),
  cta_url: z.string().url("Please enter a valid URL (include https://)"),
  secondary_cta_text: z.string().optional(),
  secondary_cta_url: z.string().url("Please enter a valid URL (include https://)").optional().or(z.literal("")),
});

type HeroContent = z.infer<typeof heroContentSchema>;

interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
  language: string;
}

export function HeroEditor() {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [showPreview, setShowPreview] = useState(true);
  const { toast } = useToast();
  
  // Function to open homepage preview in a new tab
  const openLivePreview = () => {
    window.open('/', '_blank');
  };

  // Set up form with validation
  const form = useForm<HeroContent>({
    resolver: zodResolver(heroContentSchema),
    defaultValues: {
      title: "",
      title_highlight: "",
      subtitle: "",
      tagline: "",
      cta_text: "",
      cta_url: "",
      secondary_cta_text: "",
      secondary_cta_url: ""
    },
  });

  // Fetch hero content
  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/content/hero", activeLanguage],
    queryFn: async () => {
      const res = await fetch(`/api/content/hero?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch hero content");
      return res.json();
    }
  });

  // Update form values when data loads or language changes
  useEffect(() => {
    if (contentData && Array.isArray(contentData)) {
      const formValues: Partial<HeroContent> = {};
      
      contentData.forEach((item: ContentItem) => {
        if (item.section === "hero") {
          formValues[item.key as keyof HeroContent] = item.value;
        }
      });
      
      // Only update form for fields that exist in the data
      Object.keys(formValues).forEach(key => {
        if (formValues[key as keyof HeroContent]) {
          form.setValue(key as keyof HeroContent, formValues[key as keyof HeroContent] as any);
        }
      });
    }
  }, [contentData, activeLanguage, form]);

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async (content: { section: string; key: string; value: string; language: string }) => {
      const res = await apiRequest("POST", "/api/admin/content", content);
      if (!res.ok) throw new Error("Failed to save content");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/hero"] });
      toast({
        title: "Success",
        description: "Hero content updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Save all fields
  const onSubmit = async (data: HeroContent) => {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        await saveContentMutation.mutateAsync({
          section: "hero",
          key,
          value: value.toString(),
          language: activeLanguage,
        });
      }
    }
  };

  // Get current form values for preview
  const watchedValues = form.watch();

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Edit Hero Section</CardTitle>
            <CardDescription>Update the main banner content and call-to-action buttons</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="preview-mode"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <label htmlFor="preview-mode" className="text-sm text-slate-500 cursor-pointer">
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </label>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openLivePreview}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View Live
            </Button>
            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger className="w-32">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Short phrase that appears above the title" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Main headline" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title_highlight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Highlight</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Highlighted portion (shown in accent color)" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descriptive text below the title" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                  <FormField
                    control={form.control}
                    name="cta_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Text</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Call-to-action button text" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cta_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/contact" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="secondary_cta_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Text (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Secondary button text" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="secondary_cta_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/about" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {showPreview && (
                <div className="bg-white rounded-md border shadow-md overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                    <h3 className="text-sm font-medium flex items-center gap-1 text-slate-700">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </h3>
                  </div>
                  
                  <div className="relative p-6 md:p-10">
                    {/* Hero Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
                    
                    {/* Hero Content */}
                    <div className="relative z-10">
                      {watchedValues.tagline && (
                        <div className="text-xs sm:text-sm font-medium text-primary/80 mb-2">
                          {watchedValues.tagline}
                        </div>
                      )}
                      
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-800">
                        {watchedValues.title || "Your Main Title Here"}{" "}
                        {watchedValues.title_highlight && (
                          <span className="text-primary">{watchedValues.title_highlight}</span>
                        )}
                      </h2>
                      
                      <p className="text-sm sm:text-base text-slate-600 mb-4 max-w-md">
                        {watchedValues.subtitle || "Your subtitle text that describes your products or services in a compelling way."}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        {watchedValues.cta_text && (
                          <div className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow-sm">
                            {watchedValues.cta_text}
                          </div>
                        )}
                        
                        {watchedValues.secondary_cta_text && (
                          <div className="inline-flex items-center px-4 py-2 text-sm font-medium bg-white text-slate-700 rounded-md shadow-sm border border-slate-200">
                            {watchedValues.secondary_cta_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Live URL Previews */}
                  {(watchedValues.cta_url || watchedValues.secondary_cta_url) && (
                    <div className="p-4 border-t bg-slate-50">
                      <h4 className="text-xs font-medium text-slate-500 mb-2">Button Links</h4>
                      <div className="space-y-2">
                        {watchedValues.cta_url && (
                          <a href={watchedValues.cta_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:underline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Primary: {watchedValues.cta_url}
                          </a>
                        )}
                        {watchedValues.secondary_cta_url && (
                          <a href={watchedValues.secondary_cta_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:underline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Secondary: {watchedValues.secondary_cta_url}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <CardFooter className="px-0 pt-6">
              <Button
                type="submit"
                disabled={saveContentMutation.isPending || !form.formState.isDirty}
                className="ml-auto gap-2"
              >
                {saveContentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}