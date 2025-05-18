import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  File, 
  Upload, 
  FileText, 
  Trash, 
  Plus, 
  Download, 
  Pencil, 
  Search, 
  MoreVertical, 
  FileUp,
  CheckCircle2,
  Clock,
  UserCircle,
  Eye,
  ExternalLink,
  AlertTriangle,
  FileCog,
  FileArchive,
  // FileTextIcon, // Using FileText instead
  Loader2
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Document types and validation
interface DocumentCategory {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  documentType: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Document {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  fileSize: number | null;
  fileType: string;
  documentType: string;
  documentCategoryId: number | null;
  productCategories: string[] | null;
  tags: string[];
  language: string;
  downloads: number;
  isPublic: boolean;
  createdBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  status?: "draft" | "published" | "archived";
  version?: string;
  expiresAt?: string;
}

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  documentType: z.string().min(1, "Document type is required"),
  documentCategoryId: z.number().optional().nullable(),
  language: z.string().default("en"),
  isPublic: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  productCategories: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).default([]),
  version: z.string().optional(),
  expiresAt: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  documentType: z.string().min(1, "Document type is required"),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
});

// Filter state type
type FilterState = {
  documentType: string;
  documentCategoryId: number | null;
  status: string;
  search: string;
  language: string;
};

export function DocumentsManager() {
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    documentType: "all",
    documentCategoryId: null,
    status: "all",
    search: "",
    language: "all",
  });
  const [activeTab, setActiveTab] = useState<string>("documents");

  // Document form
  const documentForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      description: "",
      documentType: "",
      documentCategoryId: null,
      language: "en",
      isPublic: false,
      status: "draft",
      productCategories: null,
      tags: [],
      version: "",
    },
  });

  // Category form
  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      documentType: "general",
      icon: null,
      color: null,
      isDefault: false,
    },
  });

  // Reset document form when dialog opens/closes
  const resetDocumentForm = (document?: Document) => {
    if (document) {
      documentForm.reset({
        title: document.title,
        description: document.description || "",
        documentType: document.documentType,
        documentCategoryId: document.documentCategoryId,
        language: document.language,
        isPublic: document.isPublic,
        status: document.status || "draft",
        productCategories: document.productCategories,
        tags: document.tags,
        version: document.version || "",
      });
    } else {
      documentForm.reset({
        title: "",
        description: "",
        documentType: "",
        documentCategoryId: null,
        language: "en",
        isPublic: false,
        status: "draft",
        productCategories: null,
        tags: [],
        version: "",
      });
    }
  };

  // Fetch documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ['/api/admin/documents', filter],
    queryFn: async () => {
      try {
        const url = new URL('/api/admin/documents', window.location.origin);
        if (filter.documentType !== "all") url.searchParams.append('documentType', filter.documentType);
        if (filter.documentCategoryId !== null) url.searchParams.append('documentCategoryId', filter.documentCategoryId.toString());
        if (filter.status !== "all") url.searchParams.append('status', filter.status);
        if (filter.language !== "all") url.searchParams.append('language', filter.language);
        if (filter.search) url.searchParams.append('search', filter.search);
        
        const res = await apiRequest("GET", url.toString());
        return await res.json();
      } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
      }
    },
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<DocumentCategory[]>({
    queryKey: ['/api/admin/documents/categories'],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/documents/categories");
        return await res.json();
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/admin/documents", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      setIsUploadDialogOpen(false);
      setUploadedFile(null);
      resetDocumentForm();
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: `Error uploading document: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/documents/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      toast({
        title: "Document updated",
        description: "The document has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: `Error updating document: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/documents/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: `Error deleting document: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categorySchema>) => {
      const res = await apiRequest("POST", "/api/admin/documents/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents/categories'] });
      setIsCategoryDialogOpen(false);
      categoryForm.reset({
        name: "",
        description: "",
      });
      toast({
        title: "Category created",
        description: "The document category has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Create failed",
        description: `Error creating category: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/documents/categories/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents/categories'] });
      toast({
        title: "Category deleted",
        description: "The document category has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: `Error deleting category: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        
        // Auto-fill document title from filename
        const fileName = acceptedFiles[0].name;
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        
        documentForm.setValue("title", fileNameWithoutExt.replace(/[-_]/g, ' '));
      }
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
  });

  // Handle upload document
  const handleUploadDocument = (data: z.infer<typeof documentSchema>) => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('isPublic', data.isPublic.toString());
    formData.append('status', data.status);
    if (data.expiresAt) formData.append('expiresAt', data.expiresAt);
    if (data.tags.length) formData.append('tags', JSON.stringify(data.tags));
    formData.append('version', data.version);

    uploadDocumentMutation.mutate(formData);
  };

  // Handle edit document
  const handleEditDocument = (data: z.infer<typeof documentSchema>) => {
    if (!selectedDocument) return;

    updateDocumentMutation.mutate({
      id: selectedDocument.id,
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        status: data.status,
        expiresAt: data.expiresAt,
        tags: data.tags,
        version: data.version,
      },
    });
  };

  // Handle create category
  const handleCreateCategory = (data: z.infer<typeof categorySchema>) => {
    createCategoryMutation.mutate(data);
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return { icon: <Clock className="h-3 w-3 mr-1" />, variant: "outline" as const };
      case "published":
        return { icon: <CheckCircle2 className="h-3 w-3 mr-1" />, variant: "default" as const };
      case "archived":
        return { icon: <FileArchive className="h-3 w-3 mr-1" />, variant: "secondary" as const };
      default:
        return { icon: null, variant: "outline" as const };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get language name from language code
  const getLanguageName = (langCode: string): string => {
    const languages: Record<string, string> = {
      en: "English",
      et: "Estonian",
      ru: "Russian",
      lv: "Latvian",
      lt: "Lithuanian",
      pl: "Polish",
    };
    
    return languages[langCode] || langCode;
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FileText className="h-8 w-8 text-green-500" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FileText className="h-8 w-8 text-orange-500" />;
    if (fileType.includes('image')) return <FileText className="h-8 w-8 text-purple-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileText className="h-8 w-8 text-yellow-500" />;
    if (fileType.includes('text')) return <FileText className="h-8 w-8 text-gray-500" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  // Filter and sort documents
  const filteredDocuments = documents || [];

  // Loading state
  if (isLoadingDocuments && isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Upload, organize and manage documents</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsCategoryDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <FileCog className="h-4 w-4 mr-2" />
              New Category
            </Button>
            
            <Button
              onClick={() => {
                setIsUploadDialogOpen(true);
                setUploadedFile(null);
                resetDocumentForm();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="documents" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FileCog className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4 pt-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex items-center relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={filter.documentType}
                  onValueChange={(value) => setFilter({ ...filter, documentType: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="manual">Manuals</SelectItem>
                    <SelectItem value="specification">Specifications</SelectItem>
                    <SelectItem value="certificate">Certificates</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.documentCategoryId === null ? "all" : filter.documentCategoryId.toString()}
                  onValueChange={(value) => setFilter({ 
                    ...filter, 
                    documentCategoryId: value === "all" ? null : parseInt(value) 
                  })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.status}
                  onValueChange={(value) => setFilter({ ...filter, status: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.language}
                  onValueChange={(value) => setFilter({ ...filter, language: value })}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="et">Estonian</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="lv">Latvian</SelectItem>
                    <SelectItem value="lt">Lithuanian</SelectItem>
                    <SelectItem value="pl">Polish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Documents Table */}
            {filteredDocuments.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter.search || filter.documentType !== "all" || filter.documentCategoryId !== null || filter.status !== "all" || filter.language !== "all"
                      ? "No documents match your search criteria"
                      : "Upload a document to get started"}
                  </p>
                  
                  {filter.search || filter.documentType !== "all" || filter.documentCategoryId !== null || filter.status !== "all" || filter.language !== "all" ? (
                    <Button
                      variant="outline"
                      onClick={() => setFilter({
                        documentType: "all",
                        documentCategoryId: null,
                        status: "all",
                        language: "all",
                        search: ""
                      })}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsUploadDialogOpen(true);
                        setUploadedFile(null);
                        resetDocumentForm();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Downloads</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map(document => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-start gap-3">
                            {getFileTypeIcon(document.fileType)}
                            <div>
                              <div className="font-medium line-clamp-1">{document.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span className="truncate max-w-[150px]">{document.fileName}</span>
                                <span className="mx-1">•</span>
                                <span>{formatFileSize(document.fileSize)}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {categories?.find(c => c.id === document.documentCategoryId)?.name || "Uncategorized"}
                        </TableCell>
                        <TableCell className="capitalize">
                          {document.documentType || "General"}
                        </TableCell>
                        <TableCell>
                          {getLanguageName(document.language)}
                        </TableCell>
                        <TableCell>{document.version ? `v${document.version}` : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Badge variant={getStatusBadge(document.status).variant}>
                              <div className="flex items-center">
                                {getStatusBadge(document.status).icon}
                                <span className="capitalize">{document.status}</span>
                              </div>
                            </Badge>
                            
                            {document.isPublic && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="ml-2">
                                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Publicly accessible</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {document.expiresAt && new Date(document.expiresAt) > new Date() && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="ml-2">
                                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Expires on {new Date(document.expiresAt).toLocaleDateString()}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {document.downloadCount}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(document.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => window.open(document.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={document.url} download>
                                  <Download className="h-4 w-4 mr-2" />
                                  <span>Download</span>
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDocument(document);
                                  setIsEditDialogOpen(true);
                                  resetDocumentForm(document);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
                                    deleteDocumentMutation.mutate(document.id);
                                  }
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4 pt-4">
            {categories?.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileCog className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No categories found</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a category to organize your documents
                  </p>
                  <Button
                    onClick={() => setIsCategoryDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories?.map(category => (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
                                  deleteCategoryMutation.mutate(category.id);
                                }
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {category.description && (
                        <CardDescription className="mt-1.5">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">
                        {documents?.filter(d => d.category === category.id).length || 0} documents
                      </div>
                    </CardContent>
                    <div className="bg-muted px-4 py-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setActiveTab("documents");
                          setFilter({
                            ...filter,
                            category: category.id
                          });
                        }}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View Documents
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {/* Add New Category Card */}
                <Card className="overflow-hidden border-dashed">
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className="h-full w-full flex flex-col items-center justify-center py-8"
                      onClick={() => setIsCategoryDialogOpen(true)}
                    >
                      <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Add New Category</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Upload Document Dialog */}
      <Dialog 
        open={isUploadDialogOpen} 
        onOpenChange={(open) => {
          setIsUploadDialogOpen(open);
          if (!open) {
            setUploadedFile(null);
            resetDocumentForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Upload a document and fill in the details below.
            </DialogDescription>
          </DialogHeader>
          
          {/* File Upload Dropzone */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            {uploadedFile ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-muted/50 p-3 rounded-full">
                  {getFileTypeIcon(uploadedFile.type)}
                </div>
                <div className="font-medium">{uploadedFile.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-lg font-medium">
                  {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse your device
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF, Word, Excel, PowerPoint, and other files up to 50MB
                </p>
              </div>
            )}
          </div>
          
          {/* Document Details Form */}
          <Form {...documentForm}>
            <form onSubmit={documentForm.handleSubmit(handleUploadDocument)} className="space-y-4">
              <FormField
                control={documentForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter document title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={documentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter document description" 
                        className="resize-none h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={documentForm.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="specification">Specification</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="documentCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                        value={field.value === null ? "none" : field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories?.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={documentForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="et">Estonian</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="lv">Latvian</SelectItem>
                          <SelectItem value="lt">Lithuanian</SelectItem>
                          <SelectItem value="pl">Polish</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <FormField
                  control={documentForm.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 1.0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        When this document should expire
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={documentForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make publicly accessible</FormLabel>
                      <FormDescription>
                        If checked, this document will be accessible without login
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!uploadedFile || uploadDocumentMutation.isPending}
                >
                  {uploadDocumentMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Document Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedDocument(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the document details below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <Form {...documentForm}>
              <form onSubmit={documentForm.handleSubmit(handleEditDocument)} className="space-y-4">
                {/* Same form fields as upload dialog except for the dropzone */}
                <FormField
                  control={documentForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter document title" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={documentForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter document description" 
                          className="resize-none h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={documentForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={documentForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={documentForm.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 1.0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={documentForm.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          When this document should expire
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={documentForm.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make publicly accessible</FormLabel>
                        <FormDescription>
                          If checked, this document will be accessible without login
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateDocumentMutation.isPending}
                  >
                    {updateDocumentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileUp className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Category Dialog */}
      <Dialog 
        open={isCategoryDialogOpen} 
        onOpenChange={(open) => {
          setIsCategoryDialogOpen(open);
          if (!open) {
            categoryForm.reset({
              name: "",
              description: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your documents.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleCreateCategory)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter category name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter category description" 
                        className="resize-none h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default DocumentsManager;