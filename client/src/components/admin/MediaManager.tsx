import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Image, 
  File, 
  Upload, 
  Trash, 
  Copy, 
  MoreVertical, 
  Pencil, 
  Folder, 
  Download, 
  FolderOpen,
  LayoutGrid,
  List,
  Search,
  ImageOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { DropzoneOptions, useDropzone } from "react-dropzone";

// Define interface for media items
interface MediaItem {
  id: string;
  name: string;
  fileName: string;
  path: string;
  url: string;
  type: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  folder: string;
  createdAt: string;
  updatedAt: string;
  alt?: string;
  caption?: string;
}

interface Folder {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  itemCount: number;
}

// Filter items by type
type FilterType = "all" | "images" | "documents" | "others";

// View mode
type ViewMode = "grid" | "list";

export function MediaManager() {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState("/");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameItemId, setRenameItemId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch media items
  const { data: mediaItems, isLoading: isLoadingMedia } = useQuery<MediaItem[]>({
    queryKey: ['/api/admin/media', currentFolder, filterType, searchQuery],
    queryFn: async () => {
      try {
        const url = new URL('/api/admin/media', window.location.origin);
        url.searchParams.append('folder', currentFolder);
        if (filterType !== "all") url.searchParams.append('type', filterType);
        if (searchQuery) url.searchParams.append('search', searchQuery);
        
        const res = await apiRequest("GET", url.toString());
        return await res.json();
      } catch (error) {
        console.error("Error fetching media:", error);
        return [];
      }
    },
  });

  // Fetch folders
  const { data: folders, isLoading: isLoadingFolders } = useQuery<Folder[]>({
    queryKey: ['/api/admin/media/folders', currentFolder],
    queryFn: async () => {
      try {
        const url = new URL('/api/admin/media/folders', window.location.origin);
        url.searchParams.append('parent', currentFolder);
        
        const res = await apiRequest("GET", url.toString());
        return await res.json();
      } catch (error) {
        console.error("Error fetching folders:", error);
        return [];
      }
    },
  });

  // Upload media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest("POST", "/api/admin/media", formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      toast({
        title: "Files uploaded",
        description: "Your files have been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: `Error uploading files: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiRequest("DELETE", "/api/admin/media", { ids });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      setSelectedItems([]);
      toast({
        title: "Items deleted",
        description: "The selected items have been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: `Error deleting items: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Rename media mutation
  const renameMediaMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/media/${id}`, { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      setIsRenameDialogOpen(false);
      setRenameItemId(null);
      setNewName("");
      toast({
        title: "Item renamed",
        description: "The item has been successfully renamed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Rename failed",
        description: `Error renaming item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const res = await apiRequest("POST", "/api/admin/media/folders", { 
        name: folderName,
        parent: currentFolder
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media/folders'] });
      setIsCreateFolderDialogOpen(false);
      setNewFolderName("");
      toast({
        title: "Folder created",
        description: "New folder has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Create folder failed",
        description: `Error creating folder: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/media/folders/${folderId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media/folders'] });
      toast({
        title: "Folder deleted",
        description: "The folder has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete folder failed",
        description: `Error deleting folder: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle file upload via dropzone
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', currentFolder);

    uploadMediaMutation.mutate(formData);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
    },
    maxSize: 10485760, // 10MB
  } as DropzoneOptions);

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Handle delete selected items
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    deleteMediaMutation.mutate(selectedItems);
  };

  // Handle rename item
  const handleOpenRenameDialog = (item: MediaItem) => {
    setRenameItemId(item.id);
    setNewName(item.name);
    setIsRenameDialogOpen(true);
  };

  // Handle submit rename
  const handleRename = () => {
    if (!renameItemId || !newName.trim()) return;
    renameMediaMutation.mutate({ id: renameItemId, name: newName.trim() });
  };

  // Handle create folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(newFolderName.trim());
  };

  // Handle navigate to folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentFolder(folderPath);
    setSelectedItems([]);
  };

  // Handle navigate to parent folder
  const navigateToParentFolder = () => {
    if (currentFolder === "/") return;
    
    const parts = currentFolder.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.length ? `/${parts.join('/')}` : "/";
    
    navigateToFolder(parentPath);
  };

  // Handle copy path to clipboard
  const copyPathToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    toast({
      title: "Path copied",
      description: "Path has been copied to clipboard.",
    });
  };

  // Handle view item details
  const viewItemDetails = (item: MediaItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  // Generate breadcrumb from current folder path
  const getBreadcrumbs = () => {
    const parts = currentFolder.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-4 overflow-x-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="px-2"
          onClick={() => navigateToFolder("/")}
        >
          <Folder className="h-4 w-4 mr-1" />
          Root
        </Button>
        
        {parts.map((part, index) => {
          const path = `/${parts.slice(0, index + 1).join('/')}`;
          return (
            <div key={path} className="flex items-center">
              <span className="mx-2">/</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-2"
                onClick={() => navigateToFolder(path)}
              >
                {part}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Filter and sort media items based on current filters
  const filteredItems = mediaItems || [];

  // Loading state
  if (isLoadingMedia && isLoadingFolders) {
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
            <CardTitle>Media Manager</CardTitle>
            <CardDescription>Upload and manage media files</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsCreateFolderDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div 
                    {...getRootProps()} 
                    className="w-full py-2 cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2" />
                      <span>Upload Images</span>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div 
                    {...getRootProps()} 
                    className="w-full py-2 cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <span>Upload Documents</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedItems.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedItems.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the selected {selectedItems.length} item(s).
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteSelected}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Breadcrumb navigation */}
        {getBreadcrumbs()}
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FilterType)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Upload dropzone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="text-lg font-medium">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-sm text-muted-foreground">
              or click to browse your device
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Max file size: 10MB
            </p>
          </div>
        </div>
        
        {/* Folders */}
        {folders && folders.length > 0 && (
          <>
            <h3 className="text-lg font-medium mb-3">Folders</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {currentFolder !== "/" && (
                <div 
                  className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={navigateToParentFolder}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium truncate w-full text-center">
                    ..
                  </span>
                </div>
              )}
              
              {folders.map(folder => (
                <div 
                  key={folder.id}
                  className="border rounded-lg p-4 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors relative group"
                >
                  <button
                    onClick={() => navigateToFolder(folder.path)}
                    className="absolute inset-0 z-10"
                    aria-label={`Open folder ${folder.name}`}
                  ></button>
                  
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-2">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium truncate w-full text-center">
                    {folder.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {folder.itemCount} item{folder.itemCount !== 1 ? 's' : ''}
                  </span>
                  
                  <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyPathToClipboard(folder.path)}>
                          <Copy className="h-4 w-4 mr-2" />
                          <span>Copy Path</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"? This will delete all files inside.`)) {
                              deleteFolderMutation.mutate(folder.id);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
          </>
        )}
        
        {/* Files */}
        <h3 className="text-lg font-medium mb-3">Files</h3>
        
        {filteredItems.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No files found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? "No files match your search criteria"
                  : "Upload files to get started"}
              </p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className={`border rounded-lg overflow-hidden flex flex-col relative group ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                {/* Preview */}
                <div 
                  className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden"
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {item.type === "image" ? (
                    <img 
                      src={item.url} 
                      alt={item.alt || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <File className="h-10 w-10 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-2 uppercase">
                        {item.fileName.split('.').pop()}
                      </span>
                    </div>
                  )}
                  
                  {/* Selection indicator */}
                  <div className={`absolute top-2 left-2 h-5 w-5 rounded-full border ${
                    selectedItems.includes(item.id)
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground'
                  }`}>
                    {selectedItems.includes(item.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-1">
                    <span>{(item.size / 1024).toFixed(1)} KB</span>
                    <Badge variant="outline" className="h-5 text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewItemDetails(item)}>
                        <Image className="h-4 w-4 mr-2" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenRenameDialog(item)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyPathToClipboard(item.url)}>
                        <Copy className="h-4 w-4 mr-2" />
                        <span>Copy URL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a 
                          href={item.url} 
                          download 
                          className="flex items-center w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span>Download</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this item?')) {
                            deleteMediaMutation.mutate([item.id]);
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium text-sm w-0">
                    {/* Selection checkbox */}
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Name</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Size</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Modified</th>
                  <th className="py-3 px-4 text-left font-medium text-sm w-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr 
                    key={item.id} 
                    className={`border-t hover:bg-muted/20 ${
                      selectedItems.includes(item.id) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div 
                        className={`h-5 w-5 rounded-full border cursor-pointer ${
                          selectedItems.includes(item.id)
                            ? 'bg-primary border-primary'
                            : 'bg-background border-muted-foreground'
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        {selectedItems.includes(item.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.type === "image" ? (
                          <div className="h-8 w-8 rounded bg-muted overflow-hidden">
                            <img 
                              src={item.url} 
                              alt={item.alt || item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            <File className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{item.type}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {(item.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewItemDetails(item)}>
                            <Image className="h-4 w-4 mr-2" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenRenameDialog(item)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyPathToClipboard(item.url)}>
                            <Copy className="h-4 w-4 mr-2" />
                            <span>Copy URL</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <a 
                              href={item.url} 
                              download 
                              className="flex items-center w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              <span>Download</span>
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this item?')) {
                                deleteMediaMutation.mutate([item.id]);
                              }
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      
      {/* Rename dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
            <DialogDescription>
              Enter a new name for this item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleRename}
              disabled={!newName.trim() || renameMediaMutation.isPending}
            >
              {renameMediaMutation.isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create folder dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-name" className="text-right">
                Folder Name
              </Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateFolderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File details dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/20 rounded-lg flex items-center justify-center p-4">
                {selectedItem.type === "image" ? (
                  <img 
                    src={selectedItem.url} 
                    alt={selectedItem.alt || selectedItem.name}
                    className="max-w-full max-h-[280px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <File className="h-16 w-16 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2 uppercase">
                      {selectedItem.fileName.split('.').pop()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.fileName}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{selectedItem.mimeType}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{(selectedItem.size / 1024).toFixed(1)} KB</span>
                  </div>
                  
                  {selectedItem.dimensions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{selectedItem.dimensions.width} × {selectedItem.dimensions.height}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right">{selectedItem.folder}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span>{new Date(selectedItem.createdAt).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last modified:</span>
                    <span>{new Date(selectedItem.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Input 
                    value={selectedItem.url}
                    readOnly
                    onClick={(e) => {
                      e.currentTarget.select();
                      copyPathToClipboard(selectedItem.url);
                    }}
                    className="font-mono text-xs"
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPathToClipboard(selectedItem.url)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={selectedItem.url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default MediaManager;