import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FilePlus, FileEdit, FileX, Download, Languages, Filter } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { CardTable } from "@/components/ui/card-table";

interface Document {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  fileType: string;
  fileSize: number | null;
  thumbnail: string | null;
  documentType: string;
  productCategories: string[] | null;
  tags: string[] | null;
  language: string;
  downloads: number;
  isPublic: boolean;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface DocumentFormData {
  title: string;
  description: string;
  documentType: string;
  language: string;
  productCategories: string[];
  tags: string[];
  isPublic: boolean;
  file?: File | null;
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

const DocumentManager = () => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    description: "",
    documentType: "catalog",
    language: i18n.language || "en",
    productCategories: [],
    tags: [],
    isPublic: true,
    file: null
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch documents with optional filters
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents', selectedLanguage, selectedDocumentType, selectedProductCategory],
    queryFn: async () => {
      let url = '/api/documents';
      const params = new URLSearchParams();
      
      if (selectedLanguage) params.append('language', selectedLanguage);
      if (selectedDocumentType) params.append('documentType', selectedDocumentType);
      if (selectedProductCategory) params.append('productCategory', selectedProductCategory);
      
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
  
  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create document');
      }
      
      return data.document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: t('admin.documents.createSuccess'),
        description: t('admin.documents.documentCreated'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.documents.createError'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        body: formData
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update document');
      }
      
      return data.document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      resetForm();
      toast({
        title: t('admin.documents.updateSuccess'),
        description: t('admin.documents.documentUpdated'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.documents.updateError'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete document');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: t('admin.documents.deleteSuccess'),
        description: t('admin.documents.documentDeleted'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.documents.deleteError'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      documentType: "catalog",
      language: i18n.language || "en",
      productCategories: [],
      tags: [],
      isPublic: true,
      file: null
    });
  };
  
  const handleCreateDocument = () => {
    if (!formData.file) {
      toast({
        title: t('admin.documents.validationError'),
        description: t('admin.documents.fileRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('documentType', formData.documentType);
    formDataToSend.append('language', formData.language);
    formDataToSend.append('productCategories', JSON.stringify(formData.productCategories));
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    formDataToSend.append('isPublic', String(formData.isPublic));
    formDataToSend.append('file', formData.file);
    
    createDocumentMutation.mutate(formDataToSend);
  };
  
  const handleUpdateDocument = () => {
    if (!selectedDocument) return;
    
    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('documentType', formData.documentType);
    formDataToSend.append('language', formData.language);
    formDataToSend.append('productCategories', JSON.stringify(formData.productCategories));
    formDataToSend.append('tags', JSON.stringify(formData.tags));
    formDataToSend.append('isPublic', String(formData.isPublic));
    
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
    
    updateDocumentMutation.mutate({ id: selectedDocument.id, formData: formDataToSend });
  };
  
  const handleDeleteDocument = (id: number) => {
    if (window.confirm(t('admin.documents.confirmDelete'))) {
      deleteDocumentMutation.mutate(id);
    }
  };
  
  const editDocument = (document: Document) => {
    setSelectedDocument(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      documentType: document.documentType,
      language: document.language,
      productCategories: document.productCategories || [],
      tags: document.tags || [],
      isPublic: document.isPublic,
      file: null
    });
    setIsEditDialogOpen(true);
  };
  
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
    return '📁';
  };
  
  const filteredDocuments = documents
    ? documents.filter(doc => 
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
    // Sort by created date (newest first)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  
  const columns = [
    {
      header: t('admin.documents.title'),
      accessorKey: 'title',
      isMobileTitle: true,
      className: 'font-medium'
    },
    {
      header: t('admin.documents.type'),
      accessorKey: 'documentType',
      cell: (document: Document) => (
        <Badge variant="outline" className="capitalize">
          {document.documentType}
        </Badge>
      ),
      isVisibleOnMobile: true,
      labelInMobile: t('admin.documents.type')
    },
    {
      header: t('admin.documents.language'),
      accessorKey: 'language',
      cell: (document: Document) => (
        <Badge variant="outline" className="uppercase">
          {document.language}
        </Badge>
      ),
      isVisibleOnMobile: false
    },
    {
      header: t('admin.documents.size'),
      accessorKey: 'fileSize',
      cell: (document: Document) => formatFileSize(document.fileSize),
      isVisibleOnMobile: false
    },
    {
      header: t('admin.documents.downloads'),
      accessorKey: 'downloads',
      cell: (document: Document) => document.downloads || 0,
      isVisibleOnMobile: true,
      labelInMobile: t('admin.documents.downloads')
    },
    {
      header: t('admin.documents.actions'),
      cell: (document: Document) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => editDocument(document)}
            title={t('admin.documents.edit')}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteDocument(document.id)} 
            title={t('admin.documents.delete')}
          >
            <FileX className="h-4 w-4 text-destructive" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.open(`/api/documents/${document.id}/download`, '_blank')}
            title={t('admin.documents.download')}
          >
            <Download className="h-4 w-4 text-primary" />
          </Button>
        </div>
      ),
      isVisibleOnMobile: true,
      labelInMobile: t('admin.documents.actions')
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.documents.title')}</h2>
          <p className="text-muted-foreground">{t('admin.documents.subtitle')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('admin.documents.filter')}
          </Button>
          
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            {t('admin.documents.addNew')}
          </Button>
        </div>
      </div>
      
      {isFilterMenuOpen && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('admin.documents.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.documents.language')}</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.documents.allLanguages')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.documents.allLanguages')}</SelectItem>
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
                <Label>{t('admin.documents.documentType')}</Label>
                <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.documents.allTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.documents.allTypes')}</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(`admin.documents.types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t('admin.documents.productCategory')}</Label>
                <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.documents.allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.documents.allCategories')}</SelectItem>
                    {productCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(`products.categories.${category}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setSelectedLanguage("");
              setSelectedDocumentType("");
              setSelectedProductCategory("");
            }}>
              {t('admin.documents.resetFilters')}
            </Button>
            <Button onClick={() => setIsFilterMenuOpen(false)}>
              {t('admin.documents.applyFilters')}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder={t('admin.documents.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('admin.documents.all')}</TabsTrigger>
          <TabsTrigger value="catalogs">{t('admin.documents.types.catalog')}</TabsTrigger>
          <TabsTrigger value="datasheets">{t('admin.documents.types.datasheet')}</TabsTrigger>
          <TabsTrigger value="certificates">{t('admin.documents.types.certificate')}</TabsTrigger>
          <TabsTrigger value="manuals">{t('admin.documents.types.manual')}</TabsTrigger>
          <TabsTrigger value="others">{t('admin.documents.others')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedDocuments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('admin.documents.noDocuments')}</p>
            </div>
          ) : isMobile ? (
            <CardTable 
              data={sortedDocuments}
              columns={columns}
              loading={isLoading}
              emptyState={<p>{t('admin.documents.noDocuments')}</p>}
              onRowClick={(document) => editDocument(document as Document)}
            />
          ) : (
            <ResponsiveTable 
              columns={columns} 
              data={sortedDocuments}
              onRowClick={(document) => editDocument(document as Document)}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Document Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className={isMobile ? "max-w-full mx-1 h-[90%] overflow-auto" : "max-w-2xl"}>
          <DialogHeader>
            <DialogTitle>{t('admin.documents.addNew')}</DialogTitle>
          </DialogHeader>
          
          {isMobile ? (
            <MobileFormLayout>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('admin.documents.title')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('admin.documents.titlePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('admin.documents.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t('admin.documents.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentType">{t('admin.documents.type')}</Label>
                  <Select 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData({...formData, documentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {t(`admin.documents.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">{t('admin.documents.language')}</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData({...formData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="productCategories">{t('admin.documents.productCategories')}</Label>
                  <Select 
                    value={formData.productCategories[0] || ""}
                    onValueChange={(value) => setFormData({...formData, productCategories: [value]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {t(`products.categories.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">{t('admin.documents.file')}</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({...formData, file});
                    }}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isPublic: checked as boolean})
                    }
                  />
                  <Label htmlFor="isPublic">{t('admin.documents.isPublic')}</Label>
                </div>
              </div>
            </MobileFormLayout>
          ) : (
            <div className="grid grid-cols-1 gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('admin.documents.title')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('admin.documents.titlePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentType">{t('admin.documents.type')}</Label>
                  <Select 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData({...formData, documentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {t(`admin.documents.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.documents.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('admin.documents.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('admin.documents.language')}</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData({...formData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="productCategories">{t('admin.documents.productCategories')}</Label>
                  <Select 
                    value={formData.productCategories[0] || ""}
                    onValueChange={(value) => setFormData({...formData, productCategories: [value]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {t(`products.categories.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">{t('admin.documents.file')}</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({...formData, file});
                  }}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, isPublic: checked as boolean})
                  }
                />
                <Label htmlFor="isPublic">{t('admin.documents.isPublic')}</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateDocument}
              disabled={createDocumentMutation.isPending || !formData.title || !formData.file}
            >
              {createDocumentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.creating')}
                </>
              ) : (
                t('common.create')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={isMobile ? "max-w-full mx-1 h-[90%] overflow-auto" : "max-w-2xl"}>
          <DialogHeader>
            <DialogTitle>{t('admin.documents.edit')}</DialogTitle>
          </DialogHeader>
          
          {isMobile ? (
            <MobileFormLayout>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">{t('admin.documents.title')}</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('admin.documents.titlePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">{t('admin.documents.description')}</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t('admin.documents.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-documentType">{t('admin.documents.type')}</Label>
                  <Select 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData({...formData, documentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {t(`admin.documents.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-language">{t('admin.documents.language')}</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData({...formData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="edit-productCategories">{t('admin.documents.productCategories')}</Label>
                  <Select 
                    value={formData.productCategories[0] || ""}
                    onValueChange={(value) => setFormData({...formData, productCategories: [value]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {t(`products.categories.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-file">{t('admin.documents.file')} ({t('admin.documents.optional')})</Label>
                  <Input
                    id="edit-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({...formData, file});
                    }}
                    className="cursor-pointer"
                  />
                  {selectedDocument && (
                    <p className="text-sm text-muted-foreground">
                      {t('admin.documents.currentFile')}: {selectedDocument.filePath.split('/').pop()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, isPublic: checked as boolean})
                    }
                  />
                  <Label htmlFor="edit-isPublic">{t('admin.documents.isPublic')}</Label>
                </div>
              </div>
            </MobileFormLayout>
          ) : (
            <div className="grid grid-cols-1 gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">{t('admin.documents.title')}</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder={t('admin.documents.titlePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-documentType">{t('admin.documents.type')}</Label>
                  <Select 
                    value={formData.documentType} 
                    onValueChange={(value) => setFormData({...formData, documentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {t(`admin.documents.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t('admin.documents.description')}</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('admin.documents.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-language">{t('admin.documents.language')}</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData({...formData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="edit-productCategories">{t('admin.documents.productCategories')}</Label>
                  <Select 
                    value={formData.productCategories[0] || ""}
                    onValueChange={(value) => setFormData({...formData, productCategories: [value]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.documents.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {t(`products.categories.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-file">{t('admin.documents.file')} ({t('admin.documents.optional')})</Label>
                <Input
                  id="edit-file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({...formData, file});
                  }}
                  className="cursor-pointer"
                />
                {selectedDocument && (
                  <p className="text-sm text-muted-foreground">
                    {t('admin.documents.currentFile')}: {selectedDocument.filePath.split('/').pop()}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, isPublic: checked as boolean})
                  }
                />
                <Label htmlFor="edit-isPublic">{t('admin.documents.isPublic')}</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedDocument(null);
                resetForm();
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleUpdateDocument}
              disabled={updateDocumentMutation.isPending || !formData.title}
            >
              {updateDocumentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManager;