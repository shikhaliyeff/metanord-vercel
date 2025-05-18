import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { trackEvent } from "@/components/seo/GoogleTagManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, FileText, Book, Award, Search, Loader2, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Document types (using our real Document interface)
interface Document {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  fileType: string;
  fileSize: number | null;
  thumbnail: string | null;
  documentType: string;
  documentCategoryId: number | null;
  productCategories: string[] | null;
  tags: string[] | null;
  language: string;
  downloads: number;
  isPublic: boolean;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Document category interface
interface DocumentCategory {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  documentType: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean | null;
}

// Helper function to get language name
const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'et': 'Estonian',
    'ru': 'Russian',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'pl': 'Polish'
  };
  return languages[code] || code;
};

// Supported languages for the website
const supportedLanguages = ['en', 'et', 'ru', 'lv', 'lt', 'pl'];

export default function Documents() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage);
  
  // Fetch document categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/documents/categories'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/documents/categories');
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch document categories');
        }
        
        return data.categories || [];
      } catch (error) {
        console.error("Error fetching document categories:", error);
        return [];
      }
    }
  });
  
  // Fetch documents from the API with additional filtering
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/documents', selectedLanguage, selectedCategoryId],
    queryFn: async () => {
      let url = '/api/documents';
      const params = new URLSearchParams();
      
      if (selectedLanguage) params.append('language', selectedLanguage);
      if (selectedCategoryId !== null) params.append('categoryId', selectedCategoryId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
      
      return data.documents || [];
    }
  });
  
  // Loading state combined
  const isLoading = isLoadingDocuments || isLoadingCategories;
  
  // Update selected language when site language changes
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);
  
  // Filter documents based on active tab, category and search query
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    
    return documents.filter((doc: Document) => {
      // Only show public documents
      if (!doc.isPublic) return false;
      
      // First filter by document type tab
      const typeMatch = 
        activeTab === 'all' || 
        (activeTab === 'brochure' && doc.documentType === 'catalog') ||
        (activeTab === 'datasheet' && doc.documentType === 'datasheet') ||
        (activeTab === 'certificate' && doc.documentType === 'certificate') ||
        (activeTab === 'presentation' && doc.documentType === 'presentation');
      
      // Filter by category if one is selected
      const categoryMatch = 
        selectedCategoryId === null || 
        doc.documentCategoryId === selectedCategoryId;
      
      // Then filter by search query (if one exists)
      const searchMatch = searchQuery.trim() === "" || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return typeMatch && categoryMatch && searchMatch;
    });
  }, [activeTab, selectedCategoryId, searchQuery, documents]);
  
  // Handle document download
  const handleDownload = (document: Document) => {
    // Track download event for analytics
    trackEvent("document_download", {
      document_id: document.id,
      document_name: document.title,
      document_category: document.documentType,
      document_language: document.language
    });
    
    // Trigger download using the API
    window.open(`/api/documents/${document.id}/download`, '_blank');
  };
  
  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get the icon for document category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "catalog":
        return <Book className="h-5 w-5" />;
      case "certificate":
        return <Award className="h-5 w-5" />;
      case "datasheet":
        return <FileText className="h-5 w-5" />;
      case "presentation":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <>
      <MetaTags
        title={t("documents.metaTitle", "Documents & Resources - MetaNord")}
        description={t("documents.metaDescription", "Download MetaNord's brochures, technical datasheets, certificates, and presentations. Access official documentation for our products and services.")}
        keywords={["documents", "brochures", "certificates", "technical datasheets", "presentations", "MetaNord resources"]}
        type="website"
      />
      
      <SchemaOrg
        type="website"
        title={t("documents.metaTitle", "Documents & Resources - MetaNord")}
        description={t("documents.metaDescription", "Download MetaNord's brochures, technical datasheets, certificates, and presentations. Access official documentation for our products and services.")}
        url="/documents"
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('documents.pageTitle', 'Documents & Resources'), url: '/documents' }
        ]}
      />
      
      <PageHeader
        title={t("documents.pageTitle", "Documents & Resources")}
        description={t("documents.pageDescription", "Access and download our product brochures, technical specifications, certificates, and company presentations.")}
      />
      
      <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6">
          {/* Search and filter controls */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-3 xs:gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 xs:gap-4">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  <Input
                    type="text"
                    placeholder={t("documents.searchPlaceholder", "Search documents...")}
                    className="pl-8 xs:pl-10 w-full text-xs xs:text-sm h-9 sm:w-64 md:w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Select
                  value={selectedCategoryId === null ? "all" : selectedCategoryId.toString()}
                  onValueChange={(value) => setSelectedCategoryId(value === "all" ? null : parseInt(value))}
                >
                  <SelectTrigger className="w-full text-xs xs:text-sm h-9 sm:w-[140px] md:w-[180px]">
                    <SelectValue placeholder={t("documents.categoryFilter", "Category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("documents.allCategories", "All categories")}
                    </SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-full text-xs xs:text-sm h-9 sm:w-[140px] md:w-[180px]">
                    <SelectValue placeholder={t("documents.languageFilter", "Language")} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((langCode) => (
                      <SelectItem key={langCode} value={langCode}>
                        {getLanguageName(langCode)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(searchQuery || selectedCategoryId !== null || selectedLanguage !== currentLanguage) && (
                  <Button 
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategoryId(null);
                      setSelectedLanguage(currentLanguage);
                    }}
                    title={t("documents.clearFilters", "Clear filters")}
                  >
                    <Filter className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 xs:grid-cols-3 md:grid-cols-5 w-full gap-1 xs:gap-0">
                <TabsTrigger value="all" className="text-xs sm:text-sm py-1 xs:py-1.5 px-1 xs:px-2 sm:py-2 sm:px-3">
                  {t("documents.filterAll", "All")}
                </TabsTrigger>
                <TabsTrigger value="brochure" className="text-xs sm:text-sm py-1 xs:py-1.5 px-1 xs:px-2 sm:py-2 sm:px-3">
                  {t("documents.filterBrochures", "Brochures")}
                </TabsTrigger>
                <TabsTrigger value="datasheet" className="text-xs sm:text-sm py-1 xs:py-1.5 px-1 xs:px-2 sm:py-2 sm:px-3">
                  {t("documents.filterDatasheets", "Datasheets")}
                </TabsTrigger>
                <TabsTrigger value="certificate" className="text-xs sm:text-sm py-1 xs:py-1.5 px-1 xs:px-2 sm:py-2 sm:px-3">
                  {t("documents.filterCertificates", "Certs")}
                </TabsTrigger>
                <TabsTrigger value="presentation" className="text-xs sm:text-sm py-1 xs:py-1.5 px-1 xs:px-2 sm:py-2 sm:px-3">
                  {t("documents.filterPresentations", "Pres.")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-8 xs:py-10 sm:py-12">
              <Loader2 className="h-10 w-10 xs:h-12 xs:w-12 mx-auto text-primary animate-spin mb-3 xs:mb-4" />
              <h3 className="text-base xs:text-lg sm:text-xl font-medium">
                {t("documents.loading", "Loading documents...")}
              </h3>
            </div>
          )}
          
          {/* Documents grid - Enhanced for mobile with larger touch targets */}
          {!isLoading && filteredDocuments.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredDocuments.map((document) => (
                <motion.div 
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2 xs:pb-2.5 sm:pb-3 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-1 mb-1.5 xs:mb-2">
                          <Badge variant="outline" className="text-[10px] xs:text-xs py-0.5">
                            {t(`documents.type.${document.documentType}`, document.documentType)}
                          </Badge>
                          {document.documentCategoryId !== null && categories?.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] xs:text-xs py-0.5">
                              {categories.find(c => c.id === document.documentCategoryId)?.name || ""}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] xs:text-xs sm:text-sm text-gray-500">{document.fileType}</span>
                      </div>
                      <CardTitle className="text-sm xs:text-base sm:text-lg">
                        {document.title}
                      </CardTitle>
                      {document.description && (
                        <CardDescription className="text-[10px] xs:text-xs sm:text-sm line-clamp-2 mt-1">
                          {document.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2 xs:pb-2.5 sm:pb-3 px-3 xs:px-4 sm:px-6 pt-0 flex-grow">
                      <div className="flex items-center text-[10px] xs:text-xs sm:text-sm text-gray-500">
                        {getCategoryIcon(document.documentType)}
                        <span className="ml-1.5 xs:ml-2">{formatFileSize(document.fileSize)}</span>
                        <span className="mx-1.5 xs:mx-2">•</span>
                        <span>{t('documents.downloads', { count: document.downloads })}</span>
                      </div>
                      {document.productCategories && document.productCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 xs:mt-2 sm:mt-3">
                          {document.productCategories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-[10px] xs:text-xs py-0.5">
                              {t(`products.categories.${category}`, category)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 xs:pt-2.5 sm:pt-3 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6 border-t">
                      <Button 
                        onClick={() => handleDownload(document)} 
                        className="w-full py-2 xs:py-2.5 sm:py-2 text-xs xs:text-sm sm:text-base touch-manipulation active:scale-[0.98] transition-transform"
                        variant="default"
                      >
                        <Download className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                        {t("documents.download", "Download")}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Empty state */}
          {!isLoading && filteredDocuments.length === 0 && (
            <div className="text-center py-8 xs:py-10 sm:py-12">
              <FileText className="h-10 w-10 xs:h-12 xs:w-12 mx-auto text-gray-400 mb-3 xs:mb-4" />
              <h3 className="text-base xs:text-lg sm:text-xl font-medium mb-1.5 xs:mb-2">
                {t("documents.noDocumentsFound", "No documents found")}
              </h3>
              <p className="text-sm xs:text-base text-gray-500 mb-4 xs:mb-6 px-4">
                {t("documents.tryDifferentSearch", "Try a different search term or category")}
              </p>
              <Button 
                variant="outline" 
                className="text-xs xs:text-sm py-1.5 xs:py-2 px-3 xs:px-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                  setSelectedCategoryId(null);
                  setSelectedLanguage(currentLanguage);
                }}
              >
                {t("documents.resetFilters", "Reset filters")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}