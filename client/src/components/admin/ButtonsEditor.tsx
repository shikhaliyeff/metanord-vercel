import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Globe, Loader2, FileEdit } from "lucide-react";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";
import { useMediaQuery } from "@/hooks";

// Languages supported by the site
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

// Button sections
const BUTTON_SECTIONS = [
  { id: "header", name: "Header" },
  { id: "footer", name: "Footer" },
  { id: "hero", name: "Hero Section" },
  { id: "products", name: "Products Section" },
  { id: "cta", name: "Call-to-Action" },
];

interface ButtonContent {
  id: number;
  section: string;
  key: string;
  value: string;
  language: string;
}

export function ButtonsEditor() {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [activeSection, setActiveSection] = useState("header");
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Button text fields
  const [buttonTexts, setButtonTexts] = useState<Record<string, string>>({});
  
  // Fetch button content
  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: ["/api/content", activeSection, activeLanguage],
    queryFn: async () => {
      const res = await fetch(`/api/content/${activeSection}?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    }
  });

  // Update content when data loads or section/language changes
  useEffect(() => {
    if (contentData && Array.isArray(contentData)) {
      const newTexts: Record<string, string> = {};
      
      contentData.forEach((item: ButtonContent) => {
        newTexts[item.key] = item.value;
      });
      
      setButtonTexts(newTexts);
    }
  }, [contentData, activeSection, activeLanguage]);

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async (content: { section: string; key: string; value: string; language: string }) => {
      const res = await apiRequest("POST", "/api/admin/content", content);
      if (!res.ok) throw new Error("Failed to save content");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Success",
        description: "Button text updated successfully.",
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
  
  // Get button fields based on section
  const getButtonFields = () => {
    switch (activeSection) {
      case "header":
        return [
          { key: "requestQuote", label: "Request Quote Button" },
          { key: "getPrice", label: "Get Price Button" },
          { key: "requestCallback", label: "Request Callback Button" },
        ];
      case "hero":
        return [
          { key: "requestQuote", label: "Request Quote Button" },
          { key: "learnMore", label: "Learn More Button" },
          { key: "globalShipping", label: "Global Shipping Text" },
        ];
      case "products":
        return [
          { key: "viewDetails", label: "View Details Link" },
          { key: "quickPreview", label: "Quick Preview Button" },
          { key: "filters.title", label: "Filters Title" },
        ];
      case "cta":
        return [
          { key: "contactUs", label: "Contact Us Button" },
          { key: "getQuote", label: "Get Quote Button" },
          { key: "learnMore", label: "Learn More Button" },
        ];
      case "footer":
        return [
          { key: "subscribe", label: "Subscribe Button" },
          { key: "viewMap", label: "View Map Link" },
          { key: "contactSupport", label: "Contact Support Link" },
        ];
      default:
        return [];
    }
  };

  // Handle form field change
  const handleTextChange = (key: string, value: string) => {
    setButtonTexts(prev => ({ ...prev, [key]: value }));
  };

  // Save a single button text
  const handleSave = async (key: string) => {
    await saveContentMutation.mutateAsync({
      section: activeSection,
      key,
      value: buttonTexts[key] || "",
      language: activeLanguage,
    });
  };

  // Save all button texts
  const handleSaveAll = async () => {
    const fields = getButtonFields();
    
    for (const field of fields) {
      if (buttonTexts[field.key]) {
        await saveContentMutation.mutateAsync({
          section: activeSection,
          key: field.key,
          value: buttonTexts[field.key] || "",
          language: activeLanguage,
        });
      }
    }
  };

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Create form sections based on the active section for mobile layout
  const createMobileSections = () => {
    // Get the active section name for the title
    const activeSectionName = BUTTON_SECTIONS.find(section => section.id === activeSection)?.name || "Buttons";
    
    // Create an array of sections for each button section
    return BUTTON_SECTIONS.map(section => {
      // Check if this is the currently active section
      const isActive = activeSection === section.id;
      
      // Create the fields for this section
      const fields = isActive ? getButtonFields() : [];
      
      return {
        id: section.id,
        title: section.name,
        icon: <FileEdit className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            {!isActive ? (
              <div className="p-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection(section.id)}
                >
                  Edit {section.name} Buttons
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">{section.name} Buttons</h3>
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
                
                {fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`mobile-${field.key}`}>{field.label}</Label>
                    <Input
                      id={`mobile-${field.key}`}
                      value={buttonTexts[field.key] || ""}
                      onChange={(e) => handleTextChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()} text`}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(field.key)}
                        disabled={saveContentMutation.isPending}
                      >
                        {saveContentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      };
    });
  };

  // Mobile view uses the mobile-optimized form layout
  if (isMobile) {
    return (
      <MobileFormLayout
        title="Edit Buttons & Links"
        sections={createMobileSections()}
        onSave={handleSaveAll}
        isSaving={saveContentMutation.isPending}
        saveButtonText="Save All Changes"
      />
    );
  }
  
  // Desktop view uses the standard layout
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Edit Buttons & Links</CardTitle>
            <CardDescription>Update button labels and link text</CardDescription>
          </div>
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
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${BUTTON_SECTIONS.length}, 1fr)` }}>
            {BUTTON_SECTIONS.map(section => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {BUTTON_SECTIONS.map(section => (
            <TabsContent key={section.id} value={section.id}>
              <div className="grid gap-6 mt-6">
                {getButtonFields().map(field => (
                  <div key={field.key} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        id={field.key}
                        value={buttonTexts[field.key] || ""}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()} text`}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleSave(field.key)}
                        disabled={saveContentMutation.isPending}
                      >
                        {saveContentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button
          onClick={handleSaveAll}
          disabled={saveContentMutation.isPending}
          className="gap-2"
        >
          {saveContentMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </CardFooter>
    </Card>
  );
}