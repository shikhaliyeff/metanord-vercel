import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Search, Filter } from "lucide-react";

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

const documentTypes = [
  "catalog",
  "datasheet",
  "certificate",
  "manual",
  "technical",
  "presentation",
  "brochure",
  "legal"
];

const productCategories = [
  "aluminum",
  "polyethylene",
  "steel",
  "cast-iron",
  "general"
];

const DocumentBrowser = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || "en");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("all");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Fetch document categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/admin/documents/categories'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/admin/documents/categories');
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

  // Fetch documents with filters
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/documents', selectedLanguage, selectedDocumentType, selectedProductCategory, selectedCategoryId],
    queryFn: async () => {
      let url = '/api/documents';
      const params = new URLSearchParams();
      
      if (selectedLanguage && selectedLanguage !== 'all') params.append('language', selectedLanguage);
      if (selectedDocumentType && selectedDocumentType !== 'all') params.append('documentType', selectedDocumentType);
      if (selectedProductCategory && selectedProductCategory !== 'all') params.append('productCategory', selectedProductCategory);
      if (selectedCategoryId !== null && selectedCategoryId.toString() !== 'all') params.append('categoryId', selectedCategoryId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
      
      return data.documents;
    }
  });
  
  // Combined loading state
  const isLoading = isLoadingDocuments || isLoadingCategories;
  
  // Update language when i18n language changes
  useEffect(() => {
    setSelectedLanguage(i18n.language || "en");
  }, [i18n.language]);
  
  const filteredDocuments = documents
    ? documents.filter(doc => 
        doc.isPublic && // only show public documents
        (activeTab === 'all' || 
         (activeTab === 'catalogs' && doc.documentType === 'catalog') ||
         (activeTab === 'datasheets' && doc.documentType === 'datasheet') ||
         (activeTab === 'certificates' && doc.documentType === 'certificate') ||
         (activeTab === 'manuals' && doc.documentType === 'manual') || 
         (activeTab === 'others' && !['catalog', 'datasheet', 'certificate', 'manual'].includes(doc.documentType)))
        && 
        (searchQuery === '' || 
         doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];
    
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    // Sort by document type first
    const typeOrder: Record<string, number> = {
      'catalog': 1,
      'datasheet': 2,
      'certificate': 3,
      'manual': 4
    };
    
    const aTypeOrder = typeOrder[a.documentType] || 5;
    const bTypeOrder = typeOrder[b.documentType] || 5;
    
    if (aTypeOrder !== bTypeOrder) {
      return aTypeOrder - bTypeOrder;
    }
    
    // Then sort by created date (newest first)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
    return '📁';
  };
  
  const handleDownload = (id: number) => {
    window.open(`/api/documents/${id}/download`, '_blank');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t('documents.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('documents.subtitle')}</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('documents.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-80"
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="w-full md:w-auto flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {t('documents.filters')}
        </Button>
      </div>
      
      {isFilterVisible && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>{t('documents.filterOptions')}</CardTitle>
            <CardDescription>{t('documents.filterDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filterByLanguage')}</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.allLanguages')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.allLanguages')}</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="et">Estonian</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="lv">Latvian</SelectItem>
                  <SelectItem value="lt">Lithuanian</SelectItem>
                  <SelectItem value="pl">Polish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filterByType')}</label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.allTypes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.allTypes')}</SelectItem>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {t(`documents.types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filterByCategory')}</label>
              <Select 
                value={selectedCategoryId === null ? "" : selectedCategoryId.toString()}
                onValueChange={(value) => setSelectedCategoryId(value === "" ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.allCategories')}</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {t(`documents.category.${category.slug || 'general'}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('documents.filterByProductCategory')}</label>
              <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.allProductCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('documents.allProductCategories')}</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {t(`products.categories.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setSelectedDocumentType("all");
              setSelectedProductCategory("all");
              setSelectedCategoryId(null);
              // Keep the language as is
            }}>
              {t('documents.resetFilters')}
            </Button>
            <Button variant="default" onClick={() => setIsFilterVisible(false)}>
              {t('documents.applyFilters')}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full md:w-auto flex flex-wrap justify-start">
          <TabsTrigger value="all">{t('documents.all')}</TabsTrigger>
          <TabsTrigger value="catalogs">{t('documents.types.catalog')}</TabsTrigger>
          <TabsTrigger value="datasheets">{t('documents.types.datasheet')}</TabsTrigger>
          <TabsTrigger value="certificates">{t('documents.types.certificate')}</TabsTrigger>
          <TabsTrigger value="manuals">{t('documents.types.manual')}</TabsTrigger>
          <TabsTrigger value="others">{t('documents.others')}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('documents.noDocuments')}</h3>
          <p className="text-muted-foreground mt-2">{t('documents.tryChangingFilters')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDocuments.map((document) => (
            <Card key={document.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {getFileIcon(document.fileType)}
                    </span>
                    <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {t(`documents.types.${document.documentType}`)}
                  </Badge>
                  
                  {document.documentCategoryId && categories && (
                    <Badge variant="secondary" className="capitalize">
                      {t(`documents.category.${categories.find(cat => cat.id === document.documentCategoryId)?.slug || 'general'}`)}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="capitalize">
                    {t(`language.${document.language}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                {document.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {document.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>•</span>
                  <span>{t('documents.downloads', { count: document.downloads })}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => handleDownload(document.id)} 
                  className="w-full"
                  variant="default"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('documents.download')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentBrowser;