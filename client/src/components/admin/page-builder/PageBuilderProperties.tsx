import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageSection, PageComponent } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/components/ui/color-picker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Layers,
  AlignLeft,
  ChevronsRight,
  Eye,
  Settings,
  Check,
  X,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  Trash2,
  Type,
  LayoutGrid,
  Box,
  Image,
  List,
  Minus,
  MapPin,
  MessageSquareQuote
} from "lucide-react";

interface PageBuilderPropertiesProps {
  selectedSection: PageSection | null;
  selectedComponent: PageComponent | null;
  onUpdateSection: (section: PageSection) => void;
  onUpdateComponent: (component: PageComponent) => void;
}

export function PageBuilderProperties({
  selectedSection,
  selectedComponent,
  onUpdateSection,
  onUpdateComponent
}: PageBuilderPropertiesProps) {
  const { t, i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<string>(i18n.language.split('-')[0] || "en");
  
  // Available languages for multilingual content
  const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "et", name: "Estonian" },
    { code: "ru", name: "Russian" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "pl", name: "Polish" },
  ];
  
  const handleSectionChange = (key: string, value: any) => {
    if (!selectedSection) return;
    
    const updatedSection = { ...selectedSection };
    
    // Update settings object if it exists
    if (key.startsWith("settings.") && updatedSection.settings) {
      const settingKey = key.split(".")[1];
      updatedSection.settings = {
        ...updatedSection.settings,
        [settingKey]: value
      };
    } 
    // Handle multilingual content properties
    else if (key.startsWith("content.") && key.includes(".localized.")) {
      const [, contentKey, , lang] = key.split(".");
      
      if (!updatedSection.content) {
        updatedSection.content = {};
      }
      
      if (!updatedSection.content.localized) {
        updatedSection.content.localized = {};
      }
      
      if (!updatedSection.content.localized[contentKey]) {
        updatedSection.content.localized[contentKey] = {};
      }
      
      updatedSection.content.localized[contentKey] = {
        ...updatedSection.content.localized[contentKey],
        [lang]: value
      };
    } 
    else {
      // Otherwise update the section directly
      (updatedSection as any)[key] = value;
    }
    
    onUpdateSection(updatedSection);
  };
  
  const handleComponentChange = (key: string, value: any) => {
    if (!selectedComponent) return;
    
    const updatedComponent = { ...selectedComponent };
    
    // Update content object if it exists
    if (key.startsWith("content.") && !key.includes(".localized.") && updatedComponent.content) {
      const contentKey = key.split(".")[1];
      updatedComponent.content = {
        ...updatedComponent.content,
        [contentKey]: value
      };
    } 
    // Handle multilingual content
    else if (key.startsWith("content.") && key.includes(".localized.")) {
      const [, contentKey, , lang] = key.split(".");
      
      if (!updatedComponent.content) {
        updatedComponent.content = {};
      }
      
      if (!updatedComponent.content.localized) {
        updatedComponent.content.localized = {};
      }
      
      if (!updatedComponent.content.localized[contentKey]) {
        updatedComponent.content.localized[contentKey] = {};
      }
      
      updatedComponent.content.localized[contentKey] = {
        ...updatedComponent.content.localized[contentKey],
        [lang]: value
      };
    } 
    else {
      // Otherwise update the component directly
      (updatedComponent as any)[key] = value;
    }
    
    onUpdateComponent(updatedComponent);
  };
  
  // Get localized content for a component field
  const getLocalizedContent = (component: PageComponent, field: string): string => {
    if (!component.content?.localized?.[field]?.[activeLanguage]) {
      return component.content?.[field] || "";
    }
    return component.content.localized[field][activeLanguage];
  };
  
  // If no section or component is selected, show a placeholder
  if (!selectedSection && !selectedComponent) {
    return (
      <div className="w-80 flex-shrink-0 border-l bg-background flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">{t("pageBuilder.properties", "Properties")}</h2>
          </div>
          
          <div className="mt-3">
            <Label htmlFor="language-selector" className="text-xs">
              {t("pageBuilder.editingLanguage", "Editing Language")}
            </Label>
            <Select
              value={activeLanguage}
              onValueChange={setActiveLanguage}
            >
              <SelectTrigger id="language-selector" className="h-7 mt-1">
                <SelectValue />
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
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <Settings className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium mb-2">
              {t("pageBuilder.noSelection", "No Selection")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
              {t("pageBuilder.selectElement", "Select a section or component to edit its properties")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render appropriate editor based on what is selected
  return (
    <div className="w-80 flex-shrink-0 border-l bg-background flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-sm font-medium flex items-center">
          {selectedSection && !selectedComponent && (
            <>
              <Layers className="h-4 w-4 mr-2" />
              {t("pageBuilder.sectionProperties", "Section Properties")}
            </>
          )}
          {selectedComponent && (
            <>
              <Box className="h-4 w-4 mr-2" />
              {t("pageBuilder.componentProperties", "Component Properties")}
            </>
          )}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => {
            if (selectedComponent) {
              onUpdateComponent(selectedComponent);
            } else if (selectedSection) {
              onUpdateSection(selectedSection);
            }
          }}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4">
          {selectedSection && !selectedComponent && (
            <SectionProperties
              section={selectedSection}
              onUpdateSection={onUpdateSection}
            />
          )}
          
          {selectedComponent && (
            <ComponentProperties
              component={selectedComponent}
              onUpdateComponent={onUpdateComponent}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function SectionProperties({
  section,
  onUpdateSection
}: {
  section: PageSection;
  onUpdateSection: (section: PageSection) => void;
}) {
  const { t } = useTranslation();
  
  const handleChange = (key: string, value: any) => {
    const updatedSection = { ...section };
    
    if (key.startsWith("settings.") && updatedSection.settings) {
      const settingKey = key.split(".")[1];
      updatedSection.settings = {
        ...updatedSection.settings,
        [settingKey]: value
      };
    } else {
      (updatedSection as any)[key] = value;
    }
    
    onUpdateSection(updatedSection);
  };
  
  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2">
          {t("pageBuilder.basicProperties", "Basic Properties")}
        </h3>
        
        <div className="grid gap-2">
          <Label htmlFor="section-title">
            {t("pageBuilder.sectionTitle", "Section Title")}
          </Label>
          <Input
            id="section-title"
            value={section.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-8"
          />
          <p className="text-[0.8rem] text-muted-foreground">
            {t("pageBuilder.sectionTitleHint", "Internal title (not visible on the page)")}
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="section-type">
            {t("pageBuilder.sectionType", "Section Type")}
          </Label>
          <Select
            value={section.type || "default"}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger id="section-type" className="h-8">
              <SelectValue placeholder={t("pageBuilder.selectType", "Select type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t("pageBuilder.default", "Default")}</SelectItem>
              <SelectItem value="hero">{t("pageBuilder.hero", "Hero")}</SelectItem>
              <SelectItem value="feature">{t("pageBuilder.feature", "Feature")}</SelectItem>
              <SelectItem value="cta">{t("pageBuilder.cta", "Call to Action")}</SelectItem>
              <SelectItem value="gallery">{t("pageBuilder.gallery", "Gallery")}</SelectItem>
              <SelectItem value="testimonial">{t("pageBuilder.testimonial", "Testimonial")}</SelectItem>
              <SelectItem value="footer">{t("pageBuilder.footer", "Footer")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2">
          {t("pageBuilder.settings", "Settings")}
        </h3>
        
        <Accordion type="single" collapsible defaultValue="layout" className="w-full">
          <AccordionItem value="layout">
            <AccordionTrigger className="text-sm py-2">
              {t("pageBuilder.layout", "Layout")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="section-full-width" className="cursor-pointer">
                      {t("pageBuilder.fullWidth", "Full Width")}
                    </Label>
                    <Switch
                      id="section-full-width"
                      checked={section.settings?.fullWidth || false}
                      onCheckedChange={(checked) => handleChange("settings.fullWidth", checked)}
                    />
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    {t("pageBuilder.fullWidthHint", "Stretch section to full page width")}
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="section-max-width">
                    {t("pageBuilder.maxWidth", "Max Width")}
                  </Label>
                  <Select
                    value={section.settings?.maxWidth || "max-w-7xl"}
                    onValueChange={(value) => handleChange("settings.maxWidth", value)}
                    disabled={section.settings?.fullWidth}
                  >
                    <SelectTrigger id="section-max-width" className="h-8">
                      <SelectValue placeholder={t("pageBuilder.selectMaxWidth", "Select max width")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="max-w-sm">{t("pageBuilder.small", "Small (640px)")}</SelectItem>
                      <SelectItem value="max-w-md">{t("pageBuilder.medium", "Medium (768px)")}</SelectItem>
                      <SelectItem value="max-w-lg">{t("pageBuilder.large", "Large (1024px)")}</SelectItem>
                      <SelectItem value="max-w-xl">{t("pageBuilder.xLarge", "Extra Large (1280px)")}</SelectItem>
                      <SelectItem value="max-w-7xl">{t("pageBuilder.xxLarge", "2X Large (1536px)")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="spacing">
            <AccordionTrigger className="text-sm py-2">
              {t("pageBuilder.spacing", "Spacing")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="section-padding-top">
                    {t("pageBuilder.paddingTop", "Padding Top")}
                  </Label>
                  <Select
                    value={section.settings?.paddingTop || "pt-8"}
                    onValueChange={(value) => handleChange("settings.paddingTop", value)}
                  >
                    <SelectTrigger id="section-padding-top" className="h-8">
                      <SelectValue placeholder={t("pageBuilder.selectPadding", "Select padding")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-0">{t("pageBuilder.none", "None")}</SelectItem>
                      <SelectItem value="pt-4">{t("pageBuilder.small", "Small")}</SelectItem>
                      <SelectItem value="pt-8">{t("pageBuilder.medium", "Medium")}</SelectItem>
                      <SelectItem value="pt-12">{t("pageBuilder.large", "Large")}</SelectItem>
                      <SelectItem value="pt-16">{t("pageBuilder.xLarge", "Extra Large")}</SelectItem>
                      <SelectItem value="pt-24">{t("pageBuilder.xxLarge", "2X Large")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="section-padding-bottom">
                    {t("pageBuilder.paddingBottom", "Padding Bottom")}
                  </Label>
                  <Select
                    value={section.settings?.paddingBottom || "pb-8"}
                    onValueChange={(value) => handleChange("settings.paddingBottom", value)}
                  >
                    <SelectTrigger id="section-padding-bottom" className="h-8">
                      <SelectValue placeholder={t("pageBuilder.selectPadding", "Select padding")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pb-0">{t("pageBuilder.none", "None")}</SelectItem>
                      <SelectItem value="pb-4">{t("pageBuilder.small", "Small")}</SelectItem>
                      <SelectItem value="pb-8">{t("pageBuilder.medium", "Medium")}</SelectItem>
                      <SelectItem value="pb-12">{t("pageBuilder.large", "Large")}</SelectItem>
                      <SelectItem value="pb-16">{t("pageBuilder.xLarge", "Extra Large")}</SelectItem>
                      <SelectItem value="pb-24">{t("pageBuilder.xxLarge", "2X Large")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="appearance">
            <AccordionTrigger className="text-sm py-2">
              {t("pageBuilder.appearance", "Appearance")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="section-background-color">
                    {t("pageBuilder.backgroundColor", "Background Color")}
                  </Label>
                  <Select
                    value={section.settings?.backgroundColor || "bg-white"}
                    onValueChange={(value) => handleChange("settings.backgroundColor", value)}
                  >
                    <SelectTrigger id="section-background-color" className="h-8">
                      <SelectValue placeholder={t("pageBuilder.selectColor", "Select color")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-white">{t("pageBuilder.white", "White")}</SelectItem>
                      <SelectItem value="bg-gray-50">{t("pageBuilder.lightGray", "Light Gray")}</SelectItem>
                      <SelectItem value="bg-gray-100">{t("pageBuilder.gray", "Gray")}</SelectItem>
                      <SelectItem value="bg-primary-50">{t("pageBuilder.primaryLight", "Primary Light")}</SelectItem>
                      <SelectItem value="bg-primary-100">{t("pageBuilder.primaryLighter", "Primary Lighter")}</SelectItem>
                      <SelectItem value="bg-primary">{t("pageBuilder.primary", "Primary")}</SelectItem>
                      <SelectItem value="bg-secondary-50">{t("pageBuilder.secondaryLight", "Secondary Light")}</SelectItem>
                      <SelectItem value="bg-secondary">{t("pageBuilder.secondary", "Secondary")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="section-custom-classes">
                    {t("pageBuilder.customClasses", "Custom CSS Classes")}
                  </Label>
                  <Input
                    id="section-custom-classes"
                    value={section.settings?.cssClasses || ""}
                    onChange={(e) => handleChange("settings.cssClasses", e.target.value)}
                    className="h-8"
                    placeholder="e.g. shadow-lg rounded-lg overflow-hidden"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    {t("pageBuilder.customClassesHint", "Add custom Tailwind classes")}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm py-2">
              {t("pageBuilder.advanced", "Advanced")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="section-id">
                    {t("pageBuilder.sectionId", "Section ID")}
                  </Label>
                  <Input
                    id="section-id"
                    value={section.settings?.id || ""}
                    onChange={(e) => handleChange("settings.id", e.target.value)}
                    className="h-8"
                    placeholder="e.g. about-us"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    {t("pageBuilder.sectionIdHint", "HTML ID for anchor links")}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Components */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2 flex items-center justify-between">
          <span>{t("pageBuilder.components", "Components")}</span>
          <span className="text-xs text-muted-foreground">
            {section.components.length} {t("pageBuilder.items", "items")}
          </span>
        </h3>
        
        <div className="space-y-2">
          {section.components.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">
                {t("pageBuilder.noComponents", "No components in this section")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t("pageBuilder.dragComponentsHint", "Drag components from the toolbox")}
              </p>
            </div>
          ) : (
            section.components.map((component, index) => (
              <div 
                key={component.id}
                className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-accent/50 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center rounded-md bg-muted">
                    {getComponentIcon(component.type)}
                  </div>
                  <span className="ml-2 text-sm">{component.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{index + 1}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ComponentProperties({
  component,
  onUpdateComponent
}: {
  component: PageComponent;
  onUpdateComponent: (component: PageComponent) => void;
}) {
  const { t, i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<string>(i18n.language.split('-')[0] || "en");
  
  // Available languages for multilingual content
  const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "et", name: "Estonian" },
    { code: "ru", name: "Russian" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "pl", name: "Polish" },
  ];
  
  // Get list items for the current language
  const [listItems, setListItems] = useState<string[]>(
    component.type === "list" && component.content?.localized?.items?.[activeLanguage]
      ? [...component.content.localized.items[activeLanguage]]
      : component.type === "list" && component.content?.items
        ? [...component.content.items]
        : []
  );
  
  const handleChange = (key: string, value: any) => {
    const updatedComponent = { ...component };
    
    if (key.startsWith("content.") && updatedComponent.content) {
      const contentKey = key.split(".")[1];
      updatedComponent.content = {
        ...updatedComponent.content,
        [contentKey]: value
      };
    } else {
      (updatedComponent as any)[key] = value;
    }
    
    onUpdateComponent(updatedComponent);
  };
  
  // Helper function to get localized content for a component field
  const getLocalizedContent = (component: PageComponent, field: string): string => {
    if (!component.content?.localized?.[field]?.[activeLanguage]) {
      return component.content?.[field] || "";
    }
    return component.content.localized[field][activeLanguage];
  };
  
  const updateListItems = () => {
    if (component.type === "list") {
      // Update the localized items for the current language
      handleChange(`content.localized.items.${activeLanguage}`, listItems);
    }
  };
  
  const addListItem = () => {
    const newItems = [...listItems, t("pageBuilder.newItem", "New Item")];
    setListItems(newItems);
    
    // Update the localized items for the current language
    handleChange(`content.localized.items.${activeLanguage}`, newItems);
  };
  
  const removeListItem = (index: number) => {
    const newItems = listItems.filter((_, i) => i !== index);
    setListItems(newItems);
    
    // Update the localized items for the current language
    handleChange(`content.localized.items.${activeLanguage}`, newItems);
  };
  
  const updateListItem = (index: number, value: string) => {
    const newItems = [...listItems];
    newItems[index] = value;
    setListItems(newItems);
    
    // We don't call handleChange here because we don't want to update 
    // the component on every keystroke - we'll do it on blur with updateListItems
  };
  
  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2">
          {t("pageBuilder.basicProperties", "Basic Properties")}
        </h3>
        
        <div className="grid gap-2">
          <Label htmlFor="component-name">
            {t("pageBuilder.componentName", "Component Name")}
          </Label>
          <Input
            id="component-name"
            value={component.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="h-8"
          />
          <p className="text-[0.8rem] text-muted-foreground">
            {t("pageBuilder.componentNameHint", "Internal name (not visible on the page)")}
          </p>
        </div>
        
        {/* Global Language Selector */}
        {["heading", "paragraph", "list", "button"].includes(component.type || "") && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <Label>{t("pageBuilder.language", "Language")}</Label>
              <Badge variant="outline" className="text-xs font-normal">
                {LANGUAGES.find(l => l.code === activeLanguage)?.name}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant={activeLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-0 h-7"
                  onClick={() => {
                    // If working with list items, save before switching
                    if (component.type === "list") {
                      updateListItems();
                    }
                    
                    // Switch to new language
                    setActiveLanguage(lang.code);
                    
                    // If type is list, load items for the new language
                    if (component.type === "list") {
                      const newLangItems = component.content?.localized?.items?.[lang.code] || 
                                         (lang.code === "en" && component.content?.items) || 
                                         [];
                      setListItems([...newLangItems]);
                    }
                  }}
                >
                  {lang.code.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Content Properties based on component type */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium border-b pb-2">
          {t("pageBuilder.contentProperties", "Content Properties")}
        </h3>
        
        {/* Heading Component */}
        {component.type === "heading" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="heading-text">
                  {t("pageBuilder.text", "Text")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="heading-text"
                value={getLocalizedContent(component, "text")}
                onChange={(e) => handleChange(`content.localized.text.${activeLanguage}`, e.target.value)}
                className="h-8"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heading-size">
                {t("pageBuilder.size", "Size")}
              </Label>
              <Select
                value={component.content?.size || "h2"}
                onValueChange={(value) => handleChange("content.size", value)}
              >
                <SelectTrigger id="heading-size" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectSize", "Select size")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">{t("pageBuilder.h1", "Heading 1 (H1)")}</SelectItem>
                  <SelectItem value="h2">{t("pageBuilder.h2", "Heading 2 (H2)")}</SelectItem>
                  <SelectItem value="h3">{t("pageBuilder.h3", "Heading 3 (H3)")}</SelectItem>
                  <SelectItem value="h4">{t("pageBuilder.h4", "Heading 4 (H4)")}</SelectItem>
                  <SelectItem value="h5">{t("pageBuilder.h5", "Heading 5 (H5)")}</SelectItem>
                  <SelectItem value="h6">{t("pageBuilder.h6", "Heading 6 (H6)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heading-alignment">
                {t("pageBuilder.alignment", "Alignment")}
              </Label>
              <Select
                value={component.content?.alignment || "left"}
                onValueChange={(value) => handleChange("content.alignment", value)}
              >
                <SelectTrigger id="heading-alignment" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectAlignment", "Select alignment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">{t("pageBuilder.left", "Left")}</SelectItem>
                  <SelectItem value="center">{t("pageBuilder.center", "Center")}</SelectItem>
                  <SelectItem value="right">{t("pageBuilder.right", "Right")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="heading-color">
                {t("pageBuilder.color", "Color")}
              </Label>
              <ColorPicker
                color={component.content?.color || "#000000"}
                onChange={(color) => handleChange("content.color", color)}
              />
            </div>
          </div>
        )}
        
        {/* Paragraph Component */}
        {component.type === "paragraph" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="paragraph-text">
                  {t("pageBuilder.text", "Text")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Textarea
                id="paragraph-text"
                value={getLocalizedContent(component, "text")}
                onChange={(e) => handleChange(`content.localized.text.${activeLanguage}`, e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paragraph-size">
                {t("pageBuilder.size", "Size")}
              </Label>
              <Select
                value={component.content?.size || "base"}
                onValueChange={(value) => handleChange("content.size", value)}
              >
                <SelectTrigger id="paragraph-size" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectSize", "Select size")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">{t("pageBuilder.extraSmall", "Extra Small")}</SelectItem>
                  <SelectItem value="sm">{t("pageBuilder.small", "Small")}</SelectItem>
                  <SelectItem value="base">{t("pageBuilder.medium", "Medium (Default)")}</SelectItem>
                  <SelectItem value="lg">{t("pageBuilder.large", "Large")}</SelectItem>
                  <SelectItem value="xl">{t("pageBuilder.extraLarge", "Extra Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paragraph-alignment">
                {t("pageBuilder.alignment", "Alignment")}
              </Label>
              <Select
                value={component.content?.alignment || "left"}
                onValueChange={(value) => handleChange("content.alignment", value)}
              >
                <SelectTrigger id="paragraph-alignment" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectAlignment", "Select alignment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">{t("pageBuilder.left", "Left")}</SelectItem>
                  <SelectItem value="center">{t("pageBuilder.center", "Center")}</SelectItem>
                  <SelectItem value="right">{t("pageBuilder.right", "Right")}</SelectItem>
                  <SelectItem value="justify">{t("pageBuilder.justify", "Justify")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paragraph-color">
                {t("pageBuilder.color", "Color")}
              </Label>
              <ColorPicker
                color={component.content?.color || "#374151"}
                onChange={(color) => handleChange("content.color", color)}
              />
            </div>
          </div>
        )}
        
        {/* Image Component */}
        {component.type === "image" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="image-src">
                {t("pageBuilder.imageSource", "Image Source (URL)")}
              </Label>
              <Input
                id="image-src"
                value={component.content?.src || ""}
                onChange={(e) => handleChange("content.src", e.target.value)}
                className="h-8"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image-alt">
                {t("pageBuilder.altText", "Alt Text")}
              </Label>
              <Input
                id="image-alt"
                value={component.content?.alt || ""}
                onChange={(e) => handleChange("content.alt", e.target.value)}
                className="h-8"
                placeholder={t("pageBuilder.altTextPlaceholder", "Description for screen readers")}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image-width">
                {t("pageBuilder.width", "Width")}
              </Label>
              <Input
                id="image-width"
                value={component.content?.width || "100%"}
                onChange={(e) => handleChange("content.width", e.target.value)}
                className="h-8"
                placeholder="100%, 300px, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image-height">
                {t("pageBuilder.height", "Height")}
              </Label>
              <Input
                id="image-height"
                value={component.content?.height || "auto"}
                onChange={(e) => handleChange("content.height", e.target.value)}
                className="h-8"
                placeholder="auto, 300px, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image-border-radius">
                {t("pageBuilder.borderRadius", "Border Radius")}
              </Label>
              <Select
                value={component.content?.borderRadius || "none"}
                onValueChange={(value) => handleChange("content.borderRadius", value)}
              >
                <SelectTrigger id="image-border-radius" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectRadius", "Select radius")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("pageBuilder.none", "None")}</SelectItem>
                  <SelectItem value="0.25rem">{t("pageBuilder.small", "Small")}</SelectItem>
                  <SelectItem value="0.5rem">{t("pageBuilder.medium", "Medium")}</SelectItem>
                  <SelectItem value="1rem">{t("pageBuilder.large", "Large")}</SelectItem>
                  <SelectItem value="9999px">{t("pageBuilder.round", "Round")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="image-caption">
                  {t("pageBuilder.caption", "Caption")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="image-caption"
                value={getLocalizedContent(component, "caption")}
                onChange={(e) => handleChange(`content.localized.caption.${activeLanguage}`, e.target.value)}
                className="h-8"
                placeholder={t("pageBuilder.captionPlaceholder", "Optional image caption")}
              />
            </div>
          </div>
        )}
        
        {/* List Component */}
        {component.type === "list" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="list-type">
                {t("pageBuilder.listType", "List Type")}
              </Label>
              <Select
                value={component.content?.type || "unordered"}
                onValueChange={(value) => handleChange("content.type", value)}
              >
                <SelectTrigger id="list-type" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectListType", "Select list type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unordered">{t("pageBuilder.unordered", "Unordered (Bullets)")}</SelectItem>
                  <SelectItem value="ordered">{t("pageBuilder.ordered", "Ordered (Numbers)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Language Selector Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("pageBuilder.language", "Language")}</Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={activeLanguage === lang.code ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-2 py-0 h-7"
                    onClick={() => {
                      // Save current language items before switching
                      updateListItems();
                      
                      // Switch to new language
                      setActiveLanguage(lang.code);
                      
                      // Load items for the new language
                      const newLangItems = component.content?.localized?.items?.[lang.code] || 
                                         (lang.code === "en" && component.content?.items) || 
                                         [];
                      setListItems([...newLangItems]);
                    }}
                  >
                    {lang.code.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("pageBuilder.listItems", "List Items")}</Label>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={addListItem}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 mt-2">
                {listItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateListItem(index, e.target.value)}
                      onBlur={updateListItems}
                      className="h-8"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeListItem(index)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {listItems.length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">
                      {t("pageBuilder.noListItems", "No list items")}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={addListItem}
                    >
                      <PlusCircle className="h-3 w-3 mr-2" />
                      {t("pageBuilder.addItem", "Add Item")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Button Component */}
        {component.type === "button" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="button-text">
                  {t("pageBuilder.text", "Text")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="button-text"
                value={getLocalizedContent(component, "text")}
                onChange={(e) => handleChange(`content.localized.text.${activeLanguage}`, e.target.value)}
                className="h-8"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="button-url">
                {t("pageBuilder.url", "URL")}
              </Label>
              <Input
                id="button-url"
                value={component.content?.url || "#"}
                onChange={(e) => handleChange("content.url", e.target.value)}
                className="h-8"
                placeholder="https://example.com or #section-id"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="button-type">
                {t("pageBuilder.buttonType", "Button Type")}
              </Label>
              <Select
                value={component.content?.type || "primary"}
                onValueChange={(value) => handleChange("content.type", value)}
              >
                <SelectTrigger id="button-type" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectButtonType", "Select button type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">{t("pageBuilder.primary", "Primary")}</SelectItem>
                  <SelectItem value="secondary">{t("pageBuilder.secondary", "Secondary")}</SelectItem>
                  <SelectItem value="outline">{t("pageBuilder.outline", "Outline")}</SelectItem>
                  <SelectItem value="ghost">{t("pageBuilder.ghost", "Ghost")}</SelectItem>
                  <SelectItem value="link">{t("pageBuilder.link", "Link")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="button-size">
                {t("pageBuilder.size", "Size")}
              </Label>
              <Select
                value={component.content?.size || "medium"}
                onValueChange={(value) => handleChange("content.size", value)}
              >
                <SelectTrigger id="button-size" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectSize", "Select size")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t("pageBuilder.small", "Small")}</SelectItem>
                  <SelectItem value="medium">{t("pageBuilder.medium", "Medium")}</SelectItem>
                  <SelectItem value="large">{t("pageBuilder.large", "Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="button-new-tab" className="cursor-pointer">
                  {t("pageBuilder.openInNewTab", "Open in New Tab")}
                </Label>
                <Switch
                  id="button-new-tab"
                  checked={component.content?.openInNewTab || false}
                  onCheckedChange={(checked) => handleChange("content.openInNewTab", checked)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Divider Component */}
        {component.type === "divider" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="divider-color">
                {t("pageBuilder.color", "Color")}
              </Label>
              <ColorPicker
                color={component.content?.color || "#e2e8f0"}
                onChange={(color) => handleChange("content.color", color)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="divider-width">
                {t("pageBuilder.width", "Width")}
              </Label>
              <Input
                id="divider-width"
                value={component.content?.width || "100%"}
                onChange={(e) => handleChange("content.width", e.target.value)}
                className="h-8"
                placeholder="100%, 200px, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="divider-height">
                {t("pageBuilder.height", "Height")}
              </Label>
              <Input
                id="divider-height"
                value={component.content?.height || "1px"}
                onChange={(e) => handleChange("content.height", e.target.value)}
                className="h-8"
                placeholder="1px, 2px, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="divider-margin">
                {t("pageBuilder.margin", "Margin")}
              </Label>
              <Select
                value={component.content?.margin || "my-6"}
                onValueChange={(value) => handleChange("content.margin", value)}
              >
                <SelectTrigger id="divider-margin" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectMargin", "Select margin")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my-2">{t("pageBuilder.small", "Small")}</SelectItem>
                  <SelectItem value="my-4">{t("pageBuilder.medium", "Medium")}</SelectItem>
                  <SelectItem value="my-6">{t("pageBuilder.large", "Large")}</SelectItem>
                  <SelectItem value="my-8">{t("pageBuilder.xLarge", "Extra Large")}</SelectItem>
                  <SelectItem value="my-12">{t("pageBuilder.xxLarge", "2X Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Map Component */}
        {component.type === "map" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="map-address">
                  {t("pageBuilder.address", "Address")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="map-address"
                value={getLocalizedContent(component, "address")}
                onChange={(e) => handleChange(`content.localized.address.${activeLanguage}`, e.target.value)}
                className="h-8"
                placeholder="Tornimäe tn 5, Tallinn, Estonia"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                {t("pageBuilder.addressHint", "Location to show on the map")}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="map-zoom">
                {t("pageBuilder.zoomLevel", "Zoom Level")}
              </Label>
              <Select
                value={component.content?.zoom?.toString() || "14"}
                onValueChange={(value) => handleChange("content.zoom", parseInt(value))}
              >
                <SelectTrigger id="map-zoom" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectZoom", "Select zoom level")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">{t("pageBuilder.cityWide", "City (10)")}</SelectItem>
                  <SelectItem value="12">{t("pageBuilder.district", "District (12)")}</SelectItem>
                  <SelectItem value="14">{t("pageBuilder.streets", "Streets (14)")}</SelectItem>
                  <SelectItem value="16">{t("pageBuilder.buildings", "Buildings (16)")}</SelectItem>
                  <SelectItem value="18">{t("pageBuilder.closeUp", "Close-up (18)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="map-height">
                {t("pageBuilder.height", "Height")}
              </Label>
              <Input
                id="map-height"
                value={component.content?.height || "400px"}
                onChange={(e) => handleChange("content.height", e.target.value)}
                className="h-8"
                placeholder="400px"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="map-type">
                {t("pageBuilder.mapType", "Map Type")}
              </Label>
              <Select
                value={component.content?.mapType || "roadmap"}
                onValueChange={(value) => handleChange("content.mapType", value)}
              >
                <SelectTrigger id="map-type" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectMapType", "Select map type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roadmap">{t("pageBuilder.roadmap", "Road Map")}</SelectItem>
                  <SelectItem value="satellite">{t("pageBuilder.satellite", "Satellite")}</SelectItem>
                  <SelectItem value="terrain">{t("pageBuilder.terrain", "Terrain")}</SelectItem>
                  <SelectItem value="hybrid">{t("pageBuilder.hybrid", "Hybrid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="map-marker" className="cursor-pointer">
                  {t("pageBuilder.showMarker", "Show Marker")}
                </Label>
                <Switch
                  id="map-marker"
                  checked={component.content?.showMarker || true}
                  onCheckedChange={(checked) => handleChange("content.showMarker", checked)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Gallery Component */}
        {component.type === "gallery" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="gallery-columns">
                {t("pageBuilder.columns", "Columns")}
              </Label>
              <Select
                value={String(component.content?.columns || "3")}
                onValueChange={(value) => handleChange("content.columns", parseInt(value))}
              >
                <SelectTrigger id="gallery-columns" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectColumns", "Select columns")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gallery-columns-mobile">
                {t("pageBuilder.columnsOnMobile", "Columns on Mobile")}
              </Label>
              <Select
                value={String(component.content?.columnsOnMobile || "1")}
                onValueChange={(value) => handleChange("content.columnsOnMobile", parseInt(value))}
              >
                <SelectTrigger id="gallery-columns-mobile" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectColumns", "Select columns")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gallery-spacing">
                {t("pageBuilder.spacing", "Spacing")}
              </Label>
              <Select
                value={component.content?.spacing || "gap-4"}
                onValueChange={(value) => handleChange("content.spacing", value)}
              >
                <SelectTrigger id="gallery-spacing" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectSpacing", "Select spacing")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gap-0">{t("pageBuilder.none", "None")}</SelectItem>
                  <SelectItem value="gap-2">{t("pageBuilder.small", "Small")}</SelectItem>
                  <SelectItem value="gap-4">{t("pageBuilder.medium", "Medium")}</SelectItem>
                  <SelectItem value="gap-6">{t("pageBuilder.large", "Large")}</SelectItem>
                  <SelectItem value="gap-8">{t("pageBuilder.extraLarge", "Extra Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>
                {t("pageBuilder.galleryImages", "Gallery Images")}
              </Label>
              
              <div className="space-y-3 pt-2">
                {component.content?.images?.map((image: any, index: number) => (
                  <Card key={index} className="p-2 relative">
                    <div className="flex items-start gap-3">
                      <img
                        src={image.src}
                        alt={image.alt || ""}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={image.src}
                          onChange={(e) => {
                            const updatedImages = [...(component.content?.images || [])];
                            updatedImages[index] = {
                              ...updatedImages[index],
                              src: e.target.value
                            };
                            handleChange("content.images", updatedImages);
                          }}
                          className="h-8"
                          placeholder={t("pageBuilder.imageUrl", "Image URL")}
                        />
                        <Input
                          value={image.alt || ""}
                          onChange={(e) => {
                            const updatedImages = [...(component.content?.images || [])];
                            updatedImages[index] = {
                              ...updatedImages[index],
                              alt: e.target.value
                            };
                            handleChange("content.images", updatedImages);
                          }}
                          className="h-8"
                          placeholder={t("pageBuilder.altText", "Alt text")}
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`image-caption-${index}`} className="text-xs">
                                {t("pageBuilder.caption", "Caption")}
                              </Label>
                              <Badge variant="outline" className="text-xs font-normal">
                                {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                              </Badge>
                            </div>
                            <Input
                              id={`image-caption-${index}`}
                              value={
                                ((image.localized && image.localized.caption && 
                                  image.localized.caption[activeLanguage]) ? 
                                  image.localized.caption[activeLanguage] : 
                                  image.caption) || ""
                              }
                              onChange={(e) => {
                                const updatedImages = [...(component.content?.images || [])];
                                // Ensure localized structure exists
                                if (!updatedImages[index].localized) {
                                  updatedImages[index].localized = {};
                                }
                                if (!updatedImages[index].localized.caption) {
                                  updatedImages[index].localized.caption = {};
                                }
                                // Update the localized caption
                                updatedImages[index].localized.caption[activeLanguage] = e.target.value;
                                handleChange("content.images", updatedImages);
                              }}
                              className="h-8 mt-1"
                              placeholder={t("pageBuilder.captionPlaceholder", "Image caption")}
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          const updatedImages = [...(component.content?.images || [])];
                          updatedImages.splice(index, 1);
                          handleChange("content.images", updatedImages);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const updatedImages = [...(component.content?.images || [])];
                    updatedImages.push({
                      src: "/placeholder-image.jpg",
                      alt: "",
                      caption: "",
                      localized: {
                        caption: {}
                      }
                    });
                    handleChange("content.images", updatedImages);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("pageBuilder.addImage", "Add Image")}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* CTA Component */}
        {component.type === "cta" && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cta-heading">
                  {t("pageBuilder.heading", "Heading")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="cta-heading"
                value={getLocalizedContent(component, "heading")}
                onChange={(e) => handleChange(`content.localized.heading.${activeLanguage}`, e.target.value)}
                className="h-8"
                placeholder="Ready to Get Started?"
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cta-text">
                  {t("pageBuilder.text", "Text")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Textarea
                id="cta-text"
                value={getLocalizedContent(component, "text")}
                onChange={(e) => handleChange(`content.localized.text.${activeLanguage}`, e.target.value)}
                className="min-h-[80px]"
                placeholder="Contact us today to learn more about our products and services."
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cta-button-text">
                  {t("pageBuilder.buttonText", "Button Text")}
                </Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {LANGUAGES.find(l => l.code === activeLanguage)?.name}
                </Badge>
              </div>
              <Input
                id="cta-button-text"
                value={getLocalizedContent(component, "buttonText")}
                onChange={(e) => handleChange(`content.localized.buttonText.${activeLanguage}`, e.target.value)}
                className="h-8"
                placeholder="Contact Us"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-button-url">
                {t("pageBuilder.buttonUrl", "Button URL")}
              </Label>
              <Input
                id="cta-button-url"
                value={component.content?.buttonUrl || "/contact"}
                onChange={(e) => handleChange("content.buttonUrl", e.target.value)}
                className="h-8"
                placeholder="/contact"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-button-type">
                {t("pageBuilder.buttonType", "Button Type")}
              </Label>
              <Select
                value={component.content?.buttonType || "primary"}
                onValueChange={(value) => handleChange("content.buttonType", value)}
              >
                <SelectTrigger id="cta-button-type" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectButtonType", "Select button type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">{t("pageBuilder.primary", "Primary")}</SelectItem>
                  <SelectItem value="secondary">{t("pageBuilder.secondary", "Secondary")}</SelectItem>
                  <SelectItem value="outline">{t("pageBuilder.outline", "Outline")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-background">
                {t("pageBuilder.background", "Background")}
              </Label>
              <Select
                value={component.content?.background || "bg-primary/10"}
                onValueChange={(value) => handleChange("content.background", value)}
              >
                <SelectTrigger id="cta-background" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectBackground", "Select background")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-primary/10">{t("pageBuilder.primaryLight", "Primary Light")}</SelectItem>
                  <SelectItem value="bg-primary">{t("pageBuilder.primary", "Primary")}</SelectItem>
                  <SelectItem value="bg-secondary/10">{t("pageBuilder.secondaryLight", "Secondary Light")}</SelectItem>
                  <SelectItem value="bg-secondary">{t("pageBuilder.secondary", "Secondary")}</SelectItem>
                  <SelectItem value="bg-gray-100">{t("pageBuilder.light", "Light")}</SelectItem>
                  <SelectItem value="bg-gray-900">{t("pageBuilder.dark", "Dark")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-text-color">
                {t("pageBuilder.textColor", "Text Color")}
              </Label>
              <ColorPicker
                color={component.content?.textColor || "#000000"}
                onChange={(color) => handleChange("content.textColor", color)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-layout">
                {t("pageBuilder.layout", "Layout")}
              </Label>
              <Select
                value={component.content?.layout || "horizontal"}
                onValueChange={(value) => handleChange("content.layout", value)}
              >
                <SelectTrigger id="cta-layout" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectLayout", "Select layout")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">{t("pageBuilder.horizontal", "Horizontal")}</SelectItem>
                  <SelectItem value="vertical">{t("pageBuilder.vertical", "Vertical")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cta-alignment">
                {t("pageBuilder.alignment", "Alignment")}
              </Label>
              <Select
                value={component.content?.alignment || "center"}
                onValueChange={(value) => handleChange("content.alignment", value)}
              >
                <SelectTrigger id="cta-alignment" className="h-8">
                  <SelectValue placeholder={t("pageBuilder.selectAlignment", "Select alignment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">{t("pageBuilder.left", "Left")}</SelectItem>
                  <SelectItem value="center">{t("pageBuilder.center", "Center")}</SelectItem>
                  <SelectItem value="right">{t("pageBuilder.right", "Right")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get a component icon based on type
function getComponentIcon(type?: string) {
  switch (type) {
    case "heading":
      return <Type className="h-4 w-4" />;
    case "paragraph":
      return <AlignLeft className="h-4 w-4" />;
    case "image":
      return <Image className="h-4 w-4" />;
    case "list":
      return <List className="h-4 w-4" />;
    case "button":
      return <Box className="h-4 w-4" />;
    case "divider":
      return <Minus className="h-4 w-4" />;
    case "map":
      return <MapPin className="h-4 w-4" />;
    case "cta":
      return <MessageSquareQuote className="h-4 w-4" />;
    case "gallery":
      return <Image className="h-4 w-4" />;
    case "section":
      return <Layers className="h-4 w-4" />;
    case "container":
      return <Box className="h-4 w-4" />;
    case "columns":
      return <LayoutGrid className="h-4 w-4" />;
    default:
      return <Box className="h-4 w-4" />;
  }
}