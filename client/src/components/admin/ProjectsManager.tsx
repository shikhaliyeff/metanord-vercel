import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  Globe, 
  CalendarIcon, 
  MapPin, 
  FileText,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

// UI Components
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTable } from '@/components/ui/responsive-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from '@/components/ui/checkbox';

// Types
interface Project {
  id: number;
  title: string;
  language: string;
  slug: string;
  description: string;
  summary: string;
  location: string;
  year: number;
  published: boolean;
  productTags: string[];
  images: {
    main: string;
    gallery: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Form schema
const projectSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  language: z.string().min(2, { message: 'Please select a language' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters long' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters long' }),
  location: z.string().min(2, { message: 'Location is required' }),
  year: z.coerce.number().min(1900, { message: 'Year must be at least 1900' })
    .max(new Date().getFullYear() + 5, { message: 'Year cannot be too far in the future' }),
  published: z.boolean().default(false),
  productTags: z.array(z.string()).optional().default([]),
  mainImage: z.string().url({ message: 'Please enter a valid URL for the main image' }),
  galleryImages: z.array(z.string().url({ message: 'Please enter valid URLs for gallery images' })).optional().default([]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectsManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isViewProjectOpen, setIsViewProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');

  // Initial form for creating/adding a project
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      language: 'en',
      slug: '',
      description: '',
      summary: '',
      location: '',
      year: new Date().getFullYear(),
      published: false,
      productTags: [],
      mainImage: '',
      galleryImages: [],
    },
  });

  // Edit form for updating a project
  const editForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      language: 'en',
      slug: '',
      description: '',
      summary: '',
      location: '',
      year: new Date().getFullYear(),
      published: false,
      productTags: [],
      mainImage: '',
      galleryImages: [],
    },
  });

  // Fetch all projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects', languageFilter],
    queryFn: async () => {
      const url = languageFilter === 'all' 
        ? '/api/projects' 
        : `/api/projects?language=${languageFilter}`;
      const res = await apiRequest('GET', url);
      const data = await res.json();
      return data as Project[];
    },
  });

  // Add new project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      // Transform the form values to match API expectations
      const projectData = {
        ...values,
        images: {
          main: values.mainImage,
          gallery: values.galleryImages,
        },
      };
      // Remove the fields that aren't in the API schema
      delete (projectData as any).mainImage;
      delete (projectData as any).galleryImages;

      const res = await apiRequest('POST', '/api/admin/projects', projectData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create project');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Project has been created successfully',
      });
      setIsAddProjectOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Edit project mutation
  const editProjectMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: ProjectFormValues }) => {
      // Transform the form values to match API expectations
      const projectData = {
        ...values,
        images: {
          main: values.mainImage,
          gallery: values.galleryImages,
        },
      };
      // Remove the fields that aren't in the API schema
      delete (projectData as any).mainImage;
      delete (projectData as any).galleryImages;

      const res = await apiRequest('PATCH', `/api/admin/projects/${id}`, projectData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update project');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Project has been updated successfully',
      });
      setIsEditProjectOpen(false);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/projects/${id}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete project');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Project has been deleted successfully',
      });
      setIsDeleteProjectOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle submit for adding a new project
  const onSubmit = (values: ProjectFormValues) => {
    addProjectMutation.mutate(values);
  };

  // Handle submit for editing a project
  const onEditSubmit = (values: ProjectFormValues) => {
    if (!selectedProject) return;
    editProjectMutation.mutate({ id: selectedProject.id, values });
  };

  // Handle delete a project
  const onDeleteProject = () => {
    if (!selectedProject) return;
    deleteProjectMutation.mutate(selectedProject.id);
  };

  // Function to open edit dialog and populate form
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    editForm.reset({
      title: project.title,
      language: project.language,
      slug: project.slug,
      description: project.description,
      summary: project.summary,
      location: project.location,
      year: project.year,
      published: project.published,
      productTags: project.productTags || [],
      mainImage: project.images.main,
      galleryImages: project.images.gallery || [],
    });
    setIsEditProjectOpen(true);
  };

  // Function to open delete dialog
  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteProjectOpen(true);
  };

  // Function to view project details
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsViewProjectOpen(true);
  };

  // Helper function to add a gallery image
  const addGalleryImage = () => {
    if (!galleryImageUrl.trim()) return;
    
    // Check if we're in edit mode
    if (isEditProjectOpen) {
      const currentImages = editForm.getValues().galleryImages || [];
      editForm.setValue('galleryImages', [...currentImages, galleryImageUrl]);
    } else {
      const currentImages = form.getValues().galleryImages || [];
      form.setValue('galleryImages', [...currentImages, galleryImageUrl]);
    }
    
    setGalleryImageUrl('');
  };

  // Helper function to remove a gallery image
  const removeGalleryImage = (index: number) => {
    // Check if we're in edit mode
    if (isEditProjectOpen) {
      const currentImages = editForm.getValues().galleryImages || [];
      editForm.setValue('galleryImages', currentImages.filter((_, i) => i !== index));
    } else {
      const currentImages = form.getValues().galleryImages || [];
      form.setValue('galleryImages', currentImages.filter((_, i) => i !== index));
    }
  };

  // Function to generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Get filtered projects based on the active tab
  const getFilteredProjects = () => {
    if (!projects) return [];
    
    switch (activeTab) {
      case 'published':
        return projects.filter(project => project.published);
      case 'draft':
        return projects.filter(project => !project.published);
      default:
        return projects;
    }
  };

  // Get language badge
  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'en':
        return <Badge className="bg-blue-500">English</Badge>;
      case 'et':
        return <Badge className="bg-blue-700">Estonian</Badge>;
      case 'ru':
        return <Badge className="bg-red-700">Russian</Badge>;
      case 'lv':
        return <Badge className="bg-red-600">Latvian</Badge>;
      case 'lt':
        return <Badge className="bg-yellow-600">Lithuanian</Badge>;
      case 'pl':
        return <Badge className="bg-red-500">Polish</Badge>;
      default:
        return <Badge>{language}</Badge>;
    }
  };

  const filteredProjects = getFilteredProjects();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Projects Management</span>
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Create a new featured project or case study to showcase on the website.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Project Title" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-generate slug if title changes
                                const newSlug = generateSlug(e.target.value);
                                form.setValue('slug', newSlug);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="project-url-slug" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="2023" 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Tallinn, Estonia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the project" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary shown in project listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed project description" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Main image for the project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Gallery Images</FormLabel>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Image URL" 
                        value={galleryImageUrl}
                        onChange={(e) => setGalleryImageUrl(e.target.value)}
                      />
                      <Button type="button" onClick={addGalleryImage}>Add</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {form.watch('galleryImages')?.map((url, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-xs truncate max-w-[200px]">{url}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeGalleryImage(i)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this project visible on the website
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={addProjectMutation.isPending}>
                      {addProjectMutation.isPending && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage featured projects and case studies. Create, edit, and publish project content across multiple languages.
        </CardDescription>
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select
            value={languageFilter}
            onValueChange={setLanguageFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by language" />
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
      </CardHeader>
      <CardContent>
        <CardTable
          data={filteredProjects}
          columns={[
            {
              header: "Title",
              accessor: "title",
              isMobileTitle: true,
              className: "font-medium",
            },
            {
              header: "Language",
              accessor: "language",
              cell: (project) => getLanguageBadge(project.language),
              isVisibleOnMobile: true,
              labelInMobile: "Language"
            },
            {
              header: "Location",
              accessor: "location",
              isVisibleOnMobile: true,
              labelInMobile: "Location"
            },
            {
              header: "Year",
              accessor: "year",
              isVisibleOnMobile: true,
              labelInMobile: "Year"
            },
            {
              header: "Status",
              accessor: "published",
              cell: (project) => project.published ? (
                <Badge variant="default" className="bg-green-500">Published</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              ),
              isVisibleOnMobile: true,
              labelInMobile: "Status"
            },
            {
              header: "Actions",
              accessor: "actions",
              cell: (project) => (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
              className: "text-right",
              isVisibleOnMobile: true,
              labelInMobile: "Actions"
            }
          ]}
          keyField="id"
          isLoading={isLoading}
          loadingState={
            <div className="flex justify-center py-10">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          }
          emptyState={
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first project.
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsAddProjectOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          }
          onRowClick={handleViewProject}
        />
        
        {/* Edit Project Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update this project's information and content.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Project Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="project-url-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={editForm.control}
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
                    control={editForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="2023" 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Tallinn, Estonia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief summary of the project" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary shown in project listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed project description" 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Main image for the project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Gallery Images</FormLabel>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Image URL" 
                      value={galleryImageUrl}
                      onChange={(e) => setGalleryImageUrl(e.target.value)}
                    />
                    <Button type="button" onClick={addGalleryImage}>Add</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {editForm.watch('galleryImages')?.map((url, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-xs truncate max-w-[200px]">{url}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeGalleryImage(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={editForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Published
                        </FormLabel>
                        <FormDescription>
                          Make this project visible on the website
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={editProjectMutation.isPending}>
                    {editProjectMutation.isPending && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Update Project
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Project Dialog */}
        <Dialog open={isDeleteProjectOpen} onOpenChange={setIsDeleteProjectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteProjectOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={onDeleteProject}
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Project Dialog */}
        <Dialog open={isViewProjectOpen} onOpenChange={setIsViewProjectOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProject && getLanguageBadge(selectedProject.language)}
                  {selectedProject?.published ? (
                    <Badge variant="default" className="bg-green-500">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{selectedProject?.year}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{selectedProject?.location}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  <span>/{selectedProject?.slug}</span>
                </div>
              </div>
              
              {selectedProject?.images?.main && (
                <div className="rounded-md overflow-hidden border">
                  <img 
                    src={selectedProject.images.main} 
                    alt={selectedProject.title}
                    className="w-full h-[300px] object-cover"
                  />
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-lg">Summary</h3>
                <p className="mt-2 text-muted-foreground">{selectedProject?.summary}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg">Description</h3>
                <div className="mt-2 text-muted-foreground whitespace-pre-line">
                  {selectedProject?.description}
                </div>
              </div>
              
              {selectedProject?.images?.gallery && selectedProject.images.gallery.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Gallery Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedProject.images.gallery.map((url, i) => (
                      <div key={i} className="rounded-md overflow-hidden border h-[150px]">
                        <img 
                          src={url} 
                          alt={`Gallery image ${i+1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewProjectOpen(false);
                    handleEditProject(selectedProject!);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {selectedProject && (
                  <Button
                    variant={selectedProject.published ? "destructive" : "default"}
                    onClick={() => {
                      if (!selectedProject) return;
                      editProjectMutation.mutate({
                        id: selectedProject.id,
                        values: {
                          ...editForm.getValues(),
                          published: !selectedProject.published,
                        },
                      });
                      setIsViewProjectOpen(false);
                    }}
                  >
                    {selectedProject.published ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}