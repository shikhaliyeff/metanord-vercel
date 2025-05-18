import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  Eye, 
  Globe,
  Info, 
  Loader2, 
  MailIcon,
  MapPin,
  PhoneCall, 
  RefreshCw, 
  Save, 
  X,
  FileText,
  Edit
} from "lucide-react";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";
import { useMediaQuery } from "@/hooks/use-media-query";

// Languages supported by the site
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

// Different content sections
const CONTENT_SECTIONS = [
  { id: "about", name: "About Us" },
  { id: "footer", name: "Footer" },
  { id: "contact", name: "Contact" },
  { id: "certificates", name: "Certificates" },
];

// Schema for site content form
const siteContentSchema = z.object({
  section: z.string().min(1, "Section is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Content value is required"),
  language: z.string().min(2, "Language is required"),
});

// Schema for multilingual site content
const multilingualContentSchema = z.object({
  section: z.string().min(1, "Section is required"),
  key: z.string().min(1, "Key is required"),
  values: z.record(z.string().min(1, "Content is required")),
});

type SiteContentForm = z.infer<typeof siteContentSchema>;
type MultilingualContentForm = z.infer<typeof multilingualContentSchema>;

// Interface for site content data
interface SiteContent {
  id: number;
  section: string;
  key: string;
  value: string;
  language: string;
}

// Content preview component
const ContentPreview = ({ content, section }: { content: SiteContent[]; section: string }) => {
  const groupedContent: Record<string, Record<string, string>> = {};

  // Group content by key and language
  content.forEach(item => {
    if (item.section === section) {
      if (!groupedContent[item.key]) {
        groupedContent[item.key] = {};
      }
      groupedContent[item.key][item.language] = item.value;
    }
  });

  const renderAboutSection = () => (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <h2 className="text-xl font-bold text-slate-800">About Us</h2>
      <div className="prose prose-sm max-w-none">
        {groupedContent['company_description'] && (
          <p>{groupedContent['company_description']['en'] || ''}</p>
        )}
        
        {groupedContent['mission'] && (
          <>
            <h3 className="text-md font-semibold">Our Mission</h3>
            <p>{groupedContent['mission']['en'] || ''}</p>
          </>
        )}
        
        {groupedContent['values'] && (
          <>
            <h3 className="text-md font-semibold">Our Values</h3>
            <p>{groupedContent['values']['en'] || ''}</p>
          </>
        )}
      </div>
    </div>
  );

  const renderFooterSection = () => (
    <div className="space-y-4 p-4 border rounded-md bg-slate-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 uppercase">MetaNord OÜ</h3>
          <p className="text-xs text-slate-300">
            {groupedContent['company_tagline'] && groupedContent['company_tagline']['en']}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-2 uppercase">Contact</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <p>
              {groupedContent['address'] && groupedContent['address']['en']}
            </p>
            <p>
              {groupedContent['email'] && groupedContent['email']['en']}
            </p>
            <p>
              {groupedContent['phone'] && groupedContent['phone']['en']}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-2 uppercase">Legal</h3>
          <div className="space-y-1 text-xs text-slate-300">
            {groupedContent['legal_text'] && (
              <p>{groupedContent['legal_text']['en']}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-700 text-xs text-center text-slate-400">
        {groupedContent['copyright'] && groupedContent['copyright']['en']}
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <h2 className="text-xl font-bold text-slate-800">Contact Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Address</h3>
              <p className="text-sm text-slate-600">
                {groupedContent['address'] && groupedContent['address']['en']}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MailIcon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Email</h3>
              <p className="text-sm text-slate-600">
                {groupedContent['email'] && groupedContent['email']['en']}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <PhoneCall className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Phone</h3>
              <p className="text-sm text-slate-600">
                {groupedContent['phone'] && groupedContent['phone']['en']}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-40 border rounded bg-slate-100 flex items-center justify-center text-slate-400">
            Map Placeholder
          </div>
          
          <p className="text-sm text-slate-600">
            {groupedContent['contact_text'] && groupedContent['contact_text']['en']}
          </p>
        </div>
      </div>
    </div>
  );

  const renderCertificatesSection = () => (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <h2 className="text-xl font-bold text-slate-800">Our Certificates</h2>
      
      <div className="text-sm text-slate-600 mb-4">
        {groupedContent['certificates_intro'] && groupedContent['certificates_intro']['en']}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['certificate1', 'certificate2', 'certificate3', 'certificate4'].map((key, index) => (
          groupedContent[key] && (
            <div key={index} className="border rounded-md p-3 flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-100 rounded-md mb-2 flex items-center justify-center">
                <Info className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-center">{groupedContent[key]['en']}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );

  switch (section) {
    case 'about':
      return renderAboutSection();
    case 'footer':
      return renderFooterSection();
    case 'contact':
      return renderContactSection();
    case 'certificates':
      return renderCertificatesSection();
    default:
      return (
        <div className="p-4 border rounded-md bg-slate-50 text-center text-slate-400">
          No preview available for this section
        </div>
      );
  }
};

export function SiteContentEditor() {
  const [activeSection, setActiveSection] = useState("about");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [showPreview, setShowPreview] = useState(true);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Function to open site preview based on section
  const openSectionPreview = (section: string) => {
    let url = '';
    
    switch(section) {
      case 'about':
        url = '/about';
        break;
      case 'contact':
        url = '/contact';
        break;
      case 'footer':
      case 'certificates':
      default:
        url = '/';
        break;
    }
    
    window.open(url, '_blank');
  };
  
  // Content form
  const form = useForm<MultilingualContentForm>({
    resolver: zodResolver(multilingualContentSchema),
    defaultValues: {
      section: CONTENT_SECTIONS[0].id,
      key: "",
      values: { en: "" }
    }
  });
  
  // Fetch site content
  const { data: content, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/content", activeSection],
    queryFn: async () => {
      const res = await fetch(`/api/content/section/${activeSection}`);
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    }
  });
  
  // Group content by key for editing
  const contentByKey: Record<string, Record<string, SiteContent>> = {};
  
  if (content && content.length > 0) {
    content.forEach((item: SiteContent) => {
      if (!contentByKey[item.key]) {
        contentByKey[item.key] = {};
      }
      contentByKey[item.key][item.language] = item;
    });
  }
  
  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async (data: MultilingualContentForm) => {
      const promises = [];
      
      // Create a request for each language
      for (const [lang, value] of Object.entries(data.values)) {
        if (!value.trim()) continue;
        
        const contentData = {
          section: data.section,
          key: data.key,
          value,
          language: lang
        };
        
        promises.push(
          apiRequest("POST", "/api/admin/content", contentData)
        );
      }
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsAddContentOpen(false);
      setEditingContentId(null);
      form.reset({
        section: activeSection,
        key: "",
        values: { en: "" }
      });
      
      toast({
        title: "Success",
        description: "Content updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update content: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: MultilingualContentForm) => {
    await updateContentMutation.mutateAsync(data);
  };
  
  // Set active section in form when section changes
  useEffect(() => {
    form.setValue("section", activeSection);
  }, [activeSection, form]);
  
  // Setup form for editing
  const handleEdit = (key: string) => {
    const contentItem = contentByKey[key];
    if (!contentItem) return;
    
    // Reset form with existing content
    const values: Record<string, string> = {};
    
    // Set values for each language
    LANGUAGES.forEach(lang => {
      values[lang.code] = contentItem[lang.code]?.value || "";
    });
    
    form.reset({
      section: activeSection,
      key,
      values
    });
    
    setEditingContentId(key);
    setIsAddContentOpen(true);
  };
  
  // Create mobile form sections based on content data
  const createMobileSections = () => {
    return CONTENT_SECTIONS.map(section => {
      const isActiveSection = activeSection === section.id;
      
      return {
        id: section.id,
        title: section.name,
        icon: <FileText className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            {/* Section language picker */}
            <div className="flex items-center justify-between">
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
              
              <div className="flex items-center space-x-2">
                <Switch
                  id={`preview-mode-${section.id}`}
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <Label htmlFor={`preview-mode-${section.id}`}>Preview</Label>
              </div>
            </div>
            
            {/* Content items list */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-2 flex justify-between items-center">
                <h3 className="font-medium text-sm">{section.name} Content</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.reset({
                      section: section.id,
                      key: "",
                      values: { [activeLanguage]: "" }
                    });
                    setEditingContentId(null);
                    setIsAddContentOpen(true);
                  }}
                >
                  Add New
                </Button>
              </div>
              
              <div className="divide-y">
                {Object.keys(contentByKey).length > 0 ? (
                  Object.keys(contentByKey)
                    .filter(key => contentByKey[key][Object.keys(contentByKey[key])[0]].section === section.id)
                    .map(key => (
                      <div key={key} className="p-2 flex flex-col">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs font-medium">{key}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(key)}
                            className="h-6 px-2 py-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <div className="mt-1 text-sm">
                          {contentByKey[key][activeLanguage]?.value ? (
                            <div className="text-sm line-clamp-2">
                              {contentByKey[key][activeLanguage].value}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">
                              No content in {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No content items found
                  </div>
                )}
              </div>
            </div>
            
            {/* Preview section */}
            {showPreview && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <div className="bg-muted p-2 flex justify-between items-center">
                  <h3 className="font-medium text-sm">Preview</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/content"] })}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>
                
                <div className="p-3">
                  <div className="rounded border overflow-hidden max-h-[300px] overflow-y-auto">
                    {content && content.length > 0 ? (
                      <ContentPreview 
                        content={content} 
                        section={section.id} 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <div className="p-3 text-center">
                          <p className="text-sm">No content has been added.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* View live button */}
            <Button 
              variant="outline"
              size="sm"
              onClick={() => openSectionPreview(section.id)}
              className="w-full mt-2"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Live Section
            </Button>
          </div>
        )
      };
    });
  };

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Mobile view with optimized layout
  if (isMobile) {
    return (
      <>
        <MobileFormLayout
          title="Site Content Editor"
          sections={createMobileSections()}
          onSave={undefined} // No global save function needed
        />
        
        {/* Add content dialog */}
        <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
          <DialogContent className="max-w-full w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContentId ? `Edit Content: ${editingContentId}` : "Add New Content"}
              </DialogTitle>
              <DialogDescription>
                Manage content for {CONTENT_SECTIONS.find(s => s.id === activeSection)?.name}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select
                        disabled={!!editingContentId}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTENT_SECTIONS.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!!editingContentId}
                          placeholder="e.g., company_description, legal_text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Content Translations</h3>
                  <Tabs defaultValue="en">
                    <TabsList className="mb-4">
                      {LANGUAGES.map(lang => (
                        <TabsTrigger key={lang.code} value={lang.code}>
                          {lang.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {LANGUAGES.map(lang => (
                      <TabsContent key={lang.code} value={lang.code}>
                        <FormField
                          control={form.control}
                          name={`values.${lang.code}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{lang.name} Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`Enter content in ${lang.name}`}
                                  className="min-h-32"
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
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={updateContentMutation.isPending}>
                    {updateContentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>Save Content</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // Desktop view (original layout)
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Site Content</CardTitle>
            <CardDescription>Manage multilingual static content across the site</CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openSectionPreview(activeSection)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View Live
            </Button>
            
            <Select 
              value={activeLanguage} 
              onValueChange={setActiveLanguage}
            >
              <SelectTrigger className="w-full sm:w-32">
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
            
            <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
              <DialogTrigger asChild>
                <Button>
                  {editingContentId ? "Edit Content" : "Add Content"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingContentId ? `Edit Content: ${editingContentId}` : "Add New Content"}
                  </DialogTitle>
                  <DialogDescription>
                    Manage multilingual content for the selected section
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select
                              disabled={!!editingContentId}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CONTENT_SECTIONS.map(section => (
                                  <SelectItem key={section.id} value={section.id}>
                                    {section.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Key</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., company_description, mission, etc."
                                disabled={!!editingContentId}
                              />
                            </FormControl>
                            <FormDescription>
                              A unique identifier for this content
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Content Translations</h3>
                      <Tabs defaultValue="en" className="w-full">
                        <TabsList className="w-full flex flex-wrap">
                          {LANGUAGES.map(lang => (
                            <TabsTrigger key={lang.code} value={lang.code} className="flex-1">
                              {lang.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {LANGUAGES.map(lang => (
                          <TabsContent key={lang.code} value={lang.code} className="pt-4">
                            <FormField
                              control={form.control}
                              name={`values.${lang.code}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{lang.name} Content</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder={`Enter content in ${lang.name}`}
                                      className="min-h-32"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddContentOpen(false);
                          setEditingContentId(null);
                          form.reset({
                            section: activeSection,
                            key: "",
                            values: { en: "" }
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={updateContentMutation.isPending}
                      >
                        {updateContentMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Content
                          </>
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
      
      <CardContent>
        <div className="mb-6">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid grid-cols-4">
              {CONTENT_SECTIONS.map(section => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content List */}
          <div className={showPreview ? "col-span-1 lg:col-span-1" : "col-span-1 lg:col-span-3"}>
            <div className="rounded-md border">
              <div className="p-4 border-b bg-muted/40">
                <h3 className="text-sm font-medium">
                  {CONTENT_SECTIONS.find(s => s.id === activeSection)?.name} Content
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing content in {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </p>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-3">
                  {Object.keys(contentByKey).length > 0 ? (
                    Object.keys(contentByKey).map(key => {
                      const item = contentByKey[key][activeLanguage];
                      return (
                        <div key={key} className="group border rounded-md p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{key}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {item?.value || `No content in ${activeLanguage}`}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEdit(key)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No content found for this section.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setEditingContentId(null);
                          setIsAddContentOpen(true);
                        }}
                      >
                        Add your first content
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Preview Panel */}
          {showPreview && (
            <div className="col-span-1 lg:col-span-2">
              <div className="rounded-md border h-full">
                <div className="p-4 border-b bg-muted/40 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Live Preview</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      How content will appear on the website
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/content"] })}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                <div className="p-4 h-[500px] overflow-y-auto">
                  {content && content.length > 0 ? (
                    <ContentPreview 
                      content={content} 
                      section={activeSection} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <div className="p-6 border border-dashed rounded-lg text-center max-w-md">
                        <p>No content has been added to this section yet.</p>
                        <p className="text-sm mt-2">Add some content to see a preview here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}