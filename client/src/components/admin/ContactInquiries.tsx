import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Archive,
  CheckCircle, 
  ChevronDown, 
  Clock, 
  Download,
  ExternalLink, 
  Filter, 
  Inbox, 
  Loader2, 
  Mail, 
  RefreshCw, 
  Search,
  User as UserIcon, 
  XCircle,
  FileDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the contact inquiry status types
type InquiryStatus = "new" | "read" | "replied" | "archived";

// Contact inquiry interface
interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  archived?: boolean;
  createdAt: string;
  company?: string;
  inquiryType?: string;
}

export function ContactInquiries() {
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewInquiry, setViewInquiry] = useState<ContactInquiry | null>(null);
  const [showArchivedItems, setShowArchivedItems] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('csv');
  const { toast } = useToast();
  
  // Significantly enhanced contact inquiries fetching with comprehensive error handling
  const { data: inquiries, isLoading, refetch, error: inquiriesError } = useQuery({
    queryKey: ["/api/admin/contact", { archived: showArchivedItems, status: filterStatus }],
    queryFn: async ({ queryKey }) => {
      try {
        // Safely extract filters from query key as an object
        const filters = queryKey[1] as { archived: boolean; status: string };
        const params = new URLSearchParams();
        
        // Add filters to query parameters
        if (filters.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        if (filters.archived) {
          params.append('archived', 'true');
        }
        
        const queryString = params.toString();
        const url = `/api/admin/contact${queryString ? `?${queryString}` : ''}`;
        
        console.log("Fetching contact inquiries from:", url);
        
        // Enhanced fetch request with additional headers and options
        const res = await fetch(url, {
          method: "GET",
          credentials: "include", // Critical for auth
          cache: "no-store", // Prevent caching
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest" // Helps with CORS
          }
        });
        
        console.log("Contact inquiries response status:", res.status);
        
        // Handle response errors with detailed messaging
        if (!res.ok) {
          if (res.status === 401) {
            console.error("Authentication error: Session invalid or expired");
            throw new Error("Please log in again to view contact inquiries");
          }
          
          if (res.status === 403) {
            console.error("Authorization error: Insufficient permissions");
            throw new Error("You don't have permission to view contact inquiries");
          }
          
          // Try to parse error details from response
          try {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to load inquiries (${res.status})`);
          } catch (parseError) {
            throw new Error(`Request failed with status: ${res.status}`);
          }
        }
        
        // Parse successful response
        const data = await res.json();
        console.log(`Retrieved ${data.length} contact inquiries`);
        
        // Return empty array instead of null/undefined for better component stability
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Contact inquiries fetch error:", error);
        throw error;
      }
    },
    staleTime: 15000, // Consider data fresh for 15 seconds
    retry: 3, // Retry failed requests three times
    refetchOnWindowFocus: true // Refresh when window regains focus
  });
  
  // Handle query errors
  useEffect(() => {
    if (inquiriesError) {
      console.error("Contact inquiries error:", inquiriesError);
      toast({
        title: "Error loading contact inquiries",
        description: inquiriesError.message,
        variant: "destructive"
      });
    }
  }, [inquiriesError, toast]);
  
  // Update inquiry status mutation
  const updateInquiryStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: InquiryStatus }) => {
      const res = await apiRequest("POST", `/api/admin/contact/${id}/status`, { status });
      if (!res.ok) throw new Error("Failed to update inquiry status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      toast({
        title: "Success",
        description: "Inquiry status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update inquiry status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Archive/Unarchive inquiry mutation
  const archiveInquiryMutation = useMutation({
    mutationFn: async ({ id, archived }: { id: number, archived: boolean }) => {
      const res = await apiRequest("POST", `/api/admin/contact/${id}/archive`, { archived });
      if (!res.ok) throw new Error(`Failed to ${archived ? 'archive' : 'unarchive'} inquiry`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact"] });
      toast({
        title: "Success",
        description: `Inquiry ${variables.archived ? 'archived' : 'unarchived'} successfully`,
      });
    },
    onError: (error: Error, variables) => {
      toast({
        title: "Error",
        description: `Failed to ${variables.archived ? 'archive' : 'unarchive'} inquiry: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Export inquiries mutation
  const exportInquiriesMutation = useMutation({
    mutationFn: async ({ format, filters }: { format: 'json' | 'csv', filters?: { status?: string; archived?: boolean } }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters) {
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.archived !== undefined) queryParams.append('archived', filters.archived.toString());
      }
      
      const res = await fetch(`/api/admin/contact/export?${queryParams.toString()}`, {
        credentials: "include" // Include credentials (cookies) with the request
      });
      if (!res.ok) throw new Error("Failed to export inquiries");
      
      // Get the export data as text
      const data = await res.text();
      
      // Create and download file
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `contact_inquiries.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Contact inquiries exported successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export Failed",
        description: `Failed to export inquiries: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle status change
  const handleStatusChange = async (id: number, status: InquiryStatus) => {
    await updateInquiryStatusMutation.mutateAsync({ id, status });
    
    // If currently viewing this inquiry, update the status in the view
    if (viewInquiry && viewInquiry.id === id) {
      setViewInquiry({ ...viewInquiry, status });
    }
  };
  
  // Handle viewing an inquiry (also mark as read if new)
  const handleViewInquiry = async (inquiry: ContactInquiry) => {
    setViewInquiry(inquiry);
    
    // If the inquiry is new, automatically mark it as read
    if (inquiry.status === "new") {
      await handleStatusChange(inquiry.id, "read");
    }
  };
  
  // Handle archive/unarchive
  const handleArchiveToggle = async (id: number, currentlyArchived: boolean = false) => {
    await archiveInquiryMutation.mutateAsync({ id, archived: !currentlyArchived });
    
    // If currently viewing this inquiry, update the archived status in the view
    if (viewInquiry && viewInquiry.id === id) {
      setViewInquiry({ ...viewInquiry, archived: !currentlyArchived });
    }
  };
  
  // Handle export
  const handleExport = async () => {
    const filters: { status?: string; archived?: boolean } = {
      status: filterStatus !== "all" ? filterStatus : undefined,
      archived: showArchivedItems
    };
    
    await exportInquiriesMutation.mutateAsync({
      format: exportFormat,
      filters
    });
  };
  
  // Filter and search inquiries
  const filteredInquiries = inquiries ? inquiries.filter((inquiry: ContactInquiry) => {
    // Apply status filter
    if (filterStatus !== "all" && inquiry.status !== filterStatus) {
      return false;
    }
    
    // Apply archived filter
    if (inquiry.archived !== showArchivedItems) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];
  
  // Calculate counts
  const statusCounts = inquiries ? {
    all: inquiries.length,
    new: inquiries.filter((i: ContactInquiry) => i.status === "new").length,
    read: inquiries.filter((i: ContactInquiry) => i.status === "read").length,
    replied: inquiries.filter((i: ContactInquiry) => i.status === "replied").length,
    archived: inquiries.filter((i: ContactInquiry) => i.status === "archived").length,
  } : { all: 0, new: 0, read: 0, replied: 0, archived: 0 };
  
  // Get status badge styling
  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            New
          </Badge>
        );
      case "read":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Read
          </Badge>
        );
      case "replied":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            <Mail className="h-3 w-3 mr-1" />
            Replied
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-slate-400 border-slate-400">
            <XCircle className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        );
    }
  };
  
  // Format date and time
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Inbox className="h-5 w-5 mr-2 text-primary" />
              Contact Inquiries
            </CardTitle>
            <CardDescription className="mt-1.5">
              Manage and respond to contact form submissions
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inquiries..."
                className="pl-9 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button 
              variant={showArchivedItems ? "default" : "outline"} 
              onClick={() => setShowArchivedItems(!showArchivedItems)}
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchivedItems ? "Viewing Archived" : "View Archived"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Inquiries</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setExportFormat('csv');
                    handleExport();
                  }}
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setExportFormat('json');
                    handleExport();
                  }}
                >
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterStatus === "all" ? "All inquiries" : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} inquiries`}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={filterStatus === "all" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("all")}
                >
                  All inquiries
                  <Badge variant="outline" className="ml-auto">{statusCounts.all}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "new" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("new")}
                >
                  New
                  <Badge variant="default" className="ml-auto bg-blue-500">{statusCounts.new}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "read" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("read")}
                >
                  Read
                  <Badge variant="outline" className="ml-auto">{statusCounts.read}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "replied" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("replied")}
                >
                  Replied
                  <Badge variant="outline" className="ml-auto">{statusCounts.replied}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "archived" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("archived")}
                >
                  Archived
                  <Badge variant="outline" className="ml-auto">{statusCounts.archived}</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {inquiries && inquiries.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry: ContactInquiry) => (
                    <TableRow key={inquiry.id} className={inquiry.status === "new" ? "bg-blue-50" : ""}>
                      <TableCell className="font-medium">{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell className="max-w-[250px] truncate">{inquiry.subject}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(inquiry.createdAt)}
                      </TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No matching inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-md border flex flex-col items-center justify-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No contact inquiries yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Contact form submissions will appear here
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Inquiry Detail Dialog */}
      <Dialog open={!!viewInquiry} onOpenChange={(open) => !open && setViewInquiry(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Inquiry</DialogTitle>
            <DialogDescription>
              Received on {viewInquiry && formatDateTime(viewInquiry.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewInquiry && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{viewInquiry.name}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${viewInquiry.email}`} 
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {viewInquiry.email}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div>
                  {getStatusBadge(viewInquiry.status)}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Subject</h3>
                <p className="mt-1">{viewInquiry.subject}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium">Message</h3>
                <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {viewInquiry.message}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Set Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => viewInquiry && handleStatusChange(viewInquiry.id, "new")}
                  disabled={viewInquiry?.status === "new"}
                >
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Mark as New
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => viewInquiry && handleStatusChange(viewInquiry.id, "read")}
                  disabled={viewInquiry?.status === "read"}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => viewInquiry && handleStatusChange(viewInquiry.id, "replied")}
                  disabled={viewInquiry?.status === "replied"}
                >
                  <Mail className="h-4 w-4 mr-2 text-green-500" />
                  Mark as Replied
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => viewInquiry && handleArchiveToggle(viewInquiry.id, viewInquiry.archived)}
                  className={viewInquiry?.archived ? "text-green-500 focus:text-green-500" : "text-red-500 focus:text-red-500"}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {viewInquiry?.archived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewInquiry(null)}
              >
                Close
              </Button>
              <Button 
                onClick={() => viewInquiry && window.open(`mailto:${viewInquiry.email}?subject=Re: ${viewInquiry.subject}`, '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}