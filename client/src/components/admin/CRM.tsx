import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistance } from "date-fns";

// Icons
import {
  UserPlus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  Mail,
  Calendar,
  PhoneCall,
  MapPin,
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  MailPlus,
  Eye,
  HistoryIcon,
  Save
} from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ResponsiveTable, type Column } from "@/components/ui/responsive-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the types
interface CrmClient {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  country: string | null;
  leadStatus: string;
  originalInquiryId: number | null;
  productsInterested: string[];
  lastActivity: string | null;
  nextFollowup: Date | null;
  createdAt: Date;
  updatedAt: Date;
  internalNotes: string | null;
}

interface CrmActivityLog {
  id: number;
  clientId: number;
  activityType: string;
  description: string;
  performedBy: number | null;
  data: any;
  createdAt: Date;
}

interface CrmEmailLog {
  id: number;
  clientId: number;
  subject: string;
  content: string;
  status: string;
  sentBy: number | null;
  sentAt: Date;
}

interface CrmEmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Client form schema
const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  leadStatus: z.string().default("new"),
  productsInterested: z.array(z.string()).optional().default([]),
  nextFollowup: z.date().nullable().optional(),
  internalNotes: z.string().nullable().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// Activity form schema
const activityFormSchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  description: z.string().min(1, "Description is required"),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

// Email form schema
const emailFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

// Template form schema
const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

// Filter types
interface ClientFilters {
  name?: string;
  company?: string;
  country?: string;
  productRef?: string;
  leadStatus?: string;
}

// Lead status options
const leadStatusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed-won", label: "Closed Won" },
  { value: "closed-lost", label: "Closed Lost" }
];

// Activity types
const activityTypes = [
  { value: "call", label: "Phone Call" },
  { value: "meeting", label: "Meeting" },
  { value: "email", label: "Email" },
  { value: "note", label: "Note" },
  { value: "task", label: "Task" }
];

export function CRM() {
  const [activeTab, setActiveTab] = useState("clients");
  const [selectedClient, setSelectedClient] = useState<CrmClient | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ClientFilters>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [isNewEmailOpen, setIsNewEmailOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CrmEmailTemplate | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset details panel when tab changes
  useEffect(() => {
    setSelectedClient(null);
    setIsDetailsOpen(false);
  }, [activeTab]);

  // Client form
  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      country: "",
      leadStatus: "new",
      productsInterested: [],
      nextFollowup: null,
      internalNotes: ""
    }
  });

  // Activity form
  const activityForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityType: "note",
      description: ""
    }
  });

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      subject: "",
      content: ""
    }
  });

  // Template form
  const templateForm = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: ""
    }
  });

  // Queries and mutations
  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ['/api/admin/crm/clients', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.productRef) queryParams.append('productRef', filters.productRef);
      if (filters.leadStatus) queryParams.append('leadStatus', filters.leadStatus);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await apiRequest('GET', `/api/admin/crm/clients${query}`);
      return await response.json();
    }
  });

  const { data: emailTemplates, isLoading: isTemplatesLoading } = useQuery({
    queryKey: ['/api/admin/crm/email-templates'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/crm/email-templates');
      return await response.json();
    },
    enabled: isTemplatesOpen
  });

  const { data: activityLogs, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['/api/admin/crm/clients', selectedClient?.id, 'activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/crm/clients/${selectedClient?.id}/activities`);
      return await response.json();
    },
    enabled: !!selectedClient
  });

  const { data: emailLogs, isLoading: isEmailsLoading } = useQuery({
    queryKey: ['/api/admin/crm/clients', selectedClient?.id, 'emails'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/crm/clients/${selectedClient?.id}/emails`);
      return await response.json();
    },
    enabled: !!selectedClient
  });

  // Mutations
  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await apiRequest('POST', '/api/admin/crm/clients', data);
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      setIsNewClientOpen(false);
      clientForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/clients'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create client",
        variant: "destructive"
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: async (data: { id: number; client: Partial<ClientFormValues> }) => {
      const response = await apiRequest('PUT', `/api/admin/crm/clients/${data.id}`, data.client);
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      setSelectedClient(data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/clients'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive"
      });
    }
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/crm/clients/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
      setSelectedClient(null);
      setIsDetailsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/clients'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client",
        variant: "destructive"
      });
    }
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: { clientId: number; activity: ActivityFormValues }) => {
      const response = await apiRequest('POST', `/api/admin/crm/clients/${data.clientId}/activities`, data.activity);
      if (!response.ok) {
        throw new Error('Failed to create activity');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Activity added successfully",
      });
      setIsNewActivityOpen(false);
      activityForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/clients', selectedClient?.id, 'activities'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add activity",
        variant: "destructive"
      });
    }
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: { clientId: number; email: EmailFormValues }) => {
      const response = await apiRequest('POST', `/api/admin/crm/clients/${data.clientId}/emails`, data.email);
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email sent successfully",
      });
      setIsNewEmailOpen(false);
      emailForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/clients', selectedClient?.id, 'emails'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      const response = await apiRequest('POST', '/api/admin/crm/email-templates', data);
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      templateForm.reset();
      setSelectedTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/email-templates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive"
      });
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async (data: { id: number; template: Partial<TemplateFormValues> }) => {
      const response = await apiRequest('PUT', `/api/admin/crm/email-templates/${data.id}`, data.template);
      if (!response.ok) {
        throw new Error('Failed to update template');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
      templateForm.reset();
      setSelectedTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/email-templates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update template",
        variant: "destructive"
      });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/crm/email-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      setSelectedTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/crm/email-templates'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive"
      });
    }
  });

  // Event handlers
  const handleNewClient = (data: ClientFormValues) => {
    createClientMutation.mutate(data);
  };

  const handleUpdateClient = (data: ClientFormValues) => {
    if (selectedClient) {
      updateClientMutation.mutate({ id: selectedClient.id, client: data });
    }
  };

  const handleAddActivity = (data: ActivityFormValues) => {
    if (selectedClient) {
      createActivityMutation.mutate({ clientId: selectedClient.id, activity: data });
    }
  };

  const handleSendEmail = (data: EmailFormValues) => {
    if (selectedClient) {
      sendEmailMutation.mutate({ clientId: selectedClient.id, email: data });
    }
  };

  const handleSaveTemplate = (data: TemplateFormValues) => {
    if (selectedTemplate) {
      updateTemplateMutation.mutate({ id: selectedTemplate.id, template: data });
    } else {
      createTemplateMutation.mutate(data);
    }
  };

  const handleDeleteClient = () => {
    if (selectedClient && confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate(selectedClient.id);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleEditClient = (client: CrmClient) => {
    clientForm.reset({
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      country: client.country,
      leadStatus: client.leadStatus,
      productsInterested: client.productsInterested,
      nextFollowup: client.nextFollowup ? new Date(client.nextFollowup) : null,
      internalNotes: client.internalNotes
    });
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleEditTemplate = (template: CrmEmailTemplate) => {
    templateForm.reset({
      name: template.name,
      subject: template.subject,
      content: template.content
    });
    setSelectedTemplate(template);
  };

  const handleUseTemplate = (template: CrmEmailTemplate) => {
    emailForm.setValue('subject', template.subject);
    emailForm.setValue('content', template.content);
    setIsTemplatesOpen(false);
  };

  const handleNewTemplate = () => {
    templateForm.reset();
    setSelectedTemplate(null);
  };

  const handleFilterChange = (field: keyof ClientFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Render functions
  const renderClientBadge = (status: string) => {
    let variant = 'default';
    switch (status) {
      case 'new':
        variant = 'secondary';
        break;
      case 'contacted':
        variant = 'outline';
        break;
      case 'qualified':
        variant = 'default';
        break;
      case 'proposal':
        variant = 'primary';
        break;
      case 'negotiation':
        variant = 'default';
        break;
      case 'closed-won':
        variant = 'success';
        break;
      case 'closed-lost':
        variant = 'destructive';
        break;
    }
    
    // Capitalize the status
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    
    return <Badge variant={variant as any}>{displayStatus}</Badge>;
  };

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-amber-500" />;
      case 'note':
        return <Edit className="h-4 w-4 text-slate-500" />;
      case 'task':
        return <Clock className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl font-bold">Customer Relationship Management</h1>
          <TabsList className="grid w-full sm:w-80 grid-cols-2">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Search clients..." 
                className="w-full sm:w-60 md:w-80"
                value={filters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                <Filter className="h-4 w-4" />
              </Button>
              {Object.values(filters).some(v => v) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden sm:flex">
                  Clear filters
                </Button>
              )}
            </div>
            {Object.values(filters).some(v => v) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="sm:hidden ml-10">
                Clear filters
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Client</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the client's details below to add them to your CRM.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...clientForm}>
                    <form onSubmit={clientForm.handleSubmit(handleNewClient)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={clientForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Company name" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1234567890" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Country" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="leadStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lead Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {leadStatusOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={clientForm.control}
                        name="internalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Internal Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add any additional information about this client" 
                                className="min-h-[120px]"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit" disabled={clientForm.formState.isSubmitting}>
                          {clientForm.formState.isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                          Add Client
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isFiltersOpen && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      placeholder="Filter by company"
                      value={filters.company || ''}
                      onChange={(e) => handleFilterChange('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      placeholder="Filter by country"
                      value={filters.country || ''}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Lead Status</Label>
                    <Select
                      value={filters.leadStatus || 'any'}
                      onValueChange={(value) => handleFilterChange('leadStatus', value === 'any' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any status</SelectItem>
                        {leadStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Clients</CardTitle>
              <CardDescription>
                Manage your client relationships and track your leads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={clients || []}
                columns={[
                  {
                    header: "Name",
                    accessorKey: "name",
                    isMobileTitle: true,
                    className: "font-medium",
                  },
                  {
                    header: "Company",
                    accessorKey: "company",
                    cell: (client) => client.company || '-',
                    isVisibleOnMobile: true,
                    labelInMobile: "Company"
                  },
                  {
                    header: "Email",
                    accessorKey: "email",
                    isVisibleOnMobile: true,
                    labelInMobile: "Email"
                  },
                  {
                    header: "Country",
                    accessorKey: "country",
                    cell: (client) => client.country || '-',
                    isVisibleOnMobile: true,
                    labelInMobile: "Country"
                  },
                  {
                    header: "Status",
                    accessorKey: "leadStatus",
                    cell: (client) => renderClientBadge(client.leadStatus),
                    isVisibleOnMobile: true,
                    labelInMobile: "Status"
                  },
                  {
                    header: "Created",
                    accessorKey: "createdAt",
                    cell: (client) => format(new Date(client.createdAt), 'MMM d, yyyy'),
                    isVisibleOnMobile: true,
                    labelInMobile: "Created"
                  },
                  {
                    header: "Actions",
                    accessorKey: "actions",
                    cell: (client) => (
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClient(client);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                    className: "text-right",
                    isVisibleOnMobile: false // Hide in mobile as the entire row is clickable
                  }
                ]}
                caption="Client List"
                isLoading={isClientsLoading}
                loadingState={
                  <div className="flex justify-center py-4">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  </div>
                }
                emptyState={
                  <div className="text-center py-4">
                    No clients found. Add your first client to get started.
                  </div>
                }
                onRowClick={handleEditClient}
              />
            </CardContent>
          </Card>
          
          <Sheet 
            open={isDetailsOpen} 
            onOpenChange={setIsDetailsOpen}
          >
            <SheetContent 
              side="right" 
              className="w-full sm:w-[600px] md:w-[800px] lg:w-[900px] overflow-y-auto"
            >
              {selectedClient && (
                <>
                  <SheetHeader className="mb-6">
                    <div className="flex justify-between items-center">
                      <SheetTitle className="text-xl">{selectedClient.name}</SheetTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleDeleteClient}
                          title="Delete client"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <SheetDescription>
                      Client details and activity history
                    </SheetDescription>
                  </SheetHeader>
                  
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 overflow-x-auto">
                      <TabsTrigger value="details" className="px-2 sm:px-4">Details</TabsTrigger>
                      <TabsTrigger value="activities" className="px-2 sm:px-4">Activities</TabsTrigger>
                      <TabsTrigger value="emails" className="px-2 sm:px-4">Emails</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="py-4">
                      <Form {...clientForm}>
                        <form onSubmit={clientForm.handleSubmit(handleUpdateClient)} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={clientForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={clientForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={clientForm.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company</FormLabel>
                                  <FormControl>
                                    <Input {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={clientForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={clientForm.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input {...field} value={field.value || ''} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={clientForm.control}
                              name="leadStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lead Status</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {leadStatusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={clientForm.control}
                            name="internalNotes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Internal Notes</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    className="min-h-[120px]"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-0">
                            <Button 
                              type="submit" 
                              className="w-full sm:w-auto" 
                              disabled={clientForm.formState.isSubmitting}
                            >
                              {clientForm.formState.isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="activities" className="py-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Activity History</h3>
                        <Dialog open={isNewActivityOpen} onOpenChange={setIsNewActivityOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1">
                              <Plus className="h-4 w-4" />
                              <span className="hidden sm:inline">Add Activity</span>
                              <span className="sm:hidden">Add</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Add Activity</DialogTitle>
                              <DialogDescription>
                                Record a new activity for {selectedClient.name}
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...activityForm}>
                              <form onSubmit={activityForm.handleSubmit(handleAddActivity)} className="space-y-4">
                                <FormField
                                  control={activityForm.control}
                                  name="activityType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Activity Type</FormLabel>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select activity type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {activityTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                              {type.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={activityForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Describe the activity" 
                                          className="min-h-[120px]"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                  <Button 
                                    type="submit" 
                                    className="w-full sm:w-auto"
                                    disabled={activityForm.formState.isSubmitting}
                                  >
                                    {activityForm.formState.isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Activity
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        {isActivitiesLoading ? (
                          <div className="flex justify-center py-4">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          </div>
                        ) : activityLogs && activityLogs.length > 0 ? (
                          <div className="grid gap-4">
                            {activityLogs.map((activity: CrmActivityLog) => (
                              <Card key={activity.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      {renderActivityIcon(activity.activityType)}
                                      <CardTitle className="text-sm font-medium">
                                        {activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)}
                                      </CardTitle>
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                      {format(new Date(activity.createdAt), 'MMM d, yyyy • h:mm a')}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-2 px-4">
                                  <p className="text-sm whitespace-pre-wrap">{activity.description}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No activity records found.</p>
                            <p className="text-sm mt-1">Add an activity to keep track of your interactions.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="emails" className="py-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Email Communication</h3>
                        <div className="flex gap-2">
                          <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Templates</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Email Templates</DialogTitle>
                                <DialogDescription>
                                  Select a template to use for your email
                                </DialogDescription>
                              </DialogHeader>
                              
                              {isTemplatesLoading ? (
                                <div className="flex justify-center py-8">
                                  <RefreshCw className="h-6 w-6 animate-spin" />
                                </div>
                              ) : emailTemplates && emailTemplates.length > 0 ? (
                                <ScrollArea className="h-[350px]">
                                  <div className="space-y-3">
                                    {emailTemplates.map((template: CrmEmailTemplate) => (
                                      <Card key={template.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleUseTemplate(template)}>
                                        <CardHeader className="py-3">
                                          <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                                          <CardDescription>{template.subject}</CardDescription>
                                        </CardHeader>
                                      </Card>
                                    ))}
                                  </div>
                                </ScrollArea>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No email templates found.</p>
                                  <p className="text-sm mt-1">Create templates in the Templates tab.</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog open={isNewEmailOpen} onOpenChange={setIsNewEmailOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-1">
                                <MailPlus className="h-4 w-4" />
                                <span className="hidden sm:inline">Send Email</span>
                                <span className="sm:hidden">Email</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Send Email</DialogTitle>
                                <DialogDescription>
                                  Compose an email to send to {selectedClient.email}
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...emailForm}>
                                <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className="space-y-4">
                                  <FormField
                                    control={emailForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Email subject" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={emailForm.control}
                                    name="content"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Compose your email" 
                                            className="min-h-[200px]"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                    <Button 
                                      type="submit" 
                                      className="w-full sm:w-auto"
                                      disabled={emailForm.formState.isSubmitting}
                                    >
                                      {emailForm.formState.isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                      Send Email
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        {isEmailsLoading ? (
                          <div className="flex justify-center py-4">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          </div>
                        ) : emailLogs && emailLogs.length > 0 ? (
                          <div className="grid gap-4">
                            {emailLogs.map((email: CrmEmailLog) => (
                              <Card key={email.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <CardTitle className="text-sm font-medium">
                                      {email.subject}
                                    </CardTitle>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                      {format(new Date(email.sentAt), 'MMM d, yyyy • h:mm a')}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-2 px-4">
                                  <p className="text-sm whitespace-pre-wrap">{email.content}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No email communications found.</p>
                            <p className="text-sm mt-1">Send an email to establish communication.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold">Email Templates</h2>
            <Button className="gap-1 w-full sm:w-auto" onClick={handleNewTemplate}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Template</span>
              <span className="sm:hidden">Add Template</span>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="md:col-span-1 overflow-hidden">
              <CardHeader>
                <CardTitle>Template List</CardTitle>
                <CardDescription>
                  Save common emails as templates for quicker communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTemplatesLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : emailTemplates && emailTemplates.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {emailTemplates.map((template: CrmEmailTemplate) => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <CardHeader className="py-3 px-3 sm:px-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium truncate mr-2">{template.name}</CardTitle>
                            <div className="flex gap-1 sm:gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseTemplate(template);
                                }}
                                title="Use template"
                              >
                                <Mail className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTemplate(template.id);
                                }}
                                title="Delete template"
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="truncate">{template.subject}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No email templates found.</p>
                    <p className="text-sm mt-1">Create a template to streamline your communication.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>{selectedTemplate ? 'Edit Template' : 'Create Template'}</CardTitle>
                <CardDescription>
                  {selectedTemplate ? 'Modify the selected template' : 'Create a new email template'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...templateForm}>
                  <form onSubmit={templateForm.handleSubmit(handleSaveTemplate)} className="space-y-4">
                    <FormField
                      control={templateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., Welcome Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={templateForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Line</FormLabel>
                          <FormControl>
                            <Input placeholder="Email subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={templateForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Compose your template" 
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-0">
                      {selectedTemplate && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full sm:w-auto sm:mr-2"
                          onClick={handleNewTemplate}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        disabled={templateForm.formState.isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {templateForm.formState.isSubmitting && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                        {selectedTemplate ? 'Update' : 'Save'} Template
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}