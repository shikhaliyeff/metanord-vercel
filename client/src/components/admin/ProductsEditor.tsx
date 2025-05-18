import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileRejection, useDropzone } from "react-dropzone";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentSelector } from "@/components/admin/DocumentSelector";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Loader2, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  Image, 
  Eye, 
  Upload, 
  Globe, 
  Search,
  Filter,
  RotateCcw,
  Languages,
  Pencil,
  MoreHorizontal,
  Tag,
  Download,
  FileText,
  AlertCircle,
  FolderUp,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Languages supported by the site
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "ru", name: "Russian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "pl", name: "Polish" },
];

// Product categories
const CATEGORIES = [
  { id: "aluminum", name: "Aluminum" },
  { id: "polyethylene", name: "Polyethylene" },
  { id: "steel", name: "Steel" },
  { id: "cast_iron", name: "Cast Iron" },
  { id: "facade_systems", name: "Facade Systems" },
  { id: "components", name: "Components" },
  { id: "lighting", name: "Lighting" },
];

// Product status options
const PRODUCT_STATUS = [
  { value: "in stock", label: "In Stock" },
  { value: "on request", label: "On Request" },
  { value: "limited", label: "Limited Stock" },
  { value: "discontinued", label: "Discontinued" },
];

// Validation schema for multilingual product
const multilingualProductSchema = z.object({
  productId: z.string().min(3, "Product ID must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Product ID must contain only lowercase letters, numbers, and hyphens"),
  
  // Multilingual fields
  titles: z.record(z.string().min(2, "Title is required")),
  descriptions: z.record(z.string().min(10, "Description must be at least 10 characters")),
  
  // Common fields
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  image: z.any().optional(),
  imageUrl: z.string().optional(),
  
  // Structured data
  features: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  
  // Associated documents
  documentIds: z.array(z.number()).optional(),
});

type MultilingualProductForm = z.infer<typeof multilingualProductSchema>;

// Interface for product data from API
interface Product {
  id: number;
  productId: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status: string;
  features: string[];
  applications: string[];
  specifications?: Record<string, string>;
  language: string;
}

// Interface for document data
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
  createdAt: Date | null;
  updatedAt: Date | null;
}

// For search and filtering
interface ProductFilters {
  searchTerm: string;
  category: string;
  status: string;
}

// Component for handling specifications as key-value pairs
function SpecificationsEditor({ 
  value = {}, 
  onChange 
}: { 
  value: Record<string, string>; 
  onChange: (value: Record<string, string>) => void;
}) {
  const [key, setKey] = useState("");
  const [val, setVal] = useState("");

  const handleAdd = () => {
    if (key && val) {
      onChange({ ...value, [key]: val });
      setKey("");
      setVal("");
    }
  };

  const handleRemove = (keyToRemove: string) => {
    const newSpecs = { ...value };
    delete newSpecs[keyToRemove];
    onChange(newSpecs);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Property</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(value).length > 0 ? (
              Object.entries(value).map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell className="font-medium">{k}</TableCell>
                  <TableCell>{v}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemove(k)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-3 text-muted-foreground">
                  No specifications added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Property (e.g., Material)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Value (e.g., Aluminum 6063-T5)"
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!key || !val}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ProductsEditor() {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [editLanguage, setEditLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const { toast } = useToast();
  
  // Fetch all available documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const res = await fetch(`/api/documents?language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      return data || [];
    },
    enabled: isAddProductOpen, // Only fetch when the dialog is open
  });
  
  // Fetch documents for a specific product when editing
  const { data: productDocuments, isLoading: isLoadingProductDocs } = useQuery({
    queryKey: ["/api/products", editingProductId, "documents"],
    queryFn: async () => {
      if (!editingProductId) return [];
      const res = await fetch(`/api/products/${editingProductId}/documents`);
      if (!res.ok) throw new Error("Failed to fetch product documents");
      return res.json();
    },
    enabled: !!editingProductId && isAddProductOpen
  });
  
  // Function to open product preview in a new tab
  const openProductPreview = (productId: string) => {
    window.open(`/products/${productId}`, '_blank');
  };
  
  // Import/Export state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    importing: boolean;
    success?: boolean;
    message?: string;
    stats?: {
      added: number;
      updated: number;
      skipped: number;
      total: number;
    };
  }>({ importing: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Search and filtering
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    category: "",
    status: "",
  });
  
  // Product form - Initialize form before any useEffects that use it
  const form = useForm<MultilingualProductForm>({
    resolver: zodResolver(multilingualProductSchema),
    defaultValues: {
      productId: "",
      titles: { en: "" },
      descriptions: { en: "" },
      category: CATEGORIES[0].id,
      status: "in stock",
      features: [],
      applications: [],
      specifications: {},
      documentIds: []
    }
  });
  
  // Update selected documents when product documents change
  useEffect(() => {
    if (productDocuments && productDocuments.length > 0) {
      const docIds = productDocuments.map((doc: Document) => doc.id);
      setSelectedDocuments(docIds);
      form.setValue("documentIds", docIds);
    } else if (productDocuments) {
      setSelectedDocuments([]);
      form.setValue("documentIds", []);
    }
  }, [productDocuments, form]);
  
  // Dynamic fields state for features and applications
  const [featureInput, setFeatureInput] = useState("");
  const [applicationInput, setApplicationInput] = useState("");
  
  // For temporary storage of multilingual values
  const [productInAllLanguages, setProductInAllLanguages] = useState<Record<string, Product[]>>({});

  // For product image dropzone
  const { 
    getRootProps: getImageRootProps, 
    getInputProps: getImageInputProps, 
    isDragActive: isImageDragActive 
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        form.setValue("image", file);
        
        // Create a preview URL
        const objectUrl = URL.createObjectURL(file);
        form.setValue("imageUrl", objectUrl);
      }
    },
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    multiple: false
  });
  
  // For JSON import dropzone
  const { 
    getRootProps: getImportRootProps, 
    getInputProps: getImportInputProps, 
    isDragActive: isImportDragActive 
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
          toast({
            title: "Invalid file format",
            description: "Please upload a JSON file.",
            variant: "destructive",
          });
          return;
        }
        
        setImportStatus({ importing: true });
        
        try {
          const formData = new FormData();
          formData.append("jsonFile", file);
          
          const response = await fetch("/api/admin/import", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          
          if (response.ok) {
            const result = await response.json();
            setImportStatus({ 
              importing: false, 
              success: true,
              message: "Products imported successfully!",
              stats: {
                total: result.stats?.total || 0,
                added: result.stats?.added || 0,
                updated: result.stats?.updated || 0,
                skipped: result.stats?.skipped || 0
              }
            });
            
            // Refresh product list
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
          } else {
            const error = await response.json();
            setImportStatus({ 
              importing: false, 
              success: false,
              message: error.message || "Failed to import products"
            });
          }
        } catch (error) {
          setImportStatus({ 
            importing: false, 
            success: false,
            message: "An error occurred during import"
          });
        }
      }
    },
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    multiple: false
  });

  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products", activeTab, activeLanguage],
    queryFn: async () => {
      const categoryParam = activeTab !== "all" ? `category=${activeTab}&` : "";
      const res = await fetch(`/api/products?${categoryParam}language=${activeLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }
  });
  
  // Reset form when closing dialog
  useEffect(() => {
    if (!isAddProductOpen) {
      form.reset({
        productId: "",
        titles: { en: "" },
        descriptions: { en: "" },
        category: CATEGORIES[0].id,
        status: "in stock",
        features: [],
        applications: [],
        specifications: {},
        documentIds: []
      });
      setEditingProductId(null);
      setFeatureInput("");
      setApplicationInput("");
      setProductInAllLanguages({});
      setSelectedDocuments([]);
    }
  }, [isAddProductOpen, form]);
  
  // When editing product, fetch all language versions
  useEffect(() => {
    if (editingProductId) {
      const fetchAllLanguageVersions = async () => {
        const languageVersions: Record<string, Product[]> = {};
        
        // Fetch product in all languages
        for (const lang of LANGUAGES) {
          try {
            const res = await fetch(`/api/products/${editingProductId}?language=${lang.code}`);
            if (res.ok) {
              const product = await res.json();
              if (product) {
                languageVersions[lang.code] = [product];
                
                // Update form with data from current edit language
                if (lang.code === editLanguage) {
                  form.setValue("titles", { 
                    ...form.getValues("titles"), 
                    [lang.code]: product.title 
                  });
                  form.setValue("descriptions", { 
                    ...form.getValues("descriptions"), 
                    [lang.code]: product.description 
                  });
                  form.setValue("category", product.category);
                  form.setValue("status", product.status || "in stock");
                  form.setValue("features", product.features || []);
                  form.setValue("applications", product.applications || []);
                  form.setValue("specifications", product.specifications || {});
                  form.setValue("imageUrl", product.image);
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching ${lang.code} version:`, error);
          }
        }
        
        setProductInAllLanguages(languageVersions);
      };
      
      fetchAllLanguageVersions();
    }
  }, [editingProductId, editLanguage, form]);

  // Filtered products
  const filteredProducts = products ? products.filter((product: Product) => {
    let matches = true;
    
    // Text search
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      matches = matches && (
        product.title.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search) ||
        product.productId.toLowerCase().includes(search)
      );
    }
    
    // Category filter
    if (filters.category && product.category !== filters.category) {
      matches = false;
    }
    
    // Status filter
    if (filters.status && product.status !== filters.status) {
      matches = false;
    }
    
    return matches;
  }) : [];

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: { formData: FormData, language: string }) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: data.formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: { productId: string; formData: FormData; language: string }) => {
      const res = await fetch(`/api/admin/products/${data.productId}`, {
        method: "PUT",
        body: data.formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/products/${productId}`);
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      form.setValue("image", file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      form.setValue("imageUrl", objectUrl);
    }
  };

  // Handle form submission
  const onSubmit = async (data: MultilingualProductForm) => {
    // Save the product in each language version
    for (const language of LANGUAGES) {
      // Only save languages that have data
      if (!data.titles[language.code] && !data.descriptions[language.code]) {
        continue;
      }
      
      // Create FormData for this language
      const formData = new FormData();
      formData.append("productId", data.productId);
      formData.append("title", data.titles[language.code] || data.titles.en || "");
      formData.append("description", data.descriptions[language.code] || data.descriptions.en || "");
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("language", language.code);
      
      // Feature and applications arrays
      if (data.features && data.features.length > 0) {
        formData.append("features", JSON.stringify(data.features));
      }
      
      if (data.applications && data.applications.length > 0) {
        formData.append("applications", JSON.stringify(data.applications));
      }
      
      // Specifications object
      if (data.specifications && Object.keys(data.specifications).length > 0) {
        formData.append("specifications", JSON.stringify(data.specifications));
      }
      
      // Associated documents (only include in the "en" language to avoid duplication)
      if (language.code === "en" && data.documentIds && data.documentIds.length > 0) {
        formData.append("documentIds", JSON.stringify(data.documentIds));
      }
      
      // Image (only include it on the first language to avoid uploading multiple times)
      if (language.code === "en" && data.image instanceof File) {
        formData.append("image", data.image);
      } else if (data.imageUrl) {
        // Use existing image URL
        formData.append("image", data.imageUrl);
      }
      
      try {
        if (editingProductId) {
          // Update existing product
          await updateProductMutation.mutateAsync({
            productId: data.productId,
            formData,
            language: language.code
          });
        } else {
          // Create new product
          await createProductMutation.mutateAsync({
            formData,
            language: language.code
          });
        }
      } catch (error) {
        console.error(`Error saving in ${language.code}:`, error);
        // Continue with other languages even if one fails
      }
    }
    
    // Close dialog after all languages are processed
    setIsAddProductOpen(false);
  };

  // Handle edit
  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setEditLanguage("en"); // Start with English as the editing language
    setIsAddProductOpen(true);
    
    // Form will be populated via the useEffect hook
    form.setValue("productId", productId);
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product? This will remove the product in all languages.")) {
      await deleteProductMutation.mutateAsync(productId);
    }
  };

  // Reset search filters
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      category: "",
      status: "",
    });
  };
  
  // Handle export of products to JSON file
  const handleExportProducts = async () => {
    try {
      // Fetch all products in all languages
      const allProducts: Record<string, Product[]> = {};
      
      for (const lang of LANGUAGES) {
        const res = await fetch(`/api/products?language=${lang.code}`);
        if (res.ok) {
          const products = await res.json();
          allProducts[lang.code] = products;
        }
      }
      
      // Convert to downloadable format - organized by product ID with all languages
      const exportData: Record<string, any> = {};
      
      // Group products by productId
      Object.entries(allProducts).forEach(([langCode, langProducts]) => {
        langProducts.forEach(product => {
          if (!exportData[product.productId]) {
            exportData[product.productId] = {
              productId: product.productId,
              category: product.category,
              status: product.status,
              image: product.image,
              features: product.features,
              applications: product.applications,
              specifications: product.specifications,
              translations: {}
            };
          }
          
          // Add language-specific data
          exportData[product.productId].translations[langCode] = {
            title: product.title,
            description: product.description
          };
        });
      });
      
      // Create a blob and download link
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = `metanord-products-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Export successful",
        description: `${Object.keys(exportData).length} products exported to JSON file.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the products.",
        variant: "destructive",
      });
    }
  };
  
  // Handle import of products from JSON file
  const handleImportProducts = async (fileContent: string) => {
    try {
      setImportStatus({ importing: true });
      
      // Parse the JSON file
      const data = JSON.parse(fileContent);
      
      // Validate the structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid JSON format");
      }
      
      // Track statistics
      const stats = {
        added: 0,
        updated: 0,
        skipped: 0,
        total: 0
      };
      
      // Process each product
      for (const [productId, productData] of Object.entries(data)) {
        const product = productData as any;
        stats.total++;
        
        if (!product.translations || !product.productId) {
          stats.skipped++;
          continue;
        }
        
        // For each language in the product translations
        for (const [langCode, langData] of Object.entries(product.translations)) {
          const translation = langData as any;
          
          // Skip if missing required data
          if (!translation.title || !translation.description) {
            stats.skipped++;
            continue;
          }
          
          const formData = new FormData();
          formData.append("productId", product.productId);
          formData.append("title", translation.title);
          formData.append("description", translation.description);
          formData.append("category", product.category || "aluminum");
          formData.append("status", product.status || "in stock");
          formData.append("language", langCode);
          
          // Add features if available
          if (product.features && Array.isArray(product.features)) {
            formData.append("features", JSON.stringify(product.features));
          }
          
          // Add applications if available
          if (product.applications && Array.isArray(product.applications)) {
            formData.append("applications", JSON.stringify(product.applications));
          }
          
          // Add specifications if available
          if (product.specifications && typeof product.specifications === 'object') {
            formData.append("specifications", JSON.stringify(product.specifications));
          }
          
          // Add image if available
          if (product.image) {
            formData.append("image", product.image);
          }
          
          try {
            // Check if product exists
            const checkRes = await fetch(`/api/products/${product.productId}?language=${langCode}`);
            
            if (checkRes.ok) {
              // Update existing product
              const updateRes = await fetch(`/api/admin/products/${product.productId}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
              });
              
              if (updateRes.ok) {
                stats.updated++;
              } else {
                stats.skipped++;
              }
            } else {
              // Create new product
              const createRes = await fetch("/api/admin/products", {
                method: "POST",
                body: formData,
                credentials: "include",
              });
              
              if (createRes.ok) {
                stats.added++;
              } else {
                stats.skipped++;
              }
            }
          } catch (err) {
            console.error(`Error processing product ${product.productId}:`, err);
            stats.skipped++;
          }
        }
      }
      
      // Refresh product data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      setImportStatus({
        importing: false,
        success: true,
        message: "Import completed successfully",
        stats
      });
      
      toast({
        title: "Import successful",
        description: `Added: ${stats.added}, Updated: ${stats.updated}, Skipped: ${stats.skipped}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Import error:", error);
      setImportStatus({
        importing: false,
        success: false,
        message: `Import failed: ${(error as Error).message}`
      });
      
      toast({
        title: "Import failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  
  // This functionality is now implemented in the JSON import dropzone hook at the top of the component

  // Loading state
  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>Add, edit, or remove products in multiple languages</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                />
              </div>
              
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Tools</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleExportProducts}>
                    <Upload className="h-4 w-4 mr-2" />
                    Export Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsImportDialogOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Import Products
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProductId ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                      {editingProductId
                        ? "Update the product information in multiple languages"
                        : "Fill out the form to add a new product"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                      {/* Product ID and Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product ID</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="unique-product-id"
                                    disabled={!!editingProductId}
                                  />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                  Unique identifier, use kebab-case (e.g., aluminum-profiles)
                                </p>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
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
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {CATEGORIES.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
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
                                    {PRODUCT_STATUS.map(status => (
                                      <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Language Selection for Editing */}
                      <div className="bg-slate-50 p-4 rounded-md border">
                        <div className="flex items-center gap-2 mb-4">
                          <Languages className="h-4 w-4 text-slate-400" />
                          <h4 className="text-sm font-medium">Edit in Language:</h4>
                          
                          <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(lang => (
                              <Badge
                                key={lang.code}
                                variant={editLanguage === lang.code ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setEditLanguage(lang.code)}
                              >
                                {lang.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Title and Description for Current Language */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`titles.${editLanguage}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title ({LANGUAGES.find(l => l.code === editLanguage)?.name})</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Product name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`descriptions.${editLanguage}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description ({LANGUAGES.find(l => l.code === editLanguage)?.name})</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Detailed product description"
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Product Image - Enhanced with Drag & Drop */}
                      <div>
                        <Label>Product Image</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div 
                            {...getImageRootProps()} 
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                              isImageDragActive 
                                ? 'border-primary bg-primary/5' 
                                : 'border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <input {...getImageInputProps()} />
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-500">Drop image here or click to browse</span>
                            <span className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, SVG supported</span>
                          </div>
                          
                          {form.watch("imageUrl") && (
                            <div className="relative h-32 border rounded-md overflow-hidden group">
                              <img 
                                src={form.watch("imageUrl")} 
                                alt="Product preview" 
                                className="w-full h-full object-contain" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-white hover:text-white hover:bg-red-500/50"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    form.setValue("image", null);
                                    form.setValue("imageUrl", "");
                                  }}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Features and Applications */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Features</Label>
                          <div className="border rounded-md p-4 mt-2 max-h-80 overflow-y-auto space-y-2">
                            {(form.watch("features") || []).map((feature: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="flex-1 p-2 bg-slate-50 rounded text-sm">
                                  {feature}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const features = form.watch("features") || [];
                                    form.setValue("features", features.filter((_, i) => i !== index));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            {(!(form.watch("features")) || (form.watch("features") as string[]).length === 0) && (
                              <p className="text-sm text-muted-foreground">No features added yet</p>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Input
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                placeholder="Add a feature"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  if (featureInput) {
                                    const features = form.watch("features") || [];
                                    form.setValue("features", [...features, featureInput]);
                                    setFeatureInput("");
                                  }
                                }}
                                disabled={!featureInput}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Applications</Label>
                          <div className="border rounded-md p-4 mt-2 max-h-80 overflow-y-auto space-y-2">
                            {(form.watch("applications") || []).map((application: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="flex-1 p-2 bg-slate-50 rounded text-sm">
                                  {application}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const applications = form.watch("applications") || [];
                                    form.setValue("applications", applications.filter((_, i) => i !== index));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            {(!(form.watch("applications")) || (form.watch("applications") as string[]).length === 0) && (
                              <p className="text-sm text-muted-foreground">No applications added yet</p>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Input
                                value={applicationInput}
                                onChange={(e) => setApplicationInput(e.target.value)}
                                placeholder="Add an application"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  if (applicationInput) {
                                    const applications = form.watch("applications") || [];
                                    form.setValue("applications", [...applications, applicationInput]);
                                    setApplicationInput("");
                                  }
                                }}
                                disabled={!applicationInput}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Specifications */}
                      <div>
                        <Label>Technical Specifications</Label>
                        <div className="mt-2">
                          <FormField
                            control={form.control}
                            name="specifications"
                            render={({ field }) => (
                              <SpecificationsEditor
                                value={field.value || {}}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Associated Documents */}
                      <div>
                        <Label>Associated Documents</Label>
                        <div className="mt-2">
                          <FormField
                            control={form.control}
                            name="documentIds"
                            render={({ field }) => (
                              <FormItem>
                                <FormDescription>
                                  Select documents that are related to this product. These will appear as downloadable files on the product page.
                                </FormDescription>
                                <FormControl>
                                  <DocumentSelector
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    disabled={isLoadingDocuments || isLoadingProductDocs}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter className="pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddProductOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createProductMutation.isPending || updateProductMutation.isPending}
                          className="gap-2"
                        >
                          {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {editingProductId ? "Update Product" : "Save Product"}
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
          {/* Category and Filter Tabs */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${CATEGORIES.length + 1}, minmax(0, 1fr))` }}>
                <TabsTrigger value="all">All</TabsTrigger>
                {CATEGORIES.map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Filter controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.searchTerm}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, searchTerm: ""})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                Category: {CATEGORIES.find(c => c.id === filters.category)?.name}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, category: ""})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, status: ""})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(filters.searchTerm || filters.category || filters.status) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs" 
                onClick={resetFilters}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset filters
              </Button>
            )}
          </div>
          
          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                {filteredProducts.length === 0
                  ? "No products found. Add your first product using the button above."
                  : `Showing ${filteredProducts.length} products in ${LANGUAGES.find(l => l.code === activeLanguage)?.name || 'selected'} language.`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-14 w-14 rounded-md border overflow-hidden">
                          {product.image ? (
                            <img 
                              src={
                                product.image.startsWith('/attached_assets/') 
                                  ? product.image.replace('/attached_assets/', '/@fs/home/runner/workspace/attached_assets/') 
                                  : product.image.startsWith('/') 
                                    ? product.image 
                                    : `/${product.image}`
                              } 
                              alt={product.title} 
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-slate-100">
                              <Image className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={
                          product.status === "in stock" ? "default" :
                          product.status === "on request" ? "secondary" :
                          product.status === "limited" ? "outline" :
                          "destructive"
                        }>
                          {product.status || "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <div className="truncate">{product.description}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => setViewProduct(product.productId)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEdit(product.productId)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(product.productId)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                      No products found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Upload a JSON file containing product data. The file should contain product information in all supported languages.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div
              {...getImportRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isImportDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getImportInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                {isImportDragActive ? (
                  <>
                    <FolderUp className="h-10 w-10 text-primary/80" />
                    <p className="text-sm font-medium">Drop the file here</p>
                  </>
                ) : (
                  <>
                    <FileText className="h-10 w-10 text-muted-foreground/80" />
                    <p className="text-sm font-medium">Drag & drop a JSON file here, or click to select</p>
                    <p className="text-xs text-muted-foreground">The file should be in the export format from this system</p>
                  </>
                )}
              </div>
            </div>
            
            {importStatus.importing && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <p className="text-sm">Importing products, please wait...</p>
                </div>
              </div>
            )}
            
            {importStatus.success !== undefined && !importStatus.importing && (
              <div className={`mt-4 p-4 rounded-lg ${importStatus.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {importStatus.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${importStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                      {importStatus.message}
                    </p>
                    {importStatus.stats && (
                      <div className="text-xs mt-1 space-y-1">
                        <p className="text-muted-foreground">Total products: {importStatus.stats.total}</p>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-green-600">Added: {importStatus.stats.added}</span>
                          <span className="text-blue-600">Updated: {importStatus.stats.updated}</span>
                          <span className="text-amber-600">Skipped: {importStatus.stats.skipped}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportStatus({ importing: false });
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Sheet */}
      {viewProduct && (
        <Sheet open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Product Details</SheetTitle>
              <SheetDescription>
                Viewing product in {LANGUAGES.find(l => l.code === activeLanguage)?.name || 'selected'} language
              </SheetDescription>
            </SheetHeader>
            
            {products && products.find((p: Product) => p.productId === viewProduct) && (
              (() => {
                const product = products.find((p: Product) => p.productId === viewProduct);
                return (
                  <div className="mt-6 space-y-6">
                    {product.image && (
                      <div className="relative h-60 mx-auto border rounded-md overflow-hidden">
                        <img 
                          src={
                            product.image.startsWith('/attached_assets/') 
                              ? product.image.replace('/attached_assets/', '/@fs/home/runner/workspace/attached_assets/') 
                              : product.image.startsWith('/') 
                                ? product.image 
                                : `/${product.image}`
                          } 
                          alt={product.title} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">{product.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">ID: {product.productId}</Badge>
                          <Badge>
                            {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                          </Badge>
                          <Badge variant={
                            product.status === "in stock" ? "default" :
                            product.status === "on request" ? "secondary" :
                            product.status === "limited" ? "outline" :
                            "destructive"
                          }>
                            {product.status || "In Stock"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Description</h4>
                        <p className="text-sm text-slate-600">{product.description}</p>
                      </div>
                      
                      {product.features && product.features.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Features</h4>
                          <ul className="space-y-1">
                            {product.features.map((feature: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {product.applications && product.applications.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Applications</h4>
                          <ul className="space-y-1">
                            {product.applications.map((app: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Tag className="h-4 w-4 text-indigo-500 mt-0.5" />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Technical Specifications</h4>
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableBody>
                                {product.specifications && Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium py-2">{key}</TableCell>
                                    <TableCell className="py-2">{String(value)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => openProductPreview(product.productId)}
                        className="mr-2"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Live
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleEdit(product.productId)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <SheetClose asChild>
                        <Button variant="ghost">Close</Button>
                      </SheetClose>
                    </div>
                  </div>
                );
              })()
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}